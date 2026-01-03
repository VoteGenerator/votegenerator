// ============================================================================
// vg-get-customer.ts - Lookup customer by dashboard token or session ID
// Location: netlify/functions/vg-get-customer.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface CustomerData {
    email: string;
    tier: string;
    stripeSessionId?: string;
    stripeCustomerId?: string;
    dashboardToken: string;
    expiresAt: string;
    polls: string[];
    createdAt: string;
    updatedAt?: string;
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // Get params - support both formats
    const token = event.queryStringParameters?.token || event.queryStringParameters?.t;
    const sessionId = event.queryStringParameters?.session_id || event.queryStringParameters?.s;

    console.log('=== vg-get-customer called ===');
    console.log('Token param:', token ? token.substring(0, 8) + '...' : 'none');
    console.log('Session ID param:', sessionId ? sessionId.substring(0, 20) + '...' : 'none');

    if (!token && !sessionId) {
        console.log('ERROR: No token or session_id provided');
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing token or session_id parameter' }),
        };
    }

    try {
        const siteId = process.env.VG_SITE_ID;
        if (!siteId) {
            console.error('ERROR: VG_SITE_ID not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' }),
            };
        }

        const customerStore = getStore({
            name: 'vg-customers',
            siteID: siteId,
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        let customerData: CustomerData | null = null;

        // METHOD 1: Direct token lookup (fastest)
        if (token) {
            const tokenKey = `token_${token}`;
            console.log('Trying token lookup:', tokenKey);
            customerData = await customerStore.get(tokenKey, { type: 'json' }) as CustomerData | null;
            console.log('Token lookup result:', customerData ? 'FOUND' : 'NOT FOUND');
        }

        // METHOD 2: Session ID index lookup
        if (!customerData && sessionId) {
            const sessionKey = `session_${sessionId}`;
            console.log('Trying session index lookup:', sessionKey.substring(0, 30) + '...');
            customerData = await customerStore.get(sessionKey, { type: 'json' }) as CustomerData | null;
            console.log('Session index lookup result:', customerData ? 'FOUND' : 'NOT FOUND');
        }

        // METHOD 3: Scan all customers by stripeSessionId (slowest, but comprehensive)
        if (!customerData && sessionId) {
            console.log('Trying full scan for stripeSessionId...');
            const list = await customerStore.list();
            console.log('Total entries to scan:', list.blobs.length);
            
            for (const item of list.blobs) {
                // Skip index keys
                if (item.key.startsWith('token_') || item.key.startsWith('session_')) {
                    continue;
                }
                
                try {
                    const customer = await customerStore.get(item.key, { type: 'json' }) as CustomerData | null;
                    if (customer && customer.stripeSessionId === sessionId) {
                        console.log('FOUND by scan! Key:', item.key);
                        customerData = customer;
                        break;
                    }
                } catch (e) {
                    // Skip invalid entries
                }
            }
            
            if (!customerData) {
                console.log('Scan complete - NOT FOUND');
            }
        }

        // Not found
        if (!customerData) {
            console.log('=== Customer NOT FOUND ===');
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Customer not found' }),
            };
        }

        // Success!
        console.log('=== Customer FOUND ===');
        console.log('Email:', customerData.email?.substring(0, 5) + '...');
        console.log('Tier:', customerData.tier);
        console.log('Dashboard Token:', customerData.dashboardToken);
        console.log('Expires:', customerData.expiresAt);

        const isExpired = new Date(customerData.expiresAt) < new Date();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                tier: customerData.tier,
                expiresAt: customerData.expiresAt,
                polls: customerData.polls || [],
                createdAt: customerData.createdAt,
                email: customerData.email ? `${customerData.email.substring(0, 3)}...` : undefined,
                dashboardToken: customerData.dashboardToken,
                isExpired,
            }),
        };
    } catch (error) {
        console.error('=== ERROR ===', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
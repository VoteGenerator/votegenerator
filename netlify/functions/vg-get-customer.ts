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

    const token = event.queryStringParameters?.token;
    const sessionId = event.queryStringParameters?.session_id || event.queryStringParameters?.s;

    if (!token && !sessionId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing token or session_id parameter' }),
        };
    }

    try {
        const siteId = process.env.VG_SITE_ID;
        if (!siteId) {
            console.error('VG_SITE_ID not configured');
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

        // Try token lookup first (fastest - direct key lookup)
        if (token) {
            const tokenKey = `token_${token}`;
            customerData = await customerStore.get(tokenKey, { type: 'json' }) as CustomerData | null;
            console.log(`Token lookup for ${token.substring(0, 8)}...: ${customerData ? 'found' : 'not found'}`);
        }

        // Try session_id indexed lookup (second fastest)
        if (!customerData && sessionId) {
            const sessionKey = `session_${sessionId}`;
            console.log(`Session ID lookup: key=${sessionKey.substring(0, 30)}...`);
            
            // First try direct session lookup (new index)
            customerData = await customerStore.get(sessionKey, { type: 'json' }) as CustomerData | null;
            
            if (customerData) {
                console.log(`Found customer by session index! Token: ${customerData.dashboardToken?.substring(0, 8)}...`);
            } else {
                // Fallback: scan all customers (slower but comprehensive)
                console.log('Session index not found, scanning all customers...');
                const list = await customerStore.list();
                console.log(`Scanning ${list.blobs.length} entries...`);
                for (const key of list.blobs) {
                    // Skip token_ and session_ keys
                    if (key.key.startsWith('token_') || key.key.startsWith('session_')) continue;
                    
                    try {
                        const customer = await customerStore.get(key.key, { type: 'json' }) as CustomerData | null;
                        if (customer && customer.stripeSessionId === sessionId) {
                            customerData = customer;
                            console.log(`Found customer by session ID scan: ${customer.dashboardToken?.substring(0, 8)}...`);
                            break;
                        }
                    } catch (e) {
                        // Skip invalid entries
                    }
                }
            }
        }

        if (!customerData) {
            console.log(`Customer not found`);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Customer not found' }),
            };
        }

        // Check if expired
        const isExpired = new Date(customerData.expiresAt) < new Date();

        console.log(`Customer found: ${customerData.email?.substring(0, 5)}... tier: ${customerData.tier}, token: ${customerData.dashboardToken?.substring(0, 8)}...`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                tier: customerData.tier,
                expiresAt: customerData.expiresAt,
                polls: customerData.polls || [],
                createdAt: customerData.createdAt,
                email: customerData.email ? `${customerData.email.substring(0, 3)}...` : undefined,
                dashboardToken: customerData.dashboardToken, // Return token so client can use short URLs
                isExpired,
            }),
        };
    } catch (error) {
        console.error('Error fetching customer:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
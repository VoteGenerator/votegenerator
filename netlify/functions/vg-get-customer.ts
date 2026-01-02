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

        // Try token lookup first
        if (token) {
            const tokenKey = `token_${token}`;
            customerData = await customerStore.get(tokenKey, { type: 'json' }) as CustomerData | null;
            console.log(`Token lookup for ${token.substring(0, 8)}...: ${customerData ? 'found' : 'not found'}`);
        }

        // Fallback to session_id lookup (scan all customers)
        if (!customerData && sessionId) {
            console.log(`Session ID lookup for ${sessionId.substring(0, 20)}...`);
            
            // List all customers and find matching session ID
            const list = await customerStore.list();
            for (const key of list.blobs) {
                // Skip token_ keys
                if (key.key.startsWith('token_')) continue;
                
                try {
                    const customer = await customerStore.get(key.key, { type: 'json' }) as CustomerData | null;
                    if (customer && customer.stripeSessionId === sessionId) {
                        customerData = customer;
                        console.log(`Found customer by session ID: ${customer.email?.substring(0, 5)}...`);
                        break;
                    }
                } catch (e) {
                    // Skip invalid entries
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

        console.log(`Customer found: ${customerData.email?.substring(0, 5)}... tier: ${customerData.tier}, expired: ${isExpired}`);

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
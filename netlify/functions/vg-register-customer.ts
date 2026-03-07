// ============================================================================
// vg-register-customer.ts - Register customer from success page (backup for webhook)
// Location: netlify/functions/vg-register-customer.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { customAlphabet } from 'nanoid';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

// Generate short dashboard token
const generateDashboardToken = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_', 16);

interface CustomerData {
    email: string;
    tier: string;
    stripeSessionId: string;
    dashboardToken: string;
    expiresAt: string;
    polls: string[];
    createdAt: string;
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    console.log('>>> vg-register-customer called <<<');

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-register-customer: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server configuration error' }),
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { sessionId, tier, email } = body;

        console.log('vg-register-customer: Request body:', { sessionId: sessionId?.substring(0, 20), tier, email: email?.substring(0, 5) });
        console.log('vg-register-customer: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        if (!sessionId || !tier) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing sessionId or tier' }),
            };
        }

        const customerStore = getStore({
            name: 'vg-customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN,
        });

        // Check if customer already exists (webhook may have worked)
        const sessionKey = `session_${sessionId}`;
        const existing = await customerStore.get(sessionKey, { type: 'json' }) as CustomerData | null;
        
        if (existing && existing.dashboardToken) {
            console.log('vg-register-customer: Customer already exists, returning existing token');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    dashboardToken: existing.dashboardToken,
                    tier: existing.tier,
                    expiresAt: existing.expiresAt,
                    alreadyExisted: true,
                }),
            };
        }

        // Calculate expiry
        const days = tier === 'unlimited' ? 365 : 30;
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        
        // Generate new token
        const dashboardToken = generateDashboardToken();
        
        const customer: CustomerData = {
            email: email || 'unknown@checkout.com',
            tier,
            stripeSessionId: sessionId,
            dashboardToken,
            expiresAt,
            polls: [],
            createdAt: new Date().toISOString(),
        };

        // Save to all indices
        if (email) {
            await customerStore.setJSON(email.toLowerCase(), customer);
        }
        await customerStore.setJSON(`token_${dashboardToken}`, customer);
        await customerStore.setJSON(`session_${sessionId}`, customer);

        console.log('vg-register-customer: Customer registered successfully');
        console.log('vg-register-customer: Dashboard token:', dashboardToken);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                dashboardToken,
                tier,
                expiresAt,
                alreadyExisted: false,
            }),
        };
    } catch (error) {
        console.error('vg-register-customer: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
// ============================================================================
// vg-register-customer.ts - Register customer from success page (backup for webhook)
// Location: netlify/functions/vg-register-customer.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { customAlphabet } from 'nanoid';

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

    try {
        const body = JSON.parse(event.body || '{}');
        const { sessionId, tier, email } = body;

        console.log('Request body:', { sessionId: sessionId?.substring(0, 20), tier, email: email?.substring(0, 5) });

        if (!sessionId || !tier) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing sessionId or tier' }),
            };
        }

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

        // Check if customer already exists (webhook may have worked)
        const sessionKey = `session_${sessionId}`;
        const existing = await customerStore.get(sessionKey, { type: 'json' }) as CustomerData | null;
        
        if (existing && existing.dashboardToken) {
            console.log('Customer already exists, returning existing token');
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

        console.log('Customer registered successfully');
        console.log('Dashboard token:', dashboardToken);

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
        console.error('Error registering customer:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
// ============================================================================
// vg-register-customer.ts - Register customer after Stripe purchase
// Location: netlify/functions/vg-register-customer.ts
// Called from Stripe webhook to create customer record
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    stripeSessionId?: string;
    dashboardToken: string;
    polls: {
        id: string;
        adminKey: string;
        title: string;
        type: string;
        status: 'draft' | 'live';
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt?: string;
}

// Generate a unique dashboard token
const generateDashboardToken = (): string => {
    return crypto.randomBytes(12).toString('base64url');
};

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

    try {
        const { 
            email, 
            tier, 
            stripeCustomerId,
            stripeSessionId,
            dashboardToken: providedToken 
        } = JSON.parse(event.body || '{}');

        if (!email || !tier) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email and tier required' }),
            };
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' }),
            };
        }

        // Validate tier
        const validTiers = ['starter', 'pro_event', 'unlimited'];
        if (!validTiers.includes(tier)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid tier' }),
            };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const customerStore = getStore('customers');

        // Check if customer already exists
        let existingCustomer: CustomerRecord | null = null;
        try {
            existingCustomer = await customerStore.get(normalizedEmail, { type: 'json' }) as CustomerRecord | null;
        } catch {
            // Customer doesn't exist, that's fine
        }

        if (existingCustomer) {
            // Update existing customer's tier (upgrade scenario)
            existingCustomer.tier = tier;
            existingCustomer.updatedAt = new Date().toISOString();
            if (stripeCustomerId) existingCustomer.stripeCustomerId = stripeCustomerId;
            if (stripeSessionId) existingCustomer.stripeSessionId = stripeSessionId;
            
            await customerStore.setJSON(normalizedEmail, existingCustomer);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Customer updated',
                    isNew: false,
                    dashboardToken: existingCustomer.dashboardToken,
                    tier: existingCustomer.tier,
                }),
            };
        }

        // Create new customer
        const dashboardToken = providedToken || generateDashboardToken();
        
        const newCustomer: CustomerRecord = {
            email: normalizedEmail,
            tier,
            dashboardToken,
            polls: [],
            createdAt: new Date().toISOString(),
        };

        if (stripeCustomerId) newCustomer.stripeCustomerId = stripeCustomerId;
        if (stripeSessionId) newCustomer.stripeSessionId = stripeSessionId;

        await customerStore.setJSON(normalizedEmail, newCustomer);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Customer registered',
                isNew: true,
                dashboardToken,
                tier,
            }),
        };

    } catch (error) {
        console.error('Register customer error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to register customer' }),
        };
    }
};
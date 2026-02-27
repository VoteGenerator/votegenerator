// ============================================================================
// vg-customer-portal.ts - Redirect to Stripe Customer Portal
// Location: netlify/functions/vg-customer-portal.ts
// 
// Stripe Customer Portal allows users to:
// - Update payment method
// - View invoices & billing history
// - Cancel subscription
// - Switch plans (if enabled)
//
// SETUP: Enable Customer Portal in Stripe Dashboard:
// Settings → Billing → Customer Portal
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

// ============================================================================
// GET STORE WITH EXPLICIT CREDENTIALS
// ============================================================================
function getCustomerStore() {
    const siteID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';
    
    return getStore({
        name: 'vg-customers',
        siteID,
        token
    });
}

// ============================================================================
// HANDLER
// ============================================================================
export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        // Get dashboard token from query params or body
        const params = event.queryStringParameters || {};
        let dashboardToken = params.token || params.t;
        
        // Also check body for POST requests
        if (!dashboardToken && event.body) {
            try {
                const body = JSON.parse(event.body);
                dashboardToken = body.token || body.dashboardToken;
            } catch (e) {
                // Ignore parse errors
            }
        }

        if (!dashboardToken) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing dashboard token' })
            };
        }

        console.log('[portal] Looking up customer for token:', dashboardToken.substring(0, 10) + '...');

        // Look up customer data from Blobs - try multiple key formats
        const store = getCustomerStore();
        
        // Try token_ prefix first (how webhook saves it)
        let customerDataRaw = await store.get('token_' + dashboardToken);
        
        // Fall back to just the token
        if (!customerDataRaw) {
            customerDataRaw = await store.get(dashboardToken);
        }

        if (!customerDataRaw) {
            console.log('[portal] Customer not found for token');
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Customer not found. Please contact support.' })
            };
        }

        let customerData: any;
        try {
            customerData = typeof customerDataRaw === 'string' 
                ? JSON.parse(customerDataRaw) 
                : customerDataRaw;
        } catch (e) {
            console.log('[portal] Failed to parse customer data');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Invalid customer data' })
            };
        }
        
        const stripeCustomerId = customerData.stripeCustomerId;

        if (!stripeCustomerId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No Stripe customer ID found' })
            };
        }

        console.log('[portal] Creating portal session for customer:', stripeCustomerId.substring(0, 10) + '...');

        // Create Stripe Customer Portal session
        const baseUrl = process.env.URL || 'https://votegenerator.com';
        const returnUrl = baseUrl + '/admin?t=' + dashboardToken;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: returnUrl,
        });

        console.log('[portal] Portal session created, redirecting...');

        // Return redirect URL (frontend will redirect)
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                url: portalSession.url,
                success: true 
            })
        };

    } catch (error: any) {
        console.error('[portal] Error:', error.message);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to create portal session',
                message: error.message 
            })
        };
    }
};
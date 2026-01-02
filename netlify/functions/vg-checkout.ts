import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Stripe Price IDs from environment variables
const PRICE_IDS: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro_event: process.env.STRIPE_PRICE_PRO_EVENT,
    unlimited_event: process.env.STRIPE_PRICE_UNLIMITED_EVENT,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
};

// Tier configurations
const TIER_CONFIG: Record<string, { accessDays: number; maxResponses: number; maxPolls: number }> = {
    starter: { accessDays: 30, maxResponses: 500, maxPolls: 1 },
    pro_event: { accessDays: 30, maxResponses: 2000, maxPolls: 3 },
    unlimited_event: { accessDays: 30, maxResponses: 10000, maxPolls: -1 }, // -1 = unlimited
    unlimited: { accessDays: 365, maxResponses: 10000, maxPolls: -1 },
};

export const handler: Handler = async (event) => {
    // CORS headers
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
        const { tier } = JSON.parse(event.body || '{}');

        // Validate tier
        if (!tier || !PRICE_IDS[tier]) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid tier' }),
            };
        }

        const priceId = PRICE_IDS[tier];
        
        // Check if price ID is configured
        if (!priceId) {
            console.error(`Missing STRIPE_PRICE_${tier.toUpperCase()} environment variable`);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Pricing not configured for this tier' }),
            };
        }

        const config = TIER_CONFIG[tier];

        // Get the site URL for redirects
        const siteUrl = process.env.URL || 'https://votegenerator.com';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${siteUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
            cancel_url: `${siteUrl}/pricing`,
            metadata: {
                tier,
                access_days: String(config.accessDays),
                max_responses: String(config.maxResponses),
                max_polls: String(config.maxPolls),
            },
            // Optional: Allow promotion codes
            allow_promotion_codes: true,
            // Optional: Collect billing address for tax purposes
            billing_address_collection: 'auto',
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                sessionId: session.id,
                url: session.url,
            }),
        };
    } catch (error) {
        console.error('Checkout error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'Failed to create checkout session',
            }),
        };
    }
};
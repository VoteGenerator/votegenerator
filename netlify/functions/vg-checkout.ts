// ============================================================================
// netlify/functions/vg-checkout.ts
// Creates Stripe checkout session and redirects to Stripe
// ============================================================================

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Price IDs from your Stripe Dashboard
// UPDATE THESE WITH YOUR ACTUAL STRIPE PRICE IDS
const PRICE_IDS: Record<string, string> = {
    starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
    pro_event: process.env.STRIPE_PRICE_PRO_EVENT || 'price_pro_event_placeholder',
    unlimited: process.env.STRIPE_PRICE_UNLIMITED || 'price_unlimited_placeholder',
};

const TIER_NAMES: Record<string, string> = {
    starter: 'Starter Plan',
    pro_event: 'Pro Event Plan',
    unlimited: 'Unlimited Plan (1 Year)',
};

export const handler: Handler = async (event) => {
    // Get tier from query params
    const tier = event.queryStringParameters?.tier;
    
    if (!tier || !PRICE_IDS[tier]) {
        // Redirect to pricing page if invalid tier
        return {
            statusCode: 302,
            headers: {
                Location: '/pricing?error=invalid_plan',
            },
            body: '',
        };
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY not configured');
        return {
            statusCode: 302,
            headers: {
                Location: '/pricing?error=payment_not_configured',
            },
            body: '',
        };
    }

    try {
        // Get the base URL for redirects
        const baseUrl = process.env.URL || 'https://votegenerator.com';
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRICE_IDS[tier],
                    quantity: 1,
                },
            ],
            mode: 'payment', // One-time payment
            success_url: `${baseUrl}/checkout/success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/pricing?cancelled=true`,
            metadata: {
                tier,
                product: TIER_NAMES[tier],
            },
            // Optional: collect billing address
            billing_address_collection: 'auto',
            // Apply promo code if SAVE10 is active
            allow_promotion_codes: true,
        });

        // Redirect to Stripe Checkout
        return {
            statusCode: 302,
            headers: {
                Location: session.url || '/pricing?error=session_failed',
            },
            body: '',
        };
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        
        return {
            statusCode: 302,
            headers: {
                Location: `/pricing?error=checkout_failed&message=${encodeURIComponent(error.message)}`,
            },
            body: '',
        };
    }
};
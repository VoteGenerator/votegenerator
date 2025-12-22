// ============================================================================
// VoteGenerator Stripe Checkout
// Stripe automatically handles currency based on user's location
// ============================================================================

import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Price IDs from Stripe Dashboard
// Stripe will show correct currency to user at checkout
const PRICE_IDS: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro_event: process.env.STRIPE_PRICE_PRO_EVENT,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
};

const TIER_NAMES: Record<string, string> = {
    starter: 'VoteGenerator Starter',
    pro_event: 'VoteGenerator Pro Event',
    unlimited: 'VoteGenerator Unlimited',
};

export const handler: Handler = async (event) => {
    const tier = event.queryStringParameters?.tier?.toLowerCase();
    
    // Validate tier
    if (!tier || !PRICE_IDS[tier]) {
        return {
            statusCode: 302,
            headers: { Location: '/pricing?error=invalid_tier' },
            body: '',
        };
    }
    
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
        console.error(`No price ID for tier: ${tier}`);
        return {
            statusCode: 302,
            headers: { Location: '/pricing?error=price_not_configured' },
            body: '',
        };
    }
    
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            success_url: `${baseUrl}/checkout/success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/pricing?cancelled=true`,
            metadata: { tier, product: TIER_NAMES[tier] },
        });
        
        if (session.url) {
            return {
                statusCode: 302,
                headers: { Location: session.url, 'Cache-Control': 'no-cache' },
                body: '',
            };
        }
        throw new Error('No checkout URL');
    } catch (error: any) {
        console.error('Stripe error:', error);
        return {
            statusCode: 302,
            headers: { Location: `/pricing?error=checkout_failed` },
            body: '',
        };
    }
};
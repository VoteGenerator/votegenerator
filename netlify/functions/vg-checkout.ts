// ============================================================================
// VoteGenerator Stripe Checkout - Subscription Model
// Handles both monthly and annual subscriptions
// Location: netlify/functions/vg-checkout.ts
// ============================================================================
import Stripe from 'stripe';
import type { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// =============================================================================
// STRIPE PRICE IDS - Set these in Netlify environment variables
// Create these in Stripe Dashboard as RECURRING prices
// =============================================================================
// Monthly subscriptions
// STRIPE_PRICE_PRO_MONTHLY        = price_xxx ($19/month)
// STRIPE_PRICE_BUSINESS_MONTHLY   = price_xxx ($49/month)
// 
// Annual subscriptions  
// STRIPE_PRICE_PRO_ANNUAL         = price_xxx ($190/year)
// STRIPE_PRICE_BUSINESS_ANNUAL    = price_xxx ($490/year)
// =============================================================================

const PRICE_IDS: Record<string, Record<string, string | undefined>> = {
    pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
        annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    },
    business: {
        monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
        annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
    },
};

const TIER_NAMES: Record<string, string> = {
    pro: 'VoteGenerator Pro',
    business: 'VoteGenerator Business',
};

export const handler: Handler = async (event) => {
    const tier = event.queryStringParameters?.tier?.toLowerCase();
    const billing = event.queryStringParameters?.billing?.toLowerCase() || 'annual';
    
    // Validate tier
    if (!tier || !PRICE_IDS[tier]) {
        return {
            statusCode: 302,
            headers: { Location: '/pricing?error=invalid_tier' },
            body: '',
        };
    }
    
    // Validate billing period
    if (billing !== 'monthly' && billing !== 'annual') {
        return {
            statusCode: 302,
            headers: { Location: '/pricing?error=invalid_billing' },
            body: '',
        };
    }
    
    const priceId = PRICE_IDS[tier][billing];
    if (!priceId) {
        console.error(`No price ID for tier: ${tier}, billing: ${billing}`);
        return {
            statusCode: 302,
            headers: { Location: '/pricing?error=price_not_configured' },
            body: '',
        };
    }
    
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription', // Changed from 'payment' to 'subscription'
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            success_url: `${baseUrl}/checkout/success?tier=${tier}&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/pricing?cancelled=true`,
            metadata: { 
                tier, 
                billing,
                product: TIER_NAMES[tier] 
            },
            // Subscription-specific settings
            subscription_data: {
                metadata: {
                    tier,
                    billing,
                },
            },
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
// ============================================================================
// VoteGenerator Stripe Checkout - Multi-Currency Support
// Netlify Function: /.netlify/functions/vg-checkout
// 
// Query params:
//   - tier: starter | pro_event | unlimited
//   - currency: usd | cad | eur | gbp | aud (defaults to usd)
// ============================================================================

import Stripe from 'stripe';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// ============================================================================
// Price ID Configuration
// 
// Set these environment variables in Netlify Dashboard:
// STRIPE_PRICE_STARTER_USD, STRIPE_PRICE_STARTER_CAD, etc.
// ============================================================================

type Currency = 'usd' | 'cad' | 'eur' | 'gbp' | 'aud';
type Tier = 'starter' | 'pro_event' | 'unlimited';

// Get the Stripe Price ID for a given tier and currency
function getPriceId(tier: Tier, currency: Currency): string | null {
    const envKey = `STRIPE_PRICE_${tier.toUpperCase()}_${currency.toUpperCase()}`;
    const priceId = process.env[envKey];
    
    // Fallback to USD if specific currency not configured
    if (!priceId && currency !== 'usd') {
        const usdKey = `STRIPE_PRICE_${tier.toUpperCase()}_USD`;
        return process.env[usdKey] || null;
    }
    
    return priceId || null;
}

// Product names for display
const TIER_NAMES: Record<Tier, string> = {
    starter: 'VoteGenerator Starter',
    pro_event: 'VoteGenerator Pro Event',
    unlimited: 'VoteGenerator Unlimited',
};

// Valid currencies
const VALID_CURRENCIES: Currency[] = ['usd', 'cad', 'eur', 'gbp', 'aud'];

// Valid tiers
const VALID_TIERS: Tier[] = ['starter', 'pro_event', 'unlimited'];

// ============================================================================
// Handler
// ============================================================================

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Get query parameters
    const tier = event.queryStringParameters?.tier?.toLowerCase() as Tier | undefined;
    const currencyParam = event.queryStringParameters?.currency?.toLowerCase() as Currency | undefined;
    
    // Validate tier
    if (!tier || !VALID_TIERS.includes(tier)) {
        const redirectUrl = `/pricing?error=invalid_tier`;
        return {
            statusCode: 302,
            headers: { Location: redirectUrl },
            body: '',
        };
    }
    
    // Default to USD if currency not specified or invalid
    const currency: Currency = currencyParam && VALID_CURRENCIES.includes(currencyParam) 
        ? currencyParam 
        : 'usd';
    
    // Get price ID
    const priceId = getPriceId(tier, currency);
    
    if (!priceId) {
        console.error(`No price ID found for tier=${tier}, currency=${currency}`);
        const redirectUrl = `/pricing?error=price_not_found`;
        return {
            statusCode: 302,
            headers: { Location: redirectUrl },
            body: '',
        };
    }
    
    // Determine base URL
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    
    try {
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            // Allow promo codes
            allow_promotion_codes: true,
            // Collect billing address for tax purposes
            billing_address_collection: 'required',
            // Success and cancel URLs
            success_url: `${baseUrl}/checkout/success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/pricing?cancelled=true`,
            // Metadata for tracking
            metadata: {
                tier,
                currency,
                product: TIER_NAMES[tier],
            },
        });
        
        // Redirect to Stripe Checkout
        if (session.url) {
            return {
                statusCode: 302,
                headers: {
                    Location: session.url,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
                body: '',
            };
        } else {
            throw new Error('No checkout URL returned from Stripe');
        }
        
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        
        // Redirect to pricing with error
        const redirectUrl = `/pricing?error=checkout_failed&message=${encodeURIComponent(error.message || 'Unknown error')}`;
        return {
            statusCode: 302,
            headers: { Location: redirectUrl },
            body: '',
        };
    }
};
// ============================================================================
// vg-create-checkout.ts - Create Stripe checkout session for upgrades
// Location: netlify/functions/vg-create-checkout.ts
// Used by UpgradeModal when upgrading from free/pro to pro/business
// ============================================================================
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

const SITE_URL = process.env.URL || 'https://votegenerator.com';

// Map plan + billing to Stripe price IDs
function getPriceId(plan: string, billing: string): string | null {
    // Try environment variables first (recommended)
    const envKey = `STRIPE_PRICE_${plan.toUpperCase()}_${billing.toUpperCase()}`;
    const envPrice = process.env[envKey];
    if (envPrice) return envPrice;
    
    // Fallback to alternative naming conventions
    const altKey1 = `STRIPE_${plan.toUpperCase()}_${billing.toUpperCase()}_PRICE`;
    const altPrice1 = process.env[altKey1];
    if (altPrice1) return altPrice1;
    
    // Final fallbacks with explicit variable names
    if (plan === 'pro' && billing === 'monthly') {
        return process.env.STRIPE_PRO_MONTHLY_PRICE || process.env.STRIPE_PRICE_PRO_MONTHLY || null;
    }
    if (plan === 'pro' && billing === 'yearly') {
        return process.env.STRIPE_PRO_ANNUAL_PRICE || process.env.STRIPE_PRICE_PRO_ANNUAL || null;
    }
    if (plan === 'business' && billing === 'monthly') {
        return process.env.STRIPE_BUSINESS_MONTHLY_PRICE || process.env.STRIPE_PRICE_BUSINESS_MONTHLY || null;
    }
    if (plan === 'business' && billing === 'yearly') {
        return process.env.STRIPE_BUSINESS_ANNUAL_PRICE || process.env.STRIPE_PRICE_BUSINESS_ANNUAL || null;
    }
    
    return null;
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
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { 
            priceId: requestedPriceId,
            plan, 
            billing,
            successUrl, 
            cancelUrl,
            existingCustomerToken,
            existingEmail,
            upgradeFrom,
            source
        } = body;

        // Determine price ID - use provided or look up
        let priceId = requestedPriceId;
        if (!priceId || priceId.startsWith('price_pro_') || priceId.startsWith('price_business_')) {
            // Placeholder value - look up real price
            priceId = getPriceId(plan, billing);
        }

        if (!priceId) {
            console.error('vg-create-checkout: No price ID found for', plan, billing);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid plan or billing cycle' })
            };
        }

        console.log('vg-create-checkout: Creating session for', plan, billing, 'priceId:', priceId);

        // Build checkout session config
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            success_url: successUrl || `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${plan}`,
            cancel_url: cancelUrl || `${SITE_URL}/pricing`,
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
            subscription_data: {
                metadata: {
                    tier: plan,
                    billing: billing,
                    upgradedFrom: upgradeFrom || 'direct',
                    source: source || 'upgrade_modal'
                }
            },
            metadata: {
                tier: plan,
                billing: billing,
                source: source || 'upgrade_modal'
            }
        };

        // If we have existing customer info, try to use it
        if (existingEmail) {
            // Check if customer exists
            const customers = await stripe.customers.list({
                email: existingEmail,
                limit: 1
            });

            if (customers.data.length > 0) {
                const customer = customers.data[0];
                
                // Check if they have an active subscription
                const subscriptions = await stripe.subscriptions.list({
                    customer: customer.id,
                    status: 'active',
                    limit: 1
                });

                if (subscriptions.data.length > 0 && upgradeFrom) {
                    // This is an upgrade - use billing portal instead
                    console.log('vg-create-checkout: Customer has active sub, using billing portal');
                    
                    const portalSession = await stripe.billingPortal.sessions.create({
                        customer: customer.id,
                        return_url: cancelUrl || `${SITE_URL}/admin`
                    });

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ 
                            url: portalSession.url,
                            type: 'billing_portal',
                            message: 'Redirecting to billing portal to manage subscription'
                        })
                    };
                }

                // Existing customer but no active subscription - attach to session
                sessionConfig.customer = customer.id;
            } else {
                // Prefill email for new customer
                sessionConfig.customer_email = existingEmail;
            }
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create(sessionConfig);

        console.log('vg-create-checkout: Created session', session.id);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                url: session.url,
                sessionId: session.id,
                type: 'checkout'
            })
        };

    } catch (error: any) {
        console.error('vg-create-checkout error:', error);
        
        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid checkout configuration',
                    details: error.message
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to create checkout session',
                details: error.message
            })
        };
    }
};
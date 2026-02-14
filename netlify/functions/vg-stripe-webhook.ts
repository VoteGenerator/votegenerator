// ============================================================================
// vg-stripe-webhook.ts - Handle Stripe subscription events
// Location: netlify/functions/vg-stripe-webhook.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Tier configuration
const TIER_CONFIG: Record<string, { maxResponses: number; label: string }> = {
    free: { maxResponses: 100, label: 'Free' },
    pro: { maxResponses: 10000, label: 'Pro' },
    business: { maxResponses: 100000, label: 'Business' },
};

// ============================================================================
// GET STORE WITH EXPLICIT CREDENTIALS (required for reliability)
// ============================================================================
function getCustomerStore() {
    return getStore('vg-customers');
}

function getPollStore() {
    return getStore('polls');
}

function getEventStore() {
    return getStore('webhook-events');
}

// ============================================================================
// DETERMINISTIC TOKEN GENERATION
// ============================================================================
function generateDashboardToken(sessionId: string): string {
    return 'vg_' + sessionId.replace('cs_', '').substring(0, 32);
}

// ============================================================================
// DETERMINE TIER FROM PRICE ID
// ============================================================================
function determineTierFromPriceId(priceId: string): 'pro' | 'business' {
    // Check all possible env var names for Business prices
    const businessPrices = [
        process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
        process.env.STRIPE_BUSINESS_ANNUAL_PRICE,
        process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
        process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
    ].filter(Boolean);

    // Check all possible env var names for Pro prices
    const proPrices = [
        process.env.STRIPE_PRO_MONTHLY_PRICE,
        process.env.STRIPE_PRO_ANNUAL_PRICE,
        process.env.STRIPE_PRICE_PRO_MONTHLY,
        process.env.STRIPE_PRICE_PRO_ANNUAL,
    ].filter(Boolean);

    console.log('[webhook] Checking price ID: ' + priceId);
    console.log('[webhook] Business prices configured: ' + businessPrices.join(', '));
    console.log('[webhook] Pro prices configured: ' + proPrices.join(', '));

    if (businessPrices.includes(priceId)) {
        console.log('[webhook] Matched Business tier');
        return 'business';
    }
    if (proPrices.includes(priceId)) {
        console.log('[webhook] Matched Pro tier');
        return 'pro';
    }

    console.log('[webhook] No match found, defaulting to pro');
    return 'pro';
}

// ============================================================================
// DETERMINE TIER FROM SUBSCRIPTION
// ============================================================================
function determineTier(subscription: Stripe.Subscription): 'free' | 'pro' | 'business' {
    const priceId = subscription.items.data[0]?.price?.id;
    
    if (priceId) {
        return determineTierFromPriceId(priceId);
    }

    // Fallback: Check metadata
    const tierMeta = subscription.metadata?.tier;
    if (tierMeta === 'business') return 'business';
    if (tierMeta === 'pro') return 'pro';

    return 'pro';
}

// ============================================================================
// SEND WELCOME EMAIL
// ============================================================================
async function sendWelcomeEmail(
    email: string,
    tier: string,
    dashboardToken: string,
    sessionId: string,
    expiresAt: string
): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.log('[webhook] No RESEND_API_KEY configured, skipping email');
        return false;
    }
    if (!email) {
        console.log('[webhook] No email provided, skipping email');
        return false;
    }

    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.pro;
    const tierLabel = tierConfig.label;
    const responseLimit = tierConfig.maxResponses.toLocaleString();

    const baseUrl = process.env.URL || 'https://votegenerator.com';
    const dashboardUrl = baseUrl + '/admin?token=' + dashboardToken + '&session_id=' + sessionId;

    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    try {
        console.log('[webhook] Sending welcome email to: ' + email.substring(0, 5) + '...');
        console.log('[webhook] Tier: ' + tierLabel + ', Responses: ' + responseLimit);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'VoteGenerator <noreply@mail.votegenerator.com>',
                to: email,
                subject: '🗳️ Welcome to VoteGenerator ' + tierLabel + '!',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">🗳️ VoteGenerator</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Welcome to ${tierLabel}!</p>
                        </div>
                        
                        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
                            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Thank you for your purchase! Your poll dashboard is ready.
                            </p>
                            
                            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="margin: 0 0 12px 0; color: #92400e; font-weight: bold; font-size: 14px;">
                                    ⚠️ IMPORTANT: Save Your Dashboard Link!
                                </p>
                                <a href="${dashboardUrl}" 
                                   style="display: block; background: #f59e0b; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 16px;">
                                    Open My Dashboard →
                                </a>
                                <p style="margin: 12px 0 0 0; font-size: 11px; color: #92400e; word-break: break-all;">
                                    ${dashboardUrl}
                                </p>
                            </div>
                            
                            <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 16px;">Your ${tierLabel} Plan:</h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b;">
                                    <li style="margin-bottom: 8px;">Unlimited polls</li>
                                    <li style="margin-bottom: 8px;">${responseLimit} responses per poll</li>
                                    <li style="margin-bottom: 8px;">Valid until <strong>${expirationDate}</strong></li>
                                </ul>
                            </div>
                            
                            <p style="color: #64748b; font-size: 14px;">
                                Questions? Reply to this email or contact <a href="mailto:support@votegenerator.com" style="color: #6366f1;">support@votegenerator.com</a>
                            </p>
                        </div>
                        
                        <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">© ${new Date().getFullYear()} VoteGenerator. All rights reserved.</p>
                        </div>
                    </div>
                `,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[webhook] Resend API error: ' + response.status + ' - ' + errorText);
            return false;
        }

        console.log('[webhook] Welcome email sent successfully!');
        return true;
    } catch (error: any) {
        console.error('[webhook] Email send failed: ' + error.message);
        return false;
    }
}

// ============================================================================
// REGISTER CUSTOMER IN BLOBS
// ============================================================================
async function registerCustomer(
    email: string,
    tier: string,
    stripeCustomerId: string | null,
    sessionId: string,
    dashboardToken: string,
    expiresAt: string
): Promise<boolean> {
    try {
        console.log('[webhook] Registering customer: ' + email.substring(0, 5) + '...');
        
        const store = getCustomerStore();

        const customerData = {
            email,
            tier,
            stripeCustomerId,
            stripeSessionId: sessionId,
            dashboardToken,
            createdAt: new Date().toISOString(),
            expiresAt,
            polls: [],
        };

        // Store by multiple keys for lookups
        await store.setJSON('customer_' + email, customerData);
        console.log('[webhook] Saved customer_' + email.substring(0, 5) + '...');
        
        await store.setJSON('token_' + dashboardToken, customerData);
        console.log('[webhook] Saved token_' + dashboardToken.substring(0, 10) + '...');
        
        await store.setJSON('session_' + sessionId, customerData);
        console.log('[webhook] Saved session_' + sessionId.substring(0, 15) + '...');

        if (stripeCustomerId) {
            await store.setJSON(stripeCustomerId, customerData);
            console.log('[webhook] Saved by stripeCustomerId');
        }

        console.log('[webhook] Customer registered successfully');
        return true;
    } catch (error: any) {
        console.error('[webhook] Customer registration failed: ' + error.message);
        return false;
    }
}

// ============================================================================
// SYNC CUSTOMER TIER (for updates/cancellations)
// ============================================================================
async function syncCustomerTier(
    stripeCustomerId: string,
    newTier: 'free' | 'pro' | 'business',
    expiresAt: string | null,
    isActive: boolean
): Promise<{ updated: number; errors: number }> {
    console.log('[webhook] syncCustomerTier called for: ' + stripeCustomerId);
    
    let updatedPolls = 0;
    let errors = 0;

    try {
        const customerStore = getCustomerStore();
        
        let customerData: any = null;
        
        try {
            customerData = await customerStore.get(stripeCustomerId, { type: 'json' });
        } catch (e) {
            console.log('[webhook] Customer not found by stripeCustomerId, this is OK for new customers');
        }

        if (!customerData) {
            console.log('[webhook] Customer ' + stripeCustomerId + ' not found in store - skipping sync');
            return { updated: 0, errors: 0 };
        }

        const oldTier = customerData.tier;
        console.log('[webhook] Syncing customer: ' + oldTier + ' -> ' + newTier);

        const updatedCustomer = {
            ...customerData,
            tier: newTier,
            expiresAt: expiresAt || customerData.expiresAt,
            isActive,
            updatedAt: new Date().toISOString(),
        };

        await customerStore.setJSON(stripeCustomerId, updatedCustomer);

        if (customerData.dashboardToken) {
            await customerStore.setJSON('token_' + customerData.dashboardToken, updatedCustomer);
        }

        if (customerData.stripeSessionId) {
            await customerStore.setJSON('session_' + customerData.stripeSessionId, updatedCustomer);
        }

        console.log('[webhook] Customer tier synced successfully');
        return { updated: updatedPolls, errors };

    } catch (error: any) {
        console.error('[webhook] syncCustomerTier error: ' + error.message);
        return { updated: 0, errors: 1 };
    }
}

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================
export const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    console.log('[webhook] ====== WEBHOOK CALLED ======');
    console.log('[webhook] Method: ' + event.httpMethod);

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const signature = event.headers['stripe-signature'];

    if (!signature) {
        console.error('[webhook] No stripe-signature header');
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing signature' }),
        };
    }

    if (!WEBHOOK_SECRET) {
        console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Webhook secret not configured' }),
        };
    }

    let stripeEvent: Stripe.Event;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body || '',
            signature,
            WEBHOOK_SECRET
        );
        console.log('[webhook] Signature verified successfully');
    } catch (err: any) {
        console.error('[webhook] Signature verification failed: ' + err.message);
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid signature' }),
        };
    }

    console.log('[webhook] Event type: ' + stripeEvent.type);
    console.log('[webhook] Event ID: ' + stripeEvent.id);

    // Skip idempotency check for now to simplify debugging
    // We can add it back later

    try {
        switch (stripeEvent.type) {
            // ============================================================
            // CHECKOUT COMPLETED - Send welcome email + register customer
            // ============================================================
            case 'checkout.session.completed': {
                console.log('[webhook] Processing checkout.session.completed');
                
                const session = stripeEvent.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                const customerEmail = session.customer_email || session.customer_details?.email;
                const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

                // Get tier from metadata first
                let tier = metadata.tier || 'pro';
                const billing = metadata.billing || 'yearly';

                console.log('[webhook] Session ID: ' + session.id);
                console.log('[webhook] Metadata tier: ' + tier);
                console.log('[webhook] Metadata billing: ' + billing);
                console.log('[webhook] Customer email: ' + (customerEmail ? customerEmail.substring(0, 5) + '...' : 'none'));
                console.log('[webhook] Stripe customer ID: ' + stripeCustomerId);

                // Get expiry from subscription
                let expiresAt: string;

                if (session.mode === 'subscription' && session.subscription) {
                    console.log('[webhook] Has subscription, fetching details...');
                    
                    const subscriptionId = typeof session.subscription === 'string'
                        ? session.subscription
                        : session.subscription.id;

                    try {
                        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                        const priceId = subscription.items.data[0]?.price?.id;
                        
                        console.log('[webhook] Subscription price ID: ' + priceId);
                        
                        // Determine tier from price ID
                        tier = determineTierFromPriceId(priceId || '');
                        
                        // Also check metadata if price didn't match
                        if (tier === 'pro' && metadata.tier === 'business') {
                            console.log('[webhook] Price matched pro but metadata says business - using metadata');
                            tier = 'business';
                        }
                        
                        expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                        console.log('[webhook] Subscription expires: ' + expiresAt);
                    } catch (subError: any) {
                        console.error('[webhook] Failed to fetch subscription: ' + subError.message);
                        // Fallback expiry
                        const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                    }
                } else {
                    console.log('[webhook] No subscription, calculating expiry from billing');
                    const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                }

                console.log('[webhook] Final tier: ' + tier);
                console.log('[webhook] Final expiresAt: ' + expiresAt);

                // Generate dashboard token
                const dashboardToken = generateDashboardToken(session.id);
                console.log('[webhook] Generated token: ' + dashboardToken.substring(0, 15) + '...');

                // STEP 1: Send welcome email
                if (customerEmail) {
                    console.log('[webhook] Sending welcome email...');
                    const emailSent = await sendWelcomeEmail(customerEmail, tier, dashboardToken, session.id, expiresAt);
                    console.log('[webhook] Email sent: ' + emailSent);
                } else {
                    console.log('[webhook] No customer email, skipping welcome email');
                }

                // STEP 2: Register customer
                if (customerEmail) {
                    console.log('[webhook] Registering customer...');
                    const registered = await registerCustomer(customerEmail, tier, stripeCustomerId, session.id, dashboardToken, expiresAt);
                    console.log('[webhook] Customer registered: ' + registered);
                } else {
                    console.log('[webhook] No customer email, skipping registration');
                }

                console.log('[webhook] checkout.session.completed processed successfully');

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        received: true,
                        action: 'checkout_completed',
                        tier,
                        emailSent: !!customerEmail
                    }),
                };
            }

            // ============================================================
            // SUBSCRIPTION UPDATED
            // ============================================================
            case 'customer.subscription.updated': {
                console.log('[webhook] Processing customer.subscription.updated');
                
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string'
                    ? subscription.customer
                    : subscription.customer.id;

                const newTier = determineTier(subscription);
                const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                const isActive = subscription.status === 'active';

                console.log('[webhook] Customer ID: ' + customerId);
                console.log('[webhook] New tier: ' + newTier);
                console.log('[webhook] Is active: ' + isActive);

                const result = await syncCustomerTier(customerId, newTier, expiresAt, isActive);

                console.log('[webhook] customer.subscription.updated processed');

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        received: true,
                        action: 'subscription_updated',
                        tier: newTier,
                        pollsUpdated: result.updated
                    }),
                };
            }

            // ============================================================
            // SUBSCRIPTION DELETED
            // ============================================================
            case 'customer.subscription.deleted': {
                console.log('[webhook] Processing customer.subscription.deleted');
                
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string'
                    ? subscription.customer
                    : subscription.customer.id;

                const periodEnd = subscription.current_period_end * 1000;
                const hasEnded = Date.now() > periodEnd;

                console.log('[webhook] Customer ID: ' + customerId);
                console.log('[webhook] Period ended: ' + hasEnded);

                if (hasEnded) {
                    await syncCustomerTier(customerId, 'free', null, false);
                } else {
                    const tier = determineTier(subscription);
                    const expiresAt = new Date(periodEnd).toISOString();
                    await syncCustomerTier(customerId, tier, expiresAt, true);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ received: true, action: 'subscription_deleted' }),
                };
            }

            // ============================================================
            // PAYMENT FAILED
            // ============================================================
            case 'invoice.payment_failed': {
                console.log('[webhook] Processing invoice.payment_failed');
                const invoice = stripeEvent.data.object as Stripe.Invoice;
                const customerId = typeof invoice.customer === 'string'
                    ? invoice.customer
                    : invoice.customer?.id;
                console.log('[webhook] Payment failed for: ' + customerId);
                break;
            }

            default:
                console.log('[webhook] Unhandled event type: ' + stripeEvent.type);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ received: true }),
        };

    } catch (error: any) {
        console.error('[webhook] ERROR: ' + error.message);
        console.error('[webhook] Stack: ' + error.stack);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Webhook processing failed', message: error.message }),
        };
    }
};
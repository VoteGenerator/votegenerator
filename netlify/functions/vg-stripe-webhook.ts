// ============================================================================
// vg-stripe-webhook.ts - Handle Stripe subscription events
// Location: netlify/functions/vg-stripe-webhook.ts
// 
// Handles:
// - checkout.session.completed (new subscriptions + WELCOME EMAIL)
// - customer.subscription.updated (tier changes, renewals)
// - customer.subscription.deleted (cancellations)
// - invoice.payment_failed (payment issues)
//
// IDEMPOTENCY: Events are tracked to prevent duplicate processing
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
// DETERMINISTIC TOKEN GENERATION
// ============================================================================
function generateDashboardToken(sessionId: string): string {
    return 'vg_' + sessionId.replace('cs_', '').substring(0, 32);
}

// ============================================================================
// DETERMINE TIER FROM SUBSCRIPTION
// ============================================================================
function determineTier(subscription: Stripe.Subscription): 'free' | 'pro' | 'business' {
    const priceId = subscription.items.data[0]?.price?.id;
    
    const businessPrices = [
        process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
        process.env.STRIPE_BUSINESS_ANNUAL_PRICE,
        process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
        process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
    ].filter(Boolean);
    
    const proPrices = [
        process.env.STRIPE_PRO_MONTHLY_PRICE,
        process.env.STRIPE_PRO_ANNUAL_PRICE,
        process.env.STRIPE_PRICE_PRO_MONTHLY,
        process.env.STRIPE_PRICE_PRO_ANNUAL,
    ].filter(Boolean);
    
    if (businessPrices.includes(priceId)) return 'business';
    if (proPrices.includes(priceId)) return 'pro';
    
    // Check metadata as fallback
    const tierMeta = subscription.metadata?.tier;
    if (tierMeta === 'business') return 'business';
    if (tierMeta === 'pro') return 'pro';
    
    return 'pro'; // Default for unknown paid subscriptions
}

// ============================================================================
// SEND WELCOME EMAIL
// ============================================================================
async function sendWelcomeEmail(
    email: string,
    tier: string,
    dashboardToken: string,
    sessionId: string,
    billing: string,
    expiresAt: string
): Promise<boolean> {
    if (!RESEND_API_KEY || !email) {
        console.log('[webhook] Skipping email: No API key or email');
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
        console.log('[webhook] Sending welcome email to ' + email.substring(0, 5) + '...');

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
            console.error('[webhook] Resend API error:', response.status, errorText);
            return false;
        }

        console.log('[webhook] Welcome email sent successfully!');
        return true;
    } catch (error) {
        console.error('[webhook] Failed to send welcome email:', error);
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
        const store = getStore('vg-customers');

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
        await store.setJSON('token_' + dashboardToken, customerData);
        await store.setJSON('session_' + sessionId, customerData);
        
        if (stripeCustomerId) {
            await store.setJSON(stripeCustomerId, customerData);
        }

        console.log('[webhook] Customer registered in Blobs');
        return true;
    } catch (error: any) {
        console.error('[webhook] Blobs registration failed:', error.message);
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
    const customerStore = getStore('vg-customers');
    const pollStore = getStore('polls');

    let updatedPolls = 0;
    let errors = 0;

    try {
        const customerData = await customerStore.get(stripeCustomerId, { type: 'json' }) as any;

        if (!customerData) {
            console.log('[webhook] Customer ' + stripeCustomerId + ' not found in store');
            return { updated: 0, errors: 0 };
        }

        const oldTier = customerData.tier;
        const tierChanged = oldTier !== newTier;

        console.log('[webhook] Syncing customer ' + stripeCustomerId + ': ' + oldTier + ' -> ' + newTier);

        const updatedCustomer = {
            ...customerData,
            tier: newTier,
            expiresAt: expiresAt || customerData.expiresAt,
            isActive,
            updatedAt: new Date().toISOString(),
            lastSyncedAt: new Date().toISOString()
        };

        await customerStore.setJSON(stripeCustomerId, updatedCustomer);

        if (customerData.dashboardToken) {
            await customerStore.setJSON('token_' + customerData.dashboardToken, updatedCustomer);
        }

        if (customerData.stripeSessionId) {
            await customerStore.setJSON('session_' + customerData.stripeSessionId, updatedCustomer);
        }

        // Update polls
        if (customerData.polls && Array.isArray(customerData.polls)) {
            const newMaxResponses = TIER_CONFIG[newTier]?.maxResponses || 100;

            for (const pollRef of customerData.polls) {
                const pollId = typeof pollRef === 'string' ? pollRef : pollRef.id;
                if (!pollId) continue;

                try {
                    const poll = await pollStore.get(pollId, { type: 'json' }) as any;
                    if (!poll) {
                        console.log('[webhook] Poll ' + pollId + ' not found');
                        continue;
                    }

                    let newStatus = poll.status;

                    if (newTier === 'free' && poll.voteCount >= newMaxResponses) {
                        newStatus = 'paused';
                        console.log('[webhook] Pausing poll ' + pollId + ' - over free limit');
                    }

                    if (tierChanged && poll.status === 'paused' && newTier !== 'free') {
                        newStatus = 'live';
                        console.log('[webhook] Reactivating poll ' + pollId + ' - upgraded');
                    }

                    const updatedPoll = {
                        ...poll,
                        tier: newTier,
                        maxResponses: newMaxResponses,
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                        tierSyncedAt: new Date().toISOString()
                    };

                    await pollStore.setJSON(pollId, updatedPoll);
                    updatedPolls++;

                    console.log('[webhook] Updated poll ' + pollId + ': tier=' + newTier + ', status=' + newStatus);
                } catch (pollError) {
                    console.error('[webhook] Error updating poll ' + pollId);
                    errors++;
                }
            }
        }

        return { updated: updatedPolls, errors };
    } catch (error) {
        console.error('[webhook] Error syncing customer tier');
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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const signature = event.headers['stripe-signature'];

    if (!signature || !WEBHOOK_SECRET) {
        console.error('[webhook] Missing signature or webhook secret');
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing signature' }),
        };
    }

    let stripeEvent: Stripe.Event;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body || '',
            signature,
            WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('[webhook] Signature verification failed');
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid signature' }),
        };
    }

    console.log('[webhook] Received event: ' + stripeEvent.type);

    // Idempotency check
    const eventId = stripeEvent.id;
    const eventStore = getStore('webhook-events');

    try {
        const existingEvent = await eventStore.get(eventId, { type: 'json' }) as any;

        if (existingEvent) {
            console.log('[webhook] Event ' + eventId + ' already processed, skipping');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ received: true, skipped: true }),
            };
        }

        await eventStore.setJSON(eventId, {
            processedAt: new Date().toISOString(),
            eventType: stripeEvent.type,
            status: 'processing'
        });
    } catch (idempotencyError) {
        console.error('[webhook] Idempotency check failed, continuing');
    }

    try {
        switch (stripeEvent.type) {
            // ============================================================
            // CHECKOUT COMPLETED - Send welcome email + register customer
            // ============================================================
            case 'checkout.session.completed': {
                const session = stripeEvent.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                const customerEmail = session.customer_email || session.customer_details?.email;
                const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

                // Get tier from metadata
                let tier = metadata.tier || 'pro';
                const billing = metadata.billing || 'yearly';

                console.log('[webhook] Checkout completed: tier=' + tier + ', billing=' + billing + ', email=' + (customerEmail ? customerEmail.substring(0, 5) + '...' : 'none'));

                // If subscription, get actual tier from subscription
                let expiresAt: string;
                
                if (session.mode === 'subscription' && session.subscription) {
                    const subscriptionId = typeof session.subscription === 'string'
                        ? session.subscription
                        : session.subscription.id;

                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    tier = determineTier(subscription);
                    expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                    
                    console.log('[webhook] Subscription tier: ' + tier + ', expires: ' + expiresAt);
                } else {
                    // Calculate expiry based on billing
                    const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                }

                // Generate dashboard token
                const dashboardToken = generateDashboardToken(session.id);
                console.log('[webhook] Generated token: ' + dashboardToken.substring(0, 15) + '...');

                // STEP 1: Send welcome email
                if (customerEmail) {
                    await sendWelcomeEmail(customerEmail, tier, dashboardToken, session.id, billing, expiresAt);
                }

                // STEP 2: Register customer
                if (customerEmail) {
                    await registerCustomer(customerEmail, tier, stripeCustomerId, session.id, dashboardToken, expiresAt);
                }

                // STEP 3: Sync tier if we have customer ID
                if (stripeCustomerId) {
                    await syncCustomerTier(stripeCustomerId, tier as any, expiresAt, true);
                }

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
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string'
                    ? subscription.customer
                    : subscription.customer.id;

                const newTier = determineTier(subscription);
                const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                const isActive = subscription.status === 'active';

                console.log('[webhook] Subscription updated: customer=' + customerId + ', tier=' + newTier);

                const result = await syncCustomerTier(customerId, newTier, expiresAt, isActive);

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
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string'
                    ? subscription.customer
                    : subscription.customer.id;

                const periodEnd = subscription.current_period_end * 1000;
                const hasEnded = Date.now() > periodEnd;

                if (hasEnded) {
                    console.log('[webhook] Subscription ended: customer=' + customerId);
                    const result = await syncCustomerTier(customerId, 'free', null, false);
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            received: true,
                            action: 'downgraded_to_free',
                            pollsUpdated: result.updated
                        }),
                    };
                } else {
                    const tier = determineTier(subscription);
                    const expiresAt = new Date(periodEnd).toISOString();
                    console.log('[webhook] Subscription canceled but active until: ' + expiresAt);
                    const result = await syncCustomerTier(customerId, tier, expiresAt, true);
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            received: true,
                            action: 'subscription_canceled_period_active',
                            tier,
                            expiresAt,
                            pollsUpdated: result.updated
                        }),
                    };
                }
            }

            // ============================================================
            // PAYMENT FAILED
            // ============================================================
            case 'invoice.payment_failed': {
                const invoice = stripeEvent.data.object as Stripe.Invoice;
                const customerId = typeof invoice.customer === 'string'
                    ? invoice.customer
                    : invoice.customer?.id;

                if (customerId) {
                    console.log('[webhook] Payment failed: customer=' + customerId);
                }
                break;
            }

            default:
                console.log('[webhook] Unhandled event type: ' + stripeEvent.type);
        }

        // Mark event as completed
        try {
            await eventStore.setJSON(eventId, {
                processedAt: new Date().toISOString(),
                eventType: stripeEvent.type,
                status: 'completed'
            });
        } catch (e) {
            // Non-critical
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ received: true }),
        };

    } catch (error) {
        console.error('[webhook] Error processing event:', error);

        try {
            await eventStore.setJSON(eventId, {
                processedAt: new Date().toISOString(),
                eventType: stripeEvent.type,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } catch (e) {
            // Non-critical
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Webhook processing failed' }),
        };
    }
};
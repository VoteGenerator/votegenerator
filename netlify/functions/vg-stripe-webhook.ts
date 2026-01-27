// ============================================================================
// vg-stripe-webhook.ts - Handle Stripe subscription events
// Location: netlify/functions/vg-stripe-webhook.ts
// 
// Handles:
// - customer.subscription.updated (tier changes, renewals)
// - customer.subscription.deleted (cancellations)
// - checkout.session.completed (new subscriptions)
// - invoice.payment_failed (payment issues)
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Tier configuration - must match vg-create.ts
const TIER_CONFIG: Record<string, { maxResponses: number }> = {
    free: { maxResponses: 100 },
    pro: { maxResponses: 10000 },
    business: { maxResponses: 100000 },
};

// ============================================================================
// DETERMINE TIER FROM SUBSCRIPTION
// ============================================================================
function determineTier(subscription: Stripe.Subscription): 'free' | 'pro' | 'business' {
    const priceId = subscription.items.data[0]?.price?.id;
    
    const businessPrices = [
        process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
        process.env.STRIPE_BUSINESS_ANNUAL_PRICE,
    ].filter(Boolean);
    
    const proPrices = [
        process.env.STRIPE_PRO_MONTHLY_PRICE,
        process.env.STRIPE_PRO_ANNUAL_PRICE,
    ].filter(Boolean);
    
    if (businessPrices.includes(priceId)) return 'business';
    if (proPrices.includes(priceId)) return 'pro';
    
    // Check metadata
    const tierMeta = subscription.metadata?.tier;
    if (tierMeta === 'business') return 'business';
    if (tierMeta === 'pro') return 'pro';
    
    return 'pro'; // Default for unknown paid subscriptions
}

// ============================================================================
// UPDATE CUSTOMER AND THEIR POLLS
// ============================================================================
async function syncCustomerTier(
    stripeCustomerId: string, 
    newTier: 'free' | 'pro' | 'business',
    expiresAt: string | null,
    isActive: boolean
): Promise<{ updated: number; errors: number }> {
    const siteId = process.env.VG_SITE_ID || '';
    const authToken = process.env.NETLIFY_AUTH_TOKEN || '';
    
    const customerStore = getStore({
        name: 'vg-customers',
        siteID: siteId,
        token: authToken
    });
    
    const pollStore = getStore({
        name: 'polls',
        siteID: siteId,
        token: authToken
    });

    let updatedPolls = 0;
    let errors = 0;

    try {
        // Find customer by Stripe customer ID
        const customerData = await customerStore.get(stripeCustomerId, { type: 'json' }) as any;
        
        if (!customerData) {
            console.log(`[webhook] Customer ${stripeCustomerId} not found in store`);
            return { updated: 0, errors: 0 };
        }

        const oldTier = customerData.tier;
        const tierChanged = oldTier !== newTier;
        
        console.log(`[webhook] Syncing customer ${stripeCustomerId}: ${oldTier} -> ${newTier}`);

        // Update customer record
        const updatedCustomer = {
            ...customerData,
            tier: newTier,
            expiresAt: expiresAt || customerData.expiresAt,
            isActive,
            updatedAt: new Date().toISOString(),
            lastSyncedAt: new Date().toISOString()
        };

        // Save to both keys
        await customerStore.setJSON(stripeCustomerId, updatedCustomer);
        
        if (customerData.dashboardToken) {
            await customerStore.setJSON(`token_${customerData.dashboardToken}`, updatedCustomer);
        }
        
        if (customerData.stripeSessionId) {
            await customerStore.setJSON(`session_${customerData.stripeSessionId}`, updatedCustomer);
        }

        // ================================================================
        // UPDATE ALL POLLS BELONGING TO THIS CUSTOMER
        // ================================================================
        if (customerData.polls && Array.isArray(customerData.polls)) {
            const newMaxResponses = TIER_CONFIG[newTier]?.maxResponses || 100;
            
            for (const pollRef of customerData.polls) {
                const pollId = typeof pollRef === 'string' ? pollRef : pollRef.id;
                
                if (!pollId) continue;
                
                try {
                    const poll = await pollStore.get(pollId, { type: 'json' }) as any;
                    
                    if (!poll) {
                        console.log(`[webhook] Poll ${pollId} not found`);
                        continue;
                    }

                    // Determine new status based on tier change
                    let newStatus = poll.status;
                    
                    // If downgrading to free and over limit, pause the poll
                    if (newTier === 'free' && poll.voteCount >= newMaxResponses) {
                        newStatus = 'paused';
                        console.log(`[webhook] Pausing poll ${pollId} - over free limit`);
                    }
                    
                    // If upgrading and was paused due to limits, reactivate
                    if (tierChanged && poll.status === 'paused' && newTier !== 'free') {
                        newStatus = 'live';
                        console.log(`[webhook] Reactivating poll ${pollId} - upgraded`);
                    }

                    // Update poll
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
                    
                    console.log(`[webhook] Updated poll ${pollId}: tier=${newTier}, maxResponses=${newMaxResponses}, status=${newStatus}`);

                } catch (pollError) {
                    console.error(`[webhook] Error updating poll ${pollId}`);
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

    // Verify webhook signature
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

    console.log(`[webhook] Received event: ${stripeEvent.type}`);

    try {
        switch (stripeEvent.type) {
            // ============================================================
            // SUBSCRIPTION UPDATED (renewals, plan changes)
            // ============================================================
            case 'customer.subscription.updated': {
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string' 
                    ? subscription.customer 
                    : subscription.customer.id;
                
                const newTier = determineTier(subscription);
                const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                const isActive = subscription.status === 'active';
                
                console.log(`[webhook] Subscription updated: customer=${customerId}, tier=${newTier}, active=${isActive}`);
                
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
            // SUBSCRIPTION DELETED (cancellation)
            // ============================================================
            case 'customer.subscription.deleted': {
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const customerId = typeof subscription.customer === 'string' 
                    ? subscription.customer 
                    : subscription.customer.id;
                
                // Check if period has ended
                const periodEnd = subscription.current_period_end * 1000;
                const hasEnded = Date.now() > periodEnd;
                
                if (hasEnded) {
                    // Downgrade to free
                    console.log(`[webhook] Subscription ended: customer=${customerId}, downgrading to free`);
                    
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
                    // Still in paid period, keep current tier until period ends
                    const tier = determineTier(subscription);
                    const expiresAt = new Date(periodEnd).toISOString();
                    
                    console.log(`[webhook] Subscription canceled but period active: customer=${customerId}, expires=${expiresAt}`);
                    
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
            // CHECKOUT COMPLETED (new subscription)
            // ============================================================
            case 'checkout.session.completed': {
                const session = stripeEvent.data.object as Stripe.Checkout.Session;
                
                if (session.mode === 'subscription' && session.subscription) {
                    const subscriptionId = typeof session.subscription === 'string'
                        ? session.subscription
                        : session.subscription.id;
                    
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const customerId = typeof subscription.customer === 'string'
                        ? subscription.customer
                        : subscription.customer.id;
                    
                    const newTier = determineTier(subscription);
                    const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                    
                    console.log(`[webhook] New subscription: customer=${customerId}, tier=${newTier}`);
                    
                    const result = await syncCustomerTier(customerId, newTier, expiresAt, true);
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ 
                            received: true, 
                            action: 'new_subscription',
                            tier: newTier,
                            pollsUpdated: result.updated 
                        }),
                    };
                }
                break;
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
                    console.log(`[webhook] Payment failed: customer=${customerId}`);
                    
                    // Don't immediately downgrade - Stripe will retry
                    // Just log for now, subscription.deleted will handle actual downgrade
                }
                break;
            }

            default:
                console.log(`[webhook] Unhandled event type: ${stripeEvent.type}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ received: true }),
        };

    } catch (error) {
        console.error('[webhook] Error processing event');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Webhook processing failed' }),
        };
    }
};
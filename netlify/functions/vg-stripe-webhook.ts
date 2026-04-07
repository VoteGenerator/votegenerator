// ============================================================================
// vg-stripe-webhook.ts - Handle Stripe subscription events
// Location: netlify/functions/vg-stripe-webhook.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';
import { createHmac } from 'crypto';

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


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
// GET STORE WITH EXPLICIT CREDENTIALS
// ============================================================================
function getCustomerStore() {
    const siteID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';
    
    if (!siteID || !token) {
        console.log('[webhook] Warning: Missing siteID or token for Blobs');
        console.log('[webhook] VG_SITE_ID: ' + (siteID ? 'set' : 'NOT SET'));
        console.log('[webhook] NETLIFY_AUTH_TOKEN: ' + (token ? 'set' : 'NOT SET'));
    }
    
    return getStore({
        name: 'vg-customers',
        siteID,
        token
    });
}

// ============================================================================
// DETERMINISTIC TOKEN GENERATION
// ============================================================================
function generateDashboardToken(sessionId: string): string {
    const secret = process.env.VOTE_TOKEN_SECRET;
    if (!secret) throw new Error('VOTE_TOKEN_SECRET not set');
    return 'vg_' + createHmac('sha256', secret).update(sessionId).digest('hex').substring(0, 32);
}

// ============================================================================
// DETERMINE TIER FROM PRICE ID
// ============================================================================
function determineTierFromPriceId(priceId: string): 'pro' | 'business' {
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
function determineTier(subscription: Stripe.Subscription): 'pro' | 'business' {
    const priceId = subscription.items.data[0]?.price?.id;
    
    if (priceId) {
        return determineTierFromPriceId(priceId);
    }

    const tierMeta = subscription.metadata?.tier;
    if (tierMeta === 'business') return 'business';
    
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
    if (!RESEND_API_KEY || !email) {
        console.log('[webhook] Skipping email - no API key or email');
        return false;
    }

    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.pro;
    const tierLabel = tierConfig.label;
    const responseLimit = tierConfig.maxResponses.toLocaleString();

    const baseUrl = process.env.URL || 'https://votegenerator.com';
    const dashboardUrl = baseUrl + '/admin?token=' + dashboardToken + '&session_id=' + sessionId;
    const manageUrl = baseUrl + '/.netlify/functions/vg-customer-portal?token=' + dashboardToken;
    const helpUrl = baseUrl + '/help';
    const createPollUrl = baseUrl + '/create';
    const templatesUrl = baseUrl + '/templates';

    let expirationDate = 'your subscription period';
    try {
        const d = new Date(expiresAt);
        if (!isNaN(d.getTime())) {
            expirationDate = d.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    } catch (e) {
        console.log('[webhook] Could not parse expiration date');
    }

    // Tier-specific features
    const proFeatures = [
        'Unlimited polls',
        responseLimit + ' responses per poll',
        'Hide VoteGenerator branding',
        'Custom thank you message',
        'CSV export',
        'Response filtering',
        'Advanced analytics',
    ];

    const businessFeatures = [
        ...proFeatures.slice(0, 2),
        'Custom branding with your logo',
        'Custom poll URL slugs',
        'Hourly response heatmap',
        'Cross-tab filtering',
        'Priority support',
    ];

    const features = tier === 'business' ? businessFeatures : proFeatures;

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
                        <div style="background: linear-gradient(135deg, ${tier === 'business' ? '#d97706 0%, #f59e0b' : '#6366f1 0%, #8b5cf6'} 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">🗳️ VoteGenerator</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Welcome to ${tierLabel}!</p>
                        </div>
                        
                        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
                            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Thank you for upgrading! Your ${tierLabel} account is now active and ready to use.
                            </p>
                            
                            <!-- Save Dashboard Link Warning -->
                            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <p style="margin: 0 0 12px 0; color: #92400e; font-weight: bold; font-size: 14px;">
                                    ⚠️ IMPORTANT: Save Your Dashboard Link!
                                </p>
                                <a href="${dashboardUrl}" 
                                   style="display: block; background: #f59e0b; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 16px;">
                                    Open My Dashboard →
                                </a>
                                <p style="margin: 12px 0 0 0; font-size: 11px; color: #92400e;">
                                    Bookmark this link to access your dashboard anytime!
                                </p>
                            </div>
                            
                            <!-- Quick Start Steps -->
                            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #166534; font-size: 16px;">🚀 Get Started in 3 Steps</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background: #22c55e; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px;">1</span>
                                        </td>
                                        <td style="padding: 8px 0; color: #334155;">
                                            <a href="${createPollUrl}" style="color: #166534; font-weight: 600; text-decoration: none;">Create your first poll</a> - takes 30 seconds!
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; vertical-align: top;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background: #22c55e; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px;">2</span>
                                        </td>
                                        <td style="padding: 8px 0; color: #334155;">
                                            Share the link with your audience
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; vertical-align: top;">
                                            <span style="display: inline-block; width: 24px; height: 24px; background: #22c55e; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; font-size: 12px;">3</span>
                                        </td>
                                        <td style="padding: 8px 0; color: #334155;">
                                            Watch real-time results in your dashboard
                                        </td>
                                    </tr>
                                </table>
                                <div style="margin-top: 12px;">
                                    <a href="${templatesUrl}" style="color: #166534; font-size: 13px;">💡 Or start from a template →</a>
                                </div>
                            </div>
                            
                            <!-- Your Plan Features -->
                            <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 16px;">✨ Your ${tierLabel} Features</h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569;">
                                    ${features.map(f => '<li style="margin-bottom: 6px;">' + f + '</li>').join('')}
                                </ul>
                                <p style="margin: 12px 0 0 0; color: #64748b; font-size: 13px;">
                                    Valid until <strong>${expirationDate}</strong>
                                </p>
                            </div>
                            
                            <!-- Quick Links -->
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-bottom: 16px;">
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="text-align: center; padding: 8px;">
                                            <a href="${dashboardUrl}" style="color: #6366f1; text-decoration: none; font-size: 14px;">
                                                📊 Dashboard
                                            </a>
                                        </td>
                                        <td style="text-align: center; padding: 8px;">
                                            <a href="${manageUrl}" style="color: #6366f1; text-decoration: none; font-size: 14px;">
                                                💳 Manage Plan
                                            </a>
                                        </td>
                                        <td style="text-align: center; padding: 8px;">
                                            <a href="${helpUrl}" style="color: #6366f1; text-decoration: none; font-size: 14px;">
                                                ❓ Help Center
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="color: #64748b; font-size: 14px; margin: 0;">
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
        console.log('[webhook] Saved session_...');

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
// MAIN WEBHOOK HANDLER
// ============================================================================
export const handler: Handler = async (event) => {
    const headers = { 'Content-Type': 'application/json' };

    console.log('[webhook] ====== WEBHOOK CALLED ======');
    console.log('[webhook] Method: ' + event.httpMethod);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const signature = event.headers['stripe-signature'];
    if (!signature || !WEBHOOK_SECRET) {
        console.error('[webhook] Missing signature or secret');
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing signature' }) };
    }

    let stripeEvent: Stripe.Event;
    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body || '', signature, WEBHOOK_SECRET);
        console.log('[webhook] Signature verified successfully');
    } catch (err: any) {
        console.error('[webhook] Signature failed: ' + err.message);
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid signature' }) };
    }

    console.log('[webhook] Event type: ' + stripeEvent.type);
    console.log('[webhook] Event ID: ' + stripeEvent.id);

    try {
        switch (stripeEvent.type) {
            // ============================================================
            // CHECKOUT COMPLETED
            // ============================================================
            case 'checkout.session.completed': {
                console.log('[webhook] Processing checkout.session.completed');
                
                const session = stripeEvent.data.object as Stripe.Checkout.Session;
                const metadata = session.metadata || {};

                const customerEmail = session.customer_email || session.customer_details?.email;
                const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

                let tier = metadata.tier || 'pro';
                const billing = metadata.billing || 'yearly';

                console.log('[webhook] Session ID: ' + session.id);
                console.log('[webhook] Metadata tier: ' + tier);
                console.log('[webhook] Metadata billing: ' + billing);
                console.log('[webhook] Customer email: ' + (customerEmail ? customerEmail.substring(0, 5) + '...' : 'none'));
                console.log('[webhook] Stripe customer ID: ' + stripeCustomerId);

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
                        tier = determineTierFromPriceId(priceId || '');
                        
                        // Safe date conversion
                        const endTimestamp = subscription.current_period_end;
                        if (endTimestamp && endTimestamp > 0) {
                            expiresAt = new Date(endTimestamp * 1000).toISOString();
                        } else {
                            const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                            expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                        }
                        console.log('[webhook] Subscription expires: ' + expiresAt);
                    } catch (subError: any) {
                        console.error('[webhook] Failed to fetch subscription: ' + subError.message);
                        const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                        expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                    }
                } else {
                    const days = billing === 'yearly' || billing === 'annual' ? 365 : 30;
                    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                }

                console.log('[webhook] Final tier: ' + tier);
                console.log('[webhook] Final expiresAt: ' + expiresAt);

                const dashboardToken = generateDashboardToken(session.id);
                console.log('[webhook] Generated token: ' + dashboardToken.substring(0, 15) + '...');

                // Send email
                if (customerEmail) {
                    console.log('[webhook] Sending welcome email...');
                    await sendWelcomeEmail(customerEmail, tier, dashboardToken, session.id, expiresAt);
                }

                // Register customer
                if (customerEmail) {
                    console.log('[webhook] Registering customer...');
                    await registerCustomer(customerEmail, tier, stripeCustomerId, session.id, dashboardToken, expiresAt);
                }

                console.log('[webhook] checkout.session.completed processed successfully');
                return { statusCode: 200, headers, body: JSON.stringify({ received: true, tier }) };
            }

            // ============================================================
            // SUBSCRIPTION UPDATED
            // ============================================================
            case 'customer.subscription.updated': {
                console.log('[webhook] Processing customer.subscription.updated');
                
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const newTier = determineTier(subscription);
                
                // Safe date conversion
                const endTimestamp = subscription.current_period_end;
                let expiresAt: string;
                if (endTimestamp && endTimestamp > 0) {
                    expiresAt = new Date(endTimestamp * 1000).toISOString();
                } else {
                    expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
                }
                
                console.log('[webhook] Tier: ' + newTier + ', expires: ' + expiresAt);
                
                // Just acknowledge - customer data is already set from checkout
                return { statusCode: 200, headers, body: JSON.stringify({ received: true, tier: newTier }) };
            }

            // ============================================================
            // SUBSCRIPTION DELETED
            // ============================================================
            case 'customer.subscription.deleted': {
                console.log('[webhook] Processing customer.subscription.deleted');
                return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
            }

            // ============================================================
            // PAYMENT FAILED
            // ============================================================
            case 'invoice.payment_failed': {
                console.log('[webhook] Payment failed');
                return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
            }

            default:
                console.log('[webhook] Unhandled: ' + stripeEvent.type);
                return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
        }
    } catch (error: any) {
        console.error('[webhook] ERROR: ' + error.message);
        console.error('[webhook] Stack: ' + error.stack);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Webhook processing failed' }) };
    }
};
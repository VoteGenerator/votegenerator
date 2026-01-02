// ============================================================================
// vg-stripe-webhook.ts - Handle Stripe webhooks
// Location: netlify/functions/vg-stripe-webhook.ts
// Processes checkout.session.completed to register customers
// ============================================================================

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    stripeSessionId: string;
    dashboardToken: string;
    expiresAt: string; // Plan expiration date
    polls: {
        id: string;
        adminKey: string;
        title: string;
        type: string;
        status: 'draft' | 'live';
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt?: string;
}

// Generate a unique dashboard token
const generateDashboardToken = (): string => {
    return crypto.randomBytes(12).toString('base64url');
};

// Get tier duration in days
const getTierDuration = (tier: string): number => {
    switch (tier) {
        case 'starter': return 30;
        case 'pro_event': return 60;
        case 'unlimited_event': return 30;
        case 'unlimited': return 365;
        default: return 7;
    }
};

// Get tier display label
const getTierLabel = (tier: string): string => {
    const labels: Record<string, string> = {
        starter: 'Starter',
        pro_event: 'Pro Event',
        unlimited_event: 'Unlimited Event',
        unlimited: 'Unlimited',
    };
    return labels[tier] || 'Starter';
};

// Send welcome email via Resend
const sendWelcomeEmail = async (
    email: string,
    tier: string,
    sessionId: string,
    expiresAt: string
): Promise<boolean> => {
    if (!RESEND_API_KEY) {
        console.log('Skipping email: No RESEND_API_KEY');
        return false;
    }
    
    const tierLabel = getTierLabel(tier);
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    const dashboardUrl = `${baseUrl}/admin?t=${sessionId}`; // sessionId is actually the token now
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    try {
        console.log(`Sending welcome email to ${email.substring(0, 5)}...`);
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'VoteGenerator <noreply@mail.votegenerator.com>',
                to: email,
                subject: `🗳️ Welcome to VoteGenerator ${tierLabel}!`,
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
                                    <li style="margin-bottom: 8px;">${tier === 'unlimited' || tier === 'unlimited_event' ? 'Unlimited polls' : tier === 'pro_event' ? '3 polls' : '1 poll'}</li>
                                    <li style="margin-bottom: 8px;">${tier === 'unlimited' || tier === 'unlimited_event' ? '10,000' : tier === 'pro_event' ? '2,000' : '500'} responses per poll</li>
                                    <li style="margin-bottom: 8px;">Valid until ${expirationDate}</li>
                                </ul>
                            </div>
                            
                            <p style="color: #64748b; font-size: 14px; margin: 0;">
                                Questions? Reply to this email or contact 
                                <a href="mailto:support@votegenerator.com" style="color: #6366f1;">support@votegenerator.com</a>
                            </p>
                        </div>
                        
                        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
                            © ${new Date().getFullYear()} VoteGenerator. All rights reserved.
                        </p>
                    </div>
                `,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Resend API error:', errorData);
            return false;
        }
        
        console.log('Welcome email sent successfully!');
        return true;
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        return false;
    }
};

// Map Stripe price IDs to tiers (using environment variables)
const getPriceToTier = (): Record<string, string> => {
    const mapping: Record<string, string> = {};
    
    if (process.env.STRIPE_PRICE_STARTER) {
        mapping[process.env.STRIPE_PRICE_STARTER] = 'starter';
    }
    if (process.env.STRIPE_PRICE_PRO_EVENT) {
        mapping[process.env.STRIPE_PRICE_PRO_EVENT] = 'pro_event';
    }
    if (process.env.STRIPE_PRICE_UNLIMITED) {
        mapping[process.env.STRIPE_PRICE_UNLIMITED] = 'unlimited';
    }
    
    return mapping;
};

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

    const sig = event.headers['stripe-signature'];
    
    if (!sig) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing Stripe signature' }),
        };
    }

    let stripeEvent: Stripe.Event;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            event.body || '',
            sig,
            endpointSecret
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        };
    }

    // Handle the event
    switch (stripeEvent.type) {
        case 'checkout.session.completed': {
            const session = stripeEvent.data.object as Stripe.Checkout.Session;
            
            console.log('Checkout session completed:', session.id);
            
            // Get customer email
            const email = session.customer_email || session.customer_details?.email;
            
            if (!email) {
                console.error('No email found in checkout session');
                break;
            }

            // Determine tier from line items
            let tier = 'starter'; // Default
            const priceToTier = getPriceToTier();
            
            if (session.line_items?.data?.[0]?.price?.id) {
                const priceId = session.line_items.data[0].price.id;
                tier = priceToTier[priceId] || 'starter';
            } else if (session.metadata?.tier) {
                tier = session.metadata.tier;
            }

            // Get or create customer record
            const customerStore = getStore({
                name: 'customers',
                siteID: process.env.VG_SITE_ID || '',
                token: process.env.NETLIFY_AUTH_TOKEN || ''
            });
            const normalizedEmail = email.toLowerCase().trim();

            let customer: CustomerRecord | null = null;
            try {
                customer = await customerStore.get(normalizedEmail, { type: 'json' }) as CustomerRecord | null;
            } catch {
                // Customer doesn't exist
            }

            // Calculate new expiration date
            const tierDays = getTierDuration(tier);
            let newExpiresAt: Date;

            if (customer && customer.expiresAt) {
                const currentExpiry = new Date(customer.expiresAt);
                const now = new Date();
                
                // If still active, EXTEND from current expiry (reward early renewal)
                // If expired, start from today
                if (currentExpiry > now) {
                    newExpiresAt = new Date(currentExpiry.getTime() + tierDays * 24 * 60 * 60 * 1000);
                    console.log(`Extending plan from ${currentExpiry.toISOString()} to ${newExpiresAt.toISOString()}`);
                } else {
                    newExpiresAt = new Date(now.getTime() + tierDays * 24 * 60 * 60 * 1000);
                    console.log(`Plan was expired, starting fresh from today until ${newExpiresAt.toISOString()}`);
                }
            } else {
                // New customer - start from today
                newExpiresAt = new Date(Date.now() + tierDays * 24 * 60 * 60 * 1000);
            }

            if (customer) {
                // Update existing customer
                customer.tier = tier;
                customer.stripeSessionId = session.id;
                customer.stripeCustomerId = session.customer as string;
                customer.expiresAt = newExpiresAt.toISOString();
                customer.updatedAt = new Date().toISOString();
            } else {
                // Create new customer
                customer = {
                    email: normalizedEmail,
                    tier,
                    stripeSessionId: session.id,
                    stripeCustomerId: session.customer as string,
                    dashboardToken: generateDashboardToken(),
                    expiresAt: newExpiresAt.toISOString(),
                    polls: [],
                    createdAt: new Date().toISOString(),
                };
            }

            await customerStore.setJSON(normalizedEmail, customer);
            
            // Also store by token for short URL lookup
            await customerStore.setJSON(`token_${customer.dashboardToken}`, customer);
            
            console.log(`Customer registered/updated: ${normalizedEmail} (${tier}) expires: ${customer.expiresAt}`);
            console.log(`Dashboard token: ${customer.dashboardToken}`);

            // Send welcome email with SHORT token URL
            const emailSent = await sendWelcomeEmail(
                normalizedEmail,
                tier,
                customer.dashboardToken, // Use token instead of session ID!
                customer.expiresAt
            );
            console.log(`Welcome email sent: ${emailSent}`);

            break;
        }

        case 'customer.subscription.updated': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            console.log('Subscription updated:', subscription.id);
            
            // Handle subscription updates (tier changes, cancellations, etc.)
            // You can expand this based on your needs
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            console.log('Subscription cancelled:', subscription.id);
            
            // Optionally downgrade customer or mark as expired
            break;
        }

        default:
            console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ received: true }),
    };
};
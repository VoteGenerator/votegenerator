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

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    stripeSessionId: string;
    dashboardToken: string;
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
            const customerStore = getStore('customers');
            const normalizedEmail = email.toLowerCase().trim();

            let customer: CustomerRecord | null = null;
            try {
                customer = await customerStore.get(normalizedEmail, { type: 'json' }) as CustomerRecord | null;
            } catch {
                // Customer doesn't exist
            }

            if (customer) {
                // Update existing customer
                customer.tier = tier;
                customer.stripeSessionId = session.id;
                customer.stripeCustomerId = session.customer as string;
                customer.updatedAt = new Date().toISOString();
            } else {
                // Create new customer
                customer = {
                    email: normalizedEmail,
                    tier,
                    stripeSessionId: session.id,
                    stripeCustomerId: session.customer as string,
                    dashboardToken: generateDashboardToken(),
                    polls: [],
                    createdAt: new Date().toISOString(),
                };
            }

            await customerStore.setJSON(normalizedEmail, customer);
            console.log(`Customer registered/updated: ${normalizedEmail} (${tier})`);

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
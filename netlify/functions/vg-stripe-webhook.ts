// ============================================================================
// vg-stripe-webhook.ts - MINIMAL VERSION FOR DEBUGGING
// ============================================================================
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export const handler: Handler = async (event) => {
    console.log('[webhook] === FUNCTION STARTED ===');
    
    const headers = { 'Content-Type': 'application/json' };

    if (event.httpMethod !== 'POST') {
        console.log('[webhook] Not POST, returning 405');
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const signature = event.headers['stripe-signature'];
    if (!signature || !WEBHOOK_SECRET) {
        console.log('[webhook] Missing signature or secret');
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing signature' }) };
    }

    let stripeEvent: Stripe.Event;
    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body || '', signature, WEBHOOK_SECRET);
        console.log('[webhook] Event verified: ' + stripeEvent.type);
    } catch (err: any) {
        console.log('[webhook] Signature failed: ' + err.message);
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid signature' }) };
    }

    try {
        if (stripeEvent.type === 'checkout.session.completed') {
            const session = stripeEvent.data.object as Stripe.Checkout.Session;
            const email = session.customer_email || session.customer_details?.email;
            const tier = session.metadata?.tier || 'pro';
            const billing = session.metadata?.billing || 'yearly';
            
            console.log('[webhook] Checkout completed!');
            console.log('[webhook] Email: ' + (email || 'none'));
            console.log('[webhook] Tier: ' + tier);
            console.log('[webhook] Billing: ' + billing);
            
            // Generate token
            const token = 'vg_' + session.id.replace('cs_', '').substring(0, 32);
            const dashboardUrl = (process.env.URL || 'https://votegenerator.com') + '/admin?token=' + token;
            
            // Send email
            if (email && RESEND_API_KEY) {
                console.log('[webhook] Sending email...');
                
                const tierLabel = tier === 'business' ? 'Business' : 'Pro';
                const responseLimit = tier === 'business' ? '100,000' : '10,000';
                
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + RESEND_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'VoteGenerator <noreply@mail.votegenerator.com>',
                        to: email,
                        subject: '🗳️ Welcome to VoteGenerator ' + tierLabel + '!',
                        html: '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;"><h1>Welcome to ' + tierLabel + '!</h1><p>Your dashboard is ready:</p><p><a href="' + dashboardUrl + '" style="background:#6366f1;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Open Dashboard</a></p><p style="font-size:12px;color:#666;word-break:break-all;">' + dashboardUrl + '</p><p>Your plan: Unlimited polls, ' + responseLimit + ' responses per poll</p></div>',
                    }),
                });
                
                if (res.ok) {
                    console.log('[webhook] Email sent!');
                } else {
                    const errText = await res.text();
                    console.log('[webhook] Email failed: ' + errText);
                }
            } else {
                console.log('[webhook] Skipping email - no email or no API key');
            }
            
            return { statusCode: 200, headers, body: JSON.stringify({ received: true, tier, email: !!email }) };
        }
        
        if (stripeEvent.type === 'customer.subscription.updated') {
            console.log('[webhook] Subscription updated - acknowledging');
            return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
        }
        
        if (stripeEvent.type === 'customer.subscription.deleted') {
            console.log('[webhook] Subscription deleted - acknowledging');
            return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
        }
        
        console.log('[webhook] Unhandled event: ' + stripeEvent.type);
        return { statusCode: 200, headers, body: JSON.stringify({ received: true }) };
        
    } catch (err: any) {
        console.log('[webhook] ERROR: ' + err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
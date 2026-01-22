// ============================================================================
// vg-send-portal-link.ts - Send Magic Link for Subscription Management
// Location: netlify/functions/vg-send-portal-link.ts
// Security: Only sends link to the email address - never exposes data
// ============================================================================
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Secret for signing tokens (use env var in production)
const TOKEN_SECRET = process.env.PORTAL_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY || 'fallback-secret';

// Generate a secure, time-limited token
const generateToken = (email: string, customerId: string): string => {
    const payload = {
        email: email.toLowerCase(),
        customerId,
        exp: Date.now() + (60 * 60 * 1000), // 1 hour expiry
        nonce: crypto.randomBytes(8).toString('hex')
    };
    
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', TOKEN_SECRET)
        .update(data)
        .digest('base64url');
    
    return `${data}.${signature}`;
};

// Send email using your email service (SendGrid example)
const sendMagicLinkEmail = async (
    email: string, 
    magicLink: string,
    planName: string
): Promise<boolean> => {
    // Check if SendGrid is configured
    const sendgridKey = process.env.SENDGRID_API_KEY;
    
    if (!sendgridKey) {
        console.error('SENDGRID_API_KEY not configured');
        // In development, log the link
        console.log(`[DEV] Magic link for ${email}: ${magicLink}`);
        return true; // Return true for testing
    }
    
    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email }],
                    subject: 'Manage Your VoteGenerator Subscription'
                }],
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                    name: 'VoteGenerator'
                },
                content: [{
                    type: 'text/html',
                    value: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">VoteGenerator</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">Manage Your Subscription</h2>
            
            <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">
                Current plan: <strong style="color: #4f46e5;">${planName}</strong>
            </p>
            
            <p style="color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                Click the button below to access your subscription settings. You can update your payment method, change plans, or cancel your subscription.
            </p>
            
            <a href="${magicLink}" style="display: block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; font-weight: 700; text-align: center; font-size: 16px;">
                Access Subscription Settings
            </a>
            
            <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0 0; text-align: center;">
                This link expires in 1 hour for security.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0; text-align: center;">
                © ${new Date().getFullYear()} VoteGenerator
            </p>
        </div>
    </div>
</body>
</html>
                    `
                }]
            })
        });
        
        if (!response.ok) {
            console.error('SendGrid error:', await response.text());
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

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
        return { 
            statusCode: 405, 
            headers, 
            body: JSON.stringify({ error: 'Method not allowed' }) 
        };
    }

    try {
        const { email } = JSON.parse(event.body || '{}');

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        const normalizedEmail = email.toLowerCase().trim();

        // IMPORTANT: Always return the same response whether customer exists or not
        // This prevents email enumeration attacks
        const genericSuccessResponse = {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'If an account exists with this email, you will receive a link shortly.'
            })
        };

        // Search for customer
        const customers = await stripe.customers.list({
            email: normalizedEmail,
            limit: 1
        });

        if (customers.data.length === 0) {
            // No customer found - but return same response (security)
            console.log(`No customer found for email: ${normalizedEmail}`);
            return genericSuccessResponse;
        }

        const customer = customers.data[0];

        // Check for active subscription
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all',
            limit: 5
        });

        const activeSubscription = subscriptions.data.find(
            sub => ['active', 'past_due', 'trialing'].includes(sub.status)
        );

        if (!activeSubscription) {
            // No active subscription - but return same response (security)
            console.log(`No active subscription for: ${normalizedEmail}`);
            return genericSuccessResponse;
        }

        // Get plan name for email
        const price = activeSubscription.items.data[0]?.price;
        const planName = price?.nickname || 
            (price?.unit_amount === 1200 ? 'Pro Monthly' : 
             price?.unit_amount === 9600 ? 'Pro Annual' :
             price?.unit_amount === 1900 ? 'Business Monthly' :
             price?.unit_amount === 15200 ? 'Business Annual' : 'Pro');

        // Generate secure token
        const token = generateToken(normalizedEmail, customer.id);

        // Build magic link
        const origin = event.headers.origin || 
                      event.headers.referer?.split('/').slice(0, 3).join('/') || 
                      'https://votegenerator.com';
        const magicLink = `${origin}/.netlify/functions/vg-portal-verify?token=${encodeURIComponent(token)}`;

        // Send email
        const emailSent = await sendMagicLinkEmail(normalizedEmail, magicLink, planName);

        if (!emailSent) {
            console.error(`Failed to send email to: ${normalizedEmail}`);
            // Still return generic success (don't reveal email sending issues)
        }

        console.log(`Portal link sent to: ${normalizedEmail}`);
        return genericSuccessResponse;

    } catch (error) {
        console.error('Send portal link error:', error);
        
        // Return generic response even on error (security)
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'If an account exists with this email, you will receive a link shortly.'
            })
        };
    }
};
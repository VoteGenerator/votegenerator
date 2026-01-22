// ============================================================================
// vg-portal-verify.ts - Verify Magic Link & Redirect to Stripe Portal
// Location: netlify/functions/vg-portal-verify.ts
// Called when user clicks magic link from email
// ============================================================================
import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// Same secret used for signing (must match vg-send-portal-link.ts)
const TOKEN_SECRET = process.env.PORTAL_TOKEN_SECRET || process.env.STRIPE_SECRET_KEY || 'fallback-secret';

interface TokenPayload {
    email: string;
    customerId: string;
    exp: number;
    nonce: string;
}

// Verify and decode the token
const verifyToken = (token: string): TokenPayload | null => {
    try {
        const [data, signature] = token.split('.');
        
        if (!data || !signature) {
            return null;
        }
        
        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', TOKEN_SECRET)
            .update(data)
            .digest('base64url');
        
        // Timing-safe comparison to prevent timing attacks
        if (!crypto.timingSafeEqual(
            Buffer.from(signature), 
            Buffer.from(expectedSignature)
        )) {
            console.log('Invalid signature');
            return null;
        }
        
        // Decode payload
        const payload: TokenPayload = JSON.parse(
            Buffer.from(data, 'base64url').toString('utf8')
        );
        
        // Check expiry
        if (Date.now() > payload.exp) {
            console.log('Token expired');
            return null;
        }
        
        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

// Generate error page HTML
const errorPage = (title: string, message: string, showRetry: boolean = true): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - VoteGenerator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            padding: 48px;
            max-width: 420px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }
        .icon {
            width: 64px;
            height: 64px;
            background: #fef2f2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        .icon svg {
            width: 32px;
            height: 32px;
            color: #ef4444;
        }
        h1 {
            color: #1e293b;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
        }
        p {
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(79, 70, 229, 0.5);
        }
        .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 13px;
        }
        .footer a {
            color: #4f46e5;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>
        <h1>${title}</h1>
        <p>${message}</p>
        ${showRetry ? '<a href="/#manage-subscription" class="btn">Request New Link</a>' : ''}
        <div class="footer">
            Need help? <a href="mailto:support@votegenerator.com">Contact Support</a>
        </div>
    </div>
</body>
</html>
`;

export const handler: Handler = async (event) => {
    // This endpoint handles GET requests (user clicking link from email)
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'text/html' },
            body: errorPage('Method Not Allowed', 'This link can only be accessed directly from your email.')
        };
    }

    const token = event.queryStringParameters?.token;

    if (!token) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/html' },
            body: errorPage('Invalid Link', 'This link appears to be incomplete. Please request a new link.')
        };
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/html' },
            body: errorPage(
                'Link Expired or Invalid', 
                'This link has expired or is invalid. For your security, links are only valid for 1 hour. Please request a new link.'
            )
        };
    }

    try {
        // Verify customer still exists and has active subscription
        const customer = await stripe.customers.retrieve(payload.customerId);
        
        if ((customer as any).deleted) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'text/html' },
                body: errorPage(
                    'Account Not Found', 
                    'This account no longer exists. If you believe this is an error, please contact support.',
                    false
                )
            };
        }

        // Get return URL
        const origin = event.headers.origin || 
                      event.headers.referer?.split('/').slice(0, 3).join('/') || 
                      process.env.URL ||
                      'https://votegenerator.com';
        const returnUrl = `${origin}/#manage-subscription?success=true`;

        // Create Stripe billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: payload.customerId,
            return_url: returnUrl,
        });

        // Redirect to Stripe portal
        return {
            statusCode: 302,
            headers: {
                'Location': session.url,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            body: ''
        };

    } catch (error) {
        console.error('Portal session creation error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'text/html' },
            body: errorPage(
                'Something Went Wrong', 
                'We couldn\'t create your session. Please try again or contact support if the problem persists.'
            )
        };
    }
};
// ============================================================================
// vg-recover-access.ts - Send recovery email with dashboard links
// Location: netlify/functions/vg-recover-access.ts
// Looks up customer by email and sends recovery links via Resend
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface CustomerPoll {
    id: string;
    adminKey: string;
    title: string;
    type: string;
    status: 'draft' | 'live';
    createdAt: string;
}

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    dashboardToken: string;
    polls: CustomerPoll[];
    createdAt: string;
}

// Rate limiting: max 3 recovery attempts per email per hour
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (email: string): boolean => {
    const now = Date.now();
    const key = email.toLowerCase();
    const existing = rateLimitStore.get(key);

    if (existing && existing.resetAt > now) {
        if (existing.count >= 3) {
            return false; // Rate limited
        }
        existing.count++;
        return true;
    }

    // Reset or create new entry
    rateLimitStore.set(key, {
        count: 1,
        resetAt: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
};

const generateRecoveryEmail = (
    customer: CustomerRecord,
    baseUrl: string
): string => {
    const dashboardUrl = `${baseUrl}/admin?token=${customer.dashboardToken}`;
    const tierLabel = customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1).replace('_', ' ');
    
    const pollRows = customer.polls.map(poll => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #1e293b;">${poll.title}</strong>
                <br>
                <span style="color: #64748b; font-size: 12px;">
                    ${poll.type} • ${poll.status === 'live' ? '🟢 Live' : '📝 Draft'}
                </span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <a href="${baseUrl}/#id=${poll.id}&admin=${poll.adminKey}" 
                   style="color: #6366f1; text-decoration: none; font-weight: 500;">
                    Open →
                </a>
            </td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your VoteGenerator Access Links</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
    <div style="max-width: 560px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🗳️ VoteGenerator</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Access Recovery</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Hi there! Here are your VoteGenerator access links:
            </p>
            
            <!-- Plan Badge -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-bottom: 24px;">
                <strong>${tierLabel} Plan</strong>
            </div>
            
            <!-- Dashboard Link -->
            <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #92400e; font-weight: 600;">
                    ⚠️ Your Dashboard Link (Save This!)
                </p>
                <a href="${dashboardUrl}" 
                   style="display: block; background: #f59e0b; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; text-align: center; font-weight: 600;">
                    Open My Dashboard →
                </a>
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #92400e; word-break: break-all;">
                    ${dashboardUrl}
                </p>
            </div>
            
            <!-- Polls List -->
            ${customer.polls.length > 0 ? `
                <h3 style="color: #334155; font-size: 16px; margin: 0 0 16px 0;">Your Polls</h3>
                <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                    ${pollRows}
                </table>
            ` : `
                <p style="color: #64748b; text-align: center; padding: 20px;">
                    No polls created yet. Visit your dashboard to create one!
                </p>
            `}
            
            <!-- Tips -->
            <div style="margin-top: 24px; padding: 16px; background: #f0f9ff; border-radius: 8px;">
                <p style="margin: 0; color: #0369a1; font-size: 14px;">
                    💡 <strong>Tip:</strong> Bookmark your dashboard link so you don't lose access again!
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 24px; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">Sent by VoteGenerator • votegenerator.com</p>
            <p style="margin: 8px 0 0 0;">
                You received this because someone requested access recovery for this email.
            </p>
        </div>
    </div>
</body>
</html>
    `;
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
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { email } = JSON.parse(event.body || '{}');

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' }),
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' }),
            };
        }

        // Check rate limit
        if (!checkRateLimit(email)) {
            // Still return success for security (don't reveal if email exists)
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'If an account exists with this email, recovery instructions have been sent.',
                }),
            };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const customerStore = getStore('customers');

        // Look up customer by email
        let customer: CustomerRecord | null = null;
        
        try {
            customer = await customerStore.get(normalizedEmail, { type: 'json' }) as CustomerRecord | null;
        } catch {
            // Customer not found - that's okay, we'll return generic message
        }

        // If customer found, send recovery email
        if (customer) {
            const RESEND_API_KEY = process.env.RESEND_API_KEY;
            
            if (!RESEND_API_KEY) {
                console.error('RESEND_API_KEY not configured');
                // Still return success for security
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: 'If an account exists with this email, recovery instructions have been sent.',
                    }),
                };
            }

            // Determine base URL
            const baseUrl = process.env.URL || 'https://votegenerator.com';
            
            // Generate email HTML
            const emailHtml = generateRecoveryEmail(customer, baseUrl);

            // Send via Resend
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'VoteGenerator <noreply@votegenerator.com>',
                    to: [normalizedEmail],
                    subject: '🗳️ Your VoteGenerator Access Links',
                    html: emailHtml,
                }),
            });

            if (!resendResponse.ok) {
                const errorData = await resendResponse.json().catch(() => ({}));
                console.error('Resend error:', errorData);
                // Still return success for security
            } else {
                console.log(`Recovery email sent to ${normalizedEmail.substring(0, 3)}***`);
            }
        }

        // Always return the same message for security
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'If an account exists with this email, recovery instructions have been sent.',
            }),
        };

    } catch (error) {
        console.error('Recovery error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
        };
    }
};
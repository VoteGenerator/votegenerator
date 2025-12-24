// ============================================================================
// vg-recover-access.ts - Lost Link Recovery API
// Location: netlify/functions/vg-recover-access.ts
// Looks up polls by Stripe customer email, sends recovery email via Resend
// ============================================================================

import { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Your database/storage imports here
// import { db } from '../lib/database';

interface PurchaseRecord {
    email: string;
    tier: string;
    polls: Array<{
        id: string;
        adminKey: string;
        title: string;
        createdAt: string;
    }>;
    stripeCustomerId?: string;
    createdAt: string;
}

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
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

        if (!email || typeof email !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Look up purchase records by email
        // Replace with your actual database lookup
        const purchaseRecord = await lookupPurchaseByEmail(normalizedEmail);

        if (!purchaseRecord || purchaseRecord.polls.length === 0) {
            // Don't reveal whether email exists (security best practice)
            // But we return 404 so the UI can show appropriate message
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    error: 'No paid account found with this email address.' 
                })
            };
        }

        // Generate recovery email HTML
        const emailHtml = generateRecoveryEmail(purchaseRecord);

        // Send email via Resend
        const { error: sendError } = await resend.emails.send({
            from: 'VoteGenerator <noreply@votegenerator.com>', // Update with your domain
            to: normalizedEmail,
            subject: '🔗 Your VoteGenerator Poll Links',
            html: emailHtml
        });

        if (sendError) {
            console.error('Resend error:', sendError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to send email. Please try again.' })
            };
        }

        // Log recovery request (optional, for analytics)
        await logRecoveryRequest(normalizedEmail);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: `Recovery email sent! Check ${maskEmail(normalizedEmail)} for your poll links.`
            })
        };

    } catch (error) {
        console.error('Recovery error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'An error occurred. Please try again.' })
        };
    }
};

// ============================================================================
// Helper Functions
// ============================================================================

function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
}

function generateRecoveryEmail(record: PurchaseRecord): string {
    const baseUrl = process.env.URL || 'https://votegenerator.com';
    const tierLabels: Record<string, string> = {
        starter: 'Starter',
        pro_event: 'Pro Event',
        unlimited: 'Unlimited'
    };
    const tierLabel = tierLabels[record.tier] || record.tier;

    const pollLinks = record.polls.map(poll => `
        <tr>
            <td style="padding: 16px; border-bottom: 1px solid #e2e8f0;">
                <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">
                    ${escapeHtml(poll.title)}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
                    Created: ${new Date(poll.createdAt).toLocaleDateString()}
                </div>
                <a href="${baseUrl}/#id=${poll.id}&admin=${poll.adminKey}" 
                   style="display: inline-block; padding: 8px 16px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    Open Admin Dashboard →
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
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
            <img src="${baseUrl}/logo.png" alt="VoteGenerator" style="width: 60px; height: 60px; margin-bottom: 16px;">
            <h1 style="color: #1e293b; font-size: 24px; margin: 0;">Your Poll Links</h1>
        </div>

        <!-- Main Card -->
        <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Plan Badge -->
            <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); padding: 16px; text-align: center;">
                <span style="color: white; font-weight: 600; font-size: 14px;">
                    ${tierLabel} Plan
                </span>
            </div>

            <!-- Content -->
            <div style="padding: 24px;">
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Hi there! 👋 Here are your VoteGenerator poll links. Bookmark them this time!
                </p>

                <!-- Poll Links Table -->
                <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                    ${pollLinks}
                </table>

                <!-- Tip Box -->
                <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin-top: 24px;">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="font-size: 20px;">💡</span>
                        <div>
                            <div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">Pro Tip</div>
                            <div style="color: #a16207; font-size: 14px;">
                                Bookmark your admin links or save this email. You can also add them to your password manager!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">
                You're receiving this because you requested a link recovery.
            </p>
            <p style="margin: 0;">
                VoteGenerator • Quick polls, instant results
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// Database Functions - Replace with your actual implementation
// ============================================================================

async function lookupPurchaseByEmail(email: string): Promise<PurchaseRecord | null> {
    // Option 1: Using Netlify Blobs
    // const { getStore } = await import('@netlify/blobs');
    // const store = getStore('purchases');
    // const record = await store.get(email, { type: 'json' });
    // return record;

    // Option 2: Using Supabase
    // const { data } = await supabase
    //     .from('purchases')
    //     .select('*, polls(*)')
    //     .eq('email', email)
    //     .single();
    // return data;

    // Option 3: Using your existing poll storage
    // Look up all polls and filter by creator email
    // This depends on how you store polls

    // Placeholder - replace with actual implementation
    console.log('Looking up:', email);
    return null;
}

async function logRecoveryRequest(email: string): Promise<void> {
    // Optional: Log recovery requests for analytics
    // await db.recoveryLogs.create({ email, timestamp: new Date() });
    console.log('Recovery requested for:', maskEmail(email));
}
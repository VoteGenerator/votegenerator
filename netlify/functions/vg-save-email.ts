// ============================================================================
// vg-save-email.ts - Save email with verification (like paid flow)
// Location: netlify/functions/vg-save-email.ts
//
// Two-step verification:
// 1. User enters email → we send 6-char code
// 2. User enters code → we save email + send admin link
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Generate 6-character verification code
const generateCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars: I, O, 0, 1
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

// Send email via SendGrid
const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (!sendgridKey) {
        console.error('[SaveEmail] No SendGrid API key');
        return false;
    }

    try {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }], subject }],
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                    name: 'VoteGenerator',
                },
                content: [{ type: 'text/html', value: html }],
            }),
        });

        return res.ok;
    } catch (err) {
        console.error('[SaveEmail] SendGrid error:', err);
        return false;
    }
};

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    try {
        const { email, pollId, pollTitle, adminUrl, action, verificationCode } = JSON.parse(event.body || '{}');

        if (!email || !pollId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: 'Missing required fields' }),
            };
        }

        const emailLower = email.toLowerCase().trim();

        const verificationStore = getStore({
            name: 'email-verifications',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        const customerStore = getStore({
            name: 'customers',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        const pollStore = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        // ================================================================
        // ACTION: SEND VERIFICATION CODE
        // ================================================================
        if (action === 'send_code') {
            const code = generateCode();
            const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

            // Store pending verification
            await verificationStore.setJSON(`pending:${emailLower}:${pollId}`, {
                code,
                email: emailLower,
                pollId,
                pollTitle,
                adminUrl,
                createdAt: new Date().toISOString(),
                expiresAt,
            });

            // Send verification email
            const emailSent = await sendEmail(
                emailLower,
                '🔐 Your VoteGenerator Verification Code',
                `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f8fafc;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Verification Code</h1>
        </div>
        <div style="padding: 32px;">
            <p style="color: #475569; margin-bottom: 24px;">Enter this code to save your poll access:</p>
            
            <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">
                    ${code}
                </span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">
                This code expires in <strong>24 hours</strong>.
            </p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                    <strong>Poll:</strong> ${pollTitle || 'Your Poll'}
                </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px;">
                If you didn't request this, you can ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
                `
            );

            if (!emailSent) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ success: false, error: 'Failed to send email. Please try again.' }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Verification code sent' }),
            };
        }

        // ================================================================
        // ACTION: VERIFY CODE AND SAVE
        // ================================================================
        if (action === 'verify') {
            if (!verificationCode) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, error: 'Verification code required' }),
                };
            }

            // Get pending verification
            const pending = await verificationStore.get(`pending:${emailLower}:${pollId}`, { type: 'json' }) as any;

            if (!pending) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, error: 'No pending verification. Please request a new code.' }),
                };
            }

            // Check expiration
            if (Date.now() > pending.expiresAt) {
                await verificationStore.delete(`pending:${emailLower}:${pollId}`);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, error: 'Code expired. Please request a new one.' }),
                };
            }

            // Check code
            if (verificationCode.toUpperCase() !== pending.code) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, error: 'Invalid code. Please check and try again.' }),
                };
            }

            // ✅ Code valid! Save email to customer record

            // Get or create customer
            let customer = await customerStore.get(emailLower, { type: 'json' }) as any;
            if (!customer) {
                customer = {
                    email: emailLower,
                    tier: 'free',
                    polls: [],
                    createdAt: new Date().toISOString(),
                };
            }

            // Add poll to customer's list if not already there
            if (!customer.polls.includes(pollId)) {
                customer.polls.push(pollId);
            }

            await customerStore.setJSON(emailLower, customer);

            // Update poll with creator email
            const poll = await pollStore.get(pollId, { type: 'json' }) as any;
            if (poll) {
                poll.creatorEmail = emailLower;
                await pollStore.setJSON(pollId, poll);
            }

            // Delete pending verification
            await verificationStore.delete(`pending:${emailLower}:${pollId}`);

            // Send confirmation email with admin link
            await sendEmail(
                emailLower,
                '✅ Your VoteGenerator Poll Access Saved',
                `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f8fafc;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Access Saved!</h1>
        </div>
        <div style="padding: 32px;">
            <p style="color: #475569; margin-bottom: 16px;">
                Your email has been verified. Here's your admin link:
            </p>
            
            <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #92400e; font-size: 13px; margin: 0 0 8px 0;">
                    <strong>Poll:</strong> ${pending.pollTitle || 'Your Poll'}
                </p>
                <a href="${pending.adminUrl}" style="color: #4f46e5; word-break: break-all; font-size: 14px;">
                    ${pending.adminUrl}
                </a>
            </div>
            
            <a href="${pending.adminUrl}" style="display: block; background: #4f46e5; color: white; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 24px;">
                Go to Dashboard →
            </a>
            
            <p style="color: #64748b; font-size: 13px;">
                <strong>Save this email!</strong> You can use the /recover page if you ever lose access.
            </p>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                VoteGenerator • Free polls & surveys
            </p>
        </div>
    </div>
</body>
</html>
                `
            );

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: 'Email verified and saved!' }),
            };
        }

        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid action' }),
        };

    } catch (err) {
        console.error('[SaveEmail] Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Something went wrong' }),
        };
    }
};
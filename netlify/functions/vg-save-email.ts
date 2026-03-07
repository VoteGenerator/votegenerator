// ============================================================================
// vg-save-email.ts - Save email with verification for free users
// Location: netlify/functions/vg-save-email.ts
//
// Two-step verification:
// 1. send_code: User enters email → we send 6-char code
// 2. verify: User enters code → we save email + link polls
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// NOTE: The bare getStore('name') shorthand only works during builds,
// NOT in deployed functions! Always pass siteID and token.
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

// Generate 6-character verification code
const generateCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
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
        console.error('[vg-save-email] No SENDGRID_API_KEY configured');
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
                personalizations: [{ to: [{ email: to }] }],
                from: {
                    email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                    name: 'VoteGenerator',
                },
                subject: subject,
                content: [{ type: 'text/html', value: html }],
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('[vg-save-email] SendGrid error:', res.status, errorText);
            return false;
        }

        console.log('[vg-save-email] Email sent successfully');
        return true;
    } catch (err) {
        console.error('[vg-save-email] SendGrid exception:', err);
        return false;
    }
};

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('[vg-save-email] Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { 
            email, 
            action, 
            code,              // Frontend sends 'code'
            verificationCode,  // Or 'verificationCode' - accept both
            pollId,            // Optional
        } = body;

        // Accept either 'code' or 'verificationCode'
        const submittedCode = code || verificationCode;

        if (!email || !email.includes('@')) {
            console.log('[vg-save-email] Invalid email');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Valid email address required' }),
            };
        }

        const emailLower = email.toLowerCase().trim();
        console.log('[vg-save-email] Action:', action, 'Email:', emailLower.substring(0, 5) + '***');
        console.log('[vg-save-email] Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        // Initialize stores with proper credentials
        const verificationStore = getStore({
            name: 'email-verifications',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const customerStore = getStore({
            name: 'customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // ================================================================
        // ACTION: SEND VERIFICATION CODE
        // ================================================================
        if (action === 'send_code') {
            const newCode = generateCode();
            const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

            // Store pending verification - use sanitized email as key
            const verificationKey = `pending_${emailLower.replace(/[^a-z0-9]/gi, '_')}`;
            
            await verificationStore.setJSON(verificationKey, {
                code: newCode,
                email: emailLower,
                pollId: pollId || null,
                createdAt: new Date().toISOString(),
                expiresAt,
            });

            console.log('[vg-save-email] Stored verification code');

            // Send verification email
            const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f8fafc; margin: 0;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Verification Code</h1>
        </div>
        <div style="padding: 32px;">
            <p style="color: #475569; margin-bottom: 24px; font-size: 16px;">
                Enter this code to save your poll access:
            </p>
            
            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; border: 2px dashed #cbd5e1;">
                <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">
                    ${newCode}
                </span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">
                ⏰ This code expires in <strong>24 hours</strong>.
            </p>
            
            <div style="background: #ecfdf5; border-radius: 8px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #10b981;">
                <p style="color: #065f46; font-size: 13px; margin: 0;">
                    ✓ After verification, recover your polls anytime at <strong>votegenerator.com/recover</strong>
                </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>
    </div>
</body>
</html>`;

            const emailSent = await sendEmail(
                emailLower,
                `Your VoteGenerator Verification Code: ${newCode}`,
                emailHtml
            );

            if (!emailSent) {
                console.error('[vg-save-email] Failed to send email');
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to send verification email. Please try again.' }),
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Verification code sent' 
                }),
            };
        }

        // ================================================================
        // ACTION: VERIFY CODE
        // ================================================================
        if (action === 'verify') {
            if (!submittedCode) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Verification code required' }),
                };
            }

            const verificationKey = `pending_${emailLower.replace(/[^a-z0-9]/gi, '_')}`;
            
            let pending: any;
            try {
                pending = await verificationStore.get(verificationKey, { type: 'json' });
            } catch (e) {
                console.log('[vg-save-email] No pending verification found');
                pending = null;
            }

            if (!pending) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No verification pending. Please request a new code.' }),
                };
            }

            // Check expiration
            if (Date.now() > pending.expiresAt) {
                await verificationStore.delete(verificationKey);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Code expired. Please request a new one.' }),
                };
            }

            // Check code match (case insensitive)
            if (submittedCode.toUpperCase() !== pending.code.toUpperCase()) {
                console.log('[vg-save-email] Code mismatch');
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid code. Please check and try again.' }),
                };
            }

            console.log('[vg-save-email] Code verified successfully');

            // Code is valid! Create/update customer record
            const customerId = `free_${emailLower.replace(/[^a-z0-9]/gi, '_')}`;
            
            // Check for existing customer
            let customerData: any = null;
            try {
                customerData = await customerStore.get(customerId, { type: 'json' });
            } catch (e) {
                customerData = null;
            }

            if (!customerData) {
                // Create new customer
                customerData = {
                    id: customerId,
                    email: emailLower,
                    tier: 'free',
                    createdAt: new Date().toISOString(),
                    polls: [],
                };
            }

            // Update customer with verified email
            customerData.emailVerified = true;
            customerData.emailVerifiedAt = new Date().toISOString();

            // Save customer
            await customerStore.setJSON(customerId, customerData);

            // Clean up verification
            await verificationStore.delete(verificationKey);

            // Send confirmation email
            const confirmHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f8fafc; margin: 0;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Email Verified!</h1>
        </div>
        <div style="padding: 32px;">
            <p style="color: #475569; margin-bottom: 24px; font-size: 16px;">
                Your email has been verified. You can now recover your polls anytime!
            </p>
            
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
                <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 16px;">🔑 How to recover your polls:</h3>
                <ol style="color: #15803d; font-size: 14px; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Visit <a href="https://votegenerator.com/recover" style="color: #059669; font-weight: bold;">votegenerator.com/recover</a></li>
                    <li style="margin-bottom: 8px;">Enter this email address</li>
                    <li>Verify with a code and access your polls!</li>
                </ol>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px;">
                Keep this email for your records.
            </p>
        </div>
    </div>
</body>
</html>`;

            await sendEmail(
                emailLower,
                '✅ VoteGenerator Email Verified',
                confirmHtml
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Email verified successfully',
                    email: emailLower,
                }),
            };
        }

        // Unknown action
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action. Use "send_code" or "verify".' }),
        };

    } catch (err) {
        console.error('[vg-save-email] Handler error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
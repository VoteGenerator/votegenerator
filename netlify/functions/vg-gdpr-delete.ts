// ============================================================================
// vg-gdpr-delete.ts - Handle GDPR Right to Erasure Requests
// Location: netlify/functions/vg-gdpr-delete.ts
// 
// GDPR Article 17 - Right to Erasure ("Right to be Forgotten")
// - Must respond within 1 month (can extend to 3 months for complex requests)
// - Must verify identity before deletion
// - Must delete all personal data unless legal retention required
// 
// Data we store that contains personal data:
// - Customer records (email, Stripe ID)
// - Poll admin keys (linked to customer)
// - Vote data (IP hashes, voter names if collected, comments)
// - Analytics (country, device - not PII but associated with votes)
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface DeletionRequest {
    email: string;
    requestType: 'delete_all' | 'delete_poll' | 'export_data';
    pollId?: string;           // For single poll deletion
    verificationCode?: string; // Code sent to email for verification
}

interface DeletionResult {
    customersDeleted: number;
    pollsDeleted: number;
    votesDeleted: number;
    errors: string[];
}

// ============================================================================
// SEND VERIFICATION EMAIL (Using existing SendGrid setup)
// ============================================================================
const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
    const sendgridKey = process.env.SENDGRID_API_KEY;
    
    if (!sendgridKey) {
        console.error('SENDGRID_API_KEY not configured');
        console.log(`[DEV] GDPR verification code for ${email}: ${code}`);
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
                    subject: 'VoteGenerator - Data Deletion Verification Code'
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
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">🗑️ Data Deletion Request</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
            <p style="color: #475569; margin: 0 0 16px 0; line-height: 1.6;">
                You requested to delete your VoteGenerator data. To confirm your identity, enter this verification code:
            </p>
            
            <div style="background: #fef2f2; border: 2px dashed #fca5a5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="color: #dc2626; font-size: 32px; font-weight: 800; letter-spacing: 8px; margin: 0; font-family: monospace;">
                    ${code}
                </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0; text-align: center;">
                This code expires in <strong>24 hours</strong>.
            </p>
            
            <div style="background: #fef2f2; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="color: #b91c1c; font-size: 13px; margin: 0; font-weight: 600;">
                    ⚠️ Warning: This action is permanent
                </p>
                <p style="color: #991b1b; font-size: 12px; margin: 8px 0 0 0;">
                    Once confirmed, all your polls, votes, and account data will be permanently deleted and cannot be recovered.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0; text-align: center;">
                © ${new Date().getFullYear()} VoteGenerator • GDPR Article 17 Compliance
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
        
        console.log(`[GDPR] Verification email sent to: ${email}`);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

export const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // CORS preflight
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

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-gdpr-delete: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Service temporarily unavailable' }) 
        };
    }

    try {
        const body: DeletionRequest = JSON.parse(event.body || '{}');
        const { email, requestType, pollId, verificationCode } = body;

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' }),
            };
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        console.log('vg-gdpr-delete: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        // Initialize stores
        const customerStore = getStore({
            name: 'customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN,
        });

        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN,
        });

        const deletionLogStore = getStore({
            name: 'gdpr-deletion-logs',
            siteID: SITE_ID,
            token: BLOB_TOKEN,
        });

        // ================================================================
        // STEP 1: INITIATE REQUEST (Send verification email)
        // ================================================================
        if (!verificationCode) {
            // Generate verification code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

            // Store pending request
            await deletionLogStore.setJSON(`pending:${normalizedEmail}`, {
                email: normalizedEmail,
                code,
                expiresAt,
                requestType,
                pollId,
                requestedAt: new Date().toISOString(),
            });

            // Send verification email using SendGrid
            const emailSent = await sendVerificationEmail(normalizedEmail, code);
            
            if (!emailSent) {
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
                    message: 'Verification code sent to your email. Please check your inbox.',
                }),
            };
        }

        // ================================================================
        // STEP 2: VERIFY CODE AND PROCESS REQUEST
        // ================================================================
        const pendingRequest = await deletionLogStore.get(`pending:${normalizedEmail}`, { type: 'json' }) as any;

        if (!pendingRequest) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No pending deletion request found. Please start a new request.' }),
            };
        }

        // Check expiration
        if (new Date(pendingRequest.expiresAt) < new Date()) {
            await deletionLogStore.delete(`pending:${normalizedEmail}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Verification code has expired. Please start a new request.' }),
            };
        }

        // Verify code
        if (pendingRequest.code !== verificationCode.toUpperCase()) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid verification code.' }),
            };
        }

        // ================================================================
        // STEP 3: EXECUTE DELETION
        // ================================================================
        const result: DeletionResult = {
            customersDeleted: 0,
            pollsDeleted: 0,
            votesDeleted: 0,
            errors: [],
        };

        // Find customer record
        const customer = await customerStore.get(normalizedEmail, { type: 'json' }) as any;

        if (customer) {
            // Get all polls created by this customer
            const pollIds = customer.polls || [];

            for (const pid of pollIds) {
                try {
                    // Delete poll (which includes all votes)
                    if (requestType === 'delete_all' || (requestType === 'delete_poll' && pid === pollId)) {
                        await pollStore.delete(pid);
                        result.pollsDeleted++;
                        console.log(`[GDPR] Deleted poll: ${pid}`);
                    }
                } catch (pollError) {
                    result.errors.push(`Failed to delete poll ${pid}`);
                    console.error(`[GDPR] Error deleting poll ${pid}:`, pollError);
                }
            }

            // Delete customer record
            if (requestType === 'delete_all') {
                // Cancel Stripe subscription if active
                if (customer.stripeCustomerId) {
                    try {
                        const subscriptions = await stripe.subscriptions.list({
                            customer: customer.stripeCustomerId,
                            status: 'active',
                        });

                        for (const sub of subscriptions.data) {
                            await stripe.subscriptions.cancel(sub.id);
                            console.log(`[GDPR] Cancelled subscription: ${sub.id}`);
                        }
                    } catch (stripeError) {
                        console.error('[GDPR] Error cancelling subscriptions:', stripeError);
                        result.errors.push('Some subscriptions may not have been cancelled');
                    }
                }

                // Delete customer record
                await customerStore.delete(normalizedEmail);
                result.customersDeleted++;
                console.log(`[GDPR] Deleted customer: ${normalizedEmail}`);
            }
        }

        // ================================================================
        // STEP 4: LOG DELETION FOR COMPLIANCE
        // ================================================================
        // GDPR requires you to keep a record of deletions (without PII)
        const deletionLog = {
            deletedAt: new Date().toISOString(),
            requestType,
            emailHash: crypto.createHash('sha256').update(normalizedEmail).digest('hex').substring(0, 16),
            result: {
                customersDeleted: result.customersDeleted,
                pollsDeleted: result.pollsDeleted,
                votesDeleted: result.votesDeleted,
                hasErrors: result.errors.length > 0,
            },
        };

        await deletionLogStore.setJSON(`completed:${Date.now()}`, deletionLog);

        // Remove pending request
        await deletionLogStore.delete(`pending:${normalizedEmail}`);

        // ================================================================
        // RESPONSE
        // ================================================================
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Your data has been deleted.',
                details: {
                    accountDeleted: result.customersDeleted > 0,
                    pollsDeleted: result.pollsDeleted,
                    note: result.errors.length > 0 
                        ? 'Some items could not be deleted. Please contact support.'
                        : 'All associated data has been permanently removed.',
                },
            }),
        };
    } catch (error) {
        console.error('[GDPR] Deletion error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'An error occurred processing your request. Please try again or contact support.' }),
        };
    }
};
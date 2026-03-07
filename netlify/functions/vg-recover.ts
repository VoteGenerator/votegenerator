// ============================================================================
// vg-recover.ts - Poll Recovery via Email Verification
// Location: netlify/functions/vg-recover.ts
// 
// This function allows users to recover their polls by verifying their email.
// Flow:
// 1. User enters email on /recover page
// 2. Backend sends 6-digit verification code
// 3. User enters code
// 4. Backend returns all polls associated with that email
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

// SendGrid for emails
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@mail.votegenerator.com';

// Generate 6-character alphanumeric code
function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Send email via SendGrid
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY not configured');
        return false;
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: FROM_EMAIL, name: 'VoteGenerator' },
                subject,
                content: [{ type: 'text/html', value: html }]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('SendGrid error:', error);
        return false;
    }
}

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
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
        console.error('vg-recover: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { action, email, code } = body;

        if (!email || !email.includes('@')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Valid email required' })
            };
        }

        const normalizedEmail = email.toLowerCase().trim();

        console.log('vg-recover: Action:', action);
        console.log('vg-recover: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        // Initialize blob stores
        const customersStore = getStore({
            name: 'customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const pollsStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const verificationStore = getStore({
            name: 'recovery-verifications',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // ========================================
        // ACTION: send_code
        // ========================================
        if (action === 'send_code') {
            // First, check if this email has any polls
            // Look through customers to find one with this email
            let customerData: any = null;
            let customerId: string | null = null;

            // Try to find customer by email
            // We'll need to scan - in production you'd have an email index
            try {
                const { blobs } = await customersStore.list();
                
                for (const blob of blobs) {
                    try {
                        const data = await customersStore.get(blob.key, { type: 'json' });
                        if (data && data.email && data.email.toLowerCase() === normalizedEmail) {
                            customerData = data;
                            customerId = blob.key;
                            break;
                        }
                    } catch (e) {
                        // Skip invalid entries
                    }
                }
            } catch (e) {
                console.error('Error scanning customers:', e);
            }

            // Also check polls directly for this email
            const pollsWithEmail: any[] = [];
            try {
                const { blobs } = await pollsStore.list();
                
                for (const blob of blobs) {
                    try {
                        const poll = await pollsStore.get(blob.key, { type: 'json' });
                        if (poll && poll.creatorEmail && poll.creatorEmail.toLowerCase() === normalizedEmail) {
                            pollsWithEmail.push({
                                id: poll.id || blob.key,
                                adminKey: poll.adminKey,
                                title: poll.title || 'Untitled Poll',
                                type: poll.type || 'multiple',
                                createdAt: poll.createdAt,
                                responseCount: poll.votes?.length || poll.responseCount || 0,
                                status: poll.status || 'live'
                            });
                        }
                    } catch (e) {
                        // Skip invalid entries
                    }
                }
            } catch (e) {
                console.error('Error scanning polls:', e);
            }

            // Merge polls from customer record and direct scan
            const allPolls = [...pollsWithEmail];
            if (customerData?.polls) {
                for (const poll of customerData.polls) {
                    if (!allPolls.find(p => p.id === poll.id)) {
                        allPolls.push(poll);
                    }
                }
            }

            if (allPolls.length === 0 && !customerData) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ 
                        error: 'No polls found for this email address',
                        hint: 'Make sure you saved your polls to this email address'
                    })
                };
            }

            // Generate verification code
            const verificationCode = generateCode();
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

            // Store verification
            const verificationKey = `recovery_${normalizedEmail.replace(/[^a-z0-9]/gi, '_')}`;
            await verificationStore.setJSON(verificationKey, {
                email: normalizedEmail,
                code: verificationCode,
                expiresAt,
                customerId,
                pollCount: allPolls.length,
                createdAt: new Date().toISOString()
            });

            // Send verification email
            const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Recovery Code</h1>
                        </div>
                        <div style="padding: 32px;">
                            <p style="color: #475569; margin-bottom: 24px;">
                                You requested to recover your polls. Use this code to verify your identity:
                            </p>
                            <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; font-family: monospace;">
                                    ${verificationCode}
                                </span>
                            </div>
                            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
                                📊 <strong>${allPolls.length} poll${allPolls.length !== 1 ? 's' : ''}</strong> will be restored
                            </p>
                            <p style="color: #94a3b8; font-size: 12px;">
                                This code expires in 24 hours. If you didn't request this, you can safely ignore this email.
                            </p>
                        </div>
                        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                                © VoteGenerator • Privacy-first polling
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const emailSent = await sendEmail(
                normalizedEmail,
                `Your VoteGenerator Recovery Code: ${verificationCode}`,
                emailHtml
            );

            if (!emailSent) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Failed to send verification email. Please try again.' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Verification code sent',
                    pollCount: allPolls.length
                })
            };
        }

        // ========================================
        // ACTION: verify
        // ========================================
        if (action === 'verify') {
            if (!code) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Verification code required' })
                };
            }

            const verificationKey = `recovery_${normalizedEmail.replace(/[^a-z0-9]/gi, '_')}`;
            
            let verification: any;
            try {
                verification = await verificationStore.get(verificationKey, { type: 'json' });
            } catch (e) {
                verification = null;
            }

            if (!verification) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No verification pending. Please request a new code.' })
                };
            }

            if (Date.now() > verification.expiresAt) {
                // Clean up expired verification
                await verificationStore.delete(verificationKey);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Code expired. Please request a new one.' })
                };
            }

            if (code.toUpperCase() !== verification.code.toUpperCase()) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid code. Please check and try again.' })
                };
            }

            // Code is valid! Gather all polls for this email
            const recoveredPolls: any[] = [];
            
            // Get from customer record
            if (verification.customerId) {
                try {
                    const customerData = await customersStore.get(verification.customerId, { type: 'json' });
                    if (customerData?.polls) {
                        recoveredPolls.push(...customerData.polls);
                    }
                } catch (e) {
                    console.error('Error fetching customer:', e);
                }
            }

            // Also scan polls directly
            try {
                const { blobs } = await pollsStore.list();
                
                for (const blob of blobs) {
                    try {
                        const poll = await pollsStore.get(blob.key, { type: 'json' });
                        if (poll && poll.creatorEmail && poll.creatorEmail.toLowerCase() === normalizedEmail) {
                            // Check if not already added
                            if (!recoveredPolls.find(p => p.id === (poll.id || blob.key))) {
                                recoveredPolls.push({
                                    id: poll.id || blob.key,
                                    adminKey: poll.adminKey,
                                    title: poll.title || 'Untitled Poll',
                                    type: poll.type || 'multiple',
                                    createdAt: poll.createdAt,
                                    responseCount: poll.votes?.length || poll.responseCount || 0,
                                    status: poll.status || 'live'
                                });
                            }
                        }
                    } catch (e) {
                        // Skip invalid entries
                    }
                }
            } catch (e) {
                console.error('Error scanning polls:', e);
            }

            // Clean up verification
            await verificationStore.delete(verificationKey);

            // Generate/retrieve dashboard token
            let dashboardToken = verification.customerId;
            if (!dashboardToken) {
                dashboardToken = 'free_user_' + Date.now().toString(36);
            }

            // Log successful recovery
            console.log(`vg-recover: Email ${normalizedEmail.substring(0, 3)}***@*** recovered ${recoveredPolls.length} polls`);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Polls recovered successfully',
                    polls: recoveredPolls,
                    dashboardToken,
                    email: normalizedEmail
                })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action. Use "send_code" or "verify".' })
        };
    } catch (error) {
        console.error('vg-recover: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
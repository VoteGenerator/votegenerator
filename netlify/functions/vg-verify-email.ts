import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'noreply@mail.votegenerator.com';
const SITE_URL = process.env.URL || 'https://votegenerator.com';

// Generate secure token
function generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 48; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Send verification email
async function sendVerificationEmail(
    email: string,
    pollTitle: string,
    pollCreator: string,
    verifyUrl: string
): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return false;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">
                            🔔 Confirm Notifications
                        </h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                            Hi there!
                        </p>
                        
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                            <strong>${pollCreator || 'Someone'}</strong> wants to send you notifications about their poll:
                        </p>
                        
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
                            <p style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0;">
                                "${pollTitle}"
                            </p>
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 25px;">
                            You'll receive updates when:
                        </p>
                        <ul style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0 0 30px; padding-left: 20px;">
                            <li>The poll reaches vote milestones (10, 25, 50, 100+ votes)</li>
                            <li>The poll closes or reaches its response limit</li>
                            <li>Someone leaves a comment</li>
                        </ul>
                        
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${verifyUrl}" 
                               style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                                      color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; 
                                      font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
                                ✓ Yes, Send Me Notifications
                            </a>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 25px 0 0;">
                            Don't want notifications? Simply ignore this email.<br>
                            This link expires in 7 days.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                            Sent from <a href="${SITE_URL}" style="color: #6366f1; text-decoration: none;">VoteGenerator.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [email],
                subject: 'Confirm notifications for "' + pollTitle + '"',
                html
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Resend API error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        return false;
    }
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // GET request = verify token (user clicked link)
    if (event.httpMethod === 'GET') {
        const token = event.queryStringParameters?.token;
        
        if (!token) {
            // Redirect to error page
            return {
                statusCode: 302,
                headers: {
                    'Location': SITE_URL + '/verify-result?status=invalid'
                },
                body: ''
            };
        }

        try {
            // Get Blobs credentials
            const siteID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
            const blobToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';
            
            // Get verification record
            const verifyStore = getStore({ name: 'email-verifications', siteID, token: blobToken });
            
            let verification: any = null;
            try {
                verification = await verifyStore.get(token, { type: 'json' });
            } catch (e) {
                // Token not found
            }

            if (!verification) {
                return {
                    statusCode: 302,
                    headers: {
                        'Location': SITE_URL + '/verify-result?status=expired'
                    },
                    body: ''
                };
            }

            // Check expiry (7 days)
            const createdAt = new Date(verification.createdAt);
            const now = new Date();
            const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > 7) {
                await verifyStore.delete(token);
                return {
                    statusCode: 302,
                    headers: {
                        'Location': SITE_URL + '/verify-result?status=expired'
                    },
                    body: ''
                };
            }

            // Get poll and update notification settings
            const pollStore = getStore({ name: 'polls', siteID, token: blobToken });
            
            let poll: any = null;
            try {
                poll = await pollStore.get(verification.pollId, { type: 'json' });
            } catch (e) {
                // Poll not found
            }

            if (poll && poll.notificationSettings) {
                // Find and verify the email
                const emailIndex = poll.notificationSettings.emails.findIndex(
                    (e: any) => e.email === verification.email
                );

                if (emailIndex !== -1) {
                    poll.notificationSettings.emails[emailIndex].verified = true;
                    poll.notificationSettings.emails[emailIndex].verifiedAt = new Date().toISOString();
                    await pollStore.setJSON(verification.pollId, poll);
                }
            }

            // Delete used token
            await verifyStore.delete(token);

            // Redirect to success page
            return {
                statusCode: 302,
                headers: {
                    'Location': SITE_URL + '/verify-result?status=success&poll=' + verification.pollId
                },
                body: ''
            };

        } catch (error) {
            console.error('Verification error:', error);
            return {
                statusCode: 302,
                headers: {
                    'Location': SITE_URL + '/verify-result?status=error'
                },
                body: ''
            };
        }
    }

    // POST request = send verification email
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, email, pollTitle, pollCreator } = body;

        if (!pollId || !adminKey || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid email format' })
            };
        }

        // Get Blobs credentials
        const siteID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
        const blobToken = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

        // Verify admin access
        const pollStore = getStore({ name: 'polls', siteID, token: blobToken });
        
        let poll: any = null;
        try {
            poll = await pollStore.get(pollId, { type: 'json' });
        } catch (e) {
            // Poll not found
        }

        if (!poll || poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        // Generate verification token
        const token = generateToken();
        const verifyUrl = SITE_URL + '/.netlify/functions/vg-verify-email?token=' + token;

        // Store verification record
        const verifyStore = getStore({ name: 'email-verifications', siteID, token: blobToken });
        
        await verifyStore.setJSON(token, {
            pollId,
            email: email.toLowerCase(),
            createdAt: new Date().toISOString()
        });

        // Send verification email
        const sent = await sendVerificationEmail(
            email,
            pollTitle || poll.title,
            pollCreator || 'Someone',
            verifyUrl
        );

        if (!sent) {
            await verifyStore.delete(token);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to send verification email' })
            };
        }

        // Add email to poll's notification settings as pending
        if (!poll.notificationSettings) {
            poll.notificationSettings = {
                enabled: true,
                emails: [],
                skipFirstVotes: 3,
                notifyOn: {
                    milestones: true,
                    dailyDigest: false,
                    pollClosed: true,
                    limitReached: true,
                    newComment: false
                }
            };
        }

        // Check if email already exists
        const existingIndex = poll.notificationSettings.emails.findIndex(
            (e: any) => e.email === email.toLowerCase()
        );

        if (existingIndex === -1) {
            poll.notificationSettings.emails.push({
                email: email.toLowerCase(),
                verified: false,
                addedAt: new Date().toISOString(),
                lastSentAt: new Date().toISOString()
            });
        } else {
            // Update last sent time for resend
            poll.notificationSettings.emails[existingIndex].lastSentAt = new Date().toISOString();
        }

        await pollStore.setJSON(pollId, poll);

        console.log('Verification email sent to ' + email + ' for poll ' + pollId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Verification email sent'
            })
        };

    } catch (error) {
        console.error('Send verification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
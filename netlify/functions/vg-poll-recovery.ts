import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'noreply@mail.votegenerator.com';
const SITE_URL = process.env.URL || 'https://votegenerator.com';

interface PollRecord {
    id: string;
    title: string;
    displayName?: string;
    adminKey: string;
    createdAt: string;
    ownerEmail?: string;
    pollType: string;
    voteCount?: number;
    tier?: string;
}

// Send recovery email with admin links
async function sendRecoveryEmail(
    email: string,
    polls: PollRecord[]
): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return false;
    }

    const pollListHtml = polls.map(poll => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #1e293b;">${poll.displayName || poll.title}</strong>
                <br>
                <span style="color: #64748b; font-size: 12px;">
                    ${poll.pollType} • Created ${new Date(poll.createdAt).toLocaleDateString()}
                    ${poll.voteCount ? ` • ${poll.voteCount} votes` : ''}
                </span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <a href="${SITE_URL}/#id=${poll.id}&admin=${poll.adminKey}" 
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                          color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; 
                          font-weight: 600; font-size: 13px;">
                    Open Admin →
                </a>
            </td>
        </tr>
    `).join('');

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
                            🔑 Your Poll Admin Links
                        </h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                            Here are the admin links for your polls. Save these links - they give you full control over your polls!
                        </p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            ${pollListHtml}
                        </table>
                        
                        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin-top: 20px;">
                            <p style="color: #92400e; font-size: 13px; margin: 0;">
                                <strong>⚠️ Keep these links safe!</strong><br>
                                Anyone with an admin link can view all votes, edit the poll, and delete it.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">
                            Sent by <a href="${SITE_URL}" style="color: #6366f1; text-decoration: none;">VoteGenerator</a>
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
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: email,
                subject: `Your VoteGenerator Admin Links (${polls.length} poll${polls.length > 1 ? 's' : ''})`,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Failed to send recovery email:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending recovery email:', error);
        return false;
    }
}

// Send admin link for a single poll (during creation)
async function sendAdminLinkEmail(
    email: string,
    poll: PollRecord
): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return false;
    }

    const adminUrl = `${SITE_URL}/#id=${poll.id}&admin=${poll.adminKey}`;
    const shareUrl = `${SITE_URL}/#id=${poll.id}`;

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
                            🗳️ Your Poll is Ready!
                        </h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <<h2 style="color: #1e293b; font-size: 20px; margin: 0 0 10px;">
                            ${escapeHtml(poll.displayName || poll.title)}
                        </h2>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 30px;">
                            ${poll.pollType} poll • Created ${new Date(poll.createdAt).toLocaleDateString()}
                        </p>
                        
                        <!-- Admin Link -->
                        <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <h3 style="color: #166534; font-size: 14px; margin: 0 0 10px; display: flex; align-items: center; gap: 8px;">
                                🔐 Admin Link (Save This!)
                            </h3>
                            <p style="color: #475569; font-size: 12px; margin: 0 0 15px;">
                                Use this link to view results, edit your poll, and manage settings.
                            </p>
                            <a href="${adminUrl}" 
                               style="display: block; background: #22c55e; color: white; padding: 14px 20px; 
                                      border-radius: 8px; text-decoration: none; font-weight: 600; 
                                      text-align: center; font-size: 14px;">
                                Open Admin Dashboard →
                            </a>
                        </div>
                        
                        <!-- Share Link -->
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                            <h3 style="color: #475569; font-size: 14px; margin: 0 0 10px;">
                                📤 Share Link (For Voters)
                            </h3>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px; word-break: break-all;">
                                ${shareUrl}
                            </p>
                            <a href="${shareUrl}" 
                               style="color: #6366f1; font-size: 13px; text-decoration: none;">
                                Open Share Link →
                            </a>
                        </div>
                        
                        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin-top: 20px;">
                            <p style="color: #92400e; font-size: 13px; margin: 0;">
                                <strong>⚠️ Important:</strong> Save your admin link! You'll need it to access your poll settings and results.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
                        <p style="color: #64748b; font-size: 12px; margin: 0;">
                            Sent by <a href="${SITE_URL}" style="color: #6366f1; text-decoration: none;">VoteGenerator</a>
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
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: email,
                subject: `Your Poll Admin Link: ${escapeHtml(poll.displayName || poll.title)}`,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Failed to send admin link email:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error sending admin link email:', error);
        return false;
    }
}

function escapeHtml(str: string): string {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-poll-recovery: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { action, email, pollId, adminKey, pollData } = body;

        if (!action) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Action required' })
            };
        }

        console.log('vg-poll-recovery: Action:', action);
        console.log('vg-poll-recovery: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const store = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // Action: Recover polls by email
        if (action === 'recover') {
            if (!email) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email required' })
                };
            }

            // Find all polls with this owner email
            const { blobs } = await store.list();
            const matchingPolls: PollRecord[] = [];

            for (const blob of blobs) {
                try {
                    const pollStr = await store.get(blob.key, { type: 'text' });
                    if (pollStr) {
                        const poll = JSON.parse(pollStr);
                        if (poll.ownerEmail && poll.ownerEmail.toLowerCase() === email.toLowerCase()) {
                            matchingPolls.push({
                                id: poll.id,
                                title: poll.title,
                                displayName: poll.displayName,
                                adminKey: poll.adminKey,
                                createdAt: poll.createdAt,
                                ownerEmail: poll.ownerEmail,
                                pollType: poll.pollType,
                                voteCount: poll.voteCount,
                                tier: poll.tier
                            });
                        }
                    }
                } catch (e) {
                    // Skip invalid polls
                }
            }

            if (matchingPolls.length === 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        message: 'If any polls are associated with this email, you will receive a recovery email shortly.',
                        found: 0
                    })
                };
            }

            // Send recovery email
            const sent = await sendRecoveryEmail(email, matchingPolls);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: sent, 
                    message: sent 
                        ? 'Recovery email sent! Check your inbox.' 
                        : 'Failed to send recovery email. Please try again.',
                    found: matchingPolls.length
                })
            };
        }

        // Action: Send admin link to email (during poll creation or from admin panel)
        if (action === 'send-admin-link') {
            if (!email || !pollId || !adminKey) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email, pollId, and adminKey required' })
                };
            }

            // Get poll data
            const pollStr = await store.get(pollId, { type: 'text' });
            if (!pollStr) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Poll not found' })
                };
            }

            const poll = JSON.parse(pollStr);
            
            // Verify admin key
            if (poll.adminKey !== adminKey) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Invalid admin key' })
                };
            }

            // Update poll with owner email if not set
            if (!poll.ownerEmail) {
                poll.ownerEmail = email;
                await store.set(pollId, JSON.stringify(poll));
            }

            // Send email
            const sent = await sendAdminLinkEmail(email, {
                id: poll.id,
                title: poll.title,
                displayName: poll.displayName,
                adminKey: poll.adminKey,
                createdAt: poll.createdAt,
                pollType: poll.pollType
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: sent,
                    message: sent ? 'Admin link sent to your email!' : 'Failed to send email'
                })
            };
        }

        // Action: Set owner email for a poll
        if (action === 'set-owner-email') {
            if (!email || !pollId || !adminKey) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email, pollId, and adminKey required' })
                };
            }

            const pollStr = await store.get(pollId, { type: 'text' });
            if (!pollStr) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Poll not found' })
                };
            }

            const poll = JSON.parse(pollStr);
            
            if (poll.adminKey !== adminKey) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Invalid admin key' })
                };
            }

            poll.ownerEmail = email;
            await store.set(pollId, JSON.stringify(poll));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Owner email saved' })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action' })
        };
    } catch (error) {
        console.error('vg-poll-recovery: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
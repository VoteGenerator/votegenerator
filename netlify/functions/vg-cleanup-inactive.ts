// ============================================================================
// vg-cleanup-inactive.ts - Auto-delete inactive polls (GDPR Storage Limitation)
// Location: netlify/functions/vg-cleanup-inactive.ts
// 
// Runs as a scheduled function (configured in netlify.toml)
// 
// GDPR Article 5(1)(e) - Storage Limitation Principle:
// "Personal data must be kept for no longer than necessary"
// 
// Retention Policy:
// - Free tier polls: Delete after 6 months with no votes
// - Free tier polls: Delete after 12 months total (regardless of activity)
// - Paid tier polls: Keep while subscription active + 90 days grace
// - Cancelled subscriptions: 90 days grace period, then delete
// ============================================================================
import { Handler, schedule } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

// Retention periods (in milliseconds)
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
const TWELVE_MONTHS_MS = 12 * 30 * 24 * 60 * 60 * 1000;
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

interface CleanupStats {
    pollsScanned: number;
    pollsDeleted: number;
    deletionReasons: {
        noActivitySixMonths: number;
        olderThanTwelveMonths: number;
        subscriptionExpiredGracePeriod: number;
    };
    errors: string[];
}

// Send email notification before deletion (optional)
const sendDeletionWarningEmail = async (
    email: string, 
    pollTitle: string, 
    reason: string,
    daysRemaining: number
): Promise<void> => {
    const sendgridKey = process.env.SENDGRID_API_KEY;
    if (!sendgridKey || !email) return;
    
    try {
        await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email }],
                    subject: `⚠️ Your poll "${pollTitle}" will be deleted in ${daysRemaining} days`
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
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
    <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background: #f59e0b; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">⚠️ Poll Deletion Notice</h2>
        </div>
        <div style="padding: 24px;">
            <p style="color: #475569;">Your poll <strong>"${pollTitle}"</strong> is scheduled for deletion in <strong>${daysRemaining} days</strong>.</p>
            <p style="color: #64748b; font-size: 14px;">Reason: ${reason}</p>
            <p style="color: #475569;">To keep this poll, you can:</p>
            <ul style="color: #475569;">
                <li>Upgrade to a paid plan for longer retention</li>
                <li>Export your poll data before deletion</li>
            </ul>
            <a href="https://votegenerator.com/pricing" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
                Upgrade Now
            </a>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                This is an automated message per our <a href="https://votegenerator.com/privacy" style="color: #4f46e5;">data retention policy</a>.
            </p>
        </div>
    </div>
</body>
</html>
                    `
                }]
            })
        });
        console.log(`[Cleanup] Warning email sent to ${email} for poll: ${pollTitle}`);
    } catch (error) {
        console.error('[Cleanup] Failed to send warning email:', error);
    }
};

const cleanupHandler: Handler = async (event, context) => {
    console.log('[Cleanup] Starting scheduled cleanup job...');
    
    const stats: CleanupStats = {
        pollsScanned: 0,
        pollsDeleted: 0,
        deletionReasons: {
            noActivitySixMonths: 0,
            olderThanTwelveMonths: 0,
            subscriptionExpiredGracePeriod: 0,
        },
        errors: [],
    };

    try {
        const pollStore = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        const customerStore = getStore({
            name: 'customers',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        const cleanupLogStore = getStore({
            name: 'cleanup-logs',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        // List all polls
        const { blobs: pollBlobs } = await pollStore.list();
        const now = Date.now();

        for (const blob of pollBlobs) {
            stats.pollsScanned++;
            
            try {
                const poll = await pollStore.get(blob.key, { type: 'json' }) as any;
                if (!poll) continue;

                const createdAt = new Date(poll.createdAt || poll.created_at || 0).getTime();
                const lastVoteTime = poll.votes?.length 
                    ? Math.max(...poll.votes.map((v: any) => new Date(v.timestamp || 0).getTime()))
                    : createdAt;
                
                const pollAge = now - createdAt;
                const timeSinceLastVote = now - lastVoteTime;
                
                let shouldDelete = false;
                let deletionReason = '';
                let daysUntilDeletion = 0;

                // Check if poll has a paid owner
                const creatorEmail = poll.creatorEmail;
                let isPaidUser = false;
                let subscriptionCancelledAt: number | null = null;

                if (creatorEmail) {
                    const customer = await customerStore.get(creatorEmail, { type: 'json' }) as any;
                    if (customer) {
                        isPaidUser = customer.tier === 'pro' || customer.tier === 'business';
                        
                        // Check Stripe for subscription status
                        if (customer.stripeCustomerId) {
                            try {
                                const subs = await stripe.subscriptions.list({
                                    customer: customer.stripeCustomerId,
                                    status: 'all',
                                    limit: 1,
                                });
                                
                                const sub = subs.data[0];
                                if (sub) {
                                    if (sub.status === 'active' || sub.status === 'trialing') {
                                        isPaidUser = true;
                                    } else if (sub.canceled_at) {
                                        subscriptionCancelledAt = sub.canceled_at * 1000;
                                        isPaidUser = false;
                                    }
                                }
                            } catch (stripeErr) {
                                console.error(`[Cleanup] Stripe error for ${creatorEmail}:`, stripeErr);
                            }
                        }
                    }
                }

                // ================================================================
                // RETENTION RULES
                // ================================================================

                if (isPaidUser) {
                    // Paid users: Keep indefinitely while subscription active
                    shouldDelete = false;
                } else if (subscriptionCancelledAt) {
                    // Cancelled subscription: 90 day grace period
                    const timeSinceCancellation = now - subscriptionCancelledAt;
                    if (timeSinceCancellation > NINETY_DAYS_MS) {
                        shouldDelete = true;
                        deletionReason = 'Subscription cancelled - 90 day grace period expired';
                        stats.deletionReasons.subscriptionExpiredGracePeriod++;
                    } else {
                        daysUntilDeletion = Math.ceil((NINETY_DAYS_MS - timeSinceCancellation) / (24 * 60 * 60 * 1000));
                    }
                } else {
                    // Free tier rules
                    if (pollAge > TWELVE_MONTHS_MS) {
                        // Rule 1: Delete polls older than 12 months
                        shouldDelete = true;
                        deletionReason = 'Poll is over 12 months old (free tier limit)';
                        stats.deletionReasons.olderThanTwelveMonths++;
                    } else if (timeSinceLastVote > SIX_MONTHS_MS) {
                        // Rule 2: Delete polls with no votes in 6 months
                        shouldDelete = true;
                        deletionReason = 'No voting activity for 6 months (free tier)';
                        stats.deletionReasons.noActivitySixMonths++;
                    } else {
                        // Calculate days until deletion for warning emails
                        const daysUntilTwelveMonths = Math.ceil((TWELVE_MONTHS_MS - pollAge) / (24 * 60 * 60 * 1000));
                        const daysUntilSixMonthsInactive = Math.ceil((SIX_MONTHS_MS - timeSinceLastVote) / (24 * 60 * 60 * 1000));
                        daysUntilDeletion = Math.min(daysUntilTwelveMonths, daysUntilSixMonthsInactive);
                    }
                }

                // ================================================================
                // EXECUTE DELETION OR SEND WARNING
                // ================================================================

                if (shouldDelete) {
                    // Delete the poll
                    await pollStore.delete(blob.key);
                    stats.pollsDeleted++;
                    console.log(`[Cleanup] Deleted poll ${blob.key}: ${deletionReason}`);

                    // Update customer's poll list if they have one
                    if (creatorEmail) {
                        try {
                            const customer = await customerStore.get(creatorEmail, { type: 'json' }) as any;
                            if (customer && customer.polls) {
                                customer.polls = customer.polls.filter((p: string) => p !== blob.key);
                                await customerStore.setJSON(creatorEmail, customer);
                            }
                        } catch (err) {
                            // Non-critical error
                        }
                    }
                } else if (daysUntilDeletion > 0 && daysUntilDeletion <= 14 && creatorEmail) {
                    // Send warning email 14 days before deletion
                    const warningKey = `warning:${blob.key}:${Math.floor(daysUntilDeletion / 7)}`;
                    const alreadyWarned = await cleanupLogStore.get(warningKey);
                    
                    if (!alreadyWarned) {
                        await sendDeletionWarningEmail(
                            creatorEmail,
                            poll.title || 'Untitled Poll',
                            daysUntilDeletion <= 7 
                                ? 'No activity in the last 6 months' 
                                : 'Approaching 12 month free tier limit',
                            daysUntilDeletion
                        );
                        await cleanupLogStore.set(warningKey, 'sent');
                    }
                }

            } catch (pollError) {
                stats.errors.push(`Error processing poll ${blob.key}: ${pollError}`);
                console.error(`[Cleanup] Error with poll ${blob.key}:`, pollError);
            }
        }

        // Log cleanup results
        const logEntry = {
            timestamp: new Date().toISOString(),
            stats,
        };
        
        await cleanupLogStore.setJSON(`run:${Date.now()}`, logEntry);
        
        console.log('[Cleanup] Completed:', stats);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                stats,
            }),
        };

    } catch (error) {
        console.error('[Cleanup] Fatal error:', error);
        stats.errors.push(`Fatal error: ${error}`);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Cleanup job failed',
                stats,
            }),
        };
    }
};

// Schedule to run daily at 3 AM UTC
export const handler = schedule('0 3 * * *', cleanupHandler);

// Also allow manual trigger for testing
export const manualHandler: Handler = cleanupHandler;
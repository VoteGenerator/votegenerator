// ============================================================================
// vg-cleanup-inactive.ts - Auto-delete inactive polls (GDPR Storage Limitation)
// Location: netlify/functions/vg-cleanup-inactive.ts
// 
// Runs as a scheduled function (configured in netlify.toml)
// 
// GDPR Article 5(1)(e) - Storage Limitation Principle:
// "Personal data must be kept for no longer than necessary"
// 
// SIMPLE RETENTION POLICY:
// - ALL polls (free & paid): Delete after 12 months of NO ACTIVITY
// - Cancelled subscriptions: 90 days grace period, then same 12-month rule
// - Users are notified via dashboard banner (no email required)
// 
// NOTE: This does NOT delete polls that are still being used. Only truly
// abandoned polls (no votes, no edits for 12 months) get cleaned up.
// ============================================================================
import { Handler, schedule } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Retention period: 12 months of NO activity
const TWELVE_MONTHS_MS = 12 * 30 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

interface CleanupStats {
    pollsScanned: number;
    pollsDeleted: number;
    pollsMarkedForDeletion: number;
    errors: string[];
}

const cleanupHandler: Handler = async (event, context) => {
    console.log('[Cleanup] Starting scheduled cleanup job...');
    
    const stats: CleanupStats = {
        pollsScanned: 0,
        pollsDeleted: 0,
        pollsMarkedForDeletion: 0,
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

                // Calculate last activity time
                const createdAt = new Date(poll.createdAt || poll.created_at || 0).getTime();
                const updatedAt = new Date(poll.updatedAt || poll.updated_at || createdAt).getTime();
                const lastVoteTime = poll.votes?.length 
                    ? Math.max(...poll.votes.map((v: any) => new Date(v.timestamp || 0).getTime()))
                    : 0;
                
                // Last activity = most recent of: creation, update, or vote
                const lastActivity = Math.max(createdAt, updatedAt, lastVoteTime);
                const timeSinceActivity = now - lastActivity;
                
                // ================================================================
                // SIMPLE RULE: 12 months of NO activity = eligible for deletion
                // ================================================================
                
                if (timeSinceActivity > TWELVE_MONTHS_MS) {
                    // Check if already marked for deletion (30-day warning period)
                    if (poll.markedForDeletionAt) {
                        const markedAt = new Date(poll.markedForDeletionAt).getTime();
                        const timeSinceMarked = now - markedAt;
                        
                        if (timeSinceMarked > THIRTY_DAYS_MS) {
                            // 30 days passed since warning - DELETE
                            await pollStore.delete(blob.key);
                            stats.pollsDeleted++;
                            console.log(`[Cleanup] Deleted poll ${blob.key} (inactive for 12+ months, 30-day warning expired)`);

                            // Update customer's poll list
                            const creatorEmail = poll.creatorEmail;
                            if (creatorEmail) {
                                try {
                                    const customer = await customerStore.get(creatorEmail, { type: 'json' }) as any;
                                    if (customer && customer.polls) {
                                        customer.polls = customer.polls.filter((p: string) => p !== blob.key);
                                        await customerStore.setJSON(creatorEmail, customer);
                                    }
                                } catch (err) {
                                    // Non-critical
                                }
                            }
                        }
                    } else {
                        // First time seeing this inactive poll - MARK for deletion
                        // User will see warning in their dashboard for 30 days
                        poll.markedForDeletionAt = new Date().toISOString();
                        poll.deletionReason = 'No activity for 12 months';
                        await pollStore.setJSON(blob.key, poll);
                        stats.pollsMarkedForDeletion++;
                        console.log(`[Cleanup] Marked poll ${blob.key} for deletion (inactive 12+ months)`);
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
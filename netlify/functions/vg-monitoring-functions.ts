// ============================================================================
// vg-log-error.ts - Error logging endpoint
// Location: netlify/functions/vg-log-error.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    try {
        const errorData = JSON.parse(event.body || '{}');
        
        const errorStore = getStore({
            name: 'error-logs',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        // Store error with timestamp-based key
        const key = `error:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        await errorStore.setJSON(key, {
            ...errorData,
            receivedAt: new Date().toISOString(),
        });

        // Log to Netlify function logs (visible in Netlify dashboard)
        console.error('[ERROR LOG]', JSON.stringify(errorData, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ logged: true }),
        };
    } catch (err) {
        console.error('[ERROR LOG FAILED]', err);
        return { statusCode: 500, body: 'Failed to log error' };
    }
};


// ============================================================================
// vg-health.ts - Health check endpoint for uptime monitoring
// Location: netlify/functions/vg-health.ts
// 
// Point UptimeRobot or similar at:
// https://votegenerator.com/.netlify/functions/vg-health
// ============================================================================
/*
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async () => {
    const startTime = Date.now();
    
    try {
        // Quick blob store check
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });
        
        // Just list (don't fetch all) to verify connection
        await store.list({ limit: 1 });
        
        const responseTime = Date.now() - startTime;
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                responseTime: `${responseTime}ms`,
                services: {
                    blobStore: 'up',
                },
            }),
        };
    } catch (err) {
        console.error('[HEALTH CHECK FAILED]', err);
        
        return {
            statusCode: 503,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
*/


// ============================================================================
// vg-error-digest.ts - Daily error digest email
// Location: netlify/functions/vg-error-digest.ts
// Schedule: Run daily at 9 AM via netlify.toml
// 
// Add to netlify.toml:
// [functions."vg-error-digest"]
//   schedule = "0 9 * * *"
// ============================================================================
/*
import { Handler, schedule } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const digestHandler: Handler = async () => {
    try {
        const errorStore = getStore({
            name: 'error-logs',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        // Get errors from last 24 hours
        const { blobs } = await errorStore.list();
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        const recentErrors = [];
        for (const blob of blobs) {
            // Key format: error:timestamp:random
            const timestamp = parseInt(blob.key.split(':')[1] || '0');
            if (timestamp > oneDayAgo) {
                const error = await errorStore.get(blob.key, { type: 'json' });
                recentErrors.push(error);
            }
        }

        if (recentErrors.length === 0) {
            console.log('[DIGEST] No errors in last 24 hours');
            return { statusCode: 200, body: 'No errors' };
        }

        // Group errors by message
        const grouped = recentErrors.reduce((acc: Record<string, number>, err: any) => {
            const key = err.message || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        // Send email via SendGrid
        const sendgridKey = process.env.SENDGRID_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL || 'bella@secretsantamatch.com';
        
        if (sendgridKey) {
            const errorSummary = Object.entries(grouped)
                .map(([msg, count]) => `• ${msg}: ${count}x`)
                .join('\n');

            await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sendgridKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personalizations: [{
                        to: [{ email: adminEmail }],
                        subject: `⚠️ VoteGenerator: ${recentErrors.length} errors in last 24h`,
                    }],
                    from: {
                        email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                        name: 'VoteGenerator Monitoring',
                    },
                    content: [{
                        type: 'text/plain',
                        value: `Error Digest - ${new Date().toLocaleDateString()}

Total Errors: ${recentErrors.length}

Summary:
${errorSummary}

View full logs in Netlify dashboard.
                        `,
                    }],
                }),
            });
            
            console.log(`[DIGEST] Sent email with ${recentErrors.length} errors`);
        }

        // Cleanup old errors (keep last 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        for (const blob of blobs) {
            const timestamp = parseInt(blob.key.split(':')[1] || '0');
            if (timestamp < sevenDaysAgo) {
                await errorStore.delete(blob.key);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ sent: true, errorCount: recentErrors.length }),
        };
    } catch (err) {
        console.error('[DIGEST FAILED]', err);
        return { statusCode: 500, body: 'Digest failed' };
    }
};

export const handler = schedule('0 9 * * *', digestHandler);
*/


// ============================================================================
// vg-backup.ts - Manual/scheduled backup to external storage
// Location: netlify/functions/vg-backup.ts
// 
// NETLIFY BLOBS DO NOT HAVE AUTOMATIC BACKUPS!
// This function exports all data for backup.
// 
// Options:
// 1. Run manually: /.netlify/functions/vg-backup
// 2. Schedule daily: add to netlify.toml
// 3. Download backup from admin panel
// ============================================================================
/*
import { Handler, schedule } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const backupHandler: Handler = async (event) => {
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

        // Export all polls
        const { blobs: pollBlobs } = await pollStore.list();
        const polls = [];
        for (const blob of pollBlobs) {
            const poll = await pollStore.get(blob.key, { type: 'json' });
            polls.push({ key: blob.key, data: poll });
        }

        // Export all customers
        const { blobs: customerBlobs } = await customerStore.list();
        const customers = [];
        for (const blob of customerBlobs) {
            const customer = await customerStore.get(blob.key, { type: 'json' });
            customers.push({ key: blob.key, data: customer });
        }

        const backup = {
            timestamp: new Date().toISOString(),
            polls,
            customers,
            stats: {
                pollCount: polls.length,
                customerCount: customers.length,
            },
        };

        // Option 1: Return as download (for manual trigger)
        if (event.queryStringParameters?.download === 'true') {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="vg-backup-${Date.now()}.json"`,
                },
                body: JSON.stringify(backup, null, 2),
            };
        }

        // Option 2: Store backup in a separate blob store
        const backupStore = getStore({
            name: 'backups',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });
        
        const backupKey = `backup:${new Date().toISOString().split('T')[0]}`;
        await backupStore.setJSON(backupKey, backup);

        // Keep only last 30 backups
        const { blobs: backupBlobs } = await backupStore.list();
        if (backupBlobs.length > 30) {
            const sorted = backupBlobs.sort((a, b) => a.key.localeCompare(b.key));
            for (let i = 0; i < sorted.length - 30; i++) {
                await backupStore.delete(sorted[i].key);
            }
        }

        // Option 3: Send to external storage (S3, Google Drive, etc.)
        // Implement based on your preference

        console.log(`[BACKUP] Created backup with ${polls.length} polls, ${customers.length} customers`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                stats: backup.stats,
                timestamp: backup.timestamp,
            }),
        };
    } catch (err) {
        console.error('[BACKUP FAILED]', err);
        return { statusCode: 500, body: 'Backup failed' };
    }
};

// Can be both scheduled and manually triggered
export const handler = backupHandler;

// To schedule daily, add to netlify.toml:
// [functions."vg-backup"]
//   schedule = "0 4 * * *"
*/


// ============================================================================
// vg-recover.ts - Poll recovery via email
// Location: netlify/functions/vg-recover.ts
// ============================================================================
/*
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    try {
        const { email } = JSON.parse(event.body || '{}');
        
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ found: false, message: 'Email required' }),
            };
        }

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

        // Find customer by email
        const customer = await customerStore.get(email.toLowerCase(), { type: 'json' }) as any;
        
        if (!customer || !customer.polls || customer.polls.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    found: false,
                    message: 'No polls found for this email. If you didn\'t save your email, try checking your browser history.',
                }),
            };
        }

        // Get poll details
        const pollDetails = [];
        for (const pollId of customer.polls) {
            const poll = await pollStore.get(pollId, { type: 'json' }) as any;
            if (poll) {
                pollDetails.push({
                    id: pollId,
                    title: poll.title,
                    createdAt: poll.createdAt,
                    responseCount: poll.votes?.length || 0,
                    adminKey: poll.adminKey,
                });
            }
        }

        // Send recovery email
        const sendgridKey = process.env.SENDGRID_API_KEY;
        if (sendgridKey && pollDetails.length > 0) {
            const pollLinks = pollDetails.map(p => 
                `• ${p.title} (${p.responseCount} responses)\n  Admin: https://votegenerator.com/poll/${p.id}/admin/${p.adminKey}`
            ).join('\n\n');

            await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sendgridKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    personalizations: [{
                        to: [{ email }],
                        subject: '🔑 Your VoteGenerator Poll Access Links',
                    }],
                    from: {
                        email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                        name: 'VoteGenerator',
                    },
                    content: [{
                        type: 'text/html',
                        value: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
    <div style="max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">🔑 Your Poll Recovery</h2>
        <p>Here are the admin links to your polls:</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${pollDetails.map(p => `
                <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                    <strong>${p.title}</strong><br>
                    <span style="color: #64748b; font-size: 14px;">${p.responseCount} responses</span><br>
                    <a href="https://votegenerator.com/poll/${p.id}/admin/${p.adminKey}" style="color: #4f46e5;">
                        Open Admin Dashboard →
                    </a>
                </div>
            `).join('')}
        </div>
        <p style="color: #64748b; font-size: 14px;">
            Save these links somewhere safe!
        </p>
    </div>
</body>
</html>
                        `,
                    }],
                }),
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                found: true,
                message: `We found ${pollDetails.length} poll(s)! Check your email for the admin links.`,
            }),
        };
    } catch (err) {
        console.error('[RECOVER ERROR]', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ found: false, message: 'Something went wrong' }),
        };
    }
};
*/
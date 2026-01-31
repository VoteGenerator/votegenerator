// ============================================================================
// vg-backup-structure.ts - GDPR-Safe Structure-Only Backup
// Location: netlify/functions/vg-backup-structure.ts
//
// This backs up ONLY structure data, NO personal information:
// ✅ Poll IDs, titles, settings, created dates
// ❌ NO votes, NO emails, NO IPs, NO personal data
//
// Safe to email to yourself for disaster recovery.
// If Netlify dies, you can see what polls existed and recreate structure.
//
// Usage:
// - Manual: /.netlify/functions/vg-backup-structure?password=XXX
// - Download: /.netlify/functions/vg-backup-structure?download=true&password=XXX
// - Scheduled: Runs weekly, auto-emails to ADMIN_EMAIL
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface PollStructure {
    id: string;
    title: string;
    type: string;
    options: string[]; // Just the option text, no vote counts
    createdAt: string;
    settings: {
        allowMultiple?: boolean;
        requireNames?: boolean;
        hideResults?: boolean;
        endDate?: string;
        status?: string;
    };
    // Counts only, no personal data
    stats: {
        totalVotes: number;
        optionCount: number;
    };
}

export const handler: Handler = async (event) => {
    // Check if this is a scheduled run (Netlify adds this header)
    const isScheduled = event.headers['x-netlify-event'] === 'schedule';
    
    // For manual runs, require password. For scheduled runs, skip auth.
    if (!isScheduled) {
        const password = event.queryStringParameters?.password;
        const adminPassword = process.env.ADMIN_PASSWORD;
        
        if (!adminPassword || password !== adminPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Unauthorized. Add ?password=YOUR_ADMIN_PASSWORD' }),
            };
        }
    }

    try {
        const pollStore = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        const { blobs } = await pollStore.list();
        
        const structures: PollStructure[] = [];
        
        for (const blob of blobs) {
            try {
                const poll = await pollStore.get(blob.key, { type: 'json' }) as any;
                
                if (!poll) continue;
                
                // Extract ONLY structure, NO personal data
                structures.push({
                    id: blob.key,
                    title: poll.title || 'Untitled',
                    type: poll.type || 'multiple-choice',
                    options: (poll.options || []).map((opt: any) => 
                        typeof opt === 'string' ? opt : opt.text || opt.label || 'Option'
                    ),
                    createdAt: poll.createdAt || 'Unknown',
                    settings: {
                        allowMultiple: poll.allowMultiple,
                        requireNames: poll.requireNames,
                        hideResults: poll.hideResults,
                        endDate: poll.endDate,
                        status: poll.status,
                    },
                    stats: {
                        totalVotes: poll.votes?.length || 0,
                        optionCount: poll.options?.length || 0,
                    },
                });
            } catch (err) {
                console.error(`[Backup] Error processing poll ${blob.key}:`, err);
            }
        }

        const backup = {
            type: 'STRUCTURE_ONLY_BACKUP',
            warning: 'This backup contains NO personal data. Votes, emails, and IPs are NOT included.',
            timestamp: new Date().toISOString(),
            totalPolls: structures.length,
            polls: structures,
        };

        // SCHEDULED RUN: Auto-email the backup summary
        if (isScheduled) {
            const adminEmail = process.env.ADMIN_EMAIL;
            const sendgridKey = process.env.SENDGRID_API_KEY;
            
            if (!adminEmail || !sendgridKey) {
                console.error('[Backup] ADMIN_EMAIL or SENDGRID_API_KEY not configured');
                return {
                    statusCode: 200,
                    body: JSON.stringify({ 
                        success: false, 
                        error: 'Email not configured',
                        pollCount: structures.length,
                    }),
                };
            }

            await sendBackupEmail(adminEmail, sendgridKey, structures);
            
            console.log(`[Backup] Weekly backup emailed to ${adminEmail} - ${structures.length} polls`);
            
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    message: `Weekly backup emailed to ${adminEmail}`,
                    pollCount: structures.length,
                }),
            };
        }

        // MANUAL: Download JSON file
        if (event.queryStringParameters?.download === 'true') {
            const filename = `vg-structure-backup-${new Date().toISOString().split('T')[0]}.json`;
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                },
                body: JSON.stringify(backup, null, 2),
            };
        }

        // MANUAL: Email backup
        if (event.queryStringParameters?.email === 'true') {
            const adminEmail = process.env.ADMIN_EMAIL;
            const sendgridKey = process.env.SENDGRID_API_KEY;
            
            if (!adminEmail || !sendgridKey) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'ADMIN_EMAIL or SENDGRID_API_KEY not configured' }),
                };
            }

            await sendBackupEmail(adminEmail, sendgridKey, structures);

            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    message: `Backup summary emailed to ${adminEmail}`,
                    pollCount: structures.length,
                }),
            };
        }

        // Default: return JSON in response
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backup, null, 2),
        };

    } catch (err) {
        console.error('[Backup] Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Backup failed' }),
        };
    }
};

// Helper: Send backup email
async function sendBackupEmail(
    adminEmail: string, 
    sendgridKey: string, 
    structures: PollStructure[]
): Promise<void> {
    const totalVotes = structures.reduce((sum, p) => sum + p.stats.totalVotes, 0);
    
    await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sendgridKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            personalizations: [{
                to: [{ email: adminEmail }],
                subject: `📦 Weekly Backup: ${structures.length} polls, ${totalVotes} votes`,
            }],
            from: {
                email: process.env.FROM_EMAIL || 'noreply@votegenerator.com',
                name: 'VoteGenerator Backup',
            },
            content: [{
                type: 'text/html',
                value: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px; background: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 24px; color: white;">
            <h1 style="margin: 0; font-size: 20px;">📦 Weekly Structure Backup</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div style="padding: 24px;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
                <p style="color: #166534; margin: 0; font-size: 14px;">
                    <strong>✅ GDPR Safe:</strong> No personal data included (no votes, emails, or IPs)
                </p>
            </div>
            
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                <div style="flex: 1; background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: bold; color: #4f46e5;">${structures.length}</div>
                    <div style="color: #64748b; font-size: 14px;">Total Polls</div>
                </div>
                <div style="flex: 1; background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
                    <div style="font-size: 32px; font-weight: bold; color: #10b981;">${totalVotes}</div>
                    <div style="color: #64748b; font-size: 14px;">Total Votes</div>
                </div>
            </div>
            
            ${structures.length > 0 ? `
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">Recent Polls</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="background: #f8fafc;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0;">Title</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e2e8f0;">Type</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e2e8f0;">Votes</th>
                </tr>
                ${structures.slice(0, 20).map(p => `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f1f5f9; color: #64748b;">${p.type}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${p.stats.totalVotes}</td>
                    </tr>
                `).join('')}
                ${structures.length > 20 ? `
                    <tr>
                        <td colspan="3" style="padding: 10px; color: #64748b; text-align: center;">
                            ...and ${structures.length - 20} more polls
                        </td>
                    </tr>
                ` : ''}
            </table>
            ` : `
            <div style="text-align: center; padding: 24px; color: #64748b;">
                <p>No polls yet. Create your first poll!</p>
            </div>
            `}
            
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 13px; margin: 0;">
                    <strong>Download full backup:</strong><br>
                    <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px;">
                        /.netlify/functions/vg-backup-structure?download=true&password=***
                    </code>
                </p>
            </div>
        </div>
        
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                VoteGenerator • Automated Weekly Backup
            </p>
        </div>
    </div>
</body>
</html>
                `,
            }],
        }),
    });
}
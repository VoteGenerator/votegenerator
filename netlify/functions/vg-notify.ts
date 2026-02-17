import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Resend API integration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'noreply@mail.votegenerator.com';
const SITE_URL = process.env.URL || 'https://votegenerator.com';

interface NotificationPayload {
    pollId: string;
    adminKey: string;
    type: 'test' | 'milestone' | 'closed' | 'limit' | 'daily' | 'comment' | 'eachResponse' | 'suspicious';
    emails?: string[];
    data?: {
        voteCount?: number;
        milestone?: number;
        limitPercent?: number;
        commentText?: string;
        commentAuthor?: string;
        dailySummary?: {
            newVotes: number;
            totalVotes: number;
            topChoice: string;
        };
    };
}

const MILESTONE_POINTS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

// Get next milestone for a vote count
function getNextMilestone(voteCount: number): number | null {
    return MILESTONE_POINTS.find(m => m > voteCount) || null;
}

// Check if vote count hit a milestone
function checkMilestone(voteCount: number): number | null {
    return MILESTONE_POINTS.includes(voteCount) ? voteCount : null;
}

// Generate unsubscribe token
function generateUnsubscribeToken(pollId: string, email: string): string {
    const data = JSON.stringify({ pollId, email: email.toLowerCase(), ts: Date.now() });
    return Buffer.from(data).toString('base64url');
}

// Build unsubscribe URL
function getUnsubscribeUrl(pollId: string, email: string): string {
    const token = generateUnsubscribeToken(pollId, email);
    return SITE_URL + '/.netlify/functions/vg-unsubscribe?token=' + token;
}

// Email footer with unsubscribe link
function getEmailFooter(unsubscribeUrl: string): string {
    return `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                Sent from <a href="${SITE_URL}" style="color: #6366f1; text-decoration: none;">VoteGenerator.com</a>
            </p>
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 10px 0 0;">
                <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe from this poll's notifications</a>
            </p>
        </div>
    `;
}

// Email templates - now accepts unsubscribeUrl
const emailTemplates = {
    test: (pollTitle: string, unsubscribeUrl: string) => ({
        subject: `🔔 Test Notification - ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Test Notification</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Great! Your email notifications are working perfectly.
                    </p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        You'll receive notifications for <strong>"${pollTitle}"</strong> based on your settings.
                    </p>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-top: 20px;">
                        <p style="color: #64748b; font-size: 14px; margin: 0;">
                            ✅ Vote milestones (10, 25, 50, 100+ votes)<br>
                            ✅ Poll closed notifications<br>
                            ✅ Response limit alerts
                        </p>
                    </div>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    milestone: (pollTitle: string, milestone: number, totalVotes: number, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `🎯 ${milestone} votes reached! - ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Milestone Reached!</h1>
                    <p style="color: rgba(255,255,255,0.9); font-size: 48px; font-weight: bold; margin: 20px 0 0;">${milestone}</p>
                    <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">votes</p>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your poll <strong>"${pollTitle}"</strong> just hit <strong>${milestone} votes</strong>! 🎉
                    </p>
                    <p style="color: #64748b; font-size: 14px;">
                        Total votes so far: ${totalVotes}
                    </p>
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
                        View Results →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    closed: (pollTitle: string, totalVotes: number, winnerText: string, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `✅ Poll Closed - ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">✅ Poll Closed</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your poll <strong>"${pollTitle}"</strong> has ended.
                    </p>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 10px;">Final Results:</p>
                        <p style="color: #1e293b; font-size: 24px; font-weight: bold; margin: 0;">
                            ${totalVotes} total votes
                        </p>
                        ${winnerText ? `<p style="color: #10b981; font-size: 16px; margin: 10px 0 0;">🏆 Winner: ${winnerText}</p>` : ''}
                    </div>
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View Final Results →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    limit: (pollTitle: string, currentVotes: number, maxVotes: number, percentUsed: number, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `⚠️ ${percentUsed}% of response limit reached - ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Response Limit Alert</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Your poll <strong>"${pollTitle}"</strong> is approaching its response limit.
                    </p>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #64748b;">${currentVotes} of ${maxVotes} responses</span>
                            <span style="color: #f59e0b; font-weight: bold;">${percentUsed}%</span>
                        </div>
                        <div style="background: #e2e8f0; border-radius: 9999px; height: 8px; overflow: hidden;">
                            <div style="background: ${percentUsed >= 100 ? '#ef4444' : '#f59e0b'}; height: 100%; width: ${Math.min(percentUsed, 100)}%;"></div>
                        </div>
                    </div>
                    ${percentUsed >= 100 
                        ? '<p style="color: #ef4444; font-weight: bold;">Your poll has reached its limit and is no longer accepting votes.</p>'
                        : '<p style="color: #64748b;">Consider upgrading your plan to accept more responses.</p>'
                    }
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px;">
                        View Poll →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    daily: (pollTitle: string, newVotes: number, totalVotes: number, topChoice: string, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `📊 Daily Summary: ${newVotes} new votes - ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📊 Daily Summary</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Here's what happened with <strong>"${pollTitle}"</strong> today:
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                            <p style="color: #10b981; font-size: 32px; font-weight: bold; margin: 0;">+${newVotes}</p>
                            <p style="color: #64748b; font-size: 12px; margin: 5px 0 0;">new votes today</p>
                        </div>
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
                            <p style="color: #6366f1; font-size: 32px; font-weight: bold; margin: 0;">${totalVotes}</p>
                            <p style="color: #64748b; font-size: 12px; margin: 5px 0 0;">total votes</p>
                        </div>
                    </div>
                    ${topChoice ? `
                        <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                            <p style="color: #64748b; font-size: 12px; margin: 0 0 5px;">Current Leader:</p>
                            <p style="color: #1e293b; font-size: 18px; font-weight: bold; margin: 0;">🏆 ${topChoice}</p>
                        </div>
                    ` : ''}
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View Full Results →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    comment: (pollTitle: string, commentAuthor: string, commentText: string, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `💬 New comment on ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Comment</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Someone left a comment on <strong>"${pollTitle}"</strong>
                    </p>
                    <div style="background: #fff; border-left: 4px solid #6366f1; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                        <p style="color: #1e293b; font-size: 16px; font-style: italic; margin: 0 0 10px;">"${commentText}"</p>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">— ${commentAuthor}</p>
                    </div>
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View All Comments →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    eachResponse: (pollTitle: string, voteCount: number, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `📊 New vote on ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📊 New Response</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        Someone just voted on <strong>"${pollTitle}"</strong>
                    </p>
                    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="color: #6366f1; font-size: 36px; font-weight: bold; margin: 0;">${voteCount}</p>
                        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0;">total votes</p>
                    </div>
                    <a href="${pollUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        View Results →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    }),

    suspicious: (pollTitle: string, pollUrl: string, unsubscribeUrl: string) => ({
        subject: `🚨 Suspicious activity on ${pollTitle}`,
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🚨 Suspicious Activity</h1>
                </div>
                <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                        We detected unusual voting patterns on <strong>"${pollTitle}"</strong>.
                    </p>
                    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <p style="color: #dc2626; font-size: 14px; margin: 0;">
                            This could indicate automated voting or manipulation attempts. The suspicious votes have been flagged for your review.
                        </p>
                    </div>
                    <a href="${pollUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        Review Activity →
                    </a>
                    ${getEmailFooter(unsubscribeUrl)}
                </div>
            </div>
        `
    })
};

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return false;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + RESEND_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [to],
                subject,
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
        console.error('Failed to send email:', error);
        return false;
    }
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
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const payload: NotificationPayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey, type, emails, data } = payload;

        // Validate
        if (!pollId || !adminKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing pollId or adminKey' }) };
        }

        // Get poll from store
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });

        const poll = await store.get(pollId, { type: 'json' }) as any;
        
        if (!poll || poll.adminKey !== adminKey) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid admin key' }) };
        }

        // Get notification settings - only use VERIFIED emails
        let notifyEmails: string[] = [];
        
        if (emails) {
            // Direct emails provided (e.g., for test emails)
            notifyEmails = emails;
        } else if (poll.notificationSettings?.emails) {
            // Filter to only verified emails
            notifyEmails = poll.notificationSettings.emails
                .filter((e: any) => e.verified === true)
                .map((e: any) => e.email);
        }
        
        if (notifyEmails.length === 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'No verified email addresses configured' }) };
        }

        const pollUrl = SITE_URL + '/#id=' + pollId + '&adminKey=' + adminKey;
        
        // Send to each email with personalized unsubscribe link
        let sentCount = 0;
        
        for (const email of notifyEmails) {
            const unsubscribeUrl = getUnsubscribeUrl(pollId, email);
            let emailContent: { subject: string; html: string };

            switch (type) {
                case 'test':
                    emailContent = emailTemplates.test(poll.title, unsubscribeUrl);
                    break;
                case 'milestone':
                    emailContent = emailTemplates.milestone(
                        poll.title,
                        data?.milestone || 0,
                        data?.voteCount || poll.voteCount || 0,
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'closed':
                    emailContent = emailTemplates.closed(
                        poll.title,
                        poll.voteCount || 0,
                        '', // TODO: Calculate winner
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'limit':
                    emailContent = emailTemplates.limit(
                        poll.title,
                        poll.voteCount || 0,
                        poll.maxResponses || 100,
                        data?.limitPercent || 100,
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'daily':
                    emailContent = emailTemplates.daily(
                        poll.title,
                        data?.dailySummary?.newVotes || 0,
                        data?.dailySummary?.totalVotes || poll.voteCount || 0,
                        data?.dailySummary?.topChoice || '',
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'comment':
                    emailContent = emailTemplates.comment(
                        poll.title,
                        data?.commentAuthor || 'Anonymous',
                        data?.commentText || '',
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'eachResponse':
                    emailContent = emailTemplates.eachResponse(
                        poll.title,
                        data?.voteCount || poll.voteCount || 0,
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                case 'suspicious':
                    emailContent = emailTemplates.suspicious(
                        poll.title,
                        pollUrl,
                        unsubscribeUrl
                    );
                    break;
                default:
                    continue; // Skip unknown types
            }

            const success = await sendEmail(email, emailContent.subject, emailContent.html);
            if (success) sentCount++;
        }

        // Log notification sent
        console.log('Notification sent: ' + type + ' for poll ' + pollId + ' to ' + sentCount + ' recipient(s)');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                type,
                sent: sentCount,
                total: notifyEmails.length
            })
        };

    } catch (error) {
        console.error('Notification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

// Export helper functions for use in vg-vote
export { checkMilestone, getNextMilestone, MILESTONE_POINTS };
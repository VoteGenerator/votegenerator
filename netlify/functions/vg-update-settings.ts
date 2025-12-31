import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface EmailEntry {
    email: string;
    verified: boolean;
    addedAt?: string;
    verifiedAt?: string;
    lastSentAt?: string;
}

interface UpdateSettingsPayload {
    pollId: string;
    adminKey: string;
    notificationSettings?: {
        enabled: boolean;
        emails: EmailEntry[];
        skipFirstVotes: number;
        notifyOn: {
            milestones: boolean;
            dailyDigest: boolean;
            pollClosed: boolean;
            limitReached: boolean;
            newComment: boolean;
        };
    };
    logoUrl?: string | null;
    status?: 'draft' | 'live' | 'paused' | 'closed';
    settings?: {
        allowMultiple?: boolean;
        hideResults?: boolean;
        requireNames?: boolean;
        unlisted?: boolean;
        deadline?: string | null;
    };
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
        const payload: UpdateSettingsPayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey, notificationSettings, logoUrl, status, settings } = payload;

        // Validate
        if (!pollId || !adminKey) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing pollId or adminKey' }) 
            };
        }

        // Get poll from store
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });

        const poll = await store.get(pollId, { type: 'json' }) as any;
        
        if (!poll) {
            return { 
                statusCode: 404, 
                headers, 
                body: JSON.stringify({ error: 'Poll not found' }) 
            };
        }

        if (poll.adminKey !== adminKey) {
            return { 
                statusCode: 403, 
                headers, 
                body: JSON.stringify({ error: 'Invalid admin key' }) 
            };
        }

        // Track what was updated
        const updatedFields: string[] = [];

        // Update notification settings
        if (notificationSettings !== undefined) {
            poll.notificationSettings = notificationSettings;
            updatedFields.push('notificationSettings');
        }

        // Update logo
        if (logoUrl !== undefined) {
            poll.logoUrl = logoUrl;
            updatedFields.push('logoUrl');
        }

        // Update status
        if (status !== undefined) {
            const previousStatus = poll.status;
            poll.status = status;
            poll.statusUpdatedAt = new Date().toISOString();
            
            if (status === 'live' && previousStatus === 'draft') {
                poll.wentLiveAt = new Date().toISOString();
            }
            if (status === 'closed') {
                poll.closedAt = new Date().toISOString();
            }
            updatedFields.push('status');
        }

        // Update poll settings
        if (settings !== undefined) {
            poll.settings = {
                ...poll.settings,
                ...settings
            };
            updatedFields.push('settings');
        }

        // Save updated poll
        poll.updatedAt = new Date().toISOString();
        await store.setJSON(pollId, poll);

        console.log(`Poll ${pollId} updated: ${updatedFields.join(', ')}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                updatedFields
            })
        };

    } catch (error) {
        console.error('Update settings error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
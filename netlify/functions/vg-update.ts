// ============================================================================
// vg-update.ts - Update Poll (General Edits)
// Location: netlify/functions/vg-update.ts
// Handles: title, description, buttonText, theme, logoUrl, status, meetingDuration, settings
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface PollSettings {
    deadline?: string;
    hideResults?: boolean;
    requireNames?: boolean;
    allowMultiple?: boolean;
    security?: string;
    unlisted?: boolean;
}

interface UpdatePayload {
    pollId: string;
    adminKey: string;
    updates: {
        title?: string;
        description?: string;
        buttonText?: string;
        theme?: string;
        logoUrl?: string | null;
        status?: 'draft' | 'live' | 'paused' | 'closed';
        meetingDuration?: 15 | 30 | 45 | 60 | 90 | 120;
        settings?: PollSettings;
    };
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Handle CORS preflight
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

    try {
        const payload: UpdatePayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey, updates } = payload;

        // Validate required fields
        if (!pollId || !adminKey) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing pollId or adminKey' }) 
            };
        }

        if (!updates || Object.keys(updates).length === 0) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'No updates provided' }) 
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

        // Verify admin key
        if (poll.adminKey !== adminKey) {
            return { 
                statusCode: 403, 
                headers, 
                body: JSON.stringify({ error: 'Invalid admin key' }) 
            };
        }

        // Track what was updated
        const updatedFields: string[] = [];

        // Apply updates
        if (updates.title !== undefined && updates.title.trim()) {
            poll.title = updates.title.trim();
            updatedFields.push('title');
        }

        if (updates.description !== undefined) {
            poll.description = updates.description.trim() || null;
            updatedFields.push('description');
        }

        if (updates.buttonText !== undefined) {
            poll.buttonText = updates.buttonText || 'Submit Vote';
            updatedFields.push('buttonText');
        }

        if (updates.theme !== undefined) {
            poll.theme = updates.theme;
            updatedFields.push('theme');
        }

        if (updates.logoUrl !== undefined) {
            poll.logoUrl = updates.logoUrl;
            updatedFields.push('logoUrl');
        }

        if (updates.meetingDuration !== undefined) {
            poll.meetingDuration = updates.meetingDuration;
            updatedFields.push('meetingDuration');
        }

        // Handle status changes
        if (updates.status !== undefined) {
            const validStatuses = ['draft', 'live', 'paused', 'closed'];
            if (validStatuses.includes(updates.status)) {
                const previousStatus = poll.status;
                poll.status = updates.status;
                poll.statusUpdatedAt = new Date().toISOString();
                
                // Track important status transitions
                if (updates.status === 'live' && previousStatus === 'draft') {
                    poll.wentLiveAt = new Date().toISOString();
                }
                if (updates.status === 'closed') {
                    poll.closedAt = new Date().toISOString();
                }
                updatedFields.push('status');
            }
        }

        // Handle settings updates (merge with existing)
        if (updates.settings !== undefined) {
            poll.settings = {
                ...poll.settings,
                ...updates.settings
            };
            
            // Handle deadline specifically - convert to ISO or clear
            if (updates.settings.deadline === '' || updates.settings.deadline === null) {
                poll.settings.deadline = null;
            } else if (updates.settings.deadline) {
                poll.settings.deadline = updates.settings.deadline;
            }
            
            updatedFields.push('settings');
        }

        // Update timestamp
        poll.updatedAt = new Date().toISOString();

        // Save updated poll
        await store.setJSON(pollId, poll);

        console.log(`Poll ${pollId} updated: ${updatedFields.join(', ')}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                updatedFields,
                poll: {
                    id: poll.id,
                    title: poll.title,
                    status: poll.status,
                    updatedAt: poll.updatedAt
                }
            })
        };

    } catch (error) {
        console.error('Update poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
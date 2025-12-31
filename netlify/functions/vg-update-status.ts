import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface UpdateStatusPayload {
    pollId: string;
    adminKey: string;
    status: 'draft' | 'live' | 'paused' | 'closed';
    clearVotes?: boolean;
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
        const payload: UpdateStatusPayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey, status, clearVotes } = payload;

        // Validate
        if (!pollId || !adminKey || !status) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing required fields' }) 
            };
        }

        // Validate status value
        const validStatuses = ['draft', 'live', 'paused', 'closed'];
        if (!validStatuses.includes(status)) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Invalid status value' }) 
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

        // Track previous status for logging
        const previousStatus = poll.status || 'draft';

        // Update poll status
        poll.status = status;
        poll.statusUpdatedAt = new Date().toISOString();

        // If going live and clearing votes
        if (status === 'live' && clearVotes && poll.votes && poll.votes.length > 0) {
            console.log(`Clearing ${poll.votes.length} test votes for poll ${pollId}`);
            poll.clearedVotes = poll.votes; // Keep a backup
            poll.votes = [];
            poll.voteCount = 0;
            poll.responseCount = 0;
        }

        // If going live, set the live date
        if (status === 'live' && previousStatus === 'draft') {
            poll.wentLiveAt = new Date().toISOString();
        }

        // If closing, set the closed date
        if (status === 'closed') {
            poll.closedAt = new Date().toISOString();
        }

        // Save updated poll
        await store.setJSON(pollId, poll);

        console.log(`Poll ${pollId} status changed: ${previousStatus} -> ${status}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                previousStatus,
                status,
                votesCleared: clearVotes && previousStatus === 'draft' ? (poll.clearedVotes?.length || 0) : 0
            })
        };

    } catch (error) {
        console.error('Update status error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
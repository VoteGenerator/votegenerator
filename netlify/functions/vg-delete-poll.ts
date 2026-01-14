// ============================================================================
// vg-delete-poll.ts - Delete a poll from Netlify Blobs
// Location: netlify/functions/vg-delete-poll.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface DeletePollPayload {
    pollId: string;
    adminKey: string;
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Accept both DELETE and POST
    if (event.httpMethod !== 'DELETE' && event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const payload: DeletePollPayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey } = payload;

        // Validate
        if (!pollId || !adminKey) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing required fields: pollId and adminKey' }) 
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
                body: JSON.stringify({ error: 'Invalid admin key - unauthorized to delete this poll' }) 
            };
        }

        // Delete the poll
        await store.delete(pollId);

        console.log(`Poll ${pollId} deleted successfully by admin`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                message: 'Poll deleted successfully'
            })
        };

    } catch (error) {
        console.error('Delete poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
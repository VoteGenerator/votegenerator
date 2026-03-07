// ============================================================================
// vg-duplicate.ts - Duplicate a poll or survey
// Creates a copy with same settings but no responses
// Location: netlify/functions/vg-duplicate.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

// Generate secure random ID
const generateId = (length: number = 12): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }
    return result;
};

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
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
        console.error('vg-duplicate: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey } = body;
        
        console.log('vg-duplicate: Request received');
        console.log('vg-duplicate: pollId:', pollId);
        console.log('vg-duplicate: adminKey provided:', adminKey ? 'yes (length: ' + adminKey.length + ')' : 'no');
        console.log('vg-duplicate: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        if (!pollId) {
            console.log('vg-duplicate: Missing pollId');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing poll ID' })
            };
        }
        
        if (!adminKey) {
            console.log('vg-duplicate: Missing adminKey');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing admin key. Please refresh the page and try again.' })
            };
        }

        // Get poll store
        const store = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        console.log('vg-duplicate: Fetching poll from store...');
        const pollData = await store.get(pollId, { type: 'json' });

        if (!pollData) {
            console.log('vg-duplicate: Poll not found:', pollId);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found. It may have been deleted.' })
            };
        }

        const poll = pollData as any;
        console.log('vg-duplicate: Poll found:', poll.title);
        console.log('vg-duplicate: Poll adminKey exists:', !!poll.adminKey);
        console.log('vg-duplicate: AdminKey comparison:', poll.adminKey === adminKey ? 'MATCH' : 'MISMATCH');

        // Verify admin key
        if (poll.adminKey !== adminKey) {
            console.log('vg-duplicate: Admin key mismatch');
            console.log('vg-duplicate: Expected length:', poll.adminKey?.length);
            console.log('vg-duplicate: Received length:', adminKey?.length);
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key. Please refresh the page and try again.' })
            };
        }

        // Generate new IDs
        const newPollId = generateId(12);
        const newAdminKey = generateId(24);

        // Create duplicate with new IDs and reset responses
        const duplicatedPoll = {
            ...poll,
            id: newPollId,
            adminKey: newAdminKey,
            title: `${poll.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Reset all response data
            votes: [],
            voteCount: 0,
            responseCount: 0,
            status: 'draft', // Start as draft so they can review before publishing
            // Reset analytics
            usedCodes: [],
            // Keep settings but reset any response-specific data
        };

        // If it's a survey, also reset survey-specific response data
        if (poll.isSurvey || poll.pollType === 'survey') {
            duplicatedPoll.surveyResponses = [];
        }

        // Remove any custom slug (must be unique)
        delete duplicatedPoll.customSlug;

        // Save the duplicate
        await store.setJSON(newPollId, duplicatedPoll);

        console.log(`vg-duplicate: Duplicated poll ${pollId} -> ${newPollId}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                newPollId,
                newAdminKey,
                message: 'Poll duplicated successfully'
            })
        };
    } catch (error) {
        console.error('vg-duplicate: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to duplicate poll' })
        };
    }
};
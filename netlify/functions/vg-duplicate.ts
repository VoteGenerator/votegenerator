// ============================================================================
// vg-duplicate.ts - Duplicate a poll or survey
// Creates a copy with same settings but no responses
// Location: netlify/functions/vg-duplicate.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey } = body;

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing pollId or adminKey' })
            };
        }

        // Get poll store
        const store = getStore('polls');
        const pollData = await store.get(pollId, { type: 'json' });

        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        const poll = pollData as any;

        // Verify admin key
        if (poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' })
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

        console.log(`Duplicated poll ${pollId} -> ${newPollId}`);

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
        console.error('Duplicate error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to duplicate poll' })
        };
    }
};
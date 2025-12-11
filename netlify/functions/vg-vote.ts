import { Handler } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

interface VoteRequest {
    pollId: string;
    rankedOptionIds: string[];
}

interface Vote {
    id: string;
    rankedOptionIds: string[];
    timestamp: string;
    // We don't store IP addresses for privacy
    // Instead we use a hash for basic duplicate detection
    voterHash?: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowGuestOptions: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
}

// Simple hash function for voter fingerprinting (optional)
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

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
        const body: VoteRequest = JSON.parse(event.body || '{}');

        // Validation
        if (!body.pollId || typeof body.pollId !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        if (!Array.isArray(body.rankedOptionIds) || body.rankedOptionIds.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Ranked options are required' })
            };
        }

        // Fetch poll from database
        const { getStore } = await import('@netlify/blobs');
        const store = getStore('votegenerator-polls');
        const poll: Poll | null = await store.get(body.pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Validate that all option IDs exist in the poll
        const validOptionIds = new Set(poll.options.map(o => o.id));
        const invalidIds = body.rankedOptionIds.filter(id => !validOptionIds.has(id));
        
        if (invalidIds.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid option IDs provided' })
            };
        }

        // Check for duplicate option IDs in ranking
        const uniqueIds = new Set(body.rankedOptionIds);
        if (uniqueIds.size !== body.rankedOptionIds.length) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Duplicate options in ranking' })
            };
        }

        // Create vote record
        // Note: We intentionally don't do IP-based duplicate checking
        // This allows multiple people on the same network to vote
        // Client-side localStorage handles same-browser duplicate prevention
        const vote: Vote = {
            id: uuidv4().substring(0, 12),
            rankedOptionIds: body.rankedOptionIds,
            timestamp: new Date().toISOString()
        };

        // Optional: Create a voter hash from headers for soft duplicate detection
        // This isn't enforced but could be used for analytics
        const userAgent = event.headers['user-agent'] || '';
        const acceptLang = event.headers['accept-language'] || '';
        vote.voterHash = simpleHash(userAgent + acceptLang + body.pollId);

        // Update poll with new vote
        poll.votes.push(vote);
        poll.voteCount = poll.votes.length;

        // Save updated poll
        await store.setJSON(body.pollId, poll);

        console.log(`Vote recorded for poll ${body.pollId}. Total votes: ${poll.voteCount}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                voteCount: poll.voteCount
            })
        };

    } catch (error) {
        console.error('Error submitting vote:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to submit vote' })
        };
    }
};

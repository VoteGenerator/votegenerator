import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { v4 as uuidv4 } from 'uuid';

interface VoteRequest {
    pollId: string;
    rankedOptionIds?: string[];  // For ranked choice
    selectedOptionIds?: string[]; // For multiple choice
}

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    timestamp: string;
    voterHash?: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: 'ranked' | 'multiple';
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
}

// Simple hash for basic duplicate detection
const hashString = (str: string): string => {
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
        const body: VoteRequest = JSON.parse(event.body || '{}');

        // Validation
        if (!body.pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Fetch poll from Netlify Blobs
        const store = getStore('votegenerator-polls');
        const poll: Poll | null = await store.get(body.pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Get valid option IDs
        const validOptionIds = new Set(poll.options.map(o => o.id));

        // Build vote object based on poll type
        const vote: Vote = {
            id: uuidv4(),
            timestamp: new Date().toISOString()
        };

        // Create voter hash for basic duplicate detection
        const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
        const userAgent = event.headers['user-agent'] || 'unknown';
        vote.voterHash = hashString(`${clientIP}-${userAgent}-${body.pollId}`);

        if (poll.pollType === 'ranked') {
            // Ranked choice validation
            if (!Array.isArray(body.rankedOptionIds) || body.rankedOptionIds.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Ranked options are required' })
                };
            }

            // Validate all option IDs exist
            const invalidIds = body.rankedOptionIds.filter(id => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid option IDs provided' })
                };
            }

            // Check for duplicates
            const uniqueIds = new Set(body.rankedOptionIds);
            if (uniqueIds.size !== body.rankedOptionIds.length) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Duplicate options in ranking' })
                };
            }

            vote.rankedOptionIds = body.rankedOptionIds;

        } else {
            // Multiple choice validation
            if (!Array.isArray(body.selectedOptionIds) || body.selectedOptionIds.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'At least one option must be selected' })
                };
            }

            // Check if multiple selections allowed
            if (!poll.settings.allowMultiple && body.selectedOptionIds.length > 1) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Only one option can be selected' })
                };
            }

            // Validate all option IDs exist
            const invalidIds = body.selectedOptionIds.filter(id => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid option IDs provided' })
                };
            }

            vote.selectedOptionIds = body.selectedOptionIds;
        }

        // Add vote to poll
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

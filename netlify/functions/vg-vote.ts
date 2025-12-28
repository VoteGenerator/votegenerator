import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface VoteRequest {
    pollId: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
}

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    timestamp: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
}

const generateVoteId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
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

        if (!body.pollId || typeof body.pollId !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll from storage with explicit config
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        const poll: Poll | null = await store.get(body.pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        const validOptionIds = new Set(poll.options.map(o => o.id));

        if (poll.pollType === 'ranked') {
            if (!Array.isArray(body.rankedOptionIds) || body.rankedOptionIds.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Please rank your choices' })
                };
            }

            const invalidIds = body.rankedOptionIds.filter(id => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options selected' })
                };
            }
        } else {
            if (!Array.isArray(body.selectedOptionIds) || body.selectedOptionIds.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Please select at least one option' })
                };
            }

            const invalidIds = body.selectedOptionIds.filter(id => !validOptionIds.has(id));
            if (invalidIds.length > 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid options selected' })
                };
            }

            if (!poll.settings.allowMultiple && body.selectedOptionIds.length > 1) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Only one selection allowed for this poll' })
                };
            }
        }

        const vote: Vote = {
            id: generateVoteId(),
            timestamp: new Date().toISOString()
        };

        if (poll.pollType === 'ranked') {
            vote.rankedOptionIds = body.rankedOptionIds;
        } else {
            vote.selectedOptionIds = body.selectedOptionIds;
        }

        poll.votes.push(vote);
        poll.voteCount = poll.votes.length;

        await store.setJSON(body.pollId, poll);

        console.log(`Vote recorded for poll ${body.pollId}. Total: ${poll.voteCount}`);

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
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};
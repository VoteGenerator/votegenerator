import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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
    votes: any[];
    createdAt: string;
    voteCount: number;
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get poll ID from query params
        const pollId = event.queryStringParameters?.id;
        const adminKey = event.queryStringParameters?.admin;

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Fetch from Netlify Blobs
        const store = getStore('votegenerator-polls');
        const poll: Poll | null = await store.get(pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check if this is an admin request
        const isAdmin = adminKey && adminKey === poll.adminKey;

        if (isAdmin) {
            // Admin gets everything including votes and adminKey
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...poll,
                    isAdmin: true
                })
            };
        } else {
            // Public voter view - strip sensitive data
            const publicPoll = {
                id: poll.id,
                title: poll.title,
                description: poll.description,
                pollType: poll.pollType,
                options: poll.options,
                settings: {
                    hideResults: poll.settings.hideResults,
                    allowMultiple: poll.settings.allowMultiple
                },
                createdAt: poll.createdAt,
                voteCount: poll.voteCount,
                isAdmin: false
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(publicPoll)
            };
        }

    } catch (error) {
        console.error('Error fetching poll:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch poll' })
        };
    }
};

import { Handler } from '@netlify/functions';

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
        const pollId = event.queryStringParameters?.id;
        const adminKey = event.queryStringParameters?.admin;

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Fetch from database
        const { getStore } = await import('@netlify/blobs');
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

        // Build response based on access level
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
                options: poll.options,
                settings: {
                    hideResults: poll.settings.hideResults,
                    allowGuestOptions: poll.settings.allowGuestOptions
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

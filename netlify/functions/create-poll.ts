import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string; imageUrl?: string }[];
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

        const store = getStore('polls');
        const poll = await store.get(pollId, { type: 'json' }) as Poll | null;

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        const isAdmin = adminKey && adminKey === poll.adminKey;

        if (isAdmin) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...poll,
                    isAdmin: true
                })
            };
        } else {
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
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};
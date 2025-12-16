import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
    // Only allow GET
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const pollId = event.queryStringParameters?.pollId;

    if (!pollId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing pollId parameter' })
        };
    }

    try {
        // Look up slug by pollId (reverse lookup)
        const reverseStore = getStore('poll-slugs');
        const slug = await reverseStore.get(pollId, { type: 'text' });

        if (!slug) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No custom slug found for this poll' })
            };
        }

        // Get the site URL
        const siteUrl = process.env.URL || 'https://votegenerator.com';

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug,
                shortUrl: `${siteUrl}/v/${slug}`
            })
        };
    } catch (error) {
        console.error('Get slug error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to retrieve slug' })
        };
    }
};
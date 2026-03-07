import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

export const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Only allow GET
    if (event.httpMethod !== 'GET') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-get-slug: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    const pollId = event.queryStringParameters?.pollId;

    if (!pollId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing pollId parameter' })
        };
    }

    try {
        console.log('vg-get-slug: Looking up slug for pollId:', pollId);
        console.log('vg-get-slug: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        // Look up slug by pollId (reverse lookup)
        const reverseStore = getStore({
            name: 'poll-slugs',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const slug = await reverseStore.get(pollId, { type: 'text' });

        if (!slug) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'No custom slug found for this poll' })
            };
        }

        // Get the site URL
        const siteUrl = process.env.URL || 'https://votegenerator.com';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                slug,
                shortUrl: `${siteUrl}/v/${slug}`
            })
        };
    } catch (error) {
        console.error('Get slug error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to retrieve slug' })
        };
    }
};
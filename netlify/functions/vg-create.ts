import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Generate a short, readable ID (8 characters)
const generateShortId = (): string => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate admin key (16 characters)
const generateAdminKey = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate option ID (8 characters)
const generateOptionId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
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
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');

        // Validation
        if (!body.title || body.title.trim().length === 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please add a title' }) };
        }

        if (!Array.isArray(body.options) || body.options.length < 2) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please add at least 2 options' }) };
        }

        // Clean options
        const validOptions = body.options
            .map((opt: any) => (typeof opt === 'string' ? opt.trim() : ''))
            .filter((opt: string) => opt.length > 0);

        if (validOptions.length < 2) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Please add at least 2 valid options' }) };
        }

        // Create poll
        const pollId = generateShortId();
        const adminKey = generateAdminKey();

        const poll = {
            id: pollId,
            adminKey: adminKey,
            title: body.title.trim().substring(0, 200),
            description: body.description?.trim()?.substring(0, 500) || undefined,
            pollType: body.pollType || 'ranked',
            options: validOptions.map((text: string) => ({
                id: generateOptionId(),
                text: text
            })),
            settings: {
                hideResults: Boolean(body.settings?.hideResults),
                allowMultiple: Boolean(body.settings?.allowMultiple)
            },
            votes: [],
            createdAt: new Date().toISOString(),
            voteCount: 0,
            tier: body.tier || 'free',
            maxResponses: 100
        };

        // Store with explicit siteID and token
        const store = getStore({
            name: 'polls',
            siteID: process.env.SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        await store.setJSON(pollId, poll);

        console.log('Poll created:', pollId);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                id: pollId,
                adminKey: adminKey
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};
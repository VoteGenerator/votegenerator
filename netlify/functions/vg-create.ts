import { Handler } from '@netlify/functions';

interface CreatePollRequest {
    title: string;
    description?: string;
    options: string[];
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting';
    settings: {
        hideResults: boolean;
        allowMultiple?: boolean; // For multiple choice - can pick more than one
    };
}

interface PollOption {
    id: string;
    text: string;
    imageUrl?: string; // For image polls
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: PollOption[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: any[];
    createdAt: string;
    voteCount: number;
}

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
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
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
        const body: CreatePollRequest = JSON.parse(event.body || '{}');

        // Validation
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Please add a title for your poll' })
            };
        }

        if (!Array.isArray(body.options) || body.options.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Please add at least 2 options' })
            };
        }

        if (body.options.length > 20) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Maximum 20 options allowed' })
            };
        }

        // Clean up options
        const validOptions = body.options
            .map(opt => (typeof opt === 'string' ? opt.trim() : ''))
            .filter(opt => opt.length > 0 && opt.length <= 200);

        if (validOptions.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Please add at least 2 valid options' })
            };
        }

        // Create poll
        const pollId = generateShortId();
        const adminKey = generateAdminKey();

        const poll: Poll = {
            id: pollId,
            adminKey: adminKey,
            title: body.title.trim().substring(0, 200),
            description: body.description?.trim().substring(0, 500) || undefined,
            pollType: body.pollType || 'ranked',
            options: validOptions.map(text => ({
                id: generateOptionId(),
                text: text
            })),
            settings: {
                hideResults: Boolean(body.settings?.hideResults),
                allowMultiple: Boolean(body.settings?.allowMultiple)
            },
            votes: [],
            createdAt: new Date().toISOString(),
            voteCount: 0
        };

        // Store using Netlify Blobs
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({
            name: 'polls',
            siteID: process.env.SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        await store.setJSON(pollId, poll);

        console.log(`Poll created: ${pollId}, type: ${poll.pollType}`);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                id: pollId,
                adminKey: adminKey
            })
        };

    } catch (error) {
        console.error('Error creating poll:', error);
        
        // More helpful error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Something went wrong. Please try again.',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            })
        };
    }
};

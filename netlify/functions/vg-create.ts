import { Handler } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

// In production, replace with your actual database (FaunaDB, Supabase, etc.)
// This example uses Netlify Blobs or you could use KV store

interface CreatePollRequest {
    title: string;
    description?: string;
    options: string[];
    settings: {
        hideResults: boolean;
        allowGuestOptions: boolean;
    };
}

interface PollOption {
    id: string;
    text: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    options: PollOption[];
    settings: {
        hideResults: boolean;
        allowGuestOptions: boolean;
    };
    votes: any[];
    createdAt: string;
    voteCount: number;
}

// Helper to generate short IDs
const generateShortId = (): string => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789'; // Removed confusing chars
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateAdminKey = (): string => {
    return uuidv4().replace(/-/g, '').substring(0, 16);
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
                body: JSON.stringify({ error: 'Title is required' })
            };
        }

        if (!Array.isArray(body.options) || body.options.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'At least 2 options are required' })
            };
        }

        if (body.options.length > 20) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Maximum 20 options allowed' })
            };
        }

        // Sanitize and validate options
        const validOptions = body.options
            .map(opt => (typeof opt === 'string' ? opt.trim() : ''))
            .filter(opt => opt.length > 0 && opt.length <= 200);

        if (validOptions.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'At least 2 valid options are required' })
            };
        }

        // Create poll object
        const pollId = generateShortId();
        const adminKey = generateAdminKey();

        const poll: Poll = {
            id: pollId,
            adminKey: adminKey,
            title: body.title.trim().substring(0, 200),
            description: body.description?.trim().substring(0, 500) || undefined,
            options: validOptions.map(text => ({
                id: uuidv4().substring(0, 8),
                text: text
            })),
            settings: {
                hideResults: Boolean(body.settings?.hideResults),
                allowGuestOptions: Boolean(body.settings?.allowGuestOptions)
            },
            votes: [],
            createdAt: new Date().toISOString(),
            voteCount: 0
        };

        // Store poll in database
        // For this example, using Netlify Blobs
        // In production, use FaunaDB, Supabase, Upstash, etc.
        
        const { getStore } = await import('@netlify/blobs');
        const store = getStore('votegenerator-polls');
        await store.setJSON(pollId, poll);

        // Return success with IDs (never expose full adminKey in logs)
        console.log(`Poll created: ${pollId}`);

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
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create poll' })
        };
    }
};

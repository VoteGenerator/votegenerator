import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { v4 as uuidv4 } from 'uuid';

interface CreatePollRequest {
    title: string;
    description?: string;
    options: string[];
    pollType: 'ranked' | 'multiple';
    settings: {
        hideResults: boolean;
        allowMultiple?: boolean;
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
    pollType: 'ranked' | 'multiple';
    options: PollOption[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: any[];
    createdAt: string;
    voteCount: number;
}

// Generate short, readable poll IDs
const generateShortId = (): string => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate admin key for poll management
const generateAdminKey = (): string => {
    return uuidv4().replace(/-/g, '').substring(0, 16);
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

        // Sanitize options
        const validOptions = body.options
            .map(opt => (typeof opt === 'string' ? opt.trim() : ''))
            .filter(opt => opt.length > 0);

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
            description: body.description?.trim().substring(0, 1000) || undefined,
            pollType: body.pollType || 'ranked',
            options: validOptions.map((text, index) => ({
                id: `opt_${index}_${Date.now().toString(36)}`,
                text: text.substring(0, 200)
            })),
            settings: {
                hideResults: body.settings?.hideResults ?? false,
                allowMultiple: body.settings?.allowMultiple ?? false
            },
            votes: [],
            createdAt: new Date().toISOString(),
            voteCount: 0
        };

        // Save to Netlify Blobs
        const store = getStore('votegenerator-polls');
        await store.setJSON(pollId, poll);

        console.log(`Poll created: ${pollId}`);

        // Return poll info (including adminKey for creator)
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                success: true,
                pollId: poll.id,
                adminKey: poll.adminKey,
                pollUrl: `/poll/${poll.id}`,
                adminUrl: `/poll/${poll.id}?admin=${poll.adminKey}`
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

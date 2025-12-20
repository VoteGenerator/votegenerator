import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface CreatePollRequest {
    title: string;
    description?: string;
    options: string[];
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting';
    settings?: {
        hideResults?: boolean;
        allowMultiple?: boolean;
    };
    tier?: 'free' | 'quick_poll' | 'event_poll' | 'pro_monthly' | 'pro_yearly' | 'pro_plus_monthly' | 'pro_plus_yearly';
    theme?: string;
    buttonText?: string;
}

interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
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
    tier: string;
    theme?: string;
    buttonText?: string;
    maxResponses: number;
    expiresAt?: string;
}

// Tier configuration for max responses and duration
const TIER_LIMITS = {
    free: { maxResponses: 100, durationDays: 30 },
    quick_poll: { maxResponses: 500, durationDays: 7 },
    event_poll: { maxResponses: 2000, durationDays: 30 },
    pro_monthly: { maxResponses: 2000, durationDays: null },
    pro_yearly: { maxResponses: 2000, durationDays: null },
    pro_plus_monthly: { maxResponses: 5000, durationDays: null },
    pro_plus_yearly: { maxResponses: 5000, durationDays: null },
};

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
        
        console.log('Received create poll request:', JSON.stringify(body, null, 2));

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

        // Determine tier (default to free if not specified)
        const tier = body.tier || 'free';
        const tierLimits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;

        // Calculate expiration date based on tier
        let expiresAt: string | undefined;
        if (tierLimits.durationDays) {
            const expDate = new Date();
            expDate.setDate(expDate.getDate() + tierLimits.durationDays);
            expiresAt = expDate.toISOString();
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
            voteCount: 0,
            tier: tier,
            theme: body.theme,
            buttonText: body.buttonText,
            maxResponses: tierLimits.maxResponses,
            expiresAt: expiresAt
        };

        // Store using Netlify Blobs - SIMPLE SYNTAX (like your other functions)
        const store = getStore('polls');
        await store.setJSON(pollId, poll);

        console.log(`Poll created successfully: ${pollId}, type: ${poll.pollType}, tier: ${tier}`);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                id: pollId,
                adminKey: adminKey,
                tier: tier,
                maxResponses: tierLimits.maxResponses,
                expiresAt: expiresAt
            })
        };

    } catch (error) {
        console.error('Error creating poll:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Something went wrong. Please try again.',
                details: errorMessage // Always show details for debugging
            })
        };
    }
};
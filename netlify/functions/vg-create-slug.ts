import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Reserved slugs that can't be used
const RESERVED_SLUGS = [
    'pricing', 'demo', 'blog', 'help', 'about', 'api', 'admin',
    'login', 'signup', 'register', 'account', 'settings', 'dashboard',
    'create', 'vote', 'results', 'embed', 'terms', 'privacy', 'contact'
];

interface CustomSlug {
    slug: string;
    pollId: string;
    adminKey: string;
    createdAt: string;
}

export const handler: Handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { slug, pollId, adminKey } = body;

        // Validate required fields
        if (!slug || !pollId || !adminKey) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Missing required fields: slug, pollId, adminKey' 
                })
            };
        }

        // Sanitize and validate slug
        const cleanSlug = slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]/g, '-')  // Replace invalid chars with dash
            .replace(/-+/g, '-')           // Collapse multiple dashes
            .replace(/^-|-$/g, '')         // Remove leading/trailing dashes
            .substring(0, 50);             // Max 50 chars

        // Validation checks
        if (cleanSlug.length < 3) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Slug must be at least 3 characters long' 
                })
            };
        }

        if (RESERVED_SLUGS.includes(cleanSlug)) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'This slug is reserved. Please choose another.' 
                })
            };
        }

        // Check if slug looks like a UUID (prevent confusion)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}/.test(cleanSlug)) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Slug cannot look like a system ID. Please use a readable name.' 
                })
            };
        }

        const store = getStore('custom-slugs');

        // Check if slug already exists
        const existing = await store.get(cleanSlug);
        if (existing) {
            return {
                statusCode: 409,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'This slug is already taken. Please choose another.' 
                })
            };
        }

        // Verify the poll exists and adminKey is valid
        const pollStore = getStore('polls');
        const poll = await pollStore.get(pollId, { type: 'json' });
        
        if (!poll) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Verify admin key matches
        if ((poll as any).adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        // Create the slug record
        const slugRecord: CustomSlug = {
            slug: cleanSlug,
            pollId,
            adminKey,
            createdAt: new Date().toISOString()
        };

        await store.setJSON(cleanSlug, slugRecord);

        // Also store reverse lookup (pollId -> slug) for easy access
        const reverseStore = getStore('poll-slugs');
        await reverseStore.set(pollId, cleanSlug);

        // Get the site URL for the response
        const siteUrl = process.env.URL || 'https://votegenerator.com';

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                slug: cleanSlug,
                shortUrl: `${siteUrl}/v/${cleanSlug}`,
                adminUrl: `${siteUrl}/v/${cleanSlug}?admin=${adminKey}`
            })
        };
    } catch (error) {
        console.error('Create slug error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create short link' })
        };
    }
};
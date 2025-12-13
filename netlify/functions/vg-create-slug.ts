import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const RESERVED_SLUGS = ['pricing', 'demo', 'blog', 'help', 'about', 'api', 'admin'];

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    try {
        const { slug, pollId, adminKey } = JSON.parse(event.body || '{}');

        // Validation
        if (!slug || !pollId || !adminKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Sanitize slug
        const cleanSlug = slug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);

        if (cleanSlug.length < 3) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Slug must be at least 3 characters' })
            };
        }

        if (RESERVED_SLUGS.includes(cleanSlug)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'This slug is reserved' })
            };
        }

        const store = getStore('custom-slugs');

        // Check if slug already exists
        const existing = await store.get(cleanSlug);
        if (existing) {
            return {
                statusCode: 409,
                body: JSON.stringify({ error: 'Slug already taken' })
            };
        }

        // Save the slug
        await store.setJSON(cleanSlug, {
            slug: cleanSlug,
            pollId,
            adminKey,
            createdAt: new Date().toISOString()
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                shortUrl: `https://votegenerator.com/v/${cleanSlug}`,
                slug: cleanSlug
            })
        };
    } catch (error) {
        console.error('Create slug error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create short link' })
        };
    }
};
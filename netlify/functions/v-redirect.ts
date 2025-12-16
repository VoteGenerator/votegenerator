import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface CustomSlug {
    slug: string;
    pollId: string;
    adminKey: string;
    createdAt: string;
}

export const handler: Handler = async (event) => {
    // Extract slug from path: /v/team-vote -> team-vote
    const pathParts = event.path.split('/v/');
    const slug = pathParts[1]?.split('/')[0]?.split('?')[0]?.toLowerCase();

    if (!slug) {
        return {
            statusCode: 302,
            headers: { Location: '/' }
        };
    }

    try {
        const store = getStore('custom-slugs');
        const data = await store.get(slug, { type: 'json' }) as CustomSlug | null;

        if (!data) {
            // Slug not found - redirect to home with error
            return {
                statusCode: 302,
                headers: { Location: '/?error=poll-not-found' }
            };
        }

        // Check if admin access is requested
        const queryAdmin = event.queryStringParameters?.admin;
        const isAdmin = queryAdmin === data.adminKey;
        
        // Build redirect URL
        const redirectUrl = isAdmin 
            ? `/#id=${data.pollId}&admin=${data.adminKey}`
            : `/#id=${data.pollId}`;

        return {
            statusCode: 302,
            headers: { 
                Location: redirectUrl,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        };
    } catch (error) {
        console.error('Short link redirect error:', error);
        return {
            statusCode: 302,
            headers: { Location: '/' }
        };
    }
};
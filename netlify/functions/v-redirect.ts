import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
    // Extract slug from path: /v/team-vote -> team-vote
    const pathParts = event.path.split('/v/');
    const slug = pathParts[1]?.split('/')[0]?.toLowerCase();

    if (!slug) {
        return {
            statusCode: 302,
            headers: { Location: '/' }
        };
    }

    try {
        const store = getStore('custom-slugs');
        const data = await store.get(slug, { type: 'json' });

        if (!data) {
            // Slug not found - redirect to 404 or home
            return {
                statusCode: 302,
                headers: { Location: '/?error=poll-not-found' }
            };
        }

        // Redirect to the actual poll
        const { pollId, adminKey } = data as CustomSlug;
        
        // Check if this is an admin access
        const isAdmin = event.queryStringParameters?.admin === adminKey;
        
        const redirectUrl = isAdmin 
            ? `/#id=${pollId}&admin=${adminKey}`
            : `/#id=${pollId}`;

        return {
            statusCode: 302,
            headers: { Location: redirectUrl }
        };
    } catch (error) {
        console.error('Short link redirect error:', error);
        return {
            statusCode: 302,
            headers: { Location: '/' }
        };
    }
};
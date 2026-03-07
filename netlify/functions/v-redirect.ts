import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

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

    // Check Blobs credentials
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('v-redirect: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return {
            statusCode: 302,
            headers: { Location: '/?error=server-error' }
        };
    }

    try {
        console.log('v-redirect: Looking up slug:', slug);
        console.log('v-redirect: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const store = getStore({
            name: 'custom-slugs',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

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

        console.log('v-redirect: Redirecting to poll:', data.pollId);

        return {
            statusCode: 302,
            headers: { 
                Location: redirectUrl,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        };
    } catch (error) {
        console.error('v-redirect: Short link redirect error:', error);
        return {
            statusCode: 302,
            headers: { Location: '/' }
        };
    }
};
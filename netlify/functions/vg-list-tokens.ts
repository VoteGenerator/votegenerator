// ============================================================================
// vg-list-tokens.ts - List all access tokens for a poll
// Location: netlify/functions/vg-list-tokens.ts
// Returns all tokens for master admin to view/manage
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface AccessToken {
    token: string;
    role: 'admin' | 'viewer';
    label: string;
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
}

interface Poll {
    id: string;
    adminKey: string;
    question: string;
    options: string[];
    type: string;
    settings: Record<string, any>;
    createdAt: string;
    tier?: string;
    accessTokens?: AccessToken[];
}

const MAX_TOKENS_PER_POLL = 10;

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-list-tokens: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        // Support both GET and POST
        let pollId: string | null = null;
        let adminKey: string | null = null;

        if (event.httpMethod === 'GET') {
            const params = event.queryStringParameters || {};
            pollId = params.pollId || null;
            adminKey = params.adminKey || null;
        } else if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            pollId = body.pollId || null;
            adminKey = body.adminKey || null;
        }

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key required' }),
            };
        }

        console.log('vg-list-tokens: Listing tokens for poll:', pollId);
        console.log('vg-list-tokens: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // Fetch the poll
        const pollData = await pollStore.get(pollId, { type: 'json' }) as Poll | null;
        
        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' }),
            };
        }

        // Verify admin key (only master admin can list tokens)
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Only the poll creator can view tokens.' }),
            };
        }

        const tokens = pollData.accessTokens || [];
        const baseUrl = process.env.URL || 'https://votegenerator.com';

        // Separate tokens by role
        const adminTokens = tokens
            .filter(t => t.role === 'admin')
            .map(t => ({
                ...t,
                url: `${baseUrl}/#id=${pollId}&access=${t.token}`,
                isExpired: t.expiresAt ? new Date(t.expiresAt) < new Date() : false,
            }));

        const viewerTokens = tokens
            .filter(t => t.role === 'viewer')
            .map(t => ({
                ...t,
                url: `${baseUrl}/#id=${pollId}&access=${t.token}`,
                isExpired: t.expiresAt ? new Date(t.expiresAt) < new Date() : false,
            }));

        console.log('vg-list-tokens: Found', tokens.length, 'tokens');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                poll: {
                    id: pollData.id,
                    question: pollData.question,
                    tier: pollData.tier,
                },
                tokens: {
                    admin: adminTokens,
                    viewer: viewerTokens,
                },
                summary: {
                    total: tokens.length,
                    adminCount: adminTokens.length,
                    viewerCount: viewerTokens.length,
                    maxTokens: MAX_TOKENS_PER_POLL,
                    canCreateMore: tokens.length < MAX_TOKENS_PER_POLL,
                },
            }),
        };
    } catch (error) {
        console.error('vg-list-tokens: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to list tokens' }),
        };
    }
};
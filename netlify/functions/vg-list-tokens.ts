// ============================================================================
// vg-list-tokens.ts - List all access tokens for a poll
// Location: netlify/functions/vg-list-tokens.ts
// Returns all tokens for master admin to view/manage
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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

        const pollStore = getStore('polls');

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
        console.error('List tokens error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to list tokens' }),
        };
    }
};
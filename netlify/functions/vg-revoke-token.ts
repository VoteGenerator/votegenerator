// ============================================================================
// vg-revoke-token.ts - Revoke an access token
// Location: netlify/functions/vg-revoke-token.ts
// Removes an access token from a poll (only master admin can revoke)
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

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { pollId, adminKey, tokenToRevoke } = JSON.parse(event.body || '{}');

        // Validation
        if (!pollId || !adminKey || !tokenToRevoke) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID, admin key, and token to revoke required' }),
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

        // Verify admin key (only master admin can revoke tokens)
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Only the poll creator can revoke tokens.' }),
            };
        }

        // Find and remove the token
        const existingTokens = pollData.accessTokens || [];
        const tokenIndex = existingTokens.findIndex(t => t.token === tokenToRevoke);

        if (tokenIndex === -1) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Token not found' }),
            };
        }

        // Get token info before removing (for response)
        const revokedToken = existingTokens[tokenIndex];

        // Remove the token
        pollData.accessTokens = existingTokens.filter(t => t.token !== tokenToRevoke);
        await pollStore.setJSON(pollId, pollData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Token revoked successfully',
                revokedToken: {
                    label: revokedToken.label,
                    role: revokedToken.role,
                    createdAt: revokedToken.createdAt,
                },
                remainingTokens: pollData.accessTokens.length,
            }),
        };

    } catch (error) {
        console.error('Revoke token error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to revoke token' }),
        };
    }
};
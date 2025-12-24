// ============================================================================
// vg-revoke-token.ts - Revoke Access Tokens
// Location: netlify/functions/vg-revoke-token.ts
// Only master admin can revoke tokens
// ============================================================================

import { Handler } from '@netlify/functions';

// Your database imports
// import { db } from '../lib/database';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { pollId, adminKey, token } = JSON.parse(event.body || '{}');

        // Validation
        if (!pollId || !adminKey || !token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID, admin key, and token are required' })
            };
        }

        // Get poll and verify master admin
        const poll = await getPoll(pollId);

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        if (poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key. Only the poll creator can revoke access.' })
            };
        }

        // Find and remove the token
        const existingTokens = poll.accessTokens || [];
        const tokenIndex = existingTokens.findIndex((t: any) => t.token === token);

        if (tokenIndex === -1) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Token not found' })
            };
        }

        const revokedToken = existingTokens[tokenIndex];

        // Remove token from poll
        await removeTokenFromPoll(pollId, token);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Access revoked for "${revokedToken.label}"`,
                revokedToken: {
                    label: revokedToken.label,
                    role: revokedToken.role
                }
            })
        };

    } catch (error) {
        console.error('Revoke token error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

// ============================================================================
// Database Functions - Replace with your implementation
// ============================================================================

async function getPoll(pollId: string): Promise<any> {
    // Example:
    // return await db.polls.findOne({ id: pollId });
    return null;
}

async function removeTokenFromPoll(pollId: string, token: string): Promise<void> {
    // Example:
    // await db.polls.updateOne(
    //     { id: pollId },
    //     { $pull: { accessTokens: { token: token } } }
    // );
}
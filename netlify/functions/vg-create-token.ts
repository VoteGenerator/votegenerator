// ============================================================================
// vg-create-token.ts - Create Admin/Viewer Access Tokens
// Location: netlify/functions/vg-create-token.ts
// Unlimited users can create up to 10 access tokens per poll
// ============================================================================

import { Handler } from '@netlify/functions';
import crypto from 'crypto';

// Your database imports
// import { db } from '../lib/database';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

const MAX_TOKENS_PER_POLL = 10;

interface AccessToken {
    token: string;
    role: 'admin' | 'viewer';
    label: string;
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
}

export const handler: Handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { pollId, adminKey, role, label, expiresIn } = JSON.parse(event.body || '{}');

        // Validation
        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        if (!role || !['admin', 'viewer'].includes(role)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Role must be "admin" or "viewer"' })
            };
        }

        if (!label || typeof label !== 'string' || label.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Label is required' })
            };
        }

        if (label.length > 50) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Label must be 50 characters or less' })
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
                body: JSON.stringify({ error: 'Invalid admin key. Only the poll creator can manage access.' })
            };
        }

        // Check if user has Unlimited tier
        if (poll.tier !== 'unlimited') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Access tokens require Unlimited plan' })
            };
        }

        // Check token limit
        const existingTokens = poll.accessTokens || [];
        if (existingTokens.length >= MAX_TOKENS_PER_POLL) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: `Maximum ${MAX_TOKENS_PER_POLL} tokens allowed. Revoke one to create more.` 
                })
            };
        }

        // Generate token
        const prefix = role === 'admin' ? 'adm_' : 'view_';
        const tokenValue = prefix + crypto.randomBytes(16).toString('base64url');

        // Calculate expiration if specified
        let expiresAt: string | undefined;
        if (expiresIn && typeof expiresIn === 'number' && expiresIn > 0) {
            expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toISOString();
        }

        const newToken: AccessToken = {
            token: tokenValue,
            role,
            label: label.trim(),
            createdAt: new Date().toISOString(),
            expiresAt
        };

        // Add token to poll
        await addTokenToPoll(pollId, newToken);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                token: newToken,
                url: `${process.env.URL || 'https://votegenerator.com'}/#id=${pollId}&access=${tokenValue}`
            })
        };

    } catch (error) {
        console.error('Create token error:', error);
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

async function addTokenToPoll(pollId: string, token: AccessToken): Promise<void> {
    // Example:
    // await db.polls.updateOne(
    //     { id: pollId },
    //     { $push: { accessTokens: token } }
    // );
}
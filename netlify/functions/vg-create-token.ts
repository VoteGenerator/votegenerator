// ============================================================================
// vg-create-token.ts - Create access token for team sharing
// Location: netlify/functions/vg-create-token.ts
// Creates admin or viewer tokens for Unlimited users
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

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

// Generate a secure random token
const generateToken = (role: 'admin' | 'viewer'): string => {
    const prefix = role === 'admin' ? 'adm_' : 'view_';
    const randomPart = crypto.randomBytes(12).toString('base64url');
    return prefix + randomPart;
};

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-create-token: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const { 
            pollId, 
            adminKey, 
            role, 
            label,
            expiresAt 
        } = JSON.parse(event.body || '{}');

        // Validation
        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key required' }),
            };
        }

        if (!role || !['admin', 'viewer'].includes(role)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Role must be "admin" or "viewer"' }),
            };
        }

        if (!label || label.length > 50) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Label required (max 50 characters)' }),
            };
        }

        console.log('vg-create-token: Creating token for poll:', pollId);
        console.log('vg-create-token: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

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

        // Verify admin key (only master admin can create tokens)
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key. Only the poll creator can create tokens.' }),
            };
        }

        // Check tier - only Unlimited can create tokens
        const tier = pollData.tier || 'free';
        if (tier !== 'unlimited') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Access tokens are only available for Unlimited plan users.',
                    upgradeRequired: true,
                }),
            };
        }

        // Check token limit
        const existingTokens = pollData.accessTokens || [];
        if (existingTokens.length >= MAX_TOKENS_PER_POLL) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: `Maximum ${MAX_TOKENS_PER_POLL} tokens per poll reached.`,
                    limitReached: true,
                }),
            };
        }

        // Generate token
        const newToken: AccessToken = {
            token: generateToken(role),
            role,
            label: label.trim(),
            createdAt: new Date().toISOString(),
        };

        // Add expiration if provided
        if (expiresAt) {
            const expDate = new Date(expiresAt);
            if (expDate > new Date()) {
                newToken.expiresAt = expDate.toISOString();
            }
        }

        // Update poll with new token
        pollData.accessTokens = [...existingTokens, newToken];
        await pollStore.setJSON(pollId, pollData);

        // Generate the access URL
        const baseUrl = process.env.URL || 'https://votegenerator.com';
        const accessUrl = `${baseUrl}/#id=${pollId}&access=${newToken.token}`;

        console.log('vg-create-token: Token created successfully for poll:', pollId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `${role === 'admin' ? 'Admin' : 'Viewer'} token created`,
                token: {
                    ...newToken,
                    url: accessUrl,
                },
                totalTokens: pollData.accessTokens.length,
                maxTokens: MAX_TOKENS_PER_POLL,
            }),
        };
    } catch (error) {
        console.error('vg-create-token: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create token' }),
        };
    }
};
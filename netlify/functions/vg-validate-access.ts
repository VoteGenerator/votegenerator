// ============================================================================
// vg-validate-access.ts - Validate access and return permissions
// Location: netlify/functions/vg-validate-access.ts
// Checks admin key or access token and returns appropriate permissions
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
    status?: 'draft' | 'live';
}

// Permission sets for each access level
const PERMISSIONS = {
    master: {
        level: 'master',
        viewResults: true,
        editPoll: true,
        closePoll: true,
        deletePoll: true,
        exportCsv: true,
        exportPdf: true,
        manageAccess: true,
        viewTokens: true,
        createTokens: true,
        revokeTokens: true,
        setPin: true,
    },
    admin: {
        level: 'admin',
        viewResults: true,
        editPoll: true,
        closePoll: false,
        deletePoll: false,
        exportCsv: true,
        exportPdf: true,
        manageAccess: false,
        viewTokens: false,
        createTokens: false,
        revokeTokens: false,
        setPin: false,
    },
    viewer: {
        level: 'viewer',
        viewResults: true,
        editPoll: false,
        closePoll: false,
        deletePoll: false,
        exportCsv: false,
        exportPdf: false,
        manageAccess: false,
        viewTokens: false,
        createTokens: false,
        revokeTokens: false,
        setPin: false,
    },
    none: {
        level: 'none',
        viewResults: false,
        editPoll: false,
        closePoll: false,
        deletePoll: false,
        exportCsv: false,
        exportPdf: false,
        manageAccess: false,
        viewTokens: false,
        createTokens: false,
        revokeTokens: false,
        setPin: false,
    },
};

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
        // Support both GET (query params) and POST (body)
        let pollId: string | null = null;
        let adminKey: string | null = null;
        let accessToken: string | null = null;

        if (event.httpMethod === 'GET') {
            const params = event.queryStringParameters || {};
            pollId = params.pollId || null;
            adminKey = params.adminKey || null;
            accessToken = params.accessToken || null;
        } else if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            pollId = body.pollId || null;
            adminKey = body.adminKey || null;
            accessToken = body.accessToken || null;
        }

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID required' }),
            };
        }

        if (!adminKey && !accessToken) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Admin key or access token required' }),
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

        // Check master admin key first
        if (adminKey && pollData.adminKey === adminKey) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    valid: true,
                    accessLevel: 'master',
                    permissions: PERMISSIONS.master,
                    poll: {
                        id: pollData.id,
                        question: pollData.question,
                        status: pollData.status || 'live',
                        tier: pollData.tier,
                        tokenCount: (pollData.accessTokens || []).length,
                    },
                }),
            };
        }

        // Check access token
        if (accessToken) {
            const tokens = pollData.accessTokens || [];
            const foundToken = tokens.find(t => t.token === accessToken);

            if (foundToken) {
                // Check expiration
                if (foundToken.expiresAt && new Date(foundToken.expiresAt) < new Date()) {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({ 
                            valid: false,
                            error: 'Token has expired',
                            accessLevel: 'none',
                            permissions: PERMISSIONS.none,
                        }),
                    };
                }

                // Update lastUsed timestamp
                foundToken.lastUsed = new Date().toISOString();
                await pollStore.setJSON(pollId, pollData);

                const permissions = foundToken.role === 'admin' ? PERMISSIONS.admin : PERMISSIONS.viewer;

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        valid: true,
                        accessLevel: foundToken.role,
                        tokenLabel: foundToken.label,
                        permissions,
                        poll: {
                            id: pollData.id,
                            question: pollData.question,
                            status: pollData.status || 'live',
                        },
                    }),
                };
            }
        }

        // Invalid credentials
        return {
            statusCode: 403,
            headers,
            body: JSON.stringify({
                valid: false,
                error: 'Invalid credentials',
                accessLevel: 'none',
                permissions: PERMISSIONS.none,
            }),
        };

    } catch (error) {
        console.error('Validate access error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to validate access' }),
        };
    }
};
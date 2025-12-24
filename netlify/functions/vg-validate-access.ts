// ============================================================================
// vg-validate-access.ts - Validate Access Level
// Location: netlify/functions/vg-validate-access.ts
// Determines access level: master, admin, viewer, or none
// Updates lastUsed timestamp for tokens
// ============================================================================

import { Handler } from '@netlify/functions';

// Your database imports
// import { db } from '../lib/database';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

type AccessLevel = 'master' | 'admin' | 'viewer' | 'none';

interface AccessResponse {
    valid: boolean;
    accessLevel: AccessLevel;
    requiresPin?: boolean;
    label?: string;
    permissions: {
        viewResults: boolean;
        editPoll: boolean;
        exportCsv: boolean;
        closePoll: boolean;
        deletePoll: boolean;
        manageAccess: boolean;
    };
}

export const handler: Handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        // Support both GET params and POST body
        let pollId: string | null = null;
        let adminKey: string | null = null;
        let accessToken: string | null = null;

        if (event.httpMethod === 'GET') {
            pollId = event.queryStringParameters?.pollId || null;
            adminKey = event.queryStringParameters?.adminKey || null;
            accessToken = event.queryStringParameters?.access || null;
        } else {
            const body = JSON.parse(event.body || '{}');
            pollId = body.pollId;
            adminKey = body.adminKey;
            accessToken = body.access;
        }

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll
        const poll = await getPoll(pollId);

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check access type in order of priority
        let response: AccessResponse;

        // 1. MASTER ADMIN (full control)
        if (adminKey && poll.adminKey === adminKey) {
            response = {
                valid: true,
                accessLevel: 'master',
                requiresPin: !!(poll.settings?.adminPinHash),
                permissions: {
                    viewResults: true,
                    editPoll: true,
                    exportCsv: true,
                    closePoll: true,
                    deletePoll: true,
                    manageAccess: true
                }
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(response)
            };
        }

        // 2. ACCESS TOKEN (admin or viewer)
        if (accessToken) {
            const tokens = poll.accessTokens || [];
            const token = tokens.find((t: any) => t.token === accessToken);

            if (token) {
                // Check if token is expired
                if (token.expiresAt && new Date(token.expiresAt) < new Date()) {
                    response = {
                        valid: false,
                        accessLevel: 'none',
                        permissions: {
                            viewResults: false,
                            editPoll: false,
                            exportCsv: false,
                            closePoll: false,
                            deletePoll: false,
                            manageAccess: false
                        }
                    };

                    return {
                        statusCode: 401,
                        headers,
                        body: JSON.stringify({
                            ...response,
                            error: 'This access link has expired'
                        })
                    };
                }

                // Update lastUsed timestamp
                await updateTokenLastUsed(pollId, accessToken);

                if (token.role === 'admin') {
                    response = {
                        valid: true,
                        accessLevel: 'admin',
                        label: token.label,
                        permissions: {
                            viewResults: true,
                            editPoll: true,
                            exportCsv: true,
                            closePoll: false,
                            deletePoll: false,
                            manageAccess: false
                        }
                    };
                } else {
                    // Viewer
                    response = {
                        valid: true,
                        accessLevel: 'viewer',
                        label: token.label,
                        permissions: {
                            viewResults: true,
                            editPoll: false,
                            exportCsv: false,
                            closePoll: false,
                            deletePoll: false,
                            manageAccess: false
                        }
                    };
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(response)
                };
            }
        }

        // 3. NO VALID ACCESS
        response = {
            valid: false,
            accessLevel: 'none',
            permissions: {
                viewResults: false,
                editPoll: false,
                exportCsv: false,
                closePoll: false,
                deletePoll: false,
                manageAccess: false
            }
        };

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                ...response,
                error: 'Invalid or missing access credentials'
            })
        };

    } catch (error) {
        console.error('Validate access error:', error);
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

async function updateTokenLastUsed(pollId: string, token: string): Promise<void> {
    // Example:
    // await db.polls.updateOne(
    //     { id: pollId, 'accessTokens.token': token },
    //     { $set: { 'accessTokens.$.lastUsed': new Date().toISOString() } }
    // );
}
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface AdminToken {
    id: string;
    key: string;
    label: string;
    createdAt: string;
    lastUsed?: string;
    permissions: 'full' | 'edit' | 'view-only';
}

interface Poll {
    id: string;
    masterKey?: string;
    adminKey?: string; // Legacy field
    adminTokens?: AdminToken[];
}

type AccessLevel = 'master' | 'full' | 'edit' | 'view-only' | 'public';

interface AccessResponse {
    accessLevel: AccessLevel;
    permissions: string[];
    label: string;
    tokenId?: string;
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const pollId = event.queryStringParameters?.pollId;
    const masterKey = event.queryStringParameters?.master;
    const tokenKey = event.queryStringParameters?.token;
    const adminKey = event.queryStringParameters?.admin; // Legacy support

    if (!pollId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing pollId' })
        };
    }

    try {
        const store = getStore('polls');
        const poll = await store.get(pollId, { type: 'json' }) as Poll | null;

        if (!poll) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check master key (new system)
        if (masterKey && poll.masterKey === masterKey) {
            const response: AccessResponse = {
                accessLevel: 'master',
                permissions: ['view', 'edit', 'close', 'delete', 'create_tokens', 'revoke_tokens', 'export'],
                label: 'Poll Creator (Master)'
            };
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
            };
        }

        // Check legacy admin key (backwards compatibility)
        // Treat legacy adminKey as master if no masterKey exists
        if (adminKey && poll.adminKey === adminKey) {
            const isMasterEquivalent = !poll.masterKey || poll.masterKey === adminKey;
            const response: AccessResponse = {
                accessLevel: isMasterEquivalent ? 'master' : 'full',
                permissions: isMasterEquivalent 
                    ? ['view', 'edit', 'close', 'delete', 'create_tokens', 'revoke_tokens', 'export']
                    : ['view', 'edit', 'close', 'export'],
                label: isMasterEquivalent ? 'Poll Creator' : 'Admin (Legacy)'
            };
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
            };
        }

        // Check admin tokens
        if (tokenKey && poll.adminTokens) {
            const token = poll.adminTokens.find(t => t.key === tokenKey);
            
            if (token) {
                // Update last used timestamp
                token.lastUsed = new Date().toISOString();
                await store.setJSON(pollId, poll);

                const permissionsByLevel: Record<string, string[]> = {
                    'full': ['view', 'edit', 'close', 'export'],
                    'edit': ['view', 'edit'],
                    'view-only': ['view']
                };

                const response: AccessResponse = {
                    accessLevel: token.permissions,
                    permissions: permissionsByLevel[token.permissions] || ['view'],
                    label: token.label,
                    tokenId: token.id
                };

                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response)
                };
            }
        }

        // No valid credentials - public access (voter)
        const response: AccessResponse = {
            accessLevel: 'public',
            permissions: ['vote', 'view_results'],
            label: 'Public Voter'
        };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Validate access error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to validate access' })
        };
    }
};
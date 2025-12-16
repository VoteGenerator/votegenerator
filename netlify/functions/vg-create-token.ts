import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Maximum tokens per poll to prevent abuse
const MAX_TOKENS_PER_POLL = 10;

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
    masterKey: string;
    adminTokens?: AdminToken[];
    // ... other fields
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { pollId, masterKey, label, permissions } = JSON.parse(event.body || '{}');

        // Validate required fields
        if (!pollId || !masterKey) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing pollId or masterKey' })
            };
        }

        const store = getStore('polls');
        const poll = await store.get(pollId, { type: 'json' }) as Poll | null;

        if (!poll) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // CRITICAL: Only master key can create tokens
        // Check both masterKey (new system) and adminKey (legacy) for backwards compatibility
        const isValidMaster = poll.masterKey === masterKey || 
            ((poll as any).adminKey === masterKey && !poll.masterKey);
        
        if (!isValidMaster) {
            return {
                statusCode: 403,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Only the poll creator can manage admin tokens' })
            };
        }

        // Initialize adminTokens if not exists
        poll.adminTokens = poll.adminTokens || [];

        // Check token limit to prevent abuse
        if (poll.adminTokens.length >= MAX_TOKENS_PER_POLL) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `Maximum ${MAX_TOKENS_PER_POLL} tokens allowed per poll. Revoke unused tokens first.` 
                })
            };
        }

        // Generate new token
        const tokenId = crypto.randomUUID();
        const tokenKey = crypto.randomUUID().split('-').slice(0, 2).join(''); // Shorter key for sharing
        
        const newToken: AdminToken = {
            id: tokenId,
            key: tokenKey,
            label: (label || 'Unnamed Token').substring(0, 50), // Limit label length
            createdAt: new Date().toISOString(),
            permissions: ['full', 'edit', 'view-only'].includes(permissions) ? permissions : 'view-only'
        };

        poll.adminTokens.push(newToken);
        
        // If this poll doesn't have a masterKey yet (legacy poll), set it
        if (!poll.masterKey && (poll as any).adminKey) {
            poll.masterKey = (poll as any).adminKey;
        }

        await store.setJSON(pollId, poll);

        const siteUrl = process.env.URL || 'https://votegenerator.com';

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                token: {
                    id: newToken.id,
                    label: newToken.label,
                    permissions: newToken.permissions,
                    createdAt: newToken.createdAt
                },
                tokenUrl: `${siteUrl}/#id=${pollId}&token=${tokenKey}`,
                totalTokens: poll.adminTokens.length,
                maxTokens: MAX_TOKENS_PER_POLL
            })
        };
    } catch (error) {
        console.error('Create token error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create token' })
        };
    }
};
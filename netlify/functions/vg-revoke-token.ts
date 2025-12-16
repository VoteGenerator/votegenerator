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
    masterKey: string;
    adminTokens?: AdminToken[];
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { pollId, masterKey, tokenId } = JSON.parse(event.body || '{}');

        if (!pollId || !masterKey || !tokenId) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing required fields' })
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

        // CRITICAL: Only master key can revoke tokens
        const isValidMaster = poll.masterKey === masterKey || 
            ((poll as any).adminKey === masterKey && !poll.masterKey);
        
        if (!isValidMaster) {
            return {
                statusCode: 403,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Only the poll creator can revoke tokens' })
            };
        }

        if (!poll.adminTokens || poll.adminTokens.length === 0) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No tokens found' })
            };
        }

        // Find and remove the token
        const tokenIndex = poll.adminTokens.findIndex(t => t.id === tokenId);
        
        if (tokenIndex === -1) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Token not found' })
            };
        }

        const revokedToken = poll.adminTokens[tokenIndex];
        poll.adminTokens.splice(tokenIndex, 1);

        await store.setJSON(pollId, poll);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                revokedToken: {
                    id: revokedToken.id,
                    label: revokedToken.label
                },
                remainingTokens: poll.adminTokens.length
            })
        };
    } catch (error) {
        console.error('Revoke token error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to revoke token' })
        };
    }
};
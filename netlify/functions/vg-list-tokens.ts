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
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const pollId = event.queryStringParameters?.pollId;
    const masterKey = event.queryStringParameters?.masterKey;

    if (!pollId || !masterKey) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing pollId or masterKey' })
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

        // Only master can list tokens
        const isValidMaster = poll.masterKey === masterKey || 
            ((poll as any).adminKey === masterKey && !poll.masterKey);
        
        if (!isValidMaster) {
            return {
                statusCode: 403,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Only the poll creator can view tokens' })
            };
        }

        const tokens = (poll.adminTokens || []).map(token => ({
            id: token.id,
            label: token.label,
            permissions: token.permissions,
            createdAt: token.createdAt,
            lastUsed: token.lastUsed || null
            // Note: We don't return the actual key for security
        }));

        const siteUrl = process.env.URL || 'https://votegenerator.com';

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tokens,
                totalTokens: tokens.length,
                maxTokens: 10,
                masterUrl: `${siteUrl}/#id=${pollId}&master=${masterKey}`
            })
        };
    } catch (error) {
        console.error('List tokens error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to list tokens' })
        };
    }
};
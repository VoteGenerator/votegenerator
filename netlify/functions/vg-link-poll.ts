// ============================================================================
// vg-link-poll.ts - Link a newly created poll to customer session
// Location: netlify/functions/vg-link-poll.ts
// Called after poll creation to associate poll with user's account
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    dashboardToken: string;
    polls: {
        id: string;
        adminKey: string;
        title: string;
        type: string;
        status: 'draft' | 'live';
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt?: string;
}

// Tiers that require activation (draft mode)
const ACTIVATION_TIERS = ['pro', 'pro'];

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
        console.error('vg-link-poll: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
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
            title, 
            type,
            dashboardToken,
            tier 
        } = JSON.parse(event.body || '{}');

        if (!pollId || !adminKey || !dashboardToken) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID, admin key, and dashboard token required' }),
            };
        }

        console.log('vg-link-poll: Linking poll:', pollId);
        console.log('vg-link-poll: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const customerStore = getStore({
            name: 'customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // Find customer by dashboard token
        const customerList = await customerStore.list();
        let customer: CustomerRecord | null = null;
        let customerKey: string | null = null;

        for (const { key } of customerList.blobs) {
            const c = await customerStore.get(key, { type: 'json' }) as CustomerRecord;
            if (c?.dashboardToken === dashboardToken) {
                customer = c;
                customerKey = key;
                break;
            }
        }

        if (!customer || !customerKey) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Customer not found' }),
            };
        }

        // Check if poll already linked
        if (customer.polls.some(p => p.id === pollId)) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Poll already linked',
                    alreadyLinked: true,
                }),
            };
        }

        // Determine initial status
        const customerTier = tier || customer.tier;
        const requiresActivation = ACTIVATION_TIERS.includes(customerTier);
        const initialStatus: 'draft' | 'live' = requiresActivation ? 'draft' : 'live';

        // Add poll to customer record
        customer.polls.push({
            id: pollId,
            adminKey,
            title: title || 'Untitled Poll',
            type: type || 'standard',
            status: initialStatus,
            createdAt: new Date().toISOString(),
        });

        customer.updatedAt = new Date().toISOString();

        await customerStore.setJSON(customerKey, customer);

        console.log('vg-link-poll: Poll linked successfully:', pollId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Poll linked to account',
                poll: {
                    id: pollId,
                    status: initialStatus,
                    requiresActivation,
                },
            }),
        };
    } catch (error) {
        console.error('vg-link-poll: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to link poll' }),
        };
    }
};
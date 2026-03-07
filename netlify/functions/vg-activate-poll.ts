// ============================================================================
// vg-activate-poll.ts - Activate a draft poll (make it live)
// Location: netlify/functions/vg-activate-poll.ts
// Called when Pro/Pro user clicks "Go Live" on a draft poll
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface Poll {
    id: string;
    adminKey: string;
    question: string;
    options: string[];
    type: string;
    settings: Record<string, any>;
    createdAt: string;
    status?: 'draft' | 'live';
    activatedAt?: string;
    expiresAt?: string;
    tier?: string;
}

interface CustomerRecord {
    email: string;
    tier: string;
    stripeCustomerId?: string;
    dashboardToken: string;
    polls: {
        id: string;
        adminKey: string;
        title: string;
        status: 'draft' | 'live';
        createdAt: string;
        activatedAt?: string;
    }[];
    createdAt: string;
}

// Tier configuration for expiration
const TIER_DAYS: Record<string, number> = {
    free: 30,
    pro: 365,
    business: 365,
};

const TIER_MAX_LIVE: Record<string, number> = {
    free: 3,
    pro: Infinity,
    business: Infinity,
};

export const handler: Handler = async (event) => {
    // CORS headers
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
        console.error('vg-activate-poll: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const { pollId, adminKey, dashboardToken } = JSON.parse(event.body || '{}');

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key required' }),
            };
        }

        console.log('vg-activate-poll: Activating poll:', pollId);
        console.log('vg-activate-poll: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        // Get stores
        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const customerStore = getStore({
            name: 'customers',
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

        // Verify admin key
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' }),
            };
        }

        // Check if already live
        if (pollData.status === 'live') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll is already live' }),
            };
        }

        // If dashboard token provided, verify customer and check limits
        if (dashboardToken) {
            // Find customer by dashboard token
            const customerList = await customerStore.list();
            let customer: CustomerRecord | null = null;
            
            for (const { key } of customerList.blobs) {
                const c = await customerStore.get(key, { type: 'json' }) as CustomerRecord;
                if (c?.dashboardToken === dashboardToken) {
                    customer = c;
                    break;
                }
            }

            if (customer) {
                const tier = customer.tier;
                const maxLive = TIER_MAX_LIVE[tier] || 1;
                const currentLive = customer.polls.filter(p => p.status === 'live').length;

                if (currentLive >= maxLive) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            error: `You've reached your limit of ${maxLive} live poll${maxLive > 1 ? 's' : ''}. Upgrade for more!`,
                            limitReached: true,
                        }),
                    };
                }

                // Update customer record
                const pollIndex = customer.polls.findIndex(p => p.id === pollId);
                if (pollIndex !== -1) {
                    customer.polls[pollIndex].status = 'live';
                    customer.polls[pollIndex].activatedAt = new Date().toISOString();
                    await customerStore.setJSON(customer.email.toLowerCase(), customer);
                }
            }
        }

        // Calculate expiration date based on tier
        const tier = pollData.tier || 'pro';
        const days = TIER_DAYS[tier] || 30;
        const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

        // Update poll to live status
        const updatedPoll: Poll = {
            ...pollData,
            status: 'live',
            activatedAt: new Date().toISOString(),
            expiresAt,
        };

        await pollStore.setJSON(pollId, updatedPoll);

        console.log('vg-activate-poll: Poll activated successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Poll is now live!',
                poll: {
                    id: pollId,
                    status: 'live',
                    activatedAt: updatedPoll.activatedAt,
                    expiresAt: updatedPoll.expiresAt,
                },
            }),
        };
    } catch (error) {
        console.error('vg-activate-poll: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to activate poll' }),
        };
    }
};
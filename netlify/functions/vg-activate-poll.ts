// ============================================================================
// vg-activate-poll.ts - Activate a draft poll (make it live)
// Location: netlify/functions/vg-activate-poll.ts
// Called when Starter/Pro user clicks "Go Live" on a draft poll
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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
    starter: 30,
    pro_event: 60,
    unlimited: 365,
};

const TIER_MAX_LIVE: Record<string, number> = {
    starter: 1,
    pro_event: 3,
    unlimited: Infinity,
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

    try {
        const { pollId, adminKey, dashboardToken } = JSON.parse(event.body || '{}');

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key required' }),
            };
        }

        // Get stores
        const pollStore = getStore('polls');
        const customerStore = getStore('customers');

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
        console.error('Activate poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to activate poll' }),
        };
    }
};
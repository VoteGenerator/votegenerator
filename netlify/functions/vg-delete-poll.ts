// ============================================================================
// vg-delete-poll.ts - Delete a poll with tier-based restrictions
// Location: netlify/functions/vg-delete-poll.ts
// 
// Restrictions:
// - free/starter: Can only delete if poll has 0 responses (prevents gaming)
// - pro_event+: Can delete anytime
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Tiers that can only delete polls with 0 responses
const RESTRICTED_TIERS = ['free', 'starter'];

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'DELETE' && event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, dashboardToken } = body;

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' }),
            };
        }

        if (!adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Admin key is required' }),
            };
        }

        const siteId = process.env.VG_SITE_ID;
        if (!siteId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' }),
            };
        }

        // Get poll store
        const pollStore = getStore({
            name: 'vg-polls',
            siteID: siteId,
            token: process.env.NETLIFY_AUTH_TOKEN || '',
        });

        // Fetch the poll
        const pollData = await pollStore.get(pollId, { type: 'json' }) as any;

        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' }),
            };
        }

        // Verify admin access
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' }),
            };
        }

        const pollTier = pollData.tier || 'free';
        const voteCount = pollData.voteCount || 0;

        // ====================================================================
        // TIER-BASED DELETE RESTRICTIONS
        // ====================================================================
        if (RESTRICTED_TIERS.includes(pollTier)) {
            if (voteCount > 0) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ 
                        error: `Polls with responses cannot be deleted on the ${pollTier === 'free' ? 'Free' : 'Starter'} plan. Upgrade to Pro Event or higher to delete polls with responses.`,
                        voteCount,
                        tier: pollTier,
                        upgradeRequired: true
                    }),
                };
            }
        }
        // ====================================================================

        // Delete the poll
        await pollStore.delete(pollId);
        console.log(`Poll deleted: ${pollId} (tier: ${pollTier}, votes: ${voteCount})`);

        // If poll had a custom slug, delete the slug mapping
        if (pollData.customSlug) {
            const slugStore = getStore({
                name: 'vg-slugs',
                siteID: siteId,
                token: process.env.NETLIFY_AUTH_TOKEN || '',
            });
            await slugStore.delete(pollData.customSlug);
            console.log(`Custom slug deleted: ${pollData.customSlug}`);
        }

        // Update customer record to remove this poll
        if (dashboardToken) {
            const customerStore = getStore({
                name: 'vg-customers',
                siteID: siteId,
                token: process.env.NETLIFY_AUTH_TOKEN || '',
            });

            const customerData = await customerStore.get(`token_${dashboardToken}`, { type: 'json' }) as any;
            
            if (customerData && customerData.polls) {
                // Remove poll from customer's list
                customerData.polls = customerData.polls.filter((p: string) => p !== pollId);
                customerData.updatedAt = new Date().toISOString();
                
                // Save updated customer
                await customerStore.setJSON(`token_${dashboardToken}`, customerData);
                
                // Also update by email if exists
                if (customerData.email) {
                    await customerStore.setJSON(customerData.email, customerData);
                }
                
                console.log(`Customer record updated, poll removed: ${pollId}`);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Poll deleted successfully',
                pollId
            }),
        };

    } catch (error) {
        console.error('Delete poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
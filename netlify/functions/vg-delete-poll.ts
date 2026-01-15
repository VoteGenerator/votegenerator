// ============================================================================
// vg-delete-poll.ts - Delete a poll from Netlify Blobs
// Location: netlify/functions/vg-delete-poll.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface DeletePollPayload {
    pollId: string;
    adminKey: string;
    dashboardToken?: string;
}

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

    // Accept both DELETE and POST
    if (event.httpMethod !== 'DELETE' && event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const payload: DeletePollPayload = JSON.parse(event.body || '{}');
        const { pollId, adminKey, dashboardToken } = payload;

        // Validate
        if (!pollId || !adminKey) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Missing required fields: pollId and adminKey' }) 
            };
        }

        const siteID = process.env.VG_SITE_ID || '';
        const token = process.env.NETLIFY_AUTH_TOKEN || '';

        // Get poll from store
        const pollStore = getStore({ name: 'polls', siteID, token });

        const poll = await pollStore.get(pollId, { type: 'json' }) as any;
        
        if (!poll) {
            return { 
                statusCode: 404, 
                headers, 
                body: JSON.stringify({ error: 'Poll not found' }) 
            };
        }

        if (poll.adminKey !== adminKey) {
            return { 
                statusCode: 403, 
                headers, 
                body: JSON.stringify({ error: 'Invalid admin key - unauthorized to delete this poll' }) 
            };
        }

        // Delete the poll from polls store
        await pollStore.delete(pollId);
        console.log(`Poll ${pollId} deleted from polls store`);

        // ALSO remove from customer record if dashboardToken provided
        if (dashboardToken && dashboardToken !== 'free_user') {
            try {
                const customerStore = getStore({ name: 'customers', siteID, token });
                const customer = await customerStore.get(dashboardToken, { type: 'json' }) as any;
                
                if (customer && customer.polls) {
                    // Remove poll from customer's polls array
                    customer.polls = customer.polls.filter((p: any) => p.id !== pollId);
                    await customerStore.setJSON(dashboardToken, customer);
                    console.log(`Poll ${pollId} removed from customer ${dashboardToken} record`);
                }
            } catch (customerErr) {
                // Log but don't fail - poll is already deleted
                console.error('Failed to update customer record:', customerErr);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                message: 'Poll deleted successfully'
            })
        };

    } catch (error) {
        console.error('Delete poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
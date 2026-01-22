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

        const pollStore = getStore({ name: 'polls', siteID, token });
        let pollDeleted = false;
        let customerUpdated = false;

        // Try to get and delete from polls store
        try {
            const poll = await pollStore.get(pollId, { type: 'json' }) as any;
            
            if (poll) {
                // Verify admin key
                if (poll.adminKey !== adminKey) {
                    return { 
                        statusCode: 403, 
                        headers, 
                        body: JSON.stringify({ error: 'Invalid admin key - unauthorized to delete this poll' }) 
                    };
                }

                // Delete from polls store
                await pollStore.delete(pollId);
                pollDeleted = true;
                console.log(`Poll ${pollId} deleted from polls store`);
            } else {
                console.log(`Poll ${pollId} not found in polls store - may have been deleted already`);
            }
        } catch (pollErr) {
            console.log(`Error accessing poll ${pollId}:`, pollErr);
        }

        // ALWAYS try to clean up customer record if dashboardToken provided
        if (dashboardToken && dashboardToken !== 'free_user') {
            try {
                const customerStore = getStore({ name: 'vg-customers', siteID, token });
                const customer = await customerStore.get(`token_${dashboardToken}`, { type: 'json' }) as any;
                
                if (customer && customer.polls) {
                    const originalLength = customer.polls.length;
                    // Remove poll from customer's polls array
                    customer.polls = customer.polls.filter((p: any) => p.id !== pollId);
                    
                    if (customer.polls.length < originalLength) {
                        await customerStore.setJSON(`token_${dashboardToken}`, customer);
                        customerUpdated = true;
                        console.log(`Poll ${pollId} removed from customer ${dashboardToken} record`);
                    }
                }
            } catch (customerErr) {
                console.error('Failed to update customer record:', customerErr);
            }
        }

        // Return success regardless - allow frontend to clean up
        // Even if nothing was deleted, we want the UI to update
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pollId,
                pollDeleted,
                customerUpdated,
                message: pollDeleted || customerUpdated ? 'Poll deleted successfully' : 'Poll already deleted or not found'
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
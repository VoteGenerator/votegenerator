// ============================================================================
// vg-update-settings.ts - Update poll settings
// Location: netlify/functions/vg-update-settings.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface PollSettings {
    hideResults?: boolean;
    allowMultiple?: boolean;
    requireNames?: boolean;
    security?: string;
    allowComments?: boolean;
    publicComments?: boolean;
    deadline?: string;
    unlisted?: boolean;
    maxVotes?: number;
    timezone?: string;
    blockVpn?: boolean;
    dotBudget?: number;
    budgetLimit?: number;
    anonymousMode?: boolean;
    publicResults?: boolean;
    allowedViews?: string[];
    showShareButton?: boolean;
    shareKey?: string;
}

interface Poll {
    id: string;
    adminKey: string;
    settings: PollSettings;
    [key: string]: any;
}

const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, settings } = body;

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        if (!settings || typeof settings !== 'object') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Settings object is required' })
            };
        }

        // Get poll from store
        const pollStore = getStore({ name: 'polls', consistency: 'strong' });
        const pollData = await pollStore.get(pollId, { type: 'json' }) as Poll | null;

        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Verify admin key
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        // Merge new settings with existing settings
        const updatedSettings: PollSettings = {
            ...pollData.settings,
            ...settings
        };

        // Update poll with new settings
        const updatedPoll: Poll = {
            ...pollData,
            settings: updatedSettings,
            updatedAt: new Date().toISOString()
        };

        // Save to store
        await pollStore.setJSON(pollId, updatedPoll);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                settings: updatedSettings,
                message: 'Settings updated successfully'
            })
        };

    } catch (error) {
        console.error('Error updating settings:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update settings' })
        };
    }
};

export { handler };
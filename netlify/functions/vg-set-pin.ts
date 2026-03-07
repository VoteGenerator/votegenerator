// ============================================================================
// vg-set-pin.ts - Set/Verify/Remove Admin PIN
// Location: netlify/functions/vg-set-pin.ts
// Handles PIN operations for Unlimited users
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-pin-set: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
    }

    try {
        const { pollId, adminKey, pin, remove, verify } = JSON.parse(event.body || '{}');

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        console.log('vg-pin-set: Operation for poll:', pollId);
        console.log('vg-pin-set: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        // Verify this is the master admin
        let poll: any = null;
        try {
            poll = await pollStore.get(pollId, { type: 'json' });
        } catch (e) {
            // Poll not found
        }

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
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        // Check if user has Unlimited tier
        if (poll.tier !== 'unlimited' && poll.tier !== 'business') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'PIN protection requires Unlimited/Business plan' })
            };
        }

        // Ensure settings object exists
        if (!poll.settings) {
            poll.settings = {};
        }

        // VERIFY PIN (for accessing protected admin)
        if (verify) {
            if (!poll.settings.adminPinHash) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ valid: true, message: 'No PIN set' })
                };
            }

            const inputHash = hashPin(pin, poll.settings.adminPinSalt);
            const isValid = inputHash === poll.settings.adminPinHash;

            return {
                statusCode: isValid ? 200 : 401,
                headers,
                body: JSON.stringify({
                    valid: isValid,
                    message: isValid ? 'PIN verified' : 'Incorrect PIN'
                })
            };
        }

        // REMOVE PIN
        if (remove) {
            poll.settings.adminPinHash = null;
            poll.settings.adminPinSalt = null;
            await pollStore.setJSON(pollId, poll);

            console.log('vg-pin-set: PIN removed for poll:', pollId);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'PIN removed' })
            };
        }

        // SET PIN
        if (!pin || typeof pin !== 'string' || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'PIN must be exactly 6 digits' })
            };
        }

        // Generate salt and hash
        const salt = crypto.randomBytes(16).toString('hex');
        const pinHash = hashPin(pin, salt);

        poll.settings.adminPinHash = pinHash;
        poll.settings.adminPinSalt = salt;
        await pollStore.setJSON(pollId, poll);

        console.log('vg-pin-set: PIN set successfully for poll:', pollId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'PIN set successfully' })
        };
    } catch (error) {
        console.error('vg-pin-set: Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

// ============================================================================
// Helper Functions
// ============================================================================
function hashPin(pin: string, salt: string): string {
    return crypto
        .createHmac('sha256', salt)
        .update(pin)
        .digest('hex');
}
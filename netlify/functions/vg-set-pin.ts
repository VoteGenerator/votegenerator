// ============================================================================
// vg-set-pin.ts - Set/Verify/Remove Admin PIN
// Location: netlify/functions/vg-set-pin.ts
// Handles PIN operations for Unlimited users
// ============================================================================

import { Handler } from '@netlify/functions';
import crypto from 'crypto';

// Your database imports
// import { db } from '../lib/database';

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

    try {
        const { pollId, adminKey, pin, remove, verify } = JSON.parse(event.body || '{}');

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        // Verify this is the master admin
        const poll = await getPoll(pollId);

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
        if (poll.tier !== 'unlimited') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'PIN protection requires Unlimited plan' })
            };
        }

        // VERIFY PIN (for accessing protected admin)
        if (verify) {
            if (!poll.settings?.adminPinHash) {
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
            await updatePollSettings(pollId, {
                adminPinHash: null,
                adminPinSalt: null
            });

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

        await updatePollSettings(pollId, {
            adminPinHash: pinHash,
            adminPinSalt: salt
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'PIN set successfully' })
        };

    } catch (error) {
        console.error('PIN operation error:', error);
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

// Replace with your actual database implementation
async function getPoll(pollId: string): Promise<any> {
    // Example:
    // return await db.polls.findOne({ id: pollId });
    return null;
}

async function updatePollSettings(pollId: string, settings: Record<string, any>): Promise<void> {
    // Example:
    // await db.polls.updateOne(
    //     { id: pollId },
    //     { $set: { settings: { ...existingSettings, ...settings } } }
    // );
}
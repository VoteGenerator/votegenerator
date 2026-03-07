// ============================================================================
// vg-unsubscribe.ts - Handle email unsubscribe requests
// Location: netlify/functions/vg-unsubscribe.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

const SITE_URL = process.env.URL || 'https://votegenerator.com';

// Generate unsubscribe token (used in email links)
export function generateUnsubscribeToken(pollId: string, email: string): string {
    // Simple base64 encoding - not meant to be secure, just obfuscated
    const data = JSON.stringify({ pollId, email: email.toLowerCase(), ts: Date.now() });
    return Buffer.from(data).toString('base64url');
}

// Decode unsubscribe token
function decodeUnsubscribeToken(token: string): { pollId: string; email: string } | null {
    try {
        const data = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
        if (data.pollId && data.email) {
            return { pollId: data.pollId, email: data.email.toLowerCase() };
        }
        return null;
    } catch {
        return null;
    }
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'text/html',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-unsubscribe: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return {
            statusCode: 302,
            headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=error` },
            body: ''
        };
    }

    // GET request with token parameter
    const token = event.queryStringParameters?.token;
    
    if (!token) {
        return {
            statusCode: 302,
            headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=invalid` },
            body: ''
        };
    }

    // Decode token
    const decoded = decodeUnsubscribeToken(token);
    
    if (!decoded) {
        return {
            statusCode: 302,
            headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=invalid` },
            body: ''
        };
    }

    const { pollId, email } = decoded;

    console.log('vg-unsubscribe: Processing unsubscribe for poll:', pollId);
    console.log('vg-unsubscribe: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

    try {
        // Get poll
        const pollStore = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const poll = await pollStore.get(pollId, { type: 'json' }) as any;

        if (!poll) {
            console.log('vg-unsubscribe: Poll not found:', pollId);
            return {
                statusCode: 302,
                headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=not-found` },
                body: ''
            };
        }

        // Check if email exists in notification settings
        if (!poll.notificationSettings?.emails?.length) {
            console.log('vg-unsubscribe: No notification emails for poll:', pollId);
            return {
                statusCode: 302,
                headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=not-found` },
                body: ''
            };
        }

        const emailIndex = poll.notificationSettings.emails.findIndex(
            (e: any) => e.email.toLowerCase() === email.toLowerCase()
        );

        if (emailIndex === -1) {
            console.log('vg-unsubscribe: Email not found in poll:', email);
            return {
                statusCode: 302,
                headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=not-found` },
                body: ''
            };
        }

        // Remove email from notification list
        poll.notificationSettings.emails.splice(emailIndex, 1);

        // Save updated poll
        await pollStore.setJSON(pollId, poll);

        console.log('vg-unsubscribe: Successfully unsubscribed:', email, 'from poll:', pollId);

        // Redirect to success page
        return {
            statusCode: 302,
            headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=success` },
            body: ''
        };
    } catch (error) {
        console.error('vg-unsubscribe: Error:', error);
        return {
            statusCode: 302,
            headers: { 'Location': `${SITE_URL}/unsubscribe-result?status=error` },
            body: ''
        };
    }
};
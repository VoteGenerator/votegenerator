// ============================================================================
// vg-get.ts - Get a poll/survey by ID
// Location: netlify/functions/vg-get.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const pollId = event.queryStringParameters?.id;
        const adminKey = event.queryStringParameters?.admin;

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });

        const poll = await store.get(pollId, { type: 'json' }) as any;

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check if poll has expired
        if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
            return {
                statusCode: 410,
                headers,
                body: JSON.stringify({ error: 'This poll has expired' })
            };
        }

        // Check if poll is in draft mode (only admin can view)
        if (poll.status === 'draft' && poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'This poll is not yet published' })
            };
        }

        // If admin key provided, verify it
        const isAdmin = adminKey && poll.adminKey === adminKey;

        // Prepare response - hide sensitive data for non-admins
        const response: any = {
            id: poll.id,
            title: poll.title || poll.question,
            question: poll.question || poll.title,
            description: poll.description,
            options: poll.options,
            pollType: poll.pollType,
            settings: {
                allowMultiple: poll.settings?.allowMultiple || false,
                hideResults: poll.settings?.hideResults || false,
                requireNames: poll.settings?.requireNames || false,
                security: poll.settings?.security || 'none',
                allowComments: poll.settings?.allowComments || false,
                anonymousMode: poll.settings?.anonymousMode || false,
            },
            voteCount: poll.voteCount || 0,
            responseCount: poll.responseCount || poll.voteCount || 0,
            status: poll.status || 'live',
            createdAt: poll.createdAt,
            expiresAt: poll.expiresAt,
            theme: poll.theme,
            logoUrl: poll.logoUrl,
            buttonText: poll.buttonText,
            // Survey fields
            isSurvey: poll.isSurvey || poll.pollType === 'survey',
            sections: poll.sections,
            surveySettings: poll.surveySettings,
            // Image poll fields
            imageUrls: poll.imageUrls,
            // Rating poll fields
            ratingStyle: poll.ratingStyle,
        };

        // Add admin-only fields
        if (isAdmin) {
            response.adminKey = poll.adminKey;
            response.votes = poll.votes || [];
            response.tier = poll.tier;
            response.maxResponses = poll.maxResponses;
            response.pin = poll.pin;
            response.allowedCodes = poll.allowedCodes;
            response.usedCodes = poll.usedCodes;
            response.notificationSettings = poll.notificationSettings;
            response.customSlug = poll.customSlug;
        } else {
            // For non-admins, only include votes if results aren't hidden
            if (!poll.settings?.hideResults) {
                response.votes = poll.votes || [];
            }
            
            // Check if PIN required
            if (poll.settings?.security === 'pin' && poll.pin) {
                response.requiresPin = true;
            }
            
            // Check if code required
            if (poll.settings?.security === 'code' && poll.allowedCodes?.length > 0) {
                response.requiresCode = true;
            }
        }

        console.log(`Poll ${pollId} fetched${isAdmin ? ' (admin)' : ''}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Get poll error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
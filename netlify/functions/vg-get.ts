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
                body: JSON.stringify({ 
                    error: 'Poll not found',
                    code: 'NOT_FOUND',
                    message: 'This poll doesn\'t exist. It may have been deleted by the creator.',
                    suggestions: [
                        'Check that the URL is correct',
                        'The poll may have been deleted',
                        'Ask the poll creator for the correct link'
                    ]
                })
            };
        }

        // Check if poll was explicitly deleted
        if (poll.status === 'deleted') {
            return {
                statusCode: 410,
                headers,
                body: JSON.stringify({ 
                    error: 'Poll deleted',
                    code: 'DELETED',
                    message: 'This poll has been deleted by its creator.',
                    deletedAt: poll.deletedAt || null
                })
            };
        }

        // Check if poll has expired
        if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
            return {
                statusCode: 410,
                headers,
                body: JSON.stringify({ 
                    error: 'Poll expired',
                    code: 'EXPIRED',
                    message: 'This poll has expired and is no longer accepting responses.',
                    expiredAt: poll.expiresAt,
                    title: poll.title // Include title so user knows they found the right poll
                })
            };
        }

        // Check if poll is in draft mode (only admin can view)
        if (poll.status === 'draft' && poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Poll not published',
                    code: 'DRAFT',
                    message: 'This poll is still being set up by the creator. Check back soon!'
                })
            };
        }

        // Check if poll is closed
        if (poll.status === 'closed') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...poll,
                    isClosed: true,
                    code: 'CLOSED',
                    message: 'This poll has been closed by the creator and is no longer accepting responses.'
                })
            };
        }

        // Check if poll is paused
        if (poll.status === 'paused') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...poll,
                    isPaused: true,
                    code: 'PAUSED',
                    message: 'This poll is temporarily paused. Check back later!'
                })
            };
        }

        // Debug logging for surveys
        if (poll.isSurvey || poll.pollType === 'survey') {
            console.log('vg-get: Loading survey', pollId);
            console.log('vg-get: poll.sections exists:', !!poll.sections);
            console.log('vg-get: poll.sections length:', poll.sections?.length || 0);
            if (poll.sections?.[0]) {
                console.log('vg-get: First section title:', poll.sections[0].title);
                console.log('vg-get: First section questions:', poll.sections[0].questions?.length || 0);
                if (poll.sections[0].questions?.[0]) {
                    console.log('vg-get: First question ID:', poll.sections[0].questions[0].id);
                    console.log('vg-get: First question type:', poll.sections[0].questions[0].type);
                }
            }
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
            // SECURITY: Strip sensitive data from votes
            if (!poll.settings?.hideResults) {
                response.votes = (poll.votes || []).map((v: any) => ({
                    id: v.id,
                    timestamp: v.timestamp,
                    selectedOptionIds: v.selectedOptionIds,
                    rankedOptionIds: v.rankedOptionIds,
                    surveyAnswers: v.surveyAnswers,
                    // Only include comment if comments are public
                    comment: poll.settings?.publicComments ? v.comment : undefined,
                    // Strip: ipHash, voterName, analytics, usedCode
                }));
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
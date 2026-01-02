import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string; imageUrl?: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: any[];
    createdAt: string;
    voteCount: number;
}

export const handler: Handler = async (event) => {
    console.log('vg-get called:', event.httpMethod);
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const pollId = event.queryStringParameters?.id;
        const adminKey = event.queryStringParameters?.admin;
        
        console.log('Looking for poll:', pollId);

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll from storage with explicit config
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        console.log('Fetching poll from store...');
        const poll: Poll | null = await store.get(pollId, { type: 'json' });
        console.log('Poll found:', !!poll);

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found. It may have expired or the link is incorrect.' })
            };
        }

        const isAdmin = adminKey && adminKey === poll.adminKey;
        console.log('Is admin:', isAdmin);

        if (isAdmin) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...poll,
                    isAdmin: true
                })
            };
        } else {
            const publicPoll = {
                id: poll.id,
                title: poll.title,
                description: poll.description,
                pollType: poll.pollType,
                options: poll.options,
                settings: {
                    hideResults: poll.settings.hideResults,
                    allowMultiple: poll.settings.allowMultiple,
                    requireNames: poll.settings.requireNames,
                    security: poll.settings.security,
                    deadline: poll.settings.deadline || poll.settings.endDate,
                    allowComments: poll.settings.allowComments,
                    timezone: poll.settings.timezone
                },
                createdAt: poll.createdAt,
                voteCount: poll.voteCount,
                isAdmin: false,
                // Visual theming (premium feature)
                theme: poll.theme || 'default',
                logoUrl: poll.logoUrl || null,
                buttonText: poll.buttonText,
                // Rating style
                ratingStyle: poll.ratingStyle,
                // Meeting duration
                meetingDuration: poll.meetingDuration,
                // Survey mode
                isSurvey: poll.isSurvey,
                sections: poll.sections,
                surveySettings: poll.surveySettings,
                // Status
                status: poll.status || 'live'
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(publicPoll)
            };
        }

    } catch (error) {
        console.error('Error in vg-get:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};
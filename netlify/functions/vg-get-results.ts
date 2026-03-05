// ============================================================================
// vg-get-results.ts - Get poll/survey results
// Location: netlify/functions/vg-get-results.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

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

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-get-results: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Server configuration error' }) 
        };
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

        console.log('vg-get-results: Looking for poll:', pollId);
        console.log('vg-get-results: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const store = getStore({
            name: 'polls',
            siteID: SITE_ID,
            token: BLOB_TOKEN
        });

        const poll = await store.get(pollId, { type: 'json' }) as any;

        console.log('vg-get-results: Poll found:', !!poll);

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check if admin key provided and valid
        const isAdmin = adminKey && poll.adminKey === adminKey;

        // If results are hidden and not admin, deny access
        if (poll.settings?.hideResults && !isAdmin) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Results are hidden for this poll' })
            };
        }

        // Build results response
        const votes = poll.votes || [];
        const voteCount = votes.length;
        
        console.log(`vg-get-results: Poll ${pollId} has ${voteCount} votes`);
        console.log(`vg-get-results: isSurvey=${poll.isSurvey}, pollType=${poll.pollType}`);
        console.log(`vg-get-results: isAdmin=${isAdmin}, hideResults=${poll.settings?.hideResults}`);
        
        if (votes[0]) {
            console.log('vg-get-results: First vote has surveyAnswers:', !!votes[0].surveyAnswers);
            console.log('vg-get-results: First vote has ratingVotes:', !!votes[0].ratingVotes);
            console.log('vg-get-results: First vote keys:', Object.keys(votes[0]));
        }

        // For rating polls - calculate average ratings
        let ratingResults: any = null;
        if (poll.pollType === 'rating') {
            const allRatings: Record<string, number[]> = {};
            
            votes.forEach((v: any) => {
                if (v.ratingVotes) {
                    Object.entries(v.ratingVotes).forEach(([optId, rating]) => {
                        if (!allRatings[optId]) allRatings[optId] = [];
                        allRatings[optId].push(rating as number);
                    });
                }
            });
            
            ratingResults = {};
            Object.entries(allRatings).forEach(([optId, ratings]) => {
                const sum = ratings.reduce((a, b) => a + b, 0);
                ratingResults[optId] = {
                    average: ratings.length > 0 ? Math.round((sum / ratings.length) * 10) / 10 : 0,
                    count: ratings.length,
                    distribution: [1, 2, 3, 4, 5].map(star => 
                        ratings.filter(r => r === star).length
                    )
                };
            });
            
            console.log('vg-get-results: Rating results:', JSON.stringify(ratingResults));
        }

        // For regular polls - calculate option tallies
        let optionResults: any[] = [];
        if (poll.options && poll.options.length > 0) {
            optionResults = poll.options.map((opt: any) => {
                const optionVotes = votes.filter((v: any) => 
                    v.selectedOptionIds?.includes(opt.id) ||
                    v.rankedOptionIds?.includes(opt.id)
                );
                
                // For rating polls, include the rating stats
                const ratingStats = ratingResults?.[opt.id];
                
                return {
                    id: opt.id,
                    text: opt.text,
                    imageUrl: opt.imageUrl,
                    votes: optionVotes.length,
                    percentage: voteCount > 0 ? Math.round((optionVotes.length / voteCount) * 100) : 0,
                    // Rating-specific fields
                    averageRating: ratingStats?.average,
                    ratingCount: ratingStats?.count,
                    ratingDistribution: ratingStats?.distribution,
                };
            });
        }

        // For surveys - return all responses
        let surveyResponses: any[] = [];
        if (poll.isSurvey || poll.pollType === 'survey') {
            surveyResponses = votes.map((v: any, idx: number) => ({
                id: v.id || `response_${idx}`,
                pollId: poll.id,
                submittedAt: v.timestamp,
                startedAt: v.startedAt,
                completedAt: v.timestamp,
                completionTime: v.completionTime,
                answers: v.surveyAnswers || {},
                voterName: isAdmin ? v.voterName : undefined,
                isComplete: true,
            }));
            
            console.log(`vg-get-results: Mapped ${surveyResponses.length} survey responses`);
            if (surveyResponses[0]) {
                console.log('vg-get-results: First response answers keys:', Object.keys(surveyResponses[0].answers || {}));
            }
        }

        const response: any = {
            pollId: poll.id,
            title: poll.title || poll.question,
            pollType: poll.pollType,
            voteCount,
            responseCount: voteCount,
            options: optionResults,
            ratingResults, // Include rating-specific results
            isSurvey: poll.isSurvey || poll.pollType === 'survey',
            sections: poll.sections,
            surveySettings: poll.surveySettings,
            createdAt: poll.createdAt,
            ratingStyle: poll.ratingStyle, // Include rating style (stars, emojis, etc.)
        };

        // For surveys, ALWAYS include surveyResponses (we already checked access above)
        if (poll.isSurvey || poll.pollType === 'survey') {
            response.surveyResponses = surveyResponses;
            console.log(`vg-get-results: Including ${surveyResponses.length} surveyResponses in response`);
        }

        // Add full data for admin
        if (isAdmin) {
            response.votes = votes;
            response.adminKey = poll.adminKey;
            response.settings = poll.settings;
            response.tier = poll.tier;
            response.maxResponses = poll.maxResponses;
        }

        console.log(`vg-get-results: Results fetched for poll ${pollId}${isAdmin ? ' (admin)' : ''} - ${voteCount} votes`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error('Get results error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
// ============================================================================
// vg-get-public-results.ts - Get publicly shared poll results
// Location: netlify/functions/vg-get-public-results.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface Poll {
    id: string;
    title: string;
    description?: string;
    options: Array<{ id: string; text: string; imageUrl?: string }>;
    type: string;
    theme?: string;
    settings?: {
        publicResults?: boolean;
        shareKey?: string;
        allowedViews?: string[]; // ['bar', 'pie', 'velocity'] - which views are public
        hideVoteCount?: boolean;
    };
    createdAt: string;
    status: string;
}

interface Vote {
    id: string;
    choices?: string[];
    selectedOptionIds?: string[];
    rankedOptionIds?: string[];
    votedAt: string;
    analytics?: {
        country?: string;
        device?: string;
    };
}

interface Results {
    votes: Vote[];
    simpleCounts?: Record<string, number>;
    winnerId?: string;
}

const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        const { pollId, shareKey } = event.queryStringParameters || {};

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        console.log('Fetching public results for pollId:', pollId);

        // Get poll from store
        const pollStore = getStore({ 
            name: 'polls', 
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        const pollData = await pollStore.get(pollId, { type: 'json' }) as Poll | null;

        console.log('Poll data found:', pollData ? 'yes' : 'no');

        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found', pollId })
            };
        }

        // Check if results are public
        const settings = pollData.settings || {};
        console.log('Poll settings:', JSON.stringify(settings));
        console.log('publicResults value:', settings.publicResults);
        
        if (!settings.publicResults) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Results are not publicly shared',
                    hint: 'Enable "Public Results Page" in poll settings'
                })
            };
        }

        // If share key is required, validate it
        if (settings.shareKey && settings.shareKey !== shareKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid share key' })
            };
        }

        // Votes are stored directly in the poll object
        const votes = (pollData as any).votes || [];
        console.log('Found votes:', votes.length);
        
        // Debug survey data - use same detection as vg-vote
        const isSurvey = (pollData as any).isSurvey || pollData.type === 'survey' || (pollData as any).pollType === 'survey' || (pollData as any).sections?.length > 0;
        if (isSurvey) {
            console.log('Survey detected');
            console.log('pollData.isSurvey:', (pollData as any).isSurvey);
            console.log('pollData.type:', pollData.type);
            console.log('pollData.pollType:', (pollData as any).pollType);
            console.log('surveyResponses array:', (pollData as any).surveyResponses?.length || 0);
            console.log('sections:', (pollData as any).sections?.length || 0);
            if (votes.length > 0) {
                console.log('First vote has surveyAnswers:', !!votes[0].surveyAnswers);
                console.log('First vote has answers:', !!votes[0].answers);
                console.log('First vote keys:', Object.keys(votes[0]));
                if (votes[0].surveyAnswers) {
                    console.log('First vote surveyAnswers keys:', Object.keys(votes[0].surveyAnswers));
                }
            }
        }

        // Prepare public poll data (strip sensitive info)
        const publicPoll = {
            id: pollData.id,
            title: pollData.title,
            description: pollData.description,
            options: pollData.options?.map(o => ({
                id: o.id,
                text: o.text,
                imageUrl: o.imageUrl
            })) || [],
            type: pollData.type,
            pollType: (pollData as any).pollType,
            isSurvey: (pollData as any).isSurvey,
            theme: pollData.theme,
            createdAt: pollData.createdAt,
            allowedViews: settings.allowedViews || ['bar', 'pie'],
            showSocialShare: settings.showSocialShare !== false, // Default true
            // Include survey sections if it's a survey
            sections: (pollData as any).sections?.map((s: any) => ({
                id: s.id,
                title: s.title,
                questions: s.questions?.map((q: any) => ({
                    id: q.id,
                    type: q.type,
                    text: q.text,
                    options: q.options,
                    maxRating: q.maxRating,
                    max: q.max,
                    min: q.min,
                    minScale: q.minScale,
                    maxScale: q.maxScale,
                    minLabel: q.minLabel,
                    maxLabel: q.maxLabel,
                    rows: q.rows,
                    columns: q.columns
                }))
            })),
            // Include tier for ad wall decision
            tier: (pollData as any).tier || 'free'
        };

        // Prepare public votes (strip sensitive data like IPs)
        const publicVotes = votes.map((v: any) => ({
            id: v.id,
            choices: v.choices || v.selectedOptionIds || v.rankedOptionIds || [],
            votedAt: v.votedAt,
            // Include surveyAnswers for survey types
            surveyAnswers: v.surveyAnswers,
            answers: v.answers,
            // Only include basic analytics, no IP
            analytics: v.analytics ? {
                country: v.analytics.country,
                device: v.analytics.device
            } : undefined
        }));

        // Calculate simple counts
        const simpleCounts: Record<string, number> = {};
        publicPoll.options.forEach(o => simpleCounts[o.id] = 0);
        
        votes.forEach((vote: any) => {
            const choices = vote.choices || vote.selectedOptionIds || [];
            choices.forEach((id: string) => {
                if (simpleCounts[id] !== undefined) {
                    simpleCounts[id]++;
                }
            });
        });

        console.log('Simple counts:', simpleCounts);

        // Determine winner
        let winnerId: string | undefined;
        let maxVotes = 0;
        Object.entries(simpleCounts).forEach(([id, count]) => {
            if (count > maxVotes) {
                maxVotes = count;
                winnerId = id;
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                poll: publicPoll,
                results: {
                    votes: publicVotes,
                    simpleCounts,
                    winnerId,
                    totalVotes: votes.length,
                    // Include survey responses for survey types
                    // Check ALL possible locations for survey answers
                    surveyResponses: (() => {
                        const isSurveyType = (pollData as any).isSurvey || pollData.type === 'survey' || (pollData as any).pollType === 'survey' || (pollData as any).sections?.length > 0;
                        
                        if (!isSurveyType) {
                            return [];
                        }
                        
                        console.log('=== Building surveyResponses ===');
                        console.log('Total votes to check:', votes.length);
                        
                        const surveyResponses: any[] = [];
                        
                        // Check each vote for survey answers
                        for (const vote of votes) {
                            const voteKeys = Object.keys(vote);
                            console.log(`Vote ${vote.id} keys:`, voteKeys);
                            
                            let answers: Record<string, any> = {};
                            
                            // Method 1: vote.surveyAnswers
                            if (vote.surveyAnswers && typeof vote.surveyAnswers === 'object') {
                                answers = vote.surveyAnswers;
                                console.log('Found surveyAnswers:', Object.keys(answers));
                            }
                            // Method 2: vote.answers
                            else if (vote.answers && typeof vote.answers === 'object') {
                                answers = vote.answers;
                                console.log('Found answers:', Object.keys(answers));
                            }
                            // Method 3: Look for q_ prefixed keys directly on vote
                            else {
                                for (const key of voteKeys) {
                                    if (key.startsWith('q_') || key.match(/^[a-f0-9]{8,}/i)) {
                                        answers[key] = vote[key];
                                    }
                                }
                                if (Object.keys(answers).length > 0) {
                                    console.log('Found answers in vote root:', Object.keys(answers));
                                }
                            }
                            
                            // If we found any answers, add to surveyResponses
                            if (Object.keys(answers).length > 0) {
                                surveyResponses.push({
                                    id: vote.id,
                                    answers: answers,
                                    submittedAt: vote.votedAt || vote.timestamp || vote.createdAt
                                });
                            }
                        }
                        
                        // Also check dedicated surveyResponses array on pollData
                        const dedicated = (pollData as any).surveyResponses || [];
                        if (dedicated.length > 0) {
                            console.log('Found dedicated surveyResponses array:', dedicated.length);
                            for (const r of dedicated) {
                                const ans = r.answers || r.surveyAnswers || {};
                                if (Object.keys(ans).length > 0 && !surveyResponses.find(sr => sr.id === r.id)) {
                                    surveyResponses.push({
                                        id: r.id,
                                        answers: ans,
                                        submittedAt: r.submittedAt
                                    });
                                }
                            }
                        }
                        
                        console.log('Final surveyResponses count:', surveyResponses.length);
                        if (surveyResponses[0]) {
                            console.log('First response answer keys:', Object.keys(surveyResponses[0].answers));
                        }
                        console.log('=== End surveyResponses build ===');
                        
                        return surveyResponses;
                    })()
                }
            })
        };

    } catch (error) {
        console.error('Error fetching public results:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch results' })
        };
    }
};

export { handler };
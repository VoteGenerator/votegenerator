// ============================================================================
// vg-get-public-results.ts - Get publicly shared poll results
// Location: netlify/functions/vg-get-public-results.ts
// FIXED: Proper data extraction for all poll types
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

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
        allowedViews?: string[];
        hideVoteCount?: boolean;
        showSocialShare?: boolean;
    };
    createdAt: string;
    status: string;
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
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-get-public-results: Missing Blobs credentials');
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    try {
        const { pollId, shareKey } = event.queryStringParameters || {};

        if (!pollId) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Poll ID is required' }) };
        }

        console.log('vg-get-public-results: Fetching pollId:', pollId);

        const pollStore = getStore({ name: 'polls', siteID: SITE_ID, token: BLOB_TOKEN });
        const pollData = await pollStore.get(pollId, { type: 'json' }) as any;

        if (!pollData) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Poll not found', pollId }) };
        }

        const settings = pollData.settings || {};
        
        if (!settings.publicResults) {
            return { 
                statusCode: 403, 
                headers, 
                body: JSON.stringify({ error: 'Results are not publicly shared', hint: 'Enable "Public Results Page" in poll settings' }) 
            };
        }

        if (settings.shareKey && settings.shareKey !== shareKey) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid share key' }) };
        }

        const votes = pollData.votes || [];
        const pollType = pollData.pollType || pollData.type || 'multiple-choice';
        const options = pollData.options || [];
        const maxRating = pollData.maxRating || pollData.ratingMax || 5;
        
        console.log('vg-get-public-results: pollType:', pollType, 'votes:', votes.length);

        // =====================================================================
        // INITIALIZE RESULTS OBJECT
        // =====================================================================
        const results: any = {
            totalVotes: votes.length,
            simpleCounts: {},
            votes: [],
        };

        // Initialize simple counts
        options.forEach((o: any) => results.simpleCounts[o.id] = 0);

        // =====================================================================
        // RATING POLL - Calculate averages and distribution
        // =====================================================================
        if (pollType === 'rating') {
            const ratingResults: Record<string, any> = {};
            
            options.forEach((opt: any) => {
                ratingResults[opt.id] = {
                    sum: 0,
                    count: 0,
                    average: 0,
                    distribution: {} as Record<number, number>
                };
                // Initialize distribution for each star level
                for (let i = 1; i <= maxRating; i++) {
                    ratingResults[opt.id].distribution[i] = 0;
                }
            });

            votes.forEach((vote: any) => {
                // Rating votes can be in different formats
                const ratings = vote.ratingVotes || vote.ratings || {};
                
                Object.entries(ratings).forEach(([optId, rating]) => {
                    const r = Number(rating);
                    if (ratingResults[optId] && r >= 1 && r <= maxRating) {
                        ratingResults[optId].sum += r;
                        ratingResults[optId].count += 1;
                        ratingResults[optId].distribution[r] = (ratingResults[optId].distribution[r] || 0) + 1;
                    }
                });
            });

            // Calculate averages
            Object.keys(ratingResults).forEach(optId => {
                const data = ratingResults[optId];
                data.average = data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0;
            });

            results.ratingResults = ratingResults;
            results.ratingVotes = votes.map((v: any) => ({
                id: v.id,
                ratings: v.ratingVotes || v.ratings || {},
                votedAt: v.votedAt
            }));
            
            console.log('vg-get-public-results: Rating results:', JSON.stringify(ratingResults));
        }

        // =====================================================================
        // RANKED CHOICE - Calculate average ranks
        // =====================================================================
        else if (pollType === 'ranked' || pollType === 'ranked-choice') {
            const rankScores: Record<string, { totalRank: number; count: number }> = {};
            options.forEach((o: any) => rankScores[o.id] = { totalRank: 0, count: 0 });

            votes.forEach((vote: any) => {
                const rankings = vote.rankedOptionIds || vote.rankings || vote.ranking || [];
                rankings.forEach((optId: string, idx: number) => {
                    if (rankScores[optId]) {
                        rankScores[optId].totalRank += idx + 1; // 1-indexed rank
                        rankScores[optId].count += 1;
                    }
                });
            });

            results.rankedResults = {};
            Object.entries(rankScores).forEach(([optId, data]) => {
                results.rankedResults[optId] = {
                    avgRank: data.count > 0 ? Math.round((data.totalRank / data.count) * 100) / 100 : options.length,
                    count: data.count
                };
            });

            results.rankedVotes = votes.map((v: any) => ({
                id: v.id,
                rankings: v.rankedOptionIds || v.rankings || v.ranking || [],
                votedAt: v.votedAt
            }));
            
            console.log('vg-get-public-results: Ranked results:', JSON.stringify(results.rankedResults));
        }

        // =====================================================================
        // MEETING POLL - Calculate availability
        // =====================================================================
        else if (pollType === 'meeting') {
            const availability: Record<string, { yes: number; maybe: number; no: number }> = {};
            options.forEach((o: any) => availability[o.id] = { yes: 0, maybe: 0, no: 0 });

            votes.forEach((vote: any) => {
                // Meeting votes can have availability per slot
                const responses = vote.availability || vote.meetingResponses || {};
                
                Object.entries(responses).forEach(([slotId, response]) => {
                    if (availability[slotId]) {
                        const r = String(response).toLowerCase();
                        if (r === 'yes' || r === 'available' || r === 'true') {
                            availability[slotId].yes += 1;
                        } else if (r === 'maybe' || r === 'tentative') {
                            availability[slotId].maybe += 1;
                        } else if (r === 'no' || r === 'unavailable' || r === 'false') {
                            availability[slotId].no += 1;
                        }
                    }
                });

                // Also check for simple choices (backward compat)
                const choices = vote.choices || vote.selectedOptionIds || [];
                choices.forEach((slotId: string) => {
                    if (availability[slotId]) {
                        availability[slotId].yes += 1;
                    }
                });
            });

            results.availability = availability;
            results.meetingVotes = votes.map((v: any) => ({
                id: v.id,
                name: v.name || v.voterName,
                availability: v.availability || v.meetingResponses || {},
                votedAt: v.votedAt
            }));
            
            console.log('vg-get-public-results: Meeting availability:', JSON.stringify(availability));
        }

        // =====================================================================
        // RSVP POLL - Count responses
        // =====================================================================
        else if (pollType === 'rsvp') {
            const rsvpCounts = { yes: 0, no: 0, maybe: 0, attending: 0, 'not-attending': 0 };

            votes.forEach((vote: any) => {
                const response = vote.rsvpResponse || vote.response || (vote.choices?.[0]) || '';
                const r = String(response).toLowerCase();
                
                if (r === 'yes' || r === 'attending') {
                    rsvpCounts.yes += 1;
                    rsvpCounts.attending += 1;
                } else if (r === 'no' || r === 'not-attending' || r === 'notattending') {
                    rsvpCounts.no += 1;
                    rsvpCounts['not-attending'] += 1;
                } else if (r === 'maybe' || r === 'tentative') {
                    rsvpCounts.maybe += 1;
                }
            });

            results.rsvpCounts = rsvpCounts;
            results.rsvpVotes = votes.map((v: any) => ({
                id: v.id,
                name: v.name || v.voterName,
                response: v.rsvpResponse || v.response || (v.choices?.[0]),
                plusOnes: v.plusOnes || 0,
                votedAt: v.votedAt
            }));
            
            console.log('vg-get-public-results: RSVP counts:', JSON.stringify(rsvpCounts));
        }

        // =====================================================================
        // THIS-OR-THAT / PAIRWISE - Count wins
        // =====================================================================
        else if (pollType === 'pairwise' || pollType === 'this-or-that' || pollType === 'thisOrThat') {
            votes.forEach((vote: any) => {
                const choices = vote.choices || vote.selectedOptionIds || vote.winners || [];
                choices.forEach((optId: string) => {
                    if (results.simpleCounts[optId] !== undefined) {
                        results.simpleCounts[optId] += 1;
                    }
                });
            });

            results.pairwiseResults = { ...results.simpleCounts };
            results.totalComparisons = Object.values(results.simpleCounts as Record<string, number>).reduce((a, b) => a + b, 0);
            
            console.log('vg-get-public-results: Pairwise results:', JSON.stringify(results.pairwiseResults));
        }

        // =====================================================================
        // VISUAL POLL - Same as multiple choice, images are in options
        // =====================================================================
        else if (pollType === 'visual' || pollType === 'image') {
            votes.forEach((vote: any) => {
                const choices = vote.choices || vote.selectedOptionIds || [];
                choices.forEach((optId: string) => {
                    if (results.simpleCounts[optId] !== undefined) {
                        results.simpleCounts[optId] += 1;
                    }
                });
            });
            
            console.log('vg-get-public-results: Visual poll counts:', JSON.stringify(results.simpleCounts));
        }

        // =====================================================================
        // MULTIPLE CHOICE (DEFAULT)
        // =====================================================================
        else {
            votes.forEach((vote: any) => {
                const choices = vote.choices || vote.selectedOptionIds || [];
                choices.forEach((optId: string) => {
                    if (results.simpleCounts[optId] !== undefined) {
                        results.simpleCounts[optId] += 1;
                    }
                });
            });
        }

        // =====================================================================
        // SURVEY RESPONSES (separate handling)
        // =====================================================================
        const isSurvey = pollData.isSurvey || pollData.type === 'survey' || pollData.pollType === 'survey' || pollData.sections?.length > 0;
        
        if (isSurvey) {
            console.log('vg-get-public-results: Processing survey responses');
            const surveyResponses: any[] = [];
            
            for (const vote of votes) {
                let answers: Record<string, any> = {};
                
                if (vote.surveyAnswers && typeof vote.surveyAnswers === 'object') {
                    answers = vote.surveyAnswers;
                } else if (vote.answers && typeof vote.answers === 'object') {
                    answers = vote.answers;
                } else {
                    // Look for q_ prefixed keys
                    Object.keys(vote).forEach(key => {
                        if (key.startsWith('q_') || key.match(/^[a-f0-9]{8,}/i)) {
                            answers[key] = vote[key];
                        }
                    });
                }
                
                if (Object.keys(answers).length > 0) {
                    surveyResponses.push({
                        id: vote.id,
                        answers,
                        submittedAt: vote.votedAt || vote.timestamp
                    });
                }
            }
            
            // Also check dedicated surveyResponses array
            const dedicated = pollData.surveyResponses || [];
            dedicated.forEach((r: any) => {
                const ans = r.answers || r.surveyAnswers || {};
                if (Object.keys(ans).length > 0 && !surveyResponses.find(sr => sr.id === r.id)) {
                    surveyResponses.push({ id: r.id, answers: ans, submittedAt: r.submittedAt });
                }
            });
            
            results.surveyResponses = surveyResponses;
            console.log('vg-get-public-results: Survey responses count:', surveyResponses.length);
        }

        // =====================================================================
        // DETERMINE WINNER (for simple polls)
        // =====================================================================
        let winnerId: string | undefined;
        let maxVotes = 0;
        Object.entries(results.simpleCounts).forEach(([id, count]) => {
            if ((count as number) > maxVotes) {
                maxVotes = count as number;
                winnerId = id;
            }
        });
        results.winnerId = winnerId;

        // =====================================================================
        // PREPARE PUBLIC VOTES (strip sensitive data)
        // =====================================================================
        results.votes = votes.map((v: any) => ({
            id: v.id,
            choices: v.choices || v.selectedOptionIds || v.rankedOptionIds || [],
            votedAt: v.votedAt || v.timestamp,
            ratingVotes: v.ratingVotes || v.ratings,
            rankings: v.rankedOptionIds || v.rankings || v.ranking,
            availability: v.availability || v.meetingResponses,
            rsvpResponse: v.rsvpResponse || v.response,
            surveyAnswers: v.surveyAnswers || v.answers,
            analytics: v.analytics ? { country: v.analytics.country, device: v.analytics.device } : undefined
        }));

        // =====================================================================
        // PREPARE PUBLIC POLL DATA
        // =====================================================================
        const publicPoll = {
            id: pollData.id,
            title: pollData.title,
            description: pollData.description,
            options: options.map((o: any) => ({
                id: o.id,
                text: o.text,
                imageUrl: o.imageUrl,
                date: o.date,
                time: o.time
            })),
            type: pollData.type,
            pollType,
            isSurvey,
            theme: pollData.theme,
            createdAt: pollData.createdAt,
            allowedViews: settings.allowedViews || ['bar', 'pie'],
            showSocialShare: settings.showSocialShare !== false,
            ratingStyle: pollData.ratingStyle || 'stars',
            maxRating,
            ratingMax: maxRating,
            sections: pollData.sections?.map((s: any) => ({
                id: s.id,
                title: s.title,
                questions: s.questions?.map((q: any) => ({
                    id: q.id,
                    key: q.key || q.id,
                    name: q.name,
                    type: q.type,
                    text: q.text || q.question,
                    options: q.options,
                    maxRating: q.maxRating,
                    max: q.max || q.maxValue,
                    min: q.min || q.minValue,
                    minScale: q.minScale,
                    maxScale: q.maxScale,
                    minLabel: q.minLabel,
                    maxLabel: q.maxLabel,
                    rows: q.rows,
                    columns: q.columns
                }))
            })),
            tier: pollData.tier || 'free'
        };

        console.log('vg-get-public-results: Returning results for pollType:', pollType);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ poll: publicPoll, results })
        };

    } catch (error) {
        console.error('Error fetching public results:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to fetch results' }) };
    }
};

export { handler };
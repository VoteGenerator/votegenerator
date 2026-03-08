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

        // Build simpleCounts object for VoteGeneratorResults compatibility
        const simpleCounts: Record<string, number> = {};
        optionResults.forEach((opt: any) => {
            simpleCounts[opt.id] = opt.votes || 0;
        });

        // Build maybeCounts for meeting polls
        const maybeCounts: Record<string, number> = {};
        if (poll.pollType === 'meeting') {
            votes.forEach((v: any) => {
                if (v.maybeOptionIds) {
                    v.maybeOptionIds.forEach((optId: string) => {
                        maybeCounts[optId] = (maybeCounts[optId] || 0) + 1;
                    });
                }
            });
        }

        // Build pairwiseScores for pairwise polls
        let pairwiseScores: Record<string, { wins: number; losses: number; score: number }> | null = null;
        if (poll.pollType === 'pairwise') {
            pairwiseScores = {};
            const optionIds = poll.options?.map((o: any) => o.id) || [];
            
            // Initialize all options
            optionIds.forEach((id: string) => {
                pairwiseScores![id] = { wins: 0, losses: 0, score: 0 };
            });
            
            // Count wins from pairwise votes
            votes.forEach((v: any) => {
                if (v.pairwiseChoices) {
                    Object.entries(v.pairwiseChoices).forEach(([matchup, winnerId]) => {
                        if (winnerId && pairwiseScores![winnerId as string]) {
                            pairwiseScores![winnerId as string].wins++;
                        }
                        // Count loss for the other option
                        const [opt1, opt2] = matchup.split('_vs_');
                        const loserId = winnerId === opt1 ? opt2 : opt1;
                        if (loserId && pairwiseScores![loserId]) {
                            pairwiseScores![loserId].losses++;
                        }
                    });
                }
            });
            
            // Calculate scores (win percentage)
            Object.keys(pairwiseScores).forEach(id => {
                const total = pairwiseScores![id].wins + pairwiseScores![id].losses;
                pairwiseScores![id].score = total > 0 ? (pairwiseScores![id].wins / total) * 100 : 0;
            });
        }

        // Build matrixAverages for matrix polls
        let matrixAverages: Record<string, { x: number; y: number }> | null = null;
        if (poll.pollType === 'matrix') {
            matrixAverages = {};
            const matrixVotes: Record<string, { xSum: number; ySum: number; count: number }> = {};
            
            votes.forEach((v: any) => {
                if (v.matrixVotes) {
                    Object.entries(v.matrixVotes).forEach(([optId, coords]: [string, any]) => {
                        if (!matrixVotes[optId]) {
                            matrixVotes[optId] = { xSum: 0, ySum: 0, count: 0 };
                        }
                        matrixVotes[optId].xSum += coords.x || 0;
                        matrixVotes[optId].ySum += coords.y || 0;
                        matrixVotes[optId].count++;
                    });
                }
            });
            
            Object.entries(matrixVotes).forEach(([optId, data]) => {
                matrixAverages![optId] = {
                    x: data.count > 0 ? data.xSum / data.count : 50,
                    y: data.count > 0 ? data.ySum / data.count : 50,
                };
            });
        }

        // Build budgetStats for budget polls
        let budgetStats: Record<string, { totalValue: number; purchaseCount: number }> | null = null;
        if (poll.pollType === 'budget') {
            budgetStats = {};
            
            votes.forEach((v: any) => {
                if (v.budgetAllocations) {
                    Object.entries(v.budgetAllocations).forEach(([optId, allocation]: [string, any]) => {
                        if (!budgetStats![optId]) {
                            budgetStats![optId] = { totalValue: 0, purchaseCount: 0 };
                        }
                        budgetStats![optId].totalValue += allocation.value || allocation.amount || 0;
                        budgetStats![optId].purchaseCount += allocation.quantity || 1;
                    });
                }
            });
        }

        // Build rounds for ranked choice voting (instant runoff)
        let rounds: any[] = [];
        let winnerId: string | null = null;
        
        if (poll.pollType === 'ranked' && votes.length > 0) {
            // Simulate instant runoff voting
            const optionIds = poll.options?.map((o: any) => o.id) || [];
            let remainingOptions = [...optionIds];
            let ballots = votes.map((v: any) => [...(v.rankedOptionIds || v.selectedOptionIds || [])]);
            
            while (remainingOptions.length > 1) {
                // Count first-choice votes
                const firstChoiceCounts: Record<string, number> = {};
                remainingOptions.forEach(id => firstChoiceCounts[id] = 0);
                
                ballots.forEach(ballot => {
                    const firstChoice = ballot.find((id: string) => remainingOptions.includes(id));
                    if (firstChoice) {
                        firstChoiceCounts[firstChoice]++;
                    }
                });
                
                const totalVotesInRound = Object.values(firstChoiceCounts).reduce((a, b) => a + b, 0);
                
                // Check for majority winner
                const sortedOptions = Object.entries(firstChoiceCounts)
                    .sort(([, a], [, b]) => b - a);
                
                rounds.push({
                    roundNumber: rounds.length + 1,
                    counts: { ...firstChoiceCounts },
                    eliminated: null,
                    total: totalVotesInRound,
                });
                
                if (sortedOptions[0] && sortedOptions[0][1] > totalVotesInRound / 2) {
                    winnerId = sortedOptions[0][0];
                    break;
                }
                
                // Eliminate lowest
                if (sortedOptions.length > 0) {
                    const lowestId = sortedOptions[sortedOptions.length - 1][0];
                    rounds[rounds.length - 1].eliminated = lowestId;
                    remainingOptions = remainingOptions.filter(id => id !== lowestId);
                }
                
                // Safety: prevent infinite loop
                if (rounds.length > 20) break;
            }
            
            // If no majority winner found, winner is last remaining
            if (!winnerId && remainingOptions.length === 1) {
                winnerId = remainingOptions[0];
            }
        } else {
            // For non-ranked polls, winner is option with most votes
            const maxVotes = Math.max(...Object.values(simpleCounts));
            if (maxVotes > 0) {
                winnerId = Object.entries(simpleCounts).find(([, count]) => count === maxVotes)?.[0] || null;
            }
        }

        // Extract comments if any
        const comments = votes
            .filter((v: any) => v.comment && v.comment.trim())
            .map((v: any) => ({
                text: v.comment,
                timestamp: v.timestamp || v.votedAt,
                voterName: v.voterName,
            }));

        const response: any = {
            pollId: poll.id,
            title: poll.title || poll.question,
            pollType: poll.pollType,
            totalVotes: voteCount, // VoteGeneratorResults expects this name
            voteCount,
            responseCount: voteCount,
            winnerId, // Winner of the poll
            rounds: rounds.length > 0 ? rounds : [], // For ranked choice voting
            options: optionResults,
            simpleCounts, // VoteGeneratorResults uses this for vote counts per option
            maybeCounts: Object.keys(maybeCounts).length > 0 ? maybeCounts : null,
            pairwiseScores,
            matrixAverages,
            budgetStats,
            ratingStats: ratingResults, // Include rating-specific results (VoteGeneratorResults expects 'ratingStats')
            comments: comments.length > 0 ? comments : null,
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
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface VoteAnalytics {
    device?: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    country?: string;
    region?: string;
    referrerDomain?: string;
    utmSource?: string;
    timestamp?: string;
}

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    voterName?: string;
    usedCode?: string;
    comment?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
    // Survey mode
    surveyAnswers?: Record<string, any>;
    timestamp: string;
    analytics?: VoteAnalytics;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string; cost?: number }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
        allowComments?: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
    // Survey mode
    isSurvey?: boolean;
    sections?: any[];
    surveySettings?: any;
}

interface RoundStanding {
    optionId: string;
    optionText: string;
    voteCount: number;
    percentage: number;
    isEliminated: boolean;
    isWinner: boolean;
}

interface VoteRedistribution {
    fromOptionId: string;
    toOptionId: string;
    count: number;
}

interface RunoffRound {
    roundNumber: number;
    standings: RoundStanding[];
    eliminated?: string;
    redistributedVotes?: VoteRedistribution[];
    isComplete: boolean;
    winnerId?: string;
}

interface RunoffResult {
    rounds: RunoffRound[];
    winner: { id: string; text: string } | null;
    totalVotes: number;
}

interface SimpleResult {
    standings: { optionId: string; optionText: string; voteCount: number; percentage: number }[];
    totalVotes: number;
    winner: { id: string; text: string } | null;
}

/**
 * Calculate simple multiple choice results
 */
function calculateSimpleResults(poll: Poll): SimpleResult {
    const { votes, options } = poll;
    const totalVotes = votes.length;

    // Count votes per option
    const voteCounts: Map<string, number> = new Map();
    options.forEach(o => voteCounts.set(o.id, 0));

    for (const vote of votes) {
        if (vote.selectedOptionIds) {
            for (const optionId of vote.selectedOptionIds) {
                voteCounts.set(optionId, (voteCounts.get(optionId) || 0) + 1);
            }
        }
    }

    // Build standings
    const standings = options.map(option => ({
        optionId: option.id,
        optionText: option.text,
        voteCount: voteCounts.get(option.id) || 0,
        percentage: totalVotes > 0 ? Math.round(((voteCounts.get(option.id) || 0) / totalVotes) * 100) : 0
    })).sort((a, b) => b.voteCount - a.voteCount);

    const winner = standings.length > 0 && standings[0].voteCount > 0
        ? { id: standings[0].optionId, text: standings[0].optionText }
        : null;

    return { standings, totalVotes, winner };
}

/**
 * Calculate Instant Runoff Voting results
 */
function calculateRunoff(poll: Poll): RunoffResult {
    const { votes, options } = poll;
    const totalVotes = votes.length;
    
    if (totalVotes === 0) {
        return { rounds: [], winner: null, totalVotes: 0 };
    }

    const majorityThreshold = Math.floor(totalVotes / 2) + 1;
    let activeOptionIds = new Set(options.map(o => o.id));
    
    const ballots = votes.map(vote => ({
        currentPreferences: [...(vote.rankedOptionIds || [])]
    }));
    
    const rounds: RunoffRound[] = [];
    let roundNumber = 0;
    
    while (activeOptionIds.size > 1) {
        roundNumber++;
        
        // Count first-choice votes
        const voteCounts: Map<string, number> = new Map();
        activeOptionIds.forEach(id => voteCounts.set(id, 0));
        
        for (const ballot of ballots) {
            const topChoice = ballot.currentPreferences.find(id => activeOptionIds.has(id));
            if (topChoice) {
                voteCounts.set(topChoice, (voteCounts.get(topChoice) || 0) + 1);
            }
        }
        
        // Build standings
        const standings: RoundStanding[] = options.map(option => {
            const count = voteCounts.get(option.id) || 0;
            const isActive = activeOptionIds.has(option.id);
            return {
                optionId: option.id,
                optionText: option.text,
                voteCount: count,
                percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
                isEliminated: !isActive,
                isWinner: false
            };
        });
        
        standings.sort((a, b) => b.voteCount - a.voteCount);
        
        // Check for winner
        const leader = standings.find(s => !s.isEliminated);
        if (leader && leader.voteCount >= majorityThreshold) {
            leader.isWinner = true;
            rounds.push({
                roundNumber,
                standings,
                isComplete: true,
                winnerId: leader.optionId
            });
            
            const winnerOption = options.find(o => o.id === leader.optionId)!;
            return {
                rounds,
                winner: { id: winnerOption.id, text: winnerOption.text },
                totalVotes
            };
        }
        
        // Check if only 2 left
        const activeCandidates = standings.filter(s => !s.isEliminated);
        if (activeCandidates.length <= 2) {
            const winner = activeCandidates[0];
            if (winner) {
                winner.isWinner = true;
                rounds.push({
                    roundNumber,
                    standings,
                    isComplete: true,
                    winnerId: winner.optionId
                });
                
                const winnerOption = options.find(o => o.id === winner.optionId)!;
                return {
                    rounds,
                    winner: { id: winnerOption.id, text: winnerOption.text },
                    totalVotes
                };
            }
        }
        
        // Eliminate lowest
        const activeStandings = standings.filter(s => activeOptionIds.has(s.optionId));
        const minVotes = Math.min(...activeStandings.map(s => s.voteCount));
        const toEliminate = activeStandings.filter(s => s.voteCount === minVotes);
        
        const eliminatedOption = toEliminate.sort((a, b) => 
            a.optionText.localeCompare(b.optionText)
        )[0];
        
        activeOptionIds.delete(eliminatedOption.optionId);
        
        const eliminatedStanding = standings.find(s => s.optionId === eliminatedOption.optionId);
        if (eliminatedStanding) {
            eliminatedStanding.isEliminated = true;
        }
        
        rounds.push({
            roundNumber,
            standings,
            eliminated: eliminatedOption.optionId,
            isComplete: false
        });
        
        if (roundNumber > 50) break;
    }
    
    // Last standing wins
    const lastStanding = options.find(o => activeOptionIds.has(o.id));
    if (lastStanding) {
        return {
            rounds,
            winner: { id: lastStanding.id, text: lastStanding.text },
            totalVotes
        };
    }
    
    return { rounds, winner: null, totalVotes };
}

/**
 * Build simple counts for frontend compatibility
 */
function buildSimpleCounts(poll: Poll): Record<string, number> {
    const counts: Record<string, number> = {};
    poll.options.forEach(o => counts[o.id] = 0);
    
    for (const vote of poll.votes) {
        if (vote.selectedOptionIds) {
            for (const optionId of vote.selectedOptionIds) {
                counts[optionId] = (counts[optionId] || 0) + 1;
            }
        }
    }
    
    return counts;
}

/**
 * Build maybe counts for meeting polls
 */
function buildMaybeCounts(poll: Poll): Record<string, number> {
    const counts: Record<string, number> = {};
    poll.options.forEach(o => counts[o.id] = 0);
    
    for (const vote of poll.votes) {
        if (vote.choicesMaybe) {
            for (const optionId of vote.choicesMaybe) {
                counts[optionId] = (counts[optionId] || 0) + 1;
            }
        }
    }
    
    return counts;
}

/**
 * Extract comments from votes
 */
function extractComments(votes: Vote[]): { name: string; text: string; date: string }[] {
    return votes
        .filter(v => v.comment)
        .map(v => ({
            name: v.voterName || 'Anonymous',
            text: v.comment!,
            date: v.timestamp
        }));
}

/**
 * Calculate matrix averages
 */
function calculateMatrixAverages(poll: Poll): Record<string, { x: number; y: number; count: number }> {
    const totals: Record<string, { sumX: number; sumY: number; count: number }> = {};
    poll.options.forEach(o => totals[o.id] = { sumX: 0, sumY: 0, count: 0 });
    
    for (const vote of poll.votes) {
        if (vote.matrixVotes) {
            for (const [optionId, pos] of Object.entries(vote.matrixVotes)) {
                if (totals[optionId]) {
                    totals[optionId].sumX += pos.x;
                    totals[optionId].sumY += pos.y;
                    totals[optionId].count++;
                }
            }
        }
    }
    
    const averages: Record<string, { x: number; y: number; count: number }> = {};
    for (const [id, data] of Object.entries(totals)) {
        averages[id] = {
            x: data.count > 0 ? Math.round(data.sumX / data.count) : 50,
            y: data.count > 0 ? Math.round(data.sumY / data.count) : 50,
            count: data.count
        };
    }
    
    return averages;
}

/**
 * Calculate pairwise scores
 */
function calculatePairwiseScores(poll: Poll): Record<string, number> {
    const scores: Record<string, number> = {};
    poll.options.forEach(o => scores[o.id] = 0);
    
    for (const vote of poll.votes) {
        if (vote.pairwiseVotes) {
            for (const pv of vote.pairwiseVotes) {
                scores[pv.winnerId] = (scores[pv.winnerId] || 0) + 1;
            }
        }
    }
    
    return scores;
}

/**
 * Calculate rating stats
 */
function calculateRatingStats(poll: Poll): Record<string, { average: number; count: number; sum: number }> {
    const stats: Record<string, { sum: number; count: number }> = {};
    poll.options.forEach(o => stats[o.id] = { sum: 0, count: 0 });
    
    for (const vote of poll.votes) {
        if (vote.ratingVotes) {
            for (const [optionId, rating] of Object.entries(vote.ratingVotes)) {
                if (stats[optionId]) {
                    stats[optionId].sum += rating;
                    stats[optionId].count++;
                }
            }
        }
    }
    
    const result: Record<string, { average: number; count: number; sum: number }> = {};
    for (const [id, data] of Object.entries(stats)) {
        result[id] = {
            average: data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0,
            count: data.count,
            sum: data.sum
        };
    }
    
    return result;
}

/**
 * Calculate budget stats
 */
function calculateBudgetStats(poll: Poll): Record<string, { totalValue: number; voteCount: number }> {
    const stats: Record<string, { totalValue: number; voteCount: number }> = {};
    poll.options.forEach(o => stats[o.id] = { totalValue: 0, voteCount: 0 });
    
    for (const vote of poll.votes) {
        if (vote.selectedOptionIds) {
            for (const optionId of vote.selectedOptionIds) {
                if (stats[optionId]) {
                    const option = poll.options.find(o => o.id === optionId);
                    stats[optionId].totalValue += option?.cost || 1;
                    stats[optionId].voteCount++;
                }
            }
        }
    }
    
    return stats;
}

/**
 * Calculate survey-specific statistics
 */
function calculateSurveyStats(poll: Poll): {
    totalResponses: number;
    completeResponses: number;
    questionStats: Record<string, any>;
} {
    const votes = poll.votes || [];
    const sections = poll.sections || [];
    
    // Get all question IDs from sections
    const allQuestions: { id: string; type: string; options?: any[] }[] = [];
    for (const section of sections) {
        if (section.questions) {
            for (const q of section.questions) {
                allQuestions.push({
                    id: q.id,
                    type: q.type,
                    options: q.options
                });
            }
        }
    }
    
    // Calculate stats per question
    const questionStats: Record<string, any> = {};
    
    for (const question of allQuestions) {
        const qId = question.id;
        const stats: any = {
            questionId: qId,
            type: question.type,
            responseCount: 0,
            responses: []
        };
        
        // Collect all answers for this question
        for (const vote of votes) {
            if (vote.surveyAnswers && vote.surveyAnswers[qId]) {
                const answer = vote.surveyAnswers[qId];
                stats.responseCount++;
                
                // Type-specific aggregation
                switch (question.type) {
                    case 'multiple_choice':
                    case 'dropdown':
                    case 'yes_no':
                        // Count selections
                        if (!stats.optionCounts) stats.optionCounts = {};
                        const selectedIds = answer.selectedIds || [];
                        for (const optId of selectedIds) {
                            stats.optionCounts[optId] = (stats.optionCounts[optId] || 0) + 1;
                        }
                        break;
                        
                    case 'rating':
                    case 'scale':
                    case 'number':
                        // Calculate average
                        if (!stats.values) stats.values = [];
                        if (answer.number !== undefined) {
                            stats.values.push(answer.number);
                        }
                        break;
                        
                    case 'text':
                    case 'textarea':
                    case 'email':
                    case 'phone':
                        // Collect text responses
                        if (answer.text) {
                            stats.responses.push(answer.text);
                        }
                        break;
                        
                    case 'ranking':
                        // Aggregate ranking scores
                        if (!stats.rankingSums) stats.rankingSums = {};
                        if (!stats.rankingCounts) stats.rankingCounts = {};
                        if (answer.ranking && Array.isArray(answer.ranking)) {
                            answer.ranking.forEach((optId: string, index: number) => {
                                stats.rankingSums[optId] = (stats.rankingSums[optId] || 0) + (index + 1);
                                stats.rankingCounts[optId] = (stats.rankingCounts[optId] || 0) + 1;
                            });
                        }
                        break;
                        
                    case 'date':
                    case 'time':
                    case 'datetime':
                        // Collect date/time responses
                        if (answer.date) stats.responses.push(answer.date);
                        if (answer.time) stats.responses.push(answer.time);
                        break;
                }
            }
        }
        
        // Calculate derived stats
        if (stats.values && stats.values.length > 0) {
            stats.average = stats.values.reduce((a: number, b: number) => a + b, 0) / stats.values.length;
            stats.min = Math.min(...stats.values);
            stats.max = Math.max(...stats.values);
        }
        
        if (stats.rankingSums && stats.rankingCounts) {
            stats.rankingAverages = {};
            for (const [optId, sum] of Object.entries(stats.rankingSums)) {
                const count = stats.rankingCounts[optId] || 1;
                stats.rankingAverages[optId] = (sum as number) / count;
            }
        }
        
        questionStats[qId] = stats;
    }
    
    return {
        totalResponses: votes.length,
        completeResponses: votes.filter(v => v.surveyAnswers && Object.keys(v.surveyAnswers).length > 0).length,
        questionStats
    };
}

export const handler: Handler = async (event) => {
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
        const rawVotes = event.queryStringParameters?.raw === 'true';

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll - USE VG_SITE_ID (not SITE_ID which is reserved)
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        const poll: Poll | null = await store.get(pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check access
        const isAdmin = adminKey && adminKey === poll.adminKey;
        
        if (poll.settings.hideResults && !isAdmin) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Results are hidden',
                    message: 'The poll creator will reveal results when voting is complete.'
                })
            };
        }

        // If requesting raw votes (admin only)
        if (rawVotes && isAdmin) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(poll.votes.map(v => ({
                    ...v,
                    votedAt: v.timestamp
                })))
            };
        }

        if (poll.votes.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    pollId: poll.id,
                    pollType: poll.pollType,
                    totalVotes: 0,
                    simpleCounts: {},
                    maybeCounts: {},
                    votes: [],
                    comments: [],
                    message: 'No votes yet'
                })
            };
        }

        // Build base response with all data needed by frontend
        const baseResponse: any = {
            pollId: poll.id,
            pollType: poll.pollType,
            totalVotes: poll.votes.length,
            simpleCounts: buildSimpleCounts(poll),
            maybeCounts: buildMaybeCounts(poll),
            comments: extractComments(poll.votes),
        };

        // Include votes array for admin (needed for Grid view, Geography, Device breakdown)
        if (isAdmin) {
            baseResponse.votes = poll.votes.map(v => ({
                id: v.id,
                timestamp: v.timestamp,
                votedAt: v.timestamp,
                voterName: v.voterName,
                comment: v.comment,
                choices: v.selectedOptionIds || v.rankedOptionIds || [],
                choicesMaybe: v.choicesMaybe,
                matrixVotes: v.matrixVotes,
                pairwiseVotes: v.pairwiseVotes,
                ratingVotes: v.ratingVotes,
                surveyAnswers: v.surveyAnswers, // Include survey answers
                analytics: v.analytics // Include analytics for geography/device views
            }));
        }

        // ============================================
        // SURVEY MODE - Return survey-specific data
        // ============================================
        const isSurvey = poll.isSurvey || poll.pollType === 'survey';
        
        if (isSurvey) {
            // For surveys, include sections info and all survey answers
            baseResponse.isSurvey = true;
            baseResponse.sections = poll.sections || [];
            baseResponse.surveySettings = poll.surveySettings || {};
            
            // Calculate survey-specific stats
            const surveyStats = calculateSurveyStats(poll);
            baseResponse.surveyStats = surveyStats;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...baseResponse,
                    winnerId: null // Surveys don't have winners
                })
            };
        }

        // Add poll-type specific data
        if (poll.pollType === 'matrix') {
            baseResponse.matrixAverages = calculateMatrixAverages(poll);
        }
        
        if (poll.pollType === 'pairwise') {
            baseResponse.pairwiseScores = calculatePairwiseScores(poll);
        }
        
        if (poll.pollType === 'rating') {
            baseResponse.ratingStats = calculateRatingStats(poll);
        }
        
        if (poll.pollType === 'budget') {
            baseResponse.budgetStats = calculateBudgetStats(poll);
        }

        // Calculate results based on poll type
        if (poll.pollType === 'ranked') {
            const runoffResult = calculateRunoff(poll);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...baseResponse,
                    ...runoffResult,
                    winnerId: runoffResult.winner?.id || null
                })
            };
        } else {
            const simpleResult = calculateSimpleResults(poll);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...baseResponse,
                    ...simpleResult,
                    winnerId: simpleResult.winner?.id || null
                })
            };
        }

    } catch (error) {
        console.error('Error calculating results:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
        };
    }
};
import { Handler } from '@netlify/functions';

interface Vote {
    id: string;
    rankedOptionIds?: string[];
    selectedOptionIds?: string[];
    timestamp: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    pollType: string;
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
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

        if (!pollId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID is required' })
            };
        }

        // Get poll
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({
            name: 'polls',
            siteID: process.env.SITE_ID || '',
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

        if (poll.votes.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    pollId: poll.id,
                    pollType: poll.pollType,
                    totalVotes: 0,
                    message: 'No votes yet'
                })
            };
        }

        // Calculate results based on poll type
        if (poll.pollType === 'ranked') {
            const runoffResult = calculateRunoff(poll);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    pollId: poll.id,
                    pollType: 'ranked',
                    ...runoffResult
                })
            };
        } else {
            const simpleResult = calculateSimpleResults(poll);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    pollId: poll.id,
                    pollType: poll.pollType,
                    ...simpleResult
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

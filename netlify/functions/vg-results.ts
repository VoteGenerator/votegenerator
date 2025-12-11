import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

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
    pollType: 'ranked' | 'multiple';
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowMultiple: boolean;
    };
    votes: Vote[];
    createdAt: string;
    voteCount: number;
}

interface OptionStanding {
    optionId: string;
    optionText: string;
    voteCount: number;
    percentage: number;
}

interface RunoffRound {
    roundNumber: number;
    standings: (OptionStanding & { isEliminated: boolean; isWinner: boolean })[];
    eliminatedId?: string;
    eliminatedText?: string;
    isComplete: boolean;
    winnerId?: string;
}

interface RankedResults {
    type: 'ranked';
    rounds: RunoffRound[];
    winner: { id: string; text: string } | null;
    totalVotes: number;
}

interface MultipleResults {
    type: 'multiple';
    standings: OptionStanding[];
    winner: { id: string; text: string } | null;
    totalVotes: number;
}

/**
 * Calculate instant-runoff voting results for ranked choice
 */
function calculateRankedResults(poll: Poll): RankedResults {
    const { votes, options } = poll;
    const totalVotes = votes.length;

    if (totalVotes === 0) {
        return {
            type: 'ranked',
            rounds: [],
            winner: null,
            totalVotes: 0
        };
    }

    const rounds: RunoffRound[] = [];
    const eliminatedIds = new Set<string>();
    
    // Copy votes for manipulation (each vote tracks current position)
    const activeVotes = votes
        .filter(v => v.rankedOptionIds && v.rankedOptionIds.length > 0)
        .map(v => ({
            rankings: [...v.rankedOptionIds!],
            currentIndex: 0
        }));

    let roundNumber = 1;
    const maxRounds = options.length; // Safety limit

    while (roundNumber <= maxRounds) {
        // Count first-choice votes (skipping eliminated candidates)
        const voteCounts = new Map<string, number>();
        options.forEach(o => {
            if (!eliminatedIds.has(o.id)) {
                voteCounts.set(o.id, 0);
            }
        });

        for (const vote of activeVotes) {
            // Find first non-eliminated choice
            while (vote.currentIndex < vote.rankings.length) {
                const choiceId = vote.rankings[vote.currentIndex];
                if (!eliminatedIds.has(choiceId)) {
                    voteCounts.set(choiceId, (voteCounts.get(choiceId) || 0) + 1);
                    break;
                }
                vote.currentIndex++;
            }
        }

        // Calculate standings for this round
        const activeOptions = options.filter(o => !eliminatedIds.has(o.id));
        const standings = activeOptions.map(option => {
            const count = voteCounts.get(option.id) || 0;
            return {
                optionId: option.id,
                optionText: option.text,
                voteCount: count,
                percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 1000) / 10 : 0,
                isEliminated: false,
                isWinner: false
            };
        }).sort((a, b) => b.voteCount - a.voteCount);

        // Check for winner (>50%)
        const leader = standings[0];
        if (leader && leader.percentage > 50) {
            leader.isWinner = true;
            rounds.push({
                roundNumber,
                standings,
                isComplete: true,
                winnerId: leader.optionId
            });
            
            return {
                type: 'ranked',
                rounds,
                winner: { id: leader.optionId, text: leader.optionText },
                totalVotes
            };
        }

        // Check if only one candidate remains
        if (standings.length === 1) {
            standings[0].isWinner = true;
            rounds.push({
                roundNumber,
                standings,
                isComplete: true,
                winnerId: standings[0].optionId
            });

            return {
                type: 'ranked',
                rounds,
                winner: { id: standings[0].optionId, text: standings[0].optionText },
                totalVotes
            };
        }

        // Find candidate(s) with lowest votes to eliminate
        const minVotes = Math.min(...standings.map(s => s.voteCount));
        const toEliminate = standings.filter(s => s.voteCount === minVotes);
        
        // Eliminate the last one (or random if tied at bottom)
        const eliminated = toEliminate[toEliminate.length - 1];
        eliminated.isEliminated = true;
        eliminatedIds.add(eliminated.optionId);

        rounds.push({
            roundNumber,
            standings,
            eliminatedId: eliminated.optionId,
            eliminatedText: eliminated.optionText,
            isComplete: false
        });

        roundNumber++;
    }

    // Fallback - no clear winner after all rounds
    return {
        type: 'ranked',
        rounds,
        winner: null,
        totalVotes
    };
}

/**
 * Calculate simple multiple choice results
 */
function calculateMultipleResults(poll: Poll): MultipleResults {
    const { votes, options } = poll;
    const totalVotes = votes.length;

    // Count votes per option
    const voteCounts = new Map<string, number>();
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
        percentage: totalVotes > 0 ? Math.round(((voteCounts.get(option.id) || 0) / totalVotes) * 1000) / 10 : 0
    })).sort((a, b) => b.voteCount - a.voteCount);

    const winner = standings.length > 0 && standings[0].voteCount > 0
        ? { id: standings[0].optionId, text: standings[0].optionText }
        : null;

    return {
        type: 'multiple',
        standings,
        winner,
        totalVotes
    };
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
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

        // Fetch poll from Netlify Blobs
        const store = getStore('votegenerator-polls');
        const poll: Poll | null = await store.get(pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check permissions
        const isAdmin = adminKey && adminKey === poll.adminKey;

        // If results are hidden and not admin, deny access
        if (poll.settings.hideResults && !isAdmin) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Results are hidden',
                    message: 'The poll creator has hidden results until they choose to reveal them.'
                })
            };
        }

        // Calculate results based on poll type
        let results: RankedResults | MultipleResults;
        
        if (poll.pollType === 'ranked') {
            results = calculateRankedResults(poll);
        } else {
            results = calculateMultipleResults(poll);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                pollId: poll.id,
                title: poll.title,
                pollType: poll.pollType,
                results,
                isAdmin
            })
        };

    } catch (error) {
        console.error('Error fetching results:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch results' })
        };
    }
};

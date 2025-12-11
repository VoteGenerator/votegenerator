import { Handler } from '@netlify/functions';

interface Vote {
    id: string;
    rankedOptionIds: string[];
    timestamp: string;
}

interface Poll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    options: { id: string; text: string }[];
    settings: {
        hideResults: boolean;
        allowGuestOptions: boolean;
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
    winner: { id: string; text: string };
    totalVotes: number;
}

/**
 * Calculates Instant Runoff Voting (IRV) results
 * 
 * Algorithm:
 * 1. Count first-choice votes for each candidate
 * 2. If someone has >50%, they win
 * 3. Otherwise, eliminate the candidate with fewest votes
 * 4. Redistribute those votes to voters' next choices
 * 5. Repeat until someone wins
 */
function calculateRunoff(poll: Poll): RunoffResult {
    const { votes, options } = poll;
    const totalVotes = votes.length;
    const majorityThreshold = Math.floor(totalVotes / 2) + 1;
    
    // Track which options are still in the running
    let activeOptionIds = new Set(options.map(o => o.id));
    
    // Create a mutable copy of ballots (each voter's remaining preferences)
    let ballots = votes.map(vote => ({
        originalVote: vote,
        currentPreferences: [...vote.rankedOptionIds]
    }));
    
    const rounds: RunoffRound[] = [];
    let roundNumber = 0;
    
    while (activeOptionIds.size > 1) {
        roundNumber++;
        
        // Count first-choice votes among active options
        const voteCounts: Map<string, number> = new Map();
        activeOptionIds.forEach(id => voteCounts.set(id, 0));
        
        // For each ballot, find their top choice among remaining candidates
        for (const ballot of ballots) {
            // Get first active option from their preference list
            const topChoice = ballot.currentPreferences.find(id => activeOptionIds.has(id));
            if (topChoice) {
                voteCounts.set(topChoice, (voteCounts.get(topChoice) || 0) + 1);
            }
        }
        
        // Build standings for this round
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
        
        // Sort by vote count descending
        standings.sort((a, b) => b.voteCount - a.voteCount);
        
        // Check for winner (>50%)
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
        
        // Check if only 2 candidates left - winner is whoever has more
        const activeCandidates = standings.filter(s => !s.isEliminated);
        if (activeCandidates.length === 2 || activeOptionIds.size === 2) {
            const winner = activeCandidates[0];
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
        
        // Find candidate(s) with lowest votes to eliminate
        const activeStandings = standings.filter(s => activeOptionIds.has(s.optionId));
        const minVotes = Math.min(...activeStandings.map(s => s.voteCount));
        const toEliminate = activeStandings.filter(s => s.voteCount === minVotes);
        
        // If there's a tie for last, eliminate the first one alphabetically
        // (In a more sophisticated system, you might use different tie-breakers)
        const eliminatedOption = toEliminate.sort((a, b) => 
            a.optionText.localeCompare(b.optionText)
        )[0];
        
        // Track vote redistribution for visualization
        const redistributions: VoteRedistribution[] = [];
        
        // Remove eliminated candidate and redistribute their votes
        activeOptionIds.delete(eliminatedOption.optionId);
        
        // Mark as eliminated in standings
        const eliminatedStanding = standings.find(s => s.optionId === eliminatedOption.optionId);
        if (eliminatedStanding) {
            eliminatedStanding.isEliminated = true;
        }
        
        // For each ballot that had the eliminated candidate as first choice,
        // find where their vote goes next
        for (const ballot of ballots) {
            const topChoice = ballot.currentPreferences.find(id => 
                id === eliminatedOption.optionId || activeOptionIds.has(id)
            );
            
            if (topChoice === eliminatedOption.optionId) {
                // This voter's first choice was eliminated
                // Find their next active preference
                const nextChoice = ballot.currentPreferences.find(id => 
                    id !== eliminatedOption.optionId && activeOptionIds.has(id)
                );
                
                if (nextChoice) {
                    // Track this redistribution
                    const existing = redistributions.find(
                        r => r.fromOptionId === eliminatedOption.optionId && r.toOptionId === nextChoice
                    );
                    if (existing) {
                        existing.count++;
                    } else {
                        redistributions.push({
                            fromOptionId: eliminatedOption.optionId,
                            toOptionId: nextChoice,
                            count: 1
                        });
                    }
                }
            }
        }
        
        // Add this round to results
        rounds.push({
            roundNumber,
            standings,
            eliminated: eliminatedOption.optionId,
            redistributedVotes: redistributions,
            isComplete: false
        });
        
        // Safety check to prevent infinite loops
        if (roundNumber > 50) {
            console.error('Runoff exceeded 50 rounds, breaking');
            break;
        }
    }
    
    // If we get here with 1 candidate left, they win by default
    const lastStanding = options.find(o => activeOptionIds.has(o.id));
    if (lastStanding) {
        return {
            rounds,
            winner: { id: lastStanding.id, text: lastStanding.text },
            totalVotes
        };
    }
    
    // Fallback (shouldn't happen)
    return {
        rounds,
        winner: { id: options[0].id, text: options[0].text },
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

        // Fetch poll from database
        const { getStore } = await import('@netlify/blobs');
        const store = getStore('votegenerator-polls');
        const poll: Poll | null = await store.get(pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check access permissions
        const isAdmin = adminKey && adminKey === poll.adminKey;
        
        // If results are hidden and not admin, deny access
        if (poll.settings.hideResults && !isAdmin) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Results are hidden',
                    message: 'The poll creator has hidden results until voting is complete.'
                })
            };
        }

        // Check if there are any votes
        if (poll.votes.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    pollId: poll.id,
                    totalVotes: 0,
                    rounds: [],
                    winner: null,
                    message: 'No votes yet'
                })
            };
        }

        // Calculate runoff results
        const runoffResult = calculateRunoff(poll);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                pollId: poll.id,
                ...runoffResult
            })
        };

    } catch (error) {
        console.error('Error calculating results:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to calculate results' })
        };
    }
};

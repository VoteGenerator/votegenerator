import { Poll, PollSettings, RunoffResult, RoundLog, Vote } from '../types';

const LS_PREFIX = 'votegenerator_';

const generateId = (len: number = 8) => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
};

const getLocalPolls = (): Record<string, any> => {
    const data = localStorage.getItem(`${LS_PREFIX}polls`);
    return data ? JSON.parse(data) : {};
};

const saveLocalPoll = (poll: any) => {
    const polls = getLocalPolls();
    polls[poll.id] = poll;
    localStorage.setItem(`${LS_PREFIX}polls`, JSON.stringify(polls));
};

const getLocalVotes = (pollId: string): any[] => {
    const data = localStorage.getItem(`${LS_PREFIX}votes_${pollId}`);
    return data ? JSON.parse(data) : [];
};

const saveLocalVote = (pollId: string, vote: any) => {
    const votes = getLocalVotes(pollId);
    votes.push(vote);
    localStorage.setItem(`${LS_PREFIX}votes_${pollId}`, JSON.stringify(votes));
};

// --- API Service ---

// Updated to accept object options
export const createPoll = async (data: {
    title: string;
    description?: string;
    options: ({ text: string; imageUrl?: string; cost?: number } | string)[]; 
    pollType: Poll['pollType'];
    settings: PollSettings;
    voterCount?: number;
}): Promise<{ id: string; adminKey: string }> => {
    try {
        const response = await fetch('/.netlify/functions/create-poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return await response.json();
        }
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        console.warn('Backend unavailable, falling back to LocalStorage mode.');
        
        const id = generateId(8);
        const adminKey = generateId(16);
        
        const poll = {
            id,
            adminKey,
            ...data,
            // Normalize options to objects with IDs
            options: data.options.map(opt => {
                const optId = generateId(6);
                if (typeof opt === 'string') return { id: optId, text: opt };
                return { id: optId, text: opt.text, imageUrl: opt.imageUrl, cost: opt.cost };
            }),
            createdAt: new Date().toISOString(),
            voteCount: 0,
            votes: []
        };
        saveLocalPoll(poll);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        return { id, adminKey };
    }
};

export const updatePoll = async (id: string, adminKey: string, updates: Partial<Poll>): Promise<void> => {
    try {
         const response = await fetch('/.netlify/functions/update-poll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, adminKey, updates }),
        });

        if (response.ok) return;
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[id];
        
        if (!poll || poll.adminKey !== adminKey) throw new Error("Unauthorized or Poll not found");

        const updatedPoll = { ...poll, ...updates };
        saveLocalPoll(updatedPoll);
        await new Promise(resolve => setTimeout(resolve, 500)); 
    }
};

export const getPoll = async (id: string): Promise<Poll> => {
    try {
        const response = await fetch(`/.netlify/functions/get-poll?id=${id}`);
        if (response.ok) return await response.json();
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[id];
        if (!poll) throw new Error('Poll not found');
        const { adminKey, votes, allowedCodes, ...publicPoll } = poll;
        return { ...publicPoll, isAdmin: false };
    }
};

export const getPollAsAdmin = async (id: string, key: string): Promise<Poll> => {
    try {
        const response = await fetch(`/.netlify/functions/get-poll?id=${id}&admin=${key}`);
        if (response.ok) return await response.json();
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[id];
        if (!poll || poll.adminKey !== key) throw new Error('Unauthorized or not found');
        return { ...poll, isAdmin: true, voteCount: getLocalVotes(id).length };
    }
};

export const submitVote = async (
    pollId: string, 
    choices: string[], 
    voterName?: string, 
    code?: string, 
    comment?: string,
    choicesMaybe?: string[],
    matrixVotes?: Record<string, { x: number, y: number }>,
    pairwiseVotes?: { winnerId: string; loserId: string }[],
    ratingVotes?: Record<string, number>
): Promise<void> => {
    const votePayload = {
        pollId,
        choices,
        voterName,
        code,
        comment,
        choicesMaybe,
        matrixVotes,
        pairwiseVotes,
        ratingVotes
    };

    try {
        const response = await fetch('/.netlify/functions/submit-vote', {
            method: 'POST',
            body: JSON.stringify(votePayload)
        });
        if (response.ok) return;
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[pollId];
        if (!poll) throw new Error('Poll not found');

        saveLocalVote(pollId, { 
            ...votePayload,
            usedCode: code,
            votedAt: new Date().toISOString() 
        });
        
        polls[pollId].voteCount = (polls[pollId].voteCount || 0) + 1;
        saveLocalPoll(polls[pollId]);
        
        localStorage.setItem(`${LS_PREFIX}has_voted_${pollId}`, 'true');
        
        await new Promise(resolve => setTimeout(resolve, 600));
    }
};

export const hasVoted = (pollId: string): boolean => {
    return localStorage.getItem(`${LS_PREFIX}has_voted_${pollId}`) === 'true';
};

export const getRawVotes = async (pollId: string, adminKey: string): Promise<Vote[]> => {
    try {
        const response = await fetch(`/.netlify/functions/get-results?id=${pollId}&admin=${adminKey}&raw=true`);
        if(response.ok) {
            return await response.json();
        }
        throw new Error('API_UNAVAILABLE');
    } catch {
        const votes = getLocalVotes(pollId);
        return votes.map(v => ({
            pollId: v.pollId || pollId,
            choices: v.choices,
            votedAt: v.votedAt || v.createdAt || new Date().toISOString(),
            voterName: v.voterName,
            usedCode: v.usedCode,
            comment: v.comment,
            choicesMaybe: v.choicesMaybe,
            matrixVotes: v.matrixVotes,
            pairwiseVotes: v.pairwiseVotes,
            ratingVotes: v.ratingVotes
        }));
    }
};

export const getResults = async (pollId: string, adminKey?: string): Promise<RunoffResult> => {
    let votes: any[] = [];
    
    try {
        const response = await fetch(`/.netlify/functions/get-results?id=${pollId}${adminKey ? `&admin=${adminKey}` : ''}`);
        if(response.ok) {
            votes = await response.json(); 
        } else {
            throw new Error();
        }
    } catch {
        votes = getLocalVotes(pollId);
    }

    const voters = votes.map((v: any) => v.voterName).filter((n: any) => !!n) as string[];
    const comments = votes
        .filter((v: any) => !!v.comment)
        .map((v: any) => ({
            name: v.voterName || 'Anonymous',
            text: v.comment,
            date: v.votedAt
        }));
        
    const usedCodes = votes.map((v: any) => v.usedCode).filter((c: any) => !!c) as string[];
    
    const simpleCounts: Record<string, number> = {};
    const maybeCounts: Record<string, number> = {};
    const ratingStats: Record<string, { average: number; stdDev: number; count: number }> = {};
    const matrixAverages: Record<string, { x: number, y: number }> = {};
    const pairwiseScores: Record<string, { wins: number; matches: number; score: number }> = {};
    const budgetStats: Record<string, { totalValue: number; totalQuantity: number }> = {};

    // Helper to process votes for different types (rudimentary local calculation)
    votes.forEach((v: any) => {
        // Simple counts & Budget
        if(Array.isArray(v.choices)) {
            v.choices.forEach((c: string) => {
                if(c) simpleCounts[c] = (simpleCounts[c] || 0) + 1;
            });
        }
        // Maybe counts
        if(Array.isArray(v.choicesMaybe)) {
             v.choicesMaybe.forEach((c: string) => {
                if(c) maybeCounts[c] = (maybeCounts[c] || 0) + 1;
            });
        }
        // Ratings
        if (v.ratingVotes) {
            Object.entries(v.ratingVotes).forEach(([id, val]: [string, any]) => {
                if (!ratingStats[id]) ratingStats[id] = { average: 0, stdDev: 0, count: 0 }; // Just placeholders for raw accum
                // This local calc is getting complex, simplification:
                // We mainly rely on backend for results. For fallback, simple counts is often enough.
                // But for Rating view to work in fallback mode, we need basic stats.
                const currentSum = ratingStats[id].average * ratingStats[id].count;
                ratingStats[id].count++;
                ratingStats[id].average = (currentSum + Number(val)) / ratingStats[id].count;
            });
        }
        // Matrix
        if (v.matrixVotes) {
             Object.entries(v.matrixVotes).forEach(([id, pos]: [string, any]) => {
                if (!matrixAverages[id]) matrixAverages[id] = { x: 0, y: 0 };
                // Using simple counts to average? No, need total count.
                // Simplified: we won't implement full matrix math in fallback unless requested.
                // Assuming simpleCounts has count of occurrences if needed.
             });
        }
    });

    // Budget Stats Construction from simple counts (assuming simple counts holds quantity if ids repeated)
    Object.entries(simpleCounts).forEach(([id, qty]) => {
         // This requires access to poll options cost, which we don't have easily here without fetching poll.
         // Skipping deep calc for fallback.
         budgetStats[id] = { totalValue: 0, totalQuantity: qty }; 
    });

    if (votes.length === 0) {
        return { winnerId: null, rounds: [], totalVotes: 0, voters: [], usedCodes: [], comments: [], simpleCounts: {}, votes: [] };
    }

    const rounds: RoundLog[] = [];
    let remainingVotes = votes.map(v => ({ 
        choices: (v.choices || []).filter((c: string) => !!c)
    }));
    
    let activeOptionIds = new Set<string>();
    votes.forEach(v => (v.choices || []).forEach((c: string) => activeOptionIds.add(c)));
    
    let winnerId: string | null = null;
    let roundNum = 1;

    // RCV Logic (only relevant if choices are ranked)
    // We assume RCV if choices > 1 per vote on average? Or just run it.
    
    while (!winnerId && activeOptionIds.size > 0) {
        const roundCounts: Record<string, number> = {};
        activeOptionIds.forEach(id => roundCounts[id] = 0);
        
        remainingVotes.forEach(vote => {
            if (vote.choices.length > 0) {
                const firstChoice = vote.choices[0];
                if (activeOptionIds.has(firstChoice)) {
                    roundCounts[firstChoice] = (roundCounts[firstChoice] || 0) + 1;
                }
            }
        });

        const totalActiveVotes = Object.values(roundCounts).reduce((a, b) => a + b, 0);
        let roundWinner: string | null = null;
        let minVotes = Infinity;
        let loserId: string | null = null;

        Object.entries(roundCounts).forEach(([id, count]) => {
            if (totalActiveVotes > 0 && count > totalActiveVotes / 2) roundWinner = id;
            if (count < minVotes) {
                minVotes = count;
                loserId = id;
            }
        });
        
        if (roundWinner) {
            winnerId = roundWinner;
            rounds.push({ roundNumber: roundNum, counts: roundCounts, eliminatedId: null, winnerId: winnerId });
            break;
        }
        
        if (activeOptionIds.size <= 1) {
             winnerId = loserId; 
             rounds.push({ roundNumber: roundNum, counts: roundCounts, eliminatedId: null, winnerId: winnerId });
            break;
        }

        activeOptionIds.delete(loserId!);
        rounds.push({ roundNumber: roundNum, counts: { ...roundCounts }, eliminatedId: loserId, winnerId: null });

        remainingVotes.forEach(vote => {
            vote.choices = vote.choices.filter((id: string) => id !== loserId);
        });

        roundNum++;
        if(roundNum > 20) break;
    }

    return {
        winnerId,
        rounds,
        totalVotes: votes.length,
        voters,
        usedCodes,
        comments,
        simpleCounts,
        maybeCounts,
        ratingStats,
        matrixAverages,
        budgetStats,
        pairwiseScores,
        votes: votes 
    };
};
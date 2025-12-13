import { Poll, RunoffResult, RoundLog, Vote } from '../types';

// ... (keep existing helper functions like generateId, getLocalPolls, saveLocalPoll, getLocalVotes, saveLocalVote) ...
const LS_PREFIX = 'votegenerator_';

const generateId = (len: number = 8) => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
};

// Generate a simple numeric code for ease of typing (e.g., 6 digits)
const generateAccessCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

export const createPoll = async (data: {
    title: string;
    description?: string;
    options: string[];
    pollType: 'ranked' | 'multiple' | 'meeting' | 'dot' | 'image' | 'matrix' | 'pairwise';
    settings: { 
        hideResults: boolean; 
        allowMultiple: boolean;
        requireNames: boolean;
        allowComments?: boolean;
        publicComments?: boolean;
        blockVpn?: boolean;
        deadline?: string;
        maxVotes?: number;
        security: 'browser' | 'code' | 'none';
        dotBudget?: number;
        timezone?: string;
    };
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
        
        let allowedCodes: string[] = [];
        if (data.settings.security === 'code' && data.voterCount) {
            const codes = new Set<string>();
            while(codes.size < data.voterCount) {
                codes.add(generateAccessCode());
            }
            allowedCodes = Array.from(codes);
        }

        const poll = {
            id,
            adminKey,
            ...data,
            allowedCodes: allowedCodes.length > 0 ? allowedCodes : undefined,
            options: data.options.map(text => ({ id: generateId(6), text })),
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

export const submitVote = async (pollId: string, choices: string[], voterName?: string, code?: string, comment?: string, choicesMaybe?: string[], matrixVotes?: Record<string, { x: number, y: number }>, pairwiseVotes?: { winnerId: string; loserId: string }[]): Promise<void> => {
    try {
        const response = await fetch('/.netlify/functions/submit-vote', {
            method: 'POST',
            body: JSON.stringify({ pollId, choices, voterName, code, comment, choicesMaybe, matrixVotes, pairwiseVotes })
        });
        if (response.ok) return;
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[pollId];
        if (!poll) throw new Error('Poll not found');

        if (poll.settings.security === 'code') {
            if (!code) throw new Error('Access code required');
            if (!poll.allowedCodes.includes(code)) throw new Error('Invalid access code');
            
            const existingVotes = getLocalVotes(pollId);
            const codeUsed = existingVotes.some((v: any) => v.usedCode === code);
            if (codeUsed) throw new Error('This access code has already been used');
        }
        
        saveLocalVote(pollId, { 
            pollId,
            choices,
            choicesMaybe,
            matrixVotes,
            pairwiseVotes,
            voterName, 
            usedCode: code,
            comment,
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
            choicesMaybe: v.choicesMaybe,
            matrixVotes: v.matrixVotes,
            pairwiseVotes: v.pairwiseVotes,
            votedAt: v.votedAt || v.createdAt || new Date().toISOString(),
            voterName: v.voterName,
            usedCode: v.usedCode,
            comment: v.comment
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
    
    // Count 'Yes'
    const simpleCounts: Record<string, number> = {};
    // Count 'Maybe'
    const maybeCounts: Record<string, number> = {};
    
    // Matrix Averages
    const matrixSums: Record<string, { x: number, y: number, count: number }> = {};
    
    // Pairwise Scores
    const pairwiseStats: Record<string, { wins: number, matches: number }> = {};

    votes.forEach((v: any) => {
        if(Array.isArray(v.choices)) {
            v.choices.forEach((c: string) => {
                if(c) simpleCounts[c] = (simpleCounts[c] || 0) + 1;
            });
        }
        if(Array.isArray(v.choicesMaybe)) {
            v.choicesMaybe.forEach((c: string) => {
                if(c) maybeCounts[c] = (maybeCounts[c] || 0) + 1;
            });
        }
        if (v.matrixVotes) {
            Object.entries(v.matrixVotes).forEach(([id, coords]: [string, any]) => {
                if (!matrixSums[id]) matrixSums[id] = { x: 0, y: 0, count: 0 };
                matrixSums[id].x += coords.x;
                matrixSums[id].y += coords.y;
                matrixSums[id].count++;
            });
        }
        if (Array.isArray(v.pairwiseVotes)) {
            v.pairwiseVotes.forEach((match: { winnerId: string, loserId: string }) => {
                // Initialize if not present
                if (!pairwiseStats[match.winnerId]) pairwiseStats[match.winnerId] = { wins: 0, matches: 0 };
                if (!pairwiseStats[match.loserId]) pairwiseStats[match.loserId] = { wins: 0, matches: 0 };
                
                // Update Winner
                pairwiseStats[match.winnerId].matches++;
                pairwiseStats[match.winnerId].wins++;
                
                // Update Loser
                pairwiseStats[match.loserId].matches++;
            });
        }
    });

    const matrixAverages: Record<string, { x: number, y: number }> = {};
    Object.entries(matrixSums).forEach(([id, data]) => {
        matrixAverages[id] = { x: data.x / data.count, y: data.y / data.count };
    });

    const pairwiseScores: Record<string, { wins: number, matches: number, score: number }> = {};
    Object.entries(pairwiseStats).forEach(([id, stats]) => {
        pairwiseScores[id] = { 
            wins: stats.wins, 
            matches: stats.matches, 
            score: stats.matches > 0 ? (stats.wins / stats.matches) * 100 : 0 
        };
    });

    if (votes.length === 0) {
        return { winnerId: null, rounds: [], totalVotes: 0, voters: [], usedCodes: [], comments: [], simpleCounts: {}, maybeCounts: {}, matrixAverages: {}, pairwiseScores: {}, votes: [] };
    }

    // Determine Pairwise Winner
    let pairwiseWinnerId: string | null = null;
    let maxPairwiseScore = -1;
    Object.entries(pairwiseScores).forEach(([id, data]) => {
        if (data.score > maxPairwiseScore) {
            maxPairwiseScore = data.score;
            pairwiseWinnerId = id;
        }
    });

    // Instant Runoff Calculation
    const rounds: RoundLog[] = [];
    let remainingVotes = votes.map(v => ({ 
        choices: (v.choices || []).filter((c: string) => !!c)
    }));
    
    let activeOptionIds = new Set<string>();
    votes.forEach(v => (v.choices || []).forEach((c: string) => activeOptionIds.add(c)));
    
    let winnerId: string | null = null;
    let roundNum = 1;

    // Standard RCV Logic
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
            rounds.push({
                roundNumber: roundNum,
                counts: roundCounts,
                eliminatedId: null,
                winnerId: winnerId
            });
            break;
        }
        
        if (activeOptionIds.size <= 1) {
             winnerId = loserId; 
             rounds.push({
                roundNumber: roundNum,
                counts: roundCounts,
                eliminatedId: null,
                winnerId: winnerId
            });
            break;
        }

        activeOptionIds.delete(loserId!);
        
        rounds.push({
            roundNumber: roundNum,
            counts: { ...roundCounts },
            eliminatedId: loserId,
            winnerId: null
        });

        remainingVotes.forEach(vote => {
            vote.choices = vote.choices.filter((id: string) => id !== loserId);
        });

        roundNum++;
        if(roundNum > 20) break;
    }
    
    // Override Winner ID for Pairwise type
    if (Object.keys(pairwiseScores).length > 0) {
        winnerId = pairwiseWinnerId;
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
        matrixAverages,
        pairwiseScores,
        votes: votes 
    };
};
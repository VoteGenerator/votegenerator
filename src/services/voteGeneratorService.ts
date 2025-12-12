import { Poll, RunoffResult, RoundLog, Vote } from '../types';

// --- Local Storage Fallback Helpers ---
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
    pollType: 'ranked' | 'multiple';
    settings: { 
        hideResults: boolean; 
        allowMultiple: boolean;
        requireNames: boolean;
        deadline?: string;
        security: 'browser' | 'code' | 'none';
    };
    voterCount?: number; // Needed if security is 'code'
}): Promise<{ id: string; adminKey: string }> => {
    try {
        // 1. Try actual API
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
        
        // 2. Fallback to LocalStorage (Demo Mode)
        const id = generateId(8);
        const adminKey = generateId(16);
        
        let allowedCodes: string[] = [];
        if (data.settings.security === 'code' && data.voterCount) {
            // Generate unique codes
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

export const getPoll = async (id: string): Promise<Poll> => {
    try {
        const response = await fetch(`/.netlify/functions/get-poll?id=${id}`);
        if (response.ok) return await response.json();
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        const polls = getLocalPolls();
        const poll = polls[id];
        if (!poll) throw new Error('Poll not found');
        // Strip sensitive data for public view (IMPORTANT: don't send allowedCodes to public)
        const { adminKey, votes, allowedCodes, ...publicPoll } = poll;
        // We might want to send a flag saying "requiresCode: true" but the settings.security handles that
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

export const submitVote = async (pollId: string, choices: string[], voterName?: string, code?: string): Promise<void> => {
    try {
        const response = await fetch('/.netlify/functions/submit-vote', {
            method: 'POST',
            body: JSON.stringify({ pollId, choices, voterName, code })
        });
        if (response.ok) return;
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        // Local fallback
        const polls = getLocalPolls();
        const poll = polls[pollId];
        if (!poll) throw new Error('Poll not found');

        // Security Checks
        if (poll.settings.security === 'code') {
            if (!code) throw new Error('Access code required');
            if (!poll.allowedCodes.includes(code)) throw new Error('Invalid access code');
            
            // Check if code used
            const existingVotes = getLocalVotes(pollId);
            const codeUsed = existingVotes.some((v: any) => v.usedCode === code);
            if (codeUsed) throw new Error('This access code has already been used');
        }
        
        saveLocalVote(pollId, { 
            pollId,
            choices, 
            voterName, 
            usedCode: code,
            votedAt: new Date().toISOString() 
        });
        
        // Update vote count
        polls[pollId].voteCount = (polls[pollId].voteCount || 0) + 1;
        saveLocalPoll(polls[pollId]);
        
        // Mark as voted (Local Persistence)
        localStorage.setItem(`${LS_PREFIX}has_voted_${pollId}`, 'true');
        
        await new Promise(resolve => setTimeout(resolve, 600));
    }
};

export const hasVoted = (pollId: string): boolean => {
    // Check local storage flag
    return localStorage.getItem(`${LS_PREFIX}has_voted_${pollId}`) === 'true';
};

// --- Admin Services ---

export const getRawVotes = async (pollId: string, adminKey: string): Promise<Vote[]> => {
    try {
        // Attempt to fetch raw votes from backend
        const response = await fetch(`/.netlify/functions/get-results?id=${pollId}&admin=${adminKey}&raw=true`);
        if(response.ok) {
            return await response.json();
        }
        // If not available or fails, fall through to local
        throw new Error('API_UNAVAILABLE');
    } catch {
        const votes = getLocalVotes(pollId);
        // Ensure data shape matches Vote interface (legacy data migration might be needed in real app)
        return votes.map(v => ({
            pollId: v.pollId || pollId,
            choices: v.choices,
            votedAt: v.votedAt || v.createdAt || new Date().toISOString(),
            voterName: v.voterName,
            usedCode: v.usedCode
        }));
    }
};

// --- RCV Calculation Logic (Client Side for Demo) ---

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

    // Extract voter names if they exist
    const voters = votes.map((v: any) => v.voterName).filter((n: any) => !!n) as string[];
    // Extract used codes
    const usedCodes = votes.map((v: any) => v.usedCode).filter((c: any) => !!c) as string[];
    
    // Calculate simple counts (Frequency of each option selected)
    const simpleCounts: Record<string, number> = {};
    votes.forEach((v: any) => {
        if(Array.isArray(v.choices)) {
            v.choices.forEach((c: string) => {
                if(c) simpleCounts[c] = (simpleCounts[c] || 0) + 1;
            });
        }
    });

    if (votes.length === 0) {
        return { winnerId: null, rounds: [], totalVotes: 0, voters: [], usedCodes: [], simpleCounts: {} };
    }

    // Instant Runoff Calculation
    const rounds: RoundLog[] = [];
    let remainingVotes = votes.map(v => ({ 
        choices: v.choices.filter((c: string) => !!c)
    }));
    
    let activeOptionIds = new Set<string>();
    votes.forEach(v => v.choices.forEach((c: string) => activeOptionIds.add(c)));
    
    let winnerId: string | null = null;
    let roundNum = 1;

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
            if (count > totalActiveVotes / 2) roundWinner = id;
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

    return {
        winnerId,
        rounds,
        totalVotes: votes.length,
        voters,
        usedCodes,
        simpleCounts
    };
};
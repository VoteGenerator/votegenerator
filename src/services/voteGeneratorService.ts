import { Poll, PollOption, RunoffResult, RoundLog, Vote } from '../types';

// --- Local Storage Fallback Helpers ---
// This ensures the app works immediately for the user even without the Netlify Backend running.
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

export const createPoll = async (data: {
    title: string;
    description?: string;
    options: string[];
    pollType: 'ranked' | 'multiple';
    settings: { hideResults: boolean; allowMultiple: boolean };
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
        
        // If 404/500, throw to catch block to trigger fallback
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        console.warn('Backend unavailable, falling back to LocalStorage mode.');
        
        // 2. Fallback to LocalStorage (Demo Mode)
        const id = generateId(8);
        const adminKey = generateId(16);
        const poll = {
            id,
            adminKey,
            ...data,
            options: data.options.map(text => ({ id: generateId(6), text })),
            createdAt: new Date().toISOString(),
            voteCount: 0,
            votes: []
        };
        saveLocalPoll(poll);
        // Simulate network delay
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
        // Strip sensitive data for public view
        const { adminKey, votes, ...publicPoll } = poll;
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

export const submitVote = async (pollId: string, choices: string[]): Promise<void> => {
    try {
        const response = await fetch('/.netlify/functions/submit-vote', {
            method: 'POST',
            body: JSON.stringify({ pollId, choices })
        });
        if (response.ok) return;
        throw new Error('API_UNAVAILABLE');
    } catch (error) {
        // Local fallback
        const polls = getLocalPolls();
        if (!polls[pollId]) throw new Error('Poll not found');
        
        saveLocalVote(pollId, { choices, createdAt: new Date().toISOString() });
        
        // Update vote count on poll object for simpler display logic
        polls[pollId].voteCount = (polls[pollId].voteCount || 0) + 1;
        saveLocalPoll(polls[pollId]);
        
        // Mark as voted in session
        sessionStorage.setItem(`voted_${pollId}`, 'true');
        await new Promise(resolve => setTimeout(resolve, 600));
    }
};

export const hasVoted = (pollId: string): boolean => {
    return sessionStorage.getItem(`voted_${pollId}`) === 'true';
};

// --- RCV Calculation Logic (Client Side for Demo) ---

export const getResults = async (pollId: string, adminKey?: string): Promise<RunoffResult> => {
    // In a real app, the backend calculates this. For this demo, we do it client-side
    // based on the votes we can fetch (or local storage).
    
    let votes: any[] = [];
    
    try {
        // Attempt to fetch raw votes from backend (admin only typically, or public endpoint)
        // For this demo, we'll assume we get raw votes or fallback to local
        const response = await fetch(`/.netlify/functions/get-results?id=${pollId}${adminKey ? `&admin=${adminKey}` : ''}`);
        if(response.ok) {
            votes = await response.json(); // Expecting array of { choices: [] }
        } else {
            throw new Error();
        }
    } catch {
        votes = getLocalVotes(pollId);
    }

    if (votes.length === 0) {
        return { winnerId: null, rounds: [], totalVotes: 0 };
    }

    // Instant Runoff Calculation
    // Votes structure: [{ choices: ['opt1', 'opt2'] }, ...]
    
    const rounds: RoundLog[] = [];
    let remainingVotes = votes.map(v => ({ 
        choices: v.choices.filter((c: string) => !!c) // deep copy & cleanup
    }));
    
    let activeOptionIds = new Set<string>();
    // Collect all unique option IDs mentioned
    votes.forEach(v => v.choices.forEach((c: string) => activeOptionIds.add(c)));
    
    let winnerId: string | null = null;
    let roundNum = 1;

    while (!winnerId && activeOptionIds.size > 0) {
        const roundCounts: Record<string, number> = {};
        
        // Initialize counts
        activeOptionIds.forEach(id => roundCounts[id] = 0);
        
        // Count first preferences
        remainingVotes.forEach(vote => {
            if (vote.choices.length > 0) {
                const firstChoice = vote.choices[0];
                if (activeOptionIds.has(firstChoice)) {
                    roundCounts[firstChoice] = (roundCounts[firstChoice] || 0) + 1;
                }
            }
        });

        const totalActiveVotes = Object.values(roundCounts).reduce((a, b) => a + b, 0);
        
        // Find winner (>50%)
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
        
        // Tie-breaker for loser: naive approach (pick first found)
        // In real RCV, there are specific tie-breaking rules.
        
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
            // Only one left (or 0)
             winnerId = loserId; // technically the last one standing
             rounds.push({
                roundNumber: roundNum,
                counts: roundCounts,
                eliminatedId: null,
                winnerId: winnerId
            });
            break;
        }

        // Eliminate loser
        activeOptionIds.delete(loserId!);
        
        rounds.push({
            roundNumber: roundNum,
            counts: { ...roundCounts },
            eliminatedId: loserId,
            winnerId: null
        });

        // Redistribute votes (remove eliminated ID from all ballots)
        remainingVotes.forEach(vote => {
            vote.choices = vote.choices.filter((id: string) => id !== loserId);
        });

        roundNum++;
        
        // Safety break
        if(roundNum > 20) break;
    }

    return {
        winnerId,
        rounds,
        totalVotes: votes.length
    };
};
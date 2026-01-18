import { Poll, PollSettings, RunoffResult, RoundLog, Vote, StoredVote, Comment } from '../types';

// Anti-bot protection fields
interface AntiBotFields {
    _hp: string;  // Honeypot - should always be empty
    _t: number;   // Page load timestamp
}

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
        const response = await fetch('/.netlify/functions/vg-create', {
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
        const response = await fetch(`/.netlify/functions/vg-get?id=${id}`);
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
        const response = await fetch(`/.netlify/functions/vg-get?id=${id}&admin=${key}`);
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
    ratingVotes?: Record<string, number>,
    surveyAnswers?: Record<string, any>,
    antiBotFields?: AntiBotFields,
    surveyMeta?: { startedAt?: string; completionTime?: number }
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
        ratingVotes,
        surveyAnswers,
        // Survey timing metadata
        ...(surveyMeta && {
            startedAt: surveyMeta.startedAt,
            completionTime: surveyMeta.completionTime
        }),
        // Anti-bot protection fields
        ...(antiBotFields && {
            _hp: antiBotFields._hp,
            _t: antiBotFields._t
        })
    };

    try {
        const response = await fetch('/.netlify/functions/vg-vote', {
            method: 'POST',
            body: JSON.stringify(votePayload)
        });
        if (response.ok) {
            // Mark as voted in localStorage so hasVoted() returns true
            localStorage.setItem(`${LS_PREFIX}has_voted_${pollId}`, 'true');
            return;
        }
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

export const getRawVotes = async (pollId: string, adminKey: string): Promise<any[]> => {
    try {
        const response = await fetch(`/.netlify/functions/vg-results?id=${pollId}&admin=${adminKey}&raw=true`);
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
    try {
        const response = await fetch(`/.netlify/functions/vg-results?id=${pollId}${adminKey ? `&admin=${adminKey}` : ''}`);
        if(response.ok) {
            const data = await response.json();
            // vg-results returns calculated results with votes for admin
            // Transform to match RunoffResult format
            // Ensure all rounds have counts property
            const rounds: RoundLog[] = (data.rounds || []).map((r: any) => ({
                ...r,
                counts: r.counts || r.votes || {}
            }));
            // Ensure all ratingStats have stdDev
            const ratingStats = data.ratingStats?.map((s: any) => ({
                ...s,
                stdDev: s.stdDev ?? 0
            }));
            // Ensure all budgetStats have totalValue and totalQuantity
            const budgetStats = data.budgetStats?.map((s: any) => ({
                ...s,
                totalValue: s.totalValue ?? s.totalSpent ?? 0,
                totalQuantity: s.totalQuantity ?? s.purchaseCount ?? 0
            }));
            // Ensure all pairwiseScores have matches
            const pairwiseScores = data.pairwiseScores?.map((s: any) => ({
                ...s,
                matches: s.matches ?? ((s.wins || 0) + (s.losses || 0))
            }));
            // Ensure all comments have required fields
            const comments: Comment[] = (data.comments || []).map((c: any) => ({
                name: c.name || c.voterName || 'Anonymous',
                voterName: c.name || c.voterName || 'Anonymous',
                text: c.text || c.comment || '',
                date: c.date || c.timestamp || '',
                timestamp: c.timestamp || c.date || ''
            }));
            return {
                winnerId: data.winnerId || data.winner?.id || null,
                rounds,
                totalVotes: data.totalVotes || 0,
                voters: [],
                usedCodes: [],
                comments,
                simpleCounts: data.simpleCounts || (data.standings ? 
                    data.standings.reduce((acc: Record<string, number>, s: any) => {
                        acc[s.optionId] = s.voteCount;
                        return acc;
                    }, {}) : {}),
                maybeCounts: data.maybeCounts || {},
                votes: data.votes || [], // IMPORTANT: Pass votes for Map/Grid/Velocity views
                matrixAverages: data.matrixAverages,
                pairwiseScores,
                ratingStats,
                budgetStats
            };
        }
        throw new Error('API error');
    } catch {
        // Fallback to local votes
        const votes = getLocalVotes(pollId);
        
        if (votes.length === 0) {
            return { winnerId: null, rounds: [], totalVotes: 0, voters: [], usedCodes: [], comments: [], simpleCounts: {}, votes: [] };
        }

        const voters = votes.map((v: any) => v.voterName).filter((n: any) => !!n) as string[];
        const comments: Comment[] = votes
            .filter((v: any) => !!v.comment)
            .map((v: any) => ({
                name: v.voterName || 'Anonymous',
                voterName: v.voterName || 'Anonymous',
                text: v.comment || '',
                date: v.votedAt || '',
                timestamp: v.votedAt || ''
            }));
            
        const usedCodes = votes.map((v: any) => v.usedCode).filter((c: any) => !!c) as string[];
        
        const simpleCounts: Record<string, number> = {};
        votes.forEach((v: any) => {
            if(Array.isArray(v.choices)) {
                v.choices.forEach((c: string) => {
                    if(c) simpleCounts[c] = (simpleCounts[c] || 0) + 1;
                });
            }
        });

        // Simple RCV calculation for local fallback
        let remainingVotes = votes.map(v => ({ 
            choices: (v.choices || []).filter((c: string) => !!c)
        }));
        
        let activeOptionIds = new Set<string>();
        votes.forEach(v => (v.choices || []).forEach((c: string) => activeOptionIds.add(c)));
        
        let winnerId: string | null = null;
        const rounds: RoundLog[] = [];
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
            votes: votes 
        };
    }
};

export const createCustomSlug = async (
    slug: string,
    pollId: string,
    adminKey: string
): Promise<{ success: boolean; shortUrl?: string; error?: string }> => {
    try {
        const response = await fetch('/.netlify/functions/vg-create-slug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, pollId, adminKey })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error };
        }

        return { success: true, shortUrl: data.shortUrl };
    } catch (error) {
        return { success: false, error: 'Failed to create short link' };
    }
};
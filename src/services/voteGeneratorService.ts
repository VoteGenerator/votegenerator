import type { Poll, RunoffResult, AdminPollData } from '../types';

const API_BASE = '/.netlify/functions';

/**
 * Create a new poll
 */
export const createPoll = async (data: { 
    title: string; 
    description?: string; 
    options: string[]; 
    settings: { hideResults: boolean; allowGuestOptions: boolean } 
}): Promise<{ id: string; adminKey: string }> => {
    const res = await fetch(`${API_BASE}/vg-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to create poll');
    }
    
    return res.json();
};

/**
 * Get poll data (public view)
 */
export const getPoll = async (id: string): Promise<Poll> => {
    const res = await fetch(`${API_BASE}/vg-get?id=${encodeURIComponent(id)}`);
    
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Poll not found');
        }
        throw new Error('Failed to fetch poll');
    }
    
    return res.json();
};

/**
 * Get poll data with admin access
 */
export const getPollAsAdmin = async (id: string, adminKey: string): Promise<AdminPollData> => {
    const res = await fetch(
        `${API_BASE}/vg-get?id=${encodeURIComponent(id)}&admin=${encodeURIComponent(adminKey)}`
    );
    
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Poll not found');
        }
        throw new Error('Failed to fetch poll');
    }
    
    return res.json();
};

/**
 * Submit a vote
 */
export const submitVote = async (
    pollId: string, 
    rankedOptionIds: string[]
): Promise<{ success: boolean; voteCount: number }> => {
    const res = await fetch(`${API_BASE}/vg-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, rankedOptionIds })
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to submit vote');
    }
    
    return res.json();
};

/**
 * Get runoff results
 */
export const getResults = async (
    pollId: string, 
    adminKey?: string
): Promise<RunoffResult & { pollId: string }> => {
    let url = `${API_BASE}/vg-results?id=${encodeURIComponent(pollId)}`;
    if (adminKey) {
        url += `&admin=${encodeURIComponent(adminKey)}`;
    }
    
    const res = await fetch(url);
    
    if (!res.ok) {
        if (res.status === 403) {
            throw new Error('Results are hidden by the poll creator');
        }
        throw new Error('Failed to fetch results');
    }
    
    return res.json();
};

/**
 * Check if user has already voted on this poll (client-side only)
 */
export const hasVoted = (pollId: string): boolean => {
    try {
        const voted = localStorage.getItem(`vg_voted_${pollId}`);
        return voted === 'true';
    } catch {
        return false;
    }
};

/**
 * Mark poll as voted (client-side only)
 */
export const markAsVoted = (pollId: string): void => {
    try {
        localStorage.setItem(`vg_voted_${pollId}`, 'true');
    } catch {
        // localStorage might be disabled
    }
};

/**
 * Generate a short shareable URL
 */
export const getShareUrl = (pollId: string, isAdmin: boolean = false, adminKey?: string): string => {
    const base = `${window.location.origin}/vote/${pollId}`;
    if (isAdmin && adminKey) {
        return `${base}?admin=${adminKey}`;
    }
    return base;
};

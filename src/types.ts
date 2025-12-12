export interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
}

export interface PollSettings {
    hideResults: boolean;
    allowMultiple: boolean;
    requireNames: boolean;
    deadline?: string; // ISO Date string
    security: 'browser' | 'none'; // 'browser' = strict local storage check, 'none' = allow multiples
}

export interface Poll {
    id: string;
    adminKey?: string; // Only present if user is admin
    title: string;
    description?: string;
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting';
    options: PollOption[];
    settings: PollSettings;
    createdAt: string;
    voteCount: number;
    isAdmin?: boolean;
}

export interface Vote {
    pollId: string;
    choices: string[]; 
    votedAt: string;
    voterName?: string;
}

export interface RoundLog {
    roundNumber: number;
    counts: Record<string, number>; // OptionID -> count
    eliminatedId: string | null;
    winnerId: string | null;
}

export interface RunoffResult {
    winnerId: string | null;
    rounds: RoundLog[];
    totalVotes: number;
    voters?: string[]; // List of names if available
}
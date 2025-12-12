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
    security: 'browser' | 'code' | 'none'; // Added 'code'
}

export interface Poll {
    id: string;
    adminKey?: string; // Only present if user is admin
    title: string;
    description?: string;
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting';
    options: PollOption[];
    settings: PollSettings;
    allowedCodes?: string[]; // List of valid codes if security is 'code'
    createdAt: string;
    voteCount: number;
    isAdmin?: boolean;
}

export interface Vote {
    pollId: string;
    choices: string[]; 
    votedAt: string;
    voterName?: string;
    usedCode?: string; // The code used to cast this vote
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
    usedCodes?: string[]; // List of codes that have already voted
}
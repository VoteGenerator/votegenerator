
export interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
}

export interface PollSettings {
    hideResults: boolean;
    allowMultiple: boolean;
    requireNames: boolean;
    allowComments?: boolean; 
    publicComments?: boolean; // New: Controls if voters can see comments
    blockVpn?: boolean;
    deadline?: string; // ISO Date string
    maxVotes?: number; // Auto-close trigger
    security: 'browser' | 'code' | 'none';
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
    comment?: string;
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
    comments?: { name: string; text: string; date: string }[]; 
    simpleCounts?: Record<string, number>; // Flat counts for multiple choice or first round
    votes: Vote[]; // The raw votes for the grid view
}

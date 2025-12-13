
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
    publicComments?: boolean;
    blockVpn?: boolean;
    deadline?: string;
    maxVotes?: number;
    security: 'browser' | 'code' | 'none';
    dotBudget?: number;
    timezone?: string; // For meeting polls
}

export interface Poll {
    id: string;
    adminKey?: string;
    title: string;
    description?: string;
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting' | 'dot' | 'matrix';
    options: PollOption[];
    settings: PollSettings;
    allowedCodes?: string[];
    createdAt: string;
    voteCount: number;
    isAdmin?: boolean;
}

export interface Vote {
    pollId: string;
    choices: string[]; // Yes votes
    choicesMaybe?: string[]; // Maybe votes (for meetings)
    matrixVotes?: Record<string, { x: number, y: number }>; // Matrix coordinates (0-100)
    votedAt: string;
    voterName?: string;
    usedCode?: string;
    comment?: string;
}

export interface RoundLog {
    roundNumber: number;
    counts: Record<string, number>;
    eliminatedId: string | null;
    winnerId: string | null;
}

export interface RunoffResult {
    winnerId: string | null;
    rounds: RoundLog[];
    totalVotes: number;
    voters?: string[];
    usedCodes?: string[];
    comments?: { name: string; text: string; date: string }[]; 
    simpleCounts?: Record<string, number>; // Yes counts
    maybeCounts?: Record<string, number>; // Maybe counts
    matrixAverages?: Record<string, { x: number, y: number }>; // Average coordinates
    votes: Vote[];
}
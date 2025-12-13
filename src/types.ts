
export interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
    cost?: number;
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
    budgetLimit?: number;
    timezone?: string; // For meeting polls
}

export interface Poll {
    id: string;
    adminKey?: string;
    title: string;
    description?: string;
    pollType: 'ranked' | 'multiple' | 'image' | 'meeting' | 'dot' | 'matrix' | 'pairwise' | 'rating' | 'budget';
    options: PollOption[];
    settings: PollSettings;
    allowedCodes?: string[];
    createdAt: string;
    voteCount: number;
    isAdmin?: boolean;
}

export interface Vote {
    pollId: string;
    choices: string[]; // Yes votes or Budget Items (repeated for quantity)
    choicesMaybe?: string[]; // Maybe votes (for meetings)
    matrixVotes?: Record<string, { x: number, y: number }>; // Matrix coordinates (0-100)
    pairwiseVotes?: { winnerId: string; loserId: string }[]; // Array of pair outcomes
    ratingVotes?: Record<string, number>; // Rating values (0-100)
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
    simpleCounts?: Record<string, number>; // Yes counts / Budget quantities
    maybeCounts?: Record<string, number>; // Maybe counts
    matrixAverages?: Record<string, { x: number, y: number }>; // Average coordinates
    pairwiseScores?: Record<string, { wins: number; matches: number; score: number }>; // Win stats
    ratingStats?: Record<string, { average: number; stdDev: number; count: number }>; // Rating stats
    budgetStats?: Record<string, { totalValue: number; totalQuantity: number }>; // Budget stats
    votes: Vote[];
}
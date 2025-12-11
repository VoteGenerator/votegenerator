// Poll Types
export interface PollOption {
    id: string;
    text: string;
}

export interface PollSettings {
    hideResults: boolean;
    allowGuestOptions: boolean;
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    options: PollOption[];
    settings: PollSettings;
    createdAt: string;
    voteCount: number;
}

// Vote Types
export interface Vote {
    odiv: string;
    rankedOptionIds: string[]; // Index 0 = 1st choice
    timestamp: string;
}

// Runoff Visualization Types
export interface RunoffRound {
    roundNumber: number;
    standings: RoundStanding[];
    eliminated?: string; // Option ID that was eliminated
    redistributedVotes?: VoteRedistribution[];
    isComplete: boolean;
    winnerId?: string;
}

export interface RoundStanding {
    optionId: string;
    optionText: string;
    voteCount: number;
    percentage: number;
    isEliminated: boolean;
    isWinner: boolean;
}

export interface VoteRedistribution {
    fromOptionId: string;
    toOptionId: string;
    count: number;
}

export interface RunoffResult {
    rounds: RunoffRound[];
    winner: PollOption;
    totalVotes: number;
}

// Admin Types
export interface AdminPollData extends Poll {
    adminKey: string;
    votes: Vote[];
    runoffResult?: RunoffResult;
}

// Component Props
export interface VoteGeneratorResultsProps {
    poll: Poll;
    runoffResult: RunoffResult;
    isAdmin?: boolean;
}

export interface VoteGeneratorAdminProps {
    poll: AdminPollData;
    onRefresh: () => void;
}

export interface VoteGeneratorConfirmationProps {
    poll: Poll;
    canSeeResults: boolean;
    onViewResults?: () => void;
}

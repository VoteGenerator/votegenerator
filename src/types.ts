// Poll and voting types for VoteGenerator
// This file must match all properties used across components and services

export interface PollOption {
    id: string;
    text: string;
    cost?: number;
    imageUrl?: string;
}

export interface PollSettings {
    hideResults: boolean;
    allowMultiple: boolean;
    requireNames?: boolean;
    security?: 'none' | 'code' | 'ip' | 'fingerprint' | 'pin';
    allowComments?: boolean;
    publicComments?: boolean;
    deadline?: string;
    unlisted?: boolean;
    // Voting limits
    maxVotes?: number;
    // Timezone
    timezone?: string;
    // Security
    blockVpn?: boolean;
    // Dot voting
    dotBudget?: number;
    // Budget voting
    budgetLimit?: number;
}

export interface EmailEntry {
    email: string;
    verified: boolean;
    addedAt?: string;
    verifiedAt?: string;
    lastSentAt?: string;
}

export interface NotificationSettings {
    enabled: boolean;
    emails: EmailEntry[];
    skipFirstVotes: number;
    notifyOn: {
        milestones: boolean;
        dailyDigest: boolean;
        pollClosed: boolean;
        limitReached: boolean;
        newComment: boolean;
    };
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    pollType: string;
    options: PollOption[];
    settings: PollSettings;
    createdAt: string;
    voteCount: number;
    isAdmin?: boolean;
    adminKey?: string;
    
    // Tier and premium features
    tier?: 'free' | 'starter' | 'pro_event' | 'unlimited';
    maxResponses?: number;
    expiresAt?: string;
    
    // Status (draft/live mode)
    status?: 'draft' | 'live' | 'paused' | 'closed';
    wentLiveAt?: string;
    closedAt?: string;
    
    // Branding
    logoUrl?: string | null;
    customSlug?: string | null;
    
    // Notifications (Unlimited tier)
    notificationSettings?: NotificationSettings;
    
    // Visual polls
    imageUrls?: string[];
    
    // Meeting polls
    dateOptions?: string[];
    
    // Access codes
    accessCodes?: string[];
    allowedCodes?: string[];
    
    // Theme
    theme?: string;
    buttonText?: string;
    
    // Response count
    responseCount?: number;
}

export interface Vote {
    id: string;
    timestamp: string;
    voterName?: string;
    selectedOptionIds?: string[];
    rankedOptionIds?: string[];
    comment?: string;
    usedCode?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
    analytics?: {
        device: 'mobile' | 'desktop' | 'tablet' | 'unknown';
        country?: string;
        region?: string;
        referrerDomain?: string;
        utmSource?: string;
        timestamp: string;
    };
}

export interface RoundLog {
    round: number;
    votes: Record<string, number>;
    counts?: Record<string, number>;
    eliminated?: string;
    eliminatedId?: string;
    winner?: string;
}

export interface SimpleCounts {
    [optionId: string]: number;
}

export interface MaybeCounts {
    [optionId: string]: number;
}

export interface Comment {
    id?: string;
    text: string;
    voterName?: string;
    timestamp: string;
}

export interface MatrixAverage {
    optionId: string;
    x: number;
    y: number;
    count: number;
}

export interface PairwiseScore {
    optionId: string;
    wins: number;
    losses: number;
    score: number;
}

export interface RatingStat {
    optionId: string;
    optionText?: string;
    average: number;
    min: number;
    max: number;
    count: number;
    distribution?: Record<number, number>;
}

export interface BudgetStat {
    optionId: string;
    optionText?: string;
    totalSpent: number;
    purchaseCount: number;
    averageSpent: number;
}

export interface RunoffResult {
    rounds: RoundLog[];
    winner?: string;
    winnerId?: string;
    totalVotes: number;
    results?: Array<{
        optionId: string;
        optionText: string;
        votes: number;
        percentage: number;
    }>;
    // Extended result types
    simpleCounts?: SimpleCounts;
    maybeCounts?: MaybeCounts;
    comments?: Comment[];
    matrixAverages?: MatrixAverage[];
    pairwiseScores?: PairwiseScore[];
    ratingStats?: RatingStat[];
    budgetStats?: BudgetStat[];
    // Meeting poll specific
    dateVotes?: Record<string, { yes: number; maybe: number; no: number }>;
    // Dot voting specific
    dotTotals?: Record<string, number>;
}

export interface AnalyticsData {
    tier: string;
    totalVotes: number;
    firstVote?: string;
    lastVote?: string;
    durationHours?: number;
    durationDays?: number;
    peakHour?: number;
    peakHourFormatted?: string;
    peakHourVotes?: number;
    dailyTrend?: Record<string, number>;
    dailyAverage?: number;
    hourlyDistribution?: Record<number, number>;
    hourlyDistributionFormatted?: Array<{ 
        hour: number; 
        hourFormatted: string; 
        votes: number; 
        percentage: number 
    }>;
    velocityTrend?: 'increasing' | 'decreasing' | 'stable';
    dayOfWeekDistribution?: Record<string, number>;
    mostActiveDay?: { day: string; votes: number };
    utmSources?: Record<string, number>;
    deviceBreakdown?: Record<string, number>;
    countryStats?: {
        topCountries: Array<{ country: string; votes: number; percentage: number }>;
        countriesRepresented: number;
        privacyNote: string;
    };
    privacyInfo?: {
        dataCollected: string[];
        dataNotCollected: string[];
        retentionPeriod: string;
    };
    includedFeatures?: {
        included: string[];
        notIncluded: string[];
    };
}

// Local storage vote record
export interface StoredVote {
    pollId: string;
    choices: string[];
    votedAt: string;
    voterName?: string;
    usedCode?: string;
    comment?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
}
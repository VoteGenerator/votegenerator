// ============================================================================
// Types - VoteGenerator Complete Type Definitions
// Location: src/types.ts
// ============================================================================

// ============================================================================
// POLL TYPES
// ============================================================================

export type PollType = 
    | 'poll' 
    | 'survey' 
    | 'meeting'
    | 'multiple_choice'
    | 'ranked'
    | 'ranked_choice'
    | 'approval'
    | 'dot_voting'
    | 'quadratic'
    | 'budget'
    | 'matrix'
    | 'pairwise'
    | 'rating';

export interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
    votes?: number;
    cost?: number;
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    question?: string;
    type?: PollType;
    pollType?: string;
    options?: PollOption[];
    createdAt: string;
    expiresAt?: string;
    settings?: PollSettings;
    
    // Survey-specific
    isSurvey?: boolean;
    sections?: SurveySection[];
    surveySettings?: SurveySettings;
    
    // Meeting-specific
    meetingDates?: MeetingDate[];
    meetingSettings?: MeetingSettings;
    meetingDuration?: number;
    
    // Status
    status?: 'draft' | 'live' | 'paused' | 'closed';
    totalVotes?: number;
    voteCount?: number;
    
    // Admin
    adminKey?: string;
    adminToken?: string;
    creatorEmail?: string;
    isAdmin?: boolean;
    
    // Tier & limits
    tier?: 'free' | 'pro' | 'business' | 'starter' | 'unlimited';
    maxResponses?: number;
    
    // Security
    pin?: string;
    allowedCodes?: string[];
    usedCodes?: string[];
    
    // Customization
    theme?: string;
    logoUrl?: string;
    buttonText?: string;
    
    // Votes storage
    votes?: StoredVote[];
    
    // Notifications
    notificationSettings?: NotificationSettings;
    
    // Analytics
    blockedVotes?: {
        honeypot: number;
        timing: number;
        rateLimit: number;
        total: number;
        lastBlocked?: string;
    };
}

// ============================================================================
// POLL SETTINGS
// ============================================================================

export interface PollSettings {
    allowMultiple?: boolean;
    hideResults?: boolean;
    requireEmail?: boolean;
    allowComments?: boolean;
    closedMessage?: string;
    maxVotesPerOption?: number;
    
    // Voting restrictions
    ipRestriction?: boolean;
    cookieRestriction?: boolean;
    
    // Display
    randomizeOptions?: boolean;
    showVoteCount?: boolean;
    
    // Deadline
    deadline?: string;
    timezone?: string;
    
    // Security
    security?: 'none' | 'browser' | 'pin' | 'code';
    requireNames?: boolean;
    blockVpn?: boolean;
    
    // Limits
    maxVotes?: number;
    
    // Anonymous mode
    anonymousMode?: boolean;
    
    // Comments
    publicComments?: boolean;
    
    // Dot voting / Budget
    dotBudget?: number;
    budgetLimit?: number;
}

// ============================================================================
// SURVEY TYPES
// ============================================================================

export type QuestionType = 
    | 'multiple_choice'
    | 'dropdown'
    | 'yes_no'
    | 'rating'
    | 'scale'
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'phone'
    | 'date'
    | 'time'
    | 'datetime'
    | 'ranking'
    | 'matrix';

export interface QuestionOption {
    id: string;
    text: string;
    imageUrl?: string;
}

export interface SurveyQuestion {
    id: string;
    type: QuestionType;
    question: string;
    description?: string;
    required?: boolean;
    
    // For choice questions
    options?: QuestionOption[];
    allowMultiple?: boolean;
    allowOther?: boolean;
    
    // For scale/number questions
    min?: number;
    max?: number;
    minValue?: number;
    maxValue?: number;
    minLabel?: string;
    maxLabel?: string;
    step?: number;
    unit?: string;
    
    // For text questions
    placeholder?: string;
    maxLength?: number;
    
    // For matrix questions - can be string[] or {id, text}[]
    rows?: Array<string | { id: string; text: string }>;
    columns?: Array<string | { id: string; text: string }>;
    
    // Conditional logic
    showIf?: {
        questionId: string;
        condition: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
        value: string | number;
    };
}

export interface SurveySection {
    id: string;
    title: string;
    description?: string;
    questions: SurveyQuestion[];
}

export interface SurveySettings {
    allowBack?: boolean;
    showProgress?: boolean;
    showSummary?: boolean;
    completionMessage?: string;
    redirectUrl?: string;
    anonymousMode?: boolean;
}

// ============================================================================
// SURVEY RESPONSE TYPES
// ============================================================================

export interface SurveyAnswer {
    questionId?: string;
    questionType?: QuestionType;
    // For choice questions
    selectedIds?: string[];
    // For text questions
    text?: string;
    // For numeric questions
    number?: number;
    // For date/time questions
    date?: string;
    time?: string;
    // For ranking questions
    ranking?: string[];
    // For matrix questions
    matrix?: Record<string, string>;
}

export interface SurveyResponse {
    id: string;
    pollId: string;
    respondentId?: string;
    voterName?: string;
    answers: Record<string, SurveyAnswer>;
    startedAt?: string;
    completedAt?: string;
    completionTime?: number; // in seconds
    isComplete: boolean;
    
    // Metadata
    ipAddress?: string;
    userAgent?: string;
    country?: string;
}

// ============================================================================
// MEETING TYPES
// ============================================================================

export interface MeetingDate {
    id: string;
    date: string;
    startTime?: string;
    endTime?: string;
}

export interface MeetingSettings {
    allowMaybe?: boolean;
    limitPerSlot?: number;
    requireName?: boolean;
    requireEmail?: boolean;
    showParticipants?: boolean;
}

export interface MeetingResponse {
    id: string;
    name: string;
    email?: string;
    availability: Record<string, 'yes' | 'no' | 'maybe'>;
    submittedAt: string;
}

// ============================================================================
// VOTE TYPES
// ============================================================================

export interface Vote {
    id: string;
    pollId: string;
    optionId: string;
    createdAt: string;
    voterToken?: string;
    ipAddress?: string;
}

export interface StoredVote {
    id: string;
    timestamp: string;
    selectedOptionIds?: string[];
    rankedOptionIds?: string[];
    voterName?: string;
    usedCode?: string;
    comment?: string;
    choicesMaybe?: string[];
    matrixVotes?: Record<string, { x: number; y: number }>;
    pairwiseVotes?: { winnerId: string; loserId: string }[];
    ratingVotes?: Record<string, number>;
    surveyAnswers?: Record<string, any>;
    analytics?: VoteAnalytics;
}

export interface VoteAnalytics {
    device: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    country?: string;
    region?: string;
    referrerDomain?: string;
    utmSource?: string;
    timestamp: string;
}

export interface Comment {
    id: string;
    text: string;
    voterName?: string;
    timestamp: string;
}

// ============================================================================
// RUNOFF / RANKED CHOICE TYPES
// ============================================================================

export interface RunoffResult {
    winner: string | null;
    rounds: RoundLog[];
    eliminated: string[];
    finalVotes: Record<string, number>;
}

export interface RoundLog {
    round: number;
    votes: Record<string, number>;
    eliminated?: string;
    redistributed?: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface NotificationSettings {
    enabled: boolean;
    emails: Array<{
        email: string;
        verified: boolean;
        addedAt?: string;
        verifiedAt?: string;
    }>;
    skipFirstVotes: number;
    notifyOn: {
        milestones: boolean;
        dailyDigest: boolean;
        pollClosed: boolean;
        limitReached: boolean;
        newComment: boolean;
    };
}

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
    id: string;
    email: string;
    name?: string;
    plan: 'free' | 'pro' | 'business';
    createdAt: string;
    pollsCreated?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
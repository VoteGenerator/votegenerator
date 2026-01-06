// ============================================================================
// Types - VoteGenerator Type Definitions
// Location: src/types.ts
// ============================================================================

// ============================================================================
// POLL TYPES
// ============================================================================

export type PollType = 'poll' | 'survey' | 'meeting';

export interface PollOption {
    id: string;
    text: string;
    imageUrl?: string;
    votes?: number;
}

export interface Poll {
    id: string;
    question: string;
    type: PollType;
    options?: PollOption[];
    createdAt: string;
    expiresAt?: string;
    settings?: PollSettings;
    
    // Survey-specific
    sections?: SurveySection[];
    surveySettings?: SurveySettings;
    
    // Meeting-specific
    meetingDates?: MeetingDate[];
    meetingSettings?: MeetingSettings;
    
    // Status
    status?: 'draft' | 'live' | 'closed';
    totalVotes?: number;
    
    // Admin
    adminToken?: string;
    creatorEmail?: string;
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
    
    // For text questions
    placeholder?: string;
    maxLength?: number;
    
    // For matrix questions
    rows?: string[];
    columns?: string[];
    
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
    
    // Anonymous Mode - NEW
    // When enabled:
    // - Admin cannot see individual responses
    // - Admin only sees aggregated data
    // - Text responses are shuffled in display
    // - Respondents see "Your response is anonymous" badge
    anonymousMode?: boolean;
}

// ============================================================================
// SURVEY RESPONSE TYPES
// ============================================================================

export interface SurveyAnswer {
    questionId?: string;
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
    answers: Record<string, SurveyAnswer>;
    startedAt?: string;
    completedAt?: string;
    completionTime?: number; // in seconds
    isComplete: boolean;
    
    // Metadata (hidden in anonymous mode)
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
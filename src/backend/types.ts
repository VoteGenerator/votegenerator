// ============================================================================
// VoteGenerator - Core Type Definitions
// Future-proof voting system with support for all 12 poll types
// ============================================================================

// ----------------------------------------------------------------------------
// Poll Types
// ----------------------------------------------------------------------------

export type PollType = 
  | 'multiple-choice'
  | 'ranked-choice'
  | 'meeting-poll'
  | 'this-or-that'
  | 'dot-voting'
  | 'rating-scale'
  | 'buy-a-feature'
  | 'priority-matrix'
  | 'approval-voting'
  | 'quiz-poll'
  | 'sentiment-check'
  | 'visual-poll';

export type PlanTier = 'free' | 'quick' | 'event' | 'pro' | 'pro_plus';

export type ResultVisibility = 'always' | 'after_vote' | 'after_close' | 'admin_only';

export type DeviceType = 'mobile' | 'desktop' | 'tablet' | 'unknown';

// ----------------------------------------------------------------------------
// Poll Option Types (varies by poll type)
// ----------------------------------------------------------------------------

export interface BaseOption {
  id: string;
  order: number;
}

export interface TextOption extends BaseOption {
  text: string;
}

export interface ImageOption extends BaseOption {
  text: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface DateOption extends BaseOption {
  date: string; // ISO date
  startTime?: string; // HH:MM
  endTime?: string;
}

export interface QuizOption extends BaseOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface SentimentOption extends BaseOption {
  emoji: string;
  label: string;
}

export interface MatrixOption extends BaseOption {
  text: string;
  // Position will be set by voters
}

export type PollOption = 
  | TextOption 
  | ImageOption 
  | DateOption 
  | QuizOption 
  | SentimentOption
  | MatrixOption;

// ----------------------------------------------------------------------------
// Poll Settings (varies by poll type)
// ----------------------------------------------------------------------------

export interface BaseSettings {
  showResults: ResultVisibility;
  allowComments: boolean;
  anonymousVoting: boolean;
}

export interface MultipleChoiceSettings extends BaseSettings {
  allowMultiple: boolean;
  maxSelections?: number;
}

export interface RankedChoiceSettings extends BaseSettings {
  minRankings?: number;
  maxRankings?: number;
  algorithm: 'instant-runoff' | 'borda-count' | 'simple-average';
}

export interface MeetingPollSettings extends BaseSettings {
  timezone: string;
  allowMaybe: boolean;
}

export interface DotVotingSettings extends BaseSettings {
  totalPoints: number;
  maxPointsPerOption?: number;
}

export interface RatingScaleSettings extends BaseSettings {
  minRating: number;
  maxRating: number;
  showLabels: boolean;
  lowLabel?: string;
  highLabel?: string;
}

export interface BuyAFeatureSettings extends BaseSettings {
  totalBudget: number;
  currency: string;
}

export interface PriorityMatrixSettings extends BaseSettings {
  xAxisLabel: string; // e.g., "Effort"
  yAxisLabel: string; // e.g., "Impact"
  xAxisLow: string;   // e.g., "Low Effort"
  xAxisHigh: string;  // e.g., "High Effort"
  yAxisLow: string;   // e.g., "Low Impact"
  yAxisHigh: string;  // e.g., "High Impact"
}

export interface QuizPollSettings extends BaseSettings {
  showCorrectAfterVote: boolean;
  showExplanations: boolean;
  trackScores: boolean;
}

export interface SentimentSettings extends BaseSettings {
  showPercentages: boolean;
}

export type PollSettings = 
  | MultipleChoiceSettings
  | RankedChoiceSettings
  | MeetingPollSettings
  | DotVotingSettings
  | RatingScaleSettings
  | BuyAFeatureSettings
  | PriorityMatrixSettings
  | QuizPollSettings
  | SentimentSettings
  | BaseSettings;

// ----------------------------------------------------------------------------
// Poll Theme & Branding
// ----------------------------------------------------------------------------

export interface PollTheme {
  preset: string; // 'classic', 'ocean', 'sunset', etc.
  customColor?: string; // Hex color
  customGradient?: string;
}

export interface PollBranding {
  showAds: boolean;
  showPoweredBy: boolean;
  logoUrl?: string;
  thankYouMessage?: string;
  thankYouPageHtml?: string;
  thankYouRedirectUrl?: string;
  customCss?: string;
}

// ----------------------------------------------------------------------------
// Vote Protection
// ----------------------------------------------------------------------------

export interface VoteProtection {
  // Browser-based (cookie)
  browserProtection: boolean;
  
  // IP-based (Pro+)
  ipProtection: boolean;
  
  // Unique codes (Pro+)
  uniqueCodes: {
    enabled: boolean;
    codes: string[];
    usedCodes: string[];
  };
  
  // CAPTCHA (future)
  captcha?: {
    enabled: boolean;
    provider: 'recaptcha' | 'hcaptcha' | 'turnstile';
    siteKey?: string;
  };
}

// ----------------------------------------------------------------------------
// Plan & Limits
// ----------------------------------------------------------------------------

export interface PollPlan {
  tier: PlanTier;
  
  // For one-time purchases
  purchaseId?: string;
  purchaseDate?: string;
  
  // For subscriptions
  subscriptionId?: string;
  
  // Limits
  maxResponses: number;
  expiresAt?: string; // ISO date
  
  // Features enabled
  features: {
    removeAds: boolean;
    removeBranding: boolean;
    customLogo: boolean;
    exportCsv: boolean;
    exportExcel: boolean;
    exportPdf: boolean;
    voteTimestamps: boolean;
    voteTrends: boolean;
    deviceBreakdown: boolean;
    voterComments: boolean;
    ipProtection: boolean;
    uniqueCodes: boolean;
    customShortLink: boolean;
    whiteLabel: boolean;
    thankYouRedirect: boolean;
  };
}

// ----------------------------------------------------------------------------
// Main Poll Object
// ----------------------------------------------------------------------------

export interface Poll {
  // Identifiers
  id: string;
  shortCode?: string; // Custom short link for Pro+
  adminToken: string; // Hashed token for admin access
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  
  // Core Content
  type: PollType;
  question: string;
  description?: string;
  options: PollOption[];
  
  // Configuration
  settings: PollSettings;
  theme: PollTheme;
  branding: PollBranding;
  protection: VoteProtection;
  plan: PollPlan;
  
  // Ownership (for dashboard)
  ownerId?: string;
  
  // Analytics
  viewCount: number;
  shareCount: number;
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

// ----------------------------------------------------------------------------
// Vote Types (varies by poll type)
// ----------------------------------------------------------------------------

export interface BaseVote {
  id: string;
  pollId: string;
  timestamp: string;
  
  // Protection tracking (hashed)
  browserHash?: string;
  ipHash?: string;
  codeUsed?: string;
  
  // Analytics
  device: DeviceType;
  userAgent?: string;
  referrer?: string;
  
  // Optional comment
  comment?: string;
}

export interface MultipleChoiceVote extends BaseVote {
  type: 'multiple-choice' | 'this-or-that' | 'approval-voting';
  selectedOptions: string[]; // Option IDs
}

export interface RankedVote extends BaseVote {
  type: 'ranked-choice';
  rankings: string[]; // Option IDs in order of preference
}

export interface MeetingVote extends BaseVote {
  type: 'meeting-poll';
  availability: Record<string, 'yes' | 'no' | 'maybe'>; // optionId -> response
}

export interface DotVote extends BaseVote {
  type: 'dot-voting' | 'buy-a-feature';
  allocations: Record<string, number>; // optionId -> points/budget
}

export interface RatingVote extends BaseVote {
  type: 'rating-scale';
  ratings: Record<string, number>; // optionId -> rating
}

export interface MatrixVote extends BaseVote {
  type: 'priority-matrix';
  positions: Record<string, { x: number; y: number }>; // optionId -> position (0-100)
}

export interface QuizVote extends BaseVote {
  type: 'quiz-poll';
  answers: Record<string, string>; // questionId -> selectedOptionId
  score?: number;
}

export interface SentimentVote extends BaseVote {
  type: 'sentiment-check';
  sentiment: string; // Emoji or sentiment ID
}

export interface VisualVote extends BaseVote {
  type: 'visual-poll';
  selectedOptions: string[]; // Option IDs
}

export type Vote = 
  | MultipleChoiceVote
  | RankedVote
  | MeetingVote
  | DotVote
  | RatingVote
  | MatrixVote
  | QuizVote
  | SentimentVote
  | VisualVote;

// ----------------------------------------------------------------------------
// Vote Aggregate (stored per poll - for performance)
// ----------------------------------------------------------------------------

export interface VoteAggregate {
  pollId: string;
  lastUpdated: string;
  totalVotes: number;
  
  // Quick summary for display
  summary: {
    // For multiple choice / approval / this-or-that / visual / sentiment
    counts?: Record<string, number>;
    
    // For ranked choice
    rankings?: {
      algorithm: string;
      rounds?: RankedChoiceRound[];
      winner?: string;
      finalRankings: Array<{ optionId: string; score: number }>;
    };
    
    // For meeting poll
    availability?: Record<string, { yes: number; no: number; maybe: number }>;
    bestOption?: string;
    
    // For dot voting / buy a feature
    allocations?: Record<string, number>;
    totalAllocated?: number;
    
    // For rating scale
    ratings?: Record<string, { sum: number; count: number; average: number }>;
    overallAverage?: number;
    
    // For priority matrix
    positions?: Record<string, { avgX: number; avgY: number; votes: number }>;
    
    // For quiz
    correctCounts?: Record<string, number>;
    averageScore?: number;
    highScore?: number;
  };
  
  // Detailed votes (for exports and analytics)
  votes: Vote[];
  
  // Comments (separate for easy access)
  comments: Array<{
    voteId: string;
    text: string;
    timestamp: string;
  }>;
  
  // Analytics data
  analytics: {
    // Votes over time (hourly buckets)
    timeline: Array<{
      hour: string; // ISO hour
      count: number;
    }>;
    
    // Device breakdown
    devices: {
      mobile: number;
      desktop: number;
      tablet: number;
      unknown: number;
    };
    
    // Referrers
    referrers: Record<string, number>;
  };
  
  // Protection tracking
  protection: {
    browserHashes: string[];
    ipHashes: string[];
    usedCodes: string[];
  };
}

// For ranked choice calculation
export interface RankedChoiceRound {
  round: number;
  counts: Record<string, number>;
  eliminated?: string;
  winner?: string;
}

// ----------------------------------------------------------------------------
// User Dashboard (Pro/Pro+)
// ----------------------------------------------------------------------------

export interface UserDashboard {
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Profile (from Stripe)
  email?: string;
  name?: string;
  
  // Subscription
  subscription: {
    tier: 'pro' | 'pro_plus';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };
  
  // Owned polls
  pollIds: string[];
  
  // Usage stats
  usage: {
    totalPolls: number;
    totalVotes: number;
    thisMonth: {
      polls: number;
      votes: number;
    };
  };
  
  // Settings
  settings: {
    defaultTheme?: string;
    defaultBranding?: Partial<PollBranding>;
    notifications?: {
      email: boolean;
      voteAlerts: boolean;
      weeklyDigest: boolean;
    };
  };
}

// ----------------------------------------------------------------------------
// One-Time Purchases
// ----------------------------------------------------------------------------

export interface OneTimePurchase {
  id: string;
  createdAt: string;
  
  // Stripe
  stripePaymentId: string;
  stripeCustomerId?: string;
  
  // Plan
  tier: 'quick' | 'event';
  amount: number;
  currency: string;
  
  // Associated poll
  pollId?: string;
  
  // Status
  status: 'pending' | 'completed' | 'refunded' | 'expired';
  usedAt?: string;
  expiresAt?: string;
}

// ----------------------------------------------------------------------------
// API Request/Response Types
// ----------------------------------------------------------------------------

export interface CreatePollRequest {
  type: PollType;
  question: string;
  description?: string;
  options: Array<{
    text: string;
    imageUrl?: string;
    date?: string;
    isCorrect?: boolean;
    emoji?: string;
  }>;
  settings?: Partial<PollSettings>;
  theme?: Partial<PollTheme>;
  branding?: Partial<PollBranding>;
  
  // For paid polls
  purchaseId?: string;
  
  // For dashboard users
  ownerId?: string;
}

export interface SubmitVoteRequest {
  pollId: string;
  
  // Vote data (depends on poll type)
  selectedOptions?: string[];
  rankings?: string[];
  availability?: Record<string, 'yes' | 'no' | 'maybe'>;
  allocations?: Record<string, number>;
  ratings?: Record<string, number>;
  positions?: Record<string, { x: number; y: number }>;
  answers?: Record<string, string>;
  sentiment?: string;
  
  // Optional
  comment?: string;
  
  // Protection
  browserHash?: string;
  uniqueCode?: string;
}

export interface PollResults {
  pollId: string;
  question: string;
  type: PollType;
  totalVotes: number;
  status: 'active' | 'closed';
  
  // Summary data (varies by type)
  results: VoteAggregate['summary'];
  
  // Only for admin
  analytics?: VoteAggregate['analytics'];
  votes?: Vote[];
  comments?: VoteAggregate['comments'];
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// ----------------------------------------------------------------------------
// Plan Limits Configuration
// ----------------------------------------------------------------------------

export const PLAN_LIMITS: Record<PlanTier, {
  maxResponses: number;
  durationDays: number | null; // null = forever
  pollTypes: PollType[];
  features: PollPlan['features'];
}> = {
  free: {
    maxResponses: 100,
    durationDays: null,
    pollTypes: [
      'multiple-choice', 'ranked-choice', 'meeting-poll', 'this-or-that',
      'dot-voting', 'rating-scale', 'buy-a-feature', 'priority-matrix', 'approval-voting'
    ],
    features: {
      removeAds: false,
      removeBranding: false,
      customLogo: false,
      exportCsv: false,
      exportExcel: false,
      exportPdf: false,
      voteTimestamps: false,
      voteTrends: false,
      deviceBreakdown: false,
      voterComments: false,
      ipProtection: false,
      uniqueCodes: false,
      customShortLink: false,
      whiteLabel: false,
      thankYouRedirect: false,
    }
  },
  quick: {
    maxResponses: 500,
    durationDays: 7,
    pollTypes: [
      'multiple-choice', 'ranked-choice', 'meeting-poll', 'this-or-that',
      'dot-voting', 'rating-scale', 'buy-a-feature', 'priority-matrix', 'approval-voting'
    ],
    features: {
      removeAds: true,
      removeBranding: true,
      customLogo: false,
      exportCsv: true,
      exportExcel: true,
      exportPdf: true,
      voteTimestamps: false,
      voteTrends: false,
      deviceBreakdown: false,
      voterComments: false,
      ipProtection: false,
      uniqueCodes: false,
      customShortLink: false,
      whiteLabel: false,
      thankYouRedirect: false,
    }
  },
  event: {
    maxResponses: 2000,
    durationDays: 30,
    pollTypes: [
      'multiple-choice', 'ranked-choice', 'meeting-poll', 'this-or-that',
      'dot-voting', 'rating-scale', 'buy-a-feature', 'priority-matrix', 'approval-voting',
      'quiz-poll', 'sentiment-check'
    ],
    features: {
      removeAds: true,
      removeBranding: true,
      customLogo: true,
      exportCsv: true,
      exportExcel: true,
      exportPdf: true,
      voteTimestamps: false,
      voteTrends: false,
      deviceBreakdown: false,
      voterComments: true,
      ipProtection: false,
      uniqueCodes: false,
      customShortLink: false,
      whiteLabel: false,
      thankYouRedirect: false,
    }
  },
  pro: {
    maxResponses: 10000,
    durationDays: null,
    pollTypes: [
      'multiple-choice', 'ranked-choice', 'meeting-poll', 'this-or-that',
      'dot-voting', 'rating-scale', 'buy-a-feature', 'priority-matrix', 'approval-voting',
      'quiz-poll', 'sentiment-check'
    ],
    features: {
      removeAds: true,
      removeBranding: true,
      customLogo: true,
      exportCsv: true,
      exportExcel: true,
      exportPdf: true,
      voteTimestamps: true,
      voteTrends: true,
      deviceBreakdown: false,
      voterComments: true,
      ipProtection: true,
      uniqueCodes: false,
      customShortLink: false,
      whiteLabel: false,
      thankYouRedirect: false,
    }
  },
  pro_plus: {
    maxResponses: 50000,
    durationDays: null,
    pollTypes: [
      'multiple-choice', 'ranked-choice', 'meeting-poll', 'this-or-that',
      'dot-voting', 'rating-scale', 'buy-a-feature', 'priority-matrix', 'approval-voting',
      'quiz-poll', 'sentiment-check', 'visual-poll'
    ],
    features: {
      removeAds: true,
      removeBranding: true,
      customLogo: true,
      exportCsv: true,
      exportExcel: true,
      exportPdf: true,
      voteTimestamps: true,
      voteTrends: true,
      deviceBreakdown: true,
      voterComments: true,
      ipProtection: true,
      uniqueCodes: true,
      customShortLink: true,
      whiteLabel: true,
      thankYouRedirect: true,
    }
  }
};
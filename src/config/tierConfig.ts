// ============================================================================
// VoteGenerator - Tier Configuration
// Location: src/config/tierConfig.ts
// 
// PRICING (USD):
// - Free: $0
// - Pro: $19/month or $190/year
// - Business: $49/month or $490/year
// ============================================================================

export type TierType = 'free' | 'pro' | 'business';

export interface TierConfig {
  id: TierType;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  limits: {
    responses: number;           // Shared pool for polls + surveys
    polls: number | 'unlimited';
    // Survey-specific limits
    surveyQuestions: number;
    surveySections: number;
  };
  features: {
    // Poll Types
    allPollTypes: boolean;
    visualPoll: boolean;
    
    // Export
    exportCsv: boolean;
    exportPdf: boolean;
    exportPng: boolean;
    
    // Branding
    customShortLink: boolean;
    removeBranding: boolean;
    
    // Analytics
    deviceBreakdown: boolean;
    geoBreakdown: boolean;
    fullAnalytics: boolean;
    
    // Security
    passwordProtection: boolean;
    accessCodes: boolean;
    sharedPin: boolean;
    
    // Admin
    duplicatePoll: boolean;
    schedulePoll: boolean;
    
    // Notifications
    emailNotifications: boolean;
    realTimeAlerts: boolean;
    
    // Survey-specific
    surveyIndividualResponses: boolean;
    surveyAllTextResponses: boolean;
    surveySkipLogic: boolean;
    surveyAnonymousMode: boolean;   // FREE for all tiers
    surveyNpsCalculation: boolean;  // FREE for all tiers
  };
  badge?: {
    text: string;
    colors: string;
  };
}

export const TIERS: Record<TierType, TierConfig> = {
  // =========================================================================
  // FREE TIER - $0
  // =========================================================================
  free: {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: {
      responses: 100,
      polls: 3,
      surveyQuestions: 10,
      surveySections: 3,
    },
    features: {
      allPollTypes: true,
      visualPoll: false,
      exportCsv: false,
      exportPdf: false,
      exportPng: false,
      customShortLink: false,
      removeBranding: false,
      deviceBreakdown: false,
      geoBreakdown: false,
      fullAnalytics: false,
      passwordProtection: false,
      accessCodes: false,
      sharedPin: false,
      duplicatePoll: false,
      schedulePoll: false,
      emailNotifications: false,
      realTimeAlerts: false,
      // Survey features
      surveyIndividualResponses: false,
      surveyAllTextResponses: false,
      surveySkipLogic: false,
      surveyAnonymousMode: true,     // FREE - encourages honest feedback
      surveyNpsCalculation: true,    // FREE - standard HR metric
    },
  },

  // =========================================================================
  // PRO TIER - $19/month or $190/year
  // =========================================================================
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 190,
    limits: {
      responses: 10000,
      polls: 25,
      surveyQuestions: 25,
      surveySections: 10,
    },
    features: {
      allPollTypes: true,
      visualPoll: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      customShortLink: false,        // Business only
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      fullAnalytics: true,
      passwordProtection: true,
      accessCodes: true,
      sharedPin: true,
      duplicatePoll: true,
      schedulePoll: true,
      emailNotifications: true,
      realTimeAlerts: true,
      // Survey features
      surveyIndividualResponses: true,
      surveyAllTextResponses: true,
      surveySkipLogic: true,
      surveyAnonymousMode: true,
      surveyNpsCalculation: true,
    },
    badge: {
      text: 'PRO',
      colors: 'bg-purple-500 text-white',
    },
  },

  // =========================================================================
  // BUSINESS TIER - $49/month or $490/year
  // =========================================================================
  business: {
    id: 'business',
    name: 'Business',
    monthlyPrice: 49,
    yearlyPrice: 490,
    limits: {
      responses: 100000,
      polls: 'unlimited',
      surveyQuestions: Infinity,
      surveySections: Infinity,
    },
    features: {
      allPollTypes: true,
      visualPoll: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      customShortLink: true,         // Business only
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      fullAnalytics: true,
      passwordProtection: true,
      accessCodes: true,
      sharedPin: true,
      duplicatePoll: true,
      schedulePoll: true,
      emailNotifications: true,
      realTimeAlerts: true,
      // Survey features
      surveyIndividualResponses: true,
      surveyAllTextResponses: true,
      surveySkipLogic: true,
      surveyAnonymousMode: true,
      surveyNpsCalculation: true,
    },
    badge: {
      text: 'BUSINESS',
      colors: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    },
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

// Get tier config by ID
export function getTierConfig(tierType: TierType | string): TierConfig {
  return TIERS[tierType as TierType] || TIERS.free;
}

// Check if tier has a specific feature
export function tierHasFeature(tier: TierType | string, feature: keyof TierConfig['features']): boolean {
  const config = getTierConfig(tier);
  return config.features[feature];
}

// Format price for display
export function formatPrice(tier: TierType | string, period: 'monthly' | 'yearly' = 'monthly'): string {
  const config = getTierConfig(tier);
  const price = period === 'monthly' ? config.monthlyPrice : config.yearlyPrice;
  
  if (price === 0) return 'Free';
  return `$${price}`;
}

// Get survey limits for a tier
export function getSurveyLimits(tier: TierType | string): { 
  questions: number; 
  sections: number; 
  responses: number;
} {
  const config = getTierConfig(tier);
  return {
    questions: config.limits.surveyQuestions,
    sections: config.limits.surveySections,
    responses: config.limits.responses,
  };
}

// Check if user can create survey with given counts
export function canCreateSurvey(
  tier: TierType | string, 
  questionCount: number, 
  sectionCount: number
): { allowed: boolean; reason?: string } {
  const limits = getSurveyLimits(tier);
  
  if (questionCount > limits.questions) {
    return { 
      allowed: false, 
      reason: `Maximum ${limits.questions} questions on ${getTierConfig(tier).name} plan` 
    };
  }
  
  if (sectionCount > limits.sections) {
    return { 
      allowed: false, 
      reason: `Maximum ${limits.sections} sections on ${getTierConfig(tier).name} plan` 
    };
  }
  
  return { allowed: true };
}

// Response limit warnings
export function getResponseWarning(
  currentCount: number, 
  limit: number
): { level: 'none' | 'warning' | 'critical' | 'full'; message: string } {
  const percentage = (currentCount / limit) * 100;
  
  if (percentage >= 100) {
    return { level: 'full', message: 'Response limit reached.' };
  }
  if (percentage >= 90) {
    return { level: 'critical', message: `Almost full! ${currentCount}/${limit} responses.` };
  }
  if (percentage >= 75) {
    return { level: 'warning', message: `${currentCount}/${limit} responses used.` };
  }
  return { level: 'none', message: '' };
}

// ============================================================================
// Poll Types Configuration
// ============================================================================

export interface PollTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  requiredTier: TierType;
  hidden: boolean;
}

export const POLL_TYPES: PollTypeConfig[] = [
  {
    id: 'multiple',
    name: 'Multiple Choice',
    description: 'Classic poll - pick one or more options',
    icon: 'CheckSquare',
    gradient: 'from-blue-500 to-indigo-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'ranked',
    name: 'Ranked Choice',
    description: 'Drag to rank options in order',
    icon: 'ListOrdered',
    gradient: 'from-indigo-500 to-purple-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'pairwise',
    name: 'This or That',
    description: 'Quick A vs B comparisons',
    icon: 'GitCompare',
    gradient: 'from-orange-500 to-red-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'meeting',
    name: 'Meeting Poll',
    description: 'Find the best time for everyone',
    icon: 'Calendar',
    gradient: 'from-amber-500 to-orange-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'rating',
    name: 'Rating Scale',
    description: 'Rate each option on a scale',
    icon: 'SlidersHorizontal',
    gradient: 'from-cyan-500 to-blue-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'rsvp',
    name: 'RSVP',
    description: 'Collect event attendance',
    icon: 'Users',
    gradient: 'from-sky-500 to-blue-500',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'image',
    name: 'Visual Poll',
    description: 'Vote on images in a grid',
    icon: 'Image',
    gradient: 'from-pink-500 to-rose-500',
    requiredTier: 'pro',
    hidden: false,
  },
  {
    id: 'survey',
    name: 'Multi-Question Survey',
    description: 'Full surveys with sections & question types',
    icon: 'FileText',
    gradient: 'from-emerald-500 to-teal-500',
    requiredTier: 'free',
    hidden: false,
  },
];

// Get visible poll types
export function getVisiblePollTypes(): PollTypeConfig[] {
  return POLL_TYPES.filter(pt => !pt.hidden);
}

// Get poll type by ID
export function getPollTypeConfig(id: string): PollTypeConfig | undefined {
  return POLL_TYPES.find(pt => pt.id === id);
}

// Check if poll type available for tier
export function isPollTypeAvailable(pollTypeId: string, tierType: TierType): boolean {
  const pollType = getPollTypeConfig(pollTypeId);
  if (!pollType) return false;
  
  const tierOrder: TierType[] = ['free', 'pro', 'business'];
  const requiredIndex = tierOrder.indexOf(pollType.requiredTier);
  const currentIndex = tierOrder.indexOf(tierType);
  
  return currentIndex >= requiredIndex;
}
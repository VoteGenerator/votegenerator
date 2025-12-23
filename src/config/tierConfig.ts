// ============================================================================
// VoteGenerator - Tier & Poll Type Configuration
// Centralized configuration for pricing tiers and poll types
// Multi-currency support: USD, CAD, EUR, GBP, AUD
// ============================================================================

// ============================================================================
// Currency Types
// ============================================================================

export type Currency = 'usd' | 'cad' | 'eur' | 'gbp' | 'aud';

export const CURRENCIES: Record<Currency, { symbol: string; name: string }> = {
  usd: { symbol: '$', name: 'US Dollar' },
  cad: { symbol: 'CA$', name: 'Canadian Dollar' },
  eur: { symbol: '€', name: 'Euro' },
  gbp: { symbol: '£', name: 'British Pound' },
  aud: { symbol: 'A$', name: 'Australian Dollar' },
};

// ============================================================================
// Tier Definitions
// ============================================================================

export type TierType = 'free' | 'starter' | 'pro_event' | 'unlimited';

export interface TierConfig {
  id: TierType;
  name: string;
  prices: Record<Currency, number>;
  priceType: 'free' | 'one-time' | 'yearly';
  limits: {
    responses: number;
    durationDays: number;
    polls: number | 'unlimited';
    dataRetentionDays: number;
  };
  features: {
    // Poll Types
    visualPoll: boolean;
    
    // Export
    exportCsv: boolean;
    exportPdf: boolean;
    exportPng: boolean;
    
    // Branding
    customShortLink: boolean;
    removeBranding: boolean;
    uploadLogo: boolean;
    
    // Analytics
    deviceBreakdown: boolean;
    geoBreakdown: boolean;
    
    // Admin
    duplicatePoll: boolean;
    passwordProtection: boolean;
    schedulePoll: boolean;
    shareDashboard: boolean;
    accessCodes: boolean;
    
    // Notifications
    emailNotifications: boolean;
    prioritySupport: boolean;
  };
  badge?: {
    text: string;
    colors: string;
  };
  stripeLookupKeys: Record<Currency, string>;
}

export const TIERS: Record<TierType, TierConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    prices: { usd: 0, cad: 0, eur: 0, gbp: 0, aud: 0 },
    priceType: 'free',
    limits: {
      responses: 50,
      durationDays: 7,
      polls: 1,
      dataRetentionDays: 30,
    },
    features: {
      visualPoll: false,
      exportCsv: false,
      exportPdf: false,
      exportPng: false,
      customShortLink: false,
      removeBranding: false,
      uploadLogo: false,
      deviceBreakdown: false,
      geoBreakdown: false,
      duplicatePoll: false,
      passwordProtection: false,
      schedulePoll: false,
      shareDashboard: false,
      accessCodes: false,
      emailNotifications: false,
      prioritySupport: false,
    },
    stripeLookupKeys: { usd: '', cad: '', eur: '', gbp: '', aud: '' },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    prices: { usd: 9.99, cad: 13.99, eur: 9.49, gbp: 7.99, aud: 15.99 },
    priceType: 'one-time',
    limits: {
      responses: 500,
      durationDays: 30,
      polls: 1,
      dataRetentionDays: 90,
    },
    features: {
      visualPoll: false,
      exportCsv: true,
      exportPdf: false,
      exportPng: false,
      customShortLink: false,
      removeBranding: false,
      uploadLogo: false,
      deviceBreakdown: true,
      geoBreakdown: true,
      duplicatePoll: true,
      passwordProtection: false,
      schedulePoll: false,
      shareDashboard: false,
      accessCodes: false,
      emailNotifications: false,
      prioritySupport: false,
    },
    badge: {
      text: 'STARTER',
      colors: 'bg-blue-500 text-white',
    },
    stripeLookupKeys: {
      usd: 'vg_starter_usd',
      cad: 'vg_starter_cad',
      eur: 'vg_starter_eur',
      gbp: 'vg_starter_gbp',
      aud: 'vg_starter_aud',
    },
  },
  pro_event: {
    id: 'pro_event',
    name: 'Pro Event',
    prices: { usd: 19.99, cad: 27.99, eur: 18.99, gbp: 15.99, aud: 31.99 },
    priceType: 'one-time',
    limits: {
      responses: 2000,
      durationDays: 60,
      polls: 1,
      dataRetentionDays: 365,
    },
    features: {
      visualPoll: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      customShortLink: true,
      removeBranding: true,
      uploadLogo: false,
      deviceBreakdown: true,
      geoBreakdown: true,
      duplicatePoll: true,
      passwordProtection: true,
      schedulePoll: true,
      shareDashboard: true,
      accessCodes: false,
      emailNotifications: false,
      prioritySupport: false,
    },
    badge: {
      text: 'PRO',
      colors: 'bg-purple-500 text-white',
    },
    stripeLookupKeys: {
      usd: 'vg_pro_event_usd',
      cad: 'vg_pro_event_cad',
      eur: 'vg_pro_event_eur',
      gbp: 'vg_pro_event_gbp',
      aud: 'vg_pro_event_aud',
    },
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    prices: { usd: 199, cad: 279, eur: 189, gbp: 159, aud: 319 },
    priceType: 'yearly',
    limits: {
      responses: 5000,
      durationDays: 365,
      polls: 'unlimited',
      dataRetentionDays: 730,
    },
    features: {
      visualPoll: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      customShortLink: true,
      removeBranding: true,
      uploadLogo: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      duplicatePoll: true,
      passwordProtection: true,
      schedulePoll: true,
      shareDashboard: true,
      accessCodes: true,
      emailNotifications: true,
      prioritySupport: true,
    },
    badge: {
      text: 'UNLIMITED',
      colors: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    },
    stripeLookupKeys: {
      usd: 'vg_unlimited_usd',
      cad: 'vg_unlimited_cad',
      eur: 'vg_unlimited_eur',
      gbp: 'vg_unlimited_gbp',
      aud: 'vg_unlimited_aud',
    },
  },
};

// Helper to get tier by poll's stored tier value
export function getTierConfig(tierType: TierType | string): TierConfig {
  return TIERS[tierType as TierType] || TIERS.free;
}

// Check if a tier has a specific feature
export function tierHasFeature(tier: TierType | string, feature: keyof TierConfig['features']): boolean {
  const config = getTierConfig(tier);
  return config.features[feature];
}

// Format price with currency symbol
export function formatPrice(tier: TierType | string, currency: Currency = 'usd'): string {
  const config = getTierConfig(tier);
  const price = config.prices[currency];
  const symbol = CURRENCIES[currency].symbol;
  
  if (price === 0) return 'Free';
  
  // Format with proper decimal places
  if (Number.isInteger(price)) {
    return `${symbol}${price}`;
  }
  return `${symbol}${price.toFixed(2)}`;
}

// ============================================================================
// Poll Types Configuration
// ============================================================================

export interface PollTypeConfig {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  icon: string; // Icon name from lucide-react
  useCases: string[];
  example: string;
  gradient: string;
  selectedBorder: string;
  selectedBg: string;
  iconColor: string;
  textColor: string;
  requiredTier: TierType; // Minimum tier required
  hidden: boolean; // Hide from UI (for future features)
}

// Poll types - 7 active, rest hidden for future
export const POLL_TYPES: PollTypeConfig[] = [
  // ===== ACTIVE POLL TYPES (7) =====
  {
    id: 'multiple',
    name: 'Multiple Choice',
    description: 'Classic poll - pick one or more options',
    tooltip: 'The most common poll type. Voters simply click their favorite option(s). Great for quick decisions where you need a clear winner.',
    icon: 'CheckSquare',
    useCases: ['Team votes', 'Event planning', 'Quick surveys', 'Preference checks'],
    example: '"What should we order for the office party?"',
    gradient: 'from-blue-500 to-indigo-500',
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-700',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'ranked',
    name: 'Ranked Choice',
    description: 'Drag to rank options in order',
    tooltip: 'Voters rank all options from favorite to least favorite. Prevents ties and shows true preferences. Used in elections worldwide!',
    icon: 'ListOrdered',
    useCases: ['Group decisions', 'Avoiding ties', 'Fair voting', 'Priority lists'],
    example: '"Where should we go for the team retreat?"',
    gradient: 'from-indigo-500 to-purple-500',
    selectedBorder: 'border-indigo-500',
    selectedBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    iconColor: 'text-indigo-600',
    textColor: 'text-indigo-700',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'pairwise',
    name: 'This or That',
    description: 'Quick A vs B comparisons',
    tooltip: 'Shows two options at a time - voters pick their favorite. Great when you have many options and want quick, gut-reaction feedback.',
    icon: 'GitCompare',
    useCases: ['Large option lists', 'Quick decisions', 'Bracket-style voting', 'Preference testing'],
    example: '"Which slogan resonates more?"',
    gradient: 'from-orange-500 to-red-500',
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-gradient-to-br from-orange-50 to-red-50',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-700',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'meeting',
    name: 'Meeting Poll',
    description: 'Find the best time for everyone',
    tooltip: "Like Doodle but simpler! Add date/time options and everyone marks when they're available. No more endless email chains to schedule meetings.",
    icon: 'Calendar',
    useCases: ['Meeting scheduling', 'Event planning', 'Group availability', 'Party planning'],
    example: '"When can everyone meet next week?"',
    gradient: 'from-amber-500 to-orange-500',
    selectedBorder: 'border-amber-500',
    selectedBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-800',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'rating',
    name: 'Rating Scale',
    description: 'Rate each option on a scale',
    tooltip: 'Voters rate every option from 1-5 stars or 0-100. Perfect for feedback and sentiment - see exactly how people feel about each choice.',
    icon: 'SlidersHorizontal',
    useCases: ['Product feedback', 'Employee surveys', 'Customer satisfaction', 'Feature ratings'],
    example: '"Rate these new feature ideas"',
    gradient: 'from-cyan-500 to-blue-500',
    selectedBorder: 'border-cyan-500',
    selectedBg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    iconColor: 'text-cyan-600',
    textColor: 'text-cyan-700',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'rsvp',
    name: 'RSVP',
    description: 'Collect event attendance',
    tooltip: "Simple Yes/No/Maybe responses for event attendance. See who's coming at a glance with automatic headcounts.",
    icon: 'Users',
    useCases: ['Party invites', 'Team events', 'Workshops', 'Social gatherings'],
    example: '"Can you make it to the holiday party?"',
    gradient: 'from-sky-500 to-blue-500',
    selectedBorder: 'border-sky-500',
    selectedBg: 'bg-gradient-to-br from-sky-50 to-blue-50',
    iconColor: 'text-sky-600',
    textColor: 'text-sky-700',
    requiredTier: 'free',
    hidden: false,
  },
  {
    id: 'image',
    name: 'Visual Poll',
    description: 'Vote on images in a beautiful grid',
    tooltip: "Upload images and let people vote visually. Perfect when you're choosing between designs, photos, or anything visual. Instagram-style layout!",
    icon: 'Image',
    useCases: ['Logo selection', 'Design contests', 'Photo competitions', 'Product choices'],
    example: '"Which logo design should we use?"',
    gradient: 'from-pink-500 to-rose-500',
    selectedBorder: 'border-pink-500',
    selectedBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    iconColor: 'text-pink-600',
    textColor: 'text-pink-700',
    requiredTier: 'pro_event', // Requires Pro Event or Unlimited
    hidden: false,
  },
  
  // ===== HIDDEN POLL TYPES (for future) =====
  {
    id: 'dot',
    name: 'Dot Voting',
    description: 'Distribute points across options',
    tooltip: 'Each voter gets a budget of "dots" (points) to spend however they want. Can put all dots on one option or spread them out.',
    icon: 'Coins',
    useCases: ['Budget allocation', 'Feature prioritization', 'Resource planning', 'Weighted voting'],
    example: '"How should we allocate the Q4 budget?"',
    gradient: 'from-emerald-500 to-teal-500',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-700',
    requiredTier: 'starter',
    hidden: true, // HIDDEN
  },
  {
    id: 'budget',
    name: 'Buy a Feature',
    description: 'Spend virtual money on options',
    tooltip: 'Each option has a "price" and voters get a budget to spend. Forces trade-offs!',
    icon: 'DollarSign',
    useCases: ['Product roadmaps', 'Feature prioritization', 'Customer research', 'Trade-off decisions'],
    example: '"Which features should we build? (Budget: $100)"',
    gradient: 'from-green-500 to-emerald-500',
    selectedBorder: 'border-green-500',
    selectedBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconColor: 'text-green-600',
    textColor: 'text-green-700',
    requiredTier: 'starter',
    hidden: true, // HIDDEN
  },
  {
    id: 'matrix',
    name: 'Priority Matrix',
    description: 'Plot options on Impact vs Effort',
    tooltip: 'Drag items onto a 2x2 grid (like Impact vs Effort). Perfect for teams doing sprint planning.',
    icon: 'LayoutGrid',
    useCases: ['Sprint planning', 'Project prioritization', 'Strategic planning', 'Agile teams'],
    example: '"Where do these tasks fall on our priority matrix?"',
    gradient: 'from-fuchsia-500 to-purple-500',
    selectedBorder: 'border-fuchsia-500',
    selectedBg: 'bg-gradient-to-br from-fuchsia-50 to-purple-50',
    iconColor: 'text-fuchsia-600',
    textColor: 'text-fuchsia-800',
    requiredTier: 'starter',
    hidden: true, // HIDDEN
  },
  {
    id: 'approval',
    name: 'Approval Voting',
    description: 'Thumbs up/down for each option',
    tooltip: 'Voters can approve as many options as they want. Simple yes/no for each choice.',
    icon: 'ThumbsUp',
    useCases: ['Committee decisions', 'Finding consensus', 'Board votes', 'Group approval'],
    example: '"Which candidates do you approve of?"',
    gradient: 'from-violet-500 to-indigo-500',
    selectedBorder: 'border-violet-500',
    selectedBg: 'bg-gradient-to-br from-violet-50 to-indigo-50',
    iconColor: 'text-violet-600',
    textColor: 'text-violet-700',
    requiredTier: 'starter',
    hidden: true, // HIDDEN
  },
  {
    id: 'quiz',
    name: 'Quiz Poll',
    description: 'Poll with a correct answer',
    tooltip: 'Like a poll but with a right answer! Great for trivia, knowledge checks, or guessing games.',
    icon: 'Zap',
    useCases: ['Trivia games', 'Knowledge tests', 'Training quizzes', 'Guessing games'],
    example: '"What year was the company founded?"',
    gradient: 'from-yellow-500 to-amber-500',
    selectedBorder: 'border-yellow-500',
    selectedBg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-700',
    requiredTier: 'pro_event',
    hidden: true, // HIDDEN
  },
  {
    id: 'nps',
    name: 'NPS Score',
    description: 'Net Promoter Score survey',
    tooltip: 'The classic "How likely are you to recommend?" 0-10 scale.',
    icon: 'TrendingUp',
    useCases: ['Customer feedback', 'Employee satisfaction', 'Product reviews', 'Service ratings'],
    example: '"How likely are you to recommend us to a friend?"',
    gradient: 'from-lime-500 to-green-500',
    selectedBorder: 'border-lime-500',
    selectedBg: 'bg-gradient-to-br from-lime-50 to-green-50',
    iconColor: 'text-lime-600',
    textColor: 'text-lime-700',
    requiredTier: 'pro_event',
    hidden: true, // HIDDEN
  },
  {
    id: 'sentiment',
    name: 'Sentiment Check',
    description: 'Quick mood/opinion gauge',
    tooltip: 'Simple emoji-based reactions (😀 😐 😞). Perfect for quick pulse checks.',
    icon: 'Smile',
    useCases: ['Team morale', 'Quick feedback', 'Meeting check-ins', 'Idea validation'],
    example: '"How do you feel about the new policy?"',
    gradient: 'from-rose-500 to-pink-500',
    selectedBorder: 'border-rose-500',
    selectedBg: 'bg-gradient-to-br from-rose-50 to-pink-50',
    iconColor: 'text-rose-600',
    textColor: 'text-rose-700',
    requiredTier: 'pro_event',
    hidden: true, // HIDDEN
  },
  {
    id: 'wordcloud',
    name: 'Word Cloud',
    description: 'Open-ended text responses',
    tooltip: 'Collect free-form text answers and see them visualized as a beautiful word cloud.',
    icon: 'Cloud',
    useCases: ['Brainstorming', 'Feedback collection', 'Idea generation', 'Open questions'],
    example: '"What words describe our company culture?"',
    gradient: 'from-purple-500 to-violet-500',
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-700',
    requiredTier: 'unlimited',
    hidden: true, // HIDDEN
  },
  {
    id: 'qna',
    name: 'Q&A / Upvote',
    description: 'Submit and upvote questions',
    tooltip: 'Audience submits questions, others upvote the best ones. Perfect for Q&A sessions.',
    icon: 'MessageCircle',
    useCases: ['Q&A sessions', 'Town halls', 'AMAs', 'Conference Q&A'],
    example: '"What questions do you have for leadership?"',
    gradient: 'from-teal-500 to-cyan-500',
    selectedBorder: 'border-teal-500',
    selectedBg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    iconColor: 'text-teal-600',
    textColor: 'text-teal-700',
    requiredTier: 'unlimited',
    hidden: true, // HIDDEN
  },
];

// Get visible poll types only
export function getVisiblePollTypes(): PollTypeConfig[] {
  return POLL_TYPES.filter(pt => !pt.hidden);
}

// Get poll type by ID
export function getPollTypeConfig(id: string): PollTypeConfig | undefined {
  return POLL_TYPES.find(pt => pt.id === id);
}

// Check if poll type is available for a given tier
export function isPollTypeAvailable(pollTypeId: string, tierType: TierType): boolean {
  const pollType = getPollTypeConfig(pollTypeId);
  if (!pollType) return false;
  
  const tierOrder: TierType[] = ['free', 'starter', 'pro_event', 'unlimited'];
  const requiredIndex = tierOrder.indexOf(pollType.requiredTier);
  const currentIndex = tierOrder.indexOf(tierType);
  
  return currentIndex >= requiredIndex;
}

// ============================================================================
// Stripe Configuration
// ============================================================================

export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
  pro_event: process.env.STRIPE_PRICE_PRO_EVENT || 'price_pro_event_placeholder',
  unlimited: process.env.STRIPE_PRICE_UNLIMITED || 'price_unlimited_placeholder',
};

// ============================================================================
// Response Limit Warnings
// ============================================================================

export function getResponseWarning(currentCount: number, limit: number): { level: 'none' | 'warning' | 'critical' | 'full'; message: string } {
  const percentage = (currentCount / limit) * 100;
  
  if (percentage >= 100) {
    return { level: 'full', message: 'Response limit reached. Poll closed.' };
  }
  if (percentage >= 90) {
    return { level: 'critical', message: `Almost full! ${currentCount}/${limit} responses.` };
  }
  if (percentage >= 80) {
    return { level: 'warning', message: `Getting close! ${currentCount}/${limit} responses.` };
  }
  return { level: 'none', message: '' };
}
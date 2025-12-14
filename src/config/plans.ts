/**
 * VoteGenerator Plan Configuration
 * 
 * IMPORTANT: This is the single source of truth for all plan limits.
 * When you want to change limits (e.g., free tier from 100 to 1000 votes),
 * change it HERE and it will update everywhere.
 * 
 * Usage:
 * import { PLANS, getPlanLimits, isPremiumFeature } from '../config/plans';
 */

// ===========================================
// PLAN TIERS
// ===========================================

export type PlanTier = 'free' | 'one-time' | 'pro' | 'pro-plus';

export interface PlanLimits {
    // Core limits
    maxResponsesPerPoll: number | 'unlimited';
    maxPollsPerMonth: number | 'unlimited';
    premiumDurationDays: number | 'unlimited';
    
    // Features
    removeAds: boolean;
    removeBranding: boolean;
    customLogo: boolean;
    customShortLinks: boolean;
    exportCsv: boolean;
    exportExcel: boolean;
    exportPdf: boolean;
    voterComments: boolean;
    uniqueVotingCodes: boolean;
    visualPoll: boolean;
    
    // Analytics
    basicAnalytics: boolean;
    voteTimeline: boolean;
    peakHourAnalytics: boolean;
    dailyTrends: boolean;
    hourlyDistribution: boolean;
    velocityTracking: boolean;
    utmTracking: boolean;
    countryStats: boolean;
    
    // Admin
    shareAdminAccess: boolean;
    viewOnlyLinks: boolean;
    namedAdminTokens: boolean;
    maxAdminTokens: number;
    
    // Embeds
    embedType: 'branded' | 'with-logo' | 'white-label';
    
    // Support
    emailSupport: boolean;
    prioritySupport: boolean;
}

// ===========================================
// PLAN DEFINITIONS
// ===========================================

export const PLANS: Record<PlanTier, PlanLimits> = {
    free: {
        // Core - CHANGE THESE VALUES TO UPDATE FREE LIMITS
        maxResponsesPerPoll: 100,  // ← Change to 1000 if you want more
        maxPollsPerMonth: 'unlimited',
        premiumDurationDays: 0,
        
        // Features
        removeAds: false,
        removeBranding: false,
        customLogo: false,
        customShortLinks: false,
        exportCsv: false,
        exportExcel: false,
        exportPdf: false,
        voterComments: false,
        uniqueVotingCodes: false,
        visualPoll: false,
        
        // Analytics
        basicAnalytics: true,
        voteTimeline: false,
        peakHourAnalytics: false,
        dailyTrends: false,
        hourlyDistribution: false,
        velocityTracking: false,
        utmTracking: false,
        countryStats: false,
        
        // Admin
        shareAdminAccess: true,
        viewOnlyLinks: false,
        namedAdminTokens: false,
        maxAdminTokens: 1,
        
        // Embeds
        embedType: 'branded',
        
        // Support
        emailSupport: false,
        prioritySupport: false,
    },
    
    'one-time': {
        // Core
        maxResponsesPerPoll: 'unlimited',
        maxPollsPerMonth: 'unlimited',
        premiumDurationDays: 30,
        
        // Features
        removeAds: true,
        removeBranding: true,
        customLogo: true,
        customShortLinks: true,
        exportCsv: true,
        exportExcel: true,
        exportPdf: true,
        voterComments: true,
        uniqueVotingCodes: false,
        visualPoll: false,
        
        // Analytics
        basicAnalytics: true,
        voteTimeline: true,
        peakHourAnalytics: true,
        dailyTrends: true,
        hourlyDistribution: false,
        velocityTracking: false,
        utmTracking: false,
        countryStats: false,
        
        // Admin
        shareAdminAccess: true,
        viewOnlyLinks: true,
        namedAdminTokens: false,
        maxAdminTokens: 3,
        
        // Embeds
        embedType: 'with-logo',
        
        // Support
        emailSupport: false,
        prioritySupport: false,
    },
    
    pro: {
        // Core
        maxResponsesPerPoll: 'unlimited',
        maxPollsPerMonth: 'unlimited',
        premiumDurationDays: 'unlimited',
        
        // Features
        removeAds: true,
        removeBranding: true,
        customLogo: true,
        customShortLinks: true,
        exportCsv: true,
        exportExcel: true,
        exportPdf: true,
        voterComments: true,
        uniqueVotingCodes: true,
        visualPoll: true,
        
        // Analytics
        basicAnalytics: true,
        voteTimeline: true,
        peakHourAnalytics: true,
        dailyTrends: true,
        hourlyDistribution: false,
        velocityTracking: false,
        utmTracking: false,
        countryStats: false,
        
        // Admin
        shareAdminAccess: true,
        viewOnlyLinks: true,
        namedAdminTokens: false,
        maxAdminTokens: 5,
        
        // Embeds
        embedType: 'with-logo',
        
        // Support
        emailSupport: true,
        prioritySupport: false,
    },
    
    'pro-plus': {
        // Core
        maxResponsesPerPoll: 'unlimited',
        maxPollsPerMonth: 'unlimited',
        premiumDurationDays: 'unlimited',
        
        // Features
        removeAds: true,
        removeBranding: true,
        customLogo: true,
        customShortLinks: true,
        exportCsv: true,
        exportExcel: true,
        exportPdf: true,
        voterComments: true,
        uniqueVotingCodes: true,
        visualPoll: true,
        
        // Analytics
        basicAnalytics: true,
        voteTimeline: true,
        peakHourAnalytics: true,
        dailyTrends: true,
        hourlyDistribution: true,
        velocityTracking: true,
        utmTracking: true,
        countryStats: true,
        
        // Admin
        shareAdminAccess: true,
        viewOnlyLinks: true,
        namedAdminTokens: true,
        maxAdminTokens: 10,
        
        // Embeds
        embedType: 'white-label',
        
        // Support
        emailSupport: true,
        prioritySupport: true,
    },
};

// ===========================================
// PRICING (in USD)
// ===========================================

export interface PlanPricing {
    monthly: number;
    yearly: number;
    oneTime?: number;
    savings?: string;
}

export const PRICING: Record<PlanTier, PlanPricing> = {
    free: {
        monthly: 0,
        yearly: 0,
    },
    'one-time': {
        monthly: 7.99,
        yearly: 7.99,
        oneTime: 7.99,
    },
    pro: {
        monthly: 9,
        yearly: 79,
        savings: 'Save 27%',
    },
    'pro-plus': {
        monthly: 15,
        yearly: 119,
        savings: 'Save 34%',
    },
};

// ===========================================
// PROMOTIONAL PRICING
// ===========================================

export interface Promo {
    id: string;
    name: string;
    description: string;
    originalPlan: PlanTier;
    promoPrice: number;
    durationDays: number;
    validUntil?: Date;
    code?: string;
    isActive: boolean;
}

export const ACTIVE_PROMOS: Promo[] = [
    {
        id: 'launch-special',
        name: 'Launch Special',
        description: 'Try Pro features for 30 days',
        originalPlan: 'pro',
        promoPrice: 5.00,
        durationDays: 30,
        // Promo runs from Dec 14, 2025 to Jan 31, 2026
        // To make it "always on" - just extend validUntil far into the future
        // To disable - set isActive: false
        validUntil: new Date('2026-01-31'),
        isActive: true,
    },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Get limits for a specific plan
 */
export function getPlanLimits(tier: PlanTier): PlanLimits {
    return PLANS[tier];
}

/**
 * Check if a feature is available for a plan
 */
export function hasFeature(tier: PlanTier, feature: keyof PlanLimits): boolean {
    const limits = PLANS[tier];
    const value = limits[feature];
    
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    if (value === 'unlimited') return true;
    return !!value;
}

/**
 * Check if user can add more responses to a poll
 */
export function canAddResponse(tier: PlanTier, currentResponses: number): boolean {
    const limit = PLANS[tier].maxResponsesPerPoll;
    if (limit === 'unlimited') return true;
    return currentResponses < limit;
}

/**
 * Get active promo for a plan
 */
export function getActivePromo(planTier: PlanTier): Promo | null {
    const now = new Date();
    return ACTIVE_PROMOS.find(p => 
        p.isActive && 
        p.originalPlan === planTier && 
        (!p.validUntil || p.validUntil > now)
    ) || null;
}

/**
 * Format response limit for display
 */
export function formatResponseLimit(tier: PlanTier): string {
    const limit = PLANS[tier].maxResponsesPerPoll;
    if (limit === 'unlimited') return 'Unlimited';
    return limit.toLocaleString();
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(tier: PlanTier): string {
    const names: Record<PlanTier, string> = {
        free: 'Free',
        'one-time': 'One-Time',
        pro: 'Pro',
        'pro-plus': 'Pro+',
    };
    return names[tier];
}

// ===========================================
// USAGE EXAMPLE
// ===========================================
/*

// In your component:
import { PLANS, getPlanLimits, canAddResponse, formatResponseLimit } from '../config/plans';

// Check if user can vote
const userPlan = 'free';
const currentVotes = 98;
if (!canAddResponse(userPlan, currentVotes)) {
    showError(`Free plan limited to ${formatResponseLimit(userPlan)} responses. Upgrade for unlimited!`);
}

// Check feature access
if (PLANS[userPlan].voteTimeline) {
    showTimelineChart();
} else {
    showUpgradePrompt('Upgrade to Pro for vote timeline');
}

// Get limits
const limits = getPlanLimits(userPlan);
console.log(limits.maxResponsesPerPoll); // 100

*/
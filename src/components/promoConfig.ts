// ============================================================================
// promoConfig.ts - Pricing Configuration (USD Only)
// All prices in USD - No regional pricing
// ============================================================================

// Pricing configuration - USD only
export const PRICING = {
    free: {
        name: 'Free',
        monthly: 0,
        annual: 0,
    },
    pro: {
        name: 'Pro',
        monthly: 16,
        annual: 190, // ~2 months free
    },
    business: {
        name: 'Business',
        monthly: 41,
        annual: 490, // ~2 months free
    },
};

// Currency settings - USD only
export const CURRENCY = {
    code: 'USD',
    symbol: '$',
};

// Format price with USD symbol
export function formatPrice(amount: number, showDecimals: boolean = false): string {
    if (showDecimals && amount % 1 !== 0) {
        return `$${amount.toFixed(2)}`;
    }
    return `$${Math.floor(amount)}`;
}

// Get pricing for a tier
export function getTierPricing(tier: 'free' | 'pro' | 'business') {
    return PRICING[tier];
}

// Calculate annual savings
export function getAnnualSavings(tier: 'pro' | 'business'): number {
    const pricing = PRICING[tier];
    const monthlyTotal = pricing.monthly * 12;
    return monthlyTotal - pricing.annual;
}

// Get months free with annual plan
export function getMonthsFree(tier: 'pro' | 'business'): number {
    const pricing = PRICING[tier];
    const monthlyTotal = pricing.monthly * 12;
    const savings = monthlyTotal - pricing.annual;
    return Math.round(savings / pricing.monthly);
}

// Stripe price IDs - replace with your actual Stripe price IDs
export const STRIPE_PRICE_IDS = {
    pro_monthly: 'price_pro_monthly_xxx',
    pro_annual: 'price_pro_annual_xxx',
    business_monthly: 'price_business_monthly_xxx',
    business_annual: 'price_business_annual_xxx',
};

// Feature limits by tier
export const TIER_LIMITS = {
    free: {
        activePolls: 3,
        responsesPerMonth: 100,
        pollDuration: '30 days',
        responseHistory: '90 days',
        themes: 3,
    },
    pro: {
        activePolls: 'Unlimited',
        responsesPerMonth: 5000,
        pollDuration: '1 year',
        responseHistory: '2 years',
        themes: 'All 12+',
    },
    business: {
        activePolls: 'Unlimited',
        responsesPerMonth: 50000,
        pollDuration: 'Unlimited',
        responseHistory: 'Forever',
        themes: 'All 12+ custom',
    },
};
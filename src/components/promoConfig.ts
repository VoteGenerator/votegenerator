// Promo and Pricing Configuration
// Control promotions and regional pricing

// Environment variable to enable/disable promo countdown globally
// Set VITE_PROMO_ENABLED=true in your .env file to show the countdown
const GLOBAL_PROMO_ENABLED = import.meta.env.VITE_PROMO_ENABLED === 'true';

// Regional promo overrides - set specific countries where promo is active
// This allows you to run promos in specific geos for testing or campaigns
const PROMO_ENABLED_REGIONS: string[] = ['CA']; // Canada enabled for testing

// Promo countdown settings
export const PROMO_SETTINGS = {
    durationHours: 36, // 36-hour countdown
    resetChance: 0.3,  // 30% chance to reset when expired
    storageKey: 'vg_quick_poll_timer',
};

// Regional pricing configuration
interface RegionalPrice {
    currency: string;
    symbol: string;
    quickPoll: number;
    quickPollOriginal?: number; // Original price before discount (if promo)
    eventPoll: number;
    proMonthly: number;
    proYearly: number;
    proPlusMonthly: number;
    proPlusYearly: number;
}

const regionalPricing: Record<string, RegionalPrice> = {
    US: {
        currency: 'USD',
        symbol: '$',
        quickPoll: 5,
        quickPollOriginal: 7, // Show as discounted from $7
        eventPoll: 9.99,
        proMonthly: 12,
        proYearly: 99,
        proPlusMonthly: 19,
        proPlusYearly: 149,
    },
    CA: {
        currency: 'CAD',
        symbol: 'CA$',
        quickPoll: 7,
        quickPollOriginal: 9,
        eventPoll: 12.99,
        proMonthly: 15,
        proYearly: 129,
        proPlusMonthly: 25,
        proPlusYearly: 199,
    },
    GB: {
        currency: 'GBP',
        symbol: '£',
        quickPoll: 4,
        quickPollOriginal: 6,
        eventPoll: 7.99,
        proMonthly: 10,
        proYearly: 79,
        proPlusMonthly: 15,
        proPlusYearly: 119,
    },
    EU: {
        currency: 'EUR',
        symbol: '€',
        quickPoll: 5,
        quickPollOriginal: 7,
        eventPoll: 8.99,
        proMonthly: 11,
        proYearly: 89,
        proPlusMonthly: 17,
        proPlusYearly: 139,
    },
    AU: {
        currency: 'AUD',
        symbol: 'A$',
        quickPoll: 8,
        quickPollOriginal: 10,
        eventPoll: 14.99,
        proMonthly: 18,
        proYearly: 149,
        proPlusMonthly: 29,
        proPlusYearly: 229,
    },
};

// EU countries that use EUR
const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'GR'];

// Detect user's region from browser
function detectRegion(): string {
    try {
        // Try to get from browser language/locale
        const locale = navigator.language || (navigator as any).userLanguage || 'en-US';
        const parts = locale.split('-');
        const country = parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();
        
        // Check if it's an EU country
        if (euCountries.includes(country)) {
            return 'EU';
        }
        
        // Check if we have specific pricing for this country
        if (regionalPricing[country]) {
            return country;
        }
        
        // Default to US
        return 'US';
    } catch {
        return 'US';
    }
}

// Get pricing for current region
export function getRegionalPricing(): RegionalPrice {
    const region = detectRegion();
    return regionalPricing[region] || regionalPricing.US;
}

// Get detected region code
export function getDetectedRegion(): string {
    return detectRegion();
}

// Format price with currency symbol
export function formatPrice(amount: number, showDecimals: boolean = true): string {
    const pricing = getRegionalPricing();
    
    if (showDecimals && amount % 1 !== 0) {
        return `${pricing.symbol}${amount.toFixed(2)}`;
    }
    return `${pricing.symbol}${Math.floor(amount)}`;
}

// Check if promo should be shown
// Returns true if:
// 1. Global promo is enabled via env var, OR
// 2. Current region is in the PROMO_ENABLED_REGIONS list
export function isPromoActive(): boolean {
    if (GLOBAL_PROMO_ENABLED) return true;
    
    const region = detectRegion();
    return PROMO_ENABLED_REGIONS.includes(region);
}

// Get promo settings for countdown timer
export function getPromoSettings() {
    return PROMO_SETTINGS;
}

// Stripe price IDs mapped by region and plan
// You'll need to create these in Stripe for each currency
export const stripePriceIds: Record<string, Record<string, string>> = {
    US: {
        quick_poll: 'price_xxx', // Replace with actual Stripe price IDs
        event_poll: 'price_xxx',
        pro_monthly: 'price_xxx',
        pro_yearly: 'price_xxx',
        pro_plus_monthly: 'price_xxx',
        pro_plus_yearly: 'price_xxx',
    },
    CA: {
        quick_poll: 'price_xxx',
        event_poll: 'price_xxx',
        pro_monthly: 'price_xxx',
        pro_yearly: 'price_xxx',
        pro_plus_monthly: 'price_xxx',
        pro_plus_yearly: 'price_xxx',
    },
    GB: {
        quick_poll: 'price_xxx',
        event_poll: 'price_xxx',
        pro_monthly: 'price_xxx',
        pro_yearly: 'price_xxx',
        pro_plus_monthly: 'price_xxx',
        pro_plus_yearly: 'price_xxx',
    },
    EU: {
        quick_poll: 'price_xxx',
        event_poll: 'price_xxx',
        pro_monthly: 'price_xxx',
        pro_yearly: 'price_xxx',
        pro_plus_monthly: 'price_xxx',
        pro_plus_yearly: 'price_xxx',
    },
};

// Get Stripe price ID for current region
export function getStripePriceId(plan: string): string {
    const region = detectRegion();
    return stripePriceIds[region]?.[plan] || stripePriceIds.US[plan];
}
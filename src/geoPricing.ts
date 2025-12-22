// ============================================================================
// Geo Pricing Configuration
// Detects user location and returns correct currency prices
// ============================================================================

export type Currency = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';

export interface GeoPrice {
    currency: Currency;
    symbol: string;
    starter: number;
    proEvent: number;
    unlimited: number;
}

// Prices in each supported currency
export const GEO_PRICES: Record<Currency, GeoPrice> = {
    USD: { currency: 'USD', symbol: '$', starter: 9.99, proEvent: 19.99, unlimited: 199 },
    CAD: { currency: 'CAD', symbol: '$', starter: 12.99, proEvent: 24.99, unlimited: 249 },
    EUR: { currency: 'EUR', symbol: '€', starter: 9.49, proEvent: 18.99, unlimited: 189 },
    GBP: { currency: 'GBP', symbol: '£', starter: 7.99, proEvent: 15.99, unlimited: 159 },
    AUD: { currency: 'AUD', symbol: '$', starter: 14.99, proEvent: 29.99, unlimited: 299 },
};

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
    // USD
    US: 'USD',
    // CAD
    CA: 'CAD',
    // EUR (Eurozone)
    AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR', FR: 'EUR', DE: 'EUR',
    GR: 'EUR', IE: 'EUR', IT: 'EUR', LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR',
    NL: 'EUR', PT: 'EUR', SK: 'EUR', SI: 'EUR', ES: 'EUR',
    // GBP
    GB: 'GBP', UK: 'GBP',
    // AUD
    AU: 'AUD',
};

// Default currency if detection fails
const DEFAULT_CURRENCY: Currency = 'USD';

// Cache key for localStorage
const GEO_CACHE_KEY = 'vg_geo_currency';
const GEO_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGeo {
    currency: Currency;
    timestamp: number;
}

// Get cached currency from localStorage
function getCachedCurrency(): Currency | null {
    try {
        const cached = localStorage.getItem(GEO_CACHE_KEY);
        if (cached) {
            const data: CachedGeo = JSON.parse(cached);
            if (Date.now() - data.timestamp < GEO_CACHE_EXPIRY) {
                return data.currency;
            }
        }
    } catch (e) {
        // localStorage not available or parse error
    }
    return null;
}

// Cache currency to localStorage
function setCachedCurrency(currency: Currency): void {
    try {
        const data: CachedGeo = { currency, timestamp: Date.now() };
        localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        // localStorage not available
    }
}

// Detect user's country using free IP geolocation API
async function detectCountry(): Promise<string | null> {
    try {
        // Using ipapi.co - free tier allows 1000 requests/day
        const response = await fetch('https://ipapi.co/json/', { 
            signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
            const data = await response.json();
            return data.country_code || null;
        }
    } catch (e) {
        // Network error or timeout - fall back to default
        console.log('Geo detection failed, using default currency');
    }
    return null;
}

// Main function to get user's currency
export async function detectUserCurrency(): Promise<Currency> {
    // Check cache first
    const cached = getCachedCurrency();
    if (cached) {
        return cached;
    }

    // Detect from IP
    const country = await detectCountry();
    const currency = country ? (COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY) : DEFAULT_CURRENCY;
    
    // Cache result
    setCachedCurrency(currency);
    
    return currency;
}

// Get prices for a currency
export function getPricesForCurrency(currency: Currency): GeoPrice {
    return GEO_PRICES[currency] || GEO_PRICES.USD;
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: Currency): string {
    const { symbol } = GEO_PRICES[currency];
    
    // Format based on currency conventions
    if (currency === 'EUR') {
        // Europeans often use comma for decimals
        return `${symbol}${amount.toFixed(2).replace('.', ',')}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
}

// Format price with currency code (e.g., "$24.99 CAD")
export function formatPriceWithCode(amount: number, currency: Currency): string {
    const { symbol } = GEO_PRICES[currency];
    return `${symbol}${amount % 1 === 0 ? amount : amount.toFixed(2)} ${currency}`;
}

// ============================================================================
// React Hook for Geo Pricing
// ============================================================================

import { useState, useEffect } from 'react';

export interface UseGeoPricingResult {
    loading: boolean;
    currency: Currency;
    prices: GeoPrice;
    formatPrice: (amount: number) => string;
    formatWithCode: (amount: number) => string;
}

export function useGeoPricing(): UseGeoPricingResult {
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<Currency>('USD');

    useEffect(() => {
        let mounted = true;

        detectUserCurrency().then((detected) => {
            if (mounted) {
                setCurrency(detected);
                setLoading(false);
            }
        });

        return () => { mounted = false; };
    }, []);

    const prices = getPricesForCurrency(currency);

    return {
        loading,
        currency,
        prices,
        formatPrice: (amount: number) => formatPrice(amount, currency),
        formatWithCode: (amount: number) => formatPriceWithCode(amount, currency),
    };
}

// ============================================================================
// Checkout URL Builder - includes currency for Stripe
// ============================================================================

export function getCheckoutUrl(tier: 'starter' | 'pro_event' | 'unlimited', currency: Currency): string {
    return `/.netlify/functions/vg-checkout?tier=${tier}&currency=${currency.toLowerCase()}`;
}
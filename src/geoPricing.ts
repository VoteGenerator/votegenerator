// ============================================================================
// Geo Pricing - TELL BELLA IF THESE PRICES NEED ADJUSTING
// These should match your Stripe price objects
// ============================================================================

import { useState, useEffect } from 'react';

export type Currency = 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD';

export interface GeoPrice {
    currency: Currency;
    symbol: string;
    starter: number;
    proEvent: number;
    unlimited: number;
}

// ============================================================================
// PRICES - UPDATE THESE TO MATCH YOUR STRIPE PRICES
// ============================================================================
export const GEO_PRICES: Record<Currency, GeoPrice> = {
    USD: { currency: 'USD', symbol: '$', starter: 9.99, proEvent: 19.99, unlimited: 199 },
    CAD: { currency: 'CAD', symbol: '$', starter: 13.99, proEvent: 27.99, unlimited: 279 },
    EUR: { currency: 'EUR', symbol: '€', starter: 9.49, proEvent: 18.99, unlimited: 189 },
    GBP: { currency: 'GBP', symbol: '£', starter: 7.99, proEvent: 15.99, unlimited: 159 },
    AUD: { currency: 'AUD', symbol: '$', starter: 15.99, proEvent: 31.99, unlimited: 319 },
};

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
    US: 'USD',
    CA: 'CAD',
    AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR', FR: 'EUR', DE: 'EUR',
    GR: 'EUR', IE: 'EUR', IT: 'EUR', LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR',
    NL: 'EUR', PT: 'EUR', SK: 'EUR', SI: 'EUR', ES: 'EUR',
    GB: 'GBP', UK: 'GBP',
    AU: 'AUD',
};

const DEFAULT_CURRENCY: Currency = 'USD';
const GEO_CACHE_KEY = 'vg_geo_currency';
const GEO_CACHE_EXPIRY = 24 * 60 * 60 * 1000;

function getCachedCurrency(): Currency | null {
    try {
        const cached = localStorage.getItem(GEO_CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < GEO_CACHE_EXPIRY) {
                return data.currency;
            }
        }
    } catch (e) {}
    return null;
}

function setCachedCurrency(currency: Currency): void {
    try {
        localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ currency, timestamp: Date.now() }));
    } catch (e) {}
}

async function detectCountry(): Promise<string | null> {
    try {
        const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        if (response.ok) {
            const data = await response.json();
            return data.country_code || null;
        }
    } catch (e) {}
    return null;
}

export async function detectUserCurrency(): Promise<Currency> {
    const cached = getCachedCurrency();
    if (cached) return cached;
    
    const country = await detectCountry();
    const currency = country ? (COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY) : DEFAULT_CURRENCY;
    setCachedCurrency(currency);
    return currency;
}

// React Hook
export interface UseGeoPricingResult {
    loading: boolean;
    currency: Currency;
    prices: GeoPrice;
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

    return { loading, currency, prices: GEO_PRICES[currency] };
}
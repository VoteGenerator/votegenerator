// ============================================================================
// Geo-based Pricing Hook
// Detects user location and adjusts currency/prices accordingly
// ============================================================================

import { useState, useEffect } from 'react';

// Base prices in USD (whole numbers)
const BASE_PRICES = {
    starter: 9,
    proEvent: 19,
    unlimitedEvent: 49,
    unlimited: 199,
};

// Currency configurations with ACTUAL exchange rates + 5% buffer for fluctuations
// Base rates (approx Jan 2026): CAD 1.36, AUD 1.53, EUR 0.92, GBP 0.79
// Multiplier = exchange_rate × 1.05
const CURRENCY_CONFIG: Record<string, { symbol: string; multiplier: number; code: string }> = {
    USD: { symbol: '$', multiplier: 1.00, code: 'USD' },
    CAD: { symbol: 'CA$', multiplier: 1.43, code: 'CAD' },  // 1.36 × 1.05 = 1.428
    AUD: { symbol: 'A$', multiplier: 1.61, code: 'AUD' },   // 1.53 × 1.05 = 1.6065
    EUR: { symbol: '€', multiplier: 0.97, code: 'EUR' },    // 0.92 × 1.05 = 0.966
    GBP: { symbol: '£', multiplier: 0.83, code: 'GBP' },    // 0.79 × 1.05 = 0.8295
};

// Country to currency mapping
const COUNTRY_CURRENCY: Record<string, string> = {
    US: 'USD',
    CA: 'CAD',
    AU: 'AUD',
    NZ: 'AUD',
    // Eurozone countries
    DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
    BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
    GR: 'EUR', LU: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
    LV: 'EUR', LT: 'EUR', MT: 'EUR', CY: 'EUR',
    // UK
    GB: 'GBP',
};

// Round to nice whole number price points
const roundPrice = (price: number): number => {
    // Round to nearest whole number
    return Math.round(price);
};

// Calculate prices for a currency
const calculatePrices = (currencyCode: string) => {
    const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
    
    return {
        starter: roundPrice(BASE_PRICES.starter * config.multiplier),
        proEvent: roundPrice(BASE_PRICES.proEvent * config.multiplier),
        unlimitedEvent: roundPrice(BASE_PRICES.unlimitedEvent * config.multiplier),
        unlimited: roundPrice(BASE_PRICES.unlimited * config.multiplier),
        symbol: config.symbol,
    };
};

// Geo pricing hook
export const useGeoPricing = () => {
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [countryCode, setCountryCode] = useState('US');
    const [prices, setPrices] = useState(calculatePrices('USD'));

    useEffect(() => {
        const detectLocation = async () => {
            try {
                // Try to get country from various sources
                let detectedCountry = 'US';

                // Method 1: Check if we have it cached
                const cached = localStorage.getItem('vg_detected_country');
                if (cached) {
                    detectedCountry = cached;
                } else {
                    // Method 2: Use timezone to guess country
                    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    if (timezone.startsWith('America/Toronto') || timezone.startsWith('America/Vancouver') || timezone.startsWith('America/Montreal')) {
                        detectedCountry = 'CA';
                    } else if (timezone.startsWith('Australia/')) {
                        detectedCountry = 'AU';
                    } else if (timezone.startsWith('Europe/London')) {
                        detectedCountry = 'GB';
                    } else if (timezone.startsWith('Europe/')) {
                        detectedCountry = 'DE'; // Default to EUR for Europe
                    } else if (timezone.startsWith('Pacific/Auckland')) {
                        detectedCountry = 'NZ';
                    }

                    // Method 3: Try IP geolocation (free service)
                    try {
                        const response = await fetch('https://ipapi.co/json/', { 
                            signal: AbortSignal.timeout(3000) 
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.country_code) {
                                detectedCountry = data.country_code;
                            }
                        }
                    } catch {
                        // Ignore geo detection errors, use timezone fallback
                    }

                    // Cache for future visits
                    localStorage.setItem('vg_detected_country', detectedCountry);
                }

                setCountryCode(detectedCountry);
                const detectedCurrency = COUNTRY_CURRENCY[detectedCountry] || 'USD';
                setCurrency(detectedCurrency);
                setPrices(calculatePrices(detectedCurrency));
            } catch (error) {
                // Default to USD on any error
                console.warn('Geo detection failed, defaulting to USD');
            } finally {
                setLoading(false);
            }
        };

        detectLocation();
    }, []);

    return {
        loading,
        currency,
        countryCode,
        prices,
    };
};

// Export price table for Stripe configuration reference
// Calculated: USD × exchange_rate × 1.05 (buffer), rounded to whole numbers
export const STRIPE_PRICES = {
    USD: {
        starter: 9,
        proEvent: 19,
        unlimitedEvent: 49,
        unlimited: 199,
    },
    CAD: {
        starter: 13,    // $9 × 1.36 × 1.05 = $12.85 → $13
        proEvent: 27,   // $19 × 1.36 × 1.05 = $27.13 → $27
        unlimitedEvent: 70,  // $49 × 1.36 × 1.05 = $69.97 → $70
        unlimited: 285, // $199 × 1.36 × 1.05 = $284.15 → $285
    },
    AUD: {
        starter: 15,    // $9 × 1.53 × 1.05 = $14.46 → $15
        proEvent: 31,   // $19 × 1.53 × 1.05 = $30.52 → $31
        unlimitedEvent: 79,  // $49 × 1.53 × 1.05 = $78.72 → $79
        unlimited: 320, // $199 × 1.53 × 1.05 = $319.79 → $320
    },
    EUR: {
        starter: 9,     // $9 × 0.92 × 1.05 = €8.69 → €9
        proEvent: 19,   // $19 × 0.92 × 1.05 = €18.35 → €19
        unlimitedEvent: 49,  // $49 × 0.92 × 1.05 = €47.33 → €49
        unlimited: 195, // $199 × 0.92 × 1.05 = €192.28 → €195
    },
    GBP: {
        starter: 8,     // $9 × 0.79 × 1.05 = £7.47 → £8
        proEvent: 16,   // $19 × 0.79 × 1.05 = £15.76 → £16
        unlimitedEvent: 41,  // $49 × 0.79 × 1.05 = £40.64 → £41
        unlimited: 165, // $199 × 0.79 × 1.05 = £165.07 → £165
    },
};

export default useGeoPricing;
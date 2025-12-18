import React, { useState, useEffect } from 'react';
import { X, Zap, ArrowRight } from 'lucide-react';

// Currency configuration
const CURRENCY_CONFIG: Record<string, { symbol: string; rate: number; code: string }> = {
    USD: { symbol: '$', rate: 1, code: 'USD' },
    CAD: { symbol: '$', rate: 1.36, code: 'CAD' },
    EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
    GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
    AUD: { symbol: '$', rate: 1.53, code: 'AUD' },
};

const detectCurrency = (): string => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;
        
        if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver') || locale.includes('en-CA')) return 'CAD';
        if (timezone.includes('Europe/London') || locale.includes('en-GB')) return 'GBP';
        if (timezone.includes('Australia') || locale.includes('en-AU')) return 'AUD';
        if (timezone.includes('Europe/') && !timezone.includes('London')) return 'EUR';
        
        return 'USD';
    } catch {
        return 'USD';
    }
};

interface PromoBannerProps {
    position?: 'top' | 'bottom';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ position = 'top' }) => {
    const [dismissed, setDismissed] = useState(false);
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        // Check if already dismissed this session
        const wasDismissed = sessionStorage.getItem('promoBannerDismissed');
        if (wasDismissed) {
            setDismissed(true);
        }
        
        // Detect currency
        setCurrency(detectCurrency());
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('promoBannerDismissed', 'true');
    };

    const formatPrice = (usdPrice: number): string => {
        const config = CURRENCY_CONFIG[currency];
        const convertedPrice = Math.round(usdPrice * config.rate);
        return `${config.symbol}${convertedPrice} ${config.code}`;
    };

    if (dismissed) return null;

    return (
        <div className={`${position === 'top' ? 'fixed top-0 left-0 right-0 z-50' : 'fixed bottom-0 left-0 right-0 z-50'}`}>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-yellow-300" />
                        <span className="font-medium">
                            <span className="hidden sm:inline">🎉 Limited Offer: </span>
                            Quick Poll for just <strong>{formatPrice(5)}</strong>
                        </span>
                    </div>
                    <a
                        href="/checkout?plan=quick_poll"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white text-indigo-600 font-bold rounded-full text-xs hover:bg-indigo-50 transition-colors"
                    >
                        Claim Deal
                        <ArrowRight size={12} />
                    </a>
                    <button
                        onClick={handleDismiss}
                        className="absolute right-4 p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
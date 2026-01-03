// ============================================================================
// PromoBanner - Generic promotional banner (can be hidden or customized)
// Set SHOW_BANNER to false to hide, or customize the message
// ============================================================================

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

// Toggle this to show/hide the banner
const SHOW_BANNER = true;

// Customize the banner content
const BANNER_CONFIG = {
    message: '✨ New: Survey polls & 42 ready-to-use templates now available!',
    ctaText: 'Try Templates',
    ctaUrl: '/templates',
    bgColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
};

interface PromoBannerProps {
    position?: 'top' | 'bottom';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Don't render if banner is disabled or dismissed
    if (!SHOW_BANNER || !isVisible) return null;

    return (
        <div className={`${BANNER_CONFIG.bgColor} text-white py-2.5 px-4 relative`}>
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-300" />
                    <span className="font-medium">{BANNER_CONFIG.message}</span>
                </div>
                
                <a 
                    href={BANNER_CONFIG.ctaUrl}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition"
                >
                    {BANNER_CONFIG.ctaText}
                    <ArrowRight size={14} />
                </a>
                
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition"
                    aria-label="Dismiss banner"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default PromoBanner;
// ============================================================================
// PromoBanner - Site-wide promotional banner
// Toggle SHOW_BANNER to show/hide, customize message in BANNER_CONFIG
// ============================================================================

import React, { useState } from 'react';
import { X, Lock, ArrowRight, Sparkles, Zap } from 'lucide-react';

// Toggle this to show/hide the banner
const SHOW_BANNER = true;

// Banner presets - uncomment the one you want to use
// ============================================================================

// OPTION 1: Privacy/No signup focus (RECOMMENDED FOR LAUNCH)
const BANNER_CONFIG = {
    icon: Lock,
    message: 'Privacy-first polling — No signup, no email, no account needed.',
    ctaText: 'Create Free Poll',
    ctaUrl: '#create',
    bgColor: 'bg-gradient-to-r from-slate-800 to-slate-900',
    iconColor: 'text-emerald-400',
};

// OPTION 2: Limited time pricing
// const BANNER_CONFIG = {
//     icon: Zap,
//     message: 'Launch pricing — Lock in $16/mo Pro before prices increase',
//     ctaText: 'See Plans',
//     ctaUrl: '/pricing',
//     bgColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
//     iconColor: 'text-amber-300',
// };

// OPTION 3: New features
// const BANNER_CONFIG = {
//     icon: Sparkles,
//     message: 'New: 8 poll types including Ranked Choice & Visual Polls',
//     ctaText: 'See Demo',
//     ctaUrl: '/demo',
//     bgColor: 'bg-gradient-to-r from-indigo-600 to-purple-600',
//     iconColor: 'text-amber-300',
// };

// ============================================================================

interface PromoBannerProps {
    position?: 'top' | 'bottom';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Don't render if banner is disabled or dismissed
    if (!SHOW_BANNER || !isVisible) return null;

    const IconComponent = BANNER_CONFIG.icon;

    return (
        <div className={`${BANNER_CONFIG.bgColor} text-white py-2.5 px-4 relative`}>
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <IconComponent size={16} className={BANNER_CONFIG.iconColor} />
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
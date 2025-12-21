// ============================================================================
// Promo Banner Component
// SET SHOW_BANNER to false TO DISABLE
// ============================================================================

import React, { useState } from 'react';
import { X, Percent, ArrowRight } from 'lucide-react';

// ========================================
// TOGGLE THIS TO SHOW/HIDE BANNER
// ========================================
const SHOW_BANNER = true; // Set to false to hide completely

// Promo details
const PROMO = {
    code: 'SAVE10',
    discount: '10%',
    message: '10% off all paid plans!',
    link: '/pricing',
};

interface PromoBannerProps {
    position?: 'top' | 'bottom';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(true);

    // Don't render if disabled or dismissed
    if (!SHOW_BANNER || !isVisible) {
        return null;
    }

    return (
        <div className={`bg-gradient-to-r from-emerald-600 to-teal-600 text-white ${position === 'top' ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 py-2.5">
                <div className="flex items-center justify-between gap-4">
                    {/* Main content */}
                    <div className="flex-1 flex items-center justify-center gap-3 text-sm">
                        <Percent size={18} className="flex-shrink-0" />
                        <span className="font-semibold">🎉 {PROMO.message}</span>
                        <span className="hidden sm:inline text-white/80">
                            — Use code <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded">{PROMO.code}</span> at checkout
                        </span>
                        <a
                            href={PROMO.link}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full font-medium transition"
                        >
                            View Plans
                            <ArrowRight size={14} />
                        </a>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-white/20 rounded-full transition"
                        aria-label="Dismiss banner"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
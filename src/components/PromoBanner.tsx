// ============================================================================
// Promo Banner Component
// Scrolls away normally (not fixed/sticky) to avoid spacing issues
// SET SHOW_BANNER to false TO DISABLE
// ============================================================================

import React, { useState } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

// ========================================
// TOGGLE THIS TO SHOW/HIDE BANNER
// ========================================
const SHOW_BANNER = true; // Set to false to hide completely

const PROMO = {
    code: 'SAVE10',
    discount: '10%',
    link: '/pricing',
};

const PromoBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!SHOW_BANNER || !isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white relative">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap pr-8">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                        <Sparkles size={18} className="text-yellow-300 flex-shrink-0" />
                        <span className="font-bold">Limited Time:</span>
                        <span className="font-bold text-yellow-200">{PROMO.discount} OFF</span>
                        <span className="hidden sm:inline">all paid plans!</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <span className="text-emerald-100">Use code</span>
                        <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">{PROMO.code}</span>
                        <span className="text-emerald-100">at checkout</span>
                    </div>
                    
                    <a href={PROMO.link} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-full text-sm font-bold transition shadow-sm">
                        View Plans <ArrowRight size={14} />
                    </a>
                </div>
                
                {/* Close button - absolute positioned */}
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition" 
                    aria-label="Dismiss"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default PromoBanner;
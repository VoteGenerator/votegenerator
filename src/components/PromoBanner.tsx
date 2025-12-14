import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Gift, ArrowRight } from 'lucide-react';
import { ACTIVE_PROMOS, getActivePromo } from '../config/plans';

interface PromoBannerProps {
    onClose?: () => void;
    position?: 'top' | 'bottom' | 'floating';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
    onClose,
    position = 'top'
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    // Get the active promo
    const promo = getActivePromo('pro');
    
    useEffect(() => {
        if (!promo?.validUntil) return;
        
        const updateTimer = () => {
            const now = new Date();
            const end = new Date(promo.validUntil!);
            const diff = end.getTime() - now.getTime();
            
            if (diff <= 0) {
                setTimeLeft('Expired');
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h left`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m left`);
            } else {
                setTimeLeft(`${minutes}m left`);
            }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 60000); // Update every minute
        
        return () => clearInterval(interval);
    }, [promo]);
    
    // Check if user dismissed this promo before
    useEffect(() => {
        const dismissed = localStorage.getItem(`promo_dismissed_${promo?.id}`);
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const hoursSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60);
            // Show again after 24 hours
            if (hoursSinceDismissed < 24) {
                setIsVisible(false);
            }
        }
    }, [promo?.id]);
    
    if (!promo || !isVisible) return null;
    
    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(`promo_dismissed_${promo.id}`, new Date().toISOString());
        onClose?.();
    };
    
    const handleClaim = () => {
        // Navigate to checkout with promo
        window.location.hash = `checkout/promo/${promo.id}`;
    };
    
    const positionStyles = {
        top: 'fixed top-0 left-0 right-0 z-50',
        bottom: 'fixed bottom-0 left-0 right-0 z-50',
        floating: 'fixed bottom-4 right-4 z-50 max-w-md rounded-2xl shadow-2xl',
    };
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: position === 'bottom' ? 100 : -100 }}
                className={`${positionStyles[position]} bg-gradient-to-r from-amber-500 via-orange-500 to-red-500`}
            >
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Icon + Message */}
                        <div className="flex items-center gap-3 flex-1">
                            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                                <Gift size={20} className="text-white" />
                            </div>
                            <div className="text-white">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm sm:text-base">
                                        🚀 {promo.name}:
                                    </span>
                                    <span className="text-white/90 text-sm sm:text-base">
                                        {promo.description} for just
                                    </span>
                                    <span className="font-black text-lg sm:text-xl">
                                        ${promo.promoPrice}
                                    </span>
                                    <span className="line-through text-white/60 text-sm">
                                        ${ACTIVE_PROMOS.find(p => p.originalPlan === 'pro') ? 9 : 7.99}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Center: Timer */}
                        {timeLeft && (
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                                <Clock size={14} className="text-white" />
                                <span className="text-white text-sm font-semibold">
                                    {timeLeft}
                                </span>
                            </div>
                        )}
                        
                        {/* Right: CTA + Close */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClaim}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 font-bold text-sm rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
                            >
                                <Zap size={16} />
                                <span className="hidden sm:inline">Claim Deal</span>
                                <span className="sm:hidden">Get</span>
                                <ArrowRight size={14} className="hidden sm:block" />
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close promo banner"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Alternative: Floating Card Style
export const PromoFloatingCard: React.FC<PromoBannerProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const promo = getActivePromo('pro');
    
    // Show after 5 seconds on page
    useEffect(() => {
        const timer = setTimeout(() => {
            const dismissed = localStorage.getItem(`promo_dismissed_${promo?.id}`);
            if (!dismissed) setIsVisible(true);
        }, 5000);
        
        return () => clearTimeout(timer);
    }, [promo?.id]);
    
    if (!promo || !isVisible) return null;
    
    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(`promo_dismissed_${promo.id}`, new Date().toISOString());
        onClose?.();
    };
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Gift size={18} />
                        <span className="font-bold">{promo.name}</span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    <p className="text-slate-600 mb-3">
                        {promo.description}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-black text-orange-600">
                            ${promo.promoPrice}
                        </span>
                        <span className="text-slate-400 line-through">
                            $9/mo
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Save 44%
                        </span>
                    </div>
                    
                    <ul className="text-sm text-slate-600 space-y-1 mb-4">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Unlimited responses
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Remove all ads & branding
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Vote timeline & analytics
                        </li>
                    </ul>
                    
                    <button
                        onClick={() => window.location.hash = `checkout/promo/${promo.id}`}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-200"
                    >
                        Get {promo.durationDays} Days for ${promo.promoPrice} →
                    </button>
                    
                    <p className="text-xs text-slate-400 text-center mt-2">
                        One-time payment. No subscription.
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PromoBanner;
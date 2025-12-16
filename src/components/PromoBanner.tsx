import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, Gift, ArrowRight } from 'lucide-react';

// ============================================
// PROMO CONFIGURATION - EDIT HERE
// ============================================
// To disable: set isActive to false
// To change dates: update validUntil
// To change price: update promoPrice
const PROMO_CONFIG = {
    id: 'launch-special',
    name: 'Launch Special',
    description: 'Try Pro features for 30 days',
    originalPrice: 9,
    promoPrice: 5.00,
    durationDays: 30,
    validUntil: new Date('2026-01-31'), // Promo runs until this date
    isActive: true, // Set to false to disable
};
// ============================================

interface PromoBannerProps {
    onClose?: () => void;
    position?: 'top' | 'bottom' | 'floating';
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
    onClose,
    position = 'top'
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    // Check if promo is active
    const now = new Date();
    const promo = PROMO_CONFIG.isActive && now < PROMO_CONFIG.validUntil ? PROMO_CONFIG : null;
    
    // Countdown timer
    useEffect(() => {
        if (!promo?.validUntil) return;
        
        const updateTimer = () => {
            const now = new Date();
            const end = new Date(promo.validUntil);
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
        const interval = setInterval(updateTimer, 60000);
        
        return () => clearInterval(interval);
    }, [promo]);
    
    // Check if user dismissed this promo before
    useEffect(() => {
        try {
            const dismissed = localStorage.getItem(`promo_dismissed_${promo?.id}`);
            if (dismissed) {
                const dismissedDate = new Date(dismissed);
                const hoursSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60);
                if (hoursSinceDismissed < 24) {
                    setIsVisible(false);
                    setShowFloatingButton(true); // Show floating button instead
                }
            }
        } catch {
            // localStorage not available
        }
    }, [promo?.id]);
    
    if (!promo) return null;
    
    const handleClose = () => {
        setIsVisible(false);
        setShowFloatingButton(true); // Show floating button when dismissed
        try {
            localStorage.setItem(`promo_dismissed_${promo.id}`, new Date().toISOString());
        } catch {
            // localStorage not available
        }
        onClose?.();
    };
    
    const handleClaim = () => {
        window.location.hash = 'pricing';
    };
    
    const positionStyles = {
        top: 'fixed top-0 left-0 right-0 z-[100]',
        bottom: 'fixed bottom-0 left-0 right-0 z-[100]',
        floating: 'fixed bottom-4 right-4 z-[100] max-w-md rounded-2xl shadow-2xl',
    };
    
    return (
        <>
            {/* Main Banner */}
            <AnimatePresence>
                {isVisible && (
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
                                                ${promo.originalPrice}/mo
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
                )}
            </AnimatePresence>
            
            {/* Floating Button (shows when banner dismissed) */}
            <AnimatePresence>
                {showFloatingButton && !isVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 100 }}
                        onClick={handleClaim}
                        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        <Gift size={18} />
                        <span>${promo.promoPrice} Deal</span>
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{timeLeft}</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
};

export default PromoBanner;
// ============================================================================
// AdWall - Interstitial Ad Page with Countdown
// Shows before poll confirmation. Placeholder for future ad partners.
// Route: /ad-wall?next=/path-to-redirect
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Crown, Zap, ArrowRight, CheckCircle, Star, Gift, Shield, BarChart3 } from 'lucide-react';
import NavHeader from './NavHeader';
import { useGeoPricing } from '../geoPricing';

// ============================================================================
// Placeholder Ad Content (geo-targeted)
// Replace with actual ad partner code when ready
// ============================================================================

interface AdSlot {
    id: string;
    type: 'upgrade' | 'feature' | 'sponsor';
    title: string;
    description: string;
    cta: string;
    href: string;
    icon: React.ElementType;
    gradient: string;
}

const AdWall: React.FC = () => {
    const [countdown, setCountdown] = useState(8);
    const [canSkip, setCanSkip] = useState(false);
    const { loading, currency, prices } = useGeoPricing();
    
    // Get redirect URL from query params
    const getNextUrl = (): string => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('next') || '/';
        }
        return '/';
    };

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanSkip(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-redirect after countdown (optional - remove if you want manual click)
    // useEffect(() => {
    //     if (canSkip) {
    //         const redirectTimer = setTimeout(() => {
    //             window.location.href = getNextUrl();
    //         }, 2000);
    //         return () => clearTimeout(redirectTimer);
    //     }
    // }, [canSkip]);

    const handleContinue = () => {
        window.location.href = getNextUrl();
    };

    // Placeholder ads - mix of upgrade prompts and sponsor placeholders
    const adSlots: AdSlot[] = [
        {
            id: 'upgrade-pro',
            type: 'upgrade',
            title: 'Unlock Pro Features',
            description: `Get 2,000 responses, Visual Polls, PDF export & more. One-time ${loading ? '...' : `${prices.symbol}${prices.proEvent} ${currency}`}`,
            cta: 'Upgrade to Pro',
            href: '/.netlify/functions/vg-checkout?tier=pro_event',
            icon: Crown,
            gradient: 'from-purple-600 to-pink-600',
        },
        {
            id: 'feature-unlimited',
            type: 'feature',
            title: 'Go Unlimited',
            description: `Unlimited premium polls for 1 year. Best value at ${loading ? '...' : `${prices.symbol}${prices.unlimited} ${currency}`}`,
            cta: 'Get Unlimited',
            href: '/.netlify/functions/vg-checkout?tier=unlimited',
            icon: Star,
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            id: 'sponsor-placeholder',
            type: 'sponsor',
            title: 'Your Ad Here',
            description: 'Reach decision makers. Contact us for sponsorship opportunities.',
            cta: 'Learn More',
            href: '/contact?ref=adwall',
            icon: Gift,
            gradient: 'from-slate-600 to-slate-800',
        },
    ];

    // Pick which ad to show (rotate or prioritize upgrade)
    const [currentAdIndex] = useState(() => Math.floor(Math.random() * 2)); // Only show upgrade ads for now
    const currentAd = adSlots[currentAdIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <NavHeader />
            
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Success Message */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                        <CheckCircle className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Poll Created Successfully! 🎉
                    </h1>
                    <p className="text-indigo-200">
                        Your poll is ready to share. Just one more step...
                    </p>
                </motion.div>

                {/* Main Ad Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
                >
                    {/* Ad Header */}
                    <div className={`bg-gradient-to-r ${currentAd.gradient} p-6 text-white`}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <currentAd.icon size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{currentAd.title}</h2>
                                <p className="text-white/80 text-sm">{currentAd.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ad Body */}
                    <div className="p-6">
                        {currentAd.type === 'upgrade' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[
                                    { icon: BarChart3, label: '2,000 responses' },
                                    { icon: Shield, label: 'No branding' },
                                    { icon: Sparkles, label: 'Visual Polls' },
                                    { icon: Zap, label: 'PDF export' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-600">
                                        <feature.icon size={16} className="text-purple-500" />
                                        <span className="text-sm">{feature.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentAd.type === 'feature' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[
                                    { icon: Star, label: 'Unlimited polls' },
                                    { icon: Clock, label: '1 year access' },
                                    { icon: Crown, label: 'All features' },
                                    { icon: Shield, label: 'Priority support' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-600">
                                        <feature.icon size={16} className="text-amber-500" />
                                        <span className="text-sm">{feature.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <a
                            href={currentAd.href}
                            className={`block w-full py-4 bg-gradient-to-r ${currentAd.gradient} text-white font-bold rounded-xl text-center hover:shadow-lg transition`}
                        >
                            {currentAd.cta} <ArrowRight className="inline ml-2" size={18} />
                        </a>
                    </div>
                </motion.div>

                {/* Countdown / Skip Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <AnimatePresence mode="wait">
                        {!canSkip ? (
                            <motion.div
                                key="countdown"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-full text-white"
                            >
                                <Clock size={20} className="text-indigo-300" />
                                <span>Continue in <strong className="text-xl">{countdown}</strong> seconds</span>
                            </motion.div>
                        ) : (
                            <motion.button
                                key="skip"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleContinue}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                            >
                                Continue to My Poll <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <p className="text-indigo-300/60 text-sm mt-4">
                        Free polls supported by sponsors
                    </p>
                </motion.div>

                {/* Secondary Ad Slots (for future ad partners) */}
                <div className="mt-12 grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center">
                        <p className="text-indigo-300 text-sm mb-2">Ad Space Available</p>
                        <p className="text-white/40 text-xs">300x250 Banner</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 text-center">
                        <p className="text-indigo-300 text-sm mb-2">Ad Space Available</p>
                        <p className="text-white/40 text-xs">300x250 Banner</p>
                    </div>
                </div>

                {/* Why Upgrade - No Ads */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-emerald-300 font-bold mb-1">Skip Ads Forever</h3>
                            <p className="text-emerald-200/70 text-sm">
                                Paid plans include ad-free experience. Your voters see a clean, professional poll without interruptions.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdWall;
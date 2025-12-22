// ============================================================================
// AdWall - Interstitial Ad Page with Countdown
// Reads destination from sessionStorage (set by VoteGeneratorCreate)
// Route: /ad-wall
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Crown, Zap, ArrowRight, CheckCircle, Star, Gift, Shield, BarChart3 } from 'lucide-react';
import NavHeader from './NavHeader';
import { useGeoPricing } from '../geoPricing';

const AdWall: React.FC = () => {
    const [countdown, setCountdown] = useState(8);
    const [canSkip, setCanSkip] = useState(false);
    const [nextUrl, setNextUrl] = useState('/');
    const { loading, currency, prices } = useGeoPricing();
    
    // Get redirect URL from URL params (primary) or sessionStorage (backup)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const pollId = params.get('pollId');
        const adminKey = params.get('adminKey');
        
        // Primary: Build URL from URL params
        if (pollId && adminKey) {
            const pollUrl = `/#id=${pollId}&admin=${adminKey}`;
            setNextUrl(pollUrl);
            // Also store in sessionStorage for refresh
            try {
                sessionStorage.setItem('vg_ad_wall_next', pollUrl);
            } catch (e) {
                console.warn('sessionStorage not available');
            }
        } else {
            // Fallback: Check sessionStorage
            try {
                const stored = sessionStorage.getItem('vg_ad_wall_next');
                if (stored) {
                    setNextUrl(stored);
                }
            } catch (e) {
                console.warn('sessionStorage not available');
            }
        }
    }, []);

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

    const handleContinue = () => {
        // Clear sessionStorage now that we're using it
        sessionStorage.removeItem('vg_ad_wall_next');
        window.location.href = nextUrl;
    };

    // Ad content
    const adSlots = [
        {
            id: 'upgrade-pro',
            title: 'Unlock Pro Features',
            description: `Get 2,000 responses, Visual Polls, PDF export & more. One-time ${loading ? '...' : `${prices.symbol}${prices.proEvent} ${currency}`}`,
            cta: 'Upgrade to Pro',
            href: '/.netlify/functions/vg-checkout?tier=pro_event',
            icon: Crown,
            gradient: 'from-purple-600 to-pink-600',
        },
        {
            id: 'feature-unlimited',
            title: 'Go Unlimited',
            description: `Unlimited premium polls for 1 year. Best value at ${loading ? '...' : `${prices.symbol}${prices.unlimited} ${currency}`}`,
            cta: 'Get Unlimited',
            href: '/.netlify/functions/vg-checkout?tier=unlimited',
            icon: Star,
            gradient: 'from-amber-500 to-orange-500',
        },
    ];

    const [currentAdIndex] = useState(() => Math.floor(Math.random() * adSlots.length));
    const currentAd = adSlots[currentAdIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <NavHeader />
            
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Success Message */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                        <CheckCircle className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Poll Created Successfully! 🎉</h1>
                    <p className="text-indigo-200">Your poll is ready to share. Just one more step...</p>
                </motion.div>

                {/* Main Ad Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
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

                    <div className="p-6">
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

                        <a href={currentAd.href} className={`block w-full py-4 bg-gradient-to-r ${currentAd.gradient} text-white font-bold rounded-xl text-center hover:shadow-lg transition`}>
                            {currentAd.cta} <ArrowRight className="inline ml-2" size={18} />
                        </a>
                    </div>
                </motion.div>

                {/* Countdown / Skip Button */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
                    <AnimatePresence mode="wait">
                        {!canSkip ? (
                            <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-full text-white">
                                <Clock size={20} className="text-indigo-300" />
                                <span>Continue in <strong className="text-xl">{countdown}</strong> seconds</span>
                            </motion.div>
                        ) : (
                            <motion.button key="skip" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={handleContinue}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                Continue to My Poll <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <p className="text-indigo-300/60 text-sm mt-4">Free polls supported by sponsors</p>
                </motion.div>

                {/* Ad Placeholders */}
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

                {/* Skip Ads */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-emerald-300 font-bold mb-1">Skip Ads Forever</h3>
                            <p className="text-emerald-200/70 text-sm">Paid plans include ad-free experience. Your voters see a clean, professional poll.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdWall;
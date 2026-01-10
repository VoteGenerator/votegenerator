// ============================================================================
// VoterAdWall.tsx - Ad interstitial for voters on free polls
// Shows: Before viewing poll AND after voting (before results)
// Location: src/components/VoterAdWall.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock, Zap, Check, Sparkles, ArrowRight,
    BarChart3, Users, Vote, Heart, Coffee
} from 'lucide-react';

interface VoterAdWallProps {
    variant: 'before-poll' | 'after-vote';
    pollTitle?: string;
    onComplete: () => void;
    countdownSeconds?: number;
}

const VoterAdWall: React.FC<VoterAdWallProps> = ({ 
    variant, 
    pollTitle,
    onComplete,
    countdownSeconds = 10
}) => {
    const [countdown, setCountdown] = useState(countdownSeconds);
    const [canSkip, setCanSkip] = useState(false);
    
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
        onComplete();
    };

    // Different content based on variant
    const isBeforePoll = variant === 'before-poll';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-4">
                        <Clock size={16} />
                        {canSkip ? 'Ready!' : `${countdown} seconds...`}
                    </div>
                    
                    {isBeforePoll ? (
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Loading Your Poll 📊
                            </h1>
                            <p className="text-white/60">
                                Free polls are supported by a short wait
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Vote Recorded! ✓
                            </h1>
                            <p className="text-white/60">
                                See results in just a moment...
                            </p>
                        </>
                    )}
                </motion.div>
                
                {/* Ad Content - Business Plan Promo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 mb-6"
                >
                    <div className="text-center">
                        {/* Different messaging per variant */}
                        {isBeforePoll ? (
                            <>
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                                    <Vote size={28} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Want Ad-Free Polls?
                                </h2>
                                <p className="text-white/70 text-sm mb-4">
                                    Create unlimited polls with instant access for your voters. No waiting, no ads.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                    <BarChart3 size={28} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Need Polls for Your Team?
                                </h2>
                                <p className="text-white/70 text-sm mb-4">
                                    Create instant polls, surveys, and votes. Your audience sees results immediately.
                                </p>
                            </>
                        )}
                        
                        {/* Feature highlights */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-left">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Check size={14} className="text-emerald-400" />
                                <span>No ads for voters</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Check size={14} className="text-emerald-400" />
                                <span>Instant results</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Check size={14} className="text-emerald-400" />
                                <span>Up to 100K responses</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Check size={14} className="text-emerald-400" />
                                <span>Unlimited polls</span>
                            </div>
                        </div>
                        
                        <a
                            href="/pricing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl transition-all text-center"
                        >
                            Create Your Own Polls →
                        </a>
                        
                        <p className="text-white/40 text-xs mt-3">
                            Pro $19/mo or $190/year • Business $490/year
                        </p>
                    </div>
                </motion.div>
                
                {/* Powered by badge */}
                <div className="text-center mb-4">
                    <a 
                        href="https://votegenerator.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-xs transition"
                    >
                        <img 
                            src="/logo.svg" 
                            alt="" 
                            className="w-4 h-4 opacity-50"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        Powered by VoteGenerator
                    </a>
                </div>
                
                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4"
                >
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: countdownSeconds, ease: 'linear' }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                    </div>
                </motion.div>
                
                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={handleContinue}
                        disabled={!canSkip}
                        className={`w-full py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                            canSkip 
                                ? 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] shadow-lg' 
                                : 'bg-white/20 text-white/40 cursor-not-allowed'
                        }`}
                    >
                        {canSkip ? (
                            <>
                                {isBeforePoll ? 'View Poll' : 'See Results'}
                                <ArrowRight size={20} />
                            </>
                        ) : (
                            <>
                                <Clock size={20} />
                                {isBeforePoll ? `View poll in ${countdown}s` : `Results in ${countdown}s`}
                            </>
                        )}
                    </button>
                    
                    {/* Friendly message */}
                    <p className="text-white/40 text-xs mt-4 flex items-center justify-center gap-1">
                        <Heart size={12} className="text-pink-400" />
                        Thanks for supporting free polls
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default VoterAdWall;
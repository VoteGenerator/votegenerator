// ============================================================================
// AdWall.tsx - Ad wall / interstitial page
// Can be used as: 1) Standalone page at /ad-wall, or 2) Overlay before results
// Location: src/components/AdWall.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ArrowRight, Sparkles, ExternalLink, Clock, Zap, PieChart, TrendingUp } from 'lucide-react';

interface AdWallProps {
    // Optional - if not provided, redirects to homepage after countdown
    onContinue?: () => void;
    pollTitle?: string;
    // Pass the poll creator's tier to determine if ads should show
    creatorTier?: 'free' | 'pro' | 'business';
    // Alternative: Pass hideBranding directly from poll settings
    hideBranding?: boolean;
    // Vote count preview
    voteCount?: number;
}

// Fun generating messages for paid users
const generatingMessages = [
    { text: "Gathering all responses...", icon: "📥" },
    { text: "Analyzing voting patterns...", icon: "🔍" },
    { text: "Calculating percentages...", icon: "📊" },
    { text: "Determining the winner...", icon: "🏆" },
    { text: "Rendering beautiful charts...", icon: "✨" },
];

const AdWall: React.FC<AdWallProps> = ({ 
    onContinue,
    pollTitle = 'Poll Results',
    creatorTier = 'free',
    hideBranding = false,
    voteCount = 0
}) => {
    const [countdown, setCountdown] = useState(5);
    const [canContinue, setCanContinue] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    
    // Determine if this is a paid poll (no ads)
    const isPaidPoll = creatorTier === 'pro' || creatorTier === 'business' || hideBranding;
    
    // For paid polls, show fun generating messages (3 seconds)
    const waitTime = isPaidPoll ? 3 : 5;
    
    // Default handler if none provided (standalone page mode)
    const handleContinue = () => {
        if (onContinue) {
            onContinue();
        } else {
            // Standalone page mode - redirect to homepage
            window.location.href = '/';
        }
    };
    
    useEffect(() => {
        setCountdown(waitTime);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanContinue(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [waitTime]);
    
    // Cycle through generating messages for paid users
    useEffect(() => {
        if (!isPaidPoll) return;
        
        const messageTimer = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % generatingMessages.length);
        }, 600);
        
        return () => clearInterval(messageTimer);
    }, [isPaidPoll]);
    
    // ========================================================================
    // PAID POLL: Show branded loading with fun messages (no ads)
    // ========================================================================
    if (isPaidPoll) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    {/* Loading Animation */}
                    <motion.div
                        className="w-24 h-24 mx-auto mb-6 relative"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                            <BarChart3 size={32} className="text-indigo-600" />
                        </div>
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-slate-800 mb-2"
                    >
                        {pollTitle}
                    </motion.h1>
                    
                    {voteCount > 0 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-slate-500 text-sm mb-6"
                        >
                            {voteCount.toLocaleString()} response{voteCount !== 1 ? 's' : ''} recorded
                        </motion.p>
                    )}
                    
                    {/* Fun generating messages */}
                    {!canContinue && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6"
                        >
                            {/* Progress bar */}
                            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: 'easeInOut' }}
                                />
                            </div>
                            
                            {/* Cycling messages */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={messageIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg">{generatingMessages[messageIndex].icon}</span>
                                    <span className="text-sm font-medium text-slate-600">
                                        {generatingMessages[messageIndex].text}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {/* Continue button when ready */}
                    <AnimatePresence>
                        {canContinue && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleContinue}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                            >
                                View Results
                                <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    
                    {/* Subtle branding for Pro */}
                    {creatorTier === 'pro' && !hideBranding && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 text-xs text-slate-400"
                        >
                            Powered by <a href="/" className="text-indigo-500 hover:text-indigo-600">VoteGenerator</a>
                        </motion.p>
                    )}
                </motion.div>
            </div>
        );
    }
    
    // ========================================================================
    // FREE POLL: Show ad wall with countdown
    // ========================================================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-3">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieChart size={20} className="text-indigo-500" />
                        <span className="font-semibold text-slate-700">View Results</span>
                    </div>
                    {!canContinue && (
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock size={16} />
                            <span className="text-sm font-medium">{countdown}s</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="max-w-lg w-full">
                    {/* Results preview */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center"
                        >
                            <TrendingUp size={36} className="text-indigo-600" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            {pollTitle}
                        </h2>
                        {voteCount > 0 && (
                            <p className="text-slate-500 text-sm">
                                {voteCount.toLocaleString()} vote{voteCount !== 1 ? 's' : ''} recorded
                            </p>
                        )}
                    </div>
                    
                    {/* Ad placeholder */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-3 text-center">
                            Sponsored
                        </p>
                        
                        {/* AdSense container */}
                        <div 
                            className="min-h-[250px] bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200"
                            id="results-ad-container"
                        >
                            <div className="text-center text-slate-400">
                                <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Advertisement</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Promo for VoteGenerator */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                    Need to run a poll or survey?
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Free • No signup • Instant results
                                </p>
                                <a 
                                    href="/" 
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-2 hover:text-indigo-700"
                                >
                                    Create Free Poll <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* Continue button */}
                    <motion.button
                        onClick={handleContinue}
                        disabled={!canContinue}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                            canContinue
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {canContinue ? (
                            <>
                                View Results
                                <ArrowRight size={20} />
                            </>
                        ) : (
                            <>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold">
                                    {countdown}
                                </div>
                                Loading results...
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-white border-t border-slate-200 px-4 py-3">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xs text-slate-400">
                        Powered by <a href="/" className="text-indigo-500 hover:text-indigo-600 font-medium">VoteGenerator</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdWall;
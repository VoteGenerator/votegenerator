// ============================================================================
// AdWall.tsx - Ad wall / interstitial page
// Can be used as: 1) Standalone page at /ad-wall, or 2) Overlay before results
// Location: src/components/AdWall.tsx
//
// FIXES applied:
//   1. Standalone page now reads ?redirect= from URL and uses it in handleContinue
//      (previously always redirected to homepage '/')
//   2. Button label is context-aware:
//      - "Go to Dashboard" when redirect target contains /admin (poll creator flow)
//      - "View Results"   when redirect target is a results page (voter flow)
//      - "Get Started"    when no redirect is set (generic fallback)
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, ArrowRight, Clock, Zap, LayoutDashboard,
    TrendingUp, CheckCircle2, Users, Sparkles
} from 'lucide-react';

interface AdWallProps {
    onContinue?: () => void;
    pollTitle?: string;
    creatorTier?: 'free' | 'pro' | 'business';
    hideBranding?: boolean;
    voteCount?: number;
}

const generatingMessages = [
    { text: 'Gathering all responses...', icon: '📥' },
    { text: 'Analyzing voting patterns...', icon: '🔍' },
    { text: 'Calculating percentages...', icon: '📊' },
    { text: 'Determining the winner...', icon: '🏆' },
    { text: 'Rendering beautiful charts...', icon: '✨' },
];

// ─── helpers ────────────────────────────────────────────────────────────────

/** Read and decode the ?redirect= query param from the current URL */
function getRedirectParam(): string | null {
    try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('redirect');
        return raw ? decodeURIComponent(raw) : null;
    } catch {
        return null;
    }
}

/** Decide what the CTA button should say based on where we're going */
function getContinueLabel(redirectUrl: string | null): string {
    if (!redirectUrl) return 'Get Started';
    if (redirectUrl.includes('/admin')) return 'Go to Dashboard';
    return 'View Results';
}

// ─── component ──────────────────────────────────────────────────────────────

const AdWall: React.FC<AdWallProps> = ({
    onContinue,
    pollTitle = 'Poll Results',
    creatorTier = 'free',
    hideBranding = false,
    voteCount = 0,
}) => {
    const [countdown, setCountdown] = useState(5);
    const [canContinue, setCanContinue] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const isPaidPoll = creatorTier === 'pro' || creatorTier === 'business' || hideBranding;
    const waitTime = isPaidPoll ? 3 : 5;

    // ── FIX 1: read redirect param so standalone /ad-wall page routes correctly
    const redirectUrl = getRedirectParam();

    // ── FIX 2: context-aware button label
    const continueLabel = getContinueLabel(redirectUrl);
    const ContinueIcon = redirectUrl?.includes('/admin') ? LayoutDashboard : ArrowRight;

    const handleContinue = () => {
        if (onContinue) {
            onContinue();
        } else if (redirectUrl) {
            window.location.href = redirectUrl;   // ← was always '/' before fix
        } else {
            window.location.href = '/';
        }
    };

    useEffect(() => {
        setCountdown(waitTime);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timer); setCanContinue(true); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [waitTime]);

    useEffect(() => {
        if (!isPaidPoll) return;
        const t = setInterval(() => setMessageIndex(p => (p + 1) % generatingMessages.length), 600);
        return () => clearInterval(t);
    }, [isPaidPoll]);

    // ════════════════════════════════════════════════════════════════════════
    // PAID: elegant loading screen — no ads
    // ════════════════════════════════════════════════════════════════════════
    if (isPaidPoll) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <motion.div className="w-24 h-24 mx-auto mb-6 relative">
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

                    {!canContinue && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3, ease: 'easeInOut' }}
                                />
                            </div>
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

                    <AnimatePresence>
                        {canContinue && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleContinue}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                            >
                                {continueLabel}
                                <ContinueIcon size={20} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {creatorTier === 'pro' && !hideBranding && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 text-xs text-slate-400"
                        >
                            Powered by{' '}
                            <a href="/" className="text-indigo-500 hover:text-indigo-600">
                                VoteGenerator
                            </a>
                        </motion.p>
                    )}
                </motion.div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════════════
    // FREE: ad wall — redesigned
    // ════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">

            {/* ── Top bar ── */}
            <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <TrendingUp size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm tracking-tight">VoteGenerator</span>
                </div>
                <div className="flex items-center gap-2">
                    {!canContinue ? (
                        <div className="flex items-center gap-1.5 bg-slate-800 rounded-full px-3 py-1.5">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-xs font-semibold text-slate-300 tabular-nums">
                                {countdown}s
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400">Ready</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 gap-6">

                {/* Poll identity card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                        <BarChart3 size={22} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Your poll
                        </p>
                        <p className="text-white font-semibold text-base leading-tight truncate">
                            {pollTitle}
                        </p>
                        {voteCount > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <Users size={11} className="text-indigo-400" />
                                <span className="text-xs text-indigo-400 font-medium">
                                    {voteCount.toLocaleString()} vote{voteCount !== 1 ? 's' : ''} so far
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Ad slot */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold text-center mb-3">
                        Sponsored
                    </p>
                    <div
                        id="results-ad-container"
                        className="w-full min-h-[250px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center"
                    >
                        {/* AdSense script renders here — placeholder shown only when no ad loads */}
                        <div className="text-center py-10 px-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={24} className="text-slate-600" />
                            </div>
                            <p className="text-slate-600 text-sm font-medium">Advertisement</p>
                            <p className="text-slate-700 text-xs mt-1">Keeps VoteGenerator free for everyone</p>
                        </div>
                    </div>
                </motion.div>

                {/* Upgrade nudge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-md rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex items-center gap-4"
                >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                        <Zap size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">
                            Skip ads on every poll
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Upgrade for ad-free experience, unlimited polls &amp; more
                        </p>
                    </div>
                    <a
                        href="/pricing"
                        className="flex-shrink-0 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
                    >
                        See plans →
                    </a>
                </motion.div>

                {/* CTA button */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-md"
                >
                    <motion.button
                        onClick={handleContinue}
                        disabled={!canContinue}
                        whileTap={canContinue ? { scale: 0.98 } : undefined}
                        className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                            canContinue
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        {canContinue ? (
                            <>
                                {continueLabel}
                                <ContinueIcon size={18} />
                            </>
                        ) : (
                            <>
                                <span className="tabular-nums">
                                    {countdown}s
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-400 font-normal">Just a moment...</span>
                            </>
                        )}
                    </motion.button>
                </motion.div>

            </div>

            {/* ── Footer ── */}
            <div className="border-t border-slate-800 px-5 py-4 text-center">
                <p className="text-xs text-slate-600">
                    Powered by{' '}
                    <a href="/" className="text-slate-500 hover:text-slate-400 font-medium transition-colors">
                        VoteGenerator
                    </a>
                    {' '}· Free, ad-supported polling
                </p>
            </div>
        </div>
    );
};

export default AdWall;
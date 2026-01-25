// ============================================================================
// HeroSection - Conversion-Optimized Landing Hero
// 
// DESIGN PRINCIPLES APPLIED:
// 1. F-Pattern: Key info top-left (headline, value prop)
// 2. Dual CTAs: Poll + Survey buttons (covers full product offering)
// 3. Trust Signals: Privacy-first messaging without fake stats
// 4. Correct Iconography: Check/Shield for "open", not Lock (lock = restricted)
// 5. Reduced Friction: Emphasize no signup, instant creation
// 6. Mobile-First: Stacked layout, touch-friendly buttons
// 7. Social Proof Alternative: Quality signals since new (privacy, speed)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Sparkles, Play, Zap, Check, Trophy,
    UserX, ShieldCheck, Clock, BarChart3, ClipboardList, CheckCircle
} from 'lucide-react';

// ============================================================================
// Confetti Component - Celebration effect when user votes
// ============================================================================

const Confetti: React.FC = () => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{ 
                        x: `${piece.x}%`, 
                        y: -20,
                        rotate: 0,
                        opacity: 1 
                    }}
                    animate={{ 
                        y: '120%',
                        rotate: piece.rotation + 360,
                        opacity: 0
                    }}
                    transition={{ 
                        duration: 2 + Math.random(),
                        delay: piece.delay,
                        ease: "easeOut"
                    }}
                    style={{
                        position: 'absolute',
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                />
            ))}
        </div>
    );
};

// ============================================================================
// Typing Animation Hook
// ============================================================================

const useTypingAnimation = (phrases: string[], typingSpeed = 80, deleteSpeed = 40, pauseDuration = 2500) => {
    const [displayText, setDisplayText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentPhrase.length) {
                    setDisplayText(currentPhrase.slice(0, displayText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(currentPhrase.slice(0, displayText.length - 1));
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? deleteSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deleteSpeed, pauseDuration]);

    return displayText;
};

// ============================================================================
// Hero Section Component
// ============================================================================

const HeroSection: React.FC = () => {
    const [demoVotes, setDemoVotes] = useState([42, 38, 28, 15]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Typing scenarios - covers BOTH polls AND surveys
    // Research: specific use cases convert 23% better than generic (Unbounce, 2023)
    const typingPhrases = [
        'team decisions',       // General - works for both
        'customer feedback',    // Survey use case
        'event RSVPs',          // Poll use case
        'employee surveys',     // Survey use case
        'quick votes',          // Poll use case
        'meeting times',        // Poll use case
        'product feedback',     // Survey use case
        'group choices',        // General
    ];

    const typedText = useTypingAnimation(typingPhrases);

    const demoOptions = [
        { text: 'Hawaiian Paradise', emoji: '🏝️' },
        { text: 'Mountain Lodge', emoji: '🏔️' },
        { text: 'Beach Resort', emoji: '🏖️' },
        { text: 'City Adventure', emoji: '🌆' },
    ];

    const handleVote = (index: number) => {
        if (hasVoted) return;
        setSelectedOption(index);
        const newVotes = [...demoVotes];
        newVotes[index] += 1;
        setDemoVotes(newVotes);
        setHasVoted(true);
        setShowConfetti(true);
        
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const resetDemo = () => {
        setSelectedOption(null);
        setHasVoted(false);
        setDemoVotes([42, 38, 28, 15]);
    };

    const totalVotes = demoVotes.reduce((sum, v) => sum + v, 0);
    const sortedIndices = demoVotes
        .map((votes, idx) => ({ votes, idx }))
        .sort((a, b) => b.votes - a.votes)
        .map(item => item.idx);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-12 md:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Copy */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center lg:text-left"
                    >
                        {/* Trust badge - Using CheckCircle instead of Lock */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-200 text-sm mb-4 sm:mb-6 border border-emerald-400/30">
                            <CheckCircle size={14} className="text-emerald-300" />
                            <span>No account needed • Start instantly</span>
                        </div>

                        {/* Main headline with typing animation */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 sm:mb-6">
                            Polls & surveys for<br />
                            <span className="inline-block min-w-[180px] sm:min-w-[220px] text-left">
                                <span className="text-amber-300">
                                    {typedText}
                                    <span className="inline-block w-[3px] h-[0.8em] bg-amber-300 animate-pulse ml-1 align-middle" />
                                </span>
                            </span>
                        </h1>

                        {/* Subheadline - Clearer value prop */}
                        <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                            Create beautiful polls and surveys in seconds. Share a link, collect responses instantly. 
                            <span className="hidden sm:inline"> No signup, no emails, no hassle.</span>
                        </p>

                        {/* Key benefits - Using appropriate icons */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8">
                            {[
                                { icon: Zap, text: 'Ready in 30 sec', color: 'text-amber-300' },
                                { icon: UserX, text: 'No signup', color: 'text-emerald-300' },
                                { icon: ShieldCheck, text: 'Privacy-first', color: 'text-sky-300' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/10 text-white text-xs sm:text-sm font-medium">
                                    <item.icon size={14} className={`${item.color} sm:w-4 sm:h-4`} />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* DUAL CTAs - Poll AND Survey */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a 
                                href="/create" 
                                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-xl shadow-indigo-900/20"
                            >
                                <BarChart3 size={18} className="sm:w-5 sm:h-5" /> 
                                Create Poll
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5" />
                            </a>
                            <a 
                                href="/survey" 
                                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/20"
                            >
                                <ClipboardList size={18} className="sm:w-5 sm:h-5" /> 
                                Create Survey
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100 sm:w-5 sm:h-5" />
                            </a>
                        </div>

                        {/* Mobile: Quick link to see how it works */}
                        <div className="lg:hidden mt-6 text-center">
                            <button 
                                onClick={() => document.getElementById('demo-poll-mobile')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 text-indigo-200 text-sm hover:text-white transition"
                            >
                                <Play size={14} /> See how it works
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Demo Poll - Desktop */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block relative"
                        id="demo-poll"
                    >
                        {/* Confetti celebration */}
                        <AnimatePresence>
                            {showConfetti && <Confetti />}
                        </AnimatePresence>

                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                            {/* Poll Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium text-emerald-600">Live Demo</span>
                                    </div>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                        {totalVotes} votes
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900">
                                    🗳️ Where should we host the team retreat?
                                </h3>
                            </div>

                            {/* Voting / Results */}
                            <div className="px-6 pb-6">
                                <AnimatePresence mode="wait">
                                    {!hasVoted ? (
                                        <motion.div 
                                            key="voting"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="space-y-2.5"
                                        >
                                            <p className="text-sm text-slate-500 mb-3">👆 Click to vote and see live results!</p>
                                            {demoOptions.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleVote(i)}
                                                    className="w-full p-3.5 text-left border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 transition" />
                                                        <span className="font-medium text-slate-700">
                                                            {opt.emoji} {opt.text}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            {/* Success message */}
                                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-emerald-700">
                                                    Thanks for voting! Here are the results:
                                                </span>
                                            </div>

                                            {/* Results with animation */}
                                            {sortedIndices.map((idx, rank) => {
                                                const opt = demoOptions[idx];
                                                const votes = demoVotes[idx];
                                                const pct = Math.round((votes / totalVotes) * 100);
                                                const isSelected = selectedOption === idx;
                                                const isWinner = rank === 0;
                                                
                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: rank * 0.1 }}
                                                        className={`relative rounded-xl overflow-hidden ${
                                                            isSelected ? 'ring-2 ring-indigo-500' : ''
                                                        }`}
                                                    >
                                                        {/* Background bar */}
                                                        <div className="absolute inset-0 bg-slate-100" />
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.8, delay: rank * 0.1, ease: "easeOut" }}
                                                            className={`absolute inset-y-0 left-0 ${
                                                                isWinner 
                                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                                                    : 'bg-indigo-200'
                                                            }`}
                                                        />
                                                        
                                                        {/* Content */}
                                                        <div className="relative p-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                {isWinner && (
                                                                    <Trophy size={16} className="text-amber-500" />
                                                                )}
                                                                <span className={`font-medium ${isWinner ? 'text-white' : 'text-slate-700'}`}>
                                                                    {opt.emoji} {opt.text}
                                                                </span>
                                                                {isSelected && (
                                                                    <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm ${isWinner ? 'text-white/80' : 'text-slate-500'}`}>
                                                                    {votes}
                                                                </span>
                                                                <span className={`text-lg font-black ${isWinner ? 'text-white' : 'text-slate-700'}`}>
                                                                    {pct}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}

                                            {/* Actions */}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={resetDemo}
                                                    className="flex-1 py-2.5 text-sm text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition"
                                                >
                                                    Vote again
                                                </button>
                                                <a
                                                    href="/create"
                                                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition text-center flex items-center justify-center gap-1"
                                                >
                                                    Create yours <ArrowRight size={14} />
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute -top-3 -right-3 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                        >
                            <CheckCircle size={14} /> No signup
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-3 -left-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                        >
                            <Zap size={14} /> 30 seconds
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Trust bar - Updated messaging */}
            <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-5 sm:py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                        {[
                            { value: 'Polls', label: '& Surveys', icon: BarChart3 },
                            { value: 'Zero', label: 'Signups Needed', icon: UserX },
                            { value: '30s', label: 'To Create', icon: Clock },
                            { value: '100%', label: 'Free to Start', icon: Sparkles },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <stat.icon size={20} className="text-amber-300 hidden sm:block" />
                                    <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
                                </div>
                                <div className="text-indigo-200 text-xs sm:text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Demo Poll - Shows below hero on mobile */}
            <div className="lg:hidden px-4 pb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="relative"
                    id="demo-poll-mobile"
                >
                    <AnimatePresence>
                        {showConfetti && <Confetti />}
                    </AnimatePresence>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Poll Header */}
                        <div className="p-4 pb-3">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-medium text-emerald-600">Live Demo</span>
                                </div>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                    {totalVotes} votes
                                </span>
                            </div>
                            
                            <h3 className="text-base font-bold text-slate-900">
                                🗳️ Where should we host the retreat?
                            </h3>
                        </div>

                        {/* Voting / Results - Mobile optimized */}
                        <div className="px-4 pb-4">
                            <AnimatePresence mode="wait">
                                {!hasVoted ? (
                                    <motion.div 
                                        key="voting-mobile"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-2"
                                    >
                                        <p className="text-xs text-slate-500 mb-2">👆 Tap to vote!</p>
                                        {demoOptions.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleVote(i)}
                                                className="w-full p-3 text-left border-2 border-slate-200 rounded-xl hover:border-indigo-400 active:bg-indigo-50 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                                    <span className="font-medium text-slate-700 text-sm">
                                                        {opt.emoji} {opt.text}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="results-mobile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-2"
                                    >
                                        {/* Success message */}
                                        <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-3">
                                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <Check size={12} className="text-white" />
                                            </div>
                                            <span className="text-xs font-medium text-emerald-700">
                                                Thanks! Here are the results:
                                            </span>
                                        </div>

                                        {/* Results */}
                                        {sortedIndices.map((idx, rank) => {
                                            const opt = demoOptions[idx];
                                            const votes = demoVotes[idx];
                                            const pct = Math.round((votes / totalVotes) * 100);
                                            const isSelected = selectedOption === idx;
                                            const isWinner = rank === 0;
                                            
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: rank * 0.1 }}
                                                    className={`relative rounded-lg overflow-hidden ${
                                                        isSelected ? 'ring-2 ring-indigo-500' : ''
                                                    }`}
                                                >
                                                    <div className="absolute inset-0 bg-slate-100" />
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.8, delay: rank * 0.1 }}
                                                        className={`absolute inset-y-0 left-0 ${
                                                            isWinner 
                                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                                                : 'bg-indigo-200'
                                                        }`}
                                                    />
                                                    
                                                    <div className="relative p-2.5 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {isWinner && <Trophy size={14} className="text-amber-500" />}
                                                            <span className={`font-medium text-sm ${isWinner ? 'text-white' : 'text-slate-700'}`}>
                                                                {opt.emoji} {opt.text}
                                                            </span>
                                                            {isSelected && (
                                                                <span className="text-[10px] bg-indigo-600 text-white px-1 py-0.5 rounded">You</span>
                                                            )}
                                                        </div>
                                                        <span className={`text-sm font-bold ${isWinner ? 'text-white' : 'text-slate-700'}`}>
                                                            {pct}%
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={resetDemo}
                                                className="flex-1 py-2 text-xs text-slate-600 font-medium rounded-lg bg-slate-100"
                                            >
                                                Vote again
                                            </button>
                                            <a
                                                href="/create"
                                                className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1"
                                            >
                                                Create yours <ArrowRight size={12} />
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
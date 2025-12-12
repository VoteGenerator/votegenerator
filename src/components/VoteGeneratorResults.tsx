import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, ChevronRight, Play, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import type { RunoffResult } from '../types';
import confetti from 'canvas-confetti';

interface VoteGeneratorResultsProps {
    runoffResult: RunoffResult;
    pollTitle: string;
}

const VoteGeneratorResults: React.FC<VoteGeneratorResultsProps> = ({ runoffResult, pollTitle }) => {
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [showVoteFlow, setShowVoteFlow] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { rounds, winner, totalVotes } = runoffResult;
    const currentRound = rounds[currentRoundIndex];
    const isLastRound = currentRoundIndex === rounds.length - 1;

    // Auto-play through rounds
    useEffect(() => {
        if (!autoPlay || isLastRound) return;
        
        const timer = setTimeout(() => {
            advanceRound();
        }, 2500);

        return () => clearTimeout(timer);
    }, [autoPlay, currentRoundIndex, isLastRound]);

    // Confetti on winner
    useEffect(() => {
        if (isLastRound && currentRound.winnerId && !hasShownConfetti) {
            setHasShownConfetti(true);
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
                });
            }, 500);
        }
    }, [isLastRound, currentRound.winnerId, hasShownConfetti]);

    const advanceRound = () => {
        if (isLastRound) return;
        
        setIsAnimating(true);
        setShowVoteFlow(true);

        // Show vote redistribution animation
        setTimeout(() => {
            setShowVoteFlow(false);
            setCurrentRoundIndex(prev => prev + 1);
            setIsAnimating(false);
        }, 1500);
    };

    const resetAnimation = () => {
        setCurrentRoundIndex(0);
        setAutoPlay(false);
        setHasShownConfetti(false);
    };

    const startAutoPlay = () => {
        setAutoPlay(true);
        if (currentRoundIndex === rounds.length - 1) {
            resetAnimation();
        }
    };

    // Calculate max votes for bar scaling
    const maxVotes = Math.max(...currentRound.standings.map(s => s.voteCount));
    const majorityThreshold = Math.ceil(totalVotes / 2);

    return (
        <div ref={containerRef} className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4"
                >
                    <Users size={16} />
                    {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast
                </motion.div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">{pollTitle}</h1>
                <p className="text-slate-500">Ranked Choice Results</p>
            </div>

            {/* Round Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                {rounds.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => !isAnimating && setCurrentRoundIndex(idx)}
                        className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                            idx === currentRoundIndex
                                ? 'bg-indigo-600 text-white scale-110'
                                : idx < currentRoundIndex
                                ? 'bg-indigo-200 text-indigo-700'
                                : 'bg-slate-200 text-slate-400'
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            {/* Round Label */}
            <div className="text-center mb-6">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                    {isLastRound && currentRound.winnerId ? (
                        <span className="text-emerald-600">🎉 Winner Determined!</span>
                    ) : (
                        `Round ${currentRound.roundNumber} of ${rounds.length}`
                    )}
                </span>
                {!isLastRound && currentRound.eliminated && (
                    <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                    >
                        Lowest option will be eliminated...
                    </motion.p>
                )}
            </div>

            {/* Majority Line Indicator */}
            <div className="relative mb-2 px-4">
                <div className="flex items-center justify-end text-xs text-slate-400">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                        Majority: {majorityThreshold} votes (50%+)
                    </span>
                </div>
            </div>

            {/* Results Bars */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                    {currentRound.standings
                        .sort((a, b) => b.voteCount - a.voteCount)
                        .map((standing, index) => (
                            <motion.div
                                key={standing.optionId}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                    opacity: standing.isEliminated ? 0.4 : 1, 
                                    x: 0,
                                    scale: standing.isWinner ? 1.02 : 1
                                }}
                                exit={{ opacity: 0, x: 50, height: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative ${standing.isEliminated ? 'grayscale' : ''}`}
                            >
                                {/* Winner Crown */}
                                {standing.isWinner && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute -left-2 -top-2 z-10"
                                    >
                                        <div className="bg-amber-400 rounded-full p-1.5 shadow-lg">
                                            <Trophy size={16} className="text-amber-900" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Eliminated Badge */}
                                {standing.isEliminated && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -right-2 -top-2 z-10"
                                    >
                                        <div className="bg-red-500 rounded-full p-1 shadow-lg">
                                            <XCircle size={14} className="text-white" />
                                        </div>
                                    </motion.div>
                                )}

                                <div className={`rounded-xl p-4 border-2 transition-all ${
                                    standing.isWinner 
                                        ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-100' 
                                        : standing.isEliminated
                                        ? 'border-slate-200 bg-slate-50'
                                        : 'border-slate-200 bg-white'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-bold ${
                                            standing.isWinner ? 'text-emerald-700' : 'text-slate-700'
                                        }`}>
                                            {standing.optionText}
                                        </span>
                                        <span className={`font-black text-lg ${
                                            standing.isWinner ? 'text-emerald-600' : 'text-indigo-600'
                                        }`}>
                                            {standing.voteCount} <span className="text-sm font-normal text-slate-400">({standing.percentage}%)</span>
                                        </span>
                                    </div>
                                    
                                    {/* Vote Bar */}
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
                                        {/* Majority line */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-0.5 bg-slate-300 z-10"
                                            style={{ left: `${(majorityThreshold / maxVotes) * 100}%` }}
                                        />
                                        
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ 
                                                width: `${maxVotes > 0 ? (standing.voteCount / maxVotes) * 100 : 0}%` 
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                                            className={`h-full rounded-full ${
                                                standing.isWinner 
                                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                                                    : standing.isEliminated
                                                    ? 'bg-slate-300'
                                                    : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>

                {/* Vote Flow Animation */}
                <AnimatePresence>
                    {showVoteFlow && currentRound.redistributedVotes && currentRound.redistributedVotes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                        >
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-xl">
                                <Sparkles className="inline mr-2" size={16} />
                                Redistributing votes to 2nd choices...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
                {!isLastRound ? (
                    <>
                        <button
                            onClick={startAutoPlay}
                            disabled={isAnimating}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Play size={18} /> {autoPlay ? 'Playing...' : 'Watch Runoff'}
                        </button>
                        <button
                            onClick={advanceRound}
                            disabled={isAnimating}
                            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            Next Round <ChevronRight size={18} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={resetAnimation}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={18} /> Watch Again
                    </button>
                )}
            </div>

            {/* Winner Announcement */}
            <AnimatePresence>
                {isLastRound && winner && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center text-white shadow-xl"
                    >
                        <Trophy className="mx-auto mb-4" size={48} />
                        <p className="text-emerald-100 uppercase tracking-wide text-sm font-bold mb-2">
                            The Group Has Spoken
                        </p>
                        <h2 className="text-3xl font-black mb-2">{winner.text}</h2>
                        <p className="text-emerald-100">
                            Won with majority support after {rounds.length} round{rounds.length > 1 ? 's' : ''}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* How It Works */}
            <div className="mt-8 bg-indigo-50 rounded-xl p-4 text-sm text-indigo-800">
                <strong className="block mb-1">How Ranked Choice Works:</strong>
                <p className="text-indigo-600">
                    If no option gets 50%+ in Round 1, the lowest option is eliminated and those votes 
                    transfer to each voter's next choice. This repeats until someone wins with majority support.
                </p>
            </div>
        </div>
    );
};

export default VoteGeneratorResults;

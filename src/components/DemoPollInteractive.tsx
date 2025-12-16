import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Users,
    GripVertical,
    Star
} from 'lucide-react';

interface DemoPollInteractiveProps {
    pollTypeId: string;
    question: string;
    options: string[];
    onCreateSimilar?: () => void;
}

// Seed votes - makes it look like real activity
const generateSeedVotes = (options: string[], total: number) => {
    const votes: Record<string, number> = {};
    let remaining = total;
    
    options.forEach((opt, i) => {
        if (i === options.length - 1) {
            votes[opt] = remaining;
        } else {
            const portion = Math.floor(Math.random() * (remaining / 2)) + Math.floor(remaining / options.length / 2);
            votes[opt] = portion;
            remaining -= portion;
        }
    });
    
    return votes;
};

// Bar Chart Component
const ResultsChart: React.FC<{ 
    votes: Record<string, number>; 
    options: string[];
    highlightOption?: string;
}> = ({ votes, options, highlightOption }) => {
    const total = Object.values(votes).reduce((sum, v) => sum + v, 0);
    const sortedOptions = [...options].sort((a, b) => (votes[b] || 0) - (votes[a] || 0));
    
    return (
        <div className="space-y-3">
            {sortedOptions.map((opt, i) => {
                const voteCount = votes[opt] || 0;
                const percentage = total > 0 ? Math.round((voteCount / total) * 100) : 0;
                const isWinner = i === 0 && percentage > 0;
                const isHighlighted = opt === highlightOption;
                
                return (
                    <motion.div 
                        key={opt}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${isWinner ? 'text-indigo-700' : 'text-slate-700'}`}>
                                {isWinner && '🏆 '}{opt}
                            </span>
                            <span className={`text-sm font-bold ${isWinner ? 'text-indigo-600' : 'text-slate-500'}`}>
                                {percentage}% ({voteCount})
                            </span>
                        </div>
                        <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`h-full rounded-lg ${
                                    isHighlighted 
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                                        : isWinner 
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                            : 'bg-gradient-to-r from-slate-300 to-slate-400'
                                }`}
                            />
                            {isHighlighted && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded"
                                >
                                    Your vote!
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Multiple Choice Demo
const MultipleChoiceDemo: React.FC<DemoPollInteractiveProps> = ({ question, options, onCreateSimilar }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState<Record<string, number>>({});
    
    useEffect(() => {
        // Initialize with seed votes
        setVotes(generateSeedVotes(options, 127));
    }, [options]);
    
    const handleVote = () => {
        if (selected) {
            setVotes(prev => ({
                ...prev,
                [selected]: (prev[selected] || 0) + 1
            }));
            setHasVoted(true);
        }
    };
    
    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
    
    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <h3 className="font-bold text-lg">{question}</h3>
                <div className="flex items-center gap-2 mt-1 text-blue-100 text-sm">
                    <Users size={14} />
                    <span>{totalVotes} votes</span>
                </div>
            </div>
            
            <div className="p-5">
                {!hasVoted ? (
                    <>
                        <p className="text-slate-500 text-sm mb-4">Select your choice:</p>
                        <div className="space-y-2 mb-4">
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setSelected(opt)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                        selected === opt
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-200 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selected === opt ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                                    }`}>
                                        {selected === opt && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="text-slate-700">{opt}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={!selected}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Vote →
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                            <Check size={18} />
                            <span className="font-medium">Thanks for voting!</span>
                        </div>
                        <ResultsChart votes={votes} options={options} highlightOption={selected || undefined} />
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <button
                                onClick={() => { setHasVoted(false); setSelected(null); }}
                                className="flex-1 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Vote Again (Demo)
                            </button>
                            <button
                                onClick={onCreateSimilar}
                                className="flex-1 py-2 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-200 transition-colors"
                            >
                                Create Your Own →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Ranked Choice Demo
const RankedChoiceDemo: React.FC<DemoPollInteractiveProps> = ({ question, options, onCreateSimilar }) => {
    const [ranking, setRanking] = useState(options);
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState<Record<string, number>>({});
    
    useEffect(() => {
        setVotes(generateSeedVotes(options, 89));
    }, [options]);
    
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newRanking = [...ranking];
        [newRanking[index - 1], newRanking[index]] = [newRanking[index], newRanking[index - 1]];
        setRanking(newRanking);
    };
    
    const handleVote = () => {
        // Weight by position (1st = 3 points, 2nd = 2, 3rd = 1 for 3 options)
        const newVotes = { ...votes };
        ranking.forEach((opt, i) => {
            const points = ranking.length - i;
            newVotes[opt] = (newVotes[opt] || 0) + points;
        });
        setVotes(newVotes);
        setHasVoted(true);
    };
    
    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);
    
    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                <h3 className="font-bold text-lg">{question}</h3>
                <div className="flex items-center gap-2 mt-1 text-indigo-100 text-sm">
                    <Users size={14} />
                    <span>{Math.floor(totalVotes / options.length)} rankings</span>
                </div>
            </div>
            
            <div className="p-5">
                {!hasVoted ? (
                    <>
                        <p className="text-slate-500 text-sm mb-4">Click options to reorder your ranking:</p>
                        <div className="space-y-2 mb-4">
                            {ranking.map((opt, i) => (
                                <button
                                    key={opt}
                                    onClick={() => moveUp(i)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
                                >
                                    <GripVertical size={18} className="text-slate-400" />
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                                        i === 0 ? 'bg-amber-400 text-amber-900' :
                                        i === 1 ? 'bg-slate-300 text-slate-700' :
                                        'bg-amber-600 text-white'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <span className="text-slate-700 flex-1">{opt}</span>
                                    {i > 0 && <span className="text-xs text-indigo-500">↑ Move up</span>}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleVote}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Submit Ranking →
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                            <Check size={18} />
                            <span className="font-medium">Ranking submitted!</span>
                        </div>
                        <ResultsChart votes={votes} options={options} highlightOption={ranking[0]} />
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <button
                                onClick={() => { setHasVoted(false); setRanking(options); }}
                                className="flex-1 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Rank Again (Demo)
                            </button>
                            <button
                                onClick={onCreateSimilar}
                                className="flex-1 py-2 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg hover:bg-indigo-200 transition-colors"
                            >
                                Create Your Own →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Rating Scale Demo
const RatingScaleDemo: React.FC<DemoPollInteractiveProps> = ({ question, options, onCreateSimilar }) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [hasVoted, setHasVoted] = useState(false);
    const [avgRatings, setAvgRatings] = useState<Record<string, { total: number; count: number }>>({});
    
    useEffect(() => {
        // Seed with random average ratings
        const seed: Record<string, { total: number; count: number }> = {};
        options.forEach(opt => {
            const count = Math.floor(Math.random() * 50) + 20;
            const avgStars = Math.random() * 2 + 3; // 3-5 stars average
            seed[opt] = { total: Math.round(avgStars * count), count };
        });
        setAvgRatings(seed);
    }, [options]);
    
    const handleVote = () => {
        const newAvg = { ...avgRatings };
        Object.entries(ratings).forEach(([opt, rating]) => {
            if (!newAvg[opt]) newAvg[opt] = { total: 0, count: 0 };
            newAvg[opt].total += rating;
            newAvg[opt].count += 1;
        });
        setAvgRatings(newAvg);
        setHasVoted(true);
    };
    
    const allRated = Object.keys(ratings).length === options.length;
    
    return (
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 text-white">
                <h3 className="font-bold text-lg">{question}</h3>
                <div className="flex items-center gap-2 mt-1 text-pink-100 text-sm">
                    <Users size={14} />
                    <span>{Object.values(avgRatings)[0]?.count || 0}+ ratings</span>
                </div>
            </div>
            
            <div className="p-5">
                {!hasVoted ? (
                    <>
                        <p className="text-slate-500 text-sm mb-4">Rate each option 1-5 stars:</p>
                        <div className="space-y-3 mb-4">
                            {options.map((opt) => (
                                <div key={opt} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                                    <span className="text-slate-700 text-sm">{opt}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setRatings({ ...ratings, [opt]: star })}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={22}
                                                    className={(ratings[opt] || 0) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={!allRated}
                            className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50"
                        >
                            Submit Ratings →
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-green-600 mb-4">
                            <Check size={18} />
                            <span className="font-medium">Ratings submitted!</span>
                        </div>
                        <div className="space-y-3">
                            {options.sort((a, b) => {
                                const avgA = avgRatings[a]?.total / avgRatings[a]?.count || 0;
                                const avgB = avgRatings[b]?.total / avgRatings[b]?.count || 0;
                                return avgB - avgA;
                            }).map((opt, i) => {
                                const avg = avgRatings[opt]?.total / avgRatings[opt]?.count || 0;
                                return (
                                    <motion.div
                                        key={opt}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                                    >
                                        <span className="text-slate-700 text-sm">{i === 0 && '🏆 '}{opt}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={16}
                                                        className={avg >= star ? 'text-amber-400 fill-amber-400' : avg >= star - 0.5 ? 'text-amber-400 fill-amber-200' : 'text-slate-300'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-slate-600">
                                                {avg.toFixed(1)}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                            <button
                                onClick={() => { setHasVoted(false); setRatings({}); }}
                                className="flex-1 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Rate Again (Demo)
                            </button>
                            <button
                                onClick={onCreateSimilar}
                                className="flex-1 py-2 bg-pink-100 text-pink-700 text-sm font-bold rounded-lg hover:bg-pink-200 transition-colors"
                            >
                                Create Your Own →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Main component that switches between demo types
const DemoPollInteractive: React.FC<DemoPollInteractiveProps> = (props) => {
    const handleCreateSimilar = () => {
        // Navigate to create page with this poll type pre-selected
        window.location.hash = '';
        // Could also pass poll type as param
    };
    
    const enhancedProps = {
        ...props,
        onCreateSimilar: props.onCreateSimilar || handleCreateSimilar
    };
    
    switch (props.pollTypeId) {
        case 'multiple-choice':
            return <MultipleChoiceDemo {...enhancedProps} />;
        case 'ranked-choice':
            return <RankedChoiceDemo {...enhancedProps} />;
        case 'rating-scale':
            return <RatingScaleDemo {...enhancedProps} />;
        default:
            return <MultipleChoiceDemo {...enhancedProps} />;
    }
};

export default DemoPollInteractive;
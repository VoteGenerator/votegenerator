import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    Users,
    GripVertical,
    Star,
    BarChart3,
    PieChart,
    Table,
    Trophy
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

// Color palette for charts
const CHART_COLORS = [
    { bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500', hex: '#6366f1' },
    { bg: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-500', hex: '#10b981' },
    { bg: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500', hex: '#f59e0b' },
    { bg: 'bg-rose-500', gradient: 'from-rose-500 to-pink-500', hex: '#f43f5e' },
    { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500', hex: '#06b6d4' },
    { bg: 'bg-violet-500', gradient: 'from-violet-500 to-purple-500', hex: '#8b5cf6' },
];

// Donut Chart Component
const DonutChart: React.FC<{ 
    votes: Record<string, number>; 
    options: string[];
    highlightOption?: string;
}> = ({ votes, options, highlightOption }) => {
    const total = Object.values(votes).reduce((sum, v) => sum + v, 0);
    const sortedOptions = [...options].sort((a, b) => (votes[b] || 0) - (votes[a] || 0));
    
    // Calculate donut segments
    let cumulativePercent = 0;
    const segments = sortedOptions.map((opt, i) => {
        const percent = total > 0 ? (votes[opt] || 0) / total * 100 : 0;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;
        return { opt, percent, startPercent, color: CHART_COLORS[i % CHART_COLORS.length] };
    });

    return (
        <div className="flex items-center gap-6">
            {/* Donut SVG */}
            <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {segments.map((seg, i) => {
                        const isHighlighted = seg.opt === highlightOption;
                        return (
                            <motion.circle
                                key={seg.opt}
                                cx="18"
                                cy="18"
                                r="14"
                                fill="none"
                                stroke={seg.color.hex}
                                strokeWidth={isHighlighted ? "4" : "3"}
                                strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
                                strokeDashoffset={-seg.startPercent}
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: `${seg.percent} ${100 - seg.percent}` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={isHighlighted ? "drop-shadow-lg" : ""}
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">{total}</div>
                        <div className="text-xs text-slate-500">votes</div>
                    </div>
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 space-y-2">
                {segments.map((seg, i) => {
                    const isWinner = i === 0;
                    const isHighlighted = seg.opt === highlightOption;
                    return (
                        <motion.div 
                            key={seg.opt}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-center gap-2 text-sm ${isHighlighted ? 'font-bold' : ''}`}
                        >
                            <div className={`w-3 h-3 rounded-full ${seg.color.bg}`} />
                            <span className={`flex-1 truncate ${isWinner ? 'text-slate-800' : 'text-slate-600'}`}>
                                {isWinner && <Trophy size={12} className="inline mr-1 text-amber-500" />}
                                {seg.opt}
                            </span>
                            <span className="font-semibold text-slate-700">{Math.round(seg.percent)}%</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Table View Component
const TableView: React.FC<{ 
    votes: Record<string, number>; 
    options: string[];
    highlightOption?: string;
}> = ({ votes, options, highlightOption }) => {
    const total = Object.values(votes).reduce((sum, v) => sum + v, 0);
    const sortedOptions = [...options].sort((a, b) => (votes[b] || 0) - (votes[a] || 0));
    
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-slate-600 font-semibold">#</th>
                        <th className="px-3 py-2 text-left text-slate-600 font-semibold">Option</th>
                        <th className="px-3 py-2 text-right text-slate-600 font-semibold">Votes</th>
                        <th className="px-3 py-2 text-right text-slate-600 font-semibold">%</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOptions.map((opt, i) => {
                        const voteCount = votes[opt] || 0;
                        const percentage = total > 0 ? Math.round((voteCount / total) * 100) : 0;
                        const isWinner = i === 0;
                        const isHighlighted = opt === highlightOption;
                        
                        return (
                            <motion.tr 
                                key={opt}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`border-t border-slate-100 ${isHighlighted ? 'bg-amber-50' : isWinner ? 'bg-indigo-50' : ''}`}
                            >
                                <td className="px-3 py-2.5">
                                    {isWinner ? (
                                        <span className="w-5 h-5 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            <Trophy size={12} />
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">{i + 1}</span>
                                    )}
                                </td>
                                <td className={`px-3 py-2.5 ${isWinner ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
                                    {opt}
                                    {isHighlighted && <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">You</span>}
                                </td>
                                <td className="px-3 py-2.5 text-right font-medium text-slate-800">{voteCount}</td>
                                <td className="px-3 py-2.5 text-right">
                                    <span className={`font-bold ${isWinner ? 'text-indigo-600' : 'text-slate-600'}`}>
                                        {percentage}%
                                    </span>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2 font-semibold text-slate-600">Total</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-800">{total}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-600">100%</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

// Results with View Toggle
const ResultsWithToggle: React.FC<{ 
    votes: Record<string, number>; 
    options: string[];
    highlightOption?: string;
}> = ({ votes, options, highlightOption }) => {
    const [viewType, setViewType] = useState<'bar' | 'donut' | 'table'>('bar');
    
    return (
        <div>
            {/* View Toggle */}
            <div className="flex items-center justify-end gap-1 mb-4">
                <span className="text-xs text-slate-400 mr-2">View:</span>
                <button
                    onClick={() => setViewType('bar')}
                    className={`p-1.5 rounded-lg transition ${viewType === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                    title="Bar Chart"
                >
                    <BarChart3 size={16} />
                </button>
                <button
                    onClick={() => setViewType('donut')}
                    className={`p-1.5 rounded-lg transition ${viewType === 'donut' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                    title="Donut Chart"
                >
                    <PieChart size={16} />
                </button>
                <button
                    onClick={() => setViewType('table')}
                    className={`p-1.5 rounded-lg transition ${viewType === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                    title="Table View"
                >
                    <Table size={16} />
                </button>
            </div>
            
            {/* View Content */}
            <AnimatePresence mode="wait">
                {viewType === 'bar' && (
                    <motion.div key="bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ResultsChart votes={votes} options={options} highlightOption={highlightOption} />
                    </motion.div>
                )}
                {viewType === 'donut' && (
                    <motion.div key="donut" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DonutChart votes={votes} options={options} highlightOption={highlightOption} />
                    </motion.div>
                )}
                {viewType === 'table' && (
                    <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TableView votes={votes} options={options} highlightOption={highlightOption} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Bar Chart Component (original)
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
                        <ResultsWithToggle votes={votes} options={options} highlightOption={selected || undefined} />
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
                        <ResultsWithToggle votes={votes} options={options} highlightOption={ranking[0]} />
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
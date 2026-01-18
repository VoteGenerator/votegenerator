// ============================================================================
// PollComparison - Compare multiple polls side-by-side with stunning visuals
// Pro/Business feature for advanced analytics
// ============================================================================
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Minus,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Users,
    Calendar,
    Trophy,
    Award,
    Target,
    Zap,
    ArrowRight,
    ArrowLeftRight,
    PieChart,
    Activity,
    Sparkles,
    Crown,
    Lock,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Download,
    Share2
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface PollData {
    id: string;
    title: string;
    description?: string;
    type: string;
    createdAt: string;
    expiresAt?: string;
    status: 'live' | 'closed' | 'draft' | 'paused';
    totalVotes: number;
    options: {
        id: string;
        text: string;
        votes: number;
        percentage: number;
        imageUrl?: string;
    }[];
    tier?: string;
}

interface ComparisonMetric {
    label: string;
    pollA: string | number;
    pollB: string | number;
    winner?: 'A' | 'B' | 'tie';
    icon: React.ElementType;
    format?: 'number' | 'percentage' | 'date' | 'text';
}

interface Props {
    availablePolls: PollData[];
    onClose: () => void;
    tier?: 'free' | 'pro' | 'business';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
};

const getEngagementRate = (poll: PollData): number => {
    // Simulated engagement calculation
    const daysSinceCreation = Math.max(1, Math.floor((Date.now() - new Date(poll.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round((poll.totalVotes / daysSinceCreation) * 10) / 10;
};

const getTopOption = (poll: PollData): string => {
    if (poll.options.length === 0) return 'N/A';
    const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
    return sorted[0]?.text || 'N/A';
};

const getVoteSpread = (poll: PollData): number => {
    if (poll.options.length < 2) return 0;
    const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
    return sorted[0].percentage - sorted[1].percentage;
};

// ============================================================================
// POLL SELECTOR COMPONENT
// ============================================================================
const PollSelector: React.FC<{
    polls: PollData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    label: string;
    color: string;
}> = ({ polls, selectedId, onSelect, label, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = polls.find(p => p.id === selectedId);
    
    return (
        <div className="relative">
            <label className={`block text-sm font-bold mb-2 ${color}`}>{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedId 
                        ? `border-${color.includes('indigo') ? 'indigo' : 'purple'}-300 bg-${color.includes('indigo') ? 'indigo' : 'purple'}-50`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
            >
                {selected ? (
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{selected.title}</p>
                            <p className="text-sm text-slate-500">{selected.totalVotes} votes • {selected.options.length} options</p>
                        </div>
                        <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
                    </div>
                ) : (
                    <div className="flex items-center justify-between text-slate-400">
                        <span>Select a poll to compare...</span>
                        <ChevronDown size={20} />
                    </div>
                )}
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 max-h-64 overflow-y-auto"
                        >
                            {polls.map(poll => (
                                <button
                                    key={poll.id}
                                    onClick={() => {
                                        onSelect(poll.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full p-3 text-left hover:bg-slate-50 transition flex items-center gap-3 ${
                                        poll.id === selectedId ? 'bg-indigo-50' : ''
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        poll.status === 'live' ? 'bg-emerald-100 text-emerald-600' :
                                        poll.status === 'closed' ? 'bg-slate-100 text-slate-500' :
                                        'bg-amber-100 text-amber-600'
                                    }`}>
                                        <BarChart3 size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{poll.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {poll.totalVotes} votes • {poll.status}
                                        </p>
                                    </div>
                                    {poll.id === selectedId && (
                                        <Check size={18} className="text-indigo-600" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// METRIC CARD COMPONENT
// ============================================================================
const MetricCard: React.FC<{
    metric: ComparisonMetric;
    pollAColor: string;
    pollBColor: string;
}> = ({ metric, pollAColor, pollBColor }) => {
    const Icon = metric.icon;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon size={16} className="text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">{metric.label}</span>
            </div>
            
            <div className="flex items-center justify-between">
                {/* Poll A Value */}
                <div className={`flex-1 text-center p-2 rounded-lg ${metric.winner === 'A' ? 'bg-indigo-50' : ''}`}>
                    <p className={`text-xl font-bold ${metric.winner === 'A' ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {metric.pollA}
                    </p>
                    {metric.winner === 'A' && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <Trophy size={12} className="text-amber-500" />
                            <span className="text-xs text-amber-600 font-medium">Winner</span>
                        </div>
                    )}
                </div>
                
                {/* VS Divider */}
                <div className="px-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        metric.winner === 'tie' 
                            ? 'bg-slate-100' 
                            : metric.winner === 'A' 
                                ? 'bg-indigo-100' 
                                : 'bg-purple-100'
                    }`}>
                        {metric.winner === 'tie' ? (
                            <Minus size={14} className="text-slate-500" />
                        ) : metric.winner === 'A' ? (
                            <TrendingUp size={14} className="text-indigo-600" />
                        ) : (
                            <TrendingDown size={14} className="text-purple-600" />
                        )}
                    </div>
                </div>
                
                {/* Poll B Value */}
                <div className={`flex-1 text-center p-2 rounded-lg ${metric.winner === 'B' ? 'bg-purple-50' : ''}`}>
                    <p className={`text-xl font-bold ${metric.winner === 'B' ? 'text-purple-600' : 'text-slate-700'}`}>
                        {metric.pollB}
                    </p>
                    {metric.winner === 'B' && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <Trophy size={12} className="text-amber-500" />
                            <span className="text-xs text-amber-600 font-medium">Winner</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// VISUAL BAR COMPARISON
// ============================================================================
const BarComparison: React.FC<{
    pollA: PollData;
    pollB: PollData;
}> = ({ pollA, pollB }) => {
    const maxVotes = Math.max(
        Math.max(...pollA.options.map(o => o.votes)),
        Math.max(...pollB.options.map(o => o.votes))
    );
    
    // Match options by text if possible
    const matchedOptions = useMemo(() => {
        const matches: { text: string; pollA?: typeof pollA.options[0]; pollB?: typeof pollB.options[0] }[] = [];
        
        // Add all Poll A options
        pollA.options.forEach(opt => {
            matches.push({ text: opt.text, pollA: opt });
        });
        
        // Match or add Poll B options
        pollB.options.forEach(opt => {
            const existing = matches.find(m => m.text.toLowerCase() === opt.text.toLowerCase());
            if (existing) {
                existing.pollB = opt;
            } else {
                matches.push({ text: opt.text, pollB: opt });
            }
        });
        
        return matches;
    }, [pollA, pollB]);
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" />
                    Option-by-Option Comparison
                </h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-slate-600 truncate max-w-[100px]">{pollA.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-slate-600 truncate max-w-[100px]">{pollB.title}</span>
                    </div>
                </div>
            </div>
            
            {matchedOptions.slice(0, 8).map((match, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {match.text}
                        </span>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-indigo-600 font-medium">
                                {match.pollA?.votes ?? 0} ({match.pollA?.percentage ?? 0}%)
                            </span>
                            <span className="text-purple-600 font-medium">
                                {match.pollB?.votes ?? 0} ({match.pollB?.percentage ?? 0}%)
                            </span>
                        </div>
                    </div>
                    
                    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                        {/* Poll A Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${maxVotes > 0 ? ((match.pollA?.votes ?? 0) / maxVotes) * 100 : 0}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-t-lg"
                        />
                        {/* Poll B Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${maxVotes > 0 ? ((match.pollB?.votes ?? 0) / maxVotes) * 100 : 0}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 + 0.1 }}
                            className="absolute bottom-0 left-0 h-4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-b-lg"
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// ============================================================================
// WINNER ANNOUNCEMENT
// ============================================================================
const WinnerAnnouncement: React.FC<{
    pollA: PollData;
    pollB: PollData;
    metrics: ComparisonMetric[];
}> = ({ pollA, pollB, metrics }) => {
    const aWins = metrics.filter(m => m.winner === 'A').length;
    const bWins = metrics.filter(m => m.winner === 'B').length;
    const ties = metrics.filter(m => m.winner === 'tie').length;
    
    const winner = aWins > bWins ? 'A' : bWins > aWins ? 'B' : 'tie';
    const winnerPoll = winner === 'A' ? pollA : winner === 'B' ? pollB : null;
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-2xl p-6 overflow-hidden ${
                winner === 'tie' 
                    ? 'bg-gradient-to-r from-slate-100 to-slate-200' 
                    : winner === 'A'
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative">
                {winner === 'tie' ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ArrowLeftRight size={32} className="text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">It's a Tie! 🤝</h3>
                        <p className="text-slate-600">Both polls performed equally well</p>
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="bg-white px-4 py-2 rounded-full shadow">
                                <span className="font-bold text-slate-700">{aWins}</span>
                                <span className="text-slate-500 ml-1">wins each</span>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-full shadow">
                                <span className="font-bold text-slate-700">{ties}</span>
                                <span className="text-slate-500 ml-1">ties</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-white">
                        <motion.div
                            initial={{ rotate: -10, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"
                        >
                            <Trophy size={40} className="text-amber-300" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-white/80 text-sm uppercase tracking-wide mb-1">🎉 Overall Winner</p>
                            <h3 className="text-2xl font-bold mb-2 truncate px-4">{winnerPoll?.title}</h3>
                            <div className="flex items-center justify-center gap-3 mt-4">
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="font-bold">{winner === 'A' ? aWins : bWins}</span>
                                    <span className="ml-1 opacity-80">metrics won</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="font-bold">{winnerPoll?.totalVotes}</span>
                                    <span className="ml-1 opacity-80">total votes</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// ============================================================================
// INSIGHTS PANEL
// ============================================================================
const InsightsPanel: React.FC<{
    pollA: PollData;
    pollB: PollData;
}> = ({ pollA, pollB }) => {
    const insights = useMemo(() => {
        const result: { icon: React.ElementType; text: string; type: 'success' | 'warning' | 'info' }[] = [];
        
        // Engagement comparison
        const engA = getEngagementRate(pollA);
        const engB = getEngagementRate(pollB);
        if (engA > engB * 1.5) {
            result.push({
                icon: TrendingUp,
                text: `"${pollA.title}" has ${Math.round((engA / engB - 1) * 100)}% higher daily engagement`,
                type: 'success'
            });
        } else if (engB > engA * 1.5) {
            result.push({
                icon: TrendingUp,
                text: `"${pollB.title}" has ${Math.round((engB / engA - 1) * 100)}% higher daily engagement`,
                type: 'success'
            });
        }
        
        // Vote distribution
        const spreadA = getVoteSpread(pollA);
        const spreadB = getVoteSpread(pollB);
        if (spreadA > 50) {
            result.push({
                icon: Target,
                text: `"${pollA.title}" has a clear leader (${Math.round(spreadA)}% ahead)`,
                type: 'info'
            });
        }
        if (spreadB > 50) {
            result.push({
                icon: Target,
                text: `"${pollB.title}" has a clear leader (${Math.round(spreadB)}% ahead)`,
                type: 'info'
            });
        }
        
        // Close race detection
        if (spreadA < 10 && pollA.totalVotes > 10) {
            result.push({
                icon: Activity,
                text: `"${pollA.title}" is a close race - top options within ${Math.round(spreadA)}%`,
                type: 'warning'
            });
        }
        
        // Volume comparison
        if (pollA.totalVotes > pollB.totalVotes * 2) {
            result.push({
                icon: Users,
                text: `"${pollA.title}" received ${Math.round(pollA.totalVotes / pollB.totalVotes)}x more votes`,
                type: 'success'
            });
        } else if (pollB.totalVotes > pollA.totalVotes * 2) {
            result.push({
                icon: Users,
                text: `"${pollB.title}" received ${Math.round(pollB.totalVotes / pollA.totalVotes)}x more votes`,
                type: 'success'
            });
        }
        
        return result.slice(0, 4);
    }, [pollA, pollB]);
    
    if (insights.length === 0) return null;
    
    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-500" />
                AI Insights
            </h3>
            <div className="space-y-3">
                {insights.map((insight, idx) => {
                    const Icon = insight.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                                insight.type === 'success' ? 'bg-emerald-100/50' :
                                insight.type === 'warning' ? 'bg-amber-100/50' :
                                'bg-blue-100/50'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                insight.type === 'success' ? 'bg-emerald-200 text-emerald-700' :
                                insight.type === 'warning' ? 'bg-amber-200 text-amber-700' :
                                'bg-blue-200 text-blue-700'
                            }`}>
                                <Icon size={16} />
                            </div>
                            <p className="text-sm text-slate-700 pt-1">{insight.text}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const PollComparison: React.FC<Props> = ({ 
    availablePolls, 
    onClose,
    tier = 'free'
}) => {
    const [selectedPollA, setSelectedPollA] = useState<string | null>(null);
    const [selectedPollB, setSelectedPollB] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    
    const isPro = tier === 'pro' || tier === 'business';
    
    const pollA = availablePolls.find(p => p.id === selectedPollA);
    const pollB = availablePolls.find(p => p.id === selectedPollB);
    
    // Calculate comparison metrics
    const metrics: ComparisonMetric[] = useMemo(() => {
        if (!pollA || !pollB) return [];
        
        const engA = getEngagementRate(pollA);
        const engB = getEngagementRate(pollB);
        const spreadA = getVoteSpread(pollA);
        const spreadB = getVoteSpread(pollB);
        
        return [
            {
                label: 'Total Votes',
                pollA: formatNumber(pollA.totalVotes),
                pollB: formatNumber(pollB.totalVotes),
                winner: pollA.totalVotes > pollB.totalVotes ? 'A' : pollB.totalVotes > pollA.totalVotes ? 'B' : 'tie',
                icon: Users
            },
            {
                label: 'Daily Engagement',
                pollA: `${engA}/day`,
                pollB: `${engB}/day`,
                winner: engA > engB ? 'A' : engB > engA ? 'B' : 'tie',
                icon: Activity
            },
            {
                label: 'Options Count',
                pollA: pollA.options.length,
                pollB: pollB.options.length,
                winner: 'tie', // Not really a winner situation
                icon: BarChart3
            },
            {
                label: 'Vote Spread',
                pollA: `${Math.round(spreadA)}%`,
                pollB: `${Math.round(spreadB)}%`,
                winner: spreadA > spreadB ? 'A' : spreadB > spreadA ? 'B' : 'tie',
                icon: Target
            },
            {
                label: 'Top Choice',
                pollA: getTopOption(pollA).substring(0, 15) + (getTopOption(pollA).length > 15 ? '...' : ''),
                pollB: getTopOption(pollB).substring(0, 15) + (getTopOption(pollB).length > 15 ? '...' : ''),
                winner: 'tie',
                icon: Trophy
            },
            {
                label: 'Status',
                pollA: pollA.status.charAt(0).toUpperCase() + pollA.status.slice(1),
                pollB: pollB.status.charAt(0).toUpperCase() + pollB.status.slice(1),
                winner: pollA.status === 'live' && pollB.status !== 'live' ? 'A' : 
                        pollB.status === 'live' && pollA.status !== 'live' ? 'B' : 'tie',
                icon: Eye
            }
        ];
    }, [pollA, pollB]);
    
    const canCompare = pollA && pollB && pollA.id !== pollB.id;
    
    // Filter out already selected polls
    const pollsForA = availablePolls.filter(p => p.id !== selectedPollB);
    const pollsForB = availablePolls.filter(p => p.id !== selectedPollA);
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <ArrowLeftRight size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Poll Comparison</h2>
                                <p className="text-white/80 text-sm">Compare performance across your polls</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {!isPro ? (
                        // Upgrade prompt for free users
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Lock size={40} className="text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Unlock Poll Comparison</h3>
                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                Compare performance metrics, visualize differences, and get AI-powered insights across all your polls.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                {['Side-by-side metrics', 'Visual bar charts', 'AI insights', 'Export reports'].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="/pricing"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                <Crown size={20} />
                                Upgrade to Pro
                            </a>
                        </div>
                    ) : availablePolls.length < 2 ? (
                        // Not enough polls
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BarChart3 size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Need More Polls</h3>
                            <p className="text-slate-600 mb-6">
                                Create at least 2 polls to start comparing performance.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                            >
                                Create a Poll
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    ) : !showResults ? (
                        // Poll selection
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <PollSelector
                                    polls={pollsForA}
                                    selectedId={selectedPollA}
                                    onSelect={setSelectedPollA}
                                    label="Poll A"
                                    color="text-indigo-600"
                                />
                                <PollSelector
                                    polls={pollsForB}
                                    selectedId={selectedPollB}
                                    onSelect={setSelectedPollB}
                                    label="Poll B"
                                    color="text-purple-600"
                                />
                            </div>
                            
                            {selectedPollA && selectedPollB && selectedPollA === selectedPollB && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                                    <AlertTriangle size={20} className="text-amber-600" />
                                    <p className="text-amber-800 text-sm">Please select two different polls to compare</p>
                                </div>
                            )}
                            
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => setShowResults(true)}
                                    disabled={!canCompare}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                                        canCompare
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Zap size={24} />
                                    Compare Polls
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ) : pollA && pollB ? (
                        // Comparison results
                        <div className="space-y-6">
                            {/* Back button */}
                            <button
                                onClick={() => setShowResults(false)}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                <ChevronUp size={18} />
                                <span className="text-sm font-medium">Change polls</span>
                            </button>
                            
                            {/* Winner Announcement */}
                            <WinnerAnnouncement pollA={pollA} pollB={pollB} metrics={metrics} />
                            
                            {/* Metrics Grid */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-indigo-600" />
                                    Performance Metrics
                                </h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {metrics.map((metric, idx) => (
                                        <MetricCard
                                            key={idx}
                                            metric={metric}
                                            pollAColor="indigo"
                                            pollBColor="purple"
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Bar Comparison */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <BarComparison pollA={pollA} pollB={pollB} />
                            </div>
                            
                            {/* AI Insights */}
                            <InsightsPanel pollA={pollA} pollB={pollB} />
                            
                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-slate-200">
                                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Share2 size={18} />
                                    Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <Download size={18} />
                                    Export
                                </button>
                                <button
                                    onClick={() => {
                                        setShowResults(false);
                                        setSelectedPollA(null);
                                        setSelectedPollB(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <RefreshCw size={18} />
                                    New Comparison
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PollComparison;
// ============================================================================
// PublicResults.tsx - Stunning Public Results Page
// A beautiful, shareable view of poll results designed to WOW visitors
// Location: src/components/PublicResults.tsx
// ============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Users, BarChart3, PieChart, Activity, TrendingUp,
    Share2, Copy, Check, Twitter, Linkedin, Facebook,
    ChevronDown, Sparkles, Vote, Clock, Globe, Zap,
    ArrowRight, ExternalLink, Eye
} from 'lucide-react';

interface PublicResultsProps {
    pollId: string;
    shareKey?: string; // Optional key for restricted access
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 200, damping: 15 }
    }
};

// Animated counter component
const AnimatedNumber: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
    value, suffix = '', duration = 1.5 
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            setDisplayValue(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
    }, [value, duration]);
    
    return <>{displayValue.toLocaleString()}{suffix}</>;
};

// Confetti effect
const Confetti: React.FC = () => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
    }));
    
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ left: `${p.x}%`, backgroundColor: p.color }}
                    initial={{ y: -20, opacity: 1, rotate: 0 }}
                    animate={{ 
                        y: '100vh', 
                        opacity: [1, 1, 0],
                        rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
                    }}
                    transition={{ 
                        duration: p.duration, 
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

const PublicResults: React.FC<PublicResultsProps> = ({ pollId, shareKey }) => {
    const [poll, setPoll] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeView, setActiveView] = useState<'bar' | 'pie'>('bar');
    
    // Fetch poll and results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/.netlify/functions/vg-get-public-results?pollId=${pollId}${shareKey ? `&shareKey=${shareKey}` : ''}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Results not found or not publicly shared');
                    } else if (response.status === 403) {
                        setError('This poll\'s results are not public');
                    } else {
                        throw new Error('Failed to fetch results');
                    }
                    return;
                }
                const data = await response.json();
                setPoll(data.poll);
                setResults(data.results);
                
                // Show confetti on first load
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            } catch (err) {
                setError('Unable to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [pollId, shareKey]);
    
    // Calculate results data
    const resultsData = useMemo(() => {
        if (!poll || !results) return null;
        
        const votes = results.votes || [];
        const totalVotes = votes.length;
        const counts: Record<string, number> = {};
        
        poll.options.forEach((opt: any) => counts[opt.id] = 0);
        
        votes.forEach((vote: any) => {
            const choices = vote.choices || vote.selectedOptionIds || [];
            choices.forEach((id: string) => {
                if (counts[id] !== undefined) counts[id]++;
            });
        });
        
        const sortedOptions = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([id, count], index) => ({
                id,
                text: poll.options.find((o: any) => o.id === id)?.text || 'Unknown',
                count,
                percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
                rank: index + 1
            }));
        
        const winner = sortedOptions[0];
        const runnerUp = sortedOptions[1];
        
        return { totalVotes, sortedOptions, winner, runnerUp, counts };
    }, [poll, results]);
    
    // Share URL
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/#results=${pollId}${shareKey ? `&key=${shareKey}` : ''}`
        : '';
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareToTwitter = () => {
        const text = `Check out the results of "${poll?.title}" poll!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div 
                        className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-slate-500 font-medium">Loading results...</p>
                </motion.div>
            </div>
        );
    }
    
    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <motion.div 
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye size={40} className="text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">{error}</h1>
                    <p className="text-slate-500 mb-6">
                        The poll owner may not have enabled public results sharing.
                    </p>
                    <a 
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                    >
                        Create Your Own Poll
                        <ArrowRight size={18} />
                    </a>
                </motion.div>
            </div>
        );
    }
    
    if (!poll || !resultsData) return null;
    
    const { totalVotes, sortedOptions, winner } = resultsData;
    
    // Color palette for bars
    const colors = [
        'from-indigo-500 to-purple-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-pink-500 to-rose-500',
        'from-cyan-500 to-blue-500',
        'from-lime-500 to-green-500',
        'from-violet-500 to-fuchsia-500',
        'from-red-500 to-pink-500'
    ];
    
    const pieColors = [
        '#6366f1', '#10b981', '#f59e0b', '#ec4899', 
        '#06b6d4', '#84cc16', '#8b5cf6', '#ef4444'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Confetti Effect */}
            {showConfetti && <Confetti />}
            
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full opacity-10 blur-3xl" />
            </div>
            
            <motion.div 
                className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.header variants={itemVariants} className="text-center mb-8">
                    <motion.div 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-indigo-100 mb-6"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-slate-600">Live Results</span>
                    </motion.div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4 leading-tight">
                        {poll.title}
                    </h1>
                    
                    {poll.description && (
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            {poll.description}
                        </p>
                    )}
                </motion.header>
                
                {/* Stats Bar */}
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-indigo-100/50 border border-white"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <motion.div 
                                    className="text-2xl font-black text-slate-800"
                                    variants={numberVariants}
                                >
                                    <AnimatedNumber value={totalVotes} />
                                </motion.div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Votes</div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-emerald-100/50 border border-white"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Vote size={20} className="text-white" />
                            </div>
                            <div>
                                <motion.div 
                                    className="text-2xl font-black text-slate-800"
                                    variants={numberVariants}
                                >
                                    {sortedOptions.length}
                                </motion.div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Options</div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-amber-100/50 border border-white"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <Trophy size={20} className="text-white" />
                            </div>
                            <div>
                                <motion.div 
                                    className="text-2xl font-black text-slate-800"
                                    variants={numberVariants}
                                >
                                    <AnimatedNumber value={Math.round(winner?.percentage || 0)} suffix="%" />
                                </motion.div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Leader</div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-pink-100/50 border border-white"
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <motion.div 
                                    className="text-2xl font-black text-slate-800"
                                    variants={numberVariants}
                                >
                                    Live
                                </motion.div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                
                {/* Winner Announcement */}
                {winner && totalVotes > 0 && (
                    <motion.div 
                        variants={itemVariants}
                        className="mb-8"
                    >
                        <motion.div 
                            className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 opacity-30">
                                <motion.div 
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                                    }}
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.5, 0.3]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>
                            
                            <div className="relative z-10 text-center">
                                <motion.div 
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                >
                                    <Trophy size={16} />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Current Leader</span>
                                </motion.div>
                                
                                <motion.h2 
                                    className="text-3xl md:text-4xl font-black mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {winner.text}
                                </motion.h2>
                                
                                <motion.div 
                                    className="flex items-center justify-center gap-6 text-white/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="text-4xl font-black">
                                        <AnimatedNumber value={Math.round(winner.percentage)} suffix="%" duration={2} />
                                    </span>
                                    <span className="text-lg">
                                        ({winner.count} vote{winner.count !== 1 ? 's' : ''})
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                
                {/* View Toggle */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white">
                        <button
                            onClick={() => setActiveView('bar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                activeView === 'bar' 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <BarChart3 size={18} />
                            Bar Chart
                        </button>
                        <button
                            onClick={() => setActiveView('pie')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                activeView === 'pie' 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <PieChart size={18} />
                            Pie Chart
                        </button>
                    </div>
                </motion.div>
                
                {/* Results Chart */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white mb-8"
                >
                    <AnimatePresence mode="wait">
                        {activeView === 'bar' ? (
                            <motion.div
                                key="bar"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {sortedOptions.map((option, index) => (
                                    <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {index === 0 && totalVotes > 0 && (
                                                    <motion.span
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: 0.5, type: "spring" }}
                                                    >
                                                        <Trophy size={20} className="text-amber-500" />
                                                    </motion.span>
                                                )}
                                                <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                                                    {option.text}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500">
                                                    {option.count} vote{option.count !== 1 ? 's' : ''}
                                                </span>
                                                <span className="font-black text-xl text-slate-800">
                                                    {option.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-12 bg-slate-100 rounded-xl overflow-hidden">
                                            <motion.div
                                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[index % colors.length]} rounded-xl`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${option.percentage}%` }}
                                                transition={{ duration: 1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pie"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col md:flex-row items-center gap-8 justify-center"
                            >
                                {/* SVG Pie Chart */}
                                <motion.div 
                                    className="relative w-64 h-64"
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                        {(() => {
                                            let currentAngle = 0;
                                            return sortedOptions.map((option, index) => {
                                                const angle = (option.percentage / 100) * 360;
                                                const startAngle = currentAngle * (Math.PI / 180);
                                                const endAngle = (currentAngle + angle) * (Math.PI / 180);
                                                currentAngle += angle;
                                                
                                                const largeArcFlag = angle > 180 ? 1 : 0;
                                                const x1 = 50 + 45 * Math.cos(startAngle);
                                                const y1 = 50 + 45 * Math.sin(startAngle);
                                                const x2 = 50 + 45 * Math.cos(endAngle);
                                                const y2 = 50 + 45 * Math.sin(endAngle);
                                                
                                                if (angle >= 359.9) {
                                                    return (
                                                        <circle
                                                            key={option.id}
                                                            cx="50"
                                                            cy="50"
                                                            r="45"
                                                            fill={pieColors[index % pieColors.length]}
                                                        />
                                                    );
                                                }
                                                
                                                if (angle < 0.1) return null;
                                                
                                                const pathData = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                                                return (
                                                    <motion.path
                                                        key={option.id}
                                                        d={pathData}
                                                        fill={pieColors[index % pieColors.length]}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-slate-800">{totalVotes}</span>
                                            <span className="text-xs text-slate-500">votes</span>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Legend */}
                                <div className="space-y-3">
                                    {sortedOptions.map((option, index) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                            />
                                            <span className="font-medium text-slate-700">{option.text}</span>
                                            <span className="text-slate-500 ml-auto">{option.percentage.toFixed(1)}%</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                {/* Share Section */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white"
                >
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                            <Share2 size={20} className="text-indigo-500" />
                            Share These Results
                        </h3>
                        <p className="text-slate-500">Spread the word about this poll!</p>
                    </div>
                    
                    {/* Share URL */}
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono"
                        />
                        <motion.button
                            onClick={copyToClipboard}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                copied 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </motion.button>
                    </div>
                    
                    {/* Social Share Buttons */}
                    <div className="flex justify-center gap-3">
                        <motion.button
                            onClick={shareToTwitter}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1DA1F2]/30"
                        >
                            <Twitter size={20} />
                        </motion.button>
                        <motion.button
                            onClick={shareToLinkedIn}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0A66C2]/30"
                        >
                            <Linkedin size={20} />
                        </motion.button>
                        <motion.button
                            onClick={shareToFacebook}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1877F2]/30"
                        >
                            <Facebook size={20} />
                        </motion.button>
                    </div>
                </motion.div>
                
                {/* Footer Branding */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-8 text-center"
                >
                    <a 
                        href="/"
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white hover:shadow-xl transition-all group"
                    >
                        <img src="/logo.svg" alt="VoteGenerator" className="h-6 w-6" />
                        <span className="font-bold text-slate-700">Create your own poll</span>
                        <ArrowRight size={18} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="mt-4 text-sm text-slate-400">
                        Powered by <span className="font-semibold">VoteGenerator.com</span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PublicResults;
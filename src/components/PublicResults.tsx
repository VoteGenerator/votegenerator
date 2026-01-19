// ============================================================================
// PublicResults.tsx - ULTRA WOW Public Results Page
// Mobile-first, animated, conversion-optimized showcase
// Location: src/components/PublicResults.tsx
// ============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Users, BarChart3, PieChart,
    Share2, Copy, Check, Twitter, Linkedin, Facebook,
    Sparkles, Vote, Crown, ArrowRight, Eye, Clock, Zap, Star
} from 'lucide-react';

interface PublicResultsProps {
    pollId: string;
    shareKey?: string;
}

// Floating particles background
const FloatingParticles: React.FC = () => {
    const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5
    }));
    
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{ 
                        width: p.size, 
                        height: p.size, 
                        left: `${p.x}%`, 
                        top: `${p.y}%`,
                        background: `radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 100%)`
                    }}
                    animate={{
                        y: [0, -80, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// Epic confetti explosion
const ConfettiExplosion: React.FC<{ show: boolean }> = ({ show }) => {
    if (!show) return null;
    
    const confetti = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: 50,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#a855f7'][Math.floor(Math.random() * 8)],
        angle: (i / 100) * 360 + Math.random() * 30,
        velocity: 8 + Math.random() * 15,
        spin: Math.random() * 1080 - 540,
        size: 8 + Math.random() * 10,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
    }));
    
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {confetti.map(c => {
                const rad = c.angle * (Math.PI / 180);
                const endX = Math.cos(rad) * c.velocity * 25;
                const endY = Math.sin(rad) * c.velocity * 20 + 50;
                return (
                    <motion.div
                        key={c.id}
                        className="absolute"
                        style={{
                            left: '50%',
                            top: '40%',
                            width: c.size,
                            height: c.shape === 'circle' ? c.size : c.size * 0.6,
                            backgroundColor: c.color,
                            borderRadius: c.shape === 'circle' ? '50%' : 3
                        }}
                        initial={{ scale: 0, rotate: 0, opacity: 1, x: 0, y: 0 }}
                        animate={{
                            x: `${endX}vw`,
                            y: `${endY}vh`,
                            scale: [0, 1.5, 1, 0.5],
                            rotate: c.spin,
                            opacity: [1, 1, 1, 0]
                        }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                );
            })}
        </div>
    );
};

// Animated counter with easing
const AnimatedNumber: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
    value, suffix = '', duration = 2 
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setDisplayValue(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);
    
    return <>{displayValue.toLocaleString()}{suffix}</>;
};

// Glowing stat card with hover effects
const StatCard: React.FC<{
    icon: React.ReactNode;
    value: string | number;
    label: string;
    gradient: string;
    delay?: number;
}> = ({ icon, value, label, gradient, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08, y: -8 }}
        className="relative group cursor-default"
    >
        {/* Glow */}
        <div className={`absolute inset-0 ${gradient} rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500`} />
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
                <motion.div 
                    className={`w-11 h-11 ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    {icon}
                </motion.div>
                <div>
                    <div className="text-2xl font-black text-slate-800">
                        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const PublicResults: React.FC<PublicResultsProps> = ({ pollId, shareKey }) => {
    const [poll, setPoll] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeView, setActiveView] = useState<'bar' | 'pie'>('bar');
    
    // Ad wall state for free tier
    const [adWallPassed, setAdWallPassed] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    // Check if this is a free tier poll
    const isFreeTier = poll?.tier === 'free' || !poll?.tier;
    
    // Detect if this is a survey
    const isSurvey = poll?.type === 'survey' || poll?.sections?.length > 0;
    
    // Fetch results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/.netlify/functions/vg-get-public-results?pollId=${pollId}${shareKey ? `&shareKey=${shareKey}` : ''}`);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 404) {
                        setError('Poll not found');
                    } else if (response.status === 403) {
                        setError(errorData.hint || 'Results are not public');
                    } else {
                        setError('Failed to load');
                    }
                    return;
                }
                
                const data = await response.json();
                setPoll(data.poll);
                setResults(data.results);
                
                // Trigger celebration
                setTimeout(() => {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3500);
                }, 600);
            } catch (err) {
                setError('Unable to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [pollId, shareKey]);
    
    // Countdown timer for ad wall (free tier only)
    useEffect(() => {
        if (!loading && isFreeTier && !adWallPassed && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [loading, isFreeTier, adWallPassed, countdown]);
    
    // Process results
    const resultsData = useMemo(() => {
        if (!poll || !results) return null;
        
        const simpleCounts = results.simpleCounts || {};
        const totalVotes = results.totalVotes || 0;
        
        // For surveys, options might be empty - return minimal data
        const options = poll.options || [];
        const sortedOptions = options
            .map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                count: simpleCounts[opt.id] || 0,
                percentage: totalVotes > 0 ? ((simpleCounts[opt.id] || 0) / totalVotes) * 100 : 0
            }))
            .sort((a: any, b: any) => b.count - a.count);
        
        return { totalVotes, sortedOptions, winner: sortedOptions[0] || null };
    }, [poll, results]);
    
    // Process survey results - must be before any early returns to maintain hooks order
    const surveyStats = useMemo(() => {
        if (!isSurvey || !poll?.sections) return null;
        
        const responses = results?.surveyResponses || [];
        const sections = poll.sections || [];
        
        // Debug logging
        console.log('=== PublicResults Survey Debug ===');
        console.log('isSurvey:', isSurvey);
        console.log('sections count:', sections.length);
        console.log('responses count:', responses.length);
        if (responses[0]) {
            console.log('First response answers:', responses[0].answers);
            console.log('First response answer keys:', Object.keys(responses[0].answers || {}));
        }
        if (sections[0]?.questions?.[0]) {
            console.log('First question id:', sections[0].questions[0].id);
        }
        
        // Calculate stats for each question
        const questionStats: any[] = [];
        const processedIds = new Set<string>(); // Prevent duplicates
        
        sections.forEach((section: any) => {
            section.questions?.forEach((question: any) => {
                // Skip if already processed (prevent duplicates)
                if (processedIds.has(question.id)) {
                    console.log('Skipping duplicate question:', question.id);
                    return;
                }
                processedIds.add(question.id);
                
                // Try multiple ways to find answers for this question
                const answers = responses
                    .map((r: any) => {
                        const ans = r.answers || {};
                        // Try question.id directly, or without prefix
                        return ans[question.id] || ans[question.id.replace(/^q_/, '')] || null;
                    })
                    .filter(Boolean);
                
                console.log(`Question "${question.text}" (${question.id}): ${answers.length} answers`);
                
                if (question.type === 'multiple_choice' || question.type === 'dropdown' || question.type === 'yes_no') {
                    // Count option selections
                    const counts: Record<string, number> = {};
                    answers.forEach((answer: any) => {
                        const value = Array.isArray(answer) ? answer[0] : answer;
                        counts[value] = (counts[value] || 0) + 1;
                    });
                    
                    const options = question.type === 'yes_no' 
                        ? [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }]
                        : question.options || [];
                    
                    const sortedResults = options.map((opt: any) => ({
                        text: opt.text || opt,
                        count: counts[opt.id || opt] || 0,
                        percentage: answers.length > 0 ? ((counts[opt.id || opt] || 0) / answers.length) * 100 : 0
                    })).sort((a: any, b: any) => b.count - a.count);
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text,
                        type: 'choice',
                        sectionTitle: section.title,
                        totalResponses: answers.length,
                        results: sortedResults
                    });
                } else if (question.type === 'rating' || question.type === 'scale') {
                    // Calculate average rating
                    const numericAnswers = answers.map((a: any) => Number(a)).filter((n: number) => !isNaN(n));
                    const avg = numericAnswers.length > 0 
                        ? numericAnswers.reduce((sum: number, n: number) => sum + n, 0) / numericAnswers.length 
                        : 0;
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text,
                        type: 'rating',
                        sectionTitle: section.title,
                        totalResponses: numericAnswers.length,
                        average: avg,
                        max: question.maxRating || question.max || 5
                    });
                } else if (question.type === 'nps') {
                    // Calculate NPS
                    const numericAnswers = answers.map((a: any) => Number(a)).filter((n: number) => !isNaN(n));
                    const promoters = numericAnswers.filter((n: number) => n >= 9).length;
                    const detractors = numericAnswers.filter((n: number) => n <= 6).length;
                    const total = numericAnswers.length;
                    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text,
                        type: 'nps',
                        sectionTitle: section.title,
                        totalResponses: total,
                        npsScore,
                        promoters: Math.round((promoters / total) * 100) || 0,
                        passives: Math.round(((total - promoters - detractors) / total) * 100) || 0,
                        detractors: Math.round((detractors / total) * 100) || 0
                    });
                }
            });
        });
        
        console.log('Final questionStats count:', questionStats.length);
        console.log('=== End Survey Debug ===');
        
        return {
            totalResponses: responses.length,
            completionRate: 100, // Assume all submitted responses are complete
            questionStats
        };
    }, [isSurvey, poll, results]);
    
    // Share functions
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#results=${pollId}` : '';
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: "${poll?.title}"`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div 
                        className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p 
                        className="text-white/70 font-medium text-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading results...
                    </motion.p>
                </motion.div>
            </div>
        );
    }
    
    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <motion.div 
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye size={40} className="text-white/50" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">{error}</h1>
                    <p className="text-white/50 mb-8">The poll owner hasn't enabled public results sharing.</p>
                    <a 
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                    >
                        <Sparkles size={18} />
                        Create Your Own Poll
                    </a>
                </motion.div>
            </div>
        );
    }
    
    if (!poll || !resultsData) return null;
    
    const { totalVotes, sortedOptions, winner } = resultsData;
    
    // Show ad wall for free tier
    if (isFreeTier && !adWallPassed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                        {/* Header */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                        >
                            <BarChart3 size={36} className="text-white" />
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Results Loading...
                        </h2>
                        
                        <p className="text-white/60 mb-8">
                            The results will be available in just a moment.
                        </p>
                        
                        {/* Countdown Circle */}
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="8"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "283 283", strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: (283 * countdown) / 5 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-black text-white">{countdown}</span>
                            </div>
                        </div>
                        
                        {/* View Results Button */}
                        <motion.button
                            onClick={() => setAdWallPassed(true)}
                            disabled={countdown > 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                countdown > 0
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:scale-[1.02]'
                            }`}
                            whileTap={countdown === 0 ? { scale: 0.98 } : {}}
                        >
                            {countdown > 0 ? (
                                <>
                                    <Clock size={20} />
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    <Eye size={20} />
                                    View Results
                                </>
                            )}
                        </motion.button>
                        
                        {/* Upgrade CTA */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-white/40 text-sm mb-3">Want instant access?</p>
                            <a
                                href="/#pricing"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-lg text-sm hover:shadow-lg transition-all"
                            >
                                <Zap size={16} />
                                Upgrade to Pro
                            </a>
                        </div>
                    </div>
                    
                    {/* Ad Space Placeholder */}
                    <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                        <p className="text-white/30 text-xs mb-2">ADVERTISEMENT</p>
                        <div className="h-[250px] bg-white/5 rounded-xl flex items-center justify-center">
                            <div className="text-white/20 text-sm">
                                <Star size={24} className="mx-auto mb-2 opacity-50" />
                                Ad Space
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    // Color palettes
    const barGradients = [
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-emerald-400 via-teal-500 to-cyan-500',
        'from-amber-400 via-orange-500 to-red-500',
        'from-pink-400 via-rose-500 to-red-500',
        'from-cyan-400 via-blue-500 to-indigo-500',
        'from-lime-400 via-green-500 to-emerald-500',
        'from-violet-400 via-purple-500 to-fuchsia-500',
        'from-yellow-400 via-amber-500 to-orange-500'
    ];
    
    const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#8b5cf6', '#ef4444'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
            <FloatingParticles />
            <ConfettiExplosion show={showConfetti} />
            
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <motion.header 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <motion.div 
                            className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-white/90 text-sm font-semibold">Live Results</span>
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                        {poll.title}
                    </h1>
                    
                    {poll.description && (
                        <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto">{poll.description}</p>
                    )}
                </motion.header>
                
                {/* Stats - Different for polls vs surveys */}
                {!isSurvey ? (
                    <>
                        {/* Poll Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            <StatCard
                                icon={<Users size={20} />}
                                value={totalVotes}
                                label="Votes"
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                                delay={0.1}
                            />
                            <StatCard
                                icon={<Vote size={20} />}
                                value={sortedOptions.length}
                                label="Options"
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                                delay={0.2}
                            />
                            <StatCard
                                icon={<Trophy size={20} />}
                                value={`${Math.round(winner?.percentage || 0)}%`}
                                label="Leader"
                                gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                                delay={0.3}
                            />
                            <StatCard
                                icon={<Sparkles size={20} />}
                                value="Live"
                                label="Status"
                                gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                                delay={0.4}
                            />
                        </div>
                        
                        {/* Winner Card */}
                        {winner && totalVotes > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl"
                                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            
                            <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl p-1">
                                <div className="bg-slate-900/95 rounded-[22px] p-5 sm:p-8 text-center">
                                    <motion.div
                                        initial={{ rotate: -20, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ delay: 0.8, type: "spring" }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-4"
                                    >
                                        <Crown size={16} className="text-white" />
                                        <span className="text-white font-bold text-xs uppercase tracking-wider">Leading</span>
                                    </motion.div>
                                    
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4">{winner.text}</h2>
                                    
                                    <div className="flex items-center justify-center gap-6 sm:gap-10">
                                        <div className="text-center">
                                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                                                <AnimatedNumber value={Math.round(winner.percentage)} suffix="%" />
                                            </div>
                                            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">of votes</div>
                                        </div>
                                        <div className="w-px h-14 bg-white/20" />
                                        <div className="text-center">
                                            <div className="text-4xl sm:text-5xl font-black text-white">
                                                <AnimatedNumber value={winner.count} />
                                            </div>
                                            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">total votes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                        )}
                
                        {/* View Toggle */}
                        <motion.div 
                            className="flex justify-center mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                    <div className="inline-flex bg-white/10 backdrop-blur rounded-xl p-1 border border-white/20">
                        <button
                            onClick={() => setActiveView('bar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                activeView === 'bar' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <BarChart3 size={16} />
                            <span className="hidden sm:inline">Bar</span>
                        </button>
                        <button
                            onClick={() => setActiveView('pie')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                activeView === 'pie' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <PieChart size={16} />
                            <span className="hidden sm:inline">Pie</span>
                        </button>
                    </div>
                </motion.div>
                
                {/* Charts */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/20 mb-8"
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
                                {sortedOptions.map((option: any, index: number) => (
                                    <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                {index === 0 && totalVotes > 0 && (
                                                    <Trophy size={16} className="text-amber-400 flex-shrink-0" />
                                                )}
                                                <span className="font-bold text-white text-sm sm:text-base truncate">{option.text}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                                <span className="text-white/40 text-xs sm:text-sm">{option.count}</span>
                                                <span className="font-black text-white text-base sm:text-lg w-14 text-right">
                                                    {option.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-10 sm:h-12 bg-white/5 rounded-xl overflow-hidden">
                                            <motion.div
                                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barGradients[index % barGradients.length]} rounded-xl`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.max(option.percentage, option.count > 0 ? 2 : 0)}%` }}
                                                transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{ duration: 1.5, delay: 0.3 + index * 0.08 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {totalVotes === 0 && (
                                    <div className="text-center py-12 text-white/40">
                                        <Vote size={40} className="mx-auto mb-3 opacity-50" />
                                        <p>No votes yet - be the first!</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pie"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col md:flex-row items-center gap-8 justify-center py-4"
                            >
                                <motion.div 
                                    className="relative w-48 h-48 sm:w-64 sm:h-64"
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                        {(() => {
                                            let currentAngle = 0;
                                            return sortedOptions.map((option: any, index: number) => {
                                                const angle = (option.percentage / 100) * 360;
                                                if (angle < 0.5) return null;
                                                
                                                const startAngle = currentAngle * (Math.PI / 180);
                                                const endAngle = (currentAngle + angle) * (Math.PI / 180);
                                                currentAngle += angle;
                                                
                                                if (angle >= 359.9) {
                                                    return <circle key={option.id} cx="50" cy="50" r="45" fill={pieColors[index % pieColors.length]} />;
                                                }
                                                
                                                const largeArc = angle > 180 ? 1 : 0;
                                                const x1 = 50 + 45 * Math.cos(startAngle);
                                                const y1 = 50 + 45 * Math.sin(startAngle);
                                                const x2 = 50 + 45 * Math.cos(endAngle);
                                                const y2 = 50 + 45 * Math.sin(endAngle);
                                                
                                                return (
                                                    <path
                                                        key={option.id}
                                                        d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                        fill={pieColors[index % pieColors.length]}
                                                        className="hover:opacity-80 transition-opacity"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-full shadow-xl flex flex-col items-center justify-center border-2 border-white/10">
                                            <span className="text-xl sm:text-2xl font-black text-white">{totalVotes}</span>
                                            <span className="text-[10px] text-white/40 uppercase">votes</span>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <div className="space-y-2 w-full md:w-auto">
                                    {sortedOptions.map((option: any, index: number) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.08 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div 
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                            />
                                            <span className="font-medium text-white text-sm flex-1 truncate">{option.text}</span>
                                            <span className="text-white/50 font-bold text-sm">{option.percentage.toFixed(1)}%</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                    </>
                ) : (
                    /* Survey Results Section */
                    <div className="space-y-6 mb-8">
                        {/* Survey Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <StatCard
                                icon={<Users size={20} />}
                                value={surveyStats?.totalResponses || 0}
                                label="Responses"
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                                delay={0.1}
                            />
                            <StatCard
                                icon={<Vote size={20} />}
                                value={surveyStats?.questionStats?.length || 0}
                                label="Questions"
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                                delay={0.2}
                            />
                            <StatCard
                                icon={<Sparkles size={20} />}
                                value="Live"
                                label="Status"
                                gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                                delay={0.3}
                            />
                        </div>
                        
                        {/* Question Results */}
                        {surveyStats?.questionStats?.map((question: any, qIdx: number) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + qIdx * 0.1 }}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/20"
                            >
                                {question.sectionTitle && (
                                    <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">
                                        {question.sectionTitle}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-white mb-4">{question.text}</h3>
                                <div className="text-xs text-white/40 mb-4">{question.totalResponses} responses</div>
                                
                                {question.type === 'choice' && (
                                    <div className="space-y-3">
                                        {question.results?.slice(0, 6).map((result: any, idx: number) => (
                                            <div key={idx}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-white/80 truncate flex-1 mr-4">{result.text}</span>
                                                    <span className="text-sm font-bold text-white">{Math.round(result.percentage)}%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={`h-full bg-gradient-to-r ${barGradients[idx % barGradients.length]}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.percentage}%` }}
                                                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {question.type === 'rating' && (
                                    <div className="text-center">
                                        <div className="text-5xl font-black bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2">
                                            {question.average.toFixed(1)}
                                        </div>
                                        <div className="text-white/40 text-sm">out of {question.max}</div>
                                        <div className="flex items-center justify-center gap-1 mt-3">
                                            {Array.from({ length: question.max }, (_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-3 rounded-full ${
                                                        i < Math.round(question.average) 
                                                            ? 'bg-gradient-to-r from-amber-400 to-yellow-400' 
                                                            : 'bg-white/20'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {question.type === 'nps' && (
                                    <div>
                                        <div className="text-center mb-4">
                                            <div className={`text-5xl font-black ${
                                                question.npsScore >= 50 ? 'text-emerald-400' :
                                                question.npsScore >= 0 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                                {question.npsScore > 0 ? '+' : ''}{question.npsScore}
                                            </div>
                                            <div className="text-white/40 text-sm">NPS Score</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className="bg-emerald-500/20 rounded-lg p-2">
                                                <div className="text-emerald-400 font-bold">{question.promoters}%</div>
                                                <div className="text-white/40">Promoters</div>
                                            </div>
                                            <div className="bg-amber-500/20 rounded-lg p-2">
                                                <div className="text-amber-400 font-bold">{question.passives}%</div>
                                                <div className="text-white/40">Passives</div>
                                            </div>
                                            <div className="bg-red-500/20 rounded-lg p-2">
                                                <div className="text-red-400 font-bold">{question.detractors}%</div>
                                                <div className="text-white/40">Detractors</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        
                        {/* Empty State for Surveys */}
                        {(!surveyStats?.questionStats || surveyStats.questionStats.length === 0) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center"
                            >
                                <Vote size={48} className="mx-auto mb-4 text-white/30" />
                                <h3 className="text-lg font-bold text-white mb-2">No Responses Yet</h3>
                                <p className="text-white/50 text-sm">
                                    Be the first to respond to this survey!
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}
                
                {/* Social Share - Conditional on poll.showSocialShare */}
                {poll.showSocialShare !== false && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/20 mb-8"
                    >
                        <div className="text-center mb-5">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                <Share2 size={20} className="text-indigo-400" />
                                Share Results
                            </h3>
                            <p className="text-white/40 text-sm">Spread the word!</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mb-5">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white/70 font-mono focus:outline-none"
                            />
                            <motion.button
                                onClick={copyToClipboard}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
                                    copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'
                                }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>
                        </div>
                        
                        <div className="flex justify-center gap-3">
                            <motion.button
                                onClick={shareToTwitter}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Twitter size={20} />
                            </motion.button>
                            <motion.button
                                onClick={shareToLinkedIn}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Linkedin size={20} />
                            </motion.button>
                            <motion.button
                                onClick={shareToFacebook}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Facebook size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
                
                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <a 
                        href="/"
                        className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all group"
                    >
                        <Sparkles size={18} />
                        Create Your Own Poll
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="mt-5 text-white/20 text-xs">
                        Powered by <span className="font-semibold text-white/40">VoteGenerator.com</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PublicResults;
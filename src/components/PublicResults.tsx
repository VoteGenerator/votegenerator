// ============================================================================
// PublicResults.tsx - ULTRA WOW Public Results Page
// Mobile-first, animated, conversion-optimized showcase
// Supports: multiple-choice, visual, ranked, this-or-that, meeting, rating, rsvp
// Features: Auto-refresh, Download PNG, Vote Now CTA, Embed Code, Print-friendly
// Location: src/components/PublicResults.tsx
// ============================================================================
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    Trophy, Users, BarChart3, PieChart, Share2, Copy, Check, Twitter, Linkedin, Facebook,
    Sparkles, Vote, Crown, ArrowRight, Eye, Clock, Zap, Star, Calendar, ThumbsUp, ThumbsDown,
    Minus, ListOrdered, Image, Download, Code, Printer, RefreshCw, ExternalLink, X, Sun, Moon
} from 'lucide-react';

// ============================================================================
// HOOKS & UTILITIES
// ============================================================================
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const hasStarted = useRef(false);
    
    useEffect(() => {
        if (startOnView && !inView) return;
        if (hasStarted.current) return;
        hasStarted.current = true;
        const startTime = Date.now();
        const animate = () => {
            const progress = Math.min((Date.now() - startTime) / duration, 1);
            setCount(Math.round(end * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, inView, startOnView]);
    return { count, ref };
};

const AnimatedNumber: React.FC<{ value: number; duration?: number; decimals?: number; suffix?: string; prefix?: string }> = ({ 
    value, duration = 2000, decimals = 0, suffix = '', prefix = ''
}) => {
    const { count, ref } = useCountUp(value * Math.pow(10, decimals), duration);
    const displayValue = decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(decimals) : count;
    return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
};

// Format relative time
const formatTimeAgo = (seconds: number): string => {
    if (seconds < 60) return 'just now';
    if (seconds < 120) return '1 min ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
const FloatingParticles: React.FC = () => {
    const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: i, size: 4 + Math.random() * 8, x: Math.random() * 100, y: Math.random() * 100,
        duration: 15 + Math.random() * 20, delay: Math.random() * 5
    })), []);
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 print:hidden">
            {particles.map(p => (
                <motion.div key={p.id} className="absolute rounded-full"
                    style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
                        background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 100%)' }}
                    animate={{ y: [0, -80, 0], x: [0, Math.random() * 40 - 20, 0], scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
};

const ConfettiExplosion: React.FC<{ show: boolean }> = ({ show }) => {
    if (!show) return null;
    const confetti = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
        id: i, color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
        angle: (i / 60) * 360 + Math.random() * 30, velocity: 8 + Math.random() * 12, spin: Math.random() * 1080 - 540, size: 6 + Math.random() * 8
    })), []);
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 print:hidden">
            {confetti.map(c => (
                <motion.div key={c.id} className="absolute rounded-full"
                    style={{ left: '50%', top: '40%', width: c.size, height: c.size, backgroundColor: c.color }}
                    initial={{ scale: 0, rotate: 0, opacity: 1, x: 0, y: 0 }}
                    animate={{ x: `${Math.cos(c.angle * Math.PI / 180) * c.velocity * 25}vw`, y: `${Math.sin(c.angle * Math.PI / 180) * c.velocity * 20 + 50}vh`,
                        scale: [0, 1.5, 1, 0.5], rotate: c.spin, opacity: [1, 1, 1, 0] }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                />
            ))}
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; gradient: string; delay?: number; isExporting?: boolean }> = ({ 
    icon, value, label, gradient, delay = 0, isExporting = false 
}) => {
    // Use static div during export to avoid animation capture issues
    if (isExporting) {
        return (
            <div style={{ padding: '4px', overflow: 'visible' }}>
                <div style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    overflow: 'visible'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'visible' }}>
                        <div className={`${gradient}`} style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white',
                            flexShrink: 0
                        }}>{icon}</div>
                        <div style={{ overflow: 'visible', minWidth: 0 }}>
                            <div style={{ 
                                fontSize: '24px', 
                                fontWeight: 900, 
                                color: '#1e293b', 
                                lineHeight: '1.3',
                                paddingTop: '2px',
                                overflow: 'visible'
                            }}>{value}</div>
                            <div style={{ 
                                fontSize: '10px', 
                                color: '#64748b', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.1em', 
                                fontWeight: 700,
                                marginTop: '2px'
                            }}>{label}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className="relative group cursor-default print:!opacity-100 print:!transform-none">
            <div className={`absolute inset-0 ${gradient} rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500 print:hidden`} />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/50 print:shadow-none print:border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg print:shadow-none`}>{icon}</div>
                    <div className="min-w-0">
                        <div className="text-xl sm:text-2xl font-black text-slate-800 truncate">{typeof value === 'number' ? <AnimatedNumber value={value} /> : value}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StarRating: React.FC<{ rating: number; max?: number; size?: 'sm' | 'md' | 'lg'; darkMode?: boolean; isExporting?: boolean }> = ({ rating, max = 5, size = 'md', darkMode = true, isExporting = false }) => {
    const sizeMap = { sm: '18px', md: '24px', lg: '32px' };
    const sizeClasses = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl sm:text-4xl' };
    const emptyStarClass = darkMode ? 'text-white/20' : 'text-slate-300';
    
    // Use static rendering during export with inline styles
    if (isExporting) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', overflow: 'visible' }}>
                {Array.from({ length: max }, (_, i) => (
                    <span key={i} style={{ 
                        fontSize: sizeMap[size], 
                        color: i < Math.round(rating) ? '#fbbf24' : '#cbd5e1',
                        lineHeight: 1.2
                    }}>★</span>
                ))}
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
            {Array.from({ length: max }, (_, i) => (
                <motion.span key={i} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    className={`${sizeClasses[size]} ${i < Math.round(rating) ? 'text-amber-400' : `${emptyStarClass} print:text-gray-300`}`}>★</motion.span>
            ))}
        </div>
    );
};

// Embed Code Modal
const EmbedModal: React.FC<{ pollId: string; onClose: () => void }> = ({ pollId, onClose }) => {
    const [copied, setCopied] = useState(false);
    const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/#results=${pollId}" width="100%" height="600" frameborder="0" style="border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"></iframe>`;
    
    const copyCode = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Code size={20} className="text-indigo-400" />Embed Results</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={20} className="text-white/60" /></button>
                </div>
                <p className="text-white/60 text-sm mb-4">Copy this code to embed live results on your website or blog:</p>
                <div className="bg-black/40 rounded-xl p-4 mb-4 overflow-x-auto">
                    <code className="text-emerald-400 text-xs sm:text-sm break-all">{embedCode}</code>
                </div>
                <button onClick={copyCode} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
                    {copied ? <><Check size={18} />Copied!</> : <><Copy size={18} />Copy Embed Code</>}
                </button>
            </motion.div>
        </motion.div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface PublicResultsProps { pollId: string; shareKey?: string; }

const PublicResults: React.FC<PublicResultsProps> = ({ pollId, shareKey }) => {
    const [poll, setPoll] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeView, setActiveView] = useState<'bar' | 'pie'>('bar');
    const [adWallPassed, setAdWallPassed] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    // New feature states
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [secondsAgo, setSecondsAgo] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isExporting, setIsExporting] = useState(false); // For export-safe styling
    const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark'); // Theme toggle
    
    const resultsRef = useRef<HTMLDivElement>(null);
    
    // Theme colors - dynamic based on colorMode
    const isDark = colorMode === 'dark';
    const theme = {
        bg: isDark ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50',
        cardBg: isDark ? (isExporting ? '#1e293b' : 'rgba(255,255,255,0.1)') : (isExporting ? '#ffffff' : 'rgba(255,255,255,0.9)'),
        cardBorder: isDark ? (isExporting ? '#334155' : 'rgba(255,255,255,0.2)') : (isExporting ? '#e2e8f0' : 'rgba(0,0,0,0.1)'),
        text: isDark ? 'text-white' : 'text-slate-900',
        textMuted: isDark ? 'text-white/60' : 'text-slate-500',
        textFaint: isDark ? 'text-white/40' : 'text-slate-400',
        badgeBg: isDark ? (isExporting ? '#334155' : 'rgba(255,255,255,0.1)') : (isExporting ? '#f1f5f9' : 'rgba(0,0,0,0.05)'),
        inputBg: isDark ? 'bg-white/10' : 'bg-slate-100',
        ratingCardBg: isDark ? 'bg-slate-900/95' : 'bg-white',
        barTrack: isDark ? (isExporting ? '#334155' : 'rgba(255,255,255,0.05)') : (isExporting ? '#e2e8f0' : 'rgba(0,0,0,0.05)'),
    };
    
    const isFreeTier = poll?.tier === 'free' || !poll?.tier;
    const isSurvey = poll?.isSurvey || poll?.type === 'survey' || poll?.pollType === 'survey' || poll?.sections?.length > 0;
    const pollType = poll?.pollType || poll?.type || 'multiple-choice';
    const isPollOpen = poll?.status === 'active' || poll?.status === 'open' || !poll?.status;
    
    // Fetch results function
    const fetchResults = useCallback(async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true);
        try {
            const response = await fetch(`/.netlify/functions/vg-get-public-results?pollId=${pollId}${shareKey ? `&shareKey=${shareKey}` : ''}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(response.status === 404 ? 'Poll not found' : response.status === 403 ? (errorData.hint || 'Results are not public') : 'Failed to load');
                return;
            }
            const data = await response.json();
            setPoll(data.poll);
            setResults(data.results);
            setLastUpdated(new Date());
            setSecondsAgo(0);
            if (!isRefresh) {
                setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500); }, 600);
            }
        } catch (err) {
            if (!isRefresh) setError('Unable to load results');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [pollId, shareKey]);
    
    // Initial fetch
    useEffect(() => { fetchResults(); }, [fetchResults]);
    
    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (loading || error || !adWallPassed && isFreeTier) return;
        const refreshInterval = setInterval(() => fetchResults(true), 30000);
        return () => clearInterval(refreshInterval);
    }, [loading, error, adWallPassed, isFreeTier, fetchResults]);
    
    // Update "seconds ago" counter
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [lastUpdated]);
    
    // Countdown for ad wall
    useEffect(() => {
        if (!loading && isFreeTier && !adWallPassed && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [loading, isFreeTier, adWallPassed, countdown]);
    
    // Download as PNG - loads html2canvas from CDN (no npm install needed)
    const downloadAsPng = async () => {
        if (!resultsRef.current) return;
        setIsDownloading(true);
        setIsExporting(true); // Enable export-safe styles
        
        // Wait for React to re-render with export-safe styles
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            // Load html2canvas from CDN if not already loaded
            let html2canvas = (window as any).html2canvas;
            if (!html2canvas) {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load html2canvas'));
                    document.head.appendChild(script);
                });
                html2canvas = (window as any).html2canvas;
            }
            
            const canvas = await html2canvas(resultsRef.current, {
                backgroundColor: isDark ? '#1e1b4b' : '#f8fafc',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                // Ignore elements that cause issues
                ignoreElements: (element: Element) => {
                    return element.classList?.contains('export-ignore') || 
                           element.tagName === 'BUTTON' ||
                           element.classList?.contains('blur-2xl');
                }
            });
            const link = document.createElement('a');
            link.download = `${poll?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'results'}-${pollId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to download:', err);
            alert('Download failed. Please try again.');
        } finally {
            setIsExporting(false); // Restore normal styles
            setIsDownloading(false);
        }
    };
    
    // Print results
    const printResults = () => {
        window.print();
    };
    
    // =========================================================================
    // PROCESS RESULTS BASED ON POLL TYPE
    // =========================================================================
    const processedResults = useMemo(() => {
        if (!poll || !results) return null;
        
        const totalVotes = results.totalVotes || 0;
        const options = poll.options || [];
        const maxRating = poll.maxRating || poll.ratingMax || 5;
        
        // RATING POLL
        if (pollType === 'rating') {
            const ratingResults = results.ratingResults || {};
            const ratingVotes = results.ratingVotes || results.votes || [];
            
            const optionRatings = options.map((opt: any) => {
                const data = ratingResults[opt.id] || {};
                const distribution = data.distribution || {};
                let sum = data.sum || 0, count = data.count || 0;
                if (!count && ratingVotes.length > 0) {
                    const dist: Record<number, number> = {};
                    for (let i = 1; i <= maxRating; i++) dist[i] = 0;
                    ratingVotes.forEach((v: any) => {
                        const r = Number(v.ratings?.[opt.id] ?? v.ratingVotes?.[opt.id]);
                        if (r >= 1 && r <= maxRating) { sum += r; count++; dist[r]++; }
                    });
                    return { id: opt.id, text: opt.text, average: count > 0 ? sum / count : 0, count, sum, distribution: dist, maxRating };
                }
                return { id: opt.id, text: opt.text, average: data.average || 0, count: data.count || 0, sum: data.sum || 0, distribution, maxRating };
            });
            
            const totalRatings = optionRatings.reduce((s: number, o: any) => s + o.count, 0);
            const totalSum = optionRatings.reduce((s: number, o: any) => s + o.sum, 0);
            return { type: 'rating', totalVotes, totalRatings, overallAverage: totalRatings > 0 ? totalSum / totalRatings : 0, maxRating, optionRatings, hasMultipleOptions: options.length > 1 };
        }
        
        // RANKED CHOICE
        if (pollType === 'ranked' || pollType === 'ranked-choice') {
            const rankedResults = results.rankedResults || {};
            const rankedVotes = results.rankedVotes || results.votes || [];
            const optionRanks = options.map((opt: any) => {
                const data = rankedResults[opt.id];
                if (data) return { id: opt.id, text: opt.text, avgRank: data.avgRank, count: data.count };
                let totalRank = 0, count = 0;
                rankedVotes.forEach((v: any) => {
                    const rankings = v.rankings || [];
                    const pos = rankings.indexOf(opt.id);
                    if (pos !== -1) { totalRank += pos + 1; count++; }
                });
                return { id: opt.id, text: opt.text, avgRank: count > 0 ? totalRank / count : options.length, count };
            }).sort((a: any, b: any) => a.avgRank - b.avgRank);
            return { type: 'ranked', totalVotes, optionRanks };
        }
        
        // MEETING POLL
        if (pollType === 'meeting') {
            const availability = results.availability || {};
            const timeSlots = options.map((opt: any) => {
                const data = availability[opt.id] || { yes: 0, maybe: 0, no: 0 };
                return { id: opt.id, text: opt.text || opt.date, date: opt.date, time: opt.time, yes: data.yes, maybe: data.maybe, no: data.no, score: data.yes * 2 + data.maybe };
            }).sort((a: any, b: any) => b.score - a.score);
            return { type: 'meeting', totalVotes, timeSlots, bestSlot: timeSlots[0] };
        }
        
        // RSVP
        if (pollType === 'rsvp') {
            const counts = results.rsvpCounts || results.simpleCounts || {};
            return { type: 'rsvp', totalVotes, attending: counts.yes || counts.attending || 0, notAttending: counts.no || counts['not-attending'] || 0, maybe: counts.maybe || 0 };
        }
        
        // THIS-OR-THAT / PAIRWISE
        if (pollType === 'pairwise' || pollType === 'this-or-that' || pollType === 'thisOrThat') {
            const pairResults = results.pairwiseResults || results.simpleCounts || {};
            const optionWins = options.map((opt: any) => ({
                id: opt.id, text: opt.text, imageUrl: opt.imageUrl, wins: pairResults[opt.id] || 0
            })).sort((a: any, b: any) => b.wins - a.wins);
            const totalComparisons = results.totalComparisons || optionWins.reduce((s: number, o: any) => s + o.wins, 0);
            return { type: 'pairwise', totalVotes, totalComparisons, optionWins };
        }
        
        // VISUAL POLL
        if (pollType === 'visual' || pollType === 'image') {
            const simpleCounts = results.simpleCounts || {};
            const sortedOptions = options.map((opt: any) => ({
                id: opt.id, text: opt.text, imageUrl: opt.imageUrl, count: simpleCounts[opt.id] || 0,
                percentage: totalVotes > 0 ? ((simpleCounts[opt.id] || 0) / totalVotes) * 100 : 0
            })).sort((a: any, b: any) => b.count - a.count);
            return { type: 'visual', totalVotes, sortedOptions, winner: sortedOptions[0] };
        }
        
        // MULTIPLE CHOICE (DEFAULT)
        const simpleCounts = results.simpleCounts || {};
        const hasImages = options.some((o: any) => o.imageUrl);
        const sortedOptions = options.map((opt: any) => ({
            id: opt.id, text: opt.text, imageUrl: opt.imageUrl, count: simpleCounts[opt.id] || 0,
            percentage: totalVotes > 0 ? ((simpleCounts[opt.id] || 0) / totalVotes) * 100 : 0
        })).sort((a: any, b: any) => b.count - a.count);
        return { type: hasImages ? 'visual' : 'multiple-choice', totalVotes, sortedOptions, winner: sortedOptions[0] };
    }, [poll, results, pollType]);
    
    // Share functions
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#results=${pollId}` : '';
    const voteUrl = typeof window !== 'undefined' ? `${window.location.origin}/#vote=${pollId}` : '';
    const copyToClipboard = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: "${poll?.title}"`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareToLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    const shareToFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    
    // =========================================================================
    // LOADING STATE
    // =========================================================================
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <p className="text-white/70 font-medium">Loading results...</p>
                </motion.div>
            </div>
        );
    }
    
    // =========================================================================
    // ERROR STATE
    // =========================================================================
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <motion.div className="text-center max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"><Eye size={40} className="text-white/50" /></div>
                    <h1 className="text-2xl font-black text-white mb-3">{error}</h1>
                    <p className="text-white/50 mb-8">The poll owner hasn't enabled public results sharing.</p>
                    <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl"><Sparkles size={18} />Create Your Own Poll</a>
                </motion.div>
            </div>
        );
    }
    
    if (!poll || !processedResults) return null;
    
    // =========================================================================
    // AD WALL FOR FREE TIER
    // =========================================================================
    if (isFreeTier && !adWallPassed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]" animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full relative z-10">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                        <div className="text-center mb-6">
                            <motion.div className="relative w-16 h-16 mx-auto mb-4">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                    <motion.circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" animate={{ strokeDashoffset: 283 - (283 * (5 - countdown) / 5) }} />
                                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-black text-white">{countdown > 0 ? countdown : <Check size={24} />}</span></div>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Results Loading...</h2>
                        </div>
                        <motion.button onClick={() => setAdWallPassed(true)} disabled={countdown > 0} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 ${countdown > 0 ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'}`}>
                            {countdown > 0 ? <><Clock size={20} />Please wait...</> : <><Eye size={20} />View Results<ArrowRight size={20} /></>}
                        </motion.button>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="mt-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center"><Crown size={18} className="text-white" /></div>
                            <div><h4 className="text-white font-bold text-sm">Want Instant Access?</h4><p className="text-white/50 text-xs">Skip the wait with Pro</p></div>
                        </div>
                        <a href="/pricing" className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl text-sm"><Zap size={14} />Upgrade to Pro</a>
                    </motion.div>
                </motion.div>
            </div>
        );
    }
    
    const barGradients = ['from-indigo-500 via-purple-500 to-pink-500', 'from-emerald-400 via-teal-500 to-cyan-500', 'from-amber-400 via-orange-500 to-red-500', 'from-pink-400 via-rose-500 to-red-500', 'from-cyan-400 via-blue-500 to-indigo-500'];
    const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

    // =========================================================================
    // MAIN RESULTS RENDER
    // =========================================================================
    return (
        <>
            {/* Print Styles */}
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:bg-white { background: white !important; }
                    .print\\:text-black { color: black !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-gray-200 { border-color: #e5e7eb !important; }
                }
            `}</style>
            
            {/* Embed Modal */}
            <AnimatePresence>
                {showEmbedModal && <EmbedModal pollId={pollId} onClose={() => setShowEmbedModal(false)} />}
            </AnimatePresence>
            
            <div className={`min-h-screen ${theme.bg} print:bg-white relative overflow-hidden transition-colors duration-500`}>
                {isDark && <FloatingParticles />}
                <ConfettiExplosion show={showConfetti} />
                
                {/* Background glow effects - only in dark mode */}
                {isDark && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
                        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]" />
                        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]" />
                    </div>
                )}
                {/* Light mode subtle pattern */}
                {!isDark && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden opacity-50">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-[100px]" />
                    </div>
                )}
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-12" ref={resultsRef}>
                    {/* TOOLBAR - Theme toggle, Auto-refresh, Download, Embed, Print - Hidden during export */}
                    {!isExporting && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
                            className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
                            {/* Left side: Theme toggle + Live indicator */}
                            <div className="flex items-center gap-3">
                                {/* Theme Toggle - Beautiful pill design */}
                                <div className={`flex items-center p-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                    <button 
                                        onClick={() => setColorMode('light')}
                                        className={`p-2 rounded-full transition-all ${!isDark ? 'bg-white shadow-md text-amber-500' : 'text-white/50 hover:text-white/80'}`}
                                        title="Light mode"
                                    >
                                        <Sun size={14} />
                                    </button>
                                    <button 
                                        onClick={() => setColorMode('dark')}
                                        className={`p-2 rounded-full transition-all ${isDark ? 'bg-indigo-500 shadow-md text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                        title="Dark mode"
                                    >
                                        <Moon size={14} />
                                    </button>
                                </div>
                                
                                {/* Live indicator */}
                                <div className={`flex items-center gap-2 text-xs sm:text-sm ${theme.textMuted}`}>
                                    <motion.div animate={{ scale: isRefreshing ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }}>
                                        <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
                                    </motion.div>
                                    <span>Updated {formatTimeAgo(secondsAgo)}</span>
                                    <span className={theme.textFaint}>• Auto-refreshes</span>
                                </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                <button onClick={downloadAsPng} disabled={isDownloading}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                                    {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
                                    <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Save PNG'}</span>
                                </button>
                                <button onClick={() => setShowEmbedModal(true)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                                    <Code size={14} /><span className="hidden sm:inline">Embed</span>
                                </button>
                                <button onClick={printResults}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                                    <Printer size={14} /><span className="hidden sm:inline">Print</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* HEADER */}
                    <motion.header className="text-center mb-6 sm:mb-8" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                        <motion.div 
                            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border mb-4 sm:mb-5 print:bg-indigo-100 print:border-indigo-200`}
                            style={{ 
                                backgroundColor: theme.badgeBg,
                                borderColor: theme.cardBorder
                            }}
                        >
                            <motion.div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full print:bg-emerald-500" animate={isExporting ? {} : { scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <span className={`text-xs sm:text-sm font-semibold print:text-indigo-700 ${isDark ? 'text-white/90' : 'text-slate-700'}`}>Live Results</span>
                        </motion.div>
                        <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3 leading-tight px-2 print:text-slate-900 ${theme.text}`}>{poll.title}</h1>
                        {poll.description && <p className={`text-sm sm:text-lg max-w-xl mx-auto px-4 print:text-slate-600 ${theme.textMuted}`}>{poll.description}</p>}
                    </motion.header>
                    
                    {/* VOTE NOW CTA - If poll is still open (hidden during export) */}
                    {isPollOpen && !isExporting && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                            className="mb-6 sm:mb-8 print:hidden">
                            <a href={voteUrl} 
                                className="block bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 sm:p-5 text-center hover:shadow-xl hover:shadow-emerald-500/20 transition-all group">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Vote size={20} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-bold text-base sm:text-lg">Poll is still open!</div>
                                        <div className="text-white/80 text-xs sm:text-sm">Cast your vote now →</div>
                                    </div>
                                    <ExternalLink size={20} className="text-white/60 ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                            </a>
                        </motion.div>
                    )}
                
                {/* ============================================================= */}
                {/* RATING POLL */}
                {/* ============================================================= */}
                {processedResults.type === 'rating' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Responses" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<Star size={18} />} value={processedResults.totalRatings ?? 0} label="Ratings" gradient="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Trophy size={18} />} value={(processedResults.overallAverage ?? 0).toFixed(1)} label="Average" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.3} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.4} />
                        </div>
                        
                        {(processedResults.totalRatings ?? 0) > 0 && (
                            isExporting ? (
                                // Static version for export
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ 
                                            background: 'linear-gradient(to right, #fbbf24, #facc15, #fbbf24)', 
                                            borderRadius: '24px', 
                                            padding: '4px',
                                            boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)'
                                        }}>
                                            <div style={{ 
                                                backgroundColor: isDark ? '#0f172a' : '#fffbeb',
                                                borderRadius: '22px', 
                                                padding: '32px', 
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    padding: '6px 16px', 
                                                    background: 'linear-gradient(to right, #f59e0b, #eab308)', 
                                                    borderRadius: '9999px', 
                                                    marginBottom: '16px' 
                                                }}>
                                                    <Star size={14} style={{ color: 'white' }} />
                                                    <span style={{ color: 'white', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        {processedResults.hasMultipleOptions ? 'Overall' : 'Average'} Rating
                                                    </span>
                                                </div>
                                                <div style={{ 
                                                    fontSize: '56px', 
                                                    fontWeight: 900, 
                                                    color: '#f59e0b',
                                                    lineHeight: 1.1,
                                                    marginBottom: '16px'
                                                }}>
                                                    {(processedResults.overallAverage ?? 0).toFixed(1)}
                                                    <span style={{ fontSize: '24px', color: isDark ? '#fcd34d' : '#fbbf24' }}>/{processedResults.maxRating ?? 5}</span>
                                                </div>
                                                <StarRating isExporting={isExporting} rating={processedResults.overallAverage ?? 0} max={processedResults.maxRating ?? 5} size="lg" darkMode={isDark} />
                                                <div style={{ 
                                                    marginTop: '16px', 
                                                    fontSize: '14px', 
                                                    color: isDark ? 'rgba(255,255,255,0.4)' : '#d97706'
                                                }}>
                                                    Based on {processedResults.totalRatings ?? 0} rating{(processedResults.totalRatings ?? 0) !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Animated version for normal view
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 sm:mb-8">
                                    <div className="relative">
                                        {/* Glow effect - hidden during export and in light mode */}
                                        {!isExporting && isDark && (
                                            <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl print:hidden export-ignore" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                                        )}
                                        <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl p-1 shadow-xl">
                                            <div 
                                                className="rounded-[22px] p-5 sm:p-8 text-center print:bg-amber-50"
                                                style={{ backgroundColor: isDark ? (isExporting ? '#0f172a' : 'rgba(15,23,42,0.95)') : '#fffbeb' }}
                                            >
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-4">
                                                    <Star size={14} className="text-white" /><span className="text-white font-bold text-xs uppercase tracking-wider">{processedResults.hasMultipleOptions ? 'Overall' : 'Average'} Rating</span>
                                                </motion.div>
                                                {/* Rating number */}
                                                <div className={`text-5xl sm:text-7xl font-black mb-3 sm:mb-4 ${isExporting || !isDark ? 'text-amber-500' : 'bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent'} print:text-amber-600`}>
                                                    <AnimatedNumber value={processedResults.overallAverage ?? 0} decimals={1} /><span className={`text-xl sm:text-3xl ${isDark ? (isExporting ? 'text-amber-200' : 'text-white/40') : 'text-amber-300'} print:text-amber-400`}>/{processedResults.maxRating ?? 5}</span>
                                                </div>
                                                <StarRating isExporting={isExporting} rating={processedResults.overallAverage ?? 0} max={processedResults.maxRating ?? 5} size="lg" darkMode={isDark} />
                                                <div className={`mt-3 sm:mt-4 text-xs sm:text-sm print:text-amber-600 ${isDark ? 'text-white/40' : 'text-amber-600'}`}>Based on {processedResults.totalRatings ?? 0} rating{(processedResults.totalRatings ?? 0) !== 1 ? 's' : ''}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        )}
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.7 }} 
                            className="rounded-3xl p-4 sm:p-8 border mb-6 sm:mb-8 print:bg-white print:border-gray-200 shadow-xl"
                            style={{ 
                                backgroundColor: theme.cardBg,
                                borderColor: theme.cardBorder
                            }}
                        >
                            <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 print:text-slate-900 ${theme.text}`}><BarChart3 size={18} className="text-amber-400" />{processedResults.hasMultipleOptions ? 'Ratings by Item' : 'Rating Distribution'}</h3>
                            {processedResults.optionRatings.map((option: any, idx: number) => (
                                <motion.div key={option.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: isExporting ? 0 : 0.8 + idx * 0.1 }} className="mb-6 last:mb-0">
                                    {processedResults.hasMultipleOptions && (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                            <span className={`font-bold text-sm sm:text-lg print:text-slate-900 ${theme.text}`}>{option.text}</span>
                                            <div className="flex items-center gap-2"><StarRating isExporting={isExporting} rating={option.average} max={option.maxRating} size="sm" darkMode={isDark} /><span className="text-amber-500 font-bold text-lg">{option.average.toFixed(1)}</span></div>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        {Array.from({ length: option.maxRating }, (_, i) => {
                                            const rating = option.maxRating - i;
                                            const count = option.distribution?.[rating] || 0;
                                            const pct = option.count > 0 ? (count / option.count) * 100 : 0;
                                            const barWidth = `${Math.max(pct, count > 0 ? 3 : 0)}%`;
                                            return (
                                                <div key={rating} className="flex items-center gap-2 sm:gap-3">
                                                    <div className="flex items-center gap-1 w-12 sm:w-16 justify-end flex-shrink-0"><span className="text-amber-500 text-xs sm:text-sm font-medium print:text-amber-600">{rating}</span><Star size={12} className="text-amber-400 fill-amber-400" /></div>
                                                    <div className="flex-1 h-5 sm:h-7 rounded-lg overflow-hidden print:bg-gray-100" style={{ backgroundColor: theme.barTrack }}>
                                                        {/* Use static width during export, animated otherwise */}
                                                        {isExporting ? (
                                                            <div 
                                                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-end pr-2"
                                                                style={{ width: barWidth }}
                                                            >
                                                                {pct > 20 && <span className="text-white text-[10px] sm:text-xs font-bold">{Math.round(pct)}%</span>}
                                                            </div>
                                                        ) : (
                                                            <motion.div 
                                                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg flex items-center justify-end pr-2" 
                                                                initial={{ width: 0 }} 
                                                                animate={{ width: barWidth }} 
                                                                transition={{ delay: 0.9 + idx * 0.1 + i * 0.05, duration: 0.8 }}
                                                            >
                                                                {pct > 20 && <span className="text-white text-[10px] sm:text-xs font-bold">{Math.round(pct)}%</span>}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs sm:text-sm w-6 sm:w-8 text-right flex-shrink-0 print:text-slate-600 ${theme.textFaint}`}>{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {option.count === 0 && <div className={`text-center py-6 ${theme.textFaint}`}><Star size={24} className="mx-auto mb-2 opacity-50" /><p className="text-sm">No ratings yet</p></div>}
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* RANKED CHOICE */}
                {/* ============================================================= */}
                {processedResults.type === 'ranked' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Voters" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<ListOrdered size={18} />} value={processedResults.optionRanks.length} label="Options" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.3} />
                        </div>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 print:text-slate-900"><Trophy size={18} className="text-amber-400" />Final Rankings</h3>
                            <div className="space-y-3">
                                {processedResults.optionRanks.map((option: any, idx: number) => (
                                    <motion.div key={option.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }} className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-xl p-3 sm:p-4 print:bg-gray-50">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-base sm:text-lg ${idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/30' : idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' : idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 'bg-white/10 text-white/60 print:bg-gray-200 print:text-gray-600'}`}>#{idx + 1}</div>
                                        <div className="flex-1 min-w-0"><div className="text-white font-semibold text-sm sm:text-base truncate print:text-slate-900">{option.text}</div><div className="text-white/40 text-xs sm:text-sm print:text-slate-500">Avg rank: {option.avgRank.toFixed(2)}</div></div>
                                        {idx === 0 && <Trophy size={20} className="text-amber-400 flex-shrink-0" />}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* MEETING POLL */}
                {/* ============================================================= */}
                {processedResults.type === 'meeting' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Responses" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<Calendar size={18} />} value={processedResults.timeSlots.length} label="Time Slots" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.3} />
                        </div>
                        {processedResults.bestSlot && processedResults.bestSlot.yes > 0 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="mb-6 sm:mb-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl p-4 sm:p-6 border border-emerald-500/30 text-center print:bg-emerald-50 print:border-emerald-200">
                                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-emerald-500 rounded-full mb-3"><Check size={14} className="text-white" /><span className="text-white font-bold text-xs sm:text-sm">Best Time</span></div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 print:text-emerald-800">{processedResults.bestSlot.text}</h3>
                                <p className="text-emerald-300 text-sm print:text-emerald-600">{processedResults.bestSlot.yes} available • {processedResults.bestSlot.maybe} maybe</p>
                            </motion.div>
                        )}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 print:text-slate-900">Availability Grid</h3>
                            <div className="space-y-3">
                                {processedResults.timeSlots.map((slot: any, idx: number) => (
                                    <motion.div key={slot.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + idx * 0.05 }} className="bg-white/5 rounded-xl p-3 sm:p-4 print:bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-white font-medium text-sm sm:text-base print:text-slate-900">{slot.text}</span>
                                            {idx === 0 && slot.yes > 0 && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-medium print:bg-emerald-100 print:text-emerald-700">Best</span>}
                                        </div>
                                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-emerald-500/20 rounded-lg print:bg-emerald-100"><ThumbsUp size={12} className="text-emerald-400 print:text-emerald-600" /><span className="text-emerald-300 font-medium text-sm print:text-emerald-700">{slot.yes}</span></div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-amber-500/20 rounded-lg print:bg-amber-100"><Minus size={12} className="text-amber-400 print:text-amber-600" /><span className="text-amber-300 font-medium text-sm print:text-amber-700">{slot.maybe}</span></div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-500/20 rounded-lg print:bg-red-100"><ThumbsDown size={12} className="text-red-400 print:text-red-600" /><span className="text-red-300 font-medium text-sm print:text-red-700">{slot.no}</span></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* RSVP */}
                {/* ============================================================= */}
                {processedResults.type === 'rsvp' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Responses" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<ThumbsUp size={18} />} value={processedResults.attending} label="Attending" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Minus size={18} />} value={processedResults.maybe} label="Maybe" gradient="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.3} />
                            <StatCard isExporting={isExporting} icon={<ThumbsDown size={18} />} value={processedResults.notAttending} label="Can't Make It" gradient="bg-gradient-to-br from-red-500 to-rose-600" delay={0.4} />
                        </div>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <div className="h-6 sm:h-8 flex rounded-full overflow-hidden mb-4">
                                {processedResults.totalVotes > 0 && (
                                    <>
                                        <motion.div className="bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center" initial={{ width: 0 }} animate={{ width: `${(processedResults.attending / processedResults.totalVotes) * 100}%` }} transition={{ delay: 0.6, duration: 0.8 }}>{(processedResults.attending / processedResults.totalVotes) * 100 > 15 && <span className="text-white text-xs font-bold">{Math.round((processedResults.attending / processedResults.totalVotes) * 100)}%</span>}</motion.div>
                                        <motion.div className="bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center" initial={{ width: 0 }} animate={{ width: `${(processedResults.maybe / processedResults.totalVotes) * 100}%` }} transition={{ delay: 0.7, duration: 0.8 }}>{(processedResults.maybe / processedResults.totalVotes) * 100 > 15 && <span className="text-white text-xs font-bold">{Math.round((processedResults.maybe / processedResults.totalVotes) * 100)}%</span>}</motion.div>
                                        <motion.div className="bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center" initial={{ width: 0 }} animate={{ width: `${(processedResults.notAttending / processedResults.totalVotes) * 100}%` }} transition={{ delay: 0.8, duration: 0.8 }}>{(processedResults.notAttending / processedResults.totalVotes) * 100 > 15 && <span className="text-white text-xs font-bold">{Math.round((processedResults.notAttending / processedResults.totalVotes) * 100)}%</span>}</motion.div>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /><span className="text-white/70 print:text-slate-600">Attending</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-full" /><span className="text-white/70 print:text-slate-600">Maybe</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /><span className="text-white/70 print:text-slate-600">Can't Make It</span></div>
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* THIS-OR-THAT / PAIRWISE */}
                {/* ============================================================= */}
                {processedResults.type === 'pairwise' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Voters" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<Vote size={18} />} value={processedResults.totalComparisons} label="Comparisons" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.3} />
                        </div>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 print:text-slate-900"><Trophy size={18} className="text-amber-400" />Win Rankings</h3>
                            <div className="space-y-4">
                                {processedResults.optionWins.map((option: any, idx: number) => {
                                    const pct = processedResults.totalComparisons > 0 ? (option.wins / processedResults.totalComparisons) * 100 : 0;
                                    return (
                                        <motion.div key={option.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + idx * 0.1 }}>
                                            <div className="flex items-center gap-3 mb-2">
                                                {option.imageUrl && <img src={option.imageUrl} alt={option.text} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl" />}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">{idx === 0 && <Trophy size={16} className="text-amber-400 flex-shrink-0" />}<span className="text-white font-semibold text-sm sm:text-base truncate print:text-slate-900">{option.text}</span></div>
                                                    <span className="text-white/50 text-xs print:text-slate-500">{option.wins} wins ({Math.round(pct)}%)</span>
                                                </div>
                                            </div>
                                            <div className="h-6 sm:h-8 bg-white/5 rounded-xl overflow-hidden print:bg-gray-100">
                                                <motion.div className={`h-full bg-gradient-to-r ${barGradients[idx % barGradients.length]} rounded-xl`} initial={{ width: 0 }} animate={{ width: `${Math.max(pct, option.wins > 0 ? 3 : 0)}%` }} transition={{ delay: 0.7 + idx * 0.1, duration: 0.8 }} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* VISUAL POLL */}
                {/* ============================================================= */}
                {processedResults.type === 'visual' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Votes" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<Image size={18} />} value={processedResults.sortedOptions.length} label="Options" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Trophy size={18} />} value={`${Math.round(processedResults.winner?.percentage || 0)}%`} label="Leader" gradient="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.3} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.4} />
                        </div>
                        
                        {processedResults.winner && processedResults.totalVotes > 0 && processedResults.winner.imageUrl && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 sm:mb-8">
                                <div className="relative">
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl print:hidden" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl p-1">
                                        <div className="bg-slate-900/95 rounded-[22px] p-4 sm:p-6 text-center print:bg-amber-50">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-4">
                                                <Crown size={14} className="text-white" /><span className="text-white font-bold text-xs uppercase tracking-wider">Winner</span>
                                            </motion.div>
                                            <img src={processedResults.winner.imageUrl} alt={processedResults.winner.text} className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-2xl mx-auto mb-4 shadow-2xl" />
                                            <h2 className="text-lg sm:text-2xl font-black text-white mb-2 print:text-amber-900">{processedResults.winner.text}</h2>
                                            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent print:text-amber-600"><AnimatedNumber value={Math.round(processedResults.winner.percentage)} suffix="%" /></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {processedResults.sortedOptions.map((option: any, idx: number) => (
                                    <motion.div key={option.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + idx * 0.1 }} className={`relative rounded-2xl overflow-hidden ${idx === 0 && processedResults.totalVotes > 0 ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 print:ring-offset-white' : ''}`}>
                                        {option.imageUrl ? (
                                            <img src={option.imageUrl} alt={option.text} className="w-full aspect-square object-cover" />
                                        ) : (
                                            <div className="w-full aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center print:bg-gray-100"><span className="text-white/60 text-sm px-2 text-center print:text-slate-600">{option.text}</span></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent print:hidden" />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                                            {idx === 0 && processedResults.totalVotes > 0 && <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 rounded-full mb-1"><Trophy size={10} className="text-white" /><span className="text-white text-[10px] font-bold">Winner</span></div>}
                                            <div className="text-white font-semibold text-xs sm:text-sm truncate">{option.text}</div>
                                            <div className="text-white/70 text-xs">{option.count} votes • {option.percentage.toFixed(1)}%</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* MULTIPLE CHOICE (DEFAULT) */}
                {/* ============================================================= */}
                {processedResults.type === 'multiple-choice' && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                            <StatCard isExporting={isExporting} icon={<Users size={18} />} value={processedResults.totalVotes} label="Votes" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" delay={0.1} />
                            <StatCard isExporting={isExporting} icon={<Vote size={18} />} value={processedResults.sortedOptions.length} label="Options" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" delay={0.2} />
                            <StatCard isExporting={isExporting} icon={<Trophy size={18} />} value={`${Math.round(processedResults.winner?.percentage || 0)}%`} label="Leader" gradient="bg-gradient-to-br from-amber-500 to-orange-600" delay={0.3} />
                            <StatCard isExporting={isExporting} icon={<Sparkles size={18} />} value="Live" label="Status" gradient="bg-gradient-to-br from-pink-500 to-rose-600" delay={0.4} />
                        </div>
                        
                        {processedResults.winner && processedResults.totalVotes > 0 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6 sm:mb-8">
                                <div className="relative">
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl print:hidden" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl p-1">
                                        <div className="bg-slate-900/95 rounded-[22px] p-4 sm:p-8 text-center print:bg-amber-50">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-3 sm:mb-4">
                                                <Crown size={14} className="text-white" /><span className="text-white font-bold text-xs uppercase tracking-wider">Leading</span>
                                            </motion.div>
                                            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white mb-3 sm:mb-4 px-2 print:text-amber-900">{processedResults.winner.text}</h2>
                                            <div className="flex items-center justify-center gap-4 sm:gap-10">
                                                <div className="text-center"><div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent print:text-amber-600"><AnimatedNumber value={Math.round(processedResults.winner.percentage)} suffix="%" /></div><div className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mt-1 print:text-amber-600">of votes</div></div>
                                                <div className="w-px h-10 sm:h-14 bg-white/20 print:bg-amber-200" />
                                                <div className="text-center"><div className="text-3xl sm:text-5xl font-black text-white print:text-amber-900"><AnimatedNumber value={processedResults.winner.count} /></div><div className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mt-1 print:text-amber-600">total votes</div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        
                        <motion.div className="flex justify-center mb-4 sm:mb-5 print:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                            <div className="inline-flex bg-white/10 backdrop-blur rounded-xl p-1 border border-white/20">
                                <button onClick={() => setActiveView('bar')} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${activeView === 'bar' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}><BarChart3 size={14} /><span className="hidden sm:inline">Bar</span></button>
                                <button onClick={() => setActiveView('pie')} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${activeView === 'pie' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}><PieChart size={14} /><span className="hidden sm:inline">Pie</span></button>
                            </div>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:bg-white print:border-gray-200">
                            <AnimatePresence mode="wait">
                                {activeView === 'bar' ? (
                                    <motion.div key="bar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3 sm:space-y-4">
                                        {processedResults.sortedOptions.map((option: any, idx: number) => (
                                            <motion.div key={option.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">{idx === 0 && processedResults.totalVotes > 0 && <Trophy size={14} className="text-amber-400 flex-shrink-0" />}<span className="font-bold text-white text-xs sm:text-base truncate print:text-slate-900">{option.text}</span></div>
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2"><span className="text-white/40 text-xs print:text-slate-500">{option.count}</span><span className="font-black text-white text-sm sm:text-lg w-12 sm:w-14 text-right print:text-slate-900">{option.percentage.toFixed(1)}%</span></div>
                                                </div>
                                                <div className="relative h-8 sm:h-12 bg-white/5 rounded-xl overflow-hidden print:bg-gray-100"><motion.div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barGradients[idx % barGradients.length]} rounded-xl`} initial={{ width: 0 }} animate={{ width: `${Math.max(option.percentage, option.count > 0 ? 2 : 0)}%` }} transition={{ duration: 1.2, delay: idx * 0.08 }} /></div>
                                            </motion.div>
                                        ))}
                                        {processedResults.totalVotes === 0 && <div className="text-center py-12 text-white/40"><Vote size={40} className="mx-auto mb-3 opacity-50" /><p>No votes yet</p></div>}
                                    </motion.div>
                                ) : (
                                    <motion.div key="pie" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-center py-4">
                                        <motion.div className="relative w-40 h-40 sm:w-64 sm:h-64" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 1 }}>
                                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                                {(() => {
                                                    let currentAngle = 0;
                                                    return processedResults.sortedOptions.map((option: any, idx: number) => {
                                                        const angle = (option.percentage / 100) * 360;
                                                        if (angle < 0.5) return null;
                                                        const startAngle = currentAngle * (Math.PI / 180);
                                                        const endAngle = (currentAngle + angle) * (Math.PI / 180);
                                                        currentAngle += angle;
                                                        if (angle >= 359.9) return <circle key={option.id} cx="50" cy="50" r="45" fill={pieColors[idx % pieColors.length]} />;
                                                        const x1 = 50 + 45 * Math.cos(startAngle), y1 = 50 + 45 * Math.sin(startAngle);
                                                        const x2 = 50 + 45 * Math.cos(endAngle), y2 = 50 + 45 * Math.sin(endAngle);
                                                        return <path key={option.id} d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={pieColors[idx % pieColors.length]} />;
                                                    });
                                                })()}
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 sm:w-20 sm:h-20 bg-slate-900 rounded-full shadow-xl flex flex-col items-center justify-center border-2 border-white/10 print:bg-white print:border-gray-200"><span className="text-lg sm:text-2xl font-black text-white print:text-slate-900">{processedResults.totalVotes}</span><span className="text-[8px] sm:text-[10px] text-white/40 uppercase print:text-slate-500">votes</span></div></div>
                                        </motion.div>
                                        <div className="space-y-2 w-full md:w-auto">
                                            {processedResults.sortedOptions.map((option: any, idx: number) => (
                                                <motion.div key={option.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.08 }} className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                                                    <span className="font-medium text-white text-xs sm:text-sm flex-1 truncate print:text-slate-900">{option.text}</span>
                                                    <span className="text-white/50 font-bold text-xs sm:text-sm print:text-slate-600">{option.percentage.toFixed(1)}%</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
                
                {/* ============================================================= */}
                {/* SOCIAL SHARE - Hidden during export */}
                {/* ============================================================= */}
                {poll.showSocialShare !== false && !isExporting && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8 print:hidden">
                        <div className="text-center mb-4 sm:mb-5"><h3 className="text-base sm:text-xl font-bold text-white mb-1 flex items-center justify-center gap-2"><Share2 size={18} className="text-indigo-400" />Share Results</h3><p className="text-white/40 text-xs sm:text-sm">Spread the word!</p></div>
                        <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-5">
                            <input type="text" value={shareUrl} readOnly className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white/70 font-mono focus:outline-none" />
                            <motion.button onClick={copyToClipboard} whileTap={{ scale: 0.95 }} className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'}`}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}</motion.button>
                        </div>
                        <div className="flex justify-center gap-3">
                            <motion.button onClick={shareToTwitter} whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white shadow-lg"><Twitter size={18} /></motion.button>
                            <motion.button onClick={shareToLinkedIn} whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center text-white shadow-lg"><Linkedin size={18} /></motion.button>
                            <motion.button onClick={shareToFacebook} whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg"><Facebook size={18} /></motion.button>
                        </div>
                    </motion.div>
                )}
                
                {/* CTA - Hidden during export */}
                {!isExporting && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-center print:hidden">
                        <a href="/" className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all group text-sm sm:text-base">
                            <Sparkles size={16} />Create Your Own Poll<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <p className="mt-4 sm:mt-5 text-white/20 text-xs">Powered by <span className="font-semibold text-white/40">VoteGenerator.com</span></p>
                    </motion.div>
                )}
                
                {/* Export Footer - Only shown in PNG */}
                {isExporting && (
                    <div className="mt-8 pt-4 border-t border-white/10 text-center">
                        <p className="text-white/40 text-sm">VoteGenerator.com • {new Date().toLocaleDateString()}</p>
                    </div>
                )}
                
                {/* Print Footer */}
                <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>Generated from VoteGenerator.com • {new Date().toLocaleDateString()}</p>
                </div>
                </div>
            </div>
        </>
    );
};

export default PublicResults;
// ============================================================================
// AdminDashboard.tsx - Complete with search, pagination, draft/live
// Location: src/components/AdminDashboard.tsx
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Plus, Copy, Check, ExternalLink, Trash2,
    Crown, Loader2, Clock, Users, LayoutDashboard,
    Calendar, Sparkles, AlertCircle, PlusCircle,
    Zap, Share2, Settings, X, CheckCircle, Link2,
    Shield, Eye, Edit3, Lock, Key, ChevronDown, ChevronUp,
    Search, ChevronLeft, ChevronRight, Rocket, FileEdit,
    Home, AlertTriangle
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface UserPoll {
    id: string;
    adminKey: string;
    title: string;
    type: string;
    createdAt: string;
    responseCount?: number;
    status?: 'draft' | 'live';  // For Starter/Pro polls
    expiresAt?: string;
}

interface UserSession {
    dashboardToken: string;
    tier: 'free' | 'starter' | 'pro_event' | 'unlimited';
    expiresAt?: string;
    polls: UserPoll[];
    createdAt: string;
    hasPin?: boolean;
    pinHash?: string;
    sessionId?: string;  // Stripe session ID for URL reconstruction
}

// ============================================================================
// Configuration
// ============================================================================

const POLLS_PER_PAGE = 10;

const TIER_CONFIG: Record<string, {
    label: string;
    gradient: string;
    bgGradient: string;
    headerBg: string;
    icon: React.ReactNode;
    maxPolls: number;
    activeDays: number;
    requiresActivation: boolean; // Does this tier need draft→live flow?
    features: { name: string; included: boolean }[];
}> = {
    free: {
        label: 'Free',
        gradient: 'from-slate-500 to-slate-600',
        bgGradient: 'from-slate-50 via-white to-slate-50',
        headerBg: 'bg-slate-100',
        icon: <BarChart3 size={16} />,
        maxPolls: 1,
        activeDays: 7,
        requiresActivation: false,
        features: [
            { name: 'All poll types', included: true },
            { name: '50 responses', included: true },
            { name: '7 days active', included: true },
            { name: 'Visual polls', included: false },
            { name: 'Export to CSV', included: false },
        ]
    },
    starter: {
        label: 'Starter',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50/40 via-white to-indigo-50/40',
        headerBg: 'bg-blue-50',
        icon: <Zap size={16} />,
        maxPolls: 1,
        activeDays: 30,
        requiresActivation: true,
        features: [
            { name: 'All poll types', included: true },
            { name: '500 responses', included: true },
            { name: '30 days active', included: true },
            { name: 'Export to CSV', included: true },
            { name: 'Visual polls', included: false },
        ]
    },
    pro_event: {
        label: 'Pro Event',
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-50/40 via-white to-pink-50/40',
        headerBg: 'bg-purple-50',
        icon: <Crown size={16} />,
        maxPolls: 3,
        activeDays: 60,
        requiresActivation: true,
        features: [
            { name: 'All poll types', included: true },
            { name: '2,000 responses', included: true },
            { name: '60 days active', included: true },
            { name: 'Export CSV/PDF/PNG', included: true },
        ]
    },
    unlimited: {
        label: 'Unlimited',
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'from-amber-50/30 via-white to-orange-50/30',
        headerBg: 'bg-amber-50',
        icon: <Sparkles size={16} />,
        maxPolls: Infinity,
        activeDays: 365,
        requiresActivation: false, // Unlimited doesn't need confirmation
        features: [
            { name: 'All poll types', included: true },
            { name: '10,000 responses/poll', included: true },
            { name: '1 year active', included: true },
            { name: 'Export CSV/PDF/PNG', included: true },
            { name: 'PIN protection', included: true },
            { name: 'Team tokens (10)', included: true },
        ]
    },
};

// ============================================================================
// Main Component
// ============================================================================

const AdminDashboard: React.FC = () => {
    const [session, setSession] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedDashboard, setCopiedDashboard] = useState(false);
    
    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [showAccessPanel, setShowAccessPanel] = useState(true);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [showGoLiveModal, setShowGoLiveModal] = useState<string | null>(null);
    
    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Get token and session_id from URL (supports both formats)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlSessionId = urlParams.get('session_id') || urlParams.get('s'); // Support both long and short format
    const urlTier = urlParams.get('tier') as 'starter' | 'pro_event' | 'unlimited' | null;

    // Generate deterministic token from session ID (SAME formula as webhook/CheckoutSuccess)
    const generateDashboardToken = (sessionId: string): string => {
        return `vg_${sessionId.replace('cs_', '').substring(0, 32)}`;
    };

    useEffect(() => {
        validateAndLoadSession();
    }, []);

    // Refresh poll data from backend to get updated vote counts
    const refreshPollData = async (sessionData: UserSession) => {
        if (!sessionData.polls || sessionData.polls.length === 0) return;
        
        try {
            const updatedPolls = await Promise.all(
                sessionData.polls.map(async (poll) => {
                    try {
                        const response = await fetch(`/.netlify/functions/vg-get?id=${poll.id}&admin=${poll.adminKey}`);
                        if (response.ok) {
                            const freshData = await response.json();
                            return {
                                ...poll,
                                responseCount: freshData.voteCount || freshData.responseCount || 0,
                                status: freshData.status || poll.status,
                            };
                        }
                    } catch (e) {
                        console.warn(`Failed to refresh poll ${poll.id}:`, e);
                    }
                    return poll;
                })
            );
            
            const updatedSession = { ...sessionData, polls: updatedPolls };
            setSession(updatedSession);
            localStorage.setItem('vg_user_session', JSON.stringify(updatedSession));
        } catch (e) {
            console.error('Failed to refresh poll data:', e);
        }
    };

    // Refresh poll data when session is loaded
    useEffect(() => {
        if (session && !loading) {
            refreshPollData(session);
        }
    }, [loading]);

    const validateAndLoadSession = () => {
        try {
            const stored = localStorage.getItem('vg_user_session');
            
            // Case 1: Coming from email link with session_id (short format: ?s=xxx)
            // Create session from URL params
            if (!stored && urlSessionId) {
                const expectedToken = generateDashboardToken(urlSessionId);
                
                // If token provided, verify it matches
                if (urlToken && urlToken !== expectedToken) {
                    setError('Invalid dashboard link. The token is incorrect.');
                    setLoading(false);
                    return;
                }
                
                // Determine tier (default to unlimited if not provided since email doesn't include tier)
                // We'll fetch the real tier from backend later, for now assume unlimited
                const tier = urlTier || 'unlimited';
                const days = tier === 'unlimited' ? 365 : tier === 'pro_event' ? 60 : 30;
                const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                
                // Create new session
                const newSession: UserSession = {
                    dashboardToken: expectedToken,
                    sessionId: urlSessionId,  // Store for URL reconstruction
                    tier,
                    expiresAt,
                    polls: [],
                    createdAt: new Date().toISOString(),
                };
                
                // Save to localStorage
                localStorage.setItem('vg_user_session', JSON.stringify(newSession));
                localStorage.setItem('vg_purchased_tier', tier);
                localStorage.setItem('vg_tier_expires', expiresAt);
                
                setSession(newSession);
                setLoading(false);
                return;
            }
            
            // Case 2: No stored session and no valid URL params
            if (!stored) {
                setError('No session found. Please purchase a plan first.');
                setLoading(false);
                return;
            }

            const sessionData: UserSession = JSON.parse(stored);

            // Case 3: URL token provided - verify it matches stored session
            if (urlToken && sessionData.dashboardToken !== urlToken) {
                // Check if it might be using the new session_id format
                if (urlSessionId) {
                    const expectedToken = generateDashboardToken(urlSessionId);
                    if (urlToken === expectedToken) {
                        // Token is valid via session_id, update stored session
                        sessionData.dashboardToken = urlToken;
                        localStorage.setItem('vg_user_session', JSON.stringify(sessionData));
                    } else {
                        setError('Invalid dashboard link. The token does not match.');
                        setLoading(false);
                        return;
                    }
                } else {
                    setError('Invalid dashboard link. The token does not match.');
                    setLoading(false);
                    return;
                }
            }

            // Case 4: Check if session has expired
            if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
                setError('Your plan has expired. Please renew to continue.');
                setLoading(false);
                return;
            }

            setSession(sessionData);
            setLoading(false);
        } catch (err) {
            console.error('Session load error:', err);
            setError('Failed to load session. Please try again.');
            setLoading(false);
        }
    };

    // Filtered and paginated polls
    const filteredPolls = useMemo(() => {
        if (!session) return [];
        const polls = session.polls || [];
        if (!searchQuery.trim()) return polls;
        const query = searchQuery.toLowerCase();
        return polls.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.type?.toLowerCase().includes(query)
        );
    }, [session, searchQuery]);

    const totalPages = Math.ceil(filteredPolls.length / POLLS_PER_PAGE);
    const paginatedPolls = useMemo(() => {
        const start = (currentPage - 1) * POLLS_PER_PAGE;
        return filteredPolls.slice(start, start + POLLS_PER_PAGE);
    }, [filteredPolls, currentPage]);

    // Count live polls (for Starter/Pro limit)
    const livePolls = useMemo(() => {
        if (!session) return [];
        return (session.polls || []).filter(p => p.status === 'live' || !session.tier.match(/starter|pro_event/));
    }, [session]);

    const getDashboardUrl = () => {
        // Always use the short format with just token
        const token = session?.dashboardToken;
        if (token) {
            return `${window.location.origin}/admin?token=${token}`;
        }
        // Fallback to current URL
        return window.location.href;
    };

    const handleCopyLink = (poll: UserPoll, type: 'admin' | 'vote') => {
        const url = type === 'admin'
            ? `${window.location.origin}/#id=${poll.id}&admin=${poll.adminKey}`
            : `${window.location.origin}/#id=${poll.id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(`${poll.id}-${type}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyDashboardLink = () => {
        navigator.clipboard.writeText(getDashboardUrl());
        setCopiedDashboard(true);
        setTimeout(() => setCopiedDashboard(false), 2000);
    };

    const handleDeletePoll = (poll: UserPoll) => {
        if (!confirm(`Remove "${poll.title}" from your dashboard?`)) return;
        if (session) {
            const updated = { ...session, polls: session.polls.filter(p => p.id !== poll.id) };
            localStorage.setItem('vg_user_session', JSON.stringify(updated));
            setSession(updated);
        }
    };

    const handleGoLive = async (pollId: string) => {
        if (!session) return;
        
        // Update poll status to live
        const updatedPolls = session.polls.map(p => 
            p.id === pollId ? { ...p, status: 'live' as const } : p
        );
        const updated = { ...session, polls: updatedPolls };
        localStorage.setItem('vg_user_session', JSON.stringify(updated));
        setSession(updated);
        setShowGoLiveModal(null);
        
        // TODO: Call backend to activate poll
        // await fetch('/.netlify/functions/vg-activate-poll', { ... });
    };

    const handleRegenerateToken = () => {
        if (!session) return;
        if (!confirm('Generate new dashboard link? Your old link will stop working.')) return;
        
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let newToken = '';
        for (let i = 0; i < 16; i++) {
            newToken += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const updated = { ...session, dashboardToken: newToken };
        localStorage.setItem('vg_user_session', JSON.stringify(updated));
        window.location.href = `/admin?token=${newToken}`;
    };

    const goHome = () => {
        window.location.href = '/';
    };
    
    const goToCreate = () => {
        // Ensure the tier is set in localStorage for VoteGeneratorCreate to pick up
        if (session?.tier) {
            localStorage.setItem('vg_purchased_tier', session.tier);
            // Also store expiration info
            if (session.expiresAt) {
                localStorage.setItem('vg_tier_expires', session.expiresAt);
            }
        }
        // Navigate to home with #create anchor to scroll to create section
        window.location.href = '/#create';
    };

    const canCreateMorePolls = () => {
        if (!session) return false;
        const config = TIER_CONFIG[session.tier];
        // For Starter/Pro, only count LIVE polls toward the limit
        if (config.requiresActivation) {
            return livePolls.length < config.maxPolls;
        }
        return session.polls.length < config.maxPolls;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    // Error state
    if (error || !session) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6">{error || 'Unable to load dashboard'}</p>
                    <div className="flex gap-3">
                        <a href="/recover" className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-center">
                            Recover Link
                        </a>
                        <button onClick={goHome} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tier = session.tier;
    const config = TIER_CONFIG[tier];
    const polls = session.polls || [];
    const totalVotes = polls.reduce((sum, p) => sum + (p.responseCount || 0), 0);
    const isUnlimited = tier === 'unlimited';
    const showSearch = isUnlimited && polls.length > 5;

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
            {/* Header with Paid Nav */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-10 h-10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
                    </a>
                    
                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition">
                            <PlusCircle size={18} /> Create Poll
                        </a>
                        <a href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-indigo-600 bg-indigo-50 font-medium transition">
                            <LayoutDashboard size={18} /> My Dashboard
                        </a>
                        <a href="/help" className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition">
                            <AlertCircle size={18} /> Help
                        </a>
                    </nav>
                    
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-xl text-sm font-bold flex items-center gap-2`}>
                            {config.icon} {config.label}
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">
                                {session?.expiresAt ? Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) + 'd' : ''}
                            </span>
                        </div>
                        {tier !== 'unlimited' && (
                            <a href="/#pricing" className="hidden md:flex px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition items-center gap-2">
                                <Sparkles size={16} /> Upgrade
                            </a>
                        )}
                        {isUnlimited && (
                            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-slate-100 rounded-lg transition" title="Settings">
                                <Settings size={20} className="text-slate-500" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Save Dashboard Link Banner */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <AlertCircle size={20} className="text-amber-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-amber-800">Save Your Dashboard Link!</p>
                                            <p className="text-sm text-amber-600 mb-2">Bookmark this — it's the only way to access your polls.</p>
                                            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-amber-200">
                                                <Link2 size={14} className="text-amber-500 flex-shrink-0" />
                                                <code className="text-xs text-amber-700 font-mono truncate">{getDashboardUrl()}</code>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleCopyDashboardLink} className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg font-medium flex items-center gap-2 hover:bg-amber-50 transition flex-shrink-0">
                                        {copiedDashboard ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedDashboard ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Dashboard Header with Search */}
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <LayoutDashboard size={28} className="text-indigo-600" /> Dashboard
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {polls.length === 0 ? 'Create your first poll' : 
                                     config.requiresActivation 
                                        ? `${livePolls.length} of ${config.maxPolls} polls active`
                                        : `${polls.length} poll${polls.length !== 1 ? 's' : ''}`
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Search bar for Unlimited with many polls */}
                                {showSearch && (
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            placeholder="Search polls..."
                                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 w-64"
                                        />
                                    </div>
                                )}
                                {polls.length > 0 && canCreateMorePolls() && (
                                    <button onClick={goToCreate} className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition`}>
                                        <Plus size={18} /> New Poll
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Polls List or Empty State */}
                        {polls.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12">
                                <div className="text-center">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                        <PlusCircle size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Your First Poll</h2>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                        {config.requiresActivation 
                                            ? "Create a poll and preview it. When you're happy, go live to start collecting votes."
                                            : "Welcome to VoteGenerator! Get started by creating a poll."
                                        }
                                    </p>
                                    <button onClick={goToCreate} className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:shadow-xl transition`}>
                                        <Plus size={22} /> Create New Poll
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {paginatedPolls.map((poll, index) => {
                                        const isDraft = config.requiresActivation && poll.status !== 'live';
                                        return (
                                            <motion.div
                                                key={poll.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={`bg-white rounded-xl border p-5 hover:shadow-md transition ${
                                                    isDraft ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-slate-800 text-lg truncate">{poll.title}</h3>
                                                            {isDraft && (
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                                    <FileEdit size={12} /> Draft
                                                                </span>
                                                            )}
                                                            {!isDraft && config.requiresActivation && (
                                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                                    <Rocket size={12} /> Live
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock size={14} />
                                                                {new Date(poll.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Users size={14} />
                                                                {poll.responseCount || 0} votes
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {isDraft ? (
                                                            <button
                                                                onClick={() => setShowGoLiveModal(poll.id)}
                                                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm"
                                                            >
                                                                <Rocket size={16} /> Go Live
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleCopyLink(poll, 'vote')}
                                                                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                                                                title="Copy vote link"
                                                            >
                                                                {copiedId === `${poll.id}-vote` ? <Check size={18} /> : <Share2 size={18} />}
                                                            </button>
                                                        )}
                                                        <a
                                                            href={`/#id=${poll.id}&admin=${poll.adminKey}`}
                                                            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                                                            title={isDraft ? "Preview & Edit" : "Open admin view"}
                                                        >
                                                            <ExternalLink size={18} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeletePoll(poll)}
                                                            className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition"
                                                            title="Remove from dashboard"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="px-4 py-2 text-sm text-slate-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}

                                {/* Create more button */}
                                {canCreateMorePolls() && (
                                    <div className="mt-6 text-center">
                                        <button onClick={goToCreate} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                                            <PlusCircle size={20} /> Create Another Poll
                                        </button>
                                    </div>
                                )}

                                {!canCreateMorePolls() && tier !== 'unlimited' && (
                                    <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
                                        <p className="text-slate-600 mb-2">
                                            You've used all {config.maxPolls} poll credit{config.maxPolls > 1 ? 's' : ''}.
                                        </p>
                                        <a href="/#pricing" className="text-purple-600 font-medium hover:text-purple-700">
                                            Upgrade for more →
                                        </a>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Feature Cards */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {[
                                { icon: BarChart3, title: '7 Poll Types', desc: 'Multiple choice to visual', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { icon: Users, title: 'Real-time Results', desc: 'Watch votes live', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { icon: Zap, title: 'Instant Setup', desc: 'No signup for voters', color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                        <item.icon size={24} className={item.color} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Unlimited: Security & Access */}
                        {isUnlimited && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <button onClick={() => setShowAccessPanel(!showAccessPanel)} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                            <Shield size={20} className="text-amber-600" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-800">Security & Access</h3>
                                            <p className="text-xs text-slate-500">PIN & team tokens</p>
                                        </div>
                                    </div>
                                    {showAccessPanel ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                </button>

                                {showAccessPanel && (
                                    <div className="p-4 pt-0 border-t border-slate-100">
                                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Lock size={16} className={session.hasPin ? 'text-emerald-600' : 'text-slate-400'} />
                                                    <span className="text-sm font-medium text-slate-700">Admin PIN</span>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${session.hasPin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                        {session.hasPin ? 'Active' : 'Off'}
                                                    </span>
                                                </div>
                                                <button onClick={() => setShowPinSetup(true)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                                                    {session.hasPin ? 'Change' : 'Set up'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => setShowSettings(true)} className="flex-1 py-2 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition flex items-center justify-center gap-1">
                                                <Plus size={14} /> Admin Token
                                            </button>
                                            <button onClick={() => setShowSettings(true)} className="flex-1 py-2 border-2 border-dashed border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition flex items-center justify-center gap-1">
                                                <Plus size={14} /> Viewer Token
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Plan Card */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className={`p-4 ${config.headerBg} border-b border-slate-200`}>
                                <div className="flex items-center gap-2">
                                    {config.icon}
                                    <h3 className="font-bold text-slate-800">{config.label} Plan</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="space-y-2 mb-4">
                                    {config.features.map((feature, i) => (
                                        <div key={i} className={`flex items-center gap-2 text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {feature.included ? <CheckCircle size={16} className="text-emerald-500" /> : <X size={16} className="text-red-400" />}
                                            <span className={!feature.included ? 'line-through' : ''}>{feature.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {tier !== 'unlimited' && (
                                    <a href="/#pricing" className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium text-center transition mt-3">
                                        Upgrade Plan
                                    </a>
                                )}

                                {session.expiresAt && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                                        <Calendar size={14} />
                                        <span>Expires: {new Date(session.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Total Polls</span>
                                    <span className="font-bold text-slate-800">{polls.length}</span>
                                </div>
                                {config.requiresActivation && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 text-sm">Live Polls</span>
                                        <span className="font-bold text-emerald-600">{livePolls.length}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Total Votes</span>
                                    <span className="font-bold text-slate-800">{totalVotes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Settings size={24} className="text-slate-600" /> Settings
                                </h2>
                                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* PIN Protection */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Lock size={20} className="text-amber-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Admin PIN Protection</p>
                                                <p className="text-xs text-slate-500">Add a 6-digit PIN to admin links</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowSettings(false); setShowPinSetup(true); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition">
                                            {session?.hasPin ? 'Change' : 'Set PIN'}
                                        </button>
                                    </div>
                                </div>

                                {/* Team Access Tokens */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users size={20} className="text-blue-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Team Access Tokens</p>
                                                <p className="text-xs text-slate-500">Share view/edit access with others</p>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Token management coming in next update!')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition">
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                {/* Regenerate Dashboard Token */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Key size={20} className="text-slate-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Dashboard Link</p>
                                                <p className="text-xs text-slate-500">Generate a new unique URL</p>
                                            </div>
                                        </div>
                                        <button onClick={handleRegenerateToken} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition">
                                            Regenerate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PIN Setup Modal */}
            <AnimatePresence>
                {showPinSetup && (
                    <PinSetupModalInline
                        isOpen={showPinSetup}
                        hasExistingPin={!!session?.hasPin}
                        onClose={() => setShowPinSetup(false)}
                        onSuccess={(hasPin, pinValue) => {
                            if (session) {
                                let pinHash: string | undefined = undefined;
                                if (hasPin && pinValue) {
                                    // Simple hash for PIN
                                    let hash = 0;
                                    for (let i = 0; i < pinValue.length; i++) {
                                        const char = pinValue.charCodeAt(i);
                                        hash = ((hash << 5) - hash) + char;
                                        hash = hash & hash;
                                    }
                                    pinHash = 'pin_' + Math.abs(hash).toString(16);
                                }
                                const updated = { ...session, hasPin, pinHash };
                                localStorage.setItem('vg_user_session', JSON.stringify(updated));
                                setSession(updated);
                            }
                            setShowPinSetup(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Go Live Modal */}
            <AnimatePresence>
                {showGoLiveModal && (
                    <GoLiveModalInline
                        isOpen={!!showGoLiveModal}
                        pollTitle={polls.find(p => p.id === showGoLiveModal)?.title || 'Poll'}
                        tier={tier as 'starter' | 'pro_event'}
                        pollsUsed={livePolls.length}
                        pollsMax={config.maxPolls}
                        activeDays={config.activeDays}
                        onClose={() => setShowGoLiveModal(null)}
                        onConfirm={() => handleGoLive(showGoLiveModal)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// Inline PIN Setup Modal (self-contained)
// ============================================================================

const PinSetupModalInline: React.FC<{
    isOpen: boolean;
    hasExistingPin: boolean;
    onClose: () => void;
    onSuccess: (hasPin: boolean, pinValue?: string) => void;
}> = ({ isOpen, hasExistingPin, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (step === 'enter') {
            if (pin.length !== 6 || !/^\d+$/.test(pin)) {
                setError('PIN must be exactly 6 digits');
                return;
            }
            setStep('confirm');
            setError('');
        } else {
            if (pin !== confirmPin) {
                setError('PINs do not match');
                setConfirmPin('');
                return;
            }
            // Pass the PIN value to onSuccess for hashing
            onSuccess(true, pin);
        }
    };

    const handleRemove = () => {
        if (confirm('Remove PIN protection?')) {
            onSuccess(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock size={24} />
                            <h2 className="font-bold text-lg">{hasExistingPin ? 'Change PIN' : 'Set Admin PIN'}</h2>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={20} /></button>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 text-sm mb-4">
                        {step === 'enter' ? 'Enter a 6-digit PIN to protect your admin links:' : 'Confirm your PIN:'}
                    </p>
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={step === 'enter' ? pin : confirmPin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            step === 'enter' ? setPin(val) : setConfirmPin(val);
                            setError('');
                        }}
                        placeholder="••••••"
                        className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        autoFocus
                    />
                    {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                    <div className="mt-6 flex gap-3">
                        {hasExistingPin && step === 'enter' && (
                            <button onClick={handleRemove} className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition">
                                Remove
                            </button>
                        )}
                        {step === 'confirm' && (
                            <button onClick={() => { setStep('enter'); setConfirmPin(''); }} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">
                                Back
                            </button>
                        )}
                        <button onClick={handleSubmit} disabled={step === 'enter' ? pin.length !== 6 : confirmPin.length !== 6} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50">
                            {step === 'enter' ? 'Continue' : 'Set PIN'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ============================================================================
// Inline Go Live Modal (self-contained)
// ============================================================================

const GoLiveModalInline: React.FC<{
    isOpen: boolean;
    pollTitle: string;
    tier: 'starter' | 'pro_event';
    pollsUsed: number;
    pollsMax: number;
    activeDays: number;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, pollTitle, tier, pollsUsed, pollsMax, activeDays, onClose, onConfirm }) => {
    const [confirmed, setConfirmed] = useState(false);
    const isLastPoll = pollsMax - pollsUsed === 1;
    const gradient = tier === 'pro_event' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-indigo-600';

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Rocket size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Ready to Go Live?</h2>
                            <p className="text-white/80 text-sm">Launch for real voting</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Poll</p>
                        <p className="font-bold text-slate-800 truncate">{pollTitle}</p>
                    </div>

                    <div className="mb-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <span className="text-slate-700 text-sm">Real voting will be enabled</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-blue-500" />
                            <span className="text-slate-700 text-sm">{activeDays}-day countdown starts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lock size={18} className="text-amber-500" />
                            <span className="text-slate-700 text-sm">Uses 1 of {pollsMax} poll credits</span>
                        </div>
                    </div>

                    <div className={`mb-4 p-4 rounded-xl ${isLastPoll ? 'bg-red-50 border-2 border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className={isLastPoll ? 'text-red-500' : 'text-amber-500'} />
                            <div>
                                <p className={`font-semibold ${isLastPoll ? 'text-red-700' : 'text-amber-700'}`}>
                                    {isLastPoll ? '⚠️ This is your last poll!' : 'This cannot be undone'}
                                </p>
                                <p className={`text-sm ${isLastPoll ? 'text-red-600' : 'text-amber-600'}`}>
                                    {isLastPoll ? 'After this, upgrade for more.' : 'Cannot revert to draft after going live.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 mb-6 cursor-pointer">
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600" />
                        <span className="text-sm text-slate-600">I understand this will use 1 poll credit and cannot be undone.</span>
                    </label>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">Keep as Draft</button>
                        <button onClick={onConfirm} disabled={!confirmed} className={`flex-1 py-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2`}>
                            <Rocket size={18} /> Go Live
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
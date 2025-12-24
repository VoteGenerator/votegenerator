// ============================================================================
// AdminDashboard - Updated with all feedback
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Plus, Copy, Check, ExternalLink, Trash2,
    Crown, Loader2, Clock, Users, LayoutDashboard,
    Calendar, Sparkles, AlertCircle, PlusCircle,
    Zap, Share2, Settings, X, CheckCircle, Link2
} from 'lucide-react';

interface UserPoll {
    id: string;
    adminKey: string;
    title: string;
    type: string;
    createdAt: string;
    responseCount?: number;
}

interface UserSession {
    tier: 'free' | 'starter' | 'pro_event' | 'unlimited';
    expiresAt?: string;
    polls: UserPoll[];
    createdAt: string;
}

// Tier configuration with accurate details
const TIER_CONFIG: Record<string, {
    label: string;
    tagline: string;
    gradient: string;
    bgGradient: string;
    headerBg: string;
    icon: React.ReactNode;
    maxPolls: number; // Polls from this dashboard
    maxResponses: number;
    activeDays: number;
    pollTypes: number;
    features: { name: string; included: boolean }[];
}> = {
    free: {
        label: 'Free',
        tagline: 'Basic polling',
        gradient: 'from-slate-500 to-slate-600',
        bgGradient: 'from-slate-50 to-slate-100',
        headerBg: 'bg-slate-100',
        icon: <BarChart3 size={16} />,
        maxPolls: 1,
        maxResponses: 50,
        activeDays: 7,
        pollTypes: 6,
        features: [
            { name: '6 poll types', included: true },
            { name: '50 responses', included: true },
            { name: '7 days active', included: true },
            { name: 'QR code sharing', included: true },
            { name: 'Real-time results', included: true },
            { name: 'Visual polls', included: false },
            { name: 'Export to CSV', included: false },
            { name: 'Export PDF/PNG', included: false },
            { name: 'Remove branding', included: false },
            { name: 'Custom short link', included: false },
        ]
    },
    starter: {
        label: 'Starter',
        tagline: 'For your next event',
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50 to-indigo-50',
        headerBg: 'bg-blue-50',
        icon: <Zap size={16} />,
        maxPolls: 1,
        maxResponses: 500,
        activeDays: 30,
        pollTypes: 6,
        features: [
            { name: '6 poll types', included: true },
            { name: '500 responses', included: true },
            { name: '30 days active', included: true },
            { name: 'QR code sharing', included: true },
            { name: 'Real-time results', included: true },
            { name: 'Export to CSV', included: true },
            { name: 'Device breakdown', included: true },
            { name: 'Visual polls', included: false },
            { name: 'Export PDF/PNG', included: false },
            { name: 'Remove branding', included: false },
        ]
    },
    pro_event: {
        label: 'Pro Event',
        tagline: 'For important events',
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-50 to-pink-50',
        headerBg: 'bg-purple-50',
        icon: <Crown size={16} />,
        maxPolls: 3,
        maxResponses: 2000,
        activeDays: 60,
        pollTypes: 7,
        features: [
            { name: '7 poll types (incl. Visual)', included: true },
            { name: '2,000 responses', included: true },
            { name: '60 days active', included: true },
            { name: 'QR code sharing', included: true },
            { name: 'Real-time results', included: true },
            { name: 'Export to CSV', included: true },
            { name: 'Export PDF & PNG', included: true },
            { name: 'Remove VG branding', included: true },
            { name: 'Custom short link', included: true },
            { name: 'Upload your logo', included: false },
            { name: 'Priority support', included: false },
        ]
    },
    unlimited: {
        label: 'Unlimited',
        tagline: 'For power users',
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'from-amber-50 to-orange-50',
        headerBg: 'bg-amber-50',
        icon: <Sparkles size={16} />,
        maxPolls: Infinity,
        maxResponses: 5000,
        activeDays: 365,
        pollTypes: 7,
        features: [
            { name: '7 poll types (incl. Visual)', included: true },
            { name: '5,000 responses per poll', included: true },
            { name: '1 year active', included: true },
            { name: 'QR code sharing', included: true },
            { name: 'Real-time results', included: true },
            { name: 'Export to CSV', included: true },
            { name: 'Export PDF & PNG', included: true },
            { name: 'Remove VG branding', included: true },
            { name: 'Custom short link', included: true },
            { name: 'Upload your logo', included: true },
            { name: 'Priority support', included: true },
            { name: 'Unlimited premium polls', included: true },
        ]
    },
};

const AdminDashboard: React.FC = () => {
    const [session, setSession] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedDashboard, setCopiedDashboard] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('vg_user_session');
            if (stored) {
                setSession(JSON.parse(stored));
            } else {
                const tier = localStorage.getItem('vg_purchased_tier');
                if (tier && tier !== 'free') {
                    const config = TIER_CONFIG[tier];
                    const newSession: UserSession = {
                        tier: tier as UserSession['tier'],
                        expiresAt: new Date(Date.now() + config.activeDays * 24 * 60 * 60 * 1000).toISOString(),
                        polls: [],
                        createdAt: new Date().toISOString(),
                    };
                    localStorage.setItem('vg_user_session', JSON.stringify(newSession));
                    setSession(newSession);
                } else {
                    // No paid session, redirect to home
                    window.location.href = '/';
                    return;
                }
            }
        } catch {
            window.location.href = '/';
            return;
        }
        setLoading(false);
    }, []);

    const handleCopyLink = (poll: UserPoll, type: 'admin' | 'vote') => {
        const url = type === 'admin'
            ? `${window.location.origin}/#id=${poll.id}&admin=${poll.adminKey}`
            : `${window.location.origin}/#id=${poll.id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(`${poll.id}-${type}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyDashboardLink = () => {
        navigator.clipboard.writeText(window.location.href);
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

    const goHome = () => {
        window.location.href = '/';
    };

    const canCreateMorePolls = () => {
        if (!session) return false;
        const config = TIER_CONFIG[session.tier];
        return session.polls.length < config.maxPolls;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    const tier = session.tier;
    const config = TIER_CONFIG[tier];
    const polls = session.polls || [];
    const totalVotes = polls.reduce((sum, p) => sum + (p.responseCount || 0), 0);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={goHome} className="flex items-center gap-3 hover:opacity-80 transition">
                        {/* Use SVG logo from public folder */}
                        <img src="/logo.svg" alt="VoteGenerator" className="w-10 h-10" />
                        <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
                        <div className={`ml-2 px-3 py-1 bg-gradient-to-r ${config.gradient} text-white rounded-full text-xs font-bold flex items-center gap-1.5`}>
                            {config.icon} {config.label}
                        </div>
                    </button>
                    <div className="flex items-center gap-3">
                        {tier !== 'unlimited' && (
                            <a href="/#pricing" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition flex items-center gap-2">
                                <Sparkles size={16} /> Upgrade
                            </a>
                        )}
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Settings">
                            <Settings size={20} className="text-slate-500" />
                        </button>
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
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <AlertCircle size={20} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-amber-800">Save Your Dashboard Link!</p>
                                            <p className="text-sm text-amber-600 mb-2">
                                                This URL is the only way to access your polls — bookmark it now!
                                            </p>
                                            <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 border border-amber-200">
                                                <Link2 size={14} className="text-amber-500 flex-shrink-0" />
                                                <code className="text-xs text-amber-700 font-mono truncate max-w-[280px]">
                                                    {window.location.href}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCopyDashboardLink}
                                        className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg font-medium flex items-center gap-2 hover:bg-amber-50 transition flex-shrink-0"
                                    >
                                        {copiedDashboard ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedDashboard ? 'Copied!' : 'Copy URL'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <LayoutDashboard size={28} className="text-indigo-600" /> My Dashboard
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {polls.length === 0 ? 'Create your first poll to get started' : `${polls.length} of ${config.maxPolls === Infinity ? '∞' : config.maxPolls} polls created`}
                                </p>
                            </div>
                            {polls.length > 0 && canCreateMorePolls() && (
                                <button
                                    onClick={goHome}
                                    className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition`}
                                >
                                    <Plus size={18} /> New Poll
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        {polls.length === 0 ? (
                            /* Empty State - In a colored container */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white border-2 border-dashed ${tier === 'pro_event' ? 'border-purple-200' : tier === 'starter' ? 'border-blue-200' : tier === 'unlimited' ? 'border-amber-200' : 'border-slate-200'} rounded-2xl p-12`}
                            >
                                <div className="text-center">
                                    <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                        <PlusCircle size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Your First Poll</h2>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                        Welcome to VoteGenerator! Get started by creating a poll. It only takes 30 seconds.
                                    </p>
                                    <button
                                        onClick={goHome}
                                        className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:shadow-xl transition`}
                                    >
                                        <Plus size={22} /> Create New Poll
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {polls.map((poll, index) => (
                                    <motion.div
                                        key={poll.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-800 text-lg truncate">{poll.title}</h3>
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
                                                <button
                                                    onClick={() => handleCopyLink(poll, 'vote')}
                                                    className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                                                    title="Copy vote link"
                                                >
                                                    {copiedId === `${poll.id}-vote` ? <Check size={18} /> : <Share2 size={18} />}
                                                </button>
                                                <a
                                                    href={`/#id=${poll.id}&admin=${poll.adminKey}`}
                                                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                                                    title="Open admin view"
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
                                ))}

                                {/* Create More - if allowed */}
                                {canCreateMorePolls() && (
                                    <div className="mt-6 text-center py-4">
                                        <button
                                            onClick={goHome}
                                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <PlusCircle size={20} />
                                            Create Another Poll
                                        </button>
                                    </div>
                                )}

                                {/* At limit message */}
                                {!canCreateMorePolls() && tier !== 'unlimited' && (
                                    <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
                                        <p className="text-slate-600 mb-2">
                                            You've used all {config.maxPolls} poll{config.maxPolls > 1 ? 's' : ''} in your {config.label} plan.
                                        </p>
                                        <a href="/#pricing" className="text-purple-600 font-medium hover:text-purple-700">
                                            Upgrade for more polls →
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Feature Cards - Fixed height */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {[
                                { icon: BarChart3, title: '7 Poll Types', desc: 'From ranked choice to visual polls', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { icon: Users, title: 'Real-time Results', desc: 'Watch votes come in live', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { icon: Zap, title: 'Instant Setup', desc: 'No signup required for voters', color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="bg-white rounded-xl border border-slate-200 p-5 h-[140px] flex flex-col items-center justify-center text-center"
                                >
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                                        <item.icon size={24} className={item.color} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-80 space-y-6">
                        {/* Plan Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                        >
                            <div className={`p-4 ${config.headerBg} border-b border-slate-200`}>
                                <div className="flex items-center gap-2">
                                    {config.icon}
                                    <h3 className="font-bold text-slate-800">{config.label} Plan</h3>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">{config.tagline}</p>
                            </div>
                            <div className="p-4">
                                {/* Features list with checkmarks and X marks */}
                                <div className="space-y-2 mb-4">
                                    {config.features.map((feature, i) => (
                                        <div key={i} className={`flex items-center gap-2 text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {feature.included ? (
                                                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                            ) : (
                                                <X size={16} className="text-red-400 flex-shrink-0" />
                                            )}
                                            <span className={!feature.included ? 'line-through' : ''}>{feature.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Polls remaining */}
                                <div className="pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-slate-500">Polls from dashboard:</span>
                                        <span className="font-bold text-slate-800">
                                            {polls.length} / {config.maxPolls === Infinity ? '∞' : config.maxPolls}
                                        </span>
                                    </div>

                                    {/* Upgrade button for non-unlimited */}
                                    {tier !== 'unlimited' && (
                                        <a
                                            href="/#pricing"
                                            className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium text-center transition mt-3"
                                        >
                                            Upgrade Plan
                                        </a>
                                    )}

                                    {/* Expiration date */}
                                    {session.expiresAt && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar size={14} />
                                            <span>Expires: {new Date(session.expiresAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl border border-slate-200 p-4"
                        >
                            <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Total Polls</span>
                                    <span className="font-bold text-slate-800">{polls.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Total Votes</span>
                                    <span className="font-bold text-slate-800">{totalVotes}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Active Polls</span>
                                    <span className="font-bold text-emerald-600">{polls.length}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
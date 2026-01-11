// ============================================================================
// PollDashboard.tsx - Redesigned Poll Dashboard
// Typeform-inspired, organized with tabs and collapsible sections
// Location: src/components/PollDashboard.tsx
// ============================================================================
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Share2, Settings, Lock, ChevronDown,
    Copy, Check, Globe, MessageCircle, Smartphone, Mail, QrCode, Palette,
    Code, Image as ImageIcon, Link2, Bell, FileSpreadsheet, Download,
    Clock, TrendingUp, LayoutDashboard, Key,
    RefreshCw, Loader2, Eye, EyeOff, ArrowRight,
    ShieldAlert, X, Sparkles, AlertTriangle, FileDown
} from 'lucide-react';
import VoteGeneratorResults from './VoteGeneratorResults';
import ShareCards from './ShareCards';
import NotificationSettings from './NotificationSettings';
import CustomSlugInput from './CustomSlugInput';
import ResponseTimelineChart from './ResponseTimelineChart';
import HourlyHeatmap from './HourlyHeatmap';
import GeoChart from './GeoChart';
import CommentWordCloud from './CommentWordCloud';
import DateRangeFilter from './DateRangeFilter';
import CrossTabFilter from './CrossTabFilter';
import EmbedModal from './EmbedPoll';
import UpgradeModal from './UpgradeModal';
import EmailAdminLink from './EmailAdminLink';
import DraftLiveToggle from './DraftLiveToggle';
import { AnimatedCounter, PulseIndicator } from './AnimatedComponents';
import { Poll, RunoffResult } from '../types';

interface PollDashboardProps {
    poll: Poll;
    results: RunoffResult;
    adminKey: string;
    onEdit: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

type TabType = 'results' | 'share' | 'settings' | 'analytics';

// Tab color configurations
const tabColors: Record<TabType, { active: string; hover: string; icon: string }> = {
    results: { 
        active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200', 
        hover: 'hover:bg-indigo-50 text-slate-600',
        icon: 'text-indigo-500'
    },
    share: { 
        active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200', 
        hover: 'hover:bg-emerald-50 text-slate-600',
        icon: 'text-emerald-500'
    },
    settings: { 
        active: 'bg-slate-700 text-white shadow-lg shadow-slate-200', 
        hover: 'hover:bg-slate-100 text-slate-600',
        icon: 'text-slate-500'
    },
    analytics: { 
        active: 'bg-purple-600 text-white shadow-lg shadow-purple-200', 
        hover: 'hover:bg-purple-50 text-slate-600',
        icon: 'text-purple-500'
    },
};

// Collapsible Section Component
const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    badge?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, icon, defaultOpen = true, badge, children, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-slate-500">{icon}</div>
                    <span className="font-semibold text-slate-800">{title}</span>
                    {badge}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-5 pb-5 border-t border-slate-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Upgrade Badge
const UpgradeBadge: React.FC<{ small?: boolean }> = ({ small }) => (
    <span className={`inline-flex items-center gap-1 ${small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} rounded-full font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700`}>
        <Lock size={small ? 10 : 12} />
        Upgrade
    </span>
);

const PollDashboard: React.FC<PollDashboardProps> = ({
    poll,
    results,
    adminKey,
    onEdit,
    onRefresh,
    isRefreshing
}) => {
    // State
    const [activeTab, setActiveTab] = useState<TabType>('results');
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showShareCards, setShowShareCards] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeHighlight, setUpgradeHighlight] = useState<string | undefined>();
    const [analyticsDateRange, setAnalyticsDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [crossTabFilteredVotes, setCrossTabFilteredVotes] = useState<any[]>([]);
    const [isExporting, setIsExporting] = useState(false);

    // Computed values
    const tier = useMemo(() => {
        return localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
    }, []);
    
    const isPro = tier === 'pro' || tier === 'business';
    const isBusiness = tier === 'business';
    const isFree = tier === 'free';
    
    const shareUrl = `${window.location.origin}/#id=${poll.id}`;
    const adminUrl = `${window.location.origin}/#id=${poll.id}&admin=${adminKey}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff`;
    
    const voteCount = results.totalVotes || 0;
    const maxVotes = isFree ? 100 : (tier === 'pro' ? 10000 : 100000);
    const usagePercentage = (voteCount / maxVotes) * 100;
    
    // Handlers
    const copyToClipboard = async (text: string, type: 'share' | 'admin' | 'codes') => {
        await navigator.clipboard.writeText(text);
        if (type === 'share') {
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        } else if (type === 'admin') {
            setCopiedAdmin(true);
            setTimeout(() => setCopiedAdmin(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
    };

    const handleExportCSV = async () => {
        if (!isPro) {
            setUpgradeHighlight('export');
            setShowUpgradeModal(true);
            return;
        }
        setIsExporting(true);
        // Export logic would go here
        setTimeout(() => setIsExporting(false), 1000);
    };

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'poll-qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to download QR", e);
        }
    };

    const shareToWhatsapp = () => {
        const text = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToSms = () => {
        const text = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToEmail = () => {
        const subject = `Vote: ${poll.title}`;
        const body = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    };

    // Stats calculations
    const velocity = useMemo(() => {
        const votes = results.votes || [];
        if (votes.length === 0) return 0;
        const now = Date.now();
        return votes.filter((v: any) => 
            new Date(v.timestamp).getTime() > now - 24 * 60 * 60 * 1000
        ).length;
    }, [results.votes]);

    const firstVoteDate = useMemo(() => {
        const votes = results.votes || [];
        if (votes.length === 0) return null;
        return new Date(votes[0]?.timestamp);
    }, [results.votes]);

    const lastVoteDate = useMemo(() => {
        const votes = results.votes || [];
        if (votes.length === 0) return null;
        return new Date(votes[votes.length - 1]?.timestamp);
    }, [results.votes]);

    const tabs = [
        { id: 'results' as TabType, label: 'Results', icon: BarChart3 },
        { id: 'share' as TabType, label: 'Share', icon: Share2 },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
        { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp, premium: !isPro },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* ================================================================ */}
            {/* HEADER WITH POLL STATUS TOGGLE */}
            {/* ================================================================ */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-2xl font-black text-slate-900 truncate">
                                {poll.title}
                            </h1>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                tier === 'business' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' :
                                tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                            </span>
                        </div>
                        {poll.description && (
                            <p className="text-slate-500 text-sm line-clamp-2">{poll.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
                
                {/* Poll Status Toggle (Pause/Resume) */}
                <div className="mt-4">
                    <DraftLiveToggle
                        pollId={poll.id}
                        adminKey={adminKey}
                        status={(poll as any).status || 'live'}
                        voteCount={voteCount}
                        onStatusChange={onRefresh}
                    />
                </div>
            </div>

            {/* ================================================================ */}
            {/* QUICK STATS BAR */}
            {/* ================================================================ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                    <div className="text-3xl font-black text-indigo-600">
                        <AnimatedCounter value={voteCount} />
                    </div>
                    <div className="text-xs text-indigo-600/70 font-medium mt-1">Total Votes</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-3xl font-black text-emerald-600">
                        <AnimatedCounter value={velocity} />
                        <span className="text-lg font-semibold text-emerald-400">/day</span>
                    </div>
                    <div className="text-xs text-emerald-600/70 font-medium mt-1">Velocity</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="text-lg font-bold text-slate-700">
                        {firstVoteDate ? firstVoteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">First Vote</div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="text-lg font-bold text-slate-700">
                        {lastVoteDate ? (() => {
                            const diffMs = Date.now() - lastVoteDate.getTime();
                            const diffMins = Math.floor(diffMs / 60000);
                            if (diffMins < 60) return `${diffMins}m ago`;
                            const diffHours = Math.floor(diffMins / 60);
                            if (diffHours < 24) return `${diffHours}h ago`;
                            return lastVoteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        })() : '—'}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Last Vote</div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* USAGE METER (Free Tier) */}
            {/* ================================================================ */}
            {isFree && (
                <div className={`mb-6 p-4 rounded-2xl border-2 ${
                    usagePercentage >= 90 ? 'bg-red-50 border-red-200' :
                    usagePercentage >= 75 ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                }`}>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 uppercase">Free Plan</span>
                            <span className="text-sm font-semibold text-slate-700">
                                {voteCount} / {maxVotes} responses
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                setUpgradeHighlight('unlimited');
                                setShowUpgradeModal(true);
                            }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            Upgrade for 10K+ responses <ArrowRight size={12} />
                        </button>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            className={`h-full rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' :
                                usagePercentage >= 75 ? 'bg-amber-500' :
                                'bg-indigo-500'
                            }`}
                        />
                    </div>
                    {usagePercentage >= 75 && (
                        <p className={`text-xs mt-2 ${usagePercentage >= 90 ? 'text-red-700' : 'text-amber-700'}`}>
                            ⚠️ {usagePercentage >= 90 ? 'Almost at limit! New votes will be blocked.' : 'Approaching limit.'}{' '}
                            <button 
                                onClick={() => {
                                    setUpgradeHighlight('unlimited');
                                    setShowUpgradeModal(true);
                                }}
                                className="underline hover:no-underline font-semibold"
                            >
                                Upgrade now
                            </button>
                        </p>
                    )}
                </div>
            )}

            {/* ================================================================ */}
            {/* TAB NAVIGATION - Colored Tabs */}
            {/* ================================================================ */}
            <div className="mb-6">
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const isLocked = tab.premium;
                        const colors = tabColors[tab.id];
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (isLocked) {
                                        setUpgradeHighlight('analytics');
                                        setShowUpgradeModal(true);
                                    } else {
                                        setActiveTab(tab.id);
                                    }
                                }}
                                className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    isActive 
                                        ? colors.active
                                        : isLocked
                                            ? 'text-slate-400 hover:text-slate-500'
                                            : colors.hover
                                }`}
                            >
                                <Icon size={18} className={isActive ? '' : colors.icon} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {isLocked && <Lock size={14} className="text-amber-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ================================================================ */}
            {/* TAB CONTENT */}
            {/* ================================================================ */}
            <AnimatePresence mode="wait">
                {/* RESULTS TAB */}
                {activeTab === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Poll Results */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <VoteGeneratorResults 
                                poll={poll} 
                                results={results}
                                onEdit={onEdit}
                                adminKey={adminKey}
                                isAdmin={true}
                            />
                        </div>

                        {/* Vote Activity Timeline */}
                        {results.votes && results.votes.length > 0 && (
                            <CollapsibleSection
                                title="Vote Activity"
                                icon={<TrendingUp size={20} />}
                                defaultOpen={true}
                            >
                                <div className="pt-4">
                                    <ResponseTimelineChart
                                        votes={results.votes}
                                        days={7}
                                        showTrend={true}
                                    />
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Downloads Section */}
                        <CollapsibleSection
                            title="Downloads"
                            icon={<FileDown size={20} />}
                            defaultOpen={false}
                        >
                            <div className="pt-4 space-y-3">
                                {/* QR Code - Free */}
                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <QrCode size={20} className="text-slate-600" />
                                        <span className="font-medium text-slate-700">QR Code (PNG)</span>
                                    </div>
                                    <Download size={18} className="text-slate-400" />
                                </button>
                                
                                {/* CSV Export - Paid */}
                                <button
                                    onClick={handleExportCSV}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet size={20} className="text-emerald-600" />
                                        <span className="font-medium text-slate-700">Export CSV</span>
                                        {!isPro && <UpgradeBadge small />}
                                    </div>
                                    {isExporting ? (
                                        <Loader2 size={18} className="text-slate-400 animate-spin" />
                                    ) : (
                                        <Download size={18} className="text-slate-400" />
                                    )}
                                </button>
                                
                                {/* PDF Report - Paid */}
                                <button
                                    onClick={() => {
                                        if (!isPro) {
                                            setUpgradeHighlight('export');
                                            setShowUpgradeModal(true);
                                        } else {
                                            window.print();
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileDown size={20} className="text-red-500" />
                                        <span className="font-medium text-slate-700">PDF Report</span>
                                        {!isPro && <UpgradeBadge small />}
                                    </div>
                                    <Download size={18} className="text-slate-400" />
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActiveTab('share')}
                                className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold transition-colors"
                            >
                                <Share2 size={18} />
                                Share Poll
                            </button>
                            <button
                                onClick={onEdit}
                                className="flex items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                <Settings size={18} />
                                Edit Poll
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* SHARE TAB */}
                {activeTab === 'share' && (
                    <motion.div
                        key="share"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Share Link */}
                        <CollapsibleSection
                            title="Share Link"
                            icon={<Link2 size={20} />}
                            defaultOpen={true}
                        >
                            <div className="pt-4 space-y-4">
                                {/* Voter Link */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                                        Voter Link
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={shareUrl}
                                                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none"
                                            />
                                        </div>
                                        <motion.button
                                            onClick={() => copyToClipboard(shareUrl, 'share')}
                                            className={`px-5 rounded-xl font-bold transition-all ${
                                                copiedShare 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {copiedShare ? <Check size={18} /> : <Copy size={18} />}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Share Buttons */}
                                <div className="grid grid-cols-5 gap-2">
                                    <button 
                                        onClick={shareToWhatsapp}
                                        className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                                    >
                                        <MessageCircle size={20} />
                                        <span className="text-xs font-medium">WhatsApp</span>
                                    </button>
                                    <button 
                                        onClick={shareToSms}
                                        className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                                    >
                                        <Smartphone size={20} />
                                        <span className="text-xs font-medium">SMS</span>
                                    </button>
                                    <button 
                                        onClick={shareToEmail}
                                        className="flex flex-col items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                                    >
                                        <Mail size={20} />
                                        <span className="text-xs font-medium">Email</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowQrModal(true)}
                                        className="flex flex-col items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                                    >
                                        <QrCode size={20} />
                                        <span className="text-xs font-medium">QR Code</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowShareCards(true)}
                                        className="flex flex-col items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors"
                                    >
                                        <Palette size={20} />
                                        <span className="text-xs font-medium">Cards</span>
                                    </button>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* Embed Poll - Available to ALL */}
                        <CollapsibleSection
                            title="Embed Poll"
                            icon={<Code size={20} />}
                            badge={isFree && usagePercentage >= 100 ? (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                    At Limit
                                </span>
                            ) : null}
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isFree && usagePercentage >= 100 ? (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-red-800">Response Limit Reached</p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Your embedded poll will show a "limit reached" message to voters. 
                                                    Upgrade to continue collecting responses.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setUpgradeHighlight('unlimited');
                                                        setShowUpgradeModal(true);
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Add this poll to your website, blog, or Notion page.
                                            {isFree && (
                                                <span className="text-slate-500"> Includes "Powered by VoteGenerator" badge.</span>
                                            )}
                                        </p>
                                        <button
                                            onClick={() => setShowEmbedModal(true)}
                                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Code size={18} />
                                            Get Embed Code
                                        </button>
                                        {isFree && (
                                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                                <Lock size={12} className="text-amber-500" />
                                                <button
                                                    onClick={() => {
                                                        setUpgradeHighlight('branding');
                                                        setShowUpgradeModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Upgrade
                                                </button>
                                                {' '}to remove branding
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Custom Short Link - Paid Feature */}
                        <CollapsibleSection
                            title="Custom Short Link"
                            icon={<Link2 size={20} />}
                            badge={!isPro && <UpgradeBadge small />}
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isPro ? (
                                    <CustomSlugInput
                                        pollId={poll.id}
                                        adminKey={adminKey}
                                        currentSlug={(poll as any).customSlug}
                                        tier={tier}
                                        onUpgradeClick={() => {
                                            setUpgradeHighlight('branding');
                                            setShowUpgradeModal(true);
                                        }}
                                    />
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Sparkles size={20} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-amber-800">Paid Feature</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Create memorable links like <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">vote.gen/your-poll</code>
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setUpgradeHighlight('branding');
                                                        setShowUpgradeModal(true);
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg text-sm transition-colors"
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Backup Admin Link */}
                        <CollapsibleSection
                            title="Backup Dashboard Link"
                            icon={<Key size={20} />}
                            defaultOpen={false}
                        >
                            <div className="pt-4 space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm text-blue-800 flex items-start gap-2">
                                        <Mail size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>
                                            Email yourself this link to access this poll's dashboard from any device. 
                                            <strong> This link only manages THIS poll</strong>, not your other polls.
                                        </span>
                                    </p>
                                </div>
                                <EmailAdminLink
                                    pollId={poll.id}
                                    adminKey={adminKey}
                                    pollTitle={poll.title}
                                />
                            </div>
                        </CollapsibleSection>
                    </motion.div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Poll Settings */}
                        <CollapsibleSection
                            title="Poll Settings"
                            icon={<Settings size={20} />}
                            defaultOpen={true}
                        >
                            <div className="pt-4 space-y-4">
                                {/* Current Settings Display */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs text-slate-500 font-medium mb-1">Security</div>
                                        <div className="font-semibold text-slate-800 capitalize">
                                            {poll.settings.security || 'None'}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs text-slate-500 font-medium mb-1">Results</div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                                            {poll.settings.hideResults ? (
                                                <><EyeOff size={14} /> Hidden</>
                                            ) : (
                                                <><Eye size={14} /> Visible</>
                                            )}
                                        </div>
                                    </div>
                                    {poll.settings.deadline && (
                                        <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                                            <div className="text-xs text-slate-500 font-medium mb-1">Deadline</div>
                                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(poll.settings.deadline).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button
                                    onClick={onEdit}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Settings size={18} />
                                    Edit Poll Settings
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* Access Codes */}
                        {poll.allowedCodes && poll.allowedCodes.length > 0 && (
                            <CollapsibleSection
                                title="Access Codes"
                                icon={<Key size={20} />}
                                badge={<span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">{poll.allowedCodes.length}</span>}
                                defaultOpen={false}
                            >
                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-sm text-slate-600">
                                            {poll.allowedCodes.length} unique codes generated
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(poll.allowedCodes!.join('\n'), 'codes')}
                                            className={`text-sm font-medium flex items-center gap-1 ${
                                                copiedCodes ? 'text-emerald-600' : 'text-indigo-600 hover:text-indigo-700'
                                            }`}
                                        >
                                            {copiedCodes ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedCodes ? 'Copied!' : 'Copy All'}
                                        </button>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-600">
                                        {poll.allowedCodes.map((code, i) => (
                                            <div key={i} className="py-0.5">{code}</div>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Email Notifications */}
                        <CollapsibleSection
                            title="Email Notifications"
                            icon={<Bell size={20} />}
                            badge={isFree ? (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                    1 included
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                    All included
                                </span>
                            )}
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isFree && (
                                    <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <p className="text-sm text-slate-600">
                                            <strong>Free plan:</strong> Get notified when your poll reaches 100 votes or closes.{' '}
                                            <button
                                                onClick={() => {
                                                    setUpgradeHighlight('notifications');
                                                    setShowUpgradeModal(true);
                                                }}
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                Upgrade
                                            </button>
                                            {' '}for real-time alerts, daily digests, and more.
                                        </p>
                                    </div>
                                )}
                                <NotificationSettings 
                                    pollId={poll.id}
                                    adminKey={adminKey}
                                    pollTitle={poll.title}
                                    tier={tier}
                                />
                            </div>
                        </CollapsibleSection>

                        {/* Custom Branding */}
                        <CollapsibleSection
                            title="Custom Branding"
                            icon={<ImageIcon size={20} />}
                            badge={!isPro && <UpgradeBadge small />}
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isPro ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600">
                                            Upload your logo to display on the poll and embed.
                                        </p>
                                        <button
                                            onClick={onEdit}
                                            className="w-full py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ImageIcon size={18} />
                                            Upload Logo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <ImageIcon size={20} className="text-purple-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-purple-800">Paid Feature</p>
                                                <p className="text-sm text-purple-700 mt-1">
                                                    Remove "Powered by VoteGenerator" and add your own logo.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setUpgradeHighlight('branding');
                                                        setShowUpgradeModal(true);
                                                    }}
                                                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm transition-colors"
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>
                    </motion.div>
                )}

                {/* ANALYTICS TAB - Pro+ Only */}
                {activeTab === 'analytics' && isPro && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Date Range Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-purple-500" />
                                <h3 className="font-bold text-slate-800">Analytics Dashboard</h3>
                                {(analyticsDateRange.start || analyticsDateRange.end) && (
                                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                        Filtered
                                    </span>
                                )}
                            </div>
                            <DateRangeFilter 
                                onRangeChange={(start, end) => setAnalyticsDateRange({ start, end })}
                                minDate={results.votes && results.votes.length > 0 ? new Date(results.votes[0]?.timestamp) : undefined}
                            />
                        </div>

                        {/* Cross-Tab Filters */}
                        {results.votes && results.votes.length >= 5 && (
                            <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <CrossTabFilter 
                                    votes={results.votes}
                                    onFilteredVotesChange={setCrossTabFilteredVotes}
                                />
                            </div>
                        )}

                        {/* Analytics Grid */}
                        {results.votes && results.votes.length >= 5 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                                    <HourlyHeatmap votes={crossTabFilteredVotes.length > 0 ? crossTabFilteredVotes : results.votes} />
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                                    <GeoChart votes={crossTabFilteredVotes.length > 0 ? crossTabFilteredVotes : results.votes} maxCountries={5} />
                                </div>
                                {results.comments && results.comments.length >= 3 && (
                                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200">
                                        <CommentWordCloud comments={results.comments} maxWords={15} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl p-12 text-center">
                                <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
                                <h3 className="font-bold text-slate-600 mb-2">Not Enough Data Yet</h3>
                                <p className="text-slate-500 text-sm">
                                    Analytics will appear once you have at least 5 votes.
                                </p>
                            </div>
                        )}

                        {/* Bot Protection Stats */}
                        {(poll as any).blockedVotes?.total > 0 && (
                            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <ShieldAlert size={24} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-800">Bot Protection Active</h4>
                                        <p className="text-sm text-amber-700">
                                            Blocked <span className="font-bold">{(poll as any).blockedVotes.total}</span> suspicious attempts
                                            {(poll as any).blockedVotes.honeypot > 0 && ` • ${(poll as any).blockedVotes.honeypot} honeypot`}
                                            {(poll as any).blockedVotes.timing > 0 && ` • ${(poll as any).blockedVotes.timing} timing`}
                                            {(poll as any).blockedVotes.rateLimit > 0 && ` • ${(poll as any).blockedVotes.rateLimit} rate limit`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================================================================ */}
            {/* MODALS */}
            {/* ================================================================ */}
            
            {/* QR Code Modal */}
            <AnimatePresence>
                {showQrModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowQrModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-800">Scan to Vote</h3>
                                <button 
                                    onClick={() => setShowQrModal(false)} 
                                    className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-center mb-4">
                                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                            </div>
                            <button
                                onClick={handleDownloadQR}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Download QR Code
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Cards Modal */}
            <AnimatePresence>
                {showShareCards && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowShareCards(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <ShareCards
                                pollId={poll.id}
                                pollTitle={poll.title}
                                pollDescription={poll.description}
                                pollUrl={shareUrl}
                                onClose={() => setShowShareCards(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Embed Modal */}
            <EmbedModal
                poll={poll}
                isOpen={showEmbedModal}
                onClose={() => setShowEmbedModal(false)}
                isPremium={isPro}
                onUpgradeClick={() => {
                    setShowEmbedModal(false);
                    setUpgradeHighlight('branding');
                    setShowUpgradeModal(true);
                }}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => {
                    setShowUpgradeModal(false);
                    setUpgradeHighlight(undefined);
                }}
                currentTier={tier as 'free' | 'pro' | 'business'}
                highlightFeature={upgradeHighlight}
                source="poll_dashboard"
            />
        </div>
    );
};

export default PollDashboard;
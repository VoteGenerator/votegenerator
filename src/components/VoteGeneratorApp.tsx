import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, RefreshCw, ArrowRight, FileSpreadsheet, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, Globe, QrCode, X, Download, ListOrdered, CheckSquare, Calendar, Coins, LayoutGrid, GitCompare, SlidersHorizontal, Zap, Crown, PlusCircle, Palette, Key, Code, Image as ImageIcon, Bell, ShieldAlert, Filter } from 'lucide-react';
import LandingPage from './LandingPage';
import CreatePage from './CreatePage';
import AdWall from './AdWall';
import CheckoutSuccess from './CheckoutSuccess';
import TemplatesPage from './TemplatesPage';
import PricingPage from './PricingPage';
import YouTubeCreatorsPage from './YouTubeCreatorsPage';
import TwitchStreamersPage from './TwitchStreamersPage';
import AdminDashboard from './AdminDashboard';
import ShareCards from './ShareCards';
import NotificationSettings from './NotificationSettings';
import EmbedModal from './EmbedPoll';
import LogoUpload from './LogoUpload';
import CustomSlugInput from './CustomSlugInput';
import DraftLiveToggle from './DraftLiveToggle';
import EmailAdminLink from './EmailAdminLink';
import ResponseTimelineChart from './ResponseTimelineChart';
import FeatureTeaserCard, { FeatureTeaserGrid } from './FeatureTeaserCard';
import HourlyHeatmap from './HourlyHeatmap';
import GeoChart from './GeoChart';
import CommentWordCloud from './CommentWordCloud';
import DateRangeFilter, { useDateRangeFilter } from './DateRangeFilter';
import CrossTabFilter from './CrossTabFilter';
import UpgradeModal from './UpgradeModal';
import { AnimatedCounter, PulseIndicator, Skeleton } from './AnimatedComponents';
import { SkipLink, LiveRegion } from './AccessibilityUtils';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorEdit from './VoteGeneratorEdit';
// NEW: Path-based survey pages
import SurveyPage from '../pages/SurveyPage';
import EmployeeSurveyPage from '../pages/EmployeeSurveyPage';
import CustomerFeedbackPage from '../pages/CustomerFeedbackPage';
import ContactPage from './ContactPage';
import BlogIndex from './blog/BlogIndex';
import BlogPostAnonymousSurvey from './blog/BlogPostAnonymousSurvey';
import BlogPost50Questions from './blog/BlogPost50Questions';
import { getPoll, getPollAsAdmin, getResults, hasVoted, getRawVotes } from '../services/voteGeneratorService';
import { Poll, RunoffResult } from '../types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'vote'; poll: Poll }
    | { type: 'results'; poll: Poll; results: RunoffResult; isAdmin?: boolean }
    | { type: 'edit'; poll: Poll; isAdmin: boolean }
    | { type: 'error'; message: string };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showShareCards, setShowShareCards] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [adminLinkWarningDismissed, setAdminLinkWarningDismissed] = useState(false);
    const [analyticsDateRange, setAnalyticsDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [crossTabFilteredVotes, setCrossTabFilteredVotes] = useState<any[]>([]);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeHighlight, setUpgradeHighlight] = useState<string | undefined>(undefined);
    const pollInterval = useRef<number | undefined>(undefined);

    const parseHash = useCallback(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        return {
            pollId: params.get('id'),
            adminKey: params.get('admin')
        };
    }, []);

    const loadView = useCallback(async (silent = false) => {
        const { pollId, adminKey } = parseHash();

        if (!pollId) {
            setViewState({ type: 'create' });
            return;
        }

        if (!silent) setViewState({ type: 'loading' });

        try {
            let poll: Poll;
            let isAdmin = false;

            // If we have an admin key, try to fetch as admin
            if (adminKey) {
                poll = await getPollAsAdmin(pollId, adminKey);
                isAdmin = true;
            } else {
                poll = await getPoll(pollId);
            }

            // Logic to determine what to show (Vote vs Results)
            const userVoted = hasVoted(pollId);
            const showResults = isAdmin || (userVoted && !poll.settings.hideResults);

            if (showResults) {
                const results = await getResults(pollId, adminKey || undefined);
                setViewState({ type: 'results', poll, results, isAdmin });
            } else if (userVoted && poll.settings.hideResults) {
                 // Voted but results are hidden
                 setViewState({ type: 'error', message: "Thanks for voting! Results are hidden by the organizer." });
            } else {
                // User hasn't voted yet, or results are not force-shown
                setViewState({ type: 'vote', poll });
            }

        } catch (error) {
            console.error('Failed to load poll:', error);
            setViewState({ 
                type: 'error', 
                message: "Poll not found. It might have expired or the link is incorrect."
            });
        }
    }, [parseHash]);

    useEffect(() => {
        // Initial Load
        loadView();

        const handleHashChange = () => loadView();
        window.addEventListener('hashchange', handleHashChange);
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.clearInterval(pollInterval.current);
        };
    }, [loadView]);

    // Auto-refresh logic for results view
    useEffect(() => {
        window.clearInterval(pollInterval.current);

        if (viewState.type === 'results') {
            // Refresh every 8 seconds
            pollInterval.current = window.setInterval(() => {
               loadView(true); // silent reload
            }, 8000);
        }

        return () => window.clearInterval(pollInterval.current);
    }, [viewState.type, loadView]);


    const handleVoteSuccess = async () => {
        const { pollId } = parseHash();
        if(!pollId) return;
        
        // Check for Business tier redirect URL
        if (viewState.type === 'vote' && viewState.poll) {
            const redirectUrl = (viewState.poll as any).settings?.redirectUrl;
            if (redirectUrl) {
                // Redirect to custom thank you page (Business feature)
                window.location.href = redirectUrl;
                return;
            }
        }
        
        // Reload to switch to results view
        loadView(); 
    };

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        await loadView(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleEditPoll = () => {
        if(viewState.type === 'results' && viewState.isAdmin) {
             setViewState({ type: 'edit', poll: viewState.poll, isAdmin: true });
        }
    };

    const handleVoteAgain = () => {
        if(viewState.type === 'results') {
            setViewState({ type: 'vote', poll: viewState.poll });
        }
    };

    const handlePrintPDF = () => {
        window.print();
    };

    const handleExportCSV = async () => {
        if (viewState.type !== 'results' || !viewState.isAdmin) return;
        
        const { pollId, adminKey } = parseHash();
        if (!pollId || !adminKey) return;

        setIsExporting(true);
        try {
            const votes = await getRawVotes(pollId, adminKey);
            
            if (votes.length === 0) {
                alert("No votes to export yet.");
                setIsExporting(false);
                return;
            }

            // Generate CSV content
            const headers = ['Date', 'Time', 'Voter Name', 'Access Code', 'Choices (Ranked/Selected)', 'Comment'];
            const csvRows = [headers.join(',')];

            votes.forEach(vote => {
                const date = new Date(vote.votedAt);
                const dateStr = date.toLocaleDateString();
                const timeStr = date.toLocaleTimeString();
                
                // Map choice IDs to text
                const choiceTexts = vote.choices.map((id: string) => {
                    const option = viewState.poll.options.find(o => o.id === id);
                    return option ? option.text.replace(/,/g, ' ') : 'Unknown'; // simple escape for commas
                });

                const row = [
                    dateStr,
                    timeStr,
                    `"${vote.voterName || 'Anonymous'}"`,
                    `"${vote.usedCode || ''}"`,
                    `"${choiceTexts.join('; ')}"`,
                    `"${(vote.comment || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poll_${pollId}_results.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to export data.");
        } finally {
            setIsExporting(false);
        }
    };

    const copyToClipboard = (text: string, type: 'admin' | 'share' | 'codes') => {
        navigator.clipboard.writeText(text);
        if (type === 'admin') {
            setCopiedAdmin(true);
            // Mark admin link as saved in localStorage
            const { pollId } = parseHash();
            if (pollId) {
                localStorage.setItem(`vg_admin_saved_${pollId}`, 'true');
            }
            setTimeout(() => setCopiedAdmin(false), 2000);
        } else if (type === 'share') {
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
    };

    // Check if admin link has been saved
    const isAdminLinkSaved = useCallback(() => {
        const { pollId } = parseHash();
        if (!pollId) return true;
        return localStorage.getItem(`vg_admin_saved_${pollId}`) === 'true';
    }, [parseHash]);

    // Mark admin link as saved (called when email is sent too)
    const markAdminLinkSaved = useCallback(() => {
        const { pollId } = parseHash();
        if (pollId) {
            localStorage.setItem(`vg_admin_saved_${pollId}`, 'true');
        }
    }, [parseHash]);

    const goHome = () => {
        window.location.hash = '';
    };

    const getShareUrl = () => {
        const { pollId } = parseHash();
        return `${window.location.origin}/#id=${pollId}`;
    };

    const getShareText = (title: string) => {
        return `Vote in my poll "${title}": ${getShareUrl()}`;
    };

    const shareToWhatsapp = () => {
        if(viewState.type !== 'results') return;
        const text = getShareText(viewState.poll.title);
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToSms = () => {
        if(viewState.type !== 'results') return;
        const text = getShareText(viewState.poll.title);
        window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToEmail = () => {
        if(viewState.type !== 'results') return;
        const subject = `Vote: ${viewState.poll.title}`;
        const body = getShareText(viewState.poll.title);
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    };
    
    const getQrUrl = () => {
        const url = encodeURIComponent(getShareUrl());
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}&bgcolor=ffffff`;
    };

    const downloadQrCode = async () => {
        try {
            const response = await fetch(getQrUrl());
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
            alert("Could not download image automatically. Please right-click the image to save.");
        }
    };

    const getPollTypeDetails = (type: string) => {
        switch (type) {
            case 'ranked': return { icon: ListOrdered, label: 'Ranked Choice', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
            case 'multiple': return { icon: CheckSquare, label: 'Multiple Choice', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
            case 'meeting': return { icon: Calendar, label: 'Meeting Poll', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
            case 'dot': return { icon: Coins, label: 'Dot Voting', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
            case 'matrix': return { icon: LayoutGrid, label: 'Priority Matrix', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' };
            case 'pairwise': return { icon: GitCompare, label: 'Pairwise Comparison', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
            case 'rating': return { icon: SlidersHorizontal, label: 'Continuous Rating', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' };
            default: return { icon: CheckSquare, label: 'Poll', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
        }
    };

    return (
        <div className="min-h-screen pb-10">
            {/* ROUTE: /ad-wall */}
            {window.location.pathname === '/ad-wall' || window.location.pathname.startsWith('/ad-wall') ? (
                <AdWall />
            ) : window.location.pathname === '/checkout/success' || window.location.pathname.startsWith('/checkout/success') ? (
                <CheckoutSuccess />
            ) : window.location.pathname === '/admin' ? (
                <AdminDashboard />
            ) : window.location.pathname === '/create' ? (
                <CreatePage />
            ) : window.location.pathname === '/templates' || window.location.pathname.startsWith('/templates') ? (
                <TemplatesPage />
            ) : window.location.pathname === '/pricing' || window.location.pathname.startsWith('/pricing') ? (
               <PricingPage />
           ) : window.location.pathname === '/youtube-polls' || window.location.pathname === '/creators' ? (
              <YouTubeCreatorsPage />
            ) : window.location.pathname === '/twitch-polls' || window.location.pathname === '/streamers' ? (
           <TwitchStreamersPage />
            ) : (
                <SurveyPage />
            ) : window.location.pathname === '/employee-survey' ? (
                <EmployeeSurveyPage />
            ) : window.location.pathname === '/customer-feedback' ? (
                <CustomerFeedbackPage />
            ) : window.location.pathname === '/contact' ? (
                <ContactPage />
            ) : window.location.pathname === '/blog' ? (
                <BlogIndex />
            ) : window.location.pathname === '/blog/is-your-work-survey-anonymous' ? (
                <BlogPostAnonymousSurvey />
            ) : window.location.pathname === '/blog/employee-survey-questions' ? (
                <BlogPost50Questions />
            ) : (
            <>
            {/* Header */}
            {viewState.type !== 'create' && viewState.type !== 'loading' && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <a 
                            href="/"
                            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors"
                        >
                            <img src="/logo.svg" alt="" className="w-8 h-8" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <span className="hidden sm:inline text-xl">Vote<span className="text-indigo-600">Generator</span></span>
                        </a>
                        
                        {/* Nav Links for Admin */}
                        {viewState.type === 'results' && viewState.isAdmin && (
                            <nav className="hidden md:flex items-center gap-1">
                                <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                    <PlusCircle size={16} /> Create Poll
                                </a>
                                <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                    <LayoutDashboard size={16} /> My Dashboard
                                </a>
                                <a href="/templates" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                    <Zap size={16} /> Templates
                                </a>
                                <a href="/pricing" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                    <Crown size={16} /> Pricing
                                </a>
                            </nav>
                        )}
                        
                        <div className="flex items-center gap-2">
                             {/* Only show share button if viewing results (not while voting) */}
                             {viewState.type === 'results' && !viewState.isAdmin && (
                                <button
                                    onClick={() => copyToClipboard(getShareUrl(), 'share')}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {copiedShare ? <Check size={16} /> : <Share2 size={16} />}
                                    {copiedShare ? 'Copied!' : 'Share Poll'}
                                </button>
                             )}
                        </div>
                    </div>
                </header>
            )}

            <main className="min-h-[calc(100vh-64px)]">
                <AnimatePresence mode="wait">
                    {viewState.type === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl mx-auto px-4 py-8"
                        >
                            {/* Skeleton Loading State */}
                            <div className="animate-pulse">
                                {/* Header skeleton */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton variant="circular" width={40} height={40} />
                                        <div>
                                            <Skeleton width={150} height={24} className="mb-2" />
                                            <Skeleton width={100} height={16} />
                                        </div>
                                    </div>
                                    <Skeleton width={80} height={36} className="rounded-lg" />
                                </div>
                                
                                {/* Status bar skeleton */}
                                <Skeleton variant="rectangular" height={80} className="rounded-2xl mb-6" />
                                
                                {/* Stats row skeleton */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <Skeleton key={i} variant="rectangular" height={80} className="rounded-xl" />
                                    ))}
                                </div>
                                
                                {/* Results skeleton */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                                    <Skeleton width="60%" height={32} className="mx-auto mb-4" />
                                    <Skeleton width="40%" height={20} className="mx-auto mb-8" />
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center gap-4">
                                                <Skeleton width={40} height={40} className="rounded-lg" />
                                                <div className="flex-1">
                                                    <Skeleton width="70%" height={20} className="mb-2" />
                                                    <Skeleton height={8} className="rounded-full" />
                                                </div>
                                                <Skeleton width={60} height={24} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Share section skeleton */}
                                <div className="grid lg:grid-cols-2 gap-4">
                                    <Skeleton variant="rectangular" height={200} className="rounded-xl" />
                                    <Skeleton variant="rectangular" height={200} className="rounded-xl" />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center mt-8 text-slate-500">
                                <Loader2 className="animate-spin mr-2" size={20} />
                                <span className="font-medium">Loading poll...</span>
                            </div>
                        </motion.div>
                    )}

                    {viewState.type === 'create' && (
                        <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <LandingPage />
                        </motion.div>
                    )}

                    {viewState.type === 'vote' && (
                        <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <VoteGeneratorVote 
                                poll={viewState.poll} 
                                onVoteSuccess={handleVoteSuccess} 
                            />
                            
                            {/* Powered by VoteGenerator Badge - FREE tier only */}
                            {(() => {
                                const pollTier = (viewState.poll as any).tier || 'free';
                                if (pollTier !== 'free') return null;
                                
                                return (
                                    <div className="mt-8 text-center print:hidden">
                                        <a 
                                            href="https://votegenerator.com?ref=poll" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 hover:text-slate-800 transition-colors"
                                        >
                                            <img src="/logo.svg" alt="" className="w-4 h-4" />
                                            Powered by <span className="font-semibold">VoteGenerator</span>
                                        </a>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}

                    {viewState.type === 'edit' && (
                         <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <VoteGeneratorEdit
                                poll={viewState.poll}
                                onCancel={() => loadView(true)}
                                onUpdate={() => loadView(false)}
                            />
                         </motion.div>
                    )}

                    {viewState.type === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Accessibility: Skip Link */}
                            <SkipLink targetId="poll-results" />
                            
                            {/* Accessibility: Live Region for vote count announcements */}
                            <LiveRegion>
                                {viewState.results.totalVotes} votes collected for {viewState.poll.title}
                            </LiveRegion>
                            
                            <div className="max-w-4xl mx-auto px-4 py-8" role="main" aria-label="Poll Dashboard">
                                
                                {/* --- POLL DASHBOARD HEADER --- */}
                                {viewState.isAdmin && (
                                    <div className="mb-6 print:hidden">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                                        <LayoutDashboard className="text-indigo-600" size={28} aria-hidden="true" /> 
                                                        Poll Dashboard
                                                    </h2>
                                                    {(() => {
                                                        const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
                                                        const tierColors: Record<string, string> = {
                                                            free: 'bg-slate-100 text-slate-600',
                                                            pro: 'bg-purple-100 text-purple-700',
                                                            business: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                                                        };
                                                        return (
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tierColors[tier] || tierColors.free}`}>
                                                                {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-700 ml-10 truncate max-w-md">
                                                    "{viewState.poll.title}"
                                                </h3>
                                                <p className="text-slate-500 text-sm mt-1 ml-10">
                                                    Created {new Date(viewState.poll.createdAt || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleEditPoll}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                aria-label="Edit poll settings"
                                            >
                                                <Settings size={16} aria-hidden="true" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- POLL CONTAINER (Unified for Admin) --- */}
                                <div className={viewState.isAdmin ? "bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all" : ""}>
                                    
                                    {/* ADMIN: Management Toolbar */}
                                    {viewState.isAdmin && (
                                        <div className="bg-slate-50/80 border-b border-slate-200 p-6 print:hidden">
                                            {/* Poll Type & Settings Tags */}
                                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {(() => {
                                                        const typeDetails = getPollTypeDetails(viewState.poll.pollType);
                                                        const Icon = typeDetails.icon;
                                                        return (
                                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${typeDetails.bg} ${typeDetails.color} ${typeDetails.border}`}>
                                                                <Icon size={14} />
                                                                {typeDetails.label}
                                                            </div>
                                                        );
                                                    })()}
                                                    {viewState.poll.settings.deadline && (
                                                        <span className="text-xs bg-white border border-slate-200 px-3 py-1 rounded-lg text-slate-600 flex items-center gap-1.5">
                                                            <Clock size={12}/> Ends: {new Date(viewState.poll.settings.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {viewState.poll.allowedCodes && (
                                                        <span onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')} className="text-xs bg-purple-50 border border-purple-100 px-3 py-1 rounded-lg text-purple-600 flex items-center gap-1.5 cursor-pointer hover:bg-purple-100 transition-colors">
                                                            <Key size={12}/> {viewState.poll.allowedCodes.length} Access Codes {copiedCodes ? '✓' : ''}
                                                        </span>
                                                    )}
                                                    {viewState.poll.settings.hideResults && (
                                                        <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-600 flex items-center gap-1.5">
                                                            🔒 Results hidden
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Poll Status Toggle */}
                                            <div className="mb-6">
                                                <DraftLiveToggle
                                                    pollId={viewState.poll.id}
                                                    adminKey={(() => {
                                                        const hash = window.location.hash.slice(1);
                                                        const params = new URLSearchParams(hash);
                                                        return params.get('admin') || '';
                                                    })()}
                                                    status={(viewState.poll as any).status || 'live'}
                                                    voteCount={viewState.results.totalVotes || 0}
                                                    onStatusChange={() => loadView()}
                                                />
                                            </div>

                                            {/* Quick Stats Row */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                                {/* Total Votes */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                                    <div className="text-2xl font-black text-slate-800">
                                                        <AnimatedCounter value={viewState.results.totalVotes || 0} />
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
                                                        Total Votes
                                                        {(viewState.poll as any).status === 'live' && <PulseIndicator color="green" size="sm" />}
                                                    </div>
                                                </div>
                                                
                                                {/* Velocity */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                                    <div className="text-2xl font-black text-slate-800">
                                                        <AnimatedCounter value={(() => {
                                                            const votes = viewState.results.votes || [];
                                                            if (votes.length === 0) return 0;
                                                            const now = Date.now();
                                                            const last24h = votes.filter((v: any) => 
                                                                new Date(v.timestamp).getTime() > now - 24 * 60 * 60 * 1000
                                                            ).length;
                                                            return last24h;
                                                        })()} />
                                                        <span className="text-sm font-medium text-slate-400">/day</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">Velocity</div>
                                                </div>
                                                
                                                {/* First Vote */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                                    <div className="text-lg font-bold text-slate-800">
                                                        {(() => {
                                                            const votes = viewState.results.votes || [];
                                                            if (votes.length === 0) return '—';
                                                            const firstVote = new Date(votes[0]?.timestamp);
                                                            return firstVote.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                        })()}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">First Vote</div>
                                                </div>
                                                
                                                {/* Last Vote */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                                    <div className="text-lg font-bold text-slate-800">
                                                        {(() => {
                                                            const votes = viewState.results.votes || [];
                                                            if (votes.length === 0) return '—';
                                                            const lastVote = new Date(votes[votes.length - 1]?.timestamp);
                                                            const now = new Date();
                                                            const diffMs = now.getTime() - lastVote.getTime();
                                                            const diffMins = Math.floor(diffMs / 60000);
                                                            if (diffMins < 60) return `${diffMins}m ago`;
                                                            const diffHours = Math.floor(diffMins / 60);
                                                            if (diffHours < 24) return `${diffHours}h ago`;
                                                            return lastVote.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                                        })()}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">Last Vote</div>
                                                </div>
                                            </div>

                                            {/* Usage Meter for Free Tier */}
                                            {(() => {
                                                const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
                                                const isFree = tier === 'free';
                                                const voteCount = viewState.results.totalVotes || 0;
                                                const maxVotes = isFree ? 100 : Infinity;
                                                const percentage = isFree ? Math.min((voteCount / maxVotes) * 100, 100) : 0;
                                                
                                                if (!isFree) return null;
                                                
                                                return (
                                                    <div className={`mb-6 p-4 rounded-xl border-2 ${percentage >= 75 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
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
                                                                Upgrade for unlimited <ArrowRight size={12} />
                                                            </button>
                                                        </div>
                                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full transition-all ${percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        {percentage >= 75 && (
                                                            <p className="text-xs text-amber-700 mt-2">
                                                                ⚠️ {percentage >= 90 ? 'Almost at limit!' : 'Approaching limit'}{' '}
                                                                <button 
                                                                    onClick={() => {
                                                                        setUpgradeHighlight('unlimited');
                                                                        setShowUpgradeModal(true);
                                                                    }}
                                                                    className="underline hover:no-underline"
                                                                >
                                                                    Upgrade to keep collecting votes.
                                                                </button>
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                            {/* ============================================ */}
                                            {/* POLL RESULTS - Shown BEFORE controls */}
                                            {/* ============================================ */}
                                            <div id="poll-results" className="mb-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center font-serif tracking-tight">
                                                    {viewState.poll.title}
                                                </h1>
                                                {viewState.poll.description && (
                                                    <p className="text-slate-500 text-center mb-6 max-w-2xl mx-auto">
                                                        {viewState.poll.description}
                                                    </p>
                                                )}
                                                
                                                <VoteGeneratorResults 
                                                    poll={viewState.poll} 
                                                    results={viewState.results}
                                                    onEdit={handleEditPoll}
                                                    adminKey={(() => {
                                                        const hash = window.location.hash.slice(1);
                                                        const params = new URLSearchParams(hash);
                                                        return params.get('admin') || null;
                                                    })()}
                                                    isAdmin={true}
                                                />
                                            </div>

                                            {/* ============================================ */}
                                            {/* SHARE & CONTROLS - After Results */}
                                            {/* ============================================ */}
                                            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                                                
                                                {/* Share Section */}
                                                <div className="bg-white border border-indigo-100 rounded-xl p-4 md:p-5 shadow-sm">
                                                     <div className="flex items-center justify-between mb-3">
                                                         <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                                             <Share2 size={18} className="text-indigo-600"/> Share Poll
                                                         </h4>
                                                     </div>
                                                     {/* URL Copy - Mobile optimized */}
                                                     <div className="flex gap-2 mb-4">
                                                         <div className="relative flex-1 min-w-0">
                                                             <Globe className="absolute left-3 top-3 text-slate-400" size={16} />
                                                             <input type="text" readOnly value={getShareUrl()} className="w-full pl-9 pr-2 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none truncate" />
                                                         </div>
                                                         <motion.button 
                                                             onClick={() => copyToClipboard(getShareUrl(), 'share')} 
                                                             className={`px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap min-h-[44px] ${
                                                                 copiedShare 
                                                                     ? 'bg-emerald-500 text-white' 
                                                                     : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                             }`}
                                                             whileTap={{ scale: 0.95 }}
                                                             animate={copiedShare ? { scale: [1, 1.1, 1] } : {}}
                                                         >
                                                             {copiedShare ? (
                                                                 <span className="flex items-center gap-1">
                                                                     <Check size={16} /> Copied!
                                                                 </span>
                                                             ) : 'Copy'}
                                                         </motion.button>
                                                     </div>
                                                     {/* Share buttons - Larger touch targets */}
                                                     <div className="grid grid-cols-3 gap-2 mb-3">
                                                         <button onClick={shareToWhatsapp} className="py-3 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 active:bg-green-200 transition-colors flex flex-col sm:flex-row justify-center items-center gap-1 min-h-[44px]">
                                                             <MessageCircle size={18} className="sm:w-4 sm:h-4"/>
                                                             <span className="hidden sm:inline">WhatsApp</span>
                                                         </button>
                                                         <button onClick={shareToSms} className="py-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 active:bg-blue-200 transition-colors flex flex-col sm:flex-row justify-center items-center gap-1 min-h-[44px]">
                                                             <Smartphone size={18} className="sm:w-4 sm:h-4"/>
                                                             <span className="hidden sm:inline">SMS</span>
                                                         </button>
                                                         <button onClick={shareToEmail} className="py-3 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 active:bg-slate-200 transition-colors flex flex-col sm:flex-row justify-center items-center gap-1 min-h-[44px]">
                                                             <Mail size={18} className="sm:w-4 sm:h-4"/>
                                                             <span className="hidden sm:inline">Email</span>
                                                         </button>
                                                     </div>
                                                     <div className="grid grid-cols-2 gap-2">
                                                         <button onClick={() => setShowQrModal(true)} className="py-3 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 active:bg-slate-900 transition-colors flex justify-center items-center gap-2 min-h-[44px]"><QrCode size={16}/> QR Code</button>
                                                         <button onClick={() => setShowShareCards(true)} className="py-3 bg-pink-50 text-pink-600 border border-pink-100 rounded-lg text-xs font-bold hover:bg-pink-100 active:bg-pink-200 transition-colors flex justify-center items-center gap-2 min-h-[44px]"><Palette size={16}/> Cards</button>
                                                     </div>
                                                </div>

                                                {/* Controls Section */}
                                                <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                         <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                             <Settings size={18} className="text-slate-600"/> Controls
                                                         </h4>
                                                     </div>
                                                     {/* Control buttons - Larger touch targets */}
                                                     <div className="grid grid-cols-2 gap-3">
                                                         <button onClick={handleEditPoll} className="flex items-center justify-center gap-2 p-3 border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 active:bg-indigo-50 rounded-lg text-sm font-medium transition-all text-slate-600 min-h-[48px]">
                                                             <Settings size={18}/> Edit
                                                         </button>
                                                         <button onClick={handleExportCSV} disabled={isExporting} className="flex items-center justify-center gap-2 p-3 border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:text-emerald-600 active:bg-emerald-50 rounded-lg text-sm font-medium transition-all text-slate-600 min-h-[48px]">
                                                             {isExporting ? <Loader2 size={18} className="animate-spin"/> : <FileSpreadsheet size={18}/>} CSV
                                                         </button>
                                                         <button onClick={handlePrintPDF} className="col-span-2 flex items-center justify-center gap-2 p-3 border border-slate-100 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-500 rounded-lg text-sm font-medium transition-all min-h-[44px]">
                                                             <Download size={16}/> Download PDF
                                                         </button>
                                                     </div>
                                                     
                                                     {/* Email Admin Link */}
                                                     <div className="mt-4 pt-4 border-t border-slate-100">
                                                         <EmailAdminLink
                                                             pollId={viewState.poll.id}
                                                             adminKey={(() => {
                                                                 const hash = window.location.hash.slice(1);
                                                                 const params = new URLSearchParams(hash);
                                                                 return params.get('admin') || '';
                                                             })()}
                                                             pollTitle={viewState.poll.title}
                                                         />
                                                     </div>
                                                </div>

                                            </div>
                                            
                                            {/* Premium Features Row */}
                                            <div className="px-6 pb-6">
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                    <Crown size={14} className="text-amber-500" />
                                                    Premium Features
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {/* Embed Poll */}
                                                    <button 
                                                        onClick={() => setShowEmbedModal(true)}
                                                        className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition flex flex-col items-center gap-2 text-center"
                                                    >
                                                        <Code size={22} className="text-indigo-500" />
                                                        <span className="text-sm font-medium text-slate-700">Embed Poll</span>
                                                    </button>
                                                    
                                                    {/* Logo Upload - placeholder, opens in edit */}
                                                    <button 
                                                        onClick={handleEditPoll}
                                                        className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-purple-300 transition flex flex-col items-center gap-2 text-center"
                                                    >
                                                        <ImageIcon size={22} className="text-purple-500" />
                                                        <span className="text-sm font-medium text-slate-700">Upload Logo</span>
                                                    </button>
                                                    
                                                    {/* Notifications - inline component */}
                                                    <div className="col-span-2 md:col-span-2">
                                                        <NotificationSettings 
                                                            pollId={viewState.poll.id}
                                                            adminKey={(() => {
                                                                const hash = window.location.hash.slice(1);
                                                                const params = new URLSearchParams(hash);
                                                                return params.get('admin') || '';
                                                            })()}
                                                            pollTitle={viewState.poll.title}
                                                            tier={(() => {
                                                                const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
                                                                return tier || 'free';
                                                            })()}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Custom Slug - Business Only */}
                                                <div className="mt-4">
                                                    <CustomSlugInput
                                                        pollId={viewState.poll.id}
                                                        adminKey={(() => {
                                                            const hash = window.location.hash.slice(1);
                                                            const params = new URLSearchParams(hash);
                                                            return params.get('admin') || '';
                                                        })()}
                                                        currentSlug={(viewState.poll as any).customSlug}
                                                        tier={(() => {
                                                            const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
                                                            return tier || 'free';
                                                        })()}
                                                        onUpgradeClick={() => {
                                                            setUpgradeHighlight('unlimited');
                                                            setShowUpgradeModal(true);
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Response Timeline Chart */}
                                                {viewState.results.votes && viewState.results.votes.length > 0 && (
                                                    <div className="mt-6">
                                                        <ResponseTimelineChart
                                                            votes={viewState.results.votes}
                                                            days={7}
                                                            showTrend={true}
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Advanced Analytics Section (Pro+) */}
                                                {(() => {
                                                    const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
                                                    const allVotes = viewState.results.votes || [];
                                                    const comments = viewState.results.comments || [];
                                                    
                                                    // Only show for Pro+ users with sufficient data
                                                    if (tier === 'free' || allVotes.length < 5) return null;
                                                    
                                                    // Filter votes by date range
                                                    const filteredVotes = allVotes.filter((vote: any) => {
                                                        if (!analyticsDateRange.start && !analyticsDateRange.end) return true;
                                                        const voteDate = new Date(vote.timestamp);
                                                        if (analyticsDateRange.start && voteDate < analyticsDateRange.start) return false;
                                                        if (analyticsDateRange.end && voteDate > analyticsDateRange.end) return false;
                                                        return true;
                                                    });
                                                    
                                                    // Filter comments by date range
                                                    const filteredComments = comments.filter((comment: any) => {
                                                        if (!analyticsDateRange.start && !analyticsDateRange.end) return true;
                                                        const commentDate = new Date(comment.timestamp || comment.createdAt);
                                                        if (analyticsDateRange.start && commentDate < analyticsDateRange.start) return false;
                                                        if (analyticsDateRange.end && commentDate > analyticsDateRange.end) return false;
                                                        return true;
                                                    });
                                                    
                                                    return (
                                                        <div className="mt-6">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                                                                    <LayoutDashboard size={14} className="text-purple-500" />
                                                                    Analytics Dashboard
                                                                    {(analyticsDateRange.start || analyticsDateRange.end) && (
                                                                        <span className="text-xs font-normal text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                                                            {filteredVotes.length} of {allVotes.length} votes
                                                                        </span>
                                                                    )}
                                                                </h3>
                                                                <DateRangeFilter 
                                                                    onRangeChange={(start, end) => setAnalyticsDateRange({ start, end })}
                                                                    minDate={allVotes.length > 0 ? new Date(allVotes[0]?.timestamp) : undefined}
                                                                />
                                                            </div>
                                                            
                                                            {/* Cross-Tabulation Filters */}
                                                            <div className="mb-4">
                                                                <CrossTabFilter 
                                                                    votes={filteredVotes}
                                                                    onFilteredVotesChange={setCrossTabFilteredVotes}
                                                                />
                                                            </div>
                                                            
                                                            {(() => {
                                                                // Use cross-tab filtered votes if filters are active, otherwise use date-filtered votes
                                                                const displayVotes = crossTabFilteredVotes.length > 0 || 
                                                                    (crossTabFilteredVotes.length === 0 && filteredVotes.length > 0) 
                                                                    ? crossTabFilteredVotes 
                                                                    : filteredVotes;
                                                                
                                                                if (displayVotes.length === 0 && filteredVotes.length > 0) {
                                                                    return (
                                                                        <div className="bg-slate-50 rounded-xl p-8 text-center">
                                                                            <Filter size={32} className="text-slate-300 mx-auto mb-2" />
                                                                            <p className="text-slate-500 text-sm">No votes match the selected filters</p>
                                                                        </div>
                                                                    );
                                                                }
                                                                
                                                                if (filteredVotes.length === 0) {
                                                                    return (
                                                                        <div className="bg-slate-50 rounded-xl p-8 text-center">
                                                                            <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
                                                                            <p className="text-slate-500 text-sm">No votes in selected date range</p>
                                                                        </div>
                                                                    );
                                                                }
                                                                
                                                                return (
                                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                        {/* Hourly Heatmap */}
                                                                        <HourlyHeatmap votes={displayVotes} />
                                                                        
                                                                        {/* Geographic Distribution */}
                                                                        <GeoChart votes={displayVotes} maxCountries={5} />
                                                                        
                                                                        {/* Comment Word Cloud */}
                                                                        {filteredComments.length >= 3 && (
                                                                            <div className="lg:col-span-2">
                                                                                <CommentWordCloud comments={filteredComments} maxWords={15} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()}
                                                            
                                                            {/* Blocked Votes Alert (if any) */}
                                                            {(viewState.poll as any).blockedVotes?.total > 0 && (
                                                                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                                            <ShieldAlert size={20} className="text-amber-600" />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold text-amber-800">Bot Protection Active</h4>
                                                                            <p className="text-sm text-amber-700">
                                                                                Blocked <span className="font-bold">{(viewState.poll as any).blockedVotes.total}</span> suspicious attempts
                                                                                {(viewState.poll as any).blockedVotes.honeypot > 0 && ` • ${(viewState.poll as any).blockedVotes.honeypot} honeypot`}
                                                                                {(viewState.poll as any).blockedVotes.timing > 0 && ` • ${(viewState.poll as any).blockedVotes.timing} timing`}
                                                                                {(viewState.poll as any).blockedVotes.rateLimit > 0 && ` • ${(viewState.poll as any).blockedVotes.rateLimit} rate limit`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                                
                                                {/* Feature Teasers for Free Users */}
                                                {(() => {
                                                    const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
                                                    if (tier !== 'free') return null;
                                                    
                                                    return (
                                                        <div className="mt-6">
                                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                                <Zap size={14} className="text-indigo-500" />
                                                                Unlock More Features
                                                            </h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <FeatureTeaserCard 
                                                                    feature="analytics" 
                                                                    currentTier="free" 
                                                                    compact 
                                                                    onUpgradeClick={() => {
                                                                        setUpgradeHighlight('analytics');
                                                                        setShowUpgradeModal(true);
                                                                    }}
                                                                />
                                                                <FeatureTeaserCard 
                                                                    feature="unlimited" 
                                                                    currentTier="free" 
                                                                    compact
                                                                    onUpgradeClick={() => {
                                                                        setUpgradeHighlight('unlimited');
                                                                        setShowUpgradeModal(true);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Main Content Area - For NON-ADMIN users only */}
                                    {/* (Admin users see Results in the dashboard panel above) */}
                                    {!viewState.isAdmin && (
                                        <div className="p-6 md:p-10">
                                            <div className="flex justify-end mb-4 print:hidden">
                                                <button 
                                                    onClick={handleManualRefresh}
                                                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                                                    disabled={isRefreshing}
                                                >
                                                    <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                                                    {isRefreshing ? 'Refreshing...' : 'Refresh Votes'}
                                                </button>
                                            </div>

                                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center font-serif tracking-tight">{viewState.poll.title}</h1>
                                            {viewState.poll.description && <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto text-lg">{viewState.poll.description}</p>}
                                            
                                            <VoteGeneratorResults 
                                                poll={viewState.poll} 
                                                results={viewState.results}
                                                adminKey={null}
                                                isAdmin={false}
                                            />
                                            
                                            {/* Vote Again Button for Non-Admin with Security 'none' */}
                                            {viewState.poll.settings.security === 'none' && (
                                                <div className="mt-8 flex flex-col items-center justify-center print:hidden">
                                                    <button
                                                        onClick={handleVoteAgain}
                                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                                    >
                                                        <RotateCcw size={18} />
                                                        Vote Again
                                                    </button>
                                                    <p className="text-slate-400 text-xs mt-2">
                                                        Multiple votes are allowed for this poll.
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {viewState.poll.settings.security !== 'none' && (
                                                <div className="mt-12 text-center print:hidden">
                                                    <button 
                                                        onClick={goHome} 
                                                        className="text-slate-400 hover:text-indigo-600 font-medium transition-colors inline-flex items-center gap-1"
                                                    >
                                                        Create your own poll <ArrowRight size={14}/>
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Powered by VoteGenerator Badge - FREE tier only */}
                                            {(() => {
                                                const pollTier = (viewState.poll as any).tier || 'free';
                                                if (pollTier !== 'free') return null;
                                                
                                                return (
                                                    <div className="mt-8 text-center print:hidden">
                                                        <a 
                                                            href="https://votegenerator.com?ref=results" 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 hover:text-slate-800 transition-colors"
                                                        >
                                                            <img src="/logo.svg" alt="" className="w-4 h-4" />
                                                            Powered by <span className="font-semibold">VoteGenerator</span>
                                                        </a>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {viewState.type === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md mx-auto text-center pt-40 px-4"
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-slate-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Notice</h2>
                            <p className="text-slate-500 mb-8">{viewState.message}</p>
                            <button
                                onClick={goHome}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Create New Poll
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* QR Code Modal */}
                <AnimatePresence>
                    {showQrModal && (
                         <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowQrModal(false)}
                        >
                             <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                             >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">Scan to Vote</h3>
                                    <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20}/></button>
                                </div>
                                
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-center mb-6">
                                     <img src={getQrUrl()} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                                </div>

                                {viewState.type === 'results' && viewState.poll.settings.security === 'code' && (
                                     <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-100 mb-6 flex gap-2">
                                        <Key size={16} className="shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Note:</strong> This QR code opens the voting page. Voters must still manually enter their unique Access Code after scanning.
                                        </div>
                                     </div>
                                )}

                                <div className="flex gap-2">
                                     <button onClick={downloadQrCode} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                                         <Download size={18}/> Download PNG
                                     </button>
                                </div>
                             </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Share Cards / Invite Cards Modal */}
                <AnimatePresence>
                    {showShareCards && viewState.type === 'results' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                            onClick={() => setShowShareCards(false)}
                        >
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Palette className="text-pink-500" size={22} />
                                        Invite Cards
                                    </h3>
                                    <button 
                                        onClick={() => setShowShareCards(false)} 
                                        className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
                                    >
                                        <X size={20}/>
                                    </button>
                                </div>
                                <div className="p-6">
                                    <ShareCards
                                        pollId={viewState.poll.id}
                                        pollTitle={viewState.poll.title}
                                        pollDescription={viewState.poll.description}
                                        pollUrl={getShareUrl()}
                                        onClose={() => setShowShareCards(false)}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Embed Poll Modal */}
                {viewState.type === 'results' && (
                    <EmbedModal
                        poll={viewState.poll}
                        isOpen={showEmbedModal}
                        onClose={() => setShowEmbedModal(false)}
                        isPremium={(() => {
                            const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
                            return tier === 'pro' || tier === 'business';
                        })()}
                        onUpgradeClick={() => {
                            setShowEmbedModal(false);
                            setUpgradeHighlight('branding');
                            setShowUpgradeModal(true);
                        }}
                    />
                )}

                {/* Upgrade Modal */}
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => {
                        setShowUpgradeModal(false);
                        setUpgradeHighlight(undefined);
                    }}
                    currentTier={(() => {
                        const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
                        return tier as 'free' | 'pro' | 'business';
                    })()}
                    highlightFeature={upgradeHighlight}
                    source="poll_dashboard"
                />
            </main>
            </>
            )}
        </div>
    );
};

export default VoteGeneratorApp;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, ArrowRight, FileSpreadsheet, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, Globe, QrCode, X, Download, ListOrdered, CheckSquare, Calendar, Coins, LayoutGrid, GitCompare, SlidersHorizontal, Code, Bell, Eye, Play, Pause, Image as ImageIcon, Search, HelpCircle, FileQuestion, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import LandingPage from './LandingPage';
import PaidCreatePage from './PaidCreatePage';
import AdminDashboard from './AdminDashboard';
import AdWall from './AdWall';
import CheckoutSuccess from './CheckoutSuccess';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorEdit from './VoteGeneratorEdit';
import NotificationSettings from './NotificationSettings';
import DraftLiveToggle from './DraftLiveToggle';
import LogoUpload from './LogoUpload';
import DevModePanel from './DevModePanel';
import PollRecoveryModal from './PollRecoveryModal';
import EmailAdminLink from './EmailAdminLink';
import CustomSlugInput from './CustomSlugInput';
import { getPoll, getPollAsAdmin, getResults, hasVoted, getRawVotes } from '../services/voteGeneratorService';
import { Poll, RunoffResult } from '../types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'vote'; poll: Poll }
    | { type: 'results'; poll: Poll; results: RunoffResult; isAdmin?: boolean }
    | { type: 'edit'; poll: Poll; isAdmin: boolean }
    | { type: 'error'; message: string; errorType?: 'not_found' | 'invalid_admin' | 'expired' | 'generic'; pollId?: string }
    | { type: 'recover' };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });
    const [isPaidUser, setIsPaidUser] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [isEmbedMode, setIsEmbedMode] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'success' | 'expired' | 'invalid' | 'error' | null>(null);
    // Collapsible admin sections
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        share: true,
        controls: true,
        advanced: false
    });
    const pollInterval = useRef<number | undefined>(undefined);
    
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const parseHash = useCallback(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        
        // Also check URL path for custom slug route: /p/{slug}
        const pathname = window.location.pathname;
        const slugMatch = pathname.match(/^\/p\/([a-z0-9-]+)\/?$/);
        
        // Check for embed mode in query params
        const urlParams = new URLSearchParams(window.location.search);
        const isEmbed = urlParams.get('embed') === 'true' || urlParams.get('embed') === '1';
        
        // Check for verification status and poll redirect
        const verification = params.get('verification') as 'success' | 'expired' | 'invalid' | 'error' | null;
        const verificationPollId = params.get('poll'); // Poll to redirect to after verification
        
        return {
            pollId: slugMatch ? slugMatch[1] : (params.get('id') || verificationPollId),
            adminKey: params.get('admin'),
            isEmbed,
            verification,
            verificationPollId
        };
    }, []);

    const loadView = useCallback(async (silent = false) => {
        const { pollId, adminKey, isEmbed, verification, verificationPollId } = parseHash();
        
        // Handle verification status from email confirmation
        if (verification) {
            setVerificationStatus(verification);
            
            // If verification successful and we have a poll ID, redirect to it
            if (verification === 'success' && verificationPollId && !pollId) {
                setTimeout(() => {
                    window.location.hash = `id=${verificationPollId}&verification=success`;
                }, 100);
                return;
            }
            
            // Clear the verification param from URL after a delay
            setTimeout(() => {
                const newHash = window.location.hash
                    .replace(/[&?]?verification=[^&]+/, '')
                    .replace(/[&?]?poll=[^&]+/, '')
                    .replace(/^#&/, '#');
                window.history.replaceState(null, '', newHash || window.location.pathname);
            }, 100);
            // Auto-dismiss after 5 seconds
            setTimeout(() => setVerificationStatus(null), 5000);
        }
        
        // Set embed mode
        setIsEmbedMode(isEmbed);

        if (!pollId) {
            setViewState({ type: 'create' });
            return;
        }

        if (!silent) setViewState({ type: 'loading' });

        // Helper to save admin link to localStorage
        const saveAdminLink = (pId: string, aKey: string, title: string) => {
            try {
                const saved = JSON.parse(localStorage.getItem('vg_admin_links') || '{}');
                saved[pId] = { adminKey: aKey, title, savedAt: new Date().toISOString() };
                localStorage.setItem('vg_admin_links', JSON.stringify(saved));
            } catch (e) { console.error('Failed to save admin link', e); }
        };

        // Helper to get saved admin key
        const getSavedAdminKey = (pId: string): string | null => {
            try {
                const saved = JSON.parse(localStorage.getItem('vg_admin_links') || '{}');
                return saved[pId]?.adminKey || null;
            } catch { return null; }
        };

        try {
            let poll: Poll;
            let isAdmin = false;
            let usedAdminKey = adminKey;

            // If we have an admin key, try it
            if (adminKey) {
                try {
                    poll = await getPollAsAdmin(pollId, adminKey);
                    isAdmin = true;
                    // Save successful admin link
                    saveAdminLink(pollId, adminKey, poll.title);
                } catch (adminError: any) {
                    // Admin key might be wrong - try public access
                    if (adminError?.message?.includes('403') || adminError?.message?.includes('Invalid')) {
                        // Try saved admin key as backup
                        const savedKey = getSavedAdminKey(pollId);
                        if (savedKey && savedKey !== adminKey) {
                            try {
                                poll = await getPollAsAdmin(pollId, savedKey);
                                isAdmin = true;
                                usedAdminKey = savedKey;
                                // Update URL with correct admin key
                                window.location.hash = `id=${pollId}&admin=${savedKey}`;
                            } catch {
                                throw adminError; // Original error
                            }
                        } else {
                            throw adminError;
                        }
                    } else {
                        throw adminError;
                    }
                }
            } else {
                poll = await getPoll(pollId);
            }

            const userVoted = hasVoted(pollId);
            const showResults = isAdmin || (userVoted && !poll.settings.hideResults);

            if (showResults) {
                const results = await getResults(pollId, usedAdminKey || undefined);
                setViewState({ type: 'results', poll, results, isAdmin });
            } else if (userVoted && poll.settings.hideResults) {
                 setViewState({ type: 'error', message: "Thanks for voting! Results are hidden by the organizer.", errorType: 'generic' });
            } else {
                setViewState({ type: 'vote', poll });
            }

        } catch (error: any) {
            console.error('Failed to load poll:', error);
            const errorMsg = error?.message || '';
            
            // Determine error type
            let errorType: 'not_found' | 'invalid_admin' | 'expired' | 'generic' = 'generic';
            let message = "Something went wrong. Please try again.";
            
            if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('Not found')) {
                errorType = 'not_found';
                message = "This poll doesn't exist or has been deleted.";
            } else if (errorMsg.includes('403') || errorMsg.includes('Invalid admin') || errorMsg.includes('Unauthorized')) {
                errorType = 'invalid_admin';
                message = "Invalid admin link. The admin key may be incorrect or the poll was recreated.";
            } else if (errorMsg.includes('expired') || errorMsg.includes('Expired')) {
                errorType = 'expired';
                message = "This poll has expired and is no longer available.";
            }
            
            setViewState({ 
                type: 'error', 
                message,
                errorType,
                pollId
            });
        }
    }, [parseHash]);

    // Check if user has a paid tier
    useEffect(() => {
        const tier = localStorage.getItem('vg_purchased_tier');
        const validTiers = ['starter', 'pro_event', 'unlimited'];
        setIsPaidUser(tier !== null && validTiers.includes(tier));
    }, []);

    useEffect(() => {
        loadView();
        const handleHashChange = () => loadView();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.clearInterval(pollInterval.current);
        };
    }, [loadView]);

    useEffect(() => {
        window.clearInterval(pollInterval.current);
        if (viewState.type === 'results') {
            pollInterval.current = window.setInterval(() => {
               loadView(true);
            }, 8000);
        }
        return () => window.clearInterval(pollInterval.current);
    }, [viewState.type, loadView]);

    const handleVoteSuccess = async () => {
        const { pollId } = parseHash();
        if(!pollId) return;
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

    const handlePrintPDF = () => { window.print(); };

    const handleExportCSV = async () => {
        if (viewState.type !== 'results' || !viewState.isAdmin) return;
        const { pollId, adminKey } = parseHash();
        if (!pollId || !adminKey) return;

        setIsExporting(true);
        try {
            const votes = await getRawVotes(pollId, adminKey);
            if (!votes || votes.length === 0) {
                alert("No votes to export yet.");
                setIsExporting(false);
                return;
            }

            const headers = ['#', 'Date', 'Time', 'Voter Name', 'Country', 'Device', 'Choices', 'Comment'];
            const csvRows = [headers.join(',')];

            votes.forEach((v, idx) => {
                const vote = v as any; // Cast to any for dynamic property access
                const date = new Date(vote.votedAt || vote.timestamp || Date.now());
                
                // Handle different choice formats
                const choices = vote.choices || vote.selectedOptionIds || vote.rankedOptionIds || [];
                const choiceTexts = (choices as string[]).map((id: string) => {
                    const option = viewState.poll.options.find(o => o.id === id);
                    return option ? option.text.replace(/,/g, ' ').replace(/"/g, "'") : 'Unknown';
                });
                
                // Get analytics data if available
                const country = vote.analytics?.country || '';
                const device = vote.analytics?.device || '';
                
                const row = [
                    idx + 1,
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    `"${(vote.voterName || 'Anonymous').replace(/"/g, "'")}"`,
                    country,
                    device,
                    `"${choiceTexts.join('; ')}"`,
                    `"${(vote.comment || '').replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });

            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poll_${pollId}_votes.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to export data. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const copyToClipboard = (text: string, type: 'admin' | 'share' | 'codes') => {
        navigator.clipboard.writeText(text);
        if (type === 'admin') { setCopiedAdmin(true); setTimeout(() => setCopiedAdmin(false), 2000); }
        else if (type === 'share') { setCopiedShare(true); setTimeout(() => setCopiedShare(false), 2000); }
        else { setCopiedCodes(true); setTimeout(() => setCopiedCodes(false), 2000); }
    };

    const goHome = () => { window.location.hash = ''; };
    const getShareUrl = () => { const { pollId } = parseHash(); return `${window.location.origin}/#id=${pollId}`; };
    const getShareText = (title: string) => `Vote in my poll "${title}": ${getShareUrl()}`;
    const shareToWhatsapp = () => { if(viewState.type !== 'results') return; window.open(`https://wa.me/?text=${encodeURIComponent(getShareText(viewState.poll.title))}`, '_blank'); };
    const shareToSms = () => { if(viewState.type !== 'results') return; window.open(`sms:?body=${encodeURIComponent(getShareText(viewState.poll.title))}`, '_blank'); };
    const shareToEmail = () => { if(viewState.type !== 'results') return; window.open(`mailto:?subject=${encodeURIComponent(`Vote: ${viewState.poll.title}`)}&body=${encodeURIComponent(getShareText(viewState.poll.title))}`, '_blank'); };
    const getQrUrl = () => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getShareUrl())}&bgcolor=ffffff`;
    
    const downloadQrCode = async () => {
        try {
            const response = await fetch(getQrUrl());
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'poll-qrcode.png';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) { alert("Could not download image automatically."); }
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
            {/* Email Verification Toast */}
            <AnimatePresence>
                {verificationStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4"
                    >
                        <div className={`rounded-xl shadow-lg border-2 p-4 flex items-center gap-3 ${
                            verificationStatus === 'success' 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className={`p-2 rounded-full ${
                                verificationStatus === 'success' ? 'bg-emerald-100' : 'bg-red-100'
                            }`}>
                                {verificationStatus === 'success' ? (
                                    <Check className="text-emerald-600" size={20} />
                                ) : (
                                    <AlertTriangle className="text-red-600" size={20} />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`font-bold ${
                                    verificationStatus === 'success' ? 'text-emerald-800' : 'text-red-800'
                                }`}>
                                    {verificationStatus === 'success' && '✓ Email Verified!'}
                                    {verificationStatus === 'expired' && 'Link Expired'}
                                    {verificationStatus === 'invalid' && 'Invalid Link'}
                                    {verificationStatus === 'error' && 'Verification Failed'}
                                </p>
                                <p className={`text-sm ${
                                    verificationStatus === 'success' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                    {verificationStatus === 'success' && "You'll now receive poll notifications."}
                                    {verificationStatus === 'expired' && 'This verification link has expired. Ask for a new one.'}
                                    {verificationStatus === 'invalid' && 'This verification link is not valid.'}
                                    {verificationStatus === 'error' && 'Something went wrong. Please try again.'}
                                </p>
                            </div>
                            <button 
                                onClick={() => setVerificationStatus(null)}
                                className="p-1 hover:bg-white/50 rounded"
                            >
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {window.location.pathname.startsWith('/ad-wall') ? (
                <AdWall />
            ) : window.location.pathname.startsWith('/checkout/success') ? (
                <CheckoutSuccess />
            ) : window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin?') ? (
                <AdminDashboard />
            ) : (
            <>
            {viewState.type !== 'create' && viewState.type !== 'loading' && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <button onClick={goHome} className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors">
                            <img src="/logo.svg" alt="VoteGenerator" className="h-8 w-8" />
                            <span className="hidden sm:inline">VoteGenerator</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <a href="/demo" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Demo</a>
                            <a href="/help" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Help</a>
                             {viewState.type === 'results' && !viewState.isAdmin && (
                                <button onClick={() => copyToClipboard(getShareUrl(), 'share')} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors">
                                    {copiedShare ? <Check size={16} /> : <Share2 size={16} />}{copiedShare ? 'Copied!' : 'Share Poll'}
                                </button>
                             )}
                             {viewState.type === 'results' && viewState.isAdmin && (
                                 <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100"><ShieldCheck size={14} /> Admin Portal</div>
                             )}
                        </div>
                    </div>
                </header>
            )}

            <main className="min-h-[calc(100vh-64px)]">
                <AnimatePresence mode="wait">
                    {viewState.type === 'loading' && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center pt-40">
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} /><p className="text-slate-500 font-medium">Loading...</p>
                        </motion.div>
                    )}

                    {viewState.type === 'create' && (
                        <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {isPaidUser ? <PaidCreatePage /> : <LandingPage />}
                        </motion.div>
                    )}

                    {viewState.type === 'vote' && (
                        <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <VoteGeneratorVote poll={viewState.poll} onVoteSuccess={handleVoteSuccess} />
                        </motion.div>
                    )}

                    {viewState.type === 'edit' && (
                         <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <VoteGeneratorEdit poll={viewState.poll} onCancel={() => loadView(true)} onUpdate={() => loadView(false)} />
                         </motion.div>
                    )}

                    {viewState.type === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                {viewState.isAdmin && (
                                    <div className="mb-8 print:hidden">
                                        {/* Back to Dashboard link */}
                                        <a href="/admin" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-4 font-medium">
                                            <ArrowRight size={16} className="rotate-180" /> Back to Dashboard
                                        </a>
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3"><LayoutDashboard className="text-indigo-600" size={28}/> Poll Manager</h2>
                                                <p className="text-slate-500 text-sm mt-1 ml-10">Manage and view results for this poll</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={viewState.isAdmin ? "bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all" : ""}>
                                    {viewState.isAdmin && (
                                        <div className="bg-slate-50/80 border-b border-slate-200 p-4 md:p-6 print:hidden">
                                            {/* Top Bar: Poll Type + Quick Actions */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    {(() => { const typeDetails = getPollTypeDetails(viewState.poll.pollType); const Icon = typeDetails.icon; return (<div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeDetails.bg} ${typeDetails.color} ${typeDetails.border}`}><Icon size={14} />{typeDetails.label}</div>); })()}
                                                    {viewState.poll.settings.deadline && (<span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500 flex items-center gap-1"><Clock size={12}/> {new Date(viewState.poll.settings.deadline).toLocaleDateString()}</span>)}
                                                    {viewState.poll.allowedCodes && (<span onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')} className="text-xs bg-purple-50 border border-purple-100 px-2 py-1 rounded-lg text-purple-600 flex items-center gap-1 cursor-pointer hover:bg-purple-100"><Key size={12}/> {viewState.poll.allowedCodes.length} Codes</span>)}
                                                </div>
                                                {/* View Poll Button */}
                                                <a 
                                                    href={getShareUrl()} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-sm"
                                                >
                                                    <Eye size={16} /> View Poll
                                                </a>
                                            </div>
                                            
                                            {/* Main Actions Row */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                                <button onClick={() => copyToClipboard(getShareUrl(), 'share')} className="py-2.5 px-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                                                    {copiedShare ? <Check size={14} className="text-green-600"/> : <Copy size={14}/>} {copiedShare ? 'Copied!' : 'Copy Link'}
                                                </button>
                                                <button onClick={() => setShowQrModal(true)} className="py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                                                    <QrCode size={14}/> QR Code
                                                </button>
                                                <button onClick={handleEditPoll} className="py-2.5 px-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                                                    <Settings size={14}/> Edit Poll
                                                </button>
                                                <button onClick={handleExportCSV} disabled={isExporting} className="py-2.5 px-3 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                                                    {isExporting ? <Loader2 size={14} className="animate-spin"/> : <FileSpreadsheet size={14}/>} Export CSV
                                                </button>
                                            </div>

                                            {/* Collapsible Sections */}
                                            <div className="space-y-3">
                                                {/* Share Options Section */}
                                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                    <button 
                                                        onClick={() => toggleSection('share')}
                                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50"
                                                    >
                                                        <span className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                                            <Share2 size={16} className="text-indigo-600"/> Share & Distribute
                                                        </span>
                                                        {expandedSections.share ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                                                    </button>
                                                    {expandedSections.share && (
                                                        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                                <button onClick={shareToWhatsapp} className="py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 flex flex-col items-center gap-1"><MessageCircle size={16}/> WhatsApp</button>
                                                                <button onClick={shareToSms} className="py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 flex flex-col items-center gap-1"><Smartphone size={16}/> SMS</button>
                                                                <button onClick={shareToEmail} className="py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 flex flex-col items-center gap-1"><Mail size={16}/> Email</button>
                                                                <button onClick={handlePrintPDF} className="py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 flex flex-col items-center gap-1"><Download size={16}/> PDF</button>
                                                            </div>
                                                            {/* Embed Code - Compact */}
                                                            <div className="flex gap-2 items-center">
                                                                <Code size={14} className="text-slate-400 flex-shrink-0"/>
                                                                <input type="text" readOnly value={`<iframe src="${getShareUrl()}?embed=true" ...>`} className="flex-1 px-2 py-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded text-slate-500 font-mono"/>
                                                                <button onClick={() => { navigator.clipboard.writeText(`<iframe src="${getShareUrl()}?embed=true" width="100%" height="600" frameborder="0"></iframe>`); setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }} className="px-2 py-1.5 bg-slate-100 text-slate-600 rounded text-xs font-bold hover:bg-slate-200">{copiedEmbed ? <Check size={12}/> : 'Embed'}</button>
                                                            </div>
                                                            {/* Custom Slug (Unlimited only) */}
                                                            {viewState.poll.tier === 'unlimited' && (
                                                                <div className="mt-3 pt-3 border-t border-slate-100">
                                                                    <CustomSlugInput
                                                                        pollId={viewState.poll.id}
                                                                        adminKey={parseHash().adminKey || ''}
                                                                        currentSlug={(viewState.poll as any).customSlug}
                                                                        tier={viewState.poll.tier}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Paid Features Section */}
                                                {viewState.poll.tier && viewState.poll.tier !== 'free' && (
                                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                        <button 
                                                            onClick={() => toggleSection('controls')}
                                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50"
                                                        >
                                                            <span className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                                                <SlidersHorizontal size={16} className="text-purple-600"/> Poll Controls
                                                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">PRO</span>
                                                            </span>
                                                            {expandedSections.controls ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                                                        </button>
                                                        {expandedSections.controls && (
                                                            <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                    <DraftLiveToggle
                                                                        pollId={viewState.poll.id}
                                                                        adminKey={parseHash().adminKey || ''}
                                                                        status={(viewState.poll as any).status || 'live'}
                                                                        voteCount={viewState.poll.voteCount || 0}
                                                                        onStatusChange={() => loadView(true)}
                                                                    />
                                                                    <div>
                                                                        <label className="text-xs font-semibold text-slate-600 mb-2 block flex items-center gap-1">
                                                                            <ImageIcon size={12}/> Poll Logo
                                                                        </label>
                                                                        <LogoUpload
                                                                            currentLogo={(viewState.poll as any).logoUrl}
                                                                            onLogoChange={async (url) => {
                                                                                try {
                                                                                    await fetch('/.netlify/functions/vg-update-settings', {
                                                                                        method: 'POST',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({
                                                                                            pollId: viewState.poll.id,
                                                                                            adminKey: parseHash().adminKey,
                                                                                            logoUrl: url
                                                                                        })
                                                                                    });
                                                                                    loadView(true);
                                                                                } catch (e) { console.error('Failed to save logo', e); }
                                                                            }}
                                                                            tier={viewState.poll.tier}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Notifications Section */}
                                                {viewState.poll.tier && viewState.poll.tier !== 'free' && (
                                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                        <button 
                                                            onClick={() => toggleSection('advanced')}
                                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50"
                                                        >
                                                            <span className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                                                                <Bell size={16} className="text-amber-600"/> Email Notifications
                                                            </span>
                                                            {expandedSections.advanced ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                                                        </button>
                                                        {expandedSections.advanced && (
                                                            <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                                                                <NotificationSettings
                                                                    pollId={viewState.poll.id}
                                                                    adminKey={parseHash().adminKey || ''}
                                                                    currentSettings={(viewState.poll as any).notificationSettings}
                                                                    onSettingsChange={() => loadView(true)}
                                                                    tier={viewState.poll.tier}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className={viewState.isAdmin ? "p-6 md:p-10" : ""}>
                                        {!viewState.isAdmin && (<div className="flex justify-end mb-4 print:hidden"><button onClick={handleManualRefresh} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium" disabled={isRefreshing}><RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? 'Refreshing...' : 'Refresh Votes'}</button></div>)}
                                        {/* Logo if present */}
                                        {(viewState.poll as any).logoUrl && (
                                            <div className="mb-6 flex justify-center">
                                                <img 
                                                    src={(viewState.poll as any).logoUrl} 
                                                    alt="Poll logo" 
                                                    className="max-h-20 max-w-56 object-contain"
                                                />
                                            </div>
                                        )}
                                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center font-serif tracking-tight">{viewState.poll.title}</h1>
                                        {viewState.poll.description && <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto text-lg">{viewState.poll.description}</p>}
                                        <VoteGeneratorResults 
                                            poll={viewState.poll} 
                                            results={viewState.results as any} 
                                            onEdit={viewState.isAdmin ? handleEditPoll : undefined}
                                            isAdmin={viewState.isAdmin}
                                            adminKey={parseHash().adminKey}
                                        />
                                        {!viewState.isAdmin && viewState.poll.settings.security === 'none' && (<div className="mt-8 flex flex-col items-center justify-center print:hidden"><button onClick={handleVoteAgain} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"><RotateCcw size={18} />Vote Again</button><p className="text-slate-400 text-xs mt-2">Multiple votes are allowed for this poll.</p></div>)}
                                        {!viewState.isAdmin && viewState.poll.settings.security !== 'none' && (<div className="mt-12 text-center print:hidden"><button onClick={goHome} className="text-slate-400 hover:text-indigo-600 font-medium inline-flex items-center gap-1">Create your own poll <ArrowRight size={14}/></button></div>)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {viewState.type === 'error' && (
                        <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center pt-20 px-4">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                viewState.errorType === 'not_found' ? 'bg-slate-100' :
                                viewState.errorType === 'invalid_admin' ? 'bg-amber-100' :
                                viewState.errorType === 'expired' ? 'bg-red-100' : 'bg-slate-100'
                            }`}>
                                {viewState.errorType === 'not_found' && <FileQuestion className="text-slate-400" size={40} />}
                                {viewState.errorType === 'invalid_admin' && <Key className="text-amber-500" size={40} />}
                                {viewState.errorType === 'expired' && <Clock className="text-red-400" size={40} />}
                                {(!viewState.errorType || viewState.errorType === 'generic') && <AlertTriangle className="text-slate-400" size={40} />}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                {viewState.errorType === 'not_found' && "Poll Not Found"}
                                {viewState.errorType === 'invalid_admin' && "Admin Access Denied"}
                                {viewState.errorType === 'expired' && "Poll Expired"}
                                {(!viewState.errorType || viewState.errorType === 'generic') && "Oops!"}
                            </h2>
                            
                            <p className="text-slate-500 mb-6">{viewState.message}</p>
                            
                            {/* Helpful tips based on error type */}
                            {viewState.errorType === 'not_found' && (
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <HelpCircle size={16} /> What might have happened?
                                    </h3>
                                    <ul className="text-sm text-slate-500 space-y-1">
                                        <li>• The poll was deleted by its creator</li>
                                        <li>• The poll ID in the link is incorrect</li>
                                        <li>• Free polls expire after 7 days</li>
                                    </ul>
                                </div>
                            )}
                            
                            {viewState.errorType === 'invalid_admin' && (
                                <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left border border-amber-100">
                                    <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                        <Key size={16} /> Admin Link Issues
                                    </h3>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        <li>• The admin key in your link may be incorrect</li>
                                        <li>• Check if you copied the full link including the admin= part</li>
                                        <li>• If you saved the link elsewhere, try that version</li>
                                    </ul>
                                    {viewState.pollId && (
                                        <div className="mt-3 pt-3 border-t border-amber-200">
                                            <p className="text-xs text-amber-600 mb-2">Try viewing as a regular voter:</p>
                                            <button 
                                                onClick={() => window.location.hash = `id=${viewState.pollId}`}
                                                className="text-sm text-amber-700 underline hover:no-underline"
                                            >
                                                View poll without admin access →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Check saved admin links */}
                            {(() => {
                                try {
                                    const saved = JSON.parse(localStorage.getItem('vg_admin_links') || '{}');
                                    const entries = Object.entries(saved);
                                    if (entries.length > 0) {
                                        return (
                                            <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left border border-indigo-100">
                                                <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                                                    <Search size={16} /> Your Recent Polls
                                                </h3>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {entries.slice(-5).reverse().map(([pId, data]: [string, any]) => (
                                                        <button 
                                                            key={pId}
                                                            onClick={() => window.location.hash = `id=${pId}&admin=${data.adminKey}`}
                                                            className="w-full text-left px-3 py-2 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
                                                        >
                                                            <p className="font-medium text-slate-700 truncate text-sm">{data.title || 'Untitled Poll'}</p>
                                                            <p className="text-xs text-slate-400">ID: {pId}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                } catch { }
                                return null;
                            })()}
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={goHome} 
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Home size={18} /> Create New Poll
                                </button>
                                <button 
                                    onClick={() => setShowRecoveryModal(true)} 
                                    className="px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} /> Recover My Polls
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => window.history.back()} 
                                className="text-slate-500 hover:text-slate-700 text-sm mt-4 flex items-center gap-1 mx-auto"
                            >
                                <ArrowLeft size={14} /> Go Back
                            </button>
                            
                            {/* Contact support link */}
                            <p className="text-xs text-slate-400 mt-8">
                                Need help? <a href="mailto:support@votegenerator.com" className="text-indigo-500 hover:underline">Contact Support</a>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {showQrModal && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQrModal(false)}>
                             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-slate-800">Scan to Vote</h3><button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full"><X size={20}/></button></div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-center mb-6"><img src={getQrUrl()} alt="QR Code" className="w-48 h-48 mix-blend-multiply" /></div>
                                {viewState.type === 'results' && viewState.poll.settings.security === 'code' && (<div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-100 mb-6 flex gap-2"><Key size={16} className="shrink-0 mt-0.5" /><div><strong>Note:</strong> This QR code opens the voting page. Voters must still manually enter their unique Access Code after scanning.</div></div>)}
                                <button onClick={downloadQrCode} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex justify-center items-center gap-2"><Download size={18}/> Download PNG</button>
                             </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            </>
            )}
            
            {/* Poll Recovery Modal */}
            <PollRecoveryModal 
                isOpen={showRecoveryModal} 
                onClose={() => setShowRecoveryModal(false)} 
            />
            
            {/* Dev Mode Panel - Only visible in dev/test environments */}
            <DevModePanel onTierChange={(tier) => {
                setIsPaidUser(tier !== null && tier !== 'free');
            }} />
        </div>
    );
};

export default VoteGeneratorApp;
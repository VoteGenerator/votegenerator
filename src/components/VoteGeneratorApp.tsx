import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, ArrowRight, FileSpreadsheet, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, Globe, QrCode, X, Download, ListOrdered, CheckSquare, Calendar, Coins, LayoutGrid, GitCompare, SlidersHorizontal, Zap, Crown, PlusCircle } from 'lucide-react';
import LandingPage from './LandingPage';
import AdWall from './AdWall';
import CheckoutSuccess from './CheckoutSuccess';
import TemplatesPage from './TemplatesPage';
import PricingPage from './PricingPage';
import AdminDashboard from './AdminDashboard';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorEdit from './VoteGeneratorEdit';
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
            setTimeout(() => setCopiedAdmin(false), 2000);
        } else if (type === 'share') {
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
    };

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
            ) : window.location.pathname === '/templates' || window.location.pathname.startsWith('/templates') ? (
                <TemplatesPage />
            ) : window.location.pathname === '/pricing' || window.location.pathname.startsWith('/pricing') ? (
                <PricingPage />
            ) : (
            <>
            {/* Header */}
            {viewState.type !== 'create' && viewState.type !== 'loading' && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <button 
                            onClick={goHome}
                            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold transition-colors"
                        >
                            <Home size={20} />
                            <span className="hidden sm:inline">VoteGenerator</span>
                        </button>
                        
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
                             {/* Admin Indicator in Header */}
                             {viewState.type === 'results' && viewState.isAdmin && (
                                 <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                     <ShieldCheck size={14} /> Admin Portal
                                 </div>
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
                            className="flex flex-col items-center justify-center pt-40"
                        >
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                            <p className="text-slate-500 font-medium">Loading...</p>
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
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                
                                {/* --- ADMIN DASHBOARD HEADER & KEY --- */}
                                {viewState.isAdmin && (
                                    <div className="mb-8 print:hidden">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                                    <LayoutDashboard className="text-indigo-600" size={28}/> 
                                                    Admin Dashboard
                                                </h2>
                                                <p className="text-slate-500 text-sm mt-1 ml-10">Overview of your active polls</p>
                                            </div>
                                            <div className="hidden md:block text-xs text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full font-bold">
                                                Premium Enabled
                                            </div>
                                        </div>

                                        {/* ADMIN KEY (Top Priority) */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-white text-amber-600 rounded-lg shadow-sm border border-amber-100">
                                                    <Key size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-amber-900">Private Admin Key</div>
                                                    <div className="text-xs text-amber-700/80">
                                                        Save this URL! It is the only way to manage this poll.
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => copyToClipboard(window.location.href, 'admin')}
                                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-amber-200 text-amber-700 hover:bg-amber-100/50 rounded-lg text-sm font-bold transition-all shadow-sm"
                                            >
                                                {copiedAdmin ? <Check size={16}/> : <Copy size={16}/>} 
                                                {copiedAdmin ? 'Copied' : 'Copy Admin Link'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- POLL CONTAINER (Unified for Admin) --- */}
                                <div className={viewState.isAdmin ? "bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all" : ""}>
                                    
                                    {/* ADMIN: Management Toolbar */}
                                    {viewState.isAdmin && (
                                        <div className="bg-slate-50/80 border-b border-slate-200 p-6 print:hidden">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                        Current Poll Settings
                                                    </h3>
                                                    {(() => {
                                                        const typeDetails = getPollTypeDetails(viewState.poll.pollType);
                                                        const Icon = typeDetails.icon;
                                                        return (
                                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold border ${typeDetails.bg} ${typeDetails.color} ${typeDetails.border}`}>
                                                                <Icon size={12} />
                                                                {typeDetails.label}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="flex gap-2">
                                                    {viewState.poll.settings.deadline && (
                                                        <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-600 flex items-center gap-1">
                                                            <Clock size={12}/> Ends: {new Date(viewState.poll.settings.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {viewState.poll.allowedCodes && (
                                                        <span onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')} className="text-xs bg-purple-50 border border-purple-100 px-2 py-1 rounded-md text-purple-600 flex items-center gap-1 cursor-pointer hover:bg-purple-100 transition-colors">
                                                            <Key size={12}/> {viewState.poll.allowedCodes.length} Codes {copiedCodes ? '(Copied)' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid lg:grid-cols-2 gap-6">
                                                
                                                {/* Share Section */}
                                                <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
                                                     <div className="flex items-center justify-between mb-3">
                                                         <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                                             <Share2 size={18} className="text-indigo-600"/> Share Poll
                                                         </h4>
                                                     </div>
                                                     <div className="flex gap-2 mb-3">
                                                         <div className="relative flex-1">
                                                             <Globe className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                                             <input type="text" readOnly value={getShareUrl()} className="w-full pl-9 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none" />
                                                         </div>
                                                         <button onClick={() => copyToClipboard(getShareUrl(), 'share')} className="px-3 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                                             {copiedShare ? 'Copied' : 'Copy'}
                                                         </button>
                                                     </div>
                                                     <div className="grid grid-cols-2 gap-2">
                                                         <button onClick={shareToWhatsapp} className="py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex justify-center items-center gap-1"><MessageCircle size={14}/> WhatsApp</button>
                                                         <button onClick={shareToSms} className="py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex justify-center items-center gap-1"><Smartphone size={14}/> SMS</button>
                                                         <button onClick={shareToEmail} className="py-2 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex justify-center items-center gap-1"><Mail size={14}/> Email</button>
                                                         <button onClick={() => setShowQrModal(true)} className="py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors flex justify-center items-center gap-1"><QrCode size={14}/> QR Code</button>
                                                     </div>
                                                </div>

                                                {/* Controls Section */}
                                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                         <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                             <Settings size={18} className="text-slate-600"/> Controls
                                                         </h4>
                                                     </div>
                                                     <div className="grid grid-cols-2 gap-3">
                                                         <button onClick={handleEditPoll} className="flex items-center justify-center gap-2 p-3 border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-sm font-medium transition-all text-slate-600">
                                                             <Settings size={16}/> Edit
                                                         </button>
                                                         <button onClick={handleExportCSV} disabled={isExporting} className="flex items-center justify-center gap-2 p-3 border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:text-emerald-600 rounded-lg text-sm font-medium transition-all text-slate-600">
                                                             {isExporting ? <Loader2 size={16} className="animate-spin"/> : <FileSpreadsheet size={16}/>} CSV
                                                         </button>
                                                         <button onClick={handlePrintPDF} className="col-span-2 flex items-center justify-center gap-2 p-2 border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-medium transition-all">
                                                             <Download size={14}/> Download PDF
                                                         </button>
                                                     </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    {/* Main Content Area (Title + Results) */}
                                    <div className={viewState.isAdmin ? "p-6 md:p-10" : ""}>
                                        {!viewState.isAdmin && (
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
                                        )}

                                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center font-serif tracking-tight">{viewState.poll.title}</h1>
                                        {viewState.poll.description && <p className="text-slate-500 text-center mb-10 max-w-2xl mx-auto text-lg">{viewState.poll.description}</p>}
                                        
                                        <VoteGeneratorResults 
                                            poll={viewState.poll} 
                                            results={viewState.results}
                                            onEdit={viewState.isAdmin ? handleEditPoll : undefined} 
                                        />
                                        
                                         {/* Vote Again Button for Non-Admin with Security 'none' */}
                                        {!viewState.isAdmin && viewState.poll.settings.security === 'none' && (
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
                                        
                                        {!viewState.isAdmin && viewState.poll.settings.security !== 'none' && (
                                            <div className="mt-12 text-center print:hidden">
                                                <button 
                                                    onClick={goHome} 
                                                    className="text-slate-400 hover:text-indigo-600 font-medium transition-colors inline-flex items-center gap-1"
                                                >
                                                    Create your own poll <ArrowRight size={14}/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
            </main>
            </>
            )}
        </div>
    );
};

export default VoteGeneratorApp;
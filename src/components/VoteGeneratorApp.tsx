import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, ArrowRight, FileSpreadsheet, Printer, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, ChevronRight } from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';
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
                const choiceTexts = vote.choices.map(id => {
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

    const copyWithText = () => {
        if(viewState.type !== 'results') return;
        copyToClipboard(getShareText(viewState.poll.title), 'share');
    };

    return (
        <div className="min-h-screen pb-10">
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
                            <VoteGeneratorCreate />
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
                            <div className="max-w-3xl mx-auto px-4 py-8">
                                
                                {/* --- ADMIN DASHBOARD --- */}
                                {viewState.isAdmin && (
                                    <div className="mb-10 space-y-6 print:hidden">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                                <LayoutDashboard className="text-indigo-600" size={24}/> 
                                                Admin Dashboard
                                            </h2>
                                            <div className="text-xs text-slate-400 font-medium">
                                                Premium: Multi-poll management
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            
                                            {/* Card 1: Admin Access (Private) */}
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 flex flex-col shadow-sm">
                                                <div className="flex items-center gap-2 text-amber-900 font-bold mb-2">
                                                    <Key size={18} /> Admin Access
                                                </div>
                                                <p className="text-xs text-amber-800/80 mb-4 flex-1">
                                                    <strong>Private Key.</strong> Do not share. This is the only way to manage your poll.
                                                </p>
                                                <button 
                                                    onClick={() => copyToClipboard(window.location.href, 'admin')}
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-amber-700 hover:text-amber-900 border border-amber-200 hover:bg-amber-100 px-3 py-2 rounded-lg text-sm font-bold transition-all"
                                                >
                                                    {copiedAdmin ? <Check size={16}/> : <Copy size={16}/>} 
                                                    {copiedAdmin ? 'Copied' : 'Copy Admin Link'}
                                                </button>
                                            </div>

                                            {/* Card 2: Share (Public) */}
                                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-5 flex flex-col shadow-sm">
                                                <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
                                                    <Share2 size={18} /> Share Poll
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 mb-2 flex-1">
                                                    <button onClick={copyWithText} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-indigo-100/50 text-indigo-700 transition-colors" title="Copy Link with Text">
                                                        {copiedShare ? <Check size={20}/> : <Copy size={20}/>}
                                                        <span className="text-[10px] font-bold">Copy</span>
                                                    </button>
                                                    <button onClick={shareToWhatsapp} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors" title="WhatsApp">
                                                        <MessageCircle size={20}/>
                                                        <span className="text-[10px] font-bold">App</span>
                                                    </button>
                                                    <button onClick={shareToSms} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="SMS / Text">
                                                        <Smartphone size={20}/>
                                                        <span className="text-[10px] font-bold">SMS</span>
                                                    </button>
                                                    <button onClick={shareToEmail} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors" title="Email">
                                                        <Mail size={20}/>
                                                        <span className="text-[10px] font-bold">Email</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Card 3: Control Panel */}
                                            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col shadow-sm">
                                                <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                                                    <Settings size={18} /> Manage Poll
                                                </div>
                                                <div className="space-y-2">
                                                    <button 
                                                        onClick={handleEditPoll}
                                                        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 font-medium transition-colors group"
                                                    >
                                                        <span>Edit Settings</span>
                                                        <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={handleExportCSV}
                                                            disabled={isExporting}
                                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            {isExporting ? <Loader2 size={12} className="animate-spin"/> : <FileSpreadsheet size={14}/>} CSV
                                                        </button>
                                                        <button 
                                                            onClick={handlePrintPDF}
                                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            <Printer size={14}/> Print
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collapsible Info Section: Codes & Deadlines */}
                                        <div className="flex flex-wrap gap-4 text-xs">
                                            {viewState.poll.settings.deadline && (
                                                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full font-medium">
                                                    <Clock size={14} /> 
                                                    Closes: {new Date(viewState.poll.settings.deadline).toLocaleString()}
                                                </div>
                                            )}
                                            {viewState.poll.allowedCodes && (
                                                <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')}>
                                                    <Key size={14} /> 
                                                    {viewState.poll.allowedCodes.length} Codes ({copiedCodes ? 'Copied' : 'Click to Copy All'})
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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

                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center font-serif">{viewState.poll.title}</h1>
                                {viewState.poll.description && <p className="text-slate-500 text-center mb-8 max-w-2xl mx-auto">{viewState.poll.description}</p>}
                                
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
            </main>
        </div>
    );
};

export default VoteGeneratorApp;
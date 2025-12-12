import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, Info, ArrowRight, FileSpreadsheet, Printer, Settings } from 'lucide-react';
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
            const headers = ['Date', 'Time', 'Voter Name', 'Access Code', 'Choices (Ranked/Selected)'];
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
                    `"${choiceTexts.join('; ')}"` 
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
                             {viewState.type === 'results' && (
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
                                
                                {/* Admin Hub */}
                                {viewState.isAdmin && (
                                    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6 md:p-8 mb-8 overflow-hidden relative print:hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500"></div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                                <ShieldCheck className="text-indigo-600" size={28}/> 
                                                Admin Hub
                                            </h2>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Admin Link Section */}
                                            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex flex-col">
                                                <div className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                                    <Key size={18}/> Admin Link (Private)
                                                </div>
                                                <div className="bg-amber-100/50 p-2 rounded-lg mb-4 flex-1">
                                                    <p className="text-xs text-amber-900 font-bold mb-1 flex items-center gap-1">
                                                        <AlertTriangle size={12}/> WARNING: SAVE THIS LINK
                                                    </p>
                                                    <p className="text-xs text-amber-800/90 leading-relaxed">
                                                        We do not require logins, so this link is your <strong>only</strong> key. If you lose it, you lose admin access forever. We cannot recover it for you.
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 bg-white rounded-lg p-1 border border-amber-200">
                                                    <input 
                                                        readOnly 
                                                        value={window.location.href} 
                                                        className="text-xs text-slate-500 px-2 py-2 w-full outline-none bg-transparent font-mono truncate" 
                                                        onClick={(e) => e.currentTarget.select()}
                                                    />
                                                    <button 
                                                        onClick={() => copyToClipboard(window.location.href, 'admin')}
                                                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-2 rounded-md transition-colors"
                                                        title="Copy Admin Link"
                                                    >
                                                        {copiedAdmin ? <Check size={16}/> : <Copy size={16}/>}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Voter Link Section */}
                                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col">
                                                <div className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                                    <Share2 size={18}/> Voter Link (Public)
                                                </div>
                                                <p className="text-sm text-indigo-800/80 mb-4 flex-1">
                                                    Share this link with your participants. It does not contain admin powers.
                                                </p>
                                                <div className="flex gap-2 bg-white rounded-lg p-1 border border-indigo-200">
                                                    <input 
                                                        readOnly 
                                                        value={getShareUrl()} 
                                                        className="text-xs text-slate-500 px-2 py-2 w-full outline-none bg-transparent font-mono truncate" 
                                                        onClick={(e) => e.currentTarget.select()}
                                                    />
                                                    <button 
                                                        onClick={() => copyToClipboard(getShareUrl(), 'share')}
                                                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 p-2 rounded-md transition-colors"
                                                        title="Copy Share Link"
                                                    >
                                                        {copiedShare ? <Check size={16}/> : <Copy size={16}/>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Generated Codes Section (If Security is Code) */}
                                        {viewState.poll.allowedCodes && viewState.poll.allowedCodes.length > 0 && (
                                            <div className="mt-6 p-5 bg-purple-50 rounded-2xl border border-purple-100">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="font-bold text-purple-900 flex items-center gap-2">
                                                        <Key size={18}/> Access Codes ({viewState.poll.allowedCodes.length})
                                                    </div>
                                                    <button 
                                                        onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')}
                                                        className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 bg-white px-2 py-1 rounded border border-purple-200"
                                                    >
                                                        {copiedCodes ? <Check size={14}/> : <Copy size={14}/>} Copy All
                                                    </button>
                                                </div>
                                                <div className="text-xs text-purple-800 mb-3 flex items-center justify-between">
                                                    <span>Distribute one code to each voter. Codes are crossed off when used.</span>
                                                    <span className="text-purple-600 font-semibold bg-purple-100 px-2 py-0.5 rounded text-[10px] uppercase">
                                                        {viewState.results.usedCodes?.length || 0} used / {viewState.poll.allowedCodes.length} total
                                                    </span>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto bg-white rounded-lg border border-purple-200 p-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                                    {viewState.poll.allowedCodes.map(code => {
                                                        const isUsed = viewState.results.usedCodes?.includes(code);
                                                        return (
                                                            <div 
                                                                key={code} 
                                                                className={`font-mono text-xs p-1.5 text-center rounded border transition-colors ${
                                                                    isUsed 
                                                                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through' 
                                                                        : 'bg-purple-50 text-slate-700 border-purple-100 font-medium'
                                                                }`}
                                                            >
                                                                {code}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Troubleshooting Tip */}
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-slate-500">
                                            <div className="flex items-start gap-2 max-w-lg bg-slate-50 p-2 rounded-lg">
                                                <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                                <span>
                                                    If your page is blank or data seems missing, try opening this link in <strong>Incognito Mode</strong> or clearing your browser cache.
                                                </span>
                                            </div>
                                            <button 
                                                onClick={handleManualRefresh}
                                                className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
                                                disabled={isRefreshing}
                                            >
                                                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                                                Refresh Results
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Admin Toolbar (Export/Print) - Shown above results */}
                                {viewState.isAdmin && (
                                    <div className="flex flex-wrap justify-end gap-2 mb-4 print:hidden">
                                        <button 
                                            onClick={handleEditPoll}
                                            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                        >
                                            <Settings size={16}/>
                                            Edit Poll
                                        </button>
                                        <button 
                                            onClick={handlePrintPDF}
                                            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                        >
                                            <Printer size={16}/>
                                            Print / Save PDF
                                        </button>
                                        <button 
                                            onClick={handleExportCSV}
                                            disabled={isExporting}
                                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
                                        >
                                            {isExporting ? <Loader2 size={16} className="animate-spin"/> : <FileSpreadsheet size={16}/>}
                                            Export CSV
                                        </button>
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
                                
                                {!viewState.isAdmin && (
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
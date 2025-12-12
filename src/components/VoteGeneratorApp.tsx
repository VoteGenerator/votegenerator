import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, ArrowRight, FileSpreadsheet, Printer, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, ChevronRight, Users, Globe } from 'lucide-react';
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
                                    <div className="mb-12 print:hidden">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                                    <LayoutDashboard className="text-indigo-600" size={28}/> 
                                                    Admin Dashboard
                                                </h2>
                                                <p className="text-slate-500 text-sm mt-1 ml-10">Manage your active poll</p>
                                            </div>
                                            <div className="hidden md:block text-xs text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full font-bold">
                                                Premium: Multi-poll view enabled
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            
                                            {/* Section 1: SHARE (Public) - Full Width */}
                                            <div className="bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-hidden">
                                                <div className="bg-indigo-50/50 p-4 border-b border-indigo-50 flex justify-between items-center">
                                                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                                        <Share2 size={20} className="text-indigo-600"/> 
                                                        Share & Invite
                                                    </h3>
                                                    <span className="text-xs font-medium text-indigo-400">Public Link</span>
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {/* Link Input */}
                                                        <div className="flex-1">
                                                            <div className="relative flex items-center">
                                                                <Globe className="absolute left-3 text-slate-400" size={18} />
                                                                <input 
                                                                    type="text" 
                                                                    readOnly 
                                                                    value={getShareUrl()} 
                                                                    className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                                                />
                                                                <button 
                                                                    onClick={() => copyToClipboard(getShareUrl(), 'share')}
                                                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold transition-all shadow-sm"
                                                                >
                                                                    {copiedShare ? 'Copied' : 'Copy Link'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2 shrink-0">
                                                            <button onClick={copyWithText} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-200" title="Copy with message">
                                                                <Copy size={18}/> <span className="hidden md:inline">Copy Text</span>
                                                            </button>
                                                            <button onClick={shareToWhatsapp} className="flex-1 md:flex-none flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-md shadow-green-200" title="WhatsApp">
                                                                <MessageCircle size={20}/>
                                                            </button>
                                                            <button onClick={shareToSms} className="flex-1 md:flex-none flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-md shadow-blue-200" title="SMS">
                                                                <Smartphone size={20}/>
                                                            </button>
                                                            <button onClick={shareToEmail} className="flex-1 md:flex-none flex items-center justify-center p-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-all shadow-md shadow-slate-200" title="Email">
                                                                <Mail size={20}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: MANAGE (Admin) - Full Width */}
                                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                                        <Settings size={20} className="text-slate-600"/> 
                                                        Poll Controls
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        {viewState.poll.settings.deadline && (
                                                            <span className="flex items-center gap-1 text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                                <Clock size={12}/> Ends: {new Date(viewState.poll.settings.deadline).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                        {viewState.poll.allowedCodes && (
                                                            <span onClick={() => copyToClipboard(viewState.poll.allowedCodes!.join('\n'), 'codes')} className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 cursor-pointer hover:bg-purple-100">
                                                                <Key size={12}/> {viewState.poll.allowedCodes.length} Codes
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <button 
                                                            onClick={handleEditPoll}
                                                            className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all group text-left"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Edit Settings</div>
                                                                <div className="text-xs text-slate-500 group-hover:text-indigo-500/70">Update title, deadline...</div>
                                                            </div>
                                                            <Settings size={20} className="text-slate-300 group-hover:text-indigo-500" />
                                                        </button>

                                                        <button 
                                                            onClick={handleExportCSV}
                                                            disabled={isExporting}
                                                            className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl transition-all group text-left"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-slate-800 group-hover:text-emerald-700">Export CSV</div>
                                                                <div className="text-xs text-slate-500 group-hover:text-emerald-500/70">Download full results</div>
                                                            </div>
                                                            {isExporting ? <Loader2 size={20} className="animate-spin text-emerald-500"/> : <FileSpreadsheet size={20} className="text-slate-300 group-hover:text-emerald-500" />}
                                                        </button>

                                                        <button 
                                                            onClick={handlePrintPDF}
                                                            className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all group text-left"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-slate-800">Print Report</div>
                                                                <div className="text-xs text-slate-500">Save as PDF</div>
                                                            </div>
                                                            <Printer size={20} className="text-slate-300 group-hover:text-slate-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3: ADMIN KEY (Private) - Full Width */}
                                            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm">
                                                        <Key size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-amber-900">Private Admin Key</div>
                                                        <div className="text-xs text-amber-700/80">
                                                            Don't lose this! It's the only way to manage your poll.
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => copyToClipboard(window.location.href, 'admin')}
                                                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-amber-700 hover:text-amber-900 border border-amber-200 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                                                >
                                                    {copiedAdmin ? <Check size={16}/> : <Copy size={16}/>} 
                                                    {copiedAdmin ? 'Copied' : 'Copy Admin Link'}
                                                </button>
                                            </div>

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

                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 text-center font-serif tracking-tight">{viewState.poll.title}</h1>
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
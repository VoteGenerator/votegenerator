import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check, ShieldCheck, Key, RefreshCw, ArrowRight, FileSpreadsheet, Settings, Clock, RotateCcw, MessageCircle, Mail, Smartphone, LayoutDashboard, Globe, QrCode, X, Download, ListOrdered, CheckSquare, Calendar, Coins, LayoutGrid, GitCompare, SlidersHorizontal, Code } from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorEdit from './VoteGeneratorEdit';
import NavHeader from './NavHeader';
import PricingPage from './PricingPage';
import EmbedPoll from './EmbedPoll';
import { getPoll, getPollAsAdmin, getResults, hasVoted, getRawVotes } from '../services/voteGeneratorService';
import { Poll, RunoffResult } from '../types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'vote'; poll: Poll }
    | { type: 'results'; poll: Poll; results: RunoffResult; isAdmin?: boolean }
    | { type: 'edit'; poll: Poll; isAdmin: boolean }
    | { type: 'pricing' }
    | { type: 'error'; message: string };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const pollInterval = useRef<number | undefined>(undefined);

    // Determine current page for NavHeader highlighting
    const getCurrentPage = (): 'create' | 'demo' | 'pricing' | 'blog' | 'help' => {
        if (viewState.type === 'pricing') return 'pricing';
        if (viewState.type === 'create') return 'create';
        return 'create'; // default
    };

    const parseHash = useCallback(() => {
        const hash = window.location.hash.slice(1);
        
        // Check for special pages first
        if (hash === 'pricing') {
            return { page: 'pricing', pollId: null, adminKey: null };
        }
        if (hash === 'demo') {
            return { page: 'demo', pollId: null, adminKey: null };
        }
        if (hash === 'blog') {
            return { page: 'blog', pollId: null, adminKey: null };
        }
        if (hash === 'help') {
            return { page: 'help', pollId: null, adminKey: null };
        }
        
        const params = new URLSearchParams(hash);
        return {
            page: null,
            pollId: params.get('id'),
            adminKey: params.get('admin')
        };
    }, []);

    const loadView = useCallback(async (silent = false) => {
        const { page, pollId, adminKey } = parseHash();

        // Handle special pages
        if (page === 'pricing') {
            setViewState({ type: 'pricing' });
            return;
        }
        // Add more pages as needed:
        // if (page === 'demo') { setViewState({ type: 'demo' }); return; }
        // if (page === 'blog') { setViewState({ type: 'blog' }); return; }

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
            
            // Create CSV content
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Voter,Vote,Timestamp\n";
            
            votes.forEach((vote: any) => {
                const voter = vote.voterName || 'Anonymous';
                const voteData = JSON.stringify(vote.vote).replace(/"/g, '""');
                const timestamp = new Date(vote.timestamp).toISOString();
                csvContent += `"${voter}","${voteData}","${timestamp}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `poll-${pollId}-votes.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        }
        setIsExporting(false);
    };

    const goHome = () => {
        window.location.hash = '';
    };

    const getShareUrl = () => {
        if (viewState.type !== 'results' || !viewState.poll) return '';
        return `${window.location.origin}${window.location.pathname}#id=${viewState.poll.id}`;
    };

    const getAdminUrl = () => {
        if (viewState.type !== 'results' || !viewState.poll) return '';
        const { adminKey } = parseHash();
        return `${window.location.origin}${window.location.pathname}#id=${viewState.poll.id}&admin=${adminKey}`;
    };

    const getQrUrl = () => {
        const shareUrl = getShareUrl();
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    };

    const downloadQrCode = async () => {
        const qrUrl = getQrUrl();
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poll-qr-code.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const copyToClipboard = async (text: string, type: 'admin' | 'share' | 'codes') => {
        await navigator.clipboard.writeText(text);
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

    // Check if we should show NavHeader (hide on vote/embed pages for cleaner experience)
    const showNavHeader = viewState.type === 'create' || viewState.type === 'pricing';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Navigation Header - only on main pages */}
            {showNavHeader && (
                <NavHeader currentPage={getCurrentPage()} />
            )}

            <main className={showNavHeader ? "" : ""}>
                <AnimatePresence mode="wait">
                    {viewState.type === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-screen flex items-center justify-center"
                        >
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        </motion.div>
                    )}

                    {viewState.type === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <VoteGeneratorCreate />
                        </motion.div>
                    )}

                    {viewState.type === 'pricing' && (
                        <motion.div
                            key="pricing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <PricingPage />
                        </motion.div>
                    )}

                    {viewState.type === 'vote' && (
                        <motion.div
                            key="vote"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <VoteGeneratorVote 
                                poll={viewState.poll} 
                                onVoteSuccess={handleVoteSuccess}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'edit' && (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <VoteGeneratorEdit 
                                poll={viewState.poll}
                                onSave={() => loadView()}
                                onCancel={() => loadView()}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="min-h-screen py-8 px-4"
                        >
                            <div className="max-w-6xl mx-auto">
                                <div className={`bg-white shadow-xl rounded-3xl overflow-hidden print:shadow-none print:rounded-none ${viewState.isAdmin ? 'md:flex' : ''}`}>
                                    
                                    {/* Admin Sidebar */}
                                    {viewState.isAdmin && (
                                        <div className="md:w-80 bg-slate-50 border-r border-slate-100 p-6 print:hidden shrink-0">
                                            <div className="sticky top-8 space-y-6">
                                                {/* Back Home */}
                                                <button 
                                                    onClick={goHome}
                                                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                                                >
                                                    <Home size={16} />
                                                    New Poll
                                                </button>

                                                {/* Share Links */}
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share Links</h4>
                                                    
                                                    {/* Voter Link */}
                                                    <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Globe size={14} className="text-indigo-500" />
                                                            <span className="text-xs font-semibold text-slate-600">Voter Link</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input 
                                                                type="text" 
                                                                value={getShareUrl()} 
                                                                readOnly 
                                                                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-500 truncate"
                                                            />
                                                            <button 
                                                                onClick={() => copyToClipboard(getShareUrl(), 'share')}
                                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${copiedShare ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-indigo-100 text-slate-600'}`}
                                                            >
                                                                {copiedShare ? <Check size={14}/> : <Copy size={14}/>}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Admin Link */}
                                                    <div className="bg-white rounded-xl p-3 border border-amber-200">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ShieldCheck size={14} className="text-amber-500" />
                                                            <span className="text-xs font-semibold text-slate-600">Admin Link</span>
                                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">PRIVATE</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input 
                                                                type="text" 
                                                                value={getAdminUrl()} 
                                                                readOnly 
                                                                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-500 truncate"
                                                            />
                                                            <button 
                                                                onClick={() => copyToClipboard(getAdminUrl(), 'admin')}
                                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${copiedAdmin ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-amber-100 text-slate-600'}`}
                                                            >
                                                                {copiedAdmin ? <Check size={14}/> : <Copy size={14}/>}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* QR Code Button */}
                                                    <button 
                                                        onClick={() => setShowQrModal(true)}
                                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl text-sm font-medium text-slate-600 transition-all"
                                                    >
                                                        <QrCode size={16} />
                                                        Show QR Code
                                                    </button>

                                                    {/* Embed Button */}
                                                    <button 
                                                        onClick={() => setShowEmbedModal(true)}
                                                        className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl text-sm font-medium text-slate-600 transition-all"
                                                    >
                                                        <Code size={16} />
                                                        Embed Poll
                                                    </button>
                                                </div>

                                                {/* Voting Codes (if security = 'code') */}
                                                {viewState.poll.settings.security === 'code' && viewState.poll.settings.votingCodes && (
                                                    <div className="space-y-3">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                            <Key size={12} />
                                                            Voting Codes
                                                        </h4>
                                                        <div className="bg-white rounded-xl p-3 border border-slate-100">
                                                            <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
                                                                {viewState.poll.settings.votingCodes.map((code, i) => (
                                                                    <div key={i} className="text-xs font-mono bg-slate-50 px-2 py-1 rounded text-slate-600">
                                                                        {code}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button 
                                                                onClick={() => copyToClipboard(viewState.poll.settings.votingCodes?.join('\n') || '', 'codes')}
                                                                className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${copiedCodes ? 'bg-green-500 text-white' : 'bg-slate-100 hover:bg-indigo-100 text-slate-600'}`}
                                                            >
                                                                {copiedCodes ? 'Copied!' : 'Copy All Codes'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Admin Actions */}
                                                <div className="space-y-3">
                                                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                         Actions
                                                     </h4>
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
                                    <div className={viewState.isAdmin ? "flex-1 p-6 md:p-10" : "p-6 md:p-10"}>
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

                {/* Embed Modal */}
                <AnimatePresence>
                    {showEmbedModal && viewState.type === 'results' && (
                        <EmbedPoll 
                            poll={viewState.poll}
                            isPremium={false} // TODO: Check user's premium status
                            onClose={() => setShowEmbedModal(false)}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default VoteGeneratorApp;
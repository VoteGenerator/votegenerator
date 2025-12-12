import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home, Share2, Copy, Check } from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import { getPoll, getPollAsAdmin, getResults, hasVoted } from './services/voteGeneratorService';
import { Poll, RunoffResult } from './types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'vote'; poll: Poll }
    | { type: 'results'; poll: Poll; results: RunoffResult; isAdmin?: boolean }
    | { type: 'error'; message: string };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });
    const [copied, setCopied] = useState(false);

    const parseHash = useCallback(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        return {
            pollId: params.get('id'),
            adminKey: params.get('admin')
        };
    }, []);

    const loadView = useCallback(async () => {
        const { pollId, adminKey } = parseHash();

        if (!pollId) {
            setViewState({ type: 'create' });
            return;
        }

        setViewState({ type: 'loading' });

        try {
            let poll: Poll;
            let isAdmin = false;

            if (adminKey) {
                poll = await getPollAsAdmin(pollId, adminKey);
                isAdmin = true;
            } else {
                poll = await getPoll(pollId);
            }

            // Determine if we should show results or voting
            const userVoted = hasVoted(pollId);
            const showResults = isAdmin || (userVoted && !poll.settings.hideResults);

            if (showResults) {
                const results = await getResults(pollId, adminKey || undefined);
                setViewState({ type: 'results', poll, results, isAdmin });
            } else if (userVoted && poll.settings.hideResults) {
                 // Voted but results hidden
                 setViewState({ type: 'error', message: "Thanks for voting! Results are hidden by the organizer." });
            } else {
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
        loadView();
        const handleHashChange = () => loadView();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [loadView]);

    const handleVoteSuccess = async () => {
        const { pollId } = parseHash();
        if(!pollId) return;
        
        const poll = await getPoll(pollId);
        if(!poll.settings.hideResults) {
            const results = await getResults(pollId);
            setViewState({ type: 'results', poll, results });
        } else {
             setViewState({ type: 'error', message: "Vote submitted! Results are currently hidden." });
        }
    };

    const copyLink = () => {
        const { pollId } = parseHash();
        // Construct vote URL (without admin key)
        const url = `${window.location.origin}/#id=${pollId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const goHome = () => {
        window.location.hash = '';
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            {viewState.type !== 'create' && viewState.type !== 'loading' && (
                <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <button 
                            onClick={goHome}
                            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                        >
                            <Home size={20} />
                            VoteGenerator
                        </button>
                        
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            {copied ? <Check size={16} /> : <Share2 size={16} />}
                            {copied ? 'Copied!' : 'Share Poll'}
                        </button>
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

                    {viewState.type === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="max-w-3xl mx-auto px-4 py-10">
                                {viewState.isAdmin && (
                                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-sm">
                                        <AlertTriangle size={20} className="shrink-0" />
                                        <div>
                                            <strong>Admin Mode:</strong> You are viewing these results because you created the poll. 
                                            <div className="mt-1 flex items-center gap-2 cursor-pointer hover:underline" onClick={copyLink}>
                                                <Copy size={14} /> Copy link for voters (excludes admin key)
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">{viewState.poll.title}</h1>
                                <VoteGeneratorResults poll={viewState.poll} results={viewState.results} />
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
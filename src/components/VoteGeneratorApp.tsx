import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, Home } from 'lucide-react';

// Components
import VoteGeneratorCreate from './VoteGeneratorCreate';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorConfirmation from './VoteGeneratorConfirmation';
import VoteGeneratorAdmin from './VoteGeneratorAdmin';
import VoteGeneratorResults from './VoteGeneratorResults';

// Services
import { getPoll, getPollAsAdmin, getResults, hasVoted } from '../services/voteGeneratorService';

// Types
import type { Poll, AdminPollData, RunoffResult } from '../types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'vote'; poll: Poll }
    | { type: 'confirmation'; poll: Poll }
    | { type: 'results'; poll: Poll; runoffResult: RunoffResult }
    | { type: 'admin'; poll: AdminPollData; runoffResult?: RunoffResult }
    | { type: 'error'; message: string };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });

    // Parse URL hash to determine what to show
    const parseHash = useCallback((): { pollId?: string; adminKey?: string } => {
        const hash = window.location.hash.slice(1); // Remove #
        const params = new URLSearchParams(hash);
        return {
            pollId: params.get('id') || undefined,
            adminKey: params.get('admin') || undefined
        };
    }, []);

    // Load appropriate view based on URL
    const loadView = useCallback(async () => {
        const { pollId, adminKey } = parseHash();

        // No poll ID = show create form
        if (!pollId) {
            setViewState({ type: 'create' });
            return;
        }

        setViewState({ type: 'loading' });

        try {
            if (adminKey) {
                // Admin view
                const poll = await getPollAsAdmin(pollId, adminKey);
                
                // Fetch results if there are votes
                let runoffResult: RunoffResult | undefined;
                if (poll.voteCount > 0) {
                    try {
                        runoffResult = await getResults(pollId, adminKey);
                    } catch (e) {
                        console.error('Failed to fetch results:', e);
                    }
                }
                
                setViewState({ type: 'admin', poll, runoffResult });
            } else {
                // Voter view
                const poll = await getPoll(pollId);
                
                // Check if already voted
                if (hasVoted(pollId)) {
                    // Show confirmation/results
                    if (!poll.settings.hideResults) {
                        try {
                            const runoffResult = await getResults(pollId);
                            setViewState({ type: 'results', poll, runoffResult });
                        } catch {
                            setViewState({ type: 'confirmation', poll });
                        }
                    } else {
                        setViewState({ type: 'confirmation', poll });
                    }
                } else {
                    // Show voting interface
                    setViewState({ type: 'vote', poll });
                }
            }
        } catch (error) {
            console.error('Failed to load poll:', error);
            setViewState({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Failed to load poll'
            });
        }
    }, [parseHash]);

    // Initial load and hash change listener
    useEffect(() => {
        loadView();
        
        const handleHashChange = () => loadView();
        window.addEventListener('hashchange', handleHashChange);
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [loadView]);

    // Handler for after successful vote
    const handleVoteSuccess = async () => {
        const { pollId } = parseHash();
        if (!pollId) return;

        try {
            const poll = await getPoll(pollId);
            
            if (!poll.settings.hideResults) {
                try {
                    const runoffResult = await getResults(pollId);
                    setViewState({ type: 'results', poll, runoffResult });
                } catch {
                    setViewState({ type: 'confirmation', poll });
                }
            } else {
                setViewState({ type: 'confirmation', poll });
            }
        } catch {
            setViewState({ type: 'confirmation', poll: viewState.type === 'vote' ? viewState.poll : {} as Poll });
        }
    };

    // Handler for viewing results from confirmation
    const handleViewResults = async () => {
        if (viewState.type !== 'confirmation') return;
        
        const { pollId } = parseHash();
        if (!pollId) return;

        try {
            const runoffResult = await getResults(pollId);
            setViewState({ type: 'results', poll: viewState.poll, runoffResult });
        } catch (error) {
            console.error('Failed to fetch results:', error);
        }
    };

    // Handler for admin refresh
    const handleAdminRefresh = async () => {
        const { pollId, adminKey } = parseHash();
        if (!pollId || !adminKey) return;

        try {
            const poll = await getPollAsAdmin(pollId, adminKey);
            let runoffResult: RunoffResult | undefined;
            
            if (poll.voteCount > 0) {
                try {
                    runoffResult = await getResults(pollId, adminKey);
                } catch (e) {
                    console.error('Failed to fetch results:', e);
                }
            }
            
            setViewState({ type: 'admin', poll, runoffResult });
        } catch (error) {
            console.error('Failed to refresh:', error);
        }
    };

    // Navigate home
    const goHome = () => {
        window.location.hash = '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            {/* Simple Header for non-create views */}
            {viewState.type !== 'create' && viewState.type !== 'loading' && (
                <header className="p-4 flex items-center justify-between max-w-3xl mx-auto">
                    <button 
                        onClick={goHome}
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                        <Home size={18} />
                        <span className="hidden sm:inline">VoteGenerator</span>
                    </button>
                </header>
            )}

            {/* Main Content */}
            <main className="py-8 md:py-12">
                <AnimatePresence mode="wait">
                    {viewState.type === 'loading' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                            <p className="text-slate-500">Loading poll...</p>
                        </motion.div>
                    )}

                    {viewState.type === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <VoteGeneratorCreate />
                        </motion.div>
                    )}

                    {viewState.type === 'vote' && (
                        <motion.div
                            key="vote"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <VoteGeneratorVote 
                                poll={viewState.poll} 
                                onVoteSuccess={handleVoteSuccess}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'confirmation' && (
                        <motion.div
                            key="confirmation"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <VoteGeneratorConfirmation
                                poll={viewState.poll}
                                canSeeResults={!viewState.poll.settings.hideResults}
                                onViewResults={handleViewResults}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <VoteGeneratorResults
                                runoffResult={viewState.runoffResult}
                                pollTitle={viewState.poll.title}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'admin' && (
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <VoteGeneratorAdmin
                                poll={viewState.poll}
                                runoffResult={viewState.runoffResult}
                                onRefresh={handleAdminRefresh}
                            />
                        </motion.div>
                    )}

                    {viewState.type === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-md mx-auto text-center py-20 px-4"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-red-500" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
                            <p className="text-slate-500 mb-6">{viewState.message}</p>
                            <button
                                onClick={goHome}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Create a New Poll
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-400 text-sm">
                <p>
                    Made with ❤️ • Free forever • No signup required
                </p>
            </footer>
        </div>
    );
};

export default VoteGeneratorApp;

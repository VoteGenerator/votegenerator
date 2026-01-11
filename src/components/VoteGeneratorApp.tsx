import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, RefreshCw, ArrowRight, RotateCcw, LayoutDashboard, Zap, Crown, PlusCircle, Share2, Check } from 'lucide-react';
import LandingPage from './LandingPage';
import CreatePage from './CreatePage';
import AdWall from './AdWall';
import CheckoutSuccess from './CheckoutSuccess';
import TemplatesPage from './TemplatesPage';
import PricingPage from './PricingPage';
import YouTubeCreatorsPage from './YouTubeCreatorsPage';
import TwitchStreamersPage from './TwitchStreamersPage';
import AdminDashboard from './AdminDashboard';
import UpgradeModal from './UpgradeModal';
import { Skeleton } from './AnimatedComponents';
import { SkipLink, LiveRegion } from './AccessibilityUtils';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorEdit from './VoteGeneratorEdit';
import VoterAdWall from './VoterAdWall';
import PollDashboard from './PollDashboard';
import RedditCommunityPage from './RedditCommunityPage';
// NEW: Path-based survey pages
import SurveyPage from '../pages/SurveyPage';
import EmployeeSurveyPage from '../pages/EmployeeSurveyPage';
import CustomerFeedbackPage from '../pages/CustomerFeedbackPage';
import ContactPage from './ContactPage';
import BlogIndex from './blog/BlogIndex';
import BlogPostAnonymousSurvey from './blog/BlogPostAnonymousSurvey';
import BlogPost50Questions from './blog/BlogPost50Questions';
import { getPoll, getPollAsAdmin, getResults, hasVoted } from '../services/voteGeneratorService';
import { Poll, RunoffResult } from '../types';

type ViewState = 
    | { type: 'create' }
    | { type: 'loading' }
    | { type: 'ad-wall-before'; poll: Poll }
    | { type: 'vote'; poll: Poll }
    | { type: 'ad-wall-after'; poll: Poll }
    | { type: 'results'; poll: Poll; results: RunoffResult; isAdmin?: boolean }
    | { type: 'edit'; poll: Poll; isAdmin: boolean }
    | { type: 'error'; message: string };

const VoteGeneratorApp: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>({ type: 'loading' });
    const [copiedShare, setCopiedShare] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
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

    // Helper: Check if poll should show voter ad-wall (free tier, non-admin)
    const shouldShowVoterAdWall = (poll: Poll, isAdmin: boolean): boolean => {
        const pollTier = (poll as any).tier || 'free';
        return pollTier === 'free' && !isAdmin;
    };

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
                // User hasn't voted yet - check if we need to show ad-wall first
                const adWallShown = localStorage.getItem(`vg_adwall_before_${pollId}`);
                
                if (shouldShowVoterAdWall(poll, isAdmin) && !adWallShown) {
                    // Show ad-wall before poll for free tier
                    setViewState({ type: 'ad-wall-before', poll });
                } else {
                    setViewState({ type: 'vote', poll });
                }
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
        const { pollId, adminKey } = parseHash();
        if(!pollId) return;
        
        // Check for Business tier redirect URL
        if (viewState.type === 'vote' && viewState.poll) {
            const redirectUrl = (viewState.poll as any).settings?.redirectUrl;
            if (redirectUrl) {
                // Redirect to custom thank you page (Business feature)
                window.location.href = redirectUrl;
                return;
            }
            
            // If results are hidden, don't show ad-wall - go straight to thank you message
            if (viewState.poll.settings.hideResults) {
                setViewState({ type: 'error', message: "Thanks for voting! Results are hidden by the organizer." });
                return;
            }
            
            // Check if we need to show ad-wall after voting (free tier only)
            const isAdmin = !!adminKey;
            if (shouldShowVoterAdWall(viewState.poll, isAdmin)) {
                setViewState({ type: 'ad-wall-after', poll: viewState.poll });
                return;
            }
        }
        
        // Reload to switch to results view
        loadView(); 
    };

    // Handler for completing ad-wall before poll
    const handleAdWallBeforeComplete = () => {
        if (viewState.type === 'ad-wall-before') {
            const { pollId } = parseHash();
            if (pollId) {
                // Mark that user has seen the before-poll ad-wall for this poll
                localStorage.setItem(`vg_adwall_before_${pollId}`, 'true');
            }
            setViewState({ type: 'vote', poll: viewState.poll });
        }
    };

    // Handler for completing ad-wall after voting
    const handleAdWallAfterComplete = async () => {
        if (viewState.type === 'ad-wall-after') {
            const { pollId, adminKey } = parseHash();
            if (pollId) {
                try {
                    const results = await getResults(pollId, adminKey || undefined);
                    setViewState({ type: 'results', poll: viewState.poll, results, isAdmin: !!adminKey });
                } catch (error) {
                    loadView();
                }
            }
        }
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
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
            ) : window.location.pathname === '/reddit-polls' || window.location.pathname === '/reddit' ? (
                <RedditCommunityPage />    
            ) : window.location.pathname === '/survey' ? (
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
                        
                        {/* Nav Links for Admin - Only show if user has this poll in their localStorage */}
                        {viewState.type === 'results' && viewState.isAdmin && (() => {
                            // Check if this poll exists in user's localStorage (meaning they're the actual owner)
                            const userPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
                            const isActualOwner = userPolls.some((p: any) => p.id === viewState.poll.id);
                            
                            return (
                                <nav className="hidden md:flex items-center gap-1">
                                    <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                        <PlusCircle size={16} /> Create Poll
                                    </a>
                                    {/* Only show My Dashboard if they actually own polls */}
                                    {isActualOwner && (
                                        <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                            <LayoutDashboard size={16} /> My Dashboard
                                        </a>
                                    )}
                                    <a href="/templates" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                        <Zap size={16} /> Templates
                                    </a>
                                    <a href="/pricing" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                        <Crown size={16} /> Pricing
                                    </a>
                                </nav>
                            );
                        })()}
                        
                        <div className="flex items-center gap-2">
                             {/* Only show share button if viewing results (not while voting) */}
                             {viewState.type === 'results' && !viewState.isAdmin && (
                                <button
                                    onClick={() => copyToClipboard(getShareUrl())}
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

                    {/* Ad-Wall Before Poll - FREE tier voters only */}
                    {viewState.type === 'ad-wall-before' && (
                        <motion.div 
                            key="ad-wall-before" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                        >
                            <VoterAdWall
                                variant="before-poll"
                                pollTitle={viewState.poll.title}
                                onComplete={handleAdWallBeforeComplete}
                                countdownSeconds={10}
                            />
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
                                            <img 
                                                src="/logo.svg" 
                                                alt="" 
                                                className="w-4 h-4" 
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                            Powered by <span className="font-semibold">VoteGenerator</span>
                                        </a>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    )}

                    {/* Ad-Wall After Vote - FREE tier voters only */}
                    {viewState.type === 'ad-wall-after' && (
                        <motion.div 
                            key="ad-wall-after" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                        >
                            <VoterAdWall
                                variant="after-vote"
                                pollTitle={viewState.poll.title}
                                onComplete={handleAdWallAfterComplete}
                                countdownSeconds={10}
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
                            {/* Accessibility: Skip Link */}
                            <SkipLink targetId="poll-results" />
                            
                            {/* Accessibility: Live Region for vote count announcements */}
                            <LiveRegion>
                                {viewState.results.totalVotes} votes collected for {viewState.poll.title}
                            </LiveRegion>
                            
                            {/* ADMIN VIEW - Full Poll Dashboard */}
                            {viewState.isAdmin && (
                                <PollDashboard
                                    poll={viewState.poll}
                                    results={viewState.results}
                                    adminKey={(() => {
                                        const hash = window.location.hash.slice(1);
                                        const params = new URLSearchParams(hash);
                                        return params.get('admin') || '';
                                    })()}
                                    onEdit={handleEditPoll}
                                    onRefresh={() => loadView(true)}
                                    isRefreshing={isRefreshing}
                                />
                            )}

                            {/* NON-ADMIN VIEW - Simple Results Display */}
                            {!viewState.isAdmin && (
                                <div className="max-w-4xl mx-auto px-4 py-8">
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

                                    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 text-center">
                                            {viewState.poll.title}
                                        </h1>
                                        {viewState.poll.description && (
                                            <p className="text-slate-500 text-center mb-8 max-w-2xl mx-auto">
                                                {viewState.poll.description}
                                            </p>
                                        )}
                                        
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
                                            <div className="mt-10 text-center print:hidden">
                                                <a 
                                                    href="/"
                                                    className="text-slate-400 hover:text-indigo-600 font-medium transition-colors inline-flex items-center gap-1"
                                                >
                                                    Create your own poll <ArrowRight size={14}/>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    
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
                                                    <img 
                                                        src="/logo.svg" 
                                                        alt="" 
                                                        className="w-4 h-4"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                    Powered by <span className="font-semibold">VoteGenerator</span>
                                                </a>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
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
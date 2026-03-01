import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Check, GripVertical, ArrowRight, Loader2, User, Clock, Lock, Key, MessageSquare, Plus, Minus, Coins, Calendar, HelpCircle, AlertTriangle, DollarSign, ZoomIn, X } from 'lucide-react';
import { Poll, PollOption, SurveyResponse } from '../types';
import { submitVote, hasVoted } from '../services/voteGeneratorService';
import SurveyVote from './SurveyVote';
import { THEMES, ThemeConfig } from './ThemeSelector';
import { Analytics } from '../utils/analytics';

// Anti-bot fields interface
interface AntiBotFields {
    _hp: string;
    _t: number;
}

interface Props {
    poll: Poll;
    onVoteSuccess: () => void;
}

// Get theme config from theme ID
const getThemeConfig = (themeId?: string): ThemeConfig => {
    if (!themeId) return THEMES[0]; // Default classic theme
    return THEMES.find((t: ThemeConfig) => t.id === themeId) || THEMES[0];
};

// Generate CSS classes for special effects
const getSpecialEffectClasses = (effect?: string): string => {
    switch (effect) {
        case 'glow':
            return 'shadow-2xl shadow-blue-500/20';
        case 'shimmer':
            return 'relative overflow-hidden';
        case 'glass':
            return 'backdrop-blur-xl bg-opacity-80';
        case 'shadow-lg':
            return 'shadow-2xl';
        case 'gradient-border':
            return 'ring-2 ring-offset-2';
        default:
            return '';
    }
};

const VoteGeneratorVote: React.FC<Props> = ({ poll, onVoteSuccess }) => {
    // Get theme configuration
    const theme = useMemo(() => {
        const themeId = poll.theme || 'default';
        console.log('VoteGeneratorVote: Poll theme ID:', themeId, 'Poll data:', { theme: poll.theme, id: poll.id });
        return getThemeConfig(themeId);
    }, [poll.theme, poll.id]);
    const isPremiumTheme = theme.isPremium || false;
    
    // Debug: log theme config
    useEffect(() => {
        console.log('VoteGeneratorVote: Active theme:', theme.id, theme.name, 'isPremium:', isPremiumTheme);
    }, [theme]);
    
    const shuffle = <T,>(array: T[]): T[] => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const [items, setItems] = useState<PollOption[]>(() => {
        if (poll.pollType === 'ranked') {
            return shuffle(poll.options);
        }
        return poll.options;
    });
    
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [maybeIds, setMaybeIds] = useState<Set<string>>(new Set());
    const [dotAllocations, setDotAllocations] = useState<Record<string, number>>({});
    const [budgetAllocations, setBudgetAllocations] = useState<Record<string, number>>({});
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [ratingAllocations, setRatingAllocations] = useState<Record<string, number>>(() => {
        if (poll.pollType === 'rating') {
            const defaults: Record<string, number> = {};
            poll.options.forEach(opt => defaults[opt.id] = 0); // Start with no rating selected
            return defaults;
        }
        return {};
    });

    const [matrixPositions, setMatrixPositions] = useState<Record<string, { x: number, y: number }>>({});
    const matrixContainerRef = useRef<HTMLDivElement>(null);

    interface Pair { left: PollOption; right: PollOption }
    const [pairwiseQueue, setPairwiseQueue] = useState<Pair[]>([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [pairwiseVotes, setPairwiseVotes] = useState<{ winnerId: string; loserId: string }[]>([]);
    const [pairwiseDone, setPairwiseDone] = useState(false);

    const [voterName, setVoterName] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Anti-bot protection
    const pageLoadTime = useRef(Date.now());
    const [honeypotValue, setHoneypotValue] = useState('');

    useEffect(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const codeParam = params.get('code');
        if (codeParam) {
            setAccessCode(codeParam);
        }
    }, []);

    useEffect(() => {
        if (poll.pollType === 'pairwise' && pairwiseQueue.length === 0) {
            const pairs: Pair[] = [];
            for (let i = 0; i < poll.options.length; i++) {
                for (let j = i + 1; j < poll.options.length; j++) {
                    pairs.push({ left: poll.options[i], right: poll.options[j] });
                }
            }
            const shuffledPairs = shuffle(pairs);
            const limitedPairs = shuffledPairs.slice(0, 20);
            setPairwiseQueue(limitedPairs);
        }
    }, [poll.pollType, poll.options, pairwiseQueue.length]);

    const isDeadlineExpired = poll.settings.deadline && new Date() > new Date(poll.settings.deadline);
    const isMaxVotesReached = poll.settings.maxVotes && poll.voteCount >= poll.settings.maxVotes;
    const isClosed = isDeadlineExpired || isMaxVotesReached;
    const alreadyVotedBrowser = poll.settings.security === 'browser' && hasVoted(poll.id);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isDifferentTimezone = poll.settings.timezone && poll.settings.timezone !== userTimezone;

    const checkVpnLikelihood = (): boolean => {
        if (!poll.settings.blockVpn) return false;
        const isHeadless = navigator.webdriver;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isGenericTimezone = timezone === 'UTC' || timezone === 'Etc/GMT';
        return !!isHeadless || isGenericTimezone;
    };

    const getDotTotal = () => Object.values(dotAllocations).reduce((a, b) => a + b, 0);
    const dotBudget = poll.settings.dotBudget || 10;
    const dotsRemaining = dotBudget - getDotTotal();

    const getBudgetSpent = () => {
        return Object.entries(budgetAllocations).reduce((total, [id, qty]) => {
            const option = poll.options.find(o => o.id === id);
            return total + (qty * (option?.cost || 0));
        }, 0);
    };
    const budgetLimit = poll.settings.budgetLimit || 100;
    const budgetSpent = getBudgetSpent();
    const budgetRemaining = budgetLimit - budgetSpent;

    const handleDotChange = (id: string, delta: number) => {
        const current = dotAllocations[id] || 0;
        if (delta > 0 && dotsRemaining <= 0) return; 
        if (delta < 0 && current <= 0) return; 
        setDotAllocations({ ...dotAllocations, [id]: current + delta });
    };

    const handleBudgetChange = (id: string, delta: number) => {
        const option = poll.options.find(o => o.id === id);
        const cost = option?.cost || 0;
        const currentQty = budgetAllocations[id] || 0;

        if (delta > 0) {
            if (budgetRemaining < cost) return; 
        }
        if (delta < 0 && currentQty <= 0) return;

        setBudgetAllocations({ ...budgetAllocations, [id]: currentQty + delta });
    };

    const handleRatingChange = (id: string, val: number) => {
        setRatingAllocations(prev => ({ ...prev, [id]: val }));
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            // For image polls with single selection (like multiple choice)
            if (!poll.settings.allowMultiple && (poll.pollType !== 'meeting')) {
                newSet.clear();
            }
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleMeetingSelection = (id: string) => {
        if (selectedIds.has(id)) {
            const newSel = new Set(selectedIds);
            newSel.delete(id);
            setSelectedIds(newSel);
            
            const newMaybe = new Set(maybeIds);
            newMaybe.add(id);
            setMaybeIds(newMaybe);
        } else if (maybeIds.has(id)) {
            const newMaybe = new Set(maybeIds);
            newMaybe.delete(id);
            setMaybeIds(newMaybe);
        } else {
            const newSel = new Set(selectedIds);
            newSel.add(id);
            setSelectedIds(newSel);
        }
    };

    const handleMatrixDragEnd = (id: string, info: any) => {
        if (!matrixContainerRef.current) return;
        const rect = matrixContainerRef.current.getBoundingClientRect();
        const pointX = info.point.x - rect.left;
        const pointY = info.point.y - rect.top;
        const xPercent = Math.min(100, Math.max(0, (pointX / rect.width) * 100));
        const yPercent = Math.min(100, Math.max(0, (pointY / rect.height) * 100));
        const cartesianY = 100 - yPercent;
        setMatrixPositions(prev => ({ ...prev, [id]: { x: xPercent, y: cartesianY } }));
    };

    const handlePairwiseVote = (winner: PollOption, loser: PollOption) => {
        setPairwiseVotes(prev => [...prev, { winnerId: winner.id, loserId: loser.id }]);
        if (currentPairIndex < pairwiseQueue.length - 1) {
            setCurrentPairIndex(prev => prev + 1);
        } else {
            setPairwiseDone(true);
        }
    };

    const isMatrixPlaced = (id: string) => !!matrixPositions[id];

    const handleSubmit = async () => {
        setErrorMessage(null);
        if (checkVpnLikelihood()) {
            setErrorMessage("Vote blocked: VPN or Proxy detected. Please disable it to vote.");
            return;
        }
        setIsSubmitting(true);
        try {
            let choices: string[] = [];
            let choicesMaybe: string[] = [];

            if (poll.pollType === 'ranked') {
                choices = items.map(i => i.id);
            } else if (poll.pollType === 'dot') {
                choices = Object.entries(dotAllocations).flatMap(([id, count]) => Array(count).fill(id));
            } else if (poll.pollType === 'budget') {
                choices = Object.entries(budgetAllocations).flatMap(([id, count]) => Array(count).fill(id));
            } else if (poll.pollType === 'matrix') {
                choices = Object.keys(matrixPositions);
            } else if (poll.pollType === 'pairwise') {
                choices = [];
            } else if (poll.pollType === 'rating') {
                choices = [];
            } else {
                // multiple, meeting, image all use selectedIds
                choices = Array.from(selectedIds);
                if (poll.pollType === 'meeting') {
                    choicesMaybe = Array.from(maybeIds);
                }
            }
            
            // Anti-bot fields
            const antiBotFields: AntiBotFields = {
                _hp: honeypotValue,
                _t: pageLoadTime.current
            };
            
            await submitVote(
                poll.id, 
                choices, 
                voterName.trim() || undefined,
                accessCode.trim() || undefined,
                comment.trim() || undefined,
                choicesMaybe.length > 0 ? choicesMaybe : undefined,
                poll.pollType === 'matrix' ? matrixPositions : undefined,
                poll.pollType === 'pairwise' ? pairwiseVotes : undefined,
                poll.pollType === 'rating' ? ratingAllocations : undefined,
                undefined, // surveyAnswers
                antiBotFields // anti-bot protection
            );
            
            // Track vote submission
            Analytics.voteSubmitted(poll.id, poll.pollType);
            
            onVoteSuccess();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setErrorMessage(error instanceof Error ? error.message : "Failed to submit vote");
        }
    };

    let canSubmit = false;
    if (poll.pollType === 'ranked') canSubmit = true;
    else if (poll.pollType === 'rating') canSubmit = Object.values(ratingAllocations).some(v => v > 0);
    else if (poll.pollType === 'dot') canSubmit = getDotTotal() > 0;
    else if (poll.pollType === 'budget') canSubmit = getBudgetSpent() > 0;
    else if (poll.pollType === 'matrix') canSubmit = Object.keys(matrixPositions).length === poll.options.length;
    else if (poll.pollType === 'pairwise') canSubmit = pairwiseDone;
    else canSubmit = selectedIds.size > 0 || maybeIds.size > 0; // multiple, meeting, image

    if (poll.settings.requireNames && voterName.trim().length === 0) canSubmit = false;
    if (poll.settings.security === 'code' && accessCode.trim().length === 0) canSubmit = false;
    if (poll.settings.security === 'pin' && accessCode.trim().length < 4) canSubmit = false;

    if (isClosed) {
        return (
            <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-slate-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Poll Closed</h1>
                {isDeadlineExpired && (
                    <p className="text-slate-500 mb-8">This poll ended on {new Date(poll.settings.deadline!).toLocaleString()}.</p>
                )}
                <button onClick={onVoteSuccess} className="text-indigo-600 font-bold hover:underline">View Results</button>
            </div>
        );
    }

    // Check if poll is in draft mode
    if ((poll as any).status === 'draft') {
        return (
            <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} className="text-amber-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Coming Soon!</h1>
                <p className="text-slate-500 mb-4">
                    This poll is being set up by the organizer and isn't open for voting yet.
                </p>
                <p className="text-sm text-slate-400">
                    Check back later or contact the poll creator for more information.
                </p>
            </div>
        );
    }

    // =========================================================================
    // SURVEY MODE - Multi-section forms
    // =========================================================================
    if ((poll as any).isSurvey && (poll as any).sections?.length > 0) {
        const handleSurveySubmit = async (response: SurveyResponse) => {
            setIsSubmitting(true);
            setErrorMessage(null);
            
            try {
                // Anti-bot fields
                const antiBotFields: AntiBotFields = {
                    _hp: honeypotValue,
                    _t: pageLoadTime.current
                };
                
                // Submit survey response using the vote service
                await submitVote(
                    poll.id,
                    [], // Empty choices for surveys
                    response.voterName || voterName || undefined,
                    accessCode || undefined,
                    undefined, // comment
                    undefined, // choicesMaybe
                    undefined, // matrixVotes
                    undefined, // pairwiseVotes
                    undefined, // ratingVotes
                    response.answers, // surveyAnswers
                    antiBotFields, // anti-bot protection
                    { startedAt: response.startedAt, completionTime: response.completionTime } // survey timing
                );
                
                // Track survey completion
                Analytics.surveyCompleted(poll.id, response.answers?.length || 0);
                
                // Mark as voted in localStorage
                const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}');
                votedPolls[poll.id] = {
                    votedAt: new Date().toISOString(),
                    isSurvey: true,
                };
                localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
                
                onVoteSuccess();
            } catch (err: any) {
                setErrorMessage(err.message || 'Failed to submit survey');
                setIsSubmitting(false);
            }
        };
        
        return (
            <div className="max-w-2xl mx-auto px-4 pb-20 pt-10">
                {/* Logo if present */}
                {(poll as any).logoUrl && (
                    <div className="mb-6 flex justify-center">
                        <img 
                            src={(poll as any).logoUrl} 
                            alt="Poll logo" 
                            className="max-h-16 max-w-48 object-contain"
                        />
                    </div>
                )}
                
                {/* Error message - special styling for limit, paused, and rate limit errors */}
                {errorMessage && (
                    errorMessage.toLowerCase().includes('slow down') || errorMessage.toLowerCase().includes('rate') ? (
                        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-blue-800 mb-1">Please Wait a Moment</p>
                                    <p className="text-sm text-blue-700">{errorMessage}</p>
                                    <p className="text-xs text-blue-500 mt-2">This helps us prevent spam and keep polls fair for everyone.</p>
                                </div>
                            </div>
                        </div>
                    ) : errorMessage.toLowerCase().includes('limit') || errorMessage.toLowerCase().includes('paused') ? (
                        <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle size={20} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-orange-800 mb-1">
                                        {errorMessage.toLowerCase().includes('paused') ? 'Poll Paused' : 'Response Limit Reached'}
                                    </p>
                                    <p className="text-sm text-orange-700">{errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                            <AlertTriangle size={18} />
                            {errorMessage}
                        </div>
                    )
                )}
                
                {/* Voter name if required */}
                {poll.settings.requireNames && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <User size={16} /> Your Name *
                        </label>
                        <input
                            type="text"
                            value={voterName}
                            onChange={(e) => setVoterName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                )}
                
                {/* Access code if required */}
                {(poll.settings.security === 'code' || poll.settings.security === 'pin') && (
                    <div className="mb-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Key size={16} /> {poll.settings.security === 'pin' ? 'Enter PIN' : 'Access Code'} *
                        </label>
                        <input
                            type={poll.settings.security === 'pin' ? 'password' : 'text'}
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            placeholder={poll.settings.security === 'pin' ? '••••' : 'Enter code'}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                )}
                
                <SurveyVote
                    poll={poll}
                    onSubmit={handleSurveySubmit}
                    voterName={voterName}
                />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.pageBg || ''}`}>
            <div className="max-w-2xl mx-auto px-4 pb-20 pt-10">
            {/* Shimmer effect overlay for premium themes */}
            {theme.specialEffect === 'shimmer' && (
                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .shimmer-effect::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                        background-size: 200% 100%;
                        animation: shimmer 3s infinite;
                        pointer-events: none;
                        z-index: 1;
                    }
                `}</style>
            )}
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-3xl shadow-xl overflow-hidden relative ${
                    theme.specialEffect === 'shimmer' ? 'shimmer-effect' : ''
                } ${getSpecialEffectClasses(theme.specialEffect)} ${
                    theme.cardBg || 'bg-white'
                } ${theme.cardBorder ? `border-2 ${theme.cardBorder}` : 'border border-slate-100'}`}
                style={theme.specialEffect === 'glow' ? {
                    boxShadow: `0 0 40px ${theme.primary}30, 0 0 80px ${theme.primary}15`
                } : undefined}
            >
                {/* Header with theme styling */}
                <div className={`p-6 md:p-8 border-b relative ${
                    theme.headerStyle || 'bg-slate-50 border-slate-100'
                } ${theme.id === 'midnight' || theme.id === 'neon' ? 'text-white' : ''}`}>
                    {poll.pollType === 'budget' && (
                        <div className="absolute top-0 right-0 left-0 bg-green-50 p-2 text-center text-xs sm:text-sm font-bold text-green-800 border-b border-green-100 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            <span>Budget: <span className="text-green-600">${budgetLimit}</span></span>
                            <span className="hidden sm:inline">|</span>
                            <span>Spent: <span className="text-red-500">${budgetSpent}</span></span>
                            <span className="hidden sm:inline">|</span>
                            <span>Left: <span className="text-emerald-600 inline-flex items-center"><DollarSign size={12}/>{budgetRemaining}</span></span>
                        </div>
                    )}
                    {/* Logo if present */}
                    {(poll as any).logoUrl && (
                        <div className="mb-4 flex justify-center">
                            <img 
                                src={(poll as any).logoUrl} 
                                alt="Poll logo" 
                                className="max-h-16 max-w-48 object-contain"
                            />
                        </div>
                    )}
                    <h1 className={`text-2xl md:text-3xl font-black font-serif mb-2 ${poll.pollType === 'budget' ? 'pt-6' : ''} ${
                        theme.headerStyle ? '' : 'text-slate-800'
                    }`}>
                        {poll.title}
                    </h1>
                    {poll.description && (
                        <p className={`leading-relaxed ${theme.headerStyle ? 'opacity-90' : 'text-slate-600'}`}>{poll.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                        <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full w-fit ${
                            theme.headerStyle 
                                ? 'bg-white/20 text-white' 
                                : 'text-indigo-600 bg-indigo-50'
                        }`} style={!theme.headerStyle ? { backgroundColor: `${theme.primary}15`, color: theme.primary } : undefined}>
                            {poll.pollType === 'image' && "Click image to select"}
                            {poll.pollType === 'ranked' && "Drag to Rank Options"}
                            {poll.pollType === 'multiple' && (poll.settings.allowMultiple ? "Select Options" : "Select One")}
                            {poll.pollType === 'meeting' && "Select Available Times"}
                            {poll.pollType === 'dot' && "Distribute Points"}
                            {poll.pollType === 'budget' && "Buy Features"}
                            {poll.pollType === 'matrix' && "Drag to Grid"}
                            {poll.pollType === 'pairwise' && "This or That"}
                            {poll.pollType === 'rating' && "Rate Options"}
                        </div>

                        {poll.settings.deadline && (
                            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full w-fit ${
                                theme.headerStyle ? 'bg-white/20 text-white' : 'text-amber-600 bg-amber-50'
                            }`}>
                                <Clock size={14} /> Ends: {new Date(poll.settings.deadline).toLocaleDateString()}
                            </div>
                        )}
                        
                        {poll.pollType === 'dot' && (
                            <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full w-fit border transition-colors ${
                                dotsRemaining === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-indigo-200 text-indigo-600 shadow-sm'
                            }`}>
                                <Coins size={14} /> {dotsRemaining} Points Left
                            </div>
                        )}

                        {isDifferentTimezone && poll.pollType === 'meeting' && (
                            <div className="mt-2 w-full p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <span>
                                    <strong>Timezone Mismatch:</strong> The poll times are shown in {poll.settings.timezone}, but you are in {userTimezone}. Please adjust accordingly.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* VISUAL IMAGE POLL GRID */}
                    {poll.pollType === 'image' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {poll.options.map((opt) => {
                                const isSelected = selectedIds.has(opt.id);
                                return (
                                    <div key={opt.id} className="relative group">
                                        <div 
                                            onClick={() => toggleSelection(opt.id)}
                                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-4 ${
                                                isSelected ? 'border-pink-500 shadow-lg scale-[1.02]' : 'border-transparent hover:scale-[1.01]'
                                            }`}
                                        >
                                            <img src={opt.imageUrl} alt={opt.text} className="w-full h-full object-cover" />
                                            
                                            {/* Selection Overlay */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center backdrop-blur-[1px]">
                                                    <div className="bg-pink-500 text-white p-2 rounded-full shadow-md">
                                                        <Check size={32} strokeWidth={4} />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Zoom Button */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setLightboxImage(opt.imageUrl || ''); }}
                                                className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                            >
                                                <ZoomIn size={16} />
                                            </button>
                                        </div>
                                        <div className="mt-2 text-center font-bold text-slate-700 text-sm leading-tight">{opt.text}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* RANKED CHOICE */}
                    {poll.pollType === 'ranked' && (
                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                            {items.map((item, index) => (
                                <Reorder.Item key={item.id} value={item} className="relative z-0">
                                    <div className={`flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all cursor-grab active:cursor-grabbing group select-none border-2 ${
                                        theme.optionStyle || 'bg-white border-slate-100 hover:border-indigo-300'
                                    } ${theme.cardBg?.includes('slate-9') ? 'bg-slate-800/50 border-slate-600 hover:border-blue-400' : ''}`}>
                                        <div 
                                            className={`flex flex-col items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ml-2 ${
                                                theme.cardBg?.includes('slate-9') 
                                                    ? 'bg-slate-700 text-slate-300 group-hover:bg-blue-500/30 group-hover:text-blue-300' 
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                            }`}
                                            style={!theme.cardBg?.includes('slate-9') ? {
                                                backgroundColor: `${theme.primary}10`,
                                            } : undefined}
                                        >
                                            {index + 1}
                                        </div>
                                        <span className={`flex-1 font-medium text-lg ${
                                            theme.cardBg?.includes('slate-9') ? 'text-white' : 'text-slate-800'
                                        }`}>{item.text}</span>
                                        <GripVertical className={theme.cardBg?.includes('slate-9') ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-300 group-hover:text-indigo-400'} />
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}

                    {/* PAIRWISE */}
                    {poll.pollType === 'pairwise' && (
                        <div className="space-y-6">
                            {!pairwiseDone ? (
                                <div className="max-w-md mx-auto">
                                    <div className="mb-4 text-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Match {currentPairIndex + 1} of {pairwiseQueue.length}</span>
                                        <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                            <motion.div className="h-full bg-orange-500" initial={{ width: 0 }} animate={{ width: `${((currentPairIndex) / pairwiseQueue.length) * 100}%` }} />
                                        </div>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div key={currentPairIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid gap-3 sm:gap-4">
                                            {pairwiseQueue[currentPairIndex] && (
                                                <>
                                                    <button onClick={() => handlePairwiseVote(pairwiseQueue[currentPairIndex].left, pairwiseQueue[currentPairIndex].right)} className="p-4 sm:p-6 bg-white border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 rounded-xl sm:rounded-2xl shadow-sm transition-all group text-left">
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-slate-700 group-hover:text-orange-700">{pairwiseQueue[currentPairIndex].left.text}</span>
                                                    </button>
                                                    <div className="flex items-center justify-center text-slate-300 font-bold text-xs sm:text-sm uppercase"><div className="h-px bg-slate-200 w-8 sm:w-10 mr-2"></div>VS<div className="h-px bg-slate-200 w-8 sm:w-10 ml-2"></div></div>
                                                    <button onClick={() => handlePairwiseVote(pairwiseQueue[currentPairIndex].right, pairwiseQueue[currentPairIndex].left)} className="p-4 sm:p-6 bg-white border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 rounded-xl sm:rounded-2xl shadow-sm transition-all group text-left">
                                                        <span className="text-base sm:text-lg md:text-xl font-bold text-slate-700 group-hover:text-orange-700">{pairwiseQueue[currentPairIndex].right.text}</span>
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center py-8 sm:py-10">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="sm:w-10 sm:h-10" /></div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Complete!</h3>
                                    <p className="text-slate-500 text-sm sm:text-base">You've made all your comparisons.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MULTIPLE CHOICE & MEETING */}
                    {(poll.pollType === 'multiple' || poll.pollType === 'meeting') && (
                        <div className="space-y-3">
                            {poll.options.map((opt) => {
                                const isSelected = selectedIds.has(opt.id);
                                const isMaybe = maybeIds.has(opt.id);
                                const isMeeting = poll.pollType === 'meeting';
                                return (
                                    <button 
                                        key={opt.id} 
                                        onClick={() => isMeeting ? toggleMeetingSelection(opt.id) : toggleSelection(opt.id)} 
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group ${
                                            isSelected 
                                                ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                                                : isMaybe 
                                                    ? 'border-amber-400 bg-amber-50 shadow-sm' 
                                                    : theme.optionStyle || 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                        } ${theme.cardBg?.includes('slate-9') ? 'bg-slate-800/50' : ''}`}
                                        style={!isSelected && !isMaybe && !theme.optionStyle ? {
                                            borderColor: 'transparent',
                                        } : undefined}
                                    >
                                        <div 
                                            className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-all ${
                                                isSelected 
                                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                    : isMaybe 
                                                        ? 'bg-amber-400 border-amber-400 text-white' 
                                                        : theme.cardBg?.includes('slate-9') 
                                                            ? 'border-slate-500 bg-slate-700' 
                                                            : 'border-slate-300 bg-white'
                                            }`}
                                            style={!isSelected && !isMaybe && !theme.cardBg?.includes('slate-9') ? {
                                                borderColor: `${theme.primary}40`
                                            } : undefined}
                                        >
                                            {isSelected && <Check size={18} strokeWidth={3} />}
                                            {isMaybe && <HelpCircle size={18} strokeWidth={3} />}
                                        </div>
                                        <span className={`font-medium text-lg flex-1 ${
                                            isSelected 
                                                ? 'text-emerald-900' 
                                                : isMaybe 
                                                    ? 'text-amber-900' 
                                                    : theme.cardBg?.includes('slate-9') 
                                                        ? 'text-white' 
                                                        : 'text-slate-700'
                                        }`}>{opt.text}</span>
                                        {isMeeting && <Calendar size={20} className={isSelected ? 'text-emerald-400' : isMaybe ? 'text-amber-400' : theme.cardBg?.includes('slate-9') ? 'text-slate-400' : 'text-slate-300'} />}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* DOT VOTING */}
                    {poll.pollType === 'dot' && (
                        <div className="space-y-4">
                            {poll.options.map((opt) => {
                                const count = dotAllocations[opt.id] || 0;
                                return (
                                    <div key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${count > 0 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-white'}`}>
                                        <span className={`font-medium text-lg flex-1 ${count > 0 ? 'text-indigo-900' : 'text-slate-700'}`}>{opt.text}</span>
                                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                                            <button onClick={() => handleDotChange(opt.id, -1)} disabled={count === 0} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"><Minus size={16} /></button>
                                            <span className="w-6 text-center font-bold text-lg text-indigo-600">{count}</span>
                                            <button onClick={() => handleDotChange(opt.id, 1)} disabled={dotsRemaining === 0} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* BUDGET / BUY A FEATURE */}
                    {poll.pollType === 'budget' && (
                        <div className="space-y-4">
                            {poll.options.map((opt) => {
                                const count = budgetAllocations[opt.id] || 0;
                                const cost = opt.cost || 0;
                                const canAfford = budgetRemaining >= cost;
                                return (
                                    <div key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${count > 0 ? 'border-green-500 bg-green-50/30' : 'border-slate-100 bg-white'}`}>
                                        <div className="flex-1">
                                            <div className={`font-medium text-lg ${count > 0 ? 'text-green-900' : 'text-slate-700'}`}>{opt.text}</div>
                                            <div className="text-sm font-bold text-slate-400 mt-1">${cost} each</div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                                            <button onClick={() => handleBudgetChange(opt.id, -1)} disabled={count === 0} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"><Minus size={16} /></button>
                                            <span className="w-6 text-center font-bold text-lg text-green-600">{count}</span>
                                            <button onClick={() => handleBudgetChange(opt.id, 1)} disabled={!canAfford} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* RATING */}
                    {poll.pollType === 'rating' && (
                        <div className="space-y-6">
                            {poll.options.map((opt) => {
                                const val = ratingAllocations[opt.id] ?? 0;
                                const isDarkTheme = theme.cardBg?.includes('slate-9');
                                const ratingStyle = (poll as any).ratingStyle || 'stars';
                                
                                // Get the symbols for each rating style
                                const getRatingSymbol = (index: number, filled: boolean) => {
                                    switch (ratingStyle) {
                                        case 'stars':
                                            return filled ? '⭐' : '☆';
                                        case 'hearts':
                                            return filled ? '❤️' : '🤍';
                                        case 'thumbs':
                                            return filled ? '👍' : '👎';
                                        case 'emojis':
                                            return ['😢', '😕', '😐', '🙂', '😍'][index];
                                        case 'numbers':
                                        default:
                                            return String(index + 1);
                                    }
                                };
                                
                                return (
                                    <div key={opt.id} className={`p-4 rounded-xl border shadow-sm ${
                                        isDarkTheme 
                                            ? 'bg-slate-800/50 border-slate-600' 
                                            : theme.optionStyle 
                                                ? theme.optionStyle.split(' ')[0] 
                                                : 'bg-white border-slate-200'
                                    }`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>{opt.text}</span>
                                            {val > 0 && (
                                                <span 
                                                    className="text-sm font-bold px-3 py-1 rounded-full"
                                                    style={{ 
                                                        backgroundColor: `${theme.primary}15`,
                                                        color: isDarkTheme ? theme.accent : theme.primary 
                                                    }}
                                                >
                                                    {val}/5
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* 1-5 Rating Scale */}
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => handleRatingChange(opt.id, num)}
                                                    className={`
                                                        w-12 h-12 rounded-xl text-2xl transition-all duration-200
                                                        ${val >= num 
                                                            ? `scale-110 ${ratingStyle === 'numbers' ? 'bg-gradient-to-br text-white' : ''}`
                                                            : `${isDarkTheme ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`
                                                        }
                                                    `}
                                                    style={val >= num && ratingStyle === 'numbers' ? {
                                                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary})`
                                                    } : undefined}
                                                >
                                                    {ratingStyle === 'emojis' 
                                                        ? getRatingSymbol(num - 1, val >= num)
                                                        : (val >= num 
                                                            ? getRatingSymbol(num - 1, true) 
                                                            : getRatingSymbol(num - 1, false)
                                                          )
                                                    }
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Rating label */}
                                        {val > 0 && (
                                            <div className={`text-center mt-2 text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {val === 1 && 'Poor'}
                                                {val === 2 && 'Fair'}
                                                {val === 3 && 'Good'}
                                                {val === 4 && 'Very Good'}
                                                {val === 5 && 'Excellent'}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* MATRIX */}
                    {poll.pollType === 'matrix' && (
                        <div className="select-none">
                            <div className="mb-4 text-center text-sm text-slate-500">Drag all items from the list onto the grid based on Impact vs. Effort.</div>
                            <div className="relative aspect-square bg-slate-50 rounded-xl border-2 border-slate-200 mb-6 overflow-hidden" ref={matrixContainerRef}>
                                {/* Axis labels */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase">High Impact</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase">Low Impact</div>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase -rotate-90">Low Effort</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase rotate-90">High Effort</div>
                                
                                <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-slate-300"></div></div>
                                <div className="absolute inset-0 flex items-center justify-center"><div className="h-full w-px bg-slate-300"></div></div>
                                {poll.options.filter(o => isMatrixPlaced(o.id)).map(opt => {
                                    const pos = matrixPositions[opt.id];
                                    const domTop = 100 - pos.y;
                                    return (
                                        <motion.div key={opt.id} drag dragMomentum={false} dragConstraints={matrixContainerRef} onDragEnd={(_, info) => handleMatrixDragEnd(opt.id, info)} style={{ left: `${pos.x}%`, top: `${domTop}%` }} className="absolute -ml-4 -mt-4 w-8 h-8 bg-indigo-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center cursor-grab active:cursor-grabbing z-10 group">
                                            <span className="text-white font-bold text-xs pointer-events-none">{poll.options.findIndex(o => o.id === opt.id) + 1}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-4 rounded-xl border border-slate-200">
                                {poll.options.map((opt, i) => {
                                    if (isMatrixPlaced(opt.id)) return null;
                                    return (
                                        <motion.div key={opt.id} drag dragSnapToOrigin onDragEnd={(_, info) => handleMatrixDragEnd(opt.id, info)} className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 cursor-grab active:cursor-grabbing">
                                            <div className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                                            <span className="text-sm font-medium text-slate-700 truncate">{opt.text}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Meta Inputs */}
                    <div className="space-y-4 mt-8 pt-6 border-t border-slate-100">
                        {/* Single PIN access */}
                        {poll.settings.security === 'pin' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Poll PIN *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <input 
                                        type="text" 
                                        value={accessCode} 
                                        onChange={(e) => setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} 
                                        className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-mono text-center text-lg tracking-widest uppercase" 
                                        placeholder="ENTER PIN" 
                                        maxLength={10}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Enter the PIN shared by the organizer</p>
                            </div>
                        )}
                        {/* Unique access codes */}
                        {poll.settings.security === 'code' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Access Code *</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-mono" placeholder="Enter your unique code" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Enter the unique code you received</p>
                            </div>
                        )}
                        {poll.settings.requireNames && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <input type="text" value={voterName} onChange={(e) => setVoterName(e.target.value)} className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all" placeholder="Enter your name" />
                                </div>
                            </div>
                        )}
                        {poll.settings.allowComments && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Comment <span className="font-normal text-slate-400">(optional)</span></label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Add a comment..." rows={2} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Honeypot field - hidden from users, visible to bots */}
                    <div 
                        style={{ 
                            position: 'absolute', 
                            left: '-9999px', 
                            opacity: 0,
                            height: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none'
                        }}
                        aria-hidden="true"
                        tabIndex={-1}
                    >
                        <label htmlFor="website_url">Leave this empty</label>
                        <input
                            type="text"
                            id="website_url"
                            name="website_url"
                            autoComplete="off"
                            tabIndex={-1}
                            value={honeypotValue}
                            onChange={(e) => setHoneypotValue(e.target.value)}
                        />
                    </div>

                    {errorMessage && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 text-center">{errorMessage}</div>}

                    {alreadyVotedBrowser ? (
                        <div className="mt-8 p-4 bg-amber-50 text-amber-800 rounded-xl text-center border border-amber-200">
                            <strong>You have already voted.</strong><br/>
                            <div className="mt-2"><button onClick={onVoteSuccess} style={{ color: theme.primary }} className="underline text-sm font-bold">See Results</button></div>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting || !canSubmit} 
                            className={`w-full mt-8 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none ${
                                theme.buttonBg || 'bg-indigo-600 hover:bg-indigo-700'
                            } ${theme.buttonText || 'text-white'}`}
                            style={!isSubmitting && canSubmit ? {
                                boxShadow: `0 10px 25px -5px ${theme.primary}40, 0 4px 6px -2px ${theme.primary}20`
                            } : undefined}
                        >
                            {isSubmitting ? <><Loader2 className="animate-spin" size={24} /> Submitting...</> : <>Submit Vote <ArrowRight size={24} /></>}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* LIGHTBOX FOR IMAGES */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="absolute top-4 right-4 text-white hover:text-slate-300"><X size={32}/></button>
                        <img src={lightboxImage} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
};

export default VoteGeneratorVote;
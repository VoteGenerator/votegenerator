// ============================================================================
// Onboarding.tsx - First-time user guidance and tips
// Location: src/components/Onboarding.tsx
//
// MOBILE-FIRST DESIGN with industry best practices:
// 1. Bottom sheet on mobile (thumb-friendly)
// 2. Centered modal on desktop
// 3. Progressive disclosure (not overwhelming)
// 4. Skippable at any time
// 5. Remembers completion state
// 6. Contextual help that doesn't interrupt
// ============================================================================
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, X, ChevronRight, ChevronLeft, Check,
    PlusCircle, Share2, BarChart3, Clock,
    Lightbulb, Rocket, PartyPopper, ArrowRight,
    Eye, Link2, Copy, Zap, Users, Shield, Star
} from 'lucide-react';

// ============================================================================
// WELCOME MODAL - Mobile-first bottom sheet / Desktop centered modal
// Industry best practice: Don't overwhelm, give ONE clear CTA
// ============================================================================
interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartTour?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
    isOpen,
    onClose,
    onStartTour,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isOpen) return null;

    const content = (
        <>
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white/80 hover:text-white transition z-10"
                aria-label="Close"
            >
                <X size={18} />
            </button>

            {/* Header - Gradient */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-8 sm:px-8 sm:py-10 text-center text-white">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-5xl sm:text-6xl mb-3"
                >
                    👋
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-black mb-1">Welcome to VoteGenerator!</h2>
                <p className="text-white/80 text-sm sm:text-base">Create polls & surveys in seconds</p>
            </div>

            {/* Value props - Keep it simple, 3 max */}
            <div className="px-6 py-6 sm:px-8">
                <div className="space-y-3 mb-6">
                    {[
                        { icon: <Zap className="text-amber-500" size={20} />, text: 'No signup required - start instantly' },
                        { icon: <Users className="text-blue-500" size={20} />, text: 'Share with unlimited voters' },
                        { icon: <Shield className="text-emerald-500" size={20} />, text: 'Privacy-first, GDPR compliant' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                        >
                            {item.icon}
                            <span className="text-sm font-medium text-slate-700">{item.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Single clear CTA - Industry best practice */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                    <PlusCircle size={20} />
                    Create My First Poll
                    <ArrowRight size={20} />
                </motion.button>

                {/* Secondary action - less prominent */}
                {onStartTour && (
                    <button
                        onClick={onStartTour}
                        className="w-full mt-3 py-3 text-slate-600 font-medium text-sm hover:text-indigo-600 transition flex items-center justify-center gap-2"
                    >
                        <Eye size={16} />
                        Take a quick tour instead
                    </button>
                )}

                <p className="text-center text-xs text-slate-400 mt-4">
                    100% free • No credit card needed
                </p>
            </div>
        </>
    );

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />
            
            {/* Modal - Bottom sheet on mobile, centered on desktop */}
            {isMobile ? (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drag handle for mobile */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-slate-300 rounded-full" />
                    </div>
                    {content}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl z-50 w-full max-w-md overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// GUIDED TOUR - Step-by-step tooltips with spotlight
// Best practices: Non-intrusive, easily skippable, progress indicator
// ============================================================================
interface TourStep {
    target: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
    {
        target: '[data-tour="poll-type"]',
        title: 'Choose Your Type',
        content: 'Multiple choice, image polls, ranking & more',
        position: 'bottom',
    },
    {
        target: '[data-tour="question"]',
        title: 'Write Your Question',
        content: 'Clear questions get more engagement!',
        position: 'bottom',
    },
    {
        target: '[data-tour="options"]',
        title: 'Add Options',
        content: '2-7 choices works best for engagement',
        position: 'bottom',
    },
    {
        target: '[data-tour="create-button"]',
        title: 'Publish & Share',
        content: 'Get a shareable link instantly!',
        position: 'top',
    },
];

interface GuidedTourProps {
    isActive: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
    isActive,
    onComplete,
    onSkip,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
    const [spotlightStyle, setSpotlightStyle] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });

    const positionTooltip = useCallback(() => {
        if (!isActive) return;

        const step = tourSteps[currentStep];
        const element = document.querySelector(step.target);
        
        if (element) {
            const rect = element.getBoundingClientRect();
            const padding = 8;
            
            // Spotlight around element
            setSpotlightStyle({
                top: rect.top - padding,
                left: rect.left - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
            });
            
            // Tooltip position
            let top = 0, left = 0;
            const tooltipWidth = 280;
            const tooltipHeight = 140;
            
            switch (step.position) {
                case 'bottom':
                    top = rect.bottom + 12;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    break;
                case 'top':
                    top = rect.top - tooltipHeight - 12;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    break;
                case 'left':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.left - tooltipWidth - 12;
                    break;
                case 'right':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.right + 12;
                    break;
            }
            
            // Keep tooltip on screen
            left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
            top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
            
            setTooltipStyle({ top, left, width: tooltipWidth });
            
            // Scroll into view smoothly
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isActive, currentStep]);

    useEffect(() => {
        positionTooltip();
        window.addEventListener('resize', positionTooltip);
        window.addEventListener('scroll', positionTooltip);
        return () => {
            window.removeEventListener('resize', positionTooltip);
            window.removeEventListener('scroll', positionTooltip);
        };
    }, [positionTooltip]);

    if (!isActive) return null;

    const step = tourSteps[currentStep];
    const isLastStep = currentStep === tourSteps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <>
            {/* Dark overlay with spotlight cutout */}
            <div className="fixed inset-0 z-40 pointer-events-none">
                <svg className="w-full h-full">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={spotlightStyle.left}
                                y={spotlightStyle.top}
                                width={spotlightStyle.width}
                                height={spotlightStyle.height}
                                rx="12"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.5)"
                        mask="url(#spotlight-mask)"
                    />
                </svg>
            </div>
            
            {/* Spotlight border */}
            <motion.div
                className="fixed z-40 border-2 border-indigo-500 rounded-xl pointer-events-none"
                initial={false}
                animate={{
                    ...spotlightStyle,
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)',
                }}
                transition={{ type: 'spring', damping: 20 }}
            />
            
            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={tooltipStyle}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={16} />
                            <span className="font-bold text-sm">{step.title}</span>
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                            {currentStep + 1}/{tourSteps.length}
                        </span>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-slate-600 mb-4">{step.content}</p>
                    
                    {/* Progress dots */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {tourSteps.map((_, i) => (
                                <div 
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition ${
                                        i === currentStep 
                                            ? 'bg-indigo-600 w-4' 
                                            : i < currentStep 
                                                ? 'bg-indigo-300' 
                                                : 'bg-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        
                        {/* Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSkip}
                                className="text-xs text-slate-400 hover:text-slate-600"
                            >
                                Skip
                            </button>
                            
                            {!isFirstStep && (
                                <button
                                    onClick={() => setCurrentStep(prev => prev - 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            )}
                            
                            <button
                                onClick={() => {
                                    if (isLastStep) {
                                        onComplete();
                                    } else {
                                        setCurrentStep(prev => prev + 1);
                                    }
                                }}
                                className="px-4 h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1"
                            >
                                {isLastStep ? 'Done' : 'Next'}
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

// ============================================================================
// FIRST POLL SUCCESS - Celebration with next steps
// Best practice: Celebrate wins, provide clear next actions
// ============================================================================
interface FirstPollSuccessProps {
    isOpen: boolean;
    onClose: () => void;
    pollUrl: string;
    pollTitle?: string;
}

export const FirstPollSuccess: React.FC<FirstPollSuccessProps> = ({
    isOpen,
    onClose,
    pollUrl,
    pollTitle = 'Your Poll',
}) => {
    const [copied, setCopied] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const copyLink = async () => {
        await navigator.clipboard.writeText(pollUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    if (!isOpen) return null;

    const content = (
        <>
            {/* Confetti Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: -10,
                            backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][i % 5],
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                        }}
                        animate={{
                            y: ['0vh', '100vh'],
                            x: [0, (Math.random() - 0.5) * 100],
                            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: 'linear',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 px-6 py-8 sm:px-8 sm:py-10 text-center text-white">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-5xl sm:text-6xl mb-3"
                >
                    🎉
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl sm:text-2xl font-black"
                >
                    Your Poll is Live!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/80 text-sm mt-1"
                >
                    "{pollTitle}" is ready to share
                </motion.p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 sm:px-8">
                {/* Copy Link - Primary action */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <label className="text-xs text-slate-500 font-medium mb-2 block">Your poll link:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={pollUrl}
                            readOnly
                            className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-700 truncate"
                        />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={copyLink}
                            className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition whitespace-nowrap ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </motion.button>
                    </div>
                </div>

                {/* Next Steps - Progressive disclosure */}
                <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Next steps:</p>
                    {[
                        { icon: <Share2 className="text-blue-500" size={18} />, text: 'Share link with your audience', bg: 'bg-blue-50' },
                        { icon: <BarChart3 className="text-purple-500" size={18} />, text: 'Watch responses in real-time', bg: 'bg-purple-50' },
                        { icon: <Clock className="text-amber-500" size={18} />, text: 'Close voting when ready', bg: 'bg-amber-50' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            className={`flex items-center gap-3 p-3 ${item.bg} rounded-xl`}
                        >
                            {item.icon}
                            <span className="text-sm text-slate-700">{item.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Go to Dashboard */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                    Go to Dashboard
                    <ArrowRight size={18} />
                </motion.button>
            </div>
        </>
    );

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal - Bottom sheet on mobile */}
            {isMobile ? (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-slate-300 rounded-full" />
                    </div>
                    {content}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl z-50 w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// CONTEXTUAL TIP BADGE - Non-intrusive inline hints
// Best practice: Help in context without interrupting
// ============================================================================
interface TipBadgeProps {
    text: string;
    variant?: 'info' | 'success' | 'warning';
}

export const TipBadge: React.FC<TipBadgeProps> = ({ text, variant = 'info' }) => {
    const colors = {
        info: 'bg-blue-50 text-blue-700 border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[variant]}`}>
            <Lightbulb size={12} />
            {text}
        </span>
    );
};

// ============================================================================
// GETTING STARTED CHECKLIST - Progress tracking for new users
// ============================================================================
interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

interface GettingStartedChecklistProps {
    onDismiss: () => void;
}

export const GettingStartedChecklist: React.FC<GettingStartedChecklistProps> = ({ onDismiss }) => {
    const [items, setItems] = useState<ChecklistItem[]>([
        { id: 'create', label: 'Create your first poll', completed: false },
        { id: 'share', label: 'Share with someone', completed: false },
        { id: 'response', label: 'Get your first response', completed: false },
        { id: 'results', label: 'View your results', completed: false },
    ]);

    useEffect(() => {
        // Check localStorage for completed items
        const completed = JSON.parse(localStorage.getItem('vg_onboarding_checklist') || '[]');
        setItems(prev => prev.map(item => ({
            ...item,
            completed: completed.includes(item.id),
        })));
    }, []);

    const completedCount = items.filter(i => i.completed).length;
    const allComplete = completedCount === items.length;

    if (allComplete) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-indigo-500/25"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Rocket size={20} />
                    <h3 className="font-bold">Getting Started</h3>
                </div>
                <button 
                    onClick={onDismiss}
                    className="text-white/60 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
                <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / items.length) * 100}%` }}
                />
            </div>
            
            {/* Checklist */}
            <div className="space-y-2">
                {items.map(item => (
                    <div 
                        key={item.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition ${
                            item.completed ? 'bg-white/10' : 'bg-white/5'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            item.completed ? 'bg-white text-indigo-600' : 'border-2 border-white/40'
                        }`}>
                            {item.completed && <Check size={12} />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'line-through opacity-60' : ''}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
            
            <p className="text-xs text-white/60 mt-3 text-center">
                {completedCount}/{items.length} complete
            </p>
        </motion.div>
    );
};

// ============================================================================
// HOOK: useOnboarding - Manage all onboarding state
// ============================================================================
export const useOnboarding = () => {
    const [showWelcome, setShowWelcome] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState({ url: '', title: '' });
    const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

    useEffect(() => {
        // Check if first-time visitor (only on client)
        if (typeof window !== 'undefined') {
            const hasVisited = localStorage.getItem('vg_has_visited');
            if (!hasVisited) {
                setIsFirstTimeUser(true);
                // Small delay to let page render first
                setTimeout(() => setShowWelcome(true), 500);
                localStorage.setItem('vg_has_visited', 'true');
            }
        }
    }, []);

    const completeWelcome = () => {
        setShowWelcome(false);
    };

    const startTour = () => {
        setShowWelcome(false);
        // Small delay for smooth transition
        setTimeout(() => setShowTour(true), 300);
    };

    const completeTour = () => {
        setShowTour(false);
        localStorage.setItem('vg_tour_completed', 'true');
    };

    const showPollSuccess = (url: string, title: string) => {
        setSuccessData({ url, title });
        setShowSuccess(true);
        
        // Mark checklist item complete
        const completed = JSON.parse(localStorage.getItem('vg_onboarding_checklist') || '[]');
        if (!completed.includes('create')) {
            completed.push('create');
            localStorage.setItem('vg_onboarding_checklist', JSON.stringify(completed));
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
    };

    // Track checklist items
    const markComplete = (itemId: string) => {
        const completed = JSON.parse(localStorage.getItem('vg_onboarding_checklist') || '[]');
        if (!completed.includes(itemId)) {
            completed.push(itemId);
            localStorage.setItem('vg_onboarding_checklist', JSON.stringify(completed));
        }
    };

    return {
        // State
        showWelcome,
        showTour,
        showSuccess,
        successData,
        isFirstTimeUser,
        // Actions
        completeWelcome,
        startTour,
        completeTour,
        showPollSuccess,
        closeSuccess,
        markComplete,
    };
};

export default {
    WelcomeModal,
    GuidedTour,
    FirstPollSuccess,
    TipBadge,
    GettingStartedChecklist,
    useOnboarding,
};
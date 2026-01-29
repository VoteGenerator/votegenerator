// ============================================================================
// UpgradePrompts.tsx - Smart, contextual upgrade prompts
// Location: src/components/UpgradePrompts.tsx
//
// Shows upgrade prompts at the RIGHT moments:
// 1. When user hits 80% of response limit
// 2. When they try to use a Pro/Business feature
// 3. After their poll gets good engagement (celebration + upsell)
// 4. When they create their 2nd poll (free tier limit)
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Zap, Lock, Crown, Sparkles, X,
    BarChart3, Users, Shield, Star, ArrowRight,
    PartyPopper, Trophy, Rocket, Gift, Check
} from 'lucide-react';

// ============================================================================
// 1. RESPONSE LIMIT WARNING (Shows at 80% usage)
// ============================================================================
interface ResponseLimitWarningProps {
    currentResponses: number;
    maxResponses: number;
    tier: 'free' | 'pro' | 'business';
    onUpgrade: () => void;
    onDismiss?: () => void;
}

export const ResponseLimitWarning: React.FC<ResponseLimitWarningProps> = ({
    currentResponses,
    maxResponses,
    tier,
    onUpgrade,
    onDismiss,
}) => {
    const percentage = (currentResponses / maxResponses) * 100;
    const isWarning = percentage >= 80;
    const isCritical = percentage >= 95;

    if (!isWarning || tier === 'business') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
                isCritical 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-amber-50 border-amber-200'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCritical ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                    <TrendingUp className={isCritical ? 'text-red-600' : 'text-amber-600'} size={20} />
                </div>
                <div className="flex-1">
                    <h4 className={`font-bold ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>
                        {isCritical ? '⚠️ Almost at capacity!' : '📈 Your poll is getting popular!'}
                    </h4>
                    <p className={`text-sm mt-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                        {currentResponses.toLocaleString()} of {maxResponses.toLocaleString()} responses used ({Math.round(percentage)}%)
                    </p>
                    <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={onUpgrade}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                                isCritical
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                            }`}
                        >
                            <Zap size={16} />
                            Upgrade for {tier === 'free' ? '10,000' : '100,000'} responses
                        </button>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="text-slate-500 hover:text-slate-700 text-sm"
                            >
                                Remind me later
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// 2. FEATURE GATE MODAL (When they try a Pro/Business feature)
// ============================================================================
interface FeatureGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    requiredTier: 'pro' | 'business';
    onUpgrade: () => void;
}

const featureDetails: Record<string, { icon: React.ReactNode; description: string; benefits: string[] }> = {
    'analytics': {
        icon: <BarChart3 size={24} />,
        description: 'Detailed analytics help you understand your audience',
        benefits: ['Response trends over time', 'Geographic breakdown', 'Device & browser stats'],
    },
    'branding': {
        icon: <Crown size={24} />,
        description: 'Remove VoteGenerator branding for a professional look',
        benefits: ['Custom logo on polls', 'No "Powered by" footer', 'Custom colors & themes'],
    },
    'export': {
        icon: <Shield size={24} />,
        description: 'Export your data for backup or analysis',
        benefits: ['CSV & JSON exports', 'Filtered data exports', 'Bulk download'],
    },
    'multiple_selection': {
        icon: <Users size={24} />,
        description: 'Let voters select multiple options',
        benefits: ['Multi-select polls', 'Ranking questions', 'Advanced vote types'],
    },
    'voter_comments': {
        icon: <Star size={24} />,
        description: 'Collect feedback with voter comments',
        benefits: ['Optional comments', 'Sentiment analysis', 'Better insights'],
    },
    'default': {
        icon: <Sparkles size={24} />,
        description: 'Unlock powerful features to level up your polls',
        benefits: ['More responses', 'Better analytics', 'Professional branding'],
    },
};

export const FeatureGateModal: React.FC<FeatureGateModalProps> = ({
    isOpen,
    onClose,
    feature,
    requiredTier,
    onUpgrade,
}) => {
    const details = featureDetails[feature] || featureDetails['default'];
    const tierName = requiredTier === 'business' ? 'Business' : 'Pro';
    const tierColor = requiredTier === 'business' ? 'amber' : 'indigo';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${
                        requiredTier === 'business' 
                            ? 'from-amber-500 to-orange-500' 
                            : 'from-indigo-500 to-purple-500'
                    } p-6 text-white`}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{tierName} Feature</h3>
                                <p className="text-white/80 text-sm">Unlock to continue</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 bg-${tierColor}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <span className={`text-${tierColor}-600`}>{details.icon}</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800">{feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                                <p className="text-sm text-slate-600">{details.description}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">What you get:</p>
                            <ul className="space-y-2">
                                {details.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check size={14} className={`text-${tierColor}-500`} />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={onUpgrade}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                                requiredTier === 'business'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                            } text-white`}
                        >
                            <Zap size={18} />
                            Upgrade to {tierName}
                            <ArrowRight size={18} />
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-3">
                            Starting at ${requiredTier === 'business' ? '49' : '19'}/month
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// 3. ENGAGEMENT CELEBRATION (After good performance)
// ============================================================================
interface EngagementCelebrationProps {
    isOpen: boolean;
    onClose: () => void;
    responseCount: number;
    pollTitle: string;
    tier: 'free' | 'pro' | 'business';
    onUpgrade: () => void;
}

export const EngagementCelebration: React.FC<EngagementCelebrationProps> = ({
    isOpen,
    onClose,
    responseCount,
    pollTitle,
    tier,
    onUpgrade,
}) => {
    if (!isOpen) return null;

    const milestones = [
        { count: 10, emoji: '🎉', message: 'First 10 responses!' },
        { count: 50, emoji: '🔥', message: '50 responses!' },
        { count: 100, emoji: '🚀', message: '100 responses!' },
        { count: 250, emoji: '⭐', message: '250 responses!' },
        { count: 500, emoji: '🏆', message: '500 responses!' },
        { count: 1000, emoji: '👑', message: '1,000 responses!' },
    ];

    const currentMilestone = milestones.filter(m => responseCount >= m.count).pop() || milestones[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Celebration Header */}
                    <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-8">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            className="text-6xl mb-2"
                        >
                            {currentMilestone.emoji}
                        </motion.div>
                        <h2 className="text-white font-black text-2xl">
                            {currentMilestone.message}
                        </h2>
                        <p className="text-white/80 text-sm mt-1">
                            "{pollTitle}" is doing great!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="p-6">
                        <div className="flex justify-center gap-8 mb-6">
                            <div className="text-center">
                                <div className="text-3xl font-black text-slate-800">
                                    {responseCount.toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-500 uppercase">Responses</div>
                            </div>
                        </div>

                        {/* Upgrade CTA (only for free/pro) */}
                        {tier !== 'business' && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                                <p className="text-sm text-slate-700 mb-3">
                                    <Sparkles className="inline text-indigo-500 mr-1" size={14} />
                                    Your poll is taking off! Upgrade to unlock:
                                </p>
                                <ul className="text-xs text-slate-600 space-y-1 mb-3">
                                    <li>✓ {tier === 'free' ? '10,000' : '100,000'} responses</li>
                                    <li>✓ Advanced analytics</li>
                                    <li>✓ Export your data</li>
                                </ul>
                                <button
                                    onClick={onUpgrade}
                                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg text-sm hover:from-indigo-700 hover:to-purple-700"
                                >
                                    Upgrade Now - 20% Off First Month
                                </button>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700 text-sm"
                        >
                            Continue to dashboard →
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// 4. POLL LIMIT WARNING (When free user creates 2nd poll)
// ============================================================================
interface PollLimitWarningProps {
    currentPolls: number;
    maxPolls: number;
    onUpgrade: () => void;
    onContinue: () => void;
}

export const PollLimitWarning: React.FC<PollLimitWarningProps> = ({
    currentPolls,
    maxPolls,
    onUpgrade,
    onContinue,
}) => {
    const isAtLimit = currentPolls >= maxPolls;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
                isAtLimit ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isAtLimit ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                    {isAtLimit ? (
                        <Lock className="text-red-600" size={20} />
                    ) : (
                        <Gift className="text-blue-600" size={20} />
                    )}
                </div>
                <div className="flex-1">
                    {isAtLimit ? (
                        <>
                            <h4 className="font-bold text-red-800">Free tier limit reached</h4>
                            <p className="text-sm text-red-700 mt-1">
                                You have {currentPolls} active polls. Delete one or upgrade to create more.
                            </p>
                        </>
                    ) : (
                        <>
                            <h4 className="font-bold text-blue-800">
                                {maxPolls - currentPolls} poll{maxPolls - currentPolls !== 1 ? 's' : ''} remaining
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Free plan includes {maxPolls} active polls. Upgrade for unlimited polls!
                            </p>
                        </>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={onUpgrade}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                                isAtLimit
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            <Zap size={16} />
                            Upgrade for Unlimited
                        </button>
                        {!isAtLimit && (
                            <button
                                onClick={onContinue}
                                className="text-slate-500 hover:text-slate-700 text-sm"
                            >
                                Continue with free
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// HOOK: useUpgradePrompts - Track when to show prompts
// ============================================================================
interface UpgradePromptState {
    showResponseWarning: boolean;
    showEngagementCelebration: boolean;
    celebrationMilestone: number;
    lastCelebrated: number;
}

export const useUpgradePrompts = (
    responses: number,
    maxResponses: number,
    tier: string
) => {
    const [state, setState] = useState<UpgradePromptState>({
        showResponseWarning: false,
        showEngagementCelebration: false,
        celebrationMilestone: 0,
        lastCelebrated: 0,
    });

    useEffect(() => {
        // Check for 80% response limit warning
        const percentage = (responses / maxResponses) * 100;
        if (percentage >= 80 && tier !== 'business') {
            // Check if we've shown this warning recently (localStorage)
            const lastWarning = localStorage.getItem('vg_response_warning_shown');
            const hourAgo = Date.now() - (60 * 60 * 1000);
            
            if (!lastWarning || parseInt(lastWarning) < hourAgo) {
                setState(prev => ({ ...prev, showResponseWarning: true }));
            }
        }

        // Check for celebration milestones
        const milestones = [10, 50, 100, 250, 500, 1000];
        const lastCelebrated = parseInt(localStorage.getItem('vg_last_celebrated') || '0');
        
        for (const milestone of milestones) {
            if (responses >= milestone && lastCelebrated < milestone) {
                setState(prev => ({
                    ...prev,
                    showEngagementCelebration: true,
                    celebrationMilestone: milestone,
                }));
                break;
            }
        }
    }, [responses, maxResponses, tier]);

    const dismissResponseWarning = () => {
        localStorage.setItem('vg_response_warning_shown', Date.now().toString());
        setState(prev => ({ ...prev, showResponseWarning: false }));
    };

    const dismissCelebration = () => {
        localStorage.setItem('vg_last_celebrated', state.celebrationMilestone.toString());
        setState(prev => ({ ...prev, showEngagementCelebration: false }));
    };

    return {
        ...state,
        dismissResponseWarning,
        dismissCelebration,
    };
};

export default {
    ResponseLimitWarning,
    FeatureGateModal,
    EngagementCelebration,
    PollLimitWarning,
    useUpgradePrompts,
};
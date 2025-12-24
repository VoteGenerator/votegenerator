// ============================================================================
// GoLiveModal.tsx - Confirmation before activating a paid poll
// Location: src/components/GoLiveModal.tsx
// Shows warning that this will use one of their poll credits
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket, AlertTriangle, Check, X, Clock, Users,
    Loader2, Sparkles, Lock, Calendar
} from 'lucide-react';

interface GoLiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    pollTitle: string;
    tier: 'starter' | 'pro_event' | 'unlimited';
    pollsUsed: number;
    pollsMax: number;
    activeDays: number;
}

const TIER_INFO: Record<string, { label: string; gradient: string }> = {
    starter: { label: 'Starter', gradient: 'from-blue-500 to-indigo-600' },
    pro_event: { label: 'Pro Event', gradient: 'from-purple-500 to-pink-500' },
    unlimited: { label: 'Unlimited', gradient: 'from-amber-500 to-orange-500' },
};

const GoLiveModal: React.FC<GoLiveModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    pollTitle,
    tier,
    pollsUsed,
    pollsMax,
    activeDays
}) => {
    const [isActivating, setIsActivating] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const tierInfo = TIER_INFO[tier] || TIER_INFO.starter;
    const pollsRemaining = pollsMax - pollsUsed;
    const isLastPoll = pollsRemaining === 1;

    const handleConfirm = async () => {
        setIsActivating(true);
        try {
            await onConfirm();
        } finally {
            setIsActivating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${tierInfo.gradient} p-6 text-white`}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <Rocket size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Ready to Go Live?</h2>
                                <p className="text-white/80 text-sm">Launch your poll for real voting</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Poll Title */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Poll</p>
                            <p className="font-bold text-slate-800 truncate">{pollTitle}</p>
                        </div>

                        {/* What happens */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-slate-800 mb-3">When you go live:</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Check size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-700">Real voting enabled</p>
                                        <p className="text-sm text-slate-500">People can submit actual votes</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-700">{activeDays}-day countdown starts</p>
                                        <p className="text-sm text-slate-500">Poll expires after {activeDays} days</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Lock size={16} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-700">Uses 1 poll credit</p>
                                        <p className="text-sm text-slate-500">
                                            {pollsUsed} of {pollsMax} used → {pollsUsed + 1} of {pollsMax} after
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className={`mb-6 p-4 rounded-xl ${
                            isLastPoll 
                                ? 'bg-red-50 border-2 border-red-200' 
                                : 'bg-amber-50 border border-amber-200'
                        }`}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className={isLastPoll ? 'text-red-500' : 'text-amber-500'} />
                                <div>
                                    <p className={`font-semibold ${isLastPoll ? 'text-red-700' : 'text-amber-700'}`}>
                                        {isLastPoll ? '⚠️ This is your last poll!' : 'This cannot be undone'}
                                    </p>
                                    <p className={`text-sm ${isLastPoll ? 'text-red-600' : 'text-amber-600'}`}>
                                        {isLastPoll 
                                            ? 'After this, you\'ll need to upgrade for more polls.'
                                            : 'Once live, you cannot revert to draft mode.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation checkbox */}
                        <label className="flex items-start gap-3 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-600">
                                I understand this will use 1 of my {pollsMax} poll credits and cannot be undone.
                            </span>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isActivating}
                                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Keep as Draft
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!confirmed || isActivating}
                                className={`flex-1 py-3 bg-gradient-to-r ${tierInfo.gradient} text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2`}
                            >
                                {isActivating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Activating...
                                    </>
                                ) : (
                                    <>
                                        <Rocket size={18} />
                                        Go Live Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GoLiveModal;
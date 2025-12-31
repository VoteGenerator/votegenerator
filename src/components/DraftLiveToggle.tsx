import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Eye, 
    Globe, 
    Loader2, 
    Check, 
    AlertTriangle, 
    Trash2,
    Play,
    Pause,
    RefreshCw
} from 'lucide-react';

interface Props {
    pollId: string;
    adminKey: string;
    status: 'draft' | 'live' | 'closed' | 'paused';
    voteCount: number;
    onStatusChange?: (newStatus: string) => void;
}

const DraftLiveToggle: React.FC<Props> = ({
    pollId,
    adminKey,
    status,
    voteCount,
    onStatusChange
}) => {
    const [currentStatus, setCurrentStatus] = useState(status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState<'live' | 'clear' | null>(null);
    const [clearVotes, setClearVotes] = useState(true);

    const updateStatus = async (newStatus: string, clearExistingVotes: boolean = false) => {
        setIsUpdating(true);
        try {
            const response = await fetch('/.netlify/functions/vg-update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId,
                    adminKey,
                    status: newStatus,
                    clearVotes: clearExistingVotes
                })
            });

            if (response.ok) {
                setCurrentStatus(newStatus as any);
                onStatusChange?.(newStatus);
                setShowConfirm(null);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const statusConfig = {
        draft: {
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            icon: Eye,
            label: 'Draft',
            description: 'Only you can see this poll'
        },
        live: {
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            icon: Globe,
            label: 'Live',
            description: 'Poll is accepting votes'
        },
        paused: {
            color: 'bg-slate-100 text-slate-700 border-slate-200',
            icon: Pause,
            label: 'Paused',
            description: 'Temporarily not accepting votes'
        },
        closed: {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: AlertTriangle,
            label: 'Closed',
            description: 'Poll has ended'
        }
    };

    const config = statusConfig[currentStatus];
    const Icon = config.icon;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Current Status */}
            <div className={`p-4 ${config.color} border-b-2`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/50 rounded-lg">
                            <Icon size={20} />
                        </div>
                        <div>
                            <span className="font-bold text-lg">{config.label}</span>
                            <p className="text-sm opacity-80">{config.description}</p>
                        </div>
                    </div>
                    {voteCount > 0 && currentStatus === 'draft' && (
                        <span className="text-sm bg-white/50 px-3 py-1 rounded-full">
                            {voteCount} test vote{voteCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
                {currentStatus === 'draft' && (
                    <>
                        <button
                            onClick={() => setShowConfirm('live')}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Globe size={20} />
                            Go Live
                        </button>
                        <p className="text-xs text-slate-500 text-center">
                            Make your poll public and start collecting votes
                        </p>
                    </>
                )}

                {currentStatus === 'live' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateStatus('paused')}
                            disabled={isUpdating}
                            className="py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2"
                        >
                            <Pause size={18} />
                            Pause
                        </button>
                        <button
                            onClick={() => updateStatus('closed')}
                            disabled={isUpdating}
                            className="py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 flex items-center justify-center gap-2"
                        >
                            <AlertTriangle size={18} />
                            Close
                        </button>
                    </div>
                )}

                {currentStatus === 'paused' && (
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateStatus('live')}
                            disabled={isUpdating}
                            className="py-2.5 bg-emerald-100 text-emerald-700 font-medium rounded-xl hover:bg-emerald-200 flex items-center justify-center gap-2"
                        >
                            <Play size={18} />
                            Resume
                        </button>
                        <button
                            onClick={() => updateStatus('closed')}
                            disabled={isUpdating}
                            className="py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 flex items-center justify-center gap-2"
                        >
                            <AlertTriangle size={18} />
                            Close
                        </button>
                    </div>
                )}

                {currentStatus === 'closed' && (
                    <button
                        onClick={() => updateStatus('live')}
                        disabled={isUpdating}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Reopen Poll
                    </button>
                )}

                {isUpdating && (
                    <div className="flex items-center justify-center py-2">
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                    </div>
                )}
            </div>

            {/* Go Live Confirmation Modal */}
            <AnimatePresence>
                {showConfirm === 'live' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Ready to Go Live?</h3>
                                <p className="text-slate-600 mt-2">
                                    Your poll will be publicly accessible and start collecting real votes.
                                </p>
                            </div>

                            {voteCount > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={clearVotes}
                                            onChange={(e) => setClearVotes(e.target.checked)}
                                            className="w-5 h-5 mt-0.5 rounded border-amber-300"
                                        />
                                        <div>
                                            <span className="font-medium text-amber-800">Clear {voteCount} test vote{voteCount !== 1 ? 's' : ''}</span>
                                            <p className="text-sm text-amber-600 mt-1">
                                                Remove votes cast while in draft mode
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(null)}
                                    className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateStatus('live', voteCount > 0 && clearVotes)}
                                    disabled={isUpdating}
                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            Go Live
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DraftLiveToggle;
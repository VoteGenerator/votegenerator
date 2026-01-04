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
    RefreshCw,
    Radio,
    Undo2
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
    const [showConfirm, setShowConfirm] = useState<'live' | 'clear' | 'close' | null>(null);
    const [clearVotes, setClearVotes] = useState(true);
    const [justChanged, setJustChanged] = useState(false);
    const [closeConfirmed, setCloseConfirmed] = useState(false);
    const [closedAt, setClosedAt] = useState<number | null>(null);
    const [undoTimeLeft, setUndoTimeLeft] = useState<number>(0);
    
    const UNDO_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Timer for undo grace period
    React.useEffect(() => {
        if (!closedAt) return;
        
        const updateTimer = () => {
            const elapsed = Date.now() - closedAt;
            const remaining = Math.max(0, UNDO_GRACE_PERIOD - elapsed);
            setUndoTimeLeft(remaining);
            
            if (remaining <= 0) {
                setClosedAt(null);
            }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [closedAt]);
    
    // Check localStorage for recent close on mount
    React.useEffect(() => {
        const savedClosedAt = localStorage.getItem(`poll_closed_at_${pollId}`);
        if (savedClosedAt && currentStatus === 'closed') {
            const closedTime = parseInt(savedClosedAt, 10);
            const elapsed = Date.now() - closedTime;
            if (elapsed < UNDO_GRACE_PERIOD) {
                setClosedAt(closedTime);
            } else {
                localStorage.removeItem(`poll_closed_at_${pollId}`);
            }
        }
    }, [pollId, currentStatus]);

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
                setJustChanged(true);
                setTimeout(() => setJustChanged(false), 2000);
                onStatusChange?.(newStatus);
                setShowConfirm(null);
                
                // Track when poll was closed for undo feature
                if (newStatus === 'closed') {
                    const now = Date.now();
                    setClosedAt(now);
                    localStorage.setItem(`poll_closed_at_${pollId}`, now.toString());
                } else {
                    // Clear undo timer if reopening
                    setClosedAt(null);
                    localStorage.removeItem(`poll_closed_at_${pollId}`);
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleUndo = async () => {
        // Reopen the poll
        await updateStatus('live');
    };
    
    const formatTimeLeft = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const statusConfig = {
        draft: {
            bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
            borderColor: 'border-amber-300',
            textColor: 'text-amber-800',
            badgeBg: 'bg-amber-500',
            icon: Eye,
            label: 'DRAFT',
            description: 'Only you can see this poll',
            pulse: false
        },
        live: {
            bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
            borderColor: 'border-emerald-400',
            textColor: 'text-emerald-800',
            badgeBg: 'bg-emerald-500',
            icon: Radio,
            label: 'LIVE',
            description: 'Poll is accepting votes',
            pulse: true
        },
        paused: {
            bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50',
            borderColor: 'border-slate-300',
            textColor: 'text-slate-700',
            badgeBg: 'bg-slate-500',
            icon: Pause,
            label: 'PAUSED',
            description: 'Temporarily not accepting votes',
            pulse: false
        },
        closed: {
            bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
            borderColor: 'border-red-300',
            textColor: 'text-red-800',
            badgeBg: 'bg-red-500',
            icon: AlertTriangle,
            label: 'CLOSED',
            description: 'Poll has ended',
            pulse: false
        }
    };

    const config = statusConfig[currentStatus];
    const Icon = config.icon;

    return (
        <motion.div 
            className={`rounded-2xl border-2 ${config.borderColor} shadow-sm overflow-hidden transition-colors duration-500`}
            layout
            initial={false}
            animate={justChanged ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.3 }}
        >
            {/* Current Status Header */}
            <motion.div 
                className={`p-4 ${config.bgColor} border-b ${config.borderColor}`}
                layout
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Status Badge with Pulse */}
                        <div className="relative">
                            <motion.div 
                                className={`p-2.5 ${config.badgeBg} rounded-xl shadow-lg`}
                                animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Icon size={22} className="text-white" />
                            </motion.div>
                            {config.pulse && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`font-black text-xl tracking-wide ${config.textColor}`}>
                                    {config.label}
                                </span>
                                {justChanged && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium"
                                    >
                                        Updated!
                                    </motion.span>
                                )}
                            </div>
                            <p className={`text-sm ${config.textColor} opacity-70`}>{config.description}</p>
                        </div>
                    </div>
                    {voteCount > 0 && currentStatus === 'draft' && (
                        <span className="text-sm bg-white/70 px-3 py-1.5 rounded-full font-medium text-amber-700 border border-amber-200">
                            {voteCount} test vote{voteCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    {currentStatus === 'live' && voteCount > 0 && (
                        <motion.div 
                            className="text-right"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5 }}
                            key={voteCount}
                        >
                            <span className="text-2xl font-black text-emerald-700">{voteCount}</span>
                            <p className="text-xs text-emerald-600">votes</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>

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
                            onClick={() => {
                                setCloseConfirmed(false);
                                setShowConfirm('close');
                            }}
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
                            onClick={() => {
                                setCloseConfirmed(false);
                                setShowConfirm('close');
                            }}
                            disabled={isUpdating}
                            className="py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 flex items-center justify-center gap-2"
                        >
                            <AlertTriangle size={18} />
                            Close
                        </button>
                    </div>
                )}

                {currentStatus === 'closed' && (
                    <div className="space-y-3">
                        {/* Undo Button with Countdown (within grace period) */}
                        {undoTimeLeft > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Undo2 size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-blue-800">Changed your mind?</p>
                                            <p className="text-sm text-blue-600">
                                                Undo available for {formatTimeLeft(undoTimeLeft)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleUndo}
                                        disabled={isUpdating}
                                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <Undo2 size={16} />
                                        )}
                                        Undo Close
                                    </button>
                                </div>
                                {/* Progress bar for time remaining */}
                                <div className="mt-3 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(undoTimeLeft / (5 * 60 * 1000)) * 100}%` }}
                                        transition={{ duration: 1, ease: 'linear' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Regular Reopen Button */}
                        <button
                            onClick={() => updateStatus('live')}
                            disabled={isUpdating}
                            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Reopen Poll
                        </button>
                        
                        {!undoTimeLeft && (
                            <p className="text-xs text-slate-500 text-center">
                                Reopening will allow new votes to be submitted
                            </p>
                        )}
                    </div>
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

                {/* Close Poll Confirmation Modal */}
                {showConfirm === 'close' && (
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
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="text-red-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Close This Poll?</h3>
                                <p className="text-slate-600 mt-2">
                                    This will permanently stop the poll from accepting new votes.
                                </p>
                            </div>

                            {voteCount > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>{voteCount} vote{voteCount !== 1 ? 's' : ''}</strong> have been collected. 
                                        These will be preserved and you can still view results.
                                    </p>
                                </div>
                            )}

                            {/* Confirmation Checkbox */}
                            <label className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-6 cursor-pointer hover:bg-red-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={closeConfirmed}
                                    onChange={(e) => setCloseConfirmed(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-red-800">
                                    <strong>I understand</strong> this will stop voting and cannot be easily undone. 
                                    I can reopen the poll later if needed.
                                </span>
                            </label>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowConfirm(null);
                                        setCloseConfirmed(false);
                                    }}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (closeConfirmed) {
                                            updateStatus('closed');
                                            setCloseConfirmed(false);
                                        }
                                    }}
                                    disabled={!closeConfirmed || isUpdating}
                                    className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                                        closeConfirmed 
                                            ? 'bg-red-600 text-white hover:bg-red-700' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <AlertTriangle size={18} />
                                            Close Poll
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DraftLiveToggle;
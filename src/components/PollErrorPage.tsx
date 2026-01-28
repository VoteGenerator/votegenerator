// ============================================================================
// PollErrorPage.tsx - Friendly error pages for poll states
// Location: src/components/PollErrorPage.tsx
// ============================================================================
import React from 'react';
import { motion } from 'framer-motion';
import { 
    AlertTriangle, Clock, Trash2, Lock, PauseCircle, 
    Home, PlusCircle, ArrowLeft, Search, XCircle,
    Calendar, RefreshCw, Mail, HelpCircle
} from 'lucide-react';

type ErrorCode = 'NOT_FOUND' | 'DELETED' | 'EXPIRED' | 'DRAFT' | 'CLOSED' | 'PAUSED' | 'UNKNOWN';

interface PollErrorPageProps {
    code: ErrorCode;
    title?: string;
    message?: string;
    expiredAt?: string;
    deletedAt?: string;
    suggestions?: string[];
}

const errorConfig: Record<ErrorCode, {
    icon: React.FC<{ size?: number; className?: string }>;
    emoji: string;
    title: string;
    subtitle: string;
    gradient: string;
    iconBg: string;
    iconColor: string;
}> = {
    NOT_FOUND: {
        icon: Search,
        emoji: '🔍',
        title: 'Poll Not Found',
        subtitle: 'We couldn\'t find this poll. It may have been deleted or the link might be incorrect.',
        gradient: 'from-slate-500 to-slate-600',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
    },
    DELETED: {
        icon: Trash2,
        emoji: '🗑️',
        title: 'Poll Was Deleted',
        subtitle: 'The creator has deleted this poll. All responses have been removed.',
        gradient: 'from-red-500 to-rose-500',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
    },
    EXPIRED: {
        icon: Clock,
        emoji: '⏰',
        title: 'Poll Has Expired',
        subtitle: 'This poll\'s time limit has passed. Voting is no longer available.',
        gradient: 'from-amber-500 to-orange-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
    DRAFT: {
        icon: Lock,
        emoji: '🔒',
        title: 'Poll Not Ready Yet',
        subtitle: 'The creator is still setting up this poll. Check back soon!',
        gradient: 'from-purple-500 to-indigo-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
    },
    CLOSED: {
        icon: XCircle,
        emoji: '🚫',
        title: 'Poll Is Closed',
        subtitle: 'The creator has closed this poll. No more responses are being accepted.',
        gradient: 'from-slate-600 to-slate-700',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
    },
    PAUSED: {
        icon: PauseCircle,
        emoji: '⏸️',
        title: 'Poll Is Paused',
        subtitle: 'This poll is temporarily paused. The creator may reopen it later.',
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    UNKNOWN: {
        icon: AlertTriangle,
        emoji: '❓',
        title: 'Something Went Wrong',
        subtitle: 'We encountered an unexpected error. Please try again.',
        gradient: 'from-slate-500 to-slate-600',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
    },
};

const PollErrorPage: React.FC<PollErrorPageProps> = ({
    code,
    title,
    message,
    expiredAt,
    deletedAt,
    suggestions,
}) => {
    const config = errorConfig[code] || errorConfig.UNKNOWN;
    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-6 text-center`}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="text-5xl mb-3"
                        >
                            {config.emoji}
                        </motion.div>
                        <h1 className="text-2xl font-black text-white">
                            {title || config.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-slate-600 text-center mb-6">
                            {message || config.subtitle}
                        </p>

                        {/* Expiry info */}
                        {code === 'EXPIRED' && expiredAt && (
                            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3 mb-6">
                                <Calendar size={16} />
                                Expired on {new Date(expiredAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        )}

                        {/* Deletion info */}
                        {code === 'DELETED' && deletedAt && (
                            <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6">
                                <Trash2 size={16} />
                                Deleted on {new Date(deletedAt).toLocaleDateString()}
                            </div>
                        )}

                        {/* Suggestions */}
                        {suggestions && suggestions.length > 0 && (
                            <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <HelpCircle size={14} /> What you can do:
                                </p>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    {suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="text-slate-400">•</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <a
                                href="/create"
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${config.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition`}
                            >
                                <PlusCircle size={18} />
                                Create Your Own Poll
                            </a>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                                >
                                    <ArrowLeft size={16} />
                                    Go Back
                                </button>
                                <a
                                    href="/"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                                >
                                    <Home size={16} />
                                    Home
                                </a>
                            </div>
                        </div>

                        {/* Contact suggestion for closed/paused */}
                        {(code === 'CLOSED' || code === 'PAUSED' || code === 'DRAFT') && (
                            <p className="text-center text-sm text-slate-400 mt-4">
                                <Mail size={12} className="inline mr-1" />
                                Contact the poll creator if you need access
                            </p>
                        )}
                    </div>
                </div>

                {/* Retry for unknown errors */}
                {code === 'UNKNOWN' && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => window.location.reload()}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 transition"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default PollErrorPage;
// ============================================================================
// PollCreatedSuccess - Success page after poll creation (especially for free users)
// Route: /poll-created?id={pollId}&admin={adminKey}
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, Copy, Check, ExternalLink, Bookmark, 
    Share2, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';

const PollCreatedSuccess: React.FC = () => {
    const [pollId, setPollId] = useState<string | null>(null);
    const [adminKey, setAdminKey] = useState<string | null>(null);
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPollId(params.get('id'));
        setAdminKey(params.get('admin'));
    }, []);

    const baseUrl = window.location.origin;
    const shareLink = pollId ? `${baseUrl}/#id=${pollId}` : '';
    const adminLink = pollId && adminKey ? `${baseUrl}/#id=${pollId}&admin=${adminKey}` : '';

    const copyToClipboard = (text: string, type: 'share' | 'admin') => {
        navigator.clipboard.writeText(text);
        if (type === 'share') {
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        } else {
            setCopiedAdmin(true);
            setTimeout(() => setCopiedAdmin(false), 2000);
        }
    };

    if (!pollId || !adminKey) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Missing Poll Info</h1>
                    <p className="text-slate-600 mb-6">We couldn't find your poll details. Please try creating a new poll.</p>
                    <a 
                        href="/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                    >
                        Create New Poll <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full"
            >
                {/* Success Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-10 text-center text-white">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2">Poll Created! 🎉</h1>
                    <p className="text-emerald-100">Your poll is ready to share</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Important Notice */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                        <div className="flex gap-3">
                            <Bookmark className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-800">Important: Save Your Admin Link!</p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Bookmark your admin link below to manage your poll later. This is the only way to access your poll settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Share Link */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Share2 size={16} className="text-indigo-500" />
                            Share Link (for voters)
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={shareLink}
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 truncate"
                            />
                            <button
                                onClick={() => copyToClipboard(shareLink, 'share')}
                                className="px-4 py-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition flex items-center gap-2"
                            >
                                {copiedShare ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Admin Link */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Bookmark size={16} className="text-emerald-500" />
                            Admin Link (bookmark this!)
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                readOnly 
                                value={adminLink}
                                className="flex-1 px-4 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-sm text-slate-600 truncate"
                            />
                            <button
                                onClick={() => copyToClipboard(adminLink, 'admin')}
                                className="px-4 py-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition flex items-center gap-2"
                            >
                                {copiedAdmin ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        <a
                            href={adminLink}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition text-lg"
                        >
                            <Sparkles size={20} />
                            Go to Poll Manager
                            <ArrowRight size={20} />
                        </a>
                        
                        <a
                            href={shareLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                        >
                            <ExternalLink size={18} />
                            Preview as Voter
                        </a>
                    </div>

                    {/* Free Tier Info */}
                    <div className="text-center text-sm text-slate-500 pt-4 border-t">
                        <p>Free plan: Up to 100 responses • 30 days active</p>
                        <a href="/pricing" className="text-indigo-600 hover:underline">
                            Upgrade for more responses →
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PollCreatedSuccess;

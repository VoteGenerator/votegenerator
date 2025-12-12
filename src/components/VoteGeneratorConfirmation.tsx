import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BarChart2, Share2, ArrowRight, Lock, PartyPopper } from 'lucide-react';
import type { Poll } from '../types';
import { trackEvent } from '../services/analyticsService';

interface VoteGeneratorConfirmationProps {
    poll: Poll;
    canSeeResults: boolean;
    onViewResults: () => void;
}

const VoteGeneratorConfirmation: React.FC<VoteGeneratorConfirmationProps> = ({ 
    poll, 
    canSeeResults, 
    onViewResults 
}) => {
    const voteUrl = `${window.location.origin}/vote/${poll.id}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: poll.title,
                text: `Vote on: ${poll.title}`,
                url: voteUrl
            });
        } else {
            navigator.clipboard.writeText(voteUrl);
            alert('Link copied to clipboard!');
        }
        trackEvent('votegenerator_share_after_vote');
    };

    return (
        <div className="max-w-xl mx-auto">
            {/* Success Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-center mb-8"
            >
                <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200"
                >
                    <CheckCircle size={48} className="text-white" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-black text-slate-800 mb-2"
                >
                    Vote Submitted!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 text-lg"
                >
                    Your ranking has been recorded.
                </motion.p>
            </motion.div>

            {/* Poll Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
            >
                <h2 className="font-bold text-slate-800 mb-1">{poll.title}</h2>
                {poll.description && (
                    <p className="text-slate-500 text-sm mb-4">{poll.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                    <PartyPopper size={16} />
                    <span>{poll.voteCount + 1} vote{poll.voteCount !== 0 ? 's' : ''} so far</span>
                </div>
            </motion.div>

            {/* Results or Hidden Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                {canSeeResults ? (
                    <button
                        onClick={onViewResults}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-lg transform active:scale-95"
                    >
                        <BarChart2 size={22} /> View Results <ArrowRight size={20} />
                    </button>
                ) : (
                    <div className="bg-slate-50 rounded-xl p-6 text-center border-2 border-slate-200">
                        <Lock className="mx-auto mb-3 text-slate-400" size={32} />
                        <h3 className="font-bold text-slate-700 mb-1">Results are hidden</h3>
                        <p className="text-slate-500 text-sm">
                            The poll creator will reveal the results when voting is complete.
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Share Prompt */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
            >
                <p className="text-slate-500 mb-3">Know others who should vote?</p>
                <button
                    onClick={handleShare}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all inline-flex items-center gap-2"
                >
                    <Share2 size={18} /> Share Poll Link
                </button>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-10 bg-indigo-50 rounded-xl p-5"
            >
                <h4 className="font-bold text-indigo-900 mb-2 text-sm">💡 Did you know?</h4>
                <p className="text-indigo-700 text-sm">
                    Ranked choice voting finds the option everyone can agree on—not just the 
                    plurality winner. It's used in Australia, Ireland, and many US cities!
                </p>
            </motion.div>

            {/* VoteGenerator Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-center"
            >
                <a 
                    href="/" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                >
                    <BarChart2 size={16} />
                    <span>Create your own poll at <strong>VoteGenerator.com</strong></span>
                </a>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorConfirmation;

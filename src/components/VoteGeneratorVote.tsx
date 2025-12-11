import React, { useState, useEffect } from 'react';
import type { Poll, PollOption } from '../types';
import { Reorder, useDragControls } from 'framer-motion';
import { motion } from 'framer-motion';
import { GripVertical, CheckCircle, Loader2, Info, ArrowUpDown } from 'lucide-react';
import { submitVote, markAsVoted } from '../services/voteGeneratorService';
import { trackEvent } from '../services/analyticsService';

interface VoteGeneratorVoteProps {
    poll: Poll;
    onVoteSuccess: () => void;
}

const VoteGeneratorVote: React.FC<VoteGeneratorVoteProps> = ({ poll, onVoteSuccess }) => {
    const [items, setItems] = useState<PollOption[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize items with a random shuffle to avoid position bias
        const shuffled = [...poll.options].sort(() => Math.random() - 0.5);
        setItems(shuffled);
    }, [poll]);

    const handleReorder = (newOrder: PollOption[]) => {
        setItems(newOrder);
        if (!hasInteracted) {
            setHasInteracted(true);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Send the ORDERED IDs. Index 0 is rank 1 (top choice).
            const rankedIds = items.map(i => i.id);
            await submitVote(poll.id, rankedIds);
            
            // Mark as voted in localStorage to prevent duplicate votes
            markAsVoted(poll.id);
            
            trackEvent('votegenerator_vote_submitted', {
                pollId: poll.id,
                optionCount: poll.options.length
            });
            
            onVoteSuccess();
        } catch (e) {
            console.error('Vote submission failed:', e);
            setError(e instanceof Error ? e.message : 'Failed to submit vote. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 leading-tight">
                    {poll.title}
                </h1>
                {poll.description && (
                    <p className="text-slate-500 text-lg">{poll.description}</p>
                )}
            </motion.div>

            {/* Instructions */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="bg-indigo-600 rounded-lg p-2 text-white">
                        <ArrowUpDown size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-indigo-900">Drag to rank your choices</p>
                        <p className="text-indigo-700 text-sm">
                            Your top choice should be at #1. Drag options up or down to reorder.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Draggable List */}
            <Reorder.Group 
                axis="y" 
                values={items} 
                onReorder={handleReorder} 
                className="space-y-3"
            >
                {items.map((item, index) => (
                    <Reorder.Item 
                        key={item.id} 
                        value={item} 
                        className="cursor-grab active:cursor-grabbing touch-none"
                        whileDrag={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                    >
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white p-4 rounded-xl border-2 flex items-center gap-4 select-none transition-all relative overflow-hidden group ${
                                index === 0 
                                    ? 'border-indigo-400 shadow-lg shadow-indigo-100' 
                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                            }`}
                        >
                            {/* Left accent bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-opacity ${
                                index === 0 ? 'bg-indigo-500 opacity-100' : 'bg-indigo-500 opacity-0 group-hover:opacity-100'
                            }`} />
                            
                            {/* Rank number */}
                            <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-inner transition-colors ${
                                index === 0 
                                    ? 'bg-indigo-600 text-white' 
                                    : index === 1
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : index === 2
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-slate-50 text-slate-400'
                            }`}>
                                {index + 1}
                            </div>
                            
                            {/* Option text */}
                            <span className="font-bold text-slate-700 text-lg flex-grow pr-2">
                                {item.text}
                            </span>
                            
                            {/* Drag handle */}
                            <div className="text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0">
                                <GripVertical size={24} />
                            </div>

                            {/* First place badge */}
                            {index === 0 && (
                                <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                                    TOP CHOICE
                                </div>
                            )}
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* Submit Button */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 sticky bottom-4 z-10"
            >
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-lg transform active:scale-[0.98] disabled:scale-100"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={22} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={22} />
                            Submit My Ranking
                        </>
                    )}
                </button>
            </motion.div>

            {/* Helper text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-slate-400 text-sm mt-4"
            >
                {poll.voteCount} {poll.voteCount === 1 ? 'person has' : 'people have'} voted so far
            </motion.p>
        </div>
    );
};

export default VoteGeneratorVote;

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Check, GripVertical, ArrowRight, Loader2, Shuffle, User, Clock, Lock } from 'lucide-react';
import { Poll, PollOption } from '../types';
import { submitVote, hasVoted } from '../services/voteGeneratorService';

interface Props {
    poll: Poll;
    onVoteSuccess: () => void;
}

const VoteGeneratorVote: React.FC<Props> = ({ poll, onVoteSuccess }) => {
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
    const [voterName, setVoterName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check Deadline
    const isExpired = poll.settings.deadline && new Date() > new Date(poll.settings.deadline);
    // Check if security allows (If browser check is on, hasVoted will return true if they already voted)
    const alreadyVoted = poll.settings.security !== 'none' && hasVoted(poll.id);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const choices = poll.pollType === 'ranked' 
                ? items.map(i => i.id) 
                : Array.from(selectedIds);
            
            await submitVote(poll.id, choices, voterName.trim() || undefined);
            onVoteSuccess();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            alert("Failed to submit vote. Please try again.");
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            if (!poll.settings.allowMultiple) {
                newSet.clear();
            }
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const canSubmit = (poll.pollType === 'ranked' ? true : selectedIds.size > 0) 
                      && (!poll.settings.requireNames || voterName.trim().length > 0);

    if (isExpired) {
        return (
            <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-slate-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Poll Closed</h1>
                <p className="text-slate-500 mb-8">This poll ended on {new Date(poll.settings.deadline!).toLocaleString()}.</p>
                <button 
                    onClick={onVoteSuccess} // Just go to results
                    className="text-indigo-600 font-bold hover:underline"
                >
                    View Results
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20 pt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-serif mb-2">
                        {poll.title}
                    </h1>
                    {poll.description && (
                        <p className="text-slate-600 leading-relaxed">
                            {poll.description}
                        </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                            {poll.pollType === 'ranked' ? (
                                <>Drag options to rank them order of preference</>
                            ) : (
                                <>Select {poll.settings.allowMultiple ? 'options' : 'an option'}</>
                            )}
                        </div>
                        {poll.settings.deadline && (
                            <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                                <Clock size={14} /> Ends: {new Date(poll.settings.deadline).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                    {poll.pollType === 'ranked' && (
                            <p className="text-xs text-slate-400 italic flex items-center gap-1 ml-1 mt-2">
                            <Shuffle size={12} /> Options are randomized to prevent order bias.
                            </p>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    {poll.pollType === 'ranked' ? (
                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                            {items.map((item, index) => (
                                <Reorder.Item key={item.id} value={item}>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none">
                                        <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                            {index + 1}
                                        </div>
                                        <span className="flex-1 font-medium text-slate-800 text-lg">
                                            {item.text}
                                        </span>
                                        <GripVertical className="text-slate-300 group-hover:text-indigo-400" />
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    ) : (
                        <div className="space-y-3">
                            {poll.options.map((opt) => {
                                const isSelected = selectedIds.has(opt.id);
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => toggleSelection(opt.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                            isSelected 
                                                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                                                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                                            isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'
                                        }`}>
                                            {isSelected && <Check size={16} strokeWidth={3} />}
                                        </div>
                                        <span className={`flex-1 font-medium text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {opt.text}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Name Input if Required */}
                    {poll.settings.requireNames && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    value={voterName}
                                    onChange={(e) => setVoterName(e.target.value)}
                                    className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                    )}

                    {alreadyVoted ? (
                        <div className="mt-8 p-4 bg-amber-50 text-amber-800 rounded-xl text-center border border-amber-200">
                            <strong>You have already voted.</strong><br/>
                            <span className="text-sm">Based on your browser settings, duplicate voting is not allowed.</span>
                            <div className="mt-2">
                                <button onClick={onVoteSuccess} className="text-indigo-600 underline text-sm font-bold">See Results</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canSubmit}
                            className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Vote <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorVote;
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createPoll } from '../services/voteGeneratorService';
import { trackEvent } from '../services/analyticsService';

const PLACEHOLDER_QUESTIONS = [
    "Where should we eat lunch?",
    "What movie should we watch?",
    "When should we have the meeting?",
    "Which design do you prefer?",
    "What should we name the project?"
];

const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [hideResults, setHideResults] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    
    const lastInputRef = useRef<HTMLInputElement>(null);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        
        // Auto-add new line if typing in the last non-empty field
        if (index === options.length - 1 && value.trim() !== '' && options.length < 20) {
            setOptions([...newOptions, '']);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Press Enter to move to next option
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = document.querySelector<HTMLInputElement>(
                `input[data-option-index="${index + 1}"]`
            );
            if (nextInput) {
                nextInput.focus();
            } else if (options.length < 20) {
                setOptions([...options, '']);
                setTimeout(() => {
                    lastInputRef.current?.focus();
                }, 50);
            }
        }
        
        // Backspace on empty field removes it
        if (e.key === 'Backspace' && options[index] === '' && options.length > 2) {
            e.preventDefault();
            removeOption(index);
            const prevInput = document.querySelector<HTMLInputElement>(
                `input[data-option-index="${index - 1}"]`
            );
            prevInput?.focus();
        }
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (options.length >= 20) return;
        setOptions([...options, '']);
        setTimeout(() => {
            lastInputRef.current?.focus();
        }, 50);
    };

    const handleCreate = async () => {
        // Validation
        const validOptions = options.filter(o => o.trim() !== '');
        
        if (!title.trim()) {
            setError('Please add a question or title');
            return;
        }
        
        if (validOptions.length < 2) {
            setError('Please add at least 2 options');
            return;
        }

        setError(null);
        setIsCreating(true);
        
        try {
            const result = await createPoll({ 
                title: title.trim(), 
                description: description.trim() || undefined, 
                options: validOptions, 
                settings: { 
                    hideResults, 
                    allowGuestOptions: false 
                } 
            });
            
            trackEvent('votegenerator_poll_created', { 
                optionCount: validOptions.length,
                hasDescription: !!description.trim(),
                hideResults
            });
            
            // Navigate to admin view
            window.location.hash = `id=${result.id}&admin=${result.adminKey}`;
        } catch (e) {
            console.error('Failed to create poll:', e);
            setError(e instanceof Error ? e.message : 'Failed to create poll. Please try again.');
            setIsCreating(false);
        }
    };

    const validOptionCount = options.filter(o => o.trim() !== '').length;

    return (
        <div className="max-w-2xl mx-auto px-4">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 3 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200"
                >
                    <BarChart2 size={32} className="text-white" />
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-serif mb-3 tracking-tight">
                    VoteGenerator
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">
                    Create a ranked-choice poll in seconds. <br/>Find what everyone can agree on.
                </p>
            </motion.div>

            {/* Main Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100"
            >
                <div className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Question / Title
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-4 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
                            placeholder={placeholderQuestion}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={200}
                            autoFocus
                        />
                    </div>
                    
                    {/* Description (collapsible) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Description <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea 
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all h-20 resize-none placeholder:text-slate-300"
                            placeholder="Add context, deadline, or instructions..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {/* Options List */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Options
                            </label>
                            <span className="text-sm text-slate-400">
                                {validOptionCount} of 20 max
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {options.map((opt, i) => (
                                    <motion.div 
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        className="flex items-center gap-3 group"
                                    >
                                        <span className="text-slate-300 font-bold w-6 text-right text-sm">
                                            {i + 1}.
                                        </span>
                                        <div className="relative flex-1">
                                            <input 
                                                ref={i === options.length - 1 ? lastInputRef : undefined}
                                                type="text" 
                                                data-option-index={i}
                                                className="w-full p-3 pl-4 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-300"
                                                placeholder={`Option ${i + 1}`}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(i, e)}
                                                maxLength={200}
                                            />
                                        </div>
                                        {options.length > 2 && (
                                            <button 
                                                onClick={() => removeOption(i)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                tabIndex={-1}
                                                aria-label="Remove option"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {options.length < 20 && (
                            <button
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                            >
                                <Plus size={16} /> Add another option
                            </button>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="pt-4 border-t border-slate-100">
                        <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                            <input 
                                type="checkbox" 
                                checked={hideResults}
                                onChange={e => setHideResults(e.target.checked)}
                                className="w-5 h-5 mt-0.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {hideResults ? <EyeOff size={16} className="text-amber-500" /> : <Eye size={16} className="text-slate-400" />}
                                    <span className="font-bold text-slate-700">Hide results from voters</span>
                                </div>
                                <span className="text-sm text-slate-500 block mt-1">
                                    {hideResults 
                                        ? "Only you can see results until you choose to reveal them."
                                        : "Voters will see results after they vote."}
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                            >
                                <AlertCircle size={20} />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button 
                        onClick={handleCreate}
                        disabled={isCreating || validOptionCount < 2 || !title.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg transform active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="animate-spin" size={22} />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Create Poll
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
            
            {/* Feature Pills */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-3 gap-4 text-center"
            >
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <strong className="block text-indigo-900 mb-1">🗳️ Ranked Choice</strong>
                    <span className="text-indigo-700 text-sm">
                        Finds the option everyone can agree on
                    </span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <strong className="block text-emerald-900 mb-1">🔓 No Login</strong>
                    <span className="text-emerald-700 text-sm">
                        Share a link. Guests vote instantly.
                    </span>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <strong className="block text-purple-900 mb-1">📱 Mobile First</strong>
                    <span className="text-purple-700 text-sm">
                        Drag-to-rank works beautifully on phones
                    </span>
                </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center text-slate-500 text-sm"
            >
                <p>
                    <strong>How it works:</strong> Voters rank all options from favorite to least favorite. 
                    We use instant-runoff voting to find the winner everyone can live with.
                </p>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorCreate;

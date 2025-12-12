import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, EyeOff, AlertCircle, HelpCircle, ListOrdered, CheckSquare, Image as ImageIcon, Calendar } from 'lucide-react';
import { createPoll } from '../services/voteGeneratorService';

const POLL_TYPES = [
    {
        id: 'ranked',
        name: 'Ranked Choice',
        icon: ListOrdered,
        description: 'Voters drag options to rank from favorite to least favorite',
        bestFor: 'Best for: Finding the option everyone can agree on',
        example: 'e.g., "Where should we go for team dinner?"'
    },
    {
        id: 'multiple',
        name: 'Multiple Choice',
        icon: CheckSquare,
        description: 'Voters pick one option (or multiple if you allow it)',
        bestFor: 'Best for: Quick decisions with clear favorites',
        example: 'e.g., "What day works for the meeting?"'
    },
    {
        id: 'image',
        name: 'Image Poll',
        icon: ImageIcon,
        description: 'Voters choose between images (logos, designs, photos)',
        bestFor: 'Best for: Visual comparisons',
        example: 'e.g., "Which logo design?"',
        comingSoon: true
    },
    {
        id: 'meeting',
        name: 'Meeting Poll',
        icon: Calendar,
        description: 'Voters mark which times work for them',
        bestFor: 'Best for: Scheduling meetings',
        example: 'e.g., "When can everyone meet?"',
        comingSoon: true
    }
];

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
    const [pollType, setPollType] = useState<string>('ranked');
    const [hideResults, setHideResults] = useState(false);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPollTypeInfo, setShowPollTypeInfo] = useState(false);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    
    const lastInputRef = useRef<HTMLInputElement>(null);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        
        // Auto-add input field if typing in the last one
        if (index === options.length - 1 && value.trim() !== '' && options.length < 20) {
            setOptions([...newOptions, '']);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = document.querySelector<HTMLInputElement>(
                `input[data-option-index="${index + 1}"]`
            );
            if (nextInput) {
                nextInput.focus();
            } else if (options.length < 20) {
                setOptions([...options, '']);
                setTimeout(() => lastInputRef.current?.focus(), 50);
            }
        }
        
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
        setTimeout(() => lastInputRef.current?.focus(), 50);
    };

    const handleCreate = async () => {
        const validOptions = options.filter(o => o.trim() !== '');
        
        if (!title.trim()) {
            setError('Please add a title or question for your poll');
            return;
        }
        
        if (validOptions.length < 2) {
            setError('Please add at least 2 options for people to choose from');
            return;
        }

        setError(null);
        setIsCreating(true);
        
        try {
            const result = await createPoll({ 
                title: title.trim(), 
                description: description.trim() || undefined, 
                options: validOptions,
                pollType: pollType as 'ranked' | 'multiple',
                settings: { 
                    hideResults, 
                    allowMultiple
                } 
            });
            
            // Redirect to the new poll
            window.location.hash = `id=${result.id}&admin=${result.adminKey}`;
        } catch (e) {
            console.error('Failed to create poll:', e);
            setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
            setIsCreating(false);
        }
    };

    const validOptionCount = options.filter(o => o.trim() !== '').length;
    const selectedPollType = POLL_TYPES.find(t => t.id === pollType);

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 pt-10"
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
                    Create a free ranked-choice poll in seconds. <br/>Share a link. Get consensus.
                </p>
            </motion.div>

            {/* Main Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100"
            >
                <div className="space-y-6">
                    {/* Poll Type Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Poll Type
                            </label>
                            <button 
                                type="button"
                                onClick={() => setShowPollTypeInfo(!showPollTypeInfo)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <HelpCircle size={18} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {POLL_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                const isDisabled = type.comingSoon;
                                
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => !isDisabled && setPollType(type.id)}
                                        disabled={isDisabled}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : isDisabled
                                                ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {isDisabled && (
                                            <span className="absolute top-2 right-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                                                Soon
                                            </span>
                                        )}
                                        <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className={`block font-bold mt-2 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                            {type.name}
                                        </span>
                                        <span className="text-xs text-slate-500 block mt-1 leading-tight">
                                            {type.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Poll Type Info Tooltip */}
                        <AnimatePresence>
                            {showPollTypeInfo && selectedPollType && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 overflow-hidden"
                                >
                                    <p className="text-sm text-indigo-800 font-medium">{selectedPollType.bestFor}</p>
                                    <p className="text-sm text-indigo-600 mt-1">{selectedPollType.example}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Your Question
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-4 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
                            placeholder={placeholderQuestion}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={200}
                        />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Details <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea 
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all h-20 resize-none placeholder:text-slate-300"
                            placeholder="Add extra info, deadline, or instructions..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={500}
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                {pollType === 'ranked' ? 'Options to Rank' : 'Answer Choices'}
                            </label>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                {validOptionCount} / 20
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
                                        exit={{ opacity: 0, x: 20 }}
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
                                className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors p-2 hover:bg-indigo-50 rounded-lg -ml-2"
                            >
                                <Plus size={16} /> Add another option
                            </button>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="pt-6 border-t border-slate-100 space-y-3">
                        {/* Multiple Choice - Allow Multiple Selections */}
                        {pollType === 'multiple' && (
                            <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3 border border-transparent hover:border-slate-100">
                                <input 
                                    type="checkbox" 
                                    checked={allowMultiple}
                                    onChange={e => setAllowMultiple(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 accent-indigo-600 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className="font-bold text-slate-700">Allow multiple selections</span>
                                    <span className="text-sm text-slate-500 block mt-1">
                                        {allowMultiple 
                                            ? "Voters can pick more than one option"
                                            : "Voters can only pick one option"}
                                    </span>
                                </div>
                            </label>
                        )}

                        {/* Hide Results */}
                        <label className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3 border border-transparent hover:border-slate-100">
                            <input 
                                type="checkbox" 
                                checked={hideResults}
                                onChange={e => setHideResults(e.target.checked)}
                                className="w-5 h-5 mt-0.5 accent-indigo-600 cursor-pointer"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-700">Hide results until you reveal them</span>
                                    {hideResults ? <EyeOff size={16} className="text-amber-500" /> : <Eye size={16} className="text-slate-400" />}
                                </div>
                                <span className="text-sm text-slate-500 block mt-1">
                                    {hideResults 
                                        ? "Only admin (you) can see results initially."
                                        : "Voters see live results immediately after voting."}
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Error */}
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

                    {/* Submit */}
                    <button 
                        onClick={handleCreate}
                        disabled={isCreating || validOptionCount < 2 || !title.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg transform active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="animate-spin" size={22} />
                                Creating Poll...
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
            
            {/* Features */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-3 gap-4 text-center"
            >
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <strong className="block text-indigo-900 mb-1">🆓 100% Free</strong>
                    <span className="text-slate-500 text-sm">
                        No hidden costs or limits
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <strong className="block text-indigo-900 mb-1">🔓 No Sign Up</strong>
                    <span className="text-slate-500 text-sm">
                        Just create and share link
                    </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <strong className="block text-indigo-900 mb-1">📱 Modern</strong>
                    <span className="text-slate-500 text-sm">
                        Ranked Choice Voting
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorCreate;
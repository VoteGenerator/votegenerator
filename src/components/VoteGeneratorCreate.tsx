import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, EyeOff, AlertCircle, HelpCircle, ListOrdered, CheckSquare, Image as ImageIcon, Calendar, AlertTriangle, User, Shield, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
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
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPollTypeInfo, setShowPollTypeInfo] = useState(false);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    
    // Settings State
    const [hideResults, setHideResults] = useState(false);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [security, setSecurity] = useState<'browser' | 'code' | 'none'>('browser');
    const [voterCount, setVoterCount] = useState<number>(10);
    const [deadline, setDeadline] = useState<string>('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    const lastInputRef = useRef<HTMLInputElement>(null);

    // Get Timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Real-time duplicate detection
    const getDuplicateIndices = () => {
        const normalized = options.map(o => o.trim().toLowerCase());
        const duplicates = new Set<number>();
        const seen = new Map<string, number>();

        normalized.forEach((opt, index) => {
            if (opt === '') return;
            if (seen.has(opt)) {
                duplicates.add(index);
                duplicates.add(seen.get(opt)!);
            } else {
                seen.set(opt, index);
            }
        });
        return duplicates;
    };

    const duplicateIndices = getDuplicateIndices();
    const hasDuplicates = duplicateIndices.size > 0;

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        
        if (error && error.includes('Duplicate')) setError(null);

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
        setError(null);
        const validOptions = options.filter(o => o.trim() !== '');
        
        if (!title.trim()) {
            setError('Please add a title or question for your poll.');
            return;
        }
        
        if (validOptions.length < 2) {
            setError('Please add at least 2 options for people to choose from.');
            return;
        }

        if (hasDuplicates) {
            setError('Please resolve the duplicate options highlighted in red before creating.');
            return;
        }

        setIsCreating(true);
        
        try {
            const result = await createPoll({ 
                title: title.trim(), 
                description: description.trim() || undefined, 
                options: validOptions,
                pollType: pollType as 'ranked' | 'multiple',
                voterCount: security === 'code' ? voterCount : undefined,
                settings: { 
                    hideResults, 
                    allowMultiple,
                    requireNames,
                    security,
                    deadline: deadline ? new Date(deadline).toISOString() : undefined
                } 
            });
            
            window.location.hash = `id=${result.id}&admin=${result.adminKey}`;
        } catch (e) {
            console.error('Failed to create poll:', e);
            setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
            setIsCreating(false);
        }
    };

    const validOptionCount = options.filter(o => o.trim() !== '').length;

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
                                {options.map((opt, i) => {
                                    const isDuplicate = duplicateIndices.has(i);
                                    return (
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
                                                    className={`w-full p-3 pl-4 border-2 rounded-xl outline-none transition-all font-medium placeholder:text-slate-300 ${
                                                        isDuplicate 
                                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-red-900' 
                                                            : 'border-slate-200 focus:border-indigo-500'
                                                    }`}
                                                    placeholder={`Option ${i + 1}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                                    maxLength={200}
                                                />
                                                {isDuplicate && (
                                                    <div className="absolute right-3 top-3.5 text-red-500 animate-pulse">
                                                        <AlertTriangle size={18} />
                                                    </div>
                                                )}
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
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                        
                        {hasDuplicates && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm mt-2 ml-10 font-medium flex items-center gap-1"
                            >
                                <AlertTriangle size={14} /> Duplicate options detected. Please make them unique.
                            </motion.p>
                        )}

                        {options.length < 20 && (
                            <button
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors p-2 hover:bg-indigo-50 rounded-lg -ml-2"
                            >
                                <Plus size={16} /> Add another option
                            </button>
                        )}
                    </div>

                    {/* Settings Section */}
                    <div className="pt-6 border-t border-slate-100">
                         <h3 className="text-lg font-bold text-slate-800 mb-4">Settings</h3>
                         
                         <div className="space-y-4">
                             {/* Allow Multiple */}
                            {pollType === 'multiple' && (
                                <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-700">Allow multiple selections</div>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" checked={allowMultiple} onChange={e => setAllowMultiple(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                </label>
                            )}

                            {/* Require Names */}
                            <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                <div className="flex-1 flex items-center gap-2">
                                    <User size={18} className="text-slate-400" />
                                    <div className="font-bold text-slate-700">Require participant names</div>
                                </div>
                                <div className="relative">
                                    <input type="checkbox" checked={requireNames} onChange={e => setRequireNames(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                            </label>

                            {/* Advanced Dropdown */}
                            <div className="pt-2">
                                <button 
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:text-indigo-700"
                                >
                                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    {showAdvanced ? 'Hide advanced settings' : 'Show advanced settings'}
                                </button>

                                <AnimatePresence>
                                    {showAdvanced && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="space-y-5 pt-5 pb-2">
                                                {/* Deadline */}
                                                <div>
                                                    <div className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                                                        <Clock size={16} className="text-slate-400" /> Close poll on a scheduled date
                                                    </div>
                                                    <input 
                                                        type="datetime-local" 
                                                        value={deadline}
                                                        onChange={(e) => setDeadline(e.target.value)}
                                                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-700"
                                                    />
                                                    <p className="text-xs text-slate-400 mt-2 ml-1 flex items-center gap-1">
                                                        <Info size={12}/> Timezone: {userTimeZone}
                                                    </p>
                                                </div>

                                                {/* Security Dropdown */}
                                                <div>
                                                    <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Shield size={16} className="text-slate-400" /> Voting security
                                                        </div>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                                                            className="text-xs font-normal text-indigo-600 hover:underline"
                                                        >
                                                            {showSecurityInfo ? "Hide info" : "Learn more"}
                                                        </button>
                                                    </div>

                                                    <div className="relative">
                                                        <select 
                                                            value={security}
                                                            onChange={(e) => setSecurity(e.target.value as 'browser' | 'code' | 'none')}
                                                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none appearance-none bg-white text-slate-700 font-medium"
                                                        >
                                                            <option value="browser">One vote per browser session</option>
                                                            <option value="code">One vote per unique code</option>
                                                            <option value="none">None (Multiple votes per person)</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                                                    </div>

                                                    {/* Security Info Panel */}
                                                    <AnimatePresence>
                                                        {showSecurityInfo && (
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="mt-3 bg-indigo-50 p-4 rounded-xl text-sm space-y-2 text-indigo-900 border border-indigo-100">
                                                                    <p><strong>Browser Session:</strong> Checks a cookie in your browser. Good for casual polls. (Determined users can clear cache to vote again).</p>
                                                                    <p><strong>Unique Code:</strong> Most secure. You will get a list of codes to distribute. Each voter needs one code to vote once.</p>
                                                                    <p><strong>None:</strong> Unlimited votes. Good for testing or shared kiosks.</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Voter Count for Unique Code */}
                                                    {security === 'code' && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -10 }} 
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="mt-3"
                                                        >
                                                            <label className="block text-sm font-bold text-slate-700 mb-1">
                                                                How many voters do you expect?
                                                            </label>
                                                            <input 
                                                                type="number"
                                                                min={1}
                                                                max={500}
                                                                value={voterCount}
                                                                onChange={(e) => setVoterCount(parseInt(e.target.value) || 0)}
                                                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                                                                placeholder="e.g. 50"
                                                            />
                                                            <p className="text-xs text-slate-500 mt-1">We will generate this many unique codes for you to distribute.</p>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Hide Results */}
                                                 <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                                    <div className="flex-1 flex items-center gap-2">
                                                        {hideResults ? <EyeOff size={18} className="text-amber-500" /> : <Eye size={18} className="text-slate-400" />}
                                                        <div>
                                                            <div className="font-bold text-slate-700">Hide results from voters</div>
                                                            <div className="text-xs text-slate-400 font-normal">Only admin sees results</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                         </div>
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
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button 
                        onClick={handleCreate}
                        disabled={isCreating || validOptionCount < 2 || !title.trim() || hasDuplicates}
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
        </div>
    );
};

export default VoteGeneratorCreate;
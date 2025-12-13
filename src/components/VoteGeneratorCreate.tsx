import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, EyeOff, AlertCircle, HelpCircle, ListOrdered, CheckSquare, Calendar, AlertTriangle, User, Shield, ChevronDown, ChevronUp, Clock, Hash, Check, MessageSquare, Globe, Lock, Coins, LayoutGrid, GitCompare, SlidersHorizontal } from 'lucide-react';
import { createPoll } from '../services/voteGeneratorService';

const POLL_TYPES = [
    {
        id: 'ranked',
        name: 'Ranked Choice',
        icon: ListOrdered,
        description: 'Voters rank options in order of preference. Finds the consensus winner.',
        bestFor: 'Perfect for: Group decisions (lunch, movies) to avoid split votes.',
        example: 'e.g., "Where should we have lunch?"',
        // Theme Colors
        selectedBorder: 'border-indigo-500',
        selectedBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700'
    },
    {
        id: 'rating',
        name: 'Continuous Rating',
        icon: SlidersHorizontal,
        description: 'Voters rate each option on a scale (0-100). Good for nuance.',
        bestFor: 'Perfect for: Performance reviews, feedback, or measuring sentiment.',
        example: 'e.g., "Rate these potential features."',
        selectedBorder: 'border-cyan-500',
        selectedBg: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
        textColor: 'text-cyan-700'
    },
    {
        id: 'pairwise',
        name: 'Pairwise Comparison',
        icon: GitCompare,
        description: 'Voters choose between two options at a time ("This or That").',
        bestFor: 'Perfect for: Large lists, logos, or quick gut-check decisions.',
        example: 'e.g., "Which logo is better?"',
        selectedBorder: 'border-orange-500',
        selectedBg: 'bg-orange-50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700'
    },
    {
        id: 'matrix',
        name: 'Priority Matrix',
        icon: LayoutGrid,
        description: 'Voters drag items onto a 2D grid (Impact vs Effort). Visualizes priorities.',
        bestFor: 'Perfect for: Agile planning and deciding what to build next.',
        example: 'e.g., "Feature Roadmap 2026"',
        selectedBorder: 'border-fuchsia-500',
        selectedBg: 'bg-fuchsia-50',
        iconColor: 'text-fuchsia-600',
        textColor: 'text-fuchsia-800'
    },
    {
        id: 'multiple',
        name: 'Multiple Choice',
        icon: CheckSquare,
        description: 'The classic poll. Voters select one or more options.',
        bestFor: 'Perfect for: Simple "this or that" decisions.',
        example: 'e.g., "Who should be team captain?"',
        selectedBorder: 'border-blue-500',
        selectedBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700'
    },
    {
        id: 'dot',
        name: 'Dot Voting',
        icon: Coins,
        description: 'Voters get a budget of points ("dots") to spend on their favorite ideas.',
        bestFor: 'Perfect for: Budgeting and measuring intensity of preference.',
        example: 'e.g., "How should we spend our party budget?"',
        selectedBorder: 'border-emerald-500',
        selectedBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        textColor: 'text-emerald-700'
    },
    {
        id: 'meeting',
        name: 'Meeting Poll',
        icon: Calendar,
        description: 'Voters mark all the dates and times they are available.',
        bestFor: 'Perfect for: Scheduling events without endless emails.',
        example: 'e.g., "When is everyone free?"',
        selectedBorder: 'border-amber-500',
        selectedBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-800'
    }
];

const PLACEHOLDER_QUESTIONS = [
    "Where should we eat lunch?",
    "What movie should we watch?",
    "When should we have the meeting?",
    "Which features should we build next?",
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
    
    // Meeting specific state
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Settings State
    const [hideResults, setHideResults] = useState(false);
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [allowComments, setAllowComments] = useState(false);
    const [publicComments, setPublicComments] = useState(true);
    const [blockVpn, setBlockVpn] = useState(false);
    const [security, setSecurity] = useState<'browser' | 'code' | 'none'>('browser');
    const [voterCount, setVoterCount] = useState<number>(10);
    const [deadline, setDeadline] = useState<string>('');
    const [maxVotes, setMaxVotes] = useState<number | ''>('');
    const [dotBudget, setDotBudget] = useState<number>(10); // Default budget
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

        if (index === options.length - 1 && value.trim() !== '' && options.length < 20 && pollType !== 'meeting') {
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
            } else if (options.length < 20 && pollType !== 'meeting') {
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
        if (pollType === 'meeting') {
             setOptions(options.filter((_, i) => i !== index));
             return;
        }
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (options.length >= 20) return;
        setOptions([...options, '']);
        setTimeout(() => lastInputRef.current?.focus(), 50);
    };

    // Meeting specific handler
    const addMeetingSlot = () => {
        if (!meetingDate || !meetingTime) return;
        
        try {
             const [year, month, day] = meetingDate.split('-').map(Number);
             const [hours, minutes] = meetingTime.split(':').map(Number);
             
             const d = new Date(year, month - 1, day, hours, minutes);
             
             // Format: "Mon, Oct 23 • 10:00 AM EDT"
             const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
             const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
             
             const newOption = `${dateStr} • ${timeStr}`;
             
             // Add to options, filter out blanks if any
             const currentOptions = options.filter(o => o.trim() !== '');
             setOptions([...currentOptions, newOption]);
             
             setMeetingTime('');
        } catch (e) {
            console.error(e);
        }
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
                pollType: pollType as any,
                voterCount: security === 'code' ? voterCount : undefined,
                settings: { 
                    hideResults, 
                    allowMultiple: pollType === 'meeting' ? true : allowMultiple, // Meeting implies multiple
                    requireNames,
                    allowComments,
                    publicComments,
                    blockVpn,
                    security,
                    dotBudget: pollType === 'dot' ? dotBudget : undefined,
                    deadline: deadline ? new Date(deadline).toISOString() : undefined,
                    maxVotes: maxVotes === '' ? undefined : Number(maxVotes),
                    timezone: pollType === 'meeting' ? timezone : undefined
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
                                Poll Type <span className="text-red-500 ml-1">*</span>
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
                                
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                             setPollType(type.id);
                                             if (type.id === 'meeting') {
                                                 setOptions([]); // Clear standard options
                                             } else if (options.length === 0) {
                                                 setOptions(['', '', '']);
                                             }
                                        }}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                            isSelected
                                                ? `${type.selectedBorder} ${type.selectedBg}`
                                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon size={20} className={isSelected ? type.iconColor : 'text-slate-400'} />
                                        <span className={`block font-bold mt-2 ${isSelected ? type.textColor : 'text-slate-700'}`}>
                                            {type.name}
                                        </span>
                                        <span className={`text-xs block mt-1 leading-tight ${isSelected ? type.textColor : 'text-slate-500'}`}>
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
                                    className={`mt-3 p-4 rounded-xl border overflow-hidden ${selectedPollType.selectedBg} ${selectedPollType.selectedBorder}`}
                                >
                                    <p className={`text-sm font-medium ${selectedPollType.textColor}`}>{selectedPollType.bestFor}</p>
                                    <p className={`text-sm mt-1 opacity-80 ${selectedPollType.textColor}`}>{selectedPollType.example}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            {pollType === 'meeting' ? 'Event Name' : 'Your Question'} <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-4 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300"
                            placeholder={pollType === 'meeting' ? "e.g., Q3 Strategy Meeting" : placeholderQuestion}
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

                    {/* Options (Standard or Meeting) */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                {pollType === 'ranked' ? 'Options to Rank' : pollType === 'meeting' ? 'Time Slots' : pollType === 'pairwise' ? 'Items to Compare' : pollType === 'rating' ? 'Items to Rate' : 'Options'} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                {validOptionCount} {pollType !== 'meeting' ? '/ 20' : ''}
                            </span>
                        </div>
                        
                        {/* MEETING DATE/TIME PICKER */}
                        {pollType === 'meeting' && (
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-4">
                                <label className="block text-xs font-bold text-indigo-900 mb-2">Add Date & Time <span className="text-red-500 ml-1">*</span></label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="date" 
                                        value={meetingDate}
                                        onChange={(e) => setMeetingDate(e.target.value)}
                                        className="p-2 border border-indigo-200 rounded-lg text-sm flex-1 outline-none focus:border-indigo-500 text-slate-700 font-bold"
                                    />
                                    <input 
                                        type="time" 
                                        value={meetingTime}
                                        onChange={(e) => setMeetingTime(e.target.value)}
                                        className="p-2 border border-indigo-200 rounded-lg text-sm w-32 outline-none focus:border-indigo-500 text-slate-700 font-bold"
                                    />
                                    <button 
                                        onClick={addMeetingSlot}
                                        disabled={!meetingDate || !meetingTime}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                                <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between">
                                    <div className="text-xs text-indigo-700 font-bold">Timezone:</div>
                                    <input 
                                        type="text" 
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        className="text-xs text-right bg-transparent border-b border-indigo-200 text-indigo-600 outline-none w-1/2 focus:border-indigo-400"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {options.map((opt, i) => {
                                    const isDuplicate = duplicateIndices.has(i);
                                    // Filter out blanks for Meeting type if they somehow got in, but allow for others
                                    if(pollType === 'meeting' && opt.trim() === '') return null;

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
                                                    placeholder={pollType === 'meeting' ? `e.g. Mon, Oct 23 • 10:00 AM EDT` : `Option ${i + 1}`}
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
                                            {(options.length > 2 || pollType === 'meeting') && (
                                                <button 
                                                    onClick={() => removeOption(i)}
                                                    className={`p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:opacity-100 ${pollType === 'meeting' ? 'opacity-100 text-slate-400' : 'opacity-0 group-hover:opacity-100'}`}
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

                        {options.length < 20 && pollType !== 'meeting' && (
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
                         {/* ... Keep rest of settings logic ... */}
                         <h3 className="text-lg font-bold text-slate-800 mb-4">Settings</h3>
                         
                         <div className="space-y-4">
                             
                             {/* Dot Voting Budget */}
                             {pollType === 'dot' && (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                                     <label className="block text-sm font-bold text-indigo-900 mb-2">
                                        Points Per Voter
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <Coins size={20} className="text-indigo-500" />
                                        <input 
                                            type="number" 
                                            min={1} 
                                            max={100}
                                            value={dotBudget}
                                            onChange={(e) => setDotBudget(Math.max(1, parseInt(e.target.value) || 0))}
                                            className="w-20 p-2 text-center font-bold text-indigo-900 border border-indigo-200 rounded-lg outline-none focus:border-indigo-500"
                                        />
                                        <span className="text-sm text-indigo-700">points available to distribute</span>
                                    </div>
                                </div>
                             )}

                             {/* Allow Multiple (Hidden for Dot/Meeting as it's inherent) */}
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
                            
                            {/* Allow Comments Group */}
                            <div className="p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors -mx-3 border border-transparent hover:border-slate-100">
                                <label className="flex items-center justify-between cursor-pointer group mb-2">
                                    <div className="flex-1 flex items-center gap-2">
                                        <MessageSquare size={18} className="text-slate-400" />
                                        <div className="font-bold text-slate-700">Allow comments</div>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                </label>
                                
                                {/* Sub-setting for Comment Visibility */}
                                <AnimatePresence>
                                    {allowComments && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pl-7"
                                        >
                                            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 py-1">
                                                <input 
                                                    type="checkbox" 
                                                    checked={publicComments} 
                                                    onChange={e => setPublicComments(e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                Show comments to everyone (if unchecked, only admin sees them)
                                            </label>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Hide Results */}
                            <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                <div className="flex-1 flex items-center gap-2">
                                    {hideResults ? <EyeOff size={18} className="text-amber-500" /> : <Eye size={18} className="text-slate-400" />}
                                    <div>
                                        <div className="font-bold text-slate-700">Hide results from voters</div>
                                        <div className="text-xs text-slate-500 font-normal">Only admin sees results</div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="sr-only peer" />
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
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 space-y-6">
                                                {/* Security Settings */}
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                            <Shield size={16} className="text-slate-500" /> 
                                                            Vote Security
                                                        </h4>
                                                        <button onClick={() => setShowSecurityInfo(!showSecurityInfo)} className="text-slate-400 hover:text-indigo-600">
                                                            <HelpCircle size={14} />
                                                        </button>
                                                    </div>

                                                    {showSecurityInfo && (
                                                        <p className="text-xs text-slate-500 mb-3 bg-white p-2 rounded border border-slate-100">
                                                            <strong>Browser Check:</strong> Good for casual polls. Checks cookies/local storage.<br/>
                                                            <strong>Access Codes:</strong> Best for strict control. You generate codes to give to people.<br/>
                                                            <strong>None:</strong> Allow multiple votes from same person.
                                                        </p>
                                                    )}

                                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                                        {(['browser', 'code', 'none'] as const).map(sec => (
                                                            <button
                                                                key={sec}
                                                                onClick={() => setSecurity(sec)}
                                                                className={`py-2 px-1 rounded-lg text-xs font-bold capitalize transition-all border ${
                                                                    security === sec 
                                                                        ? 'bg-white border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500'
                                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                                }`}
                                                            >
                                                                {sec === 'browser' ? 'Browser Check' : sec === 'code' ? 'Access Codes' : 'No Security'}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Security Disclaimer */}
                                                    {security !== 'code' && (
                                                        <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-white p-2 rounded border border-slate-100">
                                                            <Lock size={12} className="mt-0.5 shrink-0" />
                                                            <span>
                                                                Note: Browser/VPN checks are good for casual polls but not 100% hack-proof against tech-savvy users. Use <strong>Access Codes</strong> for strict control.
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* If Codes Selected */}
                                                    {security === 'code' && (
                                                        <div className="mt-3">
                                                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                                                How many voters? <span className="text-red-500 ml-1">*</span>
                                                            </label>
                                                            <input 
                                                                type="number" 
                                                                min={1} 
                                                                max={100}
                                                                value={voterCount}
                                                                onChange={(e) => setVoterCount(parseInt(e.target.value) || 1)}
                                                                className="w-full p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            />
                                                            <p className="text-[10px] text-slate-400 mt-1">
                                                                We'll generate {voterCount} unique codes for you to distribute.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Block VPN Settings */}
                                                <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <Globe size={18} className="text-slate-400" />
                                                        <div>
                                                            <div className="font-bold text-slate-700 text-xs uppercase">Block VPN / Proxies</div>
                                                            <div className="text-[10px] text-slate-500 font-normal">Helps prevent bots & anonymous proxies</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input type="checkbox" checked={blockVpn} onChange={e => setBlockVpn(e.target.checked)} className="sr-only peer" />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </div>
                                                </label>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Deadline */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                            <Clock size={12} /> Close poll on date
                                                        </label>
                                                        <input 
                                                            type="datetime-local" 
                                                            className="w-full p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            value={deadline}
                                                            onChange={(e) => setDeadline(e.target.value)}
                                                        />
                                                        {deadline && (
                                                            <p className="text-emerald-600 text-[10px] mt-1 font-bold flex items-center gap-1 animate-pulse">
                                                                <Check size={10} strokeWidth={3} /> Selected: {new Date(deadline).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                        <p className="text-[10px] text-slate-400 mt-1">Timezone: {userTimeZone}</p>
                                                    </div>
                                                    
                                                    {/* Max Votes */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                                            <Hash size={12} /> Vote Limit
                                                        </label>
                                                        <input 
                                                            type="number" 
                                                            min={1}
                                                            placeholder="Unlimited"
                                                            className="w-full p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                                                            value={maxVotes}
                                                            onChange={(e) => setMaxVotes(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                        />
                                                        <p className="text-[10px] text-slate-400 mt-1">Auto-close after X votes</p>
                                                    </div>
                                                </div>
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
                                <AlertCircle size={20} />
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
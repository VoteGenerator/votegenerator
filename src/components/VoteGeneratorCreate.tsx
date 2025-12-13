import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, EyeOff, AlertCircle, HelpCircle, ListOrdered, CheckSquare, Calendar, AlertTriangle, User, Shield, ChevronDown, ChevronUp, Clock, Hash, Check, MessageSquare, Globe, Lock, Coins, LayoutGrid, GitCompare, SlidersHorizontal, DollarSign, Image as ImageIcon, Upload, X } from 'lucide-react';
import { createPoll } from '../services/voteGeneratorService';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';

const POLL_TYPES = [
    {
        id: 'ranked',
        name: 'Ranked Choice',
        icon: ListOrdered,
        description: 'Voters rank options in order of preference. Finds the consensus winner.',
        bestFor: 'Perfect for: Group decisions (lunch, movies) to avoid split votes.',
        example: 'e.g., "Where should we have lunch?"',
        selectedBorder: 'border-indigo-500',
        selectedBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700'
    },
    {
        id: 'image',
        name: 'Visual Poll',
        icon: ImageIcon,
        description: 'Voters choose between images displayed in a beautiful grid.',
        bestFor: 'Perfect for: Design contests, logo selection, photo competitions.',
        example: 'e.g., "Which logo design is best?"',
        selectedBorder: 'border-pink-500',
        selectedBg: 'bg-pink-50',
        iconColor: 'text-pink-600',
        textColor: 'text-pink-700'
    },
    {
        id: 'budget',
        name: 'Buy a Feature',
        icon: DollarSign,
        description: 'Voters have a budget to "buy" options with different costs.',
        bestFor: 'Perfect for: Prioritizing features or allocation of funds.',
        example: 'e.g., "Feature Roadmap 2026"',
        selectedBorder: 'border-green-500',
        selectedBg: 'bg-green-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-700'
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
    "Which design concept is best?"
];

const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [optionCosts, setOptionCosts] = useState<number[]>([10, 10, 10]);
    // For image polls: parallel array for image URLs
    const [optionImages, setOptionImages] = useState<string[]>(['', '', '']);
    // Loading state for individual image uploads
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    
    const [pollType, setPollType] = useState<string>('ranked');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPollTypeInfo, setShowPollTypeInfo] = useState(false);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

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
    const [dotBudget, setDotBudget] = useState<number>(10);
    const [budgetLimit, setBudgetLimit] = useState<number>(100);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);

    const lastInputRef = useRef<HTMLInputElement>(null);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        
        if (error && error.includes('Duplicate')) setError(null);

        // Auto add row if typing in last text input (except for image poll where interaction is different)
        if (pollType !== 'image' && index === options.length - 1 && value.trim() !== '' && options.length < 20 && pollType !== 'meeting') {
            setOptions([...newOptions, '']);
            setOptionCosts([...optionCosts, 10]);
            setOptionImages([...optionImages, '']);
        }
    };

    const handleCostChange = (index: number, value: string) => {
        const newCosts = [...optionCosts];
        const num = parseInt(value);
        newCosts[index] = isNaN(num) ? 0 : Math.max(0, num);
        setOptionCosts(newCosts);
    };

    const handleImageUpload = async (index: number, file: File) => {
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            setError('Image too large. Max size is 5MB.');
            return;
        }

        if (!CLOUDINARY_CLOUD_NAME) {
            setError('Cloudinary Cloud Name is missing in src/config.ts');
            return;
        }

        setUploadingIndex(index);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'votegenerator');

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (!res.ok) {
                 console.error("Cloudinary Error:", data);
                 throw new Error(data.error?.message || 'Upload failed');
            }

            if (data.secure_url) {
                const newImages = [...optionImages];
                newImages[index] = data.secure_url;
                setOptionImages(newImages);
                
                // If it was the last slot, add a new one
                if (index === options.length - 1 && options.length < 20) {
                    setOptions([...options, '']);
                    setOptionCosts([...optionCosts, 10]);
                    setOptionImages([...newImages, '']);
                }
            } else {
                throw new Error('Upload failed - No URL returned');
            }
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? `Upload failed: ${e.message}` : 'Failed to upload image. Please try again.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const removeOption = (index: number) => {
        if (pollType === 'meeting') {
             setOptions(options.filter((_, i) => i !== index));
             return;
        }
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
        setOptionCosts(optionCosts.filter((_, i) => i !== index));
        setOptionImages(optionImages.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (options.length >= 20) return;
        setOptions([...options, '']);
        setOptionCosts([...optionCosts, 10]);
        setOptionImages([...optionImages, '']);
        if (pollType !== 'image') setTimeout(() => lastInputRef.current?.focus(), 50);
    };

    const addMeetingSlot = () => {
        if (!meetingDate || !meetingTime) return;
        try {
             const [year, month, day] = meetingDate.split('-').map(Number);
             const [hours, minutes] = meetingTime.split(':').map(Number);
             const d = new Date(year, month - 1, day, hours, minutes);
             const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
             const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
             const newOption = `${dateStr} • ${timeStr}`;
             const currentOptions = options.filter(o => o.trim() !== '');
             setOptions([...currentOptions, newOption]);
             setMeetingTime('');
        } catch (e) { console.error(e); }
    };

    const handleCreate = async () => {
        setError(null);
        
        // Filter options. For Image polls, image is required. For others, text is required.
        const validOptions: { text: string; cost?: number; imageUrl?: string }[] = [];
        
        options.forEach((text, i) => {
            if (pollType === 'image') {
                if (optionImages[i]) {
                    validOptions.push({
                        text: text.trim() || `Image ${i + 1}`, // Default text if empty
                        imageUrl: optionImages[i]
                    });
                }
            } else {
                if (text.trim() !== '') {
                    const opt: { text: string; cost?: number } = { text: text.trim() };
                    if (pollType === 'budget') opt.cost = optionCosts[i];
                    validOptions.push(opt);
                }
            }
        });
        
        if (!title.trim()) {
            setError('Please add a title or question for your poll.');
            return;
        }
        
        if (validOptions.length < 2) {
            setError('Please add at least 2 options for people to choose from.');
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
                    allowMultiple: pollType === 'meeting' ? true : allowMultiple, 
                    requireNames,
                    allowComments,
                    publicComments,
                    blockVpn,
                    security,
                    dotBudget: pollType === 'dot' ? dotBudget : undefined,
                    budgetLimit: pollType === 'budget' ? budgetLimit : undefined,
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

    const validOptionCount = pollType === 'image' 
        ? optionImages.filter(i => !!i).length 
        : options.filter(o => o.trim() !== '').length;
        
    const validTextOptions = options.map(o => o.trim()).filter(o => o !== '');
    const hasDuplicates = pollType !== 'image' && validTextOptions.length > 0 && new Set(validTextOptions).size !== validTextOptions.length;

    const selectedPollType = POLL_TYPES.find(t => t.id === pollType);

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 pt-10">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 3 }} transition={{ type: "spring", delay: 0.1 }} className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                    <BarChart2 size={32} className="text-white" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 font-serif mb-3 tracking-tight">VoteGenerator</h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">Create a free ranked-choice poll in seconds.</p>
            </motion.div>

            {/* Main Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <div className="space-y-6">
                    {/* Poll Type Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Poll Type <span className="text-red-500 ml-1">*</span></label>
                            <button type="button" onClick={() => setShowPollTypeInfo(!showPollTypeInfo)} className="text-slate-400 hover:text-indigo-600 transition-colors"><HelpCircle size={18} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {POLL_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                return (
                                    <button key={type.id} type="button" onClick={() => { 
                                        setPollType(type.id);
                                        if (type.id === 'meeting') setOptions([]); 
                                        else if (options.length === 0) { setOptions(['', '', '']); setOptionCosts([10, 10, 10]); setOptionImages(['', '', '']); }
                                    }} className={`relative p-4 rounded-xl border-2 text-left transition-all ${isSelected ? `${type.selectedBorder} ${type.selectedBg}` : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                                        <Icon size={20} className={isSelected ? type.iconColor : 'text-slate-400'} />
                                        <span className={`block font-bold mt-2 ${isSelected ? type.textColor : 'text-slate-700'}`}>{type.name}</span>
                                        <span className={`text-xs block mt-1 leading-tight ${isSelected ? type.textColor : 'text-slate-500'}`}>{type.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{pollType === 'meeting' ? 'Event Name' : 'Your Question'} <span className="text-red-500 ml-1">*</span></label>
                        <input type="text" className="w-full p-4 text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300" placeholder={pollType === 'meeting' ? "e.g., Q3 Strategy Meeting" : placeholderQuestion} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
                    </div>
                    
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Details <span className="font-normal text-slate-400">(optional)</span></label>
                        <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all h-20 resize-none placeholder:text-slate-300" placeholder="Add extra info, deadline, or instructions..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
                    </div>

                    {/* Options */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                {pollType === 'ranked' ? 'Options to Rank' : pollType === 'meeting' ? 'Time Slots' : pollType === 'budget' ? 'Features to Buy' : pollType === 'image' ? 'Images' : 'Options'} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                {validOptionCount} {pollType !== 'meeting' ? '/ 20' : ''}
                            </span>
                        </div>
                        
                        {/* MEETING DATE/TIME PICKER */}
                        {pollType === 'meeting' && (
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mb-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="p-2 border border-indigo-200 rounded-lg text-sm flex-1 outline-none focus:border-indigo-500 text-slate-700 font-bold" />
                                    <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="p-2 border border-indigo-200 rounded-lg text-sm w-32 outline-none focus:border-indigo-500 text-slate-700 font-bold" />
                                    <button onClick={addMeetingSlot} disabled={!meetingDate || !meetingTime} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"><Plus size={16} /> Add</button>
                                </div>
                            </div>
                        )}

                        {/* VISUAL IMAGE POLL UPLOADER */}
                        {pollType === 'image' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {optionImages.map((img, i) => (
                                    <div key={i} className="relative group">
                                        <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors relative ${img ? 'border-indigo-200 bg-slate-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                                            {img ? (
                                                <img src={img} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2">
                                                    {uploadingIndex === i ? (
                                                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                                                    ) : (
                                                        <>
                                                            <Upload size={24} className="text-slate-400 mb-2" />
                                                            <span className="text-xs text-slate-500 text-center font-medium">Upload</span>
                                                        </>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => e.target.files && handleImageUpload(i, e.target.files[0])} 
                                                        disabled={uploadingIndex !== null}
                                                    />
                                                </label>
                                            )}
                                            {img && (
                                                <button onClick={() => {
                                                    const newImgs = [...optionImages]; newImgs[i] = ''; setOptionImages(newImgs);
                                                    if(options.length > 2 && i < options.length -1) removeOption(i);
                                                }} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={options[i]} 
                                            onChange={(e) => handleOptionChange(i, e.target.value)}
                                            placeholder={`Caption (Optional)`}
                                            className="w-full mt-1 text-xs text-center border-b border-transparent focus:border-indigo-300 outline-none bg-transparent" 
                                        />
                                    </div>
                                ))}
                                {options.length < 20 && (
                                    <button onClick={addOption} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all">
                                        <Plus size={24} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            /* STANDARD TEXT INPUTS */
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {options.map((opt, i) => {
                                        if(pollType === 'meeting' && opt.trim() === '') return null;
                                        return (
                                            <motion.div key={i} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-3 group">
                                                <span className="text-slate-300 font-bold w-6 text-right text-sm">{i + 1}.</span>
                                                <div className="relative flex-1 flex gap-2">
                                                    <input 
                                                        ref={i === options.length - 1 ? lastInputRef : undefined}
                                                        type="text" 
                                                        className="w-full p-3 pl-4 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-300"
                                                        placeholder={pollType === 'meeting' ? `e.g. Mon, Oct 23 • 10:00 AM EDT` : `Option ${i + 1}`}
                                                        value={opt}
                                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                                        maxLength={200}
                                                    />
                                                    {pollType === 'budget' && (
                                                        <div className="relative w-24 shrink-0">
                                                            <span className="absolute left-3 top-3.5 text-slate-400 text-sm font-bold">$</span>
                                                            <input type="number" min="0" placeholder="Cost" value={optionCosts[i] || ''} onChange={(e) => handleCostChange(i, e.target.value)} className="w-full p-3 pl-6 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 font-bold text-slate-700 text-right" />
                                                        </div>
                                                    )}
                                                </div>
                                                {(options.length > 2 || pollType === 'meeting') && (
                                                    <button onClick={() => removeOption(i)} className={`p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:opacity-100 ${pollType === 'meeting' ? 'opacity-100 text-slate-400' : 'opacity-0 group-hover:opacity-100'}`} tabIndex={-1}><Trash2 size={18} /></button>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                                {options.length < 20 && pollType !== 'meeting' && (
                                    <button onClick={addOption} className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors p-2 hover:bg-indigo-50 rounded-lg -ml-2"><Plus size={16} /> Add another option</button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Settings Section */}
                    <div className="pt-6 border-t border-slate-100">
                         <h3 className="text-lg font-bold text-slate-800 mb-4">Settings</h3>
                         
                         <div className="space-y-4">
                             {/* Dot Budget */}
                             {pollType === 'dot' && (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                                     <label className="block text-sm font-bold text-indigo-900 mb-2">Points Per Voter</label>
                                     <div className="flex items-center gap-3">
                                        <Coins size={20} className="text-indigo-500" />
                                        <input type="number" min={1} max={100} value={dotBudget} onChange={(e) => setDotBudget(Math.max(1, parseInt(e.target.value) || 0))} className="w-20 p-2 text-center font-bold text-indigo-900 border border-indigo-200 rounded-lg outline-none focus:border-indigo-500" />
                                     </div>
                                </div>
                             )}
                             {/* Budget Limit */}
                             {pollType === 'budget' && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl mb-4">
                                     <label className="block text-sm font-bold text-green-900 mb-2">Budget Per Voter</label>
                                     <div className="flex items-center gap-3">
                                        <DollarSign size={20} className="text-green-600" />
                                        <input type="number" min={1} value={budgetLimit} onChange={(e) => setBudgetLimit(Math.max(1, parseInt(e.target.value) || 0))} className="w-24 p-2 text-center font-bold text-green-900 border border-green-200 rounded-lg outline-none focus:border-green-500" />
                                     </div>
                                </div>
                             )}
                             {/* Standard Settings */}
                             <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                <div className="flex-1 font-bold text-slate-700">Require names</div>
                                <input type="checkbox" checked={requireNames} onChange={e => setRequireNames(e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                             </label>
                             <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                <div className="flex-1 font-bold text-slate-700">Allow comments</div>
                                <input type="checkbox" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                             </label>
                             <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-slate-50 transition-colors -mx-3">
                                <div className="flex-1 font-bold text-slate-700">Hide results</div>
                                <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="accent-indigo-600 w-5 h-5" />
                             </label>
                             
                             <div className="pt-2">
                                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:text-indigo-700">
                                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />} {showAdvanced ? 'Hide advanced settings' : 'Show advanced settings'}
                                </button>
                                {showAdvanced && (
                                    <div className="pt-4 space-y-4">
                                        {/* Security */}
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <h4 className="text-sm font-bold text-slate-700 mb-2">Vote Security</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['browser', 'code', 'none'] as const).map(sec => (
                                                    <button key={sec} onClick={() => setSecurity(sec)} className={`py-2 px-1 rounded-lg text-xs font-bold capitalize border ${security === sec ? 'bg-white border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>{sec === 'browser' ? 'Browser Check' : sec === 'code' ? 'Access Codes' : 'No Security'}</button>
                                                ))}
                                            </div>
                                            {security === 'code' && <input type="number" min={1} value={voterCount} onChange={(e) => setVoterCount(parseInt(e.target.value) || 1)} className="mt-2 w-full p-2 text-sm border border-slate-300 rounded-lg" placeholder="Number of voters" />}
                                        </div>
                                    </div>
                                )}
                             </div>
                         </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                <AlertCircle size={20} /> <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                        {hasDuplicates && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                                <AlertTriangle size={20} /> <span className="font-medium">Duplicate options are not allowed.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button onClick={handleCreate} disabled={isCreating || validOptionCount < 2 || !title.trim() || hasDuplicates} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg transform active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed">
                        {isCreating ? <><Loader2 className="animate-spin" size={22} /> Creating Poll...</> : <><Sparkles size={20} /> Create Poll <ArrowRight size={20} /></>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorCreate;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, AlertTriangle, ChevronDown, ChevronUp, Lock, SlidersHorizontal, Image as ImageIcon, Upload, Smartphone, Monitor, Users, ArrowLeftRight } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';
import ThemeSelector from './ThemeSelector';

// ============================================================================
// Tier Configuration - Updated for 4-tier pricing
// ============================================================================

type PollTier = 'free' | 'starter' | 'pro_event' | 'unlimited';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string; tooltip: string }> = {
    free: { label: '', colors: '', tooltip: '' },
    starter: { label: 'STARTER', colors: 'bg-blue-500 text-white', tooltip: '$9.99 one-time' },
    pro_event: { label: 'PRO', colors: 'bg-purple-500 text-white', tooltip: '$19.99 one-time' },
    unlimited: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white', tooltip: '$199/year' }
};

// ============================================================================
// 7 Active Poll Types
// ============================================================================

const POLL_TYPES = [
    {
        id: 'multiple',
        name: 'Multiple Choice',
        icon: CheckSquare,
        description: 'Classic poll - pick one or more options',
        tooltip: 'The most common poll type. Voters click their favorite option(s). Great for quick decisions.',
        useCases: ['Team votes', 'Event planning', 'Quick surveys'],
        gradient: 'from-blue-500 to-indigo-500',
        selectedBorder: 'border-blue-500',
        selectedBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        tier: 'free' as PollTier
    },
    {
        id: 'ranked',
        name: 'Ranked Choice',
        icon: ListOrdered,
        description: 'Drag to rank options in order',
        tooltip: 'Voters rank options from favorite to least favorite. Shows true preferences!',
        useCases: ['Group decisions', 'Avoiding ties', 'Fair voting'],
        gradient: 'from-indigo-500 to-purple-500',
        selectedBorder: 'border-indigo-500',
        selectedBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
        tier: 'free' as PollTier
    },
    {
        id: 'pairwise',
        name: 'This or That',
        icon: ArrowLeftRight,
        description: 'Quick A vs B comparisons',
        tooltip: 'Two options, pick one. Great for quick gut-reaction feedback.',
        useCases: ['Bracket voting', 'Preference testing', 'Quick decisions'],
        gradient: 'from-orange-500 to-red-500',
        selectedBorder: 'border-orange-500',
        selectedBg: 'bg-gradient-to-br from-orange-50 to-red-50',
        tier: 'free' as PollTier
    },
    {
        id: 'meeting',
        name: 'Meeting Poll',
        icon: Calendar,
        description: 'Find the best time for everyone',
        tooltip: 'Like Doodle but simpler! Everyone marks when they\'re available.',
        useCases: ['Meeting scheduling', 'Event planning', 'Party planning'],
        gradient: 'from-amber-500 to-orange-500',
        selectedBorder: 'border-amber-500',
        selectedBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        tier: 'free' as PollTier
    },
    {
        id: 'rating',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        description: 'Rate each option on a scale',
        tooltip: 'Voters rate every option from 1-5 stars. See average ratings.',
        useCases: ['Product feedback', 'Surveys', 'Feature ratings'],
        gradient: 'from-cyan-500 to-blue-500',
        selectedBorder: 'border-cyan-500',
        selectedBg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
        tier: 'free' as PollTier
    },
    {
        id: 'rsvp',
        name: 'RSVP',
        icon: Users,
        description: 'Collect event attendance',
        tooltip: 'Simple Yes/No/Maybe for events. See who\'s coming at a glance.',
        useCases: ['Party invites', 'Team events', 'Social gatherings'],
        gradient: 'from-sky-500 to-blue-500',
        selectedBorder: 'border-sky-500',
        selectedBg: 'bg-gradient-to-br from-sky-50 to-blue-50',
        tier: 'free' as PollTier
    },
    {
        id: 'image',
        name: 'Visual Poll',
        icon: ImageIcon,
        description: 'Vote on images in a grid',
        tooltip: 'Upload images and let people vote visually. Perfect for design choices!',
        useCases: ['Logo selection', 'Design contests', 'Photo competitions'],
        gradient: 'from-pink-500 to-rose-500',
        selectedBorder: 'border-pink-500',
        selectedBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
        tier: 'pro_event' as PollTier
    }
];

const PLACEHOLDER_QUESTIONS = [
    "Where should we eat lunch?",
    "What movie should we watch?",
    "Which design do you prefer?",
    "When can everyone meet?"
];

const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [optionImages, setOptionImages] = useState<string[]>(['', '', '']);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [pollType, setPollType] = useState<string>('multiple');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [multipleSelection, setMultipleSelection] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('default');

    const selectedPollType = POLL_TYPES.find(p => p.id === pollType);
    const isPaidType = selectedPollType?.tier !== 'free';

    const addOption = () => {
        if (options.length < 20) {
            setOptions([...options, '']);
            setOptionImages([...optionImages, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
            setOptionImages(optionImages.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleImageUpload = async (index: number, file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }
        setUploadingIndex(index);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            const newImages = [...optionImages];
            newImages[index] = data.secure_url;
            setOptionImages(newImages);
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleCreate = async () => {
        if (!title.trim()) { setError('Please enter a question'); return; }
        const validOptions = options.filter(o => o.trim());
        if (validOptions.length < 2) { setError('Please add at least 2 options'); return; }
        setIsCreating(true);
        setError(null);
        
        try {
            // Build poll data matching vg-create API format
            const pollData = {
                title: title.trim(),
                description: description.trim() || undefined,
                options: validOptions,
                pollType: pollType,
                settings: {
                    allowMultiple: multipleSelection,
                },
                tier: selectedPollType?.tier || 'free',
            };

            // Add image URLs if visual poll
            if (pollType === 'image') {
                (pollData as any).optionImages = optionImages.slice(0, validOptions.length).filter(img => img);
            }

            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollData)
            });
            
            if (response.ok) {
                const result = await response.json();
                window.location.href = `/#id=${result.id}&admin=${result.adminKey}`;
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create poll');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create poll');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles size={16} />
                        7 Poll Types Available
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Create Your Poll</h1>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Choose a poll type, add your question and options, and share instantly. No signup required.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Poll Type Selector */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <BarChart2 className="text-indigo-600" size={20} />
                                Choose Poll Type
                            </h2>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {POLL_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = pollType === type.id;
                                    const tierConfig = TIER_CONFIG[type.tier];
                                    
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setPollType(type.id)}
                                            className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                                                isSelected ? `${type.selectedBorder} ${type.selectedBg}` : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                        >
                                            {tierConfig.label && (
                                                <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full ${tierConfig.colors}`}>
                                                    {tierConfig.label}
                                                </span>
                                            )}
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${type.gradient}`}>
                                                <Icon className="text-white" size={20} />
                                            </div>
                                            <div className="font-medium text-slate-900 text-sm mb-1">{type.name}</div>
                                            <div className="text-xs text-slate-500 line-clamp-2">{type.description}</div>
                                            
                                            <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-normal max-w-xs pointer-events-none">
                                                {type.tooltip}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {isPaidType && (
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                                    <Lock className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-purple-900 font-medium text-sm">{selectedPollType?.name} requires Pro Event ($19.99 one-time)</p>
                                        <p className="text-purple-700 text-xs mt-1">
                                            Includes 2,000 responses, PDF export, remove branding & more.
                                            <a href="/pricing" className="underline ml-1">See features →</a>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Question & Options */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Question & Options</h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Question *</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder={placeholderQuestion}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-slate-400">(optional)</span></label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add context or instructions..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Options *</label>
                                <div className="space-y-3">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <input type="text" value={option} onChange={(e) => updateOption(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                    className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{index + 1}</span>
                                            </div>
                                            
                                            {pollType === 'image' && (
                                                <button onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) handleImageUpload(index, file);
                                                    };
                                                    input.click();
                                                }}
                                                    className={`p-3 rounded-xl border-2 border-dashed transition ${optionImages[index] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300'}`}
                                                    disabled={uploadingIndex === index}>
                                                    {uploadingIndex === index ? <Loader2 className="animate-spin text-indigo-600" size={20} />
                                                        : optionImages[index] ? <img src={optionImages[index]} alt="" className="w-8 h-8 object-cover rounded" />
                                                        : <Upload className="text-slate-400" size={20} />}
                                                </button>
                                            )}
                                            
                                            {options.length > 2 && (
                                                <button onClick={() => removeOption(index)}
                                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {options.length < 20 && (
                                    <button onClick={addOption}
                                        className="mt-3 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm font-medium">
                                        <Plus size={18} />Add Option
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <button onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                                <span className="font-medium text-slate-900">Advanced Options</span>
                                {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-200">
                                        <div className="p-6 space-y-4">
                                            {pollType === 'multiple' && (
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)}
                                                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-slate-700">Allow multiple selections</span>
                                                </label>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Poll Theme</label>
                                                <ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        <button onClick={handleCreate}
                            disabled={isCreating || !title.trim() || options.filter(o => o.trim()).length < 2}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                            {isCreating ? <><Loader2 className="animate-spin" size={20} />Creating Poll...</>
                                : <>Create Poll<ArrowRight size={20} /></>}
                        </button>
                    </div>

                    {/* Right Column - Preview */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Eye size={18} className="text-slate-400" />Preview
                                    </h3>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                        <button onClick={() => setPreviewDevice('desktop')}
                                            className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}>
                                            <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                        </button>
                                        <button onClick={() => setPreviewDevice('mobile')}
                                            className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}>
                                            <Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} />
                                        </button>
                                    </div>
                                </div>
                                <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold text-slate-900">{title || placeholderQuestion}</h4>
                                        {description && <p className="text-slate-600 text-sm">{description}</p>}
                                        <div className="space-y-2">
                                            {options.filter(o => o.trim() || true).slice(0, 5).map((option, i) => (
                                                <div key={i} className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer transition">
                                                    {pollType === 'image' && optionImages[i] && (
                                                        <img src={optionImages[i]} alt="" className="w-full h-24 object-cover rounded mb-2" />
                                                    )}
                                                    <span className="text-slate-700">{option || `Option ${i + 1}`}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg">Submit Vote</button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2"><AlertTriangle size={16} />Pro Tips</h4>
                                <ul className="text-sm text-amber-700 space-y-1">
                                    <li>• Keep your question clear and specific</li>
                                    <li>• 4-6 options works best for most polls</li>
                                    <li>• Save your admin link to manage the poll later</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoteGeneratorCreate;
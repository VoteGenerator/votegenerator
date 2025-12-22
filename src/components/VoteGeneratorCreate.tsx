import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, AlertTriangle, ChevronDown, ChevronUp, Lock, SlidersHorizontal, Image as ImageIcon, Upload, Smartphone, Monitor, Users, ArrowLeftRight, MessageCircle, Clock } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';
import ThemeSelector from './ThemeSelector';

// ============================================================================
// Tier Configuration
// ============================================================================

type PollTier = 'free' | 'starter' | 'pro_event' | 'unlimited';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string; maxDays: number }> = {
    free: { label: '', colors: '', maxDays: 7 },
    starter: { label: 'STARTER', colors: 'bg-blue-500 text-white', maxDays: 30 },
    pro_event: { label: 'PRO', colors: 'bg-purple-600 text-white', maxDays: 60 },
    unlimited: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', maxDays: 365 }
};

// ============================================================================
// 7 Poll Types
// ============================================================================

const POLL_TYPES = [
    { id: 'multiple', name: 'Multiple Choice', icon: CheckSquare, shortDesc: 'Pick one or more options', tooltip: 'The classic poll type. Voters click their favorite(s). Perfect for quick team decisions like lunch votes or meeting topics.', gradient: 'from-blue-500 to-indigo-500', tier: 'free' as PollTier },
    { id: 'ranked', name: 'Ranked Choice', icon: ListOrdered, shortDesc: 'Drag to rank in order', tooltip: 'Voters rank all options from favorite to least favorite. Shows true preferences and avoids vote splitting. Used in elections!', gradient: 'from-indigo-500 to-purple-500', tier: 'free' as PollTier },
    { id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, shortDesc: 'Quick A vs B comparisons', tooltip: 'Shows two options at a time. Voters pick their favorite. Great for narrowing down many options with gut-reaction feedback.', gradient: 'from-orange-500 to-red-500', tier: 'free' as PollTier },
    { id: 'meeting', name: 'Meeting Poll', icon: Calendar, shortDesc: 'Find the best time', tooltip: 'Like Doodle but simpler! Add date/time options and everyone marks when they\'re available. No more email chains.', gradient: 'from-amber-500 to-orange-500', tier: 'free' as PollTier },
    { id: 'rating', name: 'Rating Scale', icon: SlidersHorizontal, shortDesc: 'Rate each 1-5 stars', tooltip: 'Voters rate every option from 1-5 stars independently. See average ratings to compare. Great for feedback and evaluations.', gradient: 'from-cyan-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'rsvp', name: 'RSVP', icon: Users, shortDesc: 'Event attendance', tooltip: 'Simple Yes/No/Maybe responses for events. See who\'s coming with automatic headcounts. Perfect for party planning!', gradient: 'from-sky-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'image', name: 'Visual Poll', icon: ImageIcon, shortDesc: 'Vote on images', tooltip: 'Upload images and let people vote visually. Perfect for design feedback, logo selection, photo contests, or product comparisons.', gradient: 'from-pink-500 to-rose-500', tier: 'pro_event' as PollTier }
];

const PLACEHOLDER_QUESTIONS = ["Where should we eat lunch?", "What movie should we watch?", "Which design do you prefer?", "When can everyone meet?"];

// ============================================================================
// Main Component - NO PromoBanner/NavHeader (handled by parent page)
// ============================================================================

const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [optionImages, setOptionImages] = useState<string[]>(['', '', '']);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [pollType, setPollType] = useState<string>('multiple');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    
    // Settings
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [multipleSelection, setMultipleSelection] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [allowComments, setAllowComments] = useState(false);
    const [hideResults, setHideResults] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');
    const [deadline, setDeadline] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('default');

    const selectedPollType = POLL_TYPES.find(p => p.id === pollType);
    const isPaidType = selectedPollType?.tier !== 'free';
    const currentTier = selectedPollType?.tier || 'free';
    const maxDays = TIER_CONFIG[currentTier].maxDays;

    // Duplicate detection
    const duplicateIndices = useMemo(() => {
        const indices = new Set<number>();
        const seen = new Map<string, number>();
        options.forEach((opt, index) => {
            const normalized = opt.trim().toLowerCase();
            if (normalized === '') return;
            if (seen.has(normalized)) {
                indices.add(index);
                indices.add(seen.get(normalized)!);
            } else {
                seen.set(normalized, index);
            }
        });
        return indices;
    }, [options]);

    const hasDuplicates = duplicateIndices.size > 0;

    const getMaxDeadline = () => {
        const max = new Date();
        max.setDate(max.getDate() + maxDays);
        return max.toISOString().slice(0, 16);
    };

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
        if (error && error.includes('Duplicate')) setError(null);
    };

    const handleImageUpload = async (index: number, file: File) => {
        if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
        setUploadingIndex(index);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
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
        if (hasDuplicates) { setError('Please remove duplicate options'); return; }
        
        setIsCreating(true);
        setError(null);
        
        try {
            const pollData = {
                title: title.trim(),
                description: description.trim() || undefined,
                options: validOptions,
                pollType: pollType,
                settings: {
                    allowMultiple: multipleSelection,
                    requireNames,
                    allowComments,
                    hideResults,
                    deadline: deadline ? new Date(deadline).toISOString() : undefined,
                },
                buttonText: buttonText || 'Submit Vote',
                tier: currentTier,
            };

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
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                    <Sparkles size={16} />7 Poll Types Available
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Create Your Poll</h1>
                <p className="text-slate-600 max-w-xl mx-auto">Choose a poll type, add your question and options, and share instantly. No signup required.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Poll Type Selector */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart2 className="text-indigo-600" size={20} />Choose Poll Type
                        </h2>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {POLL_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                const tierConfig = TIER_CONFIG[type.tier];
                                
                                return (
                                    <div key={type.id} className="relative group">
                                        <button
                                            onClick={() => setPollType(type.id)}
                                            className={`relative w-full p-3 rounded-xl border-2 transition-all text-left ${
                                                isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-sm'
                                            }`}
                                        >
                                            {tierConfig.label && (
                                                <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full shadow ${tierConfig.colors}`}>
                                                    {tierConfig.label}
                                                </span>
                                            )}
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 bg-gradient-to-br ${type.gradient}`}>
                                                <Icon className="text-white" size={18} />
                                            </div>
                                            <div className={`font-semibold text-sm leading-tight ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{type.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1 leading-snug">{type.shortDesc}</div>
                                        </button>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-2xl">
                                            <div className="font-bold mb-1.5 text-white">{type.name}</div>
                                            <div className="text-slate-300 leading-relaxed text-xs">{type.tooltip}</div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {isPaidType && (
                            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                                <Lock className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="text-purple-900 font-medium text-sm">{selectedPollType?.name} requires Pro Event ($19.99 one-time)</p>
                                    <p className="text-purple-700 text-xs mt-1">Includes 2,000 responses, 60 days active, PDF export & more. <a href="/pricing" className="underline hover:text-purple-900">See features →</a></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Question & Options */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Question & Options</h2>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Question *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholderQuestion}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-slate-400">(optional)</span></label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add context or instructions..."
                                rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Options *</label>
                                {hasDuplicates && (
                                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertCircle size={12} /> Duplicates detected
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {options.map((option, index) => {
                                    const isDuplicate = duplicateIndices.has(index);
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    value={option} 
                                                    onChange={(e) => updateOption(index, e.target.value)} 
                                                    placeholder={`Option ${index + 1}`}
                                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                                                        isDuplicate ? 'border-red-400 bg-red-50' : 'border-slate-200'
                                                    }`} 
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{index + 1}</span>
                                            </div>
                                            
                                            {pollType === 'image' && (
                                                <button onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file'; input.accept = 'image/*';
                                                    input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleImageUpload(index, file); };
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
                                                <button onClick={() => removeOption(index)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {options.length < 20 && (
                                <button onClick={addOption} className="mt-3 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm font-medium">
                                    <Plus size={18} />Add Option
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                            <span className="font-medium text-slate-900">Settings & Customization</span>
                            {showAdvanced ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                        
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200">
                                    <div className="p-6 space-y-4">
                                        {/* Deadline */}
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <Clock size={16} className="text-slate-500" />
                                                    Close poll on
                                                </label>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${currentTier === 'free' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    Max {maxDays} days
                                                </span>
                                            </div>
                                            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                                min={new Date().toISOString().slice(0, 16)} max={getMaxDeadline()}
                                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                            {currentTier === 'free' && <p className="text-xs text-amber-600 mt-2">⚠️ Free polls: max 7 days. Upgrade for longer.</p>}
                                        </div>

                                        {pollType === 'multiple' && (
                                            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                                                <div className="flex items-center gap-2">
                                                    <CheckSquare size={16} className="text-slate-500" />
                                                    <span className="text-sm font-medium text-slate-700">Allow multiple selections</span>
                                                </div>
                                                <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                            </label>
                                        )}
                                        
                                        <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700">Require names</span>
                                            </div>
                                            <input type="checkbox" checked={requireNames} onChange={(e) => setRequireNames(e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        </label>
                                        
                                        <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                                            <div className="flex items-center gap-2">
                                                <MessageCircle size={16} className="text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700">Allow comments</span>
                                            </div>
                                            <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        </label>
                                        
                                        <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition">
                                            <div className="flex items-center gap-2">
                                                <Eye size={16} className="text-slate-500" />
                                                <span className="text-sm font-medium text-slate-700">Hide results until closed</span>
                                            </div>
                                            <input type="checkbox" checked={hideResults} onChange={(e) => setHideResults(e.target.checked)} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                        </label>
                                        
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Submit button text</label>
                                            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Submit Vote"
                                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-100">
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

                    <button onClick={handleCreate} disabled={isCreating || !title.trim() || options.filter(o => o.trim()).length < 2 || hasDuplicates}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                        {isCreating ? <><Loader2 className="animate-spin" size={20} />Creating Poll...</> : <><Sparkles size={18} />Create Poll<ArrowRight size={20} /></>}
                    </button>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Eye size={18} className="text-slate-400" />Preview</h3>
                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}>
                                        <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                    </button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}>
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
                                            <div key={i} className={`p-3 border rounded-lg cursor-pointer transition ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                                                {pollType === 'image' && optionImages[i] && <img src={optionImages[i]} alt="" className="w-full h-24 object-cover rounded mb-2" />}
                                                <span className="text-slate-700">{option || `Option ${i + 1}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg">{buttonText || 'Submit Vote'}</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2"><AlertTriangle size={16} />Pro Tips</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Keep your question clear and specific</li>
                                <li>• 4-6 options works best for most polls</li>
                                <li>• Save your admin link to manage later</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoteGeneratorCreate;
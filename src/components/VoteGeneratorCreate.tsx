// ============================================================================
// VoteGeneratorCreate - FORM ONLY (parent handles headers)
// UPDATED: All poll types are FREE - subscription limits responses only
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, ChevronDown, ChevronUp, SlidersHorizontal, Image as ImageIcon, Smartphone, Monitor, Users, ArrowLeftRight, Share2, QrCode, Zap, Crown, X, Upload, LayoutTemplate } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { compressToTargetSize, formatFileSize } from '../utils/imageCompression';

// Subscription tiers (all poll types included in all tiers)
type SubscriptionTier = 'free' | 'pro' | 'business';

const SUBSCRIPTION_CONFIG: Record<SubscriptionTier, { 
    label: string; 
    colors: string; 
    responses: string;
    features: string[];
}> = {
    free: { 
        label: '', 
        colors: '', 
        responses: '100/month',
        features: ['3 active polls', 'All 8 poll types', 'Basic themes']
    },
    pro: { 
        label: 'PRO', 
        colors: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white', 
        responses: '5,000/month',
        features: ['Unlimited polls', 'Remove branding', 'PIN codes', 'CSV export']
    },
    business: { 
        label: 'BUSINESS', 
        colors: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white', 
        responses: '50,000/month',
        features: ['Unlimited polls', 'Custom logo', 'PDF reports', 'Advanced analytics']
    }
};

// ALL poll types are FREE - no tier restrictions!
const POLL_TYPES = [
    { id: 'multiple', name: 'Multiple Choice', icon: CheckSquare, shortDesc: 'Pick one or more', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'ranked', name: 'Ranked Choice', icon: ListOrdered, shortDesc: 'Drag to rank', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, shortDesc: 'A vs B comparisons', gradient: 'from-orange-500 to-red-500' },
    { id: 'meeting', name: 'Meeting Poll', icon: Calendar, shortDesc: 'Find best time', gradient: 'from-amber-500 to-orange-500' },
    { id: 'rating', name: 'Rating Scale', icon: SlidersHorizontal, shortDesc: 'Rate 1-5 stars', gradient: 'from-cyan-500 to-blue-500' },
    { id: 'rsvp', name: 'RSVP', icon: Users, shortDesc: 'Event attendance', gradient: 'from-sky-500 to-blue-500' },
    { id: 'image', name: 'Visual Poll', icon: ImageIcon, shortDesc: 'Vote on images', gradient: 'from-pink-500 to-rose-500' }
];

const PLACEHOLDER_QUESTIONS = ["Where should we eat lunch?", "What movie should we watch?", "Which design do you prefer?"];

// Dynamic placeholders based on poll type
const POLL_TYPE_PLACEHOLDERS: Record<string, { question: string; options: string[] }> = {
    multiple: { question: "What movie should we watch?", options: ["Option 1", "Option 2", "Option 3"] },
    ranked: { question: "Rank your favorite restaurants", options: ["Pizza Place", "Burger Joint", "Sushi Bar"] },
    pairwise: { question: "Which logo do you prefer?", options: ["Design A", "Design B"] },
    meeting: { question: "When can you meet?", options: ["Monday 2pm", "Tuesday 10am", "Wednesday 3pm"] },
    rating: { question: "How was your experience?", options: ["Rate 1-5 stars"] },
    rsvp: { question: "Can you attend the party?", options: ["Going", "Not Going", "Maybe"] },
    image: { question: "Which design do you prefer?", options: ["Image 1", "Image 2"] }
};

// How It Works
const HowItWorks: React.FC = () => (
    <div className="mb-8">
        <div className="grid grid-cols-3 gap-4">
            {[
                { num: '1', title: 'Choose Type', icon: CheckSquare, color: 'from-blue-500 to-indigo-500' },
                { num: '2', title: 'Add Question', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
                { num: '3', title: 'Share & Collect', icon: Share2, color: 'from-amber-500 to-orange-500' },
            ].map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <step.icon className="text-white" size={20} />
                    </div>
                    <div className="text-xs text-indigo-600 font-bold">Step {step.num}</div>
                    <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                </motion.div>
            ))}
        </div>
    </div>
);

// Props interface
interface VoteGeneratorCreateProps {
    hideTierBanner?: boolean;
}

// Main Component
const VoteGeneratorCreate: React.FC<VoteGeneratorCreateProps> = ({ hideTierBanner = false }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [pollType, setPollType] = useState('multiple');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [multipleSelection, setMultipleSelection] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [hideResults, setHideResults] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');
    const [deadline, setDeadline] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('default');
    
    // Visual Poll image options
    const [imageOptions, setImageOptions] = useState<{ url: string; label: string }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Check for subscription tier
    const subscriptionTier = typeof window !== 'undefined' 
        ? (localStorage.getItem('vg_subscription_tier') as SubscriptionTier | null) 
        : null;
    
    const isPaidUser = subscriptionTier === 'pro' || subscriptionTier === 'business';
    const tierConfig = subscriptionTier ? SUBSCRIPTION_CONFIG[subscriptionTier] : SUBSCRIPTION_CONFIG.free;

    // Max deadline days based on tier
    const maxDays = isPaidUser ? 365 : 30;

    const duplicateIndices = useMemo(() => {
        const indices = new Set<number>();
        const seen = new Map<string, number>();
        options.forEach((opt, index) => {
            const n = opt.trim().toLowerCase();
            if (n === '') return;
            if (seen.has(n)) { indices.add(index); indices.add(seen.get(n)!); }
            else { seen.set(n, index); }
        });
        return indices;
    }, [options]);

    const hasDuplicates = duplicateIndices.size > 0;
    const getMaxDeadline = () => { const m = new Date(); m.setDate(m.getDate() + maxDays); return m.toISOString().slice(0, 16); };
    const addOption = () => { if (options.length < 20) setOptions([...options, '']); };
    const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
    const updateOption = (i: number, v: string) => { const n = [...options]; n[i] = v; setOptions(n); if (error?.includes('Duplicate')) setError(null); };

    // All poll types are now unlocked for everyone!
    const handlePollTypeSelect = (id: string) => {
        setPollType(id);
    };

    const handleCreate = async () => {
        if (!title.trim()) { setError('Please enter a question'); return; }
        
        // Validation based on poll type
        if (pollType === 'image') {
            if (imageOptions.length < 2) { 
                setError('Upload at least 2 images for visual poll'); 
                return; 
            }
        } else {
            const valid = options.filter(o => o.trim());
            if (valid.length < 2) { setError('Add at least 2 options'); return; }
            if (hasDuplicates) { setError('Remove duplicate options'); return; }
        }
        
        setIsCreating(true); setError(null);
        
        try {
            const validOptions = pollType === 'image' 
                ? imageOptions.map((img, i) => img.label || `Option ${i + 1}`)
                : options.filter(o => o.trim());
            
            const pollData: any = { 
                title: title.trim(), 
                description: description.trim() || undefined, 
                options: validOptions, 
                pollType, 
                settings: { 
                    allowMultiple: multipleSelection, 
                    requireNames, 
                    hideResults, 
                    deadline: deadline ? new Date(deadline).toISOString() : undefined 
                }, 
                buttonText: buttonText || 'Submit Vote', 
                tier: subscriptionTier || 'free'
            };
            
            // Add image URLs for visual polls
            if (pollType === 'image') {
                pollData.imageUrls = imageOptions.map(img => img.url);
            }
            
            const res = await fetch('/.netlify/functions/vg-create', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(pollData) 
            });
            
            const responseData = await res.json();
            
            if (res.ok && responseData.id) { 
                const pollId = responseData.id;
                const adminKey = responseData.adminKey;
                
                // PAID USERS: Skip ad wall, go directly to admin dashboard
                // FREE USERS: Go through ad wall
                if (isPaidUser) {
                    window.location.href = `/#id=${pollId}&admin=${adminKey}`;
                } else {
                    window.location.href = `/ad-wall?pollId=${pollId}&adminKey=${adminKey}`;
                }
                return;
            } else { 
                setError(responseData.error || 'Failed to create poll. Please try again.'); 
                setIsCreating(false);
            }
        } catch (e: any) { 
            console.error('Poll creation error:', e);
            setError(e.message || 'Network error. Please check your connection.'); 
            setIsCreating(false);
        }
    };

    return (
        <>
            {/* Subscription Status Header for Paid Users */}
            {isPaidUser && !hideTierBanner && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className={`p-5 rounded-2xl shadow-lg text-white ${
                        subscriptionTier === 'business' 
                            ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600' 
                            : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600'
                    }`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                                    {subscriptionTier === 'business' ? <Crown size={28} /> : <Zap size={28} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold">
                                            {subscriptionTier === 'business' ? '👑 Business Plan' : '⚡ Pro Plan'}
                                        </h2>
                                        <span className="px-2 py-0.5 bg-emerald-400 text-emerald-900 rounded-full text-xs font-bold">
                                            ACTIVE
                                        </span>
                                    </div>
                                    <p className="text-white/80 text-sm mt-0.5">
                                        All poll types included • {tierConfig.responses} responses • No ads
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <a 
                                    href="/dashboard"
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                                >
                                    Dashboard
                                </a>
                                <a 
                                    href="/templates"
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                                >
                                    <LayoutTemplate size={16} />
                                    Templates
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Free User - Templates CTA */}
            {!isPaidUser && !hideTierBanner && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <LayoutTemplate size={20} className="text-indigo-600" />
                        <p className="text-slate-700">
                            <span className="font-semibold">New!</span> Start faster with ready-made templates
                        </p>
                    </div>
                    <a 
                        href="/templates"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition flex items-center gap-2"
                    >
                        Browse Templates
                        <ArrowRight size={16} />
                    </a>
                </motion.div>
            )}
            
            <HowItWorks />
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {/* Poll Type */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-2xl shadow-lg p-6 ${
                        subscriptionTier === 'business' ? 'border-2 border-purple-200' :
                        subscriptionTier === 'pro' ? 'border-2 border-indigo-200' :
                        'border border-slate-200/50'
                    }`}>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                subscriptionTier === 'business' ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                                subscriptionTier === 'pro' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' :
                                'bg-gradient-to-br from-indigo-500 to-purple-500'
                            }`}><BarChart2 className="text-white" size={18} /></div>
                            Choose Poll Type
                            <span className="ml-auto text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                ✓ All types included free
                            </span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-3">
                            {POLL_TYPES.map((type, i) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                return (
                                    <motion.div key={type.id} className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                        <button onClick={() => handlePollTypeSelect(type.id)}
                                            className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                isSelected 
                                                    ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200' 
                                                    : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md'
                                            }`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${type.gradient} shadow-md`}>
                                                <Icon className="text-white" size={20} />
                                            </div>
                                            <div className="font-semibold text-sm">{type.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1">{type.shortDesc}</div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Question & Options */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`bg-white rounded-2xl shadow-lg p-6 ${
                        subscriptionTier === 'business' ? 'border-2 border-purple-200' :
                        subscriptionTier === 'pro' ? 'border-2 border-indigo-200' :
                        'border border-slate-200/50'
                    }`}>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                subscriptionTier === 'business' ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                                subscriptionTier === 'pro' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' :
                                'bg-gradient-to-br from-purple-500 to-pink-500'
                            }`}><Sparkles className="text-white" size={18} /></div>
                            Your Question
                        </h2>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={POLL_TYPE_PLACEHOLDERS[pollType]?.question || placeholderQuestion} className="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add optional description..." className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" rows={2} />
                        
                        <div className="mt-6">
                            <h3 className="font-semibold text-slate-700 mb-3">{pollType === 'image' ? 'Upload Images' : 'Answer Options'}</h3>
                            
                            {/* Visual Poll - Image Upload */}
                            {pollType === 'image' ? (
                                <div className="space-y-4">
                                    {/* Visual Poll Info */}
                                    <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
                                        <p className="text-pink-600 text-sm mb-3">
                                            Upload images as poll options. Perfect for design feedback, photo contests, product comparisons, and more!
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">📐 Recommended: Square (1:1)</span>
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">📁 Max: 5MB per image</span>
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">🖼️ Formats: JPG, PNG, WebP</span>
                                            <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">✨ Auto-compressed for fast loading</span>
                                        </div>
                                    </div>
                                    
                                    {/* Uploaded Images Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {imageOptions.map((img, i) => (
                                            <motion.div 
                                                key={i} 
                                                initial={{ opacity: 0, scale: 0.9 }} 
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative group"
                                            >
                                                <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                                                    <img src={img.url} alt={img.label || `Option ${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={img.label} 
                                                    onChange={(e) => {
                                                        const newImages = [...imageOptions];
                                                        newImages[i] = { ...newImages[i], label: e.target.value };
                                                        setImageOptions(newImages);
                                                    }}
                                                    placeholder="Add label..."
                                                    className="mt-2 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
                                                />
                                                <button 
                                                    onClick={() => setImageOptions(imageOptions.filter((_, idx) => idx !== i))}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </motion.div>
                                        ))}
                                        
                                        {/* Upload Button */}
                                        {imageOptions.length < 10 && (
                                            <label className="aspect-square rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 hover:bg-pink-100 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        
                                                        setUploadingImage(true);
                                                        setError(null);
                                                        
                                                        try {
                                                            const compressedFile = await compressToTargetSize(file, 2);
                                                            console.log(`Compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
                                                            
                                                            const reader = new FileReader();
                                                            reader.onload = async () => {
                                                                try {
                                                                    const base64 = reader.result as string;
                                                                    const response = await fetch('/.netlify/functions/vg-upload-image', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ image: base64 })
                                                                    });
                                                                    
                                                                    if (response.ok) {
                                                                        const data = await response.json();
                                                                        setImageOptions([...imageOptions, { url: data.url, label: '' }]);
                                                                    } else {
                                                                        const err = await response.json();
                                                                        setError(err.error || 'Failed to upload image');
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Upload error:', err);
                                                                    setError('Failed to upload image. Please try again.');
                                                                } finally {
                                                                    setUploadingImage(false);
                                                                }
                                                            };
                                                            reader.onerror = () => {
                                                                setError('Failed to read image file');
                                                                setUploadingImage(false);
                                                            };
                                                            reader.readAsDataURL(compressedFile);
                                                            
                                                        } catch (err) {
                                                            console.error('Compression error:', err);
                                                            setError('Failed to process image. Please try again.');
                                                            setUploadingImage(false);
                                                        }
                                                        
                                                        e.target.value = '';
                                                    }}
                                                />
                                                {uploadingImage ? (
                                                    <Loader2 size={24} className="text-pink-400 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload size={24} className="text-pink-400" />
                                                        <span className="text-pink-600 text-sm font-medium">Upload Image</span>
                                                    </>
                                                )}
                                            </label>
                                        )}
                                    </div>
                                    
                                    {imageOptions.length === 0 && (
                                        <p className="text-center text-slate-500 text-sm py-4">
                                            Upload at least 2 images to create your visual poll
                                        </p>
                                    )}
                                </div>
                            ) : (
                                /* Text Options */
                                <div className="space-y-3">
                                    {options.map((opt, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-2 items-center">
                                            <span className="text-slate-400 text-sm w-6">{i + 1}.</span>
                                            <input 
                                                type="text" 
                                                value={opt} 
                                                onChange={(e) => updateOption(i, e.target.value)} 
                                                placeholder={`Option ${i + 1}`} 
                                                className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm transition ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`} 
                                            />
                                            {options.length > 2 && (
                                                <button onClick={() => removeOption(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                    {hasDuplicates && (
                                        <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                            <AlertCircle size={14} /> Duplicate options detected
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            {pollType !== 'image' && options.length < 20 && (
                                <button onClick={addOption} className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 w-full justify-center">
                                    <Plus size={18} />Add Option
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Settings */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                        subscriptionTier === 'business' ? 'border-2 border-purple-200' :
                        subscriptionTier === 'pro' ? 'border-2 border-indigo-200' :
                        'border border-slate-200/50'
                    }`}>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-bold text-slate-900 flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    subscriptionTier === 'business' ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                                    subscriptionTier === 'pro' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' :
                                    'bg-gradient-to-br from-amber-500 to-orange-500'
                                }`}><SlidersHorizontal className="text-white" size={18} /></div>
                                Settings
                            </span>
                            {showAdvanced ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200">
                                    <div className="p-6 space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-slate-700">Close poll on</span>
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Max {maxDays} days</span>
                                            </label>
                                            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().slice(0, 16)} max={getMaxDeadline()} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        {pollType === 'multiple' && (
                                            <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                                <span className="font-medium text-slate-700">Allow multiple selections</span>
                                                <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)} className="w-5 h-5 rounded" />
                                            </label>
                                        )}
                                        <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                            <span className="font-medium text-slate-700">Require voter names</span>
                                            <input type="checkbox" checked={requireNames} onChange={(e) => setRequireNames(e.target.checked)} className="w-5 h-5 rounded" />
                                        </label>
                                        <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                            <span className="font-medium text-slate-700">Hide results until closed</span>
                                            <input type="checkbox" checked={hideResults} onChange={(e) => setHideResults(e.target.checked)} className="w-5 h-5 rounded" />
                                        </label>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Button text</label>
                                            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Submit Vote" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        <div className="pt-4 border-t">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label>
                                            <ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {error && (
                        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={20} />
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <motion.button 
                        type="button" 
                        onClick={handleCreate} 
                        disabled={isCreating || !title.trim() || (pollType === 'image' ? imageOptions.length < 2 : (options.filter(o => o.trim()).length < 2 || hasDuplicates))} 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.99 }}
                        className={`w-full py-4 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg ${
                            subscriptionTier === 'business' ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500' :
                            subscriptionTier === 'pro' ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500' :
                            'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
                        }`}
                    >
                        {isCreating ? <><Loader2 className="animate-spin" size={20} />Creating Poll...</> : <><Sparkles size={20} />Create Poll<ArrowRight size={20} /></>}
                    </motion.button>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className={`bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 ${
                        subscriptionTier === 'business' ? 'border-2 border-purple-200' :
                        subscriptionTier === 'pro' ? 'border-2 border-indigo-200' :
                        'border border-slate-200/50'
                    }`}>
                        <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 flex items-center justify-between">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <Eye size={18} className={
                                    subscriptionTier === 'business' ? 'text-purple-500' :
                                    subscriptionTier === 'pro' ? 'text-indigo-500' :
                                    'text-indigo-500'
                                } />
                                Live Preview
                            </h3>
                            <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                                <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-indigo-100' : ''}`}>
                                    <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                </button>
                                <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-indigo-100' : ''}`}>
                                    <Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} />
                                </button>
                            </div>
                        </div>
                        <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                            <h4 className="text-lg font-bold text-slate-900 mb-4">
                                {title || POLL_TYPE_PLACEHOLDERS[pollType]?.question || placeholderQuestion}
                            </h4>
                            {description && <p className="text-slate-600 text-sm mb-4">{description}</p>}
                            
                            <div className="space-y-2 mb-4">
                                {pollType === 'rsvp' ? (
                                    ['✅ Going', '❌ Not Going', '🤔 Maybe'].map((opt, i) => (
                                        <div key={i} className="p-3 border-2 border-slate-200 rounded-xl">
                                            <span className="text-slate-700">{opt}</span>
                                        </div>
                                    ))
                                ) : pollType === 'rating' ? (
                                    <div className="p-4 border-2 border-slate-200 rounded-xl text-center">
                                        <div className="flex justify-center gap-1 text-2xl">
                                            {['⭐', '⭐', '⭐', '⭐', '⭐'].map((star, i) => (
                                                <span key={i} className={i < 3 ? 'opacity-100' : 'opacity-30'}>{star}</span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-2">Click to rate</p>
                                    </div>
                                ) : pollType === 'meeting' ? (
                                    ['Monday 2pm', 'Tuesday 10am', 'Wednesday 3pm'].map((opt, i) => (
                                        <div key={i} className="p-3 border-2 border-slate-200 rounded-xl flex items-center gap-3">
                                            <Calendar size={16} className="text-amber-500" />
                                            <span className="text-slate-700">{options[i]?.trim() || opt}</span>
                                        </div>
                                    ))
                                ) : pollType === 'image' ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {(imageOptions.length > 0 ? imageOptions.slice(0, 4) : [{url: '', label: 'Image 1'}, {url: '', label: 'Image 2'}]).map((img, i) => (
                                            <div key={i} className="aspect-square border-2 border-slate-200 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                                {img.url ? (
                                                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-slate-400 text-sm">{img.label || `Image ${i + 1}`}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    options.slice(0, 5).map((opt, i) => (
                                        <div key={i} className={`p-3 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                            <span className="text-slate-700">{opt || `Option ${i + 1}`}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">
                                {pollType === 'rsvp' ? 'Submit RSVP' : 
                                 pollType === 'rating' ? 'Submit Rating' :
                                 pollType === 'meeting' ? 'Submit Availability' :
                                 buttonText || 'Submit Vote'}
                            </button>
                        </div>
                    </motion.div>
                    
                    <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                        <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Zap size={16} />Tips</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Keep questions clear</li>
                            <li>• 4-6 options works best</li>
                            <li>• Save your admin link</li>
                        </ul>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                        <h4 className="font-bold text-emerald-800 mb-2">You'll Get</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-emerald-700">
                            <div className="flex items-center gap-2"><QrCode size={14} />QR Code</div>
                            <div className="flex items-center gap-2"><Share2 size={14} />Share Link</div>
                            <div className="flex items-center gap-2"><BarChart2 size={14} />Live Results</div>
                            <div className="flex items-center gap-2"><Zap size={14} />Instant</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VoteGeneratorCreate;
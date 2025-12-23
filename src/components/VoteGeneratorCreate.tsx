// ============================================================================
// VoteGeneratorCreate - FORM ONLY (parent handles headers)
// Uses sessionStorage for ad wall redirect to avoid URL encoding issues
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, ChevronDown, ChevronUp, Lock, SlidersHorizontal, Image as ImageIcon, Smartphone, Monitor, Users, ArrowLeftRight, MessageCircle, Clock, Share2, QrCode, Zap, Crown, CreditCard, X, Star, AlertTriangle, Upload } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useGeoPricing } from '../geoPricing';
import { compressToTargetSize, formatFileSize } from '../utils/imageCompression';

type PollTier = 'free' | 'starter' | 'pro_event' | 'unlimited';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string; maxDays: number }> = {
    free: { label: '', colors: '', maxDays: 7 },
    starter: { label: 'STARTER', colors: 'bg-blue-500 text-white', maxDays: 30 },
    pro_event: { label: 'PRO', colors: 'bg-purple-600 text-white', maxDays: 60 },
    unlimited: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', maxDays: 365 }
};

const POLL_TYPES = [
    { id: 'multiple', name: 'Multiple Choice', icon: CheckSquare, shortDesc: 'Pick one or more', gradient: 'from-blue-500 to-indigo-500', tier: 'free' as PollTier },
    { id: 'ranked', name: 'Ranked Choice', icon: ListOrdered, shortDesc: 'Drag to rank', gradient: 'from-indigo-500 to-purple-500', tier: 'free' as PollTier },
    { id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, shortDesc: 'A vs B comparisons', gradient: 'from-orange-500 to-red-500', tier: 'free' as PollTier },
    { id: 'meeting', name: 'Meeting Poll', icon: Calendar, shortDesc: 'Find best time', gradient: 'from-amber-500 to-orange-500', tier: 'free' as PollTier },
    { id: 'rating', name: 'Rating Scale', icon: SlidersHorizontal, shortDesc: 'Rate 1-5 stars', gradient: 'from-cyan-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'rsvp', name: 'RSVP', icon: Users, shortDesc: 'Event attendance', gradient: 'from-sky-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'image', name: 'Visual Poll', icon: ImageIcon, shortDesc: 'Vote on images', gradient: 'from-pink-500 to-rose-500', tier: 'pro_event' as PollTier }
];

const PLACEHOLDER_QUESTIONS = ["Where should we eat lunch?", "What movie should we watch?", "Which design do you prefer?"];

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

// Paywall Modal with Geo Pricing
const PaywallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { loading, currency, prices } = useGeoPricing();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition z-10"><X size={20} className="text-slate-500" /></button>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Crown size={24} /></div>
                        <div><h3 className="text-xl font-bold">Upgrade to Pro Event</h3><p className="text-purple-100 text-sm">Unlock Visual Poll & more</p></div>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4"><strong>Visual Poll</strong> lets you upload images as poll options — perfect for design feedback and photo contests.</p>
                    <div className="bg-purple-50 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-purple-900 mb-2">Pro Event includes:</h4>
                        <ul className="space-y-2 text-sm text-purple-700">
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> Visual Poll (images)</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> 2,000 responses</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> 60 days active</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> Export PDF & PNG</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            {loading ? <span className="text-3xl font-bold text-slate-300">...</span> : <><span className="text-3xl font-bold text-slate-900">{prices.symbol}{prices.proEvent}</span><span className="text-slate-500 ml-1">{currency}</span></>}
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">One-time</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">Maybe Later</button>
                        <a href="/.netlify/functions/vg-checkout?tier=pro_event" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2">
                            <CreditCard size={18} /> Upgrade
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const VoteGeneratorCreate: React.FC = () => {
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
    const [showPaywall, setShowPaywall] = useState(false);
    
    // Visual Poll image options
    const [imageOptions, setImageOptions] = useState<{ url: string; label: string }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Check for purchased tier from checkout
    const purchasedTier = typeof window !== 'undefined' ? localStorage.getItem('vg_purchased_tier') as PollTier | null : null;
    const expiresAt = typeof window !== 'undefined' ? localStorage.getItem('vg_expires_at') : null;
    
    // Calculate days remaining
    const daysRemaining = expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isExpiringVerySoon = daysRemaining !== null && daysRemaining <= 7;

    const selectedPollType = POLL_TYPES.find(p => p.id === pollType);
    const currentTier = purchasedTier || selectedPollType?.tier || 'free';
    const maxDays = TIER_CONFIG[currentTier]?.maxDays || TIER_CONFIG['free'].maxDays;

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

    const handlePollTypeSelect = (id: string) => {
        const type = POLL_TYPES.find(p => p.id === id);
        // If user has a purchased tier, allow all poll types
        // Or if the poll type is free, allow it
        if (purchasedTier || type?.tier === 'free') {
            setPollType(id);
        } else {
            setShowPaywall(true);
        }
    };
    
    // Check if a poll type is unlocked for the user
    const isPollTypeUnlocked = (typeTier: PollTier) => {
        if (typeTier === 'free') return true;
        if (!purchasedTier) return false;
        // Tier hierarchy: unlimited > pro_event > starter > free
        const tierRank: Record<PollTier, number> = { free: 0, starter: 1, pro_event: 2, unlimited: 3 };
        return tierRank[purchasedTier] >= tierRank[typeTier];
    };

    const handleCreate = async () => {
        if (!title.trim()) { setError('Please enter a question'); return; }
        
        // Validation based on poll type
        if (pollType === 'image') {
            // Visual poll - need at least 2 images
            if (imageOptions.length < 2) { 
                setError('Upload at least 2 images for visual poll'); 
                return; 
            }
        } else {
            // Regular poll - need at least 2 text options
            const valid = options.filter(o => o.trim());
            if (valid.length < 2) { setError('Add at least 2 options'); return; }
            if (hasDuplicates) { setError('Remove duplicate options'); return; }
        }
        
        setIsCreating(true); setError(null);
        
        // Use the already-loaded purchasedTier from component state
        const effectiveTier = purchasedTier || currentTier;
        
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
                tier: effectiveTier 
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
                
                // Clear purchased tier after use
                if (purchasedTier) {
                    localStorage.removeItem('vg_purchased_tier');
                }
                
                // PAID USERS: Skip ad wall, go directly to admin dashboard
                // FREE USERS: Go through ad wall
                if (purchasedTier || effectiveTier !== 'free') {
                    // Direct to admin dashboard (skip ad wall)
                    window.location.href = `/#id=${pollId}&admin=${adminKey}`;
                } else {
                    // Free tier - show ad wall
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
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
            
            {/* Expiry Warning Banner */}
            {purchasedTier && isExpiringSoon && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-4 rounded-xl flex items-center justify-between ${
                        isExpiringVerySoon 
                            ? 'bg-red-50 border-2 border-red-200' 
                            : 'bg-amber-50 border-2 border-amber-200'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={20} className={isExpiringVerySoon ? 'text-red-500' : 'text-amber-500'} />
                        <div>
                            <p className={`font-semibold ${isExpiringVerySoon ? 'text-red-700' : 'text-amber-700'}`}>
                                {isExpiringVerySoon ? '⚠️ Plan expires soon!' : '⏰ Plan expiring'}
                            </p>
                            <p className={`text-sm ${isExpiringVerySoon ? 'text-red-600' : 'text-amber-600'}`}>
                                {daysRemaining} days remaining. Renew to keep your premium features.
                            </p>
                        </div>
                    </div>
                    <a 
                        href={`/.netlify/functions/vg-checkout?tier=${purchasedTier}`}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                            isExpiringVerySoon 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                    >
                        Renew Plan
                    </a>
                </motion.div>
            )}
            
            {/* Paid Tier Hub Header */}
            {purchasedTier && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className={`p-5 rounded-2xl shadow-lg ${
                        purchasedTier === 'unlimited' 
                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500' 
                            : purchasedTier === 'pro_event'
                                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    } text-white`}>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                                    {purchasedTier === 'unlimited' ? (
                                        <Star size={28} className="text-white" />
                                    ) : purchasedTier === 'pro_event' ? (
                                        <Crown size={28} className="text-white" />
                                    ) : (
                                        <Zap size={28} className="text-white" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold">
                                            {purchasedTier === 'unlimited' ? '⭐ Unlimited' : 
                                             purchasedTier === 'pro_event' ? '👑 Pro Event' : 
                                             '⚡ Starter'} Plan
                                        </h2>
                                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                                            ACTIVE
                                        </span>
                                    </div>
                                    <p className="text-white/80 text-sm mt-0.5">
                                        All premium features unlocked • No ads • Create your poll below
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* Days Remaining */}
                                {daysRemaining !== null && (
                                    <div className="text-right hidden sm:block">
                                        <p className="text-white/60 text-xs">Time remaining</p>
                                        <p className="text-sm font-semibold flex items-center gap-1">
                                            <Clock size={14} />
                                            {daysRemaining} days
                                        </p>
                                    </div>
                                )}
                                
                                <div className="text-right hidden sm:block">
                                    <p className="text-white/60 text-xs">Plan includes</p>
                                    <p className="text-sm font-semibold">
                                        {purchasedTier === 'unlimited' ? '5,000 responses' : 
                                         purchasedTier === 'pro_event' ? '2,000 responses' : 
                                         '500 responses'}
                                    </p>
                                </div>
                                
                                {/* Upgrade to Unlimited (for non-unlimited users) */}
                                {purchasedTier !== 'unlimited' && (
                                    <a 
                                        href="/.netlify/functions/vg-checkout?tier=unlimited"
                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-sm font-semibold transition flex items-center gap-1"
                                    >
                                        <Star size={14} /> Upgrade
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            
            <HowItWorks />
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {/* Poll Type */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center"><BarChart2 className="text-white" size={18} /></div>
                            Choose Poll Type
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-3">
                            {POLL_TYPES.map((type, i) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                const tierConfig = TIER_CONFIG[type.tier];
                                const isLocked = !isPollTypeUnlocked(type.tier);
                                return (
                                    <motion.div key={type.id} className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                        {tierConfig.label && !purchasedTier && <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-md z-20 ${tierConfig.colors}`}>{tierConfig.label}</span>}
                                        <button onClick={() => handlePollTypeSelect(type.id)}
                                            className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200' : isLocked ? 'border-purple-200 hover:border-purple-400 bg-purple-50/30' : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md'}`}>
                                            {isLocked && <div className="absolute top-2 left-2"><Lock size={12} className="text-purple-500" /></div>}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${type.gradient} shadow-md`}><Icon className="text-white" size={20} /></div>
                                            <div className="font-semibold text-sm">{type.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1">{type.shortDesc}</div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Question & Options */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center"><Sparkles className="text-white" size={18} /></div>
                            Your Question & Options
                        </h2>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Question *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholderQuestion} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-slate-50 focus:bg-white" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description <span className="text-slate-400">(optional)</span></label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add context..." rows={2} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-slate-700">Options *</label>
                                {hasDuplicates && <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1"><AlertCircle size={14} /> Duplicates</span>}
                            </div>
                            
                            {/* Regular text options for non-image polls */}
                            {pollType !== 'image' ? (
                                <div className="space-y-3">
                                    {options.map((opt, i) => (
                                        <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                            <div className="flex-1 relative">
                                                <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`}
                                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500'}`} />
                                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${duplicateIndices.has(i) ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
                                            </div>
                                            {options.length > 2 && <button onClick={() => removeOption(i)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                /* Visual Poll Image Upload Section */
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                                        <div className="flex items-center gap-2 text-pink-700 mb-2">
                                            <ImageIcon size={18} />
                                            <span className="font-semibold">Visual Poll</span>
                                        </div>
                                        <p className="text-pink-600 text-sm">Upload images as poll options. Great for design feedback, photo contests, and more!</p>
                                    </div>
                                    
                                    {/* Uploaded Images */}
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
                                                            // Compress image first (max 2MB)
                                                            const compressedFile = await compressToTargetSize(file, 2);
                                                            console.log(`Compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
                                                            
                                                            // Convert to base64
                                                            const reader = new FileReader();
                                                            reader.onload = async () => {
                                                                try {
                                                                    const base64 = reader.result as string;
                                                                    
                                                                    // Upload to Cloudinary via API
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
                            )}
                            
                            {pollType !== 'image' && options.length < 20 && <button onClick={addOption} className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 w-full justify-center"><Plus size={18} />Add Option</button>}
                        </div>
                    </motion.div>

                    {/* Settings */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center"><SlidersHorizontal className="text-white" size={18} /></div>
                                Settings
                            </span>
                            {showAdvanced ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200">
                                    <div className="p-6 space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-slate-700">Close poll on</span><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Max {maxDays} days</span></label>
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
                                        <div className="pt-4 border-t"><label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label><ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} /></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {error && <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3"><AlertCircle className="text-red-600" size={20} /><p className="text-red-700 font-medium">{error}</p></div>}

                    <motion.button type="button" onClick={handleCreate} 
                        disabled={isCreating || !title.trim() || (pollType === 'image' ? imageOptions.length < 2 : (options.filter(o => o.trim()).length < 2 || hasDuplicates))} 
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg">
                        {isCreating ? <><Loader2 className="animate-spin" size={22} />Creating...</> : <><Sparkles size={20} />Create Poll<ArrowRight size={22} /></>}
                    </motion.button>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky top-24">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Eye size={18} className="text-indigo-500" />Live Preview</h3>
                                <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-indigo-100' : ''}`}><Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-indigo-100' : ''}`}><Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                </div>
                            </div>
                            <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                                <h4 className="text-lg font-bold text-slate-900 mb-4">{title || placeholderQuestion}</h4>
                                {description && <p className="text-slate-600 text-sm mb-4">{description}</p>}
                                <div className="space-y-2 mb-4">
                                    {options.slice(0, 5).map((opt, i) => (
                                        <div key={i} className={`p-3 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                            <span className="text-slate-700">{opt || `Option ${i + 1}`}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">{buttonText || 'Submit Vote'}</button>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Zap size={16} />Tips</h4>
                            <ul className="text-sm text-amber-700 space-y-1"><li>• Keep questions clear</li><li>• 4-6 options works best</li><li>• Save your admin link</li></ul>
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
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default VoteGeneratorCreate;
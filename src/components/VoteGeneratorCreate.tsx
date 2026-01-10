// ============================================================================
// VoteGeneratorCreate - FORM ONLY (parent handles headers)
// UPDATED: All poll types FREE, Template loading, Comments, Security sections
// STYLING FIXES: Better background contrast, template banner, card styling
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, ArrowRight, Loader2, Sparkles, Eye, AlertCircle, 
    ListOrdered, CheckSquare, Calendar, ChevronDown, ChevronUp, 
    SlidersHorizontal, Image as ImageIcon, Smartphone, Monitor, Users, 
    ArrowLeftRight, Share2, Zap, Crown, X, Upload, LayoutTemplate,
    MessageSquare, Lock, Shield, Key, ClipboardList, Star, Timer, Clock, Check
} from 'lucide-react';
import ThemeSelector, { getThemeById, ThemeConfig } from './ThemeSelector';
import { compressToTargetSize, formatFileSize } from '../utils/imageCompression';
import { useTemplateLoader, TemplateBadge, StartFromTemplateButton } from './useTemplateLoader';
import { PollTemplate } from './pollTemplates';

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
        features: ['3 active polls', 'All 7 poll types', 'Basic themes']
    },
    pro: { 
        label: 'PRO', 
        colors: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white', 
        responses: '10,000/month',
        features: ['Business polls', 'Remove branding', 'PIN codes', 'CSV export']
    },
    business: { 
        label: 'BUSINESS', 
        colors: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white', 
        responses: '100,000/month',
        features: ['Business polls', 'Custom logo', 'PDF reports', 'Advanced analytics']
    }
};

// ALL poll types are FREE - no tier restrictions!
// Note: Survey (multi-question) is at /survey - these are single-question poll types
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

// Security options
type SecurityType = 'none' | 'cookie' | 'fingerprint' | 'pin' | 'code';

const SECURITY_OPTIONS = [
    { id: 'none', name: 'No Limit', desc: 'Anyone can vote multiple times', icon: Users, tooltip: 'No restrictions. Good for casual polls but vulnerable to spam.', isPro: false },
    { id: 'cookie', name: 'One Per Browser', desc: 'Cookie-based (easy bypass)', icon: Shield, tooltip: 'Stores a cookie to prevent revoting. Users can bypass by clearing cookies or using incognito.', isPro: false },
    { id: 'fingerprint', name: 'One Per Device', desc: 'Browser fingerprinting', icon: Lock, tooltip: 'Uses browser fingerprinting for better accuracy. Harder to bypass but not 100% reliable.', isPro: false },
    { id: 'pin', name: 'Shared PIN', desc: 'One password for all voters', icon: Key, tooltip: 'Set a single PIN that all voters must enter. Great for keeping polls private. Combine with cookie/fingerprint to prevent repeat voting.', isPro: true },
    { id: 'code', name: 'Unique Codes', desc: 'One-time use codes per voter', icon: ClipboardList, tooltip: 'Generate unique codes to distribute. Most secure - each code works exactly once. Best for elections and official votes.', isPro: true },
];

// Rating icon options - More beautiful icons
const RATING_ICONS = [
    { id: 'star', name: 'Stars', emoji: '⭐', colorClass: 'text-amber-400', fillClass: 'fill-amber-400', bgHover: 'hover:bg-amber-50' },
    { id: 'heart', name: 'Hearts', emoji: '❤️', colorClass: 'text-rose-500', fillClass: 'fill-rose-500', bgHover: 'hover:bg-rose-50' },
    { id: 'thumbs', name: 'Thumbs', emoji: '👍', colorClass: 'text-blue-500', fillClass: 'fill-blue-500', bgHover: 'hover:bg-blue-50' },
    { id: 'fire', name: 'Fire', emoji: '🔥', colorClass: 'text-orange-500', fillClass: 'fill-orange-500', bgHover: 'hover:bg-orange-50' },
    { id: 'smile', name: 'Smileys', emoji: '😊', colorClass: 'text-yellow-500', fillClass: 'fill-yellow-500', bgHover: 'hover:bg-yellow-50' },
];

// How It Works - UPDATED with larger icons
const HowItWorks: React.FC = () => (
    <div className="mb-8">
        <div className="grid grid-cols-3 gap-4">
            {[
                { num: '1', title: 'Choose Type', icon: CheckSquare, color: 'from-blue-500 to-indigo-600' },
                { num: '2', title: 'Add Question', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
                { num: '3', title: 'Share & Collect', icon: Share2, color: 'from-amber-500 to-orange-600' },
            ].map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                    <div className={`w-14 h-14 mx-auto mb-2 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <step.icon className="text-white" size={22} />
                    </div>
                    <div className="text-xs text-indigo-600 font-bold uppercase tracking-wide">Step {step.num}</div>
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
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
    // Template loading
    const { template: loadedTemplate, isFromTemplate } = useTemplateLoader();
    const [activeTemplate, setActiveTemplate] = useState<PollTemplate | null>(null);
    
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
    const [allowComments, setAllowComments] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');
    const [deadline, setDeadline] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [security, setSecurity] = useState<SecurityType>('cookie');
    const [accessCodes, setAccessCodes] = useState<string[]>([]);
    const [codeCount, setCodeCount] = useState(10);
    
    // Visual Poll image options
    const [imageOptions, setImageOptions] = useState<{ url: string; label: string }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Rating scale icon type
    const [ratingIcon, setRatingIcon] = useState<'star' | 'heart' | 'thumbs' | 'fire' | 'smile'>('star');
    
    // Shared PIN for poll protection
    const [sharedPin, setSharedPin] = useState('');
    const [currentPollCount, setCurrentPollCount] = useState(0);
    const [isOverLimit, setIsOverLimit] = useState(false);
    
    // Check for subscription tier
    const subscriptionTier = typeof window !== 'undefined' 
        ? (localStorage.getItem('vg_subscription_tier') as SubscriptionTier | null) 
        : null;
    
    const isPaidUser = subscriptionTier === 'pro' || subscriptionTier === 'business';
    const tierConfig = subscriptionTier ? SUBSCRIPTION_CONFIG[subscriptionTier] : SUBSCRIPTION_CONFIG.free;
    
    // Free tier limits
    const FREE_POLL_LIMIT = 3;
    
    // Check poll count on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPolls = localStorage.getItem('vg_polls');
            if (savedPolls) {
                try {
                    const polls = JSON.parse(savedPolls);
                    const count = polls.length || 0;
                    setCurrentPollCount(count);
                    // Check if over limit (only applies to free users)
                    if (!isPaidUser && count >= FREE_POLL_LIMIT) {
                        setIsOverLimit(true);
                    }
                } catch (e) {
                    console.error('Failed to parse vg_polls:', e);
                }
            }
        }
    }, [isPaidUser]);
    
    // Get current theme configuration for preview
    const currentTheme = useMemo(() => getThemeById(selectedTheme), [selectedTheme]);

    // Max deadline days based on tier
    const maxDays = isPaidUser ? 365 : 30;

    // Load template on mount
    useEffect(() => {
        if (loadedTemplate && !activeTemplate) {
            applyTemplate(loadedTemplate);
            setActiveTemplate(loadedTemplate);
        }
    }, [loadedTemplate]);

    // Apply template data to form
    const applyTemplate = (template: PollTemplate) => {
        setTitle(template.question);
        setDescription(''); // Template description is for the template card, not the poll
        setOptions(template.options);
        setPollType(template.pollType);
        if (template.settings) {
            setMultipleSelection(template.settings.allowMultiple || false);
            setHideResults(template.settings.hideResults || false);
        }
        setActiveTemplate(template);
    };

    // Clear template
    const clearTemplate = () => {
        setActiveTemplate(null);
        setTitle('');
        setDescription('');
        setOptions(['', '', '']);
        setPollType('multiple');
        // Clear URL param
        window.history.replaceState({}, '', '/create');
    };

    // Generate access codes
    const generateCodes = () => {
        const codes: string[] = [];
        for (let i = 0; i < codeCount; i++) {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            codes.push(code);
        }
        setAccessCodes(codes);
    };

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

        // Validate access codes if security is 'code'
        if (security === 'code' && accessCodes.length === 0) {
            setError('Generate access codes first');
            return;
        }
        
        // Validate shared PIN if security is 'pin'
        if (security === 'pin' && sharedPin.trim().length < 4) {
            setError('Set a PIN with at least 4 characters');
            return;
        }
        
        setIsCreating(true); setError(null);
        
        try {
            const validOptions = pollType === 'image' 
                ? imageOptions.map((img, i) => img.label || `Option ${i + 1}`)
                : options.filter(o => o.trim());
            
            const pollData: Record<string, unknown> = { 
                title: title.trim(), 
                description: description.trim() || undefined, 
                options: validOptions, 
                pollType, 
                settings: { 
                    allowMultiple: multipleSelection, 
                    requireNames, 
                    hideResults,
                    allowComments,
                    security,
                    deadline: deadline ? new Date(deadline).toISOString() : undefined 
                }, 
                buttonText: buttonText || 'Submit Vote', 
                tier: subscriptionTier || 'free',
                // Set response limits based on tier
                maxResponses: subscriptionTier === 'business' ? 100000 
                    : subscriptionTier === 'pro' ? 10000 
                    : 100 // free
            };
            
            // Add image URLs for visual polls
            if (pollType === 'image') {
                pollData.imageUrls = imageOptions.map(img => img.url);
            }

            // Add access codes if using code security
            if (security === 'code') {
                pollData.allowedCodes = accessCodes;
            }
            
            // Add shared PIN if using pin security
            if (security === 'pin') {
                pollData.pin = sharedPin.trim().toUpperCase();
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
                
                // Store the new poll credentials in localStorage for admin dashboard
                const existingPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
                if (!existingPolls.some((p: any) => p.id === pollId)) {
                    existingPolls.unshift({ id: pollId, adminKey, title, type: pollType, createdAt: new Date().toISOString() });
                    localStorage.setItem('vg_polls', JSON.stringify(existingPolls));
                }
                
                // PAID USERS: Go directly to admin dashboard
                // FREE USERS: Go through ad-wall first, then to admin dashboard
                // Include poll data in URL as fallback in case localStorage doesn't persist
                const adminUrl = `/admin?highlight=${pollId}&pid=${pollId}&key=${adminKey}&title=${encodeURIComponent(title)}&pt=${pollType}`;
                
                if (isPaidUser) {
                    window.location.href = adminUrl;
                } else {
                    window.location.href = `/ad-wall?redirect=${encodeURIComponent(adminUrl)}`;
                }
                return;
            } else { 
                setError(responseData.error || 'Failed to create poll. Please try again.'); 
                setIsCreating(false);
            }
        } catch (e: unknown) { 
            console.error('Poll creation error:', e);
            setError(e instanceof Error ? e.message : 'Network error. Please check your connection.'); 
            setIsCreating(false);
        }
    };

    return (
        // Background handled by parent component (CreatePage or LandingPage)
        <div className="py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* OVER LIMIT BLOCK - Show instead of create form for free users over poll limit */}
                {isOverLimit && !isPaidUser && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Poll Limit Reached</h2>
                                <p className="text-white/90">
                                    You have {currentPollCount} polls but the Free plan allows {FREE_POLL_LIMIT}
                                </p>
                            </div>
                            
                            {/* Body */}
                            <div className="p-6">
                                <p className="text-slate-600 text-center mb-6">
                                    Your existing polls will continue to work. To create new polls, you can:
                                </p>
                                
                                {/* Options */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Sparkles size={20} className="text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-emerald-800">Upgrade to Pro or Business</p>
                                            <p className="text-sm text-emerald-600">Get unlimited polls + premium features</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Trash2 size={20} className="text-slate-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">Delete {currentPollCount - FREE_POLL_LIMIT} poll{currentPollCount - FREE_POLL_LIMIT > 1 ? 's' : ''}</p>
                                            <p className="text-sm text-slate-500">Free up space by removing old polls</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a 
                                        href="/pricing" 
                                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl text-center transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={18} />
                                        Upgrade Now
                                    </a>
                                    <a 
                                        href="/admin" 
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-center transition flex items-center justify-center gap-2"
                                    >
                                        Go to Dashboard
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Normal create form - only show if not over limit */}
                {(!isOverLimit || isPaidUser) && (
                <>
                {/* Subscription Status Header for Paid Users */}
                {isPaidUser && !hideTierBanner && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-2xl ${SUBSCRIPTION_CONFIG[subscriptionTier!].colors} flex items-center justify-between`}
                    >
                        <div className="flex items-center gap-3">
                            {subscriptionTier === 'business' ? <Crown size={24} /> : <Zap size={24} />}
                            <div>
                                <p className="font-bold text-lg">{SUBSCRIPTION_CONFIG[subscriptionTier!].label} Plan Active</p>
                                <p className="text-sm opacity-90">
                                    All poll types included • {tierConfig.responses} responses • No ads
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a href="/admin" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition">
                                Dashboard
                            </a>
                            <a href="/templates" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition">
                                Templates
                            </a>
                        </div>
                    </motion.div>
                )}
                
                {/* UPDATED: Free User Templates CTA - Consistent button styling */}
                {!isPaidUser && !hideTierBanner && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-5 bg-white rounded-2xl border-2 border-indigo-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <LayoutTemplate size={24} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">Start faster with <span className="text-indigo-600">free</span> templates</p>
                                <p className="text-sm text-slate-600">Pre-built and ready to use — just customize and share</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <a 
                                href="/templates#polls" 
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg transition-all text-center"
                            >
                                Poll Templates
                            </a>
                            <a 
                                href="/templates#multi-question" 
                                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-emerald-700 hover:shadow-lg transition-all text-center"
                            >
                                Survey Templates
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Template Badge (if using a template) */}
                {activeTemplate && (
                    <div className="mb-4">
                        <TemplateBadge template={activeTemplate} onClear={clearTemplate} />
                    </div>
                )}

                <HowItWorks />

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div className="space-y-6">
                        {/* Poll Type Selection */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">1</span>
                                Poll Type
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {POLL_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setPollType(type.id)}
                                        className={`group p-3 rounded-xl border-2 transition-all text-left relative ${
                                            pollType === type.id 
                                                ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
                                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-2`}>
                                            <type.icon size={16} className="text-white" />
                                        </div>
                                        <div className="font-semibold text-slate-900 text-sm">{type.name}</div>
                                        <div className="text-xs text-slate-500">{type.shortDesc}</div>
                                        
                                        {/* Hover tooltip with best use */}
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                                            {type.id === 'multiple' && 'Best for: Quick decisions, feedback forms'}
                                            {type.id === 'ranked' && 'Best for: Priority ranking, preferences'}
                                            {type.id === 'pairwise' && 'Best for: A/B testing, comparisons'}
                                            {type.id === 'meeting' && 'Best for: Scheduling, availability'}
                                            {type.id === 'rating' && 'Best for: Reviews, satisfaction scores'}
                                            {type.id === 'rsvp' && 'Best for: Event attendance'}
                                            {type.id === 'image' && 'Best for: Design votes, photo contests'}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Template & Survey buttons */}
                            {!activeTemplate && (
                                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-3">
                                    <a 
                                        href="/templates#polls"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <LayoutTemplate size={16} />
                                        Start from Template
                                    </a>
                                    <a 
                                        href="/survey"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                        <ClipboardList size={16} />
                                        Create Multi-Question Survey
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        {/* Question & Options - Dynamic based on poll type */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">2</span>
                                Question & Options
                            </h2>
                            
                            {/* Poll type hint - Better contrast */}
                            <div className="mb-4 p-3 rounded-xl bg-slate-100 border border-slate-200">
                                <p className="text-sm text-slate-700 font-medium">
                                    {pollType === 'multiple' && '💡 Voters will pick one or more options from your list. Best for quick decisions.'}
                                    {pollType === 'ranked' && '💡 Voters drag to rank options by preference. Best for prioritizing choices.'}
                                    {pollType === 'rating' && '💡 Voters rate each aspect 1-5 stars. Best for reviews and feedback.'}
                                    {pollType === 'meeting' && '💡 Voters mark availability for each time slot. Best for scheduling.'}
                                    {pollType === 'rsvp' && '💡 Voters respond Yes, No, or Maybe. Best for event attendance.'}
                                    {pollType === 'pairwise' && '💡 Voters choose between two options. Best for A/B testing and comparisons.'}
                                    {pollType === 'image' && '💡 Upload images for voters to choose from. Supports JPG, PNG up to 5MB each.'}
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {pollType === 'meeting' ? 'Event Name' : pollType === 'rsvp' ? 'Event Name' : 'Your Question'}
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={POLL_TYPE_PLACEHOLDERS[pollType]?.question || placeholderQuestion}
                                        className="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Description <span className="text-slate-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={pollType === 'meeting' ? 'Add location, meeting link, or other details...' : pollType === 'rsvp' ? 'Event details, location, dress code...' : 'Add context or instructions...'}
                                        rows={2}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm resize-none"
                                    />
                                </div>
                            </div>
                            
                            {/* RATING SCALE - Configurable aspects and icon type */}
                            {pollType === 'rating' && (
                                <div className="mt-6 space-y-4">
                                    {/* Rating Icon Selection */}
                                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl border border-cyan-200">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Rating Style <span className="text-slate-400 font-normal">(choose icon type)</span>
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                            {RATING_ICONS.map((iconOpt) => (
                                                <button
                                                    key={iconOpt.id}
                                                    type="button"
                                                    onClick={() => setRatingIcon(iconOpt.id as typeof ratingIcon)}
                                                    className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border-2 transition-all ${
                                                        ratingIcon === iconOpt.id
                                                            ? 'border-cyan-500 bg-white shadow-md scale-105'
                                                            : 'border-transparent bg-white/60 hover:bg-white hover:border-cyan-200'
                                                    }`}
                                                >
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3].map((n) => (
                                                            <span key={n} className="text-sm">
                                                                {iconOpt.emoji}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-500 truncate max-w-full">{iconOpt.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Rating aspects */}
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            What should voters rate? <span className="text-slate-400 font-normal">(add items)</span>
                                        </label>
                                        
                                        {/* Rating items */}
                                        <div className="space-y-2 mb-3">
                                            {options.map((opt, i) => {
                                                const currentEmoji = RATING_ICONS.find(r => r.id === ratingIcon)?.emoji || '⭐';
                                                return (
                                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 items-center">
                                                        <input 
                                                            type="text" 
                                                            value={opt} 
                                                            onChange={(e) => updateOption(i, e.target.value)} 
                                                            placeholder={`e.g., ${['Service', 'Cleanliness', 'Value', 'Staff', 'Overall'][i] || 'Aspect ' + (i + 1)}`}
                                                            className="flex-1 px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
                                                        />
                                                        <div className="flex gap-0.5 shrink-0 bg-white px-2 py-1 rounded-lg border border-amber-200">
                                                            {[1, 2, 3, 4, 5].map((n) => (
                                                                <span key={n} className="text-sm">{currentEmoji}</span>
                                                            ))}
                                                        </div>
                                                        {options.length > 1 && (
                                                            <button onClick={() => removeOption(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        
                                        {options.length < 10 && (
                                            <button onClick={addOption} className="flex items-center gap-2 px-3 py-2 text-amber-600 hover:bg-amber-100 rounded-lg text-sm font-medium border border-dashed border-amber-300 w-full justify-center">
                                                <Plus size={16} />Add rating aspect
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Rating preview */}
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-xs text-slate-500 mb-3 font-medium">Preview: How voters will see it</p>
                                        <div className="space-y-3">
                                            {(options.filter(o => o.trim()).length > 0 ? options.filter(o => o.trim()).slice(0, 2) : ['Service', 'Quality']).map((aspect, i) => {
                                                const currentEmoji = RATING_ICONS.find(r => r.id === ratingIcon)?.emoji || '⭐';
                                                return (
                                                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                                        <span className="text-sm text-slate-700 font-medium">{aspect}</span>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((n) => (
                                                                <button key={n} className={`text-xl transition-transform hover:scale-125 ${n <= 3 ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                                                                    {currentEmoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* RSVP - Event details and response options */}
                            {pollType === 'rsvp' && (
                                <div className="mt-6 space-y-4">
                                    {/* Event Details */}
                                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Event Details <span className="text-slate-400 font-normal">(optional but recommended)</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Event Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Event Time</label>
                                                <input 
                                                    type="time" 
                                                    className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-slate-500 mb-1">Location</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g., 123 Main St or Zoom link"
                                                    className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Response Options - Fixed */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Response Options <span className="text-slate-400 font-normal">(standard RSVP)</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center">
                                                <span className="text-2xl mb-1 block">✓</span>
                                                <span className="font-semibold text-emerald-700">Yes</span>
                                                <p className="text-xs text-emerald-600 mt-1">I'll attend</p>
                                            </div>
                                            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-center">
                                                <span className="text-2xl mb-1 block">✗</span>
                                                <span className="font-semibold text-red-700">No</span>
                                                <p className="text-xs text-red-600 mt-1">Can't make it</p>
                                            </div>
                                            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
                                                <span className="text-2xl mb-1 block">?</span>
                                                <span className="font-semibold text-amber-700">Maybe</span>
                                                <p className="text-xs text-amber-600 mt-1">Not sure yet</p>
                                            </div>
                                        </div>
                                        <p className="text-center text-xs text-slate-500 mt-3">
                                            💡 RSVP responses are fixed. Themes affect only the visual styling.
                                        </p>
                                    </div>
                                    
                                    {/* Additional RSVP Options */}
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div>
                                                <span className="text-sm font-medium text-slate-700">Ask for +1 / guest count</span>
                                                <p className="text-xs text-slate-500">Attendees can indicate if they're bringing guests</p>
                                            </div>
                                            <input type="checkbox" className="w-5 h-5 rounded text-sky-600" />
                                        </label>
                                    </div>
                                </div>
                            )}
                            
                            {/* PAIRWISE (This or That) - Two options side by side */}
                            {pollType === 'pairwise' && (
                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Options to Compare <span className="text-slate-400 font-normal">(exactly 2 choices)</span>
                                        </label>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-1">
                                                <label className="block text-xs text-orange-600 font-medium mb-1">Option A</label>
                                                <input 
                                                    type="text" 
                                                    value={options[0] || ''} 
                                                    onChange={(e) => updateOption(0, e.target.value)} 
                                                    placeholder="e.g., Design A, Option 1, Team A" 
                                                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-center font-semibold bg-white"
                                                />
                                            </div>
                                            <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                                                VS
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-red-600 font-medium mb-1">Option B</label>
                                                <input 
                                                    type="text" 
                                                    value={options[1] || ''} 
                                                    onChange={(e) => updateOption(1, e.target.value)} 
                                                    placeholder="e.g., Design B, Option 2, Team B" 
                                                    className="w-full px-4 py-3 border-2 border-red-200 rounded-xl text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 text-center font-semibold bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Use cases */}
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <p className="text-xs text-slate-500 font-medium mb-2">Great for:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Logo comparisons', 'A/B testing', 'Quick decisions', 'Design feedback'].map((use) => (
                                                <span key={use} className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">{use}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* MEETING POLL - Time slots with better guidance */}
                            {pollType === 'meeting' && (
                                <div className="mt-6 space-y-4">
                                    {/* Time slots section */}
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            Available Time Slots <span className="text-slate-400 font-normal">(add options for attendees)</span>
                                        </label>
                                        <div className="space-y-2">
                                            {options.map((opt, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-2 items-center">
                                                    <Calendar size={18} className="text-amber-500 shrink-0" />
                                                    <input 
                                                        type="text" 
                                                        value={opt} 
                                                        onChange={(e) => updateOption(i, e.target.value)} 
                                                        placeholder={[
                                                            'Monday, Jan 15 at 2:00 PM',
                                                            'Tuesday, Jan 16 at 10:00 AM', 
                                                            'Wednesday, Jan 17 at 3:00 PM'
                                                        ][i] || `Time slot ${i + 1}`} 
                                                        className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm transition ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white'}`} 
                                                    />
                                                    {options.length > 2 && (
                                                        <button onClick={() => removeOption(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        {options.length < 20 && (
                                            <button onClick={addOption} className="mt-3 flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-100 rounded-xl text-sm font-semibold border-2 border-dashed border-amber-300 w-full justify-center transition">
                                                <Plus size={18} />Add Time Slot
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* How voting works */}
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <p className="text-xs text-slate-500 font-medium mb-2">How it works:</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center">✓</span> Available</span>
                                            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-amber-100 rounded flex items-center justify-center">?</span> Maybe</span>
                                            <span className="flex items-center gap-1"><span className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center">—</span> Unavailable</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Visual Poll Images */}
                            {pollType === 'image' && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Upload Images ({imageOptions.length}/10)
                                        </label>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                            JPG, PNG • Max 5MB each
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {/* Existing Images */}
                                        {imageOptions.map((img, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-pink-200 group"
                                            >
                                                <img src={img.url} alt={`Option ${i + 1}`} className="w-full h-full object-cover" />
                                                <input
                                                    type="text"
                                                    value={img.label}
                                                    onChange={(e) => {
                                                        const updated = [...imageOptions];
                                                        updated[i].label = e.target.value;
                                                        setImageOptions(updated);
                                                    }}
                                                    placeholder={`Label (optional)`}
                                                    className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-2 py-1 backdrop-blur-sm border-0 focus:outline-none focus:bg-black/70"
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
                                                    accept="image/jpeg,image/png,image/jpg" 
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        
                                                        // Validate file type
                                                        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                                                            setError('Please upload JPG or PNG images only');
                                                            return;
                                                        }
                                                        
                                                        // Validate file size (5MB)
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            setError('Image must be under 5MB');
                                                            return;
                                                        }
                                                        
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
                                                        <span className="text-pink-600 text-sm font-medium">Upload</span>
                                                        <span className="text-pink-400 text-xs">JPG, PNG</span>
                                                    </>
                                                )}
                                            </label>
                                        )}
                                    </div>
                                    
                                    {imageOptions.length === 1 && (
                                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={14} className="text-amber-600 shrink-0" />
                                            <p className="text-amber-700 text-xs">Add one more image to create your poll</p>
                                        </div>
                                    )}
                                    
                                    {imageOptions.length === 0 && (
                                        <div className="text-center py-3 px-3 bg-pink-50/50 rounded-lg border border-dashed border-pink-200">
                                            <p className="text-slate-500 text-xs">Upload at least 2 images • JPG/PNG • Max 5MB</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* MULTIPLE CHOICE & RANKED - Standard options list */}
                            {(pollType === 'multiple' || pollType === 'ranked') && (
                                <div className="mt-6 space-y-4">
                                    <div className={`p-4 rounded-xl border ${pollType === 'ranked' ? 'bg-violet-50 border-violet-200' : 'bg-indigo-50 border-indigo-200'}`}>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            {pollType === 'ranked' ? 'Options to Rank' : 'Answer Options'} 
                                            <span className="text-slate-400 font-normal ml-1">(2-20 options)</span>
                                        </label>
                                        <div className="space-y-2">
                                            {options.map((opt, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-2 items-center">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${pollType === 'ranked' ? 'bg-violet-200 text-violet-700' : 'bg-indigo-200 text-indigo-700'}`}>{i + 1}</span>
                                                    <input 
                                                        type="text" 
                                                        value={opt} 
                                                        onChange={(e) => updateOption(i, e.target.value)} 
                                                        placeholder={pollType === 'ranked' 
                                                            ? ['First choice', 'Second choice', 'Third choice'][i] || `Option ${i + 1}`
                                                            : `Option ${i + 1}`
                                                        } 
                                                        className={`flex-1 px-4 py-3 border-2 rounded-xl text-sm transition bg-white ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50 focus:border-red-400' : pollType === 'ranked' ? 'border-violet-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100' : 'border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`} 
                                                    />
                                                    {options.length > 2 && (
                                                        <button onClick={() => removeOption(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        {hasDuplicates && (
                                            <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <AlertCircle size={14} /> Duplicate options detected
                                            </p>
                                        )}
                                        {options.length < 20 && (
                                            <button onClick={addOption} className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 border-dashed w-full justify-center transition ${pollType === 'ranked' ? 'text-violet-600 hover:bg-violet-100 border-violet-300' : 'text-indigo-600 hover:bg-indigo-100 border-indigo-300'}`}>
                                                <Plus size={18} />Add Option
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* How voting works */}
                                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                                        <p className="text-xs text-slate-500 font-medium mb-2">How voters will interact:</p>
                                        {pollType === 'ranked' ? (
                                            <p className="text-xs text-slate-600">Voters drag and drop to arrange options from their #1 choice to their last choice.</p>
                                        ) : (
                                            <p className="text-xs text-slate-600">Voters click to select one option (or multiple if enabled in settings).</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Settings */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                            subscriptionTier === 'business' ? 'border-2 border-purple-200' :
                            subscriptionTier === 'pro' ? 'border-2 border-indigo-200' :
                            'border border-slate-200'
                        }`}>
                            <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm">3</span>
                                    Poll Settings
                                </span>
                                {showAdvanced ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </button>
                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200">
                                        <div className="p-6 space-y-6">
                                            
                                            {/* ===== TIMING SECTION ===== */}
                                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Clock size={18} className="text-amber-600" />
                                                    <h3 className="text-sm font-bold text-amber-800">Timing</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-slate-700">Auto-close poll</span>
                                                            {!isPaidUser ? (
                                                                <span className="text-xs bg-white text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                                                                    Free: 30 days max • <a href="/pricing" className="underline">Upgrade for unlimited</a>
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                                                    ✓ {subscriptionTier === 'business' ? 'Unlimited duration' : 'Up to 1 year'}
                                                                </span>
                                                            )}
                                                        </label>
                                                        <input 
                                                            type="datetime-local" 
                                                            value={deadline} 
                                                            onChange={(e) => setDeadline(e.target.value)} 
                                                            min={new Date().toISOString().slice(0, 16)} 
                                                            max={getMaxDeadline()} 
                                                            className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg text-sm bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100" 
                                                        />
                                                        <p className="text-xs text-slate-500 mt-1">Leave empty to keep poll open indefinitely</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* ===== VOTING RULES SECTION ===== */}
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckSquare size={18} className="text-indigo-600" />
                                                    <h3 className="text-sm font-bold text-indigo-800">Voting Rules</h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {pollType === 'multiple' && (
                                                        <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white cursor-pointer transition">
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Allow multiple selections</span>
                                                                <p className="text-xs text-slate-500">Voters can pick more than one option</p>
                                                            </div>
                                                            <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)} className="w-5 h-5 rounded text-indigo-600" />
                                                        </label>
                                                    )}
                                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white cursor-pointer transition">
                                                        <div>
                                                            <span className="font-medium text-slate-700 text-sm">Require voter names</span>
                                                            <p className="text-xs text-slate-500">Voters must enter their name before voting</p>
                                                        </div>
                                                        <input type="checkbox" checked={requireNames} onChange={(e) => setRequireNames(e.target.checked)} className="w-5 h-5 rounded text-indigo-600" />
                                                    </label>
                                                    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-white cursor-pointer transition">
                                                        <div>
                                                            <span className="font-medium text-slate-700 text-sm">Hide results until closed</span>
                                                            <p className="text-xs text-slate-500">Voters can't see results until poll ends</p>
                                                        </div>
                                                        <input type="checkbox" checked={hideResults} onChange={(e) => setHideResults(e.target.checked)} className="w-5 h-5 rounded text-indigo-600" />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* ===== SECURITY SECTION ===== */}
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Shield size={18} className="text-slate-600" />
                                                    <h3 className="text-sm font-bold text-slate-800">Vote Protection</h3>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-3">Control how many times someone can vote. Hover for details.</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {SECURITY_OPTIONS.map((option) => {
                                                        const isProFeature = option.isPro;
                                                        const isDisabled = isProFeature && !isPaidUser;
                                                        return (
                                                            <div key={option.id} className="relative group">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => !isDisabled && setSecurity(option.id as SecurityType)}
                                                                    disabled={isDisabled}
                                                                    className={`w-full p-3 rounded-xl border-2 text-left transition relative ${
                                                                        security === option.id 
                                                                            ? 'border-indigo-500 bg-white shadow-sm' 
                                                                            : isDisabled
                                                                                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                                                                                : 'border-slate-200 bg-white hover:border-indigo-300'
                                                                    }`}
                                                                >
                                                                    {isProFeature && !isPaidUser && (
                                                                        <a href="/pricing" className="absolute -top-2 -right-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full hover:bg-purple-700 transition-all shadow-sm">
                                                                            Upgrade
                                                                        </a>
                                                                    )}
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <option.icon size={14} className={security === option.id ? 'text-indigo-600' : 'text-slate-400'} />
                                                                        <span className="font-medium text-sm text-slate-900">{option.name}</span>
                                                                    </div>
                                                                    <span className="text-xs text-slate-500">{option.desc}</span>
                                                                </button>
                                                                
                                                                {/* Hover tooltip */}
                                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-56 shadow-lg">
                                                                    {option.tooltip}
                                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                {/* Shared PIN Input */}
                                                {security === 'pin' && (
                                                    <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200">
                                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Set Poll PIN</label>
                                                        <p className="text-xs text-slate-500 mb-3">All voters must enter this PIN to access the poll. Share it with your intended audience.</p>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={sharedPin}
                                                                onChange={(e) => setSharedPin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
                                                                placeholder="e.g., TEAM2024"
                                                                maxLength={10}
                                                                className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-mono uppercase tracking-wider focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setSharedPin(Math.random().toString(36).substring(2, 8).toUpperCase())}
                                                                className="px-3 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition"
                                                            >
                                                                Generate
                                                            </button>
                                                        </div>
                                                        {sharedPin && (
                                                            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                                                <Check size={12} /> PIN set: <span className="font-mono font-bold">{sharedPin}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Access Codes Generator */}
                                                {security === 'code' && (
                                                    <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="text-sm font-semibold text-slate-700">Generate Unique Codes</label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="100"
                                                                    value={codeCount}
                                                                    onChange={(e) => setCodeCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 10)))}
                                                                    className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={generateCodes}
                                                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                                                                >
                                                                    Generate
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mb-3">Each code can only be used once. Distribute to your voters individually.</p>
                                                        {accessCodes.length > 0 && (
                                                            <div className="mt-3 p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                                                                <div className="grid grid-cols-5 gap-1 text-xs font-mono">
                                                                    {accessCodes.map((code, i) => (
                                                                        <span key={i} className="px-2 py-1 bg-white rounded text-center border">{code}</span>
                                                                    ))}
                                                                </div>
                                                                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                                                    <Check size={12} /> {accessCodes.length} codes generated. Each can be used once.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ===== PRO FEATURES SECTION ===== */}
                                            <div className={`p-4 rounded-xl border ${isPaidUser ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPaidUser ? 'bg-gradient-to-br from-amber-400 to-yellow-500' : 'bg-gradient-to-br from-amber-300 to-yellow-400'}`}>
                                                        <Crown size={16} className="text-white drop-shadow-sm" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-sm font-bold ${isPaidUser ? 'text-purple-800' : 'text-slate-600'}`}>Pro Features</h3>
                                                        <p className="text-xs text-slate-500">{isPaidUser ? 'All features unlocked' : 'Upgrade to unlock these features'}</p>
                                                    </div>
                                                    {!isPaidUser && (
                                                        <a href="/pricing" className="ml-auto px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-all shadow-sm">
                                                            Upgrade →
                                                        </a>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {/* Allow Comments */}
                                                    <label className={`group flex items-center justify-between p-3 rounded-lg transition ${
                                                        isPaidUser ? 'hover:bg-white cursor-pointer' : 'opacity-60 cursor-not-allowed'
                                                    }`}>
                                                        <div className="flex items-center gap-3">
                                                            <MessageSquare size={16} className={isPaidUser ? 'text-purple-500' : 'text-slate-400'} />
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Voter comments</span>
                                                                <p className="text-xs text-slate-500">Collect feedback with votes</p>
                                                            </div>
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={allowComments} 
                                                            onChange={(e) => isPaidUser && setAllowComments(e.target.checked)} 
                                                            disabled={!isPaidUser}
                                                            className="w-5 h-5 rounded text-purple-600" 
                                                        />
                                                    </label>
                                                    
                                                    {/* Remove Branding - Display only */}
                                                    <div className={`flex items-center justify-between p-3 rounded-lg ${isPaidUser ? 'bg-white/50' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <X size={16} className={isPaidUser ? 'text-purple-500' : 'text-slate-400'} />
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Remove VoteGenerator badge</span>
                                                                <p className="text-xs text-slate-500">Clean, unbranded polls</p>
                                                            </div>
                                                        </div>
                                                        {isPaidUser ? (
                                                            <Check size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <Lock size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Custom Logo - Display only */}
                                                    <div className={`flex items-center justify-between p-3 rounded-lg ${isPaidUser ? 'bg-white/50' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <ImageIcon size={16} className={isPaidUser ? 'text-purple-500' : 'text-slate-400'} />
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Upload custom logo</span>
                                                                <p className="text-xs text-slate-500">Add your brand to polls</p>
                                                            </div>
                                                        </div>
                                                        {isPaidUser ? (
                                                            <Check size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <Lock size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Custom Thank You - Display only */}
                                                    <div className={`flex items-center justify-between p-3 rounded-lg ${isPaidUser ? 'bg-white/50' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <Sparkles size={16} className={isPaidUser ? 'text-purple-500' : 'text-slate-400'} />
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Custom thank-you message</span>
                                                                <p className="text-xs text-slate-500">Personalized post-vote screen</p>
                                                            </div>
                                                        </div>
                                                        {isPaidUser ? (
                                                            <Check size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <Lock size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Custom Short Links - Display only */}
                                                    <div className={`flex items-center justify-between p-3 rounded-lg ${isPaidUser ? 'bg-white/50' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <Share2 size={16} className={isPaidUser ? 'text-purple-500' : 'text-slate-400'} />
                                                            <div>
                                                                <span className="font-medium text-slate-700 text-sm">Custom short links</span>
                                                                <p className="text-xs text-slate-500">votegenerator.com/your-name</p>
                                                            </div>
                                                        </div>
                                                        {isPaidUser ? (
                                                            <Check size={18} className="text-emerald-500" />
                                                        ) : (
                                                            <Lock size={14} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* ===== APPEARANCE SECTION ===== */}
                                            <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-purple-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Sparkles size={18} className="text-purple-600" />
                                                    <h3 className="text-sm font-bold text-purple-800">Appearance</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {/* Button Text */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Submit Button Text</label>
                                                        <input 
                                                            type="text" 
                                                            value={buttonText} 
                                                            onChange={(e) => setButtonText(e.target.value)} 
                                                            placeholder="Submit Vote" 
                                                            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg text-sm bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100" 
                                                        />
                                                    </div>
                                                    
                                                    {/* Theme */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                                                        <ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} isPaidUser={isPaidUser} />
                                                    </div>
                                                </div>
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

                    {/* Right: Preview */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <Eye size={18} /> Live Preview
                                </h3>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-md transition ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}><Monitor size={16} /></button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-md transition ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}><Smartphone size={16} /></button>
                                </div>
                            </div>
                            
                            {/* Device Frame */}
                            {previewDevice === 'mobile' ? (
                                /* Mobile Phone Frame */
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="w-[280px] bg-slate-800 rounded-[3rem] p-3 shadow-2xl">
                                            <div className={`relative rounded-[2.25rem] overflow-hidden ${currentTheme.pageBg}`}>
                                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>
                                                <div className="pt-12 pb-6" style={{ minHeight: '480px' }}>
                                                    {/* Header */}
                                                    <div className={`px-4 py-3 ${currentTheme.headerStyle}`}>
                                                        {activeTemplate ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{activeTemplate.icon}</span>
                                                                <span className={`font-semibold text-sm ${currentTheme.headerText}`}>{activeTemplate.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className={`text-xs font-medium ${currentTheme.headerText} opacity-70`}>
                                                                {currentTheme.emoji} {currentTheme.name} Theme
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Card Content - Fix: detect dark card background */}
                                                    {(() => {
                                                        const isDarkCard = currentTheme.cardBg?.includes('slate-8') || currentTheme.cardBg?.includes('slate-9');
                                                        return (
                                                            <div className={`mx-3 mt-3 rounded-xl ${currentTheme.cardBg} ${currentTheme.cardBorder ? `border-2 ${currentTheme.cardBorder}` : ''} p-4 ${currentTheme.specialEffect === 'glass' ? 'backdrop-blur-sm' : ''}`}>
                                                                <h4 className={`text-lg font-bold mb-2 ${isDarkCard ? 'text-white' : 'text-slate-900'}`}>
                                                                    {title || POLL_TYPE_PLACEHOLDERS[pollType]?.question || 'Your question here'}
                                                                </h4>
                                                                {description && <p className={`text-sm mb-4 ${isDarkCard ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>}
                                                                
                                                                {pollType === 'image' ? (
                                                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                                                        {imageOptions.length > 0 ? (
                                                                            imageOptions.map((img, i) => (
                                                                                <div key={i} className={`aspect-square rounded-lg overflow-hidden border-2 ${currentTheme.cardBorder}`}>
                                                                                    <img src={img.url} alt={img.label || `Option ${i + 1}`} className="w-full h-full object-cover" />
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            /* Placeholder image boxes */
                                                                            [1, 2].map((n) => (
                                                                                <div key={n} className={`aspect-square rounded-lg border-2 ${currentTheme.cardBorder} flex items-center justify-center ${isDarkCard ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                                                                                    <ImageIcon size={24} className={isDarkCard ? 'text-slate-500' : 'text-slate-300'} />
                                                                                </div>
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                ) : pollType === 'rating' ? (
                                                                    <div className="space-y-2 mb-4">
                                                                        {(options.filter(o => o.trim()).length > 0 ? options.filter(o => o.trim()).slice(0, 2) : ['Service', 'Quality']).map((aspect, i) => {
                                                                            const currentEmoji = RATING_ICONS.find(r => r.id === ratingIcon)?.emoji || '⭐';
                                                                            return (
                                                                                <div key={i} className="flex items-center justify-between">
                                                                                    <span className={`text-xs ${isDarkCard ? 'text-slate-300' : 'text-slate-600'}`}>{aspect}</span>
                                                                                    <div className="flex gap-0.5">
                                                                                        {[1, 2, 3, 4, 5].map((n) => (
                                                                                            <span key={n} className="text-sm">{currentEmoji}</span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : pollType === 'rsvp' ? (
                                                                    <div className="flex gap-2 mb-4">
                                                                        <div className={`flex-1 p-2 rounded-lg text-center ${isDarkCard ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                                                            <span className="text-lg">✓</span>
                                                                            <p className={`text-xs font-medium ${isDarkCard ? 'text-emerald-300' : 'text-emerald-700'}`}>Yes</p>
                                                                        </div>
                                                                        <div className={`flex-1 p-2 rounded-lg text-center ${isDarkCard ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                                                            <span className="text-lg">✗</span>
                                                                            <p className={`text-xs font-medium ${isDarkCard ? 'text-red-300' : 'text-red-700'}`}>No</p>
                                                                        </div>
                                                                        <div className={`flex-1 p-2 rounded-lg text-center ${isDarkCard ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                                                            <span className="text-lg">?</span>
                                                                            <p className={`text-xs font-medium ${isDarkCard ? 'text-amber-300' : 'text-amber-700'}`}>Maybe</p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-2 mb-4">
                                                                        {(options.filter(o => o.trim()).length > 0 ? options.filter(o => o.trim()) : POLL_TYPE_PLACEHOLDERS[pollType]?.options || ['Option 1', 'Option 2']).map((opt, i) => (
                                                                            <div key={i} className={`p-3 rounded-xl text-sm transition cursor-pointer ${currentTheme.optionStyle}`}>
                                                                                <span className={isDarkCard ? 'text-white' : 'text-slate-700'}>{opt}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                
                                                                <button className={`w-full py-3 font-bold rounded-xl ${currentTheme.buttonBg} ${currentTheme.buttonText}`}>
                                                                    {buttonText || 'Submit Vote'}
                                                                </button>
                                                            </div>
                                                        );
                                                    })()}
                                                    
                                                    {!isPaidUser && (
                                                        <div className="mt-3 text-center">
                                                            <span className={`text-xs ${currentTheme.pageBg?.includes('slate-9') ? 'text-slate-400' : 'text-slate-400'}`}>
                                                                Powered by <span className="font-semibold" style={{ color: currentTheme.primary }}>VoteGenerator</span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full ${currentTheme.pageBg?.includes('slate-9') ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Desktop Browser Frame */
                                <div className="bg-slate-100 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                                    <div className="bg-slate-200 px-4 py-2 flex items-center gap-3 border-b border-slate-300">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
                                            votegenerator.com/v/abc123
                                        </div>
                                    </div>
                                    
                                    {/* Theme-styled content area */}
                                    <div className={`${currentTheme.pageBg} p-4`}>
                                        {/* Header */}
                                        <div className={`-mx-4 -mt-4 mb-4 px-4 py-3 ${currentTheme.headerStyle}`}>
                                            {activeTemplate ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{activeTemplate.icon}</span>
                                                    <span className={`font-semibold text-sm ${currentTheme.headerText}`}>{activeTemplate.name}</span>
                                                </div>
                                            ) : (
                                                <div className={`flex items-center gap-2 ${currentTheme.headerText}`}>
                                                    <span>{currentTheme.emoji}</span>
                                                    <span className="text-sm font-medium">{currentTheme.name} Theme Preview</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Card */}
                                        <div className={`rounded-xl ${currentTheme.cardBg} ${currentTheme.cardBorder ? `border-2 ${currentTheme.cardBorder}` : ''} p-6 ${currentTheme.specialEffect === 'glass' ? 'backdrop-blur-sm' : ''} ${currentTheme.specialEffect === 'shadow-lg' ? 'shadow-2xl' : 'shadow-lg'}`}
                                            style={currentTheme.specialEffect === 'glow' ? { 
                                                boxShadow: `0 0 40px ${currentTheme.primary}30, 0 0 80px ${currentTheme.primary}15` 
                                            } : undefined}
                                        >
                                            <h4 className={`text-xl font-bold mb-2 ${currentTheme.cardBg?.includes('slate-8') ? 'text-white' : 'text-slate-900'}`}>
                                                {title || POLL_TYPE_PLACEHOLDERS[pollType]?.question || 'Your question here'}
                                            </h4>
                                            {description && <p className={`text-sm mb-4 ${currentTheme.cardBg?.includes('slate-8') ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>}
                                            
                                            {pollType === 'image' ? (
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    {imageOptions.length > 0 ? (
                                                        imageOptions.map((img, i) => (
                                                            <div key={i} className={`aspect-square rounded-lg overflow-hidden border-2 ${currentTheme.cardBorder} hover:scale-105 transition-transform`}>
                                                                <img src={img.url} alt={img.label || `Option ${i + 1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        /* Placeholder image boxes */
                                                        [1, 2].map((n) => (
                                                            <div key={n} className={`aspect-square rounded-lg border-2 ${currentTheme.cardBorder} flex items-center justify-center ${currentTheme.cardBg?.includes('slate-8') ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                                                                <div className="text-center">
                                                                    <ImageIcon size={32} className={currentTheme.cardBg?.includes('slate-8') ? 'text-slate-500 mx-auto' : 'text-slate-300 mx-auto'} />
                                                                    <span className={`text-xs mt-1 block ${currentTheme.cardBg?.includes('slate-8') ? 'text-slate-500' : 'text-slate-400'}`}>Image {n}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            ) : pollType === 'rating' ? (
                                                <div className="space-y-3 mb-6">
                                                    {(options.filter(o => o.trim()).length > 0 ? options.filter(o => o.trim()).slice(0, 3) : ['Service', 'Quality', 'Value']).map((aspect, i) => {
                                                        const currentEmoji = RATING_ICONS.find(r => r.id === ratingIcon)?.emoji || '⭐';
                                                        const isDarkCard = currentTheme.cardBg?.includes('slate-8') || currentTheme.cardBg?.includes('slate-9');
                                                        return (
                                                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme.optionStyle}`}>
                                                                <span className={`text-sm font-medium ${isDarkCard ? 'text-slate-200' : 'text-slate-700'}`}>{aspect}</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                                        <span key={n} className="text-xl hover:scale-110 transition-transform cursor-pointer">{currentEmoji}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : pollType === 'rsvp' ? (
                                                <div className="grid grid-cols-3 gap-3 mb-6">
                                                    <div className={`p-4 rounded-xl text-center border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer`}>
                                                        <span className="text-2xl block mb-1">✓</span>
                                                        <span className="font-semibold text-emerald-700">Yes</span>
                                                    </div>
                                                    <div className={`p-4 rounded-xl text-center border-2 border-red-300 bg-red-50 hover:bg-red-100 transition cursor-pointer`}>
                                                        <span className="text-2xl block mb-1">✗</span>
                                                        <span className="font-semibold text-red-700">No</span>
                                                    </div>
                                                    <div className={`p-4 rounded-xl text-center border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 transition cursor-pointer`}>
                                                        <span className="text-2xl block mb-1">?</span>
                                                        <span className="font-semibold text-amber-700">Maybe</span>
                                                    </div>
                                                </div>
                                            ) : pollType === 'pairwise' ? (
                                                <div className="flex gap-4 items-center mb-6">
                                                    <div className={`flex-1 p-4 rounded-xl text-center ${currentTheme.optionStyle} cursor-pointer`}>
                                                        <span className={`font-semibold ${currentTheme.cardBg?.includes('slate-8') ? 'text-white' : 'text-slate-700'}`}>
                                                            {options[0] || 'Option A'}
                                                        </span>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                                                        VS
                                                    </div>
                                                    <div className={`flex-1 p-4 rounded-xl text-center ${currentTheme.optionStyle} cursor-pointer`}>
                                                        <span className={`font-semibold ${currentTheme.cardBg?.includes('slate-8') ? 'text-white' : 'text-slate-700'}`}>
                                                            {options[1] || 'Option B'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 mb-6">
                                                    {(options.filter(o => o.trim()).length > 0 ? options.filter(o => o.trim()) : POLL_TYPE_PLACEHOLDERS[pollType]?.options || ['Option 1', 'Option 2']).map((opt, i) => (
                                                        <div key={i} className={`p-4 rounded-xl text-sm transition cursor-pointer ${currentTheme.optionStyle}`}>
                                                            <span className={currentTheme.cardBg?.includes('slate-8') ? 'text-white' : 'text-slate-700'}>{opt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <button className={`w-full py-3 font-bold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg ${currentTheme.buttonBg} ${currentTheme.buttonText}`}>
                                                {buttonText || 'Submit Vote'}
                                            </button>
                                        </div>
                                        
                                        {!isPaidUser && (
                                            <div className="mt-4 text-center">
                                                <span className={`text-xs ${currentTheme.pageBg?.includes('slate-9') ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Powered by <span className="font-semibold" style={{ color: currentTheme.primary }}>VoteGenerator</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </>
                )}
            </div>
        </div>
    );
};

export default VoteGeneratorCreate;
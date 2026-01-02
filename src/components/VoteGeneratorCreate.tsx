// ============================================================================
// VoteGeneratorCreate - FORM ONLY (parent handles headers)
// Uses sessionStorage for ad wall redirect to avoid URL encoding issues
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, ChevronDown, ChevronUp, Lock, SlidersHorizontal, Image as ImageIcon, Smartphone, Monitor, Users, ArrowLeftRight, MessageCircle, Clock, Share2, QrCode, Zap, Crown, CreditCard, X, Star, AlertTriangle, Upload, Copy, Check, Key, Play, FileText } from 'lucide-react';
import ThemeSelector, { getTheme } from './ThemeSelector';
import LogoUpload from './LogoUpload';
import SurveyBuilder from './SurveyBuilder';
import { useGeoPricing } from '../geoPricing';
import { compressToTargetSize, formatFileSize } from '../utils/imageCompression';
import { SurveySection, SurveySettings } from '../types';

type PollTier = 'free' | 'starter' | 'pro_event' | 'unlimited_event' | 'unlimited';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string; maxDays: number }> = {
    free: { label: '', colors: '', maxDays: 7 },
    starter: { label: 'STARTER', colors: 'bg-blue-500 text-white', maxDays: 30 },
    pro_event: { label: 'PRO', colors: 'bg-purple-600 text-white', maxDays: 30 },
    unlimited_event: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white', maxDays: 30 },
    unlimited: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', maxDays: 365 }
};

const POLL_TYPES = [
    { id: 'multiple', name: 'Multiple Choice', icon: CheckSquare, shortDesc: 'Pick one or more', gradient: 'from-blue-500 to-indigo-500', tier: 'free' as PollTier },
    { id: 'ranked', name: 'Ranked Choice', icon: ListOrdered, shortDesc: 'Drag to rank', gradient: 'from-indigo-500 to-purple-500', tier: 'free' as PollTier },
    { id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, shortDesc: 'A vs B comparisons', gradient: 'from-orange-500 to-red-500', tier: 'free' as PollTier },
    { id: 'meeting', name: 'Meeting Poll', icon: Calendar, shortDesc: 'Find best time', gradient: 'from-amber-500 to-orange-500', tier: 'free' as PollTier },
    { id: 'rating', name: 'Rating Scale', icon: SlidersHorizontal, shortDesc: 'Rate 1-5 stars', gradient: 'from-cyan-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'rsvp', name: 'RSVP', icon: Users, shortDesc: 'Event attendance', gradient: 'from-sky-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'survey', name: 'Survey', icon: FileText, shortDesc: 'Multi-section forms', gradient: 'from-emerald-500 to-teal-500', tier: 'free' as PollTier, isNew: true },
    { id: 'image', name: 'Visual Poll', icon: ImageIcon, shortDesc: 'Vote on images', gradient: 'from-pink-500 to-rose-500', tier: 'pro_event' as PollTier }
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
    survey: { question: "Wedding RSVP & Preferences", options: ["Multi-section survey"] },
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
    const [meetingDuration, setMeetingDuration] = useState<15 | 30 | 45 | 60 | 90 | 120>(60); // Default 1 hour
    const [ratingStyle, setRatingStyle] = useState<'stars' | 'hearts' | 'thumbs' | 'numbers' | 'emojis'>('stars');
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [showPaywall, setShowPaywall] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [startAsDraft, setStartAsDraft] = useState(false); // For paid tiers - start in draft mode
    
    // Security options (Pro Event & Unlimited)
    const [securityType, setSecurityType] = useState<'none' | 'pin' | 'code'>('none');
    const [pollPin, setPollPin] = useState('');
    const [accessCodes, setAccessCodes] = useState<string[]>([]);
    const [showCodeGenerator, setShowCodeGenerator] = useState(false);
    const [codeCount, setCodeCount] = useState(10);
    const [codePrefix, setCodePrefix] = useState('');
    
    // Custom branding (Pro Event & Unlimited)
    const [pollLogo, setPollLogo] = useState<string | null>(null);
    
    // Visual Poll image options
    const [imageOptions, setImageOptions] = useState<{ url: string; label: string }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    // Survey mode - multi-section forms
    const [surveySections, setSurveySections] = useState<SurveySection[]>([]);
    const [surveySettings, setSurveySettings] = useState<SurveySettings>({ allowBack: true, showProgress: true });
    
    // Copy link function
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };
    
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
        if (!type) return;
        
        // Check if user can access this poll type
        if (isPollTypeUnlocked(type.tier)) {
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
        // Visual Poll (pro_event tier) requires pro_event OR unlimited
        // Starter only unlocks starter-tier features (none currently, but future-proof)
        const tierRank: Record<PollTier, number> = { free: 0, starter: 1, pro_event: 2, unlimited_event: 3, unlimited: 3 };
        const requiredRank = tierRank[typeTier] || 0;
        const userRank = tierRank[purchasedTier] || 0;
        return userRank >= requiredRank;
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
        } else if (pollType === 'survey') {
            // Survey - need at least one section with one question
            if (surveySections.length === 0) {
                setError('Add at least one section to your survey');
                return;
            }
            const hasQuestions = surveySections.some(s => s.questions.length > 0);
            if (!hasQuestions) {
                setError('Add at least one question to your survey');
                return;
            }
            // Check all questions have text
            const emptyQuestions = surveySections.flatMap(s => s.questions).filter(q => !q.question.trim());
            if (emptyQuestions.length > 0) {
                setError('All questions must have text');
                return;
            }
        } else if (pollType === 'rating') {
            // Rating poll - no options needed, just the question
            // Validation already passed (title exists)
        } else {
            // Regular poll - need at least 2 text options
            const valid = options.filter(o => o.trim());
            if (valid.length < 2) { setError('Add at least 2 options'); return; }
            if (hasDuplicates) { setError('Remove duplicate options'); return; }
        }
        
        // Security validation
        if (securityType === 'pin' && pollPin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }
        if (securityType === 'code' && accessCodes.length === 0) {
            setError('Add at least one access code');
            return;
        }
        
        setIsCreating(true); setError(null);
        
        // Use the already-loaded purchasedTier from component state
        const effectiveTier = purchasedTier || currentTier;
        
        try {
            const validOptions = pollType === 'image' 
                ? imageOptions.map((img, i) => img.label || `Option ${i + 1}`)
                : pollType === 'survey'
                    ? [] // Survey doesn't use traditional options
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
                    deadline: deadline ? new Date(deadline).toISOString() : undefined,
                    security: securityType
                }, 
                buttonText: buttonText || 'Submit Vote', 
                tier: effectiveTier,
                theme: selectedTheme,
                // Rating style (for rating polls)
                ratingStyle: pollType === 'rating' ? ratingStyle : undefined,
                // Meeting duration (for calendar integration)
                meetingDuration: pollType === 'meeting' ? meetingDuration : undefined,
                // Custom branding (Pro Event & Unlimited)
                logoUrl: pollLogo || undefined,
                // For paid tiers: allow starting in draft mode
                status: (purchasedTier && startAsDraft) ? 'draft' : 'live',
                // Security: PIN (Pro Event & Unlimited)
                pin: securityType === 'pin' ? pollPin : undefined,
                // Security: Unique codes (Unlimited only)
                allowedCodes: securityType === 'code' ? accessCodes : undefined,
                // Survey mode
                isSurvey: pollType === 'survey' ? true : undefined,
                sections: pollType === 'survey' ? surveySections : undefined,
                surveySettings: pollType === 'survey' ? surveySettings : undefined,
                // For poll limit enforcement - get from localStorage
                dashboardToken: (() => {
                    try {
                        const session = localStorage.getItem('vg_user_session');
                        return session ? JSON.parse(session).dashboardToken : undefined;
                    } catch { return undefined; }
                })(),
                sessionId: (() => {
                    try {
                        const session = localStorage.getItem('vg_user_session');
                        return session ? JSON.parse(session).sessionId : undefined;
                    } catch { return undefined; }
                })()
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
                
                // ADD POLL TO USER SESSION (so it shows in Admin Dashboard)
                if (purchasedTier || effectiveTier !== 'free') {
                    try {
                        const storedSession = localStorage.getItem('vg_user_session');
                        if (storedSession) {
                            const sessionData = JSON.parse(storedSession);
                            const newPoll = {
                                id: pollId,
                                adminKey: adminKey,
                                title: title.trim(),
                                type: pollType,
                                createdAt: new Date().toISOString(),
                                responseCount: 0,
                                status: startAsDraft ? 'draft' : 'live'
                            };
                            sessionData.polls = sessionData.polls || [];
                            sessionData.polls.unshift(newPoll); // Add to beginning
                            localStorage.setItem('vg_user_session', JSON.stringify(sessionData));
                            console.log('Poll added to session:', newPoll);
                        }
                    } catch (e) {
                        console.error('Failed to add poll to session:', e);
                    }
                }
                
                // PAID USERS: Skip ad wall, go directly to admin dashboard
                // FREE USERS: Go through ad wall
                if (purchasedTier || effectiveTier !== 'free') {
                    // Direct to poll admin view
                    window.location.href = `/#id=${pollId}&admin=${adminKey}`;
                } else {
                    // Free tier - show ad wall
                    window.location.href = `/ad-wall?pollId=${pollId}&adminKey=${adminKey}`;
                }
                return;
            } else { 
                // Handle specific error types
                if (responseData.upgradeRequired) {
                    // Poll limit reached - show upgrade prompt
                    setError(`${responseData.error} Click "Upgrade" in the sidebar to get more polls.`);
                } else if (responseData.expired) {
                    setError(responseData.error || 'Your plan has expired. Please renew to create polls.');
                } else {
                    setError(responseData.error || 'Failed to create poll. Please try again.');
                }
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
            
            <HowItWorks />
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {/* Poll Type */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-2xl shadow-lg p-6 ${
                        purchasedTier === 'unlimited' ? 'border-2 border-amber-200' :
                        purchasedTier === 'pro_event' ? 'border-2 border-purple-200' :
                        purchasedTier === 'starter' ? 'border-2 border-blue-200' :
                        'border border-slate-200/50'
                    }`}>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                purchasedTier === 'unlimited' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                purchasedTier === 'pro_event' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                                purchasedTier === 'starter' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                                'bg-gradient-to-br from-indigo-500 to-purple-500'
                            }`}><BarChart2 className="text-white" size={18} /></div>
                            Choose Poll Type
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-3">
                            {POLL_TYPES.map((type, i) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                const tierConfig = TIER_CONFIG[type.tier];
                                const isLocked = !isPollTypeUnlocked(type.tier);
                                const isNew = (type as any).isNew;
                                return (
                                    <motion.div key={type.id} className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                        {isNew && <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-md z-20 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">NEW</span>}
                                        <button onClick={() => handlePollTypeSelect(type.id)}
                                            className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                isSelected ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200' : 
                                                isLocked ? 'border-slate-200 bg-slate-50' : 
                                                'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md'
                                            }`}>
                                            {/* Lock overlay for locked types */}
                                            {isLocked && (
                                                <div className="absolute inset-0 bg-slate-100/60 rounded-xl flex items-center justify-center z-10">
                                                    <div className="bg-slate-700 rounded-full p-2 shadow-lg">
                                                        <Lock size={16} className="text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${type.gradient} shadow-md ${isLocked ? 'opacity-50' : ''}`}>
                                                <Icon className="text-white" size={20} />
                                            </div>
                                            <div className={`font-semibold text-sm ${isLocked ? 'text-slate-400' : ''}`}>{type.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1">{type.shortDesc}</div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Question & Options */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`bg-white rounded-2xl shadow-lg p-6 ${
                        purchasedTier === 'unlimited' ? 'border-2 border-amber-200' :
                        purchasedTier === 'pro_event' ? 'border-2 border-purple-200' :
                        purchasedTier === 'starter' ? 'border-2 border-blue-200' :
                        'border border-slate-200/50'
                    }`}>
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                purchasedTier === 'unlimited' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                purchasedTier === 'pro_event' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                                purchasedTier === 'starter' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                                'bg-gradient-to-br from-emerald-500 to-teal-500'
                            }`}><Sparkles className="text-white" size={18} /></div>
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
                            {pollType === 'survey' ? (
                                /* Survey Builder - Multi-section forms */
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                        <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                            <FileText size={18} />
                                            <span className="font-semibold">Survey Mode - Multi-Section Forms</span>
                                            <span className="ml-auto px-2 py-0.5 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full">NEW</span>
                                        </div>
                                        <p className="text-emerald-600 text-sm">
                                            Create surveys with multiple sections and question types. Perfect for RSVPs, feedback forms, event planning, and more!
                                        </p>
                                    </div>
                                    <SurveyBuilder
                                        initialSections={surveySections.length > 0 ? surveySections : undefined}
                                        initialSettings={surveySettings}
                                        onChange={(sections, settings) => {
                                            setSurveySections(sections);
                                            setSurveySettings(settings);
                                        }}
                                        tier={currentTier}
                                    />
                                </div>
                            ) : pollType === 'rating' ? (
                                /* Rating Poll Configuration */
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                                        <div className="flex items-center gap-2 text-cyan-700 mb-2">
                                            <Star size={18} />
                                            <span className="font-semibold">Rating Poll</span>
                                        </div>
                                        <p className="text-cyan-600 text-sm mb-4">
                                            Let voters rate on a 1-5 scale. Choose your preferred rating style:
                                        </p>
                                        
                                        {/* Rating Style Selector */}
                                        <div className="grid grid-cols-5 gap-2">
                                            {[
                                                { id: 'stars', icon: '⭐', label: 'Stars' },
                                                { id: 'hearts', icon: '❤️', label: 'Hearts' },
                                                { id: 'thumbs', icon: '👍', label: 'Thumbs' },
                                                { id: 'numbers', icon: '5', label: 'Numbers' },
                                                { id: 'emojis', icon: '😊', label: 'Emojis' },
                                            ].map((style) => (
                                                <button
                                                    key={style.id}
                                                    type="button"
                                                    onClick={() => setRatingStyle(style.id as typeof ratingStyle)}
                                                    className={`p-3 rounded-xl text-center transition-all ${
                                                        ratingStyle === style.id
                                                            ? 'bg-cyan-500 text-white shadow-lg scale-105'
                                                            : 'bg-white text-slate-600 border border-cyan-200 hover:border-cyan-400'
                                                    }`}
                                                >
                                                    <span className="text-xl block mb-1">{style.icon}</span>
                                                    <span className="text-xs font-medium">{style.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* Preview */}
                                        <div className="mt-4 p-3 bg-white rounded-lg border border-cyan-100">
                                            <p className="text-xs text-slate-500 mb-2 text-center">Preview</p>
                                            <div className="flex justify-center gap-1 text-2xl">
                                                {ratingStyle === 'stars' && ['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'hearts' && ['❤️', '❤️', '❤️', '❤️', '❤️'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'thumbs' && ['👍', '👍', '👍', '👍', '👍'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'numbers' && ['1', '2', '3', '4', '5'].map((s, i) => (
                                                    <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 4 ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{s}</span>
                                                ))}
                                                {ratingStyle === 'emojis' && ['😢', '😕', '😐', '🙂', '😍'].map((s, i) => (
                                                    <span key={i} className={i === 3 ? 'opacity-100 scale-125' : i < 3 ? 'opacity-50' : 'opacity-30'}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : pollType === 'meeting' ? (
                                /* Meeting Poll Configuration */
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                                            <Calendar size={18} />
                                            <span className="font-semibold">Meeting Poll - Find the Best Time</span>
                                        </div>
                                        <p className="text-amber-600 text-sm">
                                            Add time slots for participants to vote on. Include date and time for clarity.
                                        </p>
                                    </div>
                                    
                                    {/* Time Slots */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-slate-700">Time Slots *</label>
                                        {options.map((opt, i) => (
                                            <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                                                    <Calendar size={18} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <input 
                                                        type="text" 
                                                        value={opt} 
                                                        onChange={(e) => updateOption(i, e.target.value)} 
                                                        placeholder={`e.g., Monday Jan 6, 2pm EST`}
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-amber-500"
                                                    />
                                                </div>
                                                {options.length > 2 && (
                                                    <button onClick={() => removeOption(i)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                        {options.length < 10 && (
                                            <button onClick={addOption} className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-semibold border-2 border-dashed border-amber-200 w-full justify-center">
                                                <Plus size={18} />Add Time Slot
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Meeting Duration */}
                                    <div className="p-4 bg-white rounded-xl border border-amber-200">
                                        <label className="flex items-center gap-2 mb-2">
                                            <Clock size={16} className="text-amber-600" />
                                            <span className="text-sm font-semibold text-slate-700">Meeting Duration</span>
                                        </label>
                                        <p className="text-xs text-slate-500 mb-3">
                                            📅 When participants add the winning time to their calendar (Google, Outlook, etc.), 
                                            this sets how long the event will be.
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 15, label: '15m' },
                                                { value: 30, label: '30m' },
                                                { value: 45, label: '45m' },
                                                { value: 60, label: '1h' },
                                                { value: 90, label: '1.5h' },
                                                { value: 120, label: '2h' },
                                            ].map(({ value, label }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setMeetingDuration(value as typeof meetingDuration)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        meetingDuration === value
                                                            ? 'bg-amber-500 text-white shadow-md'
                                                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-amber-50'
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
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
                                    {/* Info Banner */}
                                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                                        <div className="flex items-center gap-2 text-pink-700 mb-2">
                                            <ImageIcon size={18} />
                                            <span className="font-semibold">Visual Poll - Upload Images</span>
                                        </div>
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
                                                            // Compress image first (max 2MB)
                                                            const compressedFile = await compressToTargetSize(file, 2);
                                                            console.log(`Compressed: ${formatFileSize(file.size)} → ${formatFileSize(compressedFile.size)}`);
                                                            
                                                            // Upload directly to Cloudinary (unsigned preset)
                                                            const formData = new FormData();
                                                            formData.append('file', compressedFile);
                                                            formData.append('upload_preset', 'votegenerator');
                                                            
                                                            try {
                                                                console.log('Uploading to Cloudinary with preset: votegenerator');
                                                                const response = await fetch(
                                                                    'https://api.cloudinary.com/v1_1/dqp5iwehp/image/upload',
                                                                    {
                                                                        method: 'POST',
                                                                        body: formData
                                                                    }
                                                                );
                                                                
                                                                if (response.ok) {
                                                                    const data = await response.json();
                                                                    console.log('Upload success:', data.secure_url);
                                                                    setImageOptions([...imageOptions, { url: data.secure_url, label: '' }]);
                                                                } else {
                                                                    const err = await response.json();
                                                                    console.error('Cloudinary error:', err);
                                                                    setError(err.error?.message || 'Failed to upload image');
                                                                }
                                                            } catch (err) {
                                                                console.error('Upload error:', err);
                                                                setError('Failed to upload image. Please try again.');
                                                            } finally {
                                                                setUploadingImage(false);
                                                            }
                                                            
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
                            
                            {pollType !== 'image' && pollType !== 'survey' && pollType !== 'rating' && pollType !== 'meeting' && options.length < 20 && <button onClick={addOption} className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 w-full justify-center"><Plus size={18} />Add Option</button>}
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Settings */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                        purchasedTier === 'unlimited' ? 'border-2 border-amber-200' :
                        purchasedTier === 'pro_event' ? 'border-2 border-purple-200' :
                        purchasedTier === 'starter' ? 'border-2 border-blue-200' :
                        'border border-slate-200/50'
                    }`}>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-bold text-slate-900 flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    purchasedTier === 'unlimited' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                    purchasedTier === 'pro_event' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                                    purchasedTier === 'starter' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
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
                                            <label className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-slate-700">Close poll on</span><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Max {maxDays} days</span></label>
                                            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().slice(0, 16)} max={getMaxDeadline()} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        
                                        {pollType === 'multiple' && (
                                            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100">
                                                <span className="font-medium text-slate-700">Allow multiple selections</span>
                                                <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
                                            </label>
                                        )}
                                        <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100">
                                            <span className="font-medium text-slate-700">Require voter names</span>
                                            <input type="checkbox" checked={requireNames} onChange={(e) => setRequireNames(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
                                        </label>
                                        <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100">
                                            <span className="font-medium text-slate-700">Hide results until closed</span>
                                            <input type="checkbox" checked={hideResults} onChange={(e) => setHideResults(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
                                        </label>
                                        
                                        {/* Hint about Poll Manager */}
                                        <p className="text-xs text-slate-500 text-center py-2">
                                            💡 You can also edit settings anytime in the Poll Manager
                                        </p>
                                        
                                        {/* Draft Mode - only for Unlimited tier */}
                                        {purchasedTier === 'unlimited' ? (
                                            <label className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 cursor-pointer">
                                                <div>
                                                    <span className="font-medium text-amber-800 flex items-center gap-2">
                                                        <Play size={16} className="text-amber-600" />
                                                        Start as Draft
                                                        <span className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                            <Check size={10} className="text-white" />
                                                        </span>
                                                    </span>
                                                    <p className="text-xs text-amber-600 mt-1">
                                                        Test your poll before going live
                                                    </p>
                                                </div>
                                                <input type="checkbox" checked={startAsDraft} onChange={(e) => setStartAsDraft(e.target.checked)} className="w-5 h-5 rounded accent-amber-600" />
                                            </label>
                                        ) : purchasedTier && purchasedTier !== 'free' ? (
                                            /* Show locked draft mode for non-unlimited paid tiers */
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 border border-slate-200">
                                                <div>
                                                    <span className="font-medium text-slate-500 flex items-center gap-2">
                                                        <Play size={16} />
                                                        Start as Draft
                                                    </span>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        Upgrade to unlock draft mode
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                                                    <Lock size={14} className="text-white" />
                                                </div>
                                            </div>
                                        ) : null}
                                        
                                        {/* Security Options - Show for all, locked for lower tiers */}
                                        {purchasedTier && (purchasedTier === 'pro_event' || purchasedTier === 'unlimited' || purchasedTier === 'unlimited_event') ? (
                                            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                                        <Lock size={12} className="text-white" />
                                                    </div>
                                                    <span className="font-semibold text-slate-700">Poll Security</span>
                                                    <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ml-auto">
                                                        <Check size={10} className="text-white" />
                                                    </span>
                                                </div>
                                                
                                                {/* Security Type Selector */}
                                                <div className="grid grid-cols-3 gap-2 mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSecurityType('none')}
                                                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                                            securityType === 'none' 
                                                                ? 'bg-indigo-600 text-white shadow-md' 
                                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                                        }`}
                                                    >
                                                        <Users size={18} className="mx-auto mb-1" />
                                                        Public
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSecurityType('pin')}
                                                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                                            securityType === 'pin' 
                                                                ? 'bg-indigo-600 text-white shadow-md' 
                                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                                        }`}
                                                    >
                                                        <Lock size={18} className="mx-auto mb-1" />
                                                        PIN
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (purchasedTier === 'unlimited') {
                                                                setSecurityType('code');
                                                            }
                                                        }}
                                                        className={`p-3 rounded-lg text-sm font-medium transition-all relative ${
                                                            securityType === 'code' 
                                                                ? 'bg-indigo-600 text-white shadow-md' 
                                                                : purchasedTier !== 'unlimited'
                                                                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                                                        }`}
                                                        disabled={purchasedTier !== 'unlimited'}
                                                    >
                                                        <Key size={18} className="mx-auto mb-1" />
                                                        Codes
                                                        {purchasedTier !== 'unlimited' && (
                                                            <Lock size={10} className="absolute top-1 right-1 text-slate-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                
                                                {/* PIN Input */}
                                                {securityType === 'pin' && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} 
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-2"
                                                    >
                                                        <label className="block text-sm text-slate-600">
                                                            Set a 4-6 digit PIN
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={pollPin}
                                                            onChange={(e) => setPollPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                            placeholder="e.g. 1234"
                                                            maxLength={6}
                                                            inputMode="numeric"
                                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-center text-2xl font-mono tracking-widest focus:border-indigo-500 focus:outline-none"
                                                        />
                                                        <p className="text-xs text-slate-500">
                                                            Share this PIN verbally or on screen. All voters use the same PIN.
                                                        </p>
                                                        {pollPin.length > 0 && pollPin.length < 4 && (
                                                            <p className="text-xs text-amber-600 flex items-center gap-1">
                                                                <AlertTriangle size={12} /> PIN must be at least 4 digits
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}
                                                
                                                {/* Unique Codes Section */}
                                                {securityType === 'code' && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} 
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="space-y-3"
                                                    >
                                                        {/* Code Generator */}
                                                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-sm font-medium text-slate-700">Generate Codes</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowCodeGenerator(!showCodeGenerator)}
                                                                    className="text-xs text-indigo-600 hover:underline"
                                                                >
                                                                    {showCodeGenerator ? 'Hide' : 'Show'} Generator
                                                                </button>
                                                            </div>
                                                            
                                                            {showCodeGenerator && (
                                                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                                                    <div className="flex gap-2">
                                                                        <div className="flex-1">
                                                                            <label className="text-xs text-slate-500 block mb-1">Prefix (optional)</label>
                                                                            <input
                                                                                type="text"
                                                                                value={codePrefix}
                                                                                onChange={(e) => setCodePrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))}
                                                                                placeholder="VOTE"
                                                                                maxLength={5}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm font-mono"
                                                                            />
                                                                        </div>
                                                                        <div className="w-24">
                                                                            <label className="text-xs text-slate-500 block mb-1">Count</label>
                                                                            <input
                                                                                type="number"
                                                                                value={codeCount}
                                                                                onChange={(e) => setCodeCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                                                                                min={1}
                                                                                max={100}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newCodes: string[] = [];
                                                                            for (let i = 0; i < codeCount; i++) {
                                                                                const random = Math.random().toString(36).substring(2, 8).toUpperCase();
                                                                                newCodes.push(codePrefix ? `${codePrefix}-${random}` : random);
                                                                            }
                                                                            setAccessCodes(prev => [...prev, ...newCodes]);
                                                                        }}
                                                                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                                                    >
                                                                        <Sparkles size={14} /> Generate {codeCount} Codes
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Manual Add */}
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Add code manually..."
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                                        setAccessCodes(prev => [...prev, e.currentTarget.value.trim().toUpperCase()]);
                                                                        e.currentTarget.value = '';
                                                                    }
                                                                }}
                                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                                    if (input.value.trim()) {
                                                                        setAccessCodes(prev => [...prev, input.value.trim().toUpperCase()]);
                                                                        input.value = '';
                                                                    }
                                                                }}
                                                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                                            >
                                                                <Plus size={18} />
                                                            </button>
                                                        </div>
                                                        
                                                        {/* Codes List */}
                                                        {accessCodes.length > 0 && (
                                                            <div className="bg-white rounded-lg border border-slate-200 max-h-40 overflow-y-auto">
                                                                <div className="p-2 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                                                                    <span className="text-xs font-medium text-slate-600">
                                                                        {accessCodes.length} codes
                                                                    </span>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(accessCodes.join('\n'));
                                                                            }}
                                                                            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                                                        >
                                                                            <Copy size={10} /> Copy All
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setAccessCodes([])}
                                                                            className="text-xs text-red-600 hover:underline"
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="p-2 grid grid-cols-2 gap-1">
                                                                    {accessCodes.map((code, i) => (
                                                                        <div key={i} className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded text-xs font-mono">
                                                                            <span>{code}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setAccessCodes(prev => prev.filter((_, j) => j !== i))}
                                                                                className="text-slate-400 hover:text-red-500"
                                                                            >
                                                                                <X size={12} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        <p className="text-xs text-slate-500">
                                                            Each code can only be used once. Distribute codes individually to voters.
                                                        </p>
                                                    </motion.div>
                                                )}
                                                
                                                {securityType === 'none' && (
                                                    <p className="text-xs text-slate-500">
                                                        Anyone with the link can vote. Use browser cookie to prevent repeat votes.
                                                    </p>
                                                )}
                                            </div>
                                        ) : purchasedTier === 'starter' ? (
                                            /* Locked Poll Security for Starter */
                                            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                                                        <Lock size={12} className="text-slate-500" />
                                                    </div>
                                                    <span className="font-semibold text-slate-500">Poll Security</span>
                                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm ml-auto">
                                                        <Lock size={14} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 mb-3 opacity-50">
                                                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                                                        <Users size={18} className="mx-auto mb-1 text-slate-400" />
                                                        <span className="text-xs text-slate-400">Public</span>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                                                        <Lock size={18} className="mx-auto mb-1 text-slate-400" />
                                                        <span className="text-xs text-slate-400">PIN</span>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-center">
                                                        <Key size={18} className="mx-auto mb-1 text-slate-400" />
                                                        <span className="text-xs text-slate-400">Codes</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 text-center">
                                                    Upgrade to Pro Event to add PIN protection or access codes
                                                </p>
                                            </div>
                                        ) : null}
                                        
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Button text</label>
                                            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Submit Vote" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        
                                        {/* Custom Branding - Pro Event & Unlimited */}
                                        <div className={`p-4 rounded-xl border ${
                                            purchasedTier === 'pro_event' || purchasedTier === 'unlimited'
                                                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                                                : 'bg-slate-100 border-slate-200'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <ImageIcon size={16} className={purchasedTier === 'pro_event' || purchasedTier === 'unlimited' ? 'text-purple-600' : 'text-slate-400'} />
                                                <span className="font-semibold text-slate-700">Custom Branding</span>
                                                {purchasedTier === 'pro_event' || purchasedTier === 'unlimited' ? (
                                                    <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ml-auto">
                                                        <Check size={12} className="text-white" />
                                                    </span>
                                                ) : (
                                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm ml-auto">
                                                        <Lock size={14} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            {purchasedTier === 'pro_event' || purchasedTier === 'unlimited' ? (
                                                <LogoUpload 
                                                    currentLogo={pollLogo}
                                                    onLogoChange={setPollLogo}
                                                    tier={purchasedTier}
                                                />
                                            ) : (
                                                <div className="text-center py-4">
                                                    <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto mb-2 flex items-center justify-center">
                                                        <ImageIcon size={24} className="text-slate-400" />
                                                    </div>
                                                    <p className="text-sm text-slate-500">Add your logo to polls</p>
                                                    <p className="text-xs text-slate-400 mt-1">Upgrade to unlock</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="pt-4 border-t">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Poll Theme</label>
                                            <ThemeSelector 
                                                selectedTheme={selectedTheme} 
                                                onThemeChange={setSelectedTheme}
                                                tier={purchasedTier || undefined}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {error && <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3"><AlertCircle className="text-red-600" size={20} /><p className="text-red-700 font-medium">{error}</p></div>}

                    <motion.button type="button" onClick={handleCreate} 
                        disabled={isCreating || !title.trim() || (
                            pollType === 'image' ? imageOptions.length < 2 : 
                            pollType === 'survey' ? (surveySections.length === 0 || !surveySections.some(s => s.questions.length > 0 && s.questions.some(q => q.question.trim()))) :
                            pollType === 'rating' ? false :
                            (options.filter(o => o.trim()).length < 2 || hasDuplicates)
                        )} 
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className={`w-full py-4 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg ${
                            purchasedTier === 'unlimited' ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500' :
                            purchasedTier === 'pro_event' ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600' :
                            purchasedTier === 'starter' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600' :
                            'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
                        } ${purchasedTier === 'unlimited' ? 'text-amber-950' : 'text-white'}`}>
                        {isCreating ? <><Loader2 className="animate-spin" size={22} />Creating...</> : <><Sparkles size={20} />Create Poll<ArrowRight size={22} /></>}
                    </motion.button>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky top-24">
                        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                            purchasedTier === 'unlimited' ? 'border-2 border-amber-200' :
                            purchasedTier === 'pro_event' ? 'border-2 border-purple-200' :
                            purchasedTier === 'starter' ? 'border-2 border-blue-200' :
                            'border border-slate-200/50'
                        }`}>
                            <div className={`px-6 py-4 border-b flex items-center justify-between ${
                                purchasedTier === 'unlimited' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
                                purchasedTier === 'pro_event' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' :
                                purchasedTier === 'starter' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
                                'bg-gradient-to-r from-slate-50 to-indigo-50 border-slate-200'
                            }`}>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Eye size={18} className={
                                    purchasedTier === 'unlimited' ? 'text-amber-500' :
                                    purchasedTier === 'pro_event' ? 'text-purple-500' :
                                    purchasedTier === 'starter' ? 'text-blue-500' :
                                    'text-indigo-500'
                                } />Live Preview</h3>
                                <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-indigo-100' : ''}`}><Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-indigo-100' : ''}`}><Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                </div>
                            </div>
                            <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                                {/* Dynamic question based on poll type */}
                                <h4 className="text-lg font-bold text-slate-900 mb-4">
                                    {title || POLL_TYPE_PLACEHOLDERS[pollType]?.question || placeholderQuestion}
                                </h4>
                                {description && <p className="text-slate-600 text-sm mb-4">{description}</p>}
                                
                                {/* Dynamic options preview based on poll type */}
                                <div className="space-y-2 mb-4">
                                    {pollType === 'rsvp' ? (
                                        // RSVP-specific preview
                                        ['✅ Going', '❌ Not Going', '🤔 Maybe'].map((opt, i) => (
                                            <div key={i} className="p-3 border-2 border-slate-200 rounded-xl">
                                                <span className="text-slate-700">{opt}</span>
                                            </div>
                                        ))
                                    ) : pollType === 'rating' ? (
                                        // Rating preview - uses selected style
                                        <div className="p-4 border-2 border-slate-200 rounded-xl text-center">
                                            <div className="flex justify-center gap-1 text-2xl">
                                                {ratingStyle === 'stars' && ['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'hearts' && ['❤️', '❤️', '❤️', '❤️', '❤️'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'thumbs' && ['👍', '👍', '👍', '👍', '👍'].map((s, i) => (
                                                    <span key={i} className={i < 4 ? 'opacity-100' : 'opacity-30'}>{s}</span>
                                                ))}
                                                {ratingStyle === 'numbers' && ['1', '2', '3', '4', '5'].map((s, i) => (
                                                    <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 4 ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{s}</span>
                                                ))}
                                                {ratingStyle === 'emojis' && ['😢', '😕', '😐', '🙂', '😍'].map((s, i) => (
                                                    <span key={i} className={i === 3 ? 'opacity-100 scale-125' : i < 3 ? 'opacity-50' : 'opacity-30'}>{s}</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-500 mt-2">Click to rate</p>
                                        </div>
                                    ) : pollType === 'meeting' ? (
                                        // Meeting poll preview
                                        ['Monday 2pm', 'Tuesday 10am', 'Wednesday 3pm'].map((opt, i) => (
                                            <div key={i} className="p-3 border-2 border-slate-200 rounded-xl flex items-center gap-3">
                                                <Calendar size={16} className="text-amber-500" />
                                                <span className="text-slate-700">{options[i]?.trim() || opt}</span>
                                            </div>
                                        ))
                                    ) : pollType === 'image' ? (
                                        // Visual poll preview
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
                                    ) : pollType === 'survey' ? (
                                        // Survey preview
                                        <div className="space-y-3">
                                            {surveySections.length > 0 ? (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                            Section 1 of {surveySections.length}
                                                        </span>
                                                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 w-1/3"></div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                                        <p className="font-semibold text-emerald-800 text-sm">{surveySections[0]?.title || 'Section 1'}</p>
                                                        <p className="text-xs text-emerald-600 mt-1">
                                                            {surveySections[0]?.questions.length || 0} question{(surveySections[0]?.questions.length || 0) !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    {surveySections[0]?.questions.slice(0, 2).map((q, i) => (
                                                        <div key={i} className="p-2 border-2 border-slate-200 rounded-lg">
                                                            <span className="text-slate-700 text-xs">{q.question || `Question ${i + 1}`}</span>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                                    <FileText size={20} className="mx-auto text-slate-300 mb-2" />
                                                    <p className="text-slate-500 text-xs">Add sections using the Survey Builder</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Default text options preview
                                        options.slice(0, 5).map((opt, i) => (
                                            <div key={i} className={`p-3 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                                <span className="text-slate-700">{opt || `Option ${i + 1}`}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button className={`w-full py-3 font-bold rounded-xl transition-all ${
                                    (() => {
                                        const theme = getTheme(selectedTheme);
                                        return `${theme.buttonBg || 'bg-gradient-to-r from-indigo-600 to-purple-600'} ${theme.buttonText || 'text-white'}`;
                                    })()
                                }`}>
                                    {pollType === 'rsvp' ? 'Submit RSVP' : 
                                     pollType === 'rating' ? 'Submit Rating' :
                                     pollType === 'meeting' ? 'Submit Availability' :
                                     pollType === 'survey' ? 'Start Survey →' :
                                     buttonText || 'Submit Vote'}
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <Zap size={16} />
                                Tips for {POLL_TYPES.find(p => p.id === pollType)?.name || 'Your Poll'}
                            </h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                                {pollType === 'survey' ? (
                                    <>
                                        <li>• Start with a template or build from scratch</li>
                                        <li>• Group related questions into sections</li>
                                        <li>• Use required fields sparingly</li>
                                    </>
                                ) : pollType === 'meeting' ? (
                                    <>
                                        <li>• Suggest 3-5 time slots</li>
                                        <li>• Include timezone if participants are remote</li>
                                        <li>• Set a deadline for responses</li>
                                    </>
                                ) : pollType === 'rating' ? (
                                    <>
                                        <li>• Keep rating items focused</li>
                                        <li>• 5-star scale is most familiar</li>
                                        <li>• Ask for optional comments</li>
                                    </>
                                ) : pollType === 'ranked' ? (
                                    <>
                                        <li>• Limit to 5-7 options for easier ranking</li>
                                        <li>• Make options clearly distinct</li>
                                        <li>• Results show winner by elimination</li>
                                    </>
                                ) : pollType === 'image' ? (
                                    <>
                                        <li>• Use high-quality images</li>
                                        <li>• Keep image sizes similar</li>
                                        <li>• Add captions for context</li>
                                    </>
                                ) : pollType === 'rsvp' ? (
                                    <>
                                        <li>• Add event details in description</li>
                                        <li>• Enable "Maybe" option for flexibility</li>
                                        <li>• Set a response deadline</li>
                                    </>
                                ) : pollType === 'pairwise' ? (
                                    <>
                                        <li>• Great for narrowing down favorites</li>
                                        <li>• 4-8 items works best</li>
                                        <li>• Each voter sees random pairs</li>
                                    </>
                                ) : (
                                    <>
                                        <li>• Keep questions clear and concise</li>
                                        <li>• 4-6 options works best</li>
                                        <li>• Save your admin link!</li>
                                    </>
                                )}
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
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default VoteGeneratorCreate;
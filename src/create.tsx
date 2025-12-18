import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
    CheckSquare, 
    ListOrdered, 
    Calendar, 
    ArrowLeftRight, 
    CircleDot, 
    SlidersHorizontal,
    Coins,
    LayoutGrid,
    ThumbsUp,
    HelpCircle,
    Smile,
    Image,
    ArrowRight,
    Lock,
    Sparkles,
    Plus,
    Trash2,
    Eye,
    Monitor,
    Smartphone,
    Palette,
    Lightbulb,
    GripVertical,
    Check,
    Zap,
    Users,
    TrendingUp,
    Cloud,
    MessageCircle
} from 'lucide-react';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import './index.css';

// Tier configuration for badges
type PollTier = 'free' | 'quick' | 'event' | 'pro';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string }> = {
    free: { label: '', colors: '' },
    quick: { label: 'QUICK', colors: 'bg-blue-500 text-white' },
    event: { label: 'EVENT', colors: 'bg-purple-500 text-white' },
    pro: { label: 'PRO', colors: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' }
};

// Poll types configuration - 16 types with tiers and colors
const pollTypes = [
    // FREE TIER (3 types)
    { 
        id: 'multiple-choice', 
        name: 'Multiple Choice', 
        icon: CheckSquare, 
        description: 'Pick one or more options',
        tooltip: 'The classic poll. Voters click their favorite option(s). Great for quick decisions.',
        useCases: ['Team votes', 'Quick surveys', 'Yes/No questions'],
        tier: 'free' as PollTier,
        gradient: 'from-blue-500 to-indigo-500',
        bgLight: 'bg-blue-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700'
    },
    { 
        id: 'ranked-choice', 
        name: 'Ranked Choice', 
        icon: ListOrdered, 
        description: 'Drag to rank in order',
        tooltip: 'Voters rank all options. Finds true consensus, not just first-place votes.',
        useCases: ['Group decisions', 'Avoiding ties', 'Elections'],
        tier: 'free' as PollTier,
        gradient: 'from-indigo-500 to-purple-500',
        bgLight: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700'
    },
    { 
        id: 'this-or-that', 
        name: 'This or That', 
        icon: ArrowLeftRight, 
        description: 'Quick A vs B',
        tooltip: 'Shows two options at a time. Quick gut-reaction feedback.',
        useCases: ['Quick decisions', 'Bracket-style voting', 'Preference testing'],
        tier: 'free' as PollTier,
        gradient: 'from-orange-500 to-red-500',
        bgLight: 'bg-orange-50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700'
    },
    
    // QUICK TIER - $5 (7 types)
    { 
        id: 'meeting-poll', 
        name: 'Meeting Poll', 
        icon: Calendar, 
        description: 'Find best time',
        tooltip: 'Like Doodle but simpler! Everyone marks availability, see the best time instantly.',
        useCases: ['Meeting scheduling', 'Event planning', 'Group availability'],
        tier: 'quick' as PollTier,
        gradient: 'from-amber-500 to-orange-500',
        bgLight: 'bg-amber-50',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-700'
    },
    { 
        id: 'dot-voting', 
        name: 'Dot Voting', 
        icon: CircleDot, 
        description: 'Distribute points',
        tooltip: 'Give voters a budget of points to spend. Shows intensity of preference!',
        useCases: ['Budget allocation', 'Feature prioritization', 'Weighted voting'],
        tier: 'quick' as PollTier,
        gradient: 'from-emerald-500 to-teal-500',
        bgLight: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        textColor: 'text-emerald-700'
    },
    { 
        id: 'rating-scale', 
        name: 'Rating Scale', 
        icon: SlidersHorizontal, 
        description: 'Rate 1-5 stars',
        tooltip: 'Voters rate every option. Perfect for feedback and sentiment.',
        useCases: ['Product feedback', 'Customer satisfaction', 'Feature ratings'],
        tier: 'quick' as PollTier,
        gradient: 'from-cyan-500 to-blue-500',
        bgLight: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
        textColor: 'text-cyan-700'
    },
    { 
        id: 'rsvp', 
        name: 'RSVP', 
        icon: Users, 
        description: 'Event attendance',
        tooltip: 'Simple Yes/No/Maybe for event attendance. Automatic headcounts.',
        useCases: ['Party invites', 'Team events', 'Workshops'],
        tier: 'quick' as PollTier,
        gradient: 'from-sky-500 to-blue-500',
        bgLight: 'bg-sky-50',
        iconColor: 'text-sky-600',
        textColor: 'text-sky-700'
    },
    { 
        id: 'buy-a-feature', 
        name: 'Buy a Feature', 
        icon: Coins, 
        description: 'Spend points',
        tooltip: 'Options have prices, voters have budgets. Forces real trade-offs!',
        useCases: ['Product roadmaps', 'Feature prioritization', 'Customer research'],
        tier: 'quick' as PollTier,
        gradient: 'from-green-500 to-emerald-500',
        bgLight: 'bg-green-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-700'
    },
    { 
        id: 'priority-matrix', 
        name: 'Priority Matrix', 
        icon: LayoutGrid, 
        description: 'Effort vs Impact',
        tooltip: 'Drag items onto a 2x2 grid. Perfect for sprint planning.',
        useCases: ['Sprint planning', 'Project prioritization', 'Strategic planning'],
        tier: 'quick' as PollTier,
        gradient: 'from-fuchsia-500 to-purple-500',
        bgLight: 'bg-fuchsia-50',
        iconColor: 'text-fuchsia-600',
        textColor: 'text-fuchsia-700'
    },
    { 
        id: 'approval-voting', 
        name: 'Approval Voting', 
        icon: ThumbsUp, 
        description: 'Approve all you like',
        tooltip: 'Voters approve as many options as they want. Finds consensus!',
        useCases: ['Committee decisions', 'Finding consensus', 'Board votes'],
        tier: 'quick' as PollTier,
        gradient: 'from-violet-500 to-indigo-500',
        bgLight: 'bg-violet-50',
        iconColor: 'text-violet-600',
        textColor: 'text-violet-700'
    },
    
    // EVENT TIER - $10 (3 types)
    { 
        id: 'quiz-poll', 
        name: 'Quiz Poll', 
        icon: Zap, 
        description: 'With correct answer',
        tooltip: 'Poll with a right answer! Great for trivia and knowledge checks.',
        useCases: ['Trivia games', 'Knowledge tests', 'Training quizzes'],
        tier: 'event' as PollTier,
        gradient: 'from-yellow-500 to-amber-500',
        bgLight: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-700'
    },
    { 
        id: 'nps-score', 
        name: 'NPS Score', 
        icon: TrendingUp, 
        description: 'Net Promoter Score',
        tooltip: 'Classic 0-10 recommendation scale. Auto-calculates your NPS.',
        useCases: ['Customer feedback', 'Employee satisfaction', 'Product reviews'],
        tier: 'event' as PollTier,
        gradient: 'from-lime-500 to-green-500',
        bgLight: 'bg-lime-50',
        iconColor: 'text-lime-600',
        textColor: 'text-lime-700'
    },
    { 
        id: 'sentiment-check', 
        name: 'Sentiment Check', 
        icon: Smile, 
        description: 'Emoji reactions',
        tooltip: 'Quick emoji-based reactions. Perfect for pulse checks.',
        useCases: ['Team morale', 'Meeting check-ins', 'Idea validation'],
        tier: 'event' as PollTier,
        gradient: 'from-rose-500 to-pink-500',
        bgLight: 'bg-rose-50',
        iconColor: 'text-rose-600',
        textColor: 'text-rose-700'
    },
    
    // PRO TIER - Subscription (3 types)
    { 
        id: 'word-cloud', 
        name: 'Word Cloud', 
        icon: Cloud, 
        description: 'Open text responses',
        tooltip: 'Collect free-form text, see it as a beautiful word cloud.',
        useCases: ['Brainstorming', 'Feedback collection', 'Idea generation'],
        tier: 'pro' as PollTier,
        gradient: 'from-purple-500 to-violet-500',
        bgLight: 'bg-purple-50',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700'
    },
    { 
        id: 'qna-upvote', 
        name: 'Q&A / Upvote', 
        icon: MessageCircle, 
        description: 'Submit & upvote',
        tooltip: 'Audience submits questions, others upvote. Best questions rise up!',
        useCases: ['Q&A sessions', 'Town halls', 'AMAs'],
        tier: 'pro' as PollTier,
        gradient: 'from-teal-500 to-cyan-500',
        bgLight: 'bg-teal-50',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700'
    },
    { 
        id: 'visual-poll', 
        name: 'Visual Poll', 
        icon: Image, 
        description: 'Vote with images',
        tooltip: 'Upload images, let people vote visually. Instagram-style layout!',
        useCases: ['Logo selection', 'Design contests', 'Photo competitions'],
        tier: 'pro' as PollTier,
        gradient: 'from-pink-500 to-rose-500',
        bgLight: 'bg-pink-50',
        iconColor: 'text-pink-600',
        textColor: 'text-pink-700'
    },
];

// Theme configurations - prettier with gradients and textures
const themes = [
    { 
        id: 'classic', 
        name: 'Classic Indigo', 
        primary: '#4F46E5', 
        secondary: '#818CF8', 
        bg: '#EEF2FF',
        gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
    { 
        id: 'ocean', 
        name: 'Ocean Wave', 
        primary: '#0891B2', 
        secondary: '#22D3EE', 
        bg: '#ECFEFF',
        gradient: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)',
        pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
    },
    { 
        id: 'sunset', 
        name: 'Sunset Fire', 
        primary: '#EA580C', 
        secondary: '#FB923C', 
        bg: '#FFF7ED',
        gradient: 'linear-gradient(135deg, #DC2626 0%, #EA580C 50%, #F59E0B 100%)',
        pattern: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 50%)'
    },
    { 
        id: 'forest', 
        name: 'Forest Depths', 
        primary: '#059669', 
        secondary: '#34D399', 
        bg: '#ECFDF5',
        gradient: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)',
        pattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)'
    },
    { 
        id: 'grape', 
        name: 'Neon Grape', 
        primary: '#7C3AED', 
        secondary: '#A78BFA', 
        bg: '#F5F3FF',
        gradient: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)',
        pattern: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'
    },
    { 
        id: 'rose', 
        name: 'Rose Petal', 
        primary: '#E11D48', 
        secondary: '#FB7185', 
        bg: '#FFF1F2',
        gradient: 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #F43F5E 100%)',
        pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 50%)'
    },
    { 
        id: 'midnight', 
        name: 'Midnight Sky', 
        primary: '#1E40AF', 
        secondary: '#60A5FA', 
        bg: '#EFF6FF',
        gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 40%, #3B82F6 100%)',
        pattern: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.08) 0%, transparent 60%)'
    },
    { 
        id: 'aurora', 
        name: 'Aurora', 
        primary: '#06B6D4', 
        secondary: '#A855F7', 
        bg: '#F0FDFA',
        gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)',
        pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)'
    },
];

function CreatePage() {
    const [selectedType, setSelectedType] = useState('multiple-choice');
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [selectedTheme, setSelectedTheme] = useState('classic');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [customColor, setCustomColor] = useState('#4F46E5');
    const [useCustomColor, setUseCustomColor] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');

    const selectedPollType = pollTypes.find(p => p.id === selectedType);
    const isPaidType = selectedPollType && selectedPollType.tier !== 'free';
    const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];
    const activeColor = useCustomColor ? customColor : currentTheme.primary;

    const addOption = () => {
        if (options.length < 20) {
            setOptions([...options, '']);
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const validOptions = options.filter(o => o.trim());
    
    // Check for duplicate options
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

    // Determine if poll type is free or paid
    const getPollTier = (typeId: string): 'free' | 'quick' | 'event' | 'pro' => {
        const type = pollTypes.find(t => t.id === typeId);
        return type?.tier || 'free';
    };

    const handleCreate = async () => {
        if (!question.trim() || validOptions.length < 2 || hasDuplicates) return;
        
        const tier = getPollTier(selectedType);
        
        // Build poll data matching vg-create.ts expected format
        const pollData = {
            title: question.trim(),
            description: description.trim() || undefined,
            options: validOptions, // vg-create expects string[], not { text: string }[]
            pollType: selectedType === 'multiple-choice' ? 'multiple' : 
                      selectedType === 'ranked-choice' ? 'ranked' : 
                      selectedType === 'meeting-poll' ? 'meeting' :
                      selectedType === 'visual-poll' ? 'image' : 'ranked',
            settings: {
                hideResults: false,
                allowMultiple: false
            },
            theme: selectedTheme,
            customColor: useCustomColor ? customColor : null,
            buttonText: buttonText || 'Submit Vote'
        };
        
        if (tier === 'free') {
            // FREE POLL: Create directly via API
            try {
                const response = await fetch('/.netlify/functions/vg-create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pollData)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // vg-create returns { id, adminKey }
                    // Redirect to admin dashboard with the poll
                    window.location.href = `/#admin/${data.id}/${data.adminKey}`;
                } else {
                    const error = await response.json();
                    alert('Error creating poll: ' + (error.error || 'Please try again'));
                }
            } catch (error) {
                console.error('Create error:', error);
                alert('Error creating poll. Please try again.');
            }
        } else {
            // PAID POLL: Save draft to localStorage and redirect to checkout
            localStorage.setItem('pollDraft', JSON.stringify(pollData));
            
            // Map tier to checkout plan
            const planMap: Record<string, string> = {
                'quick': 'quick_poll',
                'event': 'event_poll',
                'pro': 'pro_yearly'
            };
            
            window.location.href = `/checkout?plan=${planMap[tier] || 'quick_poll'}`;
        }
    };

    // Live Preview Component
    const LivePreview = () => (
        <div 
            className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${
                previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'
            }`}
            style={{ borderColor: activeColor + '40' }}
        >
            {/* Browser Chrome */}
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
                    votegenerator.com/vote/abc123
                </div>
            </div>
            
            {/* Poll Preview */}
            <div className="bg-white p-6" style={{ backgroundColor: currentTheme.bg + '50' }}>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {question || 'Your Question Here'}
                </h3>
                
                {description && (
                    <p className="text-slate-500 text-sm mb-4">{description}</p>
                )}
                
                <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
                    style={{ backgroundColor: activeColor + '20', color: activeColor }}
                >
                    {selectedPollType && <selectedPollType.icon size={12} />}
                    {selectedPollType?.name}
                </div>

                {validOptions.length > 0 ? (
                    <div className="space-y-2">
                        {validOptions.map((opt, i) => (
                            <div 
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl border-2 bg-white hover:shadow-sm transition-all cursor-pointer"
                                style={{ borderColor: i === 0 ? activeColor : '#E2E8F0' }}
                            >
                                {selectedType === 'ranked-choice' ? (
                                    <>
                                        <GripVertical size={16} className="text-slate-300" />
                                        <div 
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ backgroundColor: activeColor }}
                                        >
                                            {i + 1}
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                                        style={{ borderColor: i === 0 ? activeColor : '#CBD5E1' }}
                                    >
                                        {i === 0 && (
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: activeColor }}
                                            />
                                        )}
                                    </div>
                                )}
                                <span className="text-slate-700">{opt}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        Add options to see preview
                    </div>
                )}

                <button 
                    className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg"
                    style={{ 
                        background: useCustomColor ? activeColor : currentTheme.gradient,
                        backgroundImage: useCustomColor ? undefined : `${currentTheme.pattern}, ${currentTheme.gradient}`
                    }}
                >
                    {buttonText || 'Submit Vote'}
                </button>
                
                {/* Powered by branding - shows for free tier */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-2">
                    <span className="text-xs text-slate-400">Powered by</span>
                    <a href="/" className="flex items-center gap-1 hover:opacity-80 transition">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-4 h-4" />
                        <span className="text-xs font-semibold text-slate-600">VoteGenerator</span>
                    </a>
                </div>
            </div>

            {/* Tip */}
            <div 
                className="px-4 py-3 flex items-center gap-2 text-sm"
                style={{ backgroundColor: activeColor + '10', color: activeColor }}
            >
                <Lightbulb size={16} />
                <span>Tip: Keep options short and clear for better engagement.</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />
            
            {/* Header */}
            <div className="pt-8 pb-4 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                        Create Your Poll
                    </h1>
                    <p className="text-slate-500">
                        No signup required • Free forever • Ready in seconds
                    </p>
                </motion.div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Poll Type */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                Poll Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                                {pollTypes.map((type) => {
                                    const isSelected = selectedType === type.id;
                                    const isLocked = type.tier === 'pro';
                                    
                                    return (
                                        <div key={type.id} className="relative group">
                                            <button
                                                onClick={() => setSelectedType(type.id)}
                                                className={`relative w-full h-[68px] p-2 rounded-xl border-2 text-left transition-all flex flex-col justify-center ${
                                                    isSelected
                                                        ? `border-transparent bg-gradient-to-br ${type.gradient} shadow-lg scale-[1.02]`
                                                        : isLocked
                                                            ? `border-slate-200 ${type.bgLight} opacity-80`
                                                            : `border-slate-200 ${type.bgLight} hover:shadow-md hover:scale-[1.02]`
                                                }`}
                                            >
                                                {/* Tier Badge */}
                                                {type.tier !== 'free' && (
                                                    <span className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full shadow-sm flex items-center gap-0.5 ${TIER_CONFIG[type.tier].colors}`}>
                                                        {type.tier === 'pro' && <Zap size={8} />}
                                                        {TIER_CONFIG[type.tier].label}
                                                    </span>
                                                )}
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 ${isSelected ? 'bg-white/20' : 'bg-white/80'}`}>
                                                    <type.icon size={14} className={isSelected ? 'text-white' : type.iconColor} />
                                                </div>
                                                <p className={`font-semibold text-[11px] leading-tight ${isSelected ? 'text-white' : type.textColor}`}>
                                                    {type.name}
                                                </p>
                                            </button>
                                            
                                            {/* Hover Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${type.gradient} text-white text-[10px] font-bold mb-2`}>
                                                    <type.icon size={10} />
                                                    {type.name}
                                                </div>
                                                <p className="text-slate-200 mb-2">{type.tooltip}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {type.useCases?.map((use, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">{use}</span>
                                                    ))}
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-800"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Poll Type Description */}
                            <div 
                                className="mt-4 p-3 rounded-xl text-sm"
                                style={{ backgroundColor: activeColor + '10', borderLeft: `4px solid ${activeColor}` }}
                            >
                                <span className="font-semibold" style={{ color: activeColor }}>{selectedPollType?.name}:</span>{' '}
                                <span className="text-slate-600">"{selectedPollType?.description}"</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Your Question <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Which design do you prefer?"
                                className="w-full mt-3 px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                            
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mt-4 block">
                                Details <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add extra info or instructions..."
                                rows={2}
                                className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                            
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mt-4 block">
                                Button Text <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={buttonText}
                                onChange={(e) => setButtonText(e.target.value)}
                                placeholder="Submit Vote"
                                maxLength={30}
                                className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                            <p className="text-xs text-slate-400 mt-1">Examples: "Cast Your Vote", "Submit", "Vote Now"</p>
                        </div>

                        {/* Options */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                    Options <span className="text-red-500">*</span>
                                </label>
                                <span className="text-sm text-slate-400">{options.length} / 20</span>
                            </div>
                            
                            <div className="space-y-2">
                                {options.map((option, index) => {
                                    const isDuplicate = duplicateIndices.has(index);
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-slate-400 text-sm w-6">{index + 1}.</span>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                className={`flex-1 px-4 py-2.5 border-2 rounded-xl focus:ring-2 outline-none transition-all ${
                                                    isDuplicate 
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500' 
                                                        : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
                                                }`}
                                            />
                                            {options.length > 2 && (
                                                <button
                                                    onClick={() => removeOption(index)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {hasDuplicates && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <span>⚠️</span> Duplicate options are not allowed
                                </p>
                            )}
                            
                            {options.length < 20 && (
                                <button
                                    onClick={addOption}
                                    className="mt-3 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
                                >
                                    <Plus size={16} />
                                    Add option
                                </button>
                            )}
                        </div>

                        {/* Theme & Colors */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                    <Palette size={16} />
                                    Poll Theme
                                </label>
                                <button 
                                    onClick={() => setUseCustomColor(!useCustomColor)}
                                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                >
                                    {useCustomColor ? '← Use Themes' : 'Custom Color →'}
                                </button>
                            </div>
                            
                            {useCustomColor ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">Choose your brand color:</p>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => setCustomColor(e.target.value)}
                                            className="w-16 h-16 rounded-xl cursor-pointer border-2 border-slate-200"
                                        />
                                        <div>
                                            <p className="font-mono text-sm text-slate-600">{customColor.toUpperCase()}</p>
                                            <p className="text-xs text-slate-400">Click to change</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {['#4F46E5', '#059669', '#EA580C', '#E11D48', '#7C3AED', '#0891B2'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setCustomColor(color)}
                                                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                                                selectedTheme === theme.id
                                                    ? 'border-slate-800 ring-2 ring-slate-800/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            {/* Gradient Preview */}
                                            <div 
                                                className="h-12 w-full"
                                                style={{ 
                                                    background: theme.gradient,
                                                    backgroundImage: `${theme.pattern}, ${theme.gradient}`
                                                }}
                                            />
                                            <div className="p-2 bg-white">
                                                <p className="text-xs font-medium text-slate-700 text-center truncate">{theme.name}</p>
                                            </div>
                                            {selectedTheme === theme.id && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <Check size={12} className="text-slate-800" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Create Button */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                            {isPaidType ? (
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg mb-4">
                                        <Lock size={16} />
                                        <span className="font-semibold">{selectedPollType?.name} requires {TIER_CONFIG[selectedPollType?.tier || 'free'].label || 'upgrade'}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a
                                            href="/pricing.html"
                                            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all inline-flex items-center justify-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Upgrade to Unlock
                                        </a>
                                        <button
                                            onClick={() => setSelectedType('multiple-choice')}
                                            className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                                        >
                                            Use Free Poll Type
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCreate}
                                        disabled={!question.trim() || validOptions.length < 2 || hasDuplicates}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                            question.trim() && validOptions.length >= 2 && !hasDuplicates
                                                ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                                                : 'bg-white/30 text-white/70 cursor-not-allowed'
                                        }`}
                                    >
                                        Create Poll
                                        <ArrowRight size={20} />
                                    </button>
                                    <p className="text-center text-sm text-indigo-200 mt-3">
                                        Free • No signup • Shareable link in seconds
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Live Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:sticky lg:top-24 lg:self-start"
                    >
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Eye size={18} />
                                    Live Preview
                                </h3>
                                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                                    <button
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                                    >
                                        <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                                    >
                                        <Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} />
                                    </button>
                                </div>
                            </div>
                            
                            <LivePreview />
                        </div>
                    </motion.div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <CreatePage />
        </React.StrictMode>
    );
}
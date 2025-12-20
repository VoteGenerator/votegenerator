import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, HelpCircle, ListOrdered, CheckSquare, Calendar, AlertTriangle, ChevronDown, ChevronUp, Lock, Coins, LayoutGrid, GitCompare, SlidersHorizontal, DollarSign, Image as ImageIcon, Upload, Smartphone, Monitor, GripVertical, Zap, Users, ThumbsUp, TrendingUp, Smile, Cloud, MessageCircle } from 'lucide-react';
import { createPoll } from '../services/voteGeneratorService';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';
import { compressToTargetSize, formatFileSize } from '../utils/imageCompression';
import ThemeSelector, { POLL_THEMES } from './ThemeSelector';

// Tier type and configuration
type PollTier = 'free' | 'quick' | 'event' | 'pro';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string }> = {
    free: { label: 'FREE', colors: 'bg-emerald-500 text-white' },
    quick: { label: 'PAID', colors: 'bg-blue-500 text-white' },
    event: { label: 'PAID', colors: 'bg-blue-500 text-white' },
    pro: { label: 'PRO', colors: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' }
};

// Poll types sorted by popularity with gradients and layman-friendly descriptions
const POLL_TYPES = [
    // ===== FREE TIER (3 types) =====
    {
        id: 'multiple',
        name: 'Multiple Choice',
        icon: CheckSquare,
        description: 'Classic poll - pick one or more options',
        tooltip: 'The most common poll type. Voters simply click their favorite option(s). Great for quick decisions where you need a clear winner.',
        useCases: ['Team votes', 'Event planning', 'Quick surveys', 'Preference checks'],
        example: '"What should we order for the office party?"',
        gradient: 'from-blue-500 to-indigo-500',
        selectedBorder: 'border-blue-500',
        selectedBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-700',
        tier: 'free' as PollTier
    },
    {
        id: 'ranked',
        name: 'Ranked Choice',
        icon: ListOrdered,
        description: 'Drag to rank options in order',
        tooltip: 'Voters rank all options from favorite to least favorite. Prevents ties and shows true preferences. Used in elections worldwide!',
        useCases: ['Group decisions', 'Avoiding ties', 'Fair voting', 'Priority lists'],
        example: '"Where should we go for the team retreat?"',
        gradient: 'from-indigo-500 to-purple-500',
        selectedBorder: 'border-indigo-500',
        selectedBg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
        iconColor: 'text-indigo-600',
        textColor: 'text-indigo-700',
        tier: 'free' as PollTier
    },
    {
        id: 'pairwise',
        name: 'This or That',
        icon: GitCompare,
        description: 'Quick A vs B comparisons',
        tooltip: 'Shows two options at a time - voters pick their favorite. Great when you have many options and want quick, gut-reaction feedback.',
        useCases: ['Large option lists', 'Quick decisions', 'Bracket-style voting', 'Preference testing'],
        example: '"Which slogan resonates more?"',
        gradient: 'from-orange-500 to-red-500',
        selectedBorder: 'border-orange-500',
        selectedBg: 'bg-gradient-to-br from-orange-50 to-red-50',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700',
        tier: 'free' as PollTier
    },
    
    // ===== QUICK TIER - $5 (7 types) =====
    {
        id: 'meeting',
        name: 'Meeting Poll',
        icon: Calendar,
        description: 'Find the best time for everyone',
        tooltip: 'Like Doodle but simpler! Add date/time options and everyone marks when they\'re available. No more endless email chains to schedule meetings.',
        useCases: ['Meeting scheduling', 'Event planning', 'Group availability', 'Party planning'],
        example: '"When can everyone meet next week?"',
        gradient: 'from-amber-500 to-orange-500',
        selectedBorder: 'border-amber-500',
        selectedBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-800',
        tier: 'quick' as PollTier
    },
    {
        id: 'dot',
        name: 'Dot Voting',
        icon: Coins,
        description: 'Distribute points across options',
        tooltip: 'Each voter gets a budget of "dots" (points) to spend however they want. Can put all dots on one option or spread them out. Shows intensity of preference!',
        useCases: ['Budget allocation', 'Feature prioritization', 'Resource planning', 'Weighted voting'],
        example: '"How should we allocate the Q4 budget?"',
        gradient: 'from-emerald-500 to-teal-500',
        selectedBorder: 'border-emerald-500',
        selectedBg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        iconColor: 'text-emerald-600',
        textColor: 'text-emerald-700',
        tier: 'quick' as PollTier
    },
    {
        id: 'rating',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        description: 'Rate each option on a scale',
        tooltip: 'Voters rate every option from 1-5 stars or 0-100. Perfect for feedback and sentiment - see exactly how people feel about each choice.',
        useCases: ['Product feedback', 'Employee surveys', 'Customer satisfaction', 'Feature ratings'],
        example: '"Rate these new feature ideas"',
        gradient: 'from-cyan-500 to-blue-500',
        selectedBorder: 'border-cyan-500',
        selectedBg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
        iconColor: 'text-cyan-600',
        textColor: 'text-cyan-700',
        tier: 'quick' as PollTier
    },
    {
        id: 'rsvp',
        name: 'RSVP',
        icon: Users,
        description: 'Collect event attendance',
        tooltip: 'Simple Yes/No/Maybe responses for event attendance. See who\'s coming at a glance with automatic headcounts.',
        useCases: ['Party invites', 'Team events', 'Workshops', 'Social gatherings'],
        example: '"Can you make it to the holiday party?"',
        gradient: 'from-sky-500 to-blue-500',
        selectedBorder: 'border-sky-500',
        selectedBg: 'bg-gradient-to-br from-sky-50 to-blue-50',
        iconColor: 'text-sky-600',
        textColor: 'text-sky-700',
        tier: 'quick' as PollTier
    },
    {
        id: 'budget',
        name: 'Buy a Feature',
        icon: DollarSign,
        description: 'Spend virtual money on options',
        tooltip: 'Each option has a "price" and voters get a budget to spend. Forces trade-offs! Used by product teams to let customers decide what features to build.',
        useCases: ['Product roadmaps', 'Feature prioritization', 'Customer research', 'Trade-off decisions'],
        example: '"Which features should we build? (Budget: $100)"',
        gradient: 'from-green-500 to-emerald-500',
        selectedBorder: 'border-green-500',
        selectedBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        iconColor: 'text-green-600',
        textColor: 'text-green-700',
        tier: 'quick' as PollTier
    },
    {
        id: 'matrix',
        name: 'Priority Matrix',
        icon: LayoutGrid,
        description: 'Plot options on Impact vs Effort',
        tooltip: 'Drag items onto a 2x2 grid (like Impact vs Effort). Perfect for teams doing sprint planning or deciding what to tackle first. Visual and collaborative!',
        useCases: ['Sprint planning', 'Project prioritization', 'Strategic planning', 'Agile teams'],
        example: '"Where do these tasks fall on our priority matrix?"',
        gradient: 'from-fuchsia-500 to-purple-500',
        selectedBorder: 'border-fuchsia-500',
        selectedBg: 'bg-gradient-to-br from-fuchsia-50 to-purple-50',
        iconColor: 'text-fuchsia-600',
        textColor: 'text-fuchsia-800',
        tier: 'quick' as PollTier
    },
    {
        id: 'approval',
        name: 'Approval Voting',
        icon: ThumbsUp,
        description: 'Thumbs up/down for each option',
        tooltip: 'Voters can approve as many options as they want. Simple yes/no for each choice. Great for finding consensus - the option with most approvals wins!',
        useCases: ['Committee decisions', 'Finding consensus', 'Board votes', 'Group approval'],
        example: '"Which candidates do you approve of?"',
        gradient: 'from-violet-500 to-indigo-500',
        selectedBorder: 'border-violet-500',
        selectedBg: 'bg-gradient-to-br from-violet-50 to-indigo-50',
        iconColor: 'text-violet-600',
        textColor: 'text-violet-700',
        tier: 'quick' as PollTier
    },
    
    // ===== EVENT TIER - $10 (3 types) =====
    {
        id: 'quiz',
        name: 'Quiz Poll',
        icon: Zap,
        description: 'Poll with a correct answer',
        tooltip: 'Like a poll but with a right answer! Great for trivia, knowledge checks, or guessing games. Reveal the correct answer after voting closes.',
        useCases: ['Trivia games', 'Knowledge tests', 'Training quizzes', 'Guessing games'],
        example: '"What year was the company founded?"',
        gradient: 'from-yellow-500 to-amber-500',
        selectedBorder: 'border-yellow-500',
        selectedBg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-700',
        tier: 'event' as PollTier
    },
    {
        id: 'nps',
        name: 'NPS Score',
        icon: TrendingUp,
        description: 'Net Promoter Score survey',
        tooltip: 'The classic "How likely are you to recommend?" 0-10 scale. Automatically calculates Promoters, Passives, and Detractors with your NPS score.',
        useCases: ['Customer feedback', 'Employee satisfaction', 'Product reviews', 'Service ratings'],
        example: '"How likely are you to recommend us to a friend?"',
        gradient: 'from-lime-500 to-green-500',
        selectedBorder: 'border-lime-500',
        selectedBg: 'bg-gradient-to-br from-lime-50 to-green-50',
        iconColor: 'text-lime-600',
        textColor: 'text-lime-700',
        tier: 'event' as PollTier
    },
    {
        id: 'sentiment',
        name: 'Sentiment Check',
        icon: Smile,
        description: 'Quick mood/opinion gauge',
        tooltip: 'Simple emoji-based reactions (😀 😐 😞). Perfect for quick pulse checks on how the team is feeling or gathering instant feedback on ideas.',
        useCases: ['Team morale', 'Quick feedback', 'Meeting check-ins', 'Idea validation'],
        example: '"How do you feel about the new policy?"',
        gradient: 'from-rose-500 to-pink-500',
        selectedBorder: 'border-rose-500',
        selectedBg: 'bg-gradient-to-br from-rose-50 to-pink-50',
        iconColor: 'text-rose-600',
        textColor: 'text-rose-700',
        tier: 'event' as PollTier
    },
    
    // ===== PRO TIER - Subscription (3 types) =====
    {
        id: 'wordcloud',
        name: 'Word Cloud',
        icon: Cloud,
        description: 'Open-ended text responses',
        tooltip: 'Collect free-form text answers and see them visualized as a beautiful word cloud. Most common words appear larger. Great for brainstorming!',
        useCases: ['Brainstorming', 'Feedback collection', 'Idea generation', 'Open questions'],
        example: '"What words describe our company culture?"',
        gradient: 'from-purple-500 to-violet-500',
        selectedBorder: 'border-purple-500',
        selectedBg: 'bg-gradient-to-br from-purple-50 to-violet-50',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-700',
        tier: 'pro' as PollTier
    },
    {
        id: 'qna',
        name: 'Q&A / Upvote',
        icon: MessageCircle,
        description: 'Submit and upvote questions',
        tooltip: 'Audience submits questions, others upvote the best ones. Perfect for Q&A sessions, AMAs, or town halls. Best questions rise to the top!',
        useCases: ['Q&A sessions', 'Town halls', 'AMAs', 'Conference Q&A'],
        example: '"What questions do you have for leadership?"',
        gradient: 'from-teal-500 to-cyan-500',
        selectedBorder: 'border-teal-500',
        selectedBg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
        iconColor: 'text-teal-600',
        textColor: 'text-teal-700',
        tier: 'pro' as PollTier
    },
    {
        id: 'image',
        name: 'Visual Poll',
        icon: ImageIcon,
        description: 'Vote on images in a beautiful grid',
        tooltip: 'Upload images and let people vote visually. Perfect when you\'re choosing between designs, photos, or anything visual. Instagram-style layout!',
        useCases: ['Logo selection', 'Design contests', 'Photo competitions', 'Product choices'],
        example: '"Which logo design should we use?"',
        gradient: 'from-pink-500 to-rose-500',
        selectedBorder: 'border-pink-500',
        selectedBg: 'bg-gradient-to-br from-pink-50 to-rose-50',
        iconColor: 'text-pink-600',
        textColor: 'text-pink-700',
        tier: 'pro' as PollTier
    }
];

const PLACEHOLDER_QUESTIONS = [
    "Where should we eat lunch?",
    "What movie should we watch?",
    "Which design do you prefer?",
    "What features should we build next?",
    "Which logo is best?"
];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGES = 20;

const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [optionCosts, setOptionCosts] = useState<number[]>([10, 10, 10]);
    const [optionImages, setOptionImages] = useState<string[]>(['', '', '']);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState<number | null>(null);
    
    const [pollType, setPollType] = useState<string>('ranked');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => 
        PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]
    );
    
    // Preview state
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    
    // Meeting specific
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Settings
    const [hideResults, setHideResults] = useState(false);
    const [allowMultiple] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [allowComments, setAllowComments] = useState(false);
    const [publicComments] = useState(true);
    const [blockVpn] = useState(false);
    const [security, setSecurity] = useState<'browser' | 'code' | 'none'>('browser');
    const [voterCount, setVoterCount] = useState<number>(10);
    const [deadline] = useState<string>('');
    const [maxVotes] = useState<number | ''>('');
    const [dotBudget] = useState<number>(10);
    const [budgetLimit] = useState<number>(100);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');
    
    // Theme selection
    const [selectedTheme, setSelectedTheme] = useState<string>('default');
    const currentTheme = POLL_THEMES.find(t => t.id === selectedTheme) || POLL_THEMES[0];

    const lastInputRef = useRef<HTMLInputElement>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Premium check (you'd replace this with actual auth check)
    const hasPremium = true; // Set to false to test locked state

    const getDuplicateIndices = () => {
        if (pollType === 'image') return new Set<number>();
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
        
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setError(`Image too large. Max size is ${MAX_IMAGE_SIZE_MB}MB.`);
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, GIF, WebP).');
            return;
        }

        if (!CLOUDINARY_CLOUD_NAME) {
            setError('Image upload not configured. Please check settings.');
            return;
        }

        setUploadingIndex(index);
        setError(null);

        try {
            // Compress image before uploading (FREE - uses browser Canvas API)
            console.log('Original size:', formatFileSize(file.size));
            const compressedFile = await compressToTargetSize(file, 2); // Target 2MB max
            console.log('Compressed size:', formatFileSize(compressedFile.size));

            const formData = new FormData();
            formData.append('file', compressedFile);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'votegenerator');

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
                
                // Auto-add new slot if needed
                if (index === options.length - 1 && options.length < MAX_IMAGES) {
                    setOptions([...options, '']);
                    setOptionCosts([...optionCosts, 10]);
                    setOptionImages([...newImages, '']);
                }
            } else {
                throw new Error('Upload failed - No URL returned');
            }
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? `Upload failed: ${e.message}` : 'Failed to upload image.');
        } finally {
            setUploadingIndex(null);
            setDragOver(null);
        }
    };

    const handleDrop = (index: number, e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(index, file);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextInput = document.querySelector<HTMLInputElement>(`input[data-option-index="${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
            } else if (options.length < 20 && pollType !== 'meeting') {
                setOptions([...options, '']);
                setOptionCosts([...optionCosts, 10]);
                setOptionImages([...optionImages, '']);
                setTimeout(() => lastInputRef.current?.focus(), 50);
            }
        }
        if (e.key === 'Backspace' && options[index] === '' && options.length > 2) {
            e.preventDefault();
            removeOption(index);
            const prevInput = document.querySelector<HTMLInputElement>(`input[data-option-index="${index - 1}"]`);
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
        const validOptions: { text: string; cost?: number; imageUrl?: string }[] = [];
        options.forEach((text, i) => {
            if (pollType === 'image') {
                if (optionImages[i]) {
                    validOptions.push({ text: text.trim() || `Image ${i + 1}`, imageUrl: optionImages[i] });
                }
            } else {
                if (text.trim() !== '') {
                    const opt: { text: string; cost?: number } = { text: text.trim() };
                    if (pollType === 'budget') opt.cost = optionCosts[i];
                    validOptions.push(opt);
                }
            }
        });
        
        if (!title.trim()) { setError('Please add a title or question.'); return; }
        if (validOptions.length < 2) { setError('Please add at least 2 options.'); return; }
        if (hasDuplicates) { setError('Please remove duplicate options.'); return; }

        // Get selected poll type tier
        const selectedType = POLL_TYPES.find(t => t.id === pollType);
        const tier = selectedType?.tier || 'free';

        // Build poll data
        const pollData = {
            title: title.trim(), 
            description: description.trim() || undefined, 
            options: validOptions.map(o => o.text), // Convert to string array for vg-create
            pollType: pollType,
            settings: { 
                hideResults, 
                allowMultiple: pollType === 'meeting' ? true : allowMultiple, 
                requireNames, allowComments, publicComments, blockVpn, security,
                dotBudget: pollType === 'dot' ? dotBudget : undefined,
                budgetLimit: pollType === 'budget' ? budgetLimit : undefined,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                maxVotes: maxVotes === '' ? undefined : Number(maxVotes),
                timezone: pollType === 'meeting' ? timezone : undefined
            },
            buttonText: buttonText || 'Submit Vote'
        };

        if (tier === 'free') {
            // FREE POLL: Create directly via API
            setIsCreating(true);
            try {
                const response = await fetch('/.netlify/functions/vg-create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...pollData,
                        tier: 'free'
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    window.location.href = `/#id=${result.id}&admin=${result.adminKey}`;
                } else {
                    const error = await response.json();
                    setError(error.error || 'Failed to create poll');
                    setIsCreating(false);
                }
            } catch (e) {
                console.error('Failed to create poll:', e);
                setError(e instanceof Error ? e.message : 'Something went wrong.');
                setIsCreating(false);
            }
        } else {
            // PAID POLL: Save draft to localStorage and redirect to checkout
            localStorage.setItem('pollDraft', JSON.stringify({
                ...pollData,
                tier: tier
            }));
            
            // Map tier to checkout plan
            const planMap: Record<string, string> = {
                'quick': 'quick_poll',
                'event': 'event_poll',
                'pro': 'pro_yearly'
            };
            
            window.location.href = `/checkout.html?plan=${planMap[tier] || 'quick_poll'}`;
        }
    };

    const validOptionCount = pollType === 'image' ? optionImages.filter(i => !!i).length : options.filter(o => o.trim() !== '').length;
    const selectedPollType = POLL_TYPES.find(t => t.id === pollType);

    // Get valid options for preview
    const previewOptions = pollType === 'image' 
        ? optionImages.map((img, i) => ({ text: options[i] || `Image ${i + 1}`, imageUrl: img })).filter(o => o.imageUrl)
        : options.filter(o => o.trim()).map(text => ({ text, imageUrl: undefined }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {/* Header with Logo */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 pt-8">
                    <motion.img 
                        src="/logo.svg" 
                        alt="VoteGenerator" 
                        initial={{ scale: 0, rotate: -180 }} 
                        animate={{ scale: 1, rotate: 3 }} 
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-16 h-16 mx-auto mb-4"
                    />
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 font-serif mb-2 tracking-tight">VoteGenerator</h1>
                    <p className="text-slate-500 max-w-md mx-auto">Create beautiful polls in seconds</p>
                </motion.div>

                {/* Main Layout: Form + Preview */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT: Form */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 lg:max-w-xl">
                        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                            <div className="space-y-6">
                                {/* Poll Type Selection */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Poll Type <span className="text-red-500">*</span></label>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {POLL_TYPES.map((type) => {
                                            const Icon = type.icon;
                                            const isSelected = pollType === type.id;
                                            const isLocked = type.tier === 'pro' && !hasPremium;
                                            
                                            return (
                                                <div key={type.id} className="relative group">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            if (isLocked) {
                                                                alert('This is a Pro feature! Upgrade to unlock.');
                                                                return;
                                                            }
                                                            setPollType(type.id);
                                                            if (type.id === 'meeting') setOptions([]); 
                                                            else if (options.length === 0) { 
                                                                setOptions(['', '', '']); 
                                                                setOptionCosts([10, 10, 10]); 
                                                                setOptionImages(['', '', '']); 
                                                            }
                                                        }} 
                                                        className={`relative w-full h-[72px] p-2 rounded-xl border-2 text-left transition-all flex flex-col justify-center ${
                                                            isSelected 
                                                                ? `${type.selectedBorder} bg-gradient-to-br ${type.gradient} shadow-lg scale-[1.02]` 
                                                                : isLocked 
                                                                    ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed' 
                                                                    : `border-slate-200 ${type.selectedBg} hover:${type.selectedBorder} hover:shadow-md hover:scale-[1.02]`
                                                        }`}
                                                    >
                                                        {/* Tier Badge - Always show */}
                                                        <div className={`absolute -top-1.5 -right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                                                            isLocked ? 'bg-slate-400 text-white' : TIER_CONFIG[type.tier].colors
                                                        }`}>
                                                            {type.tier === 'pro' && <Zap size={10} />}
                                                            <span>{TIER_CONFIG[type.tier].label}</span>
                                                        </div>
                                                        
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${isSelected ? 'bg-white/20' : 'bg-white/80'}`}>
                                                            <Icon size={14} className={isSelected ? 'text-white' : type.iconColor} />
                                                        </div>
                                                        <span className={`block font-bold text-xs leading-tight ${isSelected ? 'text-white' : type.textColor}`}>{type.name}</span>
                                                    </button>
                                                    
                                                    {/* Auto-show tooltip on hover */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${type.gradient} text-white text-[10px] font-bold mb-2`}>
                                                            <Icon size={12} />
                                                            {type.name}
                                                        </div>
                                                        <p className="text-slate-200 mb-2">{type.tooltip}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {type.useCases?.map((use, i) => (
                                                                <span key={i} className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">{use}</span>
                                                            ))}
                                                        </div>
                                                        <p className="text-slate-400 italic mt-2 text-[10px]">{type.example}</p>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-800"></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Selected poll type info (compact) */}
                                    {selectedPollType && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            className={`mt-3 p-3 rounded-xl ${selectedPollType.selectedBg} border ${selectedPollType.selectedBorder}`}
                                        >
                                            <p className={`text-sm font-medium ${selectedPollType.textColor}`}>{selectedPollType.description}</p>
                                            <p className={`text-xs mt-1 opacity-70 ${selectedPollType.textColor}`}>{selectedPollType.example}</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{pollType === 'meeting' ? 'Event Name' : 'Your Question'} <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full p-3 text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300" placeholder={pollType === 'meeting' ? "e.g., Q3 Strategy Meeting" : placeholderQuestion} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Details <span className="font-normal text-slate-400">(optional)</span></label>
                                    <textarea className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all h-16 resize-none placeholder:text-slate-300 text-sm" placeholder="Add extra info or instructions..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
                                </div>

                                {/* Button Text */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Button Text <span className="font-normal text-slate-400">(optional)</span></label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm" 
                                        placeholder="Submit Vote" 
                                        value={buttonText} 
                                        onChange={(e) => setButtonText(e.target.value)} 
                                        maxLength={30} 
                                    />
                                    <p className="text-xs text-slate-400 mt-1">e.g., "Cast Your Vote", "Submit", "Vote Now"</p>
                                </div>

                                {/* Options */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                            {pollType === 'image' ? 'Images' : pollType === 'meeting' ? 'Time Slots' : 'Options'} <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                                            {validOptionCount} / {pollType === 'image' ? MAX_IMAGES : 20}
                                        </span>
                                    </div>
                                    
                                    {/* Meeting Date/Time Picker */}
                                    {pollType === 'meeting' && (
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="p-2 border border-amber-200 rounded-lg text-sm flex-1 outline-none focus:border-amber-500 text-slate-700 font-bold" />
                                                <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="p-2 border border-amber-200 rounded-lg text-sm w-28 outline-none focus:border-amber-500 text-slate-700 font-bold" />
                                                <button onClick={addMeetingSlot} disabled={!meetingDate || !meetingTime} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"><Plus size={16} /></button>
                                            </div>
                                        </div>
                                    )}

                                    {/* IMAGE POLL UPLOADER - Instagram Style */}
                                    {pollType === 'image' ? (
                                        <div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {optionImages.slice(0, options.length).map((img, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="relative group"
                                                        onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                                                        onDragLeave={() => setDragOver(null)}
                                                        onDrop={(e) => handleDrop(i, e)}
                                                    >
                                                        <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all relative ${
                                                            dragOver === i 
                                                                ? 'border-pink-500 bg-pink-50 scale-105' 
                                                                : img 
                                                                    ? 'border-pink-200 bg-slate-50' 
                                                                    : 'border-slate-300 hover:border-pink-400 hover:bg-pink-50'
                                                        }`}>
                                                            {img ? (
                                                                <>
                                                                    <img src={img} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                                                                    {/* Hover overlay */}
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <button 
                                                                            onClick={() => {
                                                                                const newImgs = [...optionImages]; 
                                                                                newImgs[i] = ''; 
                                                                                setOptionImages(newImgs);
                                                                            }} 
                                                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2">
                                                                    {uploadingIndex === i ? (
                                                                        <Loader2 className="animate-spin text-pink-500" size={24} />
                                                                    ) : (
                                                                        <>
                                                                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                                                                                <Upload size={20} className="text-pink-500" />
                                                                            </div>
                                                                            <span className="text-xs text-slate-500 text-center font-medium">Drop or click</span>
                                                                        </>
                                                                    )}
                                                                    <input 
                                                                        type="file" 
                                                                        accept="image/*" 
                                                                        className="hidden" 
                                                                        ref={el => fileInputRefs.current[i] = el}
                                                                        onChange={(e) => e.target.files && handleImageUpload(i, e.target.files[0])} 
                                                                        disabled={uploadingIndex !== null} 
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>
                                                        {/* Caption input */}
                                                        <input 
                                                            type="text" 
                                                            value={options[i] || ''} 
                                                            onChange={(e) => handleOptionChange(i, e.target.value)}
                                                            placeholder="Caption"
                                                            className="w-full mt-1.5 text-xs text-center border border-slate-200 rounded-lg p-1.5 focus:border-pink-400 outline-none bg-white" 
                                                        />
                                                    </div>
                                                ))}
                                                {/* Add more button */}
                                                {options.length < MAX_IMAGES && (
                                                    <button onClick={addOption} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-pink-400 hover:bg-pink-50 flex flex-col items-center justify-center text-slate-400 hover:text-pink-500 transition-all">
                                                        <Plus size={24} />
                                                        <span className="text-xs mt-1 font-medium">Add</span>
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                                <ImageIcon size={12} /> Max {MAX_IMAGE_SIZE_MB}MB per image • {MAX_IMAGES} images max
                                            </p>
                                        </div>
                                    ) : (
                                        /* STANDARD TEXT INPUTS */
                                        <div className="space-y-2">
                                            <AnimatePresence mode="popLayout">
                                                {options.map((opt, i) => {
                                                    const isDuplicate = duplicateIndices.has(i);
                                                    if(pollType === 'meeting' && opt.trim() === '') return null;
                                                    return (
                                                        <motion.div key={i} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-2 group">
                                                            <span className="text-slate-300 font-bold w-5 text-right text-xs">{i + 1}.</span>
                                                            <div className="relative flex-1 flex gap-2">
                                                                <input 
                                                                    ref={i === options.length - 1 ? lastInputRef : undefined}
                                                                    type="text"
                                                                    data-option-index={i}
                                                                    className={`w-full p-2.5 border-2 rounded-xl outline-none transition-all font-medium text-sm placeholder:text-slate-300 ${isDuplicate ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 focus:border-indigo-500'}`}
                                                                    placeholder={pollType === 'meeting' ? `e.g. Mon, Oct 23 • 10:00 AM` : `Option ${i + 1}`}
                                                                    value={opt}
                                                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                                                    maxLength={200}
                                                                />
                                                                {pollType === 'budget' && (
                                                                    <div className="relative w-20 shrink-0">
                                                                        <span className="absolute left-2.5 top-2.5 text-slate-400 text-sm font-bold">$</span>
                                                                        <input type="number" min="0" placeholder="Cost" value={optionCosts[i] || ''} onChange={(e) => handleCostChange(i, e.target.value)} className="w-full p-2.5 pl-6 border-2 border-slate-200 rounded-xl outline-none focus:border-green-500 font-bold text-slate-700 text-right text-sm" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {(options.length > 2 || pollType === 'meeting') && (
                                                                <button onClick={() => removeOption(i)} className={`p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${pollType === 'meeting' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} tabIndex={-1}><Trash2 size={16} /></button>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                    
                                    {hasDuplicates && (
                                        <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><AlertTriangle size={12} /> Duplicate options detected.</p>
                                    )}

                                    {options.length < 20 && pollType !== 'meeting' && pollType !== 'image' && (
                                        <button onClick={addOption} className="mt-2 flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors p-1.5 hover:bg-indigo-50 rounded-lg -ml-1"><Plus size={14} /> Add option</button>
                                    )}
                                </div>

                                {/* Theme Selector */}
                                <div className="pt-4 border-t border-slate-100">
                                    <ThemeSelector
                                        selectedTheme={selectedTheme}
                                        onThemeChange={setSelectedTheme}
                                        isPro={hasPremium}
                                    />
                                </div>

                                {/* Settings (Collapsed) */}
                                <div className="pt-4 border-t border-slate-100">
                                    <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full text-left">
                                        <span className="font-bold text-slate-800">Settings</span>
                                        {showAdvanced ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showAdvanced && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                <div className="pt-4 space-y-3">
                                                    {/* Quick toggles */}
                                                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 group">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700">Require names</span>
                                                            <div className="relative">
                                                                <HelpCircle size={14} className="text-slate-300 group-hover:text-slate-500 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                    Voters must enter their name before voting. Names are shown to the organizer.
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <input type="checkbox" checked={requireNames} onChange={e => setRequireNames(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                                                    </label>
                                                    
                                                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 group">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700">Allow comments</span>
                                                            <div className="relative">
                                                                <HelpCircle size={14} className="text-slate-300 group-hover:text-slate-500 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                    Let voters leave optional comments with their vote. Great for feedback!
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <input type="checkbox" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                                                    </label>
                                                    
                                                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 group">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700">Hide results until closed</span>
                                                            <div className="relative">
                                                                <HelpCircle size={14} className="text-slate-300 group-hover:text-slate-500 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                                    Results stay hidden from voters until you close the poll. Prevents bias!
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                                                    </label>

                                                    {/* Security */}
                                                    <div className="p-3 bg-slate-50 rounded-xl">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-bold text-slate-600 uppercase">Vote Security</span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-1.5">
                                                            {(['browser', 'code', 'none'] as const).map(sec => (
                                                                <button key={sec} onClick={() => setSecurity(sec)} className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${security === sec ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'}`}>
                                                                    {sec === 'browser' ? 'Browser' : sec === 'code' ? 'Codes' : 'None'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {security === 'code' && (
                                                            <div className="mt-2">
                                                                <input type="number" min={1} max={1000} value={voterCount} onChange={(e) => setVoterCount(parseInt(e.target.value) || 1)} className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="# of voters" />
                                                                <p className="text-xs text-slate-500 mt-1">We'll generate {voterCount} unique voting codes</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                            <AlertCircle size={18} />
                                            <span className="font-medium">{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Create Button */}
                                <button onClick={handleCreate} disabled={isCreating || validOptionCount < 2 || !title.trim() || hasDuplicates} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg">
                                    {isCreating ? <><Loader2 className="animate-spin" size={20} /> Creating...</> : <><Sparkles size={18} /> Create Poll <ArrowRight size={18} /></>}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Live Preview */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.3 }}
                        className="flex-1 lg:max-w-md"
                    >
                        {/* Sticky container */}
                        <div className="lg:sticky lg:top-36">
                            {/* Preview Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-600">Live Preview</span>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>
                                        <Monitor size={14} />
                                    </button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>
                                        <Smartphone size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Preview Card */}
                            <div 
                                className={`rounded-2xl shadow-xl border overflow-hidden transition-all ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}
                                style={{
                                    backgroundColor: currentTheme.css['--poll-bg'],
                                    borderColor: currentTheme.css['--poll-border'],
                                }}
                            >
                                {/* Browser Chrome */}
                                <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono truncate">
                                        votegenerator.com/vote/abc123
                                    </div>
                                </div>
                                
                                {/* Preview Content */}
                                <div className="p-4 max-h-[500px] overflow-y-auto">
                                    {/* Poll Header */}
                                    <div className="mb-4">
                                        <h2 
                                            className="text-lg font-black font-serif"
                                            style={{ color: currentTheme.css['--poll-text'] }}
                                        >
                                            {title || 'Your Question Here'}
                                        </h2>
                                        {description && (
                                            <p className="text-sm mt-1" style={{ color: currentTheme.css['--poll-text'], opacity: 0.7 }}>{description}</p>
                                        )}
                                    </div>
                                    
                                    {/* Poll Type Badge */}
                                    <div 
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-4"
                                        style={{ 
                                            backgroundColor: currentTheme.css['--poll-option-selected'],
                                            color: currentTheme.css['--poll-primary']
                                        }}
                                    >
                                        {selectedPollType && <selectedPollType.icon size={12} />}
                                        {selectedPollType?.name}
                                    </div>
                                    
                                    {/* Preview Options */}
                                    {pollType === 'image' ? (
                                        <div className={`grid gap-2 ${previewDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-2'}`}>
                                            {previewOptions.length > 0 ? previewOptions.map((opt, i) => (
                                                <div key={i} className="relative group cursor-pointer">
                                                    <div 
                                                        className="aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]"
                                                        style={{ borderColor: currentTheme.css['--poll-border'] }}
                                                    >
                                                        <img src={opt.imageUrl} alt={opt.text} className="w-full h-full object-cover" />
                                                    </div>
                                                    {opt.text && opt.text !== `Image ${i + 1}` && (
                                                        <p className="text-xs text-center mt-1 truncate" style={{ color: currentTheme.css['--poll-text'] }}>{opt.text}</p>
                                                    )}
                                                </div>
                                            )) : (
                                                <div 
                                                    className="col-span-2 aspect-video rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: currentTheme.css['--poll-option-bg'], color: currentTheme.css['--poll-border'] }}
                                                >
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>
                                    ) : pollType === 'ranked' ? (
                                        <div className="space-y-2">
                                            {previewOptions.length > 0 ? previewOptions.map((opt, i) => (
                                                <div 
                                                    key={i} 
                                                    className="flex items-center gap-3 p-3 rounded-lg border transition-all"
                                                    style={{ 
                                                        backgroundColor: currentTheme.css['--poll-option-bg'],
                                                        borderColor: currentTheme.css['--poll-border']
                                                    }}
                                                >
                                                    <div 
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                                        style={{ 
                                                            backgroundColor: currentTheme.css['--poll-option-selected'],
                                                            color: currentTheme.css['--poll-primary']
                                                        }}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm font-medium flex-1" style={{ color: currentTheme.css['--poll-text'] }}>{opt.text}</span>
                                                    <GripVertical size={14} style={{ color: currentTheme.css['--poll-border'] }} />
                                                </div>
                                            )) : (
                                                <div 
                                                    className="p-4 rounded-lg text-center text-sm"
                                                    style={{ backgroundColor: currentTheme.css['--poll-option-bg'], color: currentTheme.css['--poll-text'], opacity: 0.5 }}
                                                >
                                                    Add options to see preview
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {previewOptions.length > 0 ? previewOptions.map((opt, i) => (
                                                <div 
                                                    key={i} 
                                                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]"
                                                    style={{ 
                                                        backgroundColor: currentTheme.css['--poll-option-bg'],
                                                        borderColor: currentTheme.css['--poll-border']
                                                    }}
                                                >
                                                    <div 
                                                        className="w-5 h-5 rounded-full border-2"
                                                        style={{ borderColor: currentTheme.css['--poll-border'] }}
                                                    ></div>
                                                    <span className="text-sm font-medium" style={{ color: currentTheme.css['--poll-text'] }}>{opt.text}</span>
                                                </div>
                                            )) : (
                                                <div 
                                                    className="p-4 rounded-lg text-center text-sm"
                                                    style={{ backgroundColor: currentTheme.css['--poll-option-bg'], color: currentTheme.css['--poll-text'], opacity: 0.5 }}
                                                >
                                                    Add options to see preview
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Preview Submit Button */}
                                    <div className="mt-4">
                                        <div 
                                            className="w-full py-2.5 text-white font-bold rounded-lg text-center text-sm opacity-70 cursor-not-allowed"
                                            style={{ backgroundColor: currentTheme.css['--poll-button'] }}
                                        >
                                            {buttonText || 'Submit Vote'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preview Tips */}
                            <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="flex items-start gap-2">
                                    <Zap size={14} className="text-indigo-500 mt-0.5" />
                                    <div className="text-xs text-indigo-700">
                                        <strong>Tip:</strong> {pollType === 'image' ? 'Use high-quality square images for best results.' : 'Keep options short and clear for better engagement.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default VoteGeneratorCreate;
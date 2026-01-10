// ============================================================================
// TemplateSelector - Beautiful template browsing and selection
// NOW WITH: Hash navigation support and Creator Templates (YouTube, Twitch, Reddit)
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, ArrowRight, Clock, Users, CheckCircle, 
    ListOrdered, Star, Image, ArrowLeftRight, X,
    Zap, ChevronRight, ClipboardList, Play
} from 'lucide-react';
import { 
    POLL_TEMPLATES, 
    TEMPLATE_CATEGORIES, 
    PollTemplate,
} from './pollTemplates';
import { CREATOR_TEMPLATES } from './creatorTemplates';

// Merge all templates
const ALL_TEMPLATES = [...POLL_TEMPLATES, ...CREATOR_TEMPLATES];

// Extended categories (add creators if not in base)
const EXTENDED_CATEGORIES = TEMPLATE_CATEGORIES.find(c => c.id === 'creators')
    ? TEMPLATE_CATEGORIES
    : [...TEMPLATE_CATEGORIES.slice(0, -1), { id: 'creators', label: 'Content Creators', icon: '🎬' }, ...TEMPLATE_CATEGORIES.slice(-1)];

// Icon mapping for poll types
const POLL_TYPE_ICONS: Record<string, React.ElementType> = {
    multiple: CheckCircle,
    ranked: ListOrdered,
    rating: Star,
    image: Image,
    pairwise: ArrowLeftRight,
    meeting: Clock,
    rsvp: Users,
    survey: ClipboardList,
};

// Poll type labels
const POLL_TYPE_LABELS: Record<string, string> = {
    multiple: 'Choice',
    ranked: 'Ranked',
    rating: 'Rating',
    image: 'Visual',
    pairwise: 'Compare',
    meeting: 'Schedule',
    rsvp: 'RSVP',
    survey: 'Survey',
};

// Creator platform config
const CREATOR_PLATFORMS = [
    { 
        id: 'youtube', 
        name: 'YouTube', 
        icon: '▶️',
        color: 'from-red-500 to-red-600',
        borderColor: 'border-red-200 hover:border-red-300',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        href: '/youtube-polls',
        description: 'Engage your audience with video idea polls, upload schedules, and thumbnail tests'
    },
    { 
        id: 'twitch', 
        name: 'Twitch', 
        icon: '📺',
        color: 'from-purple-500 to-purple-600',
        borderColor: 'border-purple-200 hover:border-purple-300',
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        href: '/twitch-polls',
        description: 'Let viewers vote on games, challenges, and stream decisions in real-time'
    },
    { 
        id: 'reddit', 
        name: 'Reddit', 
        icon: '🔗',
        color: 'from-orange-500 to-orange-600',
        borderColor: 'border-orange-200 hover:border-orange-300',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        href: '/reddit-polls',
        description: 'Create polls that work seamlessly across subreddits and communities'
    },
];

// Featured survey types config
const FEATURED_SURVEY_TYPES = [
    {
        id: 'csat',
        name: 'Customer Satisfaction (CSAT)',
        icon: '⭐',
        color: 'from-amber-500 to-yellow-500',
        borderColor: 'border-amber-200 hover:border-amber-300',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        keywords: ['csat', 'customer', 'satisfaction', 'nps', 'feedback'],
        description: 'Measure customer happiness with CSAT, NPS, and feedback surveys'
    },
    {
        id: 'employee',
        name: 'Employee Surveys',
        icon: '👥',
        color: 'from-emerald-500 to-teal-500',
        borderColor: 'border-emerald-200 hover:border-emerald-300',
        textColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        keywords: ['employee', 'engagement', 'workplace', 'hr', 'staff', 'team'],
        description: 'Boost engagement with pulse checks, satisfaction, and culture surveys'
    },
];

interface TemplateSelectorProps {
    onSelectTemplate: (template: PollTemplate) => void;
    onClose?: () => void;
    isModal?: boolean;
}

// Template Card Component
const TemplateCard: React.FC<{
    template: PollTemplate;
    onSelect: (template: PollTemplate) => void;
    index: number;
}> = ({ template, onSelect, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const PollTypeIcon = POLL_TYPE_ICONS[template.pollType] || CheckCircle;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            <div className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                ${isHovered 
                    ? 'border-transparent shadow-xl scale-[1.02]' 
                    : 'border-slate-200 shadow-sm'
                }
            `}>
                {/* Gradient Header */}
                <div className={`
                    relative h-32 bg-gradient-to-br ${template.gradient} p-5
                    overflow-hidden
                `}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        {template.previewStyle?.bgPattern === 'dots' && (
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }} />
                        )}
                        {template.previewStyle?.bgPattern === 'grid' && (
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }} />
                        )}
                        {template.previewStyle?.bgPattern === 'waves' && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" opacity="0.1" />
                                <path d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z" fill="white" opacity="0.1" />
                            </svg>
                        )}
                    </div>
                    
                    {/* Badge (if featured/anonymous) */}
                    {template.badge && (
                        <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${template.badgeColor || 'bg-white/20 text-white'}`}>
                                {template.badge}
                            </span>
                        </div>
                    )}
                    
                    {/* Icon & Category */}
                    <div className="relative z-10 flex items-start justify-between">
                        <motion.div 
                            className="text-4xl"
                            animate={{ 
                                rotate: isHovered ? [0, -10, 10, 0] : 0,
                                scale: isHovered ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {template.icon}
                        </motion.div>
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                            {template.categoryLabel}
                        </span>
                    </div>
                    
                    {/* Poll Type Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <PollTypeIcon size={12} className="text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">
                            {POLL_TYPE_LABELS[template.pollType] || template.pollType}
                        </span>
                    </div>
                </div>
                
                {/* Content */}
                <div className="bg-white p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                        {template.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {template.description}
                    </p>
                    
                    {/* Preview Question */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                            Sample Question
                        </p>
                        <p className="text-slate-700 text-sm font-medium line-clamp-1">
                            "{template.question}"
                        </p>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {template.bestFor?.slice(0, 2).map((use, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                                    {use}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* CTA Button */}
                    <motion.button
                        onClick={() => onSelect(template)}
                        className={`
                            w-full py-3 rounded-xl font-semibold text-sm
                            flex items-center justify-center gap-2
                            transition-all duration-300
                            ${isHovered 
                                ? `bg-gradient-to-r ${template.gradient} text-white shadow-lg` 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Sparkles size={16} />
                        Use This Template
                        <ArrowRight size={16} className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Creator Platform Card Component
const CreatorPlatformCard: React.FC<{
    platform: typeof CREATOR_PLATFORMS[0];
    templates: PollTemplate[];
}> = ({ platform, templates }) => {
    return (
        <a
            href={platform.href}
            className={`group block p-6 bg-white border-2 ${platform.borderColor} rounded-2xl hover:shadow-lg transition-all`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {platform.icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{platform.name} Polls</h3>
                    <p className="text-sm text-slate-500">{templates.length} templates</p>
                </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {platform.description}
            </p>
            
            {/* Preview templates */}
            <div className="space-y-2 mb-4">
                {templates.slice(0, 3).map(template => (
                    <div key={template.id} className="flex items-center gap-2 text-sm text-slate-600">
                        <span>{template.icon}</span>
                        <span className="truncate">{template.name}</span>
                    </div>
                ))}
            </div>
            
            <div className={`flex items-center gap-2 ${platform.textColor} font-semibold group-hover:gap-3 transition-all`}>
                View all templates <ArrowRight size={16} />
            </div>
        </a>
    );
};

// Featured Survey Type Card Component
const FeaturedSurveyCard: React.FC<{
    surveyType: typeof FEATURED_SURVEY_TYPES[0];
    templates: PollTemplate[];
    onSelectTemplate: (template: PollTemplate) => void;
    onViewAll: () => void;
}> = ({ surveyType, templates, onSelectTemplate, onViewAll }) => {
    return (
        <div className={`p-6 bg-white border-2 ${surveyType.borderColor} rounded-2xl hover:shadow-lg transition-all`}>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${surveyType.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {surveyType.icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{surveyType.name}</h3>
                    <p className="text-sm text-slate-500">{templates.length} templates</p>
                </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
                {surveyType.description}
            </p>
            
            {/* Preview templates as clickable items */}
            <div className="space-y-2 mb-4">
                {templates.slice(0, 3).map(template => (
                    <button
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition text-left"
                    >
                        <span>{template.icon}</span>
                        <span className="truncate flex-1">{template.name}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                    </button>
                ))}
            </div>
            
            {templates.length > 3 && (
                <button
                    onClick={onViewAll}
                    className={`flex items-center gap-2 ${surveyType.textColor} font-semibold hover:gap-3 transition-all`}
                >
                    View all {templates.length} templates <ArrowRight size={16} />
                </button>
            )}
        </div>
    );
};

// Multi-Question Survey Card Component - Links to /survey
const MultiQuestionSurveyCard: React.FC<{
    template: PollTemplate;
    index: number;
}> = ({ template, index }) => {
    return (
        <motion.a
            href={`/survey?template=${template.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative block"
        >
            <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                {/* Gradient Header */}
                <div className={`relative h-28 bg-gradient-to-br ${template.gradient} p-4 overflow-hidden`}>
                    {/* Question count badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-bold text-slate-700">
                        {template.questionCount} questions
                    </div>
                    
                    <div className="relative z-10">
                        <span className="text-3xl mb-2 block">{template.icon}</span>
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
                            {template.name}
                        </h3>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4 bg-white">
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {template.description}
                    </p>
                    
                    {/* Best for tags */}
                    {template.bestFor && template.bestFor.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {template.bestFor.slice(0, 2).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {/* CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{template.estimatedTime}</span>
                        <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                            Open in Survey Builder <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </div>
        </motion.a>
    );
};

// Main Template Selector
const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
    onSelectTemplate, 
    onClose,
    isModal = false 
}) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'polls' | 'quick-surveys' | 'creators' | 'multi-question'>('all');
    
    // Refs for scroll targets
    const pollsSectionRef = useRef<HTMLDivElement>(null);
    const surveysSectionRef = useRef<HTMLDivElement>(null);
    const creatorsSectionRef = useRef<HTMLDivElement>(null);
    
    // Handle hash navigation on mount and hash change
    useEffect(() => {
        if (isModal) return; // Don't handle hash in modal mode
        
        const handleHashNavigation = () => {
            const hash = window.location.hash.toLowerCase();
            
            if (hash === '#polls') {
                setTypeFilter('polls');
                setTimeout(() => {
                    pollsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else if (hash === '#quick-surveys' || hash === '#surveys') {
                // Support both old #surveys and new #quick-surveys
                setTypeFilter('quick-surveys');
                setTimeout(() => {
                    surveysSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else if (hash === '#creators') {
                setTypeFilter('creators');
                setTimeout(() => {
                    creatorsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else if (hash === '#multi-question') {
                setTypeFilter('multi-question');
            }
        };
        
        // Run on mount
        handleHashNavigation();
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashNavigation);
        return () => window.removeEventListener('hashchange', handleHashNavigation);
    }, [isModal]);
    
    // Filter templates by category, search, and type
    const filteredTemplates = ALL_TEMPLATES.filter(template => {
        // Type filter (polls vs quick-surveys vs creators vs multi-question)
        if (typeFilter === 'polls') {
            // Polls: exclude surveys, creators, and quick feedback templates
            if (template.pollType === 'survey' || template.category === 'creators') return false;
            if (template.badge === 'Quick' || template.id.startsWith('quick-')) return false;
        }
        if (typeFilter === 'quick-surveys') {
            // Quick Surveys: single-question feedback templates
            // Include: templates with badge 'Quick' OR id starting with 'quick-'
            const isQuickTemplate = template.badge === 'Quick' || template.id.startsWith('quick-');
            if (!isQuickTemplate) return false;
        }
        if (typeFilter === 'creators' && template.category !== 'creators') {
            return false;
        }
        if (typeFilter === 'multi-question') {
            // Multi-question = survey type with 3+ questions
            if (template.pollType !== 'survey') return false;
            if (!template.questionCount || template.questionCount <= 2) return false;
        }
        
        // Category filter
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        
        // Search filter
        if (!searchQuery.trim()) return matchesCategory;
        
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            template.name.toLowerCase().includes(query) ||
            template.description.toLowerCase().includes(query) ||
            template.question.toLowerCase().includes(query) ||
            (template.bestFor?.some(tag => tag.toLowerCase().includes(query)) ?? false);
        
        return matchesCategory && matchesSearch;
    });
    
    // Separate templates by type for section display
    // Single-question polls (excludes surveys, creators, and quick feedback)
    const pollTemplates = filteredTemplates.filter(t => 
        t.pollType !== 'survey' && 
        t.category !== 'creators' && 
        t.badge !== 'Quick' && 
        !t.id.startsWith('quick-')
    );
    
    // Quick feedback templates (badge 'Quick' or id starts with 'quick-')
    const quickSurveyTemplates = filteredTemplates.filter(t => 
        t.badge === 'Quick' || t.id.startsWith('quick-')
    );
    
    // Multi-question surveys (survey type with 3+ questions) - these link to /survey builder
    const multiQuestionSurveys = ALL_TEMPLATES.filter(t => 
        t.pollType === 'survey' && t.questionCount && t.questionCount > 2
    );
    
    const creatorTemplates = filteredTemplates.filter(t => t.category === 'creators');
    
    // Group creator templates by platform
    const youtubeTemplates = CREATOR_TEMPLATES.filter(t => t.id.startsWith('youtube-'));
    const twitchTemplates = CREATOR_TEMPLATES.filter(t => t.id.startsWith('twitch-'));
    const redditTemplates = CREATOR_TEMPLATES.filter(t => t.id.startsWith('reddit-'));
    
    // Group survey templates by type (CSAT and Employee)
    const csatTemplates = ALL_TEMPLATES.filter(t => 
        t.pollType === 'survey' && 
        (t.id.toLowerCase().includes('csat') || 
         t.id.toLowerCase().includes('nps') ||
         t.id.toLowerCase().includes('customer') ||
         t.name.toLowerCase().includes('customer') ||
         t.name.toLowerCase().includes('satisfaction') ||
         t.name.toLowerCase().includes('csat'))
    );
    
    const employeeTemplates = ALL_TEMPLATES.filter(t => 
        t.pollType === 'survey' && 
        (t.id.toLowerCase().includes('employee') || 
         t.id.toLowerCase().includes('engagement') ||
         t.id.toLowerCase().includes('workplace') ||
         t.category === 'hr' ||
         t.name.toLowerCase().includes('employee') ||
         t.name.toLowerCase().includes('staff') ||
         t.name.toLowerCase().includes('team pulse'))
    );
    
    // Count totals
    const totalPolls = ALL_TEMPLATES.filter(t => 
        t.pollType !== 'survey' && 
        t.category !== 'creators' && 
        t.badge !== 'Quick' && 
        !t.id.startsWith('quick-')
    ).length;
    const totalQuickSurveys = ALL_TEMPLATES.filter(t => 
        t.badge === 'Quick' || t.id.startsWith('quick-')
    ).length;
    const totalMultiQuestion = ALL_TEMPLATES.filter(t => t.pollType === 'survey' && t.questionCount && t.questionCount > 2).length;
    const totalCreators = CREATOR_TEMPLATES.length;
    
    const content = (
        <div className={isModal ? '' : 'min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-blue-50/30'}>
            {/* Header */}
            <div className={`${isModal ? 'p-6 border-b border-slate-200' : 'pt-12 pb-8 px-4'}`}>
                <div className="max-w-5xl mx-auto">
                    {isModal && onClose && (
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    )}
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4">
                            <Zap size={16} />
                            {ALL_TEMPLATES.length}+ Free Templates
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Find Your Perfect Template
                        </h1>
                        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-6">
                            Search by topic or browse categories. Pick one and customize in seconds.
                        </p>
                        
                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search templates... (e.g., team lunch, YouTube, feedback)"
                                className="w-full px-5 py-3.5 pl-12 border-2 border-slate-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white shadow-sm"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                                >
                                    <X size={16} className="text-slate-400" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Type Filter Toggle (Polls vs Quick Feedback vs Creators vs Multi-Question) */}
            {!isModal && (
                <div className="px-4 pb-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-center">
                            <div className="inline-flex bg-slate-100 rounded-xl p-1 flex-wrap justify-center gap-1">
                                {[
                                    { id: 'all', label: 'All Templates', count: ALL_TEMPLATES.length },
                                    { id: 'polls', label: 'Polls', count: totalPolls },
                                    { id: 'quick-surveys', label: 'Quick Surveys', count: totalQuickSurveys },
                                    { id: 'creators', label: '🎬 Creators', count: totalCreators },
                                    { id: 'multi-question', label: '📋 Multi-Question', count: totalMultiQuestion },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setTypeFilter(type.id as typeof typeFilter);
                                            setSelectedCategory('all'); // Reset category when changing type
                                            // Update URL hash
                                            if (type.id !== 'all') {
                                                window.history.pushState({}, '', `/templates#${type.id}`);
                                            } else {
                                                window.history.pushState({}, '', '/templates');
                                            }
                                        }}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                                            typeFilter === type.id
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        {type.label}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                            typeFilter === type.id ? 'bg-indigo-100' : 'bg-slate-200'
                                        }`}>
                                            {type.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Category Pills - Hide when viewing creators (they have their own sections) */}
            {typeFilter !== 'creators' && (
                <div className={`${isModal ? 'px-6 py-4' : 'px-4 pb-8'}`}>
                    <div className="max-w-5xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap justify-center gap-2"
                        >
                            {EXTENDED_CATEGORIES.filter(cat => cat.id !== 'creators').map((cat) => {
                                // Count based on current type filter
                                let count: number;
                                if (cat.id === 'all') {
                                    count = filteredTemplates.length;
                                } else {
                                    count = filteredTemplates.filter(t => t.category === cat.id).length;
                                }
                                
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`
                                            px-4 py-2.5 rounded-xl font-medium text-sm
                                            flex items-center gap-2 transition-all duration-200
                                            ${selectedCategory === cat.id
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                            }
                                        `}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.label}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                            selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100'
                                        }`}>{count}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                        
                        {/* Results count */}
                        {searchQuery && (
                            <p className="text-center text-sm text-slate-500 mt-4">
                                Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} 
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Templates Grid */}
            <div className={`${isModal ? 'px-6 pb-6 max-h-[60vh] overflow-y-auto' : 'px-4 pb-16'}`}>
                <div className="max-w-5xl mx-auto">
                    
                    {/* CREATORS VIEW - Platform Cards + Templates */}
                    {typeFilter === 'creators' && (
                        <div ref={creatorsSectionRef} className="scroll-mt-48">
                            {/* Platform Cards */}
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                <CreatorPlatformCard 
                                    platform={CREATOR_PLATFORMS[0]} 
                                    templates={youtubeTemplates} 
                                />
                                <CreatorPlatformCard 
                                    platform={CREATOR_PLATFORMS[1]} 
                                    templates={twitchTemplates} 
                                />
                                <CreatorPlatformCard 
                                    platform={CREATOR_PLATFORMS[2]} 
                                    templates={redditTemplates} 
                                />
                            </div>
                            
                            {/* All Creator Templates */}
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Play className="w-5 h-5 text-purple-600" />
                                All Creator Templates
                                <span className="text-sm font-normal text-slate-500">({creatorTemplates.length})</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {creatorTemplates.map((template, index) => (
                                    <TemplateCard
                                        key={template.id}
                                        template={template}
                                        onSelect={onSelectTemplate}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* ALL VIEW - Show all sections */}
                    {typeFilter === 'all' && !searchQuery && selectedCategory === 'all' && (
                        <>
                            {/* Creator Platform Cards (compact) */}
                            <div ref={creatorsSectionRef} className="mb-12 scroll-mt-48">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-purple-600" />
                                    For Content Creators
                                    <span className="text-sm font-normal text-slate-500">({totalCreators} templates)</span>
                                    <a 
                                        href="/templates#creators" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTypeFilter('creators');
                                            window.history.pushState({}, '', '/templates#creators');
                                        }}
                                        className="ml-auto text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
                                    >
                                        View all <ChevronRight size={14} />
                                    </a>
                                </h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {CREATOR_PLATFORMS.map((platform) => {
                                        const templates = platform.id === 'youtube' ? youtubeTemplates :
                                                         platform.id === 'twitch' ? twitchTemplates :
                                                         redditTemplates;
                                        return (
                                            <a
                                                key={platform.id}
                                                href={platform.href}
                                                className={`group flex items-center gap-4 p-4 bg-white border-2 ${platform.borderColor} rounded-xl transition-all hover:shadow-md`}
                                            >
                                                <div className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center text-xl`}>
                                                    {platform.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900">{platform.name}</h3>
                                                    <p className="text-sm text-slate-500">{templates.length} templates</p>
                                                </div>
                                                <ArrowRight size={16} className={`${platform.textColor} group-hover:translate-x-1 transition-transform`} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Poll Templates Section */}
                            {pollTemplates.length > 0 && (
                                <div ref={pollsSectionRef} className="mb-12 scroll-mt-48">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                                        Poll Templates
                                        <span className="text-sm font-normal text-slate-500">({pollTemplates.length})</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pollTemplates.map((template, index) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                onSelect={onSelectTemplate}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Quick Feedback Templates Section */}
                            {quickSurveyTemplates.length > 0 && (
                                <div ref={surveysSectionRef} className="scroll-mt-48 mb-12">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-teal-600" />
                                        Quick Feedback
                                        <span className="text-sm font-normal text-slate-500">({quickSurveyTemplates.length})</span>
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {quickSurveyTemplates.map((template, index) => (
                                            <TemplateCard
                                                key={template.id}
                                                template={template}
                                                onSelect={onSelectTemplate}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Multi-Question Surveys Section - Links to /survey */}
                            {multiQuestionSurveys.length > 0 && (
                                <div className="scroll-mt-48">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <ClipboardList className="w-5 h-5 text-emerald-600" />
                                            Multi-Question Surveys
                                            <span className="text-sm font-normal text-slate-500">({multiQuestionSurveys.length})</span>
                                        </h2>
                                        <a 
                                            href="/survey"
                                            className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1"
                                        >
                                            Create Survey <ChevronRight size={14} />
                                        </a>
                                    </div>
                                    
                                    {/* Info banner */}
                                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <p className="text-sm text-emerald-700">
                                            <strong>These templates open in our Survey Builder</strong> — create comprehensive surveys with multiple questions, sections, and advanced logic.
                                        </p>
                                    </div>
                                    
                                    {/* Featured Survey Types */}
                                    {(csatTemplates.length > 0 || employeeTemplates.length > 0) && (
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            {csatTemplates.length > 0 && (
                                                <FeaturedSurveyCard
                                                    surveyType={FEATURED_SURVEY_TYPES[0]}
                                                    templates={csatTemplates}
                                                    onSelectTemplate={onSelectTemplate}
                                                    onViewAll={() => setSearchQuery('customer')}
                                                />
                                            )}
                                            {employeeTemplates.length > 0 && (
                                                <FeaturedSurveyCard
                                                    surveyType={FEATURED_SURVEY_TYPES[1]}
                                                    templates={employeeTemplates}
                                                    onSelectTemplate={onSelectTemplate}
                                                    onViewAll={() => setSearchQuery('employee')}
                                                />
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Multi-Question Survey Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {multiQuestionSurveys.map((template, index) => (
                                            <MultiQuestionSurveyCard
                                                key={template.id}
                                                template={template}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    {/* POLLS / QUICK FEEDBACK FILTERED VIEW */}
                    {(typeFilter === 'polls' || typeFilter === 'quick-surveys') && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${selectedCategory}-${typeFilter}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div 
                                    ref={typeFilter === 'polls' ? pollsSectionRef : surveysSectionRef}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredTemplates.map((template, index) => (
                                        <TemplateCard
                                            key={template.id}
                                            template={template}
                                            onSelect={onSelectTemplate}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                    
                    {/* MULTI-QUESTION FILTERED VIEW */}
                    {typeFilter === 'multi-question' && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="multi-question"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Info banner */}
                                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                                    <p className="text-sm text-emerald-700">
                                        <strong>Multi-question surveys</strong> open in our Survey Builder with sections, logic, and advanced features.
                                    </p>
                                    <a 
                                        href="/survey"
                                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition"
                                    >
                                        Create Survey →
                                    </a>
                                </div>
                                
                                {/* Featured Survey Types */}
                                {(csatTemplates.length > 0 || employeeTemplates.length > 0) && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Survey Types</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {csatTemplates.length > 0 && (
                                                <FeaturedSurveyCard
                                                    surveyType={FEATURED_SURVEY_TYPES[0]}
                                                    templates={csatTemplates}
                                                    onSelectTemplate={onSelectTemplate}
                                                    onViewAll={() => setSearchQuery('customer')}
                                                />
                                            )}
                                            {employeeTemplates.length > 0 && (
                                                <FeaturedSurveyCard
                                                    surveyType={FEATURED_SURVEY_TYPES[1]}
                                                    templates={employeeTemplates}
                                                    onSelectTemplate={onSelectTemplate}
                                                    onViewAll={() => setSearchQuery('employee')}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* All Multi-Question Templates */}
                                <h3 className="text-lg font-bold text-slate-900 mb-4">All Multi-Question Templates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates.map((template, index) => (
                                        <MultiQuestionSurveyCard
                                            key={template.id}
                                            template={template}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                    
                    {/* SEARCH/CATEGORY FILTERED VIEW (not 'all' type) */}
                    {typeFilter === 'all' && (searchQuery || selectedCategory !== 'all') && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${selectedCategory}-search`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTemplates.map((template, index) => (
                                        <TemplateCard
                                            key={template.id}
                                            template={template}
                                            onSelect={onSelectTemplate}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                    
                    {/* Empty State */}
                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-slate-500 mb-4">No templates found.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setTypeFilter('all');
                                }}
                                className="text-indigo-600 font-medium hover:text-indigo-700"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Or Start Blank */}
            {!isModal && (
                <div className="max-w-5xl mx-auto px-4 pb-16">
                    <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">
                            Want more control? Start from scratch.
                        </p>
                        <a 
                            href="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition"
                        >
                            Create Blank Poll
                            <ChevronRight size={18} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );

    // If modal, wrap in modal container
    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                    {content}
                </motion.div>
            </div>
        );
    }

    return content;
};

export default TemplateSelector;
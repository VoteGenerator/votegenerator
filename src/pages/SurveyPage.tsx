// ============================================================================
// SurveyPage - Dedicated Survey Creation Page
// Route: /survey
// 
// Key differences from LandingPage:
// - No hero banner
// - Auto-selects "Survey" poll type  
// - Shows survey-specific templates prominently
// - Cleaner, focused UX like Typeform
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, ArrowRight, ArrowLeft, Sparkles, Users, Star, TrendingUp,
    ShoppingCart, MessageSquare, Calendar, ChevronRight, Check,
    Shield, Clock, BarChart3, Eye, EyeOff, Plus, Building2
} from 'lucide-react';
import NavHeader from '../components/NavHeader';
import Footer from '../components/Footer';
import SurveyBuilder from '../components/SurveyBuilder';

// ============================================================================
// SURVEY TEMPLATE DEFINITIONS (Full multi-question surveys)
// ============================================================================

interface SurveyTemplateQuestion {
    id: string;
    type: 'scale' | 'rating' | 'multiple_choice' | 'textarea' | 'text' | 'yes_no';
    question: string;
    required?: boolean;
    options?: { id: string; text: string }[];
    minValue?: number;
    maxValue?: number;
    minLabel?: string;
    maxLabel?: string;
    placeholder?: string;
}

interface SurveyTemplateSection {
    id: string;
    title: string;
    description?: string;
    questions: SurveyTemplateQuestion[];
}

interface SurveyTemplate {
    id: string;
    name: string;
    description: string;
    icon: typeof Users;
    gradient: string;
    badge?: string;
    badgeColor?: string;
    sections: SurveyTemplateSection[];
    settings: {
        anonymousMode?: boolean;
        collectDepartment?: boolean;
    };
    estimatedTime: string;
    questionCount: number;
}

const SURVEY_TEMPLATES: SurveyTemplate[] = [
    {
        id: 'employee-engagement',
        name: 'Employee Engagement Survey',
        description: 'Comprehensive 10-question survey measuring satisfaction, growth, and culture',
        icon: Users,
        gradient: 'from-emerald-500 to-teal-600',
        badge: 'Anonymous',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        estimatedTime: '3-4 min',
        questionCount: 10,
        settings: {
            anonymousMode: true,
            
            collectDepartment: true,
        },
        sections: [
            {
                id: 'overall',
                title: 'Overall Satisfaction',
                description: 'How you feel about working here',
                questions: [
                    {
                        id: 'enps',
                        type: 'scale',
                        question: 'How likely are you to recommend this company as a great place to work?',
                        required: true,
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                    },
                    {
                        id: 'satisfaction',
                        type: 'rating',
                        question: 'Overall, how satisfied are you with your job?',
                        required: true,
                    },
                ],
            },
            {
                id: 'growth',
                title: 'Growth & Development',
                description: 'Career advancement and learning opportunities',
                questions: [
                    {
                        id: 'growth_path',
                        type: 'scale',
                        question: 'I see a clear path for growth and advancement at this company.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                    {
                        id: 'learning',
                        type: 'scale',
                        question: 'I have opportunities to learn and develop new skills.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                ],
            },
            {
                id: 'management',
                title: 'Management & Leadership',
                description: 'Your relationship with leadership',
                questions: [
                    {
                        id: 'manager_feedback',
                        type: 'scale',
                        question: 'My manager gives me regular, constructive feedback.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                    {
                        id: 'leadership_trust',
                        type: 'scale',
                        question: 'I trust the leadership team to make good decisions for the company.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                ],
            },
            {
                id: 'culture',
                title: 'Culture & Environment',
                description: 'Workplace culture and balance',
                questions: [
                    {
                        id: 'work_life',
                        type: 'scale',
                        question: 'I can maintain a healthy work-life balance.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                    {
                        id: 'psych_safety',
                        type: 'scale',
                        question: 'I feel psychologically safe to share ideas and concerns.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                    {
                        id: 'recognition',
                        type: 'scale',
                        question: 'I feel valued and recognized for my contributions.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                ],
            },
            {
                id: 'feedback',
                title: 'Open Feedback',
                description: 'Share your thoughts',
                questions: [
                    {
                        id: 'improvement',
                        type: 'textarea',
                        question: 'What is one thing we could do to make this a better place to work?',
                        placeholder: 'Your feedback is completely anonymous...',
                    },
                ],
            },
        ],
    },
    {
        id: 'customer-satisfaction',
        name: 'Customer Satisfaction (CSAT)',
        description: 'Measure customer happiness with NPS, CSAT, and actionable feedback',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        badge: 'NPS Included',
        badgeColor: 'bg-amber-100 text-amber-700',
        estimatedTime: '2-3 min',
        questionCount: 7,
        settings: {
            anonymousMode: false,
            
        },
        sections: [
            {
                id: 'satisfaction',
                title: 'Satisfaction',
                questions: [
                    {
                        id: 'csat',
                        type: 'rating',
                        question: 'How satisfied are you with our product/service?',
                        required: true,
                    },
                    {
                        id: 'nps',
                        type: 'scale',
                        question: 'How likely are you to recommend us to a friend or colleague?',
                        required: true,
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                    },
                ],
            },
            {
                id: 'details',
                title: 'Details',
                questions: [
                    {
                        id: 'ease_of_use',
                        type: 'scale',
                        question: 'How easy was it to use our product/service?',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Very difficult',
                        maxLabel: 'Very easy',
                    },
                    {
                        id: 'value',
                        type: 'scale',
                        question: 'How would you rate the value for money?',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Poor value',
                        maxLabel: 'Excellent value',
                    },
                    {
                        id: 'support',
                        type: 'scale',
                        question: 'How would you rate our customer support?',
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Very poor',
                        maxLabel: 'Excellent',
                    },
                ],
            },
            {
                id: 'feedback',
                title: 'Feedback',
                questions: [
                    {
                        id: 'liked',
                        type: 'textarea',
                        question: 'What did you like most about your experience?',
                        placeholder: 'Tell us what went well...',
                    },
                    {
                        id: 'improve',
                        type: 'textarea',
                        question: 'What could we do better?',
                        placeholder: 'Help us improve...',
                    },
                ],
            },
        ],
    },
    {
        id: 'nps-quick',
        name: 'Quick NPS Survey',
        description: 'Simple 2-question NPS survey for fast feedback',
        icon: TrendingUp,
        gradient: 'from-cyan-500 to-blue-600',
        badge: 'Quick',
        badgeColor: 'bg-cyan-100 text-cyan-700',
        estimatedTime: '30 sec',
        questionCount: 2,
        settings: {
            anonymousMode: false,
            
        },
        sections: [
            {
                id: 'nps',
                title: 'Net Promoter Score',
                questions: [
                    {
                        id: 'nps_score',
                        type: 'scale',
                        question: 'How likely are you to recommend us to a friend or colleague?',
                        required: true,
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                    },
                    {
                        id: 'nps_reason',
                        type: 'textarea',
                        question: 'What is the primary reason for your score?',
                        placeholder: 'Help us understand your rating...',
                    },
                ],
            },
        ],
    },
    {
        id: 'post-purchase',
        name: 'Post-Purchase Feedback',
        description: 'Understand the buying experience from discovery to delivery',
        icon: ShoppingCart,
        gradient: 'from-violet-500 to-purple-600',
        estimatedTime: '1-2 min',
        questionCount: 5,
        settings: {
            anonymousMode: false,
            
        },
        sections: [
            {
                id: 'purchase',
                title: 'Your Purchase',
                questions: [
                    {
                        id: 'purchase_satisfaction',
                        type: 'rating',
                        question: 'How satisfied are you with your purchase?',
                        required: true,
                    },
                    {
                        id: 'checkout_ease',
                        type: 'scale',
                        question: 'How easy was the checkout process?',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Very difficult',
                        maxLabel: 'Very easy',
                    },
                ],
            },
            {
                id: 'discovery',
                title: 'How You Found Us',
                questions: [
                    {
                        id: 'how_found',
                        type: 'multiple_choice',
                        question: 'How did you hear about us?',
                        options: [
                            { id: 'search', text: 'Search engine (Google, etc.)' },
                            { id: 'social', text: 'Social media' },
                            { id: 'friend', text: 'Friend or colleague' },
                            { id: 'ad', text: 'Advertisement' },
                            { id: 'other', text: 'Other' },
                        ],
                    },
                ],
            },
            {
                id: 'feedback',
                title: 'Feedback',
                questions: [
                    {
                        id: 'purchase_again',
                        type: 'yes_no',
                        question: 'Would you purchase from us again?',
                        required: true,
                    },
                    {
                        id: 'suggestions',
                        type: 'textarea',
                        question: 'Any suggestions for improvement?',
                        placeholder: 'We value your feedback...',
                    },
                ],
            },
        ],
    },
    {
        id: 'event-feedback',
        name: 'Event Feedback Survey',
        description: 'Gather comprehensive feedback from event attendees',
        icon: Calendar,
        gradient: 'from-rose-500 to-pink-600',
        estimatedTime: '2-3 min',
        questionCount: 6,
        settings: {
            anonymousMode: true,
            
        },
        sections: [
            {
                id: 'overall',
                title: 'Overall Experience',
                questions: [
                    {
                        id: 'event_rating',
                        type: 'rating',
                        question: 'How would you rate this event overall?',
                        required: true,
                    },
                    {
                        id: 'event_nps',
                        type: 'scale',
                        question: 'How likely are you to recommend this event to others?',
                        required: true,
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                    },
                ],
            },
            {
                id: 'details',
                title: 'Event Details',
                questions: [
                    {
                        id: 'content_quality',
                        type: 'scale',
                        question: 'How would you rate the quality of the content/speakers?',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Poor',
                        maxLabel: 'Excellent',
                    },
                    {
                        id: 'logistics',
                        type: 'scale',
                        question: 'How would you rate the venue and logistics?',
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Poor',
                        maxLabel: 'Excellent',
                    },
                ],
            },
            {
                id: 'feedback',
                title: 'Feedback',
                questions: [
                    {
                        id: 'attend_again',
                        type: 'yes_no',
                        question: 'Would you attend this event again?',
                        required: true,
                    },
                    {
                        id: 'improvements',
                        type: 'textarea',
                        question: 'What could be improved for future events?',
                        placeholder: 'Your suggestions...',
                    },
                ],
            },
        ],
    },
    {
        id: 'team-feedback',
        name: 'Team Feedback Survey',
        description: 'Anonymous feedback collection for teams and retrospectives',
        icon: MessageSquare,
        gradient: 'from-blue-500 to-indigo-600',
        badge: 'Anonymous',
        badgeColor: 'bg-blue-100 text-blue-700',
        estimatedTime: '2-3 min',
        questionCount: 5,
        settings: {
            anonymousMode: true,
            
        },
        sections: [
            {
                id: 'team',
                title: 'Team Dynamics',
                questions: [
                    {
                        id: 'collaboration',
                        type: 'scale',
                        question: 'Our team collaborates effectively to achieve goals.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                    {
                        id: 'communication',
                        type: 'scale',
                        question: 'Communication within our team is clear and effective.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                ],
            },
            {
                id: 'process',
                title: 'Process & Workflow',
                questions: [
                    {
                        id: 'process_efficiency',
                        type: 'scale',
                        question: 'Our current processes help us work efficiently.',
                        required: true,
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                    },
                ],
            },
            {
                id: 'feedback',
                title: 'Open Feedback',
                questions: [
                    {
                        id: 'working_well',
                        type: 'textarea',
                        question: 'What is working well for our team?',
                        placeholder: 'Share what you appreciate...',
                    },
                    {
                        id: 'improvements',
                        type: 'textarea',
                        question: 'What should we improve?',
                        placeholder: 'Your honest feedback helps us grow...',
                    },
                ],
            },
        ],
    },
];

// ============================================================================
// DEPARTMENT OPTIONS (for Employee Engagement segmentation)
// ============================================================================

const DEPARTMENT_OPTIONS = [
    { id: 'engineering', label: 'Engineering / Tech' },
    { id: 'product', label: 'Product' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'sales', label: 'Sales' },
    { id: 'customer_success', label: 'Customer Success' },
    { id: 'hr', label: 'HR / People Ops' },
    { id: 'finance', label: 'Finance' },
    { id: 'operations', label: 'Operations' },
    { id: 'legal', label: 'Legal' },
    { id: 'other', label: 'Other' },
];

// ============================================================================
// TEMPLATE CARD COMPONENT
// ============================================================================

interface TemplateCardProps {
    template: SurveyTemplate;
    onSelect: (template: SurveyTemplate) => void;
    isSelected?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isSelected }) => {
    const Icon = template.icon;
    
    return (
        <motion.button
            onClick={() => onSelect(template)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative w-full text-left p-6 rounded-2xl border-2 transition-all
                ${isSelected 
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                }
            `}
        >
            {/* Badge */}
            {template.badge && (
                <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-bold rounded-full ${template.badgeColor}`}>
                    {template.badge}
                </span>
            )}
            
            {/* Icon */}
            <div className={`w-12 h-12 bg-gradient-to-br ${template.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">{template.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{template.description}</p>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5" />
                    {template.questionCount} questions
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {template.estimatedTime}
                </span>
                {template.settings.anonymousMode && (
                    <span className="flex items-center gap-1 text-emerald-600">
                        <EyeOff className="w-3.5 h-3.5" />
                        Anonymous
                    </span>
                )}
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute bottom-4 right-4">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                </div>
            )}
        </motion.button>
    );
};

// ============================================================================
// MAIN SURVEY PAGE COMPONENT
// ============================================================================

const SurveyPage: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
    const [showBuilder, setShowBuilder] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(DEPARTMENT_OPTIONS.map(d => d.id));
    
    // Canonical tag
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = 'https://votegenerator.com/survey';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    // Check URL for template parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('template');
        if (templateId) {
            const template = SURVEY_TEMPLATES.find(t => t.id === templateId);
            if (template) {
                setSelectedTemplate(template);
                setShowBuilder(true);
            }
        }
    }, []);

    const handleSelectTemplate = (template: SurveyTemplate) => {
        setSelectedTemplate(template);
    };

    const handleStartBuilding = () => {
        if (selectedTemplate) {
            setShowBuilder(true);
            // Update URL
            window.history.pushState({}, '', `/survey?template=${selectedTemplate.id}`);
        }
    };

    const handleStartFromScratch = () => {
        setSelectedTemplate(null);
        setShowBuilder(true);
        window.history.pushState({}, '', '/survey');
    };

    // If showing builder, render the survey builder
    if (showBuilder) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* Creation Mode Header - Teal/Cyan theme for Survey */}
                <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                            <img 
                                src="/logo.svg" 
                                alt="VoteGenerator" 
                                className="w-8 h-8 sm:w-9 sm:h-9 brightness-0 invert"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                            <span className="font-bold text-lg sm:text-xl text-white">
                                Vote<span className="text-teal-100">Generator</span>
                            </span>
                        </a>

                        {/* Creation Mode Badge - Center */}
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <ClipboardList size={14} className="text-white sm:w-4 sm:h-4" />
                            <span className="text-white font-semibold text-xs sm:text-sm">Creating Survey</span>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={() => {
                                setShowBuilder(false);
                                window.history.pushState({}, '', '/survey');
                            }}
                            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs sm:text-sm font-medium transition"
                        >
                            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Templates</span>
                        </button>
                    </div>
                </header>
                
                {/* Survey Builder */}
                <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
                    {selectedTemplate && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 bg-gradient-to-br ${selectedTemplate.gradient} rounded-lg flex items-center justify-center`}>
                                    <selectedTemplate.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">{selectedTemplate.name}</h1>
                                    <p className="text-sm text-slate-600">{selectedTemplate.questionCount} questions • {selectedTemplate.estimatedTime}</p>
                                </div>
                            </div>
                            
                            {/* Settings badges */}
                            <div className="flex gap-2 mt-4">
                                {selectedTemplate.settings.anonymousMode && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                                        <EyeOff className="w-3.5 h-3.5" /> Anonymous Mode
                                    </span>
                                )}
                                {selectedTemplate.settings.collectDepartment && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                        <Building2 className="w-3.5 h-3.5" /> Department Breakdown
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Department Selection for Employee Survey */}
                    {selectedTemplate?.settings.collectDepartment && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Department Breakdown
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Respondents will select their department. Results will be segmented for comparison.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {DEPARTMENT_OPTIONS.map((dept) => (
                                    <label
                                        key={dept.id}
                                        className={`
                                            flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                                            ${selectedDepartments.includes(dept.id)
                                                ? 'bg-blue-50 border-2 border-blue-300'
                                                : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                                            }
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDepartments.includes(dept.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDepartments([...selectedDepartments, dept.id]);
                                                } else {
                                                    setSelectedDepartments(selectedDepartments.filter(d => d !== dept.id));
                                                }
                                            }}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                            selectedDepartments.includes(dept.id) 
                                                ? 'bg-blue-600 border-blue-600' 
                                                : 'border-slate-300'
                                        }`}>
                                            {selectedDepartments.includes(dept.id) && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm text-slate-700">{dept.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Survey Builder Component - pass correct props */}
                    <SurveyBuilder 
                        initialSections={selectedTemplate?.sections}
                        initialSettings={selectedTemplate ? {
                            anonymousMode: selectedTemplate.settings.anonymousMode,
                            showProgress: true,
                            allowBack: true,
                        } : undefined}
                    />
                </div>
                
                <Footer />
            </div>
        );
    }

    // Template selection view
    return (
        <div className="min-h-screen bg-slate-50">
            <NavHeader />
            
            {/* Header - Clean, no hero */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                            <ClipboardList className="w-4 h-4" />
                            Multi-Question Surveys
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Create a survey
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Choose a template to get started quickly, or build from scratch. 
                            All surveys include real-time analytics and beautiful results.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Template Grid */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-xl font-bold text-slate-900 mb-8">
                    Choose how to start
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* START FROM SCRATCH - Featured Card */}
                    <motion.button
                        onClick={handleStartFromScratch}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full text-left p-6 rounded-2xl border-2 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-indigo-500 hover:shadow-lg transition-all group"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-7 h-7 text-white" />
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Start from Scratch</h3>
                        <p className="text-sm text-slate-600 mb-4">Build your own custom survey with any questions you want</p>
                        
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-indigo-600 font-medium">
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Full flexibility
                            </span>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="absolute bottom-4 right-4 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </motion.button>
                    
                    {/* Template Cards */}
                    {SURVEY_TEMPLATES.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={handleSelectTemplate}
                            isSelected={selectedTemplate?.id === template.id}
                        />
                    ))}
                </div>
                
                {/* Selected template CTA */}
                <AnimatePresence>
                    {selectedTemplate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:p-4 shadow-lg z-50"
                        >
                            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${selectedTemplate.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <selectedTemplate.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900 truncate">{selectedTemplate.name}</p>
                                        <p className="text-xs sm:text-sm text-slate-600">{selectedTemplate.questionCount} questions • {selectedTemplate.estimatedTime}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleStartBuilding}
                                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    Use this template
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <Footer />
        </div>
    );
};

export default SurveyPage;
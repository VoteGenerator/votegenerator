// ============================================================================
// SurveyBuilder - Multi-Section Poll/Survey Creator
// Location: src/components/SurveyBuilder.tsx
// Features: Drag-drop sections, multiple question types, Anonymous Mode, NPS templates
// Updated: Added Employee Engagement, CSAT, NPS templates + Anonymous Mode setting
// ============================================================================

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy,
    Type, AlignLeft, Star, Hash, Calendar, Clock, Mail, Phone,
    List, ListOrdered, CheckSquare, ToggleLeft, Grid3X3,
    Settings2, HelpCircle, Sparkles,
    FileText, Users, Heart, Briefcase, PartyPopper, Baby,
    Shield, TrendingUp, MessageSquare,
    Send, Link2, Loader2, Check, ExternalLink
} from 'lucide-react';
import { SurveySection, SurveyQuestion, QuestionType, SurveySettings } from '../types';

// ============================================================================
// QUESTION TYPE DEFINITIONS
// ============================================================================

interface QuestionTypeConfig {
    type: QuestionType;
    name: string;
    icon: typeof Type;
    description: string;
    category: 'basic' | 'choice' | 'input' | 'advanced';
    defaultOptions?: boolean;
}

const QUESTION_TYPES: QuestionTypeConfig[] = [
    // Basic
    { type: 'multiple_choice', name: 'Multiple Choice', icon: CheckSquare, description: 'Select one or more options', category: 'choice', defaultOptions: true },
    { type: 'dropdown', name: 'Dropdown', icon: List, description: 'Select from a dropdown menu', category: 'choice', defaultOptions: true },
    { type: 'yes_no', name: 'Yes / No', icon: ToggleLeft, description: 'Simple yes or no question', category: 'basic' },
    { type: 'rating', name: 'Star Rating', icon: Star, description: 'Rate 1-5 stars', category: 'basic' },
    
    // Input
    { type: 'text', name: 'Short Text', icon: Type, description: 'Single line text input', category: 'input' },
    { type: 'textarea', name: 'Long Text', icon: AlignLeft, description: 'Multi-line text input', category: 'input' },
    { type: 'number', name: 'Number', icon: Hash, description: 'Numeric input', category: 'input' },
    { type: 'email', name: 'Email', icon: Mail, description: 'Email address input', category: 'input' },
    { type: 'phone', name: 'Phone', icon: Phone, description: 'Phone number input', category: 'input' },
    
    // Advanced
    { type: 'scale', name: 'Scale', icon: ListOrdered, description: 'Numeric scale (1-10)', category: 'advanced' },
    { type: 'ranking', name: 'Ranking', icon: ListOrdered, description: 'Drag to rank options', category: 'advanced', defaultOptions: true },
    { type: 'date', name: 'Date', icon: Calendar, description: 'Date picker', category: 'advanced' },
    { type: 'time', name: 'Time', icon: Clock, description: 'Time picker', category: 'advanced' },
    { type: 'datetime', name: 'Date & Time', icon: Calendar, description: 'Date and time picker', category: 'advanced' },
    { type: 'matrix', name: 'Matrix / Grid', icon: Grid3X3, description: 'Grid with rows and columns', category: 'advanced' },
];

// ============================================================================
// SURVEY TEMPLATES
// ============================================================================

interface SurveyTemplate {
    id: string;
    name: string;
    icon: typeof Heart;
    color: string;
    description: string;
    sections: SurveySection[];
    recommendedSettings?: Partial<SurveySettings>;
}

const SURVEY_TEMPLATES: SurveyTemplate[] = [
    // ========== NEW: EMPLOYEE ENGAGEMENT ==========
    {
        id: 'employee-engagement',
        name: 'Employee Engagement',
        icon: Users,
        color: 'text-emerald-600',
        description: 'Measure team satisfaction, growth, and culture',
        recommendedSettings: {
            anonymousMode: true,
            showProgress: true,
            allowBack: true,
        },
        sections: [
            {
                id: 'ee-satisfaction',
                title: 'Overall Satisfaction',
                description: 'How do you feel about your role?',
                questions: [
                    {
                        id: 'ee-q1',
                        type: 'scale',
                        question: 'How likely are you to recommend this company as a great place to work?',
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                        required: true,
                    },
                    {
                        id: 'ee-q2',
                        type: 'rating',
                        question: 'How satisfied are you with your current role?',
                        required: true,
                    },
                    {
                        id: 'ee-q3',
                        type: 'multiple_choice',
                        question: 'How long do you see yourself working here?',
                        options: [
                            { id: 'less-1', text: 'Less than 1 year' },
                            { id: '1-2', text: '1-2 years' },
                            { id: '3-5', text: '3-5 years' },
                            { id: '5-plus', text: '5+ years' },
                            { id: 'unsure', text: 'Not sure' },
                        ],
                        required: true,
                    },
                ]
            },
            {
                id: 'ee-growth',
                title: 'Growth & Development',
                description: 'Your opportunities for learning',
                questions: [
                    {
                        id: 'ee-q4',
                        type: 'scale',
                        question: 'I have opportunities to grow and develop in my role',
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                        required: true,
                    },
                    {
                        id: 'ee-q5',
                        type: 'scale',
                        question: 'I receive regular feedback that helps me improve',
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                        required: true,
                    },
                    {
                        id: 'ee-q6',
                        type: 'multiple_choice',
                        question: 'What would help you grow most?',
                        options: [
                            { id: 'training', text: 'More training opportunities' },
                            { id: 'mentorship', text: 'Mentorship program' },
                            { id: 'feedback', text: 'More frequent feedback' },
                            { id: 'projects', text: 'Challenging projects' },
                            { id: 'promotion', text: 'Clear promotion path' },
                        ],
                        allowMultiple: true,
                    },
                ]
            },
            {
                id: 'ee-culture',
                title: 'Team & Culture',
                description: 'Your workplace experience',
                questions: [
                    {
                        id: 'ee-q7',
                        type: 'rating',
                        question: 'How would you rate team collaboration?',
                        required: true,
                    },
                    {
                        id: 'ee-q8',
                        type: 'scale',
                        question: 'I feel valued and recognized for my contributions',
                        minValue: 1,
                        maxValue: 5,
                        minLabel: 'Strongly disagree',
                        maxLabel: 'Strongly agree',
                        required: true,
                    },
                ]
            },
            {
                id: 'ee-feedback',
                title: 'Open Feedback',
                description: 'Share your thoughts (anonymous)',
                questions: [
                    {
                        id: 'ee-q9',
                        type: 'textarea',
                        question: 'What do you love most about working here?',
                        placeholder: 'Share what makes this a great place to work...',
                    },
                    {
                        id: 'ee-q10',
                        type: 'textarea',
                        question: 'What is one thing we could do better?',
                        placeholder: 'Your honest feedback helps us improve...',
                    },
                ]
            },
        ],
    },
    // ========== NEW: CUSTOMER SATISFACTION (CSAT) ==========
    {
        id: 'customer-satisfaction',
        name: 'Customer Satisfaction',
        icon: Star,
        color: 'text-blue-600',
        description: 'Measure NPS and collect customer feedback',
        recommendedSettings: {
            anonymousMode: false,
            showProgress: true,
            allowBack: true,
        },
        sections: [
            {
                id: 'csat-nps',
                title: 'Overall Experience',
                description: 'Tell us about your experience',
                questions: [
                    {
                        id: 'csat-q1',
                        type: 'scale',
                        question: 'How likely are you to recommend us to a friend or colleague?',
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                        required: true,
                    },
                    {
                        id: 'csat-q2',
                        type: 'rating',
                        question: 'How satisfied are you with our product/service overall?',
                        required: true,
                    },
                ]
            },
            {
                id: 'csat-details',
                title: 'Specific Feedback',
                description: 'Help us understand what matters',
                questions: [
                    {
                        id: 'csat-q3',
                        type: 'rating',
                        question: 'How would you rate the quality of our product/service?',
                        required: true,
                    },
                    {
                        id: 'csat-q4',
                        type: 'rating',
                        question: 'How would you rate our customer support?',
                    },
                    {
                        id: 'csat-q5',
                        type: 'multiple_choice',
                        question: 'What do you like most about us?',
                        options: [
                            { id: 'quality', text: 'Product quality' },
                            { id: 'price', text: 'Competitive pricing' },
                            { id: 'support', text: 'Customer support' },
                            { id: 'ease', text: 'Ease of use' },
                            { id: 'reliability', text: 'Reliability' },
                        ],
                        allowMultiple: true,
                    },
                ]
            },
            {
                id: 'csat-improve',
                title: 'How Can We Improve?',
                description: 'Your feedback shapes our roadmap',
                questions: [
                    {
                        id: 'csat-q6',
                        type: 'textarea',
                        question: 'What is the main reason for your score?',
                        placeholder: 'Tell us more...',
                    },
                    {
                        id: 'csat-q7',
                        type: 'textarea',
                        question: 'What is one thing you wish we did differently?',
                        placeholder: 'Your suggestion...',
                    },
                ]
            },
        ],
    },
    // ========== NEW: QUICK NPS ==========
    {
        id: 'nps-quick',
        name: 'Quick NPS Survey',
        icon: TrendingUp,
        color: 'text-indigo-600',
        description: 'Simple NPS with one follow-up',
        sections: [
            {
                id: 'nps',
                title: 'Quick Feedback',
                questions: [
                    {
                        id: 'nps-q1',
                        type: 'scale',
                        question: 'How likely are you to recommend us to a friend or colleague?',
                        minValue: 0,
                        maxValue: 10,
                        minLabel: 'Not at all likely',
                        maxLabel: 'Extremely likely',
                        required: true,
                    },
                    {
                        id: 'nps-q2',
                        type: 'textarea',
                        question: 'What is the main reason for your score?',
                        placeholder: 'Tell us more...',
                    },
                ]
            },
        ],
    },
    // ========== NEW: POST-PURCHASE ==========
    {
        id: 'post-purchase',
        name: 'Post-Purchase Feedback',
        icon: MessageSquare,
        color: 'text-amber-600',
        description: 'Collect feedback after purchase',
        sections: [
            {
                id: 'pp-experience',
                title: 'Your Purchase Experience',
                questions: [
                    {
                        id: 'pp-q1',
                        type: 'rating',
                        question: 'How was your overall shopping experience?',
                        required: true,
                    },
                    {
                        id: 'pp-q2',
                        type: 'rating',
                        question: 'How easy was it to find what you were looking for?',
                        required: true,
                    },
                    {
                        id: 'pp-q3',
                        type: 'yes_no',
                        question: 'Would you buy from us again?',
                    },
                ]
            },
            {
                id: 'pp-comments',
                title: 'Additional Comments',
                questions: [
                    {
                        id: 'pp-q4',
                        type: 'textarea',
                        question: 'Any other feedback or suggestions?',
                        placeholder: 'We appreciate your thoughts...',
                    },
                ]
            },
        ],
    },
    // ========== EXISTING: WEDDING RSVP ==========
    {
        id: 'wedding',
        name: 'Wedding RSVP',
        icon: Heart,
        color: 'text-pink-500',
        description: 'Attendance, meal preferences, song requests',
        sections: [
            {
                id: 'attendance',
                title: 'Attendance',
                description: 'Please let us know if you can make it',
                questions: [
                    { id: 'q1', type: 'yes_no', question: 'Will you be attending?', required: true },
                    { id: 'q2', type: 'number', question: 'Number of guests (including yourself)', min: 1, max: 10, required: true },
                ]
            },
            {
                id: 'meals',
                title: 'Meal Preferences',
                description: 'Help us plan the menu',
                questions: [
                    { id: 'q3', type: 'multiple_choice', question: 'Entree preference', options: [
                        { id: 'beef', text: 'Beef' },
                        { id: 'chicken', text: 'Chicken' },
                        { id: 'fish', text: 'Fish' },
                        { id: 'vegetarian', text: 'Vegetarian' },
                    ], required: true },
                    { id: 'q4', type: 'textarea', question: 'Any dietary restrictions or allergies?', placeholder: 'Please list any allergies or dietary needs...' },
                ]
            },
            {
                id: 'celebration',
                title: 'Celebration',
                description: 'Help us make it special',
                questions: [
                    { id: 'q5', type: 'text', question: 'Request a song for the dance floor', placeholder: 'Song title - Artist' },
                    { id: 'q6', type: 'textarea', question: 'Leave a message for the couple (optional)', placeholder: 'Your well wishes...' },
                ]
            }
        ]
    },
    // ========== EXISTING: TEAM FEEDBACK ==========
    {
        id: 'corporate',
        name: 'Team Feedback',
        icon: Briefcase,
        color: 'text-blue-500',
        description: 'Meeting feedback, project surveys',
        sections: [
            {
                id: 'overall',
                title: 'Overall Experience',
                questions: [
                    { id: 'q1', type: 'rating', question: 'How would you rate the meeting overall?', required: true },
                    { id: 'q2', type: 'scale', question: 'How productive was this meeting?', minValue: 1, maxValue: 10, minLabel: 'Not productive', maxLabel: 'Very productive', required: true },
                ]
            },
            {
                id: 'details',
                title: 'Specific Feedback',
                questions: [
                    { id: 'q3', type: 'multiple_choice', question: 'What worked well?', options: [
                        { id: 'agenda', text: 'Clear agenda' },
                        { id: 'time', text: 'Good time management' },
                        { id: 'discussion', text: 'Productive discussion' },
                        { id: 'decisions', text: 'Clear decisions made' },
                    ], allowMultiple: true },
                    { id: 'q4', type: 'textarea', question: 'What could be improved?', placeholder: 'Your suggestions...' },
                ]
            }
        ]
    },
    // ========== EXISTING: PARTY PLANNING ==========
    {
        id: 'party',
        name: 'Party Planning',
        icon: PartyPopper,
        color: 'text-amber-500',
        description: 'Event RSVP, preferences, activities',
        sections: [
            {
                id: 'rsvp',
                title: 'RSVP',
                questions: [
                    { id: 'q1', type: 'multiple_choice', question: 'Can you make it?', options: [
                        { id: 'yes', text: 'Yes, count me in!' },
                        { id: 'maybe', text: 'Maybe, I will try' },
                        { id: 'no', text: 'Sorry, cannot make it' },
                    ], required: true },
                    { id: 'q2', type: 'number', question: 'How many people in your group?', min: 1, max: 5 },
                ]
            },
            {
                id: 'preferences',
                title: 'Preferences',
                questions: [
                    { id: 'q3', type: 'ranking', question: 'Rank these activities (most excited to least)', options: [
                        { id: 'games', text: 'Party games' },
                        { id: 'music', text: 'Dancing / Music' },
                        { id: 'food', text: 'Food & Drinks' },
                        { id: 'photos', text: 'Photo booth' },
                    ] },
                ]
            }
        ]
    },
    // ========== EXISTING: BABY SHOWER ==========
    {
        id: 'babyshower',
        name: 'Baby Shower',
        icon: Baby,
        color: 'text-purple-500',
        description: 'Gender guesses, name suggestions, gifts',
        sections: [
            {
                id: 'guesses',
                title: 'Your Guesses',
                questions: [
                    { id: 'q1', type: 'multiple_choice', question: 'What do you think it will be?', options: [
                        { id: 'boy', text: 'Boy' },
                        { id: 'girl', text: 'Girl' },
                        { id: 'surprise', text: 'Keeping it a surprise!' },
                    ], required: true },
                    { id: 'q2', type: 'date', question: 'Guess the due date' },
                ]
            },
            {
                id: 'names',
                title: 'Name Suggestions',
                questions: [
                    { id: 'q3', type: 'text', question: 'Suggest a baby name', placeholder: 'Your favorite name...' },
                    { id: 'q4', type: 'textarea', question: 'Parenting advice or wishes', placeholder: 'Share your wisdom...' },
                ]
            }
        ]
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = () => Math.random().toString(36).substring(2, 9);

const createDefaultQuestion = (type: QuestionType): SurveyQuestion => {
    const config = QUESTION_TYPES.find(t => t.type === type);
    const base: SurveyQuestion = {
        id: generateId(),
        type,
        question: '',
        required: false,
    };
    
    if (config?.defaultOptions) {
        base.options = [
            { id: generateId(), text: 'Option 1' },
            { id: generateId(), text: 'Option 2' },
        ];
    }
    
    if (type === 'rating') {
        base.minValue = 1;
        base.maxValue = 5;
    }
    
    if (type === 'scale') {
        base.minValue = 1;
        base.maxValue = 10;
        base.minLabel = 'Low';
        base.maxLabel = 'High';
    }
    
    if (type === 'matrix') {
        base.rows = [
            { id: generateId(), text: 'Row 1' },
            { id: generateId(), text: 'Row 2' },
        ];
        base.columns = [
            { id: generateId(), text: 'Column 1' },
            { id: generateId(), text: 'Column 2' },
            { id: generateId(), text: 'Column 3' },
        ];
    }
    
    return base;
};

const createDefaultSection = (): SurveySection => ({
    id: generateId(),
    title: 'New Section',
    description: '',
    questions: [createDefaultQuestion('multiple_choice')],
});

// ============================================================================
// QUESTION EDITOR COMPONENT
// ============================================================================

interface QuestionEditorProps {
    question: SurveyQuestion;
    onChange: (updated: SurveyQuestion) => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
    question,
    onChange,
    onDelete,
    onDuplicate
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const typeConfig = QUESTION_TYPES.find(t => t.type === question.type);
    const TypeIcon = typeConfig?.icon || Type;
    
    const updateQuestion = (updates: Partial<SurveyQuestion>) => {
        onChange({ ...question, ...updates });
    };
    
    const addOption = () => {
        const options = question.options || [];
        updateQuestion({
            options: [...options, { id: generateId(), text: `Option ${options.length + 1}` }]
        });
    };
    
    const updateOption = (optionId: string, text: string) => {
        const options = (question.options || []).map(opt =>
            opt.id === optionId ? { ...opt, text } : opt
        );
        updateQuestion({ options });
    };
    
    const removeOption = (optionId: string) => {
        const options = (question.options || []).filter(opt => opt.id !== optionId);
        updateQuestion({ options });
    };
    
    return (
        <motion.div
            layout
            className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition"
        >
            {/* Question Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 border-b border-slate-200">
                <div className="cursor-grab hover:bg-slate-200 p-1.5 rounded">
                    <GripVertical size={16} className="text-slate-400" />
                </div>
                
                <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-lg border border-slate-200">
                    <TypeIcon size={14} className="text-indigo-600" />
                    <span className="text-xs font-medium text-slate-600">{typeConfig?.name}</span>
                </div>
                
                <div className="flex-1">
                    <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion({ question: e.target.value })}
                        placeholder="Enter your question..."
                        className="w-full bg-transparent font-medium text-slate-800 focus:outline-none"
                    />
                </div>
                
                <label className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={question.required || false}
                        onChange={(e) => updateQuestion({ required: e.target.checked })}
                        className="w-4 h-4 rounded accent-indigo-600"
                    />
                    <span className="text-xs font-medium text-slate-600">Required</span>
                </label>
                
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:bg-slate-200 rounded transition"
                >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                <button
                    onClick={onDuplicate}
                    className="p-1.5 hover:bg-slate-200 rounded transition text-slate-500"
                    title="Duplicate"
                >
                    <Copy size={16} />
                </button>
                
                <button
                    onClick={onDelete}
                    className="p-1.5 hover:bg-red-100 rounded transition text-slate-500 hover:text-red-600"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            
            {/* Question Body */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 space-y-4"
                    >
                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                Helper text (optional)
                            </label>
                            <input
                                type="text"
                                value={question.description || ''}
                                onChange={(e) => updateQuestion({ description: e.target.value })}
                                placeholder="Add helper text to guide respondents..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        
                        {/* Options for choice-based questions */}
                        {typeConfig?.defaultOptions && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-slate-500">Options</label>
                                    {question.type === 'multiple_choice' && (
                                        <label className="flex items-center gap-2 text-xs">
                                            <input
                                                type="checkbox"
                                                checked={question.allowMultiple || false}
                                                onChange={(e) => updateQuestion({ allowMultiple: e.target.checked })}
                                                className="w-3.5 h-3.5 rounded"
                                            />
                                            <span className="text-slate-600">Allow multiple</span>
                                        </label>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {(question.options || []).map((option, idx) => (
                                        <div key={option.id} className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center text-xs text-slate-400 bg-slate-100 rounded">
                                                {idx + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => updateOption(option.id, e.target.value)}
                                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => removeOption(option.id)}
                                                disabled={(question.options?.length || 0) <= 2}
                                                className="p-1.5 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addOption}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    >
                                        <Plus size={14} /> Add option
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Rating settings */}
                        {question.type === 'rating' && (
                            <div className="flex items-center gap-4">
                                <label className="text-xs font-medium text-slate-500">Max stars:</label>
                                <select
                                    value={question.maxValue || 5}
                                    onChange={(e) => updateQuestion({ maxValue: Number(e.target.value) })}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value={5}>5 stars</option>
                                    <option value={10}>10 stars</option>
                                </select>
                            </div>
                        )}
                        
                        {/* Scale settings */}
                        {question.type === 'scale' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Min value</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={question.minValue || 1}
                                            onChange={(e) => updateQuestion({ minValue: Number(e.target.value) })}
                                            className="w-16 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={question.minLabel || ''}
                                            onChange={(e) => updateQuestion({ minLabel: e.target.value })}
                                            placeholder="Label (e.g., Not satisfied)"
                                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Max value</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={question.maxValue || 10}
                                            onChange={(e) => updateQuestion({ maxValue: Number(e.target.value) })}
                                            className="w-16 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={question.maxLabel || ''}
                                            onChange={(e) => updateQuestion({ maxLabel: e.target.value })}
                                            placeholder="Label (e.g., Very satisfied)"
                                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Number settings */}
                        {question.type === 'number' && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Min</label>
                                    <input
                                        type="number"
                                        value={question.min ?? ''}
                                        onChange={(e) => updateQuestion({ min: e.target.value ? Number(e.target.value) : undefined })}
                                        placeholder="No min"
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Max</label>
                                    <input
                                        type="number"
                                        value={question.max ?? ''}
                                        onChange={(e) => updateQuestion({ max: e.target.value ? Number(e.target.value) : undefined })}
                                        placeholder="No max"
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                                    <input
                                        type="text"
                                        value={question.unit || ''}
                                        onChange={(e) => updateQuestion({ unit: e.target.value })}
                                        placeholder="e.g., guests"
                                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Text settings */}
                        {(question.type === 'text' || question.type === 'textarea') && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Placeholder</label>
                                <input
                                    type="text"
                                    value={question.placeholder || ''}
                                    onChange={(e) => updateQuestion({ placeholder: e.target.value })}
                                    placeholder="Enter placeholder text..."
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================================================
// SECTION EDITOR COMPONENT
// ============================================================================

interface SectionEditorProps {
    section: SurveySection;
    sectionIndex: number;
    totalSections: number;
    onChange: (updated: SurveySection) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    canAddQuestion: boolean;
    questionLimitMessage?: string;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
    section,
    sectionIndex,
    totalSections,
    onChange,
    onDelete,
    onDuplicate,
    canAddQuestion,
    questionLimitMessage
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showQuestionPicker, setShowQuestionPicker] = useState(false);
    
    const updateSection = (updates: Partial<SurveySection>) => {
        onChange({ ...section, ...updates });
    };
    
    const addQuestion = (type: QuestionType) => {
        if (!canAddQuestion) return;
        updateSection({
            questions: [...section.questions, createDefaultQuestion(type)]
        });
        setShowQuestionPicker(false);
    };
    
    const updateQuestion = (questionId: string, updated: SurveyQuestion) => {
        updateSection({
            questions: section.questions.map(q => q.id === questionId ? updated : q)
        });
    };
    
    const deleteQuestion = (questionId: string) => {
        updateSection({
            questions: section.questions.filter(q => q.id !== questionId)
        });
    };
    
    const duplicateQuestion = (questionId: string) => {
        const original = section.questions.find(q => q.id === questionId);
        if (original) {
            const copy = { ...original, id: generateId(), question: `${original.question} (copy)` };
            const idx = section.questions.findIndex(q => q.id === questionId);
            const newQuestions = [...section.questions];
            newQuestions.splice(idx + 1, 0, copy);
            updateSection({ questions: newQuestions });
        }
    };
    
    return (
        <motion.div
            layout
            className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl overflow-hidden"
        >
            {/* Section Header */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <div className="cursor-grab hover:bg-white/20 p-1.5 rounded">
                    <GripVertical size={18} />
                </div>
                
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                    {sectionIndex + 1}
                </div>
                
                <div className="flex-1">
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection({ title: e.target.value })}
                        placeholder="Section title..."
                        className="w-full bg-transparent font-bold text-lg focus:outline-none placeholder-white/50"
                    />
                    <input
                        type="text"
                        value={section.description || ''}
                        onChange={(e) => updateSection({ description: e.target.value })}
                        placeholder="Add a description (optional)..."
                        className="w-full bg-transparent text-sm text-white/80 focus:outline-none placeholder-white/40 mt-1"
                    />
                </div>
                
                <span className="text-sm text-white/80 bg-white/20 px-2 py-1 rounded">
                    {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                </span>
                
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                    {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
                
                <button
                    onClick={onDuplicate}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Duplicate section"
                >
                    <Copy size={18} />
                </button>
                
                <button
                    onClick={onDelete}
                    disabled={totalSections <= 1}
                    className="p-2 hover:bg-red-500/50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Delete section"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            
            {/* Section Body */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 space-y-4"
                    >
                        {/* Questions */}
                        {section.questions.map((question) => (
                            <QuestionEditor
                                key={question.id}
                                question={question}
                                onChange={(updated) => updateQuestion(question.id, updated)}
                                onDelete={() => deleteQuestion(question.id)}
                                onDuplicate={() => duplicateQuestion(question.id)}
                            />
                        ))}
                        
                        {/* Add Question Button */}
                        <div className="relative">
                            {canAddQuestion ? (
                                <button
                                    onClick={() => setShowQuestionPicker(!showQuestionPicker)}
                                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} /> Add Question
                                </button>
                            ) : (
                                <div className="w-full py-3 px-4 border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl text-amber-600 flex items-center justify-center gap-2">
                                    <span className="text-sm font-medium">
                                        {questionLimitMessage || 'Question limit reached'}
                                    </span>
                                    <a 
                                        href="/pricing" 
                                        className="text-sm font-bold text-amber-700 hover:text-amber-800 underline"
                                    >
                                        Upgrade →
                                    </a>
                                </div>
                            )}
                            
                            {/* Question Type Picker */}
                            <AnimatePresence>
                                {showQuestionPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-20 p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-800">Choose Question Type</h4>
                                            <button
                                                onClick={() => setShowQuestionPicker(false)}
                                                className="p-1 hover:bg-slate-100 rounded"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                            {QUESTION_TYPES.map((qt) => {
                                                const Icon = qt.icon;
                                                return (
                                                    <button
                                                        key={qt.type}
                                                        onClick={() => addQuestion(qt.type)}
                                                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-indigo-50 text-left transition"
                                                    >
                                                        <Icon size={18} className="text-indigo-600 shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">{qt.name}</p>
                                                            <p className="text-xs text-slate-500">{qt.description}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================================================
// MAIN SURVEY BUILDER COMPONENT
// ============================================================================

interface SurveyBuilderProps {
    initialSections?: SurveySection[];
    initialSettings?: SurveySettings;
    onChange?: (sections: SurveySection[], settings: SurveySettings) => void;
    tier?: string;
}

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({
    initialSections,
    initialSettings,
    onChange,
    tier = 'free'
}) => {
    const [sections, setSections] = useState<SurveySection[]>(
        initialSections || [createDefaultSection()]
    );
    const [settings, setSettings] = useState<SurveySettings>(
        initialSettings || { allowBack: true, showProgress: true }
    );
    const [showTemplates, setShowTemplates] = useState(!initialSections);
    const [showSettings, setShowSettings] = useState(false);
    
    // Publishing state
    const [surveyTitle, setSurveyTitle] = useState('');
    const [surveyDescription, setSurveyDescription] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [createdSurvey, setCreatedSurvey] = useState<{ id: string; adminKey: string } | null>(null);
    const [copiedLink, setCopiedLink] = useState(false);
    
    // Get subscription tier from localStorage if not passed
    const subscriptionTier = tier || (typeof window !== 'undefined' 
        ? (localStorage.getItem('vg_subscription_tier') || 'free') 
        : 'free');
    
    // Question limits by tier (TOTAL questions across all sections)
    // Free: 10 questions | Pro: 25 questions | Business: Unlimited
    const maxQuestions = subscriptionTier === 'business' ? Infinity : subscriptionTier === 'pro' ? 25 : 10;
    const maxSections = subscriptionTier === 'business' ? Infinity : subscriptionTier === 'pro' ? 10 : 3;
    
    // Calculate total questions
    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
    const canAddQuestion = totalQuestions < maxQuestions;
    
    // Notify parent of changes
    const handleChange = useCallback((newSections: SurveySection[], newSettings: SurveySettings) => {
        setSections(newSections);
        setSettings(newSettings);
        onChange?.(newSections, newSettings);
    }, [onChange]);
    
    const updateSections = (newSections: SurveySection[]) => {
        handleChange(newSections, settings);
    };
    
    const updateSettings = (newSettings: SurveySettings) => {
        handleChange(sections, newSettings);
    };
    
    const addSection = () => {
        if (sections.length >= maxSections) return;
        updateSections([...sections, createDefaultSection()]);
    };
    
    const updateSection = (sectionId: string, updated: SurveySection) => {
        updateSections(sections.map(s => s.id === sectionId ? updated : s));
    };
    
    const deleteSection = (sectionId: string) => {
        if (sections.length <= 1) return;
        updateSections(sections.filter(s => s.id !== sectionId));
    };
    
    const duplicateSection = (sectionId: string) => {
        if (sections.length >= maxSections) return;
        const original = sections.find(s => s.id === sectionId);
        if (original) {
            const copy: SurveySection = {
                ...original,
                id: generateId(),
                title: `${original.title} (copy)`,
                questions: original.questions.map(q => ({ ...q, id: generateId() }))
            };
            const idx = sections.findIndex(s => s.id === sectionId);
            const newSections = [...sections];
            newSections.splice(idx + 1, 0, copy);
            updateSections(newSections);
        }
    };
    
    const applyTemplate = (template: SurveyTemplate) => {
        // Apply the template sections
        updateSections(template.sections.map(s => ({
            ...s,
            id: generateId(),
            questions: s.questions.map(q => ({ ...q, id: generateId() }))
        })));
        
        // Apply recommended settings if available
        if (template.recommendedSettings) {
            updateSettings({ ...settings, ...template.recommendedSettings });
        }
        
        setShowTemplates(false);
    };
    
    // Publish survey
    const handlePublish = async () => {
        if (!surveyTitle.trim()) {
            setPublishError('Please enter a survey title');
            return;
        }
        if (totalQuestions === 0) {
            setPublishError('Please add at least one question');
            return;
        }
        
        setIsPublishing(true);
        setPublishError(null);
        
        try {
            const pollData = {
                title: surveyTitle,
                description: surveyDescription,
                pollType: 'survey',
                isSurvey: true,
                options: [],
                sections,
                surveySettings: settings,
                settings: {
                    hideResults: false,
                    allowMultiple: false,
                    anonymousMode: settings.anonymousMode || false,
                },
                tier: subscriptionTier,
            };
            
            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollData),
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create survey');
            }
            
            const result = await response.json();
            setCreatedSurvey({ id: result.id, adminKey: result.adminKey });
            
            // Save to localStorage
            const existingPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
            existingPolls.push({
                id: result.id,
                adminKey: result.adminKey,
                title: surveyTitle,
                type: 'survey',
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem('vg_polls', JSON.stringify(existingPolls));
            
        } catch (err: any) {
            setPublishError(err.message || 'Failed to create survey');
        } finally {
            setIsPublishing(false);
        }
    };
    
    // Copy link
    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };
    
    // Can publish check
    const canPublish = surveyTitle.trim() !== '' && totalQuestions > 0;
    
    // Ad countdown state for free tier
    const [adCountdown, setAdCountdown] = useState(10);
    const [adComplete, setAdComplete] = useState(subscriptionTier !== 'free');
    
    // Ad countdown effect
    useEffect(() => {
        if (createdSurvey && subscriptionTier === 'free' && adCountdown > 0) {
            const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (adCountdown === 0) {
            setAdComplete(true);
        }
    }, [createdSurvey, adCountdown, subscriptionTier]);
    
    // If survey was created, show success with ad wall for free users
    if (createdSurvey) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Ad Wall for Free Users */}
                {subscriptionTier === 'free' && !adComplete && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 text-center">
                        <div className="text-amber-600 font-semibold mb-2">
                            🎉 Survey Published Successfully!
                        </div>
                        <p className="text-slate-600 mb-4">
                            Please wait while we prepare your share link...
                        </p>
                        {/* Ad placeholder */}
                        <div className="bg-white rounded-xl border border-amber-200 p-8 mb-4">
                            <div className="text-slate-400 text-sm">Advertisement</div>
                            <div className="h-32 flex items-center justify-center text-slate-300">
                                [Ad Space - 300x250]
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                            <Loader2 size={16} className="animate-spin" />
                            Continue in {adCountdown} seconds...
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            <a href="/pricing" className="text-indigo-600 hover:underline">Upgrade to Pro</a> to skip ads
                        </p>
                    </div>
                )}
                
                {/* Success Card - shown after ad or immediately for paid */}
                {adComplete && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} className="text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Survey Published! 🎉</h2>
                        <p className="text-slate-600 mb-8">Share the link below with your respondents</p>
                        
                        {/* Share Link */}
                        <div className="bg-white rounded-xl border-2 border-slate-200 p-4 mb-6">
                            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                                Share Link
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/#survey=${createdSurvey.id}`}
                                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono"
                                />
                                <button
                                    onClick={() => copyLink(`${window.location.origin}/#survey=${createdSurvey.id}`)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    {copiedLink ? <Check size={16} /> : <Link2 size={16} />}
                                    {copiedLink ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href={`/#survey=${createdSurvey.id}&admin=${createdSurvey.adminKey}`}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                <ExternalLink size={18} />
                                View Results
                            </a>
                            <a
                                href="/admin"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                            >
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* ============================================ */}
            {/* TITLE & DESCRIPTION - AT THE TOP */}
            {/* ============================================ */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Survey Details</h3>
                        <p className="text-sm text-slate-500">Give your survey a title</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Survey Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={surveyTitle}
                            onChange={(e) => setSurveyTitle(e.target.value)}
                            placeholder="e.g., Employee Satisfaction Survey 2024"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Description (optional)
                        </label>
                        <textarea
                            value={surveyDescription}
                            onChange={(e) => setSurveyDescription(e.target.value)}
                            placeholder="Tell respondents what this survey is about..."
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
            
            {/* Header Stats & Actions */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Stats */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-indigo-100">
                            <FileText size={18} className="text-indigo-600" />
                            <span className="font-semibold text-indigo-600">
                                {sections.length} Section{sections.length !== 1 ? 's' : ''}
                            </span>
                            {maxSections !== Infinity && (
                                <span className="text-xs text-indigo-400">/ {maxSections}</span>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border ${
                            totalQuestions >= maxQuestions ? 'border-amber-300 bg-amber-50' : 'border-purple-100'
                        }`}>
                            <HelpCircle size={18} className={totalQuestions >= maxQuestions ? 'text-amber-600' : 'text-purple-600'} />
                            <span className={`font-semibold ${totalQuestions >= maxQuestions ? 'text-amber-600' : 'text-purple-600'}`}>
                                {totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}
                            </span>
                            {maxQuestions !== Infinity && (
                                <span className={`text-xs ${totalQuestions >= maxQuestions ? 'text-amber-500' : 'text-purple-400'}`}>
                                    / {maxQuestions}
                                </span>
                            )}
                        </div>
                        {/* Anonymous Mode indicator */}
                        {settings.anonymousMode && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-xl shadow-sm border border-emerald-200">
                                <Shield size={18} className="text-emerald-600" />
                                <span className="font-semibold text-emerald-600">Anonymous</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition font-medium ${
                                showTemplates 
                                    ? 'bg-amber-500 text-white shadow-md' 
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                            }`}
                        >
                            <Sparkles size={16} /> Templates
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition font-medium ${
                                showSettings
                                    ? 'bg-slate-700 text-white shadow-md'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                        >
                            <Settings2 size={16} /> Settings
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing || !canPublish}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition font-medium ${
                                isPublishing || !canPublish
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                            }`}
                        >
                            {isPublishing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                            Publish
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Templates Panel */}
            <AnimatePresence>
                {showTemplates && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                                <Sparkles size={20} /> Choose a Template
                            </h3>
                            <button
                                onClick={() => setShowTemplates(false)}
                                className="text-amber-600 hover:text-amber-800 p-1"
                            >
                                <ChevronUp size={20} />
                            </button>
                        </div>
                        
                        {/* Template Grid - Larger Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Start from Scratch - Featured */}
                            <button
                                onClick={() => {
                                    updateSections([{
                                        id: generateId(),
                                        title: 'Section 1',
                                        questions: []
                                    }]);
                                    setShowTemplates(false);
                                }}
                                className="p-5 bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-lg transition-all flex flex-col items-center gap-3 text-center group"
                            >
                                <div className="w-14 h-14 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition">
                                    <Plus size={28} className="text-slate-500 group-hover:text-indigo-600" />
                                </div>
                                <div>
                                    <span className="font-bold text-slate-800 text-base block">Blank Survey</span>
                                    <span className="text-sm text-slate-500">Build your own from scratch</span>
                                </div>
                            </button>
                            
                            {/* Template cards */}
                            {SURVEY_TEMPLATES.map((template) => {
                                const Icon = template.icon;
                                const questionCount = template.sections.reduce((sum, s) => sum + s.questions.length, 0);
                                const bgColor = template.color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100');
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template)}
                                        className="p-5 bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col items-center gap-3 text-center group relative"
                                    >
                                        {/* Anonymous badge for templates that recommend it */}
                                        {template.recommendedSettings?.anonymousMode && (
                                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                                                <Shield size={10} /> Anonymous
                                            </div>
                                        )}
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bgColor}`}>
                                            <Icon size={28} className={template.color} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-base block">{template.name}</span>
                                            <span className="text-sm text-slate-500">
                                                {template.sections.length} section{template.sections.length > 1 ? 's' : ''} - {questionCount} question{questionCount > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <p className="text-xs text-amber-600 mt-5 text-center">
                            Templates give you a head start - you can always customize them later
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Settings Panel - UPDATED WITH ANONYMOUS MODE */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Settings2 size={18} /> Survey Settings
                            </h3>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-slate-600 hover:text-slate-800"
                            >
                                <ChevronUp size={18} />
                            </button>
                        </div>
                        
                        {/* Basic Settings */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <label className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={settings.allowBack ?? true}
                                    onChange={(e) => updateSettings({ ...settings, allowBack: e.target.checked })}
                                    className="w-5 h-5 rounded accent-indigo-600"
                                />
                                <div>
                                    <p className="font-medium text-slate-800">Allow going back</p>
                                    <p className="text-xs text-slate-500">Navigate to previous sections</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={settings.showProgress ?? true}
                                    onChange={(e) => updateSettings({ ...settings, showProgress: e.target.checked })}
                                    className="w-5 h-5 rounded accent-indigo-600"
                                />
                                <div>
                                    <p className="font-medium text-slate-800">Show progress</p>
                                    <p className="text-xs text-slate-500">Display progress bar</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={settings.showSummary ?? false}
                                    onChange={(e) => updateSettings({ ...settings, showSummary: e.target.checked })}
                                    className="w-5 h-5 rounded accent-indigo-600"
                                />
                                <div>
                                    <p className="font-medium text-slate-800">Show summary</p>
                                    <p className="text-xs text-slate-500">Review before submitting</p>
                                </div>
                            </label>
                        </div>
                        
                        {/* Anonymous Mode Toggle - NEW */}
                        <div className={`p-4 rounded-xl border-2 transition-all mb-4 ${
                            settings.anonymousMode 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-white border-slate-200'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield size={18} className={settings.anonymousMode ? 'text-emerald-600' : 'text-slate-400'} />
                                        <span className="font-semibold text-slate-800">Anonymous Mode</span>
                                        {settings.anonymousMode && (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">ON</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">
                                        Hide individual responses from your view. You will only see aggregated results.
                                    </p>
                                    
                                    {settings.anonymousMode && (
                                        <div className="space-y-1 text-xs text-emerald-700 bg-emerald-100/50 p-2 rounded-lg">
                                            <p>Individual responses hidden from admin view</p>
                                            <p>Respondents see &quot;Your response is anonymous&quot; badge</p>
                                            <p>Open-ended feedback shown in random order</p>
                                        </div>
                                    )}
                                </div>
                                
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.anonymousMode ?? false}
                                        onChange={(e) => updateSettings({ ...settings, anonymousMode: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-11 h-6 rounded-full transition-colors ${
                                        settings.anonymousMode ? 'bg-emerald-500' : 'bg-slate-300'
                                    }`}>
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                            settings.anonymousMode ? 'translate-x-[22px]' : 'translate-x-0.5'
                                        }`} />
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        {/* Completion Message */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Completion message
                            </label>
                            <input
                                type="text"
                                value={settings.completionMessage || ''}
                                onChange={(e) => updateSettings({ ...settings, completionMessage: e.target.value })}
                                placeholder="Thank you for your response!"
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Sections */}
            <div className="space-y-6">
                {sections.map((section, index) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        sectionIndex={index}
                        totalSections={sections.length}
                        onChange={(updated) => updateSection(section.id, updated)}
                        onDelete={() => deleteSection(section.id)}
                        onDuplicate={() => duplicateSection(section.id)}
                        canAddQuestion={canAddQuestion}
                        questionLimitMessage={
                            maxQuestions !== Infinity 
                                ? `Question limit reached (${totalQuestions}/${maxQuestions})` 
                                : undefined
                        }
                    />
                ))}
            </div>
            
            {/* Add Section Button */}
            {sections.length < maxSections && (
                <button
                    onClick={addSection}
                    className="w-full py-4 border-2 border-dashed border-indigo-300 rounded-2xl text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 transition flex items-center justify-center gap-2 font-semibold"
                >
                    <Plus size={20} /> Add Section
                </button>
            )}
            
            {/* Upgrade prompt */}
            {sections.length >= maxSections && maxSections !== Infinity && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <p className="text-amber-800 font-medium">
                        You have reached the section limit for your plan.
                    </p>
                    <a href="/pricing" className="text-amber-600 hover:underline text-sm">
                        Upgrade for unlimited sections
                    </a>
                </div>
            )}
            
            {/* ============================================ */}
            {/* STICKY PUBLISH BUTTON AT BOTTOM */}
            {/* ============================================ */}
            {!showTemplates && (
                <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 -mx-4 px-4 mt-8">
                    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-4 shadow-lg">
                        {/* Error */}
                        {publishError && (
                            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {publishError}
                            </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Status */}
                            <div className="text-sm text-slate-600">
                                {!surveyTitle.trim() && (
                                    <span className="text-amber-600 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Enter a survey title above
                                    </span>
                                )}
                                {surveyTitle.trim() && totalQuestions === 0 && (
                                    <span className="text-amber-600 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Add at least one question
                                    </span>
                                )}
                                {surveyTitle.trim() && totalQuestions > 0 && (
                                    <span className="text-emerald-600 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                        Ready to publish ({sections.length} section{sections.length !== 1 ? 's' : ''}, {totalQuestions} question{totalQuestions !== 1 ? 's' : ''})
                                    </span>
                                )}
                            </div>
                            
                            {/* Publish Button */}
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing || !canPublish}
                                className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition ${
                                    isPublishing || !canPublish
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Publish Survey
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurveyBuilder;
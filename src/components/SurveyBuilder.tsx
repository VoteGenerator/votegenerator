// ============================================================================
// SurveyBuilder - Multi-Section Poll/Survey Creator
// Location: src/components/SurveyBuilder.tsx
// Features: Drag-drop sections, multiple question types, conditional logic
// ============================================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Copy,
    Type, AlignLeft, Star, Hash, Calendar, Clock, Mail, Phone,
    List, ListOrdered, CheckSquare, ToggleLeft, Grid3X3, Upload,
    Settings2, Eye, EyeOff, HelpCircle, Sparkles, ChevronRight,
    FileText, Users, Heart, Briefcase, PartyPopper, Baby
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
    disabled?: boolean;
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
    { type: 'file', name: 'File Upload', icon: Upload, description: 'Coming Soon', category: 'advanced', disabled: true },
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
}

const SURVEY_TEMPLATES: SurveyTemplate[] = [
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
                    { id: 'q3', type: 'multiple_choice', question: 'Entrée preference', options: [
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
                        { id: 'yes', text: '🎉 Yes, count me in!' },
                        { id: 'maybe', text: '🤔 Maybe, I\'ll try' },
                        { id: 'no', text: '😢 Sorry, can\'t make it' },
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
                        { id: 'boy', text: '💙 Boy' },
                        { id: 'girl', text: '💗 Girl' },
                        { id: 'surprise', text: '✨ Keeping it a surprise!' },
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
}

const SectionEditor: React.FC<SectionEditorProps> = ({
    section,
    sectionIndex,
    totalSections,
    onChange,
    onDelete,
    onDuplicate
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showQuestionPicker, setShowQuestionPicker] = useState(false);
    
    const updateSection = (updates: Partial<SurveySection>) => {
        onChange({ ...section, ...updates });
    };
    
    const addQuestion = (type: QuestionType) => {
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
                            <button
                                onClick={() => setShowQuestionPicker(!showQuestionPicker)}
                                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add Question
                            </button>
                            
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
                                                        onClick={() => !qt.disabled && addQuestion(qt.type)}
                                                        disabled={qt.disabled}
                                                        className={`flex items-center gap-2 p-3 rounded-lg text-left transition relative ${
                                                            qt.disabled 
                                                                ? 'opacity-50 cursor-not-allowed bg-slate-50' 
                                                                : 'hover:bg-indigo-50'
                                                        }`}
                                                    >
                                                        {qt.disabled && (
                                                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-bold rounded">
                                                                SOON
                                                            </span>
                                                        )}
                                                        <Icon size={18} className={qt.disabled ? 'text-slate-400 shrink-0' : 'text-indigo-600 shrink-0'} />
                                                        <div>
                                                            <p className={`text-sm font-medium ${qt.disabled ? 'text-slate-500' : 'text-slate-800'}`}>{qt.name}</p>
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
    
    // Tier limits
    const maxSections = tier === 'free' ? 1 : tier === 'starter' ? 3 : Infinity;
    const maxQuestionsPerSection = tier === 'free' ? 3 : tier === 'starter' ? 5 : Infinity;
    
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
        updateSections(template.sections.map(s => ({
            ...s,
            id: generateId(),
            questions: s.questions.map(q => ({ ...q, id: generateId() }))
        })));
        setShowTemplates(false);
    };
    
    // Calculate totals
    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
    
    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl">
                        <FileText size={18} className="text-indigo-600" />
                        <span className="font-semibold text-indigo-600">
                            {sections.length} Section{sections.length !== 1 ? 's' : ''}
                        </span>
                        {maxSections !== Infinity && (
                            <span className="text-xs text-indigo-400">/ {maxSections} max</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl">
                        <HelpCircle size={18} className="text-purple-600" />
                        <span className="font-semibold text-purple-600">
                            {totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition"
                    >
                        <Sparkles size={16} /> Templates
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                    >
                        <Settings2 size={16} /> Settings
                    </button>
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-amber-800 flex items-center gap-2">
                                <Sparkles size={18} /> Start from a Template
                            </h3>
                            <button
                                onClick={() => setShowTemplates(false)}
                                className="text-amber-600 hover:text-amber-800"
                            >
                                <ChevronUp size={18} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {SURVEY_TEMPLATES.map((template) => {
                                const Icon = template.icon;
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template)}
                                        className="p-4 bg-white rounded-xl border-2 border-amber-100 hover:border-amber-300 hover:shadow-md transition text-left"
                                    >
                                        <Icon size={24} className={template.color} />
                                        <h4 className="font-semibold text-slate-800 mt-2">{template.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                                        <p className="text-xs text-amber-600 mt-2">
                                            {template.sections.length} sections • {template.sections.reduce((sum, s) => sum + s.questions.length, 0)} questions
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Settings Panel */}
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
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        
                        <div className="mt-4">
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
                        You've reached the section limit for your plan.
                    </p>
                    <a href="/pricing" className="text-amber-600 hover:underline text-sm">
                        Upgrade for unlimited sections →
                    </a>
                </div>
            )}
        </div>
    );
};

export default SurveyBuilder;
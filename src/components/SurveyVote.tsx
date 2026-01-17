// ============================================================================
// SurveyVote - Multi-Section Survey Response Flow
// Location: src/components/SurveyVote.tsx
// Features: Section navigation, progress bar, answer validation, local save
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Check, Star, AlertCircle,
    Calendar, Clock, Upload, Loader2, Send, Shield, Play,
    FileText, Users
} from 'lucide-react';
import {
    Poll, SurveySection, SurveyQuestion, SurveyAnswer,
    SurveyResponse, QuestionType
} from '../types';

// ============================================================================
// QUESTION RENDERERS
// ============================================================================

interface QuestionProps {
    question: SurveyQuestion;
    answer: SurveyAnswer | undefined;
    onChange: (answer: SurveyAnswer) => void;
    error?: string;
}

// Multiple Choice / Dropdown
const MultipleChoiceQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const selectedIds = answer?.selectedIds || [];
    
    const toggleOption = (optionId: string) => {
        let newSelected: string[];
        if (question.allowMultiple) {
            newSelected = selectedIds.includes(optionId)
                ? selectedIds.filter(id => id !== optionId)
                : [...selectedIds, optionId];
        } else {
            newSelected = [optionId];
        }
        onChange({
            questionId: question.id,
            questionType: question.type,
            selectedIds: newSelected,
        });
    };
    
    if (question.type === 'dropdown') {
        return (
            <select
                value={selectedIds[0] || ''}
                onChange={(e) => onChange({
                    questionId: question.id,
                    questionType: question.type,
                    selectedIds: e.target.value ? [e.target.value] : [],
                })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
            >
                <option value="">Select an option...</option>
                {question.options?.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.text}</option>
                ))}
            </select>
        );
    }
    
    return (
        <div className="space-y-3">
            {question.options?.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                            isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-${question.allowMultiple ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                        }`}>
                            {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <span className="text-lg">{opt.text}</span>
                    </button>
                );
            })}
        </div>
    );
};

// Yes/No Question
const YesNoQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const selected = answer?.selectedIds?.[0];
    
    const options = [
        { id: 'yes', text: 'Yes', emoji: '✓' },
        { id: 'no', text: 'No', emoji: '✗' },
    ];
    
    return (
        <div className="flex gap-4">
            {options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => onChange({
                            questionId: question.id,
                            questionType: question.type,
                            selectedIds: [opt.id],
                        })}
                        className={`flex-1 p-6 rounded-xl border-2 text-center transition ${
                            isSelected
                                ? opt.id === 'yes'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-red-500 bg-red-50 text-red-700'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        <span className="text-3xl mb-2 block">{isSelected ? opt.emoji : ''}</span>
                        <span className="text-xl font-semibold">{opt.text}</span>
                    </button>
                );
            })}
        </div>
    );
};

// Rating Question (Stars)
const RatingQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const rating = answer?.number || 0;
    const maxStars = question.maxValue || 5;
    
    return (
        <div className="flex items-center justify-center gap-2">
            {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange({
                        questionId: question.id,
                        questionType: question.type,
                        number: star,
                    })}
                    className="p-1 transition-transform hover:scale-110"
                >
                    <Star
                        size={40}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                </button>
            ))}
            {rating > 0 && (
                <span className="ml-4 text-2xl font-bold text-amber-600">{rating}/{maxStars}</span>
            )}
        </div>
    );
};

// Scale Question
const ScaleQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const value = answer?.number;
    const min = question.minValue || 1;
    const max = question.maxValue || 10;
    
    return (
        <div>
            <div className="flex justify-between text-sm text-slate-500 mb-3">
                <span>{question.minLabel || min}</span>
                <span>{question.maxLabel || max}</span>
            </div>
            <div className="flex gap-2">
                {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => {
                    const isSelected = value === num;
                    return (
                        <button
                            key={num}
                            type="button"
                            onClick={() => onChange({
                                questionId: question.id,
                                questionType: question.type,
                                number: num,
                            })}
                            className={`flex-1 py-3 rounded-xl border-2 font-semibold transition ${
                                isSelected
                                    ? 'border-indigo-500 bg-indigo-500 text-white'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Text Question
const TextQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const isTextarea = question.type === 'textarea';
    
    const Component = isTextarea ? 'textarea' : 'input';
    
    return (
        <Component
            type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text'}
            value={answer?.text || ''}
            onChange={(e) => onChange({
                questionId: question.id,
                questionType: question.type,
                text: e.target.value,
            })}
            placeholder={question.placeholder || 'Enter your answer...'}
            rows={isTextarea ? 4 : undefined}
            maxLength={question.maxLength}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none resize-none"
        />
    );
};

// Number Question
const NumberQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    return (
        <div className="flex items-center gap-3">
            <input
                type="number"
                value={answer?.number ?? ''}
                onChange={(e) => onChange({
                    questionId: question.id,
                    questionType: question.type,
                    number: e.target.value ? Number(e.target.value) : undefined,
                })}
                min={question.min}
                max={question.max}
                step={question.step || 1}
                placeholder="Enter a number..."
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
            />
            {question.unit && (
                <span className="text-lg text-slate-500">{question.unit}</span>
            )}
        </div>
    );
};

// Date/Time Question
const DateTimeQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const inputType = question.type === 'date' ? 'date' : question.type === 'time' ? 'time' : 'datetime-local';
    
    return (
        <div className="relative">
            <input
                type={inputType}
                value={question.type === 'time' ? answer?.time || '' : answer?.date || ''}
                onChange={(e) => onChange({
                    questionId: question.id,
                    questionType: question.type,
                    ...(question.type === 'time' ? { time: e.target.value } : { date: e.target.value }),
                })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
            />
        </div>
    );
};

// Ranking Question
const RankingQuestion: React.FC<QuestionProps> = ({ question, answer, onChange }) => {
    const ranking = answer?.ranking || question.options?.map(o => o.id) || [];
    
    const moveItem = (fromIndex: number, toIndex: number) => {
        const newRanking = [...ranking];
        const [removed] = newRanking.splice(fromIndex, 1);
        newRanking.splice(toIndex, 0, removed);
        onChange({
            questionId: question.id,
            questionType: question.type,
            ranking: newRanking,
        });
    };
    
    return (
        <div className="space-y-2">
            <p className="text-sm text-slate-500 mb-3">Drag to reorder (1 = highest rank)</p>
            {ranking.map((optionId, index) => {
                const option = question.options?.find(o => o.id === optionId);
                if (!option) return null;
                return (
                    <div
                        key={optionId}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl"
                    >
                        <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold">
                            {index + 1}
                        </span>
                        <span className="flex-1 text-lg">{option.text}</span>
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => index > 0 && moveItem(index, index - 1)}
                                disabled={index === 0}
                                className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                            >
                                <ChevronLeft size={16} className="rotate-90" />
                            </button>
                            <button
                                type="button"
                                onClick={() => index < ranking.length - 1 && moveItem(index, index + 1)}
                                disabled={index === ranking.length - 1}
                                className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                            >
                                <ChevronRight size={16} className="rotate-90" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Question Renderer
const QuestionRenderer: React.FC<QuestionProps> = (props) => {
    const { question } = props;
    
    switch (question.type) {
        case 'multiple_choice':
        case 'dropdown':
            return <MultipleChoiceQuestion {...props} />;
        case 'yes_no':
            return <YesNoQuestion {...props} />;
        case 'rating':
            return <RatingQuestion {...props} />;
        case 'scale':
            return <ScaleQuestion {...props} />;
        case 'text':
        case 'textarea':
        case 'email':
        case 'phone':
            return <TextQuestion {...props} />;
        case 'number':
            return <NumberQuestion {...props} />;
        case 'date':
        case 'time':
        case 'datetime':
            return <DateTimeQuestion {...props} />;
        case 'ranking':
            return <RankingQuestion {...props} />;
        default:
            return <div className="text-slate-500">Unsupported question type: {question.type}</div>;
    }
};

// ============================================================================
// MAIN SURVEY VOTE COMPONENT
// ============================================================================

interface SurveyVoteProps {
    poll: Poll;
    onSubmit: (response: SurveyResponse) => Promise<void>;
    voterName?: string;
}

const SurveyVote: React.FC<SurveyVoteProps> = ({ poll, onSubmit, voterName }) => {
    const sections = poll.sections || [];
    const settings = poll.surveySettings || {};
    
    // Check if welcome screen should be shown (has content to show)
    const hasWelcomeContent = settings.welcomeMessage || settings.estimatedTime || settings.logoUrl || settings.showAnonymousNotice;
    
    const [showWelcome, setShowWelcome] = useState(hasWelcomeContent);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, SurveyAnswer>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null); // Track when survey actually starts
    
    const currentSection = sections[currentSectionIndex];
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === sections.length - 1;
    
    // Load saved progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`survey_progress_${poll.id}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setAnswers(parsed.answers || {});
                setCurrentSectionIndex(parsed.sectionIndex || 0);
            } catch (e) {
                // Ignore invalid saved data
            }
        }
    }, [poll.id]);
    
    // Save progress to localStorage
    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            localStorage.setItem(`survey_progress_${poll.id}`, JSON.stringify({
                answers,
                sectionIndex: currentSectionIndex,
                lastUpdated: new Date().toISOString(),
            }));
        }
    }, [answers, currentSectionIndex, poll.id]);
    
    // Calculate progress
    const totalQuestions = useMemo(() => 
        sections.reduce((sum, s) => sum + s.questions.length, 0),
        [sections]
    );
    
    const answeredQuestions = useMemo(() => 
        Object.keys(answers).length,
        [answers]
    );
    
    const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    
    // Validate current section
    const validateSection = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        currentSection?.questions.forEach((q) => {
            if (q.required) {
                const answer = answers[q.id];
                let isValid = false;
                
                if (answer) {
                    switch (q.type) {
                        case 'multiple_choice':
                        case 'dropdown':
                        case 'yes_no':
                            isValid = (answer.selectedIds?.length || 0) > 0;
                            break;
                        case 'rating':
                        case 'scale':
                        case 'number':
                            isValid = answer.number !== undefined && answer.number !== null;
                            break;
                        case 'text':
                        case 'textarea':
                        case 'email':
                        case 'phone':
                            isValid = (answer.text?.trim().length || 0) > 0;
                            break;
                        case 'date':
                        case 'datetime':
                            isValid = !!answer.date;
                            break;
                        case 'time':
                            isValid = !!answer.time;
                            break;
                        case 'ranking':
                            isValid = (answer.ranking?.length || 0) > 0;
                            break;
                        default:
                            isValid = true;
                    }
                }
                
                if (!isValid) {
                    newErrors[q.id] = 'This question is required';
                }
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle answer change
    const handleAnswerChange = (answer: SurveyAnswer) => {
        setAnswers(prev => ({ ...prev, [answer.questionId]: answer }));
        // Clear error when answered
        if (errors[answer.questionId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[answer.questionId];
                return newErrors;
            });
        }
    };
    
    // Navigation
    const goNext = () => {
        if (!validateSection()) return;
        
        if (isLastSection) {
            if (settings.showSummary) {
                setShowSummary(true);
            } else {
                handleSubmit();
            }
        } else {
            setCurrentSectionIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    const goBack = () => {
        if (showSummary) {
            setShowSummary(false);
        } else if (!isFirstSection && settings.allowBack !== false) {
            setCurrentSectionIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // Submit
    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            const response: SurveyResponse = {
                id: Math.random().toString(36).substring(2, 9),
                pollId: poll.id,
                respondentId: localStorage.getItem('vg_respondent_id') || Math.random().toString(36).substring(2, 15),
                voterName,
                submittedAt: new Date().toISOString(),
                startedAt: startTime || new Date().toISOString(),
                completionTime: startTime ? Math.round((Date.now() - new Date(startTime).getTime()) / 1000) : 0,
                answers,
                isComplete: true,
            };
            
            // Store respondent ID for future
            if (!localStorage.getItem('vg_respondent_id')) {
                localStorage.setItem('vg_respondent_id', response.respondentId!);
            }
            
            await onSubmit(response);
            
            // Clear saved progress
            localStorage.removeItem(`survey_progress_${poll.id}`);
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handler to start survey from welcome screen
    const handleStartSurvey = () => {
        setStartTime(new Date().toISOString()); // Start timing when they click start
        setShowWelcome(false);
    };
    
    // Render Welcome Screen
    if (showWelcome) {
        const themeColor = settings.themeColor || '#6366f1';
        const bgColor = settings.backgroundColor || '#f8fafc';
        
        return (
            <div 
                className="min-h-[60vh] flex items-center justify-center p-4"
                style={{ backgroundColor: bgColor }}
            >
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg w-full"
                >
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Logo */}
                        {settings.logoUrl && (
                            <div className="p-6 flex justify-center bg-slate-50 border-b border-slate-100">
                                <img 
                                    src={settings.logoUrl} 
                                    alt="Survey logo" 
                                    className="max-h-16 max-w-[200px] object-contain"
                                />
                            </div>
                        )}
                        
                        {/* Header */}
                        <div 
                            className="p-8 text-center"
                            style={{ 
                                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                            }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {poll.title || 'Survey'}
                            </h1>
                            {poll.description && (
                                <p className="text-white/80">{poll.description}</p>
                            )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-8 space-y-6">
                            {/* Welcome Message */}
                            {settings.welcomeMessage && (
                                <div className="text-center">
                                    <p className="text-slate-600 text-lg leading-relaxed">
                                        {settings.welcomeMessage}
                                    </p>
                                </div>
                            )}
                            
                            {/* Info Cards */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                {settings.estimatedTime && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                                        <Clock size={16} className="text-slate-500" />
                                        <span className="text-sm text-slate-600">
                                            ~{settings.estimatedTime} min
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                                    <FileText size={16} className="text-slate-500" />
                                    <span className="text-sm text-slate-600">
                                        {sections.reduce((sum, s) => sum + (s.questions?.length || 0), 0)} questions
                                    </span>
                                </div>
                            </div>
                            
                            {/* Privacy Notice */}
                            {settings.showAnonymousNotice !== false && (
                                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <Shield size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-emerald-800">
                                            Your responses are anonymous
                                        </p>
                                        <p className="text-xs text-emerald-600 mt-1">
                                            We don't collect email addresses or track individual identities.
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Start Button */}
                            <button
                                onClick={handleStartSurvey}
                                className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3"
                                style={{ backgroundColor: themeColor }}
                            >
                                <Play size={20} />
                                {settings.startButtonText || 'Start Survey'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    // Render Summary
    if (showSummary) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                        <h2 className="text-2xl font-bold">Review Your Answers</h2>
                        <p className="text-indigo-100 mt-1">Please review before submitting</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {sections.map((section) => (
                            <div key={section.id} className="border-b border-slate-200 pb-6 last:border-0">
                                <h3 className="font-bold text-slate-800 mb-4">{section.title}</h3>
                                {section.questions.map((q) => {
                                    const answer = answers[q.id];
                                    let displayAnswer = 'Not answered';
                                    
                                    if (answer) {
                                        if (answer.selectedIds?.length) {
                                            displayAnswer = answer.selectedIds
                                                .map(id => q.options?.find(o => o.id === id)?.text || id)
                                                .join(', ');
                                        } else if (answer.text) {
                                            displayAnswer = answer.text;
                                        } else if (answer.number !== undefined) {
                                            displayAnswer = String(answer.number);
                                        } else if (answer.date) {
                                            displayAnswer = answer.date;
                                        } else if (answer.ranking?.length) {
                                            displayAnswer = answer.ranking
                                                .map((id, i) => `${i + 1}. ${q.options?.find(o => o.id === id)?.text || id}`)
                                                .join(', ');
                                        }
                                    }
                                    
                                    return (
                                        <div key={q.id} className="mb-3">
                                            <p className="text-sm text-slate-500">{q.question}</p>
                                            <p className="text-slate-800 font-medium">{displayAnswer}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                        <button
                            onClick={goBack}
                            className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition"
                        >
                            <ChevronLeft size={18} className="inline mr-1" /> Edit Answers
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                            ) : (
                                <><Send size={18} /> Submit Response</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Main Survey View
    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            {settings.showProgress !== false && (
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>Section {currentSectionIndex + 1} of {sections.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    {/* Section indicators */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {sections.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 rounded-full transition ${
                                    idx === currentSectionIndex
                                        ? 'bg-indigo-500 scale-125'
                                        : idx < currentSectionIndex
                                            ? 'bg-indigo-300'
                                            : 'bg-slate-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Section Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                >
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                        <h2 className="text-2xl font-bold">{currentSection?.title}</h2>
                        {currentSection?.description && (
                            <p className="text-indigo-100 mt-1">{currentSection.description}</p>
                        )}
                    </div>
                    
                    {/* Questions */}
                    <div className="p-6 space-y-8">
                        {currentSection?.questions.map((question, qIdx) => (
                            <div key={question.id} className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm shrink-0">
                                        {qIdx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {question.question}
                                            {question.required && (
                                                <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </h3>
                                        {question.description && (
                                            <p className="text-sm text-slate-500 mt-1">{question.description}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="ml-11">
                                    <QuestionRenderer
                                        question={question}
                                        answer={answers[question.id]}
                                        onChange={handleAnswerChange}
                                        error={errors[question.id]}
                                    />
                                    
                                    {errors[question.id] && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                                            <AlertCircle size={14} />
                                            {errors[question.id]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Navigation */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
                        {!isFirstSection && settings.allowBack !== false && (
                            <button
                                onClick={goBack}
                                className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} /> Back
                            </button>
                        )}
                        <button
                            onClick={goNext}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {isLastSection ? (
                                settings.showSummary ? 'Review Answers' : 'Submit'
                            ) : (
                                'Next'
                            )}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Save indicator */}
            <p className="text-center text-sm text-slate-400 mt-4">
                Your progress is saved automatically
            </p>
        </div>
    );
};

export default SurveyVote;
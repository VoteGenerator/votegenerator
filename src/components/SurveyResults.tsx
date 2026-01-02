// ============================================================================
// SurveyResults - Multi-Section Survey Results Display
// Location: src/components/SurveyResults.tsx
// Features: Per-question breakdown, charts, response details
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, PieChart, Users, Clock, Star, ChevronDown, ChevronRight,
    Download, Filter, Search, Eye, FileText, TrendingUp
} from 'lucide-react';
import {
    Poll, SurveySection, SurveyQuestion, SurveyResponse, SurveyAnswer
} from '../types';

// ============================================================================
// TYPES
// ============================================================================

interface QuestionStats {
    questionId: string;
    questionText: string;
    questionType: string;
    totalResponses: number;
    // For choice-based questions
    optionCounts?: Record<string, number>;
    // For numeric questions
    average?: number;
    min?: number;
    max?: number;
    distribution?: Record<number, number>;
    // For text questions
    textResponses?: string[];
    // For ranking questions
    rankingScores?: Record<string, number>; // Average rank per option
}

interface SectionStats {
    sectionId: string;
    sectionTitle: string;
    questions: QuestionStats[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculateQuestionStats = (
    question: SurveyQuestion,
    responses: SurveyResponse[]
): QuestionStats => {
    const answers = responses
        .map(r => r.answers[question.id])
        .filter(Boolean);
    
    const stats: QuestionStats = {
        questionId: question.id,
        questionText: question.question,
        questionType: question.type,
        totalResponses: answers.length,
    };
    
    switch (question.type) {
        case 'multiple_choice':
        case 'dropdown':
        case 'yes_no': {
            const counts: Record<string, number> = {};
            question.options?.forEach(opt => { counts[opt.id] = 0; });
            
            answers.forEach(a => {
                a.selectedIds?.forEach(id => {
                    counts[id] = (counts[id] || 0) + 1;
                });
            });
            
            stats.optionCounts = counts;
            break;
        }
        
        case 'rating':
        case 'scale':
        case 'number': {
            const numbers = answers.map(a => a.number).filter((n): n is number => n !== undefined);
            if (numbers.length > 0) {
                stats.average = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
                stats.min = Math.min(...numbers);
                stats.max = Math.max(...numbers);
                
                // Distribution for rating/scale
                if (question.type === 'rating' || question.type === 'scale') {
                    const dist: Record<number, number> = {};
                    numbers.forEach(n => { dist[n] = (dist[n] || 0) + 1; });
                    stats.distribution = dist;
                }
            }
            break;
        }
        
        case 'text':
        case 'textarea':
        case 'email':
        case 'phone': {
            stats.textResponses = answers
                .map(a => a.text)
                .filter((t): t is string => !!t);
            break;
        }
        
        case 'ranking': {
            const scores: Record<string, number[]> = {};
            question.options?.forEach(opt => { scores[opt.id] = []; });
            
            answers.forEach(a => {
                a.ranking?.forEach((optId, idx) => {
                    if (scores[optId]) {
                        scores[optId].push(idx + 1); // 1-indexed rank
                    }
                });
            });
            
            stats.rankingScores = {};
            Object.entries(scores).forEach(([optId, ranks]) => {
                if (ranks.length > 0) {
                    stats.rankingScores![optId] = ranks.reduce((sum, r) => sum + r, 0) / ranks.length;
                }
            });
            break;
        }
    }
    
    return stats;
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

interface BarChartProps {
    data: { label: string; value: number; percentage: number }[];
    color?: string;
}

const SimpleBarChart: React.FC<BarChartProps> = ({ data, color = 'indigo' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 font-medium">{item.label}</span>
                        <span className="text-slate-500">{item.value} ({item.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / maxValue) * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`h-full bg-${color}-500 rounded-full`}
                            style={{ backgroundColor: `var(--color-${color}-500, #6366f1)` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Star Rating Display
const StarRatingDisplay: React.FC<{ average: number; max: number; count: number }> = ({ average, max, count }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                {Array.from({ length: max }, (_, i) => {
                    const filled = i < Math.floor(average);
                    const partial = !filled && i < average;
                    return (
                        <Star
                            key={i}
                            size={24}
                            className={filled ? 'fill-amber-400 text-amber-400' : partial ? 'fill-amber-200 text-amber-400' : 'text-slate-300'}
                        />
                    );
                })}
            </div>
            <span className="text-2xl font-bold text-amber-600">{average.toFixed(1)}</span>
            <span className="text-slate-500">/ {max} ({count} responses)</span>
        </div>
    );
};

// ============================================================================
// QUESTION RESULT COMPONENT
// ============================================================================

interface QuestionResultProps {
    stats: QuestionStats;
    question: SurveyQuestion;
}

const QuestionResult: React.FC<QuestionResultProps> = ({ stats, question }) => {
    const [showAllText, setShowAllText] = useState(false);
    
    const renderResult = () => {
        switch (question.type) {
            case 'multiple_choice':
            case 'dropdown':
            case 'yes_no': {
                const data = (question.options || []).map(opt => ({
                    label: opt.text,
                    value: stats.optionCounts?.[opt.id] || 0,
                    percentage: stats.totalResponses > 0 
                        ? ((stats.optionCounts?.[opt.id] || 0) / stats.totalResponses) * 100 
                        : 0,
                }));
                
                return <SimpleBarChart data={data} />;
            }
            
            case 'rating': {
                if (stats.average !== undefined) {
                    return (
                        <div className="space-y-4">
                            <StarRatingDisplay
                                average={stats.average}
                                max={question.maxValue || 5}
                                count={stats.totalResponses}
                            />
                            {stats.distribution && (
                                <div className="mt-4">
                                    <p className="text-sm text-slate-500 mb-2">Distribution</p>
                                    <SimpleBarChart
                                        data={Object.entries(stats.distribution)
                                            .sort((a, b) => Number(b[0]) - Number(a[0]))
                                            .map(([rating, count]) => ({
                                                label: `${rating} star${Number(rating) !== 1 ? 's' : ''}`,
                                                value: count,
                                                percentage: (count / stats.totalResponses) * 100,
                                            }))}
                                        color="amber"
                                    />
                                </div>
                            )}
                        </div>
                    );
                }
                return <p className="text-slate-500">No responses yet</p>;
            }
            
            case 'scale':
            case 'number': {
                if (stats.average !== undefined) {
                    return (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-indigo-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-indigo-600">Average</p>
                                <p className="text-2xl font-bold text-indigo-700">{stats.average.toFixed(1)}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-emerald-600">Minimum</p>
                                <p className="text-2xl font-bold text-emerald-700">{stats.min}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-amber-600">Maximum</p>
                                <p className="text-2xl font-bold text-amber-700">{stats.max}</p>
                            </div>
                        </div>
                    );
                }
                return <p className="text-slate-500">No responses yet</p>;
            }
            
            case 'text':
            case 'textarea':
            case 'email':
            case 'phone': {
                const texts = stats.textResponses || [];
                const displayTexts = showAllText ? texts : texts.slice(0, 5);
                
                return (
                    <div className="space-y-2">
                        {displayTexts.length > 0 ? (
                            <>
                                {displayTexts.map((text, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 rounded-lg text-slate-700">
                                        "{text}"
                                    </div>
                                ))}
                                {texts.length > 5 && (
                                    <button
                                        onClick={() => setShowAllText(!showAllText)}
                                        className="text-indigo-600 hover:underline text-sm"
                                    >
                                        {showAllText ? 'Show less' : `Show all ${texts.length} responses`}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-slate-500">No responses yet</p>
                        )}
                    </div>
                );
            }
            
            case 'ranking': {
                if (stats.rankingScores) {
                    const data = (question.options || [])
                        .map(opt => ({
                            label: opt.text,
                            avgRank: stats.rankingScores?.[opt.id] || 0,
                        }))
                        .sort((a, b) => a.avgRank - b.avgRank);
                    
                    return (
                        <div className="space-y-2">
                            {data.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${
                                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {idx + 1}
                                    </span>
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    <span className="text-slate-500 text-sm">
                                        Avg rank: {item.avgRank.toFixed(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                }
                return <p className="text-slate-500">No responses yet</p>;
            }
            
            default:
                return <p className="text-slate-500">Results not available for this question type</p>;
        }
    };
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm shrink-0">
                    <BarChart3 size={16} />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-800">{question.question}</h4>
                    <p className="text-sm text-slate-500">{stats.totalResponses} response{stats.totalResponses !== 1 ? 's' : ''}</p>
                </div>
            </div>
            {renderResult()}
        </div>
    );
};

// ============================================================================
// MAIN SURVEY RESULTS COMPONENT
// ============================================================================

interface SurveyResultsProps {
    poll: Poll;
    responses: SurveyResponse[];
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ poll, responses }) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(poll.sections?.map(s => s.id) || [])
    );
    const [viewMode, setViewMode] = useState<'summary' | 'individual'>('summary');
    
    // Calculate stats for all sections
    const sectionStats: SectionStats[] = useMemo(() => {
        return (poll.sections || []).map(section => ({
            sectionId: section.id,
            sectionTitle: section.title,
            questions: section.questions.map(q => calculateQuestionStats(q, responses)),
        }));
    }, [poll.sections, responses]);
    
    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };
    
    // Calculate overall stats
    const totalResponses = responses.length;
    const completeResponses = responses.filter(r => r.isComplete).length;
    const avgCompletionTime = responses
        .filter(r => r.completionTime)
        .reduce((sum, r) => sum + (r.completionTime || 0), 0) / (responses.filter(r => r.completionTime).length || 1);
    
    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-4 text-white">
                    <Users size={24} className="mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{totalResponses}</p>
                    <p className="text-indigo-100 text-sm">Total Responses</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
                    <FileText size={24} className="mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{completeResponses}</p>
                    <p className="text-emerald-100 text-sm">Complete</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                    <Clock size={24} className="mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{Math.round(avgCompletionTime / 60)}m</p>
                    <p className="text-amber-100 text-sm">Avg. Time</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-4 text-white">
                    <TrendingUp size={24} className="mb-2 opacity-80" />
                    <p className="text-3xl font-bold">
                        {totalResponses > 0 ? Math.round((completeResponses / totalResponses) * 100) : 0}%
                    </p>
                    <p className="text-pink-100 text-sm">Completion Rate</p>
                </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Results by Section</h2>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('summary')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            viewMode === 'summary' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'
                        }`}
                    >
                        <BarChart3 size={16} className="inline mr-1" /> Summary
                    </button>
                    <button
                        onClick={() => setViewMode('individual')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            viewMode === 'individual' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'
                        }`}
                    >
                        <Eye size={16} className="inline mr-1" /> Individual
                    </button>
                </div>
            </div>
            
            {/* Summary View */}
            {viewMode === 'summary' && (
                <div className="space-y-4">
                    {sectionStats.map((section, sIdx) => {
                        const isExpanded = expandedSections.has(section.sectionId);
                        const pollSection = poll.sections?.find(s => s.id === section.sectionId);
                        
                        return (
                            <div key={section.sectionId} className="border border-slate-200 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection(section.sectionId)}
                                    className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 transition text-left"
                                >
                                    <span className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-xl font-bold">
                                        {sIdx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800">{section.sectionTitle}</h3>
                                        <p className="text-sm text-slate-500">{section.questions.length} questions</p>
                                    </div>
                                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </button>
                                
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="p-4 space-y-4 bg-white"
                                        >
                                            {section.questions.map((qStats, qIdx) => {
                                                const question = pollSection?.questions[qIdx];
                                                if (!question) return null;
                                                return (
                                                    <QuestionResult
                                                        key={qStats.questionId}
                                                        stats={qStats}
                                                        question={question}
                                                    />
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* Individual Responses View */}
            {viewMode === 'individual' && (
                <div className="space-y-4">
                    {responses.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl">
                            <Users size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">No responses yet</p>
                        </div>
                    ) : (
                        responses.map((response, idx) => (
                            <div key={response.id} className="bg-white border border-slate-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-bold">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {response.voterName || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(response.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {response.completionTime && (
                                        <span className="text-sm text-slate-500">
                                            <Clock size={14} className="inline mr-1" />
                                            {Math.round(response.completionTime / 60)}m {response.completionTime % 60}s
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-3">
                                    {poll.sections?.map((section) => (
                                        <div key={section.id}>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                                {section.title}
                                            </p>
                                            {section.questions.map((q) => {
                                                const answer = response.answers[q.id];
                                                let displayAnswer = '—';
                                                
                                                if (answer) {
                                                    if (answer.selectedIds?.length) {
                                                        displayAnswer = answer.selectedIds
                                                            .map(id => q.options?.find(o => o.id === id)?.text || id)
                                                            .join(', ');
                                                    } else if (answer.text) {
                                                        displayAnswer = answer.text;
                                                    } else if (answer.number !== undefined) {
                                                        displayAnswer = q.type === 'rating' 
                                                            ? '⭐'.repeat(answer.number)
                                                            : String(answer.number);
                                                    } else if (answer.date) {
                                                        displayAnswer = answer.date;
                                                    }
                                                }
                                                
                                                return (
                                                    <div key={q.id} className="flex gap-4 py-2 border-b border-slate-100 last:border-0">
                                                        <p className="text-sm text-slate-500 flex-1">{q.question}</p>
                                                        <p className="text-sm font-medium text-slate-800">{displayAnswer}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SurveyResults;
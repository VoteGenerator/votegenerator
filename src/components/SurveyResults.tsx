// ============================================================================
// SurveyResults - Multi-Section Survey Results Display
// Location: src/components/SurveyResults.tsx
// Features: Per-question breakdown, charts, NPS calculation, Anonymous Mode
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Users, Clock, Star, ChevronDown, ChevronRight,
    Download, Eye, FileText, TrendingUp, TrendingDown,
    Shield, Lock, EyeOff, Info, Minus
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
    optionCounts?: Record<string, number>;
    average?: number;
    min?: number;
    max?: number;
    distribution?: Record<number, number>;
    textResponses?: string[];
    rankingScores?: Record<string, number>;
    npsData?: NPSData;
}

interface SectionStats {
    sectionId: string;
    sectionTitle: string;
    questions: QuestionStats[];
}

interface NPSData {
    promoters: number;
    passives: number;
    detractors: number;
    promoterPct: number;
    passivePct: number;
    detractorPct: number;
    score: number;
    total: number;
}

// ============================================================================
// NPS CALCULATION
// ============================================================================

const calculateNPS = (responses: number[]): NPSData | null => {
    const validResponses = responses.filter(r => r >= 0 && r <= 10);
    const total = validResponses.length;
    
    if (total === 0) return null;
    
    const promoters = validResponses.filter(r => r >= 9).length;
    const passives = validResponses.filter(r => r >= 7 && r <= 8).length;
    const detractors = validResponses.filter(r => r <= 6).length;
    
    const promoterPct = Math.round((promoters / total) * 100);
    const passivePct = Math.round((passives / total) * 100);
    const detractorPct = Math.round((detractors / total) * 100);
    
    return {
        promoters,
        passives,
        detractors,
        promoterPct,
        passivePct,
        detractorPct,
        score: promoterPct - detractorPct,
        total
    };
};

const isNPSQuestion = (questionText: string, questionType: string): boolean => {
    if (questionType !== 'scale') return false;
    const npsKeywords = ['recommend', 'likely to recommend', 'nps', 'net promoter', 'friend or colleague', 'refer'];
    const lowerText = questionText.toLowerCase();
    return npsKeywords.some(keyword => lowerText.includes(keyword));
};

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
                
                if (question.type === 'rating' || question.type === 'scale') {
                    const dist: Record<number, number> = {};
                    numbers.forEach(n => { dist[n] = (dist[n] || 0) + 1; });
                    stats.distribution = dist;
                }
                
                if (question.type === 'scale' && isNPSQuestion(question.question, question.type)) {
                    stats.npsData = calculateNPS(numbers) || undefined;
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
                        scores[optId].push(idx + 1);
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
// NPS DISPLAY COMPONENT
// ============================================================================

interface NPSDisplayProps {
    data: NPSData;
    questionText?: string;
}

const NPSDisplay: React.FC<NPSDisplayProps> = ({ data }) => {
    const getScoreInfo = (score: number) => {
        if (score >= 70) return { label: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: TrendingUp };
        if (score >= 30) return { label: 'Great', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: TrendingUp };
        if (score >= 0) return { label: 'Good', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: Minus };
        return { label: 'Needs Work', color: 'text-red-600', bgColor: 'bg-red-50', icon: TrendingDown };
    };

    const scoreInfo = getScoreInfo(data.score);
    const ScoreIcon = scoreInfo.icon;

    return (
        <div className={`rounded-2xl border-2 border-blue-200 ${scoreInfo.bgColor} overflow-hidden`}>
            <div className="p-4 border-b border-white/50 bg-white/50">
                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    <span className="font-bold text-slate-800">Net Promoter Score</span>
                    <span className="text-sm text-slate-500 ml-auto">{data.total} responses</span>
                </div>
            </div>

            <div className="p-6 text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="inline-flex flex-col items-center"
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-5xl font-black ${scoreInfo.color}`}>
                            {data.score > 0 ? '+' : ''}{data.score}
                        </span>
                        <ScoreIcon size={28} className={scoreInfo.color} />
                    </div>
                    <div className={`mt-2 px-3 py-1 rounded-full ${scoreInfo.bgColor} ${scoreInfo.color} font-semibold text-sm`}>
                        {scoreInfo.label}
                    </div>
                </motion.div>
            </div>

            <div className="px-6 pb-4">
                <div className="flex h-3 rounded-full overflow-hidden mb-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.promoterPct}%` }}
                        transition={{ duration: 0.6 }}
                        className="bg-emerald-500"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.passivePct}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-amber-400"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.detractorPct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-red-400"
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-slate-600 text-xs">Promoters</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">{data.promoterPct}%</p>
                        <p className="text-xs text-slate-500">{data.promoters} (9-10)</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                            <span className="text-slate-600 text-xs">Passives</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">{data.passivePct}%</p>
                        <p className="text-xs text-slate-500">{data.passives} (7-8)</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                            <span className="text-slate-600 text-xs">Detractors</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">{data.detractorPct}%</p>
                        <p className="text-xs text-slate-500">{data.detractors} (0-6)</p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Info size={12} />
                    NPS = % Promoters - % Detractors (Range: -100 to +100)
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// ANONYMOUS MODE COMPONENTS
// ============================================================================

const AnonymousModeNotice: React.FC<{ responseCount: number }> = ({ responseCount }) => {
    return (
        <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-emerald-800 mb-1">Anonymous Mode Active</h3>
                    <p className="text-sm text-emerald-700 mb-3">
                        Individual responses are hidden to protect respondent privacy. 
                        You are viewing aggregated data only.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-emerald-600">
                        <span className="flex items-center gap-1">
                            <Users size={14} />
                            {responseCount} responses
                        </span>
                        <span className="flex items-center gap-1">
                            <EyeOff size={14} />
                            Individual view disabled
                        </span>
                        <span className="flex items-center gap-1">
                            <Lock size={14} />
                            Timestamps hidden
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnonymousTextResponses: React.FC<{ responses: string[]; questionText: string }> = ({ responses }) => {
    const shuffledResponses = useMemo(() => {
        const filtered = responses.filter(r => r && r.trim().length > 0);
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [responses]);

    if (shuffledResponses.length === 0) return null;

    return (
        <div className="mt-4">
            <p className="text-sm text-slate-500 flex items-center gap-2 mb-3">
                <Shield size={14} className="text-emerald-500" />
                {shuffledResponses.length} responses shown in random order
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {shuffledResponses.map((text, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-slate-700 text-sm">
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
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
    
    const getColorClass = (c: string) => {
        const colors: Record<string, string> = {
            indigo: '#6366f1',
            emerald: '#10b981',
            blue: '#3b82f6',
            amber: '#f59e0b',
        };
        return colors[c] || colors.indigo;
    };
    
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
                            className="h-full rounded-full"
                            style={{ backgroundColor: getColorClass(color) }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

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
    isAnonymous?: boolean;
}

const QuestionResult: React.FC<QuestionResultProps> = ({ stats, question, isAnonymous = false }) => {
    const renderResult = () => {
        switch (question.type) {
            case 'multiple_choice':
            case 'dropdown':
            case 'yes_no': {
                if (!stats.optionCounts) return null;
                const total = Object.values(stats.optionCounts).reduce((sum, v) => sum + v, 0);
                const data = (question.options || []).map(opt => ({
                    label: opt.text,
                    value: stats.optionCounts![opt.id] || 0,
                    percentage: total > 0 ? ((stats.optionCounts![opt.id] || 0) / total) * 100 : 0,
                }));
                return <SimpleBarChart data={data} />;
            }
            
            case 'rating': {
                if (stats.average === undefined) return <p className="text-slate-500">No responses yet</p>;
                return (
                    <div>
                        <StarRatingDisplay average={stats.average} max={5} count={stats.totalResponses} />
                        {stats.distribution && (
                            <div className="mt-4 space-y-2">
                                {[5, 4, 3, 2, 1].map(rating => {
                                    const count = stats.distribution![rating] || 0;
                                    const pct = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                                    return (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-sm text-slate-500 w-8">{rating} <Star size={12} className="inline text-amber-400" /></span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    className="h-full bg-amber-400 rounded-full"
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 w-12 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }
            
            case 'scale': {
                if (stats.average === undefined) return <p className="text-slate-500">No responses yet</p>;
                
                if (stats.npsData) {
                    return <NPSDisplay data={stats.npsData} />;
                }
                
                const scaleMax = question.maxValue || 10;
                const scaleMin = question.minValue || 1;
                
                return (
                    <div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-4xl font-bold text-indigo-600">{stats.average.toFixed(1)}</span>
                            <span className="text-slate-500">/ {scaleMax} average</span>
                        </div>
                        {stats.distribution && (
                            <div className="space-y-1">
                                {Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMax - i).map(num => {
                                    const count = stats.distribution![num] || 0;
                                    const pct = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                                    return (
                                        <div key={num} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 w-4">{num}</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    className="h-full bg-indigo-500 rounded-full"
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }
            
            case 'number': {
                if (stats.average === undefined) return <p className="text-slate-500">No responses yet</p>;
                return (
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-2xl font-bold text-slate-800">{stats.average.toFixed(1)}</p>
                            <p className="text-sm text-slate-500">Average</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-2xl font-bold text-slate-800">{stats.min}</p>
                            <p className="text-sm text-slate-500">Min</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-2xl font-bold text-slate-800">{stats.max}</p>
                            <p className="text-sm text-slate-500">Max</p>
                        </div>
                    </div>
                );
            }
            
            case 'text':
            case 'textarea':
            case 'email':
            case 'phone': {
                if (!stats.textResponses?.length) return <p className="text-slate-500">No responses yet</p>;
                
                if (isAnonymous) {
                    return <AnonymousTextResponses responses={stats.textResponses} questionText={question.question} />;
                }
                
                return (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {stats.textResponses.map((text, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg text-slate-700">
                                {text}
                            </div>
                        ))}
                    </div>
                );
            }
            
            case 'ranking': {
                if (!stats.rankingScores || !question.options) return <p className="text-slate-500">No responses yet</p>;
                const sortedOptions = [...question.options].sort((a, b) => 
                    (stats.rankingScores![a.id] || Infinity) - (stats.rankingScores![b.id] || Infinity)
                );
                return (
                    <div className="space-y-2">
                        {sortedOptions.map((opt, idx) => (
                            <div key={opt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    idx === 0 ? 'bg-amber-100 text-amber-700' : 
                                    idx === 1 ? 'bg-slate-200 text-slate-600' :
                                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                    #{idx + 1}
                                </span>
                                <span className="flex-1 font-medium text-slate-700">{opt.text}</span>
                                <span className="text-sm text-slate-500">
                                    Avg rank: {stats.rankingScores![opt.id]?.toFixed(1) || '-'}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            }
            
            default:
                return <p className="text-slate-500">Question type not supported for display</p>;
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BarChart3 size={16} className="text-indigo-600" />
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
    const isAnonymous = poll.settings?.anonymousMode === true;
    
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(poll.sections?.map(s => s.id) || [])
    );
    const [viewMode, setViewMode] = useState<'summary' | 'individual'>('summary');
    
    useEffect(() => {
        if (isAnonymous && viewMode === 'individual') {
            setViewMode('summary');
        }
    }, [isAnonymous, viewMode]);
    
    const sectionStats: SectionStats[] = useMemo(() => {
        return (poll.sections || []).map(section => ({
            sectionId: section.id,
            sectionTitle: section.title,
            questions: section.questions.map(q => calculateQuestionStats(q, responses)),
        }));
    }, [poll.sections, responses]);
    
    const npsQuestions = useMemo(() => {
        const npsData: { sectionTitle: string; questionText: string; nps: NPSData }[] = [];
        sectionStats.forEach(section => {
            section.questions.forEach(q => {
                if (q.npsData) {
                    npsData.push({
                        sectionTitle: section.sectionTitle,
                        questionText: q.questionText,
                        nps: q.npsData
                    });
                }
            });
        });
        return npsData;
    }, [sectionStats]);
    
    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };
    
    const totalResponses = responses.length;
    const completeResponses = responses.filter(r => r.isComplete).length;
    const avgCompletionTime = responses
        .filter(r => r.completionTime)
        .reduce((sum, r) => sum + (r.completionTime || 0), 0) / (responses.filter(r => r.completionTime).length || 1);
    
    return (
        <div className="space-y-6">
            {isAnonymous && <AnonymousModeNotice responseCount={totalResponses} />}
            
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
            
            {/* NPS Summary */}
            {npsQuestions.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        NPS Overview
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {npsQuestions.map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-blue-100">
                                <p className="text-xs text-slate-500 mb-1">{item.sectionTitle}</p>
                                <p className="text-sm font-medium text-slate-700 mb-3 line-clamp-2">{item.questionText}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-3xl font-black ${
                                        item.nps.score >= 30 ? 'text-emerald-600' :
                                        item.nps.score >= 0 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                        {item.nps.score > 0 ? '+' : ''}{item.nps.score}
                                    </span>
                                    <div className="flex h-2 w-24 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500" style={{ width: `${item.nps.promoterPct}%` }} />
                                        <div className="bg-amber-400" style={{ width: `${item.nps.passivePct}%` }} />
                                        <div className="bg-red-400" style={{ width: `${item.nps.detractorPct}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
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
                        onClick={() => !isAnonymous && setViewMode('individual')}
                        disabled={isAnonymous}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                            viewMode === 'individual' && !isAnonymous 
                                ? 'bg-white shadow text-indigo-600' 
                                : isAnonymous 
                                    ? 'text-slate-400 cursor-not-allowed' 
                                    : 'text-slate-600'
                        }`}
                        title={isAnonymous ? 'Disabled: Anonymous mode is active' : undefined}
                    >
                        <Eye size={16} /> Individual
                        {isAnonymous && <Lock size={12} />}
                    </button>
                </div>
            </div>
            
            {/* Section Results */}
            {viewMode === 'summary' && (
                <div className="space-y-4">
                    {sectionStats.map((section) => {
                        const pollSection = poll.sections?.find(s => s.id === section.sectionId);
                        const isExpanded = expandedSections.has(section.sectionId);
                        
                        return (
                            <div key={section.sectionId} className="bg-slate-50 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection(section.sectionId)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <FileText size={20} className="text-indigo-600" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-slate-800">{section.sectionTitle}</h3>
                                            <p className="text-sm text-slate-500">{section.questions.length} questions</p>
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                                </button>
                                
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-4 pb-4"
                                        >
                                            <div className="space-y-4">
                                                {section.questions.map((questionStats, qIdx) => {
                                                    const question = pollSection?.questions[qIdx];
                                                    if (!question) return null;
                                                    return (
                                                        <QuestionResult 
                                                            key={questionStats.questionId} 
                                                            stats={questionStats} 
                                                            question={question}
                                                            isAnonymous={isAnonymous}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* Individual Responses */}
            {viewMode === 'individual' && !isAnonymous && (
                <div className="space-y-4">
                    {responses.map((response, idx) => (
                        <div key={response.id || idx} className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">Response #{idx + 1}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    {response.completedAt && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(response.completedAt).toLocaleString()}
                                        </span>
                                    )}
                                    {response.isComplete ? (
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Complete</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Partial</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {poll.sections?.map(section => (
                                    <div key={section.id}>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{section.title}</p>
                                        {section.questions.map(question => {
                                            const answer = response.answers[question.id];
                                            if (!answer) return null;
                                            
                                            let displayValue = '';
                                            if (answer.text) displayValue = answer.text;
                                            else if (answer.number !== undefined) displayValue = answer.number.toString();
                                            else if (answer.selectedIds) {
                                                displayValue = answer.selectedIds
                                                    .map(id => question.options?.find(o => o.id === id)?.text || id)
                                                    .join(', ');
                                            }
                                            else if (answer.ranking) {
                                                displayValue = answer.ranking
                                                    .map((id, i) => `${i + 1}. ${question.options?.find(o => o.id === id)?.text || id}`)
                                                    .join(' | ');
                                            }
                                            
                                            return (
                                                <div key={question.id} className="flex items-start gap-2 py-1">
                                                    <span className="text-sm text-slate-600 min-w-0 flex-shrink-0">{question.question}:</span>
                                                    <span className="text-sm font-medium text-slate-800">{displayValue || '(no answer)'}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {responses.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Users size={48} className="mx-auto mb-4 text-slate-300" />
                            <p>No responses yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SurveyResults;
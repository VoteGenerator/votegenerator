// ============================================================================
// NPS Display Component
// Location: Add to src/components/SurveyResults.tsx or create separate file
// 
// This component calculates and displays Net Promoter Score for scale questions
// Just add this to your SurveyResults and call it when you detect an NPS question
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface NPSData {
    promoters: number;      // Count of 9-10
    passives: number;       // Count of 7-8
    detractors: number;     // Count of 0-6
    promoterPct: number;    // Percentage
    passivePct: number;
    detractorPct: number;
    score: number;          // NPS score (-100 to +100)
    total: number;
}

// ============================================================================
// NPS CALCULATION FUNCTION
// Use this wherever you process survey responses
// ============================================================================

export const calculateNPS = (responses: number[]): NPSData | null => {
    // Filter out invalid responses (must be 0-10)
    const validResponses = responses.filter(r => r >= 0 && r <= 10);
    const total = validResponses.length;
    
    if (total === 0) return null;
    
    // Count categories
    const promoters = validResponses.filter(r => r >= 9).length;
    const passives = validResponses.filter(r => r >= 7 && r <= 8).length;
    const detractors = validResponses.filter(r => r <= 6).length;
    
    // Calculate percentages
    const promoterPct = Math.round((promoters / total) * 100);
    const passivePct = Math.round((passives / total) * 100);
    const detractorPct = Math.round((detractors / total) * 100);
    
    // NPS = % Promoters - % Detractors
    const score = promoterPct - detractorPct;
    
    return {
        promoters,
        passives,
        detractors,
        promoterPct,
        passivePct,
        detractorPct,
        score,
        total
    };
};

// ============================================================================
// HELPER: Detect if a question is likely an NPS question
// ============================================================================

export const isNPSQuestion = (
    questionText: string, 
    questionType: string,
    options?: { min?: number; max?: number }
): boolean => {
    // Must be a scale/number type with 0-10 or 1-10 range
    if (questionType !== 'scale' && questionType !== 'number') return false;
    
    // Check if it's a 0-10 or 1-10 scale
    const isCorrectScale = (options?.min === 0 || options?.min === 1) && options?.max === 10;
    if (!isCorrectScale) return false;
    
    // Check for NPS keywords in question text
    const npsKeywords = [
        'recommend',
        'likely to recommend',
        'nps',
        'net promoter',
        'friend or colleague',
        'refer'
    ];
    
    const lowerText = questionText.toLowerCase();
    return npsKeywords.some(keyword => lowerText.includes(keyword));
};

// ============================================================================
// NPS DISPLAY COMPONENT
// ============================================================================

interface NPSDisplayProps {
    data: NPSData;
    questionText?: string;
    showExplanation?: boolean;
}

export const NPSDisplay: React.FC<NPSDisplayProps> = ({ 
    data, 
    questionText,
    showExplanation = true 
}) => {
    // Determine score quality
    const getScoreInfo = (score: number) => {
        if (score >= 70) return { 
            label: 'Excellent', 
            color: 'text-emerald-600', 
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            icon: TrendingUp,
            description: 'World-class customer loyalty'
        };
        if (score >= 30) return { 
            label: 'Great', 
            color: 'text-blue-600', 
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            icon: TrendingUp,
            description: 'Strong customer satisfaction'
        };
        if (score >= 0) return { 
            label: 'Good', 
            color: 'text-amber-600', 
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            icon: Minus,
            description: 'Room for improvement'
        };
        return { 
            label: 'Needs Work', 
            color: 'text-red-600', 
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            icon: TrendingDown,
            description: 'Focus on customer experience'
        };
    };

    const scoreInfo = getScoreInfo(data.score);
    const ScoreIcon = scoreInfo.icon;

    return (
        <div className={`rounded-2xl border-2 ${scoreInfo.borderColor} ${scoreInfo.bgColor} overflow-hidden`}>
            {/* Header */}
            <div className="p-6 border-b border-white/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={20} className={scoreInfo.color} />
                        <h3 className="font-bold text-slate-800">Net Promoter Score</h3>
                    </div>
                    <span className="text-sm text-slate-500">{data.total} responses</span>
                </div>
                {questionText && (
                    <p className="text-sm text-slate-600 italic">"{questionText}"</p>
                )}
            </div>

            {/* Big Score */}
            <div className="p-8 text-center bg-white/50">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="inline-flex flex-col items-center"
                >
                    <div className="flex items-center gap-2">
                        <span className={`text-7xl font-black ${scoreInfo.color}`}>
                            {data.score > 0 ? '+' : ''}{data.score}
                        </span>
                        <ScoreIcon size={32} className={scoreInfo.color} />
                    </div>
                    <div className={`mt-2 px-4 py-1 rounded-full ${scoreInfo.bgColor} ${scoreInfo.color} font-semibold text-sm`}>
                        {scoreInfo.label}
                    </div>
                    <p className="text-slate-500 text-sm mt-2">{scoreInfo.description}</p>
                </motion.div>
            </div>

            {/* Breakdown Bar */}
            <div className="px-6 py-4 bg-white/30">
                <div className="flex h-4 rounded-full overflow-hidden mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.promoterPct}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-emerald-500"
                        title={`Promoters: ${data.promoterPct}%`}
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.passivePct}%` }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-amber-400"
                        title={`Passives: ${data.passivePct}%`}
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.detractorPct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-red-400"
                        title={`Detractors: ${data.detractorPct}%`}
                    />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                            <span className="text-sm font-medium text-slate-700">Promoters</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{data.promoterPct}%</p>
                        <p className="text-xs text-slate-500">{data.promoters} scored 9-10</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-amber-400 rounded-full" />
                            <span className="text-sm font-medium text-slate-700">Passives</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{data.passivePct}%</p>
                        <p className="text-xs text-slate-500">{data.passives} scored 7-8</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full" />
                            <span className="text-sm font-medium text-slate-700">Detractors</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{data.detractorPct}%</p>
                        <p className="text-xs text-slate-500">{data.detractors} scored 0-6</p>
                    </div>
                </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                        <Info size={16} className="flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="mb-1">
                                <strong>NPS = % Promoters − % Detractors</strong>
                            </p>
                            <p>
                                Score ranges from -100 (all detractors) to +100 (all promoters). 
                                Above 0 is good, above 30 is great, above 70 is world-class.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// COMPACT NPS CARD (for dashboard summary view)
// ============================================================================

export const NPSCard: React.FC<{ data: NPSData }> = ({ data }) => {
    const getColor = (score: number) => {
        if (score >= 70) return 'text-emerald-600 bg-emerald-100';
        if (score >= 30) return 'text-blue-600 bg-blue-100';
        if (score >= 0) return 'text-amber-600 bg-amber-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">NPS Score</span>
                <span className="text-xs text-slate-400">{data.total} responses</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-3xl font-black ${getColor(data.score).split(' ')[0]}`}>
                    {data.score > 0 ? '+' : ''}{data.score}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500" style={{ width: `${data.promoterPct}%` }} />
                    <div className="bg-amber-400" style={{ width: `${data.passivePct}%` }} />
                    <div className="bg-red-400" style={{ width: `${data.detractorPct}%` }} />
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// USAGE EXAMPLE - How to integrate into SurveyResults
// ============================================================================

/*
In your SurveyResults.tsx, after calculating question stats:

import { calculateNPS, isNPSQuestion, NPSDisplay } from './NPSDisplay';

// Inside your component:
const renderQuestionResult = (question: SurveyQuestion, responses: SurveyResponse[]) => {
    // Check if this is an NPS question
    if (isNPSQuestion(question.question, question.type, { min: question.min, max: question.max })) {
        // Extract numeric responses for this question
        const numericResponses = responses
            .map(r => r.answers[question.id]?.number)
            .filter((n): n is number => n !== undefined);
        
        const npsData = calculateNPS(numericResponses);
        
        if (npsData) {
            return (
                <NPSDisplay 
                    data={npsData} 
                    questionText={question.question}
                />
            );
        }
    }
    
    // ... render other question types normally
};

// Or add NPS detection at the survey level for the stats overview:
const surveyHasNPS = poll.sections?.some(section => 
    section.questions.some(q => isNPSQuestion(q.question, q.type, { min: q.min, max: q.max }))
);
*/

export default NPSDisplay;
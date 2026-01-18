// ============================================================================
// SurveyResults - Multi-Section Survey Results Display
// Location: src/components/SurveyResults.tsx
// Features: Per-question breakdown, charts, NPS, tier gating, CSV/Excel export
// Updated: Added tier-based feature gating, export functions, response limits
// ============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Users, Clock, Star, ChevronDown, ChevronRight,
    Download, Eye, FileText, TrendingUp, TrendingDown,
    Shield, Lock, EyeOff, Info, Minus, Crown, FileSpreadsheet,
    Table, Calendar, Cloud, FileDown, Filter
} from 'lucide-react';
import {
    Poll, SurveyQuestion, SurveyResponse
} from '../types';

// ============================================================================
// TIER CONFIGURATION (matches actual pricing - monthly/yearly subscriptions)
// Free: $0 | Pro: $19/mo or $190/yr | Business: $49/mo or $490/yr
// ============================================================================

type UserTier = 'free' | 'pro' | 'business';

const SURVEY_TIER_CONFIG: Record<UserTier, {
    maxQuestions: number;
    maxSections: number;
    maxResponses: number;
    canExportCSV: boolean;
    canExportExcel: boolean;
    canExportPDF: boolean;
    canViewIndividual: boolean;
    canViewAllText: boolean;
    canViewWordCloud: boolean;
    canFilterByDate: boolean;
    textPreviewCount: number;
}> = {
    free: {
        maxQuestions: 10,
        maxSections: 3,
        maxResponses: 100,
        canExportCSV: false,
        canExportExcel: false,
        canExportPDF: false,
        canViewIndividual: false,
        canViewAllText: false,
        canViewWordCloud: false,  // Locked for free
        canFilterByDate: false,   // Basic preset filters only
        textPreviewCount: 3,
    },
    pro: {
        maxQuestions: 25,
        maxSections: 10,
        maxResponses: 10000,
        canExportCSV: true,
        canExportExcel: true,
        canExportPDF: true,
        canViewIndividual: true,
        canViewAllText: true,
        canViewWordCloud: true,
        canFilterByDate: true,
        textPreviewCount: Infinity,
    },
    business: {
        maxQuestions: Infinity,
        maxSections: Infinity,
        maxResponses: 100000,
        canExportCSV: true,
        canExportExcel: true,
        canExportPDF: true,
        canViewIndividual: true,
        canViewAllText: true,
        canViewWordCloud: true,
        canFilterByDate: true,
        textPreviewCount: Infinity,
    }
};

// ============================================================================
// WORD FILTERING - Common words, profanity, and validation
// ============================================================================

// Common stop words to exclude from word clouds
const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
    'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
    'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
    'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
    'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
    'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did',
    'am', 'very', 'really', 'more', 'much', 'many', 'such', 'here', 'where',
    'why', 'thing', 'things', 'something', 'nothing', 'everything', 'anything',
    'yeah', 'yes', 'no', 'ok', 'okay', 'etc', 'ie', 'eg', 'im', 'ive', 'dont',
    'didnt', 'doesnt', 'wont', 'cant', 'couldnt', 'shouldnt', 'wouldnt', 'isnt',
    'arent', 'wasnt', 'werent', 'hasnt', 'havent', 'hadnt', 'thats', 'theres',
    'heres', 'whats', 'whos', 'wheres', 'whens', 'hows', 'whys', 'lets', 'got',
    'getting', 'gonna', 'gotta', 'wanna', 'kinda', 'sorta', 'lot', 'lots',
    'bit', 'little', 'big', 'small', 'great', 'nice', 'bad', 'few', 'every',
]);

// Basic profanity filter (common bad words - keeping it family friendly)
const PROFANITY_LIST = new Set([
    'fuck', 'fucking', 'fucked', 'fucker', 'fucks', 'shit', 'shits', 'shitty',
    'bullshit', 'ass', 'asses', 'asshole', 'assholes', 'damn', 'damned',
    'bitch', 'bitches', 'bastard', 'bastards', 'crap', 'crappy', 'dick',
    'dicks', 'piss', 'pissed', 'cock', 'cocks', 'pussy', 'pussies', 'whore',
    'whores', 'slut', 'sluts', 'cunt', 'cunts', 'nigger', 'nigga', 'faggot',
    'fag', 'retard', 'retarded', 'penis', 'vagina', 'sex', 'porn', 'xxx',
]);

// Check if a word looks like a real English word (basic heuristics)
const isValidWord = (word: string): boolean => {
    // Must be at least 2 characters
    if (word.length < 2) return false;
    
    // Must not be too long (likely spam/gibberish)
    if (word.length > 20) return false;
    
    // Must contain at least one vowel (basic English word check)
    if (!/[aeiouy]/i.test(word)) return false;
    
    // Must not be all consonants
    if (/^[bcdfghjklmnpqrstvwxz]+$/i.test(word)) return false;
    
    // Must not have more than 3 consecutive consonants (unusual in English)
    if (/[bcdfghjklmnpqrstvwxz]{4,}/i.test(word)) return false;
    
    // Must not have more than 2 consecutive vowels (unusual patterns)
    if (/[aeiou]{3,}/i.test(word)) return false;
    
    // Must not be repeating characters (like 'aaaa' or 'abab')
    if (/(.)\1{2,}/i.test(word)) return false;
    
    // Must not be a number
    if (/^\d+$/.test(word)) return false;
    
    // Must be mostly letters
    if (!/^[a-z]+$/i.test(word)) return false;
    
    return true;
};

// Extract and count words from text responses
const extractWords = (texts: string[]): Map<string, number> => {
    const wordCounts = new Map<string, number>();
    
    texts.forEach(text => {
        if (!text || typeof text !== 'string') return;
        
        // Split into words, lowercase, remove punctuation
        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        words.forEach(word => {
            // Skip stop words
            if (STOP_WORDS.has(word)) return;
            
            // Skip profanity
            if (PROFANITY_LIST.has(word)) return;
            
            // Skip invalid words
            if (!isValidWord(word)) return;
            
            // Count the word
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
    });
    
    return wordCounts;
};

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
    // Default stats in case of error
    const defaultStats: QuestionStats = {
        questionId: question?.id || 'unknown',
        questionText: question?.question || 'Unknown Question',
        questionType: question?.type || 'text',
        totalResponses: 0,
    };
    
    try {
        if (!question || !question.id) return defaultStats;
        
        // Debug: Log what we're receiving
        console.log('calculateQuestionStats for question:', question.id, question.type);
        console.log('Total responses:', responses?.length || 0);
        if (responses?.[0]) {
            console.log('First response answers:', responses[0].answers);
            console.log('First response answer for this question:', responses[0].answers?.[question.id]);
        }
        
        const answers = (responses || [])
            .filter(r => r && r.answers && typeof r.answers === 'object')
            .map(r => r.answers[question.id])
            .filter(Boolean);
        
        console.log('Extracted answers count:', answers.length);
        if (answers[0]) {
            console.log('First extracted answer:', answers[0]);
        }
    
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
    } catch (error) {
        console.error('Error calculating question stats:', error, { questionId: question?.id });
        return defaultStats;
    }
};

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

const generateCSV = (poll: Poll, responses: SurveyResponse[]): string => {
    const sections = poll.sections || [];
    const allQuestions = sections.flatMap(s => s.questions);
    
    // Header row
    const headers = ['Response ID', 'Completed At', 'Is Complete', ...allQuestions.map(q => q.question)];
    
    // Data rows
    const rows = responses.map(response => {
        const row: string[] = [
            response.id || '',
            response.completedAt ? new Date(response.completedAt).toISOString() : '',
            response.isComplete ? 'Yes' : 'No',
        ];
        
        allQuestions.forEach(question => {
            const answer = response.answers?.[question.id];
            if (!answer) {
                row.push('');
                return;
            }
            
            let value = '';
            if (answer.text) value = answer.text;
            else if (answer.number !== undefined) value = answer.number.toString();
            else if (answer.selectedIds) {
                value = answer.selectedIds
                    .map(id => question.options?.find(o => o.id === id)?.text || id)
                    .join('; ');
            }
            else if (answer.ranking) {
                value = answer.ranking
                    .map((id, i) => `${i + 1}. ${question.options?.find(o => o.id === id)?.text || id}`)
                    .join('; ');
            }
            
            // Escape CSV special characters
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            
            row.push(value);
        });
        
        return row.join(',');
    });
    
    return [headers.join(','), ...rows].join('\n');
};

const downloadCSV = (poll: Poll, responses: SurveyResponse[]) => {
    const csv = generateCSV(poll, responses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${poll.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadExcel = (poll: Poll, responses: SurveyResponse[]) => {
    // For Excel, we'll generate a more formatted CSV that Excel handles well
    // In production, you'd use a library like xlsx
    const csv = generateCSV(poll, responses);
    const blob = new Blob(['\ufeff' + csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${poll.title.replace(/[^a-z0-9]/gi, '_')}_responses.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// ============================================================================
// NPS DISPLAY COMPONENT
// ============================================================================

interface NPSDisplayProps {
    data: NPSData;
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
// ENHANCED NPS GAUGE COMPONENT
// ============================================================================

interface NPSGaugeProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
}

const NPSGauge: React.FC<NPSGaugeProps> = ({ score, size = 'md' }) => {
    const dimensions = {
        sm: { width: 120, height: 70, strokeWidth: 8, fontSize: 20 },
        md: { width: 180, height: 100, strokeWidth: 12, fontSize: 28 },
        lg: { width: 240, height: 130, strokeWidth: 16, fontSize: 36 },
    };
    
    const { width, height, strokeWidth, fontSize } = dimensions[size];
    const radius = (width - strokeWidth) / 2;
    const centerX = width / 2;
    const centerY = height - 10;
    
    // NPS ranges from -100 to +100, map to 0-180 degrees
    const normalizedScore = (score + 100) / 200; // 0 to 1
    const angle = normalizedScore * 180; // 0 to 180 degrees
    
    // Calculate arc paths
    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const angleRad = (angleDeg - 180) * Math.PI / 180;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad),
        };
    };
    
    const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(cx, cy, r, startAngle);
        const end = polarToCartesian(cx, cy, r, endAngle);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
    };
    
    // Needle position
    const needleEnd = polarToCartesian(centerX, centerY, radius - strokeWidth, angle);
    
    // Color based on score
    const getColor = () => {
        if (score >= 50) return '#10b981'; // Excellent - emerald
        if (score >= 30) return '#22c55e'; // Great - green
        if (score >= 0) return '#eab308';  // Good - yellow
        if (score >= -30) return '#f97316'; // Needs work - orange
        return '#ef4444'; // Critical - red
    };
    
    return (
        <div className="relative inline-flex flex-col items-center">
            <svg width={width} height={height} className="overflow-visible">
                {/* Background arc - gray */}
                <path
                    d={describeArc(centerX, centerY, radius, 0, 180)}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                
                {/* Colored segments */}
                <path
                    d={describeArc(centerX, centerY, radius, 0, 36)}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    opacity={0.3}
                />
                <path
                    d={describeArc(centerX, centerY, radius, 36, 72)}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth={strokeWidth}
                    opacity={0.3}
                />
                <path
                    d={describeArc(centerX, centerY, radius, 72, 108)}
                    fill="none"
                    stroke="#eab308"
                    strokeWidth={strokeWidth}
                    opacity={0.3}
                />
                <path
                    d={describeArc(centerX, centerY, radius, 108, 144)}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth={strokeWidth}
                    opacity={0.3}
                />
                <path
                    d={describeArc(centerX, centerY, radius, 144, 180)}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    opacity={0.3}
                />
                
                {/* Active arc up to score */}
                <motion.path
                    d={describeArc(centerX, centerY, radius, 0, angle)}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                
                {/* Needle */}
                <motion.line
                    x1={centerX}
                    y1={centerY}
                    x2={needleEnd.x}
                    y2={needleEnd.y}
                    stroke="#334155"
                    strokeWidth={3}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                />
                <circle cx={centerX} cy={centerY} r={6} fill="#334155" />
                
                {/* Labels */}
                <text x={strokeWidth} y={centerY + 15} fontSize={10} fill="#94a3b8">-100</text>
                <text x={width - strokeWidth - 20} y={centerY + 15} fontSize={10} fill="#94a3b8">+100</text>
            </svg>
            
            {/* Score display */}
            <div className="absolute bottom-0 text-center">
                <span 
                    className="font-black"
                    style={{ fontSize, color: getColor() }}
                >
                    {score > 0 ? '+' : ''}{score}
                </span>
            </div>
        </div>
    );
};

// ============================================================================
// WORD CLOUD COMPONENT
// ============================================================================

interface WordCloudProps {
    words: Map<string, number>;
    maxWords?: number;
    locked?: boolean;
}

const WordCloud: React.FC<WordCloudProps> = ({ words, maxWords = 30, locked = false }) => {
    // Sort words by frequency and take top N
    const sortedWords = Array.from(words.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxWords);
    
    if (sortedWords.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No significant words found</p>
            </div>
        );
    }
    
    const maxCount = sortedWords[0][1];
    const minCount = sortedWords[sortedWords.length - 1][1];
    
    // Calculate font size based on frequency
    const getFontSize = (count: number) => {
        const range = maxCount - minCount || 1;
        const normalized = (count - minCount) / range;
        return 12 + normalized * 24; // 12px to 36px
    };
    
    // Color palette
    const colors = [
        'text-indigo-600', 'text-purple-600', 'text-pink-600', 'text-blue-600',
        'text-emerald-600', 'text-amber-600', 'text-cyan-600', 'text-rose-600',
    ];
    
    if (locked) {
        return (
            <div className="relative">
                <div className="flex flex-wrap gap-2 justify-center items-center p-4 blur-sm select-none">
                    {sortedWords.slice(0, 15).map(([word, count], i) => (
                        <span
                            key={word}
                            className={`${colors[i % colors.length]} font-semibold`}
                            style={{ fontSize: getFontSize(count) }}
                        >
                            {word}
                        </span>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="text-center">
                        <Lock size={24} className="mx-auto mb-2 text-purple-500" />
                        <p className="text-sm font-medium text-slate-700">Word Cloud</p>
                        <a href="/pricing" className="text-xs text-purple-600 hover:underline flex items-center justify-center gap-1 mt-1">
                            <Crown size={12} /> Upgrade to unlock
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-wrap gap-3 justify-center items-center p-4">
            {sortedWords.map(([word, count], i) => (
                <motion.span
                    key={word}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`${colors[i % colors.length]} font-semibold hover:opacity-70 cursor-default transition-opacity`}
                    style={{ fontSize: getFontSize(count) }}
                    title={`"${word}" appears ${count} time${count !== 1 ? 's' : ''}`}
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};

// ============================================================================
// DATE FILTER COMPONENT
// ============================================================================

interface DateFilterProps {
    responses: SurveyResponse[];
    onFilter: (filtered: SurveyResponse[] | null) => void;
    canUseCustom: boolean;
}

const DateFilter: React.FC<DateFilterProps> = ({ responses, onFilter, canUseCustom }) => {
    const [preset, setPreset] = useState<string>('all');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showCustom, setShowCustom] = useState(false);
    
    const applyFilter = (filterType: string) => {
        setPreset(filterType);
        setShowCustom(false);
        
        if (filterType === 'all') {
            onFilter(null); // null means show all
            return;
        }
        
        const now = new Date();
        let startDate: Date;
        
        switch (filterType) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                onFilter(null);
                return;
        }
        
        const filtered = responses.filter(r => {
            const dateStr = r.submittedAt || r.startedAt || r.completedAt;
            if (!dateStr) return true; // Include responses without dates
            const responseDate = new Date(dateStr);
            return !isNaN(responseDate.getTime()) && responseDate >= startDate;
        });
        
        onFilter(filtered);
    };
    
    const applyCustomFilter = () => {
        if (!customStart && !customEnd) {
            onFilter(null);
            return;
        }
        
        const filtered = responses.filter(r => {
            const dateStr = r.submittedAt || r.startedAt || r.completedAt;
            if (!dateStr) return true;
            const responseDate = new Date(dateStr);
            if (isNaN(responseDate.getTime())) return true;
            
            if (customStart && responseDate < new Date(customStart)) return false;
            if (customEnd) {
                const endDate = new Date(customEnd);
                endDate.setHours(23, 59, 59, 999);
                if (responseDate > endDate) return false;
            }
            
            return true;
        });
        
        onFilter(filtered);
    };
    
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Filter:</span>
            
            {['all', 'today', 'week', 'month'].map(filter => (
                <button
                    key={filter}
                    onClick={() => applyFilter(filter)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                        preset === filter && !showCustom
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {filter === 'all' ? 'All Time' : 
                     filter === 'today' ? 'Today' :
                     filter === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
            ))}
            
            {canUseCustom ? (
                <>
                    <button
                        onClick={() => setShowCustom(!showCustom)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition flex items-center gap-1 ${
                            showCustom
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <Calendar size={12} />
                        Custom
                    </button>
                    
                    {showCustom && (
                        <div className="flex items-center gap-2 ml-2">
                            <input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="px-2 py-1 text-xs border border-slate-200 rounded-lg"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="px-2 py-1 text-xs border border-slate-200 rounded-lg"
                            />
                            <button
                                onClick={applyCustomFilter}
                                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <button
                    disabled
                    className="px-3 py-1.5 text-xs rounded-lg font-medium bg-slate-100 text-slate-400 cursor-not-allowed flex items-center gap-1"
                    title="Upgrade to Pro for custom date ranges"
                >
                    <Calendar size={12} />
                    Custom
                    <Crown size={10} className="text-amber-500" />
                </button>
            )}
        </div>
    );
};

// ============================================================================
// ANONYMOUS MODE NOTICE
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

// ============================================================================
// UPGRADE CTA FOR FREE USERS
// ============================================================================

const UpgradeCTA: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
    return (
        <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 border border-purple-200 rounded-2xl">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Crown size={24} className="text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">Unlock Full Survey Analytics</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Upgrade to Pro to access powerful visualization and export tools.
                    </p>
                    
                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-start gap-2 p-2 bg-white/60 rounded-lg">
                            <BarChart3 size={16} className="text-purple-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-700 text-sm">Pie &amp; Donut Charts</p>
                                <p className="text-xs text-slate-500">Visualize data beautifully</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-white/60 rounded-lg">
                            <FileSpreadsheet size={16} className="text-purple-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-700 text-sm">CSV &amp; Excel Export</p>
                                <p className="text-xs text-slate-500">Download all response data</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-white/60 rounded-lg">
                            <Eye size={16} className="text-purple-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-700 text-sm">Individual Responses</p>
                                <p className="text-xs text-slate-500">See each person's answers</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-white/60 rounded-lg">
                            <FileText size={16} className="text-purple-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-700 text-sm">All Text Feedback</p>
                                <p className="text-xs text-slate-500">No blurred responses</p>
                            </div>
                        </div>
                    </div>
                    
                    <a
                        href="/pricing"
                        onClick={onUpgrade}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                    >
                        <Crown size={16} />
                        Upgrade to Pro
                    </a>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// QUESTION RESULT COMPONENT
// ============================================================================

interface QuestionResultProps {
    stats: QuestionStats;
    question: SurveyQuestion;
    isAnonymous: boolean;
    tier: UserTier;
}

const QuestionResult: React.FC<QuestionResultProps> = ({ stats, question, isAnonymous, tier }) => {
    const tierConfig = SURVEY_TIER_CONFIG[tier];
    const isPaidUser = tier !== 'free';
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'donut'>('bar');
    
    // Calculate colors for pie/donut charts
    const chartColors = [
        '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
        '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6',
        '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
    ];
    
    const renderPieChart = (options: typeof question.options, total: number) => {
        let cumulativeAngle = 0;
        const size = 160;
        const center = size / 2;
        const outerRadius = 70;
        const innerRadius = chartType === 'donut' ? 40 : 0;
        
        return (
            <div className="flex items-center gap-6 mt-4">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {options?.map((opt, idx) => {
                        const count = stats.optionCounts?.[opt.id] || 0;
                        const pct = total > 0 ? count / total : 0;
                        const angle = pct * 360;
                        
                        const startAngle = cumulativeAngle;
                        cumulativeAngle += angle;
                        const endAngle = cumulativeAngle;
                        
                        // Convert angles to radians and calculate arc
                        const startRad = (startAngle - 90) * Math.PI / 180;
                        const endRad = (endAngle - 90) * Math.PI / 180;
                        
                        const x1 = center + outerRadius * Math.cos(startRad);
                        const y1 = center + outerRadius * Math.sin(startRad);
                        const x2 = center + outerRadius * Math.cos(endRad);
                        const y2 = center + outerRadius * Math.sin(endRad);
                        
                        const x1Inner = center + innerRadius * Math.cos(startRad);
                        const y1Inner = center + innerRadius * Math.sin(startRad);
                        const x2Inner = center + innerRadius * Math.cos(endRad);
                        const y2Inner = center + innerRadius * Math.sin(endRad);
                        
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        const pathData = innerRadius > 0
                            ? `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner} Z`
                            : `M ${center} ${center} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        
                        if (pct === 0) return null;
                        
                        return (
                            <motion.path
                                key={opt.id}
                                d={pathData}
                                fill={chartColors[idx % chartColors.length]}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        );
                    })}
                </svg>
                <div className="flex-1 space-y-1">
                    {options?.map((opt, idx) => {
                        const count = stats.optionCounts?.[opt.id] || 0;
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <div key={opt.id} className="flex items-center gap-2 text-sm">
                                <div 
                                    className="w-3 h-3 rounded-sm flex-shrink-0" 
                                    style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                                />
                                <span className="text-slate-700 truncate">{opt.text}</span>
                                <span className="text-slate-400 ml-auto">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    
    const renderResult = () => {
        switch (question.type) {
            case 'multiple_choice':
            case 'dropdown':
            case 'yes_no': {
                const total = Object.values(stats.optionCounts || {}).reduce((sum, c) => sum + c, 0);
                const sortedOptions = question.options?.slice().sort((a, b) => {
                    return (stats.optionCounts?.[b.id] || 0) - (stats.optionCounts?.[a.id] || 0);
                });
                
                return (
                    <div className="mt-3">
                        {/* Chart Type Toggle - Pro+ Feature */}
                        {isPaidUser && total > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                                <span className="text-xs text-slate-500 mr-2">View:</span>
                                {(['bar', 'pie', 'donut'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setChartType(type)}
                                        className={`px-2 py-1 text-xs rounded-lg transition ${
                                            chartType === type
                                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Upgrade prompt for chart options */}
                        {!isPaidUser && total > 0 && (
                            <div className="flex items-center gap-2 mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100">
                                <Crown size={14} className="text-purple-500" />
                                <span className="text-xs text-purple-700">
                                    <a href="/pricing" className="underline font-medium">Upgrade to Pro</a> for pie &amp; donut charts
                                </span>
                            </div>
                        )}
                        
                        {/* Render chart based on type */}
                        {chartType === 'bar' || !isPaidUser ? (
                            <div className="space-y-2">
                                {sortedOptions?.map((opt, idx) => {
                                    const count = stats.optionCounts?.[opt.id] || 0;
                                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                    const isWinner = idx === 0 && count > 0;
                                    
                                    return (
                                        <div key={opt.id} className="relative">
                                            <div className={`flex items-center justify-between p-3 rounded-xl border ${
                                                isWinner ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'
                                            }`}>
                                                <span className={`font-medium ${isWinner ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                    {opt.text}
                                                    {isWinner && <Star size={14} className="inline ml-1 text-amber-500" />}
                                                </span>
                                                <span className="text-sm text-slate-500">{count} ({pct}%)</span>
                                            </div>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                                className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${
                                                    isWinner ? 'bg-indigo-500' : 'bg-slate-300'
                                                }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            renderPieChart(sortedOptions, total)
                        )}
                    </div>
                );
            }
            
            case 'rating': {
                const maxStars = question.maxValue || 5;
                return (
                    <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: maxStars }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        className={i < Math.round(stats.average || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                                    />
                                ))}
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-amber-600">
                                    {(stats.average || 0).toFixed(1)}
                                </span>
                                <span className="text-slate-500 text-sm ml-1">/ {maxStars}</span>
                            </div>
                        </div>
                        {stats.distribution && (
                            <div className="mt-3 flex gap-1">
                                {Array.from({ length: maxStars }).map((_, i) => {
                                    const count = stats.distribution?.[i + 1] || 0;
                                    const pct = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                                    return (
                                        <div key={i} className="flex-1 text-center">
                                            <div className="h-12 bg-white rounded-lg border border-amber-100 flex items-end justify-center p-1">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${pct}%` }}
                                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                                    className="w-full bg-amber-400 rounded-sm min-h-[2px]"
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 mt-1">{i + 1}★</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }
            
            case 'scale': {
                if (stats.npsData) {
                    return <div className="mt-3"><NPSDisplay data={stats.npsData} /></div>;
                }
                
                return (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600">Average</span>
                            <span className="text-2xl font-bold text-blue-600">{(stats.average || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Min: {stats.min}</span>
                            <span>Max: {stats.max}</span>
                        </div>
                    </div>
                );
            }
            
            case 'text':
            case 'textarea':
            case 'email':
            case 'phone': {
                const responses = stats.textResponses || [];
                const visibleCount = tierConfig.canViewAllText ? responses.length : tierConfig.textPreviewCount;
                const visibleResponses = responses.slice(0, visibleCount);
                const hiddenCount = responses.length - visibleCount;
                
                if (responses.length === 0) {
                    return <p className="text-slate-500 mt-3 text-sm">No text responses yet</p>;
                }
                
                return (
                    <div className="mt-3 space-y-2">
                        {isAnonymous && (
                            <p className="text-xs text-emerald-600 flex items-center gap-1 mb-2">
                                <Shield size={12} />
                                Responses shown in random order
                            </p>
                        )}
                        {visibleResponses.map((text, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
                                "{text}"
                            </div>
                        ))}
                        {hiddenCount > 0 && (
                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lock size={14} className="text-purple-500" />
                                        <span className="text-sm text-purple-700 font-medium">
                                            +{hiddenCount} more responses
                                        </span>
                                    </div>
                                    <a href="/pricing" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
                                        <Crown size={12} />
                                        Upgrade to view
                                    </a>
                                </div>
                                {/* Blurred preview */}
                                <div className="mt-2 space-y-1">
                                    {responses.slice(visibleCount, visibleCount + 2).map((text, i) => (
                                        <div key={i} className="p-2 bg-white/50 rounded text-sm text-slate-400 blur-[2px] select-none">
                                            {text.substring(0, 50)}...
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
            
            case 'ranking': {
                const sortedOptions = question.options?.slice().sort((a, b) => {
                    return (stats.rankingScores?.[a.id] || 99) - (stats.rankingScores?.[b.id] || 99);
                });
                
                return (
                    <div className="mt-3 space-y-2">
                        {sortedOptions?.map((opt, idx) => {
                            const avgRank = stats.rankingScores?.[opt.id] || 0;
                            return (
                                <div key={opt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                                        idx === 1 ? 'bg-slate-200 text-slate-700' :
                                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <span className="flex-1 font-medium text-slate-700">{opt.text}</span>
                                    <span className="text-sm text-slate-500">Avg: {avgRank.toFixed(1)}</span>
                                </div>
                            );
                        })}
                    </div>
                );
            }
            
            default:
                return <p className="text-slate-500 mt-3 text-sm">{stats.totalResponses} responses</p>;
        }
    };
    
    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <BarChart3 size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1">
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
    isAdmin?: boolean;
    onUpgrade?: () => void;
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ poll, responses: rawResponses, isAdmin = false, onUpgrade }) => {
    // DEBUG LOGGING - Remove after debugging
    useEffect(() => {
        console.log('========== SurveyResults Debug ==========');
        console.log('Poll ID:', poll?.id);
        console.log('Poll sections count:', poll?.sections?.length || 0);
        console.log('Poll sections:', poll?.sections);
        console.log('Raw responses type:', typeof rawResponses);
        console.log('Raw responses is array:', Array.isArray(rawResponses));
        console.log('Raw responses count:', rawResponses?.length || 0);
        console.log('Raw responses:', rawResponses);
        
        if (rawResponses?.length > 0) {
            console.log('First raw response:', rawResponses[0]);
            console.log('First response type:', typeof rawResponses[0]);
            console.log('First response keys:', Object.keys(rawResponses[0] || {}));
            console.log('First response.answers:', rawResponses[0]?.answers);
            console.log('First response.answers type:', typeof rawResponses[0]?.answers);
            if (rawResponses[0]?.answers) {
                console.log('First response.answers keys:', Object.keys(rawResponses[0].answers));
            }
        }
        
        const sections = poll?.sections;
        if (sections && sections.length > 0) {
            console.log('First section:', sections[0]);
            console.log('First section questions count:', sections[0].questions?.length || 0);
            if (sections[0].questions?.[0]) {
                console.log('First question ID:', sections[0].questions[0].id);
                console.log('First question type:', sections[0].questions[0].type);
            }
        }
        console.log('========== End SurveyResults Debug ==========');
    }, [poll, rawResponses]);
    
    // Ensure responses is always a valid array with valid entries
    const allResponses = useMemo(() => {
        if (!rawResponses || !Array.isArray(rawResponses)) return [];
        return rawResponses.filter(r => r && typeof r === 'object');
    }, [rawResponses]);
    
    // Filtered responses (null = no filter applied, use all)
    const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[] | null>(null);
    
    // Use filtered responses if filter is active, otherwise use all
    const responses = filteredResponses !== null ? filteredResponses : allResponses;
    const isFiltered = filteredResponses !== null && filteredResponses.length !== allResponses.length;
    
    const isAnonymous = poll.settings?.anonymousMode === true;
    
    // Detect user tier - Pro ($19/mo) or Business ($49/mo)
    const tier: UserTier = useMemo(() => {
        // Check poll's tier first (attached at creation)
        const pollTier = (poll as any).tier;
        if (pollTier === 'business') return 'business';
        if (pollTier === 'pro') return 'pro';
        
        // Then check user's subscription tier from localStorage
        const storedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (storedTier === 'business') return 'business';
        if (storedTier === 'pro') return 'pro';
        return 'free';
    }, [poll]);
    
    const tierConfig = SURVEY_TIER_CONFIG[tier];
    const isPaidUser = tier !== 'free';
    
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(poll.sections?.map(s => s.id) || [])
    );
    const [viewMode, setViewMode] = useState<'summary' | 'individual'>('summary');
    const [exportLoading, setExportLoading] = useState<string | null>(null);
    
    useEffect(() => {
        if (isAnonymous && viewMode === 'individual') {
            setViewMode('summary');
        }
        if (!tierConfig.canViewIndividual && viewMode === 'individual') {
            setViewMode('summary');
        }
    }, [isAnonymous, viewMode, tierConfig.canViewIndividual]);
    
    const sectionStats: SectionStats[] = useMemo(() => {
        if (!poll.sections || !Array.isArray(poll.sections)) return [];
        return poll.sections.map(section => ({
            sectionId: section.id,
            sectionTitle: section.title,
            questions: (section.questions || []).map(q => calculateQuestionStats(q, responses)),
        }));
    }, [poll.sections, responses]);
    
    // Extract all text responses for word cloud
    const allTextResponses = useMemo(() => {
        const texts: string[] = [];
        if (!poll.sections) return texts;
        
        poll.sections.forEach(section => {
            (section.questions || []).forEach(question => {
                if (['text', 'textarea'].includes(question.type)) {
                    responses.forEach(r => {
                        const answer = r.answers?.[question.id];
                        if (answer?.text) {
                            texts.push(answer.text);
                        }
                    });
                }
            });
        });
        
        return texts;
    }, [poll.sections, responses]);
    
    // Calculate word frequencies
    const wordFrequencies = useMemo(() => {
        return extractWords(allTextResponses);
    }, [allTextResponses]);
    
    const npsQuestions = useMemo(() => {
        const npsData: { sectionTitle: string; questionText: string; nps: NPSData }[] = [];
        if (!sectionStats || !Array.isArray(sectionStats)) return npsData;
        sectionStats.forEach(section => {
            if (!section.questions || !Array.isArray(section.questions)) return;
            section.questions.forEach(q => {
                if (q && q.npsData) {
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
    
    const handleExportCSV = async () => {
        if (!tierConfig.canExportCSV) return;
        setExportLoading('csv');
        try {
            downloadCSV(poll, responses);
        } finally {
            setTimeout(() => setExportLoading(null), 500);
        }
    };
    
    const handleExportExcel = async () => {
        if (!tierConfig.canExportExcel) return;
        setExportLoading('excel');
        try {
            downloadExcel(poll, responses);
        } finally {
            setTimeout(() => setExportLoading(null), 500);
        }
    };
    
    const handleExportPDF = async () => {
        if (!tierConfig.canExportPDF) return;
        setExportLoading('pdf');
        try {
            // Create a printable version of the results
            const printContent = document.createElement('div');
            printContent.innerHTML = `
                <html>
                <head>
                    <title>${poll.title || 'Survey'} - Results Report</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; }
                        h1 { color: #4f46e5; margin-bottom: 8px; }
                        h2 { color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; }
                        h3 { color: #475569; margin-top: 24px; }
                        .meta { color: #64748b; margin-bottom: 24px; }
                        .stats { display: flex; gap: 24px; margin: 24px 0; }
                        .stat { background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; }
                        .stat-value { font-size: 28px; font-weight: bold; color: #4f46e5; }
                        .stat-label { font-size: 12px; color: #64748b; }
                        .question { margin: 16px 0; padding: 16px; background: #f8fafc; border-radius: 8px; }
                        .question-text { font-weight: 600; margin-bottom: 8px; }
                        .option { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                        .bar { height: 8px; background: #e2e8f0; border-radius: 4px; margin-top: 4px; }
                        .bar-fill { height: 100%; background: #4f46e5; border-radius: 4px; }
                        .nps { text-align: center; padding: 24px; background: #f0fdf4; border-radius: 8px; margin: 24px 0; }
                        .nps-score { font-size: 48px; font-weight: bold; }
                        @media print { body { padding: 20px; } }
                    </style>
                </head>
                <body>
                    <h1>${poll.title || 'Survey Results'}</h1>
                    <p class="meta">Generated on ${new Date().toLocaleDateString()} • ${totalResponses} responses</p>
                    
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value">${totalResponses}</div>
                            <div class="stat-label">Total Responses</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${completeResponses}</div>
                            <div class="stat-label">Complete</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${formatTime(avgCompletionTime)}</div>
                            <div class="stat-label">Avg. Time</div>
                        </div>
                    </div>
                    
                    ${sectionStats.map(section => `
                        <h2>${section.sectionTitle}</h2>
                        ${section.questions.map(q => {
                            const question = poll.sections?.flatMap(s => s.questions || []).find(sq => sq.id === q.questionId);
                            let content = '';
                            
                            if (q.optionCounts && Object.keys(q.optionCounts).length > 0) {
                                const total = Object.values(q.optionCounts).reduce((sum, c) => sum + c, 0);
                                content = Object.entries(q.optionCounts)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([optId, count]) => {
                                        const opt = question?.options?.find(o => o.id === optId);
                                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                        return `<div class="option"><span>${opt?.text || optId}</span><span>${count} (${pct}%)</span></div>`;
                                    }).join('');
                            } else if (q.average !== undefined) {
                                content = `<p>Average: <strong>${q.average.toFixed(1)}</strong></p>`;
                            } else if (q.textResponses && q.textResponses.length > 0) {
                                content = `<p>${q.textResponses.length} text responses</p>`;
                            }
                            
                            return `<div class="question"><div class="question-text">${q.questionText}</div>${content}</div>`;
                        }).join('')}
                    `).join('')}
                    
                    ${npsQuestions.length > 0 ? `
                        <h2>NPS Summary</h2>
                        ${npsQuestions.map(item => `
                            <div class="nps">
                                <div class="nps-score" style="color: ${item.nps.score >= 30 ? '#10b981' : item.nps.score >= 0 ? '#eab308' : '#ef4444'}">
                                    ${item.nps.score > 0 ? '+' : ''}${item.nps.score}
                                </div>
                                <p>${item.questionText}</p>
                                <p style="color: #64748b; font-size: 14px;">
                                    Promoters: ${item.nps.promoterPct}% • Passives: ${item.nps.passivePct}% • Detractors: ${item.nps.detractorPct}%
                                </p>
                            </div>
                        `).join('')}
                    ` : ''}
                </body>
                </html>
            `;
            
            // Open print dialog
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 250);
            }
        } finally {
            setTimeout(() => setExportLoading(null), 500);
        }
    };
    
    // Handle date filter
    const handleDateFilter = useCallback((filtered: SurveyResponse[] | null) => {
        setFilteredResponses(filtered);
    }, []);
    
    const totalResponses = responses.length;
    const totalAllResponses = allResponses.length; // Total before filtering
    // Treat responses as complete if they exist (submitted = complete)
    const completeResponses = responses.filter(r => r.isComplete !== false).length;
    
    // Calculate average completion time (in seconds)
    const responsesWithTime = responses.filter(r => r.completionTime && r.completionTime > 0);
    const avgCompletionTime = responsesWithTime.length > 0
        ? responsesWithTime.reduce((sum, r) => sum + (r.completionTime || 0), 0) / responsesWithTime.length
        : 0;
    
    // Format time display
    const formatTime = (seconds: number) => {
        if (seconds <= 0) return '-';
        if (seconds < 60) return `${Math.round(seconds)}s`;
        return `${Math.round(seconds / 60)}m`;
    };
    
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
                    <p className="text-3xl font-bold">{formatTime(avgCompletionTime)}</p>
                    <p className="text-amber-100 text-sm">Avg. Time</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-4 text-white">
                    <TrendingUp size={24} className="mb-2 opacity-80" />
                    <p className="text-3xl font-bold">
                        {totalResponses > 0 ? Math.round((completeResponses / totalResponses) * 100) : 100}%
                    </p>
                    <p className="text-pink-100 text-sm">Completion Rate</p>
                </div>
            </div>
            
            {/* Export Buttons */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Export:</span>
                
                {tierConfig.canExportCSV ? (
                    <button
                        onClick={handleExportCSV}
                        disabled={exportLoading === 'csv'}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium text-sm transition"
                    >
                        {exportLoading === 'csv' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Download size={16} />
                            </motion.div>
                        ) : (
                            <Table size={16} />
                        )}
                        CSV
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed"
                    >
                        <Lock size={14} />
                        CSV
                        <Crown size={12} className="text-amber-500" />
                    </button>
                )}
                
                {tierConfig.canExportExcel ? (
                    <button
                        onClick={handleExportExcel}
                        disabled={exportLoading === 'excel'}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium text-sm transition"
                    >
                        {exportLoading === 'excel' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Download size={16} />
                            </motion.div>
                        ) : (
                            <FileSpreadsheet size={16} />
                        )}
                        Excel
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed"
                    >
                        <Lock size={14} />
                        Excel
                        <Crown size={12} className="text-amber-500" />
                    </button>
                )}
                
                {/* PDF Export */}
                {tierConfig.canExportPDF ? (
                    <button
                        onClick={handleExportPDF}
                        disabled={exportLoading === 'pdf'}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium text-sm transition"
                    >
                        {exportLoading === 'pdf' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Download size={16} />
                            </motion.div>
                        ) : (
                            <FileDown size={16} />
                        )}
                        PDF Report
                    </button>
                ) : (
                    <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium text-sm cursor-not-allowed"
                    >
                        <Lock size={14} />
                        PDF
                        <Crown size={12} className="text-amber-500" />
                    </button>
                )}
            </div>
            
            {/* Date Filter */}
            {totalAllResponses > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <DateFilter 
                        responses={allResponses} 
                        onFilter={handleDateFilter}
                        canUseCustom={tierConfig.canFilterByDate}
                    />
                    {isFiltered && (
                        <p className="text-xs text-slate-500 mt-2">
                            Showing {responses.length} of {allResponses.length} responses
                        </p>
                    )}
                </div>
            )}
            
            {/* ============================================ */}
            {/* VISUAL OVERVIEW - Charts for ALL users */}
            {/* ============================================ */}
            {totalResponses > 0 && (
                <div className="bg-white rounded-2xl border-2 border-indigo-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <BarChart3 size={20} />
                            Visual Overview
                        </h3>
                        <p className="text-indigo-100 text-sm">Quick insights from your survey responses</p>
                    </div>
                    
                    <div className="p-6">
                        {/* Show visualizable questions - multiple choice AND rating/scale */}
                        {(() => {
                            // Get multiple choice type questions
                            const choiceQuestions = sectionStats
                                .flatMap(s => s.questions.map(q => ({ ...q, sectionTitle: s.sectionTitle })))
                                .filter(q => ['multiple_choice', 'dropdown', 'yes_no'].includes(q.questionType) && q.optionCounts && Object.keys(q.optionCounts).length > 0);
                            
                            // Get rating/scale questions
                            const ratingQuestions = sectionStats
                                .flatMap(s => s.questions.map(q => ({ ...q, sectionTitle: s.sectionTitle })))
                                .filter(q => ['rating', 'scale'].includes(q.questionType) && q.distribution && Object.keys(q.distribution).length > 0);
                            
                            // Combine and limit
                            const allChartQuestions = [...choiceQuestions, ...ratingQuestions];
                            const chartQuestions = allChartQuestions.slice(0, isPaidUser ? 6 : 3);
                            
                            if (chartQuestions.length === 0) {
                                // Debug: Show why there are no charts
                                console.log('SurveyResults Visual Overview: No charts to show');
                                console.log('- sectionStats length:', sectionStats.length);
                                console.log('- choiceQuestions length:', choiceQuestions.length);
                                console.log('- ratingQuestions length:', ratingQuestions.length);
                                console.log('- poll.sections exists:', !!poll.sections);
                                console.log('- poll.sections length:', poll.sections?.length || 0);
                                console.log('- responses length:', responses.length);
                                
                                // Show different message based on the issue
                                if (!poll.sections || poll.sections.length === 0) {
                                    return (
                                        <div className="text-center py-8 text-slate-500">
                                            <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
                                            <p>Survey structure not loaded</p>
                                            <p className="text-sm mt-1">Try refreshing the page</p>
                                        </div>
                                    );
                                }
                                
                                if (responses.length === 0) {
                                    return (
                                        <div className="text-center py-8 text-slate-500">
                                            <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
                                            <p>No responses to visualize yet</p>
                                            <p className="text-sm mt-1">Charts will appear once you receive responses</p>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div className="text-center py-8 text-slate-500">
                                        <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
                                        <p>No visualizable questions found</p>
                                        <p className="text-sm mt-1">This survey may only contain text questions</p>
                                    </div>
                                );
                            }
                            
                            return (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {chartQuestions.map((q, idx) => {
                                        // Find the question to get option text
                                        const questionData = poll.sections
                                            ?.flatMap(s => s.questions || [])
                                            .find(sq => sq.id === q.questionId);
                                        
                                        // Handle rating/scale questions
                                        if (['rating', 'scale'].includes(q.questionType) && q.distribution) {
                                            const dist = q.distribution;
                                            const total = Object.values(dist).reduce((sum, c) => sum + c, 0);
                                            const minVal = questionData?.minValue ?? 1;
                                            const maxVal = questionData?.maxValue ?? 5;
                                            
                                            return (
                                                <div key={q.questionId} className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-xs text-indigo-600 font-medium mb-1">{q.sectionTitle}</p>
                                                    <p className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2">{q.questionText}</p>
                                                    
                                                    {/* Average display */}
                                                    {q.average !== undefined && (
                                                        <div className="text-center mb-3">
                                                            <span className="text-3xl font-bold text-indigo-600">{q.average.toFixed(1)}</span>
                                                            <span className="text-slate-400 text-sm ml-1">/ {maxVal}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Distribution bars */}
                                                    <div className="space-y-1">
                                                        {Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i).map((val, i) => {
                                                            const count = dist[val] || 0;
                                                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                                            const colors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-400'];
                                                            const colorIndex = Math.floor((val - minVal) / (maxVal - minVal) * (colors.length - 1));
                                                            
                                                            return (
                                                                <div key={val} className="flex items-center gap-2 text-xs">
                                                                    <span className="w-4 text-right text-slate-500">{val}</span>
                                                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${pct}%` }}
                                                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                                                            className={`h-full ${colors[colorIndex]} rounded-full`}
                                                                        />
                                                                    </div>
                                                                    <span className="w-8 text-slate-500">{pct}%</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-2 text-center">{total} response{total !== 1 ? 's' : ''}</p>
                                                </div>
                                            );
                                        }
                                        
                                        // Handle multiple choice questions
                                        const total = Object.values(q.optionCounts || {}).reduce((sum, c) => sum + c, 0);
                                        const sortedEntries = Object.entries(q.optionCounts || {})
                                            .sort(([,a], [,b]) => b - a);
                                        
                                        return (
                                            <div key={q.questionId} className="bg-slate-50 rounded-xl p-4">
                                                <p className="text-xs text-indigo-600 font-medium mb-1">{q.sectionTitle}</p>
                                                <p className="text-sm font-semibold text-slate-800 mb-4 line-clamp-2">{q.questionText}</p>
                                                
                                                {/* Mini bar chart */}
                                                <div className="space-y-2">
                                                    {sortedEntries.slice(0, 4).map(([optId, count], i) => {
                                                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                                        const optText = questionData?.options?.find(o => o.id === optId)?.text || optId;
                                                        const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];
                                                        
                                                        return (
                                                            <div key={optId}>
                                                                <div className="flex justify-between text-xs mb-1">
                                                                    <span className="text-slate-600 truncate max-w-[70%]">{optText}</span>
                                                                    <span className="font-medium text-slate-700">{pct}%</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${pct}%` }}
                                                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                                                        className={`h-full ${colors[i % colors.length]} rounded-full`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {sortedEntries.length > 4 && (
                                                        <p className="text-xs text-slate-400">+{sortedEntries.length - 4} more options</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                        
                        {/* Word Cloud Section */}
                        {allTextResponses.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                    <Cloud size={18} className="text-indigo-500" />
                                    Word Cloud
                                    <span className="text-xs text-slate-500 font-normal">
                                        from {allTextResponses.length} text response{allTextResponses.length !== 1 ? 's' : ''}
                                    </span>
                                </h4>
                                <div className="bg-white rounded-xl border border-slate-200 p-4">
                                    <WordCloud 
                                        words={wordFrequencies} 
                                        locked={!tierConfig.canViewWordCloud}
                                        maxWords={isPaidUser ? 40 : 20}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Upgrade prompt for more charts */}
                        {!isPaidUser && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Crown size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 mb-1">Unlock Advanced Visualizations</h4>
                                        <p className="text-sm text-slate-600 mb-3">
                                            Get pie charts, donut charts, word clouds, and more with Pro.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 flex items-center gap-1">
                                                <BarChart3 size={12} className="text-purple-500" /> Pie &amp; Donut Charts
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 flex items-center gap-1">
                                                <FileText size={12} className="text-purple-500" /> Word Clouds
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 flex items-center gap-1">
                                                <TrendingUp size={12} className="text-purple-500" /> NPS Gauges
                                            </span>
                                            <span className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 flex items-center gap-1">
                                                <Download size={12} className="text-purple-500" /> PDF Reports
                                            </span>
                                        </div>
                                        <a
                                            href="/pricing"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg text-sm hover:shadow-lg transition"
                                        >
                                            <Crown size={14} />
                                            Upgrade to Pro
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* NPS Summary - Enhanced with Gauge for Pro+ */}
            {npsQuestions.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        NPS Overview
                        {isPaidUser && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Enhanced</span>}
                    </h3>
                    
                    {/* Enhanced Gauge Display for Paid Users */}
                    {isPaidUser && npsQuestions.length === 1 && (
                        <div className="flex flex-col items-center mb-6 p-6 bg-white rounded-xl border border-blue-100">
                            <NPSGauge score={npsQuestions[0].nps.score} size="lg" />
                            <p className="text-sm text-slate-600 mt-4 text-center max-w-md">
                                {npsQuestions[0].questionText}
                            </p>
                            <div className="flex gap-6 mt-4 text-sm">
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1" />
                                    <span className="font-bold text-emerald-600">{npsQuestions[0].nps.promoterPct}%</span>
                                    <p className="text-xs text-slate-500">Promoters</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-amber-400 rounded-full mx-auto mb-1" />
                                    <span className="font-bold text-amber-600">{npsQuestions[0].nps.passivePct}%</span>
                                    <p className="text-xs text-slate-500">Passives</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-3 h-3 bg-red-400 rounded-full mx-auto mb-1" />
                                    <span className="font-bold text-red-600">{npsQuestions[0].nps.detractorPct}%</span>
                                    <p className="text-xs text-slate-500">Detractors</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Multiple NPS Questions or Free Users - Card Grid */}
                    {(npsQuestions.length > 1 || !isPaidUser) && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {npsQuestions.map((item, i) => {
                                if (!item || !item.nps) return null;
                                return (
                                    <div key={i} className="bg-white rounded-xl p-4 border border-blue-100">
                                        <p className="text-xs text-slate-500 mb-1">{item.sectionTitle}</p>
                                        <p className="text-sm font-medium text-slate-700 mb-3 line-clamp-2">{item.questionText}</p>
                                        
                                        {/* Show mini gauge for paid users with multiple questions */}
                                        {isPaidUser ? (
                                            <div className="flex flex-col items-center">
                                                <NPSGauge score={item.nps.score} size="sm" />
                                                <div className="flex gap-2 mt-2 text-xs">
                                                    <span className="text-emerald-600">{item.nps.promoterPct}%</span>
                                                    <span className="text-amber-600">{item.nps.passivePct}%</span>
                                                    <span className="text-red-600">{item.nps.detractorPct}%</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span className={`text-3xl font-black ${
                                                    item.nps.score >= 30 ? 'text-emerald-600' :
                                                    item.nps.score >= 0 ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                    {item.nps.score > 0 ? '+' : ''}{item.nps.score}
                                                </span>
                                                <div className="flex h-2 w-24 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500" style={{ width: `${item.nps.promoterPct || 0}%` }} />
                                                    <div className="bg-amber-400" style={{ width: `${item.nps.passivePct || 0}%` }} />
                                                    <div className="bg-red-400" style={{ width: `${item.nps.detractorPct || 0}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {/* Upgrade hint for free users */}
                    {!isPaidUser && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                            <Crown size={14} className="text-amber-500" />
                            <a href="/pricing" className="hover:underline">Upgrade to Pro for enhanced NPS gauges</a>
                        </div>
                    )}
                </div>
            )}
            
            {/* View Toggle - Detailed Results */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                    Detailed Results
                    <span className="text-sm font-normal text-slate-500 ml-2">by question</span>
                </h2>
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
                        onClick={() => tierConfig.canViewIndividual && !isAnonymous && setViewMode('individual')}
                        disabled={!tierConfig.canViewIndividual || isAnonymous}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                            viewMode === 'individual' && tierConfig.canViewIndividual && !isAnonymous 
                                ? 'bg-white shadow text-indigo-600' 
                                : !tierConfig.canViewIndividual || isAnonymous 
                                    ? 'text-slate-400 cursor-not-allowed' 
                                    : 'text-slate-600'
                        }`}
                        title={
                            isAnonymous ? 'Disabled: Anonymous mode is active' : 
                            !tierConfig.canViewIndividual ? 'Upgrade to Pro to view individual responses' : 
                            undefined
                        }
                    >
                        <Eye size={16} /> Individual
                        {(!tierConfig.canViewIndividual || isAnonymous) && <Lock size={12} />}
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
                                            <p className="text-sm text-slate-500">{section.questions?.length || 0} questions</p>
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
                                                {(section.questions || []).map((questionStats, qIdx) => {
                                                    const question = pollSection?.questions?.[qIdx];
                                                    if (!question) return null;
                                                    return (
                                                        <QuestionResult 
                                                            key={questionStats.questionId} 
                                                            stats={questionStats} 
                                                            question={question}
                                                            isAnonymous={isAnonymous}
                                                            tier={tier}
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
            {viewMode === 'individual' && tierConfig.canViewIndividual && !isAnonymous && (
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
                                        {(section.questions || []).map(question => {
                                            const answer = response.answers?.[question.id];
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
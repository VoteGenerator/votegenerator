// ============================================================================
// Anonymous Mode Components for SurveyResults
// Location: Add to src/components/SurveyResults.tsx or create separate file
// 
// These components handle the anonymous mode display logic:
// - AnonymousModeNotice: Banner explaining anonymous mode is active
// - AnonymousResultsView: Aggregated-only view (no individual responses)
// - Integration code for your existing SurveyResults
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Lock, Eye, EyeOff, BarChart3, Users, 
    Download, Info, CheckCircle, AlertCircle
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface SurveySettings {
    anonymousMode?: boolean;
    hideResults?: boolean;
    // ... other existing settings
}

// ============================================================================
// ANONYMOUS MODE TOGGLE - For SurveyBuilder Settings
// ============================================================================

interface AnonymousModeToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean; // Disable after first response
}

export const AnonymousModeToggle: React.FC<AnonymousModeToggleProps> = ({ 
    enabled, 
    onChange,
    disabled = false 
}) => {
    return (
        <div className={`p-5 rounded-2xl border-2 transition-all ${
            enabled 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-slate-50 border-slate-200'
        } ${disabled ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={20} className={enabled ? 'text-emerald-600' : 'text-slate-400'} />
                        <h4 className="font-semibold text-slate-800">Anonymous Mode</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                        When enabled, you'll only see aggregated results—no individual responses, 
                        no timestamps. Recommended for sensitive employee feedback.
                    </p>
                    
                    {enabled && (
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle size={14} />
                                <span>Individual responses hidden from your view</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle size={14} />
                                <span>Respondents see "Your response is anonymous" badge</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle size={14} />
                                <span>Open-ended feedback shown shuffled (no attribution)</span>
                            </div>
                        </div>
                    )}
                    
                    {disabled && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
                            <AlertCircle size={14} />
                            <span>Cannot change after responses are collected</span>
                        </div>
                    )}
                </div>
                
                {/* Toggle Switch */}
                <button
                    onClick={() => !disabled && onChange(!enabled)}
                    disabled={disabled}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                        enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <motion.div
                        animate={{ x: enabled ? 24 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                    />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// ANONYMOUS BADGE - Shown to respondents when filling out anonymous survey
// ============================================================================

export const AnonymousBadge: React.FC = () => {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            <Shield size={16} />
            Your response is anonymous
        </div>
    );
};

// ============================================================================
// ANONYMOUS MODE NOTICE - Banner in Results Dashboard
// ============================================================================

interface AnonymousModeNoticeProps {
    responseCount: number;
}

export const AnonymousModeNotice: React.FC<AnonymousModeNoticeProps> = ({ responseCount }) => {
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
                        You're viewing aggregated data only.
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
// VIEW MODE TABS - Modified to disable Individual tab when anonymous
// ============================================================================

interface ViewModeTabsProps {
    activeView: 'summary' | 'individual';
    onViewChange: (view: 'summary' | 'individual') => void;
    isAnonymous: boolean;
    responseCount: number;
}

export const ViewModeTabs: React.FC<ViewModeTabsProps> = ({ 
    activeView, 
    onViewChange, 
    isAnonymous,
    responseCount 
}) => {
    return (
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
                onClick={() => onViewChange('summary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                    activeView === 'summary'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                }`}
            >
                <BarChart3 size={16} />
                Summary
            </button>
            
            <button
                onClick={() => !isAnonymous && onViewChange('individual')}
                disabled={isAnonymous}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                    activeView === 'individual' && !isAnonymous
                        ? 'bg-white text-slate-800 shadow-sm'
                        : isAnonymous
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-slate-600 hover:text-slate-800'
                }`}
                title={isAnonymous ? 'Disabled: Anonymous mode is active' : undefined}
            >
                <Users size={16} />
                Individual
                {isAnonymous && <Lock size={12} className="ml-1" />}
            </button>
        </div>
    );
};

// ============================================================================
// ANONYMOUS TEXT RESPONSES - Shows open-ended feedback shuffled
// ============================================================================

interface AnonymousTextResponsesProps {
    responses: string[];
    questionText: string;
}

export const AnonymousTextResponses: React.FC<AnonymousTextResponsesProps> = ({ 
    responses, 
    questionText 
}) => {
    // Shuffle responses so order doesn't reveal identity
    const shuffledResponses = useMemo(() => {
        const filtered = responses.filter(r => r && r.trim().length > 0);
        // Fisher-Yates shuffle
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [responses]);

    if (shuffledResponses.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h4 className="font-semibold text-slate-800 mb-1">{questionText}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-2">
                    <Shield size={14} className="text-emerald-500" />
                    {shuffledResponses.length} responses shown in random order
                </p>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {shuffledResponses.map((text, i) => (
                    <div key={i} className="p-4 text-slate-700 hover:bg-slate-50 transition">
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// COMPARISON: Normal vs Anonymous Results View
// This shows what's different between the two modes
// ============================================================================

export const AnonymousModeComparison: React.FC = () => {
    const [mode, setMode] = useState<'normal' | 'anonymous'>('normal');
    
    const mockResponses = [
        { id: 1, name: 'Sarah M.', timestamp: '2:34 PM', rating: 4, feedback: 'Love the new direction!' },
        { id: 2, name: 'Anonymous', timestamp: '2:41 PM', rating: 5, feedback: 'Great leadership' },
        { id: 3, name: 'John D.', timestamp: '3:15 PM', rating: 3, feedback: 'Need better communication' },
    ];

    return (
        <div className="bg-slate-50 rounded-2xl p-6">
            <h4 className="font-bold text-slate-800 mb-4">What you see as admin:</h4>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-white rounded-xl w-fit mb-6 border border-slate-200">
                <button
                    onClick={() => setMode('normal')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        mode === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-600'
                    }`}
                >
                    Normal Mode
                </button>
                <button
                    onClick={() => setMode('anonymous')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                        mode === 'anonymous' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                    }`}
                >
                    <Shield size={14} />
                    Anonymous Mode
                </button>
            </div>

            {mode === 'normal' ? (
                /* Normal Mode View */
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Individual Responses</span>
                        <span className="text-sm text-slate-500">3 responses</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {mockResponses.map((r) => (
                            <div key={r.id} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-800">{r.name}</span>
                                    <span className="text-xs text-slate-400">{r.timestamp}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(s => (
                                        <div key={s} className={`w-4 h-4 rounded ${s <= r.rating ? 'bg-amber-400' : 'bg-slate-200'}`} />
                                    ))}
                                    <span className="ml-2 text-sm text-slate-600">{r.rating}/5</span>
                                </div>
                                <p className="text-sm text-slate-600">{r.feedback}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 text-center text-sm text-slate-400">
                        ⚠️ Admin can see WHO responded and WHEN
                    </div>
                </div>
            ) : (
                /* Anonymous Mode View */
                <div className="space-y-4">
                    {/* Aggregated Stats Only */}
                    <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                        <div className="p-3 border-b border-emerald-100 bg-emerald-50 flex items-center gap-2">
                            <Shield size={16} className="text-emerald-600" />
                            <span className="font-medium text-emerald-800">Aggregated Results Only</span>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">3</p>
                                    <p className="text-xs text-slate-500">Responses</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">4.0</p>
                                    <p className="text-xs text-slate-500">Avg Rating</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600">80%</p>
                                    <p className="text-xs text-slate-500">Positive</p>
                                </div>
                            </div>
                            
                            {/* Rating Distribution */}
                            <div className="space-y-2">
                                {[5,4,3,2,1].map(rating => {
                                    const count = mockResponses.filter(r => r.rating === rating).length;
                                    const pct = (count / mockResponses.length) * 100;
                                    return (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 w-3">{rating}</span>
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-500 w-6">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Shuffled Text Responses */}
                    <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                        <div className="p-3 border-b border-emerald-100 bg-emerald-50">
                            <span className="font-medium text-emerald-800">Open Feedback</span>
                            <span className="text-sm text-emerald-600 ml-2">(shuffled)</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {/* Randomly ordered, no names or timestamps */}
                            <div className="p-3 text-sm text-slate-600">Need better communication</div>
                            <div className="p-3 text-sm text-slate-600">Great leadership</div>
                            <div className="p-3 text-sm text-slate-600">Love the new direction!</div>
                        </div>
                    </div>
                    
                    <div className="p-3 text-center text-sm text-emerald-600 bg-emerald-50 rounded-lg">
                        ✓ Admin sees aggregated data only — no way to identify individuals
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// CSV EXPORT FOR ANONYMOUS SURVEYS
// ============================================================================

interface AnonymousExportData {
    surveyTitle: string;
    totalResponses: number;
    questions: {
        text: string;
        type: string;
        stats: {
            average?: number;
            distribution?: Record<string, number>;
        };
        textResponses?: string[];
    }[];
}

export const generateAnonymousCSV = (data: AnonymousExportData): string => {
    const lines: string[] = [];
    
    lines.push('ANONYMOUS SURVEY RESULTS');
    lines.push(`Survey: ${data.surveyTitle}`);
    lines.push(`Total Responses: ${data.totalResponses}`);
    lines.push(`Export Date: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('NOTE: Individual responses hidden due to anonymous mode.');
    lines.push('This export contains aggregated data only.');
    lines.push('');
    lines.push('---');
    lines.push('');
    
    data.questions.forEach((q, i) => {
        lines.push(`QUESTION ${i + 1}: ${q.text}`);
        lines.push(`Type: ${q.type}`);
        
        if (q.stats.average !== undefined) {
            lines.push(`Average: ${q.stats.average.toFixed(2)}`);
        }
        
        if (q.stats.distribution) {
            lines.push('Distribution:');
            Object.entries(q.stats.distribution).forEach(([key, count]) => {
                const pct = ((count / data.totalResponses) * 100).toFixed(1);
                lines.push(`  ${key}: ${count} (${pct}%)`);
            });
        }
        
        if (q.textResponses && q.textResponses.length > 0) {
            lines.push('');
            lines.push('Open Feedback (shuffled):');
            // Shuffle before export
            const shuffled = [...q.textResponses].sort(() => Math.random() - 0.5);
            shuffled.forEach((text, j) => {
                lines.push(`  ${j + 1}. ${text}`);
            });
        }
        
        lines.push('');
        lines.push('---');
        lines.push('');
    });
    
    return lines.join('\n');
};

// ============================================================================
// INTEGRATION EXAMPLE - How to use in existing SurveyResults.tsx
// ============================================================================

/*
import { 
    AnonymousModeNotice, 
    ViewModeTabs, 
    AnonymousTextResponses,
    generateAnonymousCSV 
} from './AnonymousModeComponents';

const SurveyResults: React.FC<Props> = ({ poll, responses }) => {
    const isAnonymous = poll.settings?.anonymousMode === true;
    const [viewMode, setViewMode] = useState<'summary' | 'individual'>('summary');
    
    // Force summary view if anonymous
    useEffect(() => {
        if (isAnonymous && viewMode === 'individual') {
            setViewMode('summary');
        }
    }, [isAnonymous, viewMode]);
    
    const handleExport = () => {
        if (isAnonymous) {
            const csv = generateAnonymousCSV({
                surveyTitle: poll.question,
                totalResponses: responses.length,
                questions: // ... map your questions
            });
            downloadCSV(csv, 'anonymous-results.csv');
        } else {
            // Normal export with individual data
            exportNormalCSV(poll, responses);
        }
    };
    
    return (
        <div>
            {isAnonymous && <AnonymousModeNotice responseCount={responses.length} />}
            
            <ViewModeTabs 
                activeView={viewMode}
                onViewChange={setViewMode}
                isAnonymous={isAnonymous}
                responseCount={responses.length}
            />
            
            {viewMode === 'summary' && <SummaryView ... />}
            
            {viewMode === 'individual' && !isAnonymous && <IndividualView ... />}
            
            {isAnonymous && textQuestions.map(q => (
                <AnonymousTextResponses 
                    key={q.id}
                    questionText={q.question}
                    responses={getTextResponsesForQuestion(q.id)}
                />
            ))}
        </div>
    );
};
*/

export default {
    AnonymousModeToggle,
    AnonymousBadge,
    AnonymousModeNotice,
    ViewModeTabs,
    AnonymousTextResponses,
    AnonymousModeComparison,
    generateAnonymousCSV
};
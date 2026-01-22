// ============================================================================
// PublicResults.tsx - ULTRA WOW Public Results Page
// Mobile-first, animated, conversion-optimized showcase
// Location: src/components/PublicResults.tsx
// ============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Users, BarChart3, PieChart,
    Share2, Copy, Check, Twitter, Linkedin, Facebook,
    Sparkles, Vote, Crown, ArrowRight, Eye, Clock, Zap, Star
} from 'lucide-react';

interface PublicResultsProps {
    pollId: string;
    shareKey?: string;
}

// Floating particles background
const FloatingParticles: React.FC = () => {
    const particles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5
    }));
    
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{ 
                        width: p.size, 
                        height: p.size, 
                        left: `${p.x}%`, 
                        top: `${p.y}%`,
                        background: `radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 100%)`
                    }}
                    animate={{
                        y: [0, -80, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// Epic confetti explosion
const ConfettiExplosion: React.FC<{ show: boolean }> = ({ show }) => {
    if (!show) return null;
    
    const confetti = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: 50,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#a855f7'][Math.floor(Math.random() * 8)],
        angle: (i / 100) * 360 + Math.random() * 30,
        velocity: 8 + Math.random() * 15,
        spin: Math.random() * 1080 - 540,
        size: 8 + Math.random() * 10,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
    }));
    
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {confetti.map(c => {
                const rad = c.angle * (Math.PI / 180);
                const endX = Math.cos(rad) * c.velocity * 25;
                const endY = Math.sin(rad) * c.velocity * 20 + 50;
                return (
                    <motion.div
                        key={c.id}
                        className="absolute"
                        style={{
                            left: '50%',
                            top: '40%',
                            width: c.size,
                            height: c.shape === 'circle' ? c.size : c.size * 0.6,
                            backgroundColor: c.color,
                            borderRadius: c.shape === 'circle' ? '50%' : 3
                        }}
                        initial={{ scale: 0, rotate: 0, opacity: 1, x: 0, y: 0 }}
                        animate={{
                            x: `${endX}vw`,
                            y: `${endY}vh`,
                            scale: [0, 1.5, 1, 0.5],
                            rotate: c.spin,
                            opacity: [1, 1, 1, 0]
                        }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                );
            })}
        </div>
    );
};

// Animated counter with easing
const AnimatedNumber: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
    value, suffix = '', duration = 2 
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setDisplayValue(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);
    
    return <>{displayValue.toLocaleString()}{suffix}</>;
};

// Glowing stat card with hover effects
const StatCard: React.FC<{
    icon: React.ReactNode;
    value: string | number;
    label: string;
    gradient: string;
    delay?: number;
}> = ({ icon, value, label, gradient, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08, y: -8 }}
        className="relative group cursor-default"
    >
        {/* Glow */}
        <div className={`absolute inset-0 ${gradient} rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500`} />
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50">
            <div className="flex items-center gap-3">
                <motion.div 
                    className={`w-11 h-11 ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    {icon}
                </motion.div>
                <div>
                    <div className="text-2xl font-black text-slate-800">
                        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const PublicResults: React.FC<PublicResultsProps> = ({ pollId, shareKey }) => {
    const [poll, setPoll] = useState<any>(null);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeView, setActiveView] = useState<'bar' | 'pie'>('bar');
    
    // Ad wall state for free tier
    const [adWallPassed, setAdWallPassed] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    // Check if this is a free tier poll
    const isFreeTier = poll?.tier === 'free' || !poll?.tier;
    
    // Detect if this is a survey
    const isSurvey = poll?.isSurvey || poll?.type === 'survey' || poll?.pollType === 'survey' || poll?.sections?.length > 0;
    
    // Fetch results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/.netlify/functions/vg-get-public-results?pollId=${pollId}${shareKey ? `&shareKey=${shareKey}` : ''}`);
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    if (response.status === 404) {
                        setError('Poll not found');
                    } else if (response.status === 403) {
                        setError(errorData.hint || 'Results are not public');
                    } else {
                        setError('Failed to load');
                    }
                    return;
                }
                
                const data = await response.json();
                setPoll(data.poll);
                setResults(data.results);
                
                // Trigger celebration
                setTimeout(() => {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3500);
                }, 600);
            } catch (err) {
                setError('Unable to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [pollId, shareKey]);
    
    // Countdown timer for ad wall (free tier only)
    useEffect(() => {
        if (!loading && isFreeTier && !adWallPassed && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [loading, isFreeTier, adWallPassed, countdown]);
    
    // Process results
    const resultsData = useMemo(() => {
        if (!poll || !results) return null;
        
        const simpleCounts = results.simpleCounts || {};
        const totalVotes = results.totalVotes || 0;
        
        // For surveys, options might be empty - return minimal data
        const options = poll.options || [];
        const sortedOptions = options
            .map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                count: simpleCounts[opt.id] || 0,
                percentage: totalVotes > 0 ? ((simpleCounts[opt.id] || 0) / totalVotes) * 100 : 0
            }))
            .sort((a: any, b: any) => b.count - a.count);
        
        return { totalVotes, sortedOptions, winner: sortedOptions[0] || null };
    }, [poll, results]);
    
    // Process survey results - must be before any early returns to maintain hooks order
    const surveyStats = useMemo(() => {
        console.log('=== surveyStats ENTRY ===');
        console.log('isSurvey:', isSurvey);
        console.log('poll:', poll);
        console.log('poll?.sections:', poll?.sections);
        console.log('results:', results);
        console.log('results?.surveyResponses:', results?.surveyResponses);
        
        if (!isSurvey || !poll?.sections) {
            console.log('surveyStats: EXITING EARLY - Not a survey or no sections', { isSurvey, hasSections: !!poll?.sections });
            return null;
        }
        
        let responses = results?.surveyResponses || [];
        const sections = poll.sections || [];
        
        console.log('=== PublicResults Survey Debug ===');
        console.log('isSurvey:', isSurvey);
        console.log('poll.isSurvey:', poll?.isSurvey);
        console.log('poll.type:', poll?.type);
        console.log('poll.pollType:', poll?.pollType);
        console.log('sections count:', sections.length);
        console.log('responses count (from surveyResponses):', responses.length);
        console.log('results.totalVotes:', results?.totalVotes);
        console.log('results.votes count:', results?.votes?.length);
        console.log('Full results object keys:', Object.keys(results || {}));
        console.log('Full results object:', results);
        
        // FRONTEND FALLBACK: If no surveyResponses but we have votes, try to extract from votes
        if (responses.length === 0 && results?.votes?.length > 0) {
            console.log('⚠️ No surveyResponses, attempting to extract from votes...');
            const extractedResponses: any[] = [];
            
            for (const vote of results.votes) {
                console.log('Checking vote:', vote);
                console.log('vote keys:', Object.keys(vote));
                
                // Check if vote has surveyAnswers
                if (vote.surveyAnswers && Object.keys(vote.surveyAnswers).length > 0) {
                    console.log('Found vote.surveyAnswers:', Object.keys(vote.surveyAnswers));
                    extractedResponses.push({
                        id: vote.id,
                        answers: vote.surveyAnswers,
                        submittedAt: vote.votedAt
                    });
                }
                // Check if vote has answers
                else if (vote.answers && Object.keys(vote.answers).length > 0) {
                    console.log('Found vote.answers:', Object.keys(vote.answers));
                    extractedResponses.push({
                        id: vote.id,
                        answers: vote.answers,
                        submittedAt: vote.votedAt
                    });
                }
                // Check if vote itself contains question IDs (q_xxx format)
                else {
                    const questionAnswers: Record<string, any> = {};
                    for (const key of Object.keys(vote)) {
                        if (key.startsWith('q_') || key.match(/^[a-f0-9]{8,}/)) {
                            questionAnswers[key] = vote[key];
                        }
                    }
                    if (Object.keys(questionAnswers).length > 0) {
                        console.log('Found answers in vote root:', Object.keys(questionAnswers));
                        extractedResponses.push({
                            id: vote.id,
                            answers: questionAnswers,
                            submittedAt: vote.votedAt
                        });
                    }
                }
            }
            
            if (extractedResponses.length > 0) {
                console.log(`✓ Extracted ${extractedResponses.length} responses from votes`);
                responses = extractedResponses;
            }
        }
        
        console.log('FINAL responses to process:', responses.length);
        console.log('FINAL responses[0]:', responses[0]);
        
        if (responses[0]) {
            console.log('First response:', responses[0]);
            console.log('First response answers:', responses[0].answers);
            console.log('First response answer keys:', Object.keys(responses[0].answers || {}));
        }
        if (sections[0]?.questions?.[0]) {
            console.log('First question:', sections[0].questions[0]);
            console.log('First question id:', sections[0].questions[0].id);
            console.log('First question key:', sections[0].questions[0].key);
            console.log('First question type:', sections[0].questions[0].type);
            console.log('First question name:', sections[0].questions[0].name);
        }
        
        // Log ALL question IDs vs answer keys for debugging
        const allQuestionIds: string[] = [];
        const allQuestionKeys: string[] = [];
        sections.forEach((s: any) => {
            s.questions?.forEach((q: any) => {
                allQuestionIds.push(q.id);
                if (q.key) allQuestionKeys.push(q.key);
                if (q.name) allQuestionKeys.push(q.name);
            });
        });
        console.log('All question IDs:', allQuestionIds);
        console.log('All question keys/names:', allQuestionKeys);
        if (responses[0]?.answers) {
            console.log('All answer keys:', Object.keys(responses[0].answers));
            // Check for direct matches
            allQuestionIds.forEach(qId => {
                const hasMatch = responses[0].answers[qId] !== undefined;
                console.log(`  Question ID "${qId}" has answer: ${hasMatch}`);
            });
            allQuestionKeys.forEach(qKey => {
                const hasMatch = responses[0].answers[qKey] !== undefined;
                console.log(`  Question KEY "${qKey}" has answer: ${hasMatch}`);
            });
        }
        
        // Calculate stats for each question
        const questionStats: any[] = [];
        const processedIds = new Set<string>(); // Prevent duplicates
        
        sections.forEach((section: any) => {
            section.questions?.forEach((question: any) => {
                // Skip if question or question.id is missing
                if (!question || !question.id) {
                    console.log('Skipping invalid question:', question);
                    return;
                }
                
                // Skip if already processed (prevent duplicates)
                if (processedIds.has(question.id)) {
                    return;
                }
                processedIds.add(question.id);
                
                // Try multiple ways to find answers for this question
                const answers = responses
                    .map((r: any) => {
                        const ans = r.answers || {};
                        const qId = question.id;
                        const qKey = question.key;
                        const qName = question.name;
                        
                        // Try various key formats
                        // 1. Direct match by ID
                        if (ans[qId] !== undefined) return ans[qId];
                        // 2. Match by question.key (most likely for surveys!)
                        if (qKey && ans[qKey] !== undefined) return ans[qKey];
                        // 3. Match by question.name
                        if (qName && ans[qName] !== undefined) return ans[qName];
                        // 4. Without q_ prefix
                        if (ans[qId.replace(/^q_/, '')] !== undefined) return ans[qId.replace(/^q_/, '')];
                        // 5. With q_ prefix added
                        if (ans[`q_${qId}`] !== undefined) return ans[`q_${qId}`];
                        // 6. Match by numeric suffix (q_1234 -> 1234)
                        const numericPart = qId.match(/\d+$/)?.[0];
                        if (numericPart) {
                            // Check all answer keys for matching numeric suffix
                            for (const key of Object.keys(ans)) {
                                if (key.endsWith(numericPart) || key === numericPart) {
                                    return ans[key];
                                }
                            }
                        }
                        // 7. Fuzzy match - find key that contains the question id
                        for (const key of Object.keys(ans)) {
                            if (key.includes(qId) || qId.includes(key)) {
                                return ans[key];
                            }
                        }
                        // 8. Try lowercase matching
                        const ansLower: Record<string, any> = {};
                        for (const key of Object.keys(ans)) {
                            ansLower[key.toLowerCase()] = ans[key];
                        }
                        if (qKey && ansLower[qKey.toLowerCase()] !== undefined) return ansLower[qKey.toLowerCase()];
                        if (qName && ansLower[qName.toLowerCase()] !== undefined) return ansLower[qName.toLowerCase()];
                        
                        return null;
                    })
                    .filter((a: any) => a !== null && a !== undefined && a !== '');
                
                // Enhanced debug logging
                if (responses.length > 0 && answers.length === 0) {
                    console.log(`⚠️ No answers found for "${question.text || 'Untitled'}" (id=${question.id}, key=${question.key}, name=${question.name})`);
                    console.log('   Available answer keys in first response:', Object.keys(responses[0]?.answers || {}));
                } else {
                    console.log(`✓ Question "${(question.text || 'Untitled').substring(0, 30)}..." (key=${question.key || question.id}): ${answers.length} answers`);
                }
                if (answers[0]) console.log('   Sample answer:', answers[0]);
                
                // Helper to extract actual value from answer object
                // Answers can be: { number: 8 }, { selectedIds: ['a'] }, { text: '...' }, or flat values
                const extractValue = (ans: any, type: string) => {
                    if (ans === null || ans === undefined) return null;
                    
                    // If it's already a primitive value, return it
                    if (typeof ans !== 'object') return ans;
                    
                    // Extract based on expected type
                    if (['rating', 'scale', 'nps'].includes(type)) {
                        return ans.number ?? ans.rating ?? ans.scaleValue ?? ans.value ?? null;
                    }
                    if (['multiple_choice', 'dropdown', 'yes_no', 'checkbox'].includes(type)) {
                        return ans.selectedIds ?? ans.selected ?? (ans.value ? [ans.value] : null);
                    }
                    if (['text', 'textarea', 'email', 'phone'].includes(type)) {
                        return ans.text ?? ans.value ?? null;
                    }
                    if (type === 'ranking') {
                        return ans.ranking ?? ans.order ?? null;
                    }
                    if (type === 'matrix') {
                        return ans.matrix ?? null;
                    }
                    
                    // Fallback: try common properties
                    return ans.value ?? ans.number ?? ans.text ?? ans.selectedIds ?? ans;
                };
                
                const qType = question.type || 'unknown';
                
                // CHOICE QUESTIONS: multiple_choice, dropdown, yes_no, checkbox
                if (['multiple_choice', 'dropdown', 'yes_no', 'checkbox'].includes(qType)) {
                    const counts: Record<string, number> = {};
                    answers.forEach((answer: any) => {
                        // Extract the actual value
                        const extracted = extractValue(answer, qType);
                        
                        // Handle both single value and array of values
                        const values = Array.isArray(extracted) ? extracted : (extracted ? [extracted] : []);
                        values.forEach((val: string) => {
                            if (val) counts[val] = (counts[val] || 0) + 1;
                        });
                    });
                    
                    let options = question.options || [];
                    if (qType === 'yes_no') {
                        options = [{ id: 'yes', text: 'Yes' }, { id: 'no', text: 'No' }];
                    }
                    
                    const totalSelections = (Object.values(counts) as number[]).reduce((a: number, b: number) => a + b, 0);
                    const sortedResults = options.map((opt: any) => {
                        const optId = opt.id || opt;
                        const optText = opt.text || opt;
                        return {
                            id: optId,
                            text: optText,
                            count: counts[optId] || 0,
                            percentage: totalSelections > 0 ? ((counts[optId] || 0) / totalSelections) * 100 : 0
                        };
                    }).sort((a: any, b: any) => b.count - a.count);
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'choice',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length,
                        results: sortedResults,
                        isMultiSelect: qType === 'checkbox'
                    });
                }
                // RATING QUESTIONS: rating (stars)
                else if (qType === 'rating') {
                    const numericAnswers = answers
                        .map((a: any) => {
                            const val = extractValue(a, 'rating');
                            return Number(val);
                        })
                        .filter((n: number) => !isNaN(n) && n > 0);
                    const max = question.maxRating || question.max || 5;
                    const avg = numericAnswers.length > 0 
                        ? numericAnswers.reduce((sum: number, n: number) => sum + n, 0) / numericAnswers.length 
                        : 0;
                    
                    // Distribution of ratings
                    const distribution: Record<number, number> = {};
                    for (let i = 1; i <= max; i++) distribution[i] = 0;
                    numericAnswers.forEach((n: number) => {
                        if (distribution[n] !== undefined) distribution[n]++;
                    });
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'rating',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: numericAnswers.length,
                        average: avg,
                        max,
                        distribution
                    });
                }
                // SCALE QUESTIONS: scale (1-10 or custom)
                else if (qType === 'scale') {
                    const numericAnswers = answers
                        .map((a: any) => {
                            const val = extractValue(a, 'scale');
                            return Number(val);
                        })
                        .filter((n: number) => !isNaN(n));
                    const min = question.minScale || question.min || 1;
                    const max = question.maxScale || question.max || 10;
                    const avg = numericAnswers.length > 0 
                        ? numericAnswers.reduce((sum: number, n: number) => sum + n, 0) / numericAnswers.length 
                        : 0;
                    
                    // Distribution
                    const distribution: Record<number, number> = {};
                    for (let i = min; i <= max; i++) distribution[i] = 0;
                    numericAnswers.forEach((n: number) => {
                        if (distribution[n] !== undefined) distribution[n]++;
                    });
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'scale',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: numericAnswers.length,
                        average: avg,
                        min,
                        max,
                        distribution,
                        minLabel: question.minLabel,
                        maxLabel: question.maxLabel
                    });
                }
                // NPS QUESTIONS
                else if (qType === 'nps') {
                    const numericAnswers = answers
                        .map((a: any) => {
                            const val = extractValue(a, 'nps');
                            return Number(val);
                        })
                        .filter((n: number) => !isNaN(n));
                    const promoters = numericAnswers.filter((n: number) => n >= 9).length;
                    const passives = numericAnswers.filter((n: number) => n >= 7 && n <= 8).length;
                    const detractors = numericAnswers.filter((n: number) => n <= 6).length;
                    const total = numericAnswers.length;
                    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'nps',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: total,
                        npsScore,
                        promoters: total > 0 ? Math.round((promoters / total) * 100) : 0,
                        passives: total > 0 ? Math.round((passives / total) * 100) : 0,
                        detractors: total > 0 ? Math.round((detractors / total) * 100) : 0,
                        promoterCount: promoters,
                        passiveCount: passives,
                        detractorCount: detractors
                    });
                }
                // NUMBER QUESTIONS
                else if (qType === 'number') {
                    const numericAnswers = answers
                        .map((a: any) => {
                            const val = extractValue(a, 'number');
                            return Number(val);
                        })
                        .filter((n: number) => !isNaN(n));
                    const avg = numericAnswers.length > 0 
                        ? numericAnswers.reduce((sum: number, n: number) => sum + n, 0) / numericAnswers.length 
                        : 0;
                    const minVal = numericAnswers.length > 0 ? Math.min(...numericAnswers) : 0;
                    const maxVal = numericAnswers.length > 0 ? Math.max(...numericAnswers) : 0;
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'number',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: numericAnswers.length,
                        average: avg,
                        min: minVal,
                        max: maxVal,
                        sum: numericAnswers.reduce((a: number, b: number) => a + b, 0)
                    });
                }
                // RANKING QUESTIONS
                else if (qType === 'ranking') {
                    const options = question.options || [];
                    const rankScores: Record<string, number[]> = {};
                    options.forEach((opt: any) => {
                        rankScores[opt.id || opt] = [];
                    });
                    
                    answers.forEach((answer: any) => {
                        const ranking = extractValue(answer, 'ranking');
                        if (Array.isArray(ranking)) {
                            ranking.forEach((optId: string, idx: number) => {
                                if (rankScores[optId]) {
                                    rankScores[optId].push(idx + 1);
                                }
                            });
                        }
                    });
                    
                    const rankedResults = options.map((opt: any) => {
                        const optId = opt.id || opt;
                        const scores = rankScores[optId] || [];
                        const avgRank = scores.length > 0 
                            ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length 
                            : options.length;
                        return {
                            id: optId,
                            text: opt.text || opt,
                            avgRank,
                            responses: scores.length
                        };
                    }).sort((a: any, b: any) => a.avgRank - b.avgRank);
                    
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'ranking',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length,
                        results: rankedResults
                    });
                }
                // TEXT QUESTIONS: text, textarea, email, phone - Skip showing content for privacy
                else if (['text', 'textarea', 'email', 'phone'].includes(qType)) {
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'text',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length,
                        // Don't include actual text for privacy
                        hasResponses: answers.length > 0
                    });
                }
                // DATE/TIME QUESTIONS
                else if (['date', 'time', 'datetime'].includes(qType)) {
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'datetime',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length
                    });
                }
                // MATRIX QUESTIONS - Complex, show as summary
                else if (qType === 'matrix') {
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'matrix',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length,
                        rows: question.rows || [],
                        columns: question.columns || []
                    });
                }
                // FALLBACK: Unknown type
                else {
                    questionStats.push({
                        id: question.id,
                        text: question.text || 'Untitled Question',
                        type: 'unknown',
                        questionType: qType,
                        sectionTitle: section.title || '',
                        totalResponses: answers.length
                    });
                }
            });
        });
        
        console.log('Final questionStats:', questionStats);
        console.log('=== End Survey Debug ===');
        
        return {
            totalResponses: responses.length,
            completionRate: 100, // Assume all submitted responses are complete
            questionStats
        };
    }, [isSurvey, poll, results]);
    
    // Share functions
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#results=${pollId}` : '';
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: "${poll?.title}"`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };
    
    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
                <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div 
                        className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p 
                        className="text-white/70 font-medium text-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading results...
                    </motion.p>
                </motion.div>
            </div>
        );
    }
    
    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <motion.div 
                    className="text-center max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye size={40} className="text-white/50" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">{error}</h1>
                    <p className="text-white/50 mb-8">The poll owner hasn't enabled public results sharing.</p>
                    <a 
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                    >
                        <Sparkles size={18} />
                        Create Your Own Poll
                    </a>
                </motion.div>
            </div>
        );
    }
    
    if (!poll || !resultsData) return null;
    
    const { totalVotes, sortedOptions, winner } = resultsData;
    
    // Show ad wall for free tier
    if (isFreeTier && !adWallPassed) {
        // Mini animated bar chart for ad wall
        const miniBarData = [45, 72, 58, 89, 95];
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div 
                        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    />
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full relative z-10"
                >
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 overflow-hidden">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="relative w-16 h-16 mx-auto mb-4"
                            >
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                    <motion.circle
                                        cx="50" cy="50" r="45"
                                        fill="none"
                                        stroke="url(#publicGradient)"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 0 }}
                                        animate={{ strokeDashoffset: 283 - (283 * (5 - countdown) / 5) }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <defs>
                                        <linearGradient id="publicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="50%" stopColor="#ec4899" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-black text-white">
                                        {countdown > 0 ? countdown : <Check size={24} />}
                                    </span>
                                </div>
                            </motion.div>
                            
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Results Loading...
                            </h2>
                            <p className="text-white/50 text-sm">
                                Preparing your live results
                            </p>
                        </div>
                        
                        {/* Animated Mini Chart Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <BarChart3 size={12} className="text-white" />
                                </div>
                                <span className="text-white/60 text-xs font-medium">Live Analytics Preview</span>
                            </div>
                            <div className="flex items-end justify-between gap-2 h-20">
                                {miniBarData.map((value, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t relative overflow-hidden"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${value}%` }}
                                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '200%' }}
                                            transition={{ delay: 1.2 + idx * 0.1, duration: 0.8 }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        
                        {/* Feature Pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap gap-2 justify-center mb-6"
                        >
                            {[
                                { icon: <Trophy size={12} />, text: 'Live Results' },
                                { icon: <Users size={12} />, text: 'Vote Count' },
                                { icon: <PieChart size={12} />, text: 'Charts' },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + idx * 0.1 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10"
                                >
                                    <span className="text-indigo-400">{feature.icon}</span>
                                    <span className="text-white/70 text-xs">{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        {/* View Results Button */}
                        <motion.button
                            onClick={() => setAdWallPassed(true)}
                            disabled={countdown > 0}
                            whileHover={countdown === 0 ? { scale: 1.02 } : {}}
                            whileTap={countdown === 0 ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                countdown > 0
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl'
                            }`}
                        >
                            {countdown > 0 ? (
                                <>
                                    <Clock size={20} />
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    <Eye size={20} />
                                    View Results
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </div>
                    
                    {/* Upgrade CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/20"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <Crown size={18} className="text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Want Instant Access?</h4>
                                <p className="text-white/50 text-xs">Skip the wait with Pro</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {['No Ads', 'Instant Results', 'Analytics'].map((feat, idx) => (
                                <motion.span 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.7 + idx * 0.1 }}
                                    className="px-2 py-1 bg-white/10 rounded-full text-white/70 text-xs flex items-center gap-1"
                                >
                                    <Check size={10} className="text-emerald-400" />
                                    {feat}
                                </motion.span>
                            ))}
                        </div>
                        <a
                            href="/pricing"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
                        >
                            <Zap size={14} />
                            Upgrade to Pro
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        );
    }
    
    // Color palettes
    const barGradients = [
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-emerald-400 via-teal-500 to-cyan-500',
        'from-amber-400 via-orange-500 to-red-500',
        'from-pink-400 via-rose-500 to-red-500',
        'from-cyan-400 via-blue-500 to-indigo-500',
        'from-lime-400 via-green-500 to-emerald-500',
        'from-violet-400 via-purple-500 to-fuchsia-500',
        'from-yellow-400 via-amber-500 to-orange-500'
    ];
    
    const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#8b5cf6', '#ef4444'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 relative overflow-hidden">
            <FloatingParticles />
            <ConfettiExplosion show={showConfetti} />
            
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <motion.header 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <motion.div 
                            className="w-2.5 h-2.5 bg-emerald-400 rounded-full"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-white/90 text-sm font-semibold">Live Results</span>
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                        {poll.title}
                    </h1>
                    
                    {poll.description && (
                        <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto">{poll.description}</p>
                    )}
                </motion.header>
                
                {/* Stats - Different for polls vs surveys */}
                {!isSurvey ? (
                    <>
                        {/* Poll Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            <StatCard
                                icon={<Users size={20} />}
                                value={totalVotes}
                                label="Votes"
                                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                                delay={0.1}
                            />
                            <StatCard
                                icon={<Vote size={20} />}
                                value={sortedOptions.length}
                                label="Options"
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                                delay={0.2}
                            />
                            <StatCard
                                icon={<Trophy size={20} />}
                                value={`${Math.round(winner?.percentage || 0)}%`}
                                label="Leader"
                                gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                                delay={0.3}
                            />
                            <StatCard
                                icon={<Sparkles size={20} />}
                                value="Live"
                                label="Status"
                                gradient="bg-gradient-to-br from-pink-500 to-rose-600"
                                delay={0.4}
                            />
                        </div>
                        
                        {/* Winner Card */}
                        {winner && totalVotes > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl blur-2xl"
                                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.02, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            
                            <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-3xl p-1">
                                <div className="bg-slate-900/95 rounded-[22px] p-5 sm:p-8 text-center">
                                    <motion.div
                                        initial={{ rotate: -20, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ delay: 0.8, type: "spring" }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-4"
                                    >
                                        <Crown size={16} className="text-white" />
                                        <span className="text-white font-bold text-xs uppercase tracking-wider">Leading</span>
                                    </motion.div>
                                    
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4">{winner.text}</h2>
                                    
                                    <div className="flex items-center justify-center gap-6 sm:gap-10">
                                        <div className="text-center">
                                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                                                <AnimatedNumber value={Math.round(winner.percentage)} suffix="%" />
                                            </div>
                                            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">of votes</div>
                                        </div>
                                        <div className="w-px h-14 bg-white/20" />
                                        <div className="text-center">
                                            <div className="text-4xl sm:text-5xl font-black text-white">
                                                <AnimatedNumber value={winner.count} />
                                            </div>
                                            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">total votes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                        )}
                
                        {/* View Toggle */}
                        <motion.div 
                            className="flex justify-center mb-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                    <div className="inline-flex bg-white/10 backdrop-blur rounded-xl p-1 border border-white/20">
                        <button
                            onClick={() => setActiveView('bar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                activeView === 'bar' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <BarChart3 size={16} />
                            <span className="hidden sm:inline">Bar</span>
                        </button>
                        <button
                            onClick={() => setActiveView('pie')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                activeView === 'pie' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <PieChart size={16} />
                            <span className="hidden sm:inline">Pie</span>
                        </button>
                    </div>
                </motion.div>
                
                {/* Charts */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/20 mb-8"
                >
                    <AnimatePresence mode="wait">
                        {activeView === 'bar' ? (
                            <motion.div
                                key="bar"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {sortedOptions.map((option: any, index: number) => (
                                    <motion.div
                                        key={option.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                {index === 0 && totalVotes > 0 && (
                                                    <Trophy size={16} className="text-amber-400 flex-shrink-0" />
                                                )}
                                                <span className="font-bold text-white text-sm sm:text-base truncate">{option.text}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                                <span className="text-white/40 text-xs sm:text-sm">{option.count}</span>
                                                <span className="font-black text-white text-base sm:text-lg w-14 text-right">
                                                    {option.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-10 sm:h-12 bg-white/5 rounded-xl overflow-hidden">
                                            <motion.div
                                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barGradients[index % barGradients.length]} rounded-xl`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.max(option.percentage, option.count > 0 ? 2 : 0)}%` }}
                                                transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '200%' }}
                                                transition={{ duration: 1.5, delay: 0.3 + index * 0.08 }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {totalVotes === 0 && (
                                    <div className="text-center py-12 text-white/40">
                                        <Vote size={40} className="mx-auto mb-3 opacity-50" />
                                        <p>No votes yet - be the first!</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="pie"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col md:flex-row items-center gap-8 justify-center py-4"
                            >
                                <motion.div 
                                    className="relative w-48 h-48 sm:w-64 sm:h-64"
                                    initial={{ rotate: -180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                                        {(() => {
                                            let currentAngle = 0;
                                            return sortedOptions.map((option: any, index: number) => {
                                                const angle = (option.percentage / 100) * 360;
                                                if (angle < 0.5) return null;
                                                
                                                const startAngle = currentAngle * (Math.PI / 180);
                                                const endAngle = (currentAngle + angle) * (Math.PI / 180);
                                                currentAngle += angle;
                                                
                                                if (angle >= 359.9) {
                                                    return <circle key={option.id} cx="50" cy="50" r="45" fill={pieColors[index % pieColors.length]} />;
                                                }
                                                
                                                const largeArc = angle > 180 ? 1 : 0;
                                                const x1 = 50 + 45 * Math.cos(startAngle);
                                                const y1 = 50 + 45 * Math.sin(startAngle);
                                                const x2 = 50 + 45 * Math.cos(endAngle);
                                                const y2 = 50 + 45 * Math.sin(endAngle);
                                                
                                                return (
                                                    <path
                                                        key={option.id}
                                                        d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                        fill={pieColors[index % pieColors.length]}
                                                        className="hover:opacity-80 transition-opacity"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-full shadow-xl flex flex-col items-center justify-center border-2 border-white/10">
                                            <span className="text-xl sm:text-2xl font-black text-white">{totalVotes}</span>
                                            <span className="text-[10px] text-white/40 uppercase">votes</span>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <div className="space-y-2 w-full md:w-auto">
                                    {sortedOptions.map((option: any, index: number) => (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.08 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div 
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                            />
                                            <span className="font-medium text-white text-sm flex-1 truncate">{option.text}</span>
                                            <span className="text-white/50 font-bold text-sm">{option.percentage.toFixed(1)}%</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                    </>
                ) : (
                    /* Survey Results Section - Typeform Style */
                    <div className="space-y-6 mb-8">
                        {/* Survey Stats Cards */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-4 border border-indigo-500/30 text-center">
                                <Users size={24} className="mx-auto mb-2 text-indigo-400" />
                                <div className="text-3xl font-black text-white">{surveyStats?.totalResponses || 0}</div>
                                <div className="text-white/50 text-xs">Responses</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/30 text-center">
                                <Vote size={24} className="mx-auto mb-2 text-emerald-400" />
                                <div className="text-3xl font-black text-white">{surveyStats?.questionStats?.length || 0}</div>
                                <div className="text-white/50 text-xs">Questions</div>
                            </div>
                            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl p-4 border border-pink-500/30 text-center col-span-2 sm:col-span-1">
                                <Sparkles size={24} className="mx-auto mb-2 text-pink-400" />
                                <div className="text-3xl font-black text-white">Live</div>
                                <div className="text-white/50 text-xs">Status</div>
                            </div>
                        </motion.div>
                        
                        {/* Question Results - Typeform Style */}
                        {surveyStats?.questionStats?.map((question: any, qIdx: number) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + qIdx * 0.1 }}
                                className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 overflow-hidden relative"
                            >
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        question.type === 'choice' ? 'bg-gradient-to-br from-indigo-500 to-purple-500' :
                                        question.type === 'rating' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                                        question.type === 'scale' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' :
                                        question.type === 'nps' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                                        question.type === 'number' ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                                        question.type === 'ranking' ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                                        question.type === 'text' ? 'bg-gradient-to-br from-slate-500 to-slate-600' :
                                        'bg-gradient-to-br from-slate-500 to-slate-600'
                                    }`}>
                                        <span className="text-white font-bold text-sm">{qIdx + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {question.sectionTitle && (
                                            <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">
                                                {question.sectionTitle}
                                            </div>
                                        )}
                                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">{question.text || 'Untitled Question'}</h3>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                                            <span>{question.totalResponses} responses</span>
                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                            <span className="capitalize">{question.questionType?.replace('_', ' ') || question.type}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* CHOICE TYPE - Multiple Choice, Dropdown, Yes/No */}
                                {question.type === 'choice' && (
                                    <div className="space-y-3">
                                        {question.results?.map((result: any, idx: number) => (
                                            <motion.div 
                                                key={result.id || idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + idx * 0.08 }}
                                            >
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        {idx === 0 && result.count > 0 && (
                                                            <Trophy size={14} className="text-amber-400 flex-shrink-0" />
                                                        )}
                                                        <span className="text-white/90 text-sm truncate">{result.text}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                                        <span className="text-white/40 text-xs">{result.count}</span>
                                                        <span className="font-bold text-white min-w-[50px] text-right">
                                                            {Math.round(result.percentage)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-8 bg-white/5 rounded-xl overflow-hidden relative">
                                                    <motion.div
                                                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barGradients[idx % barGradients.length]} rounded-xl`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.max(result.percentage, result.count > 0 ? 3 : 0)}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                                    />
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                        initial={{ x: '-100%' }}
                                                        animate={{ x: '200%' }}
                                                        transition={{ duration: 1.2, delay: 0.8 + idx * 0.08 }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {(question.results?.length === 0 || question.totalResponses === 0) && (
                                            <motion.div 
                                                className="text-center py-8"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <BarChart3 size={24} className="text-indigo-400" />
                                                </motion.div>
                                                <motion.div 
                                                    className="text-white/40 text-sm"
                                                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    Awaiting responses...
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                                
                                {/* RATING TYPE - Star Rating (1-5 or custom) */}
                                {question.type === 'rating' && (
                                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                                        {/* Big Score */}
                                        <motion.div 
                                            className="text-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                        >
                                            {question.totalResponses > 0 ? (
                                                <>
                                                    <div className="text-6xl sm:text-7xl font-black bg-gradient-to-br from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                                        {question.average.toFixed(1)}
                                                    </div>
                                                    <div className="text-white/50 text-sm mt-1">out of {question.max}</div>
                                                </>
                                            ) : (
                                                <motion.div 
                                                    className="text-center py-4"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <div className="text-4xl mb-2">⭐</div>
                                                    <div className="text-white/40 text-sm">Awaiting ratings</div>
                                                </motion.div>
                                            )}
                                            {/* Star visualization */}
                                            <div className="flex items-center justify-center gap-1.5 mt-3">
                                                {Array.from({ length: question.max || 5 }, (_, i) => (
                                                    question.totalResponses > 0 ? (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                                                            className={`text-2xl ${
                                                                i < Math.round(question.average) 
                                                                    ? 'text-amber-400' 
                                                                    : 'text-white/20'
                                                            }`}
                                                        >
                                                            ★
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                                                            className="text-2xl text-white/20"
                                                        >
                                                            ★
                                                        </motion.div>
                                                    )
                                                ))}
                                            </div>
                                        </motion.div>
                                        
                                        {/* Distribution - only show if has responses */}
                                        {question.totalResponses > 0 && question.distribution && (
                                            <div className="flex-1 w-full sm:w-auto">
                                                <div className="text-xs text-white/40 mb-3">Rating Distribution</div>
                                                <div className="space-y-2">
                                                    {Array.from({ length: question.max || 5 }, (_, i) => {
                                                        const rating = (question.max || 5) - i;
                                                        const count = question.distribution[rating] || 0;
                                                        const pct = question.totalResponses > 0 ? (count / question.totalResponses) * 100 : 0;
                                                        return (
                                                            <div key={rating} className="flex items-center gap-2">
                                                                <span className="text-amber-400 w-4 text-right text-sm">{rating}</span>
                                                                <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${pct}%` }}
                                                                        transition={{ delay: 0.6 + i * 0.05, duration: 0.8 }}
                                                                    />
                                                                </div>
                                                                <span className="text-white/40 text-xs w-8">{count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* SCALE TYPE - 1-10 Scale */}
                                {question.type === 'scale' && (
                                    <div className="space-y-6">
                                        {/* Big Score with Gauge */}
                                        <div className="flex flex-col items-center">
                                            <motion.div 
                                                className="relative w-48 h-24 overflow-hidden"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {/* Semi-circle gauge */}
                                                <svg viewBox="0 0 100 50" className="w-full h-full">
                                                    <defs>
                                                        <linearGradient id={`gauge-${question.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#ef4444" />
                                                            <stop offset="50%" stopColor="#f59e0b" />
                                                            <stop offset="100%" stopColor="#10b981" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Background arc */}
                                                    <path
                                                        d="M 10 50 A 40 40 0 0 1 90 50"
                                                        fill="none"
                                                        stroke="rgba(255,255,255,0.1)"
                                                        strokeWidth="8"
                                                        strokeLinecap="round"
                                                    />
                                                    {/* Filled arc - animate pulsing if no data */}
                                                    {question.totalResponses > 0 ? (
                                                        <motion.path
                                                            d="M 10 50 A 40 40 0 0 1 90 50"
                                                            fill="none"
                                                            stroke={`url(#gauge-${question.id})`}
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            initial={{ pathLength: 0 }}
                                                            animate={{ pathLength: ((question.average || 0) - (question.min || 1)) / ((question.max || 10) - (question.min || 1)) }}
                                                            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                                        />
                                                    ) : (
                                                        <motion.path
                                                            d="M 10 50 A 40 40 0 0 1 90 50"
                                                            fill="none"
                                                            stroke="rgba(255,255,255,0.2)"
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        />
                                                    )}
                                                </svg>
                                                {/* Score in center */}
                                                <div className="absolute inset-0 flex items-end justify-center pb-0">
                                                    {question.totalResponses > 0 ? (
                                                        <div className="text-4xl font-black text-white">
                                                            {question.average.toFixed(1)}
                                                        </div>
                                                    ) : (
                                                        <motion.div 
                                                            className="text-2xl text-white/30"
                                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            —
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                            <div className="flex justify-between w-48 text-xs text-white/40 mt-1">
                                                <span>{question.minLabel || question.min || 1}</span>
                                                <span>{question.maxLabel || question.max || 10}</span>
                                            </div>
                                            {question.totalResponses === 0 && (
                                                <motion.div 
                                                    className="text-white/40 text-sm mt-2"
                                                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    Awaiting responses...
                                                </motion.div>
                                            )}
                                        </div>
                                        
                                        {/* Distribution bar - only show if has responses */}
                                        {question.totalResponses > 0 && question.distribution && (
                                            <div>
                                                <div className="text-xs text-white/40 mb-2 text-center">Response Distribution</div>
                                                <div className="flex items-end justify-center gap-1 h-20">
                                                    {Array.from({ length: (question.max || 10) - (question.min || 1) + 1 }, (_, i) => {
                                                        const val = (question.min || 1) + i;
                                                        const count = question.distribution[val] || 0;
                                                        const maxCount = Math.max(...Object.values(question.distribution as Record<number, number>), 1);
                                                        const height = (count / maxCount) * 100;
                                                        return (
                                                            <motion.div 
                                                                key={val}
                                                                className="flex flex-col items-center gap-1 flex-1"
                                                                initial={{ opacity: 0, scaleY: 0 }}
                                                                animate={{ opacity: 1, scaleY: 1 }}
                                                                transition={{ delay: 0.6 + i * 0.05 }}
                                                                style={{ originY: 1 }}
                                                            >
                                                                <div 
                                                                    className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                                                                    style={{ height: `${Math.max(height, count > 0 ? 10 : 2)}%` }}
                                                                />
                                                                <span className="text-[10px] text-white/40">{val}</span>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* NPS TYPE - Net Promoter Score */}
                                {question.type === 'nps' && (
                                    <div className="space-y-6">
                                        {/* Big NPS Score */}
                                        <motion.div 
                                            className="text-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                        >
                                            {question.totalResponses > 0 ? (
                                                <>
                                                    <div className={`text-7xl font-black ${
                                                        question.npsScore >= 50 ? 'text-emerald-400' :
                                                        question.npsScore >= 0 ? 'text-amber-400' : 'text-red-400'
                                                    }`}>
                                                        {question.npsScore > 0 ? '+' : ''}{question.npsScore}
                                                    </div>
                                                    <div className="text-white/50 text-sm">Net Promoter Score</div>
                                                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                                                        question.npsScore >= 50 ? 'bg-emerald-500/20 text-emerald-300' :
                                                        question.npsScore >= 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                                                    }`}>
                                                        {question.npsScore >= 70 ? 'Excellent' :
                                                         question.npsScore >= 50 ? 'Great' :
                                                         question.npsScore >= 30 ? 'Good' :
                                                         question.npsScore >= 0 ? 'Needs Improvement' : 'Critical'}
                                                    </div>
                                                </>
                                            ) : (
                                                <motion.div
                                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <div className="text-5xl font-black text-white/20">—</div>
                                                    <div className="text-white/40 text-sm mt-2">Awaiting NPS responses</div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                        
                                        {/* Segmented bar - only show if has data */}
                                        {question.totalResponses > 0 ? (
                                            <div>
                                                <div className="h-6 flex rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${question.detractors}%` }}
                                                        transition={{ delay: 0.5, duration: 0.8 }}
                                                    >
                                                        {question.detractors > 10 && (
                                                            <span className="text-white text-xs font-bold">{question.detractors}%</span>
                                                        )}
                                                    </motion.div>
                                                    <motion.div 
                                                        className="bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${question.passives}%` }}
                                                        transition={{ delay: 0.6, duration: 0.8 }}
                                                    >
                                                        {question.passives > 10 && (
                                                            <span className="text-white text-xs font-bold">{question.passives}%</span>
                                                        )}
                                                    </motion.div>
                                                    <motion.div 
                                                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${question.promoters}%` }}
                                                        transition={{ delay: 0.7, duration: 0.8 }}
                                                    >
                                                        {question.promoters > 10 && (
                                                            <span className="text-white text-xs font-bold">{question.promoters}%</span>
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        ) : (
                                            <motion.div 
                                                className="h-6 bg-white/5 rounded-full overflow-hidden"
                                                animate={{ opacity: [0.3, 0.5, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                        
                                        {/* Legend */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <motion.div 
                                                className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <div className="text-2xl font-black text-red-400">{question.detractorCount || 0}</div>
                                                <div className="text-xs text-red-300/60">Detractors</div>
                                                <div className="text-[10px] text-white/30 mt-1">Score 0-6</div>
                                            </motion.div>
                                            <motion.div 
                                                className="bg-amber-500/10 rounded-xl p-3 text-center border border-amber-500/20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.9 }}
                                            >
                                                <div className="text-2xl font-black text-amber-400">{question.passiveCount || 0}</div>
                                                <div className="text-xs text-amber-300/60">Passives</div>
                                                <div className="text-[10px] text-white/30 mt-1">Score 7-8</div>
                                            </motion.div>
                                            <motion.div 
                                                className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1 }}
                                            >
                                                <div className="text-2xl font-black text-emerald-400">{question.promoterCount || 0}</div>
                                                <div className="text-xs text-emerald-300/60">Promoters</div>
                                                <div className="text-[10px] text-white/30 mt-1">Score 9-10</div>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* NUMBER TYPE - Numeric Input */}
                                {question.type === 'number' && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <motion.div 
                                            className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-4 text-center border border-pink-500/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <div className="text-3xl font-black text-pink-400">
                                                {question.totalResponses > 0 ? question.average.toFixed(1) : '—'}
                                            </div>
                                            <div className="text-xs text-white/40">Average</div>
                                        </motion.div>
                                        <motion.div 
                                            className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 text-center border border-cyan-500/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="text-3xl font-black text-cyan-400">
                                                {question.totalResponses > 0 ? question.min : '—'}
                                            </div>
                                            <div className="text-xs text-white/40">Minimum</div>
                                        </motion.div>
                                        <motion.div 
                                            className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 text-center border border-emerald-500/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <div className="text-3xl font-black text-emerald-400">
                                                {question.totalResponses > 0 ? question.max : '—'}
                                            </div>
                                            <div className="text-xs text-white/40">Maximum</div>
                                        </motion.div>
                                        <motion.div 
                                            className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-4 text-center border border-amber-500/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <div className="text-3xl font-black text-amber-400">
                                                {question.totalResponses > 0 ? question.sum?.toLocaleString() : '—'}
                                            </div>
                                            <div className="text-xs text-white/40">Total Sum</div>
                                        </motion.div>
                                    </div>
                                )}
                                
                                {/* RANKING TYPE - Ranked Options */}
                                {question.type === 'ranking' && (
                                    <div className="space-y-3">
                                        {question.results?.map((result: any, idx: number) => (
                                            <motion.div 
                                                key={result.id || idx}
                                                className="flex items-center gap-4 bg-white/5 rounded-xl p-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + idx * 0.1 }}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                                                    idx === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' :
                                                    idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                                                    idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                    'bg-white/10 text-white/60'
                                                }`}>
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium">{result.text}</div>
                                                    <div className="text-white/40 text-xs">Avg rank: {result.avgRank.toFixed(1)}</div>
                                                </div>
                                                {idx === 0 && <Trophy size={20} className="text-amber-400" />}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* TEXT TYPE - Show response count only (privacy) */}
                                {question.type === 'text' && (
                                    <motion.div 
                                        className="bg-white/5 rounded-xl p-6 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Crown size={28} className="text-slate-400" />
                                        </div>
                                        <div className="text-4xl font-black text-white mb-1">{question.totalResponses}</div>
                                        <div className="text-white/50 text-sm mb-4">text responses collected</div>
                                        <div className="inline-block px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/60">
                                            🔒 Text responses are private
                                        </div>
                                    </motion.div>
                                )}
                                
                                {/* DATETIME TYPE */}
                                {question.type === 'datetime' && (
                                    <motion.div 
                                        className="bg-white/5 rounded-xl p-6 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="text-4xl font-black text-white mb-1">{question.totalResponses}</div>
                                        <div className="text-white/50 text-sm">date/time responses</div>
                                    </motion.div>
                                )}
                                
                                {/* MATRIX TYPE - Show summary */}
                                {question.type === 'matrix' && (
                                    <motion.div 
                                        className="bg-white/5 rounded-xl p-6 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="text-4xl font-black text-white mb-1">{question.totalResponses}</div>
                                        <div className="text-white/50 text-sm mb-2">matrix responses</div>
                                        <div className="text-xs text-white/30">
                                            {question.rows?.length || 0} rows × {question.columns?.length || 0} columns
                                        </div>
                                    </motion.div>
                                )}
                                
                                {/* UNKNOWN/OTHER TYPE */}
                                {question.type === 'unknown' && (
                                    <motion.div 
                                        className="bg-white/5 rounded-xl p-6 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="text-4xl font-black text-white mb-1">{question.totalResponses}</div>
                                        <div className="text-white/50 text-sm">responses</div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                        
                        {/* Empty State for Surveys */}
                        {(!surveyStats?.questionStats || surveyStats.questionStats.length === 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center"
                            >
                                <motion.div 
                                    className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Vote size={36} className="text-indigo-400" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2">Waiting for Responses</h3>
                                <p className="text-white/50 text-sm max-w-sm mx-auto">
                                    Survey results will appear here once people start responding. Share the link to get started!
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}
                
                {/* Social Share - Conditional on poll.showSocialShare */}
                {poll.showSocialShare !== false && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/20 mb-8"
                    >
                        <div className="text-center mb-5">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                <Share2 size={20} className="text-indigo-400" />
                                Share Results
                            </h3>
                            <p className="text-white/40 text-sm">Spread the word!</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mb-5">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white/70 font-mono focus:outline-none"
                            />
                            <motion.button
                                onClick={copyToClipboard}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
                                    copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'
                                }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>
                        </div>
                        
                        <div className="flex justify-center gap-3">
                            <motion.button
                                onClick={shareToTwitter}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Twitter size={20} />
                            </motion.button>
                            <motion.button
                                onClick={shareToLinkedIn}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#0A66C2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Linkedin size={20} />
                            </motion.button>
                            <motion.button
                                onClick={shareToFacebook}
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center text-white shadow-lg"
                            >
                                <Facebook size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
                
                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <a 
                        href="/"
                        className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all group"
                    >
                        <Sparkles size={18} />
                        Create Your Own Poll
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="mt-5 text-white/20 text-xs">
                        Powered by <span className="font-semibold text-white/40">VoteGenerator.com</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PublicResults;
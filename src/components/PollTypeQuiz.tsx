import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle, 
    Sparkles,
    RotateCcw,
    CheckSquare,
    ListOrdered,
    Calendar,
    ArrowLeftRight,
    CircleDot,
    SlidersHorizontal,
    Coins,
    LayoutGrid,
    ThumbsUp,
    HelpCircle,
    Smile,
    Image
} from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: {
        text: string;
        value: string;
        emoji?: string;
    }[];
}

interface PollRecommendation {
    id: string;
    name: string;
    icon: React.ElementType;
    gradient: string;
    tagline: string;
    why: string;
    tier: 'free' | 'paid' | 'pro';
}

const questions: Question[] = [
    {
        id: 'goal',
        question: 'What are you trying to do?',
        options: [
            { text: 'Pick one thing from a list', value: 'pick', emoji: '☝️' },
            { text: 'Rank or prioritize options', value: 'rank', emoji: '📊' },
            { text: 'Find a time that works', value: 'schedule', emoji: '📅' },
            { text: 'Get feedback or ratings', value: 'feedback', emoji: '⭐' },
            { text: 'Make it fun or engaging', value: 'fun', emoji: '🎉' },
        ]
    },
    {
        id: 'options_count',
        question: 'How many options do you have?',
        options: [
            { text: 'Just 2 (A vs B)', value: '2', emoji: '✌️' },
            { text: '3-5 options', value: '3-5', emoji: '🖐️' },
            { text: '6-10 options', value: '6-10', emoji: '🔟' },
            { text: 'More than 10', value: '10+', emoji: '📋' },
        ]
    },
    {
        id: 'complexity',
        question: 'How important is showing intensity of preference?',
        options: [
            { text: 'Not important - just pick a winner', value: 'simple', emoji: '🏆' },
            { text: 'Somewhat - I want to see rankings', value: 'moderate', emoji: '📈' },
            { text: 'Very - I need to allocate resources or budget', value: 'complex', emoji: '💰' },
        ]
    },
    {
        id: 'audience',
        question: 'Who is voting?',
        options: [
            { text: 'Friends or family', value: 'casual', emoji: '👨‍👩‍👧‍👦' },
            { text: 'Team or coworkers', value: 'work', emoji: '💼' },
            { text: 'Students or class', value: 'education', emoji: '🎓' },
            { text: 'Large group or public', value: 'public', emoji: '🌍' },
        ]
    },
    {
        id: 'visual',
        question: 'Do you need to show images?',
        options: [
            { text: 'No, text is fine', value: 'no', emoji: '📝' },
            { text: 'Yes, images would help', value: 'yes', emoji: '🖼️' },
        ]
    }
];

const pollTypes: Record<string, PollRecommendation> = {
    'multiple-choice': {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        icon: CheckSquare,
        gradient: 'from-blue-500 to-indigo-600',
        tagline: 'The classic. Pick one (or more).',
        why: 'Simple, familiar, and works for most situations. Everyone knows how to use it.',
        tier: 'free'
    },
    'ranked-choice': {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        tagline: 'Drag to rank. Find true consensus.',
        why: "When you have several good options, ranked choice finds the one most people can agree on.",
        tier: 'free'
    },
    'meeting-poll': {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        tagline: "Find when everyone's free.",
        why: "Built specifically for scheduling. Shows availability at a glance.",
        tier: 'free'
    },
    'this-or-that': {
        id: 'this-or-that',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        tagline: 'A vs B. Head-to-head battle.',
        why: "When you've narrowed it down to two options, this makes the final decision fast and fun.",
        tier: 'free'
    },
    'dot-voting': {
        id: 'dot-voting',
        name: 'Dot Voting',
        icon: CircleDot,
        gradient: 'from-emerald-500 to-teal-600',
        tagline: 'Distribute your votes. Show intensity.',
        why: "Perfect for prioritization. Voters can show how strongly they feel about each option.",
        tier: 'free'
    },
    'rating-scale': {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        tagline: 'Rate everything 1-5 or 1-10.',
        why: "Great for feedback and surveys. Every option gets a fair evaluation.",
        tier: 'free'
    },
    'buy-a-feature': {
        id: 'buy-a-feature',
        name: 'Buy a Feature',
        icon: Coins,
        gradient: 'from-green-500 to-emerald-600',
        tagline: 'Spend virtual budget on priorities.',
        why: "Forces tradeoffs. People have to choose what they really want when resources are limited.",
        tier: 'free'
    },
    'priority-matrix': {
        id: 'priority-matrix',
        name: 'Priority Matrix',
        icon: LayoutGrid,
        gradient: 'from-violet-500 to-purple-600',
        tagline: 'Map effort vs impact.',
        why: "Visual prioritization that considers both importance and difficulty.",
        tier: 'free'
    },
    'approval-voting': {
        id: 'approval-voting',
        name: 'Approval Voting',
        icon: ThumbsUp,
        gradient: 'from-lime-500 to-green-600',
        tagline: 'Approve all you like.',
        why: "Finds the option most people can live with. Great for avoiding controversial picks.",
        tier: 'free'
    },
    'quiz-poll': {
        id: 'quiz-poll',
        name: 'Quiz Poll',
        icon: HelpCircle,
        gradient: 'from-yellow-500 to-amber-600',
        tagline: 'Poll with a right answer.',
        why: "Adds a fun, competitive element. Great for trivia, training, or icebreakers.",
        tier: 'paid'
    },
    'sentiment-check': {
        id: 'sentiment-check',
        name: 'Sentiment Check',
        icon: Smile,
        gradient: 'from-rose-500 to-pink-600',
        tagline: 'Quick pulse. Emoji reactions.',
        why: "Fast and engaging. Perfect for quick temperature checks or meeting feedback.",
        tier: 'paid'
    },
    'visual-poll': {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        tagline: 'Vote with images.',
        why: "When seeing is believing. Perfect for design choices, product comparisons, or photo contests.",
        tier: 'pro'
    }
};

// Recommendation logic
function getRecommendation(answers: Record<string, string>): PollRecommendation[] {
    const scores: Record<string, number> = {};
    
    // Initialize scores
    Object.keys(pollTypes).forEach(key => {
        scores[key] = 0;
    });

    // Goal-based scoring
    if (answers.goal === 'pick') {
        scores['multiple-choice'] += 3;
        scores['this-or-that'] += 2;
        scores['approval-voting'] += 2;
    } else if (answers.goal === 'rank') {
        scores['ranked-choice'] += 4;
        scores['dot-voting'] += 3;
        scores['priority-matrix'] += 2;
        scores['buy-a-feature'] += 2;
    } else if (answers.goal === 'schedule') {
        scores['meeting-poll'] += 5;
    } else if (answers.goal === 'feedback') {
        scores['rating-scale'] += 4;
        scores['sentiment-check'] += 3;
        scores['approval-voting'] += 2;
    } else if (answers.goal === 'fun') {
        scores['quiz-poll'] += 4;
        scores['sentiment-check'] += 3;
        scores['this-or-that'] += 2;
    }

    // Options count
    if (answers.options_count === '2') {
        scores['this-or-that'] += 4;
    } else if (answers.options_count === '3-5') {
        scores['multiple-choice'] += 2;
        scores['ranked-choice'] += 2;
    } else if (answers.options_count === '6-10') {
        scores['dot-voting'] += 2;
        scores['ranked-choice'] += 2;
        scores['approval-voting'] += 2;
    } else if (answers.options_count === '10+') {
        scores['dot-voting'] += 3;
        scores['approval-voting'] += 3;
        scores['buy-a-feature'] += 2;
    }

    // Complexity
    if (answers.complexity === 'simple') {
        scores['multiple-choice'] += 2;
        scores['this-or-that'] += 2;
        scores['sentiment-check'] += 2;
    } else if (answers.complexity === 'moderate') {
        scores['ranked-choice'] += 2;
        scores['rating-scale'] += 2;
    } else if (answers.complexity === 'complex') {
        scores['buy-a-feature'] += 3;
        scores['dot-voting'] += 3;
        scores['priority-matrix'] += 2;
    }

    // Audience
    if (answers.audience === 'casual') {
        scores['multiple-choice'] += 1;
        scores['this-or-that'] += 2;
        scores['quiz-poll'] += 2;
    } else if (answers.audience === 'work') {
        scores['ranked-choice'] += 2;
        scores['dot-voting'] += 2;
        scores['meeting-poll'] += 2;
        scores['priority-matrix'] += 2;
    } else if (answers.audience === 'education') {
        scores['quiz-poll'] += 3;
        scores['sentiment-check'] += 2;
        scores['rating-scale'] += 2;
    }

    // Visual needs
    if (answers.visual === 'yes') {
        scores['visual-poll'] += 5;
        scores['this-or-that'] += 1;
    }

    // Sort by score and return top 3
    const sorted = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([key]) => pollTypes[key]);

    return sorted;
}

const PollTypeQuiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (value: string) => {
        const newAnswers = {
            ...answers,
            [questions[currentQuestion].id]: value
        };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
        } else {
            setTimeout(() => setShowResults(true), 300);
        }
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const restart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const recommendations = showResults ? getRecommendation(answers) : [];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                    {showResults ? '🎯 Your Perfect Poll Type' : '🤔 Poll Type Finder'}
                </h3>
                <p className="text-indigo-100 text-sm">
                    {showResults 
                        ? "Based on your answers, here's what we recommend"
                        : "Answer a few quick questions and we'll recommend the best poll type for your situation"
                    }
                </p>
            </div>

            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Progress Bar */}
                        <div className="px-6 pt-6">
                            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                <span>Question {currentQuestion + 1} of {questions.length}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h4 className="text-xl font-bold text-slate-800 mb-6">
                                        {questions[currentQuestion].question}
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {questions[currentQuestion].options.map((option, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswer(option.value)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                                    answers[questions[currentQuestion].id] === option.value
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-2xl">{option.emoji}</span>
                                                <span className="font-medium text-slate-700">{option.text}</span>
                                                {answers[questions[currentQuestion].id] === option.value && (
                                                    <CheckCircle size={20} className="ml-auto text-indigo-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="px-6 pb-6 flex justify-between">
                            <button
                                onClick={goBack}
                                disabled={currentQuestion === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    currentQuestion === 0
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <button
                                onClick={restart}
                                className="text-slate-500 text-sm hover:text-slate-700"
                            >
                                Start Over
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6"
                    >
                        {/* Top Recommendation */}
                        {(() => {
                            const TopIcon = recommendations[0].icon;
                            return (
                                <div className={`bg-gradient-to-r ${recommendations[0].gradient} rounded-xl p-6 text-white mb-6`}>
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                                        <Sparkles size={16} />
                                        Best Match
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                            <TopIcon size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold">{recommendations[0].name}</h4>
                                            <p className="text-white/80">{recommendations[0].tagline}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-white/90 text-sm">
                                        <strong>Why this works for you:</strong> {recommendations[0].why}
                                    </p>
                                    {recommendations[0].tier !== 'free' && (
                                        <div className="mt-3 inline-block px-2 py-1 bg-white/20 rounded text-xs font-bold">
                                            {recommendations[0].tier === 'paid' ? '$5+' : 'PRO'}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Other Options */}
                        <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                            Also Consider
                        </h5>
                        <div className="space-y-3 mb-6">
                            {recommendations.slice(1).map((rec, i) => {
                                const RecIcon = rec.icon;
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                                    >
                                        <div className={`w-10 h-10 bg-gradient-to-br ${rec.gradient} rounded-lg flex items-center justify-center text-white`}>
                                            <RecIcon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-bold text-slate-800">{rec.name}</h5>
                                                {rec.tier !== 'free' && (
                                                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                        rec.tier === 'paid' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                                    }`}>
                                                        {rec.tier === 'paid' ? '$5+' : 'PRO'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">{rec.tagline}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="/create.html"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                            >
                                Create {recommendations[0].name}
                                <ArrowRight size={18} />
                            </a>
                            <button
                                onClick={restart}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all"
                            >
                                <RotateCcw size={18} />
                                Try Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PollTypeQuiz;
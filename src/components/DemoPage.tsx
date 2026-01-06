// ============================================================================
// DemoPage - VoteGenerator Interactive Demo
// 8 Poll Types + Surveys, Dashboard-Style Results, Poll Finder Quiz
// Conversion-focused: Show value, reduce friction, drive action
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListOrdered, CheckSquare, Calendar, ArrowLeftRight, SlidersHorizontal,
    Users, Image, CheckCircle2, ChevronRight, Sparkles, Building2, Heart, 
    Briefcase, GraduationCap, PartyPopper, Play, ArrowRight, Check, X,
    BarChart3, TrendingUp, PieChart, Globe, Clock, RotateCcw, Download,
    Trophy, Star, Zap, Target, HelpCircle, ChevronDown, FileText
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// 8 Poll Types + Survey Data
// ============================================================================

interface PollTypeInfo {
    id: string;
    name: string;
    icon: React.ElementType;
    gradient: string;
    tagline: string;
    description: string;
    bestFor: string[];
    demoQuestion: string;
    demoOptions: { text: string; votes: number; emoji?: string }[];
}

const pollTypes: PollTypeInfo[] = [
    {
        id: 'multiple-choice', 
        name: 'Multiple Choice', 
        icon: CheckSquare, 
        gradient: 'from-blue-500 to-indigo-600',
        tagline: 'The classic. Pick one or more.',
        description: 'Voters select their favorite from a list. Simple, familiar, fast.',
        bestFor: ['Team lunches', 'Quick decisions', 'Yes/No questions'],
        demoQuestion: '🍕 What should we order for the team?',
        demoOptions: [
            { text: 'Pizza', votes: 42, emoji: '🍕' },
            { text: 'Thai Food', votes: 31, emoji: '🍜' },
            { text: 'Tacos', votes: 28, emoji: '🌮' },
            { text: 'Sushi', votes: 18, emoji: '🍣' }
        ]
    },
    {
        id: 'ranked-choice', 
        name: 'Ranked Choice', 
        icon: ListOrdered, 
        gradient: 'from-indigo-500 to-purple-600',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options by preference. Uses Instant Runoff Voting.',
        bestFor: ['Multiple good options', 'Elections', 'Finding compromise'],
        demoQuestion: '🏖️ Rank the retreat locations',
        demoOptions: [
            { text: 'Beach Resort', votes: 38, emoji: '🏖️' },
            { text: 'Mountain Cabin', votes: 35, emoji: '🏔️' },
            { text: 'City Hotel', votes: 25, emoji: '🏙️' },
            { text: 'Lake House', votes: 21, emoji: '🏡' }
        ]
    },
    {
        id: 'meeting-poll', 
        name: 'Meeting Poll', 
        icon: Calendar, 
        gradient: 'from-amber-500 to-orange-600',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle. Show time slots, let people mark availability.',
        bestFor: ['Scheduling meetings', 'Event planning', 'Group coordination'],
        demoQuestion: '📅 When can you meet?',
        demoOptions: [
            { text: 'Mon 10am', votes: 8 },
            { text: 'Mon 2pm', votes: 5 },
            { text: 'Tue 10am', votes: 12 },
            { text: 'Wed 3pm', votes: 6 }
        ]
    },
    {
        id: 'this-or-that', 
        name: 'This or That', 
        icon: ArrowLeftRight, 
        gradient: 'from-orange-500 to-red-600',
        tagline: 'A vs B. Quick gut reactions.',
        description: 'Two options at a time. Great for design feedback and narrowing down.',
        bestFor: ['Logo selection', 'Design feedback', 'Quick comparisons'],
        demoQuestion: '🎨 Which logo do you prefer?',
        demoOptions: [
            { text: 'Design A', votes: 67, emoji: '🔵' },
            { text: 'Design B', votes: 52, emoji: '🟣' }
        ]
    },
    {
        id: 'rating-scale', 
        name: 'Rating Scale', 
        icon: SlidersHorizontal, 
        gradient: 'from-cyan-500 to-blue-600',
        tagline: 'Rate each option 1-5 stars.',
        description: 'Independent ratings for each option. See averages to compare.',
        bestFor: ['Feedback collection', 'Feature prioritization', 'Quality assessment'],
        demoQuestion: '⭐ Rate our new features',
        demoOptions: [
            { text: 'Dark Mode', votes: 45 }, // votes = avg rating * 10
            { text: 'Mobile App', votes: 48 },
            { text: 'API Access', votes: 32 },
            { text: 'Team Sharing', votes: 41 }
        ]
    },
    {
        id: 'rsvp', 
        name: 'RSVP', 
        icon: Users, 
        gradient: 'from-sky-500 to-blue-600',
        tagline: 'Yes, No, or Maybe.',
        description: 'Simple event attendance. Get a headcount instantly.',
        bestFor: ['Party invites', 'Event planning', 'Headcounts'],
        demoQuestion: '🎉 Can you make the holiday party?',
        demoOptions: [
            { text: 'Yes!', votes: 24, emoji: '✅' },
            { text: 'Maybe', votes: 8, emoji: '🤔' },
            { text: 'No', votes: 5, emoji: '❌' }
        ]
    },
    {
        id: 'visual-poll', 
        name: 'Visual Poll', 
        icon: Image, 
        gradient: 'from-pink-500 to-rose-600',
        tagline: 'Vote with images.',
        description: 'Upload images as options. Perfect when visual comparison matters.',
        bestFor: ['Design reviews', 'Photo contests', 'Product selection'],
        demoQuestion: '🖼️ Which website design?',
        demoOptions: [
            { text: 'Modern Minimal', votes: 45 },
            { text: 'Bold & Colorful', votes: 38 },
            { text: 'Classic Pro', votes: 28 }
        ]
    },
    {
        id: 'dot-voting', 
        name: 'Dot Voting', 
        icon: CheckCircle2, 
        gradient: 'from-emerald-500 to-teal-600',
        tagline: 'Distribute points across options.',
        description: 'Each voter gets limited dots to allocate. Shows intensity of preference.',
        bestFor: ['Feature prioritization', 'Budget allocation', 'Brainstorming'],
        demoQuestion: '🎯 Allocate your 5 dots',
        demoOptions: [
            { text: 'Better onboarding', votes: 45 },
            { text: 'Mobile app', votes: 62 },
            { text: 'Dark mode', votes: 28 },
            { text: 'API access', votes: 15 }
        ]
    },
    {
        id: 'survey', 
        name: 'Survey', 
        icon: FileText, 
        gradient: 'from-teal-500 to-emerald-600',
        tagline: 'Multi-section, multi-question.',
        description: 'Collect detailed responses with various question types across multiple sections.',
        bestFor: ['Wedding RSVPs', 'Team feedback', 'Event planning', 'Customer surveys'],
        demoQuestion: '📋 Team Offsite Survey',
        demoOptions: [
            { text: 'Section 1: Attendance', votes: 0 },
            { text: 'Section 2: Preferences', votes: 0 },
            { text: 'Section 3: Feedback', votes: 0 }
        ]
    },
];

// ============================================================================
// Dashboard-Style Results Component
// ============================================================================

const DashboardResults: React.FC<{ 
    poll: PollTypeInfo; 
    userVote: string | null;
    onReset: () => void;
}> = ({ poll, userVote, onReset }) => {
    const [viewMode, setViewMode] = useState<'bar' | 'pie' | 'table'>('bar');
    const totalVotes = poll.demoOptions.reduce((sum, o) => sum + o.votes, 0);
    const sortedOptions = [...poll.demoOptions].sort((a, b) => b.votes - a.votes);
    const winner = sortedOptions[0];
    
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* Dashboard Header - mimics real dashboard */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-slate-300">Results Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>Live · Updates in real-time</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 border-b border-slate-200">
                {[
                    { label: 'Total Votes', value: totalVotes, icon: BarChart3, color: 'text-indigo-600' },
                    { label: 'Leading', value: `${Math.round((winner.votes / totalVotes) * 100)}%`, icon: Trophy, color: 'text-amber-500' },
                    { label: 'Options', value: poll.demoOptions.length, icon: CheckSquare, color: 'text-emerald-600' },
                    { label: 'Your Vote', value: userVote ? '✓' : '-', icon: Check, color: 'text-indigo-600' },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900">{poll.demoQuestion}</h4>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    {[
                        { id: 'bar', icon: BarChart3, label: 'Bar' },
                        { id: 'pie', icon: PieChart, label: 'Pie' },
                        { id: 'table', icon: TrendingUp, label: 'Table' },
                    ].map((view) => (
                        <button
                            key={view.id}
                            onClick={() => setViewMode(view.id as 'bar' | 'pie' | 'table')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1.5 ${
                                viewMode === view.id 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <view.icon size={14} />
                            <span className="hidden sm:inline">{view.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {viewMode === 'bar' && (
                        <motion.div 
                            key="bar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {sortedOptions.map((opt, i) => {
                                const pct = Math.round((opt.votes / totalVotes) * 100);
                                const isUserVote = opt.text === userVote;
                                const isWinner = i === 0;
                                
                                return (
                                    <div key={opt.text}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                                {isWinner && <Trophy size={14} className="text-amber-500" />}
                                                <span className={`font-medium ${isUserVote ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                    {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
                                                    {opt.text}
                                                </span>
                                                {isUserVote && (
                                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                                        Your vote
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500">{opt.votes} votes</span>
                                                <span className="text-lg font-black text-slate-900">{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-10 bg-slate-100 rounded-lg overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                                className={`h-full rounded-lg ${isWinner ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : ''}`}
                                                style={{ backgroundColor: isWinner ? undefined : colors[i % colors.length] + 'cc' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {viewMode === 'pie' && (
                        <motion.div
                            key="pie"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-8"
                        >
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {(() => {
                                        let cumulative = 0;
                                        return sortedOptions.map((opt, i) => {
                                            const pct = (opt.votes / totalVotes) * 100;
                                            const offset = -cumulative;
                                            cumulative += pct;
                                            return (
                                                <motion.circle
                                                    key={opt.text}
                                                    cx="50" cy="50" r="40"
                                                    fill="transparent"
                                                    stroke={colors[i % colors.length]}
                                                    strokeWidth="20"
                                                    strokeDasharray={`${pct} ${100 - pct}`}
                                                    strokeDashoffset={offset}
                                                    initial={{ strokeDasharray: "0 100" }}
                                                    animate={{ strokeDasharray: `${pct} ${100 - pct}` }}
                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                />
                                            );
                                        });
                                    })()}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-slate-900">{totalVotes}</div>
                                        <div className="text-sm text-slate-500">total votes</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {sortedOptions.map((opt, i) => {
                                    const pct = Math.round((opt.votes / totalVotes) * 100);
                                    const isUserVote = opt.text === userVote;
                                    return (
                                        <div key={opt.text} className={`flex items-center gap-3 ${isUserVote ? 'font-bold' : ''}`}>
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                            <span className="text-slate-700">{opt.text}</span>
                                            <span className="font-bold text-slate-900">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'table' && (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">#</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Option</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Votes</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Share</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOptions.map((opt, i) => {
                                            const pct = Math.round((opt.votes / totalVotes) * 100);
                                            const isUserVote = opt.text === userVote;
                                            return (
                                                <tr key={opt.text} className={isUserVote ? 'bg-indigo-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                    <td className="px-4 py-3 text-sm font-bold text-slate-400">
                                                        {i === 0 ? <Trophy size={16} className="text-amber-500" /> : `#${i + 1}`}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                                                        {opt.emoji && <span className="mr-2">{opt.emoji}</span>}
                                                        {opt.text}
                                                        {isUserVote && <span className="ml-2 text-xs text-indigo-600">✓ You</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">{opt.votes}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{pct}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                <button 
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                    <RotateCcw size={16} />
                    Vote Again (Demo)
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                        <Download size={14} />
                        Export
                    </button>
                    <a 
                        href="/#create" 
                        className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                    >
                        Create Your Own <ArrowRight size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Interactive Voting Component
// ============================================================================

const VotingInterface: React.FC<{
    poll: PollTypeInfo;
    onVote: (option: string) => void;
}> = ({ poll, onVote }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selected) {
            onVote(selected);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* Poll Header */}
            <div className={`bg-gradient-to-r ${poll.gradient} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <poll.icon size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-white/80">{poll.name}</div>
                        <div className="text-xs text-white/60">{poll.tagline}</div>
                    </div>
                </div>
                <h3 className="text-xl font-bold">{poll.demoQuestion}</h3>
            </div>

            {/* Voting Options */}
            <div className="p-6">
                <p className="text-sm text-slate-500 mb-4">Click an option to select, then submit your vote:</p>
                <div className="space-y-3">
                    {poll.demoOptions.map((opt) => {
                        const isSelected = selected === opt.text;
                        const isHovered = hoveredOption === opt.text;
                        
                        return (
                            <button
                                key={opt.text}
                                onClick={() => setSelected(opt.text)}
                                onMouseEnter={() => setHoveredOption(opt.text)}
                                onMouseLeave={() => setHoveredOption(null)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                    isSelected 
                                        ? 'border-indigo-500 bg-indigo-50' 
                                        : isHovered
                                            ? 'border-indigo-300 bg-indigo-50/50'
                                            : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                                        isSelected 
                                            ? 'border-indigo-500 bg-indigo-500' 
                                            : 'border-slate-300'
                                    }`}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                        {opt.emoji && <span className="mr-2">{opt.emoji}</span>}
                                        {opt.text}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition ${
                        selected 
                            ? `bg-gradient-to-r ${poll.gradient} hover:shadow-lg` 
                            : 'bg-slate-300 cursor-not-allowed'
                    }`}
                >
                    {selected ? 'Submit Vote →' : 'Select an option'}
                </button>

                <p className="text-center text-xs text-slate-400 mt-3">
                    This is a demo. Your vote won't be saved.
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// Poll Finder Quiz
// ============================================================================

interface QuizQuestion {
    id: string;
    question: string;
    options: { text: string; pollTypes: string[] }[];
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 'goal',
        question: 'What are you trying to decide?',
        options: [
            { text: 'Pick one winner from a list', pollTypes: ['multiple-choice', 'this-or-that'] },
            { text: 'Rank options by preference', pollTypes: ['ranked-choice', 'dot-voting'] },
            { text: 'Find a time that works', pollTypes: ['meeting-poll'] },
            { text: 'Get feedback or ratings', pollTypes: ['rating-scale', 'dot-voting'] },
            { text: 'Collect RSVPs', pollTypes: ['rsvp'] },
            { text: 'Compare visual options', pollTypes: ['visual-poll', 'this-or-that'] },
            { text: 'Collect detailed responses (multiple questions)', pollTypes: ['survey'] },
        ]
    },
    {
        id: 'options',
        question: 'How many options do you have?',
        options: [
            { text: 'Just 2 options (A vs B)', pollTypes: ['this-or-that', 'multiple-choice'] },
            { text: '3-5 options', pollTypes: ['multiple-choice', 'ranked-choice', 'rating-scale'] },
            { text: '6+ options', pollTypes: ['ranked-choice', 'dot-voting', 'multiple-choice'] },
            { text: 'Date/time slots', pollTypes: ['meeting-poll'] },
            { text: 'Multiple questions, not just options', pollTypes: ['survey'] },
        ]
    },
    {
        id: 'depth',
        question: 'How much input do you want from each voter?',
        options: [
            { text: 'Quick - just pick one', pollTypes: ['multiple-choice', 'this-or-that', 'rsvp'] },
            { text: 'Thoughtful - rank or rate', pollTypes: ['ranked-choice', 'rating-scale'] },
            { text: 'Flexible - distribute points', pollTypes: ['dot-voting'] },
            { text: 'Visual - compare images', pollTypes: ['visual-poll'] },
            { text: 'Comprehensive - multiple questions & sections', pollTypes: ['survey'] },
        ]
    }
];

const PollFinderQuiz: React.FC<{ onResult: (pollTypeId: string, isSurvey?: boolean) => void }> = ({ onResult }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [showResult, setShowResult] = useState(false);
    const [recommendedPoll, setRecommendedPoll] = useState<PollTypeInfo | null>(null);

    const handleAnswer = (selectedPollTypes: string[]) => {
        const newAnswers = { ...answers, [quizQuestions[currentQuestion].id]: selectedPollTypes };
        setAnswers(newAnswers);

        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate recommendation
            const scores: Record<string, number> = {};
            Object.values(newAnswers).forEach(types => {
                types.forEach((type, idx) => {
                    scores[type] = (scores[type] || 0) + (types.length - idx);
                });
            });
            const bestType = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
            const recommended = pollTypes.find(p => p.id === bestType) || pollTypes[0];
            setRecommendedPoll(recommended);
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResult(false);
        setRecommendedPoll(null);
    };

    if (showResult && recommendedPoll) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            >
                <div className={`bg-gradient-to-r ${recommendedPoll.gradient} p-8 text-white text-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <recommendedPoll.icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">We recommend:</h3>
                    <div className="text-3xl font-black">{recommendedPoll.name}</div>
                    <p className="text-white/80 mt-2">{recommendedPoll.tagline}</p>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4">{recommendedPoll.description}</p>
                    <div className="mb-6">
                        <h4 className="font-bold text-slate-900 mb-2">Best for:</h4>
                        <div className="flex flex-wrap gap-2">
                            {recommendedPoll.bestFor.map((use, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                                    {use}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onResult(recommendedPoll.id, recommendedPoll.id === 'survey')}
                            className={`flex-1 py-3 bg-gradient-to-r ${recommendedPoll.gradient} text-white font-bold rounded-xl hover:shadow-lg transition`}
                        >
                            Try {recommendedPoll.name} Demo →
                        </button>
                        <button
                            onClick={resetQuiz}
                            className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                        >
                            Retake
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const question = quizQuestions[currentQuestion];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* Progress */}
            <div className="bg-slate-50 p-4 border-b border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% complete</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{question.question}</h3>
                <div className="space-y-3">
                    {question.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(option.pollTypes)}
                            className="w-full p-4 text-left rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
                        >
                            <span className="font-medium text-slate-700">{option.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Survey Demo Component - Uses actual templates from SurveyBuilder
// ============================================================================

interface SurveyQuestion {
    id: string;
    type: string;
    question: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
    multiple?: boolean;
}

interface SurveySection {
    title: string;
    description: string;
    questions: SurveyQuestion[];
}

interface SurveyTemplate {
    id: string;
    name: string;
    emoji: string;
    gradient: string;
    description: string;
    sections: SurveySection[];
}

const surveyTemplates: SurveyTemplate[] = [
    {
        id: 'wedding',
        name: 'Wedding RSVP',
        emoji: '💒',
        gradient: 'from-pink-500 to-rose-600',
        description: 'Attendance, meal preferences, song requests',
        sections: [
            {
                title: 'Attendance',
                description: 'Please let us know if you can make it',
                questions: [
                    { id: 'attending', type: 'yes_no', question: 'Will you be attending?', required: true },
                    { id: 'guests', type: 'number', question: 'Number of guests (including yourself)', placeholder: '1' },
                ]
            },
            {
                title: 'Meal Preferences',
                description: 'Help us plan the menu',
                questions: [
                    { id: 'entree', type: 'multiple_choice', question: 'Entrée preference', options: ['Beef', 'Chicken', 'Fish', 'Vegetarian'], required: true },
                    { id: 'dietary', type: 'text', question: 'Any dietary restrictions or allergies?', placeholder: 'Please list any allergies or dietary needs...' },
                ]
            },
            {
                title: 'Celebration',
                description: 'Help us make it special',
                questions: [
                    { id: 'song', type: 'text', question: 'Request a song for the dance floor', placeholder: 'Song title - Artist' },
                    { id: 'message', type: 'textarea', question: 'Leave a message for the couple (optional)', placeholder: 'Your well wishes...' },
                ]
            }
        ]
    },
    {
        id: 'team-feedback',
        name: 'Team Feedback',
        emoji: '💼',
        gradient: 'from-blue-500 to-indigo-600',
        description: 'Meeting feedback, project surveys',
        sections: [
            {
                title: 'Overall Experience',
                description: 'Rate your overall experience',
                questions: [
                    { id: 'rating', type: 'rating', question: 'How would you rate the meeting overall?', required: true },
                    { id: 'productive', type: 'rating', question: 'How productive was this meeting?', required: true },
                ]
            },
            {
                title: 'Specific Feedback',
                description: 'Help us improve',
                questions: [
                    { id: 'worked', type: 'multiple_choice', question: 'What worked well?', options: ['Clear agenda', 'Good time management', 'Productive discussion', 'Clear decisions made'], multiple: true },
                    { id: 'improve', type: 'textarea', question: 'What could be improved?', placeholder: 'Your suggestions...' },
                ]
            }
        ]
    },
    {
        id: 'party',
        name: 'Party Planning',
        emoji: '🎉',
        gradient: 'from-amber-500 to-orange-600',
        description: 'Event RSVP, preferences, activities',
        sections: [
            {
                title: 'RSVP',
                description: 'Let us know if you can make it',
                questions: [
                    { id: 'attending', type: 'yes_no', question: 'Can you attend?', required: true },
                    { id: 'guests', type: 'number', question: 'How many people in your group?', placeholder: '1' },
                ]
            },
            {
                title: 'Preferences',
                description: 'Help us plan',
                questions: [
                    { id: 'activities', type: 'multiple_choice', question: 'Which activities interest you?', options: ['Games', 'Dancing', 'Karaoke', 'Just chatting'], multiple: true },
                    { id: 'food', type: 'multiple_choice', question: 'Food preference', options: ['Pizza', 'BBQ', 'Tacos', 'Vegetarian'], required: true },
                ]
            }
        ]
    }
];

const SurveyDemo: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate>(surveyTemplates[0]);
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});
    const [submitted, setSubmitted] = useState(false);

    const currentSectionData = selectedTemplate.sections[currentSection];
    const progress = ((currentSection + 1) / selectedTemplate.sections.length) * 100;

    const handleNext = () => {
        if (currentSection < selectedTemplate.sections.length - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            setSubmitted(true);
        }
    };

    const handleBack = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const updateAnswer = (questionId: string, value: string | number | string[]) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const selectTemplate = (template: SurveyTemplate) => {
        setSelectedTemplate(template);
        setCurrentSection(0);
        setAnswers({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className={`bg-gradient-to-r ${selectedTemplate.gradient} p-8 text-white text-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Survey Complete!</h3>
                    <p className="text-white/80">Thank you for your responses</p>
                </div>
                <div className="p-6">
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-slate-900 mb-2">Your Responses Summary</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>✓ {selectedTemplate.sections.length} sections completed</p>
                            <p>✓ {Object.keys(answers).length} questions answered</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { setSubmitted(false); setCurrentSection(0); setAnswers({}); }}
                            className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                        >
                            Try Again
                        </button>
                        <a
                            href="/#create"
                            className={`flex-1 py-3 bg-gradient-to-r ${selectedTemplate.gradient} text-white font-bold rounded-xl hover:shadow-lg transition text-center flex items-center justify-center gap-2`}
                        >
                            Create Your Own <ArrowRight size={16} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Template Selector */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Choose a Template:</h4>
                <div className="grid grid-cols-3 gap-3">
                    {surveyTemplates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => selectTemplate(template)}
                            className={`p-3 rounded-xl border-2 text-center transition ${
                                selectedTemplate.id === template.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-2xl block mb-1">{template.emoji}</span>
                            <span className="text-sm font-medium text-slate-700">{template.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Survey Form */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {/* Survey Header */}
                <div className={`bg-gradient-to-r ${selectedTemplate.gradient} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{selectedTemplate.emoji}</span>
                        <div>
                            <h3 className="text-xl font-bold">{selectedTemplate.name}</h3>
                            <p className="text-white/80 text-sm">{selectedTemplate.description}</p>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/80 mb-1">
                            <span>Section {currentSection + 1} of {selectedTemplate.sections.length}</span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedTemplate.id}-${currentSection}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-slate-900">{currentSectionData.title}</h4>
                                <p className="text-slate-500 text-sm">{currentSectionData.description}</p>
                            </div>

                            <div className="space-y-6">
                                {currentSectionData.questions.map((q) => (
                                    <div key={q.id}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {q.question}
                                            {q.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>

                                        {q.type === 'yes_no' && (
                                            <div className="flex gap-3">
                                                {['Yes', 'No'].map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateAnswer(q.id, opt)}
                                                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${
                                                            answers[q.id] === opt
                                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        {opt === 'Yes' ? '✓ ' : '✗ '}{opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'number' && (
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                placeholder={q.placeholder}
                                                value={answers[q.id] as number || ''}
                                                onChange={(e) => updateAnswer(q.id, parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                                            />
                                        )}

                                        {q.type === 'text' && (
                                            <input
                                                type="text"
                                                placeholder={q.placeholder}
                                                value={answers[q.id] as string || ''}
                                                onChange={(e) => updateAnswer(q.id, e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                                            />
                                        )}

                                        {q.type === 'textarea' && (
                                            <textarea
                                                placeholder={q.placeholder}
                                                rows={3}
                                                value={answers[q.id] as string || ''}
                                                onChange={(e) => updateAnswer(q.id, e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                                            />
                                        )}

                                        {q.type === 'multiple_choice' && q.options && (
                                            <div className="space-y-2">
                                                {q.options.map((opt: string) => {
                                                    const selected = Array.isArray(answers[q.id]) 
                                                        ? (answers[q.id] as string[]).includes(opt)
                                                        : answers[q.id] === opt;
                                                    return (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                if (q.multiple) {
                                                                    const current = (answers[q.id] as string[]) || [];
                                                                    const updated = selected
                                                                        ? current.filter((o: string) => o !== opt)
                                                                        : [...current, opt];
                                                                    updateAnswer(q.id, updated);
                                                                } else {
                                                                    updateAnswer(q.id, opt);
                                                                }
                                                            }}
                                                            className={`w-full p-3 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                                                                selected
                                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                                    : 'border-slate-200 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-${q.multiple ? 'md' : 'full'} border-2 flex items-center justify-center ${
                                                                selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                                                            }`}>
                                                                {selected && <Check size={12} className="text-white" />}
                                                            </div>
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {q.type === 'rating' && (
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => updateAnswer(q.id, star)}
                                                        className="p-2 transition hover:scale-110"
                                                    >
                                                        <Star
                                                            size={32}
                                                            className={`${
                                                                (answers[q.id] as number) >= star
                                                                    ? 'text-amber-400 fill-amber-400'
                                                                    : 'text-slate-300'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8">
                        {currentSection > 0 && (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex-1 py-3 bg-gradient-to-r ${selectedTemplate.gradient} text-white font-bold rounded-xl hover:shadow-lg transition`}
                        >
                            {currentSection === selectedTemplate.sections.length - 1 ? 'Submit Survey' : 'Next Section →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Main Demo Page
// ============================================================================

function DemoPage(): React.ReactElement {
    const [selectedPoll, setSelectedPoll] = useState<string>('multiple-choice');
    const [userVote, setUserVote] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'polls' | 'surveys' | 'finder'>('polls');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll) || pollTypes[0];

    const handleVote = (option: string) => {
        setUserVote(option);
    };

    const handleReset = () => {
        setUserVote(null);
    };

    const handleSelectPoll = (pollId: string) => {
        setSelectedPoll(pollId);
        setUserVote(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />

            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-6">
                            <Play size={16} />
                            Interactive Demo
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            8 Poll Types + Surveys
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Try each poll type live. Vote, see results, and discover which one fits your needs.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'polls', label: '8 Poll Types', icon: CheckSquare },
                            { id: 'surveys', label: 'Surveys', icon: FileText },
                            { id: 'finder', label: 'Find Your Type', icon: Target },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'polls' | 'surveys' | 'finder')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {activeTab === 'polls' && (
                        <motion.div 
                            key="polls"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Poll Type Selector */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-24 space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Select a Poll Type</h3>
                                        {pollTypes.filter(p => p.id !== 'survey').map((poll) => {
                                            const isSelected = selectedPoll === poll.id;
                                            return (
                                                <button
                                                    key={poll.id}
                                                    onClick={() => handleSelectPoll(poll.id)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                                        isSelected
                                                            ? `bg-gradient-to-r ${poll.gradient} text-white shadow-lg`
                                                            : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        isSelected ? 'bg-white/20' : `bg-gradient-to-br ${poll.gradient}`
                                                    }`}>
                                                        <poll.icon className="text-white" size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                            {poll.name}
                                                        </div>
                                                        <div className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                                            {poll.tagline}
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                                </button>
                                            );
                                        })}

                                        <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <p className="text-sm text-indigo-700 font-medium">
                                                💡 All 8 poll types are included on every plan, including Free!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Demo */}
                                <div className="lg:col-span-2">
                                    <AnimatePresence mode="wait">
                                        {!userVote ? (
                                            <motion.div
                                                key="voting"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <VotingInterface poll={selectedPollData} onVote={handleVote} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="results"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <DashboardResults 
                                                    poll={selectedPollData} 
                                                    userVote={userVote} 
                                                    onReset={handleReset}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Best For Tags */}
                                    <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
                                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                            <Check size={16} className="text-emerald-500" />
                                            {selectedPollData.name} is best for:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPollData.bestFor.map((use, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                                                    {use}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'surveys' && (
                        <motion.div
                            key="surveys"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Survey Info */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-24 space-y-4">
                                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white">
                                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                                <FileText size={28} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Surveys</h3>
                                            <p className="text-teal-100">
                                                Multi-section forms with various question types. More than just a poll.
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                                            <h4 className="font-bold text-slate-900 mb-3">Ready-to-Use Templates:</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { emoji: '💒', name: 'Wedding RSVP', desc: 'Attendance + meal + songs' },
                                                    { emoji: '💼', name: 'Team Feedback', desc: 'Ratings + suggestions' },
                                                    { emoji: '🎉', name: 'Party Planning', desc: 'RSVP + preferences' },
                                                ].map((template, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                                        <span className="text-xl">{template.emoji}</span>
                                                        <div>
                                                            <div className="font-medium text-slate-800 text-sm">{template.name}</div>
                                                            <div className="text-xs text-slate-500">{template.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                                            <h4 className="font-bold text-slate-900 mb-3">Question Types:</h4>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {[
                                                    'Multiple choice',
                                                    'Yes / No',
                                                    'Star ratings',
                                                    'Short text',
                                                    'Long text',
                                                    'Number',
                                                    'Dropdown',
                                                    'Ranking',
                                                    'Date / Time',
                                                    'Scale (1-10)',
                                                ].map((type, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-slate-600">
                                                        <Check size={12} className="text-emerald-500" />
                                                        {type}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                                            <p className="text-sm text-emerald-700">
                                                <strong>Free:</strong> Templates + all question types. No signup needed to create or respond.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Survey Demo */}
                                <div className="lg:col-span-2">
                                    <SurveyDemo />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'finder' && (
                        <motion.div
                            key="finder"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Which type should you use?
                                </h2>
                                <p className="text-slate-600">
                                    Answer a few questions and we'll recommend the best poll type or survey template for your needs.
                                </p>
                            </div>
                            <PollFinderQuiz 
                                onResult={(pollId, isSurvey) => {
                                    if (isSurvey) {
                                        setActiveTab('surveys');
                                    } else {
                                        setSelectedPoll(pollId);
                                        setUserVote(null);
                                        setActiveTab('polls');
                                    }
                                }} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your own?</h2>
                    <p className="text-indigo-100 mb-8">No signup needed. Create a poll in 30 seconds.</p>
                    <a 
                        href="/#create" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                    >
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default DemoPage;
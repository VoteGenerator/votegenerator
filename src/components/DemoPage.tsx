// ============================================================================
// Demo Page - VoteGenerator
// FIXED: 7 poll types (not 12), seeded results, TypeScript strict mode
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListOrdered, CheckSquare, Calendar, ArrowLeftRight, SlidersHorizontal,
    Users, Image, ChevronRight, Sparkles, Building2, Heart, Briefcase,
    GraduationCap, PartyPopper, AlertTriangle, Play, ArrowRight,
    Eye, Check, BarChart3, TrendingUp
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// 7 Poll Types Data
// ============================================================================

interface PollTypeInfo {
    id: string;
    name: string;
    icon: React.ElementType;
    gradient: string;
    bgColor: string;
    tagline: string;
    description: string;
    howItWorks: string;
    bestFor: string[];
    notFor: string[];
    exampleQuestion: string;
    exampleOptions: string[];
    proTip: string;
    isPro?: boolean;
    sampleResults: { option: string; votes: number; pct: number }[];
    insights: string[];
}

const pollTypes: PollTypeInfo[] = [
    {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        icon: CheckSquare,
        gradient: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        tagline: 'The classic. Pick one (or more).',
        description: 'The most familiar poll type. Voters see a list of options and pick their favorite.',
        howItWorks: 'Present 2-10 options. Voters click their choice(s). Results show as a bar chart with percentages.',
        bestFor: ['Quick decisions', 'Team lunches', 'Simple votes', 'Yes/No questions'],
        notFor: ['Ranking preferences', 'Complex decisions'],
        exampleQuestion: 'What should we order for the team lunch?',
        exampleOptions: ['🍕 Pizza', '🍜 Thai food', '🌮 Tacos', '🍣 Sushi'],
        proTip: 'Keep options to 5 or fewer for faster decisions.',
        sampleResults: [
            { option: '🍕 Pizza', votes: 12, pct: 40 },
            { option: '🍜 Thai food', votes: 9, pct: 30 },
            { option: '🌮 Tacos', votes: 6, pct: 20 },
            { option: '🍣 Sushi', votes: 3, pct: 10 },
        ],
        insights: ['Clear winner: Pizza with 40%', '30 total votes collected', 'Most popular at lunchtime']
    },
    {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite. Finds the option with broadest support.',
        howItWorks: 'Voters drag options to rank them. We use Instant Runoff Voting to find the winner.',
        bestFor: ['Multiple good options', 'Finding compromise', 'Elections'],
        notFor: ['Simple yes/no questions', 'Quick polls'],
        exampleQuestion: 'Where should we go for the company retreat?',
        exampleOptions: ['🏔️ Mountain cabin', '🏖️ Beach resort', '🏙️ City hotel', '🏕️ Camping'],
        proTip: 'Prevents the "spoiler effect" where similar options split votes.',
        sampleResults: [
            { option: '🏖️ Beach resort', votes: 0, pct: 45 },
            { option: '🏔️ Mountain cabin', votes: 0, pct: 30 },
            { option: '🏙️ City hotel', votes: 0, pct: 15 },
            { option: '🏕️ Camping', votes: 0, pct: 10 },
        ],
        insights: ['Beach resort wins after 3 rounds', 'Mountain cabin was close 2nd choice', 'True consensus: 75% satisfaction']
    },
    {
        id: 'pairwise',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        tagline: 'A vs B. Quick gut reactions.',
        description: 'Present two options at a time. Voters pick their preference. Great for narrowing down.',
        howItWorks: 'Show pairs of options. Voters click their favorite. Algorithm ranks by win rate.',
        bestFor: ['Quick comparisons', 'Design feedback', 'Narrowing down choices'],
        notFor: ['Many options at once', 'Nuanced decisions'],
        exampleQuestion: 'Which logo design is better?',
        exampleOptions: ['Design A', 'Design B', 'Design C'],
        proTip: 'Perfect for design decisions where gut reaction matters.',
        sampleResults: [
            { option: 'Design B', votes: 18, pct: 60 },
            { option: 'Design A', votes: 9, pct: 30 },
            { option: 'Design C', votes: 3, pct: 10 },
        ],
        insights: ['Design B won 60% of matchups', '30 comparisons made', 'Clearest preference: B vs C (85%)']
    },
    {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle but simpler. Show date/time options and let people mark availability.',
        howItWorks: 'Add time slots. Voters mark Available, Maybe, or Unavailable. Results show best times.',
        bestFor: ['Scheduling meetings', 'Planning events', 'Coordinating groups'],
        notFor: ['Non-time decisions', 'Single choice votes'],
        exampleQuestion: 'When can everyone attend the project kickoff?',
        exampleOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Tue 2pm'],
        proTip: 'Offer 4-6 time slots. Too many makes finding overlap harder.',
        sampleResults: [
            { option: 'Tue 10am', votes: 8, pct: 80 },
            { option: 'Mon 2pm', votes: 6, pct: 60 },
            { option: 'Tue 2pm', votes: 5, pct: 50 },
            { option: 'Mon 10am', votes: 3, pct: 30 },
        ],
        insights: ['Tuesday 10am works for 8/10 people', '100% team coverage possible', 'Avoid Monday mornings']
    },
    {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-50',
        tagline: 'Rate each option 1-5 stars.',
        description: 'Voters rate every option independently. See average ratings to compare.',
        howItWorks: 'Each option gets a 1-5 star rating. Results show average scores for comparison.',
        bestFor: ['Comparing multiple items', 'Feedback collection', 'Quality assessment'],
        notFor: ['Choosing a single winner', 'Quick decisions'],
        exampleQuestion: 'Rate our new product features:',
        exampleOptions: ['Dark mode', 'Mobile app', 'API access', 'Team sharing'],
        proTip: 'Great for NPS-style feedback and feature prioritization.',
        sampleResults: [
            { option: 'Mobile app', votes: 0, pct: 92 },
            { option: 'Dark mode', votes: 0, pct: 84 },
            { option: 'Team sharing', votes: 0, pct: 76 },
            { option: 'API access', votes: 0, pct: 68 },
        ],
        insights: ['Mobile app: 4.6★ average', 'All features rated above 3.4★', '25 ratings collected']
    },
    {
        id: 'rsvp',
        name: 'RSVP',
        icon: Users,
        gradient: 'from-sky-500 to-blue-600',
        bgColor: 'bg-sky-50',
        tagline: 'Yes, No, or Maybe.',
        description: 'Simple event attendance tracking. See who\'s coming at a glance.',
        howItWorks: 'Share the link. People respond Yes/No/Maybe. Get automatic headcount.',
        bestFor: ['Event planning', 'Headcounts', 'Simple attendance'],
        notFor: ['Complex scheduling', 'Multiple choice decisions'],
        exampleQuestion: 'Can you attend the team holiday party?',
        exampleOptions: ['✅ Yes', '❌ No', '🤔 Maybe'],
        proTip: 'Enable name collection to see exactly who\'s coming.',
        sampleResults: [
            { option: '✅ Yes', votes: 18, pct: 60 },
            { option: '🤔 Maybe', votes: 6, pct: 20 },
            { option: '❌ No', votes: 6, pct: 20 },
        ],
        insights: ['18 confirmed attendees', '6 maybes to follow up with', 'Plan for 20-24 people']
    },
    {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        tagline: 'Vote with images.',
        description: 'Upload images as options. Perfect when seeing is better than reading.',
        howItWorks: 'Upload 2-8 images. Voters click their favorite. Results show votes per image.',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests'],
        notFor: ['Text-based options', 'Abstract concepts'],
        exampleQuestion: 'Which website design should we launch?',
        exampleOptions: ['[Design A]', '[Design B]', '[Design C]'],
        proTip: 'Keep images similar in size and style for fair comparison.',
        isPro: true,
        sampleResults: [
            { option: 'Design B', votes: 24, pct: 48 },
            { option: 'Design A', votes: 18, pct: 36 },
            { option: 'Design C', votes: 8, pct: 16 },
        ],
        insights: ['Design B preferred by 48%', 'Clean visual comparison', '50 votes in 2 hours']
    }
];

const useCases = [
    { icon: Building2, title: 'Workplace & Teams', description: 'Team lunches, meeting times, project decisions', polls: ['Multiple Choice', 'Meeting Poll', 'Rating Scale'] },
    { icon: Heart, title: 'Weddings & Events', description: 'Song requests, menu choices, RSVPs', polls: ['Multiple Choice', 'RSVP', 'This or That'] },
    { icon: GraduationCap, title: 'Education', description: 'Class votes, topic preferences, feedback', polls: ['Multiple Choice', 'Rating Scale', 'Ranked Choice'] },
    { icon: Briefcase, title: 'Product & Business', description: 'Feature prioritization, design decisions', polls: ['Ranked Choice', 'Visual Poll', 'Rating Scale'] },
    { icon: PartyPopper, title: 'Fun & Social', description: 'Game nights, group decisions, "would you rather"', polls: ['This or That', 'Ranked Choice', 'Multiple Choice'] },
    { icon: Users, title: 'Community & Groups', description: 'Club decisions, community feedback, elections', polls: ['Ranked Choice', 'Multiple Choice', 'RSVP'] }
];

// ============================================================================
// Results Visualization Component
// ============================================================================

const ResultsVisualization: React.FC<{ poll: PollTypeInfo }> = ({ poll }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 size={18} className="text-indigo-600" />
                        Sample Results
                    </h4>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        Live Demo Data
                    </span>
                </div>
            </div>
            
            <div className="p-6">
                <div className="space-y-3 mb-6">
                    {poll.sampleResults.map((result, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{result.option}</span>
                                <span className="font-bold text-slate-900">{result.pct}%</span>
                            </div>
                            <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.pct}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${poll.gradient} rounded-lg`}
                                />
                                {result.votes > 0 && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                                        {result.votes} votes
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <h5 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Key Insights
                    </h5>
                    <ul className="space-y-1">
                        {poll.insights.map((insight, i) => (
                            <li key={i} className="text-sm text-indigo-700 flex items-start gap-2">
                                <Check size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Why It's Better Section - FIXED TypeScript
// ============================================================================

interface ComparisonData {
    title: string;
    scenario: string;
    basic: {
        label: string;
        winner: string;
        problem: string;
        satisfaction: string;
    };
    better: {
        label: string;
        winner: string;
        benefit: string;
        satisfaction: string;
    };
}

const WhyItsBetterSection: React.FC = () => {
    const comparisons: ComparisonData[] = [
        {
            title: 'Multiple Choice vs Ranked Choice',
            scenario: '4 restaurant options, 20 voters',
            basic: {
                label: 'Multiple Choice',
                winner: 'Italian (35%)',
                problem: 'Mexican & Tex-Mex split 45% combined',
                satisfaction: '35%'
            },
            better: {
                label: 'Ranked Choice',
                winner: 'Mexican (52% after runoff)',
                benefit: 'True majority winner found',
                satisfaction: '78%'
            }
        },
        {
            title: 'Simple Poll vs Meeting Poll',
            scenario: 'Scheduling a team meeting',
            basic: {
                label: 'Simple Poll',
                winner: 'Tuesday 2pm (40%)',
                problem: '60% can\'t attend',
                satisfaction: '40%'
            },
            better: {
                label: 'Meeting Poll',
                winner: 'Monday 10am (90% available)',
                benefit: 'Shows all availability at once',
                satisfaction: '90%'
            }
        }
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why the Right Poll Type Matters</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Same question, different results. Choosing the right poll type can dramatically improve outcomes.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {comparisons.map((comp, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
                                <h3 className="font-bold text-lg">{comp.title}</h3>
                                <p className="text-indigo-100 text-sm">{comp.scenario}</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Basic Approach */}
                                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                        <div className="text-xs font-bold text-red-600 mb-2 uppercase tracking-wide">❌ {comp.basic.label}</div>
                                        <div className="text-sm text-slate-700 mb-2">Winner: <strong>{comp.basic.winner}</strong></div>
                                        <div className="text-xs text-red-600 mb-2">{comp.basic.problem}</div>
                                        <div className="flex items-center gap-1 mt-3">
                                            <div className="h-2 bg-red-200 rounded-full flex-1">
                                                <div className="h-2 bg-red-500 rounded-full" style={{ width: comp.basic.satisfaction }} />
                                            </div>
                                            <span className="text-xs text-red-600 font-bold">{comp.basic.satisfaction}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Better Approach */}
                                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                        <div className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide">✓ {comp.better.label}</div>
                                        <div className="text-sm text-slate-700 mb-2">Winner: <strong>{comp.better.winner}</strong></div>
                                        <div className="text-xs text-emerald-600 mb-2">{comp.better.benefit}</div>
                                        <div className="flex items-center gap-1 mt-3">
                                            <div className="h-2 bg-emerald-200 rounded-full flex-1">
                                                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: comp.better.satisfaction }} />
                                            </div>
                                            <span className="text-xs text-emerald-600 font-bold">{comp.better.satisfaction}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Main Demo Page
// ============================================================================

function DemoPage(): React.ReactElement {
    const [selectedPoll, setSelectedPoll] = useState<string | null>('multiple-choice');
    const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'use-cases'>('types');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero Section - FIXED: 7 poll types */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5" />
                <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                            <Play size={16} />
                            Interactive Demo
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                            7 Ways to Make<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Better Decisions
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Not all polls are created equal. Choose the right type for your question 
                            and get insights that actually help you decide.
                        </p>
                        
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span>
                                <strong>Quick decisions, not science.</strong> Great for informal group input.
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation - FIXED: 7 poll types */}
            <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'overview', label: 'Quick Guide' },
                            { id: 'types', label: 'All 7 Poll Types' },
                            { id: 'use-cases', label: 'Use Cases' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'overview' | 'types' | 'use-cases')}
                                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {/* Quick Guide Tab */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <WhyItsBetterSection />
                        </motion.div>
                    )}

                    {/* All Poll Types Tab */}
                    {activeTab === 'types' && (
                        <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Poll Type Selector */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-32 space-y-2">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">Select a Poll Type</h3>
                                        {pollTypes.map((poll) => {
                                            const Icon = poll.icon;
                                            const isSelected = selectedPoll === poll.id;
                                            return (
                                                <button
                                                    key={poll.id}
                                                    onClick={() => setSelectedPoll(poll.id)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                                        isSelected
                                                            ? `bg-gradient-to-r ${poll.gradient} text-white shadow-lg`
                                                            : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        isSelected ? 'bg-white/20' : `bg-gradient-to-br ${poll.gradient}`
                                                    }`}>
                                                        <Icon className="text-white" size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                            {poll.name}
                                                            {poll.isPro && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">PRO</span>}
                                                        </div>
                                                        <div className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                                            {poll.tagline}
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Poll Details */}
                                <div className="lg:col-span-2">
                                    {selectedPollData && (
                                        <motion.div key={selectedPollData.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                            {/* Header */}
                                            <div className={`rounded-2xl p-8 bg-gradient-to-br ${selectedPollData.gradient} text-white`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <selectedPollData.icon size={32} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-1">{selectedPollData.name}</h2>
                                                        <p className="text-white/80">{selectedPollData.tagline}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-white/90 leading-relaxed">{selectedPollData.description}</p>
                                            </div>

                                            {/* Sample Results Visualization */}
                                            <ResultsVisualization poll={selectedPollData} />

                                            {/* How it works */}
                                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <Eye size={18} className="text-indigo-600" />
                                                    How It Works
                                                </h3>
                                                <p className="text-slate-600">{selectedPollData.howItWorks}</p>
                                            </div>

                                            {/* Best For / Not For */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                                    <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                                        <Check size={18} /> Best For
                                                    </h3>
                                                    <ul className="space-y-1.5">
                                                        {selectedPollData.bestFor.map((item, i) => (
                                                            <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                                                                <span className="text-emerald-500 mt-0.5">•</span>{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                                    <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                                        <AlertTriangle size={18} /> Not Ideal For
                                                    </h3>
                                                    <ul className="space-y-1.5">
                                                        {selectedPollData.notFor.map((item, i) => (
                                                            <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                                <span className="text-red-500 mt-0.5">•</span>{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Pro Tip */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <h3 className="font-bold text-amber-800 mb-1">💡 Pro Tip</h3>
                                                <p className="text-amber-700 text-sm">{selectedPollData.proTip}</p>
                                            </div>

                                            {/* CTA */}
                                            <a href="/create" className={`block w-full py-4 bg-gradient-to-r ${selectedPollData.gradient} text-white font-bold text-center rounded-xl hover:shadow-lg transition-all`}>
                                                Create a {selectedPollData.name} →
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Use Cases Tab */}
                    {activeTab === 'use-cases' && (
                        <motion.div key="use-cases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {useCases.map((useCase, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                            <useCase.icon size={24} className="text-indigo-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">{useCase.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4">{useCase.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {useCase.polls.map((poll, j) => (
                                                <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{poll}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to try it yourself?</h2>
                    <p className="text-indigo-100 mb-8">No signup needed. Create a poll in 30 seconds.</p>
                    <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg">
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default DemoPage;
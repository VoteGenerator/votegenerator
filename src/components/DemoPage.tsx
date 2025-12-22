// ============================================================================
// Demo Page - VoteGenerator
// INTERACTIVE: Users can vote and see different result visualizations
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListOrdered, CheckSquare, Calendar, ArrowLeftRight, SlidersHorizontal,
    Users, Image, ChevronRight, Sparkles, Building2, Heart, Briefcase,
    GraduationCap, PartyPopper, AlertTriangle, Play, ArrowRight,
    Eye, Check, BarChart3, TrendingUp, PieChart, Table, RotateCcw
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
    tagline: string;
    description: string;
    howItWorks: string;
    bestFor: string[];
    notFor: string[];
    proTip: string;
    isPro?: boolean;
    demoQuestion: string;
    demoOptions: string[];
}

const pollTypes: PollTypeInfo[] = [
    {
        id: 'multiple-choice', name: 'Multiple Choice', icon: CheckSquare, gradient: 'from-blue-500 to-indigo-600',
        tagline: 'The classic. Pick one (or more).',
        description: 'The most familiar poll type. Voters see a list of options and pick their favorite.',
        howItWorks: 'Present 2-10 options. Voters click their choice(s). Results show as a bar chart with percentages.',
        bestFor: ['Quick decisions', 'Team lunches', 'Simple votes', 'Yes/No questions'],
        notFor: ['Ranking preferences', 'Complex decisions'],
        proTip: 'Keep options to 5 or fewer for faster decisions.',
        demoQuestion: '🍕 What should we order for the team lunch?',
        demoOptions: ['Pizza', 'Thai Food', 'Tacos', 'Sushi']
    },
    {
        id: 'ranked-choice', name: 'Ranked Choice', icon: ListOrdered, gradient: 'from-indigo-500 to-purple-600',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite. Finds the option with broadest support.',
        howItWorks: 'Voters drag options to rank them. We use Instant Runoff Voting to find the winner.',
        bestFor: ['Multiple good options', 'Finding compromise', 'Elections'],
        notFor: ['Simple yes/no questions', 'Quick polls'],
        proTip: 'Prevents the "spoiler effect" where similar options split votes.',
        demoQuestion: '🏖️ Where should we go for the company retreat?',
        demoOptions: ['Beach Resort', 'Mountain Cabin', 'City Hotel', 'Camping']
    },
    {
        id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, gradient: 'from-orange-500 to-red-600',
        tagline: 'A vs B. Quick gut reactions.',
        description: 'Present two options at a time. Voters pick their preference. Great for narrowing down.',
        howItWorks: 'Show pairs of options. Voters click their favorite. Algorithm ranks by win rate.',
        bestFor: ['Quick comparisons', 'Design feedback', 'Narrowing down choices'],
        notFor: ['Many options at once', 'Nuanced decisions'],
        proTip: 'Perfect for design decisions where gut reaction matters.',
        demoQuestion: '🎨 Which logo design is better?',
        demoOptions: ['Design A', 'Design B', 'Design C']
    },
    {
        id: 'meeting-poll', name: 'Meeting Poll', icon: Calendar, gradient: 'from-amber-500 to-orange-600',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle but simpler. Show date/time options and let people mark availability.',
        howItWorks: 'Add time slots. Voters mark Available, Maybe, or Unavailable. Results show best times.',
        bestFor: ['Scheduling meetings', 'Planning events', 'Coordinating groups'],
        notFor: ['Non-time decisions', 'Single choice votes'],
        proTip: 'Offer 4-6 time slots. Too many makes finding overlap harder.',
        demoQuestion: '📅 When can everyone attend the kickoff?',
        demoOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Wed 3pm']
    },
    {
        id: 'rating-scale', name: 'Rating Scale', icon: SlidersHorizontal, gradient: 'from-cyan-500 to-blue-600',
        tagline: 'Rate each option 1-5 stars.',
        description: 'Voters rate every option independently. See average ratings to compare.',
        howItWorks: 'Each option gets a 1-5 star rating. Results show average scores for comparison.',
        bestFor: ['Comparing multiple items', 'Feedback collection', 'Quality assessment'],
        notFor: ['Choosing a single winner', 'Quick decisions'],
        proTip: 'Great for NPS-style feedback and feature prioritization.',
        demoQuestion: '⭐ Rate our new product features:',
        demoOptions: ['Dark Mode', 'Mobile App', 'API Access', 'Team Sharing']
    },
    {
        id: 'rsvp', name: 'RSVP', icon: Users, gradient: 'from-sky-500 to-blue-600',
        tagline: 'Yes, No, or Maybe.',
        description: 'Simple event attendance tracking. See who\'s coming at a glance.',
        howItWorks: 'Share the link. People respond Yes/No/Maybe. Get automatic headcount.',
        bestFor: ['Event planning', 'Headcounts', 'Simple attendance'],
        notFor: ['Complex scheduling', 'Multiple choice decisions'],
        proTip: 'Enable name collection to see exactly who\'s coming.',
        demoQuestion: '🎉 Can you attend the holiday party?',
        demoOptions: ['Yes, count me in!', 'Maybe', 'Sorry, can\'t make it']
    },
    {
        id: 'visual-poll', name: 'Visual Poll', icon: Image, gradient: 'from-pink-500 to-rose-600',
        tagline: 'Vote with images.',
        description: 'Upload images as options. Perfect when seeing is better than reading.',
        howItWorks: 'Upload 2-8 images. Voters click their favorite. Results show votes per image.',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests'],
        notFor: ['Text-based options', 'Abstract concepts'],
        proTip: 'Keep images similar in size and style for fair comparison.',
        isPro: true,
        demoQuestion: '🖼️ Which website design should we launch?',
        demoOptions: ['Modern Minimal', 'Bold & Colorful', 'Classic Professional']
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
// Interactive Demo Component
// ============================================================================

interface DemoVotes {
    [option: string]: number;
}

const InteractiveDemo: React.FC<{ poll: PollTypeInfo }> = ({ poll }) => {
    const [votes, setVotes] = useState<DemoVotes>(() => {
        // Initialize with random seed data
        const initial: DemoVotes = {};
        poll.demoOptions.forEach((opt, i) => {
            initial[opt] = Math.floor(Math.random() * 20) + 5 + (i === 0 ? 10 : 0);
        });
        return initial;
    });
    const [userVote, setUserVote] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'bar' | 'pie' | 'table'>('bar');

    const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

    const handleVote = (option: string) => {
        if (userVote === option) return; // Already voted for this
        
        setVotes(prev => {
            const newVotes = { ...prev };
            if (userVote) {
                newVotes[userVote] = Math.max(0, newVotes[userVote] - 1);
            }
            newVotes[option] = (newVotes[option] || 0) + 1;
            return newVotes;
        });
        setUserVote(option);
    };

    const resetDemo = () => {
        const initial: DemoVotes = {};
        poll.demoOptions.forEach((opt, i) => {
            initial[opt] = Math.floor(Math.random() * 20) + 5 + (i === 0 ? 10 : 0);
        });
        setVotes(initial);
        setUserVote(null);
    };

    const sortedOptions = [...poll.demoOptions].sort((a, b) => (votes[b] || 0) - (votes[a] || 0));
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Play size={18} className="text-indigo-600" />
                            Try It Live!
                        </h4>
                        <p className="text-sm text-slate-500">Click an option to vote</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={resetDemo} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition" title="Reset demo">
                            <RotateCcw size={18} />
                        </button>
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                            <button onClick={() => setViewMode('bar')} className={`p-1.5 rounded ${viewMode === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Bar chart">
                                <BarChart3 size={16} />
                            </button>
                            <button onClick={() => setViewMode('pie')} className={`p-1.5 rounded ${viewMode === 'pie' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Pie chart">
                                <PieChart size={16} />
                            </button>
                            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Table view">
                                <Table size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Question */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">{poll.demoQuestion}</h3>
                
                {/* Voting Options */}
                {!userVote && (
                    <div className="space-y-2 mb-6">
                        {poll.demoOptions.map((option, i) => (
                            <button
                                key={option}
                                onClick={() => handleVote(option)}
                                className="w-full p-4 text-left border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                            >
                                <span className="font-medium text-slate-700">{option}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Results */}
                {userVote && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                            <span>Your vote: <strong className="text-indigo-600">{userVote}</strong></span>
                            <span>{totalVotes} total votes</span>
                        </div>

                        {/* Bar Chart View */}
                        {viewMode === 'bar' && (
                            <div className="space-y-3">
                                {sortedOptions.map((option, i) => {
                                    const count = votes[option] || 0;
                                    const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                                    const isUserVote = option === userVote;
                                    return (
                                        <div key={option}>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className={`font-medium ${isUserVote ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                    {option} {isUserVote && '✓'}
                                                </span>
                                                <span className="font-bold text-slate-900">{pct}%</span>
                                            </div>
                                            <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                                    className={`h-full rounded-lg ${isUserVote ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                                    style={{ backgroundColor: isUserVote ? colors[0] : colors[i % colors.length] + '60' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pie Chart View */}
                        {viewMode === 'pie' && (
                            <div className="flex items-center gap-6">
                                <div className="relative w-40 h-40">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        {(() => {
                                            let cumulativePct = 0;
                                            return sortedOptions.map((option, i) => {
                                                const pct = totalVotes > 0 ? (votes[option] || 0) / totalVotes * 100 : 0;
                                                const dashArray = `${pct} ${100 - pct}`;
                                                const dashOffset = -cumulativePct;
                                                cumulativePct += pct;
                                                return (
                                                    <circle
                                                        key={option}
                                                        cx="50" cy="50" r="40"
                                                        fill="transparent"
                                                        stroke={colors[i % colors.length]}
                                                        strokeWidth="20"
                                                        strokeDasharray={dashArray}
                                                        strokeDashoffset={dashOffset}
                                                        className="transition-all duration-500"
                                                    />
                                                );
                                            });
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-slate-900">{totalVotes}</div>
                                            <div className="text-xs text-slate-500">votes</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {sortedOptions.map((option, i) => {
                                        const pct = totalVotes > 0 ? Math.round((votes[option] || 0) / totalVotes * 100) : 0;
                                        return (
                                            <div key={option} className="flex items-center gap-2 text-sm">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                                <span className="flex-1 text-slate-700">{option}</span>
                                                <span className="font-bold text-slate-900">{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Rank</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Option</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Votes</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOptions.map((option, i) => {
                                            const count = votes[option] || 0;
                                            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                                            const isUserVote = option === userVote;
                                            return (
                                                <tr key={option} className={`border-t border-slate-100 ${isUserVote ? 'bg-indigo-50' : ''}`}>
                                                    <td className="px-4 py-3 text-sm font-bold text-slate-500">#{i + 1}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        {option} {isUserVote && <span className="text-indigo-600">✓</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">{count}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">{pct}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Vote again prompt */}
                        <button onClick={resetDemo} className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Reset demo & vote again →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// Main Demo Page
// ============================================================================

function DemoPage(): React.ReactElement {
    const [selectedPoll, setSelectedPoll] = useState<string>('multiple-choice');
    const [activeTab, setActiveTab] = useState<'types' | 'use-cases'>('types');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero Section */}
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
                            Try each poll type live. Click to vote and see results in real-time with different visualizations.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'types', label: 'All 7 Poll Types' },
                            { id: 'use-cases', label: 'Use Cases' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'types' | 'use-cases')}
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

                                {/* Poll Details & Interactive Demo */}
                                <div className="lg:col-span-2">
                                    {selectedPollData && (
                                        <motion.div key={selectedPollData.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                            {/* Header */}
                                            <div className={`rounded-2xl p-6 bg-gradient-to-br ${selectedPollData.gradient} text-white`}>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <selectedPollData.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-1">{selectedPollData.name}</h2>
                                                        <p className="text-white/80">{selectedPollData.tagline}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-white/90 leading-relaxed">{selectedPollData.description}</p>
                                            </div>

                                            {/* Interactive Demo */}
                                            <InteractiveDemo poll={selectedPollData} />

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
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your own?</h2>
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
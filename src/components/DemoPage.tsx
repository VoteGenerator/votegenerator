import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListOrdered, 
    CheckSquare, 
    Calendar, 
    ArrowLeftRight,
    CircleDot,
    SlidersHorizontal,
    Coins,
    LayoutGrid,
    ThumbsUp,
    HelpCircle,
    Smile,
    Image,
    ChevronRight,
    Sparkles,
    Target,
    Play,
    ArrowRight,
    Lock,
    Eye,
    BarChart3,
    Shield,
    Crown,
    Check
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import PollTypePreview from './PollTypePreview';

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
    exampleQuestion: string;
    exampleOptions: string[];
    isPro?: boolean;
}

const pollTypes: PollTypeInfo[] = [
    {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        icon: CheckSquare,
        gradient: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        tagline: 'The classic. Pick one (or more).',
        description: 'Voters see a list of options and pick their favorite. Allow single or multiple selections.',
        howItWorks: 'Present 2-10 options → Voters click choice(s) → See bar chart with percentages',
        bestFor: ['Quick decisions', 'Team lunches', 'Simple yes/no votes', 'Getting headcounts'],
        exampleQuestion: 'What should we order for lunch?',
        exampleOptions: ['🍕 Pizza', '🍜 Thai', '🌮 Tacos', '🍣 Sushi'],
    },
    {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite. Finds the option with broadest support.',
        howItWorks: 'Drag options to rank 1st, 2nd, 3rd → Algorithm eliminates lowest → Winner emerges',
        bestFor: ['Many good options', 'Finding compromise', 'Elections', 'Avoiding vote splitting'],
        exampleQuestion: 'Where should we go for the retreat?',
        exampleOptions: ['🏔️ Mountain cabin', '🏖️ Beach resort', '🏙️ City hotel'],
    },
    {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        tagline: 'Find when everyone\'s free.',
        description: 'Like Doodle but simpler. Show dates/times, let people mark availability.',
        howItWorks: 'Add time slots → Voters mark Available/Maybe/Unavailable → See best overlap',
        bestFor: ['Scheduling meetings', 'Event planning', 'Coordinating groups'],
        exampleQuestion: 'When can everyone meet?',
        exampleOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Wed 3pm'],
    },
    {
        id: 'this-or-that',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        tagline: 'A vs B. Head-to-head battle.',
        description: 'Two options side by side. Voters pick one. Perfect for A/B testing.',
        howItWorks: 'Show two options → Voters click preference → See the split (e.g., 67% vs 33%)',
        bestFor: ['Design comparisons', 'Logo selection', 'A/B testing', 'Final decisions'],
        exampleQuestion: 'Which logo should we use?',
        exampleOptions: ['Logo A (Blue)', 'Logo B (Green)'],
    },
    {
        id: 'dot-voting',
        name: 'Dot Voting',
        icon: CircleDot,
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        tagline: 'Distribute votes. Show intensity.',
        description: 'Each voter gets a set of "dots" to distribute. Shows not just preference but passion.',
        howItWorks: 'Get 5 dots → Put them anywhere → See total dots per option',
        bestFor: ['Prioritizing features', 'Brainstorming', 'Sprint planning', 'Workshops'],
        exampleQuestion: 'Which features matter most? (5 dots)',
        exampleOptions: ['Dark mode', 'Mobile app', 'API', 'Reports'],
    },
    {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-50',
        tagline: 'Rate each option. See averages.',
        description: 'Rate each option on a scale (1-5 stars). See average ratings for comparison.',
        howItWorks: 'Each option gets a slider/stars → Rate independently → See averages',
        bestFor: ['Product feedback', 'Rating ideas', 'NPS-style surveys', 'Performance reviews'],
        exampleQuestion: 'Rate these tagline ideas:',
        exampleOptions: ['"Just vote."', '"Decisions, simplified."', '"Your voice, counted."'],
    },
    {
        id: 'buy-a-feature',
        name: 'Buy a Feature',
        icon: Coins,
        gradient: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        tagline: 'Spend virtual money. See priorities.',
        description: 'Each voter gets a budget to "spend" on features. Forces real tradeoffs.',
        howItWorks: 'Get $100 budget → Allocate to features with costs → See total "revenue" per option',
        bestFor: ['Product roadmaps', 'Feature prioritization', 'Resource allocation'],
        exampleQuestion: 'You have $100. What should we build?',
        exampleOptions: ['Mobile app ($50)', 'Dark mode ($20)', 'API ($40)'],
    },
    {
        id: 'priority-matrix',
        name: 'Priority Matrix',
        icon: LayoutGrid,
        gradient: 'from-fuchsia-500 to-purple-600',
        bgColor: 'bg-fuchsia-50',
        tagline: 'Plot on a 2x2 grid.',
        description: 'Place options on a matrix (like Impact vs Effort). See where the group clusters each item.',
        howItWorks: 'Drag items on 2x2 grid → See average positions as scatter plot',
        bestFor: ['Strategic planning', 'Risk assessment', 'Eisenhower matrix decisions'],
        exampleQuestion: 'Map each feature (Impact vs Effort):',
        exampleOptions: ['Mobile app', 'Dark mode', 'API access'],
    },
    {
        id: 'approval-voting',
        name: 'Approval Voting',
        icon: ThumbsUp,
        gradient: 'from-violet-500 to-indigo-600',
        bgColor: 'bg-violet-50',
        tagline: 'Thumbs up or down. Each option.',
        description: 'For each option, vote Yes or No. The option with most approvals wins.',
        howItWorks: 'See all options → Mark each as approved or not → Most approved wins',
        bestFor: ['Finding consensus', 'Committee decisions', 'When you want least controversial choice'],
        exampleQuestion: 'Which dates work for you?',
        exampleOptions: ['Dec 15', 'Dec 16', 'Dec 17', 'Dec 18'],
    },
    {
        id: 'quiz-poll',
        name: 'Quiz Poll',
        icon: HelpCircle,
        gradient: 'from-yellow-500 to-amber-600',
        bgColor: 'bg-yellow-50',
        tagline: 'Poll with a right answer.',
        description: 'Like multiple choice, but you set a "correct" answer. Great for trivia and training.',
        howItWorks: 'Create question → Mark correct answer → Voters see if they got it right',
        bestFor: ['Trivia nights', 'Team building', 'Training assessments', 'Icebreakers'],
        exampleQuestion: 'What year was the company founded?',
        exampleOptions: ['2019', '2020 ✓', '2021', '2022'],
    },
    {
        id: 'sentiment-check',
        name: 'Sentiment Check',
        icon: Smile,
        gradient: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50',
        tagline: 'Quick pulse. Emoji reactions.',
        description: 'Voters pick an emoji reaction. Takes 2 seconds. Perfect for temperature checks.',
        howItWorks: 'Ask question → Voters tap emoji → See sentiment distribution instantly',
        bestFor: ['Meeting retrospectives', 'Mood checks', 'Quick feedback', 'Agile team health'],
        exampleQuestion: 'How do you feel about the new office?',
        exampleOptions: ['😀 Love it', '😐 It\'s fine', '😞 Not great'],
    },
    {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        tagline: 'Vote with images.',
        description: 'Upload images as options. Voters click their favorite. Perfect for design decisions.',
        howItWorks: 'Upload 2-8 images → Voters click favorite → See votes per image',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests', 'Product comparisons'],
        exampleQuestion: 'Which website design should we launch?',
        exampleOptions: ['[Design A]', '[Design B]', '[Design C]'],
        isPro: true,
    }
];

// Interactive Demo Poll Component
const DemoPoll: React.FC<{
    question: string;
    options: string[];
    type: 'single' | 'multiple' | 'ranked';
    security?: string;
}> = ({ question, options, type, security }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [votes, setVotes] = useState<Record<string, number>>(() => {
        // Random initial votes for demo
        const initial: Record<string, number> = {};
        options.forEach(opt => {
            initial[opt] = Math.floor(Math.random() * 500) + 50;
        });
        return initial;
    });

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    const handleSelect = (option: string) => {
        if (hasVoted) return;
        if (type === 'single') {
            setSelected([option]);
        } else {
            setSelected(prev => 
                prev.includes(option) 
                    ? prev.filter(o => o !== option)
                    : [...prev, option]
            );
        }
    };

    const handleVote = () => {
        if (selected.length === 0) return;
        setHasVoted(true);
        // Add votes
        const newVotes = { ...votes };
        selected.forEach(opt => {
            newVotes[opt] = (newVotes[opt] || 0) + 1;
        });
        setVotes(newVotes);
    };

    const handleReset = () => {
        setHasVoted(false);
        setSelected([]);
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 overflow-hidden shadow-lg">
            {/* Yellow top border like StrawPoll */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
            
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{question}</h3>
                <p className="text-sm text-slate-500 mb-4">
                    {type === 'multiple' ? 'Choose as many as you like:' : 'Make a choice:'}
                </p>

                <div className="space-y-2 mb-6">
                    {options.map((option, i) => {
                        const percentage = hasVoted ? Math.round((votes[option] / totalVotes) * 100) : 0;
                        const isSelected = selected.includes(option);
                        
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(option)}
                                disabled={hasVoted}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                                    hasVoted
                                        ? 'border-slate-200 bg-slate-50'
                                        : isSelected
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                            >
                                {/* Progress bar (shown after voting) */}
                                {hasVoted && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="absolute inset-y-0 left-0 bg-indigo-100"
                                    />
                                )}
                                
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                                        }`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className="font-medium text-slate-700">{option}</span>
                                    </div>
                                    {hasVoted && (
                                        <span className="font-bold text-slate-600">{percentage}%</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {!hasVoted ? (
                        <button
                            onClick={handleVote}
                            disabled={selected.length === 0}
                            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Vote <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleReset}
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                    <button className="px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <BarChart3 size={16} /> Show results
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>{totalVotes.toLocaleString()} votes</span>
                    {security && (
                        <span className="flex items-center gap-1">
                            <Lock size={12} /> {security}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Analytics Preview Component
const AnalyticsPreview: React.FC<{ plan: 'free' | 'pro' }> = ({ plan }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-800">Poll Analytics</h4>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                    plan === 'free' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-700'
                }`}>
                    {plan === 'free' ? 'FREE' : 'PRO'}
                </span>
            </div>
            <div className="p-4">
                {/* Basic stats (free) */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">1,247</div>
                        <div className="text-xs text-slate-500">Total Votes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">68%</div>
                        <div className="text-xs text-slate-500">Leading Option</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">4</div>
                        <div className="text-xs text-slate-500">Options</div>
                    </div>
                </div>

                {/* Pro features (blurred/locked for free) */}
                <div className={`relative ${plan === 'free' ? 'opacity-50' : ''}`}>
                    {plan === 'free' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold text-slate-700 shadow-lg">
                                <Lock size={14} /> Upgrade to Pro
                            </div>
                        </div>
                    )}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Votes today</span>
                            <span className="font-semibold text-slate-800">+127</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Peak hour</span>
                            <span className="font-semibold text-slate-800">2:00 PM</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Avg. time to vote</span>
                            <span className="font-semibold text-slate-800">8 seconds</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DemoPage: React.FC = () => {
    const [selectedPoll, setSelectedPoll] = useState<string>('multiple-choice');
    const [activeTab, setActiveTab] = useState<'try-it' | 'types' | 'features'>('try-it');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Promo Banner */}
            <PromoBanner position="top" />
            <div className="h-12" />
            
            {/* Navigation */}
            <NavHeader />
            
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5" />
                <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                            <Play size={16} />
                            Interactive Demo
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                            Try Before You Create
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Experience all 12 poll types. Vote on live demos. See exactly how it works.
                        </p>
                        
                        {/* Subtle Note - Not a warning */}
                        <p className="text-slate-500 text-sm mt-6">
                            Perfect for team decisions, event planning, and group feedback.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'try-it', label: '🎯 Try a Poll', description: 'Vote on live demos' },
                            { id: 'types', label: '📊 All 12 Types', description: 'Explore each poll type' },
                            { id: 'features', label: '✨ Features', description: 'What you get' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
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
                    {/* Try It Tab - Interactive Demos */}
                    {activeTab === 'try-it' && (
                        <motion.div
                            key="try-it"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Real-Time Polling
                                </h2>
                                <p className="text-slate-600">
                                    Try voting on these demo polls. See how easy it is.
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8 mb-12">
                                {/* Demo Poll 1 */}
                                <div>
                                    <DemoPoll
                                        question="How easy is VoteGenerator to use?"
                                        options={['Super easy', 'Somewhat easy', 'Moderate', 'Quite difficult', 'Very difficult']}
                                        type="single"
                                        security="Cookie-based duplicate detection"
                                    />
                                </div>

                                {/* Demo Poll 2 */}
                                <div>
                                    <DemoPoll
                                        question="What features matter most to you?"
                                        options={['No signup required', 'Multiple poll types', 'Real-time results', 'Custom branding', 'Analytics']}
                                        type="multiple"
                                        security="Open voting"
                                    />
                                </div>
                            </div>

                            {/* Poll Types Quick Access */}
                            <div className="bg-slate-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                                    Explore More Poll Types
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {pollTypes.map(poll => (
                                        <button
                                            key={poll.id}
                                            onClick={() => {
                                                setSelectedPoll(poll.id);
                                                setActiveTab('types');
                                            }}
                                            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-center group"
                                        >
                                            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${poll.gradient} flex items-center justify-center`}>
                                                <poll.icon size={20} className="text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                                {poll.name}
                                            </span>
                                            {poll.isPro && (
                                                <span className="block mt-1 text-xs text-amber-600 font-bold">PRO</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Poll Types Tab */}
                    {activeTab === 'types' && (
                        <motion.div
                            key="types"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Poll Type List */}
                                <div className="lg:col-span-1 space-y-2">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                        All 12 Poll Types
                                    </h3>
                                    {pollTypes.map((poll) => (
                                        <button
                                            key={poll.id}
                                            onClick={() => setSelectedPoll(poll.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                                                selectedPoll === poll.id
                                                    ? 'bg-gradient-to-r ' + poll.gradient + ' text-white shadow-lg'
                                                    : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                selectedPoll === poll.id
                                                    ? 'bg-white/20'
                                                    : 'bg-gradient-to-br ' + poll.gradient
                                            }`}>
                                                <poll.icon size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold truncate ${selectedPoll === poll.id ? 'text-white' : 'text-slate-800'}`}>
                                                        {poll.name}
                                                    </span>
                                                    {poll.isPro && (
                                                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                                                            selectedPoll === poll.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            PRO
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs truncate ${selectedPoll === poll.id ? 'text-white/80' : 'text-slate-500'}`}>
                                                    {poll.tagline}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className={selectedPoll === poll.id ? 'text-white' : 'text-slate-400'} />
                                        </button>
                                    ))}
                                </div>

                                {/* Poll Type Detail */}
                                <div className="lg:col-span-2">
                                    {selectedPollData && (
                                        <motion.div
                                            key={selectedPollData.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-6"
                                        >
                                            {/* Header Card */}
                                            <div className={`bg-gradient-to-r ${selectedPollData.gradient} rounded-2xl p-6 text-white`}>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <selectedPollData.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                                            {selectedPollData.name}
                                                            {selectedPollData.isPro && (
                                                                <span className="px-2 py-1 bg-white/20 text-sm font-bold rounded flex items-center gap-1">
                                                                    <Crown size={12} /> PRO
                                                                </span>
                                                            )}
                                                        </h2>
                                                        <p className="text-white/80">{selectedPollData.tagline}</p>
                                                    </div>
                                                </div>
                                                <p className="text-white/90">{selectedPollData.description}</p>
                                            </div>

                                            {/* Demo Preview */}
                                            <div className={`${selectedPollData.bgColor} rounded-2xl p-6`}>
                                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Eye size={18} />
                                                    Preview
                                                </h3>
                                                <PollTypePreview
                                                    pollTypeId={selectedPollData.id}
                                                    question={selectedPollData.exampleQuestion}
                                                    options={selectedPollData.exampleOptions}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="bg-white rounded-xl p-5 border border-slate-200">
                                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                        <Target size={16} className="text-indigo-600" />
                                                        How It Works
                                                    </h3>
                                                    <p className="text-slate-600 text-sm">{selectedPollData.howItWorks}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-5 border border-slate-200">
                                                    <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                                        <Check size={16} />
                                                        Best For
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPollData.bestFor.map((item, i) => (
                                                            <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <a
                                                href="#"
                                                className={`block w-full py-4 bg-gradient-to-r ${selectedPollData.gradient} text-white font-bold text-center rounded-xl hover:shadow-lg transition-all text-lg`}
                                            >
                                                Create a {selectedPollData.name} →
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <motion.div
                            key="features"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    What You Get
                                </h2>
                                <p className="text-slate-600">
                                    Compare free vs. paid features. See what's included.
                                </p>
                            </div>

                            {/* Feature Comparison */}
                            <div className="grid lg:grid-cols-2 gap-8 mb-12">
                                {/* Free Plan */}
                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-50 p-6 border-b border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">Free</h3>
                                                <p className="text-slate-500">Everything you need to start</p>
                                            </div>
                                            <span className="text-3xl font-black text-slate-800">$0</span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {[
                                            { text: 'All 12 poll types', included: true },
                                            { text: 'Unlimited polls', included: true },
                                            { text: 'Up to 100 responses/poll', included: true },
                                            { text: 'Basic analytics', included: true },
                                            { text: 'Cookie duplicate detection', included: true },
                                            { text: 'Scheduled closing', included: true },
                                            { text: 'Dashboard notifications', included: true },
                                            { text: 'Ads displayed', included: false, negative: true },
                                            { text: 'VoteGenerator branding', included: false, negative: true },
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                {feature.negative ? (
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <span className="text-slate-400 text-xs">—</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Check size={12} className="text-green-600" />
                                                    </div>
                                                )}
                                                <span className={feature.negative ? 'text-slate-400' : 'text-slate-700'}>
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pro Plan */}
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden text-white">
                                    <div className="p-6 border-b border-white/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    Pro <Crown size={18} className="text-amber-300" />
                                                </h3>
                                                <p className="text-indigo-100">Unlock everything</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-black">$12</span>
                                                <span className="text-indigo-200">/mo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {[
                                            'Everything in Free',
                                            'Unlimited responses',
                                            'Visual Poll (images)',
                                            'Unified admin dashboard',
                                            'Remove ads & branding',
                                            'Upload your logo',
                                            'Unique voting codes',
                                            'Download CSV, Excel & PDF',
                                            'Custom short links',
                                            'Email support',
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Check size={12} className="text-white" />
                                                </div>
                                                <span className="text-white">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Preview */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                                    Analytics Preview
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <AnalyticsPreview plan="free" />
                                    <AnalyticsPreview plan="pro" />
                                </div>
                            </div>

                            {/* Security Options */}
                            <div className="bg-slate-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                                    Vote Security Options
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl p-5 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield size={18} className="text-slate-600" />
                                            <h4 className="font-bold text-slate-800">Cookie Detection</h4>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">FREE</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Uses browser cookies to detect repeat voters. Works for most casual polls.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-5 border border-indigo-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock size={18} className="text-indigo-600" />
                                            <h4 className="font-bold text-slate-800">Unique Codes</h4>
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">PRO</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Generate one-time voting codes. Each code works exactly once. Most reliable method.
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-5 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield size={18} className="text-purple-600" />
                                            <h4 className="font-bold text-slate-800">Advanced Protection</h4>
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">PRO+</span>
                                        </div>
                                        <p className="text-slate-600 text-sm">
                                            Combines cookies + codes + rate limiting for maximum protection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to create your own poll?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        No signup. No credit card. Just start creating.
                    </p>
                    <a
                        href="#poll-creator"
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById('poll-creator');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                    >
                        <Sparkles size={20} />
                        Create Free Poll
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DemoPage;
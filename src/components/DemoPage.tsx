import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ListOrdered, 
    CheckSquare, 
    Calendar, 
    ArrowLeftRight,
    SlidersHorizontal,
    Image,
    Users,
    ChevronRight,
    Sparkles,
    Building2,
    Heart,
    Briefcase,
    GraduationCap,
    PartyPopper,
    Target,
    AlertTriangle,
    Play,
    ArrowRight,
    Eye,
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
    notFor: string[];
    exampleQuestion: string;
    exampleOptions: string[];
    proTip: string;
    tier: 'free' | 'pro_event';
}

// ===== 7 ACTIVE POLL TYPES =====
const pollTypes: PollTypeInfo[] = [
    {
        id: 'multiple-choice',
        name: 'Multiple Choice',
        icon: CheckSquare,
        gradient: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
        tagline: 'The classic. Pick one (or more).',
        description: 'The most familiar poll type. Voters see a list of options and pick their favorite. You can allow single selection or let people choose multiple options.',
        howItWorks: 'Present 2-10 options. Voters click their choice(s). Results show as a bar chart with percentages. Simple, fast, and universally understood.',
        bestFor: ['Quick decisions', 'Team lunches', 'Simple votes', 'Getting a headcount', 'Yes/No questions'],
        notFor: ['Ranking preferences', 'Complex decisions with tradeoffs', 'Budget allocation'],
        exampleQuestion: 'What should we order for the team lunch?',
        exampleOptions: ['🍕 Pizza', '🍜 Thai food', '🌮 Tacos', '🍣 Sushi'],
        proTip: 'Keep options to 5 or fewer for faster decisions. Too many choices cause "analysis paralysis."',
        tier: 'free'
    },
    {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite by dragging them into order. The algorithm finds the option with the broadest support.',
        howItWorks: 'Voters drag options to rank them 1st, 2nd, 3rd, etc. We use Instant Runoff Voting (IRV) to find the winner with majority support.',
        bestFor: ['Choosing between many options', 'Finding compromise', 'Elections', 'Team retreats', 'Avoiding vote splitting'],
        notFor: ['Simple yes/no questions', 'Time-sensitive polls', 'Very young audiences'],
        exampleQuestion: 'Where should we go for the company retreat?',
        exampleOptions: ['🏔️ Mountain cabin', '🏖️ Beach resort', '🏙️ City hotel', '🏕️ Camping'],
        proTip: 'Great when you have 3+ strong contenders and want to avoid the "spoiler effect."',
        tier: 'free'
    },
    {
        id: 'this-or-that',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        tagline: 'A vs B. Head-to-head battle.',
        description: 'Present exactly two options side by side. Voters pick one. Perfect for design feedback, A/B testing, and quick binary decisions.',
        howItWorks: 'Show two options (can include images). Voters click their preference. Results show the split percentage.',
        bestFor: ['Design comparisons', 'A/B testing', 'Logo selection', 'Final decisions', '"Would you rather" games'],
        notFor: ['More than 2 options', 'Nuanced feedback', 'Ranking multiple items'],
        exampleQuestion: 'Which logo should we use?',
        exampleOptions: ['Logo A (Blue)', 'Logo B (Green)'],
        proTip: 'Run multiple rounds: "Winner of Round 1 vs Option C" to find the best.',
        tier: 'free'
    },
    {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle but simpler. Show a grid of dates/times and let people mark their availability. Instantly see which slot works best.',
        howItWorks: 'Add date/time options. Voters mark each as "Available," "Maybe," or "Unavailable." Results highlight the best time.',
        bestFor: ['Scheduling meetings', 'Planning events', 'Coordinating time zones', 'Finding common availability'],
        notFor: ['Non-time decisions', 'Choosing between options'],
        exampleQuestion: 'When can everyone attend the project kickoff?',
        exampleOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Tue 2pm', 'Wed 10am'],
        proTip: 'Offer 4-6 time slots. Too many options makes it hard to find overlap.',
        tier: 'free'
    },
    {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-50',
        tagline: 'Rate each option. See averages.',
        description: 'Voters rate each option on a scale (1-5 stars). See the average rating for each. Good for evaluating multiple items independently.',
        howItWorks: 'Each option gets a star rating. Voters rate each one. Results show average scores for comparison.',
        bestFor: ['Feedback collection', 'Rating multiple ideas', 'Product reviews', 'Performance evaluations'],
        notFor: ['Choosing one winner', 'Forced ranking', 'Binary decisions'],
        exampleQuestion: 'Rate each proposed tagline (1-5 stars):',
        exampleOptions: ['"Just vote."', '"Decisions, simplified."', '"Your voice, counted."'],
        proTip: 'Use 5-point scales. More granular scales (1-10) are harder for voters to use consistently.',
        tier: 'free'
    },
    {
        id: 'rsvp',
        name: 'RSVP',
        icon: Users,
        gradient: 'from-sky-500 to-blue-600',
        bgColor: 'bg-sky-50',
        tagline: 'Yes, No, Maybe. Simple attendance.',
        description: 'Collect event attendance with simple Yes/No/Maybe responses. See who\'s coming at a glance with automatic headcounts.',
        howItWorks: 'Create your event with details. Guests respond with their attendance. You get a real-time headcount and guest list.',
        bestFor: ['Party invitations', 'Team events', 'Workshops', 'Social gatherings', 'Volunteer signups'],
        notFor: ['Choosing between options', 'Ranked preferences', 'Complex scheduling'],
        exampleQuestion: 'Can you make it to the holiday party?',
        exampleOptions: ['✅ Yes!', '❌ Can\'t make it', '🤔 Maybe'],
        proTip: 'Add a deadline to get final counts. Follow up with "maybes" a few days before.',
        tier: 'free'
    },
    {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        tagline: 'Vote with images. See to decide.',
        description: 'Upload images as options. Voters click on the image they prefer. Perfect when seeing is better than reading.',
        howItWorks: 'Upload 2-8 images as options. Voters click their favorite. Results show votes per image with thumbnails.',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests', 'Product comparisons', 'Creative decisions'],
        notFor: ['Text-based options', 'Abstract concepts', 'When images aren\'t relevant'],
        exampleQuestion: 'Which website design should we launch?',
        exampleOptions: ['[Design A]', '[Design B]', '[Design C]'],
        proTip: 'Keep images similar in size and style. One fancy image vs one plain one biases results.',
        tier: 'pro_event'
    }
];

const useCases = [
    {
        icon: Building2,
        title: 'Workplace & Teams',
        description: 'Team lunches, meeting times, project names, retrospectives',
        polls: ['Multiple Choice', 'Meeting Poll', 'Ranked Choice', 'Rating Scale']
    },
    {
        icon: Heart,
        title: 'Weddings & Events',
        description: 'Song requests, menu choices, date selection, RSVPs',
        polls: ['RSVP', 'Multiple Choice', 'This or That', 'Meeting Poll']
    },
    {
        icon: GraduationCap,
        title: 'Education',
        description: 'Class votes, topic preferences, feedback, group projects',
        polls: ['Multiple Choice', 'Ranked Choice', 'Rating Scale', 'This or That']
    },
    {
        icon: Briefcase,
        title: 'Product & Business',
        description: 'Feature prioritization, design decisions, stakeholder alignment',
        polls: ['Ranked Choice', 'Visual Poll', 'Rating Scale', 'This or That']
    },
    {
        icon: PartyPopper,
        title: 'Fun & Social',
        description: 'Game nights, friend group decisions, photo contests',
        polls: ['This or That', 'Visual Poll', 'Ranked Choice', 'Multiple Choice']
    },
    {
        icon: Users,
        title: 'Community & Groups',
        description: 'Club decisions, volunteer coordination, elections',
        polls: ['Ranked Choice', 'RSVP', 'Multiple Choice', 'Meeting Poll']
    }
];

const DemoPage: React.FC = () => {
    const [selectedPoll, setSelectedPoll] = useState<string | null>('multiple-choice');
    const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'use-cases'>('types');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />

            {/* Hero */}
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
                            Choose the right poll type for your question and get insights that actually help.
                        </p>
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span><strong>Quick decisions, not science.</strong> Great for informal group input.</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-28 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'overview', label: 'Quick Guide' },
                            { id: 'types', label: 'All 7 Poll Types' },
                            { id: 'use-cases', label: 'Use Cases' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
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
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Which Poll Type Do I Need?</h2>
                                <p className="text-slate-500 text-center mb-8">Choose based on what you're trying to accomplish</p>
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { icon: Target, color: 'blue', title: '"Pick one thing"', desc: 'Simple decision between clear options', polls: ['Multiple Choice', 'This or That'] },
                                        { icon: ListOrdered, color: 'purple', title: '"Rank preferences"', desc: 'Order of preference matters', polls: ['Ranked Choice'] },
                                        { icon: Calendar, color: 'amber', title: '"When are you free?"', desc: 'Scheduling and availability', polls: ['Meeting Poll'] },
                                        { icon: SlidersHorizontal, color: 'cyan', title: '"Rate everything"', desc: 'Evaluate each option independently', polls: ['Rating Scale'] },
                                        { icon: Users, color: 'sky', title: '"Are you coming?"', desc: 'Event attendance tracking', polls: ['RSVP'] },
                                        { icon: Image, color: 'pink', title: '"Which looks better?"', desc: 'Visual comparisons', polls: ['Visual Poll'], isPro: true },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                            <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                                                <item.icon size={24} className={`text-${item.color}-600`} />
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                            <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.polls.map((poll, j) => (
                                                    <span key={j} className={`px-2 py-1 bg-${item.color}-50 text-${item.color}-700 text-xs font-semibold rounded-full`}>{poll}</span>
                                                ))}
                                                {item.isPro && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">PRO</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                                    <Sparkles size={20} />Create Your First Poll<ArrowRight size={20} />
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'types' && (
                        <motion.div key="types" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1 space-y-2">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select a Poll Type</h3>
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
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPoll === poll.id ? 'bg-white/20' : 'bg-gradient-to-br ' + poll.gradient}`}>
                                                <poll.icon size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold truncate ${selectedPoll === poll.id ? 'text-white' : 'text-slate-800'}`}>{poll.name}</span>
                                                    {poll.tier === 'pro_event' && (
                                                        <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${selectedPoll === poll.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>PRO</span>
                                                    )}
                                                </div>
                                                <p className={`text-xs truncate ${selectedPoll === poll.id ? 'text-white/80' : 'text-slate-500'}`}>{poll.tagline}</p>
                                            </div>
                                            <ChevronRight size={16} className={selectedPoll === poll.id ? 'text-white' : 'text-slate-400'} />
                                        </button>
                                    ))}
                                </div>

                                <div className="lg:col-span-2">
                                    {selectedPollData && (
                                        <motion.div key={selectedPollData.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                            <div className={`bg-gradient-to-r ${selectedPollData.gradient} p-6 text-white`}>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <selectedPollData.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                                            {selectedPollData.name}
                                                            {selectedPollData.tier === 'pro_event' && <span className="px-2 py-1 bg-white/20 text-sm font-bold rounded">PRO</span>}
                                                        </h2>
                                                        <p className="text-white/80">{selectedPollData.tagline}</p>
                                                    </div>
                                                </div>
                                                <p className="text-white/90">{selectedPollData.description}</p>
                                            </div>
                                            <div className="p-6 space-y-6">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Eye size={18} className="text-indigo-600" />How It Works</h3>
                                                    <p className="text-slate-600">{selectedPollData.howItWorks}</p>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-emerald-50 rounded-xl p-4">
                                                        <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><Check size={16} />Best For</h4>
                                                        <ul className="space-y-1">{selectedPollData.bestFor.map((item, i) => <li key={i} className="text-sm text-emerald-700">• {item}</li>)}</ul>
                                                    </div>
                                                    <div className="bg-red-50 rounded-xl p-4">
                                                        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><AlertTriangle size={16} />Not Ideal For</h4>
                                                        <ul className="space-y-1">{selectedPollData.notFor.map((item, i) => <li key={i} className="text-sm text-red-700">• {item}</li>)}</ul>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <h4 className="font-bold text-slate-800 mb-2">Example</h4>
                                                    <p className="text-slate-700 font-medium mb-2">"{selectedPollData.exampleQuestion}"</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPollData.exampleOptions.map((opt, i) => <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600">{opt}</span>)}
                                                    </div>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                    <h4 className="font-bold text-amber-800 mb-1">💡 Pro Tip</h4>
                                                    <p className="text-sm text-amber-700">{selectedPollData.proTip}</p>
                                                </div>
                                                <a href={`/create?type=${selectedPollData.id}`} className={`w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r ${selectedPollData.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all`}>
                                                    Create {selectedPollData.name} Poll<ArrowRight size={18} />
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'use-cases' && (
                        <motion.div key="use-cases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Polls for Every Situation</h2>
                                <p className="text-slate-600 max-w-2xl mx-auto">Whether you're planning a wedding or prioritizing features, there's a poll for you.</p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {useCases.map((useCase, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                            <useCase.icon size={28} className="text-indigo-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{useCase.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4">{useCase.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {useCase.polls.map((poll, j) => <span key={j} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">{poll}</span>)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                                    <Sparkles size={20} />Start Creating<ArrowRight size={20} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

export default DemoPage;
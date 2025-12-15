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
    Users,
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
        description: 'The most familiar poll type. Voters see a list of options and pick their favorite. You can allow single selection or let people choose multiple options.',
        howItWorks: 'Present 2-10 options. Voters click their choice(s). Results show as a bar chart with percentages. Simple, fast, and universally understood.',
        bestFor: ['Quick decisions', 'Team lunches', 'Simple votes', 'Getting a headcount', 'Yes/No questions'],
        notFor: ['Ranking preferences', 'Complex decisions with tradeoffs', 'Budget allocation'],
        exampleQuestion: 'What should we order for the team lunch?',
        exampleOptions: ['🍕 Pizza', '🍜 Thai food', '🌮 Tacos', '🍣 Sushi'],
        proTip: 'Keep options to 5 or fewer for faster decisions. Too many choices cause "analysis paralysis."'
    },
    {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite by dragging them into order. The algorithm finds the option with the broadest support, not just the most first-place votes.',
        howItWorks: 'Voters drag options to rank them 1st, 2nd, 3rd, etc. We use Instant Runoff Voting (IRV) to eliminate the lowest-ranked option and redistribute votes until one wins with majority support.',
        bestFor: ['Choosing between many good options', 'Finding compromise', 'Elections and voting', 'Team retreats', 'Avoiding "vote splitting"'],
        notFor: ['Simple yes/no questions', 'Time-sensitive quick polls', 'Very young audiences'],
        exampleQuestion: 'Where should we go for the company retreat?',
        exampleOptions: ['🏔️ Mountain cabin', '🏖️ Beach resort', '🏙️ City hotel', '🏕️ Camping'],
        proTip: 'This prevents the "spoiler effect" where similar options split votes. Great when you have 3+ strong contenders.'
    },
    {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle or When2Meet, but simpler. Show a grid of dates/times and let people mark their availability. Instantly see which slot works for the most people.',
        howItWorks: 'You add date/time options. Voters mark each as "Available," "Maybe," or "Unavailable." Results highlight the best time slot with a heat map.',
        bestFor: ['Scheduling meetings', 'Planning events', 'Coordinating across time zones', 'Finding common availability'],
        notFor: ['Decisions unrelated to time', 'Choosing between non-time options'],
        exampleQuestion: 'When can everyone attend the project kickoff?',
        exampleOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Tue 2pm', 'Wed 10am'],
        proTip: 'Offer 4-6 time slots. Too many options makes it hard to find overlap.'
    },
    {
        id: 'this-or-that',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        tagline: 'A vs B. Head-to-head battle.',
        description: 'Present exactly two options side by side. Voters pick one. Perfect for design feedback, A/B testing, and quick binary decisions.',
        howItWorks: 'Show two options (can include images). Voters click their preference. Results show the split, like "67% prefer Option A."',
        bestFor: ['Design comparisons', 'A/B testing', 'Logo selection', 'Final decisions between 2 choices', '"Would you rather" games'],
        notFor: ['More than 2 options', 'Nuanced feedback', 'Ranking multiple items'],
        exampleQuestion: 'Which logo should we use?',
        exampleOptions: ['Logo A (Blue)', 'Logo B (Green)'],
        proTip: 'Great for narrowing down. Run multiple rounds: "Winner of Round 1 vs Option C" to find the best.'
    },
    {
        id: 'dot-voting',
        name: 'Dot Voting',
        icon: CircleDot,
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        tagline: 'Distribute your votes. Show intensity.',
        description: 'Each voter gets a set number of "dots" (votes) to distribute however they want. Put all dots on one option you love, or spread them across several. Shows not just preference but intensity.',
        howItWorks: 'Voters get 5-10 dots to allocate. They can put multiple dots on one option or spread them. Results show total dots per option, revealing both popularity and passion.',
        bestFor: ['Prioritizing features', 'Brainstorming sessions', 'Identifying top 3-5 from many options', 'Agile sprint planning', 'Workshop facilitation'],
        notFor: ['Simple single-choice questions', 'When equal weighting matters', 'Small option sets'],
        exampleQuestion: 'Which features should we build next? (You have 5 dots)',
        exampleOptions: ['Dark mode', 'Mobile app', 'API access', 'Integrations', 'Reports', 'Templates'],
        proTip: 'Give voters fewer dots than options (e.g., 5 dots for 10 options) to force prioritization.'
    },
    {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-50',
        tagline: 'Rate each option. See averages.',
        description: 'Voters rate each option on a scale (like 1-5 stars or 0-100). See the average rating for each option. Good for evaluating multiple items independently.',
        howItWorks: 'Each option gets a slider or star rating. Voters rate each one. Results show average scores, letting you compare options on the same scale.',
        bestFor: ['NPS-style feedback', 'Rating multiple ideas', 'Performance reviews', 'Product feedback', 'Evaluating candidates'],
        notFor: ['Choosing one winner', 'When you need forced ranking', 'Binary decisions'],
        exampleQuestion: 'Rate each proposed tagline (1-5 stars):',
        exampleOptions: ['"Just vote."', '"Decisions, simplified."', '"Your voice, counted."', '"Poll smarter."'],
        proTip: 'Use 5-point scales. Anything more granular (1-10) is harder for voters to be consistent.'
    },
    {
        id: 'buy-a-feature',
        name: 'Buy a Feature',
        icon: Coins,
        gradient: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        tagline: 'Spend virtual money. See priorities.',
        description: "Each voter gets a virtual budget (like $100) to \"spend\" on options. Some features cost more than others. Forces real prioritization because you can't have everything.",
        howItWorks: 'Assign costs to each option. Voters allocate their budget. Results show total "revenue" per option, revealing true demand when tradeoffs are involved.',
        bestFor: ['Product roadmap planning', 'Feature prioritization', 'Resource allocation decisions', 'Understanding willingness to pay', 'Stakeholder alignment'],
        notFor: ['Simple preference polls', 'When all options are equal cost', 'Fun/casual polls'],
        exampleQuestion: 'You have $100 to spend. What should we build?',
        exampleOptions: ['Mobile app ($50)', 'Dark mode ($20)', 'API ($40)', 'Templates ($15)', 'Reports ($30)'],
        proTip: 'Price options based on actual effort/cost. This reveals if people want expensive features badly enough.'
    },
    {
        id: 'priority-matrix',
        name: 'Priority Matrix',
        icon: LayoutGrid,
        gradient: 'from-fuchsia-500 to-purple-600',
        bgColor: 'bg-fuchsia-50',
        tagline: 'Plot on a 2x2 grid. Impact vs Effort.',
        description: 'Voters place each option on a 2x2 matrix (like Impact vs Effort). See where the group clusters each item. Great for strategic prioritization.',
        howItWorks: 'Present a grid with two axes (customizable). Voters drag each option to where they think it belongs. Results show average positions as a scatter plot.',
        bestFor: ['Strategic planning', 'Risk assessment', 'Eisenhower matrix decisions', 'Comparing impact vs effort', 'Product prioritization'],
        notFor: ['Simple polls', 'Non-strategic decisions', 'Audiences unfamiliar with matrices'],
        exampleQuestion: 'Where does each feature land? (X: Effort, Y: Impact)',
        exampleOptions: ['Mobile app', 'Dark mode', 'API access', 'Integrations'],
        proTip: 'Use familiar axes like "Impact vs Effort" or "Urgent vs Important." Explain the matrix to voters first.'
    },
    {
        id: 'approval-voting',
        name: 'Approval Voting',
        icon: ThumbsUp,
        gradient: 'from-violet-500 to-indigo-600',
        bgColor: 'bg-violet-50',
        tagline: 'Thumbs up or down. Each option.',
        description: "For each option, voters simply say \"Yes\" (approve) or \"No\" (don't approve). No ranking, no intensity - just binary approval. The option with the most approvals wins.",
        howItWorks: 'Voters see all options and mark each as approved or not. Results show approval percentage for each option. The most broadly acceptable option wins.',
        bestFor: ['Finding consensus', 'Committee decisions', 'Filtering many options', 'When you want the least controversial choice', 'Elections with many candidates'],
        notFor: ['Ranking preferences', 'When intensity of preference matters', 'A/B decisions'],
        exampleQuestion: 'Which dates work for you? (Select all that apply)',
        exampleOptions: ['December 15', 'December 16', 'December 17', 'December 18'],
        proTip: "This finds the option most people can live with, even if it's nobody's #1 choice. Great for group harmony."
    },
    {
        id: 'quiz-poll',
        name: 'Quiz Poll',
        icon: HelpCircle,
        gradient: 'from-yellow-500 to-amber-600',
        bgColor: 'bg-yellow-50',
        tagline: 'Poll with a right answer.',
        description: 'Like multiple choice, but you set a "correct" answer. Great for trivia, knowledge checks, and gamified engagement. Shows how many got it right.',
        howItWorks: 'Create a question with options. Mark one as correct. Voters answer, then see if they got it right. Results show the distribution and correct answer.',
        bestFor: ['Trivia nights', 'Team building', 'Knowledge checks', 'Training assessments', 'Educational content', 'Icebreakers'],
        notFor: ['Opinion-based questions', 'Decisions without a right answer', 'Serious surveys'],
        exampleQuestion: 'What year was the company founded?',
        exampleOptions: ['2019', '2020 ✓', '2021', '2022'],
        proTip: 'Add explanations to the correct answer to make it educational, not just a quiz.'
    },
    {
        id: 'sentiment-check',
        name: 'Sentiment Check',
        icon: Smile,
        gradient: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50',
        tagline: 'Quick pulse. Emoji reactions.',
        description: 'The fastest way to gauge how people feel. Voters pick an emoji reaction (😀 😐 😞 or custom). Perfect for quick temperature checks.',
        howItWorks: 'Ask a question. Voters tap an emoji. Results show the sentiment distribution instantly. Takes 2 seconds to vote.',
        bestFor: ['Meeting retrospectives', 'Mood checks', 'Quick feedback', 'Event reactions', 'Icebreakers', 'Agile team health'],
        notFor: ['Detailed feedback', 'Complex decisions', 'When you need nuance'],
        exampleQuestion: 'How do you feel about the new office layout?',
        exampleOptions: ["😀 Love it", "😐 It's fine", "😞 Not great"],
        proTip: 'Use at the start of meetings to gauge energy, or at the end to check satisfaction.'
    },
    {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        tagline: 'Vote with images. See to decide.',
        description: 'Upload images as options. Voters click on the image they prefer. Perfect when seeing is better than reading - designs, photos, products.',
        howItWorks: 'Upload 2-8 images as options. Voters click their favorite. Results show votes per image with visual thumbnails.',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests', 'Product comparisons', 'Aesthetic choices', 'Creative decisions'],
        notFor: ["Text-based options", "Abstract concepts", "When images aren't relevant"],
        exampleQuestion: 'Which website design should we launch?',
        exampleOptions: ['[Design A image]', '[Design B image]', '[Design C image]'],
        proTip: 'Keep images similar in size and style. One fancy image vs one plain one biases results.',
        isPro: true
    }
];

const useCases = [
    {
        icon: Building2,
        title: 'Workplace & Teams',
        description: 'Team lunches, meeting times, project names, sprint planning, retrospectives',
        polls: ['Multiple Choice', 'Meeting Poll', 'Dot Voting', 'Sentiment Check']
    },
    {
        icon: Heart,
        title: 'Weddings & Events',
        description: 'Song requests, seating preferences, menu choices, date selection',
        polls: ['Multiple Choice', 'This or That', 'Meeting Poll', 'Approval Voting']
    },
    {
        icon: GraduationCap,
        title: 'Education',
        description: 'Class votes, trivia games, topic preferences, feedback collection',
        polls: ['Quiz Poll', 'Multiple Choice', 'Rating Scale', 'Sentiment Check']
    },
    {
        icon: Briefcase,
        title: 'Product & Business',
        description: 'Feature prioritization, roadmap planning, stakeholder alignment, design decisions',
        polls: ['Ranked Choice', 'Buy a Feature', 'Priority Matrix', 'Visual Poll']
    },
    {
        icon: PartyPopper,
        title: 'Fun & Social',
        description: 'Game nights, friend group decisions, "would you rather," trivia',
        polls: ['This or That', 'Quiz Poll', 'Ranked Choice', 'Multiple Choice']
    },
    {
        icon: Users,
        title: 'Community & Groups',
        description: 'Club decisions, volunteer coordination, community feedback, elections',
        polls: ['Ranked Choice', 'Approval Voting', 'Multiple Choice', 'Meeting Poll']
    }
];

const DemoPage: React.FC = () => {
    const [selectedPoll, setSelectedPoll] = useState<string | null>('multiple-choice');
    const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'use-cases'>('types');

    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Promo Banner */}
            <PromoBanner position="top" />
            <div className="h-12" />
            
            {/* Nav Header */}
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
                            12 Ways to Make<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Better Decisions
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Not all polls are created equal. Choose the right type for your question 
                            and get insights that actually help you decide.
                        </p>
                        
                        {/* Important Disclaimer */}
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span>
                                <strong>Quick decisions, not science.</strong> Online polls are great for informal group input, 
                                but aren't statistically rigorous surveys. For scientific research, use proper survey methodology.
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-28 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'overview', label: 'Quick Guide' },
                            { id: 'types', label: 'All 12 Poll Types' },
                            { id: 'use-cases', label: 'Use Cases' }
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
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Decision Tree */}
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                                    Which Poll Type Should You Use?
                                </h2>
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                            <Target size={24} className="text-blue-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"Pick one thing"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Simple decision between clear options</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">Multiple Choice</span>
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">This or That</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                            <ListOrdered size={24} className="text-purple-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"Rank your preferences"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Order of preference matters</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">Ranked Choice</span>
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">Priority Matrix</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                                            <Calendar size={24} className="text-amber-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"When are you free?"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Scheduling and availability</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">Meeting Poll</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                            <Coins size={24} className="text-green-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"Prioritize with tradeoffs"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Limited resources, many wants</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Dot Voting</span>
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Buy a Feature</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                                            <SlidersHorizontal size={24} className="text-cyan-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"Rate everything"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Evaluate each option independently</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">Rating Scale</span>
                                            <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">Approval Voting</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                                            <Smile size={24} className="text-pink-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">"Quick pulse check"</h3>
                                        <p className="text-slate-500 text-sm mb-4">Fast feedback, low friction</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full">Sentiment Check</span>
                                            <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full">Quiz Poll</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <a
                                    href="/create.html"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                                >
                                    <Sparkles size={20} />
                                    Create Your First Poll
                                    <ArrowRight size={20} />
                                </a>
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
                                        Select a Poll Type
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
                                    {selectedPollData ? (
                                        <motion.div
                                            key={selectedPollData.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                                        >
                                            {/* Header */}
                                            <div className={`bg-gradient-to-r ${selectedPollData.gradient} p-6 text-white`}>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                                        <selectedPollData.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                                            {selectedPollData.name}
                                                            {selectedPollData.isPro && (
                                                                <span className="px-2 py-1 bg-white/20 text-sm font-bold rounded">PRO</span>
                                                            )}
                                                        </h2>
                                                        <p className="text-white/80">{selectedPollData.tagline}</p>
                                                    </div>
                                                </div>
                                                <p className="text-white/90">{selectedPollData.description}</p>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 space-y-6">
                                                {/* Live Preview */}
                                                <div className={`${selectedPollData.bgColor} rounded-xl p-5`}>
                                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                        <Eye size={18} />
                                                        Live Preview
                                                    </h3>
                                                    <PollTypePreview
                                                        pollTypeId={selectedPollData.id}
                                                        question={selectedPollData.exampleQuestion}
                                                        options={selectedPollData.exampleOptions}
                                                    />
                                                </div>

                                                {/* How It Works */}
                                                <div>
                                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                                        How It Works
                                                    </h3>
                                                    <p className="text-slate-600 text-sm pl-8">{selectedPollData.howItWorks}</p>
                                                </div>

                                                {/* Best For / Not For */}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-xl p-5 border border-slate-200">
                                                        <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                                            <Check size={18} className="text-green-500" />
                                                            Best For
                                                        </h3>
                                                        <ul className="space-y-1.5">
                                                            {selectedPollData.bestFor.map((item, i) => (
                                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                    <span className="text-green-500 mt-0.5">•</span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-white rounded-xl p-5 border border-slate-200">
                                                        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                                                            <AlertTriangle size={18} className="text-red-500" />
                                                            Not Ideal For
                                                        </h3>
                                                        <ul className="space-y-1.5">
                                                            {selectedPollData.notFor.map((item, i) => (
                                                                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                                    <span className="text-red-500 mt-0.5">•</span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Pro Tip */}
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                    <h3 className="font-bold text-amber-800 mb-1 flex items-center gap-2">
                                                        💡 Pro Tip
                                                    </h3>
                                                    <p className="text-amber-700 text-sm">{selectedPollData.proTip}</p>
                                                </div>

                                                {/* CTA */}
                                                <a
                                                    href="/create.html"
                                                    className={`block w-full py-3 bg-gradient-to-r ${selectedPollData.gradient} text-white font-bold text-center rounded-xl hover:shadow-lg transition-all`}
                                                >
                                                    Create a {selectedPollData.name} →
                                                </a>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="bg-slate-100 rounded-2xl p-12 text-center">
                                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ChevronRight size={32} className="text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-700 mb-2">Select a Poll Type</h3>
                                            <p className="text-slate-500">Click on any poll type to learn more about it</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Use Cases Tab */}
                    {activeTab === 'use-cases' && (
                        <motion.div
                            key="use-cases"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {useCases.map((useCase, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                            <useCase.icon size={24} className="text-indigo-600" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-2">{useCase.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4">{useCase.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {useCase.polls.map((poll, j) => (
                                                <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                                    {poll}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="text-center mt-12">
                                <a
                                    href="/create.html"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                                >
                                    <Sparkles size={20} />
                                    Create Your First Poll
                                    <ArrowRight size={20} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to try it yourself?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        No signup needed. Create a poll in 30 seconds.
                    </p>
                    <a
                        href="/create.html"
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
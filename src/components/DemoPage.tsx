import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, CircleDot,
    SlidersHorizontal, Coins, LayoutGrid, ThumbsUp, HelpCircle,
    Smile, Image, ChevronRight, Eye, Lightbulb, Target, AlertCircle,
    ArrowRight, Sparkles, Play, Building2, Heart, Users, Megaphone,
    GraduationCap, PartyPopper, Check, X, Star, Trophy, Clock,
    BarChart3, PieChart, TrendingUp, Zap
} from 'lucide-react';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import DemoPollInteractive from './components/DemoPollInteractive';

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
    isFree: boolean; // Simple: true = FREE, false = PAID
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
        notFor: ['Ranking preferences', 'Complex decisions with tradeoffs'],
        exampleQuestion: 'What should we order for the team lunch?',
        exampleOptions: ['🍕 Pizza', '🍜 Thai food', '🌮 Tacos', '🍣 Sushi'],
        proTip: 'Keep options to 5 or fewer for faster decisions.',
        isFree: true
    },
    {
        id: 'ranked-choice',
        name: 'Ranked Choice',
        icon: ListOrdered,
        gradient: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50',
        tagline: 'Drag to rank. Find true consensus.',
        description: 'Voters rank options from favorite to least favorite by dragging them into order.',
        howItWorks: 'Voters drag options to rank them 1st, 2nd, 3rd, etc. We use Instant Runoff Voting (IRV) to find the winner.',
        bestFor: ['Choosing between many options', 'Finding compromise', 'Elections', 'Team retreats'],
        notFor: ['Simple yes/no questions', 'Time-sensitive quick polls'],
        exampleQuestion: 'Where should we go for the company retreat?',
        exampleOptions: ['🏔️ Mountain cabin', '🏖️ Beach resort', '🏙️ City hotel', '🏕️ Camping'],
        proTip: 'This prevents the "spoiler effect" where similar options split votes.',
        isFree: true
    },
    {
        id: 'this-or-that',
        name: 'This or That',
        icon: ArrowLeftRight,
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        tagline: 'A vs B. Head-to-head battle.',
        description: 'Present exactly two options side by side. Voters pick one.',
        howItWorks: 'Show two options. Voters click their preference. Results show the split percentage.',
        bestFor: ['Design comparisons', 'A/B testing', 'Logo selection', 'Final decisions'],
        notFor: ['More than 2 options', 'Nuanced feedback'],
        exampleQuestion: 'Which logo should we use?',
        exampleOptions: ['Logo A (Blue)', 'Logo B (Green)'],
        proTip: 'Great for narrowing down. Run multiple rounds to find the best.',
        isFree: true
    },
    {
        id: 'meeting-poll',
        name: 'Meeting Poll',
        icon: Calendar,
        gradient: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        tagline: "Find when everyone's free.",
        description: 'Like Doodle, but simpler. Show a grid of dates/times and let people mark availability.',
        howItWorks: 'You add date/time options. Voters mark each as "Available," "Maybe," or "Unavailable."',
        bestFor: ['Scheduling meetings', 'Planning events', 'Coordinating across time zones'],
        notFor: ['Decisions unrelated to time'],
        exampleQuestion: 'When can everyone attend the project kickoff?',
        exampleOptions: ['Mon 10am', 'Mon 2pm', 'Tue 10am', 'Tue 2pm', 'Wed 10am'],
        proTip: 'Offer 4-6 time slots. Too many options makes it hard to find overlap.',
        isFree: false
    },
    {
        id: 'dot-voting',
        name: 'Dot Voting',
        icon: CircleDot,
        gradient: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        tagline: 'Distribute your votes. Show intensity.',
        description: 'Each voter gets a set number of "dots" to distribute however they want.',
        howItWorks: 'Voters get 5-10 dots to allocate. They can put multiple dots on one option or spread them.',
        bestFor: ['Prioritizing features', 'Brainstorming', 'Agile sprint planning'],
        notFor: ['Simple single-choice questions', 'Small option sets'],
        exampleQuestion: 'Which features should we build next? (You have 5 dots)',
        exampleOptions: ['Dark mode', 'Mobile app', 'API access', 'Integrations', 'Reports'],
        proTip: 'Give voters fewer dots than options to force prioritization.',
        isFree: false
    },
    {
        id: 'rating-scale',
        name: 'Rating Scale',
        icon: SlidersHorizontal,
        gradient: 'from-cyan-500 to-blue-600',
        bgColor: 'bg-cyan-50',
        tagline: 'Rate each option. See averages.',
        description: 'Voters rate each option on a scale (like 1-5 stars).',
        howItWorks: 'Each option gets a slider or star rating. Results show average scores.',
        bestFor: ['NPS-style feedback', 'Rating multiple ideas', 'Product feedback'],
        notFor: ['Choosing one winner', 'Binary decisions'],
        exampleQuestion: 'Rate each proposed tagline (1-5 stars):',
        exampleOptions: ['"Just vote."', '"Decisions, simplified."', '"Your voice, counted."'],
        proTip: 'Use 5-point scales. More granular scales are harder to be consistent.',
        isFree: false
    },
    {
        id: 'buy-a-feature',
        name: 'Buy a Feature',
        icon: Coins,
        gradient: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        tagline: 'Spend virtual money. See priorities.',
        description: 'Each voter gets a virtual budget to "spend" on options.',
        howItWorks: 'Assign costs to each option. Voters allocate their budget. Results show total "revenue."',
        bestFor: ['Product roadmap planning', 'Feature prioritization', 'Resource allocation'],
        notFor: ['Simple preference polls', 'Fun/casual polls'],
        exampleQuestion: 'You have $100 to spend. What should we build?',
        exampleOptions: ['Mobile app ($50)', 'Dark mode ($20)', 'API ($40)', 'Templates ($15)'],
        proTip: 'Price options based on actual effort/cost.',
        isFree: false
    },
    {
        id: 'approval-voting',
        name: 'Approval Voting',
        icon: ThumbsUp,
        gradient: 'from-violet-500 to-indigo-600',
        bgColor: 'bg-violet-50',
        tagline: 'Thumbs up or down. Each option.',
        description: 'For each option, voters simply say "Yes" or "No."',
        howItWorks: 'Voters mark each option as approved or not. The most approved option wins.',
        bestFor: ['Finding consensus', 'Committee decisions', 'Filtering many options'],
        notFor: ['Ranking preferences', 'When intensity matters'],
        exampleQuestion: 'Which dates work for you? (Select all that apply)',
        exampleOptions: ['December 15', 'December 16', 'December 17', 'December 18'],
        proTip: 'This finds the option most people can live with.',
        isFree: false
    },
    {
        id: 'quiz-poll',
        name: 'Quiz Poll',
        icon: HelpCircle,
        gradient: 'from-yellow-500 to-amber-600',
        bgColor: 'bg-yellow-50',
        tagline: 'Poll with a right answer.',
        description: 'Like multiple choice, but you set a "correct" answer.',
        howItWorks: 'Create a question with options. Mark one as correct. Voters see if they got it right.',
        bestFor: ['Trivia nights', 'Team building', 'Knowledge checks', 'Training'],
        notFor: ['Opinion-based questions', 'Serious surveys'],
        exampleQuestion: 'What year was the company founded?',
        exampleOptions: ['2019', '2020 ✓', '2021', '2022'],
        proTip: 'Add explanations to the correct answer to make it educational.',
        isFree: false
    },
    {
        id: 'sentiment-check',
        name: 'Sentiment Check',
        icon: Smile,
        gradient: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50',
        tagline: 'Quick pulse. Emoji reactions.',
        description: 'The fastest way to gauge how people feel. Voters pick an emoji reaction.',
        howItWorks: 'Ask a question. Voters tap an emoji. Results show sentiment distribution instantly.',
        bestFor: ['Meeting retrospectives', 'Mood checks', 'Quick feedback', 'Icebreakers'],
        notFor: ['Detailed feedback', 'Complex decisions'],
        exampleQuestion: 'How do you feel about the new office layout?',
        exampleOptions: ["😀 Love it", "😐 It's fine", "😞 Not great"],
        proTip: 'Use at the start of meetings to gauge energy.',
        isFree: false
    },
    {
        id: 'visual-poll',
        name: 'Visual Poll',
        icon: Image,
        gradient: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        tagline: 'Vote with images. See to decide.',
        description: 'Upload images as options. Voters click on the image they prefer.',
        howItWorks: 'Upload 2-8 images as options. Voters click their favorite. Results show votes per image.',
        bestFor: ['Design feedback', 'Logo selection', 'Photo contests', 'Product comparisons'],
        notFor: ["Text-based options", "Abstract concepts"],
        exampleQuestion: 'Which website design should we launch?',
        exampleOptions: ['[Design A]', '[Design B]', '[Design C]'],
        proTip: 'Keep images similar in size and style.',
        isFree: false
    }
];

const useCases = [
    {
        icon: Building2,
        title: 'Workplace & Teams',
        description: 'Team lunches, meeting times, project names, sprint planning',
        polls: ['Multiple Choice', 'Meeting Poll', 'Dot Voting']
    },
    {
        icon: Heart,
        title: 'Weddings & Events',
        description: 'Venue selection, menu choices, date picking, themes',
        polls: ['This or That', 'Ranked Choice', 'Visual Poll']
    },
    {
        icon: Users,
        title: 'Friend Groups',
        description: 'Movie nights, trip planning, restaurant picks, game choices',
        polls: ['Multiple Choice', 'Ranked Choice', 'Meeting Poll']
    },
    {
        icon: GraduationCap,
        title: 'Education',
        description: 'Class polls, quiz questions, topic voting, feedback',
        polls: ['Quiz Poll', 'Rating Scale', 'Sentiment Check']
    }
];

function DemoPage() {
    const [selectedPoll, setSelectedPoll] = useState('multiple-choice');
    const selectedPollData = pollTypes.find(p => p.id === selectedPoll);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />
            
            {/* Hero */}
            <section className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6"
                    >
                        <Play size={16} />
                        Interactive Demo
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
                    >
                        Explore All Poll Types
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        Try each poll type live. See how they work, when to use them, and create your own in seconds.
                    </motion.p>
                </div>
            </section>

            {/* Poll Type Explorer */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
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
                                            {/* Simple FREE vs PAID badge */}
                                            <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                                                selectedPoll === poll.id 
                                                    ? 'bg-white/20 text-white' 
                                                    : poll.isFree 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {poll.isFree ? 'FREE' : 'PAID'}
                                            </span>
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
                                                    <span className="px-2 py-1 bg-white/20 text-sm font-bold rounded">
                                                        {selectedPollData.isFree ? 'FREE' : 'PAID'}
                                                    </span>
                                                </h2>
                                                <p className="text-white/80">{selectedPollData.tagline}</p>
                                            </div>
                                        </div>
                                        <p className="text-white/90">{selectedPollData.description}</p>
                                        {!selectedPollData.isFree && (
                                            <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center gap-3">
                                                <Sparkles size={18} />
                                                <span className="text-sm">
                                                    This poll type requires a paid plan starting at $5. Try the demo below!
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Live Preview */}
                                        <div className={`${selectedPollData.bgColor} rounded-xl p-5`}>
                                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Eye size={18} />
                                                Live Preview
                                            </h3>
                                            <DemoPollInteractive
                                                pollTypeId={selectedPollData.id}
                                                question={selectedPollData.exampleQuestion}
                                                options={selectedPollData.exampleOptions}
                                                onCreateSimilar={() => window.location.href = '/create.html'}
                                            />
                                        </div>

                                        {/* How It Works */}
                                        <div>
                                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                <Zap size={18} className="text-amber-500" />
                                                How It Works
                                            </h3>
                                            <p className="text-slate-600">{selectedPollData.howItWorks}</p>
                                        </div>

                                        {/* Best For / Not For */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-emerald-50 rounded-xl p-4">
                                                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                                                    <Check size={16} />
                                                    Best For
                                                </h4>
                                                <ul className="space-y-1">
                                                    {selectedPollData.bestFor.map((item, i) => (
                                                        <li key={i} className="text-sm text-emerald-700 flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-red-50 rounded-xl p-4">
                                                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                                    <X size={16} />
                                                    Not Ideal For
                                                </h4>
                                                <ul className="space-y-1">
                                                    {selectedPollData.notFor.map((item, i) => (
                                                        <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Pro Tip */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                                                <Lightbulb size={16} />
                                                Pro Tip
                                            </h4>
                                            <p className="text-sm text-amber-700">{selectedPollData.proTip}</p>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <a
                                                href="/create.html"
                                                className={`flex-1 py-3 px-6 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${selectedPollData.gradient} text-white hover:shadow-lg`}
                                            >
                                                Create {selectedPollData.name}
                                                <ArrowRight size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 px-4 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">
                        Popular Use Cases
                    </h2>
                    <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                        See how different groups use VoteGenerator to make decisions
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={useCase.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <useCase.icon size={24} className="text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{useCase.title}</h3>
                                <p className="text-sm text-slate-600 mb-4">{useCase.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {useCase.polls.map(poll => (
                                        <span key={poll} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                            {poll}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Ready to create your poll?
                    </h2>
                    <p className="text-xl text-slate-600 mb-8">
                        Start with our free poll types. No signup required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/create.html"
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            Create Free Poll
                            <ArrowRight size={20} />
                        </a>
                        <a
                            href="/pricing.html"
                            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                        >
                            View Pricing
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default DemoPage;
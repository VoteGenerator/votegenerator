// ============================================================================
// What is a Straw Poll? - Educational + Tool Landing Page
// Target Keywords: strawpolls, straw poll, what is a straw poll
// Approach: Educational content explaining the concept + CTA to create one
// NO competitor mentions - focuses on the voting method itself
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Check, Users, BarChart3, Clock, Zap,
    CheckCircle, Vote, MessageSquare, Scale, ListOrdered,
    Sparkles, BookOpen, HelpCircle
} from 'lucide-react';

// ============================================================================
// QUICK POLL DEMO
// ============================================================================

const StrawPollDemo: React.FC = () => {
    const [voted, setVoted] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    
    const options = [
        { id: 'pizza', label: '🍕 Pizza', votes: 42 },
        { id: 'tacos', label: '🌮 Tacos', votes: 31 },
        { id: 'sushi', label: '🍣 Sushi', votes: 27 },
        { id: 'burgers', label: '🍔 Burgers', votes: 23 },
    ];
    
    const totalVotes = options.reduce((sum, o) => sum + o.votes, 0) + (voted ? 1 : 0);
    
    const handleVote = (id: string) => {
        setVoted(id);
        setTimeout(() => setShowResults(true), 500);
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                <div className="flex items-center gap-2 text-indigo-200 text-sm mb-2">
                    <Vote size={16} />
                    <span>Straw Poll Example</span>
                </div>
                <h3 className="text-xl font-bold">What should we have for the team lunch?</h3>
            </div>

            {/* Options */}
            <div className="p-6 space-y-3">
                {options.map((option) => {
                    const adjustedVotes = option.votes + (voted === option.id ? 1 : 0);
                    const percentage = Math.round((adjustedVotes / totalVotes) * 100);
                    
                    return (
                        <button
                            key={option.id}
                            onClick={() => !voted && handleVote(option.id)}
                            disabled={!!voted}
                            className={`w-full p-4 rounded-xl text-left transition-all relative overflow-hidden ${
                                voted === option.id
                                    ? 'bg-indigo-100 border-2 border-indigo-500'
                                    : voted
                                    ? 'bg-slate-50 border-2 border-transparent'
                                    : 'bg-slate-50 border-2 border-transparent hover:border-indigo-300 hover:bg-indigo-50'
                            }`}
                        >
                            {/* Progress bar background */}
                            {showResults && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-y-0 left-0 bg-indigo-100 rounded-xl"
                                />
                            )}
                            
                            <div className="relative flex items-center justify-between">
                                <span className="font-medium text-slate-800">{option.label}</span>
                                {showResults && (
                                    <span className="text-sm font-bold text-indigo-600">
                                        {percentage}%
                                    </span>
                                )}
                                {voted === option.id && (
                                    <Check size={18} className="text-indigo-600" />
                                )}
                            </div>
                        </button>
                    );
                })}
                
                {showResults && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm text-slate-500 mt-4"
                    >
                        {totalVotes} votes • Results update live
                    </motion.p>
                )}
                
                {!voted && (
                    <p className="text-center text-sm text-slate-400 mt-4">
                        Click an option to vote
                    </p>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const StrawPollPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 py-24">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
                                <BookOpen size={16} />
                                Quick Guide
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                What is a
                                <br />
                                <span className="text-indigo-300">Straw Poll?</span>
                            </h1>
                            
                            <p className="text-xl text-indigo-100/80 mb-10 leading-relaxed max-w-lg">
                                A quick, informal vote to gauge group opinion. Perfect for teams, friends, or any group that needs to make a decision together.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/create"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                                >
                                    Create a straw poll
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <StrawPollDemo />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Definition Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-lg max-w-none"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Straw Poll Definition
                        </h2>
                        
                        <p className="text-xl text-slate-600 leading-relaxed mb-6">
                            A <strong>straw poll</strong> (also called a straw vote) is an informal, 
                            non-binding vote used to quickly gauge the opinion of a group. Unlike 
                            formal elections, straw polls are meant to be fast and easy—they show 
                            you which way the group is leaning without requiring official procedures.
                        </p>
                        
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl my-8">
                            <p className="text-indigo-900 font-medium mb-0">
                                <strong>Origin:</strong> The term comes from the practice of throwing 
                                a piece of straw into the air to see which way the wind is blowing—a 
                                quick test of conditions before making a bigger decision.
                            </p>
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed">
                            Today, straw polls are used everywhere: teams deciding where to eat, 
                            groups choosing meeting times, friends picking movies, or organizations 
                            getting a sense of member preferences before formal votes.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* When to Use */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">When to use a straw poll</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Straw polls work best when you need a quick temperature check, not a formal decision.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Team decisions',
                                description: 'Where to go for lunch, what to name the project, which day works for the meeting.',
                                examples: ['Team lunch vote', 'Project name', 'Meeting time']
                            },
                            {
                                icon: MessageSquare,
                                title: 'Group opinions',
                                description: 'Get a quick sense of what your group thinks before diving into discussion.',
                                examples: ['Feature priorities', 'Event preferences', 'Topic interest']
                            },
                            {
                                icon: BarChart3,
                                title: 'Icebreakers',
                                description: 'Fun polls to kick off meetings, classes, or events and get people engaged.',
                                examples: ['This or that', 'Would you rather', 'Favorite movies']
                            },
                            {
                                icon: Clock,
                                title: 'Quick feedback',
                                description: 'Was the meeting useful? How was the workshop? Get instant feedback.',
                                examples: ['Meeting pulse check', 'Event rating', 'Presentation feedback']
                            },
                            {
                                icon: ListOrdered,
                                title: 'Ranking preferences',
                                description: 'Let people rank options to find the group's priorities.',
                                examples: ['Feature ranking', 'Budget priorities', 'Activity preferences']
                            },
                            {
                                icon: CheckCircle,
                                title: 'Go/no-go checks',
                                description: 'Quick yes/no/maybe votes to see if there's consensus.',
                                examples: ['Should we proceed?', 'Ready to ship?', 'Move to next topic?']
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon size={24} className="text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600 mb-4">{item.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {item.examples.map((ex, j) => (
                                        <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Types of Straw Polls */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Types of straw polls</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Different situations call for different poll types. Here are the most common.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Multiple Choice',
                                description: 'Voters pick one option from a list. The classic straw poll format.',
                                example: 'Where should we have the team offsite?',
                                options: ['Beach resort', 'Mountain cabin', 'City hotel', 'Stay local'],
                                icon: CheckCircle
                            },
                            {
                                title: 'Ranked Choice',
                                description: 'Voters rank options by preference. Better for finding consensus.',
                                example: 'Rank these features by priority:',
                                options: ['1. Dark mode', '2. Export feature', '3. Mobile app', '4. API access'],
                                icon: ListOrdered
                            },
                            {
                                title: 'Yes / No / Maybe',
                                description: 'Simple three-way vote for quick temperature checks.',
                                example: 'Should we move forward with this proposal?',
                                options: ['Yes', 'No', 'Need more info'],
                                icon: Vote
                            },
                            {
                                title: 'Rating Scale',
                                description: 'Collect satisfaction scores or likelihood ratings.',
                                example: 'How useful was this meeting? (1-5)',
                                options: ['⭐⭐⭐⭐⭐'],
                                icon: Scale
                            },
                        ].map((type, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-50 p-8 rounded-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <type.icon size={20} className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{type.title}</h3>
                                </div>
                                <p className="text-slate-600 mb-4">{type.description}</p>
                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                    <p className="text-sm font-medium text-slate-700 mb-2">{type.example}</p>
                                    <div className="space-y-1">
                                        {type.options.map((opt, j) => (
                                            <p key={j} className="text-sm text-slate-500">• {opt}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Create */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How to create a straw poll</h2>
                        <p className="text-lg text-slate-600">Three steps, under a minute.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Write your question',
                                description: 'What do you want to know? Keep it clear and simple.',
                            },
                            {
                                step: '2',
                                title: 'Add options',
                                description: 'List the choices people can vote for. 3-6 options usually works best.',
                            },
                            {
                                step: '3',
                                title: 'Share the link',
                                description: 'Send the poll link to your group. They click, vote, and see results.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a 
                            href="/create"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-2xl hover:bg-indigo-700 transition-all"
                        >
                            Create your straw poll
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    
                    <div className="space-y-8">
                        {[
                            {
                                q: 'What\'s the difference between a straw poll and a regular poll?',
                                a: 'A straw poll is informal and non-binding—it\'s meant to quickly gauge opinion, not make final decisions. Regular polls or elections often have formal procedures, verification, and binding results. Straw polls prioritize speed and simplicity.'
                            },
                            {
                                q: 'Are straw poll results accurate?',
                                a: 'Straw polls show you the general direction of opinion, but they\'re not scientifically rigorous. They\'re best for getting a quick sense of group preferences, not for making high-stakes decisions that need precise data.'
                            },
                            {
                                q: 'Do people need to create an account to vote?',
                                a: 'No. With VoteGenerator, voters just click the link and vote—no signup required. This makes it easy to get quick responses from anyone.'
                            },
                            {
                                q: 'Can I see who voted for what?',
                                a: 'That depends on your settings. You can create polls where you see individual votes or polls that only show aggregated results. For sensitive topics, aggregated results help people vote honestly.'
                            },
                            {
                                q: 'How many options can I include?',
                                a: 'As many as you need, but 3-6 options usually works best. Too many options can make it harder for voters to decide and dilute the results.'
                            },
                            {
                                q: 'Can I use ranked choice voting?',
                                a: 'Yes. Ranked choice lets voters order options by preference. This is great when you want to find the option with the broadest support, not just the plurality winner.'
                            },
                        ].map((faq, i) => (
                            <div key={i}>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-start gap-2">
                                    <HelpCircle size={20} className="text-indigo-500 flex-shrink-0 mt-1" />
                                    {faq.q}
                                </h3>
                                <p className="text-slate-600 ml-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to create your straw poll?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Takes about 30 seconds. Free to use.
                    </p>
                    <a 
                        href="/create"
                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-indigo-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                    >
                        Create a straw poll
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-indigo-200 text-sm mt-6">
                        No account required • Free forever for basic polls
                    </p>
                </div>
            </section>
        </div>
    );
};

export default StrawPollPage;
// ============================================================================
// StrawPoll Alternative / Comparison Page
// Target Keywords: strawpolls, strawpoll alternative, straw poll free
// NOTE: This is an honest comparison - we highlight both our strengths AND
// when StrawPoll might be the better choice. Builds trust with users.
// FIXED: Replaced emojis with Lucide icons to avoid encoding issues
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, X, ArrowRight, Zap, Star, Users, BarChart3,
    ListOrdered, Image, Calendar, Scale, MessageSquare, Award,
    FileText, Download, Clock, Smartphone, ExternalLink, Target
} from 'lucide-react';

// ============================================================================
// Comparison Table Component
// ============================================================================

interface ComparisonRow {
    feature: string;
    us: boolean | string;
    them: boolean | string;
    note?: string;
}

const ComparisonTable: React.FC = () => {
    const rows: ComparisonRow[] = [
        { feature: 'Simple multiple choice polls', us: true, them: true },
        { feature: 'No signup to vote', us: true, them: true },
        { feature: 'Free tier available', us: true, them: true },
        { feature: 'Ranked choice voting', us: true, them: true },
        { feature: 'Image polls', us: true, them: true },
        { feature: 'Real-time results', us: true, them: true },
        { feature: 'Star ratings (1-5)', us: true, them: false },
        { feature: 'Scale questions (1-10)', us: true, them: false },
        { feature: 'Multi-section surveys', us: true, them: false },
        { feature: 'Meeting scheduler poll', us: true, them: false },
        { feature: 'RSVP collection', us: true, them: false },
        { feature: 'Open text questions', us: true, them: false },
        { feature: 'Export to CSV', us: true, them: 'Paid only' },
        { feature: '42+ templates', us: true, them: false },
        { feature: 'Response analytics', us: 'Paid plans', them: 'Paid only' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                <div className="p-4 font-semibold text-slate-700">Feature</div>
                <div className="p-4 font-semibold text-indigo-600 text-center border-l border-slate-200 bg-indigo-50">
                    VoteGenerator
                </div>
                <div className="p-4 font-semibold text-slate-600 text-center border-l border-slate-200">
                    StrawPoll
                </div>
            </div>
            
            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                    <div key={i} className="grid grid-cols-3">
                        <div className="p-4 text-sm text-slate-700">{row.feature}</div>
                        <div className="p-4 text-center border-l border-slate-100 bg-indigo-50/30">
                            {row.us === true ? (
                                <CheckCircle size={20} className="text-green-500 mx-auto" />
                            ) : row.us === false ? (
                                <X size={20} className="text-slate-300 mx-auto" />
                            ) : (
                                <span className="text-xs text-slate-500">{row.us}</span>
                            )}
                        </div>
                        <div className="p-4 text-center border-l border-slate-100">
                            {row.them === true ? (
                                <CheckCircle size={20} className="text-green-500 mx-auto" />
                            ) : row.them === false ? (
                                <X size={20} className="text-slate-300 mx-auto" />
                            ) : (
                                <span className="text-xs text-slate-500">{row.them}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// Poll Type Cards
// ============================================================================

const PollTypeShowcase: React.FC = () => {
    const types = [
        { 
            icon: CheckCircle, 
            name: 'Multiple Choice', 
            description: 'Pick one or multiple options',
            bothHave: true 
        },
        { 
            icon: ListOrdered, 
            name: 'Ranked Choice', 
            description: 'Drag to rank options by preference',
            bothHave: true 
        },
        { 
            icon: Image, 
            name: 'Image Poll', 
            description: 'Vote on photos or designs',
            bothHave: true 
        },
        { 
            icon: Star, 
            name: 'Star Rating', 
            description: '1-5 star satisfaction ratings',
            bothHave: false 
        },
        { 
            icon: Scale, 
            name: 'Scale (1-10)', 
            description: 'NPS and detailed numeric scales',
            bothHave: false 
        },
        { 
            icon: Calendar, 
            name: 'Meeting Scheduler', 
            description: 'Find times that work for everyone',
            bothHave: false 
        },
        { 
            icon: Users, 
            name: 'RSVP', 
            description: 'Collect event attendance and details',
            bothHave: false 
        },
        { 
            icon: MessageSquare, 
            name: 'Open Text', 
            description: 'Collect written feedback',
            bothHave: false 
        },
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {types.map((type, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl border ${
                        type.bothHave 
                            ? 'bg-slate-50 border-slate-200' 
                            : 'bg-indigo-50 border-indigo-200'
                    }`}
                >
                    <type.icon size={24} className={type.bothHave ? 'text-slate-500 mb-2' : 'text-indigo-600 mb-2'} />
                    <h3 className="font-semibold text-slate-800 mb-1">{type.name}</h3>
                    <p className="text-xs text-slate-600 mb-2">{type.description}</p>
                    {!type.bothHave && (
                        <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            VoteGenerator only
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

// ============================================================================
// Main Page Component
// ============================================================================

const StrawPollComparisonPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium mb-6">
                            <Zap size={16} />
                            Honest Comparison
                        </span>
                        
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                            VoteGenerator vs StrawPoll
                        </h1>
                        
                        <p className="text-xl text-indigo-100 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Both are great poll tools. Here is an honest look at what each does best so you can pick the right one for your needs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-xl"
                            >
                                Try VoteGenerator Free
                                <ArrowRight size={20} />
                            </a>
                            <a 
                                href="#comparison"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                            >
                                See Full Comparison
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Summary */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* When to use StrawPoll */}
                        <div className="p-6 bg-slate-50 rounded-2xl">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Target size={20} className="text-slate-500" />
                                StrawPoll might be better if...
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'You need a quick, simple multiple choice poll',
                                    'You want the most minimal interface possible',
                                    'You already have a StrawPoll account and workflow',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                        <CheckCircle size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* When to use VoteGenerator */}
                        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-indigo-600" />
                                VoteGenerator is better if...
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    'You need ratings, scales, or open-ended questions',
                                    'You want multi-section surveys with different question types',
                                    'You need meeting scheduling or RSVP collection',
                                    'You want ready-to-use templates for common scenarios',
                                    'You need to export results to CSV on free plan',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700">
                                        <CheckCircle size={16} className="text-indigo-500 mt-1 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Comparison Table */}
            <section id="comparison" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Feature-by-Feature Comparison
                        </h2>
                        <p className="text-lg text-slate-600">
                            A straightforward look at what each tool offers.
                        </p>
                    </div>

                    <ComparisonTable />

                    <p className="text-sm text-slate-500 text-center mt-4">
                        Comparison based on publicly available information. Features may change.
                    </p>
                </div>
            </section>

            {/* Poll Types */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Poll Types Available
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Both tools handle basic polls. VoteGenerator adds ratings, surveys, and scheduling.
                        </p>
                    </div>

                    <PollTypeShowcase />
                </div>
            </section>

            {/* Key Differences */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Key Differences
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Question Types',
                                icon: FileText,
                                description: 'StrawPoll focuses on polls (multiple choice, ranked). VoteGenerator adds ratings, scales, open text, and multi-section surveys.',
                            },
                            {
                                title: 'Templates',
                                icon: Award,
                                description: 'VoteGenerator includes 42+ ready-to-use templates for team decisions, events, feedback, HR, education, and fun polls.',
                            },
                            {
                                title: 'Use Cases',
                                icon: Users,
                                description: 'StrawPoll is great for quick votes. VoteGenerator handles those plus RSVPs, meeting scheduling, and detailed surveys.',
                            },
                        ].map((diff, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-slate-50 rounded-2xl"
                            >
                                <diff.icon size={28} className="text-indigo-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{diff.title}</h3>
                                <p className="text-slate-600">{diff.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Both Have */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            What Both Tools Do Well
                        </h2>
                        <p className="text-lg text-slate-600">
                            You cannot go wrong with either for basic polling.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Simple multiple choice polls',
                            'Ranked choice voting',
                            'Image-based polls',
                            'No signup required to vote',
                            'Real-time results',
                            'Free tier available',
                            'Works on any device',
                            'Shareable link',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Ready to try VoteGenerator?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Create your first poll in under a minute. Free to start, no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/create"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-xl"
                        >
                            Create Free Poll
                            <ArrowRight size={20} />
                        </a>
                        <a 
                            href="/templates"
                            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                        >
                            Browse 42+ Templates
                        </a>
                    </div>
                    
                    <p className="text-indigo-200 text-sm mt-6">
                        Free to create - No signup for voters - Export to CSV
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Common Questions
                    </h2>
                    
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Can I migrate my StrawPoll polls to VoteGenerator?',
                                a: 'There is no automatic import, but you can recreate polls quickly using our templates or poll builder. It takes about a minute per poll.'
                            },
                            {
                                q: 'Is VoteGenerator free like StrawPoll?',
                                a: 'Yes. Both have free tiers. VoteGenerator free plan includes all poll types, templates, and CSV export. Response limits apply on free. Paid plans offer more.'
                            },
                            {
                                q: 'Do voters need to create an account?',
                                a: 'No, same as StrawPoll. Voters just click and vote. No signup, no app download required.'
                            },
                            {
                                q: 'What if I just need a simple poll?',
                                a: 'VoteGenerator works great for simple polls too. Create a multiple choice poll in 30 seconds. The extra features are there if you need them.'
                            },
                            {
                                q: 'Which should I choose?',
                                a: 'If you need ratings, surveys, meeting scheduling, or RSVPs, choose VoteGenerator. If you only need basic multiple choice polls and prefer maximum simplicity, both work well.'
                            },
                        ].map((faq, i) => (
                            <div key={i} className="border-b border-slate-200 pb-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.q}</h3>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StrawPollComparisonPage;
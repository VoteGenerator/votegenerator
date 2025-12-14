import React from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    X, 
    Zap, 
    Sparkles,
    ArrowRight,
    Shield,
    Users,
    Clock,
    Mail,
    CreditCard,
    Palette,
    BarChart3,
    Code
} from 'lucide-react';

interface ComparisonRow {
    feature: string;
    voteGenerator: string | boolean;
    strawPoll: string | boolean;
    doodle: string | boolean;
    googleForms: string | boolean;
    tooltip?: string;
    highlight?: boolean;
}

const ComparePage: React.FC = () => {
    const comparisons: ComparisonRow[] = [
        // Getting Started
        { feature: 'No signup required', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false, highlight: true },
        { feature: 'No email required', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false, highlight: true },
        { feature: 'Create poll in under 1 minute', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false },
        { feature: 'Free tier available', voteGenerator: true, strawPoll: true, doodle: true, googleForms: true },
        
        // Poll Types
        { feature: 'Multiple choice polls', voteGenerator: true, strawPoll: true, doodle: true, googleForms: true },
        { feature: 'Ranked choice voting', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false },
        { feature: 'Meeting scheduler', voteGenerator: true, strawPoll: true, doodle: true, googleForms: false },
        { feature: 'Dot voting', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Buy a feature (budget allocation)', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Priority matrix (2x2 grid)', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'This or That (A/B comparison)', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Sentiment check (emoji reactions)', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Quiz with correct answers', voteGenerator: true, strawPoll: true, doodle: false, googleForms: true },
        { feature: 'Rating scale polls', voteGenerator: true, strawPoll: true, doodle: false, googleForms: true },
        { feature: 'Approval voting', voteGenerator: true, strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Visual poll (image voting)', voteGenerator: 'Pro', strawPoll: true, doodle: false, googleForms: true },
        { feature: 'Total poll types', voteGenerator: '12 types', strawPoll: '5 types', doodle: '2 types', googleForms: '4 types', highlight: true },
        
        // Security
        { feature: 'Cookie-based duplicate detection', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false },
        { feature: 'Unique voting codes', voteGenerator: 'Pro', strawPoll: 'Paid', doodle: false, googleForms: false },
        { feature: 'CAPTCHA protection', voteGenerator: false, strawPoll: 'Paid', doodle: false, googleForms: true },
        { feature: 'IP-based limiting', voteGenerator: false, strawPoll: 'Paid', doodle: false, googleForms: false },
        
        // Customization
        { feature: 'Remove platform branding', voteGenerator: 'Paid', strawPoll: 'Paid', doodle: 'Paid', googleForms: false },
        { feature: 'Upload your logo', voteGenerator: 'Paid', strawPoll: 'Paid', doodle: 'Paid', googleForms: false },
        { feature: 'Custom thank-you page', voteGenerator: 'Paid', strawPoll: false, doodle: false, googleForms: true },
        { feature: 'Custom short links', voteGenerator: 'Paid', strawPoll: 'Paid', doodle: false, googleForms: false },
        { feature: 'Embeddable on websites', voteGenerator: 'Pro', strawPoll: true, doodle: true, googleForms: true },
        { feature: 'White-label embeds', voteGenerator: 'Pro+', strawPoll: 'Business', doodle: false, googleForms: false },
        
        // Export & Analytics
        { feature: 'Real-time results', voteGenerator: true, strawPoll: true, doodle: true, googleForms: true },
        { feature: 'Basic analytics', voteGenerator: true, strawPoll: true, doodle: true, googleForms: true },
        { feature: 'Export to CSV', voteGenerator: 'Paid', strawPoll: 'Paid', doodle: 'Paid', googleForms: true },
        { feature: 'Export to PDF', voteGenerator: 'Paid', strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Export to Google Sheets', voteGenerator: 'Paid', strawPoll: false, doodle: false, googleForms: true },
        
        // Collaboration
        { feature: 'Share admin link', voteGenerator: true, strawPoll: false, doodle: 'Paid', googleForms: true, highlight: true },
        { feature: 'Voter comments', voteGenerator: 'Paid', strawPoll: false, doodle: false, googleForms: false },
        { feature: 'Scheduled poll closing', voteGenerator: true, strawPoll: true, doodle: true, googleForms: false },
        
        // Pricing
        { feature: 'Free polls', voteGenerator: 'Unlimited', strawPoll: 'Unlimited', doodle: 'Limited', googleForms: 'Unlimited' },
        { feature: 'Free responses/poll', voteGenerator: '100', strawPoll: 'Unlimited', doodle: 'Limited', googleForms: 'Unlimited' },
        { feature: 'One-time purchase option', voteGenerator: true, strawPoll: true, doodle: false, googleForms: false, highlight: true },
        { feature: 'Paid plan starting price', voteGenerator: '$6.58/mo', strawPoll: '$4/mo', doodle: '$6.95/mo', googleForms: 'Free', tooltip: 'Billed annually' },
    ];

    const renderValue = (value: string | boolean) => {
        if (value === true) {
            return <Check size={18} className="text-green-500 mx-auto" />;
        }
        if (value === false) {
            return <X size={18} className="text-slate-300 mx-auto" />;
        }
        // String value
        const isProFeature = value === 'Pro' || value === 'Pro+' || value === 'Paid' || value === 'Business';
        return (
            <span className={`text-xs font-medium ${isProFeature ? 'text-indigo-600' : 'text-slate-700'}`}>
                {value}
            </span>
        );
    };

    const whyChooseUs = [
        {
            icon: Zap,
            title: 'Instant Start',
            description: 'No signup, no email verification, no account setup. Create your first poll in 30 seconds.'
        },
        {
            icon: Palette,
            title: '12 Poll Types',
            description: 'From simple multiple choice to advanced ranked voting, dot voting, and priority matrices.'
        },
        {
            icon: Shield,
            title: 'Privacy-First',
            description: 'We don\'t collect emails to spam you. Vote protection without invasive tracking.'
        },
        {
            icon: Users,
            title: 'Share Admin Access',
            description: 'Anyone with the admin link can manage the poll. No team seats or permissions to configure.'
        },
        {
            icon: CreditCard,
            title: 'Flexible Pricing',
            description: 'Free forever tier, one-time purchase for events, or monthly subscription. Your choice.'
        },
        {
            icon: Code,
            title: 'Developer Friendly',
            description: 'Embed polls anywhere. White-label options for agencies and businesses.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <div className="pt-16 pb-12 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        How VoteGenerator Compares
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">
                        See how we stack up against other polling tools. 
                        We focus on what matters: simplicity, variety, and flexibility.
                    </p>
                </motion.div>
            </div>

            {/* Why Choose Us */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whyChooseUs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <item.icon size={24} className="text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                    Feature Comparison
                </h2>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="text-left p-4 font-semibold text-slate-600 w-[35%]">Feature</th>
                                    <th className="text-center p-4 w-[16%]">
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-indigo-600">VoteGenerator</span>
                                            <span className="text-xs text-slate-400">That's us!</span>
                                        </div>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-[16%]">StrawPoll</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-[16%]">Doodle</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-[16%]">Google Forms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisons.map((row, i) => (
                                    <tr 
                                        key={i} 
                                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${row.highlight ? 'bg-indigo-50/50' : ''}`}
                                    >
                                        <td className="p-4 text-slate-700 text-sm font-medium">
                                            {row.feature}
                                            {row.highlight && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                                                    KEY
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center bg-indigo-50/30">
                                            {renderValue(row.voteGenerator)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {renderValue(row.strawPoll)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {renderValue(row.doodle)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {renderValue(row.googleForms)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <p className="text-center text-sm text-slate-500 mt-4">
                    * Comparison based on publicly available information as of December 2025. Features and pricing may change.
                </p>
            </div>

            {/* Our Unique Advantages */}
            <div className="bg-gradient-to-b from-slate-50 to-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                        What Makes Us Different
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Clock size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">Start in Seconds, Not Minutes</h3>
                                    <p className="text-slate-600">
                                        Other tools require account creation, email verification, and profile setup. 
                                        With VoteGenerator, you go from idea to shareable poll in under 30 seconds. 
                                        No barriers, no friction.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                    <BarChart3 size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">12 Poll Types for Every Decision</h3>
                                    <p className="text-slate-600">
                                        Most tools offer 2-5 poll types. We offer 12 — including specialized formats like 
                                        Dot Voting for prioritization, Buy a Feature for product roadmaps, and Priority Matrix 
                                        for strategic planning. The right tool for the right decision.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Users size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">Share Admin Access Freely</h3>
                                    <p className="text-slate-600">
                                        Need multiple people to manage a poll? Just share the admin link. 
                                        No team seats to purchase, no permissions to configure, no user management headaches. 
                                        Simple collaboration for everyone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Mail size={20} className="text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">Your Inbox Stays Clean</h3>
                                    <p className="text-slate-600">
                                        We don't collect your email to create a poll. We don't spam you with marketing. 
                                        We don't sell your data. Your poll, your business. That's it.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                                    <CreditCard size={20} className="text-rose-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-2">Pay Your Way</h3>
                                    <p className="text-slate-600">
                                        Free forever for basic use. One-time purchase for a single event (no subscription required). 
                                        Or monthly/yearly subscription for power users. We don't lock you into payment models 
                                        that don't fit your needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to try VoteGenerator?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        No signup. No credit card. Just create and share.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                        >
                            <Sparkles size={20} />
                            Create Free Poll
                            <ArrowRight size={20} />
                        </a>
                        <a
                            href="#pricing"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-all"
                        >
                            View Pricing
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparePage;
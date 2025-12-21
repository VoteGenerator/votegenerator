// ============================================================================
// LandingPage - VoteGenerator Home Page
// UPDATED: 7 poll types, correct pricing, fixed comparison table
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Mail, Lock, Eye, CheckCircle2, ArrowRight, Sparkles, Star,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Zap, Crown, Globe, QrCode, BarChart3, Code, Clock, Check, X
} from 'lucide-react';
import PromoBanner from './PromoBanner';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// Hero Section with Live Demo
// ============================================================================

const HeroSection: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const phrases = ['team decisions', 'event planning', 'group feedback', 'quick polls', 'anonymous voting'];

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (typedText.length < currentPhrase.length) {
                    setTypedText(currentPhrase.slice(0, typedText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (typedText.length > 0) {
                    setTypedText(currentPhrase.slice(0, typedText.length - 1));
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [typedText, isDeleting, phraseIndex]);

    const demoOptions = [
        { text: 'Hawaiian Paradise', votes: 42, selected: false },
        { text: 'Mountain Lodge', votes: 38, selected: true },
        { text: 'Beach Resort', votes: 28, selected: false },
        { text: 'City Adventure', votes: 15, selected: false },
    ];
    const totalVotes = demoOptions.reduce((sum, o) => sum + o.votes, 0);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Copy */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm mb-6">
                            <Sparkles size={14} />
                            FREE ONLINE VOTING TOOL
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            The privacy-first platform for{' '}
                            <span className="relative">
                                <span className="text-amber-300">{typedText}</span>
                                <span className="absolute -right-1 top-0 h-full w-0.5 bg-amber-300 animate-pulse" />
                            </span>
                        </h1>

                        <p className="text-lg text-indigo-100 mb-8 max-w-lg">
                            Create beautiful polls in seconds. No signup required. Share a link and watch votes come in real-time.
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: Mail, text: 'No email required' },
                                { icon: Lock, text: 'No signup needed' },
                                { icon: Eye, text: 'No tracking' },
                                { icon: ShieldCheck, text: 'Privacy-first' },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm">
                                    <f.icon size={16} /><span>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                Create Free Poll <ArrowRight size={18} />
                            </a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition">
                                See Examples
                            </a>
                        </div>
                    </motion.div>

                    {/* Right - Live Demo */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
                        {/* "Try it live" label */}
                        <div className="absolute -top-3 left-4 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Try it live!
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-2xl p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">🏝️ Where should we go for the team trip?</h3>
                                <p className="text-sm text-slate-500">{totalVotes} votes · Multiple Choice Poll</p>
                            </div>

                            <div className="space-y-3">
                                {demoOptions.map((option, i) => {
                                    const percentage = Math.round((option.votes / totalVotes) * 100);
                                    return (
                                        <div key={i} className={`relative p-3 rounded-xl border-2 cursor-pointer transition overflow-hidden ${option.selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
                                            <div className={`absolute inset-0 ${option.selected ? 'bg-indigo-100' : 'bg-slate-50'}`} style={{ width: `${percentage}%` }} />
                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${option.selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                                        {option.selected && <CheckCircle2 size={14} className="text-white" />}
                                                    </div>
                                                    <span className={`font-medium ${option.selected ? 'text-indigo-700' : 'text-slate-700'}`}>{option.text}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{percentage}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                                Submit Vote
                            </button>
                            
                            <p className="text-center text-xs text-slate-500 mt-3">
                                This is 1 of <strong>7 poll types</strong> · <a href="/demo" className="text-indigo-600 hover:underline">Explore all 7 →</a>
                            </p>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✓ No signup
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Stats bar - 7 poll types */}
            <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div><div className="text-3xl font-black text-white">7</div><div className="text-indigo-200 text-sm">Poll Types</div></div>
                        <div><div className="text-3xl font-black text-white">0</div><div className="text-indigo-200 text-sm">Emails Required</div></div>
                        <div><div className="text-3xl font-black text-white">30s</div><div className="text-indigo-200 text-sm">To Create</div></div>
                        <div><div className="text-3xl font-black text-white">∞</div><div className="text-indigo-200 text-sm">Free Polls</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Poll Types Section - 7 types
// ============================================================================

const PollTypesSection: React.FC = () => {
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, desc: 'Classic pick one or more', color: 'blue' },
        { name: 'Ranked Choice', icon: ListOrdered, desc: 'Drag to rank in order', color: 'indigo' },
        { name: 'This or That', icon: ArrowLeftRight, desc: 'Quick A vs B comparisons', color: 'orange' },
        { name: 'Meeting Poll', icon: Calendar, desc: 'Find the best time', color: 'amber' },
        { name: 'Rating Scale', icon: SlidersHorizontal, desc: 'Rate options 1-5 stars', color: 'cyan' },
        { name: 'RSVP', icon: Users, desc: 'Event attendance tracking', color: 'sky' },
        { name: 'Visual Poll', icon: Image, desc: 'Vote on images (Pro)', color: 'pink' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">7 Poll Types for Every Decision</h2>
                    <p className="text-lg text-slate-600">From quick votes to complex ranked choices</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {pollTypes.map((type, i) => (
                        <motion.div key={type.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="bg-slate-50 rounded-xl p-4 text-center hover:shadow-md transition group">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${type.color}-100 flex items-center justify-center group-hover:scale-110 transition`}>
                                <type.icon className={`text-${type.color}-600`} size={24} />
                            </div>
                            <h3 className="font-semibold text-slate-900 text-sm">{type.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a href="/demo" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                        See all 7 poll types in action <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Why Choose Us Section - CORRECTED claims
// ============================================================================

const WhyChooseUsSection: React.FC = () => {
    const features = [
        {
            icon: Zap,
            title: 'Create in 30 Seconds',
            description: 'No account needed. Type your question, add options, share the link. It\'s that simple.',
        },
        {
            icon: ShieldCheck,
            title: 'Privacy First',
            description: 'No email required to vote. No tracking cookies. No data selling. Your polls stay private.',
        },
        {
            icon: Globe,
            title: 'Share Anywhere',
            description: 'Get a shareable link, QR code, or embed code. Works on any device, any browser.',
        },
        {
            icon: BarChart3,
            title: 'Real-Time Results',
            description: 'Watch votes come in live. Beautiful charts update instantly as people vote.',
        },
        {
            icon: QrCode,
            title: 'QR Code Included',
            description: 'Every poll gets a free QR code. Perfect for events, presentations, and printed materials.',
        },
        {
            icon: Code,
            title: 'Embed Anywhere',
            description: 'Add polls to your website with copy-paste embed code. Fully responsive design.',
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose VoteGenerator?</h2>
                    <p className="text-lg text-slate-600">The simplest way to make group decisions</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-slate-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Pricing Section - CORRECTED: 50 responses free, 4 tiers
// ============================================================================

const PricingSection: React.FC = () => {
    const tiers = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'No credit card required',
            color: 'slate',
            icon: Users,
            features: ['6 free poll types', '50 responses per poll', '7 days active', 'Unlimited polls', 'QR code sharing', 'Real-time results'],
            cta: 'Create Free Poll',
            ctaLink: '/create',
        },
        {
            name: 'Starter',
            price: '$9.99',
            period: 'one-time',
            description: 'For your next event',
            color: 'blue',
            icon: Zap,
            features: ['Everything in Free', '500 responses', '30 days active', 'CSV export', 'Device & geo stats', '90-day data retention'],
            cta: 'Get Starter',
            ctaLink: '/pricing',
        },
        {
            name: 'Pro Event',
            price: '$19.99',
            period: 'one-time',
            description: 'For important events',
            color: 'purple',
            icon: Crown,
            popular: true,
            features: ['Everything in Starter', '2,000 responses', '60 days active', 'Visual Poll (images)', 'PDF & PNG export', 'Remove branding'],
            cta: 'Get Pro Event',
            ctaLink: '/pricing',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600">Start free. Upgrade only when you need more.</p>
                    <p className="text-indigo-600 font-medium mt-2">One-time payments. Not subscriptions.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {tiers.map((tier, i) => (
                        <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'} bg-white overflow-hidden`}>
                            {tier.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                    <Star className="inline mr-1" size={14} /> Best Value
                                </div>
                            )}
                            <div className={`p-6 ${tier.popular ? 'pt-12' : ''}`}>
                                <div className={`w-12 h-12 bg-${tier.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                                    <tier.icon className={`text-${tier.color}-600`} size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                <p className="text-slate-500 text-sm">{tier.description}</p>
                                <div className="mt-4 mb-6">
                                    <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                                    {tier.period !== 'forever' && <span className="text-slate-500 text-sm ml-1">{tier.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {tier.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                            <Check size={16} className="text-emerald-500" />{f}
                                        </li>
                                    ))}
                                </ul>
                                <a href={tier.ctaLink} className={`block w-full py-3 text-center font-medium rounded-xl transition ${tier.popular ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                                    {tier.cta} <ArrowRight className="inline ml-1" size={16} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <a href="/pricing" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                        View full pricing with all 4 plans & feature comparison <ArrowRight size={18} />
                    </a>
                    <p className="text-slate-500 text-sm mt-2">Including Unlimited ($199/year) for power users</p>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Comparison Table - CORRECTED for new pricing
// ============================================================================

const ComparisonSection: React.FC = () => {
    const competitors = [
        { name: 'VoteGenerator', free: true, noSignup: true, pollTypes: 7, responses: '50 free', price: 'Free / $9.99+' },
        { name: 'Strawpoll', free: true, noSignup: true, pollTypes: 2, responses: 'Unlimited', price: 'Free / $5+' },
        { name: 'Doodle', free: true, noSignup: false, pollTypes: 2, responses: 'Limited', price: 'Free / $6.95+/mo' },
        { name: 'SurveyMonkey', free: true, noSignup: false, pollTypes: 10, responses: '10/survey', price: 'Free / $25+/mo' },
        { name: 'Google Forms', free: true, noSignup: false, pollTypes: 5, responses: 'Unlimited', price: 'Free' },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Compare</h2>
                    <p className="text-lg text-slate-600">See how VoteGenerator stacks up</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Platform</th>
                                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-700">No Signup</th>
                                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-700">Poll Types</th>
                                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-700">Free Responses</th>
                                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-700">Pricing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {competitors.map((c, i) => (
                                    <tr key={c.name} className={`border-b border-slate-100 ${i === 0 ? 'bg-indigo-50' : ''}`}>
                                        <td className="py-4 px-6">
                                            <span className={`font-semibold ${i === 0 ? 'text-indigo-700' : 'text-slate-700'}`}>{c.name}</span>
                                            {i === 0 && <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">You are here</span>}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {c.noSignup ? <Check className="mx-auto text-emerald-500" size={20} /> : <X className="mx-auto text-slate-300" size={20} />}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-slate-700">{c.pollTypes}</td>
                                        <td className="py-4 px-4 text-center text-slate-600">{c.responses}</td>
                                        <td className="py-4 px-4 text-center text-slate-600 text-sm">{c.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-4">
                    VoteGenerator offers the best combination of privacy, features, and simplicity.
                </p>
            </div>
        </section>
    );
};

// ============================================================================
// CTA Section
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to create your poll?</h2>
            <p className="text-indigo-100 text-lg mb-8">Start free. No signup required. Create unlimited polls forever.</p>
            <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
            </a>
        </div>
    </section>
);

// ============================================================================
// Main Landing Page
// ============================================================================

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <PromoBanner />
            <NavHeader />
            <HeroSection />
            <PollTypesSection />
            <WhyChooseUsSection />
            <PricingSection />
            <ComparisonSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;
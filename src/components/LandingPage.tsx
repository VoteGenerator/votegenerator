// ============================================================================
// LandingPage - VoteGenerator Home Page
// EXPANDED: More content, testimonials, features, trust signals
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Mail, Lock, Eye, CheckCircle2, ArrowRight, Sparkles, Star,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Zap, Crown, Globe, QrCode, BarChart3, Code, Check, X, Clock, Building2,
    GraduationCap, Heart, Briefcase, PartyPopper, Quote, Play, Shield, Rocket,
    Award, TrendingUp, MessageCircle
} from 'lucide-react';
import PromoBanner from './PromoBanner';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// Hero Section
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
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm mb-6">
                            <Sparkles size={14} />
                            FREE ONLINE POLLING TOOL
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
                                <Play size={18} /> See Demo
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
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

            {/* Stats bar */}
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
// Trusted By Section
// ============================================================================

const TrustedBySection: React.FC = () => {
    const useCases = [
        'Remote Teams', 'Event Planners', 'Teachers', 'HR Departments', 'Community Groups', 'Startups'
    ];

    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wide font-medium">Trusted by teams at</p>
                <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
                    {useCases.map((name, i) => (
                        <div key={i} className="text-slate-400 font-semibold text-lg">{name}</div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// How It Works Section
// ============================================================================

const HowItWorksSection: React.FC = () => {
    const steps = [
        { num: '1', title: 'Create Your Poll', desc: 'Choose from 7 poll types. Add your question and options.', icon: CheckSquare },
        { num: '2', title: 'Share the Link', desc: 'Get a shareable link, QR code, or embed code instantly.', icon: Globe },
        { num: '3', title: 'Watch Results Live', desc: 'See votes come in real-time with beautiful visualizations.', icon: BarChart3 },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                    <p className="text-lg text-slate-600">Three simple steps. No account required.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="relative text-center">
                            {i < 2 && (
                                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent -z-10" />
                            )}
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <step.icon className="text-white" size={40} />
                            </div>
                            <div className="text-sm text-indigo-600 font-bold mb-2">Step {step.num}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-600">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
                        <Sparkles size={18} /> Try It Now - It's Free <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Poll Types Section
// ============================================================================

const PollTypesSection: React.FC = () => {
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, desc: 'Classic pick one or more', color: 'from-blue-500 to-indigo-600' },
        { name: 'Ranked Choice', icon: ListOrdered, desc: 'Drag to rank in order', color: 'from-indigo-500 to-purple-600' },
        { name: 'This or That', icon: ArrowLeftRight, desc: 'Quick A vs B comparisons', color: 'from-orange-500 to-red-500' },
        { name: 'Meeting Poll', icon: Calendar, desc: 'Find the best time', color: 'from-amber-500 to-orange-500' },
        { name: 'Rating Scale', icon: SlidersHorizontal, desc: 'Rate options 1-5 stars', color: 'from-cyan-500 to-blue-500' },
        { name: 'RSVP', icon: Users, desc: 'Event attendance tracking', color: 'from-sky-500 to-blue-600' },
        { name: 'Visual Poll', icon: Image, desc: 'Vote on images (Pro)', color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">7 Poll Types for Every Decision</h2>
                    <p className="text-lg text-slate-600">From quick votes to complex ranked choices</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {pollTypes.map((type, i) => (
                        <motion.div key={type.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition group border border-slate-200">
                            <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition shadow-lg`}>
                                <type.icon className="text-white" size={28} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">{type.name}</h3>
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
// Features Section
// ============================================================================

const FeaturesSection: React.FC = () => {
    const features = [
        { icon: Zap, title: 'Create in 30 Seconds', description: 'No account needed. Type your question, add options, share the link.' },
        { icon: ShieldCheck, title: 'Privacy First', description: 'No email to vote. No tracking cookies. No data selling.' },
        { icon: Globe, title: 'Share Anywhere', description: 'Get a shareable link, QR code, or embed code. Works on any device.' },
        { icon: BarChart3, title: 'Real-Time Results', description: 'Watch votes come in live with beautiful charts and analytics.' },
        { icon: QrCode, title: 'QR Code Included', description: 'Every poll gets a free QR code for events and presentations.' },
        { icon: Code, title: 'Embed Anywhere', description: 'Add polls to your website with copy-paste embed code.' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose VoteGenerator?</h2>
                    <p className="text-lg text-slate-600">The simplest way to make group decisions</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition">
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
// Use Cases Section
// ============================================================================

const UseCasesSection: React.FC = () => {
    const useCases = [
        { icon: Building2, title: 'Workplace & Teams', examples: 'Team lunches, meeting times, project decisions, sprint planning' },
        { icon: Heart, title: 'Weddings & Events', examples: 'Song requests, menu choices, RSVPs, seating preferences' },
        { icon: GraduationCap, title: 'Education', examples: 'Class votes, topic preferences, feedback collection, quizzes' },
        { icon: Briefcase, title: 'Product & Business', examples: 'Feature prioritization, design decisions, stakeholder alignment' },
        { icon: PartyPopper, title: 'Fun & Social', examples: 'Game nights, group decisions, "would you rather", trivia' },
        { icon: Users, title: 'Community & Groups', examples: 'Club decisions, community feedback, volunteer coordination' },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perfect for Any Situation</h2>
                    <p className="text-lg text-slate-600">See how others use VoteGenerator</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase, i) => (
                        <motion.div key={useCase.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <useCase.icon className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{useCase.title}</h3>
                            <p className="text-slate-600 text-sm">{useCase.examples}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Testimonials Section
// ============================================================================

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { quote: "Finally, a polling tool that doesn't require everyone to create an account. Our team actually uses it now.", name: 'Sarah M.', role: 'Product Manager', avatar: '👩‍💼' },
        { quote: "We use it for all our team decisions. The ranked choice option is a game-changer for finding consensus.", name: 'Mike T.', role: 'Team Lead', avatar: '👨‍💻' },
        { quote: "Perfect for our wedding planning! No more endless group chat debates about the menu.", name: 'Emily & James', role: 'Engaged Couple', avatar: '💍' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Teams Everywhere</h2>
                    <p className="text-lg text-slate-600">See what people are saying</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <Quote className="text-indigo-200 mb-2" size={24} />
                            <p className="text-slate-700 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{testimonial.avatar}</div>
                                <div>
                                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                                    <div className="text-sm text-slate-500">{testimonial.role}</div>
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
// Pricing Section - GEO-AWARE VERSION
// REPLACE the existing PricingSection in LandingPage.tsx (lines 407-481)
// Also add this import at the top of LandingPage.tsx:
//   import { useGeoPricing } from '../geoPricing';
// And add: Loader2, Globe to the lucide-react imports
// ============================================================================

const PricingSection: React.FC = () => {
    const { loading, currency, prices } = useGeoPricing();
    
    const tiers = [
        {
            name: 'Free', 
            price: 0, 
            period: 'forever', 
            description: 'No credit card required', 
            color: 'slate', 
            icon: Users,
            features: ['6 free poll types', '50 responses per poll', '7 days active', 'Unlimited free polls', 'QR code sharing', 'Real-time results'],
            cta: 'Create Free Poll', 
            ctaLink: '/create',
        },
        {
            name: 'Starter', 
            price: prices.starter, 
            period: 'one-time', 
            description: 'For your next event', 
            color: 'blue', 
            icon: Zap,
            features: ['Everything in Free', '500 responses', '30 days active', '1 premium poll', 'CSV export', 'Device & geo stats'],
            cta: 'Get Starter', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=starter',
        },
        {
            name: 'Pro Event', 
            price: prices.proEvent, 
            period: 'one-time', 
            description: 'For important events', 
            color: 'purple', 
            icon: Crown, 
            popular: true,
            features: ['Everything in Starter', '2,000 responses', '60 days active', '1 premium poll', 'Visual Poll + PDF', 'Remove branding'],
            cta: 'Get Pro Event', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=pro_event',
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; button: string }> = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', button: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white' },
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600">Start free. Upgrade only when you need more.</p>
                    <p className="text-indigo-600 font-medium mt-2">One-time payments. Not subscriptions.</p>
                    
                    {/* Currency indicator */}
                    <div className="mt-4 flex items-center justify-center">
                        {loading ? (
                            <span className="flex items-center gap-2 text-sm text-slate-500">
                                <Loader2 size={14} className="animate-spin" /> Detecting your location...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-sm text-slate-600 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                                <Globe size={16} className="text-indigo-500" /> 
                                Prices shown in <strong>{currency}</strong>
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {tiers.map((tier, i) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;
                        
                        return (
                            <motion.div 
                                key={tier.name} 
                                initial={{ opacity: 0, y: 20 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }} 
                                transition={{ delay: i * 0.1 }}
                                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'} bg-white overflow-hidden`}
                            >
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                        <Star className="inline mr-1" size={14} /> Best Value
                                    </div>
                                )}
                                <div className={`p-6 ${tier.popular ? 'pt-12' : ''}`}>
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm">{tier.description}</p>
                                    
                                    <div className="mt-4 mb-6">
                                        {tier.price === 0 ? (
                                            <span className="text-4xl font-bold text-slate-900">Free</span>
                                        ) : loading ? (
                                            <span className="text-4xl font-bold text-slate-300">...</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-slate-900">
                                                    {prices.symbol}{tier.price}
                                                </span>
                                                <span className="text-slate-500 text-sm ml-2">{currency}</span>
                                            </>
                                        )}
                                        {tier.period !== 'forever' && tier.price !== 0 && (
                                            <span className="text-slate-500 text-sm ml-1">({tier.period})</span>
                                        )}
                                    </div>
                                    
                                    <ul className="space-y-3 mb-6">
                                        {tier.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check size={16} className="text-emerald-500" />{f}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <a 
                                        href={tier.ctaLink} 
                                        className={`block w-full py-3 text-center font-medium rounded-xl transition ${
                                            tier.popular 
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                                                : colors.button
                                        }`}
                                    >
                                        {tier.cta} <ArrowRight className="inline ml-1" size={16} />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <a href="/pricing" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                        View full pricing with all 4 plans & feature comparison <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FAQ Section
// ============================================================================

const FAQSection: React.FC = () => {
    const faqs = [
        { q: 'Do I need to create an account?', a: 'No! VoteGenerator is completely signup-free. Create polls instantly and share the link. You get a private admin link to manage your poll.' },
        { q: 'Is it really free?', a: 'Yes! Free polls get 50 responses and stay active for 7 days. You can create unlimited free polls. Upgrade only if you need more responses or features.' },
        { q: 'How do people vote?', a: 'Just share the link! Voters click the link, make their choice, and submit. No account or email required for them either.' },
        { q: 'Are votes anonymous?', a: 'By default, yes. You can optionally require names, but we never require email addresses to vote.' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.details key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-100 transition">
                                {faq.q}
                                <ArrowRight className="text-slate-400 group-open:rotate-90 transition-transform" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Comparison Table - GEO-AWARE VERSION  
// REPLACE the existing ComparisonSection in LandingPage.tsx (lines 519-574)
// This uses the same useGeoPricing hook
// ============================================================================

const ComparisonSection: React.FC = () => {
    const { loading, currency, prices } = useGeoPricing();
    
    // Format our price display
    const ourPriceDisplay = loading 
        ? 'Free / ...' 
        : `Free / ${prices.symbol}${prices.starter}+ ${currency}`;

    const competitors = [
        { name: 'VoteGenerator', free: true, noSignup: true, pollTypes: 7, responses: '50 free', price: ourPriceDisplay },
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

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
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
                                        <td className={`py-4 px-4 text-center text-sm ${i === 0 ? 'font-semibold text-indigo-700' : 'text-slate-600'}`}>
                                            {c.price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <p className="text-center text-slate-500 text-sm mt-4">
                    * Competitor prices may vary. VoteGenerator offers one-time payments, not subscriptions.
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
            <div className="flex flex-wrap justify-center gap-4">
                <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                    <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                </a>
                <a href="/demo" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/20">
                    <Play size={20} /> Watch Demo
                </a>
            </div>
        </div>
    </section>
);

// ============================================================================
// Main Landing Page
// ============================================================================

function LandingPage(): React.ReactElement {
    return (
        <div className="min-h-screen">
            <PromoBanner position="top" />
            <NavHeader />
            <HeroSection />
            <TrustedBySection />
            <HowItWorksSection />
            <PollTypesSection />
            <FeaturesSection />
            <UseCasesSection />
            <TestimonialsSection />
            <PricingSection />
            <ComparisonSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default LandingPage;
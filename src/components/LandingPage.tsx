// ============================================================================
// LandingPage - VoteGenerator Home Page
// UPDATED: Geo-aware pricing with clear "per poll" messaging
// Pro Event = 3 polls, expiration dates shown
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Mail, Lock, Eye, CheckCircle2, ArrowRight, Sparkles, Star,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Zap, Crown, Globe, QrCode, BarChart3, Code, Check, X, Clock, Building2,
    GraduationCap, Heart, Briefcase, PartyPopper, Quote, Play, Shield, Rocket,
    Award, TrendingUp, MessageCircle, Loader2, CalendarDays
} from 'lucide-react';
import PromoBanner from './PromoBanner';
import NavHeader from './NavHeader';
import Footer from './Footer';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import { useGeoPricing } from '../geoPricing';

// Calculate expiration date
const getExpirationDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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
                            <a href="/#create" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20">
                                <Star size={18} /> View Pricing
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-slate-500">Live Poll</span>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">{totalVotes} votes</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Where should we host the team retreat?</h3>
                            <div className="space-y-3">
                                {demoOptions.map((opt, i) => {
                                    const pct = Math.round((opt.votes / totalVotes) * 100);
                                    return (
                                        <div key={i} className={`relative p-3 rounded-xl border-2 ${opt.selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                                            <div className="absolute inset-0 rounded-xl bg-indigo-100 origin-left transition-transform" style={{ transform: `scaleX(${pct / 100})`, opacity: 0.5 }} />
                                            <div className="relative flex items-center justify-between">
                                                <span className="font-medium text-slate-800">{opt.text}</span>
                                                <span className="text-sm font-bold text-indigo-600">{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Trusted By Section
// ============================================================================

const TrustedBySection: React.FC = () => (
    <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-6">
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Trusted by teams at</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
                {['Google', 'Spotify', 'Airbnb', 'Slack', 'Notion', 'Figma'].map((company) => (
                    <span key={company} className="text-xl md:text-2xl font-bold text-slate-400">{company}</span>
                ))}
            </div>
        </div>
    </section>
);

// ============================================================================
// How It Works Section
// ============================================================================

const HowItWorksSection: React.FC = () => {
    const steps = [
        { icon: CheckSquare, title: 'Choose Poll Type', desc: 'Pick from 7 poll types including ranked choice, rating scales, and meeting polls.', color: 'from-blue-500 to-indigo-500' },
        { icon: Sparkles, title: 'Create Your Question', desc: 'Add your question and options. Customize settings like deadlines and anonymity.', color: 'from-indigo-500 to-purple-500' },
        { icon: QrCode, title: 'Share Instantly', desc: 'Get a shareable link and QR code. Send via text, email, or embed on your site.', color: 'from-purple-500 to-pink-500' },
        { icon: BarChart3, title: 'Watch Results Live', desc: 'See votes roll in real-time. Export results as CSV or share the results page.', color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Create a Poll in Seconds</h2>
                    <p className="text-lg text-slate-600">No signup. No credit card. Just create and share.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="relative p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition">
                            <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                <step.icon className="text-white" size={24} />
                            </div>
                            <div className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">{i + 1}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-600 text-sm">{step.desc}</p>
                        </motion.div>
                    ))}
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
        { name: 'Multiple Choice', icon: CheckSquare, desc: 'Classic single or multi-select voting', gradient: 'from-blue-500 to-indigo-500', free: true },
        { name: 'Ranked Choice', icon: ListOrdered, desc: 'Drag to rank options in order', gradient: 'from-indigo-500 to-purple-500', free: true },
        { name: 'Meeting Poll', icon: Calendar, desc: 'Find the best time for everyone', gradient: 'from-amber-500 to-orange-500', free: true },
        { name: 'This or That', icon: ArrowLeftRight, desc: 'A vs B pairwise comparisons', gradient: 'from-orange-500 to-red-500', free: true },
        { name: 'Rating Scale', icon: SlidersHorizontal, desc: 'Rate items on a 1-5 scale', gradient: 'from-cyan-500 to-blue-500', free: true },
        { name: 'RSVP', icon: Users, desc: 'Track event attendance', gradient: 'from-sky-500 to-blue-500', free: true },
        { name: 'Visual Poll', icon: Image, desc: 'Vote on images', gradient: 'from-pink-500 to-rose-500', free: false },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">7 Poll Types for Every Need</h2>
                    <p className="text-lg text-slate-600">From quick decisions to ranked preferences</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pollTypes.map((type, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                            className="relative p-5 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group">
                            {!type.free && <span className="absolute top-3 right-3 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">PRO</span>}
                            <div className={`w-10 h-10 bg-gradient-to-br ${type.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <type.icon className="text-white" size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{type.name}</h3>
                            <p className="text-slate-500 text-sm">{type.desc}</p>
                        </motion.div>
                    ))}
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
        { icon: Globe, title: 'Share Anywhere', desc: 'Link, QR code, embed, or share directly to social media', color: 'from-blue-500 to-cyan-500' },
        { icon: BarChart3, title: 'Real-Time Results', desc: 'Watch votes come in live with auto-updating charts', color: 'from-purple-500 to-pink-500' },
        { icon: Code, title: 'Embed on Your Site', desc: 'Add polls to any website with a simple embed code', color: 'from-amber-500 to-orange-500' },
        { icon: Shield, title: 'Privacy First', desc: 'No accounts, no tracking, no personal data collected', color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
                    <p className="text-lg text-slate-600">Powerful features, zero complexity</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition">
                            <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                <f.icon className="text-white" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                            <p className="text-slate-600 text-sm">{f.desc}</p>
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
        { icon: Building2, title: 'Business', examples: ['Team decisions', 'Employee surveys', 'Meeting scheduling'], color: 'from-blue-500 to-indigo-500' },
        { icon: GraduationCap, title: 'Education', examples: ['Class feedback', 'Study groups', 'Research surveys'], color: 'from-emerald-500 to-teal-500' },
        { icon: PartyPopper, title: 'Events', examples: ['Party planning', 'RSVP tracking', 'Venue voting'], color: 'from-amber-500 to-orange-500' },
        { icon: Heart, title: 'Personal', examples: ['Friend groups', 'Family decisions', 'Gift voting'], color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perfect for Every Occasion</h2>
                    <p className="text-lg text-slate-600">See how teams use VoteGenerator</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {useCases.map((uc, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
                            <div className={`w-12 h-12 bg-gradient-to-br ${uc.color} rounded-xl flex items-center justify-center mb-4`}>
                                <uc.icon className="text-white" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-3">{uc.title}</h3>
                            <ul className="space-y-2">
                                {uc.examples.map((ex, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle2 size={14} className="text-emerald-500" />{ex}
                                    </li>
                                ))}
                            </ul>
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
        { quote: "Finally, a poll tool that doesn't require everyone to create an account. Our team meetings are so much smoother now.", author: 'Sarah K.', role: 'Product Manager', avatar: '👩‍💼' },
        { quote: "We use VoteGenerator for every team decision. The ranked choice feature is a game-changer for consensus building.", author: 'Mike R.', role: 'Engineering Lead', avatar: '👨‍💻' },
        { quote: "Perfect for our non-profit. We needed something free and easy for our volunteers to use.", author: 'Lisa T.', role: 'Community Organizer', avatar: '👩‍🏫' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Teams Everywhere</h2>
                    <p className="text-lg text-slate-600">See what our users are saying</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <Quote className="text-indigo-300 mb-4" size={32} />
                            <p className="text-slate-700 mb-4 italic">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{t.avatar}</span>
                                <div>
                                    <p className="font-bold text-slate-900">{t.author}</p>
                                    <p className="text-sm text-slate-500">{t.role}</p>
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
// Pricing Section - GEO-AWARE - UPDATED WITH CLEAR PER-POLL MESSAGING
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
            pollCount: 1,
            activeDays: 7,
            features: ['6 free poll types', '50 responses per poll', '7 days active', 'Unlimited free polls', 'QR code sharing', 'Real-time results'],
            cta: 'Create Free Poll', 
            ctaLink: '/#create',
        },
        {
            name: 'Starter', 
            price: prices.starter, 
            period: 'one-time', 
            description: 'For a quick poll', 
            color: 'blue', 
            icon: Zap,
            pollCount: 1,
            activeDays: 30,
            features: ['Everything in Free', '500 responses', '30 days access', '1 poll included', 'CSV export', 'No ads'],
            cta: 'Get Starter', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=starter',
        },
        {
            name: 'Pro Event', 
            price: prices.proEvent, 
            period: 'one-time', 
            description: 'For events & teams', 
            color: 'purple', 
            icon: Crown, 
            popular: true,
            pollCount: 3,
            activeDays: 30,
            features: ['Everything in Starter', '2,000 responses/poll', '30 days access', '3 polls included', 'Visual Poll + PDF', 'Remove branding'],
            cta: 'Get Pro Event', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=pro_event',
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; button: string; light: string; border: string }> = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', button: 'bg-slate-100 hover:bg-slate-200 text-slate-800', light: 'bg-slate-50', border: 'border-slate-200' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white', light: 'bg-blue-50', border: 'border-blue-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white', light: 'bg-purple-50', border: 'border-purple-200' },
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
                        const expirationDate = getExpirationDate(tier.activeDays);
                        
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
                                    
                                    <div className="mt-4 mb-2">
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
                                    </div>
                                    
                                    {/* Polls included badge */}
                                    {tier.price !== 0 && (
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${colors.light} ${colors.text}`}>
                                            {tier.pollCount} poll{tier.pollCount > 1 ? 's' : ''} • {tier.activeDays} days each
                                        </div>
                                    )}
                                    
                                    {/* Expiration date */}
                                    {tier.price !== 0 && (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.light} ${colors.border} border mb-4`}>
                                            <CalendarDays size={14} className={colors.text} />
                                            <span className="text-xs text-slate-600">
                                                Expires: <strong className={colors.text}>{expirationDate}</strong>
                                            </span>
                                        </div>
                                    )}
                                    
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
                                    
                                    {/* No subscription note */}
                                    {tier.price !== 0 && (
                                        <p className="mt-3 text-center text-xs text-slate-400">
                                            💳 One-time payment • No auto-renew
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <a href="/pricing" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                        View full pricing with Unlimited plan & feature comparison <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Comparison Table - GEO-AWARE
// ============================================================================

const ComparisonSection: React.FC = () => {
    const { loading, currency, prices } = useGeoPricing();
    
    // Format our price display with geo
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
// CTA Section
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to create your poll?</h2>
            <p className="text-indigo-100 text-lg mb-8">Start free. No signup required. Create unlimited polls forever.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="/#create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
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
            
            {/* ============ CREATE POLL SECTION ============ */}
            <section id="create" className="py-16 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <VoteGeneratorCreate />
                </div>
            </section>
            {/* ============================================= */}
            
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
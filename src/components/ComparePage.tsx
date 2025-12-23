// ============================================================================
// ComparePage - Why VoteGenerator vs Competitors
// Full marketing page with compelling copy and geo pricing
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, X, ArrowRight, Sparkles, Shield, Zap, Users, Heart, Star, Crown, 
    Globe, Loader2, Lock, Clock, BarChart3, Eye, EyeOff, Mail, CreditCard,
    CheckCircle, AlertTriangle, ChevronDown, Award, Target, Rocket, 
    MessageSquare, Share2, QrCode, FileDown, Palette, Building2, PartyPopper
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import { useGeoPricing } from '../geoPricing';

function ComparePage(): React.ReactElement {
    const { loading, currency, prices } = useGeoPricing();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Hero benefits
    const heroFeatures = [
        { icon: Lock, text: 'No signup required', color: 'text-emerald-500' },
        { icon: Zap, text: 'Create in 60 seconds', color: 'text-amber-500' },
        { icon: Shield, text: 'Privacy-first', color: 'text-blue-500' },
        { icon: Heart, text: 'Free forever tier', color: 'text-pink-500' },
    ];

    // Why VoteGenerator section
    const whyChooseUs = [
        {
            icon: Lock,
            title: 'Zero Friction',
            description: 'No accounts. No emails. No passwords to remember. Just create and share.',
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your poll data stays in shareable links, not on servers tracking your every move.',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'From idea to shareable poll in under 60 seconds. No learning curve.',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            icon: Heart,
            title: 'Generous Free Tier',
            description: '50 responses, 7 days active, 6 poll types—all completely free, forever.',
            gradient: 'from-pink-500 to-rose-500',
        },
    ];

    // Competitor comparison
    const competitors = [
        { 
            name: 'VoteGenerator', 
            signup: false, 
            free: '50 responses', 
            privacy: '★★★★★',
            speed: '< 1 min',
            pricing: 'One-time',
            highlight: true,
            logo: '🗳️'
        },
        { 
            name: 'Doodle', 
            signup: true, 
            free: 'Ads & limits', 
            privacy: '★★☆☆☆',
            speed: '3-5 min',
            pricing: '$14.95/mo',
            highlight: false,
            logo: '📅'
        },
        { 
            name: 'StrawPoll', 
            signup: false, 
            free: 'Basic only', 
            privacy: '★★★☆☆',
            speed: '1-2 min',
            pricing: 'Free only',
            highlight: false,
            logo: '📊'
        },
        { 
            name: 'SurveyMonkey', 
            signup: true, 
            free: '10 questions', 
            privacy: '★★☆☆☆',
            speed: '5-10 min',
            pricing: '$25/mo',
            highlight: false,
            logo: '🐒'
        },
        { 
            name: 'Typeform', 
            signup: true, 
            free: '10 responses', 
            privacy: '★★★☆☆',
            speed: '5-15 min',
            pricing: '$29/mo',
            highlight: false,
            logo: '📝'
        },
    ];

    // Feature deep dive
    const featureCategories = [
        {
            title: 'For Quick Decisions',
            icon: Zap,
            color: 'amber',
            features: [
                'Team lunch spots',
                'Movie night picks',
                'Gift ideas voting',
                'Event date selection',
            ],
        },
        {
            title: 'For Events & Gatherings',
            icon: PartyPopper,
            color: 'pink',
            features: [
                'RSVP tracking',
                'Activity preferences',
                'Theme voting',
                'Menu selections',
            ],
        },
        {
            title: 'For Work & Teams',
            icon: Building2,
            color: 'blue',
            features: [
                'Meeting time polls',
                'Project prioritization',
                'Team retrospectives',
                'Quick feedback',
            ],
        },
        {
            title: 'For Creators & Communities',
            icon: Star,
            color: 'purple',
            features: [
                'Content direction',
                'Design feedback',
                'Community decisions',
                'Audience insights',
            ],
        },
    ];

    // What you get with each tier
    const tierBreakdown = [
        {
            name: 'Free',
            price: 0,
            color: 'slate',
            icon: Users,
            perfect: 'Quick polls & casual use',
            includes: [
                '50 responses per poll',
                '7 days active',
                '6 poll types included',
                'QR code & share link',
                'Real-time results',
                'Embed on any website',
            ],
            limitations: [
                'VoteGenerator branding',
                'Basic analytics only',
            ],
        },
        {
            name: 'Pro Event',
            price: prices.proEvent,
            color: 'purple',
            icon: Crown,
            popular: true,
            perfect: 'Important events & decisions',
            includes: [
                '2,000 responses per poll',
                '60 days active',
                'Visual Poll (image voting)',
                'Export to PDF & PNG',
                'Remove all branding',
                'Custom short link',
                'Password protection',
                'Advanced analytics',
            ],
            limitations: [],
        },
        {
            name: 'Unlimited',
            price: prices.unlimited,
            color: 'amber',
            icon: Star,
            perfect: 'Power users & organizations',
            includes: [
                '5,000 responses per poll',
                '1 year per poll',
                'Unlimited premium polls',
                'Upload your logo',
                'Priority support',
                'All Pro Event features',
                'Team collaboration (coming)',
                'API access (coming)',
            ],
            limitations: [],
        },
    ];

    // FAQs
    const faqs = [
        {
            q: 'How is VoteGenerator different from Doodle or SurveyMonkey?',
            a: 'Unlike Doodle or SurveyMonkey, VoteGenerator requires zero signup—no email, no account, no password. Your poll is ready in under 60 seconds. We also offer one-time payments instead of monthly subscriptions, saving you money long-term.',
        },
        {
            q: 'Why should I pay when StrawPoll is free?',
            a: 'StrawPoll is great for basic polls, but lacks features like Visual Polls (image voting), PDF exports, custom branding removal, and extended poll duration. If you need professional features for an important event, our one-time Pro Event payment is far cheaper than monthly subscriptions elsewhere.',
        },
        {
            q: 'What does "privacy-first" actually mean?',
            a: 'Your poll data is encoded in the shareable link itself—we don\'t store voter identities or track individual responses on our servers. No accounts means no profile building. No email means no spam. Simple.',
        },
        {
            q: 'Are these really one-time payments?',
            a: 'Yes! Unlike competitors charging $15-30/month, our Pro Event and Unlimited tiers are single payments. Pay once, use it for your event. No recurring charges, no surprises.',
        },
        {
            q: 'What if I need more responses than my tier allows?',
            a: 'You can upgrade anytime. If you\'re on Free (50 responses) and realize you need more, simply purchase Starter (500), Pro Event (2,000), or Unlimited (5,000 per poll).',
        },
    ];

    // Social proof alternatives (no fake numbers)
    const trustSignals = [
        { icon: Shield, text: 'SSL Encrypted', desc: 'Bank-level security' },
        { icon: Globe, text: 'Works Everywhere', desc: 'Mobile & desktop' },
        { icon: Zap, text: 'No Installation', desc: 'Works in browser' },
        { icon: CreditCard, text: 'Secure Payments', desc: 'Powered by Stripe' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-100/50 to-transparent" />
                
                <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                            <Award size={16} /> The Privacy-First Alternative
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Stop Paying Monthly for<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Simple Polls
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Why pay $15-30/month for poll tools when you can pay once? 
                            VoteGenerator gives you everything you need with zero signup required.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-10">
                            {heroFeatures.map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200"
                                >
                                    <feature.icon size={18} className={feature.color} />
                                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/create" 
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition shadow-md"
                            >
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                            </a>
                            <a 
                                href="/pricing" 
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition"
                            >
                                View Pricing <ArrowRight size={18} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why Teams Choose VoteGenerator
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We built the poll tool we wished existed—fast, private, and actually affordable.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                    <item.icon className="text-white" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Competitor Comparison Table */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            How We Stack Up
                        </h2>
                        <p className="text-lg text-slate-600">
                            See why VoteGenerator is the smarter choice for polls
                        </p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                                        <th className="py-4 px-6 text-left text-sm font-bold text-slate-900">Tool</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">No Signup</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Free Tier</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Privacy</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Setup Time</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Pricing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {competitors.map((c, i) => (
                                        <tr 
                                            key={i} 
                                            className={`border-b border-slate-100 ${c.highlight ? 'bg-indigo-50' : 'hover:bg-slate-50'} transition`}
                                        >
                                            <td className={`py-4 px-6 font-semibold ${c.highlight ? 'text-indigo-700' : 'text-slate-900'}`}>
                                                <span className="mr-2">{c.logo}</span>
                                                {c.name}
                                                {c.highlight && (
                                                    <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                                                        YOU'RE HERE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {!c.signup ? (
                                                    <CheckCircle className="inline text-emerald-500" size={22} />
                                                ) : (
                                                    <X className="inline text-slate-400" size={22} />
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center text-sm text-slate-600">{c.free}</td>
                                            <td className="py-4 px-4 text-center text-sm">{c.privacy}</td>
                                            <td className="py-4 px-4 text-center text-sm text-slate-600">{c.speed}</td>
                                            <td className={`py-4 px-4 text-center text-sm font-semibold ${c.highlight ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                {c.pricing}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <p className="text-center text-slate-500 text-sm mt-4">
                        * Pricing as of 2024. Competitor prices may vary.
                    </p>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Perfect For Every Occasion
                        </h2>
                        <p className="text-lg text-slate-600">
                            From casual lunch polls to important business decisions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featureCategories.map((cat, i) => {
                            const colorMap: Record<string, string> = {
                                amber: 'from-amber-500 to-orange-500 border-amber-200 bg-amber-50',
                                pink: 'from-pink-500 to-rose-500 border-pink-200 bg-pink-50',
                                blue: 'from-blue-500 to-indigo-500 border-blue-200 bg-blue-50',
                                purple: 'from-purple-500 to-violet-500 border-purple-200 bg-purple-50',
                            };
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`rounded-2xl p-6 border ${colorMap[cat.color].split(' ').slice(2).join(' ')}`}
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[cat.color].split(' ').slice(0, 2).join(' ')} rounded-xl flex items-center justify-center mb-4`}>
                                        <cat.icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">{cat.title}</h3>
                                    <ul className="space-y-2">
                                        {cat.features.map((f, fi) => (
                                            <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check size={14} className="text-emerald-500 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Simple, One-Time Pricing
                        </h2>
                        <p className="text-lg text-slate-600 mb-4">
                            No subscriptions. No monthly fees. Pay once, use it.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                            {loading ? (
                                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading prices...</span>
                            ) : (
                                <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                                    <Globe size={16} className="text-indigo-500" /> 
                                    Prices shown in <strong>{currency}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        {tierBreakdown.map((tier, i) => {
                            const colorMap: Record<string, { bg: string; border: string; button: string }> = {
                                slate: { bg: 'bg-slate-100', border: 'border-slate-200', button: 'bg-slate-800 hover:bg-slate-900 text-white' },
                                purple: { bg: 'bg-purple-100', border: 'border-purple-500', button: 'bg-purple-600 hover:bg-purple-700 text-white' },
                                amber: { bg: 'bg-amber-100', border: 'border-amber-400', button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' },
                            };
                            const colors = colorMap[tier.color];
                            const Icon = tier.icon;

                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative rounded-2xl border-2 ${tier.popular ? colors.border + ' shadow-2xl' : 'border-slate-200'} bg-white overflow-hidden`}
                                >
                                    {tier.popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-bold">
                                            <Star className="inline mr-1" size={14} /> MOST POPULAR
                                        </div>
                                    )}
                                    
                                    <div className={`p-8 ${tier.popular ? 'pt-14' : ''}`}>
                                        <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-4`}>
                                            <Icon className={tier.color === 'slate' ? 'text-slate-600' : tier.color === 'purple' ? 'text-purple-600' : 'text-amber-600'} size={28} />
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                                        <p className="text-slate-500 text-sm mt-1">{tier.perfect}</p>
                                        
                                        <div className="my-6">
                                            {tier.price === 0 ? (
                                                <span className="text-5xl font-bold text-slate-900">Free</span>
                                            ) : loading ? (
                                                <span className="text-5xl font-bold text-slate-300">...</span>
                                            ) : (
                                                <>
                                                    <span className="text-5xl font-bold text-slate-900">
                                                        {prices.symbol}{tier.price}
                                                    </span>
                                                    <span className="text-slate-500 ml-2">{currency}</span>
                                                </>
                                            )}
                                            {tier.price > 0 && (
                                                <p className="text-emerald-600 text-sm font-medium mt-1">One-time payment</p>
                                            )}
                                        </div>

                                        <ul className="space-y-3 mb-8">
                                            {tier.includes.map((feature, fi) => (
                                                <li key={fi} className="flex items-start gap-3 text-sm">
                                                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-slate-700">{feature}</span>
                                                </li>
                                            ))}
                                            {tier.limitations.map((limit, li) => (
                                                <li key={li} className="flex items-start gap-3 text-sm">
                                                    <AlertTriangle size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                                    <span className="text-slate-500">{limit}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <a 
                                            href={tier.price === 0 ? '/create' : `/.netlify/functions/vg-checkout?tier=${tier.name.toLowerCase().replace(' ', '_')}`}
                                            className={`block w-full py-4 ${colors.button} font-bold rounded-xl text-center transition shadow-md hover:shadow-lg`}
                                        >
                                            {tier.price === 0 ? 'Create Free Poll' : `Get ${tier.name}`}
                                            <ArrowRight className="inline ml-2" size={18} />
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <p className="text-center text-slate-500 mt-8">
                        <a href="/pricing" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            View full feature comparison →
                        </a>
                    </p>
                </div>
            </section>

            {/* Trust Signals */}
            <section className="py-12 bg-white border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {trustSignals.map((signal, i) => (
                            <div key={i} className="text-center">
                                <signal.icon className="mx-auto text-indigo-500 mb-2" size={28} />
                                <p className="font-semibold text-slate-900">{signal.text}</p>
                                <p className="text-sm text-slate-500">{signal.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Common Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                            >
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-900 hover:bg-slate-50 transition"
                                >
                                    {faq.q}
                                    <ChevronDown 
                                        className={`text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} 
                                        size={20} 
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-4 text-slate-600">
                                        {faq.a}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Make Better Decisions?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Create your first poll in 60 seconds. No signup required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/create" 
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                            >
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                            </a>
                        </div>
                        <p className="text-indigo-200 text-sm mt-6">
                            No credit card required • Free forever tier available
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default ComparePage;
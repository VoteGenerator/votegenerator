// ============================================================================
// Compare Page - VoteGenerator
// Focus on BENEFITS for poll creators and voters, not competitor bashing
// Fixed: 7 poll types, compelling value props, proper pricing
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Sparkles, ArrowRight, Shield, Zap, Users, Clock, BarChart3,
    Mail, Lock, QrCode, Code, Download, Palette, Globe, Star, Heart,
    CheckSquare, Smartphone, Gift, Award, TrendingUp, Eye
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// Benefits Data
// ============================================================================

interface Benefit {
    icon: React.ElementType;
    title: string;
    forCreator: string;
    forVoter: string;
    highlight?: boolean;
}

const keyBenefits: Benefit[] = [
    {
        icon: Lock,
        title: 'No Signup Required',
        forCreator: 'Start creating in seconds—no account, no email verification, no friction.',
        forVoter: 'Vote instantly without creating an account or sharing your email.',
        highlight: true
    },
    {
        icon: Shield,
        title: 'Privacy First',
        forCreator: 'We don\'t track your voters or sell data. Ever.',
        forVoter: 'Your votes are private. No cookies, no tracking, no data harvesting.',
        highlight: true
    },
    {
        icon: Zap,
        title: 'Instant Results',
        forCreator: 'Watch votes come in real-time with beautiful charts.',
        forVoter: 'See where you stand immediately after voting.',
    },
    {
        icon: Smartphone,
        title: 'Works Everywhere',
        forCreator: 'Share via link, QR code, or embed. Works on any device.',
        forVoter: 'Vote from phone, tablet, or desktop. No app needed.',
    },
    {
        icon: QrCode,
        title: 'Free QR Codes',
        forCreator: 'Every poll gets a QR code—perfect for presentations and events.',
        forVoter: 'Scan and vote in seconds at live events.',
    },
    {
        icon: BarChart3,
        title: '7 Poll Types',
        forCreator: 'Multiple Choice, Ranked Choice, Meeting Poll, Rating, RSVP, This or That, Visual Poll.',
        forVoter: 'Vote in ways that make sense—not just checkboxes.',
    },
];

// ============================================================================
// Pricing Comparison
// ============================================================================

const pricingHighlights = [
    { feature: 'Free polls', us: 'Unlimited free polls', others: 'Limited or paid only' },
    { feature: 'Free responses', us: '50 per poll', others: '10-25 typically' },
    { feature: 'Signup to vote', us: 'Never required', others: 'Often required' },
    { feature: 'Signup to create', us: 'Never required', others: 'Usually required' },
    { feature: 'QR codes', us: 'Always free', others: 'Often paid feature' },
    { feature: 'Real-time results', us: 'Always included', others: 'Sometimes paid' },
    { feature: 'Embed code', us: 'Always free', others: 'Often premium' },
    { feature: 'Poll types', us: '7 types (6 free)', others: '1-3 typically' },
];

// ============================================================================
// Use Case Benefits
// ============================================================================

const useCaseBenefits = [
    {
        title: 'Team Decisions',
        icon: Users,
        benefits: [
            'No one needs to create an account',
            'Quick lunch polls in Slack in 30 seconds',
            'Ranked choice for fair compromise',
            'Anonymous voting keeps things honest'
        ]
    },
    {
        title: 'Events & RSVPs',
        icon: Gift,
        benefits: [
            'QR codes for wedding tables',
            'Real-time headcounts',
            'No email collection required',
            'Beautiful shareable results'
        ]
    },
    {
        title: 'Feedback & Ratings',
        icon: Star,
        benefits: [
            '5-star rating scales',
            'Anonymous feedback option',
            'Export results to CSV',
            'Visual charts for presentations'
        ]
    },
    {
        title: 'Scheduling',
        icon: Clock,
        benefits: [
            'Like Doodle, but simpler',
            'No account for participants',
            'See availability at a glance',
            'Works for any time zone'
        ]
    },
];

// ============================================================================
// Main Compare Page
// ============================================================================

function ComparePage(): React.ReactElement {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero Section */}
            <section className="py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                            <Award size={16} />
                            Why Teams Choose VoteGenerator
                        </span>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Polling That<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Just Works
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            No signups. No tracking. No friction. Create polls in 30 seconds and share instantly.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
                                <Sparkles size={18} /> Create Free Poll <ArrowRight size={18} />
                            </a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                                See Demo
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Key Differentiators */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Makes Us Different</h2>
                        <p className="text-lg text-slate-600">Benefits for both poll creators and voters</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {keyBenefits.map((benefit, i) => (
                            <motion.div 
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className={`rounded-2xl p-6 border ${benefit.highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'} hover:shadow-lg transition`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${benefit.highlight ? 'bg-indigo-600' : 'bg-slate-100'} flex items-center justify-center mb-4`}>
                                    <benefit.icon className={benefit.highlight ? 'text-white' : 'text-slate-600'} size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-3">{benefit.title}</h3>
                                
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-xs text-indigo-600 font-bold mb-1 uppercase tracking-wide">For Poll Creators</div>
                                        <p className="text-sm text-slate-600">{benefit.forCreator}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                                        <div className="text-xs text-emerald-600 font-bold mb-1 uppercase tracking-wide">For Voters</div>
                                        <p className="text-sm text-slate-600">{benefit.forVoter}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Comparison */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">More Value, Less Cost</h2>
                        <p className="text-lg text-slate-600">See what you get with VoteGenerator</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                        <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200">
                            <div className="p-4 font-semibold text-slate-700">Feature</div>
                            <div className="p-4 font-bold text-indigo-700 bg-indigo-50 text-center">VoteGenerator</div>
                            <div className="p-4 font-semibold text-slate-500 text-center">Typical Competitors</div>
                        </div>
                        {pricingHighlights.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 border-b border-slate-100 last:border-b-0">
                                <div className="p-4 text-slate-700 font-medium">{row.feature}</div>
                                <div className="p-4 text-center bg-indigo-50/50">
                                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                                        <Check size={16} className="text-emerald-500" />
                                        {row.us}
                                    </span>
                                </div>
                                <div className="p-4 text-center text-slate-500">{row.others}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Case Benefits */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perfect For Every Scenario</h2>
                        <p className="text-lg text-slate-600">See why teams love VoteGenerator</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCaseBenefits.map((useCase, i) => (
                            <motion.div 
                                key={useCase.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <useCase.icon className="text-indigo-600" size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-4">{useCase.title}</h3>
                                <ul className="space-y-2">
                                    {useCase.benefits.map((benefit, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                            <Check size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            {/* Free Tier */}
                            <div className="p-8 md:p-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                    <Gift size={14} /> Forever Free
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Plan</h3>
                                <p className="text-slate-600 mb-6">Everything you need for quick polls</p>
                                
                                <ul className="space-y-3 mb-8">
                                    {['Unlimited free polls', '50 responses per poll', '7 days active', '6 poll types', 'QR codes & embed', 'Real-time results'].map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-700">
                                            <Check size={18} className="text-emerald-500" />{f}
                                        </li>
                                    ))}
                                </ul>
                                
                                <a href="/create" className="block w-full py-3 bg-slate-900 text-white font-bold text-center rounded-xl hover:bg-slate-800 transition">
                                    Create Free Poll
                                </a>
                            </div>
                            
                            {/* Paid Tiers */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-12 text-white">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                                    <TrendingUp size={14} /> Need More?
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Paid Plans</h3>
                                <p className="text-indigo-100 mb-6">For bigger events and more features</p>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">Starter</span>
                                            <span className="text-lg font-bold">$9.99 <span className="text-sm font-normal">one-time</span></span>
                                        </div>
                                        <p className="text-indigo-100 text-sm">500 responses, 30 days, CSV export</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 ring-2 ring-white/30">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">Pro Event</span>
                                            <span className="text-lg font-bold">$19.99 <span className="text-sm font-normal">one-time</span></span>
                                        </div>
                                        <p className="text-indigo-100 text-sm">2,000 responses, 60 days, Visual Poll, PDF</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold">Unlimited</span>
                                            <span className="text-lg font-bold">$199 <span className="text-sm font-normal">for 1 year</span></span>
                                        </div>
                                        <p className="text-indigo-100 text-sm">Unlimited premium polls, 5K responses each, 1 year access</p>
                                    </div>
                                </div>
                                
                                <a href="/pricing" className="block w-full py-3 bg-white text-indigo-700 font-bold text-center rounded-xl hover:bg-indigo-50 transition">
                                    View Full Pricing <ArrowRight className="inline ml-1" size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try the difference?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Join teams who've switched to simpler, privacy-first polling.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default ComparePage;
// ============================================================================
// AboutPage - VoteGenerator
// Uses "we" language, accurate features only, visual mockups
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Lock, Mail, Clock, Heart, Sparkles, Globe, Zap, ArrowRight,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Check, X, Star, Lightbulb, Shield, Target, CheckCircle2, QrCode, Download,
    BarChart3, Palette, Crown, Building2, Smartphone
} from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

// ============================================================================
// AboutPage Component
// ============================================================================

function AboutPage(): React.ReactElement {
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, color: 'from-blue-500 to-indigo-600', desc: 'Pick one or more' },
        { name: 'Ranked Choice', icon: ListOrdered, color: 'from-indigo-500 to-purple-600', desc: 'Drag to rank' },
        { name: 'Meeting Poll', icon: Calendar, color: 'from-amber-500 to-orange-500', desc: 'Find the best time' },
        { name: 'This or That', icon: ArrowLeftRight, color: 'from-orange-500 to-red-500', desc: 'Quick A vs B' },
        { name: 'Rating Scale', icon: SlidersHorizontal, color: 'from-cyan-500 to-blue-500', desc: 'Rate 1-5 stars' },
        { name: 'RSVP', icon: Users, color: 'from-sky-500 to-blue-600', desc: 'Yes, No, Maybe' },
        { name: 'Visual Poll', icon: Image, color: 'from-pink-500 to-rose-500', desc: 'Vote with images' },
        { name: 'Dot Voting', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', desc: 'Distribute points' },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Privacy First',
            desc: 'We believe your data belongs to you. No email required to vote, no account needed, no selling your information to third parties.',
            color: 'from-rose-500 to-pink-600'
        },
        {
            icon: Zap,
            title: 'Simplicity Always',
            desc: 'Polls should take seconds to create, not minutes. We obsess over removing friction so you can focus on decisions.',
            color: 'from-amber-500 to-orange-600'
        },
        {
            icon: Globe,
            title: 'Accessible to All',
            desc: 'A free tier forever, no credit card required. Great tools should be available to everyone, not just enterprises.',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            icon: Target,
            title: 'Results That Matter',
            desc: 'Real-time analytics, clear visualizations, and easy exports. We help you understand what your group actually thinks.',
            color: 'from-indigo-500 to-purple-600'
        },
    ];

    // Competitors comparison - based on REAL differences
    const competitors = [
        {
            name: 'Doodle',
            weaknesses: ['Requires email to vote', 'Limited poll types', 'Ads on free tier'],
            vgAdvantage: 'No signup needed'
        },
        {
            name: 'Typeform',
            weaknesses: ['Complex setup', 'Expensive pricing', 'Requires account'],
            vgAdvantage: '30-second setup'
        },
        {
            name: 'Google Forms',
            weaknesses: ['Basic styling', 'No real-time results', 'No ranked choice'],
            vgAdvantage: '8 poll types + live results'
        },
        {
            name: 'SurveyMonkey',
            weaknesses: ['Enterprise pricing', 'Bloated features', 'Slow experience'],
            vgAdvantage: 'Simple & affordable'
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}

            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60" />
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-8">
                            <Heart size={16} className="text-red-500" />
                            Our Story
                        </span>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                            We're building the<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                anti-survey tool
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            Most polling tools are bloated, expensive, and obsessed with collecting your data. 
                            We think there's a better way.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Problem We Solve */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">
                                We've all been there.
                            </h2>
                            <div className="space-y-4 text-slate-600">
                                <p>
                                    You just want to ask your team where to get lunch. Or let friends vote on 
                                    a movie. Or pick a meeting time that works for everyone.
                                </p>
                                <p>
                                    But every tool wants you to create an account. Enter your email. 
                                    Start a "free trial" that requires a credit card. Watch ads. 
                                    Navigate a dashboard designed for enterprise surveys.
                                </p>
                                <p className="font-medium text-slate-900">
                                    We built VoteGenerator because we were tired of it too.
                                </p>
                            </div>
                        </motion.div>

                        {/* Visual: The frustration */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }} 
                            whileInView={{ opacity: 1, x: 0 }} 
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
                        >
                            <p className="text-sm font-bold text-slate-500 mb-4">What you usually see:</p>
                            <div className="space-y-3">
                                {[
                                    '"Create an account to continue"',
                                    '"Enter your email to view results"',
                                    '"Your free trial has ended"',
                                    '"Upgrade to remove our branding"',
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <X className="text-red-500 flex-shrink-0" size={18} />
                                        <span className="text-sm text-red-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-slate-200 mt-6 pt-6">
                                <p className="text-sm font-bold text-slate-500 mb-4">What we built:</p>
                                <div className="space-y-3">
                                    {[
                                        'Create a poll in 30 seconds',
                                        'Share a link, get instant votes',
                                        'No signup needed—ever',
                                        'Free tier available forever',
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                            <Check className="text-emerald-500 flex-shrink-0" size={18} />
                                            <span className="text-sm text-emerald-700">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What we believe</h2>
                        <p className="text-xl text-slate-600">The principles that guide everything we build</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <value.icon className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-xl mb-2">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8 Poll Types - Visual Grid */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4">
                            All included free
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">8 poll types</h2>
                        <p className="text-xl text-slate-600">The right tool for every decision</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pollTypes.map((type, i) => (
                            <motion.div
                                key={type.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <type.icon className="text-white" size={24} />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{type.name}</h3>
                                <p className="text-sm text-slate-500">{type.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Compare */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-4">
                            Honest comparison
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            How we're different
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            We're not trying to replace enterprise survey tools. We're building the fastest, 
                            simplest way to make group decisions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {competitors.map((comp, i) => (
                            <motion.div
                                key={comp.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200"
                            >
                                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-bold text-slate-700">{comp.name}</h3>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Common complaints</p>
                                    <ul className="space-y-1.5 mb-4">
                                        {comp.weaknesses.map((w, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-slate-500">
                                                <X size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">VoteGenerator</p>
                                        <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                            <Check size={14} className="text-emerald-500" />
                                            {comp.vgAdvantage}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick comparison table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Feature</th>
                                        <th className="text-center py-4 px-4 font-semibold text-slate-500">Others</th>
                                        <th className="text-center py-4 px-4 font-semibold text-indigo-600">VoteGenerator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: 'Account required to create', others: 'Usually', vg: 'No', vgGood: true },
                                        { feature: 'Email required to vote', others: 'Often', vg: 'Never', vgGood: true },
                                        { feature: 'Time to create a poll', others: '5-10 min', vg: '30 seconds', vgGood: true },
                                        { feature: 'Free tier', others: 'Limited trials', vg: 'Forever free', vgGood: true },
                                        { feature: 'Real-time results', others: 'Sometimes', vg: 'Always', vgGood: true },
                                        { feature: 'QR code sharing', others: 'Premium only', vg: 'All plans', vgGood: true },
                                        { feature: 'Embed on website', others: 'Premium only', vg: 'All plans', vgGood: true },
                                        { feature: 'Poll types', others: '2-3 types', vg: '8 types', vgGood: true },
                                        { feature: 'Geographic analytics', others: 'Enterprise', vg: 'Pro ($16/mo)', vgGood: true },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                            <td className="py-3 px-6 text-slate-700">{row.feature}</td>
                                            <td className="py-3 px-4 text-center text-slate-400">{row.others}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`inline-flex items-center gap-1 font-medium ${row.vgGood ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                    {row.vgGood && <Check size={14} />}
                                                    {row.vg}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What You Get - Visual Feature Showcase */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What you actually get</h2>
                        <p className="text-xl text-slate-400">No hidden features, no surprise paywalls</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <Users className="text-slate-300" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Free</h3>
                                    <p className="text-sm text-slate-400">$0 USD forever</p>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {[
                                    '3 active polls',
                                    '100 responses/month',
                                    'All 8 poll types',
                                    'Real-time results',
                                    'QR code & embed',
                                    'Anti-fraud protection',
                                ].map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={14} className="text-emerald-400" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Pro Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl relative"
                        >
                            <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                                POPULAR
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Crown className="text-amber-300" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Pro</h3>
                                    <p className="text-sm text-indigo-200">$16/month USD</p>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {[
                                    'Unlimited polls',
                                    '5,000 responses/month',
                                    'CSV & Excel export',
                                    'Response timeline',
                                    'Geographic & device data',
                                    'Remove branding',
                                    'PIN code access',
                                    'Email notifications',
                                ].map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                                        <Check size={14} className="text-amber-300" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Business Tier */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                    <Building2 className="text-amber-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Business</h3>
                                    <p className="text-sm text-slate-400">$41/month USD</p>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {[
                                    'Everything in Pro',
                                    '50,000 responses/month',
                                    'PDF reports',
                                    'Custom logo',
                                    'Custom short links',
                                    'Hourly heatmap',
                                    'IP allowlist/blocklist',
                                    'Priority support',
                                ].map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check size={14} className="text-amber-400" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    <p className="text-center text-slate-400 mt-8">
                        All plans include: 8 poll types • Real-time results • QR codes • Embed • No signup to vote
                    </p>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                    >
                        <Lightbulb className="mx-auto mb-6 text-amber-500" size={48} />
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-700">
                            "We believe group decisions should be <span className="text-indigo-600 font-bold">simple</span>, 
                            not stressful. That's why VoteGenerator will <span className="text-indigo-600 font-bold">always have a free tier</span> with 
                            no strings attached."
                        </p>
                        <p className="mt-6 text-slate-500">— The VoteGenerator Team</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try it?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Create your first poll in 30 seconds. No signup required.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/#create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                            </a>
                            <a href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/20">
                                View Pricing
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default AboutPage;
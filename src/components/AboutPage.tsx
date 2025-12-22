// ============================================================================
// About Page - VoteGenerator
// Changed "I" to "we", adjusted messaging for new startup
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Lock, Eye, Mail, Server, Clock, Heart, Sparkles, Globe, Zap, ArrowRight,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Check, Star, Lightbulb, Shield, Rocket, Target
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// Components
// ============================================================================

const AnimatedStat: React.FC<{ value: string; label: string; icon: React.ElementType; color: string; delay?: number }> = ({ 
    value, label, icon: Icon, color, delay = 0 
}) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ delay, type: 'spring', stiffness: 100 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-shadow"
    >
        <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="text-white" size={28} />
        </div>
        <div className="text-4xl font-black text-slate-900 mb-1">{value}</div>
        <div className="text-slate-500 font-medium">{label}</div>
    </motion.div>
);

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; description: string; color: string; delay: number }> = ({ 
    icon: Icon, title, description, color, delay 
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group"
    >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
            <Icon className="text-white" size={24} />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

// ============================================================================
// About Page
// ============================================================================

function AboutPage(): React.ReactElement {
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, color: 'from-blue-500 to-indigo-600' },
        { name: 'Ranked Choice', icon: ListOrdered, color: 'from-indigo-500 to-purple-600' },
        { name: 'This or That', icon: ArrowLeftRight, color: 'from-orange-500 to-red-500' },
        { name: 'Meeting Poll', icon: Calendar, color: 'from-amber-500 to-orange-500' },
        { name: 'Rating Scale', icon: SlidersHorizontal, color: 'from-cyan-500 to-blue-500' },
        { name: 'RSVP', icon: Users, color: 'from-sky-500 to-blue-600' },
        { name: 'Visual Poll', icon: Image, color: 'from-pink-500 to-rose-500' },
    ];

    const privacyFeatures = [
        { icon: Mail, text: 'No email required' },
        { icon: Lock, text: 'No signup needed' },
        { icon: Eye, text: 'No tracking cookies' },
        { icon: Server, text: 'Minimal data storage' },
        { icon: Clock, text: 'Auto-deletion' },
        { icon: ShieldCheck, text: 'Secure by default' },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <PromoBanner position="top" />
            <NavHeader />

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
                            About VoteGenerator
                        </span>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Making Group Decisions<br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Simple & Private
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            We believe everyone deserves tools that respect their privacy while making collaboration effortless.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
                                <Sparkles size={18} /> Try It Free <ArrowRight size={18} />
                            </a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                                See Demo
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <AnimatedStat value="7" label="Poll Types" icon={CheckSquare} color="from-blue-500 to-indigo-600" delay={0} />
                        <AnimatedStat value="0" label="Emails Required" icon={Mail} color="from-emerald-500 to-teal-600" delay={0.1} />
                        <AnimatedStat value="30s" label="To Create" icon={Clock} color="from-amber-500 to-orange-600" delay={0.2} />
                        <AnimatedStat value="∞" label="Free Polls" icon={Star} color="from-purple-500 to-pink-600" delay={0.3} />
                    </div>
                </div>
            </section>

            {/* Our Story Section - Using "we" language */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                                <Lightbulb size={14} /> Our Story
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Built Out of Frustration
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    We were tired of existing polling tools. They all wanted our email, tracked our data, 
                                    or made simple decisions unnecessarily complicated.
                                </p>
                                <p>
                                    So we built VoteGenerator—a tool that respects privacy, works instantly, 
                                    and doesn't require anyone to create an account just to cast a vote.
                                </p>
                                <p>
                                    Today, VoteGenerator offers <strong>7 different poll types</strong> with the same 
                                    commitment to privacy and simplicity that started it all.
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            {/* Our Mission Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                                <Target className="mb-4" size={40} />
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-indigo-100 leading-relaxed mb-6">
                                    To make group decision-making simple, fast, and private for everyone—from small teams 
                                    picking lunch spots to organizations running important votes.
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                                    <Rocket className="text-amber-300" size={24} />
                                    <span className="font-medium">Just getting started—and excited to grow with you!</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Different Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why We're Different
                        </motion.h2>
                        <p className="text-xl text-slate-600">Not just another survey tool</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard icon={Zap} title="Instant Creation" description="Create a poll in 30 seconds. No account, no friction, no waiting. Just type and share." color="from-amber-500 to-orange-500" delay={0.1} />
                        <FeatureCard icon={Shield} title="Privacy First" description="No tracking, no data selling, no email harvesting. Your polls, your privacy." color="from-emerald-500 to-teal-500" delay={0.2} />
                        <FeatureCard icon={Globe} title="Works Everywhere" description="Share via link, QR code, or embed. Any device, any browser, real-time results." color="from-blue-500 to-indigo-500" delay={0.3} />
                    </div>

                    {/* Visual Demo */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="mt-16 relative"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto relative z-10">
                            {/* Browser dots */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 bg-red-400 rounded-full" />
                                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                                <div className="w-3 h-3 bg-green-400 rounded-full" />
                                <div className="flex-1 mx-4 bg-slate-100 rounded-full h-6 flex items-center px-3">
                                    <span className="text-xs text-slate-400">votegenerator.com/p/team-lunch</span>
                                </div>
                            </div>
                            
                            {/* Mock poll */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">🍕 What should we order for lunch?</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Pizza', pct: 40 },
                                        { label: 'Tacos', pct: 30 },
                                        { label: 'Sushi', pct: 20 },
                                        { label: 'Salads', pct: 10 },
                                    ].map((opt, i) => (
                                        <div key={i} className="relative bg-slate-50 rounded-lg overflow-hidden">
                                            <div className={`absolute inset-0 ${i === 0 ? 'bg-indigo-100' : 'bg-slate-100'}`} style={{ width: `${opt.pct}%` }} />
                                            <div className="relative px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                                        {i === 0 && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{opt.label}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{opt.pct}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Submit Vote</button>
                                <p className="text-center text-xs text-slate-400">20 votes • Closes in 2 days</p>
                            </div>
                        </div>

                        {/* Floating badges - positioned outside main card */}
                        <motion.div 
                            animate={{ y: [0, -8, 0] }} 
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -top-4 right-4 md:right-20 z-20 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                        >
                            ✓ No signup
                        </motion.div>
                        <motion.div 
                            animate={{ y: [0, 8, 0] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-4 left-4 md:left-20 z-20 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                        >
                            Real-time results
                        </motion.div>
                        <motion.div 
                            animate={{ y: [0, -6, 0] }} 
                            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                            className="absolute top-1/2 -right-2 md:right-8 z-20 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                        >
                            30 seconds
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 7 Poll Types Grid */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">7 Poll Types</h2>
                        <p className="text-xl text-slate-600">The right tool for every decision</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {pollTypes.map((type, i) => (
                            <motion.div
                                key={type.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <type.icon className="text-white" size={28} />
                                </div>
                                <h3 className="font-bold text-slate-900">{type.name}</h3>
                            </motion.div>
                        ))}
                        {/* CTA Card */}
                        <motion.a
                            href="/demo"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <ArrowRight size={28} className="mb-2" />
                            <span className="font-bold">Try them all</span>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* Privacy Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Privacy by Design</h2>
                        <p className="text-xl text-slate-400">Not an afterthought</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {privacyFeatures.map((feature, i) => (
                            <motion.div
                                key={feature.text}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                            >
                                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                    <feature.icon className="text-emerald-400" size={16} />
                                </div>
                                <span className="font-medium">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mission Statement */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <Lightbulb className="mx-auto mb-6 text-amber-400" size={48} />
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                            "Everyone deserves tools that respect their privacy. 
                            That's why VoteGenerator will <span className="text-amber-400">always offer a free tier</span> with no strings attached."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to create your poll?</h2>
                        <p className="text-indigo-100 text-lg mb-8">30 seconds. No signup. Completely free.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
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
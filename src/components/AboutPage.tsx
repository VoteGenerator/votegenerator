// ============================================================================
// About Page - VoteGenerator
// Beautiful, visual design - less text blocks, more engaging elements
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Lock, Eye, Mail, Server, Clock, Heart, Sparkles, Globe, Zap, ArrowRight,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Check, Star, Target, Lightbulb
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// Animated Counter Component
// ============================================================================

const AnimatedStat: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }}
        transition={{ delay, type: 'spring', stiffness: 100 }}
        className="text-center"
    >
        <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {value}
        </div>
        <div className="text-slate-600 font-medium mt-2">{label}</div>
    </motion.div>
);

// ============================================================================
// Poll Type Card
// ============================================================================

const PollTypeCard: React.FC<{ name: string; icon: React.ElementType; color: string; delay: number }> = ({ name, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ scale: 1.05, y: -5 }}
        className={`bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all cursor-pointer`}
    >
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="text-white" size={28} />
        </div>
        <h3 className="font-bold text-slate-900">{name}</h3>
    </motion.div>
);

// ============================================================================
// Value Proposition Card
// ============================================================================

const ValueCard: React.FC<{ icon: React.ElementType; title: string; description: string; gradient: string; delay: number }> = ({ icon: Icon, title, description, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex gap-4 items-start"
    >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <p className="text-slate-600 mt-1">{description}</p>
        </div>
    </motion.div>
);

// ============================================================================
// Privacy Feature Pill
// ============================================================================

const PrivacyPill: React.FC<{ icon: React.ElementType; text: string; delay: number }> = ({ icon: Icon, text, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-emerald-100"
    >
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <Icon className="text-emerald-600" size={16} />
        </div>
        <span className="font-medium text-slate-700">{text}</span>
    </motion.div>
);

// ============================================================================
// About Page Component
// ============================================================================

const AboutPage: React.FC = () => {
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, color: 'from-blue-500 to-indigo-600' },
        { name: 'Ranked Choice', icon: ListOrdered, color: 'from-indigo-500 to-purple-600' },
        { name: 'This or That', icon: ArrowLeftRight, color: 'from-orange-500 to-red-500' },
        { name: 'Meeting Poll', icon: Calendar, color: 'from-amber-500 to-orange-500' },
        { name: 'Rating Scale', icon: SlidersHorizontal, color: 'from-cyan-500 to-blue-500' },
        { name: 'RSVP', icon: Users, color: 'from-sky-500 to-blue-600' },
        { name: 'Visual Poll', icon: Image, color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <PromoBanner />
            <NavHeader />

            {/* Hero - Big bold statement */}
            <section className="relative py-24 md:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-40" />
                </div>
                
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-8">
                            <Heart size={16} className="text-red-500" />
                            Built with Privacy in Mind
                        </span>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">
                            Polls should be{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                simple
                            </span>
                            <br />
                            & private.
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
                            No signups. No tracking. No nonsense.<br />
                            Just beautiful polls that work.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats - Big numbers */}
            <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <AnimatedStat value="7" label="Poll Types" delay={0} />
                        <AnimatedStat value="0" label="Emails Required" delay={0.1} />
                        <AnimatedStat value="30s" label="To Create" delay={0.2} />
                        <AnimatedStat value="∞" label="Free Polls" delay={0.3} />
                    </div>
                </div>
            </section>

            {/* Poll Types - Visual grid */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            7 Poll Types
                        </motion.h2>
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600">
                            For every kind of decision
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {pollTypes.map((type, i) => (
                            <PollTypeCard key={type.name} name={type.name} icon={type.icon} color={type.color} delay={i * 0.05} />
                        ))}
                        {/* Extra card - CTA */}
                        <motion.a
                            href="/demo"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <ArrowRight size={28} className="mb-2" />
                            <span className="font-bold">Try them all</span>
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* Why Different - Visual cards */}
            <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                                Why we're different
                            </motion.h2>
                            
                            <div className="space-y-8">
                                <ValueCard icon={Zap} title="Instant Creation" description="Create a poll in 30 seconds. No account, no friction, no waiting." gradient="from-amber-500 to-orange-500" delay={0.1} />
                                <ValueCard icon={ShieldCheck} title="Privacy First" description="No tracking, no data selling, no email harvesting. Ever." gradient="from-emerald-500 to-teal-500" delay={0.2} />
                                <ValueCard icon={Globe} title="Works Everywhere" description="Share via link, QR code, or embed. Any device, any browser." gradient="from-blue-500 to-indigo-500" delay={0.3} />
                            </div>
                        </div>
                        
                        {/* Visual element */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            whileInView={{ opacity: 1, scale: 1 }} 
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl p-8 relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
                                    <div className="space-y-2">
                                        {[65, 20, 10, 5].map((w, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                                                    {i === 0 && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                                                </div>
                                                <div className={`h-6 bg-indigo-${i === 0 ? '500' : '100'} rounded`} style={{ width: `${w}%` }} />
                                                <span className="text-sm text-slate-500">{w}%</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-12 bg-indigo-600 rounded-xl mt-6" />
                                </div>
                            </div>
                            
                            {/* Floating elements */}
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                ✓ No signup
                            </motion.div>
                            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                Real-time
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Privacy - Visual pills */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Privacy by Design
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 mb-12">
                        Not an afterthought
                    </motion.p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <PrivacyPill icon={Mail} text="No email required" delay={0} />
                        <PrivacyPill icon={Lock} text="No signup needed" delay={0.05} />
                        <PrivacyPill icon={Eye} text="No tracking cookies" delay={0.1} />
                        <PrivacyPill icon={Server} text="Minimal data storage" delay={0.15} />
                        <PrivacyPill icon={Clock} text="Auto-deletion" delay={0.2} />
                        <PrivacyPill icon={ShieldCheck} text="Secure by default" delay={0.25} />
                    </div>
                </div>
            </section>

            {/* Mission Statement - Clean typography */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Lightbulb className="mx-auto mb-6 text-amber-400" size={48} />
                        <h2 className="text-2xl md:text-3xl font-medium text-slate-300 mb-6">Our Mission</h2>
                        <p className="text-3xl md:text-4xl font-bold leading-relaxed">
                            Make group decisions{' '}
                            <span className="text-amber-400">simple</span>,{' '}
                            <span className="text-emerald-400">fast</span>, and{' '}
                            <span className="text-purple-400">private</span>.
                        </p>
                        <p className="text-slate-400 mt-8 text-lg max-w-2xl mx-auto">
                            We believe everyone deserves tools that respect their privacy. 
                            That's why VoteGenerator will always offer a free tier with no strings attached.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try it?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Create your first poll in 30 seconds. No signup required.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                            </a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition">
                                See Examples
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
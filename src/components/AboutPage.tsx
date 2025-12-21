// ============================================================================
// About Page - VoteGenerator
// UPDATED: 7 poll types throughout, 30s to create, correct claims
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Lock, Eye, Mail, Server, Clock, Heart, Sparkles, Globe, Zap, ArrowRight,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// 7 Poll Types
// ============================================================================

const POLL_TYPES = [
    { name: 'Multiple Choice', icon: CheckSquare, description: 'Classic pick one or more options', color: 'blue' },
    { name: 'Ranked Choice', icon: ListOrdered, description: 'Drag to rank options in order', color: 'indigo' },
    { name: 'This or That', icon: ArrowLeftRight, description: 'Quick A vs B comparisons', color: 'orange' },
    { name: 'Meeting Poll', icon: Calendar, description: 'Find the best time for everyone', color: 'amber' },
    { name: 'Rating Scale', icon: SlidersHorizontal, description: 'Rate each option 1-5 stars', color: 'cyan' },
    { name: 'RSVP', icon: Users, description: 'Collect event attendance', color: 'sky' },
    { name: 'Visual Poll', icon: Image, description: 'Vote on images (Pro)', color: 'pink' },
];

// ============================================================================
// Privacy Features
// ============================================================================

const PRIVACY_FEATURES = [
    { icon: Mail, title: 'No Email Required', description: 'Create and vote without providing any personal information.' },
    { icon: Lock, title: 'No Signup Needed', description: 'Start creating polls instantly. No account required.' },
    { icon: Eye, title: 'No Tracking', description: 'We don\'t use tracking cookies or sell your data.' },
    { icon: Server, title: 'Data Minimization', description: 'We only store what\'s necessary for your poll to work.' },
    { icon: Clock, title: 'Auto-Deletion', description: 'Poll data is automatically deleted after retention period.' },
    { icon: ShieldCheck, title: 'Secure Links', description: 'Admin access controlled by unique secure links.' },
];

// ============================================================================
// About Page Component
// ============================================================================

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5" />
                <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                            <Heart size={16} />
                            Built with Privacy in Mind
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            The Privacy-First Polling Platform
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            VoteGenerator makes it easy to create beautiful polls without compromising anyone's privacy.
                            No signups, no tracking, no nonsense.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats - CORRECTED: 7 poll types, 30s */}
            <section className="py-12 bg-white border-y border-slate-200">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-black text-indigo-600">7</div>
                            <div className="text-slate-600 text-sm mt-1">Poll Types</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600">0</div>
                            <div className="text-slate-600 text-sm mt-1">Emails Required</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600">30s</div>
                            <div className="text-slate-600 text-sm mt-1">To Create a Poll</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-indigo-600">∞</div>
                            <div className="text-slate-600 text-sm mt-1">Free Polls</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story - CORRECTED: 7 poll types */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-slate-600">
                        <p>
                            We built VoteGenerator because we were frustrated with existing polling tools. 
                            They all seemed to require email signups, track users, or make simple things unnecessarily complicated.
                        </p>
                        <p>
                            We wanted something different: a polling tool that respects privacy, works instantly, 
                            and doesn't require anyone to create an account just to cast a vote.
                        </p>
                        <p>
                            Today, VoteGenerator offers <strong>7 different poll types</strong> — from simple multiple choice 
                            to advanced ranked voting and visual polls. All with the same commitment to privacy and simplicity 
                            that we started with.
                        </p>
                        <p>
                            Whether you're planning a team lunch, organizing an event, or making important group decisions, 
                            VoteGenerator helps you get answers fast without compromising anyone's privacy.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why We're Different - CORRECTED: 7 poll types */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Built Different</h2>
                        <p className="text-lg text-slate-600">What sets VoteGenerator apart</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="text-emerald-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Creation</h3>
                            <p className="text-slate-600">
                                Create a poll in 30 seconds. No account needed. Choose from 7 poll types, 
                                add your options, and share the link.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <ShieldCheck className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy First</h3>
                            <p className="text-slate-600">
                                No tracking, no data selling, no email harvesting. We believe polling 
                                should be anonymous by default.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <Globe className="text-purple-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Works Everywhere</h3>
                            <p className="text-slate-600">
                                Share via link, QR code, or embed on your site. Works on any device. 
                                Real-time results as votes come in.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7 Poll Types */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">7 Poll Types for Every Need</h2>
                        <p className="text-lg text-slate-600">From quick decisions to complex ranked voting</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {POLL_TYPES.map((type, i) => (
                            <motion.div key={type.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-4">
                                <div className={`w-10 h-10 bg-${type.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <type.icon className={`text-${type.color}-600`} size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{type.name}</h3>
                                    <p className="text-sm text-slate-500">{type.description}</p>
                                </div>
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

            {/* Privacy Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Privacy by Design</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We built VoteGenerator with privacy as a core principle, not an afterthought.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRIVACY_FEATURES.map((feature, i) => (
                            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl p-5 border border-slate-200">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="text-emerald-600" size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your poll?</h2>
                    <p className="text-indigo-100 mb-8">Start free. No signup required. Create unlimited free polls forever.</p>
                    <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
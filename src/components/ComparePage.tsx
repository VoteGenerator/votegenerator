// ============================================================================
// Compare Page - VoteGenerator
// Colorful benefit cards + correct Stripe checkout links
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    Check, Sparkles, ArrowRight, Shield, Zap, Users, Clock, BarChart3,
    Lock, QrCode, Globe, Star, Gift, TrendingUp, Eye,
    CheckCircle, Award
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// Hero Benefits
// ============================================================================

const HeroBenefits: React.FC = () => {
    const benefits = [
        { icon: Lock, title: 'Zero Signup Required', subtitle: 'For creators AND voters', description: 'Create polls instantly without an account. Voters never need to sign up or give their email.', gradient: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', size: 'large', highlight: true },
        { icon: Shield, title: 'Privacy First', subtitle: 'Your data stays yours', description: 'No tracking cookies, no data selling, no email harvesting. Privacy is a right, not a feature.', gradient: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', size: 'large', highlight: true },
        { icon: Zap, title: '30-Second Setup', subtitle: 'Type and share', description: 'No lengthy forms. Just type your question, add options, and get a link instantly.', gradient: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', size: 'medium' },
        { icon: BarChart3, title: '7 Poll Types', subtitle: 'Not just checkboxes', description: 'Multiple Choice, Ranked Choice, This or That, Meeting Poll, Rating Scale, RSVP, and Visual Poll.', gradient: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', size: 'medium' },
        { icon: Globe, title: 'Works Everywhere', subtitle: 'Any device, any browser', description: 'Share via link, QR code, or embed on your website. Mobile-friendly and instant.', gradient: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', size: 'medium' },
        { icon: Eye, title: 'Real-Time Results', subtitle: 'Watch votes come in', description: 'Beautiful charts that update live. Bar charts, pie charts, and table views included.', gradient: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', size: 'medium' },
    ];

    return (
        <section className="py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {benefits.filter(b => b.size === 'large').map((benefit, i) => (
                        <motion.div key={benefit.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`relative overflow-hidden rounded-3xl ${benefit.bgColor} border-2 ${benefit.borderColor} p-8 group hover:shadow-2xl transition-all duration-300`}>
                            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${benefit.gradient} rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition`} />
                            <div className="relative">
                                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                                    <benefit.icon className="text-white" size={32} />
                                </div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{benefit.subtitle}</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3">{benefit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                                {benefit.highlight && (
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm font-medium text-slate-700 shadow-sm">
                                        <CheckCircle size={14} className="text-emerald-500" />Key differentiator
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.filter(b => b.size === 'medium').map((benefit, i) => (
                        <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.05 }}
                            className={`relative overflow-hidden rounded-2xl ${benefit.bgColor} border ${benefit.borderColor} p-6 group hover:shadow-xl transition-all duration-300`}>
                            <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                <benefit.icon className="text-white" size={24} />
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{benefit.subtitle}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// For Creators vs Voters
// ============================================================================

const ForCreatorsVoters: React.FC = () => (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Benefits for Everyone</h2>
                <p className="text-indigo-200">Whether you're creating polls or just voting</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center"><Sparkles className="text-white" size={24} /></div>
                        <div><div className="text-indigo-300 text-sm font-medium">For Poll Creators</div><h3 className="text-xl font-bold text-white">Make Decisions Easy</h3></div>
                    </div>
                    <ul className="space-y-4">
                        {['Create polls in 30 seconds—no account needed', 'Share via link, QR code, or embed code', 'Watch votes come in real-time', 'Export results to CSV, PDF, or PNG', 'Customize themes and branding', 'Set deadlines and response limits', 'Password protect sensitive polls'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/90"><Check className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} /><span>{item}</span></li>
                        ))}
                    </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center"><Users className="text-white" size={24} /></div>
                        <div><div className="text-emerald-300 text-sm font-medium">For Voters</div><h3 className="text-xl font-bold text-white">Vote Without Friction</h3></div>
                    </div>
                    <ul className="space-y-4">
                        {['No account or signup required—ever', 'No email address collected', 'Vote from any device in seconds', 'See results instantly (if allowed)', 'Your data stays private', 'No tracking or cookies', 'Works offline-first on mobile'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/90"><Check className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} /><span>{item}</span></li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </div>
    </section>
);

// ============================================================================
// Pricing Section - With Correct Checkout Links
// ============================================================================

const PricingSection: React.FC = () => (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Fair Pricing</h2>
                <p className="text-lg text-slate-600">One-time payments. No subscriptions.</p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-4"><Gift size={14} /> Forever Free</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Plan</h3>
                        <p className="text-slate-600 mb-6">Everything you need for quick polls</p>
                        <div className="text-4xl font-black text-slate-900 mb-6">$0 <span className="text-lg font-normal text-slate-500">forever</span></div>
                        <ul className="space-y-3 mb-8">
                            {['Unlimited free polls', '50 responses per poll', '7 days active', '6 poll types', 'QR codes & embed', 'Real-time results'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-700"><Check size={18} className="text-emerald-500" />{f}</li>
                            ))}
                        </ul>
                        <a href="/create" className="block w-full py-3 bg-slate-900 text-white font-bold text-center rounded-xl hover:bg-slate-800 transition">Create Free Poll</a>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-10 text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-4"><TrendingUp size={14} /> Premium Plans</div>
                        <h3 className="text-2xl font-bold mb-2">Need More Power?</h3>
                        <p className="text-indigo-100 mb-6">For bigger events and advanced features</p>
                        <div className="space-y-4 mb-8">
                            <a href="/.netlify/functions/vg-checkout?tier=starter" className="block bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">Starter</span>
                                    <span className="text-lg font-bold">$9.99 <span className="text-sm font-normal opacity-80">one-time</span></span>
                                </div>
                                <p className="text-indigo-100 text-sm">500 responses, 30 days, CSV export</p>
                            </a>
                            <a href="/.netlify/functions/vg-checkout?tier=pro_event" className="block bg-white/20 rounded-xl p-4 backdrop-blur-sm ring-2 ring-white/40 hover:bg-white/30 transition">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold flex items-center gap-2">Pro Event <Star size={14} className="text-amber-300" /></span>
                                    <span className="text-lg font-bold">$19.99 <span className="text-sm font-normal opacity-80">one-time</span></span>
                                </div>
                                <p className="text-indigo-100 text-sm">2,000 responses, Visual Poll, PDF export</p>
                            </a>
                            <a href="/.netlify/functions/vg-checkout?tier=unlimited" className="block bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">Unlimited</span>
                                    <span className="text-lg font-bold">$199 <span className="text-sm font-normal opacity-80">for 1 year</span></span>
                                </div>
                                <p className="text-indigo-100 text-sm">Unlimited premium polls, 5K responses each</p>
                            </a>
                        </div>
                        <a href="/pricing" className="block w-full py-3 bg-white text-indigo-700 font-bold text-center rounded-xl hover:bg-indigo-50 transition">
                            View All Features <ArrowRight className="inline ml-1" size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ============================================================================
// Main Compare Page
// ============================================================================

function ComparePage(): React.ReactElement {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero */}
            <section className="py-20 md:py-28">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6"><Award size={16} />Why Teams Choose VoteGenerator</span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Polling That<br /><span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Just Works</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">No signups. No tracking. No friction. Create polls in 30 seconds and share instantly.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/25"><Sparkles size={18} /> Create Free Poll <ArrowRight size={18} /></a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition">See Demo</a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <HeroBenefits />
            <ForCreatorsVoters />
            <PricingSection />

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to try the difference?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Join teams who've switched to simpler, privacy-first polling.</p>
                        <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"><Sparkles size={20} /> Create Free Poll <ArrowRight size={20} /></a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default ComparePage;
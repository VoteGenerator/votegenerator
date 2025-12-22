// ============================================================================
// ComparePage - Why VoteGenerator vs Others + Geo-Aware Pricing
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles, Shield, Zap, Users, Heart, Star, Crown, Globe, Loader2, Lock } from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import { useGeoPricing } from '../geoPricing';

function ComparePage(): React.ReactElement {
    const { loading, currency, prices } = useGeoPricing();

    const benefits = [
        { icon: Lock, title: 'No Signup Required', desc: 'Create polls instantly without email or account', color: 'from-emerald-500 to-teal-500' },
        { icon: Shield, title: 'Privacy First', desc: 'Data stored in links, not on servers you don\'t control', color: 'from-blue-500 to-indigo-500' },
        { icon: Zap, title: 'Under 2 Minutes', desc: 'From idea to shareable poll in seconds', color: 'from-amber-500 to-orange-500' },
        { icon: Heart, title: 'Free Forever', desc: 'Core features always free, pay only when needed', color: 'from-pink-500 to-rose-500' },
    ];

    const competitors = [
        { name: 'Elfster', signup: true, free: 'Limited', privacy: 'Email required', speed: 'Slow' },
        { name: 'Doodle', signup: true, free: 'Ads', privacy: 'Account needed', speed: 'Medium' },
        { name: 'StrawPoll', signup: false, free: 'Yes', privacy: 'Basic', speed: 'Fast' },
        { name: 'VoteGenerator', signup: false, free: 'Yes', privacy: 'Best', speed: 'Fastest', highlight: true },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Hero */}
            <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                    <Shield size={16} /> Why teams choose us
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    The Privacy-First Poll Tool
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto">
                    No signups, no emails, no tracking. Just instant polls.
                </motion.p>
            </div>

            {/* Benefits Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
                            <div className={`w-12 h-12 bg-gradient-to-br ${b.color} rounded-xl flex items-center justify-center mb-4`}>
                                <b.icon className="text-white" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{b.title}</h3>
                            <p className="text-slate-600 text-sm">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">How We Compare</h2>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-slate-200 bg-slate-100">
                                <th className="py-4 px-6 text-left text-sm font-bold text-slate-900">Tool</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">No Signup</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Free</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Privacy</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-slate-700">Speed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {competitors.map((c, i) => (
                                <tr key={i} className={`border-b border-slate-100 ${c.highlight ? 'bg-indigo-50' : ''}`}>
                                    <td className={`py-4 px-6 font-medium ${c.highlight ? 'text-indigo-700' : 'text-slate-900'}`}>
                                        {c.highlight && <Star className="inline mr-2 text-amber-500" size={16} />}{c.name}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {!c.signup ? <Check className="inline text-emerald-600" size={20} /> : <X className="inline text-slate-400" size={20} />}
                                    </td>
                                    <td className="py-4 px-4 text-center text-sm text-slate-600">{c.free}</td>
                                    <td className="py-4 px-4 text-center text-sm text-slate-600">{c.privacy}</td>
                                    <td className="py-4 px-4 text-center text-sm text-slate-600">{c.speed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pricing with Geo */}
            <div className="bg-slate-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Simple Pricing</h2>
                        <p className="text-slate-600">One-time payments. No subscriptions.</p>
                        <div className="mt-4 flex items-center justify-center">
                            {loading ? (
                                <span className="flex items-center gap-2 text-sm text-slate-500"><Loader2 size={14} className="animate-spin" /> Loading...</span>
                            ) : (
                                <span className="flex items-center gap-2 text-sm text-slate-600 px-3 py-1 bg-white rounded-full border">
                                    <Globe size={14} /> Prices in <strong>{currency}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4"><Users className="text-slate-600" size={20} /></div>
                            <h3 className="text-lg font-bold text-slate-900">Free</h3>
                            <div className="text-3xl font-bold text-slate-900 my-2">$0</div>
                            <p className="text-slate-500 text-sm mb-4">50 responses • 7 days</p>
                            <a href="/create" className="block w-full py-2 bg-slate-800 text-white text-center rounded-lg font-medium hover:bg-slate-900 transition">Start Free</a>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border-2 border-purple-500 shadow-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">Most Popular</div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4"><Crown className="text-purple-600" size={20} /></div>
                            <h3 className="text-lg font-bold text-slate-900">Pro Event</h3>
                            <div className="my-2">
                                {loading ? <span className="text-3xl font-bold text-slate-300">...</span> : <><span className="text-3xl font-bold text-slate-900">{prices.symbol}{prices.proEvent}</span><span className="text-slate-500 ml-1">{currency}</span></>}
                            </div>
                            <p className="text-slate-500 text-sm mb-4">2,000 responses • 60 days</p>
                            <a href="/.netlify/functions/vg-checkout?tier=pro_event" className="block w-full py-2 bg-purple-600 text-white text-center rounded-lg font-medium hover:bg-purple-700 transition">Get Pro Event</a>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4"><Star className="text-amber-600" size={20} /></div>
                            <h3 className="text-lg font-bold text-slate-900">Unlimited</h3>
                            <div className="my-2">
                                {loading ? <span className="text-3xl font-bold text-slate-300">...</span> : <><span className="text-3xl font-bold text-slate-900">{prices.symbol}{prices.unlimited}</span><span className="text-slate-500 ml-1">{currency}</span></>}
                            </div>
                            <p className="text-slate-500 text-sm mb-4">Unlimited polls • 1 year</p>
                            <a href="/.netlify/functions/vg-checkout?tier=unlimited" className="block w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition">Get Unlimited</a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to try it?</h2>
                    <p className="text-slate-600 mb-8">Create your first poll in under 2 minutes.</p>
                    <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ComparePage;
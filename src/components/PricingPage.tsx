// ============================================================================
// PricingPage - Geo-Aware with Simple Stripe Links
// Stripe automatically detects user currency at checkout
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Users, HelpCircle, BarChart3, Clock, ArrowRight, Star, ChevronDown, Sparkles, Shield, BadgeCheck, CreditCard, Loader2, Share2, Palette, CheckSquare, Globe } from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import { useGeoPricing } from '../geoPricing';

// Feature comparison data
const FEATURE_COMPARISON = [
    {
        category: 'Limits', icon: BarChart3, color: 'indigo',
        features: [
            { name: 'Responses per poll', free: '50', starter: '500', proEvent: '2,000', unlimited: '5,000' },
            { name: 'Poll duration', free: '7 days', starter: '30 days', proEvent: '60 days', unlimited: '1 year' },
            { name: 'Premium polls', free: '—', starter: '1', proEvent: '1', unlimited: 'Unlimited' },
        ],
    },
    {
        category: 'Poll Types', icon: CheckSquare, color: 'emerald',
        features: [
            { name: 'Multiple Choice', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Ranked Choice', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Visual Poll (images)', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Export', icon: Share2, color: 'blue',
        features: [
            { name: 'Export CSV', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Export PDF & PNG', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Customization', icon: Palette, color: 'pink',
        features: [
            { name: 'Remove branding', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Custom short link', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
];

const FeatureCell: React.FC<{ value: boolean | string }> = ({ value }) => {
    if (typeof value === 'boolean') {
        return value 
            ? <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><Check className="text-emerald-600" size={14} /></div>
            : <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><X className="text-slate-400" size={14} /></div>;
    }
    return <span className="text-slate-700 text-sm font-semibold">{value}</span>;
};

function PricingPage(): React.ReactElement {
    const [showComparison, setShowComparison] = useState(false);
    const { loading, currency, prices } = useGeoPricing();

    const TIERS = [
        {
            id: 'free', name: 'Free', tagline: 'No credit card required', price: 0, icon: Users, color: 'slate',
            cta: 'Create Free Poll', ctaLink: '/create', badge: 'Forever Free',
            features: { responses: '50 responses', duration: '7 days active', polls: 'Unlimited free polls',
                highlights: ['6 free poll types', 'QR code sharing', 'Real-time results', 'Embed on your site'] },
        },
        {
            id: 'starter', name: 'Starter', tagline: 'For your next event', price: prices.starter, icon: Zap, color: 'blue',
            cta: 'Get Starter', ctaLink: '/.netlify/functions/vg-checkout?tier=starter', badge: 'One-Time Payment',
            features: { responses: '500 responses', duration: '30 days active', polls: '1 premium poll',
                highlights: ['Everything in Free', 'Export to CSV', 'Device breakdown stats', '90-day data retention'] },
        },
        {
            id: 'pro_event', name: 'Pro Event', tagline: 'For important events', price: prices.proEvent, popular: true, icon: Crown, color: 'purple',
            cta: 'Get Pro Event', ctaLink: '/.netlify/functions/vg-checkout?tier=pro_event', badge: 'One-Time Payment',
            features: { responses: '2,000 responses', duration: '60 days active', polls: '1 premium poll',
                highlights: ['Everything in Starter', 'Visual Poll (images)', 'Export PDF & PNG', 'Remove VG branding', 'Custom short link'] },
        },
        {
            id: 'unlimited', name: 'Unlimited', tagline: 'For power users', price: prices.unlimited, periodNote: '1 year access', icon: Star, color: 'amber',
            cta: 'Get Unlimited', ctaLink: '/.netlify/functions/vg-checkout?tier=unlimited', badge: 'Best Value',
            features: { responses: '5,000 per poll', duration: '1 year per poll', polls: 'Unlimited premium polls',
                highlights: ['Everything in Pro Event', 'Unlimited premium polls', 'Upload your logo', 'Priority support'] },
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; button: string }> = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900 text-white' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', button: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                    <Shield size={16} /> No signup required • Privacy-first
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    Simple, Transparent Pricing
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">
                    Start free. Pay only when you need more.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                    <BadgeCheck className="text-emerald-600" size={24} />
                    <div className="text-left">
                        <p className="text-emerald-900 font-bold">All Paid Plans Are One-Time Payments</p>
                        <p className="text-emerald-700 text-sm">No subscriptions. No recurring charges.</p>
                    </div>
                </motion.div>

                {/* Currency indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    {loading ? (
                        <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Detecting location...</span>
                    ) : (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                            <Globe size={14} /> Prices in <strong>{currency}</strong>
                        </span>
                    )}
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TIERS.map((tier, index) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;
                        return (
                            <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}
                                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'} bg-white overflow-hidden flex flex-col`}>
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                        <Star className="inline-block mr-1" size={14} /> Most Popular
                                    </div>
                                )}
                                <div className={`p-6 flex-1 flex flex-col ${tier.popular ? 'pt-12' : ''}`}>
                                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${tier.id === 'unlimited' ? 'bg-amber-100 text-amber-700' : tier.id === 'free' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                                        <CreditCard size={10} className="inline mr-1" />{tier.badge}
                                    </span>
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{tier.tagline}</p>
                                    <div className="mt-4 mb-2">
                                        {tier.price === 0 ? (
                                            <span className="text-4xl font-bold text-slate-900">Free</span>
                                        ) : loading ? (
                                            <span className="text-4xl font-bold text-slate-300">...</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-slate-900">{prices.symbol}{tier.price % 1 === 0 ? tier.price : tier.price.toFixed(2)}</span>
                                                <span className="text-slate-500 text-sm ml-1">{currency}</span>
                                            </>
                                        )}
                                    </div>
                                    {tier.periodNote && <p className="text-xs text-amber-600 font-medium mb-2">{tier.periodNote}</p>}
                                    <div className="space-y-2 my-4 py-4 border-y border-slate-100">
                                        <div className="flex items-center gap-2 text-sm"><Users size={16} className="text-slate-400" /><span className="text-slate-600">{tier.features.responses}</span></div>
                                        <div className="flex items-center gap-2 text-sm"><Clock size={16} className="text-slate-400" /><span className="text-slate-600">{tier.features.duration}</span></div>
                                        <div className="flex items-center gap-2 text-sm"><BarChart3 size={16} className="text-slate-400" /><span className="text-slate-600">{tier.features.polls}</span></div>
                                    </div>
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {tier.features.highlights.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />{feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <a href={tier.ctaLink} className={`w-full py-3 ${colors.button} font-medium rounded-xl transition flex items-center justify-center gap-2`}>
                                        {tier.cta} <ArrowRight size={18} />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Feature Comparison Toggle */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <button onClick={() => setShowComparison(!showComparison)}
                    className="w-full py-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl font-semibold text-indigo-700 transition flex items-center justify-center gap-2">
                    {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
                    <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
                </button>
            </div>

            {showComparison && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 pb-16">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 bg-slate-100">
                                        <th className="py-4 px-6 text-left text-sm font-bold text-slate-900 min-w-[200px]">Feature</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700 w-24">Free</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-blue-700 w-24 bg-blue-50">Starter</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-purple-700 w-24 bg-purple-50">Pro Event</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-amber-700 w-24 bg-amber-50">Unlimited</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FEATURE_COMPARISON.map((section, si) => (
                                        <React.Fragment key={si}>
                                            <tr className="bg-slate-50">
                                                <td colSpan={5} className="py-2 px-6 text-xs font-bold text-slate-500 uppercase">{section.category}</td>
                                            </tr>
                                            {section.features.map((f, fi) => (
                                                <tr key={fi} className="border-b border-slate-100">
                                                    <td className="py-3 px-6 text-sm text-slate-700">{f.name}</td>
                                                    <td className="py-3 px-4 text-center"><FeatureCell value={f.free} /></td>
                                                    <td className="py-3 px-4 text-center bg-blue-50/30"><FeatureCell value={f.starter} /></td>
                                                    <td className="py-3 px-4 text-center bg-purple-50/30"><FeatureCell value={f.proEvent} /></td>
                                                    <td className="py-3 px-4 text-center bg-amber-50/30"><FeatureCell value={f.unlimited} /></td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* FAQ */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'Are these really one-time payments?', a: 'Yes! Starter, Pro Event, and Unlimited are all one-time payments. No subscriptions, no recurring charges.' },
                        { q: 'What currency will I be charged in?', a: `Prices are shown in ${currency}. Stripe handles the checkout in your local currency automatically.` },
                        { q: 'Do I need to create an account?', a: 'Nope! VoteGenerator is privacy-first. No signup, no email required.' },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50">
                                {faq.q}<ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your poll?</h2>
                    <p className="text-indigo-100 mb-8">Start free. No credit card required.</p>
                    <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PricingPage;
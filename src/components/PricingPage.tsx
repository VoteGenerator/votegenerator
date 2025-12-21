// ============================================================================
// VoteGenerator - Pricing Page
// INCLUDES: PromoBanner at top, tooltips, correct free tier (50 responses)
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Zap, Crown, Users, HelpCircle, BarChart3, Clock, ArrowRight, Star, 
    ChevronDown, Sparkles, Shield, BadgeCheck, CreditCard
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

// ============================================================================
// Pricing Tiers
// ============================================================================

interface PricingTier {
    id: string;
    name: string;
    tagline: string;
    price: number;
    period: 'free' | 'one-time' | 'year';
    popular?: boolean;
    icon: React.ElementType;
    color: string;
    cta: string;
    ctaLink: string;
    features: { responses: string; duration: string; polls: string; highlights: string[] };
}

const TIERS: PricingTier[] = [
    {
        id: 'free', name: 'Free', tagline: 'No credit card required', price: 0, period: 'free', icon: Users, color: 'slate',
        cta: 'Create Free Poll', ctaLink: '/create',
        features: {
            responses: '50 responses', duration: '7 days', polls: 'Unlimited',
            highlights: ['6 free poll types', 'Multiple Choice', 'Ranked Choice', 'This or That', 'Meeting Poll', 'Rating Scale', 'RSVP', 'QR code sharing', 'Real-time results', 'Embed on your site'],
        },
    },
    {
        id: 'starter', name: 'Starter', tagline: 'For your next event', price: 9.99, period: 'one-time', icon: Zap, color: 'blue',
        cta: 'Get Starter', ctaLink: '/checkout?tier=starter',
        features: {
            responses: '500 responses', duration: '30 days', polls: '1 poll',
            highlights: ['Everything in Free, plus:', 'Export to CSV', 'Duplicate your poll', 'Device breakdown stats', 'Geographic breakdown', '90-day data retention'],
        },
    },
    {
        id: 'pro_event', name: 'Pro Event', tagline: 'For important events', price: 19.99, period: 'one-time', popular: true, icon: Crown, color: 'purple',
        cta: 'Get Pro Event', ctaLink: '/checkout?tier=pro_event',
        features: {
            responses: '2,000 responses', duration: '60 days', polls: '1 poll',
            highlights: ['Everything in Starter, plus:', 'Visual Poll (images)', 'Export PDF & PNG', 'Custom short link', 'Remove VG branding', 'Password protection', 'Schedule open/close', '1-year data retention'],
        },
    },
    {
        id: 'unlimited', name: 'Unlimited', tagline: 'For power users', price: 199, period: 'year', icon: Star, color: 'amber',
        cta: 'Get Unlimited', ctaLink: '/checkout?tier=unlimited',
        features: {
            responses: '5,000 per poll', duration: '1 year each', polls: 'Unlimited polls',
            highlights: ['Everything in Pro Event, plus:', 'Unlimited polls', 'Upload your logo', 'Email notifications', 'Access codes', 'Priority support', '2-year data retention'],
        },
    },
];

// ============================================================================
// Feature Comparison with Tooltips
// ============================================================================

interface FeatureRow {
    name: string;
    tooltip: string;
    free: boolean | string;
    starter: boolean | string;
    proEvent: boolean | string;
    unlimited: boolean | string;
}

const FEATURE_COMPARISON: { category: string; features: FeatureRow[] }[] = [
    {
        category: 'Limits',
        features: [
            { name: 'Responses per poll', tooltip: 'How many people can vote on your poll', free: '50', starter: '500', proEvent: '2,000', unlimited: '5,000' },
            { name: 'Poll duration', tooltip: 'How long your poll stays active', free: '7 days', starter: '30 days', proEvent: '60 days', unlimited: '1 year' },
            { name: 'Number of polls', tooltip: 'How many separate polls you can create', free: 'Unlimited', starter: '1', proEvent: '1', unlimited: 'Unlimited' },
            { name: 'Data retention', tooltip: 'How long we keep your results', free: '30 days', starter: '90 days', proEvent: '1 year', unlimited: '2 years' },
        ],
    },
    {
        category: 'Poll Types',
        features: [
            { name: 'Multiple Choice', tooltip: 'Classic pick one or more options', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Ranked Choice', tooltip: 'Drag to rank options in order', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'This or That', tooltip: 'Quick A vs B comparisons', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Meeting Poll', tooltip: 'Find the best time for everyone', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Rating Scale', tooltip: 'Rate each option 1-5 stars', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'RSVP', tooltip: 'Collect Yes/No/Maybe attendance', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Visual Poll', tooltip: 'Upload images and let people vote visually', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Sharing & Export',
        features: [
            { name: 'QR Code', tooltip: 'Auto-generated QR code for your poll', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Shareable link', tooltip: 'Easy link to share via text, email, social', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Embed on website', tooltip: 'Copy/paste code to add poll to your site', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Export to CSV', tooltip: 'Download results as spreadsheet', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Export to PDF', tooltip: 'Download formatted PDF report', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Export to PNG', tooltip: 'Download results as image', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Analytics',
        features: [
            { name: 'Real-time results', tooltip: 'See votes come in live', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Device breakdown', tooltip: 'See mobile vs desktop votes', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Geographic breakdown', tooltip: 'See where votes come from', free: false, starter: true, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Customization',
        features: [
            { name: 'Custom short link', tooltip: 'Get a memorable URL like /p/my-poll', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Remove VG branding', tooltip: 'Hide "Powered by VoteGenerator"', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Upload your logo', tooltip: 'Add your company logo', free: false, starter: false, proEvent: false, unlimited: true },
        ],
    },
    {
        category: 'Admin & Security',
        features: [
            { name: 'Duplicate poll', tooltip: 'Clone poll to reuse with fresh votes', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Password protection', tooltip: 'Require password to view/vote', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Schedule polls', tooltip: 'Set future start and end times', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Access codes', tooltip: 'Give each voter a unique code', free: false, starter: false, proEvent: false, unlimited: true },
            { name: 'Email notifications', tooltip: 'Get notified about votes', free: false, starter: false, proEvent: false, unlimited: true },
        ],
    },
];

// ============================================================================
// Components
// ============================================================================

const FeatureCell: React.FC<{ value: boolean | string }> = ({ value }) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="text-emerald-500 mx-auto" size={20} /> : <X className="text-slate-300 mx-auto" size={20} />;
    }
    return <span className="text-slate-700 text-sm font-medium">{value}</span>;
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="group relative inline-flex items-center gap-1 cursor-help">
        {children}
        <HelpCircle size={14} className="text-slate-400 group-hover:text-indigo-500 transition" />
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-52 text-center leading-relaxed shadow-xl">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
        </div>
    </div>
);

// ============================================================================
// Main Pricing Page
// ============================================================================

const PricingPage: React.FC = () => {
    const [showComparison, setShowComparison] = useState(false);

    const colorClasses: Record<string, { bg: string; text: string; button: string }> = {
        slate: { bg: 'bg-slate-50', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900 text-white' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* PROMO BANNER AT TOP */}
            <PromoBanner />
            <NavHeader />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
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

                {/* ONE-TIME emphasis */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <BadgeCheck className="text-emerald-600" size={24} />
                    <div className="text-left">
                        <p className="text-emerald-900 font-semibold">One-Time Payment • Not a Subscription</p>
                        <p className="text-emerald-700 text-sm">Pay once for your poll. No recurring charges.</p>
                    </div>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TIERS.map((tier, index) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;

                        return (
                            <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}
                                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl shadow-purple-100' : 'border-slate-200'} bg-white overflow-hidden flex flex-col`}>
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                        <Star className="inline-block mr-1" size={14} /> Best Value
                                    </div>
                                )}

                                <div className={`p-6 flex-1 flex flex-col ${tier.popular ? 'pt-12' : ''}`}>
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{tier.tagline}</p>

                                    <div className="mt-4 mb-2">
                                        <span className="text-4xl font-bold text-slate-900">{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
                                        {tier.period === 'one-time' && (
                                            <div className="inline-flex items-center gap-1 mt-2 ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                <CreditCard size={12} /> One-time
                                            </div>
                                        )}
                                        {tier.period === 'year' && (
                                            <span className="text-slate-500 text-sm ml-1">/year</span>
                                        )}
                                    </div>

                                    <div className="space-y-2 my-4 py-4 border-y border-slate-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{tier.features.responses}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{tier.features.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <BarChart3 size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{tier.features.polls}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6 flex-1">
                                        {tier.features.highlights.map((feature, i) => (
                                            <li key={i} className={`flex items-start gap-2 text-sm ${i === 0 && tier.id !== 'free' ? 'font-medium text-slate-700' : 'text-slate-600'}`}>
                                                {i === 0 && tier.id !== 'free' ? <ArrowRight size={16} className="text-slate-400 flex-shrink-0 mt-0.5" /> : <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />}
                                                <span>{feature}</span>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <button onClick={() => setShowComparison(!showComparison)}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition flex items-center justify-center gap-2">
                    {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
                    <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
                </button>
            </div>

            {/* Feature Comparison Table */}
            {showComparison && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900 min-w-[200px]">Feature</th>
                                        <th className="py-4 px-4 text-center text-sm font-semibold text-slate-900 w-24">Free</th>
                                        <th className="py-4 px-4 text-center text-sm font-semibold text-blue-700 w-24">Starter</th>
                                        <th className="py-4 px-4 text-center text-sm font-semibold text-purple-700 w-24 bg-purple-50">Pro Event</th>
                                        <th className="py-4 px-4 text-center text-sm font-semibold text-amber-700 w-24">Unlimited</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FEATURE_COMPARISON.map((section, sectionIndex) => (
                                        <React.Fragment key={sectionIndex}>
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={5} className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">{section.category}</td>
                                            </tr>
                                            {section.features.map((feature, featureIndex) => (
                                                <tr key={featureIndex} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                                    <td className="py-3 px-6">
                                                        <Tooltip content={feature.tooltip}>
                                                            <span className="text-sm text-slate-700">{feature.name}</span>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="py-3 px-4 text-center"><FeatureCell value={feature.free} /></td>
                                                    <td className="py-3 px-4 text-center"><FeatureCell value={feature.starter} /></td>
                                                    <td className="py-3 px-4 text-center bg-purple-50/30"><FeatureCell value={feature.proEvent} /></td>
                                                    <td className="py-3 px-4 text-center"><FeatureCell value={feature.unlimited} /></td>
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'Is this really a one-time payment?', a: 'Yes! Starter ($9.99) and Pro Event ($19.99) are one-time payments. No subscriptions, no recurring charges. The only exception is Unlimited ($199/year) which gives you unlimited polls for a full year.' },
                        { q: 'How many free responses do I get?', a: 'Free polls allow up to 50 responses each. You can create unlimited free polls. Need more responses? Upgrade to Starter (500) or Pro Event (2,000).' },
                        { q: 'Can I upgrade a free poll later?', a: 'Yes! You can upgrade any poll at any time. Your existing votes are preserved. Just click "Upgrade" in your poll dashboard.' },
                        { q: 'Do I need to create an account?', a: 'Nope! VoteGenerator is privacy-first. No signup, no email required. You get a secret admin link to manage your poll.' },
                        { q: 'What if I set a deadline longer than my tier allows?', a: 'The poll will automatically close at your tier\'s maximum duration (7 days for free, 30 for Starter, 60 for Pro Event). Upgrade to extend.' },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50 transition">
                                {faq.q}
                                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} />
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
                    <p className="text-indigo-100 mb-8">Start free. No credit card required. Upgrade anytime.</p>
                    <a href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                        <Sparkles size={20} /> Create Free Poll <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PricingPage;
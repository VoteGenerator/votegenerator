// ============================================================================
// VoteGenerator - Pricing Page
// FIXED: Tooltips, colored sections, badges, clearer pricing
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Zap, Crown, Users, HelpCircle, BarChart3, Clock, ArrowRight, Star, 
    ChevronDown, Sparkles, Shield, BadgeCheck, CreditCard, RefreshCw
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
    badge?: string;
    features: { responses: string; duration: string; polls: string; highlights: string[] };
}

const TIERS: PricingTier[] = [
    {
        id: 'free', name: 'Free', tagline: 'No credit card required', price: 0, period: 'free', icon: Users, color: 'slate',
        cta: 'Create Free Poll', ctaLink: '/create', badge: 'Forever Free',
        features: {
            responses: '50 responses', duration: '7 days active', polls: 'Unlimited free polls',
            highlights: ['6 free poll types', 'Multiple Choice', 'Ranked Choice', 'This or That', 'Meeting Poll', 'Rating Scale', 'RSVP', 'QR code sharing', 'Real-time results', 'Embed on your site'],
        },
    },
    {
        id: 'starter', name: 'Starter', tagline: 'For your next event', price: 9.99, period: 'one-time', icon: Zap, color: 'blue',
        cta: 'Get Starter', ctaLink: '/checkout?tier=starter', badge: 'One-Time',
        features: {
            responses: '500 responses', duration: '30 days active', polls: '1 premium poll',
            highlights: ['Everything in Free, plus:', 'Export to CSV', 'Duplicate your poll', 'Device breakdown stats', 'Geographic breakdown', '90-day data retention'],
        },
    },
    {
        id: 'pro_event', name: 'Pro Event', tagline: 'For important events', price: 19.99, period: 'one-time', popular: true, icon: Crown, color: 'purple',
        cta: 'Get Pro Event', ctaLink: '/checkout?tier=pro_event', badge: 'One-Time',
        features: {
            responses: '2,000 responses', duration: '60 days active', polls: '1 premium poll',
            highlights: ['Everything in Starter, plus:', 'Visual Poll (images)', 'Export PDF & PNG', 'Custom short link', 'Remove VG branding', 'Password protection', 'Schedule open/close', '1-year data retention'],
        },
    },
    {
        id: 'unlimited', name: 'Unlimited', tagline: 'For power users', price: 199, period: 'year', icon: Star, color: 'amber',
        cta: 'Get Unlimited', ctaLink: '/checkout?tier=unlimited', badge: 'Annual',
        features: {
            responses: '5,000 per poll', duration: '1 year per poll', polls: 'Unlimited premium polls',
            highlights: ['Everything in Pro Event, plus:', 'Unlimited premium polls', 'Upload your logo', 'Email notifications', 'Access codes', 'Priority support', '2-year data retention'],
        },
    },
];

// ============================================================================
// Feature Comparison with proper tooltips
// ============================================================================

interface FeatureRow {
    name: string;
    tooltip: string;
    free: boolean | string;
    starter: boolean | string;
    proEvent: boolean | string;
    unlimited: boolean | string;
}

const FEATURE_COMPARISON: { category: string; icon: React.ElementType; color: string; features: FeatureRow[] }[] = [
    {
        category: 'Limits & Quotas',
        icon: BarChart3,
        color: 'indigo',
        features: [
            { name: 'Responses per poll', tooltip: 'Maximum number of votes each poll can receive', free: '50', starter: '500', proEvent: '2,000', unlimited: '5,000' },
            { name: 'Poll duration', tooltip: 'How long your poll stays open for voting', free: '7 days', starter: '30 days', proEvent: '60 days', unlimited: '1 year' },
            { name: 'Premium polls in dashboard', tooltip: 'Number of paid polls you can manage. Free polls are always unlimited!', free: '—', starter: '1', proEvent: '1', unlimited: 'Unlimited' },
            { name: 'Data retention', tooltip: 'How long we store your poll data and results after closing', free: '30 days', starter: '90 days', proEvent: '1 year', unlimited: '2 years' },
        ],
    },
    {
        category: 'Poll Types',
        icon: CheckSquare,
        color: 'emerald',
        features: [
            { name: 'Multiple Choice', tooltip: 'Classic poll where voters pick one or more options', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Ranked Choice', tooltip: 'Voters drag to rank options in their preferred order', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'This or That', tooltip: 'Quick A vs B comparisons for fast decisions', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Meeting Poll', tooltip: 'Find the best time - like Doodle but simpler', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Rating Scale', tooltip: 'Voters rate each option from 1-5 stars', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'RSVP', tooltip: 'Collect Yes/No/Maybe responses for events', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Visual Poll', tooltip: 'Upload images and let people vote visually', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Sharing & Export',
        icon: Share2,
        color: 'blue',
        features: [
            { name: 'QR Code', tooltip: 'Auto-generated QR code for easy sharing at events', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Shareable link', tooltip: 'Simple link to share via text, email, or social media', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Embed on website', tooltip: 'Copy/paste code to add your poll to any website', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Export to CSV', tooltip: 'Download all results as a spreadsheet file', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Export to PDF', tooltip: 'Download a formatted PDF report of results', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Export to PNG', tooltip: 'Download results as an image to share anywhere', free: false, starter: false, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Analytics',
        icon: BarChart3,
        color: 'purple',
        features: [
            { name: 'Real-time results', tooltip: 'Watch votes appear instantly as people vote', free: true, starter: true, proEvent: true, unlimited: true },
            { name: 'Device breakdown', tooltip: 'See how many voted from mobile, desktop, or tablet', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Geographic breakdown', tooltip: 'See which countries and regions votes came from', free: false, starter: true, proEvent: true, unlimited: true },
        ],
    },
    {
        category: 'Customization',
        icon: Palette,
        color: 'pink',
        features: [
            { name: 'Custom short link', tooltip: 'Get a memorable URL like votegenerator.com/p/my-poll', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Remove VG branding', tooltip: 'Hide the "Powered by VoteGenerator" footer', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Upload your logo', tooltip: 'Add your company logo to the poll header', free: false, starter: false, proEvent: false, unlimited: true },
        ],
    },
    {
        category: 'Security & Admin',
        icon: Shield,
        color: 'amber',
        features: [
            { name: 'Duplicate poll', tooltip: 'Clone an existing poll to reuse with fresh votes', free: false, starter: true, proEvent: true, unlimited: true },
            { name: 'Password protection', tooltip: 'Require a password to view and vote on your poll', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Schedule polls', tooltip: 'Set automatic open and close dates in advance', free: false, starter: false, proEvent: true, unlimited: true },
            { name: 'Access codes', tooltip: 'Generate unique codes for each voter to prevent duplicates', free: false, starter: false, proEvent: false, unlimited: true },
            { name: 'Email notifications', tooltip: 'Get notified when someone votes on your poll', free: false, starter: false, proEvent: false, unlimited: true },
        ],
    },
];

// Missing imports
import { Share2, Palette, CheckSquare } from 'lucide-react';

// ============================================================================
// Components
// ============================================================================

const FeatureCell: React.FC<{ value: boolean | string }> = ({ value }) => {
    if (typeof value === 'boolean') {
        return value 
            ? <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><Check className="text-emerald-600" size={14} /></div>
            : <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><X className="text-slate-400" size={14} /></div>;
    }
    return <span className="text-slate-700 text-sm font-semibold">{value}</span>;
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
    <div className="group relative inline-flex items-center gap-1.5 cursor-help">
        {children}
        <HelpCircle size={14} className="text-slate-400 group-hover:text-indigo-500 transition flex-shrink-0" />
        {/* Tooltip positioned to the right on smaller screens, centered on larger */}
        <div className="absolute z-[100] left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 leading-relaxed shadow-xl pointer-events-none">
            {content}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900" />
        </div>
    </div>
);

// ============================================================================
// Main Pricing Page
// ============================================================================

const PricingPage: React.FC = () => {
    const [showComparison, setShowComparison] = useState(false);

    const colorClasses: Record<string, { bg: string; text: string; button: string; light: string }> = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900 text-white', light: 'bg-slate-50' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white', light: 'bg-blue-50' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white', light: 'bg-purple-50' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white', light: 'bg-amber-50' },
    };

    const sectionColors: Record<string, { bg: string; badge: string; text: string }> = {
        indigo: { bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700' },
        emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700' },
        blue: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
        purple: { bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700', text: 'text-purple-700' },
        pink: { bg: 'bg-pink-50', badge: 'bg-pink-100 text-pink-700', text: 'text-pink-700' },
        amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-700' },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

                {/* Payment type badges */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <BadgeCheck className="text-emerald-600" size={20} />
                        <div className="text-left">
                            <p className="text-emerald-900 font-semibold text-sm">One-Time Payment</p>
                            <p className="text-emerald-700 text-xs">Starter & Pro Event</p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                        <RefreshCw className="text-amber-600" size={20} />
                        <div className="text-left">
                            <p className="text-amber-900 font-semibold text-sm">Annual Subscription</p>
                            <p className="text-amber-700 text-xs">Unlimited only</p>
                        </div>
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
                                    {/* Badge */}
                                    {tier.badge && (
                                        <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${
                                            tier.period === 'year' ? 'bg-amber-100 text-amber-700' : tier.period === 'one-time' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {tier.period === 'year' && <RefreshCw size={10} className="inline mr-1" />}
                                            {tier.period === 'one-time' && <CreditCard size={10} className="inline mr-1" />}
                                            {tier.badge}
                                        </span>
                                    )}
                                    
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{tier.tagline}</p>

                                    <div className="mt-4 mb-2">
                                        <span className="text-4xl font-bold text-slate-900">{tier.price === 0 ? 'Free' : `$${tier.price}`}</span>
                                        {tier.period === 'year' && <span className="text-slate-500 text-sm ml-1">/year</span>}
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
                    className="w-full py-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl font-semibold text-indigo-700 transition flex items-center justify-center gap-2">
                    {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
                    <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
                </button>
            </div>

            {/* Feature Comparison Table - Colorful sections */}
            {showComparison && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 bg-slate-100">
                                        <th className="py-4 px-6 text-left text-sm font-bold text-slate-900 min-w-[220px]">Feature</th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-slate-700 w-24">
                                            <span className="block">Free</span>
                                            <span className="text-xs font-normal text-slate-500">$0</span>
                                        </th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-blue-700 w-24 bg-blue-50">
                                            <span className="block">Starter</span>
                                            <span className="text-xs font-normal">$9.99</span>
                                        </th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-purple-700 w-24 bg-purple-50">
                                            <span className="block">Pro Event</span>
                                            <span className="text-xs font-normal">$19.99</span>
                                        </th>
                                        <th className="py-4 px-4 text-center text-sm font-bold text-amber-700 w-24 bg-amber-50">
                                            <span className="block">Unlimited</span>
                                            <span className="text-xs font-normal">$199/yr</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FEATURE_COMPARISON.map((section, sectionIndex) => {
                                        const sectionColor = sectionColors[section.color];
                                        const SectionIcon = section.icon;
                                        return (
                                            <React.Fragment key={sectionIndex}>
                                                <tr className={sectionColor.bg}>
                                                    <td colSpan={5} className="py-3 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sectionColor.badge}`}>
                                                                <SectionIcon size={12} />
                                                                {section.category}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {section.features.map((feature, featureIndex) => (
                                                    <tr key={featureIndex} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                                        <td className="py-3 px-6">
                                                            <Tooltip content={feature.tooltip}>
                                                                <span className="text-sm text-slate-700">{feature.name}</span>
                                                            </Tooltip>
                                                        </td>
                                                        <td className="py-3 px-4 text-center"><FeatureCell value={feature.free} /></td>
                                                        <td className="py-3 px-4 text-center bg-blue-50/30"><FeatureCell value={feature.starter} /></td>
                                                        <td className="py-3 px-4 text-center bg-purple-50/30"><FeatureCell value={feature.proEvent} /></td>
                                                        <td className="py-3 px-4 text-center bg-amber-50/30"><FeatureCell value={feature.unlimited} /></td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
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
                        { q: 'What\'s the difference between one-time and annual?', a: 'Starter ($9.99) and Pro Event ($19.99) are one-time payments for a single poll. Pay once, use it until it expires. Unlimited ($199/year) is an annual subscription that gives you unlimited premium polls for a full year—perfect for teams or frequent users.' },
                        { q: 'How many free responses do I get?', a: 'Free polls allow up to 50 responses each. You can create unlimited free polls! Need more responses on a single poll? Upgrade to Starter (500), Pro Event (2,000), or Unlimited (5,000 per poll).' },
                        { q: 'What does "1 premium poll" mean?', a: 'When you buy Starter or Pro Event, you get enhanced features for ONE poll. Your free polls remain unlimited. The premium poll gets extra responses, longer duration, exports, and more. Need multiple premium polls? Get Unlimited!' },
                        { q: 'Can I upgrade a free poll later?', a: 'Yes! You can upgrade any poll at any time. Your existing votes are preserved. Just click "Upgrade" in your poll dashboard.' },
                        { q: 'Do I need to create an account?', a: 'Nope! VoteGenerator is privacy-first. No signup, no email required. You get a secret admin link to manage your poll.' },
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
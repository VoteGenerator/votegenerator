// ============================================================================
// PricingPage - Subscription-based pricing with Monthly/Annual toggle
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, X, Zap, Crown, Users, BarChart3, Clock, ArrowRight, Star, 
    ChevronDown, Sparkles, Shield, BadgeCheck, Lock, Download, Timer
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// =============================================================================
// PRICING CONFIGURATION - Easy to update
// =============================================================================
const PRICING = {
    pro: {
        monthly: 19,
        annual: 190, // 10 months (2 months free)
    },
    business: {
        monthly: 49,
        annual: 490, // 10 months (2 months free)
    }
};

const FEATURE_COMPARISON = [
    { 
        category: 'Polls & Responses', 
        icon: BarChart3, 
        features: [
            { name: 'Active polls', free: '3', pro: 'Unlimited', business: 'Unlimited' },
            { name: 'Responses per month', free: '100', pro: '5,000', business: '50,000' },
            { name: 'Poll duration', free: '30 days', pro: '1 year', business: '1 year' },
        ]
    },
    { 
        category: 'Poll Types', 
        icon: BarChart3, 
        features: [
            { name: 'Multiple Choice', free: true, pro: true, business: true },
            { name: 'Ranked Choice', free: true, pro: true, business: true },
            { name: 'Rating Scale', free: true, pro: true, business: true },
            { name: 'Yes/No/Maybe', free: true, pro: true, business: true },
            { name: 'Matrix Poll', free: true, pro: true, business: true },
            { name: 'Dot Voting', free: true, pro: true, business: true },
            { name: 'Pairwise Comparison', free: true, pro: true, business: true },
            { name: 'Visual Poll (images)', free: true, pro: true, business: true },
        ]
    },
    { 
        category: 'Customization', 
        icon: BarChart3, 
        features: [
            { name: 'Basic themes', free: '3', pro: 'All premium', business: 'All premium' },
            { name: 'Remove VoteGenerator badge', free: false, pro: true, business: true },
            { name: 'Upload custom logo', free: false, pro: false, business: true },
            { name: 'Custom colors', free: false, pro: true, business: true },
        ]
    },
    { 
        category: 'Security', 
        icon: Lock, 
        features: [
            { name: 'IP duplicate prevention', free: true, pro: true, business: true },
            { name: 'Cookie-based protection', free: true, pro: true, business: true },
            { name: 'PIN code access', free: false, pro: true, business: true },
            { name: 'One-time vote links', free: false, pro: true, business: true },
            { name: 'IP filtering', free: false, pro: false, business: true },
        ]
    },
    { 
        category: 'Export & Analytics', 
        icon: Download, 
        features: [
            { name: 'View results', free: true, pro: true, business: true },
            { name: 'Real-time updates', free: true, pro: true, business: true },
            { name: 'Export CSV', free: false, pro: true, business: true },
            { name: 'Export Excel', free: false, pro: true, business: true },
            { name: 'Export PDF reports', free: false, pro: false, business: true },
            { name: 'Advanced analytics', free: false, pro: false, business: true },
        ]
    },
    { 
        category: 'Support', 
        icon: Users, 
        features: [
            { name: 'Documentation', free: true, pro: true, business: true },
            { name: 'Email support', free: false, pro: true, business: true },
            { name: 'Priority support', free: false, pro: false, business: true },
        ]
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
    const [isAnnual, setIsAnnual] = useState(true);
    const [showComparison, setShowComparison] = useState(false);

    const getPrice = (tier: 'pro' | 'business') => {
        return isAnnual ? PRICING[tier].annual : PRICING[tier].monthly;
    };

    const getMonthlyEquivalent = (tier: 'pro' | 'business') => {
        if (isAnnual) {
            return Math.round(PRICING[tier].annual / 12);
        }
        return PRICING[tier].monthly;
    };

    const TIERS = [
        { 
            id: 'free', 
            name: 'Free', 
            tagline: 'Perfect for trying out', 
            price: 0, 
            icon: Users, 
            color: 'slate', 
            cta: 'Start Free', 
            ctaLink: '/create',
            features: { 
                polls: '3 active polls', 
                responses: '100 responses/mo', 
                types: 'All 8 poll types',
                highlights: [
                    'All poll types included',
                    'Real-time results',
                    'QR code sharing',
                    'Embed on your site',
                    'Basic themes',
                ] 
            }
        },
        { 
            id: 'pro', 
            name: 'Pro', 
            tagline: 'For growing teams', 
            price: getPrice('pro'),
            monthlyEquiv: getMonthlyEquivalent('pro'),
            icon: Zap, 
            color: 'indigo',
            popular: true,
            cta: 'Get Pro', 
            ctaLink: `/.netlify/functions/vg-checkout?tier=pro&billing=${isAnnual ? 'annual' : 'monthly'}`,
            features: { 
                polls: 'Business polls', 
                responses: '5,000 responses/mo', 
                types: 'All 8 poll types',
                highlights: [
                    'Everything in Free',
                    'Remove VoteGenerator badge',
                    'PIN code protection',
                    'Export CSV & Excel',
                    'All premium themes',
                    'Email support',
                ] 
            }
        },
        { 
            id: 'business', 
            name: 'Business', 
            tagline: 'For power users', 
            price: getPrice('business'),
            monthlyEquiv: getMonthlyEquivalent('business'),
            icon: Crown, 
            color: 'violet',
            cta: 'Get Business', 
            ctaLink: `/.netlify/functions/vg-checkout?tier=business&billing=${isAnnual ? 'annual' : 'monthly'}`,
            features: { 
                polls: 'Business polls', 
                responses: '50,000 responses/mo', 
                types: 'All 8 poll types',
                highlights: [
                    'Everything in Pro',
                    'Upload custom logo',
                    'PDF reports',
                    'Advanced analytics',
                    'IP filtering',
                    'Priority support',
                ] 
            }
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; border: string; button: string }> = {
        slate: { 
            bg: 'bg-slate-100', 
            text: 'text-slate-600', 
            border: 'border-slate-200',
            button: 'bg-slate-800 hover:bg-slate-900 text-white',
        },
        indigo: { 
            bg: 'bg-indigo-100', 
            text: 'text-indigo-600', 
            border: 'border-indigo-500',
            button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        },
        violet: { 
            bg: 'bg-violet-100', 
            text: 'text-violet-600', 
            border: 'border-violet-300',
            button: 'bg-violet-600 hover:bg-violet-700 text-white',
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <NavHeader />

            {/* Limited Time Pricing Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-3">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-white">
                    <Timer size={20} className="animate-pulse" />
                    <span className="font-bold">🎉 Limited Time Launch Pricing</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-amber-100">Lock in these rates before they increase</span>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6"
                >
                    <Shield size={16} /> No signup required • Privacy-first
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 }} 
                    className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
                >
                    Simple, Transparent Pricing
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }} 
                    className="text-xl text-slate-600 max-w-2xl mx-auto mb-8"
                >
                    Start free. Upgrade when you need more.
                </motion.p>

                {/* Billing Toggle */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-4 p-1.5 bg-slate-100 rounded-xl"
                >
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                            !isAnnual 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            isAnnual 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Annual
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            2 months free
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {TIERS.map((tier, index) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;
                        
                        return (
                            <motion.div 
                                key={tier.id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 0.1 + index * 0.1 }}
                                className={`relative rounded-2xl border-2 ${
                                    tier.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100' : colors.border
                                } bg-white overflow-hidden flex flex-col`}
                            >
                                {/* Popular Badge */}
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
                                        <Star size={14} fill="currentColor" /> Most Popular
                                    </div>
                                )}
                                
                                <div className={`p-6 lg:p-8 flex-1 flex flex-col ${tier.popular ? 'pt-14' : ''}`}>
                                    {/* Icon & Name */}
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1 mb-4">{tier.tagline}</p>
                                    
                                    {/* Price */}
                                    <div className="mb-6">
                                        {tier.price === 0 ? (
                                            <div>
                                                <span className="text-4xl font-bold text-slate-900">$0</span>
                                                <span className="text-slate-500 ml-2">USD forever</span>
                                            </div>
                                        ) : (
                                            <div>
                                                {isAnnual ? (
                                                    <>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-4xl font-bold text-slate-900">
                                                                ${tier.monthlyEquiv}
                                                            </span>
                                                            <span className="text-slate-500">USD/mo</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            ${tier.price} USD/year • billed annually
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-4xl font-bold text-slate-900">
                                                                ${tier.price}
                                                            </span>
                                                            <span className="text-slate-500">USD/mo</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            billed monthly
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Key Stats */}
                                    <div className="space-y-2 py-4 border-y border-slate-100 mb-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <BarChart3 size={16} className="text-slate-400" />
                                            <span className="text-slate-700 font-medium">{tier.features.polls}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="text-slate-700 font-medium">{tier.features.responses}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Check size={16} className="text-slate-400" />
                                            <span className="text-slate-700 font-medium">{tier.features.types}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Features List */}
                                    <ul className="space-y-3 mb-6 flex-1">
                                        {tier.features.highlights.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* CTA Button */}
                                    <a 
                                        href={tier.ctaLink} 
                                        className={`w-full py-3.5 ${colors.button} font-semibold rounded-xl transition flex items-center justify-center gap-2 text-center`}
                                    >
                                        {tier.cta}
                                        <ArrowRight size={18} />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-4xl mx-auto px-4 pb-12">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-slate-400" />
                        <span>No credit card for free</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeCheck size={18} className="text-slate-400" />
                        <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock size={18} className="text-slate-400" />
                        <span>Secure checkout via Stripe</span>
                    </div>
                </div>
            </div>

            {/* Feature Comparison Toggle */}
            <div className="max-w-5xl mx-auto px-4 pb-8">
                <button 
                    onClick={() => setShowComparison(!showComparison)} 
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition flex items-center justify-center gap-2"
                >
                    {showComparison ? 'Hide' : 'Show'} Full Feature Comparison 
                    <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
                </button>
            </div>

            {/* Feature Comparison Table */}
            <AnimatePresence>
                {showComparison && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="max-w-5xl mx-auto px-4 pb-16 overflow-hidden"
                    >
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200 bg-slate-50">
                                            <th className="py-4 px-6 text-left text-sm font-bold text-slate-900 min-w-[200px]">Feature</th>
                                            <th className="py-4 px-4 text-center text-sm font-bold text-slate-600 w-28">Free</th>
                                            <th className="py-4 px-4 text-center text-sm font-bold text-indigo-700 w-28 bg-indigo-50">Pro</th>
                                            <th className="py-4 px-4 text-center text-sm font-bold text-violet-700 w-28 bg-violet-50">Business</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FEATURE_COMPARISON.map((section, si) => (
                                            <React.Fragment key={si}>
                                                <tr className="bg-slate-50">
                                                    <td colSpan={4} className="py-3 px-6">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                                            <section.icon size={14} />
                                                            {section.category}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {section.features.map((f, fi) => (
                                                    <tr key={fi} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                        <td className="py-3 px-6 text-sm text-slate-700">{f.name}</td>
                                                        <td className="py-3 px-4 text-center"><FeatureCell value={f.free} /></td>
                                                        <td className="py-3 px-4 text-center bg-indigo-50/30"><FeatureCell value={f.pro} /></td>
                                                        <td className="py-3 px-4 text-center bg-violet-50/30"><FeatureCell value={f.business} /></td>
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
            </AnimatePresence>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { 
                            q: 'Can I cancel anytime?', 
                            a: 'Yes! You can cancel your subscription anytime from your dashboard. You\'ll keep access until the end of your billing period.' 
                        },
                        { 
                            q: 'What happens if I hit my response limit?', 
                            a: 'Your existing polls will stop accepting new responses until the next billing cycle. You can upgrade anytime to increase your limit.' 
                        },
                        { 
                            q: 'Do I need to create an account?', 
                            a: 'Nope! VoteGenerator is privacy-first. No signup required. We\'ll email you a secure link to manage your polls.' 
                        },
                        { 
                            q: 'What\'s included in the free plan?', 
                            a: 'All 8 poll types, 3 active polls, 100 responses/month, real-time results, QR codes, and embedding. Everything you need to get started!' 
                        },
                        { 
                            q: 'How does the "2 months free" work?', 
                            a: 'Annual plans are priced at 10 months instead of 12. So you get 2 months completely free compared to paying monthly!' 
                        },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50">
                                {faq.q}
                                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your poll?</h2>
                    <p className="text-indigo-100 mb-8">Start free. No credit card required.</p>
                    <a 
                        href="/create" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                    >
                        <Sparkles size={20} /> 
                        Create Free Poll 
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PricingPage;
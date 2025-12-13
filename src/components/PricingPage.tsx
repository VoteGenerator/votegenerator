import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    X, 
    Zap, 
    Sparkles,
    ArrowRight,
    Shield,
    Lock,
    Users,
    HelpCircle
} from 'lucide-react';

// Proper TypeScript interfaces
interface PlanFeature {
    name: string;
    included: boolean;
    tooltip?: string;
    negative?: boolean;
    header?: boolean;
    isNew?: boolean;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: { monthly: number; yearly: number };
    badge: string | null;
    highlight: boolean;
    cta: string;
    ctaLink: string;
    features: PlanFeature[];
}

interface ComparisonFeature {
    name: string;
    free: string | boolean;
    oneTime: string | boolean;
    pro: string | boolean;
    proPlus: string | boolean;
    tooltip?: string;
}

const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plans: Plan[] = [
        {
            id: 'free',
            name: 'Free',
            description: 'Perfect for quick polls and personal use',
            price: { monthly: 0, yearly: 0 },
            badge: null,
            highlight: false,
            cta: 'Start Free',
            ctaLink: '#',
            features: [
                { name: 'All 12 poll types', included: true },
                { name: 'Unlimited polls', included: true, tooltip: 'Each poll has its own unique link' },
                { name: 'Up to 100 responses per poll', included: true },
                { name: 'Cookie-based duplicate detection', included: true, tooltip: 'Helps prevent repeat voting from the same browser' },
                { name: 'Scheduled poll closing', included: true },
                { name: 'Ads displayed on polls', included: true, negative: true },
                { name: '"Powered by VoteGenerator" shown', included: true, negative: true },
            ]
        },
        {
            id: 'one-time',
            name: 'One-Time Event',
            description: 'For a single important poll or event',
            price: { monthly: 9.99, yearly: 9.99 },
            badge: 'PAY ONCE',
            highlight: false,
            cta: 'Buy Now',
            ctaLink: '#checkout/one-time',
            features: [
                { name: 'Everything in Free, plus:', included: true, header: true },
                { name: '1 premium poll for 30 days', included: true },
                { name: 'Up to 1,000 responses', included: true },
                { name: 'No ads on your poll', included: true },
                { name: 'Remove "Powered by VoteGenerator"', included: true },
                { name: 'Download results (CSV & PDF)', included: true },
                { name: 'Upload your own logo', included: true },
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            description: 'For teams and regular poll creators',
            price: { monthly: 12, yearly: 99 },
            badge: 'BEST VALUE',
            highlight: true,
            cta: 'Get Pro',
            ctaLink: '#checkout/pro',
            features: [
                { name: 'Everything in One-Time, plus:', included: true, header: true },
                { name: 'Unlimited polls & responses', included: true },
                { name: 'Unified dashboard', included: true, tooltip: 'Manage all your polls from one place' },
                { name: 'Unique voting codes', included: true, tooltip: 'Generate one-time codes for controlled voting' },
                { name: 'Visual Poll (image voting)', included: true, isNew: true },
                { name: 'Basic analytics', included: true, tooltip: 'Vote counts, percentages, timestamps' },
                { name: 'Embed polls on your site', included: true },
                { name: 'Email notifications', included: true, tooltip: 'Get notified when someone votes' },
                { name: 'Priority email support', included: true },
            ]
        },
        {
            id: 'pro-plus',
            name: 'Pro+',
            description: 'For power users and businesses',
            price: { monthly: 19, yearly: 149 },
            badge: 'FULL POWER',
            highlight: false,
            cta: 'Get Pro+',
            ctaLink: '#checkout/pro-plus',
            features: [
                { name: 'Everything in Pro, plus:', included: true, header: true },
                { name: 'White-label embeds (no branding)', included: true, tooltip: 'Embed polls without any VoteGenerator branding' },
                { name: 'Custom short links', included: true, tooltip: 'votegenerator.com/v/your-custom-name' },
                { name: 'Custom thank-you page', included: true, tooltip: 'Show your own message after voting' },
                { name: 'Voter comments & feedback', included: true },
                { name: 'Export to Google Sheets', included: true, tooltip: 'One-click export to Google Sheets' },
                { name: 'Advanced vote protection', included: true, tooltip: 'Multiple layers: cookies + unique codes + rate limiting' },
                { name: 'Dedicated support', included: true },
            ]
        }
    ];

    const comparisonFeatures: ComparisonFeature[] = [
        { name: 'Poll Types Available', free: 'All 12 types', oneTime: 'All 12 types', pro: 'All 12 types', proPlus: 'All 12 types' },
        { name: 'Visual Poll (Image Voting)', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Let voters choose between images' },
        { name: 'Polls You Can Create', free: 'Unlimited', oneTime: '1 poll', pro: 'Unlimited', proPlus: 'Unlimited' },
        { name: 'Responses Per Poll', free: '100', oneTime: '1,000', pro: 'Unlimited', proPlus: 'Unlimited' },
        { name: 'Poll Duration', free: 'Unlimited', oneTime: '30 days', pro: 'Unlimited', proPlus: 'Unlimited' },
        { name: 'Unified Dashboard', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'See and manage all your polls in one place' },
        { name: 'Remove Ads', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Remove VoteGenerator Branding', free: false, oneTime: true, pro: true, proPlus: true, tooltip: 'Hide "Powered by VoteGenerator" footer' },
        { name: 'Upload Your Logo', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Download CSV/PDF', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Scheduled Poll Closing', free: true, oneTime: true, pro: true, proPlus: true, tooltip: 'Set a deadline to automatically close voting' },
        { name: 'Cookie-Based Duplicate Detection', free: true, oneTime: true, pro: true, proPlus: true, tooltip: 'Uses browser cookies to detect repeat voters. Not foolproof if cookies are cleared.' },
        { name: 'Unique Voting Codes', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Generate one-time codes. Each code can only vote once.' },
        { name: 'Advanced Vote Protection', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Combines cookies + codes + rate limiting for maximum protection' },
        { name: 'Basic Analytics', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Vote counts, percentages, timestamps' },
        { name: 'Embed Polls', free: false, oneTime: false, pro: 'With your logo', proPlus: 'White-label', tooltip: 'Add polls to your website via embed code' },
        { name: 'Custom Short Links', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Create memorable links like /v/team-vote' },
        { name: 'Custom Thank-You Page', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Show your own message after someone votes' },
        { name: 'Voter Comments', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Let voters leave optional feedback with their vote' },
        { name: 'Email Notifications', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Get an email when someone votes on your poll' },
        { name: 'Export to Google Sheets', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'One-click export results to a Google Sheet' },
        { name: 'Priority Support', free: false, oneTime: false, pro: true, proPlus: true },
    ];

    const faqs = [
        {
            q: "Is the free plan really free forever?",
            a: "Yes! Create unlimited polls with up to 100 responses each, completely free. We show small ads to keep it sustainable. No credit card required, no time limits."
        },
        {
            q: "What's the difference between free polls and paid polls?",
            a: "Free polls show ads and VoteGenerator branding, have a 100 response limit, and each poll has its own separate link. Paid plans remove ads/branding, increase limits, and Pro users get a unified dashboard to manage all polls."
        },
        {
            q: "How does the One-Time plan work?",
            a: "Pay $9.99 once for a single premium poll that stays active for 30 days with up to 1,000 responses. Perfect for weddings, team votes, or one-off events. No subscription required."
        },
        {
            q: "How does vote protection work?",
            a: "Free plans use browser cookies to detect repeat voters from the same browser. Pro adds unique voting codes (each code works once). Pro+ combines multiple methods. Note: No online poll is 100% fraud-proof - determined users can find workarounds. For high-stakes decisions, we recommend unique codes."
        },
        {
            q: "What if someone blocks cookies?",
            a: "If a voter has cookies disabled or uses incognito mode, cookie-based detection won't work for them. For important polls, we recommend using unique voting codes (Pro/Pro+) which don't rely on cookies."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal through Stripe, our secure payment processor."
        },
        {
            q: "Can I upgrade or downgrade anytime?",
            a: "Yes! Upgrade instantly and we'll prorate your billing. Downgrade takes effect at your next billing date."
        },
        {
            q: "What's your refund policy?",
            a: "Due to the digital nature of our service, we don't offer refunds. You can cancel anytime and continue using your plan until the billing period ends."
        }
    ];

    const getYearlySavings = (plan: Plan) => {
        if (plan.price.monthly === 0 || plan.id === 'one-time') return null;
        const monthlyTotal = plan.price.monthly * 12;
        const savings = Math.round((1 - plan.price.yearly / monthlyTotal) * 100);
        return savings > 0 ? savings : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <div className="pt-16 pb-12 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-600 mb-8">
                        Start free. Upgrade when you need more.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                                billingCycle === 'yearly'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Yearly
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Save 30%+
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-6 ${
                                plan.highlight
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white ring-4 ring-indigo-300 scale-105'
                                    : 'bg-white border border-slate-200'
                            }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
                                    plan.highlight
                                        ? 'bg-amber-400 text-amber-900'
                                        : 'bg-slate-800 text-white'
                                }`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Name */}
                            <div className="mb-4">
                                <h3 className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                        ${billingCycle === 'yearly' && plan.id !== 'one-time' ? plan.price.yearly : plan.price.monthly}
                                    </span>
                                    {plan.price.monthly > 0 && plan.id !== 'one-time' && (
                                        <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>
                                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                                        </span>
                                    )}
                                    {plan.id === 'one-time' && (
                                        <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>
                                            one-time
                                        </span>
                                    )}
                                </div>
                                {billingCycle === 'yearly' && getYearlySavings(plan) && (
                                    <p className={`text-sm mt-1 ${plan.highlight ? 'text-green-300' : 'text-green-600'}`}>
                                        Save {getYearlySavings(plan)}% vs monthly
                                    </p>
                                )}
                            </div>

                            {/* CTA */}
                            <a
                                href={plan.ctaLink}
                                className={`block w-full py-3 px-4 rounded-xl font-bold text-center transition-all ${
                                    plan.highlight
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : plan.id === 'free'
                                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {plan.cta}
                            </a>

                            {/* Features */}
                            <ul className="mt-6 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li 
                                        key={i} 
                                        className={`flex items-start gap-2 text-sm ${
                                            feature.header 
                                                ? `font-semibold ${plan.highlight ? 'text-indigo-100' : 'text-slate-700'}` 
                                                : ''
                                        }`}
                                    >
                                        {!feature.header && (
                                            feature.included ? (
                                                feature.negative ? (
                                                    <X size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`} />
                                                ) : (
                                                    <Check size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-green-300' : 'text-green-500'}`} />
                                                )
                                            ) : (
                                                <X size={16} className="shrink-0 mt-0.5 text-slate-300" />
                                            )
                                        )}
                                        <span className={`flex items-center gap-1.5 ${
                                            feature.negative 
                                                ? plan.highlight ? 'text-indigo-200' : 'text-slate-400'
                                                : plan.highlight ? 'text-white' : 'text-slate-600'
                                        }`}>
                                            {feature.name}
                                            {feature.isNew && (
                                                <span className="px-1.5 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-bold rounded">
                                                    NEW
                                                </span>
                                            )}
                                            {feature.tooltip && (
                                                <div className="relative group inline-block">
                                                    <HelpCircle size={12} className={`cursor-help ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                                                        {feature.tooltip}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                    Compare All Features
                </h2>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left p-4 font-semibold text-slate-600">Feature</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-28">Free</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-28">One-Time</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-28 bg-indigo-50">
                                        <span className="text-indigo-600">Pro</span>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-28">Pro+</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((feature, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                                        <td className="p-4 text-slate-700">
                                            <div className="flex items-center gap-2">
                                                {feature.name}
                                                {feature.tooltip && (
                                                    <div className="relative group">
                                                        <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                                            {feature.tooltip}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {typeof feature.free === 'boolean' ? (
                                                feature.free ? (
                                                    <Check size={18} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={18} className="text-slate-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm text-slate-600">{feature.free}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {typeof feature.oneTime === 'boolean' ? (
                                                feature.oneTime ? (
                                                    <Check size={18} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={18} className="text-slate-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm text-slate-600">{feature.oneTime}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center bg-indigo-50/50">
                                            {typeof feature.pro === 'boolean' ? (
                                                feature.pro ? (
                                                    <Check size={18} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={18} className="text-slate-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm text-indigo-600 font-medium">{feature.pro}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {typeof feature.proPlus === 'boolean' ? (
                                                feature.proPlus ? (
                                                    <Check size={18} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={18} className="text-slate-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm text-slate-600">{feature.proPlus}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div className="bg-slate-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Users size={24} className="text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">No Signup Required</h4>
                            <p className="text-sm text-slate-500">Create polls in seconds</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Shield size={24} className="text-green-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Privacy First</h4>
                            <p className="text-sm text-slate-500">Your data stays yours</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Zap size={24} className="text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Free Forever</h4>
                            <p className="text-sm text-slate-500">No credit card needed</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Lock size={24} className="text-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Secure Payments</h4>
                            <p className="text-sm text-slate-500">Powered by Stripe</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                    Frequently Asked Questions
                </h2>
                
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl p-6 border border-slate-200"
                        >
                            <h3 className="font-bold text-slate-800 mb-2">{faq.q}</h3>
                            <p className="text-slate-600 text-sm">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to create your first poll?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        No signup required. Start in seconds.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                    >
                        <Sparkles size={20} />
                        Create Free Poll
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
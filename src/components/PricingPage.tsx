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
    HelpCircle,
    CheckSquare,
    ListOrdered,
    Calendar,
    ArrowLeftRight,
    CircleDot,
    SlidersHorizontal,
    Coins,
    LayoutGrid,
    ThumbsUp,
    Smile,
    Image
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const plans = [
        {
            id: 'free',
            name: 'Free',
            description: 'Perfect for quick polls and personal use',
            monthlyPrice: 0,
            yearlyPrice: 0,
            badge: null,
            highlight: false,
            cta: 'Start Free',
            features: [
                { text: '9 basic poll types', included: true },
                { text: 'Unlimited polls (separate admin links)', included: true },
                { text: 'Up to 100 responses per poll', included: true },
                { text: 'Browser-based vote protection', included: true },
                { text: 'Shareable admin link', included: true },
                { text: 'Basic results view', included: true },
                { text: 'Ads displayed', included: true, negative: true },
                { text: '"Powered by VoteGenerator"', included: true, negative: true },
            ]
        },
        {
            id: 'quick',
            name: 'Quick Poll',
            description: 'For a single quick poll',
            monthlyPrice: 5,
            yearlyPrice: 5,
            isOneTime: true,
            badge: 'ONE-TIME',
            highlight: false,
            cta: 'Buy Now',
            features: [
                { text: 'Everything in Free, plus:', header: true },
                { text: '1 poll, active for 7 days', included: true },
                { text: 'Up to 500 responses', included: true },
                { text: 'No ads on your poll', included: true },
                { text: 'Remove "Powered by" branding', included: true },
                { text: 'Download results (CSV & PDF)', included: true },
                { text: 'Custom thank-you message', included: true },
            ]
        },
        {
            id: 'event',
            name: 'Event Poll',
            description: 'For important events & decisions',
            monthlyPrice: 9.99,
            yearlyPrice: 9.99,
            isOneTime: true,
            badge: 'POPULAR',
            highlight: false,
            cta: 'Buy Now',
            features: [
                { text: 'Everything in Quick Poll, plus:', header: true },
                { text: '1 poll, active for 30 days', included: true },
                { text: 'Up to 2,000 responses', included: true },
                { text: 'Upload your logo', included: true },
                { text: 'Secure admin token', included: true },
                { text: 'Custom thank-you page', included: true },
                { text: 'Voter comments enabled', included: true },
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            description: 'For teams & regular poll creators',
            monthlyPrice: 12,
            yearlyPrice: 99,
            badge: 'BEST VALUE',
            highlight: true,
            cta: 'Get Pro',
            features: [
                { text: 'Everything in Event, plus:', header: true },
                { text: 'Unlimited polls & responses', included: true },
                { text: 'All 12 poll types (incl. Visual)', included: true, isNew: true },
                { text: 'Unified dashboard for all polls', included: true },
                { text: 'Secure admin tokens', included: true },
                { text: 'Detailed analytics & charts', included: true },
                { text: 'Embed polls with your logo', included: true },
                { text: 'Poll duplication', included: true },
            ]
        },
        {
            id: 'pro-plus',
            name: 'Pro+',
            description: 'For businesses & power users',
            monthlyPrice: 19,
            yearlyPrice: 149,
            badge: 'FULL POWER',
            highlight: false,
            cta: 'Get Pro+',
            features: [
                { text: 'Everything in Pro, plus:', header: true },
                { text: 'Advanced analytics & insights', included: true },
                { text: 'White-label embeds (no branding)', included: true },
                { text: 'Custom short links (/v/your-name)', included: true },
                { text: 'Custom thank-you page with redirect', included: true },
                { text: 'IP-based vote protection', included: true },
                { text: 'Unique voting codes', included: true },
                { text: 'Priority support (24hr response)', included: true },
            ]
        }
    ];

    // All 12 poll types
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, free: true },
        { name: 'Ranked Choice', icon: ListOrdered, free: true },
        { name: 'Meeting Poll', icon: Calendar, free: true },
        { name: 'This or That', icon: ArrowLeftRight, free: true },
        { name: 'Dot Voting', icon: CircleDot, free: true },
        { name: 'Rating Scale', icon: SlidersHorizontal, free: true },
        { name: 'Buy a Feature', icon: Coins, free: true },
        { name: 'Priority Matrix', icon: LayoutGrid, free: true },
        { name: 'Approval Voting', icon: ThumbsUp, free: true },
        { name: 'Quiz Poll', icon: HelpCircle, free: true },
        { name: 'Sentiment Check', icon: Smile, free: true },
        { name: 'Visual Poll', icon: Image, free: false, pro: true },
    ];

    // Feature comparison grouped by category
    const featureCategories = [
        {
            name: 'Poll Types',
            features: [
                { name: 'Multiple Choice', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Ranked Choice', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Meeting Poll', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'This or That', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Dot Voting', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Rating Scale', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Buy a Feature', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Priority Matrix', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Approval Voting', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Quiz Poll', free: false, quick: false, event: false, pro: true, proPlus: true },
                { name: 'Sentiment Check', free: false, quick: false, event: false, pro: true, proPlus: true },
                { name: 'Visual Poll (Images)', free: false, quick: false, event: false, pro: true, proPlus: true },
            ]
        },
        {
            name: 'Limits & Responses',
            features: [
                { name: 'Number of Polls', free: 'Unlimited', quick: '1 poll', event: '1 poll', pro: 'Unlimited', proPlus: 'Unlimited' },
                { name: 'Responses per Poll', free: '100', quick: '500', event: '2,000', pro: 'Unlimited', proPlus: 'Unlimited' },
                { name: 'Poll Duration', free: 'Unlimited', quick: '7 days', event: '30 days', pro: 'Unlimited', proPlus: 'Unlimited' },
            ]
        },
        {
            name: 'Admin & Security',
            features: [
                { name: 'Shareable Admin Link', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Secure Admin Token', free: false, quick: false, event: true, pro: true, proPlus: true, tooltip: 'Extra secure access code for admin functions' },
                { name: 'Unified Dashboard', free: false, quick: false, event: false, pro: true, proPlus: true, tooltip: 'Manage all your polls in one place' },
                { name: 'Browser Vote Protection', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'IP-Based Vote Protection', free: false, quick: false, event: false, pro: false, proPlus: true },
                { name: 'Unique Voting Codes', free: false, quick: false, event: false, pro: false, proPlus: true, tooltip: 'Generate one-time codes for controlled voting' },
            ]
        },
        {
            name: 'Branding & Customization',
            features: [
                { name: 'Remove Ads', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Remove "Powered by" Branding', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Upload Your Logo', free: false, quick: false, event: true, pro: true, proPlus: true },
                { name: 'Custom Thank-You Message', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Custom Thank-You Page', free: false, quick: false, event: true, pro: true, proPlus: true },
                { name: 'Thank-You Page with Redirect', free: false, quick: false, event: false, pro: false, proPlus: true },
                { name: 'Embed Polls', free: 'With branding', quick: 'With branding', event: 'Your logo', pro: 'Your logo', proPlus: 'White-label' },
                { name: 'Custom Short Links', free: false, quick: false, event: false, pro: false, proPlus: true, tooltip: 'votegenerator.com/v/your-custom-name' },
            ]
        },
        {
            name: 'Results & Analytics',
            features: [
                { name: 'Real-Time Results', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Download CSV', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Download PDF Report', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Detailed Analytics', free: false, quick: false, event: false, pro: true, proPlus: true },
                { name: 'Advanced Insights', free: false, quick: false, event: false, pro: false, proPlus: true, tooltip: 'Vote trends, peak times, device breakdown' },
                { name: 'Voter Comments', free: false, quick: false, event: true, pro: true, proPlus: true },
            ]
        },
        {
            name: 'Support',
            features: [
                { name: 'Help Center Access', free: true, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Email Support', free: false, quick: true, event: true, pro: true, proPlus: true },
                { name: 'Priority Support (24hr)', free: false, quick: false, event: false, pro: false, proPlus: true },
            ]
        },
    ];

    const faqs = [
        {
            q: "Can I really use it for free forever?",
            a: "Yes! The free plan is truly free with no time limits. Create unlimited polls, get up to 100 responses each, and share instantly. We show small ads to keep it free."
        },
        {
            q: "What's the difference between Quick Poll and Event Poll?",
            a: "Quick Poll ($5) is perfect for simple decisions - 7 days, 500 responses. Event Poll ($9.99) is for important occasions - 30 days, 2,000 responses, plus logo upload, admin tokens, and voter comments."
        },
        {
            q: "What are admin tokens?",
            a: "Admin tokens are secure codes that protect your poll's admin functions. Instead of just a link, you get a secret token that must be entered to access results and settings. Great for sensitive polls."
        },
        {
            q: "How does the unified dashboard work?",
            a: "Pro users get a single dashboard where they can see and manage ALL their polls in one place. No more bookmarking individual admin links!"
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal through our secure payment processor, Stripe."
        },
        {
            q: "Can I upgrade or downgrade anytime?",
            a: "Yes! Upgrade instantly and we'll prorate your billing. Downgrade takes effect at your next billing date."
        },
        {
            q: "What's your refund policy?",
            a: "One-time purchases are non-refundable due to immediate access. For subscriptions, you can cancel anytime and continue using features until your billing period ends."
        },
        {
            q: "Is my data secure?",
            a: "Absolutely. We're privacy-first by design. Poll data is encrypted, we don't track voters, and polls can be set to auto-delete after they close."
        }
    ];

    const getYearlySavings = (monthly: number, yearly: number) => {
        if (monthly === 0) return null;
        const monthlyTotal = monthly * 12;
        const savings = monthlyTotal - yearly;
        const percent = Math.round((savings / monthlyTotal) * 100);
        return { savings, percent, perMonth: (yearly / 12).toFixed(2) };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />

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
                        Start free. Pay only when you need more power.
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
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {plans.map((plan, index) => {
                        const yearlyInfo = getYearlySavings(plan.monthlyPrice, plan.yearlyPrice);
                        const isOneTime = plan.isOneTime;
                        const displayPrice = isOneTime ? plan.monthlyPrice : (billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice);
                        
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl p-5 ${
                                    plan.highlight
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white ring-4 ring-indigo-300 scale-105 z-10'
                                        : 'bg-white border border-slate-200'
                                }`}
                            >
                                {plan.badge && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                        plan.highlight
                                            ? 'bg-amber-400 text-amber-900'
                                            : plan.badge === 'POPULAR' ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'
                                    }`}>
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`text-xs mt-1 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                            ${displayPrice}
                                        </span>
                                        {!isOneTime && plan.monthlyPrice > 0 && (
                                            <span className={plan.highlight ? 'text-indigo-200 text-sm' : 'text-slate-400 text-sm'}>
                                                /{billingCycle === 'yearly' ? 'year' : 'mo'}
                                            </span>
                                        )}
                                        {isOneTime && (
                                            <span className={plan.highlight ? 'text-indigo-200 text-sm' : 'text-slate-400 text-sm'}>
                                                one-time
                                            </span>
                                        )}
                                    </div>
                                    {!isOneTime && billingCycle === 'yearly' && yearlyInfo && (
                                        <p className={`text-xs mt-1 ${plan.highlight ? 'text-green-300' : 'text-green-600'}`}>
                                            ${yearlyInfo.perMonth}/mo · Save ${yearlyInfo.savings}
                                        </p>
                                    )}
                                </div>

                                <a
                                    href="/index.html"
                                    className={`block w-full py-2.5 px-4 rounded-xl font-bold text-center text-sm transition-all ${
                                        plan.highlight
                                            ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                            : plan.id === 'free'
                                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {plan.cta}
                                </a>

                                <ul className="mt-4 space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li 
                                            key={i} 
                                            className={`flex items-start gap-2 text-xs ${
                                                feature.header 
                                                    ? `font-semibold ${plan.highlight ? 'text-indigo-100' : 'text-slate-700'}` 
                                                    : ''
                                            }`}
                                        >
                                            {!feature.header && (
                                                feature.included ? (
                                                    feature.negative ? (
                                                        <X size={14} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`} />
                                                    ) : (
                                                        <Check size={14} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-green-300' : 'text-green-500'}`} />
                                                    )
                                                ) : (
                                                    <X size={14} className="shrink-0 mt-0.5 text-slate-300" />
                                                )
                                            )}
                                            <span className={
                                                feature.negative 
                                                    ? plan.highlight ? 'text-indigo-200' : 'text-slate-400'
                                                    : plan.highlight ? 'text-white' : 'text-slate-600'
                                            }>
                                                {feature.text}
                                                {feature.isNew && (
                                                    <span className="ml-1 px-1.5 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded">
                                                        NEW
                                                    </span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Poll Types Section */}
            <div className="bg-slate-50 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
                        12 Poll Types Included
                    </h2>
                    <p className="text-slate-600 text-center mb-10">
                        9 types free, 3 exclusive to Pro plans
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {pollTypes.map((poll, i) => (
                            <div 
                                key={i}
                                className={`p-4 rounded-xl border text-center ${
                                    poll.pro 
                                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200' 
                                        : 'bg-white border-slate-200'
                                }`}
                            >
                                <poll.icon size={24} className={poll.pro ? 'text-indigo-600 mx-auto mb-2' : 'text-slate-600 mx-auto mb-2'} />
                                <p className="text-sm font-medium text-slate-800">{poll.name}</p>
                                {poll.pro && (
                                    <span className="text-[10px] font-bold text-indigo-600">PRO</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                    Compare All Features
                </h2>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left p-4 font-semibold text-slate-600">Feature</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-20">Free</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-20">$5</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-20">$9.99</th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-20 bg-indigo-50">
                                        <span className="text-indigo-600">Pro</span>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-20">Pro+</th>
                                </tr>
                            </thead>
                            <tbody>
                                {featureCategories.map((category, catIndex) => (
                                    <React.Fragment key={catIndex}>
                                        <tr className="bg-slate-100">
                                            <td colSpan={6} className="p-3 font-bold text-slate-700 text-sm">
                                                {category.name}
                                            </td>
                                        </tr>
                                        {category.features.map((feature, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                                                <td className="p-3 text-slate-700 text-sm flex items-center gap-2">
                                                    {feature.name}
                                                    {feature.tooltip && (
                                                        <div className="relative group">
                                                            <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                                                {feature.tooltip}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                {['free', 'quick', 'event', 'pro', 'proPlus'].map((plan) => {
                                                    const value = feature[plan as keyof typeof feature];
                                                    return (
                                                        <td 
                                                            key={plan} 
                                                            className={`p-3 text-center ${plan === 'pro' ? 'bg-indigo-50/50' : ''}`}
                                                        >
                                                            {typeof value === 'boolean' ? (
                                                                value ? (
                                                                    <Check size={16} className="text-green-500 mx-auto" />
                                                                ) : (
                                                                    <X size={16} className="text-slate-300 mx-auto" />
                                                                )
                                                            ) : (
                                                                <span className={`text-xs ${plan === 'pro' ? 'text-indigo-600 font-medium' : 'text-slate-600'}`}>
                                                                    {value}
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
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
                            <p className="text-sm text-slate-500">Create polls instantly</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Shield size={24} className="text-green-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">Privacy First</h4>
                            <p className="text-sm text-slate-500">No voter tracking</p>
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
                        Join thousands making better decisions with VoteGenerator.
                    </p>
                    <a
                        href="/index.html"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
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
};

export default PricingPage;
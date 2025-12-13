import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    X, 
    Crown, 
    Sparkles, 
    Users,
    Lock,
    Shield,
    Star,
    ArrowRight,
    HelpCircle
} from 'lucide-react';

interface PlanFeature {
    text: string;
    included: boolean;
    pro?: boolean;
    new?: boolean;
}

interface PricingPageProps {
    onSelectPlan?: (plan: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [showFAQ, setShowFAQ] = useState<number | null>(null);

    const plans: Array<{
        id: string;
        name: string;
        description: string;
        price: { monthly: number; yearly: number };
        highlight: boolean;
        cta: string;
        isOneTime?: boolean;
        badge?: string;
        features: PlanFeature[];
    }> = [
        {
            id: 'free',
            name: 'Free',
            description: 'Perfect for casual polls',
            price: { monthly: 0, yearly: 0 },
            highlight: false,
            cta: 'Get Started',
            features: [
                { text: 'Ranked Choice polls', included: true },
                { text: 'Multiple Choice polls', included: true },
                { text: 'Meeting Scheduler', included: true },
                { text: 'Dot Voting', included: true },
                { text: 'This or That', included: true },
                { text: 'Rating Scale', included: true },
                { text: 'Priority Matrix', included: true },
                { text: 'Unlimited polls', included: true },
                { text: 'Unlimited votes', included: true },
                { text: 'Basic vote security', included: true },
                { text: 'Visual Poll (Images)', included: false, pro: true },
                { text: 'Remove ads', included: false },
                { text: 'Remove VG branding', included: false },
                { text: 'Download CSV/PDF', included: false },
                { text: 'Upload custom logo', included: false },
                { text: 'Advanced analytics', included: false },
            ]
        },
        {
            id: 'one-time',
            name: 'One-Time Event',
            description: 'For special occasions',
            price: { monthly: 9.99, yearly: 9.99 },
            isOneTime: true,
            highlight: false,
            badge: 'Popular',
            cta: 'Buy Now',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Single poll, no ads', included: true },
                { text: 'Valid for 30 days', included: true },
                { text: 'Basic analytics', included: true },
                { text: 'Download CSV/PDF', included: true },
                { text: 'Upload custom logo', included: true },
                { text: 'No VG branding', included: true },
                { text: 'Visual Poll (Images)', included: false },
                { text: 'Advanced analytics', included: false },
                { text: 'Multiple polls', included: false },
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            description: 'For regular poll creators',
            price: { monthly: 12, yearly: 99 },
            highlight: true,
            badge: 'Best Value',
            cta: 'Start Free Trial',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited polls', included: true },
                { text: 'No ads for you & voters', included: true },
                { text: 'Remove VG branding', included: true },
                { text: 'Basic analytics', included: true },
                { text: 'Download CSV/PDF', included: true },
                { text: 'Upload custom logo', included: true },
                { text: 'Visual Poll (Images)', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Advanced analytics', included: false },
                { text: 'API access', included: false },
            ]
        },
        {
            id: 'pro-plus',
            name: 'Pro+',
            description: 'For power users & teams',
            price: { monthly: 19, yearly: 149 },
            highlight: false,
            badge: 'Most Features',
            cta: 'Start Free Trial',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Advanced analytics', included: true, new: true },
                { text: 'Response trends over time', included: true },
                { text: 'Geographic insights', included: true },
                { text: 'Export to Google Sheets', included: true },
                { text: 'Scheduled poll closing', included: true },
                { text: 'Email notifications', included: true },
                { text: 'Embed polls anywhere', included: true },
                { text: 'Custom short links', included: true },
                { text: 'White-label embeds', included: true },
                { text: 'Priority support', included: true },
            ]
        }
    ];

    const faqs = [
        {
            q: 'Can I cancel anytime?',
            a: 'Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period.'
        },
        {
            q: 'What payment methods do you accept?',
            a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal through our secure payment processor, Stripe.'
        },
        {
            q: 'Is there a free trial?',
            a: 'Yes! Pro and Pro+ plans come with a 7-day free trial. No credit card required to start.'
        },
        {
            q: 'What happens to my polls if I downgrade?',
            a: 'Your existing polls remain accessible. You just won\'t be able to create new polls with premium features until you upgrade again.'
        },
        {
            q: 'Can I upgrade mid-billing cycle?',
            a: 'Absolutely! When you upgrade, we\'ll prorate the difference so you only pay for what you use.'
        },
        {
            q: 'Do you offer refunds?',
            a: 'We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled but are non-refundable.'
        },
        {
            q: 'What\'s the One-Time Event plan?',
            a: 'Perfect for weddings, parties, or one-off events. Pay once, get 30 days of premium features for a single poll. No subscription needed!'
        },
        {
            q: 'Is my data secure?',
            a: 'Yes! We use industry-standard encryption. Poll data is stored securely in your shareable links - we don\'t sell or share your information.'
        }
    ];

    const getPrice = (plan: typeof plans[0]) => {
        if (plan.isOneTime) return plan.price.monthly;
        return billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    };

    const getYearlySavings = (plan: typeof plans[0]) => {
        if (plan.isOneTime || plan.price.monthly === 0) return 0;
        const monthlyTotal = plan.price.monthly * 12;
        const yearlyTotal = plan.price.yearly;
        return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <div className="pt-16 pb-12 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-medium text-sm mb-6"
                >
                    <Sparkles size={16} />
                    Simple, transparent pricing
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
                >
                    Choose Your Plan
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-600 max-w-2xl mx-auto mb-8"
                >
                    Start free, upgrade when you need more. All plans include our core polling features.
                </motion.p>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-full"
                >
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                            billingCycle === 'monthly'
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                            billingCycle === 'yearly'
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Yearly
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Save 30%+
                        </span>
                    </button>
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
                            transition={{ delay: 0.1 * index }}
                            className={`relative rounded-3xl p-6 ${
                                plan.highlight
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 scale-105 z-10'
                                    : 'bg-white border border-slate-200 shadow-lg'
                            }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                                    plan.highlight
                                        ? 'bg-yellow-400 text-yellow-900'
                                        : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Name */}
                            <div className="mb-4">
                                <h3 className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                        ${getPrice(plan)}
                                    </span>
                                    {!plan.isOneTime && plan.price.monthly > 0 && (
                                        <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    )}
                                </div>
                                {plan.isOneTime && (
                                    <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                        One-time payment
                                    </p>
                                )}
                                {!plan.isOneTime && billingCycle === 'yearly' && getYearlySavings(plan) > 0 && (
                                    <p className={`text-sm mt-1 ${plan.highlight ? 'text-green-300' : 'text-green-600'}`}>
                                        Save {getYearlySavings(plan)}% vs monthly
                                    </p>
                                )}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => onSelectPlan?.(plan.id)}
                                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mb-6 ${
                                    plan.highlight
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : plan.id === 'free'
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {plan.cta}
                                <ArrowRight size={16} />
                            </button>

                            {/* Features */}
                            <ul className="space-y-2.5">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        {feature.included ? (
                                            <Check size={18} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-green-300' : 'text-green-500'}`} />
                                        ) : feature.pro ? (
                                            <Crown size={18} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-yellow-300' : 'text-amber-500'}`} />
                                        ) : (
                                            <X size={18} className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-300' : 'text-slate-300'}`} />
                                        )}
                                        <span className={`text-sm ${
                                            feature.included
                                                ? plan.highlight ? 'text-white' : 'text-slate-700'
                                                : plan.highlight ? 'text-indigo-300' : 'text-slate-400'
                                        }`}>
                                            {feature.text}
                                            {feature.new && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                    NEW
                                                </span>
                                            )}
                                            {feature.pro && !feature.included && (
                                                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                                                    PRO
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Feature Comparison */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                    Compare All Features
                </h2>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Feature</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-700">Free</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-700">One-Time</th>
                                    <th className="text-center py-4 px-4 font-semibold text-indigo-600 bg-indigo-50">Pro</th>
                                    <th className="text-center py-4 px-4 font-semibold text-slate-700">Pro+</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { feature: 'Basic Poll Types', free: true, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Visual Poll (Images)', free: false, oneTime: false, pro: true, proPlus: true },
                                    { feature: 'Unlimited Polls', free: true, oneTime: '1 poll', pro: true, proPlus: true },
                                    { feature: 'Unlimited Responses', free: true, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Remove Ads', free: false, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Remove Branding', free: false, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Basic Analytics', free: false, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Advanced Analytics', free: false, oneTime: false, pro: false, proPlus: true },
                                    { feature: 'Download CSV/PDF', free: false, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Custom Logo Upload', free: false, oneTime: true, pro: true, proPlus: true },
                                    { feature: 'Custom Short Links', free: false, oneTime: false, pro: false, proPlus: true },
                                    { feature: 'White-label Embeds', free: false, oneTime: false, pro: false, proPlus: true },
                                    { feature: 'Email Notifications', free: false, oneTime: false, pro: false, proPlus: true },
                                    { feature: 'Priority Support', free: false, oneTime: false, pro: true, proPlus: true },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="py-3 px-6 text-sm text-slate-700">{row.feature}</td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.free === 'boolean' ? (
                                                row.free ? <Check size={18} className="mx-auto text-green-500" /> : <X size={18} className="mx-auto text-slate-300" />
                                            ) : (
                                                <span className="text-sm text-slate-600">{row.free}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.oneTime === 'boolean' ? (
                                                row.oneTime ? <Check size={18} className="mx-auto text-green-500" /> : <X size={18} className="mx-auto text-slate-300" />
                                            ) : (
                                                <span className="text-sm text-slate-600">{row.oneTime}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center bg-indigo-50/50">
                                            {typeof row.pro === 'boolean' ? (
                                                row.pro ? <Check size={18} className="mx-auto text-green-500" /> : <X size={18} className="mx-auto text-slate-300" />
                                            ) : (
                                                <span className="text-sm text-slate-600">{row.pro}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.proPlus === 'boolean' ? (
                                                row.proPlus ? <Check size={18} className="mx-auto text-green-500" /> : <X size={18} className="mx-auto text-slate-300" />
                                            ) : (
                                                <span className="text-sm text-slate-600">{row.proPlus}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: Shield, label: 'Secure Payments', sub: 'SSL encrypted' },
                        { icon: Users, label: '10K+ Users', sub: 'Trust VoteGenerator' },
                        { icon: Star, label: '4.9/5 Rating', sub: 'Customer reviews' },
                        { icon: Lock, label: 'Privacy First', sub: 'No signup required' },
                    ].map((badge, i) => (
                        <div key={i} className="p-4">
                            <badge.icon size={32} className="mx-auto text-indigo-600 mb-2" />
                            <div className="font-bold text-slate-900">{badge.label}</div>
                            <div className="text-sm text-slate-500">{badge.sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto px-4 pb-20">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-semibold text-slate-900">{faq.q}</span>
                                <HelpCircle size={20} className={`text-slate-400 transition-transform ${showFAQ === i ? 'rotate-180' : ''}`} />
                            </button>
                            {showFAQ === i && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="px-4 pb-4"
                                >
                                    <p className="text-slate-600">{faq.a}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Footer */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to create better polls?
                    </h2>
                    <p className="text-indigo-200 mb-8">
                        Start free, no credit card required. Upgrade anytime.
                    </p>
                    <button
                        onClick={() => onSelectPlan?.('free')}
                        className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
                    >
                        Create Your First Poll Free →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
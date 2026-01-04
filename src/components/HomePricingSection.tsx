// ============================================================================
// PricingSection.tsx - Clear pricing with "per poll" messaging
// Location: src/components/PricingSection.tsx
// Shows expiration dates and makes it clear these are one-time per-poll charges
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Check, X, Zap, Crown, Sparkles, Clock, Users, 
    BarChart3, Download, Image, Shield, ArrowRight,
    CalendarDays
} from 'lucide-react';
import { useGeoPricing } from '../geoPricing';

// Calculate expiration date based on days from now
const getExpirationDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
};

interface PricingCardProps {
    tier: 'pro' | 'business';
    name: string;
    price: string | number;
    currency: string;
    symbol: string;
    description: string;
    pollCount: string;
    responses: string;
    activeDays: number;
    features: { text: string; included: boolean }[];
    gradient: string;
    icon: React.ReactNode;
    badge?: string;
    popular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
    tier,
    name,
    price,
    currency,
    symbol,
    description,
    pollCount,
    responses,
    activeDays,
    features,
    gradient,
    icon,
    badge,
    popular
}) => {
    const expirationDate = getExpirationDate(activeDays);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                popular ? 'ring-2 ring-purple-500 scale-105' : 'border border-slate-200'
            }`}
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                </div>
            )}
            
            {/* Header */}
            <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{name}</h3>
                        <p className="text-white/80 text-sm">{description}</p>
                    </div>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{symbol}{price}</span>
                    <span className="text-white/80">{currency}</span>
                </div>
                
                {/* Per-poll clarification */}
                <div className="mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                    <span className="text-sm font-semibold">
                        {tier === 'business' ? '1-year access' : `per poll • ${pollCount}`}
                    </span>
                </div>
            </div>
            
            {/* Expiration Info */}
            <div className={`px-6 py-3 border-b flex items-center justify-between ${
                tier === 'business' ? 'bg-amber-50 border-amber-200' :
                tier === 'pro' ? 'bg-purple-50 border-purple-200' :
                'bg-blue-50 border-blue-200'
            }`}>
                <div className="flex items-center gap-2">
                    <CalendarDays size={16} className={
                        tier === 'business' ? 'text-amber-600' :
                        tier === 'pro' ? 'text-purple-600' :
                        'text-blue-600'
                    } />
                    <span className={`text-sm font-medium ${
                        tier === 'business' ? 'text-amber-700' :
                        tier === 'pro' ? 'text-purple-700' :
                        'text-blue-700'
                    }`}>
                        {tier === 'business' ? 'Valid for 1 year' : `Active for ${activeDays} days`}
                    </span>
                </div>
                <span className={`text-xs font-semibold ${
                    tier === 'business' ? 'text-amber-600' :
                    tier === 'pro' ? 'text-purple-600' :
                    'text-blue-600'
                }`}>
                    Until {expirationDate}
                </span>
            </div>
            
            {/* Quick Stats */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-100">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">{pollCount}</div>
                    <div className="text-xs text-slate-500">poll{pollCount !== '1' ? 's' : ''}</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate-800">{responses}</div>
                    <div className="text-xs text-slate-500">responses</div>
                </div>
            </div>
            
            {/* Features */}
            <div className="p-6">
                <ul className="space-y-3">
                    {features.map((feature, i) => (
                        <li key={i} className={`flex items-center gap-3 ${
                            feature.included ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                            {feature.included ? (
                                <Check size={18} className="text-emerald-500 flex-shrink-0" />
                            ) : (
                                <X size={18} className="text-slate-300 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${!feature.included ? 'line-through' : ''}`}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
                
                {/* CTA Button */}
                <a
                    href={`/.netlify/functions/vg-checkout?tier=${tier}`}
                    className={`mt-6 w-full py-3 px-4 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2`}
                >
                    Get {name} <ArrowRight size={18} />
                </a>
                
                {/* One-time payment note */}
                <p className="mt-3 text-center text-xs text-slate-500">
                    💳 One-time payment • No subscription • No auto-renew
                </p>
            </div>
        </motion.div>
    );
};

// Main Pricing Section Component
const PricingSection: React.FC = () => {
    const { loading, currency, prices } = useGeoPricing();
    
    const tiers = [
        {
            tier: 'pro' as const,
            name: 'Pro',
            description: 'Perfect for a quick poll',
            pollCount: '1',
            responses: '500',
            activeDays: 30,
            gradient: 'from-blue-500 to-indigo-600',
            icon: <Zap size={24} />,
            features: [
                { text: '6 poll types', included: true },
                { text: '500 responses', included: true },
                { text: '30 days active', included: true },
                { text: 'Export to CSV', included: true },
                { text: 'No ads', included: true },
                { text: 'Visual Poll (images)', included: false },
                { text: 'PDF/PNG export', included: false },
            ]
        },
        {
            tier: 'pro' as const,
            name: 'Pro Event',
            description: 'Great for events & teams',
            pollCount: '3',
            responses: '2,000',
            activeDays: 60,
            gradient: 'from-purple-500 to-pink-500',
            icon: <Crown size={24} />,
            popular: true,
            features: [
                { text: '7 poll types (incl. Visual)', included: true },
                { text: '2,000 responses per poll', included: true },
                { text: '60 days active per poll', included: true },
                { text: '3 polls included', included: true },
                { text: 'Export CSV, PDF, PNG', included: true },
                { text: 'No ads', included: true },
                { text: 'Priority support', included: true },
            ]
        },
        {
            tier: 'business' as const,
            name: 'Business',
            description: 'For power users',
            pollCount: '∞',
            responses: '10,000',
            activeDays: 365,
            gradient: 'from-amber-500 to-orange-500',
            icon: <Sparkles size={24} />,
            badge: 'BEST VALUE',
            features: [
                { text: '7 poll types (incl. Visual)', included: true },
                { text: '10,000 responses per poll', included: true },
                { text: '1 year access', included: true },
                { text: 'Business polls', included: true },
                { text: 'Export CSV, PDF, PNG', included: true },
                { text: 'PIN protection', included: true },
                { text: 'Team access tokens (10)', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Priority support', included: true },
            ]
        }
    ];
    
    const priceMap: Record<string, string | number> = {
        pro: prices.pro,
        business: prices.business
    };

    return (
        <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                            Simple, Transparent Pricing
                        </span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Choose Your Plan
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            One-time payment per poll. No subscriptions. No hidden fees.
                        </p>
                    </motion.div>
                </div>
                
                {/* Free Tier Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 p-4 bg-white rounded-xl border-2 border-dashed border-slate-300 text-center"
                >
                    <p className="text-slate-600">
                        <span className="font-bold text-slate-800">🆓 Free Forever:</span>
                        {' '}1 poll • 50 responses • 7 days • Basic features
                        {' '}—{' '}
                        <a href="#create" className="text-indigo-600 font-semibold hover:underline">
                            Create free poll →
                        </a>
                    </p>
                </motion.div>
                
                {/* Pricing Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {tiers.map((tier) => (
                            <PricingCard
                                key={tier.tier}
                                {...tier}
                                price={priceMap[tier.tier]}
                                currency={currency}
                                symbol={prices.symbol}
                            />
                        ))}
                    </div>
                )}
                
                {/* FAQ / Clarification */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-6 flex-wrap justify-center text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                            <Check size={16} className="text-emerald-500" />
                            One-time payment
                        </span>
                        <span className="flex items-center gap-2">
                            <Check size={16} className="text-emerald-500" />
                            No subscription
                        </span>
                        <span className="flex items-center gap-2">
                            <Check size={16} className="text-emerald-500" />
                            Instant access
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield size={16} className="text-emerald-500" />
                            Secure checkout via Stripe
                        </span>
                    </div>
                </motion.div>
                
                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-6 bg-white rounded-2xl shadow-lg border border-slate-200"
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                        How Paid Plans Work
                    </h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Purchase', desc: 'One-time payment via Stripe' },
                            { step: '2', title: 'Get Dashboard', desc: 'Instant access to your dashboard' },
                            { step: '3', title: 'Create Polls', desc: 'Use your poll credits anytime' },
                            { step: '4', title: 'Collect Votes', desc: 'Share & watch results live' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                                    {item.step}
                                </div>
                                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
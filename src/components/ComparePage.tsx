// ============================================================================
// ComparePage - Plan Comparison Page (USD Only)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Crown, Star, Users, Zap, Building2 } from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

const ComparePage: React.FC = () => {
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const plans = [
        {
            name: 'Free',
            price: 0,
            period: 'forever',
            icon: Users,
            gradient: 'from-slate-500 to-slate-600',
            description: 'Perfect for trying out',
        },
        {
            name: 'Pro',
            price: 16,
            yearlyPrice: 190,
            period: '/month USD',
            icon: Crown,
            gradient: 'from-purple-500 to-pink-500',
            description: 'For growing teams',
            popular: true,
        },
        {
            name: 'Business',
            price: 41,
            yearlyPrice: 490,
            period: '/month USD',
            icon: Building2,
            gradient: 'from-amber-500 to-orange-500',
            description: 'For organizations',
        },
    ];

    const features = [
        // Limits
        { name: 'Responses per month', free: '100', pro: '5,000', business: '50,000' },
        { name: 'Active polls', free: '3', pro: 'Unlimited', business: 'Unlimited' },
        { name: 'Poll duration', free: '30 days', pro: '1 year', business: '1 year' },
        // Poll Types
        { name: 'All 8 poll types', free: true, pro: true, business: true },
        // Sharing
        { name: 'Shareable link', free: true, pro: true, business: true },
        { name: 'QR code sharing', free: true, pro: true, business: true },
        { name: 'Embed on website', free: true, pro: true, business: true },
        { name: 'Social sharing', free: true, pro: true, business: true },
        // Results & Analytics
        { name: 'Real-time results', free: true, pro: true, business: true },
        { name: 'Visual charts', free: true, pro: true, business: true },
        { name: 'Response timeline', free: false, pro: true, business: true },
        { name: 'Geographic distribution', free: false, pro: true, business: true },
        { name: 'Device breakdown', free: false, pro: true, business: true },
        { name: 'Hourly heatmap', free: false, pro: false, business: true },
        // Export
        { name: 'CSV export', free: false, pro: true, business: true },
        { name: 'Excel export', free: false, pro: true, business: true },
        { name: 'PDF reports', free: false, pro: false, business: true },
        // Customization
        { name: 'Themes', free: '3 themes', pro: 'All 12+', business: 'All 12+' },
        { name: 'Remove VoteGenerator badge', free: false, pro: true, business: true },
        { name: 'Custom colors', free: false, pro: true, business: true },
        { name: 'Upload custom logo', free: false, pro: false, business: true },
        { name: 'Custom short links', free: false, pro: false, business: true },
        // Security
        { name: 'Anti-fraud protection', free: true, pro: true, business: true },
        { name: 'PIN code access', free: false, pro: true, business: true },
        { name: 'One-time vote codes', free: false, pro: true, business: true },
        { name: 'IP allowlist/blocklist', free: false, pro: false, business: true },
        // Management
        { name: 'Email notifications', free: false, pro: true, business: true },
        { name: 'Scheduled close', free: false, pro: true, business: true },
        { name: 'Duplicate polls', free: false, pro: true, business: true },
        // Support
        { name: 'Email support', free: false, pro: true, business: true },
        { name: 'Priority support', free: false, pro: false, business: true },
    ];

    const renderValue = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            return value ? (
                <Check className="w-5 h-5 text-emerald-500 mx-auto" />
            ) : (
                <X className="w-5 h-5 text-slate-300 mx-auto" />
            );
        }
        return <span className="text-slate-700 font-medium">{value}</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}
            
            <main className="max-w-6xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Compare Plans
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that's right for you. All plans include all 8 poll types.
                    </p>
                </motion.div>

                {/* Plan Headers */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="col-span-1" /> {/* Empty corner */}
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-center p-6 rounded-2xl ${
                                plan.popular ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' : 'bg-white'
                            } shadow-lg`}
                        >
                            {plan.popular && (
                                <span className="inline-block px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold mb-2">
                                    Most Popular
                                </span>
                            )}
                            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}>
                                <plan.icon size={24} />
                            </div>
                            <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.name}
                            </h3>
                            <div className={`text-2xl font-black mt-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                {plan.period !== 'forever' && (
                                    <span className={`text-sm font-normal ${plan.popular ? 'text-white/70' : 'text-slate-500'}`}>
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                            {plan.yearlyPrice && (
                                <p className={`text-sm mt-1 ${plan.popular ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    or ${plan.yearlyPrice}/year USD <span className="text-amber-400 font-semibold">(2 months free)</span>
                                </p>
                            )}
                            <p className={`text-sm mt-2 ${plan.popular ? 'text-white/80' : 'text-slate-500'}`}>
                                {plan.description}
                            </p>
                            <a
                                href={plan.price === 0 ? '/#create' : `/pricing`}
                                className={`inline-block mt-4 px-6 py-2 rounded-lg font-semibold transition ${
                                    plan.popular
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                                }`}
                            >
                                {plan.price === 0 ? 'Get Started' : 'Get ' + plan.name}
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left py-4 px-6 font-semibold text-slate-700">Feature</th>
                                <th className="text-center py-4 px-6 font-semibold text-slate-700">Free</th>
                                <th className="text-center py-4 px-6 font-semibold text-indigo-600">Pro</th>
                                <th className="text-center py-4 px-6 font-semibold text-amber-600">Business</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr 
                                    key={feature.name}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                                >
                                    <td className="py-4 px-6 text-slate-700">{feature.name}</td>
                                    <td className="py-4 px-6 text-center">{renderValue(feature.free)}</td>
                                    <td className="py-4 px-6 text-center">{renderValue(feature.pro)}</td>
                                    <td className="py-4 px-6 text-center">{renderValue(feature.business)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Bottom note */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    All prices in USD. Annual plans save you 2 months.
                </p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 mb-4">
                        Not sure which plan is right for you?
                    </p>
                    <a
                        href="/#create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                        <Zap size={20} />
                        Start Free - No Credit Card Required
                    </a>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default ComparePage;
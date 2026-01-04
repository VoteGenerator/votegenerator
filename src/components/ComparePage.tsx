// ============================================================================
// ComparePage - Plan Comparison Page
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Crown, Star, Users, BarChart3, Zap } from 'lucide-react';
import { useGeoPricing } from '../geoPricing';
import NavHeader from './NavHeader';
import Footer from './Footer';

const ComparePage: React.FC = () => {
    const { prices, currency } = useGeoPricing();

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
            price: prices.pro,
            period: '/month',
            icon: Crown,
            gradient: 'from-purple-500 to-pink-500',
            description: 'For growing teams',
            popular: true,
        },
        {
            name: 'Business',
            price: prices.business,
            period: '/month',
            icon: Star,
            gradient: 'from-amber-500 to-orange-500',
            description: 'For organizations',
        },
    ];

    const features = [
        { name: 'Responses per month', free: '100', pro: '5,000', business: '50,000' },
        { name: 'Active polls', free: '3', pro: 'Unlimited', business: 'Unlimited' },
        { name: 'Poll duration', free: '30 days', pro: '1 year', business: '1 year' },
        { name: 'All poll types', free: true, pro: true, business: true },
        { name: 'Real-time results', free: true, pro: true, business: true },
        { name: 'QR code sharing', free: true, pro: true, business: true },
        { name: 'CSV export', free: false, pro: true, business: true },
        { name: 'PDF/PNG export', free: false, pro: true, business: true },
        { name: 'Custom branding', free: false, pro: true, business: true },
        { name: 'Remove ads', free: false, pro: true, business: true },
        { name: 'PIN protection', free: false, pro: false, business: true },
        { name: 'Priority support', free: false, pro: false, business: true },
        { name: 'Team features', free: false, pro: false, business: true },
    ];

    const renderValue = (value: boolean | string) => {
        if (typeof value === 'boolean') {
            return value ? (
                <Check className="w-5 h-5 text-green-500 mx-auto" />
            ) : (
                <X className="w-5 h-5 text-slate-300 mx-auto" />
            );
        }
        return <span className="text-slate-700 font-medium">{value}</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
            <NavHeader />
            
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
                        Choose the plan that's right for you. All plans include core features.
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
                                plan.popular ? 'bg-purple-600 text-white' : 'bg-white'
                            } shadow-lg`}
                        >
                            {plan.popular && (
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
                                    Most Popular
                                </span>
                            )}
                            <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${plan.gradient} text-white`}>
                                <plan.icon size={24} />
                            </div>
                            <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.name}
                            </h3>
                            <div className={`text-2xl font-bold mt-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                                {plan.price === 0 ? 'Free' : `${prices.symbol}${plan.price}`}
                                {plan.period !== 'forever' && (
                                    <span className={`text-sm font-normal ${plan.popular ? 'text-white/70' : 'text-slate-500'}`}>
                                        {plan.period}
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm mt-2 ${plan.popular ? 'text-white/80' : 'text-slate-500'}`}>
                                {plan.description}
                            </p>
                            <a
                                href={plan.price === 0 ? '/#create' : `/.netlify/functions/vg-checkout?tier=${plan.name.toLowerCase()}`}
                                className={`inline-block mt-4 px-6 py-2 rounded-lg font-semibold transition ${
                                    plan.popular
                                        ? 'bg-white text-purple-600 hover:bg-purple-50'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                                }`}
                            >
                                {plan.price === 0 ? 'Get Started' : 'Subscribe'}
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
                                <th className="text-center py-4 px-6 font-semibold text-purple-600">Pro</th>
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
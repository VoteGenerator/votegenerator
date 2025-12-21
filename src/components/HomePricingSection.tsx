// ============================================================================
// Home Page Pricing Preview Section
// Shows simplified pricing cards (3 main tiers) with link to full pricing
// UPDATED: New 4-tier structure (Free, Starter, Pro Event, Unlimited)
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Crown, Star, Users } from 'lucide-react';

const HomePricingSection: React.FC = () => {
    const tiers = [
        {
            name: 'Free',
            price: '$0',
            period: '',
            description: 'Perfect for trying it out',
            color: 'slate',
            features: [
                '6 free poll types',
                '50 responses per poll',
                '7 days active',
                'QR code sharing',
                'Real-time results',
            ],
            cta: 'Get Started Free',
            ctaLink: '/create',
            icon: Users,
        },
        {
            name: 'Starter',
            price: '$9.99',
            period: 'one-time',
            description: 'For your next event',
            color: 'blue',
            popular: false,
            features: [
                'Everything in Free',
                '500 responses',
                '30 days active',
                'CSV export',
                'Device & geo stats',
            ],
            cta: 'Get Starter',
            ctaLink: '/pricing',
            icon: Zap,
        },
        {
            name: 'Pro Event',
            price: '$19.99',
            period: 'one-time',
            description: 'For important events',
            color: 'purple',
            popular: true,
            features: [
                'Everything in Starter',
                '2,000 responses',
                'Visual Poll (images)',
                'PDF & PNG export',
                'Remove branding',
            ],
            cta: 'Get Pro Event',
            ctaLink: '/pricing',
            icon: Crown,
        },
    ];

    const colorClasses: Record<string, { bg: string; border: string; text: string; button: string }> = {
        slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900 text-white' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white' },
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                    >
                        Simple, Transparent Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Choose the plan that works for you
                    </motion.p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {tiers.map((tier, index) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;

                        return (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl shadow-purple-100' : 'border-slate-200'} bg-white overflow-hidden`}
                            >
                                {/* Popular badge */}
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                        <Star className="inline-block mr-1" size={14} />
                                        Best Value
                                    </div>
                                )}

                                <div className={`p-6 ${tier.popular ? 'pt-12' : ''}`}>
                                    {/* Icon & Name */}
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{tier.description}</p>

                                    {/* Price */}
                                    <div className="mt-4 mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                                            {tier.period && (
                                                <span className="text-slate-500 text-sm">{tier.period}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <a
                                        href={tier.ctaLink}
                                        className={`w-full py-3 ${colors.button} font-medium rounded-xl transition flex items-center justify-center gap-2`}
                                    >
                                        {tier.cta}
                                        <ArrowRight size={18} />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View Full Pricing Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <a
                        href="/pricing"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
                    >
                        View full pricing with all 4 plans & feature comparison
                        <ArrowRight size={18} />
                    </a>
                    <p className="text-slate-500 text-sm mt-2">
                        Including Unlimited ($199/year) for power users
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HomePricingSection;
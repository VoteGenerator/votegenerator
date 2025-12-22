// ============================================================================
// HomePricingSection - Geo-Aware Pricing for Landing Page
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star, ArrowRight, Users, Clock, BarChart3, Loader2, Globe } from 'lucide-react';
import { useGeoPricing } from '../geoPricing';

const HomePricingSection: React.FC = () => {
    const { loading, currency, prices } = useGeoPricing();

    const tiers = [
        {
            name: 'Free',
            price: 0,
            period: 'forever',
            description: 'Perfect for quick polls',
            features: ['50 responses per poll', '7 days active', '6 poll types', 'QR code sharing'],
            cta: 'Create Free Poll',
            href: '/create',
            color: 'slate',
            popular: false,
        },
        {
            name: 'Pro Event',
            price: prices.proEvent,
            period: 'one-time',
            description: 'For important events',
            features: ['2,000 responses', '60 days active', 'Visual Poll (images)', 'Export PDF & PNG', 'Remove branding'],
            cta: 'Get Pro Event',
            href: '/.netlify/functions/vg-checkout?tier=pro_event',
            color: 'purple',
            popular: true,
        },
        {
            name: 'Unlimited',
            price: prices.unlimited,
            period: 'one-time / year',
            description: 'For power users',
            features: ['5,000 responses per poll', 'Unlimited premium polls', '1 year per poll', 'Priority support'],
            cta: 'Get Unlimited',
            href: '/.netlify/functions/vg-checkout?tier=unlimited',
            color: 'amber',
            popular: false,
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-6xl mx-auto px-4">
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
                        className="text-lg text-slate-600 mb-4"
                    >
                        Start free. Pay once when you need more. No subscriptions.
                    </motion.p>
                    
                    {/* Currency indicator */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        whileInView={{ opacity: 1 }} 
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 text-sm text-slate-500"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" />
                                Loading prices...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                                <Globe size={14} />
                                Prices in <strong>{currency}</strong>
                            </span>
                        )}
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-2xl border-2 ${
                                tier.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'
                            } p-6 flex flex-col`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                <p className="text-slate-500 text-sm">{tier.description}</p>
                            </div>

                            <div className="mb-6">
                                {tier.price === 0 ? (
                                    <span className="text-4xl font-bold text-slate-900">Free</span>
                                ) : loading ? (
                                    <span className="text-4xl font-bold text-slate-300">...</span>
                                ) : (
                                    <>
                                        <span className="text-4xl font-bold text-slate-900">
                                            {prices.symbol}{tier.price % 1 === 0 ? tier.price : tier.price.toFixed(2)}
                                        </span>
                                        <span className="text-slate-500 ml-1">{currency}</span>
                                    </>
                                )}
                                <div className="text-sm text-slate-500">{tier.period}</div>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                        <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={tier.href}
                                className={`w-full py-3 rounded-xl font-semibold text-center transition flex items-center justify-center gap-2 ${
                                    tier.popular
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : tier.color === 'amber'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                                }`}
                            >
                                {tier.cta} <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a href="/pricing" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        View full pricing comparison →
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HomePricingSection;
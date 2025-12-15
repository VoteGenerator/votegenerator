import React from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    X, 
    Sparkles,
    ArrowRight,
    Shield,
    Zap,
    Users,
    DollarSign
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

const ComparePage: React.FC = () => {
    const competitors = [
        {
            name: 'VoteGenerator',
            highlight: true,
            features: {
                signupRequired: false,
                freeTier: 'Unlimited polls',
                pricePro: '$9/mo',
                pollTypes: 12,
                customBranding: true,
                analytics: true,
                embed: true,
                api: false,
                dataPrivacy: 'Privacy-first',
            }
        },
        {
            name: 'Strawpoll',
            highlight: false,
            features: {
                signupRequired: false,
                freeTier: 'Limited',
                pricePro: '$5/mo',
                pollTypes: 3,
                customBranding: false,
                analytics: false,
                embed: true,
                api: false,
                dataPrivacy: 'Ads & tracking',
            }
        },
        {
            name: 'Poll Everywhere',
            highlight: false,
            features: {
                signupRequired: true,
                freeTier: '25 responses',
                pricePro: '$19/mo',
                pollTypes: 8,
                customBranding: true,
                analytics: true,
                embed: true,
                api: true,
                dataPrivacy: 'Enterprise',
            }
        },
        {
            name: 'Mentimeter',
            highlight: false,
            features: {
                signupRequired: true,
                freeTier: '2 questions',
                pricePro: '$12/mo',
                pollTypes: 6,
                customBranding: true,
                analytics: true,
                embed: false,
                api: false,
                dataPrivacy: 'Standard',
            }
        },
    ];

    const featureRows = [
        { key: 'signupRequired', label: 'No Signup Required', type: 'boolean', invert: true },
        { key: 'freeTier', label: 'Free Tier', type: 'string' },
        { key: 'pricePro', label: 'Pro Price', type: 'string' },
        { key: 'pollTypes', label: 'Poll Types', type: 'number' },
        { key: 'customBranding', label: 'Custom Branding', type: 'boolean' },
        { key: 'analytics', label: 'Analytics', type: 'boolean' },
        { key: 'embed', label: 'Embed Support', type: 'boolean' },
        { key: 'api', label: 'API Access', type: 'boolean' },
        { key: 'dataPrivacy', label: 'Data Privacy', type: 'string' },
    ];

    const whyUs = [
        {
            icon: Shield,
            title: 'Privacy-First',
            description: 'No signup, no tracking, no data selling. Your polls, your data.'
        },
        {
            icon: Zap,
            title: 'Instant Creation',
            description: 'Create a poll in under 30 seconds. Share immediately.'
        },
        {
            icon: Users,
            title: 'Made for Teams',
            description: '12 poll types for every decision - from lunch orders to roadmap planning.'
        },
        {
            icon: DollarSign,
            title: 'Fair Pricing',
            description: 'Generous free tier. Pro features at half the competitor price.'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Promo Banner */}
            <PromoBanner position="top" />
            <div className="h-12" />
            
            {/* Nav Header */}
            <NavHeader />

            {/* Hero */}
            <div className="pt-16 pb-12 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        How We Compare
                    </h1>
                    <p className="text-xl text-slate-600">
                        See how VoteGenerator stacks up against other polling tools
                    </p>
                </motion.div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left p-4 font-semibold text-slate-600">Feature</th>
                                    {competitors.map((comp) => (
                                        <th 
                                            key={comp.name}
                                            className={`text-center p-4 font-semibold w-32 ${
                                                comp.highlight 
                                                    ? 'bg-indigo-50 text-indigo-700' 
                                                    : 'text-slate-600'
                                            }`}
                                        >
                                            {comp.name}
                                            {comp.highlight && (
                                                <span className="block text-xs font-normal text-indigo-500 mt-1">
                                                    (That's us!)
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {featureRows.map((row, i) => (
                                    <tr key={row.key} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                                        <td className="p-4 text-slate-700 font-medium">{row.label}</td>
                                        {competitors.map((comp) => {
                                            const value = comp.features[row.key as keyof typeof comp.features];
                                            return (
                                                <td 
                                                    key={comp.name} 
                                                    className={`p-4 text-center ${
                                                        comp.highlight ? 'bg-indigo-50/50' : ''
                                                    }`}
                                                >
                                                    {row.type === 'boolean' ? (
                                                        row.invert ? (
                                                            !value ? (
                                                                <X size={18} className="text-slate-300 mx-auto" />
                                                            ) : (
                                                                <Check size={18} className={`mx-auto ${comp.highlight ? 'text-green-500' : 'text-green-500'}`} />
                                                            )
                                                        ) : (
                                                            value ? (
                                                                <Check size={18} className={`mx-auto ${comp.highlight ? 'text-green-500' : 'text-green-500'}`} />
                                                            ) : (
                                                                <X size={18} className="text-slate-300 mx-auto" />
                                                            )
                                                        )
                                                    ) : row.type === 'number' ? (
                                                        <span className={`font-semibold ${comp.highlight ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                            {value}
                                                        </span>
                                                    ) : (
                                                        <span className={`text-sm ${comp.highlight ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
                                                            {value}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Why Us Section */}
            <div className="bg-slate-50 py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                        Why Choose VoteGenerator?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyUs.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-xl p-6 border border-slate-200"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon size={24} className="text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to try the difference?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        Create your first poll in 30 seconds. No signup required.
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ComparePage;
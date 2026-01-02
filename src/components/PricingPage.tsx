// ============================================================================
// PricingPage - Full pricing with geo-detected currency
// UPDATED: Clear "per poll" messaging, dynamic expiration dates
// Pro Event = 3 polls, Unlimited = 10,000 responses
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Users, BarChart3, Clock, ArrowRight, Star, ChevronDown, Sparkles, Shield, BadgeCheck, CreditCard, Loader2, Share2, Palette, CheckSquare, Globe, CalendarDays, AlertCircle } from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import { useGeoPricing } from '../geoPricing';

// Calculate expiration date
const getExpirationDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const FEATURE_COMPARISON = [
    { category: 'Limits', icon: BarChart3, features: [
        { name: 'Responses per poll', free: '50', starter: '500', proEvent: '2,000', unlimitedEvent: '10,000', unlimited: '10,000' },
        { name: 'Poll duration', free: '7 days', starter: '30 days', proEvent: '30 days', unlimitedEvent: '30 days', unlimited: '1 year' },
        { name: 'Polls included', free: '1', starter: '1 poll', proEvent: '3 polls', unlimitedEvent: 'Unlimited', unlimited: 'Unlimited' },
    ]},
    { category: 'Poll Types', icon: CheckSquare, features: [
        { name: 'Multiple Choice', free: true, starter: true, proEvent: true, unlimitedEvent: true, unlimited: true },
        { name: 'Visual Poll (images)', free: false, starter: false, proEvent: true, unlimitedEvent: true, unlimited: true },
    ]},
    { category: 'Export', icon: Share2, features: [
        { name: 'Export CSV', free: false, starter: true, proEvent: true, unlimitedEvent: true, unlimited: true },
        { name: 'Export PDF & PNG', free: false, starter: false, proEvent: true, unlimitedEvent: true, unlimited: true },
    ]},
    { category: 'Customization', icon: Palette, features: [
        { name: 'Remove branding', free: false, starter: false, proEvent: true, unlimitedEvent: true, unlimited: true },
        { name: 'PIN protection', free: false, starter: false, proEvent: false, unlimitedEvent: true, unlimited: true },
        { name: 'Custom branding', free: false, starter: false, proEvent: false, unlimitedEvent: true, unlimited: true },
    ]},
];

const FeatureCell: React.FC<{ value: boolean | string }> = ({ value }) => {
    if (typeof value === 'boolean') {
        return value ? <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><Check className="text-emerald-600" size={14} /></div> : <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><X className="text-slate-400" size={14} /></div>;
    }
    return <span className="text-slate-700 text-sm font-semibold">{value}</span>;
};

function PricingPage(): React.ReactElement {
    const [showComparison, setShowComparison] = useState(false);
    const { loading, currency, prices } = useGeoPricing();

    const TIERS = [
        { 
            id: 'free', 
            name: 'Free', 
            tagline: 'Try it out', 
            price: 0, 
            icon: Users, 
            color: 'slate', 
            cta: 'Create Free Poll', 
            ctaLink: '/#create', 
            badge: 'Forever Free',
            pollCount: 1,
            activeDays: 7,
            features: { 
                responses: '50 responses', 
                duration: '7 days access', 
                polls: '1 poll',
                highlights: ['6 poll types', 'QR code sharing', 'Real-time results', 'Embed on your site'] 
            }
        },
        { 
            id: 'starter', 
            name: 'Starter', 
            tagline: 'For a quick poll', 
            price: prices.starter, 
            icon: Zap, 
            color: 'blue', 
            cta: 'Get Starter', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=starter', 
            badge: 'One-Time',
            pollCount: 1,
            activeDays: 30,
            features: { 
                responses: '500 responses', 
                duration: '30 days access', 
                polls: '1 poll included',
                highlights: ['Everything in Free', 'Export to CSV', 'Device breakdown stats', 'No ads'] 
            }
        },
        { 
            id: 'pro_event', 
            name: 'Pro Event', 
            tagline: 'For events & teams', 
            price: prices.proEvent, 
            popular: true, 
            icon: Crown, 
            color: 'purple', 
            cta: 'Get Pro Event', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=pro_event', 
            badge: 'One-Time',
            pollCount: 3,
            activeDays: 30,
            features: { 
                responses: '2,000 responses/poll', 
                duration: '30 days access', 
                polls: '3 polls included',
                highlights: ['Everything in Starter', 'Visual Poll (images)', 'Export PDF & PNG', 'Remove VG branding', 'Custom short link'] 
            }
        },
        { 
            id: 'unlimited_event', 
            name: 'Unlimited Event', 
            tagline: 'All features, one event', 
            price: prices.unlimitedEvent, 
            periodNote: '30 days access', 
            icon: Sparkles, 
            color: 'orange', 
            cta: 'Get Unlimited Event', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=unlimited_event', 
            badge: 'Try Everything',
            pollCount: 1,
            activeDays: 30,
            features: { 
                responses: '10,000 responses', 
                duration: '30 days access', 
                polls: '1 poll included',
                highlights: ['ALL premium features', 'PIN protection', 'Custom branding', 'Team tokens', 'Priority support', 'Perfect for trying Unlimited'] 
            }
        },
        { 
            id: 'unlimited', 
            name: 'Unlimited', 
            tagline: 'For power users', 
            price: prices.unlimited, 
            periodNote: '1 year access', 
            icon: Star, 
            color: 'amber', 
            cta: 'Get Unlimited', 
            ctaLink: '/.netlify/functions/vg-checkout?tier=unlimited', 
            badge: 'Best Value',
            pollCount: -1, // unlimited
            activeDays: 365,
            features: { 
                responses: '10,000 per poll', 
                duration: '1 year access', 
                polls: 'Unlimited polls',
                highlights: ['Everything in Pro Event', 'Unlimited polls', 'PIN protection', 'Team access tokens', 'Upload your logo', 'Priority support'] 
            }
        },
    ];

    const colorClasses: Record<string, { bg: string; text: string; button: string; light: string; border: string }> = {
        slate: { bg: 'bg-slate-100', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900 text-white', light: 'bg-slate-50', border: 'border-slate-200' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700 text-white', light: 'bg-blue-50', border: 'border-blue-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700 text-white', light: 'bg-purple-50', border: 'border-purple-200' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', button: 'bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white', light: 'bg-orange-50', border: 'border-orange-200' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white', light: 'bg-amber-50', border: 'border-amber-200' },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <NavHeader />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                    <Shield size={16} /> No signup required • Privacy-first
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-600 max-w-2xl mx-auto mb-6">One-time payment per plan. No subscriptions. No hidden fees.</motion.p>
                
                {/* Key clarification banner */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                    <BadgeCheck className="text-emerald-600" size={24} />
                    <div className="text-left">
                        <p className="text-emerald-900 font-bold">One-Time Payment • Not a Subscription</p>
                        <p className="text-emerald-700 text-sm">Pay once, use your poll credits anytime before expiration</p>
                    </div>
                </motion.div>
                
                {/* Try Risk-Free badge */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 ml-0 md:ml-4">
                    <Shield className="text-blue-600" size={24} />
                    <div className="text-left">
                        <p className="text-blue-900 font-bold">Try It Risk-Free</p>
                        <p className="text-blue-700 text-sm">7-day refund if it's not the right fit*</p>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Detecting location...</> : <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full"><Globe size={14} /> Prices in <strong>{currency}</strong></span>}
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TIERS.map((tier, index) => {
                        const colors = colorClasses[tier.color];
                        const Icon = tier.icon;
                        const expirationDate = getExpirationDate(tier.activeDays);
                        
                        return (
                            <motion.div 
                                key={tier.id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl' : 'border-slate-200'} bg-white overflow-hidden flex flex-col`}
                            >
                                {/* Popular badge */}
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                                        <Star className="inline-block mr-1" size={14} /> Most Popular
                                    </div>
                                )}
                                
                                <div className={`p-6 flex-1 flex flex-col ${tier.popular ? 'pt-12' : ''}`}>
                                    {/* Badge */}
                                    <span className={`self-start px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${
                                        tier.id === 'unlimited' ? 'bg-amber-100 text-amber-700' : 
                                        tier.id === 'free' ? 'bg-slate-100 text-slate-600' : 
                                        tier.id === 'pro_event' ? 'bg-purple-100 text-purple-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        <CreditCard size={10} className="inline mr-1" />{tier.badge}
                                    </span>
                                    
                                    {/* Icon & Name */}
                                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={colors.text} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{tier.tagline}</p>
                                    
                                    {/* Price */}
                                    <div className="mt-4 mb-2">
                                        {tier.price === 0 ? (
                                            <span className="text-4xl font-bold text-slate-900">Free</span>
                                        ) : loading ? (
                                            <span className="text-4xl font-bold text-slate-300">...</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-slate-900">{prices.symbol}{tier.price}</span>
                                                <span className="text-slate-500 text-sm ml-1">{currency}</span>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Period note / polls included */}
                                    {tier.id !== 'free' && (
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${colors.light} ${colors.text}`}>
                                            {tier.pollCount === -1 ? (
                                                <span>Unlimited polls • 1 year</span>
                                            ) : (
                                                <span>{tier.pollCount} poll{tier.pollCount > 1 ? 's' : ''} • {tier.activeDays} days each</span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Expiration date */}
                                    {tier.id !== 'free' && (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.light} ${colors.border} border mb-3`}>
                                            <CalendarDays size={14} className={colors.text} />
                                            <span className="text-xs text-slate-600">
                                                If purchased today: <strong className={colors.text}>expires {expirationDate}</strong>
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Features summary */}
                                    <div className="space-y-2 my-4 py-4 border-y border-slate-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{tier.features.responses}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{tier.features.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <BarChart3 size={16} className="text-slate-400" />
                                            <span className="text-slate-700 font-semibold">{tier.features.polls}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Feature highlights */}
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {tier.features.highlights.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* CTA */}
                                    <a href={tier.ctaLink} className={`w-full py-3 ${colors.button} font-medium rounded-xl transition flex items-center justify-center gap-2`}>
                                        {tier.cta} <ArrowRight size={18} />
                                    </a>
                                    
                                    {/* No subscription note */}
                                    {tier.id !== 'free' && (
                                        <p className="mt-3 text-center text-xs text-slate-400">
                                            💳 One-time • No auto-renew
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* How It Works */}
            <div className="max-w-4xl mx-auto px-4 pb-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-slate-900 mb-6 text-center flex items-center justify-center gap-2">
                        <AlertCircle size={20} className="text-indigo-500" />
                        How Paid Plans Work
                    </h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Purchase', desc: 'One-time payment via Stripe', icon: CreditCard },
                            { step: '2', title: 'Get Dashboard', desc: 'Access your poll dashboard', icon: BarChart3 },
                            { step: '3', title: 'Create Polls', desc: 'Use your credits anytime', icon: Sparkles },
                            { step: '4', title: 'Collect Votes', desc: 'Share & watch results live', icon: Users },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                                    <item.icon size={20} />
                                </div>
                                <div className="text-xs text-indigo-600 font-bold mb-1">Step {item.step}</div>
                                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                        <p className="text-sm text-amber-800">
                            <strong>💡 Starter & Pro Event:</strong> Your poll credits don't start counting down until you activate each poll. 
                            Create a draft, test it, then go live when you're ready!
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Feature Comparison Toggle */}
            <div className="max-w-6xl mx-auto px-4 pb-8">
                <button onClick={() => setShowComparison(!showComparison)} className="w-full py-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl font-semibold text-indigo-700 transition flex items-center justify-center gap-2">
                    {showComparison ? 'Hide' : 'Show'} Full Feature Comparison <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
                </button>
            </div>

            {/* Feature Comparison Table */}
            {showComparison && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 pb-16">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                        <table className="w-full">
                            <thead><tr className="border-b-2 border-slate-200 bg-slate-100">
                                <th className="py-4 px-6 text-left text-sm font-bold text-slate-900 min-w-[200px]">Feature</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-slate-700 w-24">Free</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-blue-700 w-24 bg-blue-50">Starter</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-purple-700 w-24 bg-purple-50">Pro Event</th>
                                <th className="py-4 px-4 text-center text-sm font-bold text-amber-700 w-24 bg-amber-50">Unlimited</th>
                            </tr></thead>
                            <tbody>
                                {FEATURE_COMPARISON.map((section, si) => (
                                    <React.Fragment key={si}>
                                        <tr className="bg-slate-50"><td colSpan={5} className="py-2 px-6 text-xs font-bold text-slate-500 uppercase">{section.category}</td></tr>
                                        {section.features.map((f, fi) => (
                                            <tr key={fi} className="border-b border-slate-100">
                                                <td className="py-3 px-6 text-sm text-slate-700">{f.name}</td>
                                                <td className="py-3 px-4 text-center"><FeatureCell value={f.free} /></td>
                                                <td className="py-3 px-4 text-center bg-blue-50/30"><FeatureCell value={f.starter} /></td>
                                                <td className="py-3 px-4 text-center bg-purple-50/30"><FeatureCell value={f.proEvent} /></td>
                                                <td className="py-3 px-4 text-center bg-amber-50/30"><FeatureCell value={f.unlimited} /></td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* FAQ */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'Are these really one-time payments?', a: 'Yes! All plans are one-time payments. No subscriptions, no recurring charges, no auto-renewal.' },
                        { q: 'What does "3 polls included" mean for Pro Event?', a: 'Pro Event gives you 3 poll credits. Each poll you create uses 1 credit. Your polls stay active for 30 days each, and you can create them anytime before your plan expires.' },
                        { q: 'When does my plan expire?', a: 'Starter, Pro Event, and Unlimited Event all give you 30 days access. Unlimited gives you 1 year access.' },
                        { q: 'Can I get a refund?', a: 'Yes! Try it risk-free. You have 7 days to try VoteGenerator. If it doesn\'t meet your needs before your poll takes off, we\'ll give you a full refund. Refunds are available for polls with fewer than 50 responses.' },
                        { q: 'What currency will I be charged in?', a: `Prices are shown in ${currency}. Stripe handles the secure checkout.` },
                        { q: 'Do I need to create an account?', a: 'Nope! VoteGenerator is privacy-first. No signup, no email required. You\'ll get a unique dashboard link after purchase.' },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50">{faq.q}<ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} /></summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your poll?</h2>
                    <p className="text-indigo-100 mb-8">Start free. No credit card required.</p>
                    <a href="/#create" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"><Sparkles size={20} /> Create Free Poll <ArrowRight size={20} /></a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PricingPage;
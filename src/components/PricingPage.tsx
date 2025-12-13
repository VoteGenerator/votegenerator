import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    X, 
    Zap, 
    Sparkles,
    ArrowRight,
    Shield,
    Users,
    HelpCircle,
    FileText,
    Lock,
    Crown,
    Mail,
    Ban,
    Fingerprint,
    Key,
    Eye,
    Gift
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
    price: { monthly: number; yearly: number; oneTime?: number };
    monthlyEquivalent?: number; // for yearly plans
    savings?: string;
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
    category?: string;
}

const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const plans: Plan[] = [
        {
            id: 'free',
            name: 'Free',
            description: 'Quick polls for personal use',
            price: { monthly: 0, yearly: 0 },
            badge: 'AD-SUPPORTED',
            highlight: false,
            cta: 'Start Free',
            ctaLink: '#',
            features: [
                { name: 'All 12 poll types', included: true },
                { name: 'Unlimited polls', included: true },
                { name: 'Up to 100 responses/poll', included: true },
                { name: 'Basic analytics', included: true },
                { name: 'Cookie-based vote protection', included: true },
                { name: 'Dashboard notifications', included: true },
                { name: 'Ads displayed', included: true, negative: true },
                { name: 'VoteGenerator branding', included: true, negative: true },
            ]
        },
        {
            id: 'one-time',
            name: 'One-Time Event',
            description: 'Perfect for a single event',
            price: { monthly: 7.99, yearly: 7.99, oneTime: 7.99 },
            badge: 'PAY ONCE',
            highlight: false,
            cta: 'Get Started',
            ctaLink: '#checkout/one-time',
            features: [
                { name: 'Everything in Free, plus:', included: true, header: true },
                { name: 'Unlimited responses', included: true },
                { name: 'Premium for 30 days', included: true },
                { name: 'No ads', included: true },
                { name: 'Remove VoteGenerator branding', included: true },
                { name: 'Upload your logo', included: true },
                { name: 'Download CSV & PDF', included: true },
                { name: 'Custom thank-you page', included: true },
                { name: 'Custom short links', included: true },
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            description: 'For teams and regular creators',
            price: { monthly: 9, yearly: 79 },
            monthlyEquivalent: 6.58,
            savings: 'Save 27%',
            badge: 'MOST POPULAR',
            highlight: true,
            cta: 'Get Pro',
            ctaLink: '#checkout/pro',
            features: [
                { name: 'Everything in One-Time, plus:', included: true, header: true },
                { name: 'Never expires', included: true },
                { name: 'Unified admin dashboard', included: true },
                { name: 'Visual Poll (image voting)', included: true, isNew: true },
                { name: 'Unique voting codes', included: true, tooltip: 'One-time codes for controlled voting' },
                { name: 'Embed polls (with your logo)', included: true },
                { name: 'Voter comments', included: true },
                { name: 'Export to Google Sheets', included: true },
                { name: 'Email support', included: true },
            ]
        },
        {
            id: 'pro-plus',
            name: 'Pro+',
            description: 'For power users & businesses',
            price: { monthly: 15, yearly: 119 },
            monthlyEquivalent: 9.92,
            savings: 'Save 34%',
            badge: 'BEST VALUE',
            highlight: false,
            cta: 'Get Pro+',
            ctaLink: '#checkout/pro-plus',
            features: [
                { name: 'Everything in Pro, plus:', included: true, header: true },
                { name: 'White-label embeds', included: true, tooltip: 'No VoteGenerator branding anywhere' },
                { name: 'Advanced vote protection', included: true, tooltip: 'Cookies + codes + rate limiting' },
                { name: 'Team collaboration', included: true, tooltip: 'Share polls with team members' },
                { name: 'Priority support', included: true },
            ]
        }
    ];

    const comparisonFeatures: ComparisonFeature[] = [
        // Poll Types
        { name: 'Multiple Choice Poll', free: true, oneTime: true, pro: true, proPlus: true, category: 'Poll Types Included' },
        { name: 'Ranked Choice Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Meeting Scheduler Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'This or That Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Dot Voting Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Rating Scale Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Buy a Feature Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Priority Matrix Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Approval Voting Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Quiz Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Sentiment Check Poll', free: true, oneTime: true, pro: true, proPlus: true },
        { name: 'Visual Poll (Image Voting)', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Upload images for voters to choose from' },
        
        // Limits
        { name: 'Polls You Can Create', free: 'Unlimited', oneTime: 'Unlimited', pro: 'Unlimited', proPlus: 'Unlimited', category: 'Usage Limits' },
        { name: 'Responses Per Poll', free: '100', oneTime: 'Unlimited', pro: 'Unlimited', proPlus: 'Unlimited' },
        { name: 'Premium Duration', free: '—', oneTime: '30 days', pro: 'While subscribed', proPlus: 'While subscribed' },
        
        // Dashboard
        { name: 'Admin Dashboard', free: 'Per poll', oneTime: 'Per poll', pro: 'Unified', proPlus: 'Unified', category: 'Dashboard & Management', tooltip: 'Free/One-Time: Each poll has separate link. Pro: One dashboard for all.' },
        { name: 'Dashboard Notifications', free: true, oneTime: true, pro: true, proPlus: true, tooltip: 'See new vote alerts when you check your dashboard' },
        { name: 'Team Collaboration', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Share poll management with team members' },
        
        // Branding
        { name: 'Remove Ads', free: false, oneTime: true, pro: true, proPlus: true, category: 'Branding & Customization' },
        { name: 'Remove VoteGenerator Branding', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Upload Your Logo', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Custom Thank-You Page', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Custom Short Links', free: false, oneTime: true, pro: true, proPlus: true, tooltip: 'e.g., votegenerator.com/v/my-team-vote' },
        
        // Embedding
        { name: 'Embed Polls', free: 'With branding', oneTime: 'With your logo', pro: 'With your logo', proPlus: 'White-label', category: 'Embedding', tooltip: 'White-label = zero VoteGenerator branding' },
        
        // Security
        { name: 'Cookie-Based Protection', free: true, oneTime: true, pro: true, proPlus: true, category: 'Vote Security', tooltip: 'Detects repeat voters from same browser' },
        { name: 'Unique Voting Codes', free: false, oneTime: false, pro: true, proPlus: true, tooltip: 'Generate one-time codes for controlled access' },
        { name: 'Advanced Protection', free: false, oneTime: false, pro: false, proPlus: true, tooltip: 'Combines cookies + codes + rate limiting' },
        { name: 'Scheduled Poll Closing', free: true, oneTime: true, pro: true, proPlus: true },
        
        // Export
        { name: 'Basic Analytics', free: true, oneTime: true, pro: true, proPlus: true, category: 'Analytics & Export' },
        { name: 'Download as CSV', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Download as PDF', free: false, oneTime: true, pro: true, proPlus: true },
        { name: 'Export to Google Sheets', free: false, oneTime: true, pro: true, proPlus: true },
        
        // Extras
        { name: 'Voter Comments', free: false, oneTime: true, pro: true, proPlus: true, category: 'Extras' },
        { name: 'Email Support', free: false, oneTime: false, pro: true, proPlus: true },
        { name: 'Priority Support', free: false, oneTime: false, pro: false, proPlus: true },
    ];

    const faqs = [
        {
            q: "Is the free plan really free forever?",
            a: "Yes! Create unlimited polls with up to 100 responses each. We show small ads to keep it sustainable. No credit card, no signup, no email required."
        },
        {
            q: "How does the One-Time plan work?",
            a: "Pay once, get premium features for 30 days. Create unlimited polls during that time. Perfect for weddings, events, or trying before subscribing. No auto-renewal."
        },
        {
            q: "What happens after my One-Time plan expires?",
            a: "Your existing polls stay accessible, but new polls use free tier features. You can purchase another One-Time pass or upgrade to Pro anytime."
        },
        {
            q: "What's the difference between Pro and Pro+ embeds?",
            a: "Pro embeds show your logo but include a small 'Powered by VoteGenerator' footer. Pro+ is fully white-label — zero VoteGenerator branding anywhere."
        },
        {
            q: "How do unique voting codes work?",
            a: "Generate one-time access codes. Share them with your voters. Each code works exactly once, preventing duplicate votes regardless of browser or device."
        },
        {
            q: "Can I upgrade or downgrade anytime?",
            a: "Yes! Upgrade instantly and we'll prorate your billing. Downgrade takes effect at your next billing date."
        },
        {
            q: "What payment methods do you accept?",
            a: "All major credit cards (Visa, Mastercard, Amex) and PayPal through Stripe, our secure payment processor."
        },
        {
            q: "What's your refund policy?",
            a: "Due to the digital nature of our service, we don't offer refunds. You can cancel anytime and continue using your plan until the billing period ends."
        }
    ];

    // Group features by category
    let currentCategory = '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Unique Value Proposition Hero */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Ban size={24} />
                            </div>
                            <h3 className="font-bold mb-1">No Signup Required</h3>
                            <p className="text-indigo-100 text-sm">Skip the email verification dance</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold mb-1">Zero Spam</h3>
                            <p className="text-indigo-100 text-sm">We don't collect emails to spam</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-bold mb-1">Privacy-First Security</h3>
                            <p className="text-indigo-100 text-sm">Vote protection without tracking</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold mb-1">Instant Start</h3>
                            <p className="text-indigo-100 text-sm">Create your first poll in 30 seconds</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Pricing Section */}
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
                        Start free. Upgrade when you need more. Cancel anytime.
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
                                Save up to 34%
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
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white ring-4 ring-indigo-300 scale-105 z-10'
                                    : 'bg-white border border-slate-200'
                            }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                    plan.id === 'free'
                                        ? 'bg-slate-200 text-slate-600'
                                        : plan.highlight
                                            ? 'bg-amber-400 text-amber-900'
                                            : plan.id === 'pro-plus'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-slate-800 text-white'
                                }`}>
                                    {plan.badge}
                                </div>
                            )}

                            {/* Plan Name */}
                            <div className="mb-4 mt-2">
                                <h3 className={`text-xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.id === 'one-time' ? (
                                    // One-time pricing
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                                ${plan.price.oneTime}
                                            </span>
                                            <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>
                                                one-time
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            Valid for 30 days
                                        </p>
                                    </div>
                                ) : plan.price.monthly === 0 ? (
                                    // Free plan
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">$0</span>
                                        <span className="text-slate-400">/month</span>
                                    </div>
                                ) : (
                                    // Subscription plans
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                                                ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                                            </span>
                                            <span className={plan.highlight ? 'text-indigo-200' : 'text-slate-400'}>
                                                /{billingCycle === 'yearly' ? 'year' : 'month'}
                                            </span>
                                        </div>
                                        {billingCycle === 'yearly' && plan.monthlyEquivalent && (
                                            <div className="mt-1">
                                                <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                    ${plan.monthlyEquivalent}/mo · 
                                                </span>
                                                <span className={`text-sm line-through ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`}>
                                                    ${plan.price.monthly * 12}/yr
                                                </span>
                                                <span className={`text-sm font-bold ml-1 ${plan.highlight ? 'text-green-300' : 'text-green-600'}`}>
                                                    {plan.savings}
                                                </span>
                                            </div>
                                        )}
                                        {billingCycle === 'monthly' && plan.savings && (
                                            <p className={`text-sm mt-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                Or ${plan.price.yearly}/year ({plan.savings})
                                            </p>
                                        )}
                                    </div>
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
                                                <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                                                    plan.highlight ? 'bg-amber-400/30 text-amber-200' : 'bg-amber-100 text-amber-700'
                                                }`}>
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

            {/* Why VoteGenerator Section */}
            <div className="bg-gradient-to-b from-slate-50 to-white py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
                        Why Teams Choose VoteGenerator
                    </h2>
                    <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
                        We built VoteGenerator because we were tired of poll tools that require signups, 
                        harvest emails, and spam your inbox. Here's what makes us different:
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Our Approach */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Check size={24} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">VoteGenerator</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { icon: Zap, title: 'Instant Start', desc: 'Create a poll in 30 seconds. No account needed.' },
                                    { icon: Ban, title: 'No Email Required', desc: 'We don\'t need your email. Share links directly.' },
                                    { icon: Shield, title: 'Privacy-First Security', desc: 'Cookie + unique code protection without tracking.' },
                                    { icon: Gift, title: 'Free Forever Tier', desc: 'All 12 poll types free. Upgrade only if you need more.' },
                                    { icon: Eye, title: 'Transparent Pricing', desc: 'No hidden fees. No surprise charges.' },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                                            <item.icon size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-600">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: Vote Security Explained */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Lock size={24} className="text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">How We Secure Your Votes</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                One-person-one-vote without invading privacy or harvesting data:
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Fingerprint size={18} className="text-indigo-600" />
                                        <h4 className="font-bold text-slate-800">Cookie Detection</h4>
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">FREE</span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Browser cookies remember if you've voted. Works for most casual polls. 
                                        No personal data collected.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Key size={18} className="text-indigo-600" />
                                        <h4 className="font-bold text-slate-800">Unique Voting Codes</h4>
                                        <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">PRO</span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Generate one-time access codes. Each code works exactly once. 
                                        Perfect for controlled audiences.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield size={18} className="text-purple-600" />
                                        <h4 className="font-bold text-slate-800">Combined Protection</h4>
                                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">PRO+</span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Cookies + unique codes + rate limiting. Maximum security for 
                                        important decisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
                    Compare All Features
                </h2>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="text-left p-4 font-semibold text-slate-600 w-[40%]">Feature</th>
                                    <th className="text-center p-4 font-semibold text-slate-500 w-[15%]">
                                        <div className="text-xs uppercase tracking-wider">Free</div>
                                        <div className="text-slate-400 text-xs font-normal">ad-supported</div>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-[15%]">
                                        <div>One-Time</div>
                                        <div className="text-slate-400 text-xs font-normal">$7.99</div>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-indigo-700 w-[15%] bg-indigo-50">
                                        <div className="flex items-center justify-center gap-1">
                                            Pro <Crown size={12} className="text-amber-500" />
                                        </div>
                                        <div className="text-indigo-400 text-xs font-normal">$6.58/mo</div>
                                    </th>
                                    <th className="text-center p-4 font-semibold text-slate-600 w-[15%]">
                                        <div>Pro+</div>
                                        <div className="text-slate-400 text-xs font-normal">$9.92/mo</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((feature, i) => {
                                    const showCategory = feature.category && feature.category !== currentCategory;
                                    if (feature.category) currentCategory = feature.category;
                                    
                                    return (
                                        <React.Fragment key={i}>
                                            {showCategory && (
                                                <tr className="bg-slate-100">
                                                    <td colSpan={5} className="p-3 font-bold text-slate-700 text-sm uppercase tracking-wide">
                                                        {feature.category}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="p-3 text-slate-700 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {feature.name}
                                                        {feature.tooltip && (
                                                            <div className="relative group">
                                                                <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                                                <div className="absolute bottom-full left-0 mb-2 w-52 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                                                    {feature.tooltip}
                                                                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {typeof feature.free === 'boolean' ? (
                                                        feature.free ? (
                                                            <Check size={18} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <X size={18} className="text-slate-300 mx-auto" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-600">{feature.free}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {typeof feature.oneTime === 'boolean' ? (
                                                        feature.oneTime ? (
                                                            <Check size={18} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <X size={18} className="text-slate-300 mx-auto" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-600">{feature.oneTime}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center bg-indigo-50/50">
                                                    {typeof feature.pro === 'boolean' ? (
                                                        feature.pro ? (
                                                            <Check size={18} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <X size={18} className="text-slate-300 mx-auto" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-indigo-600 font-medium">{feature.pro}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {typeof feature.proPlus === 'boolean' ? (
                                                        feature.proPlus ? (
                                                            <Check size={18} className="text-green-500 mx-auto" />
                                                        ) : (
                                                            <X size={18} className="text-slate-300 mx-auto" />
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-600">{feature.proPlus}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div className="bg-slate-50 py-12">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Zap size={24} className="text-green-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Free Forever</h4>
                            <p className="text-xs text-slate-500">No credit card</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Users size={24} className="text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">No Signup</h4>
                            <p className="text-xs text-slate-500">Start instantly</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <FileText size={24} className="text-purple-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">No Registration</h4>
                            <p className="text-xs text-slate-500">Just create & share</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Sparkles size={24} className="text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">12 Poll Types</h4>
                            <p className="text-xs text-slate-500">All included free</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Shield size={24} className="text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Privacy First</h4>
                            <p className="text-xs text-slate-500">Your data stays yours</p>
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
                        No signup. No credit card. No email required. Just start creating.
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
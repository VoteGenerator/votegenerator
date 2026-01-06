// ============================================================================
// CustomerFeedbackPage - High-Converting Landing Page
// Target Keywords: customer satisfaction survey, CSAT survey, NPS survey,
//                  customer feedback form, voice of customer, feedback tool
// Monthly Search Volume: 33,100+
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Shield, BarChart3, Clock, CheckCircle2, ArrowRight,
    TrendingUp, Heart, MessageSquare, Zap, ThumbsUp, ThumbsDown,
    Lock, Globe, Smartphone, Download, Bell, Users,
    ChevronRight, Play, Check, X, Sparkles, Send,
    ShoppingCart, Headphones, Mail, Link2, QrCode,
    PieChart, LineChart, Target, Award, Smile, Meh, Frown,
    Store, CreditCard, Package, Repeat, Gift, AlertCircle
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC = () => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number>(4);

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-amber-100 text-sm font-medium mb-6">
                            <TrendingUp className="w-4 h-4" />
                            <span>NPS + CSAT in one survey</span>
                        </div>

                        {/* Main headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                            Know what your<br />
                            <span className="text-yellow-300">customers really think</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-amber-100 mb-8 max-w-xl">
                            Beautiful CSAT and NPS surveys that customers actually complete. 
                            Get actionable feedback in minutes, not weeks. No signup required.
                        </p>

                        {/* Key benefits */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {[
                                { icon: Star, text: 'CSAT + NPS built-in' },
                                { icon: Clock, text: '60-second surveys' },
                                { icon: BarChart3, text: 'Real-time insights' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                                    <item.icon className="w-4 h-4 text-yellow-300" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/survey?template=customer-satisfaction"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 font-bold text-lg rounded-xl hover:bg-amber-50 transition shadow-xl shadow-amber-900/20"
                            >
                                <Sparkles className="w-5 h-5" />
                                Create Free Survey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#templates"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                            >
                                <Play className="w-5 h-5" />
                                See templates
                            </a>
                        </div>

                        <p className="text-amber-200 text-sm mt-6 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            No signup required • Free forever • Unlimited surveys
                        </p>
                    </motion.div>

                    {/* Right: Interactive Demo */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            {/* Main survey card */}
                            <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-500">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <Star className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">Quick Feedback</h3>
                                            <p className="text-xs text-slate-500">Takes 60 seconds</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">1 of 3</span>
                                </div>

                                {/* CSAT Question */}
                                <div className="mb-6">
                                    <p className="font-semibold text-slate-900 mb-4">
                                        How satisfied are you with your recent purchase?
                                    </p>
                                    
                                    {/* Star Rating */}
                                    <div className="flex justify-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onMouseEnter={() => setHoveredRating(rating)}
                                                onMouseLeave={() => setHoveredRating(null)}
                                                onClick={() => setSelectedRating(rating)}
                                                className="p-2 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-colors ${
                                                        rating <= (hoveredRating || selectedRating)
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-slate-200'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 px-2">
                                        <span>Very Dissatisfied</span>
                                        <span>Very Satisfied</span>
                                    </div>
                                </div>

                                {/* NPS Preview */}
                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-slate-600 mb-3">Next: NPS Question</p>
                                    <p className="font-medium text-slate-800 text-sm">
                                        How likely are you to recommend us to a friend?
                                    </p>
                                </div>

                                {/* Submit button */}
                                <button className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Continue
                                </button>
                            </div>

                            {/* Floating NPS score */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">+54</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Your NPS</p>
                                        <p className="font-bold text-emerald-600">Excellent</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating response rate */}
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="absolute -top-4 -right-4 bg-amber-600 text-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">32% response rate</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// METRICS SECTION - Show what you can measure
// ============================================================================

const MetricsSection: React.FC = () => {
    const metrics = [
        {
            name: 'CSAT Score',
            description: 'Customer Satisfaction',
            icon: Star,
            color: 'amber',
            example: '4.2/5',
        },
        {
            name: 'NPS Score',
            description: 'Net Promoter Score',
            icon: TrendingUp,
            color: 'emerald',
            example: '+54',
        },
        {
            name: 'CES Score',
            description: 'Customer Effort',
            icon: Target,
            color: 'blue',
            example: '2.1',
        },
        {
            name: 'Response Rate',
            description: 'Survey completion',
            icon: BarChart3,
            color: 'purple',
            example: '32%',
        },
    ];

    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{metric.example}</p>
                            <p className="font-medium text-slate-700">{metric.name}</p>
                            <p className="text-sm text-slate-500">{metric.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// PROBLEM SECTION
// ============================================================================

const ProblemSection: React.FC = () => {
    const problems = [
        {
            icon: AlertCircle,
            title: "Customers churn silently",
            description: "By the time you notice, they're already gone. You never learn why they left.",
            stat: "68% of customers leave without telling you why",
        },
        {
            icon: Mail,
            title: "Survey fatigue is real",
            description: "Long surveys get ignored. Those that do respond aren't your average customers.",
            stat: "Average survey completion: only 13%",
        },
        {
            icon: Clock,
            title: "Insights come too late",
            description: "Waiting for quarterly reports means problems compound before you can fix them.",
            stat: "Average time to insights: 2-4 weeks",
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        The customer feedback gap
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Most businesses fly blind. Here's what's costing you customers and revenue.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {problems.map((problem, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200"
                        >
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                                <problem.icon className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{problem.title}</h3>
                            <p className="text-slate-600 mb-4">{problem.description}</p>
                            <p className="text-sm font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2">
                                {problem.stat}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// TEMPLATES SECTION - Show the 3 main survey types
// ============================================================================

const TemplatesSection: React.FC = () => {
    const templates = [
        {
            id: 'csat',
            name: 'Customer Satisfaction (CSAT)',
            description: 'Measure happiness after purchases, support interactions, or any touchpoint.',
            icon: Star,
            gradient: 'from-amber-500 to-orange-500',
            questions: ['Star rating (1-5)', 'What did you like?', 'What could be better?'],
            bestFor: ['Post-purchase', 'Support tickets', 'Checkout'],
            time: '45 seconds',
        },
        {
            id: 'nps',
            name: 'Net Promoter Score (NPS)',
            description: 'The gold standard for measuring customer loyalty and predicting growth.',
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-teal-500',
            questions: ['Likelihood to recommend (0-10)', 'What\'s the reason for your score?'],
            bestFor: ['Quarterly surveys', 'Relationship health', 'Benchmarking'],
            time: '30 seconds',
        },
        {
            id: 'post-purchase',
            name: 'Post-Purchase Feedback',
            description: 'Understand the complete buying experience from discovery to delivery.',
            icon: ShoppingCart,
            gradient: 'from-purple-500 to-indigo-500',
            questions: ['Purchase satisfaction', 'Discovery channel', 'Delivery experience', 'Suggestions'],
            bestFor: ['E-commerce', 'Retail', 'Services'],
            time: '60 seconds',
        },
    ];

    return (
        <section id="templates" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Ready-to-Use Templates
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Choose your survey type
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Industry-standard surveys designed for high response rates. 
                        Pick one and customize, or start from scratch.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {templates.map((template, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-amber-300 hover:shadow-xl transition-all group"
                        >
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${template.gradient} p-6`}>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                                    <template.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{template.name}</h3>
                                <p className="text-white/80 text-sm">{template.description}</p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Questions included</p>
                                    <ul className="space-y-1">
                                        {template.questions.map((q, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check className="w-4 h-4 text-emerald-500" />
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Best for</p>
                                    <div className="flex flex-wrap gap-2">
                                        {template.bestFor.map((use, j) => (
                                            <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                {use}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="flex items-center gap-1 text-sm text-slate-500">
                                        <Clock className="w-4 h-4" />
                                        {template.time}
                                    </span>
                                    <a
                                        href={`/survey?template=${template.id}`}
                                        className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all"
                                    >
                                        Use template
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// DISTRIBUTION SECTION - How to share
// ============================================================================

const DistributionSection: React.FC = () => {
    const channels = [
        { icon: Mail, name: 'Email', desc: 'Embed in transactional emails' },
        { icon: Link2, name: 'Link', desc: 'Share anywhere' },
        { icon: QrCode, name: 'QR Code', desc: 'In-store or on receipts' },
        { icon: Globe, name: 'Website', desc: 'Embed on any page' },
        { icon: MessageSquare, name: 'Chat', desc: 'After support conversations' },
        { icon: Smartphone, name: 'SMS', desc: 'Text survey links' },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            <Send className="w-4 h-4" />
                            Reach Customers Anywhere
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Share via any channel
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Meet customers where they are. Send surveys via email, embed on your 
                            website, share via SMS, or display QR codes in-store.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {channels.map((channel, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <channel.icon className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">{channel.name}</p>
                                        <p className="text-xs text-slate-500">{channel.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Email preview */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Order Confirmation</p>
                                    <p className="text-sm text-slate-500">Your order #1234 has shipped!</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <p className="font-medium text-slate-900 mb-3">
                                    How was your shopping experience?
                                </p>
                                <div className="flex justify-center gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <Star
                                            key={n}
                                            className={`w-8 h-8 ${n <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                        />
                                    ))}
                                </div>
                                <button className="w-full py-2 bg-amber-500 text-white font-medium rounded-lg text-sm">
                                    Rate your experience →
                                </button>
                            </div>
                        </div>

                        {/* Floating QR */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-slate-100"
                        >
                            <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center">
                                <QrCode className="w-12 h-12 text-white" />
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-2">Scan to rate</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// ANALYTICS SECTION - Show the dashboard
// ============================================================================

const AnalyticsSection: React.FC = () => {
    return (
        <section className="py-20 bg-slate-900">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        {/* Dashboard preview */}
                        <div className="bg-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold">Customer Feedback Dashboard</h3>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    Live
                                </span>
                            </div>

                            {/* Metrics row */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">CSAT Score</p>
                                    <p className="text-2xl font-bold text-white">4.2<span className="text-sm text-slate-400">/5</span></p>
                                    <p className="text-emerald-400 text-xs">↑ 0.3 this month</p>
                                </div>
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">NPS Score</p>
                                    <p className="text-2xl font-bold text-emerald-400">+54</p>
                                    <p className="text-emerald-400 text-xs">↑ 8 this month</p>
                                </div>
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs mb-1">Responses</p>
                                    <p className="text-2xl font-bold text-white">1,247</p>
                                    <p className="text-slate-400 text-xs">32% response rate</p>
                                </div>
                            </div>

                            {/* Sentiment breakdown */}
                            <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                                <p className="text-slate-400 text-xs mb-3">Sentiment Breakdown</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Smile className="w-5 h-5 text-emerald-400" />
                                        <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
                                        </div>
                                        <span className="text-white text-sm w-12">68%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Meh className="w-5 h-5 text-amber-400" />
                                        <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '22%' }} />
                                        </div>
                                        <span className="text-white text-sm w-12">22%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Frown className="w-5 h-5 text-red-400" />
                                        <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }} />
                                        </div>
                                        <span className="text-white text-sm w-12">10%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent feedback */}
                            <div className="bg-slate-700/50 rounded-xl p-4">
                                <p className="text-slate-400 text-xs mb-3">Latest Feedback</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(n => (
                                                <Star key={n} className={`w-3 h-3 ${n <= 5 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                                            ))}
                                        </div>
                                        <p className="text-slate-300 text-sm">"Fast shipping and great quality!"</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(n => (
                                                <Star key={n} className={`w-3 h-3 ${n <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                                            ))}
                                        </div>
                                        <p className="text-slate-300 text-sm">"Good product, checkout was a bit slow"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-4">
                            <BarChart3 className="w-4 h-4" />
                            Real-Time Analytics
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Insights as they happen
                        </h2>
                        <p className="text-lg text-slate-300 mb-8">
                            Watch feedback flow in live. Beautiful visualizations show you 
                            exactly what customers think, without waiting for reports.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: PieChart, title: 'Sentiment Analysis', desc: 'Positive, neutral, negative breakdown' },
                                { icon: TrendingUp, title: 'Trend Tracking', desc: 'See how scores change over time' },
                                { icon: Target, title: 'Issue Detection', desc: 'Spot problems before they escalate' },
                                { icon: Download, title: 'Export Anywhere', desc: 'PDF reports or raw CSV data' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// USE CASES SECTION
// ============================================================================

const UseCasesSection: React.FC = () => {
    const cases = [
        {
            icon: ShoppingCart,
            title: 'E-commerce',
            description: 'Post-purchase surveys, product reviews, and checkout feedback.',
            triggers: ['After purchase', 'Post-delivery', 'Return request'],
        },
        {
            icon: Headphones,
            title: 'Customer Support',
            description: 'Measure support quality after tickets, chats, or calls.',
            triggers: ['Ticket closed', 'Chat ended', 'After call'],
        },
        {
            icon: Store,
            title: 'Retail & Hospitality',
            description: 'In-store feedback via QR codes, receipts, or tablets.',
            triggers: ['QR at checkout', 'On receipt', 'Table cards'],
        },
        {
            icon: Repeat,
            title: 'SaaS & Subscriptions',
            description: 'Onboarding feedback, feature requests, and churn prevention.',
            triggers: ['After onboarding', 'Feature launch', 'Before renewal'],
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Works for every business
                    </h2>
                    <p className="text-lg text-slate-600">
                        Wherever you interact with customers, you can collect feedback.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                                <useCase.icon className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{useCase.title}</h3>
                            <p className="text-slate-600 text-sm mb-4">{useCase.description}</p>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Best triggers</p>
                                <div className="flex flex-wrap gap-1">
                                    {useCase.triggers.map((trigger, j) => (
                                        <span key={j} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                            {trigger}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// CTA SECTION
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Start collecting customer feedback today
                </h2>
                <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                    Create your first CSAT or NPS survey in under 2 minutes. 
                    No signup, no credit card, no commitment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/survey?template=customer-satisfaction"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-amber-700 font-bold text-lg rounded-xl hover:bg-amber-50 transition shadow-xl"
                    >
                        <Star className="w-6 h-6" />
                        Create CSAT Survey
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="/survey?template=nps-survey"
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl hover:bg-white/20 transition border border-white/30"
                    >
                        <TrendingUp className="w-6 h-6" />
                        Create NPS Survey
                    </a>
                </div>
                <p className="text-amber-200 text-sm mt-6 flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> No signup</span>
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Free forever</span>
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Unlimited surveys</span>
                </p>
            </motion.div>
        </div>
    </section>
);

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection: React.FC = () => {
    const faqs = [
        {
            q: 'What\'s the difference between CSAT and NPS?',
            a: 'CSAT (Customer Satisfaction Score) measures satisfaction with a specific interaction or purchase using a 1-5 scale. NPS (Net Promoter Score) measures overall loyalty by asking how likely customers are to recommend you (0-10). Use CSAT for transactions, NPS for relationships.'
        },
        {
            q: 'How do I improve my response rate?',
            a: 'Keep surveys short (under 60 seconds), send at the right moment (immediately after interaction), make it mobile-friendly (our surveys are), and don\'t over-survey. Our templates are designed for maximum completion rates.'
        },
        {
            q: 'Can I embed surveys in my emails?',
            a: 'Yes! We generate HTML snippets you can paste into any email. Customers can click their rating directly in the email, then optionally add feedback on our page.'
        },
        {
            q: 'What\'s a good NPS score?',
            a: 'NPS ranges from -100 to +100. Above 0 is good, above 30 is great, and above 70 is world-class. What matters most is tracking your trend over time and comparing to your industry benchmarks.'
        },
        {
            q: 'Do customers need to create accounts?',
            a: 'No! Customers just click and rate. No signup, no email required. This dramatically increases response rates compared to tools that require authentication.'
        },
        {
            q: 'Can I trigger surveys automatically?',
            a: 'Yes! Use our webhook integrations or Zapier to trigger surveys after purchases, support tickets, or any event in your system. Available on Pro and Business plans.'
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Frequently asked questions
                    </h2>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.details
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
                        >
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-100 transition list-none">
                                {faq.q}
                                <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const CustomerFeedbackPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <NavHeader />
            <HeroSection />
            <MetricsSection />
            <ProblemSection />
            <TemplatesSection />
            <DistributionSection />
            <AnalyticsSection />
            <UseCasesSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default CustomerFeedbackPage;
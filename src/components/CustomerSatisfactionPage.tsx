// ============================================================================
// Customer Satisfaction Survey Landing Page
// Target Keywords: customer satisfaction survey, CSAT survey, client feedback survey,
// customer feedback form, guest satisfaction survey, user satisfaction survey
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Star, BarChart3, Clock, CheckCircle, ArrowRight, Users,
    TrendingUp, Zap, Download, Smartphone, MessageSquare,
    ThumbsUp, ThumbsDown, Meh, ChevronRight, Play, Target,
    Award, Heart, Frown, Smile
} from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

// ============================================================================
// CSAT Preview Component - Shows actual rating experience
// ============================================================================

const CSATPreview: React.FC = () => {
    const [rating, setRating] = useState<number | null>(4);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const displayRating = hoveredRating ?? rating;

    return (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Star size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Customer Satisfaction Survey</h3>
                        <p className="text-blue-100 text-sm">Quick feedback • ~1 min</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Rating Question */}
                <div className="mb-8">
                    <p className="font-semibold text-slate-800 text-lg mb-4">
                        How satisfied are you with our service?
                    </p>
                    
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                onClick={() => setRating(value)}
                                onMouseEnter={() => setHoveredRating(value)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={40}
                                    className={`transition ${
                                        displayRating && value <= displayRating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-500 px-2">
                        <span>Very Dissatisfied</span>
                        <span>Very Satisfied</span>
                    </div>
                </div>

                {/* NPS Style Question */}
                <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <p className="font-medium text-slate-700 mb-3">
                        How likely are you to recommend us? (0-10)
                    </p>
                    <div className="flex gap-1">
                        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                            <div
                                key={n}
                                className={`flex-1 h-10 rounded flex items-center justify-center text-sm font-medium cursor-pointer transition ${
                                    n === 8 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                            >
                                {n}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Not likely</span>
                        <span>Very likely</span>
                    </div>
                </div>

                {/* Open Feedback */}
                <div className="mb-6">
                    <p className="font-medium text-slate-700 mb-2">
                        What could we improve? <span className="text-slate-400 font-normal">(optional)</span>
                    </p>
                    <textarea
                        placeholder="Share your thoughts..."
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none resize-none"
                    />
                </div>

                {/* Submit */}
                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                    Submit Feedback
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// Results Dashboard Preview
// ============================================================================

const ResultsDashboard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-600" />
                    <span className="font-semibold text-slate-800">Results Overview</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-500">247 responses</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Star size={20} className="text-amber-400 fill-amber-400" />
                        <span className="text-2xl font-bold text-slate-800">4.3</span>
                    </div>
                    <p className="text-xs text-slate-500">Avg. Rating</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">+42</p>
                    <p className="text-xs text-slate-500">NPS Score</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">86%</p>
                    <p className="text-xs text-slate-500">Satisfied</p>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Rating Distribution</p>
                <div className="space-y-2">
                    {[
                        { stars: 5, count: 112, pct: 45 },
                        { stars: 4, count: 78, pct: 32 },
                        { stars: 3, count: 35, pct: 14 },
                        { stars: 2, count: 15, pct: 6 },
                        { stars: 1, count: 7, pct: 3 },
                    ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-2">
                            <div className="flex gap-0.5 w-20">
                                {[1,2,3,4,5].map((s) => (
                                    <Star
                                        key={s}
                                        size={12}
                                        className={s <= row.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                                    />
                                ))}
                            </div>
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${row.pct}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                            <span className="text-xs text-slate-500 w-12 text-right">{row.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Main Page Component
// ============================================================================

const CustomerSatisfactionPage: React.FC = () => {
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            {/* Navigation */}
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}
            
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium mb-6">
                                <Star size={16} className="fill-white" />
                                Free CSAT Template
                            </span>
                            
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                                Customer Satisfaction Survey
                            </h1>
                            
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Find out what your customers really think. Star ratings, NPS scores, and open feedback—all in one simple survey. No signup required for respondents.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a 
                                    href="/create?template=customer-satisfaction&type=survey"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl"
                                >
                                    Use This Template
                                    <ArrowRight size={20} />
                                </a>
                                <a 
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                                >
                                    <Play size={18} />
                                    See How It Works
                                </a>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-6 text-blue-100 text-sm">
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    No signup for customers
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Results update live
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Export to CSV
                                </span>
                            </div>
                        </motion.div>

                        {/* Right: Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <CSATPreview />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Measure What Matters
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our CSAT template helps you collect the feedback you need to improve.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Star,
                                title: 'Overall Satisfaction',
                                description: '5-star ratings to measure how happy customers are with your product or service.',
                                color: 'bg-amber-100 text-amber-600'
                            },
                            {
                                icon: Target,
                                title: 'NPS Score',
                                description: '0-10 scale to measure likelihood to recommend. Calculate promoters, passives, and detractors.',
                                color: 'bg-blue-100 text-blue-600'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Open Feedback',
                                description: 'Text fields for customers to explain their rating and share specific suggestions.',
                                color: 'bg-green-100 text-green-600'
                            },
                            {
                                icon: BarChart3,
                                title: 'Visual Reports',
                                description: 'See response distributions, averages, and trends in your results dashboard.',
                                color: 'bg-purple-100 text-purple-600'
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-slate-50 rounded-2xl"
                            >
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Collect Feedback in 3 Steps
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Create Survey',
                                description: 'Use our CSAT template or build your own. Choose from star ratings, scales, multiple choice, and text questions.',
                                icon: Zap
                            },
                            {
                                step: '2',
                                title: 'Share Link',
                                description: 'Send the survey link after a purchase, support ticket, or service interaction. Customers click and respond instantly.',
                                icon: Users
                            },
                            {
                                step: '3',
                                title: 'Analyze Results',
                                description: 'View responses in real-time. See ratings, averages, and feedback. Export to CSV for deeper analysis.',
                                icon: TrendingUp
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                                            {item.step}
                                        </div>
                                        <item.icon size={24} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <ChevronRight size={24} className="text-slate-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Preview */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Results You Can Act On
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                See exactly how your customers feel—with visual charts and detailed breakdowns.
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Average satisfaction scores',
                                    'NPS calculation (Promoters vs Detractors)',
                                    'Rating distribution charts',
                                    'All open-ended feedback in one place',
                                    'Response timestamps',
                                    'Export to CSV for your team'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a 
                                href="/create?template=customer-satisfaction&type=survey"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                            >
                                Create Your Survey
                                <ArrowRight size={18} />
                            </a>
                        </div>
                        
                        <ResultsDashboard />
                    </div>
                </div>
            </section>

            {/* Industry Examples */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Works for Any Business
                        </h2>
                        <p className="text-lg text-slate-600">
                            Customize the template for your industry.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'E-commerce',
                                examples: ['Post-purchase feedback', 'Delivery satisfaction', 'Product quality rating'],
                                emoji: '🛒'
                            },
                            {
                                title: 'SaaS / Software',
                                examples: ['Feature satisfaction', 'Support experience', 'Onboarding feedback'],
                                emoji: '💻'
                            },
                            {
                                title: 'Services',
                                examples: ['Project completion survey', 'Client check-in', 'Service quality rating'],
                                emoji: '🤝'
                            },
                            {
                                title: 'Hospitality',
                                examples: ['Guest satisfaction', 'Stay experience', 'Amenity ratings'],
                                emoji: '🏨'
                            },
                            {
                                title: 'Healthcare',
                                examples: ['Patient experience', 'Appointment feedback', 'Care quality'],
                                emoji: '🏥'
                            },
                            {
                                title: 'Education',
                                examples: ['Course feedback', 'Instructor rating', 'Learning satisfaction'],
                                emoji: '🎓'
                            },
                        ].map((industry, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                                <span className="text-3xl mb-3 block">{industry.emoji}</span>
                                <h3 className="font-bold text-slate-800 mb-3">{industry.title}</h3>
                                <ul className="space-y-1">
                                    {industry.examples.map((ex, j) => (
                                        <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                                            <CheckCircle size={14} className="text-blue-500" />
                                            {ex}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Start collecting customer feedback today
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Create your CSAT survey in minutes. Free to start, no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/create?template=customer-satisfaction&type=survey"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition shadow-xl"
                        >
                            Use CSAT Template
                            <ArrowRight size={20} />
                        </a>
                        <a 
                            href="/templates"
                            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                        >
                            Browse All Templates
                        </a>
                    </div>
                    
                    <p className="text-blue-200 text-sm mt-6">
                        Free to create • No signup for customers • Real-time results
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Common Questions
                    </h2>
                    
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Do customers need to create an account?',
                                a: 'No. Customers simply click the survey link and respond. No signup, no app download required. Works on any device.'
                            },
                            {
                                q: 'What question types are available?',
                                a: 'Star ratings (1-5), numeric scales (1-10 for NPS), multiple choice, yes/no, and open text fields. You can mix and match to build the perfect survey.'
                            },
                            {
                                q: 'How do I calculate NPS from the results?',
                                a: 'The results dashboard shows you the distribution of scores. Promoters are 9-10, Passives are 7-8, Detractors are 0-6. NPS = % Promoters minus % Detractors.'
                            },
                            {
                                q: 'Can I customize the questions?',
                                a: 'Yes. Start with our template and add, edit, or remove questions. Change wording, add sections, and set which questions are required.'
                            },
                            {
                                q: 'How do I share the survey?',
                                a: 'You get a unique link that works everywhere—email, SMS, QR code, or embedded in your website. Share it however works best for your customers.'
                            },
                            {
                                q: 'Can I export the results?',
                                a: 'Yes. Export all responses to CSV for analysis in Excel, Google Sheets, or import into your CRM or analytics tools.'
                            },
                        ].map((faq, i) => (
                            <div key={i} className="border-b border-slate-200 pb-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.q}</h3>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CustomerSatisfactionPage;
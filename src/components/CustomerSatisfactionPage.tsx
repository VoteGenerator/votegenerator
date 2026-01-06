// ============================================================================
// Customer Satisfaction Survey Landing Page - Typeform-Inspired Design
// Target Keywords: customer satisfaction survey, CSAT survey, NPS survey
// Design: Clean, bold, conversion-focused with interactive NPS preview
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, ChevronRight, ChevronLeft, Star,
    TrendingUp, BarChart3, Clock, Zap, Download, Users,
    Play, Sparkles, MessageSquare, ThumbsUp
} from 'lucide-react';

// ============================================================================
// INTERACTIVE CSAT PREVIEW - NPS Style Question
// ============================================================================

const CSATPreview: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isComplete, setIsComplete] = useState(false);

    const questions = [
        {
            id: 0,
            type: 'nps',
            question: "How likely are you to recommend us to a friend?",
            subtitle: "0 = Not at all likely, 10 = Extremely likely"
        },
        {
            id: 1,
            type: 'rating',
            question: "How satisfied are you with our product?",
        },
        {
            id: 2,
            type: 'choice',
            question: "What did you like most?",
            options: ['Product quality', 'Customer service', 'Price', 'Ease of use']
        },
        {
            id: 3,
            type: 'text',
            question: "How can we improve?",
            subtitle: "Your feedback helps us get better",
            placeholder: "Share your thoughts..."
        }
    ];

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (answer: any) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsComplete(true);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const currentQ = questions[currentQuestion];
    const hasAnswer = answers[currentQuestion] !== undefined;

    if (isComplete) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[520px] flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <Check size={40} className="text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h3>
                    <p className="text-slate-500 mb-8">Your feedback helps us improve.</p>
                    <button 
                        onClick={() => { setCurrentQuestion(0); setIsComplete(false); setAnswers({}); }}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Try again →
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[520px] flex flex-col">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100">
                <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col p-8 lg:p-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col"
                    >
                        <span className="text-sm text-blue-600 font-medium mb-4">
                            {currentQuestion + 1} → {questions.length}
                        </span>

                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2 leading-tight">
                            {currentQ.question}
                        </h2>
                        {currentQ.subtitle && (
                            <p className="text-slate-500 mb-6">{currentQ.subtitle}</p>
                        )}

                        <div className="flex-1 flex flex-col justify-center">
                            {currentQ.type === 'nps' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between gap-1">
                                        {[0,1,2,3,4,5,6,7,8,9,10].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => handleAnswer(num)}
                                                className={`w-9 h-12 rounded-lg font-bold text-sm transition-all ${
                                                    answers[currentQuestion] === num
                                                        ? num >= 9 ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                                                        : num >= 7 ? 'bg-amber-400 text-white scale-110 shadow-lg'
                                                        : 'bg-red-400 text-white scale-110 shadow-lg'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-blue-100'
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 px-1">
                                        <span>Not likely</span>
                                        <span>Very likely</span>
                                    </div>
                                </div>
                            )}

                            {currentQ.type === 'rating' && (
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleAnswer(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={48}
                                                className={`transition ${
                                                    answers[currentQuestion] >= star
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-300 hover:text-amber-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'choice' && (
                                <div className="space-y-3">
                                    {currentQ.options?.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(option)}
                                            className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                                                answers[currentQuestion] === option
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50'
                                            }`}
                                        >
                                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-sm ${
                                                answers[currentQuestion] === option
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-white text-slate-500'
                                            }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'text' && (
                                <textarea
                                    value={answers[currentQuestion] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder={currentQ.placeholder}
                                    className="w-full h-28 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        currentQuestion === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <ChevronLeft size={20} />
                    Back
                </button>

                <button
                    onClick={nextQuestion}
                    disabled={!hasAnswer && currentQ.type !== 'text'}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                        hasAnswer || currentQ.type === 'text'
                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'OK'}
                    <Check size={18} />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// NPS RESULTS PREVIEW
// ============================================================================

const NPSResultsPreview: React.FC = () => {
    const [animate, setAnimate] = useState(false);
    useEffect(() => { setTimeout(() => setAnimate(true), 500); }, []);

    const npsScore = 42;
    const promoters = 58;
    const passives = 26;
    const detractors = 16;

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">NPS Score</h3>
                    <p className="text-slate-500 text-sm">Last 30 days • 156 responses</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-blue-700">Live</span>
                </div>
            </div>

            {/* Big NPS Number */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={animate ? { scale: 1 } : {}}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-flex items-center gap-2"
                >
                    <span className="text-7xl font-black text-blue-600">+{npsScore}</span>
                    <TrendingUp size={32} className="text-blue-600" />
                </motion.div>
                <p className="text-slate-500 mt-2">Great score!</p>
            </div>

            {/* Breakdown Bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={animate ? { width: `${promoters}%` } : {}}
                    transition={{ duration: 0.6 }}
                    className="bg-emerald-500"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={animate ? { width: `${passives}%` } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-amber-400"
                />
                <motion.div
                    initial={{ width: 0 }}
                    animate={animate ? { width: `${detractors}%` } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-red-400"
                />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded" />
                        <span className="text-slate-600">Promoters</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{promoters}%</p>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-amber-400 rounded" />
                        <span className="text-slate-600">Passives</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{passives}%</p>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-red-400 rounded" />
                        <span className="text-slate-600">Detractors</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{detractors}%</p>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const CustomerSatisfactionPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 min-h-[90vh] flex items-center">
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
                                <Sparkles size={16} />
                                Free CSAT & NPS template
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                Customer
                                <br />
                                <span className="text-blue-300">Satisfaction</span>
                                <br />
                                Survey
                            </h1>
                            
                            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-lg">
                                Measure customer loyalty with NPS scores and CSAT ratings. 
                                Beautiful surveys customers actually complete—with insights you can act on.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/create?template=customer-satisfaction&type=survey"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                                >
                                    Use this template
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a 
                                    href="#preview"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/90 font-medium rounded-2xl hover:bg-white/10 transition"
                                >
                                    <Play size={18} />
                                    See it in action
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <CSATPreview />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-slate-600">
                        {[
                            { icon: Clock, text: '2 min to create' },
                            { icon: Users, text: 'No signup for customers' },
                            { icon: TrendingUp, text: 'NPS auto-calculated' },
                            { icon: Download, text: 'Export to CSV' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <item.icon size={18} className="text-blue-600" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NPS Explanation */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">
                            Know your NPS score.
                            <br />
                            <span className="text-blue-600">Know your customers.</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed mb-8">
                            Net Promoter Score measures customer loyalty with one simple question.
                            Our template calculates your NPS automatically—promoters, passives, and detractors.
                        </p>
                        <div className="inline-flex items-center gap-8 text-left bg-slate-50 rounded-2xl p-6">
                            <div>
                                <span className="text-emerald-600 font-bold">9-10</span>
                                <p className="text-sm text-slate-500">Promoters</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div>
                                <span className="text-amber-500 font-bold">7-8</span>
                                <p className="text-sm text-slate-500">Passives</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div>
                                <span className="text-red-500 font-bold">0-6</span>
                                <p className="text-sm text-slate-500">Detractors</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Demo */}
            <section id="preview" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">See it in action</h2>
                        <p className="text-slate-600">What your customers see vs. what you see.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Customer experience</h3>
                            <CSATPreview />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Your dashboard</h3>
                            <NPSResultsPreview />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'NPS calculation',
                                description: 'Automatic scoring: promoters, passives, detractors. See your NPS update in real-time.'
                            },
                            {
                                icon: Star,
                                title: 'CSAT ratings',
                                description: '5-star ratings and satisfaction scales. Get the metrics you need to track quality.'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Open feedback',
                                description: 'Collect detailed comments. Understand the "why" behind the scores.'
                            },
                            {
                                icon: BarChart3,
                                title: 'Visual dashboard',
                                description: 'Charts, distributions, and trends. See customer sentiment at a glance.'
                            },
                            {
                                icon: Download,
                                title: 'Export to CSV',
                                description: 'Download all data for your CRM, BI tools, or spreadsheets.'
                            },
                            {
                                icon: Users,
                                title: 'No signup needed',
                                description: 'Customers click and respond. No accounts, no friction, more responses.'
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon size={24} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Works for every touchpoint</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { emoji: '🛒', title: 'Post-purchase', description: 'After checkout or delivery' },
                            { emoji: '💬', title: 'Support tickets', description: 'After resolving an issue' },
                            { emoji: '🚀', title: 'Onboarding', description: 'After signup or first use' },
                            { emoji: '📦', title: 'Product feedback', description: 'After feature launches' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl text-center"
                            >
                                <span className="text-4xl mb-4 block">{item.emoji}</span>
                                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-blue-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Start measuring satisfaction today
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Create your CSAT survey in minutes. Free to start.
                    </p>
                    <a 
                        href="/create?template=customer-satisfaction&type=survey"
                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-blue-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                    >
                        Get started free
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-blue-200 text-sm mt-6">No credit card required</p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Questions & Answers
                    </h2>
                    
                    <div className="space-y-8">
                        {[
                            {
                                q: 'What\'s the difference between NPS and CSAT?',
                                a: 'NPS (Net Promoter Score) measures loyalty—how likely someone is to recommend you. CSAT measures satisfaction with a specific interaction. Our template includes both so you get the full picture.'
                            },
                            {
                                q: 'How is the NPS score calculated?',
                                a: 'NPS = % Promoters (9-10) minus % Detractors (0-6). The score ranges from -100 to +100. Above 0 is good, above 30 is great, above 70 is world-class.'
                            },
                            {
                                q: 'Do customers need to create an account?',
                                a: 'No. Customers click the link and respond immediately. No signup, no app—works on any device.'
                            },
                            {
                                q: 'Can I customize the questions?',
                                a: 'Yes. Start with our template and add, edit, or remove any question. Add your branding, change wording, add follow-up questions.'
                            },
                            {
                                q: 'Can I export the data?',
                                a: 'Yes. Export all responses to CSV for your CRM, BI tools, or spreadsheets. NPS breakdown included.'
                            },
                        ].map((faq, i) => (
                            <div key={i}>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.q}</h3>
                                <p className="text-slate-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerSatisfactionPage;
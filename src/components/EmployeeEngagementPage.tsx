// ============================================================================
// Employee Engagement Survey Landing Page - Typeform-Inspired Design
// Target Keywords: employee engagement survey, staff engagement survey
// Design: Clean, bold, conversion-focused with interactive preview
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, ChevronRight, ChevronLeft, Star,
    Users, BarChart3, Clock, Zap, Download, Shield,
    Play, Sparkles
} from 'lucide-react';

// ============================================================================
// INTERACTIVE SURVEY PREVIEW - Typeform-style one question at a time
// ============================================================================

const TypeformPreview: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isComplete, setIsComplete] = useState(false);

    const questions = [
        {
            id: 0,
            type: 'scale',
            question: "How satisfied are you with your current role?",
            subtitle: "1 = Not at all, 10 = Extremely satisfied",
            scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
            id: 1,
            type: 'choice',
            question: "Do you feel you have opportunities for growth?",
            options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree']
        },
        {
            id: 2,
            type: 'rating',
            question: "How would you rate team collaboration?",
            subtitle: "Your honest feedback helps us improve"
        },
        {
            id: 3,
            type: 'text',
            question: "What's one thing we could do better?",
            subtitle: "Optional but valuable",
            placeholder: "Type your answer here..."
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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <Check size={40} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Thanks for your feedback!</h3>
                    <p className="text-slate-500 mb-8">Your responses help us build a better workplace.</p>
                    <button 
                        onClick={() => { setCurrentQuestion(0); setIsComplete(false); setAnswers({}); }}
                        className="text-emerald-600 font-medium hover:underline"
                    >
                        Try again →
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100">
                <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col p-8 lg:p-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Question Number */}
                        <span className="text-sm text-emerald-600 font-medium mb-4">
                            {currentQuestion + 1} → {questions.length}
                        </span>

                        {/* Question Text */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2 leading-tight">
                            {currentQ.question}
                        </h2>
                        {currentQ.subtitle && (
                            <p className="text-slate-500 mb-8">{currentQ.subtitle}</p>
                        )}

                        {/* Answer Input */}
                        <div className="flex-1 flex flex-col justify-center">
                            {currentQ.type === 'scale' && (
                                <div className="flex justify-between gap-2">
                                    {currentQ.scale?.map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleAnswer(num)}
                                            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl font-bold text-lg transition-all ${
                                                answers[currentQuestion] === num
                                                    ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                                            }`}
                                        >
                                            {num}
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
                                                    ? 'bg-emerald-500 text-white shadow-lg'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
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

                            {currentQ.type === 'rating' && (
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleAnswer(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={44}
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

                            {currentQ.type === 'text' && (
                                <textarea
                                    value={answers[currentQuestion] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder={currentQ.placeholder}
                                    className="w-full h-32 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        currentQuestion === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-100'
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
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'
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
// RESULTS PREVIEW
// ============================================================================

const ResultsPreview: React.FC = () => {
    const [animate, setAnimate] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Engagement Score</h3>
                    <p className="text-slate-500 text-sm">Last 30 days • 47 responses</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700">Live</span>
                </div>
            </div>

            {/* Big Number */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={animate ? { scale: 1 } : {}}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-flex items-baseline gap-1"
                >
                    <span className="text-7xl font-black text-emerald-600">7.8</span>
                    <span className="text-2xl text-slate-400">/10</span>
                </motion.div>
                <p className="text-slate-500 mt-2">Average satisfaction score</p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
                {[
                    { label: 'Role Satisfaction', score: 8.2, color: 'bg-emerald-500' },
                    { label: 'Growth Opportunities', score: 6.9, color: 'bg-blue-500' },
                    { label: 'Team Collaboration', score: 8.5, color: 'bg-purple-500' },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-bold text-slate-800">{item.score}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={animate ? { width: `${item.score * 10}%` } : {}}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                className={`h-full ${item.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const EmployeeEngagementPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero - Clean, Typeform-style */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 min-h-[90vh] flex items-center">
                {/* Subtle background pattern */}
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
                        {/* Left: Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8"
                            >
                                <Sparkles size={16} />
                                Free template • No signup for employees
                            </motion.div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                Employee
                                <br />
                                <span className="text-emerald-300">Engagement</span>
                                <br />
                                Survey
                            </h1>
                            
                            <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed max-w-lg">
                                Understand how your team really feels. Beautiful surveys that employees actually complete—with results you can act on.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/create?template=employee-engagement&type=survey"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all"
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

                        {/* Right: Interactive Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <TypeformPreview />
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
                            { icon: Users, text: 'No signup for respondents' },
                            { icon: BarChart3, text: 'Real-time results' },
                            { icon: Download, text: 'Export to CSV' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <item.icon size={18} className="text-emerald-600" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem → Solution */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">
                            Long surveys don't get completed.
                            <br />
                            <span className="text-emerald-600">Simple ones do.</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Our one-question-at-a-time format keeps employees engaged. 
                            You get higher response rates and more honest feedback.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section id="preview" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Try it yourself</h2>
                        <p className="text-slate-600">This is exactly what your employees will see.</p>
                    </div>

                    <div className="max-w-2xl mx-auto lg:hidden">
                        <TypeformPreview />
                    </div>

                    <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">What employees see</h3>
                            <TypeformPreview />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">What you see</h3>
                            <ResultsPreview />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features - Clean Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Built for teams who want actionable feedback without the complexity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Star,
                                title: 'Multiple question types',
                                description: 'Scales, ratings, multiple choice, and open text. Mix and match to get the feedback you need.'
                            },
                            {
                                icon: Zap,
                                title: 'One-click for employees',
                                description: 'No accounts, no apps, no friction. Employees click a link and start responding immediately.'
                            },
                            {
                                icon: BarChart3,
                                title: 'Visual results dashboard',
                                description: 'Watch responses come in. See averages, distributions, and individual feedback all in one place.'
                            },
                            {
                                icon: Download,
                                title: 'Export to CSV',
                                description: 'Download all responses for deeper analysis in Excel, Google Sheets, or your HR tools.'
                            },
                            {
                                icon: Users,
                                title: 'Multi-section surveys',
                                description: 'Organize questions into sections: satisfaction, growth, culture, management—whatever you need.'
                            },
                            {
                                icon: Clock,
                                title: '2 minutes to create',
                                description: 'Start with our template or build your own. Add questions, customize, and share—that fast.'
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
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon size={24} className="text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Minimal */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Create', description: 'Use our template or customize your own questions. Takes about 2 minutes.' },
                            { step: '2', title: 'Share', description: 'Send the link via email, Slack, or any tool. Employees click and respond—no signup.' },
                            { step: '3', title: 'Learn', description: 'See results in real-time. Averages, breakdowns, and all feedback in one dashboard.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - Bold and Simple */}
            <section className="py-24 bg-emerald-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to hear from your team?
                        </h2>
                        <p className="text-xl text-emerald-100 mb-10">
                            Create your survey in minutes. Free to start.
                        </p>
                        <a 
                            href="/create?template=employee-engagement&type=survey"
                            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                        >
                            Get started free
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <p className="text-emerald-200 text-sm mt-6">
                            No credit card required
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ - Clean */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Questions & Answers
                    </h2>
                    
                    <div className="space-y-8">
                        {[
                            {
                                q: 'Do employees need to create an account?',
                                a: 'No. Employees click the link and start responding immediately. No signup, no app download—works on any device.'
                            },
                            {
                                q: 'Can I customize the questions?',
                                a: 'Yes. Start with our template and add, edit, or remove any question. Create multiple sections, set required fields, and make it yours.'
                            },
                            {
                                q: 'Can I see who responded?',
                                a: 'Yes. You can see individual responses with all answers and timestamps. Names are collected if you include a name field, otherwise responses are identified by submission number.'
                            },
                            {
                                q: 'Is there a limit on responses?',
                                a: 'The free plan has response limits. For larger teams or unlimited responses, check our Pro and Business plans.'
                            },
                            {
                                q: 'Can I export the results?',
                                a: 'Yes. Export all responses to CSV for analysis in Excel, Google Sheets, or your HR analytics tools.'
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

export default EmployeeEngagementPage;
// ============================================================================
// Feedback Form Landing Page - Typeform-Inspired Design
// Target Keywords: feedback form free, quick feedback tool, feedback form template
// Design: Clean, minimal, focused on speed and simplicity
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, ChevronRight, ChevronLeft, Star,
    MessageSquare, BarChart3, Clock, Zap, Download, Users,
    Sparkles, ThumbsUp, Lightbulb, Target, Play
} from 'lucide-react';

// ============================================================================
// INTERACTIVE FEEDBACK PREVIEW
// ============================================================================

const FeedbackPreview: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isComplete, setIsComplete] = useState(false);

    const steps = [
        {
            id: 0,
            type: 'rating',
            question: "How was your experience?",
            subtitle: "Be honest—it helps us improve"
        },
        {
            id: 1,
            type: 'tags',
            question: "What did you like?",
            subtitle: "Select all that apply",
            options: ['Fast service', 'Easy to use', 'Helpful', 'Quality', 'Value']
        },
        {
            id: 2,
            type: 'text',
            question: "Anything we could do better?",
            subtitle: "Optional but appreciated",
            placeholder: "Share your thoughts..."
        }
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentQ = steps[currentStep];
    const hasAnswer = answers[currentStep] !== undefined && 
        (currentQ.type !== 'tags' || (Array.isArray(answers[currentStep]) && answers[currentStep].length > 0));

    const handleRating = (rating: number) => {
        setAnswers({ ...answers, [currentStep]: rating });
    };

    const handleTagToggle = (tag: string) => {
        const current = answers[currentStep] || [];
        const updated = current.includes(tag) 
            ? current.filter((t: string) => t !== tag)
            : [...current, tag];
        setAnswers({ ...answers, [currentStep]: updated });
    };

    const handleText = (text: string) => {
        setAnswers({ ...answers, [currentStep]: text });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (isComplete) {
        return (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[480px] flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                    <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                        <ThumbsUp size={40} className="text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Thanks for the feedback!</h3>
                    <p className="text-slate-500 mb-8">Your input helps us improve.</p>
                    <button 
                        onClick={() => { setCurrentStep(0); setIsComplete(false); setAnswers({}); }}
                        className="text-violet-600 font-medium hover:underline"
                    >
                        Submit another →
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[480px] flex flex-col">
            {/* Progress */}
            <div className="h-1 bg-slate-100">
                <motion.div 
                    className="h-full bg-violet-500"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-8 lg:p-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                    >
                        <span className="text-sm text-violet-600 font-medium mb-4">
                            {currentStep + 1} → {steps.length}
                        </span>

                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                            {currentQ.question}
                        </h2>
                        {currentQ.subtitle && (
                            <p className="text-slate-500 mb-8">{currentQ.subtitle}</p>
                        )}

                        <div className="flex-1 flex flex-col justify-center">
                            {currentQ.type === 'rating' && (
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={52}
                                                className={`transition ${
                                                    answers[currentStep] >= star
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-300 hover:text-amber-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'tags' && (
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {currentQ.options?.map((tag) => {
                                        const selected = (answers[currentStep] || []).includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => handleTagToggle(tag)}
                                                className={`px-5 py-3 rounded-full font-medium transition-all ${
                                                    selected
                                                        ? 'bg-violet-500 text-white shadow-lg'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-violet-100'
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {currentQ.type === 'text' && (
                                <textarea
                                    value={answers[currentStep] || ''}
                                    onChange={(e) => handleText(e.target.value)}
                                    placeholder={currentQ.placeholder}
                                    className="w-full h-28 p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none resize-none"
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        currentStep === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <ChevronLeft size={20} />
                    Back
                </button>

                <button
                    onClick={nextStep}
                    disabled={!hasAnswer && currentQ.type !== 'text'}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                        hasAnswer || currentQ.type === 'text'
                            ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {currentStep === steps.length - 1 ? 'Submit' : 'OK'}
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
    useEffect(() => { setTimeout(() => setAnimate(true), 500); }, []);

    const tags = [
        { name: 'Easy to use', count: 67, pct: 78 },
        { name: 'Fast service', count: 54, pct: 63 },
        { name: 'Helpful', count: 48, pct: 56 },
        { name: 'Quality', count: 41, pct: 48 },
        { name: 'Value', count: 29, pct: 34 },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Feedback Results</h3>
                    <p className="text-slate-500 text-sm">86 responses</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-100 rounded-full">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-violet-700">Live</span>
                </div>
            </div>

            {/* Average Rating */}
            <div className="text-center mb-8 p-6 bg-slate-50 rounded-2xl">
                <div className="flex justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                        <Star key={s} size={28} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                    ))}
                </div>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={animate ? { opacity: 1 } : {}}
                    className="text-4xl font-black text-slate-800"
                >
                    4.3
                </motion.span>
                <span className="text-slate-400 text-lg"> / 5</span>
                <p className="text-slate-500 text-sm mt-1">Average rating</p>
            </div>

            {/* What people liked */}
            <div>
                <p className="text-sm font-medium text-slate-700 mb-4">What people liked</p>
                <div className="space-y-3">
                    {tags.map((tag, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-700">{tag.name}</span>
                                <span className="text-slate-500">{tag.count}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={animate ? { width: `${tag.pct}%` } : {}}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="h-full bg-violet-500 rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const FeedbackFormPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 min-h-[90vh] flex items-center">
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
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
                                <Zap size={16} />
                                Free • Under 1 minute to create
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                Quick
                                <br />
                                <span className="text-violet-300">Feedback</span>
                                <br />
                                Forms
                            </h1>
                            
                            <p className="text-xl text-violet-100/80 mb-10 leading-relaxed max-w-lg">
                                Simple feedback forms that actually get completed.
                                Ratings, tags, and open text—see results instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/create?type=survey"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-violet-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                                >
                                    Create feedback form
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a 
                                    href="#demo"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/90 font-medium rounded-2xl hover:bg-white/10 transition"
                                >
                                    <Play size={18} />
                                    Try it
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <FeedbackPreview />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-slate-600">
                        {[
                            { icon: Clock, text: 'Under 1 min to create' },
                            { icon: Users, text: 'No signup for respondents' },
                            { icon: BarChart3, text: 'Real-time results' },
                            { icon: Download, text: 'Export to CSV' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <item.icon size={18} className="text-violet-600" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Short Forms */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-6">
                            Long surveys get ignored.
                            <br />
                            <span className="text-violet-600">Short forms get answers.</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Keep it focused. A rating, a few tags, an optional comment—done. 
                            Higher completion rates mean more feedback to act on.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">See how it works</h2>
                        <p className="text-slate-600">What respondents see vs. what you see.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Respondent experience</h3>
                            <FeedbackPreview />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Your dashboard</h3>
                            <ResultsPreview />
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Feedback for any situation</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Users, title: 'After meetings', description: 'Was this meeting useful?', color: 'bg-blue-100 text-blue-600' },
                            { icon: Lightbulb, title: 'Product feedback', description: 'How do you like the new feature?', color: 'bg-amber-100 text-amber-600' },
                            { icon: Target, title: 'Event follow-up', description: 'How was the workshop?', color: 'bg-purple-100 text-purple-600' },
                            { icon: ThumbsUp, title: 'Service quality', description: 'Rate your support experience', color: 'bg-green-100 text-green-600' },
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
                                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500 italic">"{item.description}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Question types</h2>
                        <p className="text-slate-600">Mix and match to build the perfect form.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Star, title: 'Star ratings', description: '1-5 stars for satisfaction scores' },
                            { icon: Target, title: 'Scale (1-10)', description: 'NPS and detailed ratings' },
                            { icon: Check, title: 'Multiple choice', description: 'Pick one or multiple options' },
                            { icon: ThumbsUp, title: 'Yes / No', description: 'Simple binary questions' },
                            { icon: MessageSquare, title: 'Short text', description: 'Brief open responses' },
                            { icon: MessageSquare, title: 'Long text', description: 'Detailed feedback' },
                        ].map((type, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                    <type.icon size={24} className="text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{type.title}</h3>
                                    <p className="text-sm text-slate-500">{type.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Create → Share → Learn</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Build', description: 'Add questions, set required fields, preview. Takes about 1 minute.' },
                            { step: '2', title: 'Share', description: 'Copy your link. Share via email, Slack, text, or embed on your site.' },
                            { step: '3', title: 'Review', description: 'Watch feedback arrive in real-time. Charts, averages, and full responses.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-violet-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-violet-600">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Start getting feedback today
                    </h2>
                    <p className="text-xl text-violet-100 mb-10">
                        Create your first form in under a minute. Free to start.
                    </p>
                    <a 
                        href="/create?type=survey"
                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-violet-700 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                    >
                        Create feedback form
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-violet-200 text-sm mt-6">No credit card required</p>
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
                                q: 'Do people need an account to respond?',
                                a: 'No. People click the link and respond immediately. No signup, no app—works on any device.'
                            },
                            {
                                q: 'Is it really free?',
                                a: 'Yes. Create feedback forms and collect responses for free. Response limits apply on free plans—paid plans offer more.'
                            },
                            {
                                q: 'Can I see individual responses?',
                                a: 'Yes. Your dashboard shows both summary data (averages, charts) and individual responses with all answers.'
                            },
                            {
                                q: 'How do I share the form?',
                                a: 'You get a unique link that works anywhere—email, Slack, SMS, QR code, or embedded on a website.'
                            },
                            {
                                q: 'Can I export responses?',
                                a: 'Yes. Export all data to CSV for analysis in Excel, Google Sheets, or any tool you use.'
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

export default FeedbackFormPage;
// ============================================================================
// Online RSVP Landing Page - Typeform-Inspired Design
// Target Keywords: online rsvp tool, online rsvp service, collect rsvps online
// Design: Clean, elegant, wedding/event focused
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, ChevronRight, ChevronLeft, Heart,
    Users, Calendar, Clock, Utensils, Music, Download,
    Sparkles, PartyPopper, Baby, Briefcase, MapPin, Play
} from 'lucide-react';

// ============================================================================
// INTERACTIVE RSVP PREVIEW
// ============================================================================

const RSVPPreview: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isComplete, setIsComplete] = useState(false);

    const steps = [
        {
            id: 0,
            type: 'attendance',
            question: "Will you be joining us?",
            subtitle: "Sarah & Michael's Wedding • June 15, 2025"
        },
        {
            id: 1,
            type: 'guests',
            question: "How many guests including yourself?",
        },
        {
            id: 2,
            type: 'meal',
            question: "Select your entrée preference",
            options: [
                { id: 'beef', label: 'Prime Rib', emoji: '🥩' },
                { id: 'chicken', label: 'Herb Chicken', emoji: '🍗' },
                { id: 'fish', label: 'Pan-Seared Salmon', emoji: '🐟' },
                { id: 'veg', label: 'Garden Risotto', emoji: '🥗' },
            ]
        },
        {
            id: 3,
            type: 'song',
            question: "Request a song for the dance floor",
            subtitle: "Help us build the perfect playlist!",
            placeholder: "Song name and artist..."
        }
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentQ = steps[currentStep];
    const hasAnswer = answers[currentStep] !== undefined;

    const handleAnswer = (answer: any) => {
        setAnswers({ ...answers, [currentStep]: answer });
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
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-rose-50 to-white"
                >
                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                        <Heart size={40} className="text-rose-500 fill-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">You're on the list!</h3>
                    <p className="text-slate-500 mb-8">We can't wait to celebrate with you.</p>
                    <button 
                        onClick={() => { setCurrentStep(0); setIsComplete(false); setAnswers({}); }}
                        className="text-rose-600 font-medium hover:underline"
                    >
                        Edit response →
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[500px] flex flex-col">
            {/* Progress */}
            <div className="h-1 bg-slate-100">
                <motion.div 
                    className="h-full bg-rose-500"
                    initial={{ width: 0 }}
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
                        <span className="text-sm text-rose-500 font-medium mb-4">
                            {currentStep + 1} → {steps.length}
                        </span>

                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                            {currentQ.question}
                        </h2>
                        {currentQ.subtitle && (
                            <p className="text-slate-500 mb-6">{currentQ.subtitle}</p>
                        )}

                        <div className="flex-1 flex flex-col justify-center">
                            {currentQ.type === 'attendance' && (
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'yes', label: 'Yes!', emoji: '🎉' },
                                        { value: 'no', label: 'Regretfully, no', emoji: '😢' },
                                        { value: 'maybe', label: 'Not sure yet', emoji: '🤔' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleAnswer(opt.value)}
                                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                                                answers[currentStep] === opt.value
                                                    ? 'border-rose-500 bg-rose-50 scale-105'
                                                    : 'border-slate-200 hover:border-rose-300'
                                            }`}
                                        >
                                            <span className="text-2xl block mb-2">{opt.emoji}</span>
                                            <span className={`text-sm font-medium ${
                                                answers[currentStep] === opt.value ? 'text-rose-700' : 'text-slate-700'
                                            }`}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'guests' && (
                                <div className="flex items-center justify-center gap-6">
                                    <button
                                        onClick={() => handleAnswer(Math.max(1, (answers[currentStep] || 1) - 1))}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 text-xl font-bold text-slate-600 hover:border-rose-300 transition"
                                    >
                                        -
                                    </button>
                                    <span className="text-5xl font-black text-slate-800 w-20 text-center">
                                        {answers[currentStep] || 1}
                                    </span>
                                    <button
                                        onClick={() => handleAnswer(Math.min(10, (answers[currentStep] || 1) + 1))}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 text-xl font-bold text-slate-600 hover:border-rose-300 transition"
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            {currentQ.type === 'meal' && (
                                <div className="space-y-3">
                                    {currentQ.options?.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleAnswer(opt.id)}
                                            className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                                                answers[currentStep] === opt.id
                                                    ? 'bg-rose-500 text-white shadow-lg'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50'
                                            }`}
                                        >
                                            <span className="text-2xl">{opt.emoji}</span>
                                            <span className="font-medium">{opt.label}</span>
                                            {answers[currentStep] === opt.id && (
                                                <Check size={20} className="ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQ.type === 'song' && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={answers[currentStep] || ''}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder={currentQ.placeholder}
                                        className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none"
                                    />
                                    <p className="text-sm text-slate-400 text-center">Optional but encouraged!</p>
                                </div>
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
                    disabled={!hasAnswer && currentQ.type !== 'song'}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                        hasAnswer || currentQ.type === 'song'
                            ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {currentStep === steps.length - 1 ? 'Submit' : 'Continue'}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

// ============================================================================
// GUEST LIST PREVIEW
// ============================================================================

const GuestListPreview: React.FC = () => {
    const guests = [
        { name: 'Emma & David', status: 'yes', count: 2, meal: 'Prime Rib' },
        { name: 'Sarah Chen', status: 'yes', count: 1, meal: 'Salmon' },
        { name: 'Michael R.', status: 'maybe', count: 2, meal: '—' },
        { name: 'Lisa Wong', status: 'no', count: 0, meal: '—' },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">Guest List</h3>
                    <span className="text-sm text-slate-500">24 of 50 responded</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">18</p>
                    <p className="text-xs text-slate-500">Attending</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-amber-500">4</p>
                    <p className="text-xs text-slate-500">Maybe</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-2xl font-bold text-slate-400">2</p>
                    <p className="text-xs text-slate-500">Can't make it</p>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
                {guests.map((g, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            g.status === 'yes' ? 'bg-emerald-100 text-emerald-600' :
                            g.status === 'maybe' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-400'
                        }`}>
                            {g.status === 'yes' ? '✓' : g.status === 'maybe' ? '?' : '✗'}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-800">{g.name}</p>
                            <p className="text-xs text-slate-500">
                                {g.count > 0 ? `${g.count} guest${g.count > 1 ? 's' : ''}` : 'Not attending'}
                                {g.meal !== '—' && ` • ${g.meal}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Download size={16} />
                Export to CSV
            </div>
        </div>
    );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const OnlineRSVPPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 min-h-[90vh] flex items-center">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hearts" width="40" height="40" patternUnits="userSpaceOnUse">
                                <text x="10" y="25" fontSize="20" opacity="0.5">♥</text>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hearts)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
                                <Heart size={16} className="fill-white" />
                                Free RSVP tool
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                                Collect RSVPs
                                <br />
                                <span className="text-rose-200">Online</span>
                            </h1>
                            
                            <p className="text-xl text-rose-100/80 mb-10 leading-relaxed max-w-lg">
                                Beautiful RSVP forms for weddings, parties, and events.
                                Guests respond in seconds. Track attendance, meals, and more.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/create?template=event-rsvp&type=survey"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-rose-600 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                                >
                                    Create free RSVP
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a 
                                    href="#templates"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 text-white/90 font-medium rounded-2xl hover:bg-white/10 transition"
                                >
                                    <Play size={18} />
                                    See templates
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="hidden lg:block"
                        >
                            <RSVPPreview />
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
                            { icon: Users, text: 'No signup for guests' },
                            { icon: Utensils, text: 'Collect meal choices' },
                            { icon: Download, text: 'Export guest list' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <item.icon size={18} className="text-rose-500" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Types */}
            <section id="templates" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">RSVPs for every occasion</h2>
                        <p className="text-slate-600">Templates designed for your event type.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Heart,
                                title: 'Wedding',
                                description: 'Attendance, plus-ones, meal preferences, dietary needs',
                                color: 'bg-rose-100 text-rose-600'
                            },
                            {
                                icon: PartyPopper,
                                title: 'Party',
                                description: 'Birthday, anniversary, graduation celebrations',
                                color: 'bg-purple-100 text-purple-600'
                            },
                            {
                                icon: Briefcase,
                                title: 'Corporate',
                                description: 'Conferences, workshops, team events',
                                color: 'bg-blue-100 text-blue-600'
                            },
                            {
                                icon: Baby,
                                title: 'Baby Shower',
                                description: 'Guest count, registry, food allergies',
                                color: 'bg-cyan-100 text-cyan-600'
                            },
                        ].map((event, i) => (
                            <motion.a
                                key={i}
                                href={`/create?template=${event.title.toLowerCase()}-rsvp&type=survey`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition group"
                            >
                                <div className={`w-12 h-12 ${event.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <event.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition">
                                    {event.title}
                                </h3>
                                <p className="text-slate-600 text-sm">{event.description}</p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">What guests see</h2>
                            <p className="text-slate-600 mb-6">Beautiful, easy-to-complete RSVP forms that work on any device.</p>
                            <RSVPPreview />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">What you see</h2>
                            <p className="text-slate-600 mb-6">Track responses in real-time. Export for your caterer anytime.</p>
                            <GuestListPreview />
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
                            { icon: Users, title: 'Guest count tracking', description: 'See exactly how many people are coming. Automatic totals.' },
                            { icon: Utensils, title: 'Meal preferences', description: 'Collect entrée choices, dietary restrictions, allergies.' },
                            { icon: Music, title: 'Song requests', description: 'Let guests help build your playlist.' },
                            { icon: MapPin, title: 'One link', description: 'Share via email, text, or on your invitation. Works everywhere.' },
                            { icon: Download, title: 'Export to CSV', description: 'Download guest list for your caterer, venue, or planning.' },
                            { icon: Clock, title: 'Real-time updates', description: 'Watch RSVPs come in as guests respond.' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-50"
                            >
                                <feature.icon size={28} className="text-rose-500 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready in minutes</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Create', description: 'Pick a template and customize your questions. Add your event details.' },
                            { step: '2', title: 'Share', description: 'Put the link on your invitation or send via email/text. Guests click and respond.' },
                            { step: '3', title: 'Track', description: 'Watch responses arrive. Export your guest list anytime.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
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
            <section className="py-24 bg-rose-500">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Start collecting RSVPs today
                    </h2>
                    <p className="text-xl text-rose-100 mb-10">
                        Create your RSVP form in minutes. Free to start.
                    </p>
                    <a 
                        href="/create?template=event-rsvp&type=survey"
                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-rose-600 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all"
                    >
                        Create free RSVP
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-rose-200 text-sm mt-6">No credit card required</p>
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
                                q: 'Do guests need to create an account?',
                                a: 'No. Guests click the link and respond immediately. No signup, no app download—works on any device.'
                            },
                            {
                                q: 'What can I collect besides attendance?',
                                a: 'Guest count, meal preferences, dietary restrictions, plus-one names, song requests, and any custom questions you want.'
                            },
                            {
                                q: 'How do I share the RSVP?',
                                a: 'You get a unique link you can put anywhere—printed invitation, email, text message, or your wedding website.'
                            },
                            {
                                q: 'Can I export the guest list?',
                                a: 'Yes. Export all responses to CSV for your caterer, venue, or your own planning spreadsheet.'
                            },
                            {
                                q: 'Is it really free?',
                                a: 'Yes. Create RSVP forms and collect responses for free. Response limits apply—paid plans offer more for larger events.'
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

export default OnlineRSVPPage;
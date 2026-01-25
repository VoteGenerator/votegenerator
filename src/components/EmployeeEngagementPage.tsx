// ============================================================================
// Employee Engagement Survey Landing Page
// Target Keywords: employee engagement survey, staff engagement survey, 
// team engagement survey, workplace engagement survey
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, BarChart3, Clock, CheckCircle, ArrowRight, Star,
    TrendingUp, Zap, Shield, Download, Smartphone, Globe,
    MessageSquare, Target, Award, ChevronRight, Play,
    ListOrdered, Scale, AlignLeft, Hash
} from 'lucide-react';

// ============================================================================
// Type definitions for survey questions
// ============================================================================

type ScaleQuestion = {
    type: 'scale';
    question: string;
    scale: string;
};

type RatingQuestion = {
    type: 'rating';
    question: string;
    stars: number;
};

type MultipleChoiceQuestion = {
    type: 'multiple_choice';
    question: string;
    options: string[];
};

type TextQuestion = {
    type: 'text';
    question: string;
};

type TextareaQuestion = {
    type: 'textarea';
    question: string;
};

type SurveyQuestion = ScaleQuestion | RatingQuestion | MultipleChoiceQuestion | TextQuestion | TextareaQuestion;

interface SurveySection {
    title: string;
    questions: SurveyQuestion[];
}

// ============================================================================
// Survey Preview Component - Shows actual question types
// ============================================================================

const SurveyPreview: React.FC = () => {
    const [activeSection, setActiveSection] = useState(0);
    
    const sections: SurveySection[] = [
        {
            title: 'Overall Satisfaction',
            questions: [
                { type: 'scale', question: 'How satisfied are you with your role?', scale: '1-10' },
                { type: 'rating', question: 'Rate your work-life balance', stars: 5 },
            ]
        },
        {
            title: 'Growth & Development',
            questions: [
                { type: 'multiple_choice', question: 'Do you feel you have growth opportunities?', options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree'] },
                { type: 'text', question: 'What skills would you like to develop?' },
            ]
        },
        {
            title: 'Team & Culture',
            questions: [
                { type: 'rating', question: 'How well does your team collaborate?', stars: 5 },
                { type: 'textarea', question: 'What would improve our culture?' },
            ]
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Employee Engagement Survey</h3>
                        <p className="text-emerald-100 text-sm">3 sections • 6 questions • ~3 min</p>
                    </div>
                </div>
                
                {/* Progress */}
                <div className="mt-4">
                    <div className="flex gap-2">
                        {sections.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSection(i)}
                                className={`flex-1 h-2 rounded-full transition ${
                                    i === activeSection ? 'bg-white' : 'bg-white/30'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                        Section {activeSection + 1} of {sections.length}
                    </span>
                    <h4 className="text-xl font-bold text-slate-800 mt-1">
                        {sections[activeSection].title}
                    </h4>
                </div>

                <div className="space-y-4">
                    {sections[activeSection].questions.map((q, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl">
                            <p className="font-medium text-slate-700 mb-3">{q.question}</p>
                            
                            {q.type === 'scale' && (
                                <div className="flex gap-2">
                                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                        <div key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium border-2 ${
                                            n === 7 ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-400'
                                        }`}>
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {q.type === 'rating' && (
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(n => (
                                        <Star key={n} size={28} className={n <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                                    ))}
                                </div>
                            )}
                            
                            {q.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                    {q.options.map((opt: string, j: number) => (
                                        <div key={j} className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                                            j === 1 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                                        }`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                j === 1 ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                                            }`}>
                                                {j === 1 && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                            <span className="text-sm text-slate-700">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {q.type === 'text' && (
                                <input 
                                    type="text" 
                                    placeholder="Type your answer..." 
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                                />
                            )}
                            
                            {q.type === 'textarea' && (
                                <textarea 
                                    placeholder="Share your thoughts..." 
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none resize-none"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                    {activeSection > 0 && (
                        <button 
                            onClick={() => setActiveSection(activeSection - 1)}
                            className="px-4 py-2 text-slate-600 font-medium"
                        >
                            ← Back
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveSection(Math.min(activeSection + 1, sections.length - 1))}
                        className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
                    >
                        {activeSection === sections.length - 1 ? 'Submit' : 'Next Section →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Results Preview Component
// ============================================================================

const ResultsPreview: React.FC = () => {
    const data = [
        { label: 'Very Satisfied', value: 42, color: 'bg-emerald-500' },
        { label: 'Satisfied', value: 31, color: 'bg-emerald-400' },
        { label: 'Neutral', value: 18, color: 'bg-slate-400' },
        { label: 'Dissatisfied', value: 9, color: 'bg-orange-400' },
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="font-bold text-slate-800">Results Dashboard</h4>
                    <p className="text-sm text-slate-500">{total} responses collected</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live</span>
                </div>
            </div>

            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700">{item.label}</span>
                            <span className="text-slate-500">{item.value} ({Math.round(item.value/total*100)}%)</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value/total)*100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`h-full ${item.color} rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">4.2</p>
                    <p className="text-xs text-slate-500">Avg Rating</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">73%</p>
                    <p className="text-xs text-slate-500">Satisfied+</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">2.4m</p>
                    <p className="text-xs text-slate-500">Avg Time</p>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Main Page Component
// ============================================================================

const EmployeeEngagementPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
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
                                <Zap size={16} />
                                Free Survey Template
                            </span>
                            
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                                Employee Engagement Survey
                            </h1>
                            
                            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                                Understand how your team really feels. Create a professional engagement survey in minutes—no signup required for your employees to respond.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a 
                                    href="/create?template=employee-engagement&type=survey"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-xl"
                                >
                                    Use This Template
                                    <ArrowRight size={20} />
                                </a>
                                <a 
                                    href="#preview"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                                >
                                    <Play size={18} />
                                    See Preview
                                </a>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap gap-6 text-emerald-100 text-sm">
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    No signup for respondents
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Works on any device
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Results in real-time
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
                            <SurveyPreview />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Everything You Need to Measure Engagement
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our employee engagement template includes proven question types used by HR teams worldwide.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Scale,
                                title: 'Satisfaction Scales',
                                description: '1-10 scales and 5-star ratings to measure satisfaction, engagement, and likelihood to recommend.',
                                color: 'bg-emerald-100 text-emerald-600'
                            },
                            {
                                icon: ListOrdered,
                                title: 'Multiple Choice',
                                description: 'Pre-built questions about growth, culture, management, and work-life balance.',
                                color: 'bg-blue-100 text-blue-600'
                            },
                            {
                                icon: AlignLeft,
                                title: 'Open-Ended Feedback',
                                description: 'Text fields for employees to share detailed thoughts and suggestions in their own words.',
                                color: 'bg-purple-100 text-purple-600'
                            },
                            {
                                icon: BarChart3,
                                title: 'Visual Results Dashboard',
                                description: 'See responses as they come in with charts, averages, and breakdowns by question.',
                                color: 'bg-amber-100 text-amber-600'
                            },
                            {
                                icon: Download,
                                title: 'Export to CSV',
                                description: 'Download all responses for deeper analysis in Excel, Google Sheets, or your HR tools.',
                                color: 'bg-rose-100 text-rose-600'
                            },
                            {
                                icon: Smartphone,
                                title: 'Mobile-Friendly',
                                description: 'Employees can respond from any device—phone, tablet, or desktop. No app needed.',
                                color: 'bg-cyan-100 text-cyan-600'
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-600">
                            From creation to insights in three simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Create Your Survey',
                                description: 'Start with our template or customize your own. Add sections, change questions, set which are required.',
                                time: '2 minutes'
                            },
                            {
                                step: '2',
                                title: 'Share the Link',
                                description: 'Send the survey link via email, Slack, or your internal tools. Employees click and respond—no account needed.',
                                time: 'Instant'
                            },
                            {
                                step: '3',
                                title: 'Review Results',
                                description: 'Watch responses come in on your dashboard. See charts, averages, and individual feedback. Export anytime.',
                                time: 'Real-time'
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
                                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 mb-4">{item.description}</p>
                                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                                        <Clock size={14} />
                                        {item.time}
                                    </span>
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
            <section id="preview" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Insights at a Glance
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Your results dashboard shows you exactly how your team feels—with visual charts and actionable metrics.
                            </p>
                            
                            <ul className="space-y-4">
                                {[
                                    'Real-time response tracking',
                                    'Visual breakdown by question',
                                    'Average scores and ratings',
                                    'Full text responses for open-ended questions',
                                    'Export everything to CSV'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <ResultsPreview />
                    </div>
                </div>
            </section>

            {/* Question Types */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            15 Question Types to Choose From
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Build the perfect survey with our flexible question types. Mix and match to get the feedback you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: 'Multiple Choice', icon: CheckCircle },
                            { name: 'Star Rating', icon: Star },
                            { name: 'Scale (1-10)', icon: Hash },
                            { name: 'Yes / No', icon: Target },
                            { name: 'Short Text', icon: MessageSquare },
                            { name: 'Long Text', icon: AlignLeft },
                            { name: 'Dropdown', icon: ListOrdered },
                            { name: 'Ranking', icon: Award },
                            { name: 'Number', icon: Hash },
                            { name: 'Date Picker', icon: Clock },
                        ].map((type, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                                <type.icon size={24} className="mx-auto text-slate-400 mb-2" />
                                <span className="text-sm font-medium text-slate-700">{type.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Ready to hear from your team?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Create your employee engagement survey in minutes. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/create?template=employee-engagement&type=survey"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-xl"
                        >
                            Use This Template
                            <ArrowRight size={20} />
                        </a>
                        <a 
                            href="/create?type=survey"
                            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                        >
                            Start from Scratch
                        </a>
                    </div>
                    
                    <p className="text-emerald-200 text-sm mt-6">
                        Free to create • No signup for respondents • Results in real-time
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        Frequently Asked Questions
                    </h2>
                    
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Do employees need to create an account to respond?',
                                a: 'No. Employees simply click the link and start answering. No signup, no app download, no email required.'
                            },
                            {
                                q: 'Can I customize the questions?',
                                a: 'Yes. Start with our template and add, remove, or edit any question. You can also create multiple sections and set which questions are required.'
                            },
                            {
                                q: 'How do I share the survey with my team?',
                                a: 'You get a unique link that you can share via email, Slack, Teams, or any communication tool your company uses.'
                            },
                            {
                                q: 'Can I see individual responses?',
                                a: 'Yes. The results dashboard shows both aggregated data (charts, averages) and individual responses. You can view each submission with all answers.'
                            },
                            {
                                q: 'Is there a limit on how many people can respond?',
                                a: 'The free plan has response limits. For larger teams or unlimited responses, check our Pro and Business plans.'
                            },
                            {
                                q: 'Can I export the results?',
                                a: 'Yes. Export all responses to CSV for analysis in Excel, Google Sheets, or your HR analytics tools.'
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
        </div>
    );
};

export default EmployeeEngagementPage;
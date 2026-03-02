// ============================================================================
// EmployeeSurveyPage - High-Converting Landing Page
// Target Keywords: employee engagement survey, employee satisfaction survey,
//                  anonymous employee feedback, workplace survey, team feedback
// Monthly Search Volume: 49,500+
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Shield, BarChart3, Clock, CheckCircle2, ArrowRight,
    Eye, EyeOff, TrendingUp, Heart, MessageSquare, Zap,
    Lock, Globe, Smartphone, Download, Bell, Star,
    ChevronRight, Play, Check, X, Sparkles,
    Building2, UserCheck, Target, Award, AlertTriangle,
    PieChart, LineChart, Quote, ArrowUpRight, Briefcase
} from 'lucide-react';
import NavHeader from '../components/NavHeader';
import Footer from '../components/Footer';

// ============================================================================
// JSON-LD SCHEMA FOR AEO (ChatGPT, Perplexity, Google AI Overviews)
// This is what AI engines read and cite - NOT visible to users
// ============================================================================

const PageSchema = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I create an anonymous employee satisfaction survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To create an anonymous employee satisfaction survey: 1) Go to VoteGenerator and click 'Create Survey', 2) Add your questions using templates or custom questions, 3) Enable 'Anonymous Mode' in settings - this removes all identifying information including names, emails, and IP addresses, 4) Share the survey link with your team via email, Slack, or your intranet. Responses are collected without any way to trace them back to individuals, encouraging honest feedback."
                }
            },
            {
                "@type": "Question",
                "name": "What questions should I include in an employee engagement survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Effective employee engagement surveys include questions across these categories: Job Satisfaction (rating overall satisfaction, work-life balance), Management & Leadership (supervisor support, communication), Growth & Development (career opportunities, training), Company Culture (values alignment, team collaboration), Recognition (feeling valued, fair compensation), and Work Environment (resources, tools needed). Use a mix of rating scales (1-5 or 1-10) and open-ended questions. Keep surveys under 15 minutes to maximize completion rates."
                }
            },
            {
                "@type": "Question",
                "name": "How often should companies run employee satisfaction surveys?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Best practices recommend: Annual comprehensive surveys (20-30 questions) for detailed insights, Quarterly pulse surveys (5-10 questions) to track trends, and Event-based surveys after major changes like reorganizations or policy updates. Monthly micro-surveys (2-3 questions) can maintain ongoing feedback loops. The key is balancing frequency with survey fatigue - too many surveys reduce response rates and quality."
                }
            },
            {
                "@type": "Question",
                "name": "What is a good employee engagement survey response rate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A good employee engagement survey response rate is 70-80%. Rates above 80% are excellent and indicate strong employee trust and engagement. Below 50% suggests potential issues with survey fatigue, distrust in anonymity, or poor communication. To improve rates: emphasize anonymity, communicate why feedback matters, keep surveys short (under 10 minutes), send reminders, and share results and actions taken from previous surveys."
                }
            },
            {
                "@type": "Question",
                "name": "Are anonymous employee surveys really anonymous?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With VoteGenerator's Anonymous Mode, surveys are truly anonymous because: no login or email is required to respond, IP addresses are not stored, browser fingerprinting is disabled, timestamps are removed from individual responses, demographic data is optional and aggregated, and even administrators cannot trace responses to individuals. This is different from some enterprise tools where 'anonymous' may still track department or role data that could identify respondents in small teams."
                }
            },
            {
                "@type": "Question",
                "name": "How do I analyze employee survey results effectively?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To analyze employee survey results: 1) Start with overall scores and benchmark against industry standards (typically 65-75% favorable is average), 2) Look for patterns in low-scoring areas across departments or demographics, 3) Read open-ended responses for context and specific examples, 4) Compare results to previous surveys to identify trends, 5) Prioritize 2-3 actionable areas rather than trying to fix everything, 6) Share results transparently with employees and create action plans with timelines."
                }
            },
            {
                "@type": "Question",
                "name": "What's the difference between employee satisfaction and employee engagement surveys?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Employee satisfaction surveys measure how happy employees are with their job, compensation, benefits, and work conditions - it's about contentment. Employee engagement surveys measure emotional commitment, motivation, and willingness to go above and beyond - it's about passion and investment in the company's success. An employee can be satisfied (happy with pay and hours) but not engaged (doing the minimum). Engagement surveys typically predict retention and performance better than satisfaction surveys alone."
                }
            },
            {
                "@type": "Question",
                "name": "Do employees need to create accounts to take the survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. VoteGenerator requires no signup, login, or email verification for survey respondents. Employees simply click the survey link and respond immediately. This frictionless approach increases response rates significantly compared to enterprise survey tools that require authentication. It also reinforces anonymity since there's no account tied to responses."
                }
            },
            {
                "@type": "Question",
                "name": "How do I share an employee survey with my team?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VoteGenerator provides multiple sharing options: 1) Copy the unique survey link to paste in emails, Slack, Microsoft Teams, or your company intranet, 2) Download a QR code for office displays, posters, or printed materials, 3) Embed the survey directly in your internal portal or HR system. No special software or plugins required for respondents."
                }
            },
            {
                "@type": "Question",
                "name": "What is eNPS (Employee Net Promoter Score)?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "eNPS (Employee Net Promoter Score) measures employee loyalty using the question 'How likely are you to recommend this company as a place to work?' on a 0-10 scale. Respondents are categorized as Promoters (9-10), Passives (7-8), or Detractors (0-6). eNPS = % Promoters - % Detractors. Scores range from -100 to +100. Above 10 is good, above 30 is great, above 50 is excellent. VoteGenerator calculates eNPS automatically."
                }
            }
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Create an Employee Satisfaction Survey",
        "description": "Step-by-step guide to creating an anonymous employee engagement or satisfaction survey in under 5 minutes",
        "totalTime": "PT5M",
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
        },
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Start the survey builder",
                "text": "Go to VoteGenerator.com and click 'Create Survey'. Choose the Employee Engagement template or start from scratch."
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Add your questions",
                "text": "Add questions using multiple choice, rating scales (1-5 or 1-10), and open-ended text fields. Include questions about job satisfaction, management, growth opportunities, and company culture."
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Enable anonymous mode",
                "text": "Toggle on Anonymous Mode to remove all identifying information from responses. This ensures employees can provide honest feedback without fear of identification."
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Customize settings",
                "text": "Set a deadline, add a custom thank-you message, and choose whether to show real-time results or keep them hidden until the survey closes."
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Share with your team",
                "text": "Copy the survey link and share via email, Slack, Microsoft Teams, or your company intranet. Download the QR code for office displays."
            }
        ]
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Create Anonymous Employee Satisfaction Surveys",
        "description": "Complete guide to creating employee engagement surveys that get honest feedback. Includes sample questions, best practices, and free survey templates.",
        "author": {
            "@type": "Organization",
            "name": "VoteGenerator"
        },
        "publisher": {
            "@type": "Organization",
            "name": "VoteGenerator",
            "logo": {
                "@type": "ImageObject",
                "url": "https://votegenerator.com/logooutline.svg"
            }
        },
        "datePublished": "2024-01-15",
        "dateModified": "2026-03-01"
    };

    return (
        <>
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
        </>
    );
};

// ============================================================================
// HERO SECTION - Problem-focused headline, immediate value
// ============================================================================

const HeroSection: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                {/* Grid pattern */}
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            <span>100% Anonymous by Default</span>
                        </div>

                        {/* Main headline - Problem focused */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                            Get honest feedback<br />
                            <span className="text-emerald-300">your team actually gives</span>
                        </h1>

                        {/* Subheadline - Solution */}
                        <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl">
                            Anonymous employee surveys that surface real insights. 
                            No signup required. Results in real-time. 
                            See what your team really thinks.
                        </p>

                        {/* Key benefits */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {[
                                { icon: EyeOff, text: 'Anonymous responses' },
                                { icon: Clock, text: 'Ready in 2 minutes' },
                                { icon: Smartphone, text: 'Works on any device' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                                    <item.icon className="w-4 h-4 text-emerald-300" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="/survey?template=employee-engagement"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold text-lg rounded-xl hover:bg-emerald-50 transition shadow-xl shadow-emerald-900/20"
                            >
                                <Sparkles className="w-5 h-5" />
                                Create Free Survey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                            >
                                <Play className="w-5 h-5" />
                                See how it works
                            </a>
                        </div>

                        {/* No signup reminder */}
                        <p className="text-emerald-200 text-sm mt-6 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            No signup required • Free forever • Upgrade anytime
                        </p>
                    </motion.div>

                    {/* Right: Survey Preview */}
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
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <Users className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">Employee Engagement</h3>
                                            <p className="text-xs text-slate-500">10 questions • Anonymous</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Anonymous
                                    </span>
                                </div>

                                {/* Sample question */}
                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-slate-600 mb-3">Question 1 of 10</p>
                                    <p className="font-semibold text-slate-900 mb-4">
                                        How likely are you to recommend this company as a great place to work?
                                    </p>
                                    
                                    {/* NPS Scale */}
                                    <div className="flex gap-1">
                                        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                                            <button
                                                key={n}
                                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                                                    n === 8 
                                                        ? 'bg-emerald-500 text-white' 
                                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'
                                                }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                                        <span>Not at all likely</span>
                                        <span>Extremely likely</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[10%] bg-emerald-500 rounded-full" />
                                    </div>
                                    <span className="text-xs text-slate-500">10%</span>
                                </div>
                            </div>

                            {/* Floating stats card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Response Rate</p>
                                        <p className="font-bold text-slate-900">87%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating anonymous badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="absolute -top-4 -right-4 bg-emerald-600 text-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2"
                            >
                                <EyeOff className="w-4 h-4" />
                                <span className="text-sm font-medium">Identity Protected</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// PROBLEM SECTION - Agitate the pain points
// ============================================================================

const ProblemSection: React.FC = () => {
    const problems = [
        {
            icon: AlertTriangle,
            title: "Employees don't speak up",
            description: "Fear of retaliation kills honest feedback. Traditional surveys get sanitized responses.",
            color: 'text-red-500',
            bgColor: 'bg-red-50',
        },
        {
            icon: Clock,
            title: "Survey fatigue is real",
            description: "Long, complicated surveys get abandoned. Low response rates mean unreliable data.",
            color: 'text-amber-500',
            bgColor: 'bg-amber-50',
        },
        {
            icon: Eye,
            title: "Results take forever",
            description: "Waiting weeks for HR to compile data means issues fester. Problems grow while you wait.",
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
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
                        Why most employee surveys fail
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Traditional surveys create more problems than they solve. 
                        Here's what's really happening with your feedback programs.
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
                            <div className={`w-12 h-12 ${problem.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                <problem.icon className={`w-6 h-6 ${problem.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{problem.title}</h3>
                            <p className="text-slate-600">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// SOLUTION SECTION - Our approach
// ============================================================================

const SolutionSection: React.FC = () => {
    const features = [
        {
            icon: Shield,
            title: "True Anonymity",
            description: "No tracking, no timestamps that reveal identity, no way to trace responses back to individuals. Your team knows it's safe.",
            highlight: "Anonymous by default",
            color: 'emerald',
        },
        {
            icon: Zap,
            title: "2-Minute Setup",
            description: "Pre-built questions from organizational psychologists. Just add your team and share the link. No account needed.",
            highlight: "10 research-backed questions",
            color: 'blue',
        },
        {
            icon: BarChart3,
            title: "Real-Time Results",
            description: "Watch responses come in live. Beautiful charts and insights update instantly. No waiting for reports.",
            highlight: "Live dashboard",
            color: 'purple',
        },
        {
            icon: Smartphone,
            title: "Works Everywhere",
            description: "Share via Slack, email, or QR code. Employees respond on phone, tablet, or desktop in under 3 minutes.",
            highlight: "Any device, any time",
            color: 'amber',
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        The VoteGenerator Difference
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Employee surveys that actually work
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We've stripped away everything that makes surveys fail. 
                        What's left is a simple, anonymous way to hear your team.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300" />
                            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-emerald-300 transition-colors">
                                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                                </div>
                                <span className={`inline-block px-3 py-1 bg-${feature.color}-100 text-${feature.color}-700 text-xs font-bold rounded-full mb-3`}>
                                    {feature.highlight}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// HOW IT WORKS - Simple 3-step process
// ============================================================================

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: '01',
            title: 'Choose a template',
            description: 'Start with our research-backed Employee Engagement template or customize your own questions.',
            image: '📋',
            time: '30 seconds',
        },
        {
            number: '02',
            title: 'Share with your team',
            description: 'Send via email, Slack, or share a QR code. No accounts or downloads required for responders.',
            image: '📤',
            time: '10 seconds',
        },
        {
            number: '03',
            title: 'Get honest insights',
            description: 'Watch anonymous responses flow in. Beautiful charts show you exactly where to focus.',
            image: '📊',
            time: 'Real-time',
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-slate-600">
                        From zero to actionable insights in under 5 minutes
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative"
                        >
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-300 to-transparent" />
                            )}
                            
                            <div className="text-center">
                                {/* Number badge */}
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white font-bold rounded-full mb-6 text-lg">
                                    {step.number}
                                </div>
                                
                                {/* Icon */}
                                <div className="text-6xl mb-4">{step.image}</div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 mb-3">{step.description}</p>
                                
                                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {step.time}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="/survey?template=employee-engagement"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold text-lg rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                    >
                        Try it now — it's free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================================================
// QUESTIONS PREVIEW - Show what's in the template
// ============================================================================

const QuestionsPreview: React.FC = () => {
    const questions = [
        { type: 'NPS', q: 'How likely are you to recommend this company as a great place to work?', category: 'Overall' },
        { type: 'Rating', q: 'I feel valued for my contributions at work.', category: 'Recognition' },
        { type: 'Rating', q: 'I have the resources I need to do my job effectively.', category: 'Resources' },
        { type: 'Rating', q: 'My manager gives me regular, constructive feedback.', category: 'Management' },
        { type: 'Rating', q: 'I see a clear path for growth and advancement here.', category: 'Growth' },
        { type: 'Rating', q: 'I can maintain a healthy work-life balance.', category: 'Balance' },
        { type: 'Rating', q: 'Communication from leadership is clear and transparent.', category: 'Leadership' },
        { type: 'Rating', q: 'I feel psychologically safe to share ideas and concerns.', category: 'Safety' },
        { type: 'Rating', q: 'Our team collaborates effectively to achieve goals.', category: 'Team' },
        { type: 'Open', q: 'What\'s one thing we could do to make this a better place to work?', category: 'Feedback' },
    ];

    return (
        <section className="py-20 bg-emerald-50">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        <Target className="w-4 h-4" />
                        Research-Backed Questions
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        10 questions that reveal everything
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Designed by organizational psychologists to measure engagement, 
                        satisfaction, and identify areas for improvement.
                    </p>
                </motion.div>

                <div className="grid gap-3">
                    {questions.map((q, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl p-4 flex items-center gap-4 border border-emerald-100 hover:border-emerald-300 transition-colors"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-medium">{q.q}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    {q.category}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    q.type === 'NPS' ? 'bg-purple-100 text-purple-700' :
                                    q.type === 'Open' ? 'bg-blue-100 text-blue-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                    {q.type}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <p className="text-slate-600 mb-4">
                        Average completion time: <strong className="text-emerald-600">2 minutes 30 seconds</strong>
                    </p>
                    <a
                        href="/survey?template=employee-engagement"
                        className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
                    >
                        Use this template
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================================================
// RESULTS PREVIEW - Show what insights look like
// ============================================================================

const ResultsPreview: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                            <BarChart3 className="w-4 h-4" />
                            Real-Time Analytics
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Insights that drive action
                        </h2>
                        <p className="text-lg text-slate-600 mb-6">
                            No more spreadsheets. No more waiting. Get beautiful, 
                            actionable insights the moment responses come in.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: PieChart, title: 'eNPS Score', desc: 'Employee Net Promoter Score calculated automatically' },
                                { icon: LineChart, title: 'Trend Analysis', desc: 'Track engagement over time with repeat surveys' },
                                { icon: Target, title: 'Focus Areas', desc: 'See exactly which areas need attention' },
                                { icon: Download, title: 'Export Reports', desc: 'Download PDF or CSV for leadership presentations' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Results dashboard preview */}
                        <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-semibold">Engagement Dashboard</h3>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                    Live
                                </span>
                            </div>

                            {/* eNPS Score */}
                            <div className="bg-slate-800 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-sm">Employee NPS</span>
                                    <span className="text-emerald-400 text-xs">↑ 12 from last quarter</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-white">+42</span>
                                    <span className="text-emerald-400 text-sm mb-1">Great</span>
                                </div>
                                <div className="mt-3 flex gap-1">
                                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '45%' }} />
                                    <div className="h-2 bg-slate-600 rounded-full" style={{ width: '30%' }} />
                                    <div className="h-2 bg-red-500 rounded-full" style={{ width: '25%' }} />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Promoters (45%)</span>
                                    <span>Passives (30%)</span>
                                    <span>Detractors (25%)</span>
                                </div>
                            </div>

                            {/* Category scores */}
                            <div className="space-y-3">
                                {[
                                    { name: 'Growth & Development', score: 4.2, change: '+0.3' },
                                    { name: 'Work-Life Balance', score: 3.8, change: '+0.1' },
                                    { name: 'Team Collaboration', score: 4.5, change: '+0.4' },
                                    { name: 'Leadership Trust', score: 3.6, change: '-0.2', negative: true },
                                ].map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-slate-300 text-sm">{cat.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${cat.negative ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${(cat.score / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-white font-medium text-sm w-8">{cat.score}</span>
                                            <span className={`text-xs ${cat.negative ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {cat.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// USE CASES - Who this is for
// ============================================================================

const UseCasesSection: React.FC = () => {
    const cases = [
        {
            icon: Building2,
            title: 'HR Teams',
            description: 'Run quarterly engagement surveys, exit interviews, and pulse checks without expensive software.',
            benefits: ['Track engagement trends', 'Identify flight risks', 'Measure culture health'],
        },
        {
            icon: Users,
            title: 'Team Leads',
            description: 'Get honest feedback from your direct reports without awkward 1:1 conversations.',
            benefits: ['Anonymous team feedback', 'Identify blockers', 'Improve team dynamics'],
        },
        {
            icon: Briefcase,
            title: 'Startups',
            description: 'Build a feedback culture from day one without enterprise complexity or costs.',
            benefits: ['No budget required', 'Scale as you grow', 'Instant insights'],
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
                        Built for teams like yours
                    </h2>
                    <p className="text-lg text-slate-600">
                        Whether you're a team of 5 or 500, get the insights you need.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
                        >
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <useCase.icon className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                            <p className="text-slate-600 mb-6">{useCase.description}</p>
                            <ul className="space-y-2">
                                {useCase.benefits.map((benefit, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// COMPARISON SECTION - Why not competitors
// ============================================================================

const ComparisonSection: React.FC = () => {
    const features = [
        { name: 'No signup required', us: true, them: false },
        { name: 'Free tier available', us: true, them: false },
        { name: 'True anonymity', us: true, them: 'Partial' },
        { name: 'Setup time', us: '2 min', them: '2-4 hours' },
        { name: 'Results in real-time', us: true, them: 'Days' },
        { name: 'Mobile-friendly', us: true, them: true },
        { name: 'Starting price', us: '$0', them: '$200/mo' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Enterprise features, startup simplicity
                    </h2>
                    <p className="text-lg text-slate-600">
                        Get what you need without the complexity (or cost) of enterprise tools.
                    </p>
                </motion.div>

                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                    <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold text-slate-900">
                        <div>Feature</div>
                        <div className="text-center text-emerald-600">VoteGenerator</div>
                        <div className="text-center text-slate-400">Others</div>
                    </div>
                    {features.map((feature, i) => (
                        <div key={i} className={`grid grid-cols-3 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <div className="text-slate-700">{feature.name}</div>
                            <div className="text-center">
                                {feature.us === true ? (
                                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                ) : (
                                    <span className="text-emerald-600 font-semibold">{feature.us}</span>
                                )}
                            </div>
                            <div className="text-center">
                                {feature.them === true ? (
                                    <Check className="w-5 h-5 text-slate-400 mx-auto" />
                                ) : feature.them === false ? (
                                    <X className="w-5 h-5 text-slate-300 mx-auto" />
                                ) : (
                                    <span className="text-slate-400">{feature.them}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// CTA SECTION - Final push
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to hear what your team really thinks?
                </h2>
                <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                    Create your first anonymous employee survey in under 2 minutes. 
                    No signup, no credit card, no commitment.
                </p>
                <a
                    href="/survey?template=employee-engagement"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 font-bold text-lg rounded-xl hover:bg-emerald-50 transition shadow-xl"
                >
                    <Users className="w-6 h-6" />
                    Create Your Employee Survey
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-emerald-200 text-sm mt-6 flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> No signup</span>
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Free forever</span>
                    <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Anonymous by default</span>
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
            q: 'How is anonymity guaranteed?',
            a: 'We don\'t collect names, emails, or any identifying information by default. Responses are stored without timestamps that could reveal identity. Even you as the admin cannot trace responses to individuals.'
        },
        {
            q: 'Do my employees need to create accounts?',
            a: 'No! Employees just click the link and respond. No signup, no email verification, no downloads. It takes under 3 minutes to complete.'
        },
        {
            q: 'What\'s included in the free plan?',
            a: 'Free includes up to 100 responses per month, all question types, real-time results, and basic analytics. Upgrade for unlimited responses and advanced features.'
        },
        {
            q: 'Can I customize the questions?',
            a: 'Absolutely. Start with our research-backed template or create your own questions from scratch. Mix question types including ratings, open text, and multiple choice.'
        },
        {
            q: 'How do I share the survey with my team?',
            a: 'You get a unique link you can share via email, Slack, Teams, or any messaging app. You can also generate a QR code or embed it in your intranet.'
        },
        {
            q: 'Is this GDPR compliant?',
            a: 'Yes. Since we don\'t collect personal data by default, there\'s minimal GDPR exposure. For Enterprise plans, we offer data processing agreements and EU hosting options.'
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
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
                            className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
                        >
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50 transition list-none">
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

const EmployeeSurveyPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* JSON-LD Schema for SEO/AEO - read by ChatGPT, Perplexity, Google */}
            <PageSchema />
            
            <NavHeader />
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <HowItWorksSection />
            <QuestionsPreview />
            <ResultsPreview />
            <UseCasesSection />
            <ComparisonSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default EmployeeSurveyPage;
// ============================================================================
// QuickSurveyPage - SEO/AEO Landing Page with Schema
// Target Keywords: quick survey maker, fast survey tool, simple survey creator,
//                  instant survey, one-minute survey, easy survey builder
// Monthly Search Volume: 500+ (quick survey maker)
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Clock, CheckCircle2, ArrowRight, Smartphone, Star,
    ChevronRight, Check, Sparkles, Timer, Target, Award,
    Users, BarChart3, Send, Play, Rocket, Shield
} from 'lucide-react';
import NavHeader from '../components/NavHeader';
import Footer from '../components/Footer';

// ============================================================================
// JSON-LD SCHEMA FOR AEO (ChatGPT, Perplexity, Google AI Overviews)
// ============================================================================

const PageSchema = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the fastest way to create a survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The fastest way to create a survey is using VoteGenerator: 1) Go to VoteGenerator.com and click Create Survey, 2) Type your question and add answer options, 3) Click Create - done in under 60 seconds. No signup required, no account needed. Share the link immediately via any messaging app, email, or social media."
                }
            },
            {
                "@type": "Question",
                "name": "How do I create a quick poll without signing up?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VoteGenerator lets you create polls instantly without any signup: Visit votegenerator.com, enter your question and options, click Create, and share the generated link. No email verification, no account creation, no downloads. Your poll is live immediately and works on any device."
                }
            },
            {
                "@type": "Question",
                "name": "What's the best free survey maker for quick surveys?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VoteGenerator is the best free survey maker for quick surveys because: No signup required (create in seconds), unlimited free surveys, real-time results, works on all devices, and includes multiple question types like multiple choice, rating scales, and open-ended questions. Other options like Google Forms and SurveyMonkey require accounts and have more complex interfaces."
                }
            },
            {
                "@type": "Question",
                "name": "How long should a quick survey be?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Quick surveys should be 1-5 questions and take under 2 minutes to complete. Research shows response rates drop significantly after 5 questions. For maximum engagement: 1-2 questions for immediate feedback, 3-5 questions for deeper insights, and always put the most important question first."
                }
            },
            {
                "@type": "Question",
                "name": "Can I create a survey on my phone?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. VoteGenerator is fully mobile-friendly - you can create surveys on any smartphone or tablet through your web browser. No app download required. Create your survey, share the link via text or messaging apps, and view results all from your phone."
                }
            },
            {
                "@type": "Question",
                "name": "How do I share a quick survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After creating your survey, you get a unique link you can share anywhere: Copy and paste into text messages, email, Slack, Teams, or Discord. Share directly to social media like Twitter, Facebook, or LinkedIn. Generate a QR code for physical displays. Embed on your website. All sharing options are free and work instantly."
                }
            },
            {
                "@type": "Question",
                "name": "Do respondents need accounts to answer my survey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Survey respondents simply click your link and answer - no signup, no email, no downloads required. This frictionless experience dramatically increases response rates compared to survey tools that require authentication."
                }
            },
            {
                "@type": "Question",
                "name": "Can I see survey results in real-time?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. VoteGenerator shows results updating in real-time as responses come in. Watch charts and percentages change live. You can also choose to hide results from respondents until the survey closes, or show results publicly so everyone can see how others voted."
                }
            }
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Create a Quick Survey in 60 Seconds",
        "description": "Create an instant survey or poll without signing up",
        "totalTime": "PT1M",
        "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "0" },
        "step": [
            { "@type": "HowToStep", "position": 1, "name": "Go to VoteGenerator", "text": "Visit votegenerator.com - no signup needed" },
            { "@type": "HowToStep", "position": 2, "name": "Enter your question", "text": "Type your survey question and add answer options" },
            { "@type": "HowToStep", "position": 3, "name": "Click Create", "text": "Your survey is instantly live and ready to share" },
            { "@type": "HowToStep", "position": 4, "name": "Share the link", "text": "Copy the link and share via text, email, or social media" }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        </>
    );
};

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700">
        <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-violet-100 text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        <span>Create surveys in 60 seconds</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                        Quick Survey<br />
                        <span className="text-violet-300">Maker</span>
                    </h1>

                    <p className="text-lg md:text-xl text-violet-100 mb-8 max-w-xl">
                        Create instant surveys without signing up. Get real-time responses. 
                        Share anywhere. Done in under a minute.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {[
                            { icon: Timer, text: 'Ready in 60 seconds' },
                            { icon: Shield, text: 'No signup needed' },
                            { icon: Smartphone, text: 'Works everywhere' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                <item.icon className="w-4 h-4 text-violet-300" />
                                {item.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/create" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold text-lg rounded-xl hover:bg-violet-50 transition shadow-xl">
                            <Sparkles className="w-5 h-5" />
                            Create Survey Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <p className="text-violet-200 text-sm mt-6 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        No signup • No email • Free forever
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-violet-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Quick Poll</h3>
                                <p className="text-xs text-slate-500">Created just now</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <p className="font-semibold text-slate-900 mb-4">Where should we go for lunch?</p>
                            <div className="space-y-2">
                                {['🍕 Pizza Place', '🍜 Asian Fusion', '🥗 Salad Bar', '🌮 Taco Truck'].map((opt, i) => (
                                    <div key={i} className={`p-3 rounded-lg border-2 transition cursor-pointer ${i === 0 ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-violet-300'}`}>
                                        <span className="text-slate-900 font-medium">{opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl">Vote</button>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

// ============================================================================
// SPEED COMPARISON SECTION
// ============================================================================

const SpeedSection: React.FC = () => {
    const comparisons = [
        { tool: 'VoteGenerator', time: '60 seconds', signup: 'No', color: 'violet' },
        { tool: 'Google Forms', time: '3-5 minutes', signup: 'Yes (Google account)', color: 'slate' },
        { tool: 'SurveyMonkey', time: '5-10 minutes', signup: 'Yes (email required)', color: 'slate' },
        { tool: 'Typeform', time: '5-10 minutes', signup: 'Yes (email required)', color: 'slate' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The fastest way to create a survey</h2>
                    <p className="text-lg text-slate-600">Compare how long it takes to go from idea to live survey.</p>
                </motion.div>

                <div className="bg-slate-50 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-3 bg-slate-100 p-4 font-semibold text-slate-900 text-sm">
                        <div>Tool</div>
                        <div className="text-center">Time to Create</div>
                        <div className="text-center">Signup Required?</div>
                    </div>
                    {comparisons.map((c, i) => (
                        <div key={i} className={`grid grid-cols-3 p-4 items-center ${i === 0 ? 'bg-violet-50 border-l-4 border-violet-500' : ''}`}>
                            <div className={`font-medium ${i === 0 ? 'text-violet-700' : 'text-slate-600'}`}>{c.tool}</div>
                            <div className={`text-center font-bold ${i === 0 ? 'text-violet-600' : 'text-slate-500'}`}>{c.time}</div>
                            <div className="text-center">
                                {c.signup === 'No' ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                        <Check className="w-4 h-4" /> None
                                    </span>
                                ) : (
                                    <span className="text-slate-400 text-sm">{c.signup}</span>
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
// USE CASES SECTION
// ============================================================================

const UseCasesSection: React.FC = () => {
    const useCases = [
        { icon: Users, title: "Team Decisions", desc: "Quickly poll your team on lunch spots, meeting times, or project priorities", time: "30 sec" },
        { icon: BarChart3, title: "Quick Feedback", desc: "Get instant feedback after meetings, events, or presentations", time: "45 sec" },
        { icon: Target, title: "Event Planning", desc: "Vote on venues, dates, activities, or themes for any event", time: "1 min" },
        { icon: Star, title: "Opinion Polls", desc: "Gather opinions on anything from product names to weekend plans", time: "30 sec" },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perfect for quick decisions</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((uc, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                                <uc.icon className="w-6 h-6 text-violet-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{uc.title}</h3>
                            <p className="text-sm text-slate-600 mb-3">{uc.desc}</p>
                            <span className="inline-flex items-center gap-1 text-xs text-violet-600 font-medium">
                                <Timer className="w-3 h-3" /> {uc.time}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// HOW IT WORKS SECTION
// ============================================================================

const HowItWorksSection: React.FC = () => {
    const steps = [
        { num: '1', title: 'Type your question', desc: 'Enter what you want to ask and add answer options', icon: '✏️' },
        { num: '2', title: 'Click Create', desc: 'Your survey is instantly live - no account needed', icon: '⚡' },
        { num: '3', title: 'Share the link', desc: 'Copy and paste anywhere - text, email, Slack, social', icon: '🔗' },
        { num: '4', title: 'Watch results', desc: 'See responses in real-time as people vote', icon: '📊' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
                    <p className="text-lg text-slate-600">Four steps. Sixty seconds. Zero signups.</p>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                            <div className="text-4xl mb-4">{step.icon}</div>
                            <div className="w-10 h-10 bg-violet-600 text-white font-bold rounded-full flex items-center justify-center mx-auto mb-3">{step.num}</div>
                            <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-600">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection: React.FC = () => {
    const faqs = [
        { q: "What's the fastest way to create a survey?", a: "VoteGenerator - go to the site, type your question, click create. Done in 60 seconds with no signup." },
        { q: "Do I need an account?", a: "No. Create unlimited surveys without signing up. No email, no password, no verification." },
        { q: "Is it really free?", a: "Yes. Basic surveys are free forever with up to 100 responses. Upgrade for more responses and features." },
        { q: "Can I see results in real-time?", a: "Yes. Watch results update live as responses come in. Charts and percentages refresh automatically." },
        { q: "Does it work on mobile?", a: "Yes. Create and share surveys from any device. Respondents can vote on phones, tablets, or computers." },
        { q: "How do I share my survey?", a: "Copy the unique link and paste anywhere - text messages, email, Slack, Discord, social media, or embed on websites." },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">FAQ</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 list-none">
                                {faq.q}
                                <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
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
    <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to create a survey?</h2>
            <p className="text-xl text-violet-100 mb-8">It takes 60 seconds. No signup. No credit card.</p>
            <a href="/create" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-violet-700 font-bold text-lg rounded-xl shadow-xl hover:bg-violet-50 transition">
                <Zap className="w-6 h-6" />
                Create Quick Survey
                <ArrowRight className="w-6 h-6" />
            </a>
        </div>
    </section>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

const QuickSurveyPage: React.FC = () => (
    <div className="min-h-screen">
        <PageSchema />
        <NavHeader />
        <HeroSection />
        <SpeedSection />
        <UseCasesSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
        <Footer />
    </div>
);

export default QuickSurveyPage;
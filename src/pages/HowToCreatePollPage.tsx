// ============================================================================
// HowToCreatePollPage.tsx - SEO Landing Page  
// Target Keywords: "how to create a poll", "free poll maker online",
//                  "make a poll free", "create poll no signup"
// Location: src/components/pages/HowToCreatePollPage.tsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowRight, CheckCircle2, Clock, Zap, 
    Share2, BarChart3, Lock, Users, Smartphone,
    Star, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import PremiumNav from '../components/PremiumNav';
import Footer from '../components/Footer';

// Schema for SEO
const PAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create a Free Online Poll",
    "description": "Step-by-step guide to creating a poll online in under 60 seconds with no signup required",
    "totalTime": "PT1M",
    "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
    },
    "step": [
        {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter your poll question",
            "text": "Go to VoteGenerator and type your poll question. Add an optional description for context."
        },
        {
            "@type": "HowToStep",
            "position": 2,
            "name": "Add answer options",
            "text": "Enter at least 2 answer options. Click Add Option for more, up to 20 options per poll."
        },
        {
            "@type": "HowToStep",
            "position": 3,
            "name": "Choose your poll type",
            "text": "Select Multiple Choice, Ranked Choice, Rating Scale, Image Poll, or Meeting Scheduler."
        },
        {
            "@type": "HowToStep",
            "position": 4,
            "name": "Configure settings",
            "text": "Optional: enable vote protection, require names, set deadline, or choose a theme."
        },
        {
            "@type": "HowToStep",
            "position": 5,
            "name": "Create and share",
            "text": "Click Create Poll to generate your poll. Copy the link, download QR code, or embed on your website."
        }
    ]
};

const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How do I create a free online poll?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "To create a free online poll: 1) Go to a poll maker like VoteGenerator, 2) Enter your question and add answer options, 3) Select your poll type (multiple choice, ranked choice, rating, etc.), 4) Click Create to get your shareable link. No signup or email required. Your poll is instantly live and ready to share via link, QR code, or embed."
            }
        },
        {
            "@type": "Question",
            "name": "What is the best free poll maker?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The best free poll maker depends on your needs. VoteGenerator offers the most poll types (9 including ranked choice, image polls, and meeting schedulers) with no signup required. Google Forms is good for basic polls within Google Workspace. Strawpoll is simple but limited. For surveys with multiple questions, VoteGenerator's survey builder supports up to 50 questions on paid plans."
            }
        },
        {
            "@type": "Question",
            "name": "Can I create a poll without signing up?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. VoteGenerator lets you create unlimited polls without creating an account or providing an email address. Your poll is created instantly and you receive a private admin link to manage it. Voters also don't need accounts - they simply click your poll link and vote immediately."
            }
        },
        {
            "@type": "Question",
            "name": "How do I share my poll?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "After creating your poll, you can share it multiple ways: 1) Copy the direct link to share via email, text, or social media, 2) Download a QR code to print on materials, 3) Use social share buttons for Twitter/X, Facebook, WhatsApp, LinkedIn, 4) Copy embed code to add the poll to your website or blog."
            }
        },
        {
            "@type": "Question",
            "name": "Are online polls anonymous?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "It depends on settings. VoteGenerator polls are anonymous by default - no names or emails are collected. You can optionally require voter names for accountability. Business plan users can enable fully anonymous mode that hides IP addresses and device details too. The poll creator chooses the level of anonymity."
            }
        }
    ]
};

const HowToCreatePollPage: React.FC = () => {
    const navigate = useNavigate();
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
        document.title = "How to Create a Poll Online Free | No Signup Required";
    }, []);

    const features = [
        { icon: Clock, title: "60 Seconds", desc: "Create and share in under a minute" },
        { icon: Users, title: "No Signup", desc: "No account or email needed" },
        { icon: Lock, title: "Vote Protection", desc: "Prevent duplicate votes" },
        { icon: Smartphone, title: "Mobile Ready", desc: "Works on any device" },
        { icon: BarChart3, title: "Real-Time Results", desc: "Watch votes come in live" },
        { icon: Share2, title: "Easy Sharing", desc: "Link, QR code, or embed" }
    ];

    const pollTypes = [
        { name: "Multiple Choice", desc: "Classic single or multi-select voting", popular: true },
        { name: "Ranked Choice", desc: "Drag and drop to rank preferences" },
        { name: "Rating Scale", desc: "1-5 stars, hearts, or emojis" },
        { name: "Image Poll", desc: "Vote on photos or designs" },
        { name: "Meeting Scheduler", desc: "Find times that work for everyone" },
        { name: "Dot Voting", desc: "Distribute points across options" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Schema */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_SCHEMA) }}
            />
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
            />

            {/* Navigation */}
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}

            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            How to Create a<br />Free Online Poll
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                            Create polls in 60 seconds. No signup, no email, no credit card. 
                            Share via link, QR code, or embed on your website.
                        </p>
                        <button
                            onClick={() => navigate('/create')}
                            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
                        >
                            Create Your Poll Now
                            <ArrowRight size={20} />
                        </button>
                        <p className="text-blue-200 text-sm mt-4">
                            ✓ Free forever  ✓ No account needed  ✓ Unlimited polls
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Answer */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-blue-600" />
                            Quick Answer: How to Create a Poll
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            To create a free online poll: <strong>1)</strong> Go to VoteGenerator.com, 
                            <strong> 2)</strong> Type your question and add answer options, 
                            <strong> 3)</strong> Select a poll type (multiple choice, ranked, rating, etc.), 
                            <strong> 4)</strong> Click "Create Poll" to get your shareable link. 
                            No signup required. Takes under 60 seconds. Share via link, QR code, email, or embed on your website.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-12">
                        Why Use VoteGenerator?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {features.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={24} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Step by Step */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-12">
                        5 Easy Steps to Create Your Poll
                    </h2>
                    <div className="space-y-6">
                        {[
                            { step: 1, title: "Enter Your Question", desc: "Type your poll question in the title field. Example: 'Where should we have our team lunch?' Add an optional description for more context." },
                            { step: 2, title: "Add Answer Options", desc: "Enter at least 2 answer options. Click 'Add Option' for more choices - you can add up to 20 options per poll." },
                            { step: 3, title: "Choose Poll Type", desc: "Select from Multiple Choice, Ranked Choice, Rating Scale, Image Poll, Meeting Scheduler, and more. Each type is optimized for different use cases." },
                            { step: 4, title: "Configure Settings (Optional)", desc: "Enable vote protection to prevent duplicate votes, require voter names, allow comments, set a deadline, or pick a visual theme." },
                            { step: 5, title: "Create & Share", desc: "Click 'Create Poll' and you're done! Copy your shareable link, download a QR code, share on social media, or embed on your website." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                            >
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/create')}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                        >
                            Start Creating Your Poll
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Poll Types */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-4">
                        9 Poll Types to Choose From
                    </h2>
                    <p className="text-slate-600 text-center mb-12">
                        Each poll type is optimized for different use cases. All are free.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {pollTypes.map((type, i) => (
                            <div 
                                key={i}
                                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-300 transition-colors"
                            >
                                <CheckCircle2 size={24} className="text-blue-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800">{type.name}</span>
                                        {type.popular && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600">{type.desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-8">
                        VoteGenerator vs Other Poll Makers
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left font-bold text-slate-700">Feature</th>
                                    <th className="p-4 text-center font-bold text-blue-600">VoteGenerator</th>
                                    <th className="p-4 text-center font-bold text-slate-500">Others</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ["No signup required", "✅", "❌ Most require"],
                                    ["Poll types", "9 types", "1-3 types"],
                                    ["Ranked choice voting", "✅ Built-in", "❌ Rare"],
                                    ["Real-time results", "✅", "⚠️ Sometimes"],
                                    ["Mobile optimized", "✅", "⚠️ Varies"],
                                    ["Embed on website", "✅ Free", "💰 Usually paid"],
                                    ["QR code sharing", "✅ Free", "💰 Usually paid"]
                                ].map(([feature, vg, others], i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-700">{feature}</td>
                                        <td className="p-4 text-center">{vg}</td>
                                        <td className="p-4 text-center">{others}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Ready to Create Your Poll?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Free forever. No signup. Takes 60 seconds.
                    </p>
                    <button
                        onClick={() => navigate('/create')}
                        className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg"
                    >
                        Create Free Poll Now
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowToCreatePollPage;
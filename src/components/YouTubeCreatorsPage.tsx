// ============================================================================
// YouTubeCreatorsPage - Landing page for YouTube content creators
// Route: /youtube-polls or /creators
// 
// Based on SimilarWeb data showing 59.54% of Strawpoll's social traffic
// comes from YouTube. Target: creators who share polls in video descriptions,
// pinned comments, and community posts.
//
// KEY INSIGHTS FROM RESEARCH:
// - YouTube native polls require 500+ subscribers (barrier for small creators)
// - Native polls can't be shared in video descriptions or pinned comments
// - Creators use polls for: content ideas, upload schedules, audience engagement
// - External polls can be shared across platforms (Discord, Twitter, etc.)
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Users, BarChart3, Share2, MessageCircle, Clock, Zap, Lock,
    CheckCircle2, ArrowRight, Sparkles, Youtube, Link, Globe, QrCode,
    TrendingUp, ThumbsUp, Bell, Video, Layers, Target, ChevronRight,
    Eye, Calendar, Smartphone, Award, Heart, Star, ExternalLink
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC = () => {
    const [demoVotes, setDemoVotes] = useState([847, 623, 412]);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const options = [
        { text: 'Tutorial on advanced editing', emoji: '🎬' },
        { text: 'Behind the scenes vlog', emoji: '📹' },
        { text: 'Q&A with subscribers', emoji: '💬' },
    ];

    const handleVote = (index: number) => {
        if (hasVoted) return;
        setSelectedOption(index);
        const newVotes = [...demoVotes];
        newVotes[index] += 1;
        setDemoVotes(newVotes);
        setHasVoted(true);
    };

    const totalVotes = demoVotes.reduce((sum, v) => sum + v, 0);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-rose-800">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-20 right-20 opacity-10">
                    <Play size={400} strokeWidth={0.5} />
                </div>
            </div>

            <NavHeader />

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-red-100 text-sm font-medium mb-6">
                            <Youtube size={16} />
                            <span>For YouTube Creators</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                            Let your audience<br />
                            <span className="text-amber-300">decide</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-red-100 mb-8 max-w-lg mx-auto lg:mx-0">
                            Create polls your subscribers can vote on anywhere — video descriptions, 
                            pinned comments, Discord, Twitter. No 500 subscriber requirement.
                        </p>

                        {/* Key benefits */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                            {[
                                { icon: Zap, text: 'Create in 30 seconds' },
                                { icon: Link, text: 'Share anywhere' },
                                { icon: Lock, text: 'No login to vote' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                    <item.icon size={16} className="text-amber-300" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-red-50 transition shadow-xl shadow-black/20"
                            >
                                Create Your First Poll
                                <ArrowRight size={20} />
                            </a>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition"
                            >
                                See How It Works
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Demo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto">
                            {/* Poll Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                                    <Play size={18} className="text-white ml-0.5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">@YourChannel</p>
                                    <p className="text-xs text-slate-500">Posted in video description</p>
                                </div>
                            </div>

                            {/* Question */}
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                What video should I make next? 🎥
                            </h3>

                            {/* Options */}
                            <div className="space-y-3 mb-4">
                                {options.map((option, index) => {
                                    const percentage = Math.round((demoVotes[index] / totalVotes) * 100);
                                    const isSelected = selectedOption === index;
                                    const isWinning = demoVotes[index] === Math.max(...demoVotes);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleVote(index)}
                                            disabled={hasVoted}
                                            className={`
                                                relative w-full text-left p-4 rounded-xl border-2 transition-all overflow-hidden
                                                ${hasVoted
                                                    ? isSelected
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-slate-200 bg-slate-50'
                                                    : 'border-slate-200 hover:border-red-300 cursor-pointer'
                                                }
                                            `}
                                        >
                                            {/* Progress bar */}
                                            {hasVoted && (
                                                <div
                                                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${isWinning ? 'bg-red-100' : 'bg-slate-100'}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            )}

                                            <div className="relative flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <span>{option.emoji}</span>
                                                    <span className={`font-medium ${hasVoted && isWinning ? 'text-red-700' : 'text-slate-700'}`}>
                                                        {option.text}
                                                    </span>
                                                </span>
                                                {hasVoted && (
                                                    <span className={`font-bold ${isWinning ? 'text-red-600' : 'text-slate-500'}`}>
                                                        {percentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    {totalVotes.toLocaleString()} votes
                                </span>
                                <span className="flex items-center gap-1">
                                    <BarChart3 size={14} />
                                    Live results
                                </span>
                            </div>

                            {hasVoted && (
                                <p className="text-center text-sm text-green-600 mt-3 font-medium">
                                    ✓ Thanks for voting!
                                </p>
                            )}
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">No login needed</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// PROBLEM SECTION - Why not YouTube's native polls?
// ============================================================================

const ProblemSection: React.FC = () => {
    const problems = [
        {
            icon: Users,
            problem: "Need 500+ subscribers",
            detail: "YouTube requires 500 subscribers before you can access Community polls",
        },
        {
            icon: Link,
            problem: "Can't share in descriptions",
            detail: "Native polls only work in the Community tab — not in video descriptions or comments",
        },
        {
            icon: Globe,
            problem: "Stuck on YouTube only",
            detail: "Can't share the same poll on Discord, Twitter, or your website",
        },
        {
            icon: Eye,
            problem: "Limited visibility",
            detail: "Community posts often get buried — many subscribers never see them",
        },
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full mb-4">
                        The Problem
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        YouTube's native polls have limits
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Great for some things, but frustrating when you want to reach your whole audience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                                <item.icon className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{item.problem}</h3>
                            <p className="text-sm text-slate-600">{item.detail}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// SOLUTION SECTION - How VoteGenerator helps
// ============================================================================

const SolutionSection: React.FC = () => {
    const solutions = [
        {
            icon: Zap,
            title: "No subscriber requirement",
            description: "Create polls from day one. Perfect for new creators building their audience.",
            color: "bg-amber-100 text-amber-600",
        },
        {
            icon: Link,
            title: "Share anywhere",
            description: "Video descriptions, pinned comments, Discord, Twitter, Instagram bio — one link works everywhere.",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Lock,
            title: "No login to vote",
            description: "Subscribers just click and vote. No friction means more participation.",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: BarChart3,
            title: "Real-time results",
            description: "Watch votes come in live. Perfect for livestreams and premieres.",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: QrCode,
            title: "QR codes for streams",
            description: "Display a QR code on screen so viewers can vote from their phones during live content.",
            color: "bg-rose-100 text-rose-600",
        },
        {
            icon: Smartphone,
            title: "Mobile-first design",
            description: "70% of YouTube traffic is mobile. Our polls look perfect on any device.",
            color: "bg-cyan-100 text-cyan-600",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-4">
                        The Solution
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        VoteGenerator works the way you need it to
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Built for creators who want to engage their audience everywhere, not just in the Community tab.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition"
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// USE CASES - What YouTubers actually poll about (based on research)
// ============================================================================

const UseCasesSection: React.FC = () => {
    const useCases = [
        {
            emoji: "🎬",
            title: "What video should I make next?",
            description: "Let subscribers vote on your content calendar. Higher engagement when you deliver what they asked for.",
            example: "Tutorial vs Behind-the-scenes vs Collab video",
        },
        {
            emoji: "📅",
            title: "When should I upload?",
            description: "Find out when your audience is actually available to watch. Better timing = more views.",
            example: "Weekday mornings vs Weekday evenings vs Weekends",
        },
        {
            emoji: "🎮",
            title: "Which game should I play?",
            description: "Perfect for gaming channels. Viewers pick your next playthrough.",
            example: "Elden Ring vs Zelda vs Minecraft challenge",
        },
        {
            emoji: "🎨",
            title: "Choose my thumbnail",
            description: "A/B test thumbnails with your audience before publishing. Data-driven decisions.",
            example: "Option A vs Option B vs Option C",
        },
        {
            emoji: "💬",
            title: "Q&A topic selection",
            description: "Let fans vote on what questions you answer in your next Q&A video.",
            example: "Career advice vs Personal life vs Creator tips",
        },
        {
            emoji: "🏆",
            title: "Community challenges",
            description: "Run fun polls during streams. 'Should I attempt this challenge?' builds excitement.",
            example: "Easy mode vs Hard mode vs Impossible mode",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full mb-4">
                        Use Cases
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        What creators poll their audience about
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Polls that drive engagement, inform your content strategy, and make subscribers feel heard.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-red-200 hover:shadow-lg transition"
                        >
                            <div className="text-4xl mb-4">{item.emoji}</div>
                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                            <div className="bg-slate-50 rounded-lg px-3 py-2">
                                <p className="text-xs text-slate-500 font-medium">Example options:</p>
                                <p className="text-sm text-slate-700">{item.example}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// HOW TO SHARE - Where to put your poll link
// ============================================================================

const ShareLocationsSection: React.FC = () => {
    const locations = [
        {
            icon: Video,
            title: "Video Description",
            description: "Add your poll link at the top of your description. Viewers who want to participate will find it easily.",
            tip: "Mention the poll in your video: 'Link in description to vote!'",
        },
        {
            icon: MessageCircle,
            title: "Pinned Comment",
            description: "Pin a comment with your poll link. Great for videos already published.",
            tip: "Heart replies to voters to encourage more participation",
        },
        {
            icon: Bell,
            title: "Community Post",
            description: "Share alongside YouTube's native features for maximum reach.",
            tip: "Works even if you have Community tab access",
        },
        {
            icon: Globe,
            title: "Discord Server",
            description: "Share the same poll with your Discord community. One poll, multiple platforms.",
            tip: "Create a #polls channel for all your audience votes",
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
                        Share Everywhere
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        One link. Maximum reach.
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Unlike YouTube's native polls, your VoteGenerator link works anywhere you can share a URL.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {locations.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 mb-3">{item.description}</p>
                                    <div className="flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2">
                                        <Sparkles size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-amber-800">{item.tip}</p>
                                    </div>
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
// TEMPLATES SECTION
// ============================================================================

const TemplatesSection: React.FC = () => {
    // Template IDs must match those in pollTemplates.tsx
    const templates = [
        { id: "youtube-video-ideas", name: "Video Ideas Poll", icon: "🎬", category: "Content Planning" },
        { id: "youtube-upload-schedule", name: "Upload Schedule Vote", icon: "📅", category: "Scheduling" },
        { id: "youtube-thumbnail-test", name: "Thumbnail A/B Test", icon: "🎨", category: "Optimization" },
        { id: "youtube-series-vote", name: "Series Topic Vote", icon: "📺", category: "Content Planning" },
        { id: "twitch-game-choice", name: "Game Choice Vote", icon: "🎮", category: "Gaming" },
        { id: "twitch-challenge-vote", name: "Challenge Vote", icon: "🏆", category: "Engagement" },
        { id: "content-feedback", name: "Content Feedback", icon: "💬", category: "Feedback" },
        { id: "quick-pulse", name: "Quick Audience Pulse", icon: "📊", category: "Engagement" },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-red-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full mb-4">
                        Quick Start
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Templates made for creators
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Start with a template, customize the options, share in 30 seconds.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {templates.map((template, index) => (
                        <motion.a
                            key={index}
                            href={`/create?template=${template.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-4 border-2 border-slate-100 hover:border-red-300 hover:shadow-lg transition text-center group"
                        >
                            <div className="text-3xl mb-2">{template.icon}</div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-red-600 transition">
                                {template.name}
                            </h3>
                            <p className="text-xs text-slate-500">{template.category}</p>
                        </motion.a>
                    ))}
                </div>

                <div className="text-center">
                    <a
                        href="/templates"
                        className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
                    >
                        Browse all templates
                        <ChevronRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FINAL CTA
// ============================================================================

const FinalCTASection: React.FC = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-red-100 text-sm font-medium mb-6">
                    <Sparkles size={16} />
                    Free to use
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
                    Ready to let your audience decide?
                </h2>

                <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                    Create your first poll in 30 seconds. No signup, no credit card, no subscriber minimum.
                </p>

                <a
                    href="/create"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-red-50 transition shadow-xl"
                >
                    Create Your First Poll
                    <ArrowRight size={20} />
                </a>

                <p className="text-red-200 text-sm mt-6">
                    Join thousands of creators who engage their audience with polls
                </p>
            </div>
        </section>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const YouTubeCreatorsPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <UseCasesSection />
            <ShareLocationsSection />
            <TemplatesSection />
            <FinalCTASection />
            <Footer />
        </div>
    );
};

export default YouTubeCreatorsPage;
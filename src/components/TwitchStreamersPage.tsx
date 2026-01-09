// ============================================================================
// TwitchStreamersPage - Landing page for Twitch streamers
// Route: /twitch-polls or /streamers
// 
// Based on SimilarWeb data showing Twitch.tv is 38.34% of Strawpoll's 
// referral traffic (the #1 referrer!). Target: streamers who need polls
// before reaching Affiliate status, or want more features than native polls.
//
// KEY INSIGHTS FROM RESEARCH:
// - Twitch native polls require Affiliate/Partner status
// - To reach Affiliate: 50 followers, 500 minutes broadcast, 7 unique days, 3 avg viewers
// - Streamers use polls for: game choices, in-game decisions, challenges, predictions
// - External polls can include images, work across platforms (Discord, Twitter)
// - Real-time results are critical for live content
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Users, BarChart3, Share2, MessageCircle, Clock, Zap, Lock,
    CheckCircle2, ArrowRight, Sparkles, Link, Globe, QrCode,
    TrendingUp, ThumbsUp, Bell, Video, Layers, Target, ChevronRight,
    Eye, Calendar, Smartphone, Award, Heart, Star, ExternalLink,
    Gamepad2, Trophy, Swords, Timer, Tv, Radio, Wifi
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// Twitch icon component
const TwitchIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
    </svg>
);

// ============================================================================
// HERO SECTION - Purple Twitch theme
// ============================================================================

const HeroSection: React.FC = () => {
    const [demoVotes, setDemoVotes] = useState([156, 89, 67]);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [liveViewers, setLiveViewers] = useState(1247);

    // Simulate live viewer count
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const options = [
        { text: 'Elden Ring - New playthrough', emoji: '⚔️' },
        { text: 'Minecraft Hardcore', emoji: '⛏️' },
        { text: 'Viewer\'s choice from chat', emoji: '💬' },
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
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full opacity-20 blur-3xl" />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-purple-200 text-sm font-medium mb-6">
                            <TwitchIcon size={16} />
                            <span>For Twitch Streamers</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                            Let chat<br />
                            <span className="text-purple-300">decide</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-purple-200 mb-8 max-w-lg mx-auto lg:mx-0">
                            Create polls your viewers can vote on — no Affiliate status required. 
                            Share in chat, get instant results on stream.
                        </p>

                        {/* Key benefits */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                            {[
                                { icon: Zap, text: 'No Affiliate needed' },
                                { icon: BarChart3, text: 'Real-time results' },
                                { icon: Smartphone, text: 'Mobile voting' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                    <item.icon size={16} className="text-purple-300" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="/create"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-xl hover:bg-purple-50 transition shadow-xl shadow-black/20"
                            >
                                Create Stream Poll
                                <ArrowRight size={20} />
                            </a>
                            <a
                                href="#use-cases"
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition"
                            >
                                See Examples
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Demo - Stream style */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-[#18181b] rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto border border-purple-500/30">
                            {/* Stream header */}
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Gamepad2 size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">YourChannel</p>
                                        <p className="text-purple-200 text-xs">Playing: Viewer's Choice</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="text-white text-xs font-bold">LIVE</span>
                                </div>
                            </div>

                            {/* Poll content */}
                            <div className="p-5">
                                {/* Live viewers */}
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                                    <Eye size={14} />
                                    <span>{liveViewers.toLocaleString()} watching</span>
                                </div>

                                {/* Question */}
                                <h3 className="text-lg font-bold text-white mb-4">
                                    What game should I play next? 🎮
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
                                                            ? 'border-purple-500 bg-purple-500/20'
                                                            : 'border-gray-700 bg-gray-800/50'
                                                        : 'border-gray-700 hover:border-purple-500 cursor-pointer bg-gray-800/50'
                                                    }
                                                `}
                                            >
                                                {/* Progress bar */}
                                                {hasVoted && (
                                                    <div
                                                        className={`absolute inset-y-0 left-0 transition-all duration-500 ${isWinning ? 'bg-purple-500/30' : 'bg-gray-700/50'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                )}

                                                <div className="relative flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <span>{option.emoji}</span>
                                                        <span className={`font-medium ${hasVoted && isWinning ? 'text-purple-300' : 'text-gray-200'}`}>
                                                            {option.text}
                                                        </span>
                                                    </span>
                                                    {hasVoted && (
                                                        <span className={`font-bold ${isWinning ? 'text-purple-400' : 'text-gray-500'}`}>
                                                            {percentage}%
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {totalVotes} votes
                                    </span>
                                    <span className="flex items-center gap-1 text-green-500">
                                        <Wifi size={14} />
                                        Live updating
                                    </span>
                                </div>

                                {hasVoted && (
                                    <p className="text-center text-sm text-purple-400 mt-3 font-medium">
                                        ✓ Vote counted!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Floating chat preview */}
                        <div className="absolute -bottom-4 -right-4 bg-[#18181b] rounded-xl shadow-lg px-4 py-3 border border-gray-700 max-w-[200px]">
                            <p className="text-xs text-gray-400 mb-2">Chat</p>
                            <div className="space-y-1 text-xs">
                                <p><span className="text-purple-400 font-medium">viewer123:</span> <span className="text-gray-300">voted!</span></p>
                                <p><span className="text-green-400 font-medium">gamer_pro:</span> <span className="text-gray-300">Elden Ring!</span></p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// PROBLEM SECTION - Why not Twitch's native polls?
// ============================================================================

const ProblemSection: React.FC = () => {
    const requirements = [
        { label: "50 followers", icon: Users },
        { label: "500 min broadcast", icon: Clock },
        { label: "7 unique days", icon: Calendar },
        { label: "3 avg viewers", icon: Eye },
    ];

    const problems = [
        {
            icon: Trophy,
            problem: "Need Affiliate status first",
            detail: "Twitch requires you to hit specific milestones before unlocking native polls",
        },
        {
            icon: Timer,
            problem: "Polls expire quickly",
            detail: "Native polls have a max duration of 10 minutes — not great for longer decisions",
        },
        {
            icon: Layers,
            problem: "Limited to 5 options",
            detail: "Can only offer up to 5 choices per poll",
        },
        {
            icon: Globe,
            problem: "Only works on Twitch",
            detail: "Can't share the same poll on Discord, Twitter, or your website",
        },
    ];

    return (
        <section className="py-16 bg-[#0e0e10]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full mb-4">
                        The Problem
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Twitch polls have requirements
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                        To use native Twitch polls, you need to reach Affiliate status first:
                    </p>

                    {/* Affiliate requirements */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                                <req.icon size={16} className="text-purple-400" />
                                <span className="text-gray-300 text-sm font-medium">{req.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                <item.icon className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-white mb-2">{item.problem}</h3>
                            <p className="text-sm text-gray-500">{item.detail}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// SOLUTION SECTION - How VoteGenerator helps streamers
// ============================================================================

const SolutionSection: React.FC = () => {
    const solutions = [
        {
            icon: Zap,
            title: "No Affiliate required",
            description: "Start using polls from your very first stream. Build engagement while you grow.",
            color: "bg-green-500/20 text-green-400",
        },
        {
            icon: Link,
            title: "Drop link in chat",
            description: "Share a simple link. Viewers click, vote, done. No complicated setup.",
            color: "bg-blue-500/20 text-blue-400",
        },
        {
            icon: Lock,
            title: "No login to vote",
            description: "Viewers don't need accounts. More votes, less friction.",
            color: "bg-amber-500/20 text-amber-400",
        },
        {
            icon: BarChart3,
            title: "Real-time results",
            description: "Watch votes update live. Perfect for reacting on stream.",
            color: "bg-purple-500/20 text-purple-400",
        },
        {
            icon: QrCode,
            title: "QR code for screen",
            description: "Display a QR code on your overlay. Viewers scan and vote from their phones.",
            color: "bg-pink-500/20 text-pink-400",
        },
        {
            icon: Globe,
            title: "Works everywhere",
            description: "Same poll link works on Discord, Twitter, YouTube — grow across platforms.",
            color: "bg-cyan-500/20 text-cyan-400",
        },
    ];

    return (
        <section className="py-20 bg-[#18181b]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm font-bold rounded-full mb-4">
                        The Solution
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Polls that work from day one
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        No requirements. No restrictions. Just engagement with your community.
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
                            className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition"
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// USE CASES - What streamers actually poll about (based on research)
// ============================================================================

const UseCasesSection: React.FC = () => {
    const useCases = [
        {
            emoji: "🎮",
            title: "What game should I play?",
            description: "Let viewers pick your next game. Higher engagement when chat controls the content.",
            example: "Elden Ring vs Minecraft vs Viewer's Choice",
        },
        {
            emoji: "⚔️",
            title: "In-game decisions",
            description: "Which weapon? Which path? Let chat co-pilot your playthrough.",
            example: "Sword vs Bow vs Magic build",
        },
        {
            emoji: "🏆",
            title: "Challenge votes",
            description: "'Should I attempt this?' builds hype. Chat loves having power.",
            example: "Easy mode vs Hard mode vs Nightmare",
        },
        {
            emoji: "🎯",
            title: "Predictions",
            description: "'Will I beat this boss?' Get viewers invested in your success (or failure).",
            example: "First try vs Under 5 attempts vs Never",
        },
        {
            emoji: "📅",
            title: "Stream schedule",
            description: "Find out when your community actually wants to watch.",
            example: "Weekday evenings vs Weekend afternoons vs Late night",
        },
        {
            emoji: "🍕",
            title: "Fun & chaos",
            description: "Silly polls keep the vibe light. 'What should I eat on stream?'",
            example: "Pizza vs Ramen vs Whatever chat picks",
        },
    ];

    return (
        <section id="use-cases" className="py-20 bg-[#0e0e10]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full mb-4">
                        Use Cases
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        What streamers poll their chat about
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Turn passive viewers into active participants. Chat-driven content = better engagement.
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
                            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition group"
                        >
                            <div className="text-4xl mb-4">{item.emoji}</div>
                            <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                            <div className="bg-gray-800 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-500 font-medium">Example:</p>
                                <p className="text-sm text-gray-300">{item.example}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// HOW TO USE - Simple steps
// ============================================================================

const HowToUseSection: React.FC = () => {
    const steps = [
        {
            number: "1",
            title: "Create your poll",
            description: "Add your question and options. Takes 30 seconds.",
            icon: Sparkles,
        },
        {
            number: "2",
            title: "Copy the link",
            description: "Get a short, shareable link to your poll.",
            icon: Link,
        },
        {
            number: "3",
            title: "Drop it in chat",
            description: "Share the link with your viewers. Or display a QR code on screen.",
            icon: MessageCircle,
        },
        {
            number: "4",
            title: "React to results",
            description: "Watch votes come in live. Build the hype!",
            icon: BarChart3,
        },
    ];

    return (
        <section className="py-20 bg-[#18181b]">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-full mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Live in 30 seconds
                    </h2>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500" />

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="text-center relative"
                            >
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 border-4 border-[#18181b]">
                                    <step.icon size={20} className="text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
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
        { id: "twitch-game-choice", name: "Stream Game Vote", icon: "🎮", category: "Gaming" },
        { id: "twitch-challenge-vote", name: "Challenge Vote", icon: "🏆", category: "Interactive" },
        { id: "twitch-prediction", name: "Boss Prediction", icon: "⚔️", category: "Gaming" },
        { id: "twitch-stream-schedule", name: "Stream Schedule", icon: "📅", category: "Planning" },
        { id: "team-lunch", name: "Food Choice", icon: "🍕", category: "Fun" },
        { id: "would-you-rather", name: "Would You Rather", icon: "🤔", category: "Fun" },
        { id: "bracket-challenge", name: "Bracket Vote", icon: "🏅", category: "Gaming" },
        { id: "quick-pulse", name: "Vibe Check", icon: "💜", category: "Engagement" },
    ];

    return (
        <section className="py-20 bg-[#0e0e10]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full mb-4">
                        Quick Start
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Templates for streamers
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Pick a template, customize it, go live. Simple.
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
                            className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-purple-500 hover:bg-gray-800 transition text-center group"
                        >
                            <div className="text-3xl mb-2">{template.icon}</div>
                            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition">
                                {template.name}
                            </h3>
                            <p className="text-xs text-gray-500">{template.category}</p>
                        </motion.a>
                    ))}
                </div>

                <div className="text-center">
                    <a
                        href="/templates"
                        className="inline-flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300"
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
        <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-purple-200 text-sm font-medium mb-6">
                    <Sparkles size={16} />
                    Free to use
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
                    Ready to let chat decide?
                </h2>

                <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                    Create your first poll in 30 seconds. No signup, no Affiliate status, no restrictions.
                </p>

                <a
                    href="/create"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-xl hover:bg-purple-50 transition shadow-xl"
                >
                    Create Stream Poll
                    <ArrowRight size={20} />
                </a>

                <p className="text-purple-300 text-sm mt-6">
                    Join thousands of streamers engaging their communities
                </p>
            </div>
        </section>
    );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

const TwitchStreamersPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0e0e10]">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <UseCasesSection />
            <HowToUseSection />
            <TemplatesSection />
            <FinalCTASection />
            <Footer />
        </div>
    );
};

export default TwitchStreamersPage;
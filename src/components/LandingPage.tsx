// ============================================================================
// LandingPage - VoteGenerator Home Page
// OPTIMIZED: Based on 2025 SaaS conversion research
// Key principles: Simple language (5th-7th grade level), single CTA, 
// mobile-first, privacy as differentiator, problem-solution framework
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, Mail, Lock, Eye, CheckCircle2, ArrowRight, Sparkles, Star,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal, Users, Image,
    Zap, Crown, Globe, QrCode, BarChart3, Code, Check, X, Clock, Building2,
    GraduationCap, Heart, Briefcase, PartyPopper, Play, Shield, Rocket,
    Award, TrendingUp, MessageCircle, Timer, ChevronRight, Smartphone, Laptop,
    AlertTriangle, ThumbsUp, ThumbsDown, HelpCircle, FileText, Download, Palette,
    MousePointer, Share2, Link, ExternalLink, Vote, CircleCheck, Layers
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import VoteGeneratorCreate from './VoteGeneratorCreate';

// ============================================================================
// Hero Section - Immediate value, single CTA, interactive demo
// Research: 48% exit without interaction - need instant engagement
// ============================================================================

const HeroSection: React.FC = () => {
    const [demoVotes, setDemoVotes] = useState([42, 38, 28, 15]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    const demoOptions = [
        { text: 'Hawaiian Paradise', emoji: '🏝️' },
        { text: 'Mountain Lodge', emoji: '🏔️' },
        { text: 'Beach Resort', emoji: '🏖️' },
        { text: 'City Adventure', emoji: '🌆' },
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
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Copy */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center lg:text-left"
                    >
                        {/* Trust badge - small, credible */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm mb-6">
                            <Lock size={14} />
                            <span>No signup required to create or vote</span>
                        </div>

                        {/* Main headline - simple, benefit-focused */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                            Create polls in<br />
                            <span className="text-amber-300">30 seconds</span>
                        </h1>

                        {/* Subheadline - what + why */}
                        <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg mx-auto lg:mx-0">
                            The fastest way to gather opinions. Share a link, get instant votes. 
                            Works on any device.
                        </p>

                        {/* Key benefits - scannable */}
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                            {[
                                { icon: Zap, text: 'Create in 30 seconds' },
                                { icon: Lock, text: 'No account needed' },
                                { icon: Smartphone, text: 'Works on any device' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                    <item.icon size={16} className="text-amber-300" />
                                    {item.text}
                                </div>
                            ))}
                        </div>

                        {/* Single primary CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <a 
                                href="#create" 
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-xl shadow-indigo-900/20"
                            >
                                <Sparkles size={20} /> 
                                Create Free Poll 
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a 
                                href="/demo" 
                                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/20"
                            >
                                <Play size={18} /> See all 8 poll types
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Demo Poll */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.02] transition-transform duration-500">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-xs font-medium text-emerald-600">Live Demo</span>
                                </div>
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                    {totalVotes} votes
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                🗳️ Where should we host the team retreat?
                            </h3>
                            
                            <div className="space-y-2.5">
                                {demoOptions.map((opt, i) => {
                                    const pct = Math.round((demoVotes[i] / totalVotes) * 100);
                                    const isSelected = selectedOption === i;
                                    const isWinner = demoVotes[i] === Math.max(...demoVotes);
                                    
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleVote(i)}
                                            disabled={hasVoted}
                                            className={`relative w-full p-3 rounded-xl border-2 text-left transition-all ${
                                                isSelected 
                                                    ? 'border-indigo-500 bg-indigo-50' 
                                                    : hasVoted
                                                        ? 'border-slate-100 bg-slate-50'
                                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer'
                                            }`}
                                        >
                                            {/* Progress bar */}
                                            <motion.div 
                                                className={`absolute inset-0 rounded-xl ${isSelected ? 'bg-indigo-200' : 'bg-slate-100'}`}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: hasVoted ? pct / 100 : 0 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                style={{ transformOrigin: 'left', opacity: 0.5 }}
                                            />
                                            
                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{opt.emoji}</span>
                                                    <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                        {opt.text}
                                                    </span>
                                                    {isWinner && hasVoted && (
                                                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                                                            Leading
                                                        </span>
                                                    )}
                                                </div>
                                                {hasVoted && (
                                                    <span className={`text-sm font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                        {pct}%
                                                    </span>
                                                )}
                                                {isSelected && (
                                                    <CheckCircle2 className="absolute -right-1 -top-1 text-indigo-600 bg-white rounded-full" size={20} />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {hasVoted ? (
                                <p className="text-center text-emerald-600 text-sm font-medium mt-4 flex items-center justify-center gap-2">
                                    <CheckCircle2 size={16} /> Vote recorded! Results update in real-time.
                                </p>
                            ) : (
                                <p className="text-center text-slate-400 text-sm mt-4">
                                    👆 Click an option to vote (try it!)
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Trust Bar - For new company without logos, use feature/security signals
// ============================================================================

const TrustBar: React.FC = () => (
    <div className="bg-slate-900 py-4 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
                {[
                    { icon: Lock, text: 'No Signup Required', color: 'text-emerald-400' },
                    { icon: Mail, text: 'No Email to Vote', color: 'text-blue-400' },
                    { icon: Layers, text: '8 Poll Types', color: 'text-purple-400' },
                    { icon: Globe, text: 'Works on Any Device', color: 'text-amber-400' },
                    { icon: Zap, text: 'Real-time Results', color: 'text-pink-400' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-400">
                        <item.icon size={16} className={item.color} />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ============================================================================
// Problem Section - Show pain points of existing tools
// Research: Problem-agitation-solution framework converts better
// ============================================================================

const ProblemSection: React.FC = () => (
    <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full mb-4">
                    Sound familiar?
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Polling tools shouldn't be this hard
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                    {
                        icon: AlertTriangle,
                        problem: '"Sign up to create a poll"',
                        pain: 'You just want a quick poll. Not another account to manage.',
                        color: 'red'
                    },
                    {
                        icon: Mail,
                        problem: '"Enter your email to vote"',
                        pain: 'Your team shouldn\'t need to give up their email to share an opinion.',
                        color: 'orange'
                    },
                    {
                        icon: Clock,
                        problem: '"Your free trial expired"',
                        pain: 'Why pay monthly for something you use a few times a year?',
                        color: 'amber'
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
                    >
                        <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                            <item.icon className={`text-${item.color}-600`} size={24} />
                        </div>
                        <p className="font-bold text-slate-800 mb-2">{item.problem}</p>
                        <p className="text-slate-500 text-sm">{item.pain}</p>
                    </motion.div>
                ))}
            </div>

            {/* Solution intro */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white"
            >
                <h3 className="text-2xl font-bold mb-3">
                    We built VoteGenerator differently.
                </h3>
                <p className="text-indigo-100 max-w-2xl mx-auto">
                    No accounts. No emails. No subscriptions. Just polls that work instantly, 
                    on any device, with complete privacy for everyone.
                </p>
            </motion.div>
        </div>
    </section>
);

// ============================================================================
// How It Works - Simple 3-step process
// ============================================================================

const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            num: '1',
            title: 'Create your poll',
            desc: 'Pick a type, add your options. Takes 30 seconds.',
            icon: MousePointer,
            color: 'indigo'
        },
        {
            num: '2',
            title: 'Share the link',
            desc: 'Copy the link or scan the QR code. Works on any device.',
            icon: Share2,
            color: 'purple'
        },
        {
            num: '3',
            title: 'Watch votes come in',
            desc: 'See results update in real-time. Export when done.',
            icon: BarChart3,
            color: 'emerald'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-slate-500">
                        Create a poll in less time than it takes to read this sentence.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="text-center"
                        >
                            <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative`}>
                                <step.icon className={`text-${step.color}-600`} size={28} />
                                <span className={`absolute -top-2 -right-2 w-7 h-7 bg-${step.color}-600 text-white text-sm font-bold rounded-full flex items-center justify-center`}>
                                    {step.num}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Connector line on desktop */}
                <div className="hidden md:block relative h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200 -mt-[140px] mx-20 mb-[100px]" />
            </div>
        </section>
    );
};

// ============================================================================
// Poll Types Section - Visual showcase
// ============================================================================

const PollTypesSection: React.FC = () => {
    const pollTypes = [
        { name: 'Multiple Choice', icon: CheckSquare, desc: 'Pick one or more options', gradient: 'from-blue-500 to-indigo-600', popular: true },
        { name: 'Ranked Choice', icon: ListOrdered, desc: 'Drag to rank by preference', gradient: 'from-indigo-500 to-purple-600' },
        { name: 'Meeting Poll', icon: Calendar, desc: 'Find the best time', gradient: 'from-amber-500 to-orange-600' },
        { name: 'This or That', icon: ArrowLeftRight, desc: 'Quick A vs B decisions', gradient: 'from-orange-500 to-red-600' },
        { name: 'Rating Scale', icon: SlidersHorizontal, desc: 'Rate each option 1-5', gradient: 'from-cyan-500 to-blue-600' },
        { name: 'RSVP', icon: Users, desc: 'Yes, No, or Maybe', gradient: 'from-sky-500 to-blue-600' },
        { name: 'Visual Poll', icon: Image, desc: 'Vote with images', gradient: 'from-pink-500 to-rose-600' },
        { name: 'Dot Voting', icon: CircleCheck, desc: 'Distribute points', gradient: 'from-emerald-500 to-teal-600' },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4">
                        8 poll types included
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        The right poll for every situation
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        From quick team votes to complex ranked decisions. All free to create.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pollTypes.map((type, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <type.icon className="text-white" size={22} />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-slate-900">{type.name}</h3>
                                {type.popular && (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                                        POPULAR
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500">{type.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a href="/demo" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
                        See all poll types in action <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Privacy Section - Key differentiator, detailed explanation
// ============================================================================

const PrivacySection: React.FC = () => (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Copy - focused on PROVEN creator benefits */}
                <div>
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full mb-4">
                        Remove friction, get more responses
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        No barriers between your<br />
                        <span className="text-emerald-400">audience and your poll.</span>
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Every extra step loses respondents. VoteGenerator removes the friction—
                        no accounts to create, no emails to enter, no passwords to remember. 
                        Just your poll and a submit button.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: MousePointer, title: 'One-click voting', desc: 'Voters click your link, vote, done. Nothing else required.' },
                            { icon: Smartphone, title: 'Works on any device', desc: 'Phone, tablet, laptop—no app downloads needed.' },
                            { icon: Users, title: 'Anonymous by default', desc: 'Voters can respond without sharing their identity.' },
                            { icon: Zap, title: 'Instant results', desc: 'See responses the moment they come in.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <item.icon className="text-emerald-400" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{item.title}</h4>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Before/After comparison */}
                <div className="space-y-4">
                    {/* The problem - friction */}
                    <div className="bg-red-950/50 border border-red-500/20 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-red-400" size={20} />
                            <span className="font-bold text-red-300">What kills response rates</span>
                        </div>
                        <ul className="space-y-2 text-red-200/80 text-sm">
                            <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> "Create an account to vote"</li>
                            <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> "Enter your email address"</li>
                            <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> "Download our app"</li>
                            <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> "Verify your email to continue"</li>
                        </ul>
                        <p className="text-red-300/60 text-xs mt-3 italic">
                            Each step = fewer people finish your poll
                        </p>
                    </div>

                    {/* The solution - frictionless */}
                    <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="text-emerald-400" size={20} />
                            <span className="font-bold text-emerald-300">VoteGenerator experience</span>
                        </div>
                        <ul className="space-y-2 text-emerald-200/80 text-sm">
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Click your link</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> See the poll</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Make a choice</li>
                            <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Done.</li>
                        </ul>
                        <p className="text-emerald-300/60 text-xs mt-3 italic">
                            Fewer steps = more completed responses
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ============================================================================
// Features Section - Key capabilities
// ============================================================================

const FeaturesSection: React.FC = () => {
    const features = [
        { icon: Zap, title: 'Instant setup', desc: 'Create a poll in under 30 seconds. No account needed.', color: 'amber' },
        { icon: Smartphone, title: 'Works on any device', desc: 'Responsive design. Voters can use phone, tablet, or computer.', color: 'blue' },
        { icon: QrCode, title: 'QR code sharing', desc: 'Generate QR codes for easy in-person polling.', color: 'purple' },
        { icon: BarChart3, title: 'Real-time results', desc: 'Watch votes come in live. Auto-updating charts.', color: 'emerald' },
        { icon: Code, title: 'Embed anywhere', desc: 'Add polls to your website with a simple embed code.', color: 'pink' },
        { icon: Download, title: 'Export data', desc: 'Download results as CSV, Excel, or PDF reports.', color: 'indigo' },
        { icon: Palette, title: 'Custom themes', desc: 'Match your brand with premium color themes.', color: 'rose' },
        { icon: Shield, title: 'Anti-fraud protection', desc: 'Block duplicate votes with IP and browser detection.', color: 'teal' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need. Nothing you don't.
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Powerful features that just work. No learning curve.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg border border-slate-100 hover:border-slate-200 transition-all"
                        >
                            <div className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                                <feature.icon className={`text-${feature.color}-600`} size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                            <p className="text-sm text-slate-500">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Use Cases Section
// ============================================================================

const UseCasesSection: React.FC = () => {
    const useCases = [
        { icon: Building2, title: 'Teams & Companies', desc: 'Run team decisions, feedback surveys, and meeting polls.', examples: ['Team lunches', 'Sprint planning', 'Employee feedback'] },
        { icon: GraduationCap, title: 'Education', desc: 'Engage students with live polls and quizzes.', examples: ['Class votes', 'Exit tickets', 'Research surveys'] },
        { icon: PartyPopper, title: 'Events & Parties', desc: 'Let guests vote on activities, food, and themes.', examples: ['Wedding RSVPs', 'Party planning', 'Event feedback'] },
        { icon: Heart, title: 'Friends & Family', desc: 'Make group decisions without the group chat chaos.', examples: ['Vacation planning', 'Gift ideas', 'Movie night'] },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Perfect for every group
                    </h2>
                    <p className="text-lg text-slate-500">
                        From Fortune 500 teams to friend groups planning dinner.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {useCases.map((useCase, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                                <useCase.icon className="text-indigo-600" size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{useCase.title}</h3>
                            <p className="text-sm text-slate-500 mb-4">{useCase.desc}</p>
                            <div className="flex flex-wrap gap-2">
                                {useCase.examples.map((ex, j) => (
                                    <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                        {ex}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Pricing Preview Section - Simple, links to full pricing page
// ============================================================================

const PricingPreviewSection: React.FC = () => (
    <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Simple, transparent pricing
                </h2>
                <p className="text-lg text-slate-500">
                    Start free. Upgrade only if you need more.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Free */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="text-slate-500" size={20} />
                        <span className="font-bold text-slate-900">Free</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">$0</div>
                    <p className="text-sm text-slate-500 mb-6">Forever free</p>
                    
                    <ul className="space-y-2 mb-6">
                        {['3 active polls', '100 responses/month', 'All 8 poll types', 'Real-time results'].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <Check size={16} className="text-emerald-500" /> {f}
                            </li>
                        ))}
                    </ul>
                    
                    <a href="#create" className="block w-full py-3 text-center bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition">
                        Start Free
                    </a>
                </div>

                {/* Pro */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl scale-105">
                    <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                        POPULAR
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-amber-300" size={20} />
                        <span className="font-bold">Pro</span>
                    </div>
                    <div className="text-3xl font-black mb-1">$16<span className="text-lg font-medium text-indigo-200">/mo</span></div>
                    <p className="text-sm text-indigo-200 mb-6">or $190/year <span className="text-amber-300 font-semibold">(2 months free)</span></p>
                    
                    <ul className="space-y-2 mb-6">
                        {['Unlimited polls', '5,000 responses/month', 'Remove branding', 'CSV & Excel export'].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-indigo-100">
                                <Check size={16} className="text-amber-300" /> {f}
                            </li>
                        ))}
                    </ul>
                    
                    <a href="/pricing" className="block w-full py-3 text-center bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition">
                        Get Pro
                    </a>
                </div>

                {/* Business */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="text-amber-400" size={20} />
                        <span className="font-bold">Business</span>
                    </div>
                    <div className="text-3xl font-black mb-1">$41<span className="text-lg font-medium text-slate-400">/mo</span></div>
                    <p className="text-sm text-slate-400 mb-6">or $490/year <span className="text-amber-400 font-semibold">(2 months free)</span></p>
                    
                    <ul className="space-y-2 mb-6">
                        {['Everything in Pro', '50,000 responses/month', 'Custom logo', 'PDF reports'].map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check size={16} className="text-amber-400" /> {f}
                            </li>
                        ))}
                    </ul>
                    
                    <a href="/pricing" className="block w-full py-3 text-center bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition">
                        Get Business
                    </a>
                </div>
            </div>

            <div className="text-center mt-8">
                <a href="/pricing" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
                    See full feature comparison <ArrowRight size={16} />
                </a>
            </div>
        </div>
    </section>
);

// ============================================================================
// FAQ Section
// ============================================================================

const FAQSection: React.FC = () => {
    const faqs = [
        { 
            q: 'Do I need to create an account?', 
            a: 'Nope! VoteGenerator is completely signup-free. Create a poll instantly and get a private admin link to manage it. No email required.' 
        },
        { 
            q: 'Is it really free?', 
            a: 'Yes! Free polls get 100 responses per month across 3 active polls. You get all 8 poll types and real-time results. Upgrade only if you need more responses or premium features.' 
        },
        { 
            q: 'How do voters submit their responses?', 
            a: 'Just share the poll link! Voters click, make their choice, and submit. No account or email required. Works on any phone, tablet, or computer.' 
        },
        { 
            q: 'Are votes anonymous?', 
            a: 'By default, yes. You can optionally require names if needed for your use case, but we never require email addresses from voters.' 
        },
        { 
            q: 'What happens when I hit my response limit?', 
            a: 'Your poll will stop accepting new votes until the next month, or you can upgrade to get more responses. Existing responses are never deleted.' 
        },
        { 
            q: 'Can I embed polls on my website?', 
            a: 'Absolutely! Every poll gets an embed code you can add to any website. Works with WordPress, Squarespace, Wix, and any custom site.' 
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Questions? We've got answers.
                    </h2>
                </div>

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
// CTA Section
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to create your first poll?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
                Free forever. No signup. No credit card.
            </p>
            <a 
                href="#create" 
                className="group inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-700 font-bold text-lg rounded-xl hover:bg-indigo-50 transition shadow-xl"
            >
                <Sparkles size={24} /> 
                Create Free Poll 
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-indigo-200 text-sm mt-6">
                Join teams at companies like yours who trust VoteGenerator
            </p>
        </div>
    </section>
);

// ============================================================================
// Main Landing Page
// ============================================================================

function LandingPage(): React.ReactElement {
    return (
        <div className="min-h-screen">
            <NavHeader />
            <HeroSection />
            <TrustBar />
            
            {/* ============ CREATE POLL SECTION ============ */}
            <section id="create" className="py-16 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Create your poll
                        </h2>
                        <p className="text-slate-500">Pick a type and start building. Takes 30 seconds.</p>
                    </div>
                    <VoteGeneratorCreate />
                </div>
            </section>
            {/* ============================================= */}
            
            <ProblemSection />
            <HowItWorksSection />
            <PollTypesSection />
            <PrivacySection />
            <FeaturesSection />
            <UseCasesSection />
            <PricingPreviewSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default LandingPage;
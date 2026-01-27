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
    MousePointer, Share2, Link, ExternalLink, Vote, Layers, Bell
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import HeroSection from './HeroSection';


// ============================================================================
// Problem Section - Show pain points of existing tools
// Research: Problem-agitation-solution framework converts better
// ============================================================================

const ProblemSection: React.FC = () => (
    <section className="py-16 bg-gradient-to-b from-indigo-50/50 to-white">
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
                    No accounts required. No emails collected. Just polls that work instantly, 
                    on any device, with complete privacy for your voters.
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
            </div>
        </section>
    );
};

// ============================================================================
// Poll Types Section - Visual showcase with ACTUAL poll mockups
// ============================================================================

const PollTypesSection: React.FC = () => {
    const [activeType, setActiveType] = useState(0);
    
    const pollTypes = [
        { 
            name: 'Multiple Choice', 
            icon: CheckSquare, 
            desc: 'Pick one or more options from a list',
            gradient: 'from-blue-500 to-indigo-600',
            popular: true,
            mockup: (
                <div className="space-y-2">
                    {['Hawaiian Paradise', 'Mountain Lodge', 'Beach Resort', 'City Adventure'].map((opt, i) => (
                        <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border-2 ${i === 0 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                {i === 0 && <Check className="text-white" size={10} />}
                            </div>
                            <span className={`text-sm ${i === 0 ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>{opt}</span>
                            {i === 0 && <span className="ml-auto text-xs font-bold text-indigo-600">42%</span>}
                        </div>
                    ))}
                </div>
            )
        },
        { 
            name: 'Ranked Choice', 
            icon: ListOrdered, 
            desc: 'Drag to rank options by preference',
            gradient: 'from-indigo-500 to-purple-600',
            mockup: (
                <div className="space-y-2">
                    {[
                        { rank: 1, text: 'React', color: 'bg-amber-400' },
                        { rank: 2, text: 'Vue', color: 'bg-slate-300' },
                        { rank: 3, text: 'Angular', color: 'bg-orange-300' },
                        { rank: 4, text: 'Svelte', color: 'bg-slate-200' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-grab">
                            <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                                {item.rank}
                            </div>
                            <span className="text-sm text-slate-700">{item.text}</span>
                            <div className="ml-auto flex flex-col gap-0.5">
                                <div className="w-4 h-0.5 bg-slate-300 rounded" />
                                <div className="w-4 h-0.5 bg-slate-300 rounded" />
                                <div className="w-4 h-0.5 bg-slate-300 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        { 
            name: 'Meeting Poll', 
            icon: Calendar, 
            desc: 'Find when everyone is available',
            gradient: 'from-amber-500 to-orange-600',
            mockup: (
                <div>
                    <div className="grid grid-cols-4 gap-1 mb-2">
                        <div className="text-[10px] text-slate-400 text-center">Mon 15</div>
                        <div className="text-[10px] text-slate-400 text-center">Tue 16</div>
                        <div className="text-[10px] text-slate-400 text-center">Wed 17</div>
                        <div className="text-[10px] text-slate-400 text-center">Thu 18</div>
                    </div>
                    {['9:00 AM', '10:00 AM', '2:00 PM'].map((time, ti) => (
                        <div key={ti} className="grid grid-cols-4 gap-1 mb-1">
                            {[0,1,2,3].map((di) => {
                                const votes = [3,5,2,4,1,6,3,2,4,5,1,3][ti * 4 + di];
                                const intensity = votes > 4 ? 'bg-emerald-500' : votes > 2 ? 'bg-emerald-300' : 'bg-emerald-100';
                                return (
                                    <div key={di} className={`h-8 ${intensity} rounded flex items-center justify-center`}>
                                        <span className="text-[10px] font-bold text-emerald-900">{votes}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="text-[10px] text-slate-400 mt-2">✓ Tue 10 AM works for 6 people</div>
                </div>
            )
        },
        { 
            name: 'Rating Scale', 
            icon: SlidersHorizontal, 
            desc: 'Rate each option 1-5 stars',
            gradient: 'from-cyan-500 to-blue-600',
            mockup: (
                <div className="space-y-3">
                    {[
                        { name: 'Customer Service', rating: 4.5 },
                        { name: 'Product Quality', rating: 4.8 },
                        { name: 'Value for Money', rating: 3.9 },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs text-slate-600">{item.name}</span>
                                <span className="text-xs font-bold text-slate-900">{item.rating}</span>
                            </div>
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map((star) => (
                                    <Star 
                                        key={star} 
                                        size={16} 
                                        className={star <= Math.floor(item.rating) ? 'text-amber-400 fill-amber-400' : star - 0.5 <= item.rating ? 'text-amber-400 fill-amber-200' : 'text-slate-200'}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        { 
            name: 'This or That', 
            icon: ArrowLeftRight, 
            desc: 'Quick A vs B comparisons',
            gradient: 'from-orange-500 to-red-600',
            mockup: (
                <div className="flex gap-3">
                    <div className="flex-1 bg-indigo-50 border-2 border-indigo-500 rounded-xl p-3 text-center">
                        <div className="text-2xl mb-1">🍕</div>
                        <div className="text-sm font-bold text-indigo-700">Pizza</div>
                        <div className="text-lg font-black text-indigo-600 mt-1">62%</div>
                        <div className="text-[10px] text-indigo-400">156 votes</div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-slate-300 font-bold">VS</span>
                    </div>
                    <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-center">
                        <div className="text-2xl mb-1">🍔</div>
                        <div className="text-sm font-bold text-slate-700">Burger</div>
                        <div className="text-lg font-black text-slate-600 mt-1">38%</div>
                        <div className="text-[10px] text-slate-400">95 votes</div>
                    </div>
                </div>
            )
        },
        { 
            name: 'RSVP', 
            icon: Users, 
            desc: 'Yes, No, or Maybe responses',
            gradient: 'from-sky-500 to-blue-600',
            mockup: (
                <div>
                    <div className="text-center mb-3">
                        <div className="text-sm font-bold text-slate-900">🎉 Sarah's Birthday Party</div>
                        <div className="text-xs text-slate-500">Sat, Jan 20 at 7 PM</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-emerald-100 border-2 border-emerald-500 rounded-lg p-2 text-center">
                            <div className="text-lg">👍</div>
                            <div className="text-xs font-bold text-emerald-700">Yes</div>
                            <div className="text-sm font-black text-emerald-600">12</div>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                            <div className="text-lg">🤔</div>
                            <div className="text-xs font-bold text-amber-700">Maybe</div>
                            <div className="text-sm font-black text-amber-600">5</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                            <div className="text-lg">👎</div>
                            <div className="text-xs font-bold text-slate-600">No</div>
                            <div className="text-sm font-black text-slate-500">3</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-center">20 responses</div>
                </div>
            )
        },
        { 
            name: 'Visual Poll', 
            icon: Image, 
            desc: 'Vote using images',
            gradient: 'from-pink-500 to-rose-600',
            mockup: (
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', label: 'Design A', votes: 34, selected: true },
                        { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', label: 'Design B', votes: 28, selected: false },
                        { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', label: 'Design C', votes: 19, selected: false },
                        { bg: 'bg-gradient-to-br from-amber-400 to-amber-600', label: 'Design D', votes: 12, selected: false },
                    ].map((item, i) => (
                        <div key={i} className={`rounded-lg overflow-hidden border-2 ${item.selected ? 'border-indigo-500' : 'border-slate-200'}`}>
                            <div className={`${item.bg} h-12 flex items-center justify-center`}>
                                <Image className="text-white/50" size={20} />
                            </div>
                            <div className="p-1.5 bg-white">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-600">{item.label}</span>
                                    <span className="text-[10px] font-bold text-slate-900">{item.votes}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        { 
            name: 'Dot Voting', 
            icon: CheckCircle2, 
            desc: 'Distribute points across options',
            gradient: 'from-emerald-500 to-teal-600',
            mockup: (
                <div>
                    <div className="text-xs text-slate-500 mb-2 text-center">You have <span className="font-bold text-indigo-600">3 dots</span> remaining</div>
                    <div className="space-y-2">
                        {[
                            { name: 'Better onboarding', dots: 8 },
                            { name: 'Mobile app', dots: 12 },
                            { name: 'Dark mode', dots: 5 },
                            { name: 'API access', dots: 3 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <div className="text-xs text-slate-700 mb-0.5">{item.name}</div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(item.dots / 12) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(Math.min(item.dots, 5))].map((_, di) => (
                                        <div key={di} className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    ))}
                                    {item.dots > 5 && <span className="text-[10px] text-emerald-600">+{item.dots - 5}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
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

                {/* Interactive poll type showcase */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Poll type selector */}
                    <div className="grid grid-cols-2 gap-3">
                        {pollTypes.map((type, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveType(i)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${
                                    activeType === i 
                                        ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                                        <type.icon className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">{type.name}</h3>
                                            {type.popular && (
                                                <span className="text-[8px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-bold">
                                                    POPULAR
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">{type.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Live preview */}
                    <div className="sticky top-24">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            {/* Browser chrome */}
                            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                                    <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded">votegenerator.com/poll/...</span>
                                </div>
                            </div>
                            
                            {/* Poll content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pollTypes[activeType].gradient} flex items-center justify-center`}>
                                        {React.createElement(pollTypes[activeType].icon, { className: "text-white", size: 16 })}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{pollTypes[activeType].name} Poll</h4>
                                        <p className="text-xs text-slate-400">Live preview</p>
                                    </div>
                                </div>
                                
                                <div className="min-h-[200px]">
                                    {pollTypes[activeType].mockup}
                                </div>
                                
                                <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition">
                                    Submit Vote
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-center text-sm text-slate-500 mt-4">
                            Click each poll type to see how it looks →
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a href="#create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
                        Create Your First Poll <ArrowRight size={18} />
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
// Templates Section - Visual template previews
// ============================================================================

const TemplatesSection: React.FC = () => {
    const templates = [
        {
            name: 'Team Lunch Vote',
            category: 'Workplace',
            categoryColor: 'bg-blue-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">🍽️ Where to lunch?</div>
                    <div className="space-y-1.5">
                        {['Italian', 'Thai', 'Mexican'].map((opt, i) => (
                            <div key={i} className={`text-[10px] p-1.5 rounded ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-600'}`}>
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            name: 'Sprint Retro',
            category: 'Workplace',
            categoryColor: 'bg-blue-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">🔄 What went well?</div>
                    <div className="flex gap-1">
                        {[4.2, 3.8, 4.5].map((rating, i) => (
                            <div key={i} className="flex-1 text-center p-1 bg-emerald-50 rounded">
                                <div className="text-[10px] text-emerald-600">{'⭐'.repeat(Math.floor(rating))}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            name: 'Event Date Picker',
            category: 'Events',
            categoryColor: 'bg-purple-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">📅 When works?</div>
                    <div className="grid grid-cols-3 gap-1">
                        {['Mon', 'Tue', 'Wed'].map((day, i) => (
                            <div key={i} className={`text-[10px] p-1 rounded text-center ${i === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                                {day}
                                <div className="font-bold">{i === 1 ? '8' : i + 2}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            name: 'Wedding RSVP',
            category: 'Events',
            categoryColor: 'bg-purple-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">💒 Will you attend?</div>
                    <div className="flex gap-1">
                        <div className="flex-1 p-1.5 bg-emerald-100 rounded text-center text-[10px] text-emerald-700 font-bold">Yes ✓</div>
                        <div className="flex-1 p-1.5 bg-slate-50 rounded text-center text-[10px] text-slate-500">No</div>
                    </div>
                    <div className="mt-1 text-[9px] text-slate-400">+ dietary preferences</div>
                </div>
            )
        },
        {
            name: 'Class Feedback',
            category: 'Education',
            categoryColor: 'bg-emerald-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">📚 Rate this lecture</div>
                    <div className="flex justify-center gap-0.5 mb-1">
                        {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={12} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                        ))}
                    </div>
                    <div className="text-[9px] text-slate-400 text-center">4.2 avg • 32 responses</div>
                </div>
            )
        },
        {
            name: 'Exit Ticket',
            category: 'Education',
            categoryColor: 'bg-emerald-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">🎯 Today I learned...</div>
                    <div className="space-y-1">
                        <div className="h-1.5 bg-indigo-200 rounded-full w-full" />
                        <div className="h-1.5 bg-indigo-200 rounded-full w-3/4" />
                        <div className="h-1.5 bg-slate-100 rounded-full w-1/2" />
                    </div>
                </div>
            )
        },
        {
            name: 'Movie Night',
            category: 'Social',
            categoryColor: 'bg-pink-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">🎬 What to watch?</div>
                    <div className="grid grid-cols-2 gap-1">
                        {['🦁', '🚀', '👻', '💕'].map((emoji, i) => (
                            <div key={i} className={`p-2 rounded text-center ${i === 1 ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-slate-50'}`}>
                                <span className="text-lg">{emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            name: 'Gift Ideas',
            category: 'Social',
            categoryColor: 'bg-pink-500',
            preview: (
                <div className="p-3 bg-white rounded-lg">
                    <div className="text-xs font-bold text-slate-800 mb-2">🎁 Rank your wishlist</div>
                    <div className="space-y-1">
                        {['🎧 Headphones', '📱 Phone case', '👟 Sneakers'].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                <span className="w-4 h-4 bg-amber-100 rounded-full text-[8px] flex items-center justify-center font-bold text-amber-700">{i + 1}</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full mb-4">
                        Get started faster
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Free templates for every use case
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Don't start from scratch. Pick a template, customize it, and launch in seconds.
                    </p>
                </div>

                {/* Template grid with visual previews */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {templates.map((template, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer"
                        >
                            {/* Visual preview */}
                            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 min-h-[120px] flex items-center justify-center">
                                {template.preview}
                            </div>
                            
                            {/* Info */}
                            <div className="p-3 bg-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] ${template.categoryColor} text-white px-1.5 py-0.5 rounded font-bold`}>
                                        {template.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                                    {template.name}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Creator Platform Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <a 
                        href="/youtube-polls"
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border-2 border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-100 hover:border-red-300 transition"
                    >
                        <span>▶️</span> For YouTubers
                    </a>
                    <a 
                        href="/twitch-polls"
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-100 hover:border-purple-300 transition"
                    >
                        <span>📺</span> For Streamers
                    </a>
                    <a 
                        href="/reddit-polls"
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 border-2 border-orange-200 text-orange-700 font-semibold rounded-xl hover:bg-orange-100 hover:border-orange-300 transition"
                    >
                        <span>🔗</span> For Reddit
                    </a>
                </div>

                <div className="text-center">
                    <a 
                        href="/templates" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
                    >
                        Browse All Templates <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// Analytics Section - Showcase dashboard and reporting features
// ============================================================================

const AnalyticsSection: React.FC = () => (
    <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4">
                    Real-time analytics
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Beautiful dashboards.<br />
                    <span className="text-indigo-600">Instant insights.</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Every poll includes a powerful dashboard with live charts, response breakdowns, and export options.
                </p>
            </div>

            {/* Visual Dashboard Showcase - Multiple mockups */}
            <div className="relative mb-16">
                {/* Main dashboard mockup */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-4 md:p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Browser chrome */}
                        <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 bg-red-400 rounded-full" />
                                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-md">votegenerator.com/admin</span>
                            </div>
                        </div>
                        
                        {/* Dashboard content */}
                        <div className="p-4 md:p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-slate-900">Team Retreat Vote</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-emerald-600">Live • 247 responses</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Share</button>
                                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium">Export</button>
                                </div>
                            </div>
                            
                            {/* Stats cards */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {[
                                    { label: 'Total Votes', value: '247', change: '+23 today', positive: true },
                                    { label: 'Completion', value: '94%', change: 'Above avg', positive: true },
                                    { label: 'Avg. Time', value: '8s', change: 'Per vote', positive: null },
                                    { label: 'Countries', value: '12', change: 'Locations', positive: null },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                        <p className={`text-[10px] ${stat.positive === true ? 'text-emerald-600' : stat.positive === false ? 'text-red-500' : 'text-slate-400'}`}>
                                            {stat.change}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Chart area */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Bar chart */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-slate-700 mb-3">Results Breakdown</p>
                                    {[
                                        { label: 'Hawaiian Paradise', pct: 42, color: 'bg-indigo-500' },
                                        { label: 'Mountain Lodge', pct: 31, color: 'bg-purple-500' },
                                        { label: 'Beach Resort', pct: 18, color: 'bg-pink-500' },
                                        { label: 'City Adventure', pct: 9, color: 'bg-slate-400' },
                                    ].map((item, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-600 truncate">{item.label}</span>
                                                <span className="font-bold text-slate-900">{item.pct}%</span>
                                            </div>
                                            <div className="h-2 bg-white rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Timeline chart mockup */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-slate-700 mb-3">Response Timeline</p>
                                    <div className="h-24 flex items-end gap-1">
                                        {[20, 35, 28, 45, 60, 52, 38, 42, 55, 48, 62, 70].map((h, i) => (
                                            <div 
                                                key={i} 
                                                className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-slate-400">12 AM</span>
                                        <span className="text-[10px] text-slate-400">Now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating feature cards */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl p-3 border border-slate-200 hidden lg:block"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-emerald-600" size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Live Updates</p>
                            <p className="text-[10px] text-slate-500">No refresh needed</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute -right-4 top-1/3 bg-white rounded-xl shadow-xl p-3 border border-slate-200 hidden lg:block"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Download className="text-purple-600" size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Export Data</p>
                            <p className="text-[10px] text-slate-500">CSV & Excel</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl p-3 border border-slate-200 hidden lg:block"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Globe className="text-indigo-600" size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Geographic View</p>
                            <p className="text-[10px] text-slate-500">See voter locations</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feature list below */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { icon: BarChart3, title: 'Live charts', desc: 'Results update instantly as votes come in' },
                    { icon: TrendingUp, title: 'Timeline view', desc: 'See response patterns over time' },
                    { icon: Globe, title: 'Geographic data', desc: 'Know where voters are located' },
                    { icon: Download, title: 'Export anywhere', desc: 'Download CSV or Excel files' },
                ].map((item, i) => (
                    <div key={i} className="text-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <item.icon className="text-indigo-600" size={24} />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ============================================================================
// Device Showcase Section - Show product on phone, tablet, desktop
// ============================================================================

const DeviceShowcaseSection: React.FC = () => (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-white/10 text-indigo-300 text-sm font-bold rounded-full mb-4">
                    Works everywhere
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Beautiful on every device
                </h2>
                <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
                    Your voters can respond from anywhere — phone, tablet, or desktop. 
                    No app to download, no account to create.
                </p>
            </div>

            {/* Device mockups */}
            <div className="relative flex items-end justify-center gap-4 md:gap-8">
                {/* Desktop */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="hidden md:block"
                >
                    <div className="w-[400px] bg-slate-800 rounded-t-xl p-1">
                        {/* Browser chrome */}
                        <div className="bg-slate-700 rounded-t-lg px-3 py-2 flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            </div>
                            <div className="flex-1 bg-slate-600 rounded px-2 py-0.5 text-[10px] text-slate-300 text-center">
                                votegenerator.com/poll/team-lunch
                            </div>
                        </div>
                        {/* Screen content */}
                        <div className="bg-white p-4">
                            <div className="text-sm font-bold text-slate-800 mb-3">🍽️ Where should we get lunch?</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'Italian Place', pct: 45, votes: 12 },
                                    { name: 'Thai Kitchen', pct: 30, votes: 8 },
                                    { name: 'Taco Shop', pct: 25, votes: 7 },
                                ].map((opt, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-600">{opt.name}</span>
                                            <span className="font-bold text-slate-900">{opt.pct}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${i === 0 ? 'bg-indigo-500' : 'bg-slate-300'} rounded-full`} style={{ width: `${opt.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] text-slate-500">27 votes • Live updating</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-[400px] h-4 bg-slate-700 rounded-b-lg" />
                    <div className="w-[200px] h-2 bg-slate-600 mx-auto rounded-b-lg" />
                    <p className="text-center text-indigo-300 text-sm mt-3 font-medium">Desktop</p>
                </motion.div>

                {/* Phone - Center, prominent */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="w-[200px] md:w-[220px] bg-slate-800 rounded-[2rem] p-2 shadow-2xl ring-1 ring-white/10">
                        {/* Phone notch */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-full" />
                        {/* Screen */}
                        <div className="bg-white rounded-[1.5rem] overflow-hidden">
                            {/* Status bar */}
                            <div className="bg-slate-100 px-4 py-1 flex justify-between text-[8px] text-slate-500">
                                <span>9:41</span>
                                <span>📶 🔋</span>
                            </div>
                            {/* Content */}
                            <div className="p-4">
                                <div className="text-xs font-bold text-slate-800 mb-3">🗳️ Team Retreat Vote</div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Beach Resort', selected: true },
                                        { name: 'Mountain Lodge', selected: false },
                                        { name: 'City Hotel', selected: false },
                                    ].map((opt, i) => (
                                        <div key={i} className={`p-2 rounded-lg border-2 text-xs ${opt.selected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full border-2 ${opt.selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                                    {opt.selected && <Check className="text-white" size={8} />}
                                                </div>
                                                {opt.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg">
                                    Submit Vote
                                </button>
                                <p className="text-[9px] text-slate-400 text-center mt-2">No account needed</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-white text-sm mt-3 font-medium">Mobile</p>
                    
                    {/* Floating badge */}
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                        ✓ No app needed
                    </div>
                </motion.div>

                {/* Tablet */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:block"
                >
                    <div className="w-[280px] bg-slate-800 rounded-2xl p-2">
                        {/* Camera */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-600 rounded-full" />
                        {/* Screen */}
                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm font-bold text-slate-800">📊 Results Dashboard</div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-emerald-600">Live</span>
                                    </div>
                                </div>
                                {/* Mini chart */}
                                <div className="grid grid-cols-4 gap-1 mb-3">
                                    {[65, 45, 30, 20].map((h, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <div className="w-full bg-slate-100 rounded-t h-16 flex items-end">
                                                <div className={`w-full ${i === 0 ? 'bg-indigo-500' : 'bg-slate-300'} rounded-t`} style={{ height: `${h}%` }} />
                                            </div>
                                            <span className="text-[8px] text-slate-500 mt-1">Opt {i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-slate-50 rounded p-1.5 text-center">
                                        <div className="text-sm font-bold text-slate-900">156</div>
                                        <div className="text-[8px] text-slate-500">Votes</div>
                                    </div>
                                    <div className="bg-slate-50 rounded p-1.5 text-center">
                                        <div className="text-sm font-bold text-emerald-600">+12</div>
                                        <div className="text-[8px] text-slate-500">Today</div>
                                    </div>
                                    <div className="bg-slate-50 rounded p-1.5 text-center">
                                        <div className="text-sm font-bold text-slate-900">4</div>
                                        <div className="text-[8px] text-slate-500">Options</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-indigo-300 text-sm mt-3 font-medium">Tablet</p>
                </motion.div>
            </div>

            {/* Bottom stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                {[
                    { value: '100%', label: 'Responsive' },
                    { value: '0', label: 'Apps to download' },
                    { value: '<1s', label: 'Load time' },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-sm text-indigo-300">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ============================================================================
// Exports & Sharing Section - Show CSV, Excel, QR code visuals
// ============================================================================

const ExportsSection: React.FC = () => (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-sm font-bold rounded-full mb-4">
                    Share & Export
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Get your results anywhere
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Share polls instantly, export data in any format, generate QR codes for in-person events.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* QR Code */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <QrCode className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">QR Codes</h3>
                            <p className="text-sm text-slate-500">For in-person events</p>
                        </div>
                    </div>
                    
                    {/* QR Code mockup */}
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                        <div className="w-32 h-32 bg-white rounded-lg p-2 shadow-sm mb-3">
                            {/* QR pattern */}
                            <div className="w-full h-full grid grid-cols-8 gap-0.5">
                                {[...Array(64)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'} ${
                                            // Corner squares
                                            (i < 3 || (i >= 5 && i < 8) || i === 8 || i === 15 || i === 16 || i === 23 || 
                                             i === 40 || i === 47 || i === 48 || i === 55 || (i >= 56 && i < 59) || (i >= 61 && i < 64))
                                                ? 'bg-slate-900' : ''
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <span className="text-xs text-slate-500">vote.link/lunch-poll</span>
                        <button className="mt-3 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">
                            Download QR
                        </button>
                    </div>
                    
                    <p className="text-sm text-slate-500 mt-4">
                        Print it, project it, or add to slides. Voters scan and vote instantly.
                    </p>
                </motion.div>

                {/* Export Formats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Download className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Export Data</h3>
                            <p className="text-sm text-slate-500">Any format you need</p>
                        </div>
                    </div>
                    
                    {/* Export mockups */}
                    <div className="space-y-3">
                        {/* CSV */}
                        <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                            <div className="w-10 h-12 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                CSV
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-medium text-slate-700">poll_results.csv</div>
                                <div className="text-[10px] text-slate-400">Raw data, timestamps, IDs</div>
                            </div>
                            <Download size={14} className="text-slate-400" />
                        </div>
                        
                        {/* Excel */}
                        <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                            <div className="w-10 h-12 bg-green-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                XLSX
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-medium text-slate-700">poll_results.xlsx</div>
                                <div className="text-[10px] text-slate-400">Formatted with charts</div>
                            </div>
                            <Download size={14} className="text-slate-400" />
                        </div>
                        
                        {/* Print */}
                        <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                            <div className="w-10 h-12 bg-slate-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
                                PRINT
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-medium text-slate-700">Print Results</div>
                                <div className="text-[10px] text-slate-400">Browser print view</div>
                            </div>
                            <Download size={14} className="text-slate-400" />
                        </div>
                    </div>
                    
                    <p className="text-sm text-slate-500 mt-4">
                        One click to download. Works with Excel, Google Sheets, or any tool.
                    </p>
                </motion.div>

                {/* Share Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Share2 className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Easy Sharing</h3>
                            <p className="text-sm text-slate-500">Send anywhere</p>
                        </div>
                    </div>
                    
                    {/* Share mockup */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        {/* Link copy */}
                        <div className="bg-white rounded-lg border border-slate-200 p-2 flex items-center gap-2 mb-3">
                            <Link size={14} className="text-slate-400" />
                            <span className="flex-1 text-xs text-slate-600 truncate">vote.link/team-lunch</span>
                            <button className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded">
                                Copy
                            </button>
                        </div>
                        
                        {/* Share buttons */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { icon: '✉️', label: 'Email' },
                                { icon: '💬', label: 'Slack' },
                                { icon: '📱', label: 'Text' },
                                { icon: '🔗', label: 'Embed' },
                            ].map((opt, i) => (
                                <button key={i} className="bg-white rounded-lg p-2 text-center hover:bg-slate-100 transition">
                                    <div className="text-lg mb-0.5">{opt.icon}</div>
                                    <div className="text-[9px] text-slate-500">{opt.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Embed preview */}
                    <div className="mt-4 bg-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 overflow-hidden">
                        <span className="text-pink-400">&lt;iframe</span> src="..."<span className="text-pink-400">/&gt;</span>
                    </div>
                    
                    <p className="text-sm text-slate-500 mt-4">
                        Custom short links, embed codes, and direct sharing to any platform.
                    </p>
                </motion.div>
            </div>
        </div>
    </section>
);

// ============================================================================
// Value Comparison Section - What you get vs typical market pricing
// ============================================================================

const ValueSection: React.FC = () => (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full mb-4">
                    Incredible value
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Professional features.<br />
                    <span className="text-indigo-600">Fraction of the price.</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Enterprise-grade polling tools often cost $100-200/month. We built something better—and more affordable.
                </p>
            </div>

            {/* Price comparison visual */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Others */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="text-center mb-6">
                        <p className="text-slate-500 text-sm mb-2">Enterprise polling tools</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-black text-slate-300 line-through">$150</span>
                            <span className="text-slate-400">/month USD</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">typical pricing</p>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li className="flex items-center gap-2"><Check size={14} className="text-slate-400" /> Analytics dashboard</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-slate-400" /> Multiple poll types</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-slate-400" /> Data export</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-slate-400" /> Custom branding</li>
                        <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Requires signup to vote</li>
                        <li className="flex items-center gap-2"><X size={14} className="text-red-400" /> Annual contracts</li>
                    </ul>
                </div>

                {/* VoteGenerator */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                        90% LESS
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-indigo-200 text-sm mb-2">VoteGenerator Pro</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-black text-white">$16</span>
                            <span className="text-indigo-200">/month USD</span>
                        </div>
                        <p className="text-sm text-indigo-300 mt-1">or $190/year USD (2 months free)</p>
                    </div>
                    <ul className="space-y-2 text-sm text-indigo-100">
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Real-time analytics dashboard</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 8 poll types included</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> CSV & Excel export</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 12+ premium themes</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> No signup to vote</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Month-to-month, cancel anytime</li>
                    </ul>
                </div>
            </div>

            {/* Full feature showcase */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold mb-1">All Pro features</h3>
                            <p className="text-slate-400 text-sm">Everything you need for professional polling</p>
                        </div>
                        <div className="text-center sm:text-right">
                            <div className="text-3xl font-black">$16<span className="text-lg font-normal text-slate-400">/mo USD</span></div>
                            <div className="text-sm text-emerald-400">Limited time pricing</div>
                        </div>
                    </div>
                </div>

                {/* Feature grid */}
                <div className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: Layers, title: '8 Poll Types', desc: 'Multiple choice, ranked, rating, visual & more' },
                            { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time charts and response tracking' },
                            { icon: Download, title: 'CSV & Excel Export', desc: 'Download your data anytime' },
                            { icon: Palette, title: 'Premium Themes', desc: '12+ professional color schemes' },
                            { icon: QrCode, title: 'QR Code Sharing', desc: 'Perfect for in-person events' },
                            { icon: Code, title: 'Website Embed', desc: 'Add polls to any website' },
                            { icon: Shield, title: 'Anti-Fraud Protection', desc: 'IP detection & browser fingerprinting' },
                            { icon: Bell, title: 'Email Notifications', desc: 'Get notified when votes come in' },
                            { icon: Timer, title: 'Scheduled Close', desc: 'Auto-close polls at a set time' },
                            { icon: FileText, title: 'Free Templates', desc: 'Ready-to-use poll templates' },
                            { icon: TrendingUp, title: 'Response Timeline', desc: 'See when votes come in over time' },
                            { icon: Link, title: 'Custom Short Links', desc: 'Branded, memorable poll URLs' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <item.icon className="text-indigo-600" size={16} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                    <p className="text-slate-500 text-xs">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-slate-600">
                                <strong>Start free</strong> with 3 polls and 100 responses/month.
                            </p>
                            <p className="text-slate-400 text-sm">Upgrade anytime. Cancel anytime. No contracts.</p>
                        </div>
                        <a 
                            href="/pricing" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                        >
                            See All Plans <ArrowRight size={18} />
                        </a>
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
    const featureGroups = [
        {
            title: 'Create & Share',
            features: [
                { icon: Zap, title: 'Instant setup', desc: 'Create a poll in under 30 seconds. No account needed.' },
                { icon: QrCode, title: 'QR code sharing', desc: 'Generate QR codes for easy in-person polling.' },
                { icon: Link, title: 'Custom short links', desc: 'Memorable URLs you can share anywhere.' },
                { icon: Code, title: 'Embed anywhere', desc: 'Add polls to your website with a simple embed code.' },
            ]
        },
        {
            title: 'Analyze & Export',
            features: [
                { icon: BarChart3, title: 'Real-time results', desc: 'Watch votes come in live with auto-updating charts.' },
                { icon: TrendingUp, title: 'Response timeline', desc: 'See when votes arrived and spot trends over time.' },
                { icon: Globe, title: 'Geographic insights', desc: 'See where your respondents are located.' },
                { icon: Download, title: 'Export data', desc: 'Download as CSV or Excel spreadsheets.' },
            ]
        },
        {
            title: 'Customize & Brand',
            features: [
                { icon: Palette, title: '12+ premium themes', desc: 'Match your brand with professional color schemes.' },
                { icon: Image, title: 'Custom logo', desc: 'Add your company logo to polls.' },
                { icon: Eye, title: 'Remove branding', desc: 'Hide "Powered by VoteGenerator" badge.' },
                { icon: Smartphone, title: 'Mobile-optimized', desc: 'Perfect on phone, tablet, or desktop.' },
            ]
        },
        {
            title: 'Secure & Control',
            features: [
                { icon: Shield, title: 'Anti-fraud protection', desc: 'Block duplicates with IP & browser fingerprinting.' },
                { icon: Lock, title: 'Password protection', desc: 'Require a PIN to access your poll.' },
                { icon: Timer, title: 'Scheduled close', desc: 'Auto-close polls at a specific date/time.' },
                { icon: Bell, title: 'Email notifications', desc: 'Get notified when new votes come in.' },
            ]
        },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4">
                        Packed with features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need to run great polls
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Powerful features that just work. No learning curve required.
                    </p>
                </div>

                <div className="space-y-12">
                    {featureGroups.map((group, gi) => (
                        <div key={gi}>
                            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-indigo-500 rounded-full" />
                                {group.title}
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {group.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg border border-slate-100 hover:border-slate-200 transition-all"
                                    >
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                                            <feature.icon className="text-indigo-600" size={20} />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                                        <p className="text-sm text-slate-500">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature count badge */}
                <div className="text-center mt-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                        <Sparkles size={16} />
                        16+ features included on all plans
                    </span>
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
        <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
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
                    <div className="text-3xl font-black text-slate-900 mb-1">$0 <span className="text-lg font-normal text-slate-400">USD</span></div>
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
                    <div className="text-3xl font-black mb-1">$16<span className="text-lg font-medium text-indigo-200">/mo USD</span></div>
                    <p className="text-sm text-indigo-200 mb-6">or $190/year USD <span className="text-amber-300 font-semibold">(2 months free)</span></p>
                    
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
                    <div className="text-3xl font-black mb-1">$41<span className="text-lg font-medium text-slate-400">/mo USD</span></div>
                    <p className="text-sm text-slate-400 mb-6">or $490/year USD <span className="text-amber-400 font-semibold">(2 months free)</span></p>
                    
                    <ul className="space-y-2 mb-6">
                        {['Everything in Pro', '100,000 responses/month', 'Custom logo', 'Hourly heatmap'].map((f, i) => (
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
            a: 'Yes! Every poll gets an embed code you can add to any website. Works with WordPress, Squarespace, Wix, and any custom site. Available on all plans including Free.' 
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white">
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
                No signup required • Free forever • Upgrade anytime
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
            
            {/* ============ CREATE POLL SECTION ============ */}
            <section id="create" className="py-16 bg-gradient-to-b from-slate-50/50 to-white">
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
            <TemplatesSection />
            <AnalyticsSection />
            <DeviceShowcaseSection />
            <ExportsSection />
            <PrivacySection />
            <FeaturesSection />
            <ValueSection />
            <UseCasesSection />
            <PricingPreviewSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default LandingPage;
// ============================================================================
// HeroSection - Fixed height to prevent layout shift during typing animation
// Updated with accurate, defensible claims
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Lock, Mail, CheckCircle2, ArrowRight, Sparkles, Play, 
    Smartphone, Users, Zap
} from 'lucide-react';

const HeroSection: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Use cases that are factually accurate
    const phrases = ['team decisions', 'event planning', 'group feedback', 'quick votes', 'scheduling'];

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (typedText.length < currentPhrase.length) {
                    setTypedText(currentPhrase.slice(0, typedText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (typedText.length > 0) {
                    setTypedText(currentPhrase.slice(0, typedText.length - 1));
                } else {
                    setIsDeleting(false);
                    setPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }
        }, isDeleting ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [typedText, isDeleting, phraseIndex]);

    const demoOptions = [
        { text: 'Hawaiian Paradise', votes: 42, selected: false },
        { text: 'Mountain Lodge', votes: 38, selected: true },
        { text: 'Beach Resort', votes: 28, selected: false },
        { text: 'City Adventure', votes: 15, selected: false },
    ];
    const totalVotes = demoOptions.reduce((sum, o) => sum + o.votes, 0);

    // Find the longest phrase to reserve space
    const longestPhrase = phrases.reduce((a, b) => a.length > b.length ? a : b);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm mb-6">
                            <Sparkles size={14} />
                            FREE ONLINE POLLING TOOL
                        </div>

                        {/* FIXED HEIGHT TITLE - prevents layout shift */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            The fastest way to gather{' '}
                            <span className="block relative" style={{ minHeight: '1.2em' }}>
                                {/* Invisible text to reserve space for longest phrase */}
                                <span className="invisible" aria-hidden="true">{longestPhrase}</span>
                                {/* Actual animated text positioned absolutely */}
                                <span className="absolute left-0 top-0 text-amber-300">
                                    {typedText}
                                    <span className="inline-block w-0.5 h-[0.9em] bg-amber-300 animate-pulse ml-0.5 align-middle" />
                                </span>
                            </span>
                        </h1>

                        <p className="text-lg text-indigo-100 mb-8 max-w-lg">
                            Create a poll in 30 seconds. Share a link. Get responses instantly. 
                            No accounts required—for you or your voters.
                        </p>

                        {/* Feature badges - ALL accurate claims */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: Mail, text: 'No email to vote' },
                                { icon: Lock, text: 'No signup needed' },
                                { icon: Smartphone, text: 'Works on any device' },
                                { icon: Users, text: 'Anonymous voting' },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm">
                                    <f.icon size={16} /><span>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href="#create" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg">
                                Create Free Poll <ArrowRight size={18} />
                            </a>
                            <a href="/demo" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition">
                                <Play size={18} /> See All 8 Poll Types
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
                        <div className="absolute -top-3 left-4 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Try it live!
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-2xl p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">🏝️ Where should we go for the team trip?</h3>
                                <p className="text-sm text-slate-500">{totalVotes} votes · Multiple Choice Poll</p>
                            </div>

                            <div className="space-y-3">
                                {demoOptions.map((option, i) => {
                                    const percentage = Math.round((option.votes / totalVotes) * 100);
                                    return (
                                        <div key={i} className={`relative p-3 rounded-xl border-2 cursor-pointer transition overflow-hidden ${option.selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
                                            <div className={`absolute inset-0 ${option.selected ? 'bg-indigo-100' : 'bg-slate-50'}`} style={{ width: `${percentage}%` }} />
                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${option.selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                                        {option.selected && <CheckCircle2 size={14} className="text-white" />}
                                                    </div>
                                                    <span className={`font-medium ${option.selected ? 'text-indigo-700' : 'text-slate-700'}`}>{option.text}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{percentage}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                                Submit Vote
                            </button>
                            
                            <p className="text-center text-xs text-slate-500 mt-3">
                                This is 1 of <strong>8 poll types</strong> · <a href="/demo" className="text-indigo-600 hover:underline">Explore all →</a>
                            </p>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            ✓ No signup
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Stats bar - accurate numbers only */}
            <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div><div className="text-3xl font-black text-white">8</div><div className="text-indigo-200 text-sm">Poll Types</div></div>
                        <div><div className="text-3xl font-black text-white">30s</div><div className="text-indigo-200 text-sm">To Create</div></div>
                        <div><div className="text-3xl font-black text-white">0</div><div className="text-indigo-200 text-sm">Accounts Needed</div></div>
                        <div><div className="text-3xl font-black text-white">Free</div><div className="text-indigo-200 text-sm">To Start</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
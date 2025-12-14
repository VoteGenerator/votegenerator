import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Mail,
    Users,
    Clock,
    Lock,
    Eye,
    CheckCircle2,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface HeroSectionProps {
    onGetStarted?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
    const [typedText, setTypedText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const phrases = [
        'team decisions',
        'event planning',
        'group feedback',
        'quick polls',
        'anonymous voting'
    ];

    // Typewriter effect
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

    // Demo poll data
    const demoOptions = [
        { id: '1', text: 'Hawaiian Paradise', votes: 42, selected: false },
        { id: '2', text: 'Mountain Lodge', votes: 38, selected: true },
        { id: '3', text: 'Beach Resort', votes: 28, selected: false },
        { id: '4', text: 'City Adventure', votes: 15, selected: false },
    ];

    const totalVotes = demoOptions.reduce((sum, o) => sum + o.votes, 0);

    const privacyFeatures = [
        { icon: Mail, text: 'No email required', highlight: true },
        { icon: Lock, text: 'No signup needed', highlight: true },
        { icon: Eye, text: 'No tracking cookies', highlight: false },
        { icon: ShieldCheck, text: 'Privacy-first analytics', highlight: false },
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 min-h-[600px]">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full opacity-10 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-indigo-100 text-sm mb-6">
                            <Sparkles size={14} />
                            FREE ONLINE VOTING TOOL
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            The privacy-first platform for{' '}
                            <span className="relative">
                                <span className="text-amber-300">{typedText}</span>
                                <span className="absolute -right-1 top-0 h-full w-0.5 bg-amber-300 animate-pulse" />
                            </span>
                        </h1>

                        <p className="text-xl text-indigo-100 mb-8 max-w-lg">
                            Create polls in seconds. No signup. No email. No tracking.
                            Just instant results with privacy your voters can trust.
                        </p>

                        {/* Privacy badges */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {privacyFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                        feature.highlight
                                            ? 'bg-amber-400 text-amber-900'
                                            : 'bg-white/10 text-white backdrop-blur-sm'
                                    }`}
                                >
                                    <feature.icon size={16} />
                                    {feature.text}
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={onGetStarted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-amber-900 font-bold text-lg rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/25"
                            >
                                Create Free Poll
                                <ArrowRight size={20} />
                            </motion.button>
                            <a
                                href="#demo"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                See Demo
                            </a>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex items-center gap-6 text-indigo-200 text-sm">
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span>10,000+ polls created</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>30 sec to create</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Live Demo Poll */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative">
                            {/* Browser bar */}
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 bg-slate-100 rounded-lg px-4 py-1.5 text-sm text-slate-500 font-mono">
                                    votegenerator.com/vote/team-retreat
                                </div>
                            </div>

                            {/* Poll question */}
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                Where should we go for the team retreat?
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Vote for your favorite destination • {totalVotes} votes
                            </p>

                            {/* Poll options */}
                            <div className="space-y-3">
                                {demoOptions.map((option, i) => {
                                    const percentage = Math.round((option.votes / totalVotes) * 100);
                                    return (
                                        <motion.div
                                            key={option.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                                option.selected
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-indigo-200'
                                            }`}
                                        >
                                            {/* Progress bar background */}
                                            <div 
                                                className={`absolute inset-0 rounded-xl transition-all ${
                                                    option.selected ? 'bg-indigo-100' : 'bg-slate-50'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                            
                                            <div className="relative flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                        option.selected
                                                            ? 'border-indigo-500 bg-indigo-500'
                                                            : 'border-slate-300'
                                                    }`}>
                                                        {option.selected && (
                                                            <CheckCircle2 size={14} className="text-white" />
                                                        )}
                                                    </div>
                                                    <span className={`font-medium ${
                                                        option.selected ? 'text-indigo-700' : 'text-slate-700'
                                                    }`}>
                                                        {option.text}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-600">
                                                        {percentage}%
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        ({option.votes})
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Submit button */}
                            <button className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                                Submit Vote
                            </button>

                            {/* Privacy indicator */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                                <ShieldCheck size={16} className="text-green-500" />
                                Your vote is anonymous and secure
                            </div>
                        </div>

                        {/* Floating badges */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        >
                            ✓ No signup
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-4 -left-4 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        >
                            100% Free
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-black text-white">12</div>
                            <div className="text-indigo-200 text-sm">Poll Types</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">0</div>
                            <div className="text-indigo-200 text-sm">Emails Required</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">30s</div>
                            <div className="text-indigo-200 text-sm">To Create</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">∞</div>
                            <div className="text-indigo-200 text-sm">Free Polls</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
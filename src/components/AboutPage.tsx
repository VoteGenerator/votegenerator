import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Shield, 
    Heart,
    Sparkles,
    ArrowRight,
    CheckCircle,
    MessageCircle,
    Clock,
    Users,
    Globe,
    Rocket,
    Coffee,
    Target,
    Lightbulb,
    ThumbsUp,
    Ban,
    Mail,
    Timer
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

const AboutPage: React.FC = () => {
    const [pollsCreated, setPollsCreated] = useState(0);
    
    // Animated counter
    useEffect(() => {
        const target = 12847;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setPollsCreated(target);
                clearInterval(timer);
            } else {
                setPollsCreated(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, []);

    const antiFeatures = [
        { icon: Ban, text: "No signup walls" },
        { icon: Ban, text: "No email harvesting" },
        { icon: Ban, text: "No tracking pixels" },
        { icon: Ban, text: "No 'free trial' games" },
        { icon: Ban, text: "No dark patterns" },
        { icon: Ban, text: "No hidden fees" },
    ];

    const timeline = [
        { date: "Jan 2025", event: "Idea born from group chat frustration", emoji: "💡" },
        { date: "Feb 2025", event: "First prototype built", emoji: "🛠️" },
        { date: "Mar 2025", event: "12 poll types launched", emoji: "🚀" },
        { date: "Now", event: "You're here!", emoji: "👋" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />

            {/* Hero - Dark & Bold */}
            <div className="relative">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-950 to-purple-900/30" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-300 mb-8">
                            <Sparkles size={16} />
                            Est. 2025
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            We hate complicated
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                poll tools too.
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12">
                            So we built the one we actually wanted to use.
                        </p>

                        {/* Live Stats */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-white mb-1">
                                    {pollsCreated.toLocaleString()}+
                                </div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider">Polls Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-white mb-1">12</div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider">Poll Types</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-white mb-1">&lt;60s</div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider">To Create</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-black text-white mb-1">$0</div>
                                <div className="text-slate-500 text-sm uppercase tracking-wider">Forever Free</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* The Problem - Chat Bubbles */}
            <div className="bg-slate-900 py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                            Sound familiar?
                        </h2>
                        <p className="text-slate-400 text-center mb-12">
                            This is the conversation that started it all.
                        </p>

                        {/* Fake chat UI */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 max-w-lg mx-auto border border-slate-700">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">M</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">Where should we eat tonight?</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">S</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">idk whatever works</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">J</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">Let me create a poll...</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">J</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">Ok it wants me to create an account</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">J</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">Now it wants everyone's email??</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">M</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">Just pick pizza lol</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">S</div>
                                    <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                                        <p className="text-sm">🍕</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                                <p className="text-slate-500 text-sm italic">Pizza wins by default. Again.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* What We Don't Do - Anti-features */}
            <div className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
                <div className="relative max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                            What we <span className="line-through text-slate-500">don't</span> do
                        </h2>
                        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
                            We built VoteGenerator by removing everything annoying about other poll tools.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {antiFeatures.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <item.icon size={20} className="text-red-400" />
                                    <span className="text-slate-300 font-medium">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* What We Do Instead */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        What we do instead
                    </h2>
                    <p className="text-indigo-200 text-center mb-12">
                        Simple. Fast. Respectful.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Zap size={32} className="text-yellow-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Instant Creation</h3>
                            <p className="text-indigo-200">
                                Click, type, share. Your poll is live in under 60 seconds. No account needed.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield size={32} className="text-green-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Privacy by Default</h3>
                            <p className="text-indigo-200">
                                We don't collect emails. We don't track voters. Your data isn't our product.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Heart size={32} className="text-pink-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Actually Free</h3>
                            <p className="text-indigo-200">
                                The free tier isn't a trial. Create unlimited polls, forever. We mean it.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="py-24 bg-slate-900">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Our Story (The Short Version)
                    </h2>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                        
                        <div className="space-y-8">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-2xl z-10">
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <div className="text-indigo-400 text-sm font-medium">{item.date}</div>
                                        <div className="text-lg text-white">{item.event}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Big Feature Cards */}
            <div className="py-24 bg-slate-950">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Built Different
                    </h2>
                    <p className="text-slate-400 text-center mb-12">
                        Features that actually matter.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-indigo-500/50 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                            <Target size={40} className="text-indigo-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">12 Poll Types</h3>
                            <p className="text-slate-400 mb-4">
                                From simple multiple choice to ranked voting, priority matrices, and visual polls. 
                                Every decision type covered.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">Multiple Choice</span>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">Ranked</span>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">Dot Voting</span>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">+9 more</span>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                            <Timer size={40} className="text-purple-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Real-Time Results</h3>
                            <p className="text-slate-400 mb-4">
                                Watch votes come in live. No refreshing. Beautiful charts that update instantly 
                                as people vote.
                            </p>
                            <div className="flex items-center gap-2 text-purple-400">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                                <span className="text-sm">Live updates</span>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-green-500/50 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
                            <Globe size={40} className="text-green-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Share Anywhere</h3>
                            <p className="text-slate-400 mb-4">
                                One link works everywhere. Text it, Slack it, email it, QR code it. 
                                Works on every device, no app needed.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">📱 Mobile</span>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">💻 Desktop</span>
                                <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">📟 QR Code</span>
                            </div>
                        </motion.div>

                        {/* Card 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-pink-500/50 transition-all overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all" />
                            <Lightbulb size={40} className="text-pink-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Smart Recommendations</h3>
                            <p className="text-slate-400 mb-4">
                                Not sure which poll type to use? Our quiz asks a few questions and 
                                recommends the perfect format for your situation.
                            </p>
                            <a href="/demo.html" className="text-pink-400 text-sm font-medium hover:text-pink-300">
                                Try the quiz →
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl" />
                </div>
                
                <div className="relative max-w-3xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Ready to make decisions<br />without the drama?
                        </h2>
                        <p className="text-xl text-indigo-200 mb-8">
                            Create your first poll in under 60 seconds. Free forever.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/create.html"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-2xl"
                            >
                                <Sparkles size={20} />
                                Create Your First Poll
                                <ArrowRight size={20} />
                            </a>
                            <a
                                href="/contact.html"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                            >
                                <MessageCircle size={20} />
                                Get in Touch
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutPage;
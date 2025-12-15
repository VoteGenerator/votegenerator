import React from 'react';
import { motion } from 'framer-motion';
import { 
    Target, 
    Zap, 
    Shield, 
    Heart,
    Lightbulb,
    Users,
    MessageCircle,
    ArrowRight,
    CheckCircle,
    Sparkles
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

const AboutPage: React.FC = () => {
    const values = [
        {
            icon: Zap,
            title: 'Speed Matters',
            description: "Nobody wants to spend 10 minutes setting up a simple poll. We obsess over removing every unnecessary step so you can go from idea to shareable link in under a minute."
        },
        {
            icon: Shield,
            title: 'Respect Privacy',
            description: "We don't require accounts, we don't collect emails, and we don't track your voters. Your poll data belongs to you, period."
        },
        {
            icon: Heart,
            title: 'Keep It Free',
            description: "The core product will always be free. We believe everyone should have access to simple decision-making tools, regardless of budget."
        },
        {
            icon: Lightbulb,
            title: 'Stay Simple',
            description: "More features aren't always better. We'd rather do a few things exceptionally well than everything poorly."
        }
    ];

    const milestones = [
        { number: '2024', label: 'Founded' },
        { number: '12', label: 'Poll Types' },
        { number: '0', label: 'Accounts Required' },
        { number: '∞', label: 'Free Polls' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />

            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                
                <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                            Making Group Decisions<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Shouldn't Be This Hard
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            We got tired of complicated poll tools that required signups, sent spam emails, 
                            and took forever to set up. So we built something better.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* The Story */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">The Short Version</h2>
                    
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed">
                            It started with a simple question: "Where should we go for dinner?"
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            What followed was a 47-message group chat, three different poll links that 
                            nobody could figure out how to use, and two people who "forgot to vote." 
                            We ended up going with pizza (again) because nobody could make a decision.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Sound familiar?
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            We looked at the existing options and found the same problems everywhere: 
                            create an account here, verify your email there, wait for the "free trial" 
                            popup, figure out the confusing interface, and then pray that everyone in 
                            your group can figure out how to actually vote.
                        </p>
                        <p className="text-slate-600 leading-relaxed font-medium text-slate-800">
                            There had to be a better way.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            VoteGenerator was born from that frustration. We wanted something that just 
                            <em> works</em>. No signup walls. No email collection. No tracking pixels. 
                            Just create a poll, copy the link, and share it. Done.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Today, we're still obsessed with the same thing: making group decisions as 
                            painless as possible. Whether you're picking a restaurant, planning a company 
                            retreat, or running a serious election—we want to be the tool you reach for 
                            without thinking twice.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Milestones */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {milestones.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                                    {item.number}
                                </div>
                                <div className="text-indigo-200 font-medium">
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Believe</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        These aren't corporate buzzwords on a wall. They're the actual principles 
                        we use to make decisions every day.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {values.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <value.icon size={24} className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
                            <p className="text-slate-600">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* What Makes Us Different */}
            <div className="bg-slate-50 py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
                        What Makes Us Different
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                title: "No account required. Ever.",
                                description: "Create polls instantly. Your voters don't need to sign up either."
                            },
                            {
                                title: "Actually free, not 'free trial' free.",
                                description: "The free tier isn't a demo. It's a real product that works."
                            },
                            {
                                title: "Your data stays your data.",
                                description: "We don't sell information. We don't send marketing emails. We don't track voters."
                            },
                            {
                                title: "Built for real use cases.",
                                description: "From quick team lunches to ranked-choice elections, we've got you covered."
                            },
                            {
                                title: "Transparent pricing.",
                                description: "No hidden fees, no surprise charges, no 'contact sales' games."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4 bg-white rounded-xl p-6 border border-slate-200"
                            >
                                <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Get in Touch */}
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageCircle size={32} className="text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                        We'd Love to Hear From You
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto mb-8">
                        Got feedback? Feature requests? Just want to say hi? We read every message 
                        and actually respond to them.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact.html"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                        >
                            Get in Touch
                            <ArrowRight size={18} />
                        </a>
                        <a
                            href="/create.html"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        >
                            <Sparkles size={18} />
                            Create Your First Poll
                        </a>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutPage;
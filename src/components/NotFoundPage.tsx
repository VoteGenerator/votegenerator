// ============================================================================
// NotFoundPage.tsx - Custom 404 Page
// Location: src/components/NotFoundPage.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Home, Search, PlusCircle, HelpCircle, ArrowLeft, 
    BarChart3, Compass, Ghost, RefreshCw
} from 'lucide-react';
import PremiumNav from './PremiumNav';

const NotFoundPage: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    // Fun 404 messages
    const messages = [
        { emoji: '🔍', title: "This page played hide and seek...", subtitle: "and won." },
        { emoji: '🌌', title: "You've reached the edge of the internet", subtitle: "There's nothing here but stardust." },
        { emoji: '🗺️', title: "Looks like you took a wrong turn", subtitle: "Even GPS can't find this page." },
        { emoji: '👻', title: "This page has ghosted you", subtitle: "It's not you, it's the URL." },
        { emoji: '🚀', title: "Houston, we have a problem", subtitle: "This page has left orbit." },
    ];
    
    const [message] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

    const quickLinks = [
        { href: '/', icon: Home, label: 'Go Home', description: 'Back to the landing page' },
        { href: '/create', icon: PlusCircle, label: 'Create a Poll', description: 'Start collecting votes' },
        { href: '/admin', icon: BarChart3, label: 'My Dashboard', description: 'View your polls' },
        { href: '/templates', icon: Compass, label: 'Templates', description: 'Browse poll templates' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex flex-col overflow-hidden">
            {/* PremiumNav for paid users */}
            {tier !== 'free' && <PremiumNav tier={tier} />}
            
            <div className="flex-1 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-200 rounded-full opacity-40"
                        initial={{ 
                            x: Math.random() * window.innerWidth, 
                            y: Math.random() * window.innerHeight 
                        }}
                        animate={{ 
                            x: mousePosition.x + (Math.random() - 0.5) * 200,
                            y: mousePosition.y + (Math.random() - 0.5) * 200,
                        }}
                        transition={{ 
                            duration: 2 + Math.random() * 2,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-8 sm:p-12 text-center"
                >
                    {/* 404 Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-bold mb-6"
                    >
                        <Ghost size={16} />
                        404 - Page Not Found
                    </motion.div>

                    {/* Fun Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="text-6xl mb-4">{message.emoji}</div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                            {message.title}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {message.subtitle}
                        </p>
                    </motion.div>

                    {/* What were you looking for? */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-8">
                        <p className="text-sm text-slate-600 mb-4 flex items-center justify-center gap-2">
                            <HelpCircle size={16} />
                            Looking for a poll or survey?
                        </p>
                        <div className="text-sm text-slate-500 space-y-2">
                            <p>• If you had a poll link, it may have <strong>expired</strong> or been <strong>deleted</strong></p>
                            <p>• Check that the URL is correct (no typos!)</p>
                            <p>• The poll creator may have changed the link</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-3">
                        {quickLinks.map((link, idx) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="group p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <link.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">{link.label}</div>
                                        <div className="text-xs text-slate-500">{link.description}</div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Go back to previous page
                    </motion.button>
                </motion.div>

                {/* Footer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6 text-sm text-slate-400"
                >
                    <a href="/" className="hover:text-indigo-600 transition-colors inline-flex items-center gap-2">
                        <BarChart3 size={14} />
                        VoteGenerator
                    </a>
                    <span className="mx-2">•</span>
                    <a href="/contact" className="hover:text-indigo-600 transition-colors">
                        Report a problem
                    </a>
                </motion.div>
            </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
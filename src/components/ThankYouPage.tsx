// ============================================================================
// ThankYouPage.tsx - Beautiful completion page when results aren't shared
// Shows appreciation with confetti and optional custom message
// Location: src/components/ThankYouPage.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Sparkles, Star, Share2, Home, PartyPopper } from 'lucide-react';

interface ThankYouPageProps {
    title?: string;
    customMessage?: string;  // From poll/survey settings
    type: 'poll' | 'survey';
    showCreateCTA?: boolean;
}

// Confetti explosion component
const Confetti: React.FC = () => {
    const confetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][Math.floor(Math.random() * 6)],
        angle: Math.random() * 360,
        velocity: 5 + Math.random() * 10,
        spin: Math.random() * 720 - 360,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.5
    }));
    
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {confetti.map(c => {
                const rad = c.angle * (Math.PI / 180);
                const endX = Math.cos(rad) * c.velocity * 30;
                const endY = Math.sin(rad) * c.velocity * 30 + 100;
                
                return (
                    <motion.div
                        key={c.id}
                        className="absolute rounded-sm"
                        style={{
                            width: c.size,
                            height: c.size,
                            backgroundColor: c.color,
                            left: `${c.x}%`,
                            top: '40%'
                        }}
                        initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
                        animate={{
                            opacity: [1, 1, 0],
                            x: endX,
                            y: endY,
                            rotate: c.spin,
                            scale: [0, 1.5, 1]
                        }}
                        transition={{
                            duration: 2.5,
                            delay: c.delay,
                            ease: "easeOut"
                        }}
                    />
                );
            })}
        </div>
    );
};

// Floating hearts/stars background
const FloatingElements: React.FC = () => {
    const elements = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'heart' : 'sparkle',
        x: 10 + Math.random() * 80,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
        size: 16 + Math.random() * 12
    }));
    
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {elements.map(el => (
                <motion.div
                    key={el.id}
                    className="absolute text-indigo-200/40"
                    style={{ left: `${el.x}%`, bottom: '-10%' }}
                    animate={{
                        y: [0, -window.innerHeight - 100],
                        rotate: [0, 360],
                        opacity: [0, 0.6, 0.6, 0]
                    }}
                    transition={{
                        duration: el.duration,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {el.type === 'star' && <Star size={el.size} fill="currentColor" />}
                    {el.type === 'heart' && <Heart size={el.size} fill="currentColor" />}
                    {el.type === 'sparkle' && <Sparkles size={el.size} />}
                </motion.div>
            ))}
        </div>
    );
};

const ThankYouPage: React.FC<ThankYouPageProps> = ({ 
    title = "Thank You!",
    customMessage,
    type,
    showCreateCTA = true
}) => {
    const [showConfetti, setShowConfetti] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    
    const defaultMessage = type === 'survey' 
        ? "Your responses have been recorded. We appreciate you taking the time to share your feedback!"
        : "Your vote has been recorded. Thank you for participating!";
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <FloatingElements />
            
            {/* Confetti */}
            {showConfetti && <Confetti />}
            
            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-lg w-full"
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
                        
                        {/* Success icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </motion.div>
                        </motion.div>
                        
                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            {title}
                        </motion.h1>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-1 text-white/80"
                        >
                            <PartyPopper size={18} />
                            <span className="text-sm font-medium">
                                {type === 'survey' ? 'Survey Completed' : 'Vote Recorded'}
                            </span>
                        </motion.div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-8">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-slate-600 text-center text-lg leading-relaxed mb-8"
                        >
                            {customMessage || defaultMessage}
                        </motion.p>
                        
                        {/* Appreciation box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6"
                        >
                            <div className="flex items-center justify-center gap-3 text-indigo-600">
                                <Heart size={20} fill="currentColor" />
                                <span className="font-medium">Your input makes a difference</span>
                                <Heart size={20} fill="currentColor" />
                            </div>
                        </motion.div>
                        
                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-3"
                        >
                            {showCreateCTA && (
                                <a
                                    href="/"
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Sparkles size={20} />
                                    Create Your Own {type === 'survey' ? 'Survey' : 'Poll'}
                                </a>
                            )}
                            
                            <a
                                href="/"
                                className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <Home size={18} />
                                Go to Homepage
                            </a>
                        </motion.div>
                    </div>
                </div>
                
                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-slate-400 text-sm mt-6"
                >
                    Powered by VoteGenerator
                </motion.p>
            </motion.div>
        </div>
    );
};

export default ThankYouPage;
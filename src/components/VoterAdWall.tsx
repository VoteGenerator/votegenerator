// ============================================================================
// VoterAdWall.tsx - Premium Ad interstitial with animated charts & features
// Shows: Before viewing poll AND after voting (before results)
// Location: src/components/VoterAdWall.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Zap, Check, ArrowRight, Crown,
    BarChart3, Users, TrendingUp, Sparkles,
    PieChart, Shield, Palette, Download, Eye
} from 'lucide-react';

interface VoterAdWallProps {
    variant: 'before-poll' | 'after-vote';
    pollTitle?: string;
    onComplete: () => void;
    countdownSeconds?: number;
}

// Animated Bar Chart Component
const AnimatedBarChart: React.FC = () => {
    const bars = [
        { label: 'Mon', value: 45, color: 'from-indigo-500 to-purple-500' },
        { label: 'Tue', value: 72, color: 'from-purple-500 to-pink-500' },
        { label: 'Wed', value: 58, color: 'from-pink-500 to-rose-500' },
        { label: 'Thu', value: 89, color: 'from-amber-500 to-orange-500' },
        { label: 'Fri', value: 95, color: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="flex items-end justify-between gap-2 h-32 px-2">
            {bars.map((bar, idx) => (
                <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                        className={`w-full bg-gradient-to-t ${bar.color} rounded-t-lg relative overflow-hidden`}
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.value}%` }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ delay: 1.5 + idx * 0.1, duration: 1 }}
                        />
                    </motion.div>
                    <span className="text-[10px] text-white/50">{bar.label}</span>
                </div>
            ))}
        </div>
    );
};

// Animated Donut Chart Component
const AnimatedDonutChart: React.FC = () => {
    const segments = [
        { value: 45, color: '#6366f1' },
        { value: 30, color: '#ec4899' },
        { value: 25, color: '#10b981' },
    ];
    
    let currentAngle = 0;
    
    return (
        <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {segments.map((segment, idx) => {
                    const angle = (segment.value / 100) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;
                    
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = ((startAngle + angle) * Math.PI) / 180;
                    
                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    return (
                        <motion.path
                            key={idx}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={segment.color}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + idx * 0.2, duration: 0.5 }}
                        />
                    );
                })}
                {/* Center hole */}
                <circle cx="50" cy="50" r="25" fill="#0f172a" />
            </svg>
            {/* Center icon */}
            <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
            >
                <PieChart size={20} className="text-white/60" />
            </motion.div>
        </div>
    );
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, [value]);
    
    return <span>{count.toLocaleString()}{suffix}</span>;
};

// Feature Card Component
const FeatureCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    desc: string; 
    delay: number;
    gradient: string;
}> = ({ icon, title, desc, delay, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-colors"
    >
        <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-2`}>
            {icon}
        </div>
        <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-white/50 text-xs">{desc}</p>
    </motion.div>
);

// Live Stats Ticker
const LiveStatsTicker: React.FC = () => {
    const stats = [
        { icon: <Users size={12} />, text: '2.4M+ votes collected' },
        { icon: <BarChart3 size={12} />, text: '150K+ polls created' },
        { icon: <TrendingUp size={12} />, text: '99.9% uptime' },
    ];
    
    return (
        <motion.div 
            className="flex items-center gap-4 justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
        >
            {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-white/40 text-xs">
                    {stat.icon}
                    <span>{stat.text}</span>
                </div>
            ))}
        </motion.div>
    );
};

const VoterAdWall: React.FC<VoterAdWallProps> = ({ 
    variant, 
    pollTitle,
    onComplete,
    countdownSeconds = 10
}) => {
    const [countdown, setCountdown] = useState(countdownSeconds);
    const [canSkip, setCanSkip] = useState(false);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanSkip(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const handleContinue = () => {
        onComplete();
    };

    const isBeforePoll = variant === 'before-poll';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[120px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[120px]"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px]"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
            </div>
            
            <div className="max-w-2xl w-full relative z-10">
                {/* Header with countdown */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    {/* Countdown Circle */}
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="6"
                            />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="url(#countdownGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: "283 283", strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: 283 - (283 * (countdownSeconds - countdown) / countdownSeconds) }}
                                transition={{ duration: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#ec4899" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-white">
                                {canSkip ? <Check size={24} /> : countdown}
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {isBeforePoll ? 'Loading Your Poll 📊' : 'Vote Recorded! ✓'}
                    </h1>
                    <p className="text-white/60">
                        {isBeforePoll ? 'Preparing your experience...' : 'Results coming up...'}
                    </p>
                </motion.div>
                
                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6 overflow-hidden relative"
                >
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 -z-10" />
                    
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left - Animated Charts */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mb-4"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <TrendingUp size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Response Analytics</h3>
                                        <p className="text-white/40 text-xs">Real-time insights with Pro</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <AnimatedBarChart />
                                </div>
                            </motion.div>
                            
                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-3 text-center border border-indigo-500/20"
                                >
                                    <div className="text-2xl font-black text-white mb-0.5">
                                        <AnimatedCounter value={1247} />
                                    </div>
                                    <div className="text-white/50 text-xs">Responses</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-3 text-center border border-emerald-500/20"
                                >
                                    <div className="text-2xl font-black text-white mb-0.5">
                                        <AnimatedCounter value={89} suffix="%" />
                                    </div>
                                    <div className="text-white/50 text-xs">Completion</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-3 text-center border border-amber-500/20"
                                >
                                    <div className="text-2xl font-black text-white mb-0.5">
                                        <AnimatedCounter value={42} suffix="s" />
                                    </div>
                                    <div className="text-white/50 text-xs">Avg. Time</div>
                                </motion.div>
                            </div>
                        </div>
                        
                        {/* Right - Features & CTA */}
                        <div className="lg:w-72">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center mb-4"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-3">
                                    <Crown size={14} className="text-amber-400" />
                                    <span className="text-amber-300 text-xs font-bold">UNLOCK PRO</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">Get More Insights</h3>
                                <p className="text-white/50 text-sm">Upgrade for powerful analytics</p>
                            </motion.div>
                            
                            {/* Feature Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <FeatureCard
                                    icon={<BarChart3 size={14} className="text-white" />}
                                    title="Analytics"
                                    desc="Deep insights"
                                    delay={0.9}
                                    gradient="from-indigo-500 to-purple-500"
                                />
                                <FeatureCard
                                    icon={<Shield size={14} className="text-white" />}
                                    title="No Ads"
                                    desc="Clean experience"
                                    delay={1.0}
                                    gradient="from-emerald-500 to-teal-500"
                                />
                                <FeatureCard
                                    icon={<Palette size={14} className="text-white" />}
                                    title="Branding"
                                    desc="Custom themes"
                                    delay={1.1}
                                    gradient="from-pink-500 to-rose-500"
                                />
                                <FeatureCard
                                    icon={<Download size={14} className="text-white" />}
                                    title="Export"
                                    desc="CSV, PDF, PNG"
                                    delay={1.2}
                                    gradient="from-amber-500 to-orange-500"
                                />
                            </div>
                            
                            {/* CTA Button */}
                            <motion.a
                                href="/pricing"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="block w-full py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all text-center relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Zap size={18} />
                                    Upgrade to Pro
                                </span>
                                {/* Shimmer */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
                
                {/* Live Stats */}
                <LiveStatsTicker />
                
                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-6"
                >
                    <motion.button
                        onClick={handleContinue}
                        disabled={!canSkip}
                        whileHover={canSkip ? { scale: 1.02 } : {}}
                        whileTap={canSkip ? { scale: 0.98 } : {}}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 mx-auto ${
                            canSkip 
                                ? 'bg-white text-slate-900 hover:shadow-xl shadow-lg' 
                                : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                        }`}
                    >
                        {canSkip ? (
                            <>
                                <Eye size={20} />
                                {isBeforePoll ? 'View Poll' : 'See Results'}
                                <ArrowRight size={20} />
                            </>
                        ) : (
                            <>
                                <Clock size={20} />
                                {isBeforePoll ? `View poll in ${countdown}s` : `Results in ${countdown}s`}
                            </>
                        )}
                    </motion.button>
                </motion.div>
                
                {/* Powered by */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-center mt-6"
                >
                    <a 
                        href="https://votegenerator.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-xs transition"
                    >
                        <img 
                            src="/logo.svg" 
                            alt="" 
                            className="w-4 h-4 opacity-50"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        Powered by VoteGenerator
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default VoterAdWall;
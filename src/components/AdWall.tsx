// ============================================================================
// AdWall.tsx - Premium Ad interstitial with animated charts & features
// For poll CREATORS (free tier) before accessing dashboard
// Location: src/components/AdWall.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock, Zap, Crown, Check, ArrowRight,
    BarChart3, TrendingUp, Shield, Palette, 
    Download, Users, Infinity, Eye, Sparkles,
    LineChart, PieChart
} from 'lucide-react';

// Animated Line Chart Component
const AnimatedLineChart: React.FC = () => {
    const points = [20, 45, 35, 60, 50, 75, 65, 90, 80, 95];
    const width = 280;
    const height = 100;
    const padding = 10;
    
    const xStep = (width - padding * 2) / (points.length - 1);
    const yScale = (height - padding * 2) / 100;
    
    const pathData = points
        .map((point, i) => {
            const x = padding + i * xStep;
            const y = height - padding - point * yScale;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
    
    const areaPath = `${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return (
        <div className="relative">
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                    <line
                        key={y}
                        x1={padding}
                        y1={height - padding - y * yScale}
                        x2={width - padding}
                        y2={height - padding - y * yScale}
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="4 4"
                    />
                ))}
                
                {/* Gradient area fill */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                
                {/* Area fill */}
                <motion.path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                />
                
                {/* Main line */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Animated dot at end */}
                <motion.circle
                    cx={width - padding}
                    cy={height - padding - points[points.length - 1] * yScale}
                    r="6"
                    fill="#f59e0b"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ delay: 2, duration: 0.5 }}
                />
                <motion.circle
                    cx={width - padding}
                    cy={height - padding - points[points.length - 1] * yScale}
                    r="12"
                    fill="#f59e0b"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: [0, 2, 2.5], opacity: [0.5, 0.2, 0] }}
                    transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
                />
            </svg>
            
            {/* Growth indicator */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="absolute top-0 right-0 flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-bold"
            >
                <TrendingUp size={12} />
                +127%
            </motion.div>
        </div>
    );
};

// Animated Pie Segments
const AnimatedPieChart: React.FC = () => {
    const segments = [
        { value: 40, color: '#6366f1', label: 'Desktop' },
        { value: 35, color: '#ec4899', label: 'Mobile' },
        { value: 25, color: '#10b981', label: 'Tablet' },
    ];
    
    return (
        <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                        let currentAngle = 0;
                        return segments.map((segment, idx) => {
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
                                    transition={{ delay: 1 + idx * 0.15, duration: 0.4 }}
                                />
                            );
                        });
                    })()}
                    <circle cx="50" cy="50" r="20" fill="#0f172a" />
                </svg>
            </div>
            <div className="space-y-1">
                {segments.map((seg, idx) => (
                    <motion.div 
                        key={idx}
                        className="flex items-center gap-2 text-xs"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + idx * 0.1 }}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-white/60">{seg.label}</span>
                        <span className="text-white font-bold">{seg.value}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Animated Counter
const AnimatedCounter: React.FC<{ value: number; suffix?: string; prefix?: string }> = ({ 
    value, suffix = '', prefix = '' 
}) => {
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
    
    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Feature Pill
const FeaturePill: React.FC<{ 
    icon: React.ReactNode; 
    text: string; 
    delay: number;
}> = ({ icon, text, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10"
    >
        <div className="text-emerald-400">{icon}</div>
        <span className="text-white/80 text-sm font-medium">{text}</span>
    </motion.div>
);

const AdWall: React.FC = () => {
    const [countdown, setCountdown] = useState(5);
    const [canSkip, setCanSkip] = useState(false);
    
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || '/admin';
    
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
        window.location.href = decodeURIComponent(redirectUrl);
    };
    
    const handleUpgrade = () => {
        window.location.href = '/pricing';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-indigo-500/20 rounded-full blur-[150px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-purple-500/20 rounded-full blur-[150px]"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
                <motion.div 
                    className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"
                    animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </div>
            
            <div className="max-w-5xl w-full relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    {/* Countdown */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="url(#timerGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 0 }}
                                animate={{ strokeDashoffset: 283 - (283 * (5 - countdown) / 5) }}
                                transition={{ duration: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#ec4899" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-white">
                                {canSkip ? <Check size={28} /> : countdown}
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                        Your Poll is Ready! 🎉
                    </h1>
                    <p className="text-white/60">
                        Discover what Pro can do for your polls
                    </p>
                </motion.div>
                
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid lg:grid-cols-2 gap-6 mb-8"
                >
                    {/* Left - Charts Showcase */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <LineChart size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Real-Time Analytics</h3>
                                <p className="text-white/50 text-sm">Track responses as they come in</p>
                            </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <AnimatedLineChart />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <AnimatedPieChart />
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8 }}
                                className="text-right"
                            >
                                <div className="text-3xl font-black text-white">
                                    <AnimatedCounter value={2847} />
                                </div>
                                <div className="text-white/50 text-sm">Total Responses</div>
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* Right - Features & CTA */}
                    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-pink-500/10 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center mb-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-4">
                                <Crown size={16} className="text-amber-400" />
                                <span className="text-amber-300 text-sm font-bold">UPGRADE TO PRO</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Unlock Full Potential</h2>
                            <p className="text-white/60">Everything you need to run professional polls</p>
                        </motion.div>
                        
                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <FeaturePill icon={<Check size={14} />} text="Unlimited Polls" delay={0.6} />
                            <FeaturePill icon={<Check size={14} />} text="No Ads" delay={0.7} />
                            <FeaturePill icon={<Check size={14} />} text="Advanced Analytics" delay={0.8} />
                            <FeaturePill icon={<Check size={14} />} text="Custom Branding" delay={0.9} />
                            <FeaturePill icon={<Check size={14} />} text="Export Data" delay={1.0} />
                            <FeaturePill icon={<Check size={14} />} text="Priority Support" delay={1.1} />
                        </div>
                        
                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="grid grid-cols-3 gap-3 mb-6"
                        >
                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                <div className="text-xl font-black text-white">
                                    <AnimatedCounter value={10} suffix="K" />
                                </div>
                                <div className="text-white/40 text-xs">Responses/mo</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                <div className="text-xl font-black text-white flex items-center justify-center gap-1">
                                    <Infinity size={20} />
                                </div>
                                <div className="text-white/40 text-xs">Polls</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                <div className="text-xl font-black text-white">15+</div>
                                <div className="text-white/40 text-xs">Themes</div>
                            </div>
                        </motion.div>
                        
                        {/* CTA */}
                        <motion.button
                            onClick={handleUpgrade}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Zap size={20} />
                                View Plans
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                        </motion.button>
                    </div>
                </motion.div>
                
                {/* Skip Notice & Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    {!canSkip && (
                        <motion.div 
                            className="inline-flex items-center gap-2 text-white/60 text-sm mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Sparkles size={14} className="text-amber-400" />
                            <span>Skip the wait -</span>
                            <button 
                                onClick={handleUpgrade}
                                className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2"
                            >
                                Upgrade to Pro
                            </button>
                            <span>for instant access!</span>
                        </motion.div>
                    )}
                    
                    <motion.button
                        onClick={handleContinue}
                        disabled={!canSkip}
                        whileHover={canSkip ? { scale: 1.02 } : {}}
                        whileTap={canSkip ? { scale: 0.98 } : {}}
                        className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 mx-auto ${
                            canSkip 
                                ? 'bg-white text-slate-900 hover:shadow-2xl shadow-lg' 
                                : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/10'
                        }`}
                    >
                        {canSkip ? (
                            <>
                                <Eye size={22} />
                                Continue to Dashboard
                                <ArrowRight size={22} />
                            </>
                        ) : (
                            <>
                                <Clock size={22} />
                                Wait {countdown}s to continue
                            </>
                        )}
                    </motion.button>
                    
                    {canSkip && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/40 text-sm mt-4"
                        >
                            Your poll dashboard is ready
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdWall;
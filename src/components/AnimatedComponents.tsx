// ============================================================================
// AnimatedComponents.tsx - Vote counter and success animations
// Location: src/components/AnimatedComponents.tsx
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Check, PartyPopper, Sparkles } from 'lucide-react';

// ============================================================================
// ANIMATED VOTE COUNTER
// Smoothly animates between number values with spring physics
// ============================================================================

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 0.5,
    className = '',
    prefix = '',
    suffix = ''
}) => {
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
        duration: duration * 1000
    });
    
    const displayValue = useTransform(springValue, (latest) => 
        Math.round(latest).toLocaleString()
    );
    
    const [display, setDisplay] = useState(value.toLocaleString());
    
    useEffect(() => {
        springValue.set(value);
        
        const unsubscribe = displayValue.on('change', (v) => {
            setDisplay(v);
        });
        
        return () => unsubscribe();
    }, [value, springValue, displayValue]);
    
    return (
        <span className={className}>
            {prefix}{display}{suffix}
        </span>
    );
};

// ============================================================================
// VOTE SUCCESS ANIMATION
// Celebratory animation when vote is submitted
// ============================================================================

interface VoteSuccessAnimationProps {
    show: boolean;
    onComplete?: () => void;
    message?: string;
}

export const VoteSuccessAnimation: React.FC<VoteSuccessAnimationProps> = ({
    show,
    onComplete,
    message = 'Vote Submitted!'
}) => {
    useEffect(() => {
        if (show && onComplete) {
            const timer = setTimeout(onComplete, 2500);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);
    
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
                    >
                        {/* Animated checkmark */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                            >
                                <Check size={40} className="text-emerald-600" strokeWidth={3} />
                            </motion.div>
                        </motion.div>
                        
                        {/* Message */}
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl font-bold text-slate-800 mb-2"
                        >
                            {message}
                        </motion.h2>
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-slate-500"
                        >
                            Thank you for participating
                        </motion.p>
                        
                        {/* Confetti particles */}
                        <ConfettiParticles />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Confetti particles
const ConfettiParticles: React.FC = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * -200 - 50,
        rotation: Math.random() * 360,
        color: ['#818cf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'][Math.floor(Math.random() * 5)]
    }));
    
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(({ id, x, y, rotation, color }) => (
                <motion.div
                    key={id}
                    initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 1, 
                        scale: 0,
                        rotate: 0 
                    }}
                    animate={{ 
                        x, 
                        y: y + 300, 
                        opacity: 0, 
                        scale: 1,
                        rotate: rotation 
                    }}
                    transition={{ 
                        duration: 1.5 + Math.random(), 
                        delay: Math.random() * 0.3,
                        ease: 'easeOut'
                    }}
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
};

// ============================================================================
// PULSE INDICATOR
// Animated pulse for live status indicators
// ============================================================================

interface PulseIndicatorProps {
    color?: 'green' | 'amber' | 'red' | 'blue';
    size?: 'sm' | 'md' | 'lg';
}

export const PulseIndicator: React.FC<PulseIndicatorProps> = ({
    color = 'green',
    size = 'md'
}) => {
    const colors = {
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500'
    };
    
    const ringColors = {
        green: 'bg-emerald-400',
        amber: 'bg-amber-400',
        red: 'bg-red-400',
        blue: 'bg-blue-400'
    };
    
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };
    
    return (
        <span className="relative flex">
            <span 
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ringColors[color]} opacity-75`}
            />
            <span className={`relative inline-flex rounded-full ${sizes[size]} ${colors[color]}`} />
        </span>
    );
};

// ============================================================================
// SKELETON LOADER
// Loading placeholder with shimmer effect
// ============================================================================

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height
}) => {
    const baseClass = 'animate-pulse bg-slate-200';
    
    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };
    
    return (
        <div
            className={`${baseClass} ${variantClasses[variant]} ${className}`}
            style={{
                width: width || (variant === 'circular' ? '40px' : '100%'),
                height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '100px')
            }}
        />
    );
};

// ============================================================================
// NUMBER TICKER
// Slot machine style number animation
// ============================================================================

interface NumberTickerProps {
    value: number;
    className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({ value, className = '' }) => {
    const digits = value.toString().split('');
    
    return (
        <div className={`inline-flex overflow-hidden ${className}`}>
            {digits.map((digit, index) => (
                <motion.span
                    key={`${index}-${digit}`}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20
                    }}
                    className="inline-block tabular-nums"
                >
                    {digit}
                </motion.span>
            ))}
        </div>
    );
};

// ============================================================================
// PROGRESS RING
// Circular progress indicator
// ============================================================================

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
    color?: string;
    showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 60,
    strokeWidth = 4,
    className = '',
    color = '#6366f1',
    showPercentage = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="#e2e8f0"
                    fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference
                    }}
                />
            </svg>
            {showPercentage && (
                <span className="absolute text-sm font-semibold text-slate-700">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
};

export default {
    AnimatedCounter,
    VoteSuccessAnimation,
    PulseIndicator,
    Skeleton,
    NumberTicker,
    ProgressRing
};
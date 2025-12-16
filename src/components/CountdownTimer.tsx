import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { isPromoActive, getPromoSettings } from './promoConfig';

interface CountdownTimerProps {
    storageKey?: string;
    durationHours?: number;
    resetChance?: number; // 0-1, chance to reset when expired
    onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = (props) => {
    // Get promo settings with prop overrides
    const promoSettings = getPromoSettings();
    const storageKey = props.storageKey || promoSettings.storageKey;
    const durationHours = props.durationHours || promoSettings.durationHours;
    const resetChance = props.resetChance ?? promoSettings.resetChance;
    const onExpire = props.onExpire;
    
    const [timeLeft, setTimeLeft] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    // Check if promo is enabled
    const promoEnabled = isPromoActive();

    useEffect(() => {
        // If promo is disabled, don't show countdown
        if (!promoEnabled) {
            setTimeLeft(null);
            return;
        }

        // Get or set the start time
        const getStartTime = (): number => {
            const stored = localStorage.getItem(storageKey);
            
            if (stored) {
                const startTime = parseInt(stored, 10);
                const endTime = startTime + (durationHours * 60 * 60 * 1000);
                
                // Check if expired
                if (Date.now() > endTime) {
                    // Randomly decide to reset
                    if (Math.random() < resetChance) {
                        const newStart = Date.now();
                        localStorage.setItem(storageKey, newStart.toString());
                        return newStart;
                    } else {
                        // Keep showing as expired for this session
                        return startTime;
                    }
                }
                return startTime;
            } else {
                // First visit - set start time
                const now = Date.now();
                localStorage.setItem(storageKey, now.toString());
                return now;
            }
        };

        const startTime = getStartTime();
        const endTime = startTime + (durationHours * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                setIsExpired(true);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                if (onExpire) onExpire();
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        // Initial update
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [storageKey, durationHours, resetChance, onExpire, promoEnabled]);

    // Don't render if promo disabled or no time left
    if (!promoEnabled || !timeLeft) return null;

    const formatNumber = (n: number) => n.toString().padStart(2, '0');

    if (isExpired) {
        return (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock size={14} />
                <span>Offer expired</span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg px-3 py-2 text-white">
            <div className="flex items-center gap-2">
                <Zap size={14} className="text-yellow-300 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wide">Limited Time</span>
            </div>
            <div className="flex items-center gap-1 mt-1 font-mono font-bold text-lg">
                <span className="bg-white/20 rounded px-1.5 py-0.5">{formatNumber(timeLeft.hours)}</span>
                <span className="text-white/70">:</span>
                <span className="bg-white/20 rounded px-1.5 py-0.5">{formatNumber(timeLeft.minutes)}</span>
                <span className="text-white/70">:</span>
                <span className="bg-white/20 rounded px-1.5 py-0.5">{formatNumber(timeLeft.seconds)}</span>
            </div>
        </div>
    );
};

// Inline countdown for pricing cards
export const InlineCountdown: React.FC<CountdownTimerProps> = (props) => {
    // Get promo settings with prop overrides
    const promoSettings = getPromoSettings();
    const storageKey = props.storageKey || promoSettings.storageKey;
    const durationHours = props.durationHours || promoSettings.durationHours;
    const resetChance = props.resetChance ?? promoSettings.resetChance;
    
    const [timeLeft, setTimeLeft] = useState<{
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    // Check if promo is enabled
    const promoEnabled = isPromoActive();

    useEffect(() => {
        // If promo is disabled, don't show countdown
        if (!promoEnabled) {
            setTimeLeft(null);
            return;
        }

        const getStartTime = (): number => {
            const stored = localStorage.getItem(storageKey);
            
            if (stored) {
                const startTime = parseInt(stored, 10);
                const endTime = startTime + (durationHours * 60 * 60 * 1000);
                
                if (Date.now() > endTime) {
                    if (Math.random() < resetChance) {
                        const newStart = Date.now();
                        localStorage.setItem(storageKey, newStart.toString());
                        return newStart;
                    }
                    return startTime;
                }
                return startTime;
            } else {
                const now = Date.now();
                localStorage.setItem(storageKey, now.toString());
                return now;
            }
        };

        const startTime = getStartTime();
        const endTime = startTime + (durationHours * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                setTimeLeft(null);
                return;
            }

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [storageKey, durationHours, resetChance, promoEnabled]);

    // Don't render if promo disabled or expired
    if (!promoEnabled || !timeLeft) return null;

    const formatNumber = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            <Zap size={12} className="text-red-500" />
            <span className="font-mono">
                {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </span>
            <span>left</span>
        </div>
    );
};

export default CountdownTimer;
// ============================================================================
// CheckoutSuccess - Handles Stripe redirect after successful payment
// Uses SAME token formula as webhook to ensure email link works
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Copy, Check, ExternalLink, AlertTriangle,
    Crown, Zap, Star, Calendar, ArrowRight, Sparkles, Loader2
} from 'lucide-react';

type Tier = 'starter' | 'pro_event' | 'unlimited';

// ============================================================================
// SAME TOKEN FORMULA AS WEBHOOK - MUST MATCH!
// ============================================================================
function generateDashboardToken(sessionId: string): string {
    return `vg_${sessionId.replace('cs_', '').substring(0, 32)}`;
}

const TIER_CONFIG: Record<Tier, {
    label: string;
    icon: typeof Star;
    gradient: string;
    maxPolls: number;
    maxResponses: number;
    days: number;
}> = {
    starter: {
        label: 'Starter',
        icon: Zap,
        gradient: 'from-blue-500 to-indigo-600',
        maxPolls: 1,
        maxResponses: 500,
        days: 30,
    },
    pro_event: {
        label: 'Pro Event',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-600',
        maxPolls: 3,
        maxResponses: 2000,
        days: 60,
    },
    unlimited: {
        label: 'Unlimited',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        maxPolls: -1,
        maxResponses: 10000,
        days: 365,
    },
};

const CheckoutSuccess: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [tier, setTier] = useState<Tier>('starter');
    const [dashboardUrl, setDashboardUrl] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionIdParam = urlParams.get('session_id');
        const tierParam = urlParams.get('tier') as Tier | null;
        
        if (!sessionIdParam) {
            setError('Missing session information. Please contact support.');
            setIsLoading(false);
            return;
        }

        setSessionId(sessionIdParam);
        const determinedTier = tierParam && TIER_CONFIG[tierParam] ? tierParam : 'starter';
        setTier(determinedTier);
        
        // Generate SAME token as webhook uses
        const dashboardToken = generateDashboardToken(sessionIdParam);
        
        const baseUrl = window.location.origin;
        // Shorter URL - just use session_id
        const url = `${baseUrl}/admin?s=${sessionIdParam}`;
        setDashboardUrl(url);
        
        // Save to localStorage
        const expiresAt = new Date(Date.now() + TIER_CONFIG[determinedTier].days * 24 * 60 * 60 * 1000).toISOString();
        
        localStorage.setItem('vg_purchased_tier', determinedTier);
        localStorage.setItem('vg_tier_expires', expiresAt);
        localStorage.setItem('vg_dashboard_token', dashboardToken);
        localStorage.setItem('vg_session_id', sessionIdParam);
        
        const sessionData = {
            dashboardToken,
            sessionId: sessionIdParam,
            tier: determinedTier,
            expiresAt,
            polls: [],
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('vg_user_session', JSON.stringify(sessionData));
        
        setIsLoading(false);
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(dashboardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const config = TIER_CONFIG[tier];
    const TierIcon = config.icon;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
                    <p className="text-slate-600">Setting up your account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className={`bg-gradient-to-r ${config.gradient} text-white py-12`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-white" />
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-3xl md:text-4xl font-bold mb-2">
                        Payment Successful! 🎉
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/80 text-lg">
                        Welcome to VoteGenerator {config.label}
                    </motion.p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                <TierIcon size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{config.label} Plan</h2>
                                <p className="text-slate-500 text-sm">Active for {config.days} days</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div><div className="text-2xl font-bold text-slate-900">{config.maxPolls === -1 ? '∞' : config.maxPolls}</div><div className="text-xs text-slate-500">Polls</div></div>
                            <div><div className="text-2xl font-bold text-slate-900">{config.maxResponses.toLocaleString()}</div><div className="text-xs text-slate-500">Responses</div></div>
                            <div><div className="text-2xl font-bold text-slate-900">{config.days}</div><div className="text-xs text-slate-500">Days</div></div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle className="text-amber-600" size={20} /></div>
                        <div>
                            <h3 className="font-bold text-amber-900">⚠️ IMPORTANT: Save Your Dashboard Link!</h3>
                            <p className="text-amber-700 text-sm mt-1">This is your private link to manage polls. Bookmark it or copy it now!</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-amber-200 p-3 mb-3">
                        <div className="text-xs text-slate-500 mb-1">Your Dashboard Link:</div>
                        <div className="text-sm text-slate-700 break-all font-mono bg-slate-50 p-2 rounded">{dashboardUrl}</div>
                    </div>
                    <button onClick={copyLink} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied to Clipboard!' : 'Copy Dashboard Link'}
                    </button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="text-indigo-600" size={20} />What's Next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">1</div>
                            <div className="text-sm text-slate-700">Check your email for a backup of your dashboard link</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">2</div>
                            <div className="text-sm text-slate-700">Open your dashboard and create your first poll</div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">3</div>
                            <div className="text-sm text-slate-700">Share the poll link and watch votes come in!</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row gap-3 mb-8">
                    <a href={dashboardUrl} className={`flex-1 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-center hover:shadow-lg transition flex items-center justify-center gap-2`}>
                        Open My Dashboard <ArrowRight size={20} />
                    </a>
                    <a href="/" className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-center transition">Return Home</a>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
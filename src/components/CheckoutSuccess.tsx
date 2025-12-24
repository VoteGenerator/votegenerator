// ============================================================================
// CheckoutSuccess.tsx - Complete working version
// Location: src/components/CheckoutSuccess.tsx
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Crown, Zap, Sparkles, ArrowRight, Copy, Check,
    Link2, AlertCircle
} from 'lucide-react';

// Generate a unique dashboard token
const generateDashboardToken = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

// Tier configuration
const TIER_INFO: Record<string, {
    label: string;
    gradient: string;
    icon: React.ReactNode;
    activeDays: number;
    highlights: string[];
}> = {
    starter: {
        label: 'Starter',
        gradient: 'from-blue-500 to-indigo-600',
        icon: <Zap size={24} />,
        activeDays: 30,
        highlights: ['1 premium poll', '500 responses', '30 days active', 'Export to CSV']
    },
    pro_event: {
        label: 'Pro Event',
        gradient: 'from-purple-500 to-pink-500',
        icon: <Crown size={24} />,
        activeDays: 60,
        highlights: ['3 premium polls', '2,000 responses', '60 days active', 'Visual polls', 'PDF & PNG export']
    },
    unlimited: {
        label: 'Unlimited',
        gradient: 'from-amber-500 to-orange-500',
        icon: <Sparkles size={24} />,
        activeDays: 365,
        highlights: ['Unlimited polls', '5,000 responses/poll', '1 year access', 'PIN protection', 'Team tokens']
    },
};

const CheckoutSuccess: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [dashboardUrl, setDashboardUrl] = useState('');
    const [isReady, setIsReady] = useState(false);

    // Get tier from URL params
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || 'starter';
    const config = TIER_INFO[tier] || TIER_INFO.starter;

    useEffect(() => {
        // Check if we already have a session (avoid creating duplicate on page refresh)
        const existingSession = localStorage.getItem('vg_user_session');
        let token: string;
        
        if (existingSession) {
            try {
                const session = JSON.parse(existingSession);
                // If session exists and has a token, use it
                if (session.dashboardToken) {
                    token = session.dashboardToken;
                } else {
                    // Session exists but no token - add one
                    token = generateDashboardToken();
                    session.dashboardToken = token;
                    localStorage.setItem('vg_user_session', JSON.stringify(session));
                }
            } catch {
                // Invalid session, create new
                token = generateDashboardToken();
                createNewSession(token, tier, config.activeDays);
            }
        } else {
            // No session exists, create new
            token = generateDashboardToken();
            createNewSession(token, tier, config.activeDays);
        }
        
        // Store tier for other components
        localStorage.setItem('vg_purchased_tier', tier);

        // Build the dashboard URL
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/admin?token=${token}`;
        setDashboardUrl(url);
        setIsReady(true);
        
        console.log('Dashboard URL generated:', url); // Debug log
    }, [tier, config.activeDays]);

    const createNewSession = (token: string, tierName: string, days: number) => {
        const session = {
            dashboardToken: token,
            tier: tierName,
            expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
            polls: [],
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('vg_user_session', JSON.stringify(session));
    };

    const handleCopy = () => {
        if (dashboardUrl) {
            navigator.clipboard.writeText(dashboardUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const goToDashboard = () => {
        if (dashboardUrl) {
            window.location.href = dashboardUrl;
        }
    };

    if (!isReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="max-w-2xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Success Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-8 text-white text-center`}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle size={48} />
                        </motion.div>
                        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                            {config.icon}
                            <span className="font-semibold">{config.label} Plan Activated</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* CRITICAL: Save Link Warning */}
                        <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertCircle size={24} className="text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-800 text-lg mb-1">
                                        ⚠️ Save This Link Now!
                                    </h3>
                                    <p className="text-amber-700 text-sm mb-3">
                                        This is your <strong>unique dashboard URL</strong>. It's the only way to access your polls.
                                        Bookmark it or save it somewhere safe!
                                    </p>
                                    
                                    {/* The actual URL */}
                                    <div className="bg-white rounded-lg border-2 border-amber-200 p-3 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Link2 size={16} className="text-amber-500 flex-shrink-0" />
                                            <code className="text-sm text-slate-700 font-mono break-all flex-1">
                                                {dashboardUrl}
                                            </code>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={handleCopy}
                                        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                                            copied 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={20} />
                                                Copied to Clipboard!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={20} />
                                                Copy Dashboard Link
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* What's Included */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-indigo-600" />
                                What's Included
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {config.highlights.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Receipt Note */}
                        <div className="mb-8 p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-600 text-center">
                                📧 A receipt has been sent by Stripe to your email.
                            </p>
                        </div>

                        {/* Go to Dashboard Button */}
                        <button
                            onClick={goToDashboard}
                            className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-lg transition`}
                        >
                            Go to My Dashboard
                            <ArrowRight size={22} />
                        </button>

                        {/* Lost Link Recovery Note */}
                        <p className="text-center text-sm text-slate-400 mt-6">
                            Lost your link later?{' '}
                            <a href="/recover" className="text-indigo-600 hover:underline">
                                Recover it here
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
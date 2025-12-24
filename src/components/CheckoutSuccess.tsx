// ============================================================================
// CheckoutSuccess - Updated with all fixes
// - Correct poll limits per tier
// - Shows actual dashboard link to save
// - No false email confirmation claim
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, Crown, Zap, Sparkles, ArrowRight, Copy, Check,
    Calendar, BarChart3, Users, Image, FileText, Download, Link2,
    AlertCircle
} from 'lucide-react';

// Tier configuration - must match AdminDashboard
const TIER_CONFIG: Record<string, {
    label: string;
    tagline: string;
    gradient: string;
    icon: React.ReactNode;
    maxPolls: number;
    maxResponses: number;
    activeDays: number;
    pollTypes: number;
    highlights: string[];
}> = {
    starter: {
        label: 'Starter',
        tagline: 'For your next event',
        gradient: 'from-blue-500 to-indigo-600',
        icon: <Zap size={24} />,
        maxPolls: 1,
        maxResponses: 500,
        activeDays: 30,
        pollTypes: 6,
        highlights: [
            '1 premium poll',
            '500 responses',
            '30 days active',
            'Export to CSV',
        ]
    },
    pro_event: {
        label: 'Pro Event',
        tagline: 'For important events',
        gradient: 'from-purple-500 to-pink-500',
        icon: <Crown size={24} />,
        maxPolls: 3,
        maxResponses: 2000,
        activeDays: 60,
        pollTypes: 7,
        highlights: [
            '3 premium polls',
            '2,000 responses',
            '60 days active',
            'Visual polls included',
            'Export PDF & PNG',
            'Remove VG branding',
        ]
    },
    unlimited: {
        label: 'Unlimited',
        tagline: 'For power users',
        gradient: 'from-amber-500 to-orange-500',
        icon: <Sparkles size={24} />,
        maxPolls: Infinity,
        maxResponses: 5000,
        activeDays: 365,
        pollTypes: 7,
        highlights: [
            'Unlimited premium polls',
            '5,000 responses per poll',
            '1 year access',
            'All features included',
            'Upload your logo',
            'Priority support',
        ]
    },
};

const CheckoutSuccess: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [dashboardUrl, setDashboardUrl] = useState('');

    // Get tier from URL params
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || 'starter';
    const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;

    useEffect(() => {
        // Create session and generate dashboard URL
        const session = {
            tier,
            expiresAt: new Date(Date.now() + config.activeDays * 24 * 60 * 60 * 1000).toISOString(),
            polls: [],
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('vg_user_session', JSON.stringify(session));
        localStorage.setItem('vg_purchased_tier', tier);

        // Generate dashboard URL
        const url = `${window.location.origin}/admin`;
        setDashboardUrl(url);
    }, [tier, config.activeDays]);

    const handleCopy = () => {
        navigator.clipboard.writeText(dashboardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const goToDashboard = () => {
        window.location.href = '/admin';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
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
                    <p className="text-white/80">Welcome to VoteGenerator {config.label} 🎉</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Plan Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-white`}>
                                {config.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{config.label} Plan</h3>
                                <p className="text-sm text-slate-500">{config.tagline}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {config.highlights.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IMPORTANT: Save Dashboard Link */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-bold text-amber-800 mb-1">
                                    Save Your Dashboard Link!
                                </h4>
                                <p className="text-sm text-amber-700 mb-3">
                                    This is the only way to access your polls. Bookmark it or copy it now!
                                </p>
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-amber-200">
                                    <Link2 size={14} className="text-amber-500 flex-shrink-0" />
                                    <code className="text-xs text-amber-700 font-mono flex-1 truncate">
                                        {dashboardUrl}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 hover:bg-amber-100 rounded transition flex-shrink-0"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-amber-600" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiration Info */}
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
                        <Calendar size={16} />
                        <span>
                            Your plan is active for {config.activeDays} days
                            (until {new Date(Date.now() + config.activeDays * 24 * 60 * 60 * 1000).toLocaleDateString()})
                        </span>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={goToDashboard}
                        className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2`}
                    >
                        Go to My Dashboard
                        <ArrowRight size={20} />
                    </button>

                    {/* Note about receipts */}
                    <p className="text-center text-xs text-slate-400 mt-4">
                        A receipt has been sent to your email by Stripe.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutSuccess;
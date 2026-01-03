// ============================================================================
// CheckoutSuccess - Success page after Stripe subscription checkout
// Route: /checkout/success
// Uses /logo.svg from public folder
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, ArrowRight, Loader2, Zap, Crown, Check, Calendar,
    LayoutDashboard
} from 'lucide-react';

// Simple header for success page (no nav distractions)
const SuccessHeader: React.FC = () => (
    <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
                <img 
                    src="/logo.svg" 
                    alt="VoteGenerator" 
                    className="h-8 w-8"
                />
                <span className="text-xl font-bold text-slate-900">VoteGenerator</span>
            </a>
        </div>
    </header>
);

// Plan details for display
const PLAN_DETAILS: Record<string, {
    name: string;
    icon: React.ElementType;
    color: string;
    features: string[];
}> = {
    'pro': {
        name: 'Pro',
        icon: Zap,
        color: 'from-indigo-500 to-blue-600',
        features: [
            'Unlimited polls',
            '5,000 responses/month',
            'All 8 poll types',
            'Remove VoteGenerator badge',
            'PIN code protection',
            'Export CSV & Excel',
            'All premium themes',
            'Email support'
        ]
    },
    'business': {
        name: 'Business',
        icon: Crown,
        color: 'from-violet-500 to-purple-600',
        features: [
            'Unlimited polls',
            '50,000 responses/month',
            'All 8 poll types',
            'Upload custom logo',
            'PDF reports',
            'Advanced analytics',
            'IP filtering',
            'Priority support'
        ]
    }
};

const CheckoutSuccess: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tier, setTier] = useState<string | null>(null);
    const [billing, setBilling] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tierParam = params.get('tier');
        const billingParam = params.get('billing');
        
        setTier(tierParam);
        setBilling(billingParam);
        
        // Store subscription info
        if (tierParam) {
            localStorage.setItem('vg_subscription_tier', tierParam);
            localStorage.setItem('vg_subscription_billing', billingParam || 'annual');
            localStorage.setItem('vg_subscribed_at', new Date().toISOString());
        }
        
        setLoading(false);
    }, []);

    const goToDashboard = () => {
        window.location.href = '/dashboard';
    };

    const planDetails = tier ? PLAN_DETAILS[tier] : null;
    const Icon = planDetails?.icon || Zap;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-600">Confirming your subscription...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <SuccessHeader />

            <div className="max-w-2xl mx-auto px-4 py-16">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-slate-900 mb-2"
                    >
                        Welcome to VoteGenerator {planDetails?.name}! 🎉
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-600"
                    >
                        Your subscription is now active. Let's create some amazing polls!
                    </motion.p>
                </motion.div>

                {/* Plan Details Card */}
                {planDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-6"
                    >
                        <div className={`bg-gradient-to-r ${planDetails.color} p-6 text-white`}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{planDetails.name} Plan</h2>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Calendar size={16} />
                                        <span>Billed {billing === 'annual' ? 'annually' : 'monthly'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="font-semibold text-slate-800 mb-3">What's included:</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                                {planDetails.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button - Go to Dashboard */}
                            <button
                                type="button"
                                onClick={goToDashboard}
                                className={`w-full py-4 bg-gradient-to-r ${planDetails.color} text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                            >
                                <LayoutDashboard size={20} />
                                Go to Dashboard
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Fallback if no plan detected */}
                {!planDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 text-center"
                    >
                        <p className="text-slate-600 mb-6">
                            Your subscription is active. A confirmation email has been sent.
                        </p>
                        <button
                            type="button"
                            onClick={goToDashboard}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            <LayoutDashboard size={20} />
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}

                {/* Manage Subscription Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-slate-50 rounded-xl p-4 text-center"
                >
                    <p className="text-slate-600 text-sm">
                        Manage your subscription anytime from the{' '}
                        <a href="/dashboard" className="text-indigo-600 hover:underline font-medium">
                            dashboard
                        </a>
                        {' '}or contact us at{' '}
                        <a href="mailto:support@votegenerator.com" className="text-indigo-600 hover:underline">
                            support@votegenerator.com
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
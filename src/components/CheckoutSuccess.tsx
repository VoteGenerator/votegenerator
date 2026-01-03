// ============================================================================
// CheckoutSuccess - Success page after Stripe subscription checkout
// Route: /checkout/success
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, Sparkles, ArrowRight, Loader2, Zap, Crown, Check, AlertCircle, Calendar
} from 'lucide-react';
import NavHeader from './NavHeader';

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
    const [pollData, setPollData] = useState<any>(null);
    const [creatingPoll, setCreatingPoll] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tierParam = params.get('tier');
        const billingParam = params.get('billing');
        
        setTier(tierParam);
        setBilling(billingParam);
        
        // Check for saved poll draft
        const draft = localStorage.getItem('vg_poll_draft');
        if (draft) {
            try {
                setPollData(JSON.parse(draft));
            } catch (e) {
                console.error('Error parsing poll draft:', e);
            }
        }
        
        // Store subscription info
        if (tierParam) {
            localStorage.setItem('vg_subscription_tier', tierParam);
            localStorage.setItem('vg_subscription_billing', billingParam || 'annual');
            localStorage.setItem('vg_subscribed_at', new Date().toISOString());
        }
        
        setLoading(false);
    }, []);

    const createPollFromDraft = async () => {
        if (!pollData) {
            window.location.href = '/create';
            return;
        }
        
        setCreatingPoll(true);
        
        try {
            const createData = {
                title: pollData.title,
                description: pollData.description || undefined,
                options: pollData.options,
                pollType: pollData.pollType,
                settings: pollData.settings || {
                    hideResults: false,
                    allowMultiple: false
                },
                tier: tier || 'pro'
            };
            
            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createData)
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.removeItem('vg_poll_draft');
                window.location.href = `/#id=${data.id}&admin=${data.adminKey}`;
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to create poll');
                setCreatingPoll(false);
            }
        } catch (err) {
            console.error('Error creating poll:', err);
            setError('Failed to create poll. Please try again.');
            setCreatingPoll(false);
        }
    };

    const goToCreate = () => {
        window.location.href = '/create';
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
            <NavHeader />

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

                            {/* Show saved poll info if exists */}
                            {pollData && (
                                <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100">
                                    <h4 className="font-semibold text-indigo-800 mb-2">Your Poll Draft:</h4>
                                    <p className="text-indigo-700 font-medium">{pollData.title}</p>
                                    <p className="text-indigo-600 text-sm">{pollData.options?.length || 0} options • {pollData.pollType}</p>
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100 flex items-start gap-2">
                                    <AlertCircle size={20} className="text-red-500 mt-0.5" />
                                    <div>
                                        <p className="text-red-700 font-medium">Error creating poll</p>
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                type="button"
                                onClick={pollData ? createPollFromDraft : goToCreate}
                                disabled={creatingPoll}
                                className={`w-full py-4 bg-gradient-to-r ${planDetails.color} text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all ${creatingPoll ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {creatingPoll ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Creating Your Poll...
                                    </>
                                ) : pollData ? (
                                    <>
                                        <Sparkles size={20} />
                                        Create Your Poll Now
                                        <ArrowRight size={20} />
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Start Creating Polls
                                        <ArrowRight size={20} />
                                    </>
                                )}
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
                            onClick={goToCreate}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            <Sparkles size={20} />
                            Create Your Poll Now
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
                        <a href="/account" className="text-indigo-600 hover:underline font-medium">
                            account dashboard
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
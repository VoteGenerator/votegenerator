// ============================================================================
// UpgradeModal.tsx - In-app upgrade popup with pricing
// Location: src/components/UpgradeModal.tsx
// Shows pricing tiers without redirecting to pricing page
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Zap, Crown, Check, Loader2, ArrowRight,
    BarChart3, Users, Shield, Download, Palette, 
    Mail, Clock, Image as ImageIcon, FileText
} from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: 'free' | 'pro' | 'business';
    highlightFeature?: string; // e.g., 'analytics', 'unlimited', 'logo'
    source?: string; // Where the upgrade was triggered from
}

// Stripe Price IDs - These should match your Stripe dashboard
const STRIPE_PRICES = {
    pro: {
        monthly: process.env.REACT_APP_STRIPE_PRO_MONTHLY || 'price_pro_monthly',
        yearly: process.env.REACT_APP_STRIPE_PRO_YEARLY || 'price_pro_yearly'
    },
    business: {
        monthly: process.env.REACT_APP_STRIPE_BUSINESS_MONTHLY || 'price_business_monthly',
        yearly: process.env.REACT_APP_STRIPE_BUSINESS_YEARLY || 'price_business_yearly'
    }
};

const PLANS = {
    pro: {
        name: 'Pro',
        icon: Zap,
        price: { monthly: 19, yearly: 190 },
        color: 'indigo',
        gradient: 'from-indigo-500 to-blue-600',
        features: [
            { text: 'Unlimited polls', icon: BarChart3 },
            { text: '10,000 responses/month', icon: Users },
            { text: 'All 8 poll types', icon: Check },
            { text: 'Remove branding', icon: Shield },
            { text: 'Export CSV & Excel', icon: Download },
            { text: 'Premium themes', icon: Palette },
            { text: 'Email support', icon: Mail }
        ],
        highlight: ['analytics', 'export', 'themes', 'branding', 'unlimited']
    },
    business: {
        name: 'Business',
        icon: Crown,
        price: { monthly: 49, yearly: 490 },
        color: 'purple',
        gradient: 'from-violet-500 to-purple-600',
        features: [
            { text: 'Unlimited polls', icon: BarChart3 },
            { text: '100,000 responses/month', icon: Users },
            { text: 'Custom logo upload', icon: ImageIcon },
            { text: 'PDF reports', icon: FileText },
            { text: 'Advanced analytics', icon: BarChart3 },
            { text: 'Version history', icon: Clock },
            { text: 'Priority support', icon: Mail }
        ],
        highlight: ['logo', 'unlimited', 'pdf', 'version']
    }
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    currentTier,
    highlightFeature,
    source
}) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleUpgrade = async (plan: 'pro' | 'business') => {
        setLoadingPlan(plan);
        
        try {
            // Get the correct price ID based on plan and billing cycle
            const priceId = STRIPE_PRICES[plan][billingCycle];
            
            // Check if user has existing session/customer
            const existingToken = localStorage.getItem('vg_dashboard_token');
            const existingEmail = localStorage.getItem('vg_customer_email');
            
            // Create checkout session
            const response = await fetch('/.netlify/functions/vg-create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    plan,
                    billing: billingCycle,
                    // Pass existing customer info for upgrade (not new dashboard)
                    existingCustomerToken: existingToken,
                    existingEmail: existingEmail,
                    upgradeFrom: currentTier,
                    source: source || 'upgrade_modal',
                    // Success URL returns to current page or dashboard
                    successUrl: `${window.location.origin}/checkout/success?tier=${plan}&billing=${billingCycle}&upgraded=true`,
                    cancelUrl: window.location.href
                })
            });

            if (!response.ok) {
                // If function doesn't exist or fails, redirect to pricing page
                window.location.href = `/pricing?plan=${plan}&billing=${billingCycle}`;
                return;
            }

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                // Fallback to pricing page
                window.location.href = `/pricing?plan=${plan}&billing=${billingCycle}`;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            // Fallback to pricing page on any error
            window.location.href = `/pricing?plan=${plan}&billing=${billingCycle}`;
        }
    };

    // Determine which plans to show based on current tier
    const availablePlans = currentTier === 'free' 
        ? ['pro', 'business'] as const
        : currentTier === 'pro' 
            ? ['business'] as const
            : [] as const;

    if (!isOpen || availablePlans.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">
                                {currentTier === 'free' ? 'Upgrade Your Plan' : 'Upgrade to Business'}
                            </h2>
                            <p className="text-indigo-100">
                                Unlock more features and take your polls to the next level
                            </p>
                        </div>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex justify-center py-6 border-b border-slate-100">
                        <div className="bg-slate-100 rounded-xl p-1 flex">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    billingCycle === 'monthly'
                                        ? 'bg-white text-slate-900 shadow'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    billingCycle === 'yearly'
                                        ? 'bg-white text-slate-900 shadow'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Yearly
                                <span className="ml-1.5 text-xs text-emerald-600 font-bold">2 months free</span>
                            </button>
                        </div>
                    </div>

                    {/* Plans */}
                    <div className={`p-6 grid gap-6 ${availablePlans.length > 1 ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
                        {availablePlans.map(planKey => {
                            const plan = PLANS[planKey];
                            const Icon = plan.icon;
                            const price = billingCycle === 'yearly' 
                                ? plan.price.yearly / 12 
                                : plan.price.monthly;
                            const isHighlighted = highlightFeature && plan.highlight.includes(highlightFeature);
                            const isLoading = loadingPlan === planKey;

                            return (
                                <motion.div
                                    key={planKey}
                                    className={`rounded-2xl border-2 p-6 relative ${
                                        isHighlighted 
                                            ? `border-${plan.color}-400 bg-${plan.color}-50/50` 
                                            : 'border-slate-200 hover:border-slate-300'
                                    } transition-all`}
                                    whileHover={{ y: -2 }}
                                >
                                    {isHighlighted && (
                                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold rounded-full`}>
                                            Recommended
                                        </div>
                                    )}

                                    {/* Plan Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-slate-900">
                                                    ${price.toFixed(0)}
                                                </span>
                                                <span className="text-slate-500">USD/month</span>
                                            </div>
                                        </div>
                                    </div>

                                    {billingCycle === 'yearly' && (
                                        <p className="text-sm text-emerald-600 mb-4">
                                            Billed ${plan.price.yearly} USD/year
                                        </p>
                                    )}

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, i) => {
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                                                    <FeatureIcon size={16} className={`text-${plan.color}-500`} />
                                                    {feature.text}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleUpgrade(planKey)}
                                        disabled={isLoading || loadingPlan !== null}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                            isHighlighted
                                                ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`
                                                : 'bg-slate-900 text-white hover:bg-slate-800'
                                        } disabled:opacity-50`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Upgrade to {plan.name}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 text-center">
                        <p className="text-xs text-slate-500">
                            Secure checkout powered by Stripe. Cancel anytime.
                        </p>
                        {currentTier !== 'free' && (
                            <p className="text-xs text-indigo-600 mt-2">
                                Your existing polls and data will be preserved when upgrading.
                            </p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UpgradeModal;
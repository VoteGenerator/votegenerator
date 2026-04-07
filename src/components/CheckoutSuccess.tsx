// ============================================================================
// CheckoutSuccess.tsx - Post-purchase success page
// Location: src/components/CheckoutSuccess.tsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, Copy, Check, ArrowRight, 
    Crown, Zap, Star, ExternalLink, Loader2,
    BarChart3, Users, Palette, Download, Shield, Clock
} from 'lucide-react';
import { Analytics } from '../utils/analytics';
import { trackPinterestCheckout } from '../utils/pinterestTracking';

const CheckoutSuccess: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardUrl, setDashboardUrl] = useState('');
    
    // Get params from URL
    const params = new URLSearchParams(window.location.search);
    const tierParam = params.get('tier') || 'pro';
    const billingParam = params.get('billing') || 'yearly';
    const sessionId = params.get('session_id') || '';
    const upgraded = params.get('upgraded') === 'true';
    
    // Normalize billing (handle both "annual" and "yearly")
    const billing = billingParam === 'annual' ? 'yearly' : billingParam;
    const tier = tierParam.toLowerCase();
    
    // Pricing configuration
    const pricing = {
        pro: {
            monthly: 19,
            yearly: 190,
            name: 'Pro',
            icon: Zap,
            gradient: 'from-indigo-500 to-purple-600',
            features: [
                { icon: BarChart3, text: 'Unlimited active polls' },
                { icon: Users, text: '10,000 responses per poll' },
                { icon: Clock, text: '365-day poll duration' },
                { icon: Palette, text: 'Premium themes' },
                { icon: Shield, text: 'Remove VoteGenerator branding' },
                { icon: Download, text: 'Export to CSV & Excel' },
            ]
        },
        business: {
            monthly: 49,
            yearly: 490,
            name: 'Business',
            icon: Crown,
            gradient: 'from-amber-500 to-orange-600',
            features: [
                { icon: BarChart3, text: 'Unlimited active polls' },
                { icon: Users, text: '100,000 responses per poll' },
                { icon: Clock, text: '365-day poll duration' },
                { icon: Star, text: 'Custom logo upload' },
                { icon: Palette, text: 'All premium themes' },
                { icon: Shield, text: 'White-label embeds' },
                { icon: Download, text: 'Filtered exports & bulk export' },
                { icon: ExternalLink, text: 'Post-vote redirect URL' },
            ]
        }
    };
    
    const planConfig = pricing[tier as keyof typeof pricing] || pricing.pro;
    const price = billing === 'yearly' ? planConfig.yearly : planConfig.monthly;
    const billingText = billing === 'yearly' ? 'year' : 'month';
    const TierIcon = planConfig.icon;
    
    useEffect(() => {
        if (!sessionId) return;

        // Track purchase completion immediately (doesn't need the token)
        const purchaseValue = billing === 'yearly'
            ? (tier === 'business' ? 490 : 190)
            : (tier === 'business' ? 49 : 19);
        Analytics.purchaseCompleted(tier, billing === 'yearly' ? 'annual' : 'monthly', purchaseValue);

        // Fetch the real token from the server - retry because the webhook
        // may not have processed yet when the success page first loads
        setIsLoading(true);

        const fetchToken = async (attempt = 0): Promise<void> => {
            try {
                const res = await fetch(
                    `/.netlify/functions/vg-get-customer?session_id=${encodeURIComponent(sessionId)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.dashboardToken) {
                        const token = data.dashboardToken;
                        const url = window.location.origin + '/admin?token=' + token + '&session_id=' + sessionId;
                        setDashboardUrl(url);
                        localStorage.setItem('vg_dashboard_token', token);
                        localStorage.setItem('vg_session_id', sessionId);
                        localStorage.setItem('vg_purchased_tier', tier);
                        localStorage.setItem('vg_subscription_tier', tier);
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (_) { /* fall through to retry */ }

            // Webhook may not have run yet — retry up to 5 times, 2s apart
            if (attempt < 5) {
                await new Promise(r => setTimeout(r, 2000));
                return fetchToken(attempt + 1);
            }

            // Gave up after retries — dashboard link won't show but purchase still worked
            console.error('CheckoutSuccess: could not retrieve dashboard token after retries');
            setIsLoading(false);
        };

        fetchToken();
    }, [sessionId, tier, billing]);
    
    const copyDashboardLink = () => {
        if (dashboardUrl) {
            navigator.clipboard.writeText(dashboardUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };
    
    const goToDashboard = () => {
        if (dashboardUrl) {
            window.location.href = dashboardUrl;
        } else {
            window.location.href = '/create';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full"
            >
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className={'bg-gradient-to-r ' + planConfig.gradient + ' p-8 text-center text-white'}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle size={48} />
                        </motion.div>
                        <h1 className="text-3xl font-bold mb-2">
                            {upgraded ? 'Upgrade Complete!' : 'Welcome to ' + planConfig.name + '!'}
                        </h1>
                        <p className="text-white/80">
                            Your payment was successful
                        </p>
                    </div>
                    
                    {/* Plan Details */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={'w-12 h-12 bg-gradient-to-br ' + planConfig.gradient + ' rounded-xl flex items-center justify-center'}>
                                    <TierIcon size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{planConfig.name} Plan</h3>
                                    <p className="text-slate-500 text-sm">
                                        ${price}/{billingText} • Unlimited polls
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                                Active
                            </span>
                        </div>
                    </div>
                    
                    {/* Features */}
                    <div className="p-6 border-b border-slate-100">
                        <h4 className="font-semibold text-slate-900 mb-3">Your Features:</h4>
                        <ul className="space-y-2">
                            {planConfig.features.map((feature, i) => {
                                const FeatureIcon = feature.icon;
                                return (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                        <FeatureIcon size={16} className="text-indigo-500 flex-shrink-0" />
                                        {feature.text}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    {/* Dashboard Link */}
                    <div className="p-6 bg-slate-50">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                🔑 Your Dashboard Link
                            </label>
                            <p className="text-xs text-slate-500 mb-2">
                                Save this link! You'll need it to access your premium dashboard.
                            </p>
                            {dashboardUrl ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={dashboardUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 truncate"
                                    />
                                    <button
                                        onClick={copyDashboardLink}
                                        className={'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ' +
                                            (copied 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-slate-900 text-white hover:bg-slate-800')
                                        }
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="animate-spin text-slate-400" size={24} />
                                    <span className="ml-2 text-slate-500 text-sm">Generating link...</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Go to Dashboard */}
                        <button
                            onClick={goToDashboard}
                            disabled={!dashboardUrl}
                            className={'w-full py-3 bg-gradient-to-r ' + planConfig.gradient + ' text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'}
                        >
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </button>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-4 text-center text-xs text-slate-500">
                        A confirmation email has been sent to your inbox.
                        <br />
                        Questions? Contact support@votegenerator.com
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckoutSuccess;
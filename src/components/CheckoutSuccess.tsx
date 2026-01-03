// ============================================================================
// CheckoutSuccess - Success page after Stripe payment
// Route: /checkout/success
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircle, Sparkles, ArrowRight, Loader2, Zap, Calendar, Crown, Star, Gift, Check, AlertCircle, LayoutDashboard, Copy
} from 'lucide-react';
import NavHeader from './NavHeader';

// Plan details for display
const PLAN_DETAILS: Record<string, {
    name: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
    features: string[];
    maxPolls: number;
    activeDays: number;
}> = {
    'starter': {
        name: 'Starter',
        icon: Zap,
        color: 'text-blue-600',
        gradient: 'from-blue-500 to-indigo-600',
        features: ['500 responses', '30 days access', '1 premium poll', 'CSV export', 'Device & geo stats'],
        maxPolls: 1,
        activeDays: 30
    },
    'pro_event': {
        name: 'Pro Event',
        icon: Crown,
        color: 'text-purple-600',
        gradient: 'from-purple-500 to-pink-600',
        features: ['2,000 responses', '30 days access', '3 premium polls', 'All poll types', 'Export CSV/PDF/PNG'],
        maxPolls: 3,
        activeDays: 30
    },
    'unlimited_event': {
        name: 'Unlimited Event',
        icon: Star,
        color: 'text-amber-600',
        gradient: 'from-amber-400 to-orange-500',
        features: ['10,000 responses', '30 days access', 'Unlimited polls', 'ALL features', 'PIN protection', 'Custom branding'],
        maxPolls: Infinity,
        activeDays: 30
    },
    'unlimited': {
        name: 'Unlimited',
        icon: Star,
        color: 'text-amber-600',
        gradient: 'from-amber-500 to-orange-600',
        features: ['10,000 responses per poll', 'Unlimited premium polls', '1 year access', 'Priority support', 'All features'],
        maxPolls: Infinity,
        activeDays: 365
    }
};

const CheckoutSuccess: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tier, setTier] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [dashboardUrl, setDashboardUrl] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [hasShortToken, setHasShortToken] = useState(false);
    const [fetchingToken, setFetchingToken] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sid = params.get('session_id');
        const tierParam = params.get('tier');
        
        console.log('CheckoutSuccess: Loaded with session_id:', sid, 'tier:', tierParam);
        
        setSessionId(sid);
        setTier(tierParam);
        
        // Set up the session in localStorage
        if (sid && tierParam) {
            setupSession(sid, tierParam);
        }
        
        setLoading(false);
    }, []);

    const setupSession = async (sessionId: string, tier: string) => {
        // Calculate expiry date based on tier
        const now = new Date();
        let expiryDate: Date;
        
        switch (tier) {
            case 'unlimited':
                expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
                break;
            case 'unlimited_event':
                expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
                break;
            case 'pro_event':
                expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
                break;
            case 'starter':
            default:
                expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
                break;
        }
        
        // Create session object (will update with real token when available)
        const session: any = {
            sessionId, // Always store sessionId for backend lookup
            tier,
            expiresAt: expiryDate.toISOString(),
            polls: [],
            createdAt: new Date().toISOString()
        };
        
        // Save initial session to localStorage
        localStorage.setItem('vg_user_session', JSON.stringify(session));
        localStorage.setItem('vg_purchased_tier', tier);
        localStorage.setItem('vg_expires_at', expiryDate.toISOString());
        localStorage.setItem('vg_purchased_at', new Date().toISOString());
        
        // Start with session ID URL (will update when we get real token)
        setDashboardUrl(`${window.location.origin}/admin?s=${sessionId}`);
        
        // Poll for real token from backend (webhook takes time to complete)
        const fetchRealToken = async (): Promise<string | null> => {
            try {
                const response = await fetch(`/.netlify/functions/vg-get-customer?session_id=${encodeURIComponent(sessionId)}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('CheckoutSuccess: vg-get-customer response:', data);
                    if (data.dashboardToken) {
                        return data.dashboardToken;
                    }
                }
            } catch (e) {
                console.log('CheckoutSuccess: fetch error:', e);
            }
            return null;
        };
        
        // More aggressive polling - 10 attempts over ~30 seconds
        // Webhook can take 5-15 seconds to process
        const pollForToken = async () => {
            setFetchingToken(true);
            const delays = [1000, 2000, 2000, 3000, 3000, 4000, 4000, 5000, 5000, 5000]; // Total ~34s
            
            for (let attempt = 0; attempt < delays.length; attempt++) {
                console.log(`CheckoutSuccess: Polling for token, attempt ${attempt + 1}/${delays.length}`);
                const realToken = await fetchRealToken();
                
                if (realToken) {
                    console.log(`CheckoutSuccess: Got real token on attempt ${attempt + 1}: ${realToken.substring(0, 8)}...`);
                    
                    // Update session with real token
                    session.dashboardToken = realToken;
                    localStorage.setItem('vg_user_session', JSON.stringify(session));
                    
                    // Update displayed URL
                    setDashboardUrl(`${window.location.origin}/admin?t=${realToken}`);
                    setHasShortToken(true);
                    setFetchingToken(false);
                    return;
                }
                
                // Wait before next attempt
                await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            }
            
            console.log('CheckoutSuccess: Could not get short token after all attempts');
            setFetchingToken(false);
        };
        
        // Start polling in background (don't block the UI)
        pollForToken();
        
        console.log('CheckoutSuccess: Initial session created, polling for short token...');
    };

    const goToDashboard = () => {
        // Navigate to admin - the dashboard will fetch the real token if needed
        window.location.href = '/admin';
    };

    const copyDashboardLink = () => {
        navigator.clipboard.writeText(dashboardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const planDetails = tier ? PLAN_DETAILS[tier] : null;
    const Icon = planDetails?.icon || Gift;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-indigo-500 mx-auto mb-4" />
                    <p className="text-slate-600">Confirming your purchase...</p>
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
                        Payment Successful! 🎉
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-600"
                    >
                        Thank you for your purchase. You're all set to create amazing polls!
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
                        <div className={`bg-gradient-to-r ${planDetails.gradient} p-6 text-white`}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{planDetails.name}</h2>
                                    <p className="text-white/80">Your plan is now active</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="font-semibold text-slate-800 mb-3">What's included:</h3>
                            <ul className="space-y-2 mb-6">
                                {planDetails.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600">
                                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Dashboard Link - Important! */}
                            <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-amber-800 mb-1">Save Your Dashboard Link</h4>
                                        <p className="text-amber-700 text-sm mb-3">
                                            Bookmark this page or copy your dashboard link to access your polls anytime.
                                        </p>
                                        
                                        {/* Dashboard URL display */}
                                        {dashboardUrl && (
                                            <div className="bg-white border border-amber-200 rounded-lg p-3 mb-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {fetchingToken ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin text-amber-600" />
                                                            <span className="text-xs text-amber-600">Generating short link...</span>
                                                        </>
                                                    ) : hasShortToken ? (
                                                        <>
                                                            <Check size={14} className="text-green-600" />
                                                            <span className="text-xs text-green-600">Short link ready!</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-amber-600">Using backup link</span>
                                                    )}
                                                </div>
                                                <code className="text-xs text-slate-600 break-all block">
                                                    {dashboardUrl}
                                                </code>
                                            </div>
                                        )}
                                        
                                        {dashboardUrl && (
                                            <button
                                                onClick={copyDashboardLink}
                                                className="flex items-center gap-2 px-3 py-2 bg-white border border-amber-300 rounded-lg text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
                                            >
                                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                                {copied ? 'Copied!' : 'Copy Dashboard Link'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={goToDashboard}
                                className={`w-full py-4 bg-gradient-to-r ${planDetails.gradient} text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
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
                            Your payment was successful. A confirmation email has been sent.
                        </p>
                        <button
                            onClick={goToDashboard}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            <LayoutDashboard size={20} />
                            Go to Dashboard
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}

                {/* What's Next */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl border border-slate-200 p-6 mt-6"
                >
                    <h3 className="font-semibold text-slate-800 mb-4">What's Next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-600 text-sm font-bold">1</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">Go to your Dashboard</p>
                                <p className="text-sm text-slate-500">Your home base for managing all polls</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-600 text-sm font-bold">2</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">Create your first poll</p>
                                <p className="text-sm text-slate-500">Choose from multiple poll types</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-600 text-sm font-bold">3</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">Share & collect votes</p>
                                <p className="text-sm text-slate-500">Get real-time results with analytics</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center text-sm text-slate-500"
                >
                    <p>
                        Questions? Contact us at{' '}
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
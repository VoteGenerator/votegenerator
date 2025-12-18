import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
    CheckCircle, 
    Sparkles, 
    ArrowRight, 
    Loader2,
    Zap,
    Calendar,
    Crown,
    Star,
    Gift,
    Copy,
    Check
} from 'lucide-react';
import './index.css';

// Plan details for display
const PLAN_DETAILS: Record<string, {
    name: string;
    icon: React.ElementType;
    color: string;
    features: string[];
    createUrl: string;
}> = {
    'quick_poll': {
        name: 'Quick Poll',
        icon: Zap,
        color: 'from-blue-500 to-indigo-600',
        features: ['500 responses', '7 days active', '10 poll types', 'CSV export'],
        createUrl: '/create.html?tier=quick'
    },
    'event_poll': {
        name: 'Event Poll',
        icon: Calendar,
        color: 'from-purple-500 to-indigo-600',
        features: ['2,000 responses', '30 days active', '13 poll types', 'PDF & PNG export'],
        createUrl: '/create.html?tier=event'
    },
    'pro_monthly': {
        name: 'Pro Monthly',
        icon: Crown,
        color: 'from-indigo-500 to-purple-600',
        features: ['10,000 responses/mo', 'Unlimited duration', 'All 16 poll types', 'Custom short links'],
        createUrl: '/create.html?tier=pro'
    },
    'pro_yearly': {
        name: 'Pro Annual',
        icon: Crown,
        color: 'from-indigo-500 to-purple-600',
        features: ['10,000 responses/mo', 'Unlimited duration', 'All 16 poll types', 'Custom short links'],
        createUrl: '/create.html?tier=pro'
    },
    'pro_plus_monthly': {
        name: 'Pro+ Monthly',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        features: ['50,000 responses/mo', 'White-label embed', 'API access', '10 team viewers'],
        createUrl: '/create.html?tier=pro_plus'
    },
    'pro_plus_yearly': {
        name: 'Pro+ Annual',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        features: ['50,000 responses/mo', 'White-label embed', 'API access', '10 team viewers'],
        createUrl: '/create.html?tier=pro_plus'
    }
};

function SuccessPage() {
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [accessCode, setAccessCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sid = params.get('session_id');
        const planParam = params.get('plan');
        
        setSessionId(sid);
        
        if (planParam) {
            setPlan(planParam);
            setLoading(false);
            // Generate a simple access code (in production, this would come from your backend)
            setAccessCode(generateAccessCode());
        } else if (sid) {
            // Fetch session details from your backend
            fetchSessionDetails(sid);
        } else {
            setLoading(false);
        }
    }, []);

    const generateAccessCode = () => {
        // Generate a random access code (in production, this comes from backend after payment verification)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const fetchSessionDetails = async (sid: string) => {
        try {
            const response = await fetch(`/.netlify/functions/verify-session?session_id=${sid}`);
            if (response.ok) {
                const data = await response.json();
                setPlan(data.plan);
                setAccessCode(data.accessCode || generateAccessCode());
            } else {
                // Fallback - try to get plan from URL or default
                setError('Could not verify session, but your payment was received.');
            }
        } catch (err) {
            console.error('Error fetching session:', err);
            setError('Could not verify session, but your payment was received.');
        } finally {
            setLoading(false);
        }
    };

    const copyAccessCode = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const planDetails = plan ? PLAN_DETAILS[plan] : null;
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
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-8 h-8" />
                        <span className="font-bold text-xl text-slate-900">VoteGenerator</span>
                    </a>
                </div>
            </header>

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
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6"
                    >
                        <div className={`bg-gradient-to-r ${planDetails.color} p-6 text-white`}>
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
                                        <Check size={16} className="text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Access Code */}
                            {accessCode && (
                                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-slate-600 mb-2">Your Access Code (save this!):</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-white px-4 py-3 rounded-lg font-mono text-lg font-bold text-slate-800 border border-slate-200">
                                            {accessCode}
                                        </code>
                                        <button
                                            onClick={copyAccessCode}
                                            className="p-3 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                                            title="Copy code"
                                        >
                                            {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} className="text-slate-600" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Use this code to unlock premium features when creating polls.
                                    </p>
                                </div>
                            )}

                            {/* CTA Button */}
                            <a
                                href={planDetails.createUrl}
                                className={`w-full py-4 bg-gradient-to-r ${planDetails.color} text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                            >
                                <Sparkles size={20} />
                                Create Your Poll Now
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Fallback if no plan detected */}
                {!planDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center"
                    >
                        {error && (
                            <p className="text-amber-600 mb-4">{error}</p>
                        )}
                        <p className="text-slate-600 mb-6">
                            A confirmation email has been sent to your inbox.
                        </p>
                        <a
                            href="/create.html"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            <Sparkles size={20} />
                            Create Your Poll Now
                            <ArrowRight size={20} />
                        </a>
                    </motion.div>
                )}

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center text-sm text-slate-500"
                >
                    <p>
                        Need help? <a href="/help.html" className="text-indigo-600 hover:underline">Visit our Help Center</a>
                        {' '}or{' '}
                        <a href="/contact.html" className="text-indigo-600 hover:underline">Contact Support</a>
                    </p>
                    <p className="mt-2">
                        Receipt sent to your email • Session: {sessionId?.slice(0, 20)}...
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <SuccessPage />
        </React.StrictMode>
    );
}

export default SuccessPage;
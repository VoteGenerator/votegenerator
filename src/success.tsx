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
    Check,
    AlertCircle
} from 'lucide-react';
import './index.css';

// Plan details for display
const PLAN_DETAILS: Record<string, {
    name: string;
    icon: React.ElementType;
    color: string;
    features: string[];
}> = {
    'quick_poll': {
        name: 'Quick Poll',
        icon: Zap,
        color: 'from-blue-500 to-indigo-600',
        features: ['500 responses', '7 days active', '10 poll types', 'CSV export']
    },
    'event_poll': {
        name: 'Event Poll',
        icon: Calendar,
        color: 'from-purple-500 to-indigo-600',
        features: ['2,000 responses', '30 days active', '13 poll types', 'PDF & PNG export']
    },
    'pro_monthly': {
        name: 'Pro Monthly',
        icon: Crown,
        color: 'from-indigo-500 to-purple-600',
        features: ['10,000 responses/mo', 'Unlimited duration', 'All 16 poll types', 'Custom short links']
    },
    'pro_yearly': {
        name: 'Pro Annual',
        icon: Crown,
        color: 'from-indigo-500 to-purple-600',
        features: ['10,000 responses/mo', 'Unlimited duration', 'All 16 poll types', 'Custom short links']
    },
    'pro_plus_monthly': {
        name: 'Pro+ Monthly',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        features: ['50,000 responses/mo', 'White-label embed', 'API access', '10 team viewers']
    },
    'pro_plus_yearly': {
        name: 'Pro+ Annual',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        features: ['50,000 responses/mo', 'White-label embed', 'API access', '10 team viewers']
    }
};

function SuccessPage() {
    const [loading, setLoading] = useState(true);
    const [creatingPoll, setCreatingPoll] = useState(false);
    const [plan, setPlan] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [pollData, setPollData] = useState<any>(null);
    const [createdPoll, setCreatedPoll] = useState<{ pollId: string; adminToken: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sid = params.get('session_id');
        const planParam = params.get('plan');
        
        setSessionId(sid);
        setPlan(planParam);
        
        // Check for saved poll draft
        const draft = localStorage.getItem('pollDraft');
        if (draft) {
            try {
                setPollData(JSON.parse(draft));
            } catch (e) {
                console.error('Error parsing poll draft:', e);
            }
        }
        
        setLoading(false);
    }, []);

    const createPollFromDraft = async () => {
        if (!pollData) {
            // No draft, just go to create page
            window.location.href = '/create.html';
            return;
        }
        
        setCreatingPoll(true);
        
        try {
            // Format data to match vg-create.ts expected format
            const createData = {
                title: pollData.title,
                description: pollData.description || undefined,
                options: pollData.options, // Should already be string[]
                pollType: pollData.pollType,
                settings: pollData.settings || {
                    hideResults: false,
                    allowMultiple: false
                }
            };
            
            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createData)
            });
            
            if (response.ok) {
                const data = await response.json();
                // vg-create returns { id, adminKey }
                // Clear the draft
                localStorage.removeItem('pollDraft');
                // Redirect to admin using hash routing
                window.location.href = `/#admin/${data.id}/${data.adminKey}`;
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
                                onClick={createPollFromDraft}
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
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center"
                    >
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
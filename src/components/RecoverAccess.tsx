// ============================================================================
// RecoverAccess.tsx - Lost Link Recovery Page
// Location: src/components/RecoverAccess.tsx
// Route: /recover
// Only works for PAID users (Stripe has their email)
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Mail, ArrowRight, Loader2, CheckCircle, AlertCircle, 
    Home, ShieldCheck, HelpCircle, Lock
} from 'lucide-react';

type RecoveryStatus = 'idle' | 'loading' | 'success' | 'error' | 'not_found';

const RecoverAccess: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<RecoveryStatus>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');

        try {
            const res = await fetch('/.netlify/functions/vg-recover-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Check your email for your dashboard links!');
            } else if (res.status === 404) {
                setStatus('not_found');
                setMessage(data.error || 'No paid account found with this email.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please check your connection and try again.');
        }
    };

    const goHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={goHome} className="flex items-center gap-3 hover:opacity-80 transition">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-10 h-10" />
                        <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
                    </button>
                    <a href="/#pricing" className="text-indigo-600 font-medium hover:text-indigo-700">
                        View Pricing
                    </a>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Recover Your Access</h1>
                        <p className="text-indigo-100">
                            Lost your admin dashboard link? We'll send it to your email.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">Check Your Email!</h2>
                                <p className="text-slate-500 mb-6">{message}</p>
                                <div className="bg-slate-50 rounded-xl p-4 text-left text-sm text-slate-600">
                                    <p className="font-medium mb-2">What's included:</p>
                                    <ul className="space-y-1">
                                        <li>• Links to all your active polls</li>
                                        <li>• Your admin dashboard access</li>
                                        <li>• Tip: Bookmark them this time! 😉</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => { setStatus('idle'); setEmail(''); }}
                                    className="mt-6 text-indigo-600 font-medium hover:text-indigo-700"
                                >
                                    Try another email
                                </button>
                            </motion.div>
                        ) : status === 'not_found' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HelpCircle size={32} className="text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">No Account Found</h2>
                                <p className="text-slate-500 mb-4">{message}</p>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-sm text-amber-700 mb-6">
                                    <p className="font-medium mb-2">This could mean:</p>
                                    <ul className="space-y-1">
                                        <li>• You used a different email at checkout</li>
                                        <li>• You created a free poll (no recovery available)</li>
                                        <li>• The email has a typo</li>
                                    </ul>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setStatus('idle'); setEmail(''); }}
                                        className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                                    >
                                        Try Again
                                    </button>
                                    <a
                                        href="/#pricing"
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition text-center"
                                    >
                                        Get a Plan
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Info box */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-indigo-700">
                                            <p className="font-medium">For paid users only</p>
                                            <p className="text-indigo-600">
                                                Recovery is available for Starter, Pro Event, and Unlimited plans.
                                                Free polls cannot be recovered.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email used at checkout
                                    </label>
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                            disabled={status === 'loading'}
                                            required
                                        />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                        <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                                        <p className="text-red-700 text-sm">{message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !email.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Looking up your account...
                                        </>
                                    ) : (
                                        <>
                                            Send Recovery Email
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-slate-400 mt-4">
                                    We'll send all your active poll links to this email.
                                </p>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* Back to home */}
                <div className="text-center mt-8">
                    <button
                        onClick={goHome}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition"
                    >
                        <Home size={18} />
                        Back to VoteGenerator
                    </button>
                </div>
            </main>
        </div>
    );
};

export default RecoverAccess;
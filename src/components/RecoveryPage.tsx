// ============================================================================
// RecoveryPage.tsx - Poll Recovery via Email Verification
// Location: src/components/RecoveryPage.tsx
// Route: /recover
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Send, Check, AlertCircle, Loader2, Key,
    ArrowLeft, Shield, HelpCircle, Lock, RefreshCw,
    ChevronRight, Home, ExternalLink
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

type Step = 'email' | 'verify' | 'success' | 'error';

const RecoveryPage: React.FC = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [recoveredPolls, setRecoveredPolls] = useState<any[]>([]);
    const [dashboardUrl, setDashboardUrl] = useState('');

    // Check URL for pre-filled email (from admin link email)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, []);

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/.netlify/functions/vg-recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send_code',
                    email
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStep('verify');
            } else if (response.status === 404) {
                setError('No polls found for this email address. Make sure you saved your polls to this email.');
            } else {
                setError(data.error || 'Failed to send verification code. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        }

        setIsLoading(false);
    };

    const handleVerifyCode = async () => {
        if (code.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/.netlify/functions/vg-recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify',
                    email,
                    code
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save recovered data to localStorage
                if (data.polls && data.polls.length > 0) {
                    // Merge with existing polls
                    const existingPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
                    const existingIds = new Set(existingPolls.map((p: any) => p.id));
                    
                    const newPolls = data.polls.filter((p: any) => !existingIds.has(p.id));
                    const mergedPolls = [...newPolls, ...existingPolls];
                    
                    localStorage.setItem('vg_polls', JSON.stringify(mergedPolls));
                    
                    // Also update session
                    const session = JSON.parse(localStorage.getItem('vg_user_session') || '{}');
                    session.polls = mergedPolls.map((p: any) => ({
                        id: p.id,
                        adminKey: p.adminKey,
                        title: p.title || 'Untitled Poll',
                        type: p.type || 'multiple',
                        createdAt: p.createdAt || new Date().toISOString(),
                        responseCount: p.responseCount || 0,
                        status: p.status || 'live'
                    }));
                    session.tier = session.tier || 'free';
                    session.dashboardToken = session.dashboardToken || 'free_user';
                    session.email = email;
                    localStorage.setItem('vg_user_session', JSON.stringify(session));
                    localStorage.setItem('vg_saved_email', email);
                    
                    setRecoveredPolls(data.polls);
                }
                
                // If they have a dashboard token, provide the URL
                if (data.dashboardToken) {
                    setDashboardUrl(`${window.location.origin}/admin?t=${data.dashboardToken}`);
                }
                
                setStep('success');
            } else if (response.status === 400) {
                setError('Invalid or expired code. Please try again or request a new code.');
            } else {
                setError(data.error || 'Verification failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
            <NavHeader />
            
            <main className="max-w-lg mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Key size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Recover Your Polls</h1>
                    <p className="text-slate-600">
                        Enter the email address you used to save your polls
                    </p>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Email Input */}
                        {step === 'email' && (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Mail size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">Enter Your Email</h2>
                                        <p className="text-sm text-slate-500">We'll send a verification code</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                            autoFocus
                                        />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                                        >
                                            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-red-700">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleSendCode}
                                        disabled={isLoading || !email.includes('@')}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send Verification Code
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Help Text */}
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <HelpCircle size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-slate-600">
                                            <p className="font-medium text-slate-700 mb-1">Don't have an email saved?</p>
                                            <p>
                                                If you never saved your polls to email, they're stored in your browser's local storage. 
                                                Try accessing your polls from the same browser and device you used to create them.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Verify Code */}
                        {step === 'verify' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <Shield size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">Check Your Email</h2>
                                        <p className="text-sm text-slate-500">Enter the 6-digit code</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-6">
                                    <p className="text-sm text-indigo-800">
                                        We sent a verification code to <strong>{email}</strong>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => {
                                                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                setError('');
                                            }}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                                            autoFocus
                                        />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                                        >
                                            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-red-700">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleVerifyCode}
                                        disabled={isLoading || code.length !== 6}
                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={20} />
                                                Verify & Recover
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={() => {
                                                setStep('email');
                                                setCode('');
                                                setError('');
                                            }}
                                            className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                                        >
                                            <ArrowLeft size={14} />
                                            Change email
                                        </button>
                                        <button
                                            onClick={handleSendCode}
                                            disabled={isLoading}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                        >
                                            <RefreshCw size={14} />
                                            Resend code
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Success */}
                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} className="text-emerald-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Polls Recovered!</h2>
                                    <p className="text-slate-600">
                                        {recoveredPolls.length} poll{recoveredPolls.length !== 1 ? 's' : ''} restored to your account
                                    </p>
                                </div>

                                {/* Recovered Polls List */}
                                {recoveredPolls.length > 0 && (
                                    <div className="bg-slate-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Recovered Polls</p>
                                        <div className="space-y-2">
                                            {recoveredPolls.map((poll, index) => (
                                                <div key={poll.id || index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                                    <span className="font-medium text-slate-700 truncate">{poll.title || 'Untitled Poll'}</span>
                                                    <span className="text-xs text-slate-500">{poll.responseCount || 0} votes</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Dashboard Link */}
                                {dashboardUrl && (
                                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl mb-6">
                                        <p className="text-sm text-indigo-800 mb-2 font-medium">Your Dashboard Link:</p>
                                        <input
                                            type="text"
                                            value={dashboardUrl}
                                            readOnly
                                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-mono"
                                        />
                                        <p className="text-xs text-indigo-600 mt-2">
                                            Save this link to access your polls from any device!
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <a
                                        href="/admin"
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        Go to Dashboard
                                        <ChevronRight size={20} />
                                    </a>
                                    <a
                                        href="/"
                                        className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Home size={18} />
                                        Back to Home
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Additional Help */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 mb-2">Need help?</p>
                    <a href="/help" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center gap-1">
                        Visit our Help Center
                        <ExternalLink size={14} />
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RecoveryPage;
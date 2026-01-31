// ============================================================================
// EmailCaptureBanner.tsx - Email Capture for Free Users
// Location: src/components/EmailCaptureBanner.tsx
//
// ADD TO AdminDashboard.tsx:
// 1. Import: import EmailCaptureBanner from './EmailCaptureBanner';
// 2. Add state: const [emailCaptureComplete, setEmailCaptureComplete] = useState(false);
// 3. Render before main content (after loading check):
//    {tier === 'free' && polls.length > 0 && !emailCaptureComplete && (
//        <EmailCaptureBanner 
//            pollId={polls[0]?.id}
//            onComplete={() => setEmailCaptureComplete(true)}
//            onUpgrade={() => setShowUpgradeModal(true)}
//        />
//    )}
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Mail, Send, Shield, ShieldCheck,
    Bookmark, Crown, Loader2, X, Check, RefreshCw
} from 'lucide-react';

interface EmailCaptureBannerProps {
    pollId?: string;
    onComplete: () => void;
    onUpgrade: () => void;
}

type Step = 'prompt' | 'email' | 'verify' | 'success';

const EmailCaptureBanner: React.FC<EmailCaptureBannerProps> = ({
    pollId,
    onComplete,
    onUpgrade
}) => {
    const [step, setStep] = useState<Step>('prompt');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dismissed, setDismissed] = useState(false);

    // Check if already saved
    useEffect(() => {
        const savedEmail = localStorage.getItem('vg_saved_email');
        const dismissed = localStorage.getItem('vg_email_capture_dismissed');
        if (savedEmail || dismissed) {
            onComplete();
        }
    }, [onComplete]);

    const handleSendCode = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/.netlify/functions/vg-save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send_code',
                    email,
                    pollId
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStep('verify');
            } else {
                setError(data.error || 'Failed to send code. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
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
            const response = await fetch('/.netlify/functions/vg-save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'verify',
                    email,
                    code,
                    pollId
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save to localStorage
                localStorage.setItem('vg_saved_email', email);
                localStorage.setItem('vg_dashboard_saved_free', 'true');
                
                // Update session if exists
                const session = JSON.parse(localStorage.getItem('vg_user_session') || '{}');
                if (session) {
                    session.email = email;
                    localStorage.setItem('vg_user_session', JSON.stringify(session));
                }
                
                setStep('success');
                setTimeout(() => {
                    onComplete();
                }, 2500);
            } else {
                setError(data.error || 'Invalid code. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        }

        setIsLoading(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('vg_email_capture_dismissed', 'session');
        setDismissed(true);
        onComplete();
    };

    const handleBookmark = () => {
        // Show browser bookmark instructions
        alert(
            navigator.userAgent.includes('Mac') 
                ? 'Press ⌘+D to bookmark this page' 
                : 'Press Ctrl+D to bookmark this page'
        );
        handleDismiss();
    };

    if (dismissed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
        >
            <div className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-2 border-red-200 rounded-2xl overflow-hidden shadow-lg">
                <AnimatePresence mode="wait">
                    {/* Step 1: Initial Warning/Prompt */}
                    {step === 'prompt' && (
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle size={24} className="text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-red-800 mb-1">
                                        ⚠️ Don't Lose Access to Your Polls!
                                    </h3>
                                    <p className="text-red-700 text-sm mb-4">
                                        Your polls are stored in this browser only. You'll lose access if you:
                                    </p>
                                    <div className="grid sm:grid-cols-3 gap-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100/50 rounded-lg px-3 py-2">
                                            <X size={14} /> Clear cookies
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100/50 rounded-lg px-3 py-2">
                                            <X size={14} /> Use different browser
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100/50 rounded-lg px-3 py-2">
                                            <X size={14} /> Switch devices
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setStep('email')}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                                        >
                                            <Mail size={18} />
                                            Save to Email (Recommended)
                                        </button>
                                        <button
                                            onClick={handleBookmark}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                                        >
                                            <Bookmark size={18} />
                                            Just Bookmark
                                        </button>
                                        <button
                                            onClick={onUpgrade}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                                        >
                                            <Crown size={18} />
                                            Upgrade
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="text-red-400 hover:text-red-600 p-1"
                                    title="Dismiss (not recommended)"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Email Input */}
                    {step === 'email' && (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail size={24} className="text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                                        Enter Your Email
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        We'll send a verification code and your admin link for safekeeping.
                                    </p>
                                    
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="your@email.com"
                                            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSendCode}
                                            disabled={isLoading || !email.includes('@')}
                                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                            Send Code
                                        </button>
                                    </div>
                                    
                                    {error && (
                                        <p className="text-red-600 text-sm mt-2">{error}</p>
                                    )}
                                    
                                    <button
                                        onClick={() => setStep('prompt')}
                                        className="text-slate-500 hover:text-slate-700 text-sm mt-3"
                                    >
                                        ← Back
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Verify Code */}
                    {step === 'verify' && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                                        Check Your Email
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Enter the 6-digit code we sent to <strong>{email}</strong>
                                    </p>
                                    
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => {
                                                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                setError('');
                                            }}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="w-40 px-4 py-3 border-2 border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleVerifyCode}
                                            disabled={isLoading || code.length !== 6}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Check size={18} />
                                            )}
                                            Verify
                                        </button>
                                    </div>
                                    
                                    {error && (
                                        <p className="text-red-600 text-sm mt-2">{error}</p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mt-3">
                                        <button
                                            onClick={() => {
                                                setStep('email');
                                                setCode('');
                                            }}
                                            className="text-slate-500 hover:text-slate-700 text-sm"
                                        >
                                            ← Change email
                                        </button>
                                        <button
                                            onClick={handleSendCode}
                                            disabled={isLoading}
                                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                        >
                                            <RefreshCw size={14} />
                                            Resend code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <ShieldCheck size={24} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-800">
                                        ✓ Polls Saved to {email}
                                    </h3>
                                    <p className="text-emerald-600 text-sm">
                                        You can now recover your polls from any device at /recover
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default EmailCaptureBanner;
// ============================================================================
// EmailCaptureBanner.tsx - Combined Save Access Banner for Free Users
// Location: src/components/EmailCaptureBanner.tsx
//
// Features:
// - Combines email save + bookmark warning
// - X button with confirmation modal before dismissing
// - Saves dismissal to localStorage so it doesn't come back
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Mail, Send, Shield, ShieldCheck,
    Bookmark, Crown, Loader2, X, Check, RefreshCw,
    AlertCircle
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
    const [showDismissWarning, setShowDismissWarning] = useState(false);

    // Check if already saved/dismissed on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('vg_saved_email');
        const dismissed = localStorage.getItem('vg_access_banner_dismissed');
        if (savedEmail || dismissed === 'permanent') {
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

            if (response.ok && data.success) {
                setStep('verify');
            } else {
                setError(data.error || 'Failed to send code. Please try again.');
            }
        } catch (err) {
            console.error('Email send error:', err);
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

            if (response.ok && data.success) {
                // Save to localStorage
                localStorage.setItem('vg_saved_email', email);
                localStorage.setItem('vg_access_banner_dismissed', 'permanent');
                
                // Update session if exists
                try {
                    const session = JSON.parse(localStorage.getItem('vg_user_session') || '{}');
                    if (session) {
                        session.email = email;
                        localStorage.setItem('vg_user_session', JSON.stringify(session));
                    }
                } catch (e) {}
                
                setStep('success');
                setTimeout(() => {
                    onComplete();
                }, 2000);
            } else {
                setError(data.error || 'Invalid code. Please try again.');
            }
        } catch (err) {
            console.error('Verify error:', err);
            setError('Network error. Please check your connection.');
        }

        setIsLoading(false);
    };

    // Handle X button click - show warning first
    const handleXClick = () => {
        setShowDismissWarning(true);
    };

    // Confirm dismiss - permanently hide banner
    const handleConfirmDismiss = () => {
        localStorage.setItem('vg_access_banner_dismissed', 'permanent');
        setShowDismissWarning(false);
        onComplete();
    };

    // Cancel dismiss
    const handleCancelDismiss = () => {
        setShowDismissWarning(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
            >
                <div className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-2 border-red-300 rounded-2xl overflow-hidden shadow-lg relative">
                    
                    {/* X Button - Always visible */}
                    <button
                        onClick={handleXClick}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition z-10"
                        title="Dismiss"
                    >
                        <X size={18} />
                    </button>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Initial Warning/Prompt */}
                        {step === 'prompt' && (
                            <motion.div
                                key="prompt"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-5 pr-12"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle size={24} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-red-800 mb-1">
                                            ⚠️ Important! Save Your Access Now
                                        </h3>
                                        <p className="text-red-700 text-sm mb-3">
                                            Your polls are only stored in this browser. You'll <strong>lose access</strong> if you:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-100 rounded-full px-3 py-1">
                                                <X size={12} /> Clear cookies
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-100 rounded-full px-3 py-1">
                                                <X size={12} /> Switch browser
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-100 rounded-full px-3 py-1">
                                                <X size={12} /> Use another device
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setStep('email')}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition text-sm"
                                            >
                                                <Mail size={16} />
                                                Save to Email
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Browser bookmark instruction
                                                    const isMac = navigator.userAgent.includes('Mac');
                                                    alert(`Press ${isMac ? '⌘+D' : 'Ctrl+D'} to bookmark this page.\n\nThis will let you return to your dashboard from this browser.`);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition text-sm"
                                            >
                                                <Bookmark size={16} />
                                                Bookmark Page
                                            </button>
                                            <button
                                                onClick={onUpgrade}
                                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition text-sm"
                                            >
                                                <Crown size={16} />
                                                Upgrade
                                            </button>
                                        </div>
                                    </div>
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
                                className="p-5 pr-12"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail size={24} className="text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                                            Enter Your Email
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-3">
                                            We'll send a verification code. After verifying, you can recover your polls from any device.
                                        </p>
                                        
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError('');
                                                }}
                                                placeholder="your@email.com"
                                                className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-emerald-400 focus:outline-none transition text-sm"
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                                            />
                                            <button
                                                onClick={handleSendCode}
                                                disabled={isLoading || !email.includes('@')}
                                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2 text-sm"
                                            >
                                                {isLoading ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Send size={16} />
                                                )}
                                                Send Code
                                            </button>
                                        </div>
                                        
                                        {error && (
                                            <p className="text-red-600 text-sm mb-2">{error}</p>
                                        )}
                                        
                                        <button
                                            onClick={() => { setStep('prompt'); setError(''); }}
                                            className="text-slate-500 hover:text-slate-700 text-sm"
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
                                className="p-5 pr-12"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield size={24} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                                            Check Your Email
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-3">
                                            Enter the 6-digit code we sent to <strong>{email}</strong>
                                        </p>
                                        
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => {
                                                    setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6));
                                                    setError('');
                                                }}
                                                placeholder="ABC123"
                                                maxLength={6}
                                                className="w-32 px-4 py-2.5 border-2 border-slate-200 rounded-lg text-center text-lg font-mono tracking-widest focus:border-blue-400 focus:outline-none transition"
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && handleVerifyCode()}
                                            />
                                            <button
                                                onClick={handleVerifyCode}
                                                disabled={isLoading || code.length !== 6}
                                                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2 text-sm"
                                            >
                                                {isLoading ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Check size={16} />
                                                )}
                                                Verify
                                            </button>
                                        </div>
                                        
                                        {error && (
                                            <p className="text-red-600 text-sm mb-2">{error}</p>
                                        )}
                                        
                                        <div className="flex items-center gap-3 text-sm">
                                            <button
                                                onClick={() => { setStep('email'); setCode(''); setError(''); }}
                                                className="text-slate-500 hover:text-slate-700"
                                            >
                                                ← Change email
                                            </button>
                                            <button
                                                onClick={handleSendCode}
                                                disabled={isLoading}
                                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                                className="p-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheck size={24} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-emerald-800">
                                            ✅ Email Saved Successfully!
                                        </h3>
                                        <p className="text-emerald-600 text-sm">
                                            You can now recover your polls at <strong>votegenerator.com/recover</strong>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Dismiss Warning Modal */}
            <AnimatePresence>
                {showDismissWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={handleCancelDismiss}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <AlertCircle size={24} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Are You Sure?</h3>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-slate-700 mb-4">
                                    <strong>Without saving your email or bookmarking this page, you may permanently lose access to your polls.</strong>
                                </p>
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                    <p className="text-amber-800 text-sm">
                                        <strong>⚠️ We cannot recover your polls</strong> if you lose access to this browser session. This action cannot be undone.
                                    </p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelDismiss}
                                        className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition"
                                    >
                                        Cancel - Keep Banner
                                    </button>
                                    <button
                                        onClick={handleConfirmDismiss}
                                        className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition"
                                    >
                                        I Understand, Hide It
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmailCaptureBanner;
// ============================================================================
// DataDeletionPage.tsx - GDPR Data Deletion Request Form
// Location: src/pages/DataDeletionPage.tsx or src/components/DataDeletionPage.tsx
// 
// Implements GDPR Article 17 - Right to Erasure
// Two-step verification process:
// 1. User enters email → receives verification code
// 2. User enters code → data is deleted
// ============================================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Mail, Shield, AlertTriangle, Check, Loader2,
    ArrowRight, Lock, Key, HelpCircle, ChevronDown
} from 'lucide-react';

type Step = 'request' | 'verify' | 'complete';

const DataDeletionPage: React.FC = () => {
    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletionType, setDeletionType] = useState<'all' | 'polls'>('all');
    const [showFAQ, setShowFAQ] = useState(false);

    // Step 1: Request deletion (sends verification email)
    const handleRequestDeletion = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/vg-gdpr-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    requestType: deletionType === 'all' ? 'delete_all' : 'delete_poll',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send verification code');
            }

            setStep('verify');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify and delete
    const handleVerifyAndDelete = async () => {
        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/vg-gdpr-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    requestType: deletionType === 'all' ? 'delete_all' : 'delete_poll',
                    verificationCode: verificationCode.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete data');
            }

            setStep('complete');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 py-12 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="text-red-600" size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Delete My Data</h1>
                    <p className="text-slate-600">
                        Exercise your GDPR Right to Erasure (Article 17)
                    </p>
                </div>

                {/* Main Card */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
                    layout
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Request */}
                        {step === 'request' && (
                            <motion.div
                                key="request"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6"
                            >
                                {/* Warning */}
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <div className="flex gap-3">
                                        <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                                        <div className="text-sm">
                                            <p className="font-semibold text-red-800 mb-1">This action is permanent</p>
                                            <p className="text-red-700">
                                                Once deleted, your data cannot be recovered. This includes all polls, 
                                                votes, and account information.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Deletion Type */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        What would you like to delete?
                                    </label>
                                    <div className="space-y-2">
                                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                                            deletionType === 'all' 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="deletionType"
                                                checked={deletionType === 'all'}
                                                onChange={() => setDeletionType('all')}
                                                className="mt-1"
                                            />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Delete everything
                                                </span>
                                                <p className="text-sm text-slate-500">
                                                    All polls, votes, account data, and cancel any subscription
                                                </p>
                                            </div>
                                        </label>
                                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                                            deletionType === 'polls' 
                                                ? 'border-amber-300 bg-amber-50' 
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="deletionType"
                                                checked={deletionType === 'polls'}
                                                onChange={() => setDeletionType('polls')}
                                                className="mt-1"
                                            />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Delete polls only
                                                </span>
                                                <p className="text-sm text-slate-500">
                                                    Remove all polls and votes, but keep account for future use
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Enter the email associated with your VoteGenerator account
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleRequestDeletion}
                                    disabled={isLoading || !email.trim()}
                                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Sending verification...
                                        </>
                                    ) : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-slate-500 text-center mt-4">
                                    We'll send a verification code to confirm your identity
                                </p>
                            </motion.div>
                        )}

                        {/* Step 2: Verify */}
                        {step === 'verify' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6"
                            >
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Key className="text-indigo-600" size={24} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 mb-1">
                                        Check your email
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        We sent a verification code to <strong>{email}</strong>
                                    </p>
                                </div>

                                {/* Code Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                        placeholder="Enter 6-character code"
                                        maxLength={6}
                                        className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none uppercase"
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleVerifyAndDelete}
                                    disabled={isLoading || verificationCode.length < 6}
                                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Deleting data...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Confirm Deletion
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setStep('request')}
                                    className="w-full mt-3 py-2 text-slate-600 hover:text-slate-800 text-sm"
                                >
                                    ← Back to previous step
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Complete */}
                        {step === 'complete' && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-emerald-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">
                                    Data Deleted
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Your data has been permanently removed from our systems. 
                                    {deletionType === 'all' && ' Any active subscription has been cancelled.'}
                                </p>

                                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 mb-6">
                                    <p className="font-medium text-slate-700 mb-2">What was deleted:</p>
                                    <ul className="text-left space-y-1">
                                        <li>✓ All polls and surveys</li>
                                        <li>✓ All votes and responses</li>
                                        <li>✓ Analytics data</li>
                                        {deletionType === 'all' && (
                                            <>
                                                <li>✓ Account information</li>
                                                <li>✓ Subscription (if any)</li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                                >
                                    Return to Home
                                </a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* FAQ */}
                <div className="mt-8">
                    <button
                        onClick={() => setShowFAQ(!showFAQ)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition"
                    >
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                            <HelpCircle size={18} />
                            Frequently Asked Questions
                        </span>
                        <ChevronDown className={`text-slate-400 transition ${showFAQ ? 'rotate-180' : ''}`} size={18} />
                    </button>

                    {showFAQ && (
                        <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                            <div>
                                <h4 className="font-medium text-slate-800">How long does deletion take?</h4>
                                <p className="text-sm text-slate-600">
                                    Deletion is immediate. Your data is permanently removed as soon as you confirm.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">Can I recover my data after deletion?</h4>
                                <p className="text-sm text-slate-600">
                                    No. Deletion is permanent and cannot be undone. Please export your data first if needed.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">What if I have an active subscription?</h4>
                                <p className="text-sm text-slate-600">
                                    If you choose "Delete everything", your subscription will be cancelled immediately. 
                                    You won't be charged again.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800">I didn't receive the verification code</h4>
                                <p className="text-sm text-slate-600">
                                    Check your spam folder. If you still don't see it, try again or contact 
                                    privacy@votegenerator.com.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* GDPR Notice */}
                <div className="mt-6 text-center text-xs text-slate-500">
                    <p className="flex items-center justify-center gap-1">
                        <Shield size={12} />
                        Protected by GDPR Article 17 - Right to Erasure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataDeletionPage;
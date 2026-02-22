// ============================================================================
// DataDeletionPage.tsx - GDPR Data Deletion Request Form
// Implements GDPR Article 17 - Right to Erasure
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, Shield, AlertTriangle, Check, Loader2, ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

type Step = 'request' | 'verify' | 'complete';

const DataDeletionPage: React.FC = () => {
    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletionType, setDeletionType] = useState<'all' | 'polls'>('all');
    const [showFAQ, setShowFAQ] = useState(false);
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const handleRequestDeletion = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/gdpr-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'request', email, deletionType }),
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

    const handleVerifyAndDelete = async () => {
        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/gdpr-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'confirm', email, code: verificationCode, deletionType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify code');
            }

            setStep('complete');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}
            
            <div className="py-12 px-4">
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
                            {step === 'request' && (
                                <motion.div
                                    key="request"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-6"
                                >
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">Step 1: Request Deletion</h2>
                                    
                                    {/* Deletion Type */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            What would you like to delete?
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition">
                                                <input
                                                    type="radio"
                                                    name="deletionType"
                                                    value="all"
                                                    checked={deletionType === 'all'}
                                                    onChange={() => setDeletionType('all')}
                                                    className="text-red-600"
                                                />
                                                <div>
                                                    <div className="font-medium text-slate-900">Everything</div>
                                                    <div className="text-sm text-slate-500">All polls, votes, and your email</div>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition">
                                                <input
                                                    type="radio"
                                                    name="deletionType"
                                                    value="polls"
                                                    checked={deletionType === 'polls'}
                                                    onChange={() => setDeletionType('polls')}
                                                    className="text-red-600"
                                                />
                                                <div>
                                                    <div className="font-medium text-slate-900">Polls Only</div>
                                                    <div className="text-sm text-slate-500">Keep my email for future use</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Your email address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            We'll send a verification code to confirm it's you
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                            <AlertTriangle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleRequestDeletion}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Verification Code
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {step === 'verify' && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-6"
                                >
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">Step 2: Verify & Delete</h2>
                                    
                                    <p className="text-slate-600 mb-6">
                                        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to confirm deletion.
                                    </p>

                                    <div className="mb-6">
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            className="w-full text-center text-2xl tracking-widest py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            maxLength={6}
                                        />
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                                            <div className="text-sm text-amber-800">
                                                <strong>Warning:</strong> This action is permanent and cannot be undone. 
                                                All your data will be deleted within 30 days.
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                            <AlertTriangle size={16} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep('request')}
                                            className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleVerifyAndDelete}
                                            disabled={isLoading || verificationCode.length !== 6}
                                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={18} />
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={18} />
                                                    Delete My Data
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 'complete' && (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 text-center"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="text-emerald-600" size={32} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">Deletion Request Received</h2>
                                    <p className="text-slate-600 mb-6">
                                        Your data will be permanently deleted within 30 days. You'll receive a confirmation 
                                        email when the process is complete.
                                    </p>
                                    <a
                                        href="/"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
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
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mx-auto"
                        >
                            <HelpCircle size={18} />
                            <span>Frequently Asked Questions</span>
                            <ChevronDown className={`transition ${showFAQ ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        
                        {showFAQ && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 bg-white rounded-xl border border-slate-200 p-6 space-y-4"
                            >
                                <div>
                                    <h4 className="font-semibold text-slate-900">What data gets deleted?</h4>
                                    <p className="text-sm text-slate-600">All polls you created, votes on those polls, and your email address.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">How long does deletion take?</h4>
                                    <p className="text-sm text-slate-600">Up to 30 days to fully process and remove from backups.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Can I undo this?</h4>
                                    <p className="text-sm text-slate-600">No. Deletion is permanent and cannot be reversed.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        <p className="flex items-center justify-center gap-1">
                            <Shield size={12} />
                            Protected by GDPR Article 17 - Right to Erasure
                        </p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default DataDeletionPage;
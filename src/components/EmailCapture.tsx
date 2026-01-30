// ============================================================================
// EmailCapture.tsx - Optional email capture for poll recovery & notifications
// Location: src/components/EmailCapture.tsx
//
// PRIVACY-FIRST APPROACH:
// - Email is NEVER required
// - Confirmation email sent first (like paid flow)
// - Only asked at the RIGHT moments (not annoying)
// - Clear value proposition (recovery, notifications)
// - Easy to skip
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, X, Shield, Bell, Download, Key,
    Check, AlertCircle, Sparkles, ArrowRight,
    Lock, RefreshCw, Bookmark, Link2, Copy
} from 'lucide-react';

// ============================================================================
// 1. SAVE POLLS PROMPT - Shows after poll creation success
// Two-step verification like paid users:
// Step 1: Enter email → sends confirmation code
// Step 2: Enter code → saves email + sends admin link
// ============================================================================
interface SavePollsPromptProps {
    isOpen: boolean;
    onClose: () => void;
    pollId: string;
    pollTitle: string;
    adminUrl: string;
}

export const SavePollsPrompt: React.FC<SavePollsPromptProps> = ({
    isOpen,
    onClose,
    pollId,
    pollTitle,
    adminUrl,
}) => {
    const [step, setStep] = useState<'email' | 'verify' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showBackup, setShowBackup] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('email');
            setEmail('');
            setVerificationCode('');
            setError('');
        }
    }, [isOpen]);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/.netlify/functions/vg-save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    pollId,
                    pollTitle,
                    adminUrl,
                    action: 'send_code',
                }),
            });

            const data = await res.json();
            if (data.success) {
                setStep('verify');
            } else {
                setError(data.error || 'Failed to send code');
            }
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verificationCode.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/.netlify/functions/vg-save-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    pollId,
                    verificationCode: verificationCode.toUpperCase(),
                    action: 'verify',
                }),
            });

            const data = await res.json();
            if (data.success) {
                // Save to localStorage too
                localStorage.setItem(`vg_email_${pollId}`, email);
                setStep('success');
                // Auto-close after 3 seconds
                setTimeout(onClose, 3000);
            } else {
                setError(data.error || 'Invalid code');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadBackup = () => {
        const backup = {
            pollTitle,
            pollId,
            adminUrl,
            createdAt: new Date().toISOString(),
            note: 'Save this file to recover access to your poll. Keep it safe!',
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poll-backup-${pollTitle.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drag handle for mobile */}
                    <div className="sm:hidden flex justify-center pt-3">
                        <div className="w-10 h-1 bg-slate-300 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-5 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Key size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    {step === 'success' ? 'All Set!' : 'Save Your Poll Access'}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    {step === 'email' && 'Never lose your admin link'}
                                    {step === 'verify' && 'Check your email for the code'}
                                    {step === 'success' && 'Your admin link has been sent'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'success' ? (
                            <div className="text-center py-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Check className="text-emerald-600" size={32} />
                                </motion.div>
                                <h4 className="font-bold text-slate-800 mb-2">Email Verified!</h4>
                                <p className="text-sm text-slate-600">
                                    We've sent your admin link to <strong>{email}</strong>
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    You can recover access anytime at /recover
                                </p>
                            </div>
                        ) : step === 'verify' ? (
                            <>
                                {/* Verify Code Step */}
                                <div className="text-center mb-4">
                                    <Mail className="text-indigo-500 mx-auto mb-2" size={32} />
                                    <p className="text-sm text-slate-600">
                                        We sent a 6-character code to<br />
                                        <strong>{email}</strong>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyCode} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none uppercase"
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center justify-center gap-1">
                                                <AlertCircle size={12} />
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || verificationCode.length < 6}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <RefreshCw className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                Verify & Save
                                            </>
                                        )}
                                    </button>
                                </form>

                                <button
                                    onClick={() => setStep('email')}
                                    className="w-full mt-3 py-2 text-slate-500 hover:text-slate-700 text-sm"
                                >
                                    ← Use different email
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Email Step */}
                                <div className="space-y-2 mb-6">
                                    {[
                                        { icon: <Mail size={16} />, text: 'Get your admin link emailed to you' },
                                        { icon: <Bell size={16} />, text: 'Recover access if you clear cookies' },
                                        { icon: <Shield size={16} />, text: 'We never spam or share your email' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <span className="text-indigo-500">{item.icon}</span>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleSendCode} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !email.trim()}
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <RefreshCw className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                <Mail size={18} />
                                                Send Verification Code
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Alternative: Download backup */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setShowBackup(!showBackup)}
                                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                                    >
                                        <Download size={14} />
                                        Prefer to save locally instead?
                                    </button>
                                    
                                    {showBackup && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3 p-3 bg-slate-50 rounded-xl"
                                        >
                                            <p className="text-xs text-slate-600 mb-2">
                                                Download a backup file with your admin link:
                                            </p>
                                            <button
                                                onClick={downloadBackup}
                                                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg text-sm flex items-center justify-center gap-2"
                                            >
                                                <Download size={14} />
                                                Download Backup File
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Skip option */}
                                <button
                                    onClick={onClose}
                                    className="w-full mt-4 py-2 text-slate-500 hover:text-slate-700 text-sm"
                                >
                                    Skip for now
                                </button>

                                {/* Privacy note */}
                                <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1">
                                    <Lock size={10} />
                                    We'll only email your admin link. Unsubscribe anytime.
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// 2. ADMIN DASHBOARD BANNER - Different for free vs paid users
// ============================================================================
interface BookmarkBannerProps {
    adminUrl: string;
    hasEmail: boolean;
    onSaveEmail: () => void;
    tier?: 'free' | 'pro' | 'business';
    customerEmail?: string;
}

export const BookmarkBanner: React.FC<BookmarkBannerProps> = ({
    adminUrl,
    hasEmail,
    onSaveEmail,
    tier = 'free',
    customerEmail,
}) => {
    const [copied, setCopied] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Check if already dismissed this session
    useEffect(() => {
        const isDismissed = sessionStorage.getItem('vg_bookmark_banner_dismissed');
        if (isDismissed) setDismissed(true);
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(adminUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleDismiss = () => {
        sessionStorage.setItem('vg_bookmark_banner_dismissed', 'true');
        setDismissed(true);
    };

    // Don't show if dismissed
    if (dismissed) return null;

    // ========================================
    // PAID USERS - Show confirmation message
    // ========================================
    if (tier === 'pro' || tier === 'business') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-6"
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Check className="text-emerald-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                            ✅ {tier === 'pro' ? 'Pro' : 'Business'} Account Active
                        </h3>
                        <p className="text-sm text-emerald-700 mt-1">
                            Your admin links are saved to <strong>{customerEmail || 'your account email'}</strong>. 
                            You can recover access anytime at <a href="/recover" className="underline">/recover</a>.
                        </p>
                        
                        {/* Still offer copy link for convenience */}
                        <button
                            onClick={copyLink}
                            className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                            }`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                    
                    <button
                        onClick={handleDismiss}
                        className="text-emerald-400 hover:text-emerald-600 p-1"
                        title="Dismiss"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        );
    }

    // ========================================
    // FREE USERS WITH EMAIL - Show softer message
    // ========================================
    if (hasEmail) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6"
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-blue-800">
                            📧 Admin Link Saved
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                            We've emailed your admin link. You can recover access anytime at <a href="/recover" className="underline">/recover</a>.
                        </p>
                    </div>
                    
                    <button
                        onClick={handleDismiss}
                        className="text-blue-400 hover:text-blue-600 p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        );
    }

    // ========================================
    // FREE USERS WITHOUT EMAIL - Show warning
    // ========================================
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 mb-6"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bookmark className="text-amber-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-800 flex items-center gap-2">
                        ⚠️ Save This Page!
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                        <strong>This is your only way to access this dashboard.</strong> If you lose this link or clear your cookies, you'll lose access to your poll.
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button
                            onClick={copyLink}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                            }`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        
                        <button
                            onClick={onSaveEmail}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold transition"
                        >
                            <Mail size={16} />
                            Email Me This Link
                        </button>
                    </div>

                    {/* How to bookmark hint */}
                    <p className="text-xs text-amber-600 mt-3">
                        💡 Press <kbd className="px-1.5 py-0.5 bg-amber-100 rounded text-xs font-mono">Ctrl+D</kbd> (or <kbd className="px-1.5 py-0.5 bg-amber-100 rounded text-xs font-mono">⌘+D</kbd> on Mac) to bookmark this page
                    </p>
                </div>
                
                <button
                    onClick={handleDismiss}
                    className="text-amber-400 hover:text-amber-600 p-1"
                    title="Dismiss (not recommended)"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
};

// ============================================================================
// 3. POLL CREATED SUCCESS - Where links go
// After poll creation, shows:
// 1. Voting link (to share with voters)
// 2. Admin dashboard link (for creator to manage)
// 3. Option to save email
// ============================================================================
interface PollCreatedLinksProps {
    pollId: string;
    pollTitle: string;
    votingUrl: string;      // https://votegenerator.com/poll/abc123
    adminUrl: string;       // https://votegenerator.com/poll/abc123/admin/xyz789
    onSaveEmail: () => void;
}

export const PollCreatedLinks: React.FC<PollCreatedLinksProps> = ({
    pollId,
    pollTitle,
    votingUrl,
    adminUrl,
    onSaveEmail,
}) => {
    const [copiedVoting, setCopiedVoting] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);

    const copyVotingLink = () => {
        navigator.clipboard.writeText(votingUrl);
        setCopiedVoting(true);
        setTimeout(() => setCopiedVoting(false), 3000);
    };

    const copyAdminLink = () => {
        navigator.clipboard.writeText(adminUrl);
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 3000);
    };

    return (
        <div className="space-y-4">
            {/* Voting Link - Primary */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Link2 className="text-emerald-600" size={18} />
                    <span className="font-semibold text-emerald-800">Voting Link</span>
                    <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">Share this!</span>
                </div>
                <p className="text-xs text-emerald-600 mb-2">Send this link to your voters</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={votingUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-mono truncate"
                    />
                    <button
                        onClick={copyVotingLink}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition whitespace-nowrap ${
                            copiedVoting
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                    >
                        {copiedVoting ? <Check size={16} /> : <Copy size={16} />}
                        {copiedVoting ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Admin Link - Important warning */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Key className="text-amber-600" size={18} />
                    <span className="font-semibold text-amber-800">Admin Dashboard Link</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">SAVE THIS!</span>
                </div>
                <p className="text-xs text-amber-700 mb-2">
                    <strong>⚠️ Only you have this link.</strong> It's your only way to manage this poll.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={adminUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm font-mono truncate"
                    />
                    <button
                        onClick={copyAdminLink}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition whitespace-nowrap ${
                            copiedAdmin
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                    >
                        {copiedAdmin ? <Check size={16} /> : <Copy size={16} />}
                        {copiedAdmin ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                
                {/* Save options */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-amber-200">
                    <button
                        onClick={onSaveEmail}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                    >
                        <Mail size={14} />
                        Email Me This Link
                    </button>
                    <span className="text-xs text-amber-600 flex items-center">
                        or press <kbd className="mx-1 px-1.5 py-0.5 bg-amber-100 rounded font-mono">Ctrl+D</kbd> to bookmark
                    </span>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// 4. RECOVERY PAGE - For users who lost their admin link
// ============================================================================
interface RecoveryFormProps {
    onRecover: (email: string) => Promise<{ found: boolean; message: string }>;
}

export const RecoveryForm: React.FC<RecoveryFormProps> = ({ onRecover }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ found: boolean; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        setResult(null);

        try {
            const res = await onRecover(email);
            setResult(res);
        } catch (err) {
            setResult({ found: false, message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Key className="text-indigo-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Recover Your Polls</h1>
                <p className="text-slate-600">
                    Lost your admin link? If you saved your email with us, we can help.
                </p>
            </div>

            {result ? (
                <div className={`p-6 rounded-2xl ${result.found ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                        {result.found ? (
                            <Check className="text-emerald-600 flex-shrink-0" size={24} />
                        ) : (
                            <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                        )}
                        <div>
                            <h3 className={`font-bold ${result.found ? 'text-emerald-800' : 'text-amber-800'}`}>
                                {result.found ? 'Check Your Email!' : 'No Polls Found'}
                            </h3>
                            <p className={`text-sm mt-1 ${result.found ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {result.message}
                            </p>
                        </div>
                    </div>
                    {!result.found && (
                        <button
                            onClick={() => setResult(null)}
                            className="mt-4 w-full py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 font-medium rounded-lg text-sm"
                        >
                            Try Another Email
                        </button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter the email you used"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <RefreshCw className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Mail size={18} />
                                Send Recovery Email
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Alternative Recovery */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-700 mb-2">Didn't save your email?</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        Check your browser history for "votegenerator.com/poll"
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        Look in your bookmarks
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        If you downloaded a backup file, you can restore from it
                    </li>
                </ul>
            </div>
        </div>
    );
};

// ============================================================================
// 5. BACKUP FILE RESTORE - Upload downloaded backup to recover access
// Used on /recover page as alternative recovery method
// ============================================================================
interface BackupRestoreProps {
    onRestore?: (adminUrl: string) => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ onRestore }) => {
    const [restored, setRestored] = useState<{ pollTitle: string; adminUrl: string } | null>(null);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (!file.name.endsWith('.json')) {
            setError('Please upload a .json backup file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target?.result as string);
                if (backup.adminUrl && backup.pollTitle) {
                    setRestored(backup);
                    setError('');
                    if (onRestore) {
                        onRestore(backup.adminUrl);
                    }
                } else {
                    setError('Invalid backup file - missing required data');
                }
            } catch {
                setError('Could not read backup file - invalid JSON');
            }
        };
        reader.onerror = () => {
            setError('Failed to read file');
        };
        reader.readAsText(file);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`p-6 border-2 border-dashed rounded-xl transition-colors ${
                isDragging 
                    ? 'border-indigo-400 bg-indigo-50' 
                    : 'border-slate-200 hover:border-slate-300'
            }`}
        >
            {restored ? (
                <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="text-emerald-600" size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">Backup Restored!</h4>
                    <p className="text-sm text-slate-600 mb-4">
                        Found: <strong>{restored.pollTitle}</strong>
                    </p>
                    <a
                        href={restored.adminUrl}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                    >
                        Go to Poll Dashboard
                        <ArrowRight size={16} />
                    </a>
                </div>
            ) : (
                <label className="cursor-pointer block text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Download className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-700 font-medium mb-1">
                        Drop backup file here
                    </p>
                    <p className="text-sm text-slate-500 mb-3">
                        or <span className="text-indigo-600 underline">browse</span> to select
                    </p>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    {error && (
                        <p className="text-red-500 text-sm flex items-center justify-center gap-1 mt-2">
                            <AlertCircle size={14} />
                            {error}
                        </p>
                    )}
                    <p className="text-xs text-slate-400 mt-3">
                        Looking for a file like: poll-backup-*.json
                    </p>
                </label>
            )}
        </div>
    );
};

// ============================================================================
// HOOK: useEmailCapture - Track email state for a poll
// ============================================================================
export const useEmailCapture = (pollId: string) => {
    const [hasEmail, setHasEmail] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);

    useEffect(() => {
        // Check if email already saved for this poll
        const savedEmail = localStorage.getItem(`vg_email_${pollId}`);
        if (savedEmail) {
            setHasEmail(true);
        }
    }, [pollId]);

    const openSavePrompt = () => setShowSavePrompt(true);
    const closeSavePrompt = () => setShowSavePrompt(false);

    return {
        hasEmail,
        showSavePrompt,
        openSavePrompt,
        closeSavePrompt,
        setHasEmail,
    };
};

export default {
    SavePollsPrompt,
    BookmarkBanner,
    PollCreatedLinks,
    RecoveryForm,
    BackupRestore,
    useEmailCapture,
};
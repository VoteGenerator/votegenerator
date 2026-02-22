// ============================================================================
// ManageSubscription.tsx - Secure Subscription Management Page
// Location: src/components/ManageSubscription.tsx
// Security: Uses magic link via email - no data exposed without verification
// GDPR: No personal data shown until email verified
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, Mail, Loader2, CheckCircle, 
    ArrowRight, Shield, Send, Inbox,
    HelpCircle, ChevronDown, ExternalLink
} from 'lucide-react';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

const ManageSubscription: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [returnedFromPortal, setReturnedFromPortal] = useState(false);
    const [showFaq, setShowFaq] = useState<string | null>(null);
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Check URL for success param (returning from Stripe portal)
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('success=true')) {
            setReturnedFromPortal(true);
            // Clean up URL
            window.history.replaceState(null, '', window.location.pathname + '#manage-subscription');
        }
        
        // Detect tier from localStorage
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) return;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return;

        setIsLoading(true);

        try {
            await fetch('/.netlify/functions/vg-send-portal-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            });

            // SECURITY: Always show success regardless of whether email exists
            // This prevents email enumeration attacks
            setEmailSent(true);

        } catch (err) {
            // Even on error, show success (security - don't reveal system state)
            setEmailSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    const faqs = [
        {
            id: 'cancel',
            question: 'How do I cancel my subscription?',
            answer: 'Enter your email above and we\'ll send you a secure link. Click it to access your subscription settings where you can cancel anytime. Your access continues until the end of your billing period.'
        },
        {
            id: 'refund',
            question: 'Can I get a refund?',
            answer: 'We offer a 14-day money-back guarantee. If you\'re not satisfied within the first 14 days, contact support@votegenerator.com for a full refund.'
        },
        {
            id: 'change-plan',
            question: 'Can I change my plan?',
            answer: 'Yes! Access your subscription settings via the link we email you, then click "Update plan" to upgrade or downgrade. Changes take effect immediately with prorated billing.'
        },
        {
            id: 'payment',
            question: 'How do I update my payment method?',
            answer: 'In the subscription portal, click "Payment methods" to add a new card or update your existing payment information securely.'
        },
        {
            id: 'invoices',
            question: 'Where can I find my invoices?',
            answer: 'All invoices are available in the subscription portal under "Billing history". You can download PDF invoices for your records.'
        },
        {
            id: 'security',
            question: 'Why do I need to verify via email?',
            answer: 'For your security and privacy (GDPR compliance), we verify your identity by sending a secure link to your email. This ensures only you can access and modify your subscription. Links expire after 1 hour.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex flex-col">
            {/* Header - PremiumNav for paid users */}
            {tier !== 'free' ? (
                <PremiumNav tier={tier} />
            ) : (
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <a href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm mb-4">
                            ← Back to VoteGenerator
                        </a>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <CreditCard className="text-indigo-600" size={32} />
                            Manage Subscription
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Update payment methods, change plans, view invoices, or cancel
                        </p>
                    </div>
                </div>
            )}
            
            {/* Page Title for Paid Users */}
            {tier !== 'free' && (
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <CreditCard className="text-indigo-600" size={32} />
                            Manage Subscription
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Update payment methods, change plans, view invoices, or cancel
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Success: Returned from Portal */}
                <AnimatePresence>
                    {returnedFromPortal && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4"
                        >
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="text-emerald-600" size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800 text-lg">Changes Saved!</p>
                                <p className="text-emerald-700 mt-1">
                                    Your subscription has been updated successfully.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield size={20} className="text-indigo-600" />
                                    <h2 className="text-xl font-bold text-slate-800">Secure Access</h2>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Enter your email and we'll send you a secure link to manage your subscription
                                </p>
                            </div>

                            <AnimatePresence mode="wait">
                                {!emailSent ? (
                                    /* Email Form */
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit} 
                                        className="p-6 space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none transition-colors"
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Use the same email you entered during checkout
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || !email.trim()}
                                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Sending link...
                                                </>
                                            ) : (
                                                <>
                                                    Send Secure Link
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                                            <Shield size={16} className="text-slate-400 flex-shrink-0" />
                                            <span>
                                                For your security, we verify access via email. Links expire in 1 hour.
                                            </span>
                                        </div>
                                    </motion.form>
                                ) : (
                                    /* Success State - Email Sent */
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-8 text-center"
                                    >
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Send className="text-emerald-600" size={36} />
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                            Check Your Email
                                        </h3>
                                        
                                        <p className="text-slate-600 mb-6">
                                            If an account exists with <span className="font-semibold text-indigo-600">{email}</span>, 
                                            you'll receive a secure link within a few minutes.
                                        </p>
                                        
                                        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                                            <div className="flex items-start gap-3">
                                                <Inbox size={20} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-slate-600">
                                                    <p className="font-medium text-slate-700 mb-1">Next steps:</p>
                                                    <ol className="list-decimal list-inside space-y-1">
                                                        <li>Open your email inbox</li>
                                                        <li>Look for email from VoteGenerator</li>
                                                        <li>Click "Access Subscription Settings"</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-slate-500 mb-6">
                                            Don't see it? Check your spam folder. Link expires in 1 hour.
                                        </p>
                                        
                                        <button
                                            onClick={() => {
                                                setEmailSent(false);
                                                setEmail('');
                                            }}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Use a different email
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* What You Can Do */}
                        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">What you can do in the portal:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: '💳', label: 'Update payment method' },
                                    { icon: '📊', label: 'Change your plan' },
                                    { icon: '🧾', label: 'View & download invoices' },
                                    { icon: '❌', label: 'Cancel subscription' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-slate-500" />
                                    Frequently Asked
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {faqs.map((faq) => (
                                    <div key={faq.id}>
                                        <button
                                            onClick={() => setShowFaq(showFaq === faq.id ? null : faq.id)}
                                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-slate-700 pr-4">
                                                {faq.question}
                                            </span>
                                            <ChevronDown 
                                                size={16} 
                                                className={`text-slate-400 flex-shrink-0 transition-transform ${
                                                    showFaq === faq.id ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {showFaq === faq.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-4 pb-3"
                                                >
                                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                                        {faq.answer}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                            <h4 className="font-semibold text-slate-800 mb-2">Need Help?</h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Can't access your subscription or have billing questions? We're here to help.
                            </p>
                            <a 
                                href="mailto:support@votegenerator.com"
                                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-lg border border-indigo-200"
                            >
                                <Mail size={16} />
                                support@votegenerator.com
                                <ExternalLink size={12} />
                            </a>
                        </div>

                        {/* Privacy Note */}
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                            <p className="flex items-start gap-2">
                                <Shield size={14} className="mt-0.5 flex-shrink-0" />
                                <span>
                                    <strong>Privacy & GDPR:</strong> We never store or display your payment details. 
                                    Billing is handled securely by Stripe. We comply with GDPR and PCI-DSS standards.
                                    No personal data is revealed without email verification.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default ManageSubscription;
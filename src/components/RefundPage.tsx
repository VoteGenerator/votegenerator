// ============================================================================
// RefundPage.tsx - Simple, Clear Refund Policy
// Location: src/components/RefundPage.tsx
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Mail, CreditCard, RefreshCw } from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

const RefundPage: React.FC = () => {
    const lastUpdated = "February 2025";
    
    return (
        <div className="min-h-screen bg-white">
            <NavHeader />
            
            <header className="pt-16 md:pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 mb-4"
                    >
                        Refund Policy
                    </motion.h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>
            </header>
            
            <article className="max-w-2xl mx-auto px-4 pb-20">
                
                {/* The Short Version */}
                <div className="mb-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">The Short Version</h2>
                    <p className="text-slate-700 text-lg">
                        <strong>14-day money-back guarantee</strong> on your first purchase. No questions asked. After that, you can cancel anytime and keep access until your billing period ends.
                    </p>
                </div>

                {/* Full Refunds */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Full Refunds</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <Check className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">First purchase — within 14 days</p>
                                <p className="text-slate-600 text-sm">Full refund to your original payment method. No questions asked.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <Check className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Service issues</p>
                                <p className="text-slate-600 text-sm">If we fail to provide the service as described, contact us for a refund.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plan Changes */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <RefreshCw size={20} className="text-indigo-500" />
                        Plan Changes
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <CreditCard className="text-indigo-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Upgrading (Pro → Business)</p>
                                <p className="text-slate-600 text-sm">You're charged the prorated difference immediately. Your unused Pro time is credited toward the upgrade.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <CreditCard className="text-indigo-500 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Downgrading (Business → Pro)</p>
                                <p className="text-slate-600 text-sm">Your unused Business time becomes credit applied to future invoices. The change takes effect at your next billing date.</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mt-4 italic">
                        Plan changes are handled automatically by Stripe. Credit is applied to your account, not refunded to your card.
                    </p>
                </div>

                {/* Not Refundable */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Not Eligible for Refund</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <X className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Refund requests after 14 days</p>
                                <p className="text-slate-600 text-sm">You can still cancel anytime — you'll keep access until your billing period ends.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <X className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Subscription renewals</p>
                                <p className="text-slate-600 text-sm">We send a reminder 7 days before renewal so you can cancel if needed.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                            <X className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-medium text-slate-900">Partial months</p>
                                <p className="text-slate-600 text-sm">When you cancel mid-cycle, you keep access until the period ends. No partial refunds.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cancellation */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Cancellation</h2>
                    <div className="prose prose-slate max-w-none">
                        <p>
                            Cancel anytime from your <a href="/#manage-subscription" className="text-indigo-600 hover:underline">account dashboard</a>. When you cancel:
                        </p>
                        <ul>
                            <li><strong>You keep access</strong> to all paid features until your billing period ends</li>
                            <li><strong>Your polls and data stay safe</strong> — nothing is deleted</li>
                            <li><strong>You won't be charged again</strong> unless you resubscribe</li>
                        </ul>
                    </div>
                </div>

                {/* How to Request */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">How to Request a Refund</h2>
                    <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="text-indigo-600" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 mb-2">Email us at billing@votegenerator.com</p>
                                <ul className="text-slate-600 text-sm space-y-1">
                                    <li>• Include the email address used to purchase</li>
                                    <li>• We'll process your refund within 5-7 business days</li>
                                    <li>• Refunds appear on your statement within 5-10 business days</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Issues */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Questions About Your Bill?</h2>
                    <div className="prose prose-slate max-w-none">
                        <p>
                            See a charge you don't recognize? Contact us at <a href="mailto:billing@votegenerator.com" className="text-indigo-600 hover:underline">billing@votegenerator.com</a> before disputing with your bank. We can usually resolve billing issues faster than the chargeback process.
                        </p>
                    </div>
                </div>

                {/* Free Tier Note */}
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                    <p className="text-slate-600">
                        <strong>Not sure yet?</strong> Try VoteGenerator free — 100 responses per poll, no credit card required.
                    </p>
                </div>

            </article>
            
            <Footer />
        </div>
    );
};

export default RefundPage;
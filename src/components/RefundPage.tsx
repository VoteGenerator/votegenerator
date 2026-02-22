// ============================================================================
// RefundPage.tsx - Simple, Clear Refund Policy
// Location: src/components/RefundPage.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Mail, CreditCard, RefreshCw } from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

const RefundPage: React.FC = () => {
    const lastUpdated = "February 2025";
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');
    
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);
    
    return (
        <div className="min-h-screen bg-white">
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}
            
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
            
            <main className="max-w-2xl mx-auto px-4 pb-20">
                <div className="prose prose-slate prose-lg max-w-none">
                    
                    {/* 14-Day Guarantee */}
                    <section className="mb-12">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Check className="text-emerald-600" size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900 m-0">14-Day Money-Back Guarantee</h2>
                            </div>
                            <p className="text-emerald-800 m-0">
                                Not satisfied with your first purchase? Get a full refund within 14 days. No questions asked.
                            </p>
                        </div>
                    </section>

                    {/* Eligible for Refund */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligible for Refund</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Check className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">First-time purchases within 14 days</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">Both monthly and annual plans</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">Pro and Business tiers</span>
                            </li>
                        </ul>
                    </section>

                    {/* Not Eligible */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Not Eligible for Refund</h2>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">Requests made after 14 days</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">Subscription renewals (only first purchase)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X className="text-red-500 mt-1 flex-shrink-0" size={20} />
                                <span className="text-slate-600">Partial months of service</span>
                            </li>
                        </ul>
                    </section>

                    {/* Plan Changes */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <RefreshCw size={24} />
                            Plan Changes (Upgrades & Downgrades)
                        </h2>
                        
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Upgrading (Pro → Business)</h3>
                                <p className="text-slate-600 text-base">
                                    You're charged the prorated difference immediately. Your unused Pro time 
                                    is credited toward Business.
                                </p>
                            </div>
                            
                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="font-semibold text-slate-900 mb-2">Downgrading (Business → Pro)</h3>
                                <p className="text-slate-600 text-base">
                                    Your unused Business time is applied as credit toward future Pro invoices. 
                                    <strong className="text-slate-900"> Credit is applied to your account, not refunded to your card.</strong>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cancellation */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Cancellation</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            You can cancel your subscription anytime from your dashboard. When you cancel:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You keep access until the end of your billing period</li>
                            <li>Your polls remain active during this time</li>
                            <li>After expiration, your polls convert to free tier limits</li>
                        </ul>
                        <p className="text-slate-600 mt-4">
                            <a href="/#manage-subscription" className="text-indigo-600 hover:underline font-medium">
                                Manage your subscription →
                            </a>
                        </p>
                    </section>

                    {/* How to Request */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Mail size={24} />
                            How to Request a Refund
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Email us at <a href="mailto:billing@votegenerator.com" className="text-indigo-600 hover:underline font-medium">billing@votegenerator.com</a> with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>The email address used for purchase</li>
                            <li>Your reason for requesting a refund (optional but helpful)</li>
                        </ul>
                        <p className="text-slate-600 mt-4">
                            Refunds are typically processed within 5-7 business days and appear on your 
                            statement within 1-2 billing cycles.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions?</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about our refund policy, contact us at:
                        </p>
                        <p className="text-slate-600 mt-4">
                            <strong>Email:</strong> <a href="mailto:billing@votegenerator.com" className="text-indigo-600 hover:underline">billing@votegenerator.com</a>
                        </p>
                    </section>

                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default RefundPage;
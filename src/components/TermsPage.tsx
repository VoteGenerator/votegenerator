// ============================================================================
// TermsPage.tsx - Terms of Service
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

const TermsPage: React.FC = () => {
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
                        Terms of Service
                    </motion.h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>
            </header>
            
            <main className="max-w-2xl mx-auto px-4 pb-20">
                <div className="prose prose-slate prose-lg max-w-none">
                    
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing or using VoteGenerator ("Service"), you agree to be bound by these 
                            Terms of Service. If you disagree with any part of these terms, you may not 
                            access the Service.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                        <p className="text-slate-600 leading-relaxed">
                            VoteGenerator provides online tools for creating polls, surveys, and collecting 
                            feedback. The Service is available in free and paid tiers with varying features 
                            and limitations.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            VoteGenerator does not require account creation. Instead, you receive unique links 
                            to manage your polls. You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Keeping your admin links secure and confidential</li>
                            <li>All activity that occurs through your admin links</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">You agree NOT to use VoteGenerator to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Violate any laws or regulations</li>
                            <li>Collect personal data without consent</li>
                            <li>Distribute malware, spam, or harmful content</li>
                            <li>Harass, abuse, or harm others</li>
                            <li>Impersonate individuals or organizations</li>
                            <li>Manipulate poll results fraudulently</li>
                            <li>Overwhelm our systems with excessive requests</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Content</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Your Content</h3>
                        <p className="text-slate-600 leading-relaxed">
                            You retain ownership of content you create. By using VoteGenerator, you grant us 
                            a license to store, display, and process your content as needed to provide the Service.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Content Moderation</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to remove content that violates these terms, including but not 
                            limited to illegal content, hate speech, harassment, or explicit material.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Paid Subscriptions</h2>
                        
                        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Billing</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Paid plans are billed in advance on a monthly or annual basis. Prices are in USD 
                            and may change with notice.
                        </p>

                        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Cancellation</h3>
                        <p className="text-slate-600 leading-relaxed">
                            You may cancel your subscription at any time. Access continues until the end of 
                            your billing period. See our <a href="/refund" className="text-indigo-600 hover:underline">Refund Policy</a> for details.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Free Tier Limitations</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Maximum 100 responses per poll</li>
                            <li>Polls active for 30 days</li>
                            <li>Poll history retained for 90 days</li>
                            <li>Advertisements displayed to voters</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            VoteGenerator and its original content, features, and functionality are owned by 
                            us and protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Third-Party Services</h2>
                        <p className="text-slate-600 leading-relaxed">
                            VoteGenerator integrates with third-party services (Stripe, Google, etc.). Your use 
                            of these services is subject to their respective terms and privacy policies.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Disclaimer of Warranties</h2>
                        <p className="text-slate-600 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE 
                            THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF 
                            THE SERVICE.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Indemnification</h2>
                        <p className="text-slate-600 leading-relaxed">
                            You agree to indemnify and hold harmless VoteGenerator from any claims, damages, 
                            or expenses arising from your use of the Service or violation of these terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Termination</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We may terminate or suspend your access immediately, without prior notice, for 
                            conduct that we believe violates these terms or is harmful to other users or us.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify you of 
                            material changes by posting the new terms and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Governing Law</h2>
                        <p className="text-slate-600 leading-relaxed">
                            These terms shall be governed by the laws of the State of Delaware, United States, 
                            without regard to conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have questions about these terms, contact us at:
                        </p>
                        <p className="text-slate-600 mt-4">
                            <strong>Email:</strong> <a href="mailto:legal@votegenerator.com" className="text-indigo-600 hover:underline">legal@votegenerator.com</a>
                        </p>
                    </section>

                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default TermsPage;
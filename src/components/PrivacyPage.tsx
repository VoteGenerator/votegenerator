// ============================================================================
// PrivacyPage.tsx - Privacy Policy
// Services: Google Analytics, Pinterest, AdSense, ipinfo, Cloudinary, Stripe
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

const PrivacyPage: React.FC = () => {
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
                        Privacy Policy
                    </motion.h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>
            </header>
            
            <article className="max-w-2xl mx-auto px-4 pb-20">
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                    
                    <p>
                        VoteGenerator ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our website and services.
                    </p>

                    <h2>Our Privacy-First Approach</h2>
                    
                    <p>
                        VoteGenerator is built with privacy at its core:
                    </p>
                    
                    <ul>
                        <li><strong>No account required</strong> — You don't need to sign up or provide an email to create polls or vote</li>
                        <li><strong>No email collection from voters</strong> — Voters remain anonymous by default</li>
                        <li><strong>Data stored in links</strong> — Poll data is encoded in shareable URLs, minimizing server-side storage</li>
                        <li><strong>Anonymous Mode</strong> — For surveys, creators can enable Anonymous Mode where even they cannot see individual responses</li>
                    </ul>

                    <h2>Information We Collect</h2>
                    
                    <h3>Information You Provide</h3>
                    <ul>
                        <li><strong>Poll/Survey Content</strong> — Questions, options, and settings you create</li>
                        <li><strong>Votes & Responses</strong> — Answers submitted to polls and surveys</li>
                        <li><strong>Contact Information</strong> — If you contact us or subscribe to notifications</li>
                        <li><strong>Payment Information</strong> — If you purchase a Pro or Business plan (processed by Stripe)</li>
                    </ul>
                    
                    <h3>Information Collected Automatically</h3>
                    <ul>
                        <li><strong>Device Information</strong> — Browser type, operating system, device type</li>
                        <li><strong>Usage Data</strong> — Pages visited, features used, time spent</li>
                        <li><strong>IP Address</strong> — Used for fraud prevention and approximate location</li>
                        <li><strong>Cookies</strong> — For functionality and analytics (see Cookies section)</li>
                    </ul>

                    <h2>Third-Party Services We Use</h2>
                    
                    <p>We use the following third-party services to operate VoteGenerator:</p>

                    <h3>Google Analytics</h3>
                    <p>
                        We use Google Analytics to understand how visitors use our website. Google Analytics collects information such as how often users visit, what pages they view, and what other sites they used prior to coming to our site. We use this information to improve our website and services.
                    </p>
                    <p>
                        Google Analytics uses cookies to collect this information. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
                    </p>

                    <h3>Google AdSense</h3>
                    <p>
                        We display advertisements through Google AdSense to support our free tier. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
                    </p>

                    <h3>Stripe</h3>
                    <p>
                        We use Stripe to process payments for Pro and Business subscriptions. When you make a payment, your payment information is sent directly to Stripe and is not stored on our servers. Stripe may collect information necessary to process your payment, including your name, email, and payment card details.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">https://stripe.com/privacy</a>
                    </p>

                    <h3>Cloudinary</h3>
                    <p>
                        We use Cloudinary for image hosting and processing, including logos uploaded for branded polls and images used in Visual Polls. Images you upload are stored on Cloudinary's servers.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">https://cloudinary.com/privacy</a>
                    </p>

                    <h3>ipinfo.io</h3>
                    <p>
                        We use ipinfo.io to determine approximate geographic location based on IP address. This is used for analytics (geographic distribution of responses) and fraud prevention. We do not store precise location data.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://ipinfo.io/privacy-policy" target="_blank" rel="noopener noreferrer">https://ipinfo.io/privacy-policy</a>
                    </p>

                    <h3>Pinterest</h3>
                    <p>
                        We use the Pinterest Tag to measure the effectiveness of our advertising on Pinterest. If you arrived at our site from a Pinterest ad, the Pinterest Tag may collect information about your visit.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://policy.pinterest.com/privacy-policy" target="_blank" rel="noopener noreferrer">https://policy.pinterest.com/privacy-policy</a>
                    </p>

                    <h3>Netlify</h3>
                    <p>
                        We use Netlify for website hosting and serverless functions. Netlify processes requests to our website and may collect technical information such as IP addresses for security and performance purposes.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://www.netlify.com/privacy" target="_blank" rel="noopener noreferrer">https://www.netlify.com/privacy</a>
                    </p>

                    <h3>Resend</h3>
                    <p>
                        We use Resend to send transactional emails such as notification alerts and verification emails. When you provide an email address for notifications, it is processed by Resend to deliver emails on our behalf.
                    </p>
                    <p>
                        <strong>Privacy Policy:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://resend.com/legal/privacy-policy</a>
                    </p>

                    <h2>How We Use Your Information</h2>
                    
                    <ul>
                        <li>To provide and maintain our services</li>
                        <li>To process transactions and send related information</li>
                        <li>To detect, prevent, and address fraud and abuse</li>
                        <li>To analyze usage and improve our services</li>
                        <li>To communicate with you about updates or support</li>
                        <li>To display relevant advertisements (free tier only)</li>
                    </ul>

                    <h2>Anti-Fraud Measures</h2>
                    
                    <p>
                        To maintain poll integrity, we use various fraud prevention techniques including:
                    </p>
                    <ul>
                        <li>Browser fingerprinting to detect duplicate votes</li>
                        <li>IP address analysis to identify suspicious patterns</li>
                        <li>Rate limiting to prevent automated submissions</li>
                        <li>Honeypot fields to detect bots</li>
                    </ul>
                    <p>
                        This information is used solely for fraud prevention and is not shared with third parties.
                    </p>

                    <h2>Cookies</h2>
                    
                    <p>We use the following types of cookies:</p>
                    
                    <ul>
                        <li><strong>Essential Cookies</strong> — Required for basic functionality (e.g., remembering if you've voted)</li>
                        <li><strong>Analytics Cookies</strong> — Help us understand how visitors use our site (Google Analytics)</li>
                        <li><strong>Advertising Cookies</strong> — Used to show relevant ads (Google AdSense, Pinterest)</li>
                    </ul>
                    
                    <p>
                        You can control cookies through your browser settings. Note that disabling cookies may affect site functionality.
                    </p>

                    <h2>Data Retention</h2>
                    
                    <p>
                        Poll and survey data is retained based on your plan:
                    </p>
                    <ul>
                        <li><strong>Free</strong> — Polls remain active for 30 days, with 90 days of history before automatic deletion</li>
                        <li><strong>Pro</strong> — Polls retained for 1 year</li>
                        <li><strong>Business</strong> — Unlimited retention</li>
                    </ul>
                    <p>
                        You can delete your polls at any time from your dashboard.
                    </p>

                    <h2>Data Security</h2>
                    
                    <p>
                        We implement appropriate technical and organizational measures to protect your data, including:
                    </p>
                    <ul>
                        <li>HTTPS encryption for all data transmission</li>
                        <li>Secure cloud infrastructure</li>
                        <li>Regular security audits</li>
                        <li>Limited access to personal data</li>
                    </ul>

                    <h2>Your Rights</h2>
                    
                    <p>Depending on your location, you may have the right to:</p>
                    <ul>
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing of your data</li>
                        <li>Request data portability</li>
                    </ul>
                    <p>
                        To exercise these rights, contact us at privacy@votegenerator.com.
                    </p>

                    <h2>Children's Privacy</h2>
                    
                    <p>
                        Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.
                    </p>

                    <h2>Changes to This Policy</h2>
                    
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>

                    <h2>Contact Us</h2>
                    
                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul>
                        <li>Email: privacy@votegenerator.com</li>
                        <li>Contact form: <a href="/contact">/contact</a></li>
                    </ul>

                </div>
            </article>
            
            <Footer />
        </div>
    );
};

export default PrivacyPage;
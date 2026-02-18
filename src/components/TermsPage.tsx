// ============================================================================
// TermsPage.tsx - Terms of Service
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import NavHeader from './NavHeader';
import Footer from './Footer';

const TermsPage: React.FC = () => {
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
                        Terms of Service
                    </motion.h1>
                    <p className="text-slate-500">Last updated: {lastUpdated}</p>
                </div>
            </header>
            
            <article className="max-w-2xl mx-auto px-4 pb-20">
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
                    
                    <p>
                        Welcome to VoteGenerator. By using our website and services, you agree to these Terms of Service. Please read them carefully.
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    
                    <p>
                        By accessing or using VoteGenerator ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                    </p>

                    <h2>2. Description of Service</h2>
                    
                    <p>
                        VoteGenerator provides online tools for creating polls, surveys, and collecting feedback. The Service includes:
                    </p>
                    <ul>
                        <li>Free tier with basic features and usage limits</li>
                        <li>Pro and Business paid plans with additional features</li>
                        <li>Related websites, APIs, and applications</li>
                    </ul>

                    <h2>3. User Accounts</h2>
                    
                    <p>
                        VoteGenerator does not require user accounts for basic functionality. However:
                    </p>
                    <ul>
                        <li>Paid subscriptions require payment information</li>
                        <li>You are responsible for maintaining the confidentiality of your admin links</li>
                        <li>You are responsible for all activities that occur under your admin links</li>
                        <li>You must notify us immediately of any unauthorized use</li>
                    </ul>

                    <h2>4. Acceptable Use</h2>
                    
                    <p>You agree NOT to use the Service to:</p>
                    <ul>
                        <li>Create polls or surveys that are illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                        <li>Collect personal information from minors</li>
                        <li>Impersonate any person or entity</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Attempt to gain unauthorized access to any part of the Service</li>
                        <li>Use automated systems (bots, scrapers) without permission</li>
                        <li>Manipulate poll results through fraudulent voting</li>
                        <li>Send spam or unsolicited messages through the Service</li>
                        <li>Violate any applicable laws or regulations</li>
                    </ul>

                    <h2>5. Content</h2>
                    
                    <h3>Your Content</h3>
                    <p>
                        You retain ownership of content you create (poll questions, survey text, etc.). By using the Service, you grant us a license to host, display, and distribute your content as necessary to provide the Service.
                    </p>
                    
                    <h3>Content Moderation</h3>
                    <p>
                        We reserve the right to remove any content that violates these Terms or is otherwise objectionable, at our sole discretion. We are not obligated to monitor all content but may do so.
                    </p>
                    
                    <h3>Respondent Content</h3>
                    <p>
                        You are responsible for how you use responses collected through the Service. You must comply with applicable privacy laws when collecting and using personal information.
                    </p>

                    <h2>6. Paid Subscriptions</h2>
                    
                    <h3>Billing</h3>
                    <ul>
                        <li>Pro and Business plans are billed monthly or annually</li>
                        <li>Payments are processed securely through Stripe</li>
                        <li>Prices are in USD and subject to change with 30 days notice</li>
                        <li>You authorize us to charge your payment method on a recurring basis</li>
                    </ul>
                    
                    <h3>Cancellation</h3>
                    <ul>
                        <li>You may cancel your subscription at any time</li>
                        <li>Cancellation takes effect at the end of your current billing period</li>
                        <li>You will retain access to paid features until the end of your billing period</li>
                        <li>See our <a href="/refund">Refund Policy</a> for refund eligibility</li>
                    </ul>

                    <h2>7. Free Tier Limitations</h2>
                    
                    <p>The free tier includes:</p>
                    <ul>
                        <li>Up to 100 responses per poll</li>
                        <li>Polls remain active for 30 days (90 days total before deletion)</li>
                        <li>Advertisements may be displayed</li>
                        <li>VoteGenerator branding on polls and embeds</li>
                    </ul>
                    <p>
                        We reserve the right to modify free tier limits at any time.
                    </p>

                    <h2>8. Intellectual Property</h2>
                    
                    <p>
                        The Service and its original content (excluding user content), features, and functionality are owned by VoteGenerator and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <p>
                        Our name, logo, and product names are trademarks. You may not use them without our prior written consent.
                    </p>

                    <h2>9. Third-Party Services</h2>
                    
                    <p>
                        The Service may contain links to or integrate with third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. See our <a href="/privacy">Privacy Policy</a> for details on third-party services we use.
                    </p>

                    <h2>10. Disclaimer of Warranties</h2>
                    
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p>
                        We do not warrant that the Service will be uninterrupted, secure, or error-free. We do not warrant the accuracy or reliability of any information obtained through the Service.
                    </p>

                    <h2>11. Limitation of Liability</h2>
                    
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, VOTEGENERATOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                    </p>
                    <p>
                        OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                    </p>

                    <h2>12. Indemnification</h2>
                    
                    <p>
                        You agree to indemnify and hold harmless VoteGenerator, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney's fees) arising from your use of the Service or violation of these Terms.
                    </p>

                    <h2>13. Termination</h2>
                    
                    <p>
                        We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination:
                    </p>
                    <ul>
                        <li>Your right to use the Service will immediately cease</li>
                        <li>We may delete your polls and data</li>
                        <li>Provisions that by their nature should survive termination will survive</li>
                    </ul>

                    <h2>14. Changes to Terms</h2>
                    
                    <p>
                        We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
                    </p>

                    <h2>15. Governing Law</h2>
                    
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>

                    <h2>16. Dispute Resolution</h2>
                    
                    <p>
                        Any disputes arising from these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                    </p>

                    <h2>17. Severability</h2>
                    
                    <p>
                        If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
                    </p>

                    <h2>18. Contact Us</h2>
                    
                    <p>
                        If you have any questions about these Terms, please contact us:
                    </p>
                    <ul>
                        <li>Email: legal@votegenerator.com</li>
                        <li>Contact form: <a href="/contact">/contact</a></li>
                    </ul>

                </div>
            </article>
            
            <Footer />
        </div>
    );
};

export default TermsPage;
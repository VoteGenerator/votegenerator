// ============================================================================
// PrivacyPage.tsx - Privacy Policy (TEST - NO PREMIUMNAV)
// ============================================================================

import React from 'react';
import NavHeader from './NavHeader';
import Footer from './Footer';

const PrivacyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavHeader />
            
            <div className="max-w-2xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-600 mb-4">Last updated: February 2025</p>
                
                <div className="prose prose-slate">
                    <h2 className="text-xl font-bold mt-6 mb-2">Our Privacy-First Approach</h2>
                    <p>VoteGenerator is built with privacy at its core. No account required, no email collection from voters.</p>
                    
                    <h2 className="text-xl font-bold mt-6 mb-2">Contact Us</h2>
                    <p>Email: privacy@votegenerator.com</p>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default PrivacyPage;
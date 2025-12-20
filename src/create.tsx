import React from 'react';
import ReactDOM from 'react-dom/client';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import './index.css';

/**
 * Create Poll Page
 * 
 * This page wraps the VoteGeneratorCreate component (same one used on home page)
 * to ensure consistent behavior between both entry points.
 * 
 * Flow:
 * - FREE polls: Creates directly via vg-create API → redirects to dashboard
 * - PAID polls: Saves draft to localStorage → redirects to checkout.html
 */
function CreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />
            
            <main className="pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                            Create Your Poll
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Choose a poll type, add your options, and share instantly. No signup required.
                        </p>
                    </div>
                    
                    {/* The actual create form - same component as home page */}
                    <VoteGeneratorCreate />
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <CreatePage />
        </React.StrictMode>
    );
}

export default CreatePage;
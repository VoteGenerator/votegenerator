import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import VoteGeneratorApp from './components/VoteGeneratorApp';
import './index.css';

function CreatePage() {
    // Scroll to poll creator section on mount
    useEffect(() => {
        const pollCreator = document.getElementById('poll-creator');
        if (pollCreator) {
            setTimeout(() => {
                pollCreator.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />
            
            {/* Minimal header - no hero, straight to creation */}
            <div className="pt-6 pb-4 px-4 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Create Your Poll
                </h1>
                <p className="text-slate-500 mt-1">
                    No signup required • Free forever • Ready in seconds
                </p>
            </div>
            
            {/* Poll Creator */}
            <div id="poll-creator" className="scroll-mt-32">
                <VoteGeneratorApp />
            </div>
            
            <Footer />
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <CreatePage />
        </React.StrictMode>
    );
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import './index.css';

function HelpPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Help Center Coming Soon</h1>
                    <p className="text-slate-600 mb-6">Need help? Email support@votegenerator.com</p>
                    <a href="/index.html" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 inline-block">
                        Go Home
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <HelpPage />
        </React.StrictMode>
    );
}
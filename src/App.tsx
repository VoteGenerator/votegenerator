// ============================================================================
// App.tsx - Main Application
// Uses VoteGeneratorApp for poll handling, with route-based page switching
// ============================================================================

import { useState, useEffect } from 'react';
import VoteGeneratorApp from './components/VoteGeneratorApp';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import AdWall from './components/AdWall';
import PricingPage from './components/PricingPage';
import ComparePage from './components/ComparePage';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';

// Create Page wrapper
function CreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
            <PromoBanner position="top" />
            <NavHeader />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Create Your Poll
                    </h1>
                    <p className="text-slate-600">
                        No signup required • Free forever • Share instantly
                    </p>
                </div>
                <VoteGeneratorCreate />
            </div>
            <Footer />
        </div>
    );
}

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        // Update path on navigation
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        
        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('hashchange', handleLocationChange);
        
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('hashchange', handleLocationChange);
        };
    }, []);

    // Route based on pathname
    switch (currentPath) {
        case '/create':
            return <CreatePage />;
        case '/ad-wall':
            return <AdWall />;
        case '/pricing':
            return <PricingPage />;
        case '/compare':
            return <ComparePage />;
        default:
            // VoteGeneratorApp handles:
            // - Landing page (when no hash)
            // - Poll viewing (/#id=xxx)
            // - Admin view (/#id=xxx&admin=yyy)
            return <VoteGeneratorApp />;
    }
}

export default App;
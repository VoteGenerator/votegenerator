// ============================================================================
// App.tsx - Main Application Router
// VoteGeneratorApp handles landing page, poll viewing, and admin views
// ============================================================================

import VoteGeneratorApp from './components/VoteGeneratorApp';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import AdWall from './components/AdWall';
import PricingPage from './components/PricingPage';
import ComparePage from './components/ComparePage';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';

// Create page wrapper
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
    // Simple pathname routing
    const path = window.location.pathname;
    
    // DEBUG - remove after fix confirmed
    console.log('APP ROUTING - path:', path);
    
    // Use startsWith to handle any edge cases with trailing slashes
    if (path === '/create' || path === '/create/') return <CreatePage />;
    if (path.startsWith('/ad-wall')) return <AdWall />;
    if (path === '/pricing' || path === '/pricing/') return <PricingPage />;
    if (path === '/compare' || path === '/compare/') return <ComparePage />;
    
    // VoteGeneratorApp handles everything else
    console.log('APP ROUTING - falling through to VoteGeneratorApp');
    return <VoteGeneratorApp />;
}

export default App;
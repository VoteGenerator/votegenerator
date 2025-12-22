// ============================================================================
// App.tsx - Main Application with React Router
// ============================================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import AdWall from './components/AdWall';
import PricingPage from './components/PricingPage';
import ComparePage from './components/ComparePage';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';

// ============================================================================
// Create Page Wrapper (adds header/footer around the create form)
// ============================================================================
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

// ============================================================================
// Demo Page (placeholder)
// ============================================================================
function DemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
            <PromoBanner position="top" />
            <NavHeader />
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Demo Coming Soon</h1>
                <p className="text-slate-600 mb-8">See all 7 poll types in action</p>
                <a href="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                    Create Your Own Poll →
                </a>
            </div>
            <Footer />
        </div>
    );
}

// ============================================================================
// Main App with Routes
// ============================================================================
function App() {
    return (
        <Router>
            <Routes>
                {/* Main Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/demo" element={<DemoPage />} />
                
                {/* Ad Wall - interstitial after creating free poll */}
                <Route path="/ad-wall" element={<AdWall />} />
                
                {/* Catch-all: redirect to home */}
                <Route path="*" element={<LandingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import DemoPage from './components/DemoPage';
import ComparePage from './components/ComparePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main landing page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Full Pricing page with all features */}
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Demo page - all 12 poll types */}
                <Route path="/demo" element={<DemoPage />} />
                
                {/* Compare page - vs competitors */}
                <Route path="/compare" element={<ComparePage />} />
                
                {/* Blog - coming soon */}
                <Route path="/blog" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">Blog Coming Soon</h1>
                            <p className="text-slate-600 mb-6">We're working on helpful content for you!</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 inline-block">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
                
                {/* Help - coming soon */}
                <Route path="/help" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">Help Center Coming Soon</h1>
                            <p className="text-slate-600 mb-6">Need help? Email support@votegenerator.com</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 inline-block">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
                
                {/* 404 */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
                            <p className="text-slate-600 mb-6">Page not found</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 inline-block">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
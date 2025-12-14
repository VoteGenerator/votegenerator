import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import DemoPage from './components/DemoPage';
import ComparePage from './components/ComparePage';
// import VoteGeneratorVote from './components/VoteGeneratorVote';
// import VoteGeneratorResults from './components/VoteGeneratorResults';

function App() {
    return (
        <Router>
            <Routes>
                {/* Main landing page with hero, features, and poll creator */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Pricing page */}
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Demo page - interactive demos */}
                <Route path="/demo" element={<DemoPage />} />
                
                {/* Compare page - vs competitors */}
                <Route path="/compare" element={<ComparePage />} />
                
                {/* Vote page - participants vote here */}
                {/* <Route path="/vote/:pollId" element={<VoteGeneratorVote />} /> */}
                
                {/* Results/Admin page */}
                {/* <Route path="/results/:pollId" element={<VoteGeneratorResults />} /> */}
                
                {/* Custom short link redirect */}
                {/* <Route path="/v/:shortCode" element={<ShortLinkRedirect />} /> */}
                
                {/* Embed view (no nav) */}
                {/* <Route path="/embed/:pollId" element={<EmbedPollPage />} /> */}
                
                {/* Blog and Help - coming soon */}
                <Route path="/blog" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">Blog Coming Soon</h1>
                            <p className="text-slate-600 mb-6">We're working on helpful content for you!</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
                
                <Route path="/help" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-4xl font-black text-slate-900 mb-4">Help Center Coming Soon</h1>
                            <p className="text-slate-600 mb-6">Need help now? Email us at support@votegenerator.com</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
                
                {/* 404 fallback */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                        <div className="text-center p-8">
                            <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
                            <p className="text-slate-600 mb-6">Page not found</p>
                            <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                                Go Home
                            </a>
                        </div>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
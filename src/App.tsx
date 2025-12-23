// ============================================================================
// App.tsx - Main Application Router
// VoteGeneratorApp handles landing page, poll viewing, and admin views
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
import { Home, Copy, Check, Clock, Crown, Star, Zap, AlertTriangle } from 'lucide-react';

// Paid User Nav - simplified for premium users
function PaidUserNav({ tier, expiresAt }: { tier: string; expiresAt?: string }) {
    const [copied, setCopied] = useState(false);
    
    // Calculate days remaining
    const daysRemaining = expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isExpiringVerySoon = daysRemaining !== null && daysRemaining <= 7;
    
    const currentUrl = window.location.href;
    
    const copyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const tierDisplay = tier === 'unlimited' ? { name: 'Unlimited', icon: Star, color: 'text-amber-600' }
        : tier === 'pro_event' ? { name: 'Pro Event', icon: Crown, color: 'text-purple-600' }
        : { name: 'Starter', icon: Zap, color: 'text-blue-600' };
    
    const TierIcon = tierDisplay.icon;
    
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 text-slate-800 hover:text-indigo-600 font-bold transition-colors">
                    <Home size={20} />
                    <span>VoteGenerator</span>
                </a>
                
                <div className="flex items-center gap-4">
                    {/* Days Remaining */}
                    {daysRemaining !== null && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                            isExpiringVerySoon ? 'bg-red-50 text-red-700 border border-red-200' :
                            isExpiringSoon ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                            {isExpiringVerySoon && <AlertTriangle size={14} />}
                            <Clock size={14} />
                            <span>{daysRemaining} days left</span>
                        </div>
                    )}
                    
                    {/* Plan Badge */}
                    <div className={`flex items-center gap-1.5 ${tierDisplay.color} font-semibold text-sm`}>
                        <TierIcon size={16} />
                        {tierDisplay.name}
                    </div>
                    
                    {/* Copy Link */}
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>
        </header>
    );
}

// Create page wrapper - detects paid vs free
function CreatePage() {
    const [purchasedTier, setPurchasedTier] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    
    useEffect(() => {
        const tier = localStorage.getItem('vg_purchased_tier');
        const expires = localStorage.getItem('vg_expires_at');
        setPurchasedTier(tier);
        setExpiresAt(expires);
    }, []);
    
    const isPaidUser = !!purchasedTier;
    
    return (
        <div className={`min-h-screen ${isPaidUser 
            ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50' 
            : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30'}`}>
            
            {isPaidUser ? (
                <PaidUserNav tier={purchasedTier} expiresAt={expiresAt || undefined} />
            ) : (
                <>
                    <PromoBanner position="top" />
                    <NavHeader />
                </>
            )}
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                {!isPaidUser && (
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Create Your Poll
                        </h1>
                        <p className="text-slate-600">
                            No signup required • Free forever • Share instantly
                        </p>
                    </div>
                )}
                <VoteGeneratorCreate />
            </div>
            
            {!isPaidUser && <Footer />}
        </div>
    );
}

function App() {
    const path = window.location.pathname;
    
    if (path === '/create' || path === '/create/') return <CreatePage />;
    if (path.startsWith('/ad-wall')) return <AdWall />;
    if (path === '/pricing' || path === '/pricing/') return <PricingPage />;
    if (path === '/compare' || path === '/compare/') return <ComparePage />;
    
    return <VoteGeneratorApp />;
}

export default App;
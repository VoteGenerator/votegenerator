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
import { Home, Copy, Check, Clock, Crown, Star, Zap, AlertTriangle, LayoutDashboard, Plus, Calendar } from 'lucide-react';

// Format date nicely
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Premium Nav - Different colors per tier
function PremiumNav({ tier, expiresAt }: { tier: string; expiresAt?: string }) {
    const [copied, setCopied] = useState(false);
    
    // Calculate days remaining and end date
    const endDate = expiresAt ? new Date(expiresAt) : null;
    const daysRemaining = endDate ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isExpiringVerySoon = daysRemaining !== null && daysRemaining <= 7;
    
    const currentUrl = window.location.href;
    
    const copyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    // Gold tier uses dark text for readability
    const isGoldTier = tier === 'unlimited';
    
    const tierConfig = tier === 'unlimited' 
        ? { name: 'Unlimited', icon: Star, bg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500' }
        : tier === 'pro_event' 
            ? { name: 'Pro Event', icon: Crown, bg: 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700' }
            : { name: 'Starter', icon: Zap, bg: 'bg-gradient-to-r from-blue-600 to-indigo-700' };
    
    const TierIcon = tierConfig.icon;
    const textColor = isGoldTier ? 'text-amber-950' : 'text-white';
    const textMuted = isGoldTier ? 'text-amber-800' : 'text-white/80';
    const buttonBg = isGoldTier ? 'bg-amber-900/20 hover:bg-amber-900/30' : 'bg-white/20 hover:bg-white/30';
    
    return (
        <header className={`${tierConfig.bg} ${textColor} sticky top-0 z-50 shadow-lg`}>
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Plan */}
                <div className="flex items-center gap-4">
                    <a href="/" className={`flex items-center gap-2 font-bold ${textMuted} hover:${textColor} transition-colors`}>
                        <Home size={20} />
                        <span>VoteGenerator</span>
                    </a>
                    <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 ${buttonBg} backdrop-blur rounded-full text-sm font-semibold`}>
                        <TierIcon size={14} />
                        {tierConfig.name}
                    </div>
                </div>
                
                {/* Center - Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    <a href="/create" className={`px-4 py-2 rounded-lg ${buttonBg} transition flex items-center gap-2 text-sm font-medium`}>
                        <Plus size={16} />
                        Create Poll
                    </a>
                    <a href="/#dashboard" className={`px-4 py-2 rounded-lg ${buttonBg} transition flex items-center gap-2 text-sm font-medium`}>
                        <LayoutDashboard size={16} />
                        Dashboard
                    </a>
                </nav>
                
                {/* Right - Expiry & Actions */}
                <div className="flex items-center gap-3">
                    {/* Expiry Date */}
                    {endDate && (
                        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                            isExpiringVerySoon ? (isGoldTier ? 'bg-red-600 text-white' : 'bg-red-500/30 text-red-100') :
                            isExpiringSoon ? (isGoldTier ? 'bg-amber-900/30 text-amber-900' : 'bg-amber-500/30 text-amber-100') :
                            buttonBg
                        }`}>
                            {(isExpiringSoon || isExpiringVerySoon) && <AlertTriangle size={14} />}
                            <Calendar size={14} />
                            <span>Ends {formatDate(expiresAt!)}</span>
                            <span className={isGoldTier ? 'text-amber-800/60' : 'text-white/60'}>({daysRemaining}d)</span>
                        </div>
                    )}
                    
                    {/* Copy Link */}
                    <button
                        onClick={copyLink}
                        className={`flex items-center gap-2 px-3 py-1.5 ${buttonBg} rounded-lg text-sm font-medium transition`}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

// Create page wrapper - detects paid vs free
function CreatePage() {
    // Read directly from localStorage to avoid flash of wrong nav
    const getPurchasedTier = () => typeof window !== 'undefined' ? localStorage.getItem('vg_purchased_tier') : null;
    const getExpiresAt = () => typeof window !== 'undefined' ? localStorage.getItem('vg_expires_at') : null;
    
    const [purchasedTier, setPurchasedTier] = useState<string | null>(getPurchasedTier);
    const [expiresAt, setExpiresAt] = useState<string | null>(getExpiresAt);
    
    // Re-check on mount (for SSR safety)
    useEffect(() => {
        setPurchasedTier(getPurchasedTier());
        setExpiresAt(getExpiresAt());
    }, []);
    
    const isPaidUser = !!purchasedTier;
    
    // Premium background based on tier
    const getPremiumBackground = () => {
        switch (purchasedTier) {
            case 'unlimited':
                return 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50';
            case 'pro_event':
                return 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50';
            case 'starter':
                return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50';
            default:
                return 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30';
        }
    };
    
    return (
        <div className={`min-h-screen ${isPaidUser ? getPremiumBackground() : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30'}`}>
            
            {isPaidUser ? (
                <PremiumNav tier={purchasedTier} expiresAt={expiresAt || undefined} />
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
                
                {isPaidUser && (
                    <div className="text-center mb-6">
                        <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                            purchasedTier === 'unlimited' 
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'
                                : purchasedTier === 'pro_event'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                        }`}>
                            Create Premium Poll
                        </h1>
                        <p className="text-slate-600">
                            All features unlocked • No ads • Priority support
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
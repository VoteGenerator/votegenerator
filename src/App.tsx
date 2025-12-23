// ============================================================================
// App.tsx - Main Application Router
// VoteGeneratorApp handles landing page, poll viewing, and admin views
// ============================================================================

import { useState } from 'react';
import VoteGeneratorApp from './components/VoteGeneratorApp';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import AdWall from './components/AdWall';
import PricingPage from './components/PricingPage';
import ComparePage from './components/ComparePage';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import { Home, Copy, Check, Crown, Star, Zap, AlertTriangle, Calendar, HelpCircle, BookOpen, ArrowUpRight } from 'lucide-react';

// Format date nicely
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Premium Nav - Different design per tier, NO regular nav items
function PremiumNav({ tier, expiresAt }: { tier: string; expiresAt?: string }) {
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    
    // Calculate days remaining and end date
    const endDate = expiresAt ? new Date(expiresAt) : null;
    const daysRemaining = endDate ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isExpiringVerySoon = daysRemaining !== null && daysRemaining <= 7;
    
    const copyAdminLink = () => {
        // Copy the current URL - this is their access link
        navigator.clipboard.writeText(window.location.href);
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
    };
    
    // Tier-specific styling
    const isUnlimited = tier === 'unlimited';
    const isPro = tier === 'pro_event';
    
    // Colors based on tier - Unlimited gets dark premium look
    const navBg = isUnlimited 
        ? 'bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900' 
        : isPro 
            ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700'
            : 'bg-gradient-to-r from-blue-700 to-indigo-800';
    
    const tierConfig = isUnlimited 
        ? { name: 'Unlimited', icon: Star, badge: 'bg-amber-400 text-amber-900' }
        : isPro 
            ? { name: 'Pro Event', icon: Crown, badge: 'bg-pink-400 text-pink-900' }
            : { name: 'Starter', icon: Zap, badge: 'bg-sky-400 text-sky-900' };
    
    const TierIcon = tierConfig.icon;
    
    return (
        <header className={`${navBg} text-white sticky top-0 z-50 shadow-xl`}>
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-white/90 hover:text-white transition-colors">
                    <Home size={20} />
                    <span className="hidden sm:inline">VoteGenerator</span>
                </a>
                
                {/* Center - Plan Badge */}
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-1.5 ${tierConfig.badge} rounded-full font-bold text-sm shadow-lg`}>
                        <TierIcon size={16} />
                        {tierConfig.name}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-400 text-emerald-900 text-xs font-bold rounded-full animate-pulse">
                        ACTIVE
                    </span>
                </div>
                
                {/* Right - Links & Actions */}
                <div className="flex items-center gap-2">
                    {/* Expiry Warning */}
                    {(isExpiringSoon || isExpiringVerySoon) && (
                        <div className={`hidden md:flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            isExpiringVerySoon ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'
                        }`}>
                            <AlertTriangle size={12} />
                            {daysRemaining}d left
                        </div>
                    )}
                    
                    {/* Nav Links - Paid user specific */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/blog" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm">
                            <BookOpen size={14} className="inline mr-1" />Blog
                        </a>
                        <a href="/help" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm">
                            <HelpCircle size={14} className="inline mr-1" />Help
                        </a>
                    </nav>
                    
                    {/* Upgrade Button (not for unlimited) */}
                    {!isUnlimited && (
                        <a 
                            href="/.netlify/functions/vg-checkout?tier=unlimited"
                            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-900 rounded-lg text-sm font-bold transition shadow-lg"
                        >
                            <Star size={14} />
                            Upgrade
                        </a>
                    )}
                    
                    {/* Copy Admin Link - Important! */}
                    <button
                        onClick={copyAdminLink}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            copiedAdmin 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-white/20 hover:bg-white/30'
                        }`}
                        title="Save this link to access your premium features later!"
                    >
                        {copiedAdmin ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copiedAdmin ? 'Saved!' : 'Save Link'}</span>
                    </button>
                </div>
            </div>
            
            {/* Expiry Date Bar */}
            {endDate && (
                <div className={`text-center py-1.5 text-xs ${
                    isExpiringVerySoon ? 'bg-red-600' : 
                    isExpiringSoon ? 'bg-amber-600' : 
                    'bg-black/20'
                }`}>
                    <Calendar size={12} className="inline mr-1" />
                    Plan expires: <strong>{formatDate(expiresAt!)}</strong> ({daysRemaining} days remaining)
                    {(isExpiringSoon || isExpiringVerySoon) && (
                        <a href={`/.netlify/functions/vg-checkout?tier=${tier}`} className="ml-2 underline hover:no-underline">
                            Renew now <ArrowUpRight size={10} className="inline" />
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}

// Create page wrapper - detects paid vs free
function CreatePage() {
    // Direct read from localStorage (same pattern as VoteGeneratorCreate)
    const purchasedTier = typeof window !== 'undefined' ? localStorage.getItem('vg_purchased_tier') : null;
    const expiresAt = typeof window !== 'undefined' ? localStorage.getItem('vg_expires_at') : null;
    
    const isPaidUser = !!purchasedTier;
    
    // Premium background based on tier
    const getBackground = () => {
        if (!purchasedTier) return 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30';
        switch (purchasedTier) {
            case 'unlimited':
                return 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50';
            case 'pro_event':
                return 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50';
            case 'starter':
                return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50';
            default:
                return 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30';
        }
    };
    
    return (
        <div className={`min-h-screen ${getBackground()}`}>
            {isPaidUser ? (
                <PremiumNav tier={purchasedTier!} expiresAt={expiresAt || undefined} />
            ) : (
                <>
                    <PromoBanner position="top" />
                    <NavHeader />
                </>
            )}
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header - different for paid vs free */}
                <div className="text-center mb-8">
                    {isPaidUser ? (
                        <>
                            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                                purchasedTier === 'unlimited' 
                                    ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent'
                                    : purchasedTier === 'pro_event'
                                        ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent'
                                        : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent'
                            }`}>
                                Create Premium Poll
                            </h1>
                            <p className="text-slate-600">
                                All features unlocked • No ads • Priority support
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Create Your Poll
                            </h1>
                            <p className="text-slate-600">
                                Choose a poll type, add your options, and share instantly. No signup required.
                            </p>
                        </>
                    )}
                </div>
                
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
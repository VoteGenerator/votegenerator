// ============================================================================
// App.tsx - Main Application Router
// ============================================================================
import { useState } from 'react';
import VoteGeneratorApp from './components/VoteGeneratorApp';
import VoteGeneratorCreate from './components/VoteGeneratorCreate';
import AdWall from './components/AdWall';
import PricingPage from './components/PricingPage';
import ComparePage from './components/ComparePage';
import PollCreatedSuccess from './components/PollCreatedSuccess';
import AdminDashboard from './components/AdminDashboard';
import CheckoutSuccess from './components/CheckoutSuccess';
import RecoveryPage from './components/RecoveryPage';
import DataPolicyPage from './components/DataPolicyPage';
import DataDeletionPage from './components/DataDeletionPage';
import HelpCenter from './components/HelpCenter';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import { Home, Copy, Check, Crown, Star, AlertTriangle, Calendar, HelpCircle, BookOpen, ArrowUpRight } from 'lucide-react';

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function PremiumNav({ tier, expiresAt }: { tier: string; expiresAt?: string }) {
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    
    const endDate = expiresAt ? new Date(expiresAt) : null;
    const daysRemaining = endDate ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isExpiringVerySoon = daysRemaining !== null && daysRemaining <= 7;
    
    const copyAdminLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
    };
    
    const isBusiness = tier === 'business';
    const navBg = isBusiness ? 'bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900' : 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700';
    const tierConfig = isBusiness ? { name: 'Business', icon: Star, badge: 'bg-amber-400 text-amber-900' } : { name: 'Pro', icon: Crown, badge: 'bg-pink-400 text-pink-900' };
    const TierIcon = tierConfig.icon;
    
    return (
        <header className={navBg + ' text-white sticky top-0 z-50 shadow-xl'}>
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <a href="/" className="flex items-center gap-2 font-bold text-white/90 hover:text-white transition-colors">
                    <Home size={20} />
                    <span className="hidden sm:inline">VoteGenerator</span>
                </a>
                
                <div className="flex items-center gap-3">
                    <div className={'flex items-center gap-2 px-4 py-1.5 ' + tierConfig.badge + ' rounded-full font-bold text-sm shadow-lg'}>
                        <TierIcon size={16} />
                        {tierConfig.name}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-400 text-emerald-900 text-xs font-bold rounded-full animate-pulse">ACTIVE</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {(isExpiringSoon || isExpiringVerySoon) && (
                        <div className={isExpiringVerySoon ? 'hidden md:flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500 text-white' : 'hidden md:flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-400 text-amber-900'}>
                            <AlertTriangle size={12} />
                            {daysRemaining}d left
                        </div>
                    )}
                    
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/blog" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm"><BookOpen size={14} className="inline mr-1" />Blog</a>
                        <a href="/help" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-sm"><HelpCircle size={14} className="inline mr-1" />Help</a>
                    </nav>
                    
                    {!isBusiness && (
                        <a href="/.netlify/functions/vg-checkout?tier=business" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-900 rounded-lg text-sm font-bold transition shadow-lg">
                            <Star size={14} />Upgrade
                        </a>
                    )}
                    
                    <button
                        onClick={copyAdminLink}
                        className={copiedAdmin ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition bg-emerald-500 text-white' : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition bg-white/20 hover:bg-white/30'}
                        title="Save this link to access your premium features later!"
                    >
                        {copiedAdmin ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden sm:inline">{copiedAdmin ? 'Saved!' : 'Save Link'}</span>
                    </button>
                </div>
            </div>
            
            {endDate && (
                <div className={isExpiringVerySoon ? 'text-center py-1.5 text-xs bg-red-600' : isExpiringSoon ? 'text-center py-1.5 text-xs bg-amber-600' : 'text-center py-1.5 text-xs bg-black/20'}>
                    <Calendar size={12} className="inline mr-1" />
                    Plan expires: <strong>{formatDate(expiresAt!)}</strong> ({daysRemaining} days remaining)
                    {(isExpiringSoon || isExpiringVerySoon) && (
                        <a href={'/.netlify/functions/vg-checkout?tier=' + tier} className="ml-2 underline hover:no-underline">Renew now <ArrowUpRight size={10} className="inline" /></a>
                    )}
                </div>
            )}
        </header>
    );
}

function CreatePage() {
    const purchasedTier = typeof window !== 'undefined' ? localStorage.getItem('vg_purchased_tier') : null;
    const expiresAt = typeof window !== 'undefined' ? localStorage.getItem('vg_expires_at') : null;
    const isPaidUser = !!purchasedTier;
    
    let bgClass = 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30';
    if (purchasedTier === 'business') bgClass = 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50';
    else if (purchasedTier === 'pro') bgClass = 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50';
    
    let headingClass = 'text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent';
    if (purchasedTier === 'business') headingClass = 'text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent';
    
    return (
        <div className={'min-h-screen ' + bgClass}>
            {isPaidUser ? <PremiumNav tier={purchasedTier!} expiresAt={expiresAt || undefined} /> : <><PromoBanner position="top" /><NavHeader /></>}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    {isPaidUser ? (
                        <>
                            <h1 className={headingClass}>Create Premium Poll</h1>
                            <p className="text-slate-600">All features unlocked • No ads • Priority support</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Create Your Poll</h1>
                            <p className="text-slate-600">Choose a poll type, add your options, and share instantly. No signup required.</p>
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
    
    let page;
    if (path === '/create' || path === '/create/') page = <CreatePage />;
    else if (path === '/poll-created' || path === '/poll-created/') page = <PollCreatedSuccess />;
    else if (path === '/ad-wall' || path.startsWith('/ad-wall')) page = <AdWall />;
    else if (path === '/pricing' || path === '/pricing/') page = <PricingPage />;
    else if (path === '/compare' || path === '/compare/') page = <ComparePage />;
    else if (path === '/admin' || path === '/admin/') page = <AdminDashboard />;
    else if (path === '/checkout/success' || path === '/checkout/success/') page = <CheckoutSuccess />;
    else if (path === '/help' || path === '/help/' || path.startsWith('/help/')) page = <HelpCenter />;
    else if (path === '/recover' || path === '/recover/') page = <RecoveryPage />;
    else if (path === '/data-policy' || path === '/data-policy/') page = <DataPolicyPage />;
    else if (path === '/account/delete-request' || path === '/account/delete-request/') page = <DataDeletionPage />;
    else page = <VoteGeneratorApp />;
    
    return (
        <>
            {page}
            <div id="cookie-banner" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#1e1b4b',
                color: 'white',
                padding: '20px',
                zIndex: 99999
            }}>
                <span>🍪 We use cookies. This banner should ALWAYS show.</span>
                <button 
                    onClick={() => alert('clicked')}
                    style={{ marginLeft: '20px', padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Accept
                </button>
            </div>
        </>
    );
}

export default App;
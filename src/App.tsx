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
import VerifyResult from './components/VerifyResult';
import UnsubscribeResult from './components/UnsubscribeResult';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import RefundPage from './components/RefundPage';

// SEO Landing Pages
import FAQPage from './pages/FAQPage';
import EmployeeSurveyPage from './pages/EmployeeSurveyPage';
import CustomerFeedbackPage from './pages/CustomerFeedbackPage';
import RankedChoicePage from './pages/RankedChoicePage';
import HowToCreatePollPage from './pages/HowToCreatePollPage';
import QuickSurveyPage from './pages/QuickSurveyPage';
import TeamVotingPage from './pages/TeamVotingPage';

import { 
    Home, Copy, Check, Crown, Star, AlertTriangle, Calendar, 
    HelpCircle, BookOpen, ArrowUpRight, LayoutDashboard, 
    PlusCircle, CreditCard, Mail, Menu, X
} from 'lucide-react';

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function PremiumNav({ tier, expiresAt }: { tier: string; expiresAt?: string }) {
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
    const navBg = isBusiness 
        ? 'bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900' 
        : 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700';
    const tierConfig = isBusiness 
        ? { name: 'Business', icon: Star, badge: 'bg-amber-400 text-amber-900' } 
        : { name: 'Pro', icon: Crown, badge: 'bg-pink-400 text-pink-900' };
    const TierIcon = tierConfig.icon;
    
    // Current path for active state
    const currentPath = window.location.pathname;
    
    const navItems = [
        { label: 'Create Poll', href: '/create', icon: PlusCircle, active: currentPath === '/create' },
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, active: currentPath === '/admin' },
        { label: 'Help', href: '/help', icon: HelpCircle, active: currentPath.startsWith('/help') },
    ];
    
    return (
        <header className={navBg + ' text-white sticky top-0 z-50 shadow-xl'}>
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-white/90 hover:text-white transition-colors">
                    <img 
                        src="/logo.svg" 
                        alt="VoteGenerator" 
                        className="h-8 w-8 brightness-0 invert"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <span className="hidden sm:inline text-lg">
                        Vote<span className="text-white/80">Generator</span>
                    </span>
                </a>
                
                {/* Plan Badge - Center */}
                <div className="flex items-center gap-2">
                    <div className={'flex items-center gap-2 px-4 py-1.5 ' + tierConfig.badge + ' rounded-full font-bold text-sm shadow-lg'}>
                        <TierIcon size={16} />
                        {tierConfig.name}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-400 text-emerald-900 text-xs font-bold rounded-full animate-pulse">
                        ACTIVE
                    </span>
                </div>
                
                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                    item.active 
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </a>
                        ))}
                    </nav>
                    
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    
                    {/* Manage Subscription */}
                    <a 
                        href="/admin?tab=settings" 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                    >
                        <CreditCard size={16} />
                        <span className="hidden lg:inline">Manage Plan</span>
                    </a>
                    
                    {/* Upgrade for Pro users */}
                    {!isBusiness && (
                        <a 
                            href="/.netlify/functions/vg-checkout?tier=business&billing=annual" 
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-900 rounded-lg text-sm font-bold transition shadow-lg"
                        >
                            <Star size={14} />
                            Upgrade
                        </a>
                    )}
                    
                    {/* Save Link */}
                    <button
                        onClick={copyAdminLink}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            copiedAdmin 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        title="Save this link to access your premium features later!"
                    >
                        {copiedAdmin ? <Check size={14} /> : <Copy size={14} />}
                        <span className="hidden lg:inline">{copiedAdmin ? 'Copied!' : 'Save Link'}</span>
                    </button>
                </div>
                
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/20 border-t border-white/10 px-4 py-4">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                                item.active 
                                    ? 'bg-white/20 text-white' 
                                    : 'text-white/80 hover:bg-white/10'
                            }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </a>
                    ))}
                    
                    <div className="h-px bg-white/10 my-3" />
                    
                    <a
                        href="/admin?tab=settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/80 hover:bg-white/10"
                    >
                        <CreditCard size={20} />
                        Manage Subscription
                    </a>
                    
                    <a
                        href="mailto:support@votegenerator.com"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/80 hover:bg-white/10"
                    >
                        <Mail size={20} />
                        Contact Support
                    </a>
                    
                    {!isBusiness && (
                        <a
                            href="/.netlify/functions/vg-checkout?tier=business&billing=annual"
                            className="flex items-center gap-3 px-4 py-3 mt-2 bg-amber-400 text-amber-900 rounded-xl font-bold"
                        >
                            <Star size={20} />
                            Upgrade to Business
                        </a>
                    )}
                    
                    <button
                        onClick={copyAdminLink}
                        className="flex items-center gap-3 px-4 py-3 mt-2 bg-white/20 text-white rounded-xl font-medium w-full"
                    >
                        {copiedAdmin ? <Check size={20} /> : <Copy size={20} />}
                        {copiedAdmin ? 'Link Copied!' : 'Copy Dashboard Link'}
                    </button>
                </div>
            )}
            
            {/* Expiration Banner */}
            {endDate && (
                <div className={
                    isExpiringVerySoon 
                        ? 'text-center py-1.5 text-xs bg-red-600' 
                        : isExpiringSoon 
                            ? 'text-center py-1.5 text-xs bg-amber-600' 
                            : 'text-center py-1.5 text-xs bg-black/20'
                }>
                    <Calendar size={12} className="inline mr-1" />
                    Plan expires: <strong>{formatDate(expiresAt!)}</strong> ({daysRemaining} days remaining)
                    {(isExpiringSoon || isExpiringVerySoon) && (
                        <a 
                            href={'/.netlify/functions/vg-checkout?tier=' + tier + '&billing=annual'} 
                            className="ml-2 underline hover:no-underline"
                        >
                            Renew now <ArrowUpRight size={10} className="inline" />
                        </a>
                    )}
                </div>
            )}
        </header>
    );
}

function CreatePage() {
    const purchasedTier = typeof window !== 'undefined' 
        ? (localStorage.getItem('vg_purchased_tier') || localStorage.getItem('vg_subscription_tier')) 
        : null;
    const expiresAt = typeof window !== 'undefined' 
        ? (localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at')) 
        : null;
    const isPaidUser = purchasedTier === 'pro' || purchasedTier === 'business';
    
    let bgClass = 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30';
    if (purchasedTier === 'business') bgClass = 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50';
    else if (purchasedTier === 'pro') bgClass = 'bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50';
    
    let headingClass = 'text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent';
    if (purchasedTier === 'business') headingClass = 'text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent';
    
    return (
        <div className={'min-h-screen ' + bgClass}>
            {isPaidUser ? (
                <PremiumNav tier={purchasedTier!} expiresAt={expiresAt || undefined} />
            ) : (
                <>
                    <PromoBanner position="top" />
                    <NavHeader />
                </>
            )}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    {isPaidUser ? (
                        <>
                            <h1 className={headingClass}>Create Premium Poll</h1>
                            <p className="text-slate-600">All {purchasedTier === 'business' ? 'Business' : 'Pro'} features unlocked • No ads • Priority support</p>
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
            {isPaidUser && (
                <footer className="bg-white/50 border-t border-slate-200 py-6 mt-12">
                    <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
                        <p>
                            Need help? <a href="/help" className="text-indigo-600 hover:underline">Help Center</a>
                            {' • '}
                            <a href="mailto:support@votegenerator.com" className="text-indigo-600 hover:underline">Contact Support</a>
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
}

function App() {
    const path = window.location.pathname;
    
    let page;
    
    // Core product pages
    if (path === '/create' || path === '/create/') page = <CreatePage />;
    else if (path === '/poll-created' || path === '/poll-created/') page = <PollCreatedSuccess />;
    else if (path === '/ad-wall' || path.startsWith('/ad-wall')) page = <AdWall />;
    else if (path === '/pricing' || path === '/pricing/') page = <PricingPage />;
    else if (path === '/compare' || path === '/compare/') page = <ComparePage />;
    else if (path === '/admin' || path === '/admin/') page = <AdminDashboard />;
    else if (path === '/checkout/success' || path === '/checkout/success/') page = <CheckoutSuccess />;
    else if (path === '/help' || path === '/help/' || path.startsWith('/help/')) page = <HelpCenter />;
    else if (path === '/recover' || path === '/recover/') page = <RecoveryPage />;
    
    // Legal pages
    else if (path === '/data-policy' || path === '/data-policy/') page = <DataPolicyPage />;
    else if (path === '/account/delete-request' || path === '/account/delete-request/') page = <DataDeletionPage />;
    else if (path === '/privacy' || path === '/privacy/') page = <PrivacyPage />;
    else if (path === '/terms' || path === '/terms/') page = <TermsPage />;
    else if (path === '/refund' || path === '/refund/') page = <RefundPage />;
    
    // Email/verification pages
    else if (path === '/verify-result' || path === '/verify-result/') page = <VerifyResult />;
    else if (path === '/unsubscribe-result' || path === '/unsubscribe-result/') page = <UnsubscribeResult />;
    
    // =========================================================================
    // SEO LANDING PAGES - These bring NEW visitors from Google searches
    // =========================================================================
    else if (path === '/faq' || path === '/faq/') page = <FAQPage />;
    else if (path === '/employee-survey' || path === '/employee-survey/') page = <EmployeeSurveyPage />;
    else if (path === '/customer-feedback' || path === '/customer-feedback/' || path === '/customer-satisfaction' || path === '/customer-satisfaction/') page = <CustomerFeedbackPage />;
    else if (path === '/ranked-choice-voting' || path === '/ranked-choice-voting/') page = <RankedChoicePage />;
    else if (path === '/how-to-create-poll' || path === '/how-to-create-poll/') page = <HowToCreatePollPage />;
    else if (path === '/quick-survey' || path === '/quick-survey/' || path === '/quick-poll' || path === '/quick-poll/') page = <QuickSurveyPage />;
    else if (path === '/team-voting' || path === '/team-voting/' || path === '/group-poll' || path === '/group-poll/') page = <TeamVotingPage />;
    
    // Default - catches /, /p/*, /s/*, etc.
    else page = <VoteGeneratorApp />;
    
    return <>{page}</>;
}

export default App;
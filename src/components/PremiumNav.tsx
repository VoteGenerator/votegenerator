// ============================================================================
// PremiumNav.tsx - Premium Navigation Bar for Pro/Business Users
// Location: src/components/PremiumNav.tsx
// ============================================================================
import React, { useState } from 'react';
import { 
    Crown, Star, PlusCircle, LayoutDashboard, HelpCircle, 
    CreditCard, Copy, Check, Menu, X, Mail, Calendar, ArrowUpRight,
    Zap, ClipboardList, ChevronDown
} from 'lucide-react';

interface PremiumNavProps {
    tier: 'pro' | 'business' | string;
    expiresAt?: string;
}

// Format date helper
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

const PremiumNav: React.FC<PremiumNavProps> = ({ tier, expiresAt }) => {
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
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
        : 'bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900';
    const tierConfig = isBusiness 
        ? { name: 'Business', icon: Star, badge: 'bg-amber-400 text-amber-900' } 
        : { name: 'Pro', icon: Crown, badge: 'bg-white text-purple-900' };
    const TierIcon = tierConfig.icon;
    
    // Current path for active state
    const currentPath = window.location.pathname;
    
    // Visible nav items (always shown)
    const visibleNavItems = [
        { label: 'Create Poll', href: '/create', icon: PlusCircle, active: currentPath === '/create' },
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, active: currentPath === '/admin' },
    ];
    
    // Dropdown nav items (in "More" menu)
    const dropdownNavItems = [
        { label: 'Templates', href: '/templates', icon: Zap, active: currentPath === '/templates' },
        { label: 'Create Survey', href: '/survey/create', icon: ClipboardList, active: currentPath === '/survey/create' },
        { label: 'Help', href: '/help', icon: HelpCircle, active: currentPath.startsWith('/help') },
    ];
    
    // All nav items for mobile
    const allNavItems = [...visibleNavItems, ...dropdownNavItems];
    
    return (
        <header className={navBg + ' text-white sticky top-0 z-50 shadow-xl'}>
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 font-bold text-white hover:text-white/90 transition-colors">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-md ring-2 ring-white/50">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="h-6 w-6"
                        />
                    </div>
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
                        {visibleNavItems.map((item) => (
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
                        
                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                    dropdownNavItems.some(item => item.active)
                                        ? 'bg-white/20 text-white' 
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                More
                                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/10 py-1 z-50">
                                    {dropdownNavItems.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                                                item.active 
                                                    ? 'bg-white/10 text-white' 
                                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                    
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    
                    {/* Manage Subscription - opens Stripe Customer Portal */}
                    <a 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            const token = new URLSearchParams(window.location.search).get('t') || 
                                          new URLSearchParams(window.location.search).get('token') ||
                                          localStorage.getItem('vg_dashboard_token');
                            if (token) {
                                fetch('/.netlify/functions/vg-customer-portal?token=' + token)
                                    .then(r => r.json())
                                    .then(data => {
                                        if (data.url) window.location.href = data.url;
                                        else alert('Unable to open billing portal. Please contact support.');
                                    })
                                    .catch(() => alert('Unable to open billing portal. Please contact support.'));
                            } else {
                                alert('Dashboard token not found. Please refresh the page.');
                            }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
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
                    {allNavItems.map((item) => (
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
                    
                    <button
                        onClick={() => {
                            const token = new URLSearchParams(window.location.search).get('t') || 
                                          new URLSearchParams(window.location.search).get('token') ||
                                          localStorage.getItem('vg_dashboard_token');
                            if (token) {
                                fetch('/.netlify/functions/vg-customer-portal?token=' + token)
                                    .then(r => r.json())
                                    .then(data => {
                                        if (data.url) window.location.href = data.url;
                                        else alert('Unable to open billing portal. Please contact support.');
                                    })
                                    .catch(() => alert('Unable to open billing portal. Please contact support.'));
                            } else {
                                alert('Dashboard token not found. Please refresh the page.');
                            }
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/80 hover:bg-white/10 w-full text-left"
                    >
                        <CreditCard size={20} />
                        Manage Subscription
                    </button>
                    
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
};

export default PremiumNav;
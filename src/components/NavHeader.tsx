// ============================================================================
// NavHeader - Adaptive navigation based on subscription status
// UPDATED: Nav items ordered by search volume (data-backed)
// 
// Search Volume Data (Monthly):
// - Employee Survey: 49,500
// - Customer Feedback: 33,100
// - Templates: general browse
// - Pricing: ready buyers
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, LayoutDashboard, PlusCircle, 
    BarChart3, Settings, Zap, Crown, LayoutTemplate, ClipboardList,
    Users, Star, LucideIcon
} from 'lucide-react';

// Check if user has a paid subscription
const getSubscriptionStatus = () => {
    if (typeof window === 'undefined') return { isPaid: false, tier: null, hasPolls: false };
    
    const tier = localStorage.getItem('vg_subscription_tier');
    const isPaid = tier === 'pro' || tier === 'business';
    const userPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
    const hasPolls = userPolls.length > 0;
    
    return { isPaid, tier, hasPolls };
};

// Type definitions for nav items
interface NavItem {
    label: string;
    href: string;
    icon?: LucideIcon;
    badge?: string;
    badgeColor?: string;
}

// ============================================================================
// FREE USER NAV - Clean, action-focused navigation
// Landing pages (/employee-survey, /customer-feedback) are accessible via 
// Templates, Footer, and SEO - not cluttering main nav
// ============================================================================
const FREE_NAV_ITEMS: NavItem[] = [
    { label: 'Create Poll', href: '/create', icon: PlusCircle },
    { label: 'Create Survey', href: '/survey', icon: ClipboardList },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' }, 
];

// ============================================================================
// PAID USER NAV - Dashboard-focused
// ============================================================================
const PAID_NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Create Poll', href: '/create', icon: PlusCircle },
    { label: 'Survey', href: '/survey', icon: ClipboardList },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    { label: 'Pricing', href: '/pricing', icon: Zap },
];

interface NavHeaderProps {
    transparent?: boolean;
}

const NavHeader: React.FC<NavHeaderProps> = ({ transparent = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState({ isPaid: false, tier: null as string | null, hasPolls: false });

    useEffect(() => {
        setSubscriptionStatus(getSubscriptionStatus());
    }, []);

    const { isPaid, tier, hasPolls } = subscriptionStatus;

    // Nav items - Free users with polls get Dashboard link too
    const navItems = isPaid ? PAID_NAV_ITEMS : hasPolls ? [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        ...FREE_NAV_ITEMS
    ] : FREE_NAV_ITEMS;

    return (
        <header className={`
            sticky top-0 z-50 ${
                transparent ? 'bg-transparent' : 
                tier === 'pro' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg' :
                tier === 'business' ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg' :
                'bg-white border-b border-slate-200'
            }
        `}>
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href={isPaid ? '/admin' : '/'} className="flex items-center gap-2">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className={`h-9 w-9 ${isPaid ? 'brightness-0 invert' : ''}`}
                        />
                        <span className={`text-xl font-bold ${isPaid ? 'text-white' : 'text-slate-900'}`}>
                            Vote<span className={isPaid ? 'text-white/80' : 'text-indigo-600'}>Generator</span>
                        </span>
                        {isPaid && (
                            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                {tier === 'business' ? <Crown size={12} /> : <Zap size={12} />}
                                {tier === 'business' ? 'Business' : 'Pro'}
                            </span>
                        )}
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 font-medium text-sm rounded-lg transition flex items-center gap-2 ${
                                        isPaid 
                                            ? 'text-white/80 hover:text-white hover:bg-white/10' 
                                            : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    {IconComponent && <IconComponent size={16} />}
                                    {item.label}
                                    {item.badge && (
                                        <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </a>
                            );
                        })}
                        
                        {/* Primary CTA Button */}
                        {!isPaid ? (
                            hasPolls ? (
                                // User has polls but is free - show Upgrade
                                <a
                                    href="/pricing"
                                    className="ml-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Crown size={16} />
                                    Upgrade
                                </a>
                            ) : (
                                // New user - show Get Started
                                <a
                                    href="/#create"
                                    className="ml-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    Get Started — It's Free
                                </a>
                            )
                        ) : (
                            <a
                                href="/settings"
                                className={`ml-2 p-2 rounded-lg transition ${
                                    isPaid ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                                title="Settings"
                            >
                                <Settings size={20} />
                            </a>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg ${
                            isPaid ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden mt-4 pb-4 pt-4 ${
                                isPaid 
                                    ? tier === 'pro' ? 'bg-purple-700 border-t border-purple-500' : 'bg-amber-600 border-t border-amber-400'
                                    : 'border-t border-slate-200'
                            }`}
                        >
                            <nav className="flex flex-col gap-1">
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 ${
                                                isPaid 
                                                    ? 'text-white/90 hover:bg-white/10 hover:text-white' 
                                                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                                            }`}
                                        >
                                            {IconComponent && <IconComponent size={20} />}
                                            {item.label}
                                            {item.badge && (
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </a>
                                    );
                                })}
                                
                                {!isPaid ? (
                                    hasPolls ? (
                                        // User has polls but is free - show Upgrade
                                        <a
                                            href="/pricing"
                                            className="mt-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2"
                                        >
                                            <Crown size={18} />
                                            Upgrade
                                        </a>
                                    ) : (
                                        // New user - show Get Started
                                        <a
                                            href="/#create"
                                            className="mt-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2"
                                        >
                                            Get Started — It's Free
                                        </a>
                                    )
                                ) : (
                                    <a
                                        href="/settings"
                                        className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 ${
                                            isPaid ? 'text-white/90 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Settings size={20} />
                                        Settings
                                    </a>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default NavHeader;
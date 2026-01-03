// ============================================================================
// NavHeader - Adaptive navigation based on subscription status
// Uses /logo.svg from public folder
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, LayoutDashboard, PlusCircle, 
    BarChart3, Settings, Zap, Crown, LayoutTemplate
} from 'lucide-react';

// Check if user has a paid subscription
const getSubscriptionStatus = () => {
    if (typeof window === 'undefined') return { isPaid: false, tier: null };
    
    const tier = localStorage.getItem('vg_subscription_tier');
    const isPaid = tier === 'pro' || tier === 'business';
    
    return { isPaid, tier };
};

// Free user nav items
const FREE_NAV_ITEMS = [
    { label: 'Create Poll', href: '/create' },
    { label: 'Templates', href: '/templates' },
    { label: 'Demo', href: '/demo' },
    { label: 'Pricing', href: '/pricing' },
];

// Paid user nav items
const PAID_NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Poll', href: '/create', icon: PlusCircle },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

interface NavHeaderProps {
    transparent?: boolean;
}

const NavHeader: React.FC<NavHeaderProps> = ({ transparent = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState({ isPaid: false, tier: null as string | null });

    useEffect(() => {
        setSubscriptionStatus(getSubscriptionStatus());
    }, []);

    const { isPaid, tier } = subscriptionStatus;
    const navItems = isPaid ? PAID_NAV_ITEMS : FREE_NAV_ITEMS;

    const TierBadge = () => {
        if (!isPaid) return null;
        
        const isBusiness = tier === 'business';
        return (
            <span className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                ${isBusiness 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' 
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                }
            `}>
                {isBusiness ? <Crown size={12} /> : <Zap size={12} />}
                {isBusiness ? 'Business' : 'Pro'}
            </span>
        );
    };

    return (
        <header className={`
            ${transparent ? 'bg-transparent' : 'bg-white border-b border-slate-200'}
            sticky top-0 z-50
        `}>
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href={isPaid ? '/dashboard' : '/'} className="flex items-center gap-2">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="h-9 w-9"
                        />
                        <span className="text-xl font-bold text-slate-900">VoteGenerator</span>
                        <TierBadge />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
                            >
                                {'icon' in item && item.icon && <item.icon size={16} />}
                                {item.label}
                            </a>
                        ))}
                        
                        {/* CTA Button */}
                        {!isPaid ? (
                            <a
                                href="/pricing"
                                className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg transition flex items-center gap-2"
                            >
                                <Zap size={16} />
                                Upgrade
                            </a>
                        ) : (
                            <a
                                href="/settings"
                                className="ml-2 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                title="Settings"
                            >
                                <Settings size={20} />
                            </a>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
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
                            className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4"
                        >
                            <nav className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium flex items-center gap-3"
                                    >
                                        {'icon' in item && item.icon && <item.icon size={20} />}
                                        {item.label}
                                    </a>
                                ))}
                                
                                {!isPaid ? (
                                    <a
                                        href="/pricing"
                                        className="mt-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2"
                                    >
                                        <Zap size={18} />
                                        Upgrade to Pro
                                    </a>
                                ) : (
                                    <a
                                        href="/settings"
                                        className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl font-medium flex items-center gap-3"
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
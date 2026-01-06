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
    if (typeof window === 'undefined') return { isPaid: false, tier: null };
    
    const tier = localStorage.getItem('vg_subscription_tier');
    const isPaid = tier === 'pro' || tier === 'business';
    
    return { isPaid, tier };
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
// FREE USER NAV - Ordered by search volume + conversion priority
// ============================================================================
const FREE_NAV_ITEMS: NavItem[] = [
    { label: 'Create Poll', href: '/create', icon: PlusCircle },
    { 
        label: 'Employee Surveys', 
        href: '/employee-survey', 
        icon: Users,
        badge: 'Popular',
        badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    { 
        label: 'Customer Feedback', 
        href: '/customer-feedback', 
        icon: Star,
    },
    { label: 'Templates', href: '/templates', icon: LayoutTemplate },
    { label: 'Pricing', href: '/pricing' },
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
    const [subscriptionStatus, setSubscriptionStatus] = useState({ isPaid: false, tier: null as string | null });

    useEffect(() => {
        setSubscriptionStatus(getSubscriptionStatus());
    }, []);

    const { isPaid, tier } = subscriptionStatus;

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

    const navItems = isPaid ? PAID_NAV_ITEMS : FREE_NAV_ITEMS;

    return (
        <header className={`
            ${transparent ? 'bg-transparent' : 'bg-white border-b border-slate-200'}
            sticky top-0 z-50
        `}>
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href={isPaid ? '/admin' : '/'} className="flex items-center gap-2">
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
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="relative px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
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
                            <a
                                href="/create"
                                className="ml-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg transition flex items-center gap-2"
                            >
                                Create Free →
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
                                {navItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium flex items-center gap-3"
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
                                    <a
                                        href="/create"
                                        className="mt-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-center flex items-center justify-center gap-2"
                                    >
                                        Create Free Poll →
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
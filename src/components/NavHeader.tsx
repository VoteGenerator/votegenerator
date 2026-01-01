// ============================================================================
// NavHeader - Navigation header that adapts for paid users
// Shows different nav items based on whether user has purchased a plan
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, Sparkles, BarChart3, Star, Crown, Zap, 
    LayoutDashboard, PlusCircle, Settings, HelpCircle,
    ChevronDown, ExternalLink, User
} from 'lucide-react';

type PaidTier = 'starter' | 'pro_event' | 'unlimited' | null;

const NavHeader: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [paidTier, setPaidTier] = useState<PaidTier>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);

    // Check for paid tier on mount
    useEffect(() => {
        const tier = localStorage.getItem('vg_purchased_tier') as PaidTier;
        const expires = localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at');
        
        if (tier && ['starter', 'pro_event', 'unlimited'].includes(tier)) {
            // Check if not expired
            if (expires) {
                const expiryDate = new Date(expires);
                if (expiryDate > new Date()) {
                    setPaidTier(tier);
                    setExpiresAt(expires);
                } else {
                    // Expired - clear
                    localStorage.removeItem('vg_purchased_tier');
                    localStorage.removeItem('vg_tier_expires');
                    localStorage.removeItem('vg_expires_at');
                }
            } else {
                setPaidTier(tier);
            }
        }
    }, []);

    // Tier display config
    const tierConfig: Record<string, { label: string; icon: typeof Star; colors: string; gradient: string }> = {
        starter: { 
            label: 'Starter', 
            icon: Zap, 
            colors: 'text-blue-600',
            gradient: 'from-blue-500 to-indigo-600'
        },
        pro_event: { 
            label: 'Pro Event', 
            icon: Crown, 
            colors: 'text-purple-600',
            gradient: 'from-purple-500 to-pink-600'
        },
        unlimited_event: { 
            label: 'Unlimited Event', 
            icon: Star, 
            colors: 'text-orange-600',
            gradient: 'from-orange-400 to-amber-500'
        },
        unlimited: { 
            label: 'Unlimited', 
            icon: Star, 
            colors: 'text-amber-600',
            gradient: 'from-amber-500 to-orange-500'
        },
    };

    const currentTierConfig = paidTier ? tierConfig[paidTier] : null;
    const TierIcon = currentTierConfig?.icon || Star;

    // Calculate days remaining
    const daysRemaining = expiresAt 
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;

    // Free user nav items
    const freeNavItems = [
        { label: 'Create Poll', href: '/#create', icon: PlusCircle },
        { label: 'Demo', href: '/demo', icon: BarChart3 },
        { label: 'Pricing', href: '/pricing', icon: Star },
    ];

    // Paid user nav items
    const paidNavItems = [
        { label: 'Create Poll', href: '/#create', icon: PlusCircle },
        { label: 'My Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Help', href: '/help', icon: HelpCircle },
    ];

    const navItems = paidTier ? paidNavItems : freeNavItems;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 group">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="h-9 w-auto"
                        />
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium"
                            >
                                <item.icon size={18} />
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right side - CTA or Plan Badge */}
                    <div className="hidden md:flex items-center gap-3">
                        {paidTier ? (
                            // Paid user - show plan badge
                            <div className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${currentTierConfig?.gradient} rounded-xl text-white`}>
                                <div className="flex items-center gap-2">
                                    <TierIcon size={18} />
                                    <span className="font-bold">{currentTierConfig?.label}</span>
                                </div>
                                {daysRemaining !== null && (
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                        {daysRemaining}d left
                                    </span>
                                )}
                            </div>
                        ) : (
                            // Free user - show upgrade CTA
                            <>
                                <a
                                    href="/#create"
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition flex items-center gap-2"
                                >
                                    <Sparkles size={18} />
                                    Create Free Poll
                                </a>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-200"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* Plan badge for paid users (mobile) */}
                            {paidTier && (
                                <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${currentTierConfig?.gradient} rounded-xl text-white mb-4`}>
                                    <div className="flex items-center gap-2">
                                        <TierIcon size={20} />
                                        <span className="font-bold">{currentTierConfig?.label} Plan</span>
                                    </div>
                                    {daysRemaining !== null && (
                                        <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                                            {daysRemaining} days left
                                        </span>
                                    )}
                                </div>
                            )}

                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition font-medium"
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </a>
                            ))}

                            {/* CTA for free users (mobile) */}
                            {!paidTier && (
                                <a
                                    href="/#create"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl mt-4"
                                >
                                    <Sparkles size={20} />
                                    Create Free Poll
                                </a>
                            )}

                            {/* Upgrade link for paid non-unlimited users */}
                            {paidTier && paidTier !== 'unlimited' && (
                                <a
                                    href="/pricing"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl mt-4"
                                >
                                    <Star size={20} />
                                    Upgrade Plan
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavHeader;
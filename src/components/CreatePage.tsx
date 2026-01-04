// ============================================================================
// CreatePage - Clean create page for ALL users (free and paid)
// Shows tier-appropriate nav, no hero banner, just the create form
// ============================================================================
import React, { useState } from 'react';
import { 
    Star, Crown, Zap, 
    LayoutDashboard, HelpCircle, PlusCircle,
    Menu, X, Sparkles
} from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';

type UserTier = 'free' | 'pro' | 'business';

// Tier configuration
const TIER_CONFIG: Record<UserTier, {
    label: string;
    icon: typeof Star;
    gradient: string;
    showBadge: boolean;
}> = {
    free: {
        label: 'Free',
        icon: Sparkles,
        gradient: 'from-slate-500 to-slate-600',
        showBadge: false,
    },
    pro: {
        label: 'Pro',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-600',
        showBadge: true,
    },
    business: {
        label: 'Business',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        showBadge: true,
    },
};

const CreatePage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Get tier from localStorage
    const storedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
    const tier: UserTier = (storedTier === 'pro' || storedTier === 'business') ? storedTier : 'free';
    const isPaid = tier !== 'free';
    
    const expiresAt = localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at');
    
    const config = TIER_CONFIG[tier];
    const TierIcon = config.icon;
    
    // Calculate days remaining for paid users
    const daysRemaining = expiresAt 
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 365;

    // Nav items - different for free vs paid
    const navItems = isPaid ? [
        { label: 'Create Poll', href: '/', icon: PlusCircle, active: true },
        { label: 'My Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Help', href: '/help', icon: HelpCircle },
    ] : [
        { label: 'Create Poll', href: '/', icon: PlusCircle, active: true },
        { label: 'Templates', href: '/templates', icon: Sparkles },
        { label: 'Pricing', href: '/pricing', icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Nav Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 group">
                            <img 
                                src="/logo.svg" 
                                alt="VoteGenerator" 
                                className="h-9 w-9"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <span className="font-bold text-xl text-slate-900">
                                Vote<span className="text-indigo-600">Generator</span>
                            </span>
                        </a>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                                        item.active 
                                            ? 'text-indigo-600 bg-indigo-50' 
                                            : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        {/* Right side - Tier Badge or Upgrade CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            {isPaid ? (
                                // Paid user badge
                                <div className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-xl text-white`}>
                                    <div className="flex items-center gap-2">
                                        <TierIcon size={18} />
                                        <span className="font-bold">{config.label}</span>
                                    </div>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                        {daysRemaining}d left
                                    </span>
                                </div>
                            ) : (
                                // Free user upgrade CTA
                                <a
                                    href="/pricing"
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                                >
                                    <Zap size={18} />
                                    Go Pro
                                </a>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
                        {isPaid && (
                            <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${config.gradient} rounded-xl text-white mb-4`}>
                                <div className="flex items-center gap-2">
                                    <TierIcon size={20} />
                                    <span className="font-bold">{config.label} Plan</span>
                                </div>
                                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                                    {daysRemaining} days left
                                </span>
                            </div>
                        )}
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                                    item.active 
                                        ? 'text-indigo-600 bg-indigo-50' 
                                        : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </a>
                        ))}
                        {!isPaid && (
                            <a
                                href="/pricing"
                                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold"
                            >
                                <Zap size={18} />
                                Upgrade to Pro
                            </a>
                        )}
                    </div>
                )}
            </header>

            {/* Create Poll Form - Clean, no banner */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <VoteGeneratorCreate hideTierBanner={true} />
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-200 py-6">
                <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} VoteGenerator. Need help? <a href="/help" className="text-indigo-600 hover:underline">Contact Support</a></p>
                </div>
            </footer>
        </div>
    );
};

export default CreatePage;
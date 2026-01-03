// ============================================================================
// PaidCreatePage - Dedicated create poll page for paid users
// Shows: Paid nav, create form ONLY (tier info on admin dashboard)
// ============================================================================
import React, { useState } from 'react';
import { 
    Star, Crown, Zap, 
    LayoutDashboard, HelpCircle, PlusCircle,
    Menu, X
} from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';

type PaidTier = 'starter' | 'pro_event' | 'unlimited_event' | 'unlimited';

// Tier configuration (minimal - full config on admin dashboard)
const TIER_CONFIG: Record<PaidTier, {
    label: string;
    icon: typeof Star;
    gradient: string;
    days: number;
}> = {
    starter: {
        label: 'Starter',
        icon: Zap,
        gradient: 'from-blue-500 to-indigo-600',
        days: 30,
    },
    pro_event: {
        label: 'Pro Event',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-600',
        days: 30,
    },
    unlimited_event: {
        label: 'Unlimited Event',
        icon: Star,
        gradient: 'from-orange-400 to-amber-500',
        days: 30,
    },
    unlimited: {
        label: 'Unlimited',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        days: 365,
    },
};

const PaidCreatePage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Get tier from localStorage
    const tier = (localStorage.getItem('vg_purchased_tier') || 'starter') as PaidTier;
    const expiresAt = localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at');
    
    const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;
    const TierIcon = config.icon;
    
    // Calculate days remaining
    const daysRemaining = expiresAt 
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : config.days;

    // Nav items for paid users
    const navItems = [
        { label: 'Create Poll', href: '/', icon: PlusCircle, active: true },
        { label: 'My Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Help', href: '/help', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Paid Nav Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - using SVG from public folder */}
                        <a href="/" className="flex items-center gap-2 group">
                            <img 
                                src="/logo.svg" 
                                alt="VoteGenerator" 
                                className="h-9 w-9"
                                onError={(e) => {
                                    // Fallback if logo not found
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl items-center justify-center shadow-lg hidden">
                                <Star className="text-white" size={20} />
                            </div>
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

                        {/* Plan Badge */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className={`flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-xl text-white`}>
                                <div className="flex items-center gap-2">
                                    <TierIcon size={18} />
                                    <span className="font-bold">{config.label}</span>
                                </div>
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    {daysRemaining}d left
                                </span>
                            </div>
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
                        <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${config.gradient} rounded-xl text-white mb-4`}>
                            <div className="flex items-center gap-2">
                                <TierIcon size={20} />
                                <span className="font-bold">{config.label} Plan</span>
                            </div>
                            <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                                {daysRemaining} days left
                            </span>
                        </div>
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

export default PaidCreatePage;
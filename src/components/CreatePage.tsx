// ============================================================================
// CreatePage - Clean create page for ALL users (free and paid)
// Shows tier-appropriate nav, no hero banner, just the create form
// ============================================================================
import React, { useState, useEffect } from 'react';
import { 
    Star, Crown, Zap, 
    LayoutDashboard, PlusCircle,
    Menu, X, Sparkles, AlertTriangle
} from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

type UserTier = 'free' | 'pro' | 'business';

// Tier configuration - matching AdminDashboard
const TIER_CONFIG: Record<UserTier, {
    label: string;
    icon: typeof Star;
    gradient: string;
}> = {
    free: {
        label: 'Free',
        icon: Sparkles,
        gradient: 'from-slate-500 to-slate-600',
    },
    pro: {
        label: 'Pro',
        icon: Crown,
        gradient: 'from-purple-500 to-indigo-500',
    },
    business: {
        label: 'Business',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
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
    
    // Check if plan is expired
    const isPlanExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
    
    // Check if user has existing polls
    const userPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
    const hasPolls = userPolls.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Nav Header - PremiumNav for paid users, custom create header for free */}
            {isPaid ? (
                <PremiumNav tier={tier} />
            ) : (
                <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                                <img 
                                    src="/logo.svg" 
                                    alt="VoteGenerator" 
                                    className="w-6 h-6"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                            <span className="font-bold text-xl text-white">
                                Vote<span className="text-white/80">Generator</span>
                            </span>
                        </a>

                        {/* Creation Mode Badge - Center */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                            <PlusCircle size={16} className="text-white" />
                            <span className="text-white font-semibold text-sm">Creating Poll</span>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition text-sm">
                                <LayoutDashboard size={16} /> Dashboard
                            </a>
                            <a
                                href="/pricing"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg ml-2"
                            >
                                <Crown size={16} /> Upgrade
                            </a>
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-indigo-700 border-t border-indigo-500 px-4 py-4">
                            {/* Creation Mode Badge */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg mb-3">
                                <PlusCircle size={18} className="text-white" />
                                <span className="text-white font-semibold">Creating Poll</span>
                            </div>
                            
                            <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10">
                                <LayoutDashboard size={20} /> Dashboard
                            </a>
                            <a
                                href="/pricing"
                                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-white rounded-xl text-indigo-600 font-bold"
                            >
                                <Crown size={18} />
                                Upgrade
                            </a>
                        </div>
                    )}
                </header>
            )}

            {/* Create Poll Form - Clean, no banner */}
            <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
                <VoteGeneratorCreate hideTierBanner={true} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CreatePage;
// ============================================================================
// CreatePage - Clean create page for ALL users (free and paid)
// Shows tier-appropriate nav, no hero banner, just the create form
// ============================================================================
import React, { useState } from 'react';
import { 
    Star, Crown, Zap, 
    LayoutDashboard, PlusCircle,
    Menu, X, Sparkles, AlertTriangle
} from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';

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
        <div className="min-h-screen bg-slate-50">
            {/* Nav Header - CREATION MODE - Distinct amber/orange color */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="w-9 h-9 brightness-0 invert"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-bold text-xl text-white">
                            Vote<span className="text-amber-100">Generator</span>
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
                        <a href="/templates" className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition text-sm">
                            <Zap size={16} /> Templates
                        </a>
                        {tier === 'free' ? (
                            <a
                                href="/pricing"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg ml-2"
                            >
                                <Crown size={16} /> Upgrade
                            </a>
                        ) : (
                            <div className={`px-3 py-1.5 bg-white/20 text-white rounded-lg text-sm font-bold flex items-center gap-2 ml-2`}>
                                {isPlanExpired ? <AlertTriangle size={14} /> : <TierIcon size={14} />} {config.label}
                            </div>
                        )}
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
                    <div className="md:hidden bg-amber-600 border-t border-amber-400 px-4 py-4">
                        {/* Creation Mode Badge */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg mb-3">
                            <PlusCircle size={18} className="text-white" />
                            <span className="text-white font-semibold">Creating Poll</span>
                        </div>
                        
                        {isPaid && (
                            <div className={`flex items-center justify-between p-3 bg-white/20 rounded-xl text-white mb-4`}>
                                <div className="flex items-center gap-2">
                                    <TierIcon size={20} />
                                    <span className="font-bold">{config.label} Plan</span>
                                </div>
                                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                                    {isPlanExpired ? 'Expired' : `${daysRemaining}d left`}
                                </span>
                            </div>
                        )}
                        <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10">
                            <LayoutDashboard size={20} /> Dashboard
                        </a>
                        <a href="/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10">
                            <Zap size={20} /> Templates
                        </a>
                        {!isPaid && (
                            <a
                                href="/pricing"
                                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-white rounded-xl text-amber-600 font-bold"
                            >
                                <Crown size={18} />
                                Upgrade
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
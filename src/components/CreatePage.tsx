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
            {/* Nav Header - Matching AdminDashboard exactly */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo - same as AdminDashboard */}
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="w-9 h-9"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-bold text-xl text-slate-800">
                            Vote<span className="text-indigo-600">Generator</span>
                        </span>
                    </a>

                    {/* Desktop Nav - same structure as AdminDashboard */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-600 bg-indigo-50 font-medium transition text-sm">
                            <PlusCircle size={16} /> Create Poll
                        </a>
                        {hasPolls && (
                            <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                                <LayoutDashboard size={16} /> My Dashboard
                            </a>
                        )}
                        <a href="/templates" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition text-sm">
                            <Zap size={16} /> Templates
                        </a>
                    </nav>

                    {/* Right side - Upgrade or Tier Badge (same as AdminDashboard) */}
                    <div className="hidden md:flex items-center gap-3">
                        {tier === 'free' ? (
                            // Free user - Upgrade button
                            <a
                                href="/pricing"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
                            >
                                <Crown size={16} /> Upgrade
                            </a>
                        ) : (
                            // Paid user - Tier badge
                            <div className={`px-4 py-2 bg-gradient-to-r ${isPlanExpired ? 'from-red-500 to-rose-500' : config.gradient} text-white rounded-xl text-sm font-bold flex items-center gap-2`}>
                                {isPlanExpired ? <AlertTriangle size={16} /> : <TierIcon size={16} />} {config.label}
                                <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${isPlanExpired ? 'bg-white/30' : 'bg-white/20'}`}>
                                    {isPlanExpired ? 'Expired' : `${daysRemaining}d`}
                                </span>
                            </div>
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
                                    {isPlanExpired ? 'Expired' : `${daysRemaining}d left`}
                                </span>
                            </div>
                        )}
                        <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-indigo-600 bg-indigo-50">
                            <PlusCircle size={20} /> Create Poll
                        </a>
                        {hasPolls && (
                            <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">
                                <LayoutDashboard size={20} /> My Dashboard
                            </a>
                        )}
                        <a href="/templates" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">
                            <Zap size={20} /> Templates
                        </a>
                        {!isPaid && (
                            <a
                                href="/pricing"
                                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold"
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
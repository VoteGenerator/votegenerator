// ============================================================================
// PaidCreatePage - Dedicated create poll page for paid users
// Shows: Paid nav, tier banner, create form ONLY
// No hero, no landing page sections
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart3, Star, Crown, Zap, Calendar, ArrowLeft,
    LayoutDashboard, HelpCircle, PlusCircle, Settings,
    Menu, X, Copy, Check, ExternalLink
} from 'lucide-react';
import VoteGeneratorCreate from './VoteGeneratorCreate';

type PaidTier = 'starter' | 'pro_event' | 'unlimited';

// Tier configuration
const TIER_CONFIG: Record<PaidTier, {
    label: string;
    icon: typeof Star;
    gradient: string;
    bgGradient: string;
    maxPolls: number;
    maxResponses: number;
    days: number;
}> = {
    starter: {
        label: 'Starter',
        icon: Zap,
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-600 to-indigo-700',
        maxPolls: 1,
        maxResponses: 500,
        days: 30,
    },
    pro_event: {
        label: 'Pro Event',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-600',
        bgGradient: 'from-purple-600 via-pink-600 to-purple-600',
        maxPolls: 3,
        maxResponses: 2000,
        days: 60,
    },
    unlimited: {
        label: 'Unlimited',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'from-slate-900 via-amber-950 to-slate-900',
        maxPolls: -1, // unlimited
        maxResponses: 10000,
        days: 365,
    },
};

const PaidCreatePage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    
    // Get tier from localStorage
    const tier = (localStorage.getItem('vg_purchased_tier') || 'starter') as PaidTier;
    const expiresAt = localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at');
    
    const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;
    const TierIcon = config.icon;
    
    // Calculate days remaining
    const daysRemaining = expiresAt 
        ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : config.days;
    
    // Copy current page link
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    // Nav items for paid users
    const navItems = [
        { label: 'Create Poll', href: '/#create', icon: PlusCircle, active: true },
        { label: 'My Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Help', href: '/help', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Paid Nav Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <BarChart3 className="text-white" size={20} />
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

            {/* Tier Status Banner */}
            <div className={`bg-gradient-to-r ${config.bgGradient} text-white`}>
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${tier === 'unlimited' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-white/20 backdrop-blur'} rounded-xl flex items-center justify-center shadow-lg`}>
                                <TierIcon size={24} className={tier === 'unlimited' ? 'text-amber-950' : 'text-white'} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className={`text-lg font-bold ${tier === 'unlimited' ? 'bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent' : ''}`}>
                                        {tier === 'unlimited' ? '⭐' : tier === 'pro_event' ? '👑' : '⚡'} {config.label} Plan
                                    </h2>
                                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-bold">
                                        ACTIVE
                                    </span>
                                </div>
                                <p className={`text-sm ${tier === 'unlimited' ? 'text-amber-200/80' : 'text-white/80'}`}>
                                    Create your poll below • All premium features unlocked • No ads
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {expiresAt && (
                                <div className="text-right hidden sm:block">
                                    <p className={`text-xs ${tier === 'unlimited' ? 'text-amber-300/60' : 'text-white/60'}`}>Expires on</p>
                                    <p className={`text-sm font-semibold flex items-center gap-1 justify-end ${tier === 'unlimited' ? 'text-amber-200' : ''}`}>
                                        <Calendar size={14} />
                                        {new Date(expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            )}
                            
                            <div className="text-right hidden sm:block">
                                <p className={`text-xs ${tier === 'unlimited' ? 'text-amber-300/60' : 'text-white/60'}`}>Plan includes</p>
                                <p className={`text-sm font-semibold ${tier === 'unlimited' ? 'text-amber-200' : ''}`}>
                                    {config.maxResponses.toLocaleString()} responses
                                </p>
                            </div>
                            
                            <button 
                                onClick={copyLink}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                                    copiedLink 
                                        ? 'bg-emerald-500 text-white' 
                                        : tier === 'unlimited'
                                            ? 'bg-amber-400 hover:bg-amber-300 text-amber-900'
                                            : 'bg-white/20 hover:bg-white/30 text-white'
                                }`}
                            >
                                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                                {copiedLink ? 'Copied!' : 'Save Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Poll Form - MAIN CONTENT */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <VoteGeneratorCreate />
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
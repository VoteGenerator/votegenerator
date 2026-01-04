// ============================================================================
// ThemeSelector.tsx - Poll theme/color selector
// Location: src/components/ThemeSelector.tsx
// ============================================================================

import React from 'react';
import { Check, Palette, Sparkles, Lock } from 'lucide-react';

export interface ThemeConfig {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    buttonBg: string;
    buttonText: string;
    preview: string;
    isPremium?: boolean;
    // Premium enhancements
    cardBg?: string;
    cardBorder?: string;
    headerStyle?: string;
    specialEffect?: 'glow' | 'shimmer' | 'gradient-border' | 'shadow-lg' | 'glass';
    optionStyle?: string;
    pageBg?: string; // Page background for dark themes
}

// Available themes - mix of free and premium
export const THEMES: ThemeConfig[] = [
    // FREE THEMES - Clean, professional basics
    {
        id: 'default',
        name: 'Classic',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#818cf8',
        gradient: 'from-indigo-600 to-purple-600',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        optionStyle: 'border-slate-200 hover:border-indigo-400',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        gradient: 'from-sky-500 to-blue-600',
        buttonBg: 'bg-sky-600 hover:bg-sky-700',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-sky-500 to-blue-600',
        cardBg: 'bg-white',
        cardBorder: 'border-sky-100',
        optionStyle: 'border-sky-200 hover:border-sky-400',
    },
    {
        id: 'forest',
        name: 'Forest',
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#4ade80',
        gradient: 'from-emerald-500 to-green-600',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-emerald-500 to-green-600',
        cardBg: 'bg-white',
        cardBorder: 'border-emerald-100',
        optionStyle: 'border-emerald-200 hover:border-emerald-400',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        gradient: 'from-orange-500 to-red-500',
        buttonBg: 'bg-orange-600 hover:bg-orange-700',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-orange-500 to-red-500',
        cardBg: 'bg-white',
        cardBorder: 'border-orange-100',
        optionStyle: 'border-orange-200 hover:border-orange-400',
    },
    {
        id: 'berry',
        name: 'Berry',
        primary: '#ec4899',
        secondary: '#db2777',
        accent: '#f472b6',
        gradient: 'from-pink-500 to-rose-500',
        buttonBg: 'bg-pink-600 hover:bg-pink-700',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-pink-500 to-rose-500',
        cardBg: 'bg-white',
        cardBorder: 'border-pink-100',
        optionStyle: 'border-pink-200 hover:border-pink-400',
    },
    {
        id: 'slate',
        name: 'Minimal',
        primary: '#475569',
        secondary: '#334155',
        accent: '#64748b',
        gradient: 'from-slate-600 to-slate-700',
        buttonBg: 'bg-slate-700 hover:bg-slate-800',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-slate-500 to-slate-700',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        optionStyle: 'border-slate-300 hover:border-slate-500',
    },
    
    // PREMIUM THEMES - Special effects, unique aesthetics
    {
        id: 'midnight',
        name: 'Midnight',
        primary: '#3b82f6', // Blue accent
        secondary: '#1e40af',
        accent: '#60a5fa',
        gradient: 'from-slate-900 to-slate-800',
        buttonBg: 'bg-blue-500 hover:bg-blue-400',
        buttonText: 'text-white',
        preview: 'bg-slate-900', // Solid dark - matches actual
        isPremium: true,
        pageBg: 'bg-slate-950', // Dark page background
        cardBg: 'bg-slate-900',
        cardBorder: 'border-blue-500/30',
        headerStyle: 'bg-slate-800/80 border-blue-500/20 text-white',
        specialEffect: 'glow',
        optionStyle: 'border-slate-700 bg-slate-800 text-white hover:border-blue-500 hover:bg-slate-700',
    },
    {
        id: 'aurora',
        name: 'Aurora',
        primary: '#8b5cf6', // Violet
        secondary: '#06b6d4', // Cyan
        accent: '#f472b6', // Pink
        gradient: 'from-violet-600 via-purple-600 to-cyan-600',
        buttonBg: 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600', // Matches header
        isPremium: true,
        cardBg: 'bg-white',
        cardBorder: 'border-violet-300',
        headerStyle: 'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 text-white',
        specialEffect: 'shimmer',
        optionStyle: 'border-violet-200 hover:border-violet-500 bg-violet-50/50',
    },
    {
        id: 'gold',
        name: 'Luxury Gold',
        primary: '#d97706', // Amber
        secondary: '#b45309',
        accent: '#fbbf24', // Yellow
        gradient: 'from-amber-600 via-yellow-500 to-amber-600',
        buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400',
        buttonText: 'text-amber-950 font-bold',
        preview: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500', // Matches header
        isPremium: true,
        cardBg: 'bg-amber-50',
        cardBorder: 'border-amber-400',
        headerStyle: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950',
        specialEffect: 'shimmer',
        optionStyle: 'border-amber-300 hover:border-amber-500 bg-white shadow-sm',
    },
    {
        id: 'neon',
        name: 'Neon',
        primary: '#10b981', // Emerald
        secondary: '#14b8a6',
        accent: '#34d399',
        gradient: 'from-emerald-500 to-teal-500',
        buttonBg: 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/50',
        buttonText: 'text-white',
        preview: 'bg-slate-950', // Dark - matches actual
        isPremium: true,
        pageBg: 'bg-black', // Black page background for neon effect
        cardBg: 'bg-slate-950',
        cardBorder: 'border-emerald-500/50',
        headerStyle: 'bg-slate-900 border-emerald-500/30 text-emerald-400',
        specialEffect: 'glow',
        optionStyle: 'border-emerald-500/40 bg-slate-900 text-emerald-100 hover:border-emerald-400 hover:bg-slate-800',
    },
    {
        id: 'rose',
        name: 'Rose',
        primary: '#e11d48', // Rose
        secondary: '#be123c',
        accent: '#fb7185',
        gradient: 'from-rose-500 to-pink-500',
        buttonBg: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-rose-500 to-pink-500', // Matches header
        isPremium: true,
        cardBg: 'bg-white',
        cardBorder: 'border-rose-300',
        headerStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
        specialEffect: 'shadow-lg',
        optionStyle: 'border-rose-200 hover:border-rose-500 bg-rose-50/50',
    },
    {
        id: 'glass',
        name: 'Glassmorphism',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
        gradient: 'from-indigo-500/80 to-purple-500/80',
        buttonBg: 'bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/30',
        buttonText: 'text-white',
        preview: 'bg-gradient-to-r from-indigo-400/60 via-purple-400/60 to-pink-400/60',
        isPremium: true,
        cardBg: 'bg-white/10 backdrop-blur-xl',
        cardBorder: 'border-white/20',
        headerStyle: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
        specialEffect: 'glass',
        optionStyle: 'border-white/30 bg-white/10 backdrop-blur-sm text-slate-800 hover:bg-white/20',
    },
];

// Get theme by ID
export const getTheme = (id: string): ThemeConfig => {
    return THEMES.find(t => t.id === id) || THEMES[0];
};

interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeChange: (themeId: string) => void;
    tier?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
    selectedTheme, 
    onThemeChange,
    tier = 'free'
}) => {
    const isPaidTier = tier === 'pro' || tier === 'business';
    
    const freeThemes = THEMES.filter(t => !t.isPremium);
    const premiumThemes = THEMES.filter(t => t.isPremium);
    
    return (
        <div className="space-y-4">
            {/* Free Themes */}
            <div>
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <Palette size={12} /> Free Themes
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {freeThemes.map((theme) => (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => onThemeChange(theme.id)}
                            className={`relative group rounded-lg overflow-hidden transition-all ${
                                selectedTheme === theme.id 
                                    ? 'ring-2 ring-indigo-500 ring-offset-2' 
                                    : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-1'
                            }`}
                        >
                            <div className={`h-10 ${theme.preview}`} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                {selectedTheme === theme.id && (
                                    <div className="bg-white rounded-full p-1 shadow">
                                        <Check size={12} className="text-indigo-600" />
                                    </div>
                                )}
                            </div>
                            <div className="text-[10px] text-center py-1 bg-white font-medium text-slate-600 truncate px-1">
                                {theme.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Premium Themes */}
            <div>
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> 
                    Premium Themes
                    {!isPaidTier && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1">Paid Plans</span>}
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {premiumThemes.map((theme) => (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => isPaidTier && onThemeChange(theme.id)}
                            disabled={!isPaidTier}
                            className={`relative group rounded-lg overflow-hidden transition-all ${
                                !isPaidTier ? 'opacity-60 cursor-not-allowed' :
                                selectedTheme === theme.id 
                                    ? 'ring-2 ring-amber-500 ring-offset-2' 
                                    : 'hover:ring-2 hover:ring-amber-300 hover:ring-offset-1'
                            }`}
                        >
                            <div className={`h-10 ${theme.preview} ${theme.specialEffect === 'shimmer' ? 'animate-pulse' : ''}`} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {selectedTheme === theme.id && isPaidTier ? (
                                    <div className="bg-white rounded-full p-1 shadow">
                                        <Check size={12} className="text-amber-600" />
                                    </div>
                                ) : !isPaidTier ? (
                                    <div className="bg-slate-900/60 rounded-full p-1.5">
                                        <Lock size={10} className="text-white" />
                                    </div>
                                ) : null}
                            </div>
                            <div className="text-[10px] text-center py-1 bg-white font-medium text-slate-600 truncate px-1 flex items-center justify-center gap-0.5">
                                {theme.name}
                                {theme.specialEffect && <Sparkles size={8} className="text-amber-500" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;
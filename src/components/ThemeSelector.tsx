// ============================================================================
// ThemeSelector - Comprehensive Poll Theming System
// 12+ themes with distinct visual identities
// Exports: THEMES, ThemeConfig, ThemeSelector component
// ============================================================================

import React, { useState } from 'react';
import { Check, Sparkles, Lock, Palette } from 'lucide-react';

// ============================================================================
// THEME CONFIGURATION TYPE
// ============================================================================
export interface ThemeConfig {
    id: string;
    name: string;
    emoji: string;
    description: string;
    isPremium: boolean;
    
    // Colors
    primary: string;        // Main accent color
    secondary: string;      // Secondary accent
    accent: string;         // Tertiary accent
    
    // Page styling
    pageBg: string;         // Full page background (tailwind classes)
    
    // Card styling
    cardBg: string;         // Card background
    cardBorder: string;     // Card border color
    
    // Header area
    headerStyle: string;    // Header background styling
    headerText: string;     // Header text color
    
    // Options/answers
    optionStyle: string;    // Option cards styling
    optionHover: string;    // Option hover state
    optionSelected: string; // Option selected state
    
    // Button
    buttonBg: string;       // Submit button background
    buttonText: string;     // Submit button text
    buttonHover: string;    // Button hover state
    
    // Special effects
    specialEffect?: 'glow' | 'shimmer' | 'glass' | 'shadow-lg' | 'gradient-border' | 'particles';
    
    // Preview gradient for selector
    previewGradient: string;
}

// ============================================================================
// THEME DEFINITIONS - 12+ Distinct Themes
// ============================================================================
export const THEMES: ThemeConfig[] = [
    // ===== FREE THEMES (3) =====
    {
        id: 'default',
        name: 'Classic',
        emoji: '📋',
        description: 'Clean and professional',
        isPremium: false,
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#a855f7',
        pageBg: 'bg-gradient-to-br from-slate-50 to-slate-100',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-200',
        headerStyle: 'bg-slate-50 border-b border-slate-100',
        headerText: 'text-slate-800',
        optionStyle: 'bg-white border-2 border-slate-200 hover:border-indigo-300',
        optionHover: 'hover:bg-indigo-50',
        optionSelected: 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200',
        buttonBg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        buttonText: 'text-white',
        buttonHover: 'hover:from-indigo-600 hover:to-indigo-700',
        previewGradient: 'from-slate-100 to-indigo-100',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        emoji: '🌊',
        description: 'Calm blue waves',
        isPremium: false,
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        pageBg: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100',
        cardBg: 'bg-white/90 backdrop-blur-sm',
        cardBorder: 'border-cyan-200',
        headerStyle: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        headerText: 'text-white',
        optionStyle: 'bg-white/80 border-2 border-cyan-200 hover:border-cyan-400',
        optionHover: 'hover:bg-cyan-50',
        optionSelected: 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200',
        buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-cyan-600 hover:to-blue-600',
        specialEffect: 'glass',
        previewGradient: 'from-cyan-200 to-blue-300',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        emoji: '◻️',
        description: 'Simple and clean',
        isPremium: false,
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#6b7280',
        pageBg: 'bg-white',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-300',
        headerStyle: 'bg-white border-b-2 border-slate-900',
        headerText: 'text-slate-900',
        optionStyle: 'bg-white border-2 border-slate-300 hover:border-slate-500',
        optionHover: 'hover:bg-slate-50',
        optionSelected: 'border-slate-900 bg-slate-50 ring-2 ring-slate-200',
        buttonBg: 'bg-slate-900',
        buttonText: 'text-white',
        buttonHover: 'hover:bg-slate-800',
        previewGradient: 'from-slate-100 to-slate-200',
    },

    // ===== PREMIUM THEMES (9+) =====
    {
        id: 'sunset',
        name: 'Sunset',
        emoji: '🌅',
        description: 'Warm orange glow',
        isPremium: true,
        primary: '#f59e0b',
        secondary: '#f97316',
        accent: '#ef4444',
        pageBg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-amber-200',
        headerStyle: 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-amber-200 hover:border-orange-400',
        optionHover: 'hover:bg-amber-50',
        optionSelected: 'border-orange-500 bg-orange-50 ring-2 ring-orange-200',
        buttonBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-amber-600 hover:via-orange-600 hover:to-rose-600',
        specialEffect: 'shimmer',
        previewGradient: 'from-amber-200 via-orange-200 to-rose-200',
    },
    {
        id: 'forest',
        name: 'Forest',
        emoji: '🌲',
        description: 'Natural green tones',
        isPremium: true,
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399',
        pageBg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-emerald-200',
        headerStyle: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-emerald-200 hover:border-emerald-400',
        optionHover: 'hover:bg-emerald-50',
        optionSelected: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200',
        buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-emerald-600 hover:to-teal-600',
        previewGradient: 'from-emerald-200 to-teal-200',
    },
    {
        id: 'neon',
        name: 'Neon',
        emoji: '⚡',
        description: 'Electric vibes',
        isPremium: true,
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        pageBg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        cardBg: 'bg-slate-800/90 backdrop-blur-sm',
        cardBorder: 'border-purple-500/50',
        headerStyle: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500',
        headerText: 'text-white',
        optionStyle: 'bg-slate-800/80 border-2 border-purple-500/30 hover:border-pink-500/60',
        optionHover: 'hover:bg-slate-700/50',
        optionSelected: 'border-pink-500 bg-pink-500/20 ring-2 ring-pink-500/30',
        buttonBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400',
        specialEffect: 'glow',
        previewGradient: 'from-pink-500 via-purple-500 to-cyan-500',
    },
    {
        id: 'midnight',
        name: 'Midnight',
        emoji: '🌙',
        description: 'Dark and sleek',
        isPremium: true,
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        pageBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        cardBg: 'bg-slate-800/95',
        cardBorder: 'border-slate-600',
        headerStyle: 'bg-slate-700/50 border-b border-slate-600',
        headerText: 'text-white',
        optionStyle: 'bg-slate-700/50 border-2 border-slate-600 hover:border-blue-500/50',
        optionHover: 'hover:bg-slate-700/70',
        optionSelected: 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30',
        buttonBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-blue-400 hover:to-indigo-400',
        previewGradient: 'from-slate-700 to-slate-800',
    },
    {
        id: 'rose',
        name: 'Rose Garden',
        emoji: '🌹',
        description: 'Elegant pink hues',
        isPremium: true,
        primary: '#e11d48',
        secondary: '#f43f5e',
        accent: '#fb7185',
        pageBg: 'bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-rose-200',
        headerStyle: 'bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-rose-200 hover:border-rose-400',
        optionHover: 'hover:bg-rose-50',
        optionSelected: 'border-rose-500 bg-rose-50 ring-2 ring-rose-200',
        buttonBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600',
        specialEffect: 'shimmer',
        previewGradient: 'from-rose-200 via-pink-200 to-fuchsia-200',
    },
    {
        id: 'lavender',
        name: 'Lavender',
        emoji: '💜',
        description: 'Soft purple dreams',
        isPremium: true,
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c4b5fd',
        pageBg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-violet-200',
        headerStyle: 'bg-gradient-to-r from-violet-400 to-purple-500',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-violet-200 hover:border-violet-400',
        optionHover: 'hover:bg-violet-50',
        optionSelected: 'border-violet-500 bg-violet-50 ring-2 ring-violet-200',
        buttonBg: 'bg-gradient-to-r from-violet-500 to-purple-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-violet-600 hover:to-purple-600',
        previewGradient: 'from-violet-200 to-purple-200',
    },
    {
        id: 'corporate',
        name: 'Corporate',
        emoji: '💼',
        description: 'Professional business',
        isPremium: true,
        primary: '#1e40af',
        secondary: '#1d4ed8',
        accent: '#3b82f6',
        pageBg: 'bg-gradient-to-br from-blue-50 to-slate-100',
        cardBg: 'bg-white',
        cardBorder: 'border-blue-200',
        headerStyle: 'bg-gradient-to-r from-blue-800 to-blue-900',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-blue-200 hover:border-blue-400',
        optionHover: 'hover:bg-blue-50',
        optionSelected: 'border-blue-600 bg-blue-50 ring-2 ring-blue-200',
        buttonBg: 'bg-blue-800',
        buttonText: 'text-white',
        buttonHover: 'hover:bg-blue-900',
        specialEffect: 'shadow-lg',
        previewGradient: 'from-blue-200 to-blue-300',
    },
    {
        id: 'playful',
        name: 'Playful',
        emoji: '🎉',
        description: 'Fun and colorful',
        isPremium: true,
        primary: '#eab308',
        secondary: '#84cc16',
        accent: '#22c55e',
        pageBg: 'bg-gradient-to-br from-yellow-100 via-lime-50 to-emerald-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-yellow-300',
        headerStyle: 'bg-gradient-to-r from-yellow-400 via-lime-400 to-emerald-400',
        headerText: 'text-slate-800',
        optionStyle: 'bg-white border-2 border-yellow-200 hover:border-lime-400',
        optionHover: 'hover:bg-yellow-50',
        optionSelected: 'border-lime-500 bg-lime-50 ring-2 ring-lime-200',
        buttonBg: 'bg-gradient-to-r from-yellow-400 via-lime-500 to-emerald-500',
        buttonText: 'text-slate-900 font-bold',
        buttonHover: 'hover:from-yellow-500 hover:via-lime-600 hover:to-emerald-600',
        previewGradient: 'from-yellow-200 via-lime-200 to-emerald-200',
    },
    {
        id: 'aurora',
        name: 'Aurora',
        emoji: '✨',
        description: 'Northern lights magic',
        isPremium: true,
        primary: '#14b8a6',
        secondary: '#06b6d4',
        accent: '#8b5cf6',
        pageBg: 'bg-gradient-to-br from-slate-900 via-teal-900 to-purple-900',
        cardBg: 'bg-slate-800/80 backdrop-blur-md',
        cardBorder: 'border-teal-500/30',
        headerStyle: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500',
        headerText: 'text-white',
        optionStyle: 'bg-slate-800/60 border-2 border-teal-500/30 hover:border-cyan-400/60',
        optionHover: 'hover:bg-slate-700/50',
        optionSelected: 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-500/30',
        buttonBg: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-teal-400 hover:via-cyan-400 hover:to-purple-400',
        specialEffect: 'glow',
        previewGradient: 'from-teal-400 via-cyan-400 to-purple-400',
    },
    {
        id: 'coffee',
        name: 'Coffee',
        emoji: '☕',
        description: 'Warm and cozy',
        isPremium: true,
        primary: '#92400e',
        secondary: '#b45309',
        accent: '#d97706',
        pageBg: 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50',
        cardBg: 'bg-white/95',
        cardBorder: 'border-amber-300',
        headerStyle: 'bg-gradient-to-r from-amber-700 to-amber-800',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-amber-200 hover:border-amber-400',
        optionHover: 'hover:bg-amber-50',
        optionSelected: 'border-amber-600 bg-amber-50 ring-2 ring-amber-200',
        buttonBg: 'bg-gradient-to-r from-amber-700 to-amber-800',
        buttonText: 'text-white',
        buttonHover: 'hover:from-amber-800 hover:to-amber-900',
        previewGradient: 'from-amber-300 to-amber-400',
    },
    {
        id: 'candy',
        name: 'Candy',
        emoji: '🍬',
        description: 'Sweet and vibrant',
        isPremium: true,
        primary: '#ec4899',
        secondary: '#f472b6',
        accent: '#a855f7',
        pageBg: 'bg-gradient-to-br from-pink-100 via-fuchsia-50 to-purple-100',
        cardBg: 'bg-white/95',
        cardBorder: 'border-pink-300',
        headerStyle: 'bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400',
        headerText: 'text-white',
        optionStyle: 'bg-white border-2 border-pink-200 hover:border-fuchsia-400',
        optionHover: 'hover:bg-pink-50',
        optionSelected: 'border-fuchsia-500 bg-fuchsia-50 ring-2 ring-fuchsia-200',
        buttonBg: 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-600',
        specialEffect: 'shimmer',
        previewGradient: 'from-pink-300 via-fuchsia-300 to-purple-300',
    },
    {
        id: 'ocean-deep',
        name: 'Deep Sea',
        emoji: '🐋',
        description: 'Dark oceanic depths',
        isPremium: true,
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        pageBg: 'bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950',
        cardBg: 'bg-slate-800/90 backdrop-blur-sm',
        cardBorder: 'border-blue-500/30',
        headerStyle: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600',
        headerText: 'text-white',
        optionStyle: 'bg-slate-800/60 border-2 border-blue-500/30 hover:border-cyan-400/60',
        optionHover: 'hover:bg-slate-700/50',
        optionSelected: 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-500/30',
        buttonBg: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
        buttonText: 'text-white',
        buttonHover: 'hover:from-blue-400 hover:via-cyan-400 hover:to-teal-400',
        specialEffect: 'glow',
        previewGradient: 'from-blue-500 via-cyan-500 to-teal-500',
    },
];

// ============================================================================
// THEME SELECTOR COMPONENT
// ============================================================================
interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeChange: (themeId: string) => void;
    isPaidUser?: boolean;
    customColors?: {
        primary: string;
        background: string;
    };
    onCustomColorsChange?: (colors: { primary: string; background: string }) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
    selectedTheme, 
    onThemeChange,
    isPaidUser = false,
    customColors,
    onCustomColorsChange
}) => {
    const [showCustomColors, setShowCustomColors] = useState(selectedTheme === 'custom');
    const [localPrimary, setLocalPrimary] = useState(customColors?.primary || '#6366f1');
    const [localBackground, setLocalBackground] = useState(customColors?.background || '#ffffff');
    
    const freeThemes = THEMES.filter(t => !t.isPremium);
    const premiumThemes = THEMES.filter(t => t.isPremium);
    
    // Update custom colors when user changes them
    const handleCustomColorChange = (type: 'primary' | 'background', value: string) => {
        if (type === 'primary') {
            setLocalPrimary(value);
            onCustomColorsChange?.({ primary: value, background: localBackground });
        } else {
            setLocalBackground(value);
            onCustomColorsChange?.({ primary: localPrimary, background: value });
        }
    };
    
    const selectCustomTheme = () => {
        setShowCustomColors(true);
        onThemeChange('custom');
        onCustomColorsChange?.({ primary: localPrimary, background: localBackground });
    };
    
    const ThemeCard = ({ theme }: { theme: ThemeConfig }) => {
        const isSelected = selectedTheme === theme.id;
        const isLocked = theme.isPremium && !isPaidUser;
        
        return (
            <button
                type="button"
                onClick={() => {
                    if (!isLocked) {
                        onThemeChange(theme.id);
                        setShowCustomColors(false);
                    }
                }}
                disabled={isLocked}
                className={`relative group p-2 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected && !showCustomColors
                        ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg'
                        : isLocked
                            ? 'border-slate-200 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
            >
                {/* Theme Preview */}
                <div className={`h-14 rounded-lg bg-gradient-to-r ${theme.previewGradient} mb-2 relative overflow-hidden`}>
                    {/* Mini card preview */}
                    <div className="absolute inset-1 flex flex-col gap-1">
                        <div className={`h-3 rounded-sm ${theme.id.includes('midnight') || theme.id.includes('neon') || theme.id.includes('aurora') ? 'bg-white/20' : 'bg-white/80'}`}></div>
                        <div className="flex gap-1 flex-1">
                            <div className={`flex-1 rounded-sm ${theme.id.includes('midnight') || theme.id.includes('neon') || theme.id.includes('aurora') ? 'bg-white/10' : 'bg-white/60'}`}></div>
                            <div className={`flex-1 rounded-sm ${theme.id.includes('midnight') || theme.id.includes('neon') || theme.id.includes('aurora') ? 'bg-white/10' : 'bg-white/60'}`}></div>
                        </div>
                        <div className={`h-2 rounded-sm bg-gradient-to-r ${theme.previewGradient}`} style={{ filter: 'saturate(1.5)' }}></div>
                    </div>
                    
                    {/* Selected check */}
                    {isSelected && !showCustomColors && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                        </div>
                    )}
                    
                    {/* Lock icon */}
                    {isLocked && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center">
                            <Lock size={10} className="text-white" />
                        </div>
                    )}
                </div>
                
                {/* Theme info */}
                <div className="flex items-center gap-1.5">
                    <span className="text-sm">{theme.emoji}</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{theme.name}</span>
                </div>
            </button>
        );
    };
    
    return (
        <div className="space-y-4">
            {/* Free themes */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Free Themes</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {freeThemes.map(theme => (
                        <ThemeCard key={theme.id} theme={theme} />
                    ))}
                </div>
            </div>
            
            {/* Premium themes */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-amber-500" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Premium Themes</span>
                    {!isPaidUser && (
                        <a href="/pricing" className="text-xs text-indigo-600 hover:underline ml-auto">Upgrade</a>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {premiumThemes.map(theme => (
                        <ThemeCard key={theme.id} theme={theme} />
                    ))}
                </div>
            </div>
            
            {/* Custom Colors (Pro/Business only) */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Palette size={12} className="text-purple-500" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Custom Colors</span>
                    {!isPaidUser && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium ml-auto">Pro</span>
                    )}
                </div>
                
                {isPaidUser ? (
                    <div className="space-y-3">
                        {/* Custom theme button */}
                        <button
                            type="button"
                            onClick={selectCustomTheme}
                            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                                showCustomColors
                                    ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
                                    : 'border-slate-200 hover:border-purple-300'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: localPrimary }}
                                >
                                    <Palette size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-slate-700">Custom Colors</div>
                                    <div className="text-xs text-slate-500">Pick your brand colors</div>
                                </div>
                                {showCustomColors && (
                                    <Check size={16} className="text-purple-600 ml-auto" />
                                )}
                            </div>
                        </button>
                        
                        {/* Color pickers - show when custom is selected */}
                        {showCustomColors && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                                {/* Primary color */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        Primary Color (buttons, accents)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={localPrimary}
                                            onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                                        />
                                        <input
                                            type="text"
                                            value={localPrimary}
                                            onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono uppercase"
                                            placeholder="#6366f1"
                                        />
                                    </div>
                                </div>
                                
                                {/* Background color */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">
                                        Background Color
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={localBackground}
                                            onChange={(e) => handleCustomColorChange('background', e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                                        />
                                        <input
                                            type="text"
                                            value={localBackground}
                                            onChange={(e) => handleCustomColorChange('background', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono uppercase"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                                
                                {/* Preview */}
                                <div className="mt-4">
                                    <label className="block text-xs font-medium text-slate-600 mb-2">Preview</label>
                                    <div 
                                        className="p-4 rounded-xl border border-slate-200"
                                        style={{ backgroundColor: localBackground }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: localPrimary }}></div>
                                            <div className="flex-1">
                                                <div className="h-3 rounded" style={{ backgroundColor: localPrimary, width: '60%' }}></div>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full py-2 rounded-lg text-white text-sm font-medium"
                                            style={{ backgroundColor: localPrimary }}
                                        >
                                            Vote Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                        <Palette size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 mb-2">Choose your brand colors</p>
                        <a href="/pricing" className="text-xs text-indigo-600 hover:underline font-medium">
                            Upgrade to Pro →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeSelector;

// ============================================================================
// HELPER: Get theme by ID
// ============================================================================
export const getThemeById = (themeId?: string): ThemeConfig => {
    if (!themeId) return THEMES[0];
    return THEMES.find(t => t.id === themeId) || THEMES[0];
};
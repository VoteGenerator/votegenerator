import React from 'react';
import { motion } from 'framer-motion';
import { Check, Palette, Crown } from 'lucide-react';

export interface PollTheme {
    id: string;
    name: string;
    isPro: boolean;
    preview: {
        primaryColor: string;
        secondaryColor: string;
        bgGradient: string;
        buttonColor: string;
        textColor: string;
        accentColor: string;
    };
    css: {
        '--poll-primary': string;
        '--poll-secondary': string;
        '--poll-bg': string;
        '--poll-button': string;
        '--poll-button-hover': string;
        '--poll-text': string;
        '--poll-accent': string;
        '--poll-border': string;
        '--poll-option-bg': string;
        '--poll-option-hover': string;
        '--poll-option-selected': string;
    };
}

export const POLL_THEMES: PollTheme[] = [
    {
        id: 'default',
        name: 'Classic Blue',
        isPro: false,
        preview: {
            primaryColor: '#6366f1',
            secondaryColor: '#818cf8',
            bgGradient: 'from-slate-50 to-indigo-50',
            buttonColor: '#6366f1',
            textColor: '#1e293b',
            accentColor: '#6366f1',
        },
        css: {
            '--poll-primary': '#6366f1',
            '--poll-secondary': '#818cf8',
            '--poll-bg': '#f8fafc',
            '--poll-button': '#6366f1',
            '--poll-button-hover': '#4f46e5',
            '--poll-text': '#1e293b',
            '--poll-accent': '#6366f1',
            '--poll-border': '#e2e8f0',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#f1f5f9',
            '--poll-option-selected': '#eef2ff',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        isPro: false,
        preview: {
            primaryColor: '#0891b2',
            secondaryColor: '#06b6d4',
            bgGradient: 'from-cyan-50 to-teal-50',
            buttonColor: '#0891b2',
            textColor: '#164e63',
            accentColor: '#06b6d4',
        },
        css: {
            '--poll-primary': '#0891b2',
            '--poll-secondary': '#06b6d4',
            '--poll-bg': '#f0fdfa',
            '--poll-button': '#0891b2',
            '--poll-button-hover': '#0e7490',
            '--poll-text': '#164e63',
            '--poll-accent': '#06b6d4',
            '--poll-border': '#99f6e4',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#f0fdfa',
            '--poll-option-selected': '#ccfbf1',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset Glow',
        isPro: false,
        preview: {
            primaryColor: '#f97316',
            secondaryColor: '#fb923c',
            bgGradient: 'from-orange-50 to-amber-50',
            buttonColor: '#f97316',
            textColor: '#7c2d12',
            accentColor: '#f59e0b',
        },
        css: {
            '--poll-primary': '#f97316',
            '--poll-secondary': '#fb923c',
            '--poll-bg': '#fffbeb',
            '--poll-button': '#f97316',
            '--poll-button-hover': '#ea580c',
            '--poll-text': '#7c2d12',
            '--poll-accent': '#f59e0b',
            '--poll-border': '#fed7aa',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#fff7ed',
            '--poll-option-selected': '#ffedd5',
        },
    },
    {
        id: 'forest',
        name: 'Forest Green',
        isPro: false,
        preview: {
            primaryColor: '#16a34a',
            secondaryColor: '#22c55e',
            bgGradient: 'from-green-50 to-emerald-50',
            buttonColor: '#16a34a',
            textColor: '#14532d',
            accentColor: '#22c55e',
        },
        css: {
            '--poll-primary': '#16a34a',
            '--poll-secondary': '#22c55e',
            '--poll-bg': '#f0fdf4',
            '--poll-button': '#16a34a',
            '--poll-button-hover': '#15803d',
            '--poll-text': '#14532d',
            '--poll-accent': '#22c55e',
            '--poll-border': '#bbf7d0',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#f0fdf4',
            '--poll-option-selected': '#dcfce7',
        },
    },
    {
        id: 'grape',
        name: 'Grape Vine',
        isPro: true,
        preview: {
            primaryColor: '#9333ea',
            secondaryColor: '#a855f7',
            bgGradient: 'from-purple-50 to-fuchsia-50',
            buttonColor: '#9333ea',
            textColor: '#581c87',
            accentColor: '#a855f7',
        },
        css: {
            '--poll-primary': '#9333ea',
            '--poll-secondary': '#a855f7',
            '--poll-bg': '#faf5ff',
            '--poll-button': '#9333ea',
            '--poll-button-hover': '#7e22ce',
            '--poll-text': '#581c87',
            '--poll-accent': '#a855f7',
            '--poll-border': '#e9d5ff',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#faf5ff',
            '--poll-option-selected': '#f3e8ff',
        },
    },
    {
        id: 'rose',
        name: 'Rose Garden',
        isPro: true,
        preview: {
            primaryColor: '#e11d48',
            secondaryColor: '#f43f5e',
            bgGradient: 'from-rose-50 to-pink-50',
            buttonColor: '#e11d48',
            textColor: '#881337',
            accentColor: '#f43f5e',
        },
        css: {
            '--poll-primary': '#e11d48',
            '--poll-secondary': '#f43f5e',
            '--poll-bg': '#fff1f2',
            '--poll-button': '#e11d48',
            '--poll-button-hover': '#be123c',
            '--poll-text': '#881337',
            '--poll-accent': '#f43f5e',
            '--poll-border': '#fecdd3',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#fff1f2',
            '--poll-option-selected': '#ffe4e6',
        },
    },
    {
        id: 'midnight',
        name: 'Midnight Dark',
        isPro: true,
        preview: {
            primaryColor: '#3b82f6',
            secondaryColor: '#60a5fa',
            bgGradient: 'from-slate-900 to-slate-800',
            buttonColor: '#3b82f6',
            textColor: '#f1f5f9',
            accentColor: '#60a5fa',
        },
        css: {
            '--poll-primary': '#3b82f6',
            '--poll-secondary': '#60a5fa',
            '--poll-bg': '#0f172a',
            '--poll-button': '#3b82f6',
            '--poll-button-hover': '#2563eb',
            '--poll-text': '#f1f5f9',
            '--poll-accent': '#60a5fa',
            '--poll-border': '#334155',
            '--poll-option-bg': '#1e293b',
            '--poll-option-hover': '#334155',
            '--poll-option-selected': '#1e3a5f',
        },
    },
    {
        id: 'corporate',
        name: 'Corporate',
        isPro: true,
        preview: {
            primaryColor: '#1e40af',
            secondaryColor: '#3b82f6',
            bgGradient: 'from-slate-100 to-blue-50',
            buttonColor: '#1e40af',
            textColor: '#1e3a8a',
            accentColor: '#3b82f6',
        },
        css: {
            '--poll-primary': '#1e40af',
            '--poll-secondary': '#3b82f6',
            '--poll-bg': '#f8fafc',
            '--poll-button': '#1e40af',
            '--poll-button-hover': '#1e3a8a',
            '--poll-text': '#1e3a8a',
            '--poll-accent': '#3b82f6',
            '--poll-border': '#cbd5e1',
            '--poll-option-bg': '#ffffff',
            '--poll-option-hover': '#f1f5f9',
            '--poll-option-selected': '#dbeafe',
        },
    },
];

interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeChange: (themeId: string) => void;
    isPro?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    selectedTheme,
    onThemeChange,
    isPro = false,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Palette size={16} className="text-indigo-500" />
                <span>Poll Theme</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {POLL_THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    const isLocked = theme.isPro && !isPro;
                    
                    return (
                        <motion.button
                            key={theme.id}
                            onClick={() => !isLocked && onThemeChange(theme.id)}
                            whileHover={{ scale: isLocked ? 1 : 1.05 }}
                            whileTap={{ scale: isLocked ? 1 : 0.95 }}
                            className={`relative p-2 rounded-lg border-2 transition-all ${
                                isSelected
                                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                                    : isLocked
                                    ? 'border-slate-200 opacity-60 cursor-not-allowed'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                            title={isLocked ? 'Pro feature' : theme.name}
                        >
                            {/* Color preview */}
                            <div className="flex gap-1 mb-1.5">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: theme.preview.primaryColor }}
                                />
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: theme.preview.secondaryColor }}
                                />
                            </div>
                            
                            {/* Theme name */}
                            <div className="text-[10px] font-medium text-slate-600 truncate">
                                {theme.name}
                            </div>
                            
                            {/* Selected indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                                >
                                    <Check size={12} className="text-white" />
                                </motion.div>
                            )}
                            
                            {/* Pro badge */}
                            {theme.isPro && (
                                <div className="absolute -top-1 -left-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                    <Crown size={10} className="text-amber-800" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
            
            {!isPro && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Crown size={12} className="text-amber-500" />
                    Upgrade to Pro for premium themes
                </p>
            )}
        </div>
    );
};

export default ThemeSelector;
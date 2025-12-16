import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Crown, Upload, Pipette } from 'lucide-react';

export interface PollTheme {
    id: string;
    name: string;
    preview: {
        primaryColor: string;
        secondaryColor: string;
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

// ALL THEMES ARE FREE!
export const POLL_THEMES: PollTheme[] = [
    {
        id: 'default',
        name: 'Classic Blue',
        preview: { primaryColor: '#6366f1', secondaryColor: '#818cf8' },
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
        preview: { primaryColor: '#0891b2', secondaryColor: '#06b6d4' },
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
        preview: { primaryColor: '#f97316', secondaryColor: '#fb923c' },
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
        preview: { primaryColor: '#16a34a', secondaryColor: '#22c55e' },
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
        preview: { primaryColor: '#9333ea', secondaryColor: '#a855f7' },
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
        preview: { primaryColor: '#e11d48', secondaryColor: '#f43f5e' },
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
        preview: { primaryColor: '#3b82f6', secondaryColor: '#60a5fa' },
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
        preview: { primaryColor: '#1e40af', secondaryColor: '#3b82f6' },
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
    const [showCustomizer, setShowCustomizer] = useState(false);
    const [customPrimary, setCustomPrimary] = useState('#6366f1');
    const [customSecondary, setCustomSecondary] = useState('#818cf8');
    
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Palette size={16} className="text-indigo-500" />
                    <span>Poll Theme</span>
                </div>
                {isPro && (
                    <button
                        onClick={() => setShowCustomizer(!showCustomizer)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        <Pipette size={12} />
                        {showCustomizer ? 'Hide' : 'Custom Branding'}
                    </button>
                )}
            </div>
            
            {/* Theme Grid - All Free */}
            <div className="grid grid-cols-4 gap-2">
                {POLL_THEMES.map((theme) => {
                    const isSelected = selectedTheme === theme.id;
                    
                    return (
                        <motion.button
                            key={theme.id}
                            onClick={() => onThemeChange(theme.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative p-2 rounded-lg border-2 transition-all ${
                                isSelected
                                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                            title={theme.name}
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
                        </motion.button>
                    );
                })}
            </div>
            
            {/* Pro Custom Branding Teaser (for non-Pro users) */}
            {!isPro && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                        <Crown size={14} className="text-amber-600" />
                        <span className="text-sm font-bold text-amber-800">Custom Branding</span>
                        <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold rounded">PRO</span>
                    </div>
                    <p className="text-xs text-amber-700">
                        Upload your logo and pick custom colors to match your brand.
                    </p>
                </div>
            )}
            
            {/* Custom Branding Panel (Pro only) */}
            <AnimatePresence>
                {isPro && showCustomizer && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 space-y-4">
                            <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                                <Crown size={14} className="text-amber-500" />
                                Custom Branding
                            </h4>
                            
                            {/* Custom Colors */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-600 block mb-1">Primary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={customPrimary}
                                            onChange={(e) => setCustomPrimary(e.target.value)}
                                            className="w-8 h-8 rounded border-2 border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={customPrimary}
                                            onChange={(e) => setCustomPrimary(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded font-mono"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium text-slate-600 block mb-1">Secondary</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={customSecondary}
                                            onChange={(e) => setCustomSecondary(e.target.value)}
                                            className="w-8 h-8 rounded border-2 border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={customSecondary}
                                            onChange={(e) => setCustomSecondary(e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Logo Upload */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 block mb-2">Your Logo</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center">
                                        <Upload size={16} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <button
                                            onClick={() => alert('Logo upload available in admin dashboard after poll creation.')}
                                            className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Upload Logo
                                        </button>
                                        <p className="text-[10px] text-slate-500 mt-0.5">PNG/SVG, max 2MB</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-1.5 rounded">
                                💡 Custom branding can also be updated from the admin dashboard after poll creation.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeSelector;
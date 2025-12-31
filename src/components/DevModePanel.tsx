import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bug, 
    Crown, 
    Zap, 
    X, 
    Check, 
    Trash2, 
    RefreshCw,
    ChevronDown,
    ChevronUp,
    AlertTriangle
} from 'lucide-react';

interface DevModePanelProps {
    onTierChange?: (tier: string | null) => void;
}

const TIERS = [
    { id: 'free', name: 'Free', color: 'bg-slate-100 text-slate-700', features: ['25 responses', '7 days', 'Basic analytics'] },
    { id: 'starter', name: 'Starter ($4.99)', color: 'bg-blue-100 text-blue-700', features: ['500 responses', '30 days', 'Full analytics'] },
    { id: 'pro_event', name: 'Pro Event ($9.99)', color: 'bg-purple-100 text-purple-700', features: ['2,000 responses', '90 days', 'All features'] },
    { id: 'unlimited', name: 'Unlimited ($29.99)', color: 'bg-amber-100 text-amber-700', features: ['∞ responses', '1 year', 'Notifications'] },
];

const DevModePanel: React.FC<DevModePanelProps> = ({ onTierChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTier, setCurrentTier] = useState<string | null>(null);
    const [devModeEnabled, setDevModeEnabled] = useState(false);

    useEffect(() => {
        // Check if dev mode is enabled
        const devMode = localStorage.getItem('vg_dev_mode') === 'true';
        setDevModeEnabled(devMode);
        
        if (devMode) {
            const tier = localStorage.getItem('vg_purchased_tier');
            setCurrentTier(tier);
        }
    }, []);

    // Only show in development or if explicitly enabled
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('netlify.app') ||
                  localStorage.getItem('vg_dev_mode') === 'true';

    if (!isDev) return null;

    const enableDevMode = () => {
        localStorage.setItem('vg_dev_mode', 'true');
        setDevModeEnabled(true);
    };

    const disableDevMode = () => {
        localStorage.removeItem('vg_dev_mode');
        localStorage.removeItem('vg_purchased_tier');
        localStorage.removeItem('vg_tier_expires');
        setDevModeEnabled(false);
        setCurrentTier(null);
        onTierChange?.(null);
        window.location.reload();
    };

    const setTier = (tierId: string | null) => {
        if (tierId) {
            localStorage.setItem('vg_purchased_tier', tierId);
            // Set expiry to 1 year from now for testing
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);
            localStorage.setItem('vg_tier_expires', expiry.toISOString());
        } else {
            localStorage.removeItem('vg_purchased_tier');
            localStorage.removeItem('vg_tier_expires');
        }
        setCurrentTier(tierId);
        onTierChange?.(tierId);
    };

    const clearAllData = () => {
        if (confirm('Clear ALL VoteGenerator data from localStorage? This will remove all saved polls, votes, and settings.')) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('vg_') || key.startsWith('votegenerator')) {
                    localStorage.removeItem(key);
                }
            });
            window.location.reload();
        }
    };

    return (
        <>
            {/* Floating Dev Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-50 p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors group"
                title="Dev Tools"
            >
                <Bug size={20} />
                {devModeEnabled && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {/* Dev Panel Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bug size={20} />
                                    <span className="font-bold">Dev Tools</span>
                                    {devModeEnabled && (
                                        <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">Active</span>
                                    )}
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Warning */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                                    <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Dev mode is for testing only. Changes affect localStorage and will persist until cleared.
                                    </p>
                                </div>

                                {/* Enable/Disable Dev Mode */}
                                {!devModeEnabled ? (
                                    <button
                                        onClick={enableDevMode}
                                        className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={18} /> Enable Dev Mode
                                    </button>
                                ) : (
                                    <>
                                        {/* Tier Selector */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Simulate Purchased Tier
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TIERS.map(tier => (
                                                    <button
                                                        key={tier.id}
                                                        onClick={() => setTier(tier.id === currentTier ? null : tier.id)}
                                                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                            currentTier === tier.id 
                                                                ? 'border-indigo-500 bg-indigo-50' 
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.color}`}>
                                                                {tier.name.split(' ')[0]}
                                                            </span>
                                                            {currentTier === tier.id && (
                                                                <Check size={16} className="text-indigo-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 mt-1">
                                                            {tier.features[0]}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expandable Details */}
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="w-full flex items-center justify-between py-2 text-sm text-slate-600"
                                        >
                                            <span>Advanced Options</span>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        {isExpanded && (
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => window.location.reload()}
                                                    className="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={14} /> Reload Page
                                                </button>
                                                <button
                                                    onClick={clearAllData}
                                                    className="w-full py-2 px-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Clear All VG Data
                                                </button>
                                            </div>
                                        )}

                                        {/* Current State */}
                                        <div className="bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600">
                                            <p>vg_purchased_tier: {currentTier || 'null'}</p>
                                            <p>vg_dev_mode: true</p>
                                        </div>

                                        {/* Disable */}
                                        <button
                                            onClick={disableDevMode}
                                            className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline"
                                        >
                                            Disable Dev Mode & Reset
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DevModePanel;
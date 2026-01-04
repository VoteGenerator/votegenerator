// ============================================================================
// FeatureTeaserCard.tsx - Shows locked features with upgrade prompts
// Location: src/components/FeatureTeaserCard.tsx
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, 
    Crown, 
    ArrowRight, 
    BarChart3, 
    Bell, 
    Globe, 
    Link2, 
    Palette,
    Shield,
    Zap,
    X
} from 'lucide-react';

type FeatureType = 
    | 'analytics' 
    | 'notifications' 
    | 'customSlug' 
    | 'branding' 
    | 'security'
    | 'unlimited';

interface FeatureConfig {
    icon: React.ElementType;
    title: string;
    description: string;
    preview: string;
    tier: 'pro' | 'business';
    gradient: string;
}

const FEATURE_CONFIGS: Record<FeatureType, FeatureConfig> = {
    analytics: {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'See where voters come from, peak voting times, device breakdown, and geographic insights.',
        preview: 'Unlock charts showing voter locations, hourly patterns, and traffic sources.',
        tier: 'pro',
        gradient: 'from-blue-500 to-indigo-500'
    },
    notifications: {
        icon: Bell,
        title: 'Email Notifications',
        description: 'Get notified when votes come in, milestones are reached, or your poll closes.',
        preview: 'Add up to 10 email addresses and customize which events trigger alerts.',
        tier: 'pro',
        gradient: 'from-amber-500 to-orange-500'
    },
    customSlug: {
        icon: Link2,
        title: 'Custom Short Links',
        description: 'Create branded, memorable URLs like votegenerator.com/p/your-company-survey',
        preview: 'Replace random poll IDs with custom slugs that match your brand.',
        tier: 'business',
        gradient: 'from-purple-500 to-pink-500'
    },
    branding: {
        icon: Palette,
        title: 'Custom Branding',
        description: 'Add your logo, remove VoteGenerator branding, and customize colors.',
        preview: 'Upload your logo and make polls look like they\'re from your organization.',
        tier: 'pro',
        gradient: 'from-emerald-500 to-teal-500'
    },
    security: {
        icon: Shield,
        title: 'Enhanced Security',
        description: 'Advanced bot protection with invisible reCAPTCHA and suspicious activity alerts.',
        preview: 'Get alerts when unusual voting patterns are detected.',
        tier: 'business',
        gradient: 'from-red-500 to-rose-500'
    },
    unlimited: {
        icon: Zap,
        title: 'Unlimited Responses',
        description: 'Remove the 100 response limit and collect as many votes as you need.',
        preview: 'Free plan limited to 100 responses. Upgrade for unlimited.',
        tier: 'pro',
        gradient: 'from-cyan-500 to-blue-500'
    }
};

interface FeatureTeaserCardProps {
    feature: FeatureType;
    currentTier?: 'free' | 'pro' | 'business';
    compact?: boolean;
    onUpgradeClick?: () => void;
}

const FeatureTeaserCard: React.FC<FeatureTeaserCardProps> = ({
    feature,
    currentTier = 'free',
    compact = false,
    onUpgradeClick
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const config = FEATURE_CONFIGS[feature];
    
    if (!config) return null;
    
    const Icon = config.icon;
    const isUnlocked = 
        (config.tier === 'pro' && (currentTier === 'pro' || currentTier === 'business')) ||
        (config.tier === 'business' && currentTier === 'business');
    
    // Don't show teaser if already unlocked
    if (isUnlocked) return null;
    
    const tierLabel = config.tier === 'pro' ? 'PRO' : 'BUSINESS';
    const tierColor = config.tier === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700';
    
    const handleUpgrade = () => {
        if (onUpgradeClick) {
            onUpgradeClick();
        } else {
            window.location.href = '/#pricing';
        }
    };
    
    if (compact) {
        return (
            <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-200 overflow-hidden group">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center opacity-60`}>
                            <Icon size={18} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-600">{config.title}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tierColor}`}>
                                    {tierLabel}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{config.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleUpgrade}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        Upgrade <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <motion.div 
                className="relative bg-white rounded-xl border-2 border-slate-200 overflow-hidden group cursor-pointer hover:border-indigo-300 transition-colors"
                onClick={() => setShowPreview(true)}
                whileHover={{ y: -2 }}
            >
                {/* Lock badge */}
                <div className="absolute top-3 right-3 z-10">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${tierColor}`}>
                        <Lock size={10} />
                        {tierLabel}
                    </div>
                </div>
                
                {/* Gradient header */}
                <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg opacity-80`}>
                            <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{config.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{config.description}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Click to preview</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUpgrade();
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                        >
                            Upgrade <ArrowRight size={12} />
                        </button>
                    </div>
                </div>
                
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            </motion.div>
            
            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setShowPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className={`p-6 bg-gradient-to-br ${config.gradient} text-white relative`}>
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Icon size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold">{config.title}</h3>
                                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                                                {tierLabel}
                                            </span>
                                        </div>
                                        <p className="text-white/80 text-sm mt-1">{config.description}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Body */}
                            <div className="p-6">
                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Crown size={16} className="text-amber-500" />
                                        What you'll get
                                    </h4>
                                    <p className="text-slate-600 text-sm">{config.preview}</p>
                                </div>
                                
                                {/* Blurred preview placeholder */}
                                <div className="relative rounded-xl overflow-hidden mb-4">
                                    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <Lock size={24} className="text-slate-400 mx-auto mb-2" />
                                            <span className="text-sm text-slate-500">Preview available after upgrade</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleUpgrade}
                                    className={`w-full py-3 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                                >
                                    Upgrade to {config.tier === 'pro' ? 'Pro' : 'Business'}
                                    <ArrowRight size={18} />
                                </button>
                                
                                <p className="text-center text-xs text-slate-400 mt-3">
                                    Cancel anytime • No long-term commitment
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Grid component for showing multiple teasers
interface FeatureTeaserGridProps {
    currentTier?: 'free' | 'pro' | 'business';
    features?: FeatureType[];
    columns?: 2 | 3;
}

export const FeatureTeaserGrid: React.FC<FeatureTeaserGridProps> = ({
    currentTier = 'free',
    features = ['analytics', 'notifications', 'customSlug', 'unlimited'],
    columns = 2
}) => {
    const visibleFeatures = features.filter(feature => {
        const config = FEATURE_CONFIGS[feature];
        if (!config) return false;
        
        const isUnlocked = 
            (config.tier === 'pro' && (currentTier === 'pro' || currentTier === 'business')) ||
            (config.tier === 'business' && currentTier === 'business');
        
        return !isUnlocked;
    });
    
    if (visibleFeatures.length === 0) return null;
    
    return (
        <div className={`grid gap-4 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {visibleFeatures.map(feature => (
                <FeatureTeaserCard 
                    key={feature} 
                    feature={feature} 
                    currentTier={currentTier}
                />
            ))}
        </div>
    );
};

export default FeatureTeaserCard;
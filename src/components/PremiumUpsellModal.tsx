import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Image as ImageIcon, BarChart2, Shield, Sparkles, ArrowRight } from 'lucide-react';

interface PremiumUpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: string; // Which feature triggered the upsell
}

const PREMIUM_FEATURES = [
    { icon: ImageIcon, text: 'Visual Polls - Beautiful image voting', highlight: true },
    { icon: Shield, text: 'Remove VoteGenerator branding' },
    { icon: BarChart2, text: 'Advanced analytics & exports' },
    { icon: Zap, text: 'Priority support' },
    { icon: Sparkles, text: 'Custom themes & colors' },
];

const PremiumUpsellModal: React.FC<PremiumUpsellModalProps> = ({ 
    isOpen, 
    onClose,
    feature = 'Visual Poll'
}) => {
    const handleUpgrade = () => {
        // TODO: Integrate with your payment provider (Stripe, etc.)
        // For now, redirect to pricing page
        window.location.href = '/pricing';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header with gradient */}
                            <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-6 text-white">
                                <button 
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                
                                <motion.div
                                    initial={{ rotate: -10, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", delay: 0.1 }}
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
                                >
                                    <Crown size={32} className="text-white" />
                                </motion.div>
                                
                                <h2 className="text-2xl font-black mb-2">Unlock {feature}</h2>
                                <p className="text-white/90 text-sm">
                                    Upgrade to Pro for beautiful image polls and premium features.
                                </p>
                            </div>
                            
                            {/* Features List */}
                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    {PREMIUM_FEATURES.map((feat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            className={`flex items-center gap-3 p-2 rounded-lg ${feat.highlight ? 'bg-amber-50' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feat.highlight ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <feat.icon size={16} />
                                            </div>
                                            <span className={`text-sm font-medium ${feat.highlight ? 'text-amber-900' : 'text-slate-700'}`}>
                                                {feat.text}
                                            </span>
                                            {feat.highlight && (
                                                <span className="ml-auto text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                                    NEW
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Pricing */}
                                <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-center">
                                    <div className="text-sm text-slate-500 mb-1">Starting at</div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-black text-slate-800">$9</span>
                                        <span className="text-slate-500">/month</span>
                                    </div>
                                    <div className="text-xs text-emerald-600 font-medium mt-1">
                                        ✨ 7-day free trial included
                                    </div>
                                </div>
                                
                                {/* CTA Buttons */}
                                <button
                                    onClick={handleUpgrade}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 text-lg"
                                >
                                    <Zap size={20} /> Start Free Trial <ArrowRight size={18} />
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-slate-500 hover:text-slate-700 font-medium text-sm mt-2 transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                            
                            {/* Trust badges */}
                            <div className="px-6 pb-6">
                                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Check size={12} className="text-emerald-500" /> Cancel anytime
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Shield size={12} className="text-emerald-500" /> Secure payment
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PremiumUpsellModal;
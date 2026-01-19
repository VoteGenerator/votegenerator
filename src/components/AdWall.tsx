// ============================================================================
// AdWall.tsx - Ad interstitial before accessing poll results (Free users)
// Location: src/components/AdWall.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Clock, Zap, Crown, Check, Sparkles, ArrowRight,
    BarChart3, Shield, Palette, Users, Infinity, Download
} from 'lucide-react';

const AdWall: React.FC = () => {
    const [countdown, setCountdown] = useState(5);
    const [canSkip, setCanSkip] = useState(false);
    
    // Get redirect URL from query params
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || '/admin';
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanSkip(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const handleContinue = () => {
        window.location.href = decodeURIComponent(redirectUrl);
    };
    
    const handleUpgrade = () => {
        window.location.href = '/pricing';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-4">
                        <Clock size={16} />
                        {canSkip ? 'Ready to continue!' : `Please wait ${countdown} seconds...`}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                        Your Poll is Ready! 🎉
                    </h1>
                    <p className="text-white/60">
                        While you wait, see what Pro offers...
                    </p>
                </motion.div>
                
                {/* Main Content - Pro/Business Plan Promo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-500/20 backdrop-blur-sm border-2 border-amber-400/30 rounded-3xl p-8 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Left - Plan Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Crown size={28} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Upgrade to Pro</h2>
                                    <p className="text-amber-300 font-medium">Unlock premium features</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>Unlimited polls & surveys</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>No ads or waiting</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>Advanced analytics</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>Custom branding</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>Export CSV/PDF/PNG</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Check size={18} className="text-emerald-400" />
                                    <span>Priority support</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right - CTA */}
                        <div className="lg:w-64 w-full">
                            <button
                                onClick={handleUpgrade}
                                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap size={20} />
                                View Plans
                            </button>
                            <p className="text-center text-white/40 text-xs mt-3">
                                Cancel anytime
                            </p>
                            
                            {/* Benefits */}
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/60 text-sm mb-3 font-medium">Why upgrade?</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Sparkles size={14} className="text-amber-400" />
                                        <span>Skip all wait times</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Infinity size={14} className="text-amber-400" />
                                        <span>Unlimited everything</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Download size={14} className="text-amber-400" />
                                        <span>Export your data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Skip Button Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    {/* Upgrade CTA for impatient users */}
                    {!canSkip && (
                        <div className="mb-4 p-4 bg-white/5 rounded-xl inline-block">
                            <p className="text-white/80 text-sm flex items-center gap-2">
                                <Zap size={16} className="text-amber-400" />
                                <span>Skip the wait!</span>
                                <button 
                                    onClick={handleUpgrade}
                                    className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2"
                                >
                                    Upgrade to Pro
                                </button>
                                <span>for instant access.</span>
                            </p>
                        </div>
                    )}
                    
                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!canSkip}
                        className={`px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center gap-2 mx-auto ${
                            canSkip 
                                ? 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 shadow-lg' 
                                : 'bg-white/20 text-white/40 cursor-not-allowed'
                        }`}
                    >
                        {canSkip ? (
                            <>
                                Continue to Dashboard
                                <ArrowRight size={20} />
                            </>
                        ) : (
                            <>
                                <Clock size={20} />
                                Wait {countdown}s to continue
                            </>
                        )}
                    </button>
                    
                    {canSkip && (
                        <p className="text-white/40 text-sm mt-3">
                            You can now access your poll dashboard
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdWall;
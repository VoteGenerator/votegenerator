// ============================================================================
// CheckoutSuccess.tsx - Post-payment success page
// Location: src/components/CheckoutSuccess.tsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, Star, ArrowRight, Copy, Check, Mail, Sparkles, Shield, Zap, BarChart3, Download, Palette, Users, Clock, Image, Globe, Rocket } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
    const [tier, setTier] = useState<'pro' | 'business'>('pro');
    const [email, setEmail] = useState('');
    const [dashboardToken, setDashboardToken] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Get params from URL
        const params = new URLSearchParams(window.location.search);
        const tierParam = params.get('tier');
        const emailParam = params.get('email') || '';
        const tokenParam = params.get('token') || '';
        
        // Determine tier - MUST match what was passed from checkout
        const determinedTier = tierParam === 'business' ? 'business' : 'pro';
        
        setTier(determinedTier);
        setEmail(emailParam);
        setDashboardToken(tokenParam);

        // Save to localStorage
        localStorage.setItem('vg_purchased_tier', determinedTier);
        
        // Calculate expiration: 1 year from now (365 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 365);
        localStorage.setItem('vg_expires_at', expiresAt.toISOString());
        
        if (tokenParam) {
            localStorage.setItem('vg_dashboard_token', tokenParam);
            
            // Update session
            const session = {
                tier: determinedTier,
                email: emailParam,
                dashboardToken: tokenParam,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem('vg_user_session', JSON.stringify(session));
        }

        console.log('[CheckoutSuccess] Tier:', determinedTier, 'Token:', tokenParam ? 'present' : 'none');
    }, []);

    const copyDashboardLink = () => {
        const link = dashboardToken 
            ? `${window.location.origin}/admin?t=${dashboardToken}`
            : `${window.location.origin}/admin`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Features per tier - ACTUAL features we built
    const proFeatures = [
        { icon: BarChart3, text: '10,000 responses per poll' },
        { icon: Zap, text: 'Unlimited active polls' },
        { icon: Clock, text: '365-day poll duration' },
        { icon: Download, text: 'Export to CSV/Excel' },
        { icon: Palette, text: 'Custom themes & colors' },
        { icon: Mail, text: 'Email notifications' },
        { icon: Shield, text: 'No ads for your voters' },
    ];

    const businessFeatures = [
        { icon: BarChart3, text: '100,000 responses per poll' },
        { icon: Zap, text: 'Unlimited active polls' },
        { icon: Clock, text: '365-day poll duration' },
        { icon: Image, text: 'Upload your logo' },
        { icon: Globe, text: 'White-label embeds' },
        { icon: BarChart3, text: 'Hourly heatmap analytics' },
        { icon: Users, text: 'Cross-tab analysis' },
        { icon: Download, text: 'Filtered data exports' },
        { icon: Shield, text: 'Priority support' },
    ];

    const features = tier === 'business' ? businessFeatures : proFeatures;
    const isBusiness = tier === 'business';

    return (
        <div className={`min-h-screen ${
            isBusiness 
                ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50' 
                : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'
        }`}>
            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                        isBusiness ? 'bg-amber-100' : 'bg-purple-100'
                    }`}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                        >
                            <CheckCircle size={48} className={isBusiness ? 'text-amber-600' : 'text-purple-600'} />
                        </motion.div>
                    </div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-3"
                    >
                        Welcome to {isBusiness ? 'Business' : 'Pro'}! 🎉
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-slate-600"
                    >
                        Your account has been upgraded successfully
                    </motion.p>
                </motion.div>

                {/* Plan Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-6 rounded-2xl mb-6 ${
                        isBusiness 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    } text-white text-center`}
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        {isBusiness ? <Star size={28} /> : <Crown size={28} />}
                        <span className="text-2xl font-bold">{isBusiness ? 'Business' : 'Pro'} Plan</span>
                    </div>
                    <p className="text-white/80">
                        {isBusiness ? '$49/year • Unlimited polls' : '$19/year • 25 polls'}
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6"
                >
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Sparkles size={20} className={isBusiness ? 'text-amber-500' : 'text-purple-500'} />
                        Your {isBusiness ? 'Business' : 'Pro'} Features
                    </h2>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isBusiness ? 'bg-amber-100' : 'bg-purple-100'
                                    }`}>
                                        <Icon size={16} className={isBusiness ? 'text-amber-600' : 'text-purple-600'} />
                                    </div>
                                    <span className="text-sm text-slate-700">{feature.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Save Dashboard Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 mb-6"
                >
                    <h2 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                        <Shield size={20} />
                        Save Your Dashboard Link
                    </h2>
                    <p className="text-sm text-indigo-700 mb-4">
                        This link gives you access to all your polls. {email && `We've also sent it to ${email}.`}
                    </p>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={copyDashboardLink}
                            className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                                copied 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Dashboard Link'}
                        </button>
                        <a
                            href={`mailto:?subject=${encodeURIComponent('My VoteGenerator Dashboard')}&body=${encodeURIComponent(`Here's my VoteGenerator dashboard link:\n\n${window.location.origin}/admin${dashboardToken ? `?t=${dashboardToken}` : ''}`)}`}
                            className="px-4 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-xl font-medium hover:bg-indigo-50 transition flex items-center gap-2"
                        >
                            <Mail size={18} />
                        </a>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <a
                        href={dashboardToken ? `/admin?t=${dashboardToken}` : '/admin'}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl hover:scale-105 ${
                            isBusiness 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-200'
                        }`}
                    >
                        <Rocket size={22} />
                        Go to Dashboard
                        <ArrowRight size={22} />
                    </a>
                    
                    <p className="text-slate-500 text-sm mt-4">
                        Or <a href="/create" className="text-indigo-600 hover:underline">create a new poll</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
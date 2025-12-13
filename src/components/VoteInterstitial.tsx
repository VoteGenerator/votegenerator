import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Users, Clock, CheckCircle, ExternalLink, Sparkles, Gift, Vote } from 'lucide-react';
import type { Poll } from '../types';

interface VoteInterstitialProps {
    poll: Poll;
    isPremiumPoll: boolean; // Whether the poll creator has premium (no ads)
    onContinue: () => void;
}

// Sister site ad configuration - customize this!
const SISTER_SITE_AD = {
    title: "🎁 Planning a Gift Exchange?",
    description: "SecretSantaMatch.com makes it easy - no signup required!",
    cta: "Try it Free",
    url: "https://secretsantamatch.com?utm_source=votegenerator&utm_medium=interstitial&utm_campaign=poll_vote",
    image: "/images/secretsanta-preview.png", // Add your preview image
    bgGradient: "from-red-500 to-green-600",
    features: [
        "🎄 No email or signup needed",
        "🔒 100% private & secure", 
        "⚡ Takes under 5 minutes"
    ]
};

const VoteInterstitial: React.FC<VoteInterstitialProps> = ({ 
    poll, 
    isPremiumPoll,
    onContinue 
}) => {
    const [countdown, setCountdown] = useState(isPremiumPoll ? 0 : 3); // 3 second countdown for free
    const [canSkip, setCanSkip] = useState(isPremiumPoll);

    // Countdown timer for ad display
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanSkip(true);
        }
    }, [countdown]);

    // Track ad impression
    useEffect(() => {
        if (!isPremiumPoll) {
            // Track that ad was shown (for your analytics)
            console.log('Ad impression tracked:', SISTER_SITE_AD.url);
            // TODO: Send to your analytics service
            // trackEvent('interstitial_ad_impression', { poll_id: poll.id });
        }
    }, [isPremiumPoll, poll.id]);

    const handleAdClick = () => {
        // Track ad click
        console.log('Ad click tracked:', SISTER_SITE_AD.url);
        // TODO: Send to your analytics service
        // trackEvent('interstitial_ad_click', { poll_id: poll.id });
        window.open(SISTER_SITE_AD.url, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4"
        >
            <div className="max-w-lg w-full">
                {/* Poll Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-6"
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Vote size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black">{poll.title}</h1>
                                {poll.description && (
                                    <p className="text-white/80 text-sm mt-1 line-clamp-2">{poll.description}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Poll Stats */}
                        <div className="flex items-center gap-4 text-sm text-white/80">
                            <div className="flex items-center gap-1.5">
                                <Users size={14} />
                                <span>{poll.voteCount} vote{poll.voteCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <BarChart2 size={14} />
                                <span>{poll.options.length} options</span>
                            </div>
                            {poll.settings.deadline && (
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>Ends {new Date(poll.settings.deadline).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="p-6">
                        <h2 className="font-bold text-slate-800 mb-3">How to Vote</h2>
                        <div className="space-y-2">
                            {poll.pollType === 'ranked' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                    <span>Drag and drop to rank options from most to least preferred</span>
                                </div>
                            )}
                            {poll.pollType === 'image' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-pink-500 mt-0.5 shrink-0" />
                                    <span>Click on your favorite image{poll.settings.allowMultiple ? 's' : ''} to select</span>
                                </div>
                            )}
                            {poll.pollType === 'multiple' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                    <span>Select {poll.settings.allowMultiple ? 'one or more options' : 'your preferred option'}</span>
                                </div>
                            )}
                            {poll.pollType === 'meeting' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span>Mark all the times you're available</span>
                                </div>
                            )}
                            {poll.pollType === 'dot' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>Distribute your {poll.settings.dotBudget || 10} dots across options</span>
                                </div>
                            )}
                            {poll.pollType === 'pairwise' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                                    <span>Choose your preference in each head-to-head matchup</span>
                                </div>
                            )}
                            {poll.pollType === 'rating' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                                    <span>Rate each option on a scale from 0 to 100</span>
                                </div>
                            )}
                            {poll.pollType === 'budget' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>Spend your ${poll.settings.budgetLimit || 100} budget on features you want</span>
                                </div>
                            )}
                            {poll.pollType === 'matrix' && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-fuchsia-500 mt-0.5 shrink-0" />
                                    <span>Drag each item to its position on the Impact vs Effort grid</span>
                                </div>
                            )}
                            
                            {poll.settings.requireNames && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <span>Your name will be required to submit</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* AD SECTION - Only for free polls */}
                {!isPremiumPoll && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="text-xs text-slate-400 text-center mb-2 uppercase tracking-wide">
                            From our friends
                        </div>
                        <div 
                            onClick={handleAdClick}
                            className={`bg-gradient-to-br ${SISTER_SITE_AD.bgGradient} rounded-2xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-lg`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-black text-lg mb-1">{SISTER_SITE_AD.title}</h3>
                                    <p className="text-white/90 text-sm mb-3">{SISTER_SITE_AD.description}</p>
                                    <div className="space-y-1 mb-4">
                                        {SISTER_SITE_AD.features.map((feat, i) => (
                                            <div key={i} className="text-xs text-white/80">{feat}</div>
                                        ))}
                                    </div>
                                    <button className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-white/90 transition-colors inline-flex items-center gap-2">
                                        {SISTER_SITE_AD.cta} <ExternalLink size={14} />
                                    </button>
                                </div>
                                {/* Optional: Add preview image */}
                                <div className="hidden sm:block w-24 h-24 bg-white/20 rounded-xl overflow-hidden">
                                    <Gift size={48} className="w-full h-full p-4 text-white/50" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={onContinue}
                        disabled={!canSkip}
                        className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg ${
                            canSkip 
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {canSkip ? (
                            <>
                                <Sparkles size={20} /> Continue to Vote <ArrowRight size={18} />
                            </>
                        ) : (
                            <>
                                Continue in {countdown}...
                            </>
                        )}
                    </button>
                    
                    {!isPremiumPoll && (
                        <p className="text-center text-xs text-slate-400 mt-3">
                            <a href="/pricing" className="hover:text-indigo-600 transition-colors">
                                Upgrade to remove ads →
                            </a>
                        </p>
                    )}
                </motion.div>

                {/* VoteGenerator Branding */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <a 
                        href="/" 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                    >
                        <BarChart2 size={16} />
                        <span>Powered by <strong>VoteGenerator.com</strong></span>
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default VoteInterstitial;
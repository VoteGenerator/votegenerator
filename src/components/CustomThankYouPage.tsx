import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Check, 
    ExternalLink, 
    Copy, 
    Twitter, 
    Facebook, 
    Linkedin,
    MessageCircle,
    Crown,
    ArrowRight
} from 'lucide-react';

interface ThankYouConfig {
    // Custom message (Pro+ feature)
    customMessage?: string;
    // Custom redirect URL (Pro+ feature)
    redirectUrl?: string;
    redirectDelay?: number; // seconds
    // Custom branding (Pro feature)
    showLogo?: boolean;
    logoUrl?: string;
    // Call to action (Pro+ feature)
    ctaText?: string;
    ctaUrl?: string;
    // Social sharing
    enableSharing?: boolean;
    // Show results link
    showResultsLink?: boolean;
}

interface CustomThankYouPageProps {
    pollTitle: string;
    pollId: string;
    voterName?: string;
    isPremiumPoll: boolean;
    config?: ThankYouConfig;
}

const CustomThankYouPage: React.FC<CustomThankYouPageProps> = ({
    pollTitle,
    pollId,
    voterName,
    isPremiumPoll,
    config = {}
}) => {
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState(config.redirectDelay || 0);

    // Handle redirect countdown
    React.useEffect(() => {
        if (config.redirectUrl && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (config.redirectUrl && countdown === 0 && config.redirectDelay) {
            window.location.href = config.redirectUrl;
        }
    }, [countdown, config.redirectUrl, config.redirectDelay]);

    const pollUrl = `${window.location.origin}/vote/${pollId}`;
    const resultsUrl = `${window.location.origin}/results/${pollId}`;

    const copyLink = () => {
        navigator.clipboard.writeText(pollUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just voted on "${pollTitle}"! Cast your vote too:`)}&url=${encodeURIComponent(pollUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`Vote on "${pollTitle}": ${pollUrl}`)}`
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full"
            >
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 text-center bg-gradient-to-br from-green-500 to-emerald-600">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <Check size={40} className="text-green-500" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {voterName ? `Thanks, ${voterName}!` : 'Vote Submitted!'}
                        </h1>
                        <p className="text-green-100">
                            Your response has been recorded
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Custom Message (Pro+ feature) */}
                        {isPremiumPoll && config.customMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 bg-indigo-50 rounded-xl border border-indigo-100"
                            >
                                <p className="text-indigo-800 text-center">
                                    {config.customMessage}
                                </p>
                            </motion.div>
                        )}

                        {/* Custom CTA Button (Pro+ feature) */}
                        {isPremiumPoll && config.ctaText && config.ctaUrl && (
                            <motion.a
                                href={config.ctaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center rounded-xl hover:shadow-lg transition-all"
                            >
                                {config.ctaText}
                                <ExternalLink size={16} className="inline ml-2" />
                            </motion.a>
                        )}

                        {/* Redirect Countdown (Pro+ feature) */}
                        {isPremiumPoll && config.redirectUrl && config.redirectDelay && countdown > 0 && (
                            <p className="text-center text-slate-500 text-sm">
                                Redirecting in {countdown} seconds...
                            </p>
                        )}

                        {/* Poll Info */}
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-500 mb-1">You voted on:</p>
                            <p className="font-semibold text-slate-800">{pollTitle}</p>
                        </div>

                        {/* View Results Link */}
                        {(config.showResultsLink !== false) && (
                            <a
                                href={resultsUrl}
                                className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                View Results
                                <ArrowRight size={16} />
                            </a>
                        )}

                        {/* Share Section */}
                        {(config.enableSharing !== false) && (
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm font-medium text-slate-700 text-center mb-4">
                                    Share this poll
                                </p>
                                
                                {/* Copy Link */}
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={pollUrl}
                                        readOnly
                                        className="flex-1 p-3 bg-slate-100 rounded-xl text-sm text-slate-600 truncate"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                            copied 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                        }`}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>

                                {/* Social Share Buttons */}
                                <div className="flex justify-center gap-3">
                                    <a
                                        href={shareLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[#1DA1F2] text-white rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Twitter size={20} />
                                    </a>
                                    <a
                                        href={shareLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[#4267B2] text-white rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href={shareLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[#0A66C2] text-white rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                    <a
                                        href={shareLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        <MessageCircle size={20} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Only show for free polls */}
                    {!isPremiumPoll && (
                        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown size={16} className="text-amber-600" />
                                    <span className="text-sm text-amber-800">
                                        Want a custom thank you page?
                                    </span>
                                </div>
                                <a 
                                    href="/pricing" 
                                    className="text-sm font-bold text-amber-700 hover:text-amber-800"
                                >
                                    Upgrade →
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Powered by (only if not premium or branding not removed) */}
                {!isPremiumPoll && (
                    <p className="text-center text-slate-400 text-sm mt-6">
                        Powered by <a href="https://votegenerator.com" className="text-indigo-500 hover:underline">VoteGenerator</a>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default CustomThankYouPage;

/* 
USAGE EXAMPLE:

// Free user - default thank you page
<CustomThankYouPage 
    pollTitle="Team Lunch Vote"
    pollId="abc123"
    isPremiumPoll={false}
/>

// Pro+ user - fully customized
<CustomThankYouPage 
    pollTitle="Team Lunch Vote"
    pollId="abc123"
    voterName="Sarah"
    isPremiumPoll={true}
    config={{
        customMessage: "Thanks for voting! We'll announce the winning restaurant on Friday.",
        ctaText: "Visit Our Website",
        ctaUrl: "https://example.com",
        redirectUrl: "https://example.com/thank-you",
        redirectDelay: 5,
        showResultsLink: true,
        enableSharing: true
    }}
/>
*/
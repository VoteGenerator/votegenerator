// ============================================================================
// CookieConsent.tsx - GDPR-compliant Cookie Consent Banner
// Location: src/components/CookieConsent.tsx
// 
// GDPR Requirements Implemented:
// - Prior consent required before setting non-essential cookies
// - Granular control over cookie categories
// - Easy to withdraw consent (as easy as giving it)
// - Clear information about each cookie type
// - Must NOT block access if user rejects non-essential cookies
// - Consent records stored for compliance (5 years recommended)
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cookie, Shield, ChevronDown, ChevronUp, 
    Check, X, Settings, ExternalLink
} from 'lucide-react';

// Cookie categories per GDPR/ePrivacy
interface CookiePreferences {
    necessary: boolean;     // Always true - required for site to function
    functional: boolean;    // Remember preferences (language, theme)
    analytics: boolean;     // Google Analytics, performance tracking
    marketing: boolean;     // Advertising, retargeting (if any)
}

interface ConsentRecord {
    timestamp: string;
    preferences: CookiePreferences;
    version: string;        // Policy version for re-consent if policy changes
}

const CONSENT_VERSION = '1.0'; // Increment when policy changes to trigger re-consent
const CONSENT_KEY = 'vg_cookie_consent';

const CookieConsent: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,    // Always required
        functional: true,   // Default on (low privacy impact)
        analytics: false,   // Default off (requires consent)
        marketing: false,   // Default off (requires consent)
    });

    useEffect(() => {
        console.log('[CookieConsent] Component mounted, waiting 1.5s...');
        
        // Small delay to prevent flash on page load
        const timer = setTimeout(() => {
            // Check if consent already given
            const stored = localStorage.getItem(CONSENT_KEY);
            console.log('[CookieConsent] Stored consent:', stored);
            
            if (stored) {
                try {
                    const consent: ConsentRecord = JSON.parse(stored);
                    console.log('[CookieConsent] Parsed consent:', consent);
                    // Check if policy version changed - need re-consent
                    if (consent.version !== CONSENT_VERSION) {
                        console.log('[CookieConsent] Version mismatch, showing banner');
                        setShowBanner(true);
                    } else {
                        console.log('[CookieConsent] Valid consent found, NOT showing banner');
                        // Apply stored preferences
                        setPreferences(consent.preferences);
                        applyPreferences(consent.preferences);
                    }
                } catch (e) {
                    console.log('[CookieConsent] Parse error, showing banner:', e);
                    setShowBanner(true);
                }
            } else {
                console.log('[CookieConsent] No stored consent, showing banner');
                setShowBanner(true);
            }
        }, 1500); // 1.5 second delay

        return () => clearTimeout(timer);
    }, []);

    // Apply cookie preferences (enable/disable tracking scripts)
    const applyPreferences = (prefs: CookiePreferences) => {
        // Analytics (e.g., Google Analytics)
        if (prefs.analytics) {
            // Enable analytics - you'd load GA here
            // window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
            console.log('[Cookies] Analytics enabled');
        } else {
            // Disable analytics
            // window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
            console.log('[Cookies] Analytics disabled');
        }

        // Marketing (if you add advertising later)
        if (prefs.marketing) {
            // window.gtag?.('consent', 'update', { ad_storage: 'granted' });
            console.log('[Cookies] Marketing enabled');
        } else {
            // window.gtag?.('consent', 'update', { ad_storage: 'denied' });
            console.log('[Cookies] Marketing disabled');
        }
    };

    const saveConsent = (prefs: CookiePreferences) => {
        const record: ConsentRecord = {
            timestamp: new Date().toISOString(),
            preferences: prefs,
            version: CONSENT_VERSION,
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
        applyPreferences(prefs);
        setShowBanner(false);
    };

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
        };
        setPreferences(allAccepted);
        saveConsent(allAccepted);
    };

    const acceptSelected = () => {
        saveConsent(preferences);
    };

    const rejectNonEssential = () => {
        const essentialOnly: CookiePreferences = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
        };
        setPreferences(essentialOnly);
        saveConsent(essentialOnly);
    };

    // Cookie category descriptions
    const cookieCategories = [
        {
            id: 'necessary',
            name: 'Strictly Necessary',
            description: 'Essential for the website to function. These cannot be disabled.',
            examples: 'Login sessions, security tokens, poll admin keys',
            required: true,
        },
        {
            id: 'functional',
            name: 'Functional',
            description: 'Remember your preferences and choices to improve your experience.',
            examples: 'Theme preferences, language settings, recently viewed polls',
            required: false,
        },
        {
            id: 'analytics',
            name: 'Analytics',
            description: 'Help us understand how visitors use our website so we can improve it.',
            examples: 'Page views, feature usage, error tracking',
            required: false,
        },
        {
            id: 'marketing',
            name: 'Marketing',
            description: 'Used to deliver relevant advertisements and track ad campaign performance.',
            examples: 'Currently not used',
            required: false,
        },
    ];

    if (!showBanner) return null;

    console.log('[CookieConsent] Rendering banner now!');

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
            >
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Cookie className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Cookie Preferences</h3>
                                <p className="text-white/80 text-sm">We respect your privacy</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-slate-600 mb-4">
                            We use cookies to ensure our website works properly and to improve your experience. 
                            You can choose which cookies to allow. For more information, see our{' '}
                            <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a> and{' '}
                            <a href="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</a>.
                        </p>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-3 mb-4">
                            <button
                                onClick={acceptAll}
                                className="flex-1 min-w-[140px] px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                            >
                                <Check size={18} />
                                Accept All
                            </button>
                            <button
                                onClick={rejectNonEssential}
                                className="flex-1 min-w-[140px] px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2"
                            >
                                <Shield size={18} />
                                Essential Only
                            </button>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="px-4 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 transition flex items-center gap-2"
                            >
                                <Settings size={18} />
                                Customize
                                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {/* Detailed Preferences */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-slate-200 pt-4 mt-2">
                                        <div className="space-y-3">
                                            {cookieCategories.map((category) => (
                                                <div 
                                                    key={category.id}
                                                    className={`p-4 rounded-xl border-2 transition ${
                                                        preferences[category.id as keyof CookiePreferences]
                                                            ? 'border-indigo-200 bg-indigo-50/50'
                                                            : 'border-slate-100 bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold text-slate-800">
                                                                    {category.name}
                                                                </span>
                                                                {category.required && (
                                                                    <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                                                                        Required
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-slate-600 mb-1">
                                                                {category.description}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                Examples: {category.examples}
                                                            </p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences[category.id as keyof CookiePreferences]}
                                                                onChange={(e) => {
                                                                    if (!category.required) {
                                                                        setPreferences({
                                                                            ...preferences,
                                                                            [category.id]: e.target.checked,
                                                                        });
                                                                    }
                                                                }}
                                                                disabled={category.required}
                                                                className="sr-only peer"
                                                            />
                                                            <div className={`w-11 h-6 rounded-full peer 
                                                                ${category.required 
                                                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                                                    : 'bg-slate-200 peer-checked:bg-indigo-600'
                                                                }
                                                                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100
                                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                                                                peer-checked:after:translate-x-5`}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={acceptSelected}
                                            className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// ============================================================================
// Cookie Settings Button - For footer/settings to re-open preferences
// ============================================================================
export const CookieSettingsButton: React.FC = () => {
    const openSettings = () => {
        // Remove consent to re-show banner
        localStorage.removeItem(CONSENT_KEY);
        window.location.reload();
    };

    return (
        <button
            onClick={openSettings}
            className="text-slate-500 hover:text-indigo-600 transition text-sm flex items-center gap-1"
        >
            <Cookie size={14} />
            Cookie Settings
        </button>
    );
};

export default CookieConsent;
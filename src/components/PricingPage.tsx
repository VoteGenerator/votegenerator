// ============================================================================
// PricingPage - Comprehensive Feature Comparison
// Organized by category with tooltips, visual hierarchy, and clear CTAs
// Updated: Pro $19/mo ($190/yr), Business $49/mo ($490/yr)
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, X, Zap, Crown, Users, BarChart3, Clock, ArrowRight, Star, 
    ChevronDown, Sparkles, Shield, BadgeCheck, Lock, Download, HelpCircle,
    Palette, Code, Globe, QrCode, Mail, Eye, FileText, Image, Bell,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal,
    CheckCircle2, MousePointer, Key, AlertTriangle, Smartphone, Share2,
    Timer, TrendingUp, Layers, Building2, Headphones, MessageCircle
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// =============================================================================
// PRICING CONFIGURATION - Limited Time USD Pricing
// =============================================================================
const PRICING = {
    pro: {
        monthly: 19,
        annual: 190,
    },
    business: {
        monthly: 49,
        annual: 490,
    }
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface Feature {
    name: string;
    tooltip: string;
    icon?: React.ComponentType<any>;
    free: boolean | string;
    pro: boolean | string;
    business: boolean | string;
    highlight?: 'free' | 'pro' | 'business';
}

interface FeatureSection {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
    description?: string;
    features: Feature[];
}

// =============================================================================
// COMPREHENSIVE FEATURE LIST WITH TOOLTIPS
// =============================================================================
const FEATURE_SECTIONS: FeatureSection[] = [
    {
        id: 'polls-responses',
        name: 'Polls & Responses',
        icon: BarChart3,
        color: 'indigo',
        features: [
            { 
                name: 'Active polls', 
                tooltip: 'Number of polls that can accept votes at the same time',
                free: '3', 
                pro: 'Unlimited', 
                business: 'Unlimited' 
            },
            { 
                name: 'Responses per month', 
                tooltip: 'Total votes across all your polls each month. Resets on the 1st.',
                free: '100', 
                pro: '10,000', 
                business: '100,000',
                highlight: 'pro'
            },
            { 
                name: 'Poll duration', 
                tooltip: 'How long polls stay active before auto-closing',
                free: '30 days', 
                pro: '1 year', 
                business: 'Unlimited' 
            },
            { 
                name: 'Response history', 
                tooltip: 'How long we store your poll data',
                free: '90 days', 
                pro: '2 years', 
                business: 'Forever' 
            },
            { 
                name: 'Survey questions', 
                tooltip: 'Maximum questions per multi-question survey',
                free: '10', 
                pro: '25', 
                business: 'Unlimited',
                highlight: 'business'
            },
        ]
    },
    {
        id: 'poll-types',
        name: 'Poll Types',
        icon: Layers,
        color: 'purple',
        description: 'All 8 poll types included on every plan',
        features: [
            { 
                name: 'Multiple Choice', 
                tooltip: 'Pick one or more options from a list',
                icon: CheckSquare,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Ranked Choice (IRV)', 
                tooltip: 'Drag to rank options. Uses Instant Runoff Voting algorithm.',
                icon: ListOrdered,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Meeting Poll', 
                tooltip: 'Like Doodle. Find when everyone is available.',
                icon: Calendar,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'This or That', 
                tooltip: 'A vs B comparisons. Great for quick decisions.',
                icon: ArrowLeftRight,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Rating Scale', 
                tooltip: 'Rate each option 1-5 stars. See average ratings.',
                icon: SlidersHorizontal,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'RSVP', 
                tooltip: 'Simple Yes / No / Maybe for events',
                icon: Users,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Visual Poll', 
                tooltip: 'Upload images as options. Great for design feedback.',
                icon: Image,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Dot Voting', 
                tooltip: 'Distribute points across options. Also called multi-voting.',
                icon: CheckCircle2,
                free: true, 
                pro: true, 
                business: true 
            },
        ]
    },
    {
        id: 'customization',
        name: 'Customization & Branding',
        icon: Palette,
        color: 'pink',
        features: [
            { 
                name: 'Basic themes', 
                tooltip: 'Pre-built color schemes for your polls',
                free: '3 themes', 
                pro: 'All 12+ themes', 
                business: 'All 12+ themes' 
            },
            { 
                name: 'Remove VoteGenerator badge', 
                tooltip: 'Hide the "Powered by VoteGenerator" branding',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Custom colors', 
                tooltip: 'Set your own brand colors for polls',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Upload custom logo', 
                tooltip: 'Add your company logo to polls',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Custom thank-you message', 
                tooltip: 'Show a personalized message after voting',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Custom short links', 
                tooltip: 'Create memorable URLs like votegenerator.com/p/your-poll',
                free: false, 
                pro: false, 
                business: true 
            },
        ]
    },
    {
        id: 'sharing',
        name: 'Sharing & Distribution',
        icon: Share2,
        color: 'blue',
        features: [
            { 
                name: 'Shareable link', 
                tooltip: 'Simple URL anyone can click to vote',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'QR code', 
                tooltip: 'Scannable code for in-person events',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Embed on website', 
                tooltip: 'Add polls to any website with an iframe',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Social sharing', 
                tooltip: 'One-click share to WhatsApp, Twitter, etc.',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Email admin link', 
                tooltip: 'Send yourself the poll management link',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Embed domain restriction', 
                tooltip: 'Only allow embedding on specific domains',
                free: false, 
                pro: true, 
                business: true 
            },
        ]
    },
    {
        id: 'security',
        name: 'Security & Anti-Fraud',
        icon: Shield,
        color: 'emerald',
        features: [
            { 
                name: 'Browser fingerprinting', 
                tooltip: 'Detect duplicate votes from the same browser',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'IP duplicate prevention', 
                tooltip: 'Block multiple votes from the same IP address',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Honeypot spam protection', 
                tooltip: 'Invisible fields that catch bot submissions',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Minimum vote time check', 
                tooltip: 'Reject suspiciously fast votes (likely bots)',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'PIN code access', 
                tooltip: 'Require a PIN to view or vote on polls',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'One-time vote codes', 
                tooltip: 'Generate unique codes for controlled voting',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'IP allowlist/blocklist', 
                tooltip: 'Only allow votes from specific IP ranges',
                free: false, 
                pro: false, 
                business: true 
            },
            { 
                name: 'Suspicious activity alerts', 
                tooltip: 'Get notified of potential vote manipulation',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
        ]
    },
    {
        id: 'results',
        name: 'Results & Analytics',
        icon: TrendingUp,
        color: 'amber',
        features: [
            { 
                name: 'Real-time results', 
                tooltip: 'Watch votes appear instantly as they come in',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Visual charts', 
                tooltip: 'Bar charts, pie charts, and result visualizations',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Hide results until closed', 
                tooltip: 'Keep results private until voting ends',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Response timeline', 
                tooltip: 'See when votes came in over time',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Device breakdown', 
                tooltip: 'See what devices voters used (mobile/desktop)',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Geographic distribution', 
                tooltip: 'See where voters are located by country',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Hourly heatmap', 
                tooltip: 'See what times of day get the most votes',
                free: false, 
                pro: false, 
                business: true 
            },
            { 
                name: 'Cross-tabulation filters', 
                tooltip: 'Filter results by device, location, etc.',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Comment word cloud', 
                tooltip: 'Visualize common themes in text responses',
                free: false, 
                pro: false, 
                business: true 
            },
        ]
    },
    {
        id: 'export',
        name: 'Export & Reports',
        icon: Download,
        color: 'violet',
        features: [
            { 
                name: 'View results online', 
                tooltip: 'See results in your browser anytime',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Print / Save as PDF', 
                tooltip: 'Print-friendly view - use browser\'s "Save as PDF" option',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Export CSV', 
                tooltip: 'Download raw data as comma-separated values',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Export Excel', 
                tooltip: 'Download as .xlsx with formatting',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Shareable results link', 
                tooltip: 'Public link to view results (even without admin access)',
                free: true, 
                pro: true, 
                business: true 
            },
        ]
    },
    {
        id: 'management',
        name: 'Poll Management',
        icon: MousePointer,
        color: 'sky',
        features: [
            { 
                name: 'Admin dashboard', 
                tooltip: 'Central place to manage all your polls',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Edit polls after creation', 
                tooltip: 'Change questions, options, and settings',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Pause/Resume voting', 
                tooltip: 'Temporarily stop accepting votes',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Close polls manually', 
                tooltip: 'End voting and lock in final results',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Undo close (5 min)', 
                tooltip: 'Accidentally closed? Reopen within 5 minutes',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Email notifications', 
                tooltip: 'Get notified when votes come in',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Scheduled close', 
                tooltip: 'Auto-close polls at a specific date/time',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Duplicate polls', 
                tooltip: 'Clone a poll as a starting point',
                free: true, 
                pro: true, 
                business: true 
            },
        ]
    },
    {
        id: 'support',
        name: 'Support',
        icon: Headphones,
        color: 'rose',
        features: [
            { 
                name: 'Help documentation', 
                tooltip: 'Guides and tutorials in our help center',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Community support', 
                tooltip: 'Get help from the VoteGenerator community',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Email support', 
                tooltip: 'Get help from our team via email',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Priority support', 
                tooltip: 'Faster response times from our team',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Response time SLA', 
                tooltip: 'Guaranteed response within 24 hours',
                free: '-', 
                pro: '48 hours', 
                business: '24 hours' 
            },
        ]
    },
    {
        id: 'advanced',
        name: 'Advanced Features',
        icon: Building2,
        color: 'slate',
        features: [
            { 
                name: 'Templates library', 
                tooltip: 'Access ready-to-use poll and survey templates',
                free: '10 templates', 
                pro: 'All 40+', 
                business: 'All 40+' 
            },
            { 
                name: 'Custom short links', 
                tooltip: 'Create memorable URLs like votegenerator.com/p/your-poll',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Embed domain restriction', 
                tooltip: 'Only allow your poll to be embedded on specific websites',
                free: false, 
                pro: true, 
                business: true
            },
            { 
                name: 'Post-vote redirect', 
                tooltip: 'Send voters to a custom URL after they submit',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
        ]
    },
];

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
    const [show, setShow] = useState(false);
    
    return (
        <span className="relative inline-flex items-center">
            <span 
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                className="cursor-help"
            >
                {children}
            </span>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50"
                    >
                        {text}
                        <div className="absolute left-4 top-full border-4 border-transparent border-t-slate-900" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

// =============================================================================
// FEATURE CELL COMPONENT
// =============================================================================
const FeatureCell: React.FC<{ value: boolean | string; highlight?: string; tier: string }> = ({ value, highlight, tier }) => {
    const isHighlighted = highlight === tier;
    
    if (typeof value === 'boolean') {
        return value ? (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto ${
                isHighlighted ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-emerald-100'
            }`}>
                <Check className={isHighlighted ? 'text-white' : 'text-emerald-600'} size={16} />
            </div>
        ) : (
            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <X className="text-slate-300" size={16} />
            </div>
        );
    }
    
    if (value === '-') {
        return <span className="text-slate-300">—</span>;
    }
    
    return (
        <span className={`text-sm font-semibold ${
            isHighlighted ? 'text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full' : 'text-slate-700'
        }`}>
            {value}
        </span>
    );
};

// =============================================================================
// MAIN PRICING PAGE
// =============================================================================
function PricingPage(): React.ReactElement {
    const [isAnnual, setIsAnnual] = useState(true);
    const [expandedSections, setExpandedSections] = useState<string[]>(['polls-responses', 'poll-types']);

    const toggleSection = (id: string) => {
        setExpandedSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const expandAll = () => setExpandedSections(FEATURE_SECTIONS.map(s => s.id));
    const collapseAll = () => setExpandedSections([]);

    const getPrice = (tier: 'pro' | 'business') => {
        return isAnnual ? PRICING[tier].annual : PRICING[tier].monthly;
    };

    const getMonthlyEquivalent = (tier: 'pro' | 'business') => {
        if (isAnnual) {
            return Math.round(PRICING[tier].annual / 12 * 100) / 100;
        }
        return PRICING[tier].monthly;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <NavHeader />
            
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 pt-16 pb-32">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8">
                        Start free. Upgrade when you need more.
                    </p>
                    
                    {/* Billing toggle */}
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                                !isAnnual
                                    ? 'bg-white text-indigo-700 shadow'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                                isAnnual
                                    ? 'bg-white text-indigo-700 shadow'
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            Annual
                            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                                2 MONTHS FREE
                            </span>
                        </button>
                    </div>
                    <p className="text-indigo-200 text-sm mt-4">
                        💰 Limited time USD pricing • Lock in these rates today
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-5xl mx-auto px-4 -mt-20">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Free */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Users className="text-slate-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Free</h3>
                                <p className="text-xs text-slate-500">For trying out</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <span className="text-4xl font-black text-slate-900">$0</span>
                            <span className="text-slate-500 ml-1">USD</span>
                            <span className="text-slate-400 text-sm ml-1">forever</span>
                        </div>
                        
                        <ul className="space-y-3 mb-8">
                            {[
                                '3 active polls',
                                '100 responses/month',
                                'All 8 poll types',
                                'Real-time results',
                                'QR codes & embedding',
                                '3 basic themes',
                            ].map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a 
                            href="/create" 
                            className="block w-full py-3.5 text-center bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                        >
                            Start Free
                        </a>
                    </motion.div>

                    {/* Pro */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden md:scale-105 md:-my-4"
                    >
                        <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            MOST POPULAR
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Zap className="text-amber-300" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Pro</h3>
                                <p className="text-xs text-indigo-200">For growing teams</p>
                            </div>
                        </div>
                        
                        <div className="mb-1">
                            <span className="text-4xl font-black">${isAnnual ? Math.round(getMonthlyEquivalent('pro')) : getPrice('pro')}</span>
                            <span className="text-indigo-200 ml-1">USD</span>
                            <span className="text-indigo-300 text-sm ml-1">/month</span>
                        </div>
                        {isAnnual ? (
                            <p className="text-sm text-indigo-200 mb-6">
                                ${getPrice('pro')} USD billed annually
                            </p>
                        ) : (
                            <p className="text-sm text-indigo-200 mb-6">
                                Limited time pricing
                            </p>
                        )}
                        
                        <ul className="space-y-3 mb-8">
                            {[
                                'Unlimited active polls',
                                '10,000 responses/month',
                                'Remove VoteGenerator badge',
                                'All 15 premium themes',
                                'CSV & Excel export',
                                'Email notifications',
                                'PIN-protected access',
                                'Priority email support',
                            ].map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-indigo-100">
                                    <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" /> {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a 
                            href={`/.netlify/functions/vg-checkout?tier=pro&billing=${isAnnual ? 'annual' : 'monthly'}`}
                            className="block w-full py-3.5 text-center bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition"
                        >
                            Get Pro
                        </a>
                    </motion.div>

                    {/* Business */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <Crown className="text-amber-400" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Business</h3>
                                <p className="text-xs text-slate-400">For organizations</p>
                            </div>
                        </div>
                        
                        <div className="mb-1">
                            <span className="text-4xl font-black">${isAnnual ? Math.round(getMonthlyEquivalent('business')) : getPrice('business')}</span>
                            <span className="text-slate-400 ml-1">USD</span>
                            <span className="text-slate-500 text-sm ml-1">/month</span>
                        </div>
                        {isAnnual ? (
                            <p className="text-sm text-slate-400 mb-6">
                                ${getPrice('business')} USD billed annually
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 mb-6">
                                Limited time pricing
                            </p>
                        )}
                        
                        <ul className="space-y-3 mb-8">
                            {[
                                'Everything in Pro, plus:',
                                '100,000 responses/month',
                                'Upload your company logo',
                                'Custom branded short links',
                                'Advanced analytics dashboard',
                                'Cross-tabulation filters',
                                'Post-vote redirect URL',
                                'Priority support (24h)',
                            ].map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <Check size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" /> {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a 
                            href={`/.netlify/functions/vg-checkout?tier=business&billing=${isAnnual ? 'annual' : 'monthly'}`}
                            className="block w-full py-3.5 text-center bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition"
                        >
                            Get Business
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Trust badges */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-slate-400" />
                        <span>No credit card for free</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeCheck size={18} className="text-slate-400" />
                        <span>Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock size={18} className="text-slate-400" />
                        <span>Secure checkout via Stripe</span>
                    </div>
                </div>
            </div>

            {/* Full Feature Comparison */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Full Feature Comparison</h2>
                    <p className="text-slate-500">Everything included in each plan, explained.</p>
                </div>

                {/* Expand/Collapse controls */}
                <div className="flex justify-end gap-3 mb-4">
                    <button 
                        onClick={expandAll}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Expand all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button 
                        onClick={collapseAll}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Collapse all
                    </button>
                </div>

                {/* Feature sections */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
                    {/* Header row - sticky */}
                    <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                        <div className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                            Feature
                        </div>
                        <div className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-slate-600">Free</span>
                            <div className="text-xs text-slate-400">$0</div>
                        </div>
                        <div className="py-4 px-4 text-center bg-indigo-50">
                            <span className="text-sm font-bold text-indigo-700">Pro</span>
                            <div className="text-xs text-indigo-500">${isAnnual ? Math.round(getMonthlyEquivalent('pro')) : getPrice('pro')}/mo</div>
                        </div>
                        <div className="py-4 px-4 text-center bg-slate-100">
                            <span className="text-sm font-bold text-slate-700">Business</span>
                            <div className="text-xs text-slate-500">${isAnnual ? Math.round(getMonthlyEquivalent('business')) : getPrice('business')}/mo</div>
                        </div>
                    </div>

                    {/* Sections */}
                    {FEATURE_SECTIONS.map((section) => {
                        const isExpanded = expandedSections.includes(section.id);
                        const IconComponent = section.icon;
                        
                        return (
                            <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                                {/* Section header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full grid grid-cols-4 items-center bg-slate-50/50 hover:bg-slate-50 transition"
                                >
                                    <div className="py-4 px-6 text-left flex items-center gap-3">
                                        <div className={`w-8 h-8 bg-${section.color}-100 rounded-lg flex items-center justify-center`}>
                                            <IconComponent className={`text-${section.color}-600`} size={16} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-900">{section.name}</span>
                                            {section.description && (
                                                <p className="text-xs text-slate-500">{section.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-2" />
                                    <div className="py-4 px-6 text-right">
                                        <ChevronDown 
                                            className={`inline text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                            size={20} 
                                        />
                                    </div>
                                </button>

                                {/* Features */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            {section.features.map((feature, fi) => (
                                                <div 
                                                    key={fi} 
                                                    className="grid grid-cols-4 items-center border-t border-slate-100 hover:bg-slate-50/30"
                                                >
                                                    <div className="py-3 px-6 pl-16 text-left">
                                                        <Tooltip text={feature.tooltip}>
                                                            <span className="text-sm text-slate-700 inline-flex items-center gap-1.5">
                                                                {'icon' in feature && feature.icon && (
                                                                    <feature.icon size={14} className="text-slate-400" />
                                                                )}
                                                                {feature.name}
                                                                <HelpCircle size={12} className="text-slate-300" />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                    <div className="py-3 px-4 text-center">
                                                        <FeatureCell value={feature.free} highlight={feature.highlight} tier="free" />
                                                    </div>
                                                    <div className="py-3 px-4 text-center bg-indigo-50/30">
                                                        <FeatureCell value={feature.pro} highlight={feature.highlight} tier="pro" />
                                                    </div>
                                                    <div className="py-3 px-4 text-center bg-slate-50/50">
                                                        <FeatureCell value={feature.business} highlight={feature.highlight} tier="business" />
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {[
                        { 
                            q: 'Can I cancel anytime?', 
                            a: 'Yes! You can cancel your subscription anytime from your dashboard. You\'ll keep access until the end of your billing period.' 
                        },
                        { 
                            q: 'What happens if I hit my response limit?', 
                            a: 'Your polls will stop accepting new responses until the next billing cycle. You can upgrade anytime to get more responses immediately. Existing responses are never deleted.' 
                        },
                        { 
                            q: 'Do I need to create an account?', 
                            a: 'Nope! VoteGenerator is privacy-first. No signup required for any plan. We\'ll email you a secure link to manage your polls and subscription.' 
                        },
                        { 
                            q: 'How does "2 months free" work?', 
                            a: 'Annual plans save you 2 months! Pro is $190 USD/year (instead of $228 if paid monthly) and Business is $490 USD/year (instead of $588 if paid monthly). These are limited-time USD rates locked in for as long as you stay subscribed.' 
                        },
                        { 
                            q: 'Can I switch plans later?', 
                            a: 'Absolutely! You can upgrade or downgrade at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, credit is applied to future billing.' 
                        },
                        { 
                            q: 'Do you offer refunds?', 
                            a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund.' 
                        },
                        { 
                            q: 'What payment methods do you accept?', 
                            a: 'We accept all major credit cards (Visa, Mastercard, American Express) and some debit cards. Payments are securely processed by Stripe.' 
                        },
                        { 
                            q: 'Is there a discount for nonprofits or education?', 
                            a: 'Yes! We offer 50% off for verified nonprofits and educational institutions. Contact support@votegenerator.com with your organization details.' 
                        },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50 list-none">
                                {faq.q}
                                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to create your first poll?</h2>
                    <p className="text-indigo-100 mb-8">Start free. No credit card required.</p>
                    <a 
                        href="/create" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                    >
                        <Sparkles size={20} /> 
                        Create Free Poll 
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PricingPage;
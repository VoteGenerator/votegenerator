// ============================================================================
// PricingPage - Comprehensive Feature Comparison
// UPDATED: Accurate features based on actual codebase audit
// Pricing: Pro $16/mo ($190/yr), Business $41/mo ($490/yr)
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, X, Zap, Crown, Users, BarChart3, Clock, ArrowRight, Star, 
    ChevronDown, Sparkles, Shield, BadgeCheck, Lock, Download, HelpCircle,
    Palette, Code, Globe, QrCode, Mail, Eye, FileText, Image, Bell,
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, SlidersHorizontal,
    CheckCircle2, MousePointer, Key, AlertTriangle, Smartphone, Share2,
    Timer, TrendingUp, Layers, Building2, Headphones, MessageCircle,
    ClipboardList, Link2, Upload, LayoutTemplate, EyeOff
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// =============================================================================
// PRICING CONFIGURATION
// =============================================================================
const PRICING = {
    pro: {
        monthly: 16,
        annual: 190,
    },
    business: {
        monthly: 41,
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
// COMPREHENSIVE FEATURE LIST - VERIFIED FROM CODEBASE
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
                pro: '5,000', 
                business: '50,000' 
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
        ]
    },
    {
        id: 'poll-types',
        name: 'Poll Types',
        icon: Layers,
        color: 'purple',
        description: 'All 8 poll types included free',
        features: [
            { 
                name: 'Multiple Choice', 
                tooltip: 'Classic poll - pick one or more options from a list',
                icon: CheckSquare,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Ranked Choice', 
                tooltip: 'Drag to rank options in order. Uses Instant Runoff Voting for fair results.',
                icon: ListOrdered,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Multi-Question Survey', 
                tooltip: 'Create forms with multiple questions, sections, and question types',
                icon: ClipboardList,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Meeting Poll', 
                tooltip: 'Find when everyone is available - like Doodle but simpler',
                icon: Calendar,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'This or That', 
                tooltip: 'A vs B comparisons - great for quick decisions between two options',
                icon: ArrowLeftRight,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Rating Scale', 
                tooltip: 'Rate items 1-5 stars. See average ratings and distribution.',
                icon: SlidersHorizontal,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'RSVP', 
                tooltip: 'Simple Yes / No / Maybe responses for events',
                icon: Users,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Visual Poll', 
                tooltip: 'Upload images as voting options - perfect for design feedback',
                icon: Image,
                free: true, 
                pro: true, 
                business: true 
            },
        ]
    },
    {
        id: 'survey-features',
        name: 'Survey Features',
        icon: ClipboardList,
        color: 'teal',
        description: 'Professional survey tools',
        features: [
            { 
                name: 'Multi-question surveys', 
                tooltip: 'Create surveys with unlimited questions organized in sections',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Question types', 
                tooltip: 'Text, rating, scale, dropdown, yes/no, ranking, and more',
                free: 'All types', 
                pro: 'All types', 
                business: 'All types' 
            },
            { 
                name: 'NPS Score calculation', 
                tooltip: 'Automatic Net Promoter Score calculation from 0-10 scale questions',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Anonymous Mode', 
                tooltip: 'Hide individual responses - only show aggregate data. Perfect for honest feedback.',
                icon: EyeOff,
                free: true, 
                pro: true, 
                business: true,
                highlight: 'free'
            },
            { 
                name: 'Survey templates', 
                tooltip: 'Pre-built surveys for Employee Engagement, CSAT, NPS, and more',
                free: '6 templates', 
                pro: 'All 57', 
                business: 'All 57' 
            },
        ]
    },
    {
        id: 'templates',
        name: 'Templates',
        icon: LayoutTemplate,
        color: 'amber',
        features: [
            { 
                name: 'Poll templates', 
                tooltip: 'Ready-to-use templates for common use cases',
                free: '10', 
                pro: 'All 57', 
                business: 'All 57',
                highlight: 'pro'
            },
            { 
                name: 'Template categories', 
                tooltip: 'Team, Events, Feedback, HR, Education, Fun, and Surveys',
                free: 'All 7', 
                pro: 'All 7', 
                business: 'All 7' 
            },
            { 
                name: 'Custom templates', 
                tooltip: 'Save your own polls as reusable templates',
                free: false, 
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
                name: 'Themes', 
                tooltip: 'Pre-built color schemes for your polls',
                free: '3 themes', 
                pro: 'All 12+', 
                business: 'All 12+' 
            },
            { 
                name: 'Remove VoteGenerator badge', 
                tooltip: 'Hide the "Powered by VoteGenerator" branding on your polls',
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
                icon: Upload,
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Custom thank-you message', 
                tooltip: 'Show a personalized message after someone votes',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Custom button text', 
                tooltip: 'Change "Submit Vote" to anything you want',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Custom short links', 
                tooltip: 'Create memorable URLs like votegenerator.com/p/your-poll',
                icon: Link2,
                free: false, 
                pro: true, 
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
                tooltip: 'Scannable code for in-person events - download as image',
                icon: QrCode,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Embed on website', 
                tooltip: 'Add polls to any website with a simple code snippet',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Social sharing', 
                tooltip: 'One-click share to WhatsApp, Twitter, Facebook, LinkedIn',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Email admin link', 
                tooltip: 'Send yourself the poll management link for safekeeping',
                icon: Mail,
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Share cards', 
                tooltip: 'Beautiful shareable images with poll link and QR code',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Embed domain restriction', 
                tooltip: 'Only allow your poll to be embedded on specific domains',
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
                tooltip: 'Detect and prevent duplicate votes from the same browser',
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
                tooltip: 'Invisible fields that automatically catch bot submissions',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Minimum vote time', 
                tooltip: 'Reject suspiciously fast votes that are likely bots',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Rate limiting', 
                tooltip: 'Prevent vote flooding (max 5 votes per minute per IP)',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'PIN code access', 
                tooltip: 'Require a 6-digit PIN to view or vote on your poll',
                icon: Lock,
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'One-time vote codes', 
                tooltip: 'Generate unique codes - each can only be used once',
                icon: Key,
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Suspicious activity alerts', 
                tooltip: 'Get notified when unusual voting patterns are detected',
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
                tooltip: 'Bar charts, pie charts, and beautiful result visualizations',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Hide results until closed', 
                tooltip: 'Keep results private until voting ends to prevent bias',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Response timeline', 
                tooltip: 'See when votes came in over time with trend indicators',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Velocity trend', 
                tooltip: 'See if voting is speeding up, slowing down, or stable',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Device breakdown', 
                tooltip: 'See what devices voters used (mobile, desktop, tablet)',
                icon: Smartphone,
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Geographic distribution', 
                tooltip: 'See where voters are located by country with flags',
                icon: Globe,
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Traffic sources', 
                tooltip: 'See where your voters came from (UTM tracking)',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Hourly heatmap', 
                tooltip: 'Visualize what times of day get the most votes',
                free: false, 
                pro: false, 
                business: true 
            },
            { 
                name: 'Date range filters', 
                tooltip: 'Filter analytics by custom date ranges',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Cross-tabulation', 
                tooltip: 'Filter results by device, location, and time',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Comment word cloud', 
                tooltip: 'Visualize common themes from text responses',
                icon: MessageCircle,
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
                name: 'Print results', 
                tooltip: 'Print-friendly view for physical copies',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Shareable results link', 
                tooltip: 'Public link to view results without admin access',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Export CSV', 
                tooltip: 'Download raw data as spreadsheet-compatible format',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Export PNG', 
                tooltip: 'Download result charts as images',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'PDF reports', 
                tooltip: 'Generate professional PDF summaries',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
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
                tooltip: 'Central place to manage all your polls with search and pagination',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Edit polls after creation', 
                tooltip: 'Change questions, options, and settings anytime',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Pause/Resume voting', 
                tooltip: 'Temporarily stop accepting votes without closing',
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
                tooltip: 'Changed your mind? Reopen within 5 minutes',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Email notifications', 
                tooltip: 'Get notified when new votes come in',
                icon: Bell,
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Scheduled close', 
                tooltip: 'Auto-close polls at a specific date and time',
                icon: Timer,
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Draft mode', 
                tooltip: 'Test your poll before going live',
                free: false, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Duplicate polls', 
                tooltip: 'Clone any poll as a starting point for a new one',
                free: false, 
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
                name: 'Email support', 
                tooltip: 'Get help from our team via email',
                free: false, 
                pro: true, 
                business: true,
                highlight: 'pro'
            },
            { 
                name: 'Priority support', 
                tooltip: 'Jump to the front of the support queue',
                free: false, 
                pro: false, 
                business: true,
                highlight: 'business'
            },
            { 
                name: 'Response time', 
                tooltip: 'How quickly we respond to support requests',
                free: '-', 
                pro: '48 hours', 
                business: '24 hours' 
            },
        ]
    },
    {
        id: 'privacy',
        name: 'Privacy & Trust',
        icon: EyeOff,
        color: 'slate',
        description: 'Privacy-first by design',
        features: [
            { 
                name: 'No signup required', 
                tooltip: 'Create polls instantly without creating an account',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'No email required to vote', 
                tooltip: 'Voters don\'t need to provide their email',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Anonymous voting', 
                tooltip: 'Voters can participate without identifying themselves',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Anonymous Mode (surveys)', 
                tooltip: 'Completely hide individual responses - only show aggregate data',
                free: true, 
                pro: true, 
                business: true 
            },
            { 
                name: 'Data stored in links', 
                tooltip: 'Poll admin access is in the URL - no server-side accounts',
                free: true, 
                pro: true, 
                business: true 
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
// MAIN COMPONENT
// =============================================================================
const PricingPage: React.FC = () => {
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
        return isAnnual ? PRICING[tier].annual / 12 : PRICING[tier].monthly;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
            <NavHeader />
            
            {/* Hero */}
            <div className="pt-16 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-6">
                            <BadgeCheck size={16} />
                            All 8 poll types free forever
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">
                            Start free. Upgrade when you need more responses or features.
                        </p>
                        
                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-3 bg-white rounded-full p-1.5 shadow-lg border border-slate-200">
                            <button 
                                onClick={() => setIsAnnual(false)}
                                className={`px-5 py-2.5 rounded-full font-semibold transition ${!isAnnual ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setIsAnnual(true)}
                                className={`px-5 py-2.5 rounded-full font-semibold transition flex items-center gap-2 ${isAnnual ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                Annual
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isAnnual ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}`}>
                                    2 months free
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Free */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="text-slate-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Free</h3>
                            </div>
                            <p className="text-slate-500 text-sm">Perfect for trying things out</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">$0</span>
                                <span className="text-slate-500">/forever</span>
                            </div>
                        </div>
                        
                        <ul className="space-y-3 mb-8 flex-grow">
                            {['All 8 poll types', '100 responses/month', '3 active polls', '57 templates (10 free)', 'QR codes & embed'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                    <Check size={16} className="text-emerald-500 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a href="/#create" className="block w-full py-3 text-center border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                            Get Started Free
                        </a>
                    </motion.div>

                    {/* Pro - Most Popular */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-b from-indigo-600 to-purple-700 rounded-2xl p-6 flex flex-col relative shadow-xl"
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                            MOST POPULAR
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Zap className="text-white" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Pro</h3>
                            </div>
                            <p className="text-indigo-200 text-sm">For creators who need more</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">${isAnnual ? Math.round(getMonthlyEquivalent('pro')) : getPrice('pro')}</span>
                                <span className="text-indigo-200">/month</span>
                            </div>
                            {isAnnual && (
                                <p className="text-indigo-200 text-sm mt-1">
                                    ${getPrice('pro')}/year (save ${PRICING.pro.monthly * 12 - PRICING.pro.annual})
                                </p>
                            )}
                        </div>
                        
                        <ul className="space-y-3 mb-8 flex-grow">
                            {['5,000 responses/month', 'Unlimited polls', 'Remove branding', 'Custom short links', 'PIN protection', 'Email notifications', 'CSV export', 'All 57 templates'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-white">
                                    <Check size={16} className="text-emerald-300 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a href="/pricing#checkout-pro" className="block w-full py-3 text-center bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition">
                            Upgrade to Pro
                        </a>
                    </motion.div>

                    {/* Business */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border-2 border-amber-200 p-6 flex flex-col"
                    >
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <Crown className="text-amber-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Business</h3>
                            </div>
                            <p className="text-slate-500 text-sm">For teams and organizations</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900">${isAnnual ? Math.round(getMonthlyEquivalent('business')) : getPrice('business')}</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            {isAnnual && (
                                <p className="text-slate-500 text-sm mt-1">
                                    ${getPrice('business')}/year (save ${PRICING.business.monthly * 12 - PRICING.business.annual})
                                </p>
                            )}
                        </div>
                        
                        <ul className="space-y-3 mb-8 flex-grow">
                            {['50,000 responses/month', 'Everything in Pro', 'Upload your logo', 'PDF reports', 'Advanced analytics', 'Hourly heatmap', 'Priority support (24h)'].map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                    <Check size={16} className="text-amber-500 flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        
                        <a href="/pricing#checkout-business" className="block w-full py-3 text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition">
                            Upgrade to Business
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Full Feature Comparison */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Full Feature Comparison</h2>
                    <div className="flex gap-2">
                        <button onClick={expandAll} className="text-sm text-indigo-600 hover:underline">Expand all</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={collapseAll} className="text-sm text-indigo-600 hover:underline">Collapse all</button>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                        <div className="py-4 px-6">
                            <span className="font-bold text-slate-700">Features</span>
                        </div>
                        <div className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-slate-700">Free</span>
                            <div className="text-xs text-slate-500">$0</div>
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
                            a: 'Annual plans are priced at 10 months instead of 12. Pro is $190/year (instead of $192 monthly) and Business is $490/year (instead of $492 monthly).' 
                        },
                        { 
                            q: 'Can I switch plans later?', 
                            a: 'Absolutely! You can upgrade or downgrade at any time. When upgrading, you\'ll be charged the prorated difference.' 
                        },
                        { 
                            q: 'Do you offer refunds?', 
                            a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund.' 
                        },
                        { 
                            q: 'What payment methods do you accept?', 
                            a: 'We accept all major credit cards (Visa, Mastercard, American Express). Payments are securely processed by Stripe.' 
                        },
                        { 
                            q: 'Is there a discount for nonprofits or education?', 
                            a: 'Yes! We offer 50% off for verified nonprofits and educational institutions. Contact hello@votegenerator.com with your organization details.' 
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
                        href="/#create" 
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
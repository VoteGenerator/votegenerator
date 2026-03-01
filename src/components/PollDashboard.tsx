// ============================================================================
// PollDashboard.tsx - Poll Dashboard with Proper Feature Gating
// Conversion-optimized layout showing free users what they're missing
// Location: src/components/PollDashboard.tsx
// ============================================================================
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Share2, Settings, Lock, ChevronDown, ChevronRight,
    Copy, Check, Globe, MessageCircle, Smartphone, Mail, QrCode, Palette,
    Code, Image as ImageIcon, Link2, Bell, FileSpreadsheet, Download,
    Clock, TrendingUp, LayoutDashboard, Key, Users, Zap,
    RefreshCw, Loader2, Eye, EyeOff, ArrowRight, Activity,
    ShieldAlert, X, Sparkles, AlertTriangle, FileDown, MapPin,
    PieChart, Calendar, Filter, MessageSquare, Crown, Star,
    MoreHorizontal, ExternalLink, Trash2, Play, Pause, Radio, XCircle, CopyPlus,
    HelpCircle, Info, PlusCircle, Menu
} from 'lucide-react';
import VoteGeneratorResults from './VoteGeneratorResults';
import SurveyResults from './SurveyResults';
import ShareCards from './ShareCards';
import NotificationSettings from './NotificationSettings';
import CustomSlugInput from './CustomSlugInput';
import LogoUpload from './LogoUpload';
import ResponseTimelineChart from './ResponseTimelineChart';
import HourlyHeatmap from './HourlyHeatmap';
import GeoChart from './GeoChart';
import CommentWordCloud from './CommentWordCloud';
import DateRangeFilter from './DateRangeFilter';
import CrossTabFilter from './CrossTabFilter';
import EmbedModal from './EmbedPoll';
import UpgradeModal from './UpgradeModal';
import EmailAdminLink from './EmailAdminLink';
import DraftLiveToggle from './DraftLiveToggle';
import PremiumNav from './PremiumNav';
import NavHeader from './NavHeader';
import Footer from './Footer';
import { AnimatedCounter, PulseIndicator } from './AnimatedComponents';
import { Poll, RunoffResult } from '../types';
import { Analytics } from '../utils/analytics';

interface PollDashboardProps {
    poll: Poll;
    results: RunoffResult;
    adminKey: string;
    onEdit: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    // Survey-specific props
    isSurvey?: boolean;
    surveyResponses?: any[];
}

type TabType = 'results' | 'share' | 'notify' | 'settings' | 'downloads' | 'analytics';

// Tab color configurations
const tabColors: Record<TabType, { active: string; hover: string; icon: string }> = {
    results: { 
        active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-200', 
        hover: 'hover:bg-indigo-50 text-slate-600',
        icon: 'text-indigo-500'
    },
    share: { 
        active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200', 
        hover: 'hover:bg-emerald-50 text-slate-600',
        icon: 'text-emerald-500'
    },
    notify: { 
        active: 'bg-rose-600 text-white shadow-lg shadow-rose-200', 
        hover: 'hover:bg-rose-50 text-slate-600',
        icon: 'text-rose-500'
    },
    settings: { 
        active: 'bg-slate-700 text-white shadow-lg shadow-slate-200', 
        hover: 'hover:bg-slate-100 text-slate-600',
        icon: 'text-slate-500'
    },
    downloads: { 
        active: 'bg-amber-600 text-white shadow-lg shadow-amber-200', 
        hover: 'hover:bg-amber-50 text-slate-600',
        icon: 'text-amber-500'
    },
    analytics: { 
        active: 'bg-purple-600 text-white shadow-lg shadow-purple-200', 
        hover: 'hover:bg-purple-50 text-slate-600',
        icon: 'text-purple-500'
    },
};

// ============================================================================
// HelpTooltip Component - Industry-standard contextual help
// ============================================================================
const HelpTooltip: React.FC<{
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    maxWidth?: string;
    children?: React.ReactNode;
}> = ({ content, position = 'top', maxWidth = '250px', children }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };
    
    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent',
    };
    
    return (
        <span 
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children || (
                <HelpCircle 
                    size={14} 
                    className="text-slate-400 hover:text-slate-600 cursor-help transition-colors" 
                />
            )}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positionClasses[position]}`}
                        style={{ maxWidth }}
                    >
                        <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                            {content}
                        </div>
                        <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

// Collapsible Section Component
const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    badge?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, icon, defaultOpen = true, badge, children, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-slate-500">{icon}</div>
                    <span className="font-semibold text-slate-800">{title}</span>
                    {badge}
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-5 pb-5 border-t border-slate-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Upgrade Badge
const UpgradeBadge: React.FC<{ small?: boolean }> = ({ small }) => (
    <span className={`inline-flex items-center gap-1 ${small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} rounded-full font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700`}>
        <Lock size={small ? 10 : 12} />
        Upgrade
    </span>
);

// Locked Feature Preview Card (for showing free users what they're missing)
const LockedFeaturePreview: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    mockValue?: string;
    onClick: () => void;
}> = ({ icon, title, description, mockValue, onClick }) => (
    <button
        onClick={onClick}
        className="relative w-full p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all text-left group overflow-hidden"
    >
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Lock size={12} /> Unlock
            </span>
        </div>
        
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    {title}
                    <Lock size={12} className="text-amber-500" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                {mockValue && (
                    <div className="mt-2 text-lg font-bold text-slate-300 blur-[3px] select-none">
                        {mockValue}
                    </div>
                )}
            </div>
        </div>
    </button>
);

const PollDashboard: React.FC<PollDashboardProps> = ({
    poll,
    results,
    adminKey,
    onEdit,
    onRefresh,
    isRefreshing,
    isSurvey = false,
    surveyResponses = []
}) => {
    // Calculate initial vote count to determine default tab
    const initialVoteCount = results.totalVotes || results.votes?.length || 0;
    
    // State - default to 'share' tab when no votes yet
    const [activeTab, setActiveTab] = useState<TabType>(initialVoteCount === 0 ? 'share' : 'results');
    const [copiedShare, setCopiedShare] = useState(false);
    const [copiedAdmin, setCopiedAdmin] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showShareCards, setShowShareCards] = useState(false);
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeHighlight, setUpgradeHighlight] = useState<string | undefined>();
    const [analyticsDateRange, setAnalyticsDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [crossTabFilteredVotes, setCrossTabFilteredVotes] = useState<any[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    
    // Quick Actions state
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Response Filters state (Pro+ feature)
    const [showFilters, setShowFilters] = useState(false);
    const [filterDateRange, setFilterDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [filterDevice, setFilterDevice] = useState<string>('all');
    const [filterComplete, setFilterComplete] = useState<string>('all');
    
    // Keyboard shortcuts help modal
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    
    // Local state for settings toggles (for immediate UI feedback)
    const [localPublicResults, setLocalPublicResults] = useState(poll.settings?.publicResults || false);
    const [localShowShareButton, setLocalShowShareButton] = useState(poll.settings?.showShareButton || false);
    const [localAllowedViews, setLocalAllowedViews] = useState<string[]>(poll.settings?.allowedViews || ['bar', 'pie']);
    const [localShowSocialShare, setLocalShowSocialShare] = useState(poll.settings?.showSocialShare !== false); // Default true
    const [localRedirectUrl, setLocalRedirectUrl] = useState((poll.settings as any)?.redirectUrl || '');
    const [localCustomLogo, setLocalCustomLogo] = useState((poll.settings as any)?.customLogo || null);
    const [settingsUpdating, setSettingsUpdating] = useState(false);
    
    // Track recently updated settings to prevent useEffect from reverting them
    const recentlyUpdated = React.useRef<Set<string>>(new Set());
    
    // Sync local state when poll props change (e.g., after external refresh)
    // BUT don't sync settings we recently updated ourselves
    React.useEffect(() => {
        console.log('PollDashboard useEffect - syncing settings from props');
        console.log('  poll.settings.publicResults:', poll.settings?.publicResults);
        console.log('  recentlyUpdated:', Array.from(recentlyUpdated.current));
        
        if (!recentlyUpdated.current.has('publicResults')) {
            console.log('  Setting localPublicResults to:', poll.settings?.publicResults || false);
            setLocalPublicResults(poll.settings?.publicResults || false);
        } else {
            console.log('  SKIPPING publicResults sync (recently updated)');
        }
        if (!recentlyUpdated.current.has('showShareButton')) {
            setLocalShowShareButton(poll.settings?.showShareButton || false);
        }
        if (!recentlyUpdated.current.has('allowedViews')) {
            setLocalAllowedViews(poll.settings?.allowedViews || ['bar', 'pie']);
        }
        if (!recentlyUpdated.current.has('showSocialShare')) {
            setLocalShowSocialShare(poll.settings?.showSocialShare !== false);
        }
    }, [poll.settings?.publicResults, poll.settings?.showShareButton, poll.settings?.allowedViews, poll.settings?.showSocialShare]);
    
    // Helper to update poll settings
    const updatePollSetting = async (settingKey: string, value: any) => {
        console.log(`updatePollSetting called: ${settingKey} = ${value}`);
        setSettingsUpdating(true);
        // Mark this setting as recently updated to prevent useEffect from reverting it
        recentlyUpdated.current.add(settingKey);
        console.log('Added to recentlyUpdated:', settingKey);
        
        try {
            const response = await fetch('/.netlify/functions/vg-update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId: poll.id,
                    adminKey,
                    settings: { [settingKey]: value }
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update setting');
            }
            
            console.log(`Setting ${settingKey} updated to:`, value);
            // Success - local state is already updated
            // Clear the recently updated flag after a delay (longer than auto-refresh interval)
            setTimeout(() => {
                recentlyUpdated.current.delete(settingKey);
                console.log(`Cleared recentlyUpdated for ${settingKey}`);
            }, 5000);
        } catch (err) {
            console.error('Failed to update setting:', err);
            // Clear the flag immediately on error
            recentlyUpdated.current.delete(settingKey);
            // Revert local state on error
            if (settingKey === 'publicResults') setLocalPublicResults(poll.settings?.publicResults || false);
            if (settingKey === 'showShareButton') setLocalShowShareButton(poll.settings?.showShareButton || false);
            if (settingKey === 'allowedViews') setLocalAllowedViews(poll.settings?.allowedViews || ['bar', 'pie']);
            if (settingKey === 'showSocialShare') setLocalShowSocialShare(poll.settings?.showSocialShare !== false);
        } finally {
            setSettingsUpdating(false);
        }
    };

    // Computed values
    const tier = useMemo(() => {
        return localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
    }, []);
    
    // Get subscription expiration for PremiumNav
    const subscriptionExpiresAt = useMemo(() => {
        return localStorage.getItem('vg_tier_expires') || localStorage.getItem('vg_expires_at') || undefined;
    }, []);
    
    const isPro = tier === 'pro' || tier === 'business';
    const isBusiness = tier === 'business';
    const isFree = tier === 'free';
    
    const shareUrl = `${window.location.origin}/#id=${poll.id}`;
    const adminUrl = `${window.location.origin}/#id=${poll.id}&admin=${adminKey}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&bgcolor=ffffff`;
    
    const voteCount = results.totalVotes || 0;
    const maxVotes = isFree ? 100 : (tier === 'pro' ? 10000 : 100000);
    const usagePercentage = (voteCount / maxVotes) * 100;
    const votes = results.votes || [];
    
    // Calculate what insights free users are missing
    const uniqueCountries = useMemo(() => {
        const countries = new Set<string>();
        votes.forEach((v: any) => {
            if (v.analytics?.country) countries.add(v.analytics.country);
        });
        return countries.size;
    }, [votes]);
    
    const uniqueDevices = useMemo(() => {
        const devices = new Set<string>();
        votes.forEach((v: any) => {
            if (v.analytics?.device) devices.add(v.analytics.device);
        });
        return devices.size;
    }, [votes]);
    
    const commentsCount = useMemo(() => {
        return votes.filter((v: any) => v.comment && v.comment.trim()).length;
    }, [votes]);
    
    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            
            // Don't trigger if modifier keys are pressed (except for ?)
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            
            switch (e.key.toLowerCase()) {
                case 'c':
                    // Copy share link
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                    break;
                case 'r':
                    // Refresh
                    if (!isRefreshing) onRefresh();
                    break;
                case '?':
                    // Show keyboard shortcuts help
                    setShowKeyboardHelp(true);
                    break;
                case 'escape':
                    // Close any modals
                    setShowKeyboardHelp(false);
                    setShowQuickActions(false);
                    setShowDeleteModal(false);
                    setShowFilters(false);
                    break;
                case '1':
                    setActiveTab('results');
                    break;
                case '2':
                    setActiveTab('share');
                    break;
                case '3':
                    setActiveTab('notify');
                    break;
                case '4':
                    setActiveTab('settings');
                    break;
                case '5':
                    setActiveTab('downloads');
                    break;
                case '6':
                    if (!isFree) setActiveTab('analytics');
                    break;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shareUrl, isRefreshing, onRefresh, isFree]);
    
    // Filtered votes (Pro+ feature)
    const filteredVotes = useMemo(() => {
        if (!isPro) return votes; // Free users see all (no filtering)
        
        return votes.filter((vote: any) => {
            // Date filter
            if (filterDateRange.start || filterDateRange.end) {
                const voteDate = new Date(vote.timestamp || vote.votedAt || vote.submittedAt);
                if (filterDateRange.start && voteDate < filterDateRange.start) return false;
                if (filterDateRange.end) {
                    const endOfDay = new Date(filterDateRange.end);
                    endOfDay.setHours(23, 59, 59, 999);
                    if (voteDate > endOfDay) return false;
                }
            }
            
            // Device filter
            if (filterDevice !== 'all') {
                const device = vote.analytics?.device?.toLowerCase() || 'unknown';
                if (filterDevice === 'mobile' && !['mobile', 'phone', 'tablet'].some(d => device.includes(d))) return false;
                if (filterDevice === 'desktop' && !['desktop', 'windows', 'mac', 'linux'].some(d => device.includes(d))) return false;
            }
            
            // Completion filter (for surveys)
            if (filterComplete !== 'all' && isSurvey) {
                const isComplete = vote.isComplete !== false;
                if (filterComplete === 'complete' && !isComplete) return false;
                if (filterComplete === 'incomplete' && isComplete) return false;
            }
            
            return true;
        });
    }, [votes, filterDateRange, filterDevice, filterComplete, isPro, isSurvey]);
    
    const hasActiveFilters = filterDateRange.start || filterDateRange.end || filterDevice !== 'all' || filterComplete !== 'all';
    
    const clearFilters = () => {
        setFilterDateRange({ start: null, end: null });
        setFilterDevice('all');
        setFilterComplete('all');
    };
    
    // Handlers
    const copyToClipboard = async (text: string, type: 'share' | 'admin' | 'codes') => {
        await navigator.clipboard.writeText(text);
        if (type === 'share') {
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
            // Track share
            Analytics.pollShared('copy_link');
        } else if (type === 'admin') {
            setCopiedAdmin(true);
            setTimeout(() => setCopiedAdmin(false), 2000);
        } else {
            setCopiedCodes(true);
            setTimeout(() => setCopiedCodes(false), 2000);
        }
    };

    // Export CSV with optional filtering (Business feature)
    const handleExportCSV = async (applyFilters: boolean = false) => {
        if (!isPro) {
            setUpgradeHighlight('export');
            setShowUpgradeModal(true);
            return;
        }
        
        // Filtered export is Business-only
        if (applyFilters && !isBusiness) {
            setUpgradeHighlight('filtered-export');
            setShowUpgradeModal(true);
            return;
        }
        
        setIsExporting(true);
        
        try {
            // Get the data to export (filtered or all)
            const dataToExport = applyFilters && filteredVotes.length > 0 
                ? filteredVotes 
                : votes;
            
            // Build CSV headers
            let csv = 'Vote ID,Timestamp,Choice,Device,Country,Browser,IP Hash';
            if (poll.settings.allowComments) {
                csv += ',Comment';
            }
            if (poll.settings.requireNames) {
                csv += ',Voter Name';
            }
            csv += '\n';
            
            // Build CSV rows
            dataToExport.forEach((vote: any) => {
                const timestamp = vote.timestamp || vote.createdAt || '';
                const choice = (vote.choice || vote.selectedOption || vote.selections?.join('; ') || '').toString().replace(/"/g, '""');
                const device = vote.device || vote.userAgent?.includes('Mobile') ? 'Mobile' : 'Desktop';
                const country = vote.country || vote.geo?.country || '';
                const browser = vote.browser || '';
                const ipHash = vote.ipHash || '';
                
                csv += `"${vote.id || ''}","${timestamp}","${choice}","${device}","${country}","${browser}","${ipHash}"`;
                
                if (poll.settings.allowComments) {
                    csv += `,"${(vote.comment || '').replace(/"/g, '""')}"`;
                }
                if (poll.settings.requireNames) {
                    csv += `,"${(vote.voterName || '').replace(/"/g, '""')}"`;
                }
                csv += '\n';
            });
            
            // Add summary row
            csv += '\n';
            csv += `"Total Responses","${dataToExport.length}"`;
            if (applyFilters && filteredVotes.length > 0) {
                csv += `,"(filtered from ${votes.length} total)"`;
            }
            csv += '\n';
            
            // Download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filterLabel = applyFilters ? '-filtered' : '';
            a.download = `${poll.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${filterLabel}-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Track export
            Analytics.resultsExported('csv');
        } catch (err) {
            console.error('CSV export error:', err);
            alert('Export failed. Please try again.');
        }
        
        setIsExporting(false);
    };
    
    // Export Excel with optional filtering (Business feature)
    const handleExportExcel = async (applyFilters: boolean = false) => {
        if (!isPro) {
            setUpgradeHighlight('export');
            setShowUpgradeModal(true);
            return;
        }
        
        // Filtered export is Business-only
        if (applyFilters && !isBusiness) {
            setUpgradeHighlight('filtered-export');
            setShowUpgradeModal(true);
            return;
        }
        
        setIsExporting(true);
        
        try {
            const dataToExport = applyFilters && filteredVotes.length > 0 
                ? filteredVotes 
                : votes;
            
            // Build CSV (Excel opens CSV files natively)
            let csv = 'Vote ID,Timestamp,Choice,Device,Country\n';
            dataToExport.forEach((vote: any) => {
                const choice = (vote.choice || vote.selectedOption || '').toString().replace(/,/g, ' ').replace(/"/g, "'");
                const timestamp = vote.timestamp || '';
                const device = vote.device || '';
                const country = vote.country || '';
                csv += `"${vote.id || ''}","${timestamp}","${choice}","${device}","${country}"\n`;
            });
            
            // Use CSV extension - Excel opens these natively
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filterLabel = applyFilters ? '-filtered' : '';
            a.download = `${poll.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}${filterLabel}-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Excel export error:', err);
            alert('Export failed. Please try again.');
        }
        
        setIsExporting(false);
    };

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'poll-qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to download QR", e);
        }
    };

    const shareToWhatsapp = () => {
        const text = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToSms = () => {
        const text = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
    };

    const shareToEmail = () => {
        const subject = `Vote: ${poll.title}`;
        const body = `Vote in my poll "${poll.title}": ${shareUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    };

    const openUpgradeModal = (feature: string) => {
        setUpgradeHighlight(feature);
        setShowUpgradeModal(true);
    };

    // Quick Action Handlers
    const handleTestAsVoter = () => {
        const voterUrl = `${window.location.origin}/#${isSurvey ? 'survey' : 'poll'}=${poll.id}`;
        window.open(voterUrl, '_blank');
        setShowQuickActions(false);
    };

    const handleDuplicate = async () => {
        setIsDuplicating(true);
        try {
            const response = await fetch('/.netlify/functions/vg-duplicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId: poll.id, adminKey })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Redirect to new poll's admin dashboard
                window.location.href = `/#${isSurvey ? 'survey' : 'poll'}=${data.newPollId}&admin=${data.newAdminKey}`;
            } else {
                alert('Failed to duplicate. Please try again.');
            }
        } catch (error) {
            console.error('Duplicate error:', error);
            alert('Failed to duplicate. Please try again.');
        }
        setIsDuplicating(false);
        setShowQuickActions(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/.netlify/functions/vg-delete-poll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId: poll.id, adminKey })
            });
            
            if (response.ok) {
                // Clear from localStorage
                const saved = localStorage.getItem('vg_polls');
                if (saved) {
                    const polls = JSON.parse(saved);
                    const filtered = polls.filter((p: any) => p.id !== poll.id);
                    localStorage.setItem('vg_polls', JSON.stringify(filtered));
                }
                // Redirect to home
                window.location.href = '/';
            } else {
                alert('Failed to delete. Please try again.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete. Please try again.');
        }
        setIsDeleting(false);
        setShowDeleteModal(false);
    };

    // Get current poll status
    const pollStatus = (poll as any).status || 'live';
    
    // Milestone celebrations
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMilestone, setCelebrationMilestone] = useState<number | null>(null);
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    
    // Check for milestone on mount and vote changes
    React.useEffect(() => {
        const lastSeenCount = parseInt(localStorage.getItem(`milestone_${poll.id}`) || '0', 10);
        const hitMilestone = milestones.find(m => voteCount >= m && lastSeenCount < m);
        
        if (hitMilestone) {
            setCelebrationMilestone(hitMilestone);
            setShowCelebration(true);
            localStorage.setItem(`milestone_${poll.id}`, hitMilestone.toString());
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => setShowCelebration(false), 5000);
        }
    }, [voteCount, poll.id]);
    
    // Expiration countdown
    const expirationInfo = useMemo(() => {
        const expiresAt = (poll as any).expiresAt;
        if (!expiresAt) return null;
        
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        const diffMs = expiryDate.getTime() - now.getTime();
        
        if (diffMs <= 0) {
            return { expired: true, text: 'Expired', color: 'text-red-600 bg-red-50' };
        }
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (diffDays > 7) {
            return { 
                expired: false, 
                text: `Closes ${expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                color: 'text-slate-600 bg-slate-50'
            };
        } else if (diffDays > 1) {
            return { expired: false, text: `${diffDays} days left`, color: 'text-amber-600 bg-amber-50' };
        } else if (diffDays === 1) {
            return { expired: false, text: '1 day left', color: 'text-orange-600 bg-orange-50' };
        } else if (diffHours > 1) {
            return { expired: false, text: `${diffHours} hours left`, color: 'text-red-600 bg-red-50' };
        } else {
            return { expired: false, text: 'Closing soon!', color: 'text-red-600 bg-red-50 animate-pulse' };
        }
    }, [(poll as any).expiresAt]);

    // Stats calculations
    const velocity = useMemo(() => {
        if (votes.length === 0) return 0;
        const now = Date.now();
        return votes.filter((v: any) => 
            new Date(v.timestamp).getTime() > now - 24 * 60 * 60 * 1000
        ).length;
    }, [votes]);

    // Compute first and last vote dates - direct computation to avoid TypeScript inference issues
    const { firstVoteDateDisplay, lastVoteDateDisplay } = useMemo((): { firstVoteDateDisplay: string; lastVoteDateDisplay: string } => {
        // First vote date
        let firstDisplay = '—';
        if (votes.length > 0) {
            const vote = votes[0];
            const dateStr = vote?.timestamp || vote?.votedAt || vote?.submittedAt || vote?.completedAt;
            if (dateStr) {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    firstDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
            }
        }
        
        // Last vote date - find most recent using for loop for better type inference
        let lastDisplay = '—';
        if (votes.length > 0) {
            let latestTime = 0;
            let latestDateObj: Date | null = null;
            
            for (let i = 0; i < votes.length; i++) {
                const vote = votes[i] as any;
                const dateStr = vote?.timestamp || vote?.votedAt || vote?.submittedAt || vote?.completedAt;
                if (!dateStr) continue;
                const date = new Date(dateStr);
                const time = date.getTime();
                if (isNaN(time)) continue;
                if (time > latestTime) {
                    latestTime = time;
                    latestDateObj = date;
                }
            }
            
            if (latestDateObj !== null && latestTime > 0) {
                const diffMs = Date.now() - latestTime;
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 60) {
                    lastDisplay = `${diffMins}m ago`;
                } else {
                    const diffHours = Math.floor(diffMins / 60);
                    if (diffHours < 24) {
                        lastDisplay = `${diffHours}h ago`;
                    } else {
                        lastDisplay = latestDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                }
            }
        }
        
        return { firstVoteDateDisplay: firstDisplay, lastVoteDateDisplay: lastDisplay };
    }, [votes]);

    // Tabs - Analytics locked for free users
    const tabs = [
        { id: 'results' as TabType, label: 'Results', icon: BarChart3, tooltip: 'View real-time voting results with charts, percentages, and winner analysis.' },
        { id: 'share' as TabType, label: 'Share', icon: Share2, tooltip: 'Get shareable links, QR codes, embed codes, and social sharing options.' },
        { id: 'notify' as TabType, label: 'Notify', icon: Bell, tooltip: 'Set up email notifications for milestones, new responses, and poll closure.' },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings, tooltip: 'Configure vote protection, result visibility, expiration, and custom branding.' },
        { id: 'downloads' as TabType, label: 'Downloads', icon: FileDown, tooltip: 'Export your data as CSV, Excel, or PDF reports for further analysis.' },
        { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp, premium: isFree, tooltip: 'Advanced insights: response timeline, geographic data, hourly patterns, and more.' },
    ];

    return (
        <>
            {/* Print-Friendly Styles */}
            <style>{`
                @media print {
                    /* Hide non-essential elements */
                    header, footer, nav, 
                    .print\\:hidden,
                    button:not(.print-include),
                    [data-print-hide="true"] {
                        display: none !important;
                    }
                    
                    /* Reset backgrounds and colors for printing */
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Full width layout */
                    .max-w-5xl, .max-w-6xl, .max-w-7xl {
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                    
                    /* Keep charts and gradients */
                    .bg-gradient-to-r, .bg-gradient-to-br {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Better spacing */
                    .space-y-6 > * + * {
                        margin-top: 1rem !important;
                    }
                    
                    /* Page break control */
                    .print-break-before {
                        page-break-before: always;
                    }
                    .print-avoid-break {
                        page-break-inside: avoid;
                    }
                    
                    /* Ensure text is black */
                    .text-slate-600, .text-slate-700, .text-slate-800, .text-slate-900 {
                        color: #1e293b !important;
                    }
                    
                    /* Add print header */
                    .print-header {
                        display: block !important;
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    
                    /* Results cards */
                    .rounded-2xl {
                        border: 1px solid #e2e8f0 !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
            
            {/* ================================================================ */}
            {/* NAVIGATION - Tier-aware */}
            {/* ================================================================ */}
            {isPro ? (
                // Paid users get PremiumNav (handles both desktop and mobile)
                <PremiumNav tier={tier} expiresAt={subscriptionExpiresAt} />
            ) : (
                // Free users get NavHeader on desktop, custom mobile nav
                <>
                    {/* Desktop: NavHeader */}
                    <div className="hidden md:block print:hidden">
                        <NavHeader />
                    </div>
                    
                    {/* Mobile Header for Free Users */}
                    <header className="md:hidden sticky top-0 z-40 print:hidden bg-white border-b border-slate-200">
                        <div className="px-4 py-3 flex items-center justify-between">
                            <a href="/" className="flex items-center gap-2">
                                <img 
                                    src="/logo.svg" 
                                    alt="VoteGenerator" 
                                    className="w-8 h-8"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <span className="font-bold text-slate-800">
                                    VoteGenerator
                                </span>
                            </a>
                            
                            <button 
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 rounded-lg transition hover:bg-slate-100 text-slate-600"
                            >
                                {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                        
                        {/* Mobile Menu Dropdown */}
                        <AnimatePresence>
                            {showMobileMenu && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden border-t border-slate-100 bg-white"
                                >
                                    <nav className="p-3 space-y-1">
                                        <a 
                                            href="/admin" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <LayoutDashboard size={20} /> Back to Dashboard
                                        </a>
                                        <a 
                                            href="/create" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <PlusCircle size={20} /> Create New Poll
                                        </a>
                                        <a 
                                            href="/templates" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <Zap size={20} /> Templates
                                        </a>
                                        <a 
                                            href="/help" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <HelpCircle size={20} /> Help Center
                                        </a>
                                        <div className="h-px bg-slate-100 my-2" />
                                        <a 
                                            href="/pricing" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                        >
                                            <Crown size={20} /> Upgrade to Pro
                                        </a>
                                    </nav>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </header>
                </>
            )}
            
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Print Header - Only visible when printing */}
                <div className="hidden print:block print-header mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">{poll.title}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isSurvey ? 'Survey' : 'Poll'} Results • Generated {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                        {voteCount} total {isSurvey ? 'responses' : 'votes'}
                    </p>
                </div>
                
                {/* ================================================================ */}
                {/* HEADER - Redesigned with prominent status & quick actions */}
                {/* ================================================================ */}
                <div className="mb-6 print:hidden">
                {/* Top row: Status banner */}
                <div className={`rounded-t-2xl px-4 py-3 flex items-center justify-between ${
                    pollStatus === 'live' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                    pollStatus === 'draft' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    pollStatus === 'paused' ? 'bg-gradient-to-r from-slate-500 to-slate-600' :
                    'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {pollStatus === 'live' && (
                                <>
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                    <span className="font-bold text-white">LIVE</span>
                                    <HelpTooltip 
                                        content="Your poll is publicly accessible and accepting responses. Share the link to start collecting votes."
                                        position="bottom"
                                    >
                                        <HelpCircle size={14} className="text-white/60 hover:text-white cursor-help" />
                                    </HelpTooltip>
                                </>
                            )}
                            {pollStatus === 'draft' && (
                                <>
                                    <Eye size={16} className="text-white" />
                                    <span className="font-bold text-white">DRAFT</span>
                                    <HelpTooltip 
                                        content="Draft polls are only visible to you. Toggle to 'Live' when ready to start collecting responses."
                                        position="bottom"
                                    >
                                        <HelpCircle size={14} className="text-white/60 hover:text-white cursor-help" />
                                    </HelpTooltip>
                                </>
                            )}
                            {pollStatus === 'paused' && (
                                <>
                                    <Pause size={16} className="text-white" />
                                    <span className="font-bold text-white">PAUSED</span>
                                    <HelpTooltip 
                                        content="Your poll is temporarily paused. Existing responses are preserved. Resume anytime to continue collecting votes."
                                        position="bottom"
                                    >
                                        <HelpCircle size={14} className="text-white/60 hover:text-white cursor-help" />
                                    </HelpTooltip>
                                </>
                            )}
                            {pollStatus === 'closed' && (
                                <>
                                    <XCircle size={16} className="text-white" />
                                    <span className="font-bold text-white">CLOSED</span>
                                    <HelpTooltip 
                                        content="This poll has ended and is no longer accepting responses. Results are final and can still be viewed and exported."
                                        position="bottom"
                                    >
                                        <HelpCircle size={14} className="text-white/60 hover:text-white cursor-help" />
                                    </HelpTooltip>
                                </>
                            )}
                        </div>
                        <span className="text-white/80 text-sm hidden sm:inline">
                            {pollStatus === 'live' && 'Accepting responses'}
                            {pollStatus === 'draft' && 'Not visible to voters yet'}
                            {pollStatus === 'paused' && 'Temporarily not accepting responses'}
                            {pollStatus === 'closed' && 'No longer accepting responses'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Test as Voter button */}
                        <button
                            onClick={handleTestAsVoter}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition"
                        >
                            <ExternalLink size={14} />
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                        
                        {/* Quick Actions Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowQuickActions(!showQuickActions)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                            
                            <AnimatePresence>
                                {showQuickActions && (
                                    <>
                                        {/* Backdrop */}
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setShowQuickActions(false)}
                                        />
                                        
                                        {/* Dropdown */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                                        >
                                            <div className="py-1">
                                                {/* Navigation Links */}
                                                <a
                                                    href="/admin"
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                                >
                                                    <LayoutDashboard size={16} className="text-slate-400" />
                                                    Back to Dashboard
                                                </a>
                                                <a
                                                    href="/create"
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                                >
                                                    <PlusCircle size={16} className="text-slate-400" />
                                                    Create New Poll
                                                </a>
                                                <div className="border-t border-slate-100 my-1" />
                                                <button
                                                    onClick={handleTestAsVoter}
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                                >
                                                    <ExternalLink size={16} className="text-slate-400" />
                                                    Preview as Voter
                                                </button>
                                                <button
                                                    onClick={handleDuplicate}
                                                    disabled={isDuplicating}
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3 disabled:opacity-50"
                                                >
                                                    {isDuplicating ? (
                                                        <Loader2 size={16} className="text-slate-400 animate-spin" />
                                                    ) : (
                                                        <CopyPlus size={16} className="text-slate-400" />
                                                    )}
                                                    Duplicate {isSurvey ? 'Survey' : 'Poll'}
                                                </button>
                                                <div className="border-t border-slate-100 my-1" />
                                                <button
                                                    onClick={() => {
                                                        setShowQuickActions(false);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete {isSurvey ? 'Survey' : 'Poll'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                
                {/* Main header content */}
                <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h1 className="text-2xl font-black text-slate-900 truncate">
                                    {poll.title}
                                </h1>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    tier === 'business' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' :
                                    tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                </span>
                                {isSurvey && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                        Survey
                                    </span>
                                )}
                                {expirationInfo && (
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${expirationInfo.color}`}>
                                        <Clock size={12} />
                                        {expirationInfo.text}
                                    </span>
                                )}
                            </div>
                            {poll.description && (
                                <p className="text-slate-500 text-sm line-clamp-2">{poll.description}</p>
                            )}
                        </div>
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    
                    {/* Poll Status Toggle - Compact version */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <DraftLiveToggle
                            pollId={poll.id}
                            adminKey={adminKey}
                            status={(poll as any).status || 'live'}
                            voteCount={voteCount}
                            onStatusChange={onRefresh}
                        />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Trash2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Delete {isSurvey ? 'Survey' : 'Poll'}?</h3>
                                        <p className="text-white/80 text-sm">This cannot be undone</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-slate-600 mb-2">
                                    You're about to permanently delete:
                                </p>
                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                    <p className="font-bold text-slate-800">{poll.title}</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {voteCount} response{voteCount !== 1 ? 's' : ''} will be lost
                                    </p>
                                </div>
                                
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
                                        <p className="text-sm text-amber-800">
                                            All responses, analytics, and settings will be permanently deleted.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={18} />
                                                Delete Forever
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Milestone Celebration Modal */}
            <AnimatePresence>
                {showCelebration && celebrationMilestone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCelebration(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Confetti background */}
                            <div className="relative bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 p-8">
                                {/* Animated confetti pieces */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`absolute w-3 h-3 rounded-full ${
                                            ['bg-yellow-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-purple-300'][i % 5]
                                        }`}
                                        initial={{ 
                                            x: '50%', 
                                            y: '50%', 
                                            scale: 0 
                                        }}
                                        animate={{ 
                                            x: `${Math.random() * 100}%`, 
                                            y: `${Math.random() * 100}%`, 
                                            scale: [0, 1, 0.5],
                                            rotate: Math.random() * 360
                                        }}
                                        transition={{ 
                                            duration: 2, 
                                            delay: i * 0.1,
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                    />
                                ))}
                                
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="text-7xl mb-4"
                                >
                                    🎉
                                </motion.div>
                                <h2 className="text-3xl font-black text-white mb-2">
                                    {celebrationMilestone} Responses!
                                </h2>
                                <p className="text-white/90">
                                    You hit a milestone!
                                </p>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-slate-600 mb-4">
                                    {celebrationMilestone >= 100 
                                        ? "Amazing! Your poll is really taking off! 🚀"
                                        : celebrationMilestone >= 50
                                        ? "Great progress! Keep sharing to reach more people."
                                        : "You're off to a great start! Share your poll to get even more responses."
                                    }
                                </p>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCelebration(false)}
                                        className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCelebration(false);
                                            setActiveTab('share');
                                        }}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        <Share2 size={18} />
                                        Share More
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Help Modal */}
            <AnimatePresence>
                {showKeyboardHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowKeyboardHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        ⌨️ Keyboard Shortcuts
                                    </h3>
                                    <button 
                                        onClick={() => setShowKeyboardHelp(false)}
                                        className="p-1 hover:bg-white/20 rounded-lg transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Quick Actions</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Copy link</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">C</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Refresh</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">R</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Help</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">?</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Close modal</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">Esc</kbd>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Navigate Tabs</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Results</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">1</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Share</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">2</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Notify</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">3</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Settings</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">4</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Downloads</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">5</kbd>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="text-sm text-slate-600">Analytics</span>
                                            <kbd className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-mono rounded">6</kbd>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-xs text-slate-400 text-center pt-2">
                                    Press <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono rounded">?</kbd> anytime to see shortcuts
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================================================================ */}
            {/* TAB NAVIGATION - Super prominent, sticky dashboard tabs */}
            {/* ================================================================ */}
            <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-lg print:hidden">
                <div className="max-w-5xl mx-auto">
                    {/* Colorful tab bar */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1 rounded-2xl shadow-xl shadow-indigo-200/50">
                        <div className="bg-white rounded-xl flex overflow-x-auto scrollbar-hide">
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const isLocked = tab.premium;
                                const shouldPulse = tab.id === 'share' && voteCount === 0 && !isActive;
                                
                                // Color schemes for each tab
                                const tabStyles: Record<string, { active: string; icon: string }> = {
                                    results: { active: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200', icon: 'text-indigo-500' },
                                    share: { active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200', icon: 'text-emerald-500' },
                                    notify: { active: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200', icon: 'text-amber-500' },
                                    settings: { active: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-200', icon: 'text-slate-500' },
                                    downloads: { active: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-200', icon: 'text-purple-500' },
                                    analytics: { active: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200', icon: 'text-pink-500' },
                                };
                                
                                const style = tabStyles[tab.id] || tabStyles.results;
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            if (isLocked) {
                                                openUpgradeModal('analytics');
                                            } else {
                                                setActiveTab(tab.id);
                                            }
                                        }}
                                        className={`relative flex-1 min-w-[90px] sm:min-w-[110px] flex items-center justify-center gap-2 px-3 sm:px-5 py-3 sm:py-4 text-sm font-bold transition-all rounded-xl m-1 ${
                                            isActive 
                                                ? style.active
                                                : isLocked
                                                    ? 'text-slate-300 hover:bg-slate-50'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        {/* Pulse indicator for Share when no votes */}
                                        {shouldPulse && (
                                            <>
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75" />
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">!</span>
                                            </>
                                        )}
                                        
                                        <Icon size={18} className={isActive ? 'text-white' : isLocked ? 'text-slate-300' : style.icon} />
                                        <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                                        
                                        {isLocked && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                                                <Lock size={10} className="text-amber-900" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Active tab indicator text on mobile */}
                    <p className="sm:hidden text-center text-xs text-indigo-600 font-medium mt-2">
                        {tabs.find(t => t.id === activeTab)?.label} • Swipe for more
                    </p>
                </div>
            </div>

            {/* ================================================================ */}
            {/* QUICK STATS */}
            {/* ================================================================ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                    <div className="text-3xl font-black text-indigo-600">
                        <AnimatedCounter value={voteCount} />
                    </div>
                    <div className="text-xs text-indigo-600/70 font-medium mt-1 flex items-center gap-1">
                        Total {isSurvey ? 'Responses' : 'Votes'}
                        <HelpTooltip content={isSurvey ? "Total number of completed survey submissions received." : "Total number of votes cast on your poll. Each voter counts once per allowed submission."} position="bottom" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="text-3xl font-black text-emerald-600">
                        <AnimatedCounter value={velocity} />
                        <span className="text-lg font-semibold text-emerald-400">/day</span>
                    </div>
                    <div className="text-xs text-emerald-600/70 font-medium mt-1 flex items-center gap-1">
                        Velocity
                        <HelpTooltip content="Average responses received per day since your poll was created. Higher velocity indicates stronger engagement." position="bottom" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="text-lg font-bold text-slate-700">
                        {firstVoteDateDisplay}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                        First {isSurvey ? 'Response' : 'Vote'}
                        <HelpTooltip content="When the first response was recorded. Helps you track how quickly participation began after sharing." position="bottom" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <div className="text-lg font-bold text-slate-700">
                        {lastVoteDateDisplay}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                        Last {isSurvey ? 'Response' : 'Vote'}
                        <HelpTooltip content="Most recent activity on your poll. If this is stale, consider re-sharing or promoting your poll." position="bottom" />
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* USAGE METER (Free Tier) */}
            {/* ================================================================ */}
            {isFree && (
                <div className={`mb-6 p-4 rounded-2xl border-2 ${
                    usagePercentage >= 90 ? 'bg-red-50 border-red-200' :
                    usagePercentage >= 75 ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                }`}>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                Free Plan
                                <HelpTooltip 
                                    content={`Free plans include up to ${maxVotes} responses per poll. Upgrade to Pro for 10,000+ responses and unlimited polls.`}
                                    position="right"
                                />
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                                {voteCount} / {maxVotes} responses
                            </span>
                        </div>
                        <button 
                            onClick={() => openUpgradeModal('unlimited')}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                            Upgrade for 10K+ responses <ArrowRight size={12} />
                        </button>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            className={`h-full rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' :
                                usagePercentage >= 75 ? 'bg-amber-500' :
                                'bg-indigo-500'
                            }`}
                        />
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* QUICK GUIDE - Simple Steps */}
            {/* ================================================================ */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-indigo-100"
            >
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-6 flex-wrap">
                        {/* Step 1 */}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                voteCount === 0 ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2' : 'bg-emerald-500 text-white'
                            }`}>
                                {voteCount === 0 ? '1' : <Check size={14} />}
                            </div>
                            <span className={`text-sm font-medium ${voteCount === 0 ? 'text-indigo-700' : 'text-emerald-600'}`}>
                                Share poll
                            </span>
                        </div>
                        
                        {/* Arrow */}
                        <ChevronRight size={16} className="text-slate-300 hidden sm:block" />
                        
                        {/* Step 2 */}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                voteCount === 0 ? 'bg-slate-200 text-slate-500' : 
                                voteCount < 5 ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2' : 'bg-emerald-500 text-white'
                            }`}>
                                {voteCount >= 5 ? <Check size={14} /> : '2'}
                            </div>
                            <span className={`text-sm font-medium ${
                                voteCount === 0 ? 'text-slate-400' : 
                                voteCount < 5 ? 'text-indigo-700' : 'text-emerald-600'
                            }`}>
                                Collect votes
                            </span>
                        </div>
                        
                        {/* Arrow */}
                        <ChevronRight size={16} className="text-slate-300 hidden sm:block" />
                        
                        {/* Step 3 */}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                voteCount >= 5 ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2' : 'bg-slate-200 text-slate-500'
                            }`}>
                                3
                            </div>
                            <span className={`text-sm font-medium ${voteCount >= 5 ? 'text-indigo-700' : 'text-slate-400'}`}>
                                View results
                            </span>
                        </div>
                    </div>
                    
                    {/* Quick action button - contextual based on state */}
                    <div className="flex gap-2">
                        {voteCount === 0 && (
                            <motion.button
                                onClick={() => setActiveTab('share')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                <Share2 size={16} />
                                Share Now
                            </motion.button>
                        )}
                        {voteCount > 0 && voteCount < 5 && (
                            <motion.button
                                onClick={() => setActiveTab('share')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center gap-2"
                            >
                                <Share2 size={16} />
                                Get More Votes
                            </motion.button>
                        )}
                        {voteCount >= 5 && (
                            <motion.button
                                onClick={() => setActiveTab('results')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center gap-2"
                            >
                                <BarChart3 size={16} />
                                View Results
                            </motion.button>
                        )}
                    </div>
                </div>
                
                {/* Contextual tip based on current state */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles size={12} className="text-amber-500" />
                    {voteCount === 0 && (
                        <span>Tip: Copy the link above and share it via email, text, or social media</span>
                    )}
                    {voteCount > 0 && voteCount < 10 && (
                        <span>Tip: Results update automatically every 8 seconds. Set up email notifications in the Notify tab!</span>
                    )}
                    {voteCount >= 10 && (
                        <span>Tip: Export your data in Downloads tab, or view detailed analytics (Pro feature)</span>
                    )}
                </div>
            </motion.div>

            {/* ================================================================ */}
            {/* TAB CONTENT */}
            {/* ================================================================ */}
            <AnimatePresence mode="wait">
                {/* ============================================================ */}
                {/* RESULTS TAB */}
                {/* ============================================================ */}
                {activeTab === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Empty State - When no responses yet */}
                        {voteCount === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <div className="text-center max-w-md mx-auto">
                                    {/* Illustration */}
                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        {/* Background circles */}
                                        <motion.div 
                                            className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <motion.div 
                                            className="absolute inset-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full"
                                            animate={{ scale: [1, 0.95, 1] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                        />
                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <BarChart3 size={64} className="text-indigo-400" />
                                            </motion.div>
                                        </div>
                                        {/* Floating elements */}
                                        <motion.div 
                                            className="absolute top-4 right-4 w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center"
                                            animate={{ rotate: [0, 10, -10, 0], y: [0, -4, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <Star size={16} className="text-amber-600" />
                                        </motion.div>
                                        <motion.div 
                                            className="absolute bottom-8 left-4 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center"
                                            animate={{ scale: [1, 1.2, 1], y: [0, -6, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        >
                                            <Check size={12} className="text-emerald-600" />
                                        </motion.div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                        No responses yet
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        Share your {isSurvey ? 'survey' : 'poll'} to start collecting responses. 
                                        Results will appear here in real-time!
                                    </p>
                                    
                                    <motion.button
                                        onClick={() => setActiveTab('share')}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 mx-auto"
                                    >
                                        <Share2 size={18} />
                                        Share Your {isSurvey ? 'Survey' : 'Poll'}
                                    </motion.button>
                                    
                                    <p className="text-xs text-slate-400 mt-4">
                                        💡 Tip: Use QR codes for in-person events or embed on your website
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Activity Timeline - Recent responses */}
                                {votes.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <Activity size={18} className="text-indigo-500" />
                                            Recent Activity
                                        </h3>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {/* Sort votes by date descending, show 5 most recent */}
                                            {[...votes]
                                                .sort((a: any, b: any) => {
                                                    const dateA = new Date(a.timestamp || a.votedAt || a.submittedAt || 0);
                                                    const dateB = new Date(b.timestamp || b.votedAt || b.submittedAt || 0);
                                                    return dateB.getTime() - dateA.getTime();
                                                })
                                                .slice(0, 5)
                                                .map((vote: any, idx: number) => {
                                                const voteTime = new Date(vote.timestamp || vote.votedAt || vote.submittedAt);
                                                const now = new Date();
                                                const diffMs = now.getTime() - voteTime.getTime();
                                                const diffMins = Math.floor(diffMs / 60000);
                                                const diffHours = Math.floor(diffMins / 60);
                                                const diffDays = Math.floor(diffHours / 24);
                                                
                                                let timeAgo = '';
                                                if (diffMins < 1) timeAgo = 'Just now';
                                                else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                                                else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                                                else if (diffDays === 1) timeAgo = 'Yesterday';
                                                else timeAgo = `${diffDays}d ago`;
                                                
                                                return (
                                                    <motion.div
                                                        key={vote.id || idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg"
                                                    >
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            idx === 0 ? 'bg-emerald-100' : 'bg-slate-100'
                                                        }`}>
                                                            <Check size={14} className={idx === 0 ? 'text-emerald-600' : 'text-slate-400'} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-slate-700 truncate">
                                                                {vote.voterName || 'Anonymous'} responded
                                                            </p>
                                                        </div>
                                                        <span className={`text-xs font-medium ${idx === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {timeAgo}
                                                        </span>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                        {votes.length > 5 && (
                                            <p className="text-xs text-slate-400 text-center mt-2">
                                                Showing last 5 of {votes.length} responses
                                            </p>
                                        )}
                                    </div>
                                )}
                                
                                {/* Response Filters - Pro+ Feature */}
                                {votes.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => isPro ? setShowFilters(!showFilters) : openUpgradeModal('filters')}
                                            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Filter size={18} className={hasActiveFilters ? 'text-indigo-600' : 'text-slate-400'} />
                                                <span className="font-semibold text-slate-800">Filter Responses</span>
                                                {hasActiveFilters && (
                                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                                                        {filteredVotes.length} of {votes.length}
                                                    </span>
                                                )}
                                                {!isPro && (
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                        <Crown size={10} /> Pro
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown size={18} className={`text-slate-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        <AnimatePresence>
                                            {showFilters && isPro && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-slate-200"
                                                >
                                                    <div className="p-4 space-y-4">
                                                        {/* Date Range Filter */}
                                                        <div>
                                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                                                                Date Range
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <input
                                                                        type="date"
                                                                        value={filterDateRange.start?.toISOString().split('T')[0] || ''}
                                                                        onChange={(e) => setFilterDateRange(prev => ({
                                                                            ...prev,
                                                                            start: e.target.value ? new Date(e.target.value) : null
                                                                        }))}
                                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="Start date"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <input
                                                                        type="date"
                                                                        value={filterDateRange.end?.toISOString().split('T')[0] || ''}
                                                                        onChange={(e) => setFilterDateRange(prev => ({
                                                                            ...prev,
                                                                            end: e.target.value ? new Date(e.target.value) : null
                                                                        }))}
                                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        placeholder="End date"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Device Filter */}
                                                        <div>
                                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                                                                Device Type
                                                            </label>
                                                            <div className="flex gap-2">
                                                                {[
                                                                    { value: 'all', label: 'All' },
                                                                    { value: 'mobile', label: '📱 Mobile' },
                                                                    { value: 'desktop', label: '💻 Desktop' }
                                                                ].map(opt => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => setFilterDevice(opt.value)}
                                                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                                            filterDevice === opt.value
                                                                                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                                                                                : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                                                                        }`}
                                                                    >
                                                                        {opt.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Completion Filter (Surveys only) */}
                                                        {isSurvey && (
                                                            <div>
                                                                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                                                                    Completion Status
                                                                </label>
                                                                <div className="flex gap-2">
                                                                    {[
                                                                        { value: 'all', label: 'All' },
                                                                        { value: 'complete', label: '✓ Complete' },
                                                                        { value: 'incomplete', label: '○ Incomplete' }
                                                                    ].map(opt => (
                                                                        <button
                                                                            key={opt.value}
                                                                            onClick={() => setFilterComplete(opt.value)}
                                                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                                                filterComplete === opt.value
                                                                                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                                                                                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                                                                            }`}
                                                                        >
                                                                            {opt.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Clear Filters */}
                                                        {hasActiveFilters && (
                                                            <button
                                                                onClick={clearFilters}
                                                                className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                                            >
                                                                <X size={14} />
                                                                Clear All Filters
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                                
                                {/* Poll Results - Available to ALL */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                    {isSurvey || poll.type === 'survey' ? (
                                <SurveyResults 
                                    poll={poll} 
                                    responses={surveyResponses.length > 0 ? surveyResponses : (filteredVotes || []).map((v: any, idx: number) => ({
                                        id: v.id || `response_${idx}`,
                                        pollId: poll.id,
                                        submittedAt: v.timestamp || v.votedAt,
                                        startedAt: v.startedAt,
                                        completionTime: v.completionTime,
                                        answers: v.surveyAnswers || v.answers || {},
                                        isComplete: true,
                                    }))}
                                    isAdmin={true}
                                />
                            ) : (
                                <VoteGeneratorResults 
                                    poll={poll} 
                                    results={results}
                                    onEdit={onEdit}
                                    adminKey={adminKey}
                                    isAdmin={true}
                                />
                            )}
                        </div>

                        {/* ======================================================== */}
                        {/* PAID ANALYTICS PREVIEWS - Show free users what they're missing */}
                        {/* ======================================================== */}
                        {isFree && voteCount > 0 && (
                            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <Sparkles size={20} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">Unlock Poll Insights</h3>
                                            <p className="text-sm text-slate-500">
                                                You have <span className="font-semibold text-purple-600">{voteCount} votes</span> with hidden insights
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => openUpgradeModal('analytics')}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Crown size={16} /> Upgrade
                                    </button>
                                </div>
                                
                                {/* Preview cards of locked features */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <LockedFeaturePreview
                                        icon={<Activity size={20} />}
                                        title="Response Timeline"
                                        description="See when votes come in"
                                        mockValue={`${velocity}/day trend`}
                                        onClick={() => openUpgradeModal('analytics')}
                                    />
                                    <LockedFeaturePreview
                                        icon={<MapPin size={20} />}
                                        title="Geographic Data"
                                        description="See where voters are"
                                        mockValue={uniqueCountries > 0 ? `${uniqueCountries} countries` : '—'}
                                        onClick={() => openUpgradeModal('analytics')}
                                    />
                                    <LockedFeaturePreview
                                        icon={<Smartphone size={20} />}
                                        title="Device Breakdown"
                                        description="Mobile vs desktop"
                                        mockValue={uniqueDevices > 0 ? `${uniqueDevices} device types` : '—'}
                                        onClick={() => openUpgradeModal('analytics')}
                                    />
                                    <LockedFeaturePreview
                                        icon={<MessageSquare size={20} />}
                                        title="Comment Analysis"
                                        description="Word cloud visualization"
                                        mockValue={commentsCount > 0 ? `${commentsCount} comments` : '—'}
                                        onClick={() => openUpgradeModal('analytics')}
                                    />
                                </div>
                                
                                <p className="text-xs text-slate-500 mt-4 text-center">
                                    Plus: Hourly heatmap, Cross-tabulation filters, Suspicious activity alerts, and more
                                </p>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setActiveTab('share')}
                                className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-semibold transition-colors"
                            >
                                <Share2 size={18} />
                                Share Poll
                            </button>
                            <button
                                onClick={onEdit}
                                className="flex items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors"
                            >
                                <Settings size={18} />
                                Edit Poll
                            </button>
                        </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* ============================================================ */}
                {/* SHARE TAB */}
                {/* ============================================================ */}
                {activeTab === 'share' && (
                    <motion.div
                        key="share"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Getting Started Banner - Show when no votes */}
                        {voteCount === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">🎉 Your {isSurvey ? 'survey' : 'poll'} is ready!</h3>
                                        <p className="text-white/90 text-sm mb-4">
                                            Share the link below with your audience. Responses will appear on the Results tab in real-time.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1.5 rounded-full">
                                                <Check size={14} /> Link ready to share
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1.5 rounded-full">
                                                <Check size={14} /> Dashboard auto-refreshes
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1.5 rounded-full">
                                                <Check size={14} /> Works on all devices
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Share Link - FREE */}
                        <CollapsibleSection
                            title="Share Link"
                            icon={<Link2 size={20} />}
                            defaultOpen={true}
                            badge={
                                <HelpTooltip 
                                    content="Share this link with your audience to collect votes. Works on all devices and browsers."
                                    position="left"
                                />
                            }
                        >
                            <div className="pt-4 space-y-4">
                                {/* Explanation */}
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-700">
                                        <strong>How it works:</strong> Anyone with this link can vote on your {isSurvey ? 'survey' : 'poll'}. Share it via social media, email, messaging apps, or embed it on your website.
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                        Voter Link
                                        <HelpTooltip 
                                            content="This is the direct link voters will use. Copy and share it anywhere - WhatsApp, Slack, email, social media, etc."
                                            position="right"
                                        />
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={shareUrl}
                                                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none"
                                            />
                                        </div>
                                        <motion.button
                                            onClick={() => copyToClipboard(shareUrl, 'share')}
                                            className={`px-5 rounded-xl font-bold transition-all ${
                                                copiedShare 
                                                    ? 'bg-emerald-500 text-white' 
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {copiedShare ? <Check size={18} /> : <Copy size={18} />}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Quick Share Label */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                        Quick Share
                                        <HelpTooltip 
                                            content="One-tap sharing to popular platforms. Opens the app with your poll link pre-filled."
                                            position="right"
                                        />
                                    </label>
                                    {/* Share Buttons - FREE */}
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        <button 
                                            onClick={shareToWhatsapp}
                                            className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
                                        >
                                            <MessageCircle size={20} />
                                            <span className="text-xs font-medium">WhatsApp</span>
                                        </button>
                                        <button 
                                            onClick={shareToSms}
                                            className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                                        >
                                            <Smartphone size={20} />
                                            <span className="text-xs font-medium">SMS</span>
                                        </button>
                                        <button 
                                            onClick={shareToEmail}
                                            className="flex flex-col items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                                        >
                                            <Mail size={20} />
                                            <span className="text-xs font-medium">Email</span>
                                        </button>
                                        <button 
                                            onClick={() => setShowQrModal(true)}
                                            className="flex flex-col items-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                                        >
                                            <QrCode size={20} />
                                            <span className="text-xs font-medium">QR Code</span>
                                        </button>
                                        <button 
                                            onClick={() => setShowShareCards(true)}
                                            className="flex flex-col items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors"
                                        >
                                            <Palette size={20} />
                                            <span className="text-xs font-medium">Cards</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* Share Results - Public Results Page */}
                        <CollapsibleSection
                            title="Share Results"
                            icon={<BarChart3 size={20} />}
                            defaultOpen={false}
                            badge={
                                <HelpTooltip 
                                    content="Create a beautiful public results page that anyone can view without voting. Great for sharing outcomes with stakeholders."
                                    position="left"
                                />
                            }
                        >
                            <div className="pt-4 space-y-4">
                                {/* Explanation */}
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <p className="text-sm text-purple-700">
                                        <strong>Public Results Page:</strong> Enable this to create a shareable link where anyone can view your poll results - perfect for announcements, reports, and transparency.
                                    </p>
                                </div>
                                
                                {/* Enable Public Results Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <Globe size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                                                Public Results Page
                                                <HelpTooltip 
                                                    content="When enabled, results are visible to anyone with the link. They can see charts and vote counts but cannot vote from this page."
                                                    position="right"
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500">Let anyone view results with a shareable link</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={localPublicResults}
                                            disabled={settingsUpdating}
                                            onChange={(e) => {
                                                const enabled = e.target.checked;
                                                console.log('Toggle clicked! Setting to:', enabled);
                                                console.log('Current localPublicResults:', localPublicResults);
                                                setLocalPublicResults(enabled);
                                                updatePollSetting('publicResults', enabled);
                                            }}
                                            className="sr-only peer"
                                        />
                                        <div className={`w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${settingsUpdating ? 'opacity-50' : ''}`}></div>
                                    </label>
                                </div>
                                
                                {/* Public results URL - Only show when enabled */}
                                {localPublicResults && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        {/* Results Link */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                                Results Link
                                                <HelpTooltip 
                                                    content="Share this link with anyone who wants to see the results. They won't be able to vote from this page."
                                                    position="right"
                                                />
                                            </label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        readOnly 
                                                        value={`${window.location.origin}/#results=${poll.id}`}
                                                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none"
                                                    />
                                                </div>
                                                <motion.button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/#results=${poll.id}`);
                                                        setCopiedShare(true);
                                                        setTimeout(() => setCopiedShare(false), 2000);
                                                    }}
                                                    className={`px-5 rounded-xl font-bold transition-all ${
                                                        copiedShare 
                                                            ? 'bg-emerald-500 text-white' 
                                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                    }`}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {copiedShare ? <Check size={18} /> : <Copy size={18} />}
                                                </motion.button>
                                            </div>
                                        </div>
                                        
                                        {/* Preview button */}
                                        <a
                                            href={`/#results=${poll.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                                        >
                                            <Eye size={18} />
                                            Preview Public Results Page
                                        </a>
                                        
                                        {/* What viewers will see */}
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="text-sm font-medium text-slate-700 mb-3">Visitors will see:</div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Check size={14} className="text-emerald-500" />
                                                    Bar chart results
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Check size={14} className="text-emerald-500" />
                                                    Pie chart results
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Check size={14} className="text-emerald-500" />
                                                    Total vote count
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Check size={14} className="text-emerald-500" />
                                                    Winner highlight
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Show Social Sharing Toggle */}
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center gap-3">
                                                <Share2 size={18} className="text-slate-500" />
                                                <div>
                                                    <div className="font-medium text-slate-700 text-sm">Show social sharing buttons</div>
                                                    <div className="text-xs text-slate-500">Let visitors share results on social media</div>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={localShowSocialShare}
                                                    onChange={(e) => {
                                                        const enabled = e.target.checked;
                                                        setLocalShowSocialShare(enabled);
                                                        updatePollSetting('showSocialShare', enabled);
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                        
                                        {/* Pro feature teaser */}
                                        {isFree && (
                                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                                <p className="text-xs text-amber-800 flex items-center gap-1">
                                                    <Lock size={12} className="text-amber-500" />
                                                    <button
                                                        onClick={() => openUpgradeModal('analytics')}
                                                        className="text-amber-700 hover:underline font-medium"
                                                    >
                                                        Upgrade
                                                    </button>
                                                    {' '}to control which chart types visitors can see
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* View Selection - Pro only */}
                                        {isPro && (
                                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                                <label className="block text-sm font-medium text-purple-800 mb-3">
                                                    Choose which views visitors can see:
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['bar', 'pie'].map(view => (
                                                        <label key={view} className={`flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors ${settingsUpdating ? 'opacity-50' : ''}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={localAllowedViews.includes(view)}
                                                                disabled={settingsUpdating}
                                                                onChange={(e) => {
                                                                    const updated = e.target.checked 
                                                                        ? [...localAllowedViews, view]
                                                                        : localAllowedViews.filter((v: string) => v !== view);
                                                                    setLocalAllowedViews(updated);
                                                                    updatePollSetting('allowedViews', updated);
                                                                }}
                                                                className="w-4 h-4 text-purple-600 rounded"
                                                            />
                                                            <span className="text-sm text-slate-700 capitalize">{view} Chart</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Embed Poll - Available to ALL (branding removal = paid) */}
                        <CollapsibleSection
                            title="Embed Poll"
                            icon={<Code size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Add this poll directly to your website, blog, or Notion page. Visitors can vote without leaving your site."
                                        position="left"
                                    />
                                    {isFree && usagePercentage >= 100 ? (
                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                            At Limit
                                        </span>
                                    ) : null}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isFree && usagePercentage >= 100 ? (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-red-800">Response Limit Reached</p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Your embedded poll will show a "limit reached" message. Upgrade to continue.
                                                </p>
                                                <button
                                                    onClick={() => openUpgradeModal('unlimited')}
                                                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm"
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Add this poll to your website, blog, or Notion page.
                                            {isFree && (
                                                <span className="text-slate-500"> Includes "Powered by VoteGenerator" badge.</span>
                                            )}
                                        </p>
                                        <button
                                            onClick={() => setShowEmbedModal(true)}
                                            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Code size={18} />
                                            Get Embed Code
                                        </button>
                                        {isFree && (
                                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                                <Lock size={12} className="text-amber-500" />
                                                <button
                                                    onClick={() => openUpgradeModal('branding')}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Upgrade
                                                </button>
                                                {' '}to remove branding & restrict domains
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Custom Short Link - PAID */}
                        <CollapsibleSection
                            title="Custom Short Link"
                            icon={<Link2 size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Create a memorable, branded URL for your poll like 'vote.gen/team-survey'. Easier to share and remember."
                                        position="left"
                                    />
                                    {!isPro && <UpgradeBadge small />}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isPro ? (
                                    <CustomSlugInput
                                        pollId={poll.id}
                                        adminKey={adminKey}
                                        currentSlug={(poll as any).customSlug}
                                        tier={tier}
                                        onUpgradeClick={() => openUpgradeModal('branding')}
                                    />
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Sparkles size={20} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-amber-800">Paid Feature</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Create memorable links like <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">vote.gen/your-poll</code>
                                                </p>
                                                <button
                                                    onClick={() => openUpgradeModal('branding')}
                                                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg text-sm"
                                                >
                                                    Upgrade Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Backup Admin Link */}
                        <CollapsibleSection
                            title="Backup Dashboard Link"
                            icon={<Key size={20} />}
                            badge={
                                <HelpTooltip 
                                    content="Save this backup link to access this specific poll's dashboard from any device. Unlike your main dashboard, this only manages this one poll."
                                    position="left"
                                />
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4 space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm text-blue-800 flex items-start gap-2">
                                        <Mail size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>
                                            Email yourself this link to access this poll's dashboard from any device. 
                                            <strong> This link only manages THIS poll</strong>, not your other polls.
                                        </span>
                                    </p>
                                </div>
                                <EmailAdminLink
                                    pollId={poll.id}
                                    adminKey={adminKey}
                                    pollTitle={poll.title}
                                />
                            </div>
                        </CollapsibleSection>
                    </motion.div>
                )}

                {/* ============================================================ */}
                {/* NOTIFY TAB */}
                {/* ============================================================ */}
                {activeTab === 'notify' && (
                    <motion.div
                        key="notify"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Email Notifications Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Email Notifications</h2>
                                    <p className="text-white/80 text-sm">
                                        Get notified about new responses, milestones, and important events
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Free tier info */}
                        {isFree && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-sm text-slate-600">
                                    <strong>Free plan:</strong> Get notified when your {isSurvey ? 'survey' : 'poll'} closes.{' '}
                                    <button
                                        onClick={() => openUpgradeModal('notifications')}
                                        className="text-indigo-600 hover:underline font-medium"
                                    >
                                        Upgrade
                                    </button>
                                    {' '}for real-time alerts, milestone notifications, and more.
                                </p>
                            </div>
                        )}
                        
                        {/* Notification Settings Component */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <NotificationSettings 
                                pollId={poll.id}
                                adminKey={adminKey}
                                pollTitle={poll.title}
                                tier={tier}
                                currentSettings={poll.notificationSettings ? {
                                    enabled: poll.notificationSettings.enabled ?? true,
                                    emails: poll.notificationSettings.emails ?? [],
                                    skipFirstVotes: poll.notificationSettings.skipFirstVotes ?? 3,
                                    notifyOn: {
                                        eachResponse: (poll.notificationSettings.notifyOn as any)?.eachResponse ?? false,
                                        milestones: poll.notificationSettings.notifyOn?.milestones ?? true,
                                        dailyDigest: poll.notificationSettings.notifyOn?.dailyDigest ?? false,
                                        pollClosed: poll.notificationSettings.notifyOn?.pollClosed ?? true,
                                        limitReached: poll.notificationSettings.notifyOn?.limitReached ?? true,
                                        newComment: (poll.notificationSettings.notifyOn as any)?.newComment ?? false
                                    }
                                } : undefined}
                            />
                        </div>
                    </motion.div>
                )}

                {/* ============================================================ */}
                {/* SETTINGS TAB */}
                {/* ============================================================ */}
                {activeTab === 'settings' && (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Poll Settings */}
                        <CollapsibleSection
                            title="Poll Settings"
                            icon={<Settings size={20} />}
                            badge={
                                <HelpTooltip 
                                    content="View and edit your poll's configuration including security, result visibility, deadline, and sharing options."
                                    position="left"
                                />
                            }
                            defaultOpen={true}
                        >
                            <div className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                                            Security
                                            <HelpTooltip 
                                                content={
                                                    String(poll.settings.security) === 'ip' ? "IP Address tracking prevents the same device from voting multiple times." :
                                                    String(poll.settings.security) === 'cookie' ? "Browser cookies prevent repeat votes from the same browser session." :
                                                    String(poll.settings.security) === 'captcha' ? "CAPTCHA verification helps prevent automated bot submissions." :
                                                    String(poll.settings.security) === 'ip+captcha' ? "Combined IP tracking and CAPTCHA for maximum vote integrity." :
                                                    "No vote protection enabled. Anyone can vote multiple times."
                                                }
                                                position="bottom"
                                            />
                                        </div>
                                        <div className="font-semibold text-slate-800 capitalize">
                                            {poll.settings.security || 'None'}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                                            Results
                                            <HelpTooltip 
                                                content={poll.settings.hideResults 
                                                    ? "Results are hidden from voters until you choose to reveal them. Only you can see the current standings."
                                                    : "Results are visible to everyone after they vote. Voters can see current standings."
                                                }
                                                position="bottom"
                                            />
                                        </div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                                            {poll.settings.hideResults ? (
                                                <><EyeOff size={14} /> Hidden</>
                                            ) : (
                                                <><Eye size={14} /> Visible</>
                                            )}
                                        </div>
                                    </div>
                                    {poll.settings.deadline && (
                                        <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                                            <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                                                Deadline
                                                <HelpTooltip 
                                                    content="When this deadline passes, the poll will automatically close and stop accepting new responses."
                                                    position="bottom"
                                                />
                                            </div>
                                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(poll.settings.deadline).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Show Share Poll Button Toggle */}
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Share2 size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800 flex items-center gap-1">
                                                    Share Poll Button
                                                    <HelpTooltip 
                                                        content="Enable viral sharing by letting voters share your poll with their networks directly from the voting page."
                                                        position="right"
                                                    />
                                                </div>
                                                <div className="text-xs text-slate-500">Show "Share this poll" link to voters</div>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={localShowShareButton}
                                                onChange={(e) => {
                                                    const enabled = e.target.checked;
                                                    setLocalShowShareButton(enabled);
                                                    updatePollSetting('showShareButton', enabled);
                                                }}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 ml-13">
                                        When enabled, voters see a share button while taking the poll.
                                    </p>
                                </div>
                                
                                <button
                                    onClick={onEdit}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <Settings size={18} />
                                    Edit Poll Settings
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* Access Codes (if poll has them) */}
                        {poll.allowedCodes && poll.allowedCodes.length > 0 && (
                            <CollapsibleSection
                                title="Access Codes"
                                icon={<Key size={20} />}
                                badge={
                                    <>
                                        <HelpTooltip 
                                            content="Unique one-time codes for secure voting. Each code can only be used once. Distribute these to your intended voters."
                                            position="left"
                                        />
                                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">{poll.allowedCodes.length}</span>
                                    </>
                                }
                                defaultOpen={false}
                            >
                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-sm text-slate-600">
                                            {poll.allowedCodes.length} unique codes generated
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(poll.allowedCodes!.join('\n'), 'codes')}
                                            className={`text-sm font-medium flex items-center gap-1 ${
                                                copiedCodes ? 'text-emerald-600' : 'text-indigo-600 hover:text-indigo-700'
                                            }`}
                                        >
                                            {copiedCodes ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedCodes ? 'Copied!' : 'Copy All'}
                                        </button>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-600">
                                        {poll.allowedCodes.map((code, i) => (
                                            <div key={i} className="py-0.5">{code}</div>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Email Notifications */}
                        <CollapsibleSection
                            title="Email Notifications"
                            icon={<Bell size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Get notified via email when important events happen: new responses, milestones reached, or when your poll closes."
                                        position="left"
                                    />
                                    {isFree ? (
                                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                            Limited
                                        </span>
                                    ) : (
                                        <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            All included
                                        </span>
                                    )}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isFree && (
                                    <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <p className="text-sm text-slate-600">
                                            <strong>Free plan:</strong> Get notified when your poll closes.{' '}
                                            <button
                                                onClick={() => openUpgradeModal('notifications')}
                                                className="text-indigo-600 hover:underline font-medium"
                                            >
                                                Upgrade
                                            </button>
                                            {' '}for real-time alerts, milestone notifications, suspicious activity alerts, and more.
                                        </p>
                                    </div>
                                )}
                                <NotificationSettings 
                                    pollId={poll.id}
                                    adminKey={adminKey}
                                    pollTitle={poll.title}
                                    tier={tier}
                                    currentSettings={poll.notificationSettings ? {
                                        enabled: poll.notificationSettings.enabled ?? true,
                                        emails: poll.notificationSettings.emails ?? [],
                                        skipFirstVotes: poll.notificationSettings.skipFirstVotes ?? 3,
                                        notifyOn: {
                                            eachResponse: (poll.notificationSettings.notifyOn as any)?.eachResponse ?? false,
                                            milestones: poll.notificationSettings.notifyOn?.milestones ?? true,
                                            dailyDigest: poll.notificationSettings.notifyOn?.dailyDigest ?? false,
                                            pollClosed: poll.notificationSettings.notifyOn?.pollClosed ?? true,
                                            limitReached: poll.notificationSettings.notifyOn?.limitReached ?? true,
                                            newComment: (poll.notificationSettings.notifyOn as any)?.newComment ?? false
                                        }
                                    } : undefined}
                                />
                            </div>
                        </CollapsibleSection>

                        {/* Custom Branding - PRO+ (remove badge) */}
                        <CollapsibleSection
                            title="Custom Branding"
                            icon={<ImageIcon size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Remove VoteGenerator branding, customize colors, and set a custom thank-you message."
                                        position="left"
                                    />
                                    {!isPro && <UpgradeBadge small />}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isPro ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600">
                                            Remove "Powered by VoteGenerator" badge and customize colors.
                                        </p>
                                        <button
                                            onClick={onEdit}
                                            className="w-full py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Palette size={18} />
                                            Customize Colors & Badge
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <ImageIcon size={20} className="text-purple-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-purple-800">Pro Feature</p>
                                                <p className="text-sm text-purple-700 mt-1">
                                                    Remove "Powered by VoteGenerator" and customize colors.
                                                </p>
                                                <button
                                                    onClick={() => openUpgradeModal('branding')}
                                                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm"
                                                >
                                                    Upgrade to Pro
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Custom Logo - BUSINESS ONLY */}
                        <CollapsibleSection
                            title="Custom Logo"
                            icon={<ImageIcon size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Upload your company logo to display on your polls for a fully branded experience."
                                        position="left"
                                    />
                                    {!isBusiness && (
                                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                                            Business
                                        </span>
                                    )}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isBusiness ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600">
                                            Upload your company logo to appear on your polls and results pages.
                                        </p>
                                        <LogoUpload
                                            currentLogo={localCustomLogo}
                                            onLogoChange={(logoUrl) => {
                                                setLocalCustomLogo(logoUrl);
                                                updatePollSetting('customLogo', logoUrl);
                                            }}
                                            tier={tier}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Crown size={20} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-amber-800">Business Feature</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Upload your company logo for a fully branded polling experience.
                                                </p>
                                                <button
                                                    onClick={() => openUpgradeModal('logo')}
                                                    className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-sm"
                                                >
                                                    Upgrade to Business
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Post-Vote Redirect - BUSINESS ONLY */}
                        <CollapsibleSection
                            title="Post-Vote Redirect"
                            icon={<ExternalLink size={20} />}
                            badge={
                                <>
                                    <HelpTooltip 
                                        content="Automatically redirect voters to a custom URL after they submit their response."
                                        position="left"
                                    />
                                    {!isBusiness && (
                                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                                            Business
                                        </span>
                                    )}
                                </>
                            }
                            defaultOpen={false}
                        >
                            <div className="pt-4">
                                {isBusiness ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600">
                                            After voting, redirect participants to your website, thank-you page, or any URL.
                                        </p>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Redirect URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={localRedirectUrl}
                                                    onChange={(e) => setLocalRedirectUrl(e.target.value)}
                                                    placeholder="https://yoursite.com/thank-you"
                                                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                />
                                                <button
                                                    onClick={() => updatePollSetting('redirectUrl', localRedirectUrl || null)}
                                                    disabled={settingsUpdating}
                                                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                                                >
                                                    {settingsUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Leave empty to show the default thank-you page. Must include https://
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <Crown size={20} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-amber-800">Business Feature</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Redirect voters to your website or custom thank-you page after they vote.
                                                </p>
                                                <button
                                                    onClick={() => openUpgradeModal('redirect')}
                                                    className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-sm"
                                                >
                                                    Upgrade to Business
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CollapsibleSection>

                        {/* Advanced Settings Preview - FREE ONLY */}
                        {isFree && (
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
                                        <Zap size={20} className="text-slate-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700">Advanced Settings</h3>
                                        <p className="text-xs text-slate-500">Available with paid plans</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {[
                                        'PIN code access',
                                        'Email notifications',
                                        'Scheduled close',
                                        'Custom colors',
                                        'Remove branding',
                                        'CSV/Excel export'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-slate-500">
                                            <Lock size={10} className="text-purple-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                    <p className="text-xs font-semibold text-amber-700 mb-2">Business-only:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {[
                                            'Custom logo upload',
                                            'Post-vote redirect',
                                            'Hourly heatmap',
                                            'Custom short links'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-slate-500">
                                                <Lock size={10} className="text-amber-500" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => openUpgradeModal('settings')}
                                    className="w-full mt-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                                >
                                    Unlock Advanced Settings
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ============================================================ */}
                {/* DOWNLOADS TAB */}
                {/* ============================================================ */}
                {activeTab === 'downloads' && (
                    <motion.div
                        key="downloads"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileDown size={20} className="text-amber-500" />
                                Download Options
                                <HelpTooltip 
                                    content="Export your poll data in various formats for reporting, presentations, or further analysis in other tools."
                                    position="right"
                                />
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Export your poll data in different formats. QR code and share cards are free for all users.
                            </p>
                            
                            <div className="space-y-3">
                                {/* QR Code - FREE */}
                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                                            <QrCode size={24} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-700 flex items-center gap-1">
                                                QR Code
                                                <HelpTooltip 
                                                    content="Perfect for printed materials, posters, presentations, or events. People can scan to vote instantly."
                                                    position="right"
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500">Download PNG image for printing or sharing</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Free</span>
                                        <Download size={18} className="text-slate-400" />
                                    </div>
                                </button>

                                {/* Share Cards - FREE */}
                                <button
                                    onClick={() => setShowShareCards(true)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <ImageIcon size={24} className="text-purple-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-700 flex items-center gap-1">
                                                Share Cards
                                                <HelpTooltip 
                                                    content="Eye-catching social media images optimized for Instagram, Twitter, and Facebook. Includes QR code and poll title."
                                                    position="right"
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500">Beautiful social media cards with QR code</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Free</span>
                                        <Download size={18} className="text-slate-400" />
                                    </div>
                                </button>
                                
                                {/* Filtered CSV Export - BUSINESS ONLY */}
                                {filteredVotes.length > 0 && filteredVotes.length !== votes.length && (
                                    <button
                                        onClick={() => handleExportCSV(true)}
                                        disabled={isExporting}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors border ${
                                            isBusiness 
                                                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200' 
                                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                isBusiness ? 'bg-amber-100' : 'bg-slate-200'
                                            }`}>
                                                <Filter size={24} className={isBusiness ? 'text-amber-600' : 'text-slate-400'} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-slate-700 flex items-center gap-2">
                                                    Export Filtered Results
                                                    {!isBusiness && (
                                                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full flex items-center gap-0.5">
                                                            <Crown size={10} /> Business
                                                        </span>
                                                    )}
                                                    <HelpTooltip 
                                                        content="Export only the responses matching your current filters (date range, device, etc.)"
                                                        position="right"
                                                    />
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {filteredVotes.length} of {votes.length} responses (filtered)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {isExporting ? (
                                                <Loader2 size={18} className="text-slate-400 animate-spin" />
                                            ) : (
                                                <Download size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                    </button>
                                )}
                                
                                {/* CSV/Excel Export - PRO+ */}
                                <button
                                    onClick={() => handleExportCSV(false)}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <FileSpreadsheet size={24} className="text-emerald-600" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-700 flex items-center gap-1">
                                                Export to CSV
                                                <HelpTooltip 
                                                    content="Download all votes as CSV. Opens in Excel, Google Sheets, or any spreadsheet app."
                                                    position="right"
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500">All {votes.length} responses • Opens in Excel</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!isPro && <UpgradeBadge small />}
                                        {isExporting ? (
                                            <Loader2 size={18} className="text-slate-400 animate-spin" />
                                        ) : (
                                            <Download size={18} className="text-slate-400" />
                                        )}
                                    </div>
                                </button>
                                
                                {/* Print / Save as PDF - PRO+ */}
                                <button
                                    onClick={() => {
                                        if (!isPro) {
                                            openUpgradeModal('export');
                                        } else {
                                            window.print();
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <FileDown size={24} className="text-red-500" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-700 flex items-center gap-1">
                                                Print / Save as PDF
                                                <HelpTooltip 
                                                    content="Use your browser's print function to save as PDF. Great for presentations and stakeholder updates."
                                                    position="right"
                                                />
                                            </div>
                                            <div className="text-xs text-slate-500">Print-ready report with results and charts</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!isPro && <UpgradeBadge small />}
                                        <Download size={18} className="text-slate-400" />
                                    </div>
                                </button>
                            </div>
                            
                            {/* Upgrade CTA for free users */}
                            {isFree && (
                                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <Sparkles size={20} className="text-amber-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-800">Unlock all export options</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                Export your complete poll data including all votes, comments, and analytics to CSV or Excel.
                                            </p>
                                            <button
                                                onClick={() => openUpgradeModal('export')}
                                                className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg text-sm"
                                            >
                                                Upgrade Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Business filtered export CTA for Pro users */}
                            {isPro && !isBusiness && (
                                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <Crown size={20} className="text-amber-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-amber-800">Business feature: Filtered exports</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                Export only the data matching your filters. Great for segmented analysis and reporting.
                                            </p>
                                            <button
                                                onClick={() => openUpgradeModal('filtered-export')}
                                                className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg text-sm"
                                            >
                                                Upgrade to Business
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ============================================================ */}
                {/* ANALYTICS TAB - PAID ONLY */}
                {/* ============================================================ */}
                {activeTab === 'analytics' && isPro && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Date Range Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-purple-500" />
                                <h3 className="font-bold text-slate-800">Analytics Dashboard</h3>
                                <HelpTooltip 
                                    content="Advanced analytics show voting patterns, geographic distribution, and engagement trends. Use date filters to analyze specific time periods."
                                    position="right"
                                    maxWidth="280px"
                                />
                            </div>
                            <DateRangeFilter 
                                onRangeChange={(start, end) => setAnalyticsDateRange({ start, end })}
                                minDate={votes.length > 0 ? new Date(votes[0]?.timestamp) : undefined}
                            />
                        </div>

                        {/* Cross-Tab Filters */}
                        {votes.length >= 5 && (
                            <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Filter size={16} className="text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-700">Cross-Tab Filters</span>
                                    {!isBusiness && (
                                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                                            Business
                                        </span>
                                    )}
                                    <HelpTooltip 
                                        content="Segment your data by specific answer choices to discover how different voter groups responded. Great for identifying patterns and correlations."
                                        position="right"
                                    />
                                </div>
                                {isBusiness ? (
                                    <CrossTabFilter 
                                        votes={votes}
                                        onFilteredVotesChange={setCrossTabFilteredVotes}
                                    />
                                ) : (
                                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                        <div className="flex items-center gap-3">
                                            <Lock size={20} className="text-amber-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-amber-800">Cross-tab filters are a Business feature</p>
                                                <p className="text-xs text-amber-600 mt-0.5">Filter results by specific answer choices to find patterns</p>
                                            </div>
                                            <button
                                                onClick={() => openUpgradeModal('crosstab')}
                                                className="ml-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs"
                                            >
                                                Upgrade
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Response Timeline - PAID */}
                        {votes.length > 0 && (
                            <CollapsibleSection
                                title="Response Timeline"
                                icon={<Activity size={20} />}
                                defaultOpen={true}
                                badge={
                                    <HelpTooltip 
                                        content="Visualize when votes came in over time. Identify peak engagement periods and measure the impact of your promotion efforts."
                                        position="left"
                                    />
                                }
                            >
                                <div className="pt-4">
                                    <ResponseTimelineChart
                                        votes={crossTabFilteredVotes.length > 0 ? crossTabFilteredVotes : votes}
                                        days={7}
                                        showTrend={true}
                                    />
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Analytics Grid */}
                        {votes.length >= 5 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Hourly Heatmap - BUSINESS ONLY */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                                            <Clock size={16} className="text-slate-500" />
                                            Hourly Activity
                                            {!isBusiness && (
                                                <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
                                                    Business
                                                </span>
                                            )}
                                        </h4>
                                        <HelpTooltip 
                                            content="Shows which hours of the day see the most engagement. Use this to optimize when you share polls for maximum participation."
                                            position="left"
                                        />
                                    </div>
                                    {isBusiness ? (
                                        <HourlyHeatmap votes={crossTabFilteredVotes.length > 0 ? crossTabFilteredVotes : votes} />
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex flex-col items-center justify-center p-4">
                                            <Lock size={24} className="text-amber-400 mb-2" />
                                            <p className="text-sm font-semibold text-amber-800 text-center">Hourly heatmap is a Business feature</p>
                                            <p className="text-xs text-amber-600 text-center mt-1">See exactly when your audience is most active</p>
                                            <button
                                                onClick={() => openUpgradeModal('heatmap')}
                                                className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs"
                                            >
                                                Upgrade to Business
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* Geographic Distribution - PRO+ */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                                            <MapPin size={16} className="text-slate-500" />
                                            Geographic Distribution
                                        </h4>
                                        <HelpTooltip 
                                            content="See where your voters are located. Based on IP address geolocation. Useful for understanding audience reach and regional preferences."
                                            position="left"
                                        />
                                    </div>
                                    <GeoChart votes={crossTabFilteredVotes.length > 0 ? crossTabFilteredVotes : votes} maxCountries={5} />
                                </div>
                                {/* Word Cloud - PRO+ */}
                                {results.comments && results.comments.length >= 3 && (
                                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-slate-500" />
                                                Comment Word Cloud
                                            </h4>
                                            <HelpTooltip 
                                                content="Visual representation of the most frequently used words in voter comments. Larger words appear more often. Great for spotting common themes."
                                                position="left"
                                            />
                                        </div>
                                        <CommentWordCloud comments={results.comments} maxWords={15} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-2xl p-12 text-center">
                                <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
                                <h3 className="font-bold text-slate-600 mb-2">Not Enough Data Yet</h3>
                                <p className="text-slate-500 text-sm">
                                    Detailed analytics will appear once you have at least 5 votes.
                                </p>
                            </div>
                        )}

                        {/* Bot Protection Stats */}
                        {(poll as any).blockedVotes?.total > 0 && (
                            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <ShieldAlert size={24} className="text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-amber-800 flex items-center gap-1">
                                            Bot Protection Active
                                            <HelpTooltip 
                                                content="Our system automatically detects and blocks suspicious voting patterns, VPNs, and known bot networks to ensure vote integrity."
                                                position="right"
                                            />
                                        </h4>
                                        <p className="text-sm text-amber-700">
                                            Blocked <span className="font-bold">{(poll as any).blockedVotes.total}</span> suspicious attempts
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================================================================ */}
            {/* MODALS */}
            {/* ================================================================ */}
            
            {/* QR Code Modal */}
            <AnimatePresence>
                {showQrModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowQrModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-800">Scan to Vote</h3>
                                <button 
                                    onClick={() => setShowQrModal(false)} 
                                    className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 flex justify-center mb-4">
                                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                            </div>
                            <button
                                onClick={handleDownloadQR}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Download QR Code
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Cards Modal */}
            <AnimatePresence>
                {showShareCards && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowShareCards(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <ShareCards
                                pollId={poll.id}
                                pollTitle={poll.title}
                                pollDescription={poll.description}
                                pollUrl={shareUrl}
                                onClose={() => setShowShareCards(false)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Embed Modal */}
            <EmbedModal
                poll={poll}
                isOpen={showEmbedModal}
                onClose={() => setShowEmbedModal(false)}
                isPremium={isPro}
                tier={tier as 'free' | 'pro' | 'business'}
                onUpgradeClick={() => {
                    setShowEmbedModal(false);
                    openUpgradeModal('branding');
                }}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => {
                    setShowUpgradeModal(false);
                    setUpgradeHighlight(undefined);
                }}
                currentTier={tier as 'free' | 'pro' | 'business'}
                highlightFeature={upgradeHighlight}
                source="poll_dashboard"
            />
        </div>
        
        {/* Footer */}
        <Footer />
        </>
    );
};

export default PollDashboard;
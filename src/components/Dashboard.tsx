import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, PieChart, Users, Clock, Plus, Copy, ExternalLink, 
  Download, Trash2, Archive, RotateCcw, QrCode, Link2, Code,
  Crown, Zap, TrendingUp, Calendar, Eye, EyeOff, Settings,
  ChevronDown, ChevronRight, Check, X, AlertCircle, Image,
  Share2, FileText, FileSpreadsheet, FileImage, Lock, Unlock,
  Bell, RefreshCw, MoreVertical, Edit, Sparkles, Globe,
  LayoutGrid, List, Filter, Search, ArrowUpRight, Shield,
  Palette, Webhook, Key, HelpCircle, LogOut, AlertTriangle,
  Mail, MapPin, Smartphone, Monitor, Tablet, DollarSign,
  Play, Pause, ClipboardCopy, CheckCircle2, XCircle, Loader2,
  MessageCircle, Home
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface PollData {
  id: string;
  adminKey: string;
  title: string;
  description?: string;
  pollType: string;
  options: { id: string; text: string; imageUrl?: string }[];
  settings: any;
  votes: any[];
  createdAt: string;
  voteCount: number;
  tier?: 'free' | 'quick_poll' | 'event_poll' | 'pro_monthly' | 'pro_yearly' | 'pro_plus_monthly' | 'pro_plus_yearly';
  maxResponses?: number;
  expiresAt?: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ============================================================================
// Tier Configuration
// ============================================================================

const TIER_CONFIG = {
  free: {
    name: 'Free',
    color: 'slate',
    badge: 'bg-slate-100 text-slate-700',
    icon: Users,
    maxResponsesPerPoll: 100,
    duration: 30,
    features: {
      exportCsv: false,
      exportPdf: false,
      exportPng: false,
      shareableImage: false,
      qrCode: true,
      passwordProtection: false,
      emailVerification: false,
      duplicatePoll: false,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      deviceBreakdown: false,
      geoBreakdown: false,
      emailNotifications: false,
      responseTopUp: false,
      teamViewers: 0,
    }
  },
  quick_poll: {
    name: 'Quick Poll',
    color: 'blue',
    badge: 'bg-blue-100 text-blue-700',
    icon: Zap,
    maxResponsesPerPoll: 500,
    duration: 7,
    features: {
      exportCsv: true,
      exportPdf: false,
      exportPng: false,
      shareableImage: true,
      qrCode: true,
      passwordProtection: false,
      emailVerification: false,
      duplicatePoll: true,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      deviceBreakdown: true,
      geoBreakdown: false,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 0,
    }
  },
  event_poll: {
    name: 'Event Poll',
    color: 'purple',
    badge: 'bg-purple-100 text-purple-700',
    icon: Calendar,
    maxResponsesPerPoll: 2000,
    duration: 30,
    features: {
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      passwordProtection: true,
      emailVerification: false,
      duplicatePoll: true,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      deviceBreakdown: true,
      geoBreakdown: true,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 0,
    }
  },
  pro_monthly: {
    name: 'Pro',
    color: 'indigo',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: Crown,
    maxResponsesPerPoll: 2000,
    duration: null,
    features: {
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 2,
    }
  },
  pro_yearly: {
    name: 'Pro',
    color: 'indigo',
    badge: 'bg-indigo-100 text-indigo-700',
    icon: Crown,
    maxResponsesPerPoll: 2000,
    duration: null,
    features: {
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 2,
    }
  },
  pro_plus_monthly: {
    name: 'Pro+',
    color: 'amber',
    badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700',
    icon: Sparkles,
    maxResponsesPerPoll: 5000,
    duration: null,
    features: {
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 10,
    }
  },
  pro_plus_yearly: {
    name: 'Pro+',
    color: 'amber',
    badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700',
    icon: Sparkles,
    maxResponsesPerPoll: 5000,
    duration: null,
    features: {
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      deviceBreakdown: true,
      geoBreakdown: true,
      emailNotifications: true,
      responseTopUp: true,
      teamViewers: 10,
    }
  },
};

type TierType = keyof typeof TIER_CONFIG;

// ============================================================================
// Poll Type Labels & Icons
// ============================================================================

const POLL_TYPE_LABELS: Record<string, string> = {
  'multiple': 'Multiple Choice',
  'ranked': 'Ranked Choice',
  'meeting': 'Meeting Poll',
  'image': 'Visual Poll',
  'multiple_choice': 'Multiple Choice',
  'ranked_choice': 'Ranked Choice',
  'meeting_poll': 'Meeting Poll',
  'dot_voting': 'Dot Voting',
  'rating_scale': 'Rating Scale',
};

const POLL_TYPE_ICONS: Record<string, string> = {
  'multiple': '☑️',
  'ranked': '🏆',
  'meeting': '📅',
  'image': '🖼️',
  'multiple_choice': '☑️',
  'ranked_choice': '🏆',
  'meeting_poll': '📅',
  'dot_voting': '🔴',
  'rating_scale': '⭐',
};

// ============================================================================
// Helper Functions
// ============================================================================

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// Toast Component
// ============================================================================

const ToastNotification: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    warning: <AlertCircle size={18} className="text-amber-500" />,
    info: <AlertCircle size={18} className="text-blue-500" />,
  };

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center gap-3 min-w-[280px]"
    >
      {icons[toast.type]}
      <span className="text-sm text-slate-700 flex-1">{toast.message}</span>
      <button onClick={onDismiss} className="p-1 hover:bg-slate-100 rounded">
        <X size={14} className="text-slate-400" />
      </button>
    </motion.div>
  );
};

// ============================================================================
// Feature Lock Button Component
// ============================================================================

interface FeatureLockButtonProps {
  feature: string;
  features: typeof TIER_CONFIG.free.features;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  showToast: (type: 'info', message: string) => void;
}

const FeatureLockButton: React.FC<FeatureLockButtonProps> = ({
  feature,
  features,
  onClick,
  children,
  className = '',
  showToast
}) => {
  const isLocked = !features[feature as keyof typeof features];

  const handleClick = () => {
    if (isLocked) {
      showToast('info', 'Upgrade your plan to unlock this feature');
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative ${className} ${isLocked ? 'opacity-60' : ''}`}
    >
      {children}
      {isLocked && (
        <Lock size={12} className="absolute -top-1 -right-1 text-amber-500 bg-white rounded-full p-0.5 shadow" />
      )}
    </button>
  );
};

// ============================================================================
// Main Dashboard Component
// ============================================================================

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [tier, setTier] = useState<TierType>('free');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Toast helpers
  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Parse hash and fetch poll data
  useEffect(() => {
    const fetchPollData = async () => {
      try {
        // Parse hash: #id=xxx&admin=yyy
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const pollId = params.get('id');
        const adminKey = params.get('admin');

        if (!pollId || !adminKey) {
          showToast('error', 'Invalid admin link');
          setLoading(false);
          return;
        }

        // Fetch poll data
        const response = await fetch(`/.netlify/functions/vg-get?id=${pollId}&admin=${adminKey}`);
        
        if (response.ok) {
          const data = await response.json();
          setPoll(data);
          
          // Determine tier from poll metadata or default to free
          const pollTier = data.tier || 'free';
          setTier(pollTier as TierType);
        } else {
          showToast('error', 'Failed to load poll');
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
        showToast('error', 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, [showToast]);

  // Get tier config
  const config = TIER_CONFIG[tier];
  const features = config.features;
  const TierIcon = config.icon;

  // Handle copy links
  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedLink(type);
      showToast('success', `${type} link copied!`);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  // Export handlers
  const handleExport = (format: 'csv' | 'pdf' | 'png') => {
    if (format === 'csv' && !features.exportCsv) {
      showToast('info', 'Upgrade to export CSV');
      return;
    }
    if (format === 'pdf' && !features.exportPdf) {
      showToast('info', 'Upgrade to export PDF');
      return;
    }
    if (format === 'png' && !features.exportPng) {
      showToast('info', 'Upgrade to export PNG');
      return;
    }
    // Actual export logic would go here
    showToast('success', `Exporting ${format.toUpperCase()}...`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your poll...</p>
        </div>
      </div>
    );
  }

  // No poll found
  if (!poll) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Poll not found</h2>
          <p className="text-slate-600 mb-4">The poll you're looking for doesn't exist or you don't have access.</p>
          <a href="/" className="text-indigo-600 hover:underline">Go back home</a>
        </div>
      </div>
    );
  }

  const voteUrl = `${window.location.origin}/#vote=${poll.id}`;
  const adminUrl = `${window.location.origin}/#id=${poll.id}&admin=${poll.adminKey}`;
  const maxResponses = config.maxResponsesPerPoll;
  const usagePercent = (poll.voteCount / maxResponses) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastNotification key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <Home size={20} className="text-slate-400" />
              <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
            </a>
            
            {/* Tier Badge */}
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${config.badge}`}>
              <TierIcon size={14} />
              {config.name}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BarChart3 size={28} className="text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Manage your poll and view results</p>
        </div>

        {/* Admin Key Warning */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Key size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800">Private Admin Key</h3>
                <p className="text-sm text-amber-600">Save this URL! It's the only way to manage this poll.</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(adminUrl, 'Admin')}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium flex items-center gap-2"
            >
              {copiedLink === 'Admin' ? <Check size={16} /> : <Copy size={16} />}
              Copy Admin Link
            </button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Share Poll */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Share2 size={18} className="text-indigo-600" />
              Share Poll
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <Globe size={16} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={voteUrl}
                  className="flex-1 bg-transparent text-sm text-slate-600 outline-none min-w-0"
                />
              </div>
              <button
                onClick={() => handleCopy(voteUrl, 'Vote')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex-shrink-0"
              >
                {copiedLink === 'Vote' ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(voteUrl)}`, '_blank')}
                className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-center gap-2 font-medium"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button
                onClick={() => window.open(`sms:?body=${encodeURIComponent(voteUrl)}`, '_blank')}
                className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2 font-medium"
              >
                <Smartphone size={18} />
                SMS
              </button>
              <button
                onClick={() => window.open(`mailto:?subject=Vote on this poll&body=${encodeURIComponent(voteUrl)}`, '_blank')}
                className="p-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 font-medium"
              >
                <Mail size={18} />
                Email
              </button>
              <button
                onClick={() => setShowQRModal(true)}
                className="p-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2 font-medium"
              >
                <QrCode size={18} />
                QR Code
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Settings size={18} className="text-indigo-600" />
              Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              
              <FeatureLockButton
                feature="exportCsv"
                features={features}
                onClick={() => handleExport('csv')}
                showToast={showToast}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={16} />
                CSV
              </FeatureLockButton>

              <FeatureLockButton
                feature="exportPdf"
                features={features}
                onClick={() => handleExport('pdf')}
                showToast={showToast}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 col-span-2"
              >
                <FileText size={16} />
                Download PDF
              </FeatureLockButton>

              <FeatureLockButton
                feature="exportPng"
                features={features}
                onClick={() => handleExport('png')}
                showToast={showToast}
                className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 col-span-2"
              >
                <FileImage size={16} />
                Download PNG
              </FeatureLockButton>
            </div>
          </div>
        </div>

        {/* Poll Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Poll Settings</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              poll.pollType === 'ranked' ? 'bg-purple-100 text-purple-700' :
              poll.pollType === 'meeting' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {POLL_TYPE_ICONS[poll.pollType]} {POLL_TYPE_LABELS[poll.pollType] || poll.pollType}
            </span>
          </div>

          {/* Poll Title */}
          <div className="text-center py-6 border-b border-slate-100">
            <h2 className="text-3xl font-bold text-slate-800 font-serif">{poll.title}</h2>
            {poll.description && (
              <p className="text-slate-500 mt-2">{poll.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="py-6">
            {poll.voteCount > 0 ? (
              <div className="space-y-4">
                {/* Usage Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">{poll.voteCount} of {maxResponses} responses</span>
                    <span className={`font-medium ${
                      usagePercent >= 100 ? 'text-red-600' :
                      usagePercent >= 80 ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {usagePercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usagePercent >= 100 ? 'bg-red-500' :
                        usagePercent >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Results placeholder - would show actual results here */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-center text-slate-500">Results visualization coming soon...</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={40} className="text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700 mb-1">No votes yet</h3>
                <p className="text-slate-500 text-sm">Share the link to get started!</p>
              </div>
            )}
          </div>

          {/* Edit Poll Settings */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-slate-600"
            >
              <Settings size={16} />
              Edit Poll Settings
            </button>
          </div>
        </div>

        {/* Upgrade Banner - Only show for free tier */}
        {tier === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles size={20} />
                  Unlock More Features
                </h3>
                <p className="text-indigo-100 mt-1">
                  Export data, add logos, custom links, and more starting at $5
                </p>
              </div>
              <a
                href="/pricing.html"
                className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center gap-2"
              >
                View Plans
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        )}

        {/* Premium Features Row - Only show for paid tiers */}
        {tier !== 'free' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <FeatureLockButton
              feature="customShortLink"
              features={features}
              onClick={() => showToast('info', 'Custom link settings coming soon')}
              showToast={showToast}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex flex-col items-center gap-2 text-center"
            >
              <Link2 size={22} className="text-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Custom Link</span>
            </FeatureLockButton>

            <FeatureLockButton
              feature="uploadLogo"
              features={features}
              onClick={() => showToast('info', 'Logo upload coming soon')}
              showToast={showToast}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex flex-col items-center gap-2 text-center"
            >
              <Image size={22} className="text-purple-500" />
              <span className="text-sm font-medium text-slate-700">Upload Logo</span>
            </FeatureLockButton>

            <FeatureLockButton
              feature="emailNotifications"
              features={features}
              onClick={() => showToast('info', 'Notification settings coming soon')}
              showToast={showToast}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex flex-col items-center gap-2 text-center"
            >
              <Bell size={22} className="text-amber-500" />
              <span className="text-sm font-medium text-slate-700">Notifications</span>
            </FeatureLockButton>

            <FeatureLockButton
              feature="passwordProtection"
              features={features}
              onClick={() => showToast('info', 'Password protection coming soon')}
              showToast={showToast}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex flex-col items-center gap-2 text-center"
            >
              <Lock size={22} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Password</span>
            </FeatureLockButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
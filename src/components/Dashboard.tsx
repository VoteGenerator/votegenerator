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
  Play, Pause, ClipboardCopy, CheckCircle2, XCircle, Loader2
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface PollSummary {
  id: string;
  question: string;
  type: string;
  status: 'active' | 'closed' | 'draft' | 'archived' | 'scheduled';
  createdAt: string;
  totalVotes: number;
  maxResponses: number;
  expiresAt?: string;
  scheduledFor?: string;
  voteUrl: string;
  adminUrl: string;
  adminToken: string;
  shortLink?: string;
  hasLogo?: boolean;
  hasPassword?: boolean;
  requiresVerification?: boolean;
  deviceBreakdown?: { mobile: number; desktop: number; tablet: number };
  geoBreakdown?: Record<string, number>;
}

interface UserPlan {
  tier: 'free' | 'quick_poll' | 'event_poll' | 'pro_monthly' | 'pro_yearly' | 'pro_plus_monthly' | 'pro_plus_yearly';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  maxResponsesPerPoll: number;
  monthlyResponseCap: number | null;
  monthlyResponsesUsed: number;
  pollsCreated: number;
  maxPolls: number | 'unlimited';
  purchaseType: 'one_time' | 'subscription';
  expiresAt?: string;
  renewsAt?: string;
  email?: string;
}

interface DashboardProps {
  sessionId?: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ============================================================================
// Tier Configuration - CORRECTED
// ============================================================================

const TIER_CONFIG = {
  free: {
    name: 'Free',
    color: 'slate',
    icon: Users,
    maxResponsesPerPoll: 100,
    monthlyResponseCap: null,
    maxPolls: 'unlimited' as const,
    duration: 30, // days
    pollTypes: ['multiple_choice', 'ranked_choice', 'this_or_that'],
    features: {
      dashboard: false,
      exportCsv: false,
      exportPdf: false,
      exportPng: false,
      shareableImage: false,
      qrCode: true,
      pollTemplates: false,
      pollScheduling: false,
      passwordProtection: false,
      emailVerification: false,
      duplicatePoll: false,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      realTimeAnimation: true,
      deviceBreakdown: false,
      geoBreakdown: false,
      resultsComparison: false,
      emailNotifications: false,
      responseTopUp: false,
      recoverLink: false,
      teamViewers: 0,
      embedWhiteLabel: false,
      webhooks: false,
      apiAccess: false,
      dataRetentionDays: 30,
    }
  },
  quick_poll: {
    name: 'Quick Poll',
    color: 'blue',
    icon: Zap,
    maxResponsesPerPoll: 500,
    monthlyResponseCap: null,
    maxPolls: 1,
    duration: 7,
    pollTypes: ['multiple_choice', 'ranked_choice', 'this_or_that', 'meeting_poll', 'dot_voting', 'rating_scale', 'buy_a_feature', 'priority_matrix', 'approval_voting'],
    features: {
      dashboard: false,
      exportCsv: true,
      exportPdf: false,
      exportPng: false,
      shareableImage: true,
      qrCode: true,
      pollTemplates: false,
      pollScheduling: false,
      passwordProtection: false,
      emailVerification: false,
      duplicatePoll: true,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: false,
      resultsComparison: false,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 0,
      embedWhiteLabel: false,
      webhooks: false,
      apiAccess: false,
      dataRetentionDays: 90,
    }
  },
  event_poll: {
    name: 'Event Poll',
    color: 'purple',
    icon: Calendar,
    maxResponsesPerPoll: 2000,
    monthlyResponseCap: null,
    maxPolls: 1,
    duration: 30,
    pollTypes: ['multiple_choice', 'ranked_choice', 'this_or_that', 'meeting_poll', 'dot_voting', 'rating_scale', 'buy_a_feature', 'priority_matrix', 'approval_voting', 'quiz_poll', 'sentiment_check'],
    features: {
      dashboard: false,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      pollTemplates: false,
      pollScheduling: true,
      passwordProtection: true,
      emailVerification: false,
      duplicatePoll: true,
      customShortLink: false,
      uploadLogo: false,
      removeBranding: false,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: 'country',
      resultsComparison: false,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 0,
      embedWhiteLabel: false,
      webhooks: false,
      apiAccess: false,
      dataRetentionDays: 90,
    }
  },
  pro_monthly: {
    name: 'Pro',
    color: 'indigo',
    icon: Crown,
    maxResponsesPerPoll: 2000,
    monthlyResponseCap: 10000,
    maxPolls: 'unlimited' as const,
    duration: null, // unlimited
    pollTypes: 'all',
    features: {
      dashboard: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      pollTemplates: true,
      pollScheduling: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: 'country_region',
      resultsComparison: true,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 2,
      embedWhiteLabel: false,
      webhooks: false,
      apiAccess: false,
      dataRetentionDays: 365,
    }
  },
  pro_yearly: {
    name: 'Pro (Annual)',
    color: 'indigo',
    icon: Crown,
    maxResponsesPerPoll: 2000,
    monthlyResponseCap: 10000,
    maxPolls: 'unlimited' as const,
    duration: null,
    pollTypes: 'all',
    features: {
      dashboard: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      pollTemplates: true,
      pollScheduling: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: 'country_region',
      resultsComparison: true,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 2,
      embedWhiteLabel: false,
      webhooks: false,
      apiAccess: false,
      dataRetentionDays: 365,
    }
  },
  pro_plus_monthly: {
    name: 'Pro+',
    color: 'amber',
    icon: Sparkles,
    maxResponsesPerPoll: 5000,
    monthlyResponseCap: 50000,
    maxPolls: 'unlimited' as const,
    duration: null,
    pollTypes: 'all',
    features: {
      dashboard: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      pollTemplates: true,
      pollScheduling: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: 'country_region',
      resultsComparison: true,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 10,
      embedWhiteLabel: true,
      webhooks: true,
      apiAccess: true,
      dataRetentionDays: 730, // 2 years
    }
  },
  pro_plus_yearly: {
    name: 'Pro+ (Annual)',
    color: 'amber',
    icon: Sparkles,
    maxResponsesPerPoll: 5000,
    monthlyResponseCap: 50000,
    maxPolls: 'unlimited' as const,
    duration: null,
    pollTypes: 'all',
    features: {
      dashboard: true,
      exportCsv: true,
      exportPdf: true,
      exportPng: true,
      shareableImage: true,
      qrCode: true,
      pollTemplates: true,
      pollScheduling: true,
      passwordProtection: true,
      emailVerification: true,
      duplicatePoll: true,
      customShortLink: true,
      uploadLogo: true,
      removeBranding: true,
      realTimeAnimation: true,
      deviceBreakdown: true,
      geoBreakdown: 'country_region',
      resultsComparison: true,
      emailNotifications: true,
      responseTopUp: true,
      recoverLink: true,
      teamViewers: 10,
      embedWhiteLabel: true,
      webhooks: true,
      apiAccess: true,
      dataRetentionDays: 730,
    }
  },
};

const POLL_TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  ranked_choice: 'Ranked Choice',
  this_or_that: 'This or That',
  meeting_poll: 'Meeting Poll',
  dot_voting: 'Dot Voting',
  rating_scale: 'Rating Scale',
  buy_a_feature: 'Buy a Feature',
  priority_matrix: 'Priority Matrix',
  approval_voting: 'Approval Voting',
  quiz_poll: 'Quiz Poll',
  sentiment_check: 'Sentiment Check',
  visual_poll: 'Visual Poll',
  word_cloud: 'Word Cloud',
  nps: 'NPS Score',
};

const POLL_TYPE_ICONS: Record<string, string> = {
  multiple_choice: '☑️',
  ranked_choice: '📊',
  this_or_that: '⚖️',
  meeting_poll: '📅',
  dot_voting: '🔵',
  rating_scale: '⭐',
  buy_a_feature: '💰',
  priority_matrix: '📋',
  approval_voting: '👍',
  quiz_poll: '❓',
  sentiment_check: '😊',
  visual_poll: '🖼️',
  word_cloud: '☁️',
  nps: '📈',
};

// ============================================================================
// Helper Functions
// ============================================================================

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

const getDaysRemaining = (expiresAt?: string) => {
  if (!expiresAt) return null;
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const getUsageLevel = (percent: number): 'normal' | 'warning' | 'critical' | 'exceeded' => {
  if (percent >= 100) return 'exceeded';
  if (percent >= 90) return 'critical';
  if (percent >= 80) return 'warning';
  return 'normal';
};

// ============================================================================
// Sub-Components
// ============================================================================

// Toast Notification Component
const ToastNotification: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />,
    info: <Bell className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium text-slate-700">{toast.message}</span>
      <button onClick={onDismiss} className="ml-2 text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Usage Warning Banner
const UsageWarningBanner: React.FC<{ 
  type: 'poll' | 'monthly';
  current: number;
  max: number;
  onTopUp?: () => void;
  onUpgrade?: () => void;
}> = ({ type, current, max, onTopUp, onUpgrade }) => {
  const percent = (current / max) * 100;
  const level = getUsageLevel(percent);

  if (level === 'normal') return null;

  const messages = {
    warning: type === 'poll' 
      ? `This poll is at ${percent.toFixed(0)}% capacity (${current}/${max} responses)`
      : `You've used ${percent.toFixed(0)}% of your monthly responses (${current.toLocaleString()}/${max.toLocaleString()})`,
    critical: type === 'poll'
      ? `⚠️ Only ${max - current} responses left on this poll!`
      : `⚠️ Only ${(max - current).toLocaleString()} monthly responses remaining!`,
    exceeded: type === 'poll'
      ? `🚫 This poll has reached its response limit`
      : `🚫 Monthly response limit reached`,
  };

  const bgColors = {
    warning: 'bg-amber-50 border-amber-300',
    critical: 'bg-orange-50 border-orange-300',
    exceeded: 'bg-red-50 border-red-300',
  };

  const textColors = {
    warning: 'text-amber-800',
    critical: 'text-orange-800',
    exceeded: 'text-red-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`rounded-xl border-2 p-4 mb-4 ${bgColors[level]}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className={textColors[level]} size={20} />
          <span className={`font-medium ${textColors[level]}`}>{messages[level]}</span>
        </div>
        <div className="flex items-center gap-2">
          {level !== 'exceeded' && onTopUp && (
            <button
              onClick={onTopUp}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-1"
            >
              <Plus size={14} />
              Add Responses
            </button>
          )}
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <Crown size={14} />
              Upgrade
            </button>
          )}
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            level === 'exceeded' ? 'bg-red-500' : level === 'critical' ? 'bg-orange-500' : 'bg-amber-500'
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </motion.div>
  );
};

// Plan Status Card - Updated with correct structure
const PlanStatusCard: React.FC<{ 
  plan: UserPlan; 
  onUpgrade: () => void;
  onManageBilling: () => void;
}> = ({ plan, onUpgrade, onManageBilling }) => {
  const config = TIER_CONFIG[plan.tier];
  const TierIcon = config.icon;
  const daysRemaining = getDaysRemaining(plan.expiresAt);
  const isProTier = plan.tier.includes('pro');
  const hasMonthlyLimit = plan.monthlyResponseCap !== null;

  const colorClasses: Record<string, { bg: string; text: string; border: string; progress: string }> = {
    slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', progress: 'bg-slate-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', progress: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', progress: 'bg-purple-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', progress: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', progress: 'bg-amber-500' },
  };

  const colors = colorClasses[config.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
            <TierIcon className={colors.text} size={24} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${colors.text}`}>{config.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm capitalize ${plan.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {plan.status}
              </span>
              {plan.purchaseType === 'one_time' && (
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">One-time</span>
              )}
            </div>
          </div>
        </div>
        {!isProTier ? (
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Crown size={16} />
            Upgrade
          </button>
        ) : (
          <button
            onClick={onManageBilling}
            className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            Manage Billing
          </button>
        )}
      </div>

      {/* Expiration Warning for one-time purchases */}
      {daysRemaining !== null && daysRemaining <= 7 && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          daysRemaining <= 0 ? 'bg-red-100 border border-red-300' : 
          daysRemaining <= 3 ? 'bg-orange-100 border border-orange-300' : 
          'bg-amber-100 border border-amber-300'
        }`}>
          <AlertCircle className={daysRemaining <= 0 ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-amber-600'} size={18} />
          <span className={`text-sm font-medium ${daysRemaining <= 0 ? 'text-red-800' : daysRemaining <= 3 ? 'text-orange-800' : 'text-amber-800'}`}>
            {daysRemaining <= 0 ? 'Plan expired' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`}
          </span>
        </div>
      )}

      {/* Usage Stats */}
      <div className="space-y-4">
        {/* Monthly Usage (for Pro tiers) */}
        {hasMonthlyLimit && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Monthly Responses</span>
              <span className="font-medium text-slate-800">
                {plan.monthlyResponsesUsed.toLocaleString()} / {plan.monthlyResponseCap!.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  getUsageLevel((plan.monthlyResponsesUsed / plan.monthlyResponseCap!) * 100) === 'exceeded' ? 'bg-red-500' :
                  getUsageLevel((plan.monthlyResponsesUsed / plan.monthlyResponseCap!) * 100) === 'critical' ? 'bg-orange-500' :
                  getUsageLevel((plan.monthlyResponsesUsed / plan.monthlyResponseCap!) * 100) === 'warning' ? 'bg-amber-500' :
                  colors.progress
                }`}
                style={{ width: `${Math.min((plan.monthlyResponsesUsed / plan.monthlyResponseCap!) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Per-Poll Limit Info */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <span className="text-slate-600">Max Responses/Poll</span>
          <span className="font-medium text-slate-800">{config.maxResponsesPerPoll.toLocaleString()}</span>
        </div>

        {/* Active Polls */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <span className="text-slate-600">Active Polls</span>
          <span className="font-medium text-slate-800">
            {plan.pollsCreated} {config.maxPolls !== 'unlimited' && `/ ${config.maxPolls}`}
          </span>
        </div>

        {/* Duration */}
        {config.duration && (
          <div className="flex items-center justify-between py-2 border-t border-slate-200">
            <span className="text-slate-600">Poll Duration</span>
            <span className="font-medium text-slate-800">{config.duration} days</span>
          </div>
        )}

        {/* Renewal/Expiry */}
        {plan.renewsAt && (
          <div className="flex items-center justify-between py-2 border-t border-slate-200">
            <span className="text-slate-600">Renews</span>
            <span className="font-medium text-slate-800">{formatDate(plan.renewsAt)}</span>
          </div>
        )}
        {plan.expiresAt && !plan.renewsAt && (
          <div className="flex items-center justify-between py-2 border-t border-slate-200">
            <span className="text-slate-600">Expires</span>
            <span className={`font-medium ${daysRemaining && daysRemaining <= 3 ? 'text-red-600' : 'text-slate-800'}`}>
              {formatDate(plan.expiresAt)}
            </span>
          </div>
        )}

        {/* Data Retention */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200">
          <span className="text-slate-600">Data Retention</span>
          <span className="font-medium text-slate-800">
            {config.features.dataRetentionDays >= 365 
              ? `${Math.floor(config.features.dataRetentionDays / 365)} year${config.features.dataRetentionDays >= 730 ? 's' : ''}`
              : `${config.features.dataRetentionDays} days`
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Quick Stats Row
const QuickStats: React.FC<{ 
  stats: { totalVotes: number; activePolls: number; totalPolls: number };
  plan: UserPlan;
}> = ({ stats, plan }) => {
  const config = TIER_CONFIG[plan.tier];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
          <Users className="text-indigo-600" size={20} />
        </div>
        <p className="text-2xl font-bold text-slate-800">{stats.totalVotes.toLocaleString()}</p>
        <p className="text-sm text-slate-500">Total Responses</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
          <BarChart3 className="text-emerald-600" size={20} />
        </div>
        <p className="text-2xl font-bold text-slate-800">{stats.activePolls}</p>
        <p className="text-sm text-slate-500">Active Polls</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
          <Calendar className="text-purple-600" size={20} />
        </div>
        <p className="text-2xl font-bold text-slate-800">
          {config.features.dataRetentionDays >= 365 
            ? `${Math.floor(config.features.dataRetentionDays / 365)}yr`
            : `${config.features.dataRetentionDays}d`
          }
        </p>
        <p className="text-sm text-slate-500">Data Retention</p>
      </motion.div>
    </div>
  );
};

// Response Top-Up Modal
const TopUpModal: React.FC<{
  pollId: string;
  currentResponses: number;
  maxResponses: number;
  tier: string;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}> = ({ pollId, currentResponses, maxResponses, tier, onClose, onPurchase }) => {
  const [selectedOption, setSelectedOption] = useState<number>(500);
  const [loading, setLoading] = useState(false);

  const topUpOptions = tier.includes('pro') 
    ? [
        { amount: 2000, price: 5 },
        { amount: 5000, price: 10 },
        { amount: 10000, price: 18 },
      ]
    : [
        { amount: 500, price: 3 },
        { amount: 1000, price: 5 },
        { amount: 2000, price: 8 },
      ];

  const handlePurchase = async () => {
    setLoading(true);
    await onPurchase(selectedOption);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800">Add More Responses</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Current Usage</span>
            <span className="font-medium">{currentResponses} / {maxResponses}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${(currentResponses / maxResponses) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {topUpOptions.map(option => (
            <button
              key={option.amount}
              onClick={() => setSelectedOption(option.amount)}
              className={`w-full p-4 rounded-xl border-2 transition flex items-center justify-between ${
                selectedOption === option.amount
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.amount ? 'border-indigo-500' : 'border-slate-300'
                }`}>
                  {selectedOption === option.amount && (
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  )}
                </div>
                <span className="font-medium text-slate-800">+{option.amount.toLocaleString()} responses</span>
              </div>
              <span className="font-bold text-indigo-600">${option.price}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <DollarSign size={18} />
                Purchase
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Poll Card Component - Updated
const PollCard: React.FC<{
  poll: PollSummary;
  tier: string;
  onView: () => void;
  onCopyVoteLink: () => void;
  onCopyAdminLink: () => void;
  onExport: (format: 'csv' | 'pdf' | 'png') => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onGenerateQR: () => void;
  onEditShortLink: () => void;
  onGetEmbed: () => void;
  onTopUp: () => void;
  onShareImage: () => void;
  showToast: (type: Toast['type'], message: string) => void;
}> = ({ 
  poll, tier, onView, onCopyVoteLink, onCopyAdminLink, 
  onExport, onDuplicate, onArchive, onDelete, onGenerateQR,
  onEditShortLink, onGetEmbed, onTopUp, onShareImage, showToast
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  const features = config?.features || TIER_CONFIG.free.features;

  const statusConfig = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: Play },
    closed: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: Pause },
    draft: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: Edit },
    archived: { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', icon: Archive },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  };

  const status = statusConfig[poll.status];
  const StatusIcon = status.icon;

  const handleCopy = async (text: string, type: string) => {
    await copyToClipboard(text);
    setCopiedLink(type);
    showToast('success', `${type === 'vote' ? 'Vote' : 'Admin'} link copied!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const usagePercent = (poll.totalVotes / poll.maxResponses) * 100;
  const usageLevel = getUsageLevel(usagePercent);
  const daysRemaining = getDaysRemaining(poll.expiresAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Usage Warning */}
      {usageLevel !== 'normal' && (
        <div className={`px-4 py-2 flex items-center gap-2 text-sm font-medium ${
          usageLevel === 'exceeded' ? 'bg-red-100 text-red-700' :
          usageLevel === 'critical' ? 'bg-orange-100 text-orange-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          <AlertTriangle size={14} />
          {usageLevel === 'exceeded' ? 'Response limit reached' :
           usageLevel === 'critical' ? `Only ${poll.maxResponses - poll.totalVotes} responses left!` :
           `${usagePercent.toFixed(0)}% of responses used`}
          {features.responseTopUp && usageLevel !== 'exceeded' && (
            <button onClick={onTopUp} className="ml-auto text-xs underline hover:no-underline">
              Add more
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{POLL_TYPE_ICONS[poll.type] || '📊'}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{poll.question}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-slate-500">{POLL_TYPE_LABELS[poll.type]}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{formatTimeAgo(poll.createdAt)}</span>
                {poll.hasPassword && (
                  <>
                    <span className="text-slate-300">•</span>
                    <Lock size={12} className="text-slate-400" />
                  </>
                )}
                {poll.requiresVerification && (
                  <>
                    <span className="text-slate-300">•</span>
                    <Shield size={12} className="text-slate-400" />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${status.bg} ${status.text} ${status.border}`}>
              <StatusIcon size={12} />
              {poll.status}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <MoreVertical size={18} className="text-slate-400" />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                    >
                      {features.duplicatePoll && (
                        <button
                          onClick={() => { onDuplicate(); setShowMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Copy size={16} className="text-slate-400" />
                          Duplicate
                        </button>
                      )}
                      <button
                        onClick={() => { onArchive(); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Archive size={16} className="text-slate-400" />
                        {poll.status === 'archived' ? 'Unarchive' : 'Archive'}
                      </button>
                      <hr className="border-slate-100" />
                      <button
                        onClick={() => { onDelete(); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{poll.totalVotes.toLocaleString()} responses</span>
            </div>
            {daysRemaining !== null && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span className={`text-sm font-medium ${daysRemaining <= 3 ? 'text-amber-600' : 'text-slate-700'}`}>
                  {daysRemaining <= 0 ? 'Expired' : `${daysRemaining}d left`}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500">
            {usagePercent.toFixed(0)}% of {poll.maxResponses.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              usageLevel === 'exceeded' ? 'bg-red-500' : 
              usageLevel === 'critical' ? 'bg-orange-500' : 
              usageLevel === 'warning' ? 'bg-amber-500' : 
              'bg-indigo-500'
            }`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>

        {/* Device & Geo breakdown (if available) */}
        {features.deviceBreakdown && poll.deviceBreakdown && (
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Smartphone size={12} />
              <span>{poll.deviceBreakdown.mobile}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor size={12} />
              <span>{poll.deviceBreakdown.desktop}%</span>
            </div>
            {poll.deviceBreakdown.tablet > 0 && (
              <div className="flex items-center gap-1">
                <Tablet size={12} />
                <span>{poll.deviceBreakdown.tablet}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Links Section */}
      <div className="p-5 space-y-3">
        {/* Vote Link */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-lg px-3 py-2 flex items-center gap-2 overflow-hidden">
            <Link2 size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-600 truncate">
              {poll.shortLink || poll.voteUrl}
            </span>
          </div>
          <button
            onClick={() => handleCopy(poll.shortLink || poll.voteUrl, 'vote')}
            className={`p-2 rounded-lg transition ${copiedLink === 'vote' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            title="Copy vote link"
          >
            {copiedLink === 'vote' ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={onGenerateQR}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-slate-600"
            title="QR Code"
          >
            <QrCode size={16} />
          </button>
        </div>

        {/* Admin Link */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-indigo-50 rounded-lg px-3 py-2 flex items-center gap-2 overflow-hidden">
            <Shield size={14} className="text-indigo-400 flex-shrink-0" />
            <span className="text-sm text-indigo-600 truncate">Admin Link (share with co-admins)</span>
          </div>
          <button
            onClick={() => handleCopy(poll.adminUrl, 'admin')}
            className={`p-2 rounded-lg transition ${copiedLink === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'}`}
            title="Copy admin link"
          >
            {copiedLink === 'admin' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {/* Custom Short Link */}
        {features.customShortLink ? (
          <button
            onClick={onEditShortLink}
            className="w-full p-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center justify-center gap-2"
          >
            <Link2 size={14} />
            {poll.shortLink ? 'Edit Custom Link' : 'Create Custom Short Link'}
          </button>
        ) : null}
      </div>

      {/* Actions Footer */}
      <div className="px-5 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Export Dropdown */}
          <div className="relative group/export">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500 flex items-center gap-1">
              <Download size={16} />
              <ChevronDown size={14} />
            </button>
            <div className="absolute bottom-full left-0 mb-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50 overflow-hidden">
              <button
                onClick={() => features.exportCsv ? onExport('csv') : showToast('info', 'Upgrade to export CSV')}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${features.exportCsv ? 'hover:bg-slate-50' : 'opacity-50'}`}
              >
                <FileSpreadsheet size={16} className="text-emerald-500" />
                Export CSV {!features.exportCsv && <Lock size={12} className="ml-auto text-slate-400" />}
              </button>
              <button
                onClick={() => features.exportPdf ? onExport('pdf') : showToast('info', 'Upgrade to export PDF')}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${features.exportPdf ? 'hover:bg-slate-50' : 'opacity-50'}`}
              >
                <FileText size={16} className="text-red-500" />
                Export PDF {!features.exportPdf && <Lock size={12} className="ml-auto text-slate-400" />}
              </button>
              <button
                onClick={() => features.exportPng ? onExport('png') : showToast('info', 'Upgrade to export PNG')}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${features.exportPng ? 'hover:bg-slate-50' : 'opacity-50'}`}
              >
                <FileImage size={16} className="text-blue-500" />
                Export PNG {!features.exportPng && <Lock size={12} className="ml-auto text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Share Image */}
          {features.shareableImage && (
            <button
              onClick={onShareImage}
              className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
              title="Share result image"
            >
              <Image size={16} />
            </button>
          )}

          {/* Embed Code */}
          <button
            onClick={onGetEmbed}
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
            title="Get embed code"
          >
            <Code size={16} />
          </button>

          {/* External Link */}
          <a
            href={poll.voteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
            title="Open poll"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <button
          onClick={onView}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          View Results
          <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Empty State
const EmptyState: React.FC<{ onCreatePoll: () => void }> = ({ onCreatePoll }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <BarChart3 size={32} className="text-indigo-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">No polls yet</h3>
    <p className="text-slate-500 mb-6 max-w-md mx-auto">
      Create your first poll to start collecting responses and seeing results.
    </p>
    <button
      onClick={onCreatePoll}
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition inline-flex items-center gap-2"
    >
      <Plus size={20} />
      Create Your First Poll
    </button>
  </motion.div>
);

// ============================================================================
// Main Dashboard Component
// ============================================================================

const Dashboard: React.FC<DashboardProps> = ({ sessionId }) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolls, setSelectedPolls] = useState<Set<string>>(new Set());
  const [showTopUpModal, setShowTopUpModal] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast handler
  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        window.location.href = '/create';
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape') {
        setSelectedPolls(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const sid = sessionId || localStorage.getItem('vg_session');
        
        if (sid) {
          const response = await fetch(`/api/dashboard?session_id=${sid}`);
          if (response.ok) {
            const data = await response.json();
            setPlan(data.user);
            setPolls(data.polls);
          }
        }
        
        // Fall back to mock data for demo
        if (!plan) {
          setPlan({
            tier: 'pro_monthly',
            status: 'active',
            maxResponsesPerPoll: 2000,
            monthlyResponseCap: 10000,
            monthlyResponsesUsed: 3847,
            pollsCreated: 5,
            maxPolls: 'unlimited',
            purchaseType: 'subscription',
            renewsAt: '2026-01-16',
            email: 'demo@example.com',
          });

          setPolls([
            {
              id: 'poll_1',
              question: 'What should we name our new product?',
              type: 'ranked_choice',
              status: 'active',
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              totalVotes: 1847,
              maxResponses: 2000,
              voteUrl: 'https://votegenerator.com/v/abc123',
              adminUrl: 'https://votegenerator.com/admin/poll_1/token123',
              adminToken: 'token123',
              deviceBreakdown: { mobile: 62, desktop: 35, tablet: 3 },
            },
            {
              id: 'poll_2',
              question: 'When should we schedule the team meeting?',
              type: 'meeting_poll',
              status: 'active',
              createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
              totalVotes: 18,
              maxResponses: 50,
              expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
              voteUrl: 'https://votegenerator.com/v/def456',
              adminUrl: 'https://votegenerator.com/admin/poll_2/token456',
              adminToken: 'token456',
              hasPassword: true,
              deviceBreakdown: { mobile: 44, desktop: 56, tablet: 0 },
            },
            {
              id: 'poll_3',
              question: 'Rate our new feature ideas',
              type: 'dot_voting',
              status: 'closed',
              createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
              totalVotes: 89,
              maxResponses: 100,
              voteUrl: 'https://votegenerator.com/v/ghi789',
              adminUrl: 'https://votegenerator.com/admin/poll_3/token789',
              adminToken: 'token789',
              deviceBreakdown: { mobile: 71, desktop: 27, tablet: 2 },
            },
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [sessionId]);

  // Filter polls
  const filteredPolls = polls.filter(poll => {
    const matchesStatus = filterStatus === 'all' || poll.status === filterStatus;
    const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const stats = {
    totalVotes: polls.reduce((sum, p) => sum + p.totalVotes, 0),
    activePolls: polls.filter(p => p.status === 'active').length,
    totalPolls: polls.length,
  };

  // Bulk actions
  const handleBulkArchive = async () => {
    showToast('success', `${selectedPolls.size} poll(s) archived`);
    setSelectedPolls(new Set());
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedPolls.size} poll(s)? This cannot be undone.`)) {
      showToast('success', `${selectedPolls.size} poll(s) deleted`);
      setSelectedPolls(new Set());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const config = plan ? TIER_CONFIG[plan.tier] : TIER_CONFIG.free;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-white" size={22} />
                </div>
                <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">⌘N</kbd> to create
              </span>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition relative">
                <Bell size={20} className="text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <HelpCircle size={20} className="text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <Settings size={20} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Monthly Usage Warning */}
        {plan && plan.monthlyResponseCap && (
          <UsageWarningBanner
            type="monthly"
            current={plan.monthlyResponsesUsed}
            max={plan.monthlyResponseCap}
            onUpgrade={() => window.location.href = '/pricing'}
          />
        )}

        {/* Top Section: Plan + Stats */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            {plan && (
              <PlanStatusCard 
                plan={plan} 
                onUpgrade={() => window.location.href = '/pricing'}
                onManageBilling={() => window.location.href = '/api/portal'}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            {plan && <QuickStats stats={stats} plan={plan} />}
            
            {/* Feature highlights for tier */}
            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Your Plan Includes:</h4>
              <div className="flex flex-wrap gap-2">
                {config.features.exportCsv && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <FileSpreadsheet size={12} /> CSV Export
                  </span>
                )}
                {config.features.exportPdf && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <FileText size={12} /> PDF Export
                  </span>
                )}
                {config.features.customShortLink && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <Link2 size={12} /> Custom Links
                  </span>
                )}
                {config.features.uploadLogo && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <Image size={12} /> Custom Logo
                  </span>
                )}
                {config.features.pollScheduling && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <Calendar size={12} /> Scheduling
                  </span>
                )}
                {config.features.webhooks && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <Webhook size={12} /> Webhooks
                  </span>
                )}
                {config.features.apiAccess && (
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 flex items-center gap-1">
                    <Key size={12} /> API Access
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Polls Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg text-slate-800">Your Polls</h2>
                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-sm text-slate-600">
                  {filteredPolls.length}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Bulk Actions */}
                {selectedPolls.size > 0 && (
                  <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                    <span className="text-sm text-slate-500">{selectedPolls.size} selected</span>
                    <button
                      onClick={handleBulkArchive}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                      title="Archive selected"
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                      title="Delete selected"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedPolls(new Set())}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                      title="Clear selection"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search... (press /)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Create Button */}
                <button
                  onClick={() => window.location.href = '/create'}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Create Poll</span>
                </button>
              </div>
            </div>
          </div>

          {/* Polls Grid/List */}
          <div className="p-6">
            {filteredPolls.length === 0 ? (
              <EmptyState onCreatePoll={() => window.location.href = '/create'} />
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                <AnimatePresence mode="popLayout">
                  {filteredPolls.map(poll => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      tier={plan?.tier || 'free'}
                      onView={() => window.location.href = `/admin/${poll.id}/${poll.adminToken}`}
                      onCopyVoteLink={() => copyToClipboard(poll.voteUrl)}
                      onCopyAdminLink={() => copyToClipboard(poll.adminUrl)}
                      onExport={(format) => showToast('info', `Exporting ${format.toUpperCase()}...`)}
                      onDuplicate={() => showToast('success', 'Poll duplicated!')}
                      onArchive={() => showToast('success', poll.status === 'archived' ? 'Poll unarchived' : 'Poll archived')}
                      onDelete={() => showToast('success', 'Poll deleted')}
                      onGenerateQR={() => showToast('info', 'QR Code generated')}
                      onEditShortLink={() => showToast('info', 'Opening short link editor...')}
                      onGetEmbed={() => showToast('info', 'Embed code copied!')}
                      onTopUp={() => setShowTopUpModal(poll.id)}
                      onShareImage={() => showToast('info', 'Generating share image...')}
                      showToast={showToast}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade CTA for non-Pro */}
        {plan && !plan.tier.includes('pro') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Need more power?</h3>
                <ul className="space-y-1 text-indigo-100">
                  <li className="flex items-center gap-2"><Check size={16} /> Unlimited polls with Pro Dashboard</li>
                  <li className="flex items-center gap-2"><Check size={16} /> 10,000 responses/month</li>
                  <li className="flex items-center gap-2"><Check size={16} /> Custom branding & short links</li>
                  <li className="flex items-center gap-2"><Check size={16} /> Advanced analytics & exports</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition whitespace-nowrap"
              >
                Upgrade to Pro - $12/mo
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <TopUpModal
            pollId={showTopUpModal}
            currentResponses={polls.find(p => p.id === showTopUpModal)?.totalVotes || 0}
            maxResponses={polls.find(p => p.id === showTopUpModal)?.maxResponses || 500}
            tier={plan?.tier || 'quick_poll'}
            onClose={() => setShowTopUpModal(null)}
            onPurchase={async (amount) => {
              showToast('success', `Added ${amount} responses!`);
              setShowTopUpModal(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer with keyboard shortcuts */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span>Keyboard shortcuts:</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">⌘N</kbd> New poll</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">/</kbd> Search</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">Esc</kbd> Clear selection</span>
            </div>
            <a href="/help" className="hover:text-indigo-600 transition">Need help?</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Copy, Check, ExternalLink, Trash2, Settings,
  Crown, Loader2, Clock, Users, ChevronRight, LayoutDashboard,
  Eye, EyeOff, Link2, Calendar, Sparkles, AlertCircle, Bell,
  HelpCircle, PlusCircle, ArrowRight, CheckCircle, Star, Zap,
  TrendingUp, Share2, MoreHorizontal, RefreshCw, Download,
  Globe, Lock, Unlock, ChevronDown, Search, Filter, Grid, List
} from 'lucide-react';
import { SidebarAd, AdBanner } from './AdBanner';

// Types
interface UserPoll {
  id: string;
  adminKey: string;
  title: string;
  type: string;
  createdAt: string;
  responseCount?: number;
  status?: 'active' | 'ended' | 'draft';
}

interface UserSession {
  tier: 'free' | 'starter' | 'pro_event' | 'unlimited';
  expiresAt?: string;
  polls: UserPoll[];
  createdAt: string;
  stripeSessionId?: string;
}

// Premium Tier Configuration
const TIER_CONFIG: Record<string, {
  label: string;
  tagline: string;
  color: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  icon: React.ReactNode;
  premiumPollLimit: number | 'unlimited';
  features: string[];
}> = {
  free: {
    label: 'Free',
    tagline: 'Basic polls with ads',
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-slate-600',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    icon: <BarChart3 size={18} />,
    premiumPollLimit: 0,
    features: ['Basic poll types', 'Up to 100 responses', 'Ad-supported'],
  },
  starter: {
    label: 'Starter',
    tagline: 'Perfect for one-time events',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    borderColor: 'border-blue-200',
    icon: <Zap size={18} />,
    premiumPollLimit: 1,
    features: ['8 poll types', '500 responses', 'CSV export', 'No ads'],
  },
  pro_event: {
    label: 'Pro Event',
    tagline: 'For teams & recurring events',
    color: 'text-purple-600',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    bgGradient: 'from-purple-50 via-fuchsia-50 to-pink-50',
    borderColor: 'border-purple-200',
    icon: <Crown size={18} />,
    premiumPollLimit: 3,
    features: ['11 poll types', '2,000 responses', 'All exports', 'Visual polls'],
  },
  unlimited: {
    label: 'Unlimited',
    tagline: 'Enterprise-grade polling',
    color: 'text-amber-600',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    bgGradient: 'from-amber-50 via-orange-50 to-red-50',
    borderColor: 'border-amber-200',
    icon: <Sparkles size={18} />,
    premiumPollLimit: 'unlimited',
    features: ['All 12 poll types', '10,000 responses', 'Priority support', 'Custom branding'],
  },
};

// Poll Type Display Names
const POLL_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  multiple_choice: { label: 'Multiple Choice', icon: '📊' },
  ranked_choice: { label: 'Ranked Choice', icon: '🏆' },
  this_or_that: { label: 'This or That', icon: '⚖️' },
  meeting_poll: { label: 'Meeting Poll', icon: '📅' },
  dot_voting: { label: 'Dot Voting', icon: '🔵' },
  rating_scale: { label: 'Rating Scale', icon: '⭐' },
  approval_voting: { label: 'Approval Voting', icon: '✅' },
  priority_matrix: { label: 'Priority Matrix', icon: '📌' },
  quiz_poll: { label: 'Quiz Poll', icon: '❓' },
  sentiment_check: { label: 'Sentiment Check', icon: '💭' },
  visual_poll: { label: 'Visual Poll', icon: '🖼️' },
  buy_a_feature: { label: 'Buy a Feature', icon: '💰' },
};

// Glassmorphism card component
function GlassCard({ children, className = '', hover = true }: { 
  children: React.ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`
      bg-white/70 backdrop-blur-xl 
      border border-white/20 
      shadow-[0_8px_32px_rgba(0,0,0,0.08)]
      rounded-2xl
      ${hover ? 'hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] hover:bg-white/80 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Premium Poll Card
function PollCard({ 
  poll, 
  onCopyLink, 
  onDelete,
  onViewResults,
  copiedId,
  tier
}: { 
  poll: UserPoll; 
  onCopyLink: (poll: UserPoll, type: 'admin' | 'vote') => void;
  onDelete: (poll: UserPoll) => void;
  onViewResults: (poll: UserPoll) => void;
  copiedId: string | null;
  tier: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const adminUrl = `${window.location.origin}/admin/${poll.id}/${poll.adminKey}`;
  const voteUrl = `${window.location.origin}/vote/${poll.id}`;
  const pollTypeInfo = POLL_TYPE_LABELS[poll.type] || { label: poll.type, icon: '📊' };
  const isPremium = tier !== 'free';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Poll Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{pollTypeInfo.icon}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {pollTypeInfo.label}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 text-lg truncate pr-4">
              {poll.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {new Date(poll.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                <span className="font-medium text-slate-700">{poll.responseCount || 0}</span> votes
              </span>
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                poll.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  poll.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`} />
                {poll.status === 'active' ? 'Live' : 'Ended'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Copy Vote Link */}
            <button
              onClick={() => onCopyLink(poll, 'vote')}
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"
              title="Copy vote link"
            >
              {copiedId === `${poll.id}-vote` ? (
                <Check size={18} />
              ) : (
                <Share2 size={18} />
              )}
            </button>

            {/* View Results */}
            <button
              onClick={() => onViewResults(poll)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="View results"
            >
              <TrendingUp size={18} />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20"
                    >
                      <button
                        onClick={() => { onCopyLink(poll, 'admin'); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <Copy size={16} />
                        Copy Admin Link
                      </button>
                      <a
                        href={adminUrl}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <ExternalLink size={16} />
                        Open Dashboard
                      </a>
                      <a
                        href={voteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <Globe size={16} />
                        Preview Vote Page
                      </a>
                      <hr className="my-2 border-slate-100" />
                      <button
                        onClick={() => { onDelete(poll); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <Trash2 size={16} />
                        Delete Poll
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopyLink(poll, 'vote')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5"
            >
              <Link2 size={14} />
              {copiedId === `${poll.id}-vote` ? 'Copied!' : 'Share Link'}
            </button>
          </div>
          <a
            href={adminUrl}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
          >
            Manage
            <ChevronRight size={14} />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Empty State - Premium Design
function EmptyDashboard({ tier, onCreatePoll }: { tier: string; onCreatePoll: () => void }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="relative inline-block mb-8"
      >
        <div className={`w-24 h-24 bg-gradient-to-br ${config.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}>
          <PlusCircle size={48} className="text-white" />
        </div>
        {/* Decorative rings */}
        <div className={`absolute inset-0 -m-2 border-2 ${config.borderColor} rounded-3xl opacity-50`} />
        <div className={`absolute inset-0 -m-4 border ${config.borderColor} rounded-3xl opacity-25`} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Create Your First Poll
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
          Welcome to VoteGenerator! Get started by creating a poll. 
          It only takes 30 seconds.
        </p>
      </motion.div>
      
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreatePoll}
        className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3`}
      >
        <Plus size={22} />
        Create New Poll
      </motion.button>
      
      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {[
          { 
            icon: <BarChart3 className="text-indigo-600" />, 
            title: '12 Poll Types', 
            desc: 'From ranked choice to visual polls' 
          },
          { 
            icon: <Users className="text-emerald-600" />, 
            title: 'Real-time Results', 
            desc: 'Watch votes come in live' 
          },
          { 
            icon: <Zap className="text-amber-600" />, 
            title: 'Instant Setup', 
            desc: 'No signup required for voters' 
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-slate-800">{feature.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem('vg_user_session');
        if (stored) {
          setSession(JSON.parse(stored) as UserSession);
        } else {
          const tier = localStorage.getItem('vg_purchased_tier');
          if (tier) {
            const newSession: UserSession = {
              tier: tier as UserSession['tier'],
              expiresAt: localStorage.getItem('vg_expires_at') || undefined,
              polls: [],
              createdAt: new Date().toISOString(),
            };
            localStorage.setItem('vg_user_session', JSON.stringify(newSession));
            setSession(newSession);
          } else {
            setSession({ tier: 'free', polls: [], createdAt: new Date().toISOString() });
          }
        }
      } catch (e) {
        setSession({ tier: 'free', polls: [], createdAt: new Date().toISOString() });
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const handleCopyLink = (poll: UserPoll, type: 'admin' | 'vote') => {
    const url = type === 'admin' 
      ? `${window.location.origin}/admin/${poll.id}/${poll.adminKey}`
      : `${window.location.origin}/vote/${poll.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(`${poll.id}-${type}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePoll = (poll: UserPoll) => {
    if (!confirm(`Delete "${poll.title}"? This cannot be undone.`)) return;
    if (session) {
      const updatedPolls = session.polls.filter(p => p.id !== poll.id);
      const updatedSession = { ...session, polls: updatedPolls };
      localStorage.setItem('vg_user_session', JSON.stringify(updatedSession));
      setSession(updatedSession);
    }
  };

  const handleViewResults = (poll: UserPoll) => {
    window.location.href = `/admin/${poll.id}/${poll.adminKey}`;
  };

  const handleCreatePoll = () => {
    window.location.href = '/create';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const tier = session?.tier || 'free';
  const config = TIER_CONFIG[tier];
  const polls = session?.polls || [];
  const filteredPolls = polls.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isFree = tier === 'free';
  const premiumPollCount = polls.length; // In real app, filter by premium status
  const canCreatePremiumPoll = config.premiumPollLimit === 'unlimited' || 
    premiumPollCount < (config.premiumPollLimit as number);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <BarChart3 className="text-white" size={22} />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
                </div>
              </a>
              
              {/* Tier Badge */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-medium shadow-sm`}>
                {config.icon}
                {config.label}
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {tier !== 'unlimited' && (
                <a
                  href="/pricing"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                >
                  <Sparkles size={16} />
                  Upgrade
                </a>
              )}
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition">
                <Bell size={20} className="text-slate-500" />
              </button>
              <button className="p-2.5 hover:bg-slate-100 rounded-xl transition">
                <Settings size={20} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Save Link Banner - Critical for Paid Users */}
            {!isFree && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <GlassCard className="p-4 border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80" hover={false}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-800">Save This Link!</h3>
                        <p className="text-sm text-amber-600">Bookmark this page to access your polls anytime.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Dashboard URL copied to clipboard!');
                      }}
                      className="px-4 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition font-medium flex items-center gap-2 shadow-sm"
                    >
                      <Copy size={16} />
                      Copy URL
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <LayoutDashboard size={28} className={config.color} />
                  My Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                  {polls.length === 0 
                    ? 'Create your first poll to get started' 
                    : `${polls.length} poll${polls.length !== 1 ? 's' : ''} created`
                  }
                </p>
              </div>
              
              {polls.length > 0 && (
                <button
                  onClick={handleCreatePoll}
                  className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 shadow-md`}
                >
                  <Plus size={18} />
                  New Poll
                </button>
              )}
            </div>

            {/* Search & Filters (when polls exist) */}
            {polls.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search polls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/70 backdrop-blur border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div className="flex items-center bg-white/70 backdrop-blur rounded-xl border border-slate-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            {polls.length === 0 ? (
              <EmptyDashboard tier={tier} onCreatePoll={handleCreatePoll} />
            ) : (
              <div className="space-y-4">
                {/* Polls Grid/List */}
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
                  {filteredPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      onCopyLink={handleCopyLink}
                      onDelete={handleDeletePoll}
                      onViewResults={handleViewResults}
                      copiedId={copiedId}
                      tier={tier}
                    />
                  ))}
                </div>

                {/* Create More Section - Different messaging based on tier */}
                <div className="mt-8">
                  {isFree ? (
                    /* FREE USER - Can always create more free polls */
                    <GlassCard className="p-6 text-center bg-gradient-to-r from-indigo-50/80 to-purple-50/80" hover={false}>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles size={20} className="text-purple-600" />
                        <h3 className="font-semibold text-slate-800">Want Premium Features?</h3>
                      </div>
                      <p className="text-slate-600 mb-4 max-w-md mx-auto">
                        Skip the ads, unlock all 12 poll types, export to CSV/PDF, and get up to 10,000 responses.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={handleCreatePoll}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                        >
                          Create Free Poll
                        </button>
                        <a
                          href="/pricing"
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition"
                        >
                          Go Premium
                        </a>
                      </div>
                    </GlassCard>
                  ) : !canCreatePremiumPoll && tier !== 'unlimited' ? (
                    /* PAID USER - Used all premium slots */
                    <GlassCard className="p-6 text-center bg-gradient-to-r from-amber-50/80 to-orange-50/80" hover={false}>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Crown size={20} className="text-amber-600" />
                        <h3 className="font-semibold text-slate-800">Premium Polls In Use</h3>
                      </div>
                      <p className="text-slate-600 mb-4 max-w-md mx-auto">
                        You've used all {config.premiumPollLimit} premium poll{(config.premiumPollLimit as number) > 1 ? 's' : ''} this month. 
                        Create a free poll (with ads) or upgrade for more premium slots.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={handleCreatePoll}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                        >
                          Create Free Poll
                        </button>
                        <a
                          href="/pricing"
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition"
                        >
                          Get More Premium Polls
                        </a>
                      </div>
                    </GlassCard>
                  ) : (
                    /* PAID USER - Still has premium slots OR Unlimited */
                    <div className="text-center py-6">
                      <button
                        onClick={handleCreatePoll}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-lg"
                      >
                        <PlusCircle size={22} />
                        Create Another Poll
                      </button>
                      {tier !== 'unlimited' && (
                        <p className="text-slate-500 text-sm mt-2">
                          {(config.premiumPollLimit as number) - premiumPollCount} premium poll{(config.premiumPollLimit as number) - premiumPollCount !== 1 ? 's' : ''} remaining this month
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Ads for Free Users, Stats for Paid */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            {isFree ? (
              <>
                {/* Ad for Free Users */}
                <SidebarAd />
                
                {/* Upgrade Card */}
                <GlassCard className="p-5" hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={18} className="text-purple-600" />
                    <h3 className="font-semibold text-slate-800">Go Premium</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Remove ads, unlock advanced poll types, and get detailed exports.
                  </p>
                  <a
                    href="/pricing"
                    className="block w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition"
                  >
                    View Plans
                  </a>
                </GlassCard>
              </>
            ) : (
              <>
                {/* Plan Details Card */}
                <GlassCard className="p-5" hover={false}>
                  <div className="flex items-center gap-2 mb-4">
                    {config.icon}
                    <h3 className="font-semibold text-slate-800">{config.label} Plan</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{config.tagline}</p>
                  
                  <div className="space-y-3">
                    {config.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check size={16} className="text-emerald-500" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {tier !== 'unlimited' && (
                    <>
                      <hr className="my-4 border-slate-200" />
                      <div className="text-sm text-slate-500 mb-3">
                        Premium polls: {premiumPollCount} / {config.premiumPollLimit}
                      </div>
                      <a
                        href="/pricing"
                        className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-center transition"
                      >
                        Upgrade Plan
                      </a>
                    </>
                  )}

                  {session?.expiresAt && (
                    <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {tier === 'unlimited' ? 'Active until' : 'Expires'}: {new Date(session.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </GlassCard>

                {/* Quick Stats */}
                <GlassCard className="p-5" hover={false}>
                  <h3 className="font-semibold text-slate-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Total Polls</span>
                      <span className="font-bold text-slate-800">{polls.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Total Votes</span>
                      <span className="font-bold text-slate-800">
                        {polls.reduce((sum, p) => sum + (p.responseCount || 0), 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm">Active Polls</span>
                      <span className="font-bold text-emerald-600">
                        {polls.filter(p => p.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
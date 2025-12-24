import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Copy, Check, ExternalLink, Trash2, Settings,
  Crown, Loader2, Clock, Users, ChevronRight, LayoutDashboard,
  Eye, EyeOff, Link2, Calendar, Sparkles, AlertCircle, Bell,
  HelpCircle, PlusCircle, ArrowRight, CheckCircle, Star, Zap,
  TrendingUp, Share2, MoreHorizontal, RefreshCw, Download,
  Globe, Lock, Unlock, ChevronDown, Search, Filter, Grid, List,
  Home
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================
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

// =============================================================================
// TIER CONFIGURATION - Updated to match your pricing
// =============================================================================
const TIER_CONFIG: Record<string, {
  label: string;
  tagline: string;
  color: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  icon: React.ReactNode;
  maxResponses: number;
  activeDays: number;
  premiumPollLimit: number | 'unlimited';
}> = {
  free: {
    label: 'Free',
    tagline: 'Forever free',
    color: 'text-slate-600',
    gradient: 'from-slate-500 to-slate-600',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    icon: <BarChart3 size={18} />,
    maxResponses: 50,
    activeDays: 7,
    premiumPollLimit: 0,
  },
  starter: {
    label: 'Starter',
    tagline: 'For your next event',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    borderColor: 'border-blue-200',
    icon: <Zap size={18} />,
    maxResponses: 500,
    activeDays: 30,
    premiumPollLimit: 1,
  },
  pro_event: {
    label: 'Pro Event',
    tagline: 'For important events',
    color: 'text-purple-600',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    bgGradient: 'from-purple-50 via-fuchsia-50 to-pink-50',
    borderColor: 'border-purple-200',
    icon: <Crown size={18} />,
    maxResponses: 2000,
    activeDays: 60,
    premiumPollLimit: 1,
  },
  unlimited: {
    label: 'Unlimited',
    tagline: 'For power users',
    color: 'text-amber-600',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    bgGradient: 'from-amber-50 via-orange-50 to-red-50',
    borderColor: 'border-amber-200',
    icon: <Sparkles size={18} />,
    maxResponses: 5000,
    activeDays: 365,
    premiumPollLimit: 'unlimited',
  },
};

// =============================================================================
// UTILITY: Glass Card Component
// =============================================================================
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

// =============================================================================
// SIDEBAR AD COMPONENT - Easy to customize
// =============================================================================
function SidebarAd() {
  // CUSTOMIZE YOUR ADS HERE
  const ad = {
    emoji: '🎁',
    title: 'Need a Last-Minute Gift?',
    description: 'Send an instant Amazon eGift Card',
    ctaText: 'Shop Gift Cards',
    ctaUrl: 'https://amzn.to/your-affiliate-link', // <-- Change this
    gradient: 'from-orange-500 to-amber-500',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</p>
      </div>
      <a
        href={ad.ctaUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block p-4 hover:bg-slate-50 transition"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${ad.gradient} rounded-xl flex items-center justify-center text-2xl mb-3`}>
          {ad.emoji}
        </div>
        <p className="font-semibold text-slate-800">{ad.title}</p>
        <p className="text-slate-500 text-sm mt-1">{ad.description}</p>
        <div className={`mt-3 w-full py-2 bg-gradient-to-r ${ad.gradient} text-white rounded-lg text-sm font-medium text-center`}>
          {ad.ctaText}
        </div>
      </a>
    </div>
  );
}

// =============================================================================
// POLL CARD COMPONENT
// =============================================================================
function PollCard({ 
  poll, 
  onCopyLink, 
  onDelete,
  copiedId,
}: { 
  poll: UserPoll; 
  onCopyLink: (poll: UserPoll, type: 'admin' | 'vote') => void;
  onDelete: (poll: UserPoll) => void;
  copiedId: string | null;
}) {
  const adminUrl = `${window.location.origin}/admin/${poll.id}/${poll.adminKey}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 text-lg truncate">{poll.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {poll.responseCount || 0} votes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopyLink(poll, 'vote')}
              className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition"
              title="Copy vote link"
            >
              {copiedId === `${poll.id}-vote` ? <Check size={18} /> : <Share2 size={18} />}
            </button>
            <a
              href={adminUrl}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
              title="Open dashboard"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={() => onDelete(poll)}
              className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-xl transition"
              title="Delete poll"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// =============================================================================
// EMPTY DASHBOARD STATE
// =============================================================================
function EmptyDashboard({ tier, onCreatePoll }: { tier: string; onCreatePoll: () => void }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`w-24 h-24 bg-gradient-to-br ${config.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}
      >
        <PlusCircle size={48} className="text-white" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-3">Create Your First Poll</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
        Welcome to VoteGenerator! Get started by creating a poll. It only takes 30 seconds.
      </p>
      
      <button
        onClick={onCreatePoll}
        className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3`}
      >
        <Plus size={22} />
        Create New Poll
      </button>
    </motion.div>
  );
}

// =============================================================================
// ADMIN DASHBOARD COMPONENT
// =============================================================================
function AdminDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem('vg_user_session');
        if (stored) {
          setSession(JSON.parse(stored) as UserSession);
        } else {
          const tier = localStorage.getItem('vg_purchased_tier');
          if (tier) {
            const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
            const newSession: UserSession = {
              tier: tier as UserSession['tier'],
              expiresAt: new Date(Date.now() + config.activeDays * 24 * 60 * 60 * 1000).toISOString(),
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

  const handleCreatePoll = () => {
    window.location.href = '/create';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tier = session?.tier || 'free';
  const config = TIER_CONFIG[tier];
  const polls = session?.polls || [];
  const isFree = tier === 'free';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <BarChart3 className="text-white" size={22} />
                </div>
                <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
              </a>
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-medium shadow-sm`}>
                {config.icon}
                {config.label}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {tier !== 'unlimited' && (
                <a href="/pricing" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition">
                  <Sparkles size={16} />
                  Upgrade
                </a>
              )}
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
            {/* Save Link Banner */}
            {!isFree && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <GlassCard className="p-4 border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80" hover={false}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <AlertCircle size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-800">Save This Link!</h3>
                        <p className="text-sm text-amber-600">Bookmark this page to access your polls anytime.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!'); }}
                      className="px-4 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition font-medium flex items-center gap-2"
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
                  {polls.length === 0 ? 'Create your first poll to get started' : `${polls.length} poll${polls.length !== 1 ? 's' : ''} created`}
                </p>
              </div>
              
              {polls.length > 0 && (
                <button
                  onClick={handleCreatePoll}
                  className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2`}
                >
                  <Plus size={18} />
                  New Poll
                </button>
              )}
            </div>

            {/* Content */}
            {polls.length === 0 ? (
              <EmptyDashboard tier={tier} onCreatePoll={handleCreatePoll} />
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    onCopyLink={handleCopyLink}
                    onDelete={handleDeletePoll}
                    copiedId={copiedId}
                  />
                ))}
                
                {/* Create More */}
                <div className="mt-8 text-center py-6">
                  <button
                    onClick={handleCreatePoll}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-lg"
                  >
                    <PlusCircle size={22} />
                    Create Another Poll
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            {isFree ? (
              <>
                <SidebarAd />
                <GlassCard className="p-5" hover={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={18} className="text-purple-600" />
                    <h3 className="font-semibold text-slate-800">Go Premium</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Remove ads, unlock advanced poll types, and get detailed exports.</p>
                  <a href="/pricing" className="block w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition">
                    View Plans
                  </a>
                </GlassCard>
              </>
            ) : (
              <GlassCard className="p-5" hover={false}>
                <div className="flex items-center gap-2 mb-4">
                  {config.icon}
                  <h3 className="font-semibold text-slate-800">{config.label} Plan</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">{config.tagline}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /><span>{config.maxResponses} responses per poll</span></div>
                  <div className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /><span>{config.activeDays} days active</span></div>
                  <div className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /><span>{config.premiumPollLimit === 'unlimited' ? 'Unlimited' : config.premiumPollLimit} premium poll{config.premiumPollLimit !== 1 ? 's' : ''}</span></div>
                </div>
                {session?.expiresAt && (
                  <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    Expires: {new Date(session.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// =============================================================================
// CHECKOUT SUCCESS COMPONENT
// =============================================================================
function CheckoutSuccess() {
  const params = new URLSearchParams(window.location.search);
  const tier = params.get('tier') || 'starter';
  const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;

  useEffect(() => {
    // Store session on success
    const session = {
      tier,
      expiresAt: new Date(Date.now() + config.activeDays * 24 * 60 * 60 * 1000).toISOString(),
      polls: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('vg_user_session', JSON.stringify(session));
    localStorage.setItem('vg_purchased_tier', tier);
  }, [tier, config.activeDays]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful! 🎉</h1>
        <p className="text-slate-500 mb-6">Welcome to VoteGenerator {config.label}</p>
        <button
          onClick={() => window.location.href = '/admin'}
          className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2`}
        >
          Go to My Dashboard
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}

// =============================================================================
// AD WALL COMPONENT
// =============================================================================
function AdWall() {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect') || '/';
  const [countdown, setCountdown] = useState(8);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center">
        <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-300">
          <p className="text-slate-400">Ad Space</p>
        </div>
        {countdown > 0 ? (
          <div>
            <p className="text-slate-600 mb-2">Your poll is ready in...</p>
            <p className="text-5xl font-bold text-indigo-600">{countdown}</p>
          </div>
        ) : (
          <button
            onClick={() => window.location.href = decodeURIComponent(redirectUrl)}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Go to My Poll →
          </button>
        )}
        
        {/* Upgrade CTA */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="font-semibold text-amber-800 mb-2">Skip the wait!</p>
          <p className="text-sm text-amber-600 mb-3">Upgrade to remove ads and unlock premium features.</p>
          <a href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition">
            <Crown size={16} />
            View Plans
          </a>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PLACEHOLDER COMPONENTS - These fetch their own data from URL
// =============================================================================

// These components should fetch poll data based on URL params
// Replace with your actual implementations

function VoteGeneratorCreatePlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Create a Poll</h1>
        <p className="text-slate-500">Replace with actual VoteGeneratorCreate import</p>
      </div>
    </div>
  );
}

function VoteGeneratorVotePlaceholder() {
  const pollId = window.location.pathname.split('/vote/')[1]?.split('/')[0];
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Vote</h1>
        <p className="text-slate-500">Poll ID: {pollId}</p>
      </div>
    </div>
  );
}

function VoteGeneratorResultsPlaceholder() {
  const pollId = window.location.pathname.split('/results/')[1]?.split('/')[0];
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Results</h1>
        <p className="text-slate-500">Poll ID: {pollId}</p>
      </div>
    </div>
  );
}

function VoteGeneratorConfirmationPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Vote Submitted!</h1>
      </div>
    </div>
  );
}

function PollAdminViewPlaceholder() {
  const pathParts = window.location.pathname.split('/');
  const pollId = pathParts[2];
  const adminKey = pathParts[3];
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Poll Admin</h1>
        <p className="text-slate-500 mb-4">Poll ID: {pollId}</p>
        <a href="/admin" className="text-indigo-600 hover:text-indigo-700 font-medium">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP ROUTER
// =============================================================================
export default function VoteGeneratorApp() {
  const path = window.location.pathname;

  // Route: /checkout/success
  if (path.startsWith('/checkout/success')) {
    return <CheckoutSuccess />;
  }

  // Route: /admin (no poll ID = dashboard home)
  if (path === '/admin' || path === '/admin/') {
    return <AdminDashboard />;
  }

  // Route: /admin/:pollId/:adminKey (specific poll admin)
  if (path.match(/^\/admin\/[^/]+\/[^/]+/)) {
    return <PollAdminViewPlaceholder />;
  }

  // Route: /ad-wall
  if (path.startsWith('/ad-wall')) {
    return <AdWall />;
  }

  // Route: /create
  if (path === '/create' || path === '/create/') {
    return <VoteGeneratorCreatePlaceholder />;
  }

  // Route: /vote/:pollId
  if (path.startsWith('/vote/')) {
    return <VoteGeneratorVotePlaceholder />;
  }

  // Route: /results/:pollId
  if (path.startsWith('/results/')) {
    return <VoteGeneratorResultsPlaceholder />;
  }

  // Route: /confirmation
  if (path.startsWith('/confirmation')) {
    return <VoteGeneratorConfirmationPlaceholder />;
  }

  // Default: Create page
  return <VoteGeneratorCreatePlaceholder />;
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Copy, Check, ExternalLink, Trash2, Settings,
  Crown, Loader2, Clock, Users, ChevronRight, LayoutDashboard,
  Eye, EyeOff, Link2, Calendar, Sparkles, AlertCircle, Bell,
  HelpCircle, PlusCircle, ArrowRight, CheckCircle, Star
} from 'lucide-react';

// Import sub-components (these would be separate files in real app)
import VoteGeneratorCreate from './VoteGeneratorCreate';
import VoteGeneratorVote from './VoteGeneratorVote';
import VoteGeneratorResults from './VoteGeneratorResults';
import VoteGeneratorConfirmation from './VoteGeneratorConfirmation';
import AdWall from './AdWall';
import CheckoutSuccess from './CheckoutSuccess';

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

// Tier configuration
const TIER_CONFIG: Record<string, {
  label: string;
  color: string;
  gradient: string;
  bgGradient: string;
  icon: React.ReactNode;
  pollLimit: number | 'unlimited';
  canCreateMore: (pollCount: number) => boolean;
}> = {
  free: {
    label: 'Free',
    color: 'text-slate-600',
    gradient: 'from-slate-400 to-slate-500',
    bgGradient: 'from-slate-50 to-slate-100',
    icon: <BarChart3 size={18} />,
    pollLimit: 1,
    canCreateMore: (count) => count < 1,
  },
  starter: {
    label: 'Starter',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    icon: <Star size={18} />,
    pollLimit: 1,
    canCreateMore: (count) => count < 1,
  },
  pro_event: {
    label: 'Pro Event',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    icon: <Crown size={18} />,
    pollLimit: 3,
    canCreateMore: (count) => count < 3,
  },
  unlimited: {
    label: 'Unlimited',
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    icon: <Sparkles size={18} />,
    pollLimit: 'unlimited',
    canCreateMore: () => true,
  },
};

// Poll Card Component
function PollCard({ 
  poll, 
  onCopyLink, 
  onDelete, 
  copiedId 
}: { 
  poll: UserPoll; 
  onCopyLink: (poll: UserPoll) => void;
  onDelete: (poll: UserPoll) => void;
  copiedId: string | null;
}) {
  const adminUrl = `${window.location.origin}/admin/${poll.id}/${poll.adminKey}`;
  const voteUrl = `${window.location.origin}/vote/${poll.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{poll.title}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{poll.type}</span>
            <span>•</span>
            <Clock size={12} />
            <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopyLink(poll)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Copy admin link"
          >
            {copiedId === poll.id ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-slate-400" />
            )}
          </button>
          <a
            href={adminUrl}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Open dashboard"
          >
            <ExternalLink size={16} className="text-slate-400" />
          </a>
          <button
            onClick={() => onDelete(poll)}
            className="p-2 hover:bg-red-50 rounded-lg transition"
            title="Delete poll"
          >
            <Trash2 size={16} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-slate-500">
          <Users size={14} />
          <span>{poll.responseCount || 0} votes</span>
        </div>
        <a
          href={voteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
        >
          <Link2 size={14} />
          <span>Vote link</span>
        </a>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyDashboard({ 
  tier, 
  onCreatePoll 
}: { 
  tier: string; 
  onCreatePoll: () => void;
}) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        <PlusCircle size={40} className="text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Create Your First Poll
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Welcome to VoteGenerator {config.label}! Get started by creating your first poll. 
        It only takes a minute.
      </p>
      
      <button
        onClick={onCreatePoll}
        className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all inline-flex items-center gap-2`}
      >
        <Plus size={20} />
        Create New Poll
      </button>
      
      {/* Features Preview */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {[
          { icon: <BarChart3 />, title: 'Multiple Poll Types', desc: 'Ranked choice, rating, approval & more' },
          { icon: <Users />, title: 'Real-time Results', desc: 'Watch votes come in live' },
          { icon: <Link2 />, title: 'Easy Sharing', desc: 'One link for voters, one for you' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-4 bg-white rounded-xl border border-slate-200"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mx-auto mb-3">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-slate-800">{feature.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Main Admin Dashboard Component
function AdminDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Load user session from localStorage
    const loadSession = () => {
      try {
        const stored = localStorage.getItem('vg_user_session');
        if (stored) {
          const parsed = JSON.parse(stored) as UserSession;
          setSession(parsed);
        } else {
          // Check for legacy storage (backward compatibility)
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
            // No session - redirect to pricing or show free option
            setSession({
              tier: 'free',
              polls: [],
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        console.error('Error loading session:', e);
        setSession({
          tier: 'free',
          polls: [],
          createdAt: new Date().toISOString(),
        });
      }
      setLoading(false);
    };

    loadSession();
  }, []);

  const handleCopyLink = (poll: UserPoll) => {
    const adminUrl = `${window.location.origin}/admin/${poll.id}/${poll.adminKey}`;
    navigator.clipboard.writeText(adminUrl);
    setCopiedId(poll.id);
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
    // Navigate to create page
    window.location.href = '/create';
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
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

  const tier = session?.tier || 'free';
  const config = TIER_CONFIG[tier];
  const polls = session?.polls || [];
  const canCreateMore = config.canCreateMore(polls.length);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-white" size={22} />
                </div>
                <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Tier Badge */}
              <div className={`px-3 py-1.5 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-medium flex items-center gap-1.5`}>
                {config.icon}
                {config.label}
              </div>
              
              {tier !== 'unlimited' && (
                <button
                  onClick={handleUpgrade}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
                >
                  Upgrade
                </button>
              )}
              
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <HelpCircle size={20} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Link Warning - Show prominently for paid users */}
        {tier !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800">Bookmark This Page!</h3>
                <p className="text-sm text-amber-600">
                  This is your dashboard. Save this URL to access your polls anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Dashboard URL copied!');
                }}
                className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium flex items-center gap-2"
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          </motion.div>
        )}

        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <LayoutDashboard size={28} className="text-indigo-600" />
              My Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              {polls.length === 0 
                ? 'Get started by creating your first poll' 
                : `${polls.length} poll${polls.length !== 1 ? 's' : ''} • ${config.pollLimit === 'unlimited' ? 'Unlimited' : `${config.pollLimit - polls.length} remaining`}`
              }
            </p>
          </div>
          
          {polls.length > 0 && canCreateMore && (
            <button
              onClick={handleCreatePoll}
              className={`px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2`}
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
            {/* Polls List */}
            <div className="grid gap-4">
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onCopyLink={handleCopyLink}
                  onDelete={handleDeletePoll}
                  copiedId={copiedId}
                />
              ))}
            </div>

            {/* Create More CTA */}
            {canCreateMore ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <button
                  onClick={handleCreatePoll}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <PlusCircle size={20} />
                  Create Another Poll
                </button>
              </motion.div>
            ) : tier !== 'unlimited' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 bg-gradient-to-r ${config.bgGradient} rounded-xl border border-slate-200 text-center`}
              >
                <h3 className="font-bold text-slate-800 mb-2">
                  You've reached your poll limit
                </h3>
                <p className="text-slate-600 mb-4">
                  Upgrade to create more polls and unlock premium features.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition"
                >
                  Upgrade Now
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Expiry Notice */}
        {session?.expiresAt && tier !== 'free' && (
          <div className="mt-8 text-center text-sm text-slate-500">
            <Calendar size={14} className="inline mr-1" />
            Plan {tier === 'unlimited' ? 'active' : 'expires'}: {new Date(session.expiresAt).toLocaleDateString()}
          </div>
        )}
      </main>
    </div>
  );
}

// Main App Router
export default function VoteGeneratorApp() {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // Route: /checkout/success
  if (path.startsWith('/checkout/success')) {
    return <CheckoutSuccess />;
  }

  // Route: /admin (no poll ID = dashboard home)
  if (path === '/admin' || path === '/admin/') {
    return <AdminDashboard />;
  }

  // Route: /admin/:pollId/:adminKey (specific poll admin)
  const adminMatch = path.match(/^\/admin\/([^/]+)\/([^/]+)/);
  if (adminMatch) {
    const [, pollId, adminKey] = adminMatch;
    // This would render the specific poll admin view
    // For now, return a placeholder that would fetch poll data
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Specific poll admin dashboard would go here */}
        <AdminDashboard />
      </div>
    );
  }

  // Route: /ad-wall
  if (path.startsWith('/ad-wall')) {
    return <AdWall />;
  }

  // Route: /create
  if (path === '/create' || path === '/create/') {
    return <VoteGeneratorCreate />;
  }

  // Route: /vote/:pollId
  if (path.startsWith('/vote/')) {
    return <VoteGeneratorVote />;
  }

  // Route: /results/:pollId
  if (path.startsWith('/results/')) {
    return <VoteGeneratorResults />;
  }

  // Route: /confirmation
  if (path.startsWith('/confirmation')) {
    return <VoteGeneratorConfirmation />;
  }

  // Default: Homepage or Create
  return <VoteGeneratorCreate />;
}
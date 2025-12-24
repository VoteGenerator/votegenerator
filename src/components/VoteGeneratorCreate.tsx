import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Copy, Check, ExternalLink, Trash2, Settings,
  Crown, Loader2, Clock, Users, LayoutDashboard, Plus,
  Calendar, Sparkles, AlertCircle, PlusCircle, ArrowRight,
  CheckCircle, Star, Zap, Share2
} from 'lucide-react';

// =============================================================================
// IMPORT YOUR EXISTING COMPONENTS - Don't modify these!
// =============================================================================
import VoteGeneratorCreate from './VoteGeneratorCreate';
// Uncomment these as needed for other routes:
// import VoteGeneratorVote from './VoteGeneratorVote';
// import VoteGeneratorResults from './VoteGeneratorResults';
// import VoteGeneratorConfirmation from './VoteGeneratorConfirmation';

// =============================================================================
// NEW ROUTES ONLY - Admin Dashboard, Checkout Success, Ad Wall
// =============================================================================

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
}

// Tier Config matching your pricing
const TIER_CONFIG: Record<string, {
  label: string;
  gradient: string;
  bgGradient: string;
  icon: React.ReactNode;
  activeDays: number;
}> = {
  free: { label: 'Free', gradient: 'from-slate-500 to-slate-600', bgGradient: 'from-slate-50 to-slate-100', icon: <BarChart3 size={18} />, activeDays: 7 },
  starter: { label: 'Starter', gradient: 'from-blue-500 to-indigo-600', bgGradient: 'from-blue-50 to-indigo-50', icon: <Zap size={18} />, activeDays: 30 },
  pro_event: { label: 'Pro Event', gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-50 to-pink-50', icon: <Crown size={18} />, activeDays: 60 },
  unlimited: { label: 'Unlimited', gradient: 'from-amber-500 to-orange-500', bgGradient: 'from-amber-50 to-orange-50', icon: <Sparkles size={18} />, activeDays: 365 },
};

// =============================================================================
// ADMIN DASHBOARD (NEW - for /admin route)
// =============================================================================
function AdminDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vg_user_session');
      if (stored) {
        setSession(JSON.parse(stored));
      } else {
        const tier = localStorage.getItem('vg_purchased_tier');
        if (tier) {
          const newSession: UserSession = {
            tier: tier as UserSession['tier'],
            polls: [],
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('vg_user_session', JSON.stringify(newSession));
          setSession(newSession);
        } else {
          setSession({ tier: 'free', polls: [], createdAt: new Date().toISOString() });
        }
      }
    } catch {
      setSession({ tier: 'free', polls: [], createdAt: new Date().toISOString() });
    }
    setLoading(false);
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
    if (!confirm(`Delete "${poll.title}"?`)) return;
    if (session) {
      const updated = { ...session, polls: session.polls.filter(p => p.id !== poll.id) };
      localStorage.setItem('vg_user_session', JSON.stringify(updated));
      setSession(updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  const tier = session?.tier || 'free';
  const config = TIER_CONFIG[tier];
  const polls = session?.polls || [];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="VoteGenerator" className="w-10 h-10" />
            <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
          </a>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 bg-gradient-to-r ${config.gradient} text-white rounded-full text-sm font-medium flex items-center gap-1.5`}>
              {config.icon} {config.label}
            </div>
            {tier !== 'unlimited' && (
              <a href="/pricing" className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium">
                Upgrade
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Save Link Banner */}
        {tier !== 'free' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600" />
              <div>
                <p className="font-bold text-amber-800">Save This Link!</p>
                <p className="text-sm text-amber-600">Bookmark this page to access your polls anytime.</p>
              </div>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!'); }}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg font-medium flex items-center gap-2">
              <Copy size={16} /> Copy URL
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <LayoutDashboard size={28} className="text-indigo-600" /> My Dashboard
            </h1>
            <p className="text-slate-500">{polls.length === 0 ? 'Create your first poll' : `${polls.length} poll(s)`}</p>
          </div>
          {polls.length > 0 && (
            <a href="/create" className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium flex items-center gap-2`}>
              <Plus size={18} /> New Poll
            </a>
          )}
        </div>

        {/* Content */}
        {polls.length === 0 ? (
          <div className="text-center py-16">
            <div className={`w-24 h-24 bg-gradient-to-br ${config.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8`}>
              <PlusCircle size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Create Your First Poll</h2>
            <p className="text-slate-500 mb-8">Get started in seconds.</p>
            <a href="/create" className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-2xl font-bold text-lg inline-flex items-center gap-3`}>
              <Plus size={22} /> Create New Poll
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{poll.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> {new Date(poll.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {poll.responseCount || 0} votes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopyLink(poll, 'vote')} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg" title="Copy vote link">
                      {copiedId === `${poll.id}-vote` ? <Check size={18} /> : <Share2 size={18} />}
                    </button>
                    <a href={`/admin/${poll.id}/${poll.adminKey}`} className="p-2 bg-slate-100 text-slate-600 rounded-lg" title="Open">
                      <ExternalLink size={18} />
                    </a>
                    <button onClick={() => handleDeletePoll(poll)} className="p-2 bg-slate-100 text-slate-600 hover:text-red-600 rounded-lg" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center py-6">
              <a href="/create" className="text-indigo-600 font-medium inline-flex items-center gap-2">
                <PlusCircle size={20} /> Create Another Poll
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// =============================================================================
// CHECKOUT SUCCESS (NEW - for /checkout/success route)
// =============================================================================
function CheckoutSuccess() {
  const params = new URLSearchParams(window.location.search);
  const tier = params.get('tier') || 'starter';
  const config = TIER_CONFIG[tier] || TIER_CONFIG.starter;

  useEffect(() => {
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <CheckCircle size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful! 🎉</h1>
        <p className="text-slate-500 mb-6">Welcome to VoteGenerator {config.label}</p>
        <button onClick={() => window.location.href = '/admin'} className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold flex items-center justify-center gap-2`}>
          Go to My Dashboard <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}

// =============================================================================
// AD WALL (NEW - for /ad-wall route)
// =============================================================================
function AdWall() {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect') || '/';
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
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
          <button onClick={() => window.location.href = decodeURIComponent(redirectUrl)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">
            Go to My Poll →
          </button>
        )}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="font-semibold text-amber-800 mb-2">Skip the wait!</p>
          <a href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">
            <Crown size={16} /> View Plans
          </a>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN ROUTER - Only routes, doesn't change your existing components
// =============================================================================
export default function VoteGeneratorApp() {
  const path = window.location.pathname;

  // NEW: /checkout/success
  if (path.startsWith('/checkout/success')) {
    return <CheckoutSuccess />;
  }

  // NEW: /admin (dashboard home)
  if (path === '/admin' || path === '/admin/') {
    return <AdminDashboard />;
  }

  // NEW: /ad-wall
  if (path.startsWith('/ad-wall')) {
    return <AdWall />;
  }

  // EXISTING: Everything else uses your existing VoteGeneratorCreate
  // which has NavHeader, hero, footer, poll types, etc.
  return <VoteGeneratorCreate />;
}
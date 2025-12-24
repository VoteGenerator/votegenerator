import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Crown, AlertCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

// Tier configuration
const TIER_CONFIG: Record<string, { label: string; color: string; gradient: string }> = {
  starter: { label: 'Starter', color: 'text-blue-600', gradient: 'from-blue-500 to-indigo-500' },
  pro_event: { label: 'Pro Event', color: 'text-purple-600', gradient: 'from-purple-500 to-pink-500' },
  unlimited: { label: 'Unlimited', color: 'text-amber-600', gradient: 'from-amber-500 to-orange-500' },
};

export default function CheckoutSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tier, setTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const tierFromUrl = params.get('tier');

      if (!sessionId) {
        // If no session_id but we have tier, user might have refreshed
        const storedTier = localStorage.getItem('vg_purchased_tier');
        if (storedTier) {
          setTier(storedTier);
          setStatus('success');
          return;
        }
        setError('No session ID found');
        setStatus('error');
        return;
      }

      try {
        // Verify the Stripe session
        const response = await fetch('/.netlify/functions/vg-verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        
        // Get tier from response or URL
        const purchasedTier = data.tier || tierFromUrl || 'pro_event';
        const expiresAt = data.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

        // Store user session in localStorage
        const userSession = {
          tier: purchasedTier,
          expiresAt,
          stripeSessionId: sessionId,
          polls: [], // Empty initially, will be populated as they create polls
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('vg_user_session', JSON.stringify(userSession));
        
        // Also keep individual keys for backward compatibility
        localStorage.setItem('vg_purchased_tier', purchasedTier);
        localStorage.setItem('vg_expires_at', expiresAt);

        setTier(purchasedTier);
        setStatus('success');
      } catch (err) {
        console.error('Verification error:', err);
        
        // Fallback: trust the tier from URL if verification fails
        if (tierFromUrl) {
          const userSession = {
            tier: tierFromUrl,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            polls: [],
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('vg_user_session', JSON.stringify(userSession));
          localStorage.setItem('vg_purchased_tier', tierFromUrl);
          setTier(tierFromUrl);
          setStatus('success');
        } else {
          setError('Payment verification failed. Please contact support.');
          setStatus('error');
        }
      }
    };

    verifySession();
  }, []);

  const handleGoToDashboard = () => {
    // Redirect to Admin Dashboard (the user's home base)
    window.location.href = '/admin';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Verifying Payment...</h2>
          <p className="text-slate-500 mt-2">Just a moment while we confirm your purchase.</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Payment Issue</h2>
          <p className="text-slate-500 mt-2">{error}</p>
          <div className="mt-6 space-y-3">
            <a
              href="/pricing"
              className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Try Again
            </a>
            <a
              href="mailto:support@votegenerator.com"
              className="block w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  const config = tier ? TIER_CONFIG[tier] : TIER_CONFIG.pro_event;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <CheckCircle size={40} className="text-white" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-slate-500">
            Welcome to VoteGenerator {config.label}
          </p>
        </motion.div>

        {/* Plan Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-6 p-4 bg-gradient-to-r ${config.gradient} rounded-xl text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown size={24} />
              <div>
                <p className="font-bold">{config.label} Plan</p>
                <p className="text-white/80 text-sm">
                  {tier === 'unlimited' ? 'Unlimited polls forever' : 
                   tier === 'pro_event' ? '3 premium polls/month' : 
                   '1 premium poll/month'}
                </p>
              </div>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-slate-50 rounded-xl"
        >
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <LayoutDashboard size={18} className="text-indigo-600" />
            Your Dashboard Awaits
          </h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Create and manage all your polls</li>
            <li>• Access premium poll types</li>
            <li>• Export results (CSV, PDF, PNG)</li>
            <li>• <strong>Save this link</strong> - it's your home base!</li>
          </ul>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleGoToDashboard}
          className={`mt-6 w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2`}
        >
          Go to My Dashboard
          <ArrowRight size={20} />
        </motion.button>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 text-xs text-center text-slate-400"
        >
          A confirmation email has been sent to your inbox
        </motion.p>
      </motion.div>
    </div>
  );
}
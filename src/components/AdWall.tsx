import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader2, ArrowRight, Crown, Sparkles } from 'lucide-react';

const AD_DURATION = 8; // seconds

export default function AdWall() {
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [canProceed, setCanProceed] = useState(false);

  // Get redirect URL from query params
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get('redirect') || '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanProceed(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleProceed = () => {
    window.location.href = decodeURIComponent(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center"
      >
        {/* Success Message */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Poll Created Successfully!</h1>
          <p className="text-slate-600">Your admin dashboard is almost ready...</p>
        </div>

        {/* Ad Space */}
        <div className="mb-6">
          <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-300">
            <div className="text-slate-400">
              <p className="text-sm font-medium">Advertisement</p>
              <p className="text-xs mt-1">Powered by Google AdSense</p>
            </div>
          </div>
        </div>

        {/* Countdown / Proceed */}
        {!canProceed ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Clock size={20} />
              <span>Preparing your admin dashboard...</span>
            </div>
            <div className="text-5xl font-bold text-indigo-600">
              {countdown}
            </div>
            <div className="flex justify-center">
              <Loader2 size={24} className="text-slate-400 animate-spin" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <button
              onClick={handleProceed}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Go to Admin Dashboard
              <ArrowRight size={20} />
            </button>
            <p className="text-sm text-amber-600 font-medium">
              ⚠️ Bookmark the next page to access your poll anytime!
            </p>
          </motion.div>
        )}

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber-600" />
            <span className="font-semibold text-amber-800">Skip the wait!</span>
          </div>
          <p className="text-sm text-amber-700 mb-3">
            Upgrade to a paid plan for instant access, premium poll types, and no ads.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium text-sm hover:shadow-md transition"
          >
            <Crown size={16} />
            View Plans
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
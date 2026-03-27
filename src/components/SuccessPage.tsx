// ============================================================================
// VoteGenerator - Success Page Component
// Handles post-purchase flow for all tiers:
// - Starter/Pro Event: Show confirmation, link to poll
// - Unlimited: Show license key, save link, optional email backup
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Copy,
  Bookmark,
  Mail,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Star,
  ExternalLink,
  Key,
  Shield,
} from 'lucide-react';

useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'https://votegenerator.com/survey';
  document.head.appendChild(link);
  return () => { document.head.removeChild(link); };
}, []);



// ============================================================================
// Types
// ============================================================================

interface LicenseInfo {
  key: string;
  tier: string;
  expiresAt: string;
  daysRemaining: number;
}

interface PurchaseInfo {
  tier: string;
  tierName: string;
  pollId?: string;
  adminToken?: string;
  licenseKey?: string;
}

// ============================================================================
// Component
// ============================================================================

const SuccessPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo | null>(null);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const tier = params.get('tier');
    const pollId = params.get('poll_id');

    if (!sessionId || !tier) {
      setError('Missing purchase information. Please contact support.');
      setLoading(false);
      return;
    }

    // For Unlimited tier, we need to fetch the license from the session
    if (tier === 'unlimited') {
      fetchLicenseInfo(sessionId);
    } else {
      // For Starter/Pro Event, just show confirmation
      setPurchaseInfo({
        tier,
        tierName: tier === 'starter' ? 'Starter' : 'Pro Event',
        pollId: pollId || undefined,
      });
      setLoading(false);
    }
  }, []);

  // Fetch license info from backend
  const fetchLicenseInfo = async (sessionId: string) => {
    try {
      // In a real implementation, you'd have an endpoint to get license by session
      // For now, we'll get it from URL or show instructions
      const params = new URLSearchParams(window.location.search);
      const licenseKey = params.get('license_key');

      if (licenseKey) {
        // Validate the license
        const response = await fetch(`/.netlify/functions/vg-license-validate?key=${licenseKey}`);
        const data = await response.json();

        if (data.valid) {
          setLicenseInfo(data.license);
          setPurchaseInfo({
            tier: 'unlimited',
            tierName: 'Unlimited',
            licenseKey,
          });

          // Store in localStorage for convenience
          localStorage.setItem('vg_license_key', licenseKey);
        } else {
          setError(data.error || 'Invalid license');
        }
      } else {
        // License key will be emailed or shown via webhook redirect
        setPurchaseInfo({
          tier: 'unlimited',
          tierName: 'Unlimited',
        });
      }
    } catch (err) {
      console.error('Failed to fetch license:', err);
      setError('Failed to load license information. Check your email or contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Copy license link to clipboard
  const copyLicenseLink = () => {
    if (!licenseInfo?.key) return;
    const licenseUrl = `${window.location.origin}/license/${licenseInfo.key}`;
    navigator.clipboard.writeText(licenseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send email backup
  const sendEmailBackup = async () => {
    if (!email || !licenseInfo?.key) return;

    setEmailSending(true);
    try {
      const response = await fetch('/.netlify/functions/vg-send-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          licenseKey: licenseInfo.key,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      alert('Failed to send email. Please copy the link instead.');
    } finally {
      setEmailSending(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="mailto:support@votegenerator.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            Contact Support
            <Mail size={18} />
          </a>
        </div>
      </div>
    );
  }

  // Unlimited license success
  if (purchaseInfo?.tier === 'unlimited' && licenseInfo) {
    const licenseUrl = `${window.location.origin}/license/${licenseInfo.key}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-2">
              🎉 Welcome to Unlimited!
            </h1>
            <p className="text-indigo-100 text-lg">
              Your purchase was successful. Here's your license:
            </p>
          </div>

          {/* License card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Warning banner */}
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-amber-800">⚠️ SAVE THIS LINK!</p>
                  <p className="text-amber-700 text-sm">
                    This is your only way to access Unlimited features. Bookmark it now!
                  </p>
                </div>
              </div>
            </div>

            {/* License info */}
            <div className="p-6 space-y-6">
              {/* License key */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Your License Key
                </label>
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-4">
                  <Key className="text-indigo-600" size={20} />
                  <code className="flex-1 font-mono text-lg font-bold text-slate-800">
                    {licenseInfo.key}
                  </code>
                </div>
              </div>

              {/* License URL */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">
                  Your License Link
                </label>
                <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                  <p className="font-mono text-sm text-indigo-700 break-all mb-3">
                    {licenseUrl}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={copyLicenseLink}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                        copied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle size={18} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copy Link
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        // Trigger browser bookmark dialog
                        alert('Press Ctrl+D (Cmd+D on Mac) to bookmark this page!');
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                    >
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Email backup */}
              {!emailSent ? (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-3">
                    <strong>Optional:</strong> Get a backup copy via email
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={sendEmailBackup}
                      disabled={!email || emailSending}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 disabled:opacity-50 transition"
                    >
                      {emailSending ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Mail size={18} />
                      )}
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="text-emerald-600" size={20} />
                  <p className="text-emerald-700">
                    Backup sent to <strong>{email}</strong>
                  </p>
                </div>
              )}

              {/* What's included */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Star className="text-amber-500" size={18} />
                  What's Included
                </h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    Unlimited polls for 1 year
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    5,000 responses per poll
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    Visual Poll support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    All export options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    Email notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-500" size={14} />
                    {licenseInfo.daysRemaining} days remaining
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <a
                href={licenseUrl}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                Create Your First Poll
                <ArrowRight size={20} />
              </a>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 text-center">
              <p className="text-sm text-slate-500">
                Lost your link? Contact{' '}
                <a href="mailto:support@votegenerator.com" className="text-indigo-600 hover:underline">
                  support@votegenerator.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Starter/Pro Event success
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          🎉 Purchase Complete!
        </h1>
        <p className="text-slate-600 mb-8">
          Your poll has been upgraded to <strong>{purchaseInfo?.tierName}</strong>.
        </p>

        {/* What's unlocked */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="text-indigo-600" size={20} />
            What's Now Unlocked
          </h3>
          <ul className="space-y-2 text-slate-600">
            {purchaseInfo?.tier === 'starter' ? (
              <>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  500 responses (up from 50)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  30 days duration (up from 7)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  CSV export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  Device & geographic stats
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  2,000 responses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  60 days duration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  Visual Poll support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  CSV, PDF & PNG export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  Custom short link
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={16} />
                  Remove branding
                </li>
              </>
            )}
          </ul>
        </div>

        {/* CTA */}
        {purchaseInfo?.pollId ? (
          <a
            href={`/#id=${purchaseInfo.pollId}${purchaseInfo.adminToken ? `&admin=${purchaseInfo.adminToken}` : ''}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Go to Your Poll
            <ArrowRight size={20} />
          </a>
        ) : (
          <a
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            Create Your Poll
            <ArrowRight size={20} />
          </a>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessPage;
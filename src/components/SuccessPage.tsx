// ============================================================================
// VoteGenerator - Success Page
// Shown after successful Stripe payment
// ============================================================================

import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Loader2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface PurchaseInfo {
  purchaseId: string;
  plan: string;
  amount: number;
  currency: string;
}

interface SubscriptionInfo {
  userId: string;
  tier: string;
  email?: string;
}

const SuccessPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [pollCreated, setPollCreated] = useState<{
    voterUrl: string;
    adminUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError('No session ID found. Please try again.');
        setLoading(false);
        return;
      }

      try {
        // Verify the session with our backend
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        if (data.type === 'one_time') {
          setPurchaseInfo(data.purchase);
        } else if (data.type === 'subscription') {
          setSubscriptionInfo(data.subscription);
        }

      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getPlanDisplayName = (plan: string): string => {
    const names: Record<string, string> = {
      quick: 'Quick Poll',
      event: 'Event Poll',
      pro: 'Pro',
      pro_plus: 'Pro+',
    };
    return names[plan] || plan;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Pricing
          </a>
        </div>
      </div>
    );
  }

  // One-time purchase success (Quick Poll or Event Poll)
  if (purchaseInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 py-4">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-slate-900">
              VoteGenerator
            </a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Your {getPlanDisplayName(purchaseInfo.plan)} is ready to use
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Plan</span>
                <span className="font-semibold text-slate-900">{getPlanDisplayName(purchaseInfo.plan)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-600">Amount Paid</span>
                <span className="font-semibold text-slate-900">
                  {purchaseInfo.currency} ${purchaseInfo.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-600">Purchase ID</span>
                <span className="font-mono text-xs text-slate-500">{purchaseInfo.purchaseId}</span>
              </div>
            </div>

            {/* Poll Created */}
            {pollCreated ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-medium mb-3">Your poll is ready!</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pollCreated.voterUrl}
                        className="flex-1 px-3 py-2 bg-white border border-green-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => handleCopy(pollCreated.voterUrl, 'voter')}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {copied === 'voter' ? 'Copied!' : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-green-600">Share this link with voters</p>
                  </div>
                </div>

                <a
                  href={pollCreated.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Go to Admin Dashboard
                  <ExternalLink size={18} />
                </a>
              </div>
            ) : (
              <a
                href={`/create?purchase=${purchaseInfo.purchaseId}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Create Your Poll Now
                <ArrowRight size={20} />
              </a>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">What's included:</h2>
            <ul className="space-y-3 text-slate-600">
              {purchaseInfo.plan === 'quick' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    1 poll, active for 7 days
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Up to 500 responses
                  </li>
                </>
              )}
              {purchaseInfo.plan === 'event' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    1 poll, active for 30 days
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Up to 2,000 responses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Admin token for extra security
                  </li>
                </>
              )}
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                No ads on your poll
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                No "Powered by" branding
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Export results (CSV, Excel, PDF)
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Subscription success (Pro or Pro+)
  if (subscriptionInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 py-4">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-slate-900">
              VoteGenerator
            </a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-indigo-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to {getPlanDisplayName(subscriptionInfo.tier)}!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Your subscription is now active
            </p>

            {subscriptionInfo.email && (
              <p className="text-sm text-slate-500 mb-6">
                Confirmation sent to: {subscriptionInfo.email}
              </p>
            )}

            <div className="space-y-4">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl w-full justify-center"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </a>
              
              <a
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors w-full justify-center"
              >
                Create Your First Poll
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Your {getPlanDisplayName(subscriptionInfo.tier)} features:</h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-500" />
                Unlimited polls from one dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-500" />
                {subscriptionInfo.tier === 'pro_plus' ? '50,000' : '10,000'} responses per poll
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-500" />
                {subscriptionInfo.tier === 'pro_plus' ? 'All 12' : '11'} poll types
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-500" />
                Custom branding & logo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-indigo-500" />
                Advanced analytics
              </li>
              {subscriptionInfo.tier === 'pro_plus' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-indigo-500" />
                    Visual Poll (images)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-indigo-500" />
                    Unique voting codes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-indigo-500" />
                    Custom short links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-indigo-500" />
                    White-label embeds
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Payment Received</h1>
        <p className="text-slate-600 mb-6">Thank you for your purchase!</p>
        <a
          href="/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Create a Poll
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
};

export default SuccessPage;
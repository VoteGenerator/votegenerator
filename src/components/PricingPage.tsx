// ============================================================================
// VoteGenerator - Pricing Page Component
// 4 Tiers: Free, Starter $9.99, Pro Event $19.99, Unlimited $199/year
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, X, Zap, Calendar, Crown, Users, HelpCircle,
  BarChart3, Download, Link2, Image, Shield, Bell, Globe,
  Clock, QrCode, Lock, FileSpreadsheet, FileText, Eye,
  ArrowRight, Star, ChevronDown, Sparkles, Copy, Share2
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: number;
  period: 'free' | 'one-time' | 'year';
  popular?: boolean;
  icon: React.ElementType;
  color: string;
  cta: string;
  ctaLink: string;
  features: {
    responses: string;
    duration: string;
    polls: string;
    highlights: string[];
  };
}

// ============================================================================
// Pricing Data - 4 Tiers
// ============================================================================

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Try it out',
    price: 0,
    period: 'free',
    icon: Users,
    color: 'slate',
    cta: 'Create Free Poll',
    ctaLink: '/create',
    features: {
      responses: '50 responses',
      duration: '7 days',
      polls: '1 poll',
      highlights: [
        'Multiple Choice polls',
        'Ranked Choice voting',
        'This or That comparisons',
        'Meeting Poll (scheduling)',
        'Rating Scale feedback',
        'RSVP attendance',
        'QR code sharing',
        'Real-time results',
        'Embed on your site',
      ],
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For your next event',
    price: 9.99,
    period: 'one-time',
    icon: Zap,
    color: 'blue',
    cta: 'Get Starter',
    ctaLink: '/checkout?tier=starter',
    features: {
      responses: '500 responses',
      duration: '30 days',
      polls: '1 poll',
      highlights: [
        'Everything in Free, plus:',
        'Export to CSV',
        'Duplicate your poll',
        'Device breakdown stats',
        'Geographic breakdown',
        '90-day data retention',
      ],
    },
  },
  {
    id: 'pro_event',
    name: 'Pro Event',
    tagline: 'For important events',
    price: 19.99,
    period: 'one-time',
    popular: true,
    icon: Calendar,
    color: 'purple',
    cta: 'Get Pro Event',
    ctaLink: '/checkout?tier=pro_event',
    features: {
      responses: '2,000 responses',
      duration: '60 days',
      polls: '1 poll',
      highlights: [
        'Everything in Starter, plus:',
        'Visual Poll (image voting)',
        'Export to PDF & PNG',
        'Custom short link',
        'Remove VG branding',
        'Password protection',
        'Schedule polls in advance',
        'Share dashboard (view-only)',
        '1-year data retention',
      ],
    },
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    tagline: 'For power users',
    price: 199,
    period: 'year',
    icon: Crown,
    color: 'amber',
    cta: 'Go Unlimited',
    ctaLink: '/checkout?tier=unlimited',
    features: {
      responses: '5,000 per poll',
      duration: '1 year per poll',
      polls: 'Unlimited polls',
      highlights: [
        'Everything in Pro Event, plus:',
        'Unlimited polls for 1 year',
        'Upload your logo',
        'Email notifications',
        'Access codes for voters',
        'Priority email support',
        '2-year data retention',
      ],
    },
  },
];

// ============================================================================
// Feature Comparison Data
// ============================================================================

interface FeatureRow {
  name: string;
  tooltip?: string;
  free: boolean | string;
  starter: boolean | string;
  proEvent: boolean | string;
  unlimited: boolean | string;
}

const FEATURE_COMPARISON: { category: string; features: FeatureRow[] }[] = [
  {
    category: 'Limits',
    features: [
      { name: 'Responses per poll', free: '50', starter: '500', proEvent: '2,000', unlimited: '5,000' },
      { name: 'Poll duration', free: '7 days', starter: '30 days', proEvent: '60 days', unlimited: '1 year' },
      { name: 'Number of polls', free: '1', starter: '1', proEvent: '1', unlimited: 'Unlimited' },
      { name: 'Data retention', free: '30 days', starter: '90 days', proEvent: '1 year', unlimited: '2 years' },
    ],
  },
  {
    category: 'Poll Types',
    features: [
      { name: 'Multiple Choice', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Ranked Choice', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'This or That', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Meeting Poll', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Rating Scale', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'RSVP', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Visual Poll', tooltip: 'Vote on images in a beautiful grid', free: false, starter: false, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Sharing & Export',
    features: [
      { name: 'QR Code', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Copy link & social sharing', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Embed on website', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Export to CSV', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Export to PDF', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Export to PNG (image)', free: false, starter: false, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Analytics',
    features: [
      { name: 'Real-time results', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Device breakdown', tooltip: 'See mobile vs desktop votes', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Geographic breakdown', tooltip: 'See which countries votes come from', free: false, starter: true, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Branding & Customization',
    features: [
      { name: 'Custom short link', tooltip: 'votegenerator.com/p/your-poll', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Remove VG branding', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Upload your logo', free: false, starter: false, proEvent: false, unlimited: true },
    ],
  },
  {
    category: 'Admin & Security',
    features: [
      { name: 'Duplicate poll', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Password protection', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Schedule polls', tooltip: 'Set future open/close dates', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Share dashboard (view-only)', tooltip: 'Let others view results without editing', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Access codes', tooltip: 'Require a code to vote', free: false, starter: false, proEvent: false, unlimited: true },
    ],
  },
  {
    category: 'Notifications & Support',
    features: [
      { name: 'Email notifications', tooltip: 'Get notified about new votes', free: false, starter: false, proEvent: false, unlimited: true },
      { name: 'Priority email support', free: false, starter: false, proEvent: false, unlimited: true },
    ],
  },
];

// ============================================================================
// Components
// ============================================================================

const FeatureCell: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="text-emerald-500 mx-auto" size={20} />
    ) : (
      <X className="text-slate-300 mx-auto" size={20} />
    );
  }
  return <span className="text-slate-700 text-sm font-medium">{value}</span>;
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <div className="group relative inline-flex items-center gap-1 cursor-help">
    {children}
    <HelpCircle size={14} className="text-slate-400" />
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap max-w-xs text-center">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

const PricingPage: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);

  const colorClasses: Record<string, { bg: string; border: string; text: string; button: string; ring: string }> = {
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', button: 'bg-slate-800 hover:bg-slate-900', ring: 'ring-slate-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700', ring: 'ring-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700', ring: 'ring-purple-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700', ring: 'ring-amber-500' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6"
        >
          <Shield size={16} />
          No signup required • Privacy-first
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Start free. Pay only when you need more.
          <br />
          <span className="text-indigo-600 font-medium">No subscriptions. No hidden fees.</span>
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier, index) => {
            const colors = colorClasses[tier.color];
            const Icon = tier.icon;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-purple-500 shadow-xl shadow-purple-100' : 'border-slate-200'} bg-white overflow-hidden flex flex-col`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-1.5 text-sm font-medium">
                    <Star className="inline-block mr-1" size={14} />
                    Best Value
                  </div>
                )}

                <div className={`p-6 flex-1 flex flex-col ${tier.popular ? 'pt-12' : ''}`}>
                  {/* Icon & Name */}
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{tier.tagline}</p>

                  {/* Price */}
                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </span>
                      {tier.period === 'one-time' && (
                        <span className="text-slate-500 text-sm">one-time</span>
                      )}
                      {tier.period === 'year' && (
                        <span className="text-slate-500 text-sm">/year</span>
                      )}
                    </div>
                    {tier.period === 'year' && (
                      <p className="text-sm text-emerald-600 mt-1">
                        That's ${(tier.price / 12).toFixed(2)}/month
                      </p>
                    )}
                  </div>

                  {/* Quick info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} className="text-slate-400" />
                      <span className="text-slate-600">{tier.features.responses}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-slate-600">{tier.features.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 size={16} className="text-slate-400" />
                      <span className="text-slate-600">{tier.features.polls}</span>
                    </div>
                  </div>

                  {/* Feature highlights */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.highlights.map((feature, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${i === 0 && tier.id !== 'free' ? 'font-medium text-slate-700' : 'text-slate-600'}`}>
                        {i === 0 && tier.id !== 'free' ? (
                          <ArrowRight size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={tier.ctaLink}
                    className={`w-full py-3 ${colors.button} text-white font-medium rounded-xl transition flex items-center justify-center gap-2`}
                  >
                    {tier.cta}
                    <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upgrade notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-500 text-sm">
            💡 <span className="font-medium">Already have a free poll?</span> You can upgrade it anytime without losing your votes.
          </p>
        </motion.div>
      </div>

      {/* Full Comparison Table Toggle */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition flex items-center justify-center gap-2"
        >
          {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
          <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
        </button>
      </div>

      {/* Full Feature Comparison Table */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 overflow-x-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-w-[700px]">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-medium text-slate-600 w-56">Feature</th>
                  <th className="text-center p-4 font-medium text-slate-600">Free</th>
                  <th className="text-center p-4 font-medium text-blue-600">Starter</th>
                  <th className="text-center p-4 font-medium text-purple-600 bg-purple-50">Pro Event</th>
                  <th className="text-center p-4 font-medium text-amber-600">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((section) => (
                  <React.Fragment key={section.category}>
                    {/* Category header */}
                    <tr className="bg-slate-50">
                      <td colSpan={5} className="p-3 font-semibold text-slate-800">
                        {section.category}
                      </td>
                    </tr>
                    {/* Features */}
                    {section.features.map((feature, featureIndex) => (
                      <tr
                        key={feature.name}
                        className={`border-b border-slate-100 ${featureIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <td className="p-4 text-slate-700">
                          {feature.tooltip ? (
                            <Tooltip content={feature.tooltip}>
                              <span>{feature.name}</span>
                            </Tooltip>
                          ) : (
                            feature.name
                          )}
                        </td>
                        <td className="p-4 text-center"><FeatureCell value={feature.free} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.starter} /></td>
                        <td className="p-4 text-center bg-purple-50/50"><FeatureCell value={feature.proEvent} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.unlimited} /></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'What happens when I reach my response limit?',
              a: 'Your poll will stop accepting new votes when you reach the limit. You can upgrade your poll anytime to increase the limit - all your existing votes are kept!',
            },
            {
              q: 'Can I upgrade my free poll later?',
              a: 'Yes! Click any upgrade button on your poll dashboard. Your existing votes and settings are preserved, you just get more capacity and features.',
            },
            {
              q: 'How long can I view my results?',
              a: 'Results remain viewable for the data retention period (30 days for Free, 90 days for Starter, 1 year for Pro Event, 2 years for Unlimited) even after your poll closes.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, debit cards, Apple Pay, and Google Pay through our secure payment processor, Stripe.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'Yes! If you\'re not satisfied within 7 days of purchase, contact us at support@votegenerator.com for a full refund.',
            },
            {
              q: 'How does the Unlimited license work?',
              a: 'After purchase, you\'ll receive a unique license link. Bookmark it! When you visit that link, you can create unlimited premium polls for one year.',
            },
            {
              q: 'I lost my poll link. Can you help?',
              a: 'For Unlimited users, contact support@votegenerator.com with your purchase details. For one-time purchases, we recommend bookmarking your admin link immediately.',
            },
          ].map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
              <summary className="p-4 cursor-pointer font-medium text-slate-800 flex items-center justify-between">
                {faq.q}
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} />
              </summary>
              <div className="px-4 pb-4 text-slate-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Create your first poll in under 30 seconds. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create"
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
            >
              Create Free Poll
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition"
            >
              Compare Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
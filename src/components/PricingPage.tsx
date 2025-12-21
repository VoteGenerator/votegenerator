// ============================================================================
// VoteGenerator - Pricing Page Component
// 4 Tiers: Free, Starter $9.99, Pro Event $19.99, Unlimited $199/year
// ONE-TIME payments (not subscriptions)
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check, X, Zap, Calendar, Crown, Users, HelpCircle,
  BarChart3, Download, Link2, Image, Shield, Bell, Globe,
  Clock, QrCode, Lock, FileSpreadsheet, FileText, Eye,
  ArrowRight, Star, ChevronDown, Sparkles, Copy, Share2,
  CreditCard, BadgeCheck
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

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
    icon: Crown,
    color: 'purple',
    cta: 'Get Pro Event',
    ctaLink: '/checkout?tier=pro_event',
    features: {
      responses: '2,000 responses',
      duration: '60 days',
      polls: '1 poll',
      highlights: [
        'Everything in Starter, plus:',
        'Visual Poll (images)',
        'Export PDF & PNG',
        'Custom short link',
        'Remove VG branding',
        'Password protection',
        'Schedule open/close',
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
    icon: Star,
    color: 'amber',
    cta: 'Get Unlimited',
    ctaLink: '/checkout?tier=unlimited',
    features: {
      responses: '5,000 per poll',
      duration: '1 year each',
      polls: 'Unlimited polls',
      highlights: [
        'Everything in Pro Event, plus:',
        'Unlimited polls',
        'Upload your logo',
        'Email notifications',
        'Access codes',
        'Priority support',
        '2-year data retention',
      ],
    },
  },
];

// ============================================================================
// Feature Comparison Data with Tooltips (Layman Explanations)
// ============================================================================

interface FeatureRow {
  name: string;
  tooltip: string; // Plain English explanation
  free: boolean | string;
  starter: boolean | string;
  proEvent: boolean | string;
  unlimited: boolean | string;
}

const FEATURE_COMPARISON: { category: string; features: FeatureRow[] }[] = [
  {
    category: 'Limits',
    features: [
      { 
        name: 'Responses per poll', 
        tooltip: 'How many people can vote on your poll before it stops accepting votes',
        free: '50', starter: '500', proEvent: '2,000', unlimited: '5,000' 
      },
      { 
        name: 'Poll duration', 
        tooltip: 'How long your poll stays active and accepts votes',
        free: '7 days', starter: '30 days', proEvent: '60 days', unlimited: '1 year' 
      },
      { 
        name: 'Number of polls', 
        tooltip: 'How many separate polls you can create',
        free: '1', starter: '1', proEvent: '1', unlimited: 'Unlimited' 
      },
      { 
        name: 'Data retention', 
        tooltip: 'How long we keep your poll results before they\'re deleted',
        free: '30 days', starter: '90 days', proEvent: '1 year', unlimited: '2 years' 
      },
    ],
  },
  {
    category: 'Poll Types',
    features: [
      { name: 'Multiple Choice', tooltip: 'Classic poll where voters pick one or more options', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Ranked Choice', tooltip: 'Voters drag to rank options from favorite to least favorite', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'This or That', tooltip: 'Quick A vs B comparisons - voters pick one of two options', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Meeting Poll', tooltip: 'Like Doodle - find when everyone\'s available', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Rating Scale', tooltip: 'Rate each option 1-5 stars and see average scores', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'RSVP', tooltip: 'Collect Yes/No/Maybe responses for events with headcount', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Visual Poll', tooltip: 'Upload images and let people vote visually - great for design feedback', free: false, starter: false, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Sharing & Export',
    features: [
      { name: 'QR Code', tooltip: 'Auto-generated QR code to print or display on screens', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Copy link & social sharing', tooltip: 'Easy-to-share link and buttons for Twitter, Facebook, etc.', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Embed on website', tooltip: 'Copy/paste code to add the poll to your own website or blog', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Export to CSV', tooltip: 'Download results as a spreadsheet file (works with Excel, Google Sheets)', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Export to PDF', tooltip: 'Download a nicely formatted PDF report of your results', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Export to PNG', tooltip: 'Download results as an image to share on social media or presentations', free: false, starter: false, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Analytics',
    features: [
      { name: 'Real-time results', tooltip: 'See votes come in live - no refresh needed', free: true, starter: true, proEvent: true, unlimited: true },
      { name: 'Device breakdown', tooltip: 'See how many voted from mobile vs desktop vs tablet', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Geographic breakdown', tooltip: 'See which countries and regions your voters are from', free: false, starter: true, proEvent: true, unlimited: true },
    ],
  },
  {
    category: 'Branding & Customization',
    features: [
      { name: 'Custom short link', tooltip: 'Get a memorable link like votegenerator.com/p/team-lunch instead of random letters', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Remove VG branding', tooltip: 'Hide the "Powered by VoteGenerator" badge from your poll', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Upload your logo', tooltip: 'Add your company or event logo to the poll header', free: false, starter: false, proEvent: false, unlimited: true },
    ],
  },
  {
    category: 'Admin & Security',
    features: [
      { name: 'Duplicate poll', tooltip: 'Clone your poll to reuse it with fresh votes', free: false, starter: true, proEvent: true, unlimited: true },
      { name: 'Password protection', tooltip: 'Require a password to view and vote on your poll', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Schedule polls', tooltip: 'Set a future start time and automatic end time for your poll', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Share dashboard (view-only)', tooltip: 'Give others a link to see results without editing the poll', free: false, starter: false, proEvent: true, unlimited: true },
      { name: 'Access codes', tooltip: 'Give each voter a unique code to prevent duplicate votes', free: false, starter: false, proEvent: false, unlimited: true },
    ],
  },
  {
    category: 'Notifications & Support',
    features: [
      { name: 'Email notifications', tooltip: 'Get an email when someone votes or your poll ends', free: false, starter: false, proEvent: false, unlimited: true },
      { name: 'Priority email support', tooltip: 'Get faster responses from our support team', free: false, starter: false, proEvent: false, unlimited: true },
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
    <HelpCircle size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 text-center leading-relaxed">
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
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600', ring: 'ring-amber-500' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavHeader />
      
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
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-6"
        >
          Start free. Pay only when you need more.
        </motion.p>
        
        {/* ONE-TIME emphasis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl"
        >
          <BadgeCheck className="text-emerald-600" size={24} />
          <div className="text-left">
            <p className="text-emerald-900 font-semibold">One-Time Payment • Not a Subscription</p>
            <p className="text-emerald-700 text-sm">Pay once for your poll. No recurring charges. No surprises.</p>
          </div>
        </motion.div>
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
                  <div className="mt-4 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </span>
                    </div>
                    {/* One-time / yearly badge */}
                    {tier.period === 'one-time' && (
                      <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        <CreditCard size={12} />
                        One-time payment
                      </div>
                    )}
                    {tier.period === 'year' && (
                      <div>
                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                          <CreditCard size={12} />
                          Per year
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          That's ${(tier.price / 12).toFixed(2)}/mo
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick info */}
                  <div className="space-y-2 my-4 py-4 border-y border-slate-100">
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
          <p className="text-slate-600">
            <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
              <Sparkles size={16} />
              Already have a free poll?
            </span>
            {' '}You can upgrade it anytime without losing your votes.
          </p>
        </motion.div>
      </div>

      {/* Feature Comparison Toggle */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium text-slate-700 transition flex items-center justify-center gap-2"
        >
          {showComparison ? 'Hide' : 'Show'} Full Feature Comparison
          <ChevronDown className={`transition-transform ${showComparison ? 'rotate-180' : ''}`} size={20} />
        </button>
      </div>

      {/* Feature Comparison Table */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-slate-900 min-w-[200px]">Feature</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-900 w-24">Free</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-blue-700 w-24">Starter</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-purple-700 w-24 bg-purple-50">Pro Event</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-amber-700 w-24">Unlimited</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_COMPARISON.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      {/* Section header */}
                      <tr className="bg-slate-50/50">
                        <td colSpan={5} className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {section.category}
                        </td>
                      </tr>
                      {/* Features */}
                      {section.features.map((feature, featureIndex) => (
                        <tr key={featureIndex} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="py-3 px-6">
                            <Tooltip content={feature.tooltip}>
                              <span className="text-sm text-slate-700">{feature.name}</span>
                            </Tooltip>
                          </td>
                          <td className="py-3 px-4 text-center"><FeatureCell value={feature.free} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCell value={feature.starter} /></td>
                          <td className="py-3 px-4 text-center bg-purple-50/30"><FeatureCell value={feature.proEvent} /></td>
                          <td className="py-3 px-4 text-center"><FeatureCell value={feature.unlimited} /></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              q: 'Is this really a one-time payment?',
              a: 'Yes! Starter ($9.99) and Pro Event ($19.99) are one-time payments for a single poll. No recurring charges, no subscriptions. Pay once, use it until your poll ends. The only exception is Unlimited ($199/year) which gives you unlimited polls for a full year.'
            },
            {
              q: 'Can I upgrade a free poll later?',
              a: 'Absolutely! You can upgrade any poll at any time. Your existing votes are preserved. Just click "Upgrade" in your poll dashboard.'
            },
            {
              q: 'What happens when my poll expires?',
              a: 'Your poll stops accepting new votes, but you can still view and export your results. Data is retained based on your tier (30 days to 2 years).'
            },
            {
              q: 'Do I need to create an account?',
              a: 'Nope! VoteGenerator is privacy-first. No signup, no email required. You get a secret admin link to manage your poll - just bookmark it.'
            },
            {
              q: 'Can I get a refund?',
              a: 'Yes, we offer a 7-day refund policy if you haven\'t used the poll features. Contact support@votegenerator.com.'
            },
            {
              q: 'What\'s the difference between Starter and Pro Event?',
              a: 'Starter is great for basic polls with CSV export. Pro Event adds Visual Poll (image voting), PDF/PNG export, custom links, password protection, and removes VoteGenerator branding - perfect for professional or client-facing polls.'
            },
            {
              q: 'Why should I get Unlimited?',
              a: 'If you run polls regularly (monthly team surveys, recurring events, etc.), Unlimited gives you unlimited polls for a year plus all premium features including your own logo and email notifications. At $199/year, it pays for itself after about 10 Pro Event polls.'
            },
          ].map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50 transition">
                {faq.q}
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform" size={20} />
              </summary>
              <div className="px-6 pb-4 text-slate-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to create your poll?</h2>
          <p className="text-indigo-100 mb-8">Start free. No credit card required. Upgrade anytime.</p>
          <a
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
          >
            <Sparkles size={20} />
            Create Free Poll
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
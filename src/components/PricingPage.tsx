// ============================================================================
// VoteGenerator - Pricing Page Component
// Complete pricing page with tier comparison and feature breakdown
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check, X, Zap, Calendar, Crown, Sparkles, Users, HelpCircle,
  BarChart3, Download, Link2, Image, Shield, Bell, Globe, 
  Smartphone, Code, Key, Webhook, Clock, Mail, QrCode, Copy,
  Lock, FileSpreadsheet, FileText, FileImage, Eye, Palette,
  ArrowRight, Star, ChevronDown, Menu
} from 'lucide-react';

// ============================================================================
// Currency Configuration
// ============================================================================

const CURRENCY_CONFIG: Record<string, { symbol: string; rate: number; code: string }> = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  CAD: { symbol: '$', rate: 1.36, code: 'CAD' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
  AUD: { symbol: '$', rate: 1.53, code: 'AUD' },
  NZD: { symbol: '$', rate: 1.67, code: 'NZD' },
  INR: { symbol: '₹', rate: 83, code: 'INR' },
  JPY: { symbol: '¥', rate: 149, code: 'JPY' }
};

const detectCurrency = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;
    
    if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver') || locale.includes('en-CA')) return 'CAD';
    if (timezone.includes('Europe/London') || locale.includes('en-GB')) return 'GBP';
    if (timezone.includes('Australia') || locale.includes('en-AU')) return 'AUD';
    if (timezone.includes('Pacific/Auckland') || locale.includes('en-NZ')) return 'NZD';
    if (timezone.includes('Asia/Kolkata') || locale.includes('en-IN')) return 'INR';
    if (timezone.includes('Asia/Tokyo') || locale.includes('ja')) return 'JPY';
    if (timezone.includes('Europe/') && !timezone.includes('London')) return 'EUR';
    
    return 'USD';
  } catch {
    return 'USD';
  }
};

// ============================================================================
// Navigation Header
// ============================================================================

const NavHeader: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="VoteGenerator" className="w-8 h-8" />
            <span className="font-bold text-xl text-slate-900">VoteGenerator</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/create" className="text-slate-600 hover:text-slate-900 font-medium">Create Poll</a>
            <a href="/demo" className="text-slate-600 hover:text-slate-900 font-medium">Demo</a>
            <a href="/pricing" className="text-indigo-600 font-medium">Pricing</a>
            <a href="/compare" className="text-slate-600 hover:text-slate-900 font-medium">Compare</a>
            <a href="/blog" className="text-slate-600 hover:text-slate-900 font-medium">Blog</a>
            <a href="/help" className="text-slate-600 hover:text-slate-900 font-medium">Help</a>
          </nav>
          <div className="hidden md:block">
            <a href="/create" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
              Create Free Poll
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={24} />
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col gap-2">
              <a href="/create" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Create Poll</a>
              <a href="/demo" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Demo</a>
              <a href="/pricing" className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-medium">Pricing</a>
              <a href="/compare" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Compare</a>
              <a href="/blog" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Blog</a>
              <a href="/help" className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Help</a>
              <a href="/create" className="mx-4 mt-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-center">
                Create Free Poll
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// ============================================================================
// Types
// ============================================================================

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: number | string;
  priceNote?: string;
  period?: 'one-time' | 'month' | 'year';
  popular?: boolean;
  icon: React.ElementType;
  color: string;
  cta: string;
  features: {
    responses: string;
    duration: string;
    pollTypes: string;
    highlights: string[];
  };
}

// ============================================================================
// Pricing Data
// ============================================================================

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Try before you buy',
    price: 0,
    icon: Users,
    color: 'slate',
    cta: 'Start Free',
    features: {
      responses: '100 per poll',
      duration: '30 days',
      pollTypes: '3 types',
      highlights: [
        'Multiple Choice polls',
        'Ranked Choice polls',
        'This or That polls',
        'QR code sharing',
        'Real-time results',
        'Basic charts',
      ],
    },
  },
  {
    id: 'quick_poll',
    name: 'Quick Poll',
    tagline: 'Fast decisions, small teams',
    price: 5,
    period: 'one-time',
    icon: Zap,
    color: 'blue',
    cta: 'Get Quick Poll',
    features: {
      responses: '500 per poll',
      duration: '7 days',
      pollTypes: '10 types',
      highlights: [
        'Everything in Free',
        '+ Meeting Poll',
        '+ Dot Voting',
        '+ Rating Scale',
        '+ RSVP',
        '+ 6 more poll types',
        'Export to CSV',
        'Device breakdown',
        'Shareable results image',
        'Email notifications',
        'Recover lost links',
        'Response top-ups available',
      ],
    },
  },
  {
    id: 'event_poll',
    name: 'Event Poll',
    tagline: 'Events & conferences',
    price: 10,
    period: 'one-time',
    icon: Calendar,
    color: 'purple',
    cta: 'Get Event Poll',
    features: {
      responses: '2,000 per poll',
      duration: '30 days',
      pollTypes: '13 types',
      highlights: [
        'Everything in Quick Poll',
        '+ Quiz Poll',
        '+ NPS Score',
        '+ Sentiment Check',
        'Export to PDF & PNG',
        'Geographic breakdown',
        'Schedule polls in advance',
        'Password protection',
        '90-day data retention',
      ],
    },
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    tagline: 'For regular users & businesses',
    price: 12,
    period: 'month',
    priceNote: 'or $100/year (save 30%)',
    popular: true,
    icon: Crown,
    color: 'indigo',
    cta: 'Get Pro',
    features: {
      responses: '10,000/month',
      duration: 'Unlimited',
      pollTypes: 'All 16 types',
      highlights: [
        'Everything in Event Poll',
        '+ Word Cloud',
        '+ Q&A / Upvote',
        '+ Visual Poll',
        'Unified dashboard',
        'Unlimited polls',
        'Email verification (500/mo)',
        'Custom short links',
        'Upload your logo',
        'Remove VG branding',
        'Poll templates',
        'Results comparison',
        '2 team viewers',
        '1-year data retention',
      ],
    },
  },
  {
    id: 'pro_plus_monthly',
    name: 'Pro+',
    tagline: 'Power users & agencies',
    price: 19,
    period: 'month',
    priceNote: 'or $160/year (save 30%)',
    icon: Sparkles,
    color: 'amber',
    cta: 'Get Pro+',
    features: {
      responses: '50,000/month',
      duration: 'Unlimited',
      pollTypes: 'All 16 types',
      highlights: [
        'Everything in Pro',
        'Email verification (2,000/mo)',
        'See voter emails (optional)',
        'White-label embed',
        '10 team viewers',
        'Webhooks (Zapier-ready)',
        'API access',
        '2-year data retention',
        'Priority support',
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
  quick: boolean | string;
  event: boolean | string;
  pro: boolean | string;
  proPlus: boolean | string;
}

const FEATURE_COMPARISON: { category: string; features: FeatureRow[] }[] = [
  {
    category: 'Limits',
    features: [
      { name: 'Responses per poll', free: '100', quick: '500', event: '2,000', pro: '2,000', proPlus: '5,000' },
      { name: 'Monthly response cap', free: '-', quick: '-', event: '-', pro: '10,000', proPlus: '50,000' },
      { name: 'Poll duration', free: '30 days', quick: '7 days', event: '30 days', pro: 'Unlimited', proPlus: 'Unlimited' },
      { name: 'Poll management', tooltip: 'How polls are organized and accessed', free: 'One at a time', quick: 'Single purchase', event: 'Single purchase', pro: 'Dashboard', proPlus: 'Dashboard' },
      { name: 'Data retention', free: '30 days', quick: '90 days', event: '90 days', pro: '1 year', proPlus: '2 years' },
    ],
  },
  {
    category: 'Poll Types',
    features: [
      { name: 'Multiple Choice', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Ranked Choice', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'This or That', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Meeting Poll', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Dot Voting', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Rating Scale', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'RSVP', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Buy a Feature', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Priority Matrix', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Approval Voting', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Quiz Poll', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'NPS Score', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Sentiment Check', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Word Cloud', free: false, quick: false, event: false, pro: true, proPlus: true },
      { name: 'Q&A / Upvote', free: false, quick: false, event: false, pro: true, proPlus: true },
      { name: 'Visual Poll', free: false, quick: false, event: false, pro: true, proPlus: true },
    ],
  },
  {
    category: 'Sharing & Export',
    features: [
      { name: 'QR Code', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Shareable results image', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Export CSV', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Export PDF', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Export PNG', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Embed code', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'White-label embed', tooltip: 'Remove VoteGenerator branding from embeds', free: false, quick: false, event: false, pro: false, proPlus: true },
    ],
  },
  {
    category: 'Analytics',
    features: [
      { name: 'Real-time results', free: true, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Device breakdown', tooltip: 'See mobile vs desktop votes', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Geographic breakdown', tooltip: 'See which countries votes come from', free: false, quick: false, event: 'Country', pro: 'Country + Region', proPlus: 'Country + Region' },
      { name: 'Results comparison', tooltip: 'Compare results across polls', free: false, quick: false, event: false, pro: true, proPlus: true },
    ],
  },
  {
    category: 'Poll Settings',
    features: [
      { name: 'Schedule polls', tooltip: 'Set future open/close dates', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Password protection', free: false, quick: false, event: true, pro: true, proPlus: true },
      { name: 'Email verification', tooltip: 'Require voters to verify their email', free: false, quick: false, event: false, pro: '500/mo', proPlus: '2,000/mo' },
      { name: 'See voter emails', tooltip: 'View verified voter email addresses', free: false, quick: false, event: false, pro: false, proPlus: true },
      { name: 'Duplicate poll', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Poll templates', free: false, quick: false, event: false, pro: true, proPlus: true },
    ],
  },
  {
    category: 'Branding',
    features: [
      { name: 'Custom short link', tooltip: 'vote.gen/yourname instead of random ID', free: false, quick: false, event: false, pro: true, proPlus: true },
      { name: 'Upload your logo', free: false, quick: false, event: false, pro: true, proPlus: true },
      { name: 'Remove VG branding', free: false, quick: false, event: false, pro: true, proPlus: true },
    ],
  },
  {
    category: 'Notifications & Support',
    features: [
      { name: 'Email notifications', tooltip: 'Get notified about poll activity', free: false, quick: 'Limits only', event: 'Limits only', pro: 'All events', proPlus: 'All events' },
      { name: 'Recover lost links', tooltip: 'Find your poll if you lose the link', free: false, quick: true, event: true, pro: true, proPlus: true },
      { name: 'Response top-ups', tooltip: 'Add more responses without upgrading', free: false, quick: '$3/500', event: '$3/500', pro: '$5/2000', proPlus: '$5/2000' },
      { name: 'Team viewers', tooltip: 'Share admin access with colleagues', free: false, quick: false, event: false, pro: '2', proPlus: '10' },
    ],
  },
  {
    category: 'Integrations',
    features: [
      { name: 'Webhooks', tooltip: 'Send vote data to Zapier, Make, etc.', free: false, quick: false, event: false, pro: false, proPlus: true },
      { name: 'API access', tooltip: 'Create and manage polls programmatically', free: false, quick: false, event: false, pro: false, proPlus: true },
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
    <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap max-w-xs">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [showComparison, setShowComparison] = useState(false);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const formatPrice = (usdPrice: number): string => {
    const config = CURRENCY_CONFIG[currency];
    const convertedPrice = Math.round(usdPrice * config.rate);
    
    if (currency === 'JPY' || currency === 'INR') {
      return `${config.symbol}${convertedPrice.toLocaleString()}`;
    }
    
    return `${config.symbol}${convertedPrice}`;
  };

  const getPrice = (tier: PricingTier) => {
    if (tier.id === 'pro_monthly' && billingPeriod === 'yearly') {
      return { price: 100, period: 'year', perMonth: 8.33 };
    }
    if (tier.id === 'pro_plus_monthly' && billingPeriod === 'yearly') {
      return { price: 160, period: 'year', perMonth: 13.33 };
    }
    return { price: tier.price, period: tier.period };
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; button: string }> = {
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', button: 'bg-slate-800 hover:bg-slate-900' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', button: 'bg-indigo-600 hover:bg-indigo-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', button: 'bg-amber-600 hover:bg-amber-700' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation Header */}
      <NavHeader />
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Start free. Pay only when you need more. No subscriptions required for quick polls.
        </motion.p>

        {/* Billing toggle for subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-xl"
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              billingPeriod === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              billingPeriod === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
              Save 30%
            </span>
          </button>
        </motion.div>

        {/* Currency Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center justify-center gap-2"
        >
          <Globe size={14} className="text-slate-400" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-600 font-medium cursor-pointer focus:ring-0 focus:outline-none"
          >
            <option value="USD">🇺🇸 USD</option>
            <option value="CAD">🇨🇦 CAD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
            <option value="AUD">🇦🇺 AUD</option>
            <option value="NZD">🇳🇿 NZD</option>
            <option value="INR">🇮🇳 INR</option>
            <option value="JPY">🇯🇵 JPY</option>
          </select>
        </motion.div>
      </div>

      {/* Pricing Cards - Horizontally scrollable on mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-4 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5">
            {TIERS.map((tier, index) => {
            const priceInfo = getPrice(tier);
            const colors = colorClasses[tier.color];
            const Icon = tier.icon;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`relative rounded-2xl border-2 ${tier.popular ? 'border-indigo-500 shadow-xl' : 'border-slate-200'} bg-white overflow-hidden w-[280px] lg:w-auto flex-shrink-0`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-indigo-600 text-white text-center py-1 text-sm font-medium">
                    <Star className="inline-block mr-1" size={14} />
                    Most Popular
                  </div>
                )}

                <div className={`p-6 ${tier.popular ? 'pt-10' : ''}`}>
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
                        {typeof priceInfo.price === 'number' ? formatPrice(priceInfo.price) : priceInfo.price}
                      </span>
                      {priceInfo.period && priceInfo.period !== 'one-time' && (
                        <span className="text-slate-500">
                          /{priceInfo.period}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 ml-1">{currency}</span>
                    </div>
                    {tier.period === 'one-time' && (
                      <span className="text-sm text-slate-500">one-time payment</span>
                    )}
                    {'perMonth' in priceInfo && priceInfo.perMonth && (
                      <span className="text-sm text-emerald-600">
                        ({formatPrice(priceInfo.perMonth)}/mo)
                      </span>
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
                      <span className="text-slate-600">{tier.features.pollTypes}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <a 
                    href={tier.id === 'free' ? '/create.html' : `/checkout?plan=${tier.id}`}
                    className={`w-full py-3 ${colors.button} text-white font-medium rounded-xl transition flex items-center justify-center gap-2`}
                  >
                    {tier.cta}
                    <ArrowRight size={18} />
                  </a>

                  {/* Feature highlights */}
                  <ul className="mt-6 space-y-2">
                    {tier.features.highlights.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-2 lg:hidden">
          ← Swipe to see all plans →
        </p>
      </div>

      {/* Full Comparison Table Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 overflow-x-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-4 font-medium text-slate-600 w-64">Feature</th>
                  <th className="text-center p-4 font-medium text-slate-600">Free</th>
                  <th className="text-center p-4 font-medium text-blue-600">Quick Poll</th>
                  <th className="text-center p-4 font-medium text-purple-600">Event Poll</th>
                  <th className="text-center p-4 font-medium text-indigo-600 bg-indigo-50">Pro</th>
                  <th className="text-center p-4 font-medium text-amber-600">Pro+</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((section, sectionIndex) => (
                  <React.Fragment key={section.category}>
                    {/* Category header */}
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="p-3 font-semibold text-slate-800">
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
                        <td className="p-4 text-center"><FeatureCell value={feature.quick} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.event} /></td>
                        <td className="p-4 text-center bg-indigo-50/50"><FeatureCell value={feature.pro} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.proPlus} /></td>
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
              a: 'Your poll will automatically close when you reach the response limit. You can purchase additional responses (top-ups) without changing your plan, or upgrade for more capacity.',
            },
            {
              q: 'Do one-time purchases expire?',
              a: 'Quick Poll gives you 7 days, Event Poll gives you 30 days. After that, your poll closes but you can still view results for the data retention period (90 days for one-time purchases).',
            },
            {
              q: "What's the difference between one-time and subscription?",
              a: 'One-time purchases (Quick Poll, Event Poll) are perfect for single events. Subscriptions (Pro, Pro+) are for ongoing use with a unified dashboard to manage multiple polls.',
            },
            {
              q: 'Can I upgrade mid-poll?',
              a: 'Yes! You can add response top-ups to any active poll, or upgrade your subscription. Your existing polls will immediately benefit from the new limits.',
            },
            {
              q: "What if I need more than Pro+ offers?",
              a: "Contact us for enterprise pricing. We offer custom limits, SLA guarantees, dedicated support, and SSO/SAML authentication for larger organizations.",
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
      <div className="bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Create your first poll in under a minute. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/create"
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition"
            >
              Create Free Poll
            </a>
            <a
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition"
            >
              Compare Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
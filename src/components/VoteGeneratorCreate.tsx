import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Plus, Trash2, Crown, Sparkles, Star, AlertCircle,
  ChevronDown, ChevronUp, Loader2, Check, Lock, ArrowRight,
  Users, Clock, Info, Home, Zap
} from 'lucide-react';
import { 
  getUserSession, 
  addPollToSession, 
  isPaidUser, 
  canCreateMorePolls,
  getUserTier
} from './userSessionService';

// Poll type definitions
const POLL_TYPES = [
  { id: 'multiple_choice', name: 'Multiple Choice', tier: 'free', icon: '📊' },
  { id: 'ranked_choice', name: 'Ranked Choice', tier: 'free', icon: '🏆' },
  { id: 'this_or_that', name: 'This or That', tier: 'free', icon: '⚖️' },
  { id: 'meeting_poll', name: 'Meeting Poll', tier: 'starter', icon: '📅' },
  { id: 'dot_voting', name: 'Dot Voting', tier: 'starter', icon: '🔵' },
  { id: 'rating_scale', name: 'Rating Scale', tier: 'starter', icon: '⭐' },
  { id: 'approval_voting', name: 'Approval Voting', tier: 'starter', icon: '✅' },
  { id: 'priority_matrix', name: 'Priority Matrix', tier: 'starter', icon: '📌' },
  { id: 'quiz_poll', name: 'Quiz Poll', tier: 'pro_event', icon: '❓' },
  { id: 'sentiment_check', name: 'Sentiment Check', tier: 'pro_event', icon: '💭' },
  { id: 'visual_poll', name: 'Visual Poll', tier: 'pro_event', icon: '🖼️' },
  { id: 'buy_a_feature', name: 'Buy a Feature', tier: 'unlimited', icon: '💰' },
];

const TIER_HIERARCHY = ['free', 'starter', 'pro_event', 'unlimited'];

const TIER_CONFIG: Record<string, { label: string; gradient: string; icon: React.ReactNode }> = {
  free: { label: 'Free', gradient: 'from-slate-400 to-slate-500', icon: <BarChart3 size={16} /> },
  starter: { label: 'Starter', gradient: 'from-blue-500 to-indigo-500', icon: <Star size={16} /> },
  pro_event: { label: 'Pro Event', gradient: 'from-purple-500 to-pink-500', icon: <Crown size={16} /> },
  unlimited: { label: 'Unlimited', gradient: 'from-amber-500 to-orange-500', icon: <Sparkles size={16} /> },
};

function canAccessPollType(userTier: string, pollTypeTier: string): boolean {
  const userIndex = TIER_HIERARCHY.indexOf(userTier);
  const pollIndex = TIER_HIERARCHY.indexOf(pollTypeTier);
  return userIndex >= pollIndex;
}

export default function VoteGeneratorCreate() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollType, setPollType] = useState('multiple_choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState({
    allowMultiple: false,
    hideResults: false,
    requireNames: false,
    endDate: '',
  });

  const userTier = getUserTier();
  const isPaid = isPaidUser();
  const canCreate = canCreateMorePolls();
  const config = TIER_CONFIG[userTier];

  // Check if user has reached their limit
  useEffect(() => {
    if (!canCreate) {
      // Redirect to dashboard with upgrade prompt
      window.location.href = '/admin';
    }
  }, [canCreate]);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    const validOptions = options.filter(o => o.trim());
    if (validOptions.length < 2) {
      setError('Please add at least 2 options');
      return;
    }

    // Check poll type access
    const pollTypeConfig = POLL_TYPES.find(p => p.id === pollType);
    if (pollTypeConfig && !canAccessPollType(userTier, pollTypeConfig.tier)) {
      setError(`${pollTypeConfig.name} requires ${TIER_CONFIG[pollTypeConfig.tier].label} plan or higher`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/.netlify/functions/vg-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions,
          pollType,
          settings,
          tier: userTier, // Pass user's tier to backend
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create poll');
      }

      const data = await response.json();
      
      // Add poll to user's session
      addPollToSession({
        id: data.pollId,
        adminKey: data.adminKey,
        title: question.trim(),
        type: pollType,
        createdAt: new Date().toISOString(),
        responseCount: 0,
        status: 'active',
      });

      // Route based on tier
      if (isPaid) {
        // Paid users go directly to their specific poll admin
        window.location.href = `/admin/${data.pollId}/${data.adminKey}`;
      } else {
        // Free users go through ad wall first
        const adminUrl = encodeURIComponent(`/admin/${data.pollId}/${data.adminKey}`);
        window.location.href = `/ad-wall?redirect=${adminUrl}`;
      }
    } catch (err) {
      console.error('Create error:', err);
      setError('Failed to create poll. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={22} />
              </div>
              <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
            </a>
            
            {isPaid && (
              <a
                href="/admin"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
              >
                <Home size={16} />
                Dashboard
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Paid Tier Banner */}
      {isPaid && (
        <div className={`bg-gradient-to-r ${config.gradient} text-white py-3`}>
          <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className="font-medium">{config.label} Plan Active</span>
              <span className="text-white/80">• No ads, premium features unlocked!</span>
            </div>
            <Check size={18} />
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create a Poll</h1>
          <p className="text-slate-500 mb-6">Get group decisions made quickly and fairly.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What should we have for dinner?"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                disabled={isSubmitting}
              />
            </div>

            {/* Poll Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Poll Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {POLL_TYPES.map((type) => {
                  const canAccess = canAccessPollType(userTier, type.tier);
                  const tierConfig = TIER_CONFIG[type.tier];
                  
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => canAccess && setPollType(type.id)}
                      disabled={!canAccess || isSubmitting}
                      className={`relative p-3 rounded-xl border-2 text-left transition ${
                        pollType === type.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : canAccess
                          ? 'border-slate-200 hover:border-slate-300'
                          : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className={`text-sm font-medium ${canAccess ? 'text-slate-700' : 'text-slate-400'}`}>
                          {type.name}
                        </span>
                      </div>
                      
                      {!canAccess && (
                        <div className={`absolute top-1 right-1 px-1.5 py-0.5 bg-gradient-to-r ${tierConfig.gradient} text-white text-[10px] rounded-full flex items-center gap-1`}>
                          <Lock size={8} />
                          {tierConfig.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      disabled={isSubmitting}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {options.length < 10 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  <Plus size={16} />
                  Add Option
                </button>
              )}
            </div>

            {/* Advanced Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm"
            >
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Advanced Settings
            </button>

            {/* Advanced Settings */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.hideResults}
                        onChange={(e) => setSettings({ ...settings, hideResults: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-slate-700">Hide results until voting ends</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireNames}
                        onChange={(e) => setSettings({ ...settings, requireNames: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-slate-700">Require voter names</span>
                    </label>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        End Date (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={settings.endDate}
                        onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Poll
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Info Note */}
            {!isPaid && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <Info size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-500">
                  Free polls include a short ad before viewing your admin dashboard. 
                  <a href="/pricing" className="text-indigo-600 hover:text-indigo-700 ml-1">
                    Upgrade to skip ads →
                  </a>
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  );
}
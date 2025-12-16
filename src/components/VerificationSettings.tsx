// ============================================================================
// VoteGenerator - Verification Settings Component
// Settings section for poll creators to enable email verification
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Mail, Eye, Lock, AlertTriangle, Crown, 
  Info, Check, ChevronDown, ChevronUp, Users
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface VerificationSettingsProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  creatorCanSeeEmails: boolean;
  onCreatorCanSeeEmailsChange: (canSee: boolean) => void;
  tier: string;
  verificationLimit: number;
  verificationsUsed: number;
}

// ============================================================================
// Helper Components
// ============================================================================

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    } ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const Tooltip: React.FC<{ children: React.ReactNode; content: string }> = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap max-w-xs"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const VerificationSettings: React.FC<VerificationSettingsProps> = ({
  enabled,
  onEnabledChange,
  creatorCanSeeEmails,
  onCreatorCanSeeEmailsChange,
  tier,
  verificationLimit,
  verificationsUsed,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Tier checks
  const isProPlus = tier.includes('pro_plus');
  const isPro = tier.includes('pro');
  const canUseVerification = isPro; // Pro and Pro+ only
  const canSeeEmails = isProPlus; // Pro+ only
  
  // Usage
  const usagePercent = verificationLimit > 0 ? (verificationsUsed / verificationLimit) * 100 : 0;
  const remainingVerifications = Math.max(0, verificationLimit - verificationsUsed);
  const isNearLimit = usagePercent >= 80;
  const isAtLimit = usagePercent >= 100;

  // If tier doesn't support verification, show upgrade prompt
  if (!canUseVerification) {
    return (
      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="text-slate-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-1">Email Verification</h3>
            <p className="text-sm text-slate-500 mb-4">
              Require voters to verify their email before voting. Prevents duplicate votes 
              and spam.
            </p>
            <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <Crown className="text-indigo-600" size={18} />
              <span className="text-sm text-indigo-700">
                Available on <strong>Pro</strong> and <strong>Pro+</strong> plans
              </span>
              <a 
                href="/pricing" 
                className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Upgrade →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Main toggle */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              enabled ? 'bg-indigo-100' : 'bg-slate-100'
            }`}>
              <Shield className={enabled ? 'text-indigo-600' : 'text-slate-400'} size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                Email Verification
                <Tooltip content="Voters must verify their email before voting">
                  <Info size={14} className="text-slate-400 cursor-help" />
                </Tooltip>
              </h3>
              <p className="text-sm text-slate-500">
                Require voters to enter and verify their email address before they can vote.
                Each email can only vote once.
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={enabled}
            onChange={onEnabledChange}
            disabled={isAtLimit}
          />
        </div>

        {/* Usage indicator */}
        {enabled && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Verifications Used</span>
              <span className={`font-medium ${isNearLimit ? 'text-amber-600' : 'text-slate-800'}`}>
                {verificationsUsed.toLocaleString()} / {verificationLimit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            {isNearLimit && !isAtLimit && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ {remainingVerifications.toLocaleString()} verifications remaining this month
              </p>
            )}
            {isAtLimit && (
              <p className="text-xs text-red-600 mt-2">
                🛑 Monthly verification limit reached. Upgrade for more.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Warning when enabled */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 overflow-hidden"
          >
            <div className="p-4 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    This may reduce participation by 20-30%
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Email verification adds friction. Use it when preventing duplicate votes 
                    is more important than maximizing participation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced settings (Pro+ only) */}
      {enabled && (
        <div className="border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <span className="font-medium">Advanced Settings</span>
            {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  {/* Creator can see emails - Pro+ only */}
                  <div className={`p-4 rounded-lg border ${canSeeEmails ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          canSeeEmails && creatorCanSeeEmails ? 'bg-purple-100' : 'bg-slate-100'
                        }`}>
                          <Eye className={canSeeEmails && creatorCanSeeEmails ? 'text-purple-600' : 'text-slate-400'} size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800 flex items-center gap-2">
                            See Voter Emails
                            {!canSeeEmails && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                                Pro+
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {canSeeEmails 
                              ? 'View email addresses of verified voters in results'
                              : 'Upgrade to Pro+ to see voter email addresses'
                            }
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={creatorCanSeeEmails}
                        onChange={onCreatorCanSeeEmailsChange}
                        disabled={!canSeeEmails}
                      />
                    </div>

                    {canSeeEmails && creatorCanSeeEmails && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <Users className="text-purple-600 flex-shrink-0 mt-0.5" size={16} />
                          <p className="text-xs text-purple-700">
                            Voters will see a warning that you can view their email address. 
                            This is best for internal company polls, not public votes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* What voters see */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      What voters will see:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500" />
                        Email input form before voting
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500" />
                        6-digit verification code sent to their email
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500" />
                        Code expires in 10 minutes
                      </li>
                      {creatorCanSeeEmails && (
                        <li className="flex items-center gap-2 text-sm text-amber-600">
                          <AlertTriangle size={14} />
                          Warning that creator will see their email
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VerificationSettings;

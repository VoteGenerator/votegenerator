// ============================================================================
// VoteGenerator - Email Verification Component
// Handles the complete email verification flow for voters
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Send, Shield, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, ArrowLeft, Lock, Clock, Eye, EyeOff, Loader2
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface EmailVerificationProps {
  pollId: string;
  pollQuestion: string;
  creatorCanSeeEmails?: boolean;
  onVerified: (voteToken: string, email: string) => void;
  onCancel: () => void;
}

type VerificationStep = 
  | 'email_input'
  | 'email_confirm'
  | 'sending'
  | 'code_input'
  | 'verifying'
  | 'success'
  | 'error';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  voteToken?: string;
  codeExpiresIn?: number;
  attemptsRemaining?: number;
  retryAfter?: number;
  alreadySent?: boolean;
  expired?: boolean;
  locked?: boolean;
}

// ============================================================================
// Component
// ============================================================================

const EmailVerification: React.FC<EmailVerificationProps> = ({
  pollId,
  pollQuestion,
  creatorCanSeeEmails = false,
  onVerified,
  onCancel,
}) => {
  // State
  const [step, setStep] = useState<VerificationStep>('email_input');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showEmail, setShowEmail] = useState(true);

  // Refs
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // ========================================
  // Timer Effects
  // ========================================

  // Code expiration countdown
  useEffect(() => {
    if (!codeExpiresAt || step !== 'code_input') return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((codeExpiresAt.getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setError('Code expired. Please request a new one.');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [codeExpiresAt, step]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus email input on mount
  useEffect(() => {
    if (step === 'email_input' && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  // ========================================
  // API Calls
  // ========================================

  const requestVerificationCode = useCallback(async () => {
    setError(null);
    setStep('sending');

    try {
      const response = await fetch('/api/verify/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, email }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to send verification code');
        setStep('email_input');
        return;
      }

      // Set expiration timer
      if (data.codeExpiresIn) {
        const expiresAt = new Date(Date.now() + data.codeExpiresIn * 1000);
        setCodeExpiresAt(expiresAt);
        setTimeRemaining(data.codeExpiresIn);
      }

      // Set resend cooldown (60 seconds)
      setResendCooldown(60);

      // Move to code input
      setStep('code_input');
      setCode(['', '', '', '', '', '']);

      // Focus first code input after a short delay
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      console.error('Request verification error:', err);
      setError('Network error. Please check your connection and try again.');
      setStep('email_input');
    }
  }, [pollId, email]);

  const verifyCode = useCallback(async (fullCode: string) => {
    setError(null);
    setStep('verifying');

    try {
      const response = await fetch('/api/verify/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, email, code: fullCode }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }

        if (data.expired || data.locked) {
          // Need to request new code
          setError(data.error || 'Please request a new code');
          setStep('email_input');
        } else {
          // Wrong code, can try again
          setError(data.error || 'Incorrect code');
          setStep('code_input');
          // Clear code inputs
          setCode(['', '', '', '', '', '']);
          codeInputRefs.current[0]?.focus();
        }
        return;
      }

      // Success!
      setStep('success');
      
      // Call onVerified after animation
      setTimeout(() => {
        if (data.voteToken) {
          onVerified(data.voteToken, email);
        }
      }, 1500);

    } catch (err) {
      console.error('Verify code error:', err);
      setError('Network error. Please try again.');
      setStep('code_input');
    }
  }, [pollId, email, onVerified]);

  // ========================================
  // Event Handlers
  // ========================================

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setStep('email_confirm');
  };

  const handleConfirmEmail = () => {
    requestVerificationCode();
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance to next input
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (digit && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace when current is empty
      codeInputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedText.length === 6) {
      const newCode = pastedText.split('');
      setCode(newCode);
      verifyCode(pastedText);
    }
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    requestVerificationCode();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ========================================
  // Render Functions
  // ========================================

  const renderEmailInput = () => (
    <motion.div
      key="email_input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-indigo-600" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Verify Your Email</h2>
          <p className="text-slate-500 mt-1">
            We'll send you a code to verify your vote
          </p>
        </div>

        {/* Creator can see emails warning */}
        {creatorCanSeeEmails && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-amber-800">
                  The poll creator will see your email
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  This is an internal poll where the organizer needs to know who voted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <XCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Send Verification Code
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition"
        >
          Cancel
        </button>
      </form>
    </motion.div>
  );

  const renderEmailConfirm = () => (
    <motion.div
      key="email_confirm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="text-blue-600" size={28} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Confirm Your Email</h2>
      <p className="text-slate-500 mb-6">We'll send a verification code to:</p>

      <div className="bg-slate-100 rounded-xl p-4 mb-6 flex items-center justify-center gap-2">
        <span className="font-mono text-lg text-slate-800">{email}</span>
        <button
          onClick={() => setShowEmail(!showEmail)}
          className="p-1 text-slate-400 hover:text-slate-600"
        >
          {showEmail ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep('email_input')}
          className="flex-1 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Change Email
        </button>
        <button
          onClick={handleConfirmEmail}
          className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Send Code
        </button>
      </div>
    </motion.div>
  );

  const renderSending = () => (
    <motion.div
      key="sending"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-8"
    >
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Sending Code...</h2>
      <p className="text-slate-500">Check your inbox in a moment</p>
    </motion.div>
  );

  const renderCodeInput = () => (
    <motion.div
      key="code_input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-emerald-600" size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Enter Verification Code</h2>
        <p className="text-slate-500 mt-1">
          We sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* Timer */}
      <div className={`flex items-center justify-center gap-2 mb-6 ${timeRemaining <= 60 ? 'text-amber-600' : 'text-slate-500'}`}>
        <Clock size={16} />
        <span className="text-sm font-medium">
          Code expires in {formatTime(timeRemaining)}
        </span>
      </div>

      {/* Code inputs */}
      <div className="flex justify-center gap-2 mb-6" onPaste={handleCodePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (codeInputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleCodeKeyDown(index, e)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
              error ? 'border-red-300 bg-red-50' : 'border-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          <XCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Attempts remaining */}
      {attemptsRemaining !== null && attemptsRemaining < 5 && (
        <p className="text-center text-amber-600 text-sm mb-4">
          {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining
        </p>
      )}

      {/* Resend */}
      <div className="text-center">
        <p className="text-slate-500 text-sm mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResendCode}
          disabled={resendCooldown > 0}
          className={`inline-flex items-center gap-2 text-sm font-medium transition ${
            resendCooldown > 0 
              ? 'text-slate-400 cursor-not-allowed' 
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          <RefreshCw size={16} className={resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform duration-500'} />
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
        </button>
      </div>

      {/* Back to email */}
      <button
        onClick={() => setStep('email_input')}
        className="w-full mt-6 py-3 text-slate-500 font-medium hover:text-slate-700 transition flex items-center justify-center gap-2"
      >
        <ArrowLeft size={18} />
        Use Different Email
      </button>
    </motion.div>
  );

  const renderVerifying = () => (
    <motion.div
      key="verifying"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-8"
    >
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying...</h2>
      <p className="text-slate-500">Just a moment</p>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="text-emerald-600" size={40} />
      </motion.div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h2>
      <p className="text-slate-500">Redirecting you to vote...</p>
    </motion.div>
  );

  // ========================================
  // Main Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Poll question context */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border-l-4 border-indigo-500">
          <p className="text-xs text-slate-500 mb-1">You're voting on:</p>
          <p className="font-medium text-slate-800 line-clamp-2">{pollQuestion}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email_input' && renderEmailInput()}
          {step === 'email_confirm' && renderEmailConfirm()}
          {step === 'sending' && renderSending()}
          {step === 'code_input' && renderCodeInput()}
          {step === 'verifying' && renderVerifying()}
          {step === 'success' && renderSuccess()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailVerification;
// ============================================================================
// VoteGenerator - Verification Confirm Endpoint
// POST /api/verify/confirm
// Validates verification code and issues vote token
// ============================================================================

import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';
import { 
  isValidEmail, 
  normalizeEmail, 
  hashEmail, 
  hashIP 
} from '../../src/services/emailUtils';

// ============================================================================
// Configuration
// ============================================================================

const EMAIL_HASH_SECRET = process.env.EMAIL_HASH_SECRET || 'change-me-in-production';
const VOTE_TOKEN_SECRET = process.env.VOTE_TOKEN_SECRET || 'change-me-in-production';

const MAX_ATTEMPTS = 5;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// ============================================================================
// Types
// ============================================================================

interface PendingVerification {
  code: string;
  attempts: number;
  createdAt: string;
  expiresAt: string;
  ipHash: string;
}

interface CompletedVerification {
  verifiedAt: string;
  emailHash: string;
  email?: string; // Only stored if creatorCanSeeEmails is true
}

interface Poll {
  id: string;
  question: string;
  settings: {
    requireVerification?: boolean;
    creatorCanSeeEmails?: boolean;
  };
  plan: {
    tier: string;
  };
  verificationCount?: number;
}

// ============================================================================
// Token Generation
// ============================================================================

/**
 * Generate a secure vote token that allows voting
 * Token includes: pollId, emailHash, expiration, signature
 */
function generateVoteToken(pollId: string, emailHash: string): string {
  const payload = {
    pid: pollId,
    ehash: emailHash,
    exp: Date.now() + (60 * 60 * 1000), // 1 hour expiration
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  
  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString).toString('base64url');
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', VOTE_TOKEN_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a vote token
 */
export function verifyVoteToken(token: string): { valid: boolean; pollId?: string; emailHash?: string; error?: string } {
  try {
    const [payloadBase64, signature] = token.split('.');
    
    if (!payloadBase64 || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', VOTE_TOKEN_SECRET)
      .update(payloadBase64)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }
    
    // Decode payload
    const payloadString = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadString);
    
    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Token expired' };
    }
    
    return { 
      valid: true, 
      pollId: payload.pid, 
      emailHash: payload.ehash 
    };
    
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

// ============================================================================
// Handler
// ============================================================================

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ success: false, error: 'Method not allowed' }) 
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { pollId, email, code } = body;

    // Validate required fields
    if (!pollId || !email || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Poll ID, email, and code are required' 
        }),
      };
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid email address' 
        }),
      };
    }

    // Validate code format (6 digits)
    const codeClean = code.toString().replace(/\s/g, '');
    if (!/^\d{6}$/.test(codeClean)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid code format. Please enter the 6-digit code.' 
        }),
      };
    }

    // Get stores
    const pollsStore = getStore('polls');
    const verifyStore = getStore('verification');

    // Get poll
    let poll: Poll;
    try {
      poll = await pollsStore.get(pollId, { type: 'json' }) as Poll;
    } catch {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'Poll not found' }),
      };
    }

    if (!poll) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'Poll not found' }),
      };
    }

    // Create email hash
    const emailHash = hashEmail(email, pollId, EMAIL_HASH_SECRET);
    const pendingKey = `pending:${pollId}:${emailHash}`;
    const completedKey = `complete:${pollId}:${emailHash}`;

    // Check if already verified
    try {
      const completed = await verifyStore.get(completedKey, { type: 'json' });
      if (completed) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'This email has already voted on this poll' 
          }),
        };
      }
    } catch {
      // Not verified yet, continue
    }

    // Get pending verification
    let pending: PendingVerification | null = null;
    try {
      pending = await verifyStore.get(pendingKey, { type: 'json' }) as PendingVerification;
    } catch {
      // No pending verification
    }

    if (!pending) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'No verification code found. Please request a new code.' 
        }),
      };
    }

    // Check if code expired
    if (new Date(pending.expiresAt) < new Date()) {
      // Delete expired pending verification
      await verifyStore.delete(pendingKey);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Verification code has expired. Please request a new code.',
          expired: true,
        }),
      };
    }

    // Check if too many attempts
    if (pending.attempts >= MAX_ATTEMPTS) {
      // Delete pending verification
      await verifyStore.delete(pendingKey);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Too many incorrect attempts. Please request a new code.',
          locked: true,
        }),
      };
    }

    // Compare codes (constant-time comparison to prevent timing attacks)
    const codeMatches = crypto.timingSafeEqual(
      Buffer.from(pending.code),
      Buffer.from(codeClean)
    );

    if (!codeMatches) {
      // Increment attempts
      pending.attempts += 1;
      await verifyStore.setJSON(pendingKey, pending);
      
      const attemptsRemaining = MAX_ATTEMPTS - pending.attempts;
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`,
          attemptsRemaining,
        }),
      };
    }

    // ========================================
    // CODE IS CORRECT - Complete verification
    // ========================================

    // Delete pending verification
    await verifyStore.delete(pendingKey);

    // Create completed verification record
    const completedVerification: CompletedVerification = {
      verifiedAt: new Date().toISOString(),
      emailHash,
    };

    // If creator can see emails (Pro+ feature), store the email
    if (poll.settings?.creatorCanSeeEmails) {
      completedVerification.email = normalizeEmail(email);
    }

    await verifyStore.setJSON(completedKey, completedVerification);

    // Increment poll verification count
    poll.verificationCount = (poll.verificationCount || 0) + 1;
    await pollsStore.setJSON(pollId, poll);

    // Generate vote token
    const voteToken = generateVoteToken(pollId, emailHash);

    // Success!
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email verified! You can now vote.',
        voteToken,
        expiresIn: 3600, // 1 hour in seconds
      }),
    };

  } catch (error) {
    console.error('Verification confirm error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      }),
    };
  }
};

// Export for use in vote submission endpoint


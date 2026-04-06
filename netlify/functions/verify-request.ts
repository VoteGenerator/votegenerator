// ============================================================================
// VoteGenerator - Verification Request Endpoint
// POST /api/verify/request
// Sends verification code to voter's email
// ============================================================================

import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { Resend } from 'resend';
import { 
  isValidEmail, 
  isDisposableEmail, 
  normalizeEmail, 
  hashEmail, 
  hashIP,
  generateVerificationCode,
  getCodeExpiration 
} from '../../src/services/emailUtils';

// ============================================================================
// Configuration
// ============================================================================

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_HASH_SECRET = process.env.EMAIL_HASH_SECRET || (() => { throw new Error('EMAIL_HASH_SECRET env var not set'); })();
const RATE_LIMITS = {
  // Max verification requests per IP per hour
  perIP: { max: 10, windowMs: 3600000 },
  // Max codes sent to same email per hour
  perEmail: { max: 3, windowMs: 3600000 },
};

const TIER_LIMITS = {
  pro_monthly: 500,
  pro_yearly: 500,
  pro_plus_monthly: 2000,
  pro_plus_yearly: 2000,
};

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

interface RateLimitEntry {
  count: number;
  windowStart: string;
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
// Rate Limiting Helpers
// ============================================================================

async function checkRateLimit(
  store: ReturnType<typeof getStore>,
  key: string,
  limit: { max: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; retryAfter?: number }> {
  const now = Date.now();
  
  try {
    const data = await store.get(key, { type: 'json' }) as RateLimitEntry | null;
    
    if (!data) {
      // First request in window
      await store.setJSON(key, { count: 1, windowStart: new Date().toISOString() });
      return { allowed: true, remaining: limit.max - 1 };
    }
    
    const windowStart = new Date(data.windowStart).getTime();
    const windowEnd = windowStart + limit.windowMs;
    
    if (now > windowEnd) {
      // Window expired, start new one
      await store.setJSON(key, { count: 1, windowStart: new Date().toISOString() });
      return { allowed: true, remaining: limit.max - 1 };
    }
    
    if (data.count >= limit.max) {
      // Limit exceeded
      const retryAfter = Math.ceil((windowEnd - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }
    
    // Increment counter
    await store.setJSON(key, { count: data.count + 1, windowStart: data.windowStart });
    return { allowed: true, remaining: limit.max - data.count - 1 };
    
  } catch (error) {
    // On error, allow request but log it
    console.error('Rate limit check error:', error);
    return { allowed: true, remaining: limit.max };
  }
}

// ============================================================================
// Email Template
// ============================================================================

function getEmailHtml(code: string, pollQuestion: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Voting Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 420px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 0; text-align: center;">
              <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <span style="font-size: 24px;">📊</span>
              </div>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #111827;">
                Your Voting Code
              </h1>
              <p style="margin: 0; font-size: 15px; color: #6b7280;">
                Enter this code to verify your vote
              </p>
            </td>
          </tr>
          
          <!-- Poll Question -->
          <tr>
            <td style="padding: 24px 32px;">
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px; border-left: 4px solid #6366f1;">
                <p style="margin: 0; font-size: 14px; color: #6b7280; margin-bottom: 4px;">You're voting on:</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">"${pollQuestion}"</p>
              </div>
            </td>
          </tr>
          
          <!-- Code Box -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; border-radius: 16px; padding: 24px; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #0369a1; text-transform: uppercase; letter-spacing: 1px;">
                  Your 6-Digit Code
                </p>
                <p style="margin: 0; font-size: 40px; font-weight: 700; color: #0c4a6e; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${code}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Expiration Warning -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center;">
                <span style="font-size: 16px; margin-right: 8px;">⏱️</span>
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  This code expires in <strong>10 minutes</strong>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Help Text -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
                If you didn't request this code, you can safely ignore this email.
                Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 16px 16px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                Sent by <a href="https://votegenerator.com" style="color: #6366f1; text-decoration: none; font-weight: 500;">VoteGenerator</a>
                <br>
                Privacy-first polling for everyone
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function getEmailText(code: string, pollQuestion: string): string {
  return `
Your VoteGenerator Verification Code
=====================================

You're voting on: "${pollQuestion}"

Your 6-digit code: ${code}

This code expires in 10 minutes.

If you didn't request this code, you can safely ignore this email.

---
Sent by VoteGenerator
https://votegenerator.com
  `.trim();
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
    const { pollId, email } = body;

    // Validate required fields
    if (!pollId || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Poll ID and email are required' 
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
          error: 'Please enter a valid email address' 
        }),
      };
    }

    // Check for disposable email
    if (isDisposableEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Temporary email addresses are not allowed. Please use your real email.' 
        }),
      };
    }

    // Get stores
    const pollsStore = getStore('polls');
    const verifyStore = getStore('verification');
    const rateLimitStore = getStore('ratelimits');

    // Get poll and verify it exists and requires verification
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

    if (!poll.settings?.requireVerification) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'This poll does not require email verification' 
        }),
      };
    }

    // Check tier limits for verification
    const tierLimit = TIER_LIMITS[poll.plan.tier as keyof typeof TIER_LIMITS];
    if (tierLimit && (poll.verificationCount || 0) >= tierLimit) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'This poll has reached its verification limit' 
        }),
      };
    }

    // Get IP and create hashes
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                     event.headers['client-ip'] || 
                     'unknown';
    const ipHash = hashIP(clientIP, EMAIL_HASH_SECRET);
    const normalizedEmail = normalizeEmail(email);
    const emailHash = hashEmail(email, pollId, EMAIL_HASH_SECRET);

    // Check IP rate limit
    const ipRateLimit = await checkRateLimit(
      rateLimitStore,
      `verify:ip:${ipHash}`,
      RATE_LIMITS.perIP
    );

    if (!ipRateLimit.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Too many requests. Please try again later.',
          retryAfter: ipRateLimit.retryAfter,
        }),
      };
    }

    // Check email rate limit
    const emailRateLimit = await checkRateLimit(
      rateLimitStore,
      `verify:email:${emailHash}`,
      RATE_LIMITS.perEmail
    );

    if (!emailRateLimit.allowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Too many codes sent to this email. Check your inbox or spam folder.',
          retryAfter: emailRateLimit.retryAfter,
        }),
      };
    }

    // Check if already verified for this poll
    const completedKey = `complete:${pollId}:${emailHash}`;
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

    // Check if there's a valid pending verification
    const pendingKey = `pending:${pollId}:${emailHash}`;
    try {
      const existing = await verifyStore.get(pendingKey, { type: 'json' }) as PendingVerification | null;
      if (existing && new Date(existing.expiresAt) > new Date()) {
        // Valid pending code exists, don't send new one
        const secondsRemaining = Math.ceil(
          (new Date(existing.expiresAt).getTime() - Date.now()) / 1000
        );
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Verification code already sent. Check your email.',
            codeExpiresIn: secondsRemaining,
            alreadySent: true,
          }),
        };
      }
    } catch {
      // No existing pending verification
    }

    // Generate new code
    const code = generateVerificationCode();
    const expiresAt = getCodeExpiration();

    // Store pending verification
    const pendingVerification: PendingVerification = {
      code,
      attempts: 0,
      createdAt: new Date().toISOString(),
      expiresAt,
      ipHash,
    };

    await verifyStore.setJSON(pendingKey, pendingVerification);

    // Send email
    try {
      await resend.emails.send({
        from: 'VoteGenerator <verify@mail.votegenerator.com>',
        to: normalizedEmail,
        subject: `Your voting code: ${code}`,
        html: getEmailHtml(code, poll.question),
        text: getEmailText(code, poll.question),
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Delete pending verification since email failed
      await verifyStore.delete(pendingKey);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Failed to send verification email. Please try again.' 
        }),
      };
    }

    // Success response (intentionally vague for security)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'If this email is valid, you will receive a verification code shortly.',
        codeExpiresIn: 600, // 10 minutes in seconds
      }),
    };

  } catch (error) {
    console.error('Verification request error:', error);
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

import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Simple in-memory rate limiting (resets on function cold start)
// In production, use Redis or similar for persistent rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

// Validate slug format
function isValidSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug is required' };
  }
  
  const trimmed = slug.trim().toLowerCase();
  
  if (trimmed.length < 4) {
    return { valid: false, error: 'Slug must be at least 4 characters' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Slug must be 50 characters or less' };
  }
  
  // Only allow lowercase letters, numbers, and hyphens
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return { valid: false, error: 'Slug can only contain letters, numbers, and hyphens' };
  }
  
  // Can't start or end with hyphen
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return { valid: false, error: 'Slug cannot start or end with a hyphen' };
  }
  
  // No consecutive hyphens
  if (trimmed.includes('--')) {
    return { valid: false, error: 'Slug cannot have consecutive hyphens' };
  }
  
  // Reserved slugs
  const reserved = ['admin', 'api', 'vote', 'poll', 'results', 'create', 'pricing', 'help', 'about', 'terms', 'privacy', 'contact', 'dashboard', 'login', 'signup', 'checkout', 'success', 'cancel', 'embed'];
  if (reserved.includes(trimmed)) {
    return { valid: false, error: 'This slug is reserved' };
  }
  
  return { valid: true };
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Rate limiting
  const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                   event.headers['client-ip'] || 
                   'unknown';
  
  if (isRateLimited(clientIP)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        available: false 
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { slug, tier } = body;

    // Only unlimited tier can use custom slugs
    if (tier !== 'unlimited') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: 'Custom slugs are only available for Unlimited tier',
          available: false,
          requiresUpgrade: true
        }),
      };
    }

    // Validate slug format
    const validation = isValidSlug(slug);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: validation.error,
          available: false 
        }),
      };
    }

    const normalizedSlug = slug.trim().toLowerCase();

    // Check if slug exists in our index
    const slugStore = getStore({
      name: 'poll-slugs',
      siteID: process.env.VG_SITE_ID || '',
      token: process.env.NETLIFY_AUTH_TOKEN || ''
    });

    const existingPollId = await slugStore.get(normalizedSlug, { type: 'text' });

    if (existingPollId) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          available: false,
          error: 'This custom link is already taken',
          suggestion: `${normalizedSlug}-${Math.random().toString(36).substring(2, 6)}`
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        available: true,
        slug: normalizedSlug,
        previewUrl: `votegenerator.com/p/${normalizedSlug}`
      }),
    };

  } catch (error) {
    console.error('Check slug error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to check slug availability',
        available: false
      }),
    };
  }
};
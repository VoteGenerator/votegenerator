import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Generate unique IDs
function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate secure random ID (for default poll IDs)
function generateSecureId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateAdminKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate custom slug
function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim().toLowerCase();
  if (trimmed.length < 4 || trimmed.length > 50) return false;
  if (!/^[a-z0-9-]+$/.test(trimmed)) return false;
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) return false;
  if (trimmed.includes('--')) return false;
  const reserved = ['admin', 'api', 'vote', 'poll', 'results', 'create', 'pricing', 'help', 'about', 'terms', 'privacy', 'contact', 'dashboard', 'login', 'signup', 'checkout', 'success', 'cancel', 'embed'];
  return !reserved.includes(trimmed);
}

// Tier limits and features - ALL POLL TYPES ARE FREE
// Only response limits, poll counts, and premium features differ by tier
// Tiers: free, pro, business (with monthly or annual billing)
const TIER_CONFIG: Record<string, {
  maxResponses: number;
  expiresInDays: number;
  maxPolls: number;
  features: string[];
}> = {
  free: {
    maxResponses: 100,
    expiresInDays: 30,
    maxPolls: 3,
    features: ['all'], // ALL poll types free - monetize on responses & features
  },
  pro: {
    maxResponses: 5000,
    expiresInDays: 30, // Will be overridden to 365 for annual billing
    maxPolls: -1, // unlimited
    features: ['all'],
  },
  business: {
    maxResponses: 50000,
    expiresInDays: 30, // Will be overridden to 365 for annual billing
    maxPolls: -1,
    features: ['all'],
  },
};

export const handler: Handler = async (event) => {
  // CORS headers
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

  try {
    const body = JSON.parse(event.body || '{}');
    
    // Accept both 'title' (frontend) and 'question' (original)
    const question = body.title || body.question;
    const { options, pollType, settings, tier = 'free', planExpiresAt, customSlug, unlisted, status: requestedStatus, imageUrls, pin, allowedCodes, dashboardToken, sessionId, theme, ratingStyle, meetingDuration, logoUrl, buttonText, sections, surveySettings, isSurvey } = body;

    // Validation
    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Question is required' }),
      };
    }

    // Skip option validation for rating polls (use 1-5 scale) and surveys
    const skipOptionValidation = pollType === 'rating' || pollType === 'survey' || isSurvey;
    
    if (!skipOptionValidation && (!options || !Array.isArray(options) || options.length < 2)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'At least 2 options are required' }),
      };
    }

    // Check if plan has expired (for paid tiers)
    if (tier !== 'free' && planExpiresAt) {
      const expiryDate = new Date(planExpiresAt);
      if (expiryDate < new Date()) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ 
            error: 'Your plan has expired. Please renew to create new polls.',
            expired: true,
            expiredAt: planExpiresAt
          }),
        };
      }
    }

    // Get tier config
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free;

    // ========================================================================
    // POLL LIMIT ENFORCEMENT
    // ========================================================================
    if (tierConfig.maxPolls > 0 && (dashboardToken || sessionId)) {
      const siteId = process.env.VG_SITE_ID;
      if (siteId) {
        const customerStore = getStore({
          name: 'vg-customers',
          siteID: siteId,
          token: process.env.NETLIFY_AUTH_TOKEN || ''
        });

        let customerData = null;

        // Try to find customer by dashboard token
        if (dashboardToken) {
          customerData = await customerStore.get(`token_${dashboardToken}`, { type: 'json' });
        }

        // Fallback: search by session ID
        if (!customerData && sessionId) {
          const list = await customerStore.list();
          for (const key of list.blobs) {
            if (key.key.startsWith('token_')) continue;
            try {
              const customer = await customerStore.get(key.key, { type: 'json' }) as any;
              if (customer && customer.stripeSessionId === sessionId) {
                customerData = customer;
                break;
              }
            } catch (e) {
              // Skip invalid entries
            }
          }
        }

        if (customerData && customerData.polls) {
          const existingPollCount = customerData.polls.length;
          
          if (existingPollCount >= tierConfig.maxPolls) {
            const tierLabel = tier === 'free' ? 'Free' : tier === 'starter' ? 'Starter' : 'Pro Event';
            return {
              statusCode: 403,
              headers,
              body: JSON.stringify({ 
                error: `You've reached the maximum of ${tierConfig.maxPolls} poll${tierConfig.maxPolls > 1 ? 's' : ''} for your ${tierLabel} plan.`,
                pollLimit: tierConfig.maxPolls,
                currentPolls: existingPollCount,
                upgradeRequired: true
              }),
            };
          }
        }
      }
    }
    // ========================================================================

    // Validate poll type access
    if (tierConfig.features[0] !== 'all' && !tierConfig.features.includes(pollType)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: `Poll type "${pollType}" is not available in your tier`,
          requiredTier: Object.keys(TIER_CONFIG).find(t => 
            TIER_CONFIG[t].features.includes(pollType) || TIER_CONFIG[t].features[0] === 'all'
          ),
        }),
      };
    }

    // Handle custom slug (Unlimited tier only)
    let pollId: string;
    let hasCustomSlug = false;
    
    if (customSlug && tier === 'unlimited') {
      const normalizedSlug = customSlug.trim().toLowerCase();
      
      if (!isValidSlug(normalizedSlug)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid custom link format' }),
        };
      }
      
      // Check if slug is already taken
      const slugStore = getStore({
        name: 'poll-slugs',
        siteID: process.env.VG_SITE_ID || '',
        token: process.env.NETLIFY_AUTH_TOKEN || ''
      });
      
      const existingPollId = await slugStore.get(normalizedSlug, { type: 'text' });
      
      if (existingPollId) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ 
            error: 'This custom link is already taken',
            suggestion: `${normalizedSlug}-${Math.random().toString(36).substring(2, 6)}`
          }),
        };
      }
      
      pollId = normalizedSlug;
      hasCustomSlug = true;
    } else {
      // Generate secure random ID
      pollId = generateSecureId();
    }
    
    const adminKey = generateAdminKey();

    // Calculate expiry
    const expiresAt = new Date(
      Date.now() + tierConfig.expiresInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create poll object
    const poll = {
      id: pollId,
      adminKey,
      title: question.trim(),
      question: question.trim(),
      description: body.description || null,
      options: options.filter((o: string) => o && o.trim()).map((o: string, i: number) => ({
        id: `opt_${i}`,
        text: o.trim(),
        // Add image URL if this is a visual poll
        imageUrl: (pollType === 'image' && imageUrls && imageUrls[i]) ? imageUrls[i] : undefined,
      })),
      pollType: pollType || 'multiple_choice',
      // Store imageUrls at poll level too for easy access
      imageUrls: (pollType === 'image' && imageUrls) ? imageUrls : undefined,
      settings: {
        allowMultiple: settings?.allowMultiple || false,
        hideResults: settings?.hideResults || false,
        requireNames: settings?.requireNames || false,
        endDate: settings?.endDate || null,
        deadline: settings?.deadline || null,
        unlisted: unlisted || false, // Hide from search engines
        security: settings?.security || 'none', // none, browser, pin, code
      },
      // Single PIN for simple access control (Pro Event & Unlimited)
      pin: pin || null,
      // Unique access codes (Unlimited only)
      allowedCodes: allowedCodes || null,
      customSlug: hasCustomSlug ? pollId : null,
      tier,
      maxResponses: tierConfig.maxResponses,
      expiresAt,
      createdAt: new Date().toISOString(),
      votes: [],
      voteCount: 0,
      responseCount: 0,
      // Default to live for free tier, use requested status for paid tiers
      status: tier === 'free' ? 'live' : (requestedStatus || 'live'),
      // Logo URL (paid feature)
      logoUrl: logoUrl || null,
      // Theme (visual styling)
      theme: theme || 'default',
      // Rating style (for rating polls)
      ratingStyle: ratingStyle || 'stars',
      // Meeting duration (for meeting polls - calendar integration)
      meetingDuration: meetingDuration || 60,
      // Custom button text
      buttonText: buttonText || 'Submit Vote',
      // Survey mode fields
      isSurvey: isSurvey || false,
      sections: sections || null,
      surveySettings: surveySettings || null,
      // Notification settings
      notificationSettings: body.notificationSettings || null,
    };

    // Store in Netlify Blobs with explicit config
    const store = getStore({
      name: 'polls',
      siteID: process.env.VG_SITE_ID || '',
      token: process.env.NETLIFY_AUTH_TOKEN || ''
    });
    
    await store.setJSON(pollId, poll);
    
    // If custom slug, also store in slug index for lookup
    if (hasCustomSlug) {
      const slugStore = getStore({
        name: 'poll-slugs',
        siteID: process.env.VG_SITE_ID || '',
        token: process.env.NETLIFY_AUTH_TOKEN || ''
      });
      await slugStore.set(pollId, pollId); // slug -> pollId mapping
    }

    console.log(`Poll created: ${pollId}${hasCustomSlug ? ' (custom slug)' : ''}`);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: pollId,
        pollId,
        adminKey,
        customSlug: hasCustomSlug ? pollId : null,
        voteUrl: `/vote/${pollId}`,
        adminUrl: `/admin/${pollId}/${adminKey}`,
        resultsUrl: `/results/${pollId}`,
        shareUrl: hasCustomSlug ? `/p/${pollId}` : `/#id=${pollId}`,
        tier,
        maxResponses: tierConfig.maxResponses,
        expiresAt,
        unlisted: unlisted || false,
      }),
    };
  } catch (error) {
    console.error('Create poll error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create poll',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
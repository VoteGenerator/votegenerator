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

function generateAdminKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Tier limits and features
const TIER_CONFIG: Record<string, {
  maxResponses: number;
  expiresInDays: number;
  features: string[];
}> = {
  free: {
    maxResponses: 100,
    expiresInDays: 30,
    features: ['multiple_choice', 'ranked_choice', 'this_or_that'],
  },
  starter: {
    maxResponses: 500,
    expiresInDays: 7,
    features: ['multiple_choice', 'ranked_choice', 'this_or_that', 'meeting_poll', 'dot_voting', 'rating_scale', 'approval_voting', 'priority_matrix'],
  },
  pro_event: {
    maxResponses: 2000,
    expiresInDays: 30,
    features: ['multiple_choice', 'ranked_choice', 'this_or_that', 'meeting_poll', 'dot_voting', 'rating_scale', 'approval_voting', 'priority_matrix', 'quiz_poll', 'sentiment_check', 'visual_poll'],
  },
  unlimited: {
    maxResponses: 10000,
    expiresInDays: 365,
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
    const { options, pollType, settings, tier = 'free' } = body;

    // Validation
    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Question is required' }),
      };
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'At least 2 options are required' }),
      };
    }

    // Get tier config
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free;

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

    // Generate IDs
    const pollId = generateId(8);
    const adminKey = generateAdminKey();

    // Calculate expiry
    const expiresAt = new Date(
      Date.now() + tierConfig.expiresInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create poll object - use 'title' field to match vg-get expectations
    const poll = {
      id: pollId,
      adminKey,
      title: question.trim(),  // vg-get expects 'title'
      question: question.trim(), // Keep for compatibility
      options: options.filter((o: string) => o && o.trim()).map((o: string, i: number) => ({
        id: `opt_${i}`,
        text: o.trim(),
      })),
      pollType: pollType || 'multiple_choice',
      settings: {
        allowMultiple: settings?.allowMultiple || false,
        hideResults: settings?.hideResults || false,
        requireNames: settings?.requireNames || false,
        endDate: settings?.endDate || null,
      },
      tier,
      maxResponses: tierConfig.maxResponses,
      expiresAt,
      createdAt: new Date().toISOString(),
      votes: [],
      voteCount: 0,  // vg-get expects 'voteCount'
      responseCount: 0,
      status: 'active',
    };

    // Store in Netlify Blobs
    // Use 'polls' - same store name as vg-vote and vg-get
    // Simple pattern lets Netlify auto-detect site context
    const store = getStore('polls');
    await store.setJSON(pollId, poll);

    console.log(`Poll created: ${pollId}`);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: pollId,
        pollId,
        adminKey,
        voteUrl: `/vote/${pollId}`,
        adminUrl: `/admin/${pollId}/${adminKey}`,
        resultsUrl: `/results/${pollId}`,
        tier,
        maxResponses: tierConfig.maxResponses,
        expiresAt,
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
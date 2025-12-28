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
    expiresInDays: 7,
    features: ['multiple', 'ranked', 'pairwise', 'meeting', 'rating', 'rsvp'],
  },
  starter: {
    maxResponses: 500,
    expiresInDays: 30,
    features: ['multiple', 'ranked', 'pairwise', 'meeting', 'rating', 'rsvp'],
  },
  pro_event: {
    maxResponses: 2000,
    expiresInDays: 60,
    features: ['multiple', 'ranked', 'pairwise', 'meeting', 'rating', 'rsvp', 'image'],
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
    
    // Accept BOTH 'title' and 'question'
    const question = body.title || body.question;
    const { 
      options, 
      pollType = 'multiple', 
      settings, 
      tier = 'free',
      description,
      buttonText,
      imageUrls,
      rsvpEvents
    } = body;

    // Validation
    if (!question || typeof question !== 'string' || !question.trim()) {
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

    // Generate IDs
    const pollId = generateId(8);
    const adminKey = generateAdminKey();

    // Calculate expiry
    const expiresAt = new Date(
      Date.now() + tierConfig.expiresInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create poll object
    const poll: Record<string, any> = {
      id: pollId,
      adminKey,
      question: question.trim(),
      description: description?.trim() || undefined,
      options: options.filter((o: string) => o && o.trim()).map((o: string, i: number) => ({
        id: `opt_${i}`,
        text: o.trim(),
      })),
      pollType,
      settings: {
        allowMultiple: settings?.allowMultiple || false,
        hideResults: settings?.hideResults || false,
        requireNames: settings?.requireNames || false,
        endDate: settings?.endDate || settings?.deadline || null,
      },
      buttonText: buttonText || 'Submit Vote',
      tier,
      maxResponses: tierConfig.maxResponses,
      expiresAt,
      createdAt: new Date().toISOString(),
      votes: [],
      responseCount: 0,
      status: 'active',
    };

    // Add image URLs for visual polls
    if (imageUrls && Array.isArray(imageUrls)) {
      poll.imageUrls = imageUrls;
    }

    // Add RSVP events if provided
    if (rsvpEvents && Array.isArray(rsvpEvents)) {
      poll.rsvpEvents = rsvpEvents;
    }

    // Store in Netlify Blobs - EXACT same pattern as original working version
    const store = getStore('votegenerator-polls');
    await store.setJSON(pollId, poll);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: pollId,  // Frontend expects 'id'
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
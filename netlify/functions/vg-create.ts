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

// Map frontend poll types to normalized types
const POLL_TYPE_MAP: Record<string, string> = {
  'multiple': 'multiple',
  'multiple_choice': 'multiple',
  'ranked': 'ranked',
  'ranked_choice': 'ranked',
  'pairwise': 'pairwise',
  'this_or_that': 'pairwise',
  'meeting': 'meeting',
  'meeting_poll': 'meeting',
  'rating': 'rating',
  'rating_scale': 'rating',
  'rsvp': 'rsvp',
  'image': 'image',
  'visual_poll': 'image',
};

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
    
    // Accept BOTH 'title' (from frontend) and 'question'
    const question = body.title || body.question;
    
    const { 
      options, 
      pollType: rawPollType, 
      settings, 
      tier = 'free',
      description,
      buttonText,
      imageUrls,
      rsvpEvents
    } = body;

    // Normalize poll type
    const pollType = POLL_TYPE_MAP[rawPollType] || rawPollType || 'multiple';

    console.log('Creating poll:', { 
      question: question?.substring(0, 50), 
      rawPollType,
      pollType, 
      tier, 
      optionsCount: options?.length 
    });

    // Validation
    if (!question || typeof question !== 'string' || !question.trim()) {
      console.log('Validation failed: missing question');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Please enter a question' }),
      };
    }

    // Rating polls don't need options validation
    if (pollType !== 'rating') {
      if (!options || !Array.isArray(options) || options.length < 1) {
        console.log('Validation failed: not enough options', options);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'At least 1 option is required' }),
        };
      }
    }

    // Get tier config
    const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free;

    // Validate poll type access
    if (tierConfig.features[0] !== 'all' && !tierConfig.features.includes(pollType)) {
      console.log('Poll type not allowed:', { pollType, tier, features: tierConfig.features });
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: `Poll type "${pollType}" requires an upgrade.`,
          requiredTier: pollType === 'image' ? 'pro_event' : 'starter',
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

    // Process options - handle rating polls specially
    let processedOptions;
    if (pollType === 'rating') {
      processedOptions = [
        { id: 'opt_1', text: '1 Star' },
        { id: 'opt_2', text: '2 Stars' },
        { id: 'opt_3', text: '3 Stars' },
        { id: 'opt_4', text: '4 Stars' },
        { id: 'opt_5', text: '5 Stars' },
      ];
    } else {
      processedOptions = options.filter((o: string) => o && o.trim()).map((o: string, i: number) => ({
        id: `opt_${i}`,
        text: o.trim(),
      }));
    }

    // Create poll object
    const poll: Record<string, any> = {
      id: pollId,
      adminKey,
      question: question.trim(),
      description: description?.trim() || undefined,
      options: processedOptions,
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

    console.log('Attempting to store poll...');
    
    // Try to store in Netlify Blobs
    let storageSuccess = false;
    try {
      const store = getStore('votegenerator-polls');
      await store.setJSON(pollId, poll);
      storageSuccess = true;
      console.log('Poll stored in Blobs successfully:', pollId);
    } catch (blobError: any) {
      console.error('Blobs storage error (continuing anyway):', blobError.message);
      // Continue - we'll return success so user can test the flow
      // In production, you'd want to handle this differently
    }

    console.log('Poll created:', pollId, 'stored:', storageSuccess);

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
        stored: storageSuccess,
      }),
    };
  } catch (error) {
    console.error('Create poll error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create poll. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
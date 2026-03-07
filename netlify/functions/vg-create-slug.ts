import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

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
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check Blobs credentials FIRST
  if (!SITE_ID || !BLOB_TOKEN) {
    console.error('vg-create-slug: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Server configuration error' }) 
    };
  }

  try {
    const { slug, pollId, adminKey } = JSON.parse(event.body || '{}');

    // Validate inputs
    if (!pollId || !adminKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Poll ID and admin key are required' })
      };
    }

    // Validate slug format
    const validation = isValidSlug(slug);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validation.error })
      };
    }

    const normalizedSlug = slug.trim().toLowerCase();

    console.log('vg-create-slug: Creating slug:', normalizedSlug, 'for poll:', pollId);
    console.log('vg-create-slug: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

    // Get stores
    const pollStore = getStore({
      name: 'polls',
      siteID: SITE_ID,
      token: BLOB_TOKEN
    });

    const slugStore = getStore({
      name: 'slugs',
      siteID: SITE_ID,
      token: BLOB_TOKEN
    });

    // Verify poll exists and admin key matches
    const pollData = await pollStore.get(pollId, { type: 'json' }) as any;
    
    if (!pollData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Poll not found' })
      };
    }

    if (pollData.adminKey !== adminKey) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Invalid admin key' })
      };
    }

    // Check if slug is already taken (by another poll)
    const existingSlug = await slugStore.get(normalizedSlug, { type: 'json' }) as any;
    if (existingSlug && existingSlug.pollId !== pollId) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: 'This slug is already taken' })
      };
    }

    // If poll had a previous slug, remove it
    if (pollData.customSlug && pollData.customSlug !== normalizedSlug) {
      try {
        await slugStore.delete(pollData.customSlug);
      } catch (e) {
        // Ignore errors deleting old slug
      }
    }

    // Save the slug mapping
    await slugStore.set(normalizedSlug, JSON.stringify({
      pollId,
      createdAt: new Date().toISOString()
    }));

    // Update the poll with the custom slug
    pollData.customSlug = normalizedSlug;
    await pollStore.set(pollId, JSON.stringify(pollData));

    console.log('vg-create-slug: Slug created successfully:', normalizedSlug);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        slug: normalizedSlug,
        url: `/p/${normalizedSlug}`
      })
    };
  } catch (error) {
    console.error('vg-create-slug: Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to save custom link' })
    };
  }
};
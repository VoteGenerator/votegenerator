// ============================================================================
// VoteGenerator - License Validation Function
// Validates Unlimited license keys and returns license info
// Also handles license activation (storing in user's browser)
// ============================================================================
import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

// ============================================================================
// Types
// ============================================================================
interface License {
  id: string;
  key: string;
  tier: 'unlimited';
  createdAt: string;
  expiresAt: string;
  stripeSessionId: string;
  customerEmail?: string;
  used: boolean;
  activatedAt?: string;
  pollsCreated?: number;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check Blobs credentials FIRST
  if (!SITE_ID || !BLOB_TOKEN) {
    console.error('vg-license-validate: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Server configuration error' }) 
    };
  }

  // GET: Validate a license key
  if (event.httpMethod === 'GET') {
    const licenseKey = event.queryStringParameters?.key;
    
    if (!licenseKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'License key required' }),
      };
    }

    try {
      console.log('vg-license-validate: Validating license key');
      console.log('vg-license-validate: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

      const licenseStore = getStore({
        name: 'vg-licenses',
        siteID: SITE_ID,
        token: BLOB_TOKEN
      });

      const license = await licenseStore.get(licenseKey, { type: 'json' }) as License | null;

      if (!license) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ 
            valid: false, 
            error: 'License not found' 
          }),
        };
      }

      // Check if expired
      const now = new Date();
      const expiresAt = new Date(license.expiresAt);
      const isExpired = now > expiresAt;

      if (isExpired) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            valid: false,
            error: 'License has expired',
            license: {
              key: license.key,
              tier: license.tier,
              createdAt: license.createdAt,
              expiresAt: license.expiresAt,
              expired: true,
            },
          }),
        };
      }

      // License is valid
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: true,
          license: {
            key: license.key,
            tier: license.tier,
            createdAt: license.createdAt,
            expiresAt: license.expiresAt,
            daysRemaining: Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            pollsCreated: license.pollsCreated || 0,
          },
        }),
      };
    } catch (error: any) {
      console.error('vg-license-validate: Validation error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to validate license' }),
      };
    }
  }

  // POST: Activate/use a license (optional tracking)
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { licenseKey, action } = body as { licenseKey: string; action: 'activate' | 'increment_polls' };

      if (!licenseKey) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'License key required' }),
        };
      }

      console.log('vg-license-validate: Processing action:', action, 'for license');
      console.log('vg-license-validate: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

      const licenseStore = getStore({
        name: 'vg-licenses',
        siteID: SITE_ID,
        token: BLOB_TOKEN
      });

      const license = await licenseStore.get(licenseKey, { type: 'json' }) as License | null;

      if (!license) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'License not found' }),
        };
      }

      // Check if expired
      const now = new Date();
      const expiresAt = new Date(license.expiresAt);
      if (now > expiresAt) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'License has expired' }),
        };
      }

      // Update license based on action
      const updatedLicense: License = { ...license };

      if (action === 'activate' && !license.activatedAt) {
        updatedLicense.activatedAt = now.toISOString();
        updatedLicense.used = true;
      }

      if (action === 'increment_polls') {
        updatedLicense.pollsCreated = (license.pollsCreated || 0) + 1;
      }

      await licenseStore.setJSON(licenseKey, updatedLicense);

      console.log('vg-license-validate: License updated successfully');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          license: {
            key: updatedLicense.key,
            tier: updatedLicense.tier,
            expiresAt: updatedLicense.expiresAt,
            pollsCreated: updatedLicense.pollsCreated || 0,
          },
        }),
      };
    } catch (error: any) {
      console.error('vg-license-validate: Activation error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update license' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
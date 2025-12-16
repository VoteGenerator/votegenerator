// ============================================================================
// VoteGenerator - Admin Support API
// netlify/functions/admin.ts
// For support staff to look up and manage purchases
// ============================================================================

import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Admin password from environment variable (set in Netlify dashboard)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'votegen2024';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Generate random ID
function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Generate a simple token
function generateToken(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Parse the path to determine action
  const path = event.path.replace('/.netlify/functions/admin', '').replace('/api/admin', '');

  try {
    // ==========================================
    // POST /api/admin/verify - Verify password
    // ==========================================
    if (path === '/verify' && event.httpMethod === 'POST') {
      const { password } = JSON.parse(event.body || '{}');
      
      if (password === ADMIN_PASSWORD) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            token: generateToken()
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid password' }),
        };
      }
    }

    // For all other endpoints, could add token verification here
    // const authToken = event.headers['x-admin-token'];
    // if (!authToken) return { statusCode: 401, ... }

    const store = getStore('purchases');

    // ==========================================
    // POST /api/admin/lookup - Find purchases
    // ==========================================
    if (path === '/lookup' && event.httpMethod === 'POST') {
      const { query } = JSON.parse(event.body || '{}');
      
      if (!query) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Query required' }),
        };
      }

      // Try to find by ID first
      try {
        const purchase = await store.get(query, { type: 'json' });
        if (purchase) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ purchases: [purchase] }),
          };
        }
      } catch (e) {
        // Not found by ID, continue to search
      }

      // Search through all purchases for email match
      // Note: This is inefficient for large datasets - in production use a proper DB
      const { blobs } = await store.list();
      const purchases = [];
      
      for (const blob of blobs) {
        if (blob.key.startsWith('stripe:')) continue; // Skip stripe mappings
        try {
          const purchase = await store.get(blob.key, { type: 'json' }) as any;
          if (purchase && (
            purchase.email?.toLowerCase().includes(query.toLowerCase()) ||
            purchase.stripeCustomerId?.includes(query) ||
            purchase.stripePaymentId?.includes(query)
          )) {
            purchases.push(purchase);
          }
        } catch (e) {}
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ purchases }),
      };
    }

    // ==========================================
    // POST /api/admin/create-purchase - Manual creation
    // ==========================================
    if (path === '/create-purchase' && event.httpMethod === 'POST') {
      const { email, plan, stripeId, note } = JSON.parse(event.body || '{}');
      
      if (!email || !plan) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and plan required' }),
        };
      }

      const planConfig: Record<string, { amount: number; days: number; responses: number }> = {
        quick: { amount: 5.00, days: 7, responses: 500 },
        event: { amount: 9.99, days: 30, responses: 2000 },
      };

      const config = planConfig[plan];
      if (!config) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid plan' }),
        };
      }

      const purchase = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        email,
        tier: plan,
        amount: config.amount,
        currency: 'USD',
        status: 'completed',
        stripePaymentId: stripeId || `manual_${Date.now()}`,
        expiresAt: new Date(Date.now() + config.days * 24 * 60 * 60 * 1000).toISOString(),
        maxResponses: config.responses,
        manualCreation: true,
        supportNote: note,
      };

      await store.setJSON(purchase.id, purchase);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, purchase }),
      };
    }

    // ==========================================
    // GET /api/admin/recent-purchases - List recent
    // ==========================================
    if (path === '/recent-purchases' && event.httpMethod === 'GET') {
      const { blobs } = await store.list();
      const purchases = [];
      
      for (const blob of blobs) {
        if (blob.key.startsWith('stripe:')) continue;
        try {
          const purchase = await store.get(blob.key, { type: 'json' });
          if (purchase) {
            purchases.push(purchase);
          }
        } catch (e) {}
      }

      // Sort by date, newest first
      purchases.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ purchases: purchases.slice(0, 50) }),
      };
    }

    // ==========================================
    // Not found
    // ==========================================
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found', path }),
    };

  } catch (error: any) {
    console.error('Admin API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
// ============================================================================
// VoteGenerator - Recover Purchase API
// netlify/functions/recover-purchase.ts
// For users to find their purchases by email
// ============================================================================

import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, purchaseId } = JSON.parse(event.body || '{}');
    const store = getStore('purchases');

    // If purchase ID provided, try direct lookup
    if (purchaseId) {
      try {
        const purchase = await store.get(purchaseId, { type: 'json' }) as any;
        if (purchase && purchase.status === 'completed') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              purchase: {
                id: purchase.id,
                plan: purchase.tier,
                amount: purchase.amount,
                currency: purchase.currency,
              },
            }),
          };
        }
      } catch (e) {
        // Not found, continue
      }
    }

    // Search by email
    if (email) {
      const { blobs } = await store.list();
      
      for (const blob of blobs) {
        if (blob.key.startsWith('stripe:')) continue;
        try {
          const purchase = await store.get(blob.key, { type: 'json' }) as any;
          if (
            purchase &&
            purchase.status === 'completed' &&
            purchase.email?.toLowerCase() === email.toLowerCase() &&
            !purchase.pollId // Only return unused purchases
          ) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                purchase: {
                  id: purchase.id,
                  plan: purchase.tier,
                  amount: purchase.amount,
                  currency: purchase.currency,
                },
              }),
            };
          }
        } catch (e) {}
      }
    }

    // Not found
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: false, message: 'No purchase found' }),
    };

  } catch (error: any) {
    console.error('Recover purchase error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Unable to process request. Please try again.' }),
    };
  }
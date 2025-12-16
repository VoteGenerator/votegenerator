import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const PRICE_IDS = {
  quick_poll: 'price_1SeT7OGhadLxEBQBsyCn0d5j',
  event_poll: 'price_1SeSzTGhadLxEBQBwEi9WCy9',
  pro_monthly: 'price_1SeSp1GhadLxEBQBO5H9g7mJ',
  pro_yearly: 'price_1SejSXGhadLxEBQBrKE0VNWS',
  pro_plus_monthly: 'price_1SeSw9GhadLxEBQBx1w9N8hy',
  pro_plus_yearly: 'price_1SejWvGhadLxEBQBYFDD6pR3',
} as const;

type PlanType = keyof typeof PRICE_IDS;

const isSubscription = (plan: PlanType): boolean => {
  return ['pro_monthly', 'pro_yearly', 'pro_plus_monthly', 'pro_plus_yearly'].includes(plan);
};

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
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { plan } = body as { plan: PlanType };

    if (!plan || !PRICE_IDS[plan]) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid plan' }) };
    }

    const priceId = PRICE_IDS[plan];
    const isSubPlan = isSubscription(plan);
    const baseUrl = process.env.URL || 'https://votegenerator.com';

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isSubPlan ? 'subscription' : 'payment',
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { plan },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, sessionUrl: session.url }),
    };
  } catch (error: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
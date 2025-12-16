// ============================================================================
// VoteGenerator - Stripe Checkout Session Creator
// netlify/functions/checkout.ts
// ============================================================================

import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Price IDs from your Stripe Dashboard (Sandbox)
const PRICE_IDS = {
  // One-time payments
  quick_poll: 'price_1SeT7OGhadLxEBQBsyCn0d5j',
  event_poll: 'price_1SeSzTGhadLxEBQBwEi9WCy9',
  
  // Subscriptions
  pro_monthly: 'price_1SeSp1GhadLxEBQBO5H9g7mJ',
  pro_yearly: 'price_1SejSXGhadLxEBQBrKE0VNWS',
  pro_plus_monthly: 'price_1SeSw9GhadLxEBQBx1w9N8hy',
  pro_plus_yearly: 'price_1SejWvGhadLxEBQBYFDD6pR3',
} as const;

type PlanType = keyof typeof PRICE_IDS;

// Determine if plan is subscription or one-time
const isSubscription = (plan: PlanType): boolean => {
  return ['pro_monthly', 'pro_yearly', 'pro_plus_monthly', 'pro_plus_yearly'].includes(plan);
};

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  // Handle CORS preflight
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
    const body = JSON.parse(event.body || '{}');
    const { plan, pollData } = body as { plan: PlanType; pollData?: any };

    // Validate plan
    if (!plan || !PRICE_IDS[plan]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid plan',
          validPlans: Object.keys(PRICE_IDS),
        }),
      };
    }

    const priceId = PRICE_IDS[plan];
    const isSubPlan = isSubscription(plan);
    
    // Base URL for redirects
    const baseUrl = process.env.URL || 'https://votegenerator.com';

    // Store poll data in metadata so we can create the poll after payment
    const metadata: Record<string, string> = {
      plan,
    };
    
    // For one-time purchases, we can store poll data to create immediately after payment
    if (pollData && !isSubPlan) {
      metadata.pollData = JSON.stringify(pollData);
    }

    // Create Stripe Checkout Session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: isSubPlan ? 'subscription' : 'payment',
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata,
      // For subscriptions, allow customer to manage billing later
      ...(isSubPlan && {
        billing_address_collection: 'auto',
        customer_creation: 'always',
      }),
      // For one-time payments
      ...(!isSubPlan && {
        payment_intent_data: {
          metadata,
        },
      }),
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        sessionUrl: session.url,
      }),
    };

  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error.message,
      }),
    };
  }
};
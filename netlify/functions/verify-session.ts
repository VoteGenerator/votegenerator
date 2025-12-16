// ============================================================================
// VoteGenerator - Verify Stripe Session
// netlify/functions/verify-session.ts
// Called by success page to confirm payment
// ============================================================================

import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { storage } from '../../src/backend/storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Map Stripe price IDs to plan names
const PRICE_TO_PLAN: Record<string, string> = {
  'price_1SeT7OGhadLxEBQBsyCn0d5j': 'quick',
  'price_1SeSzTGhadLxEBQBwEi9WCy9': 'event',
  'price_1SeSp1GhadLxEBQBO5H9g7mJ': 'pro',
  'price_1SejSXGhadLxEBQBrKE0VNWS': 'pro',
  'price_1SeSw9GhadLxEBQBx1w9N8hy': 'pro_plus',
  'price_1SejWvGhadLxEBQBYFDD6pR3': 'pro_plus',
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sessionId = event.queryStringParameters?.session_id;

  if (!sessionId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing session_id parameter' }),
    };
  }

  try {
    // Retrieve the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'subscription'],
    });

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payment not completed' }),
      };
    }

    // Get the price ID to determine the plan
    const priceId = session.line_items?.data[0]?.price?.id;
    const plan = priceId ? PRICE_TO_PLAN[priceId] : 'unknown';

    // One-time payment (Quick Poll or Event Poll)
    if (session.mode === 'payment') {
      // Find the purchase record created by webhook
      const paymentIntentId = session.payment_intent as string;
      let purchase = await storage.getPurchaseByStripePayment(paymentIntentId);

      // If webhook hasn't processed yet, create purchase record now
      if (!purchase) {
        purchase = {
          id: storage.generateId(),
          createdAt: new Date().toISOString(),
          stripePaymentId: paymentIntentId,
          stripeCustomerId: session.customer as string | undefined,
          tier: plan as 'quick' | 'event',
          amount: (session.amount_total || 0) / 100,
          currency: (session.currency || 'usd').toUpperCase(),
          status: 'completed',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await storage.savePurchase(purchase);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          type: 'one_time',
          purchase: {
            purchaseId: purchase.id,
            plan: purchase.tier,
            amount: purchase.amount,
            currency: purchase.currency,
          },
        }),
      };
    }

    // Subscription (Pro or Pro+)
    if (session.mode === 'subscription') {
      const customerId = session.customer as string;
      const customer = session.customer as Stripe.Customer;
      
      // Find or wait for user created by webhook
      let user = await storage.getUserByStripeCustomer(customerId);

      // If webhook hasn't processed yet, create user now
      if (!user) {
        const customerData = typeof customer === 'string' 
          ? await stripe.customers.retrieve(customerId) as Stripe.Customer
          : customer;
        
        user = await storage.createUserFromStripe(
          customerId,
          plan as 'pro' | 'pro_plus',
          customerData.email || undefined
        );
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          type: 'subscription',
          subscription: {
            userId: user.userId,
            tier: user.subscription.tier,
            email: user.email,
          },
        }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Unknown session mode' }),
    };

  } catch (error: any) {
    console.error('Verify session error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify session',
        message: error.message,
      }),
    };
  }
};
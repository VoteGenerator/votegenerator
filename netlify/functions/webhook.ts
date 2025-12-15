// ============================================================================
// VoteGenerator - Stripe Webhook Handler
// netlify/functions/webhook.ts
// ============================================================================

import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { storage } from '../../src/backend/storage';
import type { OneTimePurchase, PlanTier } from '../../src/backend/types';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Map Stripe price IDs to plan tiers
const PRICE_TO_TIER: Record<string, PlanTier> = {
  'price_1SeT7OGhadLxEBQBsyCn0d5j': 'quick',      // Quick Poll
  'price_1SeSzTGhadLxEBQBwEi9WCy9': 'event',      // Event Poll
  'price_1SeSp1GhadLxEBQBO5H9g7mJ': 'pro',        // Pro Monthly
  'price_1SejSXGhadLxEBQBrKE0VNWS': 'pro',        // Pro Yearly
  'price_1SeSw9GhadLxEBQBx1w9N8hy': 'pro_plus',   // Pro+ Monthly
  'price_1SejWvGhadLxEBQBYFDD6pR3': 'pro_plus',   // Pro+ Yearly
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  
  if (!sig) {
    return { statusCode: 400, body: 'Missing stripe-signature header' };
  }

  let stripeEvent: Stripe.Event;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      endpointSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  console.log(`Received Stripe event: ${stripeEvent.type}`);

  try {
    switch (stripeEvent.type) {
      // ========================================
      // ONE-TIME PAYMENTS (Quick Poll, Event Poll)
      // ========================================
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'payment') {
          // One-time purchase completed
          await handleOneTimePayment(session);
        } else if (session.mode === 'subscription') {
          // Subscription started
          await handleSubscriptionCreated(session);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        // Additional handling if needed
        break;
      }

      // ========================================
      // SUBSCRIPTIONS (Pro, Pro+)
      // ========================================
      case 'customer.subscription.created': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log(`Subscription ${subscription.id} created with status ${subscription.status}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        console.log(`Invoice ${invoice.id} paid for customer ${invoice.customer}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as Stripe.Invoice;
        console.log(`Invoice ${invoice.id} payment failed for customer ${invoice.customer}`);
        // Could send email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return { statusCode: 500, body: `Webhook handler error: ${error.message}` };
  }
};

// ============================================================================
// Handler Functions
// ============================================================================

async function handleOneTimePayment(session: Stripe.Checkout.Session) {
  console.log('Processing one-time payment:', session.id);
  
  // Get the line item to determine the plan
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id;
  
  if (!priceId) {
    console.error('No price ID found in session');
    return;
  }

  const tier = PRICE_TO_TIER[priceId] as 'quick' | 'event';
  if (!tier || !['quick', 'event'].includes(tier)) {
    console.error('Invalid tier for one-time payment:', tier);
    return;
  }

  // Create purchase record
  const purchase: OneTimePurchase = {
    id: storage.generateId(),
    createdAt: new Date().toISOString(),
    stripePaymentId: session.payment_intent as string,
    stripeCustomerId: session.customer as string | undefined,
    tier,
    amount: session.amount_total! / 100,
    currency: session.currency!.toUpperCase(),
    status: 'completed',
    // Set expiration for when the purchase must be used
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };

  await storage.savePurchase(purchase);
  console.log(`Created purchase ${purchase.id} for ${tier} plan`);
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  console.log('Processing subscription:', session.id);
  
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price?.id;
  
  if (!priceId) {
    console.error('No price ID found in subscription');
    return;
  }

  const tier = PRICE_TO_TIER[priceId] as 'pro' | 'pro_plus';
  if (!tier || !['pro', 'pro_plus'].includes(tier)) {
    console.error('Invalid tier for subscription:', tier);
    return;
  }

  // Check if user already exists
  let user = await storage.getUserByStripeCustomer(customerId);
  
  if (!user) {
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    
    // Create new user
    user = await storage.createUserFromStripe(
      customerId,
      tier,
      customer.email || undefined
    );
    console.log(`Created new user ${user.userId} for customer ${customerId}`);
  } else {
    // Update existing user's subscription
    user.subscription = {
      tier,
      status: 'active',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    };
    user.updatedAt = new Date().toISOString();
    await storage.saveUser(user);
    console.log(`Updated user ${user.userId} subscription to ${tier}`);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
  
  const customerId = subscription.customer as string;
  const user = await storage.getUserByStripeCustomer(customerId);
  
  if (!user) {
    console.log('No user found for customer:', customerId);
    return;
  }

  // Update subscription status
  user.subscription.status = subscription.status as any;
  user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
  user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
  
  // Check if plan changed
  const priceId = subscription.items.data[0]?.price?.id;
  if (priceId) {
    const newTier = PRICE_TO_TIER[priceId] as 'pro' | 'pro_plus';
    if (newTier && ['pro', 'pro_plus'].includes(newTier)) {
      user.subscription.tier = newTier;
    }
  }

  user.updatedAt = new Date().toISOString();
  await storage.saveUser(user);
  console.log(`Updated subscription for user ${user.userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const customerId = subscription.customer as string;
  const user = await storage.getUserByStripeCustomer(customerId);
  
  if (!user) {
    console.log('No user found for customer:', customerId);
    return;
  }

  // Mark subscription as canceled
  user.subscription.status = 'canceled';
  user.updatedAt = new Date().toISOString();
  await storage.saveUser(user);
  
  console.log(`Canceled subscription for user ${user.userId}`);
}
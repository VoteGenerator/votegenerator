// ============================================================================
// VoteGenerator - Checkout Function
// Handles Stripe checkout for: Starter, Pro Event, Unlimited
// Supports both new purchases and upgrading existing polls
// Stripe auto-handles multi-currency (USD, CAD, EUR, GBP, AUD) based on location
// ============================================================================

import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// ============================================================================
// Price IDs - One per tier (Stripe auto-shows correct currency)
// ============================================================================

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_1Sgt1tGhadLxEBQB3ZMPJLRM',
  pro_event: process.env.STRIPE_PRICE_PRO_EVENT || 'price_1Sgt3ZGhadLxEBQBX2s10J9x',
  unlimited: process.env.STRIPE_PRICE_UNLIMITED || 'price_1Sgt7qGhadLxEBQBEyOxbNT3',
};

// Tier configuration
const TIER_CONFIG: Record<string, {
  name: string;
  priceUsd: number;
  type: 'one-time' | 'yearly';
  responsesLimit: number;
  durationDays: number;
  dataRetentionDays: number;
  features: string[];
}> = {
  starter: {
    name: 'Starter',
    priceUsd: 9.99,
    type: 'one-time',
    responsesLimit: 500,
    durationDays: 30,
    dataRetentionDays: 90,
    features: ['csv_export', 'device_stats', 'geo_stats', 'duplicate_poll'],
  },
  pro_event: {
    name: 'Pro Event',
    priceUsd: 19.99,
    type: 'one-time',
    responsesLimit: 2000,
    durationDays: 60,
    dataRetentionDays: 365,
    features: ['csv_export', 'pdf_export', 'png_export', 'device_stats', 'geo_stats', 'duplicate_poll', 'visual_poll', 'custom_link', 'remove_branding', 'password_protection', 'schedule_poll', 'share_dashboard'],
  },
  unlimited: {
    name: 'Unlimited',
    priceUsd: 199,
    type: 'yearly',
    responsesLimit: 5000,
    durationDays: 365,
    dataRetentionDays: 730,
    features: ['csv_export', 'pdf_export', 'png_export', 'device_stats', 'geo_stats', 'duplicate_poll', 'visual_poll', 'custom_link', 'remove_branding', 'password_protection', 'schedule_poll', 'share_dashboard', 'upload_logo', 'email_notifications', 'access_codes', 'priority_support'],
  },
};

type TierType = keyof typeof TIER_CONFIG;

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
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    
    // Extract parameters
    const {
      tier,              // Required: 'starter' | 'pro_event' | 'unlimited'
      pollId,            // Optional: For upgrading existing poll
      adminToken,        // Optional: For upgrading existing poll (verification)
      previousTier,      // Optional: What they're upgrading from
      successUrl,        // Optional: Custom success URL
      cancelUrl,         // Optional: Custom cancel URL
      source,            // Optional: 'pricing_page' | 'dashboard' | 'landing'
    } = body as {
      tier: TierType;
      pollId?: string;
      adminToken?: string;
      previousTier?: string;
      successUrl?: string;
      cancelUrl?: string;
      source?: string;
    };

    // Validate tier
    if (!tier || !TIER_CONFIG[tier]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid tier',
          validTiers: Object.keys(TIER_CONFIG),
        }),
      };
    }

    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Price configuration error' }),
      };
    }

    const tierInfo = TIER_CONFIG[tier];
    const baseUrl = process.env.URL || 'https://votegenerator.com';

    // Build comprehensive metadata for webhook
    const metadata: Record<string, string> = {
      // Tier info
      tier,
      tier_name: tierInfo.name,
      
      // Limits
      responses_limit: tierInfo.responsesLimit.toString(),
      duration_days: tierInfo.durationDays.toString(),
      data_retention_days: tierInfo.dataRetentionDays.toString(),
      
      // Features
      features: tierInfo.features.join(','),
      
      // Purchase context
      purchase_type: pollId ? 'upgrade' : (tier === 'unlimited' ? 'license' : 'new_poll'),
      source: source || 'pricing_page',
    };

    // If upgrading an existing poll, include poll info
    if (pollId) {
      metadata.poll_id = pollId;
      if (adminToken) metadata.admin_token = adminToken;
      if (previousTier) metadata.previous_tier = previousTier;
    }

    // For Unlimited tier, mark as license purchase
    if (tier === 'unlimited') {
      metadata.license_type = 'annual';
      metadata.license_duration_days = '365';
    }

    // Build success URL with query params
    let finalSuccessUrl = successUrl || `${baseUrl}/success`;
    const successParams = new URLSearchParams({
      session_id: '{CHECKOUT_SESSION_ID}',
      tier,
    });
    if (pollId) {
      successParams.append('poll_id', pollId);
    }
    finalSuccessUrl += `?${successParams.toString()}`;

    // Build cancel URL
    let finalCancelUrl = cancelUrl || `${baseUrl}/pricing`;
    if (pollId) {
      finalCancelUrl = `${baseUrl}/#id=${pollId}`;
    }

    // Create Stripe Checkout Session
    // Stripe automatically shows correct currency based on customer location!
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata,
      payment_intent_data: {
        metadata,
      },
      // Allow promotion codes (for discounts like LAUNCH50)
      allow_promotion_codes: true,
      // Billing address collection
      billing_address_collection: 'auto',
    };

    // For Unlimited tier, collect email for license delivery
    if (tier === 'unlimited') {
      sessionParams.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        sessionUrl: session.url,
        tier,
        tierName: tierInfo.name,
      }),
    };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to create checkout session',
      }),
    };
  }
};
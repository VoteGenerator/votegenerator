// ============================================================================
// VoteGenerator - Stripe Webhook Handler
// Handles checkout.session.completed events to:
// 1. Upgrade existing polls to paid tier
// 2. Create Unlimited license keys
// 3. Optionally send email backup via Resend
// ============================================================================

import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Resend for email (optional backup)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ============================================================================
// Types
// ============================================================================

interface Poll {
  id: string;
  title: string;
  tier: string;
  tierUpgradedAt?: string;
  originalTier?: string;
  // ... other poll fields
  [key: string]: any;
}

interface License {
  id: string;
  key: string;
  tier: 'unlimited';
  createdAt: string;
  expiresAt: string;
  stripeSessionId: string;
  customerEmail?: string;
  used: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

// Generate a secure license key like: VG-7Kx9mP2nQ8wR
function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'VG-';
  for (let i = 0; i < 12; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Send license email via Resend (optional)
async function sendLicenseEmail(email: string, licenseKey: string, licenseUrl: string): Promise<boolean> {
  if (!RESEND_API_KEY || !email) return false;
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VoteGenerator <noreply@votegenerator.com>',
        to: email,
        subject: '🎉 Your VoteGenerator Unlimited License',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to VoteGenerator Unlimited! 🎉</h1>
            
            <p>Thank you for your purchase! Here's your license information:</p>
            
            <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">Your License Key:</p>
              <p style="margin: 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #1F2937;">
                ${licenseKey}
              </p>
            </div>
            
            <div style="background: #EEF2FF; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #4F46E5; font-weight: bold;">⚠️ IMPORTANT: Save this link!</p>
              <p style="margin: 0;">
                <a href="${licenseUrl}" style="color: #4F46E5; word-break: break-all;">
                  ${licenseUrl}
                </a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #6B7280;">
                Bookmark this link to access your unlimited polls anytime.
              </p>
            </div>
            
            <h3>What you get:</h3>
            <ul>
              <li>Unlimited polls for 1 year</li>
              <li>5,000 responses per poll</li>
              <li>Visual Poll support</li>
              <li>All export options (CSV, PDF, PNG)</li>
              <li>Custom branding & short links</li>
              <li>Email notifications</li>
              <li>Priority support</li>
            </ul>
            
            <p>Questions? Reply to this email or contact <a href="mailto:support@votegenerator.com">support@votegenerator.com</a></p>
            
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px;">
              © ${new Date().getFullYear()} VoteGenerator. All rights reserved.
            </p>
          </div>
        `,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send license email:', error);
    return false;
  }
}

// ============================================================================
// Main Handler
// ============================================================================

const headers = {
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing signature or secret' }) };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, headers, body: JSON.stringify({ error: `Webhook Error: ${err.message}` }) };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      
      console.log('Checkout completed:', {
        sessionId: session.id,
        tier: metadata.tier,
        pollId: metadata.pollId,
        licenseType: metadata.licenseType,
      });

      try {
        // Case 1: Upgrading an existing poll
        if (metadata.pollId && metadata.upgradeType === 'existing_poll') {
          const pollStore = getStore('vg-polls');
          const pollData = await pollStore.get(metadata.pollId, { type: 'json' }) as Poll | null;
          
          if (pollData) {
            // Upgrade the poll
            const upgradedPoll: Poll = {
              ...pollData,
              originalTier: pollData.tier,
              tier: metadata.tier,
              tierUpgradedAt: new Date().toISOString(),
              stripeSessionId: session.id,
            };
            
            await pollStore.setJSON(metadata.pollId, upgradedPoll);
            console.log(`Poll ${metadata.pollId} upgraded to ${metadata.tier}`);
          } else {
            console.error(`Poll ${metadata.pollId} not found for upgrade`);
          }
        }
        
        // Case 2: Creating an Unlimited license
        if (metadata.licenseType === 'unlimited') {
          const licenseKey = generateLicenseKey();
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setDate(expiresAt.getDate() + 365); // 1 year
          
          const license: License = {
            id: licenseKey,
            key: licenseKey,
            tier: 'unlimited',
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            stripeSessionId: session.id,
            customerEmail: session.customer_details?.email || undefined,
            used: false,
          };
          
          // Store the license
          const licenseStore = getStore('vg-licenses');
          await licenseStore.setJSON(licenseKey, license);
          
          console.log(`License ${licenseKey} created, expires ${expiresAt.toISOString()}`);
          
          // Send email backup if customer provided email
          if (session.customer_details?.email) {
            const baseUrl = process.env.URL || 'https://votegenerator.com';
            const licenseUrl = `${baseUrl}/license/${licenseKey}`;
            const emailSent = await sendLicenseEmail(
              session.customer_details.email,
              licenseKey,
              licenseUrl
            );
            console.log(`License email sent: ${emailSent}`);
          }
        }
      } catch (error) {
        console.error('Error processing checkout:', error);
        // Don't return error - we still want to acknowledge the webhook
      }
      
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  // Return success to Stripe
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true }),
  };
};
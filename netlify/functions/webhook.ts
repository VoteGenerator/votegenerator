// ============================================================================
// VoteGenerator - Stripe Webhook Handler (RESILIENT VERSION)
// Handles checkout.session.completed events to:
// 1. FIRST: Send welcome email with dashboard link
// 2. THEN: Try to register in Blobs (graceful failure)
// 3. Upgrade existing polls / create licenses
// ============================================================================
import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Resend for email
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

interface CustomerRecord {
  email: string;
  tier: string;
  stripeCustomerId?: string;
  stripeSessionId: string;
  dashboardToken: string;
  polls: {
    id: string;
    adminKey: string;
    title: string;
    type: string;
    status: 'draft' | 'live';
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt?: string;
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

// Generate a unique dashboard token
function generateDashboardToken(): string {
  return crypto.randomBytes(12).toString('base64url');
}

// Map price IDs to tiers using environment variables
function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_PRO_EVENT) return 'pro_event';
  if (priceId === process.env.STRIPE_PRICE_UNLIMITED) return 'unlimited';
  return 'starter'; // Default
}

// Get tier expiration days
function getTierDays(tier: string): number {
  switch (tier) {
    case 'starter': return 30;
    case 'pro_event': return 60;
    case 'unlimited': return 365;
    default: return 30;
  }
}

// Send dashboard welcome email via Resend
async function sendDashboardEmail(email: string, tier: string, dashboardToken: string): Promise<boolean> {
  if (!RESEND_API_KEY || !email) {
    console.log('Skipping email: No API key or email');
    return false;
  }
  
  const tierLabels: Record<string, string> = {
    starter: 'Starter',
    pro_event: 'Pro Event',
    unlimited: 'Unlimited',
  };
  
  const tierLabel = tierLabels[tier] || 'Starter';
  const baseUrl = process.env.URL || 'https://votegenerator.com';
  const dashboardUrl = `${baseUrl}/admin?token=${dashboardToken}`;
  const days = getTierDays(tier);
  const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  try {
    console.log(`Sending dashboard email to ${email.substring(0, 5)}...`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VoteGenerator <noreply@mail.votegenerator.com>',
        to: email,
        subject: `🗳️ Welcome to VoteGenerator ${tierLabel}!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🗳️ VoteGenerator</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Welcome to ${tierLabel}!</p>
            </div>
            
            <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for your purchase! Your poll dashboard is ready.
              </p>
              
              <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #92400e; font-weight: bold; font-size: 14px;">
                  ⚠️ IMPORTANT: Save Your Dashboard Link!
                </p>
                <a href="${dashboardUrl}" 
                   style="display: block; background: #f59e0b; color: white; text-decoration: none; padding: 14px 20px; border-radius: 8px; text-align: center; font-weight: bold; font-size: 16px;">
                  Open My Dashboard →
                </a>
                <p style="margin: 12px 0 0 0; font-size: 11px; color: #92400e; word-break: break-all;">
                  ${dashboardUrl}
                </p>
              </div>
              
              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #334155; font-size: 16px;">Your ${tierLabel} Plan:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b;">
                  <li style="margin-bottom: 8px;">${tier === 'unlimited' ? 'Unlimited polls' : tier === 'pro_event' ? '3 polls' : '1 poll'}</li>
                  <li style="margin-bottom: 8px;">${tier === 'unlimited' ? '10,000' : tier === 'pro_event' ? '2,000' : '500'} responses per poll</li>
                  <li style="margin-bottom: 8px;">Valid until <strong>${expirationDate}</strong></li>
                </ul>
              </div>
              
              <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #0369a1; font-size: 14px;">
                  💡 <strong>Tip:</strong> Bookmark your dashboard link so you never lose access!
                </p>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">
                Questions? Reply to this email or contact <a href="mailto:support@votegenerator.com" style="color: #6366f1;">support@votegenerator.com</a>
              </p>
            </div>
            
            <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} VoteGenerator. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      return false;
    }
    
    console.log('Dashboard email sent successfully!');
    return true;
  } catch (error) {
    console.error('Failed to send dashboard email:', error);
    return false;
  }
}

// Send license email via Resend (for Unlimited)
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
        from: 'VoteGenerator <noreply@mail.votegenerator.com>',
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
              <li>10,000 responses per poll</li>
              <li>Visual Poll support</li>
              <li>All export options (CSV, PDF, PNG)</li>
              <li>Custom branding & short links</li>
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

// Try to register customer in Blobs (graceful failure)
async function tryRegisterCustomer(
  email: string,
  tier: string,
  stripeCustomerId: string | null,
  stripeSessionId: string,
  dashboardToken: string
): Promise<boolean> {
  try {
    const customerStore = getStore('customers');
    const normalizedEmail = email.toLowerCase().trim();
    
    let customer: CustomerRecord | null = null;
    
    try {
      customer = await customerStore.get(normalizedEmail, { type: 'json' }) as CustomerRecord | null;
    } catch {
      // Customer doesn't exist, create new
    }
    
    if (customer) {
      // Update existing customer
      customer.tier = tier;
      customer.stripeSessionId = stripeSessionId;
      if (stripeCustomerId) customer.stripeCustomerId = stripeCustomerId;
      customer.updatedAt = new Date().toISOString();
    } else {
      // Create new customer
      customer = {
        email: normalizedEmail,
        tier,
        stripeSessionId,
        dashboardToken,
        polls: [],
        createdAt: new Date().toISOString(),
      };
      if (stripeCustomerId) customer.stripeCustomerId = stripeCustomerId;
    }
    
    await customerStore.setJSON(normalizedEmail, customer);
    console.log(`Customer registered in Blobs: ${normalizedEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to register customer in Blobs (non-fatal):', error);
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
      
      // Get customer email
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      // Determine tier from metadata or line items
      let tier = metadata.tier || 'starter';
      
      // If no tier in metadata, try to determine from line items
      if (!metadata.tier && session.line_items?.data?.[0]?.price?.id) {
        tier = getTierFromPriceId(session.line_items.data[0].price.id);
      }
      
      console.log('Checkout completed:', {
        sessionId: session.id,
        tier,
        pollId: metadata.pollId,
        licenseType: metadata.licenseType,
        email: customerEmail,
      });

      // Generate dashboard token FIRST (before any Blobs operations)
      const dashboardToken = generateDashboardToken();
      
      // ================================================================
      // STEP 1: SEND EMAIL FIRST (most important!)
      // ================================================================
      if (customerEmail) {
        const emailSent = await sendDashboardEmail(customerEmail, tier, dashboardToken);
        console.log(`Dashboard email sent: ${emailSent}`);
      }
      
      // ================================================================
      // STEP 2: Try to register in Blobs (graceful failure)
      // ================================================================
      if (customerEmail) {
        const registered = await tryRegisterCustomer(
          customerEmail,
          tier,
          session.customer as string | null,
          session.id,
          dashboardToken
        );
        console.log(`Customer registered in Blobs: ${registered}`);
      }

      // ================================================================
      // STEP 3: Handle poll upgrades (if applicable)
      // ================================================================
      if (metadata.pollId && metadata.upgradeType === 'existing_poll') {
        try {
          const pollStore = getStore('vg-polls');
          const pollData = await pollStore.get(metadata.pollId, { type: 'json' }) as Poll | null;
          
          if (pollData) {
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
        } catch (error) {
          console.error('Failed to upgrade poll (non-fatal):', error);
        }
      }
      
      // ================================================================
      // STEP 4: Create Unlimited license (if applicable)
      // ================================================================
      if (metadata.licenseType === 'unlimited') {
        const licenseKey = generateLicenseKey();
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setDate(expiresAt.getDate() + 365);
        
        try {
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
          
          const licenseStore = getStore('vg-licenses');
          await licenseStore.setJSON(licenseKey, license);
          console.log(`License ${licenseKey} created`);
        } catch (error) {
          console.error('Failed to create license in Blobs (non-fatal):', error);
        }
        
        // Send license email
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
      
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id, subscription.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', subscription.id);
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
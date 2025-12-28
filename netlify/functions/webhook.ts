import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import Stripe from 'stripe';
import { getStore } from '@netlify/blobs';

// Initialize Stripe
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Poll type
interface Poll {
  id: string;
  tier: string;
  originalTier?: string;
  tierUpgradedAt?: string;
  stripeSessionId?: string;
  [key: string]: any;
}

// ============================================================================
// DETERMINISTIC TOKEN GENERATION
// Both webhook and CheckoutSuccess use this same formula
// ============================================================================
function generateDashboardToken(sessionId: string): string {
  // Use session ID directly - it's unique and both sides know it
  // Add a prefix for easy identification
  return `vg_${sessionId.replace('cs_', '').substring(0, 32)}`;
}

// Map price IDs to tiers (update with your actual price IDs)
function getTierFromPriceId(priceId: string): string {
  const priceMap: Record<string, string> = {
    'price_starter_monthly': 'starter',
    'price_pro_monthly': 'pro_event',
    'price_unlimited_monthly': 'unlimited',
    'price_starter_yearly': 'starter',
    'price_pro_yearly': 'pro_event', 
    'price_unlimited_yearly': 'unlimited',
  };
  return priceMap[priceId] || 'starter';
}

// Get days for tier
function getTierDays(tier: string): number {
  switch (tier) {
    case 'starter': return 30;
    case 'pro_event': return 60;
    case 'unlimited': return 365;
    default: return 30;
  }
}

// Send dashboard welcome email via Resend
async function sendDashboardEmail(
  email: string, 
  tier: string, 
  dashboardToken: string,
  sessionId: string
): Promise<boolean> {
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
  
  // Use the same URL format as CheckoutSuccess
  const dashboardUrl = `${baseUrl}/admin?token=${dashboardToken}&session_id=${sessionId}`;
  
  const days = getTierDays(tier);
  const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  try {
    console.log(`Sending dashboard email to ${email.substring(0, 5)}... with token ${dashboardToken.substring(0, 10)}...`);
    
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

// Try to register customer in Blobs (non-fatal if fails)
async function tryRegisterCustomer(
  email: string,
  tier: string,
  stripeCustomerId: string | null,
  sessionId: string,
  dashboardToken: string
): Promise<boolean> {
  try {
    const store = getStore('vg-customers');
    
    const customerData = {
      email,
      tier,
      stripeCustomerId,
      stripeSessionId: sessionId,
      dashboardToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + getTierDays(tier) * 24 * 60 * 60 * 1000).toISOString(),
      polls: [],
    };
    
    // Store by both email and token for lookups
    await store.setJSON(`customer_${email}`, customerData);
    await store.setJSON(`token_${dashboardToken}`, customerData);
    await store.setJSON(`session_${sessionId}`, customerData);
    
    console.log('Customer registered in Blobs');
    return true;
  } catch (error: any) {
    console.error('Blobs registration failed (non-fatal):', error.message);
    return false;
  }
}

// Main webhook handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No Stripe signature found');
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No signature' }),
    };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  console.log('Webhook received:', stripeEvent.type);

  try {
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
          email: customerEmail ? customerEmail.substring(0, 5) + '...' : 'none',
        });

        // ================================================================
        // GENERATE DETERMINISTIC TOKEN FROM SESSION ID
        // This ensures webhook and CheckoutSuccess generate SAME token!
        // ================================================================
        const dashboardToken = generateDashboardToken(session.id);
        console.log('Generated dashboard token:', dashboardToken.substring(0, 15) + '...');
        
        // ================================================================
        // STEP 1: SEND EMAIL FIRST (most important!)
        // ================================================================
        if (customerEmail) {
          const emailSent = await sendDashboardEmail(customerEmail, tier, dashboardToken, session.id);
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
            }
          } catch (error: any) {
            console.error('Poll upgrade failed (non-fatal):', error.message);
          }
        }

        // ================================================================
        // STEP 4: Handle Unlimited license (if applicable)
        // ================================================================
        if (metadata.licenseType === 'unlimited' && customerEmail) {
          try {
            const licenseStore = getStore('vg-licenses');
            await licenseStore.setJSON(`license_${customerEmail}`, {
              email: customerEmail,
              type: 'unlimited',
              purchasedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              stripeCustomerId: session.customer,
              stripeSessionId: session.id,
            });
            console.log(`Unlimited license created for ${customerEmail.substring(0, 5)}...`);
          } catch (error: any) {
            console.error('License creation failed (non-fatal):', error.message);
          }
        }
        
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription event:', stripeEvent.type, subscription.id);
        // Handle subscription changes if needed
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Always return 200 to Stripe to acknowledge receipt
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };

  } catch (error: any) {
    console.error('Webhook handler error:', error.message);
    // Still return 200 to prevent Stripe from retrying
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true, error: error.message }),
    };
  }
};
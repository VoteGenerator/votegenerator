// ============================================================================
// vg-get-customer.ts - Lookup customer with Stripe verification
// Location: netlify/functions/vg-get-customer.ts
// SECURITY: Verifies tier against Stripe, sanitizes all responses
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

// ============================================================================
// BLOBS CREDENTIALS - Required for all getStore calls
// Must match vg-create.ts exactly!
// ============================================================================
const SITE_ID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
const BLOB_TOKEN = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

interface CustomerData {
    email: string;
    tier: string;
    stripeSessionId?: string;
    stripeCustomerId?: string;
    dashboardToken: string;
    expiresAt: string;
    polls: any[];
    createdAt: string;
    updatedAt?: string;
}

// Tier config for response limits
const TIER_LIMITS: Record<string, number> = {
    free: 100,
    pro: 10000,
    business: 100000
};

// ============================================================================
// VERIFY TIER AGAINST STRIPE
// ============================================================================
async function verifyTierFromStripe(customerId: string): Promise<{
    tier: 'free' | 'pro' | 'business';
    expiresAt: string | null;
    isActive: boolean;
}> {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            // Check for canceled but not yet expired
            const allSubs = await stripe.subscriptions.list({
                customer: customerId,
                limit: 1
            });
            
            if (allSubs.data.length > 0) {
                const sub = allSubs.data[0];
                if (sub.status === 'canceled' && sub.current_period_end * 1000 > Date.now()) {
                    // Still has access until period ends
                    const tierMeta = sub.metadata?.tier as 'pro' | 'business' | undefined;
                    return {
                        tier: tierMeta || 'free',
                        expiresAt: new Date(sub.current_period_end * 1000).toISOString(),
                        isActive: true
                    };
                }
            }
            
            return { tier: 'free', expiresAt: null, isActive: false };
        }

        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0]?.price?.id;

        // Map price IDs to tiers
        const businessPrices = [
            process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
            process.env.STRIPE_BUSINESS_ANNUAL_PRICE,
        ].filter(Boolean);

        const proPrices = [
            process.env.STRIPE_PRO_MONTHLY_PRICE,
            process.env.STRIPE_PRO_ANNUAL_PRICE,
        ].filter(Boolean);

        let tier: 'free' | 'pro' | 'business' = 'free';

        if (businessPrices.includes(priceId)) {
            tier = 'business';
        } else if (proPrices.includes(priceId)) {
            tier = 'pro';
        } else {
            // Check metadata as fallback
            const tierMeta = subscription.metadata?.tier;
            if (tierMeta === 'business') tier = 'business';
            else if (tierMeta === 'pro') tier = 'pro';
        }

        return {
            tier,
            expiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
            isActive: true
        };
    } catch (error) {
        // Log internally but don't expose to user
        console.error('Stripe verification failed:', error instanceof Error ? error.message : 'Unknown');
        return { tier: 'free', expiresAt: null, isActive: false };
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // Check Blobs credentials FIRST
    if (!SITE_ID || !BLOB_TOKEN) {
        console.error('vg-get-customer: Missing Blobs credentials - SITE_ID:', !!SITE_ID, 'BLOB_TOKEN:', !!BLOB_TOKEN);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Service temporarily unavailable' }) 
        };
    }

    const token = event.queryStringParameters?.token || event.queryStringParameters?.t;
    const sessionId = event.queryStringParameters?.session_id || event.queryStringParameters?.s;

    // Sanitized logging - no sensitive data
    console.log('vg-get-customer: Request received', {
        hasToken: !!token,
        hasSessionId: !!sessionId
    });

    if (!token && !sessionId) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Authentication required' }),
        };
    }

    try {
        console.log('vg-get-customer: Using SITE_ID:', SITE_ID.slice(0, 8) + '...');

        const customerStore = getStore({
            name: 'vg-customers',
            siteID: SITE_ID,
            token: BLOB_TOKEN,
        });

        let customerData: CustomerData | null = null;

        // METHOD 1: Direct token lookup
        if (token) {
            const tokenKey = `token_${token}`;
            customerData = await customerStore.get(tokenKey, { type: 'json' }) as CustomerData | null;
        }

        // METHOD 2: Session ID index lookup
        if (!customerData && sessionId) {
            const sessionKey = `session_${sessionId}`;
            customerData = await customerStore.get(sessionKey, { type: 'json' }) as CustomerData | null;
        }

        // METHOD 3: Scan by stripeSessionId (last resort)
        if (!customerData && sessionId) {
            const list = await customerStore.list();
            
            for (const item of list.blobs) {
                if (item.key.startsWith('token_') || item.key.startsWith('session_')) {
                    continue;
                }
                
                try {
                    const customer = await customerStore.get(item.key, { type: 'json' }) as CustomerData | null;
                    if (customer && customer.stripeSessionId === sessionId) {
                        customerData = customer;
                        break;
                    }
                } catch {
                    // Skip invalid entries silently
                }
            }
        }

        if (!customerData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Account not found' }),
            };
        }

        // ====================================================================
        // SECURITY: Verify tier against Stripe (don't trust stored value)
        // ====================================================================
        let verifiedTier: 'free' | 'pro' | 'business' = 'free';
        let verifiedExpiresAt: string | null = customerData.expiresAt;
        let isActive = true;

        if (customerData.stripeCustomerId) {
            const stripeVerification = await verifyTierFromStripe(customerData.stripeCustomerId);
            verifiedTier = stripeVerification.tier;
            verifiedExpiresAt = stripeVerification.expiresAt || customerData.expiresAt;
            isActive = stripeVerification.isActive;

            // Update stored data if tier changed
            if (verifiedTier !== customerData.tier) {
                console.log('vg-get-customer: Tier mismatch detected, updating', {
                    stored: customerData.tier,
                    verified: verifiedTier
                });

                customerData.tier = verifiedTier;
                customerData.expiresAt = verifiedExpiresAt || customerData.expiresAt;
                customerData.updatedAt = new Date().toISOString();

                // Update stored data
                if (token) {
                    await customerStore.setJSON(`token_${token}`, customerData);
                }
                if (customerData.stripeCustomerId) {
                    await customerStore.setJSON(customerData.stripeCustomerId, customerData);
                }
            }
        } else {
            // No Stripe customer ID - must be free tier
            verifiedTier = 'free';
        }

        const isExpired = verifiedExpiresAt ? new Date(verifiedExpiresAt) < new Date() : false;

        // ====================================================================
        // SANITIZED RESPONSE - No sensitive data leaked
        // ====================================================================
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                // Verified tier from Stripe
                tier: verifiedTier,
                expiresAt: verifiedExpiresAt,
                isExpired,
                isActive,
                
                // Poll data (IDs only, not full poll data)
                polls: (customerData.polls || []).map((p: any) => ({
                    id: p.id || p,
                    title: p.title,
                    createdAt: p.createdAt,
                    responseCount: p.responseCount,
                    status: p.status,
                    adminKey: p.adminKey, // Needed for dashboard access
                    type: p.type || p.pollType
                })),
                
                // Metadata
                createdAt: customerData.createdAt,
                
                // Dashboard token for URL construction (this IS the auth)
                dashboardToken: customerData.dashboardToken,
                
                // Masked email for display
                email: customerData.email 
                    ? `${customerData.email.split('@')[0].substring(0, 3)}***@${customerData.email.split('@')[1]}`
                    : undefined,
                    
                // Response limit based on verified tier
                maxResponses: TIER_LIMITS[verifiedTier] || 100,
            }),
        };
    } catch (error) {
        // SECURITY: Never expose error details to client
        console.error('vg-get-customer error:', error instanceof Error ? error.message : 'Unknown error');
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Unable to retrieve account information' }),
        };
    }
};
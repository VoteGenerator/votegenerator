// ============================================================================
// vg-create.ts - Create Poll with Server-Side Tier Validation
// Location: netlify/functions/vg-create.ts
// SECURITY: Tier is verified against Stripe, not trusted from frontend
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

// Generate unique IDs
function generateId(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Generate secure random ID (for default poll IDs)
function generateSecureId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateAdminKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Validate custom slug
function isValidSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') return false;
    const trimmed = slug.trim().toLowerCase();
    if (trimmed.length < 4 || trimmed.length > 50) return false;
    if (!/^[a-z0-9-]+$/.test(trimmed)) return false;
    if (trimmed.startsWith('-') || trimmed.endsWith('-')) return false;
    if (trimmed.includes('--')) return false;
    const reserved = ['admin', 'api', 'vote', 'poll', 'results', 'create', 'pricing', 'help', 'about', 'terms', 'privacy', 'contact', 'dashboard', 'login', 'signup', 'checkout', 'success', 'cancel', 'embed'];
    return !reserved.includes(trimmed);
}

// Tier limits and features - ALL POLL TYPES ARE FREE
// Only response limits, poll counts, and premium features differ by tier
const TIER_CONFIG: Record<string, {
    maxResponses: number;
    expiresInDays: number;
    maxPolls: number;
    features: string[];
}> = {
    free: {
        maxResponses: 100,
        expiresInDays: 30,
        maxPolls: 3,
        features: ['all'],
    },
    pro: {
        maxResponses: 10000,  // Updated to match pricing page
        expiresInDays: 30,
        maxPolls: -1, // unlimited
        features: ['all'],
    },
    business: {
        maxResponses: 100000,  // Updated to match pricing page
        expiresInDays: 30,
        maxPolls: -1,
        features: ['all'],
    },
};

// ============================================================================
// STRIPE TIER VERIFICATION - Server-side validation
// ============================================================================
async function verifyUserTier(email?: string, dashboardToken?: string, sessionId?: string): Promise<{
    tier: 'free' | 'pro' | 'business';
    customerId?: string;
    expiresAt?: string;
}> {
    // If no identifying info, return free tier
    if (!email && !dashboardToken && !sessionId) {
        console.log('vg-create: No user identification provided, using free tier');
        return { tier: 'free' };
    }

    try {
        // Method 1: Check by dashboard token (most reliable)
        if (dashboardToken) {
            const customerStore = getStore({
                name: 'vg-customers',
                siteID: process.env.VG_SITE_ID || '',
                token: process.env.NETLIFY_AUTH_TOKEN || ''
            });
            
            const customerData = await customerStore.get(`token_${dashboardToken}`, { type: 'json' }) as any;
            
            if (customerData && customerData.stripeCustomerId) {
                // Verify against Stripe
                const stripeCustomer = await stripe.customers.retrieve(customerData.stripeCustomerId);
                
                if (stripeCustomer && !stripeCustomer.deleted) {
                    // Check active subscriptions
                    const subscriptions = await stripe.subscriptions.list({
                        customer: customerData.stripeCustomerId,
                        status: 'active',
                        limit: 1
                    });
                    
                    if (subscriptions.data.length > 0) {
                        const subscription = subscriptions.data[0];
                        const priceId = subscription.items.data[0]?.price?.id;
                        
                        // Determine tier from price ID
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
                            const tierMeta = subscription.metadata?.tier || (stripeCustomer as any).metadata?.tier;
                            if (tierMeta === 'business') tier = 'business';
                            else if (tierMeta === 'pro') tier = 'pro';
                        }
                        
                        console.log(`vg-create: Verified tier from Stripe: ${tier}`);
                        return {
                            tier,
                            customerId: customerData.stripeCustomerId,
                            expiresAt: new Date(subscription.current_period_end * 1000).toISOString()
                        };
                    }
                }
            }
        }
        
        // Method 2: Check by email
        if (email) {
            const customers = await stripe.customers.list({
                email: email,
                limit: 1
            });
            
            if (customers.data.length > 0) {
                const customer = customers.data[0];
                
                const subscriptions = await stripe.subscriptions.list({
                    customer: customer.id,
                    status: 'active',
                    limit: 1
                });
                
                if (subscriptions.data.length > 0) {
                    const subscription = subscriptions.data[0];
                    const priceId = subscription.items.data[0]?.price?.id;
                    
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
                        const tierMeta = subscription.metadata?.tier || customer.metadata?.tier;
                        if (tierMeta === 'business') tier = 'business';
                        else if (tierMeta === 'pro') tier = 'pro';
                    }
                    
                    console.log(`vg-create: Verified tier from email: ${tier}`);
                    return {
                        tier,
                        customerId: customer.id,
                        expiresAt: new Date(subscription.current_period_end * 1000).toISOString()
                    };
                }
            }
        }
        
        // Method 3: Check by session ID (for recent checkouts)
        if (sessionId) {
            try {
                const session = await stripe.checkout.sessions.retrieve(sessionId);
                
                if (session && session.customer) {
                    const customerId = typeof session.customer === 'string' 
                        ? session.customer 
                        : session.customer.id;
                    
                    const subscriptions = await stripe.subscriptions.list({
                        customer: customerId,
                        status: 'active',
                        limit: 1
                    });
                    
                    if (subscriptions.data.length > 0) {
                        const subscription = subscriptions.data[0];
                        const tierMeta = subscription.metadata?.tier;
                        
                        let tier: 'free' | 'pro' | 'business' = 'free';
                        if (tierMeta === 'business') tier = 'business';
                        else if (tierMeta === 'pro') tier = 'pro';
                        else if (session.metadata?.tier) {
                            tier = session.metadata.tier as 'pro' | 'business';
                        }
                        
                        console.log(`vg-create: Verified tier from session: ${tier}`);
                        return {
                            tier,
                            customerId,
                            expiresAt: new Date(subscription.current_period_end * 1000).toISOString()
                        };
                    }
                }
            } catch (e) {
                console.log('vg-create: Session lookup failed, using free tier');
            }
        }
        
        // No valid subscription found
        console.log('vg-create: No active subscription found, using free tier');
        return { tier: 'free' };
        
    } catch (error) {
        console.error('vg-create: Tier verification error:', error);
        // On error, default to free tier (safe default)
        return { tier: 'free' };
    }
}

// ============================================================================
// COUNT USER'S EXISTING POLLS
// ============================================================================
async function countUserPolls(dashboardToken?: string, sessionId?: string, customerId?: string): Promise<number> {
    if (!dashboardToken && !sessionId && !customerId) {
        return 0;
    }
    
    try {
        const customerStore = getStore({
            name: 'vg-customers',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        let customerData: any = null;
        
        // Try dashboard token first
        if (dashboardToken) {
            customerData = await customerStore.get(`token_${dashboardToken}`, { type: 'json' });
        }
        
        // Try customer ID
        if (!customerData && customerId) {
            customerData = await customerStore.get(customerId, { type: 'json' });
        }
        
        // Try session ID lookup
        if (!customerData && sessionId) {
            const list = await customerStore.list();
            for (const key of list.blobs) {
                if (key.key.startsWith('token_')) continue;
                try {
                    const customer = await customerStore.get(key.key, { type: 'json' }) as any;
                    if (customer && customer.stripeSessionId === sessionId) {
                        customerData = customer;
                        break;
                    }
                } catch (e) {
                    // Skip invalid entries
                }
            }
        }
        
        if (customerData && customerData.polls && Array.isArray(customerData.polls)) {
            // Count only active polls (not deleted)
            const activePolls = customerData.polls.filter((p: any) => p.status !== 'deleted');
            return activePolls.length;
        }
        
        return 0;
    } catch (error) {
        console.error('vg-create: Error counting polls:', error);
        return 0;
    }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================
export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

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

    try {
        const body = JSON.parse(event.body || '{}');
        
        const question = body.title || body.question;
        const { 
            options, pollType, settings, customSlug, unlisted, 
            status: requestedStatus, imageUrls, pin, allowedCodes, 
            dashboardToken, sessionId, theme, ratingStyle, 
            meetingDuration, logoUrl, buttonText, sections, 
            surveySettings, isSurvey, userEmail 
        } = body;

        // ====================================================================
        // SECURITY: Verify tier from Stripe, NOT from request body
        // ====================================================================
        const { tier, customerId, expiresAt: planExpiresAt } = await verifyUserTier(
            userEmail,
            dashboardToken,
            sessionId
        );
        
        console.log(`vg-create: Verified tier = ${tier} (requested tier was ${body.tier || 'not specified'})`);
        
        // Get tier config based on VERIFIED tier
        const tierConfig = TIER_CONFIG[tier];

        // Validation
        if (!question || typeof question !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Question is required' }),
            };
        }

        // Skip option validation for rating polls and surveys
        const skipOptionValidation = pollType === 'rating' || pollType === 'survey' || isSurvey;
        
        if (!skipOptionValidation && (!options || !Array.isArray(options) || options.length < 2)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'At least 2 options are required' }),
            };
        }

        // Check if plan has expired (for paid tiers)
        if (tier !== 'free' && planExpiresAt) {
            const expiryDate = new Date(planExpiresAt);
            if (expiryDate < new Date()) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Your plan has expired. Please renew to create new polls.',
                        expired: true,
                        expiredAt: planExpiresAt
                    }),
                };
            }
        }

        // ====================================================================
        // POLL LIMIT ENFORCEMENT - Always check for free tier
        // ====================================================================
        if (tierConfig.maxPolls > 0) {
            const existingPollCount = await countUserPolls(dashboardToken, sessionId, customerId);
            
            console.log(`vg-create: User has ${existingPollCount} polls, limit is ${tierConfig.maxPolls}`);
            
            if (existingPollCount >= tierConfig.maxPolls) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ 
                        error: `You've reached the maximum of ${tierConfig.maxPolls} active poll${tierConfig.maxPolls > 1 ? 's' : ''} for the free plan. Upgrade to Pro for unlimited polls!`,
                        pollLimit: tierConfig.maxPolls,
                        currentPolls: existingPollCount,
                        upgradeRequired: true,
                        tier: tier
                    }),
                };
            }
        }

        // ====================================================================
        // CUSTOM SLUG - Business tier only (verified)
        // ====================================================================
        let pollId: string;
        let hasCustomSlug = false;
        
        if (customSlug && tier === 'business') {
            const normalizedSlug = customSlug.trim().toLowerCase();
            
            if (!isValidSlug(normalizedSlug)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid custom link format' }),
                };
            }
            
            // Check if slug is already taken
            const slugStore = getStore({
                name: 'poll-slugs',
                siteID: process.env.VG_SITE_ID || '',
                token: process.env.NETLIFY_AUTH_TOKEN || ''
            });
            
            const existingPollId = await slugStore.get(normalizedSlug, { type: 'text' });
            
            if (existingPollId) {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ 
                        error: 'This custom link is already taken',
                        suggestion: `${normalizedSlug}-${Math.random().toString(36).substring(2, 6)}`
                    }),
                };
            }
            
            pollId = normalizedSlug;
            hasCustomSlug = true;
        } else if (customSlug && tier !== 'business') {
            // User tried to use custom slug without Business tier
            console.log(`vg-create: Blocked custom slug attempt from ${tier} user`);
            // Don't error, just ignore the custom slug
            pollId = generateSecureId();
        } else {
            pollId = generateSecureId();
        }
        
        const adminKey = generateAdminKey();

        // Calculate expiry
        const expiresAt = new Date(
            Date.now() + tierConfig.expiresInDays * 24 * 60 * 60 * 1000
        ).toISOString();

        // Create poll object with VERIFIED tier
        const poll = {
            id: pollId,
            adminKey,
            title: question.trim(),
            question: question.trim(),
            description: body.description || null,
            options: (options || []).filter((o: string) => o && o.trim()).map((o: string, i: number) => ({
                id: `opt_${i}`,
                text: o.trim(),
                imageUrl: (pollType === 'image' && imageUrls && imageUrls[i]) ? imageUrls[i] : undefined,
            })),
            pollType: pollType || 'multiple_choice',
            imageUrls: (pollType === 'image' && imageUrls) ? imageUrls : undefined,
            settings: {
                allowMultiple: settings?.allowMultiple || false,
                hideResults: settings?.hideResults || false,
                requireNames: settings?.requireNames || false,
                endDate: settings?.endDate || null,
                deadline: settings?.deadline || null,
                unlisted: unlisted || false,
                security: settings?.security || 'none',
            },
            pin: pin || null,
            allowedCodes: allowedCodes || null,
            customSlug: hasCustomSlug ? pollId : null,
            // IMPORTANT: Store VERIFIED tier, not frontend-claimed tier
            tier,
            maxResponses: tierConfig.maxResponses,
            expiresAt,
            createdAt: new Date().toISOString(),
            votes: [],
            voteCount: 0,
            responseCount: 0,
            status: tier === 'free' ? 'live' : (requestedStatus || 'live'),
            // Logo URL - only for Business tier
            logoUrl: tier === 'business' ? (logoUrl || null) : null,
            theme: theme || 'default',
            ratingStyle: ratingStyle || 'stars',
            meetingDuration: meetingDuration || 60,
            buttonText: buttonText || 'Submit Vote',
            isSurvey: isSurvey || false,
            sections: sections || null,
            surveySettings: surveySettings || null,
            notificationSettings: body.notificationSettings || null,
            // Store creator info for future lookups
            creatorCustomerId: customerId || null,
        };

        // Store poll
        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        
        await store.setJSON(pollId, poll);
        
        // Store slug mapping if custom
        if (hasCustomSlug) {
            const slugStore = getStore({
                name: 'poll-slugs',
                siteID: process.env.VG_SITE_ID || '',
                token: process.env.NETLIFY_AUTH_TOKEN || ''
            });
            await slugStore.set(pollId, pollId);
        }

        console.log(`vg-create: Poll created: ${pollId} (tier: ${tier}, maxResponses: ${tierConfig.maxResponses})`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                id: pollId,
                pollId,
                adminKey,
                customSlug: hasCustomSlug ? pollId : null,
                voteUrl: `/vote/${pollId}`,
                adminUrl: `/admin/${pollId}/${adminKey}`,
                resultsUrl: `/results/${pollId}`,
                shareUrl: hasCustomSlug ? `/p/${pollId}` : `/#id=${pollId}`,
                // Return VERIFIED tier info
                tier,
                maxResponses: tierConfig.maxResponses,
                expiresAt,
                unlisted: unlisted || false,
            }),
        };

    } catch (error) {
        console.error('vg-create error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to create poll',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
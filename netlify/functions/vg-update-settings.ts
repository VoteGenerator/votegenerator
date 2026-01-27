// ============================================================================
// vg-update-settings.ts - Update poll settings with tier validation
// Location: netlify/functions/vg-update-settings.ts
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16'
});

interface PollSettings {
    hideResults?: boolean;
    allowMultiple?: boolean;
    requireNames?: boolean;
    security?: string;
    allowComments?: boolean;
    publicComments?: boolean;
    deadline?: string;
    unlisted?: boolean;
    maxVotes?: number;
    timezone?: string;
    blockVpn?: boolean;
    dotBudget?: number;
    budgetLimit?: number;
    anonymousMode?: boolean;
    publicResults?: boolean;
    allowedViews?: string[];
    showShareButton?: boolean;
    shareKey?: string;
    showSocialShare?: boolean;
    // Business-only settings
    customLogo?: string | null;
    redirectUrl?: string | null;
    customSlug?: string | null;
}

// Settings that require specific tiers
const BUSINESS_ONLY_SETTINGS = ['customLogo', 'redirectUrl', 'customSlug'];
const PRO_PLUS_SETTINGS = ['removeBranding', 'customColors', 'notifications'];

interface Poll {
    id: string;
    adminKey: string;
    settings: PollSettings;
    creatorEmail?: string;
    [key: string]: any;
}

// Verify user tier from Stripe
async function getUserTier(email: string): Promise<'free' | 'pro' | 'business'> {
    if (!email) return 'free';
    
    try {
        // Search for customer by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        });
        
        if (customers.data.length === 0) return 'free';
        
        const customer = customers.data[0];
        
        // Check active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1
        });
        
        if (subscriptions.data.length === 0) return 'free';
        
        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0]?.price?.id;
        
        // Map price IDs to tiers (these should match your Stripe product prices)
        const businessPrices = [
            process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
            process.env.STRIPE_BUSINESS_ANNUAL_PRICE,
            'price_business_monthly',
            'price_business_annual'
        ];
        const proPrices = [
            process.env.STRIPE_PRO_MONTHLY_PRICE,
            process.env.STRIPE_PRO_ANNUAL_PRICE,
            'price_pro_monthly',
            'price_pro_annual'
        ];
        
        if (businessPrices.includes(priceId)) return 'business';
        if (proPrices.includes(priceId)) return 'pro';
        
        // Check metadata as fallback
        const tierMeta = subscription.metadata?.tier || customer.metadata?.tier;
        if (tierMeta === 'business') return 'business';
        if (tierMeta === 'pro') return 'pro';
        
        return 'free';
    } catch (error) {
        console.error('Error checking user tier:', error);
        return 'free';
    }
}

const handler: Handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, settings, userEmail } = body;

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        if (!settings || typeof settings !== 'object') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Settings object is required' })
            };
        }

        // Get poll from store
        const pollStore = getStore({ 
            name: 'polls', 
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });
        const pollData = await pollStore.get(pollId, { type: 'json' }) as Poll | null;

        if (!pollData) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Verify admin key
        if (pollData.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        // ================================================================
        // TIER VALIDATION - Prevent unauthorized access to premium features
        // ================================================================
        const email = userEmail || pollData.creatorEmail;
        const userTier = await getUserTier(email);
        const isBusiness = userTier === 'business';
        const isPro = userTier === 'pro' || userTier === 'business';
        
        console.log('Tier validation:', { email, userTier, isBusiness, isPro });
        
        // Check for Business-only settings
        const attemptedBusinessSettings = Object.keys(settings).filter(
            key => BUSINESS_ONLY_SETTINGS.includes(key) && settings[key] !== null && settings[key] !== undefined && settings[key] !== ''
        );
        
        if (attemptedBusinessSettings.length > 0 && !isBusiness) {
            console.log('Blocked attempt to use Business-only settings:', attemptedBusinessSettings);
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ 
                    error: 'Business plan required',
                    message: `The following settings require a Business plan: ${attemptedBusinessSettings.join(', ')}`,
                    blockedSettings: attemptedBusinessSettings,
                    currentTier: userTier,
                    requiredTier: 'business'
                })
            };
        }
        
        // Filter out any premium settings the user shouldn't have access to
        const filteredSettings: Partial<PollSettings> = { ...settings };
        
        if (!isBusiness) {
            // Remove Business-only settings for non-Business users
            BUSINESS_ONLY_SETTINGS.forEach(key => {
                if (key in filteredSettings) {
                    delete (filteredSettings as any)[key];
                }
            });
        }

        // Merge new settings with existing settings
        const updatedSettings: PollSettings = {
            ...pollData.settings,
            ...filteredSettings
        };

        console.log('Updating settings for poll:', pollId);
        console.log('User tier:', userTier);
        console.log('Previous settings:', pollData.settings);
        console.log('Filtered settings to merge:', filteredSettings);
        console.log('Updated settings:', updatedSettings);

        // Update poll with new settings
        const updatedPoll: Poll = {
            ...pollData,
            settings: updatedSettings,
            updatedAt: new Date().toISOString()
        };

        // Save to store
        await pollStore.setJSON(pollId, updatedPoll);
        console.log('Settings saved successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                settings: updatedSettings,
                message: 'Settings updated successfully',
                tier: userTier
            })
        };

    } catch (error) {
        console.error('Error updating settings:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update settings' })
        };
    }
};

export { handler };
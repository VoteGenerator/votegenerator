// ============================================================================
// vg-load-test.ts - Generate fake votes with realistic data for testing
// Location: netlify/functions/vg-load-test.ts
// 
// Generates realistic: geo locations, devices, browsers, timestamps, etc.
// WARNING: Delete this file after testing!
// ============================================================================
import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Set a password to prevent abuse - MUST be set in Netlify env vars
const TEST_PASSWORD = process.env.LOAD_TEST_PASSWORD;

// Realistic geo data - weighted towards US but includes international
const geoData = [
    // US Cities (60% of votes)
    { country: 'US', region: 'California', city: 'Los Angeles', weight: 12 },
    { country: 'US', region: 'California', city: 'San Francisco', weight: 8 },
    { country: 'US', region: 'New York', city: 'New York City', weight: 15 },
    { country: 'US', region: 'Texas', city: 'Houston', weight: 7 },
    { country: 'US', region: 'Texas', city: 'Austin', weight: 5 },
    { country: 'US', region: 'Florida', city: 'Miami', weight: 6 },
    { country: 'US', region: 'Illinois', city: 'Chicago', weight: 8 },
    { country: 'US', region: 'Washington', city: 'Seattle', weight: 5 },
    { country: 'US', region: 'Massachusetts', city: 'Boston', weight: 4 },
    { country: 'US', region: 'Colorado', city: 'Denver', weight: 3 },
    // International (40% of votes)
    { country: 'GB', region: 'England', city: 'London', weight: 8 },
    { country: 'CA', region: 'Ontario', city: 'Toronto', weight: 5 },
    { country: 'AU', region: 'New South Wales', city: 'Sydney', weight: 4 },
    { country: 'DE', region: 'Berlin', city: 'Berlin', weight: 3 },
    { country: 'FR', region: 'Île-de-France', city: 'Paris', weight: 3 },
    { country: 'JP', region: 'Tokyo', city: 'Tokyo', weight: 2 },
    { country: 'BR', region: 'São Paulo', city: 'São Paulo', weight: 2 },
    { country: 'IN', region: 'Maharashtra', city: 'Mumbai', weight: 3 },
    { country: 'MX', region: 'Mexico City', city: 'Mexico City', weight: 2 },
    { country: 'ES', region: 'Madrid', city: 'Madrid', weight: 2 },
];

// Device types
const devices = [
    { type: 'mobile', weight: 55 },
    { type: 'desktop', weight: 38 },
    { type: 'tablet', weight: 7 },
];

// Browsers
const browsers = [
    { name: 'Chrome', version: '120.0', weight: 45 },
    { name: 'Safari', version: '17.2', weight: 25 },
    { name: 'Firefox', version: '121.0', weight: 10 },
    { name: 'Edge', version: '120.0', weight: 12 },
    { name: 'Samsung Internet', version: '23.0', weight: 5 },
    { name: 'Opera', version: '105.0', weight: 3 },
];

// Operating Systems
const operatingSystems = [
    { name: 'Windows', version: '10', weight: 30 },
    { name: 'Windows', version: '11', weight: 15 },
    { name: 'macOS', version: '14.2', weight: 18 },
    { name: 'iOS', version: '17.2', weight: 20 },
    { name: 'Android', version: '14', weight: 15 },
    { name: 'Linux', version: '', weight: 2 },
];

// Referrers
const referrers = [
    { source: 'direct', medium: 'none', weight: 35 },
    { source: 'google', medium: 'organic', weight: 25 },
    { source: 'facebook', medium: 'social', weight: 12 },
    { source: 'twitter', medium: 'social', weight: 8 },
    { source: 'linkedin', medium: 'social', weight: 5 },
    { source: 'email', medium: 'email', weight: 8 },
    { source: 'slack', medium: 'referral', weight: 4 },
    { source: 'reddit', medium: 'social', weight: 3 },
];

// Helper to pick weighted random
function weightedRandom<T extends { weight: number }>(items: T[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }
    return items[0];
}

// Generate random timestamp within the last N days
function randomTimestamp(daysBack: number): string {
    const now = Date.now();
    const msBack = daysBack * 24 * 60 * 60 * 1000;
    const randomMs = Math.random() * msBack;
    return new Date(now - randomMs).toISOString();
}

// Generate a realistic fingerprint-like hash
function generateFingerprint(): string {
    const chars = 'abcdef0123456789';
    let fp = '';
    for (let i = 0; i < 32; i++) {
        fp += chars[Math.floor(Math.random() * chars.length)];
    }
    return fp;
}

// Generate random IP (fake but realistic format)
function generateIP(): string {
    return [
        Math.floor(Math.random() * 223) + 1, // Avoid 0.x.x.x and 224+
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ].join('.');
}

// Generate a fake vote with all realistic data
function generateFakeVote(poll: any, index: number, daysBack: number): any {
    const geo = weightedRandom(geoData);
    const device = weightedRandom(devices);
    const browser = weightedRandom(browsers);
    const os = weightedRandom(operatingSystems);
    const referrer = weightedRandom(referrers);
    
    // Pick a random option
    const optionIndex = Math.floor(Math.random() * (poll.options?.length || 2));
    const option = poll.options?.[optionIndex] || { id: 'opt_0', text: 'Option 1' };
    
    // For rating polls, generate a rating
    let rating: number | undefined;
    if (poll.pollType === 'rating') {
        // Weighted towards positive ratings
        const ratings = [1, 2, 3, 4, 5];
        const weights = [5, 10, 20, 35, 30]; // Skewed positive
        let r = Math.random() * 100;
        for (let i = 0; i < ratings.length; i++) {
            r -= weights[i];
            if (r <= 0) {
                rating = ratings[i];
                break;
            }
        }
        rating = rating || 4;
    }
    
    // For ranked choice, generate a ranking
    let rankings: string[] | undefined;
    if (poll.pollType === 'ranked') {
        const optionIds = poll.options?.map((o: any) => o.id) || ['opt_0', 'opt_1'];
        rankings = [...optionIds].sort(() => Math.random() - 0.5);
    }
    
    // Generate vote ID
    const voteId = 'vote_test_' + Date.now().toString(36) + '_' + index.toString(36);
    
    return {
        id: voteId,
        optionId: option.id,
        optionText: option.text,
        rating,
        rankings,
        timestamp: randomTimestamp(daysBack),
        
        // Voter info (optional)
        voterName: poll.settings?.requireNames ? generateRandomName() : undefined,
        
        // Device/Browser info
        deviceType: device.type,
        browser: browser.name,
        browserVersion: browser.version,
        os: os.name,
        osVersion: os.version,
        
        // Geo data
        country: geo.country,
        region: geo.region,
        city: geo.city,
        
        // Referrer
        referrerSource: referrer.source,
        referrerMedium: referrer.medium,
        
        // Security/tracking
        fingerprint: generateFingerprint(),
        ip: generateIP(), // Fake IP for testing
        
        // Meta
        isTestVote: true,
        userAgent: generateUserAgent(browser, os, device.type),
    };
}

// Generate realistic user agent
function generateUserAgent(browser: any, os: any, deviceType: string): string {
    const osStrings: Record<string, string> = {
        'Windows 10': 'Windows NT 10.0; Win64; x64',
        'Windows 11': 'Windows NT 10.0; Win64; x64',
        'macOS 14.2': 'Macintosh; Intel Mac OS X 14_2',
        'iOS 17.2': 'iPhone; CPU iPhone OS 17_2 like Mac OS X',
        'Android 14': 'Linux; Android 14',
        'Linux': 'X11; Linux x86_64',
    };
    
    const osKey = os.name + (os.version ? ' ' + os.version : '');
    const osString = osStrings[osKey] || 'Windows NT 10.0; Win64; x64';
    
    if (browser.name === 'Chrome') {
        return 'Mozilla/5.0 (' + osString + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/' + browser.version + ' Safari/537.36';
    }
    if (browser.name === 'Safari') {
        return 'Mozilla/5.0 (' + osString + ') AppleWebKit/605.1.15 (KHTML, like Gecko) Version/' + browser.version + ' Safari/605.1.15';
    }
    if (browser.name === 'Firefox') {
        return 'Mozilla/5.0 (' + osString + '; rv:' + browser.version + ') Gecko/20100101 Firefox/' + browser.version;
    }
    return 'Mozilla/5.0 (' + osString + ') AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
}

// Generate random name
function generateRandomName(): string {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Cameron', 'Drew', 'Jamie', 'Skyler', 'Reese', 'Dakota'];
    const lastInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastInitials[Math.floor(Math.random() * lastInitials.length)] + '.';
}

// Main handler
export const handler: Handler = async (event) => {
    console.log('[vg-load-test] Function invoked');
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        console.log('[vg-load-test] OPTIONS request');
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        console.log('[vg-load-test] Wrong method:', event.httpMethod);
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        console.log('[vg-load-test] Parsing body');
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, count = 100, daysBack = 7, testPassword } = body;

        console.log('[vg-load-test] Checking password...');
        console.log('[vg-load-test] TEST_PASSWORD exists:', !!TEST_PASSWORD);
        console.log('[vg-load-test] testPassword provided:', !!testPassword);
        
        // Security check
        if (!TEST_PASSWORD) {
            console.log('[vg-load-test] ERROR: LOAD_TEST_PASSWORD not in env');
            return { 
                statusCode: 500, 
                headers, 
                body: JSON.stringify({ error: 'LOAD_TEST_PASSWORD not configured in environment' }) 
            };
        }
        
        if (testPassword !== TEST_PASSWORD) {
            console.log('[vg-load-test] ERROR: Password mismatch');
            console.log('[vg-load-test] Expected length:', TEST_PASSWORD.length);
            console.log('[vg-load-test] Received length:', testPassword?.length || 0);
            return { 
                statusCode: 403, 
                headers, 
                body: JSON.stringify({ error: 'Invalid test password' }) 
            };
        }

        console.log('[vg-load-test] Password OK, checking inputs');
        
        if (!pollId || !adminKey) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'pollId and adminKey required' }) 
            };
        }

        // Limit to prevent abuse
        const voteCount = Math.min(count, 1000); // Max 1000 per request

        console.log('[vg-load-test] Getting poll:', pollId);
        
        // Get poll - use explicit credentials
        const siteID = process.env.VG_SITE_ID || process.env.SITE_ID || '';
        const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';
        
        if (!siteID || !token) {
            console.log('[vg-load-test] Missing siteID or token');
            return { 
                statusCode: 500, 
                headers, 
                body: JSON.stringify({ error: 'Blobs not configured - missing VG_SITE_ID or NETLIFY_AUTH_TOKEN' }) 
            };
        }
        
        const pollStore = getStore({ name: 'polls', siteID, token });
        
        let poll: any;
        try {
            poll = await pollStore.get(pollId, { type: 'json' });
        } catch (e) {
            console.log('[vg-load-test] Poll fetch error:', e);
            return { 
                statusCode: 404, 
                headers, 
                body: JSON.stringify({ error: 'Poll not found or access error' }) 
            };
        }

        if (!poll) {
            console.log('[vg-load-test] Poll not found');
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Poll not found' }) };
        }

        if (poll.adminKey !== adminKey) {
            console.log('[vg-load-test] Admin key mismatch');
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid admin key' }) };
        }

        console.log('[vg-load-test] Generating', voteCount, 'votes');
        
        // Generate fake votes
        const existingVotes = poll.votes || [];
        const newVotes = [];

        for (let i = 0; i < voteCount; i++) {
            newVotes.push(generateFakeVote(poll, i, daysBack));
        }

        // Update poll
        poll.votes = [...existingVotes, ...newVotes];
        poll.voteCount = poll.votes.length;
        poll.totalVotes = poll.votes.length;  // Keep both for compatibility
        poll.responseCount = poll.votes.length;  // Also update responseCount
        
        console.log('[vg-load-test] Saving poll with', poll.voteCount, 'total votes');
        
        await pollStore.setJSON(pollId, poll);

        // Calculate some stats for response
        const countriesSet = new Set(newVotes.map((v: any) => v.country));
        const deviceStats = {
            mobile: newVotes.filter((v: any) => v.deviceType === 'mobile').length,
            desktop: newVotes.filter((v: any) => v.deviceType === 'desktop').length,
            tablet: newVotes.filter((v: any) => v.deviceType === 'tablet').length,
        };

        console.log('[vg-load-test] Success!');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Added ' + voteCount + ' test votes',
                totalVotes: poll.totalVotes,
                stats: {
                    countriesGenerated: countriesSet.size,
                    deviceBreakdown: deviceStats,
                    timeSpan: daysBack + ' days',
                },
                warning: '⚠️ DELETE THIS FUNCTION AFTER TESTING!'
            }),
        };

    } catch (err: any) {
        console.error('[vg-load-test] Error:', err);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ 
                error: 'Internal error', 
                details: err.message || 'Unknown error' 
            }) 
        };
    }
};
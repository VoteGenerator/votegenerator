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

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateFakeIP(geo: any): string {
    // Generate somewhat realistic IP ranges per country
    const ipRanges: { [key: string]: string } = {
        'US': `${Math.floor(Math.random() * 50) + 50}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'GB': `${Math.floor(Math.random() * 30) + 80}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'CA': `${Math.floor(Math.random() * 20) + 24}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'AU': `${Math.floor(Math.random() * 20) + 120}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'DE': `${Math.floor(Math.random() * 30) + 85}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    };
    return ipRanges[geo.country] || `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateUserAgent(device: any, browser: any, os: any): string {
    if (device.type === 'mobile' && os.name === 'iOS') {
        return `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.version.replace('.', '_')} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${browser.version} Mobile/15E148 Safari/604.1`;
    }
    if (device.type === 'mobile' && os.name === 'Android') {
        return `Mozilla/5.0 (Linux; Android ${os.version}; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version} Mobile Safari/537.36`;
    }
    if (os.name === 'Windows') {
        return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version} Safari/537.36`;
    }
    if (os.name === 'macOS') {
        return `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${browser.version} Safari/605.1.15`;
    }
    return `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version} Safari/537.36`;
}

function generateTimestamp(daysBack: number): string {
    const now = Date.now();
    const past = now - (daysBack * 24 * 60 * 60 * 1000);
    
    // Weight towards more recent votes
    const random = Math.pow(Math.random(), 0.7); // Skew towards recent
    const timestamp = past + random * (now - past);
    
    return new Date(timestamp).toISOString();
}

function generateFakeVote(poll: any, index: number, daysBack: number): any {
    const options = poll.options || [];
    const pollType = poll.pollType || 'multiple-choice';
    
    // Pick random data
    const geo = weightedRandom(geoData);
    const device = weightedRandom(devices);
    const browser = weightedRandom(browsers);
    const os = weightedRandom(operatingSystems);
    const referrer = weightedRandom(referrers);
    
    const vote: any = {
        oderId: `test_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: generateTimestamp(daysBack),
        
        // Geo data
        ip: generateFakeIP(geo),
        country: geo.country,
        region: geo.region,
        city: geo.city,
        
        // Device data
        deviceType: device.type,
        browser: browser.name,
        browserVersion: browser.version,
        os: os.name,
        osVersion: os.version,
        userAgent: generateUserAgent(device, browser, os),
        
        // Referrer data
        referrerSource: referrer.source,
        referrerMedium: referrer.medium,
        
        // Screen info (for mobile vs desktop)
        screenWidth: device.type === 'mobile' ? randomFrom([375, 390, 414, 428]) : 
                     device.type === 'tablet' ? randomFrom([768, 820, 834]) :
                     randomFrom([1280, 1366, 1440, 1920, 2560]),
        screenHeight: device.type === 'mobile' ? randomFrom([667, 844, 896, 926]) :
                      device.type === 'tablet' ? randomFrom([1024, 1180, 1194]) :
                      randomFrom([720, 768, 900, 1080, 1440]),
    };
    
    // Generate vote based on poll type
    switch (pollType) {
        case 'multiple-choice':
        case 'image-poll':
            // Weight votes slightly towards first options (realistic)
            const weights = options.map((_: any, i: number) => Math.pow(0.8, i));
            const totalWeight = weights.reduce((a: number, b: number) => a + b, 0);
            let r = Math.random() * totalWeight;
            for (let i = 0; i < options.length; i++) {
                r -= weights[i];
                if (r <= 0) {
                    vote.optionId = options[i]?.id || i;
                    break;
                }
            }
            if (vote.optionId === undefined) vote.optionId = options[0]?.id || 0;
            break;
            
        case 'rating-scale':
            // Bell curve around 3-4 stars
            const ratings = [1, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5];
            vote.rating = randomFrom(ratings);
            break;
            
        case 'ranked-choice':
            const shuffled = [...options].sort(() => Math.random() - 0.5);
            vote.rankings = shuffled.map((o: any) => o.id);
            break;
            
        case 'open-ended':
            const responses = [
                'Great experience overall!',
                'Really enjoyed this, would recommend.',
                'Could use some improvements but solid.',
                'Excellent! Exceeded my expectations.',
                'Good value for the price.',
                'Very satisfied with the results.',
                'Would definitely use again.',
                'Not bad, room for improvement.',
                'Impressive quality and service.',
                'Met my needs perfectly.',
                'Fast and efficient.',
                'User friendly and intuitive.',
                'Amazing product, love it!',
                'Decent but could be better.',
                'Highly recommended!',
            ];
            vote.response = randomFrom(responses);
            break;
            
        default:
            vote.optionId = options[0]?.id || 0;
    }
    
    return vote;
}

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { pollId, adminKey, count = 100, daysBack = 7, testPassword } = body;

        // Security check
        if (!TEST_PASSWORD) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'LOAD_TEST_PASSWORD not configured in environment' }) };
        }
        
        if (testPassword !== TEST_PASSWORD) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid test password' }) };
        }

        if (!pollId || !adminKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'pollId and adminKey required' }) };
        }

        // Limit to prevent abuse
        const voteCount = Math.min(count, 1000); // Max 1000 per request

        // Get poll
        const pollStore = getStore('polls');
        const poll = await pollStore.get(pollId, { type: 'json' }) as any;

        if (!poll) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Poll not found' }) };
        }

        if (poll.adminKey !== adminKey) {
            return { statusCode: 403, headers, body: JSON.stringify({ error: 'Invalid admin key' }) };
        }

        // Generate fake votes
        const existingVotes = poll.votes || [];
        const newVotes = [];

        for (let i = 0; i < voteCount; i++) {
            newVotes.push(generateFakeVote(poll, i, daysBack));
        }

        // Update poll
        poll.votes = [...existingVotes, ...newVotes];
        poll.totalVotes = poll.votes.length;
        
        await pollStore.setJSON(pollId, poll);

        // Calculate some stats for response
        const countries = new Set(newVotes.map((v: any) => v.country));
        const devices = {
            mobile: newVotes.filter((v: any) => v.deviceType === 'mobile').length,
            desktop: newVotes.filter((v: any) => v.deviceType === 'desktop').length,
            tablet: newVotes.filter((v: any) => v.deviceType === 'tablet').length,
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Added ${voteCount} test votes`,
                totalVotes: poll.totalVotes,
                stats: {
                    countriesGenerated: countries.size,
                    deviceBreakdown: devices,
                    timeSpan: `${daysBack} days`,
                },
                warning: '⚠️ DELETE THIS FUNCTION AFTER TESTING!'
            }),
        };

    } catch (err) {
        console.error('[vg-load-test] Error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
    }
};
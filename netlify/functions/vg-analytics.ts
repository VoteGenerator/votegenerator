import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface VoteAnalytics {
    device: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    country?: string;
    region?: string;
    referrerDomain?: string;
    utmSource?: string;
    timestamp: string;
}

interface Vote {
    id: string;
    timestamp: string;
    analytics?: VoteAnalytics;
    voterName?: string;
    comment?: string;
}

interface Poll {
    id: string;
    adminKey: string;
    votes: Vote[];
    voteCount: number;
    createdAt: string;
}

// Country code to name mapping
const COUNTRY_NAMES: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'IN': 'India',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'ES': 'Spain',
    'IT': 'Italy',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'KR': 'South Korea',
    'SG': 'Singapore',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'PT': 'Portugal',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'ZA': 'South Africa',
    'IL': 'Israel',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'TR': 'Turkey',
    'RU': 'Russia',
    'UA': 'Ukraine',
    'CZ': 'Czech Republic',
    'RO': 'Romania',
    'GR': 'Greece',
    'HU': 'Hungary'
};

const getCountryName = (code: string): string => {
    return COUNTRY_NAMES[code] || code;
};

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const pollId = event.queryStringParameters?.pollId;
        const adminKey = event.queryStringParameters?.adminKey;
        const tier = event.queryStringParameters?.tier || 'unlimited'; // Default to unlimited for full analytics

        if (!pollId || !adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Poll ID and admin key are required' })
            };
        }

        const store = getStore({
            name: 'polls',
            siteID: process.env.VG_SITE_ID || '',
            token: process.env.NETLIFY_AUTH_TOKEN || ''
        });

        const poll: Poll | null = await store.get(pollId, { type: 'json' });

        if (!poll) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        if (poll.adminKey !== adminKey) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Invalid admin key' })
            };
        }

        const votes = poll.votes || [];
        const totalVotes = votes.length;

        if (totalVotes === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    tier,
                    totalVotes: 0,
                    privacyInfo: {
                        whatWeTrack: ['Vote timestamp', 'Device type (mobile/desktop)', 'Country (from IP, not stored)'],
                        whatWeDontTrack: ['IP addresses', 'Personal identifiers', 'Browsing history', 'Cookies'],
                        countryTracking: 'Country is derived from IP at vote time. The IP itself is never stored.'
                    }
                })
            };
        }

        // ============================================
        // AGGREGATE ANALYTICS
        // ============================================
        
        // Timestamps
        const timestamps = votes.map(v => new Date(v.timestamp).getTime()).sort((a, b) => a - b);
        const firstVote = new Date(timestamps[0]).toISOString();
        const lastVote = new Date(timestamps[timestamps.length - 1]).toISOString();
        const durationMs = timestamps[timestamps.length - 1] - timestamps[0];
        const durationHours = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
        const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24) * 10) / 10;

        // Hourly distribution
        const hourlyDistribution: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hourlyDistribution[i] = 0;
        
        votes.forEach(v => {
            const hour = new Date(v.timestamp).getHours();
            hourlyDistribution[hour]++;
        });

        // Find peak hour
        let peakHour = 0;
        let peakHourVotes = 0;
        Object.entries(hourlyDistribution).forEach(([hour, count]) => {
            if (count > peakHourVotes) {
                peakHour = parseInt(hour);
                peakHourVotes = count;
            }
        });

        const formatHour = (hour: number): string => {
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h = hour % 12 || 12;
            return `${h}:00 ${ampm}`;
        };

        // Hourly distribution formatted
        const hourlyDistributionFormatted = Object.entries(hourlyDistribution).map(([hour, votes]) => ({
            hour: parseInt(hour),
            hourFormatted: formatHour(parseInt(hour)),
            votes,
            percentage: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
        }));

        // Daily trend
        const dailyTrend: Record<string, number> = {};
        votes.forEach(v => {
            const date = new Date(v.timestamp).toISOString().split('T')[0];
            dailyTrend[date] = (dailyTrend[date] || 0) + 1;
        });

        const daysWithVotes = Object.keys(dailyTrend).length;
        const dailyAverage = daysWithVotes > 0 ? Math.round((totalVotes / daysWithVotes) * 10) / 10 : 0;

        // Day of week distribution
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekDistribution: Record<string, number> = {};
        dayNames.forEach(day => dayOfWeekDistribution[day] = 0);
        
        votes.forEach(v => {
            const dayIndex = new Date(v.timestamp).getDay();
            dayOfWeekDistribution[dayNames[dayIndex]]++;
        });

        // Most active day
        let mostActiveDay = { day: 'Monday', votes: 0 };
        Object.entries(dayOfWeekDistribution).forEach(([day, count]) => {
            if (count > mostActiveDay.votes) {
                mostActiveDay = { day, votes: count };
            }
        });

        // Velocity trend (comparing last 24h to previous 24h)
        const now = Date.now();
        const last24h = votes.filter(v => now - new Date(v.timestamp).getTime() < 24 * 60 * 60 * 1000).length;
        const prev24h = votes.filter(v => {
            const age = now - new Date(v.timestamp).getTime();
            return age >= 24 * 60 * 60 * 1000 && age < 48 * 60 * 60 * 1000;
        }).length;

        let velocityTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (last24h > prev24h * 1.2) velocityTrend = 'increasing';
        else if (last24h < prev24h * 0.8) velocityTrend = 'decreasing';

        // Device breakdown
        const deviceCounts: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
        votes.forEach(v => {
            const device = v.analytics?.device || 'unknown';
            deviceCounts[device]++;
        });

        // UTM Sources
        const utmSources: Record<string, number> = { 'Direct': 0 };
        votes.forEach(v => {
            const source = v.analytics?.utmSource || v.analytics?.referrerDomain || 'Direct';
            utmSources[source] = (utmSources[source] || 0) + 1;
        });

        // Country stats (GDPR-compliant: only aggregated counts, no PII)
        const countryCounts: Record<string, number> = {};
        votes.forEach(v => {
            const country = v.analytics?.country;
            if (country) {
                const countryName = getCountryName(country);
                countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
            }
        });

        const topCountries = Object.entries(countryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([country, votes]) => ({
                country,
                votes,
                percentage: Math.round((votes / totalVotes) * 100)
            }));

        const countriesRepresented = Object.keys(countryCounts).length;

        // ============================================
        // BUILD RESPONSE
        // ============================================
        const response: any = {
            tier,
            totalVotes,
            firstVote,
            lastVote,
            durationHours,
            durationDays,
            peakHour,
            peakHourFormatted: formatHour(peakHour),
            peakHourVotes,
            dailyTrend,
            dailyAverage,
            hourlyDistribution,
            hourlyDistributionFormatted,
            velocityTrend,
            dayOfWeekDistribution,
            mostActiveDay,
            utmSources,
            deviceBreakdown: deviceCounts,
            countryStats: {
                topCountries,
                countriesRepresented,
                privacyNote: 'Location data by ipinfo.io. Only country-level data is stored; IP addresses are never retained.'
            },
            privacyInfo: {
                whatWeTrack: [
                    'Vote timestamp',
                    'Device type (mobile/desktop/tablet)',
                    'Country (derived from IP at vote time)',
                    'Referrer domain (where voter came from)',
                    'UTM source (if present in URL)'
                ],
                whatWeDontTrack: [
                    'IP addresses (used once for country lookup, then discarded)',
                    'Personal identifiers',
                    'Browser fingerprints',
                    'Full URLs or browsing history',
                    'Cookies or tracking pixels'
                ],
                countryTracking: 'Country is derived from IP at vote time using ipinfo.io. The IP itself is never stored, ensuring voter privacy.'
            },
            includedFeatures: {
                included: [
                    'Vote timeline',
                    'Peak voting hours',
                    'Daily trends',
                    'Device breakdown',
                    'Geographic distribution',
                    'Traffic sources',
                    'Velocity tracking'
                ],
                notIncluded: []
            }
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch analytics' })
        };
    }
};
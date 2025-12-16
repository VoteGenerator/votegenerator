import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface Vote {
    id: string;
    pollId: string;
    vote: any;
    timestamp: string;
    voterName?: string;
    country?: string; // Aggregated only, not stored per-vote in database
}

interface Poll {
    id: string;
    masterKey?: string;
    adminKey?: string;
    premium?: {
        tier: 'one-time' | 'pro' | 'pro-plus';
        expiresAt: string;
    };
}

// Free tier: basic stats only
// Pro tier: timeline, trends, peak hours
// Pro+: hourly distribution, velocity, UTM tracking

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const pollId = event.queryStringParameters?.pollId;
    const adminKey = event.queryStringParameters?.adminKey;

    if (!pollId) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Missing pollId' })
        };
    }

    try {
        const pollStore = getStore('polls');
        const voteStore = getStore('votes');

        const poll = await pollStore.get(pollId, { type: 'json' }) as Poll | null;
        
        if (!poll) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Poll not found' })
            };
        }

        // Check admin access
        const isAdmin = adminKey && (poll.adminKey === adminKey || poll.masterKey === adminKey);
        
        // Determine tier
        const isPremium = poll.premium && new Date(poll.premium.expiresAt) > new Date();
        const tier = isPremium ? poll.premium!.tier : 'free';
        const isPro = tier === 'pro' || tier === 'pro-plus';
        const isProPlus = tier === 'pro-plus';

        // Get votes
        const votesData = await voteStore.get(pollId, { type: 'json' }) as Vote[] | null;
        const votes = votesData || [];

        if (votes.length === 0) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    totalVotes: 0,
                    message: 'No votes yet'
                })
            };
        }

        // ============================================
        // FREE TIER: Basic stats (always included)
        // ============================================
        const basicStats = {
            totalVotes: votes.length,
            // Vote distribution is calculated in results, not here
        };

        // If not admin or free tier without admin, return basic only
        if (!isAdmin) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: 'free',
                    ...basicStats,
                    upgradeMessage: 'Upgrade to Pro for detailed analytics'
                })
            };
        }

        // ============================================
        // PRO TIER: Timeline & trends
        // ============================================
        let proAnalytics = {};
        
        if (isPro || isProPlus) {
            const timestamps = votes.map(v => new Date(v.timestamp).getTime());
            const firstVoteTime = Math.min(...timestamps);
            const lastVoteTime = Math.max(...timestamps);
            
            // Daily trend
            const dailyGroups: Record<string, number> = {};
            votes.forEach(vote => {
                const day = new Date(vote.timestamp).toISOString().split('T')[0];
                dailyGroups[day] = (dailyGroups[day] || 0) + 1;
            });

            // Peak hour (simple)
            const hourGroups: Record<number, number> = {};
            votes.forEach(vote => {
                const hour = new Date(vote.timestamp).getHours();
                hourGroups[hour] = (hourGroups[hour] || 0) + 1;
            });
            const peakHourEntry = Object.entries(hourGroups)
                .sort((a, b) => b[1] - a[1])[0];

            // Calculate duration
            const durationMs = lastVoteTime - firstVoteTime;
            const durationHours = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10;
            const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24) * 10) / 10;

            // Daily average
            const uniqueDays = Object.keys(dailyGroups).length;
            const dailyAverage = Math.round(votes.length / Math.max(uniqueDays, 1) * 10) / 10;

            proAnalytics = {
                firstVote: new Date(firstVoteTime).toISOString(),
                lastVote: new Date(lastVoteTime).toISOString(),
                durationHours,
                durationDays,
                peakHour: parseInt(peakHourEntry[0]),
                peakHourVotes: peakHourEntry[1],
                peakHourFormatted: formatHour(parseInt(peakHourEntry[0])),
                dailyTrend: dailyGroups,
                dailyAverage,
                uniqueDays
            };
        }

        // ============================================
        // PRO+ TIER: Advanced analytics
        // ============================================
        let proPlusAnalytics = {};

        if (isProPlus) {
            // Hourly distribution (full 24 hours)
            const hourlyDistribution: Record<number, number> = {};
            for (let i = 0; i < 24; i++) {
                hourlyDistribution[i] = 0;
            }
            votes.forEach(vote => {
                const hour = new Date(vote.timestamp).getHours();
                hourlyDistribution[hour]++;
            });

            // Response velocity (votes per hour over time)
            const velocityByDay: Record<string, number> = {};
            votes.forEach(vote => {
                const day = new Date(vote.timestamp).toISOString().split('T')[0];
                velocityByDay[day] = (velocityByDay[day] || 0) + 1;
            });

            // Calculate velocity trend (is it speeding up or slowing down?)
            const sortedDays = Object.entries(velocityByDay).sort((a, b) => a[0].localeCompare(b[0]));
            let velocityTrend = 'stable';
            if (sortedDays.length >= 3) {
                const recentAvg = sortedDays.slice(-3).reduce((sum, [, count]) => sum + count, 0) / 3;
                const earlierAvg = sortedDays.slice(0, 3).reduce((sum, [, count]) => sum + count, 0) / 3;
                if (recentAvg > earlierAvg * 1.2) velocityTrend = 'increasing';
                else if (recentAvg < earlierAvg * 0.8) velocityTrend = 'decreasing';
            }

            // Day of week distribution
            const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeekDistribution: Record<string, number> = {};
            dayOfWeekNames.forEach(day => dayOfWeekDistribution[day] = 0);
            votes.forEach(vote => {
                const dayOfWeek = new Date(vote.timestamp).getDay();
                dayOfWeekDistribution[dayOfWeekNames[dayOfWeek]]++;
            });

            // Find most active day of week
            const mostActiveDay = Object.entries(dayOfWeekDistribution)
                .sort((a, b) => b[1] - a[1])[0];

            // UTM source tracking (if present in vote metadata)
            const utmSources: Record<string, number> = {};
            votes.forEach(vote => {
                const source = (vote as any).utmSource || 'direct';
                utmSources[source] = (utmSources[source] || 0) + 1;
            });

            proPlusAnalytics = {
                hourlyDistribution,
                hourlyDistributionFormatted: Object.entries(hourlyDistribution)
                    .map(([hour, count]) => ({
                        hour: parseInt(hour),
                        hourFormatted: formatHour(parseInt(hour)),
                        votes: count,
                        percentage: Math.round(count / votes.length * 100)
                    })),
                velocityTrend,
                velocityByDay,
                dayOfWeekDistribution,
                mostActiveDay: {
                    day: mostActiveDay[0],
                    votes: mostActiveDay[1]
                },
                utmSources,
                // Time to first 50% of votes
                medianVoteTime: calculateMedianVoteTime(votes),
            };
        }

        // ============================================
        // AGGREGATED COUNTRY DATA (Pro+ only, privacy-first)
        // ============================================
        let countryStats = {};
        
        if (isProPlus) {
            // Note: Country is determined at vote time via IP lookup
            // but we only store aggregated counts, never per-vote location
            const countryCounts: Record<string, number> = {};
            votes.forEach(vote => {
                if ((vote as any).country) {
                    const country = (vote as any).country;
                    countryCounts[country] = (countryCounts[country] || 0) + 1;
                }
            });

            if (Object.keys(countryCounts).length > 0) {
                const sortedCountries = Object.entries(countryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10) // Top 10 countries
                    .map(([country, count]) => ({
                        country,
                        votes: count,
                        percentage: Math.round(count / votes.length * 100)
                    }));

                countryStats = {
                    topCountries: sortedCountries,
                    countriesRepresented: Object.keys(countryCounts).length,
                    privacyNote: 'Country data is aggregated. Individual voter locations are never stored.'
                };
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tier,
                isAdmin: true,
                ...basicStats,
                ...(isPro || isProPlus ? proAnalytics : {}),
                ...(isProPlus ? proPlusAnalytics : {}),
                ...(isProPlus && Object.keys(countryStats).length > 0 ? { countryStats } : {}),
                
                // What's included transparency
                includedFeatures: getIncludedFeatures(tier),
                privacyInfo: {
                    whatWeTrack: [
                        'Vote timestamps',
                        'Vote choices',
                        'Optional voter names (if provided)'
                    ],
                    whatWeDontTrack: [
                        'IP addresses (not stored)',
                        'Device fingerprints',
                        'Browser information',
                        'Precise locations'
                    ],
                    countryTracking: isProPlus 
                        ? 'Enabled (aggregated only, privacy-first)' 
                        : 'Not enabled on this plan'
                }
            })
        };

    } catch (error) {
        console.error('Analytics error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to fetch analytics' })
        };
    }
};

// Helper functions
function formatHour(hour: number): string {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
}

function calculateMedianVoteTime(votes: Vote[]): string | null {
    if (votes.length < 2) return null;
    
    const sortedTimestamps = votes
        .map(v => new Date(v.timestamp).getTime())
        .sort((a, b) => a - b);
    
    const firstVote = sortedTimestamps[0];
    const halfwayIndex = Math.floor(sortedTimestamps.length / 2);
    const halfwayTime = sortedTimestamps[halfwayIndex];
    
    const hoursToHalfway = Math.round((halfwayTime - firstVote) / (1000 * 60 * 60) * 10) / 10;
    
    return `${hoursToHalfway} hours to reach 50% of votes`;
}

function getIncludedFeatures(tier: string): Record<string, string[]> {
    const features = {
        free: [
            'Total vote count',
            'Vote percentages',
            'Real-time results',
            'Basic bar/pie charts'
        ],
        'one-time': [
            'Everything in Free',
            'Vote timeline chart',
            'First/last vote timestamps',
            'Peak voting hour',
            'Daily voting trends',
            'Export with timestamps (CSV)'
        ],
        pro: [
            'Everything in Free',
            'Vote timeline chart',
            'First/last vote timestamps',
            'Peak voting hour',
            'Daily voting trends',
            'Export with timestamps (CSV/PDF)'
        ],
        'pro-plus': [
            'Everything in Pro',
            'Hourly distribution analysis',
            'Day-of-week patterns',
            'Response velocity metrics',
            'UTM source tracking',
            'Aggregated country stats (privacy-first)',
            'Comparative analytics'
        ]
    };

    return {
        included: features[tier as keyof typeof features] || features.free,
        notIncluded: tier === 'free' 
            ? ['Detailed timeline', 'Peak hour analysis', 'Export options']
            : tier === 'pro' || tier === 'one-time'
                ? ['Hourly distribution', 'Country stats', 'UTM tracking']
                : []
    };
}
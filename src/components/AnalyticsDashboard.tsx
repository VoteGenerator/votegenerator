import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Globe,
    Lock,
    Info,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Crown,
    Sparkles
} from 'lucide-react';

interface AnalyticsData {
    tier: string;
    totalVotes: number;
    firstVote?: string;
    lastVote?: string;
    durationHours?: number;
    durationDays?: number;
    peakHour?: number;
    peakHourFormatted?: string;
    peakHourVotes?: number;
    dailyTrend?: Record<string, number>;
    dailyAverage?: number;
    hourlyDistribution?: Record<number, number>;
    hourlyDistributionFormatted?: Array<{ hour: number; hourFormatted: string; votes: number; percentage: number }>;
    velocityTrend?: 'increasing' | 'decreasing' | 'stable';
    dayOfWeekDistribution?: Record<string, number>;
    mostActiveDay?: { day: string; votes: number };
    utmSources?: Record<string, number>;
    countryStats?: {
        topCountries: Array<{ country: string; votes: number; percentage: number }>;
        countriesRepresented: number;
        privacyNote: string;
    };
    includedFeatures?: {
        included: string[];
        notIncluded: string[];
    };
    privacyInfo?: {
        whatWeTrack: string[];
        whatWeDontTrack: string[];
        countryTracking: string;
    };
}

interface AnalyticsDashboardProps {
    pollId: string;
    adminKey: string;
    currentTier?: 'free' | 'one-time' | 'pro' | 'pro-plus';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
    pollId, 
    adminKey,
    currentTier = 'free'
}) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

    const isPro = currentTier === 'pro' || currentTier === 'pro-plus' || currentTier === 'one-time';
    const isProPlus = currentTier === 'pro-plus';

    useEffect(() => {
        fetchAnalytics();
    }, [pollId, adminKey]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/.netlify/functions/vg-analytics?pollId=${pollId}&adminKey=${adminKey}`
            );
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analytics');
            }
            
            setAnalytics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-20 bg-slate-100 rounded"></div>
                        <div className="h-20 bg-slate-100 rounded"></div>
                        <div className="h-20 bg-slate-100 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
            </div>
        );
    }

    if (!analytics) return null;

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" />
                    Analytics
                    {isPro && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {isProPlus ? 'PRO+' : 'PRO'}
                        </span>
                    )}
                </h3>
                <button
                    onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <Info size={14} />
                    Privacy Info
                    {showPrivacyInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* Privacy Info Panel */}
            {showPrivacyInfo && analytics.privacyInfo && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                >
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Eye size={16} className="text-green-600" />
                        Privacy-First Analytics
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-slate-600 mb-2">✓ What we track:</p>
                            <ul className="space-y-1 text-slate-500">
                                {analytics.privacyInfo.whatWeTrack.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium text-slate-600 mb-2">✗ What we don't track:</p>
                            <ul className="space-y-1 text-slate-500">
                                {analytics.privacyInfo.whatWeDontTrack.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <EyeOff size={12} className="text-slate-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        {analytics.privacyInfo.countryTracking}
                    </p>
                </motion.div>
            )}

            {/* ============================================ */}
            {/* FREE TIER: Basic Stats */}
            {/* ============================================ */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Basic Stats
                    </span>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                        FREE
                    </span>
                </div>
                
                <div className="text-center">
                    <div className="text-5xl font-black text-slate-800 mb-1">
                        {analytics.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-slate-500">Total Votes</div>
                </div>
            </div>

            {/* ============================================ */}
            {/* PRO TIER: Timeline & Trends */}
            {/* ============================================ */}
            {isPro && analytics.firstVote ? (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={16} className="text-indigo-500" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Vote Timeline
                        </span>
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                            PRO
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-slate-500 mb-1">First Vote</div>
                            <div className="font-semibold text-slate-800">{formatDate(analytics.firstVote)}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-slate-500 mb-1">Last Vote</div>
                            <div className="font-semibold text-slate-800">{formatDate(analytics.lastVote!)}</div>
                            <div className="text-xs text-slate-400">{formatTimeAgo(analytics.lastVote!)}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-slate-500 mb-1">Peak Hour</div>
                            <div className="font-semibold text-slate-800">{analytics.peakHourFormatted}</div>
                            <div className="text-xs text-slate-400">{analytics.peakHourVotes} votes</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-slate-500 mb-1">Daily Average</div>
                            <div className="font-semibold text-slate-800">{analytics.dailyAverage}</div>
                            <div className="text-xs text-slate-400">votes/day</div>
                        </div>
                    </div>

                    {/* Daily Trend Chart */}
                    {analytics.dailyTrend && Object.keys(analytics.dailyTrend).length > 1 && (
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-2">Daily Voting Trend</div>
                            <div className="flex items-end gap-1 h-24">
                                {Object.entries(analytics.dailyTrend)
                                    .sort((a, b) => a[0].localeCompare(b[0]))
                                    .slice(-14) // Last 14 days
                                    .map(([day, count], i) => {
                                        const maxCount = Math.max(...Object.values(analytics.dailyTrend!));
                                        const height = (count / maxCount) * 100;
                                        return (
                                            <div key={day} className="flex-1 flex flex-col items-center">
                                                <div 
                                                    className="w-full bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
                                                    style={{ height: `${Math.max(height, 4)}%` }}
                                                    title={`${day}: ${count} votes`}
                                                />
                                                {i % 2 === 0 && (
                                                    <div className="text-[10px] text-slate-400 mt-1">
                                                        {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            ) : !isPro && (
                <LockedFeature 
                    title="Vote Timeline"
                    features={['First/last vote timestamps', 'Peak voting hour', 'Daily trends chart']}
                    requiredTier="Pro"
                />
            )}

            {/* ============================================ */}
            {/* PRO+ TIER: Advanced Analytics */}
            {/* ============================================ */}
            {isProPlus && analytics.hourlyDistributionFormatted ? (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-purple-500" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Advanced Analytics
                        </span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            PRO+
                        </span>
                    </div>

                    {/* Velocity Indicator */}
                    {analytics.velocityTrend && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                            <div className={`p-2 rounded-full ${
                                analytics.velocityTrend === 'increasing' ? 'bg-green-100' :
                                analytics.velocityTrend === 'decreasing' ? 'bg-red-100' : 'bg-slate-100'
                            }`}>
                                {analytics.velocityTrend === 'increasing' ? (
                                    <TrendingUp size={18} className="text-green-600" />
                                ) : analytics.velocityTrend === 'decreasing' ? (
                                    <TrendingDown size={18} className="text-red-600" />
                                ) : (
                                    <Minus size={18} className="text-slate-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-slate-800">
                                    Voting is {analytics.velocityTrend}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Compared to when poll started
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hourly Distribution */}
                    <div className="mb-6">
                        <div className="text-xs font-medium text-slate-500 mb-2">Hourly Distribution</div>
                        <div className="grid grid-cols-12 gap-1">
                            {analytics.hourlyDistributionFormatted
                                .filter((_, i) => i % 2 === 0) // Show every 2 hours
                                .map(({ hour, hourFormatted, votes, percentage }) => (
                                    <div key={hour} className="text-center">
                                        <div 
                                            className="bg-purple-500 rounded-t mx-auto transition-all"
                                            style={{ 
                                                height: `${Math.max(percentage, 2)}px`,
                                                maxHeight: '60px',
                                                width: '100%'
                                            }}
                                            title={`${hourFormatted}: ${votes} votes (${percentage}%)`}
                                        />
                                        <div className="text-[9px] text-slate-400 mt-1">
                                            {hour}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>12 AM</span>
                            <span>12 PM</span>
                            <span>11 PM</span>
                        </div>
                    </div>

                    {/* Day of Week */}
                    {analytics.dayOfWeekDistribution && (
                        <div className="mb-6">
                            <div className="text-xs font-medium text-slate-500 mb-2">Day of Week</div>
                            <div className="grid grid-cols-7 gap-2">
                                {Object.entries(analytics.dayOfWeekDistribution).map(([day, count]) => {
                                    const maxCount = Math.max(...Object.values(analytics.dayOfWeekDistribution!));
                                    const isMax = count === maxCount && count > 0;
                                    return (
                                        <div key={day} className="text-center">
                                            <div className={`text-xs font-medium mb-1 ${isMax ? 'text-purple-600' : 'text-slate-400'}`}>
                                                {day.slice(0, 3)}
                                            </div>
                                            <div className={`py-2 rounded ${isMax ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-slate-50 text-slate-600'}`}>
                                                {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {analytics.mostActiveDay && (
                                <div className="text-xs text-slate-500 mt-2">
                                    Most active: <span className="font-medium">{analytics.mostActiveDay.day}s</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* UTM Sources */}
                    {analytics.utmSources && Object.keys(analytics.utmSources).length > 1 && (
                        <div>
                            <div className="text-xs font-medium text-slate-500 mb-2">Traffic Sources</div>
                            <div className="space-y-2">
                                {Object.entries(analytics.utmSources)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([source, count]) => (
                                        <div key={source} className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className="bg-purple-500 h-full rounded-full"
                                                    style={{ width: `${(count / analytics.totalVotes) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-600 w-20 truncate">{source}</span>
                                            <span className="text-xs text-slate-400">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : !isProPlus && isPro && (
                <LockedFeature 
                    title="Advanced Analytics"
                    features={['Hourly distribution', 'Day of week patterns', 'Response velocity', 'UTM tracking']}
                    requiredTier="Pro+"
                />
            )}

            {/* ============================================ */}
            {/* PRO+ TIER: Country Stats (Privacy-First) */}
            {/* ============================================ */}
            {isProPlus && analytics.countryStats && analytics.countryStats.topCountries.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe size={16} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Geographic Distribution
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                            PRO+
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        {analytics.countryStats.topCountries.map(({ country, votes, percentage }) => (
                            <div key={country} className="flex items-center gap-3">
                                <span className="text-lg">{getCountryFlag(country)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700">{country}</span>
                                        <span className="text-xs text-slate-500">{votes} votes ({percentage}%)</span>
                                    </div>
                                    <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-emerald-500 h-full rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 pt-3 border-t border-slate-100">
                        <EyeOff size={12} />
                        {analytics.countryStats.privacyNote}
                    </div>
                </div>
            )}

            {/* What's Included */}
            {analytics.includedFeatures && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Your Plan Includes
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analytics.includedFeatures.included.map((feature, i) => (
                            <span 
                                key={i}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
                            >
                                ✓ {feature}
                            </span>
                        ))}
                    </div>
                    {analytics.includedFeatures.notIncluded.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <a href="#pricing" className="text-xs text-indigo-600 hover:text-indigo-700">
                                Upgrade to unlock: {analytics.includedFeatures.notIncluded.join(', ')} →
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Locked Feature Component
const LockedFeature: React.FC<{
    title: string;
    features: string[];
    requiredTier: string;
}> = ({ title, features, requiredTier }) => (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent backdrop-blur-[1px]" />
        <div className="relative">
            <div className="flex items-center gap-2 mb-3">
                <Lock size={16} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">{title}</span>
                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-xs font-medium rounded">
                    {requiredTier}
                </span>
            </div>
            <ul className="space-y-1 text-sm text-slate-500 mb-4">
                {features.map((f, i) => (
                    <li key={i}>• {f}</li>
                ))}
            </ul>
            <a 
                href="#pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <Crown size={14} />
                Upgrade to {requiredTier}
            </a>
        </div>
    </div>
);

// Helper: Get country flag emoji
function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Japan': '🇯🇵',
        'India': '🇮🇳',
        'Brazil': '🇧🇷',
        'Mexico': '🇲🇽',
        'Spain': '🇪🇸',
        'Italy': '🇮🇹',
        'Netherlands': '🇳🇱',
        'Sweden': '🇸🇪',
        'Norway': '🇳🇴',
        'Denmark': '🇩🇰',
        'Finland': '🇫🇮',
        'Poland': '🇵🇱',
        'Ireland': '🇮🇪',
        'New Zealand': '🇳🇿',
        'South Korea': '🇰🇷',
        'Singapore': '🇸🇬',
        'Switzerland': '🇨🇭',
        'Austria': '🇦🇹',
        'Belgium': '🇧🇪',
        'Portugal': '🇵🇹',
        'Argentina': '🇦🇷',
        'Chile': '🇨🇱',
        'Colombia': '🇨🇴',
        'Philippines': '🇵🇭',
        'Indonesia': '🇮🇩',
        'Malaysia': '🇲🇾',
        'Thailand': '🇹🇭',
        'Vietnam': '🇻🇳',
        'South Africa': '🇿🇦',
        'Israel': '🇮🇱',
        'United Arab Emirates': '🇦🇪',
        'Saudi Arabia': '🇸🇦',
        'Turkey': '🇹🇷',
        'Russia': '🇷🇺',
        'Ukraine': '🇺🇦',
        'Czech Republic': '🇨🇿',
        'Romania': '🇷🇴',
        'Greece': '🇬🇷',
        'Hungary': '🇭🇺',
        'Unknown': '🌍'
    };
    return flags[country] || '🌍';
}

export default AnalyticsDashboard;
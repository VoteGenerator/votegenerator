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
    Sparkles,
    Smartphone,
    Monitor,
    Tablet,
    Download,
    Calendar,
    Users,
    Zap,
    ExternalLink
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
    deviceBreakdown?: Record<string, number>;
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
    currentTier?: 'free' | 'starter' | 'pro_event' | 'unlimited';
}

// Tier display config
const TIER_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
    'free': { label: 'Free', color: 'text-slate-600', bgColor: 'bg-slate-100' },
    'starter': { label: 'Starter', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    'pro_event': { label: 'Pro Event', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    'unlimited_event': { label: 'Unlimited Event', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    'unlimited': { label: 'Unlimited', color: 'text-amber-700', bgColor: 'bg-amber-100' }
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
    pollId, 
    adminKey,
    currentTier = 'free'
}) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

    // All paid tiers get analytics
    const isPaid = currentTier !== 'free';
    const isUnlimited = currentTier === 'unlimited';
    const tierConfig = TIER_CONFIG[currentTier] || TIER_CONFIG['free'];

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

    const exportAnalyticsCSV = () => {
        if (!analytics) return;
        
        // Build CSV content
        const rows: string[] = [];
        
        // Summary section
        rows.push('POLL ANALYTICS EXPORT');
        rows.push(`Poll ID,${pollId}`);
        rows.push(`Exported At,${new Date().toISOString()}`);
        rows.push('');
        
        // Summary stats
        rows.push('SUMMARY');
        rows.push('Metric,Value');
        rows.push(`Total Votes,${analytics.totalVotes}`);
        rows.push(`First Vote,${analytics.firstVote || 'N/A'}`);
        rows.push(`Last Vote,${analytics.lastVote || 'N/A'}`);
        rows.push(`Peak Hour,${analytics.peakHourFormatted || 'N/A'}`);
        rows.push(`Velocity Trend,${analytics.velocityTrend || 'N/A'}`);
        rows.push('');
        
        // Device breakdown
        if (analytics.deviceBreakdown) {
            rows.push('DEVICE BREAKDOWN');
            rows.push('Device,Count,Percentage');
            const total = Object.values(analytics.deviceBreakdown).reduce((a: number, b: number) => a + b, 0) || 1;
            Object.entries(analytics.deviceBreakdown).forEach(([device, count]) => {
                const pct = ((count as number) / total * 100).toFixed(1);
                rows.push(`${device},${count},${pct}%`);
            });
            rows.push('');
        }
        
        // Country stats
        if (analytics.countryStats?.topCountries) {
            rows.push('GEOGRAPHIC DISTRIBUTION');
            rows.push('Country,Votes,Percentage');
            analytics.countryStats.topCountries.forEach((c) => {
                rows.push(`${c.country},${c.votes},${c.percentage}%`);
            });
            rows.push('');
        }
        
        // Hourly distribution
        if (analytics.hourlyDistributionFormatted) {
            rows.push('HOURLY DISTRIBUTION (UTC)');
            rows.push('Hour,Votes');
            analytics.hourlyDistributionFormatted.forEach((h) => {
                rows.push(`${h.hour},${h.votes}`);
            });
            rows.push('');
        }
        
        // Daily trend
        if (analytics.dailyTrend) {
            rows.push('DAILY TREND');
            rows.push('Date,Votes');
            Object.entries(analytics.dailyTrend).forEach(([date, count]) => {
                rows.push(`${date},${count}`);
            });
            rows.push('');
        }
        
        // Traffic sources
        if (analytics.utmSources && Object.keys(analytics.utmSources).length > 0) {
            rows.push('TRAFFIC SOURCES');
            rows.push('Source,Visits');
            Object.entries(analytics.utmSources).forEach(([source, count]) => {
                rows.push(`${source},${count}`);
            });
        }
        
        const csvContent = rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poll-analytics-${pollId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Note: PNG/PDF export requires html2canvas and jspdf packages
    // Install with: npm install html2canvas jspdf
    // Then uncomment the export functions below

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

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    // Convert UTC peak hour to local time
    const getLocalPeakHour = (utcHour: number) => {
        const now = new Date();
        now.setUTCHours(utcHour, 0, 0, 0);
        return now.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    };

    // Get velocity change percentage
    const getVelocityInfo = () => {
        const trend = analytics.velocityTrend;
        if (trend === 'increasing') return { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'Increasing', desc: 'More votes in last 24h vs previous' };
        if (trend === 'decreasing') return { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50', text: 'Decreasing', desc: 'Fewer votes in last 24h vs previous' };
        return { icon: Minus, color: 'text-slate-500', bg: 'bg-slate-50', text: 'Stable', desc: 'Similar activity as previous 24h' };
    };

    const velocityInfo = getVelocityInfo();
    const VelocityIcon = velocityInfo.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" />
                    Analytics
                    <span className={`px-2 py-0.5 ${tierConfig.bgColor} ${tierConfig.color} text-xs font-bold rounded-full`}>
                        {tierConfig.label}
                    </span>
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportAnalyticsCSV}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Download size={14} />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <Info size={14} />
                        Privacy
                        {showPrivacyInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
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
                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ============================================ */}
            {/* KEY METRICS - Always visible */}
            {/* ============================================ */}
            <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="analytics-metrics">
                {/* Total Votes */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                        <Users size={14} />
                        Total Votes
                    </div>
                    <div className="text-2xl font-black text-slate-800">{analytics.totalVotes}</div>
                </div>

                {/* First Vote */}
                {analytics.firstVote && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                            <Calendar size={14} />
                            First Vote
                        </div>
                        <div className="text-lg font-bold text-slate-800">{formatTimeAgo(analytics.firstVote)}</div>
                        <div className="text-xs text-slate-400">{formatDate(analytics.firstVote)}</div>
                    </div>
                )}

                {/* Last Vote */}
                {analytics.lastVote && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                            <Clock size={14} />
                            Last Vote
                        </div>
                        <div className="text-lg font-bold text-slate-800">{formatTimeAgo(analytics.lastVote)}</div>
                        <div className="text-xs text-slate-400">{formatDate(analytics.lastVote)}</div>
                    </div>
                )}

                {/* Velocity Trend */}
                <div className={`rounded-xl border p-4 ${velocityInfo.bg} border-slate-200`}>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                        <Zap size={14} />
                        Velocity
                    </div>
                    <div className={`text-lg font-bold flex items-center gap-2 ${velocityInfo.color}`}>
                        <VelocityIcon size={18} />
                        {velocityInfo.text}
                    </div>
                    <div className="text-xs text-slate-500">{velocityInfo.desc}</div>
                </div>
            </div>

            {/* ============================================ */}
            {/* DEVICE BREAKDOWN */}
            {/* ============================================ */}
            {analytics.deviceBreakdown && Object.values(analytics.deviceBreakdown).some(v => v > 0) && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Monitor size={16} className="text-blue-500" />
                        <span className="text-sm font-semibold text-slate-700">Device Breakdown</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'text-green-600', bg: 'bg-green-50' },
                            { key: 'tablet', label: 'Tablet', icon: Tablet, color: 'text-purple-600', bg: 'bg-purple-50' }
                        ].map(({ key, label, icon: Icon, color, bg }) => {
                            const count = analytics.deviceBreakdown?.[key] || 0;
                            const total = Object.values(analytics.deviceBreakdown || {}).reduce((a: number, b: number) => a + b, 0) || 1;
                            const percentage = Math.round((count / total) * 100);
                            
                            if (count === 0) return null;
                            
                            return (
                                <div key={key} className={`text-center p-4 ${bg} rounded-xl`}>
                                    <Icon size={24} className={`${color} mx-auto mb-2`} />
                                    <div className="text-2xl font-black text-slate-800">{percentage}%</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{count} votes</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ============================================ */}
            {/* HOURLY DISTRIBUTION - Bar Chart */}
            {/* ============================================ */}
            {analytics.hourlyDistributionFormatted && analytics.hourlyDistributionFormatted.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700">Hourly Distribution</span>
                        </div>
                        {analytics.peakHour !== undefined && (
                            <div className="text-xs text-slate-500">
                                Peak: <span className="font-semibold text-indigo-600">{getLocalPeakHour(analytics.peakHour)}</span>
                                {analytics.peakHourVotes && ` (${analytics.peakHourVotes} votes)`}
                            </div>
                        )}
                    </div>
                    
                    {/* Show message if votes are too concentrated */}
                    {analytics.totalVotes < 10 && analytics.hourlyDistributionFormatted.filter(h => h.votes > 0).length < 3 ? (
                        <div className="text-center py-6">
                            <Clock size={32} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Need more votes to show hourly patterns</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Currently {analytics.totalVotes} vote{analytics.totalVotes !== 1 ? 's' : ''} in {analytics.hourlyDistributionFormatted.filter(h => h.votes > 0).length} hour{analytics.hourlyDistributionFormatted.filter(h => h.votes > 0).length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Bar Chart */}
                            <div className="h-32 flex items-end gap-1">
                                {analytics.hourlyDistributionFormatted.map((item, i) => {
                                    const maxVotes = Math.max(...analytics.hourlyDistributionFormatted!.map(h => h.votes), 1);
                                    const height = (item.votes / maxVotes) * 100;
                                    const isCurrentHour = new Date().getHours() === item.hour;
                                    
                                    return (
                                        <div 
                                            key={i} 
                                            className="flex-1 flex flex-col items-center group relative"
                                        >
                                            <div 
                                                className={`w-full rounded-t transition-all ${
                                                    isCurrentHour ? 'bg-indigo-500' : item.votes > 0 ? 'bg-indigo-300 hover:bg-indigo-400' : 'bg-slate-100'
                                                }`}
                                                style={{ height: `${Math.max(height, item.votes > 0 ? 8 : 2)}%` }}
                                            />
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                {item.hourFormatted}: {item.votes} vote{item.votes !== 1 ? 's' : ''}
                                            </div>
                                            {/* Hour label (every 6 hours) */}
                                            {i % 6 === 0 && (
                                                <div className="text-xs text-slate-400 mt-1">{item.hour}h</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-xs text-slate-400 mt-2 text-center">
                                Times shown in your local timezone
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ============================================ */}
            {/* DAILY TREND */}
            {/* ============================================ */}
            {analytics.dailyTrend && Object.keys(analytics.dailyTrend).length > 1 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-700">Daily Trend</span>
                        </div>
                        {analytics.dailyAverage && (
                            <div className="text-xs text-slate-500">
                                Average: <span className="font-semibold text-emerald-600">{analytics.dailyAverage} votes/day</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        {Object.entries(analytics.dailyTrend)
                            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                            .slice(0, 7)
                            .map(([date, count]) => {
                                const maxCount = Math.max(...Object.values(analytics.dailyTrend!), 1);
                                const percentage = (count / maxCount) * 100;
                                const dateObj = new Date(date);
                                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                
                                return (
                                    <div key={date} className="flex items-center gap-3">
                                        <div className="w-20 text-xs text-slate-500">
                                            <span className="font-medium">{dayName}</span> {dateStr}
                                        </div>
                                        <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                            <div 
                                                className="bg-emerald-500 h-full rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="w-12 text-xs text-slate-600 text-right font-medium">{count}</div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* ============================================ */}
            {/* TRAFFIC SOURCES */}
            {/* ============================================ */}
            {analytics.utmSources && Object.keys(analytics.utmSources).length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <ExternalLink size={16} className="text-purple-500" />
                        <span className="text-sm font-semibold text-slate-700">Traffic Sources</span>
                    </div>
                    
                    <div className="space-y-4">
                        {Object.entries(analytics.utmSources)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([source, count]) => {
                                const percentage = Math.round((count / analytics.totalVotes) * 100);
                                return (
                                    <div key={source} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]" title={source}>
                                                {source}
                                            </span>
                                            <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-purple-500 h-full rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* ============================================ */}
            {/* GEOGRAPHIC DISTRIBUTION */}
            {/* ============================================ */}
            {analytics.countryStats && analytics.countryStats.topCountries.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Globe size={16} className="text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-700">Geographic Distribution</span>
                        </div>
                        <span className="text-xs text-slate-500">
                            {analytics.countryStats.countriesRepresented} {analytics.countryStats.countriesRepresented === 1 ? 'country' : 'countries'}
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        {analytics.countryStats.topCountries.map(({ country, votes, percentage }) => (
                            <div key={country} className="flex items-center gap-3">
                                <span className="text-lg w-8">{getCountryFlag(country)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700">{country}</span>
                                        <span className="text-xs text-slate-500">{votes} ({percentage}%)</span>
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
        </div>
    );
};

// Helper: Get country flag emoji
function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
        'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
        'Germany': '🇩🇪', 'France': '🇫🇷', 'Japan': '🇯🇵', 'India': '🇮🇳', 'Brazil': '🇧🇷',
        'Mexico': '🇲🇽', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪',
        'Norway': '🇳🇴', 'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Poland': '🇵🇱', 'Ireland': '🇮🇪',
        'New Zealand': '🇳🇿', 'South Korea': '🇰🇷', 'Singapore': '🇸🇬', 'Switzerland': '🇨🇭',
        'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷', 'Chile': '🇨🇱',
        'Colombia': '🇨🇴', 'Philippines': '🇵🇭', 'Indonesia': '🇮🇩', 'Malaysia': '🇲🇾',
        'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'South Africa': '🇿🇦', 'Israel': '🇮🇱',
        'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Turkey': '🇹🇷', 'Russia': '🇷🇺',
        'Ukraine': '🇺🇦', 'Czech Republic': '🇨🇿', 'Romania': '🇷🇴', 'Greece': '🇬🇷', 'Hungary': '🇭🇺',
        'Unknown': '🌍'
    };
    return flags[country] || '🌍';
}

export default AnalyticsDashboard;
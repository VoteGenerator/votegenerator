// ============================================================================
// ResponseTimelineChart.tsx - Sparkline chart showing votes over time
// Location: src/components/ResponseTimelineChart.tsx
// ============================================================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface Vote {
    timestamp: string;
    [key: string]: any;
}

interface ResponseTimelineChartProps {
    votes: Vote[];
    days?: number; // Number of days to show (default 7)
    height?: number; // Chart height in pixels
    showTrend?: boolean; // Show trend indicator
}

const ResponseTimelineChart: React.FC<ResponseTimelineChartProps> = ({
    votes,
    days = 7,
    height = 60,
    showTrend = true
}) => {
    const chartData = useMemo(() => {
        if (!votes || votes.length === 0) return null;
        
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        
        // Create buckets for each day
        const buckets: { date: string; count: number; label: string }[] = [];
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            buckets.push({
                date: date.toISOString().split('T')[0],
                count: 0,
                label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            });
        }
        
        // Count votes per day
        votes.forEach(vote => {
            if (!vote.timestamp) return;
            const voteDate = new Date(vote.timestamp);
            if (voteDate < startDate) return;
            
            const dateStr = voteDate.toISOString().split('T')[0];
            const bucket = buckets.find(b => b.date === dateStr);
            if (bucket) bucket.count++;
        });
        
        const counts = buckets.map(b => b.count);
        const maxCount = Math.max(...counts, 1);
        const totalInPeriod = counts.reduce((a, b) => a + b, 0);
        
        // Calculate trend (compare last 3 days vs previous 3 days)
        const recentDays = counts.slice(-3);
        const previousDays = counts.slice(-6, -3);
        const recentAvg = recentDays.reduce((a, b) => a + b, 0) / recentDays.length;
        const previousAvg = previousDays.length > 0 
            ? previousDays.reduce((a, b) => a + b, 0) / previousDays.length 
            : recentAvg;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (recentAvg > previousAvg * 1.2) trend = 'up';
        else if (recentAvg < previousAvg * 0.8) trend = 'down';
        
        return {
            buckets,
            counts,
            maxCount,
            totalInPeriod,
            trend,
            avgPerDay: totalInPeriod / (days + 1)
        };
    }, [votes, days]);
    
    if (!chartData || chartData.totalInPeriod === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Activity size={16} />
                    <span>No activity in the last {days} days</span>
                </div>
            </div>
        );
    }
    
    const { buckets, counts, maxCount, totalInPeriod, trend, avgPerDay } = chartData;
    
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500';
    const trendBg = trend === 'up' ? 'bg-emerald-50' : trend === 'down' ? 'bg-red-50' : 'bg-slate-50';
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Vote Activity</span>
                    <span className="text-xs text-slate-400">Last {days} days</span>
                </div>
                {showTrend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendBg} ${trendColor}`}>
                        <TrendIcon size={12} />
                        {trend === 'up' ? 'Trending up' : trend === 'down' ? 'Slowing down' : 'Stable'}
                    </div>
                )}
            </div>
            
            {/* Chart */}
            <div className="relative" style={{ height: `${height}px` }}>
                <div className="flex items-end justify-between h-full gap-1">
                    {counts.map((count, i) => {
                        const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
                        const isToday = i === counts.length - 1;
                        
                        return (
                            <motion.div
                                key={buckets[i].date}
                                className="flex-1 flex flex-col items-center group relative"
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ delay: i * 0.05 }}
                            >
                                {/* Bar */}
                                <div className="flex-1 w-full flex items-end">
                                    <motion.div
                                        className={`w-full rounded-t transition-colors ${
                                            isToday 
                                                ? 'bg-indigo-500' 
                                                : count > 0 
                                                    ? 'bg-indigo-300 group-hover:bg-indigo-400' 
                                                    : 'bg-slate-100'
                                        }`}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(heightPercent, count > 0 ? 8 : 2)}%` }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                    />
                                </div>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        <div className="font-semibold">{count} vote{count !== 1 ? 's' : ''}</div>
                                        <div className="text-slate-300">{buckets[i].label}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                {/* X-axis labels (first and last) */}
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>{buckets[0]?.label.split(',')[0]}</span>
                    <span>Today</span>
                </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{totalInPeriod}</span> votes in {days} days
                </div>
                <div className="text-xs text-slate-500">
                    Avg: <span className="font-semibold text-slate-700">{avgPerDay.toFixed(1)}</span>/day
                </div>
            </div>
        </div>
    );
};

export default ResponseTimelineChart;
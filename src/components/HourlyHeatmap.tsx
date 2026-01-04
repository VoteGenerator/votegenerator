// ============================================================================
// HourlyHeatmap.tsx - Shows voting patterns by hour and day
// Location: src/components/HourlyHeatmap.tsx
// ============================================================================

import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface Vote {
    timestamp: string;
    [key: string]: any;
}

interface HourlyHeatmapProps {
    votes: Vote[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ votes }) => {
    const heatmapData = useMemo(() => {
        // Initialize 7x24 grid (days x hours)
        const grid: number[][] = Array.from({ length: 7 }, () => 
            Array.from({ length: 24 }, () => 0)
        );
        
        let maxCount = 0;
        let peakDay = 0;
        let peakHour = 0;
        
        votes.forEach(vote => {
            if (!vote.timestamp) return;
            const date = new Date(vote.timestamp);
            const day = date.getDay(); // 0-6
            const hour = date.getHours(); // 0-23
            grid[day][hour]++;
            
            if (grid[day][hour] > maxCount) {
                maxCount = grid[day][hour];
                peakDay = day;
                peakHour = hour;
            }
        });
        
        return { grid, maxCount, peakDay, peakHour };
    }, [votes]);
    
    if (!votes || votes.length === 0) {
        return null;
    }
    
    const { grid, maxCount, peakDay, peakHour } = heatmapData;
    
    // Get color intensity based on count
    const getColor = (count: number): string => {
        if (count === 0) return 'bg-slate-100';
        const intensity = count / maxCount;
        if (intensity > 0.8) return 'bg-indigo-600';
        if (intensity > 0.6) return 'bg-indigo-500';
        if (intensity > 0.4) return 'bg-indigo-400';
        if (intensity > 0.2) return 'bg-indigo-300';
        return 'bg-indigo-200';
    };
    
    // Format hour for display
    const formatHour = (hour: number): string => {
        if (hour === 0) return '12a';
        if (hour === 12) return '12p';
        if (hour < 12) return `${hour}a`;
        return `${hour - 12}p`;
    };
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Voting Patterns</span>
                </div>
                <div className="text-xs text-slate-500">
                    Peak: <span className="font-medium text-slate-700">{DAYS[peakDay]} {formatHour(peakHour)}</span>
                </div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                    {/* Hour labels */}
                    <div className="flex mb-1 ml-10">
                        {HOURS.filter((_, i) => i % 3 === 0).map(hour => (
                            <div 
                                key={hour} 
                                className="text-[10px] text-slate-400 text-center"
                                style={{ width: '48px' }}
                            >
                                {formatHour(hour)}
                            </div>
                        ))}
                    </div>
                    
                    {/* Grid rows */}
                    {DAYS.map((day, dayIndex) => (
                        <div key={day} className="flex items-center mb-1">
                            <div className="w-10 text-xs text-slate-500 font-medium">{day}</div>
                            <div className="flex gap-[2px]">
                                {HOURS.map(hour => {
                                    const count = grid[dayIndex][hour];
                                    return (
                                        <div
                                            key={hour}
                                            className={`w-4 h-4 rounded-sm ${getColor(count)} transition-colors cursor-default group relative`}
                                            title={`${day} ${formatHour(hour)}: ${count} vote${count !== 1 ? 's' : ''}`}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                                    {count} vote{count !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-slate-400">
                <span>Less</span>
                <div className="flex gap-[2px]">
                    <div className="w-3 h-3 rounded-sm bg-slate-100" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-200" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-300" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default HourlyHeatmap;
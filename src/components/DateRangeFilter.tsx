// ============================================================================
// DateRangeFilter.tsx - Date range picker for filtering analytics
// Location: src/components/DateRangeFilter.tsx
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface DateRangeFilterProps {
    onRangeChange: (startDate: Date | null, endDate: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
}

type PresetRange = 'all' | 'today' | '7days' | '30days' | 'custom';

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    onRangeChange,
    minDate,
    maxDate = new Date()
}) => {
    const [selectedPreset, setSelectedPreset] = useState<PresetRange>('all');
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    const [showCustom, setShowCustom] = useState(false);

    const presets: { value: PresetRange; label: string }[] = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: 'custom', label: 'Custom Range' }
    ];

    const handlePresetChange = (preset: PresetRange) => {
        setSelectedPreset(preset);
        
        if (preset === 'custom') {
            setShowCustom(true);
            return;
        }
        
        setShowCustom(false);
        const now = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        switch (preset) {
            case 'all':
                start = null;
                end = null;
                break;
            case 'today':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                end = now;
                break;
            case '7days':
                start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                end = now;
                break;
            case '30days':
                start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                end = now;
                break;
        }

        onRangeChange(start, end);
    };

    const handleCustomApply = () => {
        const start = customStart ? new Date(customStart) : null;
        const end = customEnd ? new Date(customEnd + 'T23:59:59') : null;
        onRangeChange(start, end);
    };

    const handleClear = () => {
        setSelectedPreset('all');
        setCustomStart('');
        setCustomEnd('');
        setShowCustom(false);
        onRangeChange(null, null);
    };

    const formatDateForInput = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-1">
                {presets.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => handlePresetChange(value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            selectedPreset === value
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Custom Date Range Inputs */}
            {showCustom && (
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1">
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            max={customEnd || formatDateForInput(maxDate)}
                            className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <span className="text-slate-400 text-xs">to</span>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            min={customStart}
                            max={formatDateForInput(maxDate)}
                            className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                        className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Clear Filter */}
            {selectedPreset !== 'all' && (
                <button
                    onClick={handleClear}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Clear filter"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

// ============================================================================
// Hook for filtering data by date range
// ============================================================================

interface FilterableItem {
    timestamp?: string;
    createdAt?: string;
    [key: string]: any;
}

export const useDateRangeFilter = <T extends FilterableItem>(
    data: T[],
    dateField: 'timestamp' | 'createdAt' = 'timestamp'
) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const filteredData = useMemo(() => {
        if (!startDate && !endDate) return data;

        return data.filter(item => {
            const itemDate = new Date(item[dateField] || '');
            if (isNaN(itemDate.getTime())) return false;
            
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            
            return true;
        });
    }, [data, startDate, endDate, dateField]);

    const handleRangeChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const dateRangeLabel = useMemo(() => {
        if (!startDate && !endDate) return 'All Time';
        
        const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        if (startDate) return `From ${formatDate(startDate)}`;
        if (endDate) return `Until ${formatDate(endDate)}`;
        return 'All Time';
    }, [startDate, endDate]);

    return {
        filteredData,
        handleRangeChange,
        dateRangeLabel,
        startDate,
        endDate,
        totalCount: data.length,
        filteredCount: filteredData.length
    };
};

export default DateRangeFilter;
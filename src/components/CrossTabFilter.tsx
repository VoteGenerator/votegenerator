// ============================================================================
// CrossTabFilter.tsx - Cross-tabulation filters for device/location
// Location: src/components/CrossTabFilter.tsx
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Monitor, Smartphone, Tablet, Globe, MapPin, X, Filter, ChevronDown } from 'lucide-react';

interface Vote {
    timestamp: string;
    analytics?: {
        device?: string;
        country?: string;
        region?: string;
        browser?: string;
    };
    [key: string]: any;
}

interface CrossTabFilterProps {
    votes: Vote[];
    onFilteredVotesChange: (filteredVotes: Vote[]) => void;
}

// Country code to name mapping (common countries)
const countryNames: Record<string, string> = {
    'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
    'DE': 'Germany', 'FR': 'France', 'ES': 'Spain', 'IT': 'Italy', 'NL': 'Netherlands',
    'BR': 'Brazil', 'MX': 'Mexico', 'IN': 'India', 'JP': 'Japan', 'KR': 'South Korea',
    'CN': 'China', 'RU': 'Russia', 'PL': 'Poland', 'SE': 'Sweden', 'NO': 'Norway',
};

const CrossTabFilter: React.FC<CrossTabFilterProps> = ({ votes, onFilteredVotesChange }) => {
    const [deviceFilter, setDeviceFilter] = useState<string>('all');
    const [countryFilter, setCountryFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique devices and countries from votes
    const { devices, countries } = useMemo(() => {
        const deviceSet = new Set<string>();
        const countrySet = new Set<string>();
        
        votes.forEach(vote => {
            if (vote.analytics?.device) {
                deviceSet.add(vote.analytics.device);
            }
            if (vote.analytics?.country) {
                countrySet.add(vote.analytics.country);
            }
        });
        
        return {
            devices: Array.from(deviceSet).sort(),
            countries: Array.from(countrySet).sort()
        };
    }, [votes]);

    // Apply filters
    const filteredVotes = useMemo(() => {
        let result = votes;
        
        if (deviceFilter !== 'all') {
            result = result.filter(v => v.analytics?.device === deviceFilter);
        }
        
        if (countryFilter !== 'all') {
            result = result.filter(v => v.analytics?.country === countryFilter);
        }
        
        return result;
    }, [votes, deviceFilter, countryFilter]);

    // Notify parent of filter changes
    React.useEffect(() => {
        onFilteredVotesChange(filteredVotes);
    }, [filteredVotes, onFilteredVotesChange]);

    const hasActiveFilters = deviceFilter !== 'all' || countryFilter !== 'all';
    
    const clearFilters = () => {
        setDeviceFilter('all');
        setCountryFilter('all');
    };

    const getDeviceIcon = (device: string) => {
        switch (device.toLowerCase()) {
            case 'mobile': return <Smartphone size={14} />;
            case 'tablet': return <Tablet size={14} />;
            default: return <Monitor size={14} />;
        }
    };

    // Don't show if no filterable data
    if (devices.length === 0 && countries.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Cross-Tabulation Filters</span>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {filteredVotes.length} of {votes.length}
                        </span>
                    )}
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                />
            </button>

            {/* Filter Controls */}
            {showFilters && (
                <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Device Filter */}
                        {devices.length > 0 && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                                    <Monitor size={12} />
                                    Device Type
                                </label>
                                <select
                                    value={deviceFilter}
                                    onChange={(e) => setDeviceFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
                                >
                                    <option value="all">All Devices ({votes.length})</option>
                                    {devices.map(device => {
                                        const count = votes.filter(v => v.analytics?.device === device).length;
                                        return (
                                            <option key={device} value={device}>
                                                {device.charAt(0).toUpperCase() + device.slice(1)} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        {/* Country Filter */}
                        {countries.length > 0 && (
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                                    <Globe size={12} />
                                    Country/Region
                                </label>
                                <select
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white"
                                >
                                    <option value="all">All Countries ({votes.length})</option>
                                    {countries.map(country => {
                                        const count = votes.filter(v => v.analytics?.country === country).length;
                                        const name = countryNames[country] || country;
                                        return (
                                            <option key={country} value={country}>
                                                {name} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                                {deviceFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg">
                                        {getDeviceIcon(deviceFilter)}
                                        {deviceFilter}
                                        <button 
                                            onClick={() => setDeviceFilter('all')}
                                            className="ml-1 hover:text-indigo-900"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {countryFilter !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">
                                        <MapPin size={12} />
                                        {countryNames[countryFilter] || countryFilter}
                                        <button 
                                            onClick={() => setCountryFilter('all')}
                                            className="ml-1 hover:text-emerald-900"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={clearFilters}
                                className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="bg-slate-50 rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-lg font-bold text-slate-800">{filteredVotes.length}</div>
                                <div className="text-xs text-slate-500">Filtered Votes</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-800">
                                    {votes.length > 0 ? Math.round((filteredVotes.length / votes.length) * 100) : 0}%
                                </div>
                                <div className="text-xs text-slate-500">of Total</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-800">
                                    {hasActiveFilters ? (deviceFilter !== 'all' ? 1 : 0) + (countryFilter !== 'all' ? 1 : 0) : 0}
                                </div>
                                <div className="text-xs text-slate-500">Active Filters</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrossTabFilter;
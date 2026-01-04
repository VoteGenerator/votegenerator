// ============================================================================
// GeoChart.tsx - Shows geographic distribution of votes
// Location: src/components/GeoChart.tsx
// ============================================================================

import React, { useMemo } from 'react';
import { Globe, MapPin } from 'lucide-react';

interface Vote {
    timestamp: string;
    analytics?: {
        country?: string;
        region?: string;
        device?: string;
    };
    [key: string]: any;
}

interface GeoChartProps {
    votes: Vote[];
    maxCountries?: number;
}

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
    'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱', 'BR': '🇧🇷',
    'MX': '🇲🇽', 'IN': '🇮🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
    'RU': '🇷🇺', 'PL': '🇵🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
    'FI': '🇫🇮', 'IE': '🇮🇪', 'PT': '🇵🇹', 'BE': '🇧🇪', 'CH': '🇨🇭',
    'AT': '🇦🇹', 'NZ': '🇳🇿', 'SG': '🇸🇬', 'HK': '🇭🇰', 'PH': '🇵🇭',
    'ID': '🇮🇩', 'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ZA': '🇿🇦',
    'AE': '🇦🇪', 'IL': '🇮🇱', 'SA': '🇸🇦', 'EG': '🇪🇬', 'NG': '🇳🇬',
    'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'TR': '🇹🇷',
    'GR': '🇬🇷', 'CZ': '🇨🇿', 'RO': '🇷🇴', 'HU': '🇭🇺', 'UA': '🇺🇦'
};

// Country code to full name
const countryNames: Record<string, string> = {
    'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
    'DE': 'Germany', 'FR': 'France', 'ES': 'Spain', 'IT': 'Italy', 'NL': 'Netherlands',
    'BR': 'Brazil', 'MX': 'Mexico', 'IN': 'India', 'JP': 'Japan', 'KR': 'South Korea',
    'CN': 'China', 'RU': 'Russia', 'PL': 'Poland', 'SE': 'Sweden', 'NO': 'Norway',
    'DK': 'Denmark', 'FI': 'Finland', 'IE': 'Ireland', 'PT': 'Portugal', 'BE': 'Belgium',
    'CH': 'Switzerland', 'AT': 'Austria', 'NZ': 'New Zealand', 'SG': 'Singapore',
    'HK': 'Hong Kong', 'PH': 'Philippines', 'ID': 'Indonesia', 'MY': 'Malaysia',
    'TH': 'Thailand', 'VN': 'Vietnam', 'ZA': 'South Africa', 'AE': 'UAE',
    'IL': 'Israel', 'SA': 'Saudi Arabia', 'EG': 'Egypt', 'NG': 'Nigeria',
    'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru', 'TR': 'Turkey',
    'GR': 'Greece', 'CZ': 'Czech Republic', 'RO': 'Romania', 'HU': 'Hungary', 'UA': 'Ukraine'
};

const GeoChart: React.FC<GeoChartProps> = ({ votes, maxCountries = 5 }) => {
    const geoData = useMemo(() => {
        const countryCounts: Record<string, number> = {};
        let totalWithCountry = 0;
        
        votes.forEach(vote => {
            const country = vote.analytics?.country;
            if (country) {
                countryCounts[country] = (countryCounts[country] || 0) + 1;
                totalWithCountry++;
            }
        });
        
        // Sort by count and take top N
        const sorted = Object.entries(countryCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, maxCountries);
        
        const maxCount = sorted.length > 0 ? sorted[0][1] : 0;
        
        return {
            countries: sorted.map(([code, count]) => ({
                code,
                name: countryNames[code] || code,
                flag: countryFlags[code] || '🌍',
                count,
                percentage: totalWithCountry > 0 ? (count / totalWithCountry) * 100 : 0
            })),
            maxCount,
            totalWithCountry,
            totalVotes: votes.length,
            unknownCount: votes.length - totalWithCountry
        };
    }, [votes, maxCountries]);
    
    if (!votes || votes.length === 0 || geoData.totalWithCountry === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Globe size={16} />
                    <span>No geographic data available yet</span>
                </div>
            </div>
        );
    }
    
    const { countries, maxCount, totalWithCountry, unknownCount } = geoData;
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Globe size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Top Locations</span>
                </div>
                <span className="text-xs text-slate-400">
                    {totalWithCountry} tracked
                </span>
            </div>
            
            {/* Country bars */}
            <div className="space-y-3">
                {countries.map(({ code, name, flag, count, percentage }) => (
                    <div key={code} className="group">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{flag}</span>
                                <span className="text-sm font-medium text-slate-700">{name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-semibold text-slate-800">{count}</span>
                                <span className="text-xs text-slate-400 ml-1">({percentage.toFixed(0)}%)</span>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${(count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Unknown/Other */}
            {unknownCount > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        Unknown location
                    </span>
                    <span>{unknownCount} votes</span>
                </div>
            )}
        </div>
    );
};

export default GeoChart;
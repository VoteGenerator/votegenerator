import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, BarChart, LayoutGrid, PieChart, Settings, GitMerge, MessageSquare, Quote, Calendar, TrendingUp, Coins, Activity, Map as MapIcon, Info, GitCompare, SlidersHorizontal, DollarSign, Check, Smartphone, Monitor, Clock, Globe, ChevronDown, ChevronUp, Zap, Download, ExternalLink, FileText, Crown, Lock } from 'lucide-react';
import { RunoffResult, Poll, SurveyResponse } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';
import SurveyResults from './SurveyResults';
import { THEMES, ThemeConfig } from './ThemeSelector';

// Get theme config from theme ID
const getThemeConfig = (themeId?: string): ThemeConfig => {
    if (!themeId) return THEMES[0];
    return THEMES.find(t => t.id === themeId) || THEMES[0];
};

// Generate CSS classes for special effects
const getSpecialEffectClasses = (effect?: string): string => {
    switch (effect) {
        case 'glow': return 'shadow-2xl';
        case 'shimmer': return 'relative overflow-hidden';
        case 'glass': return 'backdrop-blur-xl bg-opacity-80';
        case 'shadow-lg': return 'shadow-2xl';
        default: return '';
    }
};

// Helper: Get country name from code
const COUNTRY_NAMES: Record<string, string> = {
    'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada', 'AU': 'Australia',
    'DE': 'Germany', 'FR': 'France', 'JP': 'Japan', 'IN': 'India', 'BR': 'Brazil',
    'MX': 'Mexico', 'ES': 'Spain', 'IT': 'Italy', 'NL': 'Netherlands', 'SE': 'Sweden',
    'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'IE': 'Ireland',
    'NZ': 'New Zealand', 'KR': 'South Korea', 'SG': 'Singapore', 'CH': 'Switzerland',
    'AT': 'Austria', 'BE': 'Belgium', 'PT': 'Portugal', 'AR': 'Argentina', 'CL': 'Chile',
    'CO': 'Colombia', 'PH': 'Philippines', 'ID': 'Indonesia', 'MY': 'Malaysia',
    'TH': 'Thailand', 'VN': 'Vietnam', 'ZA': 'South Africa', 'IL': 'Israel',
    'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'TR': 'Turkey', 'RU': 'Russia',
    'UA': 'Ukraine', 'CZ': 'Czech Republic', 'RO': 'Romania', 'GR': 'Greece', 'HU': 'Hungary'
};

const getCountryName = (code: string): string => COUNTRY_NAMES[code] || code;

// Helper: Get country flag emoji
const COUNTRY_FLAGS: Record<string, string> = {
    'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
    'Germany': '🇩🇪', 'France': '🇫🇷', 'Japan': '🇯🇵', 'India': '🇮🇳', 'Brazil': '🇧🇷',
    'Mexico': '🇲🇽', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪',
    'Norway': '🇳🇴', 'Denmark': '🇩🇰', 'Finland': '🇫🇮', 'Poland': '🇵🇱', 'Ireland': '🇮🇪',
    'New Zealand': '🇳🇿', 'South Korea': '🇰🇷', 'Singapore': '🇸🇬', 'Switzerland': '🇨🇭',
    'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷', 'Chile': '🇨🇱',
    'Colombia': '🇨🇴', 'Philippines': '🇵🇭', 'Indonesia': '🇮🇩', 'Malaysia': '🇲🇾',
    'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'South Africa': '🇿🇦', 'Israel': '🇮🇱',
    'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Turkey': '🇹🇷', 'Russia': '🇷🇺',
    'Ukraine': '🇺🇦', 'Czech Republic': '🇨🇿', 'Romania': '🇷🇴', 'Greece': '🇬🇷', 'Hungary': '🇭🇺'
};

const getCountryFlag = (country: string): string => COUNTRY_FLAGS[country] || '🌍';

// Helper to safely get timestamp from vote
const getVoteTime = (vote: any): number => {
    const timeStr = vote.votedAt || vote.timestamp;
    return timeStr ? new Date(timeStr).getTime() : Date.now();
};

// ============================================================================
// Calendar Integration Helpers
// ============================================================================

// Parse meeting time slot text to extract date/time info
// Handles formats like: "Monday, Jan 15 at 2:00 PM", "2025-01-15 14:00", "Friday 3pm", etc.
const parseMeetingTimeSlot = (slotText: string): { start: Date } | null => {
    try {
        const now = new Date();
        let start: Date | null = null;
        
        // Try ISO format first (2025-01-15T14:00)
        if (/^\d{4}-\d{2}-\d{2}/.test(slotText)) {
            start = new Date(slotText);
        }
        
        // Try parsing natural language with date
        if (!start || isNaN(start.getTime())) {
            // Look for patterns like "Jan 15", "January 15", "1/15", etc.
            const dateMatch = slotText.match(/(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?/i);
            const timeMatch = slotText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
            
            if (dateMatch) {
                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                const monthStr = dateMatch[1].toLowerCase().slice(0, 3);
                const monthIndex = monthNames.indexOf(monthStr);
                const day = parseInt(dateMatch[2]);
                const year = dateMatch[3] ? parseInt(dateMatch[3]) : now.getFullYear();
                
                if (monthIndex !== -1 && day >= 1 && day <= 31) {
                    start = new Date(year, monthIndex, day);
                    
                    // Add time if found
                    if (timeMatch) {
                        let hour = parseInt(timeMatch[1]);
                        const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
                        const ampm = timeMatch[3]?.toLowerCase();
                        
                        if (ampm === 'pm' && hour < 12) hour += 12;
                        if (ampm === 'am' && hour === 12) hour = 0;
                        
                        start.setHours(hour, minute, 0, 0);
                    } else {
                        start.setHours(12, 0, 0, 0); // Default to noon
                    }
                }
            }
        }
        
        // If still no valid date, try just time for "next occurrence"
        if (!start || isNaN(start.getTime())) {
            const timeOnlyMatch = slotText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
            if (timeOnlyMatch) {
                start = new Date(now);
                let hour = parseInt(timeOnlyMatch[1]);
                const minute = timeOnlyMatch[2] ? parseInt(timeOnlyMatch[2]) : 0;
                const ampm = timeOnlyMatch[3].toLowerCase();
                
                if (ampm === 'pm' && hour < 12) hour += 12;
                if (ampm === 'am' && hour === 12) hour = 0;
                
                start.setHours(hour, minute, 0, 0);
                
                // If time has passed today, set for tomorrow
                if (start < now) {
                    start.setDate(start.getDate() + 1);
                }
            }
        }
        
        if (!start || isNaN(start.getTime())) {
            return null;
        }
        
        // Return just the start - duration will be applied by caller
        return { start };
    } catch {
        return null;
    }
};

// Format date for Google Calendar (YYYYMMDDTHHmmssZ)
const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

// Generate Google Calendar link
const generateGoogleCalendarLink = (title: string, slotText: string, pollTitle: string, durationMinutes: number = 60): string | null => {
    const parsed = parseMeetingTimeSlot(slotText);
    if (!parsed) return null;
    
    const end = new Date(parsed.start.getTime() + durationMinutes * 60 * 1000);
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: pollTitle || title,
        dates: `${formatGoogleDate(parsed.start)}/${formatGoogleDate(end)}`,
        details: `Scheduled via VoteGenerator\nTime slot: ${slotText}\nDuration: ${durationMinutes} minutes`,
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Generate Outlook Calendar link
const generateOutlookCalendarLink = (title: string, slotText: string, pollTitle: string, durationMinutes: number = 60): string | null => {
    const parsed = parseMeetingTimeSlot(slotText);
    if (!parsed) return null;
    
    const end = new Date(parsed.start.getTime() + durationMinutes * 60 * 1000);
    
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: pollTitle || title,
        startdt: parsed.start.toISOString(),
        enddt: end.toISOString(),
        body: `Scheduled via VoteGenerator\nTime slot: ${slotText}\nDuration: ${durationMinutes} minutes`,
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

// Generate .ics file content
const generateICSContent = (title: string, slotText: string, pollTitle: string, durationMinutes: number = 60): string | null => {
    const parsed = parseMeetingTimeSlot(slotText);
    if (!parsed) return null;
    
    const end = new Date(parsed.start.getTime() + durationMinutes * 60 * 1000);
    
    const formatICSDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@votegenerator.com`;
    const now = formatICSDate(new Date());
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VoteGenerator//Meeting Poll//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${formatICSDate(parsed.start)}
DTEND:${formatICSDate(end)}
SUMMARY:${pollTitle || title}
DESCRIPTION:Scheduled via VoteGenerator\\nTime slot: ${slotText}\\nDuration: ${durationMinutes} minutes
END:VEVENT
END:VCALENDAR`;
};

// Download .ics file
const downloadICS = (title: string, slotText: string, pollTitle: string, durationMinutes: number = 60) => {
    const content = generateICSContent(title, slotText, pollTitle, durationMinutes);
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(pollTitle || title).replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

interface Props {
    poll: Poll;
    results: RunoffResult & { votes?: any[] };
    onEdit?: () => void;
    adminKey?: string | null;
    isAdmin?: boolean;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results, onEdit, adminKey, isAdmin }) => {
    // Get tier for feature gating
    const tier = useMemo(() => {
        return localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
    }, []);
    const isPaidUser = tier === 'pro' || tier === 'business';
    const isFreeUser = tier === 'free';
    
    // Get theme configuration
    const theme = useMemo(() => getThemeConfig((poll as any).theme), [(poll as any).theme]);
    const isDarkTheme = theme.cardBg?.includes('slate-9') || theme.cardBg?.includes('slate-950');
    
    const { winnerId, rounds, totalVotes, simpleCounts, maybeCounts, comments, matrixAverages, pairwiseScores, ratingStats, budgetStats } = results;
    const votes: any[] = (results as any).votes || [];
    const isRanked = poll.pollType === 'ranked';
    const isMeeting = poll.pollType === 'meeting';
    const isDot = poll.pollType === 'dot';
    const isMatrix = poll.pollType === 'matrix';
    const isPairwise = poll.pollType === 'pairwise';
    const isRating = poll.pollType === 'rating';
    const isBudget = poll.pollType === 'budget';
    const isSurvey = poll.pollType === 'survey' || (poll as any).isSurvey;
    // For this-or-that and multiple choice, check if it's a simple poll (not one of the special types)
    const isSimplePoll = !isRanked && !isMeeting && !isDot && !isMatrix && !isPairwise && !isRating && !isBudget && !isSurvey;
    const isThisOrThat = isSimplePoll && poll.options.length === 2;
    const isMultipleChoice = isSimplePoll && poll.options.length > 2;
    
    const [viewMode, setViewMode] = useState<'bar' | 'flow' | 'pie' | 'grid' | 'heatmap' | 'velocity' | 'map' | 'matrix' | 'pairwise' | 'rating'>(
        isRanked ? 'flow' : isMeeting ? 'heatmap' : isMatrix ? 'matrix' : isPairwise ? 'pairwise' : isRating ? 'rating' : 'bar'
    );

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    const barChartData: Record<string, number> = (() => {
        if (isBudget && budgetStats) {
            const data: Record<string, number> = {};
            Object.entries(budgetStats).forEach(([id, stat]) => {
                const value = (stat as any).totalValue ?? (stat as any).totalSpent ?? 0;
                data[id] = typeof value === 'number' ? value : 0;
            });
            return data;
        }
        if (simpleCounts) return simpleCounts;
        if (isRanked && rounds.length > 0) {
            const firstRoundCounts = rounds[0].counts;
            return firstRoundCounts ?? {};
        }
        const counts: Record<string, number> = {};
        poll.options.forEach(o => counts[o.id] = 0);
        return counts;
    })();

    const meetingScoreData = (() => {
        const scores: Record<string, number> = {};
        poll.options.forEach(o => scores[o.id] = 0);
        if (simpleCounts) Object.entries(simpleCounts).forEach(([id, c]) => scores[id] = (scores[id] || 0) + c);
        if (maybeCounts) Object.entries(maybeCounts).forEach(([id, c]) => scores[id] = (scores[id] || 0) + (c * 0.5));
        return scores;
    })();

    // Check for ties (multiple options with same top vote count)
    const topVoteCount = simpleCounts ? Math.max(...Object.values(simpleCounts)) : 0;
    const tiedOptions = simpleCounts ? Object.entries(simpleCounts).filter(([_, count]) => count === topVoteCount) : [];
    const isTie = tiedOptions.length > 1 && topVoteCount > 0;

    const meetingWinnerId = isMeeting ? Object.keys(meetingScoreData).reduce((a, b) => meetingScoreData[a] > meetingScoreData[b] ? a : b, poll.options[0].id) : winnerId;
    const activeWinnerId = isMeeting ? meetingWinnerId : winnerId;

    // === FREE ANALYTICS COMPUTATIONS ===
    const [showInsights, setShowInsights] = useState(false);
    const [isExportingPng, setIsExportingPng] = useState(false);
    
    // Device breakdown (computed from user agent in votes)
    const deviceStats = useMemo(() => {
        if (!votes.length) return { mobile: 0, desktop: 0, tablet: 0 };
        let mobile = 0, desktop = 0, tablet = 0;
        votes.forEach(v => {
            const ua = v.userAgent || v.device || '';
            if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) tablet++;
            else if (/Mobile|iPhone|Android/i.test(ua)) mobile++;
            else desktop++;
        });
        return { mobile, desktop, tablet };
    }, [votes]);

    // Hourly distribution (peak voting times)
    const hourlyStats = useMemo(() => {
        if (!votes.length) return [];
        const hours: Record<number, number> = {};
        for (let i = 0; i < 24; i++) hours[i] = 0;
        votes.forEach(v => {
            const time = getVoteTime(v);
            const hour = new Date(time).getHours();
            hours[hour]++;
        });
        return Object.entries(hours).map(([h, count]) => ({ hour: parseInt(h), count }));
    }, [votes]);

    const peakHour = useMemo(() => {
        if (!hourlyStats.length) return null;
        const peak = hourlyStats.reduce((a, b) => a.count > b.count ? a : b);
        return peak.count > 0 ? peak : null;
    }, [hourlyStats]);

    // Geographic breakdown
    const geoStats = useMemo(() => {
        if (!votes.length) return [];
        const countries: Record<string, number> = {};
        votes.forEach(v => {
            const country = v.country || v.geo?.country || v.analytics?.country || 'Unknown';
            countries[country] = (countries[country] || 0) + 1;
        });
        return Object.entries(countries)
            .map(([country, count]) => ({ country: getCountryName(country), count, percentage: Math.round((count / votes.length) * 100) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [votes]);

    // Traffic source breakdown (referrer domains)
    const referrerStats = useMemo(() => {
        if (!votes.length) return [];
        const sources: Record<string, number> = {};
        votes.forEach(v => {
            const source = v.analytics?.referrerDomain || v.analytics?.utmSource || v.referrer || 'Direct';
            sources[source] = (sources[source] || 0) + 1;
        });
        return Object.entries(sources)
            .map(([source, count]) => ({ source, count, percentage: Math.round((count / votes.length) * 100) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [votes]);

    // Response timeline (votes per day)
    const timelineStats = useMemo(() => {
        if (!votes.length) return [];
        const days: Record<string, number> = {};
        votes.forEach(v => {
            const time = getVoteTime(v);
            const day = new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            days[day] = (days[day] || 0) + 1;
        });
        return Object.entries(days).map(([day, count]) => ({ day, count }));
    }, [votes]);

    // Recent momentum (last 24h vs previous 24h)
    const momentum = useMemo(() => {
        if (!votes.length) return null;
        const now = Date.now();
        const last24h = votes.filter(v => now - getVoteTime(v) < 24 * 60 * 60 * 1000).length;
        const prev24h = votes.filter(v => {
            const age = now - getVoteTime(v);
            return age >= 24 * 60 * 60 * 1000 && age < 48 * 60 * 60 * 1000;
        }).length;
        if (prev24h === 0 && last24h === 0) return null;
        const change = prev24h === 0 ? 100 : Math.round(((last24h - prev24h) / prev24h) * 100);
        return { last24h, prev24h, change };
    }, [votes]);

    // Format hour for display
    const formatHour = (h: number) => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h < 12 ? `${h} AM` : `${h - 12} PM`;
    };

    const CHART_COLORS = [
        '#6366f1', '#ec4899', '#06b6d4', '#84cc16', 
        '#f97316', '#ef4444', '#14b8a6', '#3b82f6', '#eab308', '#a855f7'
    ];

    const getHexColor = (id: string) => {
        const index = poll.options.findIndex(o => o.id === id);
        return CHART_COLORS[index % CHART_COLORS.length];
    };

    const getBarColorClass = (id: string) => {
        const index = poll.options.findIndex(o => o.id === id);
        const colors = [
            'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500', 'bg-lime-500', 
            'bg-orange-500', 'bg-red-500', 'bg-teal-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'
        ];
        return colors[index % colors.length];
    };

    const shouldShowComments = comments && comments.length > 0 && (poll.isAdmin || (poll.settings.allowComments && poll.settings.publicComments));

    const pieData = (() => {
        const counts = barChartData; 
        const total = Object.values(counts).reduce((a,b) => a+b, 0);
        let currentAngle = 0;
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([id, count]) => {
                const angle = total > 0 ? (count / total) * 360 : 0;
                const d = { id, count, percentage: total > 0 ? (count / total) * 100 : 0, color: getHexColor(id), startAngle: currentAngle, angle };
                currentAngle += angle;
                return d;
            });
    })();
    const pieGradient = pieData.map(d => `${d.color} ${d.startAngle}deg ${d.startAngle + d.angle}deg`).join(', ');

    const maxHeat = Math.max(...Object.values(meetingScoreData), 1);

    const velocityData = (() => {
        if (!votes || votes.length === 0) return [];
        const sortedVotes = [...votes].sort((a, b) => getVoteTime(a) - getVoteTime(b));
        if(sortedVotes.length === 0) return [];
        
        const startTime = getVoteTime(sortedVotes[0]);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // For very short durations (< 10 min), show each vote as a point
        if (duration < 600000 || votes.length < 3) {
            return sortedVotes.map(v => ({
                time: new Date(getVoteTime(v)),
                count: 1
            }));
        }
        
        const buckets = Math.min(10, votes.length);
        const bucketSize = Math.max(duration / buckets, 60000); 
        
        const data = Array(buckets).fill(0).map((_, i) => ({ 
            time: new Date(startTime + (i * bucketSize)), 
            count: 0 
        }));

        sortedVotes.forEach(v => {
            const time = getVoteTime(v);
            const bucketIndex = Math.min(Math.floor((time - startTime) / bucketSize), buckets - 1);
            if(bucketIndex >= 0) data[bucketIndex].count++;
        });
        return data;
    })();

    const sankeyData = useMemo(() => {
        if (rounds.length === 0) return { nodes: [], links: [], width: 0, height: 400 };
        const nodes: any[] = [];
        const links: any[] = [];
        const canvasHeight = 400;
        const roundWidth = 150;
        const gap = 10;
        const firstCounts: Record<string, number> = rounds[0].counts || {};
        const firstRoundTotal = Object.values(firstCounts).reduce((a: number, b: number) => a + b, 0);

        rounds.forEach((round, roundIdx) => {
            let yOffset = 0;
            const counts: Record<string, number> = round.counts || {};
            const sortedIds = Object.keys(counts).sort((a,b) => (counts[b] || 0) - (counts[a] || 0));
            sortedIds.forEach(id => {
                const count = counts[id] || 0;
                const height = firstRoundTotal > 0 ? (count / firstRoundTotal) * (canvasHeight - (sortedIds.length * gap)) : 0; 
                if (count >= 0) {
                    nodes.push({ id: `${roundIdx}-${id}`, optionId: id, round: roundIdx, value: count, x: roundIdx * roundWidth, y: yOffset, height: Math.max(height, 2), color: getHexColor(id) });
                    yOffset += height + gap;
                }
            });
        });

        for (let i = 0; i < rounds.length - 1; i++) {
            const currentRound = rounds[i];
            const nextRound = rounds[i+1];
            const eliminatedId = currentRound.eliminatedId;
            const currentMap: Record<string, number> = currentRound.counts || {};
            const nextMap: Record<string, number> = nextRound.counts || {};

            Object.keys(nextMap).forEach(id => {
                const prevCount = currentMap[id] || 0;
                const newCount = nextMap[id] || 0;
                const delta = newCount - prevCount;
                if (prevCount > 0) {
                    links.push({ source: `${i}-${id}`, target: `${i+1}-${id}`, value: prevCount, color: getHexColor(id), opacity: 0.5 });
                }
                if (delta > 0 && eliminatedId) {
                    links.push({ source: `${i}-${eliminatedId}`, target: `${i+1}-${id}`, value: delta, color: getHexColor(eliminatedId), opacity: 0.3 });
                }
            });
        }
        return { nodes, links, width: rounds.length * roundWidth, height: canvasHeight };
    }, [rounds]);

    const renderSankeySVG = () => {
        const { nodes, links, width, height } = sankeyData;
        return (
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                {links.map((link, i) => {
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;
                    const sy = sourceNode.y + sourceNode.height / 2;
                    const ty = targetNode.y + targetNode.height / 2;
                    const sx = sourceNode.x + 20; 
                    const tx = targetNode.x;
                    const strokeWidth = (link.value / totalVotes) * height;
                    const path = `M ${sx} ${sy} C ${sx + 50} ${sy}, ${tx - 50} ${ty}, ${tx} ${ty}`;
                    return <path key={i} d={path} stroke={link.color} strokeWidth={Math.max(strokeWidth, 1)} fill="none" opacity={link.opacity} className="transition-all hover:opacity-80" />;
                })}
                {nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        <rect width={20} height={node.height} fill={node.color} rx={4} className="shadow-sm" />
                        <text x={10} y={-5} textAnchor="middle" fontSize="10" className="fill-slate-500 font-bold">{node.value}</text>
                        {node.round === 0 && <text x={0} y={node.height / 2} dx={-5} dy={4} textAnchor="end" fontSize="11" className="fill-slate-700 font-bold">{getOptionText(node.optionId)}</text>}
                        {node.round === rounds.length - 1 && <text x={25} y={node.height / 2} dy={4} textAnchor="start" fontSize="11" className="fill-slate-700 font-bold">{getOptionText(node.optionId)}</text>}
                    </g>
                ))}
            </svg>
        );
    };


    if (totalVotes === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No votes yet</h3>
                <p className="text-slate-500 mt-2">Share the link to get started!</p>
                {onEdit && (
                    <button 
                        onClick={onEdit}
                        className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
                    >
                        <Settings size={16} /> Edit Poll Settings
                    </button>
                )}
            </div>
        );
    }

    // =========================================================================
    // SURVEY MODE - Multi-section form results
    // =========================================================================
    if (isSurvey && (poll as any).sections?.length > 0) {
        // Debug: Log raw votes
        console.log('VoteGeneratorResults: Raw votes count:', votes.length);
        if (votes[0]) {
            console.log('VoteGeneratorResults: First vote:', votes[0]);
            console.log('VoteGeneratorResults: First vote surveyAnswers:', votes[0].surveyAnswers);
            console.log('VoteGeneratorResults: First vote answers:', votes[0].answers);
        }
        
        // Extract survey responses from votes
        const surveyResponses: SurveyResponse[] = votes
            .filter((v: any) => v.surveyAnswers || v.answers)
            .map((v: any) => ({
                id: v.id || Math.random().toString(36).substring(2, 9),
                pollId: poll.id,
                voterName: v.voterName,
                submittedAt: v.votedAt || v.timestamp || new Date().toISOString(),
                startedAt: v.startedAt,
                completedAt: v.votedAt || v.timestamp,
                completionTime: v.completionTime,
                answers: v.surveyAnswers || v.answers || {},
                isComplete: true,
            }));
        
        console.log('VoteGeneratorResults: Mapped surveyResponses count:', surveyResponses.length);
        if (surveyResponses[0]) {
            console.log('VoteGeneratorResults: First mapped response:', surveyResponses[0]);
        }
        
        return (
            <div className="space-y-6">
                {/* Survey Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Survey Results</h2>
                            <p className="text-emerald-100">{poll.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4 text-sm">
                        <div>
                            <span className="text-emerald-200">Responses:</span>{' '}
                            <span className="font-bold">{surveyResponses.length}</span>
                        </div>
                        <div>
                            <span className="text-emerald-200">Sections:</span>{' '}
                            <span className="font-bold">{(poll as any).sections?.length || 0}</span>
                        </div>
                        <div>
                            <span className="text-emerald-200">Questions:</span>{' '}
                            <span className="font-bold">
                                {(poll as any).sections?.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0) || 0}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Survey Results Component */}
                <SurveyResults 
                    poll={poll} 
                    responses={surveyResponses}
                    isAdmin={isAdmin}
                />
                
                {/* Edit Button */}
                {onEdit && isAdmin && (
                    <div className="flex justify-center">
                        <button 
                            onClick={onEdit}
                            className="px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-2"
                        >
                            <Settings size={18} /> Edit Survey Settings
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {/* Comprehensive Print Styles */}
            <style>{`
                @media print {
                    /* Preserve colors */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    /* Page setup */
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    
                    /* Hide non-print elements */
                    .print\\:hidden, 
                    button:not(.print-show),
                    nav,
                    .view-switcher,
                    [class*="hover:"],
                    .animate-spin {
                        display: none !important;
                    }
                    
                    /* Show print elements */
                    .print\\:block {
                        display: block !important;
                    }
                    
                    /* Clean backgrounds */
                    body {
                        background: white !important;
                    }
                    
                    /* Typography adjustments */
                    .text-4xl { font-size: 24pt !important; }
                    .text-3xl { font-size: 20pt !important; }
                    .text-2xl { font-size: 16pt !important; }
                    .text-xl { font-size: 14pt !important; }
                    .text-lg { font-size: 12pt !important; }
                    
                    /* Card styling for print */
                    .rounded-3xl, .rounded-2xl, .rounded-xl {
                        border-radius: 8px !important;
                        box-shadow: none !important;
                        border: 1px solid #e2e8f0 !important;
                    }
                    
                    /* Prevent breaks inside elements */
                    .break-inside-avoid {
                        break-inside: avoid;
                    }
                    
                    /* Chart containers */
                    #poll-results-chart {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    /* Bar chart bars - preserve gradient */
                    [class*="bg-gradient"] {
                        background: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
                    }
                    
                    /* SVG pie chart */
                    svg path, svg circle {
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
            
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{poll.title}</h1>
                        {poll.description && (
                            <p className="text-slate-500 mt-1">{poll.description}</p>
                        )}
                    </div>
                    <div className="text-right text-sm text-slate-500">
                        <div className="font-semibold">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</div>
                        <div>Printed {new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6 print:space-y-4">
            
            {/* Results Summary Cards - Admin Only */}
            {isAdmin && totalVotes > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={16} className="text-indigo-500" />
                            <span className="text-xs font-medium text-indigo-600">Total Responses</span>
                        </div>
                        <p className="text-2xl font-black text-indigo-900">{totalVotes}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={16} className="text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600">Options</span>
                        </div>
                        <p className="text-2xl font-black text-emerald-900">{poll.options.length}</p>
                    </div>
                    
                    {activeWinnerId && !isTie && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy size={16} className="text-amber-500" />
                                <span className="text-xs font-medium text-amber-600">{isMeeting ? 'Best Time' : 'Leading'}</span>
                            </div>
                            <p className="text-lg font-bold text-amber-900 truncate">{getOptionText(activeWinnerId)}</p>
                            {simpleCounts && simpleCounts[activeWinnerId] !== undefined && (
                                <p className="text-xs text-amber-600">{simpleCounts[activeWinnerId]} votes ({totalVotes > 0 ? Math.round((simpleCounts[activeWinnerId] / totalVotes) * 100) : 0}%)</p>
                            )}
                        </div>
                    )}
                    
                    {isTie && tiedOptions.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Users size={16} className="text-amber-500" />
                                <span className="text-xs font-medium text-amber-600">It's a Tie!</span>
                            </div>
                            <p className="text-sm font-bold text-amber-900">{tiedOptions.length} options with {topVoteCount} votes each</p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Poll Insights Panel - Tier Gated */}
            {isAdmin && totalVotes >= 3 && votes.length > 0 && (
                <>
                    {/* FREE USERS: Show locked preview */}
                    {isFreeUser && (
                        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl border border-purple-200 p-5 print:hidden">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Activity size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            Poll Insights
                                            <Lock size={14} className="text-amber-500" />
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            <span className="font-semibold text-purple-600">{totalVotes} votes</span> with hidden insights
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="/pricing"
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
                                >
                                    <Crown size={16} /> Upgrade
                                </a>
                            </div>
                            
                            {/* Blurred preview cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                <div className="relative p-3 bg-white/60 rounded-lg border border-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <Smartphone size={12} className="text-blue-500" />
                                        <span className="text-xs font-medium text-slate-500">Device Breakdown</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-300 blur-[2px]">
                                        {deviceStats.desktop > deviceStats.mobile ? 'Desktop 65%' : 'Mobile 70%'}
                                    </div>
                                </div>
                                <div className="relative p-3 bg-white/60 rounded-lg border border-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={12} className="text-emerald-500" />
                                        <span className="text-xs font-medium text-slate-500">Geographic</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-300 blur-[2px]">
                                        {geoStats.length > 0 ? `${geoStats.length} countries` : '1 country'}
                                    </div>
                                </div>
                                <div className="relative p-3 bg-white/60 rounded-lg border border-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={12} className="text-purple-500" />
                                        <span className="text-xs font-medium text-slate-500">Hourly Heatmap</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-300 blur-[2px]">
                                        Peak: {peakHour ? formatHour(peakHour.hour) : '2 PM'}
                                    </div>
                                </div>
                                <div className="relative p-3 bg-white/60 rounded-lg border border-purple-100 overflow-hidden">
                                    <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp size={12} className="text-indigo-500" />
                                        <span className="text-xs font-medium text-slate-500">Response Timeline</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-300 blur-[2px]">
                                        {momentum ? `${momentum.last24h}/day` : 'View trends'}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-3">
                                Plus: Cross-tabulation filters, Word cloud, Suspicious activity alerts, Export CSV/Excel/PDF
                            </p>
                        </div>
                    )}
                    
                    {/* PAID USERS: Show full insights */}
                    {isPaidUser && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
                            <button 
                                onClick={() => setShowInsights(!showInsights)}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition"
                            >
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-500" />
                                    <span className="font-semibold text-slate-700">Poll Insights</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        tier === 'business' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {tier === 'business' ? 'Business' : 'Pro'}
                                    </span>
                                </div>
                                {showInsights ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>
                            
                            <AnimatePresence>
                                {showInsights && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100"
                                    >
                                        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* Device Breakdown */}
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Smartphone size={14} className="text-blue-500" />
                                                    <span className="text-xs font-medium text-slate-600">Devices</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1"><Monitor size={12} /> Desktop</span>
                                                        <span className="font-semibold">{deviceStats.desktop} ({Math.round((deviceStats.desktop / votes.length) * 100)}%)</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1"><Smartphone size={12} /> Mobile</span>
                                                        <span className="font-semibold">{deviceStats.mobile} ({Math.round((deviceStats.mobile / votes.length) * 100)}%)</span>
                                                    </div>
                                                    {deviceStats.tablet > 0 && (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span>Tablet</span>
                                                            <span className="font-semibold">{deviceStats.tablet}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Peak Hour */}
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={14} className="text-purple-500" />
                                                    <span className="text-xs font-medium text-slate-600">Peak Time</span>
                                                </div>
                                                {peakHour ? (
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-800">{formatHour(peakHour.hour)}</p>
                                                        <p className="text-xs text-slate-500">{peakHour.count} votes at peak</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400">Not enough data</p>
                                                )}
                                            </div>
                                            
                                            {/* Geographic */}
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Globe size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-medium text-slate-600">Top Locations</span>
                                                </div>
                                                {geoStats.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {geoStats.slice(0, 3).map(g => (
                                                            <div key={g.country} className="flex items-center justify-between text-xs">
                                                                <span className="flex items-center gap-1">
                                                                    {getCountryFlag(g.country)} {g.country.length > 12 ? g.country.slice(0, 12) + '...' : g.country}
                                                                </span>
                                                                <span className="font-semibold">{g.percentage}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400">No location data</p>
                                                )}
                                            </div>
                                            
                                            {/* Momentum */}
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap size={14} className="text-amber-500" />
                                                    <span className="text-xs font-medium text-slate-600">24h Activity</span>
                                                </div>
                                                {momentum ? (
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-800">{momentum.last24h} votes</p>
                                                        <p className={`text-xs ${momentum.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {momentum.change >= 0 ? '↑' : '↓'} {Math.abs(momentum.change)}% vs prev 24h
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400">Tracking activity...</p>
                                                )}
                                            </div>
                                            
                                            {/* Traffic Sources */}
                                            <div className="bg-slate-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ExternalLink size={14} className="text-purple-500" />
                                                    <span className="text-xs font-medium text-slate-600">Traffic Sources</span>
                                                </div>
                                                {referrerStats.length > 0 && referrerStats.some(r => r.source !== 'Direct') ? (
                                                    <div className="space-y-1">
                                                        {referrerStats.slice(0, 3).map(r => (
                                                            <div key={r.source} className="flex items-center justify-between text-xs">
                                                                <span className="truncate max-w-[100px]" title={r.source}>
                                                                    {r.source === 'Direct' ? '🔗 Direct' : r.source}
                                                                </span>
                                                                <span className="font-semibold">{r.percentage}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400">Mostly direct traffic</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Response Timeline */}
                                        {timelineStats.length > 1 && (
                                            <div className="px-4 pb-4">
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <TrendingUp size={14} className="text-indigo-500" />
                                                        <span className="text-xs font-medium text-slate-600">Response Timeline</span>
                                                    </div>
                                                    <div className="flex items-end gap-1 h-16">
                                                        {timelineStats.map((t, i) => {
                                                            const maxCount = Math.max(...timelineStats.map(s => s.count));
                                                            const height = maxCount > 0 ? (t.count / maxCount) * 100 : 0;
                                                            return (
                                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                                    <motion.div 
                                                                        className="w-full bg-indigo-400 rounded-t transition-all hover:bg-indigo-500"
                                                                        initial={{ height: 0 }}
                                                                        animate={{ height: `${Math.max(height, 4)}%` }}
                                                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                                                        title={`${t.day}: ${t.count} votes`}
                                                                    />
                                                                    <span className="text-[9px] text-slate-400 truncate max-w-full">{t.day.split(' ')[1]}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Hourly Distribution */}
                                        {hourlyStats.some(h => h.count > 0) && (
                                            <div className="px-4 pb-4">
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Clock size={14} className="text-purple-500" />
                                                        <span className="text-xs font-medium text-slate-600">Voting by Hour</span>
                                                    </div>
                                                    <div className="flex items-end gap-px h-12">
                                                        {hourlyStats.map((h, i) => {
                                                            const maxCount = Math.max(...hourlyStats.map(s => s.count));
                                                            const height = maxCount > 0 ? (h.count / maxCount) * 100 : 0;
                                                            return (
                                                                <motion.div 
                                                                    key={i} 
                                                                    className="flex-1 bg-purple-300 rounded-t transition-colors hover:bg-purple-400 cursor-pointer"
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${Math.max(height, 2)}%` }}
                                                                    transition={{ delay: i * 0.02, duration: 0.3 }}
                                                                    style={{ opacity: height > 0 ? 1 : 0.3 }}
                                                                    title={`${formatHour(h.hour)}: ${h.count} votes`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-[9px] text-slate-400">12 AM</span>
                                                        <span className="text-[9px] text-slate-400">12 PM</span>
                                                        <span className="text-[9px] text-slate-400">11 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </>
            )}
            
            <div className="flex flex-wrap justify-end gap-2 print:hidden">
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm overflow-x-auto max-w-full">
                    {isMatrix && (
                         <button onClick={() => setViewMode('matrix')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'matrix' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <LayoutGrid size={16} /> Matrix
                        </button>
                    )}

                    {isPairwise && (
                         <button onClick={() => setViewMode('pairwise')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'pairwise' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <GitCompare size={16} /> Leaderboard
                        </button>
                    )}

                    {isRating && (
                         <button onClick={() => setViewMode('rating')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'rating' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <SlidersHorizontal size={16} /> Averages
                        </button>
                    )}
                    
                    {!isPairwise && !isRating && (
                         <button onClick={() => setViewMode('bar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'bar' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <BarChart size={16} /> Bar
                        </button>
                    )}
                    
                    {isRanked && (
                        <button onClick={() => setViewMode('flow')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'flow' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <GitMerge size={16} /> Flow Chart
                        </button>
                    )}

                    {isMeeting && (
                        <button onClick={() => setViewMode('heatmap')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'heatmap' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <Calendar size={16} /> Heatmap
                        </button>
                    )}

                    {!isPairwise && !isRating && (
                     <button onClick={() => setViewMode('pie')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'pie' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <PieChart size={16} /> Pie
                    </button>
                    )}

                    <button onClick={() => setViewMode('velocity')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'velocity' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <Activity size={16} /> Velocity
                    </button>
                    
                    {/* Geography - Premium only */}
                    {isPaidUser ? (
                        <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <MapIcon size={16} /> Geography
                        </button>
                    ) : (
                        <button 
                            onClick={() => setViewMode('map')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-50 whitespace-nowrap"
                            title="Upgrade to Pro for Geography view"
                        >
                            <MapIcon size={16} /> Geography
                            <Lock size={12} className="text-slate-400" />
                        </button>
                    )}

                    {/* Grid - Premium only */}
                    {isPaidUser ? (
                        <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <LayoutGrid size={16} /> Grid
                        </button>
                    ) : (
                        <button 
                            onClick={() => setViewMode('grid')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-50 whitespace-nowrap"
                            title="Upgrade to Pro for Grid view"
                        >
                            <LayoutGrid size={16} /> Grid
                            <Lock size={12} className="text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Download Chart as PNG */}
                <button
                    disabled={isExportingPng}
                    onClick={async () => {
                        setIsExportingPng(true);
                        
                        // Small delay to ensure any animations complete
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        const chartEl = document.getElementById('poll-results-chart');
                        if (!chartEl) {
                            alert('Chart not found. Please try again.');
                            setIsExportingPng(false);
                            return;
                        }
                        
                        try {
                            // Load html2canvas from CDN if not already loaded
                            if (!(window as any).html2canvas) {
                                await new Promise<void>((resolve, reject) => {
                                    const script = document.createElement('script');
                                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                                    script.onload = () => resolve();
                                    script.onerror = () => reject(new Error('Failed to load library'));
                                    document.head.appendChild(script);
                                });
                            }
                            
                            const html2canvas = (window as any).html2canvas;
                            const canvas = await html2canvas(chartEl, {
                                backgroundColor: '#ffffff',
                                scale: 2,
                                logging: false,
                                useCORS: true,
                                allowTaint: true
                            });
                            
                            const link = document.createElement('a');
                            link.download = `${poll.title.replace(/[^a-z0-9]/gi, '_')}_chart.png`;
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                        } catch (error) {
                            console.error('Failed to export chart:', error);
                            alert('Failed to export chart. Please try again.');
                        } finally {
                            setIsExportingPng(false);
                        }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                        isExportingPng 
                            ? 'bg-slate-100 text-slate-400 cursor-wait' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-md'
                    }`}
                    title="Download chart as PNG image"
                >
                    {isExportingPng ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Save PNG
                        </>
                    )}
                </button>
            </div>

            {/* Chart Container - for PNG export */}
            <div id="poll-results-chart" className="bg-white rounded-2xl p-4">
            
            <AnimatePresence mode="wait">
                {/* --- WINNER CARD --- */}
                {/* Show TIE banner when there's a tie */}
                {((viewMode === 'flow' || viewMode === 'bar' || viewMode === 'heatmap' || viewMode === 'pairwise' || viewMode === 'rating') && isTie && !isDot && !isMatrix && !isRanked) && (
                     <motion.div 
                        key="tie"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden print:border print:border-slate-300 print:bg-none print:text-black mb-6"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 print:hidden">
                            <Users size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="uppercase tracking-widest text-sm font-semibold text-amber-200 mb-2 print:text-slate-500">
                                It's a Tie!
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black font-serif mb-4">
                                {tiedOptions.length} options tied with {topVoteCount} vote{topVoteCount !== 1 ? 's' : ''} each
                            </h2>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {tiedOptions.map(([optId]) => (
                                    <span key={optId} className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                                        {getOptionText(optId)}
                                    </span>
                                ))}
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm print:bg-slate-100 print:text-slate-900 mt-4">
                                <Users size={18} />
                                <span className="font-semibold">{totalVotes} Total Voters</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Show WINNER banner when there's a clear winner (no tie) */}
                {((viewMode === 'flow' || viewMode === 'bar' || viewMode === 'heatmap' || viewMode === 'pairwise' || viewMode === 'rating') && activeWinnerId && !isDot && !isMatrix && !isTie) && (
                     <motion.div 
                        key="winner"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden print:border print:border-slate-300 print:bg-none print:text-black mb-6"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 print:hidden">
                            <Trophy size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="uppercase tracking-widest text-sm font-semibold text-indigo-200 mb-2 print:text-slate-500">
                                {isMeeting ? "Best Time Slot" : isBudget ? "Top Funded Feature" : "The Winner Is"}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black font-serif mb-4">
                                {getOptionText(activeWinnerId)}
                            </h2>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm print:bg-slate-100 print:text-slate-900">
                                <Users size={18} />
                                <span className="font-semibold">{totalVotes} Total Voters</span>
                            </div>
                            {isMeeting && meetingScoreData[activeWinnerId] !== undefined && (
                                <div className="mt-2 text-indigo-200 text-sm">
                                    Score: {meetingScoreData[activeWinnerId]} (Yes=1, Maybe=0.5)
                                </div>
                            )}
                            
                            {/* Calendar Integration - Meeting Polls Only */}
                            {isMeeting && activeWinnerId && (() => {
                                const duration = poll.meetingDuration || 60;
                                const durationLabel = duration < 60 ? `${duration} min` : duration === 60 ? '1 hour' : `${duration / 60} hours`;
                                const slotText = getOptionText(activeWinnerId);
                                
                                return (
                                    <div className="mt-6 print:hidden">
                                        <p className="text-indigo-200 text-xs mb-3 uppercase tracking-wide">
                                            Add to Calendar <span className="opacity-60">({durationLabel} meeting)</span>
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {/* Google Calendar */}
                                            {generateGoogleCalendarLink(slotText, slotText, poll.title, duration) && (
                                                <a
                                                    href={generateGoogleCalendarLink(slotText, slotText, poll.title, duration) || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition backdrop-blur-sm"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h4v2h-6V7h2v5z"/>
                                                    </svg>
                                                    Google
                                                </a>
                                            )}
                                            
                                            {/* Outlook Calendar */}
                                            {generateOutlookCalendarLink(slotText, slotText, poll.title, duration) && (
                                                <a
                                                    href={generateOutlookCalendarLink(slotText, slotText, poll.title, duration) || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition backdrop-blur-sm"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M21.5 3h-19C1.67 3 1 3.67 1 4.5v15c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zm-14 16H3V7h4.5v12zm7 0h-5V7h5v12zm5 0h-3.5V7H20v12z"/>
                                                    </svg>
                                                    Outlook
                                                </a>
                                            )}
                                            
                                            {/* Download .ics */}
                                            <button
                                                onClick={() => downloadICS(slotText, slotText, poll.title, duration)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition backdrop-blur-sm"
                                            >
                                                <Download size={16} />
                                                Download .ics
                                            </button>
                                        </div>
                                        <p className="text-indigo-300/60 text-xs mt-2">Works with Apple Calendar, Outlook Desktop & more</p>
                                    </div>
                                );
                            })()}
                            
                            {isPairwise && pairwiseScores && pairwiseScores[activeWinnerId] && (
                                <div className="mt-2 text-indigo-200 text-sm">
                                    Win Rate: {pairwiseScores[activeWinnerId].score.toFixed(1)}% ({pairwiseScores[activeWinnerId].wins} wins)
                                </div>
                            )}
                            {isRating && ratingStats && ratingStats[activeWinnerId] && (
                                <div className="mt-2 text-indigo-200 text-sm">
                                    Average Rating: {ratingStats[activeWinnerId].average.toFixed(1)} / 100
                                </div>
                            )}
                            {isBudget && budgetStats && budgetStats[activeWinnerId] && (
                                <div className="mt-2 text-indigo-200 text-sm flex items-center justify-center gap-1">
                                    <DollarSign size={16} />
                                    Total Value: ${(budgetStats[activeWinnerId].totalValue ?? 0).toLocaleString()} ({(budgetStats[activeWinnerId] as any).totalQuantity ?? budgetStats[activeWinnerId].purchaseCount ?? 0} purchased)
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- RATING VIEW --- */}
                {viewMode === 'rating' && ratingStats && (
                    <motion.div
                        key="rating"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <SlidersHorizontal size={24} className="text-indigo-500"/> Average Ratings
                            </h3>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="w-4 h-1 bg-black/20 rounded"></span> Error bars = Standard Deviation
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {Object.entries(ratingStats)
                                .sort(([, a], [, b]) => b.average - a.average)
                                .map(([id, stats], index) => {
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-slate-800 font-bold text-lg">
                                                        {getOptionText(id)}
                                                    </span>
                                                </div>
                                                <span className="text-slate-600 font-bold">
                                                    {stats.average.toFixed(1)} <span className="text-slate-400 font-normal text-xs ml-1">/ 100</span>
                                                </span>
                                            </div>
                                            <div className="relative h-8 bg-slate-100 rounded-lg mt-2 overflow-visible print:border print:border-slate-200">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stats.average}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`absolute top-0 left-0 h-full rounded-lg ${getBarColorClass(id)} opacity-90`}
                                                />
                                                {stats.count > 1 && typeof stats.stdDev === 'number' && (() => {
                                                    const stdDev = stats.stdDev || 0;
                                                    return (
                                                    <div 
                                                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-black/20 rounded-full"
                                                        style={{ 
                                                            left: `${Math.max(0, stats.average - stdDev)}%`, 
                                                            width: `${Math.min(100 - (stats.average - stdDev), stdDev * 2)}%`
                                                        }}
                                                    >
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3 bg-black/30"></div>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3 bg-black/30"></div>
                                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-black/40 rounded-full"></div>
                                                    </div>
                                                )})()}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 flex justify-between">
                                                <span>Std Dev: {(stats.stdDev || 0).toFixed(1)}</span>
                                                <span>{stats.count} votes</span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}

                {/* --- PAIRWISE VIEW --- */}
                {viewMode === 'pairwise' && pairwiseScores && (
                    <motion.div
                        key="pairwise"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <GitCompare size={24} className="text-indigo-500"/> Comparison Leaderboard
                        </h3>
                        
                        <div className="space-y-4">
                            {Object.entries(pairwiseScores)
                                .sort(([, a], [, b]) => b.score - a.score)
                                .map(([id, data], index) => {
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-slate-800 font-bold text-lg">
                                                        {getOptionText(id)}
                                                    </span>
                                                </div>
                                                <span className="text-slate-600 font-bold">
                                                    {data.score.toFixed(1)}% <span className="text-slate-400 font-normal text-xs ml-1">({data.wins} wins{data.matches ? ` / ${data.matches} matches` : ''})</span>
                                                </span>
                                            </div>
                                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-200">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${data.score}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${getBarColorClass(id)} opacity-90`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}

                {/* --- MATRIX VIEW --- */}
                {viewMode === 'matrix' && matrixAverages && (
                     <motion.div 
                        key="matrix"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <LayoutGrid size={24} className="text-indigo-500"/> Priority Matrix Results
                        </h3>
                        
                        <div className="relative aspect-square bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                                <div className="bg-emerald-50/50 flex items-start justify-start p-2"><span className="text-[10px] font-bold text-emerald-800 opacity-40 uppercase">Quick Wins</span></div>
                                <div className="bg-blue-50/50 flex items-start justify-end p-2"><span className="text-[10px] font-bold text-blue-800 opacity-40 uppercase">Major Projects</span></div>
                                <div className="bg-slate-50/50 flex items-end justify-start p-2"><span className="text-[10px] font-bold text-slate-500 opacity-40 uppercase">Fill Ins</span></div>
                                <div className="bg-red-50/50 flex items-end justify-end p-2"><span className="text-[10px] font-bold text-red-800 opacity-40 uppercase">Thankless Tasks</span></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-full h-px bg-slate-300"></div></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="h-full w-px bg-slate-300"></div></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-2 rounded backdrop-blur-sm">High Impact</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-2 rounded backdrop-blur-sm">Low Impact</div>
                            <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-2 rounded origin-center backdrop-blur-sm">Low Effort</div>
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 rotate-90 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-2 rounded origin-center backdrop-blur-sm">High Effort</div>
                             {Object.entries(matrixAverages).map(([id, coords]) => {
                                 const top = 100 - coords.y;
                                 return (
                                     <div key={id} className="absolute -ml-3 -mt-3 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-md flex items-center justify-center z-10 group cursor-help transition-all hover:scale-125 hover:z-20" style={{ left: `${coords.x}%`, top: `${top}%` }}>
                                         <span className="text-[10px] text-white font-bold">{poll.options.findIndex(o => o.id === id) + 1}</span>
                                         <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                                             {getOptionText(id)}
                                         </div>
                                     </div>
                                 )
                             })}
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-500">
                             {poll.options.map((opt, i) => (
                                 <div key={opt.id} className="flex items-center gap-2">
                                     <span className="w-4 h-4 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[9px]">{i + 1}</span>
                                     <span className="truncate">{opt.text}</span>
                                 </div>
                             ))}
                        </div>
                     </motion.div>
                )}

                {/* --- BAR VIEW (Standard for Dot/Multiple/Budget) --- */}
                {viewMode === 'bar' && (
                     <motion.div 
                        key="bar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`rounded-3xl shadow-xl p-6 md:p-8 print:shadow-none print:border-slate-300 ${
                            isDarkTheme 
                                ? 'bg-slate-900 border-2 border-slate-700' 
                                : theme.cardBg || 'bg-white border border-slate-100'
                        } ${getSpecialEffectClasses(theme.specialEffect)}`}
                        style={theme.specialEffect === 'glow' ? {
                            boxShadow: `0 0 40px ${theme.primary}25, 0 0 80px ${theme.primary}10`
                        } : undefined}
                    >
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                            <BarChart size={24} style={{ color: theme.primary }}/> 
                            {isRanked ? 'First Preference Votes' : isDot ? 'Points Distribution' : isBudget ? 'Value Allocated' : 'Vote Breakdown'}
                        </h3>
                        
                        <div className="space-y-4">
                            {Object.entries(barChartData)
                                .sort(([, a], [, b]) => b - a)
                                .map(([id, value], index) => {
                                    const denominator = isDot || isBudget ? Object.values(barChartData).reduce((a,b)=>a+b,0) : totalVotes;
                                    const percentage = denominator > 0 ? (value / denominator) * 100 : 0;
                                    
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <span className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>
                                                    {getOptionText(id)}
                                                </span>
                                                <span className={`font-bold ${isDarkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    {isBudget ? `$${value.toLocaleString()}` : value} {isDot ? 'pts' : ''} <span className={`font-normal text-xs ml-1 ${isDarkTheme ? 'text-slate-500' : 'text-slate-400'}`}>({percentage.toFixed(0)}%)</span>
                                                </span>
                                            </div>
                                            <div className={`h-6 rounded-lg overflow-hidden print:border print:border-slate-200 ${isDarkTheme ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-lg print:bg-slate-600"
                                                    style={{ 
                                                        backgroundColor: index === 0 ? theme.primary : theme.accent || theme.secondary,
                                                        opacity: 1 - (index * 0.1)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                     </motion.div>
                )}

                {/* --- FLOW CHART (SANKEY) VIEW --- */}
                {viewMode === 'flow' && isRanked && rounds.length > 0 && (
                    <motion.div 
                        key="flow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 overflow-x-auto"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <GitMerge size={24} className="text-indigo-500"/>
                            Vote Transfer Flow
                        </h3>
                        
                        <div className="min-w-[600px] h-[450px]">
                            {renderSankeySVG()}
                        </div>
                        
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Info size={16} className="text-indigo-500"/>
                            <span>
                                This diagram shows how votes from eliminated candidates (faded lines) are transferred to their next choice in subsequent rounds.
                            </span>
                        </div>
                    </motion.div>
                )}
                
                {/* --- HEATMAP VIEW (Meeting) --- */}
                {viewMode === 'heatmap' && (
                    <motion.div
                        key="heatmap"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8"
                    >
                         <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar size={24} className="text-indigo-500"/> Availability Heatmap
                        </h3>
                        {isMeeting && <p className="text-sm text-slate-500 mb-4">Intensity based on: Yes = 1, Maybe = 0.5</p>}
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(meetingScoreData).map(([id, score]) => {
                                const intensity = score / maxHeat;
                                return (
                                    <div key={id} className="relative group overflow-hidden rounded-xl border border-slate-100 aspect-video flex flex-col items-center justify-center p-4 text-center transition-all hover:scale-105"
                                         style={{ backgroundColor: `rgba(16, 185, 129, ${0.05 + (intensity * 0.4)})` }}>
                                        <div className="font-bold text-slate-800 mb-1 leading-tight">{getOptionText(id)}</div>
                                        <div className="text-2xl font-black text-emerald-600">{score}</div>
                                        <div className="text-xs text-emerald-400 font-bold uppercase tracking-wide">Score</div>
                                        {/* Intensity Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-100">
                                            <div className="h-full bg-emerald-500" style={{ width: `${(score / (totalVotes || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}

                {/* --- PIE CHART VIEW --- */}
                {viewMode === 'pie' && (
                     <motion.div
                        key="pie"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 justify-center min-h-[400px]"
                    >
                         <motion.div 
                            className="relative w-64 h-64 shrink-0"
                            initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                         >
                             {/* SVG Pie Chart for better PNG export */}
                             <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                 {pieData.map((d, i) => {
                                     const startAngle = d.startAngle * (Math.PI / 180);
                                     const endAngle = (d.startAngle + d.angle) * (Math.PI / 180);
                                     const largeArcFlag = d.angle > 180 ? 1 : 0;
                                     const x1 = 50 + 48 * Math.cos(startAngle);
                                     const y1 = 50 + 48 * Math.sin(startAngle);
                                     const x2 = 50 + 48 * Math.cos(endAngle);
                                     const y2 = 50 + 48 * Math.sin(endAngle);
                                     
                                     // Handle full circle case
                                     if (d.angle >= 359.9) {
                                         return (
                                             <circle
                                                 key={d.id}
                                                 cx="50"
                                                 cy="50"
                                                 r="48"
                                                 fill={d.color}
                                                 stroke="#fff"
                                                 strokeWidth="1"
                                             />
                                         );
                                     }
                                     
                                     const pathData = `M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                                     return (
                                         <path
                                             key={d.id}
                                             d={pathData}
                                             fill={d.color}
                                             stroke="#fff"
                                             strokeWidth="1"
                                         />
                                     );
                                 })}
                             </svg>
                             <motion.div 
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                             >
                                 <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-600 text-lg">
                                     {isDot || isBudget ? <Coins size={24} /> : totalVotes}
                                 </div>
                             </motion.div>
                         </motion.div>
                         
                         <div className="flex-1 w-full max-w-sm">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                                 {isRanked ? 'First Preference Distribution' : isDot || isBudget ? 'Value Share' : 'Vote Distribution'}
                             </h3>
                             <div className="space-y-3">
                                 {pieData.map((d, i) => (
                                     <motion.div 
                                        key={d.id} 
                                        className="flex items-center justify-between group"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1), duration: 0.3 }}
                                     >
                                         <div className="flex items-center gap-3">
                                             <motion.div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: d.color }}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.4 + (i * 0.1), type: "spring" }}
                                             />
                                             <span className="font-medium text-slate-700">{getOptionText(d.id)}</span>
                                         </div>
                                         <div className="text-sm font-bold text-slate-500">
                                             {d.percentage.toFixed(1)}%
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                         </div>
                    </motion.div>
                )}

                {/* --- VELOCITY VIEW (Timeline) --- */}
                {viewMode === 'velocity' && (
                    <motion.div
                        key="velocity"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={24} className="text-indigo-500"/> Vote Timeline
                        </h3>
                        
                        {votes.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <Activity size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No votes recorded yet</p>
                                </div>
                            </div>
                        ) : votes.length < 3 ? (
                            /* Timeline view for few votes */
                            <div className="space-y-4">
                                <p className="text-sm text-slate-500 mb-4">Vote activity timeline:</p>
                                {[...votes].sort((a: any, b: any) => getVoteTime(a) - getVoteTime(b)).map((vote: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                        <div className="flex-1 h-0.5 bg-indigo-200"></div>
                                        <div className="bg-indigo-50 px-4 py-2 rounded-lg text-center min-w-[140px]">
                                            <span className="text-sm font-medium text-indigo-700 block">
                                                {new Date(getVoteTime(vote)).toLocaleString([], { 
                                                    month: 'short', day: 'numeric', 
                                                    hour: '2-digit', minute: '2-digit' 
                                                })}
                                            </span>
                                            {vote.analytics?.country && (
                                                <span className="text-xs text-slate-500">
                                                    {getCountryFlag(getCountryName(vote.analytics.country))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600">
                                        <strong>{votes.length}</strong> vote{votes.length !== 1 ? 's' : ''} total
                                        {votes.length > 0 && (
                                            <span className="text-slate-400 ml-2">
                                                • First: {new Date(getVoteTime([...votes].sort((a: any, b: any) => getVoteTime(a) - getVoteTime(b))[0])).toLocaleDateString()}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Bar chart for more votes */
                            <>
                                <div className="h-64 flex items-end gap-2 border-b border-l border-slate-200 p-4 relative">
                                    {velocityData.map((d, i) => {
                                        const maxVal = Math.max(...velocityData.map(v => v.count), 1);
                                        const height = Math.max((d.count / maxVal) * 100, d.count > 0 ? 10 : 0);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                                                <motion.div 
                                                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-700 hover:to-indigo-500 rounded-t-md transition-colors cursor-pointer shadow-sm"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 0.5, delay: i * 0.02, ease: "easeOut" }}
                                                    style={{ minHeight: d.count > 0 ? '8px' : '0' }}
                                                >
                                                    {d.count > 0 && (
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-lg">
                                                            <strong>{d.count}</strong> vote{d.count !== 1 ? 's' : ''}<br/>
                                                            {d.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
                                    <span>{velocityData[0]?.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    <span className="text-slate-500 font-medium">{votes.length} total votes</span>
                                    <span>{velocityData[velocityData.length - 1]?.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {/* --- MAP VIEW (Geography) --- */}
                {viewMode === 'map' && (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
                    >
                        {/* Free user upgrade prompt */}
                        {isFreeUser ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MapIcon size={32} className="text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Geographic Insights</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    See where your voters are located with detailed country breakdowns, flags, and percentage distribution.
                                </p>
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 max-w-sm mx-auto border border-indigo-100">
                                    <div className="flex items-center justify-center gap-3 text-slate-600 mb-4">
                                        <span className="text-2xl">🇺🇸</span>
                                        <span className="text-2xl">🇬🇧</span>
                                        <span className="text-2xl">🇨🇦</span>
                                        <span className="text-2xl">🇦🇺</span>
                                        <span className="text-slate-400">...</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">Unlock voter location data</p>
                                    <a 
                                        href="/#pricing" 
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-200"
                                    >
                                        <Crown size={18} />
                                        Upgrade to Pro
                                    </a>
                                </div>
                            </div>
                        ) : (
                        <>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <MapIcon size={24} className="text-indigo-500"/> Voter Geography
                            </h3>
                        </div>
                        
                        {(() => {
                            // Aggregate country data from votes with analytics
                            const countryCounts: Record<string, number> = {};
                            let votesWithLocation = 0;
                            
                            (votes || []).forEach((v: any) => {
                                const countryCode = v.analytics?.country;
                                if (countryCode) {
                                    const countryName = getCountryName(countryCode);
                                    countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
                                    votesWithLocation++;
                                }
                            });
                            
                            const sortedCountries = Object.entries(countryCounts)
                                .sort((a, b) => b[1] - a[1]);
                            
                            const totalWithLocation = votesWithLocation || 1;
                            const countryCount = Object.keys(countryCounts).length;
                            
                            if (sortedCountries.length === 0) {
                                return (
                                    <div className="text-center py-12">
                                        <MapIcon size={48} className="text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">No location data yet</p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {votes.length > 0 
                                                ? `${votes.length} vote${votes.length !== 1 ? 's' : ''} recorded, but no geo data attached`
                                                : 'Geographic data will appear as votes come in'
                                            }
                                        </p>
                                    </div>
                                );
                            }
                            
                            return (
                                <>
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <motion.div 
                                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center"
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <motion.div 
                                                className="text-3xl font-black text-indigo-600"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {countryCount}
                                            </motion.div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                                                {countryCount === 1 ? 'Country' : 'Countries'} Represented
                                            </div>
                                        </motion.div>
                                        <motion.div 
                                            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center"
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                        >
                                            <motion.div 
                                                className="text-3xl font-black text-emerald-600"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {votesWithLocation}
                                            </motion.div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                                                Vote{votesWithLocation !== 1 ? 's' : ''} Tracked
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Country list with flags */}
                                    <div className="space-y-3">
                                        {sortedCountries.map(([country, count], idx) => {
                                            const percentage = Math.round((count / totalWithLocation) * 100);
                                            const flag = getCountryFlag(country);
                                            return (
                                                <motion.div 
                                                    key={country} 
                                                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${idx === 0 ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                                >
                                                    <motion.span 
                                                        className="text-3xl"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: idx * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                                    >
                                                        {flag}
                                                    </motion.span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`font-semibold ${idx === 0 ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                                {country}
                                                                {idx === 0 && <span className="ml-2 text-xs bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">Top</span>}
                                                            </span>
                                                            <span className="text-sm text-slate-500 font-medium">
                                                                {count} vote{count !== 1 ? 's' : ''} • {percentage}%
                                                            </span>
                                                        </div>
                                                        <div className="bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                                            <motion.div 
                                                                className={`h-full rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-400'}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ delay: idx * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Info size={12} />
                                            Location data by ipinfo.io
                                        </span>
                                        <span>IP addresses are never stored</span>
                                    </div>
                                </>
                            );
                        })()}
                        </>
                        )}
                    </motion.div>
                )}

                {/* --- GRID / TABLE VIEW --- */}
                {viewMode === 'grid' && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Free user upgrade prompt */}
                        {isFreeUser ? (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LayoutGrid size={32} className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Detailed Vote Grid</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    See every individual vote in a detailed table view with timestamps, locations, devices, and selected options.
                                </p>
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 max-w-md mx-auto border border-emerald-100">
                                    {/* Preview table */}
                                    <div className="overflow-hidden rounded-lg border border-slate-200 mb-4">
                                        <table className="w-full text-xs">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="p-2 text-left text-slate-500">#</th>
                                                    <th className="p-2 text-center text-slate-500">🌍</th>
                                                    <th className="p-2 text-center text-slate-500">📱</th>
                                                    <th className="p-2 text-slate-500">Choice</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-400">
                                                <tr className="border-t border-slate-100">
                                                    <td className="p-2">1</td>
                                                    <td className="p-2 text-center">🇺🇸</td>
                                                    <td className="p-2 text-center">💻</td>
                                                    <td className="p-2">✓</td>
                                                </tr>
                                                <tr className="border-t border-slate-100 opacity-50">
                                                    <td className="p-2">2</td>
                                                    <td className="p-2 text-center">🇬🇧</td>
                                                    <td className="p-2 text-center">📱</td>
                                                    <td className="p-2">✓</td>
                                                </tr>
                                                <tr className="border-t border-slate-100 opacity-30">
                                                    <td className="p-2">...</td>
                                                    <td className="p-2 text-center">...</td>
                                                    <td className="p-2 text-center">...</td>
                                                    <td className="p-2">...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <a 
                                        href="/#pricing" 
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200"
                                    >
                                        <Crown size={18} />
                                        Upgrade to Pro
                                    </a>
                                </div>
                            </div>
                        ) : (
                        <>
                        {/* Main Table */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                            <th className="p-4 font-bold text-slate-700 min-w-[140px] sticky left-0 bg-slate-50">#</th>
                                            <th className="p-4 font-bold text-slate-700 min-w-[80px] text-center border-l border-slate-200">🌍</th>
                                            <th className="p-4 font-bold text-slate-700 min-w-[80px] text-center border-l border-slate-200">📱</th>
                                            {poll.options.map((opt, idx) => (
                                                <th key={opt.id} className="p-4 font-bold text-slate-700 min-w-[100px] text-center border-l border-slate-200">
                                                    <span className="inline-block w-6 h-6 rounded-full mr-1 align-middle" style={{ backgroundColor: `hsl(${idx * 360 / poll.options.length}, 70%, 80%)` }}></span>
                                                    <span className="text-xs">{opt.text.length > 12 ? opt.text.substring(0, 12) + '...' : opt.text}</span>
                                                </th>
                                            ))}
                                            <th className="p-4 font-bold text-slate-700 min-w-[150px] border-l border-slate-200">💬</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {votes.slice(0, 50).map((vote: any, i: number) => {
                                            const voteChoices = vote.choices || vote.selectedOptionIds || vote.rankedOptionIds || [];
                                            const countryCode = vote.analytics?.country;
                                            const device = vote.analytics?.device;
                                            
                                            return (
                                                <motion.tr 
                                                    key={i} 
                                                    className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.03, duration: 0.3 }}
                                                >
                                                    <td className="p-3 font-medium text-slate-600 sticky left-0 bg-inherit border-r border-slate-100">
                                                        <span className="text-slate-400 text-xs">#{i + 1}</span>
                                                        <div className="text-xs text-slate-400">{new Date(getVoteTime(vote)).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="p-3 text-center border-l border-slate-100">
                                                        {countryCode ? (
                                                            <span title={getCountryName(countryCode)} className="text-lg">
                                                                {getCountryFlag(getCountryName(countryCode))}
                                                            </span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    <td className="p-3 text-center border-l border-slate-100">
                                                        {device === 'mobile' ? '📱' : device === 'desktop' ? '💻' : device === 'tablet' ? '📲' : <span className="text-slate-300">-</span>}
                                                    </td>
                                                    {poll.options.map((opt, idx) => {
                                                        let cellContent = <span className="text-slate-200">-</span>;
                                                        const bgColor = `hsl(${idx * 360 / poll.options.length}, 70%, 95%)`;
                                                        const textColor = `hsl(${idx * 360 / poll.options.length}, 70%, 35%)`;
                                                        
                                                        if (isMatrix && vote.matrixVotes) {
                                                            const pos = vote.matrixVotes[opt.id];
                                                            if (pos) {
                                                                cellContent = <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: bgColor, color: textColor }}>({Math.round(pos.x)},{Math.round(pos.y)})</span>;
                                                            }
                                                        } else if (isPairwise && vote.pairwiseVotes) {
                                                            const voterWins = vote.pairwiseVotes.filter((p: any) => p.winnerId === opt.id).length;
                                                            if (voterWins > 0) {
                                                                cellContent = <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: bgColor, color: textColor }}>{voterWins}W</span>;
                                                            }
                                                        } else if (isRating && vote.ratingVotes) {
                                                            const val = vote.ratingVotes[opt.id];
                                                            if (val !== undefined) {
                                                                cellContent = <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: bgColor, color: textColor }}>{val}</span>;
                                                            }
                                                        } else if (isRanked) {
                                                            const rank = voteChoices.indexOf(opt.id);
                                                            if (rank !== -1) {
                                                                cellContent = <span className="font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto text-xs" style={{ backgroundColor: bgColor, color: textColor }}>{rank + 1}</span>;
                                                            }
                                                        } else if (isDot || isBudget) {
                                                            const dots = voteChoices.filter((c: string) => c === opt.id).length;
                                                            if (dots > 0) {
                                                                cellContent = <span className="font-bold px-2 py-1 rounded-full text-xs" style={{ backgroundColor: bgColor, color: textColor }}>{dots}</span>;
                                                            }
                                                        } else if (isMeeting) {
                                                            if (voteChoices.includes(opt.id)) {
                                                                cellContent = <span className="inline-flex items-center justify-center text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">✓</span>;
                                                            } else if (vote.choicesMaybe?.includes(opt.id)) {
                                                                cellContent = <span className="inline-flex items-center justify-center text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-xs">?</span>;
                                                            }
                                                        } else {
                                                            if (voteChoices.includes(opt.id)) {
                                                                cellContent = <span className="inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-xs" style={{ backgroundColor: bgColor, color: textColor }}>✓</span>;
                                                            }
                                                        }
                                                        
                                                        return (
                                                            <td key={opt.id} className="p-3 text-center border-l border-slate-100">
                                                                {cellContent}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="p-3 text-slate-500 border-l border-slate-100 text-xs max-w-[150px] truncate" title={vote.comment || ''}>
                                                        {vote.comment ? `"${vote.comment.substring(0, 30)}${vote.comment.length > 30 ? '...' : ''}"` : ''}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                        {votes.length > 50 && (
                                            <tr>
                                                <td colSpan={poll.options.length + 4} className="p-4 text-center text-slate-500 bg-slate-50">
                                                    Showing first 50 of {votes.length} votes. Export CSV for full data.
                                                </td>
                                            </tr>
                                        )}
                                        {votes.length === 0 && (
                                            <tr>
                                                <td colSpan={poll.options.length + 4} className="p-8 text-center text-slate-400 italic">
                                                    No votes recorded yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </>
                        )}
                    </motion.div>
                )}
                
                {/* ============================================ */}
                {/* POLL INSIGHTS SECTION - PAID ONLY */}
                {/* ============================================ */}
                {votes.length > 0 && isPaidUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                    >
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-indigo-500" /> Poll Insights
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                    tier === 'business' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {tier === 'business' ? 'Business' : 'Pro'}
                                </span>
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    
                                    {/* Consensus Level */}
                                    {(() => {
                                        const choiceCounts: Record<string, number> = {};
                                        votes.forEach((v: any) => {
                                            const choices = v.choices || v.selectedOptionIds || [];
                                            choices.forEach((c: string) => {
                                                choiceCounts[c] = (choiceCounts[c] || 0) + 1;
                                            });
                                        });
                                        const sorted = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1]);
                                        if (sorted.length === 0) return null;
                                        
                                        // Check for tie at the top
                                        const topCount = sorted[0][1];
                                        const tiedAtTop = sorted.filter(([_, count]) => count === topCount).length;
                                        const totalChoices = Object.values(choiceCounts).reduce((a, b) => a + b, 0);
                                        
                                        // If there's a tie at the top, it's split
                                        if (tiedAtTop > 1) {
                                            return (
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">⚖️</span>
                                                        <span className="font-medium text-slate-700">Consensus</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                        <strong className="text-amber-600">Tied</strong> ({tiedAtTop} options equal)
                                                    </p>
                                                </div>
                                            );
                                        }
                                        
                                        const consensusPct = Math.round((topCount / totalChoices) * 100);
                                        const consensusLevel = consensusPct >= 70 ? 'Strong' : consensusPct > 50 ? 'Moderate' : 'Split';
                                        const consensusColor = consensusPct >= 70 ? 'text-emerald-600' : consensusPct > 50 ? 'text-amber-600' : 'text-red-500';
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">🎯</span>
                                                    <span className="font-medium text-slate-700">Consensus</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    <strong className={consensusColor}>{consensusLevel}</strong> ({consensusPct}% agreement)
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Device preference */}
                                    {(() => {
                                        const deviceCounts: Record<string, number> = {};
                                        votes.forEach((v: any) => {
                                            const device = v.analytics?.device;
                                            if (device) deviceCounts[device] = (deviceCounts[device] || 0) + 1;
                                        });
                                        const topDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0];
                                        if (!topDevice) return null;
                                        const icon = topDevice[0] === 'mobile' ? '📱' : topDevice[0] === 'desktop' ? '💻' : '📲';
                                        const pct = Math.round((topDevice[1] / votes.length) * 100);
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{icon}</span>
                                                    <span className="font-medium text-slate-700">Top Device</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    <strong className="text-indigo-600">{topDevice[0].charAt(0).toUpperCase() + topDevice[0].slice(1)}</strong> ({pct}%)
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Voting Velocity */}
                                    {(() => {
                                        if (votes.length < 2) return null;
                                        const timestamps = votes.map((v: any) => getVoteTime(v)).filter(Boolean).sort((a, b) => a - b);
                                        if (timestamps.length < 2) return null;
                                        const firstVote = timestamps[0];
                                        const lastVote = timestamps[timestamps.length - 1];
                                        const durationHrs = (lastVote - firstVote) / (1000 * 60 * 60);
                                        if (durationHrs < 0.1) return null;
                                        const votesPerHour = (votes.length / durationHrs).toFixed(1);
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">⚡</span>
                                                    <span className="font-medium text-slate-700">Velocity</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    <strong className="text-indigo-600">{votesPerHour}</strong> votes/hour avg
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Geographic Reach */}
                                    {(() => {
                                        const countries = new Set<string>();
                                        votes.forEach((v: any) => {
                                            if (v.analytics?.country) countries.add(v.analytics.country);
                                        });
                                        if (countries.size === 0) return null;
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">🌍</span>
                                                    <span className="font-medium text-slate-700">Reach</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    <strong className="text-indigo-600">{countries.size}</strong> {countries.size === 1 ? 'country' : 'countries'}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Top choice by top country */}
                                    {(() => {
                                        const countryChoices: Record<string, Record<string, number>> = {};
                                        votes.forEach((v: any) => {
                                            const country = v.analytics?.country;
                                            if (!country) return;
                                            const countryName = getCountryName(country);
                                            if (!countryChoices[countryName]) countryChoices[countryName] = {};
                                            const choices = v.choices || v.selectedOptionIds || [];
                                            choices.forEach((c: string) => {
                                                countryChoices[countryName][c] = (countryChoices[countryName][c] || 0) + 1;
                                            });
                                        });
                                        
                                        // Get top country
                                        const countryCounts: Record<string, number> = {};
                                        votes.forEach((v: any) => {
                                            if (v.analytics?.country) {
                                                const name = getCountryName(v.analytics.country);
                                                countryCounts[name] = (countryCounts[name] || 0) + 1;
                                            }
                                        });
                                        const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];
                                        if (!topCountry) return null;
                                        
                                        const choices = countryChoices[topCountry[0]];
                                        const sortedChoices = Object.entries(choices || {}).sort((a, b) => b[1] - a[1]);
                                        if (sortedChoices.length === 0) return null;
                                        
                                        const topChoice = sortedChoices[0];
                                        // Check for tie
                                        const tiedChoices = sortedChoices.filter(([_, count]) => count === topChoice[1]);
                                        
                                        if (tiedChoices.length > 1) {
                                            return (
                                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">{getCountryFlag(topCountry[0])}</span>
                                                        <span className="font-medium text-slate-700">{topCountry[0]}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">
                                                        <strong className="text-amber-600">Split</strong> ({tiedChoices.length} options tied)
                                                    </p>
                                                </div>
                                            );
                                        }
                                        
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{getCountryFlag(topCountry[0])}</span>
                                                    <span className="font-medium text-slate-700">{topCountry[0]}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    Prefers: <strong className="text-indigo-600">{getOptionText(topChoice[0])}</strong>
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* Mobile vs Desktop choice difference */}
                                    {(() => {
                                        const mobileChoices: Record<string, number> = {};
                                        const desktopChoices: Record<string, number> = {};
                                        let mobileCount = 0, desktopCount = 0;
                                        
                                        votes.forEach((v: any) => {
                                            const device = v.analytics?.device;
                                            const choices = v.choices || v.selectedOptionIds || [];
                                            if (device === 'mobile') {
                                                mobileCount++;
                                                choices.forEach((c: string) => {
                                                    mobileChoices[c] = (mobileChoices[c] || 0) + 1;
                                                });
                                            } else if (device === 'desktop') {
                                                desktopCount++;
                                                choices.forEach((c: string) => {
                                                    desktopChoices[c] = (desktopChoices[c] || 0) + 1;
                                                });
                                            }
                                        });
                                        
                                        if (mobileCount < 2 || desktopCount < 2) return null;
                                        
                                        const topMobile = Object.entries(mobileChoices).sort((a, b) => b[1] - a[1])[0];
                                        const topDesktop = Object.entries(desktopChoices).sort((a, b) => b[1] - a[1])[0];
                                        
                                        if (!topMobile || !topDesktop || topMobile[0] === topDesktop[0]) return null;
                                        
                                        return (
                                            <div className="bg-white rounded-xl p-4 shadow-sm col-span-2">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">📊</span>
                                                    <span className="font-medium text-slate-700">Device Preference Split</span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    📱 Mobile prefers <strong className="text-blue-600">{getOptionText(topMobile[0])}</strong> • 
                                                    💻 Desktop prefers <strong className="text-green-600">{getOptionText(topDesktop[0])}</strong>
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* ========================================= */}
                                    {/* TYPE-SPECIFIC INSIGHTS */}
                                    {/* ========================================= */}
                                    
                                    {/* RANKED CHOICE: Vote Transfer Analysis */}
                                    {isRanked && rounds && rounds.length > 1 && (() => {
                                        // Find who got the most transferred votes
                                        const transferGains: Record<string, number> = {};
                                        for (let i = 1; i < rounds.length; i++) {
                                            const prevCounts: Record<string, number> = rounds[i - 1].counts || {};
                                            const currCounts: Record<string, number> = rounds[i].counts || {};
                                            Object.keys(currCounts).forEach(optId => {
                                                const gain = (currCounts[optId] || 0) - (prevCounts[optId] || 0);
                                                if (gain > 0) {
                                                    transferGains[optId] = (transferGains[optId] || 0) + gain;
                                                }
                                            });
                                        }
                                        
                                        const topGainer = Object.entries(transferGains).sort((a, b) => b[1] - a[1])[0];
                                        if (!topGainer || topGainer[1] === 0) return null;
                                        
                                        // Find who got eliminated first
                                        const eliminated = rounds.length > 1 ? rounds[0].eliminatedId : null;
                                        
                                        return (
                                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 shadow-sm col-span-2 border border-purple-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">🔄</span>
                                                    <span className="font-medium text-purple-700">Ranked Choice Analysis</span>
                                                </div>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    <p>
                                                        <strong className="text-purple-600">{getOptionText(topGainer[0])}</strong> gained the most transferred votes (+{topGainer[1]})
                                                    </p>
                                                    {eliminated && (
                                                        <p className="text-slate-500">
                                                            First eliminated: {getOptionText(eliminated)}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-purple-500 mt-2">
                                                        {rounds.length} rounds needed to determine winner
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* RATING SCALE: Standard Deviation & Consensus */}
                                    {isRating && ratingStats && (() => {
                                        // Calculate overall stats
                                        const allRatings: number[] = [];
                                        const optionStats: Array<{ id: string; avg: number; stdDev: number }> = [];
                                        
                                        Object.entries(ratingStats).forEach(([optId, stats]: [string, any]) => {
                                            if (stats.ratings && stats.ratings.length > 0) {
                                                allRatings.push(...stats.ratings);
                                                const avg = stats.ratings.reduce((a: number, b: number) => a + b, 0) / stats.ratings.length;
                                                const variance = stats.ratings.reduce((sum: number, r: number) => sum + Math.pow(r - avg, 2), 0) / stats.ratings.length;
                                                const stdDev = Math.sqrt(variance);
                                                optionStats.push({ id: optId, avg, stdDev });
                                            }
                                        });
                                        
                                        if (optionStats.length === 0) return null;
                                        
                                        // Find most controversial (highest std dev) and most agreed upon (lowest std dev)
                                        const sorted = [...optionStats].sort((a, b) => a.stdDev - b.stdDev);
                                        const mostAgreed = sorted[0];
                                        const mostControversial = sorted[sorted.length - 1];
                                        
                                        // Overall consensus level
                                        const avgStdDev = optionStats.reduce((sum, o) => sum + o.stdDev, 0) / optionStats.length;
                                        const consensusLevel = avgStdDev < 1 ? 'High' : avgStdDev < 2 ? 'Moderate' : 'Low';
                                        const consensusColor = avgStdDev < 1 ? 'text-emerald-600' : avgStdDev < 2 ? 'text-amber-600' : 'text-red-500';
                                        
                                        return (
                                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 shadow-sm col-span-2 border border-cyan-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">⭐</span>
                                                    <span className="font-medium text-cyan-700">Rating Analysis</span>
                                                </div>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    <p>
                                                        Overall consensus: <strong className={consensusColor}>{consensusLevel}</strong>
                                                    </p>
                                                    {mostAgreed && mostControversial && mostAgreed.id !== mostControversial.id && (
                                                        <>
                                                            <p>
                                                                Most agreed on: <strong className="text-emerald-600">{getOptionText(mostAgreed.id)}</strong>
                                                                <span className="text-slate-400 ml-1">(avg {mostAgreed.avg.toFixed(1)})</span>
                                                            </p>
                                                            <p>
                                                                Most divisive: <strong className="text-amber-600">{getOptionText(mostControversial.id)}</strong>
                                                                <span className="text-slate-400 ml-1">(opinions vary widely)</span>
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* MEETING POLL: Availability Summary */}
                                    {isMeeting && (() => {
                                        // Calculate availability percentages
                                        const availability: Array<{ id: string; yesCount: number; maybeCount: number; score: number }> = [];
                                        
                                        poll.options.forEach(opt => {
                                            let yesCount = 0;
                                            let maybeCount = 0;
                                            votes.forEach((v: any) => {
                                                const choices = v.choices || v.selectedOptionIds || [];
                                                const maybes = v.choicesMaybe || [];
                                                if (choices.includes(opt.id)) yesCount++;
                                                if (maybes.includes(opt.id)) maybeCount++;
                                            });
                                            const score = yesCount + (maybeCount * 0.5);
                                            availability.push({ id: opt.id, yesCount, maybeCount, score });
                                        });
                                        
                                        const sorted = [...availability].sort((a, b) => b.score - a.score);
                                        const best = sorted[0];
                                        const bestPct = votes.length > 0 ? Math.round((best.yesCount / votes.length) * 100) : 0;
                                        
                                        // Find if there's a clear winner or multiple good options
                                        const goodOptions = sorted.filter(o => o.score >= best.score * 0.8);
                                        
                                        // Find who can't make any times
                                        const noAvailability = votes.filter((v: any) => {
                                            const choices = v.choices || v.selectedOptionIds || [];
                                            return choices.length === 0;
                                        }).length;
                                        
                                        return (
                                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-sm col-span-2 border border-emerald-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">📅</span>
                                                    <span className="font-medium text-emerald-700">Meeting Availability</span>
                                                </div>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    <p>
                                                        Best time: <strong className="text-emerald-600">{getOptionText(best.id)}</strong>
                                                        <span className="text-slate-400 ml-1">({bestPct}% available, {best.maybeCount} maybes)</span>
                                                    </p>
                                                    {goodOptions.length > 1 && (
                                                        <p className="text-slate-500">
                                                            {goodOptions.length} time slots work well for the group
                                                        </p>
                                                    )}
                                                    {noAvailability > 0 && (
                                                        <p className="text-amber-600">
                                                            ⚠️ {noAvailability} {noAvailability === 1 ? 'person has' : 'people have'} no availability
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* THIS OR THAT: Margin of Victory */}
                                    {isThisOrThat && simpleCounts && (() => {
                                        const option1 = poll.options[0];
                                        const option2 = poll.options[1];
                                        const count1 = simpleCounts[option1.id] || 0;
                                        const count2 = simpleCounts[option2.id] || 0;
                                        const total = count1 + count2;
                                        
                                        if (total === 0) return null;
                                        
                                        const winner = count1 >= count2 ? option1 : option2;
                                        const loser = count1 >= count2 ? option2 : option1;
                                        const winnerCount = Math.max(count1, count2);
                                        const loserCount = Math.min(count1, count2);
                                        
                                        const margin = winnerCount - loserCount;
                                        const marginPct = Math.round((margin / total) * 100);
                                        const winnerPct = Math.round((winnerCount / total) * 100);
                                        
                                        const isLandslide = marginPct >= 40;
                                        const isClose = marginPct <= 10;
                                        const isTied = margin === 0;
                                        
                                        return (
                                            <div className={`rounded-xl p-4 shadow-sm col-span-2 border ${
                                                isTied ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' :
                                                isLandslide ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' :
                                                'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
                                            }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{isTied ? '⚖️' : isLandslide ? '🏆' : '🤝'}</span>
                                                    <span className={`font-medium ${
                                                        isTied ? 'text-amber-700' : isLandslide ? 'text-emerald-700' : 'text-blue-700'
                                                    }`}>
                                                        {isTied ? 'Perfect Tie!' : isLandslide ? 'Clear Winner!' : 'Close Call!'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    {isTied ? (
                                                        <p>Both options received exactly <strong>{count1} votes</strong></p>
                                                    ) : (
                                                        <>
                                                            <p>
                                                                <strong className={isLandslide ? 'text-emerald-600' : 'text-blue-600'}>{getOptionText(winner.id)}</strong> wins with {winnerPct}%
                                                            </p>
                                                            <p className="text-slate-500">
                                                                {isClose ? (
                                                                    <>Only {margin} vote{margin !== 1 ? 's' : ''} separated them!</>
                                                                ) : isLandslide ? (
                                                                    <>Won by a {margin}-vote margin</>
                                                                ) : (
                                                                    <>Margin: {margin} vote{margin !== 1 ? 's' : ''} ({marginPct}%)</>
                                                                )}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* MULTIPLE CHOICE (3+ options): Competition Analysis */}
                                    {isMultipleChoice && !isThisOrThat && simpleCounts && (() => {
                                        const sorted = Object.entries(simpleCounts)
                                            .sort((a, b) => b[1] - a[1]);
                                        
                                        if (sorted.length < 2) return null;
                                        
                                        const [first, second] = sorted;
                                        const total = sorted.reduce((sum, [_, c]) => sum + c, 0);
                                        
                                        if (total === 0) return null;
                                        
                                        // Check for tie at top
                                        const tiedAtTop = sorted.filter(([_, count]) => count === first[1]).length;
                                        
                                        if (tiedAtTop > 1) {
                                            return (
                                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm col-span-2 border border-amber-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xl">⚖️</span>
                                                        <span className="font-medium text-amber-700">It's a Tie!</span>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-slate-600">
                                                        <p>
                                                            <strong className="text-amber-600">{tiedAtTop} options</strong> tied with {first[1]} vote{first[1] !== 1 ? 's' : ''} each
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        
                                        const firstPct = Math.round((first[1] / total) * 100);
                                        const secondPct = Math.round((second[1] / total) * 100);
                                        const gap = first[1] - second[1];
                                        const gapPct = Math.round((gap / total) * 100);
                                        
                                        // Check if it's competitive
                                        const isCompetitive = gapPct <= 15;
                                        const isDominant = firstPct >= 50;
                                        
                                        return (
                                            <div className={`rounded-xl p-4 shadow-sm col-span-2 border ${
                                                isDominant ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' :
                                                isCompetitive ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' :
                                                'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200'
                                            }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{isDominant ? '👑' : isCompetitive ? '🔥' : '📈'}</span>
                                                    <span className={`font-medium ${
                                                        isDominant ? 'text-emerald-700' : isCompetitive ? 'text-amber-700' : 'text-slate-700'
                                                    }`}>
                                                        {isDominant ? 'Clear Favorite' : isCompetitive ? 'Tight Race' : 'Results Breakdown'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm text-slate-600">
                                                    {isDominant ? (
                                                        <p>
                                                            <strong className="text-emerald-600">{getOptionText(first[0])}</strong> leads with majority support ({firstPct}%)
                                                        </p>
                                                    ) : isCompetitive ? (
                                                        <>
                                                            <p>
                                                                Only <strong className="text-amber-600">{gap} vote{gap !== 1 ? 's' : ''}</strong> between top 2!
                                                            </p>
                                                            <p className="text-slate-500">
                                                                {getOptionText(first[0])} ({firstPct}%) vs {getOptionText(second[0])} ({secondPct}%)
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p>
                                                            <strong>{getOptionText(first[0])}</strong> leads at {firstPct}%, followed by {getOptionText(second[0])} at {secondPct}%
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                                    <Info size={12} /> Insights based on anonymous aggregate data. No personal information stored.
                                </p>
                            </div>
                    </motion.div>
                )}

                {/* --- COMMENTS SECTION --- */}
                {shouldShowComments && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mt-6 break-inside-avoid"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <MessageSquare size={24} className="text-indigo-500"/> Comments
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {comments!.map((comment, i) => {
                                const name = String(comment.name || comment.voterName || 'Anonymous');
                                const text = String(comment.text || '');
                                const date = comment.date || comment.timestamp;
                                return (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative group hover:border-indigo-100 transition-colors">
                                    <Quote size={20} className="text-indigo-200 absolute top-4 right-4" />
                                    <p className="text-slate-700 italic mb-3 relative z-10 pr-6">"{text}"</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-600">{name}</span>
                                        <span className="text-slate-400 text-xs">• {date ? new Date(date).toLocaleDateString() : ''}</span>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </motion.div>
                )}

                {/* --- ANALYTICS DASHBOARD (Paid Users Only) --- */}
                {isAdmin && adminKey && isPaidUser && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                    >
                        <AnalyticsDashboard 
                            pollId={poll.id}
                            adminKey={adminKey}
                            currentTier={tier as 'free' | 'pro' | 'business'}
                        />
                    </motion.div>
                )}

            </AnimatePresence>
            
            {/* Branding footer for PNG exports */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-sm print:mt-4 print:pt-2">
                <img src="/logo.svg" alt="VoteGenerator" className="h-5 w-5" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="font-medium">VoteGenerator.com</span>
            </div>
            </div>
        </div>
        </>
    );
};

export default VoteGeneratorResults;
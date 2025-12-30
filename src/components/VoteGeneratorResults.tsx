import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, BarChart, LayoutGrid, PieChart, Settings, GitMerge, MessageSquare, Quote, Calendar, TrendingUp, Coins, Activity, Map as MapIcon, Info, GitCompare, SlidersHorizontal, DollarSign, Check } from 'lucide-react';
import { RunoffResult, Poll } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';

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

interface Props {
    poll: Poll;
    results: RunoffResult & { votes?: any[] };
    onEdit?: () => void;
    adminKey?: string | null;
    isAdmin?: boolean;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results, onEdit, adminKey, isAdmin }) => {
    const { winnerId, rounds, totalVotes, simpleCounts, maybeCounts, comments, matrixAverages, pairwiseScores, ratingStats, budgetStats } = results;
    const votes: any[] = (results as any).votes || [];
    const isRanked = poll.pollType === 'ranked';
    const isMeeting = poll.pollType === 'meeting';
    const isDot = poll.pollType === 'dot';
    const isMatrix = poll.pollType === 'matrix';
    const isPairwise = poll.pollType === 'pairwise';
    const isRating = poll.pollType === 'rating';
    const isBudget = poll.pollType === 'budget';
    
    const [viewMode, setViewMode] = useState<'bar' | 'flow' | 'pie' | 'grid' | 'heatmap' | 'velocity' | 'map' | 'matrix' | 'pairwise' | 'rating'>(
        isRanked ? 'flow' : isMeeting ? 'heatmap' : isMatrix ? 'matrix' : isPairwise ? 'pairwise' : isRating ? 'rating' : 'bar'
    );

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    const barChartData = (() => {
        if (isBudget && budgetStats) {
            const data: Record<string, number> = {};
            Object.entries(budgetStats).forEach(([id, stat]) => data[id] = stat.totalValue);
            return data;
        }
        if (simpleCounts) return simpleCounts;
        if (isRanked && rounds.length > 0) return rounds[0].counts;
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
        const buckets = 10;
        const duration = endTime - startTime;
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
        const firstRoundTotal = Object.values(rounds[0].counts).reduce((a, b) => a + b, 0);

        rounds.forEach((round, roundIdx) => {
            let yOffset = 0;
            const sortedIds = Object.keys(round.counts).sort((a,b) => round.counts[b] - round.counts[a]);
            sortedIds.forEach(id => {
                const count = round.counts[id];
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
            const currentMap = currentRound.counts;
            const nextMap = nextRound.counts;

            Object.keys(nextMap).forEach(id => {
                const prevCount = currentMap[id] || 0;
                const newCount = nextMap[id];
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

    return (
        <>
            {/* Print styles to preserve colors */}
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    .bg-indigo-500, .bg-blue-500, .bg-green-500, .bg-purple-500,
                    .bg-pink-500, .bg-cyan-500, .bg-lime-500, .bg-orange-500,
                    .bg-red-500, .bg-teal-500, .bg-yellow-500 {
                        background-color: inherit !important;
                    }
                }
            `}</style>
            <div className="space-y-6 print:space-y-4">
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
                    
                    <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <MapIcon size={16} /> Map
                    </button>

                    <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <LayoutGrid size={16} /> Grid
                    </button>
                </div>
            </div>

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
                            {isMeeting && (
                                <div className="mt-2 text-indigo-200 text-sm">
                                    Score: {meetingScoreData[activeWinnerId]} (Yes=1, Maybe=0.5)
                                </div>
                            )}
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
                                    Total Value: ${budgetStats[activeWinnerId].totalValue.toLocaleString()} ({budgetStats[activeWinnerId].totalQuantity} purchased)
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
                                                {stats.count > 1 && (
                                                    <div 
                                                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-black/20 rounded-full"
                                                        style={{ 
                                                            left: `${Math.max(0, stats.average - stats.stdDev)}%`, 
                                                            width: `${Math.min(100 - (stats.average - stats.stdDev), stats.stdDev * 2)}%`
                                                        }}
                                                    >
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3 bg-black/30"></div>
                                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3 bg-black/30"></div>
                                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-black/40 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 flex justify-between">
                                                <span>Std Dev: {stats.stdDev.toFixed(1)}</span>
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
                                                    {data.score.toFixed(1)}% <span className="text-slate-400 font-normal text-xs ml-1">({data.wins} wins / {data.matches} matches)</span>
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
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 print:shadow-none print:border-slate-300"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <BarChart size={24} className="text-indigo-500"/> 
                            {isRanked ? 'First Preference Votes' : isDot ? 'Points Distribution' : isBudget ? 'Value Allocated' : 'Vote Breakdown'}
                        </h3>
                        
                        <div className="space-y-4">
                            {Object.entries(barChartData)
                                .sort(([, a], [, b]) => b - a)
                                .map(([id, value]) => {
                                    const denominator = isDot || isBudget ? Object.values(barChartData).reduce((a,b)=>a+b,0) : totalVotes;
                                    const percentage = denominator > 0 ? (value / denominator) * 100 : 0;
                                    
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <span className="text-slate-800 font-bold text-lg">
                                                    {getOptionText(id)}
                                                </span>
                                                <span className="text-slate-600 font-bold">
                                                    {isBudget ? `$${value.toLocaleString()}` : value} {isDot ? 'pts' : ''} <span className="text-slate-400 font-normal text-xs ml-1">({percentage.toFixed(0)}%)</span>
                                                </span>
                                            </div>
                                            <div className="h-6 bg-slate-100 rounded-lg overflow-hidden print:border print:border-slate-200">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-lg ${getBarColorClass(id)} opacity-90 print:bg-slate-600`}
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
                         <div className="relative w-64 h-64 shrink-0">
                             <div 
                                className="w-full h-full rounded-full border-4 border-slate-50 shadow-inner"
                                style={{ background: `conic-gradient(${pieGradient})` }}
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-600 text-lg">
                                     {isDot || isBudget ? <Coins size={24} /> : totalVotes}
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex-1 w-full max-w-sm">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                                 {isRanked ? 'First Preference Distribution' : isDot || isBudget ? 'Value Share' : 'Vote Distribution'}
                             </h3>
                             <div className="space-y-3">
                                 {pieData.map(d => (
                                     <div key={d.id} className="flex items-center justify-between group">
                                         <div className="flex items-center gap-3">
                                             <div className="w-4 h-4 rounded-full" style={{ background: d.color }}></div>
                                             <span className="font-medium text-slate-700">{getOptionText(d.id)}</span>
                                         </div>
                                         <div className="text-sm font-bold text-slate-500">
                                             {d.percentage.toFixed(1)}%
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </motion.div>
                )}

                {/* --- VELOCITY VIEW (Line Chart) --- */}
                {viewMode === 'velocity' && (
                    <motion.div
                        key="velocity"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={24} className="text-indigo-500"/> Vote Velocity
                        </h3>
                        
                        <div className="h-64 flex items-end gap-1 border-b border-l border-slate-200 p-4 relative">
                             {/* Bars representing activity over time buckets */}
                             {velocityData.map((d, i) => {
                                 const maxVal = Math.max(...velocityData.map(v => v.count), 1);
                                 const height = (d.count / maxVal) * 100;
                                 return (
                                     <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                                         <div 
                                            className="w-full bg-indigo-500/50 hover:bg-indigo-500 rounded-t-md transition-all relative"
                                            style={{ height: `${height}%` }}
                                         >
                                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                                                 {d.count} votes <br/> {d.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                             </div>
                                         </div>
                                     </div>
                                 )
                             })}
                             {velocityData.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-400">Not enough data yet</div>}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>First Vote</span>
                            <span>Latest Vote</span>
                        </div>
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
                                const country = v.analytics?.country;
                                if (country) {
                                    const countryName = getCountryName(country);
                                    countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
                                    votesWithLocation++;
                                }
                            });
                            
                            const sortedCountries = Object.entries(countryCounts)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 6);
                            
                            const totalWithLocation = votesWithLocation || 1;
                            
                            if (sortedCountries.length === 0) {
                                return (
                                    <div className="text-center py-12">
                                        <MapIcon size={48} className="text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">No location data yet</p>
                                        <p className="text-slate-400 text-sm mt-1">Geographic data will appear as votes come in</p>
                                    </div>
                                );
                            }
                            
                            return (
                                <>
                                    <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 overflow-hidden flex items-center justify-center mb-6">
                                        <svg viewBox="0 0 100 50" className="w-full h-full opacity-20">
                                            <path d="M20,15 Q25,5 35,15 T50,15 T65,10 T80,15 T90,25 T80,35 T60,40 T40,35 T20,40 T10,30 Z" fill="#6366f1" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-indigo-900 font-bold text-2xl">{Object.keys(countryCounts).length}</p>
                                                <p className="text-slate-500 text-sm">Countries represented</p>
                                            </div>
                                        </div>
                                        {/* Animated dots for top countries */}
                                        {sortedCountries.slice(0, 3).map((_, i) => (
                                            <circle 
                                                key={i}
                                                cx={25 + i * 25} 
                                                cy={18 + i * 5} 
                                                r={1 + (2 - i) * 0.3}
                                                className="absolute fill-indigo-600 animate-ping" 
                                                style={{animationDelay: `${i * 0.5}s`}} 
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {sortedCountries.map(([country, count]) => {
                                            const percentage = Math.round((count / totalWithLocation) * 100);
                                            return (
                                                <div key={country} className="flex items-center gap-3">
                                                    <span className="text-xl w-8">{getCountryFlag(country)}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-medium text-slate-700">{country}</span>
                                                            <span className="text-xs text-slate-500">{count} votes ({percentage}%)</span>
                                                        </div>
                                                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                                                            <div 
                                                                className="bg-indigo-500 h-full rounded-full transition-all"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
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
                    </motion.div>
                )}

                {/* --- DEVICE BREAKDOWN (shown for admin when there's analytics) --- */}
                {isAdmin && votes && votes.length > 0 && votes.some((v: any) => v.analytics?.device) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mt-6"
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Settings size={20} className="text-indigo-500"/> Device Breakdown
                        </h3>
                        {(() => {
                            const deviceCounts = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
                            (votes || []).forEach((v: any) => {
                                const device = v.analytics?.device || 'unknown';
                                deviceCounts[device as keyof typeof deviceCounts]++;
                            });
                            const total = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
                            
                            const devices = [
                                { key: 'mobile', label: 'Mobile', icon: '📱', color: 'bg-blue-500' },
                                { key: 'desktop', label: 'Desktop', icon: '💻', color: 'bg-green-500' },
                                { key: 'tablet', label: 'Tablet', icon: '📲', color: 'bg-purple-500' },
                            ].filter(d => deviceCounts[d.key as keyof typeof deviceCounts] > 0);
                            
                            return (
                                <div className="grid grid-cols-3 gap-4">
                                    {devices.map(({ key, label, icon, color }) => {
                                        const count = deviceCounts[key as keyof typeof deviceCounts];
                                        const percentage = Math.round((count / total) * 100);
                                        return (
                                            <div key={key} className="text-center p-4 bg-slate-50 rounded-xl">
                                                <div className="text-3xl mb-2">{icon}</div>
                                                <div className="text-2xl font-black text-slate-800">{percentage}%</div>
                                                <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
                                                <div className="text-xs text-slate-400 mt-1">{count} votes</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </motion.div>
                )}

                {/* --- GRID / TABLE VIEW --- */}
                {viewMode === 'grid' && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 font-bold text-slate-700 min-w-[150px] sticky left-0 bg-slate-50">Participant</th>
                                        {poll.options.map(opt => (
                                            <th key={opt.id} className="p-4 font-bold text-slate-700 min-w-[120px] text-center border-l border-slate-100">
                                                {opt.text}
                                            </th>
                                        ))}
                                         <th className="p-4 font-bold text-slate-700 min-w-[200px] border-l border-slate-100">Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {votes.map((vote: any, i: number) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                {vote.voterName || 'Anonymous'}
                                                <div className="text-xs text-slate-400 font-normal">{new Date(getVoteTime(vote)).toLocaleDateString()}</div>
                                            </td>
                                            {poll.options.map(opt => {
                                                let cellContent = <span className="text-slate-300">-</span>;
                                                const voteChoices = vote.choices || vote.selectedOptionIds || vote.rankedOptionIds || [];
                                                
                                                if (isMatrix && vote.matrixVotes) {
                                                    const pos = vote.matrixVotes[opt.id];
                                                    if (pos) {
                                                        cellContent = <div className="flex flex-col items-center"><span className="text-xs font-bold text-slate-600">X:{Math.round(pos.x)}, Y:{Math.round(pos.y)}</span></div>;
                                                    }
                                                } else if (isPairwise && vote.pairwiseVotes) {
                                                     const voterWins = vote.pairwiseVotes.filter(p => p.winnerId === opt.id).length;
                                                     const voterMatches = vote.pairwiseVotes.filter(p => p.winnerId === opt.id || p.loserId === opt.id).length;
                                                     if (voterMatches > 0) {
                                                         cellContent = <span className="text-xs font-bold text-slate-600">{voterWins} / {voterMatches}</span>;
                                                     }
                                                } else if (isRating && vote.ratingVotes) {
                                                    const val = vote.ratingVotes[opt.id];
                                                    if (val !== undefined) {
                                                        cellContent = <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">{val}</span>;
                                                    }
                                                } else if (isRanked) {
                                                    const rank = voteChoices.indexOf(opt.id);
                                                    if (rank !== -1) {
                                                        cellContent = <span className="font-bold text-indigo-600 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mx-auto">{rank + 1}</span>;
                                                    }
                                                } else if (isDot || isBudget) {
                                                     const dots = voteChoices.filter(c => c === opt.id).length;
                                                     if(dots > 0) {
                                                         cellContent = <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{dots}</span>;
                                                     }
                                                } else if (isMeeting) {
                                                     if (voteChoices.includes(opt.id)) {
                                                         cellContent = <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded">Yes</span>;
                                                     } else if (vote.choicesMaybe?.includes(opt.id)) {
                                                         cellContent = <span className="text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">Maybe</span>;
                                                     }
                                                } else {
                                                     if (voteChoices.includes(opt.id)) {
                                                         cellContent = <Check size={20} className="text-emerald-500 mx-auto" />;
                                                     }
                                                }
                                                
                                                return (
                                                    <td key={opt.id} className="p-4 text-center border-l border-slate-100">
                                                        {cellContent}
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-slate-500 border-l border-slate-100 italic">
                                                {vote.comment || ''}
                                            </td>
                                        </tr>
                                    ))}
                                    {votes.length === 0 && (
                                        <tr>
                                             <td colSpan={poll.options.length + 2} className="p-8 text-center text-slate-400 italic">
                                                 No votes recorded yet.
                                             </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                            {comments!.map((comment, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative group hover:border-indigo-100 transition-colors">
                                    <Quote size={20} className="text-indigo-200 absolute top-4 right-4" />
                                    <p className="text-slate-700 italic mb-3 relative z-10 pr-6">"{comment.text}"</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {comment.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-600">{comment.name}</span>
                                        <span className="text-slate-400 text-xs">• {comment.date ? new Date(comment.date).toLocaleDateString() : ''}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- ANALYTICS DASHBOARD (Admin Only) --- */}
                {isAdmin && adminKey && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6"
                    >
                        <AnalyticsDashboard 
                            pollId={poll.id}
                            adminKey={adminKey}
                            currentTier={(() => {
                                const tier = localStorage.getItem('vg_purchased_tier');
                                // Return actual tier names
                                if (tier === 'unlimited') return 'unlimited';
                                if (tier === 'pro_event') return 'pro_event';
                                if (tier === 'starter') return 'starter';
                                return 'free';
                            })()}
                        />
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
        </>
    );
};

export default VoteGeneratorResults;
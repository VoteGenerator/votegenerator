import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, BarChart, LayoutGrid, PieChart, Settings, GitMerge, MessageSquare, Quote, Calendar, Activity, Map as MapIcon, GitCompare, SlidersHorizontal, DollarSign } from 'lucide-react';
import { RunoffResult, Poll } from '../types';

interface Props {
    poll: Poll;
    results: RunoffResult;
    onEdit?: () => void;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results, onEdit }) => {
    const { winnerId, rounds, totalVotes, simpleCounts, maybeCounts, votes, comments, matrixAverages, pairwiseScores, ratingStats, budgetStats } = results;
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

    const getOption = (id: string) => poll.options.find(o => o.id === id);
    const getOptionText = (id: string) => getOption(id)?.text || 'Unknown Option';

    // --- DATA PREPARATION ---

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

    const maxHeat = Math.max(...Object.values(meetingScoreData), 1);

    const velocityData = (() => {
        if (!votes || votes.length === 0) return [];
        const sortedVotes = [...votes].sort((a,b) => new Date(a.votedAt).getTime() - new Date(b.votedAt).getTime());
        if(sortedVotes.length === 0) return [];
        const startTime = new Date(sortedVotes[0].votedAt).getTime();
        const endTime = new Date().getTime();
        const buckets = 10;
        const duration = endTime - startTime;
        const bucketSize = Math.max(duration / buckets, 60000); 
        
        const data = Array(buckets).fill(0).map((_, i) => ({ 
            time: new Date(startTime + (i * bucketSize)), 
            count: 0 
        }));

        sortedVotes.forEach(v => {
            const time = new Date(v.votedAt).getTime();
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
        <div className="space-y-6 print:space-y-4">
            <div className="flex flex-wrap justify-end gap-2 print:hidden">
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm overflow-x-auto max-w-full">
                    {/* View Toggles */}
                    {isMatrix && <button onClick={() => setViewMode('matrix')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'matrix' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={16} /> Matrix</button>}
                    {isPairwise && <button onClick={() => setViewMode('pairwise')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'pairwise' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><GitCompare size={16} /> Leaderboard</button>}
                    {isRating && <button onClick={() => setViewMode('rating')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'rating' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><SlidersHorizontal size={16} /> Averages</button>}
                    
                    {!isPairwise && !isRating && <button onClick={() => setViewMode('bar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'bar' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><BarChart size={16} /> Bar</button>}
                    
                    {isRanked && <button onClick={() => setViewMode('flow')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'flow' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><GitMerge size={16} /> Flow Chart</button>}
                    {isMeeting && <button onClick={() => setViewMode('heatmap')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'heatmap' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><Calendar size={16} /> Heatmap</button>}
                    {!isPairwise && !isRating && <button onClick={() => setViewMode('pie')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'pie' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><PieChart size={16} /> Pie</button>}
                    
                    <button onClick={() => setViewMode('velocity')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'velocity' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><Activity size={16} /> Velocity</button>
                    <button onClick={() => setViewMode('map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><MapIcon size={16} /> Map</button>
                    <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid size={16} /> Grid</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* --- WINNER CARD --- */}
                {((viewMode === 'flow' || viewMode === 'bar' || viewMode === 'heatmap' || viewMode === 'pairwise' || viewMode === 'rating') && activeWinnerId && !isDot && !isMatrix) && (
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
                        <div className="relative z-10 flex flex-col items-center">
                            {getOption(activeWinnerId)?.imageUrl && (
                                <img src={getOption(activeWinnerId)?.imageUrl} alt="Winner" className="w-32 h-32 rounded-xl object-cover mb-4 shadow-lg border-4 border-white/20" />
                            )}
                            
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
                    <motion.div key="rating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <SlidersHorizontal size={24} className="text-indigo-500"/> Average Ratings
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {Object.entries(ratingStats).sort(([, a], [, b]) => b.average - a.average).map(([id, stats]) => (
                                <div key={id} className="relative break-inside-avoid">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <div className="flex items-center gap-3">
                                            {getOption(id)?.imageUrl && <img src={getOption(id)?.imageUrl} className="w-8 h-8 rounded object-cover" alt="" />}
                                            <span className="text-slate-800 font-bold text-lg">{getOptionText(id)}</span>
                                        </div>
                                        <span className="text-slate-600 font-bold">{stats.average.toFixed(1)} / 100</span>
                                    </div>
                                    <div className="relative h-8 bg-slate-100 rounded-lg mt-2 overflow-visible">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.average}%` }} className={`absolute top-0 left-0 h-full rounded-lg ${getBarColorClass(id)} opacity-90`} />
                                        <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                                            <span className="text-xs text-slate-400">{stats.count} ratings</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- PAIRWISE VIEW --- */}
                {viewMode === 'pairwise' && pairwiseScores && (
                    <motion.div key="pairwise" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <GitCompare size={24} className="text-indigo-500"/> Leaderboard
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(pairwiseScores).sort(([, a], [, b]) => b.score - a.score).map(([id, data]) => (
                                <div key={id} className="relative break-inside-avoid">
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <div className="flex items-center gap-3">
                                            {getOption(id)?.imageUrl && <img src={getOption(id)?.imageUrl} className="w-8 h-8 rounded object-cover" alt="" />}
                                            <span className="text-slate-800 font-bold text-lg">{getOptionText(id)}</span>
                                        </div>
                                        <span className="text-slate-600 font-bold">{data.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${data.score}%` }} className={`h-full rounded-full ${getBarColorClass(id)} opacity-90`} />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">Won {data.wins} of {data.matches} matchups</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- MATRIX VIEW --- */}
                {viewMode === 'matrix' && matrixAverages && (
                     <motion.div key="matrix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <LayoutGrid size={24} className="text-indigo-500"/> Priority Matrix Average
                        </h3>
                        <div className="relative aspect-square bg-white border-2 border-slate-200 rounded-xl overflow-hidden max-w-lg mx-auto">
                             {/* Background quadrants */}
                             <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                                 <div className="bg-emerald-50/50 flex p-2 text-emerald-800 font-bold text-xs uppercase items-start justify-end">Quick Wins</div>
                                 <div className="bg-blue-50/50 flex p-2 text-blue-800 font-bold text-xs uppercase items-start justify-start">Major Projects</div>
                                 <div className="bg-slate-50/50 flex p-2 text-slate-400 font-bold text-xs uppercase items-end justify-end">Fill Ins</div>
                                 <div className="bg-red-50/50 flex p-2 text-red-800 font-bold text-xs uppercase items-end justify-start">Thankless Tasks</div>
                             </div>
                             {/* Axes */}
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <div className="w-full h-px bg-slate-300"></div>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <div className="h-full w-px bg-slate-300"></div>
                             </div>
                             {/* Points */}
                             {Object.entries(matrixAverages).map(([id, coords]) => {
                                 const top = 100 - coords.y;
                                 return (
                                     <div key={id} className="absolute -ml-3 -mt-3 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-md flex items-center justify-center z-10 group cursor-help transition-all hover:scale-125 hover:z-20" style={{ left: `${coords.x}%`, top: `${top}%` }}>
                                         <span className="text-[10px] text-white font-bold">{poll.options.findIndex(o => o.id === id) + 1}</span>
                                         <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                             {getOptionText(id)}
                                         </div>
                                     </div>
                                 )
                             })}
                             {/* Axis Labels */}
                             <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">Effort →</div>
                             <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 uppercase origin-left">Impact →</div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                            {poll.options.map((opt, i) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-indigo-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold">{i+1}</div>
                                    <span className="text-slate-600 truncate">{opt.text}</span>
                                </div>
                            ))}
                        </div>
                     </motion.div>
                )}

                {/* --- HEATMAP VIEW (Meeting) --- */}
                {viewMode === 'heatmap' && isMeeting && (
                    <motion.div key="heatmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar size={24} className="text-indigo-500"/> Availability Heatmap
                        </h3>
                        <div className="space-y-2">
                            {Object.entries(meetingScoreData)
                                .sort(([, a], [, b]) => b - a)
                                .map(([id, score]) => {
                                    const option = getOption(id);
                                    if (!option) return null;
                                    const intensity = maxHeat > 0 ? score / maxHeat : 0;
                                    const simpleCount = simpleCounts ? (simpleCounts[id] || 0) : 0;
                                    const maybeCount = maybeCounts ? (maybeCounts[id] || 0) : 0;
                                    
                                    // Parse date/time for display if format allows (Date • Time)
                                    const parts = option.text.split('•');
                                    const datePart = parts[0]?.trim();
                                    const timePart = parts[1]?.trim() || '';

                                    return (
                                        <div key={id} className="relative overflow-hidden rounded-xl border border-slate-100">
                                            {/* Background Heat Bar */}
                                            <div 
                                                className="absolute inset-0 bg-indigo-500 transition-all duration-500"
                                                style={{ opacity: 0.1 + (intensity * 0.4), width: `${(score/maxHeat)*100}%` }}
                                            />
                                            <div className="relative p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${score === maxHeat ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        <Calendar size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-lg">{datePart}</div>
                                                        <div className="text-slate-500 text-sm">{timePart}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-2xl text-indigo-900">{score}</div>
                                                    <div className="text-xs text-slate-500 flex gap-2">
                                                        <span className="text-emerald-600 font-medium">{simpleCount} Yes</span>
                                                        <span className="text-amber-500 font-medium">{maybeCount} Maybe</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}

                {/* --- PIE CHART VIEW --- */}
                {viewMode === 'pie' && (
                    <motion.div key="pie" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <PieChart size={24} className="text-indigo-500"/> Vote Distribution
                        </h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <div className="relative w-64 h-64 shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    {pieData.map((slice) => {
                                        // Calculate SVG path for arc
                                        const startRad = (slice.startAngle * Math.PI) / 180;
                                        const endRad = ((slice.startAngle + slice.angle) * Math.PI) / 180;
                                        const x1 = 50 + 50 * Math.cos(startRad);
                                        const y1 = 50 + 50 * Math.sin(startRad);
                                        const x2 = 50 + 50 * Math.cos(endRad);
                                        const y2 = 50 + 50 * Math.sin(endRad);
                                        const largeArc = slice.angle > 180 ? 1 : 0;
                                        
                                        // If 100%, draw full circle
                                        if (slice.percentage > 99.9) {
                                            return <circle key={slice.id} cx="50" cy="50" r="50" fill={slice.color} />;
                                        }

                                        return (
                                            <path
                                                key={slice.id}
                                                d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                fill={slice.color}
                                                stroke="white"
                                                strokeWidth="1"
                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                            />
                                        );
                                    })}
                                    {/* Inner white circle for donut effect */}
                                    <circle cx="50" cy="50" r="30" fill="white" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="font-bold text-2xl text-slate-800">{totalVotes}</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wide">Votes</span>
                                </div>
                            </div>
                            <div className="space-y-2 w-full max-w-xs">
                                {pieData.map(d => (
                                    <div key={d.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                                            <span className="font-medium text-slate-700 truncate max-w-[150px]">{getOptionText(d.id)}</span>
                                        </div>
                                        <span className="text-slate-500 font-mono">{d.percentage.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- VELOCITY CHART VIEW --- */}
                {viewMode === 'velocity' && (
                    <motion.div key="velocity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Activity size={24} className="text-indigo-500"/> Voting Velocity
                        </h3>
                        <div className="h-64 w-full flex items-end gap-2 border-b border-l border-slate-200 p-4 relative">
                            {/* Simple Bar/Line representation */}
                            {velocityData.map((point, i) => {
                                const maxCount = Math.max(...velocityData.map(d => d.count), 1);
                                const height = (point.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                                        <div 
                                            className="w-full bg-indigo-200 hover:bg-indigo-400 rounded-t-sm transition-all relative"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {point.count} votes<br/>{point.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                            <span>Start: {velocityData[0]?.time.toLocaleDateString()}</span>
                            <span>Latest</span>
                        </div>
                    </motion.div>
                )}

                {/* --- MAP VIEW (Placeholder) --- */}
                {viewMode === 'map' && (
                    <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <MapIcon size={24} className="text-indigo-500"/> Location View
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-dashed border-slate-200">
                             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <MapIcon size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700">Geographic Data Unavailable</h4>
                            <p className="text-slate-500 max-w-md mx-auto mt-2">
                                We don't currently collect geolocation data from voters to protect their privacy. If this poll involves locations, try viewing them in the <strong>Grid</strong> or <strong>Bar</strong> views.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* --- GRID VIEW (Gallery) --- */}
                {viewMode === 'grid' && (
                    <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                         <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <LayoutGrid size={24} className="text-indigo-500"/> Option Grid
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {poll.options.map((opt) => {
                                const count = simpleCounts ? (simpleCounts[opt.id] || 0) : 0;
                                const isWinner = opt.id === activeWinnerId;
                                return (
                                    <div key={opt.id} className={`relative rounded-xl overflow-hidden border-2 transition-all ${isWinner ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200' : 'border-slate-100'}`}>
                                        <div className="aspect-square bg-slate-50 flex items-center justify-center">
                                            {opt.imageUrl ? (
                                                <img src={opt.imageUrl} alt={opt.text} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl font-black text-slate-200 select-none">?</span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                            <span className="text-white font-bold text-sm line-clamp-2 leading-tight">{opt.text}</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-xs font-bold bg-white/20 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">{count} votes</span>
                                                {isWinner && <Trophy size={12} className="text-yellow-400" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* --- BAR VIEW (Standard for Dot/Multiple/Budget/Ranked fallback) --- */}
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
                                    const option = getOption(id);
                                    
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <div className="flex items-center gap-3">
                                                    {option?.imageUrl && (
                                                        <img src={option.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
                                                    )}
                                                    <span className="text-slate-800 font-bold text-lg">
                                                        {option?.text || 'Unknown'}
                                                    </span>
                                                </div>
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
                    <motion.div key="flow" className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 overflow-x-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><GitMerge size={24} className="text-indigo-500"/> Vote Transfer Flow</h3>
                        <div className="min-w-[600px] h-[450px]">{renderSankeySVG()}</div>
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
                                        <span className="text-slate-400 text-xs">• {new Date(comment.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default VoteGeneratorResults;
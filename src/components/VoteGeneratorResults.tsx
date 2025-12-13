import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, BarChart, LayoutGrid, PieChart, Settings, GitMerge, MessageSquare, Quote, Calendar, TrendingUp, Coins, Activity, Check, Map as MapIcon, Info } from 'lucide-react';
import { RunoffResult, Poll } from '../types';

interface Props {
    poll: Poll;
    results: RunoffResult;
    onEdit?: () => void;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results, onEdit }) => {
    const { winnerId, rounds, totalVotes, simpleCounts, maybeCounts, votes, comments } = results;
    const isRanked = poll.pollType === 'ranked';
    const isMeeting = poll.pollType === 'meeting';
    const isDot = poll.pollType === 'dot';
    
    // Determine default view based on poll type
    const [viewMode, setViewMode] = useState<'bar' | 'flow' | 'pie' | 'grid' | 'heatmap' | 'velocity' | 'map'>(
        isRanked ? 'flow' : isMeeting ? 'heatmap' : 'bar'
    );

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    // FIX: Ensure Bar Chart displays correct data context
    const barChartData = (() => {
        if (simpleCounts) return simpleCounts;
        if (isRanked && rounds.length > 0) return rounds[0].counts;
        const counts: Record<string, number> = {};
        poll.options.forEach(o => counts[o.id] = 0);
        return counts;
    })();

    // Meeting Score Data
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

    // --- Visualization Helpers ---

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

    // --- SANKEY DIAGRAM GENERATION ---
    const sankeyData = useMemo(() => {
        // Return default structure if empty to prevent undefined properties
        if (rounds.length === 0) return { nodes: [], links: [], width: 0, height: 400 };

        const nodes: any[] = [];
        const links: any[] = [];
        const canvasHeight = 400;
        const roundWidth = 150;
        const gap = 10;

        // Calculate total votes in the first round to normalize heights against it
        const firstRoundTotal = Object.values(rounds[0].counts).reduce((a, b) => a + b, 0);

        // 1. Generate Nodes for each round
        rounds.forEach((round, roundIdx) => {
            let yOffset = 0;
            
            // Sort to keep consistent order or by count
            const sortedIds = Object.keys(round.counts).sort((a,b) => round.counts[b] - round.counts[a]);

            sortedIds.forEach(id => {
                const count = round.counts[id];
                const height = firstRoundTotal > 0 ? (count / firstRoundTotal) * (canvasHeight - (sortedIds.length * gap)) : 0; // Normalize against FIRST round total to keep scale
                
                // Only push if height > 0 (or strictly existing)
                if (count >= 0) {
                    nodes.push({
                        id: `${roundIdx}-${id}`,
                        optionId: id,
                        round: roundIdx,
                        value: count,
                        x: roundIdx * roundWidth,
                        y: yOffset,
                        height: Math.max(height, 2), // min height visibility
                        color: getHexColor(id)
                    });
                    yOffset += height + gap;
                }
            });
        });

        // 2. Generate Links between rounds
        // We infer flow: 
        // - Surviving candidates keep their votes (Self -> Self)
        // - Eliminated candidate votes flow to Surviving candidates based on delta
        for (let i = 0; i < rounds.length - 1; i++) {
            const currentRound = rounds[i];
            const nextRound = rounds[i+1];
            const eliminatedId = currentRound.eliminatedId;

            // Map current round counts
            const currentMap = currentRound.counts;
            const nextMap = nextRound.counts;

            Object.keys(nextMap).forEach(id => {
                // Determine how much 'id' grew
                const prevCount = currentMap[id] || 0;
                const newCount = nextMap[id];
                const delta = newCount - prevCount;

                // 1. Flow from Self (Persistence)
                if (prevCount > 0) {
                    links.push({
                        source: `${i}-${id}`,
                        target: `${i+1}-${id}`,
                        value: prevCount,
                        color: getHexColor(id),
                        opacity: 0.5
                    });
                }

                // 2. Flow from Eliminated (Transfer)
                // In RCV, if you gain votes, they MUST come from the eliminated candidate(s)
                // (Simplification: assuming 1 eliminated per round)
                if (delta > 0 && eliminatedId) {
                    links.push({
                        source: `${i}-${eliminatedId}`,
                        target: `${i+1}-${id}`,
                        value: delta,
                        color: getHexColor(eliminatedId), // Color of the eliminated candidate flowing out
                        opacity: 0.3
                    });
                }
            });
        }

        return { nodes, links, width: rounds.length * roundWidth, height: canvasHeight };
    }, [rounds]);

    const renderSankeySVG = () => {
        const { nodes, links, width, height } = sankeyData;
        
        return (
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                {/* Links */}
                {links.map((link, i) => {
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    // Calculate offsets for stacking flows. 
                    // This is a simplified "center-ish" anchor. For perfect Sankey, tracking stack input/output Y is needed.
                    // Simplified: Draw from center-right of source to center-left of target
                    // Better: We need to know "offset inside node".
                    // For this demo, standard bezier is decent.
                    
                    const sy = sourceNode.y + sourceNode.height / 2;
                    const ty = targetNode.y + targetNode.height / 2;
                    const sx = sourceNode.x + 20; // nodeWidth
                    const tx = targetNode.x;

                    // Stroke width proportional to value relative to max votes
                    const strokeWidth = (link.value / totalVotes) * height;

                    const path = `M ${sx} ${sy} C ${sx + 50} ${sy}, ${tx - 50} ${ty}, ${tx} ${ty}`;

                    return (
                        <path 
                            key={i} 
                            d={path} 
                            stroke={link.color} 
                            strokeWidth={Math.max(strokeWidth, 1)} 
                            fill="none" 
                            opacity={link.opacity}
                            className="transition-all hover:opacity-80"
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        <rect 
                            width={20} 
                            height={node.height} 
                            fill={node.color} 
                            rx={4}
                            className="shadow-sm"
                        />
                        {/* Labels */}
                        <text 
                            x={10} 
                            y={-5} 
                            textAnchor="middle" 
                            fontSize="10" 
                            className="fill-slate-500 font-bold"
                        >
                            {node.value}
                        </text>
                        {node.round === 0 && (
                            <text 
                                x={0} 
                                y={node.height / 2} 
                                dx={-5}
                                dy={4}
                                textAnchor="end" 
                                fontSize="11" 
                                className="fill-slate-700 font-bold"
                            >
                                {getOptionText(node.optionId)}
                            </text>
                        )}
                        {node.round === rounds.length - 1 && (
                             <text 
                                x={25} 
                                y={node.height / 2} 
                                dy={4}
                                textAnchor="start" 
                                fontSize="11" 
                                className="fill-slate-700 font-bold"
                            >
                                {getOptionText(node.optionId)}
                            </text>
                        )}
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
            {/* View Mode Toggle */}
            <div className="flex flex-wrap justify-end gap-2 print:hidden">
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm overflow-x-auto max-w-full">
                    <button onClick={() => setViewMode('bar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'bar' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <BarChart size={16} /> Bar
                    </button>
                    
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

                     <button onClick={() => setViewMode('pie')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'pie' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <PieChart size={16} /> Pie
                    </button>

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
                {((viewMode === 'flow' || viewMode === 'bar' || viewMode === 'heatmap') && activeWinnerId && !isDot) && (
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
                                {isMeeting ? "Best Time Slot" : "The Winner Is"}
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
                        </div>
                    </motion.div>
                )}

                {/* --- BAR VIEW (Standard for Dot/Multiple) --- */}
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
                            {isRanked ? 'First Preference Votes' : isDot ? 'Points Distribution' : 'Vote Breakdown'}
                        </h3>
                        
                        <div className="space-y-4">
                            {Object.entries(barChartData)
                                .sort(([, a], [, b]) => b - a)
                                .map(([id, count]) => {
                                    const denominator = isDot ? Object.values(barChartData).reduce((a,b)=>a+b,0) : totalVotes;
                                    const percentage = denominator > 0 ? (count / denominator) * 100 : 0;
                                    
                                    return (
                                        <div key={id} className="relative break-inside-avoid">
                                            <div className="flex justify-between text-sm font-medium mb-1">
                                                <span className="text-slate-800 font-bold text-lg">
                                                    {getOptionText(id)}
                                                </span>
                                                <span className="text-slate-600 font-bold">
                                                    {count} {isDot ? 'pts' : ''} <span className="text-slate-400 font-normal text-xs ml-1">({percentage.toFixed(0)}%)</span>
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
                                     {isDot ? <Coins size={24} /> : totalVotes}
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex-1 w-full max-w-sm">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                                 {isRanked ? 'First Preference Distribution' : isDot ? 'Points Share' : 'Vote Distribution'}
                             </h3>
                             <div className="space-y-3">
                                 {pieData.map(d => (
                                     <div key={d.id} className="flex items-center justify-between group">
                                         <div className="flex items-center gap-3">
                                             <div className="w-4 h-4 rounded-full" style={{ background: d.color }}></div>
                                             <span className="font-medium text-slate-700">{getOptionText(d.id)}</span>
                                         </div>
                                         <div className="text-sm font-bold text-slate-500">
                                             {d.percentage.toFixed(1)}% <span className="font-normal text-xs text-slate-400">({d.count})</span>
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
                            <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                Demo Mode: Locations simulated
                            </div>
                        </div>
                        
                        <div className="relative w-full aspect-[2/1] bg-indigo-50 rounded-xl border border-indigo-100 overflow-hidden flex items-center justify-center">
                            {/* Simple Abstract World Map SVG */}
                            <svg viewBox="0 0 100 50" className="w-full h-full opacity-30">
                                <path d="M20,15 Q25,5 35,15 T50,15 T65,10 T80,15 T90,25 T80,35 T60,40 T40,35 T20,40 T10,30 Z" fill="#6366f1" />
                                <circle cx="25" cy="18" r="1" className="fill-indigo-600 animate-ping" />
                                <circle cx="55" cy="15" r="1.5" className="fill-indigo-600 animate-ping" style={{animationDelay: '0.5s'}} />
                                <circle cx="75" cy="25" r="0.8" className="fill-indigo-600 animate-ping" style={{animationDelay: '1s'}} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-indigo-900 font-bold text-lg">Global Reach</p>
                                    <p className="text-slate-500 text-xs"> votes collected from 3 regions</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-black text-slate-700">65%</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">North America</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-black text-slate-700">25%</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Europe</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-black text-slate-700">10%</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Asia</div>
                            </div>
                        </div>
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
                                    {votes.map((vote, i) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                {vote.voterName || 'Anonymous'}
                                                <div className="text-xs text-slate-400 font-normal">{new Date(vote.votedAt).toLocaleDateString()}</div>
                                            </td>
                                            {poll.options.map(opt => {
                                                let cellContent = <span className="text-slate-300">-</span>;
                                                
                                                if (isRanked) {
                                                    const rank = vote.choices.indexOf(opt.id);
                                                    if (rank !== -1) {
                                                        cellContent = <span className="font-bold text-indigo-600 bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center mx-auto">{rank + 1}</span>;
                                                    }
                                                } else if (isDot) {
                                                     const dots = vote.choices.filter(c => c === opt.id).length;
                                                     if(dots > 0) {
                                                         cellContent = <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{dots}</span>;
                                                     }
                                                } else if (isMeeting) {
                                                     if (vote.choices.includes(opt.id)) {
                                                         cellContent = <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded">Yes</span>;
                                                     } else if (vote.choicesMaybe?.includes(opt.id)) {
                                                         cellContent = <span className="text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded">Maybe</span>;
                                                     }
                                                } else {
                                                     if (vote.choices.includes(opt.id)) {
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
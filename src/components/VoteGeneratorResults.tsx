import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, AlertCircle, BarChart, LayoutGrid, PieChart, Settings, GitMerge, MessageSquare, Quote, Lock, Calendar, TrendingUp, Coins, Activity, Check } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState<'bar' | 'rounds' | 'pie' | 'grid' | 'heatmap' | 'velocity'>(
        isRanked ? 'rounds' : isMeeting ? 'heatmap' : 'bar'
    );

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    // FIX: Ensure Bar Chart displays correct data context
    const barChartData = (() => {
        // Meeting: Counts are just frequencies
        if (simpleCounts) return simpleCounts;
        
        // Ranked: First preference or first round
        if (isRanked && rounds.length > 0) return rounds[0].counts;
        
        // Fallback for new polls
        const counts: Record<string, number> = {};
        poll.options.forEach(o => counts[o.id] = 0);
        return counts;
    })();

    // Meeting Score Data (Weighted: Yes=1, Maybe=0.5)
    const meetingScoreData = (() => {
        const scores: Record<string, number> = {};
        poll.options.forEach(o => scores[o.id] = 0);
        
        if (simpleCounts) {
            Object.entries(simpleCounts).forEach(([id, c]) => scores[id] = (scores[id] || 0) + c);
        }
        if (maybeCounts) {
            Object.entries(maybeCounts).forEach(([id, c]) => scores[id] = (scores[id] || 0) + (c * 0.5));
        }
        return scores;
    })();

    // Override Winner for Meeting (Highest Score)
    const meetingWinnerId = isMeeting ? Object.keys(meetingScoreData).reduce((a, b) => meetingScoreData[a] > meetingScoreData[b] ? a : b, poll.options[0].id) : winnerId;
    const activeWinnerId = isMeeting ? meetingWinnerId : winnerId;

    const CHART_COLORS = [
        '#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#84cc16', 
        '#f97316', '#ef4444', '#14b8a6', '#3b82f6', '#eab308'
    ];

    const getBarColorClass = (id: string) => {
        const index = poll.options.findIndex(o => o.id === id);
        const colors = [
            'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 
            'bg-lime-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500', 'bg-blue-500', 'bg-yellow-500'
        ];
        return colors[index % colors.length];
    };

    const getHexColor = (id: string) => {
        const index = poll.options.findIndex(o => o.id === id);
        return CHART_COLORS[index % CHART_COLORS.length];
    };

    const shouldShowComments = comments && comments.length > 0 && (poll.isAdmin || (poll.settings.allowComments && poll.settings.publicComments));

    // --- Visualization Helpers ---

    // Pie Chart Data
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

    // Heatmap Data (Meeting) - Use Scores
    const maxHeat = Math.max(...Object.values(meetingScoreData), 1);

    // Velocity Data (Time series)
    const velocityData = (() => {
        if (!votes || votes.length === 0) return [];
        
        // Group votes by time (bucketed)
        const sortedVotes = [...votes].sort((a,b) => new Date(a.votedAt).getTime() - new Date(b.votedAt).getTime());
        if(sortedVotes.length === 0) return [];
        
        const startTime = new Date(sortedVotes[0].votedAt).getTime();
        const endTime = new Date().getTime(); // or last vote
        const buckets = 10;
        const duration = endTime - startTime;
        const bucketSize = Math.max(duration / buckets, 60000); // Minimum 1 minute bucket
        
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

    // Sankey-lite for RCV
    const renderSankeyFlow = () => {
        if (rounds.length < 2) return null;
        return (
            <div className="relative h-[300px] w-full flex justify-between items-stretch py-4">
                {rounds.map((round, rIdx) => {
                    const roundTotal = Object.values(round.counts).reduce((a,b) => a+b, 0);
                    const sorted = Object.entries(round.counts).sort((a,b) => b[1] - a[1]);
                    
                    return (
                        <div key={rIdx} className="flex flex-col justify-center h-full w-12 z-10 relative">
                            <div className="text-center text-xs font-bold text-slate-400 mb-2">R{round.roundNumber}</div>
                            <div className="flex flex-col gap-1 h-full justify-center">
                                {sorted.map(([id, count]) => {
                                    const heightPct = (count / roundTotal) * 100;
                                    const isEliminated = id === round.eliminatedId;
                                    return (
                                        <div 
                                            key={id} 
                                            style={{ height: `${heightPct}%` }}
                                            className={`w-full rounded-sm relative group transition-all ${isEliminated ? 'opacity-30' : 'opacity-90'}`}
                                        >
                                            <div className={`w-full h-full rounded ${getBarColorClass(id)}`} />
                                            {/* Tooltip */}
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-slate-800 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                                                {getOptionText(id)}: {count}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
                <div className="absolute inset-0 flex items-center justify-center -z-0 opacity-10">
                    <GitMerge size={200} />
                </div>
            </div>
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
                        <button onClick={() => setViewMode('rounds')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'rounds' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <GitMerge size={16} /> Rounds
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
                    
                    <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <LayoutGrid size={16} /> Grid
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* --- WINNER CARD --- */}
                {((viewMode === 'rounds' || viewMode === 'bar' || viewMode === 'heatmap') && activeWinnerId && !isDot) && (
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

                {/* --- ROUNDS VIEW (Sankey-ish for RCV) --- */}
                {viewMode === 'rounds' && isRanked && rounds.length > 0 && (
                    <motion.div 
                        key="rounds"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 print:shadow-none print:border-slate-300"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <GitMerge size={24} className="text-indigo-500"/>
                            Runoff Flow
                        </h3>
                        
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            {renderSankeyFlow()}
                        </div>

                        <div className="space-y-8">
                            {rounds.map((round) => {
                                const roundTotal = Object.values(round.counts).reduce((a,b) => a+b, 0);
                                const sortedEntries = Object.entries(round.counts).sort(([, a], [, b]) => b - a);
                                return (
                                    <div key={round.roundNumber} className="relative break-inside-avoid border-t pt-4 border-dashed border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-600 uppercase tracking-wider text-xs">
                                                Round {round.roundNumber}
                                            </h4>
                                            {round.eliminatedId && (
                                                <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded font-medium flex items-center gap-1">
                                                    <AlertCircle size={12} />
                                                    Eliminated: {getOptionText(round.eliminatedId)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            {sortedEntries.map(([id, count]) => {
                                                const percentage = (count / roundTotal) * 100;
                                                const isEliminated = id === round.eliminatedId;
                                                return (
                                                    <div key={id} className={`flex items-center gap-2 text-sm ${isEliminated ? 'opacity-50' : ''}`}>
                                                        <div className="w-24 truncate text-right font-medium text-slate-600" title={getOptionText(id)}>{getOptionText(id)}</div>
                                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                             <div className={`h-full ${getBarColorClass(id)}`} style={{ width: `${percentage}%` }}></div>
                                                        </div>
                                                        <div className="w-8 text-xs text-slate-400">{count}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
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
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, AlertCircle, BarChart, Check, LayoutGrid, PieChart } from 'lucide-react';
import { RunoffResult, Poll } from '../types';

interface Props {
    poll: Poll;
    results: RunoffResult;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results }) => {
    const { winnerId, rounds, totalVotes, simpleCounts, votes } = results;
    // Determine default view based on poll type
    const [viewMode, setViewMode] = useState<'chart' | 'pie' | 'grid'>('chart');

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    const CHART_COLORS = [
        '#6366f1', // Indigo 500
        '#a855f7', // Purple 500
        '#ec4899', // Pink 500
        '#06b6d4', // Cyan 500
        '#84cc16', // Lime 500
        '#f97316', // Orange 500
        '#ef4444', // Red 500
        '#14b8a6', // Teal 500
        '#3b82f6', // Blue 500
        '#eab308'  // Yellow 500
    ];

    // Get color for bars (consistent per option)
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

    if (totalVotes === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No votes yet</h3>
                <p className="text-slate-500 mt-2">Share the link to get started!</p>
            </div>
        );
    }

    const isRanked = poll.pollType === 'ranked';

    // Prepare data for Pie Chart
    // For RCV: Use First Round Votes (rounds[0].counts)
    // For Multiple: Use simpleCounts
    const pieData = (() => {
        let counts: Record<string, number> = {};
        if (isRanked && rounds.length > 0) {
            counts = rounds[0].counts;
        } else if (simpleCounts) {
            counts = simpleCounts;
        }
        
        const total = Object.values(counts).reduce((a,b) => a+b, 0);
        let currentAngle = 0;
        
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([id, count]) => {
                const percentage = (count / total) * 100;
                const angle = (count / total) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                return {
                    id,
                    count,
                    percentage,
                    color: getHexColor(id),
                    startAngle,
                    angle
                };
            });
    })();

    // Simple Conic Gradient for Pie Chart
    const pieGradient = pieData.map(d => `${d.color} ${d.startAngle}deg ${d.startAngle + d.angle}deg`).join(', ');


    return (
        <div className="space-y-6 print:space-y-4">
            {/* View Mode Toggle */}
            <div className="flex justify-end print:hidden">
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('chart')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'chart' 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <BarChart size={16} /> {isRanked ? 'Rounds' : 'Bar'}
                    </button>
                     <button
                        onClick={() => setViewMode('pie')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'pie' 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <PieChart size={16} /> Pie
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'grid' 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <LayoutGrid size={16} /> Grid
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* --- BAR / ROUNDS VIEW --- */}
                {viewMode === 'chart' && (
                    <motion.div 
                        key="chart"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Winner Card */}
                        {winnerId && isRanked && (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden print:border print:border-slate-300 print:bg-none print:text-black"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 print:hidden">
                                    <Trophy size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="uppercase tracking-widest text-sm font-semibold text-indigo-200 mb-2 print:text-slate-500">The Winner Is</div>
                                    <h2 className="text-3xl md:text-5xl font-black font-serif mb-4">
                                        {getOptionText(winnerId)}
                                    </h2>
                                    <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm print:bg-slate-100 print:text-slate-900">
                                        <Users size={18} />
                                        <span className="font-semibold">{totalVotes} Total Votes</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Multiple Choice - Top Option Highlight */}
                        {!isRanked && simpleCounts && (
                            <div className="grid grid-cols-1 gap-4">
                                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Votes</div>
                                    <div className="text-4xl font-black text-slate-800">{totalVotes}</div>
                                </div>
                            </div>
                        )}

                        {/* Rounds Visualization for RCV */}
                        {isRanked && rounds.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 print:shadow-none print:border-slate-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    Results Breakdown
                                    {rounds.length > 1 && (
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-normal">
                                            {rounds.length} Rounds
                                        </span>
                                    )}
                                </h3>

                                <div className="space-y-10">
                                    {rounds.map((round) => {
                                        const roundTotal = Object.values(round.counts).reduce((a,b) => a+b, 0);
                                        const sortedEntries = Object.entries(round.counts)
                                            .sort(([, a], [, b]) => b - a);

                                        return (
                                            <div key={round.roundNumber} className="relative break-inside-avoid">
                                                <div className="flex justify-between items-end mb-4">
                                                    <h4 className="font-bold text-slate-400 uppercase tracking-wider text-sm">
                                                        Round {round.roundNumber}
                                                    </h4>
                                                    {round.eliminatedId && (
                                                        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded font-medium flex items-center gap-1">
                                                            <AlertCircle size={12} />
                                                            Eliminated: {getOptionText(round.eliminatedId)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {sortedEntries.map(([id, count]) => {
                                                        const percentage = (count / roundTotal) * 100;
                                                        const isWinner = id === round.winnerId;
                                                        const isEliminated = id === round.eliminatedId;

                                                        return (
                                                            <div key={id} className={`relative ${isEliminated ? 'opacity-50 grayscale' : ''}`}>
                                                                <div className="flex justify-between text-sm font-medium mb-1">
                                                                    <span className={isWinner ? 'text-indigo-600 font-bold' : 'text-slate-700'}>
                                                                        {getOptionText(id)}
                                                                    </span>
                                                                    <span className="text-slate-500">
                                                                        {count} ({percentage.toFixed(0)}%)
                                                                    </span>
                                                                </div>
                                                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden print:border print:border-slate-200">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percentage}%` }}
                                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                                        className={`h-full rounded-full ${getBarColorClass(id)} print:bg-slate-600`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                
                                                {round.roundNumber !== rounds.length && (
                                                    <div className="absolute -bottom-6 left-0 right-0 border-b border-dashed border-slate-200"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Multiple Choice Visualization (Bar) */}
                        {!isRanked && simpleCounts && (
                             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 print:shadow-none print:border-slate-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <BarChart size={24} className="text-indigo-500"/> Vote Breakdown
                                </h3>
                                
                                <div className="space-y-4">
                                    {Object.entries(simpleCounts)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([id, count]) => {
                                            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                                            
                                            return (
                                                <div key={id} className="relative break-inside-avoid">
                                                    <div className="flex justify-between text-sm font-medium mb-1">
                                                        <span className="text-slate-800 font-bold text-lg">
                                                            {getOptionText(id)}
                                                        </span>
                                                        <span className="text-slate-600 font-bold">
                                                            {count} <span className="text-slate-400 font-normal text-xs ml-1">({percentage.toFixed(0)}% of voters)</span>
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
                             </div>
                        )}
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
                                     {totalVotes}
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex-1 w-full max-w-sm">
                             <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
                                 {isRanked ? 'First Preference Distribution' : 'Vote Distribution'}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {votes.map((vote, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="p-4 font-medium text-slate-900 sticky left-0 bg-white hover:bg-slate-50/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
                                                        {(vote.voterName || 'A').charAt(0)}
                                                    </div>
                                                    {vote.voterName || 'Anonymous'}
                                                </div>
                                            </td>
                                            {poll.options.map(opt => {
                                                const isSelected = isRanked 
                                                    ? vote.choices.includes(opt.id) 
                                                    : vote.choices.includes(opt.id);
                                                
                                                const rankIndex = isRanked ? vote.choices.indexOf(opt.id) + 1 : 0;

                                                return (
                                                    <td key={opt.id} className="p-4 text-center border-l border-slate-100">
                                                        {isRanked ? (
                                                            isSelected ? (
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                                                                    {rankIndex}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-300">-</span>
                                                            )
                                                        ) : (
                                                            isSelected ? (
                                                                <div className="flex justify-center">
                                                                    <Check className="text-emerald-500" size={20} strokeWidth={3} />
                                                                </div>
                                                            ) : (
                                                                <span className="text-slate-300">-</span>
                                                            )
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    {/* Footer Row with Totals */}
                                    <tr className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200">
                                        <td className="p-4 sticky left-0 bg-slate-50">Total</td>
                                        {poll.options.map(opt => {
                                            const count = simpleCounts ? (simpleCounts[opt.id] || 0) : '-';
                                            return (
                                                <td key={opt.id} className="p-4 text-center border-l border-slate-200">
                                                    {count}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoteGeneratorResults;
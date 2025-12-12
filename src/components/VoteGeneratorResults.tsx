import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, AlertCircle } from 'lucide-react';
import { RunoffResult, Poll } from '../types';

interface Props {
    poll: Poll;
    results: RunoffResult;
}

const VoteGeneratorResults: React.FC<Props> = ({ poll, results }) => {
    const { winnerId, rounds, totalVotes, voters } = results;

    const getOptionText = (id: string) => poll.options.find(o => o.id === id)?.text || 'Unknown Option';

    // Get color for bars (consistent per option)
    const getBarColor = (id: string) => {
        const index = poll.options.findIndex(o => o.id === id);
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 
            'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500'
        ];
        return colors[index % colors.length];
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

    return (
        <div className="space-y-6">
            {/* Winner Card */}
            {winnerId && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Trophy size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="uppercase tracking-widest text-sm font-semibold text-indigo-200 mb-2">The Winner Is</div>
                        <h2 className="text-3xl md:text-5xl font-black font-serif mb-4">
                            {getOptionText(winnerId)}
                        </h2>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Users size={18} />
                            <span className="font-semibold">{totalVotes} Total Votes</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Rounds Visualization for RCV */}
            {rounds.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
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
                                <div key={round.roundNumber} className="relative">
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
                                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className={`h-full rounded-full ${getBarColor(id)}`}
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

            {/* Participants List */}
            {voters && voters.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">
                     <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Participants
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-normal">
                            {voters.length}
                        </span>
                     </h3>
                     <div className="flex flex-wrap gap-2">
                         {voters.map((name, i) => (
                             <div key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-100">
                                 {name}
                             </div>
                         ))}
                     </div>
                </div>
            )}
        </div>
    );
};

export default VoteGeneratorResults;
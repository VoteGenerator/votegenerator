import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, Clock, Hash, Lock } from 'lucide-react';
import { Poll } from '../types';
import { updatePoll } from '../services/voteGeneratorService';

interface Props {
    poll: Poll;
    onCancel: () => void;
    onUpdate: () => void;
}

const VoteGeneratorEdit: React.FC<Props> = ({ poll, onCancel, onUpdate }) => {
    const [title, setTitle] = useState(poll.title);
    const [description, setDescription] = useState(poll.description || '');
    const [deadline, setDeadline] = useState(poll.settings.deadline ? new Date(poll.settings.deadline).toISOString().slice(0, 16) : '');
    const [maxVotes, setMaxVotes] = useState<number | ''>(poll.settings.maxVotes || '');
    const [hideResults, setHideResults] = useState(poll.settings.hideResults);
    const [isSaving, setIsSaving] = useState(false);
    
    // Check if votes exist to lock certain fields
    const hasVotes = poll.voteCount > 0;

    const handleSave = async () => {
        if (!title.trim()) return;
        setIsSaving(true);
        try {
            await updatePoll(poll.id, poll.adminKey!, {
                title,
                description,
                settings: {
                    ...poll.settings,
                    hideResults,
                    deadline: deadline ? new Date(deadline).toISOString() : undefined,
                    maxVotes: maxVotes === '' ? undefined : Number(maxVotes)
                }
            });
            onUpdate();
        } catch (e) {
            console.error(e);
            setIsSaving(false);
            alert("Failed to update poll. Please try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button onClick={onCancel} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
                <ArrowLeft size={20} /> Back to Results
            </button>
            
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 bg-indigo-50 border-b border-indigo-100">
                    <h1 className="text-2xl font-black text-indigo-900 mb-2">Edit Poll</h1>
                    <p className="text-indigo-700/80 text-sm">Update settings for your active poll.</p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {hasVotes && (
                        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex gap-3 text-sm border border-amber-100">
                            <Lock size={20} className="shrink-0" />
                            <div>
                                <strong>Some settings are locked.</strong><br/>
                                Because voting has already started ({poll.voteCount} votes), you cannot change the poll type or options to ensure fairness.
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Question / Title
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Details
                        </label>
                        <textarea 
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-900">Poll Settings</h3>
                        
                        {/* Deadline */}
                        <div>
                            <div className="flex items-center gap-2 font-bold text-slate-700 mb-2 text-sm">
                                <Clock size={16} className="text-slate-400" /> Close automatically on date
                            </div>
                            <input 
                                type="datetime-local" 
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-700"
                            />
                        </div>

                         {/* Max Votes */}
                         <div>
                            <div className="flex items-center gap-2 font-bold text-slate-700 mb-2 text-sm">
                                <Hash size={16} className="text-slate-400" /> Close automatically after X votes
                            </div>
                            <input 
                                type="number" 
                                min={poll.voteCount + 1}
                                value={maxVotes}
                                onChange={(e) => setMaxVotes(e.target.value === '' ? '' : parseInt(e.target.value))}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-700"
                                placeholder="Unlimited"
                            />
                            {hasVotes && (
                                <p className="text-xs text-slate-400 mt-1">Must be greater than current votes ({poll.voteCount}).</p>
                            )}
                        </div>

                        {/* Hide Results */}
                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                            <div className="flex-1 flex items-center gap-2">
                                {hideResults ? <EyeOff size={18} className="text-amber-500" /> : <Eye size={18} className="text-slate-400" />}
                                <div>
                                    <div className="font-bold text-slate-700">Hide results from voters</div>
                                    <div className="text-xs text-slate-500 font-normal">Only admin sees results</div>
                                </div>
                            </div>
                            <div className="relative">
                                <input type="checkbox" checked={hideResults} onChange={e => setHideResults(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </div>
                        </label>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !title.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        {isSaving ? 'Saving...' : <><Save size={20} /> Update Poll</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteGeneratorEdit;
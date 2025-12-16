import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, EyeOff, Clock, Hash, Lock, Plus, Trash2, Check } from 'lucide-react';
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
    const [options, setOptions] = useState(poll.options.map(o => o.text));
    const [deadline, setDeadline] = useState(poll.settings.deadline ? new Date(poll.settings.deadline).toISOString().slice(0, 16) : '');
    const [maxVotes, setMaxVotes] = useState<number | ''>(poll.settings.maxVotes || '');
    const [hideResults, setHideResults] = useState(poll.settings.hideResults);
    const [isSaving, setIsSaving] = useState(false);
    
    // Check if votes exist to lock certain fields
    const hasVotes = poll.voteCount > 0;

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (options.length >= 20) return;
        setOptions([...options, '']);
    };

    const handleSave = async () => {
        if (!title.trim()) return;
        const validOptions = options.filter(o => o.trim() !== '');
        if (validOptions.length < 2) {
            alert("You need at least 2 valid options.");
            return;
        }

        setIsSaving(true);
        try {
            // Reconstruct options array preserving IDs where possible
            // If hasVotes is true, we technically shouldn't be here if we disabled inputs, but for safety:
            let updatedOptions = poll.options;
            
            if (!hasVotes) {
                 updatedOptions = options.filter(t => t.trim() !== '').map((text, i) => {
                    // Try to preserve ID if index matches, otherwise generate new or use existing? 
                    // To keep it simple for this edit: reuse existing IDs for first N items, generate new for others.
                    // This might break if they reorder completely, but simple edit is usually fixing typos or appending.
                    const existingId = poll.options[i]?.id;
                    return {
                        id: existingId || Math.random().toString(36).substr(2, 6),
                        text
                    };
                 });
            }

            await updatePoll(poll.id, poll.adminKey!, {
                title,
                description,
                options: hasVotes ? undefined : updatedOptions, // Do not update options if votes exist
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
                            <Lock size={20} className="shrink-0 mt-0.5" />
                            <div>
                                <strong>Options are locked.</strong><br/>
                                Because voting has already started ({poll.voteCount} votes), you cannot add, remove, or edit options to ensure fairness. You can still update the title, description, and deadline.
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

                    {/* Options Editing */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                            Options
                        </label>
                        <div className="space-y-3">
                            {options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={opt}
                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                        disabled={hasVotes}
                                        className={`w-full p-3 border-2 rounded-xl outline-none transition-all font-medium ${
                                            hasVotes 
                                                ? 'bg-slate-50 text-slate-500 border-slate-100 cursor-not-allowed' 
                                                : 'border-slate-200 focus:border-indigo-500'
                                        }`}
                                        placeholder={`Option ${i + 1}`}
                                    />
                                    {!hasVotes && options.length > 2 && (
                                        <button 
                                            onClick={() => removeOption(i)}
                                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {!hasVotes && options.length < 20 && (
                            <button
                                onClick={addOption}
                                className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors p-2 hover:bg-indigo-50 rounded-lg -ml-2"
                            >
                                <Plus size={16} /> Add another option
                            </button>
                        )}
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
                             {deadline && (
                                <p className="text-emerald-600 text-xs mt-1 font-bold flex items-center gap-1">
                                    <Check size={12} /> Selected: {new Date(deadline).toLocaleString()}
                                </p>
                            )}
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
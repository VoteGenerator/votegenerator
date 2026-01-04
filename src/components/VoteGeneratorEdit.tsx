// ============================================================================
// VoteGeneratorEdit - Edit Poll Settings
// Location: src/components/VoteGeneratorEdit.tsx
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Save, Loader2, AlertCircle, Calendar, Clock, 
    Lock, Users, Eye, EyeOff, Image as ImageIcon, SlidersHorizontal,
    Play, Pause, CheckSquare, X
} from 'lucide-react';
import { Poll } from '../types';
import ThemeSelector from './ThemeSelector';
import LogoUpload from './LogoUpload';

interface Props {
    poll: Poll;
    onCancel: () => void;
    onUpdate: () => void;
}

const VoteGeneratorEdit: React.FC<Props> = ({ poll, onCancel, onUpdate }) => {
    const [title, setTitle] = useState(poll.title);
    const [description, setDescription] = useState(poll.description || '');
    const [deadline, setDeadline] = useState(poll.settings?.deadline || '');
    const [meetingDuration, setMeetingDuration] = useState<15 | 30 | 45 | 60 | 90 | 120>(poll.meetingDuration || 60);
    const [hideResults, setHideResults] = useState(poll.settings?.hideResults || false);
    const [requireNames, setRequireNames] = useState(poll.settings?.requireNames || false);
    const [allowMultiple, setAllowMultiple] = useState(poll.settings?.allowMultiple || false);
    const [buttonText, setButtonText] = useState(poll.buttonText || 'Submit Vote');
    const [selectedTheme, setSelectedTheme] = useState(poll.theme || 'default');
    const [pollLogo, setPollLogo] = useState<string | null>(poll.logoUrl || null);
    const [status, setStatus] = useState<'draft' | 'live'>(
        (poll.status === 'draft' || poll.status === 'live') ? poll.status : 'live'
    );
    
    const isMeetingPoll = poll.pollType === 'meeting';
    
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Get admin key from URL
    const getAdminKey = () => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        return params.get('admin') || '';
    };
    
    const isPaidTier = poll.tier && poll.tier !== 'free';
    const isBusiness = poll.tier === 'business';
    const isProOrHigher = poll.tier === 'pro' || poll.tier === 'business';
    
    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        
        setIsSaving(true);
        setError(null);
        
        try {
            const response = await fetch('/.netlify/functions/vg-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId: poll.id,
                    adminKey: getAdminKey(),
                    updates: {
                        title: title.trim(),
                        description: description.trim() || undefined,
                        buttonText: buttonText || 'Submit Vote',
                        theme: selectedTheme,
                        logoUrl: pollLogo,
                        status: status,
                        meetingDuration: isMeetingPoll ? meetingDuration : undefined,
                        settings: {
                            ...poll.settings,
                            deadline: deadline || undefined,
                            hideResults,
                            requireNames,
                            allowMultiple
                        }
                    }
                })
            });
            
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onUpdate();
                }, 1000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save changes');
            }
        } catch (e) {
            setError('Network error. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6">
                <button 
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium mb-4"
                >
                    <ArrowLeft size={18} /> Back to Poll
                </button>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <SlidersHorizontal className="text-indigo-600" size={28} />
                    Edit Poll Settings
                </h1>
                <p className="text-slate-500 mt-1">Update your poll's appearance and behavior</p>
            </div>
            
            {success && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
                >
                    <CheckSquare className="text-emerald-600" size={20} />
                    <p className="text-emerald-700 font-medium">Changes saved successfully!</p>
                </motion.div>
            )}
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                >
                    <AlertCircle className="text-red-600" size={20} />
                    <p className="text-red-700 font-medium">{error}</p>
                </motion.div>
            )}
            
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Poll Question</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-indigo-500 focus:outline-none"
                            placeholder="Your poll question..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                            placeholder="Add more context..."
                        />
                    </div>
                    
                    {/* Status Toggle - Paid tiers only */}
                    {isPaidTier && (
                        <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Poll Status</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStatus('live')}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        status === 'live'
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-300'
                                    }`}
                                >
                                    <Play size={18} /> Live
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus('draft')}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                        status === 'draft'
                                            ? 'bg-amber-500 text-white shadow-lg'
                                            : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-amber-300'
                                    }`}
                                >
                                    <Pause size={18} /> Draft
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                {status === 'draft' ? 'Voters cannot access this poll yet' : 'Poll is accepting votes'}
                            </p>
                        </div>
                    )}
                    
                    {/* Deadline */}
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Clock size={16} /> Close poll on
                        </label>
                        <input
                            type="datetime-local"
                            value={deadline ? new Date(deadline).toISOString().slice(0, 16) : ''}
                            onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value).toISOString() : '')}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    
                    {/* Meeting Duration - only for meeting polls */}
                    {isMeetingPoll && (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <label className="block text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                <Calendar size={16} className="text-amber-600" /> Meeting Duration
                            </label>
                            <p className="text-xs text-amber-600 mb-3">Used when adding the winning time to calendars</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 15, label: '15 min' },
                                    { value: 30, label: '30 min' },
                                    { value: 45, label: '45 min' },
                                    { value: 60, label: '1 hour' },
                                    { value: 90, label: '1.5 hours' },
                                    { value: 120, label: '2 hours' },
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setMeetingDuration(value as typeof meetingDuration)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                            meetingDuration === value
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-100'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Voting Options */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Voting Options</label>
                        
                        {poll.pollType === 'multiple' && (
                            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 cursor-pointer transition">
                                <span className="font-medium text-slate-700">Allow multiple selections</span>
                                <input
                                    type="checkbox"
                                    checked={allowMultiple}
                                    onChange={(e) => setAllowMultiple(e.target.checked)}
                                    className="w-5 h-5 rounded accent-indigo-600"
                                />
                            </label>
                        )}
                        
                        <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 cursor-pointer transition">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-slate-500" />
                                <span className="font-medium text-slate-700">Require voter names</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={requireNames}
                                onChange={(e) => setRequireNames(e.target.checked)}
                                className="w-5 h-5 rounded accent-indigo-600"
                            />
                        </label>
                        
                        <label className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 cursor-pointer transition">
                            <div className="flex items-center gap-2">
                                {hideResults ? <EyeOff size={18} className="text-slate-500" /> : <Eye size={18} className="text-slate-500" />}
                                <span className="font-medium text-slate-700">Hide results until closed</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={hideResults}
                                onChange={(e) => setHideResults(e.target.checked)}
                                className="w-5 h-5 rounded accent-indigo-600"
                            />
                        </label>
                    </div>
                    
                    {/* Button Text */}
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Button text</label>
                        <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Submit Vote"
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    
                    {/* Custom Branding - Pro Event & Business */}
                    <div className={`p-4 rounded-xl border ${
                        isProOrHigher
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                            : 'bg-slate-50 border-slate-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            <ImageIcon size={16} className={isProOrHigher ? 'text-purple-600' : 'text-slate-400'} />
                            <span className="font-semibold text-slate-700">Custom Branding</span>
                            {isProOrHigher ? (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    isBusiness 
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                        : 'bg-purple-600 text-white'
                                }`}>
                                    {isBusiness ? 'UNLIMITED' : 'PRO'}
                                </span>
                            ) : (
                                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold">PRO+</span>
                            )}
                        </div>
                        {isProOrHigher ? (
                            <LogoUpload 
                                currentLogo={pollLogo}
                                onLogoChange={setPollLogo}
                                tier={poll.tier}
                            />
                        ) : (
                            <div className="text-center py-4 opacity-60">
                                <ImageIcon size={32} className="mx-auto mb-2 text-slate-300" />
                                <p className="text-sm text-slate-500">Add your logo to polls</p>
                                <p className="text-xs text-slate-400">Available on Pro Event & Business</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Theme */}
                    <div className="pt-4 border-t">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label>
                        <ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2"
                    >
                        <X size={18} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !title.trim()}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={18} /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteGeneratorEdit;
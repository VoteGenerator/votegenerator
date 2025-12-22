// ============================================================================
// VoteGeneratorCreate - FORM ONLY (parent handles headers)
// Uses sessionStorage for ad wall redirect to avoid URL encoding issues
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Loader2, BarChart2, Sparkles, Eye, AlertCircle, ListOrdered, CheckSquare, Calendar, ChevronDown, ChevronUp, Lock, SlidersHorizontal, Image as ImageIcon, Smartphone, Monitor, Users, ArrowLeftRight, MessageCircle, Clock, Share2, QrCode, Zap, Crown, CreditCard, X } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { useGeoPricing } from '../geoPricing';

type PollTier = 'free' | 'starter' | 'pro_event' | 'unlimited';

const TIER_CONFIG: Record<PollTier, { label: string; colors: string; maxDays: number }> = {
    free: { label: '', colors: '', maxDays: 7 },
    starter: { label: 'STARTER', colors: 'bg-blue-500 text-white', maxDays: 30 },
    pro_event: { label: 'PRO', colors: 'bg-purple-600 text-white', maxDays: 60 },
    unlimited: { label: 'UNLIMITED', colors: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', maxDays: 365 }
};

const POLL_TYPES = [
    { id: 'multiple', name: 'Multiple Choice', icon: CheckSquare, shortDesc: 'Pick one or more', gradient: 'from-blue-500 to-indigo-500', tier: 'free' as PollTier },
    { id: 'ranked', name: 'Ranked Choice', icon: ListOrdered, shortDesc: 'Drag to rank', gradient: 'from-indigo-500 to-purple-500', tier: 'free' as PollTier },
    { id: 'pairwise', name: 'This or That', icon: ArrowLeftRight, shortDesc: 'A vs B comparisons', gradient: 'from-orange-500 to-red-500', tier: 'free' as PollTier },
    { id: 'meeting', name: 'Meeting Poll', icon: Calendar, shortDesc: 'Find best time', gradient: 'from-amber-500 to-orange-500', tier: 'free' as PollTier },
    { id: 'rating', name: 'Rating Scale', icon: SlidersHorizontal, shortDesc: 'Rate 1-5 stars', gradient: 'from-cyan-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'rsvp', name: 'RSVP', icon: Users, shortDesc: 'Event attendance', gradient: 'from-sky-500 to-blue-500', tier: 'free' as PollTier },
    { id: 'image', name: 'Visual Poll', icon: ImageIcon, shortDesc: 'Vote on images', gradient: 'from-pink-500 to-rose-500', tier: 'pro_event' as PollTier }
];

const PLACEHOLDER_QUESTIONS = ["Where should we eat lunch?", "What movie should we watch?", "Which design do you prefer?"];

// How It Works
const HowItWorks: React.FC = () => (
    <div className="mb-8">
        <div className="grid grid-cols-3 gap-4">
            {[
                { num: '1', title: 'Choose Type', icon: CheckSquare, color: 'from-blue-500 to-indigo-500' },
                { num: '2', title: 'Add Question', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
                { num: '3', title: 'Share & Collect', icon: Share2, color: 'from-amber-500 to-orange-500' },
            ].map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <step.icon className="text-white" size={20} />
                    </div>
                    <div className="text-xs text-indigo-600 font-bold">Step {step.num}</div>
                    <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                </motion.div>
            ))}
        </div>
    </div>
);

// Paywall Modal with Geo Pricing
const PaywallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { loading, currency, prices } = useGeoPricing();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full transition z-10"><X size={20} className="text-slate-500" /></button>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Crown size={24} /></div>
                        <div><h3 className="text-xl font-bold">Upgrade to Pro Event</h3><p className="text-purple-100 text-sm">Unlock Visual Poll & more</p></div>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4"><strong>Visual Poll</strong> lets you upload images as poll options — perfect for design feedback and photo contests.</p>
                    <div className="bg-purple-50 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-purple-900 mb-2">Pro Event includes:</h4>
                        <ul className="space-y-2 text-sm text-purple-700">
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> Visual Poll (images)</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> 2,000 responses</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> 60 days active</li>
                            <li className="flex items-center gap-2"><CheckSquare size={14} className="text-purple-500" /> Export PDF & PNG</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            {loading ? <span className="text-3xl font-bold text-slate-300">...</span> : <><span className="text-3xl font-bold text-slate-900">{prices.symbol}{prices.proEvent}</span><span className="text-slate-500 ml-1">{currency}</span></>}
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">One-time</span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">Maybe Later</button>
                        <a href="/.netlify/functions/vg-checkout?tier=pro_event" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2">
                            <CreditCard size={18} /> Upgrade
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const VoteGeneratorCreate: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '']);
    const [pollType, setPollType] = useState('multiple');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [placeholderQuestion] = useState(() => PLACEHOLDER_QUESTIONS[Math.floor(Math.random() * PLACEHOLDER_QUESTIONS.length)]);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [multipleSelection, setMultipleSelection] = useState(false);
    const [requireNames, setRequireNames] = useState(false);
    const [hideResults, setHideResults] = useState(false);
    const [buttonText, setButtonText] = useState('Submit Vote');
    const [deadline, setDeadline] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('default');
    const [showPaywall, setShowPaywall] = useState(false);

    const selectedPollType = POLL_TYPES.find(p => p.id === pollType);
    const currentTier = selectedPollType?.tier || 'free';
    const maxDays = TIER_CONFIG[currentTier].maxDays;

    const duplicateIndices = useMemo(() => {
        const indices = new Set<number>();
        const seen = new Map<string, number>();
        options.forEach((opt, index) => {
            const n = opt.trim().toLowerCase();
            if (n === '') return;
            if (seen.has(n)) { indices.add(index); indices.add(seen.get(n)!); }
            else { seen.set(n, index); }
        });
        return indices;
    }, [options]);

    const hasDuplicates = duplicateIndices.size > 0;
    const getMaxDeadline = () => { const m = new Date(); m.setDate(m.getDate() + maxDays); return m.toISOString().slice(0, 16); };
    const addOption = () => { if (options.length < 20) setOptions([...options, '']); };
    const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
    const updateOption = (i: number, v: string) => { const n = [...options]; n[i] = v; setOptions(n); if (error?.includes('Duplicate')) setError(null); };

    const handlePollTypeSelect = (id: string) => {
        const type = POLL_TYPES.find(p => p.id === id);
        if (type?.tier !== 'free') setShowPaywall(true);
        else setPollType(id);
    };

    const handleCreate = async () => {
        if (!title.trim()) { setError('Please enter a question'); return; }
        const valid = options.filter(o => o.trim());
        if (valid.length < 2) { setError('Add at least 2 options'); return; }
        if (hasDuplicates) { setError('Remove duplicate options'); return; }
        setIsCreating(true); setError(null);
        try {
            const pollData = { title: title.trim(), description: description.trim() || undefined, options: valid, pollType, settings: { allowMultiple: multipleSelection, requireNames, hideResults, deadline: deadline ? new Date(deadline).toISOString() : undefined }, buttonText: buttonText || 'Submit Vote', tier: currentTier };
            const res = await fetch('/.netlify/functions/vg-create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pollData) });
            if (res.ok) { 
                const r = await res.json(); 
                // Store the destination in sessionStorage to avoid URL encoding issues
                const pollUrl = `/#id=${r.id}&admin=${r.adminKey}`;
                sessionStorage.setItem('vg_ad_wall_next', pollUrl);
                window.location.href = '/ad-wall';
            }
            else { const e = await res.json(); setError(e.error || 'Failed to create poll'); }
        } catch (e: any) { setError(e.message || 'Failed'); } finally { setIsCreating(false); }
    };

    return (
        <>
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
            <HowItWorks />
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {/* Poll Type */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center"><BarChart2 className="text-white" size={18} /></div>
                            Choose Poll Type
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-3">
                            {POLL_TYPES.map((type, i) => {
                                const Icon = type.icon;
                                const isSelected = pollType === type.id;
                                const tierConfig = TIER_CONFIG[type.tier];
                                const isPaid = type.tier !== 'free';
                                return (
                                    <motion.div key={type.id} className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                        {tierConfig.label && <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-md z-20 ${tierConfig.colors}`}>{tierConfig.label}</span>}
                                        <button onClick={() => handlePollTypeSelect(type.id)}
                                            className={`relative w-full p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200' : isPaid ? 'border-purple-200 hover:border-purple-400 bg-purple-50/30' : 'border-slate-200 hover:border-indigo-300 bg-white hover:shadow-md'}`}>
                                            {isPaid && <div className="absolute top-2 left-2"><Lock size={12} className="text-purple-500" /></div>}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-gradient-to-br ${type.gradient} shadow-md`}><Icon className="text-white" size={20} /></div>
                                            <div className="font-semibold text-sm">{type.name}</div>
                                            <div className="text-[11px] text-slate-500 mt-1">{type.shortDesc}</div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Question & Options */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center"><Sparkles className="text-white" size={18} /></div>
                            Your Question & Options
                        </h2>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Question *</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholderQuestion} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-slate-50 focus:bg-white" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description <span className="text-slate-400">(optional)</span></label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add context..." rows={2} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-slate-700">Options *</label>
                                {hasDuplicates && <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1"><AlertCircle size={14} /> Duplicates</span>}
                            </div>
                            <div className="space-y-3">
                                {options.map((opt, i) => (
                                    <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <div className="flex-1 relative">
                                            <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`}
                                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500'}`} />
                                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${duplicateIndices.has(i) ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
                                        </div>
                                        {options.length > 2 && <button onClick={() => removeOption(i)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>}
                                    </motion.div>
                                ))}
                            </div>
                            {options.length < 20 && <button onClick={addOption} className="mt-4 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 w-full justify-center"><Plus size={18} />Add Option</button>}
                        </div>
                    </motion.div>

                    {/* Settings */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                            <span className="font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center"><SlidersHorizontal className="text-white" size={18} /></div>
                                Settings
                            </span>
                            {showAdvanced ? <ChevronUp size={20} className="text-indigo-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200">
                                    <div className="p-6 space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-slate-700">Close poll on</span><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Max {maxDays} days</span></label>
                                            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} min={new Date().toISOString().slice(0, 16)} max={getMaxDeadline()} className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        {pollType === 'multiple' && (
                                            <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                                <span className="font-medium text-slate-700">Allow multiple selections</span>
                                                <input type="checkbox" checked={multipleSelection} onChange={(e) => setMultipleSelection(e.target.checked)} className="w-5 h-5 rounded" />
                                            </label>
                                        )}
                                        <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                            <span className="font-medium text-slate-700">Require voter names</span>
                                            <input type="checkbox" checked={requireNames} onChange={(e) => setRequireNames(e.target.checked)} className="w-5 h-5 rounded" />
                                        </label>
                                        <label className="flex items-center justify-between p-4 rounded-xl hover:bg-indigo-50 cursor-pointer">
                                            <span className="font-medium text-slate-700">Hide results until closed</span>
                                            <input type="checkbox" checked={hideResults} onChange={(e) => setHideResults(e.target.checked)} className="w-5 h-5 rounded" />
                                        </label>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Button text</label>
                                            <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Submit Vote" className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm" />
                                        </div>
                                        <div className="pt-4 border-t"><label className="block text-sm font-semibold text-slate-700 mb-2">Theme</label><ThemeSelector selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} /></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {error && <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3"><AlertCircle className="text-red-600" size={20} /><p className="text-red-700 font-medium">{error}</p></div>}

                    <motion.button onClick={handleCreate} disabled={isCreating || !title.trim() || options.filter(o => o.trim()).length < 2 || hasDuplicates} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg">
                        {isCreating ? <><Loader2 className="animate-spin" size={22} />Creating...</> : <><Sparkles size={20} />Create Poll<ArrowRight size={22} /></>}
                    </motion.button>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky top-24">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Eye size={18} className="text-indigo-500" />Live Preview</h3>
                                <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
                                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-indigo-100' : ''}`}><Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-indigo-100' : ''}`}><Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} /></button>
                                </div>
                            </div>
                            <div className={`p-6 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                                <h4 className="text-lg font-bold text-slate-900 mb-4">{title || placeholderQuestion}</h4>
                                {description && <p className="text-slate-600 text-sm mb-4">{description}</p>}
                                <div className="space-y-2 mb-4">
                                    {options.slice(0, 5).map((opt, i) => (
                                        <div key={i} className={`p-3 border-2 rounded-xl ${duplicateIndices.has(i) ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                            <span className="text-slate-700">{opt || `Option ${i + 1}`}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">{buttonText || 'Submit Vote'}</button>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Zap size={16} />Tips</h4>
                            <ul className="text-sm text-amber-700 space-y-1"><li>• Keep questions clear</li><li>• 4-6 options works best</li><li>• Save your admin link</li></ul>
                        </div>
                        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                            <h4 className="font-bold text-emerald-800 mb-2">You'll Get</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-emerald-700">
                                <div className="flex items-center gap-2"><QrCode size={14} />QR Code</div>
                                <div className="flex items-center gap-2"><Share2 size={14} />Share Link</div>
                                <div className="flex items-center gap-2"><BarChart2 size={14} />Live Results</div>
                                <div className="flex items-center gap-2"><Zap size={14} />Instant</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default VoteGeneratorCreate;
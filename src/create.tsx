import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
    CheckSquare, ListOrdered, Calendar, ArrowLeftRight, CircleDot,
    SlidersHorizontal, Coins, LayoutGrid, ThumbsUp, HelpCircle,
    Smile, Image, ArrowRight, Lock, Sparkles, Plus, Trash2,
    Eye, Monitor, Smartphone, Palette, GripVertical, Check, Loader2
} from 'lucide-react';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import './index.css';

// Poll types - simplified: FREE or PAID
const pollTypes = [
    { id: 'multiple-choice', name: 'Multiple Choice', icon: CheckSquare, description: 'Pick one or more', isFree: true, apiType: 'multiple' },
    { id: 'ranked-choice', name: 'Ranked Choice', icon: ListOrdered, description: 'Drag to rank', isFree: true, apiType: 'ranked' },
    { id: 'this-or-that', name: 'This or That', icon: ArrowLeftRight, description: 'A vs B', isFree: true, apiType: 'multiple' },
    { id: 'meeting-poll', name: 'Meeting Poll', icon: Calendar, description: 'Find best time', isFree: false, apiType: 'meeting' },
    { id: 'dot-voting', name: 'Dot Voting', icon: CircleDot, description: 'Distribute votes', isFree: false, apiType: 'multiple' },
    { id: 'rating-scale', name: 'Rating Scale', icon: SlidersHorizontal, description: 'Rate 1-5', isFree: false, apiType: 'multiple' },
    { id: 'buy-a-feature', name: 'Buy a Feature', icon: Coins, description: 'Spend points', isFree: false, apiType: 'multiple' },
    { id: 'approval-voting', name: 'Approval Voting', icon: ThumbsUp, description: 'Approve all you like', isFree: false, apiType: 'multiple' },
    { id: 'quiz-poll', name: 'Quiz Poll', icon: HelpCircle, description: 'With correct answer', isFree: false, apiType: 'multiple' },
    { id: 'sentiment-check', name: 'Sentiment Check', icon: Smile, description: 'Emoji reactions', isFree: false, apiType: 'multiple' },
    { id: 'visual-poll', name: 'Visual Poll', icon: Image, description: 'Vote with images', isFree: false, apiType: 'image' },
];

// Themes
const themes = [
    { id: 'classic', name: 'Indigo', primary: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' },
    { id: 'ocean', name: 'Ocean', primary: '#0891B2', gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)' },
    { id: 'sunset', name: 'Sunset', primary: '#EA580C', gradient: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)' },
    { id: 'forest', name: 'Forest', primary: '#059669', gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)' },
    { id: 'grape', name: 'Grape', primary: '#7C3AED', gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)' },
    { id: 'rose', name: 'Rose', primary: '#E11D48', gradient: 'linear-gradient(135deg, #BE123C 0%, #F43F5E 100%)' },
];

function CreatePage() {
    // Form state
    const [selectedType, setSelectedType] = useState('multiple-choice');
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [selectedTheme, setSelectedTheme] = useState('classic');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    
    // UI state
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedPollType = pollTypes.find(p => p.id === selectedType);
    const isPaidType = selectedPollType && !selectedPollType.isFree;
    const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];
    const validOptions = options.filter(o => o.trim());

    // Option handlers
    const addOption = () => {
        if (options.length < 20) {
            setOptions([...options, '']);
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    // CREATE POLL HANDLER - This is the key function!
    const handleCreate = async () => {
        // Validation
        if (!question.trim()) {
            setError('Please add a question or title');
            return;
        }
        if (validOptions.length < 2) {
            setError('Please add at least 2 options');
            return;
        }

        setError(null);
        setIsCreating(true);

        // Get the API poll type
        const apiPollType = selectedPollType?.apiType || 'multiple';

        // Build the data that matches your vg-create.ts API
        const pollData = {
            title: question.trim(),
            description: description.trim() || undefined,
            options: validOptions, // string[]
            pollType: apiPollType, // 'ranked' | 'multiple' | 'image' | 'meeting'
            settings: {
                hideResults: false,
                allowMultiple: false
            }
        };

        if (selectedPollType?.isFree) {
            // FREE POLL: Create directly via API
            try {
                console.log('Creating free poll:', pollData);
                
                const response = await fetch('/.netlify/functions/vg-create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pollData)
                });

                const result = await response.json();
                console.log('API response:', result);

                if (response.ok && result.id && result.adminKey) {
                    // Success! Redirect to dashboard
                    window.location.href = `/#id=${result.id}&admin=${result.adminKey}`;
                } else {
                    setError(result.error || 'Failed to create poll');
                    setIsCreating(false);
                }
            } catch (err) {
                console.error('Error creating poll:', err);
                setError('Network error. Please try again.');
                setIsCreating(false);
            }
        } else {
            // PAID POLL: Save to localStorage and redirect to checkout
            localStorage.setItem('pollDraft', JSON.stringify(pollData));
            window.location.href = '/checkout.html?plan=quick_poll';
        }
    };

    // Live Preview Component
    const LivePreview = () => (
        <div 
            className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${
                previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'
            }`}
            style={{ borderColor: currentTheme.primary + '40' }}
        >
            {/* Browser Chrome */}
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
                    votegenerator.com/vote/abc123
                </div>
            </div>
            
            {/* Poll Preview */}
            <div className="bg-white p-6">
                <div 
                    className="rounded-xl p-6 mb-6 text-white"
                    style={{ background: currentTheme.gradient }}
                >
                    <h3 className="text-xl font-bold">
                        {question || 'Your question here...'}
                    </h3>
                    {description && (
                        <p className="text-white/80 mt-2 text-sm">{description}</p>
                    )}
                </div>

                <div className="space-y-3">
                    {(validOptions.length > 0 ? validOptions : ['Option 1', 'Option 2']).map((opt, i) => (
                        <div 
                            key={i}
                            className="p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center gap-3"
                        >
                            <div 
                                className="w-5 h-5 rounded-full border-2"
                                style={{ borderColor: currentTheme.primary }}
                            />
                            <span className="text-slate-700">{opt || `Option ${i + 1}`}</span>
                        </div>
                    ))}
                </div>

                <button 
                    className="w-full mt-6 py-3 rounded-xl font-bold text-white transition-all"
                    style={{ background: currentTheme.gradient }}
                >
                    Submit Vote
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />
            
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-800 mb-4">
                            Create Your Poll
                        </h1>
                        <p className="text-xl text-slate-600">
                            Choose a type, add your options, and share instantly
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Poll Type Selection */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">1. Choose Poll Type</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {pollTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                                                selectedType === type.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <type.icon size={20} className={selectedType === type.id ? 'text-indigo-600' : 'text-slate-400'} />
                                            <div className="mt-2">
                                                <span className={`text-sm font-medium block ${selectedType === type.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                    {type.name}
                                                </span>
                                                <span className="text-xs text-slate-500">{type.description}</span>
                                            </div>
                                            {/* FREE / PAID badge */}
                                            <span className={`absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                                type.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {type.isFree ? 'FREE' : 'PAID'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Question & Options */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">2. Add Your Content</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Question or Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            placeholder="What should we decide?"
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Description (optional)
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Add context or instructions..."
                                            rows={2}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Options * (at least 2)
                                        </label>
                                        <div className="space-y-2">
                                            {options.map((opt, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => updateOption(index, e.target.value)}
                                                        placeholder={`Option ${index + 1}`}
                                                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    />
                                                    {options.length > 2 && (
                                                        <button
                                                            onClick={() => removeOption(index)}
                                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {options.length < 20 && (
                                            <button
                                                onClick={addOption}
                                                className="mt-2 w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition flex items-center justify-center gap-2"
                                            >
                                                <Plus size={18} />
                                                Add Option
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">3. Pick a Theme</h2>
                                <div className="flex flex-wrap gap-2">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`w-10 h-10 rounded-xl transition-all ${
                                                selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''
                                            }`}
                                            style={{ background: theme.gradient }}
                                            title={theme.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Create Button */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                                {isPaidType ? (
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg mb-4">
                                            <Lock size={16} />
                                            <span className="font-semibold">{selectedPollType?.name} requires a paid plan</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button
                                                onClick={handleCreate}
                                                disabled={!question.trim() || validOptions.length < 2 || isCreating}
                                                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isCreating ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={18} />
                                                        Continue to Checkout
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setSelectedType('multiple-choice')}
                                                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                                            >
                                                Use Free Poll Type
                                            </button>
                                        </div>
                                        {error && (
                                            <p className="text-red-200 text-sm mt-3">{error}</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!question.trim() || validOptions.length < 2 || isCreating}
                                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                                question.trim() && validOptions.length >= 2 && !isCreating
                                                    ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                                                    : 'bg-white/30 text-white/70 cursor-not-allowed'
                                            }`}
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    Create Poll
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>
                                        {error && (
                                            <p className="text-center text-red-200 text-sm mt-2">{error}</p>
                                        )}
                                        <p className="text-center text-sm text-indigo-200 mt-3">
                                            Free • No signup • Shareable link in seconds
                                        </p>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Right: Live Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:sticky lg:top-24 lg:self-start"
                        >
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Eye size={18} />
                                        Live Preview
                                    </h3>
                                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setPreviewDevice('desktop')}
                                            className={`p-2 rounded-md transition ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}
                                        >
                                            <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                        </button>
                                        <button
                                            onClick={() => setPreviewDevice('mobile')}
                                            className={`p-2 rounded-md transition ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}
                                        >
                                            <Smartphone size={16} className={previewDevice === 'mobile' ? 'text-indigo-600' : 'text-slate-400'} />
                                        </button>
                                    </div>
                                </div>
                                <LivePreview />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Mount
const container = document.getElementById('root');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <CreatePage />
        </React.StrictMode>
    );
}

export default CreatePage;
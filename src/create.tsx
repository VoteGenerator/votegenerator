import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
    CheckSquare, 
    ListOrdered, 
    Calendar, 
    ArrowLeftRight, 
    CircleDot, 
    SlidersHorizontal,
    Coins,
    LayoutGrid,
    ThumbsUp,
    HelpCircle,
    Smile,
    Image,
    ArrowRight,
    Lock,
    Sparkles,
    Plus,
    Trash2,
    Eye,
    Monitor,
    Smartphone,
    Palette,
    Lightbulb,
    GripVertical,
    Check
} from 'lucide-react';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import './index.css';

// Poll types configuration
const pollTypes = [
    { id: 'multiple-choice', name: 'Multiple Choice', icon: CheckSquare, description: 'Pick one or more', free: true },
    { id: 'ranked-choice', name: 'Ranked Choice', icon: ListOrdered, description: 'Drag to rank', free: true },
    { id: 'meeting-poll', name: 'Meeting Poll', icon: Calendar, description: 'Find best time', free: true },
    { id: 'this-or-that', name: 'This or That', icon: ArrowLeftRight, description: 'A vs B', free: true },
    { id: 'dot-voting', name: 'Dot Voting', icon: CircleDot, description: 'Distribute votes', free: true },
    { id: 'rating-scale', name: 'Rating Scale', icon: SlidersHorizontal, description: 'Rate 1-5', free: true },
    { id: 'buy-a-feature', name: 'Buy a Feature', icon: Coins, description: 'Spend points', free: true },
    { id: 'priority-matrix', name: 'Priority Matrix', icon: LayoutGrid, description: 'Effort vs Impact', free: true },
    { id: 'approval-voting', name: 'Approval Voting', icon: ThumbsUp, description: 'Approve all you like', free: true },
    { id: 'quiz-poll', name: 'Quiz Poll', icon: HelpCircle, description: 'With correct answer', tier: '$5+' },
    { id: 'sentiment-check', name: 'Sentiment Check', icon: Smile, description: 'Emoji reactions', tier: '$5+' },
    { id: 'visual-poll', name: 'Visual Poll', icon: Image, description: 'Vote with images', tier: 'PRO' },
];

// Theme configurations
const themes = [
    { id: 'classic', name: 'Classic Blue', primary: '#4F46E5', secondary: '#818CF8', bg: '#EEF2FF' },
    { id: 'ocean', name: 'Ocean Breeze', primary: '#0891B2', secondary: '#22D3EE', bg: '#ECFEFF' },
    { id: 'sunset', name: 'Sunset Glow', primary: '#EA580C', secondary: '#FB923C', bg: '#FFF7ED' },
    { id: 'forest', name: 'Forest Green', primary: '#059669', secondary: '#34D399', bg: '#ECFDF5' },
    { id: 'grape', name: 'Grape Vine', primary: '#7C3AED', secondary: '#A78BFA', bg: '#F5F3FF' },
    { id: 'rose', name: 'Rose Garden', primary: '#E11D48', secondary: '#FB7185', bg: '#FFF1F2' },
    { id: 'midnight', name: 'Midnight', primary: '#1E40AF', secondary: '#60A5FA', bg: '#EFF6FF' },
    { id: 'coral', name: 'Coral Reef', primary: '#DC2626', secondary: '#F87171', bg: '#FEF2F2' },
];

function CreatePage() {
    const [selectedType, setSelectedType] = useState('multiple-choice');
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [selectedTheme, setSelectedTheme] = useState('classic');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [customColor, setCustomColor] = useState('#4F46E5');
    const [useCustomColor, setUseCustomColor] = useState(false);

    const selectedPollType = pollTypes.find(p => p.id === selectedType);
    const isPaidType = selectedPollType && !selectedPollType.free;
    const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];
    const activeColor = useCustomColor ? customColor : currentTheme.primary;

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

    const validOptions = options.filter(o => o.trim());

    // Live Preview Component
    const LivePreview = () => (
        <div 
            className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${
                previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'
            }`}
            style={{ borderColor: activeColor + '40' }}
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
            <div className="bg-white p-6" style={{ backgroundColor: currentTheme.bg + '50' }}>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {question || 'Your Question Here'}
                </h3>
                
                {description && (
                    <p className="text-slate-500 text-sm mb-4">{description}</p>
                )}
                
                <div 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
                    style={{ backgroundColor: activeColor + '20', color: activeColor }}
                >
                    {selectedPollType && <selectedPollType.icon size={12} />}
                    {selectedPollType?.name}
                </div>

                {validOptions.length > 0 ? (
                    <div className="space-y-2">
                        {validOptions.map((opt, i) => (
                            <div 
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl border-2 bg-white hover:shadow-sm transition-all cursor-pointer"
                                style={{ borderColor: i === 0 ? activeColor : '#E2E8F0' }}
                            >
                                {selectedType === 'ranked-choice' ? (
                                    <>
                                        <GripVertical size={16} className="text-slate-300" />
                                        <div 
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                            style={{ backgroundColor: activeColor }}
                                        >
                                            {i + 1}
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                                        style={{ borderColor: i === 0 ? activeColor : '#CBD5E1' }}
                                    >
                                        {i === 0 && (
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: activeColor }}
                                            />
                                        )}
                                    </div>
                                )}
                                <span className="text-slate-700">{opt}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        Add options to see preview
                    </div>
                )}

                <button 
                    className="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-all"
                    style={{ backgroundColor: activeColor }}
                >
                    Submit Vote
                </button>
            </div>

            {/* Tip */}
            <div 
                className="px-4 py-3 flex items-center gap-2 text-sm"
                style={{ backgroundColor: activeColor + '10', color: activeColor }}
            >
                <Lightbulb size={16} />
                <span>Tip: Keep options short and clear for better engagement.</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />
            
            {/* Header */}
            <div className="pt-8 pb-4 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                        Create Your Poll
                    </h1>
                    <p className="text-slate-500">
                        No signup required • Free forever • Ready in seconds
                    </p>
                </motion.div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Poll Type */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                Poll Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {pollTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                                            selectedType === type.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                    >
                                        {type.tier && (
                                            <span className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                                                type.tier === 'PRO' 
                                                    ? 'bg-indigo-600 text-white' 
                                                    : 'bg-amber-500 text-white'
                                            }`}>
                                                {type.tier}
                                            </span>
                                        )}
                                        <type.icon size={18} className={selectedType === type.id ? 'text-indigo-600' : 'text-slate-400'} />
                                        <p className={`font-semibold text-xs mt-1 ${selectedType === type.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                            {type.name}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Poll Type Description */}
                            <div 
                                className="mt-4 p-3 rounded-xl text-sm"
                                style={{ backgroundColor: activeColor + '10', borderLeft: `4px solid ${activeColor}` }}
                            >
                                <span className="font-semibold" style={{ color: activeColor }}>{selectedPollType?.name}:</span>{' '}
                                <span className="text-slate-600">"{selectedPollType?.description}"</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                Your Question <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Which design do you prefer?"
                                className="w-full mt-3 px-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                            
                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mt-4 block">
                                Details <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add extra info or instructions..."
                                rows={2}
                                className="w-full mt-3 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Options */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                    Options <span className="text-red-500">*</span>
                                </label>
                                <span className="text-sm text-slate-400">{options.length} / 20</span>
                            </div>
                            
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-slate-400 text-sm w-6">{index + 1}.</span>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        {options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                                    className="mt-3 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
                                >
                                    <Plus size={16} />
                                    Add option
                                </button>
                            )}
                        </div>

                        {/* Theme & Colors */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                    <Palette size={16} />
                                    Poll Theme
                                </label>
                                <button 
                                    onClick={() => setUseCustomColor(!useCustomColor)}
                                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                >
                                    {useCustomColor ? '← Use Themes' : 'Custom Color →'}
                                </button>
                            </div>
                            
                            {useCustomColor ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">Choose your brand color:</p>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={customColor}
                                            onChange={(e) => setCustomColor(e.target.value)}
                                            className="w-16 h-16 rounded-xl cursor-pointer border-2 border-slate-200"
                                        />
                                        <div>
                                            <p className="font-mono text-sm text-slate-600">{customColor.toUpperCase()}</p>
                                            <p className="text-xs text-slate-400">Click to change</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {['#4F46E5', '#059669', '#EA580C', '#E11D48', '#7C3AED', '#0891B2'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setCustomColor(color)}
                                                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`p-3 rounded-xl border-2 transition-all ${
                                                selectedTheme === theme.id
                                                    ? 'border-slate-800 bg-slate-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex gap-1 mb-2 justify-center">
                                                <div 
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: theme.primary }}
                                                />
                                                <div 
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: theme.secondary }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-slate-600 text-center">{theme.name}</p>
                                            {selectedTheme === theme.id && (
                                                <Check size={12} className="mx-auto mt-1 text-slate-800" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Create Button */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                            {isPaidType ? (
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg mb-4">
                                        <Lock size={16} />
                                        <span className="font-semibold">{selectedPollType?.name} requires {selectedPollType?.tier} plan</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a
                                            href="/pricing.html"
                                            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all inline-flex items-center justify-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            Upgrade to Unlock
                                        </a>
                                        <button
                                            onClick={() => setSelectedType('multiple-choice')}
                                            className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                                        >
                                            Use Free Poll Type
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <button
                                        disabled={!question.trim() || validOptions.length < 2}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                            question.trim() && validOptions.length >= 2
                                                ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                                                : 'bg-white/30 text-white/70 cursor-not-allowed'
                                        }`}
                                    >
                                        Create Poll
                                        <ArrowRight size={20} />
                                    </button>
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
                                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                                    <button
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                                    >
                                        <Monitor size={16} className={previewDevice === 'desktop' ? 'text-indigo-600' : 'text-slate-400'} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
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
            
            <Footer />
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <CreatePage />
        </React.StrictMode>
    );
}
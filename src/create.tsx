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
    Sparkles
} from 'lucide-react';
import NavHeader from './components/NavHeader';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import './index.css';

// Poll types configuration
const pollTypes = [
    { id: 'multiple-choice', name: 'Multiple Choice', icon: CheckSquare, description: 'Pick one or more options', free: true },
    { id: 'ranked-choice', name: 'Ranked Choice', icon: ListOrdered, description: 'Drag to rank preferences', free: true },
    { id: 'meeting-poll', name: 'Meeting Poll', icon: Calendar, description: 'Find the best time', free: true },
    { id: 'this-or-that', name: 'This or That', icon: ArrowLeftRight, description: 'A vs B comparison', free: true },
    { id: 'dot-voting', name: 'Dot Voting', icon: CircleDot, description: 'Distribute your votes', free: true },
    { id: 'rating-scale', name: 'Rating Scale', icon: SlidersHorizontal, description: 'Rate 1-5 or 1-10', free: true },
    { id: 'buy-a-feature', name: 'Buy a Feature', icon: Coins, description: 'Spend points on priorities', free: true },
    { id: 'priority-matrix', name: 'Priority Matrix', icon: LayoutGrid, description: 'Effort vs Impact grid', free: true },
    { id: 'approval-voting', name: 'Approval Voting', icon: ThumbsUp, description: 'Approve all you like', free: true },
    { id: 'quiz-poll', name: 'Quiz Poll', icon: HelpCircle, description: 'Poll with correct answer', tier: '$5+' },
    { id: 'sentiment-check', name: 'Sentiment Check', icon: Smile, description: 'Quick emoji reactions', tier: '$5+' },
    { id: 'visual-poll', name: 'Visual Poll', icon: Image, description: 'Vote with images', tier: 'PRO' },
];

function CreatePage() {
    const [selectedType, setSelectedType] = useState('multiple-choice');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const selectedPollType = pollTypes.find(p => p.id === selectedType);
    const isPaidType = selectedPollType && !selectedPollType.free;

    const addOption = () => {
        if (options.length < 10) {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
            <NavHeader />
            
            {/* Simple Header */}
            <div className="pt-8 pb-6 px-4 text-center bg-gradient-to-b from-indigo-50 to-white">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                    Create Your Poll
                </h1>
                <p className="text-slate-500 mt-2">
                    No signup required • Free forever • Ready in seconds
                </p>
            </div>
            
            {/* Poll Creation Form */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Step 1: Choose Poll Type */}
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                            Choose Poll Type
                        </h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {pollTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                                        selectedType === type.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    {type.tier && (
                                        <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                            type.tier === 'PRO' 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'bg-amber-500 text-white'
                                        }`}>
                                            {type.tier}
                                        </span>
                                    )}
                                    <type.icon size={20} className={selectedType === type.id ? 'text-indigo-600' : 'text-slate-500'} />
                                    <p className={`font-semibold text-sm mt-2 ${selectedType === type.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                        {type.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Write Your Question */}
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                            Write Your Question
                        </h2>
                        
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What would you like to ask?"
                            className="w-full px-4 py-3 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Step 3: Add Options */}
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                            Add Options
                        </h2>
                        
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    {options.length > 2 && (
                                        <button
                                            onClick={() => removeOption(index)}
                                            className="px-3 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {options.length < 10 && (
                            <button
                                onClick={addOption}
                                className="mt-3 text-indigo-600 font-semibold text-sm hover:text-indigo-700"
                            >
                                + Add another option
                            </button>
                        )}
                    </div>

                    {/* Create Button */}
                    <div className="p-6 bg-slate-50">
                        {isPaidType ? (
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg mb-4">
                                    <Lock size={16} />
                                    <span className="font-semibold">{selectedPollType?.name} requires {selectedPollType?.tier} plan</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <a
                                        href="/pricing.html"
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={18} />
                                        Upgrade to Unlock
                                    </a>
                                    <button
                                        onClick={() => setSelectedType('multiple-choice')}
                                        className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Use Free Poll Type
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                                    question.trim() && options.filter(o => o.trim()).length >= 2
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                Create Poll
                                <ArrowRight size={20} />
                            </button>
                        )}
                        
                        <p className="text-center text-xs text-slate-500 mt-4">
                            Free • No signup • Shareable link in seconds
                        </p>
                    </div>
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
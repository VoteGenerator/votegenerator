import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    GripVertical, 
    Star, 
    Check, 
    ThumbsUp, 
    ThumbsDown,
    Minus,
    ArrowLeftRight
} from 'lucide-react';

interface PollTypePreviewProps {
    pollTypeId: string;
    question: string;
    options: string[];
}

// Multiple Choice Preview
const MultipleChoicePreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<string | null>(null);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Pick your favorite:</p>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(opt)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            selected === opt
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-indigo-200'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selected === opt ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                        }`}>
                            {selected === opt && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-slate-700">{opt}</span>
                    </button>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Vote →
            </button>
        </div>
    );
};

// Ranked Choice Preview - Drag to rank
const RankedChoicePreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [ranking, setRanking] = useState(options);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Drag to rank from favorite to least:</p>
            <div className="space-y-2">
                {ranking.map((opt, i) => (
                    <div
                        key={opt}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 bg-slate-50 cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical size={18} className="text-slate-400" />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-amber-400 text-amber-900' :
                            i === 1 ? 'bg-slate-300 text-slate-700' :
                            i === 2 ? 'bg-amber-600 text-white' :
                            'bg-slate-200 text-slate-600'
                        }`}>
                            {i + 1}
                        </div>
                        <span className="text-slate-700 flex-1">{opt}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
                ↕️ Drag options to reorder your ranking
            </p>
            <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Submit Ranking →
            </button>
        </div>
    );
};

// Meeting Poll Preview - Availability grid
const MeetingPollPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [availability, setAvailability] = useState<Record<string, 'yes' | 'maybe' | 'no'>>({});
    
    const toggleAvailability = (opt: string) => {
        const current = availability[opt] || 'no';
        const next = current === 'no' ? 'yes' : current === 'yes' ? 'maybe' : 'no';
        setAvailability({ ...availability, [opt]: next });
    };
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Click to mark your availability:</p>
            <div className="space-y-2">
                {options.map((opt, i) => {
                    const status = availability[opt] || 'no';
                    return (
                        <button
                            key={i}
                            onClick={() => toggleAvailability(opt)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                                status === 'yes' ? 'border-green-500 bg-green-50' :
                                status === 'maybe' ? 'border-amber-500 bg-amber-50' :
                                'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-slate-700">📅 {opt}</span>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                status === 'yes' ? 'bg-green-500 text-white' :
                                status === 'maybe' ? 'bg-amber-500 text-white' :
                                'bg-slate-200 text-slate-500'
                            }`}>
                                {status === 'yes' ? '✓ Available' : status === 'maybe' ? '? Maybe' : 'Unavailable'}
                            </div>
                        </button>
                    );
                })}
            </div>
            <button className="w-full mt-4 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors">
                Submit Availability →
            </button>
        </div>
    );
};

// This or That Preview - Side by side
const ThisOrThatPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<number | null>(null);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1 text-center">{question}</h4>
            <p className="text-slate-500 text-sm mb-4 text-center">Click your preference:</p>
            <div className="flex gap-4">
                {options.slice(0, 2).map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
                            selected === i
                                ? 'border-orange-500 bg-orange-50 shadow-lg'
                                : 'border-slate-200 hover:border-orange-300'
                        }`}
                    >
                        <div className="text-2xl mb-2">{i === 0 ? '🅰️' : '🅱️'}</div>
                        <div className={`font-bold ${selected === i ? 'text-orange-700' : 'text-slate-700'}`}>
                            {opt}
                        </div>
                        {selected === i && (
                            <div className="mt-2 text-orange-600 text-sm font-medium">Selected ✓</div>
                        )}
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-center gap-2 my-4 text-slate-400">
                <div className="h-px bg-slate-200 flex-1" />
                <ArrowLeftRight size={16} />
                <div className="h-px bg-slate-200 flex-1" />
            </div>
            <button className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                Vote →
            </button>
        </div>
    );
};

// Dot Voting Preview - Allocate points
const DotVotingPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [dots, setDots] = useState<Record<string, number>>({});
    const totalDots = 5;
    const usedDots = Object.values(dots).reduce((sum, n) => sum + n, 0);
    const remaining = totalDots - usedDots;
    
    const addDot = (opt: string) => {
        if (remaining > 0) {
            setDots({ ...dots, [opt]: (dots[opt] || 0) + 1 });
        }
    };
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-2">Distribute {totalDots} dots across options:</p>
            <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: totalDots }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full transition-colors ${
                            i < remaining ? 'bg-teal-500' : 'bg-slate-200'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm text-slate-500">{remaining} remaining</span>
            </div>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => addDot(opt)}
                        disabled={remaining === 0}
                        className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-slate-200 hover:border-teal-300 transition-all disabled:opacity-50"
                    >
                        <span className="text-slate-700">{opt}</span>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: dots[opt] || 0 }).map((_, j) => (
                                <div key={j} className="w-4 h-4 rounded-full bg-teal-500" />
                            ))}
                            {(dots[opt] || 0) === 0 && (
                                <span className="text-slate-400 text-sm">Click to add</span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                Submit Votes →
            </button>
        </div>
    );
};

// Rating Scale Preview - Stars
const RatingScalePreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Rate each option 1-5 stars:</p>
            <div className="space-y-3">
                {options.map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-700 text-sm">{opt}</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRatings({ ...ratings, [opt]: star })}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star 
                                        size={20} 
                                        className={(ratings[opt] || 0) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors">
                Submit Ratings →
            </button>
        </div>
    );
};

// Buy a Feature Preview - Budget allocation
const BuyFeaturePreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [budget, setBudget] = useState<Record<string, number>>({});
    const totalBudget = 100;
    const spent = Object.values(budget).reduce((sum, n) => sum + n, 0);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-2">Spend ${totalBudget} on what matters most:</p>
            <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 rounded-lg">
                <span className="text-green-700 font-bold">${totalBudget - spent}</span>
                <span className="text-green-600 text-sm">remaining</span>
            </div>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-700 flex-1 text-sm">{opt}</span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setBudget({ ...budget, [opt]: Math.max(0, (budget[opt] || 0) - 10) })}
                                className="w-7 h-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-bold text-green-700">${budget[opt] || 0}</span>
                            <button 
                                onClick={() => spent < totalBudget && setBudget({ ...budget, [opt]: (budget[opt] || 0) + 10 })}
                                className="w-7 h-7 rounded bg-green-100 text-green-700 hover:bg-green-200"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Submit Budget →
            </button>
        </div>
    );
};

// Approval Voting Preview - Thumbs up/down
const ApprovalVotingPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Approve or reject each option:</p>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-700">{opt}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setVotes({ ...votes, [opt]: votes[opt] === 'up' ? null : 'up' })}
                                className={`p-2 rounded-lg transition-all ${
                                    votes[opt] === 'up' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:text-green-500'
                                }`}
                            >
                                <ThumbsUp size={18} />
                            </button>
                            <button
                                onClick={() => setVotes({ ...votes, [opt]: votes[opt] === 'down' ? null : 'down' })}
                                className={`p-2 rounded-lg transition-all ${
                                    votes[opt] === 'down' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 hover:text-red-500'
                                }`}
                            >
                                <ThumbsDown size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
                Submit Votes →
            </button>
        </div>
    );
};

// Quiz Poll Preview
const QuizPollPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);
    const correctAnswer = options[0]; // First option is correct in demo
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">🎯 {question}</h4>
            <p className="text-slate-500 text-sm mb-4">Pick your answer:</p>
            <div className="space-y-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => !revealed && setSelected(opt)}
                        disabled={revealed}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            revealed && opt === correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : revealed && opt === selected
                                    ? 'border-red-500 bg-red-50'
                                    : selected === opt
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-slate-200 hover:border-purple-300'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            revealed && opt === correctAnswer ? 'bg-green-500 text-white' :
                            revealed && opt === selected ? 'bg-red-500 text-white' :
                            'bg-slate-200 text-slate-600'
                        }`}>
                            {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-slate-700">{opt}</span>
                        {revealed && opt === correctAnswer && <Check size={18} className="ml-auto text-green-600" />}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => selected && setRevealed(true)}
                disabled={!selected || revealed}
                className="w-full mt-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
                {revealed ? (selected === correctAnswer ? '✓ Correct!' : '✗ Wrong') : 'Check Answer →'}
            </button>
        </div>
    );
};

// Sentiment Check Preview - Emoji scale
const SentimentCheckPreview: React.FC<{ question: string }> = ({ question }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    const labels = ['Very Unhappy', 'Unhappy', 'Neutral', 'Happy', 'Very Happy'];
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">How do you feel?</p>
            <div className="flex justify-between gap-2 mb-4">
                {emojis.map((emoji, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`flex-1 p-4 rounded-xl transition-all ${
                            selected === i
                                ? 'bg-rose-100 border-2 border-rose-500 scale-110'
                                : 'bg-slate-50 border-2 border-slate-200 hover:border-rose-300'
                        }`}
                    >
                        <span className="text-3xl">{emoji}</span>
                    </button>
                ))}
            </div>
            {selected !== null && (
                <p className="text-center text-rose-600 font-medium mb-4">{labels[selected]}</p>
            )}
            <button className="w-full py-2.5 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors">
                Submit Feedback →
            </button>
        </div>
    );
};

// Priority Matrix Preview - 2x2 grid
const PriorityMatrixPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Drag items to the grid:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 min-h-[80px]">
                    <div className="text-xs font-bold text-green-700 mb-2">High Priority / Easy</div>
                    <div className="text-sm bg-white px-2 py-1 rounded">{options[0]}</div>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 min-h-[80px]">
                    <div className="text-xs font-bold text-amber-700 mb-2">High Priority / Hard</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 min-h-[80px]">
                    <div className="text-xs font-bold text-blue-700 mb-2">Low Priority / Easy</div>
                    <div className="text-sm bg-white px-2 py-1 rounded">{options[1]}</div>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-3 min-h-[80px]">
                    <div className="text-xs font-bold text-slate-500 mb-2">Low Priority / Hard</div>
                </div>
            </div>
            <button className="w-full py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                Submit Matrix →
            </button>
        </div>
    );
};

// Visual Poll Preview - Image grid
const VisualPollPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<number | null>(null);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Click an image to vote:</p>
            <div className="grid grid-cols-2 gap-3">
                {options.slice(0, 4).map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                            selected === i ? 'border-pink-500 shadow-lg' : 'border-slate-200 hover:border-pink-300'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                            <span className="text-4xl">🖼️</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                            {opt}
                        </div>
                        {selected === i && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors">
                Vote →
            </button>
        </div>
    );
};

// Main component that switches between preview types
const PollTypePreview: React.FC<PollTypePreviewProps> = ({ pollTypeId, question, options }) => {
    switch (pollTypeId) {
        case 'multiple-choice':
            return <MultipleChoicePreview question={question} options={options} />;
        case 'ranked-choice':
            return <RankedChoicePreview question={question} options={options} />;
        case 'meeting-poll':
            return <MeetingPollPreview question={question} options={options} />;
        case 'this-or-that':
            return <ThisOrThatPreview question={question} options={options} />;
        case 'dot-voting':
            return <DotVotingPreview question={question} options={options} />;
        case 'rating-scale':
            return <RatingScalePreview question={question} options={options} />;
        case 'buy-feature':
            return <BuyFeaturePreview question={question} options={options} />;
        case 'approval-voting':
            return <ApprovalVotingPreview question={question} options={options} />;
        case 'quiz-poll':
            return <QuizPollPreview question={question} options={options} />;
        case 'sentiment-check':
            return <SentimentCheckPreview question={question} />;
        case 'priority-matrix':
            return <PriorityMatrixPreview question={question} options={options} />;
        case 'visual-poll':
            return <VisualPollPreview question={question} options={options} />;
        default:
            return <MultipleChoicePreview question={question} options={options} />;
    }
};

export default PollTypePreview;
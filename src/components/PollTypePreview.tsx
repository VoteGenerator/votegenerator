import React, { useState } from 'react';
import { 
    GripVertical, 
    Star, 
    Check, 
    ThumbsUp, 
    ThumbsDown,
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
    const [submitted, setSubmitted] = useState(false);
    const [votes] = useState(() => options.map(() => Math.floor(Math.random() * 50) + 10));
    
    const handleSubmit = () => {
        if (selected) {
            setSubmitted(true);
        }
    };
    
    if (submitted) {
        const total = votes.reduce((a, b) => a + b, 0) + 1;
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Vote Recorded!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">{question}</h4>
                <div className="space-y-2">
                    {options.map((opt, i) => {
                        const count = votes[i] + (opt === selected ? 1 : 0);
                        const pct = Math.round((count / total) * 100);
                        return (
                            <div key={i} className="relative">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={opt === selected ? 'font-semibold text-indigo-700' : 'text-slate-700'}>
                                        {opt} {opt === selected && '✓'}
                                    </span>
                                    <span className="text-slate-500">{pct}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all ${opt === selected ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">{total} total votes</p>
                <button 
                    onClick={() => { setSubmitted(false); setSelected(null); }}
                    className="w-full mt-3 py-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
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
            <button 
                onClick={handleSubmit}
                disabled={!selected}
                className={`w-full mt-4 py-2.5 font-semibold rounded-lg transition-colors ${
                    selected 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Vote →
            </button>
        </div>
    );
};

// Ranked Choice Preview - Drag to rank
const RankedChoicePreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [ranking, setRanking] = useState(options);
    const [submitted, setSubmitted] = useState(false);
    
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newRanking = [...ranking];
        [newRanking[index - 1], newRanking[index]] = [newRanking[index], newRanking[index - 1]];
        setRanking(newRanking);
    };
    
    const handleSubmit = () => {
        setSubmitted(true);
    };
    
    if (submitted) {
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Ranking Submitted!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">Your ranking:</h4>
                <div className="space-y-2">
                    {ranking.map((opt, i) => (
                        <div key={opt} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                i === 0 ? 'bg-amber-400 text-amber-900' :
                                i === 1 ? 'bg-slate-300 text-slate-700' :
                                i === 2 ? 'bg-amber-600 text-white' :
                                'bg-slate-200 text-slate-600'
                            }`}>
                                {i + 1}
                            </div>
                            <span className="text-slate-700">{opt}</span>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => { setSubmitted(false); setRanking(options); }}
                    className="w-full mt-4 py-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Click an option to move it up:</p>
            <div className="space-y-2">
                {ranking.map((opt, i) => (
                    <button
                        key={opt}
                        onClick={() => moveUp(i)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 bg-slate-50 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
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
                        {i > 0 && <span className="text-xs text-indigo-500">↑ Move up</span>}
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
                Click options to reorder your ranking
            </p>
            <button 
                onClick={handleSubmit}
                className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Submit Ranking →
            </button>
        </div>
    );
};

// Meeting Poll Preview - Availability grid
const MeetingPollPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [availability, setAvailability] = useState<Record<string, 'yes' | 'maybe' | 'no'>>({});
    const [submitted, setSubmitted] = useState(false);
    const [otherResponses] = useState(() => options.map(() => ({
        yes: Math.floor(Math.random() * 5) + 2,
        maybe: Math.floor(Math.random() * 3),
        no: Math.floor(Math.random() * 2)
    })));
    
    const toggleAvailability = (opt: string) => {
        const current = availability[opt] || 'no';
        const next = current === 'no' ? 'yes' : current === 'yes' ? 'maybe' : 'no';
        setAvailability({ ...availability, [opt]: next });
    };
    
    const hasSelections = Object.values(availability).some(v => v === 'yes' || v === 'maybe');
    
    if (submitted) {
        // Find best time
        const scores = options.map((opt, i) => {
            const userVote = availability[opt] === 'yes' ? 1 : availability[opt] === 'maybe' ? 0.5 : 0;
            return otherResponses[i].yes + (otherResponses[i].maybe * 0.5) + userVote;
        });
        const bestIndex = scores.indexOf(Math.max(...scores));
        
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Availability Submitted!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">{question}</h4>
                <div className="space-y-2 mb-4">
                    {options.map((opt, i) => {
                        const userVote = availability[opt] || 'no';
                        const totalYes = otherResponses[i].yes + (userVote === 'yes' ? 1 : 0);
                        const totalMaybe = otherResponses[i].maybe + (userVote === 'maybe' ? 1 : 0);
                        const isBest = i === bestIndex;
                        
                        return (
                            <div 
                                key={i}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                    isBest ? 'bg-green-100 border-2 border-green-500' : 'bg-slate-50'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {isBest && <span className="text-green-600">⭐</span>}
                                    <span className={isBest ? 'font-semibold text-green-800' : 'text-slate-700'}>
                                        📅 {opt}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="px-2 py-1 bg-green-500 text-white rounded-full">{totalYes} ✓</span>
                                    <span className="px-2 py-1 bg-amber-500 text-white rounded-full">{totalMaybe} ?</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-green-700 text-center mb-3">
                    ⭐ Best time: {options[bestIndex]}
                </p>
                <button 
                    onClick={() => { setSubmitted(false); setAvailability({}); }}
                    className="w-full py-2 text-amber-600 font-medium text-sm hover:bg-amber-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
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
            <button 
                onClick={() => hasSelections && setSubmitted(true)}
                disabled={!hasSelections}
                className={`w-full mt-4 py-2.5 font-semibold rounded-lg transition-colors ${
                    hasSelections 
                        ? 'bg-amber-500 text-white hover:bg-amber-600' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Submit Availability →
            </button>
        </div>
    );
};

// This or That Preview - Side by side
const ThisOrThatPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [votes] = useState(() => [Math.floor(Math.random() * 30) + 40, Math.floor(Math.random() * 30) + 30]);
    
    if (submitted && selected !== null) {
        const total = votes[0] + votes[1] + 1;
        const updatedVotes = [...votes];
        updatedVotes[selected] += 1;
        
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Vote Recorded!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-4 text-center">{question}</h4>
                <div className="flex gap-4 mb-4">
                    {options.slice(0, 2).map((opt, i) => {
                        const pct = Math.round((updatedVotes[i] / total) * 100);
                        return (
                            <div 
                                key={i}
                                className={`flex-1 p-4 rounded-xl text-center ${
                                    selected === i ? 'bg-orange-100 border-2 border-orange-500' : 'bg-slate-50 border-2 border-slate-200'
                                }`}
                            >
                                <div className="text-2xl mb-2">{i === 0 ? '🅰️' : '🅱️'}</div>
                                <div className={`font-bold mb-2 ${selected === i ? 'text-orange-700' : 'text-slate-700'}`}>
                                    {opt} {selected === i && '✓'}
                                </div>
                                <div className="text-3xl font-black text-slate-800">{pct}%</div>
                                <div className="text-xs text-slate-500">{updatedVotes[i]} votes</div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-400 text-center mb-3">{total} total votes</p>
                <button 
                    onClick={() => { setSubmitted(false); setSelected(null); }}
                    className="w-full py-2 text-orange-600 font-medium text-sm hover:bg-orange-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
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
            <button 
                onClick={() => selected !== null && setSubmitted(true)}
                disabled={selected === null}
                className={`w-full py-2.5 font-semibold rounded-lg transition-colors ${
                    selected !== null 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Vote →
            </button>
        </div>
    );
};

// Dot Voting Preview - Allocate points
const DotVotingPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [dots, setDots] = useState<Record<string, number>>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const totalDots = 5;
    const usedDots = Object.values(dots).reduce((sum, n) => sum + n, 0);
    const remaining = totalDots - usedDots;
    
    // Seed votes for results
    const seedVotes: Record<string, number> = {};
    options.forEach((opt) => {
        seedVotes[opt] = Math.floor(Math.random() * 30) + 10 + (dots[opt] || 0);
    });
    
    const addDot = (opt: string) => {
        if (remaining > 0 && !hasSubmitted) {
            setDots({ ...dots, [opt]: (dots[opt] || 0) + 1 });
        }
    };
    
    const handleSubmit = () => {
        if (usedDots > 0) {
            setHasSubmitted(true);
        }
    };
    
    const totalVotes = Object.values(seedVotes).reduce((sum, n) => sum + n, 0);
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            {!hasSubmitted ? (
                <>
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
                    <button 
                        onClick={handleSubmit}
                        disabled={usedDots === 0}
                        className="w-full mt-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                        Submit Votes →
                    </button>
                </>
            ) : (
                <>
                    <p className="text-green-600 text-sm mb-4 flex items-center gap-2">
                        <Check size={16} /> Votes submitted! Here are the results:
                    </p>
                    <div className="space-y-2">
                        {options.sort((a, b) => seedVotes[b] - seedVotes[a]).map((opt, i) => {
                            const pct = Math.round((seedVotes[opt] / totalVotes) * 100);
                            return (
                                <div key={i} className="relative">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 relative overflow-hidden">
                                        <div 
                                            className="absolute inset-y-0 left-0 bg-teal-100"
                                            style={{ width: `${pct}%` }}
                                        />
                                        <span className="text-slate-700 relative z-10">{i === 0 && '🏆 '}{opt}</span>
                                        <span className="font-bold text-teal-700 relative z-10">{pct}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button 
                        onClick={() => { setHasSubmitted(false); setDots({}); }}
                        className="w-full mt-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        Vote Again
                    </button>
                </>
            )}
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
    const [submitted, setSubmitted] = useState(false);
    const [votes] = useState(() => [8, 12, 25, 35, 43]);
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    const labels = ['Very Unhappy', 'Unhappy', 'Neutral', 'Happy', 'Very Happy'];
    
    if (submitted && selected !== null) {
        const total = votes.reduce((a, b) => a + b, 0) + 1;
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Feedback Submitted!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-4">{question}</h4>
                <div className="space-y-3">
                    {emojis.map((emoji, i) => {
                        const count = votes[i] + (selected === i ? 1 : 0);
                        const pct = Math.round((count / total) * 100);
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-2xl w-10 text-center">{emoji}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className={selected === i ? 'font-semibold text-rose-700' : 'text-slate-600'}>
                                            {labels[i]} {selected === i && '✓'}
                                        </span>
                                        <span className="text-slate-500">{pct}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${selected === i ? 'bg-rose-500' : 'bg-slate-300'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">{total} responses</p>
                <button 
                    onClick={() => { setSubmitted(false); setSelected(null); }}
                    className="w-full mt-3 py-2 text-rose-600 font-medium text-sm hover:bg-rose-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
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
            <button 
                onClick={() => selected !== null && setSubmitted(true)}
                disabled={selected === null}
                className={`w-full py-2.5 font-semibold rounded-lg transition-colors ${
                    selected !== null 
                        ? 'bg-rose-500 text-white hover:bg-rose-600' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Submit Feedback →
            </button>
        </div>
    );
};

// Priority Matrix Preview - 2x2 grid
const PriorityMatrixPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [submitted, setSubmitted] = useState(false);
    
    if (submitted) {
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Matrix Submitted!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">Team Priority Matrix Results:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-green-100 rounded-lg p-3">
                        <div className="text-xs font-bold text-green-700 mb-2">Do First 🎯</div>
                        <div className="text-sm bg-white px-2 py-1 rounded shadow-sm">{options[0]}</div>
                    </div>
                    <div className="bg-amber-100 rounded-lg p-3">
                        <div className="text-xs font-bold text-amber-700 mb-2">Schedule 📅</div>
                        <div className="text-sm bg-white px-2 py-1 rounded shadow-sm">{options[2] || 'Empty'}</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                        <div className="text-xs font-bold text-blue-700 mb-2">Quick Wins ⚡</div>
                        <div className="text-sm bg-white px-2 py-1 rounded shadow-sm">{options[1]}</div>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-3">
                        <div className="text-xs font-bold text-slate-500 mb-2">Skip ❌</div>
                        <div className="text-sm text-slate-400 italic">None</div>
                    </div>
                </div>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="w-full py-2 text-violet-600 font-medium text-sm hover:bg-violet-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
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
            <button 
                onClick={() => setSubmitted(true)}
                className="w-full py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
            >
                Submit Matrix →
            </button>
        </div>
    );
};

// Visual Poll Preview - Image grid with demo images
const VisualPollPreview: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [votes] = useState(() => [42, 35, 18, 28]);
    
    // Demo image gradients that look like real images
    const imageGradients = [
        'from-blue-400 via-blue-500 to-indigo-600',
        'from-green-400 via-emerald-500 to-teal-600',
        'from-orange-400 via-red-500 to-pink-600',
        'from-purple-400 via-violet-500 to-indigo-600',
    ];
    
    const imageIcons = ['🏢', '🌲', '🌅', '🏙️'];
    
    if (submitted && selected !== null) {
        const total = votes.reduce((a, b) => a + b, 0) + 1;
        return (
            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-700">Vote Recorded!</h4>
                        <p className="text-slate-500 text-xs">This is a demo - no data saved</p>
                    </div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">{question}</h4>
                <div className="grid grid-cols-2 gap-3">
                    {options.slice(0, 4).map((opt, i) => {
                        const count = votes[i] + (selected === i ? 1 : 0);
                        const pct = Math.round((count / total) * 100);
                        return (
                            <div key={i} className={`relative rounded-xl overflow-hidden ${selected === i ? 'ring-4 ring-pink-500' : ''}`}>
                                <div className={`aspect-[4/3] bg-gradient-to-br ${imageGradients[i]} flex items-center justify-center`}>
                                    <span className="text-4xl opacity-50">{imageIcons[i]}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                                    <div className="flex justify-between items-center text-xs mb-1">
                                        <span className="truncate">{opt}</span>
                                        <span className="font-bold">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${selected === i ? 'bg-pink-500' : 'bg-white'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                                {selected === i && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">{total} total votes</p>
                <button 
                    onClick={() => { setSubmitted(false); setSelected(null); }}
                    className="w-full mt-3 py-2 text-pink-600 font-medium text-sm hover:bg-pink-50 rounded-lg transition-colors"
                >
                    ← Try Again
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-xl p-5 border-2 border-amber-200">
            <h4 className="font-bold text-slate-800 mb-1">{question}</h4>
            <p className="text-slate-500 text-sm mb-4">Click an image to vote:</p>
            <div className="grid grid-cols-2 gap-3">
                {options.slice(0, 4).map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-4 transition-all ${
                            selected === i ? 'border-pink-500 shadow-lg scale-105' : 'border-transparent hover:border-pink-300'
                        }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${imageGradients[i]} flex items-center justify-center`}>
                            <span className="text-5xl">{imageIcons[i]}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3 pt-6">
                            <span className="font-medium">{opt}</span>
                        </div>
                        {selected === i && (
                            <div className="absolute top-2 right-2 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check size={16} className="text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => selected !== null && setSubmitted(true)}
                disabled={selected === null}
                className={`w-full mt-4 py-2.5 font-semibold rounded-lg transition-colors ${
                    selected !== null 
                        ? 'bg-pink-600 text-white hover:bg-pink-700' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
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
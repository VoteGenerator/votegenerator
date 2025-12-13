import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Check, GripVertical, ArrowRight, Loader2, User, Clock, Lock, Key, MessageSquare, Plus, Minus, Coins, Calendar, HelpCircle, AlertTriangle } from 'lucide-react';
import { Poll, PollOption } from '../types';
import { submitVote, hasVoted } from '../services/voteGeneratorService';

interface Props {
    poll: Poll;
    onVoteSuccess: () => void;
}

const VoteGeneratorVote: React.FC<Props> = ({ poll, onVoteSuccess }) => {
    const shuffle = <T,>(array: T[]): T[] => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const [items, setItems] = useState<PollOption[]>(() => {
        if (poll.pollType === 'ranked') {
            return shuffle(poll.options);
        }
        return poll.options;
    });
    
    // Multiple Choice State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    
    // Meeting State (Tri-state: Yes, Maybe, No)
    const [maybeIds, setMaybeIds] = useState<Set<string>>(new Set());
    
    // Dot Voting State
    const [dotAllocations, setDotAllocations] = useState<Record<string, number>>({});

    // Matrix Voting State
    const [matrixPositions, setMatrixPositions] = useState<Record<string, { x: number, y: number }>>({});
    const matrixContainerRef = useRef<HTMLDivElement>(null);

    // Meta State
    const [voterName, setVoterName] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Initialize access code from URL param if present
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        const params = new URLSearchParams(hash);
        const codeParam = params.get('code');
        if (codeParam) {
            setAccessCode(codeParam);
        }
    }, []);

    const isDeadlineExpired = poll.settings.deadline && new Date() > new Date(poll.settings.deadline);
    const isMaxVotesReached = poll.settings.maxVotes && poll.voteCount >= poll.settings.maxVotes;
    const isClosed = isDeadlineExpired || isMaxVotesReached;
    const alreadyVotedBrowser = poll.settings.security === 'browser' && hasVoted(poll.id);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isDifferentTimezone = poll.settings.timezone && poll.settings.timezone !== userTimezone;

    const checkVpnLikelihood = (): boolean => {
        if (!poll.settings.blockVpn) return false;
        const isHeadless = navigator.webdriver;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isGenericTimezone = timezone === 'UTC' || timezone === 'Etc/GMT';
        return !!isHeadless || isGenericTimezone;
    };

    // --- Helpers ---
    const getDotTotal = () => Object.values(dotAllocations).reduce((a, b) => a + b, 0);
    const dotBudget = poll.settings.dotBudget || 10;
    const dotsRemaining = dotBudget - getDotTotal();

    const handleDotChange = (id: string, delta: number) => {
        const current = dotAllocations[id] || 0;
        if (delta > 0 && dotsRemaining <= 0) return; // Cap at budget
        if (delta < 0 && current <= 0) return; // Floor at 0
        setDotAllocations({ ...dotAllocations, [id]: current + delta });
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            if (!poll.settings.allowMultiple && poll.pollType !== 'meeting') {
                newSet.clear();
            }
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleMeetingSelection = (id: string) => {
        if (selectedIds.has(id)) {
            const newSel = new Set(selectedIds);
            newSel.delete(id);
            setSelectedIds(newSel);
            
            const newMaybe = new Set(maybeIds);
            newMaybe.add(id);
            setMaybeIds(newMaybe);
        } else if (maybeIds.has(id)) {
            const newMaybe = new Set(maybeIds);
            newMaybe.delete(id);
            setMaybeIds(newMaybe);
        } else {
            const newSel = new Set(selectedIds);
            newSel.add(id);
            setSelectedIds(newSel);
        }
    };

    const handleMatrixDragEnd = (id: string, info: any) => {
        if (!matrixContainerRef.current) return;
        
        const rect = matrixContainerRef.current.getBoundingClientRect();
        const pointX = info.point.x - rect.left;
        const pointY = info.point.y - rect.top;

        // Convert to percentage (0-100), constrained to 0-100
        const xPercent = Math.min(100, Math.max(0, (pointX / rect.width) * 100));
        const yPercent = Math.min(100, Math.max(0, (pointY / rect.height) * 100));

        // Flip Y because grid charts usually have High on top (Low Y in DOM is Top)
        // But for storing "High Impact", Y=100 is Top.
        // Let's stick to standard Cartesian: Bottom-Left is 0,0.
        // DOM: Top-Left is 0,0.
        // If we want Y=100 to be Top (High Impact), we need 100 - domPercent.
        const cartesianY = 100 - yPercent;
        
        setMatrixPositions(prev => ({
            ...prev,
            [id]: { x: xPercent, y: cartesianY }
        }));
    };

    const isMatrixPlaced = (id: string) => !!matrixPositions[id];

    const handleSubmit = async () => {
        setErrorMessage(null);

        if (checkVpnLikelihood()) {
            setErrorMessage("Vote blocked: VPN or Proxy detected. Please disable it to vote.");
            return;
        }

        setIsSubmitting(true);
        try {
            let choices: string[] = [];
            let choicesMaybe: string[] = [];

            if (poll.pollType === 'ranked') {
                choices = items.map(i => i.id);
            } else if (poll.pollType === 'dot') {
                choices = Object.entries(dotAllocations).flatMap(([id, count]) => Array(count).fill(id));
            } else if (poll.pollType === 'matrix') {
                // For matrix, we don't use 'choices' array for values, we use matrixVotes.
                // We'll leave choices empty or maybe just list the IDs voted on.
                choices = Object.keys(matrixPositions);
            } else {
                choices = Array.from(selectedIds);
                if (poll.pollType === 'meeting') {
                    choicesMaybe = Array.from(maybeIds);
                }
            }
            
            await submitVote(
                poll.id, 
                choices, 
                voterName.trim() || undefined,
                accessCode.trim() || undefined,
                comment.trim() || undefined,
                choicesMaybe.length > 0 ? choicesMaybe : undefined,
                poll.pollType === 'matrix' ? matrixPositions : undefined
            );
            onVoteSuccess();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setErrorMessage(error instanceof Error ? error.message : "Failed to submit vote");
        }
    };

    // Validation
    let canSubmit = false;
    if (poll.pollType === 'ranked') canSubmit = true;
    else if (poll.pollType === 'dot') canSubmit = getDotTotal() > 0;
    else if (poll.pollType === 'matrix') canSubmit = Object.keys(matrixPositions).length === poll.options.length; // Must place all? Or at least 1? Let's say at least 1.
    else canSubmit = selectedIds.size > 0 || maybeIds.size > 0; 

    // Update matrix validation: Require all options to be placed? Or just some. Let's require all for better data.
    if (poll.pollType === 'matrix') canSubmit = Object.keys(matrixPositions).length === poll.options.length;

    // Add meta validation
    if (poll.settings.requireNames && voterName.trim().length === 0) canSubmit = false;
    if (poll.settings.security === 'code' && accessCode.trim().length === 0) canSubmit = false;


    if (isClosed) {
        return (
            <div className="max-w-2xl mx-auto px-4 pt-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-slate-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Poll Closed</h1>
                {isDeadlineExpired && (
                     <p className="text-slate-500 mb-8">This poll ended on {new Date(poll.settings.deadline!).toLocaleString()}.</p>
                )}
                <button onClick={onVoteSuccess} className="text-indigo-600 font-bold hover:underline">View Results</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 pb-20 pt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 font-serif mb-2">
                        {poll.title}
                    </h1>
                    {poll.description && (
                        <p className="text-slate-600 leading-relaxed">
                            {poll.description}
                        </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                        {/* Type Badge */}
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                            {poll.pollType === 'ranked' && "Rank Options"}
                            {poll.pollType === 'multiple' && (poll.settings.allowMultiple ? "Select Options" : "Select One")}
                            {poll.pollType === 'meeting' && "Select Available Times"}
                            {poll.pollType === 'dot' && "Distribute Points"}
                            {poll.pollType === 'matrix' && "Drag to Grid"}
                        </div>

                         {/* Deadline Badge */}
                        {poll.settings.deadline && (
                            <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                                <Clock size={14} /> Ends: {new Date(poll.settings.deadline).toLocaleDateString()}
                            </div>
                        )}
                        
                        {/* Dot Budget Badge */}
                        {poll.pollType === 'dot' && (
                             <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full w-fit border transition-colors ${
                                 dotsRemaining === 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border-indigo-200 text-indigo-600 shadow-sm'
                             }`}>
                                <Coins size={14} /> {dotsRemaining} Points Left
                            </div>
                        )}
                        
                        {/* Timezone Badge for Meeting */}
                        {poll.pollType === 'meeting' && poll.settings.timezone && (
                            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full w-fit border ${isDifferentTimezone ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-transparent'}`}>
                                🌐 {poll.settings.timezone}
                            </div>
                        )}
                    </div>
                    
                    {/* Timezone Warning */}
                    {isDifferentTimezone && poll.pollType === 'meeting' && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>
                                <strong>Timezone Mismatch:</strong> The poll times are shown in {poll.settings.timezone}, but you are in {userTimezone}. Please adjust accordingly.
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    {/* --- RANKED UI --- */}
                    {poll.pollType === 'ranked' && (
                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                            {items.map((item, index) => (
                                <Reorder.Item 
                                    key={item.id} 
                                    value={item}
                                    whileDrag={{ scale: 1.05 }}
                                    className="relative z-0"
                                >
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing group select-none">
                                        <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors ml-2">
                                            {index + 1}
                                        </div>
                                        <span className="flex-1 font-medium text-slate-800 text-lg">{item.text}</span>
                                        <GripVertical className="text-slate-300 group-hover:text-indigo-400" />
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}

                    {/* --- MATRIX UI --- */}
                    {poll.pollType === 'matrix' && (
                        <div className="select-none">
                            <div className="mb-4 text-center text-sm text-slate-500">
                                Drag all items from the list onto the grid based on Impact vs. Effort.
                            </div>
                            
                            {/* The Grid */}
                            <div className="relative aspect-square bg-slate-50 rounded-xl border-2 border-slate-200 mb-6 overflow-hidden" ref={matrixContainerRef}>
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-px bg-slate-300"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-px bg-slate-300"></div>
                                </div>
                                
                                {/* Labels */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 px-2 rounded">High Impact</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 px-2 rounded">Low Impact</div>
                                <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 px-2 rounded origin-center">Low Effort</div>
                                <div className="absolute top-1/2 right-2 -translate-y-1/2 rotate-90 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 px-2 rounded origin-center">High Effort</div>
                                
                                {/* Placed Items */}
                                {poll.options.filter(o => isMatrixPlaced(o.id)).map(opt => {
                                    const pos = matrixPositions[opt.id];
                                    // Cartesian Y to DOM Y
                                    const domTop = 100 - pos.y;
                                    
                                    return (
                                        <motion.div
                                            key={opt.id}
                                            drag
                                            dragMomentum={false}
                                            dragConstraints={matrixContainerRef}
                                            onDragEnd={(_, info) => handleMatrixDragEnd(opt.id, info)}
                                            style={{ left: `${pos.x}%`, top: `${domTop}%` }}
                                            className="absolute -ml-4 -mt-4 w-8 h-8 bg-indigo-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center cursor-grab active:cursor-grabbing z-10 group"
                                        >
                                            <span className="text-white font-bold text-xs pointer-events-none">
                                                {poll.options.findIndex(o => o.id === opt.id) + 1}
                                            </span>
                                            {/* Tooltip */}
                                            <div className="absolute top-full mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                                {opt.text}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Unplaced Items Dock */}
                            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-4 rounded-xl border border-slate-200">
                                {poll.options.map((opt, i) => {
                                    if (isMatrixPlaced(opt.id)) return null;
                                    return (
                                        <motion.div
                                            key={opt.id}
                                            drag
                                            dragSnapToOrigin // Snaps back if dropped invalidly (outside constraints), but we manually handle placement logic
                                            onDragEnd={(_, info) => handleMatrixDragEnd(opt.id, info)}
                                            className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="w-6 h-6 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 truncate">{opt.text}</span>
                                        </motion.div>
                                    );
                                })}
                                {poll.options.every(o => isMatrixPlaced(o.id)) && (
                                    <div className="col-span-2 text-center text-emerald-600 font-bold py-2 flex items-center justify-center gap-2">
                                        <Check size={18} /> All items placed!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- MULTIPLE / MEETING UI --- */}
                    {(poll.pollType === 'multiple' || poll.pollType === 'meeting') && (
                        <div className="space-y-3">
                            {poll.pollType === 'meeting' && (
                                <div className="mb-4 text-center">
                                    <p className="text-sm font-bold text-indigo-900 mb-1">Select <span className="underline decoration-wavy decoration-indigo-300">all</span> the times that work for you</p>
                                    <p className="text-xs text-slate-500">
                                        Tap once for <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded">Yes</span>, 
                                        twice for <span className="text-amber-600 font-bold bg-amber-50 px-1 rounded">Maybe</span>.
                                    </p>
                                </div>
                            )}

                            {poll.options.map((opt) => {
                                const isSelected = selectedIds.has(opt.id);
                                const isMaybe = maybeIds.has(opt.id);
                                const isMeeting = poll.pollType === 'meeting';

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => isMeeting ? toggleMeetingSelection(opt.id) : toggleSelection(opt.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group ${
                                            isSelected 
                                                ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                                                : isMaybe
                                                ? 'border-amber-400 bg-amber-50 shadow-sm'
                                                : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-all ${
                                            isSelected 
                                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                : isMaybe
                                                ? 'bg-amber-400 border-amber-400 text-white'
                                                : 'border-slate-300 bg-white group-hover:border-indigo-300'
                                        }`}>
                                            {isSelected && <Check size={18} strokeWidth={3} />}
                                            {isMaybe && <HelpCircle size={18} strokeWidth={3} />}
                                        </div>
                                        <div className="flex-1">
                                            <span className={`font-medium text-lg ${
                                                isSelected ? 'text-emerald-900' : isMaybe ? 'text-amber-900' : 'text-slate-700'
                                            }`}>
                                                {opt.text}
                                            </span>
                                        </div>
                                        {isMeeting && <Calendar size={20} className={isSelected ? 'text-emerald-400' : isMaybe ? 'text-amber-400' : 'text-slate-300'} />}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* --- DOT VOTING UI --- */}
                    {poll.pollType === 'dot' && (
                        <div className="space-y-4">
                            {poll.options.map((opt) => {
                                const count = dotAllocations[opt.id] || 0;
                                return (
                                    <div key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                        count > 0 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-white'
                                    }`}>
                                        <span className={`font-medium text-lg flex-1 ${count > 0 ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {opt.text}
                                        </span>
                                        
                                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                                            <button 
                                                onClick={() => handleDotChange(opt.id, -1)}
                                                disabled={count === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center font-bold text-lg text-indigo-600">{count}</span>
                                            <button 
                                                onClick={() => handleDotChange(opt.id, 1)}
                                                disabled={dotsRemaining === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="flex justify-center mt-4">
                                <p className="text-sm text-slate-500">
                                    {dotsRemaining === 0 
                                        ? "All points allocated!" 
                                        : `You have ${dotsRemaining} points remaining.`
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Inputs Area */}
                    <div className="space-y-4 mt-8 pt-6 border-t border-slate-100">
                        {poll.settings.security === 'code' && (
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Access Code *</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <input 
                                        type="text" 
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-mono"
                                        placeholder="Enter code"
                                    />
                                </div>
                            </div>
                        )}

                        {poll.settings.requireNames && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <input 
                                        type="text" 
                                        value={voterName}
                                        onChange={(e) => setVoterName(e.target.value)}
                                        className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                        )}

                        {poll.settings.allowComments && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Comment <span className="font-normal text-slate-400">(optional)</span></label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                    <textarea 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full p-3 pl-10 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all resize-none"
                                        placeholder="Add a comment..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {errorMessage && (
                         <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 text-center">
                            {errorMessage}
                         </div>
                    )}

                    {alreadyVotedBrowser ? (
                        <div className="mt-8 p-4 bg-amber-50 text-amber-800 rounded-xl text-center border border-amber-200">
                            <strong>You have already voted.</strong><br/>
                            <div className="mt-2">
                                <button onClick={onVoteSuccess} className="text-indigo-600 underline text-sm font-bold">See Results</button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canSubmit}
                            className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={24} /> Submitting...</>
                            ) : (
                                <>Submit Vote <ArrowRight size={24} /></>
                            )}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VoteGeneratorVote;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ListOrdered, 
  CheckSquare, 
  Image as ImageIcon, 
  Calendar, 
  Plus, 
  GripVertical, 
  EyeOff,
  Wand2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { CreatePollRequest, PollType } from '../types';
import { createPoll } from '../services/api';

const MAX_OPTIONS = 20;
const MIN_OPTIONS = 2;

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pollType, setPollType] = useState<PollType>(PollType.RANKED);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [hideResults, setHideResults] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, '']);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    const validOptions = options.map(o => o.trim()).filter(o => o.length > 0);

    if (!title.trim()) {
      setError('Please enter a question for your poll.');
      return;
    }

    if (validOptions.length < MIN_OPTIONS) {
      setError(`Please add at least ${MIN_OPTIONS} options.`);
      return;
    }

    setLoading(true);

    try {
      const payload: CreatePollRequest = {
        title,
        description,
        options: validOptions,
        pollType,
        settings: {
          hideResults,
          allowMultiple: pollType === PollType.MULTIPLE ? allowMultiple : undefined
        }
      };

      const result = await createPoll(payload);
      navigate(`/poll/${result.id}?admin=${result.adminKey}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-inter">
      {/* Poll Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">POLL TYPE</h2>
            <div className="text-slate-400 hover:text-slate-600 cursor-help">
               <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ranked Choice - Selected Style */}
            <button
              onClick={() => setPollType(PollType.RANKED)}
              className={`p-4 rounded-lg border text-left transition-all relative ${
                pollType === PollType.RANKED 
                  ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ListOrdered className={`w-5 h-5 ${pollType === PollType.RANKED ? 'text-indigo-700' : 'text-slate-400'}`} />
                <span className={`font-semibold ${pollType === PollType.RANKED ? 'text-indigo-900' : 'text-slate-700'}`}>Ranked Choice</span>
              </div>
              <p className="text-sm text-slate-500 leading-snug">Voters drag options to rank from favorite to least favorite</p>
            </button>

            {/* Multiple Choice */}
            <button
              onClick={() => setPollType(PollType.MULTIPLE)}
              className={`p-4 rounded-lg border text-left transition-all relative ${
                pollType === PollType.MULTIPLE 
                  ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckSquare className={`w-5 h-5 ${pollType === PollType.MULTIPLE ? 'text-indigo-700' : 'text-slate-400'}`} />
                <span className={`font-semibold ${pollType === PollType.MULTIPLE ? 'text-indigo-900' : 'text-slate-700'}`}>Multiple Choice</span>
              </div>
              <p className="text-sm text-slate-500 leading-snug">Voters pick one option (or multiple if you allow it)</p>
            </button>
            
            {/* Image Poll - Disabled/Soon */}
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed relative select-none">
               <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">Soon</span>
               <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                  <span className="font-semibold text-slate-400">Image Poll</span>
               </div>
               <p className="text-sm text-slate-400 leading-snug">Voters choose between images (logos, designs, photos)</p>
            </div>

            {/* Meeting Poll - Disabled/Soon */}
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed relative select-none">
               <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">Soon</span>
               <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-slate-300" />
                  <span className="font-semibold text-slate-400">Meeting Poll</span>
               </div>
               <p className="text-sm text-slate-400 leading-snug">Voters mark which times work for them</p>
            </div>
          </div>
        </section>

        {/* Question Input */}
        <section className="mb-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            YOUR QUESTION
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 text-lg font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow placeholder:font-normal"
            placeholder="e.g., Where should we go for lunch?"
          />
        </section>

        {/* Details Input */}
        <section className="mb-8">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            DETAILS <span className="font-normal text-slate-400">(OPTIONAL)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow min-h-[100px] resize-y"
            placeholder="Add any extra context here..."
          />
        </section>

        {/* Options Input */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              OPTIONS TO RANK
            </label>
            <span className="text-xs text-slate-400">
              {options.filter(o => o.trim().length > 0).length} of {MAX_OPTIONS} max
            </span>
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center group">
                <span className="w-8 text-center text-slate-300 font-bold text-sm select-none">
                  {idx + 1}.
                </span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="w-full p-3 pl-4 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder:text-slate-300 font-medium text-slate-700"
                    placeholder={`Option ${idx + 1}`}
                  />
                  {pollType === PollType.RANKED && (
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4" />
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            disabled={options.length >= MAX_OPTIONS}
            className="mt-4 flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ml-8"
          >
            <Plus className="w-4 h-4" />
            Add another option
          </button>
        </section>

        {/* Settings */}
        <section className="mb-8 pt-6 border-t border-slate-100">
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center pt-0.5">
                <input 
                  type="checkbox" 
                  checked={hideResults}
                  onChange={(e) => setHideResults(e.target.checked)}
                  className="w-5 h-5 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-slate-700 font-bold group-hover:text-slate-900">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  Hide results until you reveal them
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Voters see results right after they vote.</p>
              </div>
            </label>

            {pollType === PollType.MULTIPLE && (
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center pt-0.5">
                  <input 
                    type="checkbox" 
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    className="w-5 h-5 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold group-hover:text-slate-900">
                    <CheckSquare className="w-4 h-4 text-slate-500" />
                    Allow multiple selections
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">Voters can choose more than one option.</p>
                </div>
              </label>
            )}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Action */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-wait"
        >
          {loading ? (
            <span className="flex items-center gap-2">Creating...</span>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Create Poll
              <span className="ml-1 text-indigo-200">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;
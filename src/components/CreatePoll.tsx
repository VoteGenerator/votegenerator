// CreatePoll Component
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

  const removeOption = (index: number) => {
    if (options.length > MIN_OPTIONS) {
      setOptions(options.filter((_, i) => i !== index));
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Create a New Poll</h1>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Question or Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context or details..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Poll Type */}
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">
              Poll Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPollType(PollType.RANKED)}
                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                  pollType === PollType.RANKED
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                }`}
              >
                <ListOrdered className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Ranked Choice</div>
                  <div className="text-xs opacity-80">Voters rank options</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setPollType(PollType.MULTIPLE)}
                className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                  pollType === PollType.MULTIPLE
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 hover:border-indigo-200 text-slate-600'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Multiple Choice</div>
                  <div className="text-xs opacity-80">Standard voting</div>
                </div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Options
            </label>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 cursor-move" />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {options.length > MIN_OPTIONS && (
                    <button 
                      onClick={() => removeOption(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove option"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < MAX_OPTIONS && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Settings</span>
             </div>
             
             <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={hideResults}
                    onChange={(e) => setHideResults(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">Hide results from voters</span>
                </label>

                {pollType === PollType.MULTIPLE && (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={allowMultiple}
                      onChange={(e) => setAllowMultiple(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Allow selecting multiple options</span>
                  </label>
                )}
             </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Poll...' : 'Create Poll'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
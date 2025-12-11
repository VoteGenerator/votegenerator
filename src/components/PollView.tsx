import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPoll } from '../services/api';
import { PollData } from '../types';
import { Share2, BarChart2 } from 'lucide-react';

const PollView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const adminKey = searchParams.get('admin');

  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getPoll(id, adminKey || undefined)
        .then(setPoll)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, adminKey]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading poll...</div>;
  if (error || !poll) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Poll not found'}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Admin Header */}
        {poll.isAdmin && (
           <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Admin View</span>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                 <Share2 className="w-3 h-3" /> Share Poll
              </button>
           </div>
        )}
        
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-slate-600 mb-6 whitespace-pre-wrap">{poll.description}</p>
          )}

          <div className="space-y-3 mt-6">
            {poll.options.map((opt, idx) => (
              <div key={opt.id} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-400 flex items-center justify-center text-xs font-medium text-slate-400 group-hover:text-indigo-500">
                      {idx + 1}
                   </div>
                   <span className="font-medium text-slate-700 group-hover:text-slate-900">{opt.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
             <span>{poll.voteCount} votes</span>
             <div className="flex items-center gap-2">
                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium uppercase text-slate-600">{poll.pollType}</span>
                {poll.settings.hideResults && <span className="flex items-center gap-1 text-orange-600"><BarChart2 className="w-3 h-3"/> Results Hidden</span>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollView;
import React, { useState } from 'react';
import { 
    Copy, Check, Users, BarChart2, RefreshCw, Share2, 
    Clock, Settings, Twitter, Send, Mail
} from 'lucide-react';
import type { AdminPollData, RunoffResult } from '../types';
import VoteGeneratorResults from './VoteGeneratorResults';
import { trackEvent } from '../services/analyticsService';

interface VoteGeneratorAdminProps {
    poll: AdminPollData;
    runoffResult?: RunoffResult;
    onRefresh: () => void;
}

const VoteGeneratorAdmin: React.FC<VoteGeneratorAdminProps> = ({ poll, runoffResult, onRefresh }) => {
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'results' | 'votes' | 'settings'>('results');

    const voteUrl = `${window.location.origin}/vote/${poll.id}`;
    const adminUrl = `${window.location.origin}/vote/${poll.id}?admin=${poll.adminKey}`;

    const handleCopy = async (url: string, type: string) => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        trackEvent('votegenerator_link_copied', { type });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleShare = (platform: string) => {
        const text = `Vote on: ${poll.title}`;
        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(voteUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + voteUrl)}`,
            email: `mailto:?subject=${encodeURIComponent(poll.title)}&body=${encodeURIComponent(`Vote here: ${voteUrl}`)}`
        };
        window.open(urls[platform], '_blank');
        trackEvent('votegenerator_share', { platform });
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Admin Dashboard</span>
                        <h1 className="text-2xl md:text-3xl font-black mt-1">{poll.title}</h1>
                        {poll.description && (
                            <p className="text-indigo-200 mt-2">{poll.description}</p>
                        )}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <Users className="mx-auto mb-2 text-indigo-200" size={24} />
                        <div className="text-3xl font-black">{poll.voteCount}</div>
                        <div className="text-indigo-200 text-sm">Votes</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <BarChart2 className="mx-auto mb-2 text-indigo-200" size={24} />
                        <div className="text-3xl font-black">{poll.options.length}</div>
                        <div className="text-indigo-200 text-sm">Options</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                        <Clock className="mx-auto mb-2 text-indigo-200" size={24} />
                        <div className="text-lg font-bold">{formatTimeAgo(poll.createdAt)}</div>
                        <div className="text-indigo-200 text-sm">Created</div>
                    </div>
                </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Share2 size={18} /> Share Your Poll
                </h2>

                {/* Voting Link */}
                <div className="mb-4">
                    <label className="text-sm text-slate-500 font-medium block mb-2">
                        Voting Link (share with participants)
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-mono text-sm text-slate-600 truncate">
                            {voteUrl}
                        </div>
                        <button
                            onClick={() => handleCopy(voteUrl, 'vote')}
                            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Quick Share Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleShare('whatsapp')}
                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Send size={16} /> WhatsApp
                    </button>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Twitter size={16} /> Twitter
                    </button>
                    <button
                        onClick={() => handleShare('email')}
                        className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <Mail size={16} /> Email
                    </button>
                </div>

                {/* Admin Link Warning */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="text-amber-500 mt-0.5">
                            <Settings size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-amber-800 font-medium text-sm">Save your admin link!</p>
                            <p className="text-amber-600 text-xs mt-1">
                                This is your only way to access results and manage this poll. 
                                Bookmark it or save it somewhere safe.
                            </p>
                            <button
                                onClick={() => handleCopy(adminUrl, 'admin')}
                                className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-medium underline"
                            >
                                Copy admin link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {['results', 'votes', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-all ${
                            activeTab === tab
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'results' && (
                <div>
                    {poll.voteCount === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Waiting for votes...</h3>
                            <p className="text-slate-500">
                                Share the voting link above to start collecting responses.
                            </p>
                        </div>
                    ) : runoffResult ? (
                        <VoteGeneratorResults 
                            runoffResult={runoffResult} 
                            pollTitle={poll.title}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                            <p className="text-slate-500">Loading results...</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'votes' && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Vote Log</h3>
                    {poll.votes && poll.votes.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {poll.votes.slice().reverse().map((vote, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg text-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-700">
                                            Vote #{poll.votes.length - idx}
                                        </span>
                                        <span className="text-slate-400 text-xs">
                                            {formatTimeAgo(vote.timestamp)}
                                        </span>
                                    </div>
                                    <div className="text-slate-500 text-xs">
                                        Ranking: {vote.rankedOptionIds.map((id) => {
                                            const option = poll.options.find(o => o.id === id);
                                            return option?.text || 'Unknown';
                                        }).join(' → ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No votes yet.</p>
                    )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Poll Settings</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <span className="font-medium text-slate-700 block">Hide Results from Voters</span>
                                <span className="text-sm text-slate-500">
                                    {poll.settings.hideResults 
                                        ? 'Voters cannot see results until you reveal them'
                                        : 'Voters can see results after voting'}
                                </span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                poll.settings.hideResults 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {poll.settings.hideResults ? 'Hidden' : 'Visible'}
                            </div>
                        </div>

                        {/* Premium Upgrade Options */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="text-center mb-4">
                                <span className="text-2xl">✨</span>
                                <h4 className="font-bold text-slate-800 text-lg mt-2">Make it yours</h4>
                                <p className="text-slate-500 text-sm">One-time payment for this poll</p>
                            </div>

                            <div className="grid gap-3">
                                {/* Tier 1: Remove Ads */}
                                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-slate-700 block">Remove Ads</span>
                                            <span className="text-sm text-slate-500">
                                                Clean, ad-free experience for all voters
                                            </span>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold rounded-lg text-sm transition-colors whitespace-nowrap">
                                            $3
                                        </button>
                                    </div>
                                </div>

                                {/* Tier 2: Remove Ads + Logo */}
                                <div className="border-2 border-indigo-300 bg-indigo-50 rounded-xl p-4 relative">
                                    <div className="absolute -top-2 left-4 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                        POPULAR
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-slate-700 block">Branded Poll</span>
                                            <span className="text-sm text-slate-500">
                                                No ads + add your company logo
                                            </span>
                                        </div>
                                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors whitespace-nowrap">
                                            $7
                                        </button>
                                    </div>
                                </div>

                                {/* Tier 3: Full White Label */}
                                <div className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-slate-700 block">White Label</span>
                                            <span className="text-sm text-slate-500">
                                                No ads + your logo + custom link like<br/>
                                                <code className="text-indigo-600 text-xs">votegenerator.com/your-company</code>
                                            </span>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold rounded-lg text-sm transition-colors whitespace-nowrap">
                                            $15
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-slate-400 text-xs mt-4">
                                Secure payment via Stripe • Instant activation
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoteGeneratorAdmin;

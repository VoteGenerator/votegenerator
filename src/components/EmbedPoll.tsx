import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ExternalLink, Copy, Check, Code, Monitor, Smartphone, X, Settings, Palette, Shield, Lock } from 'lucide-react';
import type { Poll } from '../types';

interface EmbedModalProps {
    poll: Poll;
    isOpen: boolean;
    onClose: () => void;
    isPremium: boolean; // Premium users get no branding
}

// Embed configuration options
interface EmbedConfig {
    width: string;
    height: string;
    showBranding: boolean; // Free users always have branding
    theme: 'light' | 'dark' | 'auto';
    borderRadius: number;
    allowedDomains: string; // Comma-separated domains (Pro/Business feature)
}

const EmbedModal: React.FC<EmbedModalProps> = ({ poll, isOpen, onClose, isPremium }) => {
    const [copied, setCopied] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [config, setConfig] = useState<EmbedConfig>({
        width: '100%',
        height: '500',
        showBranding: !isPremium, // Free = branding, Premium = optional
        theme: 'light',
        borderRadius: 12,
        allowedDomains: '' // Empty = allow all domains
    });

    // Generate embed code
    const embedUrl = `${window.location.origin}/embed/${poll.id}`;
    const embedParams = new URLSearchParams({
        theme: config.theme,
        branding: config.showBranding ? '1' : '0',
        radius: config.borderRadius.toString(),
        ...(config.allowedDomains && isPremium ? { domains: config.allowedDomains } : {})
    });
    
    const iframeCode = `<iframe 
  src="${embedUrl}?${embedParams.toString()}"
  width="${config.width}"
  height="${config.height}px"
  frameborder="0"
  style="border-radius: ${config.borderRadius}px; border: 1px solid #e2e8f0;"
  allow="clipboard-write"
  title="${poll.title}"
></iframe>`;

    // Cleaner single-line version
    const iframeCodeOneLine = `<iframe src="${embedUrl}?${embedParams.toString()}" width="${config.width}" height="${config.height}px" frameborder="0" style="border-radius:${config.borderRadius}px;border:1px solid #e2e8f0" title="${poll.title}"></iframe>`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(iframeCodeOneLine);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
                <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Code size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Embed Poll</h2>
                                <p className="text-sm text-slate-500">Add this poll to your website</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left: Configuration */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Settings size={16} /> Customize
                                </h3>
                                
                                {/* Dimensions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Width</label>
                                        <select 
                                            value={config.width}
                                            onChange={(e) => setConfig({...config, width: e.target.value})}
                                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                        >
                                            <option value="100%">100% (responsive)</option>
                                            <option value="600">600px</option>
                                            <option value="500">500px</option>
                                            <option value="400">400px</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Height</label>
                                        <select 
                                            value={config.height}
                                            onChange={(e) => setConfig({...config, height: e.target.value})}
                                            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                        >
                                            <option value="400">400px</option>
                                            <option value="500">500px</option>
                                            <option value="600">600px</option>
                                            <option value="700">700px</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Theme */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                                        <Palette size={12} /> Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['light', 'dark', 'auto'] as const).map(theme => (
                                            <button
                                                key={theme}
                                                onClick={() => setConfig({...config, theme})}
                                                className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                                                    config.theme === theme 
                                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Border Radius */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Border Radius: {config.borderRadius}px</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="24" 
                                        value={config.borderRadius}
                                        onChange={(e) => setConfig({...config, borderRadius: parseInt(e.target.value)})}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                                
                                {/* Branding Toggle - Only for Premium */}
                                <div className={`p-3 rounded-xl ${isPremium ? 'bg-slate-50' : 'bg-amber-50 border border-amber-200'}`}>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <div className="font-medium text-slate-700 text-sm">Show VoteGenerator branding</div>
                                            {!isPremium && (
                                                <div className="text-xs text-amber-700 mt-0.5">
                                                    Upgrade to Pro to remove branding
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={config.showBranding}
                                            onChange={(e) => isPremium && setConfig({...config, showBranding: e.target.checked})}
                                            disabled={!isPremium}
                                            className="w-5 h-5 accent-indigo-600"
                                        />
                                    </label>
                                </div>
                                
                                {/* Domain Restriction - Pro/Business Security Feature */}
                                <div className={`p-3 rounded-xl ${isPremium ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPremium ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                            <Shield size={16} className={isPremium ? 'text-emerald-600' : 'text-slate-400'} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium text-sm ${isPremium ? 'text-emerald-800' : 'text-slate-500'}`}>
                                                    Domain Restriction
                                                </span>
                                                {!isPremium && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-0.5">
                                                        <Lock size={8} /> PRO
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs mt-0.5 ${isPremium ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                Only allow embedding on specific domains
                                            </p>
                                            {isPremium ? (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        value={config.allowedDomains}
                                                        onChange={(e) => setConfig({...config, allowedDomains: e.target.value})}
                                                        placeholder="example.com, mysite.org"
                                                        className="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                                                    />
                                                    <p className="text-[10px] text-emerald-500 mt-1">
                                                        Leave empty to allow all domains. Separate multiple with commas.
                                                    </p>
                                                </div>
                                            ) : (
                                                <a 
                                                    href="/#pricing" 
                                                    className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium mt-1"
                                                >
                                                    Upgrade to unlock →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Embed Code */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Embed Code</label>
                                    <div className="relative">
                                        <pre className="bg-slate-900 text-slate-300 p-3 rounded-xl text-xs overflow-x-auto font-mono">
                                            {iframeCode}
                                        </pre>
                                        <button
                                            onClick={handleCopy}
                                            className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-400" />}
                                        </button>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCopy}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Embed Code</>}
                                </button>
                            </div>
                            
                            {/* Right: Preview */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-800">Preview</h3>
                                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                                        <button 
                                            onClick={() => setPreviewDevice('desktop')}
                                            className={`p-1.5 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
                                        >
                                            <Monitor size={14} />
                                        </button>
                                        <button 
                                            onClick={() => setPreviewDevice('mobile')}
                                            className={`p-1.5 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : 'text-slate-400'}`}
                                        >
                                            <Smartphone size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Preview Frame */}
                                <div className={`bg-slate-100 rounded-xl p-4 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                                    <div 
                                        className={`${config.theme === 'dark' ? 'bg-slate-800' : 'bg-white'} overflow-hidden`}
                                        style={{ 
                                            borderRadius: config.borderRadius,
                                            border: '1px solid #e2e8f0',
                                            minHeight: '300px'
                                        }}
                                    >
                                        {/* Simulated poll content */}
                                        <div className="p-4">
                                            <h4 className={`font-bold mb-3 ${config.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                {poll.title}
                                            </h4>
                                            <div className="space-y-2">
                                                {poll.options.slice(0, 4).map((opt, i) => (
                                                    <div 
                                                        key={i}
                                                        className={`p-3 rounded-lg border ${config.theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}
                                                    >
                                                        <span className={`text-sm ${config.theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                                            {opt.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm">
                                                Submit Vote
                                            </button>
                                        </div>
                                        
                                        {/* Branding Footer */}
                                        {config.showBranding && (
                                            <div className={`p-3 border-t ${config.theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                                                <a 
                                                    href="https://votegenerator.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center justify-center gap-2 text-xs ${config.theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} hover:text-indigo-600 transition-colors`}
                                                >
                                                    <BarChart2 size={12} />
                                                    <span>Powered by <strong>VoteGenerator</strong></span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* How it helps you */}
                                {!isPremium && (
                                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="text-xs text-emerald-800">
                                            <strong>💡 Did you know?</strong> Each embedded poll with branding helps spread the word about VoteGenerator. 
                                            <a href="/pricing" className="underline ml-1">Upgrade to Pro</a> to remove branding.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default EmbedModal;


// ============================================
// EMBEDDED POLL PAGE COMPONENT
// This is the page that renders inside the iframe
// ============================================

interface EmbedPollPageProps {
    pollId: string;
}

export const EmbedPollPage: React.FC<EmbedPollPageProps> = ({ pollId }) => {
    const [poll, _setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Parse URL params for config
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme') || 'light';
    const showBranding = params.get('branding') !== '0';
    
    useEffect(() => {
        // Fetch poll data
        const fetchPoll = async () => {
            try {
                // TODO: Import and use your actual service
                // const data = await getPoll(pollId);
                // setPoll(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPoll();
    }, [pollId]);
    
    // This component would render a minimal version of your vote UI
    // optimized for iframe embedding
    
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : poll ? (
                <div>
                    {/* Your poll voting UI here - simplified for embed */}
                    {/* ... */}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">Poll not found</div>
            )}
            
            {/* Branding Footer */}
            {showBranding && (
                <div className={`fixed bottom-0 left-0 right-0 p-2 border-t ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                    <a 
                        href="https://votegenerator.com?utm_source=embed&utm_medium=poll&utm_campaign=branding"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} hover:text-indigo-600 transition-colors`}
                    >
                        <BarChart2 size={12} />
                        <span>Create free polls at <strong>VoteGenerator.com</strong></span>
                        <ExternalLink size={10} />
                    </a>
                </div>
            )}
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { Link2, Check, X, Loader2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface Props {
    pollId: string;
    adminKey: string;
    currentSlug?: string | null;
    tier?: string;
}

const CustomSlugInput: React.FC<Props> = ({ 
    pollId, 
    adminKey, 
    currentSlug,
    tier = 'free'
}) => {
    const [slug, setSlug] = useState(currentSlug || '');
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [savedSlug, setSavedSlug] = useState(currentSlug || '');
    const [copied, setCopied] = useState(false);

    const isBusiness = tier === 'business';

    // Debounced availability check
    useEffect(() => {
        if (!slug || slug === savedSlug || !isBusiness) {
            setIsAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            setError(null);
            
            try {
                const response = await fetch(
                    `/.netlify/functions/vg-check-slug?slug=${encodeURIComponent(slug)}&pollId=${pollId}`
                );
                const data = await response.json();
                setIsAvailable(data.available);
                if (!data.available && data.reason) {
                    setError(data.reason);
                }
            } catch (e) {
                setIsAvailable(null);
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [slug, savedSlug, pollId, isBusiness]);

    const handleSave = async () => {
        if (!isAvailable || !slug) return;
        
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch('/.netlify/functions/vg-create-slug', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, pollId, adminKey })
            });

            const data = await response.json();

            if (data.success) {
                setSavedSlug(slug);
                setIsAvailable(null);
            } else {
                setError(data.error || 'Failed to save custom link');
            }
        } catch (e) {
            setError('Failed to save custom link');
        } finally {
            setIsSaving(false);
        }
    };

    const getFullUrl = () => {
        const baseUrl = window.location.origin;
        return savedSlug ? `${baseUrl}/p/${savedSlug}` : `${baseUrl}/#id=${pollId}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getFullUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatSlug = (input: string) => {
        return input
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 50);
    };

    // Show locked state for non-Business tiers
    if (!isBusiness) {
        return (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 opacity-75">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-200 rounded-lg">
                            <Link2 size={18} className="text-slate-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-600">Custom Short Link</span>
                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">BUSINESS</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Create memorable URLs like /p/team-vote
                            </p>
                        </div>
                    </div>
                    <a 
                        href="/pricing" 
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Upgrade →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <Link2 size={14} className="text-amber-600" />
                <span className="text-xs font-semibold text-slate-600">Custom Link</span>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">UNLIMITED</span>
            </div>

            {savedSlug ? (
                // Saved slug display
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                        <Check size={14} className="text-green-600 flex-shrink-0" />
                        <span className="text-xs text-green-700 font-mono truncate flex-1">
                            /p/{savedSlug}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-1 hover:bg-green-100 rounded text-green-600"
                            title="Copy link"
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <a
                            href={`/p/${savedSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-green-100 rounded text-green-600"
                            title="Open in new tab"
                        >
                            <ExternalLink size={12} />
                        </a>
                    </div>
                    <button
                        onClick={() => { setSavedSlug(''); setSlug(''); }}
                        className="text-[10px] text-green-600 hover:underline mt-1"
                    >
                        Change
                    </button>
                </div>
            ) : (
                // Input form
                <div className="space-y-2">
                    {/* Show full URL preview */}
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                        {window.location.host}/p/<span className="text-indigo-600">{slug || 'your-custom-name'}</span>
                    </p>
                    <div className="flex items-stretch gap-1">
                        {/* Fixed prefix */}
                        <div className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-lg px-2 flex items-center">
                            <span className="text-xs text-slate-500 font-mono whitespace-nowrap">/p/</span>
                        </div>
                        {/* Editable slug input */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(formatSlug(e.target.value))}
                                placeholder="my-poll"
                                className={`w-full px-2 py-1.5 border rounded-r-lg text-xs font-mono focus:outline-none focus:ring-1 ${
                                    isAvailable === true ? 'border-green-300 focus:ring-green-300 bg-green-50' :
                                    isAvailable === false ? 'border-red-300 focus:ring-red-300 bg-red-50' :
                                    'border-slate-200 focus:ring-indigo-300'
                                }`}
                            />
                            {/* Status indicator */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                {isChecking && <Loader2 size={12} className="text-slate-400 animate-spin" />}
                                {!isChecking && isAvailable === true && <Check size={12} className="text-green-500" />}
                                {!isChecking && isAvailable === false && <X size={12} className="text-red-500" />}
                            </div>
                        </div>
                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            disabled={!isAvailable || isSaving || !slug}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-[10px] text-red-600 flex items-center gap-1">
                            <AlertCircle size={10} /> {error}
                        </p>
                    )}
                    
                    <p className="text-[10px] text-slate-400">
                        Letters, numbers, dashes only. Example: team-vote-2024
                    </p>
                </div>
            )}
        </div>
    );
};

export default CustomSlugInput;
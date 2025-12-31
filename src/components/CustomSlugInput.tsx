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

    const isUnlimited = tier === 'unlimited';
    const baseUrl = window.location.origin;

    // Debounced availability check
    useEffect(() => {
        if (!slug || slug === savedSlug || !isUnlimited) {
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
    }, [slug, savedSlug, pollId, isUnlimited]);

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

    const handleCopy = () => {
        const url = savedSlug 
            ? `${baseUrl}/p/${savedSlug}`
            : `${baseUrl}/#id=${pollId}`;
        navigator.clipboard.writeText(url);
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

    if (!isUnlimited) {
        return (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link2 size={14} />
                    <span>Custom poll links available with Unlimited plan</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Link2 size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">Custom Poll Link</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unlimited</span>
            </div>

            {savedSlug ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 font-medium mb-1">Your custom link:</p>
                            <p className="text-sm font-mono text-green-800">
                                {baseUrl}/p/{savedSlug}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <a
                                href={`/p/${savedSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={() => setSavedSlug('')}
                        className="mt-2 text-xs text-green-600 hover:text-green-800 underline"
                    >
                        Change custom link
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                {baseUrl}/p/
                            </span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(formatSlug(e.target.value))}
                                placeholder="my-cool-poll"
                                className="w-full pl-[140px] pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                                style={{ paddingLeft: `${baseUrl.length * 7 + 40}px` }}
                            />
                            {isChecking && (
                                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                            )}
                            {!isChecking && isAvailable === true && (
                                <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                            )}
                            {!isChecking && isAvailable === false && (
                                <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!isAvailable || isSaving || !slug}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-lg text-sm transition-colors"
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-600">
                            <AlertCircle size={12} />
                            {error}
                        </div>
                    )}

                    <p className="text-xs text-slate-400">
                        Use letters, numbers, and dashes. Example: team-vote-2024
                    </p>
                </>
            )}
        </div>
    );
};

export default CustomSlugInput;
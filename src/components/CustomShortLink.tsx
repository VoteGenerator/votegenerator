import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, Loader2, AlertCircle } from 'lucide-react';

interface CustomShortLinkProps {
    pollId: string;
    adminKey: string;
}

// Service function (can also be in separate service file)
const createCustomSlug = async (
    slug: string,
    pollId: string,
    adminKey: string
): Promise<{ success: boolean; shortUrl?: string; adminUrl?: string; error?: string }> => {
    try {
        const response = await fetch('/.netlify/functions/vg-create-slug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, pollId, adminKey })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Failed to create short link' };
        }

        return { 
            success: true, 
            shortUrl: data.shortUrl,
            adminUrl: data.adminUrl
        };
    } catch (error) {
        console.error('Create slug error:', error);
        return { success: false, error: 'Failed to create short link' };
    }
};

const getExistingSlug = async (pollId: string): Promise<string | null> => {
    try {
        const response = await fetch(`/.netlify/functions/vg-get-slug?pollId=${pollId}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.slug || null;
    } catch {
        return null;
    }
};

const CustomShortLink: React.FC<CustomShortLinkProps> = ({ pollId, adminKey }) => {
    const [slug, setSlug] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [adminUrl, setAdminUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [copied, setCopied] = useState<'share' | 'admin' | null>(null);

    // Check for existing slug on mount
    useEffect(() => {
        const checkExisting = async () => {
            setIsChecking(true);
            const existing = await getExistingSlug(pollId);
            if (existing) {
                const baseUrl = window.location.origin;
                setShortUrl(`${baseUrl}/v/${existing}`);
                setAdminUrl(`${baseUrl}/v/${existing}?admin=${adminKey}`);
            }
            setIsChecking(false);
        };
        checkExisting();
    }, [pollId, adminKey]);

    const handleCreate = async () => {
        if (!slug.trim()) return;
        
        setIsLoading(true);
        setError('');
        
        const result = await createCustomSlug(slug, pollId, adminKey);
        
        if (result.success) {
            setShortUrl(result.shortUrl!);
            setAdminUrl(result.adminUrl!);
        } else {
            setError(result.error || 'Failed to create short link');
        }
        
        setIsLoading(false);
    };

    const handleCopy = async (url: string, type: 'share' | 'admin') => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        }
    };

    const sanitizeSlug = (input: string) => {
        return input
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    };

    if (isChecking) {
        return (
            <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Checking for custom link...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <Link2 size={18} className="text-indigo-600" />
                <h4 className="font-bold text-slate-800">Custom Short Link</h4>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">PRO</span>
            </div>
            
            {shortUrl ? (
                // Show existing short link
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Share Link</label>
                        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
                            <span className="text-green-800 font-medium text-sm flex-1 truncate">{shortUrl}</span>
                            <button 
                                onClick={() => handleCopy(shortUrl, 'share')}
                                className="p-1.5 hover:bg-green-100 rounded transition-colors"
                            >
                                {copied === 'share' ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <Copy size={16} className="text-green-600" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Admin Link (keep private)</label>
                        <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                            <span className="text-amber-800 font-medium text-sm flex-1 truncate">{adminUrl}</span>
                            <button 
                                onClick={() => handleCopy(adminUrl, 'admin')}
                                className="p-1.5 hover:bg-amber-100 rounded transition-colors"
                            >
                                {copied === 'admin' ? (
                                    <Check size={16} className="text-amber-600" />
                                ) : (
                                    <Copy size={16} className="text-amber-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Create new short link form
                <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                        Create a memorable link for your poll:
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm whitespace-nowrap">votegenerator.com/v/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                            placeholder="my-poll-name"
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            maxLength={50}
                            disabled={isLoading}
                        />
                    </div>
                    {slug && (
                        <p className="text-xs text-slate-500">
                            Preview: votegenerator.com/v/<span className="font-medium text-indigo-600">{slug}</span>
                        </p>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleCreate}
                        disabled={!slug.trim() || isLoading}
                        className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Link2 size={16} />
                                Create Short Link
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomShortLink;
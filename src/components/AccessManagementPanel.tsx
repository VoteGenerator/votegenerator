// ============================================================================
// AccessManagementPanel.tsx - Manage Admin & Viewer Tokens
// Location: src/components/AccessManagementPanel.tsx
// Unlimited plan only - appears in admin dashboard sidebar
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Plus, Copy, Check, Trash2, Users, Eye, Edit3,
    Crown, Clock, ExternalLink, AlertCircle, Loader2, X,
    Key, Lock, Settings, ChevronDown, ChevronUp
} from 'lucide-react';

interface AccessToken {
    token: string;
    role: 'admin' | 'viewer';
    label: string;
    createdAt: string;
    lastUsed?: string;
    expiresAt?: string;
}

interface AccessManagementPanelProps {
    pollId: string;
    adminKey: string;
    tokens: AccessToken[];
    hasPin: boolean;
    onTokensChange: () => void;
    onSetupPin: () => void;
}

const MAX_TOKENS = 10;

const AccessManagementPanel: React.FC<AccessManagementPanelProps> = ({
    pollId,
    adminKey,
    tokens,
    hasPin,
    onTokensChange,
    onSetupPin
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [createMode, setCreateMode] = useState<'admin' | 'viewer' | null>(null);
    const [newLabel, setNewLabel] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const adminTokens = tokens.filter(t => t.role === 'admin');
    const viewerTokens = tokens.filter(t => t.role === 'viewer');

    const getTokenUrl = (token: string) => {
        return `${window.location.origin}/#id=${pollId}&access=${token}`;
    };

    const handleCopy = (token: string) => {
        navigator.clipboard.writeText(getTokenUrl(token));
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const handleCreate = async () => {
        if (!createMode || !newLabel.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/.netlify/functions/vg-create-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId,
                    adminKey,
                    role: createMode,
                    label: newLabel.trim()
                })
            });

            const data = await res.json();

            if (res.ok) {
                setCreateMode(null);
                setNewLabel('');
                setIsCreating(false);
                onTokensChange();
            } else {
                setError(data.error || 'Failed to create token');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (token: string, label: string) => {
        if (!confirm(`Revoke access for "${label}"? They will no longer be able to view this poll.`)) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/.netlify/functions/vg-revoke-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId, adminKey, token })
            });

            if (res.ok) {
                onTokensChange();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to revoke token');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const formatLastUsed = (dateStr?: string) => {
        if (!dateStr) return 'Never used';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateStr);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Shield size={20} className="text-amber-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-slate-800">Access Management</h3>
                        <p className="text-xs text-slate-500">
                            {tokens.length} shared • {MAX_TOKENS - tokens.length} remaining
                        </p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-slate-100">
                            {/* PIN Protection */}
                            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lock size={16} className={hasPin ? 'text-emerald-600' : 'text-slate-400'} />
                                        <span className="text-sm font-medium text-slate-700">
                                            PIN Protection
                                        </span>
                                        {hasPin ? (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-medium rounded-full">
                                                Off
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={onSetupPin}
                                        className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        {hasPin ? 'Change' : 'Set up'}
                                    </button>
                                </div>
                            </div>

                            {/* Master Key Info */}
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Crown size={16} className="text-amber-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-amber-800">Your Master Key</p>
                                        <p className="text-xs text-amber-600 mt-0.5">
                                            Full control. Cannot be revoked. Keep it safe!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                    <AlertCircle size={16} className="text-red-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-red-700">{error}</p>
                                        <button
                                            onClick={() => setError(null)}
                                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Token Lists */}
                            <div className="space-y-4">
                                {/* Admin Tokens */}
                                {adminTokens.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Edit3 size={14} className="text-blue-500" />
                                            <span className="text-xs font-semibold text-slate-500 uppercase">
                                                Admin Access ({adminTokens.length})
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {adminTokens.map(token => (
                                                <TokenCard
                                                    key={token.token}
                                                    token={token}
                                                    onCopy={() => handleCopy(token.token)}
                                                    onRevoke={() => handleRevoke(token.token, token.label)}
                                                    isCopied={copiedToken === token.token}
                                                    formatLastUsed={formatLastUsed}
                                                    isLoading={isLoading}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Viewer Tokens */}
                                {viewerTokens.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Eye size={14} className="text-slate-500" />
                                            <span className="text-xs font-semibold text-slate-500 uppercase">
                                                View-Only Access ({viewerTokens.length})
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {viewerTokens.map(token => (
                                                <TokenCard
                                                    key={token.token}
                                                    token={token}
                                                    onCopy={() => handleCopy(token.token)}
                                                    onRevoke={() => handleRevoke(token.token, token.label)}
                                                    isCopied={copiedToken === token.token}
                                                    formatLastUsed={formatLastUsed}
                                                    isLoading={isLoading}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {tokens.length === 0 && !isCreating && (
                                    <div className="text-center py-6 text-slate-500">
                                        <Users size={24} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No shared access yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Create Token UI */}
                            {isCreating && createMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        {createMode === 'admin' ? (
                                            <Edit3 size={16} className="text-blue-500" />
                                        ) : (
                                            <Eye size={16} className="text-slate-500" />
                                        )}
                                        <span className="font-medium text-slate-700">
                                            New {createMode === 'admin' ? 'Admin' : 'Viewer'} Token
                                        </span>
                                    </div>

                                    <input
                                        type="text"
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        placeholder="Label (e.g., Sarah - Marketing)"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                                        maxLength={50}
                                        autoFocus
                                    />

                                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                                        {createMode === 'admin' ? (
                                            <div className="space-y-1">
                                                <p>✅ View live results</p>
                                                <p>✅ Edit poll questions & options</p>
                                                <p>✅ Export to CSV</p>
                                                <p>❌ Cannot delete or close poll</p>
                                                <p>❌ Cannot manage access</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p>✅ View live results (read-only)</p>
                                                <p>❌ Cannot edit anything</p>
                                                <p>❌ Cannot export data</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsCreating(false);
                                                setCreateMode(null);
                                                setNewLabel('');
                                            }}
                                            className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!newLabel.trim() || isLoading}
                                            className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Key size={14} />
                                                    Create
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Create Buttons */}
                            {!isCreating && tokens.length < MAX_TOKENS && (
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsCreating(true);
                                            setCreateMode('admin');
                                        }}
                                        className="flex-1 py-2.5 border-2 border-dashed border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-300 transition flex items-center justify-center gap-1.5"
                                    >
                                        <Plus size={16} />
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsCreating(true);
                                            setCreateMode('viewer');
                                        }}
                                        className="flex-1 py-2.5 border-2 border-dashed border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-1.5"
                                    >
                                        <Plus size={16} />
                                        Viewer
                                    </button>
                                </div>
                            )}

                            {tokens.length >= MAX_TOKENS && (
                                <p className="mt-4 text-xs text-center text-slate-400">
                                    Maximum {MAX_TOKENS} tokens reached. Revoke one to create more.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Token Card Sub-component
const TokenCard: React.FC<{
    token: AccessToken;
    onCopy: () => void;
    onRevoke: () => void;
    isCopied: boolean;
    formatLastUsed: (date?: string) => string;
    isLoading: boolean;
}> = ({ token, onCopy, onRevoke, isCopied, formatLastUsed, isLoading }) => (
    <div className="p-3 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">
                    {token.label}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatLastUsed(token.lastUsed)}
                    </span>
                    {token.role === 'admin' && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                            Admin
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onCopy}
                    className="p-1.5 hover:bg-slate-100 rounded transition"
                    title="Copy link"
                >
                    {isCopied ? (
                        <Check size={16} className="text-emerald-600" />
                    ) : (
                        <Copy size={16} className="text-slate-400" />
                    )}
                </button>
                <button
                    onClick={onRevoke}
                    disabled={isLoading}
                    className="p-1.5 hover:bg-red-50 rounded transition text-slate-400 hover:text-red-600"
                    title="Revoke access"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
);

export default AccessManagementPanel;
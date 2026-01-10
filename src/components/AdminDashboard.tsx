// ============================================================================
// AdminDashboard.tsx - Complete with search, pagination, draft/live
// Location: src/components/AdminDashboard.tsx
// ============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, Plus, Copy, Check, ExternalLink, Trash2,
    Crown, Loader2, Clock, Users, LayoutDashboard,
    Calendar, Sparkles, AlertCircle, PlusCircle,
    Zap, Share2, Settings, X, CheckCircle, Link2,
    Shield, Eye, Edit3, Lock, Key, ChevronDown, ChevronUp,
    Search, ChevronLeft, ChevronRight, Rocket, FileEdit,
    Home, AlertTriangle, RefreshCw, QrCode, Palette, Mail,
    ListOrdered, CheckSquare, ArrowLeftRight, SlidersHorizontal, Image as ImageIcon, ArrowRight
} from 'lucide-react';
import ShareCards from './ShareCards';
import UpgradeModal from './UpgradeModal';

// Poll type display helper
const POLL_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    multiple: { label: 'Multiple Choice', icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    ranked: { label: 'Ranked', icon: ListOrdered, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    pairwise: { label: 'This or That', icon: ArrowLeftRight, color: 'text-orange-600', bg: 'bg-orange-50' },
    meeting: { label: 'Meeting', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    rating: { label: 'Rating', icon: SlidersHorizontal, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    rsvp: { label: 'RSVP', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    image: { label: 'Visual', icon: ImageIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
};

// ============================================================================
// Types
// ============================================================================

interface UserPoll {
    id: string;
    adminKey: string;
    title: string;
    description?: string;
    type: string;
    createdAt: string;
    responseCount?: number;
    status?: 'draft' | 'live';  // For Pro/Pro polls
    expiresAt?: string;
    customSlug?: string;
}

interface UserSession {
    dashboardToken: string;
    tier: 'free' | 'pro' | 'business';
    expiresAt?: string;
    polls: UserPoll[];
    createdAt: string;
    hasPin?: boolean;
    pinHash?: string;
    sessionId?: string;  // Stripe session ID for URL reconstruction
    email?: string;      // Partial email for display
}

// ============================================================================
// Configuration
// ============================================================================

const POLLS_PER_PAGE = 10;

const TIER_CONFIG: Record<string, {
    label: string;
    gradient: string;
    bgGradient: string;
    headerBg: string;
    icon: React.ReactNode;
    maxPolls: number;
    maxResponses: number;
    activeDays: number;
    requiresActivation: boolean;
    features: { name: string; included: boolean }[];
}> = {
    free: {
        label: 'Free',
        gradient: 'from-slate-500 to-slate-600',
        bgGradient: 'from-slate-50 via-white to-slate-50',
        headerBg: 'bg-slate-100',
        icon: <BarChart3 size={16} />,
        maxPolls: 3,
        maxResponses: 100,
        activeDays: 30,
        requiresActivation: false,
        features: [
            { name: 'All poll types', included: true },
            { name: '100 responses/month', included: true },
            { name: '3 active polls', included: true },
            { name: '30 days active', included: true },
            { name: 'Export to CSV', included: false },
        ]
    },
    pro: {
        label: 'Pro',
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-50/40 via-white to-pink-50/40',
        headerBg: 'bg-purple-50',
        icon: <Crown size={16} />,
        maxPolls: Infinity,
        maxResponses: 5000,
        activeDays: 365,
        requiresActivation: false,
        features: [
            { name: 'All poll types', included: true },
            { name: '5,000 responses/month', included: true },
            { name: 'Business polls', included: true },
            { name: 'Export CSV/PDF/PNG', included: true },
            { name: 'Custom branding', included: true },
        ]
    },
    business: {
        label: 'Business',
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'from-amber-50/30 via-white to-orange-50/30',
        headerBg: 'bg-amber-50',
        icon: <Sparkles size={16} />,
        maxPolls: Infinity,
        maxResponses: 50000,
        activeDays: 365,
        requiresActivation: false,
        features: [
            { name: 'All poll types', included: true },
            { name: '50,000 responses/month', included: true },
            { name: 'Business polls', included: true },
            { name: 'Export CSV/PDF/PNG', included: true },
            { name: 'PIN protection', included: true },
            { name: 'Custom branding', included: true },
            { name: 'Priority support', included: true },
        ]
    },
};

// ============================================================================
// Main Component
// ============================================================================

const AdminDashboard: React.FC = () => {
    const [session, setSession] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    
    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const [showAccessPanel, setShowAccessPanel] = useState(false); // Start collapsed
    const [showPlanPanel, setShowPlanPanel] = useState(true);
    const [showStatsPanel, setShowStatsPanel] = useState(true);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [showGoLiveModal, setShowGoLiveModal] = useState<string | null>(null);
    const [showShareCards, setShowShareCards] = useState<string | null>(null); // Poll ID for share cards modal
    
    // Search & Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [adminLinkWarningDismissed, setAdminLinkWarningDismissed] = useState(false);
    const [copiedDashboardLink, setCopiedDashboardLink] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Get token and session_id from URL (supports multiple formats)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlDashboardToken = urlParams.get('t'); // NEW: Short token format from email
    const urlSessionId = urlParams.get('session_id') || urlParams.get('s'); // Legacy: session ID format
    const urlTier = urlParams.get('tier') as 'pro' | 'business' | null;
    const highlightPollId = urlParams.get('highlight'); // Highlight newly created poll
    
    // Fallback poll data from URL (in case localStorage doesn't persist through ad-wall)
    const urlPollId = urlParams.get('pid');
    const urlPollKey = urlParams.get('key');
    const urlPollTitle = urlParams.get('title') ? decodeURIComponent(urlParams.get('title')!) : null;
    const urlPollType = urlParams.get('pt');
    
    // State for highlight animation
    const [justCreatedPollId, setJustCreatedPollId] = useState<string | null>(highlightPollId);

    // Fetch customer data by dashboard token from backend
    const fetchCustomerByToken = async (token: string): Promise<UserSession | null> => {
        try {
            const response = await fetch(`/.netlify/functions/vg-get-customer?token=${encodeURIComponent(token)}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    dashboardToken: data.dashboardToken || token,
                    tier: data.tier,
                    expiresAt: data.expiresAt,
                    polls: data.polls || [],
                    createdAt: data.createdAt,
                    email: data.email,
                };
            }
        } catch (e) {
            console.error('Failed to fetch customer by token:', e);
        }
        return null;
    };
    
    // Fetch customer data by session ID (legacy support)
    const fetchCustomerBySessionId = async (sessionId: string): Promise<UserSession | null> => {
        console.log(`AdminDashboard: Fetching customer by session ID: ${sessionId.substring(0, 20)}...`);
        try {
            const response = await fetch(`/.netlify/functions/vg-get-customer?session_id=${encodeURIComponent(sessionId)}`);
            console.log(`AdminDashboard: vg-get-customer response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`AdminDashboard: Got customer data:`, { 
                    tier: data.tier, 
                    hasToken: !!data.dashboardToken,
                    tokenPreview: data.dashboardToken?.substring(0, 8) 
                });
                return {
                    dashboardToken: data.dashboardToken,
                    sessionId: sessionId, // Keep for backwards compatibility
                    tier: data.tier,
                    expiresAt: data.expiresAt,
                    polls: data.polls || [],
                    createdAt: data.createdAt,
                    email: data.email,
                };
            } else {
                const errorText = await response.text();
                console.log(`AdminDashboard: vg-get-customer error: ${errorText}`);
            }
        } catch (e) {
            console.error('AdminDashboard: Failed to fetch customer by session ID:', e);
        }
        return null;
    };

    useEffect(() => {
        validateAndLoadSession();
    }, []);

    // Refresh poll data from backend to get updated vote counts
    const refreshPollData = async (sessionData: UserSession) => {
        if (!sessionData.polls || sessionData.polls.length === 0) return;
        
        try {
            const updatedPolls = await Promise.all(
                sessionData.polls.map(async (poll) => {
                    try {
                        const response = await fetch(`/.netlify/functions/vg-get?id=${poll.id}&admin=${poll.adminKey}`);
                        if (response.ok) {
                            const freshData = await response.json();
                            return {
                                ...poll,
                                responseCount: freshData.voteCount || freshData.responseCount || 0,
                                status: freshData.status || poll.status,
                            };
                        }
                    } catch (e) {
                        console.warn(`Failed to refresh poll ${poll.id}:`, e);
                    }
                    return poll;
                })
            );
            
            const updatedSession = { ...sessionData, polls: updatedPolls };
            setSession(updatedSession);
            localStorage.setItem('vg_user_session', JSON.stringify(updatedSession));
        } catch (e) {
            console.error('Failed to refresh poll data:', e);
        }
    };

    // Refresh poll data when session is loaded
    useEffect(() => {
        if (session && !loading) {
            refreshPollData(session);
        }
    }, [loading]);

    // Clear highlight after 10 seconds and clean up URL
    useEffect(() => {
        if (highlightPollId) {
            // Clean URL immediately but keep highlight visible
            const url = new URL(window.location.href);
            url.searchParams.delete('highlight');
            window.history.replaceState({}, '', url.pathname + url.search);
            
            // Clear highlight after 10 seconds
            const timer = setTimeout(() => {
                setJustCreatedPollId(null);
            }, 10000);
            
            return () => clearTimeout(timer);
        }
    }, [highlightPollId]);

    const validateAndLoadSession = async () => {
        try {
            const stored = localStorage.getItem('vg_user_session');
            
            // Case 1: Coming from email with SHORT token (?t=xxx) - BEST PATH
            if (urlDashboardToken) {
                const customerData = await fetchCustomerByToken(urlDashboardToken);
                
                if (customerData) {
                    customerData.dashboardToken = urlDashboardToken; // Ensure we keep the token
                    localStorage.setItem('vg_user_session', JSON.stringify(customerData));
                    localStorage.setItem('vg_purchased_tier', customerData.tier);
                    if (customerData.expiresAt) {
                        localStorage.setItem('vg_tier_expires', customerData.expiresAt);
                    }
                    
                    setSession(customerData);
                    
                    setLoading(false);
                    window.history.replaceState({}, '', '/admin');
                    return;
                }
                
                // Token lookup failed - fallback to localStorage
                if (stored) {
                    const sessionData: UserSession = JSON.parse(stored);
                    sessionData.dashboardToken = urlDashboardToken;
                    setSession(sessionData);
                    
                    setLoading(false);
                    return;
                }
                
                setError('Invalid or expired dashboard link.');
                setLoading(false);
                return;
            }
            
            // Case 2: Coming from Stripe redirect with session_id (?s=xxx)
            // The short token IS in the backend - fetch it!
            if (urlSessionId) {
                console.log('AdminDashboard: Fetching customer by session_id...');
                const customerData = await fetchCustomerBySessionId(urlSessionId);
                
                if (customerData && customerData.dashboardToken) {
                    // Got it! Save and use
                    localStorage.setItem('vg_user_session', JSON.stringify(customerData));
                    localStorage.setItem('vg_purchased_tier', customerData.tier);
                    if (customerData.expiresAt) {
                        localStorage.setItem('vg_tier_expires', customerData.expiresAt);
                    }
                    
                    setSession(customerData);
                    
                    setLoading(false);
                    // Update URL to short format
                    window.history.replaceState({}, '', `/admin?t=${customerData.dashboardToken}`);
                    console.log('AdminDashboard: Got short token:', customerData.dashboardToken);
                    return;
                }
                
                // Backend lookup failed - use localStorage or create temp session
                console.log('AdminDashboard: Backend lookup failed, using fallback');
                if (stored) {
                    const sessionData: UserSession = JSON.parse(stored);
                    sessionData.sessionId = urlSessionId;
                    setSession(sessionData);
                    
                    setLoading(false);
                    window.history.replaceState({}, '', '/admin');
                    return;
                }
                
                // Create temp session (webhook may still be processing)
                const tier = urlTier || 'business';
                const days = tier === 'business' ? 365 : 30;
                const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                
                const newSession: UserSession = {
                    dashboardToken: '',
                    sessionId: urlSessionId,
                    tier,
                    expiresAt,
                    polls: [],
                    createdAt: new Date().toISOString(),
                };
                
                localStorage.setItem('vg_user_session', JSON.stringify(newSession));
                setSession(newSession);
                
                setLoading(false);
                window.history.replaceState({}, '', '/admin');
                return;
            }
            
            // Case 3: No URL params - use localStorage
            if (stored) {
                const sessionData: UserSession = JSON.parse(stored);
                
                // If we have sessionId but no dashboardToken, fetch it now!
                if (sessionData.sessionId && !sessionData.dashboardToken) {
                    console.log('AdminDashboard: Have sessionId but no token, fetching...');
                    const customerData = await fetchCustomerBySessionId(sessionData.sessionId);
                    
                    if (customerData && customerData.dashboardToken) {
                        // Got it! Update localStorage and state
                        const updatedSession = { ...sessionData, ...customerData };
                        localStorage.setItem('vg_user_session', JSON.stringify(updatedSession));
                        setSession(updatedSession);
                        
                        setLoading(false);
                        console.log('AdminDashboard: Got dashboardToken:', customerData.dashboardToken);
                        return;
                    }
                }
                
                setSession(sessionData);
                
                setLoading(false);
                return;
            }
            
            // Case 4: No paid session - check for FREE user with polls in localStorage
            const savedPolls = localStorage.getItem('vg_polls') || localStorage.getItem('myPolls');
            if (savedPolls) {
                try {
                    const polls = JSON.parse(savedPolls);
                    if (polls && polls.length > 0) {
                        // Migrate myPolls to vg_polls if needed
                        if (!localStorage.getItem('vg_polls') && localStorage.getItem('myPolls')) {
                            localStorage.setItem('vg_polls', savedPolls);
                            localStorage.removeItem('myPolls');
                        }
                        // Create a FREE session with their polls
                        const freeSession: UserSession = {
                            dashboardToken: 'free_user',
                            tier: 'free',
                            polls: polls.map((p: any) => ({
                                id: p.id,
                                adminKey: p.adminKey,
                                title: p.title || 'Untitled Poll',
                                type: p.type || 'multiple',
                                createdAt: p.createdAt,
                                responseCount: 0,
                                status: 'live',
                            })),
                            createdAt: polls[0]?.createdAt || new Date().toISOString(),
                        };
                        setSession(freeSession);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse vg_polls:', e);
                }
            }
            
            // Case 4.5: Fallback - poll data passed in URL params (localStorage didn't persist through ad-wall)
            if (urlPollId && urlPollKey) {
                console.log('AdminDashboard: Using URL params fallback for poll data');
                const newPoll = {
                    id: urlPollId,
                    adminKey: urlPollKey,
                    title: urlPollTitle || 'Untitled Poll',
                    type: urlPollType || 'multiple',
                    createdAt: new Date().toISOString(),
                };
                
                // MERGE with existing polls instead of overwriting
                const existingPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
                const pollExists = existingPolls.some((p: any) => p.id === newPoll.id);
                if (!pollExists) {
                    existingPolls.unshift(newPoll);
                }
                localStorage.setItem('vg_polls', JSON.stringify(existingPolls));
                
                // Create a FREE session with ALL polls
                const freeSession: UserSession = {
                    dashboardToken: 'free_user',
                    tier: 'free',
                    polls: existingPolls.map((p: any) => ({
                        id: p.id,
                        adminKey: p.adminKey,
                        title: p.title || 'Untitled Poll',
                        type: p.type || 'multiple',
                        createdAt: p.createdAt,
                        responseCount: 0,
                        status: 'live',
                    })),
                    createdAt: existingPolls[0]?.createdAt || new Date().toISOString(),
                };
                setSession(freeSession);
                setLoading(false);
                
                // Clean up URL params but keep highlight
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete('pid');
                cleanUrl.searchParams.delete('key');
                cleanUrl.searchParams.delete('title');
                cleanUrl.searchParams.delete('pt');
                window.history.replaceState({}, '', cleanUrl.pathname + cleanUrl.search);
                return;
            }
            
            // Case 5: Nothing found - no session, no polls
            setError('No session found. Please purchase a plan first.');
            setLoading(false);
        } catch (err) {
            console.error('Session load error:', err);
            setError('Failed to load session. Please try again.');
            setLoading(false);
        }
    };

    // Check if plan is expired
    const isPlanExpired = useMemo(() => {
        if (!session) return false;
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) return true;
        return false;
    }, [session]);

    // Filtered and paginated polls - with highlight sorting
    const filteredPolls = useMemo(() => {
        if (!session) return [];
        let polls = session.polls || [];
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            polls = polls.filter(p => 
                p.title.toLowerCase().includes(query) ||
                p.type?.toLowerCase().includes(query)
            );
        }
        
        // Sort: highlighted poll first, then by createdAt descending
        if (justCreatedPollId) {
            polls = [...polls].sort((a, b) => {
                if (a.id === justCreatedPollId) return -1;
                if (b.id === justCreatedPollId) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }
        
        return polls;
    }, [session, searchQuery, justCreatedPollId]);

    const totalPages = Math.ceil(filteredPolls.length / POLLS_PER_PAGE);
    const paginatedPolls = useMemo(() => {
        const start = (currentPage - 1) * POLLS_PER_PAGE;
        return filteredPolls.slice(start, start + POLLS_PER_PAGE);
    }, [filteredPolls, currentPage]);

    // Count live polls (for Pro/Pro limit)
    const livePolls = useMemo(() => {
        if (!session) return [];
        return (session.polls || []).filter(p => p.status === 'live' || session.tier !== 'free');
    }, [session]);

    const handleCopyLink = (poll: UserPoll, type: 'admin' | 'vote') => {
        const url = type === 'admin'
            ? `${window.location.origin}/#id=${poll.id}&admin=${poll.adminKey}`
            : `${window.location.origin}/#id=${poll.id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(`${poll.id}-${type}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeletePoll = async (poll: UserPoll) => {
        if (!session) return;
        
        // Get response count for warning message
        const hasResponses = (poll.responseCount || 0) > 0;
        const isRestrictedTier = session.tier === 'free' || session.tier === 'pro';
        
        // Different confirmation messages based on tier and responses
        let confirmMessage = `Delete "${poll.title}"?`;
        if (hasResponses) {
            if (isRestrictedTier) {
                alert(`Cannot delete "${poll.title}" - it has ${poll.responseCount} response(s). On the Free plan, you can only delete polls with 0 responses. Upgrade to Pro or higher to delete polls with responses.`);
                return;
            } else {
                confirmMessage = `Delete "${poll.title}"? This poll has ${poll.responseCount} response(s) that will be permanently deleted.`;
            }
        }
        
        if (!confirm(confirmMessage)) return;
        
        try {
            const response = await fetch('/.netlify/functions/vg-delete-poll', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId: poll.id,
                    adminKey: poll.adminKey,
                    dashboardToken: session.dashboardToken
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Remove from local state
                const updated = { ...session, polls: session.polls.filter(p => p.id !== poll.id) };
                localStorage.setItem('vg_user_session', JSON.stringify(updated));
                setSession(updated);
            } else if (data.upgradeRequired) {
                // Tier restriction error
                alert(data.error);
            } else {
                alert(data.error || 'Failed to delete poll. Please try again.');
            }
        } catch (err) {
            console.error('Delete poll error:', err);
            // Fallback: just remove from local UI
            const updated = { ...session, polls: session.polls.filter(p => p.id !== poll.id) };
            localStorage.setItem('vg_user_session', JSON.stringify(updated));
            setSession(updated);
        }
    };

    const handleGoLive = async (pollId: string) => {
        if (!session) return;
        
        // Update poll status to live
        const updatedPolls = session.polls.map(p => 
            p.id === pollId ? { ...p, status: 'live' as const } : p
        );
        const updated = { ...session, polls: updatedPolls };
        localStorage.setItem('vg_user_session', JSON.stringify(updated));
        setSession(updated);
        setShowGoLiveModal(null);
        
        // TODO: Call backend to activate poll
        // await fetch('/.netlify/functions/vg-activate-poll', { ... });
    };

    const handleRegenerateToken = () => {
        if (!session) return;
        if (!confirm('Generate new dashboard link? Your old link will stop working.')) return;
        
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let newToken = '';
        for (let i = 0; i < 16; i++) {
            newToken += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const updated = { ...session, dashboardToken: newToken };
        localStorage.setItem('vg_user_session', JSON.stringify(updated));
        window.location.href = `/admin?token=${newToken}`;
    };

    const goHome = () => {
        window.location.href = '/';
    };
    
    const goToCreate = () => {
        // Ensure the tier is set in localStorage for VoteGeneratorCreate to pick up
        if (session?.tier) {
            localStorage.setItem('vg_purchased_tier', session.tier);
            // Also store expiration info
            if (session.expiresAt) {
                localStorage.setItem('vg_tier_expires', session.expiresAt);
            }
        }
        // Navigate to create section - use query param so app can hide hero
        window.location.href = '/?create=1#create';
    };

    const canCreateMorePolls = () => {
        if (!session) return false;
        // Block creation if plan is expired
        if (isPlanExpired) return false;
        const config = TIER_CONFIG[session.tier];
        // For Pro/Pro, only count LIVE polls toward the limit
        if (config.requiresActivation) {
            return livePolls.length < config.maxPolls;
        }
        return session.polls.length < config.maxPolls;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 size={32} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    // Error state
    if (error || !session) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6">{error || 'Unable to load dashboard'}</p>
                    <div className="flex gap-3">
                        <a href="/recover" className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-center">
                            Recover Link
                        </a>
                        <button onClick={goHome} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tier = session.tier;
    const config = TIER_CONFIG[tier];
    const polls = session.polls || [];
    const totalVotes = polls.reduce((sum, p) => sum + (p.responseCount || 0), 0);
    const isBusiness = tier === 'business';
    const showSearch = isBusiness && polls.length > 5;

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
            {/* Header with Paid Nav */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-10 h-10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="font-bold text-xl text-slate-800">VoteGenerator</span>
                    </a>
                    
                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition">
                            <PlusCircle size={18} /> Create Poll
                        </a>
                        <a href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg text-indigo-600 bg-indigo-50 font-medium transition">
                            <LayoutDashboard size={18} /> My Dashboard
                        </a>
                        <a href="/help" className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium transition">
                            <AlertCircle size={18} /> Help
                        </a>
                    </nav>
                    
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 bg-gradient-to-r ${isPlanExpired ? 'from-red-500 to-rose-500' : config.gradient} text-white rounded-xl text-sm font-bold flex items-center gap-2`}>
                            {isPlanExpired ? <AlertTriangle size={16} /> : config.icon} {config.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${isPlanExpired ? 'bg-white/30' : 'bg-white/20'}`}>
                                {isPlanExpired 
                                    ? 'Expired' 
                                    : session?.expiresAt 
                                        ? Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) + 'd'
                                        : ''
                                }
                            </span>
                        </div>
                        {isBusiness && !isPlanExpired && (
                            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-slate-100 rounded-lg transition" title="Settings">
                                <Settings size={20} className="text-slate-500" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Dashboard Access Info */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Link2 size={20} className="text-slate-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800">Bookmark this page to return to your dashboard</p>
                                        {tier !== 'free' && (
                                            <p className="text-sm text-slate-500">Your login link was also sent to your email</p>
                                        )}
                                        {tier === 'free' && (
                                            <div className="mt-2">
                                                <p className="text-sm text-slate-500 mb-2">Save access to your polls:</p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <input 
                                                        type="text" 
                                                        readOnly 
                                                        value={window.location.href}
                                                        className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 truncate"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(window.location.href);
                                                            setCopiedId('dashboard-link');
                                                            setTimeout(() => setCopiedId(null), 2000);
                                                        }}
                                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
                                                    >
                                                        {copiedId === 'dashboard-link' ? <Check size={16} /> : <Copy size={16} />}
                                                        {copiedId === 'dashboard-link' ? 'Copied!' : 'Copy'}
                                                    </button>
                                                    <a
                                                        href={`mailto:?subject=${encodeURIComponent('My VoteGenerator Dashboard')}&body=${encodeURIComponent(`Here's my VoteGenerator dashboard link:\n\n${window.location.href}\n\nSave this email to access your polls anytime`)}`}
                                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
                                                    >
                                                        <Mail size={16} />
                                                        Email to Self
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Plan Expired Banner */}
                        {isPlanExpired && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle size={20} className="text-red-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-red-800">Your Plan Has Expired</p>
                                                <p className="text-sm text-red-600">
                                                    You can still view your existing polls and results, but you can't create new polls.
                                                    Renew your plan to continue creating polls.
                                                </p>
                                            </div>
                                        </div>
                                        <a 
                                            href="/pricing" 
                                            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition flex-shrink-0"
                                        >
                                            <Sparkles size={16} />
                                            Renew Now
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ⚠️ Save Your Dashboard Link Warning */}
                        {(() => {
                            const dashboardLinkSaved = localStorage.getItem(`vg_dashboard_saved_${session?.dashboardToken?.slice(0, 8)}`);
                            if (dashboardLinkSaved || adminLinkWarningDismissed) return null;
                            
                            const dashboardUrl = session?.dashboardToken 
                                ? `${window.location.origin}/admin?t=${session.dashboardToken}`
                                : window.location.href;
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle size={20} className="text-amber-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-amber-800 mb-1">Save Your Dashboard Link!</h4>
                                            <p className="text-sm text-amber-700 mb-3">
                                                Bookmark this page or save the link below. This is how you'll access your dashboard and manage all your polls.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(dashboardUrl);
                                                        localStorage.setItem(`vg_dashboard_saved_${session?.dashboardToken?.slice(0, 8)}`, 'true');
                                                        setCopiedDashboardLink(true);
                                                        setTimeout(() => setCopiedDashboardLink(false), 2000);
                                                    }}
                                                    className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                                                >
                                                    {copiedDashboardLink ? <Check size={16} /> : <Copy size={16} />}
                                                    {copiedDashboardLink ? 'Copied!' : 'Copy Dashboard Link'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        localStorage.setItem(`vg_dashboard_saved_${session?.dashboardToken?.slice(0, 8)}`, 'true');
                                                        setAdminLinkWarningDismissed(true);
                                                    }}
                                                    className="px-4 py-2 bg-white text-amber-700 text-sm font-medium rounded-lg border border-amber-300 hover:bg-amber-100 transition-colors"
                                                >
                                                    I've bookmarked it
                                                </button>
                                                <button
                                                    onClick={() => setAdminLinkWarningDismissed(true)}
                                                    className="px-3 py-2 text-amber-600 text-sm hover:text-amber-800 transition-colors"
                                                >
                                                    Remind me later
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {/* Dashboard Header with Search */}
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <LayoutDashboard size={28} className="text-indigo-600" /> Dashboard
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {polls.length === 0 ? 'Create your first poll' : 
                                     config.requiresActivation 
                                        ? `${livePolls.length} of ${config.maxPolls} polls active`
                                        : `${polls.length} poll${polls.length !== 1 ? 's' : ''}`
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Search bar for Business with many polls */}
                                {showSearch && (
                                    <div className="relative">
                                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                            placeholder="Search polls..."
                                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 w-64"
                                        />
                                    </div>
                                )}
                                {polls.length > 0 && canCreateMorePolls() && (
                                    <button onClick={goToCreate} className={`px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition`}>
                                        <Plus size={18} /> New Poll
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Polls List or Empty State */}
                        {polls.length === 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border-2 border-dashed border-slate-200 rounded-3xl p-8 md:p-12">
                                <div className="text-center">
                                    {/* Illustration */}
                                    <div className="relative w-48 h-48 mx-auto mb-8">
                                        {/* Ballot box */}
                                        <svg viewBox="0 0 200 200" className="w-full h-full">
                                            {/* Shadow */}
                                            <ellipse cx="100" cy="175" rx="60" ry="12" fill="#e2e8f0" />
                                            
                                            {/* Box body */}
                                            <rect x="40" y="80" width="120" height="90" rx="8" fill="url(#boxGradient)" />
                                            <rect x="45" y="85" width="110" height="80" rx="6" fill="#f8fafc" opacity="0.3" />
                                            
                                            {/* Slot */}
                                            <rect x="60" y="75" width="80" height="12" rx="6" fill="#334155" />
                                            <rect x="65" y="78" width="70" height="6" rx="3" fill="#1e293b" />
                                            
                                            {/* Falling ballot papers */}
                                            <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                                                <rect x="85" y="30" width="30" height="40" rx="3" fill="#818cf8" transform="rotate(-5 100 50)" />
                                                <rect x="89" y="38" width="22" height="3" rx="1" fill="white" transform="rotate(-5 100 50)" />
                                                <rect x="89" y="45" width="18" height="3" rx="1" fill="white" transform="rotate(-5 100 50)" />
                                                <rect x="89" y="52" width="14" height="3" rx="1" fill="white" transform="rotate(-5 100 50)" />
                                            </g>
                                            
                                            {/* Check marks floating */}
                                            <circle cx="150" cy="50" r="12" fill="#10b981" opacity="0.8" />
                                            <path d="M144 50l4 4 8-8" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            
                                            <circle cx="50" cy="65" r="10" fill="#f59e0b" opacity="0.8" />
                                            <path d="M45 65l3 3 6-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            
                                            {/* Stars/sparkles */}
                                            <path d="M165 90l2-6 2 6 6 2-6 2-2 6-2-6-6-2z" fill="#fbbf24" />
                                            <path d="M30 100l1.5-4.5 1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5z" fill="#a78bfa" />
                                            
                                            {/* Gradient definition */}
                                            <defs>
                                                <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#6366f1" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">Create Your First Poll! 🎉</h2>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                        {config.requiresActivation 
                                            ? "Create a poll and preview it. When you're happy, go live to start collecting votes."
                                            : "Welcome to VoteGenerator! Get started by creating your first poll in seconds."
                                        }
                                    </p>
                                    
                                    <button onClick={goToCreate} className={`px-8 py-4 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:shadow-xl hover:scale-105 transition-all shadow-lg`}>
                                        <Plus size={22} /> Create New Poll
                                    </button>
                                    
                                    {/* What to do next */}
                                    <div className="mt-10 pt-8 border-t border-slate-100">
                                        <p className="text-xs text-slate-400 mb-4 font-medium">WHAT TO DO NEXT</p>
                                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                                            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-200 font-medium">
                                                <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">1</span> Create a poll
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200 font-medium">
                                                <span className="w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">2</span> Share the link
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 font-medium">
                                                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">3</span> Collect responses
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {paginatedPolls.map((poll, index) => {
                                        const isDraft = config.requiresActivation && poll.status !== 'live';
                                        const isJustCreated = poll.id === justCreatedPollId;
                                        return (
                                            <motion.div
                                                key={poll.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={`bg-white rounded-xl border-2 p-5 hover:shadow-lg transition ${
                                                    isJustCreated
                                                        ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 ring-2 ring-emerald-200 ring-offset-2'
                                                        : isDraft 
                                                            ? 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-white' 
                                                            : 'border-slate-200 hover:border-indigo-200'
                                                }`}
                                            >
                                                {isJustCreated && (
                                                    <div className="flex items-center gap-2 mb-3 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                        <Check size={16} className="text-emerald-600" />
                                                        Poll created successfully! Share it to start collecting votes.
                                                    </div>
                                                )}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h3 className="font-bold text-slate-800 text-lg truncate">{poll.title}</h3>
                                                            {/* Poll Type Badge */}
                                                            {poll.type && POLL_TYPE_CONFIG[poll.type] && (
                                                                <span className={`px-2 py-0.5 ${POLL_TYPE_CONFIG[poll.type].bg} ${POLL_TYPE_CONFIG[poll.type].color} text-xs font-bold rounded-full flex items-center gap-1`}>
                                                                    {React.createElement(POLL_TYPE_CONFIG[poll.type].icon, { size: 12 })}
                                                                    {POLL_TYPE_CONFIG[poll.type].label}
                                                                </span>
                                                            )}
                                                            {isDraft && (
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                                    <FileEdit size={12} /> Draft
                                                                </span>
                                                            )}
                                                            {!isDraft && config.requiresActivation && (
                                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                                                                    <Rocket size={12} /> Live
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock size={14} />
                                                                {new Date(poll.createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Users size={14} />
                                                                {poll.responseCount || 0} votes
                                                            </span>
                                                            {(poll.responseCount || 0) === 0 && !isDraft && (
                                                                <span className="text-amber-600 flex items-center gap-1">
                                                                    <Share2 size={12} />
                                                                    Share to get responses
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {isDraft ? (
                                                            <button
                                                                onClick={() => setShowGoLiveModal(poll.id)}
                                                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition flex items-center gap-2 text-sm"
                                                            >
                                                                <Rocket size={16} /> Go Live
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleCopyLink(poll, 'vote')}
                                                                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                                                                title="Copy vote link"
                                                            >
                                                                {copiedId === `${poll.id}-vote` ? <Check size={18} /> : <Share2 size={18} />}
                                                            </button>
                                                        )}
                                                        {/* Hide Invite button for just-created polls - it's in Manage section */}
                                                        {!isJustCreated && (
                                                            <button
                                                                onClick={() => setShowShareCards(poll.id)}
                                                                className="p-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition flex items-center gap-1.5"
                                                                title="Create beautiful invite cards with QR codes"
                                                            >
                                                                <Palette size={18} />
                                                                <span className="hidden sm:inline text-sm font-medium">Invite</span>
                                                            </button>
                                                        )}
                                                        <a
                                                            href={`/#id=${poll.id}&admin=${poll.adminKey}`}
                                                            className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition flex items-center gap-1.5 text-sm font-medium"
                                                            title={isDraft ? "Preview & Edit" : "Manage & Share Poll"}
                                                        >
                                                            <ExternalLink size={16} />
                                                            <span className="hidden sm:inline">{isDraft ? 'Edit' : 'Manage & Share'}</span>
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeletePoll(poll)}
                                                            className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition"
                                                            title="Remove from dashboard"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="px-4 py-2 text-sm text-slate-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}

                                {/* Create more button */}
                                {canCreateMorePolls() && (
                                    <div className="mt-6 text-center">
                                        <button onClick={goToCreate} className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium">
                                            <PlusCircle size={20} /> Create Another Poll
                                        </button>
                                    </div>
                                )}

                                {!canCreateMorePolls() && tier !== 'business' && (
                                    <div className="mt-6 p-4 bg-slate-100 rounded-xl text-center">
                                        <p className="text-slate-600 mb-2">
                                            You've used all {config.maxPolls} poll credit{config.maxPolls > 1 ? 's' : ''}.
                                        </p>
                                        <button 
                                            onClick={() => setShowUpgradeModal(true)}
                                            className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1 mx-auto"
                                        >
                                            Upgrade for more <ArrowRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-96 lg:flex-shrink-0 space-y-6">
                        {/* Business: Security & Access - Premium styling */}
                        {isBusiness && (
                            <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl border-2 border-amber-200 overflow-hidden shadow-lg shadow-amber-100/50">
                                <button onClick={() => setShowAccessPanel(!showAccessPanel)} className="w-full p-4 flex items-center justify-between hover:bg-amber-50/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                                            <Shield size={22} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-amber-900">
                                                Security & Access
                                            </h3>
                                            <p className="text-xs text-amber-700">PIN protection & team tokens</p>
                                        </div>
                                    </div>
                                    {showAccessPanel ? <ChevronUp size={20} className="text-amber-500" /> : <ChevronDown size={20} className="text-amber-500" />}
                                </button>
                                {showAccessPanel && (
                                    <div className="p-4 pt-0 border-t border-amber-200/50">
                                        {/* PIN Status */}
                                        <div className="mb-4 p-3 bg-white/80 rounded-xl border border-amber-100 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${session.hasPin ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                                        <Lock size={16} className={session.hasPin ? 'text-emerald-600' : 'text-slate-400'} />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-800">Admin PIN</span>
                                                        <span className={`ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${session.hasPin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                                            {session.hasPin ? '✓ ACTIVE' : 'OFF'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowPinSetup(true)} className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-xs font-bold transition">
                                                    {session.hasPin ? 'Change' : 'Set up'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Token Buttons */}
                                        <div className="flex gap-2">
                                            <button onClick={() => setShowSettings(true)} className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-blue-200">
                                                <Plus size={14} /> Admin Token
                                            </button>
                                            <button onClick={() => setShowSettings(true)} className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border-2 border-slate-200 transition flex items-center justify-center gap-1">
                                                <Plus size={14} /> Viewer Token
                                            </button>
                                        </div>
                                        
                                        <p className="text-[10px] text-amber-600 mt-3 text-center">
                                            🔒 Tokens let team members access without your main dashboard link
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Plan Card - Collapsible */}
                        <div className={`rounded-2xl border-2 overflow-hidden ${
                            tier === 'business' ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200' :
                            tier === 'pro' ? 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200' :
                            'bg-white border-slate-200'
                        }`}>
                            <button 
                                onClick={() => setShowPlanPanel(!showPlanPanel)}
                                className={`w-full p-4 flex items-center justify-between hover:opacity-90 transition ${config.headerBg}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                                        {config.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-800">{config.label} Plan</h3>
                                        {session?.expiresAt && !isPlanExpired && (
                                            <p className="text-xs text-slate-500">
                                                {Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {showPlanPanel ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </button>
                            
                            {showPlanPanel && (
                                <div className="p-4 border-t border-slate-100">
                                    <div className="space-y-2 mb-4">
                                        {config.features.map((feature, i) => (
                                            <div key={i} className={`flex items-center gap-2 text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {feature.included ? <CheckCircle size={16} className="text-emerald-500" /> : <X size={16} className="text-red-400" />}
                                                <span className={!feature.included ? 'line-through' : ''}>{feature.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {tier !== 'business' && !isPlanExpired && (
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="block w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium text-center transition mt-3"
                                    >
                                        Upgrade Plan
                                    </button>
                                )}

                                {/* Extend/Renew Button - Smart logic */}
                                {session.expiresAt && (
                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                        {(() => {
                                            const daysLeft = Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                            const canExtend = daysLeft <= 30 && tier === 'business'; // Only Business can extend
                                            
                                            return (
                                                <>
                                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {isPlanExpired ? 'Expired' : 'Expires'}: {new Date(session.expiresAt).toLocaleDateString()}
                                                        </span>
                                                        {!isPlanExpired && (
                                                            <span className={`px-2 py-0.5 rounded-full font-medium ${
                                                                daysLeft <= 7 ? 'bg-red-100 text-red-700' :
                                                                daysLeft <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                                {daysLeft} days left
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Renew button - always show when expired */}
                                                    {isPlanExpired && (
                                                        <button 
                                                            onClick={() => window.location.href = `/pricing`}
                                                            className="w-full py-2.5 rounded-lg text-sm font-medium text-center transition flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg"
                                                        >
                                                            <RefreshCw size={16} />
                                                            Renew Plan
                                                        </button>
                                                    )}
                                                    
                                                    {/* Extend button - only for Business when ≤30 days remaining */}
                                                    {!isPlanExpired && canExtend && (
                                                        <button 
                                                            onClick={() => window.location.href = `/pricing`}
                                                            className="w-full py-2.5 rounded-lg text-sm font-medium text-center transition flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700"
                                                        >
                                                            <RefreshCw size={16} />
                                                            Extend Plan
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}
                        </div>

                        {/* Usage Meter - Creates urgency for conversion */}
                        <div className={`rounded-2xl border-2 overflow-hidden ${
                            tier === 'free' 
                                ? 'bg-gradient-to-br from-orange-50 via-white to-amber-50 border-orange-200' 
                                : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 border-slate-200'
                        }`}>
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                                        tier === 'free' 
                                            ? 'bg-gradient-to-br from-orange-400 to-amber-500' 
                                            : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                                    } text-white`}>
                                        <BarChart3 size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Usage This Month</h3>
                                        <p className="text-xs text-slate-500">
                                            {tier === 'free' ? 'Free plan limits' : `${config.label} plan`}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Polls Usage */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <span className="text-slate-600 font-medium">Polls Created</span>
                                        <span className={`font-bold ${
                                            tier === 'free' && polls.length >= config.maxPolls 
                                                ? 'text-red-600' 
                                                : tier === 'free' && polls.length >= config.maxPolls - 1
                                                    ? 'text-orange-600'
                                                    : 'text-slate-800'
                                        }`}>
                                            {polls.length} / {config.maxPolls === Infinity ? '∞' : config.maxPolls}
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                tier === 'free' && polls.length >= config.maxPolls 
                                                    ? 'bg-red-500' 
                                                    : tier === 'free' && polls.length >= config.maxPolls - 1
                                                        ? 'bg-orange-500'
                                                        : 'bg-indigo-500'
                                            }`}
                                            style={{ width: `${Math.min(100, (polls.length / (config.maxPolls === Infinity ? 100 : config.maxPolls)) * 100)}%` }}
                                        />
                                    </div>
                                    {tier === 'free' && polls.length >= config.maxPolls && (
                                        <p className="text-xs text-red-600 mt-1 font-medium">
                                            ⚠️ Limit reached! Upgrade for unlimited polls
                                        </p>
                                    )}
                                </div>
                                
                                {/* Responses Usage */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <span className="text-slate-600 font-medium">Responses Received</span>
                                        <span className={`font-bold ${
                                            totalVotes >= config.maxResponses 
                                                ? 'text-red-600' 
                                                : totalVotes >= config.maxResponses * 0.8
                                                    ? 'text-orange-600'
                                                    : 'text-slate-800'
                                        }`}>
                                            {totalVotes.toLocaleString()} / {config.maxResponses.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                totalVotes >= config.maxResponses 
                                                    ? 'bg-red-500' 
                                                    : totalVotes >= config.maxResponses * 0.8
                                                        ? 'bg-orange-500'
                                                        : 'bg-emerald-500'
                                            }`}
                                            style={{ width: `${Math.min(100, (totalVotes / config.maxResponses) * 100)}%` }}
                                        />
                                    </div>
                                    {totalVotes >= config.maxResponses * 0.8 && totalVotes < config.maxResponses && (
                                        <p className="text-xs text-orange-600 mt-1 font-medium">
                                            ⚡ {Math.round((1 - totalVotes / config.maxResponses) * 100)}% remaining
                                        </p>
                                    )}
                                    {totalVotes >= config.maxResponses && (
                                        <p className="text-xs text-red-600 mt-1 font-medium">
                                            ⚠️ Limit reached! New votes won't be counted
                                        </p>
                                    )}
                                </div>
                                
                                {/* Upgrade CTA for Free users */}
                                {tier === 'free' && (
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                                    >
                                        <Zap size={16} />
                                        Unlock Unlimited Usage
                                    </button>
                                )}
                                
                                {/* Stats summary for paid users */}
                                {tier !== 'free' && (
                                    <div className="pt-3 border-t border-slate-100 mt-3">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Resets monthly</span>
                                            <span className="text-emerald-600 font-medium">
                                                {config.maxResponses === 50000 ? '50K' : '5K'} responses included
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Settings size={24} className="text-slate-600" /> Settings
                                </h2>
                                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* PIN Protection */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Lock size={20} className="text-amber-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Admin PIN Protection</p>
                                                <p className="text-xs text-slate-500">Add a 6-digit PIN to admin links</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowSettings(false); setShowPinSetup(true); }} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition">
                                            {session?.hasPin ? 'Change' : 'Set PIN'}
                                        </button>
                                    </div>
                                </div>

                                {/* Team Access Tokens */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users size={20} className="text-blue-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Team Access Tokens</p>
                                                <p className="text-xs text-slate-500">Share view/edit access with others</p>
                                            </div>
                                        </div>
                                        <button onClick={() => alert('Token management coming in next update!')} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition">
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                {/* Regenerate Dashboard Token */}
                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Key size={20} className="text-slate-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Dashboard Link</p>
                                                <p className="text-xs text-slate-500">Generate a new unique URL</p>
                                            </div>
                                        </div>
                                        <button onClick={handleRegenerateToken} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition">
                                            Regenerate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PIN Setup Modal */}
            <AnimatePresence>
                {showPinSetup && (
                    <PinSetupModalInline
                        isOpen={showPinSetup}
                        hasExistingPin={!!session?.hasPin}
                        onClose={() => setShowPinSetup(false)}
                        onSuccess={(hasPin, pinValue) => {
                            if (session) {
                                let pinHash: string | undefined = undefined;
                                if (hasPin && pinValue) {
                                    // Simple hash for PIN
                                    let hash = 0;
                                    for (let i = 0; i < pinValue.length; i++) {
                                        const char = pinValue.charCodeAt(i);
                                        hash = ((hash << 5) - hash) + char;
                                        hash = hash & hash;
                                    }
                                    pinHash = 'pin_' + Math.abs(hash).toString(16);
                                }
                                const updated = { ...session, hasPin, pinHash };
                                localStorage.setItem('vg_user_session', JSON.stringify(updated));
                                setSession(updated);
                            }
                            setShowPinSetup(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Go Live Modal */}
            <AnimatePresence>
                {showGoLiveModal && (
                    <GoLiveModalInline
                        isOpen={!!showGoLiveModal}
                        pollTitle={polls.find(p => p.id === showGoLiveModal)?.title || 'Poll'}
                        tier={tier as 'pro' | 'business'}
                        pollsUsed={livePolls.length}
                        pollsMax={config.maxPolls}
                        activeDays={config.activeDays}
                        onClose={() => setShowGoLiveModal(null)}
                        onConfirm={() => handleGoLive(showGoLiveModal)}
                    />
                )}
            </AnimatePresence>

            {/* Share Cards Modal */}
            <AnimatePresence>
                {showShareCards && (() => {
                    const poll = polls.find(p => p.id === showShareCards);
                    if (!poll) return null;
                    const pollUrl = poll.customSlug 
                        ? `${window.location.origin}/p/${poll.customSlug}`
                        : `${window.location.origin}/#id=${poll.id}`;
                    return (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" 
                            onClick={() => setShowShareCards(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                exit={{ scale: 0.95, opacity: 0 }} 
                                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ShareCards
                                    pollId={poll.id}
                                    pollTitle={poll.title}
                                    pollDescription={poll.description}
                                    pollUrl={pollUrl}
                                    onClose={() => setShowShareCards(null)}
                                />
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                currentTier={tier}
                source="admin_dashboard"
            />
        </div>
    );
};

// ============================================================================
// Inline PIN Setup Modal (self-contained)
// ============================================================================

const PinSetupModalInline: React.FC<{
    isOpen: boolean;
    hasExistingPin: boolean;
    onClose: () => void;
    onSuccess: (hasPin: boolean, pinValue?: string) => void;
}> = ({ isOpen, hasExistingPin, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (step === 'enter') {
            if (pin.length !== 6 || !/^\d+$/.test(pin)) {
                setError('PIN must be exactly 6 digits');
                return;
            }
            setStep('confirm');
            setError('');
        } else {
            if (pin !== confirmPin) {
                setError('PINs do not match');
                setConfirmPin('');
                return;
            }
            // Pass the PIN value to onSuccess for hashing
            onSuccess(true, pin);
        }
    };

    const handleRemove = () => {
        if (confirm('Remove PIN protection?')) {
            onSuccess(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock size={24} />
                            <h2 className="font-bold text-lg">{hasExistingPin ? 'Change PIN' : 'Set Admin PIN'}</h2>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={20} /></button>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 text-sm mb-4">
                        {step === 'enter' ? 'Enter a 6-digit PIN to protect your admin links:' : 'Confirm your PIN:'}
                    </p>
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={step === 'enter' ? pin : confirmPin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            step === 'enter' ? setPin(val) : setConfirmPin(val);
                            setError('');
                        }}
                        placeholder="••••••"
                        className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        autoFocus
                    />
                    {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
                    <div className="mt-6 flex gap-3">
                        {hasExistingPin && step === 'enter' && (
                            <button onClick={handleRemove} className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition">
                                Remove
                            </button>
                        )}
                        {step === 'confirm' && (
                            <button onClick={() => { setStep('enter'); setConfirmPin(''); }} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">
                                Back
                            </button>
                        )}
                        <button onClick={handleSubmit} disabled={step === 'enter' ? pin.length !== 6 : confirmPin.length !== 6} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50">
                            {step === 'enter' ? 'Continue' : 'Set PIN'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ============================================================================
// Inline Go Live Modal (self-contained)
// ============================================================================

const GoLiveModalInline: React.FC<{
    isOpen: boolean;
    pollTitle: string;
    tier: 'pro' | 'business';
    pollsUsed: number;
    pollsMax: number;
    activeDays: number;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ isOpen, pollTitle, tier, pollsUsed, pollsMax, activeDays, onClose, onConfirm }) => {
    const [confirmed, setConfirmed] = useState(false);
    const isLastPoll = pollsMax - pollsUsed === 1;
    const gradient = tier === 'pro' ? 'from-purple-500 to-pink-500' : tier === 'business' ? 'from-orange-400 to-amber-500' : 'from-blue-500 to-indigo-600';

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Rocket size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Ready to Go Live?</h2>
                            <p className="text-white/80 text-sm">Launch for real voting</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Poll</p>
                        <p className="font-bold text-slate-800 truncate">{pollTitle}</p>
                    </div>
                    <div className="mb-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <span className="text-slate-700 text-sm">Real voting will be enabled</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-blue-500" />
                            <span className="text-slate-700 text-sm">{activeDays}-day countdown starts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lock size={18} className="text-amber-500" />
                            <span className="text-slate-700 text-sm">Uses 1 of {pollsMax} poll credits</span>
                        </div>
                    </div>
                    <div className={`mb-4 p-4 rounded-xl ${isLastPoll ? 'bg-red-50 border-2 border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className={isLastPoll ? 'text-red-500' : 'text-amber-500'} />
                            <div>
                                <p className={`font-semibold ${isLastPoll ? 'text-red-700' : 'text-amber-700'}`}>
                                    {isLastPoll ? '⚠️ This is your last poll!' : 'This cannot be undone'}
                                </p>
                                <p className={`text-sm ${isLastPoll ? 'text-red-600' : 'text-amber-600'}`}>
                                    {isLastPoll ? 'After this, upgrade for more.' : 'Cannot revert to draft after going live.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <label className="flex items-start gap-3 mb-6 cursor-pointer">
                        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600" />
                        <span className="text-sm text-slate-600">I understand this will use 1 poll credit and cannot be undone.</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition">Keep as Draft</button>
                        <button onClick={onConfirm} disabled={!confirmed} className={`flex-1 py-3 bg-gradient-to-r ${gradient} text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2`}>
                            <Rocket size={18} /> Go Live
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
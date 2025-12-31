import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, 
    Mail, 
    Check, 
    Loader2, 
    Plus, 
    Trash2, 
    AlertCircle,
    Calendar,
    MessageSquare,
    TrendingUp,
    Clock,
    Users,
    Info,
    Crown,
    Send,
    CheckCircle2,
    Clock4,
    RefreshCw
} from 'lucide-react';

interface EmailEntry {
    email: string;
    verified: boolean;
    addedAt?: string;
    verifiedAt?: string;
    lastSentAt?: string;
}

interface NotificationSettingsData {
    enabled: boolean;
    emails: EmailEntry[];
    skipFirstVotes: number;
    notifyOn: {
        milestones: boolean;
        dailyDigest: boolean;
        pollClosed: boolean;
        limitReached: boolean;
        newComment: boolean;
    };
}

interface Props {
    pollId: string;
    adminKey: string;
    pollTitle?: string;
    currentSettings?: NotificationSettingsData;
    onSave?: (settings: NotificationSettingsData) => void;
    tier?: string;
}

const DEFAULT_SETTINGS: NotificationSettingsData = {
    enabled: true,
    emails: [],
    skipFirstVotes: 3,
    notifyOn: {
        milestones: true,
        dailyDigest: false,
        pollClosed: true,
        limitReached: true,
        newComment: false
    }
};

const MILESTONE_POINTS = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

const NotificationSettings: React.FC<Props> = ({ 
    pollId, 
    adminKey,
    pollTitle,
    currentSettings,
    onSave,
    tier = 'free'
}) => {
    const [settings, setSettings] = useState<NotificationSettingsData>(currentSettings || DEFAULT_SETTINGS);
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [sendingVerification, setSendingVerification] = useState<string | null>(null);
    const [verificationSent, setVerificationSent] = useState<string | null>(null);
    
    // Only Unlimited tier gets notifications
    const isUnlimited = tier === 'unlimited';
    const maxEmails = 10;
    
    const verifiedCount = settings.emails.filter(e => e.verified).length;
    const pendingCount = settings.emails.filter(e => !e.verified).length;

    // If not unlimited, show upgrade prompt
    if (!isUnlimited) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-200 rounded-xl">
                        <Bell size={24} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-700">Email Notifications</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Get notified about votes, milestones, and poll activity
                        </p>
                    </div>
                    <a 
                        href="/#pricing" 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm"
                    >
                        <Crown size={16} />
                        Unlimited Only
                    </a>
                </div>
            </div>
        );
    }

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const sendVerificationEmail = async (email: string) => {
        setSendingVerification(email);
        setVerificationSent(null);
        
        try {
            const response = await fetch('/.netlify/functions/vg-verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId,
                    adminKey,
                    email,
                    pollTitle
                })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send verification');
            }
            
            setVerificationSent(email);
            setTimeout(() => setVerificationSent(null), 3000);
            
            // Update local state if this is a new email
            if (!settings.emails.find(e => e.email === email.toLowerCase())) {
                setSettings(prev => ({
                    ...prev,
                    emails: [...prev.emails, {
                        email: email.toLowerCase(),
                        verified: false,
                        addedAt: new Date().toISOString()
                    }]
                }));
            }
            
            setNewEmail('');
            setEmailError(null);
            
        } catch (error) {
            setEmailError(error instanceof Error ? error.message : 'Failed to send verification email');
        } finally {
            setSendingVerification(null);
        }
    };

    const addEmail = async () => {
        const email = newEmail.trim().toLowerCase();
        
        if (!email) {
            setEmailError('Please enter an email address');
            return;
        }
        
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        
        if (settings.emails.find(e => e.email === email)) {
            setEmailError('This email is already added');
            return;
        }
        
        if (settings.emails.length >= maxEmails) {
            setEmailError(`Maximum ${maxEmails} emails allowed`);
            return;
        }
        
        // Send verification email
        await sendVerificationEmail(email);
    };

    const removeEmail = async (email: string) => {
        setSettings(prev => ({
            ...prev,
            emails: prev.emails.filter(e => e.email !== email)
        }));
        
        // Save immediately when removing
        try {
            await fetch('/.netlify/functions/vg-update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId,
                    adminKey,
                    notificationSettings: {
                        ...settings,
                        emails: settings.emails.filter(e => e.email !== email)
                    }
                })
            });
        } catch (error) {
            console.error('Failed to remove email:', error);
        }
    };

    const resendVerification = async (email: string) => {
        await sendVerificationEmail(email);
    };

    const toggleNotification = (key: keyof NotificationSettingsData['notifyOn']) => {
        setSettings(prev => ({
            ...prev,
            notifyOn: {
                ...prev.notifyOn,
                [key]: !prev.notifyOn[key]
            }
        }));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch('/.netlify/functions/vg-update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pollId,
                    adminKey,
                    notificationSettings: settings
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save settings');
            }
            
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            onSave?.(settings);
        } catch (error) {
            console.error('Failed to save notification settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const NotificationOption = ({ 
        id, 
        icon: Icon, 
        title, 
        description, 
        checked, 
        onChange
    }: {
        id: keyof NotificationSettingsData['notifyOn'];
        icon: React.ElementType;
        title: string;
        description: string;
        checked: boolean;
        onChange: () => void;
    }) => (
        <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
            checked ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
        }`}>
            <div className={`p-2 rounded-lg ${checked ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <Icon size={18} />
            </div>
            <div className="flex-1">
                <span className={`font-medium ${checked ? 'text-indigo-800' : 'text-slate-700'}`}>{title}</span>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            <input 
                type="checkbox" 
                checked={checked} 
                onChange={onChange}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
        </label>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Bell className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white">Email Notifications</h3>
                        <p className="text-indigo-100 text-sm">Get notified about poll activity</p>
                    </div>
                    {verifiedCount > 0 && (
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                            <CheckCircle2 size={14} className="text-emerald-300" />
                            <span className="text-white text-sm font-medium">{verifiedCount} verified</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 space-y-5">
                {/* Email Addresses */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail size={16} className="text-slate-400" />
                        Notification Emails
                        <span className="text-xs text-slate-400 font-normal">
                            ({settings.emails.length}/{maxEmails})
                        </span>
                    </label>
                    
                    {/* Existing emails */}
                    {settings.emails.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {settings.emails.map((entry, i) => (
                                <div 
                                    key={i} 
                                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 ${
                                        entry.verified 
                                            ? 'bg-emerald-50 border border-emerald-200' 
                                            : 'bg-amber-50 border border-amber-200'
                                    }`}
                                >
                                    {entry.verified ? (
                                        <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                                    ) : (
                                        <Clock4 size={18} className="text-amber-500 flex-shrink-0" />
                                    )}
                                    <span className="flex-1 text-sm text-slate-700">{entry.email}</span>
                                    
                                    {!entry.verified && (
                                        <button 
                                            onClick={() => resendVerification(entry.email)}
                                            disabled={sendingVerification === entry.email}
                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 rounded transition-colors disabled:opacity-50"
                                        >
                                            {sendingVerification === entry.email ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : verificationSent === entry.email ? (
                                                <><Check size={12} /> Sent!</>
                                            ) : (
                                                <><RefreshCw size={12} /> Resend</>
                                            )}
                                        </button>
                                    )}
                                    
                                    <button 
                                        onClick={() => removeEmail(entry.email)}
                                        className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Status legend */}
                    {settings.emails.length > 0 && (pendingCount > 0 || verifiedCount > 0) && (
                        <div className="flex gap-4 text-xs text-slate-500 mb-3">
                            {verifiedCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> Verified - will receive notifications
                                </span>
                            )}
                            {pendingCount > 0 && (
                                <span className="flex items-center gap-1">
                                    <Clock4 size={12} className="text-amber-500" /> Pending - awaiting confirmation
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Add new email */}
                    {settings.emails.length < maxEmails && (
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => { setNewEmail(e.target.value); setEmailError(null); }}
                                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                                placeholder="colleague@company.com"
                                className={`flex-1 px-3 py-2 border-2 rounded-lg text-sm ${
                                    emailError ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                }`}
                            />
                            <button
                                onClick={addEmail}
                                disabled={sendingVerification !== null}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1 disabled:opacity-50"
                            >
                                {sendingVerification ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <><Send size={16} /> Invite</>
                                )}
                            </button>
                        </div>
                    )}
                    
                    {emailError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {emailError}
                        </p>
                    )}
                    
                    {/* Info about verification */}
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-xs text-blue-700 flex items-start gap-2">
                            <Info size={14} className="flex-shrink-0 mt-0.5" />
                            <span>
                                Each person will receive an email to confirm they want notifications. 
                                Only confirmed emails will receive poll updates. This protects everyone's privacy.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Skip first votes - only show if there are verified emails */}
                {verifiedCount > 0 && (
                    <>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="font-medium text-amber-800 text-sm">Skip test votes</label>
                                    <p className="text-xs text-amber-600 mt-0.5">
                                        No notifications until this many votes are received
                                    </p>
                                </div>
                                <select
                                    value={settings.skipFirstVotes}
                                    onChange={(e) => setSettings(prev => ({ ...prev, skipFirstVotes: parseInt(e.target.value) }))}
                                    className="px-3 py-2 border-2 border-amber-200 rounded-lg text-sm bg-white"
                                >
                                    <option value={0}>None (notify immediately)</option>
                                    <option value={1}>1 vote</option>
                                    <option value={3}>3 votes</option>
                                    <option value={5}>5 votes</option>
                                    <option value={10}>10 votes</option>
                                </select>
                            </div>
                        </div>

                        {/* Notification Types */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Notify when...
                            </label>
                            <div className="space-y-2">
                                <NotificationOption
                                    id="milestones"
                                    icon={TrendingUp}
                                    title="Vote Milestones"
                                    description={`At ${MILESTONE_POINTS.slice(0, 4).join(', ')}+ votes`}
                                    checked={settings.notifyOn.milestones}
                                    onChange={() => toggleNotification('milestones')}
                                />
                                <NotificationOption
                                    id="pollClosed"
                                    icon={Clock}
                                    title="Poll Closed"
                                    description="When your poll deadline is reached"
                                    checked={settings.notifyOn.pollClosed}
                                    onChange={() => toggleNotification('pollClosed')}
                                />
                                <NotificationOption
                                    id="limitReached"
                                    icon={Users}
                                    title="Response Limit"
                                    description="At 80% and 100% of your response limit"
                                    checked={settings.notifyOn.limitReached}
                                    onChange={() => toggleNotification('limitReached')}
                                />
                                <NotificationOption
                                    id="dailyDigest"
                                    icon={Calendar}
                                    title="Daily Digest"
                                    description="Summary email once per day (if votes came in)"
                                    checked={settings.notifyOn.dailyDigest}
                                    onChange={() => toggleNotification('dailyDigest')}
                                />
                                <NotificationOption
                                    id="newComment"
                                    icon={MessageSquare}
                                    title="New Comments"
                                    description="When someone leaves a comment on your poll"
                                    checked={settings.notifyOn.newComment}
                                    onChange={() => toggleNotification('newComment')}
                                />
                            </div>
                        </div>

                        {/* Save button */}
                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={saveSettings}
                                disabled={saving}
                                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                ) : saved ? (
                                    <><Check size={18} /> Saved!</>
                                ) : (
                                    <><Bell size={18} /> Save Notification Settings</>
                                )}
                            </button>
                        </div>
                    </>
                )}

                {/* No verified emails message */}
                {settings.emails.length > 0 && verifiedCount === 0 && (
                    <div className="text-center py-4">
                        <Clock4 size={32} className="text-amber-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 font-medium">Waiting for email confirmations</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Notification settings will appear once at least one email is verified
                        </p>
                    </div>
                )}

                {settings.emails.length === 0 && (
                    <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                        <Info size={12} /> Add an email address to enable notifications
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotificationSettings;
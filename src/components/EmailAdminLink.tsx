import React, { useState } from 'react';
import { Mail, Loader2, Check, AlertCircle, Send, ShieldCheck } from 'lucide-react';

interface EmailAdminLinkProps {
    pollId: string;
    adminKey: string;
    pollTitle: string;
    currentEmail?: string;
}

const EmailAdminLink: React.FC<EmailAdminLinkProps> = ({ 
    pollId, 
    adminKey, 
    pollTitle,
    currentEmail 
}) => {
    const [email, setEmail] = useState(currentEmail || '');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSend = async () => {
        if (!email || !email.includes('@')) {
            setResult({ success: false, message: 'Please enter a valid email address.' });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/.netlify/functions/vg-poll-recovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    action: 'send-admin-link', 
                    email, 
                    pollId, 
                    adminKey 
                })
            });

            const data = await response.json();
            setResult({ 
                success: data.success, 
                message: data.message || (data.success ? 'Email sent!' : 'Failed to send email.')
            });

            // Reset after success
            if (data.success) {
                setTimeout(() => {
                    setResult(null);
                    setIsExpanded(false);
                }, 3000);
            }
        } catch (error) {
            setResult({ 
                success: false, 
                message: 'Failed to send email. Please try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <Mail size={14} />
                <span>Email admin link to myself</span>
            </button>
        );
    }

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ShieldCheck size={16} className="text-indigo-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 text-sm">Backup Admin Link</h4>
                    <p className="text-xs text-slate-500">Send admin access to your email for safekeeping</p>
                </div>
            </div>

            {result ? (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {result.success ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span className="text-sm font-medium">{result.message}</span>
                </div>
            ) : (
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !email}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                        Send
                    </button>
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <p className="text-[10px] text-slate-400 mt-2">
                Your email will be saved for poll recovery. You can recover all polls linked to this email later.
            </p>
        </div>
    );
};

export default EmailAdminLink;
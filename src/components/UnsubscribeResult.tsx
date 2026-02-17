// ============================================================================
// UnsubscribeResult.tsx - Unsubscribe result page
// Location: src/components/UnsubscribeResult.tsx
// ============================================================================
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Home, Mail } from 'lucide-react';

const UnsubscribeResult: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || 'error';

    const configs: Record<string, {
        icon: typeof CheckCircle;
        bgGradient: string;
        title: string;
        message: string;
    }> = {
        success: {
            icon: CheckCircle,
            bgGradient: 'from-emerald-500 to-teal-600',
            title: 'Unsubscribed',
            message: 'You\'ve been successfully unsubscribed from notifications for this poll. You won\'t receive any more emails about it.',
        },
        'not-found': {
            icon: Mail,
            bgGradient: 'from-amber-500 to-orange-600',
            title: 'Already Unsubscribed',
            message: 'This email was already unsubscribed or wasn\'t found in the notification list for this poll.',
        },
        invalid: {
            icon: XCircle,
            bgGradient: 'from-red-500 to-rose-600',
            title: 'Invalid Link',
            message: 'This unsubscribe link is invalid or has expired. Please use the link from a recent notification email.',
        },
        error: {
            icon: AlertTriangle,
            bgGradient: 'from-slate-500 to-slate-700',
            title: 'Something Went Wrong',
            message: 'We couldn\'t process your unsubscribe request. Please try again later or contact support.',
        },
    };

    const config = configs[status] || configs.error;
    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${config.bgGradient} p-8 text-center`}>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon size={40} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {config.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center">
                        <p className="text-slate-600 mb-6">
                            {config.message}
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                            <a
                                href="/"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                            >
                                <Home size={18} />
                                Back to Home
                            </a>
                        </div>

                        {status === 'success' && (
                            <p className="text-sm text-slate-500 mt-6">
                                Changed your mind? Contact the poll creator to re-add you to notifications.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    Questions? Contact{' '}
                    <a href="mailto:support@votegenerator.com" className="text-indigo-600 hover:underline">
                        support@votegenerator.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UnsubscribeResult;
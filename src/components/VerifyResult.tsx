// ============================================================================
// VerifyResult.tsx - Email verification result page
// Location: src/components/VerifyResult.tsx
// ============================================================================
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Home } from 'lucide-react';

const VerifyResult: React.FC = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || 'error';

    const configs: Record<string, {
        icon: typeof CheckCircle;
        iconColor: string;
        bgGradient: string;
        title: string;
        message: string;
    }> = {
        success: {
            icon: CheckCircle,
            iconColor: 'text-emerald-500',
            bgGradient: 'from-emerald-500 to-teal-600',
            title: 'Email Verified!',
            message: 'You\'ll now receive notifications about this poll. We\'ll let you know when there are new votes, milestones reached, or when the poll closes.',
        },
        expired: {
            icon: Clock,
            iconColor: 'text-amber-500',
            bgGradient: 'from-amber-500 to-orange-600',
            title: 'Link Expired',
            message: 'This verification link has expired. Verification links are valid for 7 days. Please ask the poll creator to resend the verification email.',
        },
        invalid: {
            icon: XCircle,
            iconColor: 'text-red-500',
            bgGradient: 'from-red-500 to-rose-600',
            title: 'Invalid Link',
            message: 'This verification link is invalid. It may have already been used or the link is malformed.',
        },
        error: {
            icon: AlertTriangle,
            iconColor: 'text-slate-500',
            bgGradient: 'from-slate-500 to-slate-700',
            title: 'Something Went Wrong',
            message: 'We couldn\'t process your verification. Please try again or contact support if the problem persists.',
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

export default VerifyResult;
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import './index.css';

function SuccessPage() {
    const [status, setStatus] = useState<'loading' | 'creating' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const [pollDraft, setPollDraft] = useState<any>(null);

    useEffect(() => {
        // Check for poll draft in localStorage
        const draft = localStorage.getItem('pollDraft');
        
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                setPollDraft(parsed);
                setStatus('creating');
                
                // Auto-create the poll
                createPoll(parsed);
            } catch (e) {
                console.error('Error parsing draft:', e);
                setStatus('success'); // No draft, just show success
            }
        } else {
            setStatus('success'); // No draft, just show success
        }
    }, []);

    const createPoll = async (data: any) => {
        try {
            console.log('Creating poll from draft:', data);
            
            // Make sure options are strings
            const options = Array.isArray(data.options) 
                ? data.options.map((o: any) => typeof o === 'string' ? o : o.text || String(o))
                : [];

            const pollData = {
                title: data.title,
                description: data.description || undefined,
                options: options,
                pollType: data.pollType || 'multiple',
                settings: data.settings || { hideResults: false, allowMultiple: false }
            };

            console.log('Sending to API:', pollData);

            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollData)
            });

            const result = await response.json();
            console.log('API result:', result);

            if (response.ok && result.id && result.adminKey) {
                // Clear the draft
                localStorage.removeItem('pollDraft');
                // Redirect to dashboard
                window.location.href = `/#id=${result.id}&admin=${result.adminKey}`;
            } else {
                setError(result.error || 'Failed to create poll');
                setStatus('error');
            }
        } catch (err) {
            console.error('Error creating poll:', err);
            setError('Network error. Please try again.');
            setStatus('error');
        }
    };

    const handleRetry = () => {
        if (pollDraft) {
            setStatus('creating');
            setError(null);
            createPoll(pollDraft);
        }
    };

    const handleManualCreate = () => {
        // Clear draft and go to create page
        localStorage.removeItem('pollDraft');
        window.location.href = '/create.html';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
            >
                {status === 'loading' && (
                    <>
                        <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Processing...
                        </h1>
                    </>
                )}

                {status === 'creating' && (
                    <>
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 size={40} className="text-indigo-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Creating Your Poll...
                        </h1>
                        <p className="text-slate-600">
                            Please wait while we set everything up
                        </p>
                        {pollDraft && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-left">
                                <p className="text-sm text-slate-500">Poll title:</p>
                                <p className="font-medium text-slate-800">{pollDraft.title}</p>
                            </div>
                        )}
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle size={40} className="text-emerald-600" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-slate-600 mb-6">
                            Thank you for your purchase. Your premium features are now active.
                        </p>
                        <a
                            href="/create.html"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition"
                        >
                            <Sparkles size={18} />
                            Create Your Poll
                            <ArrowRight size={18} />
                        </a>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Something Went Wrong
                        </h1>
                        <p className="text-slate-600 mb-2">
                            {error || 'We couldn\'t create your poll automatically.'}
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Don't worry - your payment was successful! You can create your poll manually.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRetry}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleManualCreate}
                                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                            >
                                Create Poll Manually
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

// Mount
const container = document.getElementById('root');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <SuccessPage />
        </React.StrictMode>
    );
}

export default SuccessPage;
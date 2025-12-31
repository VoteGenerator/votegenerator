import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Search, Loader2, Check, AlertCircle, Key, ArrowRight } from 'lucide-react';

interface PollRecoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PollRecoveryModal: React.FC<PollRecoveryModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleRecover = async () => {
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
                body: JSON.stringify({ action: 'recover', email })
            });

            const data = await response.json();
            setResult({ 
                success: data.success !== false, 
                message: data.message || 'Check your email for recovery links.'
            });
        } catch (error) {
            setResult({ 
                success: false, 
                message: 'Failed to send recovery email. Please try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">Recover Your Polls</h2>
                                        <p className="text-sm text-white/80">Get admin links sent to your email</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!result ? (
                                <>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Enter the email address you used when creating your polls. 
                                        We'll send you admin links for all polls associated with that email.
                                    </p>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-800"
                                                onKeyDown={(e) => e.key === 'Enter' && handleRecover()}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleRecover}
                                        disabled={isLoading || !email}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search size={18} />
                                                Find My Polls
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-6 bg-slate-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-slate-700 text-sm mb-2">
                                            📝 Note
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            This only works if you saved your email during poll creation. 
                                            For security, we'll send the links to your email rather than displaying them here.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                        result.success ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        {result.success ? (
                                            <Check size={32} className="text-green-600" />
                                        ) : (
                                            <AlertCircle size={32} className="text-red-600" />
                                        )}
                                    </div>
                                    <h3 className={`font-bold text-lg mb-2 ${
                                        result.success ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {result.success ? 'Check Your Email!' : 'Oops!'}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-6">
                                        {result.message}
                                    </p>
                                    
                                    {result.success ? (
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                                        >
                                            Close
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setResult(null)}
                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 mx-auto"
                                        >
                                            <ArrowRight size={16} /> Try Again
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PollRecoveryModal;
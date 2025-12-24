// ============================================================================
// PinEntryModal.tsx - PIN Protection for Admin Access
// Location: src/components/PinEntryModal.tsx
// Shows when accessing a PIN-protected poll's admin view
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface PinEntryModalProps {
    isOpen: boolean;
    pollTitle: string;
    onVerify: (pin: string) => Promise<boolean>;
    onCancel: () => void;
}

const PinEntryModal: React.FC<PinEntryModalProps> = ({
    isOpen,
    pollTitle,
    onVerify,
    onCancel
}) => {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPin, setShowPin] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const MAX_ATTEMPTS = 5;

    useEffect(() => {
        if (isOpen) {
            // Focus first input when modal opens
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError(null);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits entered
        if (value && index === 5 && newPin.every(d => d !== '')) {
            handleSubmit(newPin.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            // Move to previous input on backspace
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            const fullPin = pin.join('');
            if (fullPin.length === 6) {
                handleSubmit(fullPin);
            }
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newPin = [...pin];
            for (let i = 0; i < pastedData.length; i++) {
                newPin[i] = pastedData[i];
            }
            setPin(newPin);
            if (pastedData.length === 6) {
                handleSubmit(pastedData);
            } else {
                inputRefs.current[pastedData.length]?.focus();
            }
        }
    };

    const handleSubmit = async (fullPin: string) => {
        if (attempts >= MAX_ATTEMPTS) {
            setError('Too many attempts. Please try again later.');
            return;
        }

        setIsVerifying(true);
        setError(null);

        try {
            const isValid = await onVerify(fullPin);
            if (!isValid) {
                setAttempts(prev => prev + 1);
                setError(`Incorrect PIN. ${MAX_ATTEMPTS - attempts - 1} attempts remaining.`);
                setPin(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
            // If valid, parent component will close modal
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-xl font-bold mb-1">PIN Protected</h2>
                        <p className="text-amber-100 text-sm truncate px-4">
                            {pollTitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-center text-slate-600 mb-6">
                            Enter the 6-digit PIN to access the admin dashboard.
                        </p>

                        {/* PIN Input */}
                        <div className="flex justify-center gap-2 mb-6">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type={showPin ? 'text' : 'password'}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    disabled={isVerifying || attempts >= MAX_ATTEMPTS}
                                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all
                                        ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'}
                                        ${isVerifying ? 'opacity-50' : ''}
                                    `}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        {/* Show/Hide PIN Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 mx-auto mb-4"
                        >
                            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showPin ? 'Hide PIN' : 'Show PIN'}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
                            >
                                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Locked Out Message */}
                        {attempts >= MAX_ATTEMPTS && (
                            <div className="p-4 bg-slate-100 rounded-lg text-center mb-4">
                                <p className="text-slate-600 text-sm">
                                    Too many incorrect attempts. Please wait a few minutes or contact the poll creator.
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={isVerifying}
                                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSubmit(pin.join(''))}
                                disabled={isVerifying || pin.some(d => !d) || attempts >= MAX_ATTEMPTS}
                                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isVerifying ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        Unlock
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-center text-xs text-slate-400 mt-4">
                            Don't know the PIN? Contact the poll creator.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PinEntryModal;
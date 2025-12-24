// ============================================================================
// PinSetupModal.tsx - Set/Change Admin PIN
// Location: src/components/PinSetupModal.tsx
// Unlimited plan only - allows setting PIN protection on admin link
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff, ShieldCheck, Trash2 } from 'lucide-react';

interface PinSetupModalProps {
    isOpen: boolean;
    hasExistingPin: boolean;
    pollId: string;
    adminKey: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({
    isOpen,
    hasExistingPin,
    pollId,
    adminKey,
    onClose,
    onSuccess
}) => {
    const [step, setStep] = useState<'enter' | 'confirm' | 'saving' | 'success' | 'remove'>('enter');
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setStep(hasExistingPin ? 'enter' : 'enter');
            setPin(['', '', '', '', '', '']);
            setConfirmPin(['', '', '', '', '', '']);
            setError(null);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen, hasExistingPin]);

    const handleChange = (
        index: number, 
        value: string, 
        isConfirm: boolean = false
    ) => {
        if (value && !/^\d$/.test(value)) return;

        const setter = isConfirm ? setConfirmPin : setPin;
        const current = isConfirm ? confirmPin : pin;
        const refs = isConfirm ? confirmInputRefs : inputRefs;

        const newPin = [...current];
        newPin[index] = value;
        setter(newPin);
        setError(null);

        if (value && index < 5) {
            refs.current[index + 1]?.focus();
        }

        // Auto-advance to confirm step
        if (!isConfirm && value && index === 5 && newPin.every(d => d !== '')) {
            setStep('confirm');
            setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
        }

        // Auto-submit on confirm complete
        if (isConfirm && value && index === 5 && newPin.every(d => d !== '')) {
            handleSubmit(pin.join(''), newPin.join(''));
        }
    };

    const handleKeyDown = (
        index: number, 
        e: React.KeyboardEvent, 
        isConfirm: boolean = false
    ) => {
        const current = isConfirm ? confirmPin : pin;
        const refs = isConfirm ? confirmInputRefs : inputRefs;

        if (e.key === 'Backspace' && !current[index] && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSubmit = async (newPin: string, confirmed: string) => {
        if (newPin !== confirmed) {
            setError('PINs do not match. Please try again.');
            setConfirmPin(['', '', '', '', '', '']);
            confirmInputRefs.current[0]?.focus();
            return;
        }

        setStep('saving');

        try {
            const res = await fetch('/.netlify/functions/vg-set-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId, adminKey, pin: newPin })
            });

            if (res.ok) {
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to set PIN');
                setStep('enter');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setStep('enter');
        }
    };

    const handleRemovePin = async () => {
        setStep('saving');

        try {
            const res = await fetch('/.netlify/functions/vg-set-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pollId, adminKey, pin: null, remove: true })
            });

            if (res.ok) {
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to remove PIN');
                setStep('remove');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setStep('remove');
        }
    };

    const renderPinInputs = (values: string[], isConfirm: boolean = false) => {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        return (
            <div className="flex justify-center gap-2">
                {values.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => refs.current[index] = el}
                        type={showPin ? 'text' : 'password'}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value, isConfirm)}
                        onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
                        disabled={step === 'saving'}
                        className="w-11 h-13 text-center text-xl font-bold border-2 border-slate-200 rounded-lg 
                                   focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                        autoComplete="off"
                    />
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold">
                                    {hasExistingPin ? 'Change PIN' : 'Set Admin PIN'}
                                </h2>
                                <p className="text-amber-100 text-sm">Protect your admin dashboard</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {step === 'success' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {hasExistingPin ? 'PIN Updated!' : 'PIN Set!'}
                                </h3>
                                <p className="text-slate-500">
                                    Your admin dashboard is now protected.
                                </p>
                            </motion.div>
                        ) : step === 'saving' ? (
                            <div className="text-center py-12">
                                <Loader2 size={40} className="text-amber-500 animate-spin mx-auto mb-4" />
                                <p className="text-slate-500">Saving...</p>
                            </div>
                        ) : step === 'remove' ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Remove PIN?</h3>
                                <p className="text-slate-500 mb-6">
                                    Anyone with your admin link will be able to access the dashboard without a PIN.
                                </p>
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('enter')}
                                        className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRemovePin}
                                        className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Remove PIN
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Step Indicator */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${step === 'enter' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                        1
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-200" />
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${step === 'confirm' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        2
                                    </div>
                                </div>

                                <h3 className="text-center font-semibold text-slate-800 mb-2">
                                    {step === 'enter' ? 'Enter a 6-digit PIN' : 'Confirm your PIN'}
                                </h3>
                                <p className="text-center text-slate-500 text-sm mb-6">
                                    {step === 'enter' 
                                        ? 'This PIN will be required to access your admin dashboard.'
                                        : 'Re-enter your PIN to confirm.'}
                                </p>

                                {step === 'enter' ? renderPinInputs(pin) : renderPinInputs(confirmPin, true)}

                                {/* Show/Hide Toggle */}
                                <button
                                    onClick={() => setShowPin(!showPin)}
                                    className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 mx-auto mt-4"
                                >
                                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showPin ? 'Hide' : 'Show'}
                                </button>

                                {/* Error */}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-6 flex gap-3">
                                    {step === 'confirm' && (
                                        <button
                                            onClick={() => {
                                                setStep('enter');
                                                setConfirmPin(['', '', '', '', '', '']);
                                            }}
                                            className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
                                        >
                                            Back
                                        </button>
                                    )}
                                    {hasExistingPin && step === 'enter' && (
                                        <button
                                            onClick={() => setStep('remove')}
                                            className="py-3 px-4 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (step === 'enter' && pin.every(d => d !== '')) {
                                                setStep('confirm');
                                                setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
                                            } else if (step === 'confirm' && confirmPin.every(d => d !== '')) {
                                                handleSubmit(pin.join(''), confirmPin.join(''));
                                            }
                                        }}
                                        disabled={(step === 'enter' ? pin : confirmPin).some(d => !d)}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl 
                                                   hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {step === 'enter' ? 'Continue' : (
                                            <>
                                                <ShieldCheck size={18} />
                                                Set PIN
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="mt-6 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 text-center">
                                        💡 Your PIN protects the master admin link. Shared access tokens are not affected.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PinSetupModal;
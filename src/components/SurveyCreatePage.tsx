// ============================================================================
// SurveyCreatePage.tsx - Complete Survey Creation Flow
// Location: src/components/SurveyCreatePage.tsx
// Features: Build survey → Configure settings → Publish → Get shareable link
// ============================================================================

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, Send, Link2, Copy, Settings,
    Eye, Lock, Users, Shield, Clock, FileText, Sparkles, Crown,
    Key, Share2, QrCode, Loader2, AlertCircle
} from 'lucide-react';
import SurveyBuilder from './SurveyBuilder';
import { SurveySection, SurveySettings, Poll } from '../types';

// ============================================================================
// TYPES
// ============================================================================

type Step = 'build' | 'settings' | 'publish' | 'success';

interface SecurityOption {
    id: 'none' | 'code' | 'pin' | 'ip';
    name: string;
    description: string;
    icon: typeof Lock;
    free?: boolean;
}

const SECURITY_OPTIONS: SecurityOption[] = [
    { id: 'none', name: 'Open Access', description: 'Anyone with link can respond', icon: Users, free: true },
    { id: 'pin', name: 'Shared PIN', description: 'Single PIN for all respondents', icon: Key, free: false },
    { id: 'code', name: 'Unique Codes', description: 'One-time use access codes', icon: Shield, free: false },
    { id: 'ip', name: 'IP Restriction', description: 'One response per IP address', icon: Lock, free: true },
];

// ============================================================================
// COMPONENT
// ============================================================================

const SurveyCreatePage: React.FC = () => {
    // State
    const [step, setStep] = useState<Step>('build');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState<SurveySection[]>([
        {
            id: 'section-1',
            title: 'Section 1',
            description: '',
            questions: []
        }
    ]);
    const [surveySettings, setSurveySettings] = useState<SurveySettings>({
        showProgress: true,
        allowBack: true,
        shuffleQuestions: false,
        showSummary: false,
        anonymousMode: false,
        completionMessage: 'Thank you for your response!',
    });
    
    // Poll-level settings
    const [security, setSecurity] = useState<'none' | 'code' | 'pin' | 'ip'>('none');
    const [hideResults, setHideResults] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [accessCodes, setAccessCodes] = useState<string[]>([]);
    const [pin, setPin] = useState('');
    const [codeCount, setCodeCount] = useState(10);
    
    // Publishing state
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [createdPoll, setCreatedPoll] = useState<{ id: string; adminKey: string } | null>(null);
    const [copied, setCopied] = useState(false);
    
    // Tier
    const tier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier') || 'free';
    const isFree = tier === 'free';
    
    // Load template from sessionStorage if present
    useEffect(() => {
        const templateData = sessionStorage.getItem('vg_survey_template');
        if (templateData) {
            try {
                const template = JSON.parse(templateData);
                // Clear the template from storage
                sessionStorage.removeItem('vg_survey_template');
                
                // Apply template data
                if (template.question) setTitle(template.question);
                if (template.description) setDescription(template.description);
                if (template.sections) setSections(template.sections);
                if (template.surveySettings) setSurveySettings(prev => ({ ...prev, ...template.surveySettings }));
                if (template.settings?.hideResults) setHideResults(true);
                if (template.settings?.anonymousMode) {
                    setSurveySettings(prev => ({ ...prev, anonymousMode: true }));
                }
            } catch (e) {
                console.error('Failed to load survey template:', e);
            }
        }
    }, []);
    const maxQuestions = isFree ? 10 : (tier === 'pro' ? 25 : Infinity);
    const maxSections = isFree ? 3 : (tier === 'pro' ? 10 : Infinity);
    
    // Count total questions
    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
    
    // Generate access codes
    const generateCodes = useCallback(() => {
        const codes: string[] = [];
        for (let i = 0; i < codeCount; i++) {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            codes.push(code);
        }
        setAccessCodes(codes);
    }, [codeCount]);
    
    // Generate PIN
    const generatePin = useCallback(() => {
        const newPin = Math.random().toString(36).substring(2, 8).toUpperCase();
        setPin(newPin);
    }, []);
    
    // Validate before moving to next step
    const canProceedToSettings = title.trim() !== '' && totalQuestions > 0;
    const canProceedToPublish = canProceedToSettings;
    
    // Publish survey
    const handlePublish = async () => {
        setIsPublishing(true);
        setPublishError(null);
        
        try {
            // Build poll object
            const pollData = {
                title,
                description,
                type: 'survey',
                options: [], // Surveys don't use options
                sections,
                surveySettings,
                settings: {
                    hideResults,
                    allowMultiple: false,
                    security,
                    deadline: deadline || null,
                    anonymousMode: surveySettings.anonymousMode,
                },
                allowedCodes: security === 'code' ? accessCodes : undefined,
                sharedPin: security === 'pin' ? pin : undefined,
            };
            
            const response = await fetch('/.netlify/functions/vg-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollData),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create survey');
            }
            
            const result = await response.json();
            setCreatedPoll({ id: result.id, adminKey: result.adminKey });
            
            // Save to localStorage for Admin Dashboard
            const existingPolls = JSON.parse(localStorage.getItem('vg_polls') || '[]');
            existingPolls.push({
                id: result.id,
                adminKey: result.adminKey,
                title,
                type: 'survey',
                createdAt: new Date().toISOString(),
            });
            localStorage.setItem('vg_polls', JSON.stringify(existingPolls));
            
            setStep('success');
        } catch (err: any) {
            setPublishError(err.message || 'Failed to create survey');
        } finally {
            setIsPublishing(false);
        }
    };
    
    // Copy link
    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareUrl = createdPoll ? `${window.location.origin}/#survey=${createdPoll.id}` : '';
    const adminUrl = createdPoll ? `${window.location.origin}/#survey=${createdPoll.id}&admin=${createdPoll.adminKey}` : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <a href="/" className="p-2 hover:bg-slate-100 rounded-xl transition">
                                <ArrowLeft size={20} className="text-slate-600" />
                            </a>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Create Survey</h1>
                                <p className="text-sm text-slate-500">Multi-question survey with sections</p>
                            </div>
                        </div>
                        
                        {/* Step indicator */}
                        <div className="hidden sm:flex items-center gap-2">
                            {['build', 'settings', 'publish'].map((s, i) => (
                                <React.Fragment key={s}>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                                        step === s 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : (step === 'success' || (['build', 'settings', 'publish'].indexOf(step) > i))
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {(step === 'success' || (['build', 'settings', 'publish'].indexOf(step) > i)) ? (
                                            <Check size={14} />
                                        ) : (
                                            <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                                                {i + 1}
                                            </span>
                                        )}
                                        <span className="capitalize">{s}</span>
                                    </div>
                                    {i < 2 && <ArrowRight size={14} className="text-slate-300" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {/* ============================================ */}
                    {/* STEP 1: BUILD */}
                    {/* ============================================ */}
                    {step === 'build' && (
                        <motion.div
                            key="build"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Title & Description */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h2 className="font-bold text-slate-800 mb-4">Survey Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Survey Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Employee Satisfaction Survey"
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Description (optional)
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell respondents what this survey is about..."
                                            rows={2}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Survey Builder */}
                            <SurveyBuilder
                                initialSections={sections}
                                initialSettings={surveySettings}
                                onChange={(newSections, newSettings) => {
                                    setSections(newSections);
                                    setSurveySettings(newSettings);
                                }}
                                tier={tier}
                            />
                            
                            {/* Next Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStep('settings')}
                                    disabled={!canProceedToSettings}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition ${
                                        canProceedToSettings
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    Next: Settings
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* ============================================ */}
                    {/* STEP 2: SETTINGS */}
                    {/* ============================================ */}
                    {step === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Security */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-slate-800">Access Control</h2>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {SECURITY_OPTIONS.map((opt) => {
                                        const isLocked = !opt.free && isFree;
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => !isLocked && setSecurity(opt.id)}
                                                disabled={isLocked}
                                                className={`p-4 rounded-xl border-2 text-left transition ${
                                                    security === opt.id
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : isLocked
                                                            ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                                                            : 'border-slate-200 hover:border-indigo-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <Icon size={18} className={security === opt.id ? 'text-indigo-600' : 'text-slate-500'} />
                                                        <span className="font-semibold text-slate-800">{opt.name}</span>
                                                    </div>
                                                    {isLocked && <Crown size={14} className="text-amber-500" />}
                                                </div>
                                                <p className="text-sm text-slate-500">{opt.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Access Code Generator */}
                                {security === 'code' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-4 p-4 bg-slate-50 rounded-xl"
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            <label className="text-sm font-medium text-slate-700">
                                                Generate codes:
                                            </label>
                                            <input
                                                type="number"
                                                value={codeCount}
                                                onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value) || 1))}
                                                min={1}
                                                max={100}
                                                className="w-20 px-3 py-1 border border-slate-300 rounded-lg text-center"
                                            />
                                            <button
                                                onClick={generateCodes}
                                                className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                        {accessCodes.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {accessCodes.map((code, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                                                        {code}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {/* PIN Generator */}
                                {security === 'pin' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-4 p-4 bg-slate-50 rounded-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-medium text-slate-700">
                                                Shared PIN:
                                            </label>
                                            <input
                                                type="text"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value.toUpperCase())}
                                                placeholder="Enter or generate"
                                                maxLength={10}
                                                className="w-32 px-3 py-1 border border-slate-300 rounded-lg text-center font-mono uppercase"
                                            />
                                            <button
                                                onClick={generatePin}
                                                className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            {/* Results Visibility */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Eye size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-slate-800">Results</h2>
                                </div>
                                
                                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                                    <div>
                                        <div className="font-medium text-slate-800">Hide results from respondents</div>
                                        <div className="text-sm text-slate-500">Only you can see the results</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={hideResults}
                                        onChange={(e) => setHideResults(e.target.checked)}
                                        className="w-5 h-5 rounded text-indigo-600"
                                    />
                                </label>
                            </div>
                            
                            {/* Deadline */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-slate-800">Deadline (Optional)</h2>
                                </div>
                                
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            
                            {/* Navigation */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep('build')}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep('publish')}
                                    disabled={!canProceedToPublish}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2"
                                >
                                    Next: Publish
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* ============================================ */}
                    {/* STEP 3: PUBLISH */}
                    {/* ============================================ */}
                    {step === 'publish' && (
                        <motion.div
                            key="publish"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Preview */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText size={20} className="text-indigo-600" />
                                    <h2 className="font-bold text-slate-800">Review Your Survey</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-slate-500">Title</div>
                                        <div className="text-lg font-semibold text-slate-800">{title}</div>
                                    </div>
                                    {description && (
                                        <div>
                                            <div className="text-sm text-slate-500">Description</div>
                                            <div className="text-slate-700">{description}</div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-indigo-600">{sections.length}</div>
                                            <div className="text-sm text-slate-500">Sections</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-indigo-600">{totalQuestions}</div>
                                            <div className="text-sm text-slate-500">Questions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-indigo-600 capitalize">{security}</div>
                                            <div className="text-sm text-slate-500">Security</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Error */}
                            {publishError && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                                    <AlertCircle size={20} />
                                    {publishError}
                                </div>
                            )}
                            
                            {/* Navigation */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep('settings')}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
                                >
                                    {isPublishing ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Publish Survey
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                    
                    {/* ============================================ */}
                    {/* STEP 4: SUCCESS */}
                    {/* ============================================ */}
                    {step === 'success' && createdPoll && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Check size={40} className="text-white" />
                            </motion.div>
                            
                            <h1 className="text-3xl font-black text-slate-800 mb-2">
                                Survey Published! 🎉
                            </h1>
                            <p className="text-slate-600 mb-8">
                                Your survey is live and ready to collect responses.
                            </p>
                            
                            {/* Share Link */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Share this link with respondents:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                                    />
                                    <button
                                        onClick={() => copyLink(shareUrl)}
                                        className={`px-5 rounded-xl font-bold flex items-center gap-2 ${
                                            copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                                
                                {security === 'code' && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                                            <Key size={16} />
                                            Access Codes (share separately):
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {accessCodes.slice(0, 5).map((code, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-amber-200 rounded text-xs font-mono">
                                                    {code}
                                                </span>
                                            ))}
                                            {accessCodes.length > 5 && (
                                                <span className="text-xs text-amber-600">+{accessCodes.length - 5} more</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {security === 'pin' && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-amber-800 font-medium">
                                            <Key size={16} />
                                            Shared PIN:
                                        </div>
                                        <span className="font-mono font-bold text-lg text-amber-900">{pin}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={`/#survey=${createdPoll.id}&admin=${createdPoll.adminKey}`}
                                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2"
                                >
                                    <Settings size={18} />
                                    View Dashboard
                                </a>
                                <a
                                    href="/dashboard"
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2"
                                >
                                    All Surveys
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SurveyCreatePage;
// ============================================================================
// ContactPage - Contact Form with Netlify Forms
// Bot protection: Netlify's built-in + honeypot field
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Mail, 
    MessageSquare, 
    Send, 
    Clock, 
    Shield, 
    CheckCircle2,
    HelpCircle,
    Zap,
    ArrowRight,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

const ContactPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subjects = [
        { value: 'general', label: 'General Inquiry', emoji: '💬' },
        { value: 'support', label: 'Technical Support', emoji: '🔧' },
        { value: 'billing', label: 'Billing Question', emoji: '💳' },
        { value: 'enterprise', label: 'Enterprise / Custom Pricing', emoji: '🏢' },
        { value: 'partnership', label: 'Partnership Opportunity', emoji: '🤝' },
        { value: 'feedback', label: 'Product Feedback', emoji: '💡' },
    ];

    const [selectedSubject, setSelectedSubject] = useState('general');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again or email us directly at hello@votegenerator.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            q: "How quickly do you respond?",
            a: "We aim to respond within 24 hours on business days. Pro+ subscribers get priority support."
        },
        {
            q: "I need help with my poll right now",
            a: "Check our Help Center for instant answers to common questions, or email us and we'll prioritize urgent issues."
        },
        {
            q: "Do you offer custom enterprise solutions?",
            a: "Yes! Email us with your requirements and we'll discuss custom options for your organization."
        }
    ];

    // Success State
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <NavHeader />
                
                <div className="max-w-2xl mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-lg"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-4">
                            Message Sent!
                        </h1>
                        <p className="text-slate-600 mb-8">
                            Thanks for reaching out! We've received your message and will get back to you soon.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
                            <Clock size={16} />
                            <span>We typically respond within 24 hours</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/"
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg inline-flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                Create a Poll
                            </a>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Send Another Message
                            </button>
                        </div>
                    </motion.div>
                </div>
                
                <Footer />
            </div>
        );
    }

    // Form State
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />

            {/* Hero */}
            <div className="pt-16 pb-12 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                            <MessageSquare size={16} />
                            We're here to help
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-slate-600">
                            Have a question? Need help? Want to discuss enterprise options?
                            <br className="hidden md:block" />
                            We'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Form - Takes 3 columns */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                            {/* 
                                Netlify Forms: 
                                - data-netlify="true" enables Netlify Forms
                                - data-netlify-honeypot="bot-field" adds bot protection
                                - name="contact" is required for Netlify to identify the form
                            */}
                            <form 
                                name="contact"
                                method="POST"
                                data-netlify="true"
                                data-netlify-honeypot="bot-field"
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Hidden field for Netlify */}
                                <input type="hidden" name="form-name" value="contact" />
                                
                                {/* Honeypot field - hidden from humans, bots fill it */}
                                <p className="hidden">
                                    <label>
                                        Don't fill this out: <input name="bot-field" />
                                    </label>
                                </p>

                                {/* Name & Email Row */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="jane@company.com"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        What can we help with? <span className="text-red-500">*</span>
                                    </label>
                                    <input type="hidden" name="subject" value={subjects.find(s => s.value === selectedSubject)?.label} />
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {subjects.map((subject) => (
                                            <button
                                                key={subject.value}
                                                type="button"
                                                onClick={() => setSelectedSubject(subject.value)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                    selectedSubject === subject.value
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-lg mb-1 block">{subject.emoji}</span>
                                                <span className={`text-xs font-medium ${
                                                    selectedSubject === subject.value ? 'text-indigo-700' : 'text-slate-600'
                                                }`}>
                                                    {subject.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Your Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                                        placeholder="Tell us more about how we can help..."
                                    />
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <Shield size={18} className="text-green-500 shrink-0 mt-0.5" />
                                    <div className="text-xs text-slate-500">
                                        <span className="font-medium text-slate-700">Your privacy matters.</span>{' '}
                                        We'll only use your email to respond to this message. No spam, ever.
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                        isSubmitting
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Sidebar - Takes 2 columns */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Direct Contact */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-4">Prefer Email?</h3>
                            <a
                                href="mailto:hello@votegenerator.com"
                                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">hello@votegenerator.com</p>
                                    <p className="text-sm text-indigo-200">We reply within 24 hours</p>
                                </div>
                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>

                        {/* Response Time */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Zap size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Fast Response</h3>
                                    <p className="text-sm text-slate-500">Usually within 24 hours</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span className="text-slate-600">General inquiries: 24 hours</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span className="text-slate-600">Technical support: 12 hours</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <span className="text-slate-600">Pro+ priority: 4 hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick FAQ */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <HelpCircle size={20} className="text-amber-600" />
                                </div>
                                <h3 className="font-bold text-slate-900">Quick Answers</h3>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{faq.q}</h4>
                                        <p className="text-slate-500 text-xs leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="/help"
                                className="mt-4 w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                Visit Help Center
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-slate-100 to-indigo-50 py-16 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Ready to create your first poll?
                    </h2>
                    <p className="text-slate-600 mb-8">
                        No signup required. Start in seconds.
                    </p>
                    <a
                        href="/#create"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Sparkles size={20} />
                        Get Started Free
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage;
import React, { useState, useRef } from 'react';
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
    Sparkles
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import PromoBanner from './PromoBanner';

declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
            render: (container: string | HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => number;
            reset: (widgetId?: number) => void;
        };
    }
}

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recaptchaRef = useRef<HTMLDivElement>(null);

    const subjects = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'billing', label: 'Billing Question' },
        { value: 'enterprise', label: 'Enterprise / Custom Pricing' },
        { value: 'partnership', label: 'Partnership Opportunity' },
        { value: 'feedback', label: 'Product Feedback' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // In production, this would submit to your backend
            // For now, we'll simulate a submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create mailto link as fallback
            const mailtoLink = `mailto:hello@votegenerator.com?subject=${encodeURIComponent(
                `[${subjects.find(s => s.value === formData.subject)?.label}] Contact from ${formData.name}`
            )}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            )}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            setSubmitted(true);
        } catch (err) {
            setError('Something went wrong. Please try again or email us directly.');
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
            a: "Yes! Select 'Enterprise / Custom Pricing' above and tell us about your needs. We offer custom branding, SSO, and dedicated support."
        }
    ];

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <PromoBanner position="top" />
                <div className="h-12" />
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
                            Thanks for reaching out! Your email client should have opened with your message. 
                            If not, please email us directly at{' '}
                            <a href="mailto:hello@votegenerator.com" className="text-indigo-600 font-semibold hover:underline">
                                hello@votegenerator.com
                            </a>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
                            <Clock size={16} />
                            <span>We typically respond within 24 hours</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/index.html"
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} />
                                Create a Poll
                            </a>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ name: '', email: '', subject: 'general', message: '' });
                                }}
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <PromoBanner position="top" />
            <div className="h-12" />
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
                            <br />We'd love to hear from you.
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
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name & Email Row */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        What can we help with? *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                                    >
                                        {subjects.map((subject) => (
                                            <option key={subject.value} value={subject.value}>
                                                {subject.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Your Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                                        placeholder="Tell us more about how we can help..."
                                    />
                                </div>

                                {/* reCAPTCHA Notice */}
                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                    <Shield size={20} className="text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-500">
                                        This form is protected by reCAPTCHA. By submitting, you agree to our{' '}
                                        <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a> and{' '}
                                        <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                        isSubmitting
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
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
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-4">Prefer Email?</h3>
                            <a
                                href="mailto:hello@votegenerator.com"
                                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">hello@votegenerator.com</p>
                                    <p className="text-sm text-indigo-200">We reply within 24 hours</p>
                                </div>
                                <ArrowRight size={18} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>

                        {/* Response Time */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Zap size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Fast Response</h3>
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
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <HelpCircle size={20} className="text-amber-600" />
                                </div>
                                <h3 className="font-bold text-slate-800">Quick Answers</h3>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{faq.q}</h4>
                                        <p className="text-slate-500 text-xs">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="/help.html"
                                className="mt-4 w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                Visit Help Center
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-50 py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">
                        Ready to create your first poll?
                    </h2>
                    <p className="text-slate-600 mb-6">
                        No signup required. Start in seconds.
                    </p>
                    <a
                        href="/index.html"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                        <Sparkles size={20} />
                        Create Free Poll
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactPage;
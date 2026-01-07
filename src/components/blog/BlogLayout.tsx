// ============================================================================
// BlogLayout.tsx - Beautiful, conversion-optimized blog layout
// Inspired by: Linear, Notion, Stripe blogs
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
    Clock, Calendar, ArrowLeft, Twitter, Linkedin, 
    Link2, Check, ArrowRight, ChevronUp, Sparkles
} from 'lucide-react';
import NavHeader from '../NavHeader';
import Footer from '../Footer';

// ============================================================================
// READING PROGRESS BAR
// ============================================================================

const ReadingProgress: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    
    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]"
            style={{ scaleX }}
        />
    );
};

// ============================================================================
// SHARE BUTTONS
// ============================================================================

const ShareButtons: React.FC<{ title: string }> = ({ title }) => {
    const [copied, setCopied] = useState(false);
    
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    };
    
    const shareLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    };
    
    return (
        <div className="flex items-center gap-1">
            <button onClick={copyLink} className="p-2.5 rounded-xl hover:bg-slate-100 transition group" title="Copy link">
                {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} className="text-slate-400 group-hover:text-slate-600" />}
            </button>
            <button onClick={shareTwitter} className="p-2.5 rounded-xl hover:bg-slate-100 transition group" title="Share on X">
                <Twitter size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>
            <button onClick={shareLinkedIn} className="p-2.5 rounded-xl hover:bg-slate-100 transition group" title="Share on LinkedIn">
                <Linkedin size={18} className="text-slate-400 group-hover:text-slate-600" />
            </button>
        </div>
    );
};

// ============================================================================
// BACK TO TOP BUTTON
// ============================================================================

const BackToTop: React.FC = () => {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    if (!show) return null;
    
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition z-50"
        >
            <ChevronUp size={20} className="text-slate-600" />
        </motion.button>
    );
};

// ============================================================================
// INLINE CTA BOX
// ============================================================================

interface CTABoxProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    variant?: 'default' | 'inline' | 'gradient';
}

export const CTABox: React.FC<CTABoxProps> = ({ 
    title, 
    description, 
    buttonText, 
    buttonLink,
    variant = 'default'
}) => {
    if (variant === 'inline') {
        return (
            <div className="my-10 p-6 bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                        <p className="text-sm text-slate-600">{description}</p>
                    </div>
                    <a
                        href={buttonLink}
                        className="flex-shrink-0 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                    >
                        {buttonText}
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        );
    }
    
    if (variant === 'gradient') {
        return (
            <div className="my-16 p-10 md:p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h3>
                    <p className="text-indigo-100 mb-8 max-w-md mx-auto text-lg">{description}</p>
                    <a
                        href={buttonLink}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        <Sparkles size={18} />
                        {buttonText}
                        <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <div className="my-12 p-8 bg-slate-900 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">{description}</p>
            <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition"
            >
                {buttonText}
                <ArrowRight size={18} />
            </a>
        </div>
    );
};

// ============================================================================
// CALLOUT BOX
// ============================================================================

interface CalloutProps {
    type?: 'info' | 'warning' | 'tip' | 'important';
    title?: string;
    children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'info', title, children }) => {
    const styles = {
        info: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500', title: 'text-blue-900', text: 'text-blue-800' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'bg-amber-500', title: 'text-amber-900', text: 'text-amber-800' },
        tip: { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500', title: 'text-emerald-900', text: 'text-emerald-800' },
        important: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500', title: 'text-purple-900', text: 'text-purple-800' },
    };
    
    const s = styles[type];
    
    return (
        <div className={`my-8 rounded-2xl ${s.bg} border ${s.border} overflow-hidden`}>
            <div className={`h-1.5 ${s.accent}`} />
            <div className="p-6">
                {title && <p className={`font-bold text-lg mb-2 ${s.title}`}>{title}</p>}
                <div className={`leading-relaxed ${s.text}`}>{children}</div>
            </div>
        </div>
    );
};

// ============================================================================
// QUESTION LIST ITEM
// ============================================================================

interface QuestionItemProps {
    number: number;
    question: string;
    type?: string;
    tip?: string;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ number, question, type, tip }) => {
    return (
        <div className="py-5 border-b border-slate-100 last:border-0 group hover:bg-slate-50/50 -mx-4 px-4 rounded-xl transition">
            <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition">
                    {number}
                </span>
                <div className="flex-1 pt-1">
                    <p className="font-semibold text-slate-900 text-lg mb-2">{question}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        {type && (
                            <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-lg font-medium">{type}</span>
                        )}
                        {tip && (
                            <span className="text-indigo-600 font-medium">💡 {tip}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN BLOG LAYOUT
// ============================================================================

interface BlogLayoutProps {
    title: string;
    subtitle?: string;
    publishDate: string;
    readTime: string;
    category: string;
    categoryColor?: string;
    children: React.ReactNode;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
    title,
    subtitle,
    publishDate,
    readTime,
    category,
    categoryColor = 'bg-indigo-100 text-indigo-700',
    children,
    ctaTitle = "Ready to create your survey?",
    ctaDescription = "No signup required. Get honest feedback in minutes.",
    ctaButtonText = "Create Free Survey",
    ctaButtonLink = "/survey"
}) => {
    return (
        <div className="min-h-screen bg-white">
            <ReadingProgress />
            <NavHeader />
            
            {/* Hero */}
            <header className="pt-12 md:pt-20 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <motion.a 
                        href="/blog" 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium mb-8 transition group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        All Articles
                    </motion.a>
                    
                    {/* Category & Meta */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap items-center gap-3 mb-6"
                    >
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${categoryColor}`}>
                            {category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar size={14} />
                            {publishDate}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Clock size={14} />
                            {readTime}
                        </span>
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
                    >
                        {title}
                    </motion.h1>
                    
                    {/* Subtitle */}
                    {subtitle && (
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl text-slate-500 leading-relaxed"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                    
                    {/* Divider with Share */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between"
                    >
                        <span className="text-sm text-slate-400 font-medium">Share this article</span>
                        <ShareButtons title={title} />
                    </motion.div>
                </div>
            </header>
            
            {/* Content */}
            <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto px-4 pb-20"
            >
                <div className="
                    prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                    prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-100
                    prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-[17px]
                    prose-a:text-indigo-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-semibold
                    prose-ul:text-slate-600 prose-ul:text-[17px] prose-ol:text-slate-600 prose-ol:text-[17px]
                    prose-li:my-2 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-slate-700
                    prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                ">
                    {children}
                </div>
                
                {/* Bottom CTA */}
                <CTABox 
                    variant="gradient"
                    title={ctaTitle}
                    description={ctaDescription}
                    buttonText={ctaButtonText}
                    buttonLink={ctaButtonLink}
                />
                
                {/* Share Footer */}
                <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 font-medium">Enjoyed this? Share it with others.</p>
                    <ShareButtons title={title} />
                </div>
            </motion.article>
            
            <BackToTop />
            <Footer />
        </div>
    );
};

export default BlogLayout;
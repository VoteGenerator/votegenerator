// ============================================================================
// BlogLayout.tsx - Clean, Typeform-inspired with data-backed CTA placement
// CTA Strategy: After intro (+304%), mid-content (+121%), end (+70%)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
    Clock, Calendar, ArrowLeft, Twitter, Linkedin, 
    Link2, Check, ArrowRight, Sparkles
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
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-[100]"
            style={{ scaleX }}
        />
    );
};

// ============================================================================
// FLOATING CTA - Appears after scrolling (sticky)
// ============================================================================

interface FloatingCTAProps {
    text: string;
    href: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ text, href }) => {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 400px
            setShow(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <AnimatePresence>
            {show && (
                <motion.a
                    href={href}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full shadow-2xl hover:bg-slate-800 transition flex items-center gap-2 text-sm"
                >
                    <Sparkles size={16} />
                    {text}
                </motion.a>
            )}
        </AnimatePresence>
    );
};

// ============================================================================
// SHARE BUTTONS - Minimal
// ============================================================================

const ShareButtons: React.FC<{ title: string }> = ({ title }) => {
    const [copied, setCopied] = useState(false);
    
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="flex items-center gap-1">
            <button onClick={copyLink} className="p-2 rounded-full hover:bg-slate-100 transition" title="Copy link">
                {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} className="text-slate-400" />}
            </button>
            <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="p-2 rounded-full hover:bg-slate-100 transition"
            >
                <Twitter size={18} className="text-slate-400" />
            </button>
            <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="p-2 rounded-full hover:bg-slate-100 transition"
            >
                <Linkedin size={18} className="text-slate-400" />
            </button>
        </div>
    );
};

// ============================================================================
// EARLY CTA - After intro, before first H2 (+304% conversions)
// ============================================================================

interface EarlyCTAProps {
    text: string;
    subtext: string;
    buttonText: string;
    href: string;
}

export const EarlyCTA: React.FC<EarlyCTAProps> = ({ text, subtext, buttonText, href }) => (
    <div className="my-12 py-8 px-6 bg-slate-50 rounded-2xl text-center">
        <p className="text-slate-900 font-semibold text-lg mb-1">{text}</p>
        <p className="text-slate-500 text-sm mb-5">{subtext}</p>
        <a
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition text-sm"
        >
            {buttonText}
            <ArrowRight size={16} />
        </a>
    </div>
);

// ============================================================================
// INLINE CTA - Mid-content (+121% CTR)
// ============================================================================

interface InlineCTAProps {
    text: string;
    buttonText: string;
    href: string;
}

export const InlineCTA: React.FC<InlineCTAProps> = ({ text, buttonText, href }) => (
    <div className="my-10 flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 bg-indigo-50 rounded-xl border border-indigo-100">
        <p className="text-slate-700 font-medium">{text}</p>
        <a
            href={href}
            className="flex-shrink-0 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition text-sm flex items-center gap-2"
        >
            {buttonText}
            <ArrowRight size={14} />
        </a>
    </div>
);

// ============================================================================
// END CTA - Gradient, full-width (+70% conversions)
// ============================================================================

interface EndCTAProps {
    title: string;
    subtitle: string;
    buttonText: string;
    href: string;
}

export const EndCTA: React.FC<EndCTAProps> = ({ title, subtitle, buttonText, href }) => (
    <div className="my-16 py-12 px-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">{subtitle}</p>
        <a
            href={href}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition"
        >
            <Sparkles size={18} />
            {buttonText}
        </a>
    </div>
);

// ============================================================================
// CALLOUT - Clean, minimal
// ============================================================================

interface CalloutProps {
    type?: 'info' | 'warning' | 'tip';
    children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'info', children }) => {
    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        tip: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    };
    
    return (
        <div className={`my-8 p-5 rounded-xl border ${styles[type]}`}>
            <div className="text-[15px] leading-relaxed">{children}</div>
        </div>
    );
};

// ============================================================================
// QUESTION ITEM - Clean, minimal cards
// ============================================================================

interface QuestionItemProps {
    number: number;
    question: string;
    type?: string;
    tip?: string;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ number, question, type, tip }) => (
    <div className="py-6 border-b border-slate-100 last:border-0">
        <div className="flex items-start gap-5">
            <span className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {number}
            </span>
            <div className="flex-1 pt-0.5">
                <p className="text-slate-900 text-[17px] font-medium leading-snug">{question}</p>
                {(type || tip) && (
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        {type && <span className="text-slate-400">{type}</span>}
                        {tip && <span className="text-indigo-600">→ {tip}</span>}
                    </div>
                )}
            </div>
        </div>
    </div>
);

// ============================================================================
// MAIN BLOG LAYOUT
// ============================================================================

interface BlogLayoutProps {
    title: string;
    subtitle?: string;
    publishDate: string;
    readTime: string;
    category: string;
    children: React.ReactNode;
    floatingCTA?: string;
    ctaLink?: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
    title,
    subtitle,
    publishDate,
    readTime,
    category,
    children,
    floatingCTA = "Create survey — 2 min",
    ctaLink = "/survey"
}) => {
    return (
        <div className="min-h-screen bg-white">
            <ReadingProgress />
            <NavHeader />
            
            {/* Hero - Clean, lots of whitespace */}
            <header className="pt-16 md:pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Back */}
                    <a 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mb-10 transition"
                    >
                        <ArrowLeft size={16} />
                        All articles
                    </a>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                        <span className="text-indigo-600 font-medium">{category}</span>
                        <span>·</span>
                        <span>{publishDate}</span>
                        <span>·</span>
                        <span>{readTime}</span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
                        {title}
                    </h1>
                    
                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-xl text-slate-500 leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
            </header>
            
            {/* Divider with share */}
            <div className="max-w-2xl mx-auto px-4 mb-12">
                <div className="flex items-center justify-between py-4 border-y border-slate-100">
                    <span className="text-sm text-slate-400">Share</span>
                    <ShareButtons title={title} />
                </div>
            </div>
            
            {/* Content */}
            <article className="max-w-2xl mx-auto px-4 pb-20">
                <div className="
                    prose prose-slate max-w-none
                    prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-slate-600
                    prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5
                    prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-4
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900 prose-strong:font-semibold
                    prose-ul:text-[17px] prose-ol:text-[17px]
                    prose-li:text-slate-600 prose-li:leading-relaxed
                    prose-blockquote:border-l-2 prose-blockquote:border-slate-200 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-500
                ">
                    {children}
                </div>
            </article>
            
            {/* Floating CTA */}
            <FloatingCTA text={floatingCTA} href={ctaLink} />
            
            <Footer />
        </div>
    );
};

export default BlogLayout;
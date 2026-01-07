// ============================================================================
// BlogLayout.tsx - Clean, conversion-optimized blog post layout
// Design: Inspired by Typeform/Linear blogs - readable, minimal, focused
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, Calendar, ArrowLeft, Share2, Twitter, Linkedin, 
    Link2, Check, ChevronRight, ArrowRight
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// TYPES
// ============================================================================

interface TableOfContentsItem {
    id: string;
    title: string;
    level: 1 | 2;
}

interface BlogLayoutProps {
    title: string;
    subtitle?: string;
    publishDate: string;
    readTime: string;
    category: string;
    categoryColor?: string;
    heroImage?: string;
    tableOfContents?: TableOfContentsItem[];
    children: React.ReactNode;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    ctaButtonLink?: string;
}

// ============================================================================
// SHARE BUTTON
// ============================================================================

const ShareButton: React.FC = () => {
    const [copied, setCopied] = useState(false);
    
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const shareTwitter = () => {
        const text = document.title;
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };
    
    const shareLinkedIn = () => {
        const url = window.location.href;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };
    
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={copyLink}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Copy link"
            >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} />}
            </button>
            <button
                onClick={shareTwitter}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Share on Twitter"
            >
                <Twitter size={18} />
            </button>
            <button
                onClick={shareLinkedIn}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Share on LinkedIn"
            >
                <Linkedin size={18} />
            </button>
        </div>
    );
};

// ============================================================================
// TABLE OF CONTENTS (Sticky Sidebar)
// ============================================================================

const TableOfContents: React.FC<{ items: TableOfContentsItem[] }> = ({ items }) => {
    const [activeId, setActiveId] = useState<string>('');
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -80% 0px' }
        );
        
        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });
        
        return () => observer.disconnect();
    }, [items]);
    
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.offsetTop - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };
    
    return (
        <nav className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                On this page
            </p>
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-left text-sm py-1.5 transition ${
                        item.level === 2 ? 'pl-4' : ''
                    } ${
                        activeId === item.id
                            ? 'text-indigo-600 font-medium'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    {item.title}
                </button>
            ))}
        </nav>
    );
};

// ============================================================================
// CTA BOX
// ============================================================================

interface CTABoxProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    variant?: 'default' | 'inline';
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
            <div className="my-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                        <p className="text-sm text-slate-600">{description}</p>
                    </div>
                    <a
                        href={buttonLink}
                        className="flex-shrink-0 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        {buttonText}
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <div className="my-12 p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-indigo-100 mb-6 max-w-md mx-auto">{description}</p>
            <a
                href={buttonLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition"
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
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        tip: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        important: 'bg-purple-50 border-purple-200 text-purple-800',
    };
    
    return (
        <div className={`my-6 p-5 rounded-xl border-l-4 ${styles[type]}`}>
            {title && <p className="font-bold mb-2">{title}</p>}
            <div className="text-sm">{children}</div>
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
        <div className="py-4 border-b border-slate-100 last:border-0">
            <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    {number}
                </span>
                <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">{question}</p>
                    <div className="flex items-center gap-3 text-sm">
                        {type && (
                            <span className="text-slate-400">{type}</span>
                        )}
                        {tip && (
                            <span className="text-slate-500 italic">💡 {tip}</span>
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

const BlogLayout: React.FC<BlogLayoutProps> = ({
    title,
    subtitle,
    publishDate,
    readTime,
    category,
    categoryColor = 'bg-indigo-100 text-indigo-700',
    heroImage,
    tableOfContents,
    children,
    ctaTitle = "Ready to create your survey?",
    ctaDescription = "No signup required. Get honest feedback in minutes.",
    ctaButtonText = "Create Free Survey",
    ctaButtonLink = "/survey"
}) => {
    return (
        <div className="min-h-screen bg-white">
            <NavHeader />
            
            {/* Hero */}
            <header className="pt-12 pb-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Back link */}
                    <a 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Blog
                    </a>
                    
                    {/* Category */}
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
                            {category}
                        </span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
                        {title}
                    </h1>
                    
                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-xl text-slate-600 mb-6">
                            {subtitle}
                        </p>
                    )}
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {publishDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {readTime}
                        </span>
                        <div className="flex-grow" />
                        <ShareButton />
                    </div>
                </div>
            </header>
            
            {/* Hero Image */}
            {heroImage && (
                <div className="max-w-4xl mx-auto px-4 mb-12">
                    <img 
                        src={heroImage} 
                        alt={title}
                        className="w-full rounded-2xl shadow-lg"
                    />
                </div>
            )}
            
            {/* Content Area with Optional Sidebar */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="flex gap-12">
                    {/* Main Content */}
                    <article className="flex-1 max-w-3xl mx-auto">
                        <div className="prose prose-lg prose-slate max-w-none
                            prose-headings:font-bold prose-headings:text-slate-900
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-slate-600 prose-p:leading-relaxed
                            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-900
                            prose-ul:text-slate-600 prose-ol:text-slate-600
                            prose-li:my-2
                            prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                        ">
                            {children}
                        </div>
                        
                        {/* Bottom CTA */}
                        <CTABox 
                            title={ctaTitle}
                            description={ctaDescription}
                            buttonText={ctaButtonText}
                            buttonLink={ctaButtonLink}
                        />
                    </article>
                    
                    {/* Sticky Sidebar - Desktop Only */}
                    {tableOfContents && tableOfContents.length > 0 && (
                        <aside className="hidden xl:block w-64 flex-shrink-0">
                            <div className="sticky top-24">
                                <TableOfContents items={tableOfContents} />
                            </div>
                        </aside>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default BlogLayout;
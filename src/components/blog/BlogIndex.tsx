// ============================================================================
// BlogIndex.tsx - Clean, minimal blog listing
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import NavHeader from '../NavHeader';
import Footer from '../Footer';

// ============================================================================
// BLOG POST DATA
// ============================================================================

const BLOG_POSTS = [
    {
        slug: 'is-your-work-survey-anonymous',
        title: 'Is Your Work Survey Actually Anonymous?',
        excerpt: 'What your employer can see, what "confidential" really means, and how to tell the difference.',
        category: 'Employee Surveys',
        date: 'Jan 6, 2026',
        readTime: '6 min',
    },
    {
        slug: 'employee-survey-questions',
        title: '50 Employee Survey Questions That Get Honest Answers',
        excerpt: 'Copy-paste ready. Organized by category. No corporate fluff.',
        category: 'Templates',
        date: 'Jan 6, 2026',
        readTime: '12 min',
    },
];

// ============================================================================
// BLOG CARD
// ============================================================================

const BlogCard: React.FC<{ post: typeof BLOG_POSTS[0]; index: number }> = ({ post, index }) => (
    <motion.a
        href={`/blog/${post.slug}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group block py-8 border-b border-slate-100 last:border-0"
    >
        <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
            <span className="text-indigo-600 font-medium">{post.category}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
            {post.title}
        </h2>
        
        <p className="text-slate-500 mb-4">
            {post.excerpt}
        </p>
        
        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition">
            Read article
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
    </motion.a>
);

// ============================================================================
// MAIN
// ============================================================================

const BlogIndex: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavHeader />
            
            {/* Hero - Simple */}
            <header className="pt-20 md:pt-28 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-indigo-600 font-medium mb-4"
                    >
                        Blog
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4"
                    >
                        Insights & Guides
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500"
                    >
                        Practical advice on surveys, polls, and getting honest feedback.
                    </motion.p>
                </div>
            </header>
            
            {/* Posts */}
            <section className="max-w-2xl mx-auto px-4 pb-20">
                {BLOG_POSTS.map((post, i) => (
                    <BlogCard key={post.slug} post={post} index={i} />
                ))}
            </section>
            
            {/* Simple CTA */}
            <section className="bg-slate-50 py-16">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        Ready to get better feedback?
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Create a survey in 2 minutes. No signup required.
                    </p>
                    <a 
                        href="/survey" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition"
                    >
                        Create free survey
                        <ArrowRight size={16} />
                    </a>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default BlogIndex;
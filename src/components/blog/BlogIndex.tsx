// ============================================================================
// BlogIndex.tsx - Beautiful blog listing page
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import NavHeader from '../NavHeader';
import Footer from '../Footer';

// ============================================================================
// BLOG POST DATA
// ============================================================================

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    categoryColor: string;
    publishDate: string;
    readTime: string;
    featured?: boolean;
    gradient?: string;
}

const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'is-your-work-survey-anonymous',
        title: 'Is Your Work Survey Actually Anonymous?',
        excerpt: 'What your employer can see, what "confidential" really means, and how to tell the difference before you hit submit.',
        category: 'Employee Surveys',
        categoryColor: 'bg-emerald-500/10 text-emerald-600',
        publishDate: 'January 6, 2026',
        readTime: '6 min read',
        featured: true,
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        slug: 'employee-survey-questions',
        title: '50 Employee Survey Questions That Get Honest Answers',
        excerpt: 'Copy-paste ready questions organized by category. No corporate fluff, just questions that work.',
        category: 'Templates',
        categoryColor: 'bg-purple-500/10 text-purple-600',
        publishDate: 'January 6, 2026',
        readTime: '12 min read',
        featured: true,
        gradient: 'from-purple-500 to-indigo-600',
    },
];

// ============================================================================
// FEATURED CARD
// ============================================================================

const FeaturedCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    return (
        <motion.a
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
        >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${post.gradient}`} />
            
            <div className="p-8">
                {/* Category & Time */}
                <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${post.categoryColor}`}>
                        {post.category}
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                    </span>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                    {post.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                    {post.excerpt}
                </p>
                
                {/* Read More */}
                <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.a>
    );
};

// ============================================================================
// REGULAR CARD
// ============================================================================

const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    return (
        <motion.a
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="group block bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
        >
            {/* Category */}
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${post.categoryColor}`}>
                {post.category}
            </span>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-slate-500 mb-4 line-clamp-2">
                {post.excerpt}
            </p>
            
            {/* Meta */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{post.publishDate}</span>
                <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                </span>
            </div>
        </motion.a>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BlogIndex: React.FC = () => {
    const featuredPosts = BLOG_POSTS.filter(p => p.featured);
    const regularPosts = BLOG_POSTS.filter(p => !p.featured);
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <NavHeader />
            
            {/* Hero */}
            <header className="pt-16 md:pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                            <Sparkles size={16} />
                            Insights & Guides
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        The VoteGenerator Blog
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto"
                    >
                        Practical guides on surveys, polls, and getting honest feedback from your team and customers.
                    </motion.p>
                </div>
            </header>
            
            {/* Featured Posts */}
            <section className="max-w-5xl mx-auto px-4 mb-16">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Featured</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {featuredPosts.map((post, i) => (
                        <FeaturedCard key={post.slug} post={post} index={i} />
                    ))}
                </div>
            </section>
            
            {/* All Posts */}
            {regularPosts.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 pb-20">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">More Articles</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post, i) => (
                            <BlogCard key={post.slug} post={post} index={i} />
                        ))}
                    </div>
                </section>
            )}
            
            {/* CTA Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] " />
                
                <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Ready to get better feedback?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-100 mb-8 text-lg"
                    >
                        Create a survey in minutes. No signup required.
                    </motion.p>
                    <motion.a 
                        href="/survey" 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                        <Sparkles size={20} />
                        Create Free Survey
                        <ArrowRight size={20} />
                    </motion.a>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default BlogIndex;
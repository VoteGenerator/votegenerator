// ============================================================================
// BlogIndex.tsx - Blog listing page
// Route: /blog
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search } from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

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
}

const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'is-your-work-survey-anonymous',
        title: 'Is Your Work Survey Actually Anonymous?',
        excerpt: 'What your employer can see, what "confidential" really means, and how to tell the difference.',
        category: 'Employee Surveys',
        categoryColor: 'bg-emerald-100 text-emerald-700',
        publishDate: 'January 6, 2026',
        readTime: '6 min read',
        featured: true,
    },
    {
        slug: 'employee-survey-questions',
        title: '50 Employee Survey Questions That Get Honest Answers',
        excerpt: 'Copy-paste ready questions organized by category. No corporate fluff.',
        category: 'Employee Surveys',
        categoryColor: 'bg-emerald-100 text-emerald-700',
        publishDate: 'January 6, 2026',
        readTime: '12 min read',
        featured: true,
    },
    // Add more posts here as you create them
];

// ============================================================================
// BLOG CARD COMPONENT
// ============================================================================

const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured }) => {
    return (
        <motion.a
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all ${
                featured ? 'md:col-span-2' : ''
            }`}
        >
            <div className="p-6">
                {/* Category */}
                <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                        {post.category}
                    </span>
                </div>
                
                {/* Title */}
                <h3 className={`font-bold text-slate-900 mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
                    {post.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-slate-600 mb-4 line-clamp-2">
                    {post.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{post.publishDate}</span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                    </span>
                </div>
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />
            
            {/* Hero */}
            <header className="pt-16 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            The VoteGenerator Blog
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Practical guides on surveys, polls, and getting honest feedback from your team and customers.
                        </p>
                    </motion.div>
                </div>
            </header>
            
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 mb-12">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                        Featured
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredPosts.map((post, i) => (
                            <BlogCard key={post.slug} post={post} featured={i === 0} />
                        ))}
                    </div>
                </section>
            )}
            
            {/* All Posts */}
            {regularPosts.length > 0 && (
                <section className="max-w-5xl mx-auto px-4 pb-16">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                        All Posts
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>
            )}
            
            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to get better feedback?
                    </h2>
                    <p className="text-indigo-100 mb-8">
                        Create a survey in minutes. No signup required.
                    </p>
                    <a 
                        href="/survey" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                    >
                        Create Free Survey
                        <ArrowRight size={20} />
                    </a>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default BlogIndex;
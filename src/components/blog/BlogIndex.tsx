// ============================================================================
// BlogIndex.tsx - Clean, minimal blog listing
// ============================================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import NavHeader from '../NavHeader';
import PremiumNav from '../PremiumNav';
import Footer from '../Footer';

// ============================================================================
// BLOG POST DATA
// ============================================================================

const BLOG_POSTS = [

    // ── COMPARISONS ─────────────────────────────────────────────────────────
    {
        slug: 'votegenerator-vs-strawpoll',
        title: 'VoteGenerator vs StrawPoll (2026): Which Free Poll Maker Is Better?',
        excerpt: 'Honest comparison of poll types, free tier limits, ranked choice, and data export. Which one wins for your use case?',
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },
    {
        slug: 'votegenerator-vs-surveymonkey',
        title: 'VoteGenerator vs SurveyMonkey: When Free Actually Means Free',
        excerpt: "SurveyMonkey's free tier caps at 25 responses. VoteGenerator allows 100. Full honest comparison of limits, types, and pricing.",
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '7 min',
    },
    {
        slug: 'mentimeter-alternatives-free',
        title: '5 Best Free Mentimeter Alternatives (2026)',
        excerpt: 'VoteGenerator, Slido, AhaSlides, Poll Everywhere, and Kahoot compared — free tier limits, poll types, and best use cases.',
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'free-poll-maker-comparison',
        title: 'Best Free Poll Makers Compared (2026)',
        excerpt: 'Side-by-side comparison of the top free poll tools. Response limits, poll types, and which to use for your situation.',
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'free-survey-maker-tools',
        title: '5 Best Free Survey Maker Tools (2026)',
        excerpt: 'Google Forms, Tally, SurveyMonkey, Microsoft Forms, and VoteGenerator compared. Which is actually free?',
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'free-employee-survey-tools',
        title: '5 Best Free Employee Survey Tools (2026)',
        excerpt: 'Honest comparison of free tools for employee feedback — including what the free tier actually lets you do.',
        category: 'Comparisons',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },

    // ── TEMPLATES ───────────────────────────────────────────────────────────
    {
        slug: 'free-poll-templates',
        title: '30 Free Poll Templates — Use Instantly, No Signup',
        excerpt: 'Team decisions, events, feedback, icebreakers, classrooms, and community polls. Search, copy, and launch in seconds.',
        category: 'Templates',
        date: 'Apr 18, 2026',
        readTime: '5 min',
    },
    {
        slug: 'employee-survey-templates',
        title: '10 Employee Survey Templates Ready to Launch',
        excerpt: 'Engagement, satisfaction, onboarding, exit interview, pulse check, manager feedback, remote work, DEI, benefits, and team culture.',
        category: 'Templates',
        date: 'Apr 18, 2026',
        readTime: '9 min',
    },
    {
        slug: 'employee-survey-questions',
        title: '50 Employee Survey Questions That Get Honest Answers',
        excerpt: 'Copy-paste ready. Organised by category. Engagement, satisfaction, culture, management, and more.',
        category: 'Templates',
        date: 'Apr 18, 2026',
        readTime: '12 min',
    },
    {
        slug: 'this-or-that-questions',
        title: '100+ This or That Questions for Polls, Icebreakers & Games',
        excerpt: '7 categories: fun, food, travel, work, pop culture, deep, and seasonal. Search any question and turn it into a free poll.',
        category: 'Templates',
        date: 'Apr 18, 2026',
        readTime: '5 min',
    },

    // ── EMPLOYEE SURVEYS ────────────────────────────────────────────────────
    {
        slug: 'employee-engagement-survey-guide',
        title: 'Employee Engagement Survey: Complete Guide for 2026',
        excerpt: 'What engagement actually measures, the right questions to ask, benchmarks, and how to act on results.',
        category: 'Employee Surveys',
        date: 'Apr 18, 2026',
        readTime: '10 min',
    },
    {
        slug: 'how-to-survey-employees',
        title: 'How to Survey Employees: A Complete Guide',
        excerpt: 'Survey design, distribution, anonymity, response rates, and what to do with the data. Everything in one place.',
        category: 'Employee Surveys',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'employee-satisfaction-survey',
        title: 'Employee Satisfaction Survey: Questions, Templates & Best Practices',
        excerpt: 'How satisfaction differs from engagement, the right questions to ask, and how to actually improve scores.',
        category: 'Employee Surveys',
        date: 'Apr 18, 2026',
        readTime: '9 min',
    },
    {
        slug: 'are-work-surveys-anonymous',
        title: 'Is Your Work Survey Actually Anonymous?',
        excerpt: "What your employer can see, what \"confidential\" really means, and how to tell if anonymity is genuine.",
        category: 'Employee Surveys',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },

    // ── SURVEYS ─────────────────────────────────────────────────────────────
    {
        slug: 'customer-satisfaction-survey',
        title: 'Customer Satisfaction Survey: 25 Questions + Free Templates',
        excerpt: 'CSAT, NPS, and CES compared. 25 copy-ready questions organised by survey goal, with benchmarks.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '10 min',
    },
    {
        slug: 'nps-survey-guide',
        title: 'NPS Survey Guide: How to Measure and Improve Customer Loyalty',
        excerpt: 'How NPS works, how to calculate it, what scores mean, industry benchmarks, and 15 follow-up questions.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '9 min',
    },
    {
        slug: 'how-to-survey-customers',
        title: 'How to Survey Customers: Channels, Timing & Best Questions',
        excerpt: 'Which channel to use for each survey type, when to send for highest response rates, and questions that actually work.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'rating-scale-survey',
        title: 'Rating Scale Survey: Types, Mistakes & Free Templates',
        excerpt: 'Likert, numeric, star, and emoji scales compared with live demos. Includes a quick picker and free templates.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '8 min',
    },
    {
        slug: 'how-to-write-survey-questions',
        title: 'How to Write Survey Questions That Get Honest Answers',
        excerpt: '20 ready-to-copy questions, common mistakes to avoid, and the principles that separate good data from bad.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '9 min',
    },
    {
        slug: 'how-to-create-a-survey',
        title: 'How to Create a Survey Online (Step-by-Step)',
        excerpt: 'From question writing to distribution to analysis — the full process, with free templates for every survey type.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },
    {
        slug: 'quick-survey-guide',
        title: 'How to Create a Quick Survey: Fast, High-Quality Data',
        excerpt: 'The 5-question rule, scale choices, timing, and how to get a 60%+ response rate on short surveys.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },
    {
        slug: 'anonymous-survey-guide',
        title: 'Anonymous Survey Guide: How Anonymity Works (And When It Doesn\'t)',
        excerpt: 'The difference between anonymous and confidential, how to design for honest responses, and tools compared.',
        category: 'Surveys',
        date: 'Apr 18, 2026',
        readTime: '7 min',
    },

    // ── POLLS ───────────────────────────────────────────────────────────────
    {
        slug: 'how-to-create-a-poll',
        title: 'How to Create a Poll Online in Under 60 Seconds',
        excerpt: 'Step-by-step guide to creating and sharing a poll with VoteGenerator. No signup required from anyone.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '5 min',
    },
    {
        slug: 'poll-types-guide',
        title: 'All 8 Poll Types Explained: When to Use Each',
        excerpt: 'Multiple choice, ranked choice, meeting poll, RSVP, rating scale, visual, This or That, and survey — compared.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '7 min',
    },
    {
        slug: 'ranked-choice-voting',
        title: 'Ranked Choice Voting: How It Works and When to Use It',
        excerpt: 'How instant runoff works, why it finds better consensus than plurality voting, and when to use it.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '7 min',
    },
    {
        slug: 'team-meeting-poll',
        title: 'How to Run a Poll for Team Meetings',
        excerpt: 'Pre-meeting scheduling, live decision polls, and async voting — the complete guide for team leaders.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },
    {
        slug: 'visual-poll-guide',
        title: 'Visual Poll: How to Use Images in Your Polls',
        excerpt: 'When image polls outperform text polls, how to build one, and best practices for design decisions.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '6 min',
    },
    {
        slug: 'rsvp-poll-guide',
        title: 'RSVP Poll: The Easiest Way to Collect Event Responses',
        excerpt: 'One shareable link. Guests click Yes, No, or Maybe. Real-time headcount with no signup from anyone.',
        category: 'Polls',
        date: 'Apr 18, 2026',
        readTime: '5 min',
    },

    // ── PLATFORM GUIDES ─────────────────────────────────────────────────────
    {
        slug: 'twitch-poll-guide',
        title: 'How to Run a Poll on Twitch: Built-In vs External Tools',
        excerpt: "Twitch's native polls cap at 5 options and 10 minutes. Here's when to use external tools and how.",
        category: 'Platform Guides',
        date: 'Apr 18, 2026',
        readTime: '7 min',
    },
    {
        slug: 'reddit-poll-alternative',
        title: 'Reddit Poll Alternative: Better Polls for Reddit Communities',
        excerpt: "Reddit polls cap at 6 options and hide results until you vote. Here's what external tools do better.",
        category: 'Platform Guides',
        date: 'Apr 18, 2026',
        readTime: '6 min',
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
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}
            
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
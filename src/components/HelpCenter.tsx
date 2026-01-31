// ============================================================================
// HelpCenterComplete.tsx - Comprehensive Help Center
// Route: /help
// 
// Features:
// - Full-text search across all articles
// - Interactive step-by-step tutorials with animations
// - Tier-specific content badges (Free/Pro/Business)
// - Expandable FAQ sections
// - Video tutorial placeholders
// - Troubleshooting guides
// - Contact/support options
// - Mobile-responsive design
// - AEO/SEO optimized with FAQ schema
// ============================================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, BookOpen, Zap, Share2, BarChart3, Image, HelpCircle,
    ChevronRight, ChevronDown, Mail, ExternalLink, CheckSquare,
    ListOrdered, Calendar, Star, Users, GitCompare, ClipboardList,
    SlidersHorizontal, Shield, CreditCard, Trash2, Lock, Key,
    AlertTriangle, CheckCircle, XCircle, Play, Clock, ArrowRight,
    MessageCircle, Sparkles, Crown, Settings, Download, Eye,
    MousePointer, Link2, QrCode, Code, Palette, Bell, Filter,
    PieChart, TrendingUp, Globe, Smartphone, Monitor, RefreshCw,
    Copy, Check, X, Lightbulb, Target, Rocket, FileText, 
    LayoutDashboard, UserCheck, Timer, Ban, Volume2, VolumeX
} from 'lucide-react';
import NavHeader from './NavHeader';
import Footer from './Footer';

// ============================================================================
// Types
// ============================================================================
interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    tier: 'free' | 'pro' | 'business' | 'all';
    tags: string[];
    steps?: TutorialStep[];
    videoUrl?: string;
    relatedArticles?: string[];
}

interface TutorialStep {
    title: string;
    description: string;
    tip?: string;
}

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

// ============================================================================
// FAQ Schema for SEO/AEO
// ============================================================================
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How do I create a poll on VoteGenerator?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Creating a poll takes under 30 seconds: 1) Visit votegenerator.com/create, 2) Choose a poll type (Multiple Choice, Ranked, Rating, Visual, etc.), 3) Add your question and options, 4) Click Create Poll. You'll get a shareable link immediately. No signup required for free tier."
            }
        },
        {
            "@type": "Question",
            "name": "Is VoteGenerator free to use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! VoteGenerator offers a generous free tier with all 8 poll types, up to 100 responses per poll, and 3 active polls. Pro ($19/year) adds 10,000 responses and 25 polls. Business ($49/year) offers 100,000 responses and unlimited polls with advanced features like white-label embeds and logo upload."
            }
        },
        {
            "@type": "Question",
            "name": "How do I recover access to my polls?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Visit votegenerator.com/recover and enter the email you saved your polls to. We'll send a 6-digit verification code, and once verified, all your polls will be restored. This works for both free users who saved their email and paid users."
            }
        },
        {
            "@type": "Question",
            "name": "Can I edit my poll after publishing?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can edit poll settings, title, description, close/reopen voting, pause polls, and change themes from your Poll Dashboard. However, to maintain vote integrity, you cannot change the question or options after votes have been cast."
            }
        },
        {
            "@type": "Question",
            "name": "Is my poll data private?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. VoteGenerator is privacy-first and GDPR compliant. We don't require signups, don't sell data, and use anonymous voting by default. IP addresses are hashed for duplicate detection only, not stored. You can delete all your data anytime at votegenerator.com/account/delete-request."
            }
        },
        {
            "@type": "Question",
            "name": "What's the difference between Pro and Business plans?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pro ($19/year): 10,000 responses, 25 active polls, CSV export, custom themes, email notifications, no ads. Business ($49/year): 100,000 responses, unlimited polls, white-label embedding, logo upload, hourly heatmap analytics, cross-tab analysis, priority support."
            }
        },
        {
            "@type": "Question",
            "name": "How do I set up email notifications for votes?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pro and Business users can enable notifications in Poll Dashboard → Notify tab. Options include: notification for each new vote, milestone alerts (10, 50, 100+ votes), daily digest summaries, and alerts when polls close or reach response limits."
            }
        },
        {
            "@type": "Question",
            "name": "Can I create surveys with multiple questions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Select 'Survey' as your poll type to access the Survey Builder with 15+ question types including multiple choice, rating scales, text inputs, NPS, matrix grids, and more. Free tier allows up to 10 questions per survey."
            }
        },
        {
            "@type": "Question",
            "name": "How do I embed a poll on my website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Go to Poll Dashboard → Share tab → 'Get Embed Code'. Copy the iframe HTML and paste it into your website's HTML editor. Works with WordPress, Squarespace, Wix, and any platform that accepts HTML. Business users get white-label embeds without VoteGenerator branding."
            }
        },
        {
            "@type": "Question",
            "name": "How do I protect my admin dashboard with a PIN?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pro and Business users can enable PIN protection: Go to Admin Dashboard → Settings → PIN Protection → Set PIN. Enter a 6-digit code. Anyone accessing your admin links will need to enter this PIN first, adding an extra layer of security."
            }
        }
    ]
};

// ============================================================================
// Help Articles Database
// ============================================================================
const articles: Article[] = [
    // ========== GETTING STARTED ==========
    {
        id: 'create-first-poll',
        title: 'Create Your First Poll in 30 Seconds',
        summary: 'Step-by-step guide to creating and sharing your first poll',
        category: 'getting-started',
        tier: 'all',
        tags: ['create', 'poll', 'start', 'beginner', 'new', 'first'],
        content: `Creating a poll on VoteGenerator is fast and free. No account required.`,
        steps: [
            {
                title: 'Go to Create Page',
                description: 'Visit votegenerator.com/create or click "Create Poll" from the homepage.',
                tip: 'Bookmark this page for quick access!'
            },
            {
                title: 'Choose Poll Type',
                description: 'Select from 8 poll types: Multiple Choice, Ranked, Rating, Visual, Meeting, RSVP, This or That, or Survey.',
                tip: 'Not sure which to pick? Multiple Choice works for most use cases.'
            },
            {
                title: 'Add Your Question',
                description: 'Type your question in the main field. Be clear and specific.',
                tip: 'Good: "What should we name our mascot?" Bad: "Name?"'
            },
            {
                title: 'Add Options',
                description: 'Enter 2-10 answer options. Click "+ Add Option" for more.',
                tip: 'Use the bulk add button to paste multiple options at once.'
            },
            {
                title: 'Create & Share',
                description: 'Click "Create Poll" to generate your shareable link instantly.',
                tip: 'Save your Admin Link! You need it to view results and manage your poll.'
            }
        ],
        relatedArticles: ['choose-poll-type', 'share-poll', 'save-admin-link']
    },
    {
        id: 'choose-poll-type',
        title: 'How to Choose the Right Poll Type',
        summary: 'Guide to selecting the best poll format for your needs',
        category: 'getting-started',
        tier: 'all',
        tags: ['poll type', 'choose', 'select', 'format', 'decision'],
        content: `VoteGenerator offers 8 different poll types, each designed for specific use cases.

**Multiple Choice** - Best for simple decisions with clear options
• "What should we have for lunch?"
• "Which logo do you prefer?"

**Ranked Choice** - When you need to understand preferences in order
• "Rank these features by importance"
• "What's your favorite movie franchise?"

**Rating Scale** - For measuring satisfaction or agreement (1-5 stars)
• "How satisfied are you with our service?"
• "Rate these product ideas"

**Visual/Image Poll** - When options are visual (Pro/Business)
• Logo testing
• Design feedback
• Thumbnail A/B tests

**Meeting Poll** - Find the best time for everyone
• Schedule team meetings
• Plan events

**RSVP** - Track attendance with Yes/No/Maybe
• Party invitations
• Event registration

**This or That** - Compare options head-to-head
• A/B testing
• Tournament brackets

**Survey** - Multiple questions in one form
• Customer feedback
• Research studies`,
        relatedArticles: ['create-first-poll', 'visual-polls', 'surveys']
    },
    {
        id: 'save-admin-link',
        title: 'How to Save Your Admin Link (Important!)',
        summary: 'Never lose access to your polls again',
        category: 'getting-started',
        tier: 'all',
        tags: ['admin', 'link', 'save', 'access', 'recover', 'bookmark', 'email'],
        content: `Your Admin Link is your key to managing polls and viewing results. Here's how to never lose it.`,
        steps: [
            {
                title: 'Save to Email (Recommended)',
                description: 'After creating a poll, click "Save to Email" and verify with a 6-digit code. You can then recover all your polls from any device.',
                tip: 'This is the most secure method - works even if you clear your browser.'
            },
            {
                title: 'Copy the Admin Link',
                description: 'The amber "Admin Link" shown after poll creation is your access key. Copy it somewhere safe.',
                tip: 'Store it in a note app, password manager, or email it to yourself.'
            },
            {
                title: 'Bookmark Your Dashboard',
                description: 'Your Admin Dashboard at /admin shows all your polls. Bookmark this page.',
                tip: 'Works as long as you use the same browser and don\'t clear cookies.'
            }
        ],
        relatedArticles: ['recover-access', 'admin-dashboard']
    },
    
    // ========== SHARING ==========
    {
        id: 'share-poll',
        title: 'Share Your Poll: All Methods Explained',
        summary: 'Links, QR codes, embeds, and social sharing options',
        category: 'sharing',
        tier: 'all',
        tags: ['share', 'link', 'qr', 'embed', 'social', 'twitter', 'facebook'],
        content: `After creating a poll, you have multiple ways to share it with voters.`,
        steps: [
            {
                title: 'Copy Voting Link',
                description: 'The green "Voting Link" is what you share with voters. Click to copy instantly.',
                tip: 'This is the link voters use - it\'s different from your Admin Link!'
            },
            {
                title: 'Generate QR Code',
                description: 'Click the QR icon to generate a scannable code. Great for printed materials or presentations.',
                tip: 'Pro tip: Download as PNG for high-quality printing.'
            },
            {
                title: 'Social Media Sharing',
                description: 'One-click sharing to Twitter, Facebook, LinkedIn, WhatsApp, and more.',
                tip: 'The preview card shows your poll title automatically.'
            },
            {
                title: 'Email Sharing',
                description: 'Click "Email" to open your email app with a pre-filled message.',
                tip: 'Edit the subject line and message to match your audience.'
            },
            {
                title: 'Embed on Website',
                description: 'Copy the embed code to add your poll directly to any website or blog.',
                tip: 'Business users get white-label embeds with custom branding.'
            }
        ],
        relatedArticles: ['embed-poll', 'share-cards']
    },
    {
        id: 'embed-poll',
        title: 'Embed Polls on Your Website',
        summary: 'Add interactive polls to any website with embed code',
        category: 'sharing',
        tier: 'all',
        tags: ['embed', 'website', 'iframe', 'blog', 'wordpress', 'html'],
        content: `Embedding lets visitors vote without leaving your site.

**How to Embed:**
1. Go to your Poll Dashboard → Share tab
2. Click "Get Embed Code"
3. Copy the iframe HTML
4. Paste into your website's HTML editor

**Embed Options:**
• Responsive (auto-adjusts to container)
• Fixed size (you set width/height)
• White-label (Business tier - removes VoteGenerator branding)

**Platform-Specific Tips:**
• **WordPress**: Use the Custom HTML block
• **Squarespace**: Use a Code block
• **Wix**: Use the HTML iframe element
• **Notion**: Embed blocks work, but may need direct link`,
        relatedArticles: ['share-poll', 'white-label']
    },
    {
        id: 'share-cards',
        title: 'Create Beautiful Share Cards',
        summary: 'Generate branded images for social media',
        category: 'sharing',
        tier: 'pro',
        tags: ['share', 'cards', 'image', 'social', 'branded', 'download'],
        content: `Share Cards are eye-catching images you can post on social media to promote your poll.

**Available Designs (Pro/Business):**
• Neon Glow - Vibrant, attention-grabbing
• Glassmorphism - Modern, frosted glass look
• Vibrant Gradient - Bold, colorful backgrounds
• Clean Minimal - Simple, professional
• Retro Wave - 80s-inspired aesthetic
• Dark Premium - Sophisticated, dark mode

**How to Create:**
1. Go to Poll Dashboard → Share tab
2. Click "Create Share Card"
3. Choose a design and format (Square/Story/Wide)
4. Preview and download as PNG

**Best Practices:**
• Square (1:1) for Instagram/Facebook feed
• Story (9:16) for Instagram/TikTok stories
• Wide (16:9) for Twitter/LinkedIn`,
        relatedArticles: ['share-poll', 'custom-themes']
    },
    
    // ========== RESULTS & ANALYTICS ==========
    {
        id: 'view-results',
        title: 'Understanding Your Poll Results',
        summary: 'How to read charts, stats, and voter data',
        category: 'results',
        tier: 'all',
        tags: ['results', 'analytics', 'charts', 'data', 'votes', 'statistics'],
        content: `Your Poll Dashboard shows real-time results with beautiful visualizations.

**Quick Stats Bar:**
• Total Responses - How many people voted
• Unique Voters - Deduplicated by device/IP
• Completion Rate - % who finished voting
• Average Time - How long voters spend

**Results Visualization:**
• **Bar Chart** - See vote distribution clearly
• **Pie Chart** - Understand proportions
• **Trend Line** - Track votes over time (Pro+)

**For Ranked Choice:**
• First Choice Votes - Who won first place
• Weighted Score - Accounts for all rankings
• Round-by-round results

**For Rating Scale:**
• Average Rating - Mean score
• Distribution - How many gave each rating
• NPS Score (for 0-10 scales)`,
        relatedArticles: ['export-data', 'analytics-dashboard']
    },
    {
        id: 'export-data',
        title: 'Export Poll Data to CSV/Excel',
        summary: 'Download your results for analysis',
        category: 'results',
        tier: 'pro',
        tags: ['export', 'csv', 'excel', 'download', 'data', 'spreadsheet'],
        content: `Pro and Business users can export full poll data for external analysis.

**What's Included in Export:**
• All responses with timestamps
• Vote choices for each option
• Device type and country (anonymized)
• Custom field responses (if collected)

**How to Export:**
1. Go to Poll Dashboard → Analytics tab
2. Click "Export Data"
3. Choose format: CSV or Excel
4. Download starts automatically

**Filtered Exports (Business):**
Export only specific segments:
• By date range
• By device type
• By country
• By response to a specific question

**Privacy Note:**
Exports never include personally identifiable information unless voters opted to share their name.`,
        relatedArticles: ['view-results', 'analytics-dashboard', 'filtered-exports']
    },
    {
        id: 'analytics-dashboard',
        title: 'Advanced Analytics Dashboard',
        summary: 'Deep insights into voter behavior',
        category: 'results',
        tier: 'pro',
        tags: ['analytics', 'dashboard', 'insights', 'trends', 'behavior'],
        content: `Pro and Business plans include advanced analytics for deeper insights.

**Available Analytics:**

**Response Timeline** (Pro+)
See when votes come in over time. Identify peak voting periods.

**Geographic Distribution** (Pro+)
Map showing where your voters are located (country-level, anonymized).

**Device Breakdown** (Pro+)
Mobile vs Desktop vs Tablet usage.

**Hourly Heatmap** (Business)
See which hours and days get the most votes.

**Cross-Tab Analysis** (Business)
Compare how different segments voted. Example: "How did mobile users vote vs desktop?"

**How to Access:**
Poll Dashboard → Analytics tab`,
        relatedArticles: ['view-results', 'export-data']
    },
    
    // ========== ACCOUNT & ACCESS ==========
    {
        id: 'recover-access',
        title: 'Recover Access to Your Polls',
        summary: 'Lost your admin link? Here\'s how to get it back',
        category: 'account',
        tier: 'all',
        tags: ['recover', 'access', 'lost', 'link', 'admin', 'forgot'],
        content: `Lost access to your polls? Don't panic. Here's how to recover them.`,
        steps: [
            {
                title: 'Go to Recovery Page',
                description: 'Visit votegenerator.com/recover',
                tip: 'Works for both free and paid users who saved their email.'
            },
            {
                title: 'Enter Your Email',
                description: 'Use the email you saved your polls to, or your payment email for paid plans.',
                tip: 'Check spam folder if you don\'t see our email.'
            },
            {
                title: 'Verify with Code',
                description: 'We\'ll send a 6-digit verification code to prove it\'s you.',
                tip: 'Code expires in 24 hours.'
            },
            {
                title: 'Access Restored',
                description: 'All your polls will be restored to your browser and you\'ll get admin links.',
                tip: 'This time, save them to email permanently!'
            }
        ],
        relatedArticles: ['save-admin-link', 'admin-dashboard']
    },
    {
        id: 'admin-dashboard',
        title: 'Using Your Admin Dashboard',
        summary: 'Manage all your polls from one place',
        category: 'account',
        tier: 'all',
        tags: ['admin', 'dashboard', 'manage', 'polls', 'settings'],
        content: `The Admin Dashboard is your control center for all polls.

**Access Your Dashboard:**
• Visit votegenerator.com/admin
• Or click "Dashboard" after creating a poll

**What You Can Do:**
• View all your polls in one place
• Check response counts at a glance
• Open individual poll dashboards
• Create new polls
• Duplicate existing polls
• Delete polls you no longer need

**Poll Cards Show:**
• Poll title and type
• Response count
• Status (Live/Paused/Draft/Closed)
• Created date
• Quick action buttons

**Dashboard Features by Tier:**
• **Free**: 3 active polls, basic stats
• **Pro**: 25 polls, usage meter, exports
• **Business**: Unlimited, priority badge, all features`,
        relatedArticles: ['poll-dashboard', 'poll-limits']
    },
    {
        id: 'poll-dashboard',
        title: 'Individual Poll Dashboard Guide',
        summary: 'Deep dive into managing a single poll',
        category: 'account',
        tier: 'all',
        tags: ['poll', 'dashboard', 'manage', 'settings', 'responses'],
        content: `Each poll has its own dashboard with detailed controls and insights.

**Dashboard Tabs:**

**📊 Responses Tab**
• Real-time vote updates
• Visual charts and graphs
• Individual response details (if names collected)

**🔗 Share Tab**
• Voting link with copy button
• QR code generator
• Social sharing buttons
• Embed code
• Share Cards (Pro+)

**⚙️ Settings Tab**
• Edit poll title and description
• Close/reopen voting
• Pause/resume poll
• Set expiration date
• Voting rules (allow multiple votes, etc.)
• Notification preferences

**📈 Analytics Tab** (Pro+)
• Response timeline
• Geographic data
• Device breakdown
• Export options

**💾 Downloads Tab** (Pro+)
• Export to CSV/Excel
• Download charts as PNG
• Print-friendly view`,
        relatedArticles: ['admin-dashboard', 'view-results', 'poll-settings']
    },
    
    // ========== PLANS & BILLING ==========
    {
        id: 'plan-comparison',
        title: 'Free vs Pro vs Business: What\'s Included',
        summary: 'Compare all plans and features',
        category: 'billing',
        tier: 'all',
        tags: ['plans', 'pricing', 'free', 'pro', 'business', 'compare', 'features'],
        content: `Choose the plan that fits your needs.

**🆓 FREE - $0 forever**
✓ All 8 poll types
✓ Up to 100 responses per poll
✓ 3 active polls at a time
✓ Basic results & charts
✓ QR codes & social sharing
✓ 30-day poll duration
✗ Ads shown to voters
✗ VoteGenerator branding

**⭐ PRO - $19/year**
Everything in Free, plus:
✓ 10,000 responses per poll
✓ 25 active polls
✓ 90-day poll duration
✓ CSV/Excel export
✓ Custom themes & colors
✓ Share Cards
✓ Advanced analytics
✓ No ads
✓ Email support

**👑 BUSINESS - $49/year**
Everything in Pro, plus:
✓ 100,000 responses per poll
✓ Unlimited active polls
✓ 365-day poll duration
✓ White-label embeds
✓ Upload your logo
✓ Hourly heatmap analytics
✓ Cross-tab analysis
✓ Filtered exports
✓ Post-vote redirect URL
✓ Priority support`,
        relatedArticles: ['upgrade-plan', 'poll-limits']
    },
    {
        id: 'upgrade-plan',
        title: 'How to Upgrade Your Plan',
        summary: 'Step-by-step upgrade guide',
        category: 'billing',
        tier: 'all',
        tags: ['upgrade', 'plan', 'pro', 'business', 'payment', 'stripe'],
        content: `Upgrading unlocks more responses, features, and removes ads.`,
        steps: [
            {
                title: 'Go to Pricing Page',
                description: 'Visit votegenerator.com/pricing or click "Upgrade" in your dashboard.',
                tip: 'Compare all features before choosing.'
            },
            {
                title: 'Choose Your Plan',
                description: 'Select Pro ($19/year) or Business ($49/year).',
                tip: 'Business is best if you need unlimited polls or white-label.'
            },
            {
                title: 'Complete Payment',
                description: 'Secure checkout via Stripe. We accept all major credit cards.',
                tip: 'You\'ll get a receipt via email.'
            },
            {
                title: 'Instant Activation',
                description: 'Your plan activates immediately. All existing polls are upgraded too!',
                tip: 'Your payment email becomes your recovery email automatically.'
            }
        ],
        relatedArticles: ['plan-comparison', 'manage-subscription', 'cancel-subscription']
    },
    {
        id: 'manage-subscription',
        title: 'Manage Your Subscription',
        summary: 'Update payment, change plan, view invoices',
        category: 'billing',
        tier: 'pro',
        tags: ['subscription', 'payment', 'manage', 'invoice', 'billing'],
        content: `Pro and Business subscribers can manage their account anytime.

**Access Subscription Management:**
1. Go to your Admin Dashboard
2. Click the Settings (gear) icon
3. Select "Manage Subscription"

**What You Can Do:**
• Update payment method
• View past invoices
• Download receipts
• Change plan (upgrade/downgrade)
• Update billing email
• Cancel subscription

**Note:** We use Stripe for secure billing. You may be redirected to Stripe's customer portal for some actions.`,
        relatedArticles: ['upgrade-plan', 'cancel-subscription']
    },
    {
        id: 'cancel-subscription',
        title: 'How to Cancel Your Subscription',
        summary: 'What happens when you cancel',
        category: 'billing',
        tier: 'pro',
        tags: ['cancel', 'subscription', 'refund', 'downgrade'],
        content: `You can cancel anytime. Here's what to expect.

**How to Cancel:**
1. Go to Admin Dashboard → Settings
2. Click "Manage Subscription"
3. Select "Cancel Subscription"
4. Confirm cancellation

**What Happens After Cancellation:**
• You keep access until your billing period ends
• Polls remain accessible but revert to free limits
• Polls over the free limit (3) become paused
• You choose which polls stay active
• Your data is never deleted

**Refund Policy:**
• Cancel within 7 days of purchase for full refund
• After 7 days, you keep access until period ends
• Contact support@votegenerator.com for refund requests`,
        relatedArticles: ['manage-subscription', 'plan-comparison']
    },
    
    // ========== PRIVACY & DATA ==========
    {
        id: 'privacy-overview',
        title: 'Privacy & Data: How We Protect You',
        summary: 'Our commitment to privacy and GDPR compliance',
        category: 'privacy',
        tier: 'all',
        tags: ['privacy', 'data', 'gdpr', 'security', 'anonymous'],
        content: `VoteGenerator is built privacy-first. Here's what that means.

**Our Privacy Principles:**
• No account required for free tier
• Anonymous voting by default
• We never sell your data
• GDPR and CCPA compliant
• Data stored securely in the EU/US

**What We Collect:**
• Poll questions and options you create
• Vote responses (anonymized by default)
• Hashed IP addresses (for duplicate detection only)
• Basic device/country info (anonymized)

**What We DON'T Collect:**
• Email addresses (unless you choose to save one)
• Names or personal info (unless voters opt-in)
• Browsing history
• Third-party tracking

**Your Rights:**
• Access your data anytime
• Export all your data
• Delete everything with one click
• Request data portability`,
        relatedArticles: ['delete-data', 'anonymous-voting', 'data-retention']
    },
    {
        id: 'delete-data',
        title: 'Delete Your Data (GDPR Right to Erasure)',
        summary: 'How to permanently delete all your data',
        category: 'privacy',
        tier: 'all',
        tags: ['delete', 'data', 'gdpr', 'erasure', 'remove', 'privacy'],
        content: `You have the right to delete all your data. Here's how.`,
        steps: [
            {
                title: 'Go to Data Deletion Page',
                description: 'Visit votegenerator.com/account/delete-request',
                tip: 'This is also linked in our footer under "Delete My Data".'
            },
            {
                title: 'Enter Your Email',
                description: 'Use the email associated with your polls or payment.',
                tip: 'We need to verify it\'s really you.'
            },
            {
                title: 'Verify with Code',
                description: 'We\'ll send a verification code to confirm the request.',
                tip: 'This prevents accidental or malicious deletions.'
            },
            {
                title: 'Confirm Deletion',
                description: 'Review what will be deleted and confirm.',
                tip: '⚠️ This action cannot be undone!'
            }
        ],
        relatedArticles: ['privacy-overview', 'data-retention']
    },
    {
        id: 'data-retention',
        title: 'How Long We Keep Your Data',
        summary: 'Data retention periods explained',
        category: 'privacy',
        tier: 'all',
        tags: ['retention', 'data', 'storage', 'duration', 'gdpr'],
        content: `We only keep data as long as necessary.

**Active Polls:**
• Free: 30 days of inactivity → paused
• Pro: 90 days poll duration
• Business: 365 days poll duration

**Inactive Data:**
• 12 months of no activity → marked for deletion
• 30-day warning period before deletion
• You can reactivate anytime during warning period

**After Deletion:**
• Poll data is permanently removed
• Anonymized aggregate stats may be retained
• Backups purged within 30 days

**Paid Subscriptions:**
• Billing records kept 7 years (legal requirement)
• Poll data follows same retention policy
• Cancel anytime, data stays until retention period`,
        relatedArticles: ['delete-data', 'privacy-overview']
    },
    
    // ========== POLL SETTINGS & CONTROLS ==========
    {
        id: 'poll-settings',
        title: 'Poll Settings: Complete Guide',
        summary: 'Every setting explained - voting rules, expiration, visibility',
        category: 'poll-management',
        tier: 'all',
        tags: ['settings', 'options', 'configure', 'rules', 'expiration', 'visibility'],
        content: `Your Poll Dashboard Settings tab gives you full control over how your poll works.

**Voting Rules**

**Allow Multiple Votes**
• OFF (default): One vote per person (uses cookies + IP)
• ON: Anyone can vote again from the same device
→ Best for: Casual polls, ongoing feedback

**Require Voter Name** (Pro+)
• Collect names with each vote
• Shows who voted for what in results
→ Best for: Team decisions, accountability needed

**Allow Comments** (Pro+)
• Voters can leave text feedback with their vote
• Great for qualitative insights
→ Best for: Feedback collection, suggestions

**Visibility Settings**

**Public Results**
• OFF: Only you (admin) see results
• ON: Anyone with results link can view
→ Tip: Share different links for voting vs. viewing results

**Hide Results Until Closed** 
• Voters can't see results while voting
• Prevents bandwagon effect
→ Best for: Unbiased voting, competitions

**Timing & Expiration**

**Close Poll On**
• Set a specific end date/time
• Poll auto-closes when reached
• Voters see countdown

**Poll Duration by Tier:**
• Free: 30 days max
• Pro: 90 days
• Business: 365 days

**Manual Controls**

**Pause Poll**
• Temporarily stop voting
• Existing votes preserved
• Resume anytime

**Close Poll**
• Permanently end voting
• Can reopen if needed (Undo Close)
• Results finalized`,
        relatedArticles: ['voting-rules', 'close-poll', 'pause-poll']
    },
    {
        id: 'pin-protection',
        title: 'Protect Your Admin Link with a PIN',
        summary: 'Add an extra layer of security to your poll management',
        category: 'account',
        tier: 'pro',
        tags: ['PIN', 'security', 'protect', 'password', 'admin', 'lock'],
        content: `PIN protection adds a 6-digit code requirement before anyone can access your Poll Dashboard.

**Why Use PIN Protection?**
• Shared computer or device
• Extra security for sensitive polls
• Prevent accidental changes by others
• Peace of mind when sharing admin links

**How to Set Up:**`,
        steps: [
            {
                title: 'Open Admin Dashboard',
                description: 'Go to your Admin Dashboard and click the Settings (gear) icon.',
                tip: 'Look for the shield icon next to your account settings.'
            },
            {
                title: 'Enable PIN Protection',
                description: 'Find "PIN Protection" and click "Set PIN".',
                tip: 'This is a Pro/Business feature.'
            },
            {
                title: 'Enter 6-Digit PIN',
                description: 'Choose a memorable 6-digit number. Confirm it.',
                tip: 'Avoid obvious PINs like 123456 or your birthday.'
            },
            {
                title: 'PIN Now Active',
                description: 'Anyone accessing your admin links will need this PIN.',
                tip: 'You can change or remove the PIN anytime in settings.'
            }
        ],
        relatedArticles: ['save-admin-link', 'admin-dashboard']
    },
    {
        id: 'notifications-setup',
        title: 'Set Up Email Notifications',
        summary: 'Get notified when people vote on your polls',
        category: 'poll-management',
        tier: 'pro',
        tags: ['notifications', 'email', 'alerts', 'milestones', 'updates'],
        content: `Never miss a vote! Set up email notifications to stay informed about your poll activity.

**Notification Types:**

**📊 Vote Milestones** (Pro+)
Get notified when you hit key numbers:
• 10, 25, 50, 100, 250, 500, 1000+ votes
• Great for tracking progress
• Celebrate milestones!

**📬 Each New Response** (Pro+)
• Email for every single vote
• Best for low-volume, important polls
• Can be overwhelming for viral polls!

**📅 Daily Digest** (Pro+)
• Summary email once per day
• Vote count, new responses, trends
• Perfect for ongoing polls

**🔔 Poll Events:**
• Poll Closed - when voting ends
• Limit Reached - when you hit response cap
• New Comment - when voters leave feedback

**How to Enable:**
1. Open your Poll Dashboard
2. Go to the Notify tab
3. Add and verify your email
4. Toggle on desired notifications

**Pro Tip:** Start with milestones, add "each response" only for critical polls.`,
        relatedArticles: ['poll-dashboard', 'view-results']
    },
    {
        id: 'custom-themes',
        title: 'Customize Your Poll Appearance',
        summary: '15 themes and custom colors to match your brand',
        category: 'poll-management',
        tier: 'pro',
        tags: ['themes', 'colors', 'customize', 'brand', 'design', 'appearance'],
        content: `Make your polls visually stunning with custom themes and colors.

**Available Themes (12 presets):**
• Default - Clean indigo/purple
• Ocean - Cyan/teal vibes
• Sunset - Warm orange/amber
• Forest - Fresh green/emerald
• Berry - Bold pink/rose
• Midnight - Deep blue/indigo
• Coral - Vibrant rose/pink
• Lavender - Soft violet/purple
• Monochrome - Sleek gray/slate
• Nature - Earthy emerald/lime
• Royal - Rich violet/purple
• Autumn - Warm orange/yellow

**Custom Colors (Pro/Business):**
Go beyond presets with your exact brand colors:
• Primary color picker
• Secondary color picker
• Live preview as you adjust

**How to Apply:**
1. Poll Dashboard → Settings tab
2. Scroll to "Theme & Appearance"
3. Select preset OR click "Custom"
4. Use color picker for exact colors
5. Preview updates in real-time
6. Save changes

**Business Bonus:** Upload your logo to appear on the voting page!`,
        relatedArticles: ['logo-upload', 'white-label']
    },
    {
        id: 'logo-upload',
        title: 'Add Your Logo to Polls',
        summary: 'Brand your polls with your company logo',
        category: 'poll-management',
        tier: 'business',
        tags: ['logo', 'brand', 'upload', 'image', 'business'],
        content: `Business users can display their logo on the voting page for professional branding.

**How to Upload:**
1. Poll Dashboard → Settings tab
2. Find "Your Logo" section
3. Click "Upload Logo"
4. Select PNG or JPG (max 2MB)
5. Logo appears on voting page header

**Best Practices:**
• Use transparent PNG for best results
• Recommended size: 200x60 pixels
• Square logos work too (will be resized)
• High contrast for visibility

**Where Logo Appears:**
• Top of voting page
• Thank You page after voting
• Public results page (if enabled)
• Embedded polls

**Combine with White-Label:**
For complete branding, enable white-label embedding to remove VoteGenerator branding entirely.`,
        relatedArticles: ['custom-themes', 'white-label', 'embed-poll']
    },
    {
        id: 'duplicate-poll',
        title: 'Duplicate an Existing Poll',
        summary: 'Copy a poll to create variations quickly',
        category: 'poll-management',
        tier: 'all',
        tags: ['duplicate', 'copy', 'clone', 'template', 'reuse'],
        content: `Save time by duplicating polls instead of creating from scratch.

**What Gets Copied:**
✓ Poll type and question
✓ All options/choices
✓ Settings (themes, rules, etc.)
✓ Description
✗ Votes (starts fresh at 0)
✗ Analytics data
✗ Notifications setup

**How to Duplicate:**
1. Go to Admin Dashboard
2. Find the poll you want to copy
3. Click the ⋮ menu (three dots)
4. Select "Duplicate"
5. New poll created instantly!

**Use Cases:**
• Run the same poll weekly/monthly
• A/B test different questions
• Create poll templates for your team
• Seasonal versions of recurring polls

**Pro Tip:** Duplicate, then edit the copy - keeps your original intact!`,
        relatedArticles: ['admin-dashboard', 'create-first-poll']
    },
    {
        id: 'pause-resume-poll',
        title: 'Pause and Resume Voting',
        summary: 'Temporarily stop voting without closing your poll',
        category: 'poll-management',
        tier: 'all',
        tags: ['pause', 'resume', 'stop', 'voting', 'temporary'],
        content: `Need to temporarily stop voting? Pause is your friend.

**Pause vs Close:**
• **Pause**: Temporary, can resume anytime
• **Close**: Permanent end (can reopen, but signals "over")

**When to Pause:**
• Need to verify something before more votes
• Taking a break in a multi-day poll
• Reviewing results before continuing
• Over your plan limit (auto-paused)

**How to Pause:**
1. Poll Dashboard → top status area
2. Click "Pause Poll" button
3. Confirm pause
4. Voters see "Poll Paused" message

**How to Resume:**
1. Same location - click "Resume Poll"
2. Voting opens again immediately
3. All previous votes preserved

**What Voters See:**
When paused, voters see a friendly message:
"⏸️ This poll is temporarily paused. Check back soon!"

**Note for Free Users:**
If you have 4+ polls and hit the 3-poll limit, extras are auto-paused. Upgrade or delete a poll to resume.`,
        relatedArticles: ['poll-status', 'poll-limits', 'close-poll']
    },
    {
        id: 'close-reopen-poll',
        title: 'Close and Reopen Polls',
        summary: 'End voting and optionally restart later',
        category: 'poll-management',
        tier: 'all',
        tags: ['close', 'reopen', 'end', 'finish', 'voting'],
        content: `Closing a poll ends voting. Here's how it works.

**How to Close:**
1. Poll Dashboard → Settings tab
2. Click "Close Poll" 
3. Confirm action
4. Voting ends immediately

**What Happens When Closed:**
• No new votes accepted
• Voters see "Poll Closed" message
• Results become final
• You can still view/export data
• Analytics remain accessible

**Reopen a Closed Poll:**
Changed your mind? You can reopen:
1. Poll Dashboard → Status shows "Closed"
2. Click "Reopen Poll" / "Undo Close"
3. Voting resumes
4. Existing votes preserved

**Auto-Close Options:**
Set a poll to close automatically:
• Specific date/time
• After X responses (Business)
• When limit reached

**Best Practice:**
Close polls when you have enough data to make your decision. Open-ended polls can dilute results over time.`,
        relatedArticles: ['pause-resume-poll', 'poll-settings', 'poll-status']
    },
    {
        id: 'poll-comparison',
        title: 'Compare Multiple Polls Side-by-Side',
        summary: 'Analyze how different polls performed',
        category: 'results',
        tier: 'pro',
        tags: ['compare', 'comparison', 'analyze', 'multiple', 'side-by-side'],
        content: `Run similar polls over time? Compare them to spot trends.

**How to Compare:**
1. Admin Dashboard → click "Compare Polls"
2. Select 2-4 polls to compare
3. View side-by-side charts
4. Analyze differences

**What You Can Compare:**
• Total response counts
• Option-by-option results
• Response rates over time
• Engagement metrics

**Use Cases:**
• Before/After comparisons
• A/B test results
• Weekly pulse check trends
• Seasonal variations

**Available For:** Pro and Business tiers

**Pro Tip:** Name your polls consistently (e.g., "Team Mood - Jan", "Team Mood - Feb") for easy comparison.`,
        relatedArticles: ['analytics-dashboard', 'view-results']
    },
    {
        id: 'bulk-actions',
        title: 'Bulk Actions: Manage Multiple Polls',
        summary: 'Delete, export, or manage several polls at once',
        category: 'account',
        tier: 'pro',
        tags: ['bulk', 'multiple', 'delete', 'manage', 'batch'],
        content: `Save time by performing actions on multiple polls at once.

**Available Bulk Actions:**
• Delete multiple polls
• Export multiple poll data
• Pause/resume multiple polls

**How to Use:**
1. Admin Dashboard
2. Check the boxes next to polls
3. Bulk action bar appears at bottom
4. Select action (Delete, Export, etc.)
5. Confirm

**Delete in Bulk:**
⚠️ This permanently deletes selected polls and all their data. Use carefully!

**Pro Tip:** Great for cleaning up old test polls or archived content.`,
        relatedArticles: ['admin-dashboard', 'delete-data']
    },
    
    // ========== SURVEY FEATURES ==========
    {
        id: 'surveys-overview',
        title: 'Survey Builder: Complete Guide',
        summary: 'Create multi-question forms with 15+ question types',
        category: 'surveys',
        tier: 'all',
        tags: ['survey', 'form', 'questionnaire', 'questions', 'multi-question'],
        content: `Surveys let you ask multiple questions in one form - perfect for feedback, research, and more.

**15+ Question Types:**

**Choice Questions:**
• Multiple Choice - Select one or more
• Dropdown - Select from a list
• Yes/No - Simple binary choice

**Rating Questions:**
• Star Rating - 1-5 stars
• Scale - Numeric (1-10, NPS, etc.)
• Matrix/Grid - Rate multiple items

**Text Questions:**
• Short Text - Single line
• Long Text - Paragraphs
• Email - Validated email input
• Phone - Phone number
• Number - Numeric only

**Date/Time:**
• Date Picker
• Time Picker
• Date & Time combined

**Advanced:**
• Ranking - Drag to order
• File Upload (Business)

**Survey Features:**
• Welcome/intro screen
• Progress bar for respondents
• Required vs optional questions
• Skip logic (Business)
• Custom thank you message`,
        steps: [
            {
                title: 'Start Survey Builder',
                description: 'Go to /create and select "Survey" as your poll type.',
                tip: 'Or use a template from the Templates section!'
            },
            {
                title: 'Add Questions',
                description: 'Click "+ Add Question" and choose the question type.',
                tip: 'Mix different types for engaging surveys.'
            },
            {
                title: 'Configure Each Question',
                description: 'Set question text, options, and whether it\'s required.',
                tip: 'Use the preview to see how it looks to respondents.'
            },
            {
                title: 'Arrange Order',
                description: 'Drag questions to reorder them.',
                tip: 'Put easy questions first to build momentum.'
            },
            {
                title: 'Publish',
                description: 'Click "Create Survey" when ready.',
                tip: 'Free tier: up to 10 questions per survey.'
            }
        ],
        relatedArticles: ['survey-templates', 'survey-results', 'nps-surveys']
    },
    {
        id: 'survey-templates',
        title: 'Survey Templates: Start Faster',
        summary: 'Pre-built surveys for common use cases',
        category: 'surveys',
        tier: 'all',
        tags: ['templates', 'survey', 'pre-built', 'quick start'],
        content: `Don't start from scratch - use our proven templates.

**Available Templates:**

**Customer Feedback:**
• Customer Satisfaction (CSAT)
• Net Promoter Score (NPS)
• Product Feedback
• Support Feedback

**Employee:**
• Employee Engagement
• Pulse Check
• Exit Interview
• Onboarding Feedback

**Events:**
• Event Registration
• Post-Event Feedback
• RSVP with Details

**Research:**
• Market Research
• User Research
• Academic Survey

**How to Use Templates:**
1. Go to /create → Survey
2. Click "Browse Templates"
3. Preview any template
4. Click "Use This Template"
5. Customize as needed

**Pro Tip:** Templates are fully editable - add, remove, or modify any question!`,
        relatedArticles: ['surveys-overview', 'create-first-poll']
    },
    {
        id: 'nps-surveys',
        title: 'Net Promoter Score (NPS) Surveys',
        summary: 'Measure customer loyalty with the industry-standard metric',
        category: 'surveys',
        tier: 'all',
        tags: ['NPS', 'net promoter', 'loyalty', 'customer', 'score'],
        content: `NPS is the gold standard for measuring customer loyalty.

**What is NPS?**
The question: "How likely are you to recommend us to a friend?" (0-10 scale)

**Score Categories:**
• 9-10 = Promoters (loyal fans)
• 7-8 = Passives (satisfied but not loyal)
• 0-6 = Detractors (unhappy)

**NPS Calculation:**
NPS = % Promoters - % Detractors
Range: -100 to +100

**What's a Good NPS?**
• 0-30 = Good
• 30-50 = Great  
• 50-70 = Excellent
• 70+ = World-class

**How to Create NPS Survey:**
1. Create Survey → Use "NPS" template
2. Or add a Scale question (0-10)
3. Mark it as "NPS" type in settings
4. Add follow-up: "What's the main reason?"

**Pro Tip:** Always follow up with an open-ended "Why?" question to understand the score.`,
        relatedArticles: ['surveys-overview', 'survey-results']
    },
    
    // ========== ADVANCED ANALYTICS ==========
    {
        id: 'hourly-heatmap',
        title: 'Hourly Heatmap: When Do People Vote?',
        summary: 'Visualize voting patterns by day and hour',
        category: 'results',
        tier: 'business',
        tags: ['heatmap', 'hourly', 'timing', 'analytics', 'patterns'],
        content: `The Hourly Heatmap shows when your voters are most active.

**What It Shows:**
• 7 rows (days of week)
• 24 columns (hours of day)
• Color intensity = vote volume
• Darker = more votes at that time

**How to Read:**
• Spot your peak voting times
• Identify slow periods
• Optimize sharing schedule

**Use Cases:**
• Best time to share new polls
• When to send reminders
• Audience timezone insights
• Engagement pattern analysis

**Access:**
Poll Dashboard → Analytics tab → Hourly Heatmap

**Business Only:** This advanced feature requires Business tier.`,
        relatedArticles: ['analytics-dashboard', 'cross-tab-analysis']
    },
    {
        id: 'cross-tab-analysis',
        title: 'Cross-Tab Analysis: Segment Your Data',
        summary: 'Compare how different groups voted',
        category: 'results',
        tier: 'business',
        tags: ['cross-tab', 'segment', 'filter', 'compare', 'analysis'],
        content: `Cross-tab analysis lets you compare voting patterns across segments.

**Example Questions Answered:**
• "Did mobile users vote differently than desktop?"
• "How did responses from Germany compare to USA?"
• "What did people who answered 'Yes' to Q1 choose for Q2?"

**Available Segments:**
• Device type (Mobile/Desktop/Tablet)
• Country/Region
• Date range
• Question responses (surveys)

**How to Use:**
1. Poll Dashboard → Analytics
2. Click "Cross-Tab Analysis"
3. Select your filter criteria
4. Compare results side-by-side

**Export Filtered Data:**
Download only the segment you're analyzing - great for detailed reports.

**Business Only:** This advanced feature requires Business tier.`,
        relatedArticles: ['hourly-heatmap', 'export-data', 'analytics-dashboard']
    },
    {
        id: 'response-filters',
        title: 'Filter Responses in Results',
        summary: 'View specific subsets of your poll data',
        category: 'results',
        tier: 'pro',
        tags: ['filter', 'responses', 'segment', 'data', 'view'],
        content: `Don't drown in data - filter to what matters.

**Filter Options (Pro+):**
• By date range
• By device type
• By country
• By completion status

**How to Filter:**
1. Poll Dashboard → Responses tab
2. Click the Filter icon
3. Select criteria
4. Results update instantly

**Use Cases:**
• "Show only votes from this week"
• "Compare mobile vs desktop"
• "Filter to completed responses only"

**Reset Filters:**
Click "Clear All" to return to full dataset.

**Pro Tip:** Combine multiple filters for precise analysis.`,
        relatedArticles: ['view-results', 'export-data']
    },
    
    // ========== DOWNLOADS & EXPORTS ==========
    {
        id: 'chart-export',
        title: 'Download Charts as Images',
        summary: 'Export beautiful chart graphics for presentations',
        category: 'results',
        tier: 'pro',
        tags: ['chart', 'download', 'image', 'PNG', 'export', 'presentation'],
        content: `Need charts for a presentation? Export them as high-quality images.

**How to Export:**
1. Poll Dashboard → Responses tab
2. Find the chart you want
3. Click the download icon (↓) on the chart
4. PNG file downloads instantly

**What You Get:**
• High-resolution PNG
• Transparent or white background
• Chart title included
• Clean, presentation-ready

**Available Charts:**
• Bar chart
• Pie chart
• Donut chart
• Line chart (trends)

**Pro Tip:** Use these in PowerPoint, Google Slides, or reports!`,
        relatedArticles: ['export-data', 'print-results']
    },
    {
        id: 'print-results',
        title: 'Print-Friendly Results View',
        summary: 'Print your poll results cleanly',
        category: 'results',
        tier: 'all',
        tags: ['print', 'PDF', 'paper', 'physical', 'report'],
        content: `Need a physical copy? Our print view is optimized for paper.

**How to Print:**
1. Poll Dashboard → Downloads tab
2. Click "Print Results"
3. Print dialog opens
4. Select printer → Print

**What's Included:**
• Poll title and question
• All results with percentages
• Total response count
• Date range
• Clean formatting (no navigation/buttons)

**Save as PDF:**
In the print dialog, select "Save as PDF" as your printer to create a PDF file.

**Free Feature:** Basic print is available on all tiers. PDF export with analytics requires Pro+.`,
        relatedArticles: ['chart-export', 'export-data']
    },
    
    // ========== TROUBLESHOOTING ==========
    {
        id: 'poll-not-working',
        title: 'Troubleshooting: Poll Not Working',
        summary: 'Common issues and how to fix them',
        category: 'troubleshooting',
        tier: 'all',
        tags: ['troubleshooting', 'error', 'not working', 'problem', 'fix', 'help'],
        content: `Having issues? Here are solutions to common problems.

**"Poll Not Found" Error**
• The poll may have been deleted
• The poll may have expired
• Check if you're using the correct link
→ Solution: Contact the poll creator for a new link

**"Poll Closed" Message**
• Voting has ended for this poll
• The creator closed it manually
→ Solution: Contact the poll creator

**"Poll Paused" Message**
• The creator temporarily paused voting
• May be over their plan limits
→ Solution: Wait for creator to resume

**Votes Not Counting**
• You may have already voted (if duplicates disabled)
• Clear cookies and try again
• Check your internet connection
→ Solution: Try a different browser or device

**Can't See Results**
• Results may be hidden until voting ends
• You need the Admin Link to see results
→ Solution: Check if results are public or ask the creator`,
        relatedArticles: ['recover-access', 'poll-status']
    },
    {
        id: 'poll-status',
        title: 'Understanding Poll Status',
        summary: 'Live, Paused, Closed, Draft, Expired explained',
        category: 'troubleshooting',
        tier: 'all',
        tags: ['status', 'live', 'paused', 'closed', 'draft', 'expired'],
        content: `Polls can have different statuses that affect voting.

**🟢 Live**
Poll is active and accepting votes.
• Voters can submit responses
• Results update in real-time
• You can share the voting link

**⏸️ Paused**
Voting is temporarily stopped.
• Voters see "Poll Paused" message
• Existing votes are preserved
• You can resume anytime
• Often used for plan limit management

**🔴 Closed**
Voting is permanently ended.
• No new votes accepted
• Results are final
• You can still view/export data
• You can reopen if needed

**📝 Draft** (Pro/Business)
Poll is created but not yet published.
• Not visible to voters
• You can still edit everything
• Go live when ready

**⏰ Expired**
Poll passed its end date.
• Automatically closes
• Set by "Close poll on" date
• Results still accessible`,
        relatedArticles: ['poll-not-working', 'poll-settings']
    },
    {
        id: 'rate-limit',
        title: 'Why Can\'t I Vote? Rate Limiting',
        summary: 'Understanding vote limits and spam protection',
        category: 'troubleshooting',
        tier: 'all',
        tags: ['rate limit', 'spam', 'blocked', 'too fast', 'wait'],
        content: `We use rate limiting to prevent spam and ensure fair voting.

**Why You Might Be Limited:**
• Voting too quickly (bot protection)
• Multiple votes detected (if disabled)
• IP flagged for suspicious activity
• VPN/proxy detected in some cases

**What to Do:**
1. Wait 30 seconds and try again
2. Make sure you're not using automation
3. Try a different network if on VPN
4. Clear browser cookies

**For Poll Creators:**
If legitimate voters are being blocked:
• Check your "Allow Multiple Votes" setting
• Consider enabling it for casual polls
• Serious repeated issues? Contact support`,
        relatedArticles: ['poll-settings', 'poll-not-working']
    }
];

// ============================================================================
// Quick FAQs (Expandable)
// ============================================================================
const quickFAQs: FAQ[] = [
    {
        question: 'Do I need an account to create a poll?',
        answer: 'No! Free polls require no signup. Just create, share, and view results. We recommend saving your email for access recovery.',
        category: 'getting-started'
    },
    {
        question: 'Can I edit my poll after people have voted?',
        answer: 'You can edit the title, description, and settings anytime. However, you cannot change the question or options after votes are cast to maintain integrity.',
        category: 'getting-started'
    },
    {
        question: 'How do I prevent people from voting multiple times?',
        answer: 'By default, we use browser cookies and IP hashing to detect duplicates. For stricter control, enable "Require verification" in poll settings (Pro+).',
        category: 'getting-started'
    },
    {
        question: 'What happens when I reach my response limit?',
        answer: 'New votes will be rejected and voters will see a "Poll Full" message. Upgrade your plan for more responses, or create a new poll.',
        category: 'billing'
    },
    {
        question: 'Can I get a refund?',
        answer: 'Yes, if you cancel within 7 days of purchase. After 7 days, you keep access until your billing period ends. Email support@votegenerator.com for refunds.',
        category: 'billing'
    },
    {
        question: 'Is my poll data secure?',
        answer: 'Yes. We use encryption in transit (HTTPS) and at rest. Data is stored in secure cloud infrastructure. We never sell your data.',
        category: 'privacy'
    },
    {
        question: 'Can voters see who else voted?',
        answer: 'By default, no. Voting is anonymous. Only you (the creator) can see aggregate results. Individual voter info is not collected unless you enable name collection.',
        category: 'privacy'
    },
    {
        question: 'Why do voters see ads?',
        answer: 'Free tier shows non-intrusive ads to support the service. Pro and Business plans remove all ads for a cleaner voter experience.',
        category: 'billing'
    },
    {
        question: 'Can I white-label the poll for my brand?',
        answer: 'Business plan includes white-label embeds where VoteGenerator branding is removed. You can also upload your own logo.',
        category: 'billing'
    },
    {
        question: 'How do I share results publicly?',
        answer: 'In Poll Settings, enable "Public Results". Anyone with the results link can then view without needing the admin link.',
        category: 'results'
    },
    {
        question: 'How do I set up a PIN to protect my admin link?',
        answer: 'Go to Admin Dashboard → Settings → PIN Protection → Set PIN. Enter a 6-digit code. Anyone accessing your admin links will need this PIN. Pro/Business feature.',
        category: 'account'
    },
    {
        question: 'Can I get email notifications when someone votes?',
        answer: 'Yes! Pro and Business users can enable notifications for each response, milestones (10, 50, 100+ votes), daily digests, and poll events. Set up in Poll Dashboard → Notify tab.',
        category: 'poll-management'
    },
    {
        question: 'How do I change my poll\'s colors/theme?',
        answer: 'Poll Dashboard → Settings → Theme & Appearance. Choose from 12 preset themes or use the custom color picker (Pro+). Business users can also upload their logo.',
        category: 'poll-management'
    },
    {
        question: 'What\'s the difference between pausing and closing a poll?',
        answer: 'Pause temporarily stops voting - you can resume anytime. Close permanently ends voting (though you can reopen if needed). Pause is for breaks; Close is for finishing.',
        category: 'poll-management'
    },
    {
        question: 'How do I create a survey with multiple questions?',
        answer: 'Select "Survey" as your poll type. Add questions using 15+ types (multiple choice, rating, text, etc.). Drag to reorder. Free tier allows up to 10 questions per survey.',
        category: 'surveys'
    },
    {
        question: 'What is NPS and how do I measure it?',
        answer: 'NPS (Net Promoter Score) measures loyalty with "How likely to recommend?" on 0-10 scale. Use our NPS template or add a Scale question. We auto-calculate your NPS score.',
        category: 'surveys'
    },
    {
        question: 'Can I export my poll data to Excel?',
        answer: 'Pro and Business users can export to CSV or Excel from Poll Dashboard → Analytics → Export Data. Includes all responses with timestamps and metadata.',
        category: 'results'
    },
    {
        question: 'How do I see when people are voting (time patterns)?',
        answer: 'Business users get an Hourly Heatmap showing voting patterns by day and hour. Great for optimizing when to share polls. Poll Dashboard → Analytics tab.',
        category: 'results'
    },
    {
        question: 'Can I compare results from different polls?',
        answer: 'Yes! Pro and Business users can use Poll Comparison from the Admin Dashboard. Select 2-4 polls to view side-by-side charts and compare performance.',
        category: 'results'
    },
    {
        question: 'What if I lost my admin link?',
        answer: 'Visit votegenerator.com/recover and enter the email you saved your polls to. We\'ll send a verification code, then restore access to all your polls.',
        category: 'account'
    }
];

// ============================================================================
// Component: Tier Badge
// ============================================================================
const TierBadge: React.FC<{ tier: 'free' | 'pro' | 'business' | 'all' }> = ({ tier }) => {
    if (tier === 'all') return null;
    
    const config = {
        free: { label: 'Free', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
        pro: { label: 'Pro', bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown },
        business: { label: 'Business', bg: 'bg-amber-100', text: 'text-amber-700', icon: Star }
    };
    
    const c = config[tier];
    const Icon = c.icon;
    
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${c.bg} ${c.text} text-xs font-semibold rounded-full`}>
            <Icon size={12} />
            {c.label}
        </span>
    );
};

// ============================================================================
// Component: Search Results
// ============================================================================
const SearchResults: React.FC<{ 
    query: string; 
    articles: Article[];
    faqs: FAQ[];
    onSelectArticle: (id: string) => void;
    onClearSearch: () => void;
}> = ({ query, articles, faqs, onSelectArticle, onClearSearch }) => {
    const filteredArticles = useMemo(() => {
        const q = query.toLowerCase();
        return articles.filter(a => 
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.tags.some(t => t.toLowerCase().includes(q)) ||
            a.content.toLowerCase().includes(q)
        );
    }, [query, articles]);
    
    const filteredFAQs = useMemo(() => {
        const q = query.toLowerCase();
        return faqs.filter(f =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q)
        );
    }, [query, faqs]);
    
    if (filteredArticles.length === 0 && filteredFAQs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No results found</h3>
                <p className="text-slate-600 mb-4">Try different keywords or browse categories below</p>
                <button
                    onClick={onClearSearch}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Clear search
                </button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-slate-600">
                    Found {filteredArticles.length + filteredFAQs.length} results for "{query}"
                </p>
                <button
                    onClick={onClearSearch}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                    Clear search
                </button>
            </div>
            
            {filteredArticles.length > 0 && (
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Articles</h3>
                    <div className="space-y-2">
                        {filteredArticles.map(article => (
                            <button
                                key={article.id}
                                onClick={() => onSelectArticle(article.id)}
                                className="w-full text-left p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                                                {article.title}
                                            </h4>
                                            <TierBadge tier={article.tier} />
                                        </div>
                                        <p className="text-sm text-slate-600">{article.summary}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-400 group-hover:text-indigo-600 transition flex-shrink-0" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {filteredFAQs.length > 0 && (
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">Quick Answers</h3>
                    <div className="space-y-2">
                        {filteredFAQs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} defaultOpen={filteredFAQs.length === 1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// Component: FAQ Item (Expandable)
// ============================================================================
const FAQItem: React.FC<{ faq: FAQ; defaultOpen?: boolean }> = ({ faq, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition"
            >
                <span className="font-medium text-slate-800">{faq.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 text-slate-600 text-sm border-t border-slate-100 pt-3">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// Component: Article View
// ============================================================================
const ArticleView: React.FC<{ 
    article: Article; 
    onBack: () => void;
    onSelectArticle: (id: string) => void;
    allArticles: Article[];
}> = ({ article, onBack, onSelectArticle, allArticles }) => {
    const [activeStep, setActiveStep] = useState(0);
    
    const relatedArticles = useMemo(() => {
        if (!article.relatedArticles) return [];
        return article.relatedArticles
            .map(id => allArticles.find(a => a.id === id))
            .filter(Boolean) as Article[];
    }, [article, allArticles]);
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 group"
            >
                <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition" />
                Back to Help Center
            </button>
            
            {/* Article header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <TierBadge tier={article.tier} />
                    <span className="text-sm text-slate-500 capitalize">{article.category.replace('-', ' ')}</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{article.title}</h1>
                <p className="text-lg text-slate-600">{article.summary}</p>
            </div>
            
            {/* Video placeholder */}
            {article.videoUrl && (
                <div className="mb-8 bg-slate-900 rounded-2xl aspect-video flex items-center justify-center group cursor-pointer hover:bg-slate-800 transition">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                            <Play size={32} className="text-white ml-1" />
                        </div>
                        <p className="text-white/80">Watch video tutorial</p>
                    </div>
                </div>
            )}
            
            {/* Step-by-step tutorial */}
            {article.steps && article.steps.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Rocket size={24} className="text-indigo-600" />
                        Step-by-Step Guide
                    </h2>
                    
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-6">
                        {article.steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={`flex-1 h-2 rounded-full transition ${
                                    index <= activeStep ? 'bg-indigo-600' : 'bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                    
                    {/* Active step */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {activeStep + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-lg mb-2">
                                        {article.steps[activeStep].title}
                                    </h3>
                                    <p className="text-slate-600 mb-4">
                                        {article.steps[activeStep].description}
                                    </p>
                                    {article.steps[activeStep].tip && (
                                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                            <Lightbulb size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-amber-800">
                                                <strong>Tip:</strong> {article.steps[activeStep].tip}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                            disabled={activeStep === 0}
                            className="px-4 py-2 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                            Previous
                        </button>
                        <span className="text-sm text-slate-500">
                            Step {activeStep + 1} of {article.steps.length}
                        </span>
                        <button
                            onClick={() => setActiveStep(Math.min(article.steps!.length - 1, activeStep + 1))}
                            disabled={activeStep === article.steps.length - 1}
                            className="px-4 py-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
            
            {/* Main content */}
            <div className="prose prose-slate max-w-none mb-8">
                {article.content.split('\n\n').map((paragraph, i) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return <h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-3">{paragraph.replace(/\*\*/g, '')}</h3>;
                    }
                    if (paragraph.startsWith('•')) {
                        const items = paragraph.split('\n').filter(l => l.startsWith('•'));
                        return (
                            <ul key={i} className="list-disc list-inside space-y-1 text-slate-600">
                                {items.map((item, j) => (
                                    <li key={j}>{item.replace('• ', '')}</li>
                                ))}
                            </ul>
                        );
                    }
                    if (paragraph.includes('**')) {
                        // Bold text within paragraph
                        const parts = paragraph.split(/(\*\*.*?\*\*)/);
                        return (
                            <p key={i} className="text-slate-600 mb-4">
                                {parts.map((part, j) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={j} className="text-slate-800">{part.replace(/\*\*/g, '')}</strong>;
                                    }
                                    return part;
                                })}
                            </p>
                        );
                    }
                    return <p key={i} className="text-slate-600 mb-4">{paragraph}</p>;
                })}
            </div>
            
            {/* Related articles */}
            {relatedArticles.length > 0 && (
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="font-bold text-slate-800 mb-4">Related Articles</h3>
                    <div className="grid gap-3">
                        {relatedArticles.map(related => (
                            <button
                                key={related.id}
                                onClick={() => onSelectArticle(related.id)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-slate-400 group-hover:text-indigo-600" />
                                    <span className="font-medium text-slate-700 group-hover:text-indigo-600">
                                        {related.title}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Feedback section */}
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl text-center">
                <p className="text-slate-600 mb-4">Was this article helpful?</p>
                <div className="flex items-center justify-center gap-3">
                    <button className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center gap-2">
                        <CheckCircle size={18} />
                        Yes, thanks!
                    </button>
                    <button className="px-6 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition flex items-center gap-2">
                        <XCircle size={18} />
                        Not really
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// Component: Category Card
// ============================================================================
const CategoryCard: React.FC<{
    icon: any;
    title: string;
    description: string;
    color: string;
    articleCount: number;
    onClick: () => void;
}> = ({ icon: Icon, title, description, color, articleCount, onClick }) => (
    <button
        onClick={onClick}
        className="text-left p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition group"
    >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
            <Icon size={24} className="text-white" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition">{title}</h3>
        <p className="text-sm text-slate-600 mb-3">{description}</p>
        <span className="text-xs text-slate-400">{articleCount} articles</span>
    </button>
);

// ============================================================================
// Main Component
// ============================================================================
const HelpCenterComplete: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    // Categories with their articles
    const categories = useMemo(() => [
        {
            id: 'getting-started',
            title: 'Getting Started',
            description: 'Create your first poll in under 30 seconds',
            icon: Zap,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            id: 'poll-management',
            title: 'Poll Settings & Controls',
            description: 'Themes, notifications, pause/close, PIN protection',
            icon: Settings,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'surveys',
            title: 'Surveys & Forms',
            description: '15+ question types, templates, NPS scores',
            icon: ClipboardList,
            color: 'from-violet-500 to-purple-600'
        },
        {
            id: 'sharing',
            title: 'Sharing Your Poll',
            description: 'Links, QR codes, embeds, and social sharing',
            icon: Share2,
            color: 'from-pink-500 to-rose-600'
        },
        {
            id: 'results',
            title: 'Results & Analytics',
            description: 'Charts, exports, heatmaps, cross-tab analysis',
            icon: BarChart3,
            color: 'from-amber-500 to-orange-600'
        },
        {
            id: 'account',
            title: 'Account & Access',
            description: 'Dashboard, recovery, PIN, bulk actions',
            icon: Key,
            color: 'from-cyan-500 to-blue-600'
        },
        {
            id: 'billing',
            title: 'Plans & Billing',
            description: 'Pricing, upgrades, and subscriptions',
            icon: CreditCard,
            color: 'from-indigo-500 to-purple-600'
        },
        {
            id: 'privacy',
            title: 'Privacy & Data',
            description: 'GDPR compliance and data protection',
            icon: Shield,
            color: 'from-slate-600 to-slate-800'
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            description: 'Common issues and how to fix them',
            icon: AlertTriangle,
            color: 'from-red-500 to-rose-600'
        }
    ], []);
    
    const categoryArticleCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        categories.forEach(c => {
            counts[c.id] = articles.filter(a => a.category === c.id).length;
        });
        return counts;
    }, [categories]);
    
    const currentArticle = useMemo(() => {
        if (!selectedArticle) return null;
        return articles.find(a => a.id === selectedArticle) || null;
    }, [selectedArticle]);
    
    const categoryArticles = useMemo(() => {
        if (!selectedCategory) return [];
        return articles.filter(a => a.category === selectedCategory);
    }, [selectedCategory]);
    
    const handleSelectArticle = (id: string) => {
        setSelectedArticle(id);
        setSelectedCategory(null);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleSelectCategory = (id: string) => {
        setSelectedCategory(id);
        setSelectedArticle(null);
        setSearchQuery('');
    };
    
    const handleBack = () => {
        if (selectedArticle) {
            // If we were in an article, go back to category if we came from one
            setSelectedArticle(null);
        } else {
            setSelectedCategory(null);
        }
    };
    
    const isSearching = searchQuery.length >= 2;
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* FAQ Schema for AEO/SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            
            <NavHeader />
            
            {/* Hero Section with Search */}
            <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        How can we help?
                    </h1>
                    <p className="text-xl text-indigo-100 mb-8">
                        Search our help center or browse topics below
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for help... (e.g., 'share poll', 'upgrade', 'export')"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    {/* Quick links */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                        <span className="text-indigo-200 text-sm">Popular:</span>
                        {['Create a poll', 'Recover access', 'Upgrade plan', 'Export data'].map((q) => (
                            <button
                                key={q}
                                onClick={() => setSearchQuery(q)}
                                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {/* Search Results */}
                    {isSearching && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <SearchResults
                                query={searchQuery}
                                articles={articles}
                                faqs={quickFAQs}
                                onSelectArticle={handleSelectArticle}
                                onClearSearch={() => setSearchQuery('')}
                            />
                        </motion.div>
                    )}
                    
                    {/* Article View */}
                    {!isSearching && currentArticle && (
                        <ArticleView
                            key="article"
                            article={currentArticle}
                            onBack={handleBack}
                            onSelectArticle={handleSelectArticle}
                            allArticles={articles}
                        />
                    )}
                    
                    {/* Category View */}
                    {!isSearching && !currentArticle && selectedCategory && (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 group"
                            >
                                <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition" />
                                Back to all topics
                            </button>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">
                                {selectedCategory.replace('-', ' ')}
                            </h2>
                            
                            <div className="space-y-3">
                                {categoryArticles.map(article => (
                                    <button
                                        key={article.id}
                                        onClick={() => handleSelectArticle(article.id)}
                                        className="w-full text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                                                        {article.title}
                                                    </h3>
                                                    <TierBadge tier={article.tier} />
                                                </div>
                                                <p className="text-slate-600">{article.summary}</p>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-400 group-hover:text-indigo-600 transition flex-shrink-0 mt-1" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Home View - Categories & FAQs */}
                    {!isSearching && !currentArticle && !selectedCategory && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Categories Grid */}
                            <section className="mb-16">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse by Topic</h2>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map(cat => (
                                        <CategoryCard
                                            key={cat.id}
                                            icon={cat.icon}
                                            title={cat.title}
                                            description={cat.description}
                                            color={cat.color}
                                            articleCount={categoryArticleCounts[cat.id] || 0}
                                            onClick={() => handleSelectCategory(cat.id)}
                                        />
                                    ))}
                                </div>
                            </section>
                            
                            {/* Quick FAQs */}
                            <section className="mb-16">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-3">
                                    {quickFAQs.slice(0, 6).map((faq, i) => (
                                        <FAQItem key={i} faq={faq} />
                                    ))}
                                </div>
                            </section>
                            
                            {/* Still need help? Contact Section */}
                            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 text-center border border-indigo-100">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle size={32} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Still need help?</h2>
                                <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                                    Can't find what you're looking for? Our support team is here to help.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a
                                        href="mailto:support@votegenerator.com"
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                    >
                                        <Mail size={20} />
                                        Email Support
                                    </a>
                                    <a
                                        href="/contact"
                                        className="flex items-center gap-2 px-6 py-3 border-2 border-indigo-200 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition"
                                    >
                                        <ExternalLink size={20} />
                                        Contact Form
                                    </a>
                                </div>
                                <p className="text-sm text-slate-500 mt-4">
                                    Business users get priority support with faster response times.
                                </p>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            <Footer />
        </div>
    );
};

export default HelpCenterComplete;
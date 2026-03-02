// ============================================================================
// FAQPage.tsx - AEO-Optimized FAQ Page
// Structured for AI answer engines (ChatGPT, Perplexity, Google AI)
// Includes FAQPage schema per page section
// Location: src/components/FAQPage.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown, Search, HelpCircle, Zap, Crown, 
    FileText, Shield, BarChart3, Share2, Settings,
    Users, Clock, Lock, Star, CheckCircle2, ArrowRight
} from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

// FAQ Data organized by category - AEO optimized with clear Q&A format
const FAQ_CATEGORIES = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: Zap,
        description: 'Learn how to create your first poll or survey',
        faqs: [
            {
                q: "What is VoteGenerator?",
                a: "VoteGenerator is a free online poll and survey maker that lets you create polls in under 60 seconds with no signup required. It supports 9 poll types including multiple choice, ranked choice voting, rating scales, image polls, and multi-question surveys. Results update in real-time and can be shared via link, QR code, or embedded on websites."
            },
            {
                q: "How do I create a free online poll?",
                a: "Creating a poll takes 3 simple steps: 1) Enter your question and add answer options, 2) Choose your poll type (multiple choice, ranked, rating, etc.), 3) Click Create Poll to get your shareable link. No account or signup is required. Your poll is instantly live and ready to share with anyone."
            },
            {
                q: "Do I need an account to create a poll?",
                a: "No. Neither poll creators nor voters need to create an account or provide an email address. VoteGenerator is designed to be privacy-first and frictionless. Voters simply click your poll link and vote immediately. Poll creators receive a private admin link to manage their poll and view results."
            },
            {
                q: "Is VoteGenerator completely free to use?",
                a: "Yes, VoteGenerator offers a generous free tier that includes unlimited poll creation, up to 100 responses per poll, 30-day poll duration, basic themes, and all 9 poll types. No credit card required. Paid plans starting at $19/month offer additional features like more responses, premium themes, CSV export, and custom branding."
            },
            {
                q: "How do I share my poll with others?",
                a: "After creating your poll, you get multiple sharing options: 1) Copy the direct link to share via email, chat, or social media, 2) Download a QR code for printed materials or presentations, 3) Use social share buttons for Twitter/X, Facebook, WhatsApp, and LinkedIn, 4) Copy embed code to add the poll to your website or blog."
            }
        ]
    },
    {
        id: 'poll-types',
        title: 'Poll Types',
        icon: BarChart3,
        description: 'Understanding different poll formats',
        faqs: [
            {
                q: "What types of polls can I create?",
                a: "VoteGenerator supports 9 poll types: Multiple Choice (single or multi-select), Ranked Choice Voting (drag to reorder preferences), Rating Scale (1-5 stars, hearts, emojis, or numbers), Image Polls (vote on images), Meeting Scheduler (Yes/Maybe/No availability), Dot Voting (distribute points across options), Budget Allocation (buy-a-feature prioritization), Matrix Voting (2D priority grid for Impact vs Effort), and Pairwise Comparison (head-to-head matchups). Plus multi-question Surveys."
            },
            {
                q: "What is ranked choice voting and how does it work?",
                a: "Ranked choice voting (RCV) lets voters drag and drop options to rank them in order of preference instead of selecting just one. This reveals true preferences when there are multiple good options. VoteGenerator shows instant runoff results, calculating winners if votes were redistributed. It's ideal for elections, prioritization, and consensus-building."
            },
            {
                q: "How do rating scale polls work?",
                a: "Rating scale polls let voters rate each option on a 1-5 scale. Choose from 4 visual styles: stars (⭐), hearts (❤️), emojis (😢😕😐🙂😍), or numbers. Results show average ratings and distribution. Perfect for satisfaction surveys, product feedback, and performance reviews."
            },
            {
                q: "What is dot voting?",
                a: "Dot voting gives each voter a fixed number of points (dots) to distribute across options however they choose. They can put all points on one option or spread them around. This reveals intensity of preference, not just direction. Great for prioritizing features, budget allocation, and team decision-making."
            },
            {
                q: "When should I use an image poll?",
                a: "Image polls are ideal when visual comparison matters: logo designs, product photos, event venues, artwork, UI mockups, or any A/B visual test. Voters click images to select. Add captions for context. Perfect for design feedback, marketing decisions, and visual preference research."
            },
            {
                q: "How does the meeting scheduler poll work?",
                a: "Meeting scheduler polls let participants indicate availability with Yes (green), Maybe (yellow), or No responses for each time slot. Results show which times work best for the group. No signup needed for respondents. Ideal for scheduling team meetings, events, interviews, or group activities."
            }
        ]
    },
    {
        id: 'surveys',
        title: 'Surveys & Multi-Question Forms',
        icon: FileText,
        description: 'Create comprehensive surveys',
        faqs: [
            {
                q: "How do I create a survey with multiple questions?",
                a: "Click 'Create Survey' on VoteGenerator to access the survey builder. Add multiple question types including multiple choice, checkboxes, short text, long text, rating scales, and dropdown menus. Free users can add up to 5 questions, Pro gets 25, Business gets 50 questions per survey. Share via link, QR code, or embed on your website."
            },
            {
                q: "How do I create an employee satisfaction survey?",
                a: "To create an employee satisfaction survey: 1) Click 'Create Survey' and select the Employee Satisfaction template, 2) Customize questions for job satisfaction, management feedback, work-life balance, and growth opportunities, 3) Enable anonymous mode for honest feedback, 4) Add rating scales (1-5) for quantifiable metrics, 5) Include open text fields for suggestions, 6) Share the private link with your team."
            },
            {
                q: "Can I create anonymous surveys?",
                a: "Yes. Enable Anonymous Mode to hide all identifying information including voter names, IP addresses, and device details from survey results. This encourages honest feedback, especially for sensitive topics like employee satisfaction, workplace feedback, or health surveys. Anonymous surveys display a visible badge so respondents know their identity is protected."
            },
            {
                q: "What question types are available in surveys?",
                a: "VoteGenerator surveys support 6 question types: Multiple Choice (select one answer), Checkboxes (select multiple answers), Short Text (one-line open responses), Long Text (paragraph responses), Rating Scale (1-5 with visual options), and Dropdown (select from a list). Questions can be marked as required or optional."
            },
            {
                q: "How do I create a customer feedback survey?",
                a: "Use the Customer Feedback template or build from scratch: 1) Add a rating scale for overall satisfaction, 2) Include multiple choice for specific product/service aspects, 3) Add open text for suggestions and comments, 4) Enable anonymous mode if preferred, 5) Add your branding with Business plan, 6) Share via link, embed on your website, or include in receipts/emails."
            },
            {
                q: "Can I create an event feedback survey?",
                a: "Yes. VoteGenerator is perfect for post-event surveys. Add questions about venue, speakers, content, organization, and overall experience using rating scales. Include checkboxes for what attendees liked most. Add open text for suggestions. Share immediately after the event via link or QR code while feedback is fresh."
            }
        ]
    },
    {
        id: 'security',
        title: 'Security & Vote Protection',
        icon: Shield,
        description: 'Prevent duplicate and fraudulent votes',
        faqs: [
            {
                q: "How do I prevent people from voting multiple times?",
                a: "VoteGenerator offers multiple vote protection options: 1) Browser Cookies (default) - prevents repeat votes from the same browser, 2) Shared PIN - require a 4-10 character code that all voters must enter, 3) Unique Access Codes - generate individual codes for controlled voting. These options can be combined with optional voter name collection for accountability."
            },
            {
                q: "What is the difference between PIN and access codes?",
                a: "Shared PIN is one code that all voters use - simple for controlled groups but doesn't prevent the same person from voting twice. Unique Access Codes generate individual one-time codes (like ABC123, XYZ789) that each work only once - perfect for elections, contests, or when you need to ensure one vote per person."
            },
            {
                q: "Are poll responses private and secure?",
                a: "Yes. VoteGenerator is designed with privacy-first principles. We don't require accounts or emails. Vote data is stored securely and only accessible via your private admin link. We don't sell data or show ads on voting pages. Business users can enable fully anonymous mode that hides all voter metadata."
            },
            {
                q: "Can I require voters to enter their name?",
                a: "Yes. Enable 'Require Names' in poll settings to make voters enter their name before submitting. Names appear in results so you can see who voted for what. This adds accountability but reduces anonymity - use based on your needs."
            },
            {
                q: "Can I block VPN users from voting?",
                a: "Yes. Enable 'Block VPN/Proxy' in advanced settings to detect and block votes from VPN services, proxies, and headless browsers. This helps prevent vote manipulation but may also block legitimate users on corporate networks."
            }
        ]
    },
    {
        id: 'results',
        title: 'Results & Analytics',
        icon: BarChart3,
        description: 'View and export poll results',
        faqs: [
            {
                q: "How do I see my poll results?",
                a: "Results update in real-time and can be viewed three ways: 1) From your admin dashboard using your private admin link, 2) Optionally show results to voters after they vote, 3) Share a public results page with anyone. Results include vote counts, percentages, charts, response timeline, and device breakdown."
            },
            {
                q: "Can I export poll results to Excel or CSV?",
                a: "Yes. Pro and Business plan users can export results to CSV and Excel formats. Export includes all vote data: timestamps, choices, voter names (if collected), comments, and device information. Business users can apply date filters before exporting."
            },
            {
                q: "Can voters see results before voting?",
                a: "By default, voters see results after they vote. You can change this in poll settings to show results before voting (may influence votes), hide results completely (voters never see them), or show results only after the poll closes."
            },
            {
                q: "How do I share poll results with others?",
                a: "From your admin dashboard, click 'Share Results' to get a public results link anyone can view. Results update in real-time. You can also export to CSV/Excel (Pro+) and share the file, or take screenshots of the visual charts. Business users can export charts as images."
            },
            {
                q: "What analytics are available?",
                a: "Free users see vote counts, percentages, and basic charts. Pro users add response timeline charts and device/browser breakdown. Business users add hourly response heatmaps, geographic data, cross-tab filtering (analyze how different groups voted), and filtered exports."
            }
        ]
    },
    {
        id: 'sharing',
        title: 'Sharing & Embedding',
        icon: Share2,
        description: 'Share polls and embed on websites',
        faqs: [
            {
                q: "Can I embed a poll on my website?",
                a: "Yes. VoteGenerator provides embed code that you can copy and paste into any website, blog, or platform that supports HTML. The embedded poll is fully functional and matches your chosen theme. Business plan users can hide VoteGenerator branding for white-label embeds."
            },
            {
                q: "How do I get a QR code for my poll?",
                a: "After creating your poll, go to your admin dashboard and click the QR code icon or 'Get QR Code' button. Download the QR code as a PNG image. Print it on flyers, posters, slides, or displays. When scanned, voters go directly to your poll."
            },
            {
                q: "Can I use a custom URL for my poll?",
                a: "Business plan users can create custom URLs (slugs) for their polls. Instead of votegenerator.com/p/abc123, you can have votegenerator.com/p/company-survey. Custom slugs must be unique and contain only letters, numbers, and hyphens."
            },
            {
                q: "Can I add my company logo to polls?",
                a: "Business plan users can upload a custom logo that appears on their poll pages. This adds professional branding to your polls and surveys. Combined with hidden VoteGenerator branding, you get a fully white-label experience."
            }
        ]
    },
    {
        id: 'management',
        title: 'Poll Management',
        icon: Settings,
        description: 'Edit, close, and manage your polls',
        faqs: [
            {
                q: "How long do polls stay active?",
                a: "Free polls remain active for 30 days. Pro and Business plan polls stay active for up to 365 days. You can also set a custom deadline date/time or maximum number of responses. Polls can be manually closed at any time from your admin dashboard, and reopened later if needed."
            },
            {
                q: "Can I edit a poll after creating it?",
                a: "You can edit the poll title, description, theme, and settings after creation. However, you cannot change the poll type or edit/add/remove options after votes have been cast - this protects vote integrity. If you need to change options, create a new poll."
            },
            {
                q: "How do I close a poll early?",
                a: "Go to your admin dashboard and click 'Close Poll' or toggle the status switch. Closed polls no longer accept votes and show a 'Poll Closed' message. You can reopen a closed poll at any time unless it exceeded its deadline."
            },
            {
                q: "Can I delete a poll and all its data?",
                a: "Yes. From your admin dashboard, click the delete option (trash icon). This permanently removes the poll and all vote data. This action cannot be undone. If you just want to stop collecting votes, close the poll instead."
            },
            {
                q: "How do I save my admin link so I don't lose it?",
                a: "Your admin link is shown after creating a poll and is the only way to access poll management. Save it by: 1) Clicking 'Save Link' to open your email app with the link, 2) Bookmarking the page in your browser, 3) Copying the link and storing it somewhere safe. If you lose it, there is no way to recover access."
            },
            {
                q: "Can I duplicate a poll?",
                a: "Yes. From your admin dashboard, click 'Duplicate Poll' to create a copy with the same settings and options but zero votes. This is useful for running recurring polls (weekly check-ins, monthly surveys) or A/B testing different variations."
            }
        ]
    },
    {
        id: 'pricing',
        title: 'Pricing & Plans',
        icon: Crown,
        description: 'Understand plan features and billing',
        faqs: [
            {
                q: "What's included in the free plan?",
                a: "The free plan includes unlimited poll creation, all 9 poll types, up to 100 responses per poll, 30-day poll duration, basic themes, real-time results, vote protection options, QR code sharing, and embeddable polls. No credit card or signup required."
            },
            {
                q: "What's the difference between Pro and Business plans?",
                a: "Pro ($19/month or $190/year) offers 10,000 responses per poll, 365-day duration, premium themes, CSV/Excel export, email notifications, and removes VoteGenerator branding. Business ($49/month or $490/year) adds 100,000 responses, custom logo upload, white-label embeds, custom URLs, post-vote redirect, hourly analytics heatmap, and cross-tab filtering."
            },
            {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription anytime through the Manage Plan option in your dashboard. Your subscription continues until the end of your billing period, then automatically downgrades to the free plan. All polls remain accessible but premium features become locked."
            },
            {
                q: "Do you offer annual billing discounts?",
                a: "Yes. Annual billing saves you approximately 17% compared to monthly billing. Pro Annual is $190/year (vs $228 if paid monthly) and Business Annual is $490/year (vs $588 if paid monthly)."
            },
            {
                q: "What happens if I exceed my response limit?",
                a: "When a poll reaches its response limit, new votes are paused and voters see a friendly message. You can upgrade your plan to increase the limit, and new votes will be accepted immediately. All existing responses remain accessible."
            },
            {
                q: "Do you offer refunds?",
                a: "We offer a 14-day refund policy for new subscriptions. If you're not satisfied within 14 days of your first purchase, contact us for a full refund. After 14 days, subscriptions are non-refundable but can be cancelled anytime."
            }
        ]
    }
];

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-slate-200 last:border-0">
        <button
            onClick={onClick}
            className="w-full py-5 flex items-start justify-between text-left hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2"
            aria-expanded={isOpen}
        >
            <span className="text-lg font-semibold text-slate-800 pr-4">{question}</span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mt-1"
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
                    className="overflow-hidden"
                >
                    <p className="pb-5 text-slate-600 leading-relaxed pl-2">{answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const toggleItem = (id: string) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Filter FAQs based on search
    const filteredCategories = FAQ_CATEGORIES.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
            searchQuery === '' ||
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    // Generate schema for current page
    const generateSchema = () => {
        const allFaqs = FAQ_CATEGORIES.flatMap(cat => cat.faqs);
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": allFaqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Schema Markup */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
            />

            {/* Navigation */}
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <HelpCircle size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Everything you need to know about creating polls and surveys with VoteGenerator
                        </p>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-8 max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-white/30 outline-none"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="max-w-6xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-2 justify-center">
                    {FAQ_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    activeCategory === cat.id 
                                        ? 'bg-indigo-100 text-indigo-700' 
                                        : 'hover:bg-slate-100 text-slate-600'
                                }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium text-sm">{cat.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* FAQ Sections */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No results found</h3>
                        <p className="text-slate-500">Try different keywords or browse categories above</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {filteredCategories.map((category, catIndex) => {
                            const Icon = category.icon;
                            return (
                                <motion.section
                                    key={category.id}
                                    id={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: catIndex * 0.1 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <Icon size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800">{category.title}</h2>
                                            <p className="text-slate-500 text-sm">{category.description}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                        {category.faqs.map((faq, faqIndex) => {
                                            const itemId = `${category.id}-${faqIndex}`;
                                            return (
                                                <FAQItem
                                                    key={itemId}
                                                    question={faq.q}
                                                    answer={faq.a}
                                                    isOpen={openItems.has(itemId)}
                                                    onClick={() => toggleItem(itemId)}
                                                />
                                            );
                                        })}
                                    </div>
                                </motion.section>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Can't find what you're looking for? Our team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                        >
                            Contact Support
                            <ArrowRight size={18} />
                        </a>
                        <a 
                            href="/create"
                            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold transition-all"
                        >
                            Create a Poll
                            <Zap size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FAQPage;
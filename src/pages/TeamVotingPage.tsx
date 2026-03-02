// ============================================================================
// TeamVotingPage - SEO/AEO Landing Page with Schema
// Target Keywords: team voting, group decision making, team poll, group poll,
//                  collaborative voting, team decision tool, consensus building
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, Shield, BarChart3, Clock, CheckCircle2, ArrowRight,
    MessageSquare, Zap, ChevronRight, Check, Sparkles,
    Target, Vote, ListOrdered, UserCheck, Building2,
    Calendar, Coffee, Briefcase, Smartphone, Globe
} from 'lucide-react';
import NavHeader from '../components/NavHeader';
import Footer from '../components/Footer';

// ============================================================================
// JSON-LD SCHEMA FOR AEO
// ============================================================================

const PageSchema = () => {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the best tool for team voting and group decisions?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VoteGenerator is ideal for team voting because: 1) No signup required - share a link and your team can vote immediately, 2) Anonymous voting option ensures honest opinions without peer pressure, 3) Real-time results show consensus as votes come in, 4) Multiple voting methods including ranked choice for prioritization, 5) Works on any device. Create a team poll in under 2 minutes."
                }
            },
            {
                "@type": "Question",
                "name": "How do I create an anonymous team poll?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To create an anonymous team poll: 1) Go to VoteGenerator and click Create Poll, 2) Enter your question and options, 3) Toggle on 'Anonymous Mode' in settings - this hides voter identities, 4) Share the link via Slack, Teams, email, or any messaging app. Team members vote without their names attached, encouraging honest input on sensitive topics."
                }
            },
            {
                "@type": "Question",
                "name": "How does ranked choice voting work for team decisions?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ranked choice voting lets team members rank options by preference instead of picking just one. VoteGenerator calculates the winner by: 1) Counting first-choice votes, 2) If no majority, eliminating the lowest option and redistributing those votes to second choices, 3) Repeating until one option wins. This method finds the option with the broadest support, not just the most passionate minority."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use team voting for meeting scheduling?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Create a poll with proposed meeting times as options, share with your team, and see which time works for the most people. You can use simple voting (pick one time) or ranked choice (rank your preferences). Results update in real-time so you can schedule as soon as consensus emerges."
                }
            },
            {
                "@type": "Question",
                "name": "How do I share a team poll in Slack or Microsoft Teams?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After creating your poll, copy the unique link and paste it directly into any Slack channel or Teams chat. Team members click the link and vote in their browser - no bots to install, no integrations to configure. Works in any channel: public, private, or DMs."
                }
            },
            {
                "@type": "Question",
                "name": "Do team members need accounts to vote?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Team members simply click the poll link and vote - no signup, no email, no downloads required. This zero-friction approach maximizes participation. You can optionally require names for accountability, but it's not mandatory."
                }
            },
            {
                "@type": "Question",
                "name": "How can I prevent people from voting multiple times?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VoteGenerator offers multiple vote protection methods: Browser cookies (default - prevents repeat votes from same browser), IP-based limiting (one vote per IP address), shared PIN (require a code you give your team), or email verification for highest security. Choose based on your team's needs and trust level."
                }
            },
            {
                "@type": "Question",
                "name": "What types of team decisions work best with voting?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Team voting works great for: Meeting time scheduling, lunch/event location decisions, feature prioritization, naming choices (projects, products, pets), offsite activity planning, tool/vendor selection, sprint planning priorities, retrospective action items, and any decision where you want input from the whole team rather than one person deciding."
                }
            }
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Create a Team Vote",
        "description": "Create a group poll for team decisions in under 2 minutes",
        "totalTime": "PT2M",
        "step": [
            { "@type": "HowToStep", "position": 1, "name": "Create poll", "text": "Go to VoteGenerator and enter your decision question with options" },
            { "@type": "HowToStep", "position": 2, "name": "Choose voting method", "text": "Select single choice, multiple choice, or ranked choice voting" },
            { "@type": "HowToStep", "position": 3, "name": "Enable anonymous mode", "text": "Toggle anonymous voting if you want honest opinions without attribution" },
            { "@type": "HowToStep", "position": 4, "name": "Share with team", "text": "Copy the link and post in Slack, Teams, email, or any group chat" },
            { "@type": "HowToStep", "position": 5, "name": "Watch consensus form", "text": "See real-time results as your team votes" }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        </>
    );
};

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
        <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-blue-100 text-sm font-medium mb-6">
                        <Users className="w-4 h-4" />
                        <span>Make decisions together</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                        Team Voting<br />
                        <span className="text-blue-300">Made Simple</span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
                        Create group polls your team can vote on instantly. 
                        No accounts needed. Anonymous options available. 
                        Real-time results show consensus.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {[
                            { icon: Users, text: 'Group decisions' },
                            { icon: Shield, text: 'Anonymous voting' },
                            { icon: BarChart3, text: 'Real-time results' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                                <item.icon className="w-4 h-4 text-blue-300" />
                                {item.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/create" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-xl hover:bg-blue-50 transition shadow-xl">
                            <Sparkles className="w-5 h-5" />
                            Create Team Poll
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <p className="text-blue-200 text-sm mt-6 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        No signup • No downloads • Free forever
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
                    <div className="bg-white rounded-2xl shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Team Offsite Location</h3>
                                    <p className="text-xs text-slate-500">12 team members • Anonymous</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Live</span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {[
                                { option: '🏔️ Mountain retreat', votes: 5, pct: 42 },
                                { option: '🏖️ Beach resort', votes: 4, pct: 33 },
                                { option: '🏙️ City hotel', votes: 2, pct: 17 },
                                { option: '🏕️ Camping', votes: 1, pct: 8 },
                            ].map((opt, i) => (
                                <div key={i} className="relative bg-slate-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-slate-900">{opt.option}</span>
                                        <span className="text-sm text-slate-500">{opt.votes} votes</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-blue-300'}`} style={{ width: `${opt.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t">
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 12 votes</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Closes in 2 days</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

// ============================================================================
// USE CASES SECTION
// ============================================================================

const UseCasesSection: React.FC = () => {
    const cases = [
        { icon: Calendar, title: "Meeting Scheduling", desc: "Find the best time that works for everyone", example: "When should we have the sprint planning?" },
        { icon: Coffee, title: "Lunch & Events", desc: "Decide on restaurants, venues, or activities", example: "Where should we go for team lunch?" },
        { icon: ListOrdered, title: "Feature Prioritization", desc: "Rank backlog items by team consensus", example: "Which features should we build next?" },
        { icon: Target, title: "Naming Decisions", desc: "Choose names for projects, products, or mascots", example: "What should we name the new product?" },
        { icon: Briefcase, title: "Tool Selection", desc: "Let the team weigh in on software choices", example: "Which project management tool should we use?" },
        { icon: Building2, title: "Offsite Planning", desc: "Plan team activities and locations together", example: "Where should we go for the team offsite?" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Perfect for team decisions</h2>
                    <p className="text-lg text-slate-600">From daily choices to strategic planning</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <c.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{c.title}</h3>
                            <p className="text-sm text-slate-600 mb-3">{c.desc}</p>
                            <p className="text-xs text-blue-600 italic">"{c.example}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// VOTING METHODS SECTION
// ============================================================================

const VotingMethodsSection: React.FC = () => {
    const methods = [
        {
            title: "Single Choice",
            desc: "Each person picks one option. Simple and fast for binary decisions.",
            best: "Quick decisions, yes/no questions",
            icon: "☝️"
        },
        {
            title: "Multiple Choice",
            desc: "Each person can select multiple options. Great for availability.",
            best: "Meeting scheduling, preference gathering",
            icon: "✅"
        },
        {
            title: "Ranked Choice",
            desc: "Rank options by preference. Finds the option with broadest support.",
            best: "Prioritization, fair elections",
            icon: "🏆"
        },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose your voting method</h2>
                    <p className="text-lg text-slate-600">Different decisions need different approaches</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {methods.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition">
                            <div className="text-4xl mb-4">{m.icon}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{m.title}</h3>
                            <p className="text-slate-600 mb-4">{m.desc}</p>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">
                                    <strong className="text-blue-600">Best for:</strong> {m.best}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// SHARING SECTION
// ============================================================================

const SharingSection: React.FC = () => (
    <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Share anywhere your team is</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { name: "Slack", icon: "💬", desc: "Paste link in any channel" },
                    { name: "Microsoft Teams", icon: "👥", desc: "Share in team chats" },
                    { name: "Email", icon: "📧", desc: "Send to distribution lists" },
                    { name: "Any messaging app", icon: "📱", desc: "WhatsApp, Discord, etc." },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 text-center">
                        <div className="text-4xl mb-3">{s.icon}</div>
                        <h3 className="font-bold text-slate-900 mb-1">{s.name}</h3>
                        <p className="text-sm text-slate-600">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection: React.FC = () => {
    const faqs = [
        { q: "Do team members need accounts?", a: "No. Team members just click the link and vote - no signup, no app downloads, no friction." },
        { q: "Can votes be anonymous?", a: "Yes. Toggle anonymous mode so no one (including you) can see who voted for what." },
        { q: "How do I prevent double voting?", a: "Multiple options: browser cookies, IP limits, shared PIN, or email verification. Choose based on your needs." },
        { q: "What's ranked choice voting?", a: "Instead of picking one, you rank options. If no majority, lowest options are eliminated and votes redistributed until someone wins." },
        { q: "Can I set a deadline?", a: "Yes. Set an end date/time and the poll automatically closes. You can also manually close early." },
        { q: "How do I share results?", a: "Share the results link, export to CSV, or take screenshots. Results can be public or admin-only." },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">FAQ</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group bg-slate-50 rounded-xl border overflow-hidden">
                            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-slate-900 list-none">
                                {faq.q}
                                <ChevronRight className="text-slate-400 group-open:rotate-90 transition-transform" size={20} />
                            </summary>
                            <div className="px-6 pb-4 text-slate-600">{faq.a}</div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// CTA SECTION
// ============================================================================

const CTASection: React.FC = () => (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to make decisions together?</h2>
            <p className="text-xl text-blue-100 mb-8">Create a team poll in under 2 minutes. No signup required.</p>
            <a href="/create" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 font-bold text-lg rounded-xl shadow-xl hover:bg-blue-50 transition">
                <Users className="w-6 h-6" />
                Create Team Poll
                <ArrowRight className="w-6 h-6" />
            </a>
        </div>
    </section>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

const TeamVotingPage: React.FC = () => (
    <div className="min-h-screen">
        <PageSchema />
        <NavHeader />
        <HeroSection />
        <UseCasesSection />
        <VotingMethodsSection />
        <SharingSection />
        <FAQSection />
        <CTASection />
        <Footer />
    </div>
);

export default TeamVotingPage;
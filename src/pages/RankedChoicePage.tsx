// ============================================================================
// RankedChoicePage.tsx - SEO Landing Page
// Target Keywords: "ranked choice voting poll online", "ranked choice poll maker",
//                  "instant runoff voting poll", "drag and drop ranking poll"
// Location: src/components/pages/RankedChoicePage.tsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    GripVertical, ArrowRight, Users, BarChart3, 
    Clock, Zap, CheckCircle2, ChevronDown, 
    Award, ListOrdered, Shuffle, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import PremiumNav from '../components/PremiumNav';
import Footer from '../components/Footer';

// FAQ Schema
const PAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is ranked choice voting?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ranked choice voting (RCV) is a voting method where voters rank candidates or options in order of preference (1st, 2nd, 3rd, etc.) instead of selecting just one. If no option wins a majority, the option with the fewest votes is eliminated and those votes are redistributed to voters' next choices. This process continues until one option wins a majority. RCV reveals true preferences when there are multiple good options."
            }
        },
        {
            "@type": "Question",
            "name": "How do I create a ranked choice voting poll online?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "To create a ranked choice voting poll: 1) Go to a poll maker like VoteGenerator, 2) Enter your question and add all options, 3) Select 'Ranked Choice' as the poll type, 4) Share the link with voters. Voters drag and drop options to rank them in order of preference. Results show both first-choice votes and instant runoff elimination rounds."
            }
        },
        {
            "@type": "Question",
            "name": "When should I use ranked choice voting instead of regular voting?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use ranked choice voting when: you have 3+ options and want to find true consensus, you want to avoid vote splitting between similar options, you're making a group decision where minority preferences matter, or you want to see voters' full preference order rather than just their top choice. RCV is ideal for elections, prioritization, team decisions, and choosing winners from many options."
            }
        },
        {
            "@type": "Question",
            "name": "How are ranked choice voting results calculated?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ranked choice results use instant runoff calculation: First, all first-choice votes are counted. If an option has a majority (>50%), it wins. If not, the option with the fewest first-choice votes is eliminated, and those votes transfer to each voter's next choice. This repeats until one option achieves a majority. This ensures the winner has broad support rather than just the most first-place votes."
            }
        },
        {
            "@type": "Question",
            "name": "Is ranked choice voting fair?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, ranked choice voting is considered more fair than single-choice voting because it: eliminates vote splitting between similar options, ensures winners have majority support, allows voters to express full preferences without 'wasting' their vote, and reduces negative campaigning since candidates want to be voters' second choice too. RCV is used in government elections in places like Alaska, Maine, and New York City."
            }
        }
    ]
};

const RankedChoicePage: React.FC = () => {
    const navigate = useNavigate();
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
        document.title = "Free Ranked Choice Voting Poll Maker | Create RCV Polls Online";
    }, []);

    const useCases = [
        { icon: Award, title: "Elections & Voting", desc: "Club officers, board elections, student government. Find winners with true majority support." },
        { icon: ListOrdered, title: "Prioritization", desc: "Rank features, project priorities, or agenda items. See your team's true preference order." },
        { icon: Users, title: "Group Decisions", desc: "Where to eat, vacation destinations, team names. Get consensus without endless debates." },
        { icon: Target, title: "Contests & Awards", desc: "Best of lists, award nominations, competition rankings. Fair results from multiple judges." }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Schema */}
            <script 
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_SCHEMA) }}
            />

            {/* Navigation */}
            {tier === 'free' ? <NavHeader /> : <PremiumNav tier={tier} />}

            {/* Hero */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <ListOrdered size={16} />
                            Ranked Choice Voting
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            Free Ranked Choice<br />Voting Poll Maker
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
                            Create ranked choice polls where voters drag and drop to rank options. 
                            Instant runoff results reveal true preferences. Free, no signup required.
                        </p>
                        <button
                            onClick={() => navigate('/create')}
                            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg"
                        >
                            Create Ranked Choice Poll
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Quick Answer */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-indigo-600" />
                            What is Ranked Choice Voting?
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            <strong>Ranked choice voting (RCV)</strong> lets voters rank options in order of preference (1st, 2nd, 3rd) 
                            instead of selecting just one. If no option wins a majority, the lowest-ranked option is eliminated and 
                            those votes transfer to each voter's next choice. This continues until one option wins. RCV is used in 
                            government elections in Alaska, Maine, and New York City because it finds winners with true majority support.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-4">
                        How Ranked Choice Voting Works
                    </h2>
                    <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
                        Voters drag and drop to rank options. Results show the true winner through instant runoff.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: 1, title: "Voters Rank Options", desc: "Each voter drags and drops all options into their preferred order: 1st choice, 2nd choice, 3rd choice, and so on." },
                            { step: 2, title: "First Choices Counted", desc: "All first-choice votes are tallied. If any option has more than 50% of votes, it wins immediately." },
                            { step: 3, title: "Instant Runoff", desc: "If no majority, the option with fewest votes is eliminated. Those votes transfer to voters' next choices. Repeat until a winner emerges." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Visual Demo */}
                    <div className="mt-12 bg-slate-100 rounded-2xl p-6 md:p-8 max-w-md mx-auto">
                        <div className="text-sm font-bold text-slate-500 uppercase mb-4">Example: Drag to Rank</div>
                        {["🍕 Pizza", "🌮 Tacos", "🍔 Burgers", "🍣 Sushi"].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl mb-2 border-2 border-slate-200">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    {i + 1}
                                </div>
                                <span className="font-medium text-slate-700 flex-1">{item}</span>
                                <GripVertical className="text-slate-300" size={20} />
                            </div>
                        ))}
                        <p className="text-sm text-slate-500 mt-4 text-center">
                            Voters drag options into their preferred order
                        </p>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-12">
                        When to Use Ranked Choice Voting
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {useCases.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <item.icon size={24} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* vs Regular Voting */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-black text-slate-800 text-center mb-8">
                        Ranked Choice vs. Regular Voting
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left font-bold text-slate-700">Feature</th>
                                    <th className="p-4 text-center font-bold text-indigo-600">Ranked Choice</th>
                                    <th className="p-4 text-center font-bold text-slate-500">Regular Voting</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ["Shows full preferences", "✅ Yes", "❌ No"],
                                    ["Avoids vote splitting", "✅ Yes", "❌ No"],
                                    ["Winner has majority", "✅ Always", "❌ Maybe"],
                                    ["Strategic voting needed", "✅ Less", "❌ More"],
                                    ["Works with 3+ options", "✅ Perfect", "⚠️ Problematic"]
                                ].map(([feature, rcv, regular], i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-4 font-medium text-slate-700">{feature}</td>
                                        <td className="p-4 text-center">{rcv}</td>
                                        <td className="p-4 text-center">{regular}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Create Your Ranked Choice Poll Free
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        No signup required. Instant results with visual runoff rounds.
                    </p>
                    <button
                        onClick={() => navigate('/create')}
                        className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg"
                    >
                        Create Ranked Choice Poll
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default RankedChoicePage;
import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Clock,
    Users,
    BarChart3,
    Check,
    X,
    Sparkles,
    CreditCard,
    Database,
    Server
} from 'lucide-react';

const WhyChooseUs: React.FC = () => {
    const privacyFeatures = [
        {
            icon: Mail,
            title: "No Email Required",
            description: "Create polls instantly without giving us your email. We don't collect it, so we can't spam you.",
            highlight: true
        },
        {
            icon: Lock,
            title: "No Signup Needed",
            description: "Skip the account creation. Just create your poll and share the link. It's that simple.",
            highlight: true
        },
        {
            icon: EyeOff,
            title: "No Voter Tracking",
            description: "We don't store IP addresses, device fingerprints, or any personal identifiers. Your voters stay anonymous.",
            highlight: false
        },
        {
            icon: Database,
            title: "Data in Links, Not Servers",
            description: "Your poll data travels with the shareable link. We minimize what we store on our servers.",
            highlight: false
        },
        {
            icon: BarChart3,
            title: "Privacy-First Analytics",
            description: "See when votes come in, not where voters live. Analytics without the creepy tracking.",
            highlight: false
        },
        {
            icon: CreditCard,
            title: "Free Forever Tier",
            description: "No credit card required. Create unlimited polls with up to 100 responses each. Upgrade only if you need more.",
            highlight: false
        }
    ];

    const comparisonData = [
        { feature: "Create without signup", us: true, others: false },
        { feature: "No email required", us: true, others: false },
        { feature: "No voter tracking", us: true, others: false },
        { feature: "12 poll types", us: true, others: "2-5" },
        { feature: "Free unlimited polls", us: true, others: true },
        { feature: "One-time purchase option", us: true, others: false },
        { feature: "Share admin access", us: "Free", others: "Paid" },
        { feature: "Privacy-first analytics", us: true, others: false },
    ];

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4"
                    >
                        <ShieldCheck size={16} />
                        PRIVACY-FIRST BY DESIGN
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
                    >
                        Why Choose VoteGenerator?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto"
                    >
                        We built the polling tool we wished existed: fast, free, and respectful of your privacy.
                    </motion.p>
                </div>

                {/* Feature grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {privacyFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                                feature.highlight
                                    ? 'border-indigo-200 bg-indigo-50'
                                    : 'border-slate-200 bg-white hover:border-indigo-100'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                feature.highlight
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600">
                                {feature.description}
                            </p>
                            {feature.highlight && (
                                <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                                    <Sparkles size={14} />
                                    Key Differentiator
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Comparison section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                            How We Compare
                        </h3>
                        <p className="text-slate-600">
                            See how VoteGenerator stacks up against other polling tools
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                                <div className="p-4 text-sm font-semibold text-slate-600">Feature</div>
                                <div className="p-4 text-center">
                                    <div className="text-sm font-bold text-indigo-600">VoteGenerator</div>
                                </div>
                                <div className="p-4 text-center">
                                    <div className="text-sm font-semibold text-slate-500">Others</div>
                                </div>
                            </div>
                            {comparisonData.map((row, i) => (
                                <div 
                                    key={i} 
                                    className={`grid grid-cols-3 border-b border-slate-100 last:border-b-0 ${
                                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                                    }`}
                                >
                                    <div className="p-4 text-sm text-slate-700 font-medium">
                                        {row.feature}
                                    </div>
                                    <div className="p-4 flex items-center justify-center">
                                        {row.us === true ? (
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check size={14} className="text-green-600" />
                                            </div>
                                        ) : (
                                            <span className="text-sm font-semibold text-green-600">{row.us}</span>
                                        )}
                                    </div>
                                    <div className="p-4 flex items-center justify-center">
                                        {row.others === true ? (
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check size={14} className="text-green-600" />
                                            </div>
                                        ) : row.others === false ? (
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                <X size={14} className="text-red-500" />
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-500">{row.others}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Trust statement */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-2xl">
                        <ShieldCheck size={24} className="text-green-600" />
                        <span className="text-green-800 font-medium">
                            Your privacy is not our product. Your trust is.
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
// ============================================================================
// DataPolicyPage.tsx - GDPR-Compliant Privacy & Data Retention Policy
// Location: src/pages/DataPolicyPage.tsx or src/components/DataPolicyPage.tsx
//
// This page satisfies GDPR requirements for:
// - Transparent data processing information (Article 13/14)
// - Data retention periods (Article 5(1)(e) - Storage Limitation)
// - Right to erasure information (Article 17)
// - Right to data portability (Article 20)
// ============================================================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Clock, Trash2, Download, Mail, Database,
    ChevronDown, ChevronUp, AlertTriangle, Check, Lock,
    Globe, Eye, FileText, HelpCircle, ExternalLink
} from 'lucide-react';

const DataPolicyPage: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('what-we-collect');

    // Last updated date
    const lastUpdated = 'January 2026';
    const policyVersion = '1.0';

    const sections = [
        {
            id: 'what-we-collect',
            icon: Database,
            title: 'What Data We Collect',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        VoteGenerator collects minimal data necessary to provide our service. We follow the principle 
                        of <strong>data minimization</strong> - we only collect what we need.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="font-semibold text-slate-800 mb-3">For Poll Creators (You)</h4>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200">
                                    <th className="pb-2 text-slate-600">Data</th>
                                    <th className="pb-2 text-slate-600">Purpose</th>
                                    <th className="pb-2 text-slate-600">Required?</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Email address</td>
                                    <td className="py-2">Account recovery, notifications</td>
                                    <td className="py-2"><span className="text-amber-600">Only for paid plans</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Payment info</td>
                                    <td className="py-2">Process subscriptions (via Stripe)</td>
                                    <td className="py-2"><span className="text-amber-600">Only for paid plans</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Poll content</td>
                                    <td className="py-2">Display your polls</td>
                                    <td className="py-2"><span className="text-emerald-600">Yes</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2">Browser cookies</td>
                                    <td className="py-2">Remember your session</td>
                                    <td className="py-2"><span className="text-emerald-600">Essential only</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="font-semibold text-slate-800 mb-3">For Poll Voters</h4>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200">
                                    <th className="pb-2 text-slate-600">Data</th>
                                    <th className="pb-2 text-slate-600">Purpose</th>
                                    <th className="pb-2 text-slate-600">Stored?</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Vote selection</td>
                                    <td className="py-2">Record your vote</td>
                                    <td className="py-2"><span className="text-emerald-600">Yes</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">IP address</td>
                                    <td className="py-2">Prevent duplicate votes</td>
                                    <td className="py-2"><span className="text-emerald-600">Hashed only*</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Country</td>
                                    <td className="py-2">Geographic analytics</td>
                                    <td className="py-2"><span className="text-amber-600">Country code only</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2">Device type</td>
                                    <td className="py-2">Analytics (mobile/desktop)</td>
                                    <td className="py-2"><span className="text-amber-600">Category only</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2">Name</td>
                                    <td className="py-2">If poll requires names</td>
                                    <td className="py-2"><span className="text-amber-600">Only if required</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="text-xs text-slate-500 mt-3">
                            * We never store raw IP addresses. We use a one-way hash that cannot be reversed, 
                            and the hash is unique per poll (so votes cannot be correlated across polls).
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: 'retention',
            icon: Clock,
            title: 'How Long We Keep Your Data',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Under GDPR Article 5(1)(e), we must not keep your data longer than necessary. 
                        Here are our retention periods:
                    </p>

                    <div className="space-y-3">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-emerald-800">Active Polls (Paid Users)</h4>
                                    <p className="text-sm text-emerald-700">
                                        Retained while your subscription is active, plus <strong>90 days</strong> after 
                                        cancellation (grace period to reactivate).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="text-amber-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-amber-800">Active Polls (Free Users)</h4>
                                    <p className="text-sm text-amber-700">
                                        Retained for <strong>12 months</strong> from last activity. Polls with no votes 
                                        in 6 months may be automatically deleted.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText className="text-slate-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Billing Records</h4>
                                    <p className="text-sm text-slate-600">
                                        <strong>7 years</strong> - Required by tax and accounting regulations. 
                                        Stored securely by Stripe.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Lock className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-800">Deletion Request Logs</h4>
                                    <p className="text-sm text-blue-600">
                                        <strong>5 years</strong> - We keep anonymized records of deletion requests 
                                        to prove GDPR compliance. These logs contain no personal data.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Trash2 className="text-red-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-red-800">Deleted Polls</h4>
                                    <p className="text-sm text-red-600">
                                        <strong>Immediately</strong> - When you delete a poll, all associated data 
                                        (votes, comments, analytics) is permanently removed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'your-rights',
            icon: Shield,
            title: 'Your Rights (GDPR)',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Under the General Data Protection Regulation (GDPR), you have the following rights:
                    </p>

                    <div className="grid gap-3">
                        {[
                            {
                                right: 'Right to Access',
                                article: 'Article 15',
                                desc: 'Request a copy of all data we hold about you',
                                action: 'Use the Export Data button below',
                            },
                            {
                                right: 'Right to Erasure',
                                article: 'Article 17',
                                desc: 'Request deletion of all your data ("Right to be Forgotten")',
                                action: 'Use the Delete My Data button below',
                            },
                            {
                                right: 'Right to Rectification',
                                article: 'Article 16',
                                desc: 'Correct inaccurate personal data',
                                action: 'Edit your polls directly or contact us',
                            },
                            {
                                right: 'Right to Data Portability',
                                article: 'Article 20',
                                desc: 'Receive your data in a machine-readable format',
                                action: 'Export to JSON available in dashboard',
                            },
                            {
                                right: 'Right to Object',
                                article: 'Article 21',
                                desc: 'Object to certain types of processing',
                                action: 'Contact us at privacy@votegenerator.com',
                            },
                        ].map((item) => (
                            <div key={item.right} className="bg-slate-50 rounded-xl p-4 flex items-start gap-4">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check className="text-indigo-600" size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-slate-800">{item.right}</h4>
                                        <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                                            {item.article}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1">{item.desc}</p>
                                    <p className="text-xs text-indigo-600 font-medium">{item.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <h4 className="font-semibold text-indigo-800 mb-2">Exercise Your Rights</h4>
                        <p className="text-sm text-indigo-700 mb-3">
                            We respond to all GDPR requests within 30 days (or up to 90 days for complex requests, 
                            with notification).
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href="/account/data-request"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                <Download size={16} />
                                Export My Data
                            </a>
                            <a
                                href="/account/delete-request"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={16} />
                                Delete My Data
                            </a>
                            <a
                                href="mailto:privacy@votegenerator.com"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition"
                            >
                                <Mail size={16} />
                                Contact Privacy Team
                            </a>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'cookies',
            icon: Globe,
            title: 'Cookies We Use',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        We use cookies to make our service work. Under the ePrivacy Directive and GDPR, 
                        we need your consent for non-essential cookies.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b-2 border-slate-200">
                                    <th className="pb-3 text-slate-700 font-semibold">Cookie</th>
                                    <th className="pb-3 text-slate-700 font-semibold">Purpose</th>
                                    <th className="pb-3 text-slate-700 font-semibold">Duration</th>
                                    <th className="pb-3 text-slate-700 font-semibold">Type</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600">
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 font-mono text-xs">vg_user_session</td>
                                    <td className="py-3">Store your polls and dashboard access</td>
                                    <td className="py-3">1 year</td>
                                    <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Essential</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 font-mono text-xs">vg_voted_*</td>
                                    <td className="py-3">Remember which polls you've voted on</td>
                                    <td className="py-3">30 days</td>
                                    <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Essential</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 font-mono text-xs">vg_cookie_consent</td>
                                    <td className="py-3">Remember your cookie preferences</td>
                                    <td className="py-3">1 year</td>
                                    <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">Essential</span></td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 font-mono text-xs">vg_theme</td>
                                    <td className="py-3">Remember your theme preference</td>
                                    <td className="py-3">1 year</td>
                                    <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Functional</span></td>
                                </tr>
                                <tr>
                                    <td className="py-3 font-mono text-xs">_ga, _gid</td>
                                    <td className="py-3">Google Analytics (if you consent)</td>
                                    <td className="py-3">2 years</td>
                                    <td className="py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Analytics</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm text-slate-500">
                        You can change your cookie preferences at any time using the Cookie Settings link in our footer.
                    </p>
                </div>
            ),
        },
        {
            id: 'security',
            icon: Lock,
            title: 'How We Protect Your Data',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        We implement technical and organizational measures to protect your data:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {[
                            { title: 'Encryption in Transit', desc: 'All data encrypted with TLS 1.3' },
                            { title: 'Encryption at Rest', desc: 'Data encrypted on Netlify servers' },
                            { title: 'No Raw IP Storage', desc: 'Only irreversible hashes stored' },
                            { title: 'Secure Payments', desc: 'Stripe handles all payment data (PCI compliant)' },
                            { title: 'Access Controls', desc: 'Admin keys required for poll management' },
                            { title: 'Regular Audits', desc: 'Security reviewed regularly' },
                        ].map((item) => (
                            <div key={item.title} className="bg-slate-50 rounded-lg p-3">
                                <h4 className="font-medium text-slate-800 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'third-parties',
            icon: ExternalLink,
            title: 'Third-Party Services',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        We use the following third-party services that may process your data:
                    </p>

                    <div className="space-y-3">
                        {[
                            {
                                name: 'Stripe',
                                purpose: 'Payment processing',
                                data: 'Payment details, email, billing address',
                                privacy: 'https://stripe.com/privacy',
                            },
                            {
                                name: 'Netlify',
                                purpose: 'Hosting & data storage',
                                data: 'All poll data',
                                privacy: 'https://www.netlify.com/privacy/',
                            },
                            {
                                name: 'ipinfo.io',
                                purpose: 'Country detection for analytics',
                                data: 'IP address (not stored by us)',
                                privacy: 'https://ipinfo.io/privacy-policy',
                            },
                        ].map((service) => (
                            <div key={service.name} className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{service.name}</h4>
                                        <p className="text-sm text-slate-600">{service.purpose}</p>
                                        <p className="text-xs text-slate-500 mt-1">Data shared: {service.data}</p>
                                    </div>
                                    <a
                                        href={service.privacy}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        Privacy Policy <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            id: 'contact',
            icon: Mail,
            title: 'Contact Us',
            content: (
                <div className="space-y-4">
                    <p className="text-slate-600">
                        For any privacy-related questions or to exercise your GDPR rights:
                    </p>

                    <div className="bg-indigo-50 rounded-xl p-6">
                        <h4 className="font-semibold text-indigo-800 mb-3">Privacy Contact</h4>
                        <div className="space-y-2 text-sm text-indigo-700">
                            <p><strong>Email:</strong> privacy@votegenerator.com</p>
                            <p><strong>Response time:</strong> Within 30 days</p>
                            <p><strong>Data Controller:</strong> VoteGenerator</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500">
                        If you're not satisfied with our response, you have the right to lodge a complaint 
                        with your local data protection authority.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Shield className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Privacy & Data Policy</h1>
                            <p className="text-slate-500 text-sm">
                                Last updated: {lastUpdated} • Version {policyVersion}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Quick Summary */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                    <h2 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <Check size={20} />
                        Privacy at a Glance
                    </h2>
                    <ul className="text-sm text-emerald-700 space-y-1">
                        <li>✓ We never sell your data</li>
                        <li>✓ We never store raw IP addresses</li>
                        <li>✓ Free users don't need to provide email</li>
                        <li>✓ You can delete all your data anytime</li>
                        <li>✓ We're fully GDPR compliant</li>
                    </ul>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <motion.div
                            key={section.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedSection(
                                    expandedSection === section.id ? null : section.id
                                )}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <section.icon className="text-indigo-600" size={20} />
                                    </div>
                                    <h3 className="font-semibold text-slate-800">{section.title}</h3>
                                </div>
                                {expandedSection === section.id ? (
                                    <ChevronUp className="text-slate-400" size={20} />
                                ) : (
                                    <ChevronDown className="text-slate-400" size={20} />
                                )}
                            </button>

                            {expandedSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-6 pb-6 border-t border-slate-100"
                                >
                                    <div className="pt-4">
                                        {section.content}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>
                        Questions about this policy?{' '}
                        <a href="mailto:privacy@votegenerator.com" className="text-indigo-600 hover:underline">
                            Contact our privacy team
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DataPolicyPage;
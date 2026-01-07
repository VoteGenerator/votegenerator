// ============================================================================
// Footer - Comprehensive Links to All Pages
// ============================================================================

import React from 'react';
import { 
    Mail, Twitter, Linkedin,
    CheckSquare, ListOrdered, Calendar, Users, ArrowLeftRight, 
    SlidersHorizontal, Image, ClipboardList, Heart
} from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <a href="/" className="flex items-center gap-2 mb-4">
                            <img 
                                src="/logo.svg" 
                                alt="VoteGenerator" 
                                className="h-10 w-10"
                            />
                            <span className="text-xl font-bold text-white">VoteGenerator</span>
                        </a>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            Create beautiful polls and surveys in seconds. No signup required. 
                            Privacy-first by design.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/votegenerator" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition">
                                <Twitter size={18} />
                            </a>
                            <a href="https://linkedin.com/company/votegenerator" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition">
                                <Linkedin size={18} />
                            </a>
                            <a href="mailto:hello@votegenerator.com" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="/#create" className="hover:text-white transition">Create Poll</a></li>
                            <li><a href="/survey" className="hover:text-white transition">Create Survey</a></li>
                            <li><a href="/templates" className="hover:text-white transition">Templates</a></li>
                            <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                            <li><a href="/demo" className="hover:text-white transition">Live Demo</a></li>
                        </ul>
                    </div>

                    {/* Use Cases */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Use Cases</h4>
                        <ul className="space-y-3">
                            <li><a href="/employee-survey" className="hover:text-white transition">Employee Surveys</a></li>
                            <li><a href="/customer-feedback" className="hover:text-white transition">Customer Feedback</a></li>
                            <li><a href="/online-rsvp" className="hover:text-white transition">Online RSVP</a></li>
                            <li><a href="/feedback-form" className="hover:text-white transition">Feedback Forms</a></li>
                            <li><a href="/compare" className="hover:text-white transition">vs StrawPoll</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                            <li><a href="/help" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Poll Types Row */}
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <h4 className="text-white font-bold mb-4">Poll Types</h4>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'Multiple Choice', icon: CheckSquare },
                            { name: 'Ranked Choice', icon: ListOrdered },
                            { name: 'Survey', icon: ClipboardList },
                            { name: 'Meeting Poll', icon: Calendar },
                            { name: 'This or That', icon: ArrowLeftRight },
                            { name: 'Rating Scale', icon: SlidersHorizontal },
                            { name: 'RSVP', icon: Users },
                            { name: 'Visual Poll', icon: Image },
                        ].map((type) => (
                            <a 
                                key={type.name}
                                href={`/#create`}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition"
                            >
                                <type.icon size={14} className="text-indigo-400" />
                                {type.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} VoteGenerator. All rights reserved.
                        </p>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500" /> for better decisions
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
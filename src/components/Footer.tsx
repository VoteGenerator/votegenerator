// Footer.tsx - Updated with GDPR links, cookie settings, data deletion
import React from 'react';
import { Cookie, Shield, Trash2, HelpCircle } from 'lucide-react';

interface FooterProps {
    minimal?: boolean;  // For embedded/voting pages
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
    const currentYear = new Date().getFullYear();
    
    // Open cookie settings (removes consent to re-show banner)
    const openCookieSettings = () => {
        localStorage.removeItem('vg_cookie_consent');
        window.location.reload();
    };

    // Minimal footer for voting/public pages
    if (minimal) {
        return (
            <footer className="py-4 border-t border-slate-200 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                    <a href="/" className="hover:text-indigo-600">
                        Powered by <span className="font-semibold">VoteGenerator</span>
                    </a>
                    <span className="text-slate-300">|</span>
                    <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
                    <button 
                        onClick={openCookieSettings}
                        className="hover:text-indigo-600 flex items-center gap-1"
                    >
                        <Cookie size={12} />
                        Cookies
                    </button>
                </div>
            </footer>
        );
    }
    
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/create" className="hover:text-white transition">Create Poll</a></li>
                            <li><a href="/survey" className="hover:text-white transition">Survey Maker</a></li>
                            <li><a href="/templates" className="hover:text-white transition">Templates</a></li>
                            <li><a href="/pricing" className="hover:text-white transition">Pricing</a></li>
                        </ul>
                    </div>
                    
                    {/* For Creators */}
                    <div>
                        <h3 className="font-bold text-white mb-4">For Creators</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/youtube-polls" className="hover:text-white transition">YouTube Polls</a></li>
                            <li><a href="/twitch-polls" className="hover:text-white transition">Twitch Polls</a></li>
                            <li><a href="/reddit-polls" className="hover:text-white transition">Reddit Polls</a></li>
                        </ul>
                    </div>
                    
                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/help" className="hover:text-white transition flex items-center gap-1">
                                    <HelpCircle size={12} />
                                    Help Center
                                </a>
                            </li>
                            <li><a href="/how-it-works" className="hover:text-white transition">How It Works</a></li>
                            <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                            <li><a href="/recover" className="hover:text-white transition">Recover Access</a></li>
                            <li><a href="/#manage-subscription" className="hover:text-white transition">Manage Subscription</a></li>
                        </ul>
                    </div>
                    
                    {/* Company */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
                            <li>
                                <a href="/privacy" className="hover:text-white transition flex items-center gap-1">
                                    <Shield size={12} />
                                    Privacy Policy
                                </a>
                            </li>
                            <li><a href="/terms" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="/data-policy" className="hover:text-white transition">Data & Retention</a></li>
                            <li>
                                <button 
                                    onClick={openCookieSettings}
                                    className="hover:text-white transition flex items-center gap-1 text-left"
                                >
                                    <Cookie size={12} />
                                    Cookie Settings
                                </button>
                            </li>
                            <li>
                                <a href="/account/delete-request" className="hover:text-white transition flex items-center gap-1">
                                    <Trash2 size={12} />
                                    Delete My Data
                                </a>
                            </li>
                            <li><a href="/refund" className="hover:text-white transition">Refund Policy</a></li>
                        </ul>
                    </div>
                </div>
                
                {/* Bottom */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <img src="/logo.svg" alt="VoteGenerator" className="h-8 w-auto" />
                        <span className="font-bold text-white">VoteGenerator</span>
                    </a>
                    <div className="text-center md:text-right">
                        <p className="text-sm text-slate-400">
                            © {currentYear} VoteGenerator. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            🔒 GDPR Compliant • Privacy First • No Data Sold
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
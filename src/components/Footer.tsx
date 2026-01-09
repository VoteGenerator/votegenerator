// Footer.tsx - Clean version
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/create" className="hover:text-white transition">Create Poll</Link></li>
                            <li><Link to="/templates" className="hover:text-white transition">Templates</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                            <li><Link to="/survey" className="hover:text-white transition">Survey Maker</Link></li>
                        </ul>
                    </div>
                    
                    {/* For Creators */}
                    <div>
                        <h3 className="font-bold text-white mb-4">For Creators</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/youtube-polls" className="hover:text-white transition">YouTube Polls</Link></li>
                            <li><Link to="/twitch-polls" className="hover:text-white transition">Twitch Polls</Link></li>
                            <li><Link to="/reddit-polls" className="hover:text-white transition">Reddit Polls</Link></li>
                        </ul>
                    </div>
                    
                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                            <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
                            <li><a href="mailto:support@votegenerator.com" className="hover:text-white transition">Support</a></li>
                        </ul>
                    </div>
                    
                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                            <li><Link to="/refund" className="hover:text-white transition">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>
                
                {/* Bottom */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🗳️</span>
                        <span className="font-bold text-white">VoteGenerator</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        © {currentYear} VoteGenerator. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
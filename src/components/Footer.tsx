import React from 'react';
import { 
    Mail, 
    Youtube,
    Heart,
    ShieldCheck
} from 'lucide-react';

// Pinterest icon component (not in lucide)
const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    const socialLinks = [
        { icon: Youtube, href: 'https://youtube.com/@votegenerator', label: 'YouTube' },
        { icon: PinterestIcon, href: 'https://pinterest.com/votegenerator', label: 'Pinterest', isCustom: true },
        { icon: Mail, href: 'mailto:hello@votegenerator.com', label: 'Email' },
    ];
    
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-2">
                        <a href="/index.html" className="flex items-center gap-3 mb-4">
                            {/* Logo from public folder */}
                            <img src="/logo.svg" alt="VoteGenerator" className="h-8 w-auto" />
                            <span className="font-bold text-xl text-white">VoteGenerator</span>
                        </a>
                        <p className="text-slate-400 text-sm mb-4 max-w-xs">
                            The fastest way to make group decisions. Create polls in seconds, share instantly, and see results in real-time.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <ShieldCheck size={16} className="text-green-500" />
                            <span>No accounts. No tracking. Just polls.</span>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                                    rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                                    className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    {social.isCustom ? <social.icon /> : <social.icon size={18} />}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="/create.html" className="text-sm hover:text-white transition-colors">Create Poll</a></li>
                            <li><a href="/demo.html" className="text-sm hover:text-white transition-colors">Demo</a></li>
                            <li><a href="/pricing.html" className="text-sm hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="/compare.html" className="text-sm hover:text-white transition-colors">Compare</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><a href="/help.html" className="text-sm hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="/blog.html" className="text-sm hover:text-white transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="/about.html" className="text-sm hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/contact.html" className="text-sm hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Policies</h4>
                        <ul className="space-y-2">
                            <li><span className="text-sm text-slate-500">Privacy (Coming)</span></li>
                            <li><span className="text-sm text-slate-500">Terms (Coming)</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">© {currentYear} VoteGenerator. All rights reserved.</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500" /> for better decisions
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
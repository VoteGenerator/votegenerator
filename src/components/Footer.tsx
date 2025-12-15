import React from 'react';
import { 
    Mail, 
    Twitter, 
    Linkedin,
    Github,
    Heart,
    ShieldCheck
} from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com/votegenerator', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com/company/votegenerator', label: 'LinkedIn' },
        { icon: Github, href: 'https://github.com/votegenerator', label: 'GitHub' },
        { icon: Mail, href: 'mailto:hello@votegenerator.com', label: 'Email' },
    ];
    
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    <div className="col-span-2">
                        <a href="/index.html" className="flex items-center gap-2 mb-4">
                            <span className="font-bold text-xl text-white">VoteGenerator</span>
                        </a>
                        <p className="text-slate-400 text-sm mb-4 max-w-xs">
                            Create beautiful polls in seconds. No signup required. Privacy-first.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <ShieldCheck size={16} className="text-green-500" />
                            <span>Privacy-first by design</span>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="/index.html" className="text-sm hover:text-white transition-colors">Create Poll</a></li>
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
                            <li><a href="/contact.html" className="text-sm hover:text-white transition-colors">Contact Us</a></li>
                            <li><span className="text-sm text-slate-500">About Us (Coming)</span></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
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
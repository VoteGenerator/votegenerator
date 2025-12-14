import React from 'react';
import { 
    Mail, 
    Twitter, 
    Linkedin,
    Github,
    Heart,
    ShieldCheck
} from 'lucide-react';

interface FooterLink {
    label: string;
    href: string;
    coming?: boolean;
}

interface FooterLinks {
    product: FooterLink[];
    resources: FooterLink[];
    company: FooterLink[];
    legal: FooterLink[];
}

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 130;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };
    
    const footerLinks: FooterLinks = {
        product: [
            { label: 'Create Poll', href: 'poll-creator' },
            { label: 'Demo', href: 'demo-section' },
            { label: 'Pricing', href: 'pricing' },
            { label: 'Compare Plans', href: 'why-choose-us' },
            { label: 'All 12 Poll Types', href: 'demo-section' },
        ],
        resources: [
            { label: 'Help Center', href: 'poll-creator', coming: true },
            { label: 'Blog', href: 'poll-creator', coming: true },
        ],
        company: [
            { label: 'About Us', href: 'poll-creator', coming: true },
            { label: 'Contact Us', href: 'poll-creator', coming: true },
        ],
        legal: [
            { label: 'Privacy Policy', href: 'poll-creator', coming: true },
            { label: 'Terms of Service', href: 'poll-creator', coming: true },
            { label: 'Cookie Policy', href: 'poll-creator', coming: true },
        ],
    };
    
    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com/votegenerator', label: 'Twitter' },
        { icon: Linkedin, href: 'https://linkedin.com/company/votegenerator', label: 'LinkedIn' },
        { icon: Github, href: 'https://github.com/votegenerator', label: 'GitHub' },
        { icon: Mail, href: 'mailto:hello@votegenerator.com', label: 'Email' },
    ];
    
    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <img 
                                src="/logo.svg" 
                                alt="VoteGenerator" 
                                className="w-10 h-10"
                            />
                            <span className="font-bold text-xl text-white">VoteGenerator</span>
                        </a>
                        <p className="text-slate-400 text-sm mb-4 max-w-xs">
                            Create beautiful polls in seconds. No signup required. Privacy-first.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <ShieldCheck size={16} className="text-green-500" />
                            <span>Privacy-first by design</span>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Product Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={`#${link.href}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Resources Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={`#${link.href}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.coming && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">Soon</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={`#${link.href}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.coming && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">Soon</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Legal Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={`#${link.href}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.coming && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">Soon</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            © {currentYear} VoteGenerator. All rights reserved.
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for better decisions
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
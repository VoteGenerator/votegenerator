// ============================================================================
// NavHeader - Navigation with Logo from /public/logo.svg
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export interface NavHeaderProps {
    transparent?: boolean;
}

function NavHeader({ transparent = false }: NavHeaderProps): React.ReactElement {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Create Poll', href: '/create' },
        { label: 'Demo', href: '/demo' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Compare', href: '/compare' },
        { label: 'Blog', href: '/blog' },
        { label: 'Help', href: '/help' },
    ];

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' 
                : transparent ? 'bg-transparent' : 'bg-white border-b border-slate-100'
        }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - using logo.svg from public folder */}
                    <a href="/" className="flex items-center gap-2">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="h-9 w-9"
                        />
                        <span className={`text-xl font-bold ${isScrolled || !transparent ? 'text-slate-900' : 'text-white'}`}>
                            VoteGenerator
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isScrolled || !transparent
                                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="/create"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md shadow-indigo-500/25"
                        >
                            Create Free Poll
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg ${
                            isScrolled || !transparent ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href}
                                className="block px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-slate-100">
                            <a href="/create" className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-semibold rounded-xl">
                                Create Free Poll
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default NavHeader;
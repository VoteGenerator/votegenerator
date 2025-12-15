import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavHeaderProps {
    currentPage?: string;
}

const NavHeader: React.FC<NavHeaderProps> = ({ currentPage = 'create' }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-12 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2.5">
                        <img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="w-10 h-10 object-contain"
                        />
                        <span className="font-black text-xl text-slate-900 hidden sm:block">
                            VoteGenerator
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a
                            href="/"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === 'create'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            Create Poll
                        </a>
                        <a
                            href="/demo"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === 'demo'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            Demo
                        </a>
                        <a
                            href="/pricing"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === 'pricing'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            Pricing
                        </a>
                        <a
                            href="/compare"
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === 'compare'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            Compare
                        </a>
                        <a
                            href="/blog"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                            Blog
                        </a>
                        <a
                            href="/help"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                            Help
                        </a>
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <a
                            href="/"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            Create Free Poll
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <nav className="p-4 space-y-1">
                        <a href="/" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Create Poll
                        </a>
                        <a href="/demo" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Demo
                        </a>
                        <a href="/pricing" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Pricing
                        </a>
                        <a href="/compare" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Compare
                        </a>
                        <a href="/blog" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Blog
                        </a>
                        <a href="/help" className="block px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 font-medium">
                            Help
                        </a>
                        <div className="pt-3 border-t border-slate-100 mt-3">
                            <a
                                href="/"
                                className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center rounded-xl"
                            >
                                Create Free Poll
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default NavHeader;
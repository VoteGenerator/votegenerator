import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, 
    X, 
    Sparkles,
    Play,
    DollarSign,
    BookOpen,
    HelpCircle,
    ChevronDown,
    ListOrdered,
    Image,
    Calendar,
    CheckSquare,
    GitCompare
} from 'lucide-react';

interface NavHeaderProps {
    currentPage?: 'create' | 'demo' | 'pricing' | 'compare' | 'blog' | 'help';
}

const NavHeader: React.FC<NavHeaderProps> = ({ currentPage = 'create' }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pollTypesOpen, setPollTypesOpen] = useState(false);

    const navItems = [
        { id: 'create', label: 'Create Poll', href: '#', icon: Sparkles },
        { id: 'demo', label: 'Demo', href: '#demo', icon: Play },
        { id: 'pricing', label: 'Pricing', href: '#pricing', icon: DollarSign },
        { id: 'compare', label: 'Compare', href: '#compare', icon: GitCompare },
        { id: 'blog', label: 'Blog', href: '#blog', icon: BookOpen },
        { id: 'help', label: 'Help', href: '#help', icon: HelpCircle },
    ];

    const pollTypes = [
        { name: 'Ranked Choice', href: '#', icon: ListOrdered },
        { name: 'Multiple Choice', href: '#', icon: CheckSquare },
        { name: 'Visual Poll', href: '#', icon: Image, pro: true },
        { name: 'Meeting Scheduler', href: '#', icon: Calendar },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Uses your logo.svg (already purple) */}
                    <a href="#" className="flex items-center gap-2.5 group">
                        <motion.img 
                            src="/logo.svg" 
                            alt="VoteGenerator" 
                            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                            initial={{ rotate: -10, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        />
                        <span className="font-black text-xl text-slate-900 hidden sm:block">
                            VoteGenerator
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* Poll Types Dropdown */}
                        <div className="relative">
                            <button
                                onMouseEnter={() => setPollTypesOpen(true)}
                                onMouseLeave={() => setPollTypesOpen(false)}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Poll Types
                                <ChevronDown size={16} className={`transition-transform ${pollTypesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {pollTypesOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        onMouseEnter={() => setPollTypesOpen(true)}
                                        onMouseLeave={() => setPollTypesOpen(false)}
                                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                                    >
                                        {pollTypes.map((type) => (
                                            <a
                                                key={type.name}
                                                href={type.href}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors"
                                            >
                                                <type.icon size={18} className="text-indigo-500" />
                                                <span className="text-sm font-medium text-slate-700">{type.name}</span>
                                                {type.pro && (
                                                    <span className="ml-auto px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                                                        PRO
                                                    </span>
                                                )}
                                            </a>
                                        ))}
                                        <div className="border-t border-slate-100 mt-2 pt-2 px-4 pb-2">
                                            <a href="#" className="text-xs text-indigo-600 font-medium hover:underline">
                                                View all 12 poll types →
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === item.id
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <a
                            href="#"
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
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-100 bg-white"
                    >
                        <nav className="p-4 space-y-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        currentPage === item.id
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </a>
                            ))}
                            <div className="pt-3 border-t border-slate-100 mt-3">
                                <a
                                    href="#"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center rounded-xl"
                                >
                                    Create Free Poll
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavHeader;
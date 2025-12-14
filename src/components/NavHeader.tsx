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
    currentPage?: string;
}

const NavHeader: React.FC<NavHeaderProps> = ({ currentPage = 'create' }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pollTypesOpen, setPollTypesOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 130;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
        setPollTypesOpen(false);
    };

    const navItems = [
        { id: 'create', label: 'Create Poll', section: 'poll-creator', icon: Sparkles },
        { id: 'demo', label: 'Demo', section: 'demo-section', icon: Play },
        { id: 'pricing', label: 'Pricing', section: 'pricing', icon: DollarSign },
        { id: 'compare', label: 'Compare', section: 'why-choose-us', icon: GitCompare },
        { id: 'blog', label: 'Blog', section: 'poll-creator', icon: BookOpen },
        { id: 'help', label: 'Help', section: 'poll-creator', icon: HelpCircle },
    ];

    const pollTypes = [
        { name: 'Ranked Choice', icon: ListOrdered },
        { name: 'Multiple Choice', icon: CheckSquare },
        { name: 'Visual Poll', icon: Image, pro: true },
        { name: 'Meeting Scheduler', icon: Calendar },
    ];

    return (
        <header className="sticky top-12 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="flex items-center gap-2.5 group"
                    >
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
                                            <button
                                                key={type.name}
                                                onClick={() => scrollToSection('demo-section')}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                                            >
                                                <type.icon size={18} className="text-indigo-500" />
                                                <span className="text-sm font-medium text-slate-700">{type.name}</span>
                                                {type.pro && (
                                                    <span className="ml-auto px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                                                        PRO
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                        <div className="border-t border-slate-100 mt-2 pt-2 px-4 pb-2">
                                            <button 
                                                onClick={() => scrollToSection('demo-section')}
                                                className="text-xs text-indigo-600 font-medium hover:underline"
                                            >
                                                View all 12 poll types →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.section)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === item.id
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scrollToSection('poll-creator')}
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            Create Free Poll
                        </button>
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
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.section)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        currentPage === item.id
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                            <div className="pt-3 border-t border-slate-100 mt-3">
                                <button
                                    onClick={() => scrollToSection('poll-creator')}
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-center rounded-xl"
                                >
                                    Create Free Poll
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default NavHeader;
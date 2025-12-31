import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    defaultOpen?: boolean;
    headerContent?: React.ReactNode; // Additional content to show in header (stats, badges)
    accentColor?: string; // indigo, amber, green, etc.
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    defaultOpen = true,
    headerContent,
    accentColor = 'slate',
    children
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorClasses: Record<string, { border: string; bg: string; text: string; headerBg: string }> = {
        indigo: { 
            border: 'border-indigo-200', 
            bg: 'bg-indigo-50', 
            text: 'text-indigo-700',
            headerBg: 'hover:bg-indigo-50'
        },
        amber: { 
            border: 'border-amber-200', 
            bg: 'bg-amber-50', 
            text: 'text-amber-700',
            headerBg: 'hover:bg-amber-50'
        },
        green: { 
            border: 'border-green-200', 
            bg: 'bg-green-50', 
            text: 'text-green-700',
            headerBg: 'hover:bg-green-50'
        },
        purple: { 
            border: 'border-purple-200', 
            bg: 'bg-purple-50', 
            text: 'text-purple-700',
            headerBg: 'hover:bg-purple-50'
        },
        slate: { 
            border: 'border-slate-200', 
            bg: 'bg-slate-50', 
            text: 'text-slate-700',
            headerBg: 'hover:bg-slate-50'
        },
    };

    const colors = colorClasses[accentColor] || colorClasses.slate;

    return (
        <div className={`bg-white border ${colors.border} rounded-xl overflow-hidden shadow-sm`}>
            {/* Clickable Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${colors.headerBg}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center ${colors.text}`}>
                        {icon}
                    </div>
                    <h4 className="font-bold text-slate-800">{title}</h4>
                </div>
                <div className="flex items-center gap-3">
                    {/* Header content (stats, badges) */}
                    {headerContent && (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {headerContent}
                        </div>
                    )}
                    {isOpen ? (
                        <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                        <ChevronDown size={20} className="text-slate-400" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100"
                    >
                        <div className="p-5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSection;
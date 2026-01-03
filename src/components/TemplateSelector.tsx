// ============================================================================
// TemplateSelector - Beautiful template browsing and selection
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, ArrowRight, Clock, Users, CheckCircle, 
    ListOrdered, Star, Image, ArrowLeftRight, X,
    Zap, ChevronRight
} from 'lucide-react';
import { 
    POLL_TEMPLATES, 
    TEMPLATE_CATEGORIES, 
    PollTemplate,
    getTemplatesByCategory 
} from './pollTemplates';

// Icon mapping for poll types
const POLL_TYPE_ICONS: Record<string, React.ElementType> = {
    multiple: CheckCircle,
    ranked: ListOrdered,
    rating: Star,
    image: Image,
    pairwise: ArrowLeftRight,
    meeting: Clock,
    rsvp: Users,
};

// Poll type labels
const POLL_TYPE_LABELS: Record<string, string> = {
    multiple: 'Choice',
    ranked: 'Ranked',
    rating: 'Rating',
    image: 'Visual',
    pairwise: 'Compare',
    meeting: 'Schedule',
    rsvp: 'RSVP',
};

interface TemplateSelectorProps {
    onSelectTemplate: (template: PollTemplate) => void;
    onClose?: () => void;
    isModal?: boolean;
}

// Template Card Component
const TemplateCard: React.FC<{
    template: PollTemplate;
    onSelect: (template: PollTemplate) => void;
    index: number;
}> = ({ template, onSelect, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const PollTypeIcon = POLL_TYPE_ICONS[template.pollType] || CheckCircle;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            <div className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                ${isHovered 
                    ? 'border-transparent shadow-xl scale-[1.02]' 
                    : 'border-slate-200 shadow-sm'
                }
            `}>
                {/* Gradient Header */}
                <div className={`
                    relative h-32 bg-gradient-to-br ${template.gradient} p-5
                    overflow-hidden
                `}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        {template.previewStyle.bgPattern === 'dots' && (
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }} />
                        )}
                        {template.previewStyle.bgPattern === 'grid' && (
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }} />
                        )}
                        {template.previewStyle.bgPattern === 'waves' && (
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" opacity="0.1" />
                                <path d="M0,60 Q25,40 50,60 T100,60 V100 H0 Z" fill="white" opacity="0.1" />
                            </svg>
                        )}
                    </div>

                    {/* Icon & Category */}
                    <div className="relative z-10 flex items-start justify-between">
                        <motion.div 
                            className="text-4xl"
                            animate={{ 
                                rotate: isHovered ? [0, -10, 10, 0] : 0,
                                scale: isHovered ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {template.icon}
                        </motion.div>
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                            {template.categoryLabel}
                        </span>
                    </div>

                    {/* Poll Type Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <PollTypeIcon size={12} className="text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">
                            {POLL_TYPE_LABELS[template.pollType] || template.pollType}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white p-5">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                        {template.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {template.description}
                    </p>

                    {/* Preview Question */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                            Sample Question
                        </p>
                        <p className="text-slate-700 text-sm font-medium line-clamp-1">
                            "{template.question}"
                        </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {template.bestFor.slice(0, 2).map((use, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                                    {use}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={() => onSelect(template)}
                        className={`
                            w-full py-3 rounded-xl font-semibold text-sm
                            flex items-center justify-center gap-2
                            transition-all duration-300
                            ${isHovered 
                                ? `bg-gradient-to-r ${template.gradient} text-white shadow-lg` 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Sparkles size={16} />
                        Use This Template
                        <ArrowRight size={16} className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Main Template Selector
const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
    onSelectTemplate, 
    onClose,
    isModal = false 
}) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const filteredTemplates = getTemplatesByCategory(selectedCategory);

    const content = (
        <div className={isModal ? '' : 'min-h-screen bg-gradient-to-b from-slate-50 to-white'}>
            {/* Header */}
            <div className={`${isModal ? 'p-6 border-b border-slate-200' : 'pt-12 pb-8 px-4'}`}>
                <div className="max-w-5xl mx-auto">
                    {isModal && onClose && (
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    )}
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4">
                            <Zap size={16} />
                            Quick Start Templates
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Start with a Template
                        </h1>
                        <p className="text-slate-600 text-lg max-w-xl mx-auto">
                            Pre-built polls for common use cases. Pick one and customize it in seconds.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Category Pills */}
            <div className={`${isModal ? 'px-6 py-4' : 'px-4 pb-8'}`}>
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-2"
                    >
                        {TEMPLATE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                                    px-4 py-2.5 rounded-xl font-medium text-sm
                                    flex items-center gap-2 transition-all duration-200
                                    ${selectedCategory === cat.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }
                                `}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className={`${isModal ? 'px-6 pb-6 max-h-[60vh] overflow-y-auto' : 'px-4 pb-16'}`}>
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredTemplates.map((template, index) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    onSelect={onSelectTemplate}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Empty State */}
                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-slate-500">No templates in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Or Start Blank */}
            {!isModal && (
                <div className="max-w-5xl mx-auto px-4 pb-16">
                    <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">
                            Want more control? Start from scratch.
                        </p>
                        <a 
                            href="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition"
                        >
                            Create Blank Poll
                            <ChevronRight size={18} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );

    // If modal, wrap in modal container
    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                    {content}
                </motion.div>
            </div>
        );
    }

    return content;
};

export default TemplateSelector;
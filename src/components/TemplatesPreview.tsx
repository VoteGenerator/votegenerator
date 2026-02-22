// ============================================================================
// Templates Preview - Visual preview of the template selector
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
    Sparkles, ArrowRight, Clock, CheckCircle, 
    ListOrdered, Star, Image, ArrowLeftRight, Zap
} from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

// Sample templates data
const TEMPLATES = [
    {
        id: 'team-offsite',
        name: 'Team Offsite Location',
        description: 'Let your team vote on the perfect offsite destination with photos',
        category: 'Team Decisions',
        pollType: 'Visual',
        icon: '🏝️',
        gradient: 'from-cyan-500 to-blue-600',
        question: 'Where should we hold our team offsite?',
        estimatedTime: '2 min'
    },
    {
        id: 'sprint-priority',
        name: 'Sprint Priority',
        description: 'Rank features or tasks to align on what matters most',
        category: 'Team Decisions',
        pollType: 'Ranked',
        icon: '🎯',
        gradient: 'from-violet-500 to-purple-600',
        question: 'Rank these features by priority for next sprint',
        estimatedTime: '1 min'
    },
    {
        id: 'meeting-pulse',
        name: 'Meeting Pulse Check',
        description: 'Quick temperature check on how the meeting went',
        category: 'Feedback',
        pollType: 'Rating',
        icon: '💭',
        gradient: 'from-pink-500 to-rose-600',
        question: 'How useful was this meeting?',
        estimatedTime: '20 sec'
    },
    {
        id: 'event-date',
        name: 'Event Date Picker',
        description: 'Find the best date that works for everyone',
        category: 'Events',
        pollType: 'Choice',
        icon: '📅',
        gradient: 'from-blue-500 to-indigo-600',
        question: 'Which date works best for the team event?',
        estimatedTime: '30 sec'
    },
    {
        id: 'this-or-that',
        name: 'This or That',
        description: 'Fun icebreaker to spark conversations',
        category: 'Fun',
        pollType: 'Pairwise',
        icon: '🎭',
        gradient: 'from-fuchsia-500 to-pink-600',
        question: 'This or That: Get to know your team!',
        estimatedTime: '1 min'
    },
    {
        id: 'team-lunch',
        name: 'Team Lunch Vote',
        description: 'Quick poll to decide where the team should eat',
        category: 'Team Decisions',
        pollType: 'Choice',
        icon: '🍕',
        gradient: 'from-orange-500 to-red-500',
        question: 'Where should we go for team lunch?',
        estimatedTime: '30 sec'
    }
];

const CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: '✨' },
    { id: 'team', label: 'Team Decisions', icon: '👥' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'fun', label: 'Fun', icon: '🎮' },
];

// Template Card
const TemplateCard = ({ template, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${isHovered 
                    ? 'border-transparent shadow-xl scale-[1.02]' 
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }
            `}
            style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`
            }}
        >
            {/* Gradient Header */}
            <div className={`relative h-28 bg-gradient-to-br ${template.gradient} p-4 overflow-hidden`}>
                {/* Dots Pattern */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                    }}
                />
                
                <div className="relative z-10 flex items-start justify-between">
                    <div 
                        className="text-3xl transition-transform duration-300"
                        style={{ transform: isHovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1)' }}
                    >
                        {template.icon}
                    </div>
                    <span className="px-2 py-1 bg-white/25 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                        {template.category}
                    </span>
                </div>

                {/* Poll Type Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-white/90 rounded-full">
                    <span className="text-xs font-medium text-slate-700">
                        {template.pollType}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white p-4">
                <h3 className={`font-bold text-slate-900 mb-1 transition-colors ${isHovered ? 'text-indigo-600' : ''}`}>
                    {template.name}
                </h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                    {template.description}
                </p>

                {/* Preview Question */}
                <div className="bg-slate-50 rounded-lg p-2 mb-3">
                    <p className="text-slate-600 text-xs line-clamp-1">
                        "{template.question}"
                    </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{template.estimatedTime}</span>
                    </div>
                </div>

                {/* CTA */}
                <button
                    className={`
                        w-full py-2.5 rounded-xl font-semibold text-sm
                        flex items-center justify-center gap-2
                        transition-all duration-300
                        ${isHovered 
                            ? `bg-gradient-to-r ${template.gradient} text-white shadow-lg` 
                            : 'bg-slate-100 text-slate-700'
                        }
                    `}
                >
                    <Sparkles size={14} />
                    Use Template
                    <ArrowRight size={14} className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
            </div>
        </div>
    );
};

// Main Component
export default function TemplatesPreview() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            {/* Navigation */}
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}
            
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {/* Header */}
            <div className="pt-12 pb-6 px-4">
                <div className="max-w-5xl mx-auto text-center">
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
                </div>
            </div>

            {/* Category Pills */}
            <div className="px-4 pb-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-2">
                        {CATEGORIES.map((cat) => (
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
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="px-4 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {TEMPLATES.map((template, index) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Or Start Blank */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4">
                        Want more control? Start from scratch.
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition">
                        Create Blank Poll
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}
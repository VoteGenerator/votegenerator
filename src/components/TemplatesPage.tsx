// ============================================================================
// TemplatesPage - Browse and select from pre-built poll templates
// Route: /templates
// ============================================================================

import React, { useState, useEffect } from 'react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';
import TemplateSelector from './TemplateSelector';
import { PollTemplate } from './pollTemplates';

const CATEGORIES = [
    { label: 'Employee & HR', emoji: '👥', slug: 'employee-surveys', count: 17 },
    { label: 'Customer Feedback', emoji: '⭐', slug: 'customer-feedback', count: 31 },
    { label: 'Events', emoji: '🎉', slug: 'event-surveys', count: 5 },
    { label: 'Education', emoji: '🎓', slug: 'education-surveys', count: 8 },
    { label: 'Product & Tech', emoji: '🚀', slug: 'product-surveys', count: 7 },
    { label: 'Healthcare', emoji: '🏥', slug: 'healthcare-surveys', count: 3 },
    { label: 'Hospitality', emoji: '🏨', slug: 'hospitality-surveys', count: 2 },
    { label: 'Property', emoji: '🏠', slug: 'property-surveys', count: 4 },
    { label: 'Marketing', emoji: '🎯', slug: 'marketing-surveys', count: 2 },
    { label: 'Membership', emoji: '🏅', slug: 'membership-surveys', count: 2 },
    { label: 'Procurement', emoji: '📋', slug: 'procurement-surveys', count: 1 },
    { label: 'Community', emoji: '🤝', slug: 'community-surveys', count: 3 },
    { label: 'Civic & Nonprofit', emoji: '🏛️', slug: 'civic-surveys', count: 2 },
];

const TemplatesPage: React.FC = () => {
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = 'https://votegenerator.com/templates';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier as 'pro' | 'business');
        }
    }, []);

    const handleSelectTemplate = (template: PollTemplate) => {
        sessionStorage.setItem('vg_selected_template', JSON.stringify(template));
        window.location.href = '/create?template=' + template.id;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}

            {/* ── Category Hub ── */}
            <div className="max-w-7xl mx-auto px-4 pt-10 pb-2">
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Browse by Category</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Jump straight to the templates you need</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        
                            key={cat.slug}
                            href={`/templates/${cat.slug}/`}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-full text-sm font-medium text-slate-700 hover:text-indigo-700 transition-all shadow-sm"
                        >
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                            <span className="text-xs text-slate-400 font-normal">{cat.count}</span>
                        </a>
                    ))}
                </div>
            </div>

            <TemplateSelector
                onSelectTemplate={handleSelectTemplate}
                isModal={false}
            />
            <Footer />
        </div>
    );
};

export default TemplatesPage;
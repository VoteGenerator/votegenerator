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

useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'https://votegenerator.com/templates';
  document.head.appendChild(link);
  return () => { document.head.removeChild(link); };
}, []);

const TemplatesPage: React.FC = () => {
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);
    
    const handleSelectTemplate = (template: PollTemplate) => {
        // Store template in sessionStorage for create page to pick up
        sessionStorage.setItem('vg_selected_template', JSON.stringify(template));
        // Redirect to create page with template flag
        window.location.href = '/create?template=' + template.id;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}
            <TemplateSelector 
                onSelectTemplate={handleSelectTemplate}
                isModal={false}
            />
            <Footer />
        </div>
    );
};

export default TemplatesPage;
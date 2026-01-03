// ============================================================================
// TemplatesPage - Browse and select from pre-built poll templates
// Route: /templates
// ============================================================================

import React from 'react';
import NavHeader from './NavHeader';
import Footer from './Footer';
import TemplateSelector from './TemplateSelector';
import { PollTemplate } from './pollTemplates';

const TemplatesPage: React.FC = () => {
    
    const handleSelectTemplate = (template: PollTemplate) => {
        // Store template in sessionStorage for create page to pick up
        sessionStorage.setItem('vg_selected_template', JSON.stringify(template));
        // Redirect to create page with template flag
        window.location.href = '/create?template=' + template.id;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <NavHeader />
            <TemplateSelector 
                onSelectTemplate={handleSelectTemplate}
                isModal={false}
            />
            <Footer />
        </div>
    );
};

export default TemplatesPage;
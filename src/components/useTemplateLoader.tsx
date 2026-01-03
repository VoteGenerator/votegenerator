// ============================================================================
// useTemplateLoader - Hook to load template data on create page
// ============================================================================

import { useEffect, useState } from 'react';
import { PollTemplate, getTemplateById } from './pollTemplates';

interface TemplateData {
    template: PollTemplate | null;
    isFromTemplate: boolean;
}

export const useTemplateLoader = (): TemplateData => {
    const [template, setTemplate] = useState<PollTemplate | null>(null);

    useEffect(() => {
        // Check URL params
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('template');

        if (templateId) {
            // First check sessionStorage (for full template data)
            const storedTemplate = sessionStorage.getItem('vg_selected_template');
            if (storedTemplate) {
                try {
                    const parsed = JSON.parse(storedTemplate);
                    setTemplate(parsed);
                    // Clear it after loading
                    sessionStorage.removeItem('vg_selected_template');
                    return;
                } catch (e) {
                    console.error('Error parsing template:', e);
                }
            }

            // Fallback: load by ID from templates data
            const foundTemplate = getTemplateById(templateId);
            if (foundTemplate) {
                setTemplate(foundTemplate);
            }
        }
    }, []);

    return {
        template,
        isFromTemplate: template !== null,
    };
};

// ============================================================================
// Integration Example for VoteGeneratorCreate.tsx
// ============================================================================
/*
INTEGRATION STEPS:

1. Import the hook and template types:
   import { useTemplateLoader } from './useTemplateLoader';
   import { PollTemplate } from './pollTemplates';

2. Use the hook in your component:
   const { template, isFromTemplate } = useTemplateLoader();

3. Apply template data to state in useEffect:
   useEffect(() => {
       if (template) {
           setTitle(template.question);
           setPollType(template.pollType);
           setOptions(template.options);
           // Apply settings
           if (template.settings?.allowMultiple !== undefined) {
               setAllowMultiple(template.settings.allowMultiple);
           }
           if (template.settings?.hideResults !== undefined) {
               setHideResults(template.settings.hideResults);
           }
       }
   }, [template]);

4. Show template indicator in UI:
   {isFromTemplate && template && (
       <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 flex items-center gap-3">
           <span className="text-2xl">{template.icon}</span>
           <div>
               <p className="text-sm font-semibold text-indigo-900">
                   Using template: {template.name}
               </p>
               <p className="text-xs text-indigo-600">
                   Customize the content below
               </p>
           </div>
       </div>
   )}
*/

// ============================================================================
// StartFromTemplateButton - Add to create page header
// ============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Sparkles, X } from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import { PollTemplate } from './pollTemplates';

interface StartFromTemplateButtonProps {
    onSelectTemplate: (template: PollTemplate) => void;
}

export const StartFromTemplateButton: React.FC<StartFromTemplateButtonProps> = ({ 
    onSelectTemplate 
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (template: PollTemplate) => {
        onSelectTemplate(template);
        setShowModal(false);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="
                    inline-flex items-center gap-2 px-4 py-2.5
                    bg-gradient-to-r from-indigo-50 to-purple-50
                    border-2 border-indigo-200 hover:border-indigo-400
                    text-indigo-700 font-semibold text-sm rounded-xl
                    transition-all hover:shadow-md
                "
            >
                <LayoutTemplate size={18} />
                Start from Template
                <Sparkles size={14} className="text-indigo-400" />
            </button>

            <AnimatePresence>
                {showModal && (
                    <TemplateSelector
                        onSelectTemplate={handleSelect}
                        onClose={() => setShowModal(false)}
                        isModal={true}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

// ============================================================================
// TemplateBadge - Show which template is being used
// ============================================================================

interface TemplateBadgeProps {
    template: PollTemplate;
    onClear?: () => void;
}

export const TemplateBadge: React.FC<TemplateBadgeProps> = ({ template, onClear }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                bg-gradient-to-r ${template.gradient} 
                rounded-xl p-4 mb-6 text-white
                flex items-center justify-between
            `}
        >
            <div className="flex items-center gap-3">
                <span className="text-3xl">{template.icon}</span>
                <div>
                    <p className="font-bold text-lg">{template.name}</p>
                    <p className="text-white/80 text-sm">
                        Customize everything below
                    </p>
                </div>
            </div>
            {onClear && (
                <button 
                    onClick={onClear}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title="Clear template"
                >
                    <X size={20} />
                </button>
            )}
        </motion.div>
    );
};

export default StartFromTemplateButton;
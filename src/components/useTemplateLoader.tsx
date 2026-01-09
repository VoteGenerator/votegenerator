// ============================================================================
// useTemplateLoader - Hook for loading poll templates from URL params
// FIXED: Added onSelectTemplate prop to StartFromTemplateButton
// ============================================================================

import React, { useState, useEffect } from 'react';
import { PollTemplate, getTemplateById, POLL_TEMPLATES } from './pollTemplates';
import { X, LayoutTemplate, Sparkles } from 'lucide-react';

// Hook to load template from URL params
export const useTemplateLoader = () => {
    const [template, setTemplate] = useState<PollTemplate | null>(null);
    const [isFromTemplate, setIsFromTemplate] = useState(false);

    useEffect(() => {
        // Check URL params for template ID
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('template');
        
        if (templateId) {
            // Try exact match first
            let foundTemplate = getTemplateById(templateId);
            
            // If not found, try matching by slug (name converted to kebab-case)
            if (!foundTemplate) {
                foundTemplate = POLL_TEMPLATES.find(t => 
                    t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === templateId.toLowerCase() ||
                    t.id === templateId.toLowerCase()
                );
            }
            
            // If still not found, try partial match
            if (!foundTemplate) {
                foundTemplate = POLL_TEMPLATES.find(t => 
                    t.name.toLowerCase().includes(templateId.toLowerCase().replace(/-/g, ' ')) ||
                    templateId.toLowerCase().includes(t.id.toLowerCase())
                );
            }
            
            if (foundTemplate) {
                setTemplate(foundTemplate);
                setIsFromTemplate(true);
            }
        }
    }, []);

    return { template, isFromTemplate, setTemplate };
};

// Badge component to show when using a template
interface TemplateBadgeProps {
    template: PollTemplate;
    onClear: () => void;
}

export const TemplateBadge: React.FC<TemplateBadgeProps> = ({ template, onClear }) => {
    if (!template) return null;
    
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm">
            <LayoutTemplate size={14} className="text-indigo-600" />
            <span className="text-indigo-700 font-medium">
                Using: {template.name}
            </span>
            <button 
                onClick={onClear}
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
                title="Clear template"
            >
                <X size={14} />
            </button>
        </div>
    );
};

// Button to start from template (used on landing pages and create page)
// FIXED: Added onSelectTemplate prop for callback-based usage
interface StartFromTemplateButtonProps {
    templateId?: string;
    className?: string;
    children?: React.ReactNode;
    onSelectTemplate?: (template: PollTemplate) => void;
}

export const StartFromTemplateButton: React.FC<StartFromTemplateButtonProps> = ({ 
    templateId, 
    className = '',
    children,
    onSelectTemplate
}) => {
    // If onSelectTemplate is provided, render a button that opens template picker
    if (onSelectTemplate) {
        return (
            <button
                type="button"
                onClick={() => {
                    // Navigate to templates page or show modal
                    // For now, redirect to templates page
                    window.location.href = '/templates';
                }}
                className={className || "flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 transition-colors"}
            >
                <Sparkles size={16} />
                {children || 'Start from Template'}
            </button>
        );
    }
    
    // Otherwise, use templateId for link-based usage
    if (!templateId) {
        return (
            <a
                href="/templates"
                className={className || "flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl text-sm font-semibold border-2 border-dashed border-indigo-200 transition-colors"}
            >
                <Sparkles size={16} />
                {children || 'Browse Templates'}
            </a>
        );
    }
    
    const template = getTemplateById(templateId);
    
    if (!template) {
        console.warn(`Template not found: ${templateId}`);
        return null;
    }
    
    return (
        <a
            href={`/create?template=${templateId}`}
            className={className}
        >
            {children || template.name}
        </a>
    );
};

// Helper to generate template URL
export const getTemplateUrl = (templateId: string): string => {
    return `/create?template=${templateId}`;
};

// Helper to generate template URL from name (for landing pages)
export const getTemplateUrlFromName = (name: string): string => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/create?template=${slug}`;
};

export default useTemplateLoader;
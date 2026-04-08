import React from 'react';
import { SurveySection } from '../../types';

// ============================================================================
// CATEGORY REGISTRY — add new categories here as you expand
// ============================================================================
export const TEMPLATE_CATEGORIES = {
    employee:    { label: 'Employee & HR',        emoji: '👥' },
    customer:    { label: 'Customer Feedback',    emoji: '⭐' },
    events:      { label: 'Events & Planning',    emoji: '🎉' },
    education:   { label: 'Education',            emoji: '📚' },
    product:     { label: 'Product & Business',   emoji: '🚀' },
    healthcare:  { label: 'Healthcare',           emoji: '🏥' },
    community:   { label: 'Community',            emoji: '🤝' },
    fun:         { label: 'Fun & Social',         emoji: '🎮' },
    hospitality: { label: 'Hospitality',          emoji: '🏨' },
} as const;

export type TemplateCategory = keyof typeof TEMPLATE_CATEGORIES;

// ============================================================================
// SURVEY TEMPLATE INTERFACE
// ============================================================================
export interface SurveyTemplate {
    id: string;                  // URL param: /survey?template=employee-engagement
    name: string;
    emoji: string;               // Used in UI pickers
    icon?: React.ElementType;    // Optional lucide icon for existing UI
    color: string;
    description: string;
    category: TemplateCategory;  // Typed — catches typos at compile time
    targetKeyword?: string;
    priority?: 'P1' | 'P2' | 'P3';
    conversionHook?: string;
    planGate?: 'free' | 'pro';
    sections: SurveySection[];
    recommendedSettings?: {
        anonymousMode?: boolean;
        showProgress?: boolean;
        allowBack?: boolean;
    };
}
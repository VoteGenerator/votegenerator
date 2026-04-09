import { SurveyTemplate } from './_types';

// ============================================================================
// TENANT SATISFACTION SURVEY
// Keyword: tenant satisfaction survey, landlord feedback form (1k-5k/mo)
// ============================================================================
const TENANT_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'tenant-satisfaction',
    name: 'Tenant Satisfaction Survey',
    emoji: '🏠',
    color: 'text-green-700',
    description: 'Know how tenants really feel — 9 questions on condition, maintenance, and renewal intent',
    category: 'property',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ts-property',
            title: 'Property & Condition',
            description: 'Physical quality, maintenance, and safety',
            questions: [
                {
                    id: 'ts-q1',
                    type: 'scale',
                    question: 'How satisfied are you with your home or property overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ts-q2',
                    type: 'scale',
                    question: 'How well is the property maintained and kept in good condition?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'ts-q3',
                    type: 'scale',
                    question: 'How quickly and effectively are maintenance requests resolved?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'ts-service',
            title: 'Service & Communication',
            description: 'How the landlord or management team performs',
            questions: [
                {
                    id: 'ts-q4',
                    type: 'scale',
                    question: 'How would you rate the communication and responsiveness of the property management team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ts-q5',
                    type: 'scale',
                    question: 'How safe and secure do you feel in your home and building?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unsafe',
                    maxLabel: 'Very safe',
                    required: true,
                },
                {
                    id: 'ts-q6',
                    type: 'scale',
                    question: 'How satisfied are you with the quality of any communal or shared areas?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                },
            ],
        },
        {
            id: 'ts-renewal',
            title: 'Value & Renewal',
            description: 'Whether tenants plan to stay',
            questions: [
                {
                    id: 'ts-q7',
                    type: 'scale',
                    question: 'How would you rate the overall value for money of your tenancy?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'ts-q8',
                    type: 'scale',
                    question: 'How likely are you to renew your tenancy or lease when it is due?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unlikely',
                    maxLabel: 'Very likely',
                    required: true,
                },
                {
                    id: 'ts-q9',
                    type: 'textarea',
                    question: 'What is the one thing we could improve to make your tenancy experience better?',
                    placeholder: 'Your feedback helps us improve the property and service...',
                },
            ],
        },
    ],
};

export const PROPERTY_TEMPLATES: SurveyTemplate[] = [
    TENANT_SATISFACTION_TEMPLATE,
];
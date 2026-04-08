import { SurveyTemplate } from './_types';
 
const PRODUCT_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'product-feedback',
    name: 'Product Feedback Survey',
    emoji: '🚀',
    color: 'text-lime-600',
    description: 'Satisfaction, NPS, usability, and top roadmap priority in 8 questions',
    category: 'product',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'pf-overall',
            title: 'Overall',
            description: 'How do you feel about the product?',
            questions: [
                {
                    id: 'pf-q1',
                    type: 'scale',
                    question: 'How satisfied are you with this product overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'pf-q2',
                    type: 'scale',
                    question: 'How likely are you to recommend this product to a colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'pf-q3',
                    type: 'multiple_choice',
                    question: 'How would you describe your level of usage?',
                    options: [
                        { id: 'daily',    text: 'Daily' },
                        { id: 'weekly',   text: 'Several times a week' },
                        { id: 'monthly',  text: 'Weekly' },
                        { id: 'rarely',   text: 'Monthly or less' },
                    ],
                    required: true,
                },
            ],
        },
        {
            id: 'pf-experience',
            title: 'Your Experience',
            description: 'Tell us what matters to you',
            questions: [
                {
                    id: 'pf-q4',
                    type: 'multiple_choice',
                    question: 'What do you value most about this product? (select all that apply)',
                    options: [
                        { id: 'features',     text: 'Core functionality' },
                        { id: 'ease',         text: 'Ease of use' },
                        { id: 'time',         text: 'Time saved' },
                        { id: 'price',        text: 'Price / value' },
                        { id: 'reliability',  text: 'Reliability' },
                        { id: 'integrations', text: 'Integrations' },
                    ],
                    allowMultiple: true,
                },
                {
                    id: 'pf-q5',
                    type: 'scale',
                    question: 'How easy is this product to use?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'pf-q6',
                    type: 'scale',
                    question: 'How well does this product meet your needs?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Completely',
                    required: true,
                },
            ],
        },
        {
            id: 'pf-roadmap',
            title: 'Help Us Improve',
            description: 'Shape what we build next',
            questions: [
                {
                    id: 'pf-q7',
                    type: 'multiple_choice',
                    question: 'What is the one thing you\'d most like us to improve?',
                    options: [
                        { id: 'mobile',  text: 'Better mobile experience' },
                        { id: 'speed',   text: 'Faster performance' },
                        { id: 'integr',  text: 'More integrations' },
                        { id: 'ui',      text: 'Improved UI / UX' },
                        { id: 'features',text: 'More features' },
                        { id: 'docs',    text: 'Better documentation' },
                        { id: 'price',   text: 'Lower pricing' },
                    ],
                    required: true,
                },
                {
                    id: 'pf-q8',
                    type: 'textarea',
                    question: 'Any other feedback for the product team?',
                    placeholder: 'Your thoughts help us build better...',
                },
            ],
        },
    ],
};
 
export const PRODUCT_TEMPLATES: SurveyTemplate[] = [
    PRODUCT_FEEDBACK_TEMPLATE,
    // Add future product templates here: feature request, usability, sprint retro, etc.
];
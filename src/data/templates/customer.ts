import { Star, TrendingUp, MessageSquare } from 'lucide-react';
import { SurveyTemplate } from './_types';
 
const CSAT_SURVEY_TEMPLATE: SurveyTemplate = {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction (CSAT)',
    emoji: '⭐',
    icon: Star,
    color: 'text-amber-600',
    description: 'Measure NPS, satisfaction, and collect feedback',
    category: 'customer',
    targetKeyword: 'customer satisfaction survey template',
    priority: 'P1',
    conversionHook: 'Pro: CSV export + response timeline for trend tracking',
    planGate: 'free',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'csat-nps',
            title: 'Overall Experience',
            description: 'Tell us about your experience',
            questions: [
                {
                    id: 'csat-q1',
                    type: 'scale',
                    question: 'How likely are you to recommend us to a friend or colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'csat-q2',
                    type: 'rating',
                    question: 'How satisfied are you with our product/service overall?',
                    required: true,
                },
            ],
        },
        {
            id: 'csat-details',
            title: 'Specific Feedback',
            description: 'Help us understand what matters',
            questions: [
                {
                    id: 'csat-q3',
                    type: 'rating',
                    question: 'How would you rate the quality of our product/service?',
                    required: true,
                },
                {
                    id: 'csat-q4',
                    type: 'rating',
                    question: 'How would you rate our customer support?',
                },
                {
                    id: 'csat-q5',
                    type: 'rating',
                    question: 'How would you rate the value for money?',
                },
                {
                    id: 'csat-q6',
                    type: 'multiple_choice',
                    question: 'What do you like most about us?',
                    options: [
                        { id: 'quality',     text: 'Product quality' },
                        { id: 'price',       text: 'Competitive pricing' },
                        { id: 'support',     text: 'Customer support' },
                        { id: 'ease',        text: 'Ease of use' },
                        { id: 'reliability', text: 'Reliability' },
                    ],
                    allowMultiple: true,
                },
            ],
        },
        {
            id: 'csat-improve',
            title: 'How Can We Improve?',
            description: 'Your feedback shapes our roadmap',
            questions: [
                {
                    id: 'csat-q7',
                    type: 'multiple_choice',
                    question: 'What could we improve?',
                    options: [
                        { id: 'product',    text: 'Product features' },
                        { id: 'price',      text: 'Pricing' },
                        { id: 'support',    text: 'Customer support' },
                        { id: 'docs',       text: 'Documentation' },
                        { id: 'onboarding', text: 'Onboarding' },
                    ],
                    allowMultiple: true,
                },
                {
                    id: 'csat-q8',
                    type: 'textarea',
                    question: 'What is the main reason for your score?',
                    placeholder: 'Tell us more...',
                },
                {
                    id: 'csat-q9',
                    type: 'textarea',
                    question: 'What is one thing you wish we did differently?',
                    placeholder: 'Your suggestion...',
                },
            ],
        },
        {
            id: 'csat-followup',
            title: 'Stay Connected',
            description: 'Optional follow-up',
            questions: [
                {
                    id: 'csat-q10',
                    type: 'yes_no',
                    question: 'Would you be open to a follow-up conversation?',
                },
                {
                    id: 'csat-q11',
                    type: 'email',
                    question: 'Your email (optional)',
                    placeholder: 'your@email.com',
                },
            ],
        },
    ],
};
 
const NPS_QUICK_TEMPLATE: SurveyTemplate = {
    id: 'nps-quick',
    name: 'Quick NPS Survey',
    emoji: '📈',
    icon: TrendingUp,
    color: 'text-indigo-600',
    description: 'Simple NPS with one follow-up question',
    category: 'customer',
    targetKeyword: 'NPS survey template',
    priority: 'P1',
    conversionHook: 'Pro: timeline analytics to track NPS over time',
    planGate: 'free',
    sections: [
        {
            id: 'nps',
            title: 'Quick Feedback',
            questions: [
                {
                    id: 'nps-q1',
                    type: 'scale',
                    question: 'How likely are you to recommend us to a friend or colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'nps-q2',
                    type: 'textarea',
                    question: 'What is the main reason for your score?',
                    placeholder: 'Tell us more...',
                },
            ],
        },
    ],
};
 
const POST_PURCHASE_TEMPLATE: SurveyTemplate = {
    id: 'post-purchase',
    name: 'Post-Purchase Feedback',
    emoji: '🛍️',
    icon: MessageSquare,
    color: 'text-amber-600',
    description: 'Collect feedback after a purchase',
    category: 'customer',
    targetKeyword: 'post purchase survey template',
    priority: 'P2',
    conversionHook: 'Pro: timeline to compare satisfaction across product launches',
    planGate: 'free',
    sections: [
        {
            id: 'pp-experience',
            title: 'Your Purchase Experience',
            questions: [
                {
                    id: 'pp-q1',
                    type: 'rating',
                    question: 'How was your overall shopping experience?',
                    required: true,
                },
                {
                    id: 'pp-q2',
                    type: 'rating',
                    question: 'How easy was it to find what you were looking for?',
                    required: true,
                },
                {
                    id: 'pp-q3',
                    type: 'rating',
                    question: 'How satisfied are you with the checkout process?',
                },
            ],
        },
        {
            id: 'pp-product',
            title: 'Product Satisfaction',
            questions: [
                {
                    id: 'pp-q4',
                    type: 'rating',
                    question: 'How satisfied are you with the product quality?',
                    required: true,
                },
                {
                    id: 'pp-q5',
                    type: 'scale',
                    question: 'How likely are you to recommend this product?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Very likely',
                },
                {
                    id: 'pp-q6',
                    type: 'yes_no',
                    question: 'Would you buy from us again?',
                },
            ],
        },
        {
            id: 'pp-comments',
            title: 'Additional Comments',
            questions: [
                {
                    id: 'pp-q7',
                    type: 'textarea',
                    question: 'Any other feedback or suggestions?',
                    placeholder: 'We appreciate your thoughts...',
                },
            ],
        },
    ],
};
 
export const CUSTOMER_TEMPLATES: SurveyTemplate[] = [
    CSAT_SURVEY_TEMPLATE,
    NPS_QUICK_TEMPLATE,
    POST_PURCHASE_TEMPLATE,
    // Add future customer templates here: churn survey, CES, brand perception, etc.
];
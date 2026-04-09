import { SurveyTemplate } from './_types';

// ============================================================================
// VENDOR EVALUATION SURVEY
// Keyword: vendor evaluation survey, supplier evaluation form (1k-5k/mo)
// ============================================================================
const VENDOR_EVALUATION_TEMPLATE: SurveyTemplate = {
    id: 'vendor-evaluation',
    name: 'Vendor Evaluation Survey',
    emoji: '📋',
    color: 'text-yellow-600',
    description: 'Score suppliers on delivery, quality, communication, value, and compliance',
    category: 'procurement',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 've-performance',
            title: 'Delivery & Quality',
            description: 'Core performance dimensions',
            questions: [
                {
                    id: 've-q1',
                    type: 'scale',
                    question: 'How reliably does this vendor deliver on time and as promised?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Never on time',
                    maxLabel: 'Always reliable',
                    required: true,
                },
                {
                    id: 've-q2',
                    type: 'scale',
                    question: 'How consistently does the product or service meet the quality standards agreed?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Never meets standard',
                    maxLabel: 'Consistently exceeds',
                    required: true,
                },
                {
                    id: 've-q3',
                    type: 'scale',
                    question: 'How responsive and professional is this vendor\'s communication and support?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 've-q4',
                    type: 'scale',
                    question: 'How would you rate the value for money relative to the contract terms?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
            ],
        },
        {
            id: 've-compliance',
            title: 'Compliance & Relationship',
            description: 'Contract adherence and partnership quality',
            questions: [
                {
                    id: 've-q5',
                    type: 'scale',
                    question: 'How well does this vendor comply with contract requirements, SLAs, and agreed standards?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Non-compliant',
                    maxLabel: 'Fully compliant',
                    required: true,
                },
                {
                    id: 've-q6',
                    type: 'scale',
                    question: 'How would you rate the overall working relationship and partnership with this vendor?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Strategic partner',
                    required: true,
                },
                {
                    id: 've-q7',
                    type: 'scale',
                    question: 'How effectively does this vendor handle issues, complaints, or escalations?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 've-overall',
            title: 'Overall & Renewal',
            description: 'Overall rating and contract decision',
            questions: [
                {
                    id: 've-q8',
                    type: 'scale',
                    question: 'How would you rate this vendor\'s overall performance over the evaluation period?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Unacceptable',
                    maxLabel: 'Outstanding',
                    required: true,
                },
                {
                    id: 've-q9',
                    type: 'yes_no',
                    question: 'Would you recommend renewing or extending the contract with this vendor?',
                    required: true,
                },
            ],
        },
    ],
};

export const PROCUREMENT_TEMPLATES: SurveyTemplate[] = [
    VENDOR_EVALUATION_TEMPLATE,
];
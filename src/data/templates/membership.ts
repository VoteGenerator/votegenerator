import { SurveyTemplate } from './_types';

// ============================================================================
// MEMBERSHIP SATISFACTION SURVEY
// Keyword: membership satisfaction survey (1k-5k/mo)
// ============================================================================
const MEMBERSHIP_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'membership-satisfaction',
    name: 'Membership Satisfaction Survey',
    emoji: '🏅',
    color: 'text-violet-700',
    description: 'Know which members won\'t renew 60 days before it\'s too late — 9 questions',
    category: 'membership',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ms-experience',
            title: 'Membership Experience',
            description: 'Quality, value, and community',
            questions: [
                {
                    id: 'ms-q1',
                    type: 'scale',
                    question: 'How satisfied are you with your membership overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ms-q2',
                    type: 'scale',
                    question: 'How would you rate the quality of facilities, services, or resources included in your membership?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ms-q3',
                    type: 'scale',
                    question: 'How fairly priced do you feel your membership is for what you receive?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'ms-q4',
                    type: 'scale',
                    question: 'How strong is your sense of community and belonging as a member?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very weak',
                    maxLabel: 'Very strong',
                    required: true,
                },
            ],
        },
        {
            id: 'ms-service',
            title: 'Staff & Communication',
            description: 'Support and member communications',
            questions: [
                {
                    id: 'ms-q5',
                    type: 'scale',
                    question: 'How helpful and responsive is the team when you need support or have a question?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ms-q6',
                    type: 'scale',
                    question: 'How satisfied are you with the communication and updates you receive as a member?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ms-q7',
                    type: 'scale',
                    question: 'How satisfied are you with the programmes, classes, or events available to members?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'ms-renewal',
            title: 'Renewal Intent',
            description: 'The commercial retention metric',
            questions: [
                {
                    id: 'ms-q8',
                    type: 'scale',
                    question: 'How likely are you to renew your membership when it is due?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unlikely',
                    maxLabel: 'Very likely',
                    required: true,
                },
                {
                    id: 'ms-q9',
                    type: 'textarea',
                    question: 'What one improvement would make you significantly more likely to stay a member?',
                    placeholder: 'Be specific — what would make the biggest difference to your membership?',
                },
            ],
        },
    ],
};

export const MEMBERSHIP_TEMPLATES: SurveyTemplate[] = [
    MEMBERSHIP_SATISFACTION_TEMPLATE,
];
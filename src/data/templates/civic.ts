import { SurveyTemplate } from './_types';

// ============================================================================
// COMMUNITY SATISFACTION SURVEY
// Keywords: community satisfaction survey, local council survey,
//           resident satisfaction survey, housing association feedback (1k-10k vol)
// ============================================================================

const COMMUNITY_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'community-satisfaction',
    name: 'Community Satisfaction Survey',
    emoji: '🏘️',
    color: 'text-teal-700',
    description: 'Resident voice with data behind it — 10 questions for councils, housing associations & nonprofits',
    category: 'civic',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'cs-services',
            title: 'Services & Safety',
            description: 'Quality of local services and perceived safety',
            questions: [
                {
                    id: 'cs-q1',
                    type: 'scale',
                    question: 'How satisfied are you with the quality of local services in your area?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'cs-q2',
                    type: 'scale',
                    question: 'How safe do you feel in your local area, day and night?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unsafe',
                    maxLabel: 'Very safe',
                    required: true,
                },
                {
                    id: 'cs-q3',
                    type: 'scale',
                    question: 'How would you rate the quality of roads, pavements, parks, and public spaces?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'cs-engagement',
            title: 'Communication & Belonging',
            description: 'Voice, inclusion, and community cohesion',
            questions: [
                {
                    id: 'cs-q4',
                    type: 'scale',
                    question: 'How well does your local council or organisation keep you informed and listen to your views?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'cs-q5',
                    type: 'scale',
                    question: 'How strong is your sense of community and belonging in this area?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very weak',
                    maxLabel: 'Very strong',
                    required: true,
                },
                {
                    id: 'cs-q6',
                    type: 'scale',
                    question: 'How good is your access to local facilities such as libraries, leisure centres, and green spaces?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'cs-overall',
            title: 'Value & Recommendation',
            description: 'Value for money, overall satisfaction, and NPS',
            questions: [
                {
                    id: 'cs-q7',
                    type: 'scale',
                    question: 'How well do local services represent value for money for council tax or membership fees paid?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'cs-q8',
                    type: 'scale',
                    question: 'Overall, how satisfied are you with your local area or organisation?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'cs-q9',
                    type: 'scale',
                    question: 'How likely are you to recommend this area or organisation to someone considering moving here?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'cs-q10',
                    type: 'textarea',
                    question: 'What is the one thing that would most improve your community or local area?',
                    placeholder: 'Your suggestion goes directly to decision-makers...',
                },
            ],
        },
    ],
};

// ============================================================================
// NONPROFIT IMPACT SURVEY
// Keywords: nonprofit impact survey, charity beneficiary feedback,
//           grant reporting survey, beneficiary satisfaction form (1k-10k vol)
// ============================================================================

const NONPROFIT_IMPACT_TEMPLATE: SurveyTemplate = {
    id: 'nonprofit-impact',
    name: 'Nonprofit Impact Survey',
    emoji: '💛',
    color: 'text-rose-700',
    description: 'Measure the difference you make — 10 questions for grant reporting and beneficiary voice',
    category: 'civic',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ni-quality',
            title: 'Programme Quality & Support',
            description: 'Staff effectiveness and programme delivery',
            questions: [
                {
                    id: 'ni-q1',
                    type: 'scale',
                    question: 'How would you rate the overall quality of the programme or support you received?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ni-q2',
                    type: 'scale',
                    question: 'How well did the staff or volunteers listen to you and understand your needs?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Exceptionally well',
                    required: true,
                },
                {
                    id: 'ni-q3',
                    type: 'scale',
                    question: 'How well has this programme helped you work towards your goals?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Greatly helped',
                    required: true,
                },
            ],
        },
        {
            id: 'ni-dignity',
            title: 'Dignity, Safety & Access',
            description: 'How people feel while participating',
            questions: [
                {
                    id: 'ni-q4',
                    type: 'scale',
                    question: 'How much did you feel treated with dignity and respect throughout?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Completely',
                    required: true,
                },
                {
                    id: 'ni-q5',
                    type: 'scale',
                    question: 'How safe and comfortable did you feel taking part in this programme?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not safe',
                    maxLabel: 'Very safe',
                    required: true,
                },
                {
                    id: 'ni-q6',
                    type: 'scale',
                    question: 'How easy was it to access and take part in this programme?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
            ],
        },
        {
            id: 'ni-impact',
            title: 'Impact & Outcomes',
            description: 'Connection, practical difference, and recommendation',
            questions: [
                {
                    id: 'ni-q7',
                    type: 'scale',
                    question: 'How much more connected or less alone do you feel as a result of taking part?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'No change',
                    maxLabel: 'Much more connected',
                    required: true,
                },
                {
                    id: 'ni-q8',
                    type: 'scale',
                    question: 'How much of a practical difference has this programme made to your daily life?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'No difference',
                    maxLabel: 'A huge difference',
                    required: true,
                },
                {
                    id: 'ni-q9',
                    type: 'scale',
                    question: 'How likely are you to recommend this programme to someone in a similar situation?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ni-q10',
                    type: 'textarea',
                    question: 'In your own words — what difference has this programme made for you?',
                    placeholder: 'Share your experience — your words help us improve the programme and secure future funding...',
                },
            ],
        },
    ],
};

// ============================================================================
// EXPORT
// ============================================================================
export const CIVIC_TEMPLATES: SurveyTemplate[] = [
    COMMUNITY_SATISFACTION_TEMPLATE,
    NONPROFIT_IMPACT_TEMPLATE,
];
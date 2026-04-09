import { SurveyTemplate } from './_types';

// ============================================================================
// HOTEL GUEST SATISFACTION SURVEY
// Keywords: hotel guest satisfaction survey, hotel feedback form (10k-100k vol)
// ============================================================================

const HOTEL_GUEST_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'hotel-guest-satisfaction',
    name: 'Hotel Guest Satisfaction Survey',
    emoji: '🏨',
    color: 'text-blue-600',
    description: 'Understand exactly what guests loved, what fell short, and who is planning to return',
    category: 'hospitality',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'hg-arrival',
            title: 'Arrival & Check-In',
            description: 'First impressions matter',
            questions: [
                {
                    id: 'hg-q1',
                    type: 'scale',
                    question: 'How would you rate your check-in experience?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'hg-q2',
                    type: 'scale',
                    question: 'How friendly and helpful was the front desk team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Extremely',
                    required: true,
                },
            ],
        },
        {
            id: 'hg-room',
            title: 'Room & Facilities',
            description: 'Your accommodation experience',
            questions: [
                {
                    id: 'hg-q3',
                    type: 'scale',
                    question: 'How would you rate the cleanliness and condition of your room?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'hg-q4',
                    type: 'scale',
                    question: 'How comfortable was your bed and overall sleep quality?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very uncomfortable',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'hg-q5',
                    type: 'scale',
                    question: 'How satisfied were you with the hotel amenities (Wi-Fi, gym, pool, etc.)?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'hg-dining',
            title: 'Dining & Service',
            description: 'Food, drink, and staff throughout your stay',
            questions: [
                {
                    id: 'hg-q6',
                    type: 'scale',
                    question: 'How would you rate the food and beverage quality during your stay?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'hg-q7',
                    type: 'scale',
                    question: 'How responsive and helpful were hotel staff throughout your stay?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Extremely',
                    required: true,
                },
            ],
        },
        {
            id: 'hg-overall',
            title: 'Overall & Value',
            description: 'The full picture',
            questions: [
                {
                    id: 'hg-q8',
                    type: 'scale',
                    question: 'How would you rate the value for money of your stay?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'hg-q9',
                    type: 'scale',
                    question: 'How likely are you to recommend this hotel to a friend or colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'hg-q10',
                    type: 'textarea',
                    question: 'Is there anything specific we could improve to make your next stay even better?',
                    placeholder: 'Your feedback goes directly to our management team...',
                },
            ],
        },
    ],
};

export const HOSPITALITY_TEMPLATES: SurveyTemplate[] = [
    HOTEL_GUEST_SATISFACTION_TEMPLATE,
];
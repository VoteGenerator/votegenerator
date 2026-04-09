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

// museum-visitor-survey → hospitality.ts
export const MUSEUM_VISITOR_TEMPLATE: SurveyTemplate = {
  id: 'museum-visitor-survey',
  name: 'Museum Visitor Survey',
  emoji: '🏛️',
  color: 'text-stone-700',
  description: 'Exhibition quality, signage, staff helpfulness, facilities, value, and NPS for museums, galleries, and heritage sites.',
  category: 'hospitality',
  recommendedSettings: { anonymousMode: true, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'mv-visit',
      title: 'Your Visit',
      description: 'How was your experience today?',
      questions: [
        { id: 'mv-q1', type: 'scale', question: 'How satisfied are you with your overall visit today?', minValue: 1, maxValue: 5, minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied', required: true },
        { id: 'mv-q2', type: 'scale', question: 'How would you rate the quality and interest of the exhibitions?', minValue: 1, maxValue: 5, minLabel: 'Very poor', maxLabel: 'Excellent', required: true },
        { id: 'mv-q3', type: 'scale', question: 'How easy was it to navigate the museum and find what you were looking for?', minValue: 1, maxValue: 5, minLabel: 'Very difficult', maxLabel: 'Very easy', required: true },
        { id: 'mv-q4', type: 'scale', question: 'How helpful and knowledgeable were the museum staff?', minValue: 1, maxValue: 5, minLabel: 'Very poor', maxLabel: 'Excellent', required: true },
        { id: 'mv-q5', type: 'scale', question: 'How satisfied are you with the facilities — cafe, shop, toilets, and accessibility?', minValue: 1, maxValue: 5, minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied', required: true },
        { id: 'mv-q6', type: 'scale', question: 'How well did your visit represent value for the entry price?', minValue: 1, maxValue: 5, minLabel: 'Poor value', maxLabel: 'Excellent value', required: true },
      ],
    },
    {
      id: 'mv-loyalty',
      title: 'Return and Recommend',
      description: 'Would you visit again?',
      questions: [
        { id: 'mv-q7', type: 'scale', question: 'How likely are you to visit us again?', minValue: 1, maxValue: 5, minLabel: 'Very unlikely', maxLabel: 'Definitely returning', required: true },
        { id: 'mv-q8', type: 'nps', question: 'How likely are you to recommend this museum to a friend or family member?', minValue: 0, maxValue: 10, required: true },
        { id: 'mv-q9', type: 'textarea', question: 'What is one thing we could do to make your next visit even better?', placeholder: 'Your feedback helps us improve for every visitor...', required: false },
      ],
    },
  ],
};


export const HOSPITALITY_TEMPLATES: SurveyTemplate[] = [
    HOTEL_GUEST_SATISFACTION_TEMPLATE,
    MUSEUM_VISITOR_TEMPLATE,
];
import { SurveyTemplate } from './_types';
 
export const HOSPITALITY_TEMPLATES: SurveyTemplate[] = [
    // Add  templates here: 

import { SurveyTemplate } from './_types';
 
const HOTEL_GUEST_TEMPLATE: SurveyTemplate = {
    id: 'hotel-feedback',
    name: 'Hotel Guest Satisfaction Survey',
    emoji: '🏨',
    color: 'text-amber-700',
    description: '9 questions — know how guests feel before they post online',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'hg-stay',
            title: 'Your Stay',
            description: 'How was your experience from arrival to departure?',
            questions: [
                {
                    id: 'hg-q1',
                    type: 'rating',
                    question: 'How would you rate your overall stay with us?',
                    required: true,
                },
                {
                    id: 'hg-q2',
                    type: 'rating',
                    question: 'How would you rate the check-in experience?',
                    required: true,
                },
                {
                    id: 'hg-q3',
                    type: 'rating',
                    question: 'How would you rate your room quality and comfort?',
                    required: true,
                },
                {
                    id: 'hg-q4',
                    type: 'rating',
                    question: 'How would you rate the cleanliness of your room and the property?',
                    required: true,
                },
                {
                    id: 'hg-q5',
                    type: 'rating',
                    question: 'How would you rate the service provided by our staff?',
                    required: true,
                },
                {
                    id: 'hg-q6',
                    type: 'rating',
                    question: 'How would you rate the value for money of your stay?',
                    required: true,
                },
            ],
        },
        {
            id: 'hg-loyalty',
            title: 'Would You Return?',
            description: 'Help us understand your loyalty',
            questions: [
                {
                    id: 'hg-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend us to friends or family?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'hg-q8',
                    type: 'yes_no',
                    question: 'Would you choose to stay with us again?',
                    required: true,
                },
            ],
        },
        {
            id: 'hg-feedback',
            title: 'Open Feedback',
            description: 'Help us improve',
            questions: [
                {
                    id: 'hg-q9',
                    type: 'textarea',
                    question: 'Is there anything we could improve to make your next visit even better?',
                    placeholder: 'Your candid feedback helps us improve for your next visit...',
                },
            ],
        },
    ],
};

];
 
export const HOSPITALITY_TEMPLATES: SurveyTemplate[] = [
    HOTEL_GUEST_TEMPLATE,
];
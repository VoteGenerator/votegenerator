import { SurveyTemplate } from './_types';
 
export const COMMUNITY_TEMPLATES: SurveyTemplate[] = [

    const VOLUNTEER_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'volunteer-feedback',
    name: 'Volunteer Feedback Survey',
    emoji: '🤝',
    color: 'text-orange-500',
    description: 'Know what keeps volunteers coming back — and what\'s quietly losing them',
    category: 'community',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'vf-experience',
            title: 'Your Experience',
            description: 'How did your volunteering go?',
            questions: [
                {
                    id: 'vf-q1',
                    type: 'scale',
                    question: 'How would you rate your overall volunteering experience with us?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'vf-q2',
                    type: 'scale',
                    question: 'How well did we communicate with you before, during, and after your volunteer shift?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'vf-q3',
                    type: 'yes_no',
                    question: 'Did you feel your contribution made a meaningful difference?',
                    required: true,
                },
            ],
        },
        {
            id: 'vf-support',
            title: 'Support & Belonging',
            description: 'Did you have what you needed?',
            questions: [
                {
                    id: 'vf-q4',
                    type: 'scale',
                    question: 'How well were you supported and prepared for your volunteer role?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'vf-q5',
                    type: 'scale',
                    question: 'Did you feel welcomed and included as part of the team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Absolutely',
                    required: true,
                },
            ],
        },
        {
            id: 'vf-retention',
            title: 'Looking Ahead',
            description: 'Will you return?',
            questions: [
                {
                    id: 'vf-q6',
                    type: 'scale',
                    question: 'How likely are you to volunteer with us again?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unlikely',
                    maxLabel: 'Very likely',
                    required: true,
                },
                {
                    id: 'vf-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend volunteering with us to a friend?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'vf-q8',
                    type: 'textarea',
                    question: 'What is one thing we could do to improve the volunteering experience?',
                    placeholder: 'Your honest answer helps us improve for every future volunteer...',
                },
            ],
        },
    ],
};
 
];

export const COMMUNITY_TEMPLATES: SurveyTemplate[] = [
    VOLUNTEER_FEEDBACK_TEMPLATE,
];
    // Add community templates here: volunteer feedback, neighbourhood poll, etc.

 
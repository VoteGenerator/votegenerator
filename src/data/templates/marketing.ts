import { SurveyTemplate } from './_types';

// ============================================================================
// BRAND AWARENESS SURVEY
// Keyword: brand awareness survey template (5k-10k/mo)
// ============================================================================
const BRAND_AWARENESS_TEMPLATE: SurveyTemplate = {
    id: 'brand-awareness',
    name: 'Brand Awareness Survey',
    emoji: '🎯',
    color: 'text-orange-600',
    description: 'Unaided recall, aided recognition, brand associations, and purchase intent',
    category: 'marketing',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ba-recall',
            title: 'Brand Recall',
            description: 'Unaided and aided awareness',
            questions: [
                {
                    id: 'ba-q1',
                    type: 'textarea',
                    question: 'When you think of [your category], which brands come to mind? List as many as you can.',
                    placeholder: 'E.g. Apple, Nike, Spotify...',
                },
                {
                    id: 'ba-q2',
                    type: 'yes_no',
                    question: 'Have you heard of [your brand name]?',
                    required: true,
                },
                {
                    id: 'ba-q3',
                    type: 'scale',
                    question: 'How familiar are you with [your brand name]?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Never heard of it',
                    maxLabel: 'Use it regularly',
                    required: true,
                },
            ],
        },
        {
            id: 'ba-perception',
            title: 'Brand Perception',
            description: 'Associations, quality, and competitive positioning',
            questions: [
                {
                    id: 'ba-q4',
                    type: 'textarea',
                    question: 'What is the first word or phrase that comes to mind when you think of [your brand]?',
                    placeholder: 'Just one word or short phrase...',
                },
                {
                    id: 'ba-q5',
                    type: 'scale',
                    question: 'How would you rate [your brand] on quality compared to alternatives in this category?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Much lower quality',
                    maxLabel: 'Much higher quality',
                    required: true,
                },
                {
                    id: 'ba-q6',
                    type: 'scale',
                    question: 'How likely are you to consider [your brand] for your next purchase in this category?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unlikely',
                    maxLabel: 'Very likely',
                    required: true,
                },
            ],
        },
        {
            id: 'ba-advocacy',
            title: 'Advocacy & Discovery',
            description: 'NPS and how you found the brand',
            questions: [
                {
                    id: 'ba-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend [your brand] to someone you know?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ba-q8',
                    type: 'multiple_choice',
                    question: 'How did you first hear about [your brand]?',
                    options: [
                        { id: 'social',    text: 'Social media / ads' },
                        { id: 'search',    text: 'Search engine (Google/Bing)' },
                        { id: 'wom',       text: 'Word of mouth / recommendation' },
                        { id: 'article',   text: 'Industry article or blog post' },
                        { id: 'event',     text: 'Trade show or event' },
                        { id: 'podcast',   text: 'Podcast or video' },
                        { id: 'dontknow',  text: 'I don\'t remember' },
                    ],
                },
                {
                    id: 'ba-q9',
                    type: 'textarea',
                    question: 'What would make you more likely to choose [your brand] over alternatives?',
                    placeholder: 'Share your honest thoughts...',
                },
            ],
        },
    ],
};

export const MARKETING_TEMPLATES: SurveyTemplate[] = [
    BRAND_AWARENESS_TEMPLATE,
];
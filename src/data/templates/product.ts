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

const PRODUCT_MARKET_FIT_TEMPLATE: SurveyTemplate = {
    id: 'product-market-fit',
    name: 'Product-Market Fit Survey',
    emoji: '📊',
    color: 'text-green-600',
    description: 'The Sean Ellis PMF test — know if you\'ve hit 40% before you scale',
    category: 'product',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'pmf-core',
            title: 'The PMF Test',
            description: 'The Sean Ellis disappointment question',
            questions: [
                {
                    id: 'pmf-q1',
                    type: 'multiple_choice',
                    question: 'How would you feel if you could no longer use this product?',
                    options: [
                        { id: 'very',       text: 'Very disappointed — I use it all the time and it\'d be a real loss' },
                        { id: 'somewhat',   text: 'Somewhat disappointed — I\'d look for alternatives' },
                        { id: 'not',        text: 'Not disappointed — I don\'t rely on it that much' },
                        { id: 'no-longer',  text: 'I no longer use this product' },
                    ],
                    required: true,
                },
                {
                    id: 'pmf-q2',
                    type: 'scale',
                    question: 'How likely are you to recommend this product to a friend or colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
            ],
        },
        {
            id: 'pmf-why',
            title: 'Why You Use It',
            description: 'Understanding primary value and user persona',
            questions: [
                {
                    id: 'pmf-q3',
                    type: 'textarea',
                    question: 'What is the primary benefit you get from this product?',
                    placeholder: 'E.g. Saves me 2 hours a week on reporting...',
                },
                {
                    id: 'pmf-q4',
                    type: 'textarea',
                    question: 'What type of person do you think benefits most from this product?',
                    placeholder: 'E.g. Product managers at B2B SaaS companies...',
                },
                {
                    id: 'pmf-q5',
                    type: 'textarea',
                    question: 'How would you describe this product to a friend?',
                    placeholder: 'In your own words, what does this product do?',
                },
                {
                    id: 'pmf-q6',
                    type: 'multiple_choice',
                    question: 'Which best describes the alternative you would use if this product disappeared?',
                    options: [
                        { id: 'build',       text: 'Build something myself or use spreadsheets' },
                        { id: 'competitor',  text: 'Switch to a competitor product' },
                        { id: 'before',      text: 'Go back to how I handled it before this product' },
                        { id: 'without',     text: 'I would simply go without' },
                    ],
                    required: true,
                },
            ],
        },
        {
            id: 'pmf-improve',
            title: 'Help Us Improve',
            description: 'What would move your score toward "very disappointed"',
            questions: [
                {
                    id: 'pmf-q7',
                    type: 'textarea',
                    question: 'What is the main thing we could improve or add to better serve your needs?',
                    placeholder: 'Be as specific as possible...',
                },
                {
                    id: 'pmf-q8',
                    type: 'multiple_choice',
                    question: 'How often do you use this product?',
                    options: [
                        { id: 'daily-multi', text: 'Multiple times a day' },
                        { id: 'daily',       text: 'Daily' },
                        { id: 'weekly-sev',  text: 'Several times a week' },
                        { id: 'weekly',      text: 'Once a week' },
                        { id: 'monthly',     text: 'A few times a month' },
                    ],
                    required: true,
                },
            ],
        },
    ],
};
 

// ============================================================================
// WEBSITE FEEDBACK SURVEY
// Keyword: website feedback survey (5,000/mo)
// ============================================================================
const WEBSITE_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'website-feedback',
    name: 'Website Feedback Survey',
    emoji: '🌐',
    color: 'text-violet-600',
    description: '8 questions — find out why visitors leave without converting',
    category: 'product',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'wb-experience',
            title: 'Your Experience',
            description: 'How was the website to use?',
            questions: [
                {
                    id: 'wb-q1',
                    type: 'scale',
                    question: 'How easy was it to find what you were looking for on this website?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'wb-q2',
                    type: 'scale',
                    question: 'How would you rate the overall design and visual clarity of the website?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'wb-q3',
                    type: 'scale',
                    question: 'How trustworthy does this website feel to you?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Very trustworthy',
                    required: true,
                },
                {
                    id: 'wb-q4',
                    type: 'scale',
                    question: 'How would you rate the website on mobile and tablet?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                },
                {
                    id: 'wb-q5',
                    type: 'yes_no',
                    question: 'Did you accomplish what you came to this website to do?',
                    required: true,
                },
            ],
        },
        {
            id: 'wb-loyalty',
            title: 'Recommendation & Return',
            description: 'Would you come back?',
            questions: [
                {
                    id: 'wb-q6',
                    type: 'scale',
                    question: 'How likely are you to recommend this website to a friend or colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'wb-q7',
                    type: 'yes_no',
                    question: 'Would you return to this website in the future?',
                    required: true,
                },
            ],
        },
        {
            id: 'wb-improve',
            title: 'Improvement',
            description: 'What would you change?',
            questions: [
                {
                    id: 'wb-q8',
                    type: 'textarea',
                    question: 'What is the one thing we could improve to make your experience better?',
                    placeholder: 'Be specific — what would you change?',
                },
            ],
        },
    ],
};

// ============================================================================
// MARKET RESEARCH SURVEY
// Keyword: market research survey template (10,000/mo)
// ============================================================================
const MARKET_RESEARCH_TEMPLATE: SurveyTemplate = {
    id: 'market-research',
    name: 'Market Research Survey',
    emoji: '📊',
    color: 'text-blue-700',
    description: 'Consumer needs, purchase drivers, concept validation, and price sensitivity — 10 questions',
    category: 'product',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'mr-market',
            title: 'Market & Needs',
            description: 'Category involvement and unmet needs',
            questions: [
                {
                    id: 'mr-q1',
                    type: 'multiple_choice',
                    question: 'How often do you encounter the need this product category addresses?',
                    options: [
                        { id: 'daily-multi', text: 'Multiple times a day' },
                        { id: 'daily',       text: 'Daily' },
                        { id: 'weekly-sev',  text: 'Several times a week' },
                        { id: 'weekly',      text: 'Weekly' },
                        { id: 'monthly',     text: 'A few times a month' },
                        { id: 'rarely',      text: 'Rarely' },
                    ],
                    required: true,
                },
                {
                    id: 'mr-q2',
                    type: 'textarea',
                    question: 'What is the biggest challenge or frustration you face with current solutions in this area?',
                    placeholder: 'E.g. It takes too long to set up, lacks X feature...',
                },
                {
                    id: 'mr-q3',
                    type: 'multiple_choice',
                    question: 'What are the most important factors when you choose a solution in this category?',
                    options: [
                        { id: 'price',       text: 'Price / value for money' },
                        { id: 'ease',        text: 'Ease of use' },
                        { id: 'speed',       text: 'Speed / performance' },
                        { id: 'reliability', text: 'Reliability / accuracy' },
                        { id: 'support',     text: 'Customer support quality' },
                        { id: 'integration', text: 'Integration with other tools' },
                        { id: 'brand',       text: 'Brand reputation' },
                        { id: 'features',    text: 'Features and functionality' },
                    ],
                    required: true,
                },
                {
                    id: 'mr-q4',
                    type: 'textarea',
                    question: 'Which solutions or products have you used in this category in the past 12 months?',
                    placeholder: 'Just name any tools you\'ve tried — no need for detail...',
                },
            ],
        },
        {
            id: 'mr-price',
            title: 'Price & Discovery',
            description: 'Pricing sensitivity and channel research',
            questions: [
                {
                    id: 'mr-q5',
                    type: 'multiple_choice',
                    question: 'What would you expect to pay for an excellent solution in this category per month?',
                    options: [
                        { id: 'under10',   text: 'Under £10/month' },
                        { id: '10-20',     text: '£10–£20/month' },
                        { id: '20-50',     text: '£20–£50/month' },
                        { id: '50-100',    text: '£50–£100/month' },
                        { id: '100-200',   text: '£100–£200/month' },
                        { id: 'free-only', text: 'I would not pay for this' },
                    ],
                    required: true,
                },
                {
                    id: 'mr-q6',
                    type: 'multiple_choice',
                    question: 'Where do you typically discover or hear about new solutions in this category?',
                    options: [
                        { id: 'wom',       text: 'Word of mouth / recommendation' },
                        { id: 'search',    text: 'Online search (Google)' },
                        { id: 'social',    text: 'Social media' },
                        { id: 'pubs',      text: 'Industry publications / blogs' },
                        { id: 'events',    text: 'Events and conferences' },
                        { id: 'podcast',   text: 'Podcasts or YouTube' },
                        { id: 'review',    text: 'Product review sites (G2, Capterra)' },
                    ],
                    required: true,
                },
            ],
        },
        {
            id: 'mr-validation',
            title: 'Concept Validation',
            description: 'Product concept interest and NPS of existing alternatives',
            questions: [
                {
                    id: 'mr-q7',
                    type: 'scale',
                    question: 'How interested would you be in [describe your product concept here]?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not interested',
                    maxLabel: 'Extremely interested',
                    required: true,
                },
                {
                    id: 'mr-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend your current solution to someone with a similar need?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'mr-q9',
                    type: 'multiple_choice',
                    question: 'Which best describes your role or occupation?',
                    options: [
                        { id: 'founder',   text: 'Founder / CEO / Director' },
                        { id: 'pm',        text: 'Product Manager' },
                        { id: 'marketer',  text: 'Marketer / Growth' },
                        { id: 'engineer',  text: 'Engineer / Developer' },
                        { id: 'designer',  text: 'Designer' },
                        { id: 'sales',     text: 'Sales / Customer Success' },
                        { id: 'ops',       text: 'Operations / Finance' },
                        { id: 'other',     text: 'Other' },
                    ],
                    required: true,
                },
                {
                    id: 'mr-q10',
                    type: 'textarea',
                    question: 'What else would you like us to know about your needs in this area?',
                    placeholder: 'Share whatever comes to mind...',
                },
            ],
        },
    ],
};

// ============================================================================
// IT SUPPORT SURVEY
// Keyword: IT support satisfaction survey, helpdesk survey (1k-5k/mo)
// ============================================================================
const IT_SUPPORT_TEMPLATE: SurveyTemplate = {
    id: 'it-support',
    name: 'IT Support Survey',
    emoji: '🖥️',
    color: 'text-green-600',
    description: 'CSAT and FCR from the moment a ticket closes — 8 questions',
    category: 'product',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'it-speed',
            title: 'Speed & Resolution',
            description: 'Response time and resolution quality',
            questions: [
                {
                    id: 'it-q1',
                    type: 'scale',
                    question: 'How would you rate your overall support experience?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'it-q2',
                    type: 'scale',
                    question: 'How satisfied were you with the speed of the initial response to your request?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very slow',
                    maxLabel: 'Very fast',
                    required: true,
                },
                {
                    id: 'it-q3',
                    type: 'scale',
                    question: 'How satisfied were you with the speed at which your issue was resolved?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very slow',
                    maxLabel: 'Very fast',
                    required: true,
                },
            ],
        },
        {
            id: 'it-quality',
            title: 'Quality & Communication',
            description: 'Technical quality and agent communication',
            questions: [
                {
                    id: 'it-q4',
                    type: 'scale',
                    question: 'How would you rate the technical quality of the solution provided?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'it-q5',
                    type: 'scale',
                    question: 'How clearly was the support agent communicating with you throughout?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
                {
                    id: 'it-q6',
                    type: 'scale',
                    question: 'How easy was it to submit your support request?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
            ],
        },
        {
            id: 'it-fcr',
            title: 'Resolution & Feedback',
            description: 'FCR indicator and open feedback',
            questions: [
                {
                    id: 'it-q7',
                    type: 'yes_no',
                    question: 'Was your issue fully resolved?',
                    required: true,
                },
                {
                    id: 'it-q8',
                    type: 'textarea',
                    question: 'Is there anything we could improve about your support experience?',
                    placeholder: 'Be specific — this goes directly to the IT team...',
                },
            ],
        },
    ],
};

// ============================================================================
// APP USABILITY SURVEY
// Keyword: app usability survey, UX feedback survey (1k-5k/mo)
// ============================================================================
const APP_USABILITY_TEMPLATE: SurveyTemplate = {
    id: 'app-usability',
    name: 'App Usability Survey',
    emoji: '⚡',
    color: 'text-violet-600',
    description: 'Find UX friction before users find the cancel button — 10 questions per release',
    category: 'product',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'au-workflow',
            title: 'Workflow & Navigation',
            description: 'Task completion and feature discoverability',
            questions: [
                {
                    id: 'au-q1',
                    type: 'scale',
                    question: 'How easy is it to complete the tasks you need to do in the app?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'au-q2',
                    type: 'scale',
                    question: 'How easy is it to find features and navigate the app?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very hard to find',
                    maxLabel: 'Always easy to find',
                    required: true,
                },
                {
                    id: 'au-q3',
                    type: 'scale',
                    question: 'How satisfied are you with the app\'s speed and performance?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'au-interface',
            title: 'Interface & Mobile',
            description: 'Visual design, mobile experience, and errors',
            questions: [
                {
                    id: 'au-q4',
                    type: 'scale',
                    question: 'How clear and intuitive is the app\'s visual design and layout?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very confusing',
                    maxLabel: 'Very clear',
                    required: true,
                },
                {
                    id: 'au-q5',
                    type: 'scale',
                    question: 'How well does the app work on mobile and smaller screens?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'au-q6',
                    type: 'scale',
                    question: 'How helpful and clear are error messages when something goes wrong?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not helpful',
                    maxLabel: 'Very helpful',
                    required: true,
                },
            ],
        },
        {
            id: 'au-overall',
            title: 'Onboarding, NPS & Feedback',
            description: 'Onboarding effectiveness, overall rating, and open UX feedback',
            questions: [
                {
                    id: 'au-q7',
                    type: 'scale',
                    question: 'How well did the app help you get started and understand how to use it?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'au-q8',
                    type: 'scale',
                    question: 'How would you rate the overall usability of the app?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'au-q9',
                    type: 'scale',
                    question: 'How likely are you to recommend this app to a colleague or friend?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'au-q10',
                    type: 'textarea',
                    question: 'What is the one thing that would make this app easier or more enjoyable to use?',
                    placeholder: 'Be specific — what would reduce friction the most?',
                },
            ],
        },
    ],
};

// ============================================================================
// SOFTWARE ONBOARDING SURVEY
// Keyword: software onboarding survey (1k-5k/mo)
// ============================================================================
const SOFTWARE_ONBOARDING_TEMPLATE: SurveyTemplate = {
    id: 'software-onboarding',
    name: 'Software Onboarding Survey',
    emoji: '🚀',
    color: 'text-green-600',
    description: 'Find where new users get stuck before they quietly stop logging in — 9 questions',
    category: 'product',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'so-setup',
            title: 'Setup and First Value',
            description: 'Initial configuration, documentation, and speed to value',
            questions: [
                {
                    id: 'so-q1',
                    type: 'scale',
                    question: 'How easy was the initial setup and account configuration?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'so-q2',
                    type: 'scale',
                    question: 'How clear and helpful were the getting-started guides and documentation?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not helpful at all',
                    maxLabel: 'Extremely helpful',
                    required: true,
                },
                {
                    id: 'so-q3',
                    type: 'scale',
                    question: 'How quickly did you start getting real value from the product?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Still have not',
                    maxLabel: 'Very quickly',
                    required: true,
                },
                {
                    id: 'so-q4',
                    type: 'scale',
                    question: 'How helpful was the support or onboarding team when you had questions?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Extremely helpful',
                    required: true,
                },
            ],
        },
        {
            id: 'so-confidence',
            title: 'Confidence and Discovery',
            description: 'Whether users can go it alone and found the features they need',
            questions: [
                {
                    id: 'so-q5',
                    type: 'scale',
                    question: 'How confident do you now feel using the product on your own?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not confident',
                    maxLabel: 'Very confident',
                    required: true,
                },
                {
                    id: 'so-q6',
                    type: 'scale',
                    question: 'How well did onboarding help you discover the features most relevant to your goals?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'so-overall',
            title: 'Satisfaction and Feedback',
            description: 'Overall rating, NPS, and open feedback',
            questions: [
                {
                    id: 'so-q7',
                    type: 'scale',
                    question: 'Overall, how satisfied are you with your onboarding experience?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'so-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend this product to a colleague or peer?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'so-q9',
                    type: 'textarea',
                    question: 'What was the biggest obstacle or confusing moment during your onboarding?',
                    placeholder: 'Be as specific as you can — this helps us fix the exact problem for the next user...',
                },
            ],
        },
    ],
};

// ============================================================================
// EXPORT
// ============================================================================
export const PRODUCT_TEMPLATES: SurveyTemplate[] = [
    PRODUCT_FEEDBACK_TEMPLATE,
    PRODUCT_MARKET_FIT_TEMPLATE,
    WEBSITE_FEEDBACK_TEMPLATE,
    MARKET_RESEARCH_TEMPLATE,
    IT_SUPPORT_TEMPLATE,
    APP_USABILITY_TEMPLATE,
    SOFTWARE_ONBOARDING_TEMPLATE,
];
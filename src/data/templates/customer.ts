import { Star, TrendingUp, MessageSquare } from 'lucide-react';
import { SurveyTemplate } from './_types';

// ============================================================================
// CUSTOMER SATISFACTION (CSAT)
// Keyword: customer satisfaction survey template (50,000/mo)
// ============================================================================
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

// ============================================================================
// QUICK NPS SURVEY
// Keyword: NPS survey template (10,000/mo)
// ============================================================================
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

// ============================================================================
// POST-PURCHASE FEEDBACK
// Keyword: post purchase survey template (5,000/mo)
// ============================================================================
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

// ============================================================================
// RESTAURANT FEEDBACK SURVEY
// Keyword: restaurant feedback survey template (5,000/mo)
// ============================================================================
const RESTAURANT_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'restaurant-feedback',
    name: 'Restaurant Feedback Survey',
    emoji: '🍽️',
    color: 'text-orange-700',
    description: 'Food, service, atmosphere, value, and return visit intent — 8 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'rf-experience',
            title: 'Your Visit',
            description: 'How was your experience today?',
            questions: [
                {
                    id: 'rf-q1',
                    type: 'rating',
                    question: 'How would you rate your overall experience today?',
                    required: true,
                },
                {
                    id: 'rf-q2',
                    type: 'rating',
                    question: 'How would you rate the food quality?',
                    required: true,
                },
                {
                    id: 'rf-q3',
                    type: 'rating',
                    question: 'How would you rate the service?',
                    required: true,
                },
                {
                    id: 'rf-q4',
                    type: 'rating',
                    question: 'How would you rate the atmosphere and ambiance?',
                },
                {
                    id: 'rf-q5',
                    type: 'rating',
                    question: 'How would you rate the value for money?',
                    required: true,
                },
            ],
        },
        {
            id: 'rf-loyalty',
            title: 'Would You Return?',
            description: 'Tell us about your next visit',
            questions: [
                {
                    id: 'rf-q6',
                    type: 'scale',
                    question: 'How likely are you to recommend us to friends or family?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'rf-q7',
                    type: 'yes_no',
                    question: 'Would you visit us again?',
                    required: true,
                },
            ],
        },
        {
            id: 'rf-feedback',
            title: 'Help Us Improve',
            description: 'One thing we can do better',
            questions: [
                {
                    id: 'rf-q8',
                    type: 'textarea',
                    question: 'What is one thing we could improve to make your next visit even better?',
                    placeholder: 'Your feedback helps us improve every visit...',
                },
            ],
        },
    ],
};

// ============================================================================
// CUSTOMER CHURN SURVEY
// Keyword: customer churn survey, cancellation survey (5,000/mo)
// ============================================================================
const CUSTOMER_CHURN_TEMPLATE: SurveyTemplate = {
    id: 'customer-churn',
    name: 'Customer Churn Survey',
    emoji: '📉',
    color: 'text-red-600',
    description: 'Know exactly why customers cancel — at the only moment they\'ll tell you',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ch-reason',
            title: 'Cancellation Reason',
            description: 'Why are you leaving?',
            questions: [
                {
                    id: 'ch-q1',
                    type: 'multiple_choice',
                    question: 'What is the primary reason you\'re cancelling today?',
                    options: [
                        { id: 'low-usage',  text: 'Not using it enough — it didn\'t fit my workflow' },
                        { id: 'missing',    text: 'Missing a feature I need' },
                        { id: 'expensive',  text: 'It\'s too expensive for the value I\'m getting' },
                        { id: 'competitor', text: 'I found a better alternative' },
                        { id: 'ended',      text: 'My business or project no longer needs it' },
                        { id: 'hard',       text: 'Too difficult to use or onboard' },
                        { id: 'support',    text: 'Poor customer support experience' },
                        { id: 'other',      text: 'Other' },
                    ],
                    required: true,
                },
                {
                    id: 'ch-q2',
                    type: 'scale',
                    question: 'How satisfied were you with the product overall before cancelling?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'ch-detail',
            title: 'What Went Wrong',
            description: 'Help us understand what we failed to deliver',
            questions: [
                {
                    id: 'ch-q3',
                    type: 'textarea',
                    question: 'What did the product fail to deliver that you expected?',
                    placeholder: 'E.g. I needed X feature that wasn\'t available...',
                },
                {
                    id: 'ch-q4',
                    type: 'multiple_choice',
                    question: 'What will you use instead?',
                    options: [
                        { id: 'competitor', text: 'A direct competitor product' },
                        { id: 'build',      text: 'I\'m building my own solution' },
                        { id: 'free',       text: 'I\'ll use a free tool instead' },
                        { id: 'none',       text: 'I no longer need this category of tool' },
                        { id: 'undecided',  text: 'I haven\'t decided yet' },
                    ],
                },
                {
                    id: 'ch-q5',
                    type: 'textarea',
                    question: 'What one thing could we have done to keep you as a customer?',
                    placeholder: 'Be as specific as possible — this goes directly to our product team...',
                },
            ],
        },
        {
            id: 'ch-winback',
            title: 'Win-Back & NPS',
            description: 'Would you ever come back?',
            questions: [
                {
                    id: 'ch-q6',
                    type: 'yes_no',
                    question: 'Would you consider returning if we addressed your concerns?',
                    required: true,
                },
                {
                    id: 'ch-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend us to someone else, despite cancelling?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ch-q8',
                    type: 'textarea',
                    question: 'Any final feedback you\'d like to share with our team?',
                    placeholder: 'Share anything on your mind...',
                },
            ],
        },
    ],
};

// ============================================================================
// SALES PROCESS FEEDBACK SURVEY
// Keyword: sales feedback survey, B2B sales survey (1k-5k/mo)
// Note: anonymousMode: false — per-deal data only useful when linked to deal/rep
// ============================================================================
const SALES_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'sales-feedback',
    name: 'Sales Process Feedback Survey',
    emoji: '📊',
    color: 'text-orange-600',
    description: 'Know exactly why deals close and why they don\'t — 9 questions for won and lost deals',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'sf-experience',
            title: 'Sales Experience',
            description: 'Responsiveness, understanding, and proposal quality',
            questions: [
                {
                    id: 'sf-q1',
                    type: 'scale',
                    question: 'How would you rate your overall experience working with our sales team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'sf-q2',
                    type: 'scale',
                    question: 'How responsive and timely was the sales team throughout the process?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very slow',
                    maxLabel: 'Very responsive',
                    required: true,
                },
                {
                    id: 'sf-q3',
                    type: 'scale',
                    question: 'How well did the sales team understand your specific needs and goals?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Didn\'t understand at all',
                    maxLabel: 'Understood completely',
                    required: true,
                },
                {
                    id: 'sf-q4',
                    type: 'scale',
                    question: 'How relevant and well-tailored were the proposals or presentations you received?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very generic',
                    maxLabel: 'Perfectly tailored',
                    required: true,
                },
            ],
        },
        {
            id: 'sf-commercial',
            title: 'Pricing, Trust & Comparison',
            description: 'Transparency, credibility, and competitive positioning',
            questions: [
                {
                    id: 'sf-q5',
                    type: 'scale',
                    question: 'How clear and transparent was the pricing and commercial process?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
                {
                    id: 'sf-q6',
                    type: 'scale',
                    question: 'How much did the sales team build your trust and confidence during the process?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Did not build trust',
                    maxLabel: 'Built strong trust',
                    required: true,
                },
                {
                    id: 'sf-q7',
                    type: 'scale',
                    question: 'Compared to other vendors you evaluated, how did our sales experience compare?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Much worse',
                    maxLabel: 'Much better',
                    required: true,
                },
            ],
        },
        {
            id: 'sf-outcome',
            title: 'Decision & Feedback',
            description: 'Outcome segmentation and open feedback',
            questions: [
                {
                    id: 'sf-q8',
                    type: 'multiple_choice',
                    question: 'What was the outcome of your evaluation process?',
                    options: [
                        { id: 'won',         text: 'We chose your solution' },
                        { id: 'lost',        text: 'We chose a competitor' },
                        { id: 'no-decision', text: 'We decided not to proceed at all' },
                        { id: 'still-eval',  text: 'We are still evaluating options' },
                    ],
                    required: true,
                },
                {
                    id: 'sf-q9',
                    type: 'textarea',
                    question: 'What could we have done differently to better serve you during this process?',
                    placeholder: 'Honest feedback helps us improve — what could we have done better?',
                },
            ],
        },
    ],
};

// ============================================================================
// REAL ESTATE AGENT FEEDBACK SURVEY
// Keyword: real estate agent feedback survey (1k-5k/mo)
// ============================================================================
const REAL_ESTATE_AGENT_TEMPLATE: SurveyTemplate = {
    id: 'real-estate-agent',
    name: 'Real Estate Agent Feedback Survey',
    emoji: '🏡',
    color: 'text-yellow-700',
    description: 'Know how your agents perform before clients post elsewhere — 9 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 're-service',
            title: 'Communication & Knowledge',
            description: 'How the agent communicated and demonstrated expertise',
            questions: [
                {
                    id: 're-q1',
                    type: 'scale',
                    question: 'How well did your agent keep you updated and communicate throughout the process?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 're-q2',
                    type: 'scale',
                    question: 'How well did your agent demonstrate knowledge of the local property market?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very limited',
                    maxLabel: 'Excellent knowledge',
                    required: true,
                },
                {
                    id: 're-q3',
                    type: 'scale',
                    question: 'How well did your agent listen to and understand what you were looking for?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Did not listen',
                    maxLabel: 'Completely understood',
                    required: true,
                },
                {
                    id: 're-q4',
                    type: 'scale',
                    question: 'How would you rate the quality of property viewings or vendor presentations arranged?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 're-process',
            title: 'Negotiation, Transparency & Guidance',
            description: 'Commercial process and end-to-end support',
            questions: [
                {
                    id: 're-q5',
                    type: 'scale',
                    question: 'How effective was your agent in negotiating on your behalf?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Very effective',
                    required: true,
                },
                {
                    id: 're-q6',
                    type: 'scale',
                    question: 'How transparent were the fees, timelines, and process from start to finish?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very transparent',
                    required: true,
                },
                {
                    id: 're-q7',
                    type: 'scale',
                    question: 'How well did your agent guide and support you through the legal and paperwork stages?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 're-recommendation',
            title: 'Recommendation & Feedback',
            description: 'NPS and open feedback',
            questions: [
                {
                    id: 're-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend this agency to a friend or family member?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 're-q9',
                    type: 'textarea',
                    question: 'Is there anything specific your agent could have done better?',
                    placeholder: 'Your honest feedback helps us improve and helps other buyers and sellers...',
                },
            ],
        },
    ],
};

// ============================================================================
// INSURANCE CUSTOMER SATISFACTION SURVEY
// Keyword: insurance customer satisfaction survey (1k-5k/mo)
// ============================================================================
const INSURANCE_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'insurance-satisfaction',
    name: 'Insurance Customer Satisfaction Survey',
    emoji: '🛡️',
    color: 'text-blue-700',
    description: 'Know what policyholders think before they renew elsewhere — 9 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: false,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'is-policy',
            title: 'Policy Clarity',
            description: 'How well the policy and coverage are understood',
            questions: [
                {
                    id: 'is-q1',
                    type: 'scale',
                    question: 'How clearly were your policy terms and what is covered explained to you?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
            ],
        },
        {
            id: 'is-claims',
            title: 'Claims Experience',
            description: 'Quality, communication, and speed of claims handling',
            questions: [
                {
                    id: 'is-q2',
                    type: 'scale',
                    question: 'If you made a claim, how satisfied were you with the overall claims process?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                },
                {
                    id: 'is-q3',
                    type: 'scale',
                    question: 'How well were you kept informed and communicated with throughout your claim?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                },
                {
                    id: 'is-q4',
                    type: 'scale',
                    question: 'How satisfied were you with the speed at which your claim was handled?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                },
            ],
        },
        {
            id: 'is-value',
            title: 'Value, Renewal & Overall',
            description: 'Premium fairness, renewal ease, satisfaction, and NPS',
            questions: [
                {
                    id: 'is-q5',
                    type: 'scale',
                    question: 'How fair does your premium feel relative to the coverage and service you receive?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unfair',
                    maxLabel: 'Very fair',
                    required: true,
                },
                {
                    id: 'is-q6',
                    type: 'scale',
                    question: 'How easy was it to renew your policy or make changes when needed?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'is-q7',
                    type: 'scale',
                    question: 'Overall, how satisfied are you with us as your insurance provider?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'is-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend us to a friend or family member?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'is-q9',
                    type: 'textarea',
                    question: 'Is there anything specific about your experience you\'d like us to know?',
                    placeholder: 'Your feedback is reviewed by our customer experience team...',
                },
            ],
        },
    ],
};

// ============================================================================
// SPA & WELLNESS FEEDBACK SURVEY
// Keyword: spa feedback survey, wellness client satisfaction survey (1k-5k/mo)
// ============================================================================
const SPA_WELLNESS_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'spa-wellness-feedback',
    name: 'Spa & Wellness Feedback Survey',
    emoji: '🌿',
    color: 'text-emerald-700',
    description: 'Treatment quality, therapist professionalism, ambiance, value, and rebooking intent — 9 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'sw-experience',
            title: 'Your Visit',
            description: 'How was your experience today?',
            questions: [
                {
                    id: 'sw-q1',
                    type: 'scale',
                    question: 'Overall, how satisfied are you with your visit today?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'sw-q2',
                    type: 'scale',
                    question: 'How would you rate the quality and outcome of your treatment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'sw-q3',
                    type: 'scale',
                    question: 'How professional and attentive was your therapist or practitioner?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'sw-q4',
                    type: 'scale',
                    question: 'How would you rate the cleanliness and ambiance of the space?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'sw-q5',
                    type: 'scale',
                    question: 'How welcome and comfortable did you feel from the moment you arrived?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Extremely welcome',
                    required: true,
                },
            ],
        },
        {
            id: 'sw-value',
            title: 'Value & Consultation',
            description: 'Treatment match and pricing perception',
            questions: [
                {
                    id: 'sw-q6',
                    type: 'yes_no',
                    question: 'Was the treatment well matched to your needs and preferences?',
                    required: true,
                },
                {
                    id: 'sw-q7',
                    type: 'scale',
                    question: 'How would you rate the value for money relative to what you paid?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
            ],
        },
        {
            id: 'sw-loyalty',
            title: 'Loyalty & Feedback',
            description: 'NPS and open feedback',
            questions: [
                {
                    id: 'sw-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend us to a friend or family member?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'sw-q9',
                    type: 'textarea',
                    question: 'Is there anything specific we could do to make your next visit even better?',
                    placeholder: 'Your feedback helps us improve for every client...',
                },
            ],
        },
    ],
};

// ============================================================================
// FOOD DELIVERY SURVEY
// Keyword: food delivery survey, delivery experience feedback (5k-10k/mo)
// ============================================================================
const FOOD_DELIVERY_TEMPLATE: SurveyTemplate = {
    id: 'food-delivery-survey',
    name: 'Food Delivery Feedback Survey',
    emoji: '🛵',
    color: 'text-orange-500',
    description: 'Order accuracy, delivery time, food quality, and driver experience — 8 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'fd-delivery',
            title: 'Delivery Experience',
            description: 'Speed, accuracy, and driver conduct',
            questions: [
                {
                    id: 'fd-q1',
                    type: 'scale',
                    question: 'How satisfied are you with the delivery time for your order?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'fd-q2',
                    type: 'yes_no',
                    question: 'Was your order complete and accurate when it arrived?',
                    required: true,
                },
                {
                    id: 'fd-q3',
                    type: 'scale',
                    question: 'How professional and courteous was the delivery driver?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'fd-food',
            title: 'Food Quality',
            description: 'Condition and quality on arrival',
            questions: [
                {
                    id: 'fd-q4',
                    type: 'scale',
                    question: 'How would you rate the quality and condition of the food when it arrived?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'fd-q5',
                    type: 'scale',
                    question: 'How would you rate the packaging — was the food well protected during delivery?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'fd-overall',
            title: 'Overall & Loyalty',
            description: 'Value, NPS, and open feedback',
            questions: [
                {
                    id: 'fd-q6',
                    type: 'scale',
                    question: 'How would you rate the value for money of your order?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'fd-q7',
                    type: 'scale',
                    question: 'How likely are you to order from us again?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'fd-q8',
                    type: 'textarea',
                    question: 'Is there anything about your delivery experience we could improve?',
                    placeholder: 'Your feedback helps us improve every order...',
                },
            ],
        },
    ],
};

// ============================================================================
// GYM & FITNESS CLASS SURVEY
// Keyword: gym feedback survey, fitness class feedback, gym member survey (1k-5k/mo)
// ============================================================================
const GYM_FITNESS_CLASS_TEMPLATE: SurveyTemplate = {
    id: 'gym-fitness-class-survey',
    name: 'Gym & Fitness Class Survey',
    emoji: '🏋️',
    color: 'text-violet-600',
    description: 'Class quality, instructor performance, facilities, and membership satisfaction — 9 questions',
    category: 'customer',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'gf-class',
            title: 'Class Experience',
            description: 'Quality and delivery of the session',
            questions: [
                {
                    id: 'gf-q1',
                    type: 'scale',
                    question: 'How would you rate the overall quality of the class or session?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'gf-q2',
                    type: 'scale',
                    question: 'How knowledgeable and motivating was your instructor?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'gf-q3',
                    type: 'scale',
                    question: 'How well was the class paced and structured?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Poorly structured',
                    maxLabel: 'Excellently structured',
                    required: true,
                },
            ],
        },
        {
            id: 'gf-facilities',
            title: 'Facilities & Environment',
            description: 'Equipment, cleanliness, and atmosphere',
            questions: [
                {
                    id: 'gf-q4',
                    type: 'scale',
                    question: 'How would you rate the cleanliness of the gym and changing facilities?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'gf-q5',
                    type: 'scale',
                    question: 'How would you rate the quality and availability of equipment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'gf-q6',
                    type: 'scale',
                    question: 'How welcoming and supportive is the overall gym atmosphere?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not welcoming',
                    maxLabel: 'Very welcoming',
                    required: true,
                },
            ],
        },
        {
            id: 'gf-membership',
            title: 'Value & Loyalty',
            description: 'Membership satisfaction, NPS, and open feedback',
            questions: [
                {
                    id: 'gf-q7',
                    type: 'scale',
                    question: 'How satisfied are you with the value your membership provides?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'gf-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend this gym or class to a friend?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'gf-q9',
                    type: 'textarea',
                    question: 'What one thing would most improve your gym or class experience?',
                    placeholder: 'Your feedback helps us improve for every member...',
                },
            ],
        },
    ],
};

// ============================================================================
// 4. RETAIL CUSTOMER SURVEY → customer.ts
// Target keyword: retail customer survey, in-store customer feedback (1k-5k/mo)
// Conversion hook: track whether NPS, staff scores, and checkout ratings improve
//   week by week or across store locations
// ============================================================================
export const RETAIL_CUSTOMER_TEMPLATE: SurveyTemplate = {
  id: 'retail-customer-survey',
  name: 'Retail Customer Survey',
  emoji: '🛍️',
  color: 'text-orange-700',
  description: '9 questions for retail stores and ecommerce brands. Shopping experience, product range, findability, staff, checkout, atmosphere, value, NPS, and open feedback. QR code friendly.',
  category: 'customer',
  targetKeyword: 'retail customer survey',
  priority: 'P2',
  conversionHook: 'Track whether NPS, staff scores, and checkout ratings improve week by week or across store locations.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: true,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'rc-experience',
      title: 'Shopping Experience',
      description: 'How was your visit today?',
      questions: [
        {
          id: 'rc-q1',
          type: 'rating',
          question: 'How would you rate your overall shopping experience today?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'rc-q2',
          type: 'rating',
          question: 'How satisfied were you with the range and availability of products?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'rc-q3',
          type: 'rating',
          question: 'How easy was it to find what you were looking for?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'rc-service',
      title: 'Staff & Checkout',
      description: 'Team and transaction experience',
      questions: [
        {
          id: 'rc-q4',
          type: 'rating',
          question: 'How helpful and knowledgeable was our staff during your visit?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'rc-q5',
          type: 'rating',
          question: 'How smooth and quick was the checkout or payment process?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'rc-q6',
          type: 'rating',
          question: 'How would you rate the store atmosphere, presentation, and cleanliness?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'rc-value',
      title: 'Value & Recommendation',
      description: 'Price perception, NPS, and open feedback',
      questions: [
        {
          id: 'rc-q7',
          type: 'rating',
          question: 'How would you rate the value for money of the products you purchased?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'rc-q8',
          type: 'nps',
          question: 'How likely are you to recommend us to a friend or family member?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'rc-q9',
          type: 'textarea',
          question: 'Is there anything specific we could do to improve your experience next time?',
          placeholder: 'Your feedback helps us improve every customer\'s experience...',
          required: false,
        },
      ],
    },
  ],
};
 
// ============================================================================
// 3. SUBSCRIPTION SERVICE SURVEY → customer.ts
// Target keyword: subscription service survey, SaaS customer satisfaction survey (1k-5k/mo)
// Conversion hook: track how satisfaction and renewal intent change across
//   subscriber cohorts — identify churn risk before the renewal decision
// ============================================================================
export const SUBSCRIPTION_SERVICE_TEMPLATE: SurveyTemplate = {
  id: 'subscription-service-survey',
  name: 'Subscription Service Survey',
  emoji: '🔁',
  color: 'text-violet-700',
  description: '9 questions for SaaS companies and subscription businesses. Overall satisfaction, value for money, feature satisfaction, onboarding, support quality, ease of use, renewal intent, NPS, and open feedback. Identifies churn risk before the renewal decision.',
  category: 'customer',
  targetKeyword: 'subscription service survey',
  priority: 'P2',
  conversionHook: 'Track how satisfaction and renewal intent change across subscriber cohorts and after product updates. Identify churn risk before the renewal decision.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: false,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'ss-satisfaction',
      title: 'Overall Satisfaction',
      description: 'How satisfied are you with the product?',
      questions: [
        {
          id: 'ss-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with our product or service?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'ss-q2',
          type: 'scale',
          question: 'How well does your subscription represent value for the price you pay?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Poor value',
          maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'ss-q3',
          type: 'scale',
          question: 'How satisfied are you with the features or content included in your plan?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
      ],
    },
    {
      id: 'ss-experience',
      title: 'Experience & Support',
      description: 'Onboarding, support, and day-to-day ease of use',
      questions: [
        {
          id: 'ss-q4',
          type: 'scale',
          question: 'How smooth was the experience of getting started and set up?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very difficult',
          maxLabel: 'Very smooth',
          required: true,
        },
        {
          id: 'ss-q5',
          type: 'scale',
          question: 'How satisfied are you with the quality of support when you need help?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'ss-q6',
          type: 'scale',
          question: 'How easy is the product to use day to day?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very difficult',
          maxLabel: 'Very easy',
          required: true,
        },
      ],
    },
    {
      id: 'ss-renewal',
      title: 'Renewal Intent & Advocacy',
      description: 'Churn risk indicators and open feedback',
      questions: [
        {
          id: 'ss-q7',
          type: 'scale',
          question: 'How likely are you to renew your subscription when it next comes up?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Definitely cancel',
          maxLabel: 'Definitely renew',
          required: true,
        },
        {
          id: 'ss-q8',
          type: 'nps',
          question: 'How likely are you to recommend us to a friend or colleague?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'ss-q9',
          type: 'textarea',
          question: 'What is the one thing that would most improve your experience as a subscriber?',
          placeholder: 'Be specific — your feedback goes directly to the product team...',
          required: false,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// 3. client-satisfaction-survey → customer.ts
// ─────────────────────────────────────────────
export const CLIENT_SATISFACTION_TEMPLATE = {
  id: "client-satisfaction-survey",
  slug: "client-satisfaction-survey",
  title: "Client Satisfaction Survey",
  description:
    "9 questions for agencies, consultants, and freelancers. Covers delivery quality, scope/timeline, communication, expertise, responsiveness, value, renewal intent, NPS, and open feedback.",
  category: "customer",
  tags: [
    "client",
    "agency",
    "consultant",
    "freelancer",
    "professional services",
    "B2B",
  ],
  sectionPrefix: "cs-",
  pollType: "rating",
  questions: [
    {
      id: "cs-01",
      text: "Overall, how satisfied are you with the quality of work we've delivered for you?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "cs-02",
      text: "How well did we meet the agreed scope, timelines, and deliverables?",
      type: "scale",
      scale: 5,
      min: "Not at all",
      max: "Exceeded expectations",
    },
    {
      id: "cs-03",
      text: "How would you rate the quality of communication and updates throughout our work together?",
      type: "scale",
      scale: 5,
      min: "Poor",
      max: "Excellent",
    },
    {
      id: "cs-04",
      text: "How confident are you in the expertise and knowledge our team brought to your project?",
      type: "scale",
      scale: 5,
      min: "Not confident",
      max: "Very confident",
    },
    {
      id: "cs-05",
      text: "How responsive were we when you needed input, changes, or had questions?",
      type: "scale",
      scale: 5,
      min: "Very slow",
      max: "Immediately responsive",
    },
    {
      id: "cs-06",
      text: "How well did our work represent value for the investment you made?",
      type: "scale",
      scale: 5,
      min: "Poor value",
      max: "Excellent value",
    },
    {
      id: "cs-07",
      text: "How likely are you to work with us again on a future project or retainer?",
      type: "scale",
      scale: 5,
      min: "Definitely not",
      max: "Definitely yes",
    },
    {
      id: "cs-08",
      text: "How likely are you to recommend us to a colleague or business in your network? (0–10)",
      type: "nps",
      scale: 10,
    },
    {
      id: "cs-09",
      text: "What is the one thing we could have done differently to make this engagement more valuable for you?",
      type: "open",
    },
  ],
  meta: {
    sendTiming:
      "Within 5 days of project completion; quarterly for retainer clients",
    anonymous: false,
    audience: ["agencies", "consultants", "freelancers"],
    keyChurnSignal: "cs-07",
    keyReferralSignal: "cs-08",
    note: "Q7 below 3 = churn risk within 90 days. Q8 at 9–10 = shortlist for referral/testimonial request.",
  },
  landingPage: "/templates/client-satisfaction-survey",
  prefillUrl:
    "https://votegenerator.com/create?template=client-satisfaction-survey",
};


// ─────────────────────────────────────────────
// 4. personal-trainer-feedback-survey → customer.ts
// ─────────────────────────────────────────────
export const PERSONAL_TRAINER_TEMPLATE = {
  id: "personal-trainer-feedback-survey",
  slug: "personal-trainer-feedback-survey",
  title: "Personal Trainer Feedback Survey",
  description:
    "9 questions for PTs, sports coaches, and fitness coaches. Covers session quality, programme design, motivation, progression, goal clarity, between-session support, value, NPS, and open feedback.",
  category: "customer",
  tags: [
    "personal trainer",
    "fitness",
    "coaching",
    "PT",
    "sports coach",
    "gym",
  ],
  sectionPrefix: "pt-",
  pollType: "rating",
  questions: [
    {
      id: "pt-01",
      text: "Overall, how satisfied are you with the quality of your sessions?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "pt-02",
      text: "How well designed and structured do you find your training programme?",
      type: "scale",
      scale: 5,
      min: "Needs improvement",
      max: "Excellent structure",
    },
    {
      id: "pt-03",
      text: "How motivated and supported do you feel during our sessions?",
      type: "scale",
      scale: 5,
      min: "Not motivated",
      max: "Highly motivated",
    },
    {
      id: "pt-04",
      text: "How well do you feel your programme is progressing toward your goals?",
      type: "scale",
      scale: 5,
      min: "No progress",
      max: "Great progress",
    },
    {
      id: "pt-05",
      text: "How clearly defined and understood are your training goals?",
      type: "scale",
      scale: 5,
      min: "Very unclear",
      max: "Crystal clear",
    },
    {
      id: "pt-06",
      text: "How satisfied are you with communication and support between sessions?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "pt-07",
      text: "How well do the sessions represent value for money?",
      type: "scale",
      scale: 5,
      min: "Poor value",
      max: "Excellent value",
    },
    {
      id: "pt-08",
      text: "How likely are you to recommend me to a friend or colleague? (0–10)",
      type: "nps",
      scale: 10,
    },
    {
      id: "pt-09",
      text: "What is one thing I could do differently to make our sessions more effective for you?",
      type: "open",
    },
  ],
  meta: {
    sendTiming: "At 30 days, 90 days, and end of each programme block",
    anonymous: false,
    audience: ["personal trainers", "sports coaches", "online fitness coaches"],
    keyChurnSignal: "pt-04",
    keyReferralSignal: "pt-08",
    note: "Q4 (programme progression) below 3 = silent churn risk. Initiate goal realignment conversation in next session.",
  },
  landingPage: "/templates/personal-trainer-feedback-survey",
  prefillUrl:
    "https://votegenerator.com/create?template=personal-trainer-feedback-survey",
};

// ─────────────────────────────────────────────
// 7. coworking-space-survey → customer.ts
// ─────────────────────────────────────────────
export const COWORKING_SPACE_TEMPLATE = {
  id: "coworking-space-survey",
  slug: "coworking-space-survey",
  title: "Coworking Space Member Survey",
  description:
    "9 questions for coworking space operators. Covers workspace satisfaction, internet reliability, community value, events, staff responsiveness, amenities, membership value, renewal intent, and open feedback.",
  category: "customer",
  tags: [
    "coworking",
    "shared office",
    "membership",
    "workspace",
    "community",
    "flexible office",
  ],
  sectionPrefix: "cw-",
  pollType: "rating",
  questions: [
    {
      id: "cw-01",
      text: "Overall, how satisfied are you with your membership at this space?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "cw-02",
      text: "How reliable and fast is the internet and technical infrastructure?",
      type: "scale",
      scale: 5,
      min: "Unreliable",
      max: "Rock solid",
    },
    {
      id: "cw-03",
      text: "How valuable is the sense of community and networking at this space?",
      type: "scale",
      scale: 5,
      min: "No community value",
      max: "Extremely valuable",
    },
    {
      id: "cw-04",
      text: "How satisfied are you with the events and member programming on offer?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "cw-05",
      text: "How responsive and helpful are the staff when you need something?",
      type: "scale",
      scale: 5,
      min: "Not responsive",
      max: "Excellent",
    },
    {
      id: "cw-06",
      text: "How satisfied are you with the amenities, meeting rooms, and shared facilities?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "cw-07",
      text: "How well does your membership represent value for what you pay?",
      type: "scale",
      scale: 5,
      min: "Poor value",
      max: "Excellent value",
    },
    {
      id: "cw-08",
      text: "How likely are you to renew your membership when it next comes up?",
      type: "scale",
      scale: 5,
      min: "Will not renew",
      max: "Definitely renewing",
    },
    {
      id: "cw-09",
      text: "What is the one thing we could do to make this space significantly better for you?",
      type: "open",
    },
  ],
  meta: {
    sendTiming: "Quarterly, or 4–6 weeks before member renewal date",
    anonymous: true,
    audience: [
      "coworking space managers",
      "community managers",
      "flexible office operators",
    ],
    keyChurnSignal: "cw-08",
    note: "Q8 (renewal intent) below 3 + Q3 (community) below 3 = price-sensitive member, high churn risk. Personal check-in within 1 week.",
  },
  landingPage: "/templates/coworking-space-survey",
  prefillUrl:
    "https://votegenerator.com/create?template=coworking-space-survey",
};
 
export const CLIENT_SATISFACTION_TEMPLATE: SurveyTemplate = {
  id: 'client-satisfaction-survey',
  name: 'Client Satisfaction Survey',
  emoji: '🤝',
  color: 'text-amber-700',
  description: '9 questions for agencies, consultants, and freelancers. Delivery quality, communication, expertise, responsiveness, value, renewal intent, NPS, and open feedback.',
  category: 'customer',
  targetKeyword: 'client satisfaction survey',
  recommendedSettings: { anonymousMode: false, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'cs-delivery',
      title: 'Delivery & Expertise',
      description: 'Quality of work and professional knowledge',
      questions: [
        {
          id: 'cs-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with the quality of work we have delivered for you?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'cs-q2',
          type: 'scale',
          question: 'How well did we meet the agreed scope, timelines, and deliverables?',
          minValue: 1, maxValue: 5,
          minLabel: 'Not at all', maxLabel: 'Exceeded expectations',
          required: true,
        },
        {
          id: 'cs-q3',
          type: 'scale',
          question: 'How would you rate the quality of communication and updates throughout our work together?',
          minValue: 1, maxValue: 5,
          minLabel: 'Poor', maxLabel: 'Excellent',
          required: true,
        },
        {
          id: 'cs-q4',
          type: 'scale',
          question: 'How confident are you in the expertise and knowledge our team brought to your project?',
          minValue: 1, maxValue: 5,
          minLabel: 'Not confident', maxLabel: 'Very confident',
          required: true,
        },
        {
          id: 'cs-q5',
          type: 'scale',
          question: 'How responsive were we when you needed input, changes, or had questions?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very slow', maxLabel: 'Immediately responsive',
          required: true,
        },
      ],
    },
    {
      id: 'cs-value',
      title: 'Value & Renewal',
      description: 'Investment return and likelihood to continue',
      questions: [
        {
          id: 'cs-q6',
          type: 'scale',
          question: 'How well did our work represent value for the investment you made?',
          minValue: 1, maxValue: 5,
          minLabel: 'Poor value', maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'cs-q7',
          type: 'scale',
          question: 'How likely are you to work with us again on a future project or retainer?',
          minValue: 1, maxValue: 5,
          minLabel: 'Definitely not', maxLabel: 'Definitely yes',
          required: true,
        },
        {
          id: 'cs-q8',
          type: 'nps',
          question: 'How likely are you to recommend us to a colleague or business in your network?',
          minValue: 0, maxValue: 10,
          required: true,
        },
        {
          id: 'cs-q9',
          type: 'textarea',
          question: 'What is the one thing we could have done differently to make this engagement more valuable for you?',
          placeholder: 'Your honest perspective is genuinely valued and read by our senior team...',
          required: false,
        },
      ],
    },
  ],
};

export const PERSONAL_TRAINER_TEMPLATE: SurveyTemplate = {
  id: 'personal-trainer-feedback-survey',
  name: 'Personal Trainer Feedback Survey',
  emoji: '💪',
  color: 'text-orange-600',
  description: '9 questions for PTs and fitness coaches. Session quality, programme design, motivation, progression, goal clarity, between-session support, value, NPS, and open feedback.',
  category: 'customer',
  targetKeyword: 'personal trainer feedback survey',
  recommendedSettings: { anonymousMode: false, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'pt-sessions',
      title: 'Sessions & Programme',
      description: 'Quality and design of your training',
      questions: [
        {
          id: 'pt-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with the quality of your sessions?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'pt-q2',
          type: 'scale',
          question: 'How well designed and structured do you find your training programme?',
          minValue: 1, maxValue: 5,
          minLabel: 'Needs improvement', maxLabel: 'Excellent structure',
          required: true,
        },
        {
          id: 'pt-q3',
          type: 'scale',
          question: 'How motivated and supported do you feel during our sessions?',
          minValue: 1, maxValue: 5,
          minLabel: 'Not motivated', maxLabel: 'Highly motivated',
          required: true,
        },
        {
          id: 'pt-q4',
          type: 'scale',
          question: 'How well do you feel your programme is progressing toward your goals?',
          minValue: 1, maxValue: 5,
          minLabel: 'No progress', maxLabel: 'Great progress',
          required: true,
        },
        {
          id: 'pt-q5',
          type: 'scale',
          question: 'How clearly defined and understood are your training goals?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very unclear', maxLabel: 'Crystal clear',
          required: true,
        },
      ],
    },
    {
      id: 'pt-value',
      title: 'Support & Value',
      description: 'Between-session communication and overall value',
      questions: [
        {
          id: 'pt-q6',
          type: 'scale',
          question: 'How satisfied are you with communication and support between sessions?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'pt-q7',
          type: 'scale',
          question: 'How well do the sessions represent value for money?',
          minValue: 1, maxValue: 5,
          minLabel: 'Poor value', maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'pt-q8',
          type: 'nps',
          question: 'How likely are you to recommend me to a friend or colleague?',
          minValue: 0, maxValue: 10,
          required: true,
        },
        {
          id: 'pt-q9',
          type: 'textarea',
          question: 'What is one thing I could do differently to make our sessions more effective for you?',
          placeholder: 'Be honest — this feedback helps me coach you better...',
          required: false,
        },
      ],
    },
  ],
};

export const COWORKING_SPACE_TEMPLATE: SurveyTemplate = {
  id: 'coworking-space-survey',
  name: 'Coworking Space Member Survey',
  emoji: '🏢',
  color: 'text-indigo-700',
  description: '9 questions for coworking operators. Workspace quality, internet reliability, community value, events, staff, amenities, membership value, renewal intent, and open feedback.',
  category: 'customer',
  targetKeyword: 'coworking space member survey',
  recommendedSettings: { anonymousMode: true, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'cw-space',
      title: 'Workspace & Infrastructure',
      description: 'Physical environment and technical reliability',
      questions: [
        {
          id: 'cw-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with your membership at this space?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'cw-q2',
          type: 'scale',
          question: 'How reliable and fast is the internet and technical infrastructure?',
          minValue: 1, maxValue: 5,
          minLabel: 'Unreliable', maxLabel: 'Rock solid',
          required: true,
        },
        {
          id: 'cw-q3',
          type: 'scale',
          question: 'How valuable is the sense of community and networking at this space?',
          minValue: 1, maxValue: 5,
          minLabel: 'No value', maxLabel: 'Extremely valuable',
          required: true,
        },
        {
          id: 'cw-q4',
          type: 'scale',
          question: 'How satisfied are you with the events and member programming on offer?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'cw-q5',
          type: 'scale',
          question: 'How responsive and helpful are the staff when you need something?',
          minValue: 1, maxValue: 5,
          minLabel: 'Not responsive', maxLabel: 'Excellent',
          required: true,
        },
      ],
    },
    {
      id: 'cw-value',
      title: 'Amenities & Renewal',
      description: 'Facilities, value, and membership intent',
      questions: [
        {
          id: 'cw-q6',
          type: 'scale',
          question: 'How satisfied are you with the amenities, meeting rooms, and shared facilities?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'cw-q7',
          type: 'scale',
          question: 'How well does your membership represent value for what you pay?',
          minValue: 1, maxValue: 5,
          minLabel: 'Poor value', maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'cw-q8',
          type: 'scale',
          question: 'How likely are you to renew your membership when it next comes up?',
          minValue: 1, maxValue: 5,
          minLabel: 'Will not renew', maxLabel: 'Definitely renewing',
          required: true,
        },
        {
          id: 'cw-q9',
          type: 'textarea',
          question: 'What is the one thing we could do to make this space significantly better for you?',
          placeholder: 'Your feedback goes directly to the community management team...',
          required: false,
        },
      ],
    },
  ],
};


// ============================================================================
// EXPORT
// ============================================================================
export const CUSTOMER_TEMPLATES: SurveyTemplate[] = [
    CSAT_SURVEY_TEMPLATE,
    NPS_QUICK_TEMPLATE,
    POST_PURCHASE_TEMPLATE,
    RESTAURANT_FEEDBACK_TEMPLATE,
    CUSTOMER_CHURN_TEMPLATE,
    RETAIL_CUSTOMER_TEMPLATE,
    SALES_FEEDBACK_TEMPLATE,
    REAL_ESTATE_AGENT_TEMPLATE,
    INSURANCE_SATISFACTION_TEMPLATE,
    SPA_WELLNESS_FEEDBACK_TEMPLATE,
    FOOD_DELIVERY_TEMPLATE,
    GYM_FITNESS_CLASS_TEMPLATE,
    SUBSCRIPTION_SERVICE_TEMPLATE,
    CLIENT_SATISFACTION_TEMPLATE,       // new
    PERSONAL_TRAINER_TEMPLATE,          // new
    COWORKING_SPACE_TEMPLATE,           // new
];
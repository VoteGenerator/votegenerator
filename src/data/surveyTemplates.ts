// ============================================================================
// Survey Templates - Employee Engagement, CSAT, NPS, Post-Purchase
// Location: src/data/surveyTemplates.ts (or add to SurveyBuilder.tsx)
// 
// These templates target high-volume, low-competition keywords
// ============================================================================

import { SurveySection } from '../types';
import { Users, Star, TrendingUp, MessageSquare, Heart, Briefcase, PartyPopper, Baby } from 'lucide-react';

// ============================================================================
// TEMPLATE INTERFACE
// ============================================================================

export interface SurveyTemplate {
    id: string;
    name: string;
    icon: typeof Users;
    color: string;
    description: string;
    category?: string;
    sections: SurveySection[];
    recommendedSettings?: {
        anonymousMode?: boolean;
        showProgress?: boolean;
        allowBack?: boolean;
    };
}

// ============================================================================
// EMPLOYEE ENGAGEMENT SURVEY
// Keywords: employee engagement survey, staff engagement survey (10k-100k volume)
// ============================================================================

export const EMPLOYEE_ENGAGEMENT_TEMPLATE: SurveyTemplate = {
    id: 'employee-engagement',
    name: 'Employee Engagement',
    icon: Users,
    color: 'text-emerald-600',
    description: 'Measure team satisfaction, growth, and culture',
    category: 'business',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ee-satisfaction',
            title: 'Overall Satisfaction',
            description: 'How do you feel about your role?',
            questions: [
                {
                    id: 'ee-q1',
                    type: 'scale',
                    question: 'How likely are you to recommend this company as a great place to work?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not at all likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ee-q2',
                    type: 'rating',
                    question: 'How satisfied are you with your current role?',
                    required: true,
                },
                {
                    id: 'ee-q3',
                    type: 'multiple_choice',
                    question: 'How long do you see yourself working here?',
                    options: [
                        { id: 'less-1', text: 'Less than 1 year' },
                        { id: '1-2', text: '1-2 years' },
                        { id: '3-5', text: '3-5 years' },
                        { id: '5-plus', text: '5+ years' },
                        { id: 'unsure', text: 'Not sure' },
                    ],
                    required: true,
                },
            ]
        },
        {
            id: 'ee-growth',
            title: 'Growth & Development',
            description: 'Your opportunities for learning',
            questions: [
                {
                    id: 'ee-q4',
                    type: 'scale',
                    question: 'I have opportunities to grow and develop in my role',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
                {
                    id: 'ee-q5',
                    type: 'scale',
                    question: 'I receive regular feedback that helps me improve',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
                {
                    id: 'ee-q6',
                    type: 'multiple_choice',
                    question: 'What would help you grow most?',
                    options: [
                        { id: 'training', text: 'More training opportunities' },
                        { id: 'mentorship', text: 'Mentorship program' },
                        { id: 'feedback', text: 'More frequent feedback' },
                        { id: 'projects', text: 'Challenging projects' },
                        { id: 'promotion', text: 'Clear promotion path' },
                    ],
                    allowMultiple: true,
                },
            ]
        },
        {
            id: 'ee-culture',
            title: 'Team & Culture',
            description: 'Your workplace experience',
            questions: [
                {
                    id: 'ee-q7',
                    type: 'rating',
                    question: 'How would you rate team collaboration?',
                    required: true,
                },
                {
                    id: 'ee-q8',
                    type: 'scale',
                    question: 'I feel valued and recognized for my contributions',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
                {
                    id: 'ee-q9',
                    type: 'scale',
                    question: 'Leadership communicates a clear vision',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
            ]
        },
        {
            id: 'ee-balance',
            title: 'Work-Life Balance',
            description: 'Your wellbeing',
            questions: [
                {
                    id: 'ee-q10',
                    type: 'scale',
                    question: 'I am able to maintain a healthy work-life balance',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
                {
                    id: 'ee-q11',
                    type: 'multiple_choice',
                    question: 'What would improve your work experience?',
                    options: [
                        { id: 'remote', text: 'More remote flexibility' },
                        { id: 'hours', text: 'Flexible hours' },
                        { id: 'pto', text: 'More PTO' },
                        { id: 'wellness', text: 'Wellness programs' },
                        { id: 'equipment', text: 'Better equipment' },
                    ],
                    allowMultiple: true,
                },
            ]
        },
        {
            id: 'ee-feedback',
            title: 'Open Feedback',
            description: 'Share your thoughts (anonymous)',
            questions: [
                {
                    id: 'ee-q12',
                    type: 'textarea',
                    question: 'What do you love most about working here?',
                    placeholder: 'Share what makes this a great place to work...',
                },
                {
                    id: 'ee-q13',
                    type: 'textarea',
                    question: 'What is one thing we could do better?',
                    placeholder: 'Your honest feedback helps us improve...',
                },
            ]
        },
    ],
};

// ============================================================================
// CUSTOMER SATISFACTION (CSAT) SURVEY
// Keywords: customer satisfaction survey, CSAT survey (10k-100k volume)
// ============================================================================

export const CSAT_SURVEY_TEMPLATE: SurveyTemplate = {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction',
    icon: Star,
    color: 'text-blue-600',
    description: 'Measure NPS, satisfaction, and collect feedback',
    category: 'business',
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
            ]
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
                        { id: 'quality', text: 'Product quality' },
                        { id: 'price', text: 'Competitive pricing' },
                        { id: 'support', text: 'Customer support' },
                        { id: 'ease', text: 'Ease of use' },
                        { id: 'reliability', text: 'Reliability' },
                    ],
                    allowMultiple: true,
                },
            ]
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
                        { id: 'product', text: 'Product features' },
                        { id: 'price', text: 'Pricing' },
                        { id: 'support', text: 'Customer support' },
                        { id: 'docs', text: 'Documentation' },
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
            ]
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
            ]
        },
    ],
};

// ============================================================================
// QUICK NPS SURVEY
// For simple NPS-only surveys
// ============================================================================

export const NPS_QUICK_TEMPLATE: SurveyTemplate = {
    id: 'nps-quick',
    name: 'Quick NPS Survey',
    icon: TrendingUp,
    color: 'text-indigo-600',
    description: 'Simple NPS with one follow-up question',
    category: 'business',
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
            ]
        },
    ],
};

// ============================================================================
// POST-PURCHASE FEEDBACK
// ============================================================================

export const POST_PURCHASE_TEMPLATE: SurveyTemplate = {
    id: 'post-purchase',
    name: 'Post-Purchase Feedback',
    icon: MessageSquare,
    color: 'text-amber-600',
    description: 'Collect feedback after purchase',
    category: 'business',
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
            ]
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
            ]
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
            ]
        },
    ],
};

// ============================================================================
// EXISTING TEMPLATES (Keep these from your current code)
// ============================================================================

export const WEDDING_RSVP_TEMPLATE: SurveyTemplate = {
    id: 'wedding',
    name: 'Wedding RSVP',
    icon: Heart,
    color: 'text-pink-500',
    description: 'Attendance, meal preferences, song requests',
    sections: [
        {
            id: 'attendance',
            title: 'Attendance',
            description: 'Please let us know if you can make it',
            questions: [
                { id: 'q1', type: 'yes_no', question: 'Will you be attending?', required: true },
                { id: 'q2', type: 'number', question: 'Number of guests (including yourself)', min: 1, max: 10, required: true },
            ]
        },
        {
            id: 'meals',
            title: 'Meal Preferences',
            description: 'Help us plan the menu',
            questions: [
                { id: 'q3', type: 'multiple_choice', question: 'Entree preference', options: [
                    { id: 'beef', text: 'Beef' },
                    { id: 'chicken', text: 'Chicken' },
                    { id: 'fish', text: 'Fish' },
                    { id: 'vegetarian', text: 'Vegetarian' },
                ], required: true },
                { id: 'q4', type: 'textarea', question: 'Any dietary restrictions or allergies?', placeholder: 'Please list any allergies...' },
            ]
        },
        {
            id: 'celebration',
            title: 'Celebration',
            description: 'Help us make it special',
            questions: [
                { id: 'q5', type: 'text', question: 'Request a song for the dance floor', placeholder: 'Song title - Artist' },
                { id: 'q6', type: 'textarea', question: 'Leave a message for the couple (optional)', placeholder: 'Your well wishes...' },
            ]
        }
    ]
};

export const TEAM_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'corporate',
    name: 'Team Feedback',
    icon: Briefcase,
    color: 'text-blue-500',
    description: 'Meeting feedback, project surveys',
    sections: [
        {
            id: 'overall',
            title: 'Overall Experience',
            questions: [
                { id: 'q1', type: 'rating', question: 'How would you rate the meeting overall?', required: true },
                { id: 'q2', type: 'scale', question: 'How productive was this meeting?', minValue: 1, maxValue: 10, minLabel: 'Not productive', maxLabel: 'Very productive', required: true },
            ]
        },
        {
            id: 'details',
            title: 'Specific Feedback',
            questions: [
                { id: 'q3', type: 'multiple_choice', question: 'What worked well?', options: [
                    { id: 'agenda', text: 'Clear agenda' },
                    { id: 'time', text: 'Good time management' },
                    { id: 'discussion', text: 'Productive discussion' },
                    { id: 'decisions', text: 'Clear decisions made' },
                ], allowMultiple: true },
                { id: 'q4', type: 'textarea', question: 'What could be improved?', placeholder: 'Your suggestions...' },
            ]
        }
    ]
};

export const PARTY_TEMPLATE: SurveyTemplate = {
    id: 'party',
    name: 'Party Planning',
    icon: PartyPopper,
    color: 'text-amber-500',
    description: 'Event RSVP, preferences, activities',
    sections: [
        {
            id: 'rsvp',
            title: 'RSVP',
            questions: [
                { id: 'q1', type: 'multiple_choice', question: 'Can you make it?', options: [
                    { id: 'yes', text: 'Yes, I will be there!' },
                    { id: 'maybe', text: 'Maybe, not sure yet' },
                    { id: 'no', text: 'Sorry, I cannot make it' },
                ], required: true },
                { id: 'q2', type: 'number', question: 'How many people are you bringing?', min: 0, max: 5 },
            ]
        },
        {
            id: 'preferences',
            title: 'Preferences',
            questions: [
                { id: 'q3', type: 'multiple_choice', question: 'Food preferences?', options: [
                    { id: 'everything', text: 'I eat everything' },
                    { id: 'vegetarian', text: 'Vegetarian' },
                    { id: 'vegan', text: 'Vegan' },
                    { id: 'other', text: 'Other dietary needs' },
                ] },
                { id: 'q4', type: 'textarea', question: 'Any allergies we should know about?', placeholder: 'List any allergies...' },
            ]
        }
    ]
};

export const BABY_SHOWER_TEMPLATE: SurveyTemplate = {
    id: 'babyshower',
    name: 'Baby Shower',
    icon: Baby,
    color: 'text-cyan-500',
    description: 'Celebrate the new arrival',
    sections: [
        {
            id: 'attendance',
            title: 'RSVP',
            questions: [
                { id: 'q1', type: 'yes_no', question: 'Will you be joining us?', required: true },
                { id: 'q2', type: 'number', question: 'Number of guests', min: 1, max: 4 },
            ]
        },
        {
            id: 'fun',
            title: 'Fun Stuff',
            questions: [
                { id: 'q3', type: 'text', question: 'Your best parenting advice (one sentence)', placeholder: 'Share your wisdom...' },
                { id: 'q4', type: 'textarea', question: 'A wish for the baby', placeholder: 'Your heartfelt wishes...' },
            ]
        }
    ]
};

// ============================================================================
// EXPORT ALL TEMPLATES
// ============================================================================

export const SURVEY_TEMPLATES: SurveyTemplate[] = [
    // NEW - High-value business templates
    EMPLOYEE_ENGAGEMENT_TEMPLATE,
    CSAT_SURVEY_TEMPLATE,
    NPS_QUICK_TEMPLATE,
    POST_PURCHASE_TEMPLATE,
    // Existing templates
    WEDDING_RSVP_TEMPLATE,
    TEAM_FEEDBACK_TEMPLATE,
    PARTY_TEMPLATE,
    BABY_SHOWER_TEMPLATE,
];

export default SURVEY_TEMPLATES;
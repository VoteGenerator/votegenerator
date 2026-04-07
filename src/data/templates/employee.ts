import { Users, Briefcase } from 'lucide-react';
import { SurveyTemplate } from './_types';
 
// ============================================================================
// EMPLOYEE ENGAGEMENT SURVEY
// Keyword: employee engagement survey template (50,000/mo)
// ============================================================================
const EMPLOYEE_ENGAGEMENT_TEMPLATE: SurveyTemplate = {
    id: 'employee-engagement',
    name: 'Employee Engagement Survey',
    emoji: '👥',
    icon: Users,
    color: 'text-emerald-600',
    description: 'Measure team satisfaction, growth, and culture',
    category: 'employee',
    targetKeyword: 'employee engagement survey template',
    priority: 'P1',
    conversionHook: 'Pro: response timeline + CSV export for HR reporting',
    planGate: 'free',
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
                        { id: '1-2',    text: '1-2 years' },
                        { id: '3-5',    text: '3-5 years' },
                        { id: '5-plus', text: '5+ years' },
                        { id: 'unsure', text: 'Not sure' },
                    ],
                    required: true,
                },
            ],
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
                        { id: 'training',   text: 'More training opportunities' },
                        { id: 'mentorship', text: 'Mentorship program' },
                        { id: 'feedback',   text: 'More frequent feedback' },
                        { id: 'projects',   text: 'Challenging projects' },
                        { id: 'promotion',  text: 'Clear promotion path' },
                    ],
                    allowMultiple: true,
                },
            ],
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
            ],
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
                        { id: 'remote',    text: 'More remote flexibility' },
                        { id: 'hours',     text: 'Flexible hours' },
                        { id: 'pto',       text: 'More PTO' },
                        { id: 'wellness',  text: 'Wellness programs' },
                        { id: 'equipment', text: 'Better equipment' },
                    ],
                    allowMultiple: true,
                },
            ],
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
            ],
        },
    ],
};
 
// ============================================================================
// EMPLOYEE SATISFACTION SURVEY
// Keyword: employee satisfaction survey template (5,000/mo)
// ============================================================================
const EMPLOYEE_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'employee-satisfaction',
    name: 'Employee Satisfaction Survey',
    emoji: '😊',
    icon: Briefcase,
    color: 'text-cyan-600',
    description: 'Measure satisfaction across role, pay, balance, management, and culture',
    category: 'employee',
    targetKeyword: 'employee satisfaction survey template',
    priority: 'P1',
    conversionHook: 'Pro: response timeline to track satisfaction trends over time',
    planGate: 'free',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'es-role',
            title: 'Your Role',
            description: 'How satisfied are you with the fundamentals of your job?',
            questions: [
                {
                    id: 'es-q1',
                    type: 'scale',
                    question: 'How satisfied are you with your current role and responsibilities?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'es-q2',
                    type: 'scale',
                    question: 'How satisfied are you with your compensation and benefits package?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'es-q3',
                    type: 'scale',
                    question: 'How satisfied are you with your work-life balance?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'es-team',
            title: 'Manager & Culture',
            description: 'How satisfied are you with your team and the company environment?',
            questions: [
                {
                    id: 'es-q4',
                    type: 'scale',
                    question: 'How satisfied are you with your relationship with your manager?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'es-q5',
                    type: 'scale',
                    question: 'How satisfied are you with opportunities for learning and career development?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'es-q6',
                    type: 'scale',
                    question: 'How satisfied are you with the overall company culture?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'es-future',
            title: 'Looking Ahead',
            description: 'Your plans and honest feedback',
            questions: [
                {
                    id: 'es-q7',
                    type: 'multiple_choice',
                    question: 'How likely are you to still be working here in 12 months?',
                    options: [
                        { id: 'very-likely',   text: 'Very likely — I plan to stay' },
                        { id: 'likely',        text: 'Likely — no plans to leave' },
                        { id: 'unsure',        text: 'Unsure — depends on a few things' },
                        { id: 'unlikely',      text: 'Unlikely — I am considering leaving' },
                        { id: 'very-unlikely', text: 'Very unlikely — actively looking' },
                    ],
                    required: true,
                },
                {
                    id: 'es-q8',
                    type: 'textarea',
                    question: 'What is the one thing we could change to improve your satisfaction most?',
                    placeholder: 'Your honest answer helps us prioritise the right changes...',
                },
            ],
        },
    ],
};
 
export const EMPLOYEE_TEMPLATES: SurveyTemplate[] = [
    EMPLOYEE_ENGAGEMENT_TEMPLATE,
    EMPLOYEE_SATISFACTION_TEMPLATE,
    // Add future employee templates here: pulse survey, exit interview, manager feedback, etc.
];
 
import { Heart, Briefcase, PartyPopper, Baby } from 'lucide-react';
import { SurveyTemplate } from './_types';
 
const WEDDING_RSVP_TEMPLATE: SurveyTemplate = {
    id: 'wedding',
    name: 'Wedding RSVP',
    emoji: '💍',
    icon: Heart,
    color: 'text-pink-500',
    description: 'Attendance, meal preferences, song requests',
    category: 'events',
    priority: 'P2',
    planGate: 'free',
    sections: [
        {
            id: 'attendance',
            title: 'Attendance',
            description: 'Please let us know if you can make it',
            questions: [
                { id: 'q1', type: 'yes_no', question: 'Will you be attending?', required: true },
                { id: 'q2', type: 'number', question: 'Number of guests (including yourself)', min: 1, max: 10, required: true },
            ],
        },
        {
            id: 'meals',
            title: 'Meal Preferences',
            description: 'Help us plan the menu',
            questions: [
                {
                    id: 'q3',
                    type: 'multiple_choice',
                    question: 'Entrée preference',
                    options: [
                        { id: 'beef',       text: 'Beef' },
                        { id: 'chicken',    text: 'Chicken' },
                        { id: 'fish',       text: 'Fish' },
                        { id: 'vegetarian', text: 'Vegetarian' },
                    ],
                    required: true,
                },
                { id: 'q4', type: 'textarea', question: 'Any dietary restrictions or allergies?', placeholder: 'Please list any allergies...' },
            ],
        },
        {
            id: 'celebration',
            title: 'Celebration',
            description: 'Help us make it special',
            questions: [
                { id: 'q5', type: 'text',     question: 'Request a song for the dance floor', placeholder: 'Song title - Artist' },
                { id: 'q6', type: 'textarea', question: 'Leave a message for the couple (optional)', placeholder: 'Your well wishes...' },
            ],
        },
    ],
};
 
const TEAM_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'team-feedback',
    name: 'Team Feedback',
    emoji: '💼',
    icon: Briefcase,
    color: 'text-blue-500',
    description: 'Meeting feedback, project surveys',
    category: 'events',
    priority: 'P2',
    planGate: 'free',
    sections: [
        {
            id: 'overall',
            title: 'Overall Experience',
            questions: [
                { id: 'q1', type: 'rating', question: 'How would you rate the meeting overall?', required: true },
                {
                    id: 'q2',
                    type: 'scale',
                    question: 'How productive was this meeting?',
                    minValue: 1,
                    maxValue: 10,
                    minLabel: 'Not productive',
                    maxLabel: 'Very productive',
                    required: true,
                },
            ],
        },
        {
            id: 'details',
            title: 'Specific Feedback',
            questions: [
                {
                    id: 'q3',
                    type: 'multiple_choice',
                    question: 'What worked well?',
                    options: [
                        { id: 'agenda',     text: 'Clear agenda' },
                        { id: 'time',       text: 'Good time management' },
                        { id: 'discussion', text: 'Productive discussion' },
                        { id: 'decisions',  text: 'Clear decisions made' },
                    ],
                    allowMultiple: true,
                },
                { id: 'q4', type: 'textarea', question: 'What could be improved?', placeholder: 'Your suggestions...' },
            ],
        },
    ],
};
 
const PARTY_TEMPLATE: SurveyTemplate = {
    id: 'party',
    name: 'Party Planning',
    emoji: '🎉',
    icon: PartyPopper,
    color: 'text-amber-500',
    description: 'Event RSVP, preferences, activities',
    category: 'events',
    priority: 'P2',
    planGate: 'free',
    sections: [
        {
            id: 'rsvp',
            title: 'RSVP',
            questions: [
                {
                    id: 'q1',
                    type: 'multiple_choice',
                    question: 'Can you make it?',
                    options: [
                        { id: 'yes',   text: 'Yes, I will be there!' },
                        { id: 'maybe', text: 'Maybe, not sure yet' },
                        { id: 'no',    text: 'Sorry, I cannot make it' },
                    ],
                    required: true,
                },
                { id: 'q2', type: 'number', question: 'How many people are you bringing?', min: 0, max: 5 },
            ],
        },
        {
            id: 'preferences',
            title: 'Preferences',
            questions: [
                {
                    id: 'q3',
                    type: 'multiple_choice',
                    question: 'Food preferences?',
                    options: [
                        { id: 'everything', text: 'I eat everything' },
                        { id: 'vegetarian', text: 'Vegetarian' },
                        { id: 'vegan',      text: 'Vegan' },
                        { id: 'other',      text: 'Other dietary needs' },
                    ],
                },
                { id: 'q4', type: 'textarea', question: 'Any allergies we should know about?', placeholder: 'List any allergies...' },
            ],
        },
    ],
};
 
const BABY_SHOWER_TEMPLATE: SurveyTemplate = {
    id: 'babyshower',
    name: 'Baby Shower',
    emoji: '👶',
    icon: Baby,
    color: 'text-cyan-500',
    description: 'Celebrate the new arrival',
    category: 'events',
    priority: 'P3',
    planGate: 'free',
    sections: [
        {
            id: 'attendance',
            title: 'RSVP',
            questions: [
                { id: 'q1', type: 'yes_no', question: 'Will you be joining us?', required: true },
                { id: 'q2', type: 'number', question: 'Number of guests', min: 1, max: 4 },
            ],
        },
        {
            id: 'fun',
            title: 'Fun Stuff',
            questions: [
                { id: 'q3', type: 'text',     question: 'Your best parenting advice (one sentence)', placeholder: 'Share your wisdom...' },
                { id: 'q4', type: 'textarea', question: 'A wish for the baby', placeholder: 'Your heartfelt wishes...' },
            ],
        },
    ],
};
 
export const EVENTS_TEMPLATES: SurveyTemplate[] = [
    WEDDING_RSVP_TEMPLATE,
    TEAM_FEEDBACK_TEMPLATE,
    PARTY_TEMPLATE,
    BABY_SHOWER_TEMPLATE,
    // Add future event templates here: conference feedback, workshop eval, etc.
];
 
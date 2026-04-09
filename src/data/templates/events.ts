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
 
const EVENT_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'event-feedback',
    name: 'Event Feedback Survey',
    emoji: '🎤',
    color: 'text-rose-600',
    description: 'Gather attendee feedback to improve future events',
    category: 'events',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ef-overall',
            title: 'Overall Experience',
            description: 'How was the event?',
            questions: [
                {
                    id: 'ef-q1',
                    type: 'scale',
                    question: 'How would you rate the event overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ef-q2',
                    type: 'scale',
                    question: 'How likely are you to attend this event again?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Definitely',
                    required: true,
                },
                {
                    id: 'ef-q3',
                    type: 'scale',
                    question: 'How relevant was the content to your needs?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not relevant',
                    maxLabel: 'Very relevant',
                    required: true,
                },
            ],
        },
        {
            id: 'ef-details',
            title: 'Event Details',
            description: 'Tell us what worked',
            questions: [
                {
                    id: 'ef-q4',
                    type: 'multiple_choice',
                    question: 'What was the highlight of the event?',
                    options: [
                        { id: 'speakers',   text: 'Speaker / presenter quality' },
                        { id: 'content',    text: 'Content depth and quality' },
                        { id: 'networking', text: 'Networking opportunities' },
                        { id: 'venue',      text: 'Venue / platform experience' },
                        { id: 'other',      text: 'Something else' },
                    ],
                    allowMultiple: true,
                },
                {
                    id: 'ef-q5',
                    type: 'scale',
                    question: 'How would you rate the speakers or presenters?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                },
                {
                    id: 'ef-q6',
                    type: 'yes_no',
                    question: 'Would you recommend this event to a colleague?',
                    required: true,
                },
                {
                    id: 'ef-q7',
                    type: 'multiple_choice',
                    question: 'Was the event length appropriate?',
                    options: [
                        { id: 'too-short',  text: 'Too short — wanted more' },
                        { id: 'just-right', text: 'Just right' },
                        { id: 'too-long',   text: 'Too long' },
                    ],
                },
            ],
        },
        {
            id: 'ef-future',
            title: 'Looking Ahead',
            description: 'Help us plan the next one',
            questions: [
                {
                    id: 'ef-q8',
                    type: 'textarea',
                    question: 'What topics would you like covered at future events?',
                    placeholder: 'Share what you\'d love to learn or discuss next time...',
                },
                {
                    id: 'ef-q9',
                    type: 'textarea',
                    question: 'Any other feedback for the organizers?',
                    placeholder: 'What should we keep, change, or improve?',
                },
            ],
        },
    ],
};

const MEETING_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'meeting-feedback',
    name: 'Meeting Feedback Survey',
    emoji: '⏱️',
    color: 'text-orange-600',
    description: '7 questions — was this meeting worth the time?',
    category: 'events',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'mf-overall',
            title: 'Overall',
            description: 'How did the meeting go?',
            questions: [
                {
                    id: 'mf-q1',
                    type: 'scale',
                    question: 'How would you rate this meeting overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'mf-q2',
                    type: 'yes_no',
                    question: 'Was this meeting a good use of your time?',
                    required: true,
                },
            ],
        },
        {
            id: 'mf-effectiveness',
            title: 'Effectiveness',
            description: 'Did it achieve what it needed to?',
            questions: [
                {
                    id: 'mf-q3',
                    type: 'scale',
                    question: 'How clear was the agenda and purpose of this meeting?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
                {
                    id: 'mf-q4',
                    type: 'yes_no',
                    question: 'Did this meeting achieve what it set out to do?',
                    required: true,
                },
                {
                    id: 'mf-q5',
                    type: 'scale',
                    question: 'How well was time managed during this meeting?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'mf-future',
            title: 'Looking Ahead',
            description: 'Should this meeting happen again?',
            questions: [
                {
                    id: 'mf-q6',
                    type: 'multiple_choice',
                    question: 'Should this meeting recur?',
                    options: [
                        { id: 'yes-same',    text: 'Yes — keep it as is' },
                        { id: 'yes-changes', text: 'Yes — with some changes' },
                        { id: 'email',       text: 'No — could have been an email' },
                        { id: 'format',      text: 'No — needs a different format' },
                        { id: 'one-off',     text: 'One-off — not recurring' },
                    ],
                    required: true,
                },
                {
                    id: 'mf-q7',
                    type: 'textarea',
                    question: 'What one change would make this meeting more effective?',
                    placeholder: 'Be specific — what would make it 20% better?',
                },
            ],
        },
    ],
};

const CONFERENCE_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'conference-feedback',
    name: 'Conference Feedback Survey',
    emoji: '🎟️',
    color: 'text-sky-600',
    description: '9 questions — speaker quality, networking, NPS, and what to fix for next year',
    category: 'events',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'cf-experience',
            title: 'Event Experience',
            description: 'Content, speakers, and logistics',
            questions: [
                {
                    id: 'cf-q1',
                    type: 'scale',
                    question: 'How would you rate this conference overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'cf-q2',
                    type: 'scale',
                    question: 'How would you rate the quality of speakers and presentations?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'cf-q3',
                    type: 'scale',
                    question: 'How relevant and applicable was the session content to your work?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not relevant',
                    maxLabel: 'Highly relevant',
                    required: true,
                },
                {
                    id: 'cf-q4',
                    type: 'scale',
                    question: 'How valuable were the networking opportunities at this event?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not valuable',
                    maxLabel: 'Extremely valuable',
                    required: true,
                },
                {
                    id: 'cf-q5',
                    type: 'scale',
                    question: 'How would you rate the venue, logistics, and event organisation?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'cf-value',
            title: 'Value & Loyalty',
            description: 'Was it worth it? Will you return?',
            questions: [
                {
                    id: 'cf-q6',
                    type: 'yes_no',
                    question: 'Was this conference worth the time and cost of attending?',
                    required: true,
                },
                {
                    id: 'cf-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend this conference to a colleague?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'cf-q8',
                    type: 'yes_no',
                    question: 'Would you attend this conference again next year?',
                    required: true,
                },
            ],
        },
        {
            id: 'cf-improve',
            title: 'Improve Next Year',
            description: 'Shape the next edition',
            questions: [
                {
                    id: 'cf-q9',
                    type: 'textarea',
                    question: 'What is the one thing that would make next year\'s conference better?',
                    placeholder: 'Be specific — what would you change for next year?',
                },
            ],
        },
    ],
};


export const EVENTS_TEMPLATES: SurveyTemplate[] = [
    EVENT_FEEDBACK_TEMPLATE,
    MEETING_FEEDBACK_TEMPLATE,
    CONFERENCE_FEEDBACK_TEMPLATE,
    WEDDING_RSVP_TEMPLATE,
    TEAM_FEEDBACK_TEMPLATE,
    PARTY_TEMPLATE,
    BABY_SHOWER_TEMPLATE,
    // Add future event templates here: conference feedback, workshop eval, etc.
];
 
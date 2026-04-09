import { SurveyTemplate } from './_types';
 
// ============================================================================
// VOLUNTEER FEEDBACK SURVEY
// Keywords: volunteer feedback survey, volunteer satisfaction survey (1k-10k vol)
// ============================================================================
 
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
 
// ============================================================================
// 3. CHURCH MEMBER SURVEY → community.ts
// Target keyword: church member survey, congregation satisfaction survey (1k-5k/mo)
// Conversion hook: track whether belonging scores, pastoral support ratings,
//   and NPS are moving in the right direction year over year
// ============================================================================
export const CHURCH_MEMBER_TEMPLATE: SurveyTemplate = {
  id: 'church-member-survey',
  name: 'Church Member Survey',
  emoji: '⛪',
  color: 'text-amber-800',
  description: '9 questions for churches, parishes, and faith communities. Worship quality, community belonging, pastoral support, discipleship growth, ministry involvement, NPS, and open feedback. Anonymous.',
  category: 'community',
  targetKeyword: 'church member survey',
  priority: 'P2',
  conversionHook: 'Track whether belonging scores, pastoral support ratings, and NPS are moving in the right direction year over year.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: true,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'cm-experience',
      title: 'Worship & Experience',
      description: 'Your overall experience as a member',
      questions: [
        {
          id: 'cm-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with your experience as a member of our church?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'cm-q2',
          type: 'scale',
          question: 'How would you rate the quality and relevance of our worship services?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very poor',
          maxLabel: 'Excellent',
          required: true,
        },
      ],
    },
    {
      id: 'cm-community',
      title: 'Community & Pastoral Care',
      description: 'Belonging, leadership, and communication',
      questions: [
        {
          id: 'cm-q3',
          type: 'scale',
          question: 'How strongly do you feel a sense of belonging and community within our church?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'No sense of belonging',
          maxLabel: 'Very strong belonging',
          required: true,
        },
        {
          id: 'cm-q4',
          type: 'scale',
          question: 'How well do you feel supported by pastoral leadership and staff when you have a need?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not supported',
          maxLabel: 'Fully supported',
          required: true,
        },
      ],
    },
    {
      id: 'cm-growth',
      title: 'Growth & Involvement',
      description: 'Discipleship and ministry participation',
      questions: [
        {
          id: 'cm-q5',
          type: 'scale',
          question: 'How well does our church help you grow in your faith and discipleship?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not at all',
          maxLabel: 'Very well',
          required: true,
        },
        {
          id: 'cm-q6',
          type: 'yes_no',
          question: 'Are you currently involved in any ministry, small group, or serving role?',
          required: true,
        },
      ],
    },
    {
      id: 'cm-recommend',
      title: 'Recommendation & Feedback',
      description: 'NPS and open feedback',
      questions: [
        {
          id: 'cm-q7',
          type: 'nps',
          question: 'How likely are you to recommend our church to a friend or family member?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'cm-q8',
          type: 'textarea',
          question: 'What is the one thing our church could do to better serve you and your family?',
          placeholder: 'Your honest feedback helps us shape our ministry priorities...',
          required: false,
        },
      ],
    },
  ],
};



export const COMMUNITY_TEMPLATES: SurveyTemplate[] = [
    VOLUNTEER_FEEDBACK_TEMPLATE,
    CHURCH_MEMBER_TEMPLATE,
];
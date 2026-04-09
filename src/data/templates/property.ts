import { SurveyTemplate } from './_types';

// ============================================================================
// TENANT SATISFACTION SURVEY
// Keyword: tenant satisfaction survey, landlord feedback form (1k-5k/mo)
// ============================================================================
const TENANT_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'tenant-satisfaction',
    name: 'Tenant Satisfaction Survey',
    emoji: '🏠',
    color: 'text-green-700',
    description: 'Know how tenants really feel — 9 questions on condition, maintenance, and renewal intent',
    category: 'property',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ts-property',
            title: 'Property & Condition',
            description: 'Physical quality, maintenance, and safety',
            questions: [
                {
                    id: 'ts-q1',
                    type: 'scale',
                    question: 'How satisfied are you with your home or property overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ts-q2',
                    type: 'scale',
                    question: 'How well is the property maintained and kept in good condition?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'ts-q3',
                    type: 'scale',
                    question: 'How quickly and effectively are maintenance requests resolved?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'ts-service',
            title: 'Service & Communication',
            description: 'How the landlord or management team performs',
            questions: [
                {
                    id: 'ts-q4',
                    type: 'scale',
                    question: 'How would you rate the communication and responsiveness of the property management team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ts-q5',
                    type: 'scale',
                    question: 'How safe and secure do you feel in your home and building?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unsafe',
                    maxLabel: 'Very safe',
                    required: true,
                },
                {
                    id: 'ts-q6',
                    type: 'scale',
                    question: 'How satisfied are you with the quality of any communal or shared areas?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                },
            ],
        },
        {
            id: 'ts-renewal',
            title: 'Value & Renewal',
            description: 'Whether tenants plan to stay',
            questions: [
                {
                    id: 'ts-q7',
                    type: 'scale',
                    question: 'How would you rate the overall value for money of your tenancy?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'ts-q8',
                    type: 'scale',
                    question: 'How likely are you to renew your tenancy or lease when it is due?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unlikely',
                    maxLabel: 'Very likely',
                    required: true,
                },
                {
                    id: 'ts-q9',
                    type: 'textarea',
                    question: 'What is the one thing we could improve to make your tenancy experience better?',
                    placeholder: 'Your feedback helps us improve the property and service...',
                },
            ],
        },
    ],
};

// ============================================================================
// 2. VACATION RENTAL GUEST SURVEY → property.ts
// Target keyword: vacation rental guest survey, Airbnb feedback survey (1k-5k/mo)
// Conversion hook: hosts who survey guests privately report 2.4x more positive
//   public reviews — track scores improving across bookings with Pro timeline
// ============================================================================
export const VACATION_RENTAL_GUEST_TEMPLATE: SurveyTemplate = {
  id: 'vacation-rental-guest-survey',
  name: 'Vacation Rental Guest Survey',
  emoji: '🏡',
  color: 'text-teal-600',
  description: '9 questions for Airbnb hosts and holiday let managers. Listing accuracy, check-in, cleanliness, amenities, host communication, location, value, NPS, and open feedback. No guest signup.',
  category: 'property',
  targetKeyword: 'vacation rental guest survey',
  priority: 'P2',
  conversionHook: 'Hosts who survey guests privately after checkout report 2.4x more positive public reviews. Track whether scores improve across bookings.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: true,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'vr-arrival',
      title: 'Listing & Arrival',
      description: 'How did the property match your expectations?',
      questions: [
        {
          id: 'vr-q1',
          type: 'rating',
          question: 'How accurately did the listing description and photos represent the property?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'vr-q2',
          type: 'rating',
          question: 'How smooth and straightforward was the check-in process?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'vr-q3',
          type: 'rating',
          question: 'How would you rate the cleanliness of the property when you arrived?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'vr-stay',
      title: 'Your Stay',
      description: 'Amenities, host, location, and value',
      questions: [
        {
          id: 'vr-q4',
          type: 'rating',
          question: 'How satisfied were you with the amenities and equipment provided?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'vr-q5',
          type: 'rating',
          question: 'How responsive and helpful was your host when you needed anything?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'vr-q6',
          type: 'rating',
          question: 'How would you rate the location and access to local attractions?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'vr-q7',
          type: 'rating',
          question: 'How would you rate the value for money of your stay?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'vr-recommend',
      title: 'Overall & Feedback',
      description: 'Would you return and what would you change?',
      questions: [
        {
          id: 'vr-q8',
          type: 'nps',
          question: 'How likely are you to recommend this property to a friend or family member?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'vr-q9',
          type: 'textarea',
          question: 'Is there anything specific we could improve to make your next stay even better?',
          placeholder: 'Your honest feedback helps us improve the experience for every guest...',
          required: false,
        },
      ],
    },
  ],
};

// ============================================================================
// 5. HOA RESIDENT SURVEY → property.ts
// Target keyword: HOA resident survey, homeowners association survey (1k/mo)
// Conversion hook: compare maintenance scores, communication ratings, and NPS
//   year over year without any manual data work
// ============================================================================
export const HOA_RESIDENT_TEMPLATE: SurveyTemplate = {
  id: 'hoa-resident-survey',
  name: 'HOA Resident Survey',
  emoji: '🏘️',
  color: 'text-green-800',
  description: '9 questions for HOA boards, condo associations, and property managers. Maintenance, amenities, communication, responsiveness, safety, value for dues, NPS, and open feedback. Anonymous.',
  category: 'property',
  targetKeyword: 'HOA resident survey',
  priority: 'P2',
  conversionHook: 'Compare maintenance scores, communication ratings, and NPS year over year without any manual data work.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: true,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'hoa-satisfaction',
      title: 'Overall Satisfaction',
      description: 'How satisfied are you as a resident?',
      questions: [
        {
          id: 'hoa-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you as a resident of our community?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
      ],
    },
    {
      id: 'hoa-maintenance',
      title: 'Maintenance & Amenities',
      description: 'Property upkeep and shared facilities',
      questions: [
        {
          id: 'hoa-q2',
          type: 'scale',
          question: 'How satisfied are you with the maintenance of shared spaces, grounds, and common areas?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'hoa-q3',
          type: 'scale',
          question: 'How satisfied are you with the quality and availability of community amenities?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
      ],
    },
    {
      id: 'hoa-management',
      title: 'Communication & Responsiveness',
      description: 'How well does management communicate and respond?',
      questions: [
        {
          id: 'hoa-q4',
          type: 'scale',
          question: 'How well does the HOA keep residents informed about decisions, projects, and community news?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very poorly',
          maxLabel: 'Excellently',
          required: true,
        },
        {
          id: 'hoa-q5',
          type: 'scale',
          question: 'How responsive is management when you raise a concern, request, or maintenance issue?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not responsive',
          maxLabel: 'Very responsive',
          required: true,
        },
        {
          id: 'hoa-q6',
          type: 'scale',
          question: 'How safe do you feel walking around the community and using shared spaces?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very unsafe',
          maxLabel: 'Very safe',
          required: true,
        },
      ],
    },
    {
      id: 'hoa-value',
      title: 'Value & Feedback',
      description: 'Dues value, NPS, and open feedback',
      questions: [
        {
          id: 'hoa-q7',
          type: 'scale',
          question: 'How well do your HOA fees and dues represent value for the services and maintenance you receive?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Poor value',
          maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'hoa-q8',
          type: 'nps',
          question: 'How likely are you to recommend this community to someone looking to buy or rent here?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'hoa-q9',
          type: 'textarea',
          question: 'What is the one thing our HOA could do to most improve your experience as a resident?',
          placeholder: 'Your anonymous feedback helps the board set the right priorities...',
          required: false,
        },
      ],
    },
  ],
};


export const PROPERTY_TEMPLATES: SurveyTemplate[] = [
    TENANT_SATISFACTION_TEMPLATE,
    TENANT_SATISFACTION_TEMPLATE,
  STUDENT_HOUSING_TEMPLATE,
  VACATION_RENTAL_GUEST_TEMPLATE,
  HOA_RESIDENT_TEMPLATE,
];
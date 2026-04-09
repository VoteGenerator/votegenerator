import { SurveyTemplate } from './_types';

// ============================================================================
// PATIENT SATISFACTION SURVEY
// ============================================================================

const PATIENT_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'patient-satisfaction',
    name: 'Patient Satisfaction Survey',
    emoji: '🩺',
    color: 'text-blue-600',
    description: 'Measure patient experience across care quality, communication, wait times, and overall satisfaction',
    category: 'healthcare',
    targetKeyword: 'patient satisfaction survey',
    priority: 'P1',
    conversionHook: 'Clinics using regular patient feedback surveys see 23% higher retention and stronger review scores.',
    planGate: 'free',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ps-arrival',
            title: 'Arrival & Waiting',
            description: 'Your experience before being seen',
            questions: [
                {
                    id: 'ps-q1',
                    type: 'scale',
                    question: 'How would you rate the ease of booking your appointment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'ps-q2',
                    type: 'scale',
                    question: 'How satisfied were you with the wait time before being seen?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ps-q3',
                    type: 'scale',
                    question: 'How clean and comfortable was the waiting area?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'ps-care',
            title: 'Care & Communication',
            description: 'Your experience with clinical staff',
            questions: [
                {
                    id: 'ps-q4',
                    type: 'scale',
                    question: 'How well did your doctor or nurse listen to your concerns?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Extremely well',
                    required: true,
                },
                {
                    id: 'ps-q5',
                    type: 'scale',
                    question: 'How clearly were your diagnosis and treatment options explained to you?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not clearly',
                    maxLabel: 'Very clearly',
                    required: true,
                },
                {
                    id: 'ps-q6',
                    type: 'scale',
                    question: 'How professional and respectful was the clinical team?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ps-q7',
                    type: 'yes_no',
                    question: 'Did you feel comfortable asking questions during your appointment?',
                    required: true,
                },
            ],
        },
        {
            id: 'ps-overall',
            title: 'Overall Experience',
            description: 'The full picture',
            questions: [
                {
                    id: 'ps-q8',
                    type: 'scale',
                    question: 'Overall, how satisfied were you with the care you received?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'ps-q9',
                    type: 'scale',
                    question: 'How likely are you to recommend this practice or clinic to a friend or family member?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ps-q10',
                    type: 'textarea',
                    question: 'Is there anything specific we could improve to make your experience better next time?',
                    placeholder: 'Your feedback helps us provide better care for every patient...',
                },
            ],
        },
    ],
};

// ============================================================================
// DENTAL PATIENT SATISFACTION SURVEY
// Keyword: dental patient satisfaction survey, dental feedback form (1k-5k/mo)
// ============================================================================
const DENTAL_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'dental-satisfaction',
    name: 'Dental Patient Satisfaction Survey',
    emoji: '🦷',
    color: 'text-cyan-700',
    description: 'Know what patients experience before they post it publicly — 9 questions, CQC-relevant',
    category: 'healthcare',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ds-appointment',
            title: 'Booking & Arrival',
            description: 'Access and wait time experience',
            questions: [
                {
                    id: 'ds-q1',
                    type: 'scale',
                    question: 'How easy was it to book your appointment with us?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very difficult',
                    maxLabel: 'Very easy',
                    required: true,
                },
                {
                    id: 'ds-q2',
                    type: 'scale',
                    question: 'How satisfied were you with the wait time before your appointment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
            ],
        },
        {
            id: 'ds-clinical',
            title: 'Clinical Experience',
            description: 'Communication, consent, pain, and hygiene',
            questions: [
                {
                    id: 'ds-q3',
                    type: 'scale',
                    question: 'How well did your dentist listen to your concerns and answer your questions?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'ds-q4',
                    type: 'scale',
                    question: 'How clearly were your treatment options and costs explained before proceeding?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Very clearly',
                    required: true,
                },
                {
                    id: 'ds-q5',
                    type: 'scale',
                    question: 'How comfortable and well-managed was any pain or discomfort during your treatment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Poorly managed',
                    maxLabel: 'Excellently managed',
                    required: true,
                },
                {
                    id: 'ds-q6',
                    type: 'scale',
                    question: 'How would you rate the cleanliness and hygiene of the practice?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'ds-value',
            title: 'Value & Recommendation',
            description: 'Value for money, NPS, and open feedback',
            questions: [
                {
                    id: 'ds-q7',
                    type: 'scale',
                    question: 'How would you rate the value for money of today\'s appointment?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor value',
                    maxLabel: 'Excellent value',
                    required: true,
                },
                {
                    id: 'ds-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend our dental practice to a friend or family member?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'ds-q9',
                    type: 'textarea',
                    question: 'Is there anything we could improve to make your next visit better?',
                    placeholder: 'Your feedback helps us improve the experience for every patient...',
                },
            ],
        },
    ],
};

// ============================================================================
// PATIENT DISCHARGE SURVEY
// Keyword: patient discharge survey, hospital discharge feedback (1k-5k/mo)
// ============================================================================
const PATIENT_DISCHARGE_TEMPLATE: SurveyTemplate = {
    id: 'patient-discharge',
    name: 'Patient Discharge Survey',
    emoji: '🏥',
    color: 'text-teal-700',
    description: 'Catch the gaps in discharge planning before they turn into readmissions — 9 questions',
    category: 'healthcare',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'pd-instructions',
            title: 'Discharge Instructions',
            description: 'Clarity of information given before leaving hospital',
            questions: [
                {
                    id: 'pd-q1',
                    type: 'scale',
                    question: 'How clearly were your discharge instructions explained before you left hospital?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
                {
                    id: 'pd-q2',
                    type: 'scale',
                    question: 'How confident do you feel about managing your care and recovery at home?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not confident at all',
                    maxLabel: 'Very confident',
                    required: true,
                },
                {
                    id: 'pd-q3',
                    type: 'scale',
                    question: 'How clearly were your medications and how to take them explained to you?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unclear',
                    maxLabel: 'Very clear',
                    required: true,
                },
            ],
        },
        {
            id: 'pd-arrangements',
            title: 'Follow-Up & Logistics',
            description: 'Appointments, transport, and home care arrangements',
            questions: [
                {
                    id: 'pd-q4',
                    type: 'scale',
                    question: 'How well were your follow-up appointments or referrals arranged before you left?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'pd-q5',
                    type: 'scale',
                    question: 'How well did staff support you with transport, equipment, or care at home arrangements?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'pd-quality',
            title: 'Care Quality & Safety',
            description: 'Overall care and patient safety dimensions',
            questions: [
                {
                    id: 'pd-q6',
                    type: 'scale',
                    question: 'How would you rate the overall quality of care you received during your stay?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'pd-q7',
                    type: 'scale',
                    question: 'Were all your questions and concerns properly addressed before you left?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Completely',
                    required: true,
                },
                {
                    id: 'pd-q8',
                    type: 'scale',
                    question: 'How likely are you to recommend this ward or hospital to family or friends?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'pd-q9',
                    type: 'textarea',
                    question: 'Is there anything specific about your discharge that we could have handled better?',
                    placeholder: 'Your feedback goes directly to the ward team and helps improve the experience for future patients...',
                },
            ],
        },
    ],
};

// ============================================================================
// EXPORT
// ============================================================================
export const HEALTHCARE_TEMPLATES: SurveyTemplate[] = [
    PATIENT_SATISFACTION_TEMPLATE,
    DENTAL_SATISFACTION_TEMPLATE,
    PATIENT_DISCHARGE_TEMPLATE,
];
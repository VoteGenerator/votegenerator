import { SurveyTemplate } from './_types';

// ============================================================================
// COURSE EVALUATION SURVEY
// Keyword: course evaluation survey, course feedback form (5k-10k/mo)
// ============================================================================
const COURSE_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'course-feedback',
    name: 'Course Evaluation Survey',
    emoji: '📚',
    color: 'text-blue-800',
    description: 'Overall rating, instructor quality, content relevance, and improvement feedback',
    category: 'education',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'ce-overall',
            title: 'Overall Assessment',
            description: 'How would you rate this course?',
            questions: [
                {
                    id: 'ce-q1',
                    type: 'scale',
                    question: 'How would you rate this course overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'ce-q2',
                    type: 'scale',
                    question: 'How relevant was the course content to your learning goals?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not relevant',
                    maxLabel: 'Very relevant',
                    required: true,
                },
                {
                    id: 'ce-q3',
                    type: 'scale',
                    question: 'How would you rate the instructor or presenter?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
            ],
        },
        {
            id: 'ce-delivery',
            title: 'Content & Delivery',
            description: 'How was the course structured and paced?',
            questions: [
                {
                    id: 'ce-q4',
                    type: 'scale',
                    question: 'The course content was well-organised and easy to follow',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Strongly disagree',
                    maxLabel: 'Strongly agree',
                    required: true,
                },
                {
                    id: 'ce-q5',
                    type: 'multiple_choice',
                    question: 'Was the pace of this course appropriate?',
                    options: [
                        { id: 'too-fast', text: 'Too fast — couldn\'t keep up' },
                        { id: 'sl-fast',  text: 'Slightly fast but manageable' },
                        { id: 'right',    text: 'Just right' },
                        { id: 'sl-slow',  text: 'Slightly slow' },
                        { id: 'too-slow', text: 'Too slow — wanted more depth' },
                    ],
                    required: true,
                },
                {
                    id: 'ce-q6',
                    type: 'multiple_choice',
                    question: 'Which resources were most helpful? (select all that apply)',
                    options: [
                        { id: 'slides',    text: 'Lecture slides or notes' },
                        { id: 'videos',    text: 'Video recordings' },
                        { id: 'readings',  text: 'Reading materials' },
                        { id: 'qa',        text: 'Live Q&A sessions' },
                        { id: 'exercises', text: 'Exercises and assignments' },
                        { id: 'links',     text: 'External links and examples' },
                    ],
                    allowMultiple: true,
                },
            ],
        },
        {
            id: 'ce-outcomes',
            title: 'Learning Outcomes',
            description: 'What will you take away?',
            questions: [
                {
                    id: 'ce-q7',
                    type: 'yes_no',
                    question: 'Would you recommend this course to others?',
                    required: true,
                },
                {
                    id: 'ce-q8',
                    type: 'textarea',
                    question: 'What will you apply from what you learned in this course?',
                    placeholder: 'Share the most valuable thing you\'re taking away...',
                },
                {
                    id: 'ce-q9',
                    type: 'textarea',
                    question: 'What is the one thing that could most improve this course?',
                    placeholder: 'Your honest feedback helps improve the course for future students...',
                },
            ],
        },
    ],
};

// ============================================================================
// CORPORATE TRAINING FEEDBACK SURVEY
// Keyword: training feedback survey, corporate training evaluation (5k/mo)
// ============================================================================
const TRAINING_FEEDBACK_TEMPLATE: SurveyTemplate = {
    id: 'training-feedback',
    name: 'Corporate Training Feedback Survey',
    emoji: '📋',
    color: 'text-blue-600',
    description: '8 questions — know if your training investment is actually landing',
    category: 'education',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'tf-reaction',
            title: 'Training Experience',
            description: 'How did the training go? (Kirkpatrick Level 1)',
            questions: [
                {
                    id: 'tf-q1',
                    type: 'scale',
                    question: 'How would you rate this training programme overall?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'tf-q2',
                    type: 'scale',
                    question: 'How relevant was the training content to your current role?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not relevant',
                    maxLabel: 'Highly relevant',
                    required: true,
                },
                {
                    id: 'tf-q3',
                    type: 'scale',
                    question: 'How would you rate the instructor or facilitator?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'tf-q4',
                    type: 'scale',
                    question: 'How well was the training organised and paced?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'tf-q5',
                    type: 'multiple_choice',
                    question: 'Which training format was most effective for you?',
                    options: [
                        { id: 'inperson',   text: 'In-person, instructor-led' },
                        { id: 'virtual',    text: 'Live virtual / video call' },
                        { id: 'elearning',  text: 'Pre-recorded video / e-learning' },
                        { id: 'handson',    text: 'Hands-on / practical exercises' },
                        { id: 'discussion', text: 'Small group discussion' },
                        { id: 'reading',    text: 'Self-paced reading and materials' },
                    ],
                    required: true,
                },
            ],
        },
        {
            id: 'tf-learning',
            title: 'Knowledge Transfer',
            description: 'Will it actually change how you work? (Kirkpatrick Level 2)',
            questions: [
                {
                    id: 'tf-q6',
                    type: 'scale',
                    question: 'How confident are you in applying what you learned in your daily work?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not confident',
                    maxLabel: 'Very confident',
                    required: true,
                },
                {
                    id: 'tf-q7',
                    type: 'yes_no',
                    question: 'Would you recommend this training to a colleague?',
                    required: true,
                },
                {
                    id: 'tf-q8',
                    type: 'textarea',
                    question: 'What one change would make this training more effective?',
                    placeholder: 'Be specific — what would make it 20% more effective?',
                },
            ],
        },
    ],
};

// ============================================================================
// STUDENT SATISFACTION SURVEY
// Keyword: student satisfaction survey, NSS survey template (5k-10k/mo)
// ============================================================================
const STUDENT_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'student-satisfaction',
    name: 'Student Satisfaction Survey',
    emoji: '🎓',
    color: 'text-violet-700',
    description: '9 questions — NSS-aligned teaching, assessment, support, and student voice',
    category: 'education',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'stu-academic',
            title: 'Academic Experience',
            description: 'Teaching quality, content, and assessment',
            questions: [
                {
                    id: 'stu-q1',
                    type: 'scale',
                    question: 'How satisfied are you with your overall academic experience so far?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'stu-q2',
                    type: 'scale',
                    question: 'How would you rate the quality of teaching on your programme?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'stu-q3',
                    type: 'scale',
                    question: 'How fair and well-structured are the assessments and marking on your course?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unfair',
                    maxLabel: 'Very fair',
                    required: true,
                },
            ],
        },
        {
            id: 'stu-support',
            title: 'Support & Environment',
            description: 'Services, resources, and student voice',
            questions: [
                {
                    id: 'stu-q4',
                    type: 'scale',
                    question: 'How helpful and accessible are student support services at your institution?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not at all',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'stu-q5',
                    type: 'scale',
                    question: 'How would you rate the learning environment and resources available to you?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'stu-q6',
                    type: 'yes_no',
                    question: 'Do you feel your feedback is listened to and acted upon by your institution?',
                    required: true,
                },
            ],
        },
        {
            id: 'stu-loyalty',
            title: 'Satisfaction & Recommendation',
            description: 'Would you choose us again?',
            questions: [
                {
                    id: 'stu-q7',
                    type: 'scale',
                    question: 'How likely are you to recommend this institution to a prospective student?',
                    minValue: 0,
                    maxValue: 10,
                    minLabel: 'Not likely',
                    maxLabel: 'Extremely likely',
                    required: true,
                },
                {
                    id: 'stu-q8',
                    type: 'yes_no',
                    question: 'Would you choose this institution again if starting your studies over?',
                    required: true,
                },
                {
                    id: 'stu-q9',
                    type: 'textarea',
                    question: 'What is the one thing that would most improve your academic experience?',
                    placeholder: 'Your honest feedback helps improve the experience for all students...',
                },
            ],
        },
    ],
};

// ============================================================================
// SCHOOL SATISFACTION SURVEY (PARENTS)
// Keyword: school satisfaction survey, parent survey for schools (1k-5k/mo)
// ============================================================================
const SCHOOL_SATISFACTION_TEMPLATE: SurveyTemplate = {
    id: 'school-satisfaction',
    name: 'School Satisfaction Survey (Parents)',
    emoji: '🏫',
    color: 'text-orange-600',
    description: 'Ofsted-relevant parent satisfaction survey — 10 questions for governing bodies',
    category: 'education',
    recommendedSettings: {
        anonymousMode: true,
        showProgress: true,
        allowBack: true,
    },
    sections: [
        {
            id: 'sch-academic',
            title: 'Teaching & Learning',
            description: 'Quality of education and child experience',
            questions: [
                {
                    id: 'sch-q1',
                    type: 'scale',
                    question: 'Overall, how satisfied are you with our school?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very dissatisfied',
                    maxLabel: 'Very satisfied',
                    required: true,
                },
                {
                    id: 'sch-q2',
                    type: 'scale',
                    question: 'How would you rate the quality of teaching and learning at this school?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poor',
                    maxLabel: 'Excellent',
                    required: true,
                },
                {
                    id: 'sch-q3',
                    type: 'scale',
                    question: 'How happy and settled does your child feel at school?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very unhappy',
                    maxLabel: 'Very happy',
                    required: true,
                },
            ],
        },
        {
            id: 'sch-communication',
            title: 'Communication & Wellbeing',
            description: 'How well the school communicates and supports pupils',
            questions: [
                {
                    id: 'sch-q4',
                    type: 'scale',
                    question: 'How well does the school keep you informed and communicate with parents?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'sch-q5',
                    type: 'scale',
                    question: 'How well does the school support your child\'s emotional wellbeing and safety?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'sch-q6',
                    type: 'scale',
                    question: 'How well does the school manage homework and workload to suit family life?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
            ],
        },
        {
            id: 'sch-leadership',
            title: 'Inclusion & Leadership',
            description: 'Inclusion, confidence in leadership, and parent engagement',
            questions: [
                {
                    id: 'sch-q7',
                    type: 'scale',
                    question: 'How well does the school celebrate and include children from all backgrounds and abilities?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'sch-q8',
                    type: 'scale',
                    question: 'How confident are you in the school\'s leadership and direction?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Not confident',
                    maxLabel: 'Very confident',
                    required: true,
                },
                {
                    id: 'sch-q9',
                    type: 'scale',
                    question: 'How well does the school involve parents and carers in school life?',
                    minValue: 1,
                    maxValue: 5,
                    minLabel: 'Very poorly',
                    maxLabel: 'Excellently',
                    required: true,
                },
                {
                    id: 'sch-q10',
                    type: 'textarea',
                    question: 'What one thing could the school do to improve your experience as a parent or carer?',
                    placeholder: 'Your suggestion goes to the headteacher and governing body...',
                },
            ],
        },
    ],
};

// ============================================================================
// 6. ALUMNI SURVEY → education.ts
// Target keyword: alumni survey template, university alumni survey (1k/mo)
// Conversion hook: track how career preparedness scores, NPS, and giving intent
//   change across cohorts and survey years — CSV export for IR reports
// ============================================================================
export const ALUMNI_TEMPLATE: SurveyTemplate = {
  id: 'alumni-survey',
  name: 'Alumni Survey',
  emoji: '🎓',
  color: 'text-red-900',
  description: '9 questions for university and college alumni relations teams. Education quality, career preparedness, career outcomes, institutional pride, alumni programme satisfaction, NPS, giving intent, and open feedback.',
  category: 'education',
  targetKeyword: 'alumni survey template',
  priority: 'P2',
  conversionHook: 'Track how career preparedness scores, NPS, and giving intent change across graduation cohorts and survey years. CSV export for IR reports.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: false,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'al-education',
      title: 'Education Quality',
      description: 'How was the education you received?',
      questions: [
        {
          id: 'al-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with the education you received from this institution?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'al-q2',
          type: 'scale',
          question: 'How would you rate the quality of teaching, faculty, and academic curriculum during your studies?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very poor',
          maxLabel: 'Excellent',
          required: true,
        },
      ],
    },
    {
      id: 'al-career',
      title: 'Career Outcomes',
      description: 'Career preparedness and outcomes since graduating',
      questions: [
        {
          id: 'al-q3',
          type: 'scale',
          question: 'How well did your education prepare you for your career and professional life?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not at all',
          maxLabel: 'Exceptionally well',
          required: true,
        },
        {
          id: 'al-q4',
          type: 'scale',
          question: 'How satisfied are you with the career outcomes you have achieved since graduating?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
      ],
    },
    {
      id: 'al-connection',
      title: 'Pride & Engagement',
      description: 'Connection to the institution today',
      questions: [
        {
          id: 'al-q5',
          type: 'scale',
          question: 'How strong is your sense of pride and connection to this institution today?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'No connection',
          maxLabel: 'Very strong pride',
          required: true,
        },
        {
          id: 'al-q6',
          type: 'scale',
          question: 'How satisfied are you with the alumni programmes, events, and engagement opportunities available to you?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Very dissatisfied',
          maxLabel: 'Very satisfied',
          required: true,
        },
      ],
    },
    {
      id: 'al-advocacy',
      title: 'Advocacy & Giving',
      description: 'Referral intent, NPS, and giving likelihood',
      questions: [
        {
          id: 'al-q7',
          type: 'nps',
          question: 'How likely are you to recommend this institution to a prospective student?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'al-q8',
          type: 'scale',
          question: 'How likely are you to support this institution financially through giving or donations in the next 12 months?',
          minValue: 1,
          maxValue: 5,
          minLabel: 'Not likely',
          maxLabel: 'Very likely',
          required: true,
        },
        {
          id: 'al-q9',
          type: 'textarea',
          question: 'What is the one thing this institution could most improve to better serve its alumni and students?',
          placeholder: 'Your feedback is reviewed by our alumni relations team...',
          required: false,
        },
      ],
    },
  ],
};
 
// ============================================================================
// 1. SCHOOL PARENT SURVEY → education.ts
// Target keyword: school parent survey, parent satisfaction survey school (1k-5k/mo)
// Conversion hook: track whether communication and satisfaction scores improve
//   year on year after each initiative
// ============================================================================
export const SCHOOL_PARENT_TEMPLATE: SurveyTemplate = {
  id: 'school-parent-survey',
  name: 'School Parent Survey',
  emoji: '🏫',
  color: 'text-orange-800',
  description: '9 anonymous questions for school leaders and head teachers. Teaching quality, school communication, student safety, extracurricular opportunities, individual support, leadership confidence, NPS, and open feedback.',
  category: 'education',
  targetKeyword: 'school parent survey',
  priority: 'P2',
  conversionHook: 'Track whether parent communication and satisfaction scores are improving year on year after each school initiative.',
  planGate: 'free',
  recommendedSettings: {
    anonymousMode: true,
    showProgress: true,
    allowBack: true,
  },
  sections: [
    {
      id: 'sp-satisfaction',
      title: 'Overall Satisfaction',
      description: 'How satisfied are you with your child\'s school?',
      questions: [
        {
          id: 'sp-q1',
          type: 'rating',
          question: 'Overall, how satisfied are you with your child\'s school?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'sp-q2',
          type: 'rating',
          question: 'How would you rate the quality of teaching your child receives?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'sp-communication',
      title: 'Communication & Safety',
      description: 'School-home communication and student wellbeing',
      questions: [
        {
          id: 'sp-q3',
          type: 'rating',
          question: 'How well does the school keep you informed and communicate with parents?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'sp-q4',
          type: 'rating',
          question: 'How safe and well cared for does your child feel at school?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'sp-q5',
          type: 'rating',
          question: 'How satisfied are you with the range of extracurricular and enrichment activities on offer?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'sp-support',
      title: 'Individual Support & Leadership',
      description: 'Personalised support and confidence in leadership',
      questions: [
        {
          id: 'sp-q6',
          type: 'rating',
          question: 'How well does the school support your child\'s individual needs and development?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
        {
          id: 'sp-q7',
          type: 'rating',
          question: 'How confident are you in the leadership and direction of the school?',
          minValue: 1,
          maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'sp-recommend',
      title: 'Recommendation & Feedback',
      description: 'NPS and open feedback for improvement',
      questions: [
        {
          id: 'sp-q8',
          type: 'nps',
          question: 'How likely are you to recommend this school to other parents?',
          minValue: 0,
          maxValue: 10,
          required: true,
        },
        {
          id: 'sp-q9',
          type: 'textarea',
          question: 'What is the one thing the school could do to most improve your child\'s experience?',
          placeholder: 'Your feedback helps the school improve for every family...',
          required: false,
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// 1. childcare-parent-survey → education.ts
// ─────────────────────────────────────────────
export const CHILDCARE_PARENT_TEMPLATE = {
  id: "childcare-parent-survey",
  slug: "childcare-parent-survey",
  title: "Childcare Parent Survey",
  description:
    "9 questions covering child safety, staff warmth, key person bond, settling-in, learning activities, communication, meals, NPS, and open feedback. Strong Ofsted parent voice evidence.",
  category: "education",
  tags: ["childcare", "nursery", "daycare", "preschool", "parent", "ofsted"],
  sectionPrefix: "cp-",
  pollType: "rating",
  questions: [
    {
      id: "cp-01",
      text: "Overall, how satisfied are you with the care your child receives at our setting?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-02",
      text: "How safe and well cared for does your child feel in our setting?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-03",
      text: "How warm, attentive, and nurturing do you find our staff with your child?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-04",
      text: "How well supported was your child during settling-in and how strong is their bond with their key person?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-05",
      text: "How satisfied are you with the range and quality of learning activities and play provided?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-06",
      text: "How well does the setting keep you informed about your child's day and development?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-07",
      text: "How satisfied are you with the meals, snacks, and nutrition provided?",
      type: "rating",
      scale: 5,
    },
    {
      id: "cp-08",
      text: "How likely are you to recommend our setting to another parent? (0–10)",
      type: "nps",
      scale: 10,
    },
    {
      id: "cp-09",
      text: "What is the one thing we could do to better support you and your child?",
      type: "open",
    },
  ],
  meta: {
    sendTiming: "October and February each year",
    anonymous: true,
    audience: ["nursery managers", "room leaders", "childminders"],
    keyChurnSignal: "cp-04",
    keyReferralSignal: "cp-08",
  },
  landingPage: "/templates/childcare-parent-survey",
  prefillUrl:
    "https://votegenerator.com/create?template=childcare-parent-survey",
};

// ─────────────────────────────────────────────
// 5. online-course-feedback-survey → education.ts
// ─────────────────────────────────────────────
export const ONLINE_COURSE_TEMPLATE = {
  id: "online-course-feedback-survey",
  slug: "online-course-feedback-survey",
  title: "Online Course Feedback Survey",
  description:
    "9 questions for course creators, EdTech platforms, and L&D teams. Covers overall satisfaction, content quality, instructor style, pacing, platform experience, learning objectives met, value, NPS, and open feedback.",
  category: "education",
  tags: [
    "online course",
    "e-learning",
    "course creator",
    "EdTech",
    "LMS",
    "learning",
  ],
  sectionPrefix: "oc-",
  pollType: "rating",
  questions: [
    {
      id: "oc-01",
      text: "Overall, how satisfied are you with this course?",
      type: "scale",
      scale: 5,
      min: "Very dissatisfied",
      max: "Very satisfied",
    },
    {
      id: "oc-02",
      text: "How would you rate the quality, depth, and accuracy of the course content?",
      type: "scale",
      scale: 5,
      min: "Very poor",
      max: "Excellent",
    },
    {
      id: "oc-03",
      text: "How engaging and effective was the instructor's teaching style?",
      type: "scale",
      scale: 5,
      min: "Not engaging",
      max: "Very engaging",
    },
    {
      id: "oc-04",
      text: "How well was the course paced and structured across lessons and modules?",
      type: "scale",
      scale: 5,
      min: "Very poor",
      max: "Excellent",
    },
    {
      id: "oc-05",
      text: "How smooth was your experience with the course platform and technical delivery?",
      type: "scale",
      scale: 5,
      min: "Very difficult",
      max: "Completely smooth",
    },
    {
      id: "oc-06",
      text: "How well did the course help you achieve the learning objectives or outcomes it promised?",
      type: "scale",
      scale: 5,
      min: "Did not achieve them",
      max: "Fully achieved them",
    },
    {
      id: "oc-07",
      text: "How well did this course represent value for the price you paid?",
      type: "scale",
      scale: 5,
      min: "Poor value",
      max: "Excellent value",
    },
    {
      id: "oc-08",
      text: "How likely are you to recommend this course to someone with similar learning goals? (0–10)",
      type: "nps",
      scale: 10,
    },
    {
      id: "oc-09",
      text: "What is the one thing that would have made this course more valuable to you?",
      type: "open",
    },
  ],
  meta: {
    sendTiming: "Within 24–48 hours of course completion",
    anonymous: true,
    platforms: ["Udemy", "Teachable", "Kajabi", "Thinkific", "Podia", "any LMS"],
    audience: ["course creators", "EdTech platforms", "corporate L&D teams"],
    keyChurnSignal: "oc-06",
    keyReferralSignal: "oc-08",
    note: "Q6 (learning objectives) gap vs Q8 (NPS) = sales copy or course structure mismatch. Most common refund driver.",
  },
  landingPage: "/templates/online-course-feedback-survey",
  prefillUrl:
    "https://votegenerator.com/create?template=online-course-feedback-survey",
};

export const CHILDCARE_PARENT_TEMPLATE: SurveyTemplate = {
  id: 'childcare-parent-survey',
  name: 'Childcare Parent Survey',
  emoji: '🌟',
  color: 'text-sky-600',
  description: '9 questions for nurseries, daycares, and childminders. Child safety, staff warmth, key person bond, settling-in, learning activities, communication, meals, NPS, and open feedback. Strong Ofsted parent voice evidence.',
  category: 'education',
  targetKeyword: 'childcare parent survey',
  recommendedSettings: { anonymousMode: true, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'cp-care',
      title: 'Care & Staff',
      description: 'Safety, warmth, and key person relationships',
      questions: [
        {
          id: 'cp-q1',
          type: 'rating',
          question: 'Overall, how satisfied are you with the care your child receives at our setting?',
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q2',
          type: 'rating',
          question: 'How safe and well cared for does your child feel in our setting?',
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q3',
          type: 'rating',
          question: 'How warm, attentive, and nurturing do you find our staff with your child?',
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q4',
          type: 'rating',
          question: "How well supported was your child during settling-in and how strong is their bond with their key person?",
          minValue: 1, maxValue: 5,
          required: true,
        },
      ],
    },
    {
      id: 'cp-learning',
      title: 'Learning & Communication',
      description: 'Activities, meals, and keeping families informed',
      questions: [
        {
          id: 'cp-q5',
          type: 'rating',
          question: 'How satisfied are you with the range and quality of learning activities and play provided?',
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q6',
          type: 'rating',
          question: "How well does the setting keep you informed about your child's day and development?",
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q7',
          type: 'rating',
          question: 'How satisfied are you with the meals, snacks, and nutrition provided?',
          minValue: 1, maxValue: 5,
          required: true,
        },
        {
          id: 'cp-q8',
          type: 'nps',
          question: 'How likely are you to recommend our setting to another parent?',
          minValue: 0, maxValue: 10,
          required: true,
        },
        {
          id: 'cp-q9',
          type: 'textarea',
          question: 'What is the one thing we could do to better support you and your child?',
          placeholder: 'Your feedback helps us improve the care we provide for every child...',
          required: false,
        },
      ],
    },
  ],
};

export const ONLINE_COURSE_TEMPLATE: SurveyTemplate = {
  id: 'online-course-feedback-survey',
  name: 'Online Course Feedback Survey',
  emoji: '🎓',
  color: 'text-lime-700',
  description: '9 questions for course creators, EdTech platforms, and L&D teams. Content quality, instructor style, pacing, platform experience, learning objectives met, value, NPS, and open feedback.',
  category: 'education',
  targetKeyword: 'online course feedback survey',
  recommendedSettings: { anonymousMode: true, showProgress: true, allowBack: true },
  sections: [
    {
      id: 'oc-content',
      title: 'Content & Delivery',
      description: 'Quality, pacing, and instructor effectiveness',
      questions: [
        {
          id: 'oc-q1',
          type: 'scale',
          question: 'Overall, how satisfied are you with this course?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very dissatisfied', maxLabel: 'Very satisfied',
          required: true,
        },
        {
          id: 'oc-q2',
          type: 'scale',
          question: 'How would you rate the quality, depth, and accuracy of the course content?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very poor', maxLabel: 'Excellent',
          required: true,
        },
        {
          id: 'oc-q3',
          type: 'scale',
          question: "How engaging and effective was the instructor's teaching style?",
          minValue: 1, maxValue: 5,
          minLabel: 'Not engaging', maxLabel: 'Very engaging',
          required: true,
        },
        {
          id: 'oc-q4',
          type: 'scale',
          question: 'How well was the course paced and structured across lessons and modules?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very poor', maxLabel: 'Excellent',
          required: true,
        },
        {
          id: 'oc-q5',
          type: 'scale',
          question: 'How smooth was your experience with the course platform and technical delivery?',
          minValue: 1, maxValue: 5,
          minLabel: 'Very difficult', maxLabel: 'Completely smooth',
          required: true,
        },
      ],
    },
    {
      id: 'oc-outcomes',
      title: 'Outcomes & Value',
      description: 'Whether the course delivered on its promises',
      questions: [
        {
          id: 'oc-q6',
          type: 'scale',
          question: 'How well did the course help you achieve the learning objectives or outcomes it promised?',
          minValue: 1, maxValue: 5,
          minLabel: 'Did not achieve them', maxLabel: 'Fully achieved them',
          required: true,
        },
        {
          id: 'oc-q7',
          type: 'scale',
          question: 'How well did this course represent value for the price you paid?',
          minValue: 1, maxValue: 5,
          minLabel: 'Poor value', maxLabel: 'Excellent value',
          required: true,
        },
        {
          id: 'oc-q8',
          type: 'nps',
          question: 'How likely are you to recommend this course to someone with similar learning goals?',
          minValue: 0, maxValue: 10,
          required: true,
        },
        {
          id: 'oc-q9',
          type: 'textarea',
          question: 'What is the one thing that would have made this course more valuable to you?',
          placeholder: 'Your feedback is reviewed by the course creator and helps improve the next version...',
          required: false,
        },
      ],
    },
  ],
};


// ============================================================================
// EXPORT
// ============================================================================
export const EDUCATION_TEMPLATES: SurveyTemplate[] = [
    COURSE_FEEDBACK_TEMPLATE,
    TRAINING_FEEDBACK_TEMPLATE,
    STUDENT_SATISFACTION_TEMPLATE,
    SCHOOL_SATISFACTION_TEMPLATE,
    ALUMNI_TEMPLATE,
    SCHOOL_PARENT_TEMPLATE,
    CHILDCARE_PARENT_TEMPLATE,          // new
    ONLINE_COURSE_TEMPLATE,             // new


];
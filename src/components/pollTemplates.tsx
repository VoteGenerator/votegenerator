// ============================================================================
// Poll Templates - Pre-built templates for common use cases
// ALL POLL TYPES ARE FREE - only response limits differ by plan
// ============================================================================

export type PollTemplate = {
    id: string;
    name: string;
    description: string;
    category: 'team' | 'events' | 'feedback' | 'fun' | 'hr' | 'education';
    categoryLabel: string;
    pollType: 'multiple' | 'ranked' | 'pairwise' | 'meeting' | 'rating' | 'rsvp' | 'image';
    icon: string;
    gradient: string;
    accentColor: string;
    question: string;
    options: string[];
    suggestedTheme: string;
    settings?: {
        allowMultiple?: boolean;
        hideResults?: boolean;
    };
    previewStyle: {
        bgPattern?: 'dots' | 'grid' | 'waves' | 'none' | 'confetti' | 'lines';
    };
    bestFor: string[];
    estimatedTime: string;
};

export const TEMPLATE_CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: '✨' },
    { id: 'team', label: 'Team Decisions', icon: '👥' },
    { id: 'events', label: 'Events & Planning', icon: '🎉' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'hr', label: 'HR & Culture', icon: '🏢' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'fun', label: 'Fun & Social', icon: '🎮' },
];

export const POLL_TEMPLATES: PollTemplate[] = [
    // =========================================================================
    // TEAM DECISIONS (10 templates)
    // =========================================================================
    {
        id: 'team-offsite',
        name: 'Team Offsite Location',
        description: 'Let your team vote on the perfect offsite destination with photos',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'image',
        icon: '🏝️',
        gradient: 'from-cyan-500 to-blue-600',
        accentColor: '#0891b2',
        question: 'Where should we hold our team offsite?',
        options: [
            'Mountain Lodge Retreat',
            'Beachfront Resort',
            'Urban Conference Center',
            'Countryside Vineyard'
        ],
        suggestedTheme: 'ocean',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Team retreats', 'Company offsites', 'Planning committees'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'sprint-priority',
        name: 'Sprint Priority',
        description: 'Rank features or tasks to align on what matters most',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'ranked',
        icon: '🎯',
        gradient: 'from-violet-500 to-purple-600',
        accentColor: '#7c3aed',
        question: 'Rank these features by priority for next sprint',
        options: [
            'User authentication improvements',
            'Dashboard analytics',
            'Mobile responsiveness',
            'Performance optimization',
            'New onboarding flow'
        ],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Sprint planning', 'Product teams', 'Agile ceremonies'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'team-lunch',
        name: 'Team Lunch Vote',
        description: 'Quick poll to decide where the team should eat',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'multiple',
        icon: '🍕',
        gradient: 'from-orange-500 to-red-500',
        accentColor: '#ea580c',
        question: 'Where should we go for team lunch?',
        options: [
            '🍕 Pizza Palace',
            '🍔 Burger Barn',
            '🍣 Sushi Station',
            '🥗 Salad Garden',
            '🌮 Taco Town'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Daily lunch decisions', 'Team outings', 'Office events'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'feature-ranking',
        name: 'Feature Ranking',
        description: 'Get team consensus on feature priorities with ranked voting',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'ranked',
        icon: '📊',
        gradient: 'from-emerald-500 to-teal-600',
        accentColor: '#059669',
        question: 'Rank these product features by importance',
        options: [
            'Dark mode',
            'Export to PDF',
            'Team collaboration',
            'API access',
            'Custom branding'
        ],
        suggestedTheme: 'forest',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Product roadmap', 'Feature prioritization', 'Customer feedback'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'budget-allocation',
        name: 'Budget Allocation',
        description: 'Prioritize where to invest team resources',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'ranked',
        icon: '💰',
        gradient: 'from-amber-500 to-yellow-500',
        accentColor: '#d97706',
        question: 'Rank these initiatives by budget priority',
        options: [
            'Marketing campaigns',
            'Product development',
            'Team training',
            'Infrastructure upgrades',
            'Customer support tools'
        ],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Budget planning', 'Resource allocation', 'Leadership decisions'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'project-name',
        name: 'Project Name Vote',
        description: 'Let the team pick the perfect project codename',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'multiple',
        icon: '🚀',
        gradient: 'from-indigo-500 to-blue-600',
        accentColor: '#4f46e5',
        question: 'What should we name our new project?',
        options: [
            'Project Phoenix',
            'Operation Thunder',
            'Initiative Nova',
            'Mission Horizon'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['New projects', 'Product launches', 'Team branding'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'meeting-time',
        name: 'Find Meeting Time',
        description: 'Discover when everyone is available to meet',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'meeting',
        icon: '🗓️',
        gradient: 'from-sky-500 to-blue-600',
        accentColor: '#0284c7',
        question: 'When can you attend the team sync?',
        options: [
            'Monday 10:00 AM',
            'Tuesday 2:00 PM',
            'Wednesday 11:00 AM',
            'Thursday 3:00 PM',
            'Friday 9:00 AM'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Team meetings', 'Scheduling', 'Availability checks'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'logo-feedback',
        name: 'Logo Design Vote',
        description: 'Get visual feedback on logo concepts',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'image',
        icon: '🎨',
        gradient: 'from-pink-500 to-rose-600',
        accentColor: '#e11d48',
        question: 'Which logo design do you prefer?',
        options: [
            'Design A - Modern',
            'Design B - Classic',
            'Design C - Playful',
            'Design D - Minimal'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Design feedback', 'Branding decisions', 'Creative reviews'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'tool-selection',
        name: 'Tool Selection',
        description: 'Compare and vote on software tools for the team',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'pairwise',
        icon: '🔧',
        gradient: 'from-slate-600 to-slate-800',
        accentColor: '#475569',
        question: 'Which project management tool should we use?',
        options: [
            'Notion',
            'Asana',
            'Monday.com',
            'ClickUp',
            'Linear'
        ],
        suggestedTheme: 'dark',
        settings: {},
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Tool evaluation', 'Software decisions', 'Vendor selection'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'retro-action',
        name: 'Retro Action Items',
        description: 'Prioritize action items from your retrospective',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'ranked',
        icon: '🔄',
        gradient: 'from-teal-500 to-cyan-600',
        accentColor: '#0d9488',
        question: 'Rank these retro action items by impact',
        options: [
            'Improve code review process',
            'Add more automated tests',
            'Better sprint planning',
            'More pair programming',
            'Reduce meeting time'
        ],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Sprint retros', 'Process improvement', 'Agile teams'],
        estimatedTime: '1 min to create'
    },

    // =========================================================================
    // EVENTS & PLANNING (8 templates)
    // =========================================================================
    {
        id: 'event-date',
        name: 'Event Date Picker',
        description: 'Find the best date that works for everyone',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'multiple',
        icon: '📅',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#4f46e5',
        question: 'Which date works best for the team event?',
        options: [
            'Friday, January 17th',
            'Saturday, January 18th',
            'Friday, January 24th',
            'Saturday, January 25th'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Team events', 'Meetings', 'Social gatherings'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'award-nomination',
        name: 'Award Nomination',
        description: 'Let the team vote on who deserves recognition',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'multiple',
        icon: '🏆',
        gradient: 'from-yellow-500 to-amber-600',
        accentColor: '#ca8a04',
        question: 'Who should receive the Employee of the Month award?',
        options: [
            'Add team member names...',
            'Nominee 2',
            'Nominee 3',
            'Nominee 4'
        ],
        suggestedTheme: 'gold',
        settings: { allowMultiple: false, hideResults: true },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Employee recognition', 'Team awards', 'Peer voting'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'party-theme',
        name: 'Party Theme Vote',
        description: 'Choose the perfect theme for your next celebration',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'image',
        icon: '🎊',
        gradient: 'from-fuchsia-500 to-purple-600',
        accentColor: '#a855f7',
        question: 'What theme should we have for the holiday party?',
        options: [
            '❄️ Winter Wonderland',
            '🌴 Tropical Paradise',
            '🎭 Masquerade Ball',
            '🕺 Disco Fever',
            '🎬 Hollywood Glamour'
        ],
        suggestedTheme: 'neon',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Holiday parties', 'Team celebrations', 'Social events'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'team-activity',
        name: 'Team Activity Vote',
        description: 'Pick the perfect team building activity',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'ranked',
        icon: '🎳',
        gradient: 'from-green-500 to-emerald-600',
        accentColor: '#16a34a',
        question: 'Rank these team activities by preference',
        options: [
            '🎳 Bowling night',
            '🧩 Escape room',
            '🎨 Paint & sip',
            '🎮 Game tournament',
            '🍳 Cooking class'
        ],
        suggestedTheme: 'forest',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Team building', 'Social events', 'Company outings'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'event-rsvp',
        name: 'Event RSVP',
        description: 'Collect RSVPs for your upcoming event',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'rsvp',
        icon: '💌',
        gradient: 'from-rose-500 to-pink-600',
        accentColor: '#e11d48',
        question: 'Can you attend the team dinner on Friday?',
        options: [
            "Yes, I'll be there!",
            "Sorry, can't make it",
            'Maybe, will confirm later'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Team dinners', 'Company events', 'Social gatherings'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'venue-vote',
        name: 'Venue Selection',
        description: 'Compare venues with photos and vote',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'image',
        icon: '🏛️',
        gradient: 'from-amber-500 to-orange-600',
        accentColor: '#d97706',
        question: 'Which venue should we book for the conference?',
        options: [
            'Grand Ballroom Hotel',
            'Modern Convention Center',
            'Rooftop Event Space',
            'Historic Manor House'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Conferences', 'Corporate events', 'Large gatherings'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'potluck-signup',
        name: 'Potluck Signup',
        description: 'Coordinate who brings what to the potluck',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'multiple',
        icon: '🍽️',
        gradient: 'from-orange-500 to-red-500',
        accentColor: '#ea580c',
        question: 'What will you bring to the potluck?',
        options: [
            '🥗 Salad / Appetizer',
            '🍖 Main dish',
            '🥧 Dessert',
            '🥤 Drinks',
            '🍞 Bread / Sides'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Office potlucks', 'Team lunches', 'Holiday gatherings'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'speaker-vote',
        name: 'Speaker Selection',
        description: 'Vote on keynote speakers for your event',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'ranked',
        icon: '🎤',
        gradient: 'from-indigo-500 to-purple-600',
        accentColor: '#6366f1',
        question: 'Rank your preferred keynote speakers',
        options: [
            'Industry Expert A',
            'Thought Leader B',
            'Author C',
            'Innovator D'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Conferences', 'Summits', 'Company events'],
        estimatedTime: '1 min to create'
    },

    // =========================================================================
    // FEEDBACK (6 templates)
    // =========================================================================
    {
        id: 'meeting-pulse',
        name: 'Meeting Pulse Check',
        description: 'Quick temperature check on how the meeting went',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '💭',
        gradient: 'from-pink-500 to-rose-600',
        accentColor: '#e11d48',
        question: 'How useful was this meeting?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Meeting feedback', 'Retros', 'Quick pulse checks'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'quick-decision',
        name: 'Quick Yes/No Decision',
        description: 'Get a fast consensus on simple decisions',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'multiple',
        icon: '✅',
        gradient: 'from-green-500 to-emerald-600',
        accentColor: '#16a34a',
        question: 'Should we move forward with this proposal?',
        options: [
            '✅ Yes, let\'s do it',
            '❌ No, not yet',
            '🤔 Need more info'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Quick decisions', 'Go/no-go votes', 'Consensus building'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'nps-score',
        name: 'NPS Score',
        description: 'Measure how likely someone is to recommend',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '📈',
        gradient: 'from-blue-500 to-cyan-600',
        accentColor: '#0284c7',
        question: 'How likely are you to recommend us to a friend? (0-10)',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Customer feedback', 'Product satisfaction', 'Service quality'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'presentation-feedback',
        name: 'Presentation Feedback',
        description: 'Collect feedback after a presentation',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '📊',
        gradient: 'from-violet-500 to-purple-600',
        accentColor: '#7c3aed',
        question: 'How would you rate this presentation?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Presentations', 'Workshops', 'Training sessions'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'workshop-satisfaction',
        name: 'Workshop Satisfaction',
        description: 'Rate different aspects of your workshop',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '🎓',
        gradient: 'from-teal-500 to-emerald-600',
        accentColor: '#0d9488',
        question: 'How satisfied were you with today\'s workshop?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'forest',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Workshops', 'Training', 'Educational events'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'idea-vote',
        name: 'Idea Prioritization',
        description: 'Vote on the best ideas from brainstorming',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'ranked',
        icon: '💡',
        gradient: 'from-yellow-500 to-orange-500',
        accentColor: '#eab308',
        question: 'Rank these ideas from our brainstorm session',
        options: [
            'Idea 1: Description',
            'Idea 2: Description',
            'Idea 3: Description',
            'Idea 4: Description'
        ],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Brainstorming', 'Innovation sessions', 'Ideation'],
        estimatedTime: '1 min to create'
    },

    // =========================================================================
    // HR & CULTURE (6 templates)
    // =========================================================================
    {
        id: 'benefits-preference',
        name: 'Benefits Preference',
        description: 'Understand what benefits matter most to your team',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'ranked',
        icon: '🎁',
        gradient: 'from-emerald-500 to-green-600',
        accentColor: '#059669',
        question: 'Rank these benefits by importance to you',
        options: [
            '🏥 Health insurance',
            '🏠 Remote work flexibility',
            '📚 Learning & development',
            '🏋️ Wellness programs',
            '👶 Parental leave'
        ],
        suggestedTheme: 'forest',
        settings: { hideResults: true },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Benefits planning', 'HR surveys', 'Employee feedback'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'office-vs-remote',
        name: 'Office vs Remote',
        description: 'Gauge team preference for work location',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'multiple',
        icon: '🏢',
        gradient: 'from-slate-500 to-slate-700',
        accentColor: '#475569',
        question: 'What\'s your preferred work arrangement?',
        options: [
            '🏢 Full-time office',
            '🏠 Full-time remote',
            '🔄 Hybrid (2-3 days office)',
            '🤷 Flexible / No preference'
        ],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Work policy', 'HR planning', 'Culture surveys'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'team-mood',
        name: 'Team Mood Check',
        description: 'Quick anonymous pulse on team morale',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'rating',
        icon: '😊',
        gradient: 'from-amber-400 to-yellow-500',
        accentColor: '#f59e0b',
        question: 'How are you feeling about work this week?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'sunset',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Team morale', 'Weekly check-ins', 'Culture health'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'charity-vote',
        name: 'Charity Selection',
        description: 'Let employees choose which charity to support',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'ranked',
        icon: '❤️',
        gradient: 'from-rose-500 to-red-600',
        accentColor: '#e11d48',
        question: 'Rank your preferred charities for our company donation',
        options: [
            '🌍 Environmental charity',
            '📚 Education nonprofit',
            '🏥 Health organization',
            '🍽️ Food bank',
            '🐾 Animal welfare'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Corporate giving', 'CSR programs', 'Team decisions'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'swag-vote',
        name: 'Company Swag Vote',
        description: 'Let employees pick their favorite swag items',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'image',
        icon: '👕',
        gradient: 'from-indigo-500 to-violet-600',
        accentColor: '#6366f1',
        question: 'Which swag item would you want most?',
        options: [
            '👕 Company hoodie',
            '🎒 Branded backpack',
            '🍶 Premium water bottle',
            '🎧 Wireless earbuds'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Swag orders', 'Employee appreciation', 'Company events'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'meeting-free-day',
        name: 'Meeting-Free Day',
        description: 'Vote on the best day for focused work',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'multiple',
        icon: '🔕',
        gradient: 'from-cyan-500 to-blue-600',
        accentColor: '#0891b2',
        question: 'Which day should be our meeting-free day?',
        options: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
        ],
        suggestedTheme: 'ocean',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Work-life balance', 'Productivity', 'Team policies'],
        estimatedTime: '30 sec to create'
    },

    // =========================================================================
    // EDUCATION (5 templates)
    // =========================================================================
    {
        id: 'class-topic',
        name: 'Class Topic Vote',
        description: 'Let students choose the next lesson topic',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'multiple',
        icon: '📖',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#4f46e5',
        question: 'What topic should we cover next class?',
        options: [
            'Topic A: Introduction',
            'Topic B: Deep dive',
            'Topic C: Case study',
            'Topic D: Hands-on workshop'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Classrooms', 'Training sessions', 'Workshops'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'study-group-time',
        name: 'Study Group Time',
        description: 'Find when everyone can meet to study',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'meeting',
        icon: '📚',
        gradient: 'from-purple-500 to-violet-600',
        accentColor: '#7c3aed',
        question: 'When can you meet for the study group?',
        options: [
            'Monday 4:00 PM',
            'Tuesday 5:00 PM',
            'Wednesday 3:00 PM',
            'Thursday 6:00 PM',
            'Saturday 10:00 AM'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Study groups', 'Student scheduling', 'Tutoring'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'field-trip',
        name: 'Field Trip Vote',
        description: 'Let students choose their field trip destination',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'image',
        icon: '🚌',
        gradient: 'from-green-500 to-teal-600',
        accentColor: '#14b8a6',
        question: 'Where should we go for the class field trip?',
        options: [
            '🏛️ History Museum',
            '🔬 Science Center',
            '🦁 Zoo',
            '🌳 Nature Reserve'
        ],
        suggestedTheme: 'forest',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Schools', 'Youth groups', 'Educational programs'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'course-feedback',
        name: 'Course Feedback',
        description: 'Gather end-of-course feedback from students',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'rating',
        icon: '⭐',
        gradient: 'from-amber-500 to-orange-500',
        accentColor: '#f59e0b',
        question: 'How would you rate this course overall?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Course evaluations', 'Training feedback', 'Workshops'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'project-group',
        name: 'Group Project Topic',
        description: 'Let the group decide on a project topic',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'ranked',
        icon: '🎯',
        gradient: 'from-rose-500 to-pink-600',
        accentColor: '#e11d48',
        question: 'Rank your preferred project topics',
        options: [
            'Topic 1: Research project',
            'Topic 2: Case study',
            'Topic 3: Creative project',
            'Topic 4: Technical build'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Group projects', 'Team assignments', 'Collaborative work'],
        estimatedTime: '1 min to create'
    },

    // =========================================================================
    // FUN & SOCIAL (7 templates)
    // =========================================================================
    {
        id: 'this-or-that',
        name: 'This or That',
        description: 'Fun icebreaker to spark conversations',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'pairwise',
        icon: '🎭',
        gradient: 'from-fuchsia-500 to-pink-600',
        accentColor: '#c026d3',
        question: 'This or That: Get to know your team!',
        options: [
            '☕ Coffee',
            '🍵 Tea',
            '🌅 Early bird',
            '🦉 Night owl',
            '📚 Books',
            '🎬 Movies'
        ],
        suggestedTheme: 'neon',
        settings: {},
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Icebreakers', 'Team bonding', 'Social events'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'movie-night',
        name: 'Movie Night Pick',
        description: 'Vote on what to watch together',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'image',
        icon: '🎬',
        gradient: 'from-purple-600 to-indigo-700',
        accentColor: '#7c3aed',
        question: 'What movie should we watch for team movie night?',
        options: [
            '🎬 Action thriller',
            '😂 Comedy',
            '🚀 Sci-fi adventure',
            '🎭 Drama'
        ],
        suggestedTheme: 'dark',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Team movie nights', 'Watch parties', 'Social events'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'pet-photo-contest',
        name: 'Pet Photo Contest',
        description: 'Vote on the cutest pet photos',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'image',
        icon: '🐾',
        gradient: 'from-amber-400 to-orange-500',
        accentColor: '#f59e0b',
        question: 'Vote for the cutest pet!',
        options: [
            'Pet 1',
            'Pet 2',
            'Pet 3',
            'Pet 4'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Fun contests', 'Team bonding', 'Slack channels'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'trivia-answer',
        name: 'Trivia Question',
        description: 'Quick trivia for team fun',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'multiple',
        icon: '🧠',
        gradient: 'from-emerald-500 to-teal-600',
        accentColor: '#14b8a6',
        question: 'Which planet is known as the Red Planet?',
        options: [
            'Venus',
            'Mars',
            'Jupiter',
            'Saturn'
        ],
        suggestedTheme: 'forest',
        settings: { allowMultiple: false, hideResults: true },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Trivia nights', 'Team games', 'Icebreakers'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'bracket-challenge',
        name: 'Bracket Challenge',
        description: 'Tournament-style voting on favorites',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'pairwise',
        icon: '🏅',
        gradient: 'from-yellow-500 to-amber-600',
        accentColor: '#d97706',
        question: 'Best snack bracket: Which wins?',
        options: [
            '🍕 Pizza',
            '🌮 Tacos',
            '🍔 Burgers',
            '🍟 Fries',
            '🍩 Donuts',
            '🍦 Ice cream'
        ],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Bracket tournaments', 'Fun debates', 'Team engagement'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'music-friday',
        name: 'Music Friday',
        description: 'Vote on the office playlist',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'ranked',
        icon: '🎵',
        gradient: 'from-pink-500 to-rose-600',
        accentColor: '#e11d48',
        question: 'Rank these genres for Friday\'s playlist',
        options: [
            '🎸 Rock',
            '🎹 Pop',
            '🎷 Jazz',
            '🎻 Classical',
            '🎤 Hip hop'
        ],
        suggestedTheme: 'neon',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Office playlists', 'Music voting', 'Team fun'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'would-you-rather',
        name: 'Would You Rather',
        description: 'Classic fun question for team bonding',
        category: 'fun',
        categoryLabel: 'Fun & Social',
        pollType: 'multiple',
        icon: '🤔',
        gradient: 'from-cyan-500 to-blue-600',
        accentColor: '#0891b2',
        question: 'Would you rather have the ability to fly or be invisible?',
        options: [
            '🦅 Fly anywhere',
            '👻 Be invisible'
        ],
        suggestedTheme: 'ocean',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Icebreakers', 'Team bonding', 'Fun discussions'],
        estimatedTime: '20 sec to create'
    },
];

// Helper to get templates by category
export const getTemplatesByCategory = (category: string): PollTemplate[] => {
    if (category === 'all') return POLL_TEMPLATES;
    return POLL_TEMPLATES.filter(t => t.category === category);
};

// Helper to get a template by ID
export const getTemplateById = (id: string): PollTemplate | undefined => {
    return POLL_TEMPLATES.find(t => t.id === id);
};

// Helper to get templates by poll type
export const getTemplatesByPollType = (pollType: string): PollTemplate[] => {
    return POLL_TEMPLATES.filter(t => t.pollType === pollType);
};

// Get template count by category
export const getTemplateCounts = (): Record<string, number> => {
    const counts: Record<string, number> = { all: POLL_TEMPLATES.length };
    TEMPLATE_CATEGORIES.forEach(cat => {
        if (cat.id !== 'all') {
            counts[cat.id] = POLL_TEMPLATES.filter(t => t.category === cat.id).length;
        }
    });
    return counts;
};
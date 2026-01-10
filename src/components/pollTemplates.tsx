// ============================================================================
// Poll Templates - Pre-built templates for common use cases
// ALL POLL TYPES ARE FREE - only response limits differ by plan
// 
// UPDATED: Added high-value survey templates at TOP based on search volume:
// - Employee Engagement: 49,500 monthly searches
// - Customer Satisfaction: 33,100 monthly searches  
// - NPS Survey: 8,100 monthly searches
// - Post-Purchase: 9,900 monthly searches
// ============================================================================

export type PollTemplate = {
    id: string;
    name: string;
    description: string;
    category: 'team' | 'events' | 'feedback' | 'fun' | 'hr' | 'education' | 'survey' | 'creators';
    categoryLabel: string;
    pollType: 'multiple' | 'ranked' | 'pairwise' | 'meeting' | 'rating' | 'rsvp' | 'image' | 'survey';
    icon: string;
    gradient: string;
    accentColor: string;
    question: string;
    options: string[];
    suggestedTheme: string;
    settings?: {
        allowMultiple?: boolean;
        hideResults?: boolean;
        anonymousMode?: boolean;
    };
    previewStyle: {
        bgPattern?: 'dots' | 'grid' | 'waves' | 'none' | 'confetti' | 'lines';
    };
    bestFor: string[];
    estimatedTime: string;
    // NEW: For multi-question surveys
    questionCount?: number;
    badge?: string;
    badgeColor?: string;
    featured?: boolean;
};

export const TEMPLATE_CATEGORIES = [
    { id: 'all', label: 'All Templates', icon: '✨' },
    { id: 'survey', label: 'Surveys & Feedback', icon: '📊' },
    { id: 'team', label: 'Team Decisions', icon: '👥' },
    { id: 'events', label: 'Events & Planning', icon: '🎉' },
    { id: 'feedback', label: 'Quick Feedback', icon: '💬' },
    { id: 'hr', label: 'HR & Culture', icon: '🏢' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'creators', label: 'Content Creators', icon: '🎬' },  // ADD THIS
    { id: 'fun', label: 'Fun & Social', icon: '🎮' },
];

export const POLL_TEMPLATES: PollTemplate[] = [
    // =========================================================================
    // HIGH-VALUE SURVEY TEMPLATES (NEW - FIRST based on search volume)
    // =========================================================================
    {
        id: 'employee-engagement',
        name: 'Employee Engagement Survey',
        description: 'Measure team satisfaction, growth opportunities, and workplace culture with anonymous feedback',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '👥',
        gradient: 'from-emerald-500 to-teal-600',
        accentColor: '#059669',
        question: 'How likely are you to recommend this company as a great place to work?',
        options: [
            'Overall satisfaction (NPS scale)',
            'Growth & development opportunities',
            'Work-life balance rating',
            'Manager relationship',
            'Team collaboration',
            'Recognition & appreciation',
            'Communication clarity',
            'Resource availability',
            'Company direction confidence',
            'Open feedback'
        ],
        suggestedTheme: 'minimal',
        settings: { 
            hideResults: true,
            anonymousMode: true  // Auto-enabled for honest feedback
        },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['HR teams', 'People operations', 'Quarterly check-ins', 'Culture assessment'],
        estimatedTime: '2 min to create',
        questionCount: 10,
        badge: 'Anonymous',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        featured: true,
    },
    {
        id: 'customer-satisfaction',
        name: 'Customer Satisfaction (CSAT)',
        description: 'Measure customer happiness with your product or service using industry-standard metrics',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '⭐',
        gradient: 'from-amber-500 to-orange-500',
        accentColor: '#f59e0b',
        question: 'How satisfied are you with our product/service?',
        options: [
            'Overall satisfaction (1-5)',
            'Net Promoter Score (0-10)',
            'Ease of use rating',
            'Value for money',
            'Support quality',
            'Feature completeness',
            'What could we improve?'
        ],
        suggestedTheme: 'sunset',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Product teams', 'Customer success', 'Support teams', 'Post-purchase'],
        estimatedTime: '2 min to create',
        questionCount: 7,
        badge: 'NPS Included',
        badgeColor: 'bg-amber-100 text-amber-700',
        featured: true,
    },
    {
        id: 'nps-survey',
        name: 'Quick NPS Survey',
        description: 'The industry-standard Net Promoter Score survey - just 2 questions to measure loyalty',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '📈',
        gradient: 'from-cyan-500 to-blue-600',
        accentColor: '#0891b2',
        question: 'How likely are you to recommend us to a friend or colleague?',
        options: [
            'NPS Score (0-10 scale)',
            'What\'s the main reason for your score?'
        ],
        suggestedTheme: 'ocean',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Quick pulse checks', 'Customer loyalty', 'Benchmarking', 'Trend tracking'],
        estimatedTime: '30 sec to create',
        questionCount: 2,
        badge: 'Quick',
        badgeColor: 'bg-cyan-100 text-cyan-700',
        featured: true,
    },
    {
        id: 'post-purchase-feedback',
        name: 'Post-Purchase Feedback',
        description: 'Understand the buying experience and gather insights for improvement',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '🛒',
        gradient: 'from-violet-500 to-purple-600',
        accentColor: '#7c3aed',
        question: 'How was your purchase experience?',
        options: [
            'Overall purchase satisfaction',
            'How did you hear about us?',
            'Was checkout easy?',
            'Any suggestions for improvement?'
        ],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['E-commerce', 'Retail', 'Service businesses', 'Sales teams'],
        estimatedTime: '1 min to create',
        questionCount: 4,
    },
    {
        id: 'event-feedback',
        name: 'Event Feedback Survey',
        description: 'Gather attendee feedback to improve future events',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '🎤',
        gradient: 'from-rose-500 to-pink-600',
        accentColor: '#e11d48',
        question: 'How would you rate this event overall?',
        options: [
            'Overall event rating (1-5 stars)',
            'Speaker/content quality',
            'Venue & logistics',
            'Networking opportunities',
            'Would you attend again?',
            'What could be improved?'
        ],
        suggestedTheme: 'sunset',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Conferences', 'Workshops', 'Webinars', 'Training sessions'],
        estimatedTime: '2 min to create',
        questionCount: 6,
    },
    {
        id: 'team-feedback',
        name: 'Team Feedback Survey',
        description: 'Collect anonymous feedback from your team on projects, processes, or ideas',
        category: 'survey',
        categoryLabel: 'Surveys & Feedback',
        pollType: 'survey',
        icon: '💬',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#3b82f6',
        question: 'How do you feel about our current team processes?',
        options: [
            'Process efficiency rating',
            'Communication clarity',
            'Workload balance',
            'What\'s working well?',
            'What needs improvement?'
        ],
        suggestedTheme: 'minimal',
        settings: { 
            hideResults: true,
            anonymousMode: true
        },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Team retrospectives', 'Process improvement', 'Manager feedback', 'Sprint reviews'],
        estimatedTime: '1 min to create',
        questionCount: 5,
        badge: 'Anonymous',
        badgeColor: 'bg-blue-100 text-blue-700',
    },

    // =========================================================================
    // QUICK FEEDBACK - Single-question polls for instant feedback
    // These are TRUE single-question polls (not multi-question surveys)
    // =========================================================================
    {
        id: 'quick-nps',
        name: 'Quick NPS',
        description: 'Single-question Net Promoter Score - the industry standard for measuring loyalty',
        category: 'feedback',
        categoryLabel: 'Quick Feedback',
        pollType: 'rating',
        icon: '📊',
        gradient: 'from-cyan-500 to-blue-600',
        accentColor: '#0891b2',
        question: 'How likely are you to recommend us to a friend or colleague?',
        options: ['Rate 0-10'],
        suggestedTheme: 'ocean',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Customer feedback', 'Quick pulse checks', 'NPS tracking'],
        estimatedTime: '15 sec to create',
        badge: 'Quick',
        badgeColor: 'bg-cyan-100 text-cyan-700',
    },
    {
        id: 'quick-csat',
        name: 'Quick CSAT',
        description: 'Simple 5-star satisfaction rating - get instant feedback on any experience',
        category: 'feedback',
        categoryLabel: 'Quick Feedback',
        pollType: 'rating',
        icon: '⭐',
        gradient: 'from-amber-500 to-orange-500',
        accentColor: '#f59e0b',
        question: 'How satisfied are you with your experience?',
        options: ['Rate 1-5 stars'],
        suggestedTheme: 'sunset',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Customer satisfaction', 'Service feedback', 'Product ratings'],
        estimatedTime: '15 sec to create',
        badge: 'Quick',
        badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
        id: 'quick-thumbs',
        name: 'Thumbs Up / Down',
        description: 'The simplest feedback - just yes or no. Perfect for quick decisions.',
        category: 'feedback',
        categoryLabel: 'Quick Feedback',
        pollType: 'multiple',
        icon: '👍',
        gradient: 'from-emerald-500 to-teal-500',
        accentColor: '#10b981',
        question: 'Was this helpful?',
        options: ['👍 Yes', '👎 No'],
        suggestedTheme: 'forest',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Content feedback', 'Quick reactions', 'Binary decisions'],
        estimatedTime: '10 sec to create',
        badge: 'Quick',
        badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        id: 'quick-emoji',
        name: 'Emoji Reaction',
        description: 'Fun emoji-based feedback - great for mood checks and quick surveys',
        category: 'feedback',
        categoryLabel: 'Quick Feedback',
        pollType: 'multiple',
        icon: '😀',
        gradient: 'from-pink-500 to-rose-500',
        accentColor: '#ec4899',
        question: 'How are you feeling today?',
        options: ['😀 Great', '🙂 Good', '😐 Okay', '😕 Not great', '😢 Bad'],
        suggestedTheme: 'neon',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Team mood checks', 'Quick reactions', 'Fun feedback'],
        estimatedTime: '15 sec to create',
        badge: 'Quick',
        badgeColor: 'bg-pink-100 text-pink-700',
    },
    {
        id: 'quick-effort',
        name: 'Customer Effort Score',
        description: 'Measure how easy it was to complete a task or get help',
        category: 'feedback',
        categoryLabel: 'Quick Feedback',
        pollType: 'rating',
        icon: '🎯',
        gradient: 'from-violet-500 to-purple-600',
        accentColor: '#8b5cf6',
        question: 'How easy was it to complete your task today?',
        options: ['Rate 1-5'],
        suggestedTheme: 'minimal',
        settings: { hideResults: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['UX feedback', 'Support feedback', 'Process improvement'],
        estimatedTime: '15 sec to create',
        badge: 'Quick',
        badgeColor: 'bg-violet-100 text-violet-700',
    },

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
        bestFor: ['Branding decisions', 'Design reviews', 'Creative teams'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'tool-selection',
        name: 'Tool Selection',
        description: 'Compare and vote on new tools for the team',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'pairwise',
        icon: '🛠️',
        gradient: 'from-slate-600 to-gray-700',
        accentColor: '#475569',
        question: 'Which project management tool should we use?',
        options: [
            'Notion',
            'Linear',
            'Asana',
            'Monday.com'
        ],
        suggestedTheme: 'dark',
        settings: {},
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Software decisions', 'Vendor selection', 'Tool evaluation'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'office-policy',
        name: 'Office Policy Vote',
        description: 'Get team input on workplace policies',
        category: 'team',
        categoryLabel: 'Team Decisions',
        pollType: 'multiple',
        icon: '🏢',
        gradient: 'from-teal-500 to-emerald-600',
        accentColor: '#14b8a6',
        question: 'What\'s your preferred work arrangement?',
        options: [
            '🏠 Fully remote',
            '🏢 Fully in-office',
            '🔄 Hybrid (3 days office)',
            '🔄 Hybrid (2 days office)',
            '🤷 Flexible - no set days'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['HR decisions', 'Policy changes', 'Employee input'],
        estimatedTime: '30 sec to create'
    },

    // =========================================================================
    // EVENTS & PLANNING (8 templates)
    // =========================================================================
    {
        id: 'wedding-rsvp',
        name: 'Wedding RSVP',
        description: 'Beautiful wedding invitation response form',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'rsvp',
        icon: '💒',
        gradient: 'from-rose-400 to-pink-500',
        accentColor: '#f43f5e',
        question: 'Will you be joining us for our special day?',
        options: [
            'Joyfully Accept',
            'Regretfully Decline'
        ],
        suggestedTheme: 'rose',
        settings: {},
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Weddings', 'Engagement parties', 'Rehearsal dinners'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'party-planning',
        name: 'Party Date Poll',
        description: 'Find the best date for your celebration',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'meeting',
        icon: '🎉',
        gradient: 'from-fuchsia-500 to-purple-600',
        accentColor: '#c026d3',
        question: 'Which date works best for the party?',
        options: [
            'Saturday, March 15',
            'Saturday, March 22',
            'Saturday, March 29',
            'Saturday, April 5'
        ],
        suggestedTheme: 'neon',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Birthday parties', 'Celebrations', 'Social gatherings'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'potluck-signup',
        name: 'Potluck Signup',
        description: 'Coordinate who brings what to the potluck',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'multiple',
        icon: '🍲',
        gradient: 'from-orange-400 to-amber-500',
        accentColor: '#fb923c',
        question: 'What will you bring to the potluck?',
        options: [
            '🥗 Salad / Side dish',
            '🍖 Main course',
            '🍰 Dessert',
            '🥤 Drinks',
            '🍞 Bread / Appetizer'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Office potlucks', 'Family gatherings', 'Community events'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'baby-shower',
        name: 'Baby Shower RSVP',
        description: 'Adorable baby shower response form',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'rsvp',
        icon: '👶',
        gradient: 'from-sky-400 to-blue-500',
        accentColor: '#38bdf8',
        question: 'Can you join us to celebrate the baby?',
        options: [
            'Yes, I\'ll be there! 🎉',
            'Sorry, I can\'t make it 😢'
        ],
        suggestedTheme: 'ocean',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Baby showers', 'Gender reveals', 'Sip and see'],
        estimatedTime: '2 min to create'
    },
    {
        id: 'reunion-planning',
        name: 'Reunion Planning',
        description: 'Coordinate family or class reunion details',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'meeting',
        icon: '👨‍👩‍👧‍👦',
        gradient: 'from-emerald-500 to-green-600',
        accentColor: '#10b981',
        question: 'When can you attend the reunion?',
        options: [
            'July 4th Weekend',
            'Labor Day Weekend',
            'Thanksgiving Weekend',
            'Christmas Week'
        ],
        suggestedTheme: 'forest',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Family reunions', 'Class reunions', 'Friend groups'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'activity-vote',
        name: 'Group Activity Vote',
        description: 'Decide on a fun activity for the group',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'ranked',
        icon: '🎳',
        gradient: 'from-lime-500 to-green-600',
        accentColor: '#84cc16',
        question: 'Rank your preferred group activities',
        options: [
            '🎳 Bowling',
            '🧗 Rock climbing',
            '🎮 Arcade / Gaming',
            '🍳 Cooking class',
            '🚣 Kayaking'
        ],
        suggestedTheme: 'forest',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Team outings', 'Friend groups', 'Corporate events'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'holiday-party',
        name: 'Holiday Party Poll',
        description: 'Plan the perfect holiday celebration',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'multiple',
        icon: '🎄',
        gradient: 'from-red-500 to-green-600',
        accentColor: '#dc2626',
        question: 'What type of holiday party would you prefer?',
        options: [
            '🍽️ Formal dinner',
            '🎉 Casual cocktail party',
            '🏠 Potluck style',
            '🎮 Game night theme',
            '🎭 Costume / Ugly sweater'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Office parties', 'Family holidays', 'Friend groups'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'graduation-party',
        name: 'Graduation Party RSVP',
        description: 'Celebrate academic achievements in style',
        category: 'events',
        categoryLabel: 'Events & Planning',
        pollType: 'rsvp',
        icon: '🎓',
        gradient: 'from-indigo-500 to-purple-600',
        accentColor: '#6366f1',
        question: 'Join us to celebrate this milestone!',
        options: [
            'Count me in! 🎉',
            'Can\'t make it 😔'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['High school graduation', 'College graduation', 'Achievement celebrations'],
        estimatedTime: '2 min to create'
    },

    // =========================================================================
    // FEEDBACK (6 templates)
    // =========================================================================
    {
        id: 'product-feedback',
        name: 'Product Feedback',
        description: 'Quick pulse check on product features',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '💡',
        gradient: 'from-amber-500 to-orange-600',
        accentColor: '#f59e0b',
        question: 'How would you rate our new feature?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Product launches', 'Feature feedback', 'Beta testing'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'service-rating',
        name: 'Service Rating',
        description: 'Measure customer satisfaction with your service',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '⭐',
        gradient: 'from-yellow-400 to-amber-500',
        accentColor: '#eab308',
        question: 'How would you rate our service today?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Customer support', 'Service businesses', 'Retail'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'content-feedback',
        name: 'Content Feedback',
        description: 'Get feedback on articles, videos, or content',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'multiple',
        icon: '📝',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#3b82f6',
        question: 'Was this content helpful?',
        options: [
            '👍 Yes, very helpful',
            '😐 Somewhat helpful',
            '👎 Not helpful',
            '🤔 I have suggestions'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Blog posts', 'Documentation', 'Training materials'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'meeting-feedback',
        name: 'Meeting Feedback',
        description: 'Quick check on meeting effectiveness',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '📊',
        gradient: 'from-teal-500 to-cyan-600',
        accentColor: '#14b8a6',
        question: 'How useful was this meeting?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'ocean',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Team meetings', 'Workshops', 'All-hands'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'presentation-feedback',
        name: 'Presentation Feedback',
        description: 'Gather feedback on presentations or talks',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'rating',
        icon: '🎤',
        gradient: 'from-rose-500 to-pink-600',
        accentColor: '#f43f5e',
        question: 'How would you rate this presentation?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'sunset',
        settings: {},
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Conferences', 'Internal presentations', 'Sales pitches'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'quick-pulse',
        name: 'Quick Pulse Check',
        description: 'Simple thumbs up/down feedback',
        category: 'feedback',
        categoryLabel: 'Feedback',
        pollType: 'multiple',
        icon: '👍',
        gradient: 'from-green-500 to-emerald-600',
        accentColor: '#22c55e',
        question: 'How do you feel about this?',
        options: [
            '👍 Love it!',
            '👎 Not a fan'
        ],
        suggestedTheme: 'forest',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Quick decisions', 'Approval voting', 'Simple feedback'],
        estimatedTime: '15 sec to create'
    },

    // =========================================================================
    // HR & CULTURE (6 templates)
    // =========================================================================
    {
        id: 'onboarding-feedback',
        name: 'Onboarding Feedback',
        description: 'Improve new hire experience with feedback',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'rating',
        icon: '🚀',
        gradient: 'from-indigo-500 to-purple-600',
        accentColor: '#6366f1',
        question: 'How would you rate your onboarding experience?',
        options: ['1', '2', '3', '4', '5'],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['New hires', 'HR teams', '30/60/90 day reviews'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'benefits-survey',
        name: 'Benefits Preferences',
        description: 'Understand what benefits matter most to your team',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'ranked',
        icon: '🎁',
        gradient: 'from-emerald-500 to-teal-600',
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
        settings: {},
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Benefits planning', 'HR strategy', 'Employee input'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'culture-values',
        name: 'Culture Values Vote',
        description: 'Align on company values that matter',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'ranked',
        icon: '💎',
        gradient: 'from-violet-500 to-purple-600',
        accentColor: '#8b5cf6',
        question: 'Which values resonate most with you?',
        options: [
            '🤝 Collaboration',
            '💡 Innovation',
            '🎯 Excellence',
            '❤️ Empathy',
            '🔓 Transparency'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Culture building', 'Values alignment', 'Leadership'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'team-morale',
        name: 'Team Morale Check',
        description: 'Anonymous pulse on team sentiment',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'multiple',
        icon: '🌡️',
        gradient: 'from-amber-400 to-orange-500',
        accentColor: '#f59e0b',
        question: 'How are you feeling about work this week?',
        options: [
            '🌟 Great - energized!',
            '😊 Good - steady',
            '😐 Okay - manageable',
            '😓 Stressed - need support',
            '😔 Struggling - let\'s talk'
        ],
        suggestedTheme: 'sunset',
        settings: { hideResults: true },
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Weekly check-ins', 'Team health', 'Manager insights'],
        estimatedTime: '20 sec to create'
    },
    {
        id: 'recognition-poll',
        name: 'Team Recognition',
        description: 'Celebrate team members who went above and beyond',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'multiple',
        icon: '🏆',
        gradient: 'from-yellow-400 to-amber-500',
        accentColor: '#eab308',
        question: 'Who deserves a shoutout this week?',
        options: [
            'Team Member 1',
            'Team Member 2',
            'Team Member 3',
            'Team Member 4',
            'Someone else (comment)'
        ],
        suggestedTheme: 'sunset',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'confetti' },
        bestFor: ['Peer recognition', 'Team meetings', 'Culture building'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'training-interest',
        name: 'Training Interest Survey',
        description: 'Find out what skills your team wants to develop',
        category: 'hr',
        categoryLabel: 'HR & Culture',
        pollType: 'ranked',
        icon: '📚',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#3b82f6',
        question: 'What training would be most valuable?',
        options: [
            '💻 Technical skills',
            '🎤 Public speaking',
            '👥 Leadership',
            '📊 Data analysis',
            '🎨 Design thinking'
        ],
        suggestedTheme: 'minimal',
        settings: {},
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['L&D planning', 'Skill development', 'Career growth'],
        estimatedTime: '1 min to create'
    },

    // =========================================================================
    // EDUCATION (6 templates)
    // =========================================================================
    {
        id: 'class-poll',
        name: 'Classroom Poll',
        description: 'Engage students with interactive polling',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'multiple',
        icon: '🎓',
        gradient: 'from-blue-500 to-indigo-600',
        accentColor: '#3b82f6',
        question: 'What topic should we cover next?',
        options: [
            'Topic A',
            'Topic B',
            'Topic C',
            'Review previous material'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['Classrooms', 'Workshops', 'Training sessions'],
        estimatedTime: '30 sec to create'
    },
    {
        id: 'assignment-preference',
        name: 'Assignment Preference',
        description: 'Let students choose their preferred assignment format',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'ranked',
        icon: '📋',
        gradient: 'from-teal-500 to-cyan-600',
        accentColor: '#14b8a6',
        question: 'Rank your preferred assignment formats',
        options: [
            '📝 Written essay',
            '🎥 Video presentation',
            '🖼️ Visual poster',
            '👥 Group project',
            '🎤 Oral presentation'
        ],
        suggestedTheme: 'ocean',
        settings: {},
        previewStyle: { bgPattern: 'waves' },
        bestFor: ['Course design', 'Student engagement', 'Flexible learning'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'study-group',
        name: 'Study Group Time',
        description: 'Find when everyone can meet to study',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'meeting',
        icon: '📖',
        gradient: 'from-purple-500 to-indigo-600',
        accentColor: '#a855f7',
        question: 'When can you join the study group?',
        options: [
            'Monday evening',
            'Wednesday afternoon',
            'Thursday evening',
            'Saturday morning',
            'Sunday afternoon'
        ],
        suggestedTheme: 'minimal',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'grid' },
        bestFor: ['Study groups', 'Project teams', 'Tutoring sessions'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'field-trip',
        name: 'Field Trip Vote',
        description: 'Let students vote on field trip destinations',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'image',
        icon: '🚌',
        gradient: 'from-green-500 to-emerald-600',
        accentColor: '#22c55e',
        question: 'Where should we go for our field trip?',
        options: [
            '🏛️ History Museum',
            '🔬 Science Center',
            '🎭 Theater',
            '🌳 Nature Reserve'
        ],
        suggestedTheme: 'forest',
        settings: { allowMultiple: false },
        previewStyle: { bgPattern: 'dots' },
        bestFor: ['School trips', 'Educational outings', 'Class decisions'],
        estimatedTime: '1 min to create'
    },
    {
        id: 'course-feedback',
        name: 'Course Evaluation',
        description: 'Gather student feedback on course content',
        category: 'education',
        categoryLabel: 'Education',
        pollType: 'rating',
        icon: '📊',
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

// Helper to get featured templates (for homepage)
export const getFeaturedTemplates = (): PollTemplate[] => {
    return POLL_TEMPLATES.filter(t => t.featured);
};

// Helper to get survey templates
export const getSurveyTemplates = (): PollTemplate[] => {
    return POLL_TEMPLATES.filter(t => t.pollType === 'survey');
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
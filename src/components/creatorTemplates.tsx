// ============================================================================
// creatorTemplates.tsx - Creator templates for YouTube, Twitch, Reddit
// ============================================================================

import { PollTemplate } from './pollTemplates';

// YouTube Creator Templates
export const YOUTUBE_TEMPLATES: PollTemplate[] = [
    {
        id: 'youtube-video-ideas',
        name: 'Video Ideas Vote',
        description: 'Let your subscribers pick your next video topic',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🎬',
        gradient: 'from-red-500 to-red-600',
        accentColor: '#EF4444',
        question: 'What video should I make next?',
        options: ['Tutorial: Advanced editing techniques', 'Behind the scenes vlog', 'Q&A session', 'Collab with another creator', 'Challenge video'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['YouTubers', 'Content creators', 'Audience engagement'],
        estimatedTime: '1 min',
        featured: true
    },
    {
        id: 'youtube-upload-schedule',
        name: 'Upload Schedule',
        description: 'Find the best upload time for your audience',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '📅',
        gradient: 'from-red-500 to-red-600',
        accentColor: '#EF4444',
        question: 'When do you prefer new videos?',
        options: ['Weekday mornings', 'Weekday evenings', 'Weekend mornings', 'Weekend evenings'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['YouTubers', 'Scheduling', 'Audience research'],
        estimatedTime: '1 min'
    },
    {
        id: 'youtube-thumbnail-test',
        name: 'Thumbnail A/B Test',
        description: 'Test thumbnails before publishing',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'image',
        icon: '🖼️',
        gradient: 'from-red-500 to-red-600',
        accentColor: '#EF4444',
        question: 'Which thumbnail catches your attention?',
        options: ['Thumbnail A', 'Thumbnail B', 'Thumbnail C'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['YouTubers', 'A/B testing', 'Click-through optimization'],
        estimatedTime: '1 min'
    },
    {
        id: 'youtube-series-vote',
        name: 'Series Continuation',
        description: 'Get feedback on ongoing content series',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '📺',
        gradient: 'from-red-500 to-red-600',
        accentColor: '#EF4444',
        question: 'Should I continue this series?',
        options: ['Yes, keep going!', 'Yes, but change the format', 'Take a break from it', 'End the series'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['YouTubers', 'Series planning', 'Content strategy'],
        estimatedTime: '1 min'
    }
];

// Twitch Streamer Templates
export const TWITCH_TEMPLATES: PollTemplate[] = [
    {
        id: 'twitch-game-choice',
        name: 'Game Vote',
        description: 'Let chat decide the next game',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🎮',
        gradient: 'from-purple-600 to-purple-700',
        accentColor: '#9333EA',
        question: 'What game should I play next?',
        options: ['Elden Ring', 'Minecraft', 'Valorant', 'Just Chatting', 'Viewer Choice'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Twitch streamers', 'Chat engagement', 'Game selection'],
        estimatedTime: '1 min',
        featured: true
    },
    {
        id: 'twitch-stream-schedule',
        name: 'Stream Schedule',
        description: 'Find when your community is most active',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🗓️',
        gradient: 'from-purple-600 to-purple-700',
        accentColor: '#9333EA',
        question: 'Best days for streams?',
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        suggestedTheme: 'default',
        settings: { allowMultiple: true },
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Twitch streamers', 'Schedule planning', 'Community input'],
        estimatedTime: '1 min'
    },
    {
        id: 'twitch-challenge-vote',
        name: 'Challenge Vote',
        description: 'Let viewers pick your next challenge',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🏆',
        gradient: 'from-purple-600 to-purple-700',
        accentColor: '#9333EA',
        question: 'Which challenge should I attempt?',
        options: ['No-hit run', 'Speedrun attempt', 'Blindfolded gameplay', 'One life only', 'Chat controls'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Twitch streamers', 'Challenge runs', 'Entertainment'],
        estimatedTime: '1 min'
    },
    {
        id: 'twitch-prediction',
        name: 'Stream Prediction',
        description: 'Prediction poll for stream moments',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🔮',
        gradient: 'from-purple-600 to-purple-700',
        accentColor: '#9333EA',
        question: 'Will I beat this boss today?',
        options: ['Yes, first try!', 'Yes, within 5 attempts', 'Yes, but it will take a while', 'No way'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Twitch streamers', 'Predictions', 'Chat engagement'],
        estimatedTime: '1 min'
    }
];

// Reddit Community Templates
export const REDDIT_TEMPLATES: PollTemplate[] = [
    {
        id: 'reddit-ranking',
        name: 'Community Ranking',
        description: 'Get ranked opinions from your community',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'ranked',
        icon: '📊',
        gradient: 'from-orange-500 to-orange-600',
        accentColor: '#F97316',
        question: 'Rank these from best to worst',
        options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Reddit communities', 'Rankings', 'Opinion gathering'],
        estimatedTime: '1 min',
        featured: true
    },
    {
        id: 'reddit-recommendation',
        name: 'Recommendation Poll',
        description: 'Crowdsource recommendations from the community',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '💡',
        gradient: 'from-orange-500 to-orange-600',
        accentColor: '#F97316',
        question: 'Help me decide: Which should I choose?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Other (comment below)'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Reddit communities', 'Recommendations', 'Decision making'],
        estimatedTime: '1 min'
    },
    {
        id: 'reddit-debate',
        name: 'Opinion Poll',
        description: 'Gauge community opinions on debates',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '🗣️',
        gradient: 'from-orange-500 to-orange-600',
        accentColor: '#F97316',
        question: 'What is your stance on this topic?',
        options: ['Strongly agree', 'Somewhat agree', 'Neutral', 'Somewhat disagree', 'Strongly disagree'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Reddit communities', 'Debates', 'Opinion polls'],
        estimatedTime: '1 min'
    },
    {
        id: 'reddit-mod-decision',
        name: 'Mod Decision',
        description: 'Let the community vote on subreddit changes',
        category: 'creators',
        categoryLabel: 'Content Creators',
        pollType: 'multiple',
        icon: '⚖️',
        gradient: 'from-orange-500 to-orange-600',
        accentColor: '#F97316',
        question: 'Should we implement this rule change?',
        options: ['Yes, implement it', 'Yes, but with modifications', 'No, keep things as they are', 'Need more discussion'],
        suggestedTheme: 'default',
        previewStyle: { bgPattern: 'none' },
        bestFor: ['Subreddit moderators', 'Rule changes', 'Community governance'],
        estimatedTime: '1 min'
    }
];

// Combined export
export const CREATOR_TEMPLATES: PollTemplate[] = [
    ...YOUTUBE_TEMPLATES,
    ...TWITCH_TEMPLATES,
    ...REDDIT_TEMPLATES
];
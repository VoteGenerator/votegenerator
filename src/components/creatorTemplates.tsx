// ============================================================================
// creatorTemplates.tsx - Creator templates for YouTube, Twitch, Reddit
// FIXED: Uses proper type that matches updated PollTemplate with 'creators' category
// 
// IMPORTANT: Before using this file, ensure pollTemplates.tsx has been updated:
// 1. category type includes 'creators' 
// 2. TEMPLATE_CATEGORIES includes { id: 'creators', label: 'Content Creators', icon: '🎬' }
// ============================================================================

import { PollTemplate } from './pollTemplates';

// YouTube Creator Templates
export const YOUTUBE_TEMPLATES: PollTemplate[] = [
    {
        id: 'youtube-video-ideas',
        name: 'Video Ideas Vote',
        icon: '🎬',
        category: 'creators',
        question: 'What video should I make next?',
        description: 'Let your subscribers pick your next video topic',
        options: ['Tutorial: Advanced editing techniques', 'Behind the scenes vlog', 'Q&A session', 'Collab with another creator', 'Challenge video'],
        pollType: 'multiple',
        gradient: 'from-red-500 to-red-600',
        popular: true
    },
    {
        id: 'youtube-upload-schedule',
        name: 'Upload Schedule',
        icon: '📅',
        category: 'creators',
        question: 'When do you prefer new videos?',
        description: 'Find the best upload time for your audience',
        options: ['Weekday mornings', 'Weekday evenings', 'Weekend mornings', 'Weekend evenings'],
        pollType: 'multiple',
        gradient: 'from-red-500 to-red-600'
    },
    {
        id: 'youtube-thumbnail-test',
        name: 'Thumbnail A/B Test',
        icon: '🖼️',
        category: 'creators',
        question: 'Which thumbnail catches your attention?',
        description: 'Test thumbnails before publishing',
        options: ['Thumbnail A', 'Thumbnail B', 'Thumbnail C'],
        pollType: 'image',
        gradient: 'from-red-500 to-red-600'
    },
    {
        id: 'youtube-series-vote',
        name: 'Series Continuation',
        icon: '📺',
        category: 'creators',
        question: 'Should I continue this series?',
        description: 'Get feedback on ongoing content series',
        options: ['Yes, keep going!', 'Yes, but change the format', 'Take a break from it', 'End the series'],
        pollType: 'multiple',
        gradient: 'from-red-500 to-red-600'
    }
];

// Twitch Streamer Templates
export const TWITCH_TEMPLATES: PollTemplate[] = [
    {
        id: 'twitch-game-choice',
        name: 'Game Vote',
        icon: '🎮',
        category: 'creators',
        question: 'What game should I play next?',
        description: 'Let chat decide the next game',
        options: ['Elden Ring', 'Minecraft', 'Valorant', 'Just Chatting', 'Viewer Choice'],
        pollType: 'multiple',
        gradient: 'from-purple-600 to-purple-700',
        popular: true
    },
    {
        id: 'twitch-stream-schedule',
        name: 'Stream Schedule',
        icon: '🗓️',
        category: 'creators',
        question: 'Best days for streams?',
        description: 'Find when your community is most active',
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        pollType: 'multiple',
        settings: { allowMultiple: true },
        gradient: 'from-purple-600 to-purple-700'
    },
    {
        id: 'twitch-challenge-vote',
        name: 'Challenge Vote',
        icon: '🏆',
        category: 'creators',
        question: 'Which challenge should I attempt?',
        description: 'Let viewers pick your next challenge',
        options: ['No-hit run', 'Speedrun attempt', 'Blindfolded gameplay', 'One life only', 'Chat controls'],
        pollType: 'multiple',
        gradient: 'from-purple-600 to-purple-700'
    },
    {
        id: 'twitch-prediction',
        name: 'Stream Prediction',
        icon: '🔮',
        category: 'creators',
        question: 'Will I beat this boss today?',
        description: 'Prediction poll for stream moments',
        options: ['Yes, first try!', 'Yes, within 5 attempts', 'Yes, but it will take a while', 'No way'],
        pollType: 'multiple',
        gradient: 'from-purple-600 to-purple-700'
    }
];

// Reddit Community Templates
export const REDDIT_TEMPLATES: PollTemplate[] = [
    {
        id: 'reddit-ranking',
        name: 'Community Ranking',
        icon: '📊',
        category: 'creators',
        question: 'Rank these from best to worst',
        description: 'Get ranked opinions from your community',
        options: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
        pollType: 'ranked',
        gradient: 'from-orange-500 to-orange-600',
        popular: true
    },
    {
        id: 'reddit-recommendation',
        name: 'Recommendation Poll',
        icon: '💡',
        category: 'creators',
        question: 'Help me decide: Which should I choose?',
        description: 'Crowdsource recommendations from the community',
        options: ['Option 1', 'Option 2', 'Option 3', 'Other (comment below)'],
        pollType: 'multiple',
        gradient: 'from-orange-500 to-orange-600'
    },
    {
        id: 'reddit-debate',
        name: 'Opinion Poll',
        icon: '🗣️',
        category: 'creators',
        question: 'What is your stance on this topic?',
        description: 'Gauge community opinions on debates',
        options: ['Strongly agree', 'Somewhat agree', 'Neutral', 'Somewhat disagree', 'Strongly disagree'],
        pollType: 'multiple',
        gradient: 'from-orange-500 to-orange-600'
    },
    {
        id: 'reddit-mod-decision',
        name: 'Mod Decision',
        icon: '⚖️',
        category: 'creators',
        question: 'Should we implement this rule change?',
        description: 'Let the community vote on subreddit changes',
        options: ['Yes, implement it', 'Yes, but with modifications', 'No, keep things as they are', 'Need more discussion'],
        pollType: 'multiple',
        gradient: 'from-orange-500 to-orange-600'
    }
];

// Combined export for easy importing
export const CREATOR_TEMPLATES: PollTemplate[] = [
    ...YOUTUBE_TEMPLATES,
    ...TWITCH_TEMPLATES,
    ...REDDIT_TEMPLATES
];

// Instructions for pollTemplates.tsx:
// 1. Add 'creators' to the category type union
// 2. Add this to TEMPLATE_CATEGORIES: { id: 'creators', label: 'Content Creators', icon: '🎬' }
// 3. Import and spread CREATOR_TEMPLATES into POLL_TEMPLATES array
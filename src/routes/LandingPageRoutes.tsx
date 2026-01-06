// ============================================================================
// Landing Page Routes Configuration
// Location: Add to src/App.tsx or your routing configuration
// 
// These routes connect the 5 SEO-targeted landing pages
// ============================================================================

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// ============================================================================
// LAZY LOAD LANDING PAGES FOR PERFORMANCE
// ============================================================================

const EmployeeEngagementPage = lazy(() => import('./components/EmployeeEngagementPage'));
const CustomerSatisfactionPage = lazy(() => import('./components/CustomerSatisfactionPage'));
const OnlineRSVPPage = lazy(() => import('./components/OnlineRSVPPage'));
const FeedbackFormPage = lazy(() => import('./components/FeedbackFormPage'));
const StrawPollPage = lazy(() => import('./components/StrawPollPage'));

// Loading component
const PageLoader: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
        </div>
    </div>
);

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

/*
Add these routes to your App.tsx <Routes> component:

<Routes>
    {/* ... existing routes ... *\/}
    
    {/* SEO Landing Pages *\/}
    <Route path="/surveys/employee-engagement" element={
        <Suspense fallback={<PageLoader />}>
            <EmployeeEngagementPage />
        </Suspense>
    } />
    <Route path="/surveys/customer-satisfaction" element={
        <Suspense fallback={<PageLoader />}>
            <CustomerSatisfactionPage />
        </Suspense>
    } />
    <Route path="/online-rsvp" element={
        <Suspense fallback={<PageLoader />}>
            <OnlineRSVPPage />
        </Suspense>
    } />
    <Route path="/feedback-form" element={
        <Suspense fallback={<PageLoader />}>
            <FeedbackFormPage />
        </Suspense>
    } />
    <Route path="/straw-poll" element={
        <Suspense fallback={<PageLoader />}>
            <StrawPollPage />
        </Suspense>
    } />
    
    {/* Alternative paths for SEO *\/}
    <Route path="/employee-engagement-survey" element={
        <Suspense fallback={<PageLoader />}>
            <EmployeeEngagementPage />
        </Suspense>
    } />
    <Route path="/csat-survey" element={
        <Suspense fallback={<PageLoader />}>
            <CustomerSatisfactionPage />
        </Suspense>
    } />
    <Route path="/nps-survey" element={
        <Suspense fallback={<PageLoader />}>
            <CustomerSatisfactionPage />
        </Suspense>
    } />
</Routes>
*/

// ============================================================================
// FULL ROUTES EXPORT (if using separate routes file)
// ============================================================================

export const landingPageRoutes = [
    {
        path: '/surveys/employee-engagement',
        component: EmployeeEngagementPage,
        title: 'Employee Engagement Survey | Free Template | VoteGenerator',
        description: 'Create beautiful employee engagement surveys. Measure team satisfaction, growth opportunities, and culture. No signup for employees. Free to start.',
        keywords: ['employee engagement survey', 'staff engagement survey', 'employee satisfaction survey'],
    },
    {
        path: '/surveys/customer-satisfaction',
        component: CustomerSatisfactionPage,
        title: 'Customer Satisfaction Survey | CSAT & NPS Template | VoteGenerator',
        description: 'Measure customer loyalty with NPS and CSAT surveys. Auto-calculated scores, real-time results. No signup for customers. Free to start.',
        keywords: ['customer satisfaction survey', 'CSAT survey', 'NPS survey', 'customer feedback'],
    },
    {
        path: '/online-rsvp',
        component: OnlineRSVPPage,
        title: 'Free Online RSVP Tool | Wedding, Party, Event RSVPs | VoteGenerator',
        description: 'Collect RSVPs online for weddings, parties, and events. Track attendance, meal preferences, guest count. No signup for guests. Free to use.',
        keywords: ['online rsvp tool', 'online rsvp service', 'wedding rsvp', 'event rsvp'],
    },
    {
        path: '/feedback-form',
        component: FeedbackFormPage,
        title: 'Free Feedback Form | Quick Feedback Tool | VoteGenerator',
        description: 'Create simple feedback forms in under a minute. Ratings, tags, open text. Real-time results. No signup for respondents. Free to start.',
        keywords: ['feedback form free', 'quick feedback tool', 'feedback form template'],
    },
    {
        path: '/straw-poll',
        component: StrawPollPage,
        title: 'What is a Straw Poll? | Free Straw Poll Maker | VoteGenerator',
        description: 'Learn what straw polls are and create your own. Quick informal votes for teams and groups. Free straw poll maker with instant results.',
        keywords: ['straw poll', 'strawpolls', 'straw poll maker', 'quick poll'],
    },
];

// ============================================================================
// SEO METADATA COMPONENT
// Use with react-helmet or similar for meta tags
// ============================================================================

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    path: string;
}

export const SEOHead: React.FC<SEOProps> = ({ title, description, keywords, path }) => {
    // If using react-helmet:
    /*
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords.join(', ')} />}
            <link rel="canonical" href={`https://votegenerator.com${path}`} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={`https://votegenerator.com${path}`} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
    */
    return null;
};

// ============================================================================
// SITEMAP ENTRIES
// Add to your sitemap.xml generation
// ============================================================================

export const landingPageSitemapEntries = [
    { url: '/surveys/employee-engagement', priority: 0.9, changefreq: 'weekly' },
    { url: '/surveys/customer-satisfaction', priority: 0.9, changefreq: 'weekly' },
    { url: '/online-rsvp', priority: 0.9, changefreq: 'weekly' },
    { url: '/feedback-form', priority: 0.9, changefreq: 'weekly' },
    { url: '/straw-poll', priority: 0.9, changefreq: 'weekly' },
    // Alternate paths
    { url: '/employee-engagement-survey', priority: 0.7, changefreq: 'weekly' },
    { url: '/csat-survey', priority: 0.7, changefreq: 'weekly' },
    { url: '/nps-survey', priority: 0.7, changefreq: 'weekly' },
];

// ============================================================================
// NAVIGATION LINKS (for footer/header)
// ============================================================================

export const landingPageNavLinks = {
    surveys: [
        { label: 'Employee Engagement', href: '/surveys/employee-engagement' },
        { label: 'Customer Satisfaction (CSAT)', href: '/surveys/customer-satisfaction' },
        { label: 'Quick Feedback Form', href: '/feedback-form' },
    ],
    tools: [
        { label: 'Online RSVP', href: '/online-rsvp' },
        { label: 'Straw Poll Maker', href: '/straw-poll' },
    ],
};

// ============================================================================
// APP.TSX INTEGRATION EXAMPLE
// ============================================================================

/*
// In App.tsx:

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy load landing pages
const EmployeeEngagementPage = lazy(() => import('./components/EmployeeEngagementPage'));
const CustomerSatisfactionPage = lazy(() => import('./components/CustomerSatisfactionPage'));
const OnlineRSVPPage = lazy(() => import('./components/OnlineRSVPPage'));
const FeedbackFormPage = lazy(() => import('./components/FeedbackFormPage'));
const StrawPollPage = lazy(() => import('./components/StrawPollPage'));

// In your component:
function App() {
    return (
        <Routes>
            {/* Existing routes *\/}
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreatePoll />} />
            <Route path="/vote/:id" element={<VotePage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            {/* ... etc ... *\/}
            
            {/* NEW: SEO Landing Pages *\/}
            <Route path="/surveys/employee-engagement" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <EmployeeEngagementPage />
                </Suspense>
            } />
            <Route path="/surveys/customer-satisfaction" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <CustomerSatisfactionPage />
                </Suspense>
            } />
            <Route path="/online-rsvp" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <OnlineRSVPPage />
                </Suspense>
            } />
            <Route path="/feedback-form" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <FeedbackFormPage />
                </Suspense>
            } />
            <Route path="/straw-poll" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <StrawPollPage />
                </Suspense>
            } />
        </Routes>
    );
}
*/

export default landingPageRoutes;
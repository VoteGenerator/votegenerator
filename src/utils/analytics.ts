// ============================================================================
// analytics.ts - Google Analytics tracking utility
// Location: src/utils/analytics.ts
// ============================================================================

// Extend Window interface for TypeScript
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        trackPageView: (path: string, title: string) => void;
        trackEvent: (eventName: string, params?: Record<string, any>) => void;
    }
}

// ============================================================================
// PAGE VIEW TRACKING - Fixes bounce rate for SPA
// ============================================================================
export function trackPageView(path?: string, title?: string): void {
    const pagePath = path || window.location.pathname;
    const pageTitle = title || document.title;
    
    if (typeof window !== 'undefined' && window.trackPageView) {
        window.trackPageView(pagePath, pageTitle);
    }
}

// ============================================================================
// EVENT TRACKING - Custom events
// ============================================================================
export function trackEvent(eventName: string, params?: Record<string, any>): void {
    if (typeof window !== 'undefined' && window.trackEvent) {
        window.trackEvent(eventName, params || {});
    }
}

// ============================================================================
// PRE-DEFINED EVENTS - Easy to use in components
// ============================================================================

// Poll events
export const Analytics = {
    // Poll lifecycle
    pollCreated: (pollType: string, tier: string = 'free', optionCount: number = 0) => {
        trackEvent('poll_created', {
            poll_type: pollType,
            tier: tier,
            option_count: optionCount
        });
    },
    
    pollViewed: (pollId: string, pollType: string) => {
        trackEvent('poll_viewed', {
            poll_id: pollId,
            poll_type: pollType
        });
    },
    
    pollShared: (method: string) => {
        trackEvent('poll_shared', {
            share_method: method // 'copy_link', 'email', 'twitter', 'facebook', 'qr_code'
        });
    },
    
    pollClosed: (pollId: string, totalVotes: number) => {
        trackEvent('poll_closed', {
            poll_id: pollId,
            total_votes: totalVotes
        });
    },
    
    pollDuplicated: () => {
        trackEvent('poll_duplicated');
    },
    
    pollDeleted: () => {
        trackEvent('poll_deleted');
    },
    
    // Voting events
    voteSubmitted: (pollId: string, pollType: string) => {
        trackEvent('vote_submitted', {
            poll_id: pollId,
            poll_type: pollType
        });
    },
    
    voteAgain: (pollId: string) => {
        trackEvent('vote_again', { poll_id: pollId });
    },
    
    // Survey events
    surveyCreated: (questionCount: number, tier: string = 'free') => {
        trackEvent('survey_created', {
            question_count: questionCount,
            tier: tier
        });
    },
    
    surveyCompleted: (surveyId: string, questionCount: number) => {
        trackEvent('survey_completed', {
            survey_id: surveyId,
            question_count: questionCount
        });
    },
    
    // Dashboard events
    dashboardViewed: (pollCount: number, tier: string = 'free') => {
        trackEvent('dashboard_viewed', {
            poll_count: pollCount,
            tier: tier
        });
    },
    
    resultsExported: (format: string) => {
        trackEvent('results_exported', { format: format }); // 'csv', 'png'
    },
    
    // Conversion events
    pricingViewed: () => {
        trackEvent('pricing_viewed');
    },
    
    upgradeClicked: (tier: string, billing: string) => {
        trackEvent('upgrade_clicked', {
            tier: tier, // 'pro', 'business'
            billing: billing // 'monthly', 'annual'
        });
    },
    
    checkoutStarted: (tier: string, billing: string) => {
        trackEvent('checkout_started', {
            tier: tier,
            billing: billing
        });
    },
    
    purchaseCompleted: (tier: string, billing: string, value: number) => {
        trackEvent('purchase', {
            tier: tier,
            billing: billing,
            value: value,
            currency: 'USD'
        });
    },
    
    // Engagement events
    templateUsed: (templateName: string) => {
        trackEvent('template_used', { template_name: templateName });
    },
    
    helpViewed: (topic: string) => {
        trackEvent('help_viewed', { topic: topic });
    },
    
    contactFormSubmitted: () => {
        trackEvent('contact_form_submitted');
    },
    
    emailSaved: (tier: string = 'free') => {
        trackEvent('email_saved', { tier: tier });
    },
    
    // Feature usage
    featureUsed: (feature: string, tier: string = 'free') => {
        trackEvent('feature_used', {
            feature: feature, // 'theme_change', 'custom_branding', 'csv_export', etc.
            tier: tier
        });
    },
    
    // Error tracking
    errorOccurred: (errorType: string, errorMessage: string) => {
        trackEvent('error_occurred', {
            error_type: errorType,
            error_message: errorMessage.substring(0, 100) // Truncate long messages
        });
    },
    
    // Ad events
    adWallShown: (reason: string) => {
        trackEvent('ad_wall_shown', { reason: reason });
    },
    
    adWallCompleted: () => {
        trackEvent('ad_wall_completed');
    }
};

// ============================================================================
// TRACK ON COMPONENT MOUNT - Use in any component
// ============================================================================
// Just call trackPageView() in useEffect when component mounts:
/*
    useEffect(() => {
        trackPageView('/create', 'Create Poll');
    }, []);
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================
/*

// 1. Page views are tracked automatically via index.html on each page load.
//    For SPA-style navigation (window.location.href = ...), add this in components:

import { useEffect } from 'react';
import { trackPageView } from '../utils/analytics';

function CreatePage() {
    useEffect(() => {
        trackPageView('/create', 'Create Poll');
    }, []);
    // ... rest of component
}


// 2. Track events in components:
import { Analytics } from '../utils/analytics';

// When poll is created:
Analytics.pollCreated('multiple_choice', 'free', 4);

// When vote is submitted:
Analytics.voteSubmitted(pollId, pollType);

// When user clicks upgrade:
Analytics.upgradeClicked('pro', 'annual');

// When purchase completes:
Analytics.purchaseCompleted('pro', 'annual', 190);

*/
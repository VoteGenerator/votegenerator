/**
 * Analytics Service
 * 
 * Lightweight event tracking for VoteGenerator.
 * Replace with your preferred analytics provider (Google Analytics, Plausible, etc.)
 */

interface EventProperties {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom event
 */
export const trackEvent = (eventName: string, properties?: EventProperties): void => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventName, properties);
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, properties);
    }

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible(eventName, { props: properties });
    }
};

/**
 * Track a page view
 */
export const trackPageView = (pageName: string): void => {
    trackEvent('page_view', { page: pageName });
};

/**
 * Events we track:
 * 
 * - votegenerator_poll_created: When a new poll is created
 *   - optionCount: number of options
 *   - hasDescription: whether description was added
 *   - hideResults: whether results are hidden
 * 
 * - votegenerator_vote_submitted: When a vote is submitted
 *   - pollId: the poll ID
 *   - optionCount: number of options
 * 
 * - votegenerator_link_copied: When share link is copied
 *   - type: 'vote' or 'admin'
 * 
 * - votegenerator_share: When share button is clicked
 *   - platform: 'twitter', 'whatsapp', 'email'
 * 
 * - votegenerator_share_after_vote: When voter shares poll after voting
 * 
 * - votegenerator_results_viewed: When results are viewed
 * 
 * - votegenerator_premium_clicked: When premium upsell is clicked
 */

// ============================================================================
// Pinterest Conversion Tracking Utility
// Handles Pinterest pixel events with GDPR consent checking
// ============================================================================

// Generate unique event ID for deduplication
const generateEventId = (): string => {
    return `vg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if user has given consent for tracking
const hasTrackingConsent = (): boolean => {
    try {
        const consent = localStorage.getItem('cookie_consent');
        if (consent) {
            const parsed = JSON.parse(consent);
            return parsed.type === 'all';
        }
    } catch (e) {
        // If parsing fails, assume no consent
    }
    return false;
};

// Check if Pinterest pixel is loaded
const isPinterestLoaded = (): boolean => {
    return typeof window !== 'undefined' && typeof (window as any).pintrk === 'function';
};

// ============================================================================
// PINTEREST TRACKING EVENTS
// ============================================================================

/**
 * Track successful checkout/subscription
 * Call on CheckoutSuccess page after Stripe payment confirms
 */
export const trackPinterestCheckout = (params: {
    value: number;       // Price in USD (e.g., 7 for Pro, 19 for Business)
    currency?: string;   // Default 'USD'
    planName?: string;   // 'Pro' or 'Business'
}): void => {
    if (!hasTrackingConsent() || !isPinterestLoaded()) return;
    
    try {
        (window as any).pintrk('track', 'checkout', {
            event_id: generateEventId(),
            value: params.value,
            order_quantity: 1,
            currency: params.currency || 'USD',
            // Custom data (Pinterest allows custom properties)
            plan_name: params.planName
        });
        console.log('[Pinterest] Checkout tracked:', params.planName, params.value);
    } catch (e) {
        console.error('[Pinterest] Checkout tracking failed:', e);
    }
};

/**
 * Track lead capture (email collected)
 * Call when user enters email for notifications, recovery, etc.
 */
export const trackPinterestLead = (params: {
    leadType: 'poll_notifications' | 'admin_recovery' | 'newsletter' | 'survey_notifications';
}): void => {
    if (!hasTrackingConsent() || !isPinterestLoaded()) return;
    
    try {
        (window as any).pintrk('track', 'lead', {
            event_id: generateEventId(),
            lead_type: params.leadType
        });
        console.log('[Pinterest] Lead tracked:', params.leadType);
    } catch (e) {
        console.error('[Pinterest] Lead tracking failed:', e);
    }
};

/**
 * Track "signup" - for VoteGenerator this means creating a poll/survey
 * This is the key conversion action since we don't have traditional signups
 */
export const trackPinterestSignup = (params?: {
    pollType?: 'poll' | 'survey' | 'ranked_choice';
    questionCount?: number;
}): void => {
    if (!hasTrackingConsent() || !isPinterestLoaded()) return;
    
    try {
        (window as any).pintrk('track', 'signup', {
            event_id: generateEventId(),
            // Custom properties
            poll_type: params?.pollType || 'poll',
            question_count: params?.questionCount || 1
        });
        console.log('[Pinterest] Signup (poll created) tracked:', params?.pollType);
    } catch (e) {
        console.error('[Pinterest] Signup tracking failed:', e);
    }
};

/**
 * Track viewing pricing/plans (view category)
 * Call when user views pricing page
 */
export const trackPinterestViewCategory = (params: {
    category: 'pricing' | 'templates' | 'features';
}): void => {
    if (!hasTrackingConsent() || !isPinterestLoaded()) return;
    
    try {
        (window as any).pintrk('track', 'viewcategory', {
            event_id: generateEventId(),
            category_name: params.category
        });
        console.log('[Pinterest] ViewCategory tracked:', params.category);
    } catch (e) {
        console.error('[Pinterest] ViewCategory tracking failed:', e);
    }
};

/**
 * Track custom events for specific actions
 */
export const trackPinterestCustom = (params: {
    eventName: string;
    customData?: Record<string, any>;
}): void => {
    if (!hasTrackingConsent() || !isPinterestLoaded()) return;
    
    try {
        (window as any).pintrk('track', 'custom', {
            event_id: generateEventId(),
            custom_event_name: params.eventName,
            ...params.customData
        });
        console.log('[Pinterest] Custom event tracked:', params.eventName);
    } catch (e) {
        console.error('[Pinterest] Custom tracking failed:', e);
    }
};

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const PinterestTracking = {
    checkout: trackPinterestCheckout,
    lead: trackPinterestLead,
    signup: trackPinterestSignup,
    viewCategory: trackPinterestViewCategory,
    custom: trackPinterestCustom,
    hasConsent: hasTrackingConsent,
    isLoaded: isPinterestLoaded
};

export default PinterestTracking;
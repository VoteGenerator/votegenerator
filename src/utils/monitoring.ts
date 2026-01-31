// ============================================================================
// monitoring.ts - Error Monitoring Utilities
// Location: src/utils/monitoring.ts
//
// PROBLEM: No Sentry/LogRocket - how do you know when things break?
// SOLUTION: Simple, free monitoring approach
// ============================================================================

// ============================================================================
// 1. ERROR TRACKING - Client-side error capture
// ============================================================================

interface ErrorLog {
    timestamp: string;
    message: string;
    stack?: string;
    url: string;
    userAgent: string;
    pollId?: string;
    extra?: Record<string, unknown>;
}

// Simple error logger - sends to your endpoint
export const logError = async (error: Error, extra?: Record<string, unknown>): Promise<void> => {
    const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ...extra,
    };

    // Log to console in development
    console.error('[VG Error]', errorLog);

    // Send to your Netlify function for server-side logging
    try {
        await fetch('/.netlify/functions/vg-log-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorLog),
        });
    } catch {
        // Don't throw - error logging shouldn't break the app
    }

    // Also store locally for debugging
    if (typeof localStorage !== 'undefined') {
        try {
            const stored = JSON.parse(localStorage.getItem('vg_error_log') || '[]');
            stored.push(errorLog);
            // Keep last 50 errors
            if (stored.length > 50) stored.shift();
            localStorage.setItem('vg_error_log', JSON.stringify(stored));
        } catch {
            // localStorage might be full or disabled
        }
    }
};

// Global error handler - catches unhandled errors
export const setupGlobalErrorHandler = (): void => {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.onerror = (message, source, lineno, colno, error) => {
        logError(error || new Error(String(message)), {
            source,
            lineno,
            colno,
        });
        return false; // Don't suppress the error
    };

    // Promise rejections
    window.onunhandledrejection = (event) => {
        logError(
            event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
            { type: 'unhandledRejection' }
        );
    };
};

// ============================================================================
// 2. SIMPLE HEALTH CHECK - For external monitoring
// ============================================================================

// Use with free uptime monitoring services:
// - UptimeRobot (free tier: 50 monitors)
// - Pingdom (free trial)
// - Better Uptime (free tier)
// - StatusCake (free tier)
//
// Point them at: https://votegenerator.com/.netlify/functions/vg-health
//
// They'll alert you via email/SMS when the site is down.

// ============================================================================
// 3. GET LOCAL ERROR LOG - For debugging
// ============================================================================

export const getLocalErrorLog = (): ErrorLog[] => {
    if (typeof localStorage === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem('vg_error_log') || '[]');
    } catch {
        return [];
    }
};

export const clearLocalErrorLog = (): void => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('vg_error_log');
};

// ============================================================================
// USAGE IN APP.TSX:
// ============================================================================
/*
import { setupGlobalErrorHandler } from './utils/monitoring';

// In your App component:
useEffect(() => {
    setupGlobalErrorHandler();
}, []);
*/
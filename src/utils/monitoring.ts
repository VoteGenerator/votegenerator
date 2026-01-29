// ============================================================================
// monitoring.ts - Error Monitoring, Backup, and Status Utilities
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
export const logError = async (error: Error, extra?: Record<string, unknown>) => {
    const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
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
    const stored = JSON.parse(localStorage.getItem('vg_error_log') || '[]');
    stored.push(errorLog);
    // Keep last 50 errors
    if (stored.length > 50) stored.shift();
    localStorage.setItem('vg_error_log', JSON.stringify(stored));
};

// Global error handler - catches unhandled errors
export const setupGlobalErrorHandler = () => {
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
// 3. ERROR BOUNDARY COMPONENT - React error boundary
// ============================================================================

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logError(error, {
            componentStack: errorInfo.componentStack,
            type: 'reactError',
        });
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-slate-600 mb-6">
                            We've been notified and are working on it. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
                        >
                            Refresh Page
                        </button>
                        <p className="text-xs text-slate-400 mt-4">
                            Error: {this.state.error?.message}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ============================================================================
// 4. DAILY EMAIL DIGEST - Netlify function to email you errors
// ============================================================================
// See: vg-error-digest.ts (separate file)


// ============================================================================
// USAGE IN APP.TSX:
// ============================================================================
/*
import { setupGlobalErrorHandler, ErrorBoundary } from './utils/monitoring';

// In your App component:
useEffect(() => {
    setupGlobalErrorHandler();
}, []);

// Wrap your app:
<ErrorBoundary>
    <App />
</ErrorBoundary>
*/
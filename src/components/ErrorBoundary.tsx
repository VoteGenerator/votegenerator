// ============================================================================
// ErrorBoundary.tsx - React Error Boundary Component
// Location: src/components/ErrorBoundary.tsx
// ============================================================================
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../utils/monitoring';

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
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
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

export default ErrorBoundary;
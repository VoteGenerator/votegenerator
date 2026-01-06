// ============================================================================
// Anonymous Badge Component
// Location: src/components/AnonymousBadge.tsx
// 
// Shows "Your response is anonymous" badge to respondents
// Add this to your SurveyVoting component when poll.settings.anonymousMode is true
// ============================================================================

import React from 'react';
import { Shield } from 'lucide-react';

// ============================================================================
// ANONYMOUS BADGE - Show at top of survey when anonymousMode is true
// ============================================================================

interface AnonymousBadgeProps {
    variant?: 'inline' | 'banner';
}

export const AnonymousBadge: React.FC<AnonymousBadgeProps> = ({ variant = 'inline' }) => {
    if (variant === 'banner') {
        return (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-emerald-800">Your response is anonymous</p>
                        <p className="text-sm text-emerald-600">
                            Your individual answers will not be visible to the survey creator.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Inline variant (default)
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
            <Shield size={16} />
            Your response is anonymous
        </div>
    );
};

// ============================================================================
// USAGE IN SurveyVoting.tsx
// ============================================================================

/*
In your SurveyVoting.tsx component, add this near the top of the survey:

import { AnonymousBadge } from './AnonymousBadge';

// In the component:
const SurveyVoting: React.FC<Props> = ({ poll }) => {
    const isAnonymous = poll.settings?.anonymousMode || poll.surveySettings?.anonymousMode;
    
    return (
        <div>
            {/* Show anonymous badge at top of survey *\/}
            {isAnonymous && <AnonymousBadge variant="banner" />}
            
            {/* Rest of your survey content *\/}
            ...
        </div>
    );
};
*/

export default AnonymousBadge;
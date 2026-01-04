// ============================================================================
// useAntiBot.ts - Anti-bot protection for vote submissions
// Location: src/hooks/useAntiBot.ts
// 
// INTEGRATION: In VoteGeneratorVote.tsx, add to vote submission:
//
// import { useAntiBot } from '../hooks/useAntiBot';
// 
// const { getAntiBotFields, HoneypotField } = useAntiBot();
//
// // In your form, add the honeypot:
// <HoneypotField />
//
// // In your submit handler, include anti-bot fields:
// const response = await fetch('/.netlify/functions/vg-vote', {
//     method: 'POST',
//     body: JSON.stringify({
//         pollId,
//         selectedOptionIds,
//         ...getAntiBotFields() // Add this line
//     })
// });
// ============================================================================

import { useRef, useCallback } from 'react';

interface AntiBotFields {
    _hp: string;  // Honeypot - should always be empty
    _t: number;   // Page load timestamp
}

export const useAntiBot = () => {
    // Record when the component mounted (page loaded)
    const pageLoadTime = useRef(Date.now());
    
    // Honeypot value - bots will fill this, humans won't see it
    const honeypotValue = useRef('');
    
    // Get the anti-bot fields to include in vote submission
    const getAntiBotFields = useCallback((): AntiBotFields => {
        return {
            _hp: honeypotValue.current,
            _t: pageLoadTime.current
        };
    }, []);
    
    // Set honeypot value (called by hidden input onChange)
    const setHoneypot = useCallback((value: string) => {
        honeypotValue.current = value;
    }, []);
    
    // Honeypot field component - hidden from users, visible to bots
    const HoneypotField = () => (
        <div 
            style={{ 
                position: 'absolute', 
                left: '-9999px', 
                opacity: 0,
                height: 0,
                overflow: 'hidden',
                pointerEvents: 'none'
            }}
            aria-hidden="true"
            tabIndex={-1}
        >
            <label htmlFor="_hp_field">Leave this empty</label>
            <input
                type="text"
                id="_hp_field"
                name="_hp"
                autoComplete="off"
                tabIndex={-1}
                onChange={(e) => setHoneypot(e.target.value)}
            />
        </div>
    );
    
    return {
        getAntiBotFields,
        HoneypotField,
        pageLoadTime: pageLoadTime.current
    };
};

// Standalone function for non-hook usage
export const createAntiBotFields = (): AntiBotFields => {
    return {
        _hp: '',
        _t: Date.now()
    };
};

export default useAntiBot;
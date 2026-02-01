import React, { useState } from 'react';

const CookieConsent: React.FC = () => {
    const [hidden, setHidden] = useState(false);
    
    // Check if already accepted (but still render first)
    const alreadyConsented = typeof window !== 'undefined' && localStorage.getItem('vg_cookie_consent');
    
    if (hidden || alreadyConsented) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#1e1b4b',
            color: 'white',
            padding: '20px',
            zIndex: 99999
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <p style={{ margin: 0 }}>🍪 We use cookies to improve your experience.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { localStorage.setItem('vg_cookie_consent', 'no'); setHidden(true); }} style={{ padding: '10px 20px', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Decline</button>
                    <button onClick={() => { localStorage.setItem('vg_cookie_consent', 'yes'); setHidden(true); }} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Accept</button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
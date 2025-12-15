import React from 'react';

const NavHeader: React.FC = () => {
    return (
        <header style={{
            position: 'sticky',
            top: '48px',
            zIndex: 40,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px'
            }}>
                <a href="/index.html" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <span style={{ fontWeight: 900, fontSize: '20px', color: '#0f172a' }}>VoteGenerator</span>
                </a>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <a href="/index.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Create Poll</a>
                    <a href="/demo.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Demo</a>
                    <a href="/pricing.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Pricing</a>
                    <a href="/compare.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Compare</a>
                    <a href="/blog.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Blog</a>
                    <a href="/help.html" style={{ padding: '8px 16px', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>Help</a>
                </nav>

                <a href="/index.html" style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px',
                    borderRadius: '12px',
                    textDecoration: 'none'
                }}>
                    Create Free Poll
                </a>
            </div>
        </header>
    );
};

export default NavHeader;
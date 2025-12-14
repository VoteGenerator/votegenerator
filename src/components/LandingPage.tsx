import React, { useRef } from 'react';
import NavHeader from './NavHeader';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyChooseUs';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import PromoBanner from './PromoBanner';
import Footer from './Footer';

const LandingPage: React.FC = () => {
    const createRef = useRef<HTMLDivElement>(null);
    
    const scrollToCreate = () => {
        createRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <div className="min-h-screen">
            {/* Promo Banner - Fixed at very top */}
            <PromoBanner position="top" />
            
            {/* Spacer for fixed promo banner */}
            <div className="h-12" />
            
            {/* Sticky Navigation Header - below promo banner */}
            <NavHeader currentPage="create" />
            
            {/* Hero Section */}
            <HeroSection onGetStarted={scrollToCreate} />
            
            {/* Why Choose Us */}
            <WhyChooseUs />
            
            {/* Poll Creator */}
            <div ref={createRef} id="poll-creator">
                <VoteGeneratorCreate />
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
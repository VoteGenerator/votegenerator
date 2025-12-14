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
            <NavHeader />
            
            {/* Hero Section */}
            <section id="hero">
                <HeroSection onGetStarted={scrollToCreate} />
            </section>
            
            {/* Why Choose Us (includes comparison info) */}
            <section id="why-choose-us">
                <WhyChooseUs />
            </section>
            
            {/* Poll Creator */}
            <section ref={createRef} id="poll-creator">
                <VoteGeneratorCreate />
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
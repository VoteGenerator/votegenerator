import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyChooseUs';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import PromoBanner from './PromoBanner';

const LandingPage: React.FC = () => {
    const createRef = useRef<HTMLDivElement>(null);
    
    const scrollToCreate = () => {
        createRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <div className="min-h-screen">
            {/* Promo Banner - Fixed at top */}
            <PromoBanner position="top" />
            
            {/* Hero Section */}
            <HeroSection onGetStarted={scrollToCreate} />
            
            {/* Why Choose Us */}
            <WhyChooseUs />
            
            {/* Poll Creator */}
            <div ref={createRef} id="poll-creator">
                <VoteGeneratorCreate />
            </div>
        </div>
    );
};

export default LandingPage;
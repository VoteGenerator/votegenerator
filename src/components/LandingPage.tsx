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
            
            {/* Demo Section - Simple inline demo */}
            <section id="demo-section" className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">See How Easy It Is</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Create beautiful polls in seconds. No signup required.
                        </p>
                    </div>
                    
                    {/* Simple Demo Poll Preview */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-lg mx-auto">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                            <h3 className="font-bold text-lg">What's your favorite feature?</h3>
                            <p className="text-indigo-100 text-sm">247 votes</p>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { label: 'No signup required', percent: 42 },
                                { label: 'Beautiful themes', percent: 28 },
                                { label: 'Real-time results', percent: 18 },
                                { label: 'Easy sharing', percent: 12 },
                            ].map((option, i) => (
                                <div key={i} className="relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-700">{option.label}</span>
                                        <span className="text-sm font-bold text-indigo-600">{option.percent}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                            style={{ width: `${option.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <button 
                                onClick={() => scrollToCreate()}
                                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Create Your Own Poll
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Us (includes comparison info) */}
            <section id="why-choose-us">
                <WhyChooseUs />
            </section>
            
            {/* Poll Creator */}
            <section ref={createRef} id="poll-creator">
                <VoteGeneratorCreate />
            </section>
            
            {/* Pricing Section */}
            <section id="pricing" className="py-16 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-600 mb-8">Choose the plan that works for you</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Free Plan */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Free</h3>
                            <div className="text-4xl font-black text-slate-900 mb-4">$0</div>
                            <ul className="text-sm text-slate-600 space-y-2 mb-6 text-left">
                                <li>✓ All 12 poll types</li>
                                <li>✓ Unlimited polls</li>
                                <li>✓ Up to 100 responses/poll</li>
                                <li>✓ Basic analytics</li>
                                <li>✓ All 8 themes</li>
                            </ul>
                            <button 
                                onClick={() => scrollToCreate()}
                                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Get Started Free
                            </button>
                        </div>
                        {/* Pro Plan */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                                POPULAR
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-black mb-1">$9<span className="text-lg font-normal">/mo</span></div>
                            <p className="text-indigo-200 text-sm mb-4">or $79/year (save 27%)</p>
                            <ul className="text-sm space-y-2 mb-6 text-left">
                                <li>✓ Everything in Free</li>
                                <li>✓ Unlimited responses</li>
                                <li>✓ Custom branding & logo</li>
                                <li>✓ CSV, Excel & PDF export</li>
                                <li>✓ Remove ads & branding</li>
                                <li>✓ Priority support</li>
                            </ul>
                            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                                Start Pro Trial
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
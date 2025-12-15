import React, { useRef } from 'react';
import NavHeader from './NavHeader';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyChooseUs';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import PromoBanner from './PromoBanner';
import Footer from './Footer';
import DemoPollInteractive from './DemoPollInteractive';

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
            
            {/* Sticky Navigation Header */}
            <NavHeader />
            
            {/* Hero Section */}
            <section id="hero">
                <HeroSection onGetStarted={scrollToCreate} />
            </section>
            
            {/* Demo Section */}
            <section id="demo-section" className="py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Try It Live</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Experience how easy it is to create and vote on polls. No signup required.
                        </p>
                    </div>
                    <DemoPollInteractive 
                        pollTypeId="multiple-choice"
                        question="What's your favorite feature of VoteGenerator?"
                        options={['No signup required', 'Beautiful themes', 'Real-time results', 'Easy sharing']}
                    />
                    <div className="mt-8 text-center space-y-3">
                        <p className="text-slate-500 text-sm">This is just 1 of 12 poll types available!</p>
                        <a 
                            href="/demo"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Explore All 12 Poll Types →
                        </a>
                    </div>
                </div>
            </section>
            
            {/* Why Choose Us */}
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
                    <div className="mt-8">
                        <a 
                            href="/pricing"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            View full pricing with all 4 plans & feature comparison →
                        </a>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
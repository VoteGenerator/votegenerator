import React, { useRef } from 'react';
import NavHeader from './NavHeader';
import HeroSection from './HeroSection';
import WhyChooseUs from './WhyChooseUs';
import VoteGeneratorCreate from './VoteGeneratorCreate';
import PromoBanner from './PromoBanner';
import Footer from './Footer';
import DemoPollInteractive from './DemoPollInteractive';
import { getRegionalPricing, isPromoActive } from './promoConfig';
import { Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
    const createRef = useRef<HTMLDivElement>(null);
    const pricing = getRegionalPricing();
    const promoActive = isPromoActive();
    
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
                            href="/demo.html"
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
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-600 mb-8">Choose the plan that works for you</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Free Plan */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Free</h3>
                            <div className="text-4xl font-black text-slate-900 mb-4">{pricing.symbol}0</div>
                            <ul className="text-sm text-slate-600 space-y-2 mb-6 text-left">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 9 basic poll types
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Unlimited polls
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 100 responses/poll
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Basic analytics
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> All 8 themes
                                </li>
                            </ul>
                            <button 
                                onClick={() => scrollToCreate()}
                                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Get Started Free
                            </button>
                        </div>
                        
                        {/* Quick Poll - One Time */}
                        <div className="bg-white p-6 rounded-2xl border-2 border-amber-300 shadow-sm relative">
                            {promoActive && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                                    <Zap size={12} />
                                    LIMITED TIME
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Quick Poll</h3>
                            <div className="flex items-baseline justify-center gap-2 mb-1">
                                {promoActive && pricing.quickPollOriginal && (
                                    <span className="text-xl line-through text-slate-400">{pricing.symbol}{pricing.quickPollOriginal}</span>
                                )}
                                <span className="text-4xl font-black text-slate-900">{pricing.symbol}{pricing.quickPoll}</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-4">one-time payment</p>
                            <ul className="text-sm text-slate-600 space-y-2 mb-6 text-left">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 1 poll, 7 days active
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 500 responses
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> No ads or branding
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> CSV, Excel & PDF
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Custom thank-you
                                </li>
                            </ul>
                            <a 
                                href="/pricing.html"
                                className="block w-full py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors text-center"
                            >
                                {promoActive ? 'Get This Deal' : 'Buy Now'}
                            </a>
                        </div>
                        
                        {/* Pro Plan */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-3 right-3 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                                POPULAR
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                            <div className="text-4xl font-black mb-1">{pricing.symbol}{pricing.proMonthly}<span className="text-lg font-normal">/mo</span></div>
                            <p className="text-indigo-200 text-sm mb-4">or {pricing.symbol}{pricing.proYearly}/year (save 31%)</p>
                            <ul className="text-sm space-y-2 mb-6 text-left">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-300">✓</span> Everything in Free
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-300">✓</span> 10,000 responses
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-300">✓</span> All 12 poll types
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-300">✓</span> No ads & custom logo
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-300">✓</span> Analytics & exports
                                </li>
                            </ul>
                            <a 
                                href="/pricing.html"
                                className="block w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-center"
                            >
                                Get Pro
                            </a>
                        </div>
                    </div>
                    <div className="mt-8">
                        <a 
                            href="/pricing.html"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            View full pricing with all 5 plans & feature comparison →
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
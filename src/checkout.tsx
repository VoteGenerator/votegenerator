import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
    Loader2, 
    CreditCard, 
    Shield, 
    Check,
    Zap,
    Calendar,
    Users,
    Crown,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import './index.css';

// Plan configurations
const PLANS: Record<string, {
    name: string;
    price: number;
    period: string;
    icon: React.ElementType;
    color: string;
    features: string[];
    stripePrice?: string; // Stripe Price ID
}> = {
    'quick_poll': {
        name: 'Quick Poll',
        price: 5,
        period: 'one-time',
        icon: Zap,
        color: 'from-blue-500 to-indigo-600',
        features: ['500 responses', '7 days active', '10 poll types', 'Export to CSV'],
        stripePrice: 'price_quick_poll'
    },
    'event_poll': {
        name: 'Event Poll',
        price: 10,
        period: 'one-time',
        icon: Calendar,
        color: 'from-purple-500 to-indigo-600',
        features: ['2,000 responses', '30 days active', '13 poll types', 'Export to PDF & PNG'],
        stripePrice: 'price_event_poll'
    },
    'pro_monthly': {
        name: 'Pro',
        price: 100,
        period: 'year',
        icon: Crown,
        color: 'from-indigo-500 to-purple-600',
        features: ['10,000/month', 'Unlimited duration', 'All 16 poll types', 'Custom short links'],
        stripePrice: 'price_pro_yearly'
    },
    'pro_plus_monthly': {
        name: 'Pro+',
        price: 160,
        period: 'year',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-600',
        features: ['50,000/month', 'White-label embed', 'API access', '10 team viewers'],
        stripePrice: 'price_pro_plus_yearly'
    }
};

// Currency conversion rates (approximate)
const CURRENCY_CONFIG: Record<string, { symbol: string; rate: number; name: string }> = {
    USD: { symbol: '$', rate: 1, name: 'US Dollar' },
    CAD: { symbol: 'CA$', rate: 1.36, name: 'Canadian Dollar' },
    EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
    GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
    AUD: { symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
    NZD: { symbol: 'NZ$', rate: 1.67, name: 'New Zealand Dollar' },
    INR: { symbol: '₹', rate: 83, name: 'Indian Rupee' },
    JPY: { symbol: '¥', rate: 149, name: 'Japanese Yen' }
};

// Detect user's likely currency based on timezone/locale
const detectCurrency = (): string => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const locale = navigator.language;
        
        // Map timezones/locales to currencies
        if (timezone.includes('America/Toronto') || timezone.includes('America/Vancouver') || locale.includes('en-CA')) return 'CAD';
        if (timezone.includes('Europe/London') || locale.includes('en-GB')) return 'GBP';
        if (timezone.includes('Australia') || locale.includes('en-AU')) return 'AUD';
        if (timezone.includes('Pacific/Auckland') || locale.includes('en-NZ')) return 'NZD';
        if (timezone.includes('Asia/Kolkata') || locale.includes('en-IN')) return 'INR';
        if (timezone.includes('Asia/Tokyo') || locale.includes('ja')) return 'JPY';
        if (timezone.includes('Europe/') && !timezone.includes('London')) return 'EUR';
        
        return 'USD';
    } catch {
        return 'USD';
    }
};

function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [plan, setPlan] = useState<typeof PLANS[string] | null>(null);
    const [planId, setPlanId] = useState('');

    useEffect(() => {
        // Detect currency
        setCurrency(detectCurrency());
        
        // Get plan from URL
        const params = new URLSearchParams(window.location.search);
        const planParam = params.get('plan');
        
        if (planParam && PLANS[planParam]) {
            setPlan(PLANS[planParam]);
            setPlanId(planParam);
        }
    }, []);

    const formatPrice = (usdPrice: number): string => {
        const config = CURRENCY_CONFIG[currency];
        const convertedPrice = Math.round(usdPrice * config.rate);
        
        // For JPY and INR, no decimals
        if (currency === 'JPY' || currency === 'INR') {
            return `${config.symbol}${convertedPrice.toLocaleString()}`;
        }
        
        return `${config.symbol}${convertedPrice}`;
    };

    const handleCheckout = async () => {
        setLoading(true);
        
        try {
            // Call your existing Netlify function
            const response = await fetch('/.netlify/functions/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    currency: currency.toLowerCase(),
                    successUrl: `${window.location.origin}/success?plan=${planId}`,
                    cancelUrl: window.location.href
                })
            });
            
            const data = await response.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (!plan) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Plan not found</h1>
                    <a href="/pricing.html" className="text-indigo-600 hover:underline">
                        ← Back to Pricing
                    </a>
                </div>
            </div>
        );
    }

    const Icon = plan.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="VoteGenerator" className="w-8 h-8" />
                        <span className="font-bold text-xl text-slate-900">VoteGenerator</span>
                    </a>
                    <a href="/pricing.html" className="text-slate-600 hover:text-slate-900 flex items-center gap-1">
                        <ArrowLeft size={16} />
                        Back to Pricing
                    </a>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h2>
                        
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4`}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    <p className="text-white/80 text-sm">
                                        {plan.period === 'one-time' ? 'One-time purchase' : 'Annual subscription'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                    <Check size={16} className="text-emerald-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-medium">{formatPrice(plan.price)}</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span className="text-slate-800">Total</span>
                                <span className="text-slate-900">{formatPrice(plan.price)} {currency}</span>
                            </div>
                        </div>

                        {/* Currency Selector */}
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <label className="text-xs text-slate-500 block mb-1">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                    <option key={code} value={code}>
                                        {config.symbol} {code} - {config.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    {/* Payment */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                    >
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Payment</h2>
                        
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg mb-6">
                            <Shield size={18} />
                            <span className="text-sm font-medium">Secure checkout powered by Stripe</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className={`w-full py-4 bg-gradient-to-r ${plan.color} text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                                loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Redirecting to checkout...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay {formatPrice(plan.price)} {currency}
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4">
                            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                        </p>

                        {/* Trust badges */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <Shield size={24} className="mx-auto text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500">SSL Secured</p>
                                </div>
                                <div>
                                    <CreditCard size={24} className="mx-auto text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500">Stripe Payments</p>
                                </div>
                                <div>
                                    <Check size={24} className="mx-auto text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500">Instant Access</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <CheckoutPage />
        </React.StrictMode>
    );
}

export default CheckoutPage;
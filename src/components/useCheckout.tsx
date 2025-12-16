// ============================================================================
// VoteGenerator - useCheckout Hook
// Easy way to trigger Stripe checkout from any component
// ============================================================================

import React, { useState } from 'react';

export type CheckoutPlan = 
  | 'quick_poll'
  | 'event_poll'
  | 'pro_monthly'
  | 'pro_yearly'
  | 'pro_plus_monthly'
  | 'pro_plus_yearly';

interface CheckoutOptions {
  plan: CheckoutPlan;
  pollData?: {
    type: string;
    question: string;
    options: Array<{ text: string }>;
    settings?: Record<string, any>;
  };
}

interface UseCheckoutReturn {
  checkout: (options: CheckoutOptions) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (options: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: options.plan,
          pollData: options.pollData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return { checkout, loading, error };
}

// ============================================================================
// Checkout Button Component
// Drop-in button that handles everything
// ============================================================================

interface CheckoutButtonProps {
  plan: CheckoutPlan;
  children: React.ReactNode;
  className?: string;
  pollData?: CheckoutOptions['pollData'];
  disabled?: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  plan,
  children,
  className = '',
  pollData,
  disabled = false,
}) => {
  const { checkout, loading, error } = useCheckout();

  const handleClick = async () => {
    await checkout({ plan, pollData });
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${className} ${loading ? 'opacity-75 cursor-wait' : ''}`}
      >
        {loading ? 'Loading...' : children}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </>
  );
};

// ============================================================================
// Plan display names and prices (for UI consistency)
// ============================================================================

export const PLAN_DETAILS: Record<CheckoutPlan, {
  name: string;
  price: string;
  period?: string;
  description: string;
}> = {
  quick_poll: {
    name: 'Quick Poll',
    price: '$5',
    description: '1 poll, 7 days, 500 responses',
  },
  event_poll: {
    name: 'Event Poll',
    price: '$9.99',
    description: '1 poll, 30 days, 2,000 responses',
  },
  pro_monthly: {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'Unlimited polls, 10,000 responses each',
  },
  pro_yearly: {
    name: 'Pro',
    price: '$99',
    period: '/year',
    description: 'Unlimited polls, 10,000 responses each',
  },
  pro_plus_monthly: {
    name: 'Pro+',
    price: '$19',
    period: '/month',
    description: 'Everything + Visual Poll + 50,000 responses',
  },
  pro_plus_yearly: {
    name: 'Pro+',
    price: '$149',
    period: '/year',
    description: 'Everything + Visual Poll + 50,000 responses',
  },
};

export default useCheckout;
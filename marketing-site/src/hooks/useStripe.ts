import { loadStripe } from '@stripe/stripe-js';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export const useStripe = () => {
  const createCheckoutSession = async (amount: number, type: 'donation' | 'subscription') => {
    // Mock for local development
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert(`Mock ${type}: $${amount} - In production, this would redirect to Stripe`);
      return;
    }

    const stripe = await stripePromise;
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, type }),
    });
    
    const { sessionId } = await response.json();
    
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId });
    }
  };

  return { createCheckoutSession };
};
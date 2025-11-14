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
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        alert(`Payment setup error: ${data.error || 'Please try again later'}`);
        return;
      }
      
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      alert('Payment system temporarily unavailable. Please try again later.');
      console.error('Stripe error:', error);
    }
  };

  return { createCheckoutSession };
};
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export const useStripe = () => {
  const createCheckoutSession = async (
    amount: number,
    type: "donation" | "subscription"
  ) => {
    // Check if Stripe is properly configured
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert(
        `Thank you for your interest in supporting TKCC! ${type}: $${amount}\n\nPayment processing is being configured. Contact hello@thiskidcancode.com to donate.`
      );
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      alert("Payment system is currently unavailable. Please try again later.");
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error("Checkout session error:", data);
        alert(`Payment setup error: ${data.error || "Please try again later"}`);
        return;
      }

      if (data.url) {
        // Modern approach: redirect to Stripe Checkout URL
        window.location.href = data.url;
      } else {
        alert("Unable to create payment session. Please try again.");
      }
    } catch (error) {
      console.error("Stripe integration error:", error);
      alert("Payment system temporarily unavailable. Please try again later.");
    }
  };

  return { createCheckoutSession };
};

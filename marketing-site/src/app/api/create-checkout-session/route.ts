import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null;

export async function POST(request: NextRequest) {
  console.log("🔍 API Route called - Stripe configured:", !!stripe);
  console.log("🔍 Environment check:", {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!stripe) {
    console.error("❌ Stripe not initialized - missing secret key");
    return NextResponse.json(
      {
        error:
          "Payment system is currently unavailable. Please try again later or contact support.",
      },
      { status: 503 }
    );
  }

  try {
    const { amount, type } = await request.json();
    console.log("🔍 Request data:", { amount, type });

    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                type === "subscription"
                  ? "Monthly Support"
                  : "One-time Donation",
              description: "Support free coding education for kids",
            },
            unit_amount: amount * 100,
            ...(type === "subscription" && {
              recurring: { interval: "month" },
            }),
          },
          quantity: 1,
        },
      ],
      mode: type === "subscription" ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
    };

    console.log("🔍 Creating Stripe session with config:", sessionConfig);
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log("✅ Session created successfully:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error:
          "Unable to process payment at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

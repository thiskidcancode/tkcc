import { NextResponse } from "next/server";
import { WaitlistResponse } from "@/types/waitlist";
import { getWaitlistCount } from "@/lib/db";

/**
 * GET /api/waitlist/count - Get current waitlist count
 */
export async function GET() {
  try {
    console.log("📊 Waitlist count request received");

    const totalCount = await getWaitlistCount();

    console.log(`✅ Current waitlist count: ${totalCount}`);

    return NextResponse.json(
      {
        success: true,
        message: "Waitlist count retrieved successfully",
        totalCount,
      } as WaitlistResponse,
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error fetching waitlist count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching the waitlist count.",
      } as WaitlistResponse,
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/waitlist/count - CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

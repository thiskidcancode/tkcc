import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { WaitlistData, WaitlistResponse } from "@/types/waitlist";

// Constants
const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");
const DEFAULT_START_COUNT = parseInt(
  process.env.WAITLIST_START_COUNT || "0",
  10
);

/**
 * Ensure data directory and files exist
 */
async function ensureDataFiles(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }

  // Initialize waitlist file if it doesn't exist
  try {
    await fs.access(WAITLIST_FILE);
  } catch {
    const initialData: WaitlistData = {
      entries: [],
      metadata: {
        startCount: DEFAULT_START_COUNT,
        lastPosition: DEFAULT_START_COUNT,
      },
    };
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(initialData, null, 2));
  }
}

/**
 * Load waitlist data
 */
async function loadWaitlistData(): Promise<WaitlistData> {
  await ensureDataFiles();
  const data = await fs.readFile(WAITLIST_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * GET /api/waitlist/count - Get current waitlist count
 */
export async function GET() {
  try {
    console.log("📊 Waitlist count request received");

    // Load waitlist data
    const waitlistData = await loadWaitlistData();
    const totalCount = waitlistData.metadata.lastPosition;

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
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
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

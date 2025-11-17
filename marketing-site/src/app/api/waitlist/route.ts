import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  WaitlistEntry,
  WaitlistResponse,
  WaitlistRegistrationRequest,
  WaitlistData,
  RateLimitRecord,
} from "@/types/waitlist";

// Constants
const DATA_DIR = path.join(process.cwd(), "data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");
const RATE_LIMIT_FILE = path.join(DATA_DIR, "rate-limits.json");
const MAX_REGISTRATIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_START_COUNT = parseInt(
  process.env.WAITLIST_START_COUNT || "0",
  10
);

// Twilio opt-in compliance text
export const TWILIO_OPT_IN_TEXT =
  "By checking this box, you consent to receive SMS notifications from ThisKidCanCode. Message and data rates may apply. You can opt out at any time by replying STOP.";

/**
 * Sanitize user input to prevent XSS attacks
 * 
 * Note: This is a defense-in-depth measure. The primary XSS protection comes from:
 * 1. Input validation (email/phone format checks)
 * 2. JSON storage (not HTML rendering in this API)
 * 3. Content-Type headers in responses
 * 
 * When displaying this data in a frontend, ALWAYS use proper escaping:
 * - React: JSX automatically escapes
 * - HTML: Use textContent or proper HTML escaping functions
 * 
 * This function removes common XSS vectors as an additional safety layer.
 */
function sanitizeInput(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");
  
  // Remove all potentially dangerous patterns in a single comprehensive pass
  // Pattern explanation:
  // - [<>] : Remove angle brackets (HTML tags)
  // - \b(javascript|data|vbscript):\S* : Remove dangerous URL schemes
  // - \bon[a-z]+\s*=\s*["']?[^"']*["']? : Remove event handler attributes
  // Using a single regex to prevent bypass attacks through sequential replacement
  sanitized = sanitized.replace(/[<>]|\b(?:javascript|data|vbscript):\S*|\bon[a-z]+\s*=\s*(?:["'][^"']*["']?)?/gi, "");
  
  return sanitized.trim();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate US phone number format
 */
function isValidUSPhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // US phone numbers should have 10 digits (or 11 with leading 1)
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === "1");
}

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

  // Initialize rate limit file if it doesn't exist
  try {
    await fs.access(RATE_LIMIT_FILE);
  } catch {
    await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify([], null, 2));
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
 * Save waitlist data
 */
async function saveWaitlistData(data: WaitlistData): Promise<void> {
  await fs.writeFile(WAITLIST_FILE, JSON.stringify(data, null, 2));
}

/**
 * Load rate limit data
 */
async function loadRateLimitData(): Promise<RateLimitRecord[]> {
  await ensureDataFiles();
  const data = await fs.readFile(RATE_LIMIT_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * Save rate limit data
 */
async function saveRateLimitData(data: RateLimitRecord[]): Promise<void> {
  await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(data, null, 2));
}

/**
 * Check and update rate limiting for an IP address
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const rateLimits = await loadRateLimitData();
  const now = Date.now();

  let record = rateLimits.find((r) => r.ip === ip);

  if (!record) {
    record = { ip, registrations: [], lastCleanup: now };
    rateLimits.push(record);
  }

  // Clean up old registrations (older than 1 hour)
  record.registrations = record.registrations.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  record.lastCleanup = now;

  // Check if limit exceeded
  if (record.registrations.length >= MAX_REGISTRATIONS_PER_HOUR) {
    return false; // Rate limit exceeded
  }

  // Add current registration timestamp
  record.registrations.push(now);

  // Save updated rate limits
  await saveRateLimitData(rateLimits);
  return true; // Rate limit OK
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

/**
 * POST /api/waitlist - Register a new user to the waitlist
 */
export async function POST(request: NextRequest) {
  try {
    console.log("📝 Waitlist registration request received");

    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    console.log(`🌐 Client IP: ${clientIP}`);

    // Check rate limit
    const rateLimitOK = await checkRateLimit(clientIP);
    if (!rateLimitOK) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many registration attempts. Please try again in an hour.",
        } as WaitlistResponse,
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = (await request.json()) as WaitlistRegistrationRequest;

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and phone are required.",
        } as WaitlistResponse,
        { status: 400 }
      );
    }

    // Sanitize inputs
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email.toLowerCase());
    const phone = sanitizeInput(body.phone);

    // Validate email format
    if (!isValidEmail(email)) {
      console.warn(`⚠️ Invalid email format: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        } as WaitlistResponse,
        { status: 400 }
      );
    }

    // Validate phone format
    if (!isValidUSPhone(phone)) {
      console.warn(`⚠️ Invalid phone format: ${phone}`);
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid US phone number (10 digits).",
        } as WaitlistResponse,
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 100) {
      console.warn(`⚠️ Invalid name length: ${name}`);
      return NextResponse.json(
        {
          success: false,
          message: "Name must be between 2 and 100 characters.",
        } as WaitlistResponse,
        { status: 400 }
      );
    }

    // Load waitlist data
    const waitlistData = await loadWaitlistData();

    // Check for duplicate email
    const existingEntry = waitlistData.entries.find(
      (entry) => entry.email === email
    );
    if (existingEntry) {
      console.warn(`⚠️ Duplicate email registration: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already registered. Check your inbox for your position.",
          position: existingEntry.position,
          totalCount: waitlistData.metadata.lastPosition,
        } as WaitlistResponse,
        { status: 409 }
      );
    }

    // Create new entry
    const position = waitlistData.metadata.lastPosition + 1;
    const newEntry: WaitlistEntry = {
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      email,
      phone,
      twilioOptIn: body.twilioOptIn === true,
      registeredAt: new Date(),
      position,
    };

    // Add to waitlist
    waitlistData.entries.push(newEntry);
    waitlistData.metadata.lastPosition = position;

    // Save updated data
    await saveWaitlistData(waitlistData);

    console.log(
      `✅ Successfully registered: ${email} at position ${position}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered for the waitlist!",
        position,
        totalCount: position,
      } as WaitlistResponse,
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error processing waitlist registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your registration.",
      } as WaitlistResponse,
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist - Get all waitlist entries (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("📊 Waitlist data request received");

    // Simple admin authentication (should be enhanced with proper auth)
    const authHeader = request.headers.get("authorization");
    const adminToken = process.env.WAITLIST_ADMIN_TOKEN;

    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      console.warn("⚠️ Unauthorized access attempt to waitlist data");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Load and return waitlist data
    const waitlistData = await loadWaitlistData();

    console.log(`✅ Returning ${waitlistData.entries.length} waitlist entries`);

    return NextResponse.json(
      {
        success: true,
        data: waitlistData,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error fetching waitlist data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching waitlist data.",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/waitlist - CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

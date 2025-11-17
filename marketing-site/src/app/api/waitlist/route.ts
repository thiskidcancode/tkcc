import { NextRequest, NextResponse } from "next/server";
import {
  WaitlistResponse,
  WaitlistRegistrationRequest,
} from "@/types/waitlist";
import {
  addWaitlistEntry,
  getWaitlistCount,
  checkEmailExists,
  updateRateLimit,
  getRateLimit,
} from "@/lib/db";

// Constants
const MAX_REGISTRATIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Twilio opt-in compliance text
const TWILIO_OPT_IN_TEXT =
  "By checking this box, you consent to receive SMS notifications from ThisKidCanCode. Message and data rates may apply. You can opt out at any time by replying STOP.";

/**
 * Sanitize user input to prevent XSS attacks
 */
function sanitizeInput(input: string): string {
  let sanitized = input.replace(/\0/g, "");
  sanitized = sanitized.replace(/[<>]|\b(?:javascript|data|vbscript):\S*|\bon[a-z]+\s*=\s*(?:["'][^"']*["']?)?/gi, "");
  return sanitized.trim();
}

/**
 * Validate name for realistic human names
 */
function isValidName(name: string): boolean {
  // Must be 2-50 characters
  if (name.length < 2 || name.length > 50) return false;
  
  // Only letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return false;
  
  // Must have at least 2 words (first and last name)
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return false;
  
  // Validate each word
  for (const word of words) {
    // Each word must be at least 2 characters
    if (word.length < 2) return false;
    
    // Check for repeated characters (more than 3 in a row)
    if (/([a-zA-Z])\1{3,}/.test(word)) return false;
    
    // Check for excessive consonants or vowels in a row
    if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(word)) return false;
    if (/[aeiouAEIOU]{4,}/.test(word)) return false;
  }
  
  // Detect common spam patterns
  const spamPatterns = [
    /test/i, /asdf/i, /qwerty/i, /admin/i, /null/i, /undefined/i,
    /^\d+$/, // All numbers
    /([a-zA-Z])\1{3,}/, // More than 3 repeated characters anywhere
  ];
  
  return !spamPatterns.some(pattern => pattern.test(name));
}

/**
 * Enhanced email validation
 */
function isValidEmailEnhanced(email: string): boolean {
  // Basic format check
  if (!isValidEmail(email)) return false;
  
  // Additional checks
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  // Check for common spam domains/patterns
  const spamPatterns = [
    /test@/i, /admin@/i, /noreply@/i, /no-reply@/i,
    /@test\./i, /@example\./i, /@spam\./i,
    /\+.*\+.*@/, // Multiple + signs
  ];
  
  return !spamPatterns.some(pattern => pattern.test(email));
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
 * Check and update rate limiting for an IP address
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const record = await getRateLimit(ip);

  let registrations = record?.registrations || [];

  // Clean up old registrations (older than 1 hour)
  registrations = registrations.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  // Check if limit exceeded
  if (registrations.length >= MAX_REGISTRATIONS_PER_HOUR) {
    return false; // Rate limit exceeded
  }

  // Add current registration timestamp
  registrations.push(now);

  // Save updated rate limits
  await updateRateLimit(ip, registrations);
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

    // Validate email format with enhanced checks
    if (!isValidEmailEnhanced(email)) {
      console.warn(`⚠️ Invalid or suspicious email: ${email}`);
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

    // Validate name format and content
    if (!isValidName(name)) {
      console.warn(`⚠️ Invalid name format or content: ${name}`);
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a real full name (first and last name).",
        } as WaitlistResponse,
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingEntry = await checkEmailExists(email);
    if (existingEntry) {
      console.warn(`⚠️ Duplicate email registration: ${email}`);
      const totalCount = await getWaitlistCount();
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already registered. Check your inbox for your position.",
          position: existingEntry.position,
          totalCount,
        } as WaitlistResponse,
        { status: 409 }
      );
    }

    // Create new entry
    const entryId = `wl_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const position = await addWaitlistEntry({
      id: entryId,
      name,
      email,
      phone,
      twilio_opt_in: body.twilioOptIn === true,
    });

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
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Admin endpoint not implemented" },
    { status: 501 }
  );
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

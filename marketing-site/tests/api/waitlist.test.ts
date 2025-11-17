/**
 * Tests for the Waitlist API
 * 
 * These tests validate the waitlist registration system including:
 * - POST /api/waitlist - User registration
 * - GET /api/waitlist/count - Public count endpoint
 * - GET /api/waitlist - Admin data access
 */

import { NextRequest } from "next/server";
import { POST, GET, OPTIONS } from "@/app/api/waitlist/route";
import { GET as GET_COUNT } from "@/app/api/waitlist/count/route";
import { promises as fs } from "fs";
import path from "path";

// Mock file system operations
jest.mock("fs", () => ({
  promises: {
    mkdir: jest.fn(),
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe("Waitlist API", () => {
  const TEST_DATA_DIR = path.join(process.cwd(), "data");
  const WAITLIST_FILE = path.join(TEST_DATA_DIR, "waitlist.json");
  const RATE_LIMIT_FILE = path.join(TEST_DATA_DIR, "rate-limits.json");

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful directory creation
    mockFs.mkdir.mockResolvedValue(undefined);
    
    // Default: Files don't exist yet
    mockFs.access.mockRejectedValue(new Error("File not found"));
    
    // Default: Write file succeeds
    mockFs.writeFile.mockResolvedValue(undefined);
  });

  describe("POST /api/waitlist", () => {
    const createRequest = (
      body: unknown,
      headers: Record<string, string> = {}
    ): NextRequest => {
      const request = new NextRequest("http://localhost/api/waitlist", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "192.168.1.1",
          ...headers,
        },
      });
      return request;
    };

    it("should successfully register a valid user", async () => {
      // Mock empty waitlist
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === WAITLIST_FILE) {
          return Promise.resolve(
            JSON.stringify({
              entries: [],
              metadata: { startCount: 0, lastPosition: 0 },
            })
          );
        }
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        twilioOptIn: true,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.position).toBe(1);
      expect(data.totalCount).toBe(1);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        WAITLIST_FILE,
        expect.stringContaining("john@example.com")
      );
    });

    it("should reject registration with missing fields", async () => {
      const request = createRequest({
        name: "John Doe",
        // Missing email and phone
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain("required");
    });

    it("should reject invalid email format", async () => {
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "John Doe",
        email: "invalid-email",
        phone: "1234567890",
        twilioOptIn: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain("valid email");
    });

    it("should reject invalid phone number", async () => {
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        phone: "123", // Too short
        twilioOptIn: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain("valid US phone");
    });

    it("should reject duplicate email registration", async () => {
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === WAITLIST_FILE) {
          return Promise.resolve(
            JSON.stringify({
              entries: [
                {
                  id: "test123",
                  name: "John Doe",
                  email: "john@example.com",
                  phone: "1234567890",
                  twilioOptIn: true,
                  registeredAt: new Date(),
                  position: 1,
                },
              ],
              metadata: { startCount: 0, lastPosition: 1 },
            })
          );
        }
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "Jane Doe",
        email: "john@example.com", // Duplicate
        phone: "0987654321",
        twilioOptIn: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.message).toContain("already registered");
      expect(data.position).toBe(1);
    });

    it("should enforce rate limiting", async () => {
      const now = Date.now();
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(
            JSON.stringify([
              {
                ip: "192.168.1.1",
                registrations: [now, now, now], // 3 registrations
                lastCleanup: now,
              },
            ])
          );
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        twilioOptIn: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.message).toContain("Too many");
    });

    it("should sanitize XSS attempts in name field", async () => {
      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === WAITLIST_FILE) {
          return Promise.resolve(
            JSON.stringify({
              entries: [],
              metadata: { startCount: 0, lastPosition: 0 },
            })
          );
        }
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "<script>alert('xss')</script>John",
        email: "john@example.com",
        phone: "1234567890",
        twilioOptIn: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      
      // Verify the saved data doesn't contain XSS
      const savedData = mockFs.writeFile.mock.calls.find(
        (call) => call[0] === WAITLIST_FILE
      );
      expect(savedData).toBeDefined();
      const savedContent = savedData![1] as string;
      expect(savedContent).not.toContain("<script>");
      expect(savedContent).not.toContain("</script>");
    });

    it("should respect configurable start count", async () => {
      const originalEnv = process.env.WAITLIST_START_COUNT;
      process.env.WAITLIST_START_COUNT = "100";

      mockFs.readFile.mockImplementation((filePath) => {
        if (filePath === WAITLIST_FILE) {
          return Promise.resolve(
            JSON.stringify({
              entries: [],
              metadata: { startCount: 100, lastPosition: 105 },
            })
          );
        }
        if (filePath === RATE_LIMIT_FILE) {
          return Promise.resolve(JSON.stringify([]));
        }
        return Promise.reject(new Error("Unknown file"));
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        twilioOptIn: true,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.position).toBe(106); // Start count 100 + 6 entries

      // Restore environment
      if (originalEnv) {
        process.env.WAITLIST_START_COUNT = originalEnv;
      } else {
        delete process.env.WAITLIST_START_COUNT;
      }
    });
  });

  describe("GET /api/waitlist/count", () => {
    it("should return current waitlist count", async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify({
          entries: [{ id: "1" }, { id: "2" }, { id: "3" }],
          metadata: { startCount: 0, lastPosition: 3 },
        })
      );

      const response = await GET_COUNT();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.totalCount).toBe(3);
    });

    it("should return 0 for empty waitlist", async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify({
          entries: [],
          metadata: { startCount: 0, lastPosition: 0 },
        })
      );

      const response = await GET_COUNT();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.totalCount).toBe(0);
    });

    it("should include cache headers", async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify({
          entries: [],
          metadata: { startCount: 0, lastPosition: 0 },
        })
      );

      const response = await GET_COUNT();
      const cacheControl = response.headers.get("Cache-Control");

      expect(cacheControl).toContain("s-maxage=60");
      expect(cacheControl).toContain("stale-while-revalidate=30");
    });
  });

  describe("GET /api/waitlist (Admin)", () => {
    const createAdminRequest = (token?: string): NextRequest => {
      const headers: Record<string, string> = {};
      if (token) {
        headers["authorization"] = `Bearer ${token}`;
      }
      return new NextRequest("http://localhost/api/waitlist", {
        method: "GET",
        headers,
      });
    };

    it("should return waitlist data with valid admin token", async () => {
      process.env.WAITLIST_ADMIN_TOKEN = "test-admin-token";

      mockFs.readFile.mockResolvedValue(
        JSON.stringify({
          entries: [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              phone: "1234567890",
              twilioOptIn: true,
              registeredAt: new Date(),
              position: 1,
            },
          ],
          metadata: { startCount: 0, lastPosition: 1 },
        })
      );

      const request = createAdminRequest("test-admin-token");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.entries).toHaveLength(1);

      delete process.env.WAITLIST_ADMIN_TOKEN;
    });

    it("should reject requests without admin token", async () => {
      process.env.WAITLIST_ADMIN_TOKEN = "test-admin-token";

      const request = createAdminRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toContain("Unauthorized");

      delete process.env.WAITLIST_ADMIN_TOKEN;
    });

    it("should reject requests with invalid admin token", async () => {
      process.env.WAITLIST_ADMIN_TOKEN = "correct-token";

      const request = createAdminRequest("wrong-token");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);

      delete process.env.WAITLIST_ADMIN_TOKEN;
    });
  });

  describe("OPTIONS /api/waitlist (CORS)", () => {
    it("should return correct CORS headers", async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
        "POST"
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
        "GET"
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
        "Content-Type"
      );
    });
  });
});

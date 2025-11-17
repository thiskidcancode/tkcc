# Waitlist API Documentation

This document describes the Waitlist API endpoints for the ThisKidCanCode marketing site.

## Overview

The Waitlist API allows users to register for a waitlist with their contact information and optional Twilio SMS opt-in. The system includes:

- Rate limiting (max 3 registrations per IP per hour)
- Input validation and sanitization
- Duplicate email prevention
- Configurable starting position counter
- File-based JSON storage for MVP

## Environment Variables

### Required
None - the API will work with defaults if no environment variables are set.

### Optional
- `WAITLIST_START_COUNT` - Starting position for waitlist counter (default: 0)
- `WAITLIST_ADMIN_TOKEN` - Bearer token for admin access to full waitlist data
- `NEXT_PUBLIC_SITE_URL` - Site URL for CORS configuration (default: *)

## API Endpoints

### POST /api/waitlist

Register a new user to the waitlist.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "twilioOptIn": true
}
```

**Validation Rules:**
- `name`: 2-100 characters, sanitized for XSS
- `email`: Valid email format, case-insensitive, unique
- `phone`: Valid US phone number (10 digits or 11 with leading 1)
- `twilioOptIn`: Boolean indicating SMS consent

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully registered for the waitlist!",
  "position": 1,
  "totalCount": 1
}
```

**Error Responses:**

*400 Bad Request - Missing fields:*
```json
{
  "success": false,
  "message": "Name, email, and phone are required."
}
```

*400 Bad Request - Invalid email:*
```json
{
  "success": false,
  "message": "Please provide a valid email address."
}
```

*400 Bad Request - Invalid phone:*
```json
{
  "success": false,
  "message": "Please provide a valid US phone number (10 digits)."
}
```

*409 Conflict - Duplicate email:*
```json
{
  "success": false,
  "message": "This email is already registered. Check your inbox for your position.",
  "position": 1,
  "totalCount": 1
}
```

*429 Too Many Requests - Rate limit exceeded:*
```json
{
  "success": false,
  "message": "Too many registration attempts. Please try again in an hour."
}
```

### GET /api/waitlist/count

Get the current total count of waitlist registrations.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Waitlist count retrieved successfully",
  "totalCount": 42
}
```

**Cache Headers:**
- `Cache-Control: public, s-maxage=60, stale-while-revalidate=30`

### GET /api/waitlist

Admin endpoint to retrieve all waitlist entries.

**Authentication:**
Requires `Authorization: Bearer <WAITLIST_ADMIN_TOKEN>` header.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "wl_1234567890_abc123",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "twilioOptIn": true,
        "registeredAt": "2024-01-15T10:30:00.000Z",
        "position": 1
      }
    ],
    "metadata": {
      "startCount": 0,
      "lastPosition": 1
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## CORS Support

All endpoints support CORS preflight requests via OPTIONS method with the following headers:
- `Access-Control-Allow-Origin`: Configured site URL or *
- `Access-Control-Allow-Methods`: POST, GET, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization

## Twilio Opt-In Compliance

The API exports a constant `TWILIO_OPT_IN_TEXT` with legally compliant consent language:

```typescript
export const TWILIO_OPT_IN_TEXT =
  "By checking this box, you consent to receive SMS notifications from ThisKidCanCode. Message and data rates may apply. You can opt out at any time by replying STOP.";
```

This text should be displayed to users when they check the Twilio opt-in checkbox.

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `data/waitlist.json` - Waitlist entries and metadata
- `data/rate-limits.json` - Rate limiting records per IP

These files are automatically created on first API call and are excluded from git (see `.gitignore`).

## Security Features

1. **Rate Limiting**: Max 3 registrations per IP per hour
2. **Input Sanitization**: Removes HTML tags and JavaScript to prevent XSS
3. **Email Validation**: RFC-compliant email format validation
4. **Phone Validation**: US phone number format (10 or 11 digits)
5. **Duplicate Prevention**: Email uniqueness enforced
6. **Admin Authentication**: Token-based access control for sensitive data
7. **CORS Configuration**: Restricted to configured site URL

## Example Usage

### JavaScript/Fetch
```javascript
// Register for waitlist
const response = await fetch('/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    twilioOptIn: true,
  }),
});

const data = await response.json();
console.log(`You are position ${data.position} on the waitlist!`);

// Get waitlist count
const countResponse = await fetch('/api/waitlist/count');
const countData = await countResponse.json();
console.log(`Total registrations: ${countData.totalCount}`);
```

### cURL
```bash
# Register for waitlist
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "twilioOptIn": true
  }'

# Get count
curl http://localhost:3000/api/waitlist/count

# Get all data (admin)
curl http://localhost:3000/api/waitlist \
  -H "Authorization: Bearer your-admin-token"
```

## Testing

Tests are located in `tests/api/waitlist.test.ts` and cover:
- Successful registration
- Field validation
- Rate limiting
- Duplicate prevention
- XSS sanitization
- Admin authentication
- CORS functionality

Run tests with:
```bash
pnpm test
```

## Logging

The API includes comprehensive logging with emoji indicators:
- 📝 Registration request received
- 🌐 Client IP identified
- ⚠️ Warnings (rate limits, validation errors, duplicates)
- ✅ Success operations
- ❌ Error conditions
- 📊 Data retrieval operations

All logs are output to console for easy debugging and monitoring.

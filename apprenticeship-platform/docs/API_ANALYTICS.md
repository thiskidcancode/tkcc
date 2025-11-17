# Student Analytics API Documentation

## Overview
The Student Analytics API provides endpoints for tracking and analyzing student learning patterns, progress, and achievements. This API is designed for the This Kid Can Code apprenticeship platform.

## Base URL
```
/api/analytics
```

## Authentication
Currently using rate limiting based on IP address. Future implementations will include proper authentication tokens.

## Rate Limiting
- **Limit**: 100 requests per minute per IP address
- **Response**: `429 Too Many Requests` when limit is exceeded

---

## Endpoints

### 1. Get Student Progress

Retrieves progress records for a specific student.

**Endpoint**: `GET /api/analytics/student-progress`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| studentId | string | Yes | Unique identifier for the student (1-100 characters) |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "studentId": "student-123",
      "lessonId": "lesson-intro",
      "completedAt": "2024-11-17T12:00:00.000Z",
      "timeSpent": 600,
      "score": 90,
      "attempts": 2
    }
  ],
  "timestamp": "2024-11-17T12:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Missing or invalid studentId
  ```json
  {
    "success": false,
    "error": "Student ID is required as a query parameter",
    "timestamp": "2024-11-17T12:30:00.000Z"
  }
  ```

**Example**:
```bash
curl "http://localhost:2000/api/analytics/student-progress?studentId=student-123"
```

---

### 2. Create Student Progress Record

Creates a new progress record for a student completing a lesson.

**Endpoint**: `POST /api/analytics/student-progress`

**Request Body**:
```json
{
  "studentId": "student-123",
  "lessonId": "lesson-intro",
  "timeSpent": 600,
  "score": 90,
  "attempts": 2
}
```

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| studentId | string | Yes | Unique identifier for the student (1-100 characters) |
| lessonId | string | Yes | Unique identifier for the lesson (1-100 characters) |
| timeSpent | number | Yes | Time spent in seconds (must be positive, max 24 hours) |
| score | number | No | Score achieved (0-100) |
| attempts | number | Yes | Number of attempts made (1-100) |

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "studentId": "student-123",
    "lessonId": "lesson-intro",
    "completedAt": "2024-11-17T12:00:00.000Z",
    "timeSpent": 600,
    "score": 90,
    "attempts": 2
  },
  "timestamp": "2024-11-17T12:00:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed
  ```json
  {
    "success": false,
    "error": "Validation failed: studentId: Student ID is required and must be a valid string",
    "timestamp": "2024-11-17T12:30:00.000Z"
  }
  ```

**Example**:
```bash
curl -X POST "http://localhost:2000/api/analytics/student-progress" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-123",
    "lessonId": "lesson-intro",
    "timeSpent": 600,
    "score": 90,
    "attempts": 2
  }'
```

---

### 3. Get Student Achievements

Retrieves achievement milestones earned by a student.

**Endpoint**: `GET /api/analytics/achievements`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| studentId | string | Yes | Unique identifier for the student (1-100 characters) |

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "ach-student-123-1",
      "studentId": "student-123",
      "title": "First Steps",
      "description": "Completed your first lesson",
      "category": "milestone",
      "earnedAt": "2024-11-17T12:00:00.000Z"
    },
    {
      "id": "ach-student-123-2",
      "studentId": "student-123",
      "title": "Quick Learner",
      "description": "Completed a lesson in under 10 minutes",
      "category": "speed",
      "earnedAt": "2024-11-17T12:15:00.000Z"
    }
  ],
  "timestamp": "2024-11-17T12:30:00.000Z"
}
```

**Achievement Categories**:
- `milestone`: Major learning milestones
- `speed`: Time-based achievements
- `accuracy`: Score-based achievements
- `consistency`: Regular learning achievements
- `completion`: Completion-based achievements

**Error Responses**:
- `400 Bad Request`: Missing or invalid studentId
  ```json
  {
    "success": false,
    "error": "Student ID is required as a query parameter",
    "timestamp": "2024-11-17T12:30:00.000Z"
  }
  ```

**Example**:
```bash
curl "http://localhost:2000/api/analytics/achievements?studentId=student-123"
```

---

## Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid or missing parameters |
| 405 | Method Not Allowed - HTTP method not supported for this endpoint |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error occurred |

## Error Response Format

All error responses follow this structure:
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2024-11-17T12:30:00.000Z"
}
```

## Data Validation Rules

### Student ID
- Required for all endpoints
- Must be a non-empty string
- Maximum 100 characters
- Alphanumeric characters and hyphens recommended

### Lesson ID
- Required for progress creation
- Must be a non-empty string
- Maximum 100 characters

### Time Spent
- Must be a positive number
- Represents seconds
- Maximum 86,400,000 (24 hours)

### Score
- Optional
- Must be between 0 and 100
- Represents percentage

### Attempts
- Must be a positive integer
- Maximum 100

## Implementation Notes

### Current Implementation
- Uses in-memory storage (data is reset on server restart)
- Rate limiting based on IP address
- No authentication required

### Production Considerations
1. **Database Integration**: Replace in-memory storage with a persistent database (e.g., PostgreSQL, MongoDB)
2. **Authentication**: Implement proper authentication using JWT tokens or OAuth
3. **Authorization**: Add role-based access control
4. **Caching**: Implement Redis or similar for improved performance
5. **Monitoring**: Add logging and monitoring for API usage
6. **Backup**: Implement data backup strategies

## Testing

Run the API tests with:
```bash
npm run test:e2e -- tests/api/analytics.test.ts
```

## Support

For issues or questions, please refer to the main project documentation or open an issue on the repository.

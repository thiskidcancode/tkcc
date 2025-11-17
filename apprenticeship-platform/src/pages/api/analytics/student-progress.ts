// Student Progress API Endpoint
// Tracks and retrieves student learning progress data

import { NextApiRequest, NextApiResponse } from 'next';
import type { StudentProgressRecord, ApiResponse, ValidationError } from '@/types/analytics';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const progressData: Map<string, StudentProgressRecord[]> = new Map();

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

// Validation helpers
function validateStudentId(studentId: unknown): studentId is string {
  return typeof studentId === 'string' && studentId.length > 0 && studentId.length <= 100;
}

function validateLessonId(lessonId: unknown): lessonId is string {
  return typeof lessonId === 'string' && lessonId.length > 0 && lessonId.length <= 100;
}

function validateTimeSpent(timeSpent: unknown): timeSpent is number {
  return typeof timeSpent === 'number' && timeSpent > 0 && timeSpent < 86400000; // Max 24 hours in seconds
}

function validateAttempts(attempts: unknown): attempts is number {
  return typeof attempts === 'number' && attempts > 0 && attempts <= 100;
}

function validateScore(score: unknown): score is number | undefined {
  return score === undefined || (typeof score === 'number' && score >= 0 && score <= 100);
}

function validateProgressData(body: unknown): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be an object' }] };
  }

  const data = body as Record<string, unknown>;

  if (!validateStudentId(data.studentId)) {
    errors.push({ field: 'studentId', message: 'Student ID is required and must be a valid string' });
  }

  if (!validateLessonId(data.lessonId)) {
    errors.push({ field: 'lessonId', message: 'Lesson ID is required and must be a valid string' });
  }

  if (!validateTimeSpent(data.timeSpent)) {
    errors.push({ field: 'timeSpent', message: 'Time spent must be a positive number (in seconds)' });
  }

  if (!validateAttempts(data.attempts)) {
    errors.push({ field: 'attempts', message: 'Attempts must be a positive number' });
  }

  if (!validateScore(data.score)) {
    errors.push({ field: 'score', message: 'Score must be a number between 0 and 100 or undefined' });
  }

  return { valid: errors.length === 0, errors };
}

// Rate limiting check
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// GET handler - Retrieve student progress
function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse<StudentProgressRecord[]>>) {
  const { studentId } = req.query;

  if (!studentId || typeof studentId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Student ID is required as a query parameter',
      timestamp: new Date().toISOString(),
    });
  }

  if (!validateStudentId(studentId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid student ID format',
      timestamp: new Date().toISOString(),
    });
  }

  const records = progressData.get(studentId) || [];

  return res.status(200).json({
    success: true,
    data: records,
    timestamp: new Date().toISOString(),
  });
}

// POST handler - Create new progress record
function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse<StudentProgressRecord>>) {
  const validation = validateProgressData(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: `Validation failed: ${validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')}`,
      timestamp: new Date().toISOString(),
    });
  }

  const { studentId, lessonId, timeSpent, score, attempts } = req.body;

  const progressRecord: StudentProgressRecord = {
    studentId,
    lessonId,
    completedAt: new Date().toISOString(),
    timeSpent,
    score,
    attempts,
  };

  // Store the progress record
  const existingRecords = progressData.get(studentId) || [];
  existingRecords.push(progressRecord);
  progressData.set(studentId, existingRecords);

  return res.status(201).json({
    success: true,
    data: progressRecord,
    timestamp: new Date().toISOString(),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting
  const clientId = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const identifier = Array.isArray(clientId) ? clientId[0] : clientId;

  if (!checkRateLimit(identifier)) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
          timestamp: new Date().toISOString(),
        });
    }
  } catch (error) {
    console.error('Student progress API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}

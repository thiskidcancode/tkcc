// Student Achievements API Endpoint
// Tracks and retrieves student achievement milestones

import { NextApiRequest, NextApiResponse } from 'next';
import type { Achievement, ApiResponse } from '@/types/analytics';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
const achievementsData: Map<string, Achievement[]> = new Map();

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

// Helper to generate achievement based on student progress patterns
function generateAchievements(studentId: string): Achievement[] {
  const now = new Date().toISOString();

  // These are mock achievements - in production, these would be
  // calculated based on actual student progress data
  const mockAchievements: Achievement[] = [
    {
      id: `ach-${studentId}-1`,
      studentId,
      title: 'First Steps',
      description: 'Completed your first lesson',
      category: 'milestone',
      earnedAt: now,
    },
    {
      id: `ach-${studentId}-2`,
      studentId,
      title: 'Quick Learner',
      description: 'Completed a lesson in under 10 minutes',
      category: 'speed',
      earnedAt: now,
    },
    {
      id: `ach-${studentId}-3`,
      studentId,
      title: 'Perfect Score',
      description: 'Achieved 100% on a lesson',
      category: 'accuracy',
      earnedAt: now,
    },
  ];

  return mockAchievements;
}

// Validation helper
function validateStudentId(studentId: unknown): studentId is string {
  return typeof studentId === 'string' && studentId.length > 0 && studentId.length <= 100;
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

// GET handler - Retrieve student achievements
function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse<Achievement[]>>) {
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

  // Get or generate achievements for the student
  let achievements = achievementsData.get(studentId);
  
  if (!achievements) {
    // Generate initial achievements if none exist
    achievements = generateAchievements(studentId);
    achievementsData.set(studentId, achievements);
  }

  return res.status(200).json({
    success: true,
    data: achievements,
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
    if (req.method === 'GET') {
      return handleGet(req, res);
    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Student achievements API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}

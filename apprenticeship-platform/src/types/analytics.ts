// Student Analytics Types
// Defines data structures for student progress tracking and analytics

export interface StudentProgress {
  studentId: string;
  lessonId: string;
  completedAt: Date;
  timeSpent: number;
  score?: number;
  attempts: number;
}

export interface StudentProgressRecord extends Omit<StudentProgress, 'completedAt'> {
  completedAt: string; // ISO string for JSON serialization
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: 'completion' | 'speed' | 'accuracy' | 'consistency' | 'milestone';
  earnedAt: string; // ISO string
  metadata?: Record<string, unknown>;
}

export interface LearningPattern {
  studentId: string;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  averageSessionDuration: number; // in minutes
  completionRate: number; // 0-1
  consistencyScore: number; // 0-100
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface PerformanceMetrics {
  studentId: string;
  totalLessonsCompleted: number;
  averageScore: number;
  averageTimePerLesson: number; // in seconds
  totalTimeSpent: number; // in seconds
  currentStreak: number; // days
  longestStreak: number; // days
  lastActivityDate: string; // ISO string
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

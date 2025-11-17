import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:2000';

test.describe('Student Analytics API - Student Progress Endpoint', () => {
  test.describe('GET /api/analytics/student-progress', () => {
    test('should return 400 when studentId is missing', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/student-progress`);
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Student ID is required');
    });

    test('should return empty array for student with no progress', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/student-progress?studentId=new-student-123`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(0);
      expect(data.timestamp).toBeTruthy();
    });

    test('should return 400 for invalid studentId format', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/student-progress?studentId=`);
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should retrieve progress after creating records', async ({ request }) => {
      const studentId = `test-student-${Date.now()}`;
      
      // Create a progress record
      const createResponse = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId,
          lessonId: 'lesson-1',
          timeSpent: 300,
          score: 85,
          attempts: 1,
        },
      });
      expect(createResponse.status()).toBe(201);
      
      // Retrieve the progress
      const getResponse = await request.get(`${BASE_URL}/api/analytics/student-progress?studentId=${studentId}`);
      expect(getResponse.status()).toBe(200);
      
      const data = await getResponse.json();
      expect(data.success).toBe(true);
      expect(data.data.length).toBe(1);
      expect(data.data[0].studentId).toBe(studentId);
      expect(data.data[0].lessonId).toBe('lesson-1');
      expect(data.data[0].timeSpent).toBe(300);
      expect(data.data[0].score).toBe(85);
      expect(data.data[0].attempts).toBe(1);
    });
  });

  test.describe('POST /api/analytics/student-progress', () => {
    test('should create a progress record with valid data', async ({ request }) => {
      const studentId = `test-student-${Date.now()}`;
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId,
          lessonId: 'lesson-intro',
          timeSpent: 600,
          score: 90,
          attempts: 2,
        },
      });
      
      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.studentId).toBe(studentId);
      expect(data.data.lessonId).toBe('lesson-intro');
      expect(data.data.completedAt).toBeTruthy();
      expect(data.timestamp).toBeTruthy();
    });

    test('should create a progress record without optional score', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId: 'test-student-no-score',
          lessonId: 'lesson-2',
          timeSpent: 450,
          attempts: 1,
        },
      });
      
      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.score).toBeUndefined();
    });

    test('should return 400 when studentId is missing', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          lessonId: 'lesson-1',
          timeSpent: 300,
          attempts: 1,
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Student ID');
    });

    test('should return 400 when lessonId is missing', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId: 'test-student',
          timeSpent: 300,
          attempts: 1,
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Lesson ID');
    });

    test('should return 400 when timeSpent is invalid', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId: 'test-student',
          lessonId: 'lesson-1',
          timeSpent: -100,
          attempts: 1,
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should return 400 when attempts is invalid', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId: 'test-student',
          lessonId: 'lesson-1',
          timeSpent: 300,
          attempts: 0,
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should return 400 when score is out of range', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId: 'test-student',
          lessonId: 'lesson-1',
          timeSpent: 300,
          score: 150,
          attempts: 1,
        },
      });
      
      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should handle multiple progress records for same student', async ({ request }) => {
      const studentId = `multi-lesson-student-${Date.now()}`;
      
      // Create first record
      const response1 = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId,
          lessonId: 'lesson-1',
          timeSpent: 300,
          attempts: 1,
        },
      });
      expect(response1.status()).toBe(201);
      
      // Create second record
      const response2 = await request.post(`${BASE_URL}/api/analytics/student-progress`, {
        data: {
          studentId,
          lessonId: 'lesson-2',
          timeSpent: 400,
          attempts: 2,
        },
      });
      expect(response2.status()).toBe(201);
      
      // Verify both records exist
      const getResponse = await request.get(`${BASE_URL}/api/analytics/student-progress?studentId=${studentId}`);
      const data = await getResponse.json();
      expect(data.data.length).toBe(2);
    });
  });

  test.describe('Method validation', () => {
    test('should return 405 for unsupported methods', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/api/analytics/student-progress`);
      expect(response.status()).toBe(405);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Method not allowed');
    });
  });
});

test.describe('Student Analytics API - Achievements Endpoint', () => {
  test.describe('GET /api/analytics/achievements', () => {
    test('should return 400 when studentId is missing', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/achievements`);
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Student ID is required');
    });

    test('should return achievements for valid studentId', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/achievements?studentId=student-123`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      expect(data.timestamp).toBeTruthy();
      
      // Verify achievement structure
      const achievement = data.data[0];
      expect(achievement.id).toBeTruthy();
      expect(achievement.studentId).toBe('student-123');
      expect(achievement.title).toBeTruthy();
      expect(achievement.description).toBeTruthy();
      expect(achievement.category).toBeTruthy();
      expect(achievement.earnedAt).toBeTruthy();
    });

    test('should return 400 for invalid studentId format', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/analytics/achievements?studentId=`);
      expect(response.status()).toBe(400);
      
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should return consistent achievements for same student', async ({ request }) => {
      const studentId = 'consistent-student';
      
      const response1 = await request.get(`${BASE_URL}/api/analytics/achievements?studentId=${studentId}`);
      const data1 = await response1.json();
      
      const response2 = await request.get(`${BASE_URL}/api/analytics/achievements?studentId=${studentId}`);
      const data2 = await response2.json();
      
      expect(data1.data.length).toBe(data2.data.length);
    });
  });

  test.describe('Method validation', () => {
    test('should return 405 for POST method', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/analytics/achievements`, {
        data: { studentId: 'test' },
      });
      expect(response.status()).toBe(405);
      
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('Method not allowed');
    });

    test('should return 405 for unsupported methods', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/api/analytics/achievements`);
      expect(response.status()).toBe(405);
    });
  });
});

test.describe('Rate Limiting', () => {
  test('should handle normal request load', async ({ request }) => {
    const studentId = 'rate-test-student';
    
    // Make several requests that should all succeed
    for (let i = 0; i < 5; i++) {
      const response = await request.get(`${BASE_URL}/api/analytics/student-progress?studentId=${studentId}`);
      expect(response.status()).toBe(200);
    }
  });
});

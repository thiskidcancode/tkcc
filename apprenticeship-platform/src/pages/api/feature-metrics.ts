// Feature flag analytics API endpoint
// Provides real-time metrics for dashboard

import { NextApiRequest, NextApiResponse } from 'next';

interface FeatureMetrics {
  activeUsers: number;
  errorRate: number;
  avgResponseTime: string;
  satisfactionScore: number;
  adoptionRate: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  ageGroupBreakdown: {
    '11-13': number;
    '14-16': number;
    '17-18': number;
  };
  questLevelBreakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

// Mock data - replace with actual metrics collection
const generateMetrics = (): Record<string, FeatureMetrics> => ({
  'ai-coding-assistant': {
    activeUsers: 1250,
    errorRate: 0.02,
    avgResponseTime: '1.2s',
    satisfactionScore: 4.7,
    adoptionRate: 0.85,
    circuitBreakerState: 'CLOSED',
    ageGroupBreakdown: { '11-13': 320, '14-16': 680, '17-18': 250 },
    questLevelBreakdown: { beginner: 400, intermediate: 550, advanced: 300 }
  },
  'github-integration': {
    activeUsers: 450,
    errorRate: 0.01,
    avgResponseTime: '2.1s',
    satisfactionScore: 4.9,
    adoptionRate: 0.65,
    circuitBreakerState: 'CLOSED',
    ageGroupBreakdown: { '11-13': 0, '14-16': 180, '17-18': 270 },
    questLevelBreakdown: { beginner: 0, intermediate: 150, advanced: 300 }
  },
  'peer-code-review': {
    activeUsers: 680,
    errorRate: 0.05,
    avgResponseTime: '0.8s',
    satisfactionScore: 4.3,
    adoptionRate: 0.72,
    circuitBreakerState: 'CLOSED',
    ageGroupBreakdown: { '11-13': 0, '14-16': 420, '17-18': 260 },
    questLevelBreakdown: { beginner: 0, intermediate: 280, advanced: 400 }
  },
  'coding-hints': {
    activeUsers: 2100,
    errorRate: 0.008,
    avgResponseTime: '0.3s',
    satisfactionScore: 4.8,
    adoptionRate: 0.95,
    circuitBreakerState: 'CLOSED',
    ageGroupBreakdown: { '11-13': 850, '14-16': 780, '17-18': 470 },
    questLevelBreakdown: { beginner: 1200, intermediate: 600, advanced: 300 }
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metrics = generateMetrics();
    
    // Add timestamp for real-time updates
    const response = {
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        totalActiveUsers: Object.values(metrics).reduce((sum, m) => sum + m.activeUsers, 0),
        avgSatisfactionScore: Object.values(metrics).reduce((sum, m) => sum + m.satisfactionScore, 0) / Object.keys(metrics).length,
        featuresWithIssues: Object.entries(metrics).filter(([_, m]) => m.errorRate > 0.03 || m.circuitBreakerState !== 'CLOSED').length
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Feature metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
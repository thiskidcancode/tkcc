// Tests for FeatureFlagDashboard.tsx
// Testing feature flag analytics dashboard component

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FeatureFlagDashboard from '../FeatureFlagDashboard';

// Mock fetch globally
global.fetch = jest.fn();

const mockDashboardData = {
  timestamp: '2024-01-15T10:30:00.000Z',
  metrics: {
    'ai-coding-assistant': {
      activeUsers: 1250,
      errorRate: 0.02,
      avgResponseTime: '1.2s',
      satisfactionScore: 4.7,
      adoptionRate: 0.85,
      circuitBreakerState: 'CLOSED' as const,
      ageGroupBreakdown: {
        '11-13': 320,
        '14-16': 680,
        '17-18': 250
      },
      questLevelBreakdown: {
        beginner: 400,
        intermediate: 550,
        advanced: 300
      }
    },
    'github-integration': {
      activeUsers: 450,
      errorRate: 0.01,
      avgResponseTime: '2.1s',
      satisfactionScore: 4.9,
      adoptionRate: 0.65,
      circuitBreakerState: 'CLOSED' as const,
      ageGroupBreakdown: {
        '11-13': 0,
        '14-16': 180,
        '17-18': 270
      },
      questLevelBreakdown: {
        beginner: 0,
        intermediate: 150,
        advanced: 300
      }
    },
    'peer-code-review': {
      activeUsers: 680,
      errorRate: 0.05,
      avgResponseTime: '0.8s',
      satisfactionScore: 4.3,
      adoptionRate: 0.72,
      circuitBreakerState: 'CLOSED' as const,
      ageGroupBreakdown: {
        '11-13': 0,
        '14-16': 420,
        '17-18': 260
      },
      questLevelBreakdown: {
        beginner: 0,
        intermediate: 280,
        advanced: 400
      }
    }
  },
  summary: {
    totalActiveUsers: 2380,
    avgSatisfactionScore: 4.633333333333333,
    featuresWithIssues: 1
  }
};

describe('FeatureFlagDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockDashboardData
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Initial Rendering', () => {
    it('should display loading state initially', () => {
      render(<FeatureFlagDashboard />);
      expect(screen.getByText(/Loading feature metrics/i)).toBeInTheDocument();
    });

    it('should fetch and display dashboard data', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Feature Flag Analytics Dashboard/i)).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/feature-metrics');
    });

    it('should display error state when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load metrics/i)).toBeInTheDocument();
      });
    });
  });

  describe('Summary Cards', () => {
    it('should display total active users', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Total Active Users/i)).toBeInTheDocument();
        expect(screen.getByText('2,380')).toBeInTheDocument();
      });
    });

    it('should display average satisfaction score', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Avg Satisfaction/i)).toBeInTheDocument();
        expect(screen.getByText(/4\.6\/5\.0/i)).toBeInTheDocument();
      });
    });

    it('should display features with issues count', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Features with Issues/i)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });

    it('should style features with issues count in red', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const issuesElement = screen.getByText('1');
        expect(issuesElement).toHaveClass('text-red-600');
      });
    });

    it('should style zero issues count in green', async () => {
      const noIssuesData = {
        ...mockDashboardData,
        summary: { ...mockDashboardData.summary, featuresWithIssues: 0 }
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => noIssuesData
      });

      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const issuesElement = screen.getByText('0');
        expect(issuesElement).toHaveClass('text-green-600');
      });
    });
  });

  describe('Feature Selection', () => {
    it('should have a feature selector dropdown', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });
    });

    it('should display all available features in dropdown', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(within(select).getByText(/ai coding assistant/i)).toBeInTheDocument();
        expect(within(select).getByText(/github integration/i)).toBeInTheDocument();
        expect(within(select).getByText(/peer code review/i)).toBeInTheDocument();
      });
    });

    it('should change displayed metrics when feature is selected', async () => {
      const user = userEvent.setup();
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'github-integration');

      await waitFor(() => {
        expect(screen.getByText('450')).toBeInTheDocument(); // github-integration active users
      });
    });
  });

  describe('Feature Details', () => {
    it('should display active users for selected feature', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Active Users:/i)).toBeInTheDocument();
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });
    });

    it('should display error rate for selected feature', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Error Rate:/i)).toBeInTheDocument();
        expect(screen.getByText('2.00%')).toBeInTheDocument();
      });
    });

    it('should display error rate in red when above threshold', async () => {
      const highErrorData = {
        ...mockDashboardData,
        metrics: {
          ...mockDashboardData.metrics,
          'ai-coding-assistant': {
            ...mockDashboardData.metrics['ai-coding-assistant'],
            errorRate: 0.06 // Above 5% threshold
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => highErrorData
      });

      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const errorRate = screen.getByText('6.00%');
        expect(errorRate).toHaveClass('text-red-600');
      });
    });

    it('should display error rate in green when below threshold', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const errorRate = screen.getByText('2.00%');
        expect(errorRate).toHaveClass('text-green-600');
      });
    });

    it('should display average response time', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Avg Response Time:/i)).toBeInTheDocument();
        expect(screen.getByText('1.2s')).toBeInTheDocument();
      });
    });

    it('should display satisfaction score', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Satisfaction Score:/i)).toBeInTheDocument();
        expect(screen.getByText('4.7/5.0')).toBeInTheDocument();
      });
    });

    it('should display circuit breaker state', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Circuit Breaker:/i)).toBeInTheDocument();
        expect(screen.getByText('CLOSED')).toBeInTheDocument();
      });
    });

    it('should style circuit breaker state appropriately', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        const closedState = screen.getByText('CLOSED');
        expect(closedState).toHaveClass('bg-green-100');
        expect(closedState).toHaveClass('text-green-800');
      });
    });
  });

  describe('Charts and Visualizations', () => {
    it('should render feature overview chart', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Feature Adoption & Satisfaction/i)).toBeInTheDocument();
      });
    });

    it('should render age group distribution chart', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Age Group Distribution/i)).toBeInTheDocument();
      });
    });
  });

  describe('Educational Insights', () => {
    it('should display safety metrics', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Safety Metrics/i)).toBeInTheDocument();
        expect(screen.getByText(/COPPA compliance/i)).toBeInTheDocument();
      });
    });

    it('should display learning outcomes', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/Learning Outcomes/i)).toBeInTheDocument();
        expect(screen.getByText(/Quest completion rate/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should refresh data every 30 seconds', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should cleanup interval on unmount', async () => {
      const { unmount } = render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Fast-forward time after unmount
      jest.advanceTimersByTime(60000);

      // Should not call fetch again after unmount
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data formatting', () => {
    it('should format large numbers with commas', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText('2,380')).toBeInTheDocument();
        expect(screen.getByText('1,250')).toBeInTheDocument();
      });
    });

    it('should format percentages to 2 decimal places', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText('2.00%')).toBeInTheDocument();
      });
    });

    it('should format satisfaction scores to 1 decimal place', async () => {
      render(<FeatureFlagDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/4\.6\/5\.0/i)).toBeInTheDocument();
      });
    });
  });
});

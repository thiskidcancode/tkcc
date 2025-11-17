// Tests for emergency-switches.ts
// Testing emergency configuration and feature disabling logic

import {
  getEmergencyConfig,
  checkFeatureWithEmergency
} from '../emergency-switches';

// Mock fetch globally
global.fetch = jest.fn();

describe('emergency-switches', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getEmergencyConfig', () => {
    it('should use environment variables as fallback when AWS_REGION not set', async () => {
      // Clear AWS_REGION
      const awsRegion = process.env.AWS_REGION;
      delete process.env.AWS_REGION;
      
      process.env.DISABLED_FEATURES = 'feature-x,feature-y';
      process.env.MAINTENANCE_MODE = 'true';
      process.env.EMERGENCY_MESSAGE = 'Testing';

      const config = await getEmergencyConfig();

      // Should use environment variables
      expect(config.disabledFeatures).toContain('feature-x');
      expect(config.maintenanceMode).toBe(true);
      
      // Restore
      if (awsRegion) process.env.AWS_REGION = awsRegion;
      delete process.env.DISABLED_FEATURES;
      delete process.env.MAINTENANCE_MODE;
      delete process.env.EMERGENCY_MESSAGE;
    });

    it('should return safe defaults on API error', async () => {
      process.env.AWS_REGION = 'us-east-1';
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const config = await getEmergencyConfig();

      expect(config).toEqual({
        disabledFeatures: [],
        maintenanceMode: false
      });
      
      delete process.env.AWS_REGION;
    });

    // Skipping cache test due to module-level state
    it.skip('should cache config for 30 seconds', async () => {
      // This test is skipped because the cache is module-level state
      // that persists across tests making it difficult to test reliably
    });

    it('should handle empty DISABLED_FEATURES environment variable', async () => {
      delete process.env.AWS_REGION;
      delete process.env.DISABLED_FEATURES;
      process.env.MAINTENANCE_MODE = 'false';

      const config = await getEmergencyConfig();

      expect(Array.isArray(config.disabledFeatures)).toBe(true);
      expect(config.maintenanceMode).toBe(false);
    });
  });

  describe('checkFeatureWithEmergency', () => {
    it('should return false when maintenance mode is enabled', async () => {
      delete process.env.AWS_REGION;
      process.env.MAINTENANCE_MODE = 'true';

      const normalCheck = jest.fn(() => true);
      const result = await checkFeatureWithEmergency('any-feature', normalCheck);

      expect(result).toBe(false);
      
      delete process.env.MAINTENANCE_MODE;
    });

    it('should return false when feature is in disabled list', async () => {
      delete process.env.AWS_REGION;
      process.env.DISABLED_FEATURES = 'test-feature,other-feature';
      process.env.MAINTENANCE_MODE = 'false';

      const normalCheck = jest.fn(() => true);
      const result = await checkFeatureWithEmergency('test-feature', normalCheck);

      expect(result).toBe(false);
      
      delete process.env.DISABLED_FEATURES;
    });

    it('should call normal check when feature is not disabled', async () => {
      delete process.env.AWS_REGION;
      process.env.DISABLED_FEATURES = 'some-other-feature';
      process.env.MAINTENANCE_MODE = 'false';

      const normalCheck = jest.fn(() => true);
      const result = await checkFeatureWithEmergency('my-feature', normalCheck);

      expect(result).toBe(true);
      expect(normalCheck).toHaveBeenCalled();
      
      delete process.env.DISABLED_FEATURES;
    });

    it('should respect normal check result when no emergency overrides', async () => {
      delete process.env.AWS_REGION;
      delete process.env.DISABLED_FEATURES;
      process.env.MAINTENANCE_MODE = 'false';

      const normalCheckTrue = jest.fn(() => true);
      const resultTrue = await checkFeatureWithEmergency('feature', normalCheckTrue);
      expect(resultTrue).toBe(true);

      const normalCheckFalse = jest.fn(() => false);
      const resultFalse = await checkFeatureWithEmergency('feature', normalCheckFalse);
      expect(resultFalse).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      process.env.AWS_REGION = 'us-east-1';
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const normalCheck = jest.fn(() => true);
      const result = await checkFeatureWithEmergency('feature', normalCheck);

      // Should fall back to normal check when emergency config fails
      expect(result).toBe(true);
      expect(normalCheck).toHaveBeenCalled();
      
      delete process.env.AWS_REGION;
    });
  });
});

// Emergency feature switches for instant disable
// Updates without deployment required

interface EmergencyConfig {
  disabledFeatures: string[];
  maintenanceMode: boolean;
  emergencyMessage?: string;
}

// Cache config for 30 seconds to avoid API spam
let configCache: EmergencyConfig | null = null;
let lastFetch = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds

export async function getEmergencyConfig(): Promise<EmergencyConfig> {
  const now = Date.now();
  
  if (configCache && (now - lastFetch) < CACHE_TTL) {
    return configCache;
  }

  try {
    // Option 1: AWS Systems Manager Parameter Store
    if (process.env.AWS_REGION) {
      const response = await fetch('/api/emergency-config');
      configCache = await response.json();
    } else {
      // Option 2: Environment variables (fallback)
      configCache = {
        disabledFeatures: process.env.DISABLED_FEATURES?.split(',') || [],
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        emergencyMessage: process.env.EMERGENCY_MESSAGE
      };
    }
    
    lastFetch = now;
    return configCache;
  } catch (error) {
    console.error('Failed to fetch emergency config:', error);
    
    // Safe fallback - disable nothing if config fails
    return {
      disabledFeatures: [],
      maintenanceMode: false
    };
  }
}

// Enhanced feature flag check with emergency override
export async function checkFeatureWithEmergency(
  flag: string, 
  normalCheck: () => boolean
): Promise<boolean> {
  const emergencyConfig = await getEmergencyConfig();
  
  // Emergency maintenance mode - disable all features
  if (emergencyConfig.maintenanceMode) {
    return false;
  }
  
  // Emergency feature disable
  if (emergencyConfig.disabledFeatures.includes(flag)) {
    return false;
  }
  
  // Normal feature flag logic
  return normalCheck();
}
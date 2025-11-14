// Feature flags for ThisKidCanCode apprenticeship platform
// Age-appropriate and progress-based feature rollouts

export interface FeatureFlags {
  // Core learning features
  'coding-hints': boolean;
  'ai-coding-assistant': boolean;
  'step-by-step-debugging': boolean;
  
  // Social/collaborative features  
  'peer-code-review': boolean;
  'community-challenges': boolean;
  'mentor-chat': boolean;
  
  // Advanced features
  'github-integration': boolean;
  'open-source-contributions': boolean;
  'advanced-algorithms': boolean;
  
  // Experimental features
  'new-quest-flow': boolean;
  'gamification-v2': boolean;
}

export interface User {
  age: number;
  questsCompleted: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  parentalConsent: boolean;
}

// Age-appropriate feature configuration
const AGE_GATES: Record<keyof FeatureFlags, number> = {
  'coding-hints': 11,
  'ai-coding-assistant': 12,
  'step-by-step-debugging': 13,
  'peer-code-review': 14,
  'community-challenges': 14,
  'mentor-chat': 15,
  'github-integration': 16,
  'open-source-contributions': 17,
  'advanced-algorithms': 16,
  'new-quest-flow': 11,
  'gamification-v2': 11,
};

// Progress-based requirements
const PROGRESS_GATES: Record<keyof FeatureFlags, number> = {
  'coding-hints': 0,
  'ai-coding-assistant': 5,
  'step-by-step-debugging': 10,
  'peer-code-review': 25,
  'community-challenges': 15,
  'mentor-chat': 20,
  'github-integration': 30,
  'open-source-contributions': 50,
  'advanced-algorithms': 40,
  'new-quest-flow': 0,
  'gamification-v2': 0,
};

export function useFeatureFlag(flag: keyof FeatureFlags, user: User): boolean {
  // Environment-based overrides
  const environment = process.env.NODE_ENV;
  const envOverride = process.env[`FEATURE_${flag.toUpperCase().replace('-', '_')}`];
  
  if (envOverride !== undefined) {
    return envOverride === 'true';
  }

  // Safety checks for minors
  if (user.age < 13) {
    // COPPA compliance - limited features for under-13
    const allowedForMinors: (keyof FeatureFlags)[] = [
      'coding-hints',
      'new-quest-flow',
      'gamification-v2'
    ];
    
    if (!allowedForMinors.includes(flag)) {
      return false;
    }
  }

  // Age gate check
  if (user.age < AGE_GATES[flag]) {
    return false;
  }

  // Progress gate check
  if (user.questsCompleted < PROGRESS_GATES[flag]) {
    return false;
  }

  // Parental consent required for social features
  const socialFeatures: (keyof FeatureFlags)[] = [
    'peer-code-review',
    'community-challenges', 
    'mentor-chat'
  ];
  
  if (socialFeatures.includes(flag) && !user.parentalConsent) {
    return false;
  }

  // Default to enabled if all checks pass
  return true;
}

// React hook for components
export function useFeatureFlags(user: User) {
  const flags = {} as Record<keyof FeatureFlags, boolean>;
  
  (Object.keys(AGE_GATES) as (keyof FeatureFlags)[]).forEach(flag => {
    flags[flag] = useFeatureFlag(flag, user);
  });
  
  return flags;
}

// Educational progression helper
// Circuit Breaker Pattern for external service protection
interface CircuitBreakerConfig {
  errorThreshold: number;  // Error rate to trip breaker (0.05 = 5%)
  timeWindow: number;      // Time window in seconds
  minRequests: number;     // Minimum requests before evaluation
  recoveryTimeout: number; // Seconds before attempting recovery
}

const CIRCUIT_BREAKERS: Record<keyof FeatureFlags, CircuitBreakerConfig> = {
  'ai-coding-assistant': { errorThreshold: 0.05, timeWindow: 300, minRequests: 10, recoveryTimeout: 60 },
  'github-integration': { errorThreshold: 0.03, timeWindow: 180, minRequests: 5, recoveryTimeout: 120 },
  'peer-code-review': { errorThreshold: 0.10, timeWindow: 600, minRequests: 3, recoveryTimeout: 300 },
  // Core learning features - more tolerant
  'coding-hints': { errorThreshold: 0.15, timeWindow: 300, minRequests: 20, recoveryTimeout: 30 },
  'step-by-step-debugging': { errorThreshold: 0.10, timeWindow: 300, minRequests: 15, recoveryTimeout: 60 },
  // Social features - less critical, more tolerant
  'community-challenges': { errorThreshold: 0.20, timeWindow: 600, minRequests: 5, recoveryTimeout: 600 },
  'mentor-chat': { errorThreshold: 0.05, timeWindow: 300, minRequests: 3, recoveryTimeout: 300 },
  // Advanced features - strict requirements
  'open-source-contributions': { errorThreshold: 0.02, timeWindow: 300, minRequests: 3, recoveryTimeout: 900 },
  'advanced-algorithms': { errorThreshold: 0.10, timeWindow: 300, minRequests: 10, recoveryTimeout: 180 },
  // Experimental features - moderate tolerance
  'new-quest-flow': { errorThreshold: 0.08, timeWindow: 300, minRequests: 10, recoveryTimeout: 120 },
  'gamification-v2': { errorThreshold: 0.12, timeWindow: 300, minRequests: 15, recoveryTimeout: 90 },
};

// Circuit breaker state management
interface CircuitState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  requests: number;
  lastFailureTime: number;
  windowStart: number;
}

const circuitStates = new Map<keyof FeatureFlags, CircuitState>();

export function checkCircuitBreaker(flag: keyof FeatureFlags): boolean {
  const config = CIRCUIT_BREAKERS[flag];
  if (!config) return true; // No circuit breaker configured
  
  const now = Date.now();
  let state = circuitStates.get(flag);
  
  if (!state) {
    state = {
      state: 'CLOSED',
      failures: 0,
      requests: 0,
      lastFailureTime: 0,
      windowStart: now
    };
    circuitStates.set(flag, state);
  }
  
  // Reset window if expired
  if (now - state.windowStart > config.timeWindow * 1000) {
    state.failures = 0;
    state.requests = 0;
    state.windowStart = now;
  }
  
  switch (state.state) {
    case 'OPEN':
      // Check if recovery timeout has passed
      if (now - state.lastFailureTime > config.recoveryTimeout * 1000) {
        state.state = 'HALF_OPEN';
        return true; // Allow one request to test
      }
      return false; // Circuit is open, block requests
      
    case 'HALF_OPEN':
      return true; // Allow request to test recovery
      
    case 'CLOSED':
    default:
      return true; // Normal operation
  }
}

export function recordCircuitBreakerResult(flag: keyof FeatureFlags, success: boolean): void {
  const config = CIRCUIT_BREAKERS[flag];
  if (!config) return;
  
  const state = circuitStates.get(flag);
  if (!state) return;
  
  state.requests++;
  
  if (!success) {
    state.failures++;
    state.lastFailureTime = Date.now();
    
    // Check if we should trip the breaker
    if (state.requests >= config.minRequests) {
      const errorRate = state.failures / state.requests;
      if (errorRate >= config.errorThreshold) {
        state.state = 'OPEN';
        console.warn(`Circuit breaker OPEN for ${flag}: ${errorRate.toFixed(2)} error rate`);
      }
    }
  } else if (state.state === 'HALF_OPEN') {
    // Success in half-open state, close the circuit
    state.state = 'CLOSED';
    state.failures = 0;
    state.requests = 0;
    console.info(`Circuit breaker CLOSED for ${flag}: Recovery successful`);
  }
}

// Enhanced feature flag check with circuit breaker
export function useFeatureFlagWithCircuitBreaker(flag: keyof FeatureFlags, user: User): boolean {
  // First check normal feature flag logic
  const normalCheck = useFeatureFlag(flag, user);
  if (!normalCheck) return false;
  
  // Then check circuit breaker
  return checkCircuitBreaker(flag);
}

export function getNextUnlockedFeatures(user: User): Array<{
  feature: keyof FeatureFlags;
  requirement: string;
  questsNeeded?: number;
}> {
  const nextFeatures: Array<{
    feature: keyof FeatureFlags;
    requirement: string;
    questsNeeded?: number;
  }> = [];

  (Object.keys(AGE_GATES) as (keyof FeatureFlags)[]).forEach(flag => {
    if (!useFeatureFlag(flag, user)) {
      const ageRequired = AGE_GATES[flag];
      const questsRequired = PROGRESS_GATES[flag];
      
      if (user.age >= ageRequired && user.questsCompleted < questsRequired) {
        nextFeatures.push({
          feature: flag,
          requirement: `Complete ${questsRequired - user.questsCompleted} more quests`,
          questsNeeded: questsRequired - user.questsCompleted
        });
      } else if (user.age < ageRequired) {
        nextFeatures.push({
          feature: flag,
          requirement: `Available when you turn ${ageRequired}`
        });
      }
    }
  });

  return nextFeatures.sort((a, b) => (a.questsNeeded || 999) - (b.questsNeeded || 999));
}
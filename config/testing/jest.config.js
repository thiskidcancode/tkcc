const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './apprenticeship-platform',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/config/testing/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Coverage configuration for government compliance
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/out/**',
  ],
  
  // Coverage thresholds for different components
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    },
    // Security-critical components require higher coverage
    './apprenticeship-platform/src/security/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    // Student data handling (FERPA compliance)
    './apprenticeship-platform/src/student-data/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    // Authentication and authorization
    './apprenticeship-platform/src/auth/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  
  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/apprenticeship-platform/src/$1',
    '^@marketing/(.*)$': '<rootDir>/marketing-site/src/$1',
    '^@curriculum/(.*)$': '<rootDir>/curriculum/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Setup files
  setupFiles: ['<rootDir>/config/testing/jest.env.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
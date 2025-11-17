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
    'apprenticeship-platform/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/out/**',
  ],
  
  // Test patterns - look for test files in apprenticeship-platform
  testMatch: [
    '<rootDir>/apprenticeship-platform/src/**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)',
    '<rootDir>/apprenticeship-platform/src/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apprenticeship-platform/src/$1',
    '^@marketing/(.*)$': '<rootDir>/marketing-site/src/$1',
    '^@curriculum/(.*)$': '<rootDir>/curriculum/$1',
  },
  
  // Setup files
  setupFiles: ['<rootDir>/config/testing/jest.env.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

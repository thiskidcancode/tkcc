// Environment setup for Jest tests
process.env.NODE_ENV = 'test'

// Mock environment variables for testing
process.env.NEXT_PUBLIC_APP_ENV = 'test'
process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = 'test-github-client-id'
process.env.GITHUB_CLIENT_SECRET = 'test-github-secret'
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Database mocking
process.env.DATABASE_URL = 'sqlite://memory'

// AWS mocking for infrastructure tests
process.env.AWS_REGION = 'us-east-1'
process.env.AWS_ACCESS_KEY_ID = 'test-access-key'
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key'
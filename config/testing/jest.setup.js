import '@testing-library/jest-dom'
import React from 'react'

// Mock recharts
jest.mock('recharts', () => ({
  BarChart: (props) => React.createElement('div', { 'data-testid': 'bar-chart' }, props.children),
  Bar: () => React.createElement('div', { 'data-testid': 'bar' }),
  XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
  CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
  Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
  ResponsiveContainer: (props) => React.createElement('div', { 'data-testid': 'responsive-container' }, props.children),
  PieChart: (props) => React.createElement('div', { 'data-testid': 'pie-chart' }, props.children),
  Pie: () => React.createElement('div', { 'data-testid': 'pie' }),
  Cell: () => React.createElement('div', { 'data-testid': 'cell' })
}), { virtual: true })

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock GitHub API for testing
global.fetch = jest.fn()

// Mock environment variables for testing
process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = 'test-client-id'
process.env.GITHUB_CLIENT_SECRET = 'test-client-secret'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Console error suppression for known issues
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
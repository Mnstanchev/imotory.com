const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
  testTimeout: 30000,
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/helpers/',
    '<rootDir>/__tests__/setup.ts',
    '<rootDir>/__tests__/test-server.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(next-auth)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
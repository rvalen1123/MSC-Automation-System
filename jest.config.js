module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // File extensions to be considered as tests
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // Transforms
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      isolatedModules: true
    }]
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Coverage
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Environment variables
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 30000,
  
  // Files to exclude from tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/test.ts'
  ]
}; 
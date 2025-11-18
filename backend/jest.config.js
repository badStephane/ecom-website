export default {
  testEnvironment: 'node',
  testMatch: ['**/src/__tests__/**/*.js', '**/src/**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  transform: {},
  testPathIgnorePatterns: ['/node_modules/', '/test/'],
};

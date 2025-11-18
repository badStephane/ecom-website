import baseConfig from './jest.config.cjs';

export default {
  ...baseConfig,
  testMatch: ['**/test/unit/**/*.test.js'],
  setupFilesAfterEnv: ['./test/setup.unit.js'],
  testTimeout: 10000,
};

import baseConfig from './jest.config.cjs';

export default {
  ...baseConfig,
  testMatch: ['**/test/integration/**/*.test.js'],
  setupFilesAfterEnv: ['./test/setup.integration.js'],
  testTimeout: 15000, // Un peu plus de temps pour les tests d'intégration
};

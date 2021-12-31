/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testEnvironment: 'node',
  modulePaths: ['server/'],
  globalSetup: '<rootDir>/.jest/globalSetup.ts',
  setupFilesAfterEnv: ['<rootDir>/.jest/setupFile.ts'],
  maxConcurrency: 1,
}

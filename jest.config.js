/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['server/'],
  globalSetup: '<rootDir>/.jest/globalSetup.ts',
  setupFilesAfterEnv: ['<rootDir>/.jest/setupFile.ts'],
  maxConcurrency: 1,
}

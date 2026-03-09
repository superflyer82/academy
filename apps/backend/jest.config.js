/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@maengelmelder/shared-types$': '<rootDir>/../../packages/shared-types/src',
  },
  setupFilesAfterFramework: [],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/prisma/seed.ts', '!src/index.ts'],
};

export default {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    url: 'http://localhost',
  },
  transform: {
    '\\.(js|jsx|ts|tsx|vue)$': ['./test/jest.transformer.cjs'],
  },
  setupFiles: ['./test/setup.cjs', 'jest-canvas-mock'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'jsx', 'vue', 'ts', 'tsx'],
  setupFilesAfterEnv: ['./test/setupAfterEnv.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-html'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    '!src/**/*.stories.{js,jsx,ts,tsx,vue}',
    '!**/__test__/**',
  ],
  maxWorkers: '50%',
  coverageReporters: ['html', 'lcov', 'text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};

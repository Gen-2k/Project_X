module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!main.ts', '!**/*.module.ts', '!**/*.dto.ts'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 70,
      functions: 85,
      lines: 85,
    },
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
  },
};

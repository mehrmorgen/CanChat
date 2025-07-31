/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'command',
  commandRunner: {
    command: 'bun test --timeout 1000'
  },
  coverageAnalysis: 'off',
  mutate: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  thresholds: {
    high: 90,
    low: 70,
    break: 60
  },
  timeoutMS: 1000,
  timeoutFactor: 1.5,
  maxConcurrentTestRunners: 2,
  tempDirName: 'stryker-tmp',
  cleanTempDir: true,
  logLevel: 'info',
  fileLogLevel: 'off',
  plugins: [
    '@stryker-mutator/javascript-mutator'
  ]
};

export default config;
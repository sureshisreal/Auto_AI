const tseslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'reports/**',
      'screenshots/**',
      'videos/**',
      'traces/**',
      'logs/**',
      'downloads/**',
      'playwright-report/**',
      'test-results/**',
      'demo/**',
      '**/*.js'
    ]
  },
  ...tseslint.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
];

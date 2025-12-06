/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-empty': 0,
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_|err' }],
    'no-case-declarations': 'off',
    'no-async-promise-executor': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'no-const-assign': 'error',
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-undef': 'warn',
    'no-redeclare': ['off', { builtinGlobals: true }],
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': ['error', { singleQuote: true }],
    semi: ['error', 'never'],
    'no-console': [
      'off',
      {
        allow: ['warn', 'error', 'info', 'debug'],
      },
    ],
    'no-mixed-spaces-and-tabs': 'off',
  },
}

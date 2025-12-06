import prettier from 'eslint-plugin-prettier'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    ...compat.extends('eslint:recommended'),
    {
        plugins: {
            prettier,
            jest,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            ecmaVersion: 2024,
            sourceType: 'module',
        },

        rules: {
            'no-empty': 0,
            'arrow-parens': ['error', 'as-needed'],

            'no-unused-vars': [
                'warn',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_|err',
                },
            ],

            'no-case-declarations': 'off',
            'no-async-promise-executor': 'warn',
            'comma-dangle': [0],
            'no-const-assign': 'error',

            'prefer-const': [
                'error',
                {
                    destructuring: 'all',
                },
            ],

            'no-undef': 'warn',

            'no-redeclare': [
                'off',
                {
                    builtinGlobals: true,
                },
            ],

            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                },
            ],

            semi: ['error', 'never'],

            'no-console': [
                'off',
                {
                    allow: ['warn', 'error', 'info', 'debug'],
                },
            ],

            'no-mixed-spaces-and-tabs': 'off',
            'linebreak-style': 0,
        },
    },
]

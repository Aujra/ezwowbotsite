import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import @typescript-eslint/parser directly
import * as tsParser from '@typescript-eslint/parser';

export default [
  // Base JavaScript and TypeScript rules
  js.configs.recommended,

  // General TypeScript and Next.js rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser, // Use the correct parser object
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Import/export rules
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],

      // Next.js-specific rules
      '@next/next/no-html-link-for-pages': 'error',
      'react/react-in-jsx-scope': 'off', // React is auto-imported in Next.js
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          paths: ['./src'],
        },
      },
    },
  },

  // Special handling for `next.config.ts`
  {
    files: ['next.config.ts'],
    languageOptions: {
      parser: tsParser, // Use the correct parser object
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        tsconfigRootDir: __dirname, // Resolve `tsconfig.json` relative to this file
      },
    },
    rules: {
      'no-undef': 'off', // Disable false positives for global variables
      '@typescript-eslint/no-var-requires': 'off', // Allow `require` in the config file
    },
  },

  // Prettier configuration (disables conflicting ESLint rules)
  prettier,
];

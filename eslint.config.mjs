import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import * as tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['.next/**', 'node_modules/**'], // Ignore build and node_modules directories
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
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
      'prettier/prettier': 'error',
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
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
      '@next/next/no-html-link-for-pages': 'error',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          paths: ['./app'], // Adjust based on your project structure
        },
      },
    },
  },
  prettier,
];

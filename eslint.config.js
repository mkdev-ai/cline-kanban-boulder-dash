import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
  // Base recommended rules from ESLint core
  eslint.configs.recommended,

  // TypeScript-ESLint recommended + type-checked rules
  ...tseslint.configs.recommendedTypeChecked,

  // Global settings for all TypeScript source files
  {
    files: ['src/**/*.ts'],

    languageOptions: {
      globals: {
        // Browser + ES2022 globals (replaces env: { browser: true, es2022: true })
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // ── Prettier ───────────────────────────────────────────────────────────
      // Disable style rules that conflict with Prettier, then enforce Prettier
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // ── No `any` ───────────────────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // ── Explicit return types on public API ────────────────────────────────
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],

      // ── Consistent naming ──────────────────────────────────────────────────
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
      ],

      // ── No unused vars ─────────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // ── Misc quality ───────────────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
);
